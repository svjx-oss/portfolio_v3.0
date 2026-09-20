import { classifyLinkEvent } from "@/islands/Analytics.tsx";

const link = (overrides: Partial<Parameters<typeof classifyLinkEvent>[0]>) =>
  classifyLinkEvent({
    href: "https://portfolio.example/about",
    pathname: "/about",
    origin: "https://portfolio.example",
    ...overrides,
  });

Deno.test("classifyLinkEvent respects explicit event names", () => {
  if (link({ event: "toc_click" }) !== "toc_click") {
    throw new Error("Expected explicit event names to win.");
  }
});

Deno.test("classifyLinkEvent identifies PDFs and internal links", () => {
  if (link({ pathname: "/resume.pdf" }) !== "resume_download") {
    throw new Error("Expected PDF links to be resume downloads.");
  }
  if (link({ pathname: "/things/example" }) !== "blog_open") {
    throw new Error("Expected internal Things links to be blog opens.");
  }
  if (link({ pathname: "/about" }) !== "nav_click") {
    throw new Error("Expected internal links to be navigation clicks.");
  }
});

Deno.test("classifyLinkEvent distinguishes Things and generic outbound links", () => {
  if (
    link({ href: "https://external.example", isThingsEntry: true }) !==
      "blog_outbound"
  ) {
    throw new Error(
      "Expected external Things links to be blog outbound events.",
    );
  }
  if (link({ href: "https://external.example" }) !== "outbound_click") {
    throw new Error("Expected generic external links to be outbound clicks.");
  }
});
