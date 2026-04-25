import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import type { Board } from "@/types/board";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    let query;
    if (userId) {
      // Use an inner join to board_members to find all boards the user is a part of.
      // Since every owner is also a member, this covers both owned and shared boards.
      query = supabase.from("boards").select(`
        *,
        board_members!inner (*)
      `).eq('board_members.user_id', userId);
    } else {
      query = supabase.from("boards").select(`
        *,
        board_members (*)
      `);
    }

    const { data, error } = await query.order('updated_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json(data || []);
  } catch (error: any) {
    console.error("Error fetching boards:", error?.message || error);
    return NextResponse.json(
      { error: "Failed to fetch boards", details: error?.message },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { title, description } = await request.json();
    const userId = "mock-user-id"; // In real app, get from auth

    if (!title) {
      return NextResponse.json(
        { error: "Title is required" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("boards")
      .insert({
        owner_id: userId,
        title,
        description,
      })
      .select()
      .single();

    if (error) throw error;

    // Add creator as owner
    await supabase.from("board_members").insert({
      board_id: data.id,
      user_id: userId,
      role: "owner",
    });

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error creating board:", error);
    return NextResponse.json(
      { error: "Failed to create board" },
      { status: 500 }
    );
  }
}
