"use client";

import { useState } from "react";

export default function Home() {
  const [message, setMessage] =
    useState("");

  const [messages, setMessages] =
    useState<string[]>([]);

  async function sendMessage() {
    if (!message.trim()) return;

    const userText = message;

    setMessages((prev) => [
      ...prev,
      "You: " + userText,
    ]);

    setMessage("");

    try {
      const response = await fetch(
        "/api/chat",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            messages: [
              {
                role: "user",
                content: userText,
              },
            ],
          }),
        }
      );

      if (!response.body) return;

      const reader =
        response.body.getReader();

      const decoder =
        new TextDecoder();

      let aiText = "";

      setMessages((prev) => [
        ...prev,
        "AI: ...",
      ]);

      while (true) {
        const { done, value } =
          await reader.read();

        if (done) break;

        aiText += decoder.decode(
          value
        );

        setMessages((prev) => {
          const copy = [...prev];

          copy[
            copy.length - 1
          ] = "AI: " + aiText;

          return copy;
        });
      }
    } catch (error) {
      console.error(error);

      alert("API ERROR");
    }
  }

  return (
    <main className="h-screen bg-black text-white flex flex-col">
      <div className="flex-1 overflow-y-auto p-5 space-y-2">
        {messages.map((m, i) => (
          <div key={i}>{m}</div>
        ))}
      </div>

      <div className="p-4 flex gap-2 border-t border-gray-700">
        <input
          value={message}
          onChange={(e) =>
            setMessage(e.target.value)
          }
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              sendMessage();
            }
          }}
          placeholder="Send message..."
          className="flex-1 bg-[#222] px-4 py-3 rounded-xl"
        />

        <button
          onClick={sendMessage}
          className="bg-white text-black px-5 rounded-xl"
        >
          Send
        </button>
      </div>
    </main>
  );
}