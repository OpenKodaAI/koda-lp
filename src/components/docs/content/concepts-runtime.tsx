import Link from "next/link";
import { Callout } from "./callout";
import { CodeBlock } from "./code-block";
import { RuntimeFlowDiagram } from "./runtime-flow-diagram";

export function ConceptsRuntime() {
  return (
    <>
      <p>
        The runtime is the <strong>execution layer</strong>. It receives
        requests, resolves which agent should handle them, assembles context
        from memory and knowledge, dispatches to a provider, runs the tool
        loop, and writes every result, artifact, and audit record to durable
        storage. Everything you ever see in the dashboard's trace view
        originated here.
      </p>

      <RuntimeFlowDiagram />

      <h2 id="execution-lifecycle">Execution lifecycle</h2>
      <p>
        Every task follows the same seven-step pipeline. Each step has a clear
        owner, a timeout, and a failure mode that degrades rather than hides.
      </p>
      <ol>
        <li>
          <strong>Intake.</strong> A supported interface — Telegram, the
          dashboard chat, the runtime HTTP API — receives a user query. The
          handler normalises it into the canonical runtime request shape.
        </li>
        <li>
          <strong>Access enforcement.</strong> The handler applies
          policy-defined user access controls before the request enters the
          queue.
        </li>
        <li>
          <strong>Resolution.</strong> The queue manager identifies the active
          agent, pulls the compiled prompt contract, resolves provider + model,
          and builds the execution context.
        </li>
        <li>
          <strong>Context assembly.</strong> Memory recall, knowledge
          retrieval, and artifact analysis are invoked in parallel. All three
          are best-effort and time-bounded — the task never blocks on them.
        </li>
        <li>
          <strong>Provider execution.</strong> The selected provider runs the
          task. Results stream back through the runner (Claude, Codex, Ollama,
          etc.). Streaming is preserved where the provider supports it.
        </li>
        <li>
          <strong>Tool loop.</strong> If the response contains{" "}
          <code>&lt;agent_cmd&gt;</code> tags, they are parsed, validated,
          executed, and the structured <code>&lt;tool_result&gt;</code> is fed
          back into the provider. The loop continues until no more commands
          appear, a cycle is detected, or the iteration cap is reached.
        </li>
        <li>
          <strong>Persistence.</strong> Results, metadata, artifacts, memory
          writes, and audit records land in Postgres and the S3-compatible
          store. The final output is returned through the original calling
          interface.
        </li>
      </ol>

      <Callout variant="info" title="Best-effort context">
        Memory and knowledge are best-effort. A timeout or error never blocks
        the provider call — the agent proceeds with whatever context landed in
        time. Hard security boundaries, on the other hand, are always
        fail-closed.
      </Callout>

      <h2 id="runtime-layers">Runtime layers in code</h2>
      <p>
        The pipeline above maps onto five source-code layers. If you're
        debugging, this is the right order to read in.
      </p>
      <ul>
        <li>
          <strong>Handlers and adapters</strong> (<code>koda/handlers</code>) —
          interface-specific input normalisation and access control.
        </li>
        <li>
          <strong>Queue and orchestration</strong> (<code>koda/services/queue_manager.py</code>){" "}
          — resolves context, coordinates context assembly, dispatches to
          providers, handles fallback.
        </li>
        <li>
          <strong>Provider runners</strong> (<code>koda/services/llm_runner.py</code>,{" "}
          <code>claude_runner.py</code>, <code>codex_runner.py</code>) —
          provider-specific CLI and adapter invocation; session continuity.
        </li>
        <li>
          <strong>Tool dispatcher</strong> (<code>koda/services/tool_dispatcher.py</code>,{" "}
          <code>tool_prompt.py</code>) — parses <code>&lt;agent_cmd&gt;</code>,
          enforces policy, runs bounded tools, returns{" "}
          <code>&lt;tool_result&gt;</code>.
        </li>
        <li>
          <strong>Persistence</strong> (<code>koda/state</code>,{" "}
          <code>koda/services/runtime</code>) — state, metadata, audit rows,
          artifact references.
        </li>
      </ul>

      <h2 id="internal-services">Internal gRPC services</h2>
      <p>
        Behind the HTTP surface, five specialised gRPC services own the hard
        parts. They run in the same compose network, are bound to{" "}
        <code>127.0.0.1</code> only, and are reached through their{" "}
        <code>{"*_GRPC_TARGET"}</code> environment variables.
      </p>
      <ul>
        <li>
          <code>runtime-kernel:50061</code> —{" "}
          <strong>environment &amp; task lifecycle</strong>. Creates isolated
          work environments (git worktrees), launches background tasks, runs
          commands with timeouts, opens and streams interactive terminals,
          drives browser automation sessions, snapshots and restores
          workspaces.
        </li>
        <li>
          <code>memory:50063</code> — <strong>recall + extraction</strong>.
          Recalls context pre-query with a 3-second budget; extracts candidate
          memories post-query; runs clustering, deduplication, curation, and
          the memory map view.
        </li>
        <li>
          <code>retrieval:50062</code> — <strong>knowledge search</strong>.
          Hybrid lexical + dense + graph retrieval over operator-approved
          knowledge, returning ranked hits, canonical entities, graph
          relations, authoritative evidence, and a grounding score.
        </li>
        <li>
          <code>artifact:50064</code> —{" "}
          <strong>artifact ingest &amp; evidence</strong>. Streams artifact
          uploads into the S3-compatible store, extracts evidence (text, OCR,
          transcription, media analysis), tracks metadata.
        </li>
        <li>
          <code>security:50065</code> —{" "}
          <strong>validation &amp; redaction</strong>. Shell-command
          validation, environment sanitisation, runtime-path validation, S3
          object-key validation, credential redaction for logs, filesystem
          policy.
        </li>
      </ul>

      <h2 id="tool-loop">The agent tool loop</h2>
      <p>
        When an agent wants to take an action, it emits an{" "}
        <code>&lt;agent_cmd&gt;</code> tag in its textual response. The
        dispatcher walks the response, turns every tag into a tool call, and
        feeds structured results back.
      </p>

      <CodeBlock
        language="text"
        code={`<agent_cmd tool="runtime.run" timeout="30">
  pnpm test --filter=web
</agent_cmd>`}
      />

      <p>Behind that tag the dispatcher runs the following loop:</p>
      <ol>
        <li>Parse every <code>&lt;agent_cmd&gt;</code> from the response.</li>
        <li>
          Check policy: in supervised mode, write operations surface as a
          confirmation requirement instead of executing blindly.
        </li>
        <li>
          Run each tool handler with its timeout and feature gates.
        </li>
        <li>
          Wrap the output in a <code>&lt;tool_result&gt;</code> tag and resume
          the active provider session with the new context.
        </li>
        <li>
          If the provider cannot resume, the queue manager can bootstrap a new
          session with the transcript and tool-loop context attached, and can
          downgrade to a smaller model to keep the task moving.
        </li>
        <li>
          Loop until no more <code>&lt;agent_cmd&gt;</code> appear, a cycle is
          detected, or the iteration cap is reached.
        </li>
      </ol>

      <Callout variant="tip" title="Why structured tag passing">
        Treating tools as structured text (not a separate channel) lets any
        provider — one with or without native tool-call support — participate.
        Every tag is also recorded in the trace view so you can replay the
        exact sequence of prompts, commands, and results.
      </Callout>

      <h2 id="runtime-api">The runtime HTTP surface</h2>
      <p>
        The <code>/api/runtime/*</code> routes expose inspection and control.
        They are guarded by the same operator session as the control plane (or
        the <code>RUNTIME_LOCAL_UI_TOKEN</code> for the dashboard-to-runtime
        path).
      </p>
      <ul>
        <li>
          <code>GET /api/runtime/ready</code> — public readiness probe.
        </li>
        <li>
          <code>GET /api/runtime/agents</code>,{" "}
          <code>GET /api/runtime/agents/:id/overview</code> — catalogue and
          operational overview.
        </li>
        <li>
          <code>GET /api/runtime/agents/:id/tasks</code>,{" "}
          <code>GET /api/runtime/agents/:id/sessions</code>,{" "}
          <code>GET /api/runtime/agents/:id/schedules</code> — dashboard lists.
        </li>
        <li>
          <code>GET /api/runtime/agents/:id/tasks/:task_id/*</code> — task
          events, artifacts, checkpoints, terminals, browser state, workspace
          views, services, resources, loop state, and sessions.
        </li>
        <li>
          Runtime control actions include cancel, retry, recover, pause,
          resume, save, attach terminal/browser, pin, unpin, cleanup, and
          process termination.
        </li>
      </ul>

      <h2 id="operational-characteristics">Operational characteristics</h2>
      <ul>
        <li>
          <strong>Fail closed</strong> when required bootstrap infrastructure
          is unavailable — the runtime won't start tasks with a missing
          database, missing object store, or unvalidated secrets.
        </li>
        <li>
          <strong>Memory and retrieval are best-effort</strong> — time-bounded
          with explicit timeouts, never silently bypassing a hard security
          boundary when they fail.
        </li>
        <li>
          <strong>Health, doctor, and runtime dashboard routes</strong> are first-class
          — operators can always tell whether the runtime is healthy without
          SSH'ing into a container.
        </li>
        <li>
          <strong>Production-like topology in quickstart</strong> — the local
          install uses the same services, ports, and internal targets as a VPS
          deployment, so drift between environments stays minimal.
        </li>
      </ul>

      <h2 id="next">Go deeper</h2>
      <ul>
        <li>
          <Link href="/docs/concepts/memory">Memory &amp; knowledge</Link> — how
          recall and retrieval feed the runtime's context assembly step.
        </li>
        <li>
          <Link href="/docs/api-reference/runtime">Runtime API reference</Link>{" "}
          — every route, request, response, and status code.
        </li>
        <li>
          <Link href="/docs/operations/troubleshooting">Troubleshooting</Link>{" "}
          — common runtime failure modes and where to look first.
        </li>
      </ul>
    </>
  );
}
