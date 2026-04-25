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

        {/* Install pill — button + command + copy */}
        <div className="mt-10 mx-auto max-w-[720px]">
          <div className="flex items-center gap-3 p-1.5 rounded-[14px] bg-black/55 border border-white/[0.08] shadow-[0_1px_0_rgba(255,255,255,0.04)_inset,0_8px_24px_rgba(0,0,0,0.35)]">
            <a
              href="https://github.com/openkodaai/koda"
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 inline-flex h-10 items-center px-4 rounded-[10px] bg-[#fffefb] text-[13.5px] font-medium text-[#0C0C0C] hover:bg-white transition-colors"
            >
              Install Koda
            </a>

            <code className="flex-1 min-w-0 flex items-center gap-2 overflow-x-auto font-mono text-[13.5px] whitespace-nowrap scrollbar-hide">
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
              className="shrink-0 h-9 w-9 flex items-center justify-center rounded-[8px] text-white/55 hover:text-white hover:bg-white/[0.06] transition-colors"
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
