import { clamp } from "../../engine/clamp";

interface ProgressBarProps {
  label: string;
  value: number;
  tone?: "default" | "danger" | "warning" | "success";
}

export function ProgressBar({ label, value, tone = "default" }: ProgressBarProps) {
  const normalized = clamp(value, 0, 100);
  return (
    <div className={`progress progress-${tone}`}>
      <div className="progress-row">
        <span>{label}</span>
        <strong>{normalized.toFixed(0)}%</strong>
      </div>
      <div className="progress-track" role="progressbar" aria-label={label} aria-valuemin={0} aria-valuemax={100} aria-valuenow={normalized}>
        <span style={{ width: `${normalized}%` }} />
      </div>
    </div>
  );
}
