#!/usr/bin/env python3
from __future__ import annotations

import sys

from common import MANIFEST_DATA, PUBLIC_AUDIO, ROOT, file_sha256, load_json


def fail(message: str, failures: list[str]) -> None:
    failures.append(message)
    print(f"FAIL: {message}")


def main() -> None:
    rows = load_json(MANIFEST_DATA)
    failures: list[str] = []
    seen: set[str] = set()
    referenced: set[str] = set()
    for row in rows:
        clip_id = row.get("clipId", "")
        if clip_id in seen:
            fail(f"duplicate clip id: {clip_id}", failures)
        seen.add(clip_id)
        if row.get("source") not in {"piper", "human"}:
            fail(f"unknown source: {clip_id}", failures)
        if not row.get("reviewedBy") or len(set(row["reviewedBy"])) < 1:
            fail(f"missing native review: {clip_id}", failures)
        if not -22 <= row.get("integratedLufs", 99) <= -18:
            fail(f"loudness outside target: {clip_id}", failures)
        if row.get("truePeakDbtp", 99) > -1:
            fail(f"true peak outside target: {clip_id}", failures)

        file_path = ROOT / "public" / row.get("file", "").lstrip("/")
        if not file_path.exists():
            fail(f"missing public file: {clip_id}", failures)
            continue
        referenced.add(file_path.name)
        expected_hash = file_path.stem.rsplit(".", 1)[-1]
        if file_sha256(file_path)[:12] != expected_hash:
            fail(f"content hash mismatch: {clip_id}", failures)
        if file_path.stat().st_size > 100_000 and not row.get("sizeException"):
            fail(f"large clip has no reason: {clip_id}", failures)
        report = ROOT / row.get("loudnessReportRef", "")
        if not report.exists():
            fail(f"missing release report: {clip_id}", failures)

    if PUBLIC_AUDIO.exists():
        for path in PUBLIC_AUDIO.glob("*.mp3"):
            if path.name not in referenced:
                fail(f"unreferenced public audio: {path.name}", failures)
    if failures:
        raise SystemExit(1)
    print(f"PASS: {len(rows)} approved audio clip(s) verified")


if __name__ == "__main__":
    try:
        main()
    except (KeyError, TypeError, ValueError) as error:
        print(f"FAIL: invalid audio manifest: {error}")
        sys.exit(1)
