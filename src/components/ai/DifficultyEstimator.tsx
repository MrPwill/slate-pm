"use client";

import { useState } from "react";
import { useBoardStore } from "@/store/useBoardStore";
import { Button } from "@/components/common/Button";

export function DifficultyEstimator() {
  const { columns } = useBoardStore();
  const [difficulty, setDifficulty] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Extract all card titles and details for analysis
  const cardTexts = columns.flatMap(column =>
    column.cards.map(card => 
      `${card.title} ${card.details || ""}`.trim()
    )
  ).filter(text => text.length > 0);

  const handleEstimateDifficulty = async () => {
    if (cardTexts.length === 0) {
      setError("No cards available for difficulty estimation");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Simple difficulty estimation based on card content analysis
      // In a real implementation, this would call an AI service
      const estimatedDifficulty = estimateDifficultyFromCards(cardTexts);
      setDifficulty(estimatedDifficulty);
    } catch (err) {
      console.error("Error estimating difficulty:", err);
      setError("Failed to estimate difficulty. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Simple difficulty estimation (would be replaced with AI in production)
  function estimateDifficultyFromCards(texts: string[]): string {
    // Combine all text
    const allText = texts.join(" ").toLowerCase();
    
    // Simple heuristics for difficulty
    const complexIndicators = [
      "architecture", "framework", "database", "api", "integration", 
      "security", "performance", "scalable", "microservice", "docker",
      "kubernetes", "aws", "cloud", "pipeline", "devops", "algorithm"
    ];
    
    const mediumIndicators = [
      "feature", "component", "service", "module", "interface", 
      "validation", "testing", "ui", "ux", "design", "implement"
    ];
    
    let complexCount = 0;
    let mediumCount = 0;
    
    complexIndicators.forEach(indicator => {
      if (allText.includes(indicator)) complexCount++;
    });
    
    mediumIndicators.forEach(indicator => {
      if (allText.includes(indicator)) mediumCount++;
    });
    
    // Simple scoring
    if (complexCount >= 2 || (complexCount >= 1 && texts.some(t => t.length > 100))) {
      return "Complex";
    } else if (mediumCount >= 2 || (mediumCount >= 1 && texts.length >= 3)) {
      return "Medium";
    } else {
      return "Simple";
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium text-gray-900">Difficulty Estimate</h3>
        {cardTexts.length > 0 && (
          <span className="text-xs text-gray-500">
            Based on {cardTexts.length} {cardTexts.length === 1 ? 'card' : 'cards'}
          </span>
        )}
      </div>

      {!difficulty && !loading && (
        <div className="p-4 bg-gray-50 border border-gray-200 rounded min-h-[80px] flex items-center justify-center text-gray-400">
          Click "Estimate Difficulty" to analyze card complexity
        </div>
      )}

      {loading && (
        <div className="flex items-center justify-center py-4">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
        </div>
      )}

      {difficulty && !loading && (
        <div className="p-4 rounded text-center">
          <div className={`text-xl font-bold mb-2 ${getDifficultyColor(difficulty)}`}>
            {difficulty}
          </div>
          <p className="text-sm text-gray-600">
            Estimated effort level for the work described in cards
          </p>
        </div>
      )}

      <Button
        variant="outline"
        size="sm"
        onClick={handleEstimateDifficulty}
        disabled={loading || cardTexts.length === 0}
        className="w-full"
      >
        {loading ? "Analyzing..." : "Estimate Difficulty"}
      </Button>
    </div>
  );
}

// Helper function to get color based on difficulty
function getDifficultyColor(difficulty: string): string {
  switch (difficulty.toLowerCase()) {
    case "simple": return "text-green-600";
    case "medium": return "text-yellow-600";
    case "complex": return "text-red-600";
    default: return "text-gray-500";
  }
}
