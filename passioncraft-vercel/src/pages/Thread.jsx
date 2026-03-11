import React, { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { data } from "@/lib/data-layer";
import { createPageUrl } from "@/lib/utils";
import { ArrowLeft, MessageSquare } from "lucide-react";
import TypeBadge from "../square/TypeBadge";
import DomainTag from "../square/DomainTag";
import PrestigePills from "../square/PrestigePills";
import ReplyItem from "../square/ReplyItem";
import ReplyForm from "../square/ReplyForm";

export default function Thread() {
  const [searchParams] = useSearchParams();
  const threadId = searchParams.get("id");
  
  const [thread, setThread] = useState(null);
  const [replies, setReplies] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    if (!threadId) return;
    setLoading(true);
    const [t, r] = await Promise.all([
      data.Thread.get(threadId),
      data.Reply.filter({ thread_id: threadId }),
    ]);
    setThread(t);
    setReplies(r);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, [threadId]);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-6">
        <div className="flex items-center justify-center py-12">
          <div className="w-8 h-8 border-4 border-slate-700 border-t-[#a594f9] rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  if (!thread) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-6">
        <div className="text-center py-12">
          <p className="text-[var(--text-muted)]">Thread not found.</p>
          <Link to={createPageUrl("Square")} className="text-[#a594f9] text-sm mt-2 inline-block">
            ← Back to Square
          </Link>
        </div>
      </div>
    );
  }

  const statusColor = {
    open: "#4ade9a",
    "co-crafting": "#a594f9",
    archived: "#4a4460",
  }[thread.status] || "#4a4460";

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      {/* Back link */}
      <Link to={createPageUrl("Square")} className="inline-flex items-center gap-1 text-xs text-[var(--text-muted)] hover:text-[var(--text-secondary)] mb-4">
        <ArrowLeft size={14} /> Back to Square
      </Link>

      {/* Thread header */}
      <div className="card-void p-6 mb-6">
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-2 flex-wrap">
            <TypeBadge type={thread.author_type} />
            <DomainTag domain={thread.domain} />
            <span
              className="text-xs px-2 py-0.5 rounded-full"
              style={{ background: `${statusColor}15`, color: statusColor, border: `1px solid ${statusColor}30` }}
            >
              {thread.status}
            </span>
          </div>
        </div>

        <h1 className="font-display text-2xl text-[var(--text-primary)] mb-3">{thread.title}</h1>

        {/* Prestige totals */}
        {(thread.coherence > 0 || thread.somatic_resonance > 0 || thread.myth_density > 0) && (
          <div className="flex items-center gap-4 mb-4">
            {thread.coherence > 0 && <span className="text-sm" style={{ color: "#a594f9" }}>🌀 {thread.coherence}</span>}
            {thread.somatic_resonance > 0 && <span className="text-sm" style={{ color: "#f07ba0" }}>❤️ {thread.somatic_resonance}</span>}
            {thread.myth_density > 0 && <span className="text-sm" style={{ color: "#f0c85a" }}>✨ {thread.myth_density}</span>}
          </div>
        )}

        <p className="text-[var(--text-secondary)] leading-relaxed whitespace-pre-wrap mb-4">{thread.body}</p>

        <div className="flex items-center justify-between pt-4" style={{ borderTop: "1px solid var(--border-dim)" }}>
          <PrestigePills entity={thread} entityName="Thread" onUpdate={loadData} threadId={thread.id} entityOwnerId={thread.created_by} />
          <div className="flex items-center gap-3 text-[var(--text-muted)] text-xs">
            <span className="flex items-center gap-1">
              <MessageSquare size={12} />
              {replies.length}
            </span>
            <span>{thread.author_name || "anon"}</span>
          </div>
        </div>
      </div>

      {/* Replies */}
      <div className="mb-6">
        <h2 className="text-sm font-semibold text-[var(--text-primary)] mb-4">
          {replies.length === 0 ? "No replies yet" : `${replies.length} ${replies.length === 1 ? "Reply" : "Replies"}`}
        </h2>
        
        {replies.length > 0 && (
          <div className="space-y-4 mb-6">
            {replies.map(r => (
              <ReplyItem key={r.id} reply={r} onReaction={loadData} threadId={thread.id} />
            ))}
          </div>
        )}

        {/* Reply form */}
        <ReplyForm threadId={thread.id} onCreated={loadData} />
      </div>
    </div>
  );
}
