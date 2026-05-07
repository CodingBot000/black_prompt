import { describe, expect, it } from "vitest";
import { regionById } from "../data/regions";
import {
  calcCrossSpreadGain,
  calcDetectionGain,
  calcInternalInfiltrationGain,
  calcPurge,
} from "../engine/formulas";
import { cloneGame, makeGame } from "./testHelpers";

describe("formulas", () => {
  it("reduces internal gain when regional defense is high", () => {
    const game = makeGame("gs_mobilecloud");
    const region = regionById.gs_mobilecloud;
    const lowDefense = { ...game.regions.gs_mobilecloud, defense: 5 };
    const highDefense = { ...game.regions.gs_mobilecloud, defense: 95 };

    expect(calcInternalInfiltrationGain(region, highDefense, game)).toBeLessThan(
      calcInternalInfiltrationGain(region, lowDefense, game),
    );
  });

  it("reduces cross spread when network openness is low", () => {
    const game = cloneGame(makeGame("gs_mobilecloud"));
    game.regions.gs_mobilecloud.infiltration = 55;
    const source = regionById.gs_mobilecloud;
    const route = source.routes.find((candidate) => candidate.to === "na_cloud");
    expect(route).toBeDefined();
    const openTarget = regionById.na_cloud;
    const closedTarget = { ...openTarget, networkOpenness: 0.1 };

    expect(calcCrossSpreadGain(source, closedTarget, route!, game)).toBeLessThan(
      calcCrossSpreadGain(source, openTarget, route!, game),
    );
  });

  it("reduces detection gain when stealth is high", () => {
    const game = makeGame("na_cloud");
    const region = regionById.na_cloud;
    const state = { ...game.regions.na_cloud, infiltration: 45, influence: 10 };
    const stealthy = cloneGame(game);
    stealthy.stats.stealth = 4;

    expect(calcDetectionGain(region, state, stealthy)).toBeLessThan(calcDetectionGain(region, state, game));
  });

  it("increases purge when detection and defense are both high", () => {
    const game = makeGame("na_cloud");
    const quiet = { ...game.regions.na_cloud, infiltration: 60, defense: 20, detection: 10 };
    const alerted = { ...game.regions.na_cloud, infiltration: 60, defense: 85, detection: 90 };

    expect(calcPurge(alerted, game)).toBeGreaterThan(calcPurge(quiet, game));
  });

  it("clamps daily formula outputs to expected ranges", () => {
    const game = cloneGame(makeGame("gs_mobilecloud"));
    game.stats.propagation = 20;
    game.stats.stealth = 0;
    const region = regionById.gs_mobilecloud;
    const state = { ...game.regions.gs_mobilecloud, infiltration: 1, defense: 0, detection: 100 };

    expect(calcInternalInfiltrationGain(region, state, game)).toBeLessThanOrEqual(1.2);
    expect(calcDetectionGain(region, state, game)).toBeLessThanOrEqual(1.8);
    expect(calcPurge({ ...state, defense: 100 }, game)).toBeLessThanOrEqual(2);
  });
});
