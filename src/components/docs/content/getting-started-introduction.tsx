import Link from "next/link";
import { Callout } from "./callout";
import { PlatformOverviewDiagram } from "./platform-overview-diagram";

export function GettingStartedIntroduction() {
  return (
    <>
      <p>
        Koda is the <strong>open-source harness for orchestrating multi-agent,
        multi-provider AI systems</strong>. It is designed to act as a platform you
        run, not a library you import: you bring the providers, prompts, policies,
        and task shapes that fit your use case, and Koda supplies the durable
        operational runtime around them.
      </p>

      <h2 id="what-koda-is-for">What Koda is for</h2>
      <p>
        Koda is aimed at teams who need agents running <em>as production
        software</em> — where every tool call is auditable, state survives
        restarts, configuration lives in a control plane instead of hand-edited
        per-agent env files, and the same system can back research workflows,
        operations automation, support queues, engineering tasks, or any
        domain-specific agent class.
      </p>
      <p>If you've ever strung together three prompts, two agents, a vector store,
        and a cron job and wondered where the control plane should live — Koda is
        that control plane.
      </p>

      <PlatformOverviewDiagram />

      <h2 id="core-principles">Core principles</h2>
      <p>
        Five commitments shape how Koda is built. Every feature and default
        behaviour should be traceable back to one of them.
      </p>
      <ul>
        <li>
          <strong>Control-plane-first.</strong> Providers, agents, secrets, access,
          and integrations are configured through Koda itself — not through
          hand-maintained <code>.env</code> files per agent. Bootstrap
          infrastructure is separate from product configuration, so reverse
          proxies, VPN overlays, and platform shells stay thin.
        </li>
        <li>
          <strong>Durable by default.</strong> Postgres is the source of truth for
          control-plane, runtime, knowledge, memory, and audit records. Object
          binaries flow through a generic S3-compatible contract. Local disk is
          treated as scratch.
        </li>
        <li>
          <strong>Inspectable end-to-end.</strong> Every provider response, every
          tool call, every memory write is recorded and reachable through OpenAPI
          surfaces. There is no hidden state behind the prompt.
        </li>
        <li>
          <strong>Harness, not monolith.</strong> Koda does not force a single
          agent persona, task domain, or niche. Operators shape agents around the
          system, not the other way around.
        </li>
        <li>
          <strong>Operator-first UX.</strong> First-run setup, provider wiring,
          secrets, and agent editing all live in a web dashboard designed for the
          humans who keep the system running.
        </li>
      </ul>

      <h2 id="who-is-this-for">Who this is for</h2>
      <p>
        If any of the following sounds familiar, Koda is probably the shape you
        want:
      </p>
      <ul>
        <li>
          Teams moving agent workloads off prototype scripts and into something
          they can keep on-call for.
        </li>
        <li>
          Organisations that need self-hosted AI infrastructure — by policy,
          compliance, data residency, or preference.
        </li>
        <li>
          Operators tired of juggling provider credentials, cron triggers, and
          memory vectors through a YAML tapestry.
        </li>
        <li>
          Developers building an agent product on top of a runtime they can
          actually read the source of and fork.
        </li>
      </ul>

      <h2 id="what-you-get-out-of-the-box">What you get out of the box</h2>
      <p>The default installation brings up a coherent stack:</p>
      <ul>
        <li>
          A <strong>Next.js operator dashboard</strong> on port <code>3000</code>,
          covering setup, provider configuration, agent management, runtime
          inspection, and operational surfaces.
        </li>
        <li>
          A <strong>Python control-plane + runtime service</strong> on port{" "}
          <code>8090</code>, exposing OpenAPI-documented routes for every surface
          the dashboard uses.
        </li>
        <li>
          <strong>Postgres</strong> for durable state — one database, multiple
          schemas for runtime, control-plane, knowledge, memory, and audit.
        </li>
        <li>
          <strong>SeaweedFS</strong> as the default bundled S3-compatible object
          store for artifacts and large binaries.
        </li>
        <li>
          A <strong>doctor command</strong> that checks your bootstrap config,
          storage, secrets, and reachability before you start operating.
        </li>
      </ul>

      <Callout variant="info" title="Scope">
        Koda ships as a platform stack. It does not bundle model weights, a vector
        database product, or a proprietary agent framework — it orchestrates the
        providers, stores, and tools you already use.
      </Callout>

      <h2 id="next-steps">Next steps</h2>
      <p>Pick the path that matches where you are:</p>
      <ul>
        <li>
          <Link href="/docs/getting-started/install">Install Koda</Link> — detailed
          setup with prerequisites, first-run flow, and verification.
        </li>
        <li>
          <Link href="/docs/getting-started/quickstart">Quickstart</Link> — one
          command to a running agent in under ten minutes.
        </li>
        <li>
          <Link href="/docs/concepts/architecture">Architecture</Link> — the
          mental model: control plane, runtime, knowledge, memory, artifacts.
        </li>
      </ul>
    </>
  );
}
