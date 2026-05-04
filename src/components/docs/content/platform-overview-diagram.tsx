"use client";

import Link from "next/link";
import { useState } from "react";

type Node = {
  id: string;
  label: string;
  sub: string;
  x: number;
  y: number;
  w: number;
  h: number;
  href?: string;
  color: string;
};

const NODES: Node[] = [
  {
    id: "operators",
    label: "Operators & clients",
    sub: "Dashboard · CLI · API callers",
    x: 20,
    y: 30,
    w: 180,
    h: 64,
    color: "#9A9A9A",
  },
  {
    id: "control-plane",
    label: "Control plane",
    sub: "Providers · agents · secrets · policy",
    x: 230,
    y: 30,
    w: 200,
    h: 64,
    href: "/docs/concepts/control-plane",
    color: "#5b94ff",
  },
  {
    id: "providers",
    label: "External providers",
    sub: "Anthropic · OpenAI · Gemini · Ollama · more",
    x: 460,
    y: 30,
    w: 190,
    h: 64,
    color: "#8f6ccf",
  },
  {
    id: "runtime",
    label: "Runtime",
    sub: "Queue · execution · supervision",
    x: 230,
    y: 140,
    w: 200,
    h: 64,
    href: "/docs/concepts/runtime",
    color: "#7fbf8f",
  },
  {
    id: "memory",
    label: "Memory & knowledge",
    sub: "Retrieval · recall · evidence",
    x: 460,
    y: 140,
    w: 190,
    h: 64,
    href: "/docs/concepts/memory",
    color: "#c07a96",
  },
  {
    id: "storage",
    label: "Durable storage",
    sub: "Postgres · S3-compatible object store",
    x: 230,
    y: 250,
    w: 420,
    h: 60,
    color: "#5da9a3",
  },
  {
    id: "infra",
    label: "Infrastructure",
    sub: "Docker Compose · health checks · doctor",
    x: 20,
    y: 250,
    w: 180,
    h: 60,
    color: "#6A6A6A",
  },
];

type Edge = {
  from: string;
  to: string;
};

const EDGES: Edge[] = [
  { from: "operators", to: "control-plane" },
  { from: "control-plane", to: "providers" },
  { from: "control-plane", to: "runtime" },
  { from: "runtime", to: "memory" },
  { from: "runtime", to: "storage" },
  { from: "memory", to: "storage" },
  { from: "infra", to: "runtime" },
  { from: "infra", to: "storage" },
];

function nodeById(id: string): Node {
  const node = NODES.find((n) => n.id === id);
  if (!node) throw new Error(`Unknown node: ${id}`);
  return node;
}

function edgePath(edge: Edge): string {
  const from = nodeById(edge.from);
  const to = nodeById(edge.to);
  const fromCenterX = from.x + from.w / 2;
  const fromCenterY = from.y + from.h / 2;
  const toCenterX = to.x + to.w / 2;
  const toCenterY = to.y + to.h / 2;

  // Attach the line to the edge of the source and target rectangles
  const dx = toCenterX - fromCenterX;
  const dy = toCenterY - fromCenterY;
  const absDx = Math.abs(dx);
  const absDy = Math.abs(dy);

  let x1 = fromCenterX;
  let y1 = fromCenterY;
  let x2 = toCenterX;
  let y2 = toCenterY;

  if (absDx > absDy) {
    x1 = fromCenterX + (from.w / 2) * Math.sign(dx);
    x2 = toCenterX - (to.w / 2) * Math.sign(dx);
  } else {
    y1 = fromCenterY + (from.h / 2) * Math.sign(dy);
    y2 = toCenterY - (to.h / 2) * Math.sign(dy);
  }

  return `M ${x1} ${y1} L ${x2} ${y2}`;
}

export function PlatformOverviewDiagram() {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const connectedToHovered = new Set<string>();
  if (hoveredId) {
    connectedToHovered.add(hoveredId);
    for (const edge of EDGES) {
      if (edge.from === hoveredId) connectedToHovered.add(edge.to);
      if (edge.to === hoveredId) connectedToHovered.add(edge.from);
    }
  }

  return (
    <div className="not-prose my-8 rounded-[12px] border border-white/[0.06] bg-[rgba(255,255,255,0.02)] p-5">
      <div className="mb-3 text-[11px] font-mono uppercase tracking-[0.16em] text-[var(--dark-text-tertiary)]">
        Platform overview
      </div>
      <svg
        viewBox="0 0 670 340"
        className="w-full h-auto"
        role="img"
        aria-label="Koda platform topology: operators connect to the control plane, which configures the runtime; runtime uses memory and durable storage; external providers are reached through the runtime."
      >
        <defs>
          <marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M0,0 L10,5 L0,10 z" fill="rgba(255,255,255,0.35)" />
          </marker>
          <marker id="arrow-active" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M0,0 L10,5 L0,10 z" fill="#5b94ff" />
          </marker>
        </defs>

        {EDGES.map((edge) => {
          const active =
            hoveredId &&
            (edge.from === hoveredId || edge.to === hoveredId);
          return (
            <path
              key={`${edge.from}-${edge.to}`}
              d={edgePath(edge)}
              stroke={active ? "#5b94ff" : "rgba(255,255,255,0.12)"}
              strokeWidth={active ? 1.5 : 1}
              strokeDasharray={active ? "none" : "4 4"}
              fill="none"
              markerEnd={active ? "url(#arrow-active)" : "url(#arrow)"}
              style={{ transition: "stroke 180ms ease, stroke-width 180ms ease" }}
            />
          );
        })}

        {NODES.map((node) => {
          const isHovered = hoveredId === node.id;
          const isDimmed = hoveredId && !connectedToHovered.has(node.id);
          const NodeWrapper = node.href ? "a" : "g";
          const nodeProps = node.href
            ? { href: node.href, className: "cursor-pointer" }
            : {};
          return (
            <g
              key={node.id}
              onMouseEnter={() => setHoveredId(node.id)}
              onMouseLeave={() => setHoveredId(null)}
              style={{
                opacity: isDimmed ? 0.4 : 1,
                transition: "opacity 180ms ease",
              }}
            >
              <NodeWrapper {...nodeProps}>
                {/* Card body */}
                <rect
                  x={node.x}
                  y={node.y}
                  width={node.w}
                  height={node.h}
                  rx={10}
                  fill="rgba(255,255,255,0.03)"
                  stroke={isHovered ? node.color : "rgba(255,255,255,0.1)"}
                  strokeWidth={isHovered ? 1.5 : 1}
                  style={{ transition: "stroke 180ms ease, stroke-width 180ms ease" }}
                />
                {/* Left-side colored accent — inset from corners so it doesn't fight the rounded radius */}
                <rect
                  x={node.x + 4}
                  y={node.y + 8}
                  width={3}
                  height={node.h - 16}
                  rx={1.5}
                  fill={node.color}
                  opacity={isHovered ? 0.95 : 0.6}
                  style={{ transition: "opacity 180ms ease" }}
                />
                <text
                  x={node.x + 14}
                  y={node.y + 26}
                  fill="#F5F5F5"
                  fontSize={13}
                  fontWeight={600}
                  fontFamily="var(--font-inter), system-ui"
                >
                  {node.label}
                </text>
                <text
                  x={node.x + 14}
                  y={node.y + 44}
                  fill="#9A9A9A"
                  fontSize={11}
                  fontFamily="var(--font-inter), system-ui"
                >
                  {node.sub}
                </text>
                {node.href && (
                  <text
                    x={node.x + node.w - 14}
                    y={node.y + 22}
                    textAnchor="end"
                    fill="#6A6A6A"
                    fontSize={10}
                    fontFamily="var(--font-jetbrains), monospace"
                  >
                    →
                  </text>
                )}
              </NodeWrapper>
            </g>
          );
        })}
      </svg>

      <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-[11px] font-mono text-[var(--dark-text-tertiary)]">
        {NODES.filter((n) => n.href).map((n) => (
          <Link
            key={n.id}
            href={n.href!}
            className="inline-flex items-center gap-1.5 hover:text-[var(--dark-text-primary)] transition-colors"
          >
            <span
              className="h-1.5 w-1.5 rounded-full"
              style={{ background: n.color }}
            />
            {n.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
