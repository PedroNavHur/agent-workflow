"use client";

import { ChevronDown, ChevronUp } from "lucide-react";
import type { DragEvent } from "react";
import type { PaletteItem } from "./palette";

type FlowLibraryProps = {
  items: PaletteItem[];
  onDragStart: (event: DragEvent<HTMLButtonElement>, type: string) => void;
  workspaceExpanded: boolean;
  onToggleWorkspace: () => void;
};

export function FlowLibrary({
  items,
  onDragStart,
  workspaceExpanded,
  onToggleWorkspace,
}: FlowLibraryProps) {
  return (
    <div className="flex w-72 flex-col gap-4 border-r border-base-300 bg-base-100 p-6 shadow-lg shadow-base-300/30">
      <div className="flex flex-col gap-3 text-sm text-base-content/80">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-base-content/70">
          Active Workspace
        </p>
        <div className="card bg-base-200 text-left shadow-sm">
          <div className="card-body gap-2 p-4">
            <p className="text-sm font-semibold text-base-content">Overview</p>
            <p className="text-xs leading-5 text-base-content/70">
              Automate competitive research and surface new opportunities.
            </p>
          </div>
        </div>
      </div>
      <div className="space-y-1">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-base-content/70">
          Kompyra Actions
        </p>
        <p className="text-sm text-base-content/80">
          Drag building blocks into the canvas to shape your automation.
        </p>
      </div>
      <div className="flex flex-col gap-4 overflow-y-auto pr-1">
        {items.map((item) => (
          <button
            key={item.id}
            draggable
            type="button"
            onDragStart={(event) => onDragStart(event, item.id)}
            className="card bg-base-200 text-left shadow-sm transition hover:shadow-lg"
          >
            <div className="card-body flex-row items-center gap-4 p-4">
              <span
                className={`${item.accentClass} flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full text-lg`}
              >
                <item.icon className="h-5 w-5" />
              </span>
              <div className="flex flex-col gap-1">
                <span className="text-sm font-semibold text-base-content">
                  {item.label}
                </span>
                <span className="text-xs leading-5 text-base-content/70">
                  {item.description}
                </span>
              </div>
            </div>
          </button>
        ))}
      </div>
      <div className="flex flex-col gap-3 text-sm text-base-content/80">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-base-content/70">
          Scheduler
        </p>
        <div className="card bg-base-200 text-left shadow-sm">
          <div className="card-body gap-2 p-4">
            <p className="text-sm font-semibold text-base-content">
              Automations
            </p>
            <ul className="flex list-disc flex-col gap-1 pl-5 text-xs leading-5 text-base-content/70">
              <li>Weekly website scans</li>
              <li>Pricing change alerts</li>
              <li>Feature launch summaries</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
