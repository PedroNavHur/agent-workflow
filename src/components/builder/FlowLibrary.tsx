"use client";

import type { DragEvent } from "react";
import type { PaletteItem } from "./palette";

type FlowLibraryProps = {
  items: PaletteItem[];
  onDragStart: (event: DragEvent<HTMLButtonElement>, type: string) => void;
};

export function FlowLibrary({ items, onDragStart }: FlowLibraryProps) {
  return (
    <div className="hidden w-64 flex-col gap-4 border-r border-base-300 bg-base-100 p-6 shadow-lg shadow-base-300/30 md:flex">
      <div className="space-y-1">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-base-content/70">
          Flow Library
        </p>
        <p className="text-sm text-base-content/80">
          Drag actions into the canvas to build your automation.
        </p>
      </div>
      <div className="flex flex-1 flex-col gap-4 overflow-y-auto pr-1">
        {items.map((item) => (
          <button
            key={item.id}
            draggable
            type="button"
            onDragStart={(event) => onDragStart(event, item.id)}
            className="card bg-base-200 text-left shadow-sm transition hover:shadow-lg"
          >
            <div className="card-body gap-3 p-4">
              <span
                className={`${item.accentClass} flex h-10 w-10 items-center justify-center rounded-xl text-lg`}
              >
                <item.icon className="h-5 w-5" />
              </span>
              <span className="text-sm font-semibold text-base-content">
                {item.label}
              </span>
              <span className="text-xs leading-5 text-base-content/70">
                {item.description}
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
