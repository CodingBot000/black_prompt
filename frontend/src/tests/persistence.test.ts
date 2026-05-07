import { describe, expect, it } from "vitest";
import { SAVE_KEY } from "../engine/constants";
import { loadGame, saveGame, type StorageLike } from "../state/persistence";
import { makeGame } from "./testHelpers";

class MemoryStorage implements StorageLike {
  private values = new Map<string, string>();

  getItem(key: string): string | null {
    return this.values.get(key) ?? null;
  }

  setItem(key: string, value: string): void {
    this.values.set(key, value);
  }

  removeItem(key: string): void {
    this.values.delete(key);
  }
}

describe("persistence", () => {
  it("round-trips core game state through storage", () => {
    const storage = new MemoryStorage();
    const game = makeGame("na_cloud");
    game.resources.compute = 42;
    saveGame(game, storage);
    const loaded = loadGame(storage).game;
    expect(loaded?.selectedStartRegionId).toBe("na_cloud");
    expect(loaded?.resources.compute).toBe(42);
    expect(loaded?.calendar.currentDateISO).toBe(game.calendar.currentDateISO);
  });

  it("does not include localized Korean sentences in save data", () => {
    const storage = new MemoryStorage();
    saveGame(makeGame("na_cloud"), storage);
    const raw = storage.getItem(SAVE_KEY) ?? "";
    expect(raw).not.toContain("북미 클라우드 블록");
    expect(raw).not.toContain("글로벌 방어 완성");
  });

  it("fails safely on version mismatch", () => {
    const storage = new MemoryStorage();
    storage.setItem(SAVE_KEY, JSON.stringify({ version: 999 }));
    const result = loadGame(storage);
    expect(result.game).toBeNull();
    expect(result.errorKey).toBe("error.versionMismatch");
  });
});
