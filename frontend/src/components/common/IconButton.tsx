interface IconButtonProps {
  label: string;
  icon: string;
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
}

export function IconButton({ label, icon, onClick, active = false, disabled = false }: IconButtonProps) {
  return (
    <button
      type="button"
      className={`icon-button ${active ? "is-active" : ""}`}
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      title={label}
    >
      {icon}
    </button>
  );
}
