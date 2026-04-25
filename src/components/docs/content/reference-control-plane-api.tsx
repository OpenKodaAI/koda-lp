import Link from "next/link";
import { Callout } from "./callout";

export function ReferenceControlPlaneAPI() {
  return (
    <>
      <p>
        The control-plane API is served at <code>/api/control-plane/*</code>{" "}
        on port <code>8090</code>. It covers every operator-configurable
        surface — providers, agents, secrets, access, onboarding. The
        authoritative contract is <code>/openapi/control-plane.json</code>;
        this page indexes the routes by domain.
      </p>

      <Callout variant="info" title="Authentication at a glance">
        <p>
          All routes require either the operator session cookie{" "}
          (<code>koda_operator_session</code>), a bearer token from the{" "}
          <code>/auth/tokens</code> endpoint, or the break-glass{" "}
          <code>CONTROL_PLANE_API_TOKEN</code> when it's configured.
        </p>
      </Callout>

      <h2 id="auth">Authentication &amp; sessions</h2>
      <ul>
        <li><code>POST /auth/register-owner</code> — create the first owner account (first-run only).</li>
        <li><code>POST /auth/login</code> — start an operator session.</li>
        <li><code>POST /auth/logout</code> — end the current session.</li>
        <li><code>GET /auth/status</code> — current session + identity.</li>
        <li><code>GET /auth/sessions</code> — list every active session for the owner.</li>
        <li><code>DELETE /auth/sessions/:id</code> — revoke a session.</li>
        <li><code>POST /auth/tokens</code>, <code>DELETE /auth/tokens/:id</code> — manage long-lived API tokens.</li>
        <li><code>POST /auth/bootstrap/exchange</code> — redeem the short-lived setup code.</li>
        <li><code>POST /auth/password/change</code>, <code>POST /auth/password/recover</code> — password lifecycle.</li>
      </ul>

      <h2 id="agents">Agents</h2>
      <ul>
        <li><code>GET /agents</code>, <code>POST /agents</code> — list and create.</li>
        <li><code>GET /agents/:agent_id</code>, <code>PATCH /agents/:agent_id</code> — read and update.</li>
        <li><code>POST /agents/:agent_id/publish</code> — move from draft to published (runnable).</li>
        <li><code>POST /agents/:agent_id/activate</code> — toggle operational state without republishing.</li>
        <li><code>PUT /agents/:agent_id/secrets/:secret_key</code> — write an agent-scoped secret.</li>
        <li><code>DELETE /agents/:agent_id/secrets/:secret_key</code> — remove one.</li>
      </ul>

      <h2 id="providers">Providers</h2>
      <ul>
        <li><code>PUT /providers/:provider_id/connection/api-key</code> — save an API-key credential.</li>
        <li><code>PUT /providers/:provider_id/connection/local</code> — save a local-endpoint provider (Ollama).</li>
        <li><code>POST /providers/:provider_id/connection/verify</code> — round-trip verification.</li>
        <li><code>DELETE /providers/:provider_id/connection</code> — remove the stored credential.</li>
      </ul>

      <h2 id="connections">Connections &amp; integrations</h2>
      <ul>
        <li><code>GET /connections/catalog</code> — every supported provider and integration.</li>
        <li><code>PUT /connections/defaults/:connection_key</code> — set the system-default connection for an integration.</li>
        <li><code>POST /connections/defaults/:connection_key/verify</code> — verify the default round-trip.</li>
        <li><code>GET /integrations/:integration_id/health</code> — recent health snapshots.</li>
      </ul>

      <h2 id="system">System &amp; onboarding</h2>
      <ul>
        <li><code>GET /system-settings</code>, <code>PATCH /system-settings</code> — global toggles (allowed users, defaults, policy).</li>
        <li><code>GET /onboarding/status</code> — where the first-run flow currently is.</li>
        <li><code>POST /onboarding/bootstrap</code> — advance the bootstrap sequence.</li>
      </ul>

      <h2 id="skills">Skills</h2>
      <ul>
        <li><code>GET /skills</code> — every registered skill, the same catalogue the <code>/skill</code> command uses.</li>
        <li><code>GET /skills/:skill_id</code> — skill metadata, frontmatter, and body.</li>
      </ul>

      <h2 id="conventions">Conventions</h2>
      <ul>
        <li>
          <strong>Content type.</strong> Every write endpoint expects{" "}
          <code>application/json</code>. Reads return JSON.
        </li>
        <li>
          <strong>Idempotency.</strong> Creation endpoints accept an optional{" "}
          <code>Idempotency-Key</code> header. Retried requests with the same
          key return the original response.
        </li>
        <li>
          <strong>Pagination.</strong> List endpoints accept{" "}
          <code>limit</code> and <code>cursor</code> query parameters and
          return <code>next_cursor</code> in the response body when more
          pages exist.
        </li>
        <li>
          <strong>Errors.</strong> Non-2xx responses carry a structured error
          body: <code>code</code>, <code>message</code>, optional{" "}
          <code>details</code>. The code is a stable machine string —{" "}
          <code>auth.session_expired</code>,{" "}
          <code>provider.credential_invalid</code>,{" "}
          <code>agent.not_found</code>.
        </li>
        <li>
          <strong>Rate limiting.</strong> Auth-adjacent routes use stricter
          buckets than general operator routes. See{" "}
          <Link href="/docs/concepts/control-plane">Control plane</Link> for
          the specific budgets.
        </li>
      </ul>

      <h2 id="openapi">OpenAPI spec</h2>
      <p>
        <code>/openapi/control-plane.json</code> ships with the platform and
        is the authoritative contract. The dashboard, CLI, and any custom
        integration are all built against it. Import it into Postman or
        Bruno for exploratory work, or feed it to an OpenAPI generator to
        get a typed client in your language of choice.
      </p>

      <h2 id="next">Next steps</h2>
      <ul>
        <li>
          <Link href="/docs/api-reference/runtime">Runtime API</Link> — task
          submission, tracing, and status surfaces.
        </li>
        <li>
          <Link href="/docs/api-reference/environment">
            Environment variables
          </Link>{" "}
          — bootstrap-time toggles that change how these endpoints behave.
        </li>
      </ul>
    </>
  );
}
