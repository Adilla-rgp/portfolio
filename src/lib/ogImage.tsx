import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { homeContent } from "@/content/home";
import { site } from "@/content/site";
import { readColorTokens } from "@/lib/colorTokens";

/**
 * The site's Open Graph card. Each route that sets its own `openGraph` loses
 * the inherited image (Next replaces the object), so it re-exports this from
 * an `opengraph-image.tsx` of its own.
 */
export const ogImageAlt = site.ogImageAlt;
export const ogImageSize = { width: 1200, height: 630 };
export const ogImageContentType = "image/png";

// Static instances of the site fonts (OFL): next/og cannot read the variable
// Archivo served by next/font, nor woff2.
const fontDir = join(process.cwd(), "src/assets/fonts");

/** Layout of the 1200×630 card, in px. */
const layout = { padding: 72, titleSize: 112, titleLineHeight: 0.9, lineGap: 10, nameSize: 28 };

export async function renderOgImage() {
  const [display, mono] = await Promise.all([
    readFile(join(fontDir, "Archivo-ExpandedBlack.woff")),
    readFile(join(fontDir, "JetBrainsMono-Bold.woff")),
  ]);
  const colors = readColorTokens(["bg", "fg", "signal"] as const);
  const [firstLine, lastLine] = homeContent.hero.titleLines;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: layout.padding,
          background: colors.bg,
          color: colors.fg,
        }}
      >
        <div
          style={{
            display: "flex",
            fontFamily: "JetBrains Mono",
            fontSize: layout.nameSize,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
          }}
        >
          {site.name}
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            fontFamily: "Archivo",
            fontSize: layout.titleSize,
            lineHeight: layout.titleLineHeight,
            letterSpacing: "-0.035em",
            textTransform: "uppercase",
            gap: layout.lineGap,
          }}
        >
          <span>{firstLine}</span>
          <span style={{ display: "flex" }}>
            {lastLine}
            <span style={{ color: colors.signal }}>.</span>
          </span>
        </div>
      </div>
    ),
    {
      ...ogImageSize,
      fonts: [
        { name: "Archivo", data: display, weight: 900, style: "normal" },
        { name: "JetBrains Mono", data: mono, weight: 700, style: "normal" },
      ],
    },
  );
}
