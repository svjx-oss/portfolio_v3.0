import { useState } from "preact/hooks";

interface LinkItem {
  label: string;
  href: string;
  accent: string;
  external?: boolean;
}

export default function ElsewhereLinks({ links }: { links: LinkItem[] }) {
  const [open, setOpen] = useState(false);

  return (
    <section class="landing-elsewhere">
      <button
        class={`landing-elsewhere__toggle${
          open ? " landing-elsewhere__toggle--open" : ""
        }`}
        type="button"
        aria-expanded={open}
        onClick={() => setOpen(!open)}
      >
        <span>Elsewhere</span>
        <span aria-hidden="true">{open ? "−" : "+"}</span>
      </button>
      {open && (
        <div class="landing-elsewhere__links">
          {links.map((link) => (
            <a
              key={link.href}
              class={link.accent}
              href={link.href}
              target={link.external ? "_blank" : undefined}
              rel={link.external ? "noopener noreferrer" : undefined}
              aria-label={link.external
                ? `${link.label} (opens in a new tab)`
                : undefined}
            >
              {link.label}
            </a>
          ))}
        </div>
      )}
    </section>
  );
}
