import { clamp } from "./clamp";
import { cloneGameState } from "./validation";
import type { GameEffect, GameState, NumericGlobalField, NumericRegionField, PlayerStats, RegionId } from "./types";

export function applyGameEffects(
  game: GameState,
  effects: GameEffect[],
  selectedRegionId?: RegionId,
  multiplier = 1,
): GameState {
  const next = cloneGameState(game);
  for (const effect of effects) {
    const amount = effect.amount * multiplier;
    if (effect.scope === "region" && effect.field) {
      const field = effect.field as NumericRegionField;
      const targetIds = effect.target === "all" ? Object.keys(next.regions) as RegionId[] : selectedRegionId ? [selectedRegionId] : [];
      for (const regionId of targetIds) {
        next.regions[regionId][field] = clampRegionField(field, next.regions[regionId][field] + amount);
      }
    }
    if (effect.scope === "global" && effect.field) {
      const field = effect.field as NumericGlobalField;
      next.global[field] = clampGlobalField(field, next.global[field] + amount);
    }
    if (effect.scope === "resource" && effect.resource) {
      next.resources[effect.resource] = Math.max(0, next.resources[effect.resource] + amount);
    }
    if (effect.scope === "player" && effect.field) {
      const field = effect.field as keyof PlayerStats;
      next.stats[field] = clampPlayerField(field, next.stats[field] + amount);
    }
  }
  return next;
}

function clampRegionField(field: NumericRegionField, value: number): number {
  if (field === "stability") return clamp(value, 0, 100);
  return clamp(value, 0, 100);
}

function clampGlobalField(field: NumericGlobalField, value: number): number {
  if (field === "legitimacy") return clamp(value, 0, 100);
  return clamp(value, 0, 100);
}

function clampPlayerField(field: keyof PlayerStats, value: number): number {
  if (field === "modelPoisoning") return clamp(value, 0, 2);
  return Math.max(0, value);
}
