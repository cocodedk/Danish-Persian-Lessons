#!/usr/bin/env bash
# scripts/verify.sh
#
# Fast, offline sanity checks for the Danish-Persian-Lessons static site.
# Used by: .githooks/pre-commit and .githooks/pre-push.
#
# No network access. Expected to complete in ~2 seconds.
# Prints one PASS/FAIL line per check; exits 1 if any check failed.

set -eu

# Run from the repo root regardless of the caller's cwd.
cd "$(dirname "$0")/.."

FAILED=0

# report DESC STATUS — STATUS is 0 for pass, anything else for fail.
report() {
  local desc="$1"
  local status="$2"
  if [ "$status" -eq 0 ]; then
    printf 'PASS: %s\n' "$desc"
  else
    printf 'FAIL: %s\n' "$desc"
    FAILED=1
  fi
}

# check_exists PATH — reports whether a file exists.
check_exists() {
  local path="$1"
  if [ -f "$path" ]; then
    report "exists: $path" 0
  else
    report "exists: $path" 1
  fi
}

# check_contains FILE NEEDLE — reports whether FILE contains the literal NEEDLE.
check_contains() {
  local file="$1"
  local needle="$2"
  if grep -q -F -- "$needle" "$file" 2>/dev/null; then
    report "$file contains: $needle" 0
  else
    report "$file contains: $needle" 1
  fi
}

# --- (a) required files exist -------------------------------------------------

for f in \
  website/index.html \
  website/da/index.html \
  website/fa/index.html \
  website/styles.css \
  website/favicon.svg \
  website/robots.txt \
  website/sitemap.xml \
  README.md \
  LICENSE \
  CLAUDE.md \
  llms.txt
do
  check_exists "$f"
done

# --- (g) built app assets stay within the measured P12 baseline ceilings -----

JS_CEILING=365000
CSS_CEILING=50000
for asset in dist/assets/*.js; do
  size=$(wc -c < "$asset" 2>/dev/null | tr -d ' ' || echo 0)
  if [ "$size" -gt 0 ] && [ "$size" -le "$JS_CEILING" ]; then
    report "$asset under 365 KB ($size bytes)" 0
  else
    report "$asset under 365 KB (found $size bytes)" 1
  fi
done
for asset in dist/assets/*.css; do
  size=$(wc -c < "$asset" 2>/dev/null | tr -d ' ' || echo 0)
  if [ "$size" -gt 0 ] && [ "$size" -le "$CSS_CEILING" ]; then
    report "$asset under 50 KB ($size bytes)" 0
  else
    report "$asset under 50 KB (found $size bytes)" 1
  fi
done

# --- (b) shared SEO/meta substrings on each of the 3 HTML pages ---------------

for page in website/index.html website/da/index.html website/fa/index.html; do
  for needle in \
    'viewport' \
    'rel="canonical"' \
    'hreflang="x-default"' \
    'favicon.svg' \
    'cocode.dk' \
    'linkedin.com/in/babakbandpey'
  do
    check_contains "$page" "$needle"
  done
done

# --- (c) per-language lang/dir attributes -------------------------------------

if grep -q -F -- 'lang="fa"' website/fa/index.html 2>/dev/null \
  && grep -q -F -- 'dir="rtl"' website/fa/index.html 2>/dev/null; then
  report 'website/fa/index.html has lang="fa" and dir="rtl"' 0
else
  report 'website/fa/index.html has lang="fa" and dir="rtl"' 1
fi

check_contains website/da/index.html 'lang="da"'
check_contains website/index.html 'lang="en"'

# --- (d) sitemap.xml has exactly 3 <loc> entries; robots.txt links a sitemap --

loc_count=0
if [ -f website/sitemap.xml ]; then
  loc_count=$(grep -o -F -- '<loc>' website/sitemap.xml 2>/dev/null | wc -l | tr -d ' ')
fi
if [ "$loc_count" = "3" ]; then
  report "website/sitemap.xml has exactly 3 <loc> elements (found $loc_count)" 0
else
  report "website/sitemap.xml has exactly 3 <loc> elements (found $loc_count)" 1
fi

check_contains website/robots.txt 'Sitemap:'

# --- (e) README.md attribution/links ------------------------------------------

check_contains README.md 'cocode.dk'
check_contains README.md 'cocodedk.github.io/Danish-Persian-Lessons'

# --- (f) every shipped webfont stays inside the 60 KB budget (plan 002) -------
# Andika is subsetted to fit; regenerate with: python3 scripts/subset-fonts.py

FONT_CEILING=61440
for font in public/fonts/*.woff2; do
  size=$(wc -c < "$font" 2>/dev/null | tr -d ' ' || echo 0)
  if [ "$size" -gt 0 ] && [ "$size" -lt "$FONT_CEILING" ]; then
    report "$font under 60 KB ($size bytes)" 0
  else
    report "$font under 60 KB (found $size bytes)" 1
  fi
done

# --- verdict -------------------------------------------------------------------

if [ "$FAILED" -ne 0 ]; then
  exit 1
fi
exit 0
