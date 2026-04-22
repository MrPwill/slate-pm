"use client";

import { FormEvent, useState, useTransition } from "react";
import { createBoardSnapshot } from "@/lib/ai";
import { useBoardStore } from "@/store/useBoardStore";
import type { AiTaskResponse } from "@/types/board";

export function AiTaskPanel() {
  const columns = useBoardStore((state) => state.columns);
  const addGeneratedCards = useBoardStore((state) => state.addGeneratedCards);
  const [prompt, setPrompt] = useState("");
  const [targetColumnId, setTargetColumnId] = useState(columns[0]?.id ?? "");
  const [summary, setSummary] = useState("");
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextPrompt = prompt.trim();

    if (!nextPrompt) {
      setError("Add a prompt first.");
      return;
    }

    setError("");
    setSummary("");

    startTransition(async () => {
      const response = await fetch("/api/generate-tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: nextPrompt,
          columns,
          targetColumnId,
          boardSnapshot: createBoardSnapshot(columns),
        }),
      });

      const data = (await response.json()) as { error?: string } & Partial<AiTaskResponse>;

      if (!response.ok || !data.summary) {
        setError(data.error ?? "Task generation failed.");
        return;
      }

      setSummary(data.summary);
      if (data.tasks?.length) {
        addGeneratedCards(targetColumnId, data.tasks);
      }
      setPrompt("");
    });
  };

  return (
    <form
      className="rounded-[1.75rem] border border-white/30 bg-[var(--slate-panel-strong)] p-5 shadow-[0_20px_60px_rgba(5,20,71,0.28)]"
      onSubmit={handleSubmit}
    >
      <div className="space-y-4">
        <div className="space-y-2">
          <p className="text-sm font-semibold text-[var(--slate-cream)]">Generate tasks</p>
          <p className="text-sm leading-6 text-white/68">
            Ask for new tasks, project status, blockers, or the next best update.
          </p>
        </div>
        <label className="space-y-2 text-sm text-white/76">
          <span className="block text-xs font-semibold uppercase tracking-[0.22em] text-[var(--slate-blue-soft)]">
            Prompt
          </span>
          <textarea
            aria-label="Prompt"
            className="min-h-28 w-full rounded-2xl border border-white/12 bg-white/8 px-4 py-3 text-sm text-[var(--slate-cream)] outline-none transition focus:border-[var(--slate-blue)] focus:bg-white/12"
            placeholder="Ask for next tasks, a project update, or current board status."
            value={prompt}
            onChange={(event) => setPrompt(event.target.value)}
          />
        </label>
        <label className="space-y-2 text-sm text-white/76">
          <span className="block text-xs font-semibold uppercase tracking-[0.22em] text-[var(--slate-blue-soft)]">
            Insert Into
          </span>
          <select
            aria-label="Insert Into"
            className="w-full rounded-2xl border border-white/12 bg-white/8 px-4 py-3 text-sm text-[var(--slate-cream)] outline-none transition focus:border-[var(--slate-blue)]"
            value={targetColumnId}
            onChange={(event) => setTargetColumnId(event.target.value)}
          >
            {columns.map((column) => (
              <option key={column.id} value={column.id} className="bg-[var(--slate-ink)] text-white">
                {column.title}
              </option>
            ))}
          </select>
        </label>
        <button
          type="submit"
          className="inline-flex h-11 items-center justify-center rounded-full bg-[var(--slate-blue)] px-5 text-sm font-semibold text-[var(--slate-navy)] transition hover:scale-[1.01] hover:bg-[var(--slate-blue-soft)] disabled:cursor-not-allowed disabled:opacity-60"
          disabled={isPending}
        >
          {isPending ? "Thinking..." : "Ask AI"}
        </button>
        {summary ? (
          <div className="rounded-2xl border border-white/12 bg-white/8 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--slate-blue-soft)]">
              Project Update
            </p>
            <p className="mt-2 text-sm leading-6 text-white/82">{summary}</p>
          </div>
        ) : null}
        {error ? <p className="text-sm text-[#ffe08a]">{error}</p> : null}
      </div>
    </form>
  );
}
