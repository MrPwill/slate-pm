"use client";

import { create, type StateCreator } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { createInitialBoardData, createInitialColumns, createInitialCompletedRecords } from "@/lib/seed";
import type {
  AiAction,
  AiTask,
  AuthResult,
  Board,
  BoardMember,
  Card,
  CardLocation,
  Column,
  CompletedRecord,
  DbCard,
  DbColumn,
  DbComment,
  DbCompletedRecord,
  UserAccount,
  UserBoardData,
} from "@/types/board";

export type BoardState = {
  users: UserAccount[];
  currentUserId: string | null;
  boardsByUserId: Record<string, UserBoardData>;
  columns: Column[];
  completedRecords: CompletedRecord[];
  currentBoardId: string | null;
  allBoards: Board[];
  boardMembers: BoardMember[];
  allColumns: DbColumn[];
  allCards: DbCard[];
  allComments: DbComment[];
  allCompletedRecords: DbCompletedRecord[];
  registerUser: (input: { name: string; email: string; password: string }) => AuthResult;
  loginUser: (input: { email: string; password: string }) => AuthResult;
  logoutUser: () => void;
  addCard: (columnId: string, card: Card) => void;
  deleteCard: (columnId: string, cardId: string) => void;
  updateCard: (columnId: string, cardId: string, updates: Pick<Card, "title" | "details">) => void;
  moveCard: (source: CardLocation, destination: CardLocation) => void;
  renameColumn: (columnId: string, title: string) => void;
  addGeneratedCards: (columnId: string, tasks: AiTask[]) => void;
  executeAiActions: (actions: AiAction[]) => void;
  deleteCompletedRecord: (recordId: string) => void;
  resetBoard: () => void;
  resetApp: () => void;
  setCurrentBoard: (boardId: string | null) => void;
  setAllBoards: (boards: Board[]) => void;
  setBoardMembers: (members: BoardMember[]) => void;
  setAllColumns: (columns: DbColumn[]) => void;
  setAllCards: (cards: DbCard[]) => void;
  setAllComments: (comments: DbComment[]) => void;
  setAllCompletedRecords: (records: DbCompletedRecord[]) => void;
  addBoard: (board: Board) => void;
  updateBoardInStore: (board: Board) => void;
  deleteBoardFromStore: (boardId: string) => void;
  addMember: (member: BoardMember) => void;
  removeMember: (boardId: string, userId: string) => void;
  addColumnToBoard: (column: DbColumn) => void;
  updateColumnInBoard: (column: DbColumn) => void;
  deleteColumnFromBoard: (columnId: string) => void;
  addCardToBoard: (card: DbCard) => void;
  updateCardInBoard: (card: DbCard) => void;
  moveCardInBoard: (cardId: string, fromColumnId: string, toColumnId: string, toIndex: number) => void;
  deleteCardFromBoard: (cardId: string) => void;
  addComment: (comment: DbComment) => void;
  addCompletedRecord: (record: DbCompletedRecord) => void;
  loadBoardFromDb: (boardId: string) => void;
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

function createCompletedRecordsFromDoneCards(columns: Column[]): CompletedRecord[] {
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
    completedRecords: createCompletedRecordsFromDoneCards(columns),
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
  | "users"
  | "currentUserId"
  | "boardsByUserId"
  | "columns"
  | "completedRecords"
  | "currentBoardId"
  | "allBoards"
  | "boardMembers"
  | "allColumns"
  | "allCards"
  | "allComments"
  | "allCompletedRecords"
> {
  const board = createInitialBoardData();
  return {
    users: [],
    currentUserId: null,
    boardsByUserId: {},
    columns: board.columns,
    completedRecords: board.completedRecords,
    currentBoardId: null,
    allBoards: [],
    boardMembers: [],
    allColumns: [],
    allCards: [],
    allComments: [],
    allCompletedRecords: [],
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
    executeAiActions: (actions: AiAction[]) =>
      set((state) => {
        const nextColumns = cloneColumns(state.columns);

        for (const action of actions) {
          if (action.action === "create" && action.title) {
            const targetCol = nextColumns.find((c) => c.id === action.targetColumnId);
            if (targetCol) {
              targetCol.cards.push({
                id: crypto.randomUUID(),
                title: action.title,
                details: action.details || "",
              });
            }
          } else if (action.action === "move" && action.cardId && action.targetColumnId) {
            const sourceCol = nextColumns.find((c) =>
              c.cards.some((card) => card.id === action.cardId)
            );
            const targetCol = nextColumns.find((c) => c.id === action.targetColumnId);
            const cardIndex = sourceCol?.cards.findIndex((c) => c.id === action.cardId);

            if (sourceCol && targetCol && cardIndex !== undefined && cardIndex >= 0) {
              const [card] = sourceCol.cards.splice(cardIndex, 1);
              const targetIndex = Math.max(
                0,
                Math.min(action.targetIndex ?? targetCol.cards.length, targetCol.cards.length)
              );
              targetCol.cards.splice(targetIndex, 0, card);
            }
          } else if (action.action === "update" && action.cardId) {
            const col = nextColumns.find((c) =>
              c.cards.some((card) => card.id === action.cardId)
            );
            if (col) {
              const card = col.cards.find((c) => c.id === action.cardId);
              if (card) {
                if (action.title) card.title = action.title;
                if (action.details !== undefined) card.details = action.details;
              }
            }
          }
        }

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
  setCurrentBoard: (boardId) =>
    set((state) => ({
      ...state,
      currentBoardId: boardId,
    })),
  setAllBoards: (boards) =>
    set((state) => ({
      ...state,
      allBoards: boards,
    })),
  setBoardMembers: (members) =>
    set((state) => ({
      ...state,
      boardMembers: members,
    })),
  setAllColumns: (columns) =>
    set((state) => ({
      ...state,
      allColumns: columns,
    })),
  setAllCards: (cards) =>
    set((state) => ({
      ...state,
      allCards: cards,
    })),
  setAllComments: (comments) =>
    set((state) => ({
      ...state,
      allComments: comments,
    })),
  setAllCompletedRecords: (records) =>
    set((state) => ({
      ...state,
      allCompletedRecords: records,
    })),
  addBoard: (board) =>
    set((state) => ({
      ...state,
      allBoards: [...state.allBoards, board],
    })),
  updateBoardInStore: (board) =>
    set((state) => ({
      ...state,
      allBoards: state.allBoards.map((b) => (b.id === board.id ? board : b)),
    })),
  deleteBoardFromStore: (boardId) =>
    set((state) => ({
      ...state,
      allBoards: state.allBoards.filter((b) => b.id !== boardId),
      boardMembers: state.boardMembers.filter((m) => m.board_id !== boardId),
    })),
  addMember: (member) =>
    set((state) => ({
      ...state,
      boardMembers: [...state.boardMembers, member],
    })),
  removeMember: (boardId, userId) =>
    set((state) => ({
      ...state,
      boardMembers: state.boardMembers.filter(
        (m) => !(m.board_id === boardId && m.user_id === userId),
      ),
    })),
  addColumnToBoard: (column) =>
    set((state) => ({
      ...state,
      allColumns: [...state.allColumns, column],
    })),
  updateColumnInBoard: (column) =>
    set((state) => ({
      ...state,
      allColumns: state.allColumns.map((c) => (c.id === column.id ? column : c)),
    })),
  deleteColumnFromBoard: (columnId) =>
    set((state) => ({
      ...state,
      allColumns: state.allColumns.filter((c) => c.id !== columnId),
      allCards: state.allCards.filter((c) => c.column_id !== columnId),
    })),
  addCardToBoard: (card) =>
    set((state) => ({
      ...state,
      allCards: [...state.allCards, card],
    })),
  updateCardInBoard: (card: DbCard) =>
    set((state) => ({
      ...state,
      allCards: state.allCards.map((c) => (c.id === card.id ? card : c)),
    })),
  moveCardInBoard: (cardId: string, fromColumnId: string, toColumnId: string, toIndex: number) =>
    set((state) => {
      const cards = [...state.allCards];
      const cardIndex = cards.findIndex((c) => c.id === cardId);
      if (cardIndex === -1) return state;

      const [card] = cards.splice(cardIndex, 1);
      card.column_id = toColumnId;

      const toColumnCards = cards.filter((c) => c.column_id === toColumnId);
      toColumnCards.splice(toIndex, 0, card);

      return {
        ...state,
        allCards: cards,
      };
    }),
  deleteCardFromBoard: (cardId: string) =>
    set((state) => ({
      ...state,
      allCards: state.allCards.filter((c) => c.id !== cardId),
    })),
  addComment: (comment: DbComment) =>
    set((state) => ({
      ...state,
      allComments: [...state.allComments, comment],
    })),
  addCompletedRecord: (record: DbCompletedRecord) =>
    set((state) => ({
      ...state,
      allCompletedRecords: [...state.allCompletedRecords, record],
    })),
  loadBoardFromDb: (boardId: string) => {
    set((state) => {
      const board = state.allBoards.find((b) => b.id === boardId);
      if (!board) return {} as Partial<BoardState>;
      const boardMembers = state.boardMembers.filter((m) => m.board_id === boardId);
      const boardColumns = state.allColumns
        .filter((c) => c.board_id === boardId)
        .sort((a, b) => a.order_index - b.order_index);
      const boardCardIds = boardColumns.map((c) => c.id);
      const boardCards = state.allCards
        .filter((c) => boardCardIds.includes(c.column_id))
        .sort((a, b) => a.order_index - b.order_index);
      const columns: Column[] = boardColumns.map((col) => ({
        id: col.id,
        title: col.title,
        description: col.description || undefined,
        cards: boardCards
          .filter((card) => card.column_id === col.id)
          .map((card) => ({
            id: card.id,
            title: card.title,
            details: card.details || "",
          })),
      }));
      const completedRecords = state.allCompletedRecords.filter((r) => r.board_id === boardId);
      const newState = {
        currentBoardId: boardId,
        columns,
        completedRecords,
        boardMembers,
      };
      return newState as any;
    }) as any;
  },
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
