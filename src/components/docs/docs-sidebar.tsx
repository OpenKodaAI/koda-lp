import { docsNav } from "@/lib/docs/nav";
import { DocsSidebarLink } from "./docs-sidebar-link";

export function DocsSidebar({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <nav aria-label="Documentation navigation" className="flex flex-col gap-6">
      {docsNav.map((section, sectionIndex) => {
        const labelId = `docs-nav-section-${sectionIndex}`;
        return (
          <div
            key={section.label}
            role="group"
            aria-labelledby={labelId}
            className="flex flex-col gap-1"
          >
            <div
              id={labelId}
              className="px-3 pb-1 text-[11px] uppercase tracking-[0.14em] font-mono text-[var(--dark-text-tertiary)]"
            >
              {section.label}
            </div>
            <ul className="flex flex-col gap-0.5">
              {section.items.map((item) => (
                <li key={item.slug}>
                  <DocsSidebarLink
                    slug={item.slug}
                    title={item.title}
                    onNavigate={onNavigate}
                  />
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </nav>
  );
}
