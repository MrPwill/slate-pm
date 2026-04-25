import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import type { Board } from "@/types/board";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { data, error } = await supabase
      .from("boards")
      .select(`
        *,
        board_members (
          id,
          user_id,
          role,
          created_at
        )
      `)
      .eq("id", id)
      .single();

    if (error) throw error;
    if (!data) {
      return NextResponse.json(
        { error: "Board not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching board:", error);
    return NextResponse.json(
      { error: "Failed to fetch board" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json() as { title?: string; description?: string };
    const { title, description } = body;

    const updateData: Record<string, string> = {
      updated_at: new Date().toISOString(),
    };
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;

    const { data, error } = await (supabase as any)
      .from("boards")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error updating board:", error);
    return NextResponse.json(
      { error: "Failed to update board" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { error } = await supabase
      .from("boards")
      .delete()
      .eq("id", id);

    if (error) throw error;

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Error deleting board:", error);
    return NextResponse.json(
      { error: "Failed to delete board" },
      { status: 500 }
    );
  }
}