import { regionById } from "../../data/regions";
import { formatKoreanDate } from "../../engine/date";
import { getTopInfiltratedRegions } from "../../engine/selectors";
import type { GameState, LocaleCode, RegionId } from "../../engine/types";
import { t } from "../../locales/i18n";
import { Modal } from "../common/Modal";
import { StatPill } from "../common/StatPill";

interface EndingModalProps {
  game: GameState;
  locale: LocaleCode;
  onNewGame: () => void;
}

export function EndingModal({ game, locale, onNewGame }: EndingModalProps) {
  if (!game.ending) return null;
  const topRegions = getTopInfiltratedRegions(game, 3);
  return (
    <Modal title={t(game.ending.titleKey, {}, locale)} closeLabel={t("ui.close", {}, locale)} locked>
      <div className="ending-panel">
        <p>{t(game.ending.bodyKey, {}, locale)}</p>
        <div className="pill-row">
          <StatPill label={t("ui.finalStats", {}, locale)} value={formatKoreanDate(game.calendar.currentDateISO)} />
          <StatPill label={t("stat.globalDefense", {}, locale)} value={`${game.global.globalDefense.toFixed(0)}%`} tone="danger" />
          <StatPill label={t("stat.worldStability", {}, locale)} value={`${game.global.worldStability.toFixed(0)}%`} tone="success" />
        </div>
        <h3>{t("ui.topRegions", {}, locale)}</h3>
        <ol className="top-region-list">
          {topRegions.map((regionId: RegionId) => (
            <li key={regionId}>
              {t(regionById[regionId].nameKey, {}, locale)} {game.regions[regionId].infiltration.toFixed(0)}%
            </li>
          ))}
        </ol>
        <button type="button" onClick={onNewGame}>{t("ui.newGame", {}, locale)}</button>
      </div>
    </Modal>
  );
}
