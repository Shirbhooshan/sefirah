"use client";

import GameButton from "./GameButton";

import startButton from "@/assets/media/mise-en-place/buttons/start-button-1.png";
import titleBackground from "@/assets/media/mise-en-place/background/title.png";

interface TitleScreenProps {
  onStart: () => void;
}

export default function TitleScreen({
  onStart,
}: TitleScreenProps) {

  return (
    <div
      style={{
        width: "100%",

        height: "100%",

        position: "relative",

        overflow: "hidden",

        backgroundImage:
          `url("${titleBackground}")`,

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
          CENTER CONTENT
      ==================================================== */}

      <div
        style={{
          position: "absolute",

          inset: 0,

          display: "flex",

          flexDirection: "column",

          alignItems: "center",

          justifyContent: "center",

          textAlign: "center",
        }}
      >
        {/* =================================================
            TITLE
        ================================================== */}

        <div
          style={{
            fontSize:
              "clamp(42px, 5vw, 68px)",

            fontWeight: 700,

            lineHeight: 1.1,

            color: "#222",

            marginBottom:
              "8px",
          }}
        >
          mise en place
        </div>

        {/* =================================================
            SUBTITLE
        ================================================== */}

        <div
          style={{
            fontSize:
              "clamp(18px, 2vw, 27px)",

            fontWeight: 500,

            lineHeight: 1.3,

            color: "#777",

            marginBottom:
              "34px",
          }}
        >
          learn how to cook
        </div>

        {/* =================================================
            START BUTTON
        ================================================== */}

        <GameButton
          src={startButton.src}
          alt="Start Game"
          onClick={onStart}
          width={240}
        />
      </div>
    </div>
  );
}