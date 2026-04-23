import type { AiTask, AiTaskResponse, AiAction, Column } from "@/types/board";

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

    const actions: AiAction[] = Array.isArray(parsed.actions)
      ? parsed.actions
          .filter((action): action is AiAction =>
            typeof action === "object" &&
            action !== null &&
            ["create", "move", "update"].includes(action.action)
          )
          .map((action) => ({
            action: action.action,
            title: action.title?.trim(),
            details: action.details?.trim(),
            cardId: action.cardId?.trim(),
            sourceColumnId: action.sourceColumnId?.trim(),
            sourceIndex: typeof action.sourceIndex === "number" ? action.sourceIndex : undefined,
            targetColumnId: action.targetColumnId?.trim(),
            targetIndex: typeof action.targetIndex === "number" ? action.targetIndex : undefined,
          }))
          .slice(0, 3)
      : [];

    if (!summary) {
      return null;
    }

    return {
      summary,
      tasks,
      actions,
    };
  } catch {
    return null;
  }
}
