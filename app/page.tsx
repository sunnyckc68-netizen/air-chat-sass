"use client";

import { useState } from "react";

export default function Home() {
  const [message, setMessage] =
    useState("");

  const [messages, setMessages] =
    useState<
      {
        role: string;
        content: string;
      }[]
    >([]);

  async function sendMessage() {
    if (!message) return;

    const userMessage = {
      role: "user",
      content: message,
    };

    const updatedMessages = [
      ...messages,
      userMessage,
    ];

    setMessages(updatedMessages);

    setMessage("");

    const response = await fetch(
      "/api/chat",
      {
        method: "POST",
        body: JSON.stringify({
          messages: updatedMessages,
        }),
      }
    );

    if (!response.body) return;

    const reader =
      response.body.getReader();

    const decoder = new TextDecoder();

    let aiResponse = "";

    while (true) {
      const { done, value } =
        await reader.read();

      if (done) break;

      const chunk =
        decoder.decode(value);

      aiResponse += chunk;

      setMessages([
        ...updatedMessages,
        {
          role: "assistant",
          content: aiResponse,
        },
      ]);
    }
  }

  return (
    <main className="flex h-screen bg-[#111] text-white">
      <aside className="w-72 border-r border-gray-800 p-4">
        <button className="w-full bg-white text-black p-3 rounded-xl">
          + New Chat
        </button>
      </aside>

      <section className="flex-1 flex flex-col">
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((m, i) => (
            <div
              key={i}
              className={
                m.role === "user"
                  ? "text-right"
                  : "text-left"
              }
            >
              <div className="inline-block bg-[#222] px-4 py-3 rounded-2xl max-w-[80%]">
                {m.content}
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 border-t border-gray-800 flex gap-2">
          <input
            value={message}
            onChange={(e) =>
              setMessage(
                e.target.value
              )
            }
            placeholder="Send a message..."
            className="flex-1 bg-[#222] rounded-xl px-4 py-3 outline-none"
          />

          <button
            onClick={sendMessage}
            className="bg-white text-black px-5 rounded-xl"
          >
            Send
          </button>
        </div>
      </section>
    </main>
  );
}