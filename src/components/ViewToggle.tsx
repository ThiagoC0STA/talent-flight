"use client";

import { Grid3X3, List } from "lucide-react";

type ViewMode = "grid" | "list";

interface ViewToggleProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
}

export default function ViewToggle({
  viewMode,
  onViewModeChange,
}: ViewToggleProps) {
  return (
    <div className="flex items-center bg-white rounded-xl border border-[#E5EAF1] p-1">
      <button
        onClick={() => {  
          onViewModeChange("grid");
        }}
        className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 cursor-pointer ${
          viewMode === "grid"
            ? "bg-[#0476D9] text-white"
            : "text-[#010D26] hover:bg-[#F3F7FA]"
        }`}
      >
        <Grid3X3 className="w-4 h-4" />
        <span className="text-sm font-medium">Grid</span>
      </button>

      <button
        onClick={() => {
          onViewModeChange("list");
        }}
        className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 cursor-pointer ${
          viewMode === "list"
            ? "bg-[#0476D9] text-white"
            : "text-[#010D26] hover:bg-[#F3F7FA]"
        }`}
      >
        <List className="w-4 h-4" />
        <span className="text-sm font-medium">List</span>
      </button>
    </div>
  );
}
