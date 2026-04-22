import type { AiTaskResponse, Column } from "@/types/board";

export function parseTaskTitles(content: string): string[] {
  return content
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => line.replace(/^[-*\d.)\s]+/, "").trim())
    .filter(Boolean)
    .slice(0, 5);
}

export function createBoardSnapshot(columns: Column[]): string {
  return JSON.stringify(
    columns.map((column) => ({
      id: column.id,
      title: column.title,
      cards: column.cards.map((card) => ({
        id: card.id,
        title: card.title,
        details: card.details,
      })),
    })),
  );
}

export function parseAiResponse(content: string): AiTaskResponse | null {
  try {
    const parsed = JSON.parse(content) as Partial<AiTaskResponse>;
    const summary = parsed.summary?.trim();
    const tasks = Array.isArray(parsed.tasks)
      ? parsed.tasks
          .map((task) => String(task).trim())
          .filter(Boolean)
          .slice(0, 5)
      : [];

    if (!summary) {
      return null;
    }

    return {
      summary,
      tasks,
    };
  } catch {
    return null;
  }
}
