import Link from "next/link";
import { Callout } from "./callout";
import { CodeBlock } from "./code-block";

export function DeploymentLocal() {
  return (
    <>
      <p>
        The local install is the fastest way to evaluate Koda or work on it.
        It brings up the same compose topology a production install uses —
        dashboard, control plane, runtime services, Postgres, and object
        storage — on your laptop.
      </p>

      <Callout variant="info" title="Same topology as production">
        The local quickstart and the single-node VPS path use the exact same
        compose file and services. Only environment variables change. What you
        test locally is what ships.
      </Callout>

      <h2 id="prerequisites">Prerequisites</h2>
      <ul>
        <li>Docker and Docker Compose installed and running.</li>
        <li>Node.js 20 or later (required by the npm CLI).</li>
        <li>
          Free ports <code>3000</code> (dashboard) and <code>8090</code>{" "}
          (control plane) on the host.
        </li>
        <li>~2 GB of RAM available for the compose stack.</li>
      </ul>

      <h2 id="install">Install</h2>
      <p>The CLI is the recommended path. Two equivalent forms:</p>

      <CodeBlock
        language="bash"
        code="npx @openkodaai/koda@latest install"
      />

      <CodeBlock
        language="bash"
        code={"npm install -g @openkodaai/koda\nkoda install"}
      />

      <h3 id="from-source">From source (contributors)</h3>
      <p>If you cloned the repo, the wrapper script is equivalent:</p>
      <CodeBlock
        language="bash"
        code={"git clone https://github.com/OpenKodaAI/koda.git /opt/koda\ncd /opt/koda\n./scripts/install.sh"}
      />
      <p>
        The wrapper automates Docker and Node installation only on apt-based
        Linux hosts with <code>sudo</code>. On macOS or other environments,
        install those prerequisites yourself and use the npm CLI.
      </p>

      <h2 id="what-starts">What the installer starts</h2>
      <p>
        Five services come up via compose. Four are public-facing, one is a
        one-shot bootstrap helper.
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
            {[
              ["web", "3000", "Next.js operator dashboard"],
              ["app", "8090", "Control plane + runtime HTTP API"],
              ["postgres", "5432 (compose-internal)", "Durable state (+ pgvector)"],
              ["seaweedfs", "8333 (compose-internal)", "S3-compatible object storage"],
              ["seaweedfs-init", "—", "Creates the default bucket on first boot"],
            ].map(([svc, port, purpose]) => (
              <tr key={svc} className="border-b border-white/[0.04] last:border-b-0">
                <td className="px-4 py-2 font-mono text-[12.5px] text-[var(--dark-text-primary)]">
                  {svc}
                </td>
                <td className="px-4 py-2 font-mono">{port}</td>
                <td className="px-4 py-2">{purpose}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p>
        Five internal gRPC services (<code>runtime-kernel:50061</code>,{" "}
        <code>retrieval:50062</code>, <code>memory:50063</code>,{" "}
        <code>artifact:50064</code>, <code>security:50065</code>) also come up
        on the <code>backend</code> network but never leave the compose
        boundary.
      </p>

      <h2 id="default-env">Defaults that matter locally</h2>
      <p>
        The installer writes a minimal <code>.env</code>. On a development
        host two defaults deserve attention:
      </p>
      <ul>
        <li>
          <strong><code>ALLOW_LOOPBACK_BOOTSTRAP=true</code></strong> — lets
          you finish first-owner setup at <code>127.0.0.1</code> without a
          setup code. Always <code>false</code> in production.
        </li>
        <li>
          <strong><code>CONTROL_PLANE_AUTH_MODE=token</code></strong> —
          defaults to token mode. The escape hatches{" "}
          <code>development</code> and <code>open</code> exist for local
          debugging only and are refused at boot when <code>KODA_ENV=production</code>.
        </li>
        <li>
          <strong><code>CONTROL_PLANE_API_TOKEN</code></strong> — left blank
          by default. Only set it when you need machine-to-machine CLI
          access.
        </li>
      </ul>

      <h2 id="first-boot">First-boot flow</h2>
      <p>The installer prints a URL when it's done. Complete setup there:</p>
      <ol>
        <li>
          Open <code>http://127.0.0.1:3000/control-plane/setup</code>.
        </li>
        <li>
          On loopback, the setup code is optional; the form lets you proceed
          directly. On a remote host, paste the code from the installer
          output.
        </li>
        <li>
          Create the owner account: email, password (12+ chars, 3 of 4
          character classes), auto-derived username.
        </li>
        <li>
          Save the ten recovery codes — shown once, never again.
        </li>
        <li>
          Sign in. From there, the setup checklist offers optional steps
          (connect a provider, create an agent, connect Telegram). None block
          normal operation.
        </li>
      </ol>

      <h2 id="manual">Manual startup (without the installer)</h2>
      <p>
        If you want tighter control — or you're already inside a cloned repo:
      </p>
      <CodeBlock
        language="bash"
        code={`cp .env.example .env
docker compose up -d --build
python3 scripts/doctor.py --env-file .env --base-url http://127.0.0.1:8090 --dashboard-url http://127.0.0.1:3000`}
      />

      <h2 id="doctor">Doctor diagnostics</h2>
      <p>
        <code>koda doctor</code> runs the same checks the installer runs after
        startup. Use it any time the stack feels off.
      </p>
      <CodeBlock
        language="bash"
        code="koda doctor --json"
      />
      <p>
        The doctor validates bootstrap configuration, storage connectivity,
        secret hygiene, dashboard reachability, and control-plane
        reachability. <code>--json</code> gives machine-readable output for
        CI.
      </p>

      <Callout variant="tip" title="When doctor disagrees with the dashboard">
        The dashboard reflects runtime state, the doctor reflects bootstrap
        state. If doctor is clean but the dashboard shows degraded status,
        the issue is usually a provider credential, not the install.
      </Callout>

      <h2 id="lifecycle">Lifecycle</h2>
      <ul>
        <li>
          <code>koda up</code> / <code>koda down</code> — start and stop the
          stack. State volumes persist.
        </li>
        <li>
          <code>koda logs [service...]</code> — tail logs. No service name
          tails everything.
        </li>
        <li>
          <code>koda update</code> — pull the latest release, restart, run
          doctor, auto-rollback on failure.
        </li>
        <li>
          <code>koda uninstall --purge</code> — remove the install and drop
          state volumes.
        </li>
      </ul>

      <h2 id="next">Next steps</h2>
      <ul>
        <li>
          <Link href="/docs/deployment/vps">VPS deployment</Link> — hardened,
          TLS-fronted, production-ready.
        </li>
        <li>
          <Link href="/docs/operations/troubleshooting">Troubleshooting</Link>{" "}
          — the right page if doctor is red.
        </li>
      </ul>
    </>
  );
}
