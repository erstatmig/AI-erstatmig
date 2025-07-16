
import { NextResponse } from 'next/server'
import { OpenAI } from 'openai'
import fs from 'fs'
import path from 'path'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(req) {
  const { message } = await req.json()
  const dataPath = path.join(process.cwd(), 'public', 'erstatmig_ai_viden.json')

  let dokumenter = []
  try {
    const jsonData = fs.readFileSync(dataPath, 'utf-8')
    dokumenter = JSON.parse(jsonData)
  } catch (error) {
    console.error('Fejl ved indlæsning af lokal viden:', error)
  }

  // Find de mest relevante tekstbidder (her: alle med keyword match – simpelt)
  const relevante = dokumenter.filter(doc =>
    doc.indhold.toLowerCase().includes(message.toLowerCase()) ||
    doc.titel.toLowerCase().includes(message.toLowerCase())
  )

  // Brug top 3 som kontekst
  const kontekst = relevante.slice(0, 3).map(doc => `### ${doc.titel}
${doc.indhold.trim()}`).join("\n\n")

  const prompt = `
Du er en intelligent assistent, der rådgiver borgere ud fra Erstatmig.dk's perspektiv. 
Nedenfor er udvalgt viden fra Erstatmig.dk, som du skal bruge som grundlag.
Besvar brugerens spørgsmål loyalt mod denne viden og suppler med din generelle viden, hvis det er relevant.

${kontekst || "(Der blev ikke fundet noget relevant fra Erstatmig.dk.)"}

Brugerens spørgsmål: ${message}
`

  const completion = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [
      { role: 'system', content: 'Du rådgiver på baggrund af Erstatmig.dk og dens systemkritik.' },
      { role: 'user', content: prompt }
    ],
    temperature: 0.7
  })

  const reply = completion.choices[0]?.message?.content?.trim()
  return NextResponse.json({ reply })
}
