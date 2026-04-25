import Link from "next/link";
import { Callout } from "./callout";

export function GovernanceCodeOfConduct() {
  return (
    <>
      <p>
        Koda's community standards are plain, enforced consistently, and
        non-negotiable. The canonical document is <code>CODE_OF_CONDUCT.md</code>{" "}
        in the repository — this page summarises it and explains how it's
        upheld.
      </p>

      <h2 id="principles">Principles</h2>
      <p>
        Three expectations apply to every interaction: issues, pull requests,
        discussions, code review, and any synchronous channel the project
        uses.
      </p>
      <ul>
        <li>
          <strong>Be respectful.</strong> Disagreement is welcome; personal
          attacks, insults, and hostility are not. Critique ideas, not
          people.
        </li>
        <li>
          <strong>Be inclusive.</strong> Koda is an international,
          multilingual project. Assume good faith, avoid region-specific
          idioms when they add nothing, and default to English in public
          spaces so everyone can follow along.
        </li>
        <li>
          <strong>Be constructive.</strong> If you see a problem, say what
          would improve it. If something works well, name it. Reviews that
          only point out flaws leave the contributor with no direction.
        </li>
      </ul>

      <h2 id="not-ok">What's not OK</h2>
      <ul>
        <li>
          Harassment in any form — sexual, racist, ableist, or otherwise
          targeting a person's identity or circumstances.
        </li>
        <li>
          Personal attacks, sustained disruption, or bad-faith argument.
        </li>
        <li>
          Sharing others' private information without explicit consent.
        </li>
        <li>
          Posting content in public project spaces that would be unwelcome
          at a professional conference: explicit imagery, deliberately
          provocative language, off-topic political campaigning.
        </li>
      </ul>

      <h2 id="reporting">Reporting</h2>
      <p>
        If you see or experience behaviour that conflicts with the code,
        report it. The escalation path, in order:
      </p>
      <ol>
        <li>
          <strong>If you're comfortable doing so</strong>, raise it directly
          with the person involved — privately, specifically, and with the
          assumption they'll act on it.
        </li>
        <li>
          <strong>Otherwise</strong>, contact the maintainers via the email
          address listed in <code>CODE_OF_CONDUCT.md</code>. Reports are
          read by a small group, kept confidential, and acknowledged within
          a few working days.
        </li>
        <li>
          <strong>For security-adjacent concerns</strong> (doxxing, ongoing
          harassment, coordinated brigading), follow the security disclosure
          path in <code>SECURITY.md</code> — it reaches the same responders
          faster.
        </li>
      </ol>

      <Callout variant="info" title="Confidentiality">
        Reporters' identities are not shared with the subject of a report
        without the reporter's explicit consent. Investigations may require
        disclosing <em>facts</em> of an incident while keeping reporter
        identity protected.
      </Callout>

      <h2 id="enforcement">Enforcement</h2>
      <p>
        Maintainers respond with proportional consequences. The response
        considers severity, frequency, impact, and the responder's prior
        engagement with the project.
      </p>
      <ul>
        <li>
          <strong>Private correction.</strong> A direct message explaining
          what was wrong and what the expectation is going forward. The
          default response for a first, minor incident.
        </li>
        <li>
          <strong>Public warning.</strong> A visible note in the thread or
          discussion when the behaviour was public and the correction needs
          to be as well. Used to close a disruptive thread cleanly.
        </li>
        <li>
          <strong>Temporary ban.</strong> Restriction from specific spaces
          (issues, PRs, discussions) for a set period. Used for repeated or
          clearly unacceptable behaviour.
        </li>
        <li>
          <strong>Permanent ban.</strong> For severe cases or patterns of
          repeated harm. Ending this way is rare; it's what's left when the
          lesser steps have failed or the conduct is too serious to handle
          otherwise.
        </li>
      </ul>

      <h2 id="attribution">Attribution</h2>
      <p>
        The code of conduct is adapted from the <strong>Contributor
        Covenant</strong>. Details and the full text live in{" "}
        <code>CODE_OF_CONDUCT.md</code>. When in doubt, the repository
        document is authoritative over this summary.
      </p>

      <h2 id="next">Next steps</h2>
      <ul>
        <li>
          <Link href="/docs/contributing/submitting-changes">
            Submitting changes
          </Link>{" "}
          — the practical side of participation.
        </li>
        <li>
          <Link href="/docs/governance/release-process">Release process</Link>{" "}
          — how merged work reaches users.
        </li>
      </ul>
    </>
  );
}
