export interface Site {
  title: string;
  description: string;
  url: string;
  ga4_id: string;
  nav: Array<{ label: string; href: string }>;
  social: {
    email: string;
    linkedin: string;
    github: string;
  };
  resume: string;
  elsewhere: Array<{ label: string; href: string }>;
  show_writing_fixtures: boolean;
}

export interface LandingMetadata {
  label: "Focus" | "Based" | "Exploring";
  value: string;
}

export interface LandingFrontmatter {
  name: string;
  tagline: string;
  tagline_emphasis?: string;
  metadata: LandingMetadata[];
}

export interface Landing {
  frontmatter: LandingFrontmatter;
  html: string;
}
