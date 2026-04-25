import Link from "next/link";
import { Callout } from "./callout";
import { CodeBlock } from "./code-block";

export function OperationsTroubleshooting() {
  return (
    <>
      <p>
        When something goes wrong, the checks below are the order a typical
        operator would follow. Most issues are visible from three places:
        doctor, dashboard Operations view, and container logs.
      </p>

      <Callout variant="info" title="First line of defence">
        <p>
          Always run <code>koda doctor</code> first. It takes a few seconds,
          rules out bootstrap problems, and tells you whether the issue is
          local (env, storage, secrets) or downstream (provider, integration,
          runtime task).
        </p>
      </Callout>

      <h2 id="doctor-red">Doctor is red</h2>

      <h3 id="bootstrap">Bootstrap configuration failed</h3>
      <ul>
        <li>
          <strong>Missing session secret.</strong> Set{" "}
          <code>WEB_OPERATOR_SESSION_SECRET</code> to 32+ random bytes in{" "}
          <code>.env</code>. Restart the stack.
        </li>
        <li>
          <strong>Conflicting env profile.</strong>{" "}
          <code>KODA_ENV=production</code> with{" "}
          <code>CONTROL_PLANE_AUTH_MODE=development</code> or{" "}
          <code>ALLOW_LOOPBACK_BOOTSTRAP=true</code> is refused at boot. Fix
          the <code>.env</code> and restart.
        </li>
      </ul>

      <h3 id="storage">Storage connectivity failed</h3>
      <ul>
        <li>
          <strong>Postgres unreachable.</strong> Check{" "}
          <code>koda logs postgres</code> — look for disk-full or
          out-of-memory kills. Confirm{" "}
          <code>KNOWLEDGE_V2_POSTGRES_DSN</code> is correct.
        </li>
        <li>
          <strong>Object storage missing bucket.</strong>{" "}
          <code>seaweedfs-init</code> should create it on first boot. If it
          didn't, run <code>koda down &amp;&amp; koda up</code> to rerun the
          init container. If that fails, the compose logs show the AWS CLI's
          exact complaint.
        </li>
      </ul>

      <h3 id="dashboard-unreachable">Dashboard unreachable</h3>
      <ul>
        <li>
          <code>koda logs web</code> usually shows a build or runtime error
          at the top of recent output.
        </li>
        <li>
          Check the reverse proxy is forwarding <code>/</code> to{" "}
          <code>127.0.0.1:3000</code> and that the cert is valid.
        </li>
      </ul>

      <h2 id="auth-issues">Authentication issues</h2>

      <h3 id="cant-login">Can't log in</h3>
      <ul>
        <li>
          <strong>Account lockout.</strong> Five failed logins locks the
          account for 15 minutes by default. Wait or adjust{" "}
          <code>CONTROL_PLANE_OPERATOR_LOGIN_LOCKOUT_SECONDS</code>.
        </li>
        <li>
          <strong>Session cookie rejected.</strong> In production the cookie
          must be <code>Secure</code> and served over HTTPS. Check DevTools →
          Application → Cookies.
        </li>
        <li>
          <strong>Clock skew.</strong> If the host's clock is far off, JWT
          and session validation can fail. Run <code>timedatectl</code>.
        </li>
      </ul>

      <h3 id="forgot-password">Forgot password with no SMTP</h3>
      <p>Recovery codes are the recovery path when SMTP isn't configured.</p>
      <ol>
        <li>
          Navigate to <code>/forgot-password</code>.
        </li>
        <li>Enter the email and one of the recovery codes saved at registration.</li>
        <li>
          Set a new password. All remaining recovery codes are invalidated
          — regenerate a fresh set from Settings › Security.
        </li>
      </ol>

      <h3 id="lost-recovery-codes">Lost recovery codes</h3>
      <p>
        There is no self-service recovery without a code. Regenerating
        requires host access: stop the stack, run the bootstrap-code flow,
        re-register the owner. Treat this as a disaster-recovery procedure,
        not a routine one.
      </p>

      <h2 id="provider-issues">Provider issues</h2>

      <h3 id="verify-fails">Provider verification fails</h3>
      <ul>
        <li>
          Read the raw error surfaced in the dashboard — it comes straight
          from the provider. The usual suspects: rotated key, wrong scope,
          missing project/org, billing block.
        </li>
        <li>
          If the verify button stays greyed out, the control plane is
          rate-limiting repeated verification attempts. Wait a minute.
        </li>
      </ul>

      <h3 id="mid-task">Provider fails mid-task</h3>
      <p>
        The runtime attempts to resume on another provider if one is
        configured. If you see tasks failing without a fallback, configure
        at least one peer provider.
      </p>

      <h2 id="agent-issues">Agent issues</h2>

      <h3 id="no-response">Agent doesn't reply</h3>
      <ul>
        <li>
          <strong>Telegram allow list.</strong> Unapproved users are silently
          dropped; the audit feed shows{" "}
          <code>security.telegram.rejected</code>. Add the user ID / username
          in Settings → Telegram access.
        </li>
        <li>
          <strong>Draft agent.</strong> An unpublished agent won't accept
          tasks. Publish it from the dashboard.
        </li>
        <li>
          <strong>Provider credential missing.</strong> Agents inherit the
          provider default. If no default is set, creation was incomplete —
          walk the provider wizard again.
        </li>
      </ul>

      <h3 id="loop">Tool loop never terminates</h3>
      <p>
        The runtime caps iterations. If you see a task stuck, open the trace
        view — the tool dispatcher logs every iteration with a cycle-detection
        note. Usually the agent is repeating a failed command without updating
        its approach; fix the underlying failure (missing tool, blocked
        command, unreadable path) rather than the loop cap.
      </p>

      <h2 id="storage-issues">Storage issues</h2>

      <h3 id="postgres-full">Postgres disk full</h3>
      <ul>
        <li>
          Check which tables are largest: the{" "}
          <code>knowledge_*</code> and <code>retrieval_traces</code> tables
          grow with use.
        </li>
        <li>
          Lower <code>MEMORY_MAX_PER_USER</code> to make maintenance prune
          more aggressively; re-run the maintenance job.
        </li>
        <li>
          If you retain every retrieval trace, schedule a truncation after N
          days. Traces are inspection aids, not durable state.
        </li>
      </ul>

      <h3 id="s3-quota">Object storage over quota</h3>
      <ul>
        <li>
          Artifacts accumulate over time. Run an audit of{" "}
          <code>artifact_manifests</code> and drop ones older than your
          retention window.
        </li>
        <li>
          If you're on AWS S3, enable lifecycle rules on the Koda bucket.
        </li>
      </ul>

      <h2 id="upgrade">Upgrade went wrong</h2>
      <p>
        <code>koda update</code> auto-rolls-back if post-update doctor is
        red. If that didn't fire (rare — usually because an external
        dependency changed), roll back manually:
      </p>
      <CodeBlock
        language="bash"
        code={`koda down
# restore the previous .env from backup if you changed it
koda install --manifest ~/.koda/previous-release.yaml`}
      />

      <h2 id="getting-help">Getting help</h2>
      <ul>
        <li>
          <strong>GitHub Discussions</strong> — the <code>Discussions</code>{" "}
          tab on the main repo is the right place for questions.
        </li>
        <li>
          <strong>GitHub Issues</strong> — for reproducible bugs, with the
          output of <code>koda doctor --json</code> and relevant log snippets.
        </li>
        <li>
          <strong>Security reports</strong> — see <code>SECURITY.md</code>{" "}
          in the repo. Do not open public issues for vulnerabilities.
        </li>
      </ul>

      <h2 id="next">Next steps</h2>
      <ul>
        <li>
          <Link href="/docs/operations/monitoring">Monitoring</Link> — probes
          and checks that catch issues before they page you.
        </li>
        <li>
          <Link href="/docs/operations/security">Security</Link> — the full
          hardening and audit model.
        </li>
      </ul>
    </>
  );
}
