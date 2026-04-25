import Link from "next/link";
import { KodaMark } from "@/components/ui/koda-mark";

const columns = [
  {
    heading: "Product",
    links: [
      { label: "Features", href: "#features" },
      { label: "How it works", href: "#how" },
      { label: "Foundations", href: "#foundations" },
    ],
  },
  {
    heading: "Docs",
    links: [
      { label: "Overview", href: "/docs" },
      { label: "Architecture", href: "/docs/concepts/architecture" },
      { label: "Skills", href: "/docs/skills/authoring-a-skill" },
    ],
  },
  {
    heading: "Community",
    links: [
      { label: "GitHub", href: "https://github.com/openkodaai/koda" },
      { label: "Discussions", href: "https://github.com/openkodaai/koda/discussions" },
      { label: "Security", href: "https://github.com/openkodaai/koda/blob/main/SECURITY.md" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="section-dark py-16">
      <div className="container-lp">
        <div className="grid grid-cols-2 md:grid-cols-[1.4fr_repeat(3,1fr)] gap-10">
          <div>
            <div className="flex items-center gap-2">
              <KodaMark variant="white" size={28} />
              <span className="text-[17px] font-semibold tracking-tight text-[var(--dark-text-primary)]">
                koda
              </span>
            </div>
            <p className="mt-4 text-[13.5px] leading-[1.55] text-[var(--dark-text-tertiary)] max-w-[280px]">
              The open-source harness for multi-agent, multi-provider AI — operator-first, durable, and
              inspectable by design.
            </p>
          </div>

          {columns.map((col) => (
            <div key={col.heading}>
              <div className="text-[12px] uppercase tracking-[0.14em] font-mono text-[var(--dark-text-tertiary)]">
                {col.heading}
              </div>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link
                      href={l.href}
                      className="text-[14px] text-[var(--dark-text-secondary)] hover:text-[var(--dark-text-primary)] transition-colors"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-[rgba(255,255,255,0.05)] flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
          <div className="text-[12.5px] font-mono text-[var(--dark-text-tertiary)]">
            © {new Date().getFullYear()} Koda. MIT-licensed.
          </div>
          <div className="text-[12.5px] font-mono text-[var(--dark-text-tertiary)]">
            Built to orchestrate, not to lock in.
          </div>
        </div>
      </div>
    </footer>
  );
}
