"use client";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import { Comfortaa } from "next/font/google";

import Windows10TitleBar from "./Windows10TitleBar";

import TitleScreen from "./screens/TitleScreen";
import MenuScreen from "./screens/MenuScreen";
import AboutScreen from "./screens/AboutScreen";
import RecipeMenuScreen from "./screens/RecipeMenuScreen";
import LoadingScreen from "./screens/LoadingScreen";
import KitchenScreen from "./screens/KitchenScreen";
import FridgeScreen from "./screens/FridgeScreen";

const comfortaa = Comfortaa({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});


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

type CookingGameScreen =
  | "title"
  | "menu"
  | "about"
  | "recipeMenu"
  | "loading"
  | "kitchen"
  | "fridge";

type IngredientId =
  | "green_onion"
  | "egg"
  | "carrot"
  | "onion"
  | "garlic"
  | "rice"
  | "soy_sauce"
  | "cooking_oil";

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
  const [
    currentScreen,
    setCurrentScreen,
  ] = useState<CookingGameScreen>("title");

  const [
    isDragging,
    setIsDragging,
  ] = useState(false);

  const [loadingTarget, setLoadingTarget] =
    useState<CookingGameScreen>("kitchen");


  const [inventory, setInventory] =
    useState<Record<string, number>>({});


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

    color:
      "#222",

    userSelect:
      "none",

    WebkitUserSelect:
      "none",
  };

  /*
   * =========================================================
   * SCREEN NAVIGATION
   * =========================================================
   */

  const changeScreen = (
    nextScreen: CookingGameScreen
  ) => {
    if (nextScreen === currentScreen) {
      return;
    }

    setCurrentScreen(nextScreen);
  };

  const goToMenu = () => {
    changeScreen("menu");
  };

  const goToAbout = () => {
    changeScreen("about");
  };

  const goToTitle = () => {
    changeScreen("title");
  };

  const goToRecipeMenu = () => {
    changeScreen("recipeMenu");
  };

  const goToKitchen = () => {
    setLoadingTarget("kitchen");
    setCurrentScreen("loading");
  };

  const goToFridge = () => {
    changeScreen("fridge");
  };

  const goBackToKitchen = () => {
    changeScreen("kitchen");
  };

  const takeIngredient = (
    ingredient: IngredientId
  ) => {
    setInventory((current) => ({
      ...current,

      [ingredient]:
        (current[ingredient] ?? 0) + 1,
    }));
  };
  /*
   * =========================================================
   * RENDER
   * =========================================================
   */

  return (
    <div
      data-cooking-game-window
      className={comfortaa.className}
      onMouseDown={() => {
        onFocus?.();
      }}
      style={windowStyle}
    >
      {/* =====================================================
          WINDOWS 10 TITLE BAR
      ====================================================== */}

      <Windows10TitleBar
        isDragging={isDragging}
        onDragStart={
          handleWindowDragStart
        }
        onClose={onClose}
      />

      {/* =====================================================
          GAME SCREEN
      ====================================================== */}

      <div
        style={{
          flex: 1,
          minHeight: 0,
          position: "relative",
          overflow: "hidden",

        }}
        onMouseDown={(event) => {
          event.stopPropagation();
          onFocus?.();
        }}
      >
        {currentScreen === "title" && (
          <TitleScreen
            onStart={
              goToMenu
            }
          />
        )}

        {currentScreen === "menu" && (
          <MenuScreen
            onBack={
              goToTitle
            }
            onAbout={
              goToAbout
            }
            onViewMenu={goToRecipeMenu}
            onInstructions={() => {
              // TODO:
              // Build Instructions screen
            }}
          />
        )}

        {currentScreen === "about" && (
          <AboutScreen
            onBack={
              goToMenu
            }
          />
        )}

        {currentScreen === "recipeMenu" && (
          <RecipeMenuScreen
            onBack={goToMenu}
            onFriedRice={goToKitchen}
          />
        )}

        {currentScreen === "loading" && (
          <LoadingScreen
            onComplete={() => {
              changeScreen(loadingTarget);
            }}
          />
        )}

        {currentScreen === "kitchen" && (
          <KitchenScreen
            onHome={goToRecipeMenu}
            onFridge={goToFridge}
          />
        )}

        {currentScreen === "fridge" && (
          <FridgeScreen
            onBack={goBackToKitchen}
            inventory={inventory}
            onTakeIngredient={takeIngredient}
          />
        )}


      </div>
    </div>
  );
}