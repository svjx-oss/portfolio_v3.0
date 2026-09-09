import TimelinePage from "@/components/TimelinePage.tsx";
import { loadTimeline } from "@/lib/loadContent.ts";
import { define } from "@/utils.ts";

export const handler = define.handlers({
  async GET() {
    return { data: { timeline: await loadTimeline() } };
  },
});

export default define.page<typeof handler>(function Experience({ data }) {
  return <TimelinePage {...data.timeline} />;
});
