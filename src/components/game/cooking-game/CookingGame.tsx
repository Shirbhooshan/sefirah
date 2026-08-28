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
import BoilerScreen from "./screens/BoilerScreen";
import PanScreen, {
  PanProgress,
} from "./screens/PanScreen";
import SinkScreen from "./screens/SinkScreen";
import CuttingBoardScreen from "./screens/CuttingBoardScreen";
import PlateScreen from "./screens/PlateScreen";

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
  | "fridge"
  | "sink"
  | "cuttingBoard"
  | "boiler"
  | "pan"
  | "plate";

type PanStage =
  | "idle"
  | "oil"
  | "garlic"
  | "carrot"
  | "rice"
  | "egg"
  | "soy"
  | "green_onion"
  | "stirring"
  | "fried_rice"
  | "ready"
  | "ready_stove_off";

type CookingAction =
  | "cooking_oil"
  | "cut_garlic"
  | "cut_carrot"
  | "rice"
  | "egg"
  | "soy_sauce"
  | "cut_green_onion"
  | "stir";

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

  const [inventoryLoaded, setInventoryLoaded] =
    useState(false);

  const [boilerOn, setBoilerOn] =
    useState(false);

  const turnBoilerOff = () => {
    setBoilerOn(false);
  };

  const [panOn, setPanOn] =
    useState(false);

  const turnPanOff = () => {
    setPanOn(false);
  };

  const [
    friedRicePlated,
    setFriedRicePlated,
  ] = useState(false);

  /*
   * =========================================================
   * PERSISTENT PAN PROGRESS
   * =========================================================
   *
   * This state belongs to CookingGame rather than PanScreen.
   *
   * Therefore leaving PanScreen does NOT reset the recipe.
   */

  const [
    panProgress,
    setPanProgress,
  ] = useState<PanProgress>({
    stage: "idle",

    completedActions: [],

    isStirring: false,
  });

  /*
   * =========================================================
   * LOAD INVENTORY
   * =========================================================
   */

  useEffect(() => {

    const loadInventory = async () => {

      try {

        const response =
          await fetch(
            "/api/cooking/inventory"
          );

        if (!response.ok) {
          throw new Error(
            "Failed to load inventory"
          );
        }

        const data =
          await response.json();

        if (data.success) {

          setInventory(
            data.inventory ?? {}
          );

        }

      } catch (error) {

        console.error(
          "Failed to load cooking inventory:",
          error
        );

      } finally {

        setInventoryLoaded(true);

      }
    };

    loadInventory();

  }, []);


  /*
   * =========================================================
   * TAKE INGREDIENT
   * =========================================================
   */

  const takeIngredient = async (
    ingredient: string
  ) => {

    const current =
      inventory[ingredient] ?? 0;

    const recipeRequirements: Record<
      string,
      number
    > = {

      green_onion: 1,
      egg: 1,
      carrot: 1,
      onion: 1,
      garlic: 1,
      rice: 1,

      soy_sauce: 1,
      cooking_oil: 1,

    };

    const maximum =
      recipeRequirements[
      ingredient
      ] ?? 0;

    if (current >= maximum) {
      return;
    }

    const newQuantity =
      current + 1;

    setInventory(
      (previous) => ({
        ...previous,

        [ingredient]:
          newQuantity,
      })
    );

    try {

      const response =
        await fetch(
          "/api/cooking/inventory",
          {
            method: "PATCH",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              ingredient,
              quantity:
                newQuantity,
            }),
          }
        );

      if (!response.ok) {
        throw new Error(
          "Failed to save inventory"
        );
      }

    } catch (error) {

      console.error(
        "Failed to save inventory:",
        error
      );

      setInventory(
        (previous) => ({
          ...previous,

          [ingredient]:
            current,
        })
      );

    }
  };


  /*
   * =========================================================
   * REMOVE INGREDIENT
   * =========================================================
   */

  const removeIngredient = async (
    ingredient: string
  ) => {

    const current =
      inventory[ingredient] ?? 0;

    if (current <= 0) {
      return;
    }

    const newQuantity =
      current - 1;

    setInventory(
      (previous) => ({
        ...previous,

        [ingredient]:
          newQuantity,
      })
    );

    try {

      const response =
        await fetch(
          "/api/cooking/inventory",
          {
            method: "PATCH",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              ingredient,
              quantity:
                newQuantity,
            }),
          }
        );

      if (!response.ok) {
        throw new Error(
          "Failed to remove ingredient"
        );
      }

    } catch (error) {

      console.error(
        "Failed to remove ingredient:",
        error
      );

      setInventory(
        (previous) => ({
          ...previous,

          [ingredient]:
            current,
        })
      );

    }
  };


  /*
   * =========================================================
   * ADD PREPARED INGREDIENT
   * =========================================================
   *
   * Used by CuttingBoardScreen.
   *
   * Example:
   *
   * carrot
   *    ↓
   * chopped_carrot
   */

  const addIngredient = async (
    ingredient: string
  ) => {

    const current =
      inventory[ingredient] ?? 0;

    const newQuantity =
      current + 1;


    setInventory((previous) => ({
      ...previous,

      [ingredient]:
        newQuantity,
    }));


    try {

      const response =
        await fetch(
          "/api/cooking/inventory",
          {
            method: "PATCH",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              ingredient,
              quantity:
                newQuantity,
            }),
          }
        );


      if (!response.ok) {
        throw new Error(
          "Failed to add ingredient"
        );
      }

    } catch (error) {

      console.error(
        "Failed to add ingredient:",
        error
      );


      setInventory((previous) => ({
        ...previous,

        [ingredient]:
          current,
      }));
    }
  };


  /*
   * =========================================================
   * WINDOW DRAGGING
   * =========================================================
   */

  const dragOffset = useRef({
    x: 0,
    y: 0,
  });

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

  const windowStyle:
    React.CSSProperties = {

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

    if (
      nextScreen ===
      currentScreen
    ) {
      return;
    }

    setCurrentScreen(
      nextScreen
    );

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

    setLoadingTarget(
      "kitchen"
    );

    setCurrentScreen(
      "loading"
    );

  };

  const goToBoiler = () => {
    changeScreen("boiler");
  };

  const goToPan = () => {
    changeScreen("pan");
  };

  const goToPlate = () => {

    setPanProgress({
      stage: "idle",
      completedActions: [],
      isStirring: false,
    });

    setPanOn(false);

    changeScreen("plate");
  };

  const goToFridge = () => {
    changeScreen("fridge");
  };

  const goToSink = () => {
    changeScreen("sink");
  };

  const goToCuttingBoard = () => {
    changeScreen("cuttingBoard");
  };

  const goBackToKitchen = () => {
    changeScreen("kitchen");
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

      <Windows10TitleBar
        isDragging={isDragging}
        onDragStart={
          handleWindowDragStart
        }
        onClose={onClose}
      />


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
            onViewMenu={
              goToRecipeMenu
            }
            onInstructions={() => { }}
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
            onBack={
              goToMenu
            }
            onFriedRice={
              goToKitchen
            }
          />
        )}


        {currentScreen === "loading" && (
          <LoadingScreen
            onComplete={() => {
              changeScreen(
                loadingTarget
              );
            }}
          />
        )}

        {/* =====================================================
            KITCHEN

            NO INVENTORY BAR HERE.
        ====================================================== */}

        {currentScreen === "kitchen" && (
          <KitchenScreen
            onHome={goToRecipeMenu}

            onFridge={goToFridge}

            onSink={goToSink}

            onCuttingBoard={goToCuttingBoard}

            /*
             * =====================================================
             * BOILER / PAN INTERNAL SCREENS
             *
             * KitchenScreen still owns the interactables.
             * These callbacks only tell CookingGame which
             * internal screen to open.
             * =====================================================
             */

            onBoiler={goToBoiler}

            onPan={goToPan}

            /*
             * =====================================================
             * STOVE STATE
             * =====================================================
             */

            boilerOn={boilerOn}

            panOn={panOn}

            onPlate={goToPlate}

            onToggleBoiler={() => {
              setBoilerOn(
                current => !current
              );
            }}

            onTogglePan={() => {
              setPanOn(
                current => !current
              );
            }}
          />
        )}


        {/* =====================================================
            FRIDGE

            Inventory belongs to this internal screen.
        ====================================================== */}

        {currentScreen === "fridge" && (
          <FridgeScreen

            onBack={
              goBackToKitchen
            }

            inventory={
              inventory
            }

            onTakeIngredient={
              takeIngredient
            }

            onRemoveIngredient={
              removeIngredient
            }

          />
        )}


        {/* =====================================================
            SINK
        ====================================================== */}

        {currentScreen === "sink" && (
          <SinkScreen

            onBack={
              goBackToKitchen
            }

            inventory={
              inventory
            }

            onRemoveIngredient={
              removeIngredient
            }

          />
        )}


        {/* =====================================================
            CUTTING BOARD
        ====================================================== */}

        {currentScreen === "cuttingBoard" && (
          <CuttingBoardScreen

            onBack={
              goBackToKitchen
            }

            inventory={
              inventory
            }

            onRemoveIngredient={
              removeIngredient
            }

            onAddIngredient={
              addIngredient
            }

          />
        )}

        {currentScreen === "boiler" && (
          <BoilerScreen
            onBack={goBackToKitchen}
            boilerOn={boilerOn}
            inventory={inventory}
            onRemoveIngredient={
              removeIngredient
            }
          />
        )}

        {currentScreen === "pan" && (
          <PanScreen
            onBack={goBackToKitchen}

            onPlaceInPlate={() => {
              setFriedRicePlated(true);
              goToPlate();
            }}

            panOn={panOn}

            onTurnOff={() => {
              setPanOn(false);
            }}
            inventory={inventory}

            onRemoveIngredient={
              removeIngredient
            }

            panProgress={
              panProgress
            }

            setPanProgress={
              setPanProgress
            }
          />
        )}

        {currentScreen === "plate" && (
          <PlateScreen
            onBack={goBackToKitchen}
            friedRicePlated={friedRicePlated}
          />
        )}

      </div>

    </div>
  );
}