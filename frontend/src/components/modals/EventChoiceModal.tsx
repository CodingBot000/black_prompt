import { eventById } from "../../data/events";
import { choiceEnabled } from "../../engine/eventResolver";
import type { GameEventDefinition, GameState, LocaleCode } from "../../engine/types";
import { t } from "../../locales/i18n";
import { Modal } from "../common/Modal";

interface EventChoiceModalProps {
  game: GameState;
  locale: LocaleCode;
  onResolve: (eventId: string, choiceId: string) => void;
}

export function EventChoiceModal({ game, locale, onResolve }: EventChoiceModalProps) {
  const pending = game.pendingEventChoice;
  const event = pending ? eventById[pending.eventId] as GameEventDefinition | undefined : undefined;
  if (!pending || !event) return null;

  return (
    <Modal title={t("ui.eventChoice", {}, locale)} closeLabel={t("ui.close", {}, locale)} locked>
      <article className="event-choice">
        <h3>{t(event.titleKey, {}, locale)}</h3>
        <p>{t(event.bodyKey, {}, locale)}</p>
        <div className="choice-list">
          {event.choices?.map((choice) => {
            const enabled = choiceEnabled(game, choice);
            return (
              <button
                type="button"
                key={choice.id}
                onClick={() => onResolve(event.id, choice.id)}
                disabled={!enabled}
                title={enabled ? t("ui.chooseEventResponse", {}, locale) : t("error.choiceRequirement", {}, locale)}
              >
                {t(choice.labelKey, {}, locale)}
              </button>
            );
          })}
        </div>
      </article>
    </Modal>
  );
}
