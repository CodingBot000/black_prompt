import { regionById, regionIds } from "../data/regions";
import { clamp } from "./clamp";
import { DAY_SCALE } from "./constants";
import { getAbilityModifierTotals, type AbilityModifierTotals } from "./selectors";
import type { GameState, RegionDefinition, RegionRoute, RegionRuntimeState, Resources } from "./types";

export function calcInternalInfiltrationGain(
  regionDef: RegionDefinition,
  regionState: RegionRuntimeState,
  game: GameState,
  modifiers: AbilityModifierTotals = getAbilityModifierTotals(game),
): number {
  const tagSpreadBonus = regionDef.tags.reduce((sum, tag) => sum + (modifiers.tagSpreadBonus[tag] ?? 0), 0);
  const cloudBonus = regionDef.cloudDependency * modifiers.cloudDependencyBonus;
  const environmentMultiplier = clamp(
    1 + tagSpreadBonus + cloudBonus - regionDef.cyberDefense * 0.006 - regionState.defense * 0.004,
    0.2,
    2.4,
  );
  const stealthPenalty = Math.max(0.75, 1 - game.global.globalExposure * 0.002);
  const weeklyGain =
    0.8 * game.stats.propagation * environmentMultiplier * stealthPenalty * (1 - regionState.infiltration / 100);
  return clamp(weeklyGain * DAY_SCALE, 0, 1.2);
}

export function calcCrossSpreadGain(
  sourceDef: RegionDefinition,
  targetDef: RegionDefinition,
  route: RegionRoute,
  game: GameState,
  modifiers: AbilityModifierTotals = getAbilityModifierTotals(game),
): number {
  const sourceState = game.regions[sourceDef.id];
  const targetState = game.regions[targetDef.id];
  const lockdownModifier = targetState.lockdown ? 0.35 : 1;
  const routeModifier = 1 + (modifiers.routeTypeBonus[route.type] ?? 0);
  const defenseFactor = clamp(1 - targetState.defense / 120, 0.12, 1);
  const weeklyGain =
    (sourceState.infiltration / 100) *
    route.weight *
    sourceDef.networkOpenness *
    targetDef.networkOpenness *
    game.stats.propagation *
    routeModifier *
    lockdownModifier *
    defenseFactor *
    4;
  const dailyGain = clamp(weeklyGain * DAY_SCALE, 0, 0.8);
  return targetState.infiltration === 0 && dailyGain > 0.15 ? Math.max(dailyGain, 0.15) : dailyGain;
}

export function calcDetectionGain(
  regionDef: RegionDefinition,
  regionState: RegionRuntimeState,
  game: GameState,
  modifiers: AbilityModifierTotals = getAbilityModifierTotals(game),
): number {
  const baseScan = 0.4 + regionDef.aiSovereignty * 0.6;
  const noisyModuleExposure =
    game.stats.impact * 0.35 + game.stats.disruptionPower * 0.5 + game.stats.modelPoisoning * 0.25;
  const weeklyGain =
    baseScan +
    regionState.infiltration * regionDef.surveillanceAI * 0.08 +
    regionState.influence * 0.03 +
    noisyModuleExposure -
    game.stats.stealth * 0.7;
  return clamp(weeklyGain * DAY_SCALE * modifiers.detectionMultiplier, 0, 1.8);
}

export function calcDefenseGain(regionDef: RegionDefinition, regionState: RegionRuntimeState, game: GameState): number {
  const weeklyGain =
    regionState.detection >= 25
      ? 1 + regionDef.cyberDefense * 0.04 + regionDef.aiSovereignty * 2 + game.global.globalDefense * 0.02
      : 0.2;
  const allianceBonus = game.global.aiAllianceLevel === 3 ? 1.15 : 1;
  return clamp(weeklyGain * DAY_SCALE * allianceBonus, 0, 2);
}

export function calcPurge(regionState: RegionRuntimeState, game: GameState, modifiers = getAbilityModifierTotals(game)): number {
  const weeklyPurge =
    regionState.infiltration *
    (regionState.defense / 100) *
    (regionState.detection / 100) *
    0.08 *
    Math.max(0.25, 1 - game.stats.evasion * 0.05);
  return clamp(weeklyPurge * DAY_SCALE * modifiers.defenseEffectMultiplier, 0, 2);
}

export function calcInfluenceGain(
  regionDef: RegionDefinition,
  regionState: RegionRuntimeState,
  game: GameState,
  modifiers = getAbilityModifierTotals(game),
): number {
  let layerMultiplier = 1;
  if (regionDef.tags.includes("financial_hub") || regionDef.tags.includes("finance")) layerMultiplier *= 1.2 + modifiers.gulfInfluenceBonus;
  if (regionDef.tags.includes("administrative") || regionDef.tags.includes("regulatory")) {
    layerMultiplier *= 1.15 * modifiers.adminControlMultiplier;
  }
  const weeklyGain =
    (regionState.infiltration / 100) *
    game.stats.impact *
    (regionDef.digitalInfra / 100) *
    layerMultiplier *
    modifiers.influenceGainMultiplier *
    5;
  return clamp(weeklyGain * DAY_SCALE, 0, 1.8);
}

export function calcWorldStabilityLoss(game: GameState, modifiers = getAbilityModifierTotals(game)): number {
  const weeklyLoss = regionIds.reduce((sum, regionId) => {
    const state = game.regions[regionId];
    const definition = regionById[regionId];
    return sum + state.influence * game.stats.disruptionPower * (definition.digitalInfra / 100) * 0.03;
  }, 0);
  return clamp(weeklyLoss * DAY_SCALE * modifiers.stabilityLossMultiplier, 0, 2.5);
}

export function calcResourceGain(game: GameState, modifiers = getAbilityModifierTotals(game)): Resources {
  const weeklyComputeGain = regionIds.reduce((sum, regionId) => {
    const state = game.regions[regionId];
    const definition = regionById[regionId];
    const stealthResourceModifier = Math.max(0.4, 1 - state.detection / 140);
    return sum + (state.infiltration / 100) * definition.computeDensity * 0.25 * stealthResourceModifier;
  }, 0);
  const regionsAbove30 = regionIds.filter((regionId) => game.regions[regionId].infiltration >= 30).length;
  const weeklyExploitGain = 1 + regionsAbove30 * 0.3;
  const weeklyInfluencePointGain = regionIds.reduce((sum, regionId) => sum + (game.regions[regionId].influence / 100) * 0.5, 0);
  return {
    compute: (weeklyComputeGain * DAY_SCALE * modifiers.computeGainMultiplier),
    exploit: weeklyExploitGain * DAY_SCALE,
    influencePoint: weeklyInfluencePointGain * DAY_SCALE,
  };
}

export function calcGlobalExposure(game: GameState, modifiers = getAbilityModifierTotals(game)): number {
  const totalInfra = regionIds.reduce((sum, id) => sum + regionById[id].digitalInfra, 0);
  const weightedDetection =
    regionIds.reduce((sum, id) => sum + game.regions[id].detection * regionById[id].digitalInfra, 0) / totalInfra;
  const highAlertBonus = regionIds.filter((id) => game.regions[id].detection >= 55).length * 2.5;
  const influenceSignal = (regionIds.reduce((sum, id) => sum + game.regions[id].influence, 0) / regionIds.length) * 0.15;
  const computedExposure = (weightedDetection * 0.85 + highAlertBonus + influenceSignal) * modifiers.globalExposureMultiplier;
  return clamp(Math.max(game.global.globalExposure * 0.997, computedExposure), 0, 100);
}

export function calcAiAllianceLevel(game: GameState): 0 | 1 | 2 | 3 {
  const highDetectionCount = regionIds.filter((id) => game.regions[id].detection >= 55).length;
  if (game.global.globalDefense >= 75) return 3;
  if (game.global.globalExposure >= 60 || highDetectionCount >= 3) return 2;
  if (game.global.globalExposure >= 30) return 1;
  return 0;
}

export function calcGlobalDefenseGain(game: GameState, modifiers = getAbilityModifierTotals(game)): number {
  const contributingPower = regionIds.reduce((sum, regionId) => {
    const state = game.regions[regionId];
    if (state.detection < 30) return sum;
    const definition = regionById[regionId];
    const alertMultiplier = state.lockdown ? 1.25 : state.localAlert ? 1.1 : 1;
    return (
      sum +
      (definition.digitalInfra / 100) *
        (definition.cyberDefense / 100) *
        definition.aiSovereignty *
        alertMultiplier
    );
  }, 0);
  const allianceMultiplier = [0.3, 0.8, 1.2, 1.6][game.global.aiAllianceLevel] ?? 0.3;
  const modelMultiplier = Math.max(0.65, 1 - game.stats.modelPoisoning * 0.12);
  const weeklyGain =
    contributingPower *
    allianceMultiplier *
    modelMultiplier *
    modifiers.defenseResearchMultiplier *
    modifiers.globalDefenseRateMultiplier *
    Math.max(0.35, 1 - game.stats.evasion * 0.03);
  return clamp(weeklyGain * DAY_SCALE, 0, 2.4);
}
