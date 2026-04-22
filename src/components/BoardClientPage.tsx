"use client";

import { useEffect, useState } from "react";
import { BoardApp } from "@/components/BoardApp";

export function BoardClientPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <main className="min-h-screen px-4 py-6 sm:px-6 lg:px-10">
        <div className="mx-auto flex min-h-[calc(100vh-3rem)] max-w-[1600px] items-center justify-center rounded-[2rem] border border-[rgba(8,17,79,0.08)] bg-[rgba(255,255,255,0.42)] p-8 shadow-[var(--slate-shadow)] backdrop-blur-xl">
          <p className="text-sm font-medium text-[var(--slate-navy)]/70">Loading board...</p>
        </div>
      </main>
    );
  }

  return <BoardApp />;
}
