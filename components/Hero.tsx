export function Hero() {
  return (
    <section className="rounded-3xl border border-indigo-500/30 bg-gradient-to-br from-indigo-600/20 via-transparent to-slate-900/80 p-8 shadow-glow sm:p-10">
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div className="max-w-2xl space-y-4">
          <span className="inline-flex items-center gap-2 rounded-full border border-indigo-400/40 bg-indigo-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-indigo-100">
            Agent Autonomous
          </span>
          <h1 className="text-3xl font-bold leading-tight text-white sm:text-4xl">
            Multi-Agent Studio for Forex Intelligence, Athlete Imagery, and 4K Storycraft
          </h1>
          <p className="text-base text-slate-300">
            SignalBot Orion scans macro catalysts in real-time, Synth Artist Vega crafts bespoke player renders, and
            Director Pulse stitches cinematic highlight reels. Adaptive learning loops tune outputs to every decision.
          </p>
        </div>
        <div className="grid w-full max-w-sm gap-3 rounded-2xl border border-slate-700 bg-slate-900/70 p-4 text-xs text-slate-300">
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Live Alerts</span>
            <span className="rounded-full bg-emerald-500/20 px-3 py-1 font-semibold text-emerald-200">ON</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Generation Queue</span>
            <span className="rounded-full bg-indigo-500/20 px-3 py-1 font-semibold text-indigo-200">Ready</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Learning Rate</span>
            <span className="rounded-full bg-amber-500/20 px-3 py-1 font-semibold text-amber-200">Adaptive</span>
          </div>
        </div>
      </div>
    </section>
  );
}
