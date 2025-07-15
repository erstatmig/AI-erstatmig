# Erstatmig AI-backend

Dette repository indeholder backend-koden til en AI-widget på hjemmesiden [Erstatmig.dk](https://erstatmig.dk).

Formålet er at give brugerne mulighed for at stille spørgsmål og få svar fra en GPT-model – fx om forsikringsret, FAL § 33-34, Færdselsloven § 67 og andre relevante emner.

## 🔧 Teknologi

- **Node.js / Vercel serverless functions**
- **OpenAI API**

## 📁 Strukturelt overblik

- `api/ai.js` – håndterer input og svar
- `vercel.json` – konfiguration til Vercel
- `package.json` – afhængigheder (kun `openai`)

## 🚀 Deployment

1. Importér repo til [vercel.com](https://vercel.com)
2. Tilføj en environment variable:
   - `OPENAI_API_KEY = sk-xxxxxx`
3. Tryk "Deploy"

Backend'en er nu tilgængelig via:
