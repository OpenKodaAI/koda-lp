"use client";

import { useState } from "react";

type Stage = {
  id: string;
  label: string;
  detail: string;
  layer: string;
  color: string;
};

const STAGES: Stage[] = [
  {
    id: "intake",
    label: "Intake",
    detail:
      "Request reaches the platform through a supported interface (Telegram, dashboard, API).",
    layer: "Handler",
    color: "#5b94ff",
  },
  {
    id: "normalize",
    label: "Normalize",
    detail:
      "Handlers normalize input and enforce user access, then route into orchestration.",
    layer: "Handler",
    color: "#5b94ff",
  },
  {
    id: "resolve",
    label: "Resolve",
    detail:
      "Queue manager resolves the active agent, provider, prompt contract, and runtime context.",
    layer: "Queue",
    color: "#7fbf8f",
  },
  {
    id: "assemble",
    label: "Assemble",
    detail:
      "Memory recall, knowledge retrieval, and artifact context are gathered in parallel.",
    layer: "Context",
    color: "#c07a96",
  },
  {
    id: "execute",
    label: "Execute",
    detail:
      "The selected provider runs the task, streaming responses and optionally entering a tool loop.",
    layer: "Provider",
    color: "#8f6ccf",
  },
  {
    id: "tools",
    label: "Tool loop",
    detail:
      "<agent_cmd> tags are parsed, validated, executed, and surfaced back as <tool_result> tags.",
    layer: "Runtime",
    color: "#e4b454",
  },
  {
    id: "persist",
    label: "Persist",
    detail:
      "Results, artifacts, memory writes, and audit records land in Postgres and object storage.",
    layer: "State",
    color: "#5da9a3",
  },
];

export function RuntimeFlowDiagram() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div className="not-prose my-8 rounded-[14px] border border-white/[0.08] bg-[rgba(255,255,255,0.02)]">
      <div className="px-5 py-3 border-b border-white/[0.06]">
        <span className="text-[11px] font-mono uppercase tracking-[0.16em] text-[var(--dark-text-tertiary)]">
          Runtime execution lifecycle
        </span>
      </div>

      <ol className="flex flex-col px-5 py-6">
        {STAGES.map((stage, index) => {
          const isHovered = hoveredIndex === index;
          const isLast = index === STAGES.length - 1;
          return (
            <li
              key={stage.id}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              className="relative pl-10"
            >
              {/* Vertical connector line */}
              {!isLast && (
                <span
                  aria-hidden
                  className="absolute left-[11px] top-7 bottom-0 w-px bg-white/[0.08]"
                />
              )}

              {/* Step dot with layer color */}
              <span
                aria-hidden
                className="absolute left-0 top-1 h-6 w-6 flex items-center justify-center rounded-full border bg-[var(--dark-canvas)] transition-colors duration-200"
                style={{
                  borderColor: isHovered
                    ? stage.color
                    : "rgba(255,255,255,0.14)",
                }}
              >
                <span
                  className="h-2 w-2 rounded-full transition-opacity duration-200"
                  style={{
                    backgroundColor: stage.color,
                    opacity: isHovered ? 1 : 0.7,
                  }}
                />
              </span>

              {/* Content */}
              <div className={`pb-6 ${isLast ? "pb-0" : ""}`}>
                <div className="flex flex-wrap items-center gap-2 text-[10.5px] font-mono uppercase tracking-[0.14em] text-[var(--dark-text-quaternary)] mb-1">
                  <span className="tabular-nums">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="opacity-50">·</span>
                  <span style={{ color: isHovered ? stage.color : undefined }}>
                    {stage.layer}
                  </span>
                </div>
                <div className="text-[15px] font-semibold text-[var(--dark-text-primary)] leading-snug mb-1.5 tracking-[-0.005em]">
                  {stage.label}
                </div>
                <div className="text-[13.5px] leading-[1.6] text-[var(--dark-text-secondary)] max-w-[640px]">
                  {stage.detail}
                </div>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
