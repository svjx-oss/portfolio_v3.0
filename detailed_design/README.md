# Detailed Design Guide

Use this guide before changing the portfolio. The design documents define the product; `implementation_plan/implementation_plan.md` defines implementation order.

## Read By Task

| Task | Read |
| --- | --- |
| Any change | [Personal Portfolio Linear project](https://linear.app/svjx/project/personal-portfolio-6202ca3cda15) and `implementation_plan/implementation_plan.md` |
| Application structure, routes, or components | `high_level_designs/00_high_level_architecture.md` |
| Shared styles, layout, responsive behavior, or accessibility | `high_level_designs/01_theme_and_design_system.md`, `03_layout_and_navigation.md`, and `09_wireframes.md` |
| Content, Markdown, validation, or loaders | `high_level_designs/02_content_data_model.md` |
| Page-specific work | The matching document in `pages/` |
| Analytics, deployment, testing, or content authoring | The matching document in `addons/` |
| jj change descriptions | `.agents/skills/commit-message/SKILL.md` |

## Authority

1. Linear controls issue status, review approval, blockers, and discussion.
2. `implementation_plan/implementation_plan.md` controls implementation order and verification.
3. `commit-message` controls jj change-description format and Linear trailers.
4. High-level design documents control shared product decisions.
5. Page and addon documents control their specialized requirements.

If documents conflict at the same authority level, ask for clarification.

## Linear Workflow

1. Before approved work begins, move the issue to `In Progress`.
2. Do not add Linear comments for implementation progress, commit details, verification, review requests, or any other routine issue activity; GitHub-linked commits and issue metadata are the source of truth.
3. Add a comment only when changing the status of a bug or closing a bug, and state the reason for that transition.
4. Once a bug's implementation is complete, move it to `In Review` so either the author or reviewer can mark it `Done` after approval; add a comment only for the bug status transition or closure.
