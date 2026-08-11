#!/usr/bin/env python3
from __future__ import annotations

from common import (
    PUBLIC_REVIEW_AUDIO,
    REVIEW_MANIFEST_DATA,
    ROOT,
    file_sha256,
    load_json,
)


def main() -> None:
    rows = load_json(REVIEW_MANIFEST_DATA)
    if not rows:
        raise SystemExit("FAIL: the online audio review set is empty")
    seen = set()
    referenced = set()
    for row in rows:
        clip_id = row.get("clipId", "")
        if not clip_id or clip_id in seen:
            raise SystemExit(f"FAIL: missing or duplicate clip id: {clip_id}")
        seen.add(clip_id)
        if row.get("status") != "unreviewed":
            raise SystemExit(f"FAIL: review clip is not marked unreviewed: {clip_id}")
        if "reviewedBy" in row:
            raise SystemExit(f"FAIL: draft claims reviewer approval: {clip_id}")
        file_path = ROOT / "public" / row.get("file", "")
        if file_path.parent != PUBLIC_REVIEW_AUDIO or not file_path.exists():
            raise SystemExit(f"FAIL: missing review file: {clip_id}")
        if file_sha256(file_path) != row.get("fileSha256"):
            raise SystemExit(f"FAIL: changed review file: {clip_id}")
        referenced.add(file_path.name)

    public_files = {path.name for path in PUBLIC_REVIEW_AUDIO.glob("*.mp3")}
    if public_files != referenced:
        raise SystemExit("FAIL: stray or missing online review audio")
    print(f"PASS: {len(rows)} unreviewed online audio draft(s) verified")


if __name__ == "__main__":
    main()
