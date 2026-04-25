import Link from "next/link";
import { Callout } from "./callout";
import { CodeBlock } from "./code-block";

export function ContributingSubmitting() {
  return (
    <>
      <p>
        Koda's contribution model is plain GitHub: fork, branch, pull
        request. The bar is clarity — commits should read well, PRs should
        explain what they change and why, and CI should be green before
        review.
      </p>

      <h2 id="before-you-start">Before you start</h2>
      <ul>
        <li>
          Check open issues and pull requests for prior art.
        </li>
        <li>
          For non-trivial changes, open a discussion or draft issue first.
          It's cheaper to align on approach before code than after.
        </li>
        <li>
          Read <code>CONTRIBUTING.md</code> in the repo — it's short and
          authoritative.
        </li>
      </ul>

      <h2 id="branches">Branches</h2>
      <ul>
        <li>
          <strong>Branch from <code>main</code>.</strong> Main always
          reflects the latest merged state.
        </li>
        <li>
          <strong>Naming.</strong> Prefix with a short type plus a slug:{" "}
          <code>feat/memory-recall-timeout</code>,{" "}
          <code>fix/session-cookie-samesite</code>,{" "}
          <code>docs/skills-authoring</code>.
        </li>
        <li>
          <strong>Keep branches short.</strong> Rebase on <code>main</code>{" "}
          regularly. A branch that lives longer than a week usually has
          diverged more than it gains.
        </li>
      </ul>

      <h2 id="commits">Commits</h2>
      <ul>
        <li>
          <strong>Imperative, present-tense subjects</strong> — "Fix X"
          beats "Fixed X" beats "X is fixed".
        </li>
        <li>
          <strong>One logical change per commit.</strong> The commit is a
          unit of review; mixing unrelated changes makes <code>git log</code>{" "}
          harder to read in six months.
        </li>
        <li>
          <strong>Body explains <em>why</em></strong>, not what — the diff
          already shows what changed. If the why is obvious, skip the body.
        </li>
      </ul>

      <h2 id="pull-requests">Pull requests</h2>

      <h3 id="pr-description">Description</h3>
      <p>The PR description should cover:</p>
      <ul>
        <li>
          <strong>What</strong> — a concrete summary of the change. Two or
          three sentences is usually enough.
        </li>
        <li>
          <strong>Why</strong> — the motivation, linked to an issue or
          discussion if one exists.
        </li>
        <li>
          <strong>How to verify</strong> — steps a reviewer can follow to
          convince themselves the change works.
        </li>
        <li>
          <strong>Risk</strong> — anything the change could break, or that
          operators should know about.
        </li>
      </ul>

      <h3 id="pr-scope">Scope</h3>
      <p>
        Keep PRs focused. A PR that changes one thing is easier to review,
        merge, and — if needed — revert. Mechanical refactors and the
        behavioural change they enable belong in separate PRs whenever
        possible.
      </p>

      <h3 id="pr-size">Size</h3>
      <p>
        No hard cap, but anything over ~500 net-lines-changed benefits from
        being split. If a large change can't be split, pre-announce it in an
        issue so reviewers have context before opening the diff.
      </p>

      <h2 id="checks">Local checks before opening</h2>
      <p>Run the full suite so the reviewer isn't the first to hit failures:</p>
      <CodeBlock
        language="bash"
        code={`# Backend
ruff check .
ruff format --check .
mypy koda/ --ignore-missing-imports
pytest --cov=koda --cov-report=term-missing

# Web
pnpm lint
pnpm typecheck
pnpm test`}
      />

      <Callout variant="tip" title="Pre-push hook">
        A <code>pre-push</code> hook that runs <code>ruff check</code>,{" "}
        <code>mypy</code>, and the web <code>typecheck</code> catches 80% of
        CI failures before you push. The repo ships an opt-in sample you
        can enable with <code>git config core.hooksPath scripts/hooks</code>.
      </Callout>

      <h2 id="tests">Tests</h2>
      <ul>
        <li>
          <strong>Every behavioural change needs a test</strong> — preferably
          at the layer the change lives (unit where possible, integration
          where necessary).
        </li>
        <li>
          <strong>Regressions take a test</strong>. Fixing a bug without a
          test lets the bug recur silently.
        </li>
        <li>
          <strong>Memory, knowledge, and runtime</strong> each have their
          own test subdirectories — follow the existing pattern rather than
          mixing.
        </li>
      </ul>

      <h2 id="docs">Documentation</h2>
      <p>
        If your change alters user-visible behaviour, update the docs in the
        same PR. User-facing docs live in <code>docs/</code>; contributor-
        facing notes live in <code>docs/ai/</code>. The README is for headline
        claims — update it when your change materially shifts one of them.
      </p>

      <h2 id="review">Review</h2>
      <ul>
        <li>
          <strong>Expect feedback.</strong> Reviews are a conversation, not
          a gate. Be prepared to iterate.
        </li>
        <li>
          <strong>Push updates as additional commits</strong> during review;
          squash only on the final merge. It makes the review diff easy to
          follow.
        </li>
        <li>
          <strong>Thank the reviewer.</strong> Review is work too.
        </li>
      </ul>

      <h2 id="merging">Merging</h2>
      <p>
        Maintainers use squash-merge onto <code>main</code> by default. The
        final commit message is the PR title + a summary of the body, so
        keep both tidy.
      </p>

      <h2 id="security">Security-sensitive changes</h2>
      <p>
        If you're fixing a security issue, follow the disclosure process in{" "}
        <code>SECURITY.md</code>. Don't open a public PR with the fix before
        the disclosure window closes.
      </p>

      <h2 id="next">Next steps</h2>
      <ul>
        <li>
          <Link href="/docs/contributing/development-setup">
            Development setup
          </Link>{" "}
          — if you haven't cloned yet.
        </li>
        <li>
          <Link href="/docs/governance/code-of-conduct">Code of conduct</Link>{" "}
          — the community standards every contribution is held to.
        </li>
      </ul>
    </>
  );
}
