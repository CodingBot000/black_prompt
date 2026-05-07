import { useEffect } from "react";

interface ModalProps {
  title: string;
  children: React.ReactNode;
  closeLabel: string;
  onClose?: () => void;
  locked?: boolean;
  wide?: boolean;
}

export function Modal({ title, children, closeLabel, onClose, locked = false, wide = false }: ModalProps) {
  useEffect(() => {
    if (locked || !onClose) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [locked, onClose]);

  return (
    <div className="modal-backdrop" role="presentation">
      <section className={`modal ${wide ? "modal-wide" : ""}`} role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <header className="modal-header">
          <h2 id="modal-title">{title}</h2>
          {!locked && onClose ? (
            <button type="button" className="icon-button" onClick={onClose} aria-label={closeLabel}>
              x
            </button>
          ) : null}
        </header>
        <div className="modal-body">{children}</div>
      </section>
    </div>
  );
}
