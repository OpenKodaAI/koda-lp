import Link from "next/link";
import { Callout } from "./callout";
import { CodeBlock } from "./code-block";
import { Kbd } from "./kbd";
import { Step, StepList } from "./step-list";

export function GettingStartedQuickstart() {
  return (
    <>
      <p>
        This walkthrough takes you from a machine with Docker and Node installed
        to a Koda instance running your first agent. If something fails mid-way,
        each step lists what to check.
      </p>

      <Callout variant="info" title="Before you start">
        Read the <Link href="/docs/getting-started/install">prerequisites</Link>{" "}
        first. You'll need Docker running, Node 20+, and ports <code>3000</code>{" "}
        and <code>8090</code> free on the host.
      </Callout>

      <h2 id="one-command-install">One-command install</h2>
      <p>Run the CLI. The installer handles the rest:</p>

      <CodeBlock
        language="bash"
        code="npx @openkodaai/koda@latest install"
      />

      <p>Expected output, trimmed for clarity:</p>

      <CodeBlock
        language="text"
        code={`✓ Prerequisites verified (docker 24.x, node 20.x)
✓ Release bundle staged at ~/.koda
✓ .env created with safe defaults
✓ Compose stack started (web, app, postgres, seaweedfs)
✓ Doctor: all checks passed

Dashboard:  http://127.0.0.1:3000/control-plane/setup
Setup code: 7F-JQ2-P84`}
      />

      <p>
        If doctor reports a failure, stop here and see{" "}
        <Link href="/docs/operations/troubleshooting">Troubleshooting</Link>{" "}
        before proceeding — the dashboard won't be reliable until the bootstrap
        is clean.
      </p>

      <h2 id="first-owner-setup">First-owner setup</h2>

      <StepList>
        <Step title="Open the dashboard setup URL">
          Navigate to{" "}
          <code>http://127.0.0.1:3000/control-plane/setup</code>. On loopback the
          setup code is optional by default. If the browser prompts for it, paste
          the one printed by the installer.
        </Step>
        <Step title="Create an owner account">
          Pick an email and a password with at least 12 characters spanning three
          of four character classes (upper, lower, digit, symbol). The form
          previews requirements as you type.
        </Step>
        <Step title="Save the recovery codes">
          Ten single-use codes appear once and never again. Put them in a
          password manager or secret store. They are how you recover access if
          SMTP is not configured.
        </Step>
        <Step title="Sign in">
          After registering, the dashboard opens an HTTP-only operator session
          cookie and lands you on the home view with a setup checklist.
        </Step>
      </StepList>

      <h2 id="connect-a-provider">Connect a provider</h2>
      <p>
        An agent can't do useful work without a model. The home dashboard exposes
        a <strong>Connect an AI provider</strong> step on the setup checklist.
        Open it and pick any supported provider — Anthropic, OpenAI, Google, or
        Ollama (for local/self-hosted models).
      </p>

      <StepList>
        <Step title="Open the provider wizard">
          From the dashboard home, click <strong>Connect an AI provider</strong>{" "}
          on the checklist card. Each provider has its own short form (API key,
          optional base URL, optional project/org identifiers).
        </Step>
        <Step title="Paste credentials and verify">
          Koda verifies the key before saving. Failed verification surfaces the
          provider's raw error so you can tell a revoked key from a network
          issue.
        </Step>
        <Step title="Pick a default model">
          Once verified, set a default model for the provider. Agents can
          override this per role later, but a default is required so bot creation
          can complete.
        </Step>
      </StepList>

      <Callout variant="tip" title="Why verify up front">
        Koda treats provider credentials as operational state, not prompt
        parameters. Verifying at save time surfaces the usual causes of runtime
        failures (wrong scope, rotated key, billing block) before an agent ever
        tries to run.
      </Callout>

      <h2 id="create-the-first-agent">Create the first agent</h2>

      <StepList>
        <Step title="Open the agent wizard">
          Click <strong>Create your first agent</strong> on the setup checklist,
          or go to <strong>Control plane → Agents → New</strong>.
        </Step>
        <Step title="Name the agent and pick a model">
          Every agent has a human name (used in the dashboard and any messaging
          integration) and a model. The model defaults to your provider's default
          but can be overridden — for example, a cheaper model for triage and a
          larger one for final drafts.
        </Step>
        <Step title="Attach Skills and memory scope (optional for now)">
          You can wire Skills and a memory scope here, or start with a plain
          system prompt and add those later. Both are described in detail in the{" "}
          <Link href="/docs/skills/authoring-a-skill">Skills</Link> and{" "}
          <Link href="/docs/concepts/memory">Memory & knowledge</Link> sections.
        </Step>
        <Step title="Publish">
          Publishing moves the agent from draft to runnable. Koda creates the
          runtime records, registers the OpenAPI endpoints, and surfaces the
          agent in the runtime catalogue.
        </Step>
      </StepList>

      <h2 id="run-your-first-task">Run your first task</h2>
      <p>There are two equivalent entry points:</p>
      <ul>
        <li>
          <strong>From the dashboard.</strong> Open the agent and start a new
          session from the chat view. The transcript is recorded as a runtime
          task with full inspection.
        </li>
        <li>
          <strong>From the runtime API.</strong> Use{" "}
          <code>/api/runtime/tasks</code> (see the{" "}
          <Link href="/docs/api-reference/runtime">Runtime API</Link>) with the
          operator session cookie or a runtime token.
        </li>
      </ul>

      <p>
        The dashboard is the fastest feedback loop for the first run — you'll see
        the agent's tool calls, provider responses, memory writes, and the final
        output appear in real time.
      </p>

      <h2 id="verify-the-install">Verify the install</h2>
      <p>Three checks that are worth running before you trust the stack:</p>
      <ul>
        <li>
          <strong>Doctor is clean.</strong> <code>koda doctor</code> returns no
          warnings or errors.
        </li>
        <li>
          <strong>Health surface responds.</strong>{" "}
          <code>curl http://127.0.0.1:8090/health</code> returns a JSON payload
          with all components marked healthy.
        </li>
        <li>
          <strong>First run succeeded end-to-end.</strong> A task is visible in
          the dashboard with a complete trace — no broken tool calls, no missing
          memory writes.
        </li>
      </ul>

      <h2 id="keyboard-shortcuts">Keyboard shortcuts you'll use</h2>
      <ul>
        <li>
          <Kbd>⌘</Kbd> <Kbd>K</Kbd> — open search anywhere in these docs.
        </li>
        <li>
          <Kbd>Esc</Kbd> — close any dialog or drawer.
        </li>
      </ul>

      <h2 id="where-next">Where next</h2>
      <ul>
        <li>
          <Link href="/docs/concepts/architecture">Architecture</Link> — the
          mental model behind everything you just did.
        </li>
        <li>
          <Link href="/docs/skills/authoring-a-skill">Authoring a Skill</Link> —
          turn your best prompt patterns into first-class abilities.
        </li>
        <li>
          <Link href="/docs/deployment/vps">VPS deployment</Link> — move from
          localhost to a hardened, TLS-fronted install.
        </li>
      </ul>
    </>
  );
}
