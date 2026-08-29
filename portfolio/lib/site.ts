import type { Site } from "./types.ts";

export const site: Site = {
  title: "Sahil Jaganmohan",
  description: "Portfolio and details about Sahil Jaganmohan",
  nav: [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
    { label: "Experience", href: "/experience" },
    { label: "Projects", href: "/projects" },
    { label: "Writing", href: "/blog" },
  ],
  social: {
    email: "mailto:dev.sahil.jaganmohan@gmail.com",
    linkedin: "https://www.linkedin.com/in/sahil-jaganmohan",
    github: "https://github.com/bullpointe",
  },
  resume: "/resume.pdf",
};
