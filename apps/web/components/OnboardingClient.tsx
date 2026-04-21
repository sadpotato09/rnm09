"use client";

import { usePrivy } from "@privy-io/react-auth";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ParticleField } from "./ParticleField";

type Role = "creator" | "trader";

const CARDS: { role: Role; num: string; label: string; headline: string; desc: string; features: string[]; color: string; glow: string }[] = [
  {
    role: "creator", num: "01", label: "Creator", headline: "I launched a token",
    desc: "Track revenue, analyze holder health, and get AI-powered timing insights for your Bags.fm creator token.",
    features: ["Revenue sparkline", "Holder treemap + Gini", "ML post-timing intel", "Whale concentration alerts"],
    color: "#a855f7", glow: "rgba(168,85,247,0.25)",
  },
  {
    role: "trader", num: "02", label: "Fan / Trader", headline: "I buy tokens",
    desc: "Real-time transaction feeds, whale alerts, buy/sell pressure signals, and in-terminal swaps.",
    features: ["Helius live feed <100ms", "Aura Score™ on any token", "Whale alerts", "Shareable OG cards"],
    color: "#22d3ee", glow: "rgba(34,211,238,0.2)",
  },
];

function TiltCard({
  card, submitting, onClick,
}: {
  card: typeof CARDS[0];
  submitting: Role | null;
  onClick: () => void;
}) {
  const ref = useRef<HTMLButtonElement>(null);

  function handleMouseMove(e: React.MouseEvent<HTMLButtonElement>) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    el.style.transform = `perspective(800px) rotateY(${x * 12}deg) rotateX(${-y * 8}deg) scale(1.02)`;
  }

  function handleMouseLeave() {
    if (ref.current) ref.current.style.transform = "perspective(800px) rotateY(0deg) rotateX(0deg) scale(1)";
  }

  const isLoading = submitting === card.role;

  return (
    <motion.button
      ref={ref}
      onClick={onClick}
      disabled={!!submitting}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative text-left p-8 rounded-2xl overflow-hidden transition-all duration-200 disabled:opacity-50 disabled:cursor-wait w-full"
      style={{
        background: `${card.color}08`,
        border: `1px solid ${card.color}25`,
        transformStyle: "preserve-3d",
        transition: "transform 0.15s ease, box-shadow 0.15s ease",
        boxShadow: `0 8px 32px rgba(0,0,0,0.4), 0 0 0 1px ${card.color}10`,
      }}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ boxShadow: `0 16px 48px rgba(0,0,0,0.5), 0 0 40px ${card.glow}` } as Record<string, string>}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
    >
      {/* Background glow blob */}
      <div
        className="absolute top-0 right-0 w-40 h-40 rounded-full blur-3xl pointer-events-none"
        style={{ background: card.glow, opacity: 0.4 }}
      />

      {/* Big number watermark */}
      <div
        className="absolute top-4 right-6 text-7xl font-display font-black pointer-events-none select-none"
        style={{ color: card.color, opacity: 0.07 }}
      >
        {card.num}
      </div>

      <div className="relative z-10 space-y-4">
        {/* Label chip */}
        <div
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold tracking-[0.2em] uppercase"
          style={{ background: `${card.color}15`, border: `1px solid ${card.color}30`, color: card.color }}
        >
          <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: card.color }} />
          {card.label}
        </div>

        <h3 className="text-2xl font-display font-bold text-white">{card.headline}</h3>
        <p className="text-white/45 text-sm leading-relaxed">{card.desc}</p>

        {/* Features */}
        <ul className="space-y-1.5">
          {card.features.map((f) => (
            <li key={f} className="flex items-center gap-2.5 text-xs text-white/50">
              <span className="w-1 h-1 rounded-full flex-shrink-0" style={{ background: card.color }} />
              {f}
            </li>
          ))}
        </ul>

        {/* CTA */}
        <div
          className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest mt-2"
          style={{ color: card.color }}
        >
          {isLoading ? (
            <>
              <div className="w-3.5 h-3.5 rounded-full border-2 border-current border-t-transparent animate-spin" />
              <span>Saving…</span>
            </>
          ) : (
            <>
              <span>Enter {card.label} Mode</span>
              <motion.span animate={{ x: [0, 4, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>→</motion.span>
            </>
          )}
        </div>
      </div>
    </motion.button>
  );
}

export function OnboardingClient() {
  const { ready, authenticated } = usePrivy();
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [submitting, setSubmitting] = useState<Role | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!ready) return;

    if (typeof document !== "undefined" && document.cookie.includes("demo_mode=true")) {
      router.replace("/terminal");
      return;
    }

    if (!authenticated) {
      router.replace("/login");
      return;
    }

    setChecking(false);
  }, [ready, authenticated, router]);

  async function chooseRole(role: Role) {
    if (submitting) return;
    setSubmitting(role);
    setError(null);
    try {
      const res = await fetch("/api/me/role", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role }),
      });
      if (!res.ok) {
        const { error: msg } = await res.json().catch(() => ({ error: "failed" }));
        throw new Error(msg || "failed to save role");
      }
      router.replace("/terminal");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setSubmitting(null);
    }
  }

  if (checking) {
    return (
      <div className="min-h-screen grid place-items-center">
        <ParticleField />
        <motion.div
          className="flex flex-col items-center gap-4 z-10"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        >
          <div className="w-10 h-10 rounded-full border-2 border-term-violet/30 border-t-term-violet animate-spin" />
          <span className="font-display text-sm tracking-[0.3em] text-white/30 uppercase">Configuring…</span>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-term-bg flex flex-col items-center justify-center p-6 overflow-hidden">
      <ParticleField />

      {/* Ambient glows */}
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-term-violet/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="fixed bottom-0 right-1/4 w-96 h-96 bg-term-cyan/8 blur-[120px] rounded-full pointer-events-none" />

      <div className="relative z-10 w-full max-w-3xl space-y-10">
        {/* Header */}
        <motion.div
          className="text-center space-y-3"
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
        >
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-bold tracking-[0.3em] uppercase mb-2"
            style={{ background: "rgba(168,85,247,0.1)", border: "1px solid rgba(168,85,247,0.25)", color: "#a855f7" }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-term-violet animate-pulse" />
            Final Step
          </div>
          <h2 className="text-3xl md:text-4xl font-display font-bold text-white tracking-tight">
            Choose your <span className="text-gradient-creator">role</span>
          </h2>
          <p className="text-white/35 text-sm">Your default terminal view — you can switch anytime.</p>
        </motion.div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {CARDS.map((card) => (
            <TiltCard
              key={card.role}
              card={card}
              submitting={submitting}
              onClick={() => chooseRole(card.role)}
            />
          ))}
        </div>

        {error && (
          <motion.p
            className="text-center text-term-red text-xs tracking-widest uppercase"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          >
            {error}
          </motion.p>
        )}
      </div>
    </div>
  );
}
