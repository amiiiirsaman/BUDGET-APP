import React from "react";
import Modal from "./Modal";
import { tipOfTheDay } from "../utils/tips";

export default function TipOfTheDayModal(props: { isOpen: boolean; onClose: () => void }) {
  const { isOpen, onClose } = props;

  const { isoDate, tip } = tipOfTheDay();

  return (
    <Modal title="Tip of the Day" isOpen={isOpen} onClose={onClose}>
      <p style={{ marginTop: 0 }}>{tip.text}</p>
      <p className="muted" style={{ marginBottom: 0 }}>
        Selected for {isoDate} (local date)
      </p>
      {tip.links?.length ? (
        <div style={{ marginTop: 10 }}>
          <div className="muted" style={{ marginBottom: 6 }}>
            Learn more
          </div>
          <ul style={{ margin: 0, paddingLeft: 18 }}>
            {tip.links.map((l) => (
              <li key={l.href}>
                <a href={l.href} target="_blank" rel="noreferrer">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </Modal>
  );
}
