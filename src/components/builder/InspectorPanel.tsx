"use client";

import type {
  AiSummaryConfig,
  BuilderNodeInstance,
  WebScrapeConfig,
} from "./BuilderNode";

type InspectorPanelProps = {
  selectedNode: BuilderNodeInstance | null;
  selectedEdgeId?: string | null;
  onRemoveSelected?: () => void;
  onRemoveEdge?: () => void;
  onRenameSelected?: (value: string) => void;
  onUpdateWebScrape?: (updates: Partial<WebScrapeConfig>) => void;
  onUpdateAiSummary?: (updates: Partial<AiSummaryConfig>) => void;
  nextNode?: BuilderNodeInstance | null;
  onFocusNextNode?: () => void;
  onDisconnectNext?: () => void;
};

export function InspectorPanel({
  selectedNode,
  selectedEdgeId = null,
  onRemoveSelected,
  onRemoveEdge,
  onRenameSelected,
  onUpdateWebScrape,
  onUpdateAiSummary,
  nextNode = null,
  onFocusNextNode,
  onDisconnectNext,
}: InspectorPanelProps) {
  const nodeLabel = selectedNode?.data.label ?? selectedNode?.id ?? null;
  const webScrapeConfig = selectedNode?.data.config?.webScrape;
  const aiSummaryConfig = selectedNode?.data.config?.aiSummary;

  return (
    <aside className="hidden w-72 flex-col gap-6 border-l border-base-300 bg-base-100 p-6 shadow-inner shadow-base-300/40 xl:flex">
      <div className="space-y-1">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-base-content/70">
          Node Details
        </p>
        {selectedNode ? (
          <>
            <p className="text-sm text-base-content/80">
              Configure your{" "}
              <span className="font-semibold text-base-content">
                {nodeLabel}
              </span>{" "}
              node.
            </p>
            <div className="flex w-full max-w-full flex-col gap-2 pt-3">
              <span className="text-xs font-semibold uppercase tracking-[0.3em] text-base-content/60">
                Step Name
              </span>
              <input
                type="text"
                className="input input-sm border border-base-300 bg-base-200 text-base-content"
                value={selectedNode?.data.label ?? ""}
                onChange={(event) => onRenameSelected?.(event.target.value)}
                onBlur={(event) => {
                  const trimmed = event.target.value.trim();
                  const safeValue =
                    trimmed.length > 0 ? trimmed : "Untitled Step";
                  onRenameSelected?.(safeValue);
                }}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    const trimmed = event.currentTarget.value.trim();
                    const safeValue =
                      trimmed.length > 0 ? trimmed : "Untitled Step";
                    onRenameSelected?.(safeValue);
                    event.currentTarget.blur();
                  }
                }}
              />
            </div>
            {selectedNode?.data.kind === "web-scrape" ? (
              <div className="card border border-base-300 bg-base-200">
                <div className="card-body gap-4 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-base-content/60">
                    Web Scraper Settings
                  </p>
                  <div className="flex flex-col gap-2">
                    <span className="text-xs uppercase tracking-[0.3em] text-base-content/60">
                      Target URL
                    </span>
                    <input
                      type="url"
                      placeholder="https://example.com/pricing"
                      className="input input-sm border border-base-300 bg-base-100 text-base-content"
                      value={webScrapeConfig?.url ?? ""}
                      onChange={(event) =>
                        onUpdateWebScrape?.({ url: event.target.value })
                      }
                      onBlur={(event) =>
                        onUpdateWebScrape?.({ url: event.target.value.trim() })
                      }
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <span className="text-xs uppercase tracking-[0.3em] text-base-content/60">
                      CSS Selector (optional)
                    </span>
                    <input
                      type="text"
                      placeholder="#pricing-table"
                      className="input input-sm border border-base-300 bg-base-100 text-base-content"
                      value={webScrapeConfig?.selector ?? ""}
                      onChange={(event) =>
                        onUpdateWebScrape?.({ selector: event.target.value })
                      }
                      onBlur={(event) =>
                        onUpdateWebScrape?.({
                          selector: event.target.value.trim(),
                        })
                      }
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <span className="text-xs uppercase tracking-[0.3em] text-base-content/60">
                      Crawl Frequency
                    </span>
                    <select
                      className="input select select-sm w-full border border-base-300 bg-base-100 text-base-content"
                      value={webScrapeConfig?.schedule ?? "daily"}
                      onChange={(event) =>
                        onUpdateWebScrape?.({
                          schedule: event.target
                            .value as WebScrapeConfig["schedule"],
                        })
                      }
                    >
                      <option value="hourly">Hourly</option>
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                    </select>
                  </div>
                </div>
              </div>
            ) : selectedNode?.data.kind === "ai-summary" ? (
              <div className="card border border-base-300 bg-base-200">
                <div className="card-body gap-4 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-base-content/60">
                    AI Summary Settings
                  </p>
                  <div className="flex flex-col gap-2">
                    <span className="text-xs uppercase tracking-[0.3em] text-base-content/60">
                      Model
                    </span>
                    <select
                      className="select select-sm w-full border border-base-300 bg-base-100 text-base-content"
                      value={aiSummaryConfig?.model ?? "gpt-4o"}
                      onChange={(event) =>
                        onUpdateAiSummary?.({
                          model: event.target.value as AiSummaryConfig["model"],
                        })
                      }
                    >
                      <option value="gpt-4o">GPT-4o</option>
                      <option value="claude-3-opus">Claude 3 Opus</option>
                      <option value="llama-3">Llama 3</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-2">
                    <span className="text-xs uppercase tracking-[0.3em] text-base-content/60">
                      Prompt
                    </span>
                    <textarea
                      className="textarea textarea-sm border border-base-300 bg-base-100 text-base-content"
                      rows={4}
                      placeholder="Summarize the latest competitor moves..."
                      value={aiSummaryConfig?.prompt ?? ""}
                      onChange={(event) =>
                        onUpdateAiSummary?.({ prompt: event.target.value })
                      }
                      onBlur={(event) =>
                        onUpdateAiSummary?.({
                          prompt: event.target.value.trim(),
                        })
                      }
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <span className="text-xs uppercase tracking-[0.3em] text-base-content/60">
                      Desired Output Structure
                    </span>
                    <textarea
                      className="textarea textarea-sm border border-base-300 bg-base-100 text-base-content"
                      rows={3}
                      placeholder='{"summary": string, "highlights": string[]}'
                      value={aiSummaryConfig?.outputSchema ?? ""}
                      onChange={(event) =>
                        onUpdateAiSummary?.({
                          outputSchema: event.target.value,
                        })
                      }
                      onBlur={(event) =>
                        onUpdateAiSummary?.({
                          outputSchema: event.target.value.trim(),
                        })
                      }
                    />
                  </div>
                </div>
              </div>
            ) : null}
          </>
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
        {selectedNode ? (
          <>
            <div className="card border border-base-300 bg-base-200">
              <div className="card-body gap-2 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-base-content/60">
                  Status
                </p>
                <p className="text-sm font-semibold text-base-content">
                  {selectedNode.data.status ?? "Idle"}
                </p>
              </div>
            </div>
            <div className="card border border-base-300 bg-base-200">
              <div className="card-body gap-2 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-base-content/60">
                  Next Action
                </p>
                {nextNode ? (
                  <div className="flex items-center gap-3 rounded-xl border border-base-300 bg-base-100 p-3">
                    <span
                      className={`${nextNode.data.accentClass ?? "bg-primary/10 text-primary"} flex h-8 w-8 items-center justify-center rounded-full`}
                    >
                      {nextNode.data.icon ? (
                        <nextNode.data.icon className="h-4 w-4" />
                      ) : null}
                    </span>
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-base-content">
                        {nextNode.data.label}
                      </span>
                      <span className="text-xs text-base-content/70">
                        Connected downstream step
                      </span>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-base-content/80">
                    Connect this node to another step to continue the flow.
                  </p>
                )}
                {nextNode ? (
                  <div className="flex gap-2">
                    {onFocusNextNode ? (
                      <button
                        type="button"
                        className="btn btn-primary btn-xs text-primary-content"
                        onClick={onFocusNextNode}
                      >
                        Config Next Node
                      </button>
                    ) : null}
                    {onDisconnectNext ? (
                      <button
                        type="button"
                        className="btn btn-warning btn-xs text-warning-content"
                        onClick={onDisconnectNext}
                      >
                        Disconnect
                      </button>
                    ) : null}
                  </div>
                ) : null}
              </div>
            </div>
            {onRemoveSelected ? (
              <div className="card border border-base-300 bg-base-200">
                <div className="card-body gap-2 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-base-content/60">
                    Danger Zone
                  </p>
                  <p className="text-sm text-base-content/70">
                    Removing this node will detach it and its connections from the flow.
                  </p>
                  <button
                    type="button"
                    className="btn btn-error btn-xs self-start text-error-content"
                    onClick={onRemoveSelected}
                  >
                    Remove Node
                  </button>
                </div>
              </div>
            ) : null}
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
