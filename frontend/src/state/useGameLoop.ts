import { useEffect } from "react";
import { FAST_DAY_DURATION_MS, NORMAL_DAY_DURATION_MS } from "../engine/constants";
import type { GameAction } from "../engine/gameReducer";
import type { GameState, UiState } from "../engine/types";

export function useGameLoop(game: GameState, ui: UiState, dispatch: React.Dispatch<GameAction>): void {
  useEffect(() => {
    if (!ui.isRunning) return;
    if (ui.activeModal !== null) return;
    if (game.ending) return;

    const delay = ui.speed === 2 ? FAST_DAY_DURATION_MS : NORMAL_DAY_DURATION_MS;
    const id = window.setInterval(() => dispatch({ type: "TICK_DAY" }), delay);
    return () => window.clearInterval(id);
  }, [dispatch, game.ending, ui.activeModal, ui.isRunning, ui.speed]);
}
