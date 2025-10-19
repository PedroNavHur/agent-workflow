"use client";

import { ReactFlowProvider } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { BuilderHeader } from "@/components/builder/BuilderHeader";
import { BuilderStudio } from "@/components/builder/BuilderStudio";
import { WorkspaceSidebar } from "@/components/builder/WorkspaceSidebar";

export default function Home() {
  return (
    <ReactFlowProvider>
      <div className="flex min-h-screen flex-col bg-base-200 text-base-content">
        <BuilderHeader />
        <main className="flex flex-1 overflow-hidden">
          <WorkspaceSidebar />
          <BuilderStudio />
        </main>
      </div>
    </ReactFlowProvider>
  );
}
