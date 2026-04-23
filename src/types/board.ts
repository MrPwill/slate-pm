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

export type AiTask = {
  title: string;
  details: string;
};

export type AiTaskResponse = {
  summary: string;
  tasks: AiTask[];
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
