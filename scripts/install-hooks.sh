#!/bin/sh
set -eu
cd "$(git rev-parse --show-toplevel)"
git config core.hooksPath .githooks
echo "Hooks installed — pre-commit (fast checks), commit-msg (Conventional Commits), pre-push (owner-lock + full gate) are active."
