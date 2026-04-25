import type { Card, Column, CompletedRecord } from "@/types/board";

export function createInitialColumns(): Column[] {
  return [
    {
      id: "backlog",
      title: "Backlog",
      description: "Ideas and future work",
      cards: [
        {
          id: "b1",
          title: "Setup project structure",
          details: "Initialize Next.js app with TypeScript and Tailwind",
        },
        {
          id: "b2",
          title: "Add Kanban board",
          details: "Implement drag-and-drop columns with dnd-kit",
        },
        {
          id: "b3",
          title: "Implement authentication",
          details: "Add user signup and login flow",
        },
      ],
    },
    {
      id: "todo",
      title: "Todo",
      description: "Ready to start",
      cards: [
        {
          id: "t1",
          title: "Refine card typography",
          details: "Adjust font sizes and weights for better hierarchy",
        },
        {
          id: "t2",
          title: "Add board settings",
          details: "Implement rename and delete board functionality",
        },
      ],
    },
    {
      id: "in-progress",
      title: "In Progress",
      description: "Currently working on",
      cards: [
        {
          id: "ip1",
          title: "Integrate Supabase",
          details: "Connect database for multi-board support",
        },
      ],
    },
    {
      id: "review",
      title: "Review",
      description: "Needs verification",
      cards: [
        {
          id: "r1",
          title: "Audit empty states",
          details: "Check all empty board and column states",
        },
        {
          id: "r2",
          title: "Map drag edge cases",
          details: "Verify cross-column drop behavior",
        },
      ],
    },
    {
      id: "done",
      title: "Done",
      description: "Completed tasks",
      cards: [],
    },
  ];
}

export function createInitialCompletedRecords(): CompletedRecord[] {
  return [
    {
      id: "cr1",
      cardId: "c1",
      title: "Choose color system",
      details: "Selected Tailwind CSS with slate color palette",
      completedAt: new Date().toISOString(),
    },
    {
      id: "cr2",
      cardId: "c2",
      title: "Setup build pipeline",
      details: "Configured Vite and TypeScript compilation",
      completedAt: new Date().toISOString(),
    },
  ];
}

export function createInitialBoardData(): {
  columns: Column[];
  completedRecords: CompletedRecord[];
} {
  const columns = createInitialColumns();
  const completedRecords = createInitialCompletedRecords();
  return { columns, completedRecords };
}
