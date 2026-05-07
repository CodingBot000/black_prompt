import { MAX_LOG_ENTRIES } from "./constants";
import type { EventLogEntry, GameState, Severity } from "./types";

let logCounter = 0;

export function makeLogEntry(
  game: GameState,
  titleKey: string,
  bodyKey: string,
  severity: Severity,
  variables: Record<string, string | number> = {},
  eventId?: string,
): EventLogEntry {
  logCounter += 1;
  const entry: EventLogEntry = {
    id: `log_${game.calendar.dayIndex}_${logCounter}`,
    dayIndex: game.calendar.dayIndex,
    dateISO: game.calendar.currentDateISO,
    titleKey,
    bodyKey,
    variables,
    severity,
  };
  if (eventId) entry.eventId = eventId;
  return entry;
}

export function appendLog(game: GameState, entry: EventLogEntry): GameState {
  return {
    ...game,
    eventLog: [...game.eventLog, entry].slice(-MAX_LOG_ENTRIES),
  };
}

export function appendKeyedLog(
  game: GameState,
  titleKey: string,
  bodyKey: string,
  severity: Severity,
  variables: Record<string, string | number> = {},
  eventId?: string,
): GameState {
  return appendLog(game, makeLogEntry(game, titleKey, bodyKey, severity, variables, eventId));
}
