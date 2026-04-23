import type { Column } from "@/types/board";

export function createInitialColumns(): Column[] {
  return [
    {
      id: "backlog",
      title: "Backlog",
      description: "Ideas and future work",
      cards: [],
    },
    {
      id: "todo",
      title: "Todo",
      description: "Ready to start",
      cards: [],
    },
    {
      id: "in-progress",
      title: "In Progress",
      description: "Currently working on",
      cards: [],
    },
    {
      id: "review",
      title: "Review",
      description: "Needs verification",
      cards: [],
    },
    {
      id: "done",
      title: "Done",
      description: "Completed tasks",
      cards: [],
    },
  ];
}
