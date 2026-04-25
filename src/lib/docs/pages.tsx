import type { DocHeading, DocPage } from "./types";
import { docsNav } from "./nav";
import { GettingStartedIntroduction } from "@/components/docs/content/getting-started-introduction";
import { GettingStartedInstall } from "@/components/docs/content/getting-started-install";
import { GettingStartedQuickstart } from "@/components/docs/content/getting-started-quickstart";
import { ConceptsArchitecture } from "@/components/docs/content/concepts-architecture";
import { ConceptsControlPlane } from "@/components/docs/content/concepts-control-plane";
import { ConceptsRuntime } from "@/components/docs/content/concepts-runtime";
import { ConceptsMemory } from "@/components/docs/content/concepts-memory";
import { SkillsAuthoring } from "@/components/docs/content/skills-authoring";
import { SkillsBestPractices } from "@/components/docs/content/skills-best-practices";
import { DeploymentLocal } from "@/components/docs/content/deployment-local";
import { DeploymentVPS } from "@/components/docs/content/deployment-vps";
import { IntegrationsProviders } from "@/components/docs/content/integrations-providers";
import { IntegrationsTelegram } from "@/components/docs/content/integrations-telegram";
import { IntegrationsReverseProxy } from "@/components/docs/content/integrations-reverse-proxy";
import { ReferenceRuntimeAPI } from "@/components/docs/content/reference-runtime-api";
import { ReferenceControlPlaneAPI } from "@/components/docs/content/reference-control-plane-api";
import { ReferenceEnvironment } from "@/components/docs/content/reference-environment";
import { OperationsSecurity } from "@/components/docs/content/operations-security";
import { OperationsMonitoring } from "@/components/docs/content/operations-monitoring";
import { OperationsTroubleshooting } from "@/components/docs/content/operations-troubleshooting";
import { ContributingDevSetup } from "@/components/docs/content/contributing-dev-setup";
import { ContributingSubmitting } from "@/components/docs/content/contributing-submitting";
import { GovernanceCodeOfConduct } from "@/components/docs/content/governance-code-of-conduct";
import { GovernanceReleaseProcess } from "@/components/docs/content/governance-release-process";

/**
 * Placeholder content renderer used until a page is authored. The surrounding
 * layout, sidebar, search, prev/next, and on-this-page TOC are already wired
 * up around whatever renders here.
 */
function PlaceholderContent({ title }: { title: string }) {
  return (
    <>
      <p>
        This section is part of a staged rollout — it will be filled with
        authored prose in a subsequent pass. The surrounding layout (sidebar,
        search, prev/next, and on-this-page TOC) is already wired up and will
        pick up the real content as soon as it lands here.
      </p>
      <h2 id="what-this-page-will-cover">What this page will cover</h2>
      <p>
        When complete, <strong>{title}</strong> will document the concepts, flows,
        defaults, and common pitfalls for the topic. Scope and depth will match
        the authoritative source material in the Koda repo.
      </p>
    </>
  );
}

const placeholderHeadings: DocHeading[] = [
  {
    id: "what-this-page-will-cover",
    text: "What this page will cover",
    level: 2,
  },
];

const introductionHeadings: DocHeading[] = [
  { id: "what-koda-is-for", text: "What Koda is for", level: 2 },
  { id: "core-principles", text: "Core principles", level: 2 },
  { id: "who-is-this-for", text: "Who this is for", level: 2 },
  { id: "what-you-get-out-of-the-box", text: "What you get out of the box", level: 2 },
  { id: "next-steps", text: "Next steps", level: 2 },
];

const installHeadings: DocHeading[] = [
  { id: "prerequisites", text: "Prerequisites", level: 2 },
  { id: "install-with-the-cli", text: "Install with the CLI", level: 2 },
  { id: "what-the-installer-does", text: "What the installer does", level: 2 },
  { id: "services-that-start", text: "Services that start", level: 2 },
  { id: "first-run-flow", text: "First-run flow", level: 2 },
  { id: "diagnostics", text: "Diagnostics", level: 2 },
  { id: "lifecycle", text: "Lifecycle commands", level: 2 },
  { id: "where-next", text: "Where next", level: 2 },
];

const quickstartHeadings: DocHeading[] = [
  { id: "one-command-install", text: "One-command install", level: 2 },
  { id: "first-owner-setup", text: "First-owner setup", level: 2 },
  { id: "connect-a-provider", text: "Connect a provider", level: 2 },
  { id: "create-the-first-agent", text: "Create the first agent", level: 2 },
  { id: "run-your-first-task", text: "Run your first task", level: 2 },
  { id: "verify-the-install", text: "Verify the install", level: 2 },
  { id: "keyboard-shortcuts", text: "Keyboard shortcuts you'll use", level: 2 },
  { id: "where-next", text: "Where next", level: 2 },
];

const architectureHeadings: DocHeading[] = [
  { id: "layers", text: "The six domains", level: 2 },
  { id: "communication", text: "How the layers talk", level: 2 },
  { id: "deployment", text: "Deployment topology", level: 2 },
  { id: "state-and-storage", text: "State and storage", level: 2 },
  { id: "public-surfaces", text: "Public surfaces", level: 2 },
  { id: "next", text: "Go deeper", level: 2 },
];

const controlPlaneHeadings: DocHeading[] = [
  { id: "what-it-owns", text: "What the control plane owns", level: 2 },
  { id: "api-groups", text: "API organisation", level: 2 },
  { id: "authentication-model", text: "Authentication model", level: 2 },
  { id: "break-glass", text: "Break-glass token", level: 2 },
  { id: "audit", text: "Audit trail", level: 2 },
  { id: "dashboard", text: "Relationship to the dashboard", level: 2 },
  { id: "next", text: "Go deeper", level: 2 },
];

const runtimeHeadings: DocHeading[] = [
  { id: "execution-lifecycle", text: "Execution lifecycle", level: 2 },
  { id: "runtime-layers", text: "Runtime layers in code", level: 2 },
  { id: "internal-services", text: "Internal gRPC services", level: 2 },
  { id: "tool-loop", text: "The agent tool loop", level: 2 },
  { id: "runtime-api", text: "The runtime HTTP surface", level: 2 },
  { id: "operational-characteristics", text: "Operational characteristics", level: 2 },
  { id: "next", text: "Go deeper", level: 2 },
];

const memoryHeadings: DocHeading[] = [
  { id: "the-memory-map", text: "The memory map", level: 2 },
  { id: "memory-lifecycle", text: "Memory lifecycle", level: 2 },
  { id: "memory-types", text: "Memory types", level: 2 },
  { id: "memory-status", text: "Memory status", level: 2 },
  { id: "memory-layers", text: "Memory layers", level: 2 },
  { id: "configuration", text: "Configuration knobs", level: 2 },
  { id: "knowledge-retrieval", text: "Knowledge retrieval", level: 2 },
  { id: "next", text: "Go deeper", level: 2 },
];

const skillsAuthoringHeadings: DocHeading[] = [
  { id: "anatomy", text: "Anatomy of a skill", level: 2 },
  { id: "frontmatter", text: "Frontmatter fields", level: 2 },
  { id: "body-sections", text: "Body sections", level: 2 },
  { id: "lifecycle", text: "From file to composed prompt", level: 2 },
  { id: "invocation", text: "Invocation", level: 2 },
  { id: "discovery", text: "Listing and discovery", level: 2 },
  { id: "next", text: "Next steps", level: 2 },
];

const deploymentLocalHeadings: DocHeading[] = [
  { id: "prerequisites", text: "Prerequisites", level: 2 },
  { id: "install", text: "Install", level: 2 },
  { id: "what-starts", text: "What the installer starts", level: 2 },
  { id: "default-env", text: "Defaults that matter locally", level: 2 },
  { id: "first-boot", text: "First-boot flow", level: 2 },
  { id: "manual", text: "Manual startup", level: 2 },
  { id: "doctor", text: "Doctor diagnostics", level: 2 },
  { id: "lifecycle", text: "Lifecycle", level: 2 },
  { id: "next", text: "Next steps", level: 2 },
];

const integrationsProvidersHeadings: DocHeading[] = [
  { id: "connection-lifecycle", text: "Connection lifecycle", level: 2 },
  { id: "supported-providers", text: "Supported providers", level: 2 },
  { id: "api-surface", text: "API surface", level: 2 },
  { id: "fallback", text: "Fallback and resume", level: 2 },
  { id: "per-agent-override", text: "Per-agent model override", level: 2 },
  { id: "health", text: "Integration health", level: 2 },
  { id: "next", text: "Next steps", level: 2 },
];

const integrationsTelegramHeadings: DocHeading[] = [
  { id: "what-you-get", text: "What you get", level: 2 },
  { id: "setup", text: "Setting up a Telegram agent", level: 2 },
  { id: "access-policy", text: "Access policy", level: 2 },
  { id: "message-flow", text: "Message flow", level: 2 },
  { id: "commands", text: "Commands in chat", level: 2 },
  { id: "where-creds-live", text: "Where credentials live", level: 2 },
  { id: "troubleshooting", text: "Common issues", level: 2 },
  { id: "next", text: "Next steps", level: 2 },
];

const referenceRuntimeAPIHeadings: DocHeading[] = [
  { id: "auth", text: "Authentication", level: 2 },
  { id: "health", text: "Health", level: 2 },
  { id: "agents", text: "Agents", level: 2 },
  { id: "tasks", text: "Tasks", level: 2 },
  { id: "status-codes", text: "Status codes", level: 2 },
  { id: "rate-limits", text: "Rate limits", level: 2 },
  { id: "next", text: "Next steps", level: 2 },
];

const referenceControlPlaneAPIHeadings: DocHeading[] = [
  { id: "auth", text: "Authentication & sessions", level: 2 },
  { id: "agents", text: "Agents", level: 2 },
  { id: "providers", text: "Providers", level: 2 },
  { id: "connections", text: "Connections & integrations", level: 2 },
  { id: "system", text: "System & onboarding", level: 2 },
  { id: "skills", text: "Skills", level: 2 },
  { id: "conventions", text: "Conventions", level: 2 },
  { id: "openapi", text: "OpenAPI spec", level: 2 },
  { id: "next", text: "Next steps", level: 2 },
];

const operationsSecurityHeadings: DocHeading[] = [
  { id: "authentication", text: "Authentication", level: 2 },
  { id: "session-revocation", text: "Session revocation", level: 2 },
  { id: "rate-limits", text: "Rate limits and lockout", level: 2 },
  { id: "production-refusals", text: "Production refusals", level: 2 },
  { id: "csp", text: "Content Security Policy", level: 2 },
  { id: "bootstrap", text: "Bootstrap flow", level: 2 },
  { id: "secrets", text: "Secrets at rest", level: 2 },
  { id: "runtime-validation", text: "Runtime validation", level: 2 },
  { id: "audit", text: "Audit trail", level: 2 },
  { id: "checklist", text: "Hardening checklist", level: 2 },
  { id: "next", text: "Next steps", level: 2 },
];

const operationsMonitoringHeadings: DocHeading[] = [
  { id: "health-probes", text: "Health probes", level: 2 },
  { id: "doctor", text: "Doctor", level: 2 },
  { id: "dashboard", text: "Operations dashboard", level: 2 },
  { id: "logs", text: "Logs", level: 2 },
  { id: "metrics", text: "Metrics", level: 2 },
  { id: "checklist", text: "Monitoring checklist", level: 2 },
  { id: "next", text: "Next steps", level: 2 },
];

const contributingDevSetupHeadings: DocHeading[] = [
  { id: "prerequisites", text: "Prerequisites", level: 2 },
  { id: "clone", text: "Clone and bootstrap", level: 2 },
  { id: "backend", text: "Backend development", level: 2 },
  { id: "web", text: "Web dashboard development", level: 2 },
  { id: "proto", text: "Regenerating proto contracts", level: 2 },
  { id: "migrations", text: "Database migrations", level: 2 },
  { id: "skills", text: "Adding a runtime skill", level: 2 },
  { id: "directory", text: "Repository layout", level: 2 },
  { id: "next", text: "Next steps", level: 2 },
];

const contributingSubmittingHeadings: DocHeading[] = [
  { id: "before-you-start", text: "Before you start", level: 2 },
  { id: "branches", text: "Branches", level: 2 },
  { id: "commits", text: "Commits", level: 2 },
  { id: "pull-requests", text: "Pull requests", level: 2 },
  { id: "checks", text: "Local checks before opening", level: 2 },
  { id: "tests", text: "Tests", level: 2 },
  { id: "docs", text: "Documentation", level: 2 },
  { id: "review", text: "Review", level: 2 },
  { id: "merging", text: "Merging", level: 2 },
  { id: "security", text: "Security-sensitive changes", level: 2 },
  { id: "next", text: "Next steps", level: 2 },
];

const governanceCodeOfConductHeadings: DocHeading[] = [
  { id: "principles", text: "Principles", level: 2 },
  { id: "not-ok", text: "What's not OK", level: 2 },
  { id: "reporting", text: "Reporting", level: 2 },
  { id: "enforcement", text: "Enforcement", level: 2 },
  { id: "attribution", text: "Attribution", level: 2 },
  { id: "next", text: "Next steps", level: 2 },
];

const governanceReleaseProcessHeadings: DocHeading[] = [
  { id: "versioning", text: "Versioning", level: 2 },
  { id: "release-cadence", text: "Cadence", level: 2 },
  { id: "cut-a-release", text: "How a release is cut", level: 2 },
  { id: "recovery", text: "Recovery from partial publications", level: 2 },
  { id: "what-ships", text: "What ships", level: 2 },
  { id: "user-update-path", text: "User update path", level: 2 },
  { id: "release-notes", text: "Release notes", level: 2 },
  { id: "deprecations", text: "Deprecations", level: 2 },
  { id: "next", text: "Next steps", level: 2 },
];

const operationsTroubleshootingHeadings: DocHeading[] = [
  { id: "doctor-red", text: "Doctor is red", level: 2 },
  { id: "auth-issues", text: "Authentication issues", level: 2 },
  { id: "provider-issues", text: "Provider issues", level: 2 },
  { id: "agent-issues", text: "Agent issues", level: 2 },
  { id: "storage-issues", text: "Storage issues", level: 2 },
  { id: "upgrade", text: "Upgrade went wrong", level: 2 },
  { id: "getting-help", text: "Getting help", level: 2 },
  { id: "next", text: "Next steps", level: 2 },
];

const referenceEnvironmentHeadings: DocHeading[] = [
  { id: "environment", text: "Environment profile", level: 2 },
  { id: "control-plane", text: "Control plane", level: 2 },
  { id: "web", text: "Web dashboard", level: 2 },
  { id: "state", text: "State & storage roots", level: 2 },
  { id: "postgres", text: "Postgres", level: 2 },
  { id: "s3", text: "Object storage", level: 2 },
  { id: "memory", text: "Memory", level: 2 },
  { id: "knowledge", text: "Knowledge", level: 2 },
  { id: "skills-env", text: "Skills", level: 2 },
  { id: "browser", text: "Browser automation", level: 2 },
  { id: "next", text: "Next steps", level: 2 },
];

const integrationsReverseProxyHeadings: DocHeading[] = [
  { id: "what-to-publish", text: "What to publish", level: 2 },
  { id: "caddy", text: "Caddy", level: 2 },
  { id: "nginx", text: "nginx", level: 2 },
  { id: "tailscale", text: "Tailscale (private access)", level: 2 },
  { id: "headers", text: "Required response behaviour", level: 2 },
  { id: "verify", text: "Verify the setup", level: 2 },
  { id: "next", text: "Next steps", level: 2 },
];

const deploymentVPSHeadings: DocHeading[] = [
  { id: "target", text: "Target environment", level: 2 },
  { id: "install", text: "Install", level: 2 },
  { id: "bindings", text: "Localhost bindings", level: 2 },
  { id: "reverse-proxy", text: "Reverse proxy model", level: 2 },
  { id: "production-checklist", text: "Production checklist", level: 2 },
  { id: "hardening", text: "Hardening baseline", level: 2 },
  { id: "verify", text: "Verify the install", level: 2 },
  { id: "systemd", text: "Running under systemd", level: 2 },
  { id: "upgrades", text: "Upgrades", level: 2 },
  { id: "next", text: "Next steps", level: 2 },
];

const skillsBestPracticesHeadings: DocHeading[] = [
  { id: "scope-the-methodology", text: "Scope the methodology", level: 2 },
  { id: "instruction-is-terse", text: "Keep the instruction terse", level: 2 },
  { id: "enforce-output-shape", text: "Enforce output shape", level: 2 },
  { id: "numbered-approach", text: "Write the approach as numbered steps", level: 2 },
  { id: "signal-confidence", text: "Signal confidence and limits", level: 2 },
  { id: "triggers", text: "Trigger patterns", level: 2 },
  { id: "priority-and-tokens", text: "Priority and token budgets", level: 2 },
  { id: "aliases", text: "Use aliases generously", level: 2 },
  { id: "composition", text: "Compose sparingly", level: 2 },
  { id: "versioning", text: "Versioning and change", level: 2 },
  { id: "smoke-test", text: "Smoke-test before shipping", level: 2 },
  { id: "next", text: "Next steps", level: 2 },
];

/**
 * Per-slug overrides that replace the placeholder body + default TOC with
 * real authored content. Unknown slugs fall back to the placeholder.
 */
const authored: Partial<Record<string, Pick<DocPage, "content" | "headings">>> = {
  "getting-started/introduction": {
    content: () => <GettingStartedIntroduction />,
    headings: introductionHeadings,
  },
  "getting-started/install": {
    content: () => <GettingStartedInstall />,
    headings: installHeadings,
  },
  "getting-started/quickstart": {
    content: () => <GettingStartedQuickstart />,
    headings: quickstartHeadings,
  },
  "concepts/architecture": {
    content: () => <ConceptsArchitecture />,
    headings: architectureHeadings,
  },
  "concepts/control-plane": {
    content: () => <ConceptsControlPlane />,
    headings: controlPlaneHeadings,
  },
  "concepts/runtime": {
    content: () => <ConceptsRuntime />,
    headings: runtimeHeadings,
  },
  "concepts/memory": {
    content: () => <ConceptsMemory />,
    headings: memoryHeadings,
  },
  "skills/authoring-a-skill": {
    content: () => <SkillsAuthoring />,
    headings: skillsAuthoringHeadings,
  },
  "skills/best-practices": {
    content: () => <SkillsBestPractices />,
    headings: skillsBestPracticesHeadings,
  },
  "deployment/local": {
    content: () => <DeploymentLocal />,
    headings: deploymentLocalHeadings,
  },
  "deployment/vps": {
    content: () => <DeploymentVPS />,
    headings: deploymentVPSHeadings,
  },
  "integrations/providers": {
    content: () => <IntegrationsProviders />,
    headings: integrationsProvidersHeadings,
  },
  "integrations/telegram": {
    content: () => <IntegrationsTelegram />,
    headings: integrationsTelegramHeadings,
  },
  "integrations/reverse-proxy": {
    content: () => <IntegrationsReverseProxy />,
    headings: integrationsReverseProxyHeadings,
  },
  "api-reference/runtime": {
    content: () => <ReferenceRuntimeAPI />,
    headings: referenceRuntimeAPIHeadings,
  },
  "api-reference/control-plane": {
    content: () => <ReferenceControlPlaneAPI />,
    headings: referenceControlPlaneAPIHeadings,
  },
  "api-reference/environment": {
    content: () => <ReferenceEnvironment />,
    headings: referenceEnvironmentHeadings,
  },
  "operations/security": {
    content: () => <OperationsSecurity />,
    headings: operationsSecurityHeadings,
  },
  "operations/monitoring": {
    content: () => <OperationsMonitoring />,
    headings: operationsMonitoringHeadings,
  },
  "operations/troubleshooting": {
    content: () => <OperationsTroubleshooting />,
    headings: operationsTroubleshootingHeadings,
  },
  "contributing/development-setup": {
    content: () => <ContributingDevSetup />,
    headings: contributingDevSetupHeadings,
  },
  "contributing/submitting-changes": {
    content: () => <ContributingSubmitting />,
    headings: contributingSubmittingHeadings,
  },
  "governance/code-of-conduct": {
    content: () => <GovernanceCodeOfConduct />,
    headings: governanceCodeOfConductHeadings,
  },
  "governance/release-process": {
    content: () => <GovernanceReleaseProcess />,
    headings: governanceReleaseProcessHeadings,
  },
};

export const docPages: Record<string, DocPage> = docsNav
  .flatMap((section) =>
    section.items.map((item) => {
      const override = authored[item.slug];
      return [
        item.slug,
        {
          slug: item.slug,
          section: section.label,
          title: item.title,
          description: item.description,
          content:
            override?.content ?? (() => <PlaceholderContent title={item.title} />),
          headings: override?.headings ?? placeholderHeadings,
        } satisfies DocPage,
      ];
    })
  )
  .reduce<Record<string, DocPage>>((acc, [slug, page]) => {
    acc[slug as string] = page as DocPage;
    return acc;
  }, {});

export function getDocPage(slug: string): DocPage | undefined {
  return docPages[slug];
}

export function getAllDocSlugs(): string[] {
  return Object.keys(docPages);
}
