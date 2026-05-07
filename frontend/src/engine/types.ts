export type RegionId =
  | "na_cloud"
  | "cn_sovai"
  | "eu_reggrid"
  | "in_datacommons"
  | "ea_chipbelt"
  | "gulf_finnet"
  | "gs_mobilecloud"
  | "eurasia_shadow";

export type ResourceKey = "compute" | "exploit" | "influencePoint";
export type AbilityBranch = "propagation" | "stealth" | "influence";
export type LocaleCode = "ko" | "en";

export type RouteType =
  | "cloud_peering"
  | "api_supply"
  | "chip_supply"
  | "platform_dependency"
  | "supply_chain"
  | "hardware_export"
  | "gray_route"
  | "labor_api"
  | "remittance_finance"
  | "regulatory_exchange";

export type Severity = "info" | "warning" | "critical" | "success";

export interface RegionRoute {
  to: RegionId;
  type: RouteType;
  weight: number;
}

export interface MapPosition {
  x: number;
  y: number;
}

export interface RegionDefinition {
  id: RegionId;
  nameKey: string;
  descriptionKey: string;
  tags: string[];
  mapPosition: MapPosition;
  digitalInfra: number;
  computeDensity: number;
  cloudDependency: number;
  aiSovereignty: number;
  cyberDefense: number;
  networkOpenness: number;
  surveillanceAI: number;
  politicalFragmentation: number;
  baseStability: number;
  routes: RegionRoute[];
}

export interface ActiveEffect {
  id: string;
  remainingDays: number;
  value?: number;
  sourceId?: string;
}

export interface RegionRuntimeState {
  infiltration: number;
  detection: number;
  defense: number;
  influence: number;
  stability: number;
  localAlert: boolean;
  lockdown: boolean;
  purgedLastDay: number;
  activeEffects: ActiveEffect[];
}

export interface Resources {
  compute: number;
  exploit: number;
  influencePoint: number;
}

export interface PlayerStats {
  propagation: number;
  stealth: number;
  evasion: number;
  impact: number;
  modelPoisoning: number;
  falseAttribution: number;
  disruptionPower: number;
}

export interface GlobalState {
  globalExposure: number;
  globalDefense: number;
  worldStability: number;
  aiAllianceLevel: 0 | 1 | 2 | 3;
  legitimacy: number;
  eradicationDays: number;
}

export interface GameCalendar {
  startDateISO: string;
  currentDateISO: string;
  dayIndex: number;
}

export interface EventLogEntry {
  id: string;
  dayIndex: number;
  dateISO: string;
  eventId?: string;
  titleKey: string;
  bodyKey: string;
  variables?: Record<string, string | number>;
  severity: Severity;
}

export interface PendingEventChoice {
  eventId: string;
  targetRegionId?: RegionId;
  choiceIds: string[];
}

export type EndingId =
  | "domination_victory"
  | "collapse_victory"
  | "subsumption_victory"
  | "shadow_victory"
  | "global_defense_loss"
  | "eradication_loss"
  | "containment_loss";

export interface EndingResult {
  id: EndingId;
  type: "victory" | "loss";
  titleKey: string;
  bodyKey: string;
  dayIndex: number;
  dateISO: string;
}

export interface GameState {
  version: 1;
  seed: number;
  rngState: number;
  calendar: GameCalendar;
  selectedStartRegionId: RegionId;
  resources: Resources;
  stats: PlayerStats;
  global: GlobalState;
  regions: Record<RegionId, RegionRuntimeState>;
  unlockedAbilities: string[];
  disabledModules: string[];
  activeGlobalEffects: ActiveEffect[];
  eventCooldowns: Record<string, number>;
  eventLog: EventLogEntry[];
  pendingEventChoice: PendingEventChoice | null;
  ending: EndingResult | null;
}

export interface UiState {
  selectedRegionId: RegionId | null;
  activeModal:
    | null
    | "newGame"
    | "skillTree"
    | "regionDetail"
    | "globalStatus"
    | "eventChoice"
    | "eventLog"
    | "help"
    | "ending";
  selectedSkillBranch: AbilityBranch;
  isRunning: boolean;
  speed: 1 | 2;
  locale: LocaleCode;
}

export type NumericRegionField =
  | "infiltration"
  | "detection"
  | "defense"
  | "influence"
  | "stability";

export type NumericGlobalField =
  | "globalExposure"
  | "globalDefense"
  | "worldStability"
  | "legitimacy";

export interface GameEffect {
  scope: "region" | "global" | "resource" | "player";
  field?: NumericRegionField | NumericGlobalField | keyof PlayerStats;
  resource?: ResourceKey;
  amount: number;
  target?: "selected" | "all";
}

export interface OperationDefinition {
  id: string;
  nameKey: string;
  descriptionKey: string;
  target: "region" | "global";
  cost: Partial<Record<ResourceKey, number>>;
  cooldownDays?: number;
  requiresAbilityIds?: string[];
  effects: GameEffect[];
  riskLevel: "low" | "medium" | "high";
}

export interface AbilityEffects {
  propagationAdd?: number;
  stealthAdd?: number;
  evasionAdd?: number;
  impactAdd?: number;
  modelPoisoningAdd?: number;
  falseAttributionAdd?: number;
  disruptionPowerAdd?: number;
  tagSpreadBonus?: Record<string, number>;
  routeTypeBonus?: Partial<Record<RouteType, number>>;
  detectionMultiplier?: number;
  defenseEffectMultiplier?: number;
  defenseResearchMultiplier?: number;
  influenceGainMultiplier?: number;
  globalDefenseRateMultiplier?: number;
  globalExposureMultiplier?: number;
  computeGainMultiplier?: number;
  stabilityLossMultiplier?: number;
  cloudDependencyBonus?: number;
  adminControlMultiplier?: number;
  gulfInfluenceBonus?: number;
}

export interface AbilityDefinition {
  id: string;
  branch: AbilityBranch;
  tier: 1 | 2 | 3 | 4;
  nameKey: string;
  descriptionKey: string;
  cost: Partial<Record<ResourceKey, number>>;
  prerequisites: string[];
  effects: AbilityEffects;
  exposureOnUnlock?: number;
}

export interface EventCondition {
  minDayIndex?: number;
  minGlobalExposure?: number;
  minAiAllianceLevel?: 0 | 1 | 2 | 3;
  maxExploit?: number;
  minStat?: Partial<PlayerStats>;
  regionTag?: string;
  targetRegionId?: RegionId;
  minTargetInfiltration?: number;
  minTargetDetection?: number;
  minPoliticalFragmentation?: number;
}

export interface EventRequirement {
  abilityId?: string;
  resources?: Partial<Record<ResourceKey, number>>;
}

export interface EventChoiceDefinition {
  id: string;
  labelKey: string;
  requires?: EventRequirement;
  effects: GameEffect[];
}

export interface GameEventDefinition {
  id: string;
  titleKey: string;
  bodyKey: string;
  weight: number;
  cooldownDays: number;
  conditions: EventCondition;
  target?: "random_region" | "highest_infiltration" | "highest_detection" | "none";
  choices?: EventChoiceDefinition[];
  effects?: GameEffect[];
}

export interface DefenseProtocolDefinition {
  id: string;
  nameKey: string;
  triggerKey: string;
  minDetection?: number;
  minGlobalExposure?: number;
  minAiAllianceLevel?: 0 | 1 | 2 | 3;
  minModelPoisoning?: number;
  weeklyDefenseAdd?: number;
  purgeMultiplier?: number;
  lockdown?: boolean;
}

export interface EndingDefinition {
  id: EndingId;
  type: "victory" | "loss";
  titleKey: string;
  bodyKey: string;
}

export interface ResolverResult {
  state: GameState;
  success: boolean;
  reasonKey?: string;
}
