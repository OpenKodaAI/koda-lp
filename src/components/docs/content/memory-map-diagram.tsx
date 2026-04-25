"use client";

import { useState } from "react";

type MemNode = {
  id: string;
  label: string;
  type: "FACT" | "EVENT" | "PREFERENCE" | "DECISION" | "PROBLEM" | "PROCEDURE" | "TASK" | "RELATIONSHIP" | "COMMIT";
  cluster: string;
  x: number;
  y: number;
  size?: number;
  importance: number; // 0-1
};

type MemEdge = {
  from: string;
  to: string;
  kind: "similar" | "supersedes" | "supports" | "contradicts";
  weight: number; // 0-1
};

const TYPE_COLOR: Record<MemNode["type"], string> = {
  FACT: "#5da9a3",
  EVENT: "#6e97d9",
  PREFERENCE: "#c07a96",
  DECISION: "#8f6ccf",
  PROBLEM: "#df8794",
  PROCEDURE: "#7fbf8f",
  TASK: "#e4b454",
  RELATIONSHIP: "#b59cf0",
  COMMIT: "#88b4e0",
};

const EDGE_COLOR: Record<MemEdge["kind"], string> = {
  similar: "rgba(255,255,255,0.2)",
  supersedes: "rgba(143,108,207,0.55)",
  supports: "rgba(127,191,143,0.5)",
  contradicts: "rgba(223,135,148,0.55)",
};

const NODES: MemNode[] = [
  // auth cluster
  { id: "m1", label: "Bootstrap uses loopback trust on dev", type: "FACT", cluster: "auth", x: 120, y: 80, importance: 0.9 },
  { id: "m2", label: "Password minimum is 12 chars", type: "DECISION", cluster: "auth", x: 220, y: 130, importance: 0.85 },
  { id: "m3", label: "Recovery codes are one-shot", type: "DECISION", cluster: "auth", x: 170, y: 190, importance: 0.95 },
  { id: "m4", label: "Session cookie uses SameSite=Strict", type: "FACT", cluster: "auth", x: 280, y: 220, importance: 0.6 },
  { id: "m5", label: "Login lockout after 5 failures", type: "FACT", cluster: "auth", x: 80, y: 160, importance: 0.7 },

  // runtime cluster
  { id: "m6", label: "runtime-kernel at :50061", type: "FACT", cluster: "runtime", x: 460, y: 90, importance: 0.8 },
  { id: "m7", label: "Tool loop parses <agent_cmd>", type: "PROCEDURE", cluster: "runtime", x: 560, y: 150, importance: 0.9 },
  { id: "m8", label: "Write ops need approval in supervised mode", type: "DECISION", cluster: "runtime", x: 500, y: 220, importance: 0.95 },
  { id: "m9", label: "Provider fallback degrades model tier", type: "PROCEDURE", cluster: "runtime", x: 400, y: 170, importance: 0.7 },
  { id: "m10", label: "Environments use git worktrees", type: "FACT", cluster: "runtime", x: 620, y: 80, importance: 0.6 },

  // memory cluster
  { id: "m11", label: "Recall is time-bounded at 3s", type: "FACT", cluster: "memory", x: 790, y: 110, importance: 0.85 },
  { id: "m12", label: "Memory types have TTL defaults", type: "PROCEDURE", cluster: "memory", x: 870, y: 170, importance: 0.8 },
  { id: "m13", label: "Conflict key scopes supersession", type: "PROCEDURE", cluster: "memory", x: 760, y: 210, importance: 0.75 },
  { id: "m14", label: "User retention cap is 2000 memories", type: "DECISION", cluster: "memory", x: 880, y: 250, importance: 0.65 },

  // knowledge cluster
  { id: "m15", label: "Retrieval uses RRF with K=60", type: "FACT", cluster: "knowledge", x: 310, y: 330, importance: 0.9 },
  { id: "m16", label: "Retrieval threshold is 0.35", type: "DECISION", cluster: "knowledge", x: 420, y: 360, importance: 0.7 },
  { id: "m17", label: "Graph hops default to 3", type: "FACT", cluster: "knowledge", x: 220, y: 370, importance: 0.6 },
  { id: "m18", label: "Evidence has 7 modality kinds", type: "FACT", cluster: "knowledge", x: 330, y: 410, importance: 0.55 },

  // ops cluster
  { id: "m19", label: "Doctor checks before install", type: "EVENT", cluster: "ops", x: 680, y: 370, importance: 0.7 },
  { id: "m20", label: "Audit events always emit security.*", type: "FACT", cluster: "ops", x: 580, y: 340, importance: 0.8 },
  { id: "m21", label: "Digest job runs daily at hour 3", type: "EVENT", cluster: "ops", x: 770, y: 330, importance: 0.5 },
];

const EDGES: MemEdge[] = [
  { from: "m1", to: "m5", kind: "similar", weight: 0.4 },
  { from: "m2", to: "m3", kind: "similar", weight: 0.7 },
  { from: "m2", to: "m4", kind: "supports", weight: 0.6 },
  { from: "m3", to: "m4", kind: "similar", weight: 0.5 },
  { from: "m6", to: "m7", kind: "similar", weight: 0.8 },
  { from: "m7", to: "m8", kind: "supports", weight: 0.9 },
  { from: "m7", to: "m9", kind: "similar", weight: 0.5 },
  { from: "m6", to: "m10", kind: "similar", weight: 0.6 },
  { from: "m11", to: "m12", kind: "supports", weight: 0.75 },
  { from: "m11", to: "m13", kind: "similar", weight: 0.5 },
  { from: "m12", to: "m14", kind: "supports", weight: 0.6 },
  { from: "m13", to: "m14", kind: "supersedes", weight: 0.4 },
  { from: "m15", to: "m16", kind: "supports", weight: 0.85 },
  { from: "m15", to: "m17", kind: "similar", weight: 0.6 },
  { from: "m16", to: "m18", kind: "similar", weight: 0.4 },
  { from: "m19", to: "m20", kind: "supports", weight: 0.5 },
  { from: "m20", to: "m21", kind: "similar", weight: 0.3 },
  { from: "m7", to: "m11", kind: "similar", weight: 0.4 },
  { from: "m2", to: "m15", kind: "similar", weight: 0.3 },
];

const CLUSTERS = [
  { id: "auth", label: "Auth / session", cx: 180, cy: 150, r: 120, color: "#5b94ff" },
  { id: "runtime", label: "Runtime execution", cx: 510, cy: 150, r: 140, color: "#7fbf8f" },
  { id: "memory", label: "Memory lifecycle", cx: 830, cy: 180, r: 120, color: "#c07a96" },
  { id: "knowledge", label: "Knowledge retrieval", cx: 320, cy: 370, r: 130, color: "#8f6ccf" },
  { id: "ops", label: "Operations", cx: 680, cy: 350, r: 110, color: "#e4b454" },
];

function nodeById(id: string): MemNode {
  const node = NODES.find((n) => n.id === id);
  if (!node) throw new Error(`Unknown node: ${id}`);
  return node;
}

export function MemoryMapDiagram() {
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  const [activeCluster, setActiveCluster] = useState<string | null>(null);

  const connectedIds = new Set<string>();
  if (hoveredNodeId) {
    connectedIds.add(hoveredNodeId);
    for (const edge of EDGES) {
      if (edge.from === hoveredNodeId) connectedIds.add(edge.to);
      if (edge.to === hoveredNodeId) connectedIds.add(edge.from);
    }
  }

  return (
    <div className="not-prose my-8 rounded-[14px] border border-white/[0.08] bg-[rgba(255,255,255,0.02)] overflow-hidden">
      <div className="flex items-center justify-between border-b border-white/[0.06] px-5 py-3">
        <span className="text-[11px] font-mono uppercase tracking-[0.16em] text-[var(--dark-text-tertiary)]">
          Memory map
        </span>
        <span className="text-[10.5px] font-mono text-[var(--dark-text-quaternary)]">
          21 · 5 clusters
        </span>
      </div>

      <div className="p-3">
        <svg
          viewBox="0 0 1000 460"
          className="w-full h-auto"
          role="img"
          aria-label="Memory map: 21 typed memories grouped into 5 clusters, with semantic edges showing similarity, supersession, and supporting relations."
        >
          <defs>
            <marker id="mem-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="4" markerHeight="4" orient="auto-start-reverse">
              <path d="M0,0 L10,5 L0,10 z" fill="rgba(255,255,255,0.3)" />
            </marker>
          </defs>

          {/* Clusters (background halos) */}
          {CLUSTERS.map((cluster) => {
            const isActive = activeCluster === cluster.id;
            return (
              <g
                key={cluster.id}
                onMouseEnter={() => setActiveCluster(cluster.id)}
                onMouseLeave={() => setActiveCluster(null)}
                style={{ cursor: "default" }}
              >
                <circle
                  cx={cluster.cx}
                  cy={cluster.cy}
                  r={cluster.r}
                  fill={cluster.color}
                  opacity={isActive ? 0.07 : 0.04}
                  style={{ transition: "opacity 180ms ease" }}
                />
                <text
                  x={cluster.cx}
                  y={cluster.cy - cluster.r + 14}
                  textAnchor="middle"
                  fill={cluster.color}
                  fontSize={11}
                  fontWeight={600}
                  fontFamily="var(--font-jetbrains), monospace"
                  opacity={0.9}
                  style={{ pointerEvents: "none" }}
                >
                  {cluster.label.toLowerCase()}
                </text>
              </g>
            );
          })}

          {/* Edges */}
          {EDGES.map((edge) => {
            const from = nodeById(edge.from);
            const to = nodeById(edge.to);
            const active =
              hoveredNodeId &&
              (edge.from === hoveredNodeId || edge.to === hoveredNodeId);
            const dim = hoveredNodeId && !active;
            return (
              <line
                key={`${edge.from}-${edge.to}`}
                x1={from.x}
                y1={from.y}
                x2={to.x}
                y2={to.y}
                stroke={active ? EDGE_COLOR[edge.kind] : "rgba(255,255,255,0.08)"}
                strokeWidth={active ? 1.4 : 0.8}
                strokeDasharray={edge.kind === "similar" ? "3 3" : "none"}
                opacity={dim ? 0.3 : 1}
                markerEnd={edge.kind === "supersedes" ? "url(#mem-arrow)" : undefined}
                style={{ transition: "stroke 180ms ease, opacity 180ms ease" }}
              />
            );
          })}

          {/* Memory nodes */}
          {NODES.map((node) => {
            const isHovered = hoveredNodeId === node.id;
            const isConnected = hoveredNodeId && connectedIds.has(node.id);
            const isDimmed = hoveredNodeId && !isConnected;
            const radius = 6 + node.importance * 5;
            return (
              <g
                key={node.id}
                onMouseEnter={() => setHoveredNodeId(node.id)}
                onMouseLeave={() => setHoveredNodeId(null)}
                style={{
                  opacity: isDimmed ? 0.25 : 1,
                  transition: "opacity 180ms ease",
                  cursor: "default",
                }}
              >
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={radius + (isHovered ? 3 : 0)}
                  fill={TYPE_COLOR[node.type]}
                  opacity={0.18}
                  style={{ transition: "r 180ms ease" }}
                />
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={radius}
                  fill="#0C0C0C"
                  stroke={TYPE_COLOR[node.type]}
                  strokeWidth={isHovered ? 2 : 1.3}
                  style={{ transition: "stroke-width 180ms ease" }}
                />
                {isHovered && (
                  <g style={{ pointerEvents: "none" }}>
                    <rect
                      x={node.x + radius + 6}
                      y={node.y - 18}
                      rx={6}
                      height={36}
                      width={Math.min(Math.max(node.label.length * 6.2 + 24, 160), 300)}
                      fill="#141210"
                      stroke={TYPE_COLOR[node.type]}
                      strokeWidth={1}
                    />
                    <text
                      x={node.x + radius + 16}
                      y={node.y - 2}
                      fill="#F5F5F5"
                      fontSize={11.5}
                      fontFamily="var(--font-inter), system-ui"
                      fontWeight={500}
                    >
                      {node.label}
                    </text>
                    <text
                      x={node.x + radius + 16}
                      y={node.y + 12}
                      fill={TYPE_COLOR[node.type]}
                      fontSize={9.5}
                      fontFamily="var(--font-jetbrains), monospace"
                      letterSpacing="0.1em"
                    >
                      {node.type} · importance {node.importance.toFixed(2)}
                    </text>
                  </g>
                )}
              </g>
            );
          })}
        </svg>

        <div className="flex flex-wrap gap-x-4 gap-y-1.5 mt-3 px-2 text-[10.5px] font-mono text-[var(--dark-text-tertiary)]">
          {Object.entries(TYPE_COLOR).map(([type, color]) => (
            <span key={type} className="inline-flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full" style={{ background: color }} />
              {type.toLowerCase()}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
