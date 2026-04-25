"use client";

import { useState } from "react";

interface CreateBoardDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateBoard: (title: string, description?: string) => Promise<void>;
}

export function CreateBoardDialog({
  isOpen,
  onOpenChange,
  onCreateBoard,
}: CreateBoardDialogProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsSubmitting(true);
    try {
      await onCreateBoard(title.trim(), description.trim() || undefined);
      setTitle("");
      setDescription("");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="px-6 py-4 border-b">
          <h2 className="text-lg font-semibold">Create New Board</h2>
          <p className="text-sm text-gray-600">
            Create a new board to organize your tasks and projects.
          </p>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="space-y-2">
            <label htmlFor="board-title" className="text-sm font-medium">
              Board Title *
            </label>
            <input
              id="board-title"
              type="text"
              placeholder="e.g., Website Redesign"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              disabled={isSubmitting}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="board-description" className="text-sm font-medium">
              Description
            </label>
            <textarea
              id="board-description"
              placeholder="Describe what this board is about..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={isSubmitting}
              rows={3}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed resize-none"
            />
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <button
              type="button"
              onClick={() => {
                setTitle("");
                setDescription("");
                onOpenChange(false);
              }}
              disabled={isSubmitting}
              className="px-4 py-2 text-sm border rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !title.trim()}
              className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Creating..." : "Create Board"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
