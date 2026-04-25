import Link from "next/link";
import { Callout } from "./callout";
import { CodeBlock } from "./code-block";

export function ReferenceRuntimeAPI() {
  return (
    <>
      <p>
        The runtime API is served at <code>/api/runtime/*</code> on port{" "}
        <code>8090</code>. It covers task submission, inspection, and the full
        trace view that powers the dashboard. The OpenAPI contract at{" "}
        <code>/openapi/control-plane.json</code> is authoritative — this page
        summarises the routes you'll reach for most.
      </p>

      <h2 id="auth">Authentication</h2>
      <ul>
        <li>
          <strong>Operator session.</strong> The dashboard uses the{" "}
          <code>koda_operator_session</code> cookie. API calls from the same
          origin inherit it automatically.
        </li>
        <li>
          <strong>Runtime token.</strong>{" "}
          <code>RUNTIME_LOCAL_UI_TOKEN</code> guards the dashboard-to-runtime
          path when the two sit on different origins.
        </li>
        <li>
          <strong>Control-plane API token.</strong>{" "}
          <code>CONTROL_PLANE_API_TOKEN</code> (optional) lets CLI tooling
          authenticate without an operator session.
        </li>
      </ul>

      <h2 id="health">Health</h2>
      <p>
        <code>GET /api/runtime/ready</code> — readiness probe. Returns 200
        with a health payload when the runtime is accepting tasks, 503
        otherwise. Use it as the liveness check in systemd or Kubernetes.
      </p>

      <CodeBlock
        language="bash"
        code={`curl https://koda.example.com/api/runtime/ready`}
      />

      <h2 id="agents">Agents</h2>
      <ul>
        <li>
          <code>GET /api/runtime/agents</code> — list all runnable agents with
          their current state (active, paused, draft).
        </li>
        <li>
          <code>GET /api/runtime/agents/:agent_id</code> — full agent detail:
          model, Skills attached, memory scope, publication metadata.
        </li>
      </ul>

      <h2 id="tasks">Tasks</h2>
      <ul>
        <li>
          <code>POST /api/runtime/tasks</code> — submit a new task. Body: agent
          id, query, optional metadata and context overrides.
        </li>
        <li>
          <code>GET /api/runtime/tasks/:task_id</code> — task status and final
          output.
        </li>
        <li>
          <code>GET /api/runtime/tasks/:task_id/trace</code> — the full step
          trace (provider calls, tool calls, memory hits, retrieval results,
          audit).
        </li>
      </ul>

      <h3 id="task-submission">Submitting a task</h3>
      <CodeBlock
        language="bash"
        code={`curl -X POST https://koda.example.com/api/runtime/tasks \\
  -H "Cookie: koda_operator_session=..." \\
  -H "Content-Type: application/json" \\
  -d '{
    "agent_id": "atlas",
    "query": "Audit the auth service for CSP violations.",
    "metadata": { "source": "operator" }
  }'`}
      />

      <h3 id="task-response">Response shape</h3>
      <p>
        Every task returns a JSON record with a stable <code>id</code>, a{" "}
        <code>status</code> (<code>queued</code>, <code>running</code>,{" "}
        <code>completed</code>, <code>failed</code>, <code>retrying</code>,{" "}
        <code>paused</code>), metadata, and — once complete — the final
        output.
      </p>

      <CodeBlock
        language="json"
        code={`{
  "id": "tsk_2f7a…",
  "agent_id": "atlas",
  "status": "running",
  "created_at": "2026-04-24T11:05:21Z",
  "updated_at": "2026-04-24T11:05:22Z",
  "metadata": { "source": "operator" },
  "output": null
}`}
      />

      <h3 id="task-trace">Trace</h3>
      <p>
        The trace endpoint returns every step the runtime took, in order. The
        dashboard's trace view renders exactly this payload.
      </p>
      <ul>
        <li>
          <strong>Provider calls</strong> — the full prompt + streamed
          response, with provider-specific metadata (model, tokens, latency).
        </li>
        <li>
          <strong>Tool calls</strong> — parsed <code>&lt;agent_cmd&gt;</code>,
          tool result, status, any approval-loop record.
        </li>
        <li>
          <strong>Memory hits</strong> — which memories were recalled, with
          score and type.
        </li>
        <li>
          <strong>Retrieval hits</strong> — ranked knowledge chunks with their
          lexical / dense / graph ranks.
        </li>
        <li>
          <strong>Audit events</strong> — every <code>security.*</code> record
          emitted during the task.
        </li>
      </ul>

      <h2 id="status-codes">Status codes</h2>
      <ul>
        <li><code>200</code> — success.</li>
        <li><code>202</code> — task accepted, running asynchronously.</li>
        <li><code>400</code> — malformed request body.</li>
        <li><code>401</code> — missing or invalid session / token.</li>
        <li><code>403</code> — authenticated but not allowed.</li>
        <li><code>404</code> — no such agent or task.</li>
        <li><code>429</code> — rate limited. Retry with backoff.</li>
        <li><code>503</code> — runtime is not ready (check <code>/api/runtime/ready</code>).</li>
      </ul>

      <h2 id="rate-limits">Rate limits</h2>
      <p>
        The runtime shares the general operator rate bucket with the control
        plane (120 requests/minute by default, tuneable via{" "}
        <code>CONTROL_PLANE_RATE_LIMIT</code>). Task submission additionally
        respects per-agent concurrency limits configured on the agent itself.
      </p>

      <Callout variant="tip" title="Prefer the OpenAPI spec">
        This page summarises the endpoints you'll reach for most. For
        request/response shapes, authentication requirements, and full error
        payloads, <code>/openapi/control-plane.json</code> is the source of
        truth — it's regenerated on every release.
      </Callout>

      <h2 id="next">Next steps</h2>
      <ul>
        <li>
          <Link href="/docs/api-reference/control-plane">Control-plane API</Link>{" "}
          — configuration routes for providers, agents, and access.
        </li>
        <li>
          <Link href="/docs/concepts/runtime">Runtime concepts</Link> — the
          lifecycle and internal services that back these endpoints.
        </li>
      </ul>
    </>
  );
}
