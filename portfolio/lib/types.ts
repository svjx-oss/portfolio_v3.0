export interface Site {
  title: string;
  description: string;
  nav: Array<{ label: string; href: string }>;
  social: {
    email: string;
    linkedin: string;
    github: string;
  };
  resume: string;
}
