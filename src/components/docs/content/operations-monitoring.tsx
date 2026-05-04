import Link from "next/link";
import { Callout } from "./callout";
import { CodeBlock } from "./code-block";

export function OperationsMonitoring() {
  return (
    <>
      <p>
        Koda exposes every check an operator needs through HTTP probes, the
        doctor command, and the dashboard's Operations view. No custom
        agents, no sidecars — the monitoring surface is the same stack you
        installed.
      </p>

      <h2 id="health-probes">Health probes</h2>
      <p>Two HTTP endpoints are safe to hit from any orchestrator:</p>
      <ul>
        <li>
          <code>GET /api/runtime/ready</code> — runtime readiness. 200 when
          accepting tasks, 503 otherwise.
        </li>
        <li>
          <code>GET /health</code> — lightweight liveness probe on the{" "}
          <code>app</code> service. Returns 200 if the process is alive.
        </li>
      </ul>

      <CodeBlock
        language="bash"
        code={`curl https://koda.example.com/health | jq
curl https://koda.example.com/api/runtime/ready | jq`}
      />

      <h2 id="doctor">Doctor</h2>
      <p>
        <code>koda doctor</code> runs a broader set of checks than the HTTP
        probes: bootstrap config, secret hygiene, storage connectivity,
        dashboard reachability, and control-plane reachability. It's what
        the installer runs on first boot and what the update path runs
        before committing a new release.
      </p>

      <CodeBlock
        language="bash"
        code={`koda doctor --json`}
      />

      <p>
        <code>--json</code> makes the output machine-readable — suitable for
        CI, alerting, or a scheduled cron. Each check returns a{" "}
        <code>status</code> (<code>pass</code>, <code>warn</code>,{" "}
        <code>fail</code>) and a human-readable <code>message</code>.
      </p>

      <Callout variant="tip" title="Schedule the doctor">
        A cron running <code>koda doctor --json</code> every few minutes
        catches slow drift — a rotated provider key, a nearly-full volume, a
        missing session secret — before a user hits it. Pipe the JSON into
        whatever alerting you already have.
      </Callout>

      <h2 id="dashboard">Operations dashboard</h2>
      <p>
        The dashboard's Operations view aggregates the same data the APIs
        return, with two extras:
      </p>
      <ul>
        <li>
          <strong>Integration health history</strong> — recent verification
          results per provider and integration. A pattern of failing
          verifications after a key rotation shows up here before an agent
          task fails.
        </li>
        <li>
          <strong>Audit feed</strong> — live tail of <code>security.*</code>{" "}
          events. Useful for spotting rejected-message storms or lockout
          patterns.
        </li>
      </ul>

      <h2 id="logs">Logs</h2>
      <ul>
        <li>
          <strong><code>koda logs</code></strong> tails the combined compose
          log. Pass service names to filter:{" "}
          <code>koda logs web app</code>.
        </li>
        <li>
          <strong>Structured logs</strong> — the control plane and runtime
          emit structured JSON on stderr. Pipe into journald, Loki, or
          whatever log aggregator you already run.
        </li>
        <li>
          <strong>Audit events</strong> — the <code>security.*</code> event
          family is both in the logs and in the audit store; treat them as
          the canonical record.
        </li>
      </ul>

      <h2 id="metrics">Metrics</h2>
      <p>
        A metrics surface is not part of the default install. Existing
        deployments typically scrape the JSON health endpoints and derive
        metrics from structured logs. If you need full Prometheus-style
        scraping, the typical pattern is:
      </p>
      <ul>
        <li>
          Poll <code>/health</code> and <code>/api/runtime/ready</code> with your Prometheus
          <code> blackbox_exporter</code>.
        </li>
        <li>
          Parse structured logs with Promtail or Vector to derive{" "}
          <code>koda_task_*</code>, <code>koda_auth_*</code>, and{" "}
          <code>koda_provider_*</code> metrics.
        </li>
        <li>
          Build dashboards on the familiar trio: request volume, error rate,
          queue depth.
        </li>
      </ul>

      <h2 id="checklist">Monitoring checklist</h2>
      <ul>
        <li>
          Liveness probe: HTTP <code>GET /health</code> on <code>:8090</code>.
        </li>
        <li>
          Readiness probe: HTTP <code>GET /api/runtime/ready</code>.
        </li>
        <li>
          Doctor on a schedule: <code>koda doctor --json</code> every few
          minutes, alert on non-pass.
        </li>
        <li>
          Postgres: standard metrics (connections, replication lag,
          transaction rate). Alert on backups not ≤ 24 h old.
        </li>
        <li>
          Object storage: bucket exists, write succeeds, free space
          headroom.
        </li>
        <li>
          Disk: <code>${"${STATE_ROOT_DIR}"}</code> and{" "}
          <code>${"${ARTIFACT_STORE_DIR}"}</code> free space.
        </li>
        <li>
          Session secret: present. Missing{" "}
          <code>WEB_OPERATOR_SESSION_SECRET</code> in production is a boot
          failure.
        </li>
        <li>
          TLS: certificate expiry at the reverse proxy.
        </li>
      </ul>

      <h2 id="next">Next steps</h2>
      <ul>
        <li>
          <Link href="/docs/operations/troubleshooting">Troubleshooting</Link>{" "}
          — how to respond when one of the checks above fires.
        </li>
        <li>
          <Link href="/docs/operations/security">Security</Link> — the audit
          event taxonomy.
        </li>
      </ul>
    </>
  );
}
