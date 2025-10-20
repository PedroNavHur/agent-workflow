"use client";

import type { Edge } from "@xyflow/react";
import { Brain, LineChart, Workflow } from "lucide-react";
import type { BuilderNodeInstance } from "./BuilderNode";

export const initialNodes: BuilderNodeInstance[] = [
  {
    id: "1",
    position: { x: 150, y: 80 },
    data: {
      label: "Flow Entry",
      description: "Configure when this automation triggers.",
      icon: Workflow,
      accentClass: "bg-primary/10 text-primary",
      kind: "flow-entry",
    },
    type: "builder",
  },
  {
    id: "2",
    position: { x: 150, y: 260 },
    data: {
      label: "Enrich With AI",
      description: "Summarize findings with Kompyra models.",
      icon: Brain,
      accentClass: "bg-secondary/10 text-secondary",
      kind: "ai-summary",
      config: {
        aiSummary: {
          model: "gpt-4o",
          prompt: "Summarize competitor updates from the past week.",
          outputSchema: '{"summary": string, "action_items": string[]}',
        },
      },
    },
    type: "builder",
  },
  {
    id: "3",
    position: { x: 150, y: 440 },
    data: {
      label: "Monitor Competitors",
      description: "Capture web changes and notify stakeholders.",
      icon: LineChart,
      accentClass: "bg-accent/10 text-accent",
      kind: "dashboard",
    },
    type: "builder",
  },
];

export const initialEdges: Edge[] = [
  { id: "e1-2", source: "1", target: "2", animated: true },
  { id: "e2-3", source: "2", target: "3" },
];
