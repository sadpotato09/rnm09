import type { CSSProperties } from "react";

// AuraScoreCard — dynamic color-graded AURA score display with pulsing glow border.
// Can be used as a server component since animation is done via CSS class names.

const TIERS = [
  { min: 90, label: "GOD TIER",  color: "#39ff88", glowClass: "aura-glow-god"   },
  { min: 75, label: "BASED",     color: "#22d3ee", glowClass: "aura-glow-based"  },
  { min: 60, label: "SOLID",     color: "#a855f7", glowClass: "aura-glow-solid"  },
  { min: 40, label: "MID",       color: "#f59e0b", glowClass: "aura-glow-mid"    },
  { min: 0,  label: "NGMI",      color: "#f43f5e", glowClass: "aura-glow-ngmi"   },
] as const;

export type AuraTier = (typeof TIERS)[number];

export function tierFor(score: number): AuraTier {
  return TIERS.find((t) => score >= t.min) ?? TIERS[TIERS.length - 1]!;
}

interface ChipProps { label: string; value: string; color?: string; }
function Chip({ label, value, color = "#e2eaff" }: ChipProps) {
  return (
    <div className="flex items-center gap-2 px-3 py-1.5"
      style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 4 }}>
      <span className="text-[9px] tracking-[0.2em] uppercase text-white/35 font-mono">{label}</span>
      <span className="text-[11px] font-mono font-bold tabular-nums" style={{ color }}>{value}</span>
    </div>
  );
}

function Ticks({ color }: { color: string }) {
  const s: CSSProperties = { position: "absolute", width: 10, height: 10 };
  return (
    <>
      <span style={{ ...s, left: 10, top: 10, borderLeft: `1px solid ${color}`, borderTop: `1px solid ${color}` }} />
      <span style={{ ...s, right: 10, top: 10, borderRight: `1px solid ${color}`, borderTop: `1px solid ${color}` }} />
      <span style={{ ...s, left: 10, bottom: 10, borderLeft: `1px solid ${color}`, borderBottom: `1px solid ${color}` }} />
      <span style={{ ...s, right: 10, bottom: 10, borderRight: `1px solid ${color}`, borderBottom: `1px solid ${color}` }} />
    </>
  );
}

interface ScoreCardProps {
  score: number;
  symbol: string;
  name: string;
  mint: string;
  signals: {
    gini: string;
    buyPct: number;
    holders: string;
    change24h: string;
  };
}

export function AuraScoreCard({ score, symbol, name, mint, signals }: ScoreCardProps) {
  const t = tierFor(score);
  return (
    <div
      className={`relative rounded-2xl p-8 md:p-10 overflow-hidden ${t.glowClass}`}
      style={{
        background: "rgba(12,16,24,0.78)",
        backdropFilter: "blur(20px) saturate(1.4)",
        border: `1px solid ${t.color}66`,
      }}
    >
      {/* Corner ticks */}
      <Ticks color={t.color} />

      {/* Background radial glow */}
      <div
        className="absolute top-0 right-0 w-64 h-64 pointer-events-none"
        style={{ background: `radial-gradient(circle, ${t.color}30, transparent 70%)`, filter: "blur(30px)" }}
      />

      <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start justify-between gap-8">
        {/* Left: metadata */}
        <div className="space-y-2 text-center md:text-left">
          {/* Tier badge */}
          <div
            className="inline-flex items-center gap-2 px-3 py-1 text-[10px] tracking-[0.3em] uppercase font-bold font-mono"
            style={{ border: `1px solid ${t.color}AA`, color: t.color, borderRadius: 4, textShadow: `0 0 8px ${t.color}` }}
          >
            <span style={{ width: 6, height: 6, borderRadius: 999, background: t.color, boxShadow: `0 0 6px ${t.color}`, display: "inline-block" }} />
            {t.label}
          </div>

          <h2 className="text-3xl md:text-4xl font-display font-black text-white tracking-tight">
            ${symbol}
          </h2>
          <p className="text-white/50 text-sm font-mono">{name}</p>
          <p className="text-white/25 text-[10px] font-mono break-all pt-1">{mint}</p>

          <div className="mt-4 flex flex-wrap gap-2 justify-center md:justify-start">
            <Chip label="GINI"    value={signals.gini} />
            <Chip label="BUYS"    value={`${signals.buyPct}%`} />
            <Chip label="HOLDERS" value={signals.holders} />
            <Chip
              label="24H"
              value={`${signals.change24h}%`}
              color={signals.change24h.startsWith("-") ? "#f43f5e" : "#39ff88"}
            />
          </div>
        </div>

        {/* Right: big score number */}
        <div className="flex flex-col items-center flex-shrink-0">
          <div
            className="font-display font-black leading-none tabular-nums tracking-tighter"
            style={{
              fontSize: "clamp(96px, 15vw, 160px)",
              color: t.color,
              textShadow: `0 0 30px ${t.color}, 0 0 60px ${t.color}66`,
            }}
          >
            {score}
          </div>
          <div className="text-white/30 text-[10px] tracking-[0.4em] uppercase -mt-3 font-mono">/ 100 AURA™</div>
        </div>
      </div>
    </div>
  );
}

interface BreakdownProps { score: number; }
export function ScoreBreakdown({ score }: BreakdownProps) {
  const t = tierFor(score);
  const rows = [
    { label: "Holder Health",   value: Math.min(30, +(score * 0.3).toFixed(1)), max: 30, hint: "Gini · wallet spread" },
    { label: "Buy Pressure",    value: Math.min(25, +(score * 0.25).toFixed(1)), max: 25, hint: "24h buy-side flow" },
    { label: "Volume Momentum", value: Math.min(20, +(score * 0.20).toFixed(1)), max: 20, hint: "7d volume Δ" },
    { label: "Whale Risk",      value: Math.min(15, +(score * 0.15).toFixed(1)), max: 15, hint: "Top-10 concentration" },
    { label: "Growth",          value: Math.min(10, +(score * 0.10).toFixed(1)), max: 10, hint: "24h new holders" },
  ];
  return (
    <div
      className="mt-4 p-6 rounded-xl space-y-3"
      style={{ background: "rgba(12,16,24,0.7)", border: "1px solid rgba(255,255,255,0.06)", backdropFilter: "blur(20px)" }}
    >
      <div className="text-[10px] tracking-[0.3em] uppercase text-white/35 font-mono">SCORE BREAKDOWN</div>
      {rows.map((r) => (
        <div key={r.label} className="space-y-1">
          <div className="flex justify-between text-[11px] font-mono tabular-nums">
            <span className="text-white/75">{r.label}</span>
            <span className="text-white/40">
              {r.value} / {r.max}
              <span className="text-white/25 ml-2">{r.hint}</span>
            </span>
          </div>
          <div className="h-1.5 rounded-sm overflow-hidden" style={{ background: "rgba(255,255,255,0.04)" }}>
            <div
              className="h-full transition-all duration-700"
              style={{ width: `${(r.value / r.max) * 100}%`, background: t.color, boxShadow: `0 0 10px ${t.color}AA` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
