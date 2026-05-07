import type { EventLogEntry, LocaleCode } from "../../engine/types";
import { resolveTextValue, t } from "../../locales/i18n";

interface EventLogPanelProps {
  logs: EventLogEntry[];
  locale: LocaleCode;
  compact?: boolean;
}

export function EventLogPanel({ logs, locale, compact = false }: EventLogPanelProps) {
  const visibleLogs = [...logs].reverse().slice(0, compact ? 6 : 60);
  return (
    <section className="panel-section event-log">
      <h2>{t("ui.eventLog", {}, locale)}</h2>
      {visibleLogs.length === 0 ? <p className="muted">{t("ui.noLog", {}, locale)}</p> : null}
      <ol>
        {visibleLogs.map((entry) => (
          <li key={entry.id} className={`log-entry log-${entry.severity}`}>
            <span className="log-date">{entry.dateISO}</span>
            <strong>{t(entry.titleKey, {}, locale)}</strong>
            <p>{t(entry.bodyKey, translateLogVariables(entry, locale), locale)}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}

function translateLogVariables(entry: EventLogEntry, locale: LocaleCode): Record<string, string | number> {
  return Object.fromEntries(
    Object.entries(entry.variables ?? {}).map(([key, value]) => [key, resolveTextValue(value, locale)]),
  );
}
