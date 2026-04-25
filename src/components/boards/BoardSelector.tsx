"use client";

import { useBoardStore } from "@/store/useBoardStore";
import { Dropdown } from "@/components/common/Dropdown";
import { ChevronDownIcon, PlusIcon } from "lucide-react";

export function BoardSelector() {
  const { allBoards, setCurrentBoard } = useBoardStore();

  return (
    <Dropdown
      trigger={
        <button className="flex items-center gap-2 px-3 py-2 rounded border border-gray-200 bg-white hover:bg-gray-50">
          <span className="text-sm font-medium">All Boards</span>
          <ChevronDownIcon className="w-4 h-4" />
        </button>
      }
    >
      <div className="space-y-1 p-2">
        {allBoards.map((board) => (
          <button
            key={board.id}
            className="flex items-center gap-2 w-full text-left p-2 rounded hover:bg-gray-100"
            onClick={() => setCurrentBoard(board.id)}
          >
            <div className="flex-1">
              <span className="text-sm font-medium">{board.title}</span>
              {board.description && (
                <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">
                  {board.description}
                </p>
              )}
            </div>
          </button>
        ))}
        {allBoards.length === 0 && (
          <p className="text-xs text-gray-500 px-2 py-1.5">
            No boards yet
          </p>
        )}
        <div className="mt-3 pt-2 border-t border-gray-100">
          <button
            className="flex items-center gap-2 w-full text-left p-2 rounded hover:bg-gray-100"
          >
            <PlusIcon className="w-4 h-4" />
            <span className="text-sm font-medium">New Board</span>
          </button>
        </div>
      </div>
    </Dropdown>
  );
}
