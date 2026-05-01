"use client";

import { useState } from "react";
import { useBoardStore } from "@/store/useBoardStore";
import { Button } from "@/components/common/Button";

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

  // Get all card content for board summary
  const allCardContent = columns.flatMap(column =>
    column.cards.map(card => ({
      column: column.title,
      title: card.title,
      details: card.details || "",
    }))
  );

  const handleGenerateSummary = async () => {
    if (allComments.length === 0 && allCardContent.length === 0) {
      setError("No content available to summarize");
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
          comments: allComments.length > 0 ? allComments : [
            { content: allCardContent.map(c => `${c.column}: ${c.title} - ${c.details}`).join(" | ") }
          ],
          cardDetails: `Board has ${columns.length} columns: ${columns.map(c => c.title).join(", ")}. Total ${allCardContent.length} cards.`,
        }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Failed to generate summary");
      }

      const data = await response.json();
      if (!data.summary) {
        throw new Error(data.error || "Failed to generate summary");
      }
      setSummary(data.summary);
    } catch (err) {
      console.error("Error generating summary:", err);
      setError("Failed to generate summary. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const contentCount = allComments.length > 0 ? allComments.length : allCardContent.length;
  const isCommentBased = allComments.length > 0;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium text-gray-900">Board Summary</h3>
        <span className="text-xs text-gray-500">
          {contentCount} {isCommentBased ? (contentCount === 1 ? 'comment' : 'comments') : 'cards'}
        </span>
      </div>

      {!summary && !loading && (
        <div className="p-4 bg-gray-50 border border-gray-200 rounded min-h-20 flex items-center justify-center text-gray-400">
          {isCommentBased 
            ? "Click 'Generate Summary' to create a summary of all comments on this board"
            : "Click 'Generate Summary' to create an overview of your board's content"}
        </div>
      )}

      {loading && (
        <div className="flex items-center justify-center py-4">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
        </div>
      )}

      {summary && !loading && (
        <div className="p-4 bg-blue-50 border border-blue-200 rounded text-sm text-blue-900 leading-relaxed">
          {summary}
        </div>
      )}

      {error && (
        <div className="p-2 text-sm text-red-600 bg-red-50 rounded">
          {error}
        </div>
      )}

      <Button
        variant="outline"
        size="sm"
        onClick={handleGenerateSummary}
        disabled={loading || (allComments.length === 0 && allCardContent.length === 0)}
        className="w-full"
      >
        {loading ? "Generating..." : "Generate Summary"}
      </Button>
    </div>
  );
}
