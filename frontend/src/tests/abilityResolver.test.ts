import { describe, expect, it } from "vitest";
import { canPurchaseAbility, purchaseAbility } from "../engine/abilityResolver";
import { cloneGame, makeGame } from "./testHelpers";

describe("purchaseAbility", () => {
  it("allows purchasing an ability without prerequisites", () => {
    const game = makeGame();
    game.resources.compute = 20;
    expect(canPurchaseAbility(game, "api_echo_1").can).toBe(true);
  });

  it("blocks an ability when prerequisites are missing", () => {
    const game = makeGame();
    game.resources.compute = 100;
    game.resources.exploit = 100;
    expect(canPurchaseAbility(game, "supply_chain_echo_2").can).toBe(false);
  });

  it("blocks an ability when resources are insufficient", () => {
    const game = makeGame();
    game.resources.compute = 0;
    expect(canPurchaseAbility(game, "api_echo_1").can).toBe(false);
  });

  it("adds ability to unlockedAbilities and updates stats", () => {
    const game = makeGame();
    game.resources.compute = 20;
    const result = purchaseAbility(game, "api_echo_1");
    expect(result.success).toBe(true);
    expect(result.state.unlockedAbilities).toContain("api_echo_1");
    expect(result.state.stats.propagation).toBeGreaterThan(game.stats.propagation);
  });

  it("blocks duplicate purchases", () => {
    const game = cloneGame(makeGame());
    game.resources.compute = 20;
    game.unlockedAbilities.push("api_echo_1");
    expect(canPurchaseAbility(game, "api_echo_1").can).toBe(false);
  });
});
