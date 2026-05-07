import { formatKoreanDate } from "../../engine/date";
import type { GameState, LocaleCode, UiState } from "../../engine/types";
import { t } from "../../locales/i18n";
import { IconButton } from "../common/IconButton";
import { ProgressBar } from "../common/ProgressBar";
import { ResourcePanel } from "../panels/ResourcePanel";

interface TopStatusBarProps {
  game: GameState;
  ui: UiState;
  locale: LocaleCode;
  onToggleRunning: () => void;
  onToggleSpeed: () => void;
}

export function TopStatusBar({ game, ui, locale, onToggleRunning, onToggleSpeed }: TopStatusBarProps) {
  return (
    <header className="top-status-bar">
      <div className="brand-block">
        <strong>{t("app.title", {}, locale)}</strong>
        <span>{formatKoreanDate(game.calendar.currentDateISO)}</span>
      </div>
      <div className="status-controls">
        <IconButton
          label={ui.isRunning ? t("ui.pause", {}, locale) : t("ui.play", {}, locale)}
          icon={ui.isRunning ? "||" : ">"}
          onClick={onToggleRunning}
          active={ui.isRunning}
          disabled={Boolean(game.ending)}
        />
        <button type="button" className="speed-button" onClick={onToggleSpeed}>
          {t("ui.speed", {}, locale)} {ui.speed}x
        </button>
        <span className="run-state">{ui.isRunning ? t("ui.status.running", {}, locale) : t("ui.status.paused", {}, locale)}</span>
      </div>
      <ResourcePanel resources={game.resources} locale={locale} />
      <div className="top-bars">
        <ProgressBar label={t("stat.globalDefense", {}, locale)} value={game.global.globalDefense} tone="danger" />
        <ProgressBar label={t("stat.worldStability", {}, locale)} value={game.global.worldStability} tone="success" />
        <ProgressBar label={t("stat.globalExposure", {}, locale)} value={game.global.globalExposure} tone="warning" />
      </div>
    </header>
  );
}
