"use client";

import { useEffect, useState } from 'react'
import { useBoardStore } from '@/store/useBoardStore'
import { supabase } from '@/lib/supabase'
import type { Board } from '@/types/board'

export function useBoards() {
  const [boards, setBoards] = useState<Board[]>([])
  const [loading, setLoading] = useState(true)
  const currentUserId = useBoardStore((state) => state.currentUserId)

  const { setAllBoards } = useBoardStore()

  useEffect(() => {
    if (!currentUserId) {
      setBoards([])
      setAllBoards([])
      setLoading(false)
      return
    }

    fetchBoards()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUserId])

  async function fetchBoards() {
    try {
      const { data, error } = await supabase
        .from('boards')
        .select(`
          *,
          board_members!inner (user_id)
        `)
        .eq('board_members.user_id', currentUserId)
        .order('updated_at', { ascending: false })

      if (error) throw error
      // Remove the joined board_members from the result to match the Board type
      const formattedData = (data as Record<string, unknown>[] || []).map(({ board_members: _board_members, ...board }) => board as unknown as Board)
      setBoards(formattedData)
      setAllBoards(formattedData)
    } catch (error: unknown) {
      console.error('Error fetching boards:', error instanceof Error ? error.message : error)
    } finally {
      setLoading(false)
    }
  }

  async function createBoard(title: string, description?: string) {
    if (!currentUserId) return null

    try {
      const { data, error } = await supabase
        .from('boards')
        .insert({
          owner_id: currentUserId,
          title,
          description,
        })
        .select()
        .single()

      if (error) throw error

      // Add creator as owner
      await supabase.from('board_members').insert({
        board_id: data.id,
        user_id: currentUserId,
        role: 'owner' as const,
      })

      setBoards((prev) => [data, ...prev])
      return data
    } catch (error: unknown) {
      console.error('Error creating board:', error instanceof Error ? error.message : error)
      return null
    }
  }

  async function updateBoard(id: string, title: string, description?: string) {
    try {
      const { data, error } = await supabase
        .from('boards')
        .update({ title, description, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      setBoards((prev) => prev.map((board) => (board.id === id ? data : board)))
      return data
    } catch (error: unknown) {
      console.error('Error updating board:', error instanceof Error ? error.message : error)
      return null
    }
  }

  async function deleteBoard(id: string) {
    try {
      const { error } = await supabase.from('boards').delete().eq('id', id)
      if (error) throw error
      setBoards((prev) => prev.filter((board) => board.id !== id))
    } catch (error: unknown) {
      console.error('Error deleting board:', error instanceof Error ? error.message : error)
    }
  }

  return {
    boards,
    loading,
    createBoard,
    updateBoard,
    deleteBoard,
    fetchBoards,
  }
}
