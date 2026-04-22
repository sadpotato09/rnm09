"use client";

import { useEffect, useState } from "react";

interface TypewriterProps {
  text: string;
  speed?: number;
  className?: string;
}

export function Typewriter({ text, speed = 55, className = "" }: TypewriterProps) {
  const [i, setI] = useState(0);

  useEffect(() => {
    if (i >= text.length) return;
    const t = setTimeout(() => setI((n) => n + 1), speed);
    return () => clearTimeout(t);
  }, [i, text, speed]);

  return (
    <span className={className}>
      {text.slice(0, i)}
      <span
        style={{
          display: "inline-block",
          width: 9,
          height: "1.1em",
          background: "#a855f7",
          marginLeft: 3,
          verticalAlign: "middle",
          animation: "auraBlink 1s steps(1) infinite",
          boxShadow: "0 0 10px rgba(168,85,247,0.6)",
        }}
      />
    </span>
  );
}
