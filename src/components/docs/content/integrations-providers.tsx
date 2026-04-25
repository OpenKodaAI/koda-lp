import Link from "next/link";
import { Callout } from "./callout";
import { CodeBlock } from "./code-block";
import { Step, StepList } from "./step-list";

export function IntegrationsProviders() {
  return (
    <>
      <p>
        Providers are the model backends Koda invokes during task execution.
        Four are supported out of the box: Anthropic (Claude), OpenAI (GPT /
        Codex), Google (Gemini), and Ollama (local / self-hosted). Each is
        configured and verified through the control plane — credentials
        never live in per-agent <code>.env</code> files.
      </p>

      <h2 id="connection-lifecycle">Connection lifecycle</h2>
      <p>
        Every provider goes through the same three-stage lifecycle. The
        dashboard reflects state at each stage; the API mirrors it.
      </p>

      <StepList>
        <Step title="Configure">
          Paste credentials (API key, optional base URL, optional org/project
          identifiers) through the provider wizard in the dashboard, or{" "}
          <code>PUT /api/control-plane/providers/:provider_id/connection/api-key</code>.
          The control plane encrypts the credential at rest before it touches
          the database.
        </Step>
        <Step title="Verify">
          Koda calls the provider's authenticated endpoint and surfaces the
          raw error on failure. A wrong scope reads differently from a
          revoked key from a billing block. You'll never save a credential
          that can't round-trip.
        </Step>
        <Step title="Set defaults">
          Once verified, pick a default model for the provider. Agents can
          override this per role, but the provider needs a default so agent
          creation can complete without extra guessing.
        </Step>
      </StepList>

      <h2 id="supported-providers">Supported providers</h2>

      <div className="not-prose my-6 overflow-x-auto rounded-[12px] border border-white/[0.06]">
        <table className="w-full text-[13.5px] border-collapse">
          <thead>
            <tr className="bg-white/[0.03]">
              <th className="text-left font-semibold text-[var(--dark-text-primary)] px-4 py-2.5 border-b border-white/[0.06]">
                Provider
              </th>
              <th className="text-left font-semibold text-[var(--dark-text-primary)] px-4 py-2.5 border-b border-white/[0.06]">
                Auth
              </th>
              <th className="text-left font-semibold text-[var(--dark-text-primary)] px-4 py-2.5 border-b border-white/[0.06]">
                Good for
              </th>
            </tr>
          </thead>
          <tbody className="text-[var(--dark-text-secondary)]">
            {[
              ["Anthropic", "API key", "Long-context reasoning, tool loops, default for planning and long-form generation."],
              ["OpenAI", "API key (+ optional org, project)", "Codex workflows, cost-sensitive tiers, strong code generation."],
              ["Google", "API key", "Multi-modal tasks, large context windows."],
              ["Ollama", "Local endpoint URL", "Self-hosted or on-prem models. No API key."],
            ].map(([provider, auth, good]) => (
              <tr key={provider} className="border-b border-white/[0.04] last:border-b-0">
                <td className="px-4 py-2 font-mono text-[12.5px] text-[var(--dark-text-primary)]">
                  {provider}
                </td>
                <td className="px-4 py-2">{auth}</td>
                <td className="px-4 py-2">{good}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 id="api-surface">API surface</h2>
      <p>The provider endpoints share a consistent shape:</p>
      <ul>
        <li>
          <code>GET /api/control-plane/connections/catalog</code> — list every
          supported provider and integration.
        </li>
        <li>
          <code>PUT /api/control-plane/providers/:provider_id/connection/api-key</code>{" "}
          — save an API-key-based credential.
        </li>
        <li>
          <code>PUT /api/control-plane/providers/:provider_id/connection/local</code>{" "}
          — save a local-endpoint provider (Ollama).
        </li>
        <li>
          <code>POST /api/control-plane/providers/:provider_id/connection/verify</code>{" "}
          — round-trip the credential against the provider's API.
        </li>
      </ul>

      <CodeBlock
        language="bash"
        code={`curl -X PUT https://koda.example.com/api/control-plane/providers/anthropic/connection/api-key \\
  -H "Cookie: koda_operator_session=..." \\
  -H "Content-Type: application/json" \\
  -d '{"api_key": "sk-ant-..."}'`}
      />

      <h2 id="fallback">Fallback and resume</h2>
      <p>
        When a provider is unavailable or returns an error, the runtime can
        degrade to a smaller model or fall over to a peer provider. The tool
        loop is resumed on the new provider with the transcript and
        tool-loop context attached — so an agent that started on{" "}
        <code>claude-opus</code> can finish on <code>claude-sonnet</code>{" "}
        (or another provider entirely) without losing the work.
      </p>

      <Callout variant="tip" title="Configure multiple providers">
        Fallback only works if multiple providers are configured. Connecting
        at least two — ideally from different vendors — gives the runtime
        somewhere to go when the first one has a bad hour.
      </Callout>

      <h2 id="per-agent-override">Per-agent model override</h2>
      <p>
        Agents can override the provider default. A common pattern: use a
        fast / cheap model for triage steps, then escalate to a larger model
        for the final draft. Overrides live on the agent definition, so
        they're versioned and audited along with the rest of the agent
        config.
      </p>

      <h2 id="health">Integration health</h2>
      <p>
        Connection status is inspectable through{" "}
        <code>GET /api/control-plane/integrations/:integration_id/health</code>.
        The dashboard surfaces recent health snapshots in the Operations view;
        if verification starts failing after a key rotation, you'll see it
        there before an agent fails mid-task.
      </p>

      <h2 id="next">Next steps</h2>
      <ul>
        <li>
          <Link href="/docs/integrations/telegram">Telegram</Link> — wire up
          the messenger interface and control who can reach it.
        </li>
        <li>
          <Link href="/docs/api-reference/environment">Environment variables</Link>{" "}
          — bootstrap values that control provider behaviour.
        </li>
      </ul>
    </>
  );
}
