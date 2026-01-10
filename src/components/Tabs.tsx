/** Small tab switcher used to navigate between app views. */
import React from "react";

export default function Tabs<T extends string>(props: {
  value: T;
  onChange: (next: T) => void;
  items: Array<{ key: T; label: string }>;
}) {
  const { value, onChange, items } = props;

  return (
    <div className="tabs" role="tablist" aria-label="Main views">
      {items.map((it) => {
        const active = it.key === value;
        return (
          <button
            key={it.key}
            type="button"
            role="tab"
            aria-selected={active}
            className={`tabBtn ${active ? "isActive" : ""}`}
            onClick={() => onChange(it.key)}
          >
            {it.label}
          </button>
        );
      })}
    </div>
  );
}
