import { NextResponse } from "next/server";
import { learnFromFeedback, PreferenceWeights } from "@/lib/personalization";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const weights: PreferenceWeights = body.weights ?? {};
    const feedback: { pair: string; delta: number }[] = body.feedback ?? [];
    const updated = learnFromFeedback(weights, feedback);
    return NextResponse.json({ weights: updated });
  } catch (error) {
    console.error("[preferences]", error);
    return NextResponse.json({ error: "Failed to update preferences." }, { status: 500 });
  }
}
