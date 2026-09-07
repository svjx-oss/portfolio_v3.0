import AboutPage from "@/components/AboutPage.tsx";
import { loadAbout } from "@/lib/loadContent.ts";
import { define } from "@/utils.ts";

export const handler = define.handlers({
  async GET() {
    return { data: { about: await loadAbout() } };
  },
});

export default define.page<typeof handler>(function About({ data }) {
  return <AboutPage {...data.about} />;
});
