"use client";

import { useState } from "react";
import { Button } from "@/components/common/Button";
import { SummaryGenerator } from "./SummaryGenerator";
import { TagSuggester } from "./TagSuggester";
import { DifficultyEstimator } from "./DifficultyEstimator";

export function EnhancedAiPanel() {
  const [activeTab, setActiveTab] = useState("summary");

  return (
    <div className="space-y-4">
      <div className="flex gap-2 mb-2">
        <Button
          variant={activeTab === "summary" ? "default" : "outline"}
          onClick={() => setActiveTab("summary")}
          size="sm"
        >
          Summarize
        </Button>
        <Button
          variant={activeTab === "tags" ? "default" : "outline"}
          onClick={() => setActiveTab("tags")}
          size="sm"
        >
          Tags
        </Button>
        <Button
          variant={activeTab === "difficulty" ? "default" : "outline"}
          onClick={() => setActiveTab("difficulty")}
          size="sm"
        >
          Difficulty
        </Button>
      </div>

      {activeTab === "summary" && <SummaryGenerator />}
      {activeTab === "tags" && <TagSuggester />}
      {activeTab === "difficulty" && <DifficultyEstimator />}
    </div>
  );
}
