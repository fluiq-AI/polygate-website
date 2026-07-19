import { ImageResponse } from "next/og";

export const dynamic = "force-static";
export const alt = "polygate - One function. Any LLM provider.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#0A0A0A",
          color: "#FAF9F6",
          padding: 72,
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", fontSize: 34, color: "#9A9A92" }}>
          polygate
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 18,
          }}
        >
          <div style={{ display: "flex", fontSize: 84, fontWeight: 700, letterSpacing: -3 }}>
            One function.
          </div>
          <div style={{ display: "flex", fontSize: 84, fontWeight: 700, letterSpacing: -3, color: "#6FA8FF" }}>
            Any LLM provider.
          </div>
        </div>
        <div style={{ display: "flex", fontSize: 30, color: "#9A9A92" }}>
          Anthropic, OpenAI, Gemini, Moonshot. Python and TypeScript. MIT licensed.
        </div>
      </div>
    ),
    { ...size }
  );
}
