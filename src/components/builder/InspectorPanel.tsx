"use client";

type InspectorPanelProps = {
  selectedNodeId: string | null;
  selectedEdgeId?: string | null;
  onRemoveSelected?: () => void;
  onRemoveEdge?: () => void;
};

export function InspectorPanel({
  selectedNodeId,
  selectedEdgeId = null,
  onRemoveSelected,
  onRemoveEdge,
}: InspectorPanelProps) {
  return (
    <aside className="hidden w-72 flex-col gap-6 border-l border-base-300 bg-base-100 p-6 shadow-inner shadow-base-300/40 xl:flex">
      <div className="space-y-1">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-base-content/70">
          Node Details
        </p>
        {selectedNodeId ? (
          <p className="text-sm text-base-content/80">
            Configure your{" "}
            <span className="font-semibold text-base-content">
              {selectedNodeId}
            </span>{" "}
            node.
          </p>
        ) : selectedEdgeId ? (
          <p className="text-sm text-base-content/80">
            Manage connection{" "}
            <span className="font-semibold text-base-content">
              {selectedEdgeId}
            </span>
            .
          </p>
        ) : (
          <p className="text-sm text-base-content/80">
            Select a node or connection to view its details.
          </p>
        )}
      </div>
      <div className="flex flex-col gap-4">
        {selectedNodeId ? (
            <>
              <div className="card border border-base-300 bg-base-200">
                <div className="card-body gap-2 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-base-content/60">
                    Status
                  </p>
                  <p className="text-sm font-semibold text-base-content">Idle</p>
                </div>
              </div>
              <div className="card border border-base-300 bg-base-200">
                <div className="card-body gap-2 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-base-content/60">
                    Next Action
                  </p>
                  <p className="text-sm text-base-content/80">
                    Configure authentication and scheduling to activate this node.
                  </p>
                  {onRemoveSelected ? (
                    <div className="flex justify-end">
                      <button
                        type="button"
                        className="btn btn-error btn-xs text-error-content"
                        onClick={onRemoveSelected}
                      >
                        Remove Node
                      </button>
                    </div>
                  ) : null}
                </div>
              </div>
          </>
        ) : (
          <div className="card border border-dashed border-base-300 bg-base-200">
            <div className="card-body p-4 text-center text-sm text-base-content/70">
              {selectedEdgeId ? (
                <div className="flex flex-col items-center gap-3">
                  <span>
                    This connection links two steps in your flow. Remove it to
                    stop data transfer.
                  </span>
                  {onRemoveEdge ? (
                    <button
                      type="button"
                      className="btn btn-error btn-xs text-error-content"
                      onClick={onRemoveEdge}
                    >
                      Remove Connection
                    </button>
                  ) : null}
                </div>
              ) : (
                "Build flows by dragging steps from the library into the canvas."
              )}
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
