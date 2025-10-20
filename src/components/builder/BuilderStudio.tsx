"use client";

import type {
  Connection,
  Edge,
  NodeTypes,
  OnSelectionChangeParams,
} from "@xyflow/react";
import {
  addEdge,
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
  ReactFlow,
  useEdgesState,
  useNodesState,
  useReactFlow,
} from "@xyflow/react";
import { MonitorDot } from "lucide-react";
import type { DragEvent } from "react";
import { useCallback, useMemo, useRef, useState } from "react";
import {
  type AiSummaryConfig,
  BuilderNode,
  type BuilderNodeInstance,
  type WebScrapeConfig,
} from "./BuilderNode";
import { FlowLibrary } from "./FlowLibrary";
import { InspectorPanel } from "./InspectorPanel";
import { initialEdges, initialNodes } from "./initialFlow";
import { palette } from "./palette";

type PaletteMap = Map<string, (typeof palette)[number]>;

export function BuilderStudio() {
  const [nodes, setNodes, onNodesChange] =
    useNodesState<BuilderNodeInstance>(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [selectedEdgeId, setSelectedEdgeId] = useState<string | null>(null);
  const [workspaceExpanded, setWorkspaceExpanded] = useState(true);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const reactFlow = useReactFlow();

  const paletteMap: PaletteMap = useMemo(
    () => new Map(palette.map((item) => [item.id, item])),
    [],
  );

  const nodeTypes = useMemo<NodeTypes>(
    () => ({
      builder: BuilderNode,
    }),
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
      const label = paletteItem
        ? paletteItem.label
        : `Node ${nodes.length + 1}`;
      const defaultsConfig = paletteItem?.defaults?.config
        ? JSON.parse(JSON.stringify(paletteItem.defaults.config))
        : undefined;
      const defaultStatus = paletteItem?.defaults?.status ?? "Draft";

      const newNodeId = `${type}-${window.crypto.randomUUID()}`;
      const newNode: BuilderNodeInstance = {
        id: newNodeId,
        type: "builder",
        position,
        data: {
          label,
          description: paletteItem?.description,
          icon: paletteItem?.icon ?? MonitorDot,
          accentClass: paletteItem?.accentClass,
          kind: paletteItem?.id,
          status: defaultStatus,
          config: defaultsConfig,
        },
      };

      setNodes((nds) => nds.concat(newNode));
      setSelectedNodeId(newNodeId);
      setSelectedEdgeId(null);
    },
    [nodes.length, paletteMap, reactFlow, setNodes],
  );

  const onSelectionChange = useCallback(
    ({
      nodes: selectedNodes,
      edges: selectedEdges,
    }: OnSelectionChangeParams) => {
      const nodeId =
        selectedNodes && selectedNodes.length > 0
          ? (selectedNodes[0]?.id ?? null)
          : null;
      const edgeId =
        selectedEdges && selectedEdges.length > 0
          ? (selectedEdges[0]?.id ?? null)
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

  const handleRename = useCallback(
    (nodeId: string, label: string) => {
      const normalized =
        label.trim().length > 0 ? label.trim() : "Untitled Step";
      setNodes((nds) =>
        nds.map((node) =>
          node.id === nodeId
            ? {
                ...node,
                data: {
                  ...node.data,
                  label: normalized,
                },
              }
            : node,
        ),
      );
    },
    [setNodes],
  );

  const selectedNode = useMemo(() => {
    if (!selectedNodeId) return null;
    return nodes.find((node) => node.id === selectedNodeId) ?? null;
  }, [nodes, selectedNodeId]);

  const nextConnectedNode = useMemo(() => {
    if (!selectedNodeId) return null;
    const outgoingEdge = edges.find((edge) => edge.source === selectedNodeId);
    if (!outgoingEdge) return null;
    return nodes.find((node) => node.id === outgoingEdge.target) ?? null;
  }, [edges, nodes, selectedNodeId]);

  const renameSelectedNode = useCallback(
    (value: string) => {
      if (!selectedNodeId) return;
      handleRename(selectedNodeId, value);
    },
    [handleRename, selectedNodeId],
  );

  const updateSelectedWebScrape = useCallback(
    (updates: Partial<WebScrapeConfig>) => {
      if (!selectedNodeId) return;
      setNodes((nds) =>
        nds.map((node) => {
          if (node.id !== selectedNodeId) return node;
          const previous =
            node.data.config?.webScrape ??
            ({
              url: "",
              selector: "",
              schedule: "daily",
            } as WebScrapeConfig);
          return {
            ...node,
            data: {
              ...node.data,
              config: {
                ...node.data.config,
                webScrape: {
                  ...previous,
                  ...updates,
                },
              },
            },
          };
        }),
      );
    },
    [selectedNodeId, setNodes],
  );

  const updateSelectedAiSummary = useCallback(
    (updates: Partial<AiSummaryConfig>) => {
      if (!selectedNodeId) return;
      setNodes((nds) =>
        nds.map((node) => {
          if (node.id !== selectedNodeId) return node;
          const previous =
            node.data.config?.aiSummary ??
            ({
              model: "gpt-4o",
              prompt: "Summarize key insights",
              outputSchema: '{"summary": string}',
            } as AiSummaryConfig);
          return {
            ...node,
            data: {
              ...node.data,
              config: {
                ...node.data.config,
                aiSummary: {
                  ...previous,
                  ...updates,
                },
              },
            },
          };
        }),
      );
    },
    [selectedNodeId, setNodes],
  );

  const focusNode = useCallback(
    (nodeId: string) => {
      setSelectedNodeId(nodeId);
      setSelectedEdgeId(null);
    },
    [setSelectedEdgeId, setSelectedNodeId],
  );

  return (
    <div className="flex flex-1 overflow-hidden bg-base-200">
      <div className="hidden md:flex">
        <FlowLibrary
          items={palette}
          onDragStart={onDragStart}
          workspaceExpanded={workspaceExpanded}
          onToggleWorkspace={() => setWorkspaceExpanded((prev) => !prev)}
        />
      </div>
      <div className="relative flex flex-1 flex-col">
        {selectedNodeId || selectedEdgeId ? (
          <div className="absolute right-4 top-4 z-10 flex items-center gap-2 rounded-xl bg-base-100/95 px-3 py-2 shadow-lg shadow-base-300/50">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-base-content/60">
              {selectedNode
                ? `Node: ${selectedNode.data.label}`
                : selectedNodeId
                  ? `Node: ${selectedNodeId}`
                  : "Connection Selected"}
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
          role="application"
          aria-label="Flow canvas"
          onDrop={onDrop}
          onDragOver={onDragOver}
        >
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onSelectionChange={onSelectionChange}
            fitView
            panOnScroll
            zoomOnScroll
            className="reactflow-surface bg-base-200"
            nodeTypes={nodeTypes}
          >
            <MiniMap className="reactflow-minimap" />
            <Controls className="reactflow-controls" />
            <Background
              color="color-mix(in oklab, var(--color-base-content) 50%, transparent)"
              gap={28}
              size={2}
              variant={BackgroundVariant.Dots}
            />
          </ReactFlow>
        </div>
      </div>
      <InspectorPanel
        selectedNode={selectedNode}
        selectedEdgeId={selectedEdgeId}
        onRemoveSelected={removeSelectedNode}
        onRemoveEdge={removeSelectedEdge}
        onRenameSelected={renameSelectedNode}
        onUpdateWebScrape={updateSelectedWebScrape}
        onUpdateAiSummary={updateSelectedAiSummary}
        nextNode={nextConnectedNode}
        onFocusNextNode={
          nextConnectedNode ? () => focusNode(nextConnectedNode.id) : undefined
        }
        onDisconnectNext={
          nextConnectedNode
            ? () => {
                const outgoingEdge = edges.find(
                  (edge) =>
                    edge.source === selectedNodeId &&
                    edge.target === nextConnectedNode.id,
                );
                if (!outgoingEdge) return;
                setEdges((eds) =>
                  eds.filter((edge) => edge.id !== outgoingEdge.id),
                );
                setSelectedEdgeId(null);
              }
            : undefined
        }
      />
    </div>
  );
}
