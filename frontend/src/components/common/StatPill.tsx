interface StatPillProps {
  label: string;
  value: string | number;
  tone?: "default" | "danger" | "warning" | "success";
}

export function StatPill({ label, value, tone = "default" }: StatPillProps) {
  return (
    <span className={`stat-pill stat-pill-${tone}`}>
      <span>{label}</span>
      <strong>{value}</strong>
    </span>
  );
}
