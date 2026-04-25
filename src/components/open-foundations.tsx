type Agent = {
  name: string;
  color: string;
  model: string;
};

const agents: Agent[] = [
  { name: "Atlas", color: "#6e97d9", model: "anthropic/claude-opus-4-7" },
  { name: "Otto", color: "#c07a96", model: "openai/gpt-5" },
  { name: "Scout", color: "#5da9a3", model: "google/gemini-3-pro" },
  { name: "Pebble", color: "#e4b454", model: "anthropic/claude-haiku-4-5" },
  { name: "Sage", color: "#8f6ccf", model: "anthropic/claude-opus-4-7" },
  { name: "Whiskers", color: "#A7ADB4", model: "ollama/llama3.3" },
  { name: "Marlowe", color: "#c05b6c", model: "openai/gpt-5" },
  { name: "Beacon", color: "#7cb39c", model: "google/gemini-3-pro" },
  { name: "Echo", color: "#88b4e0", model: "anthropic/claude-opus-4-7" },
  { name: "Sprout", color: "#86b573", model: "anthropic/claude-haiku-4-5" },
];

const tags = ["MIT-licensed", "Self-hostable", "Multi-provider", "Postgres + S3"];

function AgentSigil({ color }: { color: string }) {
  return (
    <span
      aria-hidden
      className="agent-sigil-lp h-8 w-8"
      style={{ ["--orb-color" as string]: color }}
    >
      <span className="agent-sigil-lp__halo" />
      <span className="agent-sigil-lp__base" />
      <span className="agent-sigil-lp__swirl" />
      <span className="agent-sigil-lp__shine" />
      <span className="agent-sigil-lp__grain" />
    </span>
  );
}

function AgentRow({ agent }: { agent: Agent }) {
  return (
    <div className="group flex items-center gap-2.5 px-3 py-2 rounded-[8px] hover:bg-[rgba(255,255,255,0.04)] border border-transparent hover:border-[rgba(255,255,255,0.06)] transition-colors duration-150">
      <AgentSigil color={agent.color} />
      <div className="min-w-0 flex-1">
        <div className="truncate text-[14px] font-medium leading-tight tracking-[-0.01em] text-[var(--dark-text-primary)]">
          {agent.name}
        </div>
        <div className="truncate text-[12px] leading-[1.35] text-[var(--dark-text-tertiary)] mt-0.5">
          {agent.model}
        </div>
      </div>
      <button
        type="button"
        aria-label={`Open actions for ${agent.name}`}
        className="opacity-0 group-hover:opacity-100 transition-opacity duration-150 h-7 w-7 flex items-center justify-center rounded-[6px] hover:bg-[rgba(255,255,255,0.06)] text-[var(--dark-text-tertiary)]"
      >
        <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" aria-hidden>
          <circle cx="3" cy="8" r="1.3" />
          <circle cx="8" cy="8" r="1.3" />
          <circle cx="13" cy="8" r="1.3" />
        </svg>
      </button>
    </div>
  );
}

export function OpenFoundations() {
  return (
    <section id="foundations" className="section-dark relative pb-20 md:pb-28">
      <div className="container-lp">
        <div className="rounded-[20px] border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.025)] px-6 py-10 md:px-12 md:py-16">
          <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-center">
            {/* LEFT — agent catalog */}
            <div className="scroll-y-loop-host relative w-full max-w-[440px] mx-auto md:mx-0">
              <div className="relative h-[400px] overflow-hidden rounded-[14px] border border-[rgba(255,255,255,0.06)] bg-[rgba(12,12,12,0.5)] backdrop-blur-md">
                <div className="scroll-y-loop flex flex-col gap-1 p-2.5">
                  {[...agents, ...agents].map((a, i) => (
                    <AgentRow key={i} agent={a} />
                  ))}
                </div>
                {/* Top + bottom fade masks */}
                <div className="pointer-events-none absolute inset-x-0 top-0 h-12 bg-gradient-to-b from-[#0C0C0C] via-[rgba(12,12,12,0.55)] to-transparent" />
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-[#0C0C0C] via-[rgba(12,12,12,0.55)] to-transparent" />
              </div>
            </div>

            {/* RIGHT — copy + chips */}
            <div>
              <span className="inline-flex h-7 items-center px-3 rounded-[var(--radius-pill)] bg-[rgba(255,255,255,0.06)] border border-[rgba(255,255,255,0.06)] text-[11.5px] font-mono uppercase tracking-[0.16em] text-[var(--dark-text-secondary)]">
                Open foundations
              </span>
              <h2 className="mt-5 display-serif text-[36px] md:text-[48px] leading-[1.05] text-[var(--dark-text-primary)]">
                Production-friendly.
                <br />
                Operator-first.
              </h2>
              <p className="mt-5 text-[15px] md:text-[16px] leading-[1.6] text-[var(--dark-text-secondary)] max-w-[460px]">
                Koda treats agent configuration the way operators treat production systems —
                through a control plane, with inspection, audit trails, and durable state.
                Programmable where you want it. Steerable where you need it.
              </p>
              <div className="mt-7 flex flex-wrap gap-2">
                {tags.map((t) => (
                  <span
                    key={t}
                    className="inline-flex h-8 items-center px-3.5 rounded-[var(--radius-pill)] bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.06)] text-[12.5px] font-medium text-[var(--dark-text-secondary)]"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
