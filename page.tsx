"use client";

import { useState } from "react";

export default function Home() {
  const [messages, setMessages] = useState([
    { role: "assistant", content: "안녕하세요 👋" },
  ]);

  const [input, setInput] = useState("");

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = input;

    // 🔥 API에 보낼 최신 메시지
    const updatedMessages = [
      ...messages,
      { role: "user", content: userMessage },
    ];

    // UI 업데이트 (user + 빈 assistant)
    setMessages((prev) => [
      ...prev,
      { role: "user", content: userMessage },
      { role: "assistant", content: "" },
    ]);

    setInput("");

    // 🔥 Groq API 호출
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages: updatedMessages,
      }),
    });

    const reader = res.body?.getReader();
    const decoder = new TextDecoder();

    let result = "";

    // 🔥 stream 처리
    while (true) {
      const { done, value } = await reader!.read();
      if (done) break;

      const chunk = decoder.decode(value);
      result += chunk;

      // 마지막 assistant 업데이트
      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          role: "assistant",
          content: result,
        };
        return updated;
      });
    }
  };

  return (
    <main
      style={{
        height: "100vh",
        background: "#111",
        color: "white",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* 메시지 영역 */}
      <div style={{ flex: 1, padding: 20, overflowY: "auto" }}>
        {messages.map((m, i) => (
          <div key={i} style={{ marginBottom: 10 }}>
            <b>{m.role}:</b> {m.content}
          </div>
        ))}
      </div>

      {/* 입력 영역 */}
      <div style={{ display: "flex", padding: 10 }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          style={{
            flex: 1,
            padding: 10,
            borderRadius: 6,
            border: "1px solid #333",
            background: "#222",
            color: "white",
          }}
        />
        <button
          onClick={sendMessage}
          style={{
            marginLeft: 10,
            padding: "10px 16px",
            background: "#4f46e5",
            color: "white",
            border: "none",
            borderRadius: 6,
            cursor: "pointer",
          }}
        >
          전송
        </button>
      </div>
    </main>
  );
}