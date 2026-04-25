import Link from "next/link";
import { Callout } from "./callout";
import { CodeBlock } from "./code-block";

export function DeploymentVPS() {
  return (
    <>
      <p>
        The single-node VPS deployment path is the supported production
        configuration. It uses the same compose topology as the local install
        and layers hardened defaults, a reverse proxy, TLS, and a production
        checklist on top.
      </p>

      <h2 id="target">Target environment</h2>
      <ul>
        <li>Linux host with Docker and Docker Compose.</li>
        <li>
          A reverse proxy you control (Caddy, nginx, Traefik) or a managed
          tunnel (Tailscale, Cloudflare).
        </li>
        <li>
          A persistent filesystem for Docker volumes — Postgres and SeaweedFS
          keep durable data there.
        </li>
        <li>Enough resources for the stack: 2 CPU / 4 GB RAM is a comfortable floor.</li>
      </ul>

      <h2 id="install">Install</h2>
      <p>
        The same CLI handles VPS installs. <code>--headless</code> suppresses
        the browser launch the interactive path uses.
      </p>
      <CodeBlock
        language="bash"
        code={"npm install -g @openkodaai/koda\nkoda install --headless"}
      />

      <h2 id="bindings">Localhost bindings</h2>
      <p>
        The production compose overlay (<code>docker-compose.prod.yml</code>)
        binds <code>web</code> to <code>127.0.0.1:${"{WEB_PORT:-3000}"}</code>{" "}
        and <code>app</code> to <code>127.0.0.1:${"{CONTROL_PLANE_PORT:-8090}"}</code>.
        Nothing faces the public internet directly — a reverse proxy
        terminates TLS and fronts both services.
      </p>

      <h2 id="reverse-proxy">Reverse proxy model</h2>
      <p>
        The reverse proxy is responsible for TLS, hostname routing, and (if
        you use one) client-certificate auth. Koda only needs it to publish
        five paths:
      </p>
      <ul>
        <li>
          <code>/</code> → <code>127.0.0.1:3000</code> — Koda web dashboard.
        </li>
        <li>
          <code>/control-plane/</code> → <code>127.0.0.1:3000</code> —
          operator surface (same Next.js origin).
        </li>
        <li>
          <code>/api/control-plane/*</code> →{" "}
          <code>127.0.0.1:8090</code> — HTTP control-plane API.
        </li>
        <li>
          <code>/api/runtime/*</code> → <code>127.0.0.1:8090</code> — runtime
          API.
        </li>
        <li>
          <code>/openapi/control-plane.json</code> →{" "}
          <code>127.0.0.1:8090</code> — OpenAPI contract.
        </li>
      </ul>
      <p>
        <code>/setup</code> can be published if you want a compatibility
        redirect into the dashboard's first-run flow; otherwise it's
        optional.
      </p>

      <Callout variant="tip" title="Caddy as a one-liner">
        Caddy ships opinionated defaults that cover TLS (via Let's Encrypt)
        and security headers out of the box. A two-line <code>Caddyfile</code>{" "}
        is usually enough:
        <CodeBlock
          language="text"
          code={`koda.example.com {
  reverse_proxy 127.0.0.1:3000
  reverse_proxy /api/* 127.0.0.1:8090
}`}
        />
      </Callout>

      <h2 id="production-checklist">Production checklist</h2>
      <p>
        The ten items below are the production-readiness baseline. Koda
        refuses to boot in production when the first two are wrong.
      </p>
      <ol>
        <li>
          <strong><code>KODA_ENV=production</code></strong> — blocks{" "}
          <code>CONTROL_PLANE_AUTH_MODE=development</code>,{" "}
          <code>CONTROL_PLANE_AUTH_MODE=open</code>, and{" "}
          <code>ALLOW_LOOPBACK_BOOTSTRAP=true</code> at boot. If any of those
          slip through, the process exits before serving traffic.
        </li>
        <li>
          <strong><code>ALLOW_LOOPBACK_BOOTSTRAP=false</code></strong> — the
          first-owner flow now requires the short-lived bootstrap code.
        </li>
        <li>
          <strong>Bootstrap code via SSH.</strong> The code is written to{" "}
          <code>${"{STATE_ROOT_DIR}"}/control_plane/bootstrap.txt</code> with
          mode <code>0600</code>, printed once to the container log, and
          deleted after successful registration.
        </li>
        <li>
          <strong>HTTPS everywhere.</strong> The operator session cookie{" "}
          <code>koda_operator_session</code> ships with <code>Secure</code>,{" "}
          <code>HttpOnly</code>, and <code>SameSite=Strict</code>. Without
          HTTPS the browser will refuse to send it.
        </li>
        <li>
          <strong>Strict CSP on auth screens.</strong> <code>/login</code>,{" "}
          <code>/setup</code>, and <code>/forgot-password</code> enforce a
          strict Content-Security-Policy. Don't patch in{" "}
          <code>{"'unsafe-inline'"}</code> to work around third-party
          scripts.
        </li>
        <li>
          <strong>Password policy.</strong> 12+ chars, 3 of 4 classes,
          top-500 blacklist, substring-of-identifier rejection. You can only
          override upward via{" "}
          <code>CONTROL_PLANE_OPERATOR_PASSWORD_MIN_LENGTH</code>.
        </li>
        <li>
          <strong>Recovery codes are single-use.</strong> Using any code
          invalidates all remaining ones; generate new codes from Settings ›
          Security after a password reset.
        </li>
        <li>
          <strong>Account lockout + rate limits.</strong> 5 failed logins per
          5 minutes per IP, 5 password resets per hour per IP, 3
          regenerations per hour per user, responses floored at ~300 ms.
        </li>
        <li>
          <strong>Audit every auth event.</strong> Logins, failures, password
          changes, recovery-code uses, session revocations — every one emits
          a <code>security.*</code> structured event via{" "}
          <code>emit_security()</code>.
        </li>
        <li>
          <strong><code>CONTROL_PLANE_API_TOKEN</code></strong> — leave blank
          unless you specifically need a break-glass CLI credential. Rotate
          when you set it.
        </li>
      </ol>

      <Callout variant="warn" title="Production refuses development modes">
        Setting <code>KODA_ENV=production</code> with{" "}
        <code>CONTROL_PLANE_AUTH_MODE=development</code> or{" "}
        <code>open</code> is a configuration error and the process refuses to
        start. Same with <code>ALLOW_LOOPBACK_BOOTSTRAP=true</code>. This is
        intentional — it makes it impossible to ship a debug-friendly config
        to production by accident.
      </Callout>

      <h2 id="hardening">Hardening baseline</h2>
      <p>
        Beyond the checklist, five habits keep a deployment healthy over
        time.
      </p>
      <ul>
        <li>
          <strong>Keep the control plane on localhost unless it's fronted by
          a proxy.</strong> <code>127.0.0.1</code> bindings are the default
          for a reason.
        </li>
        <li>
          <strong>Store secrets with restrictive permissions.</strong> The{" "}
          <code>.env</code> and bootstrap files should be owned by the service
          user with <code>0600</code>-ish modes. They contain session
          secrets and DSN strings.
        </li>
        <li>
          <strong>Never expose Postgres or SeaweedFS publicly.</strong> The
          compose network already keeps them internal — just don't punch
          holes through the firewall.
        </li>
        <li>
          <strong>Use managed TLS at the proxy layer.</strong> Let the proxy
          do cert rotation and protocol negotiation.
        </li>
        <li>
          <strong>Set and rotate{" "}
          <code>WEB_OPERATOR_SESSION_SECRET</code>.</strong> Stable across
          restarts, rotated on a schedule you control.
        </li>
      </ul>

      <h2 id="verify">Verify the install</h2>
      <p>After a VPS install, run the doctor against the same URLs:</p>
      <CodeBlock
        language="bash"
        code={`python3 scripts/doctor.py \\
  --env-file .env \\
  --base-url http://127.0.0.1:8090 \\
  --dashboard-url http://127.0.0.1:3000`}
      />
      <p>
        On an all-clean run, check the dashboard from the public URL and
        confirm the session cookie is marked <code>Secure</code> in DevTools.
      </p>

      <h2 id="systemd">Running under systemd</h2>
      <p>
        A systemd unit template ships at <code>koda.service.example</code>.
        Copy it, point it at your install directory, and enable it so the
        stack comes up after reboots.
      </p>

      <h2 id="upgrades">Upgrades</h2>
      <p>
        Upgrades are CLI-driven. The doctor runs after the new version starts;
        if it's red, the CLI rolls back automatically.
      </p>
      <CodeBlock
        language="bash"
        code="npx @openkodaai/koda@latest update"
      />
      <p>
        Or, if you installed globally:
      </p>
      <CodeBlock
        language="bash"
        code="koda update"
      />

      <h2 id="next">Next steps</h2>
      <ul>
        <li>
          <Link href="/docs/integrations/reverse-proxy">Reverse proxy</Link>{" "}
          — detailed configs for Caddy, nginx, and Tailscale.
        </li>
        <li>
          <Link href="/docs/operations/security">Security</Link> — the end-to-end
          hardening story and audit event taxonomy.
        </li>
        <li>
          <Link href="/docs/operations/monitoring">Monitoring</Link> — health
          checks, uptime probes, and where logs go.
        </li>
      </ul>
    </>
  );
}
