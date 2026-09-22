import Layout from "@/components/Layout.tsx";
import Seo from "@/components/Seo.tsx";
import { loadThingsPost } from "@/lib/content/loadContent.ts";
import { define } from "@/utils.ts";

export default define.page(async function App(ctx) {
  const { site } = ctx.state;
  const slug = ctx.url.pathname.match(/^\/things\/([^/]+)$/)?.[1];
  const loadedPost = slug ? await loadThingsPost(slug) : null;
  const post = loadedPost && slug
    ? { slug, title: loadedPost.title, excerpt: loadedPost.excerpt }
    : undefined;
  return (
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&family=JetBrains+Mono:wght@400;500;600&display=swap"
        />
        <Seo
          site={site}
          pathname={ctx.url.pathname}
          hostname={ctx.url.hostname}
          post={post}
        />
      </head>
      <body>
        <a class="skip-link" href="#main-content">Skip to content</a>
        <Layout
          site={site}
          pathname={ctx.url.pathname}
          hostname={ctx.url.hostname}
          accent={ctx.state.accent}
        >
          <ctx.Component />
        </Layout>
      </body>
    </html>
  );
});
