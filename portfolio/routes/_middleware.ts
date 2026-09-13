import { loadSite } from "@/lib/content/loadContent.ts";
import { define } from "@/utils.ts";

export default define.middleware(async (ctx) => {
  ctx.state.site = await loadSite();
  return ctx.next();
});
