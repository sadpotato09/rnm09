"use client";

import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Panel } from "./Panel";

interface RegimeInfo { regime: string; confidence: number; description: string; }

interface EnrichedInsight {
  mint: string;
  bestWindows: Array<{ dayOfWeek: number; hourUtc: number; score: number; baselineMultiplier: number; }>;
  summary: string;
  regime: RegimeInfo;
  signals: {
    buyPressurePct: number; sellPressurePct: number; volumeSpike: number;
    priceAlert: string; whaleCount: number; topHolderPct: number;
  };
  narrative: string;
  generatedAt: string;
}

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const REGIME_CONFIG: Record<string, { emoji: string; color: string; glow: string; label: string }> = {
  breakout:     { emoji: "🚀", color: "text-term-green",  glow: "rgba(57,255,136,0.3)",  label: "BREAKOUT" },
  accumulation: { emoji: "📈", color: "text-term-cyan",   glow: "rgba(34,211,238,0.3)",  label: "ACCUMULATION" },
  distribution: { emoji: "📉", color: "text-term-red",    glow: "rgba(244,63,94,0.3)",   label: "DISTRIBUTION" },
  consolidation:{ emoji: "⏸️", color: "text-term-amber",  glow: "rgba(245,158,11,0.3)",  label: "CONSOLIDATION" },
  dormant:      { emoji: "💤", color: "text-white/30",    glow: "rgba(255,255,255,0.1)", label: "DORMANT" },
};

/** SVG radial arc gauge */
function ArcGauge({ value, color, size = 64 }: { value: number; color: string; size?: number }) {
  const r = (size - 8) / 2;
  const circ = 2 * Math.PI * r;
  const pct = Math.min(1, Math.max(0, value));
  const dash = pct * circ * 0.75; // 270° arc
  const gap = circ - dash;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-[135deg]">
      {/* Track */}
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={5}
        strokeDasharray={`${circ * 0.75} ${circ}`} strokeLinecap="round" />
      {/* Fill */}
      <motion.circle
        cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={5}
        strokeDasharray={`${dash} ${gap + circ * 0.25}`} strokeLinecap="round"
        style={{ filter: `drop-shadow(0 0 4px ${color})` }}
        initial={{ strokeDasharray: `0 ${circ}` }}
        animate={{ strokeDasharray: `${dash} ${gap + circ * 0.25}` }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
      />
    </svg>
  );
}

/** Animated count-up number */
function AnimatedNumber({ value, suffix = "" }: { value: number; suffix?: string }) {
  return (
    <motion.span
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {value.toFixed(0)}{suffix}
    </motion.span>
  );
}

function SignalCard({ label, value, sub, color }: { label: string; value: string; sub?: string; color: string }) {
  return (
    <motion.div
      className="flex flex-col items-center justify-center rounded-xl p-3 gap-1"
      style={{ background: `${color}08`, border: `1px solid ${color}20` }}
      whileHover={{ scale: 1.04, borderColor: `${color}50` }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
    >
      <span className="text-[9px] tracking-[0.2em] uppercase" style={{ color: `${color}80` }}>{label}</span>
      <span className="text-lg font-display font-bold tabular-nums" style={{ color }}>{value}</span>
      {sub && <span className="text-[9px] text-white/25">{sub}</span>}
    </motion.div>
  );
}

export function InsightCard({ mint }: { mint: string }) {
  const { data, isLoading } = useQuery<EnrichedInsight>({
    queryKey: ["insights", mint],
    queryFn: async () => {
      const r = await fetch(`/api/insights?mint=${mint}`);
      if (!r.ok) throw new Error("failed");
      return r.json();
    },
    refetchInterval: 15 * 60_000,
  });

  return (
    <Panel title="AI Intelligence Briefing" tag="AI" variant="creator"
      right={data ? new Date(data.generatedAt).toLocaleTimeString() : "…"}
    >
      {isLoading && (
        <div className="space-y-3">
          {[80, 50, 100, 60].map((w, i) => (
            <div key={i} className="skeleton h-4" style={{ width: `${w}%` }} />
          ))}
        </div>
      )}

      <AnimatePresence>
        {data && (
          <motion.div
            className="space-y-5"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ staggerChildren: 0.08 }}
          >
            {/* Regime hero row */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <motion.div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-xl"
                  style={{
                    background: `${REGIME_CONFIG[data.regime.regime]?.glow ?? "rgba(255,255,255,0.1)"}20`,
                    boxShadow: `0 0 16px ${REGIME_CONFIG[data.regime.regime]?.glow ?? "rgba(255,255,255,0.1)"}`,
                  }}
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  {REGIME_CONFIG[data.regime.regime]?.emoji ?? "📊"}
                </motion.div>
                <div>
                  <div className={`text-sm font-display font-bold tracking-[0.2em] ${REGIME_CONFIG[data.regime.regime]?.color ?? "text-white"}`}>
                    {REGIME_CONFIG[data.regime.regime]?.label ?? data.regime.regime}
                  </div>
                  <div className="text-[10px] text-white/30">Market regime</div>
                </div>
              </div>
              {/* Confidence arc */}
              <div className="relative flex items-center justify-center">
                <ArcGauge value={data.regime.confidence} color="#a855f7" size={56} />
                <div className="absolute text-[11px] font-bold text-term-violet tabular-nums">
                  {(data.regime.confidence * 100).toFixed(0)}%
                </div>
              </div>
            </div>

            {/* Signal cards */}
            <div className="grid grid-cols-3 gap-2">
              <SignalCard
                label="BUY" color="#39ff88"
                value={`${data.signals.buyPressurePct.toFixed(0)}%`}
                sub={data.signals.buyPressurePct > 55 ? "bullish" : "neutral"}
              />
              <SignalCard
                label="VOL" color="#22d3ee"
                value={`${data.signals.volumeSpike.toFixed(1)}×`}
                sub={data.signals.volumeSpike > 2 ? "spike" : "normal"}
              />
              <SignalCard
                label="WHALES" color={data.signals.whaleCount > 5 ? "#f43f5e" : "#f59e0b"}
                value={String(data.signals.whaleCount)}
                sub={data.signals.whaleCount > 5 ? "danger" : "ok"}
              />
            </div>

            {/* Top holder concentration bar */}
            {data.signals.whaleCount > 0 && (
              <div className="space-y-2">
                <div className="flex justify-between text-[10px] tracking-widest">
                  <span className="text-white/30 uppercase">Top Holder Concentration</span>
                  <span className={data.signals.topHolderPct > 30 ? "text-term-red font-bold" : "text-term-green"}>
                    {data.signals.topHolderPct.toFixed(1)}%
                  </span>
                </div>
                <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.05)" }}>
                  <motion.div
                    className="h-full rounded-full"
                    style={{
                      background: data.signals.topHolderPct > 30
                        ? "linear-gradient(90deg, #f59e0b, #f43f5e)"
                        : "linear-gradient(90deg, #22d3ee, #39ff88)",
                    }}
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(100, data.signals.topHolderPct)}%` }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
                  />
                </div>
              </div>
            )}

            {/* Optimal post windows */}
            {data.bestWindows.length > 0 && (
              <div className="space-y-2">
                <div className="text-[10px] text-white/30 tracking-widest uppercase">Optimal Post Windows</div>
                <div className="space-y-1.5">
                  {data.bestWindows.map((w, i) => {
                    const pct = (w.baselineMultiplier / (data.bestWindows[0]?.baselineMultiplier || 1)) * 100;
                    return (
                      <div key={`${w.dayOfWeek}-${w.hourUtc}`} className="flex items-center gap-3">
                        <span className="text-[10px] text-white/25 w-4 tabular-nums">#{i + 1}</span>
                        <span className="text-xs text-white/60 font-mono w-16">
                          {DAYS[w.dayOfWeek]} {String(w.hourUtc).padStart(2, "0")}:00
                        </span>
                        <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.05)" }}>
                          <motion.div
                            className="h-full rounded-full"
                            style={{ background: "linear-gradient(90deg, #a855f7, #22d3ee)" }}
                            initial={{ width: 0 }}
                            animate={{ width: `${pct}%` }}
                            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.3 + i * 0.05 }}
                          />
                        </div>
                        <span className="text-[10px] text-term-violet tabular-nums w-10 text-right">
                          {w.baselineMultiplier.toFixed(1)}×
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* AI Narrative */}
            <div className="rounded-xl p-4 space-y-2"
              style={{ background: "rgba(168,85,247,0.06)", border: "1px solid rgba(168,85,247,0.15)" }}>
              <div className="flex items-center gap-2">
                <motion.span
                  className="inline-block w-1.5 h-1.5 rounded-full bg-term-violet"
                  animate={{ opacity: [1, 0.3, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <span className="text-[9px] text-term-violet tracking-[0.35em] font-bold uppercase">AI Briefing</span>
              </div>
              {data.narrative.split("\n\n").map((para, i) => (
                <p key={i} className="text-white/60 text-xs leading-relaxed font-mono">{para}</p>
              ))}
            </div>

            {/* Price alert */}
            <AnimatePresence>
              {data.signals.priceAlert !== "none" && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-xs tracking-widest uppercase font-bold"
                  style={data.signals.priceAlert === "pump"
                    ? { background: "rgba(57,255,136,0.08)", border: "1px solid rgba(57,255,136,0.3)", color: "#39ff88" }
                    : { background: "rgba(244,63,94,0.08)", border: "1px solid rgba(244,63,94,0.3)", color: "#f43f5e" }
                  }
                >
                  <motion.span animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 1.5, repeat: Infinity }}>
                    {data.signals.priceAlert === "pump" ? "🟢" : "🔴"}
                  </motion.span>
                  {data.signals.priceAlert === "pump" ? "PUMP DETECTED" : "DUMP WARNING"}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      {!isLoading && !data && (
        <p className="text-white/25 text-xs">ML service unavailable — ensure backend is running.</p>
      )}
    </Panel>
  );
}
