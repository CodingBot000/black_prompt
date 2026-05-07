import { regionById, regionIds } from "../data/regions";
import { clamp } from "./clamp";
import { createStartDate } from "./date";
import { appendKeyedLog } from "./log";
import { normalizeSeed } from "./rng";
import type { GameState, RegionId, RegionRuntimeState } from "./types";

export interface CreateInitialGameOptions {
  seed?: number;
  startRegionId?: RegionId;
  baseDate?: Date | string;
}

export function createInitialGame(options: CreateInitialGameOptions = {}): GameState {
  const seed = normalizeSeed(options.seed ?? Date.now());
  const selectedStartRegionId = options.startRegionId ?? "gs_mobilecloud";
  const baseDate = typeof options.baseDate === "string" ? new Date(options.baseDate) : (options.baseDate ?? new Date());
  const startDateISO = createStartDate(baseDate);
  const regions = Object.fromEntries(
    regionIds.map((regionId) => [regionId, createRegionRuntimeState(regionId, regionId === selectedStartRegionId)]),
  ) as GameState["regions"];

  const game: GameState = {
    version: 1,
    seed,
    rngState: seed,
    calendar: {
      startDateISO,
      currentDateISO: startDateISO,
      dayIndex: 0,
    },
    selectedStartRegionId,
    resources: {
      compute: 12,
      exploit: 4,
      influencePoint: 0,
    },
    stats: {
      propagation: 1,
      stealth: 1,
      evasion: 1,
      impact: 0,
      modelPoisoning: 0,
      falseAttribution: 0,
      disruptionPower: 0,
    },
    global: {
      globalExposure: 0,
      globalDefense: 0,
      worldStability: 100,
      aiAllianceLevel: 0,
      legitimacy: 50,
      eradicationDays: 0,
    },
    regions,
    unlockedAbilities: [],
    disabledModules: [],
    activeGlobalEffects: [],
    eventCooldowns: {},
    eventLog: [],
    pendingEventChoice: null,
    ending: null,
  };

  return appendKeyedLog(
    game,
    "log.game_started.title",
    "log.game_started.body",
    "success",
    { regionName: regionById[selectedStartRegionId].nameKey },
  );
}

function createRegionRuntimeState(regionId: RegionId, isStart: boolean): RegionRuntimeState {
  const definition = regionById[regionId];
  return {
    infiltration: isStart ? 3 : 0,
    detection: 0,
    defense: clamp(definition.cyberDefense * (isStart ? 0.15 : 0.1), isStart ? 5 : 3, 100),
    influence: 0,
    stability: definition.baseStability,
    localAlert: false,
    lockdown: false,
    purgedLastDay: 0,
    activeEffects: isStart ? [{ id: "initial_seed", remainingDays: 14, sourceId: "new_game" }] : [],
  };
}
