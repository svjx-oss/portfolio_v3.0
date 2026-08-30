---
name: commit-message
description: Use when creating or editing jj commit messages in this portfolio project.
---

# Commit Messages

Use `jj` only. Format messages as:

```text
type: short imperative summary

Explain the meaningful change in one or two concise lines.

ref: TEAM-123
```

## Types

- `feat`: new user-facing behavior
- `fix`: correction to existing behavior
- `docs`: documentation
- `skills`: agent skills or execution capabilities
- `test`: tests or test infrastructure
- `refactor`: internal restructuring
- `build`: build tooling, dependencies, or project configuration
- `ci`: continuous integration
- `chore`: routine maintenance when no other type fits

Use the most specific type. Keep issue identifiers out of the title.

## References

Every message needs at least one lowercase `ref:` trailer. Use one `ref:` per related issue. Add `fixes:` directly below a `ref:` only when the change resolves that issue.

```text
fix: prevent fixture content in production

Block fixture loading in production.

ref: TEAM-123
fixes: TEAM-123
```

Create or edit the message with:

```sh
jj describe -m $'type: short summary\n\nExplain the meaningful change.\n\nref: TEAM-123'
```
