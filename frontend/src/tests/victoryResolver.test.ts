import { describe, expect, it } from "vitest";
import { regionIds } from "../data/regions";
import { checkEnding } from "../engine/victoryResolver";
import { cloneGame, makeGame } from "./testHelpers";

describe("checkEnding", () => {
  it("returns global_defense_loss when global defense reaches 100", () => {
    const game = makeGame();
    game.global.globalDefense = 100;
    expect(checkEnding(game)?.id).toBe("global_defense_loss");
  });

  it("returns eradication_loss after 21 eradication days", () => {
    const game = makeGame();
    game.global.eradicationDays = 21;
    expect(checkEnding(game)?.id).toBe("eradication_loss");
  });

  it("returns domination_victory when control conditions are met", () => {
    const game = cloneGame(makeGame());
    for (const regionId of regionIds.slice(0, 5)) {
      game.regions[regionId].infiltration = 70;
      game.regions[regionId].influence = 65;
    }
    game.global.worldStability = 70;
    game.global.legitimacy = 50;
    expect(checkEnding(game)?.id).toBe("domination_victory");
  });

  it("returns collapse_victory when stability collapses with disruption power", () => {
    const game = cloneGame(makeGame());
    for (const regionId of regionIds.slice(0, 4)) {
      game.regions[regionId].influence = 55;
    }
    game.global.worldStability = 20;
    game.stats.disruptionPower = 0.8;
    expect(checkEnding(game)?.id).toBe("collapse_victory");
  });

  it("returns subsumption_victory when model poisoning and defended infiltration conditions are met", () => {
    const game = cloneGame(makeGame());
    game.stats.modelPoisoning = 0.9;
    for (const regionId of regionIds.slice(0, 5)) {
      game.regions[regionId].infiltration = 50;
    }
    for (const regionId of regionIds.slice(0, 3)) {
      game.regions[regionId].defense = 60;
      game.regions[regionId].infiltration = 50;
    }
    expect(checkEnding(game)?.id).toBe("subsumption_victory");
  });

  it("returns shadow_victory when exposure is low and stealth is high", () => {
    const game = cloneGame(makeGame());
    for (const regionId of regionIds.slice(0, 6)) {
      game.regions[regionId].infiltration = 45;
    }
    game.global.globalExposure = 25;
    game.global.globalDefense = 30;
    game.stats.stealth = 2.7;
    game.calendar.dayIndex = 180;
    expect(checkEnding(game)?.id).toBe("shadow_victory");
  });
});
