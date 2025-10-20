"use client";

import { Menu, Search, Settings, Sparkles, Workflow } from "lucide-react";

export function BuilderHeader() {
  return (
    <header className="navbar sticky top-0 z-20 border-b border-base-300 bg-base-100/95 px-6 py-3 backdrop-blur">
      <div className="navbar-start gap-3">
        <div className="btn btn-primary btn-square btn-sm text-primary-content">
          <Workflow className="h-4 w-4" />
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-base-content">
            Kompyra Builder
          </span>
          <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-base-content/60">
            Competitor Intelligence
          </span>
        </div>
      </div>
      <div className="navbar-end gap-3">
        <label className="input input-sm flex items-center gap-2 border border-base-300 bg-base-200/80">
          <Search className="h-4 w-4 text-base-content/60" />
          <input
            type="search"
            placeholder="Search flows"
            className="w-40 flex-1 bg-transparent text-sm text-base-content placeholder:text-base-content/50"
          />
        </label>
        <button
          type="button"
          className="btn btn-ghost btn-circle btn-sm text-base-content/70"
        >
          <Settings className="h-4 w-4" />
        </button>
        <button
          type="button"
          className="btn btn-secondary btn-circle btn-sm text-secondary-content shadow-lg shadow-secondary/20"
        >
          <Sparkles className="h-4 w-4" />
        </button>
        <button
          type="button"
          className="btn btn-ghost btn-circle btn-sm text-base-content/70 md:hidden"
        >
          <Menu className="h-4 w-4" />
        </button>
      </div>
    </header>
  );
}
