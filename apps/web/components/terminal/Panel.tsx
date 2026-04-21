"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface PanelProps {
  title: string;
  tag?: string;
  right?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
  variant?: "default" | "creator" | "trader";
}

export function Panel({ title, tag, right, className, children, variant = "default" }: PanelProps) {
  const accentClass =
    variant === "creator" ? "panel-creator" :
    variant === "trader"  ? "panel-trader"  : "";

  const tagColor =
    variant === "creator"
      ? "text-term-violet bg-term-violet/10 border border-term-violet/30"
      : variant === "trader"
      ? "text-term-cyan bg-term-cyan/10 border border-term-cyan/30"
      : "text-term-green bg-term-green/10 border border-term-green/20";

  return (
    <motion.section
      className={cn("panel flex flex-col", accentClass, className)}
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
    >
      <header className="panel-header">
        <div className="flex items-center gap-2.5">
          {tag && (
            <span className={cn("text-[9px] font-bold tracking-[0.25em] px-1.5 py-0.5 rounded-sm", tagColor)}>
              {tag}
            </span>
          )}
          <span className="font-display font-semibold text-[11px] tracking-[0.15em] text-white/70 uppercase">
            {title}
          </span>
        </div>
        <div className="text-[10px] text-white/25 tabular-nums">{right}</div>
      </header>
      <div className="panel-body flex-1 overflow-hidden">{children}</div>
    </motion.section>
  );
}
