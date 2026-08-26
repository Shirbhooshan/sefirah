"use client";

import {
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";

import cuttingBoardBackground from "@/assets/media/mise-en-place/background/cutting-board.jpg";

import carrotBoard from "@/assets/media/mise-en-place/background/cutting-board-carrot.jpg";
import carrotNoKnife from "@/assets/media/mise-en-place/background/cutting-board-carrot-no-knife.jpg";
import carrotFirstCut from "@/assets/media/mise-en-place/background/cutting-board-carrot-first-cut.jpg";
import carrotSecondCut from "@/assets/media/mise-en-place/background/cutting-board-carrot-second-cut.jpg";
import carrotFinalCut from "@/assets/media/mise-en-place/background/cutting-board-carrot-final-cut.jpg";

import greenOnionBoard from "@/assets/media/mise-en-place/background/cutting-board-green-onion.jpg";
import greenOnionNoKnife from "@/assets/media/mise-en-place/background/cutting-board-green-onion-no-knife.jpg";
import greenOnionFirstCut from "@/assets/media/mise-en-place/background/cutting-board-green-onion-first-cut.jpg";
import greenOnionSecondCut from "@/assets/media/mise-en-place/background/cutting-board-green-onion-second-cut.jpg";
import greenOnionFinalCut from "@/assets/media/mise-en-place/background/cutting-board-green-onion-final-cut.jpg";

import knifeLift from "@/assets/media/mise-en-place/icons/knife-lift.png";
import backButton from "@/assets/media/mise-en-place/buttons/back-button-1.png";

import InventoryBar from "../components/InventoryBar";

interface CuttingBoardScreenProps {
    onBack: () => void;

    inventory: Record<string, number>;

    onRemoveIngredient: (
        ingredient: string
    ) => void;

    onAddIngredient: (
        ingredient: string
    ) => void;
}

type BoardIngredient =
    | "carrot"
    | "green_onion"
    | null;

type CutStage =
    | "none"
    | "first"
    | "second"
    | "final";

export default function CuttingBoardScreen({
    onBack,
    inventory,
    onRemoveIngredient,
    onAddIngredient,
}: CuttingBoardScreenProps) {

    /*
     * =========================================================
     * BOARD STATE
     * =========================================================
     */

    const [boardIngredient, setBoardIngredient] =
        useState<BoardIngredient>(null);

    const [cutStage, setCutStage] =
        useState<CutStage>("none");

    /*
     * 0 = not started
     * 1 = first cut
     * 2 = second cut
     * 3 = final cut
     */
    const [cutCycle, setCutCycle] =
        useState(0);

    const [knifeVisible, setKnifeVisible] =
        useState(false);

    const knifeRef =
        useRef<HTMLImageElement | null>(null);

    const [isDraggingIngredient, setIsDraggingIngredient] =
        useState(false);


    /*
     * =========================================================
     * CURRENT BACKGROUND
     * =========================================================
     */

    const currentBackground = useMemo(() => {

        if (!boardIngredient) {
            return cuttingBoardBackground;
        }

        if (boardIngredient === "carrot") {

            /*
             * Before the first cut:
             * remove the background knife.
             */

            if (
                cutCycle >= 1 &&
                cutStage === "none"
            ) {
                return carrotNoKnife;
            }

            if (cutStage === "first") {
                return carrotFirstCut;
            }

            if (cutStage === "second") {
                return carrotSecondCut;
            }

            if (cutStage === "final") {
                return carrotFinalCut;
            }

            return carrotBoard;
        }

        if (boardIngredient === "green_onion") {

            if (
                cutCycle >= 1 &&
                cutStage === "none"
            ) {
                return greenOnionNoKnife;
            }

            if (cutStage === "first") {
                return greenOnionFirstCut;
            }

            if (cutStage === "second") {
                return greenOnionSecondCut;
            }

            if (cutStage === "final") {
                return greenOnionFinalCut;
            }

            return greenOnionBoard;
        }

        return cuttingBoardBackground;

    }, [
        boardIngredient,
        cutStage,
        cutCycle,
    ]);


    /*
     * =========================================================
     * DRAG START
     * =========================================================
     */

    const handleIngredientDragStart = (
        ingredient: string,
        event: React.DragEvent
    ) => {

        if (
            ingredient !== "carrot" &&
            ingredient !== "green_onion"
        ) {
            event.preventDefault();
            return;
        }

        if (
            (inventory[ingredient] ?? 0) <= 0
        ) {
            event.preventDefault();
            return;
        }

        if (boardIngredient !== null) {
            event.preventDefault();
            return;
        }

        event.dataTransfer.effectAllowed = "move";

        event.dataTransfer.setData(
            "application/x-cutting-board-ingredient",
            ingredient
        );

        setIsDraggingIngredient(true);
    };


    /*
     * =========================================================
     * DRAG END
     * =========================================================
     */

    const handleIngredientDragEnd = () => {
        setIsDraggingIngredient(false);
    };


    /*
     * =========================================================
     * BOARD DRAG OVER
     * =========================================================
     */

    const handleBoardDragOver = (
        event: React.DragEvent
    ) => {

        if (boardIngredient !== null) {
            return;
        }

        event.preventDefault();

        event.dataTransfer.dropEffect = "move";
    };


    /*
     * =========================================================
     * DROP INGREDIENT
     * =========================================================
     */

    const handleBoardDrop = (
        event: React.DragEvent
    ) => {

        event.preventDefault();

        setIsDraggingIngredient(false);

        if (boardIngredient !== null) {
            return;
        }

        const ingredient =
            event.dataTransfer.getData(
                "application/x-cutting-board-ingredient"
            );

        if (
            ingredient !== "carrot" &&
            ingredient !== "green_onion"
        ) {
            return;
        }

        if (
            (inventory[ingredient] ?? 0) <= 0
        ) {
            return;
        }

        onRemoveIngredient(ingredient);

        setBoardIngredient(ingredient);

        setCutStage("none");

        setCutCycle(0);

        setKnifeVisible(false);
    };


    /*
     * =========================================================
     * KNIFE CLICK
     * =========================================================
     *
     * ONE CLICK STARTS THE ENTIRE PROCESS.
     *
     * The player does NOT click the knife again.
     */

    const handleKnifeClick = () => {

        if (!boardIngredient) {
            return;
        }

        /*
         * Already started.
         */

        if (cutCycle !== 0) {
            return;
        }

        /*
         * Remove the background knife by switching
         * to the no-knife background.
         */

        setCutStage("none");

        setCutCycle(1);

        /*
         * Spawn the separate animated knife.
         */

        setKnifeVisible(true);
    };


    /*
     * =========================================================
     * AUTOMATIC CUTTING SEQUENCE
     * =========================================================
     *
     * Each cycle:
     *
     * 0ms     knife starts UP
     * 700ms   knife reaches DOWN
     * 700ms   cut image appears
     * 1400ms  knife reaches UP
     *
     * Then the next cycle begins.
     */

    useEffect(() => {

        if (
            cutCycle === 0 ||
            !boardIngredient
        ) {
            return;
        }

        /*
         * DOWN / CUT MOMENT
         */

        const cutTimer =
            window.setTimeout(() => {

                if (cutCycle === 1) {
                    setCutStage("first");
                }

                if (cutCycle === 2) {
                    setCutStage("second");
                }

                if (cutCycle === 3) {
                    setCutStage("final");
                }

            }, 700);


        /*
         * END OF CURRENT KNIFE CYCLE
         */

        const cycleTimer =
            window.setTimeout(() => {

                if (cutCycle < 3) {

                    /*
                     * Start the next knife movement.
                     */

                    setCutCycle(
                        current =>
                            current + 1
                    );

                    return;
                }

                /*
                 * FINAL CUT COMPLETE.
                 *
                 * Leave final image visible.
                 */

                const ingredient =
                    boardIngredient;

                window.setTimeout(() => {

                    if (
                        ingredient === "carrot"
                    ) {
                        onAddIngredient(
                            "cut_carrot"
                        );
                    }

                    if (
                        ingredient === "green_onion"
                    ) {
                        onAddIngredient(
                            "cut_green_onion"
                        );
                    }

                    setBoardIngredient(null);

                    setCutStage("none");

                    setCutCycle(0);

                    setKnifeVisible(false);

                }, 1800);

            }, 1400);


        return () => {

            window.clearTimeout(
                cutTimer
            );

            window.clearTimeout(
                cycleTimer
            );

        };

    }, [
        cutCycle,
        boardIngredient,
        onAddIngredient,
    ]);

    /*
 * =========================================================
 * KNIFE MOVEMENT
 * =========================================================
 *
 * This directly animates the knife image itself.
 *
 * Every cut cycle:
 *
 *      UP
 *       ↓
 *      DOWN
 *       ↓
 *      UP
 *
 * The knife remains mounted between cycles.
 */

    useEffect(() => {

        if (
            !knifeVisible ||
            cutCycle === 0 ||
            !knifeRef.current
        ) {
            return;
        }

        const knife =
            knifeRef.current;

        /*
         * Cancel any previous animation
         * before starting the current cycle.
         */

        knife.getAnimations().forEach(
            animation => {
                animation.cancel();
            }
        );

        /*
         * Force the knife to begin at the UP position.
         */

        knife.style.transform =
            "translate3d(0, -120px, 0)";

        /*
         * Animate the actual image.
         *
         * 180px movement gives the 256x256
         * knife asset plenty of visible travel.
         */

        const animation =
            knife.animate(
                [
                    {
                        transform:
                            "translate3d(0, -120px, 0)",
                    },

                    {
                        transform:
                            "translate3d(0, 140px, 0)",
                    },

                    {
                        transform:
                            "translate3d(0, -120px, 0)",
                    },
                ],
                {
                    duration: 1400,

                    easing:
                        "ease-in-out",

                    fill: "forwards",
                }
            );

        return () => {
            animation.cancel();
        };

    }, [
        knifeVisible,
        cutCycle,
    ]);

    /*
     * =========================================================
     * RENDER
     * =========================================================
     */

    return (
        <div
            style={{
                position: "absolute",

                inset: 0,

                overflow: "hidden",

                background: "#000",

                fontFamily:
                    "Comfortaa, sans-serif",
            }}
        >

            {/* =================================================
                CUTTING BOARD BACKGROUND
            ================================================= */}

            <img
                src={
                    typeof currentBackground === "string"
                        ? currentBackground
                        : currentBackground.src
                }

                alt="Cutting board"

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


            {/* =================================================
                BACK BUTTON
            ================================================= */}

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

                    display: "flex",

                    alignItems: "center",

                    justifyContent: "center",
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


            {/* =================================================
                BOARD DROP AREA
            ================================================= */}

            <div
                onDragOver={
                    handleBoardDragOver
                }

                onDrop={
                    handleBoardDrop
                }

                style={{
                    position: "absolute",

                    left: "25%",
                    top: "35%",

                    width: "43%",
                    height: "38%",

                    /*
                     * Keep this visible while mapping.
                     */

                    border:
                        isDraggingIngredient
                            ? "3px dashed rgba(255,255,0,0.95)"
                            : "2px dashed rgba(0,255,255,0.75)",

                    background:
                        isDraggingIngredient
                            ? "rgba(255,255,0,0.12)"
                            : "rgba(0,255,255,0.05)",

                    borderRadius: "8px",

                    zIndex: 20,

                    pointerEvents:
                        boardIngredient
                            ? "none"
                            : "auto",

                    display: "flex",

                    alignItems: "center",

                    justifyContent: "center",

                    color: "#fff",

                    fontFamily:
                        "Comfortaa, sans-serif",

                    fontSize: "12px",

                    textShadow:
                        "0 1px 3px #000",
                }}
            >
                {boardIngredient
                    ? ""
                    : "DROP INGREDIENT HERE"}
            </div>


            {/* =================================================
                INVISIBLE KNIFE HITBOX
            =================================================
            
                IMPORTANT:
                This is ONLY the clickable area.

                It does NOT contain the knife image.

                The actual knife is rendered separately
                below it.
            ================================================= */}

            <button
                type="button"

                aria-label="Start cutting"

                onClick={
                    handleKnifeClick
                }

                style={{
                    position: "absolute",

                    /*
                     * MAP THESE FOUR VALUES ONLY.
                     *
                     * This is the clickable area over
                     * the knife in the background.
                     */

                    left: "55%",
                    top: "35%",

                    width: "20%",
                    height: "35%",

                    padding: 0,

                    border: "none",

                    outline: "none",

                    background: "transparent",

                    cursor:
                        boardIngredient &&
                            cutCycle === 0
                            ? "pointer"
                            : "default",

                    zIndex: 40,
                }}
            />


            {/* =================================================
                ANIMATED KNIFE
            =================================================
            
                THIS IS COMPLETELY SEPARATE FROM THE HITBOX.

                It is positioned over the actual cutting
                location, NOT over the hitbox.

                The 256x256 asset gets a large movement range.
            ================================================= */}

            {knifeVisible && (
                <img
                    ref={knifeRef}

                    src={
                        typeof knifeLift === "string"
                            ? knifeLift
                            : knifeLift.src
                    }

                    alt="Knife"

                    draggable={false}

                    style={{
                        position: "absolute",

                        /*
                         * =================================================
                         * ACTUAL KNIFE POSITION
                         * =================================================
                         *
                         * This is completely independent
                         * from the invisible hitbox.
                         */

                        left: "43%",
                        top: "27%",

                        width: "180px",
                        height: "180px",

                        objectFit: "contain",

                        zIndex: 45,

                        pointerEvents: "none",

                        /*
                         * Important:
                         * Do NOT put a transform here.
                         *
                         * The Web Animations API controls it.
                         */

                        willChange: "transform",
                    }}
                />
            )}


            {/* =================================================
                STATE DEBUG
            ================================================= */}

            <div
                style={{
                    position: "absolute",

                    right: "15px",
                    top: "15px",

                    padding: "8px 12px",

                    background:
                        "rgba(0,0,0,0.75)",

                    color: "#fff",

                    borderRadius: "6px",

                    fontSize: "10px",

                    lineHeight: 1.5,

                    zIndex: 200,

                    pointerEvents: "none",

                    whiteSpace: "pre-line",

                    fontFamily:
                        "Comfortaa, sans-serif",
                }}
            >
                {`Board: ${boardIngredient ?? "EMPTY"
                    }
Stage: ${cutStage}
Cycle: ${cutCycle}
Knife: ${knifeVisible
                        ? "VISIBLE"
                        : "HIDDEN"
                    }`}
            </div>


            {/* =================================================
                INVENTORY
            ================================================= */}

            <InventoryBar
                inventory={inventory}

                onRemoveIngredient={
                    onRemoveIngredient
                }

                onIngredientDragStart={
                    handleIngredientDragStart
                }

                onIngredientDragEnd={
                    handleIngredientDragEnd
                }
            />

        </div>
    );
}