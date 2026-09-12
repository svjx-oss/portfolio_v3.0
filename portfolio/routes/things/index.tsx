import ThingsPage from "@/components/ThingsPage.tsx";
import { loadThingsIndex } from "@/lib/loadContent.ts";
import { define } from "@/utils.ts";

export const handler = define.handlers({
  async GET() {
    return { data: { things: await loadThingsIndex() } };
  },
});

export default define.page<typeof handler>(function Things({ data }) {
  return <ThingsPage {...data.things} />;
});
