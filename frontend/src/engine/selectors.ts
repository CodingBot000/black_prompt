import { abilities } from "../data/abilities";
import { regionById, regionIds } from "../data/regions";
import type {
  AbilityEffects,
  GameState,
  RegionId,
  RegionRuntimeState,
  ResourceKey,
  Resources,
  RouteType,
} from "./types";

export interface AbilityModifierTotals {
  tagSpreadBonus: Record<string, number>;
  routeTypeBonus: Partial<Record<RouteType, number>>;
  detectionMultiplier: number;
  defenseEffectMultiplier: number;
  defenseResearchMultiplier: number;
  influenceGainMultiplier: number;
  globalDefenseRateMultiplier: number;
  globalExposureMultiplier: number;
  computeGainMultiplier: number;
  stabilityLossMultiplier: number;
  cloudDependencyBonus: number;
  adminControlMultiplier: number;
  gulfInfluenceBonus: number;
}

export function getAbilityModifierTotals(game: GameState): AbilityModifierTotals {
  const totals: AbilityModifierTotals = {
    tagSpreadBonus: {},
    routeTypeBonus: {},
    detectionMultiplier: 1,
    defenseEffectMultiplier: 1,
    defenseResearchMultiplier: 1,
    influenceGainMultiplier: 1,
    globalDefenseRateMultiplier: 1,
    globalExposureMultiplier: 1,
    computeGainMultiplier: 1,
    stabilityLossMultiplier: 1,
    cloudDependencyBonus: 0,
    adminControlMultiplier: 1,
    gulfInfluenceBonus: 0,
  };

  for (const ability of abilities) {
    if (!game.unlockedAbilities.includes(ability.id)) continue;
    mergeAbilityEffects(totals, ability.effects);
  }

  return totals;
}

function mergeAbilityEffects(totals: AbilityModifierTotals, effects: AbilityEffects): void {
  for (const [tag, amount] of Object.entries(effects.tagSpreadBonus ?? {})) {
    totals.tagSpreadBonus[tag] = (totals.tagSpreadBonus[tag] ?? 0) + amount;
  }
  for (const [type, amount] of Object.entries(effects.routeTypeBonus ?? {}) as [RouteType, number][]) {
    totals.routeTypeBonus[type] = (totals.routeTypeBonus[type] ?? 0) + amount;
  }
  totals.detectionMultiplier *= effects.detectionMultiplier ?? 1;
  totals.defenseEffectMultiplier *= effects.defenseEffectMultiplier ?? 1;
  totals.defenseResearchMultiplier *= effects.defenseResearchMultiplier ?? 1;
  totals.influenceGainMultiplier *= effects.influenceGainMultiplier ?? 1;
  totals.globalDefenseRateMultiplier *= effects.globalDefenseRateMultiplier ?? 1;
  totals.globalExposureMultiplier *= effects.globalExposureMultiplier ?? 1;
  totals.computeGainMultiplier *= effects.computeGainMultiplier ?? 1;
  totals.stabilityLossMultiplier *= effects.stabilityLossMultiplier ?? 1;
  totals.cloudDependencyBonus += effects.cloudDependencyBonus ?? 0;
  totals.adminControlMultiplier *= effects.adminControlMultiplier ?? 1;
  totals.gulfInfluenceBonus += effects.gulfInfluenceBonus ?? 0;
}

export function hasResources(resources: Resources, cost: Partial<Record<ResourceKey, number>>): boolean {
  return Object.entries(cost).every(([key, amount]) => resources[key as ResourceKey] >= (amount ?? 0));
}

export function spendResources(resources: Resources, cost: Partial<Record<ResourceKey, number>>): Resources {
  return {
    compute: resources.compute - (cost.compute ?? 0),
    exploit: resources.exploit - (cost.exploit ?? 0),
    influencePoint: resources.influencePoint - (cost.influencePoint ?? 0),
  };
}

export function getRegionState(game: GameState, regionId: RegionId): RegionRuntimeState {
  return game.regions[regionId];
}

export function getAverageInfiltration(game: GameState): number {
  return average(regionIds.map((id) => game.regions[id].infiltration));
}

export function getAverageInfluence(game: GameState): number {
  return average(regionIds.map((id) => game.regions[id].influence));
}

export function getAverageDefense(game: GameState): number {
  return average(regionIds.map((id) => game.regions[id].defense));
}

export function countRegionsWhere(game: GameState, predicate: (state: RegionRuntimeState, id: RegionId) => boolean): number {
  return regionIds.filter((id) => predicate(game.regions[id], id)).length;
}

export function getTopInfiltratedRegions(game: GameState, limit: number): RegionId[] {
  return [...regionIds]
    .sort((a, b) => game.regions[b].infiltration - game.regions[a].infiltration)
    .slice(0, limit);
}

export function getRegionNameKey(regionId: RegionId): string {
  return regionById[regionId].nameKey;
}

function average(values: number[]): number {
  if (values.length === 0) return 0;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}
