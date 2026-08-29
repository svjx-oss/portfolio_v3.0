import { site } from "@/lib/site.ts";
import { define } from "@/utils.ts";

export default define.middleware((ctx) => {
  ctx.state.site = site;
  return ctx.next();
});
