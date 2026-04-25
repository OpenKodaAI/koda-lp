import Link from "next/link";
import { Callout } from "./callout";
import { MemoryMapDiagram } from "./memory-map-diagram";

export function ConceptsMemory() {
  return (
    <>
      <p>
        Agents don't have long-term recall by default — the providers forget
        the moment the response ends. Koda's memory and knowledge layers keep
        that forgetting from mattering. Memory extracts what's worth
        remembering from conversations; knowledge retrieves what the operator
        has already approved as grounding context. Both feed into the runtime's
        context-assembly step on every task.
      </p>

      <h2 id="the-memory-map">The memory map</h2>
      <p>
        This is a snapshot of what a populated memory store looks like: typed
        nodes, semantic edges, and clusters that emerge from how agents actually
        interact with the system. Hover a node to trace the connected path.
      </p>

      <MemoryMapDiagram />

      <h2 id="memory-lifecycle">Memory lifecycle</h2>
      <p>
        Memory is intentionally simple at the edges and nuanced in the middle.
        Two points of contact with the runtime, one background pipeline.
      </p>
      <ol>
        <li>
          <strong>Recall (pre-query).</strong> Before the main provider runs,
          the queue manager asks the memory manager for context. Recall is
          bounded by <code>MEMORY_RECALL_TIMEOUT</code> (default 3.0 seconds)
          and is non-fatal: if it times out, the task proceeds with whatever
          landed in time.
        </li>
        <li>
          <strong>Extraction (post-query).</strong> Once the provider has
          finished, an extraction provider/model reads the query and the
          response, emits candidate memories with confidence scores, and the
          memory manager persists the ones that pass the quality gate.
        </li>
        <li>
          <strong>Background pipelines.</strong> Digest, maintenance, embedding
          repair, deduplication, and clustering jobs run independently of the
          main interaction path. A user-facing task never waits on them.
        </li>
      </ol>

      <h2 id="memory-types">Memory types</h2>
      <p>
        Every memory is typed. The type drives the default TTL, the recall
        ranking bonus, and how the curation UI groups it. All types share the
        same schema; only the semantics change.
      </p>

      <div className="not-prose my-6 overflow-x-auto rounded-[12px] border border-white/[0.06]">
        <table className="w-full text-[13.5px] border-collapse">
          <thead>
            <tr className="bg-white/[0.03]">
              <th className="text-left font-semibold text-[var(--dark-text-primary)] px-4 py-2.5 border-b border-white/[0.06]">
                Type
              </th>
              <th className="text-left font-semibold text-[var(--dark-text-primary)] px-4 py-2.5 border-b border-white/[0.06]">
                Default TTL
              </th>
              <th className="text-left font-semibold text-[var(--dark-text-primary)] px-4 py-2.5 border-b border-white/[0.06]">
                Used for
              </th>
            </tr>
          </thead>
          <tbody className="text-[var(--dark-text-secondary)]">
            {[
              ["FACT", "730 days", "Static information about users, systems, or the world"],
              ["EVENT", "365 days", "Time-bound occurrences (incidents, deploys, meetings)"],
              ["PREFERENCE", "730 days", "How this operator or user likes things done"],
              ["DECISION", "730 days", "Choices that have been made and their rationale"],
              ["PROBLEM", "365 days", "Issues, bugs, and debugging context"],
              ["COMMIT", "365 days", "Summary and intent of a code change"],
              ["RELATIONSHIP", "730 days", "Connections between entities in the domain"],
              ["TASK", "90 days", "Open work items with short-horizon relevance"],
              ["PROCEDURE", "365 days", "How-to steps, processes, repeatable patterns"],
            ].map(([type, ttl, use]) => (
              <tr key={type} className="border-b border-white/[0.04] last:border-b-0">
                <td className="px-4 py-2 font-mono text-[12.5px] text-[var(--dark-text-primary)]">
                  {type}
                </td>
                <td className="px-4 py-2 font-mono">{ttl}</td>
                <td className="px-4 py-2">{use}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 id="memory-status">Memory status</h2>
      <p>
        Every memory carries a status that controls whether it's eligible for
        recall. Status transitions are the authoritative record of how context
        evolves over time.
      </p>
      <ul>
        <li>
          <strong>ACTIVE</strong> — current; in use for recall.
        </li>
        <li>
          <strong>STALE</strong> — past its TTL but not yet replaced.
        </li>
        <li>
          <strong>SUPERSEDED</strong> — explicitly replaced by a newer memory
          with the same <code>conflict_key</code>.
        </li>
        <li>
          <strong>INVALIDATED</strong> — known to be factually incorrect.
        </li>
        <li>
          <strong>REJECTED</strong> — failed the extraction-time quality gate.
        </li>
      </ul>

      <h2 id="memory-layers">Memory layers</h2>
      <p>
        When the recall step assembles context for the provider, memories are
        organised into four layers. The layer determines composition priority
        and display in the trace view.
      </p>
      <ul>
        <li>
          <strong>EPISODIC</strong> — the most recent conversation turns. Most
          time-sensitive.
        </li>
        <li>
          <strong>PROCEDURAL</strong> — learned procedures and reusable
          how-tos.
        </li>
        <li>
          <strong>CONVERSATIONAL</strong> — prior exchanges with the same user.
        </li>
        <li>
          <strong>PROACTIVE</strong> — context the agent chose to pre-stage.
          Least time-sensitive.
        </li>
      </ul>

      <h2 id="configuration">Configuration knobs</h2>
      <p>
        The defaults are sane for most installs. These are the environment
        variables you're most likely to reach for.
      </p>
      <ul>
        <li>
          <code>MEMORY_MAX_RECALL</code> (25) — how many memories can land in a
          recall result.
        </li>
        <li>
          <code>MEMORY_RECALL_THRESHOLD</code> (0.25) — minimum similarity for
          a memory to be recalled.
        </li>
        <li>
          <code>MEMORY_RECENCY_HALF_LIFE_DAYS</code> (120) — decay rate for
          time-based ranking.
        </li>
        <li>
          <code>MEMORY_MAX_CONTEXT_TOKENS</code> (3500) — token budget for
          context assembly.
        </li>
        <li>
          <code>MEMORY_MAX_PER_USER</code> (2000) — retention cap before
          maintenance prunes least-important records.
        </li>
        <li>
          <code>MEMORY_SIMILARITY_DEDUP_THRESHOLD</code> (0.92) — cosine
          similarity threshold for deduplication.
        </li>
      </ul>

      <Callout variant="info" title="Embedding model">
        Memory vectors default to{" "}
        <code>paraphrase-multilingual-MiniLM-L12-v2</code> via
        sentence-transformers. Swap it via <code>MEMORY_EMBEDDING_MODEL</code>{" "}
        if you need a different language tier or size.
      </Callout>

      <h2 id="knowledge-retrieval">Knowledge retrieval</h2>
      <p>
        Knowledge is the operator-approved counterpart to memory. Where memory
        learns from interactions, knowledge is curated: documents, runbooks,
        policies, and evidence that operators have explicitly marked as
        authoritative.
      </p>
      <p>
        The retrieval engine combines three signals into one ranked result:
      </p>
      <ul>
        <li>
          <strong>Lexical</strong> — keyword match on the document chunks.
        </li>
        <li>
          <strong>Dense</strong> — cosine similarity over the chunk embedding.
        </li>
        <li>
          <strong>Graph</strong> — entity and relation proximity via the
          canonical-entity graph.
        </li>
      </ul>
      <p>
        Scores are fused with <strong>Reciprocal Rank Fusion</strong> (RRF,{" "}
        <code>K=60</code>). Graph edges carry typed weights — strong ones like{" "}
        <code>governs</code> (1.0) and <code>supersedes</code> (0.95) dominate
        the ranking, weak ones like <code>mentions</code> (0.35) barely nudge
        it. A <code>contradicts</code> edge has weight 0, so a contradicting
        entity will never boost a hit.
      </p>

      <h3 id="retrieval-output">What retrieval returns</h3>
      <p>Every query returns a structured response you can show in the UI:</p>
      <ul>
        <li>
          <strong>Selected hits</strong> — the final ranked chunks the agent
          should use.
        </li>
        <li>
          <strong>Trace hits</strong> — every candidate, with its lexical,
          dense, and graph ranks for debugging.
        </li>
        <li>
          <strong>Authoritative vs supporting evidence</strong> — highest
          confidence sources vs corroborating ones.
        </li>
        <li>
          <strong>Linked entities and graph relations</strong> — the part of
          the graph the query touched.
        </li>
        <li>
          <strong>Grounding score</strong> — overall confidence the answer can
          be grounded.
        </li>
        <li>
          <strong>Answer plan</strong> — a recommended action mode (direct,
          scoped, defer) for the agent.
        </li>
        <li>
          <strong>Judge result</strong> — policy-compliance metrics: citation
          coverage, contradiction rate, policy compliance.
        </li>
      </ul>

      <h3 id="knowledge-storage">Knowledge storage</h3>
      <p>Knowledge lives in Postgres with <code>pgvector</code>:</p>
      <ul>
        <li>
          <code>knowledge_documents</code> — source documents.
        </li>
        <li>
          <code>knowledge_chunks</code> — chunked text, each with an embedding
          row.
        </li>
        <li>
          <code>knowledge_entities</code> and <code>knowledge_relations</code>{" "}
          — the canonical entity graph.
        </li>
        <li>
          <code>retrieval_traces</code>, <code>retrieval_trace_hits</code>,{" "}
          <code>retrieval_bundles</code> — per-query audit and ranking
          breakdown.
        </li>
        <li>
          <code>answer_traces</code> and <code>answer_judgements</code> — what
          the agent did with the retrieval result.
        </li>
      </ul>

      <Callout variant="tip" title="Memory vs knowledge">
        <p>
          <strong>Memory</strong> is <em>learned</em> — it comes out of
          conversations automatically and is scoped to a user or agent.{" "}
          <strong>Knowledge</strong> is <em>curated</em> — documents and
          policies operators explicitly trust, shared across agents. Both are
          consulted on every task; neither is authoritative on its own.
        </p>
      </Callout>

      <h2 id="next">Go deeper</h2>
      <ul>
        <li>
          <Link href="/docs/skills/authoring-a-skill">Authoring a Skill</Link>{" "}
          — Skills combine a prompt contract with the recall and retrieval
          context above.
        </li>
        <li>
          <Link href="/docs/api-reference/runtime">Runtime API</Link> — the
          endpoints that surface memory hits and retrieval traces in the UI.
        </li>
        <li>
          <Link href="/docs/operations/security">Security</Link> — how the
          security service sanitises every memory write and retrieval result
          before it leaves Postgres.
        </li>
      </ul>
    </>
  );
}
