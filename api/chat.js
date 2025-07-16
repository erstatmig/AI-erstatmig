export const config = { runtime: 'nodejs' };

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Kun POST tilladt' });
  }

  const { prompt } = req.body;

  if (!process.env.OPENAI_API_KEY) {
    return res.status(500).json({ error: 'Mangler OpenAI API-nøgle' });
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4', // eller 'gpt-3.5-turbo'
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7
      }),
    });

    const data = await response.json();

    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      return res.status(500).json({ error: 'GPT svarer ikke som forventet', raw: data });
    }

    res.status(200).json({ reply: data.choices[0].message.content.trim() });

  } catch (error) {
    res.status(500).json({ error: 'Fejl i OpenAI-kaldet', details: error.message });
  }
}
