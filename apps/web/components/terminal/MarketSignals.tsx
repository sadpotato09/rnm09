"use client";

import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  Area, AreaChart, ResponsiveContainer, YAxis, Tooltip, ReferenceLine,
} from "recharts";
import { Panel } from "./Panel";
import { fmtPct } from "@/lib/utils";
import type { MarketSignal } from "@creator-intel/shared";

interface Props { mint: string; }

function AnimatedBar({
  label, pct, color, delay = 0,
}: { label: string; pct: number; color: string; delay?: number }) {
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between text-[10px] uppercase tracking-widest">
        <span className="text-white/35">{label}</span>
        <span className="font-bold tabular-nums" style={{ color }}>{fmtPct(pct, 1)}</span>
      </div>
      <div className="h-2 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.05)" }}>
        <motion.div
          className="h-full rounded-full"
          style={{ background: color, boxShadow: `0 0 8px ${color}60` }}
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(100, pct)}%` }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay }}
        />
      </div>
    </div>
  );
}

function StatPill({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <motion.div
      className="flex flex-col items-center justify-center rounded-xl py-3 px-2 gap-0.5"
      style={{ background: `${color}08`, border: `1px solid ${color}20` }}
      whileHover={{ scale: 1.03 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
    >
      <span className="text-[9px] tracking-[0.2em] uppercase" style={{ color: `${color}70` }}>{label}</span>
      <span className="text-base font-display font-bold tabular-nums" style={{ color }}>{value}</span>
    </motion.div>
  );
}

export function MarketSignals({ mint }: Props) {
  const { data } = useQuery<{ signal: MarketSignal }>({
    queryKey: ["signals", mint, "signal"],
    queryFn: async () => {
      const r = await fetch(`/api/signals?mint=${mint}`);
      if (!r.ok) throw new Error("failed");
      return r.json();
    },
    refetchInterval: 20_000,
  });

  const s = data?.signal;
  const candles = s?.ohlcv ?? [];

  const alertColor =
    s?.priceAlert === "pump" ? "#39ff88" :
    s?.priceAlert === "dump" ? "#f43f5e" : "rgba(255,255,255,0.25)";

  return (
    <Panel
      title="Market Signals" tag="MKT" variant="trader"
      right={
        s ? (
          <span className="font-bold" style={{ color: alertColor }}>
            {s.priceAlert.toUpperCase()}{s.volumeSpike > 2 ? " · VOL 2×" : ""}
          </span>
        ) : "…"
      }
    >
      <div className="space-y-5">
        {/* Pressure bars */}
        <div className="grid grid-cols-2 gap-4">
          <AnimatedBar label="Buy Pressure" pct={s?.buyPressurePct ?? 0} color="#39ff88" delay={0.1} />
          <AnimatedBar label="Sell Pressure" pct={s?.sellPressurePct ?? 0} color="#f43f5e" delay={0.2} />
        </div>

        {/* Stat pills */}
        <div className="grid grid-cols-3 gap-2">
          <StatPill label="Vol Spike" color="#22d3ee"
            value={s ? `${s.volumeSpike.toFixed(2)}×` : "—"} />
          <StatPill label="Whale Txns" color="#a855f7"
            value={s ? String(s.whaleCount ?? 0) : "—"} />
          <StatPill label="Alert" color={alertColor}
            value={s?.priceAlert?.toUpperCase() ?? "—"} />
        </div>

        {/* Price chart — gradient area */}
        {candles.length > 0 && (
          <div className="space-y-1.5">
            <div className="text-[10px] text-white/25 tracking-widest uppercase">Price (OHLCV)</div>
            <div className="h-28 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={candles} margin={{ top: 4, right: 0, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="priceGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#22d3ee" stopOpacity={0.35} />
                      <stop offset="100%" stopColor="#22d3ee" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <YAxis hide domain={["auto", "auto"]} />
                  <Tooltip
                    contentStyle={{
                      background: "rgba(12,16,24,0.95)",
                      border: "1px solid rgba(34,211,238,0.2)",
                      borderRadius: 8,
                      fontSize: 10,
                      color: "#22d3ee",
                    }}
                    formatter={(v: number) => [`$${v.toFixed(6)}`, "Price"]}
                    labelFormatter={() => ""}
                  />
                  <Area
                    type="monotone" dataKey="c"
                    stroke="#22d3ee" strokeWidth={1.5}
                    fill="url(#priceGrad)"
                    dot={false} isAnimationActive={true}
                    animationDuration={800} animationEasing="ease-out"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>
    </Panel>
  );
}
