"use client";

import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { TopBar } from "@/components/layout/TopBar";

import { BoardSettingsPanel } from "@/components/BoardSettingsPanel";

interface BoardLayoutProps {
  children: React.ReactNode;
  boardId?: string;
  onBoardSettings?: (boardId: string) => void;
}

export function BoardLayout({ 
  children, 
  boardId,
  onBoardSettings 
}: BoardLayoutProps) {
  const [isSettingsOpen, _setIsSettingsOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar onBoardSettings={onBoardSettings} />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <TopBar />
        <div className="flex-1 overflow-hidden">
          {children}
        </div>
      </div>
      
      {/* Board Settings Panel */}
      {boardId && isSettingsOpen && (
        <div className="fixed inset-0 z-50 flex items-end">
          <div className="w-80 bg-white border-l border-gray-200 p-4 overflow-y-auto max-h-full">
            <BoardSettingsPanel 
              boardId={boardId} 
              onClose={() => _setIsSettingsOpen(false)}
            />
          </div>
          <div 
            className="flex-1 bg-black/50 backdrop-blur-sm"
            onClick={() => _setIsSettingsOpen(false)}
          />
        </div>
      )}
    </div>
  );
}
