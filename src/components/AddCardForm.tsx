"use client";

import { FormEvent, useState } from "react";
import { useBoardStore } from "@/store/useBoardStore";

type AddCardFormProps = {
  columnId: string;
};

export function AddCardForm({ columnId }: AddCardFormProps) {
  const addCard = useBoardStore((state) => state.addCard);
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [details, setDetails] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextTitle = title.trim();

    if (!nextTitle) {
      return;
    }

    addCard(columnId, {
      id: crypto.randomUUID(),
      title: nextTitle,
      details: details.trim(),
    });

    setTitle("");
    setDetails("");
    setOpen(false);
  };

  if (!open) {
    return (
      <button
        type="button"
        className="flex h-12 w-full items-center justify-center rounded-2xl border border-dashed border-white/18 bg-white/6 text-sm font-medium text-white/74 transition hover:border-[var(--slate-blue)] hover:bg-white/10 hover:text-white"
        onClick={() => setOpen(true)}
      >
        Add card
      </button>
    );
  }

  return (
    <form
      className="space-y-3 rounded-2xl border border-white/12 bg-white/8 p-3"
      onSubmit={handleSubmit}
    >
      <input
        aria-label="Card title"
        className="w-full rounded-xl border border-white/12 bg-white/10 px-3 py-2 text-sm text-white outline-none transition placeholder:text-white/42 focus:border-[var(--slate-blue)]"
        placeholder="Card title"
        value={title}
        onChange={(event) => setTitle(event.target.value)}
      />
      <textarea
        aria-label="Card details"
        className="min-h-20 w-full rounded-xl border border-white/12 bg-white/10 px-3 py-2 text-sm text-white outline-none transition placeholder:text-white/42 focus:border-[var(--slate-blue)]"
        placeholder="Details"
        value={details}
        onChange={(event) => setDetails(event.target.value)}
      />
      <div className="flex gap-2">
        <button
          type="submit"
          className="inline-flex h-10 items-center justify-center rounded-full bg-[var(--slate-yellow)] px-4 text-sm font-semibold text-[var(--slate-navy)] transition hover:scale-[1.01] hover:brightness-105"
        >
          Save
        </button>
        <button
          type="button"
          className="inline-flex h-10 items-center justify-center rounded-full border border-white/12 px-4 text-sm font-medium text-white/72 transition hover:bg-white/10"
          onClick={() => setOpen(false)}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
