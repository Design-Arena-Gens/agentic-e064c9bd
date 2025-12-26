"use client";

import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { usePreferences } from "@/stores/usePreferences";
import { DEFAULT_CURRENCY_PAIRS } from "@/lib/constants";
import { PreferenceWeights } from "@/lib/personalization";
import { NewsItem } from "@/lib/news";

type ResponsePayload = {
  articles: NewsItem[];
  error?: string;
};

async function fetchNews(
  pairs: string[],
  topics: string[],
  weights: PreferenceWeights
): Promise<ResponsePayload> {
  const params = new URLSearchParams();
  params.set("pairs", pairs.join(","));
  params.set("topics", topics.join(","));
  params.set("weights", JSON.stringify(weights));
  const response = await fetch(`/api/news?${params.toString()}`);
  if (!response.ok) {
    throw new Error("Failed to load news");
  }
  return (await response.json()) as ResponsePayload;
}

export function useNewsFeed() {
  const { selectedPairs, topics, weights } = usePreferences();

  const pairsToUse = selectedPairs.length ? selectedPairs : DEFAULT_CURRENCY_PAIRS.slice(0, 4);

  const query = useQuery({
    queryKey: ["news-feed", pairsToUse, topics, weights],
    queryFn: () => fetchNews(pairsToUse, topics, weights),
    refetchInterval: 1000 * 60 * 2,
    refetchOnWindowFocus: false
  });

  const grouped = useMemo(() => {
    if (!query.data?.articles) return {};
    return query.data.articles.reduce<Record<string, NewsItem[]>>((acc, article) => {
      (article.currencies ?? ["Global"]).forEach((pair) => {
        if (!acc[pair]) acc[pair] = [];
        acc[pair].push(article);
      });
      return acc;
    }, {});
  }, [query.data]);

  return {
    ...query,
    grouped,
    articles: query.data?.articles ?? [],
    errorMessage: query.data?.error
  };
}
