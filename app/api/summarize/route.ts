import { NextResponse } from "next/server";
import { OpenAI } from "openai";


export async function POST(request: Request) {
  try {
    const { comments, cardDetails } = await request.json();

    if (!comments || comments.length === 0) {
      return NextResponse.json(
        { error: "No comments to summarize" },
        { status: 400 }
      );
    }

    const apiKey = process.env.OPENROUTER_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "OPENROUTER_API_KEY is not configured." },
        { status: 500 },
      );
    }

    const client = new OpenAI({
      apiKey,
      baseURL: "https://openrouter.ai/api/v1",
    });

    // Prepare the prompt for summarization
    const commentsText = comments
      .map((comment: { user_name?: string; content: string }) => `${comment.user_name || 'Anonymous'}: ${comment.content}`)
      .join('\n\n');

    const prompt = `
Give me a brief 1-2 sentence status of this project.

Board: ${cardDetails || 'No card details'}
Content: ${commentsText}
`;

    const response = await client.chat.completions.create({
      model: "openai/gpt-oss-120b",
      messages: [
        {
          role: "system",
          content: "You are a helpful project assistant. Provide short, natural summaries.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 200,
    });

    const content = response.choices[0]?.message?.content ?? "";
    
    if (!content?.trim()) {
      throw new Error("AI returned empty response");
    }
    
    return NextResponse.json({
      summary: content.trim(),
    });
  } catch (error) {
    console.error("Error generating summary:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
