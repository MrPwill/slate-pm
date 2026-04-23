import type { AiTask, AiTaskResponse, Column } from "@/types/board";

export function parseTaskTitles(content: string): AiTask[] {
  const lines = content.split("\n").map((line) => line.trim()).filter(Boolean);
  return lines.map((line) => ({
    title: line.replace(/^[-*\d.)\s]+/, "").trim(),
    details: "",
  })).slice(0, 5);
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
    const tasks: AiTask[] = Array.isArray(parsed.tasks)
      ? parsed.tasks
          .filter((task): task is { title: string; details: string } => 
            typeof task === "object" && task !== null && typeof task.title === "string"
          )
          .map((task) => ({
            title: task.title.trim(),
            details: task.details?.trim() || "",
          }))
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
