"use client";

import { useState } from "react";
import { useBoardStore } from "@/store/useBoardStore";
import { Button } from "@/components/common/Button";
import { supabase } from "@/lib/supabase";

export function SummaryGenerator() {
  const { columns } = useBoardStore();
  const [summary, setSummary] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Flatten all comments from all cards
  const allComments = columns.flatMap(column =>
    column.cards.flatMap(card => 
      card.comments?.map(comment => ({
        ...comment,
        card_title: card.title,
        card_id: card.id
      })) || []
    )
  ) || [];

  const handleGenerateSummary = async () => {
    if (allComments.length === 0) {
      setError("No comments available to summarize");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/summarize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          comments: allComments,
          cardDetails: `Board has ${columns.length} columns with ${columns.reduce((sum, col) => sum + col.cards.length, 0)} total cards`,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate summary");
      }

      const data = await response.json();
      setSummary(data.summary);
    } catch (err) {
      console.error("Error generating summary:", err);
      setError("Failed to generate summary. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium text-gray-900">Conversation Summary</h3>
        {allComments.length > 0 && (
          <span className="text-xs text-gray-500">
            Based on {allComments.length} {allComments.length === 1 ? 'comment' : 'comments'}
          </span>
        )}
      </div>

      {!summary && !loading && (
        <div className="p-4 bg-gray-50 border border-gray-200 rounded min-h-[80px] flex items-center justify-center text-gray-400">
          Click "Generate Summary" to create a summary of all comments on this board
        </div>
      )}

      {loading && (
        <div className="flex items-center justify-center py-4">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
        </div>
      )}

      {summary && !loading && (
        <div className="p-4 bg-blue-50 border border-blue-200 rounded text-sm text-blue-800">
          {summary}
        </div>
      )}

      <Button
        variant="outline"
        size="sm"
        onClick={handleGenerateSummary}
        disabled={loading || allComments.length === 0}
        className="w-full"
      >
        {loading ? "Generating..." : "Generate Summary"}
      </Button>
    </div>
  );
}
