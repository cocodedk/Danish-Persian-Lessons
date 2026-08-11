#!/usr/bin/env python3
from __future__ import annotations

import shutil

from common import (
    AUDIO_ROOT,
    PUBLIC_REVIEW_AUDIO,
    REPORTS,
    REVIEW_MANIFEST_DATA,
    config,
    file_sha256,
    jobs,
    load_json,
    source_hash,
    write_json,
)


def main() -> None:
    cfg = config()
    report_path = REPORTS / "latest.json"
    if not report_path.exists():
        raise SystemExit("No drafts found. Run npm run audio:generate -- --scope talk first.")

    reports = load_json(report_path)
    talk_jobs = {row["clipId"]: row for row in jobs("talk")}
    report_ids = {row["clipId"] for row in reports}
    if report_ids != set(talk_jobs):
        missing = sorted(set(talk_jobs) - report_ids)
        extra = sorted(report_ids - set(talk_jobs))
        raise SystemExit(
            "Latest report is not the full talk set. "
            f"Missing: {missing}; extra: {extra}"
        )

    prepared = []
    for report in reports:
        clip_id = report["clipId"]
        job = talk_jobs[clip_id]
        if report.get("sourceTextHash") != source_hash(job, cfg):
            raise SystemExit(f"Stale draft for {clip_id}; generate it again.")
        draft = AUDIO_ROOT / report["draftFile"]
        if not draft.exists() or draft.stat().st_size != report.get("bytes"):
            raise SystemExit(f"Draft missing or changed for {clip_id}: {draft}")
        if not -22 <= report["integratedLufs"] <= -18 or report["truePeakDbtp"] > -1:
            raise SystemExit(f"Audio limits failed for {clip_id}")
        prepared.append((job, report, draft, file_sha256(draft)))

    PUBLIC_REVIEW_AUDIO.mkdir(parents=True, exist_ok=True)
    rows = []
    kept = set()
    for job, report, draft, digest in prepared:
        target = PUBLIC_REVIEW_AUDIO / draft.name
        shutil.copy2(draft, target)
        kept.add(target.name)
        rows.append({
            "status": "unreviewed",
            "clipId": job["clipId"],
            "entryId": job["entryId"],
            "formId": job["formId"],
            "register": job["register"],
            "domain": job["domain"],
            "transcript": job["transcript"],
            "danishMeaning": job["danishMeaning"],
            "soundDa": job["soundDa"],
            "ipa": job["ipa"],
            "file": f"audio-review/{target.name}",
            "fileSha256": digest,
            "durationMs": report["durationMs"],
            "integratedLufs": report["integratedLufs"],
            "truePeakDbtp": report["truePeakDbtp"],
            "sourceTextHash": report["sourceTextHash"],
            "voiceModel": report["voiceModel"],
        })

    for path in PUBLIC_REVIEW_AUDIO.glob("*.mp3"):
        if path.name not in kept:
            path.unlink()
    write_json(REVIEW_MANIFEST_DATA, rows)
    print(f"Published {len(rows)} clearly marked review draft(s).")
    print("The approved lesson manifest was not changed.")


if __name__ == "__main__":
    main()
