import type { GameState, LocaleCode, RegionId } from "../../engine/types";
import { EventLogPanel } from "../panels/EventLogPanel";
import { GlobalStatusPanel } from "../panels/GlobalStatusPanel";
import { RegionDetailPanel } from "../panels/RegionDetailPanel";

interface DesktopSidePanelProps {
  game: GameState;
  selectedRegionId: RegionId | null;
  locale: LocaleCode;
}

export function DesktopSidePanel({ game, selectedRegionId, locale }: DesktopSidePanelProps) {
  return (
    <aside className="desktop-side-panel">
      <RegionDetailPanel game={game} regionId={selectedRegionId} locale={locale} />
      <GlobalStatusPanel game={game} locale={locale} />
      <EventLogPanel logs={game.eventLog} locale={locale} compact />
    </aside>
  );
}
