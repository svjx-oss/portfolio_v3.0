---
name: commit-message
description: Use when creating, describing, reviewing, or amending a jj change or commit message in this portfolio project.
---

# Commit Message Format

Use jj only. Keep the first line a concise Conventional Commits-style title:

```text
feat: add Writing index
```

Use the most specific type:

- `feat`: new user-facing behavior
- `fix`: a correction to existing behavior
- `docs`: documentation changes
- `skills`: project-local agent skills and execution capabilities
- `test`: tests or test infrastructure
- `refactor`: internal restructuring without intended behavior change
- `build`: build tooling, dependencies, or project configuration
- `ci`: continuous-integration configuration
- `chore`: routine maintenance that does not change application behavior, documentation, skills, tests, build tooling, or CI

Use `chore` only when no more specific type applies.

Leave a blank line after the title. Every change must include at least one Linear reference trailer:

```text
feat: add Writing index

ref: ME-11
```

If the change corrects an issue, add `fixes:` immediately below its matching `ref:` trailer:

```text
fix: prevent fixture content in production

ref: ME-11
fixes: ME-11
```

For a shared or indirectly related change, include one `ref:` trailer per related issue. Add `fixes:` only directly beneath the issue it corrects:

```text
refactor: centralize content environment handling

ref: ME-11
fixes: ME-11
ref: ME-12
```

Use this command form so newlines are preserved:

```sh
jj describe -m $'feat: add Writing index\n\nref: ME-11'
```

Do not put the issue identifier in the title. Do not omit the lowercase `ref:` trailer. Do not use `fixes:` for ordinary implementation work that merely advances an issue.
