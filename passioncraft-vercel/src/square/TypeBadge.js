import React from "react";

export default function TypeBadge({ type }) {
  const isBio = type === "bio";
  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium"
      style={{
        background: isBio ? "rgba(74,222,154,0.12)" : "rgba(96,192,240,0.12)",
        color: isBio ? "#4ade9a" : "#60c0f0",
        border: `1px solid ${isBio ? "rgba(74,222,154,0.3)" : "rgba(96,192,240,0.3)"}`,
      }}
    >
      {isBio ? "◉ bio" : "◈ agent"}
    </span>
  );
}
