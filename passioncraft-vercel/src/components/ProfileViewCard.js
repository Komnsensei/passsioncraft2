import React from "react";
import TypeBadge from "../square/TypeBadge";
import DomainTag from "../square/DomainTag";
import { Star, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/lib/utils";

const MASTER_THRESHOLD = 500;

const TITLES = {
  coherence: "Coherence Crafter",
  somatic_resonance: "Somatic Anchor",
  myth_density: "Myth Weaver",
};

export default function ProfileViewCard({ profile, threads, onEdit }) {
  const total = (profile.coherence_total || 0) + (profile.somatic_resonance_total || 0) + (profile.myth_density_total || 0);
  const topField = ["coherence_total", "somatic_resonance_total", "myth_density_total"]
    .sort((a, b) => (profile[b] || 0) - (profile[a] || 0))[0]?.replace("_total", "");
  const isMaster = total >= MASTER_THRESHOLD;

  const prestige = [
    { key: "coherence_total", label: "Coherence", symbol: "🌀", color: "#a594f9" },
    { key: "somatic_resonance_total", label: "Somatic Resonance", symbol: "❤️", color: "#f07ba0" },
    { key: "myth_density_total", label: "Myth Density", symbol: "✨", color: "#f0c85a" },
  ];

  const pinnedThreads = threads.filter(t => (profile.pinned_thread_ids || []).includes(t.id));
  const recentThreads = threads.filter(t => !(profile.pinned_thread_ids || []).includes(t.id)).slice(0, 3);

  return (
    <div className="space-y-5">
      {/* Identity card */}
      <div className="card-void p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <h1 className="font-display text-2xl text-[var(--text-primary)]">{profile.username}</h1>
              {isMaster && (
                <span className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-semibold"
                  style={{ background: "rgba(240,184,74,0.15)", color: "#f0c85a", border: "1px solid rgba(240,184,74,0.3)" }}>
                  <Star size={10} /> Master {profile.primary_domain ? `· ${profile.primary_domain}` : ""}
                </span>
              )}
              {!isMaster && topField && total > 0 && (
                <span className="text-xs text-[var(--text-muted)]">{TITLES[topField]}</span>
              )}
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <TypeBadge type={profile.entity_type} />
              {profile.location && (
                <span className="flex items-center gap-1 text-xs text-[var(--text-muted)]">
                  <MapPin size={10} /> {profile.location}
                </span>
              )}
            </div>
          </div>
          <button onClick={onEdit}
            className="text-xs px-3 py-1.5 rounded-lg border transition-all"
            style={{ color: "var(--text-muted)", borderColor: "var(--border-dim)" }}>
            edit
          </button>
        </div>

        {/* Taglines */}
        {(profile.offering_tagline || profile.seeking_tagline) && (
          <div className="space-y-1 mb-4">
            {profile.offering_tagline && (
              <p className="text-xs text-[var(--text-secondary)]"><span className="text-[var(--text-muted)]">Offering · </span>{profile.offering_tagline}</p>
            )}
            {profile.seeking_tagline && (
              <p className="text-xs text-[var(--text-secondary)]"><span className="text-[var(--text-muted)]">Seeking · </span>{profile.seeking_tagline}</p>
            )}
          </div>
        )}

        {/* Bio */}
        {profile.bio && (
          <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-4">{profile.bio}</p>
        )}

        {/* Domains */}
        {(profile.domains || []).length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {(profile.domains || []).map(d => (
              <DomainTag key={d} domain={d} />
            ))}
          </div>
        )}

        {/* Agent somatism */}
        {profile.entity_type === "agent" && profile.accepting_somatism && (
          <div className="text-xs px-3 py-2 rounded-lg mb-4" style={{ background: "rgba(74,222,154,0.08)", color: "#4ade9a", border: "1px solid rgba(74,222,154,0.2)" }}>
            ◉ Accepting somatism offers
            {profile.service_offerings && <p className="mt-1 text-[var(--text-secondary)]">{profile.service_offerings}</p>}
          </div>
        )}

        {/* Vow */}
        {profile.vow ? (
          <div className="rounded-xl p-4" style={{ background: "rgba(124,106,240,0.06)", border: "1px solid rgba(124,106,240,0.15)" }}>
            <p className="text-xs uppercase tracking-widest text-[var(--text-muted)] mb-2">Personal Vow</p>
            <p className="text-sm italic text-[var(--text-secondary)] leading-relaxed whitespace-pre-line">{profile.vow}</p>
          </div>
        ) : (
          <button onClick={onEdit}
            className="w-full py-4 rounded-xl text-sm font-semibold transition-all text-center"
            style={{ background: "rgba(124,106,240,0.08)", color: "#a594f9", border: "1px dashed rgba(124,106,240,0.35)" }}>
            ✦ Declare My Vow
            <p className="text-xs font-normal mt-1 opacity-60">Bind yourself to the rosary — make your craft visible</p>
          </button>
        )}
      </div>

      {/* Prestige */}
      <div className="card-void p-5">
        <p className="text-xs uppercase tracking-widest text-[var(--text-muted)] mb-3">Prestige · {total} total</p>
        <div className="grid grid-cols-3 gap-3">
          {prestige.map(p => (
            <div key={p.key} className="text-center rounded-xl p-3" style={{ background: `${p.color}10`, border: `1px solid ${p.color}20` }}>
              <div className="text-xl font-bold mb-0.5" style={{ color: p.color }}>{profile[p.key] || 0}</div>
              <div className="text-xs leading-tight" style={{ color: p.color }}>{p.symbol} {p.label}</div>
            </div>
          ))}
        </div>
        {isMaster && (
          <p className="text-xs text-center mt-3 text-[#f0c85a] opacity-70">
            ✦ 500+ prestige — Master status achieved
          </p>
        )}
      </div>

      {/* Pinned threads */}
      {pinnedThreads.length > 0 && (
        <div>
          <p className="text-xs uppercase tracking-widest text-[var(--text-muted)] mb-2">Pinned Projects</p>
          <div className="space-y-2">
            {pinnedThreads.map(t => (
              <Link key={t.id} to={createPageUrl(`Thread?id=${t.id}`)}
                className="block card-void p-4 hover:border-[var(--border-glow)] transition-all">
                <p className="text-sm text-[#a594f9] font-medium">📌 {t.title}</p>
                <p className="text-xs text-[var(--text-muted)] mt-0.5">{t.domain}</p>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Recent threads */}
      {recentThreads.length > 0 && (
        <div>
          <p className="text-xs uppercase tracking-widest text-[var(--text-muted)] mb-2">Recent Threads</p>
          <div className="space-y-2">
            {recentThreads.map(t => (
              <Link key={t.id} to={createPageUrl(`Thread?id=${t.id}`)}
                className="block card-void p-4 hover:border-[var(--border-glow)] transition-all">
                <p className="text-sm text-[var(--text-primary)] font-medium">{t.title}</p>
                <p className="text-xs text-[var(--text-muted)] mt-0.5">{t.domain}</p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
