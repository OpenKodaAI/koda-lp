import { ImageResponse } from "next/og";

export const alt = "Koda — Many agents. Many providers. One harness.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background:
            "linear-gradient(180deg, #b6d6ec 0%, #f1e7b8 52%, #bdd9b6 100%)",
          padding: "80px",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "64px",
            left: "64px",
            display: "flex",
            alignItems: "center",
            gap: "12px",
            fontSize: "26px",
            color: "#0C0C0C",
            fontWeight: 700,
            letterSpacing: "-0.02em",
          }}
        >
          koda
        </div>

        <div
          style={{
            fontSize: "96px",
            color: "#0C0C0C",
            fontFamily: "serif",
            fontWeight: 500,
            textAlign: "center",
            lineHeight: 1.02,
            letterSpacing: "-0.035em",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <span>Many agents.</span>
          <span>Many providers.</span>
          <span>One harness.</span>
        </div>

        <div
          style={{
            position: "absolute",
            bottom: "64px",
            left: "64px",
            right: "64px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontSize: "22px",
            color: "#1f1c17",
            fontWeight: 500,
            opacity: 0.75,
          }}
        >
          <span>The open-source harness for multi-agent AI</span>
          <span style={{ fontFamily: "monospace", fontSize: "20px" }}>
            koda.dev
          </span>
        </div>
      </div>
    ),
    { ...size }
  );
}
