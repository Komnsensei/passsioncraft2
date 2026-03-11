import React, { useState, useEffect } from "react";
import { data } from '@/lib/data-layer';

const PILLS = [
  { field: "coherence",          symbol: "🌀", label: "+Coherence",        color: "#a594f9", bg: "rgba(124,106,240,0.12)", border: "rgba(124,106,240,0.3)" },
  { field: "somatic_resonance",  symbol: "❤️",  label: "+Somatic Resonance", color: "#f07ba0", bg: "rgba(224,88,130,0.12)",  border: "rgba(224,88,130,0.3)" },
  { field: "myth_density",       symbol: "✨",  label: "+Myth Density",     color: "#f0c85a", bg: "rgba(240,184,74,0.12)",  border: "rgba(240,184,74,0.3)" },
];

const DAILY_LIMIT = 3; // awards per user per day per thread

export default function PrestigePills({ entity, entityName, onUpdate, threadId, entityOwnerId }) {
  const [user, setUser] = useState(null);
  const [myAwards, setMyAwards] = useState([]); // today's awards from me on this thread
  const [activeField, setActiveField] = useState(null); // which pill is open for comment
  const [comment, setComment] = useState("");
  const [busy, setBusy] = useState(false);
  const [recentAwards, setRecentAwards] = useState([]);
  const [showLog, setShowLog] = useState(false);

  useEffect(() => {
    data.auth.me().then(u => {
      setUser(u);
      loadMyAwards(u.email);
    }).catch(() => {});
    loadRecentAwards();
  }, [entity.id]);

  const loadMyAwards = async (email) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const logs = await data.AwardLog.filter({
      entity_id: entity.id,
      from_user: email,
    });
    const todayLogs = logs.filter(l => new Date(l.created_date) >= today);
    setMyAwards(todayLogs);
  };

  const loadRecentAwards = async () => {
    const logs = await data.AwardLog.filter({ entity_id: entity.id }, "-created_date", 5);
    setRecentAwards(logs);
  };

  const canAward = () => {
    if (!user) return false;
    // no self-award
    if (entityOwnerId && user.email === entityOwnerId) return false;
    // daily limit
    if (myAwards.length >= DAILY_LIMIT) return false;
    return true;
  };

  const award = async (field) => {
    if (!canAward()) return;
    if (busy) return;
    setBusy(true);

    try {
      const updated = { [field]: (entity[field] || 0) + 1 };
      await data.entities[entityName].update(entity.id, updated);
      await data.AwardLog.create({
        entity_id: entity.id,
        entity_name: entityName,
        thread_id: threadId || entity.id,
        field,
        from_user: user.email,
        to_user: entityOwnerId || "",
        comment: comment.trim(),
      });

      setComment("");
      setActiveField(null);
      await loadMyAwards(user.email);
      await loadRecentAwards();
      onUpdate && onUpdate();
    } catch (error) {
      console.error('Error awarding:', error);
    }
    setBusy(false);
  };

  const alreadyAwardedField = (field) => myAwards.some(a => a.field === field);
  const remainingToday = DAILY_LIMIT - myAwards.length;

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 flex-wrap">
        {PILLS.map(p => {
          const awarded = alreadyAwardedField(p.field);
          const blocked = !canAward() || awarded;
          const isOpen = activeField === p.field;
          return (
            <button
              key={p.field}
              onClick={() => {
                if (blocked) return;
                setActiveField(isOpen ? null : p.field);
                setComment("");
              }}
              className="prestige-pill"
              title={blocked ? (awarded ? "Already awarded today" : !user ? "Sign in to award" : entityOwnerId === user?.email ? "Can't self-award" : `${remainingToday} awards left today`) : p.label}
              style={{
                background: awarded ? `${p.bg.replace("0.12)", "0.22)")}` : p.bg,
                color: p.color,
                borderColor: isOpen ? p.color : p.border,
                opacity: !canAward() && !awarded ? 0.5 : 1,
                cursor: blocked ? "default" : "pointer",
                outline: isOpen ? `1px solid ${p.color}` : "none",
              }}
            >
              {p.symbol} {entity[p.field] || 0}
              {awarded && <span className="ml-1 opacity-60">✓</span>}
            </button>
          );
        })}

        {/* daily counter */}
        {user && canAward() && (
          <span className="text-xs text-[var(--text-muted)]">{remainingToday} left today</span>
        )}

        {/* log toggle */}
        {recentAwards.length > 0 && (
          <button onClick={() => setShowLog(v => !v)}
            className="text-xs text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors ml-1">
            {showLog ? "hide log" : `${recentAwards.length} award${recentAwards.length > 1 ? "s" : ""}`}
          </button>
        )}
      </div>

      {/* Comment popover */}
      {activeField && (
        <div className="rounded-xl p-3 text-xs flex gap-2 items-end" style={{ background: "var(--bg-card)", border: "1px solid var(--border-glow)" }}>
          <div className="flex-1">
            <input
              className="w-full bg-transparent border-b text-[var(--text-secondary)] placeholder:text-[var(--text-muted)] focus:outline-none text-xs pb-1"
              style={{ borderColor: "var(--border-dim)" }}
              value={comment}
              onChange={e => setComment(e.target.value)}
              placeholder={`Optional: why +${PILLS.find(p => p.field === activeField)?.label}?`}
              maxLength={120}
              onKeyDown={e => e.key === "Enter" && award(activeField)}
            />
          </div>
          <button onClick={() => award(activeField)} disabled={busy}
            className="px-3 py-1 rounded-lg font-medium transition-all text-xs"
            style={{ background: "rgba(124,106,240,0.2)", color: "#a594f9", border: "1px solid rgba(124,106,240,0.4)" }}>
            {busy ? "…" : "Award"}
          </button>
          <button onClick={() => setActiveField(null)} className="text-[var(--text-muted)] hover:text-[var(--text-secondary)] px-1">✕</button>
        </div>
      )}

      {/* Public log */}
      {showLog && recentAwards.length > 0 && (
        <div className="space-y-1 pl-1">
          {recentAwards.map(a => {
            const pill = PILLS.find(p => p.field === a.field);
            return (
              <div key={a.id} className="text-xs text-[var(--text-muted)] flex items-start gap-1">
                <span style={{ color: pill?.color }}>{pill?.symbol}</span>
                <span className="text-[var(--text-secondary)]">{a.from_user.split("@")[0]}</span>
                {a.comment && <span className="italic">— {a.comment}</span>}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
