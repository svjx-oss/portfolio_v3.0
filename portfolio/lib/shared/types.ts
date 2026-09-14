export interface Site {
  title: string;
  description: string;
  url: string;
  ga4_id: string;
  nav: Array<{ label: string; href: string; accent: string }>;
}

export interface Contact {
  key: string;
  label: string;
  href: string;
  accent: string;
  external?: boolean;
}

export interface LandingMetadata {
  label: string;
  value: string;
}

export interface Landing {
  name: string;
  tagline: string;
  tagline_emphasis?: string;
  metadata: LandingMetadata[];
  contacts: Contact[];
}

export interface LandingContent extends Landing {
  html: string;
}

export interface About {
  portrait: string;
  portrait_alt: string;
}

export interface AboutContent extends About {
  html: string;
}

export interface ExperienceEntry {
  year: string;
  company: string;
  role: string;
  location: string;
  dates: string;
  summary: string;
  color: string;
  current?: boolean;
  content: string;
  html: string;
}

export interface Experience {
  entries: ExperienceEntry[];
}

export type ThingsEntryType =
  | "project"
  | "writing"
  | "photography"
  | "notes"
  | "external";

export type Accent =
  | "sienna"
  | "coral"
  | "blue"
  | "magenta"
  | "green"
  | "violet"
  | "teal"
  | "gold";

export interface ThingsEntry {
  title: string;
  date: string;
  type: ThingsEntryType;
  excerpt: string;
  tags: string[];
  status: "published" | "draft";
  slug?: string;
  md?: string;
  external_url?: string;
}

export interface ThingsImage {
  width: number;
  height: number;
}

export interface Things {
  entries: ThingsEntry[];
}

export type ThingsFilter =
  | "all"
  | "writing"
  | "projects"
  | "photography"
  | "notes";

export interface Heading {
  id: string;
  level: 1 | 2;
  text: string;
}

export interface ThingsPost extends ThingsEntry {
  accent: Accent;
  html: string;
  headings: Heading[];
}
