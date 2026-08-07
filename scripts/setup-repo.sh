#!/bin/sh
set -eu

# One-time repo administration. Run this after the GitHub repo exists.

REPO=$(gh repo view --json nameWithOwner -q .nameWithOwner)
DEFAULT_BRANCH=$(gh repo view --json defaultBranchRef -q .defaultBranchRef.name)
OWNER=$(gh repo view --json owner -q .owner.login)
VISIBILITY=$(gh repo view --json visibility -q .visibility)

echo "Configuring $REPO (default branch: $DEFAULT_BRANCH, owner: $OWNER, visibility: $VISIBILITY)" >&2

# --- (a) Merge settings ------------------------------------------------------
gh repo edit "$REPO" \
    --delete-branch-on-merge \
    --enable-squash-merge \
    --enable-rebase-merge \
    --enable-merge-commit=false

# --- (b) Branch protection ---------------------------------------------------
PROTECTION_PAYLOAD=$(cat <<'JSON'
{
  "required_status_checks": null,
  "enforce_admins": false,
  "required_pull_request_reviews": {
    "dismiss_stale_reviews": false,
    "require_code_owner_reviews": false,
    "required_approving_review_count": 0
  },
  "restrictions": null,
  "allow_force_pushes": false,
  "allow_deletions": false,
  "required_linear_history": false,
  "required_conversation_resolution": false,
  "lock_branch": false,
  "block_creations": false
}
JSON
)

set +e
PROTECTION_OUTPUT=$(printf '%s' "$PROTECTION_PAYLOAD" | gh api \
    --method PUT \
    -H "Accept: application/vnd.github+json" \
    "/repos/$REPO/branches/$DEFAULT_BRANCH/protection" \
    --input - 2>&1)
PROTECTION_EXIT=$?
set -e

PROTECTION_APPLIED=no
if [ "$PROTECTION_EXIT" -eq 0 ]; then
    PROTECTION_APPLIED=yes
elif printf '%s' "$PROTECTION_OUTPUT" | grep -qi "Upgrade to GitHub Pro"; then
    echo "WARNING: branch protection requires a paid plan for private repos on this account; skipping it." >&2
    echo "The local pre-push hook (owner-lock + protected-branch guard) is the only guard for now." >&2
else
    echo "ERROR: failed to set branch protection on $REPO ($DEFAULT_BRANCH):" >&2
    echo "$PROTECTION_OUTPUT" >&2
    exit 1
fi

# --- (c) CODEOWNERS (only if missing) ----------------------------------------
TOPLEVEL=$(git rev-parse --show-toplevel)
CODEOWNERS_PATH="$TOPLEVEL/.github/CODEOWNERS"

if [ -f "$CODEOWNERS_PATH" ]; then
    echo "CODEOWNERS already exists at .github/CODEOWNERS; leaving it untouched."
else
    mkdir -p "$TOPLEVEL/.github"
    printf '* @%s\n' "$OWNER" > "$CODEOWNERS_PATH"
    echo "Created .github/CODEOWNERS with '* @$OWNER'."
fi

# --- (d) Summary --------------------------------------------------------------
echo ""
echo "=== setup-repo.sh summary for $REPO ==="
echo "Merge settings:    squash + rebase merge enabled, merge commits disabled, branch deleted on merge"
if [ "$PROTECTION_APPLIED" = "yes" ]; then
    echo "Branch protection: ACTIVE on '$DEFAULT_BRANCH' (PRs required, no force-push, no deletion)"
else
    echo "Branch protection: NOT ACTIVE (plan limitation) -- local pre-push hook is the only guard"
fi
if [ -f "$CODEOWNERS_PATH" ]; then
    echo "CODEOWNERS:        present at .github/CODEOWNERS"
else
    echo "CODEOWNERS:        NOT present"
fi
echo "========================================"
