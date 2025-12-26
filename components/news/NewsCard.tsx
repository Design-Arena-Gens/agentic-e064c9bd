import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import { NewsItem } from "@/lib/news";
import { Button } from "@/components/ui/button";
import { usePreferences } from "@/stores/usePreferences";

const impactColor: Record<NewsItem["impact"], string> = {
  high: "bg-rose-500/20 text-rose-200 border border-rose-500/40",
  medium: "bg-amber-500/20 text-amber-100 border border-amber-400/30",
  low: "bg-teal-500/20 text-teal-100 border border-teal-400/30"
};

const sentimentLabel: Record<NewsItem["sentiment"], string> = {
  bullish: "Bullish",
  bearish: "Bearish",
  neutral: "Neutral",
  cautious: "Cautious"
};

type Props = {
  article: NewsItem;
};

export function NewsCard({ article }: Props) {
  const register = usePreferences((state) => state.registerInteraction);

  const handleAlert = () => {
    register({ id: article.id, pair: article.currencies[0] ?? "Global", action: "alerted" });
  };

  const handleDismiss = () => {
    register({ id: article.id, pair: article.currencies[0] ?? "Global", action: "dismissed" });
  };

  return (
    <article className="rounded-2xl border border-slate-800/60 bg-slate-900/50 p-5 shadow-inner shadow-indigo-900/30 transition hover:-translate-y-0.5 hover:border-indigo-500/60 hover:shadow-glow">
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <span className={`rounded-full px-3 py-1 text-xs font-semibold ${impactColor[article.impact]}`}>
            Impact: {article.impact.toUpperCase()}
          </span>
          <span className="rounded-full bg-slate-800/60 px-3 py-1 text-xs font-medium text-indigo-200">
            {sentimentLabel[article.sentiment]}
          </span>
          <span className="text-xs text-slate-400">
            {article.source} • {formatDistanceToNow(new Date(article.publishedAt), { addSuffix: true })}
          </span>
        </div>
      </div>
      <h3 className="mt-4 text-lg font-semibold text-white">{article.title}</h3>
      <p className="mt-3 text-sm text-slate-300">{article.excerpt}</p>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs text-indigo-200">
        <div className="flex flex-wrap items-center gap-2">
          {article.currencies.map((pair) => (
            <span
              key={pair}
              className="rounded-full border border-indigo-500/50 bg-indigo-500/10 px-3 py-1 font-medium text-indigo-100"
            >
              {pair}
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <Link href={article.url} target="_blank" rel="noopener noreferrer" className="text-indigo-300 underline">
            View Source
          </Link>
          <Button variant="ghost" onClick={handleAlert} className="text-xs uppercase tracking-wide">
            Alert me
          </Button>
          <Button variant="ghost" onClick={handleDismiss} className="text-xs uppercase tracking-wide text-slate-400">
            Dismiss
          </Button>
        </div>
      </div>
    </article>
  );
}
