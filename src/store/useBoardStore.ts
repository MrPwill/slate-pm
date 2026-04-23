"use client";

import { create, type StateCreator } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { createInitialColumns } from "@/lib/seed";
import type {
  AiTask,
  AuthResult,
  Card,
  CardLocation,
  Column,
  CompletedRecord,
  UserAccount,
  UserBoardData,
} from "@/types/board";

export type BoardState = {
  users: UserAccount[];
  currentUserId: string | null;
  boardsByUserId: Record<string, UserBoardData>;
  columns: Column[];
  completedRecords: CompletedRecord[];
  registerUser: (input: { name: string; email: string; password: string }) => AuthResult;
  loginUser: (input: { email: string; password: string }) => AuthResult;
  logoutUser: () => void;
  addCard: (columnId: string, card: Card) => void;
  deleteCard: (columnId: string, cardId: string) => void;
  updateCard: (columnId: string, cardId: string, updates: Pick<Card, "title" | "details">) => void;
  moveCard: (source: CardLocation, destination: CardLocation) => void;
  renameColumn: (columnId: string, title: string) => void;
  addGeneratedCards: (columnId: string, tasks: AiTask[]) => void;
  deleteCompletedRecord: (recordId: string) => void;
  resetBoard: () => void;
  resetApp: () => void;
};

const cloneColumns = (columns: Column[]) =>
  columns.map((column) => ({
    ...column,
    cards: column.cards.map((card) => ({ ...card })),
  }));

const cloneCompletedRecords = (records: CompletedRecord[]) =>
  records.map((record) => ({ ...record }));

const getDoneCards = (columns: Column[]) =>
  columns.find((column) => column.id === "done")?.cards ?? [];

function createInitialCompletedRecords(columns: Column[]): CompletedRecord[] {
  return getDoneCards(columns).map((card) => ({
    id: crypto.randomUUID(),
    cardId: card.id,
    title: card.title,
    details: card.details,
    completedAt: new Date().toISOString(),
  }));
}

function createUserBoardData(): UserBoardData {
  const columns = createInitialColumns();
  return {
    columns,
    completedRecords: createInitialCompletedRecords(columns),
  };
}

function syncCompletedRecords(
  previousColumns: Column[],
  nextColumns: Column[],
  existingRecords: CompletedRecord[],
) {
  const previousDoneIds = new Set(getDoneCards(previousColumns).map((card) => card.id));
  const nextDoneCards = getDoneCards(nextColumns);

  const nextRecords = cloneCompletedRecords(existingRecords);

  nextDoneCards.forEach((card) => {
    const existingRecord = nextRecords.find((record) => record.cardId === card.id);

    if (existingRecord) {
      existingRecord.title = card.title;
      existingRecord.details = card.details;
      return;
    }

    if (!previousDoneIds.has(card.id)) {
      nextRecords.unshift({
        id: crypto.randomUUID(),
        cardId: card.id,
        title: card.title,
        details: card.details,
        completedAt: new Date().toISOString(),
      });
    }
  });

  return nextRecords;
}

function syncUserBoard(
  state: BoardState,
  columns: Column[],
  completedRecords: CompletedRecord[],
) {
  if (!state.currentUserId) {
    return {
      columns,
      completedRecords,
    };
  }

  return {
    columns,
    completedRecords,
    boardsByUserId: {
      ...state.boardsByUserId,
      [state.currentUserId]: {
        columns: cloneColumns(columns),
        completedRecords: cloneCompletedRecords(completedRecords),
      },
    },
  };
}

function createInitialState(): Pick<
  BoardState,
  "users" | "currentUserId" | "boardsByUserId" | "columns" | "completedRecords"
> {
  const board = createUserBoardData();
  return {
    users: [],
    currentUserId: null,
    boardsByUserId: {},
    columns: board.columns,
    completedRecords: board.completedRecords,
  };
}

const createStoreState: StateCreator<BoardState> = (set, get) => ({
  ...createInitialState(),
  registerUser: ({ name, email, password }) => {
    const nextName = name.trim();
    const nextEmail = email.trim().toLowerCase();
    const nextPassword = password.trim();

    if (!nextName || !nextEmail || !nextPassword) {
      return { ok: false, error: "Name, email, and password are required." };
    }

    if (get().users.some((user) => user.email.toLowerCase() === nextEmail)) {
      return { ok: false, error: "An account with that email already exists." };
    }

    const user: UserAccount = {
      id: crypto.randomUUID(),
      name: nextName,
      email: nextEmail,
      password: nextPassword,
    };
    const board = createUserBoardData();

    set((state) => ({
      users: [...state.users, user],
      currentUserId: user.id,
      columns: cloneColumns(board.columns),
      completedRecords: cloneCompletedRecords(board.completedRecords),
      boardsByUserId: {
        ...state.boardsByUserId,
        [user.id]: board,
      },
    }));

    return { ok: true };
  },
  loginUser: ({ email, password }) => {
    const nextEmail = email.trim().toLowerCase();
    const user = get().users.find(
      (entry) => entry.email.toLowerCase() === nextEmail && entry.password === password,
    );

    if (!user) {
      return { ok: false, error: "Invalid email or password." };
    }

    const board = get().boardsByUserId[user.id] ?? createUserBoardData();

    set((state) => ({
      currentUserId: user.id,
      columns: cloneColumns(board.columns),
      completedRecords: cloneCompletedRecords(board.completedRecords),
      boardsByUserId: {
        ...state.boardsByUserId,
        [user.id]: {
          columns: cloneColumns(board.columns),
          completedRecords: cloneCompletedRecords(board.completedRecords),
        },
      },
    }));

    return { ok: true };
  },
  logoutUser: () =>
    set((state) => ({
      currentUserId: null,
      columns: createInitialColumns(),
      completedRecords: [],
      boardsByUserId: { ...state.boardsByUserId },
    })),
    addCard: (columnId, card) =>
      set((state) => ({
        ...syncUserBoard(
          state,
          state.columns.map((column) =>
          column.id === columnId ? { ...column, cards: [...column.cards, card] } : column,
        ),
          state.completedRecords,
        ),
      })),
    deleteCard: (columnId, cardId) =>
      set((state) => {
        const nextColumns = state.columns.map((column) =>
          column.id === columnId
            ? { ...column, cards: column.cards.filter((card) => card.id !== cardId) }
            : column,
        );
        const nextCompletedRecords = state.completedRecords.filter((record) => record.cardId !== cardId);

        return syncUserBoard(state, nextColumns, nextCompletedRecords);
      }),
    updateCard: (columnId, cardId, updates) =>
      set((state) => {
        const nextColumns = state.columns.map((column) =>
          column.id === columnId
            ? {
                ...column,
                cards: column.cards.map((card) =>
                  card.id === cardId ? { ...card, ...updates } : card,
                ),
              }
            : column,
        );
        const nextCompletedRecords = syncCompletedRecords(
          state.columns,
          nextColumns,
          state.completedRecords,
        );

        return syncUserBoard(state, nextColumns, nextCompletedRecords);
      }),
    moveCard: (source, destination) =>
      set((state) => {
        if (
          source.columnId === destination.columnId &&
          source.index === destination.index
        ) {
          return state;
        }

        const columns = cloneColumns(state.columns);
        const sourceColumnIndex = columns.findIndex((column) => column.id === source.columnId);
        const destinationColumnIndex = columns.findIndex(
          (column) => column.id === destination.columnId,
        );

        if (sourceColumnIndex < 0 || destinationColumnIndex < 0) {
          return state;
        }

        const sourceCards = [...columns[sourceColumnIndex].cards];
        const [movedCard] = sourceCards.splice(source.index, 1);

        if (!movedCard) {
          return state;
        }

        if (sourceColumnIndex === destinationColumnIndex) {
          const nextIndex = Math.max(0, Math.min(destination.index, sourceCards.length));
          sourceCards.splice(nextIndex, 0, movedCard);
          columns[sourceColumnIndex] = {
            ...columns[sourceColumnIndex],
            cards: sourceCards,
          };
          return { columns };
        }

        const destinationCards = [...columns[destinationColumnIndex].cards];
        const nextIndex = Math.max(0, Math.min(destination.index, destinationCards.length));
        destinationCards.splice(nextIndex, 0, movedCard);

        columns[sourceColumnIndex] = {
          ...columns[sourceColumnIndex],
          cards: sourceCards,
        };
        columns[destinationColumnIndex] = {
          ...columns[destinationColumnIndex],
          cards: destinationCards,
        };

        const nextCompletedRecords = syncCompletedRecords(
          state.columns,
          columns,
          state.completedRecords,
        );

        return syncUserBoard(state, columns, nextCompletedRecords);
      }),
    renameColumn: (columnId, title) =>
      set((state) =>
        syncUserBoard(
          state,
          state.columns.map((column) =>
          column.id === columnId ? { ...column, title } : column,
        ),
          state.completedRecords,
        ),
      ),
    addGeneratedCards: (columnId, tasks) =>
      set((state) => {
        const nextColumns = state.columns.map((column) =>
          column.id === columnId
            ? {
                ...column,
                cards: [
                  ...column.cards,
                  ...tasks.map((task) => ({
                    id: crypto.randomUUID(),
                    title: task.title,
                    details: task.details,
                  })),
                ],
              }
            : column,
        );
        const nextCompletedRecords = syncCompletedRecords(
          state.columns,
          nextColumns,
          state.completedRecords,
        );

        return syncUserBoard(state, nextColumns, nextCompletedRecords);
      }),
  deleteCompletedRecord: (recordId) =>
    set((state) =>
      syncUserBoard(
        state,
        state.columns,
        state.completedRecords.filter((record) => record.id !== recordId),
      ),
    ),
  resetBoard: () => {
    const board = createUserBoardData();
    set((state) => syncUserBoard(state, board.columns, board.completedRecords));
  },
  resetApp: () => set(createInitialState()),
});

export function createBoardState() {
  return create<BoardState>(createStoreState);
}

export const useBoardStore = create<BoardState>()(
  persist(createStoreState, {
    name: "slate-app-store",
    storage: createJSONStorage(() => localStorage),
    partialize: (state) => ({
      users: state.users,
      currentUserId: state.currentUserId,
      boardsByUserId: state.boardsByUserId,
    }),
    onRehydrateStorage: () => (state) => {
      if (!state) {
        return;
      }

      if (!state.currentUserId) {
        state.columns = createInitialColumns();
        state.completedRecords = [];
        return;
      }

      const board = state.boardsByUserId[state.currentUserId];

      if (board) {
        state.columns = cloneColumns(board.columns);
        state.completedRecords = cloneCompletedRecords(board.completedRecords);
      }
    },
  }),
);
