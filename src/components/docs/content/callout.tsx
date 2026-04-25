import type { ReactNode } from "react";

type Variant = "info" | "warn" | "tip" | "danger";

const variantStyles: Record<
  Variant,
  { bg: string; border: string; text: string; icon: ReactNode }
> = {
  info: {
    bg: "rgba(10,89,210,0.08)",
    border: "rgba(10,89,210,0.22)",
    text: "#5b94ff",
    icon: (
      <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden>
        <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.3" />
        <path
          d="M8 4.5v.5M8 7v4"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  tip: {
    bg: "rgba(79,138,97,0.08)",
    border: "rgba(79,138,97,0.22)",
    text: "#7fbf8f",
    icon: (
      <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden>
        <path
          d="M8 2l1.8 4 4.2.5-3 3 .8 4.5L8 11.5 4.2 14l.8-4.5-3-3 4.2-.5L8 2z"
          stroke="currentColor"
          strokeWidth="1.3"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  warn: {
    bg: "rgba(228,180,84,0.09)",
    border: "rgba(228,180,84,0.25)",
    text: "#f0c870",
    icon: (
      <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden>
        <path
          d="M8 2l6.5 11h-13L8 2z"
          stroke="currentColor"
          strokeWidth="1.3"
          strokeLinejoin="round"
        />
        <path d="M8 7v3M8 11.5v.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  danger: {
    bg: "rgba(192,91,108,0.1)",
    border: "rgba(192,91,108,0.26)",
    text: "#df8794",
    icon: (
      <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden>
        <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.3" />
        <path d="M5 5l6 6M11 5l-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
};

export function Callout({
  variant = "info",
  title,
  children,
}: {
  variant?: Variant;
  title?: string;
  children: ReactNode;
}) {
  const style = variantStyles[variant];
  return (
    <div
      className="not-prose my-6 rounded-[12px] border p-5"
      style={{ borderColor: style.border, backgroundColor: style.bg }}
    >
      {title ? (
        <div className="flex items-center gap-2 mb-2.5">
          <span className="shrink-0" style={{ color: style.text }}>
            {style.icon}
          </span>
          <span
            className="font-semibold text-[12.5px] uppercase tracking-[0.08em]"
            style={{ color: style.text }}
          >
            {title}
          </span>
        </div>
      ) : (
        <div className="mb-2" style={{ color: style.text }}>
          {style.icon}
        </div>
      )}
      <div className="text-[14px] leading-[1.6] text-[var(--dark-text-secondary)]">
        {children}
      </div>
    </div>
  );
}
