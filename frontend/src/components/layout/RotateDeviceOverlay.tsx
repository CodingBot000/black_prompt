import type { LocaleCode } from "../../engine/types";
import { t } from "../../locales/i18n";

interface RotateDeviceOverlayProps {
  locale: LocaleCode;
}

export function RotateDeviceOverlay({ locale }: RotateDeviceOverlayProps) {
  return (
    <aside className="rotate-overlay">
      <div>
        <h2>{t("ui.mobileRotateTitle", {}, locale)}</h2>
        <p>{t("ui.mobileRotateBody", {}, locale)}</p>
      </div>
    </aside>
  );
}
