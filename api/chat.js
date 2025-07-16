// Sørger for at koden ikke kører som en Edge Function
export const config = {
  runtime: 'nodejs',
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Kun POST tilladt' });
  }

  const body = req.body;

  // Debug: Log hele body
  if (!body || !body.message) {
    return res.status(400).json({ error: 'Manglende "message" i request body' });
  }

  // Hent API-nøgle fra env - eller fallback
  const apiKey = process.env.OPENAI_API_KEY || 'sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxx'; // ← Erstat med din rigtige nøgle som test

  if (!apiKey || apiKey.startsWith('sk-xxxxxxxx')) {
    return res.status(500).json({
      error: 'API-nøgle mangler eller er fallback',
      hint: 'Sørg for at OPENAI_API_KEY er sat i Vercel Environment Variables og at runtime er nodejs',
      env_debug: process.env,
    });
  }

  try {
    const apiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: body.message }],
        temperature: 0.7,
      }),
    });

    if (!apiResponse.ok) {
      const errData = await apiResponse.json();
      return res.status(apiResponse.status).json({
        error: 'OpenAI API-fejl',
        detail: errData,
      });
    }

    const data = await apiResponse.json();
    const reply = data.choices?.[0]?.message?.content || '[Intet svar modtaget]';

    return res.status(200).json({ reply });
  } catch (error) {
    return res.status(500).json({
      error: 'Serverfejl i chat-handler',
      detail: error.message,
    });
  }
}
