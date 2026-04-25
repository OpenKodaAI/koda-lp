"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

export function DocsSidebarLink({
  slug,
  title,
  onNavigate,
}: {
  slug: string;
  title: string;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  const href = `/docs/${slug}`;
  const isActive = pathname === href;
  const ref = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    if (isActive) {
      ref.current?.scrollIntoView({ block: "nearest" });
    }
  }, [isActive]);

  return (
    <Link
      ref={ref}
      href={href}
      onClick={onNavigate}
      aria-current={isActive ? "page" : undefined}
      className={`relative flex h-8 items-center px-3 rounded-[8px] text-[13.5px] transition-colors ${
        isActive
          ? "bg-white/[0.06] text-[var(--dark-text-primary)]"
          : "text-[var(--dark-text-secondary)] hover:bg-white/[0.04] hover:text-[var(--dark-text-primary)]"
      }`}
    >
      {isActive && (
        <span
          aria-hidden
          className="absolute left-0 top-1 bottom-1 w-[2px] rounded-full"
          style={{ background: "rgba(36, 102, 208, 0.9)" }}
        />
      )}
      <span className="truncate">{title}</span>
    </Link>
  );
}
