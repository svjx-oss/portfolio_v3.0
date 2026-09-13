import ThingsPage from "@/components/ThingsPage.tsx";
import { loadThingsIndex } from "@/lib/content/loadContent.ts";
import type { ThingsFilter } from "@/lib/shared/types.ts";
import { define } from "@/utils.ts";

const filters = new Set<ThingsFilter>([
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
    const filter = filters.has(value as ThingsFilter)
      ? value as ThingsFilter
      : "all";
    return { data: { filter, things: await loadThingsIndex(filter) } };
  },
});

export default define.page<typeof handler>(function Things({ data }) {
  return <ThingsPage {...data.things} filter={data.filter} />;
});
