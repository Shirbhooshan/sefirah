"use client";

import {
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";

import cuttingBoardBackground from "@/assets/media/mise-en-place/background/cutting-board.jpg";

/*
 * =========================================================
 * CARROT CUTTING SEQUENCE
 * =========================================================
 */

import carrotBoard from "@/assets/media/mise-en-place/background/cutting-board-carrot.jpg";
import carrotNoKnife from "@/assets/media/mise-en-place/background/cutting-board-carrot-no-knife.jpg";
import carrotFirstCut from "@/assets/media/mise-en-place/background/cutting-board-carrot-first-cut.jpg";
import carrotSecondCut from "@/assets/media/mise-en-place/background/cutting-board-carrot-second-cut.jpg";
import carrotFinalCut from "@/assets/media/mise-en-place/background/cutting-board-carrot-final-cut.jpg";

/*
 * =========================================================
 * GREEN ONION CUTTING SEQUENCE
 * =========================================================
 */

import greenOnionBoard from "@/assets/media/mise-en-place/background/cutting-board-green-onion.jpg";
import greenOnionNoKnife from "@/assets/media/mise-en-place/background/cutting-board-green-onion-no-knife.jpg";
import greenOnionFirstCut from "@/assets/media/mise-en-place/background/cutting-board-green-onion-first-cut.jpg";
import greenOnionSecondCut from "@/assets/media/mise-en-place/background/cutting-board-green-onion-second-cut.jpg";
import greenOnionFinalCut from "@/assets/media/mise-en-place/background/cutting-board-green-onion-final-cut.jpg";

/*
 * =========================================================
 * GARLIC CUTTING SEQUENCE
 * =========================================================
 *
 * IMPORTANT:
 * "onion" was a naming mistake in the inventory.
 * The ingredient used by the fried-rice recipe is GARLIC.
 *
 * These assets therefore map to:
 *
 * garlic
 *    ↓
 * garlicBoard
 *    ↓
 * garlicNoKnife
 *    ↓
 * garlicFirstCut
 *    ↓
 * garlicSecondCut
 *    ↓
 * garlicFinalCut
 *
 */

import garlicBoard from "@/assets/media/mise-en-place/background/cutting-board-garlic.jpg";
import garlicNoKnife from "@/assets/media/mise-en-place/background/cutting-board-garlic-no-knife.jpg";
import garlicFirstCut from "@/assets/media/mise-en-place/background/cutting-board-garlic-first-cut.jpg";
import garlicSecondCut from "@/assets/media/mise-en-place/background/cutting-board-garlic-second-cut.jpg";
import garlicFinalCut from "@/assets/media/mise-en-place/background/cutting-board-garlic-final-cut.jpg";

/*
 * =========================================================
 * UI ASSETS
 * =========================================================
 */

import knifeLift from "@/assets/media/mise-en-place/icons/knife-lift.png";
import backButton from "@/assets/media/mise-en-place/buttons/back-button-1.png";

import InventoryBar from "../components/InventoryBar";

/*
 * =========================================================
 * PROPS
 * =========================================================
 */

interface CuttingBoardScreenProps {
    onBack: () => void;

    inventory: Record<string, number>;

    onRemoveIngredient: (
        ingredient: string
    ) => void;

    onAddIngredient: (
        ingredient: string
    ) => void;

    showDebug?: boolean;
}

/*
 * =========================================================
 * BOARD INGREDIENT
 * =========================================================
 *
 * "onion" is deliberately NOT included.
 *
 * The inventory item called garlic is what gets
 * dragged onto this board.
 */

type BoardIngredient =
    | "carrot"
    | "green_onion"
    | "garlic"
    | null;

/*
 * =========================================================
 * CUT STAGE
 * =========================================================
 */

type CutStage =
    | "none"
    | "first"
    | "second"
    | "final";

/*
 * =========================================================
 * COMPONENT
 * =========================================================
 */

export default function CuttingBoardScreen({
    onBack,
    inventory,
    onRemoveIngredient,
    onAddIngredient,
    showDebug = false,
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
     * =========================================================
     * CUT CYCLE
     * =========================================================
     *
     * 0 = not started
     * 1 = first cut
     * 2 = second cut
     * 3 = final cut
     */

    const [cutCycle, setCutCycle] =
        useState(0);

    /*
     * =========================================================
     * KNIFE
     * =========================================================
     */

    const [knifeVisible, setKnifeVisible] =
        useState(false);

    const knifeRef =
        useRef<HTMLImageElement | null>(null);

    /*
     * =========================================================
     * DRAG STATE
     * =========================================================
     */

    const [
        isDraggingIngredient,
        setIsDraggingIngredient,
    ] = useState(false);


    /*
     * =========================================================
     * CURRENT BACKGROUND
     * =========================================================
     *
     * This is the visual state machine for the board.
     *
     * Ingredient
     *     ↓
     * initial image
     *     ↓
     * no-knife image
     *     ↓
     * first cut
     *     ↓
     * second cut
     *     ↓
     * final cut
     */

    const currentBackground = useMemo(() => {

        /*
         * Empty board.
         */

        if (!boardIngredient) {
            return cuttingBoardBackground;
        }


        /*
         * =====================================================
         * CARROT
         * =====================================================
         */

        if (boardIngredient === "carrot") {

            /*
             * After the cutting sequence has started,
             * remove the knife that is baked into the
             * original background.
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


        /*
         * =====================================================
         * GREEN ONION
         * =====================================================
         */

        if (
            boardIngredient ===
            "green_onion"
        ) {

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


        /*
         * =====================================================
         * GARLIC
         * =====================================================
         *
         * Same exact state machine as carrot and green onion.
         */

        if (boardIngredient === "garlic") {

            if (
                cutCycle >= 1 &&
                cutStage === "none"
            ) {
                return garlicNoKnife;
            }

            if (cutStage === "first") {
                return garlicFirstCut;
            }

            if (cutStage === "second") {
                return garlicSecondCut;
            }

            if (cutStage === "final") {
                return garlicFinalCut;
            }

            return garlicBoard;
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
     *
     * These are the ONLY ingredients that can be dragged
     * onto the cutting board.
     *
     * carrot
     * green_onion
     * garlic
     */

    const handleIngredientDragStart = (
        ingredient: string,
        event: React.DragEvent
    ) => {

        /*
         * Reject everything except the three
         * cutting ingredients.
         */

        if (
            ingredient !== "carrot" &&
            ingredient !== "green_onion" &&
            ingredient !== "garlic"
        ) {
            event.preventDefault();
            return;
        }


        /*
         * Ingredient must actually exist
         * in the inventory.
         */

        if (
            (inventory[ingredient] ?? 0) <= 0
        ) {
            event.preventDefault();
            return;
        }


        /*
         * Only one ingredient can occupy
         * the cutting board at a time.
         */

        if (boardIngredient !== null) {
            event.preventDefault();
            return;
        }


        /*
         * Tell the browser what is being dragged.
         */

        event.dataTransfer.effectAllowed =
            "move";

        event.dataTransfer.setData(
            "application/x-cutting-board-ingredient",
            ingredient
        );


        /*
         * Show the drop-zone highlight.
         */

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

        /*
         * Do not accept another ingredient while
         * the board is occupied.
         */

        if (boardIngredient !== null) {
            return;
        }

        event.preventDefault();

        event.dataTransfer.dropEffect =
            "move";
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


        /*
         * Board is already occupied.
         */

        if (boardIngredient !== null) {
            return;
        }


        /*
         * Read the ingredient from the drag payload.
         */

        const ingredient =
            event.dataTransfer.getData(
                "application/x-cutting-board-ingredient"
            );


        /*
         * Only the three valid ingredients
         * can enter this board.
         */

        if (
            ingredient !== "carrot" &&
            ingredient !== "green_onion" &&
            ingredient !== "garlic"
        ) {
            return;
        }


        /*
         * Make sure the inventory still contains
         * the ingredient.
         */

        if (
            (inventory[ingredient] ?? 0) <= 0
        ) {
            return;
        }


        /*
         * Remove the RAW ingredient from inventory.
         *
         * The CUT version will be added after
         * the animation finishes.
         */

        onRemoveIngredient(
            ingredient
        );


        /*
         * Place ingredient on board.
         */

        setBoardIngredient(
            ingredient as BoardIngredient
        );

        setCutStage("none");

        setCutCycle(0);

        setKnifeVisible(false);
    };


    /*
     * =========================================================
     * KNIFE CLICK
     * =========================================================
     *
     * One click starts the entire three-cut sequence.
     */

    const handleKnifeClick = () => {

        /*
         * Nothing to cut.
         */

        if (!boardIngredient) {
            return;
        }


        /*
         * Cutting has already started.
         */

        if (cutCycle !== 0) {
            return;
        }


        /*
         * Start cycle one.
         *
         * This also causes the baked-in knife to
         * disappear because currentBackground now
         * selects the no-knife image.
         */

        setCutStage("none");

        setCutCycle(1);


        /*
         * Spawn the animated knife.
         */

        setKnifeVisible(true);
    };


    /*
     * =========================================================
     * AUTOMATIC CUTTING SEQUENCE
     * =========================================================
     *
     * Every cycle:
     *
     * 0ms
     *   knife starts UP
     *
     * 700ms
     *   knife reaches DOWN
     *   cut image appears
     *
     * 1400ms
     *   knife returns UP
     *
     * Then the next cycle begins.
     *
     * After cycle 3:
     *   final cut image remains visible
     *   cut ingredient is returned to inventory
     */

    useEffect(() => {

        if (
            cutCycle === 0 ||
            !boardIngredient
        ) {
            return;
        }


        /*
         * =====================================================
         * CUT MOMENT
         * =====================================================
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
         * =====================================================
         * END OF CURRENT KNIFE CYCLE
         * =====================================================
         */

        const cycleTimer =
            window.setTimeout(() => {

                /*
                 * Continue to next cut.
                 */

                if (cutCycle < 3) {

                    setCutCycle(
                        current =>
                            current + 1
                    );

                    return;
                }


                /*
                 * =================================================
                 * FINAL CUT COMPLETE
                 * =================================================
                 *
                 * Leave the final image on screen for a moment
                 * before returning the cut ingredient to inventory.
                 */

                const ingredient =
                    boardIngredient;


                const finishTimer =
                    window.setTimeout(() => {

                        /*
                         * CARROT
                         */

                        if (
                            ingredient ===
                            "carrot"
                        ) {
                            onAddIngredient(
                                "cut_carrot"
                            );
                        }


                        /*
                         * GREEN ONION
                         */

                        if (
                            ingredient ===
                            "green_onion"
                        ) {
                            onAddIngredient(
                                "cut_green_onion"
                            );
                        }


                        /*
                         * GARLIC
                         *
                         * IMPORTANT:
                         * This is the new output.
                         */

                        if (
                            ingredient === "garlic"
                        ) {
                            onAddIngredient(
                                "cut_garlic"
                            );
                        }


                        /*
                         * Clear the board.
                         */

                        setBoardIngredient(
                            null
                        );

                        setCutStage(
                            "none"
                        );

                        setCutCycle(0);

                        setKnifeVisible(
                            false
                        );

                    }, 1800);


                /*
                 * Cleanup the final delay.
                 */

                return () => {
                    window.clearTimeout(
                        finishTimer
                    );
                };

            }, 1400);


        /*
         * Cleanup the current cut timers.
         */

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
     * Every cycle:
     *
     * UP
     *  ↓
     * DOWN
     *  ↓
     * UP
     *
     * The knife image is separate from the
     * invisible clickable hitbox.
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
         * Cancel any animation from the
         * previous cycle.
         */

        knife.getAnimations().forEach(
            animation => {
                animation.cancel();
            }
        );


        /*
         * Force knife to UP position.
         */

        knife.style.transform =
            "translate3d(0, -120px, 0)";


        /*
         * Animate DOWN and back UP.
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
                    typeof currentBackground ===
                        "string"
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

                    background:
                        "transparent",

                    cursor: "pointer",

                    zIndex: 100,

                    display: "flex",

                    alignItems: "center",

                    justifyContent: "center",
                }}
            >

                <img
                    src={
                        typeof backButton ===
                            "string"
                            ? backButton
                            : backButton.src
                    }

                    alt="Back"

                    draggable={false}

                    style={{
                        width: "100%",
                        height: "100%",

                        objectFit:
                            "contain",

                        pointerEvents:
                            "none",
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
                     * DEBUG DROP AREA
                     *
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
                     * MAP THESE FOUR VALUES ONLY
                     * if the knife click area needs adjustment.
                     */

                    left: "55%",
                    top: "35%",

                    width: "20%",
                    height: "35%",

                    padding: 0,

                    border: "none",

                    outline: "none",

                    background:
                        "transparent",

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
            ================================================= */}

            {knifeVisible && (

                <img
                    ref={knifeRef}

                    src={
                        typeof knifeLift ===
                            "string"
                            ? knifeLift
                            : knifeLift.src
                    }

                    alt="Knife"

                    draggable={false}

                    style={{
                        position: "absolute",

                        left: "43%",
                        top: "27%",

                        width: "180px",
                        height: "180px",

                        objectFit:
                            "contain",

                        zIndex: 45,

                        pointerEvents:
                            "none",

                        /*
                         * The Web Animations API controls
                         * the transform.
                         */

                        willChange:
                            "transform",
                    }}
                />

            )}


            {/* =================================================
                STATE DEBUG
            ================================================= */}
            {showDebug && (
                <div
                    style={{
                        position: "absolute",

                        right: "15px",
                        top: "15px",

                        padding:
                            "8px 12px",

                        background:
                            "rgba(0,0,0,0.75)",

                        color: "#fff",

                        borderRadius: "6px",

                        fontSize: "10px",

                        lineHeight: 1.5,

                        zIndex: 200,

                        pointerEvents:
                            "none",

                        whiteSpace:
                            "pre-line",

                        fontFamily:
                            "Comfortaa, sans-serif",
                    }}
                >
                    {`Board: ${boardIngredient ??
                        "EMPTY"
                        }
Stage: ${cutStage
                        }
Cycle: ${cutCycle
                        }
Knife: ${knifeVisible
                            ? "VISIBLE"
                            : "HIDDEN"
                        }`}
                </div>
            )}


            {/* =================================================
                INVENTORY
            ================================================= */}

            <InventoryBar
                inventory={
                    inventory
                }

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
