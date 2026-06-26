#!/usr/bin/env bash
# Creates Pzure per-module labels and Sprint 0-37 milestones via the GitLab CLI (glab).
# Prereq: `glab auth login` and run from anywhere; PROJECT is the full path.
# Usage: bash setup-labels-milestones.sh
set -euo pipefail

PROJECT="cricketaustin-group/Pzure"

# --- Per-module scoped labels ---------------------------------------------
declare -A MODULE_LABELS=(
  ["module::foundation"]="#6699cc"
  ["module::organisation"]="#5843AD"
  ["module::pos"]="#1F75CB"
  ["module::pharmacy"]="#108548"
  ["module::inventory"]="#C17D10"
  ["module::emr"]="#AE1800"
  ["module::lab"]="#D1208B"
  ["module::claims"]="#9400D3"
  ["module::reporting"]="#666666"
  ["module::communication"]="#00B140"
  ["module::frontend"]="#FC9403"
)

# --- Workflow / type labels -----------------------------------------------
declare -A OTHER_LABELS=(
  ["type::blocker"]="#DD2B0E"
  ["type::epic-umbrella"]="#6699cc"
  ["workflow::todo"]="#ED9121"
  ["workflow::in-progress"]="#1F75CB"
  ["workflow::blocked"]="#DD2B0E"
  ["workflow::done"]="#108548"
)

echo "Creating labels..."
for name in "${!MODULE_LABELS[@]}"; do
  glab label create --repo "$PROJECT" --name "$name" --color "${MODULE_LABELS[$name]}" --description "Pzure module" || echo "  (exists?) $name"
done
for name in "${!OTHER_LABELS[@]}"; do
  glab label create --repo "$PROJECT" --name "$name" --color "${OTHER_LABELS[$name]}" --description "Pzure workflow/type" || echo "  (exists?) $name"
done

# --- Milestones: Sprint 0 .. Sprint 37 ------------------------------------
# glab has no native milestone create; use the API via `glab api`.
echo "Creating milestones Sprint 0..37..."
for i in $(seq 0 37); do
  glab api --method POST "projects/$(printf '%s' "$PROJECT" | sed 's#/#%2F#')/milestones" \
    -f "title=Sprint $i" \
    -f "description=Pzure 2-week sprint $i (see DOCS/PROJECT-TRACKING/ROADMAP.md)" \
    >/dev/null 2>&1 && echo "  created Sprint $i" || echo "  (exists?) Sprint $i"
done

echo "Done. Next: assign labels/milestones to issues #1-#53 per WORK-ITEMS.md and LABELS-AND-MILESTONES.md."
