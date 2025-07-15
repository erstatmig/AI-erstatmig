export default async function handler(req, res) {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: "Mangler OpenAI API-nøgle" });
  }

  try {
    const userInput = req.body?.message || "Hej fra fallback";
    const openaiRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: userInput }],
      }),
    });

    const data = await openaiRes.json();
    const reply = data.choices?.[0]?.message?.content || "Ingen svar";

    res.status(200).json({ reply });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Noget gik galt", details: err.message });
  }
}

