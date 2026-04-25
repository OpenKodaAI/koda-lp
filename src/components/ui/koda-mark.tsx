import Image from "next/image";
import { cn } from "@/lib/cn";

export function KodaMark({
  variant = "white",
  size = 32,
  className,
}: {
  variant?: "white" | "black";
  size?: number;
  className?: string;
}) {
  const isBlack = variant === "black";
  return (
    <Image
      src="/koda-mark-white.svg"
      alt="Koda"
      width={size}
      height={size}
      priority
      className={cn("block select-none", className)}
      style={isBlack ? { filter: "brightness(0) saturate(100%)" } : undefined}
    />
  );
}
