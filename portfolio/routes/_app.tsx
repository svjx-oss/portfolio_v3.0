import Layout from "@/components/Layout.tsx";
import Seo from "@/components/Seo.tsx";
import { define } from "@/utils.ts";

export default define.page(function App(ctx) {
  const { site } = ctx.state;
  return (
    <html lang="en" data-theme="dark" data-theme-preference="system">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <Seo site={site} pathname={ctx.url.pathname} />
      </head>
      <body>
        <a class="skip-link" href="#main-content">Skip to content</a>
        <Layout site={site} pathname={ctx.url.pathname}>
          <ctx.Component />
        </Layout>
      </body>
    </html>
  );
});
