"use client";

import { FormEvent, useState, useTransition } from "react";
import { createBoardSnapshot } from "@/lib/ai";
import { useBoardStore } from "@/store/useBoardStore";
import type { AiTaskResponse } from "@/types/board";

export function AiTaskPanel() {
  const columns = useBoardStore((state) => state.columns);
  const addGeneratedCards = useBoardStore((state) => state.addGeneratedCards);
  const executeAiActions = useBoardStore((state) => state.executeAiActions);
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
        const combinedTitle = data.tasks[0]?.title || prompt;
        const combinedDetails = data.tasks
          .map((task, index) => `${index + 1}. ${task.title}\n${task.details}`)
          .join("\n\n");
        addGeneratedCards(targetColumnId, [{ title: combinedTitle, details: combinedDetails }]);
      }
      if (data.actions?.length) {
        executeAiActions(data.actions);
      }
      setPrompt("");
    });
  };

  return (
    <form
      className="flex flex-wrap items-center gap-4 rounded-[1.75rem] border border-white/30 bg-[var(--slate-panel-strong)] px-6 py-4 shadow-[0_20px_60px_rgba(5,20,71,0.28)]"
      onSubmit={handleSubmit}
    >
      <div className="flex items-center gap-2">
        <p className="text-sm font-semibold text-[var(--slate-cream)]">Ask AI</p>
      </div>
      <label className="flex-1 min-w-[280px] text-sm text-white/76">
        <input
          type="text"
          aria-label="Prompt"
          className="w-full rounded-2xl border border-white/12 bg-white/8 px-4 py-3 text-sm text-[var(--slate-cream)] outline-none transition focus:border-[var(--slate-blue)] focus:bg-white/12"
          placeholder="Ask for next tasks, a project update, or current board status."
          value={prompt}
          onChange={(event) => setPrompt(event.target.value)}
        />
      </label>
      <label className="text-sm text-white/76">
        <select
          aria-label="Insert Into"
          className="rounded-2xl border border-white/12 bg-white/8 px-4 py-3 text-sm text-[var(--slate-cream)] outline-none transition focus:border-[var(--slate-blue)]"
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
        className="inline-flex h-11 shrink-0 items-center justify-center rounded-full bg-[var(--slate-blue)] px-6 text-sm font-semibold text-[var(--slate-navy)] transition hover:scale-[1.01] hover:bg-[var(--slate-blue-soft)] disabled:cursor-not-allowed disabled:opacity-60"
        disabled={isPending}
      >
        {isPending ? "Thinking..." : "Generate"}
      </button>
      {summary ? (
        <div className="w-full rounded-2xl border border-white/12 bg-white/8 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--slate-blue-soft)]">
            Project Update
          </p>
          <p className="mt-2 text-sm leading-6 text-white/82">{summary}</p>
        </div>
      ) : null}
      {error ? <p className="w-full text-sm text-[#ffe08a]">{error}</p> : null}
    </form>
  );
}
