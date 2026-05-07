import { regionById } from "../../data/regions";
import type { GameState, LocaleCode, RegionId } from "../../engine/types";
import { t } from "../../locales/i18n";
import { OperationPanel } from "../panels/OperationPanel";

interface BottomCommandBarProps {
  game: GameState;
  selectedRegionId: RegionId | null;
  locale: LocaleCode;
  onRunOperation: (operationId: string, regionId: RegionId) => void;
  onOpenSkillTree: () => void;
  onOpenGlobalStatus: () => void;
  onOpenEventLog: () => void;
  onOpenHelp: () => void;
  onSave: () => void;
  onNewGame: () => void;
}

export function BottomCommandBar({
  game,
  selectedRegionId,
  locale,
  onRunOperation,
  onOpenSkillTree,
  onOpenGlobalStatus,
  onOpenEventLog,
  onOpenHelp,
  onSave,
  onNewGame,
}: BottomCommandBarProps) {
  return (
    <footer className="bottom-command-bar">
      <div className="selected-region-line">
        <span>{t("ui.selectedRegion", {}, locale)}</span>
        <strong>{selectedRegionId ? t(regionById[selectedRegionId].nameKey, {}, locale) : t("ui.noRegion", {}, locale)}</strong>
      </div>
      <OperationPanel game={game} selectedRegionId={selectedRegionId} locale={locale} onRunOperation={onRunOperation} />
      <nav className="command-actions" aria-label={t("ui.operations", {}, locale)}>
        <button type="button" onClick={onOpenSkillTree}>{t("ui.skillTree", {}, locale)}</button>
        <button type="button" onClick={onOpenGlobalStatus}>{t("ui.globalStatus", {}, locale)}</button>
        <button type="button" onClick={onOpenEventLog}>{t("ui.eventLog", {}, locale)}</button>
        <button type="button" onClick={onOpenHelp}>{t("ui.help", {}, locale)}</button>
        <button type="button" onClick={onSave}>{t("ui.saveNow", {}, locale)}</button>
        <button type="button" onClick={onNewGame}>{t("ui.newGame", {}, locale)}</button>
      </nav>
    </footer>
  );
}
