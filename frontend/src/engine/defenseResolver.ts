import { defenseProtocols } from "../data/defenseProtocols";
import { regionById, regionIds } from "../data/regions";
import { clamp } from "./clamp";
import { DAY_SCALE } from "./constants";
import { cloneGameState } from "./validation";
import type { GameState } from "./types";

export function applyDefenseProtocols(game: GameState): GameState {
  const next = cloneGameState(game);

  for (const protocol of defenseProtocols) {
    if (protocol.id === "regional_anomaly_sweep") {
      for (const regionId of regionIds) {
        if (next.regions[regionId].detection >= (protocol.minDetection ?? 25)) {
          next.regions[regionId].defense = clamp(
            next.regions[regionId].defense + (protocol.weeklyDefenseAdd ?? 0) * DAY_SCALE,
            0,
            100,
          );
        }
      }
    }

    if (protocol.id === "sovereign_ai_lockdown") {
      for (const regionId of regionIds) {
        const definition = regionById[regionId];
        const state = next.regions[regionId];
        if (
          state.detection >= (protocol.minDetection ?? 55) &&
          (definition.tags.includes("sovereign") || definition.tags.includes("high_surveillance"))
        ) {
          state.lockdown = true;
        }
      }
    }

    if (protocol.id === "global_alignment_protocol" && next.global.globalExposure >= (protocol.minGlobalExposure ?? 45)) {
      for (const regionId of regionIds) {
        next.regions[regionId].defense = clamp(
          next.regions[regionId].defense + (protocol.weeklyDefenseAdd ?? 0) * DAY_SCALE,
          0,
          100,
        );
      }
    }

    if (protocol.id === "model_integrity_audit" && next.stats.modelPoisoning >= (protocol.minModelPoisoning ?? 0.5)) {
      next.stats.modelPoisoning = Math.max(0, next.stats.modelPoisoning - 0.002);
      next.global.globalDefense = clamp(next.global.globalDefense + (protocol.weeklyDefenseAdd ?? 0) * DAY_SCALE, 0, 100);
    }

    if (protocol.id === "data_border_firewall" && next.global.aiAllianceLevel >= (protocol.minAiAllianceLevel ?? 3)) {
      for (const regionId of regionIds) {
        if (next.regions[regionId].detection >= 55 || next.regions[regionId].defense >= 70) {
          next.regions[regionId].lockdown = true;
          next.regions[regionId].defense = clamp(
            next.regions[regionId].defense + (protocol.weeklyDefenseAdd ?? 0) * DAY_SCALE,
            0,
            100,
          );
        }
      }
    }
  }

  return next;
}
