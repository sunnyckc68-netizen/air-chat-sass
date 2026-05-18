import Groq from "groq-sdk";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) {
      return new Response("Missing API Key", { status: 500 });
    }

    const groq = new Groq({
      apiKey,
    });

    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages,
      stream: true,
    });

    const encoder = new TextEncoder();

    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of completion as any) {
            const text = chunk.choices?.[0]?.delta?.content || "";

            if (text) {
              controller.enqueue(encoder.encode(text));
            }
          }
        } finally {
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
      },
    });

  } catch (err) {
    console.error(err);
    return new Response("Server Error", { status: 500 });
  }
}