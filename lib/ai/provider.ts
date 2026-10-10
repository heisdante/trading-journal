type AiTask = "intake" | "review" | "analysis";
type Schema = Record<string, unknown>;

type AiRequest = {
  task: AiTask;
  instructions: string;
  input: string;
  images?: string[];
  schema?: Schema;
  schemaName?: string;
  timeoutMs?: number;
};

function selectedProvider(): "openrouter" | "openai" | null {
  const choice = process.env.AI_PROVIDER?.toLowerCase();
  if (choice === "openrouter") return process.env.OPENROUTER_API_KEY ? "openrouter" : null;
  if (choice === "openai") return process.env.OPENAI_API_KEY ? "openai" : null;
  if (process.env.OPENROUTER_API_KEY) return "openrouter";
  return process.env.OPENAI_API_KEY ? "openai" : null;
}

export function isAiConfigured() {
  return selectedProvider() !== null;
}

function modelFor(task: AiTask, provider: "openrouter" | "openai") {
  if (provider === "openrouter") return process.env.OPENROUTER_MODEL || "openai/gpt-4o-mini";
  if (task === "intake") return process.env.OPENAI_TRADE_INTAKE_MODEL || "gpt-5-mini";
  if (task === "analysis") return process.env.OPENAI_ANALYSIS_MODEL || "gpt-5-mini";
  return process.env.OPENAI_TRADE_REVIEW_MODEL || "gpt-5-mini";
}

export async function requestAi({ task, instructions, input, images = [], schema, schemaName, timeoutMs = 30000 }: AiRequest): Promise<string> {
  const provider = selectedProvider();
  if (!provider) throw new Error("AI provider is not configured.");
  const model = modelFor(task, provider);
  const format = schema ? { name: schemaName || "journal_response", strict: true, schema } : undefined;
  const endpoint = provider === "openrouter" ? "https://openrouter.ai/api/v1/chat/completions" : "https://api.openai.com/v1/responses";
  const key = provider === "openrouter" ? process.env.OPENROUTER_API_KEY : process.env.OPENAI_API_KEY;
  const body = provider === "openrouter"
    ? {
        model,
        messages: [
          { role: "system", content: instructions },
          { role: "user", content: images.length
            ? [{ type: "text", text: input }, ...images.map((url) => ({ type: "image_url", image_url: { url } }))]
            : input },
        ],
        provider: { data_collection: "deny", ...(format ? { require_parameters: true } : {}) },
        ...(format ? { response_format: { type: "json_schema", json_schema: format } } : {}),
      }
    : {
        model,
        store: false,
        instructions,
        input: images.length
          ? [{ role: "user", content: [{ type: "input_text", text: input }, ...images.map((image_url) => ({ type: "input_image", image_url, detail: "low" }))] }]
          : input,
        ...(format ? { text: { format: { type: "json_schema", ...format } } } : {}),
      };
  const response = await fetch(endpoint, {
    method: "POST",
    signal: AbortSignal.timeout(timeoutMs),
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!response.ok) throw new Error(`AI provider returned ${response.status}.`);
  const result = await response.json() as {
    choices?: Array<{ message?: { content?: string | Array<{ type?: string; text?: string }> } }>;
    output_text?: string;
    output?: Array<{ content?: Array<{ type?: string; text?: string }> }>;
  };
  const chatContent = result.choices?.[0]?.message?.content;
  const text = provider === "openrouter"
    ? typeof chatContent === "string" ? chatContent : chatContent?.find((part) => part.type === "text")?.text
    : result.output_text || result.output?.flatMap((item) => item.content ?? []).find((part) => part.type === "output_text")?.text;
  if (!text) throw new Error("AI provider returned no text.");
  return text;
}
