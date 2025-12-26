"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { PlayerAttributes } from "@/types/player";

export type PlayerProfile = {
  id: string;
  name: string;
  prompt: string;
  imageUrl: string;
  createdAt: number;
  attributes: PlayerAttributes;
};

type PlayerState = {
  players: PlayerProfile[];
  addPlayer: (player: PlayerProfile) => void;
  removePlayer: (id: string) => void;
  clear: () => void;
};

export const usePlayers = create<PlayerState>()(
  persist(
    (set, get) => ({
      players: [],
      addPlayer: (player) => set({ players: [player, ...get().players].slice(0, 24) }),
      removePlayer: (id) => set({ players: get().players.filter((player) => player.id !== id) }),
      clear: () => set({ players: [] })
    }),
    { name: "ai-agent-players" }
  )
);
