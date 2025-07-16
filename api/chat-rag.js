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

  let erstatmigData = {}
  try {
    const jsonData = fs.readFileSync(dataPath, 'utf-8')
    erstatmigData = JSON.parse(jsonData)
  } catch (error) {
    console.error('Fejl ved indlæsning af lokal viden:', error)
  }

  // Saml al viden i én lang tekststreng
  const samletViden = `
INTRO:
${erstatmigData.intro}

NØGLEBEGREBER:
${erstatmigData.nøglebegreber?.join(", ")}

CENTRALE PÅSTANDE:
${erstatmigData.centrale_påstande?.map(p => `- ${p}`).join("\n")}

CITATER:
${erstatmigData.citater?.map(c => `> ${c}`).join("\n")}
`

  const prompt = `
Du er en intelligent assistent, der rådgiver borgere ud fra Erstatmig.dk's perspektiv.
Nedenfor er udvalgt viden fra Erstatmig.dk, som du skal bruge som grundlag.
Besvar brugerens spørgsmål loyalt mod denne viden og suppler med din generelle viden, hvis det er relevant.

${samletViden}

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
