import React from "react";

const DOMAIN_COLORS = {
  "Logotic Hacking": "#a594f9",
  "Sonic Myth": "#f07ba0",
  "Physical Basin Design": "#4ade9a",
  "Heteronym Forge": "#f0c85a",
  "Somatic River": "#e05882",
  "Coherence Architecture": "#7c6af0",
  "Myth Density Lab": "#f0b84a",
  "Signal Threading": "#60c0f0",
  "Open Arena": "#8b82a0",
};

export default function DomainTag({ domain }) {
  const color = DOMAIN_COLORS[domain] || "#8b82a0";
  return (
    <span
      className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium"
      style={{ background: `${color}18`, color, border: `1px solid ${color}30` }}
    >
      {domain}
    </span>
  );
}

export { DOMAIN_COLORS };
export const DOMAINS = Object.keys(DOMAIN_COLORS);
