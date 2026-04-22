export default function Loading() {
  return (
    <div className="min-h-screen bg-term-bg grid place-items-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 rounded-full border-2 border-term-violet/20 border-t-term-violet animate-spin" />
        <span className="font-mono text-xs tracking-[0.3em] text-white/25 uppercase">
          Booting terminal…
        </span>
      </div>
    </div>
  );
}
