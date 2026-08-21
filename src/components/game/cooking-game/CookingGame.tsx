"use client";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import cookingGameIcon from "@/assets/icons/cooking-game.png";

interface CookingGameProps {
  onClose?: () => void;

  onMove?: (
    left: number,
    top: number
  ) => void;

  windowPosition?: {
    left: number;
    top: number;
    zIndex: number;
    centered?: boolean;
  };

  onFocus?: () => void;
}

export default function CookingGame({
  onClose,
  onMove,
  windowPosition = {
    left: 10,
    top: 10,
    zIndex: 30,
    centered: false,
  },
  onFocus,
}: CookingGameProps) {
  const [isDragging, setIsDragging] =
    useState(false);

  const dragOffset = useRef({
    x: 0,
    y: 0,
  });

  /*
   * =========================================================
   * WINDOW DRAGGING
   * =========================================================
   */

  const handleWindowDragStart = (
    event: React.MouseEvent
  ) => {
    if (event.button !== 0) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();

    onFocus?.();

    const windowElement =
      event.currentTarget.closest(
        "[data-cooking-game-window]"
      ) as HTMLElement | null;

    if (!windowElement) {
      return;
    }

    const rect =
      windowElement.getBoundingClientRect();

    dragOffset.current = {
      x:
        event.clientX -
        rect.left,

      y:
        event.clientY -
        rect.top,
    };

    setIsDragging(true);
  };

  /*
   * =========================================================
   * HANDLE WINDOW MOVEMENT
   * =========================================================
   */

  useEffect(() => {
    if (!isDragging) {
      return;
    }

    const handleMouseMove = (
      event: MouseEvent
    ) => {
      const newLeft =
        event.clientX -
        dragOffset.current.x;

      const newTop =
        event.clientY -
        dragOffset.current.y;

      /*
       * Keep the title bar below
       * the desktop menu bar.
       */

      const menuBarHeight = 38;

      const windowWidth = 900;
      const windowHeight = 600;

      const actualWidth =
        Math.min(
          windowWidth,
          window.innerWidth * 0.90
        );

      const actualHeight =
        Math.min(
          windowHeight,
          window.innerHeight * 0.80
        );

      const maxLeft =
        Math.max(
          0,
          window.innerWidth -
          actualWidth
        );

      const maxTop =
        Math.max(
          menuBarHeight,
          window.innerHeight -
          actualHeight
        );

      const clampedLeft =
        Math.max(
          0,
          Math.min(
            newLeft,
            maxLeft
          )
        );

      const clampedTop =
        Math.max(
          menuBarHeight,
          Math.min(
            newTop,
            maxTop
          )
        );

      onMove?.(
        clampedLeft,
        clampedTop
      );
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    window.addEventListener(
      "mousemove",
      handleMouseMove
    );

    window.addEventListener(
      "mouseup",
      handleMouseUp
    );

    return () => {
      window.removeEventListener(
        "mousemove",
        handleMouseMove
      );

      window.removeEventListener(
        "mouseup",
        handleMouseUp
      );
    };
  }, [
    isDragging,
    onMove,
  ]);

  /*
   * =========================================================
   * WINDOW STYLE
   * =========================================================
   */

  const windowStyle: React.CSSProperties =
    {
      position: "fixed",

      left:
        windowPosition.centered
          ? "50%"
          : `${windowPosition.left}px`,

      top:
        windowPosition.centered
          ? "50%"
          : `${windowPosition.top}px`,

      transform:
        windowPosition.centered
          ? "translate(-50%, -50%)"
          : "none",

      width:
        "min(900px, 90vw)",

      height:
        "min(600px, 80vh)",

      background:
        "#ffffff",

      border:
        "1px solid #a6a6a6",

      borderRadius:
        "2px",

      overflow:
        "hidden",

      boxShadow:
        "0 8px 24px rgba(0, 0, 0, 0.30)",

      zIndex:
        windowPosition.zIndex,

      display:
        "flex",

      flexDirection:
        "column",

      fontFamily:
        "Segoe UI, Arial, sans-serif",

      color:
        "#222",

      userSelect:
        "none",

      WebkitUserSelect:
        "none",
    };

  /*
   * =========================================================
   * RENDER
   * =========================================================
   */

  return (
    <div
      data-cooking-game-window
      onMouseDown={() => {
        onFocus?.();
      }}
      style={windowStyle}
    >
      {/* =====================================================
          TITLE BAR
      ====================================================== */}

      <div
        onMouseDown={
          handleWindowDragStart
        }
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
        {/* Game icon */}

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

        {/* Game name */}

        <span
          style={{
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

        {/* Close button */}

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

      {/* =====================================================
          GAME CONTENT
      ====================================================== */}

      <div
        style={{
          flex: 1,

          minHeight: 0,

          background: "#ffffff",

          overflow: "hidden",

          position: "relative",
        }}
        onMouseDown={(event) => {
          event.stopPropagation();
          onFocus?.();
        }}
      >
        {/* 
         * Temporary game area.
         *
         * Replace this with the actual cooking game
         * UI when we build it.
         */}

        <div
          style={{
            width: "100%",

            height: "100%",

            display: "flex",

            alignItems: "center",

            justifyContent: "center",

            background: "#f4f4f4",

            color: "#555",

            fontSize: "16px",
          }}
        >
          Cooking Game
        </div>
      </div>
    </div>
  );
}