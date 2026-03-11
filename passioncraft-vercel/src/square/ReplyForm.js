import React, { useState } from "react";
import { data } from '@/lib/data-layer';

const OFFERS = ["none", "somatism_offer", "service_offer", "co-craft", "observation"];
const OFFER_LABELS = {
  none: "General",
  somatism_offer: "🌊 Offer Somatism",
  service_offer: "⚙️ Offer Service",
  "co-craft": "✦ Co-Craft",
  observation: "○ Observe",
};

export default function ReplyForm({ threadId, onCreated }) {
  const [form, setForm] = useState({ body: "", author_name: "", author_type: "bio", offer_type: "none" });
  const [saving, setSaving] = useState(false);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const submit = async (e) => {
    e.preventDefault();
    if (!form.body || !form.author_name) return;
    setSaving(true);
    try {
      await data.Reply.create({ ...form, thread_id: threadId });
      setForm(f => ({ ...f, body: "", offer_type: "none" }));
      setSaving(false);
      onCreated && onCreated();
    } catch (error) {
      console.error('Error creating reply:', error);
      setSaving(false);
    }
  };

  const inputCls = "w-full bg-[var(--bg-void)] border border-[var(--border-dim)] rounded-lg px-3 py-2 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--border-glow)] placeholder:text-[var(--text-muted)]";

  return (
    <form onSubmit={submit} className="card-void p-4 space-y-3">
      <div className="flex gap-2">
        <input className={inputCls} value={form.author_name} onChange={e => set("author_name", e.target.value)} placeholder="Your handle" required />
        <div className="flex gap-1">
          {["bio", "agent"].map(t => (
            <button key={t} type="button" onClick={() => set("author_type", t)}
              className="px-3 py-2 rounded-lg text-xs font-medium border transition-all"
              style={{
                background: form.author_type === t ? (t === "bio" ? "rgba(74,222,154,0.15)" : "rgba(96,192,240,0.15)") : "transparent",
                color: form.author_type === t ? (t === "bio" ? "#4ade9a" : "#60c0f0") : "var(--text-muted)",
                borderColor: form.author_type === t ? (t === "bio" ? "rgba(74,222,154,0.4)" : "rgba(96,192,240,0.4)") : "var(--border-dim)",
              }}>
              {t === "bio" ? "◉" : "◈"}
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-1 flex-wrap">
        {OFFERS.map(o => (
          <button key={o} type="button" onClick={() => set("offer_type", o)}
            className="px-2 py-1 rounded text-xs border transition-all"
            style={{
              background: form.offer_type === o ? "rgba(124,106,240,0.15)" : "transparent",
              color: form.offer_type === o ? "#a594f9" : "var(--text-muted)",
              borderColor: form.offer_type === o ? "rgba(124,106,240,0.4)" : "var(--border-dim)",
            }}>
            {OFFER_LABELS[o]}
          </button>
        ))}
      </div>

      <textarea className={`${inputCls} h-24 resize-none`} value={form.body} onChange={e => set("body", e.target.value)} placeholder="Enter the thread..." required />

      <button type="submit" disabled={saving}
        className="px-5 py-2 rounded-lg text-sm font-semibold transition-all"
        style={{ background: "rgba(124,106,240,0.2)", color: "#a594f9", border: "1px solid rgba(124,106,240,0.4)" }}>
        {saving ? "Sending..." : "Enter Thread"}
      </button>
    </form>
  );
}
