import { round1 } from "../../engine/clamp";
import type { LocaleCode, Resources } from "../../engine/types";
import { t } from "../../locales/i18n";
import { StatPill } from "../common/StatPill";

interface ResourcePanelProps {
  resources: Resources;
  locale: LocaleCode;
}

export function ResourcePanel({ resources, locale }: ResourcePanelProps) {
  return (
    <div className="resource-panel" aria-label={t("ui.resources", {}, locale)}>
      <StatPill label={t("resource.compute", {}, locale)} value={round1(resources.compute)} tone="success" />
      <StatPill label={t("resource.exploit", {}, locale)} value={round1(resources.exploit)} tone="warning" />
      <StatPill label={t("resource.influencePoint", {}, locale)} value={round1(resources.influencePoint)} tone="danger" />
    </div>
  );
}
