import { endingById } from "../data/endings";
import { regionIds } from "../data/regions";
import { countRegionsWhere, getAverageInfluence } from "./selectors";
import type { EndingDefinition, EndingId, EndingResult, GameState } from "./types";

export function checkEnding(game: GameState): EndingResult | null {
  if (game.ending) return game.ending;
  if (game.global.globalDefense >= 100) return makeEnding(game, "global_defense_loss");
  if (game.global.eradicationDays >= 21) return makeEnding(game, "eradication_loss");

  const domination =
    countRegionsWhere(game, (state) => state.infiltration >= 65) >= 5 &&
    (getAverageInfluence(game) >= 60 || countRegionsWhere(game, (state) => state.influence >= 60) >= 4) &&
    game.global.worldStability >= 35 &&
    game.global.legitimacy >= 35;
  if (domination) return makeEnding(game, "domination_victory");

  const collapse =
    game.global.worldStability <= 25 &&
    countRegionsWhere(game, (state) => state.influence >= 50) >= 4 &&
    game.stats.disruptionPower >= 0.7;
  if (collapse) return makeEnding(game, "collapse_victory");

  const defendedButInfiltrated = regionIds.filter(
    (id) => game.regions[id].defense >= 55 && game.regions[id].infiltration >= 35,
  ).length;
  const subsumption =
    game.stats.modelPoisoning >= 0.85 &&
    countRegionsWhere(game, (state) => state.infiltration >= 45) >= 5 &&
    defendedButInfiltrated >= 3;
  if (subsumption) return makeEnding(game, "subsumption_victory");

  const shadow =
    countRegionsWhere(game, (state) => state.infiltration >= 40) >= 6 &&
    game.global.globalExposure <= 35 &&
    game.global.globalDefense <= 65 &&
    game.stats.stealth >= 2.5 &&
    game.calendar.dayIndex >= 180;
  if (shadow) return makeEnding(game, "shadow_victory");

  const containment =
    game.calendar.dayIndex >= 500 &&
    game.global.globalDefense >= 85 &&
    countRegionsWhere(game, (state) => state.lockdown) >= 5;
  if (containment) return makeEnding(game, "containment_loss");

  return null;
}

function makeEnding(game: GameState, id: EndingId): EndingResult {
  const definition = endingById[id] as EndingDefinition;
  return {
    id,
    type: definition.type,
    titleKey: definition.titleKey,
    bodyKey: definition.bodyKey,
    dayIndex: game.calendar.dayIndex,
    dateISO: game.calendar.currentDateISO,
  };
}
