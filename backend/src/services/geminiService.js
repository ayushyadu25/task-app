const addDays = (date, days) => {
  const nextDate = new Date(date);
  nextDate.setDate(nextDate.getDate() + days);
  return nextDate;
};

const toDateInputValue = (date) => date.toISOString().slice(0, 10);

const fallbackEstimate = ({ title, description, reason }) => {
  const text = `${title} ${description}`.toLowerCase();
  const wordCount = text.split(/\s+/).filter(Boolean).length;
  const looksComplex = /(integrat|auth|database|dashboard|deploy|api|payment|security)/.test(text);

  let effortHours = 2;
  let dueInDays = 2;

  if (wordCount > 25 || looksComplex) {
    effortHours = 6;
    dueInDays = 5;
  }

  if (wordCount > 55) {
    effortHours = 10;
    dueInDays = 8;
  }

  return {
    effort: `${effortHours} hours`,
    dueDate: toDateInputValue(addDays(new Date(), dueInDays)),
    reasoning: reason || "Local fallback estimate based on task length and complexity keywords.",
    source: "fallback",
  };
};

const parseGeminiJson = (text) => {
  const cleaned = text
    .replace(/^```json/i, "")
    .replace(/^```/, "")
    .replace(/```$/, "")
    .trim();

  return JSON.parse(cleaned);
};

export const suggestTaskEstimate = async ({ title, description }) => {
  const apiKey = process.env.GEMINI_API_KEY;
  const model = process.env.GEMINI_MODEL || "gemini-2.0-flash";

  if (!apiKey) {
    return fallbackEstimate({
      title,
      description,
      reason: "Gemini API key is not configured, so TaskFlow used a local estimate.",
    });
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);
  const today = toDateInputValue(new Date());

  const prompt = `
You are helping a user estimate a task for a lightweight task management app.
Today is ${today}.
Return only valid JSON. Do not wrap it in markdown.
The JSON must have:
- effort: short human-readable estimate, such as 2 hours, 1 day, or M
- dueDate: YYYY-MM-DD, a reasonable date from today onward
- reasoning: one friendly sentence, maximum 140 characters

Task title: ${title}
Task description: ${description || "No description provided."}
`;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
      {
        method: "POST",
        signal: controller.signal,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [{ text: prompt }],
            },
          ],
          generationConfig: {
            temperature: 0.2,
            responseMimeType: "application/json",
          },
        }),
      },
    );

    if (!response.ok) {
      throw new Error(`Gemini request failed with ${response.status}`);
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.map((part) => part.text).join("") || "";
    const parsed = parseGeminiJson(text);

    if (!parsed.effort || !/^\d{4}-\d{2}-\d{2}$/.test(parsed.dueDate)) {
      throw new Error("Gemini returned an incomplete estimate.");
    }

    return {
      effort: String(parsed.effort).slice(0, 60),
      dueDate: parsed.dueDate,
      reasoning: String(parsed.reasoning || "Suggested by Gemini.").slice(0, 180),
      source: "gemini",
    };
  } catch (error) {
    return fallbackEstimate({
      title,
      description,
      reason:
        error.name === "AbortError"
          ? "Gemini took too long, so TaskFlow used a local estimate."
          : "Gemini was unavailable, so TaskFlow used a local estimate.",
    });
  } finally {
    clearTimeout(timeout);
  }
};
