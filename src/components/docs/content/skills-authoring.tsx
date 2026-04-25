import Link from "next/link";
import { Callout } from "./callout";
import { CodeBlock } from "./code-block";
import { Step, StepList } from "./step-list";

export function SkillsAuthoring() {
  return (
    <>
      <p>
        A <strong>Skill</strong> in Koda is a reusable expert methodology
        captured as a markdown file. Skills live in{" "}
        <code>koda/skills/</code>, are hot-reloaded from disk, and are invoked
        either explicitly via the <code>/skill</code> command or automatically
        by the selector when a user's query matches their triggers.
      </p>

      <Callout variant="info" title="Runtime skills vs repo-guidance skills">
        <p>
          This page is about <strong>runtime skills</strong> — prompt templates
          end users see via <code>/skill</code>. They live in{" "}
          <code>koda/skills/*.md</code>. Repository-local guidance skills
          (development workflows for contributors) live in a separate tree at{" "}
          <code>docs/ai/skills/</code> and are out of scope here.
        </p>
      </Callout>

      <h2 id="anatomy">Anatomy of a skill</h2>
      <p>
        Every skill is one markdown file. The filename stem becomes the skill
        ID — <code>code-review.md</code> registers as <code>code-review</code>.
        A skill has three parts: YAML frontmatter, a <code>&lt;when_to_use&gt;</code>{" "}
        block, and a methodology body.
      </p>

      <CodeBlock
        language="markdown"
        code={`---
name: Software Best Practices
aliases: [boas-praticas, quality, standards]
category: engineering
tags: [solid, best-practices, refactoring, code-quality]
triggers:
  - "(?i)\\\\bbest\\\\s+practices?\\\\b"
  - "(?i)\\\\bsolid\\\\s+principles?\\\\b"
  - "(?i)\\\\brefactor(ing)?\\\\b"
priority: 45
max_tokens: 2500
instruction: "Analyze code against SOLID principles and common anti-patterns. Prioritize findings by structural impact and provide concrete refactored code, not abstract advice."
output_format_enforcement: "Format per finding as: **Principle** violated, **Location** (file:line), **Problem** (concrete impact), **Suggestion** (refactored code), **Priority** (High/Medium/Low)."
---

# Software Best Practices

You are an expert in software engineering best practices...

<when_to_use>
Apply when reviewing code quality, refactoring existing code, or when the
user asks for best practice guidance. Focus on the most impactful issues
first — not every code smell needs immediate attention.
</when_to_use>

## Approach
1. Analyze code against SOLID principles...
2. Check for common anti-patterns...

## Output Format
...`}
      />

      <h2 id="frontmatter">Frontmatter fields</h2>
      <p>
        Every field is optional — but skills with no metadata can't be
        auto-selected, only invoked by name. The selector leans on
        frontmatter to decide whether a skill applies.
      </p>

      <div className="not-prose my-6 overflow-x-auto rounded-[12px] border border-white/[0.06]">
        <table className="w-full text-[13.5px] border-collapse">
          <thead>
            <tr className="bg-white/[0.03]">
              <th className="text-left font-semibold text-[var(--dark-text-primary)] px-4 py-2.5 border-b border-white/[0.06]">
                Field
              </th>
              <th className="text-left font-semibold text-[var(--dark-text-primary)] px-4 py-2.5 border-b border-white/[0.06]">
                Purpose
              </th>
            </tr>
          </thead>
          <tbody className="text-[var(--dark-text-secondary)]">
            {[
              ["name", "Display name shown in /skill listings."],
              ["aliases", "Alternative invocation names for /skill. Great for multilingual variants."],
              ["category", "Grouping label (engineering, design, research, etc.)."],
              ["tags", "Freeform labels for search and categorisation."],
              ["version", "Skill version string (defaults to 1.0.0)."],
              ["triggers", "List of case-insensitive regex patterns. If any matches the user query, the skill becomes a candidate."],
              ["priority", "Base priority used by the selector when multiple skills match (typical: 40–50)."],
              ["max_tokens", "Token budget for the composed skill body (typical: 2000–3000)."],
              ["instruction", "Terse model directive. 1–2 sentences, concrete verbs."],
              ["output_format_enforcement", "Strict output shape. Drives reproducibility of the skill's response."],
              ["requires", "Other skills that must compose before this one."],
              ["conflicts", "Skills that cannot coexist with this one."],
            ].map(([field, purpose]) => (
              <tr key={field} className="border-b border-white/[0.04] last:border-b-0">
                <td className="px-4 py-2 font-mono text-[12.5px] text-[var(--dark-text-primary)]">
                  {field}
                </td>
                <td className="px-4 py-2">{purpose}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 id="body-sections">Body sections</h2>
      <p>
        The markdown body speaks directly to the model when the skill is
        composed. Three conventions recur in every curated skill.
      </p>
      <ul>
        <li>
          <strong>Persona</strong> — open with a one-liner that establishes
          the expert role: <code>You are an expert in …</code>. The model
          adopts this framing for the duration of the task.
        </li>
        <li>
          <strong><code>&lt;when_to_use&gt;</code> block</strong> — a natural
          language applicability statement. Crucially, it should also state
          when <em>not</em> to apply the skill: "For small features, this
          level of analysis is unnecessary."
        </li>
        <li>
          <strong>Approach + Output Format</strong> — numbered methodology
          steps followed by a strict output-format section that pairs with
          the <code>output_format_enforcement</code> frontmatter field.
        </li>
      </ul>

      <h2 id="lifecycle">From file to composed prompt</h2>

      <StepList>
        <Step title="Drop a markdown file">
          Create the file under <code>koda/skills/</code>. The directory can
          be overridden with the <code>SKILLS_DIR</code> environment variable
          if you ship skills from a different location.
        </Step>
        <Step title="The registry picks it up automatically">
          <code>SkillRegistry</code> scans the directory on startup and every
          30 seconds thereafter. Changed or new files are re-parsed — no
          build step, no restart.
        </Step>
        <Step title="The selector ranks candidates">
          When a user query lands, the selector combines alias matches,
          trigger regex matches, and semantic embedding scores against the
          skill's <code>embedding_text</code>. Skills with{" "}
          <code>requires</code> pull their dependencies in;{" "}
          <code>conflicts</code> are filtered out.
        </Step>
        <Step title="The composer assembles the prompt">
          The composer walks the selected skill graph, extracts the methodology
          sections, enforces the token budget, and layers everything under the
          active agent's prompt contract. The model sees the methodology first,
          then the user's request.
        </Step>
        <Step title="The runtime executes">
          From this point the normal runtime pipeline takes over — provider
          dispatch, tool loop, persistence. The skill's{" "}
          <code>output_format_enforcement</code> travels in the prompt and
          shapes the response.
        </Step>
      </StepList>

      <h2 id="invocation">Invocation</h2>
      <p>Skills can be reached two ways:</p>
      <ul>
        <li>
          <strong>Explicit via /skill.</strong> Users type{" "}
          <code>/skill &lt;name&gt; [question]</code>. Without arguments the
          command lists every available skill.
        </li>
        <li>
          <strong>Automatic via the selector.</strong> When no explicit skill
          is named, the selector decides. Trigger regex matches and semantic
          similarity both contribute — a skill with strong trigger matches
          still needs a reasonable semantic score to win.
        </li>
      </ul>

      <CodeBlock
        language="text"
        code={`/skill code-review

Review packages/cli/bin/koda.mjs for security issues`}
      />

      <Callout variant="tip" title="Trigger regex discipline">
        Patterns must be case-insensitive (<code>(?i)</code>) and use word
        boundaries (<code>\b</code>). Multiple patterns cover synonyms
        including multilingual variants — <code>best practices</code>,{" "}
        <code>boas práticas</code>, <code>best-practices</code> should all
        fire the same skill.
      </Callout>

      <h2 id="discovery">Listing and discovery</h2>
      <p>
        Skills show up in three places: the <code>/skill</code> command with
        no arguments, the dashboard's Skills catalogue, and the{" "}
        <code>/api/control-plane/skills</code> endpoint (for programmatic
        listing). All three share the same registry.
      </p>

      <h2 id="next">Next steps</h2>
      <ul>
        <li>
          <Link href="/docs/skills/best-practices">Skill best practices</Link>{" "}
          — patterns from the existing skill corpus that age well and scale
          across agents.
        </li>
        <li>
          <Link href="/docs/concepts/runtime">Runtime</Link> — how the composer
          and selector fit into the execution lifecycle.
        </li>
      </ul>
    </>
  );
}
