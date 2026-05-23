import { getWorkoutTemplateById } from "@/data/workoutTemplates";
import {
  fetchDeepSeekSmartResultCopy,
  isValidSmartResultCopy,
  type SmartResultApiInput,
} from "@/lib/deepseekSmartResult";
import type { SmartResultCopy } from "@/lib/smartResultCopy";
import type { CycleStatus, EnergyLevel, TargetArea } from "@/data/workoutTemplates";

const CYCLE_STATUSES: readonly CycleStatus[] = ["period", "not_period", "uncertain"];
const ENERGY_LEVELS: readonly EnergyLevel[] = ["low", "normal", "high"];
const TARGET_AREAS: readonly TargetArea[] = [
  "lower_body",
  "upper_push",
  "upper_pull",
  "full_body",
  "core",
  "recovery",
];

function isCycleStatus(v: unknown): v is CycleStatus {
  return typeof v === "string" && (CYCLE_STATUSES as readonly string[]).includes(v);
}

function isEnergyLevel(v: unknown): v is EnergyLevel {
  return typeof v === "string" && (ENERGY_LEVELS as readonly string[]).includes(v);
}

function isTargetArea(v: unknown): v is TargetArea {
  return typeof v === "string" && (TARGET_AREAS as readonly string[]).includes(v);
}

function parseInput(body: unknown): SmartResultApiInput | null {
  if (body === null || typeof body !== "object") return null;
  const o = body as Record<string, unknown>;

  if (!isCycleStatus(o.cycleStatus) || !isEnergyLevel(o.energyLevel)) return null;
  if (typeof o.matchedTemplateId !== "string" || !o.matchedTemplateId.trim()) return null;

  const lastTargetArea =
    o.lastTargetArea === null || o.lastTargetArea === undefined
      ? null
      : isTargetArea(o.lastTargetArea)
        ? o.lastTargetArea
        : null;

  try {
    const template = getWorkoutTemplateById(o.matchedTemplateId.trim());
    return {
      cycleStatus: o.cycleStatus,
      energyLevel: o.energyLevel,
      matchedTemplateId: template.meta.id,
      matchedTemplateTitle:
        typeof o.matchedTemplateTitle === "string" && o.matchedTemplateTitle.trim()
          ? o.matchedTemplateTitle.trim()
          : template.meta.title,
      targetArea: template.meta.targetArea,
      templateFocus: template.meta.focus,
      estimatedMinutes: template.meta.estimatedMinutes,
      intensity: template.meta.intensity,
      lastTargetArea,
    };
  } catch {
    return null;
  }
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ success: false, message: "Invalid request body" }, { status: 400 });
  }

  const input = parseInput(body);
  if (!input) {
    return Response.json({ success: false, message: "Invalid smart result payload" }, { status: 400 });
  }

  const data: SmartResultCopy | null = await fetchDeepSeekSmartResultCopy(input);

  if (!data || !isValidSmartResultCopy(data)) {
    return Response.json({ success: false, source: "fallback" as const });
  }

  return Response.json({
    success: true,
    data,
    source: "deepseek" as const,
  });
}
