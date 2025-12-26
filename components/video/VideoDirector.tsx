"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { composeVideoFromImages, VideoTheme } from "@/lib/videoComposer";
import { usePlayers } from "@/stores/usePlayers";

export function VideoDirector() {
  const { players } = usePlayers();
  const [theme, setTheme] = useState<VideoTheme>("cinematic");
  const [status, setStatus] = useState<string | null>(null);
  const [resolution, setResolution] = useState<"4k" | "1080p">("4k");
  const [isRendering, setIsRendering] = useState(false);
  const [customMusic, setCustomMusic] = useState<string>("");

  const videoFrames = players.slice(0, 8).map((player) => ({
    id: player.id,
    dataUrl: player.imageUrl,
    caption: player.name
  }));

  const handleCompose = async () => {
    if (!videoFrames.length) {
      alert("Generate at least one player render to produce a video.");
      return;
    }

    setIsRendering(true);
    setStatus("Initializing ffmpeg core...");

    try {
      const blob = await composeVideoFromImages({
        images: videoFrames,
        theme,
        resolution,
        backgroundMusic: customMusic || undefined
      });
      setStatus("Rendering complete. Preparing download...");
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = `player-showcase-${Date.now()}.mp4`;
      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);
      URL.revokeObjectURL(url);
      setStatus("Download started.");
    } catch (error) {
      console.error(error);
      setStatus("Video assembly failed. Review console output.");
    } finally {
      setIsRendering(false);
    }
  };

  return (
    <Card
      title="Video Director"
      description="Curate cinematic highlight reels from AI renders. Themes orchestrate transitions, effects, and motion cadence."
    >
      <div className="grid gap-6 md:grid-cols-[1.1fr_1fr]">
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-semibold text-indigo-100">Theme</h3>
            <div className="mt-3 flex flex-wrap gap-3">
              {(["cinematic", "electric", "retro", "neon"] as VideoTheme[]).map((option) => {
                const label = option.charAt(0).toUpperCase() + option.slice(1);
                const active = theme === option;
                return (
                  <button
                    key={option}
                    onClick={() => setTheme(option)}
                    className={`rounded-2xl px-4 py-2 text-sm font-semibold transition ${
                      active
                        ? "border border-indigo-400 bg-indigo-500/20 text-indigo-100 shadow shadow-indigo-500/30"
                        : "border border-slate-700 bg-slate-900/60 text-slate-300 hover:border-indigo-400/60"
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-indigo-100">Resolution</h3>
            <div className="mt-3 flex gap-3">
              {(["4k", "1080p"] as const).map((option) => {
                const label = option.toUpperCase();
                const active = resolution === option;
                return (
                  <button
                    key={option}
                    onClick={() => setResolution(option)}
                    className={`rounded-2xl px-4 py-2 text-sm font-semibold transition ${
                      active
                        ? "border border-emerald-400 bg-emerald-500/20 text-emerald-100 shadow shadow-emerald-500/30"
                        : "border border-slate-700 bg-slate-900/60 text-slate-300 hover:border-emerald-400/60"
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-indigo-100">Custom Music URL</label>
            <input
              type="url"
              placeholder="https://"
              value={customMusic}
              onChange={(event) => setCustomMusic(event.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-900/60 px-3 py-2 text-sm text-slate-100 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/40"
            />
            <p className="text-xs text-slate-400">
              Optional: provide a direct link to a royalty-free MP3. Defaults to curated theme tracks.
            </p>
          </div>

          <Button onClick={handleCompose} loading={isRendering}>
            {isRendering ? "Rendering..." : "Compose Highlight Film"}
          </Button>

          {status && (
            <div className="rounded-xl border border-indigo-500/40 bg-indigo-500/10 p-3 text-xs text-indigo-100">
              {status}
            </div>
          )}
          {isRendering && (
            <div className="h-2 w-full overflow-hidden rounded-full bg-slate-800">
              <div className="h-full w-2/3 animate-pulse bg-indigo-500"></div>
            </div>
          )}
        </div>

        <div>
          <h3 className="text-sm font-semibold text-indigo-100">Storyboard</h3>
          <div className="mt-3 grid grid-cols-2 gap-3">
            {videoFrames.map((frame, index) => (
              <div
                key={frame.id}
                className="overflow-hidden rounded-xl border border-slate-800/80 bg-slate-900/60 p-2 text-xs text-slate-300"
              >
                <img src={frame.dataUrl} alt={frame.caption} className="h-32 w-full rounded-lg object-cover" />
                <div className="mt-2 flex items-center justify-between text-[10px] uppercase tracking-wide text-slate-400">
                  <span>{index + 1}</span>
                  <span>{frame.caption}</span>
                </div>
              </div>
            ))}
            {!videoFrames.length && (
              <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 text-xs text-slate-400">
                Generate players to assemble a storyboard. The director will stitch up to eight frames into a 4K
                sequence.
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
