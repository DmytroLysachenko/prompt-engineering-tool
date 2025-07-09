import { type CoreMessage, streamText } from "ai";
import { google } from "@ai-sdk/google";

export async function POST(req: Request) {
  const { messages }: { messages: CoreMessage[] } = await req.json();

  const result = streamText({
    model: google("gemini-2.5-flash-preview-04-17"),
    system: "You are a helpful assistant.",
    messages,
  });

  return result.toDataStreamResponse();
}
