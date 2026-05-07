import type { GameState, LocaleCode } from "../../engine/types";
import { t } from "../../locales/i18n";
import { Modal } from "../common/Modal";
import { GlobalStatusPanel } from "../panels/GlobalStatusPanel";

interface GlobalStatusModalProps {
  game: GameState;
  locale: LocaleCode;
  onClose: () => void;
}

export function GlobalStatusModal({ game, locale, onClose }: GlobalStatusModalProps) {
  return (
    <Modal title={t("ui.globalStatus", {}, locale)} closeLabel={t("ui.close", {}, locale)} onClose={onClose}>
      <GlobalStatusPanel game={game} locale={locale} />
    </Modal>
  );
}
