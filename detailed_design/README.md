# Detailed Design Reading Guide

Use this document to orient yourself before changing the portfolio. The design documents describe the intended product; `implementation_plan/implementation_plan.md` defines the implementation sequence.

## Read First

1. Open the [Personal Portfolio Linear project](https://linear.app/svjx/project/personal-portfolio-6202ca3cda15) to determine the active issue, its status, review discussion, actual blockers, and next action. Linear is the operational source of truth for progress.
2. Read `implementation_plan/implementation_plan.md` to understand the active change's scope and required verification. Do not begin a new change without explicit user approval of the preceding change.
3. Load `.agents/skills/commit-message/SKILL.md` before creating or describing a jj change. It defines the required `Issue:` and conditional `Fixes:` trailers.
4. Read `high_level_designs/00_high_level_architecture.md` for application structure, routes, content locations, and shared implementation rules.
5. Read `high_level_designs/01_theme_and_design_system.md` for the visual system, tokens, responsive behavior, and accessibility constraints.
6. Read `high_level_designs/02_content_data_model.md` for content schemas, loaders, Markdown behavior, validation, and fixture rules.
7. Read `high_level_designs/03_layout_and_navigation.md` and `high_level_designs/09_wireframes.md` for shared layout and visual geometry.
8. Read the page specification that corresponds to the active change.
9. Read relevant `addons/` documents for release, analytics, testing, or content-authoring requirements.

## Folder Guide

| Path | Purpose | Read when |
|---|---|---|
| [Personal Portfolio Linear project](https://linear.app/svjx/project/personal-portfolio-6202ca3cda15) | Operational source of truth for issues, statuses, user review, actual blockers, and discussion. | Before, during, and after every implementation change. |
| `implementation_plan/` | The authoritative vertical-slice build order and definition of done. | Before scoping or beginning any change. |
| `.agents/skills/commit-message/` | Required jj change-description format, including Linear issue trailers. | Before describing any jj change. |
| `high_level_designs/` | Cross-site architecture, design system, content model, shared layout, and wireframes. | Before changing shared code, content handling, layout, styles, or behavior. |
| `pages/` | Page-specific structure, content rules, responsive behavior, and acceptance criteria. | Before implementing or modifying that page. |
| `addons/` | Supporting operational requirements: analytics, deployment and maintenance, testing, and content authoring. | When the active change or release task concerns that subject. |

## Core Documents

| File | Authority |
|---|---|
| `high_level_designs/00_high_level_architecture.md` | Directory structure, route map, component boundaries, and technical principles. |
| `high_level_designs/01_theme_and_design_system.md` | Visual tokens and non-negotiable visual/accessibility rules. |
| `high_level_designs/02_content_data_model.md` | Content file shapes, validation rules, Markdown pipeline, and production fixture behavior. |
| `high_level_designs/03_layout_and_navigation.md` | Application shell, navigation, footer, SEO, and shared interaction behavior. |
| `high_level_designs/09_wireframes.md` | Page geometry and responsive layout intent. |
| `pages/04_page_landing.md` through `pages/08_page_blog.md` | Individual page requirements and acceptance criteria. |
| `addons/10_analytics.md` | Optional GA4 policy and event contract. |
| `addons/11_build_deploy_maintenance.md` | Commands, deployment, and maintenance procedures. |
| `addons/12b_testing_strategy.md` | Automated and manual test requirements. |
| `addons/13_content_authoring_guide.md` | Authoring and release guidance for content. |

## Conflict Resolution

1. The [Personal Portfolio Linear project](https://linear.app/svjx/project/personal-portfolio-6202ca3cda15) controls operational status, review approval, actual blockers, and issue discussion.
2. `implementation_plan/implementation_plan.md` controls implementation order and required verification.
3. `.agents/skills/commit-message/SKILL.md` controls jj change-description format and issue trailers.
4. `high_level_designs/01_theme_and_design_system.md` controls shared visual and accessibility decisions.
5. `high_level_designs/02_content_data_model.md` controls content schemas and validation behavior.
6. A page specification controls its page-specific requirements.
7. An addon controls its specialized operational area.

If two documents conflict at the same level of authority, stop and ask for clarification rather than inventing a new rule. Keep documentation changes small and update every affected document when an approved product decision changes.
