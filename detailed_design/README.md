# Detailed Design Reading Guide

Use this document to orient yourself before changing the portfolio. The design documents describe the intended product; `implementation_plan/implementation_plan.md` defines the implementation sequence.

## Read First

1. Read `implementation_plan/implementation_progress.md` to determine the active change, its verification state, and whether work is awaiting user review.
2. Read `implementation_plan/implementation_plan.md` to understand the current change's scope, required verification, and the review gate. Do not begin a new change without explicit user approval of the preceding one.
3. Read `high_level_designs/00_high_level_architecture.md` for application structure, routes, content locations, and shared implementation rules.
4. Read `high_level_designs/01_theme_and_design_system.md` for the visual system, tokens, responsive behavior, and accessibility constraints.
5. Read `high_level_designs/02_content_data_model.md` for content schemas, loaders, Markdown behavior, validation, and fixture rules.
6. Read `high_level_designs/03_layout_and_navigation.md` and `high_level_designs/09_wireframes.md` for shared layout and visual geometry.
7. Read the page specification that corresponds to the active change.
8. Read relevant `addons/` documents for release, analytics, testing, or content-authoring requirements.

## Folder Guide

| Path | Purpose | Read when |
|---|---|---|
| `implementation_progress.md` | Persistent record of the active change, completed verification, review status, and next action. | Before and after every implementation change. |
| `implementation_plan/` | The authoritative vertical-slice build order and definition of done. | Before scoping or beginning any change. |
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

1. `implementation_progress.md` controls whether work may proceed.
2. `implementation_plan/implementation_plan.md` controls implementation order and review gates.
3. `high_level_designs/01_theme_and_design_system.md` controls shared visual and accessibility decisions.
4. `high_level_designs/02_content_data_model.md` controls content schemas and validation behavior.
5. A page specification controls its page-specific requirements.
6. An addon controls its specialized operational area.

If two documents conflict at the same level of authority, stop and ask for clarification rather than inventing a new rule. Keep documentation changes small and update every affected document when an approved product decision changes.
