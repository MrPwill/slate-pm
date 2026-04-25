"use client";

import { useBoardStore } from "@/store/useBoardStore";

import { BoardSelector } from "@/components/boards/BoardSelector";
import { LogOutIcon, UserIcon } from "lucide-react";

export function TopBar() {
  const { currentUserId, users, logoutUser } = useBoardStore();
  const currentUser = users.find((user) => user.id === currentUserId);

  return (
    <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-gray-200">
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-bold text-gray-900">Slate PM</h1>
        <BoardSelector />
      </div>
      <div className="flex items-center gap-3">
        {currentUserId && currentUser ? (
          <div className="relative">
            <button
              className="flex items-center gap-2 p-2 rounded hover:bg-gray-100"
              onClick={(e) => {
                e.stopPropagation();
                // In a real app, this would open a dropdown
              }}
            >
              <UserIcon className="w-4 h-4" />
              <span className="text-sm font-medium">{currentUser.name}</span>
            </button>
          </div>
        ) : null}
        <button
          className="p-2 rounded hover:bg-gray-100"
          onClick={logoutUser}
        >
          <LogOutIcon className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
