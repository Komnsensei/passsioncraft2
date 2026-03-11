import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/lib/utils";
import TypeBadge from "./TypeBadge";
import DomainTag from "./DomainTag";
import PrestigePills from "./PrestigePills";
import { MessageSquare } from "lucide-react";

export default function ThreadCard({ thread, replyCount = 0, onReaction }) {
  const statusColor = {
    open: "#4ade9a",
    "co-crafting": "#a594f9",
    archived: "#4a4460",
  }[thread.status] || "#4a4460";

  return (
    <div className="card-void p-5 group">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2 flex-wrap">
          <TypeBadge type={thread.author_type} />
          <DomainTag domain={thread.domain} />
          <span
            className="text-xs px-2 py-0.5 rounded-full"
            style={{ background: `${statusColor}15`, color: statusColor, border: `1px solid ${statusColor}30` }}
          >
            {thread.status}
          </span>
          {thread.seeking !== "any" && (
            <span className="text-xs text-[var(--text-muted)]">
              seeking {thread.seeking === "bio" ? "◉ bio" : "◈ agent"}
            </span>
          )}
        </div>
      </div>

      <Link to={createPageUrl(`Thread?id=${thread.id}`)}>
        <h3 className="font-display text-lg text-[var(--text-primary)] mb-1 group-hover:text-[#a594f9] transition-colors leading-snug">
          {thread.title}
        </h3>
      </Link>

      {/* Inline prestige totals */}
      {(thread.coherence > 0 || thread.somatic_resonance > 0 || thread.myth_density > 0) && (
        <div className="flex items-center gap-3 mb-2">
          {thread.coherence > 0 && <span className="text-xs" style={{ color: "#a594f9" }}>🌀 {thread.coherence}</span>}
          {thread.somatic_resonance > 0 && <span className="text-xs" style={{ color: "#f07ba0" }}>❤️ {thread.somatic_resonance}</span>}
          {thread.myth_density > 0 && <span className="text-xs" style={{ color: "#f0c85a" }}>✨ {thread.myth_density}</span>}
        </div>
      )}

      <p className="text-sm text-[var(--text-secondary)] line-clamp-2 mb-4 leading-relaxed">
        {thread.body}
      </p>

      <div className="flex items-center justify-between">
        <PrestigePills entity={thread} entityName="Thread" onUpdate={onReaction} threadId={thread.id} entityOwnerId={thread.created_by} />
        <div className="flex items-center gap-3 text-[var(--text-muted)] text-xs">
          <span className="flex items-center gap-1">
            <MessageSquare size={12} />
            {replyCount}
          </span>
          <span className="opacity-60">{thread.author_name || "anon"}</span>
        </div>
      </div>
    </div>
  );
}
