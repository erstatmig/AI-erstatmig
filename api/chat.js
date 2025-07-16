// /api/chat.js
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Kun POST tilladt' });
  }

  const { userInput } = req.body;

  const messages = [
    {
      role: 'system',
      content: `Du er en dansk juridisk AI-assistent. 
Du svarer kun på spørgsmål om Forsikringsaftaleloven (FAL). 
Du må ikke bruge Forvaltningsloven, GDPR eller andre love. 
Hvis du ikke kan svare med sikkerhed, så sig det ærligt. 
Svar kort, klart og præcist.

Centrale bestemmelser:
- § 33: Hvis kunden har givet urigtige oplysninger, kan selskabet afvise dækning – men kun hvis det har betydning for risikoen.
- § 34: Selskabet mister retten til at påberåbe sig § 33, hvis det vidste eller burde vide at oplysningerne var forkerte og ikke reagerede.
- § 35: Hvis selskabet vil undgå at være bundet, skal det gøre det klart og rettidigt, ellers gælder forsikringen fortsat.

Svar kun hvis du kan gøre det korrekt og relevant.`
    },
    {
      role: 'user',
      content: userInput
    }
  ];

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages,
        temperature: 0.3,
      })
    });

    const data = await response.json();

    if (data.error) {
      return res.status(500).json({ error: data.error.message });
    }

    const aiReply = data.choices?.[0]?.message?.content || 'Intet svar.';
    res.status(200).json({ reply: aiReply });

  } catch (error) {
    console.error('Fejl i API-kald:', error);
    res.status(500).json({ error: 'Fejl ved kommunikation med OpenAI.' });
  }
}
