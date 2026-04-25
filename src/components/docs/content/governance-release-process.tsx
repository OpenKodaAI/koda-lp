import Link from "next/link";
import { Callout } from "./callout";
import { CodeBlock } from "./code-block";

export function GovernanceReleaseProcess() {
  return (
    <>
      <p>
        Koda ships through the npm-published <code>@openkodaai/koda</code>{" "}
        CLI and matching GitHub Releases. Every release is cut from{" "}
        <code>main</code> by version, gated on CI, and recoverable if
        publication half-fails. This page explains what that looks like
        day-to-day.
      </p>

      <h2 id="versioning">Versioning</h2>
      <p>
        Koda follows semantic versioning with a light touch. The version
        number signals intent, not a contract you can litigate.
      </p>
      <ul>
        <li>
          <strong>Patch</strong> (<code>1.0.X</code>) — bug fixes,
          documentation updates, internal refactors with no user-visible
          behaviour change.
        </li>
        <li>
          <strong>Minor</strong> (<code>1.X.0</code>) — new features,
          new surfaces, backward-compatible additions to API shape or
          configuration.
        </li>
        <li>
          <strong>Major</strong> (<code>X.0.0</code>) — breaking changes to
          the configured surface (API routes, env var names, on-disk state
          layout).
        </li>
      </ul>

      <Callout variant="info" title="What's stable">
        <p>
          The control-plane OpenAPI contract at{" "}
          <code>/openapi/control-plane.json</code>, the runtime API surface,
          env var names, and the on-disk schema for durable state are
          stability commitments. Internal Python modules, skill file layout
          details, and dashboard component internals may move without
          notice.
        </p>
      </Callout>

      <h2 id="release-cadence">Cadence</h2>
      <p>
        Releases ship on demand rather than on a fixed calendar. A patch
        release can land any time there's a fix worth shipping; minors
        accumulate until there's a meaningful feature set or the team
        decides it's time. There is no "freeze week" — stability lives in
        CI, not in a schedule.
      </p>

      <h2 id="cut-a-release">How a release is cut</h2>
      <p>
        Release machinery is driven by version changes landing on{" "}
        <code>main</code>. The pipeline has four gates:
      </p>
      <ol>
        <li>
          <strong>Version bump on main.</strong> The repository version
          changes (in <code>packages/cli/package.json</code> and{" "}
          <code>pyproject.toml</code>) via a PR that merges to{" "}
          <code>main</code>.
        </li>
        <li>
          <strong>CI passes.</strong> Both the <code>pr-quality</code> and{" "}
          <code>security</code> workflows must pass on the merge commit.
          Either failing blocks the release.
        </li>
        <li>
          <strong>Tag creation.</strong> GitHub Actions creates the matching{" "}
          <code>v{"<version>"}</code> tag on the validated commit.
        </li>
        <li>
          <strong>Publish workflow.</strong> The tag triggers release
          publication: npm package, GHCR images, GitHub Release assets. All
          three come from the same tag.
        </li>
      </ol>

      <h2 id="recovery">Recovery from partial publications</h2>
      <p>
        Publishing occasionally misfires — a transient npm registry error,
        a GHCR hiccup, a missing checksum. Two behaviours keep the release
        honest:
      </p>
      <ul>
        <li>
          <strong>Tag-cut workflow redispatch.</strong> If the tag already
          exists on the validated commit but the GitHub release is still
          draft, assets are missing, or the npm dist-tag is wrong, the
          tag-cut workflow triggers the publish workflow again for
          recovery. It doesn't silently drop the failure.
        </li>
        <li>
          <strong>Fail-loud on escaped tags.</strong> If the tag already
          belongs to an older commit and publication is incomplete, the
          workflow fails loudly so the next merge must ship a new patch
          version instead of trying to reuse an escaped semantic tag.
        </li>
      </ul>

      <h2 id="what-ships">What ships</h2>
      <p>
        The scoped npm package <code>@openkodaai/koda</code> ships the
        product channel — the same release bundle attached to the GitHub
        release:
      </p>
      <ul>
        <li>The CLI binary itself.</li>
        <li>
          The pinned release manifest (<code>release.yaml</code>) — versions
          of Docker images, checksums, migration requirements.
        </li>
        <li>The compose / bootstrap bundle.</li>
        <li>Release checksums and SBOM metadata.</li>
      </ul>

      <Callout variant="info" title="npm installs the product, not the source">
        <p>
          <code>npm install -g @openkodaai/koda</code> installs the product
          channel. It's the supported distribution — not a developer's
          convenience, and not the source tree. The source is what you
          clone; the product is what you install.
        </p>
      </Callout>

      <h2 id="user-update-path">User update path</h2>
      <p>
        Users upgrade through the CLI. The update command pulls the latest
        release, restarts the stack, runs the doctor, and rolls back
        automatically if post-update health is red.
      </p>
      <CodeBlock
        language="bash"
        code={`koda update`}
      />
      <p>
        Major version bumps may also require manual migration steps. When
        they do, the release notes call them out explicitly and the update
        command surfaces them before proceeding.
      </p>

      <h2 id="release-notes">Release notes</h2>
      <p>
        Every release on GitHub ships with notes summarising user-visible
        changes, migration steps (if any), and known issues. Patch releases
        typically have terse notes; minors and majors are more narrative.
      </p>

      <h2 id="deprecations">Deprecations</h2>
      <p>
        When something is on a deprecation path, it's announced in release
        notes, surfaced as a warning in the dashboard and/or CLI, and kept
        working for at least one minor version before removal. No silent
        breakage.
      </p>

      <h2 id="next">Next steps</h2>
      <ul>
        <li>
          <Link href="/docs/contributing/submitting-changes">
            Submitting changes
          </Link>{" "}
          — how your work gets into a release.
        </li>
        <li>
          <Link href="/docs/governance/code-of-conduct">Code of conduct</Link>{" "}
          — the community standards that shape every release conversation.
        </li>
      </ul>
    </>
  );
}
