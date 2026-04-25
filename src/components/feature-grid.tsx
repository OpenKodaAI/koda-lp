const topRow = [
  {
    title: "Control-plane-first configuration",
    body:
      "Configure providers, agents, secrets, and access through the dashboard. No hand-maintained env files. First-run setup happens where operators already work.",
    mock: "config" as const,
  },
  {
    title: "Multi-agent, multi-provider orchestration",
    body:
      "Claude, Codex, Gemini, Ollama — each agent picks the models and tools that fit its role. Isolated runtime state, parallel by default.",
    mock: "providers" as const,
    featured: true,
  },
  {
    title: "Knowledge & memory grounding",
    body:
      "Retrieval, episodic memory, evidence sourcing, and durable context assembly — so every agent acts on what's actually true.",
    mock: "memory" as const,
  },
];

const bottomRow = [
  {
    title: "Skills as agent abilities",
    body:
      "Stored expert prompts exposed via /skill. Reusable, inspectable, and shareable across agents — your best patterns without the copy-paste.",
    mock: "skills" as const,
  },
  {
    title: "Durable artifact processing",
    body:
      "Postgres for state, S3-compatible object storage for binaries. Documents, media, and derived evidence kept with inspection chains intact.",
    mock: "artifacts" as const,
  },
  {
    title: "Runtime visibility",
    body:
      "Health, setup, dashboards, and OpenAPI-backed surfaces. Every tool call, provider response, and memory write is auditable by default.",
    mock: "runtime" as const,
  },
];

function Orb({ color, size = 24 }: { color: string; size?: number }) {
  return (
    <span
      aria-hidden
      className="agent-sigil-lp shrink-0 relative"
      style={{
        ["--orb-color" as string]: color,
        width: `${size}px`,
        height: `${size}px`,
      }}
    >
      <span className="agent-sigil-lp__halo" />
      <span className="agent-sigil-lp__base" />
      <span className="agent-sigil-lp__swirl" />
      <span className="agent-sigil-lp__shine" />
      <span className="agent-sigil-lp__grain" />
    </span>
  );
}

function StatusDot({ color, pulse = false }: { color: string; pulse?: boolean }) {
  return (
    <span className="relative inline-flex">
      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: color }} />
      {pulse && (
        <span
          className="absolute inset-0 w-1.5 h-1.5 rounded-full animate-ping"
          style={{ backgroundColor: color, opacity: 0.6 }}
        />
      )}
    </span>
  );
}

/* =========================================================
   Mock 1 — Control-plane configuration
   ========================================================= */
function MockConfig() {
  const providers = [
    { name: "anthropic", model: "claude-opus-4-7", enabled: true, dot: "#4f8a61" },
    { name: "openai", model: "gpt-5", enabled: true, dot: "#4f8a61" },
    { name: "google", model: "gemini-3-pro", enabled: true, dot: "#4f8a61" },
    { name: "ollama", model: "local/llama3.3", enabled: false, dot: "#6A6A6A" },
  ];
  return (
    <div className="mt-6 rounded-[12px] border border-[rgba(255,255,255,0.06)] bg-[rgba(12,12,12,0.5)] overflow-hidden">
      <div className="flex items-center justify-between px-3.5 py-2.5 border-b border-[rgba(255,255,255,0.05)]">
        <div className="flex items-center gap-2 text-[11px] font-mono text-[var(--dark-text-tertiary)]">
          <span className="w-1 h-1 rounded-full bg-[#4f8a61]" />
          config / providers
        </div>
        <span className="text-[10.5px] font-mono text-[var(--dark-text-quaternary)] uppercase tracking-[0.12em]">
          synced
        </span>
      </div>
      <div className="p-2 space-y-1">
        {providers.map((p) => (
          <div
            key={p.name}
            className="flex items-center justify-between rounded-[8px] px-2.5 py-2 hover:bg-[rgba(255,255,255,0.03)] transition-colors"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <StatusDot color={p.dot} />
              <div className="min-w-0">
                <div className="text-[12.5px] font-medium text-[var(--dark-text-primary)] font-mono leading-tight">
                  {p.name}
                </div>
                <div className="text-[10.5px] font-mono text-[var(--dark-text-tertiary)] truncate leading-tight">
                  {p.model}
                </div>
              </div>
            </div>
            <span
              className={`relative w-7 h-4 rounded-full transition-colors ${
                p.enabled ? "bg-[#4f8a61]/80" : "bg-[rgba(255,255,255,0.1)]"
              }`}
            >
              <span
                className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-all ${
                  p.enabled ? "left-3.5" : "left-0.5"
                }`}
              />
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* =========================================================
   Mock 2 — Multi-agent runtime (featured)
   ========================================================= */
function MockProviders() {
  const agents = [
    { name: "Atlas", color: "#6e97d9", model: "anthropic/claude-opus-4-7", status: "Live", tone: "#5b94ff", pulse: true },
    { name: "Scout", color: "#5da9a3", model: "google/gemini-3-pro", status: "Live", tone: "#5b94ff", pulse: true },
    { name: "Pebble", color: "#e4b454", model: "anthropic/claude-haiku-4-5", status: "Queued", tone: "#f0c870", pulse: false },
    { name: "Otto", color: "#c07a96", model: "openai/gpt-5", status: "Done", tone: "#7fbf8f", pulse: false },
  ];
  return (
    <div className="mt-6 rounded-[12px] border border-[rgba(255,255,255,0.06)] bg-[rgba(12,12,12,0.5)] overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-[rgba(255,255,255,0.05)]">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#c05b6c]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#e4b454]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#4f8a61]" />
        </div>
        <span className="text-[11px] font-mono text-[var(--dark-text-tertiary)]">koda / runtime</span>
      </div>
      <div className="p-2.5 space-y-1.5">
        {agents.map((a) => (
          <div
            key={a.name}
            className="flex items-center gap-2.5 rounded-[8px] px-2 py-1.5"
          >
            <Orb color={a.color} size={22} />
            <div className="flex-1 min-w-0">
              <div className="text-[12.5px] font-medium text-[var(--dark-text-primary)] leading-tight">
                {a.name}
              </div>
              <div className="text-[10.5px] font-mono text-[var(--dark-text-tertiary)] truncate leading-tight">
                {a.model}
              </div>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              <StatusDot color={a.tone} pulse={a.pulse} />
              <span
                className="text-[10.5px] font-mono uppercase tracking-[0.1em] leading-none"
                style={{ color: a.tone }}
              >
                {a.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* =========================================================
   Mock 3 — Knowledge & memory retrieval
   ========================================================= */
function MockMemory() {
  const results = [
    { source: "incidents/2026-q1-outage.md", score: 0.92 },
    { source: "runbooks/postgres-replica-recovery.md", score: 0.78 },
    { source: "skills/incident-triage.md", score: 0.64 },
  ];
  return (
    <div className="mt-6 rounded-[12px] border border-[rgba(255,255,255,0.06)] bg-[rgba(12,12,12,0.5)] overflow-hidden">
      <div className="px-3.5 py-2.5 border-b border-[rgba(255,255,255,0.05)]">
        <div className="flex items-center gap-2 rounded-[6px] bg-[rgba(255,255,255,0.04)] px-2.5 py-1.5">
          <svg width="11" height="11" viewBox="0 0 16 16" fill="none" aria-hidden className="text-[var(--dark-text-tertiary)]">
            <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.4" />
            <path d="M11 11l3 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
          </svg>
          <span className="text-[11.5px] font-mono text-[var(--dark-text-secondary)]">
            /retrieve q1 outage
          </span>
        </div>
      </div>
      <div className="p-2 space-y-1">
        {results.map((r) => (
          <div key={r.source} className="rounded-[8px] px-2.5 py-2 hover:bg-[rgba(255,255,255,0.03)] transition-colors">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] font-mono text-[var(--dark-text-secondary)] truncate">
                {r.source}
              </span>
              <span className="text-[10px] font-mono text-[var(--dark-text-tertiary)] ml-2 shrink-0">
                {r.score.toFixed(2)}
              </span>
            </div>
            <div className="h-1 w-full rounded-full bg-[rgba(255,255,255,0.04)] overflow-hidden">
              <div
                className="h-full rounded-full"
                style={{
                  width: `${r.score * 100}%`,
                  background: "linear-gradient(90deg, #5b94ff 0%, #8f6ccf 100%)",
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* =========================================================
   Mock 4 — Skills catalog
   ========================================================= */
function MockSkills() {
  const skills = [
    { name: "rca", desc: "Root-cause analysis", runs: 142 },
    { name: "summarize-pr", desc: "PR summary from diff", runs: 88 },
    { name: "db-migration-plan", desc: "Schema migration draft", runs: 31 },
    { name: "incident-triage", desc: "Classify + route incident", runs: 67 },
  ];
  return (
    <div className="mt-6 rounded-[12px] border border-[rgba(255,255,255,0.06)] bg-[rgba(12,12,12,0.5)] overflow-hidden">
      <div className="flex items-center justify-between px-3.5 py-2.5 border-b border-[rgba(255,255,255,0.05)]">
        <div className="flex items-center gap-2 text-[11px] font-mono text-[var(--dark-text-tertiary)]">
          <svg width="10" height="10" viewBox="0 0 12 12" fill="none" aria-hidden>
            <path
              d="M6 1l1.4 3.3L11 4.8 8.3 7.2 9.2 11 6 9 2.8 11l.9-3.8L1 4.8l3.6-.5L6 1z"
              stroke="currentColor"
              strokeWidth="1.1"
              strokeLinejoin="round"
            />
          </svg>
          /skills catalog
        </div>
        <span className="text-[10.5px] font-mono text-[var(--dark-text-quaternary)]">
          4 shared
        </span>
      </div>
      <div className="p-2 space-y-1">
        {skills.map((s) => (
          <div
            key={s.name}
            className="flex items-center justify-between rounded-[8px] px-2.5 py-2 hover:bg-[rgba(255,255,255,0.03)] transition-colors"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="inline-flex items-center gap-1 rounded-[5px] bg-[rgba(228,180,84,0.1)] border border-[rgba(228,180,84,0.18)] px-1.5 py-0.5 font-mono text-[10.5px] text-[#f0c870] shrink-0">
                /{s.name}
              </span>
              <span className="text-[11.5px] text-[var(--dark-text-tertiary)] truncate">
                {s.desc}
              </span>
            </div>
            <span className="text-[10.5px] font-mono text-[var(--dark-text-quaternary)] shrink-0 ml-2">
              {s.runs} runs
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* =========================================================
   Mock 5 — Durable artifacts
   ========================================================= */
function MockArtifacts() {
  const artifacts = [
    { name: "outage-screenshot.png", size: "2.4 MB", storage: "S3", color: "#5da9a3" },
    { name: "postmortem-q1.pdf", size: "488 KB", storage: "S3", color: "#5da9a3" },
    { name: "evidence-chain.json", size: "12 KB", storage: "PG", color: "#6e97d9" },
  ];
  return (
    <div className="mt-6 rounded-[12px] border border-[rgba(255,255,255,0.06)] bg-[rgba(12,12,12,0.5)] overflow-hidden">
      <div className="flex items-center justify-between px-3.5 py-2.5 border-b border-[rgba(255,255,255,0.05)]">
        <div className="text-[11px] font-mono text-[var(--dark-text-tertiary)]">
          artifacts / run-2417
        </div>
        <div className="flex items-center gap-1 text-[10px] font-mono text-[var(--dark-text-quaternary)]">
          <span className="inline-flex items-center gap-1 rounded-[3px] bg-[rgba(110,151,217,0.1)] px-1 text-[#6e97d9]">
            PG
          </span>
          <span className="inline-flex items-center gap-1 rounded-[3px] bg-[rgba(93,169,163,0.1)] px-1 text-[#5da9a3]">
            S3
          </span>
        </div>
      </div>
      <div className="p-2 space-y-1">
        {artifacts.map((a) => (
          <div
            key={a.name}
            className="flex items-center gap-2.5 rounded-[8px] px-2.5 py-2 hover:bg-[rgba(255,255,255,0.03)] transition-colors"
          >
            <div
              className="w-6 h-6 rounded-[5px] flex items-center justify-center shrink-0 border"
              style={{
                borderColor: `${a.color}33`,
                backgroundColor: `${a.color}15`,
                color: a.color,
              }}
            >
              <svg width="12" height="12" viewBox="0 0 14 14" fill="none" aria-hidden>
                <path
                  d="M3 1.5h5l3 3v8H3V1.5z"
                  stroke="currentColor"
                  strokeWidth="1.2"
                  strokeLinejoin="round"
                />
                <path d="M8 1.5v3h3" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[12px] font-mono text-[var(--dark-text-primary)] truncate leading-tight">
                {a.name}
              </div>
              <div className="text-[10px] font-mono text-[var(--dark-text-tertiary)] leading-tight">
                {a.size} · {a.storage}
              </div>
            </div>
            <svg
              width="12"
              height="12"
              viewBox="0 0 16 16"
              fill="none"
              aria-hidden
              className="text-[var(--dark-text-quaternary)] shrink-0"
            >
              <path d="M5 3l5 5-5 5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
            </svg>
          </div>
        ))}
      </div>
    </div>
  );
}

/* =========================================================
   Mock 6 — Runtime visibility (OpenAPI)
   ========================================================= */
function MockRuntime() {
  const endpoints = [
    { method: "GET", path: "/api/runtime/agents", code: 200, ms: 14 },
    { method: "POST", path: "/api/runtime/tasks", code: 201, ms: 42 },
    { method: "GET", path: "/api/control-plane/health", code: 200, ms: 8 },
    { method: "GET", path: "/api/runtime/tasks/:id", code: 200, ms: 21 },
  ];
  const methodColors: Record<string, string> = {
    GET: "#4f8a61",
    POST: "#6e97d9",
    PATCH: "#e4b454",
    DELETE: "#c05b6c",
  };
  return (
    <div className="mt-6 rounded-[12px] border border-[rgba(255,255,255,0.06)] bg-[rgba(12,12,12,0.5)] overflow-hidden">
      <div className="flex items-center justify-between px-3.5 py-2.5 border-b border-[rgba(255,255,255,0.05)]">
        <div className="flex items-center gap-2 text-[11px] font-mono text-[var(--dark-text-tertiary)]">
          <svg width="10" height="10" viewBox="0 0 12 12" fill="none" aria-hidden>
            <path
              d="M4 3.5L1.5 6 4 8.5M8 3.5L10.5 6 8 8.5M7 2L5 10"
              stroke="currentColor"
              strokeWidth="1.1"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          openapi / control-plane
        </div>
        <span className="inline-flex items-center gap-1 text-[10px] font-mono text-[#7fbf8f]">
          <span className="w-1 h-1 rounded-full bg-[#4f8a61]" />
          99.94%
        </span>
      </div>
      <div className="p-2 space-y-0.5">
        {endpoints.map((e) => (
          <div
            key={e.path}
            className="flex items-center gap-2 rounded-[8px] px-2.5 py-1.5 hover:bg-[rgba(255,255,255,0.03)] transition-colors"
          >
            <span
              className="text-[9.5px] font-mono font-semibold px-1.5 py-0.5 rounded-[3px] shrink-0"
              style={{
                color: methodColors[e.method],
                backgroundColor: `${methodColors[e.method]}15`,
              }}
            >
              {e.method}
            </span>
            <span className="flex-1 min-w-0 text-[11px] font-mono text-[var(--dark-text-secondary)] truncate">
              {e.path}
            </span>
            <span className="text-[10px] font-mono text-[var(--dark-text-tertiary)] shrink-0">
              {e.ms}ms
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function Mock({ variant }: { variant: "config" | "providers" | "memory" | "skills" | "artifacts" | "runtime" }) {
  if (variant === "config") return <MockConfig />;
  if (variant === "providers") return <MockProviders />;
  if (variant === "memory") return <MockMemory />;
  if (variant === "skills") return <MockSkills />;
  if (variant === "artifacts") return <MockArtifacts />;
  return <MockRuntime />;
}

function FeatureCard({
  title,
  body,
  mock,
}: {
  title: string;
  body: string;
  mock: "config" | "providers" | "memory" | "skills" | "artifacts" | "runtime";
}) {
  return (
    <article className="group rounded-[16px] border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.025)] p-7 md:p-8 flex flex-col hover:border-[rgba(255,255,255,0.1)] transition-colors">
      <h3 className="text-[18px] md:text-[19px] font-medium text-[var(--dark-text-primary)] leading-tight">
        {title}
      </h3>
      <p className="mt-3 text-[14px] md:text-[14.5px] leading-[1.55] text-[var(--dark-text-secondary)]">
        {body}
      </p>
      <a
        href="#foundations"
        className="mt-4 inline-flex items-center gap-1 text-[13px] font-medium text-[var(--dark-text-secondary)] hover:text-[var(--dark-text-primary)] transition-colors"
      >
        Learn more
        <svg width="12" height="12" viewBox="0 0 16 16" fill="none" aria-hidden>
          <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </a>
      <div className="flex-1 mt-2 flex items-end">
        <div className="w-full">
          <Mock variant={mock} />
        </div>
      </div>
    </article>
  );
}

export function FeatureGrid() {
  return (
    <section id="features" className="section-dark relative py-16 md:py-24">
      <div className="container-lp">
        <div className="text-center">
          <h2 className="display-serif text-[44px] sm:text-[60px] md:text-[76px] text-[var(--dark-text-primary)]">
            The platform, day one.
          </h2>
          <p className="mt-5 text-[15.5px] md:text-[16.5px] text-[var(--dark-text-secondary)] max-w-[580px] mx-auto">
            Everything you need to run agents in production — configured from the dashboard, not six config files.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-4">
          {topRow.map((c) => (
            <FeatureCard key={c.title} {...c} />
          ))}
        </div>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          {bottomRow.map((c) => (
            <FeatureCard key={c.title} {...c} />
          ))}
        </div>
      </div>
    </section>
  );
}
