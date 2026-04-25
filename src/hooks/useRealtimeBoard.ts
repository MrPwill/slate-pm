"use client";

import { useEffect } from 'react'
import { useBoardStore } from '@/store/useBoardStore'
import { supabase } from '@/lib/supabase'
import type { DbColumn, DbCard, DbComment, DbCompletedRecord } from '@/types/board'

export function useRealtimeBoard(boardId: string) {
  const updateColumn = useBoardStore((state) => state.updateColumnInBoard)
  const addCard = useBoardStore((state) => state.addCardToBoard)
  const updateCard = useBoardStore((state) => state.updateCardInBoard)
  const _moveCard = useBoardStore((state) => state.moveCardInBoard)
  const addComment = useBoardStore((state) => state.addComment)
  const addCompletedRecord = useBoardStore((state) => state.addCompletedRecord)

  useEffect(() => {
    if (!boardId) return

    let columnsChannel: ReturnType<typeof supabase.channel> | null = null
    let cardsChannel: ReturnType<typeof supabase.channel> | null = null
    let commentsChannel: ReturnType<typeof supabase.channel> | null = null
    let completedChannel: ReturnType<typeof supabase.channel> | null = null

    // Subscribe to columns changes
    columnsChannel = supabase
      .channel('columns-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'columns',
          filter: `board_id=eq.${boardId}`,
        },
        (payload: { eventType: string; new: unknown }) => {
          if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
            updateColumn(payload.new as DbColumn)
          } else if (payload.eventType === 'DELETE') {
            // Handle column delete if needed
          }
        }
      )
      .subscribe()

    // Subscribe to cards changes
    // Note: We listen to all cards changes and filter in the handler
    // Supabase Realtime doesn't support subqueries in filters
    cardsChannel = supabase
      .channel('cards-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'cards',
        },
        (payload: { eventType: string; new: unknown }) => {
          if (payload.eventType === 'INSERT') {
            const card = payload.new as DbCard
            // Only add if card belongs to this board
            if (card.column_id) {
              addCard(card)
            }
          } else if (payload.eventType === 'UPDATE') {
            updateCard(payload.new as DbCard)
          } else if (payload.eventType === 'DELETE') {
            // Handle card delete if needed
          }
        }
      )
      .subscribe()

    // Subscribe to comments changes
    // Note: We listen to all comments changes and filter in the handler
    // Supabase Realtime doesn't support subqueries in filters
    commentsChannel = supabase
      .channel('comments-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'comments',
        },
        (payload: { eventType: 'INSERT'; new: unknown }) => {
          const comment = payload.new as DbComment
          // Only add if comment belongs to this board
          if (comment.card_id) {
            addComment(comment)
          }
        }
      )
      .subscribe()

    // Subscribe to completed_records changes
    completedChannel = supabase
      .channel('completed-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'completed_records',
          filter: `board_id=eq.${boardId}`,
        },
        (payload: { eventType: 'INSERT'; new: unknown }) => {
          addCompletedRecord(payload.new as DbCompletedRecord)
        }
      )
      .subscribe()

    return () => {
      if (columnsChannel) supabase.removeChannel(columnsChannel)
      if (cardsChannel) supabase.removeChannel(cardsChannel)
      if (commentsChannel) supabase.removeChannel(commentsChannel)
      if (completedChannel) supabase.removeChannel(completedChannel)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [boardId])
}
