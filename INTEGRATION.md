# Integration branch: develop

`develop` is the integration line for Pzure. All phase/feature branches merge
here via independently reviewable merge requests and a green pipeline.

- `main` is untouched until an explicitly approved release gate
  (see `DOCS/PROJECT-TRACKING/.branch-note.md` on the `DOCS` branch).
- Phase 1 (`phase-1/scaffold`): monorepo, core abstractions, infra ports,
  concurrency scaffolding, CI/CD. No business logic.
- Phase 2 (`phase-2/module-1-domain`): Module 1 domain. Stacked onto Phase 1.

Merge order: Phase 1 -> develop, then Phase 2 (rebased on develop) -> develop.
