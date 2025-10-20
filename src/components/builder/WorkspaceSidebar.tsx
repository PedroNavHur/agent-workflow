"use client";

export function WorkspaceSidebar() {
  return (
    <aside className="hidden w-60 flex-col gap-4 border-r border-base-300 bg-base-100 p-6 shadow-lg shadow-base-300/30 lg:flex">
      <div className="space-y-1">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-base-content/70">
          Active Workspace
        </p>
        <p className="text-lg font-semibold text-base-content">
          Competitive Analysis
        </p>
      </div>
      <div className="space-y-3 text-sm text-base-content/80">
        <div className="card border border-base-300 bg-base-200">
          <div className="card-body gap-2 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-base-content/60">
              Overview
            </p>
            <p className="text-sm text-base-content/80">
              Automate competitive research and surface new opportunities.
            </p>
          </div>
        </div>
        <div className="card border border-base-300 bg-base-200">
          <div className="card-body gap-2 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-base-content/60">
              Automations
            </p>
            <ul className="space-y-2 text-xs text-base-content/70">
              <li>• Weekly website scans</li>
              <li>• Pricing change alerts</li>
              <li>• Feature launch summaries</li>
            </ul>
          </div>
        </div>
      </div>
    </aside>
  );
}
