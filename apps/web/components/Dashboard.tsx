"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TickerBar } from "./terminal/TickerBar";
import { HolderTreemap } from "./terminal/HolderTreemap";
import { RevenueSparkline } from "./terminal/RevenueSparkline";
import { MarketSignals } from "./terminal/MarketSignals";
import { ActivityFeed } from "./terminal/ActivityFeed";
import { InsightCard } from "./terminal/InsightCard";
import { SwapPanel } from "./terminal/SwapPanel";
import { LaunchPanel } from "./terminal/LaunchPanel";
import { TokenSwitcher } from "./TokenSwitcher";
import { ParticleField } from "./ParticleField";

type Mode = "creator" | "trader";

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
};
const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number];

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: EASE } },
};

export function Dashboard() {
  const [mint, setMint] = useState<string | null>(null);
  const [symbol, setSymbol] = useState<string>("TOKEN");
  const [mode, setMode] = useState<Mode>("creator");
  const [isDemo, setIsDemo] = useState(false);
  const [roleLoaded, setRoleLoaded] = useState(false);
  const pillRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const demo =
      typeof document !== "undefined" &&
      document.cookie.split(";").some((c) => c.trim().startsWith("demo_mode=true"));
    setIsDemo(demo);

    if (demo) {
      setMode("trader");
      setRoleLoaded(true);
      return;
    }

    fetch("/api/me/role", { cache: "no-store" })
      .then((r) => r.json())
      .then((data) => {
        if (data?.role === "trader" || data?.role === "creator") setMode(data.role);
      })
      .catch(() => {})
      .finally(() => setRoleLoaded(true));
  }, []);

  async function switchMode(next: Mode) {
    if (next === mode) return;
    setMode(next);
    if (isDemo) return;
    try {
      await fetch("/api/me/role", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: next }),
      });
    } catch { /* best-effort */ }
  }

  if (!roleLoaded) {
    return (
      <div className="min-h-screen grid place-items-center">
        <ParticleField />
        <motion.div
          className="flex flex-col items-center gap-4 z-10"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
        >
          <div className="w-10 h-10 rounded-full border-2 border-term-violet/30 border-t-term-violet animate-spin" />
          <span className="font-display text-sm tracking-[0.3em] text-white/40 uppercase">
            Loading Terminal…
          </span>
        </motion.div>
      </div>
    );
  }

  const isCreator = mode === "creator";

  return (
    <div className="relative min-h-screen">
      <ParticleField />

      {/* Ambient glow per mode */}
      <div
        className="fixed inset-0 pointer-events-none z-0 transition-all duration-700"
        style={{
          background: isCreator
            ? "radial-gradient(ellipse 60% 40% at 80% 10%, rgba(168,85,247,0.08) 0%, transparent 70%)"
            : "radial-gradient(ellipse 60% 40% at 20% 10%, rgba(34,211,238,0.08) 0%, transparent 70%)",
        }}
      />

      <main className="relative z-10 min-h-screen p-4 md:p-6 flex flex-col gap-5">
        {/* Header */}
        <motion.header
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.06]"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-2.5 h-2.5 rounded-full animate-pulse"
              style={{
                background: isCreator ? "#a855f7" : "#22d3ee",
                boxShadow: isCreator
                  ? "0 0 12px rgba(168,85,247,0.8)"
                  : "0 0 12px rgba(34,211,238,0.8)",
              }}
            />
            <h1
              className={`font-display font-bold text-base tracking-[0.2em] uppercase transition-all duration-500 ${
                isCreator ? "text-gradient-creator" : "text-gradient-trader"
              }`}
            >
              <span className="hidden md:inline">
                {isCreator ? "AURA // CREATOR DASHBOARD" : "AURA // TRENCH TERMINAL"}
              </span>
              <span className="md:hidden">
                {isCreator ? "AURA CREATOR" : "AURA TRADER"}
              </span>
            </h1>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
            {/* Animated mode toggle */}
            <div
              ref={pillRef}
              className="relative flex items-center rounded-full p-0.5 text-[10px] uppercase tracking-widest font-bold"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <AnimatePresence>
                <motion.div
                  className="absolute top-0.5 bottom-0.5 rounded-full"
                  layoutId="mode-pill"
                  animate={{
                    left: isCreator ? "2px" : "50%",
                    right: isCreator ? "50%" : "2px",
                    background: isCreator
                      ? "rgba(168,85,247,0.25)"
                      : "rgba(34,211,238,0.2)",
                    boxShadow: isCreator
                      ? "0 0 12px rgba(168,85,247,0.3)"
                      : "0 0 12px rgba(34,211,238,0.3)",
                  }}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              </AnimatePresence>
              <button
                onClick={() => switchMode("creator")}
                className={`relative z-10 px-4 py-1.5 rounded-full transition-colors duration-200 ${
                  isCreator ? "text-term-violet" : "text-white/30 hover:text-white/60"
                }`}
              >
                Creator
              </button>
              <button
                onClick={() => switchMode("trader")}
                className={`relative z-10 px-4 py-1.5 rounded-full transition-colors duration-200 ${
                  !isCreator ? "text-term-cyan" : "text-white/30 hover:text-white/60"
                }`}
              >
                Fan
              </button>
            </div>

            <TokenSwitcher
              value={mint}
              onChange={(m, s) => { setMint(m); setSymbol(s); }}
            />
          </div>
        </motion.header>

        {/* Content */}
        <AnimatePresence mode="wait">
          {mint ? (
            <motion.div
              key="terminal"
              className="flex flex-col gap-5"
              variants={stagger}
              initial="hidden"
              animate="show"
            >
              <motion.div variants={fadeUp}>
                <TickerBar mint={mint} symbol={symbol} />
              </motion.div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                <motion.div
                  className="lg:col-span-7 flex flex-col gap-5 min-w-0"
                  variants={stagger}
                  initial="hidden"
                  animate="show"
                >
                  <AnimatePresence>
                    {isCreator && (
                      <motion.div
                        key="revenue"
                        variants={fadeUp}
                        initial="hidden"
                        animate="show"
                        exit={{ opacity: 0, y: -8 }}
                      >
                        <RevenueSparkline mint={mint} />
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <motion.div variants={fadeUp}><MarketSignals mint={mint} /></motion.div>
                  <motion.div variants={fadeUp}><HolderTreemap mint={mint} /></motion.div>
                </motion.div>

                <motion.div
                  className="lg:col-span-5 flex flex-col gap-5 min-w-0"
                  variants={stagger}
                  initial="hidden"
                  animate="show"
                >
                  <AnimatePresence mode="wait">
                    {isCreator ? (
                      <motion.div key="insight" variants={fadeUp} initial="hidden" animate="show" exit={{ opacity: 0 }}>
                        <InsightCard mint={mint} />
                      </motion.div>
                    ) : (
                      <motion.div key="swap" variants={fadeUp} initial="hidden" animate="show" exit={{ opacity: 0 }}>
                        <SwapPanel mint={mint} symbol={symbol} />
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <motion.div className={!isCreator ? "flex-1 min-h-[500px]" : ""} variants={fadeUp}>
                    <ActivityFeed mint={mint} />
                  </motion.div>
                </motion.div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              className="flex-1 flex items-center justify-center py-20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {isCreator ? (
                isDemo ? (
                  <div className="panel p-10 max-w-lg w-full text-center space-y-4" style={{ borderColor: "rgba(245,158,11,0.2)" }}>
                    <div className="text-4xl mb-2">⟐</div>
                    <p className="text-term-amber text-xs tracking-[0.25em] uppercase font-display font-semibold">Demo Mode</p>
                    <p className="text-white/40 text-sm leading-relaxed">Launching tokens is disabled in demo. Sign up to register and monitor your own creator token.</p>
                  </div>
                ) : (
                  <LaunchPanel onSuccess={(m, s) => { setMint(m); setSymbol(s); }} />
                )
              ) : (
                <div className="panel panel-trader p-10 max-w-sm w-full text-center space-y-5">
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center mx-auto"
                    style={{ background: "rgba(34,211,238,0.1)", boxShadow: "0 0 30px rgba(34,211,238,0.2)" }}
                  >
                    <span className="text-term-cyan text-2xl">⟐</span>
                  </div>
                  <div>
                    <p className="font-display font-bold text-white/80 mb-1">Select a Token</p>
                    <p className="text-white/35 text-sm leading-relaxed">Click <span className="text-term-cyan font-medium">+ link token</span> above to load the trader terminal.</p>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        <footer className="text-[10px] text-white/20 text-right tracking-widest pt-3 border-t border-white/[0.04] font-mono">
          BAGS × BIRDEYE × HELIUS × PRIVY · v0.1.0
        </footer>
      </main>
    </div>
  );
}
