import Groq from "groq-sdk";

export const runtime = "nodejs"; // 중요 (Edge 아님)

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    // ✅ 1. 환경변수 먼저 체크 (가장 중요)
    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) {
      console.error("❌ GROQ_API_KEY missing");
      return new Response("Missing API Key", { status: 500 });
    }

    // ✅ 2. Groq 인스턴스 생성
    const groq = new Groq({
      apiKey,
    });

    // ✅ 3. Streaming 요청
    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages,
      stream: true,
    });

    const encoder = new TextEncoder();

    // ✅ 4. Stream 생성 (ChatGPT 핵심 구조)
    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of completion as any) {
            const text = chunk.choices?.[0]?.delta?.content || "";

            if (text) {
              controller.enqueue(encoder.encode(text));
            }
          }
        } catch (streamError) {
          console.error("Stream error:", streamError);
        } finally {
          controller.close();
        }
      },
    });

    // ✅ 5. Response 반환
    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
      },
    });

  } catch (err) {
    console.error("CHAT API ERROR:", err);
    return new Response("Server Error", { status: 500 });
  }
}