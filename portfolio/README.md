# Portfolio

Personal portfolio and Things publication built with Deno and Fresh.

## Quick Start

```sh
git clone <repository-url>
cd Portfolio_v3.0/portfolio
deno install
deno task dev
```

Open `http://localhost:5173`.

Install Deno 2.9 or newer before starting. See
<https://docs.deno.com/runtime/getting_started/installation/>.

## Commands

```sh
deno task dev          # Start the local development server.
deno task generate:og  # Regenerate Things social-preview images.
deno task check        # Format check, lint, type-check, tests, and content validation.
deno task build        # Generate previews, create a production build, and validate content.
deno task preview      # Serve the production build after `deno task build`.
deno task validate     # Validate content files only.
```

For a production-like local review:

```sh
deno task build
deno task preview
```

Run `deno task check` before submitting a change. It is the complete local
verification command.

## Content

Edit site and page content in `content/`; the application code loads and
renders these files at request time.

| Content | Location |
| --- | --- |
| Site title, URL, navigation, analytics ID | `content/site.json` |
| Landing page | `content/landing/` |
| About page | `content/about/` |
| Experience timeline and entries | `content/experience/` |
| Things index metadata | `content/things/things.json` |
| Things post Markdown and post assets | `content/things/posts/<slug>/` |

Shared UI and server code live in `components/`, `routes/`, `lib/`, and
`assets/`. Read `../detailed_design/README.md` before making product changes;
it links to the applicable design and implementation documents.

## Open Graph Images

`static/og/default.png` is the fallback social-preview image for site pages.
Each published Things post has a generated preview at
`static/og/things/<slug>.png`.

After changing a Things post title, excerpt, type, or date, regenerate the
previews:

```sh
deno task generate:og
```

The command fetches Inter from Google Fonts and rewrites every published Things
preview. `deno task build` runs it automatically before building the site.

## Deployment

Build and review locally first:

```sh
deno task check
deno task build
deno task preview
```

Deploy with Deno Deploy after the production configuration in `content/site.json`
is correct:

```sh
deno deploy --prod
```
