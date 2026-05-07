import type { GameState } from "./types";

export function cloneGameState(game: GameState): GameState {
  return structuredClone(game) as GameState;
}

export function isGameState(value: unknown): value is GameState {
  if (typeof value !== "object" || value === null) return false;
  const candidate = value as Partial<GameState>;
  return (
    candidate.version === 1 &&
    typeof candidate.seed === "number" &&
    typeof candidate.rngState === "number" &&
    typeof candidate.calendar === "object" &&
    typeof candidate.resources === "object" &&
    typeof candidate.stats === "object" &&
    typeof candidate.global === "object" &&
    typeof candidate.regions === "object" &&
    Array.isArray(candidate.unlockedAbilities) &&
    Array.isArray(candidate.eventLog)
  );
}
