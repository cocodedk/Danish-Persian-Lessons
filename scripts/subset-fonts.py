#!/usr/bin/env python3
"""Subset the self-hosted Andika woff2 to the glyphs this app actually renders.

Authoring-time only: run it by hand, commit the result. Nothing in the build,
the tests or CI depends on it, and it adds no npm dependency — it needs only
python3 with fontTools (`pip install fonttools brotli`).

Andika ships full SIL coverage (~247 KB per weight). The app renders Danish,
English and the dansk lydskrift / IPA pronunciation lines, so everything
outside Latin, IPA and Western punctuation is dead weight over the wire.

    python3 scripts/subset-fonts.py

The full originals live in git history (`git show 3e16152:public/fonts/`) and
upstream at https://software.sil.org/andika/ — restore from there before
widening KEEP_RANGES.
"""

import subprocess
import sys
import tempfile
from pathlib import Path

FONTS_DIR = Path(__file__).resolve().parent.parent / "public" / "fonts"
TARGETS = ["Andika-Regular.woff2", "Andika-Bold.woff2"]
SIZE_CEILING = 60 * 1024  # keep in step with FONT_CEILING in scripts/verify.sh

# Latin, Latin-1 (æøåÆØÅ) and Latin Extended-A (European learner names); the
# full IPA block, spacing modifiers (ː) and combining marks for the
# pronunciation lines; Western punctuation. Latin Extended-B, Greek, Cyrillic
# and the alternate-shape features Andika also ships are dropped — nothing in
# the app reaches for them.
KEEP_RANGES = ",".join(
    [
        "U+0020-007E",
        "U+00A0-00FF",
        "U+0100-017F",
        "U+0250-02AF",
        "U+02B0-02FF",
        "U+0300-036F",
        "U+2000-206F",
    ]
)

# Every code point the UI and the lydskrift are known to need. Checked after
# subsetting: a missing one is a hard failure, not a warning.
REQUIRED = (
    [chr(c) for c in range(0x20, 0x7F)]
    + list("æøåÆØÅéèüöäÉÜ")
    + list("·×–—‘’“”…")
    + list("ɒːæɛɔʃʒʁqxʔɪʊ")
)


def codepoints(path: Path) -> set:
    from fontTools.ttLib import TTFont

    with TTFont(path) as font:
        return set(font.getBestCmap())


def subset(path: Path) -> None:
    before = path.stat().st_size
    with tempfile.TemporaryDirectory() as tmp:
        out = Path(tmp) / path.name
        subprocess.run(
            [
                sys.executable,
                "-m",
                "fontTools.subset",
                str(path),
                f"--unicodes={KEEP_RANGES}",
                # fontTools' default feature set: ccmp/mark/mkmk/kern/liga and
                # friends — everything shaping and diacritic placement need.
                "--name-IDs=*",  # keep the OFL copyright and licence strings
                "--flavor=woff2",
                f"--output-file={out}",
            ],
            check=True,
        )

        kept = codepoints(out)
        missing = [c for c in REQUIRED if ord(c) not in kept]
        if missing:
            raise SystemExit(f"{path.name}: dropped required glyphs {missing!r}")

        after = out.stat().st_size
        if after >= SIZE_CEILING:
            raise SystemExit(f"{path.name}: {after} bytes is over the {SIZE_CEILING} ceiling")

        out.replace(path)

    print(
        f"{path.name}: {before:,} -> {after:,} bytes "
        f"({100 - after * 100 // before}% smaller), {len(kept)} glyphs kept"
    )


def main() -> None:
    for name in TARGETS:
        subset(FONTS_DIR / name)


if __name__ == "__main__":
    main()
