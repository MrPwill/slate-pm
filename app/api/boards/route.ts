import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    let query;
    if (userId) {
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
  } catch (error) {
    console.error("Error fetching boards:", error instanceof Error ? error.message : error);
    return NextResponse.json(
      { error: "Failed to fetch boards" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json() as { title?: string; description?: string };
    const { title, description } = body;
    const userId = "mock-user-id";

    if (!title) {
      return NextResponse.json(
        { error: "Title is required" },
        { status: 400 }
      );
    }

    const { data, error } = await (supabase as any)
      .from("boards")
      .insert({
        owner_id: userId,
        title,
        description,
      })
      .select()
      .single();

    if (error) throw error;

    await (supabase as any)
      .from("board_members")
      .insert({
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