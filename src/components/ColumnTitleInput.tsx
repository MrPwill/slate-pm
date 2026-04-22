"use client";

import { useEffect, useState } from "react";
import { useBoardStore } from "@/store/useBoardStore";
import type { Column } from "@/types/board";

type ColumnTitleInputProps = {
  column: Column;
};

export function ColumnTitleInput({ column }: ColumnTitleInputProps) {
  const renameColumn = useBoardStore((state) => state.renameColumn);
  const [value, setValue] = useState(column.title);

  useEffect(() => {
    setValue(column.title);
  }, [column.title]);

  return (
    <input
      aria-label={`${column.title} column title`}
      className="w-full rounded-xl border border-transparent bg-transparent px-2 py-1 text-sm font-semibold text-white outline-none transition focus:border-[var(--slate-blue)] focus:bg-white/8"
      value={value}
      onChange={(event) => setValue(event.target.value)}
      onBlur={() => renameColumn(column.id, value.trim() || column.title)}
    />
  );
}
