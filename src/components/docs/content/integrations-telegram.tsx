import Link from "next/link";
import { Callout } from "./callout";
import { Step, StepList } from "./step-list";

export function IntegrationsTelegram() {
  return (
    <>
      <p>
        Telegram is the first messenger interface Koda ships with. It pairs
        cleanly with the runtime — users DM an agent bot, the handler
        normalises the message into a runtime request, the task executes,
        and the reply streams back in the same chat.
      </p>

      <h2 id="what-you-get">What you get</h2>
      <ul>
        <li>
          A one-to-one chat interface per agent. Users DM the bot; the bot
          replies.
        </li>
        <li>
          <strong>Allowed-user policy</strong> enforced at the handler layer —
          unapproved users are silently dropped before any runtime work
          starts.
        </li>
        <li>
          <strong>Full runtime trace</strong> for every Telegram message. The
          dashboard shows the same transcript an operator sees, plus the tool
          calls and memory writes underneath.
        </li>
        <li>
          The <code>/skill</code> command works natively in Telegram — same
          names, same auto-selection rules, same token budgets.
        </li>
      </ul>

      <h2 id="setup">Setting up a Telegram agent</h2>

      <StepList>
        <Step title="Create a bot with BotFather">
          Open Telegram, find <code>@BotFather</code>, and run{" "}
          <code>/newbot</code>. Pick a display name, pick a username ending in{" "}
          <code>bot</code>, and copy the token BotFather hands back. Koda
          never sees your BotFather account — only the token.
        </Step>
        <Step title="Open the Telegram wizard in the dashboard">
          On the home dashboard the setup checklist offers a{" "}
          <strong>Connect Telegram</strong> step. The drawer that opens asks
          for the bot token and the agent you want to bind it to.
        </Step>
        <Step title="Paste the bot token">
          Koda verifies the token against Telegram's getMe endpoint before
          saving it. A bad token fails here, not at message-delivery time.
        </Step>
        <Step title="Pick the agent">
          One agent per bot. Multiple agents can coexist — each bot binds to
          exactly one — but the first setup is one bot, one agent.
        </Step>
        <Step title="Decide who can reach it">
          Add allowed Telegram user IDs or usernames. Unlisted users get no
          response. The dashboard shows a live feed of rejected attempts so
          you can spot misconfiguration.
        </Step>
      </StepList>

      <h2 id="access-policy">Access policy</h2>
      <p>
        Telegram access is controlled at the handler layer through the
        system-settings allow list. The runtime never sees messages from
        users who aren't on it.
      </p>
      <ul>
        <li>
          <strong>By ID</strong> — stable across username changes. This is
          what Koda actually stores.
        </li>
        <li>
          <strong>By username</strong> — convenient to enter, resolved to an
          ID on first contact and then ignored. A username change doesn't
          silently lose access.
        </li>
      </ul>

      <Callout variant="warn" title="Rejected attempts are logged">
        Every rejected message writes a <code>security.telegram.rejected</code>{" "}
        audit event. If the audit feed fills up with a single attacker's ID,
        block them at the BotFather level — removing access to the bot
        itself — rather than leaving Koda to filter indefinitely.
      </Callout>

      <h2 id="message-flow">Message flow</h2>
      <ol>
        <li>User sends a DM to the bot.</li>
        <li>
          The Telegram handler receives it, normalises the message into the
          canonical runtime request shape, and enforces the allow-list check.
        </li>
        <li>
          The queue manager picks up the request, assembles context (memory
          recall, knowledge retrieval), and dispatches to the bound agent.
        </li>
        <li>
          Provider execution and the tool loop run exactly like any other
          runtime task. Streaming responses are edited into a single Telegram
          message in place.
        </li>
        <li>
          The final reply is sent. The transcript — with every tool call,
          memory hit, and retrieval result — is visible in the dashboard's
          runtime view.
        </li>
      </ol>

      <h2 id="commands">Commands in chat</h2>
      <ul>
        <li>
          <code>/skill</code> — list available skills.
        </li>
        <li>
          <code>/skill &lt;name&gt; [question]</code> — invoke a specific
          skill explicitly.
        </li>
        <li>
          Any other message — routed through the normal queue and picks up
          skills automatically if triggers match.
        </li>
      </ul>

      <h2 id="where-creds-live">Where credentials live</h2>
      <p>
        The bot token is stored as a secret in Postgres, encrypted at rest
        using the same master key as the rest of the control plane. It's
        never echoed back through the API — once saved, the dashboard shows
        only a fingerprint. Rotate by re-running the Telegram wizard with a
        new token; the old one is overwritten atomically.
      </p>

      <h2 id="troubleshooting">Common issues</h2>
      <ul>
        <li>
          <strong>Bot replies nothing.</strong> Check the allow list first —
          a rejected message produces no user-facing feedback by design.
        </li>
        <li>
          <strong>Bot token keeps failing verification.</strong> BotFather
          tokens can be regenerated; an old token stops working immediately.
        </li>
        <li>
          <strong>Message doesn't match a skill.</strong> Expected. The
          selector falls through to the agent's default prompt contract —
          look at the runtime trace to see which skill, if any, was scored.
        </li>
      </ul>

      <h2 id="next">Next steps</h2>
      <ul>
        <li>
          <Link href="/docs/concepts/runtime">Runtime</Link> — the execution
          lifecycle that runs under every Telegram message.
        </li>
        <li>
          <Link href="/docs/operations/security">Security</Link> — the
          allow-list, audit events, and rate-limit posture.
        </li>
      </ul>
    </>
  );
}
