import { beforeEach, describe, expect, it } from "vitest";
import { createBoardState } from "@/store/useBoardStore";

describe("useBoardStore", () => {
  let store: ReturnType<typeof createBoardState>;

  beforeEach(() => {
    store = createBoardState();
  });

  it("registers and logs in a user with persistent board data", () => {
    const registerResult = store.getState().registerUser({
      name: "Prince",
      email: "prince@example.com",
      password: "secret123",
    });

    expect(registerResult.ok).toBe(true);
    expect(store.getState().currentUserId).not.toBeNull();

    store.getState().logoutUser();
    expect(store.getState().currentUserId).toBeNull();

    const loginResult = store.getState().loginUser({
      email: "prince@example.com",
      password: "secret123",
    });

    expect(loginResult.ok).toBe(true);
    expect(store.getState().currentUserId).not.toBeNull();
  });

  it("adds a card to the selected column", () => {
    const before = store.getState().columns.find((column) => column.id === "todo")?.cards.length ?? 0;

    store.getState().addCard("todo", {
      id: "new-card",
      title: "New card",
      details: "Created in test",
    });

    const column = store.getState().columns.find((entry) => entry.id === "todo");
    expect(column?.cards).toHaveLength(before + 1);
    expect(column?.cards.at(-1)?.title).toBe("New card");
  });

  it("deletes only the targeted card", () => {
    store.getState().deleteCard("backlog", "b1");

    const backlog = store.getState().columns.find((column) => column.id === "backlog");
    const todo = store.getState().columns.find((column) => column.id === "todo");

    expect(backlog?.cards.find((card) => card.id === "b1")).toBeUndefined();
    expect(todo?.cards).toHaveLength(2);
  });

  it("renames only the targeted column", () => {
    store.getState().renameColumn("review", "QA");

    const review = store.getState().columns.find((column) => column.id === "review");
    const done = store.getState().columns.find((column) => column.id === "done");

    expect(review?.title).toBe("QA");
    expect(done?.title).toBe("Done");
  });

  it("reorders cards within a column", () => {
    store.getState().moveCard(
      { columnId: "backlog", index: 0 },
      { columnId: "backlog", index: 2 },
    );

    const backlog = store.getState().columns.find((column) => column.id === "backlog");
    expect(backlog?.cards.map((card) => card.id)).toEqual(["b2", "b3", "b1"]);
  });

  it("moves cards across columns at an arbitrary index", () => {
    store.getState().moveCard(
      { columnId: "todo", index: 1 },
      { columnId: "review", index: 1 },
    );

    const todo = store.getState().columns.find((column) => column.id === "todo");
    const review = store.getState().columns.find((column) => column.id === "review");

    expect(todo?.cards.map((card) => card.id)).toEqual(["t1"]);
    expect(review?.cards.map((card) => card.id)).toEqual(["r1", "t2", "r2"]);
  });

  it("stores completed task records and lets users delete them", () => {
    const initialRecords = store.getState().completedRecords.length;

    store.getState().moveCard(
      { columnId: "todo", index: 0 },
      { columnId: "done", index: 0 },
    );

    const record = store
      .getState()
      .completedRecords.find((entry) => entry.cardId === "t1");

    expect(store.getState().completedRecords).toHaveLength(initialRecords + 1);
    expect(record?.title).toBe("Refine card typography");

    if (record) {
      store.getState().deleteCompletedRecord(record.id);
    }

    expect(
      store.getState().completedRecords.find((entry) => entry.cardId === "t1"),
    ).toBeUndefined();
  });
});
