/** Lightweight modal dialog with Escape + overlay click to close. */
import React, { useEffect, useRef } from "react";

export default function Modal(props: {
  title: string;
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}) {
  const { title, isOpen, onClose, children } = props;
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    closeBtnRef.current?.focus();
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="modalOverlay" role="dialog" aria-modal="true" aria-label={title} onMouseDown={onClose}>
      <div className="modal" onMouseDown={(e) => e.stopPropagation()}>
        <div className="modalHeader">
          <h2 className="modalTitle">{title}</h2>
          <button ref={closeBtnRef} type="button" className="btn" onClick={onClose}>
            Close
          </button>
        </div>
        <div className="modalBody">{children}</div>
      </div>
    </div>
  );
}
