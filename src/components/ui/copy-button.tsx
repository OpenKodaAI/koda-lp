"use client";

import { useState } from "react";

export function CopyButton({
  text,
  className = "",
  ariaLabel = "Copy",
}: {
  text: string;
  className?: string;
  ariaLabel?: string;
}) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Silent fail — browser blocked clipboard access
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label={ariaLabel}
      className={className}
    >
      {copied ? (
        <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden>
          <path
            d="M3 8l3.5 3.5L13 5"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ) : (
        <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden>
          <rect
            x="4.5"
            y="4.5"
            width="9"
            height="9"
            rx="1.5"
            stroke="currentColor"
            strokeWidth="1.3"
          />
          <path
            d="M3 10.5V4a1.5 1.5 0 011.5-1.5H11"
            stroke="currentColor"
            strokeWidth="1.3"
            strokeLinecap="round"
          />
        </svg>
      )}
    </button>
  );
}
