"use client";

import type { ComponentType } from "react";
import {
  Brain,
  Database,
  LineChart,
  MonitorDot,
  Sparkles,
} from "lucide-react";

export type PaletteItem = {
  id: string;
  label: string;
  description: string;
  icon: ComponentType<{ className?: string }>;
  accentClass: string;
};

export const palette: PaletteItem[] = [
  {
    id: "web-scrape",
    label: "Web Scraper",
    description: "Crawl competitor websites for structured data.",
    icon: MonitorDot,
    accentClass: "bg-primary/10 text-primary",
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
  },
  {
    id: "embedding",
    label: "Embedding",
    description: "Vectorize content for semantic search.",
    icon: Sparkles,
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
