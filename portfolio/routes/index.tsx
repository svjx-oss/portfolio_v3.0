import Landing from "@/components/Landing.tsx";
import { loadLanding } from "@/lib/loadContent.ts";
import { define } from "@/utils.ts";

export const handler = define.handlers({
  async GET() {
    return { data: { landing: await loadLanding() } };
  },
});

export default define.page<typeof handler>(function Home({ data }) {
  return <Landing {...data.landing} />;
});
