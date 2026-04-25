import Link from "next/link";
import { KodaMark } from "@/components/ui/koda-mark";
import { CopyButton } from "@/components/ui/copy-button";

const INSTALL_COMMAND = "npx @openkodaai/koda@latest install";

const chips = [
  {
    label: "Run agents across providers",
    animClass: "chip-drift-a",
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
        <circle cx="9" cy="9" r="7.5" stroke="#0C0C0C" strokeWidth="1.4" />
        <path d="M3.5 9.5c1.5-1.8 4-2.8 5.5-2.8s4 1 5.5 2.8" stroke="#0C0C0C" strokeWidth="1.4" strokeLinecap="round" />
      </svg>
    ),
    position: "top-[62%] left-[3%] xl:left-[6%]",
  },
  {
    label: "Ground with retrieval & memory",
    animClass: "chip-drift-b",
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
        <rect x="2.5" y="2.5" width="13" height="13" rx="3" stroke="#0C0C0C" strokeWidth="1.4" />
        <path d="M6 9h6M6 6h4M6 12h5" stroke="#0C0C0C" strokeWidth="1.4" strokeLinecap="round" />
      </svg>
    ),
    position: "top-[76%] left-[8%] xl:left-[12%]",
  },
  {
    label: "Turn Skills into abilities",
    animClass: "chip-drift-c",
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
        <path d="M9 2l2 4.5 4.8.5-3.5 3.3L13.5 15 9 12.7 4.5 15l1.2-4.7L2.2 7l4.8-.5z" stroke="#0C0C0C" strokeWidth="1.4" strokeLinejoin="round" />
      </svg>
    ),
    position: "top-[62%] right-[3%] xl:right-[6%]",
  },
  {
    label: "Operator-first control plane",
    animClass: "chip-drift-d",
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
        <circle cx="9" cy="9" r="2.3" stroke="#0C0C0C" strokeWidth="1.4" />
        <circle cx="9" cy="9" r="7" stroke="#0C0C0C" strokeWidth="1.4" />
        <path d="M9 2v1.8M9 14.2V16M2 9h1.8M14.2 9H16" stroke="#0C0C0C" strokeWidth="1.4" strokeLinecap="round" />
      </svg>
    ),
    position: "top-[76%] right-[8%] xl:right-[12%]",
  },
  {
    label: "Durable state by default",
    animClass: "chip-drift-c",
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
        <ellipse cx="9" cy="4.5" rx="5.5" ry="2" stroke="#0C0C0C" strokeWidth="1.4" />
        <path d="M3.5 4.5v9c0 1.1 2.5 2 5.5 2s5.5-.9 5.5-2v-9" stroke="#0C0C0C" strokeWidth="1.4" />
        <path d="M3.5 9c0 1.1 2.5 2 5.5 2s5.5-.9 5.5-2" stroke="#0C0C0C" strokeWidth="1.4" />
      </svg>
    ),
    position: "top-[88%] left-[42%] xl:left-[44%]",
  },
];

export function Hero() {
  return (
    <section className="hero-sky relative overflow-hidden min-h-[640px] md:min-h-[720px]">
      <div className="container-lp relative z-[5] pt-20 md:pt-24 pb-36 text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <KodaMark variant="black" size={28} className="drop-shadow-[0_1px_0_rgba(255,255,255,0.4)]" />
          <span className="text-[17px] font-semibold tracking-tight text-[#0C0C0C]">koda</span>
        </div>

        <h1
          className="display-serif text-[#0C0C0C] text-[32px] sm:text-[42px] md:text-[54px] lg:text-[60px] leading-[1.02] font-medium tracking-[-0.025em]"
          style={{ textShadow: "0 1px 0 rgba(255,255,255,0.18)" }}
        >
          Many agents. Many providers.
          <br />
          One harness.
        </h1>

        <p className="mt-6 mx-auto max-w-[620px] text-[15px] md:text-[16px] leading-[1.55] text-[#1f1c17]">
          Koda is the open-source harness for multi-agent, multi-provider systems. A control
          plane you actually use, durable state by default, and every runtime action inspectable
          from day one.
        </p>

        <div className="mt-8 mx-auto max-w-[620px]">
          <div className="flex items-center gap-3 p-1.5 rounded-[14px] bg-black border border-white/[0.08] shadow-[0_1px_0_rgba(255,255,255,0.06)_inset,0_10px_30px_rgba(0,0,0,0.35)]">
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

          <div className="mt-4 text-[13.5px] text-[#1f1c17]/65">
            Or read the{" "}
            <Link
              href="/docs"
              className="underline underline-offset-4 decoration-[#1f1c17]/40 hover:text-[#0C0C0C] hover:decoration-[#0C0C0C] transition-colors"
            >
              documentation
            </Link>
          </div>
        </div>
      </div>

      {/* Floating chips */}
      <div className="absolute inset-0 z-[4] pointer-events-none hidden lg:block">
        {chips.map((c, i) => (
          <div
            key={i}
            className={`absolute ${c.position} ${c.animClass}`}
          >
            <div className="inline-flex items-center gap-2.5 px-3.5 py-2.5 rounded-[14px] bg-[rgba(255,252,248,0.82)] backdrop-blur-md border border-[rgba(40,55,42,0.18)] shadow-[0_1px_0_rgba(255,255,255,0.4)_inset,0_6px_18px_rgba(28,40,30,0.10)]">
              <span className="w-7 h-7 rounded-[7px] bg-white/90 flex items-center justify-center border border-[rgba(40,55,42,0.12)]">
                {c.icon}
              </span>
              <span className="text-[13.5px] font-medium text-[#0C0C0C] whitespace-nowrap">{c.label}</span>
              <span className="w-5 h-5 rounded-full bg-[#0C0C0C] flex items-center justify-center ml-0.5">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <circle cx="12" cy="12" r="3.2" stroke="#fff" strokeWidth="1.6" />
                  <path
                    d="M12 3a9 9 0 0 1 0 18 9 9 0 0 1 0-18z"
                    stroke="#fff"
                    strokeWidth="1.6"
                    strokeDasharray="2.6 2.2"
                  />
                </svg>
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="hero-dither" />
    </section>
  );
}
