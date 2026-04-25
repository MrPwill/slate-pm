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
Please summarize the following conversation from a Kanban board card discussion:

Card Details: ${cardDetails || 'No card details provided'}

Comments:
${commentsText}

Provide a concise summary that captures:
1. The main points discussed
2. Any decisions made
3. Action items or next steps mentioned
4. Key questions or concerns raised

Keep the summary focused and actionable for team members who need to quickly understand the discussion.
`;

    const response = await client.chat.completions.create({
      model: "openai/gpt-oss-120b",
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant that summarizes conversations from project management discussions. Provide clear, concise summaries that capture the key points, decisions, and action items.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.3,
      max_tokens: 500,
    });

    const content = response.choices[0]?.message?.content ?? "";
    
    return NextResponse.json({
      summary: content.trim(),
    });
  } catch (error) {
    console.error("Error generating summary:", error);
    return NextResponse.json(
      { error: "Failed to generate summary" },
      { status: 500 }
    );
  }
}
