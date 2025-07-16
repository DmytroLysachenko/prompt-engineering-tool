import { type CoreMessage, streamText } from "ai";
import { google } from "@ai-sdk/google";
import { openai } from "@ai-sdk/openai";

export async function POST(req: Request) {
  const {
    messages,
    provider = "google",
    apiKey,
    model,
    instructions = "You are a helpful assistant.",
  }: {
    messages: CoreMessage[];
    provider?: string;
    apiKey?: string;
    model?: string;
    instructions?: string;
  } = await req.json();

  let modelProvider;
  if (provider === "openai") {
    modelProvider = openai(model ?? "gpt-4o", { apiKey });
  } else if (provider === "deepseek") {
    modelProvider = openai(model ?? "deepseek-chat", {
      apiKey,
      baseUrl: "https://api.deepseek.com",
    });
  } else {
    modelProvider = google(model ?? "gemini-2.5-flash-preview-04-17", { apiKey });
  }

  const result = streamText({
    model: modelProvider,
    system: instructions,
    messages,
  });

  return result.toDataStreamResponse();
}
