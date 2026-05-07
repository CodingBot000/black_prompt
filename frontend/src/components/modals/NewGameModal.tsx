import { useState } from "react";
import { regionById, regionIds } from "../../data/regions";
import type { LocaleCode, RegionId } from "../../engine/types";
import { t } from "../../locales/i18n";
import { Modal } from "../common/Modal";

interface NewGameModalProps {
  locale: LocaleCode;
  initialRegionId: RegionId;
  onStart: (regionId: RegionId) => void;
  onLoad: () => string | null;
  onClose: () => void;
}

export function NewGameModal({ locale, initialRegionId, onStart, onLoad, onClose }: NewGameModalProps) {
  const [selected, setSelected] = useState<RegionId>(initialRegionId);
  const [loadErrorKey, setLoadErrorKey] = useState<string | null>(null);

  return (
    <Modal title={t("ui.chooseStartRegion", {}, locale)} closeLabel={t("ui.close", {}, locale)} onClose={onClose} wide>
      <div className="new-game-grid">
        {regionIds.map((regionId) => (
          <button
            type="button"
            key={regionId}
            className={selected === regionId ? "is-active" : ""}
            onClick={() => setSelected(regionId)}
          >
            <strong>{t(regionById[regionId].nameKey, {}, locale)}</strong>
            <span>{t(regionById[regionId].descriptionKey, {}, locale)}</span>
          </button>
        ))}
      </div>
      {loadErrorKey ? <p className="error-text">{t("ui.loadFailed", {}, locale)}: {t(loadErrorKey, {}, locale)}</p> : null}
      <div className="modal-actions">
        <button type="button" onClick={() => onStart(selected)}>{t("ui.startSelected", {}, locale)}</button>
        <button
          type="button"
          onClick={() => {
            const errorKey = onLoad();
            setLoadErrorKey(errorKey);
          }}
        >
          {t("ui.load", {}, locale)}
        </button>
      </div>
    </Modal>
  );
}
