import type { CSSProperties } from "react";
import Link from "next/link";
import { ParticleField } from "@/components/ParticleField";
import { Typewriter } from "@/components/Typewriter";
import { LandingDemo, MegaInput } from "@/components/LandingDemo";

/* ── Corner-tick decoration for persona cards ── */
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

function Sparkline({ color = "#39ff88", glow = "rgba(57,255,136,0.5)" }: { color?: string; glow?: string }) {
  const bars = [30,42,38,55,48,62,58,70,65,75,68,80,72,85,78,92,82,88,79,90,84,95,88,91,85,94,88,97,92,99];
  return (
    <div className="flex items-end gap-[2px] h-16 p-2 rounded"
      style={{ background: "rgba(6,8,16,0.6)", border: "1px solid rgba(255,255,255,0.04)" }}>
      {bars.map((h, i) => (
        <div key={i} style={{
          flex: 1, height: `${h}%`,
          background: `linear-gradient(180deg, ${color}, ${color}33)`,
          boxShadow: `0 0 6px ${glow}`,
          borderRadius: "2px 2px 0 0",
        }} />
      ))}
    </div>
  );
}

function Treemap() {
  return (
    <div className="grid gap-[2px] h-24 p-1.5 rounded"
      style={{ background: "rgba(6,8,16,0.6)", border: "1px solid rgba(255,255,255,0.04)", gridTemplateColumns: "2fr 1fr 1fr", gridTemplateRows: "1fr 1fr" }}>
      <div style={{ gridRow: "1 / span 2", background: "rgba(168,85,247,0.35)", border: "1px solid rgba(168,85,247,0.55)", borderRadius: 3, display: "flex", alignItems: "flex-end", padding: 6, fontFamily: "'JetBrains Mono'", fontSize: 9, color: "#fff", letterSpacing: ".15em", fontWeight: 700 }}>7x..3f · 22%</div>
      <div style={{ background: "rgba(34,211,238,0.28)", border: "1px solid rgba(34,211,238,0.45)", borderRadius: 3, display: "flex", alignItems: "flex-end", padding: 4, fontSize: 8, color: "#fff", fontFamily: "'JetBrains Mono'" }}>12%</div>
      <div style={{ background: "rgba(168,85,247,0.22)", border: "1px solid rgba(168,85,247,0.38)", borderRadius: 3, display: "flex", alignItems: "flex-end", padding: 4, fontSize: 8, color: "#fff", fontFamily: "'JetBrains Mono'" }}>9%</div>
      <div style={{ background: "rgba(34,211,238,0.2)",  border: "1px solid rgba(34,211,238,0.35)", borderRadius: 3, display: "flex", alignItems: "flex-end", padding: 4, fontSize: 8, color: "#fff", fontFamily: "'JetBrains Mono'" }}>7%</div>
      <div style={{ background: "rgba(57,255,136,0.2)",  border: "1px solid rgba(57,255,136,0.38)", borderRadius: 3, display: "flex", alignItems: "flex-end", padding: 4, fontSize: 8, color: "#fff", fontFamily: "'JetBrains Mono'" }}>5%</div>
    </div>
  );
}

function LiveFeed() {
  const rows = [
    { t: "00:03", type: "BUY",  amt: "+$2,410", wallet: "9Fq..e2" },
    { t: "00:11", type: "BUY",  amt: "+$185",   wallet: "4Ab..7c" },
    { t: "00:28", type: "SELL", amt: "-$640",   wallet: "7xK..p9" },
    { t: "00:44", type: "BUY",  amt: "+$1,120", wallet: "Bh3..12" },
  ];
  return (
    <div className="rounded overflow-hidden" style={{ background: "rgba(6,8,16,0.6)", border: "1px solid rgba(255,255,255,0.04)" }}>
      {rows.map((r, i) => (
        <div key={i} className="flex items-center justify-between px-3 py-2 text-[11px] font-mono tabular-nums"
          style={{ borderTop: i === 0 ? "none" : "1px solid rgba(255,255,255,0.04)" }}>
          <span className="text-white/30">{r.t}</span>
          <span className={r.type === "BUY" ? "text-[#39ff88] font-bold" : "text-[#f43f5e] font-bold"}
            style={{ textShadow: r.type === "BUY" ? "0 0 6px rgba(57,255,136,0.5)" : "0 0 6px rgba(244,63,94,0.5)" }}>
            {r.type}
          </span>
          <span className="text-white/80">{r.amt}</span>
          <span className="text-white/40">{r.wallet}</span>
        </div>
      ))}
    </div>
  );
}

export default function LandingPage() {
  return (
    <main className="min-h-screen overflow-x-hidden relative" style={{ background: "#060810", color: "#e2eaff" }}>

      {/* ── Ambient background ── */}
      <ParticleField />

      {/* Top violet radial hero glow */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] pointer-events-none z-0"
        style={{ background: "radial-gradient(ellipse, rgba(168,85,247,0.14) 0%, transparent 70%)" }} />

      {/* Floating cyan orb */}
      <div className="fixed top-1/3 left-10 w-72 h-72 rounded-full pointer-events-none z-0"
        style={{ background: "rgba(34,211,238,0.08)", filter: "blur(100px)", animation: "auraFloat 8s ease-in-out infinite" }} />

      {/* Floating violet orb */}
      <div className="fixed bottom-1/4 right-10 w-80 h-80 rounded-full pointer-events-none z-0"
        style={{ background: "rgba(168,85,247,0.06)", filter: "blur(120px)", animation: "auraFloat 8s ease-in-out 3s infinite" }} />

      {/* CRT scanlines — inline so pointer-events-none is guaranteed via Tailwind utility */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          zIndex: 9998,
          backgroundImage:
            "linear-gradient(rgba(18,16,16,0) 50%, rgba(0,0,0,0.18) 50%), " +
            "linear-gradient(90deg, rgba(255,0,0,0.03), rgba(0,255,0,0.01), rgba(0,0,255,0.03))",
          backgroundSize: "100% 4px, 6px 100%",
        }}
      />

      {/* ── Nav ── */}
      <nav className="relative z-20 flex items-center justify-between px-6 py-5"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.05)", backdropFilter: "blur(20px)" }}>
        <div className="flex items-center gap-3">
          {/* Green live-status dot */}
          <span className="relative inline-flex w-2 h-2 rounded-full bg-[#39ff88]"
            style={{ boxShadow: "0 0 10px #39ff88" }}>
            <span className="absolute inset-0 rounded-full bg-[#39ff88] animate-ping opacity-60" />
          </span>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="AURA" className="w-6 h-6"
            style={{ filter: "drop-shadow(0 0 6px rgba(57,255,136,0.6))" }} />
          <span className="font-display font-black text-sm tracking-[0.3em] text-gradient-creator">AURA</span>
          <span className="hidden sm:inline text-white/25 text-[10px] tracking-widest font-mono">// BAGS.FM TERMINAL</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-4 text-[10px] tracking-[0.25em] uppercase text-white/30 mr-2 font-mono">
            <a href="#architecture" className="hover:text-white/80 transition-colors">Architecture</a>
            <a href="#aura" className="hover:text-white/80 transition-colors">Aura Score</a>
            <a href="#stack" className="hover:text-white/80 transition-colors">Stack</a>
          </div>
          <Link href="/login"
            className="text-white/40 hover:text-white text-[11px] tracking-[0.2em] uppercase transition-colors px-3 py-1.5 font-mono">
            Log In
          </Link>
          <Link href="/login"
            className="px-5 py-2 rounded-full text-[11px] tracking-[0.2em] uppercase font-bold font-mono transition-all"
            style={{ background: "rgba(168,85,247,0.15)", border: "1px solid rgba(168,85,247,0.4)", color: "#a855f7" }}>
            Sign Up
          </Link>
        </div>
      </nav>

      <div className="relative z-10 max-w-5xl mx-auto px-4 md:px-6 pt-12 md:pt-20 pb-20">

        {/* ── Hero ── */}
        <section className="flex flex-col items-center text-center mb-16">

          {/* Logo with green glow halo */}
          <div className="relative mb-8">
            <div className="absolute inset-0 rounded-full pointer-events-none"
              style={{ background: "radial-gradient(circle, rgba(57,255,136,0.4), transparent 65%)", filter: "blur(30px)", transform: "scale(1.4)" }} />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.png" alt="AURA" className="relative w-20 h-20 md:w-24 md:h-24"
              style={{ animation: "auraFloat 5s ease-in-out infinite" }} />
          </div>

          {/* Status badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-8"
            style={{ background: "rgba(168,85,247,0.1)", border: "1px solid rgba(168,85,247,0.25)" }}>
            <span className="w-1.5 h-1.5 rounded-full bg-[#a855f7]"
              style={{ animation: "auraBlink 1.4s steps(1) infinite", boxShadow: "0 0 6px #a855f7" }} />
            <span className="text-[#a855f7] text-[10px] tracking-[0.3em] uppercase font-bold font-mono">
              BAGS.FM TERMINAL v0.1.0 ONLINE
            </span>
          </div>

          {/* Typewriter CLI line */}
          <div className="mb-4">
            <Typewriter
              text="> track_token_aura --live --based"
              className="text-[#a855f7] text-xl md:text-2xl font-mono tracking-[0.12em]"
            />
          </div>

          {/* Main headline */}
          <h1
            className="font-display font-black text-white tracking-tight leading-[1.02] mb-5"
            style={{ fontSize: "clamp(40px, 7vw, 72px)" }}
          >
            Your token has an{" "}
            <span className="text-gradient-creator">aura.</span>
            <br />
            <span className="text-white/40">Do you know what it is?</span>
          </h1>

          <p className="text-white/50 text-[15px] md:text-base max-w-xl mx-auto font-mono leading-relaxed mb-10">
            The AI-powered <span className="text-[#a855f7] font-semibold">vibe check</span> for every creator token on Bags.fm.
            Know when to post, who&apos;s buying, and whether your community is{" "}
            <span className="text-[#22d3ee]">based</span> or <span className="text-white/30">mid</span>.
          </p>

          {/* Mega-Input with scramble button */}
          <div id="aura" className="w-full max-w-2xl mx-auto">
            <MegaInput />
          </div>

          {/* Demo shortcut */}
          <div className="mt-6 flex items-center gap-4">
            <span className="h-px w-16 bg-white/10" />
            <Link
              href="/terminal?demo=true"
              className="flex items-center gap-2 px-5 py-2.5 rounded-full text-[11px] tracking-[0.2em] uppercase font-bold font-mono transition-all duration-200 hover:-translate-y-0.5"
              style={{
                background: "rgba(34,211,238,0.06)",
                border: "1px solid rgba(34,211,238,0.25)",
                color: "#22d3ee",
              }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#22d3ee] animate-pulse"
                style={{ boxShadow: "0 0 6px #22d3ee" }} />
              Try Demo Mode
            </Link>
            <span className="h-px w-16 bg-white/10" />
          </div>
        </section>

        {/* ── Interactive AURA Score Demo ── */}
        <LandingDemo />

        {/* ── Stats Strip ── */}
        <section className="mb-20">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {(
              [
                { label: "AI Signals", value: "3 LAYERS",  desc: "Timing · Whale · Momentum", color: "#a855f7" },
                { label: "Feed",       value: "REAL-TIME", desc: "Helius < 100ms",             color: "#22d3ee" },
                { label: "Vibe Check", value: "AURA™",     desc: "0–100 composite",            color: "#39ff88" },
                { label: "Share",      value: "1-CLICK",   desc: "OG cards · X / Discord",     color: "#f59e0b" },
              ] as { label: string; value: string; desc: string; color: string }[]
            ).map((x) => (
              <div key={x.label}
                className="relative p-4 rounded-lg text-center transition-all hover:-translate-y-0.5"
                style={{ background: "rgba(12,16,24,0.65)", backdropFilter: "blur(20px)", border: `1px solid ${x.color}22` }}>
                <div className="text-[9px] tracking-[0.25em] uppercase mb-1 text-white/30 font-mono">{x.label}</div>
                <div className="font-display font-black text-base tracking-widest mb-0.5"
                  style={{ color: x.color, textShadow: `0 0 8px ${x.color}66` }}>{x.value}</div>
                <div className="text-white/30 text-[9px] tracking-wider font-mono">{x.desc}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Dual-Sided Architecture ── */}
        <section id="architecture" className="mb-20">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 text-[10px] tracking-[0.3em] uppercase text-[#a855f7] font-bold font-mono">
              <span className="w-6 h-px bg-[#a855f7]/50" />
              SECTION 02
              <span className="w-6 h-px bg-[#a855f7]/50" />
            </div>
            <h2 className="text-3xl md:text-5xl font-display font-black tracking-tight mt-3">
              DUAL-SIDED{" "}
              <span className="text-gradient-creator">ARCHITECTURE</span>
            </h2>
            <p className="text-white/40 text-sm font-mono mt-3">One terminal · two sides of the same trade</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            {/* [01] THE CREATOR */}
            <div className="relative p-8 rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1"
              style={{
                background: "rgba(12,16,24,0.72)",
                backdropFilter: "blur(20px) saturate(1.4)",
                border: "1px solid rgba(168,85,247,0.28)",
                boxShadow: "0 0 40px rgba(168,85,247,0.08), inset 0 1px 0 rgba(168,85,247,0.1)",
              }}>
              <div className="absolute -top-20 -right-20 w-60 h-60 rounded-full pointer-events-none"
                style={{ background: "rgba(168,85,247,0.18)", filter: "blur(60px)" }} />
              <Ticks color="#a855f7" />
              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] tracking-[0.3em] uppercase font-bold text-[#a855f7] font-mono">[01] THE CREATOR</span>
                  <span className="text-[9px] tracking-[0.25em] uppercase text-white/30 font-mono">/creator_mode.ts</span>
                </div>
                <h3 className="text-2xl md:text-3xl font-display font-black text-white mb-2 tracking-tight">
                  Own Your Economy
                </h3>
                <p className="text-white/45 text-sm font-mono leading-relaxed mb-6">
                  Monitor your fee revenue, spot dangerous whale concentration, and ship posts when your bags are actually watching.
                </p>

                {/* Revenue sparkline mock */}
                <div className="mb-5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[9px] tracking-[0.25em] uppercase text-white/35 font-mono">FEE REVENUE · 30D</span>
                    <span className="text-[10px] font-mono font-bold tabular-nums text-[#39ff88]"
                      style={{ textShadow: "0 0 8px rgba(57,255,136,0.5)" }}>
                      $12,847 ▲ 28%
                    </span>
                  </div>
                  <Sparkline color="#a855f7" glow="rgba(168,85,247,0.5)" />
                </div>

                {/* Holder treemap mock */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[9px] tracking-[0.25em] uppercase text-white/35 font-mono">HOLDER TREEMAP · GINI 0.41</span>
                    <span className="text-[10px] font-mono font-bold text-[#f59e0b]">WHALE CONC: MEDIUM</span>
                  </div>
                  <Treemap />
                </div>

                <ul className="space-y-2 mb-6 text-[12px]">
                  {(
                    [
                      ["AI Timing Insight", "Best-time-to-post · confidence band"],
                      ["Holder Health",     "Gini coefficient + whale alerts"],
                      ["Revenue Tracking",  "Exact USD protocol fees · 30d"],
                    ] as [string, string][]
                  ).map(([t, d]) => (
                    <li key={t} className="flex items-start gap-3 font-mono text-white/55">
                      <span className="mt-0.5 text-[#a855f7]">▸</span>
                      <span>
                        <b className="text-white/85">{t}</b>
                        {" · "}
                        <span className="text-white/40">{d}</span>
                      </span>
                    </li>
                  ))}
                </ul>

                <Link href="/login"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-[11px] tracking-[0.25em] uppercase font-bold font-mono transition-all"
                  style={{ background: "rgba(168,85,247,0.12)", border: "1px solid rgba(168,85,247,0.4)", color: "#a855f7" }}>
                  Launch as Creator →
                </Link>
              </div>
            </div>

            {/* [02] THE TRADER */}
            <div className="relative p-8 rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1"
              style={{
                background: "rgba(12,16,24,0.72)",
                backdropFilter: "blur(20px) saturate(1.4)",
                border: "1px solid rgba(34,211,238,0.22)",
                boxShadow: "0 0 40px rgba(34,211,238,0.06), inset 0 1px 0 rgba(34,211,238,0.08)",
              }}>
              <div className="absolute -top-20 -right-20 w-60 h-60 rounded-full pointer-events-none"
                style={{ background: "rgba(34,211,238,0.12)", filter: "blur(60px)" }} />
              <Ticks color="#22d3ee" />
              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] tracking-[0.3em] uppercase font-bold text-[#22d3ee] font-mono">[02] THE TRADER</span>
                  <span className="text-[9px] tracking-[0.25em] uppercase text-white/30 font-mono">/trader_mode.ts</span>
                </div>
                <h3 className="text-2xl md:text-3xl font-display font-black text-white mb-2 tracking-tight">
                  Never Miss a Buy
                </h3>
                <p className="text-white/45 text-sm font-mono leading-relaxed mb-6">
                  Transactions stream in under 100ms via Helius webhooks. Paste any mint, get the aura score, flex the OG card.
                </p>

                {/* Live feed mock */}
                <div className="mb-5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[9px] tracking-[0.25em] uppercase text-white/35 font-mono">LIVE FEED · HELIUS SSE</span>
                    <span className="text-[10px] font-mono font-bold text-[#39ff88] flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#39ff88]"
                        style={{ animation: "auraBlink 1.2s steps(1) infinite", boxShadow: "0 0 6px #39ff88" }} />
                      STREAMING
                    </span>
                  </div>
                  <LiveFeed />
                </div>

                <ul className="space-y-2 mb-6 text-[12px]">
                  {(
                    [
                      ["Live Webhook Feed", "< 100ms · Helius → Redis → SSE"],
                      ["AURA Score™",       "0–100 composite · tier-colored"],
                      ["Shareable Intel",   "OG cards for X & Discord"],
                    ] as [string, string][]
                  ).map(([t, d]) => (
                    <li key={t} className="flex items-start gap-3 font-mono text-white/55">
                      <span className="mt-0.5 text-[#22d3ee]">▸</span>
                      <span>
                        <b className="text-white/85">{t}</b>
                        {" · "}
                        <span className="text-white/40">{d}</span>
                      </span>
                    </li>
                  ))}
                </ul>

                <Link href="/login"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-[11px] tracking-[0.25em] uppercase font-bold font-mono transition-all"
                  style={{ background: "rgba(34,211,238,0.1)", border: "1px solid rgba(34,211,238,0.38)", color: "#22d3ee" }}>
                  Trade as Fan →
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ── Tech Stack ── */}
        <section id="stack" className="mb-8">
          <div className="flex items-center gap-4 mb-5">
            <span className="text-[10px] tracking-[0.3em] uppercase text-white/30 font-mono">// TECH_STACK</span>
            <span className="flex-1 h-px"
              style={{ background: "linear-gradient(90deg, rgba(168,85,247,0.4), transparent)" }} />
          </div>
          <div className="flex flex-wrap gap-2">
            {["NEXT.JS 16", "PRIVY", "NEON", "UPSTASH", "BIRDEYE", "HELIUS", "BAGS API", "FASTAPI · ML"].map((item) => (
              <span key={item}
                className="px-3 py-1.5 text-[10px] tracking-[0.2em] uppercase font-mono font-bold text-white/55"
                style={{ background: "rgba(12,16,24,0.6)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 4 }}>
                {item}
              </span>
            ))}
          </div>
        </section>

        {/* ── Footer ── */}
        <footer
          className="w-full pt-8 mt-16 border-t flex flex-col sm:flex-row items-center justify-between gap-3 text-[10px] text-white/25 tracking-widest uppercase font-mono"
          style={{ borderColor: "rgba(255,255,255,0.05)" }}>
          <span>© 2026 AURA · BAGS.FM TERMINAL</span>
          <span>BAGS × BIRDEYE × HELIUS × PRIVY</span>
          <span className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#39ff88]" style={{ boxShadow: "0 0 6px #39ff88" }} />
            v0.1.0 · ONLINE
          </span>
        </footer>

      </div>
    </main>
  );
}
