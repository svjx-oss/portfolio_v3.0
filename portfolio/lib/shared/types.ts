export interface Site {
  title: string;
  description: string;
  url: string;
  ga4_id: string;
  nav: Array<{ label: string; href: string; accent: Accent }>;
}

export interface Contact {
  key: string;
  label: string;
  href: string;
  accent: Accent;
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
  summary?: string;
  color: string;
  current?: boolean;
  content: string;
  html: string;
}

export interface Experience {
  entries: ExperienceEntry[];
}

export type ArtifactsEntryType =
  | "project"
  | "writing"
  | "photography"
  | "notes"
  | "external";

export interface ArtifactsEntry {
  title: string;
  date: string;
  type: ArtifactsEntryType;
  excerpt: string;
  tags: string[];
  status: "published" | "draft";
  slug?: string;
  md?: string;
  external_url?: string;
}

export interface ArtifactsImage {
  width: number;
  height: number;
  caption?: string;
}

export interface Artifacts {
  entries: ArtifactsEntry[];
}

export type ArtifactsFilter =
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

export interface ArtifactsPost extends ArtifactsEntry {
  accent: Accent;
  html: string;
  headings: Heading[];
}
import type { Accent } from "@/lib/shared/accents.ts";

export type { Accent } from "@/lib/shared/accents.ts";
