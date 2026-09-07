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
