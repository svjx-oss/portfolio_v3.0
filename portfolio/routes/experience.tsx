import ExperiencePage from "@/components/ExperiencePage.tsx";
import { loadExperience } from "@/lib/content/loadContent.ts";
import { define } from "@/utils.ts";

export const handler = define.handlers({
  async GET() {
    return { data: { experience: await loadExperience() } };
  },
});

export default define.page<typeof handler>(function Experience({ data }) {
  return <ExperiencePage {...data.experience} />;
});
