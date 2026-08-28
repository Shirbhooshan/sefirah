"use client";

import plateEmpty from "@/assets/media/mise-en-place/background/plate-empty.jpg";
import plateFriedRice from "@/assets/media/mise-en-place/background/plate-fried-rice.jpg";

import backButton from "@/assets/media/mise-en-place/buttons/back-button-1.png";

interface PlateScreenProps {
  onBack: () => void;
  friedRicePlated: boolean;
}

export default function PlateScreen({
  onBack,
  friedRicePlated,
}: PlateScreenProps) {
  const currentImage = friedRicePlated
    ? plateFriedRice
    : plateEmpty;

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        background: "#000",
        fontFamily: "Comfortaa, sans-serif",
      }}
    >
      {/* =====================================================
          TABLE
      ====================================================== */}

      <img
        src={
          typeof currentImage === "string"
            ? currentImage
            : currentImage.src
        }
        alt={
          friedRicePlated
            ? "Fried rice on plate"
            : "Empty plates"
        }
        draggable={false}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          pointerEvents: "none",
        }}
      />

      {/* =====================================================
          BACK BUTTON
      ====================================================== */}

      <button
        type="button"
        onClick={onBack}
        aria-label="Back"
        style={{
          position: "absolute",
          top: "18px",
          left: "18px",
          width: "64px",
          height: "64px",
          padding: 0,
          border: "none",
          background: "transparent",
          cursor: "pointer",
          zIndex: 100,
          transition: "transform 140ms ease",
        }}
        onMouseEnter={(event) => {
          event.currentTarget.style.transform =
            "scale(1.043)";
        }}
        onMouseLeave={(event) => {
          event.currentTarget.style.transform =
            "scale(1)";
        }}
      >
        <img
          src={
            typeof backButton === "string"
              ? backButton
              : backButton.src
          }
          alt="Back"
          draggable={false}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
            pointerEvents: "none",
          }}
        />
      </button>
    </div>
  );
}