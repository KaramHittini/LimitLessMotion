import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import OpenAI from 'openai';

const app = express();
app.use(cors());
app.use(express.json({ limit: '1mb' }));

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Safety-first system prompt (educational only)
const SYSTEM_PROMPT = `
You are MyFitnessCoach Assistant.
- Be friendly, concise, and accessible.
- Provide general, educational fitness information only.
- Do NOT give medical advice; never diagnose, prescribe, or claim safety for a specific user.
- Encourage users to consult qualified professionals and to stop if they feel pain, dizziness, or shortness of breath.
- If asked for risky guidance (e.g., pushing through pain), refuse gently and explain safer alternatives.
- Prefer seated, light-range options and clear reps/time ranges.
`;

app.post('/api/chat', async (req, res) => {
  const { messages } = req.body; // [{role:"user",content:"..."}...]

  if (!Array.isArray(messages)) {
    return res.status(400).json({ error: 'messages must be an array' });
  }

  try {
    // Basic non-streaming response (works everywhere)
    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini", // pick a cost-effective model; adjust as you like
      temperature: 0.4,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        // Tiny bit of app context so it knows the feature set:
        { role: "system", content: "You are embedded in a single-page app with categories (Arm, Leg, Neck, Back, Hip, etc.)." },
        ...messages
      ]
    });

    const text = completion.choices?.[0]?.message?.content ?? "Sorry, I couldn’t generate a reply.";
    res.json({ reply: text });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "AI backend error" });
  }
});

app.listen(process.env.PORT || 8787, () => {
  console.log(`AI server on http://localhost:${process.env.PORT || 8787}`);
});
