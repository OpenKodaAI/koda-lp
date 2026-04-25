import type { DocPage } from "@/lib/docs/types";
import { OnThisPage } from "./on-this-page";
import { PrevNext } from "./prev-next";

export function DocPageLayout({ page }: { page: DocPage }) {
  const Content = page.content;
  const headings = page.headings ?? [];

  return (
    <div className="grid lg:grid-cols-[1fr_220px] gap-10">
      <article className="min-w-0 max-w-[720px]">
        <header className="flex flex-col gap-3 mb-8">
          <span className="text-[11px] uppercase tracking-[0.14em] font-mono text-[var(--dark-text-tertiary)]">
            {page.section}
          </span>
          <h1 className="display-serif text-[36px] md:text-[44px] font-medium text-[var(--dark-text-primary)] leading-[1.1]">
            {page.title}
          </h1>
          {page.description && (
            <p className="text-[16.5px] leading-[1.55] text-[var(--dark-text-secondary)] max-w-[620px]">
              {page.description}
            </p>
          )}
        </header>

        <div className="h-px w-full bg-gradient-to-r from-transparent via-white/[0.08] to-transparent my-8" />

        <div className="docs-prose">
          <Content />
        </div>

        <PrevNext slug={page.slug} />
      </article>

      <OnThisPage headings={headings} />
    </div>
  );
}
