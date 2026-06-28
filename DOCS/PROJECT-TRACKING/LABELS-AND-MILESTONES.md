# Labels & Milestones

The work-item API tools cannot create labels or milestones, so this file documents the scheme and provides a `glab` script to create them in one shot. Run `setup-labels-milestones.sh` (next to this file) with the GitLab CLI authenticated, or create them manually in the GitLab UI.

## Per-module scoped labels

Scoped labels (`module::x`) are mutually exclusive per issue.

| Label | Color | Applies to issues |
| --- | --- | --- |
| `module::foundation` | `#6699cc` | #1 and Foundation children |
| `module::organisation` | `#5843AD` | #2, #15 |
| `module::pos` | `#1F75CB` | #3, #16, #17, #18 |
| `module::pharmacy` | `#108548` | #4, #22, #23, #24, #25 |
| `module::inventory` | `#C17D10` | #5, #19, #20, #21 |
| `module::emr` | `#AE1800` | #6, #26, #27 |
| `module::lab` | `#D1208B` | #7, #28, #29 |
| `module::claims` | `#9400D3` | #8, #30, #31, #32, #33 |
| `module::reporting` | `#666666` | #9, #34, #35 |
| `module::communication` | `#00B140` | #10, #36, #37 |
| `module::frontend` | `#FC9403` | #11, #57, #58, #59, #60, #61, #62 |

## Workflow & type labels (optional but recommended)

| Label | Color | Meaning |
| --- | --- | --- |
| `type::blocker` | `#DD2B0E` | Decision/dependency blockers (#48-#53) |
| `type::epic-umbrella` | `#6699cc` | Module/foundation umbrella issues (#1-#11) |
| `workflow::todo` | `# ED9121` | Not started |
| `workflow::in-progress` | `#1F75CB` | Active |
| `workflow::blocked` | `#DD2B0E` | Blocked |
| `workflow::done` | `#108548` | Complete |

## Milestones

One milestone per sprint: **Sprint 0**, **Sprint 0A/0B/0C** (architecture gate), then **Sprint 1** through **Sprint 37**. Suggested 2-week cadence; set start/due dates to match the agreed programme calendar. Issue-to-milestone mapping follows the sprint prefix in each issue title (see `WORK-ITEMS.md`).

> Create milestones with `create-milestones.sh` (surfaces API errors), then assign them with `apply-board-structure.sh`. The older inline loop in `setup-labels-milestones.sh` swallowed errors and is now disabled.

| Milestone | Issues |
| --- | --- |
| Sprint 0 | #12, plus blockers #48-#53 (target close) |
| Sprint 0A | #54 (data architecture & tenancy — Gate 0) |
| Sprint 0B | #55 (security/identity architecture — Gate 0) |
| Sprint 0C | #56 (offline/integration/NFR/deployment/DR — Gate 0) |
| Sprint 2 — Design System Foundation | #57 (F1 tokens/ADR-026) |
| Sprint 3 | #13; #58 (F2 component library) |
| Sprint 4 | #14; #59 (F3 app shells) |
| Sprint 5 | #15; #61 (F5 responsive/a11y/forms/status) |
| Sprint 4 | #14 |
| Sprint 5 | #15 |
| Sprint 6 | #38 |
| Sprint 7-9 | #16, #17, #18; #60 (F4 POS touch shell, Sprint 7) |
| Sprint 10-12 | #19, #20, #21 |
| Sprint 13-16 | #22, #23, #24, #25; #62 (F6 print/labels & testing, Sprint 13) |
| Sprint 17-18 | #26, #27 |
| Sprint 19-20 | #28, #29 |
| Sprint 21-24 | #30, #31, #32, #33 |
| Sprint 25-26 | #34, #35 |
| Sprint 27-28 | #36, #37 |
| Sprint 29-33 | #39, #40, #41, #42, #43 |
| Sprint 34-37 | #44, #45, #46, #47 |
