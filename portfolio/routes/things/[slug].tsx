import ThingsPostPage from "@/components/ThingsPostPage.tsx";
import { loadThingsPost } from "@/lib/content/loadContent.ts";
import { define } from "@/utils.ts";

export const handler = define.handlers({
  async GET(ctx) {
    const post = await loadThingsPost(ctx.params.slug);
    if (!post) return new Response(null, { status: 404 });
    return { data: { post } };
  },
});

export default define.page<typeof handler>(function ThingsPost({ data }) {
  return <ThingsPostPage {...data.post} />;
});
