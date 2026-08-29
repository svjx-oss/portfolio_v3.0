# Implementation Progress

> Repository-local mirror of implementation progress. The [Personal Portfolio Linear project](https://linear.app/svjx/project/personal-portfolio-6202ca3cda15) is the operational source of truth for issue status, review approval, blockers, and discussion. Keep this file synchronized with Linear at the end of every change.

## Current State

| Field | Value |
|---|---|
| Current change | Change 2 - Build shell and theme tokens |
| Status | In progress |
| Awaiting review | No |
| Next action | Begin Change 1 after explicit user direction |

## Change Log

| Change | Description | Verification | Review status | Notes |
|---|---|---|---|---|
| 1 | Clean scaffold and configure checks | Not started | Not reviewed | |
| 2 | Build shell and theme tokens | Not started | Not reviewed | |
| 3 | Complete content-driven landing page | Not started | Not reviewed | |
| 4 | Add editorial About page | Not started | Not reviewed | |
| 5 | Add narrative Experience timeline | Not started | Not reviewed | |
| 6 | Add numbered Projects list | Not started | Not reviewed | |
| 7 | Add Writing index and visual fixtures | Not started | Not reviewed | |
| 8 | Add Writing posts, TOC, and assets | Not started | Not reviewed | |
| 9 | Add publishing discovery endpoints | Not started | Not reviewed | |
| 10 | Add optional analytics | Not started | Not reviewed | |
| 11 | Run cross-site accessibility and theme verification | Not started | Not reviewed | |
| 12 | Release audit and deployment readiness | Not started | Not reviewed | |

## Update Rules

1. Before work, set the matching Linear issue to `In Progress`, then mirror the active change here.
2. At the end of a change, add exact commands run, manual checks, known gaps, the `jj` change identifier, and its `type: summary` description with `Issue: ME-123` trailers (and `Fixes: ME-123` where applicable) to the Linear issue; mirror that evidence in this file.
3. Set the Linear issue to the review state used by the team, or leave it `In Progress` with a review comment if no such state exists. Set `Awaiting review` to `Yes` here and stop work.
4. Do not start the next change until the user explicitly approves the completed change in Linear or this conversation. Mark the Linear issue `Done`, mirror it as `Approved` here, and advance `Current change`.
5. Use Linear blockers only for actual technical or external blockers, never merely to represent implementation order. If review identifies an issue, retain the current change until it is fixed, reverified, and approved.

## Change Description Format

Use a Conventional Commits-style title and add Linear references as trailers:

```
feat: add Writing index

Issue: ME-11
```

For a corrective change, put `Fixes:` directly below its associated `Issue:` trailer:

```
fix: prevent fixture content in production

Issue: ME-11
Fixes: ME-11
```

For a shared or indirectly related change, add multiple `Issue:` trailers:

```
refactor: centralize content environment handling

Issue: ME-11
Issue: ME-12
```

Allowed types: `feat`, `fix`, `docs`, `test`, `chore`, and `refactor`. Every change must include at least one `Issue: ME-123` trailer. `Fixes: ME-123` is optional and used only when the change corrects an issue; it always appears immediately below its matching `Issue:` line.
