"use client";

import { usePrivy } from "@privy-io/react-auth";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const SESSION_KEY = "aura_role_selected";

function getDemoCookie(): boolean {
  if (typeof document === "undefined") return false;
  return document.cookie.split(";").some((c) => c.trim().startsWith("demo_mode=true"));
}
function setDemoCookie() {
  document.cookie = "demo_mode=true; path=/; max-age=86400; SameSite=Lax";
}
function clearDemoCookie() {
  document.cookie = "demo_mode=; path=/; max-age=0";
}

/** Set by OnboardingClient after a role is chosen — persists for this tab session only */
export function markRoleSelected() {
  try { sessionStorage.setItem(SESSION_KEY, "1"); } catch {}
}
function hasSelectedRoleThisSession(): boolean {
  try { return !!sessionStorage.getItem(SESSION_KEY); } catch { return false; }
}

export function LoginGate({ children }: { children: React.ReactNode }) {
  const { ready, authenticated, logout, user } = usePrivy();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isDemo, setIsDemo] = useState(false);
  // If role was already selected this session, skip the loading screen immediately
  const [checkingRole, setCheckingRole] = useState(() => !hasSelectedRoleThisSession());

  // Handle ?demo=true + read existing demo cookie
  useEffect(() => {
    if (searchParams.get("demo") === "true") {
      setDemoCookie();
      setIsDemo(true);
      router.replace("/terminal");
    } else {
      setIsDemo(getDemoCookie());
    }
  }, [searchParams, router]);

  // Route guard
  useEffect(() => {
    if (!ready) return;

    if (isDemo) {
      setCheckingRole(false);
      return;
    }

    if (!authenticated) {
      router.replace("/login");
      return;
    }

    // Already picked a role this session → go straight to terminal
    if (hasSelectedRoleThisSession()) {
      setCheckingRole(false);
      return;
    }

    // First visit this session → ask for role
    router.replace("/onboarding");
  }, [ready, authenticated, isDemo, router]);

  if (!ready && !isDemo) return <BootScreen label="booting terminal…" />;
  if (!authenticated && !isDemo) return <BootScreen label="redirecting…" />;
  if (!isDemo && checkingRole) return <BootScreen label="loading profile…" />;

  const handleDisconnect = () => {
    if (isDemo) {
      clearDemoCookie();
    } else {
      logout();
    }
    try { sessionStorage.removeItem(SESSION_KEY); } catch {}
    router.push("/");
  };

  return (
    <>
      {children}
      <WalletBadge
        address={isDemo ? "DemoMode" : user?.wallet?.address}
        onLogout={handleDisconnect}
        isDemo={isDemo}
      />
    </>
  );
}

function BootScreen({ label }: { label: string }) {
  return (
    <div className="min-h-screen grid place-items-center text-term-dim">
      <div className="flex flex-col items-center gap-3 animate-fadeIn">
        <div className="w-6 h-6 border-2 border-term-violet/30 border-t-term-violet rounded-full animate-spin" />
        <span className="tracking-[0.3em] text-xs uppercase">{label}</span>
      </div>
    </div>
  );
}

function WalletBadge({ address, onLogout, isDemo }: {
  address?: string; onLogout: () => void; isDemo?: boolean;
}) {
  return (
    <div className="fixed bottom-4 right-4 z-40 flex items-center gap-3 text-xs panel px-3 py-2 animate-slideUp"
      style={{ border: "1px solid rgba(168,85,247,0.2)" }}>
      <span className={`inline-block w-2 h-2 rounded-full animate-pulse ${isDemo ? "bg-term-amber" : "bg-term-violet"}`}
        style={{ boxShadow: isDemo ? "0 0 8px rgba(245,158,11,0.6)" : "0 0 8px rgba(168,85,247,0.6)" }} />
      {isDemo && <span className="text-term-amber font-bold tracking-widest text-[10px]">DEMO</span>}
      <span className="text-white/40 font-mono">
        {address ? `${address.slice(0, 6)}…${address.slice(-4)}` : "—"}
      </span>
      <button onClick={onLogout}
        className="text-white/30 hover:text-term-red transition-colors duration-200 tracking-[0.1em] uppercase text-[10px]">
        disconnect
      </button>
    </div>
  );
}
