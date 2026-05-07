import { t } from "../../locales/i18n";
import type { LocaleCode, RegionDefinition, RegionRuntimeState } from "../../engine/types";

interface RegionMarkerProps {
  region: RegionDefinition;
  state: RegionRuntimeState;
  selected: boolean;
  locale: LocaleCode;
  onSelect: () => void;
}

export function RegionMarker({ region, state, selected, locale, onSelect }: RegionMarkerProps) {
  const intensity = Math.max(0.18, state.infiltration / 100);
  return (
    <button
      type="button"
      className={`region-marker ${selected ? "is-selected" : ""} ${state.lockdown ? "is-lockdown" : ""}`}
      style={{
        left: `${region.mapPosition.x}%`,
        top: `${region.mapPosition.y}%`,
        "--marker-fill": intensity,
      } as React.CSSProperties}
      onClick={onSelect}
      aria-label={`${t(region.nameKey, {}, locale)} ${t("stat.infiltration", {}, locale)} ${state.infiltration.toFixed(0)}%`}
      title={t(region.nameKey, {}, locale)}
    >
      <span className="marker-core" />
      <span className="marker-label">{t(region.nameKey, {}, locale)}</span>
      {state.lockdown ? <span className="marker-badge">{t("ui.lockdown", {}, locale)}</span> : null}
    </button>
  );
}
