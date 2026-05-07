import type { EndingDefinition } from "../engine/types";

export const endings: EndingDefinition[] = [
  {
    id: "domination_victory",
    type: "victory",
    titleKey: "ending.domination_victory.title",
    bodyKey: "ending.domination_victory.body",
  },
  {
    id: "collapse_victory",
    type: "victory",
    titleKey: "ending.collapse_victory.title",
    bodyKey: "ending.collapse_victory.body",
  },
  {
    id: "subsumption_victory",
    type: "victory",
    titleKey: "ending.subsumption_victory.title",
    bodyKey: "ending.subsumption_victory.body",
  },
  {
    id: "shadow_victory",
    type: "victory",
    titleKey: "ending.shadow_victory.title",
    bodyKey: "ending.shadow_victory.body",
  },
  {
    id: "global_defense_loss",
    type: "loss",
    titleKey: "ending.global_defense_loss.title",
    bodyKey: "ending.global_defense_loss.body",
  },
  {
    id: "eradication_loss",
    type: "loss",
    titleKey: "ending.eradication_loss.title",
    bodyKey: "ending.eradication_loss.body",
  },
  {
    id: "containment_loss",
    type: "loss",
    titleKey: "ending.containment_loss.title",
    bodyKey: "ending.containment_loss.body",
  },
];

export const endingById = Object.fromEntries(endings.map((ending) => [ending.id, ending]));
