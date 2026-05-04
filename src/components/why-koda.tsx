const questions = [
  "How do I prevent agent runaway?",
  "Which model fits this task?",
  "Can I switch providers without rewrites?",
  "Where is each agent's state stored?",
  "How do I roll back a bad action?",
  "What did the agent see at step 3?",
  "Can I run this entirely on my own infra?",
  "How do I share a Skill across agents?",
  "Why did the agent retry?",
  "What's the audit trail for this run?",
  "Where do agents pull memory from?",
  "Can I chain agents and inspect each step?",
];

const features = [
  {
    title: "Programmable, not prescriptive",
    description:
      "No prescribed agent persona, no locked task domain. Configure providers, agents, and policies the way your system actually needs them.",
    icon: (
      <svg width="44" height="44" viewBox="0 0 44 44" fill="none" aria-hidden>
        <path d="M8 14h22M8 22h28M8 30h18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        <circle cx="32" cy="14" r="2.5" stroke="currentColor" strokeWidth="1.6" />
        <circle cx="14" cy="22" r="2.5" stroke="currentColor" strokeWidth="1.6" />
        <circle cx="28" cy="30" r="2.5" stroke="currentColor" strokeWidth="1.6" />
      </svg>
    ),
  },
  {
    title: "Production-grade by design",
    description:
      "Postgres for durable state. S3-compatible artifact storage. Control-plane OpenAPI plus runtime inspection routes. Built for operators, not hobby projects.",
    icon: (
      <svg width="44" height="44" viewBox="0 0 44 44" fill="none" aria-hidden>
        <path
          d="M22 6l3.2 9.6 10.1 1L27.6 23l3 9.8L22 27l-8.6 5.8 3-9.8-7.7-6.4 10.1-1L22 6z"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    title: "Inspect every action",
    description:
      "Every tool call, retrieval hit, and provider response is logged with full context. The runtime state is never hidden behind the prompt.",
    icon: (
      <svg width="44" height="44" viewBox="0 0 44 44" fill="none" aria-hidden>
        <circle cx="20" cy="20" r="11" stroke="currentColor" strokeWidth="1.6" />
        <circle cx="20" cy="20" r="4" stroke="currentColor" strokeWidth="1.6" />
        <path d="M28.5 28.5L36 36" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: "Yours to fork, yours to run",
    description:
      "Apache 2.0 licensed. Docker-first. Self-host on a single VPS or scale across nodes. No managed service, no vendor path dependency.",
    icon: (
      <svg width="44" height="44" viewBox="0 0 44 44" fill="none" aria-hidden>
        <path
          d="M22 5l13 4v11c0 8-5.6 13.5-13 16-7.4-2.5-13-8-13-16V9l13-4z"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
        <path
          d="M16 22l4.5 4.5L29 18"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
];

const m1 = questions.slice(0, 4);
const m2 = questions.slice(4, 8);
const m3 = questions.slice(8);

function Marquee({
  items,
  duration,
  reverse = false,
}: {
  items: string[];
  duration: string;
  reverse?: boolean;
}) {
  const repeated = [...items, ...items, ...items, ...items];
  return (
    <div className="marquee-host overflow-hidden">
      <div
        className={`marquee-track ${reverse ? "marquee-track-reverse" : ""}`}
        style={{ ["--duration" as string]: duration, ["--gap" as string]: "0.6rem" }}
      >
        {repeated.map((q, i) => (
          <span
            key={i}
            className="inline-flex items-center whitespace-nowrap rounded-[6px] border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.04)] px-3.5 py-1.5 text-[13px] font-mono text-[var(--dark-text-secondary)]"
          >
            {q}
          </span>
        ))}
      </div>
    </div>
  );
}

export function WhyKoda() {
  return (
    <section className="section-dark relative pt-16 md:pt-24 pb-0 overflow-hidden">
      <div className="mx-auto max-w-full">
        <div className="container-lp flex flex-col items-center text-center gap-5">
          <h2 className="display-serif text-[40px] sm:text-[52px] md:text-[64px] leading-[1.02] text-[var(--dark-text-primary)] max-w-[780px]">
            No black boxes. No hidden state.
          </h2>
          <p className="text-[15px] md:text-[16.5px] leading-[1.55] text-[var(--dark-text-secondary)] max-w-[600px]">
            Running a multi-agent system surfaces a hundred operational questions. Koda answers
            them in its design — not as afterthoughts wrapped around a hardcoded prompt loop.
          </p>

          <div className="relative w-full mt-6 max-w-[860px]">
            {/* Edge fades */}
            <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-24 bg-gradient-to-r from-[#0C0C0C] to-transparent" />
            <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-24 bg-gradient-to-l from-[#0C0C0C] to-transparent" />

            <div className="flex flex-col gap-2.5 py-2">
              <Marquee items={m1} duration="48s" />
              <Marquee items={m2} duration="56s" reverse />
              <Marquee items={m3} duration="44s" />
            </div>
          </div>
        </div>

        <div className="mt-16 md:mt-20 w-full">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 border-t border-dashed border-[rgba(255,255,255,0.5)]">
            {features.map((feature, i) => {
              const sideBorders = [
                i === 1 || i === 3 ? "sm:border-l" : "",
                i === 1 || i === 2 || i === 3 ? "lg:border-l" : "",
              ]
                .filter(Boolean)
                .join(" ");
              return (
              <div
                key={feature.title}
                className={`flex flex-col gap-5 px-5 sm:px-6 lg:px-8 py-10 lg:py-12 border-dashed border-[rgba(255,255,255,0.5)] ${sideBorders}`}
              >
                <div className="text-[var(--dark-text-secondary)]">{feature.icon}</div>
                <div className="flex flex-col gap-2 mt-8 lg:mt-14">
                  <h3 className="font-medium text-[22px] md:text-[24px] tracking-tight text-[var(--dark-text-primary)] leading-[1.2]">
                    {feature.title}
                  </h3>
                  <p className="text-[14px] md:text-[14.5px] leading-[1.55] text-[var(--dark-text-tertiary)]">
                    {feature.description}
                  </p>
                </div>
              </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
