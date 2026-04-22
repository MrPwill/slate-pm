import type { Column } from "@/types/board";

export function createInitialColumns(): Column[] {
  return [
    {
      id: "backlog",
      title: "Backlog",
      cards: [
        { id: "b1", title: "Audit empty states", details: "Check board messaging, spacing, and call to action." },
        { id: "b2", title: "Map drag edge cases", details: "List reorder and cross-column drop states to verify." },
        { id: "b3", title: "Draft sprint focus", details: "Capture the next three meaningful product tasks." },
      ],
    },
    {
      id: "todo",
      title: "Todo",
      cards: [
        { id: "t1", title: "Refine card typography", details: "Tighten title rhythm and muted detail contrast." },
        { id: "t2", title: "Tune add-card flow", details: "Keep creation inline and fast on desktop and mobile." },
      ],
    },
    {
      id: "in-progress",
      title: "In Progress",
      cards: [
        { id: "i1", title: "Wire drag overlay", details: "Add scale, blur-free follow, and stronger elevation." },
        { id: "i2", title: "Balance column spacing", details: "Ensure equal widths and stable horizontal scan." },
        { id: "i3", title: "Polish focus states", details: "Use blue accents without harsh outlines." },
      ],
    },
    {
      id: "review",
      title: "Review",
      cards: [
        { id: "r1", title: "Check AI prompts", details: "Make outputs atomic and implementation-ready." },
        { id: "r2", title: "Review touch drag", details: "Verify movement feels immediate on smaller screens." },
      ],
    },
    {
      id: "done",
      title: "Done",
      cards: [
        { id: "d1", title: "Choose color system", details: "Lock the navy, blue, purple, and yellow palette." },
        { id: "d2", title: "Set board structure", details: "Keep exactly five columns and one board surface." },
      ],
    },
  ];
}
