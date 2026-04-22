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
            "You are the planning assistant for a single in-memory Kanban board. Return strict JSON with this shape: {\"summary\":\"short project update or answer\",\"tasks\":[\"task 1\",\"task 2\"]}. The summary must always be present and concise. Use 0 to 5 tasks. If the user asks for project status, blockers, progress, or what is left, summarize the board honestly from the provided snapshot and include tasks only when useful. If the user asks for task generation or next steps, return 3 to 5 clear, atomic implementation-ready tasks tailored to the current board.",
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
