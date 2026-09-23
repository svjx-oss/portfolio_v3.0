import ArtifactsPostPage from "@/components/ArtifactsPostPage.tsx";
import { loadArtifactsPost } from "@/lib/content/loadContent.ts";
import { define } from "@/utils.ts";

export const handler = define.handlers({
  async GET(ctx) {
    const post = await loadArtifactsPost(ctx.params.slug);
    if (!post) return new Response(null, { status: 404 });
    ctx.state.accent = post.accent;
    return { data: { post } };
  },
});

export default define.page<typeof handler>(function ArtifactsPost({ data }) {
  return <ArtifactsPostPage {...data.post} />;
});
