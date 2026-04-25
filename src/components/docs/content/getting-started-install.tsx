import Link from "next/link";
import { Callout } from "./callout";
import { CodeBlock } from "./code-block";
import { Step, StepList } from "./step-list";

export function GettingStartedInstall() {
  return (
    <>
      <p>
        Koda is Docker-first. A single command brings up the full stack — web
        dashboard, control plane, Postgres, object storage, and the runtime
        services that supervise agent execution. The npm CLI handles staging,
        bootstrap, and diagnostics so you can move from zero to a dashboard setup
        page in minutes.
      </p>

      <h2 id="prerequisites">Prerequisites</h2>
      <p>
        Koda targets Linux and macOS hosts with Docker. Windows users should run
        through WSL 2.
      </p>
      <ul>
        <li>
          <strong>Docker</strong> and <strong>Docker Compose</strong> installed
          and running.
        </li>
        <li>
          <strong>Node.js 20</strong> or later (required by the{" "}
          <code>@openkodaai/koda</code> CLI).
        </li>
        <li>
          Free ports <code>3000</code> (dashboard) and <code>8090</code> (control
          plane).
        </li>
      </ul>

      <Callout variant="tip" title="Checking Docker">
        <p>
          If you don't already have a container runtime, Docker Desktop on
          macOS/Windows or Docker Engine on Linux both work. Confirm with{" "}
          <code>docker version</code> before running the installer.
        </p>
      </Callout>

      <h2 id="install-with-the-cli">Install with the CLI</h2>
      <p>
        The fastest path is through npm. Two forms both produce the same result:
        you can install the CLI globally, or run it once through <code>npx</code>.
      </p>

      <CodeBlock
        language="bash"
        code="npx @openkodaai/koda@latest install"
      />

      <p>Or install globally once and reuse the binary:</p>

      <CodeBlock
        language="bash"
        code={"npm install -g @openkodaai/koda\nkoda install"}
      />

      <h2 id="what-the-installer-does">What the installer does</h2>
      <p>
        <code>koda install</code> is idempotent and safe to re-run. On the first
        run it:
      </p>
      <StepList>
        <Step title="Verifies prerequisites">
          Checks Docker, Docker Compose, and Node versions. Fails fast with a
          specific error if anything is missing.
        </Step>
        <Step title="Stages the release bundle">
          Downloads and unpacks the pinned product release into an installation
          directory (defaults to <code>~/.koda</code>; override with{" "}
          <code>--dir</code>).
        </Step>
        <Step title="Creates a minimal .env">
          If one does not exist, writes defaults for Postgres, object storage,
          session secrets, and control-plane authentication.
        </Step>
        <Step title="Starts the compose stack">
          Brings up <code>web</code>, <code>app</code>, <code>postgres</code>,{" "}
          <code>seaweedfs</code> (plus internal runtime services) through the
          release compose file.
        </Step>
        <Step title="Runs doctor checks">
          Verifies bootstrap configuration, storage connectivity, secret
          hygiene, dashboard reachability, and control-plane reachability.
        </Step>
        <Step title="Prints the dashboard URL and setup code">
          You'll see a localhost URL and a short-lived code used in the
          first-owner flow.
        </Step>
      </StepList>

      <h2 id="services-that-start">Services that start</h2>
      <p>
        After a successful install the compose stack exposes four public-facing
        surfaces plus internal runtime services:
      </p>

      <div className="not-prose my-6 overflow-x-auto rounded-[12px] border border-white/[0.06]">
        <table className="w-full text-[13.5px] border-collapse">
          <thead>
            <tr className="bg-white/[0.03]">
              <th className="text-left font-semibold text-[var(--dark-text-primary)] px-4 py-2.5 border-b border-white/[0.06]">
                Service
              </th>
              <th className="text-left font-semibold text-[var(--dark-text-primary)] px-4 py-2.5 border-b border-white/[0.06]">
                Port
              </th>
              <th className="text-left font-semibold text-[var(--dark-text-primary)] px-4 py-2.5 border-b border-white/[0.06]">
                Purpose
              </th>
            </tr>
          </thead>
          <tbody className="text-[var(--dark-text-secondary)]">
            <tr className="border-b border-white/[0.04]">
              <td className="px-4 py-2 font-mono text-[12.5px] text-[var(--dark-text-primary)]">
                web
              </td>
              <td className="px-4 py-2 font-mono">3000</td>
              <td className="px-4 py-2">Next.js operator dashboard</td>
            </tr>
            <tr className="border-b border-white/[0.04]">
              <td className="px-4 py-2 font-mono text-[12.5px] text-[var(--dark-text-primary)]">
                app
              </td>
              <td className="px-4 py-2 font-mono">8090</td>
              <td className="px-4 py-2">
                Control-plane + runtime HTTP API (<code>/health</code>,{" "}
                <code>/setup</code>, <code>/api/control-plane/*</code>,{" "}
                <code>/api/runtime/*</code>)
              </td>
            </tr>
            <tr className="border-b border-white/[0.04]">
              <td className="px-4 py-2 font-mono text-[12.5px] text-[var(--dark-text-primary)]">
                postgres
              </td>
              <td className="px-4 py-2 font-mono">5432</td>
              <td className="px-4 py-2">Durable state (internal to compose)</td>
            </tr>
            <tr>
              <td className="px-4 py-2 font-mono text-[12.5px] text-[var(--dark-text-primary)]">
                seaweedfs
              </td>
              <td className="px-4 py-2 font-mono">8333</td>
              <td className="px-4 py-2">
                S3-compatible object storage (internal to compose)
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <p>
        Internal gRPC services for security, memory, artifact, retrieval, and
        runtime kernel are also started but aren't exposed outside the compose
        network.
      </p>

      <h2 id="first-run-flow">First-run flow</h2>
      <p>
        Once the installer finishes it prints a dashboard URL. Open it in a
        browser on the same machine and complete setup in six steps:
      </p>

      <StepList>
        <Step title="Open /control-plane/setup">
          The installer prints this URL. On loopback (<code>127.0.0.1</code>) the
          development default <code>ALLOW_LOOPBACK_BOOTSTRAP=true</code> lets you
          skip the setup code. On a remote host you'll be prompted for it.
        </Step>
        <Step title="Paste the setup code if prompted">
          If you need a new one, run <code>koda auth issue-code</code> to print
          another short-lived code.
        </Step>
        <Step title="Create the owner account">
          Email, password (minimum 12 characters across 3 of 4 character classes),
          and a username auto-derived from the email local-part (you can rename
          later in Settings).
        </Step>
        <Step title="Save the recovery codes">
          Ten single-use codes will be shown once and never again. Copy them into
          a password manager or secret store — they're how you recover access
          without SMTP configured.
        </Step>
        <Step title="Sign in to open an operator session">
          The dashboard opens an HTTP-only cookie session. From here the rest of
          setup happens in the UI — provider credentials, access policy, and
          optional first-agent wizards.
        </Step>
        <Step title="Optional: connect a provider and create a first agent">
          The home dashboard surfaces a checklist for the three opt-in setup
          steps. None of them block normal operation — you can explore first and
          configure later.
        </Step>
      </StepList>

      <Callout variant="warn" title="Recovery codes">
        Recovery codes are only displayed once. If you lose them before
        configuring SMTP, a password reset will require a new bootstrap — store
        them somewhere you'll remember.
      </Callout>

      <h2 id="diagnostics">Diagnostics</h2>
      <p>
        If something feels off after install, the doctor command walks through
        the same checks the installer ran:
      </p>

      <CodeBlock language="bash" code="koda doctor" />

      <p>
        Add <code>--json</code> for machine-readable output, or point at a custom
        installation directory with <code>--dir</code>.
      </p>

      <h2 id="lifecycle">Lifecycle commands</h2>
      <p>A handful of commands cover day-to-day operation:</p>
      <ul>
        <li>
          <code>koda up</code> — start a stopped installation.
        </li>
        <li>
          <code>koda down</code> — stop the stack (state volumes persist).
        </li>
        <li>
          <code>koda logs [service]</code> — tail logs from one or all services.
        </li>
        <li>
          <code>koda update</code> — pull the latest release, restart, and
          auto-rollback if the doctor check fails.
        </li>
        <li>
          <code>koda uninstall [--purge]</code> — remove the installation;{" "}
          <code>--purge</code> also drops state volumes.
        </li>
        <li>
          <code>koda version</code> — print the currently installed release.
        </li>
      </ul>

      <h2 id="where-next">Where next</h2>
      <ul>
        <li>
          <Link href="/docs/getting-started/quickstart">Quickstart</Link> — walk
          through the full path from install to first agent.
        </li>
        <li>
          <Link href="/docs/deployment/vps">VPS deployment</Link> — hardening,
          reverse proxy, HTTPS, and production checklist.
        </li>
        <li>
          <Link href="/docs/operations/troubleshooting">Troubleshooting</Link> —
          if doctor is red, start here.
        </li>
      </ul>
    </>
  );
}
