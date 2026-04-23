"use client";

import { FormEvent, useState } from "react";
import { useBoardStore } from "@/store/useBoardStore";
import type { Card } from "@/types/board";

type BoardCardProps = {
  card: Card;
  columnId: string;
  isOverlay?: boolean;
};

function parseCardSections(details: string): { title: string; details: string }[] {
  const lines = details.split("\n").filter((line) => line.trim());
  const numberedSections: { title: string; details: string }[] = [];
  let currentTitle = "";
  let currentDetails: string[] = [];

  for (const line of lines) {
    const numberedMatch = line.match(/^(\d+[\.)]\s*)(.+)$/);
    if (numberedMatch) {
      if (currentTitle) {
        numberedSections.push({ title: currentTitle, details: currentDetails.join("\n") });
      }
      currentTitle = numberedMatch[2].trim();
      currentDetails = [];
    } else if (currentTitle) {
      currentDetails.push(line.replace(/^[-*]\s*/, ""));
    } else {
      const dashMatch = line.match(/^[-*]\s*(.+)$/);
      if (dashMatch) {
        currentTitle = dashMatch[1].trim();
        currentDetails = [];
      }
    }
  }

  if (currentTitle) {
    numberedSections.push({ title: currentTitle, details: currentDetails.join("\n") });
  }

  return numberedSections;
}

export function BoardCard({ card, columnId, isOverlay = false }: BoardCardProps) {
  const columns = useBoardStore((state) => state.columns);
  const addCard = useBoardStore((state) => state.addCard);
  const deleteCard = useBoardStore((state) => state.deleteCard);
  const updateCard = useBoardStore((state) => state.updateCard);
  const moveCard = useBoardStore((state) => state.moveCard);
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(card.title);
  const [details, setDetails] = useState(card.details);

  const canSplit = !isEditing && parseCardSections(card.details).length > 1;

  const handleSplit = () => {
    const sections = parseCardSections(card.details);
    if (sections.length <= 1) return;

    const columnIndex = columns.findIndex((col) => col.id === columnId);
    if (columnIndex < 0) return;

    sections.forEach((section, idx) => {
      addCard(columnId, {
        id: crypto.randomUUID(),
        title: section.title,
        details: section.details,
      });
    });

    deleteCard(columnId, card.id);
  };

  const columnIndex = columns.findIndex((column) => column.id === columnId);
  const currentColumn = columnIndex >= 0 ? columns[columnIndex] : null;
  const cardIndex = currentColumn?.cards.findIndex((entry) => entry.id === card.id) ?? -1;

  const moveWithinColumn = (offset: number) => {
    if (!currentColumn || cardIndex < 0) {
      return;
    }

    const destinationIndex = cardIndex + offset;

    if (destinationIndex < 0 || destinationIndex >= currentColumn.cards.length) {
      return;
    }

    moveCard(
      { columnId, index: cardIndex },
      { columnId, index: destinationIndex },
    );
  };

  const moveToAdjacentColumn = (offset: number) => {
    if (!currentColumn || cardIndex < 0) {
      return;
    }

    const destinationColumn = columns[columnIndex + offset];

    if (!destinationColumn) {
      return;
    }

    moveCard(
      { columnId, index: cardIndex },
      { columnId: destinationColumn.id, index: destinationColumn.cards.length },
    );
  };

  const handleSave = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextTitle = title.trim();

    if (!nextTitle) {
      return;
    }

    updateCard(columnId, card.id, {
      title: nextTitle,
      details: details.trim(),
    });
    setIsEditing(false);
  };

  return (
    <article
      data-card-id={card.id}
      className={`group rounded-[1.35rem] border border-white/55 bg-[var(--slate-card)] p-4 shadow-[0_18px_40px_rgba(6,15,70,0.18)] transition duration-200 ease-in-out hover:scale-[1.015] hover:bg-[var(--slate-card-hover)] ${
        isOverlay ? "shadow-[0_28px_70px_rgba(6,15,70,0.28)]" : ""
      }`}
    >
      {isEditing && !isOverlay ? (
        <form className="space-y-3" onSubmit={handleSave}>
          <input
            aria-label={`Edit title for ${card.title}`}
            className="w-full rounded-xl border border-[rgba(8,17,79,0.12)] bg-white/80 px-3 py-2 text-sm font-semibold text-[var(--slate-navy)] outline-none transition focus:border-[var(--slate-blue)]"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
          />
          <textarea
            aria-label={`Edit details for ${card.title}`}
            className="min-h-20 w-full rounded-xl border border-[rgba(8,17,79,0.12)] bg-white/80 px-3 py-2 text-sm text-[var(--slate-navy)] outline-none transition focus:border-[var(--slate-blue)]"
            value={details}
            onChange={(event) => setDetails(event.target.value)}
          />
          <div className="flex gap-2">
            <button
              type="submit"
              className="rounded-full bg-[var(--slate-navy)] px-3 py-2 text-xs font-semibold text-white transition hover:bg-[var(--slate-navy-soft)]"
            >
              Update
            </button>
            <button
              type="button"
              className="rounded-full border border-[rgba(8,17,79,0.12)] px-3 py-2 text-xs font-semibold text-[var(--slate-navy)]/60 transition hover:bg-[rgba(8,17,79,0.06)]"
              onClick={() => {
                setTitle(card.title);
                setDetails(card.details);
                setIsEditing(false);
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-[var(--slate-navy)]">{card.title}</h3>
            <p className="whitespace-pre-line text-sm leading-6 text-[var(--slate-navy)]/58">{card.details || "No details"}</p>
            {!isOverlay ? (
              <div className="flex flex-wrap gap-1 pt-1">
                <button
                  type="button"
                  aria-label={`Move up ${card.title}`}
                  className="rounded-full px-2 py-1 text-[11px] font-semibold text-[var(--slate-navy)]/42 transition hover:bg-[rgba(8,17,79,0.08)] hover:text-[var(--slate-navy)]"
                  onClick={() => moveWithinColumn(-1)}
                >
                  Up
                </button>
                <button
                  type="button"
                  aria-label={`Move down ${card.title}`}
                  className="rounded-full px-2 py-1 text-[11px] font-semibold text-[var(--slate-navy)]/42 transition hover:bg-[rgba(8,17,79,0.08)] hover:text-[var(--slate-navy)]"
                  onClick={() => moveWithinColumn(1)}
                >
                  Down
                </button>
                <button
                  type="button"
                  aria-label={`Move left ${card.title}`}
                  className="rounded-full px-2 py-1 text-[11px] font-semibold text-[var(--slate-navy)]/42 transition hover:bg-[rgba(8,17,79,0.08)] hover:text-[var(--slate-navy)]"
                  onClick={() => moveToAdjacentColumn(-1)}
                >
                  Left
                </button>
                <button
                  type="button"
                  aria-label={`Move right ${card.title}`}
                  className="rounded-full px-2 py-1 text-[11px] font-semibold text-[var(--slate-navy)]/42 transition hover:bg-[rgba(8,17,79,0.08)] hover:text-[var(--slate-navy)]"
                  onClick={() => moveToAdjacentColumn(1)}
                >
                  Right
                </button>
              </div>
            ) : null}
          </div>
          {!isOverlay ? (
            <div className="flex shrink-0 gap-1">
              {canSplit && (
                <button
                  type="button"
                  aria-label={`Split ${card.title}`}
                  className="rounded-full px-2 py-1 text-xs font-semibold text-[var(--slate-blue)] transition hover:bg-[rgba(8,17,79,0.08)] hover:text-[var(--slate-blue)]"
                  onClick={handleSplit}
                >
                  Split
                </button>
              )}
              <button
                type="button"
                aria-label={`Edit ${card.title}`}
                className="rounded-full px-2 py-1 text-xs font-semibold text-[var(--slate-navy)]/42 transition hover:bg-[rgba(8,17,79,0.08)] hover:text-[var(--slate-navy)]"
                onClick={() => setIsEditing(true)}
              >
                Edit
              </button>
              <button
                type="button"
                aria-label={`Delete ${card.title}`}
                className="rounded-full px-2 py-1 text-xs font-semibold text-[var(--slate-navy)]/42 transition hover:bg-[rgba(8,17,79,0.08)] hover:text-[var(--slate-navy)]"
                onClick={() => deleteCard(columnId, card.id)}
              >
                Delete
              </button>
            </div>
          ) : null}
        </div>
      )}
    </article>
  );
}
