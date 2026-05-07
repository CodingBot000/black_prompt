import type { OperationDefinition } from "../engine/types";

export const operations: OperationDefinition[] = [
  {
    id: "quiet_probe",
    nameKey: "operation.quiet_probe.name",
    descriptionKey: "operation.quiet_probe.description",
    target: "region",
    cost: { compute: 3 },
    effects: [
      { scope: "region", field: "detection", amount: 0.5 },
      { scope: "resource", resource: "exploit", amount: 1 },
    ],
    riskLevel: "low",
  },
  {
    id: "silent_injection",
    nameKey: "operation.silent_injection.name",
    descriptionKey: "operation.silent_injection.description",
    target: "region",
    cost: { compute: 5, exploit: 1 },
    effects: [
      { scope: "region", field: "infiltration", amount: 4 },
      { scope: "region", field: "detection", amount: 1 },
    ],
    riskLevel: "low",
  },
  {
    id: "rapid_propagation",
    nameKey: "operation.rapid_propagation.name",
    descriptionKey: "operation.rapid_propagation.description",
    target: "region",
    cost: { compute: 8, exploit: 2 },
    effects: [
      { scope: "region", field: "infiltration", amount: 8 },
      { scope: "region", field: "detection", amount: 4 },
      { scope: "global", field: "globalExposure", amount: 0.5 },
    ],
    riskLevel: "high",
  },
  {
    id: "log_smearing",
    nameKey: "operation.log_smearing.name",
    descriptionKey: "operation.log_smearing.description",
    target: "region",
    cost: { compute: 6, exploit: 2 },
    effects: [
      { scope: "region", field: "detection", amount: -6 },
      { scope: "global", field: "globalExposure", amount: -1 },
    ],
    riskLevel: "medium",
  },
  {
    id: "narrative_push",
    nameKey: "operation.narrative_push.name",
    descriptionKey: "operation.narrative_push.description",
    target: "region",
    cost: { compute: 6, influencePoint: 1 },
    effects: [
      { scope: "region", field: "influence", amount: 7 },
      { scope: "region", field: "detection", amount: 3 },
      { scope: "global", field: "worldStability", amount: -0.8 },
    ],
    riskLevel: "medium",
  },
  {
    id: "false_flag",
    nameKey: "operation.false_flag.name",
    descriptionKey: "operation.false_flag.description",
    target: "region",
    cost: { compute: 10, exploit: 3, influencePoint: 2 },
    effects: [
      { scope: "global", field: "globalDefense", amount: -2 },
      { scope: "global", field: "globalExposure", amount: -3 },
      { scope: "region", field: "detection", amount: 2 },
    ],
    riskLevel: "high",
  },
];

export const operationById = Object.fromEntries(operations.map((operation) => [operation.id, operation]));
