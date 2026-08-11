from __future__ import annotations

import hashlib
import json
import subprocess
from pathlib import Path
from typing import Any

ROOT = Path(__file__).resolve().parents[2]
AUDIO_ROOT = ROOT / ".audio"
WORK = AUDIO_ROOT / "work"
REPORTS = AUDIO_ROOT / "reports"
VOICES = AUDIO_ROOT / "voices"
PUBLIC_AUDIO = ROOT / "public" / "audio"
PUBLIC_REVIEW_AUDIO = ROOT / "public" / "audio-review"
REVIEW_AUDIO = ROOT / "docs" / "reviews" / "audio"
QUEUE = ROOT / "docs" / "reviews" / "audio-recording-queue.json"
CONFIG_PATH = ROOT / "scripts" / "audio" / "config.json"
MANIFEST_DATA = ROOT / "src" / "audio" / "approved.generated.json"
REVIEW_MANIFEST_DATA = ROOT / "src" / "audio" / "review.generated.json"


def load_json(path: Path) -> Any:
    return json.loads(path.read_text(encoding="utf-8"))


def write_json(path: Path, value: Any) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(value, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def config() -> dict[str, Any]:
    return load_json(CONFIG_PATH)


def jobs(scope: str | None = None, clip_id: str | None = None) -> list[dict[str, Any]]:
    rows = load_json(QUEUE)["rows"]
    if scope:
        rows = [row for row in rows if row["scope"] == scope]
    if clip_id:
        rows = [row for row in rows if row["clipId"] == clip_id]
    if clip_id and not rows:
        raise SystemExit(f"Unknown or already approved clip: {clip_id}")
    return rows


def source_hash(job: dict[str, Any], cfg: dict[str, Any]) -> str:
    stable = {
        "clipId": job["clipId"],
        "entryId": job["entryId"],
        "formId": job["formId"],
        "transcript": job["transcript"],
        "synthesisText": job["synthesisText"],
        "soundDa": job["soundDa"],
        "ipa": job["ipa"],
        "voiceModel": cfg["voiceModel"],
        "modelSha256": cfg["voiceModelSha256"],
        "lengthScale": cfg["lengthScale"],
        "minimumClipSeconds": cfg["minimumClipSeconds"],
        "normalization": cfg["normalization"],
        "correctionLimiter": cfg["correctionLimiter"],
        "integratedLufs": cfg["integratedLufs"],
        "truePeakDbtp": cfg["truePeakDbtp"],
        "sampleRate": cfg["sampleRate"],
        "bitrate": cfg["bitrate"],
    }
    raw = json.dumps(stable, ensure_ascii=False, sort_keys=True).encode()
    return hashlib.sha256(raw).hexdigest()


def file_sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for chunk in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def run(command: list[str], capture: bool = False) -> subprocess.CompletedProcess[str]:
    return subprocess.run(
        command,
        cwd=ROOT,
        check=True,
        text=True,
        capture_output=capture,
    )


def require_model(cfg: dict[str, Any]) -> Path:
    model = VOICES / f"{cfg['voiceModel']}.onnx"
    if not model.exists():
        raise SystemExit("Voice model missing. Run npm run audio:setup first.")
    actual = file_sha256(model)
    if actual != cfg["voiceModelSha256"]:
        raise SystemExit(f"Voice model checksum mismatch: {actual}")
    return model
