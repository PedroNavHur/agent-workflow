"use client";

import {
  Background,
  Connection,
  Controls,
  Edge,
  MiniMap,
  Node,
  ReactFlow,
  addEdge,
  useEdgesState,
  useNodesState,
  useReactFlow,
} from "@xyflow/react";
import type { DragEvent } from "react";
import { useCallback, useMemo, useRef, useState } from "react";
import type { OnSelectionChangeParams } from "@xyflow/react";
import { FlowLibrary } from "./FlowLibrary";
import { InspectorPanel } from "./InspectorPanel";
import { palette } from "./palette";
import { initialEdges, initialNodes } from "./initialFlow";

type PaletteMap = Map<string, (typeof palette)[number]>;

export function BuilderStudio() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const reactFlow = useReactFlow();

  const paletteMap: PaletteMap = useMemo(
    () => new Map(palette.map((item) => [item.id, item])),
    [],
  );

  const onConnect = useCallback(
    (params: Edge | Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

  const onDragStart = useCallback(
    (event: DragEvent<HTMLButtonElement>, type: string) => {
      event.dataTransfer.setData("application/reactflow", type);
      event.dataTransfer.effectAllowed = "move";
    },
    [],
  );

  const onDragOver = useCallback((event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event: DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      const type = event.dataTransfer.getData("application/reactflow");
      if (!type || !wrapperRef.current) return;

      const bounds = wrapperRef.current.getBoundingClientRect();
      const position = reactFlow.project({
        x: event.clientX - bounds.left,
        y: event.clientY - bounds.top,
      });

      const paletteItem = paletteMap.get(type);
      const label = paletteItem ? paletteItem.label : `Node ${nodes.length + 1}`;

      const newNode: Node = {
        id: `${type}-${Date.now()}`,
        type: "default",
        position,
        data: { label },
      };

      setNodes((nds) => nds.concat(newNode));
      setSelectedNodeId(newNode.id);
    },
    [nodes.length, paletteMap, reactFlow, setNodes],
  );

  const onSelectionChange = useCallback(
    ({ nodes: selectedNodes }: OnSelectionChangeParams) => {
      if (!selectedNodes || selectedNodes.length === 0) {
        setSelectedNodeId(null);
        return;
      }
      setSelectedNodeId(selectedNodes[0]?.id ?? null);
    },
    [],
  );

  return (
    <div className="flex flex-1 overflow-hidden bg-base-200">
      <FlowLibrary items={palette} onDragStart={onDragStart} />
      <div className="relative flex flex-1 flex-col">
        <div
          ref={wrapperRef}
          className="relative flex-1 border-x border-base-300"
          onDrop={onDrop}
          onDragOver={onDragOver}
        >
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onDrop={onDrop}
            onDragOver={onDragOver}
            onSelectionChange={onSelectionChange}
            fitView
            panOnScroll
            zoomOnScroll
            className="reactflow-surface bg-base-300"
          >
            <MiniMap className="reactflow-minimap" />
            <Controls className="reactflow-controls" />
            <Background
              color="color-mix(in oklab, var(--color-base-content) 12%, transparent)"
              gap={28}
              size={2}
              variant="dots"
            />
          </ReactFlow>
        </div>
      </div>
      <InspectorPanel selectedNodeId={selectedNodeId} />
    </div>
  );
}
