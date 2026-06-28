#!/usr/bin/env bash
# Applies module/workflow labels, sprint milestones, and parent links to Pzure
# issues #1-#56 using the GitLab CLI. Nothing is hardcoded: label and milestone
# IDs/names are resolved at runtime from the project.
#
# Prereq:
#   - glab auth login  (pointed at gitlab.com)
#   - labels + milestones already created (run setup-labels-milestones.sh first)
#   - jq installed
#
# Usage: bash apply-board-structure.sh
#
# Safe to re-run (idempotent): re-applying the same label/milestone is a no-op.
set -euo pipefail

PROJECT="cricketaustin-group/Pzure"
ENC_PROJECT=$(printf '%s' "$PROJECT" | sed 's#/#%2F#')

command -v glab >/dev/null || { echo "glab not found"; exit 1; }
command -v jq   >/dev/null || { echo "jq not found";   exit 1; }

# --- Resolve milestone titles -> ids at runtime ---------------------------
# Builds an associative array MILESTONE_ID["Sprint 7"]=123
declare -A MILESTONE_ID
while IFS=$'\t' read -r mid mtitle; do
  [ -n "$mtitle" ] && MILESTONE_ID["$mtitle"]="$mid"
done < <(glab api --paginate "projects/$ENC_PROJECT/milestones?per_page=100" \
          | jq -r '.[] | "\(.id)\t\(.title)"')

# --- Helpers --------------------------------------------------------------
# Apply one or more labels (comma-separated names) to an issue by iid.
# glab resolves label names itself, so no label-id lookup is needed.
apply_labels() { # $1=iid  $2=comma,separated,label,names
  glab issue update "$1" --repo "$PROJECT" --label "$2" >/dev/null \
    && echo "  #$1 labels: $2" || echo "  #$1 label FAILED"
}

# Assign a milestone (by title) to an issue via the API (glab issue update
# also supports --milestone with a title on recent versions).
apply_milestone() { # $1=iid  $2=milestone title
  local title="$2" id="${MILESTONE_ID[$2]:-}"
  if [ -z "$id" ]; then echo "  #$1 milestone '$title' NOT FOUND (create it first)"; return; fi
  glab api --method PUT "projects/$ENC_PROJECT/issues/$1" -f "milestone_id=$id" >/dev/null \
    && echo "  #$1 milestone: $title" || echo "  #$1 milestone FAILED"
}

# Set parent (work-item hierarchy). Requires Premium+ (Epics/child issues).
# Will no-op on Free; left here so it works automatically after an upgrade.
set_parent() { # $1=child iid  $2=parent iid
  glab issue update "$1" --repo "$PROJECT" --parent "$2" >/dev/null 2>&1 \
    && echo "  #$1 parent -> #$2" || echo "  #$1 parent skipped (needs Premium)"
}

# --- Issue mapping: iid | labels | milestone | parent --------------------
# One row per issue. Edit here, not in the functions.
# Format: IID|LABELS|MILESTONE|PARENT   (use - for none)
MAP=$(cat <<'ROWS'
1|module::foundation,type::epic-umbrella|-|-
2|module::organisation,type::epic-umbrella|-|-
3|module::pos,type::epic-umbrella|-|-
4|module::pharmacy,type::epic-umbrella|-|-
5|module::inventory,type::epic-umbrella|-|-
6|module::emr,type::epic-umbrella|-|-
7|module::lab,type::epic-umbrella|-|-
8|module::claims,type::epic-umbrella|-|-
9|module::reporting,type::epic-umbrella|-|-
10|module::communication,type::epic-umbrella|-|-
11|module::frontend,type::epic-umbrella|-|-
12|module::foundation,workflow::todo|Sprint 0|1
54|module::foundation,workflow::todo|Sprint 0A|1
55|module::foundation,workflow::todo|Sprint 0B|1
56|module::foundation,workflow::todo|Sprint 0C|1
13|module::foundation,workflow::todo|Sprint 3|1
14|module::foundation,workflow::todo|Sprint 4|1
15|module::organisation,workflow::todo|Sprint 5|2
38|module::foundation,workflow::todo|Sprint 6|1
16|module::pos,workflow::todo|Sprint 7|3
17|module::pos,workflow::todo|Sprint 8|3
18|module::pos,workflow::todo|Sprint 9|3
19|module::inventory,workflow::todo|Sprint 10|5
20|module::inventory,workflow::todo|Sprint 11|5
21|module::inventory,workflow::todo|Sprint 12|5
22|module::pharmacy,workflow::todo|Sprint 13|4
23|module::pharmacy,workflow::todo|Sprint 14|4
24|module::pharmacy,workflow::todo|Sprint 15|4
25|module::pharmacy,workflow::todo|Sprint 16|4
26|module::emr,workflow::todo|Sprint 17|6
27|module::emr,workflow::todo|Sprint 18|6
28|module::lab,workflow::todo|Sprint 19|7
29|module::lab,workflow::todo|Sprint 20|7
30|module::claims,workflow::todo|Sprint 21|8
31|module::claims,workflow::todo|Sprint 22|8
32|module::claims,workflow::todo|Sprint 23|8
33|module::claims,workflow::todo|Sprint 24|8
34|module::reporting,workflow::todo|Sprint 25|9
35|module::reporting,workflow::todo|Sprint 26|9
36|module::communication,workflow::todo|Sprint 27|10
37|module::communication,workflow::todo|Sprint 28|10
39|module::foundation,workflow::todo|Sprint 29|1
40|module::foundation,workflow::todo|Sprint 30|1
41|module::foundation,workflow::todo|Sprint 31|1
42|module::foundation,workflow::todo|Sprint 32|1
43|module::foundation,workflow::todo|Sprint 33|1
44|module::foundation,workflow::todo|Sprint 34|1
45|module::foundation,workflow::todo|Sprint 35|1
46|module::foundation,workflow::todo|Sprint 36|1
47|module::foundation,workflow::todo|Sprint 37|1
48|type::blocker,workflow::todo|Sprint 0|-
49|type::blocker,workflow::todo|Sprint 0|-
50|type::blocker,workflow::todo|Sprint 0|-
51|type::blocker,workflow::todo|Sprint 0|-
52|type::blocker,workflow::todo|Sprint 0|-
53|type::blocker,workflow::todo|Sprint 0|-
ROWS
)

echo "Applying board structure to $PROJECT ..."
while IFS='|' read -r iid labels milestone parent; do
  [ -z "${iid:-}" ] && continue
  echo "Issue #$iid"
  [ "$labels"    != "-" ] && apply_labels    "$iid" "$labels"
  [ "$milestone" != "-" ] && apply_milestone "$iid" "$milestone"
  [ "$parent"    != "-" ] && set_parent      "$iid" "$parent"
done <<< "$MAP"

echo "Done. Verify on the GitLab board, then group/filter by label or milestone."
