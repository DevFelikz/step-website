import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "STEP — Steg för steg mot mindre nikotin";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: "100%",
          background: "#050505",
          fontFamily: "sans-serif",
          padding: "60px",
          position: "relative",
        }}
      >
        {/* Background pattern */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "radial-gradient(ellipse at 50% 0%, rgba(201,162,39,0.15) 0%, transparent 65%)",
          }}
        />

        {/* Logo */}
        <div
          style={{
            fontSize: 80,
            fontWeight: 900,
            letterSpacing: "-4px",
            color: "#c9a227",
            marginBottom: 16,
          }}
        >
          STEP
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: 32,
            color: "#9ca3af",
            letterSpacing: "-0.5px",
            textAlign: "center",
            maxWidth: 700,
          }}
        >
          Steg för steg mot
          <span style={{ color: "#ffffff", marginLeft: 8 }}>mindre nikotin</span>
        </div>

        {/* Curve bar */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            gap: 8,
            marginTop: 60,
            height: 80,
          }}
        >
          {[100, 80, 60, 40, 20, 4].map((h, i) => (
            <div
              key={i}
              style={{
                width: 40,
                height: `${h}%`,
                borderRadius: 6,
                background: `rgba(201,162,39,${0.3 + i * 0.1})`,
              }}
            />
          ))}
        </div>

        {/* Subtext */}
        <div style={{ marginTop: 32, fontSize: 18, color: "#555", letterSpacing: "3px" }}>
          STEP.SE
        </div>
      </div>
    ),
    size,
  );
}
