import { operationById } from "../data/operations";
import { applyGameEffects } from "./effects";
import { appendKeyedLog } from "./log";
import { hasResources, spendResources } from "./selectors";
import { cloneGameState } from "./validation";
import type { GameState, OperationDefinition, RegionId, ResolverResult } from "./types";

export function resolveOperation(game: GameState, operationId: string, targetRegionId: RegionId): ResolverResult {
  const operation = operationById[operationId] as OperationDefinition | undefined;
  if (!operation) return { state: game, success: false, reasonKey: "error.prerequisiteMissing" };
  if (!hasResources(game.resources, operation.cost)) {
    return { state: game, success: false, reasonKey: "error.insufficientResources" };
  }
  if (!(operation.requiresAbilityIds ?? []).every((id) => game.unlockedAbilities.includes(id))) {
    return { state: game, success: false, reasonKey: "error.prerequisiteMissing" };
  }

  let next = cloneGameState(game);
  next.resources = spendResources(next.resources, operation.cost);
  const multiplier = operation.id === "false_flag" && next.unlockedAbilities.includes("false_attribution_2") ? 1.5 : 1;
  next = applyGameEffects(next, operation.effects, targetRegionId, multiplier);
  next = appendKeyedLog(next, "log.operation.title", "log.operation.body", operation.riskLevel === "high" ? "warning" : "info", {
    operationName: operation.nameKey,
    regionName: `region.${targetRegionId}.name`,
  });
  return { state: next, success: true };
}
