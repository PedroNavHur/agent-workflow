"use client";

import type { Edge, Node } from "@xyflow/react";

export const initialNodes: Node[] = [
  {
    id: "1",
    position: { x: 150, y: 80 },
    data: { label: "Start" },
    type: "input",
  },
  {
    id: "2",
    position: { x: 150, y: 260 },
    data: { label: "Enrich With AI" },
    type: "default",
  },
  {
    id: "3",
    position: { x: 150, y: 440 },
    data: { label: "Monitor Competitors" },
    type: "output",
  },
];

export const initialEdges: Edge[] = [
  { id: "e1-2", source: "1", target: "2", animated: true },
  { id: "e2-3", source: "2", target: "3" },
];
