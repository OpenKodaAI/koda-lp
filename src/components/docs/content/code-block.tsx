"use client";

import type { ReactNode } from "react";
import { CopyButton } from "@/components/ui/copy-button";

/**
 * Token color palette — Koda-flavoured, same hues used across diagrams.
 *
 * cmd      coral   → bash commands, yaml/json keys, markdown headings
 * subcmd   violet  → bash subcommands, markdown bold
 * arg      white   → scoped npm packages, emphasised args
 * flag     blue    → bash flags, json keyword (true/false/null)
 * var      violet  → env vars
 * string   green   → quoted strings
 * number   blue    → numeric literals
 * comment  gray    → # comments
 * punct    gray    → json braces / brackets / colons
 * operator amber   → pipes, redirects, arrows
 * url      sky     → URLs
 * path     gray    → filesystem paths
 * tag      violet  → markdown <tags>
 * success  green   → ✓ symbols
 * danger   coral   → ✗ symbols
 * heading  primary → markdown # headings (uses default white)
 * bullet   blue    → yaml/markdown list markers
 * separator gray   → --- dividers
 */
const COLOR: Record<string, string> = {
  cmd: "#d97757",
  subcmd: "#b59cf0",
  arg: "#F5F5F5",
  flag: "#5b94ff",
  var: "#b59cf0",
  string: "#7fbf8f",
  number: "#5b94ff",
  keyword: "#5b94ff",
  comment: "#6A6A6A",
  punct: "#9A9A9A",
  operator: "#e4b454",
  key: "#d97757",
  url: "#88b4e0",
  path: "#9A9A9A",
  tag: "#b59cf0",
  success: "#7fbf8f",
  danger: "#df8794",
  heading: "#F5F5F5",
  bullet: "#5b94ff",
  separator: "#6A6A6A",
  directive: "#d97757",
  host: "#88b4e0",
  code: "#e4b454",
  bold: "#F5F5F5",
  link: "#88b4e0",
  version: "#e4b454",
};

type Token = { text: string; name?: string };

/**
 * Tokenise `code` by iterating non-overlapping matches of a combined
 * named-group regex. Unmatched slices keep the default text color.
 */
function tokenize(code: string, regex: RegExp): Token[] {
  const tokens: Token[] = [];
  let cursor = 0;
  for (const match of code.matchAll(regex)) {
    const start = match.index ?? 0;
    if (start < cursor) continue;
    if (start > cursor) tokens.push({ text: code.slice(cursor, start) });
    const groups = match.groups ?? {};
    const name = Object.keys(groups).find((k) => groups[k] !== undefined);
    tokens.push({ text: match[0], name });
    cursor = start + match[0].length;
  }
  if (cursor < code.length) tokens.push({ text: code.slice(cursor) });
  return tokens;
}

// ───────────────────────────────────────────────────────────────────────────
// Per-language regex — combined from sources for readability.
// Ordering matters: earlier alternatives take precedence for equal starts.
// ───────────────────────────────────────────────────────────────────────────

const BASH_REGEX = new RegExp(
  [
    "(?<comment>#[^\\n]*)",
    "(?<string>\"(?:[^\"\\\\]|\\\\.)*\"|'(?:[^'\\\\]|\\\\.)*')",
    "(?<var>\\$\\{?[A-Za-z_]\\w*\\}?)",
    "(?<arg>@[\\w-]+\\/[\\w.-]+(?:@[\\w.-]+)?)",
    "(?<flag>(?<=^|\\s)-{1,2}[A-Za-z][\\w-]*)",
    "(?<cmd>\\b(?:npx|npm|pnpm|yarn|curl|wget|git|koda|docker|docker\\s+compose|kubectl|pip|pipx|pytest|ruff|mypy|python3?|node|cp|mv|rm|mkdir|chmod|chown|systemctl|tailscale|sudo|ls|cd|cat|echo|export|source|brew|apt|apt-get|gh|buf)\\b)",
    "(?<subcmd>(?<=\\s)(?:install|update|upgrade|down|up|logs|doctor|version|uninstall|build|test|lint|typecheck|check|format|generate|exec|dev:web|dev|clone|pull|push|commit|compose|issue-code|auth|run|start|stop|restart|serve|funnel|login|logout|tunnel)(?=\\s|$))",
    "(?<url>https?:\\/\\/[^\\s`\"']+)",
    "(?<operator>\\|\\||&&|>>|[|><;])",
    "(?<path>(?<=^|[\\s=:])(?:\\.{1,2}|~)?\\/[\\w./~-]+)",
    "(?<number>\\b\\d+\\b)",
  ].join("|"),
  "gm"
);

const YAML_REGEX = new RegExp(
  [
    "(?<comment>#[^\\n]*)",
    "(?<separator>^---+\\s*$)",
    "(?<key>^[ \\t]*[\\w.-]+(?=\\s*:))",
    "(?<string>\"(?:[^\"\\\\]|\\\\.)*\"|'(?:[^'\\\\]|\\\\.)*')",
    "(?<bullet>^[ \\t]*-(?=\\s))",
    "(?<keyword>\\b(?:true|false|null|yes|no|on|off)\\b)",
    "(?<number>\\b\\d+(?:\\.\\d+)?\\b)",
  ].join("|"),
  "gm"
);

const JSON_REGEX = new RegExp(
  [
    "(?<key>\"(?:[^\"\\\\]|\\\\.)*\"(?=\\s*:))",
    "(?<string>\"(?:[^\"\\\\]|\\\\.)*\")",
    "(?<number>-?\\b\\d+(?:\\.\\d+)?(?:[eE][+-]?\\d+)?\\b)",
    "(?<keyword>\\b(?:true|false|null)\\b)",
    "(?<punct>[{}\\[\\],:])",
  ].join("|"),
  "g"
);

const MARKDOWN_REGEX = new RegExp(
  [
    "(?<separator>^---+\\s*$)",
    "(?<heading>^#{1,6}\\s+[^\\n]*)",
    "(?<bullet>^[ \\t]*(?:[-*+]|\\d+\\.)\\s)",
    "(?<code>`[^`\\n]+`)",
    "(?<link>\\[[^\\]\\n]+\\]\\([^)\\n]+\\))",
    "(?<bold>\\*\\*[^*\\n]+\\*\\*)",
    "(?<tag><[/!]?[\\w_-]+[^>\\n]*>)",
  ].join("|"),
  "gm"
);

const CONFIG_REGEX = new RegExp(
  [
    "(?<comment>#[^\\n]*)",
    "(?<string>\"(?:[^\"\\\\]|\\\\.)*\")",
    "(?<directive>(?<=^|\\s)(?:reverse_proxy|server|server_name|listen|ssl_certificate(?:_key)?|ssl_protocols|proxy_pass|proxy_http_version|proxy_set_header|location|header|return|include|upstream|user|worker_processes|events|http|tailscale|host|bind|port)(?=\\s|;))",
    "(?<var>\\$[A-Za-z_]\\w*)",
    "(?<url>https?:\\/\\/[^\\s;]+)",
    "(?<host>\\b[a-z][\\w-]*(?:\\.[a-z][\\w-]*)+(?::\\d+)?\\b)",
    "(?<path>(?<=^|\\s)\\/[\\w./~-]+)",
    "(?<number>\\b\\d+\\b)",
    "(?<punct>[{};])",
  ].join("|"),
  "gm"
);

const TEXT_REGEX = new RegExp(
  [
    "(?<success>[✓✔])",
    "(?<danger>[✗✘✕])",
    "(?<operator>[→↑↓←↪])",
    "(?<url>https?:\\/\\/[^\\s`\"']+)",
    "(?<version>\\bv?\\d+\\.\\d+(?:\\.\\d+)?(?:\\.x)?\\b)",
  ].join("|"),
  "g"
);

function regexFor(language?: string): RegExp | null {
  switch ((language ?? "").toLowerCase()) {
    case "bash":
    case "shell":
    case "sh":
    case "zsh":
      return BASH_REGEX;
    case "yaml":
    case "yml":
      return YAML_REGEX;
    case "json":
      return JSON_REGEX;
    case "markdown":
    case "md":
      return MARKDOWN_REGEX;
    case "nginx":
    case "caddy":
    case "caddyfile":
    case "config":
    case "conf":
      return CONFIG_REGEX;
    case "text":
    case "txt":
    case "output":
    case "":
    case undefined:
      return TEXT_REGEX;
    default:
      return TEXT_REGEX;
  }
}

function renderTokens(tokens: Token[]): ReactNode {
  return tokens.map((token, i) => {
    const color = token.name ? COLOR[token.name] : undefined;
    return color ? (
      <span key={i} style={{ color }}>
        {token.text}
      </span>
    ) : (
      <span key={i}>{token.text}</span>
    );
  });
}

export type CodeBlockProps = {
  language?: string;
  code: string;
  /** Show a `$` prompt on each non-empty line. Defaults to `true` for bash. */
  prompt?: boolean;
  /** Optional display label override. Defaults to `language` or `text`. */
  label?: string;
};

export function CodeBlock({ language, code, prompt, label }: CodeBlockProps) {
  const regex = regexFor(language);
  const showPrompt = prompt ?? (language === "bash" || language === "shell");
  const lines = code.split("\n");

  return (
    <div className="not-prose my-6 relative rounded-[12px] border border-white/[0.08] bg-[rgba(10,10,10,0.72)] overflow-hidden">
      <div className="flex items-center justify-between pl-5 pr-2 py-2 border-b border-white/[0.05]">
        <span className="text-[10.5px] font-mono uppercase tracking-[0.16em] text-[var(--dark-text-quaternary)]">
          {label ?? language ?? "text"}
        </span>
        <CopyButton
          text={code}
          ariaLabel="Copy code"
          className="h-7 w-7 flex items-center justify-center rounded-[6px] text-white/50 hover:text-white hover:bg-white/[0.06] transition-colors"
        />
      </div>
      <pre className="px-5 py-4 text-[12.5px] leading-[1.75] font-mono">
        <code className="block">
          {lines.map((line, i) => {
            const tokens = regex ? tokenize(line, regex) : [{ text: line }];
            const showPromptOnThisLine = showPrompt && line.trim().length > 0;
            return (
              <div
                key={i}
                className="flex items-start min-h-[1.4em] whitespace-pre-wrap break-words"
              >
                {showPrompt && (
                  <span
                    aria-hidden
                    className="select-none w-5 shrink-0 text-[var(--dark-text-quaternary)]"
                  >
                    {showPromptOnThisLine ? "$" : " "}
                  </span>
                )}
                <span className="flex-1 min-w-0 text-[var(--dark-text-secondary)]">
                  {renderTokens(tokens)}
                </span>
              </div>
            );
          })}
        </code>
      </pre>
    </div>
  );
}
