# Lado AI operations

## What powers Lado AI

Lado AI currently combines:
- A built-in verified FAQ library with English, Hindi and Shekhawati/Roman-Marwari question patterns.
- Published custom answers from the Admin AI Knowledge Library.
- Live product catalogue data for current product names, available variants and listed prices.
- An optional OpenAI response path for questions that are not confidently answered by local retrieval.

This is retrieval plus generation, not model training or fine-tuning. The curated regression tests protect known question patterns; they do not prove a 95% real-world answer rate.

## Enable generative answers in Vercel

The application reads `OPENAI_API_KEY` on the server. If it is absent, Lado AI can answer confident local knowledge matches and live catalogue questions, but unknown questions receive the safe support fallback.

1. Open the Lado Organics project in Vercel.
2. Open **Settings → Environment Variables**.
3. Add `OPENAI_API_KEY` as a sensitive server-side variable for **Production** and **Preview** (and Development if needed).
4. Use an API key from the Lado Organics OpenAI API account. Do not put the key in source code, a public `NEXT_PUBLIC_*` variable, GitHub, or customer-facing chat.
5. Save the variable and trigger a new deployment so the server runtime receives it.
6. Open **Admin → AI Knowledge Library** and confirm that the Generative answer engine status shows **Enabled**.

The optional `OPENAI_MODEL` variable selects the model; the current code default is `gpt-4o-mini`. Keep model choice aligned with the account's available models and budget.

## Maintain verified knowledge

Open `/admin/ai-knowledge` using an account with Website Content permission.

- Add one topic per answer.
- Put alternative questions in the Example questions field, separated by `|`.
- Include natural English, Devanagari Hindi, Roman Hindi, Devanagari Marwari and Roman Marwari variants where appropriate.
- Publish only information approved by the Lado team.
- Keep changing values (prices, stock, order state, dispatch estimates) in live data sources rather than static answers.
- Never add unverified medical, nutritional, certification, laboratory, animal-care, delivery or legal claims.
- Keep order lookup customer-scoped; never put customer order details in the public knowledge library.

## Run the retrieval regression tests

Run:

```bash
npm run test:lado-ai
```

The suite checks 146 curated retrieval, language-detection, ambiguity and unknown-question cases. It is a regression guard, not a representative customer benchmark. Before claiming 95% coverage, collect a privacy-reviewed, representative set of real customer questions across English, Hindi, Marwari, scripts, transliteration and mixed-language messages; have Lado staff verify answer correctness; report both answer coverage and factual correctness separately.

## Deployment verification

A merged GitHub change is not proof of a live deployment. Confirm the Vercel deployment references the exact merged commit, reaches READY, receives the production alias, and then smoke-test the live AI with a known FAQ, a Hindi question, a Marwari question, a live price question and an unknown question.
