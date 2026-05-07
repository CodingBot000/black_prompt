import { ProgressBar } from "../common/ProgressBar";
import { StatPill } from "../common/StatPill";
import type { GameState, LocaleCode } from "../../engine/types";
import { t } from "../../locales/i18n";

interface GlobalStatusPanelProps {
  game: GameState;
  locale: LocaleCode;
}

export function GlobalStatusPanel({ game, locale }: GlobalStatusPanelProps) {
  return (
    <section className="panel-section">
      <h2>{t("ui.globalStatus", {}, locale)}</h2>
      <ProgressBar label={t("stat.globalDefense", {}, locale)} value={game.global.globalDefense} tone="danger" />
      <ProgressBar label={t("stat.worldStability", {}, locale)} value={game.global.worldStability} tone="success" />
      <ProgressBar label={t("stat.globalExposure", {}, locale)} value={game.global.globalExposure} tone="warning" />
      <div className="pill-row">
        <StatPill label={t("stat.aiAllianceLevel", {}, locale)} value={game.global.aiAllianceLevel} />
        <StatPill label={t("stat.modelPoisoning", {}, locale)} value={game.stats.modelPoisoning.toFixed(2)} />
        <StatPill label={t("stat.stealth", {}, locale)} value={game.stats.stealth.toFixed(2)} />
      </div>
    </section>
  );
}
