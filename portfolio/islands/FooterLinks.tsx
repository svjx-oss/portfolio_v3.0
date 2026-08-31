import { useEffect, useState } from "preact/hooks";

interface LinkItem {
  label: string;
  href: string;
  accent: string;
  external?: boolean;
}

export default function FooterLinks(
  { label, icon, links }: {
    label: string;
    icon: "contact" | "pages";
    links: LinkItem[];
  },
) {
  const [open, setOpen] = useState(false);
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    if (!closing) return;
    const timeout = globalThis.setTimeout(() => {
      setClosing(false);
      setOpen(false);
    }, 360);
    return () => globalThis.clearTimeout(timeout);
  }, [closing]);

  return (
    <nav class="footer-links footer-links--disclosure" aria-label={label}>
      <button
        class="footer-links__toggle"
        type="button"
        aria-expanded={open && !closing}
        aria-label={`${open ? "Hide" : "Show"} ${label.toLowerCase()}`}
        onClick={() => {
          if (open) setClosing(true);
          else setOpen(true);
        }}
      >
        <span>{icon === "contact" ? "Contact" : "Pages"}</span>
        <span aria-hidden="true">{open && !closing ? "−" : "+"}</span>
      </button>
      {open && (
        <div class="footer-links__items">
          {links.map((link) => (
            <a
              key={link.href}
              class={`${link.accent} footer-links__item${
                closing ? " footer-links__item--closing" : ""
              }`}
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
    </nav>
  );
}
