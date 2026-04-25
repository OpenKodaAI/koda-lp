import Link from "next/link";
import { ArchitectureDiagram } from "./architecture-diagram";
import { Callout } from "./callout";

export function ConceptsArchitecture() {
  return (
    <>
      <p>
        Koda is a <strong>control-plane-first agent platform</strong>. The
        repository ships both the operator-facing product surfaces and the
        runtime services required to execute, ground, and supervise configurable
        agents in production-style environments. This page walks through the
        full topology and how the layers communicate.
      </p>

      <ArchitectureDiagram />

      <h2 id="layers">The six domains</h2>
      <p>
        Koda is organised around six stable domains. Everything else is an
        implementation detail underneath one of them.
      </p>
      <ul>
        <li>
          <strong>Control plane</strong> — setup, provider configuration, secrets,
          agent definitions, publication, and operator APIs.
        </li>
        <li>
          <strong>Runtime</strong> — queue orchestration, execution supervision,
          runtime APIs, agent tools, and provider adapters.
        </li>
        <li>
          <strong>Knowledge</strong> — retrieval, evidence sourcing, and
          operator-approved grounding context.
        </li>
        <li>
          <strong>Memory</strong> — recall, extraction, curation, and durable
          semantic context.
        </li>
        <li>
          <strong>Artifacts</strong> — ingestion, metadata, object-backed
          binaries, and evidence generation.
        </li>
        <li>
          <strong>Infrastructure</strong> — Postgres, S3-compatible object
          storage, Docker Compose, health checks, and bootstrap tooling.
        </li>
      </ul>

      <Callout variant="tip" title="Harness-oriented by design">
        Koda is deliberately not a single niche, assistant persona, or task
        domain. Multi-agent and multi-provider configurations are first-class
        operating patterns. Infrastructure bootstrap is separated from product
        configuration so operators can shape agents however they need.
      </Callout>

      <h2 id="communication">How the layers talk</h2>
      <p>
        Four transport patterns cover everything. The architecture diagram above
        highlights each one in a different colour.
      </p>
      <ul>
        <li>
          <strong>HTTP</strong> — the control plane serves <code>/api/control-plane/*</code>{" "}
          and the runtime surfaces <code>/api/runtime/*</code> on port{" "}
          <code>8090</code>. The Next.js dashboard on port <code>3000</code>{" "}
          proxies everything it needs through these same routes.
        </li>
        <li>
          <strong>gRPC (internal)</strong> — the control plane and runtime call
          five internal services: <code>runtime-kernel:50061</code>,{" "}
          <code>retrieval:50062</code>, <code>memory:50063</code>,{" "}
          <code>artifact:50064</code>, <code>security:50065</code>. None of
          these ports are exposed outside the compose network.
        </li>
        <li>
          <strong>SQL</strong> — every service with durable state talks to a
          single Postgres instance (with <code>pgvector</code>) through typed
          repositories. No service owns its own SQLite or embedded store.
        </li>
        <li>
          <strong>S3-compatible</strong> — binary artifacts travel over the S3
          API to SeaweedFS (port <code>8333</code> internal). Swap in AWS S3,
          MinIO, or Cloudflare R2 by changing the endpoint; the contract is
          identical.
        </li>
      </ul>

      <h2 id="deployment">Deployment topology</h2>
      <p>
        The default installation brings up one compose stack with four
        public-facing services and five internal gRPC services. Both the local
        quickstart and the single-node VPS path use the same topology so that
        production and development stay close.
      </p>
      <ul>
        <li>
          <strong>web</strong> (Next.js dashboard) and <strong>app</strong>{" "}
          (control plane + runtime HTTP) are the only services that should ever
          be reachable from outside the compose network.
        </li>
        <li>
          <strong>postgres</strong> holds durable state for every service —
          runtime, control-plane, knowledge, memory, and audit all live here
          under separate schemas.
        </li>
        <li>
          <strong>seaweedfs</strong> + <strong>seaweedfs-init</strong> provide
          the bundled S3-compatible object store. <code>seaweedfs-init</code> is
          a one-shot container that creates the default bucket on first boot.
        </li>
        <li>
          The five internal gRPC services are started by the same compose file
          but bind only to the <code>backend</code> network.
        </li>
      </ul>

      <h2 id="state-and-storage">State and storage</h2>
      <p>
        Koda uses durable storage by default. Local disk is treated as scratch
        only — if you lose a container, you lose nothing that matters.
      </p>
      <ul>
        <li>
          <strong>Postgres</strong> is the source of truth for control-plane,
          runtime, memory, knowledge, and audit records. The same database,
          different schemas.
        </li>
        <li>
          <strong>Object binaries</strong> and artifact payloads flow through a
          generic S3-compatible contract. SeaweedFS is the default, but the
          system doesn't care which backend serves the contract.
        </li>
        <li>
          <strong>Local disk</strong> inside containers is scratch. Runtime
          workspaces, git worktrees, terminal scratch — all ephemeral.
        </li>
      </ul>

      <Callout variant="info" title="Why control-plane-first">
        Product configuration (providers, agents, secrets, integrations) lives
        behind the control plane, not in per-agent <code>.env</code> files.
        Bootstrap infrastructure (Docker, Postgres, object storage) is separate.
        This keeps reverse proxies, Tailscale, and VPS platforms thin and
        focused on infrastructure concerns.
      </Callout>

      <h2 id="public-surfaces">Public surfaces</h2>
      <p>
        Everything external ever sees comes through one of these entry points:
      </p>
      <ul>
        <li>
          <code>/</code> and <code>/control-plane</code> — the Next.js operator
          dashboard.
        </li>
        <li>
          <code>/setup</code> — first-boot compatibility bridge.
        </li>
        <li>
          <code>/api/control-plane/*</code> — HTTP control-plane API.
        </li>
        <li>
          <code>/api/runtime/*</code> — HTTP runtime API.
        </li>
        <li>
          <code>/docs/openapi/control-plane.json</code> — the OpenAPI contract
          that the dashboard (and any external integration) is built against.
        </li>
      </ul>

      <h2 id="next">Go deeper</h2>
      <ul>
        <li>
          <Link href="/docs/concepts/control-plane">Control plane</Link> — what
          operators configure and how the API is organised.
        </li>
        <li>
          <Link href="/docs/concepts/runtime">Runtime</Link> — the execution
          lifecycle and the five internal services.
        </li>
        <li>
          <Link href="/docs/concepts/memory">Memory &amp; knowledge</Link> — how
          recall and retrieval ground every task.
        </li>
      </ul>
    </>
  );
}
