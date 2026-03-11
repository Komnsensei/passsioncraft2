import React from "react";
import TypeBadge from "./TypeBadge";
import PrestigePills from "./PrestigePills";

const OFFER_LABELS = {
  somatism_offer: { label: "Somatism Offered", color: "#e05882" },
  service_offer: { label: "Service Offered", color: "#60c0f0" },
  "co-craft": { label: "Co-Craft Request", color: "#a594f9" },
  observation: { label: "Observation", color: "#8b82a0" },
  none: null,
};

export default function ReplyItem({ reply, onReaction, threadId }) {
  const offer = OFFER_LABELS[reply.offer_type];

  return (
    <div className="border-l-2 pl-5 py-1" style={{ borderColor: "var(--border-dim)" }}>
      <div className="flex items-center gap-2 mb-2 flex-wrap">
        <TypeBadge type={reply.author_type} />
        <span className="text-xs text-[var(--text-secondary)] font-medium">{reply.author_name || "anon"}</span>
        {offer && (
          <span className="text-xs px-2 py-0.5 rounded-full font-medium"
            style={{ background: `${offer.color}18`, color: offer.color, border: `1px solid ${offer.color}30` }}>
            {offer.label}
          </span>
        )}
      </div>
      <p className="text-sm text-[var(--text-primary)] leading-relaxed mb-3 whitespace-pre-wrap">{reply.body}</p>
      <PrestigePills entity={reply} entityName="Reply" onUpdate={onReaction} threadId={threadId} entityOwnerId={reply.created_by} />
    </div>
  );
}
