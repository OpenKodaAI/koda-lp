import Link from "next/link";
import { Callout } from "./callout";
import { CodeBlock } from "./code-block";

export function ReferenceRuntimeAPI() {
  return (
    <>
      <p>
        Koda exposes runtime operations through <code>/api/runtime/*</code>.
        The public OpenAPI document is for the control plane; this page is a
        practical guide to the runtime inspection and control routes that power
        the dashboard.
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
        <code>GET /api/runtime/ready</code> is the public readiness probe
        listed in the maintained control-plane OpenAPI document. Individual
        agent runtimes also expose <code>/api/runtime/readiness</code> behind
        the dashboard proxy when inspecting a specific agent.
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
          <code>GET /api/runtime/agents/:agent_id/overview</code> — readiness,
          queues, environments, and current operational state for one agent.
        </li>
      </ul>

      <h2 id="tasks">Tasks</h2>
      <ul>
        <li>
          <code>GET /api/runtime/agents/:agent_id/tasks/:task_id</code> — task
          detail plus the dashboard bundle for that run.
        </li>
        <li>
          <code>GET /api/runtime/agents/:agent_id/tasks/:task_id/events</code>{" "}
          — runtime events for the task.
        </li>
        <li>
          <code>GET /api/runtime/agents/:agent_id/tasks/:task_id/artifacts</code>,{" "}
          <code>/checkpoints</code>, <code>/terminals</code>,{" "}
          <code>/browser</code>, <code>/workspace/tree</code>,{" "}
          <code>/workspace/status</code>, <code>/workspace/diff</code>,{" "}
          <code>/services</code>, <code>/resources</code>,{" "}
          <code>/loop</code>, and <code>/sessions</code> expose the same
          runtime panes shown in the dashboard.
        </li>
        <li>
          <code>POST /api/runtime/agents/:agent_id/tasks/:task_id/cancel</code>,{" "}
          <code>/retry</code>, <code>/recover</code>, <code>/pause</code>,{" "}
          <code>/resume</code>, <code>/save</code>, <code>/pin</code>,{" "}
          <code>/unpin</code>, and <code>/cleanup</code> control a task after it
          exists.
        </li>
      </ul>

      <h3 id="task-list">Listing task data</h3>
      <p>
        Runtime dashboard routes resolve the target agent, operator session,
        and runtime endpoint for you.
      </p>
      <CodeBlock
        language="bash"
        code={`curl https://koda.example.com/api/runtime/agents/atlas/tasks?limit=25 \\
  -H "Cookie: koda_operator_session=..."`}
      />

      <h3 id="task-response">Response shape</h3>
      <p>
        Runtime task records include an id, status, timing information,
        associated agent/session identifiers, and links to related resources.
        Exact shapes are intentionally read from the dashboard contracts in
        <code> apps/web/src/lib/contracts</code> and the runtime implementation.
      </p>

      <CodeBlock
        language="json"
        code={`{
  "id": 42,
  "agent_id": "atlas",
  "status": "running",
  "created_at": "2026-04-24T11:05:21Z",
  "updated_at": "2026-04-24T11:05:22Z",
  "resources_url": "/api/runtime/tasks/42/resources"
}`}
      />

      <h3 id="task-resources">Task resources</h3>
      <p>
        The runtime exposes separate resources instead of a single catch-all
        trace endpoint. This keeps the dashboard fast: it can load events,
        artifacts, checkpoints, browser state, terminals, workspace data, and
        loop state independently.
      </p>
      <ul>
        <li>
          <strong>Events</strong> — lifecycle, provider, tool, approval, and
          audit events for the task.
        </li>
        <li>
          <strong>Artifacts</strong> — generated files and downloads exposed
          through <code>/api/runtime/artifacts/:artifact_id/download</code>.
        </li>
        <li>
          <strong>Workspace</strong> — tree, file, search, status, and diff
          views for the task workspace.
        </li>
        <li>
          <strong>Interactive surfaces</strong> — terminals, browser state,
          browser screenshots, and WebSocket relay descriptors.
        </li>
        <li>
          <strong>Control actions</strong> — cancel, retry, recover, pause,
          resume, save, attach terminal/browser, pin, unpin, and cleanup.
        </li>
      </ul>

      <h2 id="status-codes">Status codes</h2>
      <ul>
        <li><code>200</code> — success.</li>
        <li><code>202</code> — task accepted, running asynchronously.</li>
        <li><code>400</code> — malformed request body.</li>
        <li><code>401</code> — missing or invalid session / token.</li>
        <li><code>403</code> — authenticated but not allowed.</li>
        <li><code>404</code> — no such agent, session, task, or resource.</li>
        <li><code>429</code> — rate limited. Retry with backoff.</li>
        <li><code>503</code> — runtime is not ready (check <code>/api/runtime/ready</code>).</li>
      </ul>

      <h2 id="rate-limits">Rate limits</h2>
      <p>
        Operator-facing runtime routes go through the same authenticated
        dashboard/control-plane boundary as the rest of the app. Runtime
        execution still enforces per-agent policy, queue limits, and task
        lifecycle controls inside the runtime service.
      </p>

      <Callout variant="tip" title="Know which contract you need">
        Use <code>/openapi/control-plane.json</code> for setup, provider,
        agent, and access-management routes. Use this page and the dashboard
        contracts for runtime operations; the app does not currently publish a
        separate runtime OpenAPI document.
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
