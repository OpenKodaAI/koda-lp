import Link from "next/link";
import { Callout } from "./callout";
import { CodeBlock } from "./code-block";

export function ContributingDevSetup() {
  return (
    <>
      <p>
        Running Koda from source is the path for contributors and anyone who
        wants to touch the Python backend or the Next.js dashboard. The
        repository is a mono-repo; a single clone gives you everything.
      </p>

      <h2 id="prerequisites">Prerequisites</h2>
      <ul>
        <li>Docker and Docker Compose.</li>
        <li>Python 3.11+ (pyproject enforces <code>&gt;=3.11</code>).</li>
        <li>Node.js 20+ and <code>pnpm</code>.</li>
        <li>
          A POSIX-like shell. Windows contributors should use WSL 2.
        </li>
      </ul>

      <h2 id="clone">Clone and bootstrap</h2>

      <CodeBlock
        language="bash"
        code={`git clone https://github.com/OpenKodaAI/koda.git
cd koda`}
      />

      <p>
        Two scripts cover the usual starts. The wrapper handles Docker and
        Node prerequisites on apt-based Linux with <code>sudo</code>; on
        macOS or WSL install the prerequisites yourself.
      </p>

      <CodeBlock
        language="bash"
        code={`./scripts/install.sh    # same path a user would take
# …or, if prerequisites are already in place:
cp .env.example .env
docker compose up -d --build`}
      />

      <h2 id="backend">Backend development</h2>
      <p>Install the Python project in editable mode with the dev extras:</p>
      <CodeBlock
        language="bash"
        code={`pip install -e ".[dev]"`}
      />
      <p>Standard checks before pushing:</p>
      <CodeBlock
        language="bash"
        code={`ruff check .
ruff format --check .
mypy koda/ --ignore-missing-imports
pytest --cov=koda --cov-report=term-missing`}
      />

      <Callout variant="tip" title="Running a subset of tests">
        <p>
          <code>pytest koda/memory/tests/ -k recall</code> runs just the
          memory recall tests with substring matching. Use <code>-x</code>{" "}
          to stop on the first failure while iterating.
        </p>
      </Callout>

      <h2 id="web">Web dashboard development</h2>
      <CodeBlock
        language="bash"
        code={`pnpm install
cp apps/web/.env.example apps/web/.env.local
pnpm dev:web`}
      />
      <p>
        The dev server runs on <code>http://127.0.0.1:3000</code>. Set{" "}
        <code>KODA_API_URL</code> in <code>.env.local</code> to point at the
        running control plane (by default{" "}
        <code>http://127.0.0.1:8090</code>).
      </p>

      <h3 id="web-checks">Web checks</h3>
      <CodeBlock
        language="bash"
        code={`pnpm lint
pnpm typecheck
pnpm test`}
      />

      <h2 id="proto">Regenerating proto contracts</h2>
      <p>
        gRPC service contracts live in <code>proto/</code>. After editing a{" "}
        <code>.proto</code> file, regenerate both the Python and TypeScript
        bindings:
      </p>
      <CodeBlock
        language="bash"
        code={`buf generate`}
      />
      <p>
        <code>buf.gen.yaml</code> defines the outputs. Regenerated files are
        committed alongside the <code>.proto</code> change in the same PR.
      </p>

      <h2 id="migrations">Database migrations</h2>
      <p>
        Migrations live under <code>koda/state/migrations/</code>. Adding a
        new one is a three-step ritual:
      </p>
      <ol>
        <li>
          Write the migration file next to the existing ones — numbered,
          with both <code>up</code> and <code>down</code> sections.
        </li>
        <li>
          Update the affected typed repositories in{" "}
          <code>koda/state/</code>.
        </li>
        <li>
          Run <code>docker compose exec app python -m koda.state.migrate</code>{" "}
          against a local compose stack to confirm the migration applies
          cleanly.
        </li>
      </ol>

      <h2 id="skills">Adding a runtime skill</h2>
      <p>
        Drop a new markdown file under <code>koda/skills/</code>. The
        registry hot-reloads every 30 seconds, so a local dev stack will
        pick it up without a restart. See{" "}
        <Link href="/docs/skills/authoring-a-skill">Authoring a Skill</Link>{" "}
        for the format.
      </p>

      <h2 id="directory">Repository layout</h2>
      <ul>
        <li>
          <code>koda/</code> — Python backend: handlers, services, state, memory, skills.
        </li>
        <li>
          <code>apps/web/</code> — Next.js operator dashboard.
        </li>
        <li>
          <code>packages/cli/</code> — the <code>@openkodaai/koda</code> npm
          CLI.
        </li>
        <li>
          <code>proto/</code> — gRPC service contracts.
        </li>
        <li>
          <code>docs/</code> — authoritative prose + OpenAPI + architecture
          diagrams.
        </li>
        <li>
          <code>scripts/</code> — install wrapper, doctor, and contributor
          tooling.
        </li>
      </ul>

      <h2 id="next">Next steps</h2>
      <ul>
        <li>
          <Link href="/docs/contributing/submitting-changes">
            Submitting changes
          </Link>{" "}
          — commits, pull requests, and what review looks like.
        </li>
        <li>
          <Link href="/docs/governance/release-process">Release process</Link>{" "}
          — how your change makes it from <code>main</code> into a release.
        </li>
      </ul>
    </>
  );
}
