import { createDefine } from "fresh";
import type { Accent, Site } from "@/lib/shared/types.ts";

export interface State {
  site: Site;
  accent?: Accent;
}

export const define = createDefine<State>();
