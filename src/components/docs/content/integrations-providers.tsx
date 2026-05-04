import Link from "next/link";
import { Callout } from "./callout";
import { CodeBlock } from "./code-block";
import { Step, StepList } from "./step-list";

export function IntegrationsProviders() {
  return (
    <>
      <p>
        Providers are the model backends Koda invokes during task execution.
        The current control plane has managed verification for Anthropic
        (Claude), OpenAI, Google (Gemini), Ollama, ElevenLabs, Perplexity,
        Mistral, Qwen, Kimi, Groq, DeepSeek, and xAI. Each connection is
        configured and verified through the control plane — credentials never
        live in per-agent <code>.env</code> files.
      </p>

      <h2 id="connection-lifecycle">Connection lifecycle</h2>
      <p>
        Every provider goes through the same three-stage lifecycle. The
        dashboard reflects state at each stage; the API mirrors it.
      </p>

      <StepList>
        <Step title="Configure">
          Paste credentials (API key, login session, local endpoint URL,
          optional base URL, or optional org/project identifiers depending on
          the provider) through the provider wizard in the dashboard, or{" "}
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
          Once verified, pick a default model where the provider requires one.
          Agents can override model choices per role, but defaults make agent
          creation predictable.
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
              ["Anthropic", "API key or Claude login flow", "Claude model access and long-running agent work."],
              ["OpenAI", "API key (+ optional org, project)", "OpenAI model access and Codex-oriented workflows."],
              ["Google", "API key", "Gemini model access through Google's API."],
              ["Ollama", "Local endpoint or API key", "Local/self-hosted models and Ollama cloud-style access."],
              ["ElevenLabs", "API key", "Voice model and voice-list verification."],
              ["Perplexity", "API key + base URL", "OpenAI-compatible model API backed by Perplexity."],
              ["Mistral", "API key + base URL", "OpenAI-compatible model API backed by Mistral AI."],
              ["Qwen", "API key + base URL", "OpenAI-compatible model API backed by Alibaba Qwen."],
              ["Kimi", "API key + base URL", "OpenAI-compatible model API backed by Moonshot AI."],
              ["Groq", "API key + base URL", "OpenAI-compatible model API backed by Groq."],
              ["DeepSeek", "API key + base URL", "OpenAI-compatible model API backed by DeepSeek."],
              ["xAI", "API key + base URL", "OpenAI-compatible model API backed by xAI."],
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
          <code>POST /api/control-plane/providers/:provider_id/connection/login/start</code>{" "}
          — start supported provider login flows.
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
        Koda records provider health and makes provider choice part of the
        agent configuration. Runtime fallback depends on the agent's configured
        model policy and available verified providers; do not assume fallback
        exists until a second usable provider is connected and allowed for that
        agent.
      </p>

      <Callout variant="tip" title="Configure multiple providers">
        Connecting at least two providers — ideally from different vendors —
        gives operators a practical recovery path when one provider is down,
        rate-limited, or missing a model needed by an agent.
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
