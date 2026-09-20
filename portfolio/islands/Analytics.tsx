import { useEffect } from "preact/hooks";

const analytics = globalThis as typeof globalThis & {
  gtag?: (...args: unknown[]) => void;
};

function track(name: string, params: Record<string, string | number> = {}) {
  analytics.gtag?.("event", name, params);
}

export interface AnalyticsLink {
  href: string;
  pathname: string;
  origin: string;
  event?: string;
  isThingsEntry?: boolean;
}

export function classifyLinkEvent(link: AnalyticsLink) {
  if (link.event) return link.event;
  if (link.pathname.endsWith(".pdf")) return "resume_download";
  if (link.href.startsWith(link.origin)) {
    if (link.pathname.startsWith("/things/")) return "blog_open";
    return "nav_click";
  }
  return link.isThingsEntry ? "blog_outbound" : "outbound_click";
}

export default function Analytics() {
  useEffect(() => {
    const thresholds = new Set<number>();
    const onClick = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      const link = target.closest("a");
      if (!link) return;
      const name = classifyLinkEvent({
        href: link.href,
        pathname: link.pathname,
        origin: globalThis.location.origin,
        event: link.dataset.event,
        isThingsEntry: Boolean(
          link.closest('[data-analytics-context="things-entry"]'),
        ),
      });
      track(name);
    };
    const onScroll = () => {
      const height = document.documentElement.scrollHeight -
        globalThis.innerHeight;
      if (height <= 0) return;
      const progress = Math.round((globalThis.scrollY / height) * 100);
      for (const threshold of [25, 50, 75, 100]) {
        if (progress >= threshold && !thresholds.has(threshold)) {
          thresholds.add(threshold);
          track("scroll_depth", { percent: threshold });
        }
      }
    };
    document.addEventListener("click", onClick);
    globalThis.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      document.removeEventListener("click", onClick);
      globalThis.removeEventListener("scroll", onScroll);
    };
  }, []);

  return null;
}
