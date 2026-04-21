import Link from "next/link";
import { AuraCheckInput } from "@/components/AuraCheckInput";
import { ParticleField } from "@/components/ParticleField";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-term-bg overflow-x-hidden selection:bg-term-violet/20 relative">
      <ParticleField />

      {/* Ambient glows */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] pointer-events-none"
        style={{ background: "radial-gradient(ellipse, rgba(168,85,247,0.12) 0%, transparent 70%)" }} />
      <div className="fixed top-1/3 left-10 w-72 h-72 bg-term-cyan/8 blur-[100px] rounded-full pointer-events-none animate-float" />
      <div className="fixed bottom-1/4 right-10 w-80 h-80 bg-term-violet/6 blur-[120px] rounded-full pointer-events-none animate-float" style={{ animationDelay: "3s" }} />

      {/* Scanlines overlay */}
      <div className="fixed inset-0 pointer-events-none z-[1]"
        style={{ background: "repeating-linear-gradient(to bottom, rgba(0,0,0,0) 0px, rgba(0,0,0,0) 2px, rgba(0,0,0,0.08) 2px, rgba(0,0,0,0.08) 4px)" }} />

      {/* Nav */}
      <nav className="relative z-10 flex items-center justify-between px-6 py-5 border-b"
        style={{ borderColor: "rgba(255,255,255,0.05)", backdropFilter: "blur(20px)" }}>
        <div className="flex items-center gap-3">
          <span className="w-2 h-2 rounded-full bg-term-violet animate-pulse"
            style={{ boxShadow: "0 0 10px rgba(168,85,247,0.8)" }} />
          <span className="font-display font-bold text-sm tracking-[0.3em] text-gradient-creator">AURA</span>
          <span className="hidden sm:inline text-white/25 text-[10px] tracking-widest font-mono">// BAGS.FM TERMINAL</span>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/login"
            className="text-white/40 hover:text-white text-[11px] tracking-[0.2em] uppercase transition-colors px-3 py-1.5 font-mono">
            Log In
          </Link>
          <Link href="/signup"
            className="px-5 py-2 rounded-full text-[11px] tracking-[0.2em] uppercase font-bold transition-all duration-200"
            style={{
              background: "rgba(168,85,247,0.15)",
              border: "1px solid rgba(168,85,247,0.4)",
              color: "#a855f7",
            }}
          >
            Sign Up
          </Link>
        </div>
      </nav>

      <div className="relative z-10 flex flex-col items-center pt-16 md:pt-24 pb-24 px-4">
        <div className="w-full max-w-5xl flex flex-col items-center">

          {/* Logo */}
          <div className="mb-10 animate-scaleIn">
            <div className="relative">
              <div className="absolute inset-0 blur-[40px] opacity-60"
                style={{ background: "radial-gradient(circle, rgba(168,85,247,0.6), transparent)" }} />
              <img src="/logo.png" alt="AURA Logo"
                className="relative w-24 h-24 md:w-32 md:h-32 drop-shadow-2xl animate-float"
                style={{ animationDuration: "4s" }} />
            </div>
          </div>

          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-8 animate-fadeIn"
            style={{ background: "rgba(168,85,247,0.1)", border: "1px solid rgba(168,85,247,0.2)", animationDelay: "0.2s" }}>
            <span className="w-1.5 h-1.5 rounded-full bg-term-violet animate-pulse" />
            <span className="text-term-violet text-[10px] tracking-[0.3em] uppercase font-bold font-mono">
              BAGS.FM TERMINAL v0.1.0 ONLINE
            </span>
          </div>

          {/* Hero headline */}
          <div className="text-center space-y-5 mb-12 animate-slideUp" style={{ animationDelay: "0.3s" }}>
            <h1 className="text-4xl md:text-6xl font-display font-black text-white tracking-tight leading-tight">
              Your token has an{" "}
              <span className="text-gradient-creator">aura</span>.
              <br />
              <span className="text-white/40 text-3xl md:text-5xl font-bold">Do you know what it is?</span>
            </h1>

            <div className="flex justify-center">
              <div
                className="overflow-hidden whitespace-nowrap border-r-2 border-term-violet animate-typewriter text-white/40 text-xs md:text-sm font-mono tracking-[0.15em]"
                style={{ ["--type-to" as string]: "34ch" } as React.CSSProperties}
              >
                &gt; track_token_aura --live --based
              </div>
            </div>

            <p className="text-white/45 text-sm md:text-base max-w-2xl mx-auto font-mono leading-relaxed px-4">
              The AI-powered <span className="text-term-violet font-semibold">vibe check</span> for every creator token on Bags.fm.
              <br className="hidden md:block" />
              Know when to post, who&apos;s buying, and whether your community is{" "}
              <span className="text-term-cyan">based</span> or <span className="text-white/30">mid</span>.
            </p>
          </div>

          {/* Aura check widget */}
          <div className="w-full max-w-2xl mb-10 animate-slideUp" style={{ animationDelay: "0.5s" }}>
            <div className="panel rounded-2xl p-6 space-y-4"
              style={{ border: "1px solid rgba(168,85,247,0.2)", boxShadow: "0 0 40px rgba(168,85,247,0.08)" }}>
              <div className="text-center space-y-1">
                <p className="text-term-violet text-xs tracking-[0.3em] uppercase font-bold font-display">
                  Instant Vibe Check — No Signup Needed
                </p>
                <p className="text-white/30 text-[11px] font-mono">
                  Paste any Bags.fm token mint address and get your aura score in seconds.
                </p>
              </div>
              <AuraCheckInput />
            </div>
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center gap-4 mb-20 w-full sm:w-auto animate-slideUp"
            style={{ animationDelay: "0.7s" }}>
            <Link href="/signup"
              className="w-full sm:w-auto px-8 py-4 rounded-full font-display font-bold text-sm tracking-[0.2em] uppercase text-center transition-all duration-300"
              style={{
                background: "linear-gradient(135deg, rgba(168,85,247,0.25), rgba(34,211,238,0.15))",
                border: "1px solid rgba(168,85,247,0.5)",
                color: "#a855f7",
                boxShadow: "0 0 30px rgba(168,85,247,0.15)",
              }}
            >
              Launch Dashboard →
            </Link>
            <Link href="/terminal?demo=true"
              className="w-full sm:w-auto px-8 py-4 rounded-full font-display font-bold text-sm tracking-[0.2em] uppercase text-center transition-all duration-300 text-white/50 hover:text-white"
              style={{ border: "1px solid rgba(255,255,255,0.1)" }}
            >
              Try Demo
            </Link>
          </div>

          {/* Stats strip */}
          <div className="w-full grid grid-cols-2 md:grid-cols-4 gap-4 mb-24 animate-slideUp" style={{ animationDelay: "0.9s" }}>
            {[
              { label: "AI Signals",  value: "3 LAYERS", desc: "Timing · Whale · Momentum", color: "#a855f7" },
              { label: "Feed",        value: "REAL-TIME", desc: "Helius webhooks < 100ms",   color: "#22d3ee" },
              { label: "Vibe Check",  value: "AURA™",    desc: "0–100 composite score",      color: "#39ff88" },
              { label: "Share",       value: "1-CLICK",  desc: "OG cards for X & Discord",   color: "#f59e0b" },
            ].map((s) => (
              <div key={s.label}
                className="panel rounded-xl p-4 text-center transition-all duration-200 hover:-translate-y-1"
                style={{ border: `1px solid ${s.color}15` }}
              >
                <div className="text-[10px] tracking-[0.25em] uppercase mb-1 text-white/30">{s.label}</div>
                <div className="font-display font-bold text-sm tracking-widest mb-0.5" style={{ color: s.color }}>{s.value}</div>
                <div className="text-white/25 text-[9px] tracking-wide">{s.desc}</div>
              </div>
            ))}
          </div>

          {/* Dual-sided architecture */}
          <div className="w-full mb-16 animate-slideUp" style={{ animationDelay: "1.1s" }}>
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-4xl font-display font-black text-white tracking-tight mb-3">
                DUAL-SIDED <span className="text-gradient-creator">ARCHITECTURE</span>
              </h2>
              <div className="w-24 h-px mx-auto" style={{ background: "linear-gradient(90deg, transparent, rgba(168,85,247,0.5), transparent)" }} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
              {/* Creator */}
              <div className="panel rounded-2xl p-8 space-y-5 relative overflow-hidden transition-all duration-300 hover:-translate-y-1"
                style={{ border: "1px solid rgba(168,85,247,0.2)", boxShadow: "0 0 40px rgba(168,85,247,0.04)" }}>
                <div className="absolute top-0 right-0 w-40 h-40 blur-3xl pointer-events-none"
                  style={{ background: "rgba(168,85,247,0.12)" }} />
                <div className="relative">
                  <div className="inline-flex items-center gap-2 text-[10px] tracking-[0.2em] uppercase font-bold mb-4"
                    style={{ color: "#a855f7" }}>[01] THE CREATOR</div>
                  <h3 className="text-xl md:text-2xl font-display font-bold text-white mb-3">Own Your Economy</h3>
                  <ul className="space-y-3 text-white/45 text-sm mb-6">
                    {[
                      ["AI Intelligence Briefing", "Multi-signal analysis with timing, whale, and momentum recommendations."],
                      ["Revenue Tracking", "Monitor exact USD protocol fees on a 30-day sparkline."],
                      ["Holder Health", "Gini coefficient treemap instantly identifies dangerous whale concentration."],
                    ].map(([title, desc]) => (
                      <li key={title} className="flex items-start gap-3">
                        <span className="mt-0.5 flex-shrink-0" style={{ color: "#a855f7" }}>▸</span>
                        <span><strong className="text-white/70">{title}:</strong> {desc}</span>
                      </li>
                    ))}
                  </ul>
                  <Link href="/signup"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs tracking-widest uppercase font-bold transition-all duration-200"
                    style={{ background: "rgba(168,85,247,0.12)", border: "1px solid rgba(168,85,247,0.35)", color: "#a855f7" }}
                  >
                    Launch As Creator →
                  </Link>
                </div>
              </div>

              {/* Trader */}
              <div className="panel rounded-2xl p-8 space-y-5 relative overflow-hidden transition-all duration-300 hover:-translate-y-1"
                style={{ border: "1px solid rgba(34,211,238,0.15)", boxShadow: "0 0 40px rgba(34,211,238,0.03)" }}>
                <div className="absolute top-0 right-0 w-40 h-40 blur-3xl pointer-events-none"
                  style={{ background: "rgba(34,211,238,0.08)" }} />
                <div className="relative">
                  <div className="inline-flex items-center gap-2 text-[10px] tracking-[0.2em] uppercase font-bold mb-4"
                    style={{ color: "#22d3ee" }}>[02] THE TRADER</div>
                  <h3 className="text-xl md:text-2xl font-display font-bold text-white mb-3">Never Miss a Buy</h3>
                  <ul className="space-y-3 text-white/45 text-sm mb-6">
                    {[
                      ["Live Webhook Feed", "Transactions stream via Helius within milliseconds of hitting the chain."],
                      ["Aura Score™", "Instant vibe check on any token — share the score, flex your bags."],
                      ["Shareable Intel", "Dynamic OG cards for X and Discord — your aura score becomes your flex."],
                    ].map(([title, desc]) => (
                      <li key={title} className="flex items-start gap-3">
                        <span className="mt-0.5 flex-shrink-0" style={{ color: "#22d3ee" }}>▸</span>
                        <span><strong className="text-white/70">{title}:</strong> {desc}</span>
                      </li>
                    ))}
                  </ul>
                  <Link href="/signup"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs tracking-widest uppercase font-bold transition-all duration-200"
                    style={{ background: "rgba(34,211,238,0.08)", border: "1px solid rgba(34,211,238,0.3)", color: "#22d3ee" }}
                  >
                    Trade As Fan →
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <footer className="w-full pt-8 border-t flex flex-col sm:flex-row items-center justify-between gap-3 text-[10px] text-white/20 tracking-widest uppercase font-mono"
            style={{ borderColor: "rgba(255,255,255,0.05)" }}>
            <span>© 2026 Aura Terminal · For the bags.fm ecosystem</span>
            <span>BAGS × BIRDEYE × HELIUS × PRIVY · v0.1.0</span>
          </footer>
        </div>
      </div>
    </main>
  );
}
