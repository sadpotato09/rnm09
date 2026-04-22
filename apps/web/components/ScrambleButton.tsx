"use client";

import type { CSSProperties } from "react";
import { useEffect, useRef, useState } from "react";

const CHARS = "!<>-_\\/[]{}—=+*^?#abcdefghijklmnop0123456789";

interface ScrambleButtonProps {
  label: string;
  onClick?: () => void;
  disabled?: boolean;
  glow?: string;
  href?: string;
}

export function ScrambleButton({
  label,
  onClick,
  disabled = false,
  glow = "#a855f7",
  href,
}: ScrambleButtonProps) {
  const [display, setDisplay] = useState(label);
  const frameRef = useRef(0);
  const rafRef = useRef(0);

  function scramble() {
    cancelAnimationFrame(rafRef.current);
    const out = label.split("").map((c) => ({
      from: CHARS[Math.floor(Math.random() * CHARS.length)] ?? c,
      to: c,
      start: Math.floor(Math.random() * 20),
      end: 20 + Math.floor(Math.random() * 20),
    }));
    frameRef.current = 0;

    function tick() {
      let complete = 0;
      let str = "";
      for (let idx = 0; idx < out.length; idx++) {
        const item = out[idx];
        if (!item) continue;
        if (frameRef.current >= item.end) {
          complete++;
          str += item.to;
        } else if (frameRef.current >= item.start) {
          if (Math.random() < 0.28) {
            item.from = CHARS[Math.floor(Math.random() * CHARS.length)] ?? item.to;
          }
          str += item.from;
        } else {
          str += item.from;
        }
      }
      setDisplay(str);
      frameRef.current++;
      if (complete < out.length) {
        rafRef.current = requestAnimationFrame(tick);
      }
    }
    tick();
  }

  useEffect(() => () => cancelAnimationFrame(rafRef.current), []);

  const sharedStyle: CSSProperties = {
    background: `linear-gradient(135deg, ${glow}26, rgba(34,211,238,0.08))`,
    border: `1px solid ${glow}80`,
    color: glow,
    borderRadius: 6,
    boxShadow: `0 0 24px ${glow}26, inset 0 0 0 1px ${glow}20`,
    textShadow: `0 0 10px ${glow}`,
    fontFamily: "'JetBrains Mono', monospace",
    minWidth: 200,
    position: "relative",
  };

  const inner = (
    <>
      <span style={{ position: "relative", display: "inline-block" }}>
        {display}
        <span style={{ marginLeft: 8 }}>→</span>
      </span>
      {/* Corner ticks */}
      <span style={{ position: "absolute", left: 4, top: 4, width: 8, height: 8, borderLeft: `1px solid ${glow}`, borderTop: `1px solid ${glow}` }} />
      <span style={{ position: "absolute", right: 4, top: 4, width: 8, height: 8, borderRight: `1px solid ${glow}`, borderTop: `1px solid ${glow}` }} />
      <span style={{ position: "absolute", left: 4, bottom: 4, width: 8, height: 8, borderLeft: `1px solid ${glow}`, borderBottom: `1px solid ${glow}` }} />
      <span style={{ position: "absolute", right: 4, bottom: 4, width: 8, height: 8, borderRight: `1px solid ${glow}`, borderBottom: `1px solid ${glow}` }} />
    </>
  );

  if (href) {
    return (
      <a
        href={href}
        onMouseEnter={scramble}
        onFocus={scramble}
        className="inline-flex items-center justify-center px-7 py-3.5 font-display font-bold text-xs tracking-[0.25em] uppercase transition-all duration-200"
        style={sharedStyle}
      >
        {inner}
      </a>
    );
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={scramble}
      onFocus={scramble}
      className="px-7 py-3.5 font-display font-bold text-xs tracking-[0.25em] uppercase transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
      style={sharedStyle}
    >
      {inner}
    </button>
  );
}
