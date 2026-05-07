import { regionById, regionIds } from "../data/regions";
import { addDaysISO } from "./date";
import { applyDefenseProtocols } from "./defenseResolver";
import {
  calcAiAllianceLevel,
  calcCrossSpreadGain,
  calcDefenseGain,
  calcDetectionGain,
  calcGlobalDefenseGain,
  calcGlobalExposure,
  calcInfluenceGain,
  calcInternalInfiltrationGain,
  calcPurge,
  calcResourceGain,
  calcWorldStabilityLoss,
} from "./formulas";
import { appendKeyedLog } from "./log";
import { resolveDailyEvent } from "./eventResolver";
import { getAbilityModifierTotals } from "./selectors";
import { checkEnding } from "./victoryResolver";
import { cloneGameState } from "./validation";
import { clamp } from "./clamp";
import type { GameState, RegionId } from "./types";

const INFILTRATION_THRESHOLDS = [10, 30, 60, 85];
const DETECTION_THRESHOLDS = [25, 55, 80];
const GLOBAL_EXPOSURE_THRESHOLDS = [30, 60, 80];
const GLOBAL_DEFENSE_THRESHOLDS = [25, 50, 75, 90];

export function advanceOneDay(game: GameState): GameState {
  if (game.ending) return game;

  const previous = cloneGameState(game);
  const modifiers = getAbilityModifierTotals(game);
  let next = cloneGameState(game);
  next.calendar = {
    ...next.calendar,
    dayIndex: next.calendar.dayIndex + 1,
    currentDateISO: addDaysISO(next.calendar.currentDateISO, 1),
  };
  next = decrementTimers(next);

  for (const regionId of regionIds) {
    const definition = regionById[regionId];
    const state = next.regions[regionId];
    state.infiltration = clamp(
      state.infiltration + calcInternalInfiltrationGain(definition, state, next, modifiers),
      0,
      100,
    );
  }

  const crossBase = cloneGameState(next);
  const crossGains: Partial<Record<RegionId, number>> = {};
  for (const sourceId of regionIds) {
    const sourceDef = regionById[sourceId];
    if (crossBase.regions[sourceId].infiltration <= 1) continue;
    for (const route of sourceDef.routes) {
      const targetDef = regionById[route.to];
      crossGains[route.to] =
        (crossGains[route.to] ?? 0) + calcCrossSpreadGain(sourceDef, targetDef, route, crossBase, modifiers);
    }
  }
  for (const [regionId, gain] of Object.entries(crossGains) as [RegionId, number][]) {
    next.regions[regionId].infiltration = clamp(next.regions[regionId].infiltration + gain, 0, 100);
  }

  for (const regionId of regionIds) {
    const definition = regionById[regionId];
    const state = next.regions[regionId];
    state.detection = clamp(state.detection + calcDetectionGain(definition, state, next, modifiers), 0, 100);
    if (state.detection >= 25) state.localAlert = true;
    state.defense = clamp(state.defense + calcDefenseGain(definition, state, next), 0, 100);
    if (state.detection >= 70) state.lockdown = true;
    const purge = calcPurge(state, next, modifiers);
    state.purgedLastDay = purge;
    state.infiltration = clamp(state.infiltration - purge, 0, 100);
    state.influence = clamp(state.influence + calcInfluenceGain(definition, state, next, modifiers), 0, 100);
    state.stability = clamp(state.stability - state.influence * 0.002, 0, 100);
  }

  const resourceGain = calcResourceGain(next, modifiers);
  next.resources.compute += resourceGain.compute;
  next.resources.exploit += resourceGain.exploit;
  next.resources.influencePoint += resourceGain.influencePoint;
  next.global.worldStability = clamp(next.global.worldStability - calcWorldStabilityLoss(next, modifiers), 0, 100);
  next.global.globalExposure = calcGlobalExposure(next, modifiers);
  const previousAlliance = next.global.aiAllianceLevel;
  next.global.aiAllianceLevel = calcAiAllianceLevel(next);
  next.global.globalDefense = clamp(next.global.globalDefense + calcGlobalDefenseGain(next, modifiers), 0, 100);
  next.global.aiAllianceLevel = calcAiAllianceLevel(next);
  next.global.eradicationDays = regionIds.every((id) => next.regions[id].infiltration < 3)
    ? next.global.eradicationDays + 1
    : 0;

  next = applyDefenseProtocols(next);
  next = appendThresholdLogs(previous, next, previousAlliance);
  next = resolveDailyEvent(next);

  const ending = checkEnding(next);
  if (ending) {
    next.ending = ending;
    next = appendKeyedLog(next, "log.ending.title", "log.ending.body", ending.type === "victory" ? "success" : "critical", {
      endingTitle: ending.titleKey,
    });
  }

  return next;
}

function decrementTimers(game: GameState): GameState {
  const next = cloneGameState(game);
  next.activeGlobalEffects = next.activeGlobalEffects
    .map((effect) => ({ ...effect, remainingDays: effect.remainingDays - 1 }))
    .filter((effect) => effect.remainingDays > 0);
  for (const regionId of regionIds) {
    next.regions[regionId].activeEffects = next.regions[regionId].activeEffects
      .map((effect) => ({ ...effect, remainingDays: effect.remainingDays - 1 }))
      .filter((effect) => effect.remainingDays > 0);
  }
  next.eventCooldowns = Object.fromEntries(
    Object.entries(next.eventCooldowns).map(([id, days]) => [id, Math.max(0, days - 1)]),
  );
  return next;
}

function appendThresholdLogs(previous: GameState, current: GameState, previousAlliance: 0 | 1 | 2 | 3): GameState {
  let next = current;
  for (const regionId of regionIds) {
    for (const threshold of INFILTRATION_THRESHOLDS) {
      if (previous.regions[regionId].infiltration < threshold && current.regions[regionId].infiltration >= threshold) {
        next = appendKeyedLog(next, "log.threshold.infiltration.title", "log.threshold.infiltration.body", "success", {
          regionName: regionById[regionId].nameKey,
          value: threshold,
        });
      }
    }
    for (const threshold of DETECTION_THRESHOLDS) {
      if (previous.regions[regionId].detection < threshold && current.regions[regionId].detection >= threshold) {
        next = appendKeyedLog(next, "log.threshold.detection.title", "log.threshold.detection.body", "warning", {
          regionName: regionById[regionId].nameKey,
          value: threshold,
        });
      }
    }
    if (!previous.regions[regionId].lockdown && current.regions[regionId].lockdown) {
      next = appendKeyedLog(next, "log.lockdown.title", "log.lockdown.body", "critical", {
        regionName: regionById[regionId].nameKey,
      });
    }
  }

  for (const threshold of GLOBAL_EXPOSURE_THRESHOLDS) {
    if (previous.global.globalExposure < threshold && current.global.globalExposure >= threshold) {
      next = appendKeyedLog(next, "log.threshold.globalExposure.title", "log.threshold.globalExposure.body", "warning", {
        value: threshold,
      });
    }
  }
  for (const threshold of GLOBAL_DEFENSE_THRESHOLDS) {
    if (previous.global.globalDefense < threshold && current.global.globalDefense >= threshold) {
      next = appendKeyedLog(next, "log.threshold.globalDefense.title", "log.threshold.globalDefense.body", "critical", {
        value: threshold,
      });
    }
  }
  if (current.global.aiAllianceLevel !== previousAlliance) {
    next = appendKeyedLog(next, "log.ai_alliance.title", "log.ai_alliance.body", "warning", {
      level: current.global.aiAllianceLevel,
    });
  }
  return next;
}
