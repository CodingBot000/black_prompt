import { events, eventById } from "../data/events";
import { regionById, regionIds } from "../data/regions";
import { DAILY_EVENT_CHANCE } from "./constants";
import { applyGameEffects } from "./effects";
import { appendKeyedLog } from "./log";
import { randomFloat, randomInt } from "./rng";
import { hasResources } from "./selectors";
import { cloneGameState } from "./validation";
import type { EventChoiceDefinition, GameEventDefinition, GameState, RegionId, ResolverResult } from "./types";

export function resolveDailyEvent(game: GameState): GameState {
  let next = cloneGameState(game);
  if (next.pendingEventChoice) return next;

  const chanceRoll = randomFloat(next.rngState);
  next.rngState = chanceRoll.nextState;
  if (chanceRoll.value > DAILY_EVENT_CHANCE) return next;

  const eligible = events.filter((event) => eventCooldownReady(next, event) && conditionsMet(next, event));
  if (eligible.length === 0) return next;

  const totalWeight = eligible.reduce((sum, event) => sum + event.weight, 0);
  const pickRoll = randomFloat(next.rngState);
  next.rngState = pickRoll.nextState;
  let cursor = pickRoll.value * totalWeight;
  const picked = eligible.find((event) => {
    cursor -= event.weight;
    return cursor <= 0;
  }) ?? eligible[eligible.length - 1];
  const targetResult = pickTargetRegion(next, picked);
  next.rngState = targetResult.rngState;
  next.eventCooldowns[picked.id] = picked.cooldownDays;

  if (picked.choices?.length) {
    next.pendingEventChoice = {
      eventId: picked.id,
      targetRegionId: targetResult.targetRegionId,
      choiceIds: picked.choices.map((choice) => choice.id),
    };
    return appendKeyedLog(next, "log.event.title", "log.event.body", "warning", { eventTitle: picked.titleKey }, picked.id);
  }

  if (picked.effects?.length) {
    next = applyGameEffects(next, picked.effects, targetResult.targetRegionId);
  }
  return appendKeyedLog(next, "log.event.title", "log.event.body", "info", { eventTitle: picked.titleKey }, picked.id);
}

export function resolveEventChoice(game: GameState, eventId: string, choiceId: string): ResolverResult {
  if (!game.pendingEventChoice || game.pendingEventChoice.eventId !== eventId) {
    return { state: game, success: false, reasonKey: "error.choiceRequirement" };
  }
  const event = eventById[eventId] as GameEventDefinition | undefined;
  const choice = event?.choices?.find((candidate) => candidate.id === choiceId);
  if (!event || !choice) return { state: game, success: false, reasonKey: "error.choiceRequirement" };
  if (!choiceEnabled(game, choice)) return { state: game, success: false, reasonKey: "error.choiceRequirement" };

  let next = applyGameEffects(game, choice.effects, game.pendingEventChoice.targetRegionId);
  next.pendingEventChoice = null;
  next = appendKeyedLog(next, "log.event_choice.title", "log.event_choice.body", "success", {
    choiceLabel: choice.labelKey,
    eventTitle: event.titleKey,
  }, event.id);
  return { state: next, success: true };
}

export function choiceEnabled(game: GameState, choice: EventChoiceDefinition): boolean {
  if (choice.requires?.abilityId && !game.unlockedAbilities.includes(choice.requires.abilityId)) return false;
  if (choice.requires?.resources && !hasResources(game.resources, choice.requires.resources)) return false;
  return true;
}

function eventCooldownReady(game: GameState, event: GameEventDefinition): boolean {
  return (game.eventCooldowns[event.id] ?? 0) <= 0;
}

function conditionsMet(game: GameState, event: GameEventDefinition): boolean {
  const conditions = event.conditions;
  if (conditions.minDayIndex !== undefined && game.calendar.dayIndex < conditions.minDayIndex) return false;
  if (conditions.minGlobalExposure !== undefined && game.global.globalExposure < conditions.minGlobalExposure) return false;
  if (conditions.minAiAllianceLevel !== undefined && game.global.aiAllianceLevel < conditions.minAiAllianceLevel) return false;
  if (conditions.maxExploit !== undefined && game.resources.exploit > conditions.maxExploit) return false;
  if (conditions.minStat) {
    for (const [key, value] of Object.entries(conditions.minStat)) {
      if (game.stats[key as keyof typeof game.stats] < (value ?? 0)) return false;
    }
  }
  if (conditions.targetRegionId) {
    const state = game.regions[conditions.targetRegionId];
    if (conditions.minTargetInfiltration !== undefined && state.infiltration < conditions.minTargetInfiltration) return false;
    if (conditions.minTargetDetection !== undefined && state.detection < conditions.minTargetDetection) return false;
  }
  const candidates = targetCandidates(game, event);
  return candidates.length > 0;
}

function targetCandidates(game: GameState, event: GameEventDefinition): RegionId[] {
  return regionIds.filter((regionId) => {
    const definition = regionById[regionId];
    const state = game.regions[regionId];
    if (event.conditions.regionTag && !definition.tags.includes(event.conditions.regionTag)) return false;
    if (event.conditions.minTargetInfiltration !== undefined && state.infiltration < event.conditions.minTargetInfiltration) return false;
    if (event.conditions.minTargetDetection !== undefined && state.detection < event.conditions.minTargetDetection) return false;
    if (
      event.conditions.minPoliticalFragmentation !== undefined &&
      definition.politicalFragmentation < event.conditions.minPoliticalFragmentation
    ) return false;
    return true;
  });
}

function pickTargetRegion(game: GameState, event: GameEventDefinition): { targetRegionId?: RegionId; rngState: number } {
  if (event.target === "none") return { rngState: game.rngState };
  const candidates = targetCandidates(game, event);
  if (candidates.length === 0) return { rngState: game.rngState };
  if (event.target === "highest_detection") {
    return {
      targetRegionId: [...candidates].sort((a, b) => game.regions[b].detection - game.regions[a].detection)[0],
      rngState: game.rngState,
    };
  }
  if (event.target === "highest_infiltration") {
    return {
      targetRegionId: [...candidates].sort((a, b) => game.regions[b].infiltration - game.regions[a].infiltration)[0],
      rngState: game.rngState,
    };
  }
  const roll = randomInt(game.rngState, 0, candidates.length - 1);
  return { targetRegionId: candidates[roll.value], rngState: roll.nextState };
}
