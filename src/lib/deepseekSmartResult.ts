import type { SmartResultCopy } from "@/lib/smartResultCopy";
import type { CycleStatus, EnergyLevel, TargetArea } from "@/data/workoutTemplates";

export type SmartResultApiInput = {
  cycleStatus: CycleStatus;
  energyLevel: EnergyLevel;
  matchedTemplateId: string;
  matchedTemplateTitle: string;
  targetArea: TargetArea;
  templateFocus: string;
  estimatedMinutes: number;
  intensity: string;
  lastTargetArea: TargetArea | null;
};

const DEEPSEEK_BASE_URL = "https://api.deepseek.com";
const DEEPSEEK_MODEL = "deepseek-chat";
const MAX_TOKENS = 500;

export function isValidSmartResultCopy(data: unknown): data is SmartResultCopy {
  if (data === null || typeof data !== "object") return false;
  const o = data as Record<string, unknown>;
  return (
    typeof o.reason === "string" &&
    o.reason.trim().length > 0 &&
    typeof o.knowledge === "string" &&
    o.knowledge.trim().length > 0 &&
    typeof o.tip === "string" &&
    o.tip.trim().length > 0 &&
    typeof o.fact === "string" &&
    o.fact.trim().length > 0
  );
}

function normalizeSmartResultCopy(data: SmartResultCopy): SmartResultCopy {
  return {
    reason: data.reason.trim(),
    knowledge: data.knowledge.trim(),
    tip: data.tip.trim(),
    fact: data.fact.trim(),
  };
}

function parseModelJson(content: string): unknown {
  const trimmed = content.trim();
  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const raw = fenced ? fenced[1].trim() : trimmed;
  return JSON.parse(raw);
}

export async function fetchDeepSeekSmartResultCopy(
  input: SmartResultApiInput,
): Promise<SmartResultCopy | null> {
  const apiKey = process.env.DEEPSEEK_API_KEY?.trim();
  if (!apiKey) return null;

  const systemPrompt = [
    "你是女性健身 App 的文案助手。",
    "只输出一个 JSON 对象，不要 markdown，不要其它说明。",
    '字段必须是：reason、knowledge、tip、fact。',
    "要求：中文、语气柔和、每段 2-4 行可用换行符 \\n，非医疗诊断，每段不超过 120 字。",
  ].join("\n");

  const userPrompt = JSON.stringify({
    cycleStatus: input.cycleStatus,
    energyLevel: input.energyLevel,
    matchedTemplateTitle: input.matchedTemplateTitle,
    templateFocus: input.templateFocus,
    targetArea: input.targetArea,
    estimatedMinutes: input.estimatedMinutes,
    intensity: input.intensity,
    lastTargetArea: input.lastTargetArea,
  });

  try {
    const response = await fetch(`${DEEPSEEK_BASE_URL}/v1/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: DEEPSEEK_MODEL,
        max_tokens: MAX_TOKENS,
        temperature: 0.7,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
      }),
      cache: "no-store",
    });

    if (!response.ok) return null;

    const payload = (await response.json()) as {
      choices?: { message?: { content?: string } }[];
    };
    const content = payload.choices?.[0]?.message?.content;
    if (typeof content !== "string" || !content.trim()) return null;

    const parsed = parseModelJson(content);
    if (!isValidSmartResultCopy(parsed)) return null;
    return normalizeSmartResultCopy(parsed);
  } catch {
    return null;
  }
}
