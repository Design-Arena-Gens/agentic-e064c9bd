import crypto from "crypto";

export function generatePlaceholderImage(attributes: Record<string, unknown>) {
  const hash = crypto.createHash("sha256").update(JSON.stringify(attributes)).digest("hex").slice(0, 6);
  const primary = `#${hash.slice(0, 6)}`;
  const accent = `#${hash.slice(2, 8)}`;
  const textColor = parseInt(hash.slice(0, 2), 16) > 160 ? "#0a1320" : "#f8fafc";
  const name = (attributes["name"] as string) ?? "Fictional Pro";
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024" viewBox="0 0 1024 1024">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${primary};stop-opacity:1" />
      <stop offset="100%" style="stop-color:${accent};stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="1024" height="1024" fill="url(#grad)" />
  <circle cx="512" cy="420" r="220" fill="rgba(255,255,255,0.12)" />
  <rect x="180" y="660" width="664" height="220" rx="120" fill="rgba(0,0,0,0.25)" />
  <text x="512" y="420" font-size="64" fill="${textColor}" text-anchor="middle" font-family="Inter, sans-serif">${name}</text>
  <text x="512" y="750" font-size="36" fill="${textColor}" text-anchor="middle" font-family="Inter, sans-serif">Procedural Concept Render</text>
</svg>`;
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;
}
