import { useCallback, useEffect, useReducer, useState } from "react";
import { createInitialGame } from "../engine/createInitialGame";
import { gameReducer, type GameAction } from "../engine/gameReducer";
import type { AbilityBranch, GameState, RegionId, UiState } from "../engine/types";
import { loadGame, saveGame } from "./persistence";

export interface GameController {
  game: GameState;
  ui: UiState;
  dispatch: React.Dispatch<GameAction>;
  setSelectedRegion: (regionId: RegionId | null) => void;
  setSkillBranch: (branch: AbilityBranch) => void;
  openModal: (modal: NonNullable<UiState["activeModal"]>) => void;
  closeModal: () => void;
  toggleRunning: () => void;
  toggleSpeed: () => void;
  startNewGame: (regionId: RegionId) => void;
  loadSavedGame: () => string | null;
  saveCurrentGame: () => void;
}

export function useGameController(): GameController {
  const [game, dispatch] = useReducer(gameReducer, undefined, () => createInitialGame({ baseDate: new Date() }));
  const [ui, setUi] = useState<UiState>({
    selectedRegionId: "gs_mobilecloud",
    activeModal: "newGame",
    selectedSkillBranch: "propagation",
    isRunning: false,
    speed: 1,
    locale: "ko",
  });

  useEffect(() => {
    saveGame(game);
  }, [game]);

  useEffect(() => {
    if (!game.pendingEventChoice && !game.ending) return;
    const id = window.setTimeout(() => {
      setUi((current) => ({
        ...current,
        activeModal: game.ending ? "ending" : "eventChoice",
        isRunning: false,
      }));
    }, 0);
    return () => window.clearTimeout(id);
  }, [game.pendingEventChoice, game.ending]);

  const setSelectedRegion = useCallback((regionId: RegionId | null) => {
    setUi((current) => ({ ...current, selectedRegionId: regionId }));
  }, []);

  const setSkillBranch = useCallback((branch: AbilityBranch) => {
    setUi((current) => ({ ...current, selectedSkillBranch: branch }));
  }, []);

  const openModal = useCallback((modal: NonNullable<UiState["activeModal"]>) => {
    setUi((current) => ({ ...current, activeModal: modal, isRunning: false }));
  }, []);

  const closeModal = useCallback(() => {
    setUi((current) => ({ ...current, activeModal: null }));
  }, []);

  const toggleRunning = useCallback(() => {
    setUi((current) => ({ ...current, isRunning: !current.isRunning, activeModal: current.activeModal }));
  }, []);

  const toggleSpeed = useCallback(() => {
    setUi((current) => ({ ...current, speed: current.speed === 1 ? 2 : 1 }));
  }, []);

  const startNewGame = useCallback((regionId: RegionId) => {
    dispatch({ type: "START_NEW_GAME", payload: { startRegionId: regionId, baseDate: new Date().toISOString() } });
    setUi((current) => ({
      ...current,
      selectedRegionId: regionId,
      activeModal: null,
      isRunning: true,
    }));
  }, []);

  const loadSavedGame = useCallback(() => {
    const result = loadGame();
    if (!result.game) return result.errorKey ?? "error.noSave";
    dispatch({ type: "LOAD_GAME", payload: result.game });
    setUi((current) => ({
      ...current,
      selectedRegionId: result.game?.selectedStartRegionId ?? "gs_mobilecloud",
      activeModal: null,
      isRunning: false,
    }));
    return null;
  }, []);

  const saveCurrentGame = useCallback(() => {
    saveGame(game);
  }, [game]);

  return {
    game,
    ui,
    dispatch,
    setSelectedRegion,
    setSkillBranch,
    openModal,
    closeModal,
    toggleRunning,
    toggleSpeed,
    startNewGame,
    loadSavedGame,
    saveCurrentGame,
  };
}
