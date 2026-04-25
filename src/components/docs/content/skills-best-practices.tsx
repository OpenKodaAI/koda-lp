import Link from "next/link";
import { Callout } from "./callout";
import { CodeBlock } from "./code-block";

export function SkillsBestPractices() {
  return (
    <>
      <p>
        The existing skill corpus in <code>koda/skills/</code> is the best
        source of truth for how to write a good skill. The patterns below are
        extracted from reading the curated library (<code>architecture.md</code>,{" "}
        <code>code-review.md</code>, <code>deep-research.md</code>,{" "}
        <code>best-practices.md</code>, among others). They're conventions,
        not hard rules — but skills that follow them age well and compose
        cleanly.
      </p>

      <h2 id="scope-the-methodology">Scope the methodology</h2>
      <p>
        The <code>&lt;when_to_use&gt;</code> block should state applicability{" "}
        <strong>and non-applicability</strong>. Skills that only describe
        when to apply drift into over-use; skills that also tell the model
        when to skip stay sharp.
      </p>

      <CodeBlock
        language="markdown"
        code={`<when_to_use>
Apply this methodology for new system design, significant architectural
changes, or evaluating existing architectures. For small features or bug
fixes, this level of analysis is unnecessary — focus on the code instead.
</when_to_use>`}
      />

      <Callout variant="tip" title="Be honest about the edges">
        A skill that says "apply when relevant" is a skill that never
        deactivates. Anchor the scope to concrete task shapes and explicitly
        name the situations where a simpler approach wins.
      </Callout>

      <h2 id="instruction-is-terse">Keep the instruction terse</h2>
      <p>
        The <code>instruction</code> frontmatter field drives model behaviour.
        One or two sentences with concrete verbs ("analyse", "prioritise",
        "emit") outperform a paragraph of exhortation. Save the nuance for
        the body.
      </p>

      <CodeBlock
        language="yaml"
        code={`instruction: "Analyze code against SOLID principles and common anti-patterns. Prioritize findings by structural impact and provide concrete refactored code, not abstract advice."`}
      />

      <h2 id="enforce-output-shape">Enforce output shape</h2>
      <p>
        <code>output_format_enforcement</code> is where reproducibility lives.
        Models follow specific structural requirements more reliably than
        vague ones. "Structure as X, Y, Z in that order" consistently beats
        "format your answer clearly".
      </p>

      <CodeBlock
        language="yaml"
        code={`output_format_enforcement: "Structure as: **Context** (problem + constraints), **Decision** (chosen approach), **Trade-offs** (what was gained vs lost), **Risks** (what could go wrong + mitigation). Include a component diagram if applicable."`}
      />

      <h2 id="numbered-approach">Write the approach as numbered steps</h2>
      <p>
        Four to seven numbered steps is the sweet spot. Each step names a
        concrete action, not an aspiration. Steps with sub-bullets work well
        for checklists.
      </p>
      <ul>
        <li>
          "Identify key Non-Functional Requirements (NFRs): Performance,
          Scalability, Availability, Consistency vs Availability trade-offs,
          Security and compliance" ← good.
        </li>
        <li>
          "Understand what matters" ← bad. No action, no criteria.
        </li>
      </ul>

      <h2 id="signal-confidence">Signal confidence and limits</h2>
      <p>
        Skills that ask the model to label its confidence produce more
        trustworthy output than skills that don't.{" "}
        <code>deep-research.md</code> asks for confidence levels per finding;{" "}
        <code>best-practices.md</code> uses High / Medium / Low priority;{" "}
        <code>architecture.md</code> requires explicit risk + mitigation.
        Borrow the pattern.
      </p>

      <h2 id="triggers">Trigger patterns</h2>
      <p>
        Triggers gate auto-selection. A few patterns make them reliable:
      </p>
      <ul>
        <li>
          Always case-insensitive (<code>(?i)</code>) and word-bounded (
          <code>\b</code>).
        </li>
        <li>
          Cover synonyms, including language variants — skills tend to span
          English and Portuguese in the existing corpus.
        </li>
        <li>
          Match noun phrases, not whole sentences. <code>\brefactor(ing)?\b</code>{" "}
          is better than <code>refactor.*code</code>.
        </li>
        <li>
          Avoid being too greedy. A skill fired by "any" query is rarely a
          skill that's actually helpful.
        </li>
      </ul>

      <h2 id="priority-and-tokens">Priority and token budgets</h2>
      <p>
        The selector uses <code>priority</code> as a tie-breaker when multiple
        skills match. Curated skills cluster around <strong>40-50</strong>.
        Push higher (55-60) only when the skill should win against peers in a
        specific domain — and document why in a comment or the tags.
      </p>
      <p>
        <code>max_tokens</code> sits between <strong>2000 and 3000</strong>{" "}
        for most skills. Longer methodologies (research, architecture) can
        justify 3000; quick-hit skills (TDD, code smell checks) do fine at
        2000.
      </p>

      <h2 id="aliases">Use aliases generously</h2>
      <p>
        Three to four aliases per skill is typical. The ones that matter most:
        the natural English short name, a Portuguese variant (the codebase
        leans bilingual), and a hyphenated URL-safe form. They make the{" "}
        <code>/skill</code> command usable without memorising the canonical ID.
      </p>

      <CodeBlock
        language="yaml"
        code={`aliases: [boas-praticas, quality, standards]`}
      />

      <h2 id="composition">Compose sparingly</h2>
      <p>
        <code>requires</code> and <code>conflicts</code> exist, but most
        skills stand alone. Reach for composition when a skill genuinely
        depends on another's methodology — a specialised code-review skill
        might <code>require</code> the general <code>code-review</code> skill,
        for example. Avoid chains that run four skills deep: each added skill
        eats into the shared token budget and blurs the methodology.
      </p>

      <h2 id="versioning">Versioning and change</h2>
      <p>
        Bump the <code>version</code> field on every material change to
        methodology or output shape. It's the only signal downstream consumers
        (dashboards, API clients) have that a skill's behaviour shifted.
        Mechanical edits (typo, alias addition) don't need a version bump.
      </p>

      <h2 id="smoke-test">Smoke-test before shipping</h2>
      <p>Two checks before a new skill lands in a deployment:</p>
      <ul>
        <li>
          <strong>Manual invocation.</strong> Run <code>/skill &lt;name&gt;</code>{" "}
          with a representative query. The composed prompt should read like
          something an expert would ask, not a wall of metadata.
        </li>
        <li>
          <strong>Trigger cross-check.</strong> Paste three candidate queries
          you'd expect to fire the skill, and three you wouldn't. Confirm the
          selector agrees in both directions.
        </li>
      </ul>

      <Callout variant="warn" title="Don't smuggle tools in">
        Skills describe methodology. Tool invocations belong in the agent
        contract, not the skill body. A skill that tries to call tools
        directly will confuse the runtime tool loop and bloat the token budget.
      </Callout>

      <h2 id="next">Next steps</h2>
      <ul>
        <li>
          <Link href="/docs/skills/authoring-a-skill">Authoring a Skill</Link>{" "}
          — the file format and frontmatter reference.
        </li>
        <li>
          <Link href="/docs/concepts/runtime">Runtime</Link> — how the composer
          assembles your skill into the active prompt.
        </li>
      </ul>
    </>
  );
}
