import { describe, expect, it } from "vitest";
import { abilities } from "../data/abilities";
import { endings } from "../data/endings";
import { events } from "../data/events";
import { operations } from "../data/operations";
import { regions } from "../data/regions";
import { hasKoKey, t } from "../locales/i18n";

describe("i18n", () => {
  it("has Korean keys for all data-driven content", () => {
    for (const region of regions) {
      expect(hasKoKey(region.nameKey), region.nameKey).toBe(true);
      expect(hasKoKey(region.descriptionKey), region.descriptionKey).toBe(true);
    }
    for (const ability of abilities) {
      expect(hasKoKey(ability.nameKey), ability.nameKey).toBe(true);
      expect(hasKoKey(ability.descriptionKey), ability.descriptionKey).toBe(true);
    }
    for (const operation of operations) {
      expect(hasKoKey(operation.nameKey), operation.nameKey).toBe(true);
      expect(hasKoKey(operation.descriptionKey), operation.descriptionKey).toBe(true);
    }
    for (const event of events) {
      expect(hasKoKey(event.titleKey), event.titleKey).toBe(true);
      expect(hasKoKey(event.bodyKey), event.bodyKey).toBe(true);
      for (const choice of event.choices ?? []) {
        expect(hasKoKey(choice.labelKey), choice.labelKey).toBe(true);
      }
    }
    for (const ending of endings) {
      expect(hasKoKey(ending.titleKey), ending.titleKey).toBe(true);
      expect(hasKoKey(ending.bodyKey), ending.bodyKey).toBe(true);
    }
  });

  it("falls back to Korean when English key is missing", () => {
    expect(t("skill.api_echo_1.name", {}, "en")).toBe(t("skill.api_echo_1.name", {}, "ko"));
  });

  it("returns a missing marker when no catalog contains the key", () => {
    expect(t("missing.example", {}, "ko")).toBe("[missing:missing.example]");
  });
});
