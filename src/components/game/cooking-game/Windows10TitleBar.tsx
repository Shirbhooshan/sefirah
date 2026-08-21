"use client";

import cookingGameIcon from "@/assets/icons/cooking-game.png";

interface Windows10TitleBarProps {
  isDragging: boolean;

  onDragStart: (
    event: React.MouseEvent
  ) => void;

  onClose?: () => void;
}

export default function Windows10TitleBar({
  isDragging,
  onDragStart,
  onClose,
}: Windows10TitleBarProps) {
  return (
    <div
      onMouseDown={onDragStart}
      style={{
        height: "40px",

        minHeight: "40px",

        display: "flex",

        alignItems: "center",

        background: "#ffffff",

        borderBottom:
          "1px solid #d6d6d6",

        cursor:
          isDragging
            ? "grabbing"
            : "grab",

        paddingLeft: "10px",

        paddingRight: 0,
      }}
    >
      {/* ===================================================
          GAME ICON
      ==================================================== */}

      <img
        src={
          typeof cookingGameIcon ===
          "string"
            ? cookingGameIcon
            : cookingGameIcon.src
        }
        alt=""
        draggable={false}
        style={{
          width: "20px",

          height: "20px",

          objectFit: "contain",

          marginRight: "8px",

          flexShrink: 0,
        }}
      />

      {/* ===================================================
          GAME NAME
      ==================================================== */}

      <span
        style={{
          fontFamily:
            "Segoe UI, Arial, sans-serif",

          fontSize: "13px",

          color: "#222",

          lineHeight: "40px",

          whiteSpace: "nowrap",

          overflow: "hidden",

          textOverflow: "ellipsis",

          flex: 1,
        }}
      >
        Cooking Game
      </span>

      {/* ===================================================
          CLOSE
      ==================================================== */}

      <button
        onMouseDown={(event) => {
          event.preventDefault();
          event.stopPropagation();
        }}
        onClick={(event) => {
          event.preventDefault();
          event.stopPropagation();

          onClose?.();
        }}
        aria-label="Close Cooking Game"
        title="Close"
        style={{
          width: "46px",

          height: "40px",

          border: 0,

          borderRadius: 0,

          background:
            "transparent",

          display: "flex",

          alignItems: "center",

          justifyContent: "center",

          padding: 0,

          cursor: "pointer",

          color: "#222",

          fontSize: "20px",

          fontWeight: 300,

          lineHeight: 1,

          flexShrink: 0,
        }}
        onMouseEnter={(event) => {
          event.currentTarget.style.background =
            "#e81123";

          event.currentTarget.style.color =
            "#ffffff";
        }}
        onMouseLeave={(event) => {
          event.currentTarget.style.background =
            "transparent";

          event.currentTarget.style.color =
            "#222";
        }}
      >
        ×
      </button>
    </div>
  );
}