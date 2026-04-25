"use client";

import { useEffect, useState } from 'react'
import { useBoardStore } from '@/store/useBoardStore'
import { supabase } from '@/lib/supabase'

export function useBoardMembers(boardId: string) {
  const [members, setMembers] = useState<Record<string, unknown>[]>([])
  const [loading, setLoading] = useState(true)
  const currentUserId = useBoardStore((state) => state.currentUserId)

  useEffect(() => {
    if (!boardId || !currentUserId) {
      setMembers([])
      setLoading(false)
      return
    }

    fetchBoardMembers()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [boardId, currentUserId])

  async function fetchBoardMembers() {
    try {
const { data, error } = await supabase
        .from('board_members')
        .select('*')
        .eq('board_id', boardId)

    if (error) throw error
    setMembers(data || [])
    } catch (error: unknown) {
      console.error('Error fetching board members:', error instanceof Error ? error.message : error)
    } finally {
      setLoading(false)
    }
  }

  async function inviteMember(email: string, role: 'member' | 'owner' = 'member') {
    if (!currentUserId) return null

    try {
      // Find user by email
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('id')
        .eq('email', email.toLowerCase())
        .single()

      if (userError || !userData) {
        throw new Error('User not found with that email')
      }

      // Check if user is already a member
      const { data: existingMember, error: memberError } = await supabase
        .from('board_members')
        .select('id')
        .eq('board_id', boardId)
        .eq('user_id', userData.id)
        .single()

      if (!memberError && existingMember) {
        throw new Error('User is already a member of this board')
      }

      // Add member to board
      const { data, error } = await supabase
        .from('board_members')
        .insert({
          board_id: boardId,
          user_id: userData.id,
          role: role,
        })
        .select()
        .single()

      if (error) throw error
      
      // Refetch members
      await fetchBoardMembers()
      return data
    } catch (error) {
      console.error('Error inviting member:', error)
      return null
    }
  }

  async function removeMember(userId: string) {
    try {
      const { error } = await supabase
        .from('board_members')
        .delete()
        .eq('board_id', boardId)
        .eq('user_id', userId)

      if (error) throw error
      
      // Refetch members
      await fetchBoardMembers()
    } catch (error) {
      console.error('Error removing member:', error)
    }
  }

  return {
    members,
    loading,
    inviteMember,
    removeMember,
    fetchBoardMembers,
  }
}
