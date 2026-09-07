import Layout from "@/components/Layout.tsx";
import Seo from "@/components/Seo.tsx";
import { define } from "@/utils.ts";

export default define.page(function App(ctx) {
  const { site } = ctx.state;
  return (
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap"
        />
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
