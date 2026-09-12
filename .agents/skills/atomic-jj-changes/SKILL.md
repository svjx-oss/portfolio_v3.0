---
name: atomic-jj-changes
description: Use when planning, starting, editing, reviewing, or describing jj changes in this portfolio project. Enforces one logical scope per change and requires a new described change before switching scopes.
---

# Atomic jj Changes

Use this skill with the `jujutsu` and `commit-message` skills for every change in this project.

## Non-Negotiable Rule

One jj change contains one logical, reviewable purpose. Never add unrelated work to an active change.

Create a new jj change before starting any work that differs in purpose, even if the files overlap.

Examples of separate purposes:

- A feature implementation.
- A bug fix.
- A refactor or terminology rename.
- A documentation correction or design-spec update.
- A visual-design adjustment.
- Test-only work.
- Build, CI, dependency, or configuration work.
- An unrelated user request received while another change is active.

## Required Workflow

1. Read `detailed_design/README.md` and the applicable design documents.
2. Inspect `jj st` before editing.
3. Identify the single purpose of the proposed work.
4. If `@` is non-empty or described for a different purpose, run `jj new`.
5. Load `commit-message` and immediately describe the new change with `jj desc -m ...` before editing.
6. Make only changes needed for that purpose.
7. Run the scoped verification.
8. Review `jj --no-pager diff --git` and `jj st` before reporting completion.

## Scope Switches

Stop and create a new change before doing any of the following:

- Updating docs to match implementation after completing code work.
- Renaming files, APIs, types, or classes after a feature change.
- Acting on a newly discovered improvement not required by the active request.
- Adding tests, formatting rules, or configuration unrelated to the active change.
- Responding to a new user request while a prior change remains active.

Do not rationalize a scope switch as a small follow-up. Size does not determine scope; purpose does.

## Ambiguity

If a documentation change is necessary to keep the feature specification accurate, it may belong to the feature change only when it is planned before implementation and directly describes that feature. If it is discovered after the feature is complete or corrects a pre-existing discrepancy, create a docs change.

If unsure whether work belongs in the active change, create a new change. Prefer multiple focused changes over one mixed change.

## Before Mutating Another Change

Do not edit a parent or named change unless the user explicitly identifies it. When asked to update a commit description, confirm the exact change ID or revision before running `jj desc -r`.

## Required Final Report

Report the change ID, its single purpose, verification performed, and any intentionally deferred follow-up work.
