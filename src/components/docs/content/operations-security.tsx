import Link from "next/link";
import { Callout } from "./callout";
import { CodeBlock } from "./code-block";

export function OperationsSecurity() {
  return (
    <>
      <p>
        Koda is shipped to run agents in production. Its security posture is
        built around three ideas: <strong>fail closed</strong> on required
        infrastructure, <strong>log everything</strong> that could matter
        later, and <strong>don't allow accidental downgrades</strong> from
        hardened defaults. This page summarises the controls in place.
      </p>

      <h2 id="authentication">Authentication</h2>
      <ul>
        <li>
          <strong>Single-user owner account</strong> created on first boot.
          No self-service registration beyond that.
        </li>
        <li>
          <strong>Password policy</strong> — 12+ characters, 3 of 4 character
          classes, no identifier substring, not in the top-500 common
          passwords list, Shannon entropy ≥ 2.0 bits/char.
        </li>
        <li>
          <strong>Sessions</strong> — 32-byte URL-safe random token, SHA-256
          hashed in storage. Default TTL 7 days. Transport is the encrypted{" "}
          <code>koda_operator_session</code> cookie with{" "}
          <code>HttpOnly; Secure; SameSite=Strict</code>.
        </li>
        <li>
          <strong>Recovery codes</strong> — ten Argon2-hashed single-use
          codes, shown once on registration. All remaining codes invalidate
          when any one is used.
        </li>
      </ul>

      <h2 id="session-revocation">Session revocation</h2>
      <ul>
        <li>
          <strong>Logout</strong> — revokes the current session.
        </li>
        <li>
          <strong>Password change</strong> — revokes every other session;
          keeps the initiating session active.
        </li>
        <li>
          <strong>Password reset via recovery code</strong> — revokes <em>all</em>{" "}
          sessions.
        </li>
      </ul>

      <h2 id="rate-limits">Rate limits and lockout</h2>
      <p>
        Per-IP buckets back every auth-adjacent route. Response latency is
        floored at ~300 ms on failure paths to blunt timing-based
        enumeration.
      </p>
      <ul>
        <li><code>POST /auth/login</code> — 5 req / 5 min / IP.</li>
        <li><code>POST /auth/password/recover</code> — 5 req / hour / IP.</li>
        <li><code>POST /auth/password/change</code> — 10 req / hour / user.</li>
        <li><code>POST /auth/register-owner</code> — 3 req / hour / IP.</li>
        <li>General operator bucket — 120 req / min (via <code>CONTROL_PLANE_RATE_LIMIT</code>).</li>
        <li>
          Account lockout — after <code>CONTROL_PLANE_OPERATOR_LOGIN_MAX_FAILURES</code>{" "}
          (default 5) the account locks for{" "}
          <code>CONTROL_PLANE_OPERATOR_LOGIN_LOCKOUT_SECONDS</code> (default 15 min).
        </li>
      </ul>

      <h2 id="production-refusals">Production refusals</h2>
      <p>
        Several combinations are refused at boot when{" "}
        <code>KODA_ENV=production</code>. Koda exits before accepting
        traffic.
      </p>
      <ul>
        <li><code>CONTROL_PLANE_AUTH_MODE=development</code> or <code>open</code>.</li>
        <li><code>ALLOW_LOOPBACK_BOOTSTRAP=true</code>.</li>
        <li><code>ALLOW_INSECURE_COOKIES=true</code>.</li>
        <li><code>ALLOW_INSECURE_WEB_OPERATOR_SESSION_SECRET=true</code>.</li>
      </ul>

      <Callout variant="warn" title="These exist for a reason">
        The development-mode flags make local work friction-free. They are
        not security theatre — the process <em>refuses</em> to start with
        them on in production. You cannot accidentally deploy a debug-friendly
        config.
      </Callout>

      <h2 id="csp">Content Security Policy</h2>
      <p>
        <code>/login</code>, <code>/setup</code>, and{" "}
        <code>/forgot-password</code> enforce a strict CSP with no{" "}
        <code>'unsafe-inline'</code> or <code>'unsafe-eval'</code>. Every
        script is served with a nonce. Patching{" "}
        <code>'unsafe-inline'</code> back in to work around a third-party
        script would break the hardening that keeps credential-entry pages
        resistant to XSS.
      </p>

      <h2 id="bootstrap">Bootstrap flow</h2>
      <ul>
        <li>
          <strong>Code generation.</strong> Short-lived bootstrap codes are
          written to <code>${"${STATE_ROOT_DIR}"}/control_plane/bootstrap.txt</code>{" "}
          with mode <code>0600</code>, printed once to the container log,
          and deleted after successful registration.
        </li>
        <li>
          <strong>Loopback trust.</strong> On development hosts with{" "}
          <code>ALLOW_LOOPBACK_BOOTSTRAP=true</code>, requests originating
          from <code>127.0.0.1</code> skip the code challenge. Refused in
          production.
        </li>
        <li>
          <strong>Regeneration.</strong> <code>koda auth issue-code</code>{" "}
          prints a new code without restarting the stack. Rate limited to
          prevent flooding.
        </li>
      </ul>

      <h2 id="secrets">Secrets at rest</h2>
      <p>
        Every secret (provider credentials, bot tokens, integration
        passwords, per-agent secrets) is encrypted before it touches Postgres
        using the master key pointed at by{" "}
        <code>CONTROL_PLANE_MASTER_KEY_FILE</code>. The key file itself sits
        outside the database, owned by the service user with mode{" "}
        <code>0600</code>, and is the single item you need to protect most
        carefully on the host.
      </p>

      <h2 id="runtime-validation">Runtime validation</h2>
      <p>
        The <code>security</code> gRPC service (<code>:50065</code>) validates
        every risky runtime operation before it executes:
      </p>
      <ul>
        <li>
          <strong>Shell commands</strong> — checked for injection patterns
          and blocked-command lists.
        </li>
        <li>
          <strong>Environment variables</strong> — sanitised to remove
          sensitive keys before handoff to child processes.
        </li>
        <li>
          <strong>Runtime paths</strong> — validated for traversal attempts
          and resolved to absolute paths.
        </li>
        <li>
          <strong>S3 object keys</strong> — validated against the bucket's
          permitted prefix.
        </li>
        <li>
          <strong>Log values</strong> — redacted before emission (credentials,
          tokens, long opaque strings).
        </li>
        <li>
          <strong>Filesystem policy</strong> — reads and writes are checked
          against the agent's declared filesystem scope.
        </li>
      </ul>

      <h2 id="audit">Audit trail</h2>
      <p>
        Every security-sensitive event writes a structured{" "}
        <code>security.*</code> record through the <code>emit_security()</code>{" "}
        helper. Events are queryable from the dashboard's Operations view and
        from <code>/api/control-plane/audit</code> (when audit export is
        enabled).
      </p>
      <p>Representative event names:</p>
      <ul>
        <li><code>security.auth.login_success</code> / <code>security.auth.login_failure</code></li>
        <li><code>security.auth.password_changed</code> / <code>security.auth.password_reset</code></li>
        <li><code>security.auth.recovery_code_used</code></li>
        <li><code>security.session.created</code> / <code>security.session.revoked</code></li>
        <li><code>security.telegram.rejected</code></li>
        <li><code>security.runtime.shell_blocked</code></li>
      </ul>

      <h2 id="checklist">Hardening checklist</h2>
      <ul>
        <li>
          <code>KODA_ENV=production</code>, <code>ALLOW_LOOPBACK_BOOTSTRAP=false</code>.
        </li>
        <li>
          HTTPS everywhere with <code>Secure</code>, <code>HttpOnly</code>,{" "}
          <code>SameSite=Strict</code> cookies.
        </li>
        <li>
          Reverse proxy fronting <code>127.0.0.1</code> bindings; Postgres
          and SeaweedFS never exposed publicly.
        </li>
        <li>
          <code>.env</code>, master key, and bootstrap files owned by the
          service user, mode <code>0600</code>.
        </li>
        <li>
          <code>WEB_OPERATOR_SESSION_SECRET</code> set to 32+ random bytes
          and rotated on a schedule.
        </li>
        <li>
          <code>CONTROL_PLANE_API_TOKEN</code> blank unless needed; rotate
          when set.
        </li>
        <li>Audit events exported to your SIEM of choice.</li>
      </ul>

      <Callout variant="danger" title="Reporting a vulnerability">
        <p>
          Find something concerning? The repo's <code>SECURITY.md</code> is
          the authoritative disclosure path. Do not file public issues for
          vulnerabilities.
        </p>
      </Callout>

      <h2 id="next">Next steps</h2>
      <ul>
        <li>
          <Link href="/docs/operations/monitoring">Monitoring</Link> — health
          probes and observability surfaces.
        </li>
        <li>
          <Link href="/docs/operations/troubleshooting">Troubleshooting</Link>{" "}
          — what to check first when something looks wrong.
        </li>
      </ul>
    </>
  );
}
