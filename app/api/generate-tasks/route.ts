import OpenAI from "openai";
import { NextResponse } from "next/server";
import { parseAiResponse, parseTaskTitles } from "@/lib/ai";
import type { Column } from "@/types/board";

type RequestBody = {
  prompt?: string;
  count?: number;
  columns?: Column[];
  targetColumnId?: string;
  boardSnapshot?: string;
};

export async function POST(request: Request) {
  const body = (await request.json()) as RequestBody;
  const prompt = body.prompt?.trim();
  const boardSnapshot = body.boardSnapshot?.trim();
  const targetColumnId = body.targetColumnId?.trim();

  if (!prompt) {
    return NextResponse.json({ error: "Prompt is required." }, { status: 400 });
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

  try {
    const response = await client.chat.completions.create({
      model: "openai/gpt-oss-120b",
      messages: [
        {
          role: "system",
          content:
            "You are the planning assistant for a Kanban board. Return strict JSON with this shape: {\"summary\":\"short project update\",\"tasks\":[{\"title\":\"Header for task\",\"details\":\"1. step one\\n2. step two\\n3. step three\"}]}. The title should be a clear header. The details should use numbered format (1., 2., 3.) with sub-steps listed below each number using dashes (-). Use 0 to 5 tasks. If the user asks for project status, summarize the board. If the user asks for task generation or next steps, return 3-5 tasks with actionable steps in the details.",
        },
        {
          role: "user",
          content: `Prompt: ${prompt}\nTarget column: ${targetColumnId ?? "not provided"}\nCurrent board snapshot: ${boardSnapshot ?? "[]"}`,
        },
      ],
      temperature: 0.5,
    });

    const content = response.choices[0]?.message?.content ?? "";
    const parsed = parseAiResponse(content);

    if (parsed) {
      return NextResponse.json(parsed);
    }

    const tasks = parseTaskTitles(content);

    if (tasks.length < 1 || tasks.length > 5) {
      return NextResponse.json(
        { error: "The AI response could not be parsed into a usable update." },
        { status: 502 },
      );
    }

    return NextResponse.json({
      summary: "Generated a fresh set of next-step tasks from the current board.",
      tasks,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Task generation failed. Try a more specific prompt.";
    return NextResponse.json(
      { error: message },
      { status: 502 },
    );
  }
}
