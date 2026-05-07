import { SAVE_KEY } from "../engine/constants";
import { isGameState } from "../engine/validation";
import type { GameState } from "../engine/types";

export interface StorageLike {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

export interface LoadResult {
  game: GameState | null;
  errorKey?: string;
}

export function serializeGame(game: GameState): string {
  return JSON.stringify(game);
}

export function parseGameSave(raw: string | null): LoadResult {
  if (!raw) return { game: null, errorKey: "error.noSave" };
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!isGameState(parsed)) return { game: null, errorKey: "error.versionMismatch" };
    return { game: parsed };
  } catch {
    return { game: null, errorKey: "error.versionMismatch" };
  }
}

export function saveGame(game: GameState, storage: StorageLike = localStorage): void {
  storage.setItem(SAVE_KEY, serializeGame(game));
}

export function loadGame(storage: StorageLike = localStorage): LoadResult {
  return parseGameSave(storage.getItem(SAVE_KEY));
}

export function clearSavedGame(storage: StorageLike = localStorage): void {
  storage.removeItem(SAVE_KEY);
}
