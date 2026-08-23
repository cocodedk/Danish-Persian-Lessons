#!/usr/bin/env bash
set -eu

cd "$(dirname "$0")/../.."
audio_root=.audio
venv="$audio_root/.venv"
voices="$audio_root/voices"

python3 -m venv "$venv"
"$venv/bin/pip" install -r scripts/audio/requirements.txt
mkdir -p "$voices" "$audio_root/work" "$audio_root/reports"

# Python accepts one CA file. When a package firewall supplies its own CA,
# combine it with Python's platform bundle so both intercepted and direct
# HTTPS chains remain verified; never disable certificate checks.
if [ -n "${SSL_CERT_FILE:-}" ] && [ -f "$SSL_CERT_FILE" ]; then
  system_ca="$(env -u SSL_CERT_FILE "$venv/bin/python" -c \
    'import ssl; print(ssl.get_default_verify_paths().cafile or "")')"
  if [ -n "$system_ca" ] && [ -f "$system_ca" ]; then
    custom_ca="$SSL_CERT_FILE"
    combined_ca="$audio_root/ca-bundle.pem"
    cp "$system_ca" "$combined_ca"
    printf '\n' >> "$combined_ca"
    cat "$custom_ca" >> "$combined_ca"
    export SSL_CERT_FILE="$combined_ca"
  fi
fi

if [ ! -f "$voices/fa_IR-ganji-medium.onnx" ]; then
  "$venv/bin/python" -m piper.download_voices \
    fa_IR-ganji-medium --data-dir "$voices"
fi
"$venv/bin/python" -c 'import sys; sys.path.insert(0, "scripts/audio"); from common import config, require_model; require_model(config())'


printf 'Audio tools are ready in %s\n' "$audio_root"
