import { supabase } from './client';
import type { Board, DbColumn, DbCard, DbCompletedRecord } from '@/types/board';

// Boards Operations
export async function fetchUserBoards(userId: string): Promise<Board[]> {
  try {
    const { data, error } = await supabase
      .from('boards')
      .select('*')
      .eq('owner_id', userId);

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Failed to fetch boards:', error);
    return [];
  }
}

export async function createBoard(userId: string, title: string, description?: string): Promise<Board | null> {
  try {
    const newBoard: Board = {
      id: crypto.randomUUID(),
      owner_id: userId,
      title,
      description: description || null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase.from('boards').insert([newBoard]);

    if (error) throw error;
    return newBoard;
  } catch (error) {
    console.error('Failed to create board:', error);
    return null;
  }
}

export async function updateBoard(boardId: string, updates: Partial<Board>): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('boards')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', boardId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Failed to update board:', error);
    return false;
  }
}

export async function deleteBoard(boardId: string): Promise<boolean> {
  try {
    const { error } = await supabase.from('boards').delete().eq('id', boardId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Failed to delete board:', error);
    return false;
  }
}

// Columns Operations
export async function fetchBoardColumns(boardId: string): Promise<DbColumn[]> {
  try {
    const { data, error } = await supabase
      .from('columns')
      .select('*')
      .eq('board_id', boardId)
      .order('order_index', { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Failed to fetch columns:', error);
    return [];
  }
}

export async function createColumn(
  boardId: string,
  title: string,
  orderIndex: number,
  description?: string
): Promise<DbColumn | null> {
  try {
    const newColumn: DbColumn = {
      id: crypto.randomUUID(),
      board_id: boardId,
      title,
      description: description || null,
      order_index: orderIndex,
      created_at: new Date().toISOString(),
    };

    const { error } = await supabase.from('columns').insert([newColumn]);

    if (error) throw error;
    return newColumn;
  } catch (error) {
    console.error('Failed to create column:', error);
    return null;
  }
}

export async function updateColumn(columnId: string, updates: Partial<DbColumn>): Promise<boolean> {
  try {
    const { error } = await supabase.from('columns').update(updates).eq('id', columnId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Failed to update column:', error);
    return false;
  }
}

// Cards Operations
export async function fetchColumnCards(columnId: string): Promise<DbCard[]> {
  try {
    const { data, error } = await supabase
      .from('cards')
      .select('*')
      .eq('column_id', columnId)
      .order('order_index', { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Failed to fetch cards:', error);
    return [];
  }
}

export async function createCard(
  columnId: string,
  title: string,
  details?: string,
  orderIndex?: number
): Promise<DbCard | null> {
  try {
    const newCard: DbCard = {
      id: crypto.randomUUID(),
      column_id: columnId,
      title,
      details: details || null,
      order_index: orderIndex || 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase.from('cards').insert([newCard]);

    if (error) throw error;
    return newCard;
  } catch (error) {
    console.error('Failed to create card:', error);
    return null;
  }
}

export async function updateCard(cardId: string, updates: Partial<DbCard>): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('cards')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', cardId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Failed to update card:', error);
    return false;
  }
}

export async function deleteCard(cardId: string): Promise<boolean> {
  try {
    const { error } = await supabase.from('cards').delete().eq('id', cardId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Failed to delete card:', error);
    return false;
  }
}

// Completed Records Operations
export async function fetchBoardCompletedRecords(boardId: string): Promise<DbCompletedRecord[]> {
  try {
    const { data, error } = await supabase
      .from('completed_records')
      .select('*')
      .eq('board_id', boardId)
      .order('completed_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Failed to fetch completed records:', error);
    return [];
  }
}

export async function createCompletedRecord(
  cardId: string,
  boardId: string,
  title: string,
  details?: string
): Promise<DbCompletedRecord | null> {
  try {
    const newRecord: DbCompletedRecord = {
      id: crypto.randomUUID(),
      card_id: cardId,
      board_id: boardId,
      title,
      details: details || null,
      completed_at: new Date().toISOString(),
    };

    const { error } = await supabase.from('completed_records').insert([newRecord]);

    if (error) throw error;
    return newRecord;
  } catch (error) {
    console.error('Failed to create completed record:', error);
    return null;
  }
}

export async function deleteCompletedRecord(recordId: string): Promise<boolean> {
  try {
    const { error } = await supabase.from('completed_records').delete().eq('id', recordId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Failed to delete completed record:', error);
    return false;
  }
}
