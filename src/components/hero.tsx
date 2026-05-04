"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { CopyButton } from "@/components/ui/copy-button";
import { WordsPullUp } from "@/components/ui/prisma-hero";

const INSTALL_COMMAND = "npx @openkodaai/koda@latest install";

const NpmIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 27.23 27.23" aria-hidden className={className}>
    <rect width="27.23" height="27.23" rx="2" fill="currentColor" />
    <polygon
      points="5.8,21.75 13.61,21.75 13.61,9.59 17.52,9.59 17.52,21.75 21.43,21.75 21.43,5.68 5.8,5.68"
      fill="#0C0C0C"
    />
  </svg>
);

const GithubIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className}>
    <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56 0-.27-.01-1-.02-1.96-3.2.69-3.87-1.54-3.87-1.54-.52-1.32-1.27-1.67-1.27-1.67-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.02 1.75 2.68 1.25 3.34.96.1-.74.4-1.25.72-1.54-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.29 1.18-3.1-.12-.29-.51-1.46.11-3.05 0 0 .96-.31 3.15 1.18.91-.25 1.89-.38 2.86-.39.97.01 1.95.14 2.86.39 2.18-1.49 3.14-1.18 3.14-1.18.62 1.59.23 2.76.11 3.05.74.81 1.18 1.84 1.18 3.1 0 4.42-2.69 5.39-5.26 5.68.41.36.78 1.06.78 2.14 0 1.55-.01 2.8-.01 3.18 0 .31.21.68.8.56C20.22 21.39 23.5 17.08 23.5 12 23.5 5.65 18.35.5 12 .5z" />
  </svg>
);

const navItems: { label: string; href: string; icon?: ReactNode }[] = [
  { label: "Docs", href: "/docs" },
  {
    label: "npm",
    href: "https://www.npmjs.com/package/@openkodaai/koda",
    icon: <NpmIcon className="h-3.5 w-3.5 md:h-4 md:w-4" />,
  },
  {
    label: "GitHub",
    href: "https://github.com/openkodaai/koda",
    icon: <GithubIcon className="h-3.5 w-3.5 md:h-4 md:w-4" />,
  },
  { label: "Foundations", href: "#foundations" },
];

export function Hero() {
  return (
    <section className="h-screen w-full p-2 md:p-3">
      <div className="relative h-full w-full overflow-hidden rounded-2xl md:rounded-[2rem] bg-[#0C0C0C]">
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          poster="/hero-poster.jpg"
          className="absolute inset-0 h-full w-full object-cover"
        >
          {/* WebM (VP9) first — ~21% smaller than mp4. Safari falls through to mp4. */}
          <source src="/hero.webm" type="video/webm" />
          <source src="/hero.mp4" type="video/mp4" />
        </video>

        <div className="noise-overlay pointer-events-none absolute inset-0 opacity-[0.55] mix-blend-overlay" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/35 via-black/10 to-black/70" />

        <nav className="absolute left-1/2 top-0 z-20 -translate-x-1/2">
          <div className="flex items-center gap-3 rounded-b-2xl bg-black px-4 py-2 sm:gap-6 md:gap-12 md:rounded-b-3xl md:px-8 lg:gap-14">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                target={item.href.startsWith("http") ? "_blank" : undefined}
                rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
                className="inline-flex items-center gap-1.5 text-[10px] transition-colors sm:text-xs md:text-sm"
                style={{ color: "rgba(225, 224, 204, 0.8)" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#E1E0CC")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(225, 224, 204, 0.8)")}
              >
                {item.icon}
                {item.label}
              </Link>
            ))}
          </div>
        </nav>

        <div className="absolute bottom-0 left-0 right-0 z-10 px-4 pb-2 sm:px-6 md:px-10">
          <div className="grid grid-cols-12 items-end gap-4">
            <div className="col-span-12 xl:col-span-6">
              <h1
                className="display-serif font-medium leading-[0.85] tracking-[-0.07em] text-[32vw] sm:text-[30vw] md:text-[26vw] lg:text-[22vw] xl:text-[18vw] 2xl:text-[19vw]"
                style={{ color: "#E1E0CC" }}
              >
                <WordsPullUp
                  text="koda"
                  decoration={
                    <span
                      aria-hidden
                      style={{
                        display: "block",
                        width: "100%",
                        height: "100%",
                        backgroundColor: "#E1E0CC",
                        maskImage: "url(/koda-mark-white.svg)",
                        WebkitMaskImage: "url(/koda-mark-white.svg)",
                        maskRepeat: "no-repeat",
                        WebkitMaskRepeat: "no-repeat",
                        maskPosition: "center",
                        WebkitMaskPosition: "center",
                        maskSize: "contain",
                        WebkitMaskSize: "contain",
                      }}
                    />
                  }
                />
              </h1>
            </div>

            <div className="col-span-12 flex flex-col gap-5 pb-6 xl:col-span-6 xl:pb-10">
              <motion.p
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true, amount: 0 }}
                transition={{ duration: 0.8, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="text-xs sm:text-sm md:text-base"
                style={{ lineHeight: 1.25, color: "rgba(225, 224, 204, 0.78)" }}
              >
                Koda is the open-source harness for multi-agent, multi-provider AI systems. A
                control plane you actually use, durable state by default, and every runtime
                action inspectable from day one.
              </motion.p>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true, amount: 0 }}
                transition={{ duration: 0.8, delay: 0.65, ease: [0.16, 1, 0.3, 1] }}
                className="flex items-center gap-3 rounded-full bg-black/60 backdrop-blur-md border border-white/10 p-1.5 pr-3 self-stretch w-full max-w-full"
              >
                <span
                  className="shrink-0 inline-flex h-11 items-center px-4 sm:px-5 rounded-full text-[13px] sm:text-[14px] md:text-[15px] font-medium"
                  style={{ background: "#E1E0CC", color: "#0C0C0C" }}
                >
                  Install Koda
                </span>
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
              </motion.div>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true, amount: 0 }}
                transition={{ duration: 0.8, delay: 0.75, ease: [0.16, 1, 0.3, 1] }}
                className="flex items-center gap-3"
              >
                <Link
                  href="/docs"
                  className="group inline-flex items-center gap-2 self-start rounded-full py-1 pl-5 pr-1 text-sm font-medium transition-all hover:gap-3 sm:text-base"
                  style={{ background: "#E1E0CC", color: "#0C0C0C" }}
                >
                  Read the docs
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-black transition-transform group-hover:scale-110 sm:h-10 sm:w-10">
                    <ArrowRight className="h-4 w-4" style={{ color: "#E1E0CC" }} />
                  </span>
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
