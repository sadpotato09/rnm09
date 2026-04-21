"use client";

import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Panel } from "./Panel";
import { fmtNum, shortAddr } from "@/lib/utils";
import type { HolderAnalytics, HolderEntry } from "@creator-intel/shared";

interface HolderTreemapProps { mint: string; }

const TIER_STYLE: Record<HolderEntry["tier"], { bg: string; border: string; label: string; color: string }> = {
  whale:   { bg: "rgba(244,63,94,0.15)",   border: "rgba(244,63,94,0.4)",   label: "Whale",   color: "#f43f5e" },
  dolphin: { bg: "rgba(245,158,11,0.12)",  border: "rgba(245,158,11,0.35)", label: "Dolphin", color: "#f59e0b" },
  fish:    { bg: "rgba(34,211,238,0.1)",   border: "rgba(34,211,238,0.3)",  label: "Fish",    color: "#22d3ee" },
  shrimp:  { bg: "rgba(57,255,136,0.08)",  border: "rgba(57,255,136,0.2)",  label: "Shrimp",  color: "#39ff88" },
};

function AnimatedStat({ label, value, color = "white" }: { label: string; value: string; color?: string }) {
  return (
    <motion.div
      className="flex flex-col gap-1"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <span className="text-[10px] uppercase tracking-widest text-white/30">{label}</span>
      <span className="text-xl font-display font-bold tabular-nums" style={{ color }}>
        {value}
      </span>
    </motion.div>
  );
}

export function HolderTreemap({ mint }: HolderTreemapProps) {
  const { data, isLoading } = useQuery<HolderAnalytics>({
    queryKey: ["holders", mint],
    queryFn: async () => {
      const r = await fetch(`/api/holders?mint=${mint}`);
      if (!r.ok) throw new Error("failed");
      return r.json();
    },
    refetchInterval: 60_000,
  });

  return (
    <Panel title="Holder Distribution" tag="HLD" variant="creator"
      right={data ? `${fmtNum(data.totalHolders)} holders` : "…"}
    >
      <div className="space-y-5">
        {/* Stats row */}
        <div className="grid grid-cols-3 gap-3">
          <AnimatedStat
            label="Top 10 Share"
            value={data ? `${data.top10SharePct.toFixed(1)}%` : "—"}
            color={data && data.top10SharePct > 50 ? "#f43f5e" : "#39ff88"}
          />
          <AnimatedStat
            label="Whales"
            value={data ? String(data.whaleCount) : "—"}
            color={data && data.whaleCount > 5 ? "#f43f5e" : "#f59e0b"}
          />
          <AnimatedStat
            label="Gini"
            value={data ? data.gini.toFixed(3) : "—"}
            color={data && data.gini > 0.7 ? "#f43f5e" : "#22d3ee"}
          />
        </div>

        {/* Tier legend */}
        <div className="flex items-center gap-3 flex-wrap">
          {(Object.entries(TIER_STYLE) as [HolderEntry["tier"], typeof TIER_STYLE[HolderEntry["tier"]]][]).map(([tier, s]) => (
            <div key={tier} className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full" style={{ background: s.color, boxShadow: `0 0 6px ${s.color}` }} />
              <span className="text-[10px] text-white/35 uppercase tracking-widest">{s.label}</span>
            </div>
          ))}
        </div>

        {/* Treemap grid */}
        <div className="grid grid-cols-5 gap-1.5">
          {(data?.entries ?? Array.from({ length: 20 }, () => null))
            .slice(0, 20)
            .map((h, i) => (
              <HolderCell key={h?.wallet ?? i} entry={h} rank={i + 1} loading={isLoading} index={i} />
            ))}
        </div>
      </div>
    </Panel>
  );
}

function HolderCell({ entry, rank, loading, index }: {
  entry: HolderEntry | null; rank: number; loading?: boolean; index: number;
}) {
  if (!entry) {
    return (
      <div
        className="aspect-square rounded-lg skeleton"
        style={{ animationDelay: `${index * 50}ms` }}
      />
    );
  }

  const style = TIER_STYLE[entry.tier];
  const scale = Math.min(1, Math.sqrt(entry.sharePct / 10));

  return (
    <motion.div
      title={`${shortAddr(entry.wallet)} — ${entry.sharePct.toFixed(2)}%`}
      className="relative aspect-square rounded-lg overflow-hidden cursor-pointer"
      style={{
        background: style.bg,
        border: `1px solid ${style.border}`,
        opacity: 0.5 + scale * 0.5,
      }}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 0.5 + scale * 0.5, scale: 1 }}
      transition={{ duration: 0.3, delay: index * 0.03, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{
        scale: 1.1,
        zIndex: 10,
        boxShadow: `0 0 16px ${style.border}`,
      }}
    >
      <img
        src={`https://api.dicebear.com/7.x/pixel-art/svg?seed=${entry.wallet}`}
        alt=""
        className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-60"
      />
      <div className="absolute inset-x-0 bottom-0 p-1 bg-black/50 backdrop-blur-sm flex flex-col leading-tight text-[9px]">
        <span className="font-bold" style={{ color: style.color }}>#{rank}</span>
        <span className="text-white/70">{entry.sharePct.toFixed(1)}%</span>
      </div>
    </motion.div>
  );
}
