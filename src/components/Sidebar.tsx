"use client";

import { useState } from "react";
import { BoardList } from "./BoardList";

interface SidebarProps {
  onBoardSettings: (boardId: string) => void;
}

export function Sidebar({ onBoardSettings }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <>
      {/* Mobile toggle button */}
      <button
        type="button"
        className="fixed top-4 left-4 z-50 lg:hidden bg-white/80 backdrop-blur-sm rounded-full border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-white shadow-sm"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="text-lg font-bold">{isOpen ? "×" : "☰"}</span>
      </button>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-full w-80 bg-white border-r border-gray-200 z-40
          transform transition-transform duration-200 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0 lg:static lg:w-80 lg:h-screen
        `}
      >
        <BoardList />
      </aside>
    </>
  );
}
