"use client";

import { FormEvent, useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { usePlayers } from "@/stores/usePlayers";
import Image from "next/image";
import { Slider } from "@/components/ui/slider";
import clsx from "clsx";
import { PlayerAttributes } from "@/types/player";

const realismOptions = [
  { label: "Cinematic realism", value: "cinematic" },
  { label: "Hyperreal", value: "hyperreal" },
  { label: "Stylized art", value: "stylized" },
  { label: "Anime hero", value: "anime" }
];

const positions = [
  "Forward",
  "Midfielder",
  "Defender",
  "Goalkeeper",
  "Striker",
  "Point Guard",
  "Wing",
  "Center"
];

const accessoriesList = ["Arm sleeve", "Headband", "Visor", "Captain armband", "Smart boots"];

export function PlayerStudio() {
  const { addPlayer, players, removePlayer } = usePlayers();
  const [loading, setLoading] = useState(false);
  const initialAttributes: PlayerAttributes = {
    name: "Nova Vega",
    age: 22,
    position: "Forward",
    physique: "explosive athletic build",
    ethnicity: "Afro-Latinx",
    hairstyle: "braided undercut with neon tips",
    eyeColor: "ice blue",
    dominantHand: "left",
    personality: "fearless leadership",
    uniformStyle: "next-gen aerodynamic suit",
    primaryColor: "#3b82f6",
    secondaryColor: "#f97316",
    accessories: ["Arm sleeve"],
    backgroundStory: "Rising from underground street leagues to captaining an interstellar franchise.",
    environment: "stadium tunnel with volumetric lights",
    teamName: "Orion Pulse",
    lighting: "dramatic rim light and neon reflections",
    realismLevel: "cinematic",
    powerRating: 88
  };

  const [attributes, setAttributes] = useState<PlayerAttributes>(initialAttributes);

  const [selectedAccessories, setSelectedAccessories] = useState<string[]>(attributes.accessories);

  const accessoriesMap = useMemo<Record<string, boolean>>(() => {
    return Object.fromEntries(accessoriesList.map((item) => [item, selectedAccessories.includes(item)]));
  }, [selectedAccessories]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    try {
      const response = await fetch("/api/players/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          attributes: {
            ...attributes,
            accessories: selectedAccessories
          }
        })
      });
      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload.error ?? "generation failed");
      }
      addPlayer({
        id: crypto.randomUUID(),
        name: attributes.name,
        prompt: payload.prompt,
        imageUrl: payload.imageUrl,
        createdAt: Date.now(),
        attributes: { ...attributes, accessories: selectedAccessories }
      });
    } catch (error) {
      console.error(error);
      alert("Generation failed. Try adjusting attributes or verify your API keys.");
    } finally {
      setLoading(false);
    }
  };

  const update = <K extends keyof PlayerAttributes>(key: K, value: PlayerAttributes[K]) => {
    setAttributes((prev) => ({ ...prev, [key]: value }));
  };

  const toggleAccessory = (item: string) => {
    setSelectedAccessories((prev) =>
      prev.includes(item) ? prev.filter((entry) => entry !== item) : [...prev, item]
    );
  };

  return (
    <Card
      title="Player Imagery Lab"
      description="Transform attribute-driven character blueprints into high-fidelity renders using diffusion pipelines."
    >
      <form onSubmit={handleSubmit} className="grid gap-6 md:grid-cols-[1.2fr_1fr]">
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Name"
              name="name"
              value={attributes.name}
              onChange={(event) => update("name", event.target.value)}
              required
            />
            <Input
              label="Age"
              type="number"
              name="age"
              value={attributes.age}
              onChange={(event) => update("age", Number(event.target.value))}
            />
            <Select
              label="Position"
              name="position"
              options={positions.map((position) => ({ label: position, value: position }))}
              value={attributes.position}
              onChange={(event) => update("position", event.target.value)}
            />
            <Select
              label="Realism"
              name="realism"
              options={realismOptions}
              value={attributes.realismLevel}
              onChange={(event) => update("realismLevel", event.target.value as PlayerAttributes["realismLevel"])}
            />
          </div>
          <Textarea
            label="Physique & Personality"
            value={`${attributes.physique}; ${attributes.personality}`}
            onChange={(event) => {
              const segments = event.target.value.split(";");
              update("physique", (segments[0]?.trim() ?? attributes.physique) as PlayerAttributes["physique"]);
              update("personality", (segments[1]?.trim() ?? attributes.personality) as PlayerAttributes["personality"]);
            }}
          />
          <Textarea
            label="Background Story"
            value={attributes.backgroundStory}
            onChange={(event) => update("backgroundStory", event.target.value)}
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Primary Color"
              type="color"
              value={attributes.primaryColor}
              onChange={(event) => update("primaryColor", event.target.value)}
            />
            <Input
              label="Secondary Color"
              type="color"
              value={attributes.secondaryColor}
              onChange={(event) => update("secondaryColor", event.target.value)}
            />
            <Input
              label="Environment"
              value={attributes.environment}
              onChange={(event) => update("environment", event.target.value)}
            />
            <Input
              label="Team Identity"
              value={attributes.teamName}
              onChange={(event) => update("teamName", event.target.value)}
            />
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {accessoriesList.map((item) => {
              const active = accessoriesMap[item];
              return (
                <button
                  key={item}
                  type="button"
                  onClick={() => toggleAccessory(item)}
                  className={clsx(
                    "rounded-xl border px-3 py-2 text-left text-sm transition",
                    active
                      ? "border-emerald-400 bg-emerald-500/10 text-emerald-100 shadow shadow-emerald-500/20"
                      : "border-slate-700 bg-slate-900/60 text-slate-300 hover:border-emerald-500/40"
                  )}
                >
                  {item}
                </button>
              );
            })}
          </div>

          <Slider
            label={`Power Index: ${attributes.powerRating}`}
            min={60}
            max={99}
            value={attributes.powerRating}
            onChange={(event) => update("powerRating", Number(event.target.value))}
          />

          <Button type="submit" loading={loading}>
            Generate Player Render
          </Button>
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl border border-indigo-500/40 bg-indigo-500/10 p-4 text-sm text-indigo-100">
            <p>
              The agent composes a rich prompt leveraging attribute semantics. If Replicate tokens are configured,
              renders stream from Flux Dev. Otherwise, procedural placeholders visualize the concept.
            </p>
          </div>
          <div className="space-y-3">
            {players.slice(0, 6).map((player) => (
              <div key={player.id} className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/40">
                <div className="relative aspect-square">
                  <Image src={player.imageUrl} alt={player.name} fill className="object-cover" />
                </div>
                <div className="p-4 text-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-white">{player.name}</p>
                      <p className="text-xs text-slate-400">
                        {new Date(player.createdAt).toLocaleTimeString()} • {player.attributes.teamName}
                      </p>
                    </div>
                    <Button variant="ghost" onClick={() => removePlayer(player.id)} className="text-xs text-rose-300">
                      Remove
                    </Button>
                  </div>
                  <details className="mt-2 text-xs text-slate-300">
                    <summary className="cursor-pointer text-indigo-200">Prompt</summary>
                    <p className="mt-2 whitespace-pre-wrap">{player.prompt}</p>
                  </details>
                </div>
              </div>
            ))}
          </div>
        </div>
      </form>
    </Card>
  );
}
