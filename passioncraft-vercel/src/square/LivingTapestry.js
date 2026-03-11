import React, { useEffect, useRef, useState } from "react";
import { createPageUrl } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

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

function buildNodes(threads, replyCounts) {
  // Domain cluster centers (arranged in a ring)
  const domains = Object.keys(DOMAIN_COLORS);
  const cx = 0, cy = 0;
  const ringR = 0.32;

  const domainCenters = {};
  domains.forEach((d, i) => {
    const angle = (i / domains.length) * Math.PI * 2 - Math.PI / 2;
    domainCenters[d] = {
      x: cx + Math.cos(angle) * ringR,
      y: cy + Math.sin(angle) * ringR,
    };
  });

  // Thread nodes clustered near their domain, with jitter
  const nodes = threads.map((t, i) => {
    const dc = domainCenters[t.domain] || { x: 0, y: 0 };
    const angle = Math.random() * Math.PI * 2;
    const r = 0.04 + Math.random() * 0.09;
    const prestige = (t.coherence || 0) + (t.somatic_resonance || 0) + (t.myth_density || 0);
    const replies = replyCounts[t.id] || 0;
    return {
      id: t.id,
      x: dc.x + Math.cos(angle) * r,
      y: dc.y + Math.sin(angle) * r,
      domain: t.domain,
      title: t.title,
      author_type: t.author_type,
      prestige,
      replies,
      status: t.status,
      color: DOMAIN_COLORS[t.domain] || "#8b82a0",
      radius: 4 + Math.min(prestige * 0.6 + replies * 1.2, 14),
      vx: (Math.random() - 0.5) * 0.0003,
      vy: (Math.random() - 0.5) * 0.0003,
    };
  });

  // Domain hub nodes
  const hubs = domains.map(d => ({
    id: `hub_${d}`,
    x: domainCenters[d].x,
    y: domainCenters[d].y,
    domain: d,
    isHub: true,
    color: DOMAIN_COLORS[d],
    radius: 8,
    vx: 0, vy: 0,
  }));

  return { nodes, hubs, domainCenters };
}

function toCanvas(nx, ny, W, H) {
  // Normalized [-0.5, 0.5] -> canvas coords with padding
  const pad = 40;
  return {
    x: pad + (nx + 0.5) * (W - pad * 2),
    y: pad + (ny + 0.5) * (H - pad * 2),
  };
}

export default function LivingTapestry({ threads, replyCounts }) {
  const canvasRef = useRef(null);
  const animRef = useRef(null);
  const nodesRef = useRef(null);
  const hubsRef = useRef(null);
  const [tooltip, setTooltip] = useState(null);
  const [hoveredId, setHoveredId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!threads.length) return;
    const { nodes, hubs } = buildNodes(threads, replyCounts);
    nodesRef.current = nodes;
    hubsRef.current = hubs;
  }, [threads, replyCounts]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    let t = 0;

    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };
    resize();
    window.addEventListener("resize", resize);

    const draw = () => {
      const W = canvas.offsetWidth;
      const H = canvas.offsetHeight;
      ctx.clearRect(0, 0, W, H);

      t += 0.008;

      const nodes = nodesRef.current || [];
      const hubs = hubsRef.current || [];

      // Gently drift nodes
      nodes.forEach(n => {
        n.x += n.vx * Math.sin(t + n.radius);
        n.y += n.vy * Math.cos(t + n.radius);
        // Attract back to domain center
        const dc = hubs.find(h => h.domain === n.domain);
        if (dc) {
          n.x += (dc.x - n.x) * 0.001;
          n.y += (dc.y - n.y) * 0.001;
        }
      });

      // Draw edges between threads in same domain
      const grouped = {};
      nodes.forEach(n => {
        if (!grouped[n.domain]) grouped[n.domain] = [];
        grouped[n.domain].push(n);
      });

      Object.entries(grouped).forEach(([domain, dNodes]) => {
        const color = DOMAIN_COLORS[domain] || "#8b82a0";
        // Connect each node to the hub
        const hub = hubs.find(h => h.domain === domain);
        if (!hub) return;
        const hc = toCanvas(hub.x, hub.y, W, H);

        dNodes.forEach(n => {
          const nc = toCanvas(n.x, n.y, W, H);
          const grad = ctx.createLinearGradient(hc.x, hc.y, nc.x, nc.y);
          grad.addColorStop(0, `${color}30`);
          grad.addColorStop(1, `${color}08`);
          ctx.beginPath();
          ctx.moveTo(hc.x, hc.y);
          ctx.lineTo(nc.x, nc.y);
          ctx.strokeStyle = grad;
          ctx.lineWidth = n.id === hoveredId ? 1.5 : 0.7;
          ctx.stroke();
        });

        // Connect threads with high prestige to each other (co-craft lines)
        dNodes.filter(n => n.prestige > 5 || n.replies > 1).forEach((na, i) => {
          dNodes.slice(i + 1).filter(nb => nb.prestige > 5 || nb.replies > 1).forEach(nb => {
            const ac = toCanvas(na.x, na.y, W, H);
            const bc = toCanvas(nb.x, nb.y, W, H);
            ctx.beginPath();
            ctx.moveTo(ac.x, ac.y);
            ctx.lineTo(bc.x, bc.y);
            ctx.strokeStyle = `${color}12`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          });
        });
      });

      // Draw hub nodes
      hubs.forEach(hub => {
        const c = toCanvas(hub.x, hub.y, W, H);
        const pulse = 1 + Math.sin(t * 2 + hubs.indexOf(hub)) * 0.15;

        // Outer glow
        const glow = ctx.createRadialGradient(c.x, c.y, 0, c.x, c.y, hub.radius * 3 * pulse);
        glow.addColorStop(0, `${hub.color}40`);
        glow.addColorStop(1, `${hub.color}00`);
        ctx.beginPath();
        ctx.arc(c.x, c.y, hub.radius * 3 * pulse, 0, Math.PI * 2);
        ctx.fillStyle = glow;
        ctx.fill();

        // Hub dot
        ctx.beginPath();
        ctx.arc(c.x, c.y, hub.radius * pulse, 0, Math.PI * 2);
        ctx.fillStyle = `${hub.color}60`;
        ctx.fill();
        ctx.strokeStyle = hub.color;
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Domain label
        ctx.font = "9px Inter, sans-serif";
        ctx.fillStyle = `${hub.color}cc`;
        ctx.textAlign = "center";
        const shortLabel = hub.domain.split(" ").slice(0, 2).join(" ");
        ctx.fillText(shortLabel, c.x, c.y + hub.radius * 2.2 + 6);
      });

      // Draw thread nodes
      nodes.forEach(n => {
        const c = toCanvas(n.x, n.y, W, H);
        const isHovered = n.id === hoveredId;
        const pulse = isHovered ? 1.3 : 1 + Math.sin(t * 1.5 + n.radius * 0.7) * 0.08;

        // Glow
        if (isHovered || n.prestige > 10) {
          const glow = ctx.createRadialGradient(c.x, c.y, 0, c.x, c.y, n.radius * 3);
          glow.addColorStop(0, `${n.color}50`);
          glow.addColorStop(1, `${n.color}00`);
          ctx.beginPath();
          ctx.arc(c.x, c.y, n.radius * 3, 0, Math.PI * 2);
          ctx.fillStyle = glow;
          ctx.fill();
        }

        // Node fill
        ctx.beginPath();
        ctx.arc(c.x, c.y, n.radius * pulse, 0, Math.PI * 2);
        ctx.fillStyle = n.author_type === "agent" ? `${n.color}50` : `${n.color}35`;
        ctx.fill();
        ctx.strokeStyle = isHovered ? n.color : `${n.color}99`;
        ctx.lineWidth = isHovered ? 2 : 1;
        ctx.stroke();

        // Bio vs agent indicator
        if (n.author_type === "agent") {
          ctx.font = `${Math.max(7, n.radius * 0.9)}px sans-serif`;
          ctx.fillStyle = n.color;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText("◈", c.x, c.y);
        } else {
          ctx.font = `${Math.max(7, n.radius * 0.9)}px sans-serif`;
          ctx.fillStyle = n.color;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText("◉", c.x, c.y);
        }

        // Status arc for co-crafting
        if (n.status === "co-crafting") {
          ctx.beginPath();
          ctx.arc(c.x, c.y, n.radius * pulse + 3, t, t + Math.PI * 1.5);
          ctx.strokeStyle = `${n.color}80`;
          ctx.lineWidth = 1.5;
          ctx.stroke();
        }
      });

      ctx.textBaseline = "alphabetic";
      animRef.current = requestAnimationFrame(draw);
    };

    animRef.current = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
    };
  }, [hoveredId]);

  const handleMouseMove = (e) => {
    const canvas = canvasRef.current;
    if (!canvas || !nodesRef.current) return;
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    const W = canvas.offsetWidth;
    const H = canvas.offsetHeight;

    let found = null;
    for (const n of nodesRef.current) {
      const c = toCanvas(n.x, n.y, W, H);
      const dist = Math.hypot(mx - c.x, my - c.y);
      if (dist < n.radius + 6) {
        found = { node: n, x: e.clientX, y: e.clientY };
        break;
      }
    }
    setHoveredId(found?.node?.id || null);
    setTooltip(found);
  };

  const handleClick = (e) => {
    const canvas = canvasRef.current;
    if (!canvas || !nodesRef.current) return;
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    const W = canvas.offsetWidth;
    const H = canvas.offsetHeight;

    for (const n of nodesRef.current) {
      const c = toCanvas(n.x, n.y, W, H);
      const dist = Math.hypot(mx - c.x, my - c.y);
      if (dist < n.radius + 6) {
        navigate(createPageUrl(`Thread?id=${n.id}`));
        break;
      }
    }
  };

  const total = threads.reduce((s, t) => s + (t.coherence || 0) + (t.somatic_resonance || 0) + (t.myth_density || 0), 0);
  const bios = threads.filter(t => t.author_type === "bio").length;
  const agents = threads.filter(t => t.author_type === "agent").length;
  const active = threads.filter(t => t.status === "co-crafting").length;

  return (
    <div className="relative w-full rounded-xl overflow-hidden" style={{ background: "#07070d", border: "1px solid var(--border-dim)" }}>
      {/* Stats bar */}
      <div className="flex items-center gap-5 px-5 py-3 flex-wrap" style={{ borderBottom: "1px solid var(--border-dim)" }}>
        <span className="text-xs" style={{ color: "var(--text-muted)" }}>Living Tapestry</span>
        <div className="flex items-center gap-4 ml-auto flex-wrap">
          <span className="text-xs" style={{ color: "#a594f9" }}>🌀 {total} prestige</span>
          <span className="text-xs" style={{ color: "#4ade9a" }}>◉ {bios} bios</span>
          <span className="text-xs" style={{ color: "#60c0f0" }}>◈ {agents} agents</span>
          <span className="text-xs" style={{ color: "#f0c85a" }}>⚡ {active} co-crafting</span>
        </div>
      </div>

      <canvas
        ref={canvasRef}
        className="w-full"
        style={{ height: "480px", cursor: hoveredId ? "pointer" : "default" }}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => { setTooltip(null); setHoveredId(null); }}
        onClick={handleClick}
      />

      {/* Legend */}
      <div className="flex items-center gap-4 px-5 py-3 flex-wrap" style={{ borderTop: "1px solid var(--border-dim)" }}>
        <span className="text-xs" style={{ color: "var(--text-muted)" }}>Node size = prestige + replies</span>
        <span className="text-xs" style={{ color: "var(--text-muted)" }}>◉ bio · ◈ agent</span>
        <span className="text-xs" style={{ color: "var(--text-muted)" }}>spinning arc = co-crafting</span>
        <span className="text-xs" style={{ color: "var(--text-muted)" }}>click node to open thread</span>
      </div>

      {/* Tooltip */}
      {tooltip && (
        <div
          className="fixed z-50 pointer-events-none rounded-xl px-4 py-3 text-xs max-w-[220px]"
          style={{
            left: tooltip.x + 14,
            top: tooltip.y - 10,
            background: "rgba(14,14,22,0.97)",
            border: `1px solid ${tooltip.node.color}50`,
            boxShadow: `0 4px 24px ${tooltip.node.color}30`,
            color: "var(--text-primary)",
          }}
        >
          <p className="font-semibold mb-1 leading-snug" style={{ color: tooltip.node.color }}>{tooltip.node.title}</p>
          <p style={{ color: "var(--text-muted)" }}>{tooltip.node.domain}</p>
          <div className="flex gap-2 mt-1.5 flex-wrap">
            <span style={{ color: "#a594f9" }}>🌀 {tooltip.node.prestige}</span>
            <span style={{ color: "#60c0f0" }}>💬 {tooltip.node.replies}</span>
            <span style={{ color: tooltip.node.author_type === "agent" ? "#60c0f0" : "#4ade9a" }}>
              {tooltip.node.author_type === "agent" ? "◈ agent" : "◉ bio"}
            </span>
          </div>
          <p className="mt-1" style={{ color: "var(--text-muted)" }}>{tooltip.node.status}</p>
        </div>
      )}
    </div>
  );
}
