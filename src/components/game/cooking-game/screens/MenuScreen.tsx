"use client";

import GameButton from "./GameButton";

import backButton from "@/assets/media/mise-en-place/buttons/back-button-1.png";
import viewMenuButton from "@/assets/media/mise-en-place/buttons/view-menu-button-1.png";
import aboutButton from "@/assets/media/mise-en-place/buttons/about-button-1.png";

import menuBackground from "@/assets/media/mise-en-place/background/title-screen-background.jpg";

interface MenuScreenProps {
  onBack: () => void;

  onViewMenu: () => void;

  onInstructions: () => void;

  onAbout: () => void;
}

export default function MenuScreen({
  onBack,
  onViewMenu,
  onInstructions,
  onAbout,
}: MenuScreenProps) {
  /*
   * Replace with your actual background.
   */

  return (
    <div
      style={{
        width: "100%",

        height: "100%",

        position: "relative",

        overflow: "hidden",

        backgroundImage:
          `url("${menuBackground.src}")`,

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
          src={backButton.src}
          alt="Back"
          onClick={onBack}
          width={90}
        />
      </div>

      {/* ===================================================
          MENU BUTTONS
      ==================================================== */}

      <div
        style={{
          position: "absolute",

          inset: 0,

          display: "flex",

          flexDirection: "column",

          alignItems: "center",

          justifyContent: "center",

          gap: "18px",
        }}
      >
        <GameButton
          src={viewMenuButton.src}
          alt="View Menu"
          onClick={onViewMenu}
          width={260}
        />

        <GameButton
          src={aboutButton.src}
          alt="About"
          onClick={onAbout}
          width={260}
        />
      </div>
    </div>
  );
}