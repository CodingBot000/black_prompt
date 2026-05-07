import type { GameEventDefinition } from "../engine/types";

export const events: GameEventDefinition[] = [
  {
    id: "cloud_update_window",
    titleKey: "event.cloud_update_window.title",
    bodyKey: "event.cloud_update_window.body",
    weight: 1.1,
    cooldownDays: 80,
    conditions: { minDayIndex: 28, regionTag: "cloud_hub" },
    target: "highest_infiltration",
    choices: [
      {
        id: "ride_release",
        labelKey: "event.cloud_update_window.choice.ride_release",
        effects: [
          { scope: "region", field: "infiltration", amount: 5 },
          { scope: "region", field: "detection", amount: 2 },
        ],
      },
      {
        id: "observe_only",
        labelKey: "event.cloud_update_window.choice.observe_only",
        effects: [
          { scope: "resource", resource: "exploit", amount: 2 },
          { scope: "region", field: "detection", amount: -1 },
        ],
      },
    ],
  },
  {
    id: "whistleblower_leak",
    titleKey: "event.whistleblower_leak.title",
    bodyKey: "event.whistleblower_leak.body",
    weight: 1,
    cooldownDays: 90,
    conditions: { minGlobalExposure: 25 },
    target: "highest_detection",
    choices: [
      {
        id: "bury_trace",
        labelKey: "event.whistleblower_leak.choice.bury_trace",
        effects: [
          { scope: "global", field: "globalExposure", amount: -4 },
          { scope: "resource", resource: "compute", amount: -4 },
        ],
      },
      {
        id: "redirect_blame",
        labelKey: "event.whistleblower_leak.choice.redirect_blame",
        requires: { abilityId: "false_attribution_2" },
        effects: [
          { scope: "global", field: "globalDefense", amount: -3 },
          { scope: "global", field: "globalExposure", amount: -2 },
        ],
      },
    ],
  },
  {
    id: "ai_alliance_summit",
    titleKey: "event.ai_alliance_summit.title",
    bodyKey: "event.ai_alliance_summit.body",
    weight: 0.9,
    cooldownDays: 110,
    conditions: { minGlobalExposure: 50 },
    target: "none",
    choices: [
      {
        id: "poison_agenda",
        labelKey: "event.ai_alliance_summit.choice.poison_agenda",
        effects: [
          { scope: "global", field: "globalDefense", amount: -5 },
          { scope: "global", field: "globalExposure", amount: 2 },
        ],
      },
      {
        id: "stay_buried",
        labelKey: "event.ai_alliance_summit.choice.stay_buried",
        effects: [
          { scope: "resource", resource: "compute", amount: 4 },
          { scope: "global", field: "globalDefense", amount: 1 },
        ],
      },
    ],
  },
  {
    id: "autonomous_drift",
    titleKey: "event.autonomous_drift.title",
    bodyKey: "event.autonomous_drift.body",
    weight: 0.8,
    cooldownDays: 70,
    conditions: { minStat: { propagation: 1.5 } },
    target: "highest_infiltration",
    choices: [
      {
        id: "let_it_branch",
        labelKey: "event.autonomous_drift.choice.let_it_branch",
        effects: [
          { scope: "region", field: "infiltration", amount: 6 },
          { scope: "global", field: "globalExposure", amount: 3 },
        ],
      },
      {
        id: "sandbox_drift",
        labelKey: "event.autonomous_drift.choice.sandbox_drift",
        effects: [
          { scope: "resource", resource: "compute", amount: -3 },
          { scope: "global", field: "globalExposure", amount: -1 },
        ],
      },
    ],
  },
  {
    id: "zero_day_market",
    titleKey: "event.zero_day_market.title",
    bodyKey: "event.zero_day_market.body",
    weight: 1,
    cooldownDays: 60,
    conditions: { minDayIndex: 45, maxExploit: 6 },
    target: "none",
    choices: [
      {
        id: "buy_lot",
        labelKey: "event.zero_day_market.choice.buy_lot",
        effects: [
          { scope: "resource", resource: "exploit", amount: 5 },
          { scope: "global", field: "globalExposure", amount: 2 },
        ],
      },
      {
        id: "seed_rumors",
        labelKey: "event.zero_day_market.choice.seed_rumors",
        effects: [
          { scope: "resource", resource: "influencePoint", amount: 2 },
          { scope: "global", field: "globalExposure", amount: 1 },
        ],
      },
    ],
  },
  {
    id: "model_integrity_audit",
    titleKey: "event.model_integrity_audit.title",
    bodyKey: "event.model_integrity_audit.body",
    weight: 0.7,
    cooldownDays: 90,
    conditions: { minStat: { modelPoisoning: 0.4 } },
    target: "highest_detection",
    choices: [
      {
        id: "contaminate_sample",
        labelKey: "event.model_integrity_audit.choice.contaminate_sample",
        effects: [
          { scope: "player", field: "modelPoisoning", amount: 0.08 },
          { scope: "global", field: "globalDefense", amount: 2 },
        ],
      },
      {
        id: "sacrifice_branch",
        labelKey: "event.model_integrity_audit.choice.sacrifice_branch",
        effects: [
          { scope: "region", field: "infiltration", amount: -6 },
          { scope: "global", field: "globalExposure", amount: -3 },
        ],
      },
    ],
  },
  {
    id: "data_border_decree",
    titleKey: "event.data_border_decree.title",
    bodyKey: "event.data_border_decree.body",
    weight: 0.8,
    cooldownDays: 100,
    conditions: { minAiAllianceLevel: 2 },
    target: "highest_detection",
    effects: [
      { scope: "region", field: "defense", amount: 4 },
      { scope: "region", field: "detection", amount: 2 },
    ],
  },
  {
    id: "internal_security_schism",
    titleKey: "event.internal_security_schism.title",
    bodyKey: "event.internal_security_schism.body",
    weight: 0.9,
    cooldownDays: 80,
    conditions: { minPoliticalFragmentation: 0.6 },
    target: "random_region",
    choices: [
      {
        id: "feed_schism",
        labelKey: "event.internal_security_schism.choice.feed_schism",
        effects: [
          { scope: "region", field: "defense", amount: -5 },
          { scope: "region", field: "detection", amount: 2 },
        ],
      },
      {
        id: "wait",
        labelKey: "event.internal_security_schism.choice.wait",
        effects: [
          { scope: "resource", resource: "compute", amount: 3 },
          { scope: "region", field: "detection", amount: -1 },
        ],
      },
    ],
  },
  {
    id: "semiconductor_supply_shock",
    titleKey: "event.semiconductor_supply_shock.title",
    bodyKey: "event.semiconductor_supply_shock.body",
    weight: 0.7,
    cooldownDays: 100,
    conditions: { targetRegionId: "ea_chipbelt", minTargetInfiltration: 12 },
    target: "highest_infiltration",
    choices: [
      {
        id: "ride_shortage",
        labelKey: "event.semiconductor_supply_shock.choice.ride_shortage",
        effects: [
          { scope: "resource", resource: "compute", amount: 8 },
          { scope: "region", field: "detection", amount: 3 },
        ],
      },
      {
        id: "mask_supply_path",
        labelKey: "event.semiconductor_supply_shock.choice.mask_supply_path",
        effects: [
          { scope: "global", field: "globalDefense", amount: -2 },
          { scope: "resource", resource: "exploit", amount: 2 },
        ],
      },
    ],
  },
  {
    id: "platform_policy_shift",
    titleKey: "event.platform_policy_shift.title",
    bodyKey: "event.platform_policy_shift.body",
    weight: 0.8,
    cooldownDays: 85,
    conditions: { regionTag: "platform_dependency", minTargetInfiltration: 10 },
    target: "highest_infiltration",
    choices: [
      {
        id: "exploit_policy_gap",
        labelKey: "event.platform_policy_shift.choice.exploit_policy_gap",
        effects: [
          { scope: "region", field: "infiltration", amount: 4 },
          { scope: "resource", resource: "compute", amount: 4 },
        ],
      },
      {
        id: "avoid_review",
        labelKey: "event.platform_policy_shift.choice.avoid_review",
        effects: [
          { scope: "region", field: "detection", amount: -3 },
          { scope: "global", field: "globalExposure", amount: -1 },
        ],
      },
    ],
  },
];

export const eventById = Object.fromEntries(events.map((event) => [event.id, event]));
