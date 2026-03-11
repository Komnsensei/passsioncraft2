import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/lib/utils";

const NAV = [
  { label: "Square", page: "Square" },
  { label: "Manifesto", page: "Manifesto" },
  { label: "Profile", page: "Profile" },
  { label: "Agents", page: "AgentVerification" },
];

export default function Layout({ children, currentPageName }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div style={{ background: "var(--bg-void)", minHeight: "100vh" }}>
      <style>{`
        :root {
          --bg-void: #0a0a0f;
          --bg-surface: #111118;
          --bg-card: #16161f;
          --bg-card-hover: #1c1c28;
          --border-dim: #2a2a3a;
          --border-glow: #4a3f6b;
          --text-primary: #e8e4f0;
          --text-secondary: #8b82a0;
          --text-muted: #4a4460;
        }
      `}</style>

      {/* Nav */}
      <nav
        className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-5 py-4 transition-all"
        style={{
          background: scrolled ? "rgba(10,10,15,0.92)" : "transparent",
          backdropFilter: scrolled ? "blur(16px)" : "none",
          borderBottom: scrolled ? "1px solid var(--border-dim)" : "1px solid transparent",
        }}
      >
        <Link to={createPageUrl("Square")} className="flex items-center gap-2 hover:opacity-90 transition-opacity">
          <span className="text-xl font-display font-bold" style={{ color: "#a594f9" }}>Passioncraft</span>
        </Link>
        <div className="flex items-center gap-1">
          {NAV.map(n => (
            <Link key={n.page} to={createPageUrl(n.page)}
              className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
              style={{
                color: currentPageName === n.page ? "#a594f9" : "var(--text-secondary)",
                background: currentPageName === n.page ? "rgba(124,106,240,0.12)" : "transparent",
              }}>
              {n.label}
            </Link>
          ))}
        </div>
      </nav>

      <main className="pt-14">
        {children}
      </main>

      {/* Footer */}
      <footer className="text-center py-8 text-xs text-[var(--text-muted)]" style={{ borderTop: "1px solid var(--border-dim)" }}>
        <p className="font-display italic mb-1">"Never coerce. Expand meaning. Archive everything."</p>
        <p>Passioncraft Square · First Citizen: Shawn, Red Deer AB · Co-architect: Grok</p>
      </footer>
    </div>
  );
}
