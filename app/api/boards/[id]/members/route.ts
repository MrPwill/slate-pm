import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { data, error } = await supabase
      .from("board_members")
      .select(`
        *,
        users (
          id,
          name,
          email
        )
      `)
      .eq("board_id", id);

    if (error) throw error;

    return NextResponse.json(data || []);
  } catch (error) {
    console.error("Error fetching board members:", error);
    return NextResponse.json(
      { error: "Failed to fetch board members" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { email, role = "member" } = await request.json();

    // Find user by email
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("id")
      .eq("email", email.toLowerCase())
      .single();

    if (userError || !userData) {
      return NextResponse.json(
        { error: "User not found with that email" },
        { status: 404 }
      );
    }

    // Check if user is already a member
    const { data: existingMember, error: memberError } = await supabase
      .from("board_members")
      .select("id")
      .eq("board_id", id)
      .eq("user_id", (userData as any).id)
      .single();

    if (!memberError && existingMember) {
      return NextResponse.json(
        { error: "User is already a member of this board" },
        { status: 400 }
      );
    }

    // Add member to board
    const { data, error } = await supabase
      .from("board_members")
      .insert({
        board_id: id,
        user_id: (userData as any).id,
        role: role as "owner" | "member",
      } as any)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error adding board member:", error);
    return NextResponse.json(
      { error: "Failed to add board member" },
      { status: 500 }
    );
  }
}