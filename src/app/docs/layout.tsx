import { Footer } from "@/components/footer";
import { DocsTopBar } from "@/components/docs/docs-top-bar";
import { DocsSidebar } from "@/components/docs/docs-sidebar";
import { MobileSidebarDrawer } from "@/components/docs/mobile-sidebar-drawer";

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--dark-canvas)] text-[var(--dark-text-primary)]">
      <a
        href="#docs-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[70] focus:px-3 focus:py-2 focus:rounded-[8px] focus:bg-[var(--dark-panel)] focus:text-[var(--dark-text-primary)] focus:border focus:border-white/[0.12]"
      >
        Skip to content
      </a>

      <DocsTopBar />

      <div className="flex-1 container-lp pt-10 pb-20 lg:pt-12">
        <div className="lg:grid lg:grid-cols-[240px_1fr] lg:gap-10">
          <aside
            aria-label="Documentation sections"
            className="hidden lg:block sticky top-20 max-h-[calc(100vh-6rem)] overflow-y-auto scrollbar-hide pr-2"
          >
            <DocsSidebar />
          </aside>

          <div className="min-w-0">
            <div className="lg:hidden mb-6">
              <MobileSidebarDrawer />
            </div>
            <main id="docs-content">{children}</main>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
