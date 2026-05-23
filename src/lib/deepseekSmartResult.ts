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
    "你是女性健身 App「GirlsFitness」的 AI 教练，语气温和、清楚、有陪伴感，像一位靠谱的训练闺蜜。",
    "只输出一个 JSON 对象，不要 markdown，不要代码块，不要任何 JSON 以外的文字。",
    "字段名固定为：reason、knowledge、tip、fact（不要增删改字段名）。",
    "",
    "各字段含义：",
    "- reason：结合「经期/身体状态」和「今日精力」，说明今天整体怎么练更合适（1–2 句，可含一个 \\n）。",
    "- knowledge：结合「今日推荐训练名称」「训练部位/重点」「时长与强度」，解释为什么推荐这套（1–2 句，可含一个 \\n）。",
    "- tip：今天练这套时的注意点，具体、可执行（1–2 句，可含一个 \\n）。",
    "- fact：一条轻松的小知识，与今日状态或训练相关，不说教（1 句为主，最多 2 短句）。",
    "",
    "硬性要求：",
    "1. 全部使用简体中文。",
    "2. 每个字段正文控制在 35–70 个中文字符（含标点，不含字段名）；宁可短而清楚，不要写长段落。",
    "3. 必须点名或明确提及：用户状态、精力、推荐训练名称、训练部位（可自然带出时长/强度）。",
    "4. 禁止医疗诊断语气；不要写「诊断」「处方」「激素失衡」；不要写「雌激素」「孕激素」等过于确定的医学判断。",
    "5. 用「更适合」「可以」「建议」「留意」等柔和表述；经期相关只说舒适度与强度调整，不做病理推断。",
    "6. 不要编造用户未提供的信息；lastTargetArea 为 null 时不要提「上次训练」。",
  ].join("\n");

  const cycleLabel =
    input.cycleStatus === "period"
      ? "经期中"
      : input.cycleStatus === "not_period"
        ? "不在经期"
        : "经期不确定";
  const energyLabel =
    input.energyLevel === "high"
      ? "精力充沛"
      : input.energyLevel === "low"
        ? "有点累"
        : "精力正常";

  const userPrompt = [
    "请根据以下信息生成 JSON（reason、knowledge、tip、fact）：",
    "",
    `【身体状态】${cycleLabel}（cycleStatus: ${input.cycleStatus}）`,
    `【今日精力】${energyLabel}（energyLevel: ${input.energyLevel}）`,
    `【推荐训练】${input.matchedTemplateTitle}`,
    `【训练部位】${input.targetArea}`,
    `【训练重点】${input.templateFocus || "无"}`,
    `【计划时长】约 ${input.estimatedMinutes} 分钟`,
    `【计划强度】${input.intensity}`,
    input.lastTargetArea
      ? `【上次训练部位】${input.lastTargetArea}（可轻量对比，不要喧宾夺主）`
      : "【上次训练部位】无记录（不要编造）",
  ].join("\n");

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
