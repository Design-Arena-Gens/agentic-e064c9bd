type PlayerAttributes = {
  name: string;
  age?: number;
  position?: string;
  physique?: string;
  ethnicity?: string;
  hairstyle?: string;
  eyeColor?: string;
  dominantHand?: string;
  personality?: string;
  uniformStyle?: string;
  primaryColor?: string;
  secondaryColor?: string;
  accessories?: string[];
  backgroundStory?: string;
  environment?: string;
  teamName?: string;
  lighting?: string;
  realismLevel?: "hyperreal" | "stylized" | "anime" | "cinematic";
};

export function buildPlayerPrompt(attributes: PlayerAttributes) {
  const {
    name,
    age,
    position,
    physique,
    ethnicity,
    hairstyle,
    eyeColor,
    dominantHand,
    personality,
    uniformStyle,
    primaryColor,
    secondaryColor,
    accessories,
    backgroundStory,
    environment,
    teamName,
    lighting,
    realismLevel
  } = attributes;

  const details = [
    age && `${age}-year-old`,
    ethnicity,
    physique,
    position ? `${position} player` : "elite athlete",
    hairstyle && `hairstyle: ${hairstyle}`,
    eyeColor && `eye color ${eyeColor}`,
    dominantHand && `${dominantHand}-handed`,
    personality && `${personality} aura`,
    uniformStyle && `${uniformStyle} uniform`,
    teamName && `team colors of ${teamName}`,
    primaryColor && `primary color ${primaryColor}`,
    secondaryColor && `secondary color ${secondaryColor}`,
    accessories?.length ? `wearing ${accessories.join(", ")}` : null,
    environment && `set in ${environment}`,
    backgroundStory,
    lighting && `${lighting} lighting`
  ]
    .filter(Boolean)
    .join(", ");

  const styleMap: Record<NonNullable<PlayerAttributes["realismLevel"]>, string> = {
    hyperreal: "hyperrealistic photography, 8k HDR, volumetric lighting",
    stylized: "stylized sports art, painterly brush strokes, bold highlights",
    anime: "high-detail anime illustration, dynamic line art, cel shading",
    cinematic: "cinematic portrait, anamorphic lens, dramatic rim lights"
  };

  const realismDescription = realismLevel ? styleMap[realismLevel] : styleMap.cinematic;

  return `Portrait of ${name || "a fictional star athlete"}, ${details}. ${realismDescription}, crisp focus, detailed textures, expressive composition.`;
}
