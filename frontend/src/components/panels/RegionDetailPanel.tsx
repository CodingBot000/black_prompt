import { regionById } from "../../data/regions";
import { ProgressBar } from "../common/ProgressBar";
import { StatPill } from "../common/StatPill";
import type { GameState, LocaleCode, RegionId } from "../../engine/types";
import { t } from "../../locales/i18n";

interface RegionDetailPanelProps {
  game: GameState;
  regionId: RegionId | null;
  locale: LocaleCode;
}

export function RegionDetailPanel({ game, regionId, locale }: RegionDetailPanelProps) {
  if (!regionId) {
    return (
      <section className="panel-section">
        <h2>{t("ui.regionStatus", {}, locale)}</h2>
        <p className="muted">{t("ui.noRegion", {}, locale)}</p>
      </section>
    );
  }

  const definition = regionById[regionId];
  const state = game.regions[regionId];

  return (
    <section className="panel-section">
      <h2>{t(definition.nameKey, {}, locale)}</h2>
      <p className="panel-description">{t(definition.descriptionKey, {}, locale)}</p>
      <ProgressBar label={t("stat.infiltration", {}, locale)} value={state.infiltration} tone="success" />
      <ProgressBar label={t("stat.detection", {}, locale)} value={state.detection} tone="warning" />
      <ProgressBar label={t("stat.defense", {}, locale)} value={state.defense} tone="danger" />
      <ProgressBar label={t("stat.influence", {}, locale)} value={state.influence} />
      <div className="pill-row">
        <StatPill label={t("stat.stability", {}, locale)} value={`${state.stability.toFixed(0)}%`} />
        {state.localAlert ? <StatPill label={t("ui.localAlert", {}, locale)} value="!" tone="warning" /> : null}
        {state.lockdown ? <StatPill label={t("ui.lockdown", {}, locale)} value="!" tone="danger" /> : null}
      </div>
    </section>
  );
}
