import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(request: Request) {
  try {
    const { boardId, title, description } = await request.json();

    // Get the highest order index for this board
    const { data: maxOrderData, error: orderError } = await supabase
      .from("columns")
      .select("order_index")
      .eq("board_id", boardId)
      .order("order_index", { ascending: false })
      .limit(1);

    if (orderError) throw orderError;
    const maxOrder = maxOrderData?.[0]?.order_index ?? -1;

    const { data, error } = await supabase
      .from("columns")
      .insert({
        board_id: boardId,
        title,
        description,
        order_index: maxOrder + 1,
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error creating column:", error);
    return NextResponse.json(
      { error: "Failed to create column" },
      { status: 500 }
    );
  }
}
