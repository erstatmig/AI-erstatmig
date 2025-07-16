export const config = { runtime: 'nodejs' };

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Kun POST tilladt' });
  }

  const { prompt } = req.body;

  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ reply: 'API-nøgle mangler' });
  }

  try {
    const apiRes = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7
      }),
    });

    const raw = await apiRes.text();

    return res.status(200).json({ reply: raw }); // vi returnerer altid noget i feltet 'reply'

  } catch (error) {
    return res.status(500).json({ reply: 'Fejl i kald til OpenAI: ' + error.message });
  }
}
