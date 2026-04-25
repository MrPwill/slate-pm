"use client";

import { useBoardStore } from "@/store/useBoardStore";
import { useBoards } from "@/hooks/useBoards";
import { Board } from "@/types/board";
import { useState } from "react";
import { CreateBoardDialog } from "./CreateBoardDialog";
import { BoardMenu } from "./BoardMenu";

function PlusIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

function SpinnerIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="animate-spin" {...props}>
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" opacity="0.25" />
      <path d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" fill="currentColor" opacity="0.5" />
    </svg>
  );
}

export function BoardList() {
  const { boards, loading, createBoard, deleteBoard } = useBoards();
  const { setCurrentBoard, loadBoardFromDb } = useBoardStore();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [menuBoardId, setMenuBoardId] = useState<string | null>(null);

  const handleCreateBoard = async (title: string, description?: string) => {
    const board = await createBoard(title, description);
    if (board) {
      alert("Board created successfully");
      setIsCreateOpen(false);
    }
  };

  const handleDeleteBoard = async (boardId: string) => {
    const board = boards.find((b) => b.id === boardId);
    if (!board) return;

    if (confirm(`Are you sure you want to delete "${board.title}"?`)) {
      await deleteBoard(boardId);
      alert("Board deleted successfully");
    }
  };

  const handleSelectBoard = (board: Board) => {
    setCurrentBoard(board.id);
    loadBoardFromDb(board.id);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <SpinnerIcon className="w-6 h-6 text-gray-400" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Boards</h2>
          <button
            type="button"
            onClick={() => setIsCreateOpen(true)}
            className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded p-1"
          >
            <PlusIcon className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Board List */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {boards.length === 0 ? (
          <div className="text-center py-8 px-4">
            <p className="text-gray-500 text-sm">No boards yet</p>
            <button
              type="button"
              onClick={() => setIsCreateOpen(true)}
              className="mt-2 w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
            >
              <PlusIcon className="w-4 h-4 mr-2 inline-block -mt-0.5" />
              Create your first board
            </button>
          </div>
        ) : (
          boards.map((board) => (
            <div
              key={board.id}
              className="group relative rounded-lg border border-gray-200 bg-white hover:border-blue-300 hover:shadow-sm transition-all cursor-pointer"
              onClick={() => handleSelectBoard(board)}
            >
              <div className="p-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-gray-900 truncate">
                      {board.title}
                    </h3>
                    {board.description && (
                      <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                        {board.description}
                      </p>
                    )}
                    <p className="text-xs text-gray-400 mt-2">
                      Created {new Date(board.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <BoardMenu
                    board={board}
                    isOpen={menuBoardId === board.id}
                    onOpenChange={(open) => setMenuBoardId(open ? board.id : null)}
                    onDelete={() => handleDeleteBoard(board.id)}
                  />
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Create Board Dialog */}
      <CreateBoardDialog
        isOpen={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        onCreateBoard={handleCreateBoard}
      />
    </div>
  );
}
