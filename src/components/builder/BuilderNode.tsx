"use client";

import type { Node, NodeProps } from "@xyflow/react";
import { Handle, Position } from "@xyflow/react";
import type { ComponentType } from "react";

export type WebScrapeConfig = {
  url: string;
  selector: string;
  schedule: "hourly" | "daily" | "weekly";
};

export type AiSummaryConfig = {
  model: "gpt-4o" | "claude-3-opus" | "llama-3";
  prompt: string;
  outputSchema: string;
};

export type BuilderNodeData = {
  label: string;
  description?: string;
  icon?: ComponentType<{ className?: string }>;
  accentClass?: string;
  kind?: string;
  status?: string;
  config?: {
    webScrape?: WebScrapeConfig;
    aiSummary?: AiSummaryConfig;
    [key: string]: unknown;
  };
};

export type BuilderNodeInstance = Node<BuilderNodeData, "builder">;

export function BuilderNode({
  data,
  selected,
}: NodeProps<BuilderNodeInstance>) {
  const Icon = data.icon;
  const baseClasses =
    "group flex min-w-[240px] items-center gap-4 rounded-full border border-dashed border-base-300 bg-base-200/80 px-5 py-3 text-base-content shadow-sm shadow-base-300/40 transition hover:border-base-200";
  const selectedClasses = selected
    ? " border-solid border-primary/60 bg-base-200 shadow-primary/30"
    : "";
  const iconShell =
    "flex h-10 w-10 items-center justify-center rounded-full bg-base-300/80 text-base-content/80";
  const statusBadge = data.status ?? "Idle";

  return (
    <>
      <Handle
        type="target"
        position={Position.Top}
        className="reactflow-node-handle"
      />
      <div className={`${baseClasses}${selectedClasses}`}>
        <span
          className={`${iconShell}${data.accentClass ? ` ${data.accentClass}` : ""}`}
        >
          {Icon ? <Icon className="h-4 w-4" /> : null}
        </span>
        <div className="flex flex-1 flex-col">
          <span className="text-sm font-semibold leading-tight">
            {data.label}
          </span>
          {data.description ? (
            <span className="text-xs text-base-content/60">
              {data.description}
            </span>
          ) : null}
        </div>
        <span className="badge badge-sm badge-ghost px-3 py-2 text-xs uppercase tracking-[0.2em] text-base-content/80">
          {statusBadge}
        </span>
      </div>
      <Handle
        type="source"
        position={Position.Bottom}
        className="reactflow-node-handle"
      />
    </>
  );
}
