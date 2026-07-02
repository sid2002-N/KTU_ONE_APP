import fs from "fs";
import path from "path";
import sharp from "sharp";

const svgContent = `
<svg width="1024" height="1024" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#1E293B" />
      <stop offset="100%" stop-color="#0F172A" />
    </linearGradient>
    <linearGradient id="accent" x1="0%" y1="100%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#38BDF8" />
      <stop offset="100%" stop-color="#818CF8" />
    </linearGradient>
  </defs>
  <rect width="1024" height="1024" fill="url(#bg)" />
  <!-- Book / Academic Cap abstract shape -->
  <path d="M512 280 L200 420 L512 560 L824 420 Z" fill="url(#accent)" />
  <path d="M280 490 L280 660 L512 800 L744 660 L744 490 L512 630 Z" fill="#E2E8F0" opacity="0.9" />
  <!-- "1" embedded in the design or just keeping it abstract. Let's add KTU ONE text at the bottom -->
  <text x="512" y="920" font-family="sans-serif" font-size="80" font-weight="bold" fill="#94A3B8" text-anchor="middle" letter-spacing="10">KTU ONE</text>
</svg>
`;

const assetsDir = path.join(process.cwd(), "assets");
if (!fs.existsSync(assetsDir)) {
  fs.mkdirSync(assetsDir, { recursive: true });
}

// Write the SVG file
const svgPath = path.join(assetsDir, "logo.svg");
fs.writeFileSync(svgPath, svgContent.trim());
console.log("Created assets/logo.svg");

// Generate icon.png (1024x1024)
sharp(Buffer.from(svgContent.trim()))
  .resize(1024, 1024)
  .png()
  .toFile(path.join(assetsDir, "icon.png"))
  .then(() => console.log("Created assets/icon.png"))
  .catch(err => console.error("Error generating icon.png:", err));

// Generate splash.png (2732x2732). We'll put the logo in the center of a dark background.
const splashSvg = `
<svg width="2732" height="2732" viewBox="0 0 2732 2732" xmlns="http://www.w3.org/2000/svg">
  <rect width="2732" height="2732" fill="#0F172A" />
  <g transform="translate(854, 854)">
    ${svgContent.replace(/<svg[^>]*>|<\/svg>/g, '').replace('<rect width="1024" height="1024" fill="url(#bg)" />', '')}
  </g>
</svg>
`;

sharp(Buffer.from(splashSvg.trim()))
  .resize(2732, 2732)
  .png()
  .toFile(path.join(assetsDir, "splash.png"))
  .then(() => console.log("Created assets/splash.png"))
  .catch(err => console.error("Error generating splash.png:", err));
