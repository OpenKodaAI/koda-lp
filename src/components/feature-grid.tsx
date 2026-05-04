import { ArrowRight, Check, Database, GitFork, Search, Sparkles } from "lucide-react";
import { AgentGlyph, type AgentState } from "@/components/ui/agent-glyph";
import { BentoGridShowcase } from "@/components/ui/bento-product-features";

/* eslint-disable @next/next/no-img-element */

const DockerIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className}>
    <path d="M13.983 11.078h2.119a.186.186 0 0 0 .186-.185V9.006a.186.186 0 0 0-.186-.186h-2.119a.185.185 0 0 0-.185.185v1.888c0 .102.083.185.185.185m-2.954-5.43h2.118a.186.186 0 0 0 .186-.186V3.574a.186.186 0 0 0-.186-.185h-2.118a.185.185 0 0 0-.185.185v1.888c0 .102.082.185.185.186m0 2.716h2.118a.187.187 0 0 0 .186-.186V6.29a.186.186 0 0 0-.186-.185h-2.118a.185.185 0 0 0-.185.185v1.887c0 .102.082.185.185.186m-2.93 0h2.12a.186.186 0 0 0 .184-.186V6.29a.185.185 0 0 0-.185-.185H8.1a.185.185 0 0 0-.185.185v1.887c0 .102.083.185.185.186m-2.964 0h2.119a.186.186 0 0 0 .185-.186V6.29a.185.185 0 0 0-.185-.185H5.136a.186.186 0 0 0-.186.185v1.887c0 .102.084.185.186.186m5.893 2.715h2.118a.186.186 0 0 0 .186-.185V9.006a.186.186 0 0 0-.186-.186h-2.118a.185.185 0 0 0-.185.185v1.888c0 .102.082.185.185.185m-2.93 0h2.12a.185.185 0 0 0 .184-.185V9.006a.185.185 0 0 0-.184-.186h-2.12a.185.185 0 0 0-.185.185v1.888c0 .102.083.185.185.185m-2.964 0h2.119a.185.185 0 0 0 .185-.185V9.006a.185.185 0 0 0-.184-.186h-2.12a.186.186 0 0 0-.186.186v1.887c0 .102.084.185.186.185m-2.92 0h2.12a.185.185 0 0 0 .184-.185V9.006a.185.185 0 0 0-.185-.186h-2.12a.185.185 0 0 0-.184.185v1.888c0 .102.082.185.185.185M23.763 9.89c-.065-.051-.672-.51-1.954-.51-.338.001-.676.03-1.01.087-.248-1.7-1.653-2.53-1.716-2.566l-.344-.199-.226.327c-.284.438-.49.922-.612 1.43-.23.97-.09 1.882.403 2.661-.595.332-1.55.413-1.744.42H.751a.751.751 0 0 0-.75.748 11.376 11.376 0 0 0 .692 4.062c.545 1.428 1.355 2.48 2.41 3.124 1.18.723 3.1 1.137 5.275 1.137a23.797 23.797 0 0 0 4.27-.385 17.866 17.866 0 0 0 5.583-2.014c1.36-.762 2.586-1.74 3.554-2.857a13.49 13.49 0 0 0 2.358-3.99c.07-.207.133-.418.187-.633a3.34 3.34 0 0 0 .64-.32 4.41 4.41 0 0 0 .708-.555l.198-.197z" />
  </svg>
);

type Channel = {
  label: string;
  src: string;
};

const channels: Channel[] = [
  { label: "Telegram", src: "/channels/telegram.svg" },
  { label: "WhatsApp", src: "/channels/whatsapp.svg" },
  { label: "Discord", src: "/channels/discord.svg" },
  { label: "Slack", src: "https://www.vectorlogo.zone/logos/slack/slack-icon.svg" },
  { label: "Microsoft Teams", src: "/channels/teams.svg" },
  { label: "LINE", src: "/channels/line.svg" },
  { label: "Messenger", src: "/channels/messenger.svg" },
  { label: "Signal", src: "/channels/signal.svg" },
  { label: "Instagram", src: "/channels/instagram.svg" },
];

type Agent = { id: string; color: string; state: AgentState };

const featuredAgents: Agent[] = [
  { id: "atlas", color: "#6e97d9", state: "thinking" },
  { id: "scout", color: "#5da9a3", state: "thinking" },
  { id: "pebble", color: "#e4b454", state: "listening" },
  { id: "otto", color: "#c07a96", state: null },
];

const cardClass =
  "h-full rounded-[16px] border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.025)] p-6 md:p-7 hover:border-[rgba(255,255,255,0.1)] transition-colors flex flex-col";

const eyebrowClass =
  "text-[10.5px] font-mono uppercase tracking-[0.16em] text-[var(--dark-text-quaternary)]";

const titleClass =
  "text-[18px] md:text-[19px] font-medium text-[var(--dark-text-primary)] leading-tight tracking-[-0.01em]";

const bodyClass =
  "text-[13.5px] md:text-[14px] leading-[1.55] text-[var(--dark-text-secondary)]";

function ChannelsCard() {
  return (
    <article className={cardClass}>
      <span className={eyebrowClass}>Bot gateway</span>
      <h3 className={`${titleClass} mt-3`}>
        Talk to agents on every channel.
      </h3>
      <p className={`${bodyClass} mt-3`}>
        One control plane, every messenger. Plug-and-play webhooks across the
        platforms your team and customers already use.
      </p>

      <div className="mt-6 grid grid-cols-3 gap-2 flex-1 content-center">
        {channels.map((c) => (
          <div
            key={c.label}
            className="aspect-square rounded-[12px] border border-[rgba(255,255,255,0.05)] bg-[rgba(255,255,255,0.02)] flex items-center justify-center hover:bg-[rgba(255,255,255,0.04)] transition-colors"
            title={c.label}
          >
            <img
              src={c.src}
              alt={c.label}
              className="h-7 w-7 md:h-8 md:w-8"
              decoding="async"
              loading="lazy"
              referrerPolicy="no-referrer"
            />
          </div>
        ))}
      </div>

      <div className="mt-6 flex flex-wrap gap-1.5">
        {channels.slice(0, 5).map((c) => (
          <span
            key={c.label}
            className="text-[11px] font-mono text-[var(--dark-text-tertiary)] px-2 py-0.5 rounded-[5px] bg-[rgba(255,255,255,0.04)]"
          >
            {c.label}
          </span>
        ))}
        <span className="text-[11px] font-mono text-[var(--dark-text-quaternary)] px-2 py-0.5">
          +{channels.length - 5} more
        </span>
      </div>
    </article>
  );
}

function AgentsCard() {
  return (
    <article className={cardClass}>
      <span className={eyebrowClass}>Runtime</span>
      <div className="mt-4 flex items-center gap-2">
        {featuredAgents.map((a) => (
          <AgentGlyph
            key={a.id}
            agentId={a.id}
            color={a.color}
            state={a.state}
            variant="list"
            style={{ width: 36, height: 36 }}
          />
        ))}
      </div>
      <h3 className={`${titleClass} mt-auto`}>
        Multi-agent, multi-provider.
      </h3>
      <p className={`${bodyClass} mt-2`}>
        Each agent picks its own model and tools. Parallel by default.
      </p>
    </article>
  );
}

function StatisticCard() {
  return (
    <article
      className={`${cardClass} relative overflow-hidden items-start justify-between`}
    >
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.18] pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(rgba(255,255,255,0.6) 1px, transparent 1px)",
          backgroundSize: "14px 14px",
        }}
      />
      <span className={`${eyebrowClass} relative z-10`}>License</span>
      <div className="relative z-10 flex-1 flex flex-col justify-center min-w-0">
        <div className="display-serif text-[56px] md:text-[52px] lg:text-[64px] xl:text-[72px] leading-[0.95] tracking-[-0.04em] text-[var(--dark-text-primary)]">
          Apache
        </div>
        <div className="display-serif text-[36px] md:text-[34px] lg:text-[40px] xl:text-[44px] leading-[0.95] tracking-[-0.03em] text-[#d97757]">
          2.0
        </div>
      </div>
      <div className={`${bodyClass} relative z-10 text-[12.5px]`}>
        Fork it, host it, ship it.
      </div>
    </article>
  );
}

type MemoryLayer = {
  label: string;
  icon: typeof Database;
};

const memoryLayers: MemoryLayer[] = [
  { label: "memory", icon: Database },
  { label: "retrieval", icon: Search },
  { label: "curation", icon: Sparkles },
  { label: "relations", icon: GitFork },
];

function MemoryStack() {
  return (
    <div className="relative shrink-0" style={{ width: 80, height: 100 }}>
      {memoryLayers.map((_, i) => {
        const reverseIdx = memoryLayers.length - 1 - i;
        return (
          <div
            key={i}
            className="absolute rounded-[6px] border border-[rgba(255,255,255,0.07)]"
            style={{
              width: 72,
              height: 16,
              right: 0,
              top: 6 + reverseIdx * 22,
              background:
                "linear-gradient(180deg, rgba(46,46,46,0.92) 0%, rgba(20,20,20,1) 50%, rgba(8,8,8,1) 100%)",
              boxShadow:
                "0 6px 14px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.05)",
              transform: "perspective(500px) rotateX(48deg)",
            }}
          />
        );
      })}
    </div>
  );
}

function MemoryCard() {
  return (
    <article className={cardClass}>
      <span className={eyebrowClass}>Memory & retrieval</span>
      <h3 className={`${titleClass} mt-3`}>Grounded in what's true.</h3>
      <p className={`${bodyClass} mt-2`}>
        Episodic memory, semantic retrieval, curated relations.
      </p>

      <div className="mt-auto pt-5 flex items-center gap-3">
        <div className="flex flex-col gap-[10px] flex-1 min-w-0">
          {memoryLayers.map((l) => (
            <div key={l.label} className="flex items-center gap-2">
              <span className="flex h-[22px] w-[22px] items-center justify-center rounded-[5px] bg-white shrink-0">
                <l.icon className="h-3 w-3 text-[#0C0C0C]" strokeWidth={2.2} />
              </span>
              <span className="font-mono text-[10.5px] text-[var(--dark-text-secondary)] shrink-0">
                {l.label}
              </span>
              <span className="flex-1 border-t border-dashed border-[rgba(255,255,255,0.12)]" />
            </div>
          ))}
        </div>

        <MemoryStack />
      </div>
    </article>
  );
}

type ContainerStatus = "done" | "active" | "pending";

const containers: { name: string; status: ContainerStatus }[] = [
  { name: "koda-runtime", status: "done" },
  { name: "koda-memory", status: "active" },
  { name: "koda-security", status: "pending" },
  { name: "koda-postgres", status: "pending" },
];

function StatusIcon({ status }: { status: ContainerStatus }) {
  if (status === "done") {
    return (
      <span className="flex h-4 w-4 items-center justify-center rounded-full border-[1.5px] border-[#5fae6f]">
        <Check className="h-2 w-2 text-[#5fae6f]" strokeWidth={3.5} />
      </span>
    );
  }
  if (status === "active") {
    return (
      <span
        aria-hidden
        className="block h-4 w-4"
        style={{
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
    );
  }
  return (
    <span className="block h-4 w-4 rounded-full border-[1.5px] border-[rgba(255,255,255,0.18)]" />
  );
}

function ContainerRow({
  name,
  status,
  faded,
}: {
  name: string;
  status: ContainerStatus;
  faded?: number;
}) {
  return (
    <div className="flex items-center gap-2.5" style={faded ? { opacity: faded } : undefined}>
      <StatusIcon status={status} />
      <div className="inline-flex items-center gap-1.5 rounded-[7px] bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.05)] pl-1 pr-2.5 py-0.5">
        <span className="flex h-5 w-5 items-center justify-center rounded-[4px] bg-white/95">
          <DockerIcon className="h-3.5 w-3.5 text-[#0C0C0C]" />
        </span>
        <span className="font-mono text-[12.5px] text-[var(--dark-text-primary)]">{name}</span>
      </div>
    </div>
  );
}

function ContainersCard() {
  return (
    <article className={`${cardClass} overflow-hidden`}>
      <span className={eyebrowClass}>Containers</span>
      <h3 className={`${titleClass} mt-3`}>One harness, every container.</h3>
      <p className={`${bodyClass} mt-2`}>
        Runtime, memory, security — one declarative deploy.
      </p>

      <div className="mt-auto pt-4 flex flex-col gap-1.5 -mb-6 md:-mb-7">
        {containers.map((c, i) => (
          <ContainerRow
            key={c.name}
            name={c.name}
            status={c.status}
            faded={i === 2 ? 0.45 : i === 3 ? 0.22 : undefined}
          />
        ))}
      </div>
    </article>
  );
}

type Provider = { src: string; tint?: string; alt: string; model: string };

const featuredProviders: Provider[] = [
  { src: "/providers/openai.svg", alt: "OpenAI", model: "gpt-5" },
  { src: "/providers/anthropic.svg", tint: "#D97757", alt: "Anthropic", model: "claude-opus" },
  { src: "/providers/google.svg", alt: "Google", model: "gemini-pro" },
];

function ProviderMark({
  provider,
  className,
  size,
}: {
  provider: Provider;
  className?: string;
  size: number;
}) {
  if (provider.tint) {
    return (
      <span
        aria-label={provider.alt}
        className={className}
        style={{
          display: "inline-block",
          width: size,
          height: size,
          backgroundColor: provider.tint,
          maskImage: `url(${provider.src})`,
          WebkitMaskImage: `url(${provider.src})`,
          maskRepeat: "no-repeat",
          WebkitMaskRepeat: "no-repeat",
          maskPosition: "center",
          WebkitMaskPosition: "center",
          maskSize: "contain",
          WebkitMaskSize: "contain",
        }}
      />
    );
  }
  return (
    <img
      src={provider.src}
      alt=""
      aria-hidden
      width={size}
      height={size}
      className={className}
      style={{
        objectFit: "contain",
        filter: "invert(1) brightness(0.05)",
      }}
    />
  );
}

function NotificationPill({
  provider,
  command,
  z,
  shiftX,
  top,
}: {
  provider: Provider;
  command: string;
  z: number;
  shiftX: number;
  top: number;
}) {
  return (
    <div
      className="absolute flex items-center gap-2 whitespace-nowrap rounded-[10px] bg-white px-2 py-1.5 shadow-[0_8px_20px_rgba(0,0,0,0.45)]"
      style={{
        zIndex: z,
        top,
        left: `calc(50% + ${shiftX}px)`,
        transform: "translateX(-50%)",
      }}
    >
      <span className="flex h-5 w-5 items-center justify-center">
        <ProviderMark provider={provider} size={16} />
      </span>
      <span className="font-mono text-[12px] text-[#0C0C0C] mr-2">
        {command}
      </span>
      <span className="rounded-[6px] bg-[#3b82f6] px-2 py-0.5 text-[11px] font-medium text-white">
        Run
      </span>
    </div>
  );
}

function ProviderTile({ provider }: { provider: Provider }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex h-[56px] w-[56px] items-center justify-center rounded-[10px] bg-white shadow-[0_4px_14px_rgba(0,0,0,0.3)]">
        <ProviderMark provider={provider} size={30} />
      </div>
      <span className="rounded-[5px] bg-[rgba(255,255,255,0.05)] px-2 py-0.5 font-mono text-[10.5px] text-[var(--dark-text-tertiary)]">
        {provider.model}
      </span>
    </div>
  );
}

function ProvidersCard() {
  return (
    <article className={`${cardClass} relative overflow-hidden`}>
      <div className="flex flex-col md:flex-row gap-8 md:gap-10 items-start md:items-center">
        <div className="md:flex-1 md:max-w-[420px]">
          <span className={eyebrowClass}>Multi-model</span>
          <h3 className={`${titleClass} mt-3`}>
            Multi-provider, multi-model.
          </h3>
          <p className={`${bodyClass} mt-2`}>
            Koda verifies Anthropic, OpenAI, Google, Ollama, and OpenAI-compatible providers — agents pick what each task needs.
          </p>
          <a
            href="#foundations"
            className="group mt-3 inline-flex items-center gap-1 text-[13.5px] text-[var(--dark-text-primary)]"
          >
            Learn more
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </a>
        </div>

        <div className="relative flex flex-col items-center md:flex-1 w-full">
          <div className="relative h-[100px] w-full max-w-[280px]">
            <NotificationPill
              provider={featuredProviders[0]}
              command="/triage-pr"
              z={3}
              shiftX={-32}
              top={0}
            />
            <NotificationPill
              provider={featuredProviders[1]}
              command="/summarize-incident"
              z={2}
              shiftX={0}
              top={26}
            />
            <NotificationPill
              provider={featuredProviders[2]}
              command="/audit-runs"
              z={1}
              shiftX={32}
              top={52}
            />
          </div>

          <div className="flex items-end gap-4 mt-3">
            {featuredProviders.map((p) => (
              <ProviderTile key={p.alt} provider={p} />
            ))}
          </div>
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
            Everything you need to run agents in production — configured from the
            dashboard, not six config files.
          </p>
        </div>

        <div className="mt-14 md:mt-16">
          <BentoGridShowcase
            integration={<ChannelsCard />}
            trackers={<AgentsCard />}
            statistic={<StatisticCard />}
            focus={<MemoryCard />}
            productivity={<ContainersCard />}
            shortcuts={<ProvidersCard />}
          />
        </div>
      </div>
    </section>
  );
}
