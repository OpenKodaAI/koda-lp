import Link from "next/link";
import { CopyButton } from "@/components/ui/copy-button";

const INSTALL_COMMAND = "npx @openkodaai/koda@latest install";

export function CtaFinal() {
  return (
    <section
      id="cta"
      className="relative py-20 md:py-28 overflow-hidden bg-[#1A1A1A] text-[var(--dark-text-primary)]"
    >
      <div className="container-lp relative z-[1] text-center">
        <h2 className="display-serif text-[44px] sm:text-[60px] md:text-[80px] text-[var(--dark-text-primary)] leading-[0.98]">
          Start with the platform.
        </h2>
        <p className="mt-6 mx-auto max-w-[540px] text-[15.5px] md:text-[16.5px] leading-[1.55] text-[var(--dark-text-secondary)]">
          One command to bring up the stack — Postgres, object storage, runtime, and dashboard.
          Configure providers, agents, and skills from there.
        </p>

        {/* Install pill — same pattern as hero */}
        <div className="mt-10 mx-auto max-w-[720px]">
          <div className="flex items-center gap-3 rounded-full bg-black/60 backdrop-blur-md border border-white/10 p-1.5 pr-3">
            <a
              href="https://github.com/openkodaai/koda"
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 inline-flex h-11 items-center px-4 sm:px-5 rounded-full text-[13px] sm:text-[14px] md:text-[15px] font-medium hover:opacity-90 transition-opacity"
              style={{ background: "#E1E0CC", color: "#0C0C0C" }}
            >
              Install Koda
            </a>

            <code className="min-w-0 flex-1 flex items-center gap-2 overflow-x-auto font-mono text-[12.5px] sm:text-[13.5px] md:text-[15px] whitespace-nowrap scrollbar-hide">
              <span className="text-[#d97757]">npx</span>
              <span className="flex items-center">
                <span className="text-[#F5F5F5]">@openkodaai/koda</span>
                <span className="text-[#d97757]">@latest</span>
              </span>
              <span className="text-[#5b94ff]">install</span>
            </code>

            <CopyButton
              text={INSTALL_COMMAND}
              ariaLabel="Copy install command"
              className="shrink-0 h-9 w-9 flex items-center justify-center rounded-full text-white/60 hover:text-white hover:bg-white/10 transition-colors"
            />
          </div>

          <div className="mt-5 text-[14px] text-white/55">
            Or read the{" "}
            <Link
              href="/docs"
              className="underline underline-offset-4 decoration-white/30 hover:text-white hover:decoration-white transition-colors"
            >
              documentation
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
