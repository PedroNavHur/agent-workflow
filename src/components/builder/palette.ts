"use client";

import { Brain, Database, LineChart, MonitorDot, Table } from "lucide-react";
import type { ComponentType } from "react";
import type {
  AiSummaryConfig,
  BuilderNodeData,
  WebScrapeConfig,
} from "./BuilderNode";

export type PaletteItem = {
  id: string;
  label: string;
  description: string;
  icon: ComponentType<{ className?: string }>;
  accentClass: string;
  defaults?: {
    config?: BuilderNodeData["config"];
  };
};

export const palette: PaletteItem[] = [
  {
    id: "web-scrape",
    label: "Web Scraper",
    description: "Crawl competitor websites for structured data.",
    icon: MonitorDot,
    accentClass: "bg-primary/10 text-primary",
    defaults: {
      config: {
        webScrape: {
          url: "",
          selector: "",
          schedule: "daily",
        } satisfies WebScrapeConfig,
      },
    },
  },
  {
    id: "api-ingest",
    label: "API Ingest",
    description: "Pull data from third-party APIs and services.",
    icon: Database,
    accentClass: "bg-secondary/10 text-secondary",
  },
  {
    id: "ai-summary",
    label: "AI Summary",
    description: "Generate insights using Kompyra's AI models.",
    icon: Brain,
    accentClass: "bg-accent/10 text-accent",
    defaults: {
      config: {
        aiSummary: {
          model: "gpt-4o",
          prompt: "Summarize key competitive insights from the latest data.",
          outputSchema: '{"summary": string, "highlights": string[]}',
        } satisfies AiSummaryConfig,
      },
    },
  },
  {
    id: "embedding",
    label: "Embedding",
    description: "Vectorize content for semantic search.",
    icon: Table,
    accentClass: "bg-info/10 text-info",
  },
  {
    id: "dashboard",
    label: "Insight Dashboard",
    description: "Visualize KPIs and competitor metrics.",
    icon: LineChart,
    accentClass: "bg-success/10 text-success",
  },
];
