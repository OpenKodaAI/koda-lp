"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type Node = {
  id: string;
  label: string;
  sub: string;
  x: number;
  y: number;
  w: number;
  h: number;
  color: string;
  kind: "http" | "grpc" | "store" | "external" | "infra" | "client";
};

type Edge = {
  from: string;
  to: string;
  protocol: "http" | "grpc" | "sql" | "s3";
  animated?: boolean;
};

const NODES: Node[] = [
  // Clients / external
  { id: "operators", label: "Operators", sub: "Dashboard · CLI · API", x: 40, y: 40, w: 180, h: 56, color: "#9A9A9A", kind: "client" },
  { id: "end-users", label: "End users", sub: "Telegram · Web chat · Custom", x: 40, y: 120, w: 180, h: 56, color: "#9A9A9A", kind: "client" },

  // Control plane (HTTP)
  { id: "web", label: "Web (Next.js)", sub: ":3000 · operator dashboard", x: 270, y: 40, w: 230, h: 56, color: "#5b94ff", kind: "http" },
  { id: "control-plane", label: "Control plane", sub: ":8090 · /api/control-plane/*", x: 270, y: 120, w: 230, h: 56, color: "#5b94ff", kind: "http" },
  { id: "runtime-api", label: "Runtime API", sub: ":8090 · /api/runtime/*", x: 270, y: 200, w: 230, h: 56, color: "#7fbf8f", kind: "http" },

  // Internal gRPC runtime services
  { id: "runtime-kernel", label: "runtime-kernel", sub: ":50061 · tasks · env · terminals", x: 540, y: 120, w: 210, h: 56, color: "#7fbf8f", kind: "grpc" },
  { id: "memory", label: "memory", sub: ":50063 · recall · extract", x: 540, y: 200, w: 210, h: 56, color: "#c07a96", kind: "grpc" },
  { id: "retrieval", label: "retrieval", sub: ":50062 · knowledge search", x: 540, y: 280, w: 210, h: 56, color: "#c07a96", kind: "grpc" },
  { id: "artifact", label: "artifact", sub: ":50064 · ingest · evidence", x: 540, y: 360, w: 210, h: 56, color: "#e4b454", kind: "grpc" },
  { id: "security", label: "security", sub: ":50065 · validate · redact", x: 540, y: 40, w: 210, h: 56, color: "#df8794", kind: "grpc" },

  // External providers
  { id: "providers", label: "External providers", sub: "Anthropic · OpenAI · Gemini · Ollama · MCP", x: 790, y: 120, w: 220, h: 56, color: "#8f6ccf", kind: "external" },

  // Storage
  { id: "postgres", label: "Postgres", sub: "durable state + pgvector", x: 790, y: 260, w: 220, h: 56, color: "#5da9a3", kind: "store" },
  { id: "s3", label: "SeaweedFS", sub: ":8333 · S3-compatible objects", x: 790, y: 340, w: 220, h: 56, color: "#5da9a3", kind: "store" },

  // Infra
  { id: "docker", label: "Docker Compose", sub: "health · doctor · lifecycle", x: 40, y: 360, w: 180, h: 56, color: "#6A6A6A", kind: "infra" },
];

const EDGES: Edge[] = [
  { from: "operators", to: "web", protocol: "http" },
  { from: "operators", to: "control-plane", protocol: "http" },
  { from: "end-users", to: "runtime-api", protocol: "http", animated: true },
  { from: "web", to: "control-plane", protocol: "http" },
  { from: "web", to: "runtime-api", protocol: "http" },
  { from: "control-plane", to: "runtime-kernel", protocol: "grpc" },
  { from: "control-plane", to: "security", protocol: "grpc" },
  { from: "runtime-api", to: "runtime-kernel", protocol: "grpc", animated: true },
  { from: "runtime-kernel", to: "providers", protocol: "http", animated: true },
  { from: "runtime-kernel", to: "memory", protocol: "grpc" },
  { from: "runtime-kernel", to: "retrieval", protocol: "grpc" },
  { from: "runtime-kernel", to: "artifact", protocol: "grpc" },
  { from: "memory", to: "postgres", protocol: "sql", animated: true },
  { from: "retrieval", to: "postgres", protocol: "sql" },
  { from: "artifact", to: "postgres", protocol: "sql" },
  { from: "artifact", to: "s3", protocol: "s3", animated: true },
  { from: "control-plane", to: "postgres", protocol: "sql" },
  { from: "docker", to: "runtime-kernel", protocol: "http" },
  { from: "docker", to: "postgres", protocol: "http" },
];

const PROTOCOL_STYLE: Record<Edge["protocol"], { color: string; label: string }> = {
  http: { color: "#5b94ff", label: "HTTP" },
  grpc: { color: "#c07a96", label: "gRPC" },
  sql: { color: "#5da9a3", label: "SQL" },
  s3: { color: "#e4b454", label: "S3" },
};

function nodeById(id: string): Node {
  const node = NODES.find((n) => n.id === id);
  if (!node) throw new Error(`Unknown node: ${id}`);
  return node;
}

function edgePath(edge: Edge): { d: string; x1: number; y1: number; x2: number; y2: number } {
  const from = nodeById(edge.from);
  const to = nodeById(edge.to);
  const fromCenterX = from.x + from.w / 2;
  const fromCenterY = from.y + from.h / 2;
  const toCenterX = to.x + to.w / 2;
  const toCenterY = to.y + to.h / 2;
  const dx = toCenterX - fromCenterX;
  const dy = toCenterY - fromCenterY;
  let x1 = fromCenterX;
  let y1 = fromCenterY;
  let x2 = toCenterX;
  let y2 = toCenterY;
  if (Math.abs(dx) > Math.abs(dy)) {
    x1 = fromCenterX + (from.w / 2) * Math.sign(dx);
    x2 = toCenterX - (to.w / 2) * Math.sign(dx);
  } else {
    y1 = fromCenterY + (from.h / 2) * Math.sign(dy);
    y2 = toCenterY - (to.h / 2) * Math.sign(dy);
  }
  return { d: `M ${x1} ${y1} L ${x2} ${y2}`, x1, y1, x2, y2 };
}

const VIEW_WIDTH = 1060;
const VIEW_HEIGHT = 440;

export function ArchitectureDiagram() {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const draggingRef = useRef<{ x: number; y: number } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const connectedIds = new Set<string>();
  if (hoveredId) {
    connectedIds.add(hoveredId);
    for (const e of EDGES) {
      if (e.from === hoveredId) connectedIds.add(e.to);
      if (e.to === hoveredId) connectedIds.add(e.from);
    }
  }

  const reset = useCallback(() => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  }, []);

  const onWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.92 : 1.08;
    setZoom((z) => Math.max(0.5, Math.min(2.4, z * delta)));
  }, []);

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest("[data-node]")) return;
    draggingRef.current = { x: e.clientX - pan.x, y: e.clientY - pan.y };
  }, [pan]);

  useEffect(() => {
    function onMove(e: MouseEvent) {
      if (!draggingRef.current) return;
      setPan({ x: e.clientX - draggingRef.current.x, y: e.clientY - draggingRef.current.y });
    }
    function onUp() {
      draggingRef.current = null;
    }
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, []);

  return (
    <div className="not-prose my-8 rounded-[14px] border border-white/[0.08] bg-[rgba(255,255,255,0.02)] overflow-hidden">
      <div className="flex items-center justify-between border-b border-white/[0.06] px-5 py-3">
        <span className="text-[11px] font-mono uppercase tracking-[0.16em] text-[var(--dark-text-tertiary)]">
          Architecture
        </span>
        <div className="flex items-center gap-4">
          <LegendDot color="#5b94ff" label="HTTP" />
          <LegendDot color="#c07a96" label="gRPC" />
          <LegendDot color="#5da9a3" label="SQL/S3" />
          <button
            type="button"
            onClick={reset}
            className="h-7 px-2.5 rounded-[6px] text-[10.5px] font-mono uppercase tracking-[0.12em] text-[var(--dark-text-quaternary)] hover:text-[var(--dark-text-primary)] hover:bg-white/[0.06] transition-colors"
          >
            Reset
          </button>
        </div>
      </div>

      <div
        ref={containerRef}
        className="relative select-none cursor-grab active:cursor-grabbing"
        onWheel={onWheel}
        onMouseDown={onMouseDown}
        style={{ height: "440px" }}
      >
        <svg
          viewBox={`0 0 ${VIEW_WIDTH} ${VIEW_HEIGHT}`}
          preserveAspectRatio="xMidYMid meet"
          className="absolute inset-0 w-full h-full"
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            transformOrigin: "center center",
            transition: draggingRef.current ? "none" : "transform 180ms ease",
          }}
          role="img"
          aria-label="Koda architecture: clients connect to HTTP surfaces; control plane and runtime call internal gRPC services; gRPC services persist to Postgres and S3; runtime calls external providers."
        >
          <defs>
            <marker id="arch-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
              <path d="M0,0 L10,5 L0,10 z" fill="rgba(255,255,255,0.35)" />
            </marker>
          </defs>

          {EDGES.map((edge) => {
            const { d, x1, y1, x2, y2 } = edgePath(edge);
            const active = hoveredId && (edge.from === hoveredId || edge.to === hoveredId);
            const color = active ? PROTOCOL_STYLE[edge.protocol].color : "rgba(255,255,255,0.1)";
            const strokeWidth = active ? 1.3 : 0.9;
            const dasharray = active ? "none" : "3 3";
            return (
              <g key={`${edge.from}-${edge.to}`}>
                <path
                  d={d}
                  stroke={color}
                  strokeWidth={strokeWidth}
                  strokeDasharray={dasharray}
                  fill="none"
                  markerEnd="url(#arch-arrow)"
                  style={{ transition: "stroke 180ms ease" }}
                />
                {edge.animated && (
                  <circle
                    r={2.2}
                    fill={PROTOCOL_STYLE[edge.protocol].color}
                    opacity={0.9}
                  >
                    <animate
                      attributeName="cx"
                      values={`${x1};${x2}`}
                      dur="3s"
                      repeatCount="indefinite"
                    />
                    <animate
                      attributeName="cy"
                      values={`${y1};${y2}`}
                      dur="3s"
                      repeatCount="indefinite"
                    />
                    <animate
                      attributeName="opacity"
                      values="0;0.9;0.9;0"
                      dur="3s"
                      repeatCount="indefinite"
                    />
                  </circle>
                )}
              </g>
            );
          })}

          {NODES.map((node) => {
            const isHovered = hoveredId === node.id;
            const isDimmed = hoveredId && !connectedIds.has(node.id);
            return (
              <g
                key={node.id}
                data-node
                onMouseEnter={() => setHoveredId(node.id)}
                onMouseLeave={() => setHoveredId(null)}
                style={{
                  opacity: isDimmed ? 0.35 : 1,
                  transition: "opacity 180ms ease",
                  cursor: "default",
                }}
              >
                <rect
                  x={node.x}
                  y={node.y}
                  width={node.w}
                  height={node.h}
                  rx={9}
                  fill="rgba(12,12,12,0.7)"
                  stroke={isHovered ? node.color : "rgba(255,255,255,0.1)"}
                  strokeWidth={isHovered ? 1.4 : 1}
                  style={{ transition: "stroke 180ms ease, stroke-width 180ms ease" }}
                />
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
                  x={node.x + 12}
                  y={node.y + 22}
                  fill="#F5F5F5"
                  fontSize={12}
                  fontWeight={600}
                  fontFamily="var(--font-inter), system-ui"
                >
                  {node.label}
                </text>
                <text
                  x={node.x + 12}
                  y={node.y + 40}
                  fill="#9A9A9A"
                  fontSize={10.5}
                  fontFamily="var(--font-inter), system-ui"
                >
                  {node.sub}
                </text>
              </g>
            );
          })}
        </svg>

        <div className="absolute bottom-3 right-3 flex items-center rounded-[8px] bg-black/60 backdrop-blur-md border border-white/[0.08] overflow-hidden">
          <button
            type="button"
            onClick={() => setZoom((z) => Math.max(0.5, z * 0.87))}
            className="h-7 w-7 flex items-center justify-center text-[var(--dark-text-tertiary)] hover:text-[var(--dark-text-primary)] hover:bg-white/[0.06] transition-colors"
            aria-label="Zoom out"
          >
            <svg width="11" height="11" viewBox="0 0 14 14" fill="none" aria-hidden>
              <path d="M2 7h10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
            </svg>
          </button>
          <span className="px-2 h-7 flex items-center text-[10px] font-mono text-[var(--dark-text-quaternary)] tabular-nums border-x border-white/[0.06]">
            {Math.round(zoom * 100)}
          </span>
          <button
            type="button"
            onClick={() => setZoom((z) => Math.min(2.4, z * 1.15))}
            className="h-7 w-7 flex items-center justify-center text-[var(--dark-text-tertiary)] hover:text-[var(--dark-text-primary)] hover:bg-white/[0.06] transition-colors"
            aria-label="Zoom in"
          >
            <svg width="11" height="11" viewBox="0 0 14 14" fill="none" aria-hidden>
              <path d="M7 2v10M2 7h10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-[10.5px] font-mono text-[var(--dark-text-tertiary)]">
      <span className="h-1.5 w-1.5 rounded-full" style={{ background: color }} />
      {label}
    </span>
  );
}
