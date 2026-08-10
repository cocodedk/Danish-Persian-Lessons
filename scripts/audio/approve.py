#!/usr/bin/env python3
from __future__ import annotations

import argparse
import shutil
from pathlib import Path

from common import (
    AUDIO_ROOT,
    MANIFEST_DATA,
    PUBLIC_AUDIO,
    REPORTS,
    REVIEW_AUDIO,
    config,
    file_sha256,
    jobs,
    load_json,
    source_hash,
    write_json,
)


def main() -> None:
    parser = argparse.ArgumentParser(description="Promote native-approved Persian clips")
    parser.add_argument("--decisions", type=Path, required=True)
    args = parser.parse_args()

    cfg = config()
    decisions = load_json(args.decisions)["decisions"]
    approved = {row["clipId"]: row for row in decisions if row.get("approved")}
    if not approved:
        raise SystemExit("No clips were approved.")
    if any(not row.get("reviewer", "").strip() for row in approved.values()):
        raise SystemExit("Every approval needs one named native reviewer.")

    reports = {row["clipId"]: row for row in load_json(REPORTS / "latest.json")}
    current_jobs = {row["clipId"]: row for row in jobs()}
    selected = {}
    for clip_id, decision in approved.items():
        report = reports.get(clip_id)
        job = current_jobs.get(clip_id)
        if not report or not job:
            raise SystemExit(f"No current draft and queue row for {clip_id}")
        expected_hash = source_hash(job, cfg)
        if report.get("sourceTextHash") != expected_hash:
            raise SystemExit(f"Stale draft for {clip_id}; generate it again.")
        if report.get("modelSha256") != cfg["voiceModelSha256"]:
            raise SystemExit(f"Wrong voice model for {clip_id}")
        draft = AUDIO_ROOT / report["draftFile"]
        if not draft.exists() or report.get("bytes") != draft.stat().st_size:
            raise SystemExit(f"Draft missing or changed for {clip_id}: {draft}")
        if not -22 <= report["integratedLufs"] <= -18:
            raise SystemExit(f"Loudness outside target for {clip_id}")
        if report["truePeakDbtp"] > -1:
            raise SystemExit(f"True peak outside target for {clip_id}")
        if report["bytes"] > cfg["maxClipBytes"] and not decision.get("note"):
            raise SystemExit(f"Large clip needs a review note: {clip_id}")
        selected[clip_id] = (decision, report, draft)

    manifest = load_json(MANIFEST_DATA) if MANIFEST_DATA.exists() else []
    by_id = {row["clipId"]: row for row in manifest}
    PUBLIC_AUDIO.mkdir(parents=True, exist_ok=True)
    REVIEW_AUDIO.mkdir(parents=True, exist_ok=True)

    for clip_id, (decision, report, draft) in selected.items():
        asset_hash = file_sha256(draft)[:12]
        filename = f"{clip_id}.{asset_hash}.mp3"
        report_name = f"{clip_id}.{asset_hash}.json"
        shutil.copy2(draft, PUBLIC_AUDIO / filename)
        release_report = {
            **report,
            "reviewedBy": [decision["reviewer"].strip()],
            "reviewNote": decision.get("note", "").strip(),
            "releasedFile": f"/audio/{filename}",
        }
        write_json(REVIEW_AUDIO / report_name, release_report)
        row = {
            "source": "piper",
            "clipId": clip_id,
            "entryId": report["entryId"],
            "formId": report["formId"],
            "file": f"/audio/{filename}",
            "locale": "fa-IR",
            "transcript": report["transcript"],
            "durationMs": report["durationMs"],
            "channels": 1,
            "integratedLufs": report["integratedLufs"],
            "truePeakDbtp": report["truePeakDbtp"],
            "loudnessReportRef": f"docs/reviews/audio/{report_name}",
            **({"sizeException": decision["note"].strip()} if report["bytes"] > cfg["maxClipBytes"] else {}),
            "reviewedBy": [decision["reviewer"].strip()],
            "license": cfg["voiceLicense"],
            "engineVersion": report["engineVersion"],
            "voiceModel": cfg["voiceModel"],
            "modelSha256": cfg["voiceModelSha256"],
            "synthesisText": report["synthesisText"],
            "sourceTextHash": report["sourceTextHash"],
        }
        by_id[clip_id] = row
        print(f"Approved {clip_id} -> public/audio/{filename}")

    write_json(MANIFEST_DATA, sorted(by_id.values(), key=lambda row: row["clipId"]))


if __name__ == "__main__":
    main()
