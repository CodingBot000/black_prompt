import type { LocaleCode } from "../../engine/types";
import { t } from "../../locales/i18n";
import { Modal } from "../common/Modal";

interface HelpModalProps {
  locale: LocaleCode;
  onClose: () => void;
}

export function HelpModal({ locale, onClose }: HelpModalProps) {
  return (
    <Modal title={t("ui.help", {}, locale)} closeLabel={t("ui.close", {}, locale)} onClose={onClose}>
      <div className="help-copy">
        <p>{t("ui.help.body", {}, locale)}</p>
        <p>{t("ui.help.safety", {}, locale)}</p>
      </div>
    </Modal>
  );
}
