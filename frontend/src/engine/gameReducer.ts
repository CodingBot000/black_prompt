import { resolveOperation } from "./actionResolver";
import { purchaseAbility } from "./abilityResolver";
import { createInitialGame } from "./createInitialGame";
import { resolveEventChoice } from "./eventResolver";
import { advanceOneDay } from "./tick";
import type { GameState, RegionId } from "./types";

export type GameAction =
  | { type: "START_NEW_GAME"; payload: { startRegionId: RegionId; seed?: number; baseDate?: string } }
  | { type: "TICK_DAY" }
  | { type: "RUN_OPERATION"; payload: { operationId: string; targetRegionId: RegionId } }
  | { type: "PURCHASE_ABILITY"; payload: { abilityId: string } }
  | { type: "RESOLVE_EVENT_CHOICE"; payload: { eventId: string; choiceId: string } }
  | { type: "LOAD_GAME"; payload: GameState };

export function gameReducer(game: GameState, action: GameAction): GameState {
  switch (action.type) {
    case "START_NEW_GAME":
      return createInitialGame({
        startRegionId: action.payload.startRegionId,
        seed: action.payload.seed,
        baseDate: action.payload.baseDate,
      });
    case "TICK_DAY":
      return advanceOneDay(game);
    case "RUN_OPERATION":
      return resolveOperation(game, action.payload.operationId, action.payload.targetRegionId).state;
    case "PURCHASE_ABILITY":
      return purchaseAbility(game, action.payload.abilityId).state;
    case "RESOLVE_EVENT_CHOICE":
      return resolveEventChoice(game, action.payload.eventId, action.payload.choiceId).state;
    case "LOAD_GAME":
      return action.payload;
  }
}
