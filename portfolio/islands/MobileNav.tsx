import { useEffect, useRef } from "preact/hooks";

interface NavItem {
  label: string;
  href: string;
}

export default function MobileNav(
  { nav, pathname }: { nav: NavItem[]; pathname: string },
) {
  const detailsRef = useRef<HTMLDetailsElement>(null);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && detailsRef.current?.open) {
        detailsRef.current.open = false;
        detailsRef.current.querySelector("summary")?.focus();
      }
    };
    const onPointerDown = (event: PointerEvent) => {
      if (
        detailsRef.current?.open &&
        !detailsRef.current.contains(event.target as Node)
      ) {
        detailsRef.current.open = false;
      }
    };
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, []);

  return (
    <details class="nav-dropdown" ref={detailsRef}>
      <summary class="nav-trigger" aria-label="Toggle navigation">Menu</summary>
      <nav class="nav-menu" aria-label="Primary navigation">
        {nav.map((item) => (
          <a
            href={item.href}
            aria-current={item.href === pathname ? "page" : undefined}
            onClick={() => {
              if (detailsRef.current) detailsRef.current.open = false;
            }}
          >
            {item.label}
          </a>
        ))}
      </nav>
    </details>
  );
}
