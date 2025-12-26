 "use client";

import { Card } from "@/components/ui/card";
import { useNewsFeed } from "@/hooks/useNewsFeed";
import { DEFAULT_CURRENCY_PAIRS } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { usePreferences } from "@/stores/usePreferences";
import { NewsCard } from "./NewsCard";

export function NewsBoard() {
  const { articles, grouped, isLoading, refetch, errorMessage } = useNewsFeed();
  const { selectedPairs, updatePairs, topics, updateTopics, applyFeedback } = usePreferences();

  const togglePair = (pair: string) => {
    if (selectedPairs.includes(pair)) {
      updatePairs(selectedPairs.filter((curr) => curr !== pair));
    } else {
      updatePairs([...selectedPairs, pair]);
    }
  };

  const onFeedback = (pair: string, positive: boolean) => {
    applyFeedback([{ pair, delta: positive ? 0.25 : -0.2 }]);
    refetch();
  };

  return (
    <Card
      title="Forex Intelligence Feed"
      description="Realtime scanning of macroeconomic catalysts, central bank signals, and liquidity shocks curated for your watchlist."
      actions={
        <Button variant="secondary" onClick={() => refetch()} loading={isLoading}>
          Refresh Feed
        </Button>
      }
    >
      <div className="flex flex-wrap items-center gap-2">
        {DEFAULT_CURRENCY_PAIRS.map((pair) => {
          const active = selectedPairs.includes(pair);
          return (
            <button
              key={pair}
              onClick={() => togglePair(pair)}
              className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
                active
                  ? "border border-indigo-500 bg-indigo-500/20 text-indigo-100 shadow shadow-indigo-500/40"
                  : "border border-slate-700 bg-slate-800/40 text-slate-300 hover:border-indigo-400/60 hover:text-indigo-100"
              }`}
            >
              {pair}
            </button>
          );
        })}
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {topics.map((topic) => (
          <span
            key={topic}
            className="rounded-full border border-emerald-500/40 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-100"
          >
            {topic}
          </span>
        ))}
        <button
          className="rounded-full border border-slate-700 px-3 py-1 text-xs text-slate-400 hover:border-indigo-500 hover:text-indigo-200"
          onClick={() => {
            const next = window.prompt("Add a new intel topic", "energy transition");
            if (next) updateTopics([...topics, next]);
          }}
        >
          + Topic
        </button>
      </div>

      {errorMessage && (
        <div className="rounded-xl border border-amber-500/40 bg-amber-500/10 p-3 text-sm text-amber-100">
          {errorMessage}
        </div>
      )}

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {articles.map((article) => (
          <NewsCard key={article.id} article={article} />
        ))}
      </div>

      <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
        <h3 className="text-sm font-semibold text-indigo-100">Adaptive Learning</h3>
        <p className="mt-1 text-xs text-slate-400">
          Rate how useful alerts were for specific pairs. We re-weight the feed instantly.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          {(Object.keys(grouped) as string[]).map((pair) => (
            <div key={pair} className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800/70 px-3 py-2">
              <span className="text-xs font-medium text-slate-200">{pair}</span>
              <Button variant="ghost" className="text-xs text-emerald-300" onClick={() => onFeedback(pair, true)}>
                Helpful
              </Button>
              <Button variant="ghost" className="text-xs text-rose-300" onClick={() => onFeedback(pair, false)}>
                Noise
              </Button>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
