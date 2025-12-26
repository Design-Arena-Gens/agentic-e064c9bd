import { NextResponse } from "next/server";
import Replicate from "replicate";
import { buildPlayerPrompt } from "@/lib/imagePrompt";
import { generatePlaceholderImage } from "@/lib/placeholders";
import { PlayerAttributes } from "@/types/player";

const replicateToken = process.env.REPLICATE_API_TOKEN;

const replicate = replicateToken
  ? new Replicate({
      auth: replicateToken
    })
  : null;

type PlayerPayload = {
  attributes?: Partial<PlayerAttributes> & Record<string, unknown>;
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as PlayerPayload;
    const attributes = body?.attributes ?? {};
    const name = typeof attributes.name === "string" ? attributes.name : "Elite Prodigy";

    const prompt = buildPlayerPrompt({
      name,
      age: typeof attributes.age === "number" ? attributes.age : undefined,
      position: typeof attributes.position === "string" ? attributes.position : undefined,
      physique: typeof attributes.physique === "string" ? attributes.physique : undefined,
      ethnicity: typeof attributes.ethnicity === "string" ? attributes.ethnicity : undefined,
      hairstyle: typeof attributes.hairstyle === "string" ? attributes.hairstyle : undefined,
      eyeColor: typeof attributes.eyeColor === "string" ? attributes.eyeColor : undefined,
      dominantHand: typeof attributes.dominantHand === "string" ? attributes.dominantHand : undefined,
      personality: typeof attributes.personality === "string" ? attributes.personality : undefined,
      uniformStyle: typeof attributes.uniformStyle === "string" ? attributes.uniformStyle : undefined,
      primaryColor: typeof attributes.primaryColor === "string" ? attributes.primaryColor : undefined,
      secondaryColor: typeof attributes.secondaryColor === "string" ? attributes.secondaryColor : undefined,
      accessories: Array.isArray(attributes.accessories)
        ? (attributes.accessories.filter((item): item is string => typeof item === "string") ?? [])
        : undefined,
      backgroundStory: typeof attributes.backgroundStory === "string" ? attributes.backgroundStory : undefined,
      environment: typeof attributes.environment === "string" ? attributes.environment : undefined,
      teamName: typeof attributes.teamName === "string" ? attributes.teamName : undefined,
      lighting: typeof attributes.lighting === "string" ? attributes.lighting : undefined,
      realismLevel: attributes.realismLevel === "hyperreal" ||
        attributes.realismLevel === "stylized" ||
        attributes.realismLevel === "anime" ||
        attributes.realismLevel === "cinematic"
        ? attributes.realismLevel
        : "cinematic"
    });

    if (!replicate) {
      const placeholder = generatePlaceholderImage({ name, ...attributes });
      return NextResponse.json({
        imageUrl: placeholder,
        prompt,
        provider: "placeholder"
      });
    }

    const response = await replicate.run("black-forest-labs/flux-dev", {
      input: {
        prompt,
        guidance_scale: 3.2,
        num_inference_steps: 28,
        aspect_ratio: "1:1",
        output_format: "png"
      }
    });

    const imageUrl = Array.isArray(response) ? String(response[0]) : String(response);

    return NextResponse.json({
      imageUrl,
      prompt,
      provider: "replicate"
    });
  } catch (error) {
    console.error("[player-generate]", error);
    return NextResponse.json(
      {
        error: "Unable to generate image right now.",
        imageUrl: generatePlaceholderImage({ fallback: true, ts: Date.now() })
      },
      { status: 500 }
    );
  }
}
