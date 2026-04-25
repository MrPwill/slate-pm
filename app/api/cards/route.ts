import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(request: Request) {
  try {
    const { columnId, title, details } = await request.json();

    // Get the highest order index for this column
    const { data: maxOrderData, error: orderError } = await supabase
      .from("cards")
      .select("order_index")
      .eq("column_id", columnId)
      .order("order_index", { ascending: false })
      .limit(1);

    if (orderError) throw orderError;
    const maxOrder = maxOrderData?.[0]?.order_index ?? -1;

    const { data, error } = await supabase
      .from("cards")
      .insert({
        column_id: columnId,
        title,
        details,
        order_index: maxOrder + 1,
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error creating card:", error);
    return NextResponse.json(
      { error: "Failed to create card" },
      { status: 500 }
    );
  }
}
