import { describe, expect, it } from "vitest";
import { advanceOneDay } from "../engine/tick";
import type { EndingResult } from "../engine/types";
import { cloneGame, makeGame } from "./testHelpers";

describe("advanceOneDay", () => {
  it("increments dayIndex and currentDateISO", () => {
    const game = makeGame();
    const next = advanceOneDay(game);
    expect(next.calendar.dayIndex).toBe(1);
    expect(next.calendar.currentDateISO).toBe("2029-01-02");
  });

  it("grows starting region infiltration over time", () => {
    const game = makeGame("gs_mobilecloud");
    const next = advanceOneDay(game);
    expect(next.regions.gs_mobilecloud.infiltration).toBeGreaterThan(game.regions.gs_mobilecloud.infiltration);
  });

  it("increases defense when detection is already accumulated", () => {
    const game = cloneGame(makeGame("na_cloud"));
    game.regions.na_cloud.detection = 35;
    const before = game.regions.na_cloud.defense;
    const next = advanceOneDay(game);
    expect(next.regions.na_cloud.defense).toBeGreaterThan(before);
  });

  it("increases resources over time", () => {
    const game = makeGame("gs_mobilecloud");
    const next = advanceOneDay(game);
    expect(next.resources.compute).toBeGreaterThan(game.resources.compute);
    expect(next.resources.exploit).toBeGreaterThan(game.resources.exploit);
  });

  it("does not create a new event when a pending event choice exists", () => {
    const game = cloneGame(makeGame());
    game.pendingEventChoice = { eventId: "cloud_update_window", choiceIds: ["observe_only"], targetRegionId: "na_cloud" };
    const next = advanceOneDay(game);
    expect(next.pendingEventChoice?.eventId).toBe("cloud_update_window");
  });

  it("does not mutate state after ending exists", () => {
    const game = makeGame();
    const ending: EndingResult = {
      id: "global_defense_loss",
      type: "loss",
      titleKey: "ending.global_defense_loss.title",
      bodyKey: "ending.global_defense_loss.body",
      dayIndex: 0,
      dateISO: game.calendar.currentDateISO,
    };
    game.ending = ending;
    expect(advanceOneDay(game)).toBe(game);
  });
});
