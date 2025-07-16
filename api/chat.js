export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST requests allowed' });
  }

  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    console.error('Missing OPENAI_API_KEY');
    return res.status(500).json({ error: 'Missing OpenAI API key' });
  }

  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Missing message in request body' });
  }

  try {
    const openaiRes = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'Du er en dansk juridisk ekspert i forsikringsaftaler og svarer altid ud fra dansk ret. Du forklarer relevante paragraffer fra Forsikringsaftaleloven med præcision og uden at gætte.'
          },
          { role: 'user', content: message }
        ],
        temperature: 0.7
      })
    });

    if (!openaiRes.ok) {
      const error = await openaiRes.json();
      console.error('OpenAI API error:', error);
      return res.status(500).json({ error: 'Failed to get response from OpenAI', details: error });
    }

    const data = await openaiRes.json();
    const reply = data.choices?.[0]?.message?.content || 'Ugyldigt svar fra OpenAI';
    res.status(200).json({ reply });

  } catch (err) {
    console.error('Server error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}
