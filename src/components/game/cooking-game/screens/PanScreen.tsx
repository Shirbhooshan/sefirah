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


export type PanStage =
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


export type CookingAction =
    | "cooking_oil"
    | "cut_garlic"
    | "cut_carrot"
    | "rice"
    | "egg"
    | "soy_sauce"
    | "cut_green_onion"
    | "stir";


interface PanProgress {
    stage: PanStage;
    completedActions: CookingAction[];
    isStirring: boolean;
}


/*
 * =========================================================
 * QUEUE
 * =========================================================
 */

class CookingQueue<T> {

    private items: T[] = [];

    enqueue(item: T) {
        this.items.push(item);
    }

    peek(): T | undefined {
        return this.items[0];
    }

    dequeue(): T | undefined {
        return this.items.shift();
    }

    get size(): number {
        return this.items.length;
    }

    toArray(): T[] {
        return [...this.items];
    }
}


/*
 * =========================================================
 * PROPS
 * =========================================================
 */

interface PanScreenProps {

    panOn: boolean;

    onBack: () => void;

    inventory: Inventory;

    onRemoveIngredient: (
        ingredient: string
    ) => void;

    /*
     * Persistent progress owned by CookingGame.
     */

    panProgress: PanProgress;

    setPanProgress: React.Dispatch<
        React.SetStateAction<PanProgress>
    >;
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
    panProgress,
    setPanProgress,
}: PanScreenProps) {


    /*
     * =========================================================
     * AUDIO
     * =========================================================
     */

    const fryingAudio =
        useRef<HTMLAudioElement | null>(null);

    const eggFryingAudio =
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

        completeAudio.current =
            new Audio("/audio/food-ready.wav");

        fryingAudio.current.loop = true;

        eggFryingAudio.current.loop = true;


        return () => {

            fryingAudio.current?.pause();
            eggFryingAudio.current?.pause();
            completeAudio.current?.pause();

            fryingAudio.current = null;
            eggFryingAudio.current = null;
            completeAudio.current = null;
        };

    }, []);


    /*
     * =========================================================
     * AUDIO HELPERS
     * =========================================================
     */

    const stopFryingAudio = useCallback(() => {

        if (fryingAudio.current) {

            fryingAudio.current.pause();

            fryingAudio.current.currentTime = 0;
        }

    }, []);


    const stopEggFryingAudio = useCallback(() => {

        if (eggFryingAudio.current) {

            eggFryingAudio.current.pause();

            eggFryingAudio.current.currentTime = 0;
        }

    }, []);


    const startFryingAudio = useCallback(() => {

        if (!panOn) {
            return;
        }

        stopEggFryingAudio();

        fryingAudio.current
            ?.play()
            .catch((error) => {
                console.warn(
                    "Could not play frying.wav:",
                    error
                );
            });

    }, [
        panOn,
        stopEggFryingAudio,
    ]);


    const startEggFryingAudio = useCallback(() => {

        if (!panOn) {
            return;
        }

        stopFryingAudio();

        eggFryingAudio.current
            ?.play()
            .catch((error) => {
                console.warn(
                    "Could not play frying-egg.wav:",
                    error
                );
            });

    }, [
        panOn,
        stopFryingAudio,
    ]);


    /*
     * =========================================================
     * QUEUE
     * =========================================================
     *
     * IMPORTANT:
     *
     * The queue is reconstructed from completedActions.
     *
     * Therefore leaving PanScreen does NOT destroy progress.
     */

    const recipeQueue =
        useMemo(() => {

            const queue =
                new CookingQueue<CookingAction>();

            const recipe: CookingAction[] = [

                "cooking_oil",
                "cut_garlic",
                "cut_carrot",
                "rice",
                "egg",
                "soy_sauce",
                "cut_green_onion",
                "stir",

            ];

            for (
                const action
                of recipe
            ) {

                if (
                    !panProgress.completedActions.includes(
                        action
                    )
                ) {

                    queue.enqueue(
                        action
                    );
                }
            }

            return queue;

        }, [
            panProgress.completedActions,
        ]);


    const nextAction =
        recipeQueue.peek();


    /*
     * =========================================================
     * CURRENT STAGE
     * =========================================================
     */

    const panStage =
        panProgress.stage;


    const isStirring =
        panProgress.isStirring;


    /*
     * =========================================================
     * KEEP AUDIO IN SYNC WITH CURRENT STATE
     * =========================================================
     *
     * This is especially important when returning to PanScreen.
     *
     * Example:
     *
     * Leave while frying rice
     *       ↓
     * return to PanScreen
     *       ↓
     * frying.wav starts again
     *
     * The previous PanScreen audio instance was destroyed,
     * so we safely create/play a new one here.
     */

    useEffect(() => {

        if (!panOn) {

            stopFryingAudio();
            stopEggFryingAudio();

            return;
        }


        /*
         * No cooking sound before oil.
         */

        if (
            panStage === "idle"
        ) {

            stopFryingAudio();
            stopEggFryingAudio();

            return;
        }


        /*
         * Egg stage gets its own sound.
         */

        if (
            panStage === "egg"
        ) {

            startEggFryingAudio();

            return;
        }


        /*
         * Normal cooking stages use frying.wav.
         */

        if (
            panStage === "oil" ||
            panStage === "garlic" ||
            panStage === "carrot" ||
            panStage === "rice" ||
            panStage === "soy" ||
            panStage === "green_onion"
        ) {

            startFryingAudio();

            return;
        }


        /*
         * Stirring / completed food should
         * have no frying sound.
         */

        stopFryingAudio();
        stopEggFryingAudio();

    }, [
        panOn,
        panStage,
        startFryingAudio,
        startEggFryingAudio,
        stopFryingAudio,
        stopEggFryingAudio,
    ]);


    /*
     * =========================================================
     * COMPLETE ACTION
     * =========================================================
     */

    const completeAction = useCallback(
        (
            action: CookingAction
        ) => {

            if (
                recipeQueue.peek() !== action
            ) {
                return;
            }


            setPanProgress(
                (current) => {

                    /*
                     * Don't duplicate actions.
                     */

                    if (
                        current.completedActions.includes(
                            action
                        )
                    ) {

                        return current;
                    }


                    const completedActions = [
                        ...current.completedActions,
                        action,
                    ];


                    let nextStage =
                        current.stage;


                    switch (action) {

                        case "cooking_oil":
                            nextStage = "oil";
                            break;

                        case "cut_garlic":
                            nextStage = "garlic";
                            break;

                        case "cut_carrot":
                            nextStage = "carrot";
                            break;

                        case "rice":
                            nextStage = "rice";
                            break;

                        case "egg":
                            nextStage = "egg";
                            break;

                        case "soy_sauce":
                            nextStage = "soy";
                            break;

                        case "cut_green_onion":
                            nextStage =
                                "green_onion";
                            break;

                        case "stir":
                            nextStage =
                                "stirring";
                            break;
                    }


                    return {

                        ...current,

                        stage:
                            nextStage,

                        completedActions,

                    };
                }
            );

        },
        [
            recipeQueue,
            setPanProgress,
        ]
    );


    /*
     * =========================================================
     * PAN DRAG OVER
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


        /*
         * Stove must be ON.
         */

        if (!panOn) {
            return;
        }


        const ingredient =
            event.dataTransfer.getData(
                "application/x-cutting-board-ingredient"
            );


        const next =
            recipeQueue.peek();


        if (!next) {
            return;
        }


        let matchedAction:
            CookingAction | null =
            null;


        /*
         * =====================================================
         * OIL
         * =====================================================
         */

        if (
            next === "cooking_oil" &&
            ingredient === "cooking_oil"
        ) {

            matchedAction =
                "cooking_oil";
        }


        /*
         * =====================================================
         * GARLIC
         *
         * ONLY cut_garlic is accepted.
         *
         * Plain "garlic" is intentionally rejected.
         * =====================================================
         */

        if (
            next === "cut_garlic" &&
            ingredient === "cut_garlic"
        ) {

            matchedAction =
                "cut_garlic";
        }


        /*
         * =====================================================
         * CARROT
         * =====================================================
         */

        if (
            next === "cut_carrot" &&
            ingredient === "cut_carrot"
        ) {

            matchedAction =
                "cut_carrot";
        }


        /*
         * =====================================================
         * RICE
         * =====================================================
         */

        if (
            next === "rice" &&
            ingredient === "rice"
        ) {

            matchedAction =
                "rice";
        }


        /*
         * =====================================================
         * EGG
         * =====================================================
         */

        if (
            next === "egg" &&
            ingredient === "egg"
        ) {

            matchedAction =
                "egg";
        }


        /*
         * =====================================================
         * SOY SAUCE
         * =====================================================
         */

        if (
            next === "soy_sauce" &&
            ingredient === "soy_sauce"
        ) {

            matchedAction =
                "soy_sauce";
        }


        /*
         * =====================================================
         * GREEN ONION
         * =====================================================
         */

        if (
            next === "cut_green_onion" &&
            ingredient === "cut_green_onion"
        ) {

            matchedAction =
                "cut_green_onion";
        }


        /*
         * Wrong ingredient.
         */

        if (!matchedAction) {
            return;
        }


        /*
         * =====================================================
         * CONSUME INGREDIENT
         * =====================================================
         */

        if (
            matchedAction === "cooking_oil"
        ) {

            onRemoveIngredient(
                "cooking_oil"
            );
        }


        if (
            matchedAction === "cut_garlic" ||
            matchedAction === "cut_carrot" ||
            matchedAction === "rice" ||
            matchedAction === "egg" ||
            matchedAction === "cut_green_onion"
        ) {

            onRemoveIngredient(
                ingredient
            );
        }


        /*
         * Soy sauce intentionally remains reusable.
         */


        /*
         * Complete action.
         */

        completeAction(
            matchedAction
        );

    };


    /*
     * =========================================================
     * STIR
     * =========================================================
     */

    const handleStir = () => {

        if (
            nextAction !== "stir"
        ) {

            return;
        }


        if (isStirring) {
            return;
        }


        if (!panOn) {
            return;
        }


        /*
         * Stop cooking sounds.
         */

        stopFryingAudio();
        stopEggFryingAudio();


        /*
         * Mark stirring immediately.
         */

        setPanProgress(
            (current) => {

                if (
                    current.isStirring
                ) {

                    return current;
                }


                return {

                    ...current,

                    stage:
                        "stirring",

                    isStirring:
                        true,

                    completedActions:
                        current.completedActions.includes(
                            "stir"
                        )
                            ? current.completedActions
                            : [
                                ...current.completedActions,
                                "stir",
                            ],
                };

            }
        );


        /*
         * =====================================================
         * STIR SOUND
         * =====================================================
         *
         * Play stir.wav three times.
         */

        let stirCount = 0;

        const playStir = () => {

            if (!panOn) {
                return;
            }


            stirCount += 1;


            const sound =
                new Audio(
                    "/audio/stir.wav"
                );


            sound.currentTime = 0;


            sound.play()
                .catch((error) => {

                    console.warn(
                        "Could not play stir.wav:",
                        error
                    );

                });


            if (
                stirCount < 3
            ) {

                window.setTimeout(
                    playStir,
                    700
                );
            }

        };


        playStir();


        /*
         * =====================================================
         * FOOD READY
         * =====================================================
         */

        window.setTimeout(() => {

            setPanProgress(
                (current) => ({

                    ...current,

                    stage:
                        "ready",

                    isStirring:
                        false,

                })
            );


            /*
             * Play food-ready.wav.
             */

            if (
                completeAudio.current
            ) {

                completeAudio.current
                    .currentTime = 0;

                completeAudio.current
                    .play()
                    .catch((error) => {

                        console.warn(
                            "Could not play food-ready.wav:",
                            error
                        );

                    });
            }

        }, 3000);

    };


    /*
     * =========================================================
     * TURN STOVE OFF
     * =========================================================
     */

    const handleTurnOffStove = () => {

        if (
            panStage !== "ready"
        ) {

            return;
        }


        stopFryingAudio();
        stopEggFryingAudio();


        setPanProgress(
            (current) => ({

                ...current,

                stage:
                    "ready_stove_off",

            })
        );

    };


    /*
     * =========================================================
     * CURRENT IMAGE
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
     * NEXT ACTION TEXT
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
                PAN
            ================================================= */}

            <img
                src={
                    typeof currentImage === "string"
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

                    cursor:
                        "pointer",

                    zIndex: 100,

                    transition:
                        "transform 140ms ease",
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

                        fontWeight:
                            700,

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
                STIR
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

                        fontWeight:
                            700,

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
                TURN STOVE OFF
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

                        fontWeight:
                            700,

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

                        fontWeight:
                            700,

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
                DSA DEBUG
            ================================================= */}

            <div
                style={{
                    position:
                        "absolute",

                    right:
                        "15px",

                    top:
                        "15px",

                    width:
                        "230px",

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

                    zIndex:
                        200,

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
                    {recipeQueue.size}
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

                {recipeQueue
                    .toArray()
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
                                        index === 0
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
                    {
                        panProgress
                            .completedActions
                            .length
                    }
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