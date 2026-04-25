import Link from "next/link";
import { Callout } from "./callout";

type Var = { name: string; default?: string; desc: string };

function VarTable({ rows }: { rows: Var[] }) {
  return (
    <div className="not-prose my-4 overflow-x-auto rounded-[12px] border border-white/[0.06]">
      <table className="w-full text-[13px] border-collapse">
        <thead>
          <tr className="bg-white/[0.03]">
            <th className="text-left font-semibold text-[var(--dark-text-primary)] px-4 py-2 border-b border-white/[0.06]">
              Variable
            </th>
            <th className="text-left font-semibold text-[var(--dark-text-primary)] px-4 py-2 border-b border-white/[0.06]">
              Default
            </th>
            <th className="text-left font-semibold text-[var(--dark-text-primary)] px-4 py-2 border-b border-white/[0.06]">
              Purpose
            </th>
          </tr>
        </thead>
        <tbody className="text-[var(--dark-text-secondary)]">
          {rows.map((row) => (
            <tr key={row.name} className="border-b border-white/[0.04] last:border-b-0">
              <td className="px-4 py-2 font-mono text-[12px] text-[var(--dark-text-primary)] whitespace-nowrap">
                {row.name}
              </td>
              <td className="px-4 py-2 font-mono text-[12px] text-[var(--dark-text-tertiary)] whitespace-nowrap">
                {row.default ?? "—"}
              </td>
              <td className="px-4 py-2">{row.desc}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function ReferenceEnvironment() {
  return (
    <>
      <p>
        Environment variables control bootstrap-time concerns: how the
        control plane and runtime bind, where state lives, how auth is
        enforced, and which storage backends the stack talks to. Product
        configuration (providers, agents, secrets) lives behind the control
        plane and is <em>not</em> set here.
      </p>

      <Callout variant="info" title="Where to set them">
        <p>
          Set values in the <code>.env</code> file at the install directory
          root. The installer writes safe defaults on first boot. On VPS
          deployments, make sure the file is owned by the service user with
          permissions <code>0600</code>.
        </p>
      </Callout>

      <h2 id="environment">Environment profile</h2>
      <VarTable
        rows={[
          {
            name: "KODA_ENV",
            default: "development",
            desc: "Set to production to refuse development auth modes and loopback-bootstrap at boot.",
          },
          {
            name: "ALLOW_LOOPBACK_BOOTSTRAP",
            default: "true (dev)",
            desc: "Allow 127.0.0.1 to skip the setup code during first-owner registration. Must be false in production.",
          },
        ]}
      />

      <h2 id="control-plane">Control plane</h2>
      <VarTable
        rows={[
          { name: "CONTROL_PLANE_ENABLED", default: "true", desc: "Master toggle for the control-plane HTTP service." },
          { name: "CONTROL_PLANE_BIND", default: "127.0.0.1", desc: "Address the control plane binds to." },
          { name: "CONTROL_PLANE_PORT", default: "8090", desc: "Port the control plane listens on." },
          { name: "CONTROL_PLANE_AUTH_MODE", default: "token", desc: "Auth mode. Use token in production. development and open are refused when KODA_ENV=production." },
          { name: "CONTROL_PLANE_API_TOKEN", default: "—", desc: "Optional break-glass token for CLI access. Leave blank unless needed." },
          { name: "CONTROL_PLANE_MASTER_KEY_FILE", default: "—", desc: "Path to a file containing the master encryption key used for secret storage." },
          { name: "CONTROL_PLANE_RATE_LIMIT", default: "120/min", desc: "General operator request bucket." },
          { name: "CONTROL_PLANE_OPERATOR_LOGIN_MAX_FAILURES", default: "5", desc: "Failed logins before account lockout." },
          { name: "CONTROL_PLANE_OPERATOR_LOGIN_LOCKOUT_SECONDS", default: "900", desc: "Seconds an account stays locked after hitting the failure cap." },
          { name: "CONTROL_PLANE_OPERATOR_PASSWORD_MIN_LENGTH", default: "12", desc: "Minimum password length. You can only override upward." },
          { name: "CONTROL_PLANE_OPERATOR_SESSION_TTL_SECONDS", default: "604800", desc: "Operator session lifetime in seconds (7 days)." },
        ]}
      />

      <h2 id="web">Web dashboard</h2>
      <VarTable
        rows={[
          { name: "WEB_PORT", default: "3000", desc: "Port the Next.js dashboard listens on." },
          { name: "WEB_OPERATOR_SESSION_SECRET", default: "—", desc: "Required in production. 32+ random bytes used to seal the operator session cookie." },
          { name: "ALLOW_INSECURE_WEB_OPERATOR_SESSION_SECRET", default: "false", desc: "Development-only escape hatch. Refused in production." },
          { name: "ALLOW_INSECURE_COOKIES", default: "false", desc: "Development-only. Lets cookies skip the Secure flag." },
          { name: "RUNTIME_LOCAL_UI_TOKEN", default: "—", desc: "Token the dashboard presents to the runtime when the two are on different origins." },
        ]}
      />

      <h2 id="state">State &amp; storage roots</h2>
      <VarTable
        rows={[
          { name: "STATE_BACKEND", default: "postgres", desc: "Durable state backend. Postgres is the supported default." },
          { name: "STATE_ROOT_DIR", default: "/var/lib/koda/state", desc: "Root directory for container-local state (bootstrap files, caches)." },
          { name: "RUNTIME_EPHEMERAL_ROOT", default: "/var/lib/koda/runtime", desc: "Runtime scratch root. Cleaned up between tasks." },
          { name: "ARTIFACT_STORE_DIR", default: "/var/lib/koda/artifacts", desc: "Local fallback artifact directory (ignored when S3 is available)." },
          { name: "OBJECT_STORAGE_REQUIRED", default: "true", desc: "Refuse to start if object storage is unavailable." },
        ]}
      />

      <h2 id="postgres">Postgres</h2>
      <VarTable
        rows={[
          { name: "KNOWLEDGE_V2_POSTGRES_DSN", default: "—", desc: "Full Postgres DSN for knowledge, memory, runtime, and audit schemas." },
          { name: "KNOWLEDGE_V2_POSTGRES_SCHEMA", default: "knowledge_v2", desc: "Schema prefix. Override when sharing a cluster with other workloads." },
        ]}
      />

      <h2 id="s3">Object storage (S3-compatible)</h2>
      <VarTable
        rows={[
          { name: "KNOWLEDGE_V2_STORAGE_MODE", default: "primary", desc: "primary uses object storage as the source of truth; secondary mirrors from Postgres." },
          { name: "KNOWLEDGE_V2_S3_BUCKET", default: "koda-objects", desc: "Bucket name." },
          { name: "KNOWLEDGE_V2_S3_PREFIX", default: "koda", desc: "Object key prefix." },
          { name: "KNOWLEDGE_V2_S3_ENDPOINT_URL", default: "http://seaweedfs:8333", desc: "S3 endpoint. Point at AWS, MinIO, R2, or the bundled SeaweedFS." },
          { name: "KNOWLEDGE_V2_S3_REGION", default: "us-east-1", desc: "Region hint. Most S3-compatible backends ignore this; AWS requires it." },
          { name: "KNOWLEDGE_V2_S3_ACCESS_KEY_ID", default: "—", desc: "Access key for the configured endpoint." },
          { name: "KNOWLEDGE_V2_S3_SECRET_ACCESS_KEY", default: "—", desc: "Secret for the configured endpoint." },
        ]}
      />

      <h2 id="memory">Memory</h2>
      <VarTable
        rows={[
          { name: "MEMORY_ENABLED", default: "true", desc: "Global memory enablement." },
          { name: "MEMORY_EMBEDDING_MODEL", default: "paraphrase-multilingual-MiniLM-L12-v2", desc: "Sentence-transformer model used for memory embeddings." },
          { name: "MEMORY_MAX_RECALL", default: "25", desc: "Maximum memories returned per recall." },
          { name: "MEMORY_RECALL_THRESHOLD", default: "0.25", desc: "Minimum similarity for a memory to be recalled." },
          { name: "MEMORY_RECALL_TIMEOUT", default: "3.0", desc: "Seconds the recall step is allowed to take before it's dropped (best-effort)." },
          { name: "MEMORY_MAX_CONTEXT_TOKENS", default: "3500", desc: "Token budget for the recall-assembled context." },
          { name: "MEMORY_RECENCY_HALF_LIFE_DAYS", default: "120", desc: "Decay rate for time-based ranking." },
          { name: "MEMORY_MAX_PER_USER", default: "2000", desc: "Retention cap before maintenance prunes least-important records." },
          { name: "MEMORY_SIMILARITY_DEDUP_THRESHOLD", default: "0.92", desc: "Cosine threshold for deduplication during extraction." },
          { name: "MEMORY_EXTRACTION_PROVIDER", default: "claude", desc: "Provider used for post-query memory extraction." },
          { name: "MEMORY_EXTRACTION_MODEL", default: "claude-sonnet-4-6", desc: "Model used for extraction." },
          { name: "MEMORY_MAINTENANCE_ENABLED", default: "true", desc: "Run background maintenance (retention, embedding repair)." },
          { name: "MEMORY_DIGEST_ENABLED", default: "true", desc: "Run the daily digest job." },
        ]}
      />

      <h2 id="knowledge">Knowledge</h2>
      <VarTable
        rows={[
          { name: "KNOWLEDGE_ENABLED", default: "true", desc: "Global retrieval enablement." },
          { name: "KNOWLEDGE_MAX_RESULTS", default: "6", desc: "Ranked hits returned per query." },
          { name: "KNOWLEDGE_RECALL_THRESHOLD", default: "0.35", desc: "Minimum similarity for a chunk to be returned." },
          { name: "KNOWLEDGE_CONTEXT_MAX_TOKENS", default: "2200", desc: "Token budget for the retrieval-assembled context." },
          { name: "KNOWLEDGE_RECALL_TIMEOUT", default: "2.0", desc: "Seconds the retrieval step is allowed to take (best-effort)." },
          { name: "KNOWLEDGE_V2_ENABLED", default: "true", desc: "Toggle for the modern retrieval pipeline." },
          { name: "KNOWLEDGE_V2_MAX_GRAPH_HOPS", default: "3", desc: "Entity-graph traversal depth during retrieval." },
        ]}
      />

      <h2 id="skills-env">Skills</h2>
      <VarTable
        rows={[
          { name: "SKILLS_DIR", default: "koda/skills", desc: "Directory the skill registry scans. Changed files are picked up automatically." },
        ]}
      />

      <h2 id="browser">Browser automation</h2>
      <VarTable
        rows={[
          { name: "BROWSER_ALLOW_PRIVATE_NETWORK", default: "false", desc: "Allow runtime browser sessions to reach internal/loopback destinations. Keep disabled unless explicitly needed." },
        ]}
      />

      <h2 id="next">Next steps</h2>
      <ul>
        <li>
          <Link href="/docs/deployment/vps">VPS deployment</Link> — the
          production checklist that pins the critical values above.
        </li>
        <li>
          <Link href="/docs/operations/security">Security</Link> — the full
          story around auth, sessions, cookies, and audit.
        </li>
      </ul>
    </>
  );
}
