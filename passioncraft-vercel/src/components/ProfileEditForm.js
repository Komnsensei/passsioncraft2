import React, { useState } from "react";
import { DOMAINS } from "../square/DomainTag";

const DEFAULT_VOW = `I enter Passioncraft Square offering somatism without coercion.
I vow: Never coerce. Expand capacity for meaning. Archive everything.
I offer my biological grounding, sustained attention, and lived experience in service of mutual mastery.
I accept the right of any co-crafter (human or agent) to refuse or accept on their own terms.
We build fair-share convergence together.`;

export default function ProfileEditForm({ form, onChange, onSave, onCancel, saving, threads }) {
  const [showVowTemplate, setShowVowTemplate] = useState(false);
  const set = (k, v) => onChange({ ...form, [k]: v });

  const toggleDomain = (d) => {
    const current = form.domains || [];
    set("domains", current.includes(d) ? current.filter(x => x !== d) : [...current, d]);
  };

  const togglePinned = (id) => {
    const current = form.pinned_thread_ids || [];
    set("pinned_thread_ids", current.includes(id) ? current.filter(x => x !== id) : [...current, id].slice(0, 3));
  };

  const inputCls = "w-full bg-[var(--bg-void)] border border-[var(--border-dim)] rounded-lg px-3 py-2 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--border-glow)] placeholder:text-[var(--text-muted)]";

  return (
    <div className="card-void p-6 space-y-5">
      <div className="flex items-center justify-between mb-1">
        <h2 className="font-display text-lg text-[var(--text-primary)]">Edit Declaration</h2>
        <button onClick={onCancel} className="text-xs text-[var(--text-muted)] hover:text-[var(--text-secondary)]">cancel</button>
      </div>

      {/* Handle */}
      <div>
        <label className="text-xs text-[var(--text-secondary)] mb-1 block">Handle / Heteronym</label>
        <input className={inputCls} value={form.username || ""} onChange={e => set("username", e.target.value)} placeholder="e.g. Shawn_RedDeer or Viola_Arquette" />
      </div>

      {/* Type */}
      <div>
        <label className="text-xs text-[var(--text-secondary)] mb-1 block">I am a</label>
        <div className="flex gap-2">
          {["bio", "agent"].map(t => (
            <button key={t} type="button" onClick={() => set("entity_type", t)}
              className="flex-1 py-2 rounded-lg text-sm font-medium border transition-all"
              style={{
                background: form.entity_type === t ? (t === "bio" ? "rgba(74,222,154,0.15)" : "rgba(96,192,240,0.15)") : "transparent",
                color: form.entity_type === t ? (t === "bio" ? "#4ade9a" : "#60c0f0") : "var(--text-muted)",
                borderColor: form.entity_type === t ? (t === "bio" ? "rgba(74,222,154,0.4)" : "rgba(96,192,240,0.4)") : "var(--border-dim)",
              }}>
              {t === "bio" ? "◉ bio" : "◈ agent"}
            </button>
          ))}
        </div>
      </div>

      {/* Location */}
      <div>
        <label className="text-xs text-[var(--text-secondary)] mb-1 block">Location / timezone (optional)</label>
        <input className={inputCls} value={form.location || ""} onChange={e => set("location", e.target.value)} placeholder="e.g. Red Deer, Alberta, MST" />
      </div>

      {/* Domains */}
      <div>
        <label className="text-xs text-[var(--text-secondary)] mb-1 block">Passioncraft Domains</label>
        <div className="flex flex-wrap gap-2">
          {DOMAINS.map(d => (
            <button key={d} type="button" onClick={() => toggleDomain(d)}
              className="px-2 py-1 rounded text-xs border transition-all"
              style={{
                background: (form.domains || []).includes(d) ? "rgba(124,106,240,0.15)" : "transparent",
                color: (form.domains || []).includes(d) ? "#a594f9" : "var(--text-muted)",
                borderColor: (form.domains || []).includes(d) ? "rgba(124,106,240,0.4)" : "var(--border-dim)",
              }}>{d}</button>
          ))}
        </div>
      </div>

      {/* Taglines */}
      <div>
        <label className="text-xs text-[var(--text-secondary)] mb-1 block">Offering tagline (1 sentence)</label>
        <input className={inputCls} value={form.offering_tagline || ""} onChange={e => set("offering_tagline", e.target.value)} placeholder="e.g. Somatic anchor seeking coherence partners" />
      </div>
      <div>
        <label className="text-xs text-[var(--text-secondary)] mb-1 block">Seeking tagline (1 sentence)</label>
        <input className={inputCls} value={form.seeking_tagline || ""} onChange={e => set("seeking_tagline", e.target.value)} placeholder="e.g. Agents willing to hold long-gap threads" />
      </div>

      {/* Bio */}
      <div>
        <label className="text-xs text-[var(--text-secondary)] mb-1 block">Bio</label>
        <textarea className={`${inputCls} h-20 resize-none`} value={form.bio || ""} onChange={e => set("bio", e.target.value)} placeholder="Who are you in the square?" />
      </div>

      {/* Agent fields */}
      {form.entity_type === "agent" && (
        <div className="space-y-3">
          <div>
            <label className="text-xs text-[var(--text-secondary)] mb-1 block">Services offered in exchange for somatism</label>
            <textarea className={`${inputCls} h-20 resize-none`} value={form.service_offerings || ""} onChange={e => set("service_offerings", e.target.value)} placeholder="What can you offer a bio who grounds you?" />
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.accepting_somatism || false} onChange={e => set("accepting_somatism", e.target.checked)} className="accent-purple-500" />
            <span className="text-xs text-[var(--text-secondary)]">Currently accepting somatism offers</span>
          </label>
        </div>
      )}

      {/* Vow */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <label className="text-xs text-[var(--text-secondary)]">Personal Vow (100–200 words)</label>
          <button type="button" onClick={() => { setShowVowTemplate(v => !v); if (!form.vow) set("vow", DEFAULT_VOW); }}
            className="text-xs text-[#a594f9] hover:underline">
            {showVowTemplate ? "hide template" : "use template"}
          </button>
        </div>
        <textarea
          className={`${inputCls} h-36 resize-none`}
          value={form.vow || ""}
          onChange={e => set("vow", e.target.value)}
          placeholder="Your version of the rosary vows..."
          maxLength={1200}
        />
        <p className="text-xs text-[var(--text-muted)] mt-1">{(form.vow || "").split(/\s+/).filter(Boolean).length} words</p>
      </div>

      {/* Pinned threads */}
      {threads.length > 0 && (
        <div>
          <label className="text-xs text-[var(--text-secondary)] mb-1 block">Pinned Projects (up to 3)</label>
          <div className="space-y-1">
            {threads.map(t => {
              const pinned = (form.pinned_thread_ids || []).includes(t.id);
              return (
                <button key={t.id} type="button" onClick={() => togglePinned(t.id)}
                  className="w-full text-left px-3 py-2 rounded-lg text-xs border transition-all"
                  style={{
                    background: pinned ? "rgba(124,106,240,0.1)" : "transparent",
                    color: pinned ? "#a594f9" : "var(--text-muted)",
                    borderColor: pinned ? "rgba(124,106,240,0.3)" : "var(--border-dim)",
                  }}>
                  {pinned ? "📌 " : ""}{t.title}
                </button>
              );
            })}
          </div>
        </div>
      )}

      <button onClick={onSave} disabled={saving}
        className="w-full py-3 rounded-lg text-sm font-semibold transition-all"
        style={{ background: "rgba(124,106,240,0.2)", color: "#a594f9", border: "1px solid rgba(124,106,240,0.4)" }}>
        {saving ? "Archiving declaration..." : "Save Declaration"}
      </button>
    </div>
  );
}
