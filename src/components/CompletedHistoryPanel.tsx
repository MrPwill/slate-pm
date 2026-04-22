"use client";

import { useBoardStore } from "@/store/useBoardStore";

export function CompletedHistoryPanel() {
  const completedRecords = useBoardStore((state) => state.completedRecords);
  const deleteCompletedRecord = useBoardStore((state) => state.deleteCompletedRecord);

  return (
    <section className="rounded-[1.75rem] border border-white/30 bg-[var(--slate-panel-strong)] p-5 shadow-[0_20px_60px_rgba(5,20,71,0.24)]">
      <div className="space-y-4">
        <div className="space-y-2">
          <p className="text-sm font-semibold text-[var(--slate-cream)]">Completed history</p>
          <p className="text-sm leading-6 text-white/68">
            Keep a record of completed tasks and delete old entries whenever you want.
          </p>
        </div>

        <div className="max-h-[320px] space-y-3 overflow-y-auto pr-1">
          {completedRecords.length ? (
            completedRecords.map((record) => (
              <article
                key={record.id}
                className="rounded-2xl border border-white/12 bg-white/8 p-4"
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <h3 className="text-sm font-semibold text-white">{record.title}</h3>
                      <p className="text-xs uppercase tracking-[0.18em] text-[var(--slate-blue-soft)]">
                        {new Date(record.completedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <button
                      type="button"
                      aria-label={`Delete history for ${record.title}`}
                      className="rounded-full px-2 py-1 text-xs font-semibold text-white/58 transition hover:bg-white/10 hover:text-white"
                      onClick={() => deleteCompletedRecord(record.id)}
                    >
                      Delete
                    </button>
                  </div>
                  <p className="text-sm leading-6 text-white/68">
                    {record.details || "No details saved for this completed task."}
                  </p>
                </div>
              </article>
            ))
          ) : (
            <div className="rounded-2xl border border-dashed border-white/14 bg-white/6 px-4 py-6 text-sm text-white/68">
              Completed tasks will appear here when cards reach the Done column.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
