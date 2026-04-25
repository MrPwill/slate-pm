"use client";

import { useDroppable } from "@dnd-kit/core";
import { ColumnTitleInput } from "@/components/ColumnTitleInput";
import { AddCardForm } from "@/components/AddCardForm";
import { SortableCard } from "@/components/SortableCard";
import type { Column } from "@/types/board";

type BoardColumnProps = {
  column: Column;
};

export function BoardColumn({ column }: BoardColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
    data: {
      type: "column",
    },
  });

  return (
    <section
      ref={setNodeRef}
      data-column-id={column.id}
      className={`flex flex-1 min-w-[280px] max-w-[400px] shrink-0 flex-col rounded-[1.75rem] border px-4 py-4 shadow-[0_18px_50px_rgba(5,20,71,0.12)] transition ${
        isOver
          ? "border-[var(--slate-blue)] bg-[rgba(8,17,79,0.9)]"
          : "border-[rgba(255,255,255,0.22)] bg-[linear-gradient(180deg,rgba(8,17,79,0.82),rgba(11,23,98,0.74))]"
      }`}
    >
      <header className="sticky top-0 z-10 rounded-2xl bg-[rgba(255,255,255,0.08)] px-2 py-2 backdrop-blur-md">
        <div className="space-y-1">
          <div className="flex items-center justify-between gap-3">
            <ColumnTitleInput column={column} />
            <span className="rounded-full border border-white/12 bg-white/8 px-2.5 py-1 text-xs font-semibold text-white/72">
              {column.cards.length}
            </span>
          </div>
          {column.description && (
            <p className="px-2 text-xs text-white/40">{column.description}</p>
          )}
        </div>
      </header>

      <div className="mt-4 flex min-h-[240px] flex-1 flex-col gap-3">
        {column.cards.length === 0 ? (
          <div className="flex flex-1 items-center justify-center rounded-2xl border border-dashed border-white/10 bg-white/4 px-4 py-8 text-center">
            <p className="text-sm text-white/36">
              {column.id === "backlog" && "Add ideas and future tasks here"}
              {column.id === "todo" && "Tasks ready to be worked on"}
              {column.id === "in-progress" && "Tasks currently being worked on"}
              {column.id === "review" && "Tasks awaiting verification"}
              {column.id === "done" && "Completed tasks appear here"}
            </p>
          </div>
        ) : (
          column.cards.map((card) => (
            <SortableCard key={card.id} card={card} columnId={column.id} />
          ))
        )}
      </div>

      <div className="mt-4">
        <AddCardForm columnId={column.id} />
      </div>
    </section>
  );
}
