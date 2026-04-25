import Link from "next/link";
import { Callout } from "./callout";
import { CodeBlock } from "./code-block";

export function ConceptsControlPlane() {
  return (
    <>
      <p>
        The control plane is the <strong>configuration surface of Koda</strong>.
        It owns everything an operator tweaks — providers, agents, secrets,
        access policy, integrations — and exposes those concerns through a
        single authenticated HTTP API at port <code>8090</code>. The Next.js
        dashboard at port <code>3000</code> is a thin consumer of that API.
      </p>

      <h2 id="what-it-owns">What the control plane owns</h2>
      <p>
        Think of the control plane as the only layer that writes to product
        configuration. The runtime reads what the control plane publishes — it
        never reaches back in to modify agents or providers.
      </p>
      <ul>
        <li>
          <strong>Providers</strong> — connection records, verified credentials,
          default models, health checks.
        </li>
        <li>
          <strong>Agents</strong> — definitions (name, model defaults, prompt
          contracts), compiled prompts, publication state, per-agent secrets.
        </li>
        <li>
          <strong>Secrets</strong> — encrypted values bound to agents or to the
          platform itself, retrieved only inside the runtime process at
          execution time.
        </li>
        <li>
          <strong>Access policy</strong> — allowed operators, Telegram users,
          session handling.
        </li>
        <li>
          <strong>Integrations</strong> — connections catalogue, default wiring,
          per-agent grants, integration health.
        </li>
        <li>
          <strong>Onboarding</strong> — first-owner bootstrap, system settings,
          initial provider and agent wizards.
        </li>
      </ul>

      <h2 id="api-groups">API organisation</h2>
      <p>
        Every control-plane route sits under <code>/api/control-plane/*</code>.
        The authoritative contract is{" "}
        <code>docs/openapi/control-plane.json</code>; the groups below cover
        what operators and custom integrations interact with most.
      </p>

      <h3 id="authentication">Authentication &amp; sessions</h3>
      <ul>
        <li>
          <code>POST /auth/register-owner</code> — first-run owner creation.
        </li>
        <li>
          <code>POST /auth/login</code> / <code>POST /auth/logout</code> —
          operator session lifecycle.
        </li>
        <li>
          <code>GET /auth/status</code> — current session + operator identity.
        </li>
        <li>
          <code>GET /auth/sessions</code>, <code>DELETE /auth/sessions/:id</code>{" "}
          — list and revoke active sessions.
        </li>
        <li>
          <code>POST /auth/tokens</code>, <code>DELETE /auth/tokens/:id</code>{" "}
          — manage long-lived API tokens.
        </li>
        <li>
          <code>POST /auth/bootstrap/exchange</code> — redeem a short-lived
          setup code during first boot.
        </li>
      </ul>

      <h3 id="agents">Agents</h3>
      <ul>
        <li>
          <code>GET /agents</code>, <code>POST /agents</code> — list and create
          agents.
        </li>
        <li>
          <code>GET /agents/:agent_id</code>, <code>PATCH /agents/:agent_id</code>{" "}
          — read and update definition.
        </li>
        <li>
          <code>POST /agents/:agent_id/publish</code> — move an agent from draft
          to published (runnable).
        </li>
        <li>
          <code>POST /agents/:agent_id/activate</code> — toggle operational
          state without republishing.
        </li>
        <li>
          <code>PUT /agents/:agent_id/secrets/:secret_key</code> — write a
          secret scoped to this agent only.
        </li>
      </ul>

      <h3 id="providers-connections">Providers &amp; integrations</h3>
      <ul>
        <li>
          <code>GET /connections/catalog</code> — every supported integration
          and provider.
        </li>
        <li>
          <code>PUT /providers/:provider_id/connection/api-key</code> — wire an
          API-key-based provider.
        </li>
        <li>
          <code>POST /providers/:provider_id/connection/verify</code> — verify
          the saved credential before accepting it.
        </li>
        <li>
          <code>PUT /connections/defaults/:connection_key</code> —
          system-default connection for an integration.
        </li>
        <li>
          <code>GET /integrations/:integration_id/health</code> — recent health
          snapshots used by the dashboard.
        </li>
      </ul>

      <h3 id="system">System &amp; onboarding</h3>
      <ul>
        <li>
          <code>GET /system-settings</code>, <code>PATCH /system-settings</code>{" "}
          — global toggles (allowed users, policy defaults).
        </li>
        <li>
          <code>GET /onboarding/status</code> — where the first-run flow is.
        </li>
        <li>
          <code>POST /onboarding/bootstrap</code> — advance the bootstrap
          sequence.
        </li>
      </ul>

      <h2 id="authentication-model">Authentication model</h2>
      <p>
        The control plane is <strong>single-user authenticated</strong> — one
        owner account, created on first boot. Password policy, session
        handling, and rate limiting are enforced before any business logic
        runs.
      </p>

      <h3 id="password-policy">Password policy</h3>
      <ul>
        <li>Minimum 12 characters.</li>
        <li>
          Three of four character classes (upper, lower, digit, symbol).
        </li>
        <li>Cannot contain the username or email.</li>
        <li>Not in the top-500 most common passwords list.</li>
        <li>Minimum Shannon entropy of 2.0 bits per character.</li>
      </ul>

      <h3 id="sessions">Sessions</h3>
      <ul>
        <li>32-byte URL-safe random tokens, hashed SHA-256 before storage.</li>
        <li>
          Default TTL of 7 days (override with{" "}
          <code>CONTROL_PLANE_OPERATOR_SESSION_TTL_SECONDS</code>).
        </li>
        <li>
          Transport cookie <code>koda_operator_session</code>, encrypted with
          AES-256-GCM, flagged <code>HttpOnly; Secure; SameSite=Strict</code>.
        </li>
        <li>
          Password change revokes every other session but keeps the initiating
          one; password reset via a recovery code revokes all sessions for the
          user.
        </li>
      </ul>

      <h3 id="recovery-codes">Recovery codes</h3>
      <ul>
        <li>
          Ten single-use codes, shown once on registration. Format:{" "}
          <code>xxxx-xxxx-xxxx</code> with an unambiguous alphabet (no{" "}
          <code>I</code>, <code>O</code>, <code>0</code>, <code>1</code>).
        </li>
        <li>Hashed with Argon2 before storage.</li>
        <li>
          Once <strong>any</strong> code is used, all remaining codes are
          invalidated — mirroring GitHub's and Google's policies.
        </li>
      </ul>

      <h3 id="rate-limits">Rate limits</h3>
      <p>
        Per-IP buckets back every auth-adjacent route. Responses are
        deliberately slowed to a ~300 ms floor to reduce timing-based
        enumeration.
      </p>
      <ul>
        <li>
          <code>POST /auth/login</code>: 5 requests / 5 minutes.
        </li>
        <li>
          <code>POST /auth/password/recover</code>: 5 requests / hour.
        </li>
        <li>
          <code>POST /auth/password/change</code>: 10 requests / hour.
        </li>
        <li>
          <code>POST /auth/register-owner</code>: 3 requests / hour.
        </li>
        <li>
          General operator bucket: 120 requests / minute.
        </li>
        <li>
          Account lockout: after{" "}
          <code>CONTROL_PLANE_OPERATOR_LOGIN_MAX_FAILURES</code>, the account
          locks for{" "}
          <code>CONTROL_PLANE_OPERATOR_LOGIN_LOCKOUT_SECONDS</code>.
        </li>
      </ul>

      <Callout variant="warn" title="Development escape hatches">
        <p>
          <code>ALLOW_LOOPBACK_BOOTSTRAP=true</code>,{" "}
          <code>CONTROL_PLANE_AUTH_MODE=development|open</code>, and{" "}
          <code>ALLOW_INSECURE_COOKIES</code> all exist to make local
          development friction-free, and they're all refused at boot when{" "}
          <code>KODA_ENV=production</code>.
        </p>
      </Callout>

      <h2 id="break-glass">Break-glass token</h2>
      <p>
        <code>CONTROL_PLANE_API_TOKEN</code> is an optional, long-lived token
        that lets CLI tooling talk to the control plane without an operator
        session. By default it is empty: you only set it when you need
        machine-to-machine access and you rotate it deliberately.
      </p>

      <CodeBlock
        language="bash"
        code={`curl -H "Authorization: Bearer $CONTROL_PLANE_API_TOKEN" \\\n  http://127.0.0.1:8090/api/control-plane/system-settings`}
      />

      <h2 id="audit">Audit trail</h2>
      <p>
        Every auth event writes a structured <code>security.*</code> record
        through the <code>emit_security()</code> helper. Logins, failed
        attempts, password changes, recovery-code usage, and session
        revocations all end up in the audit table and are inspectable from the
        dashboard's Operations view.
      </p>

      <h2 id="dashboard">Relationship to the dashboard</h2>
      <p>
        <code>apps/web</code> is a Next.js server rendering a consumer of the
        control-plane API. It seals the operator session token via{" "}
        <code>lib/web-operator-session.ts</code>, enforces security headers and
        CSP through <code>middleware.ts</code>, and renders the same data the
        OpenAPI contract describes. There is no private dashboard API — every
        surface is backed by a route documented in{" "}
        <code>docs/openapi/control-plane.json</code>.
      </p>

      <h2 id="next">Go deeper</h2>
      <ul>
        <li>
          <Link href="/docs/concepts/runtime">Runtime</Link> — what the control
          plane hands off to, and how tasks actually execute.
        </li>
        <li>
          <Link href="/docs/operations/security">Security</Link> — the
          end-to-end hardening story including CSP, cookie flags, and audit.
        </li>
        <li>
          <Link href="/docs/api-reference/control-plane">
            Control-plane API reference
          </Link>{" "}
          — every route, request, and response from the OpenAPI spec.
        </li>
      </ul>
    </>
  );
}
