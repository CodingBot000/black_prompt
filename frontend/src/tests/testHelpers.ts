import { createInitialGame } from "../engine/createInitialGame";
import type { GameState, RegionId } from "../engine/types";

export function makeGame(startRegionId: RegionId = "gs_mobilecloud"): GameState {
  return createInitialGame({
    seed: 12345,
    startRegionId,
    baseDate: new Date("2026-05-07T00:00:00.000Z"),
  });
}

export function cloneGame(game: GameState): GameState {
  return structuredClone(game) as GameState;
}
