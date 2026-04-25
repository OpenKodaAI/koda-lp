export function SectionDivider() {
  return (
    <div className="section-dark" aria-hidden>
      <div className="container-lp">
        <div className="mx-auto flex max-w-[720px] items-center gap-3">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent to-[rgba(255,255,255,0.12)]" />
          <span className="w-1 h-1 rounded-full bg-[rgba(255,255,255,0.22)]" />
          <div className="flex-1 h-px bg-gradient-to-l from-transparent to-[rgba(255,255,255,0.12)]" />
        </div>
      </div>
    </div>
  );
}
