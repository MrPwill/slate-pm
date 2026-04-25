"use client";

import { useState } from "react";
import { useBoardStore } from "@/store/useBoardStore";
import { Button } from "@/components/common/Button";

export function TagSuggester() {
  const { columns } = useBoardStore();
  const [suggestedTags, setSuggestedTags] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [_error, setError] = useState<string | null>(null);

  // Extract all card titles and details for analysis
  const cardTexts = columns.flatMap(column =>
    column.cards.map(card => 
      `${card.title} ${card.details || ""}`.trim()
    )
  ).filter(text => text.length > 0);

  const handleSuggestTags = async () => {
    if (cardTexts.length === 0) {
      setError("No cards available for tag suggestion");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Simple tag suggestion based on common keywords
      // In a real implementation, this would call an AI service
      const commonWords = extractCommonWords(cardTexts.join(" "));
      setSuggestedTags(commonWords.slice(0, 5)); // Top 5 suggestions
    } catch (err) {
      console.error("Error suggesting tags:", err);
      setError("Failed to suggest tags. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Simple keyword extraction (would be replaced with AI in production)
  function extractCommonWords(text: string): string[] {
    const words = text
      .toLowerCase()
      .replace(/[^a-z\s]/g, "")
      .split(/\s+/)
      .filter(word => word.length > 3 && !commonStopWords.has(word));

    const wordCount: Record<string, number> = {};
    words.forEach(word => {
      wordCount[word] = (wordCount[word] || 0) + 1;
    });

    return Object.entries(wordCount)
      .sort(([, a], [, b]) => b - a)
      .map(([word]) => word);
  }

  const commonStopWords = new Set([
    "this", "that", "with", "have", "will", "from", "they", "been", "have", 
    "were", "said", "each", "which", "their", "time", "would", "there", 
    "could", "other", "more", "very", "what", "know", "just", "first", 
    "get", "over", "think", "also", "back", "after", "use", "two", "how", 
    "our", "work", "than", "its", "who", "now", "people", "made", "year", 
    "live", "me", "man", "something", "take", "out", "day", "get", "make", 
    "year", "him", "old", "see", "him", "two", "way", "new", "want", 
    "because", "any", "these", "give", "most", "us"
  ]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium text-gray-900">Suggested Tags</h3>
        {cardTexts.length > 0 && (
          <span className="text-xs text-gray-500">
            Based on {cardTexts.length} {cardTexts.length === 1 ? 'card' : 'cards'}
          </span>
        )}
      </div>

      {!suggestedTags.length && !loading && (
        <div className="p-4 bg-gray-50 border border-gray-200 rounded min-h-[80px] flex items-center justify-center text-gray-400">
          Click "Suggest Tags" to generate tag recommendations based on card content
        </div>
      )}

      {loading && (
        <div className="flex items-center justify-center py-4">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
        </div>
      )}

      {suggestedTags.length > 0 && !loading && (
        <div className="flex flex-wrap gap-2">
          {suggestedTags.map((tag, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-blue-50 text-blue-800 text-xs rounded-full font-medium"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      <Button
        variant="outline"
        size="sm"
        onClick={handleSuggestTags}
        disabled={loading || cardTexts.length === 0}
        className="w-full"
      >
        {loading ? "Analyzing..." : "Suggest Tags"}
      </Button>
    </div>
  );
}
