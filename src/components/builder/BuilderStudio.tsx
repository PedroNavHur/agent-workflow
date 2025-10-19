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
  const [selectedEdgeId, setSelectedEdgeId] = useState<string | null>(null);
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
      const viewport = reactFlow.getViewport();
      const position = reactFlow.screenToFlowPosition
        ? reactFlow.screenToFlowPosition({
            x: event.clientX,
            y: event.clientY,
          })
        : {
            x: (event.clientX - bounds.left - viewport.x) / viewport.zoom,
            y: (event.clientY - bounds.top - viewport.y) / viewport.zoom,
          };

      const paletteItem = paletteMap.get(type);
      const label = paletteItem ? paletteItem.label : `Node ${nodes.length + 1}`;

      const newNodeId = `${type}-${window.crypto.randomUUID()}`;
      const newNode: Node = {
        id: newNodeId,
        type: "default",
        position,
        data: { label },
      };

      setNodes((nds) => nds.concat(newNode));
      setSelectedNodeId(newNodeId);
      setSelectedEdgeId(null);
    },
    [nodes.length, paletteMap, reactFlow, setNodes],
  );

  const onSelectionChange = useCallback(
    ({ nodes: selectedNodes, edges: selectedEdges }: OnSelectionChangeParams) => {
      const nodeId = selectedNodes && selectedNodes.length > 0
        ? selectedNodes[0]?.id ?? null
        : null;
      const edgeId = selectedEdges && selectedEdges.length > 0
        ? selectedEdges[0]?.id ?? null
        : null;

      setSelectedNodeId(nodeId);
      setSelectedEdgeId(nodeId ? null : edgeId);
    },
    [],
  );

  const removeSelectedNode = useCallback(() => {
    if (!selectedNodeId) return;
    setNodes((nds) => nds.filter((node) => node.id !== selectedNodeId));
    setEdges((eds) =>
      eds.filter(
        (edge) =>
          edge.source !== selectedNodeId && edge.target !== selectedNodeId,
      ),
    );
    setSelectedNodeId(null);
    setSelectedEdgeId(null);
  }, [selectedNodeId, setEdges, setNodes]);

  const removeSelectedEdge = useCallback(() => {
    if (!selectedEdgeId) return;
    setEdges((eds) => eds.filter((edge) => edge.id !== selectedEdgeId));
    setSelectedEdgeId(null);
  }, [selectedEdgeId, setEdges]);

  return (
    <div className="flex flex-1 overflow-hidden bg-base-200">
      <FlowLibrary items={palette} onDragStart={onDragStart} />
      <div className="relative flex flex-1 flex-col">
        {selectedNodeId || selectedEdgeId ? (
          <div className="absolute right-4 top-4 z-10 flex items-center gap-2 rounded-xl bg-base-100/95 px-3 py-2 shadow-lg shadow-base-300/50">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-base-content/60">
              {selectedNodeId ? "Node Selected" : "Connection Selected"}
            </span>
            {selectedNodeId ? (
              <button
                type="button"
                className="btn btn-error btn-xs text-error-content"
                onClick={removeSelectedNode}
              >
                Remove
              </button>
            ) : null}
            {selectedEdgeId ? (
              <button
                type="button"
                className="btn btn-error btn-xs text-error-content"
                onClick={removeSelectedEdge}
              >
                Remove
              </button>
            ) : null}
          </div>
        ) : null}
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
      <InspectorPanel
        selectedNodeId={selectedNodeId}
        selectedEdgeId={selectedEdgeId}
        onRemoveSelected={removeSelectedNode}
        onRemoveEdge={removeSelectedEdge}
      />
    </div>
  );
}
