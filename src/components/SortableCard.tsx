"use client";

import { CSS } from "@dnd-kit/utilities";
import { useSortable } from "@dnd-kit/sortable";
import { BoardCard } from "@/components/BoardCard";
import type { Card } from "@/types/board";

type SortableCardProps = {
  card: Card;
  columnId: string;
};

export function SortableCard({ card, columnId }: SortableCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: card.id,
    data: {
      type: "card",
    },
  });

  return (
    <div
      ref={setNodeRef}
      data-sortable-id={card.id}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}
      className={isDragging ? "opacity-40" : ""}
      {...attributes}
      {...listeners}
    >
      <BoardCard card={card} columnId={columnId} />
    </div>
  );
}
