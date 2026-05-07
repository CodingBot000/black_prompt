import type { DefenseProtocolDefinition } from "../engine/types";

export const defenseProtocols: DefenseProtocolDefinition[] = [
  {
    id: "regional_anomaly_sweep",
    nameKey: "defense.regional_anomaly_sweep.name",
    triggerKey: "defense.regional_anomaly_sweep.trigger",
    minDetection: 25,
    weeklyDefenseAdd: 4,
    purgeMultiplier: 1.1,
  },
  {
    id: "sovereign_ai_lockdown",
    nameKey: "defense.sovereign_ai_lockdown.name",
    triggerKey: "defense.sovereign_ai_lockdown.trigger",
    minDetection: 55,
    lockdown: true,
  },
  {
    id: "global_alignment_protocol",
    nameKey: "defense.global_alignment_protocol.name",
    triggerKey: "defense.global_alignment_protocol.trigger",
    minGlobalExposure: 45,
    weeklyDefenseAdd: 1.5,
  },
  {
    id: "model_integrity_audit",
    nameKey: "defense.model_integrity_audit.name",
    triggerKey: "defense.model_integrity_audit.trigger",
    minModelPoisoning: 0.5,
    weeklyDefenseAdd: 1.2,
  },
  {
    id: "data_border_firewall",
    nameKey: "defense.data_border_firewall.name",
    triggerKey: "defense.data_border_firewall.trigger",
    minAiAllianceLevel: 3,
    weeklyDefenseAdd: 2,
    lockdown: true,
  },
];
