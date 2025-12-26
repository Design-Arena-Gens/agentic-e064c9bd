 "use client";

import { FFmpeg } from "@ffmpeg/ffmpeg";
import { toBlobURL } from "@ffmpeg/util";

export type VideoTheme = "electric" | "cinematic" | "retro" | "neon";

const themeMap: Record<VideoTheme, { transition: string; lut: string; music: string }> = {
  electric: {
    transition: "fade",
    lut: "none",
    music:
      "https://cdn.pixabay.com/download/audio/2022/02/16/audio_88a69ff84f.mp3?filename=future-technology-112366.mp3"
  },
  cinematic: {
    transition: "crossfade",
    lut: "cinematic",
    music:
      "https://cdn.pixabay.com/download/audio/2021/09/18/audio_3f70ce76d9.mp3?filename=epic-cinematic-heroic-drums-11589.mp3"
  },
  retro: {
    transition: "slide",
    lut: "retro",
    music:
      "https://cdn.pixabay.com/download/audio/2022/02/22/audio_6f66a701d7.mp3?filename=the-digital-era-11184.mp3"
  },
  neon: {
    transition: "glitch",
    lut: "neon",
    music:
      "https://cdn.pixabay.com/download/audio/2023/03/07/audio_c9f0b5014d.mp3?filename=night-run-145035.mp3"
  }
};

let ffmpegInstance: FFmpeg | null = null;

async function loadFFmpeg() {
  if (ffmpegInstance?.loaded) return ffmpegInstance;
  const instance = ffmpegInstance ?? new FFmpeg();
  await instance.load({
    coreURL: await toBlobURL(
      "https://unpkg.com/@ffmpeg/core@0.12.10/dist/ffmpeg-core.js",
      "text/javascript"
    ),
    wasmURL: await toBlobURL(
      "https://unpkg.com/@ffmpeg/core@0.12.10/dist/ffmpeg-core.wasm",
      "application/wasm"
    )
  });
  ffmpegInstance = instance;
  return instance;
}

type ComposeOptions = {
  images: { id: string; dataUrl: string; duration?: number; caption?: string }[];
  theme: VideoTheme;
  backgroundMusic?: string;
  resolution?: "4k" | "1080p";
};

const RESOLUTION_MAP = {
  "4k": { width: 3840, height: 2160 },
  "1080p": { width: 1920, height: 1080 }
};

export async function composeVideoFromImages(options: ComposeOptions) {
  const { images, theme, backgroundMusic, resolution = "4k" } = options;
  if (!images.length) throw new Error("No images supplied for video synthesis.");

  const ff = await loadFFmpeg();
  const { width, height } = RESOLUTION_MAP[resolution];

  await clearWorkingDirectory(ff);

  await Promise.all(
    images.map(async (image, idx) => {
      const data = image.dataUrl.split(",")[1];
      if (!data) throw new Error("Invalid image data URL.");
      const binary = Uint8Array.from(atob(data), (char) => char.charCodeAt(0));
      const name = `frame-${String(idx).padStart(2, "0")}.png`;
      await ff.writeFile(name, binary);
    })
  );

  const chosenTheme = themeMap[theme];

  const musicSource = backgroundMusic ?? chosenTheme.music;
  if (musicSource) {
    try {
      const response = await fetch(musicSource);
      if (!response.ok) throw new Error(`Failed to fetch music asset: ${response.statusText}`);
      const buffer = new Uint8Array(await response.arrayBuffer());
      await ff.writeFile("track.mp3", buffer);
    } catch (error) {
      console.warn("Unable to retrieve background music", error);
    }
  }

  const frameDuration = Math.max(3, Math.floor(12 / images.length));
  const filterComplex = [
    `color=size=${width}x${height}:duration=${images.length * frameDuration}:rate=30:color=black [base]`,
    images
      .map((_, idx) => {
        const delay = idx * frameDuration;
        return `[${idx}:v]scale=${width}x${height}:force_original_aspect_ratio=decrease,pad=${width}:${height}:(ow-iw)/2:(oh-ih)/2,format=yuv420p,setsar=1,trim=0:${frameDuration},setpts=PTS-STARTPTS+${delay}/TB[v${idx}]`;
      })
      .join("; ")
  ];

  const concatInputs = images.map((_, idx) => `[v${idx}]`).join("");
  const finalFilter = `${filterComplex.join("; ")}; ${concatInputs}concat=n=${images.length}:v=1:a=0,format=yuv420p[video]`;

  const args: string[] = [];

  images.forEach((_, idx) => {
    args.push("-loop", "1", "-t", String(frameDuration), "-i", `frame-${String(idx).padStart(2, "0")}.png`);
  });

  if (musicSource) {
    args.push("-i", "track.mp3");
  }

  args.push("-filter_complex", finalFilter, "-map", "[video]");

  if (musicSource) {
    args.push("-map", `${images.length}:a`, "-shortest");
  }

  args.push(
    "-c:v",
    "libx264",
    "-pix_fmt",
    "yuv420p",
    "-preset",
    "slow",
    "-b:v",
    "25M",
    "-y",
    "output.mp4"
  );

  const exitCode = await ff.exec(args);
  if (exitCode !== 0) {
    throw new Error(`ffmpeg exited with code ${exitCode}`);
  }

  const data = await ff.readFile("output.mp4");
  const buffer =
    data instanceof Uint8Array
      ? data
      : typeof data === "string"
        ? new TextEncoder().encode(data)
        : new Uint8Array((data as ArrayBufferLike) ?? new ArrayBuffer(0));
  await cleanupArtefacts(ff, images.length, Boolean(musicSource));
  const copy = new Uint8Array(buffer.byteLength);
  copy.set(buffer);
  return new Blob([copy.buffer], { type: "video/mp4" });
}

async function clearWorkingDirectory(ff: FFmpeg) {
  try {
    const entries = await ff.listDir("/");
    await Promise.all(
      entries
        .filter(
          (entry) =>
            !entry.isDir &&
            (entry.name.startsWith("frame-") || entry.name === "output.mp4" || entry.name === "track.mp3")
        )
        .map(async (entry) => {
          try {
            await ff.deleteFile(entry.name);
          } catch (error) {
            console.warn("Unable to delete artifact", entry.name, error);
          }
        })
    );
  } catch (error) {
    console.warn("Failed to list ffmpeg directories", error);
  }
}

async function cleanupArtefacts(ff: FFmpeg, frameCount: number, hasAudio: boolean) {
  const tasks: Promise<unknown>[] = [];
  for (let idx = 0; idx < frameCount; idx += 1) {
    const name = `frame-${String(idx).padStart(2, "0")}.png`;
    tasks.push(
      ff.deleteFile(name).catch((error) => {
        console.warn("Failed to delete frame", name, error);
      })
    );
  }

  tasks.push(
    ff.deleteFile("output.mp4").catch(() => {
      // ignore
    })
  );

  if (hasAudio) {
    tasks.push(
      ff.deleteFile("track.mp3").catch(() => {
        // ignore
      })
    );
  }

  await Promise.all(tasks);
}
