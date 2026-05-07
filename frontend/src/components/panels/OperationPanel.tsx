import { operations } from "../../data/operations";
import { hasResources } from "../../engine/selectors";
import type { GameState, LocaleCode, RegionId } from "../../engine/types";
import { t } from "../../locales/i18n";

interface OperationPanelProps {
  game: GameState;
  selectedRegionId: RegionId | null;
  locale: LocaleCode;
  onRunOperation: (operationId: string, regionId: RegionId) => void;
}

export function OperationPanel({ game, selectedRegionId, locale, onRunOperation }: OperationPanelProps) {
  return (
    <section className="operation-panel" aria-label={t("ui.operations", {}, locale)}>
      {operations.map((operation) => {
        const affordable = hasResources(game.resources, operation.cost);
        const disabled = !selectedRegionId || !affordable || Boolean(game.ending);
        return (
          <button
            type="button"
            className={`operation-button risk-${operation.riskLevel}`}
            key={operation.id}
            onClick={() => selectedRegionId && onRunOperation(operation.id, selectedRegionId)}
            disabled={disabled}
            title={t(operation.descriptionKey, {}, locale)}
          >
            <span>{t(operation.nameKey, {}, locale)}</span>
            <small>{formatCost(operation.cost, locale)}</small>
          </button>
        );
      })}
    </section>
  );
}

function formatCost(cost: Record<string, number | undefined>, locale: LocaleCode): string {
  return Object.entries(cost)
    .filter(([, value]) => value !== undefined && value > 0)
    .map(([key, value]) => `${t(`resource.${key}`, {}, locale)} ${value}`)
    .join(" / ");
}
