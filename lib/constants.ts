export const DEFAULT_CURRENCY_PAIRS = [
  "EUR/USD",
  "USD/JPY",
  "GBP/USD",
  "USD/CHF",
  "AUD/USD",
  "USD/CAD",
  "NZD/USD",
  "EUR/JPY"
];

export const SAMPLE_NEWS: {
  id: string;
  title: string;
  url: string;
  publishedAt: string;
  source: string;
  excerpt: string;
  impact: "low" | "medium" | "high";
  sentiment: "bullish" | "bearish" | "neutral" | "cautious";
  currencies: string[];
}[] = [
  {
    id: "sample-1",
    title: "ECB Signals Cautious Rate Outlook Amid Persistent Inflation Pressures",
    url: "https://example.com/news/ecb-outlook",
    publishedAt: new Date().toISOString(),
    source: "Sample Financial Desk",
    excerpt:
      "The European Central Bank hinted at a slower pace of future rate cuts, citing resilience in core inflation and a stronger-than-expected labor market.",
    impact: "medium",
    sentiment: "cautious",
    currencies: ["EUR/USD", "EUR/JPY"]
  },
  {
    id: "sample-2",
    title: "US Dollar Rallies as Fed Minutes Highlight Hawkish Tone",
    url: "https://example.com/news/fed-minutes",
    publishedAt: new Date().toISOString(),
    source: "Sample Market Desk",
    excerpt:
      "Dollar strength accelerated overnight following FOMC minutes that underscored the committee’s focus on reining in inflation, leaving the door open to another rate hike.",
    impact: "high",
    sentiment: "bullish",
    currencies: ["USD/JPY", "GBP/USD"]
  },
  {
    id: "sample-3",
    title: "RBNZ Holds Rates, Signals Patience as Growth Moderates",
    url: "https://example.com/news/rbnz-hold",
    publishedAt: new Date().toISOString(),
    source: "Sample Asia Desk",
    excerpt:
      "The Reserve Bank of New Zealand kept policy rates unchanged, emphasizing the need to observe incoming data after recent softness in retail spending and housing.",
    impact: "medium",
    sentiment: "neutral",
    currencies: ["NZD/USD", "AUD/USD"]
  }
];
