export const config = { runtime: 'nodejs' };

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Kun POST tilladt' });
  }

  const { prompt } = req.body;

  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: 'Mangler OpenAI API-nøgle (process.env)' });
  }

  try {
    const apiRes = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',  // fallback model
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7
      }),
    });

    const raw = await apiRes.text(); // ikke json endnu
    let parsed;

    try {
      parsed = JSON.parse(raw);
    } catch (e) {
      return res.status(500).json({ error: 'Kunne ikke parse svar fra OpenAI', raw });
    }

    if (!parsed.choices || !parsed.choices[0]) {
      return res.status(500).json({ error: 'Ugyldigt svar fra OpenAI', full: parsed });
    }

    const reply = parsed.choices[0].message?.content?.trim() || '[Intet indhold i svar]';
    return res.status(200).json({ reply });

  } catch (error) {
    return res.status(500).json({ error: 'Fejl i kald til OpenAI', details: error.message });
  }
}
