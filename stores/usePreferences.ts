"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { DEFAULT_CURRENCY_PAIRS } from "@/lib/constants";
import { PreferenceWeights, learnFromFeedback } from "@/lib/personalization";

type Interaction = {
  id: string;
  pair: string;
  action: "viewed" | "flagged" | "alerted" | "dismissed";
  timestamp: number;
};

type PreferencesState = {
  selectedPairs: string[];
  topics: string[];
  weights: PreferenceWeights;
  interactions: Interaction[];
  updatePairs: (pairs: string[]) => void;
  updateTopics: (topics: string[]) => void;
  registerInteraction: (interaction: Omit<Interaction, "timestamp">) => void;
  applyFeedback: (feedback: { pair: string; delta: number }[]) => void;
};

export const usePreferences = create<PreferencesState>()(
  persist(
    (set, get) => ({
      selectedPairs: DEFAULT_CURRENCY_PAIRS.slice(0, 4),
      topics: ["central banks", "inflation", "geopolitics"],
      weights: DEFAULT_CURRENCY_PAIRS.reduce<PreferenceWeights>((acc, pair) => {
        acc[pair] = pair.includes("USD") ? 1.2 : 1;
        return acc;
      }, {}),
      interactions: [],
      updatePairs: (pairs) => set({ selectedPairs: pairs }),
      updateTopics: (topics) => set({ topics }),
      registerInteraction: (interaction) =>
        set({
          interactions: [
            { ...interaction, timestamp: Date.now() },
            ...get().interactions
          ].slice(0, 100)
        }),
      applyFeedback: (feedback) =>
        set({ weights: learnFromFeedback(get().weights, feedback) })
    }),
    {
      name: "ai-agent-preferences"
    }
  )
);
