import ArtifactsPage from "@/components/ArtifactsPage.tsx";
import { loadArtifactsIndex } from "@/lib/content/loadContent.ts";
import type { ArtifactsFilter } from "@/lib/shared/types.ts";
import { define } from "@/utils.ts";

const filters = new Set<ArtifactsFilter>([
  "all",
  "writing",
  "projects",
  "photography",
  "notes",
]);

export const handler = define.handlers({
  async GET(ctx) {
    const value = ctx.url.searchParams.get("type");
    if (!value) {
      const url = new URL(ctx.url);
      url.search = "?type=all";
      return Response.redirect(url, 302);
    }
    const filter = filters.has(value as ArtifactsFilter)
      ? value as ArtifactsFilter
      : "all";
    return { data: { filter, artifacts: await loadArtifactsIndex(filter) } };
  },
});

export default define.page<typeof handler>(function Artifacts({ data }) {
  return <ArtifactsPage {...data.artifacts} filter={data.filter} />;
});
