import OpenAI from "openai";

const openaiApiKey = process.env.OPENAI_API_KEY;
const client = openaiApiKey ? new OpenAI({ apiKey: openaiApiKey }) : null;

export async function summarizeNewsBatch(
  entries: { title: string; content: string; currencies: string[] }[]
): Promise<string[]> {
  if (!entries.length) {
    return [];
  }

  if (!client) {
    return entries.map((entry) => {
      const base = entry.content.split(/[.!?]/).slice(0, 2).join(". ").trim();
      const fallback = base || entry.content.slice(0, 160);
      return `${fallback}${fallback.endsWith(".") ? "" : "."}`;
    });
  }

  const prompt = `Summarize the following forex news items for professional currency traders. 
Highlight actionable catalysts, impacted currency pairs, and notable sentiment in <= 40 words per item. 
Return each summary on a new line, numbered. 

News:\n${entries
    .map(
      (entry, idx) =>
        `${idx + 1}. Title: ${entry.title}\nCurrency Pairs: ${entry.currencies.join(
          ", "
        )}\nContent: ${entry.content}`
    )
    .join("\n\n")}`;

  const response = await client.responses.create({
    model: "gpt-4o-mini",
    input: prompt,
    temperature: 0.2,
    max_output_tokens: 500
  });

  const text = response.output_text ?? "";
  const lines = text
    .split("\n")
    .map((line) => line.replace(/^\d+\.\s*/, "").trim())
    .filter(Boolean);

  if (lines.length >= entries.length) {
    return lines.slice(0, entries.length);
  }

  const fallbackSummaries = entries.map((entry) => entry.content.slice(0, 200));
  return fallbackSummaries.map((fallback, idx) => lines[idx] ?? fallback);
}
