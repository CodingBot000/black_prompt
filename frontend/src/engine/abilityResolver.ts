import { abilityById } from "../data/abilities";
import { clamp } from "./clamp";
import { appendKeyedLog } from "./log";
import { getRegionNameKey, hasResources, spendResources } from "./selectors";
import { cloneGameState } from "./validation";
import type { AbilityDefinition, GameState, ResolverResult } from "./types";

export function canPurchaseAbility(game: GameState, abilityId: string): { can: boolean; reasonKey?: string } {
  const ability = abilityById[abilityId] as AbilityDefinition | undefined;
  if (!ability) return { can: false, reasonKey: "error.prerequisiteMissing" };
  if (game.unlockedAbilities.includes(ability.id)) return { can: false, reasonKey: "error.alreadyPurchased" };
  if (!ability.prerequisites.every((id) => game.unlockedAbilities.includes(id))) {
    return { can: false, reasonKey: "error.prerequisiteMissing" };
  }
  if (!hasResources(game.resources, ability.cost)) return { can: false, reasonKey: "error.insufficientResources" };
  return { can: true };
}

export function purchaseAbility(game: GameState, abilityId: string): ResolverResult {
  const ability = abilityById[abilityId] as AbilityDefinition | undefined;
  const check = canPurchaseAbility(game, abilityId);
  if (!ability || !check.can) return { state: game, success: false, reasonKey: check.reasonKey };

  let next = cloneGameState(game);
  next.resources = spendResources(next.resources, ability.cost);
  next.unlockedAbilities = [...next.unlockedAbilities, ability.id];
  applyStatEffects(next, ability);
  if (ability.exposureOnUnlock) {
    next.global.globalExposure = clamp(next.global.globalExposure + ability.exposureOnUnlock, 0, 100);
  }
  next = appendKeyedLog(next, "log.ability.title", "log.ability.body", "success", {
    abilityName: ability.nameKey,
    regionName: getRegionNameKey(next.selectedStartRegionId),
  });
  return { state: next, success: true };
}

function applyStatEffects(game: GameState, ability: AbilityDefinition): void {
  const effects = ability.effects;
  game.stats.propagation += effects.propagationAdd ?? 0;
  game.stats.stealth += effects.stealthAdd ?? 0;
  game.stats.evasion += effects.evasionAdd ?? 0;
  game.stats.impact += effects.impactAdd ?? 0;
  game.stats.modelPoisoning = clamp(game.stats.modelPoisoning + (effects.modelPoisoningAdd ?? 0), 0, 2);
  game.stats.falseAttribution += effects.falseAttributionAdd ?? 0;
  game.stats.disruptionPower += effects.disruptionPowerAdd ?? 0;
}
