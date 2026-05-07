import { describe, expect, it } from "vitest";
import { resolveOperation } from "../engine/actionResolver";
import { cloneGame, makeGame } from "./testHelpers";

describe("resolveOperation", () => {
  it("deducts costs when an operation succeeds", () => {
    const game = makeGame("gs_mobilecloud");
    const next = resolveOperation(game, "quiet_probe", "gs_mobilecloud").state;
    expect(next.resources.compute).toBe(game.resources.compute - 3);
  });

  it("does not change state when resources are insufficient", () => {
    const game = cloneGame(makeGame());
    game.resources.compute = 0;
    const result = resolveOperation(game, "rapid_propagation", "gs_mobilecloud");
    expect(result.success).toBe(false);
    expect(result.state).toBe(game);
  });

  it("silent_injection increases target infiltration", () => {
    const game = makeGame("gs_mobilecloud");
    const next = resolveOperation(game, "silent_injection", "gs_mobilecloud").state;
    expect(next.regions.gs_mobilecloud.infiltration).toBeGreaterThan(game.regions.gs_mobilecloud.infiltration);
  });

  it("log_smearing lowers detection", () => {
    const game = cloneGame(makeGame("na_cloud"));
    game.resources.compute = 30;
    game.resources.exploit = 10;
    game.regions.na_cloud.detection = 30;
    const next = resolveOperation(game, "log_smearing", "na_cloud").state;
    expect(next.regions.na_cloud.detection).toBeLessThan(game.regions.na_cloud.detection);
  });

  it("false_flag is stronger when false_attribution_2 is unlocked", () => {
    const base = cloneGame(makeGame("na_cloud"));
    base.resources.compute = 50;
    base.resources.exploit = 20;
    base.resources.influencePoint = 10;
    base.global.globalDefense = 40;
    const normal = resolveOperation(base, "false_flag", "na_cloud").state;
    const upgradedBase = cloneGame(base);
    upgradedBase.unlockedAbilities.push("false_attribution_2");
    const upgraded = resolveOperation(upgradedBase, "false_flag", "na_cloud").state;

    expect(40 - upgraded.global.globalDefense).toBeGreaterThan(40 - normal.global.globalDefense);
  });
});
