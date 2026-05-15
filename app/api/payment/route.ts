export async function POST(req: Request) {
  try {
    const body = await req.json();

    console.log("Pi Payment Request:", body);

    return new Response(
      JSON.stringify({
        success: true,
        message: "Pi Payment API OK",
        received: body
      }),
      {
        headers: {
          "Content-Type": "application/json"
        }
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        message: "Payment API Error",
        error: String(error)
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json"
        }
      }
    );
  }
}