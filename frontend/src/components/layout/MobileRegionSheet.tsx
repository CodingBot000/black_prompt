import type { GameState, LocaleCode, RegionId } from "../../engine/types";
import { t } from "../../locales/i18n";
import { Modal } from "../common/Modal";
import { OperationPanel } from "../panels/OperationPanel";
import { RegionDetailPanel } from "../panels/RegionDetailPanel";

interface MobileRegionSheetProps {
  game: GameState;
  regionId: RegionId | null;
  locale: LocaleCode;
  onClose: () => void;
  onRunOperation: (operationId: string, regionId: RegionId) => void;
}

export function MobileRegionSheet({ game, regionId, locale, onClose, onRunOperation }: MobileRegionSheetProps) {
  return (
    <Modal title={t("ui.regionStatus", {}, locale)} closeLabel={t("ui.close", {}, locale)} onClose={onClose}>
      <RegionDetailPanel game={game} regionId={regionId} locale={locale} />
      <OperationPanel game={game} selectedRegionId={regionId} locale={locale} onRunOperation={onRunOperation} />
    </Modal>
  );
}
