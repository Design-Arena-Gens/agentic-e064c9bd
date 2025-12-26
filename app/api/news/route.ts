import { NextResponse } from "next/server";
import { DEFAULT_CURRENCY_PAIRS } from "@/lib/constants";
import { fallbackNews, NewsItem, normalizeNewsArticle, NewsApiArticle } from "@/lib/news";
import { summarizeNewsBatch } from "@/lib/summarize";
import { applyPreferenceWeight, PreferenceWeights } from "@/lib/personalization";

const NEWS_API_ENDPOINT = "https://newsapi.org/v2/everything";
const NEWS_API_KEY = process.env.NEWS_API_KEY;

async function fetchNewsFromApi(query: string, from: string) {
  if (!NEWS_API_KEY) return null;

  const url = new URL(NEWS_API_ENDPOINT);
  url.searchParams.set("q", query);
  url.searchParams.set("language", "en");
  url.searchParams.set("from", from);
  url.searchParams.set("sortBy", "publishedAt");
  url.searchParams.set("pageSize", "12");

  const response = await fetch(url.toString(), {
    headers: {
      "X-Api-Key": NEWS_API_KEY
    },
    cache: "no-cache"
  });

  if (!response.ok) {
    console.warn("News API error", await response.text());
    return null;
  }

  const json = (await response.json()) as { articles?: NewsApiArticle[] };
  return json.articles ?? null;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const pairs = searchParams.get("pairs")?.split(",")?.filter(Boolean) ?? DEFAULT_CURRENCY_PAIRS;
    const topics = searchParams.get("topics")?.split(",").filter(Boolean) ?? ["forex", "economy"];
    const weightsParam = searchParams.get("weights");
    let weights: PreferenceWeights = {};
    if (weightsParam) {
      try {
        weights = JSON.parse(weightsParam);
      } catch (error) {
        console.warn("Failed to parse weights", error);
      }
    }

    const thirtySixHoursAgo = new Date(Date.now() - 36 * 60 * 60 * 1000).toISOString();
    const query = `${pairs.join(" OR ")} (${topics.join(" OR ")})`;
    const articles = (await fetchNewsFromApi(query, thirtySixHoursAgo)) ?? [];

    const normalized =
      articles
        .map((raw) => normalizeNewsArticle(raw, pairs))
        .map((article, idx) => ({
          ...article,
          id: `${article.title}-${idx}`
        })) ?? [];

    const pool = normalized.length ? normalized : fallbackNews();

    const summaries = await summarizeNewsBatch(
      pool.map((article) => ({
        title: article.title,
        content: article.excerpt,
        currencies: article.currencies
      }))
    );

    const enriched: NewsItem[] = pool.map((article, index) => ({
      ...article,
      excerpt: summaries[index] ?? article.excerpt,
      id: article.id ?? `${article.title}-${index}`
    }));

    enriched.sort((a, b) => {
      const impactScore = (impact: NewsItem["impact"]) =>
        impact === "high" ? 3 : impact === "medium" ? 2 : 1;
      const aWeight = applyPreferenceWeight(impactScore(a.impact), a.currencies[0] ?? "", weights);
      const bWeight = applyPreferenceWeight(impactScore(b.impact), b.currencies[0] ?? "", weights);
      return bWeight - aWeight;
    });

    return NextResponse.json({ articles: enriched.slice(0, 12) });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { articles: fallbackNews(), error: "Failed to retrieve live data. Using fallback feed." },
      { status: 200 }
    );
  }
}
