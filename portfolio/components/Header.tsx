import type { Site } from "@/lib/types.ts";

export default function Header(
  { site, pathname }: { site: Site; pathname: string },
) {
  const isBlogPost = pathname.startsWith("/blog/");

  return (
    <header
      class={`site-header${isBlogPost ? " site-header--reading" : ""}${
        pathname === "/" ? " site-header--home" : ""
      }`}
    >
      <div class="header-start">
        {isBlogPost && (
          <a class="header-back" href="/blog" aria-label="Back to Writing">
            <svg
              aria-hidden="true"
              viewBox="0 0 20 20"
              width="18"
              height="18"
              fill="none"
              stroke="currentColor"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M16 10H4M9 5l-5 5 5 5" />
            </svg>
          </a>
        )}
      </div>
      {pathname !== "/" && (
        <a class="site-logo" href="/" aria-label={`${site.title} home`}>
          <span aria-hidden="true">SJ</span>
        </a>
      )}
      <div class="header-end" />
    </header>
  );
}
