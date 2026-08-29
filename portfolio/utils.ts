import { createDefine } from "fresh";
import type { Site } from "@/lib/types.ts";

export interface State {
  site: Site;
}

export const define = createDefine<State>();
