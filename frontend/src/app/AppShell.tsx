import { useEffect } from "react";
import { appConfig } from "./appConfig";
import { Modal } from "../components/common/Modal";
import { BottomCommandBar } from "../components/layout/BottomCommandBar";
import { DesktopSidePanel } from "../components/layout/DesktopSidePanel";
import { MobileRegionSheet } from "../components/layout/MobileRegionSheet";
import { RotateDeviceOverlay } from "../components/layout/RotateDeviceOverlay";
import { TopStatusBar } from "../components/layout/TopStatusBar";
import { EndingModal } from "../components/modals/EndingModal";
import { EventChoiceModal } from "../components/modals/EventChoiceModal";
import { GlobalStatusModal } from "../components/modals/GlobalStatusModal";
import { HelpModal } from "../components/modals/HelpModal";
import { NewGameModal } from "../components/modals/NewGameModal";
import { SkillTreeModal } from "../components/modals/SkillTreeModal";
import { WorldMapPanel } from "../components/map/WorldMapPanel";
import { EventLogPanel } from "../components/panels/EventLogPanel";
import { regionById, regions } from "../data/regions";
import type { RegionId } from "../engine/types";
import { t } from "../locales/i18n";
import { useGameController } from "../state/useGameController";
import { useGameLoop } from "../state/useGameLoop";

declare global {
  interface Window {
    render_game_to_text?: () => string;
    advanceTime?: (ms: number) => void;
  }
}

export function AppShell() {
  const controller = useGameController();
  const { game, ui, dispatch } = controller;
  const locale = ui.locale;
  const selectedRegionId = ui.selectedRegionId;

  useGameLoop(game, ui, dispatch);

  useEffect(() => {
    window.render_game_to_text = () => {
      const visibleRegions = regions.map((region) => {
        const state = game.regions[region.id];
        return {
          id: region.id,
          name: t(region.nameKey, {}, locale),
          xPercent: region.mapPosition.x,
          yPercent: region.mapPosition.y,
          infiltration: Number(state.infiltration.toFixed(1)),
          detection: Number(state.detection.toFixed(1)),
          defense: Number(state.defense.toFixed(1)),
          influence: Number(state.influence.toFixed(1)),
          lockdown: state.lockdown,
        };
      });
      return JSON.stringify({
        coordinateSystem: "map origin top-left, x/y in percent, y increases downward",
        mode: game.ending ? "ended" : ui.isRunning ? "running" : "paused",
        activeModal: ui.activeModal,
        dateISO: game.calendar.currentDateISO,
        dayIndex: game.calendar.dayIndex,
        speed: ui.speed,
        selectedRegionId,
        selectedRegionName: selectedRegionId ? t(regionById[selectedRegionId].nameKey, {}, locale) : null,
        resources: game.resources,
        global: game.global,
        pendingEventChoice: game.pendingEventChoice,
        ending: game.ending,
        regions: visibleRegions,
      });
    };
    window.advanceTime = (ms: number) => {
      const steps = Math.max(1, Math.round(ms / (1000 / 60)));
      for (let index = 0; index < steps; index += 1) {
        dispatch({ type: "TICK_DAY" });
      }
    };
    return () => {
      delete window.render_game_to_text;
      delete window.advanceTime;
    };
  }, [dispatch, game, locale, selectedRegionId, ui.activeModal, ui.isRunning, ui.speed]);

  const handleSelectRegion = (regionId: RegionId) => {
    controller.setSelectedRegion(regionId);
    if (window.matchMedia(appConfig.mobileLandscapeQuery).matches) {
      controller.openModal("regionDetail");
    }
  };

  const handleRunOperation = (operationId: string, regionId: RegionId) => {
    dispatch({ type: "RUN_OPERATION", payload: { operationId, targetRegionId: regionId } });
  };

  return (
    <div className="app-shell">
      <TopStatusBar
        game={game}
        ui={ui}
        locale={locale}
        onToggleRunning={controller.toggleRunning}
        onToggleSpeed={controller.toggleSpeed}
      />
      <main className="game-main">
        <WorldMapPanel game={game} selectedRegionId={selectedRegionId} locale={locale} onSelectRegion={handleSelectRegion} />
        <DesktopSidePanel game={game} selectedRegionId={selectedRegionId} locale={locale} />
      </main>
      <BottomCommandBar
        game={game}
        selectedRegionId={selectedRegionId}
        locale={locale}
        onRunOperation={handleRunOperation}
        onOpenSkillTree={() => controller.openModal("skillTree")}
        onOpenGlobalStatus={() => controller.openModal("globalStatus")}
        onOpenEventLog={() => controller.openModal("eventLog")}
        onOpenHelp={() => controller.openModal("help")}
        onSave={controller.saveCurrentGame}
        onNewGame={() => controller.openModal("newGame")}
      />
      <RotateDeviceOverlay locale={locale} />

      {ui.activeModal === "newGame" ? (
        <NewGameModal
          locale={locale}
          initialRegionId={selectedRegionId ?? game.selectedStartRegionId}
          onStart={controller.startNewGame}
          onLoad={controller.loadSavedGame}
          onClose={controller.closeModal}
        />
      ) : null}
      {ui.activeModal === "skillTree" ? (
        <SkillTreeModal
          game={game}
          locale={locale}
          selectedBranch={ui.selectedSkillBranch}
          onSelectBranch={controller.setSkillBranch}
          onPurchase={(abilityId) => dispatch({ type: "PURCHASE_ABILITY", payload: { abilityId } })}
          onClose={controller.closeModal}
        />
      ) : null}
      {ui.activeModal === "regionDetail" ? (
        <MobileRegionSheet
          game={game}
          regionId={selectedRegionId}
          locale={locale}
          onClose={controller.closeModal}
          onRunOperation={handleRunOperation}
        />
      ) : null}
      {ui.activeModal === "globalStatus" ? <GlobalStatusModal game={game} locale={locale} onClose={controller.closeModal} /> : null}
      {ui.activeModal === "eventLog" ? (
        <Modal title={t("ui.eventLog", {}, locale)} closeLabel={t("ui.close", {}, locale)} onClose={controller.closeModal} wide>
          <EventLogPanel logs={game.eventLog} locale={locale} />
        </Modal>
      ) : null}
      {ui.activeModal === "help" ? <HelpModal locale={locale} onClose={controller.closeModal} /> : null}
      {ui.activeModal === "eventChoice" ? (
        <EventChoiceModal
          game={game}
          locale={locale}
          onResolve={controller.resolveEventChoiceAndResume}
        />
      ) : null}
      {ui.activeModal === "ending" ? <EndingModal game={game} locale={locale} onNewGame={() => controller.openModal("newGame")} /> : null}
    </div>
  );
}
