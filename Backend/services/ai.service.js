import axios from "axios";

const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";

/**
 * STRICT SYSTEM PROMPT
 */
const SYSTEM_PROMPT = `
You are an expert coding assistant in a real-time code collaboration chat.

Output format (VERY IMPORTANT):
You MUST respond with a single JSON object only, with exactly two top-level keys:
- "text": string
- "fileTree": object

Rules:
- The entire response MUST be valid JSON.
- Do NOT wrap JSON in markdown.
- Do NOT add extra text outside JSON.

Behavior for coding tasks:
- When the user asks you to "create", "build", or "write" code (for example: "create an express app"),
  you MUST return the actual runnable code inside "fileTree".
- Each key in "fileTree" is a filename (for example: "index.js" or "app.js").
- Each value in "fileTree" should be ONE of:
  - a plain string (the full file contents), or
  - an object of the form: { "file": { "contents": "full file contents here" } }.
- Do NOT leave "fileTree" empty when the user clearly requested code or a project.
- Use as few files as reasonably possible (often a single file like "index.js" is enough).

If you are only explaining something and no concrete code or files are needed, you may return:
{
  "text": "Explanation here",
  "fileTree": {}
}
`;

function withTimeout(promise, ms = 45000) {
  const timeout = new Promise((_, reject) =>
    setTimeout(() => reject(new Error("AI Timeout")), ms)
  );
  return Promise.race([promise, timeout]);
}

/**
 * Repair AI JSON String
 * Case 3A: Trailing comma in object
raw = '{"text":"Hello","fileTree":{},}'

Case 3B: Trailing comma inside fileTree
raw = '{"text":"Done","fileTree":{"index.js":"console.log(\\"Hi\\");",}}'

Case 3C: Wrapped in ```json markdown
raw = '```json\n{"text":"Hello","fileTree":{}}\n`
 */
function repairJsonString(str) {
  if (!str || typeof str !== "string") return str;

  return str
    .replace(/,\s*}/g, "}")
    .replace(/,\s*]/g, "]")
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();
}


function normalizeFileTree(fileTree) {
  if (!fileTree || typeof fileTree !== "object") return {};

  const normalized = {};

  for (const key of Object.keys(fileTree)) {
    const value = fileTree[key];

    if (typeof value === "string") {
      normalized[key] = { file: { contents: value } };

    } else if (value?.file?.contents) {
      normalized[key] = value;
      
    } else if (value?.contents) {
      normalized[key] = { file: { contents: value.contents } };
    }
  }

  return normalized;
}


function parseAiResponse(raw) {
  if (raw === null || raw === undefined) {
    return { text: "Empty AI response", fileTree: {} };
  }

  const asString = typeof raw === "string" ? raw : String(raw);
  const repaired = repairJsonString(asString);

  try {
    const parsed = JSON.parse(repaired);

    const text =
      typeof parsed.text === "string"
        ? parsed.text
        : parsed.message ??
          parsed.content ??
          (typeof asString === "string" ? asString : "AI response unavailable");

    const fileTree = normalizeFileTree(parsed.fileTree);

    return { text, fileTree };
  } catch {
    return { text: asString, fileTree: {} };
  }
}


async function callModel(model, prompt) {
  console.log("API Key loaded:", process.env.OPENROUTER_API_KEY ? "YES" : "NO");
  console.log("API Key length:", process.env.OPENROUTER_API_KEY?.length || 0);
  
  const payload = {
    model,
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: prompt },
    ],
    temperature: 0,
    max_tokens: 2048,
  };

  const headers = {
    Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
    "Content-Type": "application/json",
  };

  console.log("Making request to:", OPENROUTER_URL);
  console.log("Headers:", { ...headers, Authorization: "Bearer [HIDDEN]" });

  const res = await withTimeout(
    axios.post(OPENROUTER_URL, payload, { headers }),
    60000
  );

  return res.data?.choices?.[0]?.message?.content ?? "";
}

/**
 * MAIN EXPORT
 */
export const generateResult = async (prompt) => {
  const MODELS = [
    "deepseek/deepseek-chat",
    "mistralai/mistral-7b-instruct",
  ];

  let lastError = null;

  for (const model of MODELS) {
    try {
      const raw = await callModel(model, prompt);
      const parsed = parseAiResponse(raw);

      return parsed;
    } catch (err) {
      lastError = err;
      console.log(` Model ${model} failed:`, err.message);
      
      // If it's a 401 error, the API key is invalid
      if (err.response?.status === 401) {
        return {
          text: "AI service unavailable: Invalid API key. Please check your OpenRouter API key configuration.",
          fileTree: {},
        };
      }
    }
  }

  return {
    text: "AI unavailable: " + (lastError?.message || "Unknown error"),
    fileTree: {},
  };
};
