"use client";

import GameButton from "./GameButton";

import backgroundImage from "@/assets/media/mise-en-place/background/about.png"
import backButton from "@/assets/media/mise-en-place/buttons/back-button-1.png";

interface AboutScreenProps {
  onBack: () => void;
}

export default function AboutScreen({
  onBack,
}: AboutScreenProps) {
  return (
    <div
      style={{
        width: "100%",

        height: "100%",

        position: "relative",

        overflow: "hidden",

        backgroundImage:
          `url("${backgroundImage}")`,

        backgroundSize:
          "cover",

        backgroundPosition:
          "center",

        backgroundRepeat:
          "no-repeat",

        fontFamily:
          "Comfortaa, sans-serif",
      }}
    >
      {/* ===================================================
          BACK BUTTON
      ==================================================== */}

      <div
        style={{
          position: "absolute",

          top: "24px",

          left: "24px",

          zIndex: 2,
        }}
      >
        <GameButton
          src={backButton}
          alt="Back"
          onClick={onBack}
          width={90}
        />
      </div>

      {/* ===================================================
          ABOUT TEXT
      ==================================================== */}

      <div
        style={{
          position: "absolute",

          inset: 0,

          display: "flex",

          alignItems: "center",

          justifyContent: "center",

          padding:
            "80px 120px",
        }}
      >
        <div
          style={{
            maxWidth: "650px",

            textAlign: "center",

            fontSize:
              "clamp(16px, 1.5vw, 21px)",

            fontWeight: 300,

            lineHeight: 1.8,

            color: "#555",
          }}
        >
          {/* Replace this with your actual About Us text. */}

          Mise en Place is a cooking game
          designed to make learning about
          cooking fun, simple, and interactive.
        </div>
      </div>
    </div>
  );
}