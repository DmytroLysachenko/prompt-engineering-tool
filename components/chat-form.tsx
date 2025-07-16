"use client";

import { cn } from "@/lib/utils";

import { useChat } from "@ai-sdk/react";
import { useState, useEffect } from "react";

import { ArrowUpIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { AutoResizeTextarea } from "@/components/autoresize-textarea";

export function ChatForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const [provider, setProvider] = useState("google");
  const [apiKey, setApiKey] = useState("");
  const modelsByProvider: Record<string, string[]> = {
    google: ["gemini-2.5-flash-preview-04-17", "gemini-pro"],
    openai: ["gpt-4o", "gpt-4-turbo", "gpt-3.5-turbo"],
    deepseek: ["deepseek-chat"],
  };
  const [model, setModel] = useState(modelsByProvider[provider][0]);
  const [instructions, setInstructions] = useState("You are a helpful assistant.");

  useEffect(() => {
    setModel(modelsByProvider[provider][0]);
  }, [provider]);

  const { messages, input, setInput, append } = useChat({
    api: "/api/chat",
    body: { provider, apiKey, model, instructions },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    void append({ content: input, role: "user" });
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as unknown as React.FormEvent<HTMLFormElement>);
    }
  };

  const header = (
    <header className="m-auto flex max-w-96 flex-col gap-5 text-center">
      <h1 className="text-2xl font-semibold leading-none tracking-tight">
        Basic AI Chatbot Template
      </h1>
      <p className="text-muted-foreground text-sm">
        This is an AI chatbot app template built with{" "}
        <span className="text-foreground">Next.js</span>, the{" "}
        <span className="text-foreground">Vercel AI SDK</span>, and{" "}
        <span className="text-foreground">Vercel KV</span>.
      </p>
      <p className="text-muted-foreground text-sm">
        Connect an API Key from your provider and send a message to get started.
      </p>
    </header>
  );

  const messageList = (
    <div className="my-4 flex h-fit min-h-[90%] flex-col gap-4">
      {messages.map((message, index) => (
        <div
          key={index}
          data-role={message.role}
          className="max-w-[80%] rounded-xl px-3 py-2 text-sm data-[role=assistant]:self-start data-[role=user]:self-end data-[role=assistant]:bg-gray-100 data-[role=user]:bg-blue-500 data-[role=assistant]:text-black data-[role=user]:text-white"
        >
          {message.content}
        </div>
      ))}
    </div>
  );

  const settings = (
    <div className="my-4 flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <label className="w-24 text-sm">AI Provider</label>
        <select
          className="flex-1 rounded-md border bg-background px-2 py-1"
          value={provider}
          onChange={(e) => setProvider(e.target.value)}
          disabled={messages.length > 0}
        >
          <option value="google">Google</option>
          <option value="openai">OpenAI</option>
          <option value="deepseek">Deepseek</option>
        </select>
      </div>
      <div className="flex items-center gap-2">
        <label className="w-24 text-sm">API Key</label>
        <input
          type="password"
          className="flex-1 rounded-md border bg-background px-2 py-1"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          disabled={messages.length > 0}
          placeholder="API Key"
        />
      </div>
      <div className="flex items-center gap-2">
        <label className="w-24 text-sm">Model</label>
        <select
          className="flex-1 rounded-md border bg-background px-2 py-1"
          value={model}
          onChange={(e) => setModel(e.target.value)}
          disabled={messages.length > 0}
        >
          {modelsByProvider[provider].map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>
      </div>
      <div className="flex items-center gap-2">
        <label className="w-24 text-sm">Instructions</label>
        <input
          type="text"
          className="flex-1 rounded-md border bg-background px-2 py-1"
          value={instructions}
          onChange={(e) => setInstructions(e.target.value)}
          disabled={messages.length > 0}
          placeholder="System instructions"
        />
      </div>
    </div>
  );

  return (
    <main
      className={cn(
        "ring-none mx-auto flex h-svh max-h-svh w-[80%] flex-col items-stretch border-none overflow-auto",
        className
      )}
      {...props}
   >
      <div className="flex-1 content-center overflow-y-auto px-6">
        {settings}
        {messages.length ? messageList : header}
      </div>
      <form
        onSubmit={handleSubmit}
        className="border-input bg-background focus-within:ring-ring/10 relative mx-6 mb-6 flex items-center rounded-[16px] border px-3 py-1.5 pr-8 text-sm focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-0"
      >
        <AutoResizeTextarea
          onKeyDown={handleKeyDown}
          onChange={(v) => setInput(v)}
          value={input}
          placeholder="Enter a message"
          className="placeholder:text-muted-foreground flex-1 bg-transparent focus:outline-none"
        />
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="absolute bottom-1 right-1 size-6 rounded-full"
            >
              <ArrowUpIcon size={16} />
            </Button>
          </TooltipTrigger>
          <TooltipContent sideOffset={12}>Submit</TooltipContent>
        </Tooltip>
      </form>
    </main>
  );
}
