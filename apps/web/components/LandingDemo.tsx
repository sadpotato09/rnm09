"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { AuraScoreCard, ScoreBreakdown } from "./AuraScoreCard";

const MOCK_SCORES = [
  { score: 92, symbol: "AURA", name: "based.aura.terminal",  mint: "AurA9z3k...7xFq2mP8vNc1Bh9LpTqDfW5xHyE4Rt" },
  { score: 81, symbol: "BAGS", name: "bags.protocol.fee",    mint: "Bg5Xm..9Kv2" },
  { score: 67, symbol: "CLIP", name: "creator.loop.index",   mint: "Cl1Pq..3Mn7" },
  { score: 48, symbol: "MID",  name: "mid.curve.token",      mint: "M1Dxy..8Jk3" },
  { score: 22, symbol: "RUG",  name: "concerning.holdings",  mint: "Ru9Zz..4Qw1" },
] as const;

export function LandingDemo() {
  const [variant, setVariant] = useState(0);
  const current = MOCK_SCORES[variant]!;

  return (
    <section className="mb-20">
      <div className="flex items-center justify-between mb-4">
        <span className="text-[10px] tracking-[0.3em] uppercase text-white/35 font-mono">// SCAN_RESULT</span>
        <div className="flex items-center gap-1">
          {MOCK_SCORES.map((s, i) => (
            <button
              key={i}
              onClick={() => setVariant(i)}
              className="px-2.5 py-1 text-[9px] tracking-[0.2em] uppercase font-mono font-bold transition-all"
              style={{
                background: i === variant ? "rgba(255,255,255,0.08)" : "transparent",
                border: `1px solid ${i === variant ? "rgba(255,255,255,0.25)" : "rgba(255,255,255,0.08)"}`,
                color: i === variant ? "#fff" : "rgba(255,255,255,0.4)",
                borderRadius: 3,
              }}
            >
              {s.score}
            </button>
          ))}
        </div>
      </div>

      <AuraScoreCard
        score={current.score}
        symbol={current.symbol}
        name={current.name}
        mint={current.mint}
        signals={{
          gini: (0.3 + (100 - current.score) / 200).toFixed(2),
          buyPct: Math.max(10, Math.min(88, current.score - 4)),
          holders: (current.score * 130).toLocaleString(),
          change24h: (current.score > 50 ? "+" : "") + (current.score / 4 - 8).toFixed(1),
        }}
      />

      <ScoreBreakdown score={current.score} />
    </section>
  );
}

/* ── MegaInput: command-line-style input with block cursor ── */
const SCRAMBLE_CHARS = "!<>-_\\/[]{}—=+*^?#abcdefghijklmnop0123456789";

export function MegaInput() {
  const [value, setValue] = useState("");
  const [focused, setFocused] = useState(false);
  const [loading, setLoading] = useState(false);
  const [display, setDisplay] = useState("CHECK AURA");
  const inputRef = useRef<HTMLInputElement>(null);
  const frameRef = useRef(0);
  const rafRef = useRef(0);
  const router = useRouter();

  const valid = value.trim().length >= 32;

  function scramble() {
    const label = "CHECK AURA";
    cancelAnimationFrame(rafRef.current);
    const out = label.split("").map((c) => ({
      from: SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)] ?? c,
      to: c,
      start: Math.floor(Math.random() * 20),
      end: 20 + Math.floor(Math.random() * 20),
    }));
    frameRef.current = 0;
    function tick() {
      let complete = 0; let str = "";
      for (let i = 0; i < out.length; i++) {
        const item = out[i];
        if (!item) continue;
        if (frameRef.current >= item.end) { complete++; str += item.to; }
        else if (frameRef.current >= item.start) {
          if (Math.random() < 0.28) item.from = SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)] ?? item.to;
          str += item.from;
        } else { str += item.from; }
      }
      setDisplay(str);
      frameRef.current++;
      if (complete < out.length) rafRef.current = requestAnimationFrame(tick);
      else setDisplay("CHECK AURA");
    }
    tick();
  }

  function handleScan() {
    const mint = value.trim();
    if (!mint || mint.length < 32) return;
    setLoading(true);
    router.push(`/aura/${mint}`);
  }

  return (
    <div className="w-full">
      <div
        className="flex items-center gap-3 px-5 py-5 relative cursor-text"
        style={{
          background: "rgba(6,8,16,0.85)",
          border: `1px solid ${focused ? "rgba(168,85,247,0.7)" : "rgba(168,85,247,0.28)"}`,
          borderRadius: 10,
          boxShadow: focused
            ? "0 0 40px rgba(168,85,247,0.22), inset 0 0 0 1px rgba(168,85,247,0.15)"
            : "0 0 30px rgba(168,85,247,0.08), inset 0 0 0 1px rgba(255,255,255,0.02)",
          transition: "all 0.25s ease",
        }}
        onClick={() => inputRef.current?.focus()}
      >
        <span className="text-[#a855f7] font-bold text-lg select-none" style={{ textShadow: "0 0 10px #a855f7" }}>
          &gt;
        </span>
        <div className="flex-1 relative flex items-center">
          <input
            ref={inputRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            onKeyDown={(e) => e.key === "Enter" && handleScan()}
            placeholder="Paste mint address to scan..."
            spellCheck={false}
            className="w-full bg-transparent outline-none text-white text-base tracking-wider placeholder:text-white/25"
            style={{ fontFamily: "'JetBrains Mono', monospace", caretColor: "transparent" }}
          />
          {/* Block cursor */}
          <span
            style={{
              position: "absolute",
              left: value.length === 0 ? 0 : `calc(${value.length}ch + 2px)`,
              top: "50%",
              transform: "translateY(-50%)",
              width: 10,
              height: 20,
              background: "#a855f7",
              boxShadow: "0 0 12px rgba(168,85,247,0.8)",
              animation: "auraBlink 1s steps(1) infinite",
              display: focused || value.length === 0 ? "block" : "none",
              pointerEvents: "none",
            }}
          />
        </div>
        <span className="hidden md:inline text-[10px] tracking-[0.25em] uppercase text-white/25 font-mono">
          ⏎ ENTER
        </span>
      </div>

      <div className="mt-5 flex justify-center">
        <button
          onClick={handleScan}
          disabled={!valid || loading}
          onMouseEnter={scramble}
          onFocus={scramble}
          className="relative px-7 py-3.5 font-display font-bold text-xs tracking-[0.25em] uppercase transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
          style={{
            background: "linear-gradient(135deg, rgba(168,85,247,0.15), rgba(34,211,238,0.08))",
            border: "1px solid rgba(168,85,247,0.5)",
            color: "#a855f7",
            borderRadius: 6,
            boxShadow: "0 0 24px rgba(168,85,247,0.15), inset 0 0 0 1px rgba(168,85,247,0.12)",
            textShadow: "0 0 10px #a855f7",
            fontFamily: "'JetBrains Mono', monospace",
            minWidth: 200,
          }}
        >
          <span>{loading ? "Scanning…" : display} →</span>
          <span style={{ position: "absolute", left: 4, top: 4, width: 8, height: 8, borderLeft: "1px solid #a855f7", borderTop: "1px solid #a855f7" }} />
          <span style={{ position: "absolute", right: 4, top: 4, width: 8, height: 8, borderRight: "1px solid #a855f7", borderTop: "1px solid #a855f7" }} />
          <span style={{ position: "absolute", left: 4, bottom: 4, width: 8, height: 8, borderLeft: "1px solid #a855f7", borderBottom: "1px solid #a855f7" }} />
          <span style={{ position: "absolute", right: 4, bottom: 4, width: 8, height: 8, borderRight: "1px solid #a855f7", borderBottom: "1px solid #a855f7" }} />
        </button>
      </div>

      <div className="mt-3 text-center text-[10px] tracking-[0.25em] uppercase text-white/25 font-mono">
        NO SIGNUP · NO WALLET · JUST VIBES
      </div>
    </div>
  );
}
