"use client";

import { useState } from "react";
import { useSupabase } from "@/hooks/useSupabase";
import { useBoardStore } from "@/store/useBoardStore";

interface InviteMembersProps {
  boardId: string;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function InviteMembers({
  boardId,
  isOpen,
  onOpenChange,
}: InviteMembersProps) {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"member" | "owner">("member");
  const [isInviting, setIsInviting] = useState(false);
  const supabase = useSupabase();
  const { addMember } = useBoardStore();

  if (!isOpen) return null;

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsInviting(true);
    try {
      // Check if user exists
      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("id,name,email")
        .eq("email", email.trim().toLowerCase())
        .single();

      if (userError || !userData) {
        alert("User not found with that email");
        setEmail("");
        return;
      }

      const { data, error } = await supabase
        .from("board_members")
        .insert({
          board_id: boardId,
          user_id: userData.id,
          role,
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
      setEmail("");
      onOpenChange(false);
    } catch (error) {
      alert("Failed to invite member");
      console.error(error);
    } finally {
      setIsInviting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="px-6 py-4 border-b">
          <h2 className="text-lg font-semibold">Invite Members</h2>
        </div>
        <form onSubmit={handleInvite} className="p-6 space-y-4">
          <div className="space-y-2">
            <label htmlFor="invite-email" className="text-sm font-medium">
              Email Address *
            </label>
            <input
              id="invite-email"
              type="email"
              placeholder="member@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isInviting}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="invite-role" className="text-sm font-medium">
              Role
            </label>
            <select
              id="invite-role"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
              value={role}
              onChange={(e) =>
                setRole(e.target.value as "member" | "owner")
              }
              disabled={isInviting}
            >
              <option value="member">Member</option>
              <option value="owner">Owner</option>
            </select>
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <button
              type="button"
              onClick={() => {
                setEmail("");
                setRole("member");
                onOpenChange(false);
              }}
              disabled={isInviting}
              className="px-4 py-2 text-sm border rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isInviting || !email.trim()}
              className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isInviting ? "Sending..." : "Send Invite"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
