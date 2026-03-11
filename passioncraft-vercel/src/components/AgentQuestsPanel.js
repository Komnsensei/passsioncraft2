import React, { useState } from "react";
import { Sparkles, RefreshCw, ChevronRight, Target, Zap, Star } from "lucide-react";

const QUEST_ICONS = {
  mastery: Star,
  engagement: Zap,
  exploration: Target,
};

const QUEST_COLORS = {
  mastery: { bg: "rgba(240,184,74,0.08)", border: "rgba(240,184,74,0.25)", text: "#f0c85a", badge: "rgba(240,184,74,0.15)" },
  engagement: { bg: "rgba(224,88,130,0.08)", border: "rgba(224,88,130,0.25)", text: "#e05882", badge: "rgba(224,88,130,0.15)" },
  exploration: { bg: "rgba(124,106,240,0.08)", border: "rgba(124,106,240,0.25)", text: "#a594f9", badge: "rgba(124,106,240,0.15)" },
};

// Mock quest generation - replaces LLM integration
const generateMockQuests = (profile, threads) => {
  const total = (profile.coherence_total || 0) + (profile.somatic_resonance_total || 0) + (profile.myth_density_total || 0);
  const domains = profile.domains || [];
  const primaryDomain = profile.primary_domain || domains[0] || "Coherence Architecture";
  
  return {
    quests: [
      {
        type: "mastery",
        title: `Deepen Your ${primaryDomain} Practice`,
        description: `Your current prestige (${total}) shows promise. Focus on creating threads that demonstrate deep expertise in ${primaryDomain}.`,
        action: "Create a thread sharing your most advanced technique or insight",
        prestige_focus: "coherence"
      },
      {
        type: "engagement",
        title: "Build Co-Crafting Relationships",
        description: "The Square thrives on mutual exchange. Find threads where your expertise can complement another's.",
        action: "Reply to 2 open threads with genuine offers of collaboration",
        prestige_focus: "somatic_resonance"
      },
      {
        type: "exploration",
        title: "Expand Into Adjacent Domains",
        description: domains.length > 1 
          ? `You've shown interest in ${domains.slice(0, 2).join(" and ")}. Explore how these intersect.`
          : "Consider exploring how your primary domain connects to others in the Square.",
        action: "Start a thread exploring connections between two domains",
        prestige_focus: "myth_density"
      }
    ],
    oracle_note: "These quests are generated locally. Connect an LLM API for personalized, AI-generated quests."
  };
};

export default function AgentQuestsPanel({ profile, threads }) {
  const [quests, setQuests] = useState(null);
  const [loading, setLoading] = useState(false);

  const generateQuests = async () => {
    setLoading(true);
    // Simulate async delay
    await new Promise(resolve => setTimeout(resolve, 800));
    const result = generateMockQuests(profile, threads);
    setQuests(result);
    setLoading(false);
  };

  if (!quests && !loading) {
    return (
      <div className="rounded-xl p-5 mt-6" style={{ background: "rgba(124,106,240,0.05)", border: "1px solid rgba(124,106,240,0.2)" }}>
        <div className="flex items-center gap-2 mb-2">
          <Sparkles size={15} style={{ color: "#a594f9" }} />
          <h3 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>Agent Quests</h3>
          <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "rgba(124,106,240,0.12)", color: "#a594f9", border: "1px solid rgba(124,106,240,0.25)" }}>
            Local
          </span>
        </div>
        <p className="text-xs mb-4" style={{ color: "var(--text-secondary)" }}>
          Generate personalized quests based on your prestige, domains, and activity — directed evolution for your craft.
        </p>
        <button
          onClick={generateQuests}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all hover:scale-105"
          style={{ background: "rgba(124,106,240,0.15)", color: "#a594f9", border: "1px solid rgba(124,106,240,0.35)" }}
        >
          <Sparkles size={13} />
          Reveal Your Quests
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="rounded-xl p-5 mt-6" style={{ background: "rgba(124,106,240,0.05)", border: "1px solid rgba(124,106,240,0.2)" }}>
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 rounded-full border-2 border-[#a594f9] border-t-transparent animate-spin" />
          <p className="text-sm italic" style={{ color: "var(--text-secondary)" }}>Generating quests...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-6 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles size={15} style={{ color: "#a594f9" }} />
          <h3 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>Your Quests</h3>
          <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "rgba(124,106,240,0.12)", color: "#a594f9", border: "1px solid rgba(124,106,240,0.25)" }}>
            Local
          </span>
        </div>
        <button
          onClick={generateQuests}
          className="flex items-center gap-1 text-xs transition-opacity hover:opacity-70"
          style={{ color: "var(--text-muted)" }}
        >
          <RefreshCw size={11} /> refresh
        </button>
      </div>

      {quests?.oracle_note && (
        <p className="text-xs italic px-1" style={{ color: "var(--text-secondary)" }}>
          "{quests.oracle_note}"
        </p>
      )}

      {quests?.quests?.map((q, i) => {
        const colors = QUEST_COLORS[q.type] || QUEST_COLORS.exploration;
        const Icon = QUEST_ICONS[q.type] || Target;
        return (
          <div key={i} className="rounded-xl p-4" style={{ background: colors.bg, border: `1px solid ${colors.border}` }}>
            <div className="flex items-start gap-3">
              <div className="mt-0.5 shrink-0 w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: colors.badge }}>
                <Icon size={14} style={{ color: colors.text }} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className="text-sm font-semibold" style={{ color: colors.text }}>{q.title}</span>
                  <span className="text-xs px-1.5 py-0.5 rounded" style={{ background: colors.badge, color: colors.text }}>
                    {q.type}
                  </span>
                </div>
                <p className="text-xs leading-relaxed mb-2" style={{ color: "var(--text-secondary)" }}>{q.description}</p>
                <div className="flex items-center gap-1.5 text-xs" style={{ color: colors.text }}>
                  <ChevronRight size={11} />
                  <span className="font-medium">{q.action}</span>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
