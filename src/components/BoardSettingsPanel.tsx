"use client";

import { useState } from "react";
import { useBoardStore } from "@/store/useBoardStore";
import { useSupabase } from "@/hooks/useSupabase";
import { InviteMembers } from "./InviteMembers";

function XIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <path d="M18 6L6 18M6 6l12 12" />
    </svg>
  );
}

function UsersIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 00-3-3.87" />
      <path d="M16 3.13a4 4 0 010 7.75" />
    </svg>
  );
}

function PlusIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

function MailIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  );
}

function Trash2Icon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <path d="M3 6h18" />
      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
    </svg>
  );
}

interface BoardSettingsPanelProps {
  boardId: string;
  onClose: () => void;
}

export function BoardSettingsPanel({
  boardId,
  onClose,
}: BoardSettingsPanelProps) {
  const [inviteEmail, setInviteEmail] = useState("");
  const [_isInviting, setIsInviting] = useState(false);
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);
  const { allBoards, boardMembers, removeMember } = useBoardStore();
  const supabase = useSupabase();

  const board = allBoards.find((b) => b.id === boardId);
  const members = boardMembers.filter((m) => m.board_id === boardId);

  const _handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail.trim()) return;

    setIsInviting(true);
    try {
      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("id,name,email")
        .eq("email", inviteEmail.trim().toLowerCase())
        .single();

      if (userError || !userData) {
        alert("User not found with that email");
        setInviteEmail("");
        return;
      }

      const { data: _data, error } = await supabase
        .from("board_members")
        .insert({
          board_id: boardId,
          user_id: userData.id,
          role: "member" as const,
        })
        .select()
        .single();

      if (error) {
        if (error.code === "23505") {
          alert("User is already a member of this board");
        } else {
          throw error;
        }
        return;
      }

      alert(`Invited ${userData.name} as member`);
      setInviteEmail("");
      setIsInviteDialogOpen(false);
    } catch (error: unknown) {
      alert("Failed to invite member");
      console.error(error);
    } finally {
      setIsInviting(false);
    }
  };

  const handleRemoveMember = async (memberId: string) => {
    if (!confirm("Are you sure you want to remove this member?")) return;

    try {
      const { error } = await supabase
        .from("board_members")
        .delete()
        .eq("id", memberId);

      if (error) throw error;

      removeMember(boardId, memberId);
      alert("Member removed successfully");
    } catch (error) {
      alert("Failed to remove member");
      console.error(error);
    }
  };

  if (!board) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-2">
            <UsersIcon className="w-5 h-5 text-gray-500" />
            <h2 className="text-xl font-semibold">Board Settings</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="hover:bg-gray-100 rounded p-1"
          >
            <XIcon className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
          {/* Board Info */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium text-gray-900 mb-1">{board.title}</h3>
            {board.description && (
              <p className="text-sm text-gray-600">{board.description}</p>
            )}
          </div>

          <InviteMembers
            boardId={boardId}
            isOpen={isInviteDialogOpen}
            onOpenChange={setIsInviteDialogOpen}
          />

          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-gray-700">Members</h3>
              <button
                type="button"
                onClick={() => setIsInviteDialogOpen(true)}
                className="flex items-center gap-1 px-2 py-1 text-sm border rounded hover:bg-gray-50"
              >
                <PlusIcon className="w-3 h-3" />
                Invite
              </button>
            </div>
            <div className="space-y-2">
              {members.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-4">
                  No members yet
                </p>
              ) : (
                members.map((member) => (
                  <div
                    key={member.user_id}
                    className="flex items-center justify-between p-2 bg-gray-50 rounded"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                        <MailIcon className="w-4 h-4 text-blue-600" />
                      </div>
                      <span className="text-sm text-gray-700">
                        {member.user_id}
                      </span>
                      {member.role === "owner" && (
                        <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-700 rounded ml-2">
                          owner
                        </span>
                      )}
                    </div>
                    {member.role !== "owner" && (
                      <button
                        type="button"
                        onClick={() => handleRemoveMember(member.user_id)}
                        className="w-6 h-6 text-red-500 hover:text-red-700 hover:bg-red-50 rounded"
                      >
                        <Trash2Icon className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="pt-4 border-t">
            <h3 className="text-sm font-medium text-red-600 mb-2">Danger Zone</h3>
            <button
              type="button"
              className="w-full flex items-center justify-center gap-1 px-3 py-1.5 text-sm border border-red-200 text-red-600 rounded hover:bg-red-50"
              onClick={() => {
                if (confirm("Are you sure you want to delete this board?")) {
                  onClose();
                }
              }}
            >
              <Trash2Icon className="w-3 h-3" />
              Delete Board
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
