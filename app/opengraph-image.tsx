import { ImageResponse } from "next/og";

// Route segment config
export const runtime = "edge";

// Image metadata
export const alt = "enterx | AI-First Technology Solutions";
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

// Image generation
export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 128,
          background: "black",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 40,
          }}
        >
          <div
            style={{
              width: 120,
              height: 120,
              background: "linear-gradient(to bottom right, #ef4444, #e11d48)",
              borderRadius: 24,
            }}
          />
        </div>
        <div
          style={{
            color: "white",
            fontWeight: "bold",
            letterSpacing: "-0.05em",
          }}
        >
          enterx
        </div>
        <div
          style={{
            color: "rgba(255,255,255,0.5)",
            fontSize: 32,
            marginTop: 20,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
          }}
        >
          AI-First Technology Solutions
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
