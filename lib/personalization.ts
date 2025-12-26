export type PreferenceWeights = Record<string, number>;

export function applyPreferenceWeight(score: number, pair: string, weights: PreferenceWeights) {
  if (!weights || !Object.keys(weights).length) return score;
  const weight = weights[pair] ?? 1;
  return score * weight;
}

export function normalizeWeights(weights: PreferenceWeights): PreferenceWeights {
  const entries = Object.entries(weights);
  if (!entries.length) return {};
  const total = entries.reduce((sum, [, value]) => sum + value, 0);
  return entries.reduce<PreferenceWeights>((acc, [key, value]) => {
    acc[key] = value / total;
    return acc;
  }, {});
}

export function learnFromFeedback(
  weights: PreferenceWeights,
  feedback: { pair: string; delta: number }[]
): PreferenceWeights {
  const next = { ...weights };
  feedback.forEach(({ pair, delta }) => {
    const prev = next[pair] ?? 1;
    next[pair] = Math.max(0.1, prev + delta);
  });
  return next;
}
