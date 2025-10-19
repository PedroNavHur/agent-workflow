"use client";

type InspectorPanelProps = {
  selectedNodeId: string | null;
};

export function InspectorPanel({ selectedNodeId }: InspectorPanelProps) {
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
        ) : (
          <p className="text-sm text-base-content/80">
            Select a node to edit its configuration.
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
              </div>
            </div>
          </>
        ) : (
          <div className="card border border-dashed border-base-300 bg-base-200">
            <div className="card-body p-4 text-center text-sm text-base-content/70">
              Build flows by dragging steps from the library into the canvas.
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
