import { SAMPLE_NEWS } from "./constants";

export type NewsItem = {
  id: string;
  title: string;
  url: string;
  publishedAt: string;
  source: string;
  excerpt: string;
  impact: "low" | "medium" | "high";
  sentiment: "bullish" | "bearish" | "neutral" | "cautious";
  currencies: string[];
};

export type NewsApiArticle = {
  url: string;
  title: string;
  source: { name: string };
  description: string | null;
  content: string | null;
  publishedAt: string;
};

const IMPACT_KEYWORDS: Record<"high" | "medium" | "low", string[]> = {
  high: ["surge", "plunge", "hike", "cut", "emergency", "crisis", "shock", "unexpected"],
  medium: ["steady", "signals", "inflation", "growth", "bank", "policy", "guidance"],
  low: ["forecast", "outlook", "analysis", "commentary", "insight"]
};

const SENTIMENT_KEYWORDS: Record<NewsItem["sentiment"], string[]> = {
  bullish: ["rally", "strength", "gain", "surge", "advance", "bullish"],
  bearish: ["drop", "weakness", "fall", "selloff", "bearish", "decline"],
  neutral: ["steady", "unchanged", "flat", "mixed", "balanced"],
  cautious: ["cautious", "uncertain", "watch", "monitoring", "risk"]
};

const IMPACT_ORDER: NewsItem["impact"][] = ["high", "medium", "low"];

export function inferImpact(text: string): NewsItem["impact"] {
  const normalized = text.toLowerCase();
  let best: NewsItem["impact"] = "low";
  let score = 0;
  IMPACT_ORDER.forEach((level, index) => {
    const weight = IMPACT_ORDER.length - index;
    const levelScore = IMPACT_KEYWORDS[level].reduce(
      (sum, keyword) => (normalized.includes(keyword) ? sum + 1 : sum),
      0
    );
    if (levelScore * weight > score) {
      score = levelScore * weight;
      best = level;
    }
  });
  return best;
}

export function inferSentiment(text: string): NewsItem["sentiment"] {
  const normalized = text.toLowerCase();
  let best: NewsItem["sentiment"] = "neutral";
  let score = 0;
  (Object.keys(SENTIMENT_KEYWORDS) as NewsItem["sentiment"][]).forEach((sentiment) => {
    const levelScore = SENTIMENT_KEYWORDS[sentiment].reduce(
      (sum, keyword) => (normalized.includes(keyword) ? sum + 1 : sum),
      0
    );
    if (levelScore > score) {
      score = levelScore;
      best = sentiment;
    }
  });
  return best;
}

export function fallbackNews(): NewsItem[] {
  return SAMPLE_NEWS;
}

export function normalizeNewsArticle(
  article: NewsApiArticle,
  currencies: string[]
): Omit<NewsItem, "id"> {
  const text = `${article.title ?? ""}\n${article.description ?? ""}\n${article.content ?? ""}`;
  return {
    title: article.title ?? "Untitled",
    url: article.url,
    publishedAt: article.publishedAt ?? new Date().toISOString(),
    source: article.source?.name ?? "Unknown Source",
    excerpt: article.description ?? article.content ?? "",
    impact: inferImpact(text),
    sentiment: inferSentiment(text),
    currencies
  };
}
