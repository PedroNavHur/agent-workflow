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
    "flex min-w-[200px] flex-col gap-2 rounded-2xl border border-base-300 bg-base-200/95 p-4 text-base-content shadow-lg shadow-base-300/30 transition";
  const selectedClasses = selected
    ? " border-primary/60 shadow-primary/20"
    : "";
  const badgeBase =
    "flex h-10 w-10 items-center justify-center rounded-xl bg-base-300 text-base-content/80";

  return (
    <>
      <Handle
        type="target"
        position={Position.Top}
        className="reactflow-node-handle"
      />
      <div className={`${baseClasses}${selectedClasses}`}>
        <div className="flex items-center gap-3">
          <span
            className={`${badgeBase}${data.accentClass ? ` ${data.accentClass}` : ""}`}
          >
            {Icon ? <Icon className="h-5 w-5" /> : null}
          </span>
          <div className="flex flex-col">
            <span className="text-sm font-semibold leading-tight">
              {data.label}
            </span>
            {data.description ? (
              <span className="text-xs text-base-content/60">
                {data.description}
              </span>
            ) : null}
          </div>
        </div>
      </div>
      <Handle
        type="source"
        position={Position.Bottom}
        className="reactflow-node-handle"
      />
    </>
  );
}
