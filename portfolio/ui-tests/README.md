# UI Tests

Start the development server in one terminal:

```sh
deno task dev
```

Install Chromium once, then run the UI tests from another terminal:

```sh
deno task test:ui:install
deno task test:ui --host=127.0.0.1 --port=5173
```

Chromium is stored in `ui-tests/.playwright/`.
