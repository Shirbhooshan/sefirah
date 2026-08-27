"use client";

import {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";

import panInner from "@/assets/media/mise-en-place/background/pan.jpg";
import panInnerOn from "@/assets/media/mise-en-place/background/pan-on.jpg";

import panOil from "@/assets/media/mise-en-place/background/pan-on-oil.jpg";
import panGarlic from "@/assets/media/mise-en-place/background/pan-on-oil-garlic.jpg";
import panCarrot from "@/assets/media/mise-en-place/background/pan-on-oil-garlic-done-carrot.jpg";
import panRice from "@/assets/media/mise-en-place/background/pan-on-oil-garlic-done-carrot-done-rice.jpg";
import panEgg from "@/assets/media/mise-en-place/background/pan-on-oil-garlic-done-carrot-done-rice-done-egg.jpg";
import panSoy from "@/assets/media/mise-en-place/background/pan-on-oil-garlic-done-carrot-done-rice-done-egg-soy.jpg";
import panGreenOnion from "@/assets/media/mise-en-place/background/pan-on-oil-garlic-done-carrot-done-rice-done-egg-soy-green-onion.jpg";

import friedRice from "@/assets/media/mise-en-place/background/pan-fried-rice.jpg";
import friedRiceReady from "@/assets/media/mise-en-place/background/pan-fried-rice-ready.jpg";
import friedRiceReadyStoveOff from "@/assets/media/mise-en-place/background/pan-fried-rice-ready-stove-off.jpg";

import backButton from "@/assets/media/mise-en-place/buttons/back-button-1.png";

import InventoryBar from "../components/InventoryBar";


/*
 * =========================================================
 * TYPES
 * =========================================================
 */

interface Inventory {
    [key: string]: number;
}

interface PanScreenProps {
    panOn: boolean;

    onBack: () => void;

    inventory: Inventory;

    onRemoveIngredient: (
        ingredient: string
    ) => void;
}


/*
 * =========================================================
 * PAN STATES
 * =========================================================
 *
 * This is effectively the state machine for the recipe.
 *
 * IDLE
 *   ↓
 * OIL
 *   ↓
 * GARLIC
 *   ↓
 * CARROT
 *   ↓
 * RICE
 *   ↓
 * EGG
 *   ↓
 * SOY
 *   ↓
 * GREEN ONION
 *   ↓
 * STIRRING
 *   ↓
 * FRIED RICE
 *   ↓
 * READY
 *   ↓
 * READY / STOVE OFF
 * =========================================================
 */

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


/*
 * =========================================================
 * DSA — QUEUE
 * =========================================================
 *
 * FIFO = First In, First Out.
 *
 * The recipe is stored as a queue.
 *
 * enqueue()
 *     Adds a cooking action to the back.
 *
 * peek()
 *     Looks at the next required action.
 *
 * dequeue()
 *     Removes the action only after it is completed.
 *
 * This means the player cannot skip directly to soy sauce,
 * rice, etc.
 * =========================================================
 */

type CookingAction =
    | "cooking_oil"
    | "cut_garlic"
    | "cut_carrot"
    | "rice"
    | "egg"
    | "soy_sauce"
    | "cut_green_onion"
    | "stir";


class CookingQueue<T> {

    private items: T[] = [];


    /*
     * Add an item to the back.
     */
    enqueue(item: T) {
        this.items.push(item);
    }


    /*
     * Look at the next item without removing it.
     */
    peek(): T | undefined {
        return this.items[0];
    }


    /*
     * Remove the first item.
     */
    dequeue(): T | undefined {
        return this.items.shift();
    }


    /*
     * Number of remaining actions.
     */
    get size(): number {
        return this.items.length;
    }


    /*
     * Useful for displaying the queue
     * during development/demo.
     */
    toArray(): T[] {
        return [...this.items];
    }
}


/*
 * =========================================================
 * COMPONENT
 * =========================================================
 */

export default function PanScreen({
    panOn,
    onBack,
    inventory,
    onRemoveIngredient,
}: PanScreenProps) {

    /*
 * =========================================================
 * COOKING AUDIO
 * =========================================================
 */

    const fryingAudio =
        useRef<HTMLAudioElement | null>(null);

    const eggFryingAudio =
        useRef<HTMLAudioElement | null>(null);

    const stirAudio =
        useRef<HTMLAudioElement | null>(null);

    const completeAudio =
        useRef<HTMLAudioElement | null>(null);


    /*
     * Create audio objects once.
     */

    useEffect(() => {

        fryingAudio.current =
            new Audio("/audio/frying.wav");

        eggFryingAudio.current =
            new Audio("/audio/frying-egg.wav");

        stirAudio.current =
            new Audio("/audio/stir.wav");

        completeAudio.current =
            new Audio("/audio/food-ready.wav");


        /*
         * Frying should loop while cooking.
         */

        fryingAudio.current.loop = true;

        eggFryingAudio.current.loop = true;


        /*
         * Cleanup when leaving PanScreen.
         */

        return () => {

            fryingAudio.current?.pause();
            eggFryingAudio.current?.pause();
            stirAudio.current?.pause();
            completeAudio.current?.pause();

            fryingAudio.current = null;
            eggFryingAudio.current = null;
            stirAudio.current = null;
            completeAudio.current = null;
        };

    }, []);

    /*
 * =========================================================
 * STOVE AUDIO SAFETY
 * =========================================================
 */

    useEffect(() => {

        if (!panOn) {

            stopFryingAudio();

            stopEggFryingAudio();
        }

    }, [panOn]);

    /*
 * =========================================================
 * AUDIO HELPERS
 * =========================================================
 */

    const stopFryingAudio = () => {

        if (fryingAudio.current) {

            fryingAudio.current.pause();

            fryingAudio.current.currentTime = 0;
        }
    };


    const stopEggFryingAudio = () => {

        if (eggFryingAudio.current) {

            eggFryingAudio.current.pause();

            eggFryingAudio.current.currentTime = 0;
        }
    };


    const startFryingAudio = () => {

        /*
         * Do not play cooking audio while
         * the stove is off.
         */

        if (!panOn) {
            return;
        }

        /*
         * Egg frying must be stopped first.
         */

        stopEggFryingAudio();

        fryingAudio.current
            ?.play()
            .catch(() => { });
    };


    const startEggFryingAudio = () => {

        if (!panOn) {
            return;
        }

        /*
         * Normal frying sound stops
         * when the egg enters.
         */

        stopFryingAudio();

        eggFryingAudio.current
            ?.play()
            .catch(() => { });
    };

    /*
     * =========================================================
     * PAN STAGE
     * =========================================================
     */

    const [
        panStage,
        setPanStage,
    ] = useState<PanStage>(
        panOn ? "idle" : "idle"
    );


    /*
     * =========================================================
     * STIRRING
     * =========================================================
     */

    const [
        isStirring,
        setIsStirring,
    ] = useState(false);


    /*
     * =========================================================
     * DSA — RECIPE QUEUE
     * =========================================================
     *
     * The queue is created once.
     *
     * It does NOT reset on every render.
     */

    const recipeQueue =
        useRef<CookingQueue<CookingAction> | null>(
            null
        );


    /*
     * Initialize the queue once.
     */

    if (!recipeQueue.current) {

        const queue =
            new CookingQueue<CookingAction>();

        /*
         * =====================================================
         * FRIED RICE RECIPE QUEUE
         * =====================================================
         *
         * FIFO ORDER:
         *
         * 1. Oil
         * 2. Cut garlic
         * 3. Cut carrot
         * 4. Rice
         * 5. Egg
         * 6. Soy sauce
         * 7. Cut green onion
         * 8. Stir
         */

        queue.enqueue(
            "cooking_oil"
        );

        queue.enqueue(
            "cut_garlic"
        );

        queue.enqueue(
            "cut_carrot"
        );

        queue.enqueue(
            "rice"
        );

        queue.enqueue(
            "egg"
        );

        queue.enqueue(
            "soy_sauce"
        );

        queue.enqueue(
            "cut_green_onion"
        );

        queue.enqueue(
            "stir"
        );

        recipeQueue.current =
            queue;
    }


    /*
     * =========================================================
     * CURRENT REQUIRED ACTION
     * =========================================================
     *
     * Queue peek().
     */

    const nextAction =
        recipeQueue.current?.peek();


    /*
     * =========================================================
     * DSA — COMPLETED ACTIONS
     * =========================================================
     *
     * A Set gives us fast membership checking.
     *
     * This is also useful for demonstrating another
     * standard data structure.
     */

    const [
        completedActions,
        setCompletedActions,
    ] = useState<
        Set<CookingAction>
    >(
        () =>
            new Set<CookingAction>()
    );


    /*
     * =========================================================
     * COMPLETE QUEUE ACTION
     * =========================================================
     */

    const completeAction = useCallback(
        (
            action: CookingAction
        ) => {

            const queue =
                recipeQueue.current;

            if (!queue) {
                return;
            }


            /*
             * =================================================
             * QUEUE CHECK
             * =================================================
             *
             * The player can ONLY perform the action
             * currently at the front of the queue.
             */

            if (
                queue.peek() !== action
            ) {
                return;
            }


            /*
             * Remove the completed action
             * from the queue.
             */

            const completed =
                queue.dequeue();

            if (!completed) {
                return;
            }


            /*
             * Add the action to our Set.
             */

            setCompletedActions(
                (current) => {

                    const next =
                        new Set(current);

                    next.add(completed);

                    return next;
                }
            );


            /*
             * =================================================
             * STATE MACHINE TRANSITION
             * =================================================
             */

            switch (completed) {

                case "cooking_oil":

                    setPanStage("oil");

                    startFryingAudio();

                    break;

                case "cut_garlic":
                    setPanStage("garlic");
                    break;

                case "cut_carrot":
                    setPanStage("carrot");
                    break;

                case "rice":
                    setPanStage("rice");
                    break;

                case "egg":

                    setPanStage("egg");

                    startEggFryingAudio();

                    break;

                case "soy_sauce":

                    setPanStage("soy");

                    stopEggFryingAudio();

                    startFryingAudio();

                    break;

                case "cut_green_onion":
                    setPanStage(
                        "green_onion"
                    );
                    break;

                case "stir":
                    setPanStage(
                        "stirring"
                    );
                    break;
            }
        },
        [panOn]
    );


    /*
     * =========================================================
     * DRAG/DROP DATA
     * =========================================================
     */

    const handlePanDragOver = (
        event: React.DragEvent<HTMLDivElement>
    ) => {

        event.preventDefault();

        event.dataTransfer.dropEffect =
            "move";
    };


    /*
     * =========================================================
     * PAN DROP
     * =========================================================
     */

    const handlePanDrop = (
        event: React.DragEvent<HTMLDivElement>
    ) => {

        event.preventDefault();


        const ingredient =
            event.dataTransfer.getData(
                "application/x-cutting-board-ingredient"
            );


        /*
         * =====================================================
         * QUEUE PEEK
         * =====================================================
         *
         * We inspect the next recipe action BEFORE
         * changing anything.
         */

        const next =
            recipeQueue.current?.peek();


        if (!next) {
            return;
        }


        /*
         * =====================================================
         * MATCH INVENTORY ITEM TO QUEUE ACTION
         * =====================================================
         */

        let matchedAction:
            CookingAction | null =
            null;


        /*
         * OIL
         */

        if (
            next === "cooking_oil" &&
            (
                ingredient ===
                "cooking_oil"
            )
        ) {
            matchedAction =
                "cooking_oil";
        }


        /*
         * GARLIC
         *
         * Accept cut_garlic.
         *
         * We also accept garlic so the PanScreen remains
         * tolerant while you are testing the cutting flow.
         */

        if (
            next === "cut_garlic" &&
            ingredient === "cut_garlic"
        ) {
            matchedAction =
                "cut_garlic";
        }


        /*
         * CARROT
         */

        if (
            next === "cut_carrot" &&
            (
                ingredient ===
                "cut_carrot"
            )
        ) {
            matchedAction =
                "cut_carrot";
        }


        /*
         * RICE
         */

        if (
            next === "rice" &&
            ingredient ===
            "rice"
        ) {
            matchedAction =
                "rice";
        }


        /*
         * EGG
         */

        if (
            next === "egg" &&
            ingredient ===
            "egg"
        ) {
            matchedAction =
                "egg";
        }


        /*
         * SOY SAUCE
         */

        if (
            next === "soy_sauce" &&
            ingredient ===
            "soy_sauce"
        ) {
            matchedAction =
                "soy_sauce";
        }


        /*
         * GREEN ONION
         */

        if (
            next === "cut_green_onion" &&
            (
                ingredient ===
                "cut_green_onion"
            )
        ) {
            matchedAction =
                "cut_green_onion";
        }


        /*
         * Wrong ingredient.
         *
         * Nothing changes.
         */

        if (!matchedAction) {
            return;
        }


        /*
         * =====================================================
         * CONSUMABLE VS REUSABLE
         * =====================================================
         *
         * Oil is treated as consumed.
         *
         * Soy sauce is intentionally NOT removed.
         *
         * This keeps the seasoning bottle reusable.
         */

        if (
            matchedAction ===
            "cooking_oil"
        ) {

            onRemoveIngredient(
                "cooking_oil"
            );
        }


        /*
         * Normal ingredients are consumed.
         */

        if (
            matchedAction ===
            "cut_garlic" ||
            matchedAction ===
            "cut_carrot" ||
            matchedAction ===
            "rice" ||
            matchedAction ===
            "egg" ||
            matchedAction ===
            "cut_green_onion"
        ) {

            onRemoveIngredient(
                ingredient
            );
        }


        /*
         * Soy sauce is deliberately reusable.
         *
         * DO NOT call onRemoveIngredient().
         */


        /*
         * Complete the queue action.
         */

        completeAction(
            matchedAction
        );
    };


    /*
     * =========================================================
     * STIR
     * =========================================================
     *
     * Stir is the final queue action.
     *
     * We use a short timer to simulate the cooking process.
     */

    const handleStir = () => {

        if (
            nextAction !==
            "stir"
        ) {
            return;
        }

        if (isStirring) {
            return;
        }

        if (!panOn) {
            return;
        }


        setIsStirring(true);


        /*
         * Stop normal frying while stirring.
         */

        stopFryingAudio();

        stopEggFryingAudio();


        /*
         * Complete the queue action.
         */

        completeAction(
            "stir"
        );

        setPanStage(
            "fried_rice"
        );


        /*
         * =========================================================
         * STIR SOUND
         * =========================================================
         *
         * Play the same stir sound 3 times.
         *
         * We deliberately create a fresh Audio object
         * for each repetition so the sound can restart
         * cleanly even if the WAV is still playing.
         */

        let stirCount = 0;

        const playStir = () => {

            if (!panOn) {
                return;
            }

            stirCount += 1;

            const sound =
                new Audio("/audio/stir.wav");

            sound.currentTime = 0;

            sound.play().catch(() => { });


            /*
             * Play three times total.
             */

            if (stirCount < 3) {

                window.setTimeout(
                    playStir,
                    700
                );
            }
        };


        playStir();


        /*
         * =========================================================
         * READY
         * =========================================================
         *
         * After stirring finishes, play complete.wav.
         */

        window.setTimeout(() => {

            setIsStirring(false);

            setPanStage(
                "ready"
            );


            /*
             * Fried rice is now complete.
             */

            completeAudio.current
                ?.play()
                .catch(() => { });

        }, 3000);
    };


    /*
     * =========================================================
     * TURN STOVE OFF
     * =========================================================
     */

    const handleTurnOffStove = () => {

        if (
            panStage !==
            "ready"
        ) {
            return;
        }


        /*
         * Stop any remaining cooking audio.
         */

        stopFryingAudio();

        stopEggFryingAudio();


        setPanStage(
            "ready_stove_off"
        );
    };


    /*
     * =========================================================
     * CURRENT PAN IMAGE
     * =========================================================
     */

    const currentImage =
        useMemo(() => {

            switch (panStage) {

                case "oil":
                    return panOil;

                case "garlic":
                    return panGarlic;

                case "carrot":
                    return panCarrot;

                case "rice":
                    return panRice;

                case "egg":
                    return panEgg;

                case "soy":
                    return panSoy;

                case "green_onion":
                    return panGreenOnion;

                case "stirring":
                case "fried_rice":
                    return friedRice;

                case "ready":
                    return friedRiceReady;

                case "ready_stove_off":
                    return friedRiceReadyStoveOff;

                case "idle":
                default:
                    return panOn
                        ? panInnerOn
                        : panInner;
            }

        }, [
            panStage,
            panOn,
        ]);


    /*
     * =========================================================
     * HUMAN-READABLE NEXT STEP
     * =========================================================
     */

    const nextActionText =
        useMemo(() => {

            switch (nextAction) {

                case "cooking_oil":
                    return "Add cooking oil";

                case "cut_garlic":
                    return "Add cut garlic";

                case "cut_carrot":
                    return "Add cut carrot";

                case "rice":
                    return "Add cold rice";

                case "egg":
                    return "Add egg";

                case "soy_sauce":
                    return "Add soy sauce";

                case "cut_green_onion":
                    return "Add cut green onion";

                case "stir":
                    return "Stir the fried rice";

                default:
                    return "Fried rice complete!";
            }

        }, [
            nextAction,
        ]);


    /*
     * =========================================================
     * RENDER
     * =========================================================
     */

    return (
        <div
            onDragOver={
                handlePanDragOver
            }

            onDrop={
                handlePanDrop
            }

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
                PAN INTERIOR
            ================================================= */}

            <img
                src={
                    typeof currentImage ===
                        "string"
                        ? currentImage
                        : currentImage.src
                }

                alt="Pan"

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

                onClick={
                    onBack
                }

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

                    transition:
                        "transform 140ms ease",
                }}

                onMouseEnter={(
                    event
                ) => {

                    event.currentTarget.style.transform =
                        "scale(1.043)";
                }}

                onMouseLeave={(
                    event
                ) => {

                    event.currentTarget.style.transform =
                        "scale(1)";
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
                INSTRUCTION
            ================================================= */}

            {panStage !==
                "ready_stove_off" && (

                    <div
                        style={{
                            position:
                                "absolute",

                            left: "50%",

                            top: "8%",

                            transform:
                                "translateX(-50%)",

                            zIndex: 90,

                            color:
                                "rgba(104,67,41,0.9)",

                            fontSize:
                                "20px",

                            fontWeight: 700,

                            textAlign:
                                "center",

                            pointerEvents:
                                "none",

                            whiteSpace:
                                "nowrap",
                        }}
                    >
                        {nextActionText}
                    </div>
                )}


            {/* =================================================
                STIR BUTTON
            =================================================
            
                Stir is represented as the final action in
                the recipe queue.
            
                It only appears when every ingredient has
                been added in the correct FIFO order.
            ================================================= */}

            {nextAction ===
                "stir" && (

                    <button
                        type="button"

                        onClick={
                            handleStir
                        }

                        disabled={
                            isStirring
                        }

                        style={{
                            position:
                                "absolute",

                            left: "50%",

                            bottom: "22%",

                            transform:
                                "translateX(-50%)",

                            padding:
                                "14px 28px",

                            border:
                                "none",

                            borderRadius:
                                "12px",

                            background:
                                "rgba(156,66,66,0.95)",

                            color:
                                "#fff",

                            fontFamily:
                                "Comfortaa, sans-serif",

                            fontSize:
                                "18px",

                            fontWeight: 700,

                            cursor:
                                isStirring
                                    ? "default"
                                    : "pointer",

                            zIndex: 95,

                            opacity:
                                isStirring
                                    ? 0.6
                                    : 1,
                        }}
                    >
                        {isStirring
                            ? "STIRRING..."
                            : "STIR"}
                    </button>
                )}


            {/* =================================================
                STOVE OFF
            ================================================= */}

            {panStage ===
                "ready" && (

                    <button
                        type="button"

                        onClick={
                            handleTurnOffStove
                        }

                        style={{
                            position:
                                "absolute",

                            right: "7%",

                            top: "12%",

                            padding:
                                "12px 20px",

                            border:
                                "none",

                            borderRadius:
                                "10px",

                            background:
                                "rgba(156,66,66,0.95)",

                            color:
                                "#fff",

                            fontFamily:
                                "Comfortaa, sans-serif",

                            fontSize:
                                "15px",

                            fontWeight: 700,

                            cursor:
                                "pointer",

                            zIndex: 95,
                        }}
                    >
                        TURN STOVE OFF
                    </button>
                )}


            {/* =================================================
                COMPLETION
            ================================================= */}

            {panStage ===
                "ready_stove_off" && (

                    <div
                        style={{
                            position:
                                "absolute",

                            left: "50%",

                            top: "12%",

                            transform:
                                "translateX(-50%)",

                            color:
                                "rgb(104,67,41)",

                            fontFamily:
                                "Comfortaa, sans-serif",

                            fontSize:
                                "24px",

                            fontWeight: 700,

                            zIndex: 90,

                            pointerEvents:
                                "none",

                            textAlign:
                                "center",
                        }}
                    >
                        Fried Rice Ready!
                    </div>
                )}


            {/* =================================================
                DSA DEBUG PANEL
            =================================================
            
                This is useful for your project demonstration.
            
                It visibly shows:
            
                • Queue
                • peek()
                • queue size
                • completed Set
            
                Remove this entire block before final submission
                if you don't want the debug information visible.
            ================================================= */}

            <div
                style={{
                    position:
                        "absolute",

                    right: "15px",

                    top: "15px",

                    width: "230px",

                    padding:
                        "12px",

                    background:
                        "rgba(0,0,0,0.72)",

                    color:
                        "#fff",

                    borderRadius:
                        "8px",

                    fontFamily:
                        "monospace",

                    fontSize:
                        "11px",

                    lineHeight:
                        1.6,

                    zIndex: 200,

                    pointerEvents:
                        "none",
                }}
            >

                <div
                    style={{
                        fontWeight: 700,
                        marginBottom: "5px",
                    }}
                >
                    DSA — RECIPE QUEUE
                </div>

                <div>
                    peek():{" "}
                    {nextAction ??
                        "EMPTY"}
                </div>

                <div>
                    size:{" "}
                    {recipeQueue.current
                        ?.size ?? 0}
                </div>

                <div>
                    stage:{" "}
                    {panStage}
                </div>

                <div
                    style={{
                        marginTop:
                            "5px",
                    }}
                >
                    Queue:
                </div>

                {recipeQueue.current
                    ?.toArray()
                    .map(
                        (
                            action,
                            index
                        ) => (

                            <div
                                key={
                                    `${action}-${index}`
                                }
                                style={{
                                    opacity:
                                        index ===
                                            0
                                            ? 1
                                            : 0.55,
                                }}
                            >
                                {index + 1}.{" "}
                                {action}
                            </div>
                        )
                    )}

                <div
                    style={{
                        marginTop:
                            "5px",
                    }}
                >
                    Completed:{" "}
                    {completedActions.size}
                </div>

            </div>


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

                onIngredientDragStart={(
                    ingredient,
                    event
                ) => {

                    /*
                     * PanScreen uses the same drag
                     * data-transfer system as the
                     * cutting board.
                     *
                     * InventoryBar can be expanded
                     * to allow additional ingredients.
                     */

                    event.dataTransfer.setData(
                        "application/x-cutting-board-ingredient",
                        ingredient
                    );
                }}

                onIngredientDragEnd={() => { }}
            />

        </div>
    );
}