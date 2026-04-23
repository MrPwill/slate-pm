export type Card = {
  id: string;
  title: string;
  details: string;
};

export type Column = {
  id: string;
  title: string;
  description?: string;
  cards: Card[];
};

export type CardLocation = {
  columnId: string;
  index: number;
};

export type AiActionType = "create" | "move" | "update";

export type AiAction = {
  action: AiActionType;
  title?: string;
  details?: string;
  cardId?: string;
  sourceColumnId?: string;
  sourceIndex?: number;
  targetColumnId?: string;
  targetIndex?: number;
};

export type AiTask = {
  title: string;
  details: string;
};

export type AiTaskResponse = {
  summary: string;
  tasks: AiTask[];
  actions?: AiAction[];
};

export type CompletedRecord = {
  id: string;
  cardId: string;
  title: string;
  details: string;
  completedAt: string;
};

export type UserAccount = {
  id: string;
  name: string;
  email: string;
  password: string;
};

export type UserBoardData = {
  columns: Column[];
  completedRecords: CompletedRecord[];
};

export type AuthResult = {
  ok: boolean;
  error?: string;
};