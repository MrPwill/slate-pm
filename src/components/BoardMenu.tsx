"use client";

import { type Board } from "@/types/board";

function MoreVerticalIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <circle cx="12" cy="12" r="1" />
      <circle cx="12" cy="5" r="1" />
      <circle cx="12" cy="19" r="1" />
    </svg>
  );
}

function EditIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  );
}

function UsersIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 00-3-3.87" />
      <path d="M16 3.13a4 4 0 010 7.75" />
    </svg>
  );
}

function Trash2Icon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <path d="M3 6h18" />
      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
    </svg>
  );
}

interface BoardMenuProps {
  board: Board;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onDelete: () => void;
}

export function BoardMenu({
  board: _board,
  isOpen,
  onOpenChange,
  onDelete,
}: BoardMenuProps) {
  return (
    <div className="relative">
      <button
        type="button"
        className="w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gray-100 rounded"
        onClick={(e) => {
          e.stopPropagation();
          onOpenChange(!isOpen);
        }}
      >
        <MoreVerticalIcon className="w-4 h-4" />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => onOpenChange(false)}
          />
          <div className="absolute right-0 mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
            <button
              type="button"
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
              onClick={(e) => {
                e.stopPropagation();
                onOpenChange(false);
              }}
            >
              <EditIcon className="w-4 h-4" />
              <span>Edit Board</span>
            </button>
            <button
              type="button"
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
              onClick={(e) => {
                e.stopPropagation();
                onOpenChange(false);
              }}
            >
              <UsersIcon className="w-4 h-4" />
              <span>Invite Members</span>
            </button>
            <button
              type="button"
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-gray-50"
              onClick={(e) => {
                e.stopPropagation();
                onOpenChange(false);
                onDelete();
              }}
            >
              <Trash2Icon className="w-4 h-4" />
              <span>Delete Board</span>
            </button>
          </div>
        </>
      )}
    </div>
  );
}