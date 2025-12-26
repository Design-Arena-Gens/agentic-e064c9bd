import { Providers } from "@/components/providers";
import { Hero } from "@/components/Hero";
import { NewsBoard } from "@/components/news/NewsBoard";
import { PlayerStudio } from "@/components/players/PlayerStudio";
import { VideoDirector } from "@/components/video/VideoDirector";

export default function HomePage() {
  return (
    <Providers>
      <div className="flex flex-col gap-8">
        <Hero />
        <div className="grid gap-8">
          <NewsBoard />
          <PlayerStudio />
          <VideoDirector />
        </div>
      </div>
    </Providers>
  );
}
