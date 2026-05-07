import { abilities } from "../../data/abilities";
import { canPurchaseAbility } from "../../engine/abilityResolver";
import { hasResources } from "../../engine/selectors";
import type { AbilityBranch, GameState, LocaleCode } from "../../engine/types";
import { t } from "../../locales/i18n";
import { Modal } from "../common/Modal";

interface SkillTreeModalProps {
  game: GameState;
  locale: LocaleCode;
  selectedBranch: AbilityBranch;
  onSelectBranch: (branch: AbilityBranch) => void;
  onPurchase: (abilityId: string) => void;
  onClose: () => void;
}

const branches: AbilityBranch[] = ["propagation", "stealth", "influence"];

export function SkillTreeModal({
  game,
  locale,
  selectedBranch,
  onSelectBranch,
  onPurchase,
  onClose,
}: SkillTreeModalProps) {
  const visibleAbilities = abilities.filter((ability) => ability.branch === selectedBranch);
  return (
    <Modal title={t("ui.skillTree", {}, locale)} closeLabel={t("ui.close", {}, locale)} onClose={onClose} wide>
      <div className="tabs">
        {branches.map((branch) => (
          <button
            type="button"
            key={branch}
            className={branch === selectedBranch ? "is-active" : ""}
            onClick={() => onSelectBranch(branch)}
          >
            {t(`branch.${branch}`, {}, locale)}
          </button>
        ))}
      </div>
      <div className="ability-grid">
        {visibleAbilities.map((ability) => {
          const purchased = game.unlockedAbilities.includes(ability.id);
          const purchaseCheck = canPurchaseAbility(game, ability.id);
          const affordable = hasResources(game.resources, ability.cost);
          return (
            <article className={`ability-card ${purchased ? "is-purchased" : ""}`} key={ability.id}>
              <header>
                <span>{t("ui.tier", {}, locale)} {ability.tier}</span>
                <h3>{t(ability.nameKey, {}, locale)}</h3>
              </header>
              <p>{t(ability.descriptionKey, {}, locale)}</p>
              <small>{t("ui.cost", {}, locale)}: {formatCost(ability.cost, locale)}</small>
              {ability.prerequisites.length > 0 ? (
                <small>{t("ui.requires", {}, locale)}: {ability.prerequisites.map((id) => t(`skill.${id}.name`, {}, locale)).join(", ")}</small>
              ) : null}
              <button
                type="button"
                onClick={() => onPurchase(ability.id)}
                disabled={!purchaseCheck.can}
                title={purchaseCheck.reasonKey ? t(purchaseCheck.reasonKey, {}, locale) : t("ui.buy", {}, locale)}
              >
                {purchased ? t("ui.bought", {}, locale) : affordable ? t("ui.buy", {}, locale) : t("error.insufficientResources", {}, locale)}
              </button>
            </article>
          );
        })}
      </div>
    </Modal>
  );
}

function formatCost(cost: Record<string, number | undefined>, locale: LocaleCode): string {
  return Object.entries(cost)
    .filter(([, value]) => value !== undefined && value > 0)
    .map(([key, value]) => `${t(`resource.${key}`, {}, locale)} ${value}`)
    .join(" / ");
}
