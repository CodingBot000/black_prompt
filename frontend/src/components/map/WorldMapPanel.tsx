import { regions } from "../../data/regions";
import type { GameState, LocaleCode, RegionId } from "../../engine/types";
import { t } from "../../locales/i18n";
import { RegionMarker } from "./RegionMarker";

interface WorldMapPanelProps {
  game: GameState;
  selectedRegionId: RegionId | null;
  locale: LocaleCode;
  onSelectRegion: (regionId: RegionId) => void;
}

export function WorldMapPanel({ game, selectedRegionId, locale, onSelectRegion }: WorldMapPanelProps) {
  return (
    <section className="world-map-panel" aria-label={t("map.alt.world", {}, locale)}>
      <div className="world-map">
        <img src="/world-map-placeholder.svg" alt={t("map.alt.world", {}, locale)} draggable={false} />
        {regions.map((region) => (
          <RegionMarker
            key={region.id}
            region={region}
            state={game.regions[region.id]}
            selected={selectedRegionId === region.id}
            locale={locale}
            onSelect={() => onSelectRegion(region.id)}
          />
        ))}
      </div>
    </section>
  );
}
