"use client";

import { useState } from "react";

interface GameButtonProps {
  src: string;
  alt: string;
  onClick?: () => void;
  width?: number;
}

export default function GameButton({
  src,
  alt,
  onClick,
  width = 220,
}: GameButtonProps) {
  const [isHovered, setIsHovered] =
    useState(false);

  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={() => {
        setIsHovered(true);
      }}
      onMouseLeave={() => {
        setIsHovered(false);
      }}
      style={{
        border: 0,
        padding: 0,
        margin: 0,
        background: "transparent",
        cursor: "pointer",

        display: "flex",
        alignItems: "center",
        justifyContent: "center",

        width: `${width}px`,

        transform: isHovered
          ? "scale(1.06)"
          : "scale(1)",

        transition:
          "transform 120ms ease",

        flexShrink: 0,
      }}
    >
      <img
        src={src}
        alt={alt}
        draggable={false}
        style={{
          width: "100%",
          height: "auto",
          display: "block",
          pointerEvents: "none",
        }}
      />
    </button>
  );
}