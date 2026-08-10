#!/usr/bin/env python3
from __future__ import annotations

import argparse
import html
import json
import os
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer

from common import AUDIO_ROOT, REPORTS, WORK, jobs, load_json


def card(job: dict, report: dict) -> str:
    clip = html.escape(job["clipId"])
    draft = html.escape(os.path.relpath(WORK / report["draftFile"].split("/", 1)[-1], AUDIO_ROOT))
    correction = f" · rettet {report['loudnessCorrectionDb']:+g} dB" if report.get("loudnessCorrectionDb") else ""
    return f"""
    <article data-clip="{clip}">
      <p class="meta">{html.escape(job['domain'])} · {html.escape(job['register'])}</p>
      <h2 lang="fa" dir="rtl">{html.escape(job['transcript'])}</h2>
      <p><strong>{html.escape(job['danishMeaning'])}</strong></p>
      <p>{html.escape(job['soundDa'])} · [{html.escape(job['ipa'])}]</p>
      <audio controls preload="none" src="{draft}"></audio>
      <p class="metrics">{report['integratedLufs']} LUFS · {report['truePeakDbtp']} dBTP · {report['bytes']} byte{correction}</p>
      <label><input type="checkbox" class="approve"> Godkend</label>
      <label>Note <input class="note" type="text"></label>
    </article>"""


def build() -> None:
    latest = REPORTS / "latest.json"
    if not latest.exists():
        raise SystemExit("No drafts found. Run npm run audio:generate first.")
    reports = load_json(latest)
    by_id = {job["clipId"]: job for job in jobs()}
    cards = "".join(card(by_id[row["clipId"]], row) for row in reports if row["clipId"] in by_id)
    page = f"""<!doctype html>
<html lang="da"><meta charset="utf-8"><meta name="viewport" content="width=device-width">
<title>Persisk lydreview</title>
<style>
body{{font:18px system-ui;max-width:58rem;margin:auto;padding:1rem;background:#f8f2e7;color:#17211d}}
header{{position:sticky;top:0;background:#f8f2e7;padding:.5rem 0;border-bottom:2px solid #17211d}}
article{{padding:1rem 0;border-bottom:1px solid #777;display:grid;gap:.6rem}}
h2,p{{margin:0}} h2{{font-size:2.5rem}} audio{{width:100%}} label{{display:block}}
input[type=text]{{font:inherit;width:min(30rem,100%)}} button{{font:inherit;padding:.65rem 1rem}}
.meta,.metrics{{font-size:.85rem;color:#445}}
</style>
<header><h1>Persisk lydreview</h1>
<label>Reviewer-id <input id="reviewer" required></label>
<button id="download">Hent beslutninger</button></header>
<main>{cards}</main>
<script>
document.querySelector('#download').onclick = () => {{
  const reviewer = document.querySelector('#reviewer').value.trim();
  if (!reviewer) return alert('Skriv reviewer-id først.');
  const decisions = [...document.querySelectorAll('article')].map(card => ({{
    clipId: card.dataset.clip,
    approved: card.querySelector('.approve').checked,
    note: card.querySelector('.note').value.trim(),
    reviewer
  }}));
  const blob = new Blob([JSON.stringify({{schemaVersion:1, decisions}}, null, 2)], {{type:'application/json'}});
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob); link.download = 'audio-decisions.json'; link.click();
  setTimeout(() => URL.revokeObjectURL(link.href), 1000);
}};
</script></html>"""
    target = AUDIO_ROOT / "review" / "index.html"
    target.parent.mkdir(parents=True, exist_ok=True)
    target.write_text(page, encoding="utf-8")
    print(f"Review page: {target}")


def serve() -> None:
    os.chdir(AUDIO_ROOT)
    server = ThreadingHTTPServer(("127.0.0.1", 8765), SimpleHTTPRequestHandler)
    print("Open http://127.0.0.1:8765/review/ and press Ctrl-C when done.")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        pass


def main() -> None:
    parser = argparse.ArgumentParser(description="Build the local native-audio review board")
    parser.add_argument("--serve", action="store_true")
    args = parser.parse_args()
    build()
    if args.serve:
        serve()


if __name__ == "__main__":
    main()
