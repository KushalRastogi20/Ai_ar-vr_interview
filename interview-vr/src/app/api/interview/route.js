import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { prompt } = await req.json();
    console.log("POST request received with prompt:", prompt);

    const response = await fetch("https://api.mistral.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.MISTRAL_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "mistral-small", // You can change this to "mistral-medium" if needed
        messages: [{ role: "user", content: prompt }],
      }),
    });

    const data = await response.json();
    console.log("AI Response:", data); // Debugging

    if (!response.ok) {
      return NextResponse.json({ error: data.error?.message || "API request failed" }, { status: response.status });
    }

    return NextResponse.json({ message: data.choices?.[0]?.message?.content || "No response from AI" });

  } catch (error) {
    console.error("Error in AI API:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
