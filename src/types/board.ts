export type Comment = {
  id: string;
  user_id: string;
  user_name: string;
  content: string;
  created_at: string;
};

export type Card = {
  id: string;
  title: string;
  details: string;
  comments?: Comment[];
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
  ok?: boolean;
  success?: boolean;
  userId?: string;
  email?: string;
  error?: string;
};

// Supabase table types
export interface Board {
  id: string;
  owner_id: string;
  title: string;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export interface BoardMember {
  board_id: string;
  user_id: string;
  role: 'owner' | 'member';
  created_at: string;
}

export interface DbColumn {
  id: string;
  board_id: string;
  title: string;
  description: string | null;
  order_index: number;
  created_at: string;
}

export interface DbCard {
  id: string;
  column_id: string;
  title: string;
  details: string | null;
  order_index: number;
  created_at: string;
  updated_at: string;
}

export interface DbComment {
  id: string;
  card_id: string;
  user_id: string;
  content: string;
  created_at: string;
}

export interface DbCompletedRecord {
  id: string;
  card_id: string;
  board_id: string;
  title: string;
  details: string | null;
  completed_at: string;
}
