import { Children, cloneElement, isValidElement, type ReactNode } from "react";

type StepProps = {
  title: string;
  children: ReactNode;
  /** Injected by StepList — authors don't pass this directly. */
  index?: number;
  isLast?: boolean;
};

export function Step({ title, children, index, isLast }: StepProps) {
  return (
    <li className={`relative pl-10 ml-3 ${isLast ? "" : "pb-8"} border-l ${isLast ? "border-transparent" : "border-white/[0.07]"}`}>
      <span
        aria-hidden
        className="absolute -left-[13px] top-0 flex h-6 w-6 items-center justify-center rounded-full border border-white/[0.14] bg-[var(--dark-canvas)] text-[11px] font-mono text-[var(--dark-text-secondary)]"
      >
        {typeof index === "number" ? index + 1 : "•"}
      </span>
      <h3 className="mb-2 text-[15.5px] font-semibold text-[var(--dark-text-primary)] leading-tight tracking-[-0.005em]">
        {title}
      </h3>
      <div className="text-[14.5px] leading-[1.65] text-[var(--dark-text-secondary)] [&>p]:my-2 [&>p:first-child]:mt-0 [&>p:last-child]:mb-0">
        {children}
      </div>
    </li>
  );
}

export function StepList({ children }: { children: ReactNode }) {
  const items = Children.toArray(children).filter(isValidElement) as Array<
    React.ReactElement<StepProps>
  >;
  return (
    <ol className="not-prose my-6 list-none p-0">
      {items.map((child, index) =>
        cloneElement(child, {
          index,
          isLast: index === items.length - 1,
        })
      )}
    </ol>
  );
}
