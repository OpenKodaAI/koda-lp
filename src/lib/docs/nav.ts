import type { DocNavItem, DocNavSection } from "./types";

export const docsNav: DocNavSection[] = [
  {
    label: "Getting started",
    items: [
      {
        title: "Introduction",
        slug: "getting-started/introduction",
        description: "What Koda is and the problem it solves.",
      },
      {
        title: "Install",
        slug: "getting-started/install",
        description: "Bring up the platform stack in one command.",
      },
      {
        title: "Quickstart",
        slug: "getting-started/quickstart",
        description: "From zero to first agent in under ten minutes.",
      },
    ],
  },
  {
    label: "Concepts",
    items: [
      {
        title: "Architecture",
        slug: "concepts/architecture",
        description: "Control plane, runtime, knowledge, memory, artifacts.",
      },
      {
        title: "Control plane",
        slug: "concepts/control-plane",
        description: "The operator-facing configuration surface.",
      },
      {
        title: "Runtime",
        slug: "concepts/runtime",
        description: "How agents are supervised and executed.",
      },
      {
        title: "Memory & knowledge",
        slug: "concepts/memory",
        description: "Retrieval, recall, and durable context assembly.",
      },
    ],
  },
  {
    label: "Skills",
    items: [
      {
        title: "Authoring a Skill",
        slug: "skills/authoring-a-skill",
        description: "Write a reusable expert prompt exposed via /skill.",
      },
      {
        title: "Best practices",
        slug: "skills/best-practices",
        description: "Patterns for skills that age well and scale across agents.",
      },
    ],
  },
  {
    label: "Deployment",
    items: [
      {
        title: "Local install",
        slug: "deployment/local",
        description: "Developer machines and evaluation environments.",
      },
      {
        title: "VPS deployment",
        slug: "deployment/vps",
        description: "Single-node production with reverse proxy and TLS.",
      },
    ],
  },
  {
    label: "Integrations",
    items: [
      {
        title: "Providers",
        slug: "integrations/providers",
        description: "Connecting managed, local, and OpenAI-compatible providers.",
      },
      {
        title: "Telegram",
        slug: "integrations/telegram",
        description: "Wire up a Telegram agent and control access.",
      },
      {
        title: "Reverse proxy",
        slug: "integrations/reverse-proxy",
        description: "Publishing Koda through Caddy, nginx, or Tailscale.",
      },
    ],
  },
  {
    label: "Reference",
    items: [
      {
        title: "Runtime API",
        slug: "api-reference/runtime",
        description: "Operational runtime routes for inspection and control.",
      },
      {
        title: "Control-plane API",
        slug: "api-reference/control-plane",
        description: "Maintained OpenAPI surface for setup, providers, agents, and access.",
      },
      {
        title: "Environment variables",
        slug: "api-reference/environment",
        description: "Bootstrap variables for .env and deployment profiles.",
      },
    ],
  },
  {
    label: "Operations",
    items: [
      {
        title: "Security",
        slug: "operations/security",
        description: "Account lockout, session hardening, CSP, and audit events.",
      },
      {
        title: "Monitoring",
        slug: "operations/monitoring",
        description: "Health checks, doctor command, and observability surfaces.",
      },
      {
        title: "Troubleshooting",
        slug: "operations/troubleshooting",
        description: "Common issues and where to look first.",
      },
    ],
  },
  {
    label: "Contributing",
    items: [
      {
        title: "Development setup",
        slug: "contributing/development-setup",
        description: "Run Koda from source and test locally.",
      },
      {
        title: "Submitting changes",
        slug: "contributing/submitting-changes",
        description: "Commits, pull requests, and review.",
      },
    ],
  },
  {
    label: "Governance",
    items: [
      {
        title: "Code of conduct",
        slug: "governance/code-of-conduct",
        description: "Community standards and enforcement.",
      },
      {
        title: "Release process",
        slug: "governance/release-process",
        description: "How Koda cuts releases and what's promised.",
      },
    ],
  },
];

export const DEFAULT_DOC_SLUG = "getting-started/introduction";

export function flattenNav(): DocNavItem[] {
  return docsNav.flatMap((section) => section.items);
}

export function findSectionLabel(slug: string): string | undefined {
  for (const section of docsNav) {
    if (section.items.some((item) => item.slug === slug)) return section.label;
  }
  return undefined;
}

export function findPrevNext(slug: string): {
  prev: DocNavItem | null;
  next: DocNavItem | null;
} {
  const flat = flattenNav();
  const index = flat.findIndex((item) => item.slug === slug);
  if (index < 0) return { prev: null, next: null };
  return {
    prev: index > 0 ? flat[index - 1] : null,
    next: index < flat.length - 1 ? flat[index + 1] : null,
  };
}
