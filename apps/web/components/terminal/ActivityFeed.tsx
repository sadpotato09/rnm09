"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Panel } from "./Panel";
import { fmtNum, shortAddr, timeAgo } from "@/lib/utils";
import type { TxEvent } from "@creator-intel/shared";

interface Props { mint: string; }

const KIND_STYLE: Record<TxEvent["kind"], { color: string; bg: string }> = {
  buy:      { color: "#39ff88", bg: "rgba(57,255,136,0.08)"  },
  sell:     { color: "#f43f5e", bg: "rgba(244,63,94,0.08)"   },
  transfer: { color: "#22d3ee", bg: "rgba(34,211,238,0.06)"  },
  mint:     { color: "#f59e0b", bg: "rgba(245,158,11,0.06)"  },
  burn:     { color: "#f43f5e", bg: "rgba(244,63,94,0.06)"   },
  unknown:  { color: "#4a5a7a", bg: "transparent"            },
};

const MAX_BACKOFF_MS = 30_000;

export function ActivityFeed({ mint }: Props) {
  const [events, setEvents] = useState<TxEvent[]>([]);
  const [status, setStatus] = useState<"connecting" | "live" | "offline">("connecting");
  const esRef = useRef<EventSource | null>(null);
  const retryRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const attemptsRef = useRef(0);
  const mountedRef = useRef(true);

  const connect = useCallback(() => {
    if (!mountedRef.current) return;

    // Close any existing connection
    esRef.current?.close();
    setStatus("connecting");

    const es = new EventSource(`/api/feed/stream?mint=${mint}`);
    esRef.current = es;

    es.onopen = () => {
      if (!mountedRef.current) return;
      attemptsRef.current = 0;
      setStatus("live");
    };

    es.onmessage = (msg) => {
      if (!mountedRef.current) return;
      try {
        const event = JSON.parse(msg.data as string) as TxEvent;
        setEvents((prev) => [event, ...prev].slice(0, 50));
      } catch {}
    };

    es.onerror = () => {
      if (!mountedRef.current) return;
      es.close();
      setStatus("offline");

      // Exponential backoff: 1s, 2s, 4s, 8s … capped at 30s
      const delay = Math.min(1000 * 2 ** attemptsRef.current, MAX_BACKOFF_MS);
      attemptsRef.current += 1;
      retryRef.current = setTimeout(connect, delay);
    };
  }, [mint]);

  useEffect(() => {
    mountedRef.current = true;

    // Open the SSE only when the browser is idle — i.e. after all the short
    // data-fetches (/api/me, /api/revenue, /api/signals, /api/holders,
    // /api/insights, /api/me/role) have already claimed and released their
    // HTTP connection slots.  HTTP/1.1 caps connections at 6/host; firing the
    // permanent EventSource simultaneously starves one short fetch for ~20 s.
    //
    // requestIdleCallback fires once the call stack is empty and no pending
    // network responses are being processed.  The { timeout: 3000 } fallback
    // ensures we still connect within 3 s on slow cold starts.
    let ricId: number | null = null;
    let fallbackTimer: ReturnType<typeof setTimeout> | null = null;

    const startSSE = () => {
      if (mountedRef.current) connect();
    };

    if (typeof requestIdleCallback !== "undefined") {
      ricId = requestIdleCallback(startSSE, { timeout: 3000 });
    } else {
      // Safari / older environments — plain timeout covers cold starts
      fallbackTimer = setTimeout(startSSE, 2000);
    }

    return () => {
      mountedRef.current = false;
      if (ricId !== null) cancelIdleCallback(ricId);
      if (fallbackTimer !== null) clearTimeout(fallbackTimer);
      esRef.current?.close();
      if (retryRef.current) clearTimeout(retryRef.current);
    };
  }, [connect]);

  const statusDot =
    status === "live"       ? "#39ff88" :
    status === "offline"    ? "#f43f5e" : "#4a5a7a";

  const retryIn = status === "offline"
    ? Math.min(1000 * 2 ** attemptsRef.current, MAX_BACKOFF_MS) / 1000
    : null;

  return (
    <Panel
      title="Activity Feed" tag="FEED" variant="trader"
      right={
        <span className="flex items-center gap-1.5">
          <motion.span
            className="inline-block w-1.5 h-1.5 rounded-full"
            style={{ background: statusDot }}
            animate={{ opacity: status === "live" ? [1, 0.3, 1] : 1 }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <span style={{ color: statusDot }} className="font-mono text-[9px] tracking-widest">
            {status === "offline" && retryIn
              ? `RETRY ${retryIn.toFixed(0)}s`
              : status.toUpperCase()}
          </span>
        </span>
      }
    >
      <ul className="space-y-1 text-xs max-h-[380px] overflow-y-auto pr-1">
        {events.length === 0 && (
          <li className="text-white/25 italic py-6 text-center text-[11px] tracking-wider">
            {status === "connecting" ? "Connecting to feed…" : "Waiting for on-chain events…"}
          </li>
        )}
        <AnimatePresence initial={false}>
          {events.map((e) => {
            const s = KIND_STYLE[e.kind];
            return (
              <motion.li
                key={e.signature}
                className="flex items-center gap-2 tabular-nums py-1.5 px-2 rounded-lg"
                style={{ background: s.bg }}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <span className="text-[9px] font-bold uppercase w-10 tracking-widest" style={{ color: s.color }}>
                  {e.kind}
                </span>
                <span className="text-white/70 font-mono">{fmtNum(e.amount, { compact: true })}</span>
                <span className="text-white/30 text-[10px] truncate flex-1">
                  {e.fromWallet ? shortAddr(e.fromWallet) : "·"} → {e.toWallet ? shortAddr(e.toWallet) : "·"}
                </span>
                <span className="text-white/20 text-[9px] ml-auto">{timeAgo(e.blockTime)}</span>
              </motion.li>
            );
          })}
        </AnimatePresence>
      </ul>
    </Panel>
  );
}
