"use client";

import { useEffect, useState } from "react";

import bookImage from "@/assets/media/mise-en-place/background/book.jpg";

import leftArrow from "@/assets/media/mise-en-place/buttons/left-arrow-button.png";
import rightArrow from "@/assets/media/mise-en-place/buttons/right-arrow-button.png";
import closeButton from "@/assets/media/mise-en-place/buttons/recipe-book-close-button.png";

import riceImage from "@/assets/media/mise-en-place/icons/rice.png";
import eggImage from "@/assets/media/mise-en-place/icons/egg.png";
import carrotImage from "@/assets/media/mise-en-place/icons/carrot.png";
import garlicImage from "@/assets/media/mise-en-place/icons/onion.png";
import greenOnionImage from "@/assets/media/mise-en-place/icons/green-onion.png";
import soySauceImage from "@/assets/media/mise-en-place/icons/soy-sauce.png";
import cookingOilImage from "@/assets/media/mise-en-place/icons/cooking-oil.png";

interface RecipeBookProps {
    isOpen: boolean;
    onClose: () => void;
}

interface Ingredient {
    name: string;
    image: string;
}

interface RecipeStep {
    id: string;
    title: string;
    description: string;
}

const ingredients: Ingredient[] = [
    {
        name: "Rice",
        image:
            typeof riceImage === "string"
                ? riceImage
                : riceImage.src,
    },
    {
        name: "Egg",
        image:
            typeof eggImage === "string"
                ? eggImage
                : eggImage.src,
    },
    {
        name: "Carrot",
        image:
            typeof carrotImage === "string"
                ? carrotImage
                : carrotImage.src,
    },
    {
        name: "Garlic",
        image:
            typeof garlicImage === "string"
                ? garlicImage
                : garlicImage.src,
    },
    {
        name: "Green Onion",
        image:
            typeof greenOnionImage === "string"
                ? greenOnionImage
                : greenOnionImage.src,
    },
    {
        name: "Soy Sauce",
        image:
            typeof soySauceImage === "string"
                ? soySauceImage
                : soySauceImage.src,
    },
    {
        name: "Cooking Oil",
        image:
            typeof cookingOilImage === "string"
                ? cookingOilImage
                : cookingOilImage.src,
    },
];

/*
 * =========================================================
 * COMPLETE FRIED RICE RECIPE
 *
 * These are the steps for the entire game flow.
 * The recipe book itself is only a guide, so it does not
 * need to know whether a step has actually been completed.
 * =========================================================
 */

const recipeSteps: RecipeStep[] = [
    {
        id: "ingredients",
        title: "Get the Ingredients",
        description:
            "Open the fridge and collect the ingredients you need for the fried rice.",
    },
    {
        id: "cut",
        title: "Cut the Vegetables",
        description:
            "Use the cutting board to cut the carrot, garlic and green onion.",
    },
    {
        id: "egg_prepare",
        title: "Prepare the Egg",
        description:
            "Prepare the egg so it is ready to be cooked in the pan.",
    },
    {
        id: "stove",
        title: "Turn on the Stove",
        description:
            "Turn on the stove underneath the pan and get it hot.",
    },
    {
        id: "oil",
        title: "Add the Oil",
        description:
            "Add cooking oil to the hot pan.",
    },
    {
        id: "garlic",
        title: "Add the Garlic",
        description:
            "Add the chopped garlic to the pan.",
    },
    {
        id: "carrot",
        title: "Add the Carrot",
        description:
            "Add the chopped carrot and let it cook with the garlic.",
    },
    {
        id: "rice",
        title: "Add the Rice",
        description:
            "Add the rice to the pan with the vegetables.",
    },
    {
        id: "egg",
        title: "Add the Egg",
        description:
            "Add the prepared egg to the fried rice.",
    },
    {
        id: "soy",
        title: "Add the Soy Sauce",
        description:
            "Add soy sauce to season the fried rice.",
    },
    {
        id: "green_onion",
        title: "Add the Green Onion",
        description:
            "Add the chopped green onion to finish the ingredients.",
    },
    {
        id: "stir",
        title: "Stir the Fried Rice",
        description:
            "Stir everything together until the ingredients are evenly mixed and cooked.",
    },
    {
        id: "ready",
        title: "Fried Rice is Ready",
        description:
            "The fried rice is finished. Turn off the stove and serve it!",
    },
];

function getSrc(image: string | { src: string }) {
    return typeof image === "string"
        ? image
        : image.src;
}

export default function RecipeBook({
    isOpen,
    onClose,
}: RecipeBookProps) {
    /*
     * page 0 = ingredients
     *
     * page 1 = Get Ingredients
     * page 2 = Cut Vegetables
     * page 3 = Prepare Egg
     * ...
     * page 13 = Fried Rice is Ready
     */

    const [page, setPage] = useState(0);

    /*
     * =========================================================
     * RESET BOOK WHEN OPENED
     * =========================================================
     */

    useEffect(() => {
        if (isOpen) {
            setPage(0);
        }
    }, [isOpen]);

    /*
     * =========================================================
     * KEYBOARD CONTROLS
     * =========================================================
     */

    useEffect(() => {
        if (!isOpen) {
            return;
        }

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                onClose();
                return;
            }

            if (event.key === "ArrowLeft") {
                setPage((current) =>
                    Math.max(0, current - 1)
                );
            }

            if (event.key === "ArrowRight") {
                setPage((current) =>
                    Math.min(
                        recipeSteps.length,
                        current + 1
                    )
                );
            }
        };

        window.addEventListener(
            "keydown",
            handleKeyDown
        );

        return () => {
            window.removeEventListener(
                "keydown",
                handleKeyDown
            );
        };
    }, [isOpen, onClose]);

    /*
     * =========================================================
     * PAGE NAVIGATION
     * =========================================================
     */

    const previousPage = () => {
        setPage((current) =>
            Math.max(0, current - 1)
        );
    };

    const nextPage = () => {
        setPage((current) =>
            Math.min(
                recipeSteps.length,
                current + 1
            )
        );
    };

    const isIngredientsPage = page === 0;

    const currentStep =
        page > 0
            ? recipeSteps[page - 1]
            : null;

    return (
        <div
            style={{
                position: "absolute",
                inset: 0,

                zIndex: 1000,

                overflow: "hidden",

                pointerEvents: isOpen
                    ? "auto"
                    : "none",
            }}
        >
            {/* =====================================================
                BOOK
            ====================================================== */}

            <div
                style={{
                    position: "absolute",

                    left: "50%",

                    bottom: isOpen
                        ? "0px"
                        : "-100%",

                    width: "min(90%, 900px)",

                    aspectRatio: "16 / 9",

                    transform:
                        "translateX(-50%)",

                    transition:
                        "bottom 500ms cubic-bezier(0.22, 1, 0.36, 1)",

                    zIndex: 1000,

                    pointerEvents: isOpen
                        ? "auto"
                        : "none",
                }}
            >
                {/* =================================================
                    BOOK BACKGROUND
                ================================================== */}

                <img
                    src={getSrc(bookImage)}
                    alt="Recipe Book"
                    draggable={false}
                    style={{
                        position: "absolute",

                        inset: 0,

                        width: "100%",
                        height: "100%",

                        objectFit: "fill",

                        pointerEvents: "none",

                        userSelect: "none",
                    }}
                />

                {/* =================================================
                    CLOSE BUTTON
                ================================================== */}

                <button
                    onClick={onClose}
                    aria-label="Close recipe book"
                    style={{
                        position: "absolute",

                        top: "34%",
                        right: "13.3%",

                        width: "5%",

                        aspectRatio: "1 / 1",

                        padding: 0,

                        border: "none",

                        background:
                            "transparent",

                        cursor: "pointer",

                        zIndex: 20,
                    }}
                >
                    <img
                        src={getSrc(closeButton)}
                        alt="Close"
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
                    LEFT ARROW
                ================================================== */}

                <button
                    onClick={previousPage}
                    disabled={page === 0}
                    aria-label="Previous page"
                    style={{
                        position: "absolute",

                        left: "18%",
                        top: "60%",

                        width: "6%",

                        aspectRatio: "1 / 1",

                        padding: 0,

                        border: "none",

                        background:
                            "transparent",

                        cursor:
                            page === 0
                                ? "default"
                                : "pointer",

                        opacity:
                            page === 0
                                ? 0.25
                                : 1,

                        zIndex: 20,
                    }}
                >
                    <img
                        src={getSrc(leftArrow)}
                        alt="Previous"
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
                    RIGHT ARROW
                ================================================== */}

                <button
                    onClick={nextPage}
                    disabled={
                        page ===
                        recipeSteps.length
                    }
                    aria-label="Next page"
                    style={{
                        position: "absolute",

                        right: "12%",
                        top: "60%",

                        width: "6%",

                        aspectRatio: "1 / 1",

                        padding: 0,

                        border: "none",

                        background:
                            "transparent",

                        cursor:
                            page ===
                            recipeSteps.length
                                ? "default"
                                : "pointer",

                        opacity:
                            page ===
                            recipeSteps.length
                                ? 0.25
                                : 1,

                        zIndex: 20,
                    }}
                >
                    <img
                        src={getSrc(rightArrow)}
                        alt="Next"
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
                    PAGE CONTENT

                    This is the position you said was perfect.
                ================================================== */}

                <div
                    style={{
                        position: "absolute",

                        left: "20%",

                        top: "37%",

                        width: "64%",
                        height: "62%",

                        display: "flex",

                        fontFamily:
                            "Comfortaa, sans-serif",

                        color: "#2b2118",

                        pointerEvents: "none",

                        zIndex: 10,
                    }}
                >
                    {/* =================================================
                        INGREDIENT PAGE
                    ================================================== */}

                    {isIngredientsPage ? (
                        <>
                            {/* LEFT PAGE */}

                            <div
                                style={{
                                    width: "50%",
                                    height: "100%",

                                    padding:
                                        "4% 6%",

                                    boxSizing:
                                        "border-box",

                                    display:
                                        "flex",

                                    flexDirection:
                                        "column",

                                    alignItems:
                                        "center",

                                    overflow:
                                        "hidden",
                                }}
                            >
                                <h1
                                    style={{
                                        margin:
                                            "0 0 4%",

                                        fontSize:
                                            "clamp(14px, 1.5vw, 24px)",

                                        fontWeight: 600,

                                        textAlign:
                                            "center",
                                    }}
                                >
                                    Ingredients
                                </h1>

                                <div
                                    style={{
                                        width:
                                            "100%",

                                        display:
                                            "grid",

                                        gridTemplateColumns:
                                            "repeat(3, 1fr)",

                                        gap:
                                            "8px 4px",

                                        alignItems:
                                            "start",
                                    }}
                                >
                                    {ingredients.map(
                                        (
                                            ingredient
                                        ) => (
                                            <div
                                                key={
                                                    ingredient.name
                                                }
                                                style={{
                                                    display:
                                                        "flex",

                                                    flexDirection:
                                                        "column",

                                                    alignItems:
                                                        "center",

                                                    textAlign:
                                                        "center",
                                                }}
                                            >
                                                <div
                                                    style={{
                                                        width:
                                                            "100%",

                                                        height:
                                                            "36px",

                                                        display:
                                                            "flex",

                                                        alignItems:
                                                            "center",

                                                        justifyContent:
                                                            "center",
                                                    }}
                                                >
                                                    <img
                                                        src={
                                                            ingredient.image
                                                        }
                                                        alt={
                                                            ingredient.name
                                                        }
                                                        draggable={
                                                            false
                                                        }
                                                        style={{
                                                            maxWidth:
                                                                "100%",

                                                            maxHeight:
                                                                "36px",

                                                            objectFit:
                                                                "contain",
                                                        }}
                                                    />
                                                </div>

                                                <div
                                                    style={{
                                                        marginTop:
                                                            "2px",

                                                        fontSize:
                                                            "clamp(7px, 0.8vw, 11px)",

                                                        fontWeight:
                                                            500,

                                                        lineHeight:
                                                            1.1,

                                                        wordBreak:
                                                            "break-word",
                                                    }}
                                                >
                                                    {
                                                        ingredient.name
                                                    }
                                                </div>
                                            </div>
                                        )
                                    )}
                                </div>
                            </div>

                            {/* RIGHT PAGE */}

                            <div
                                style={{
                                    width: "50%",
                                    height: "100%",

                                    padding:
                                        "4% 6%",

                                    boxSizing:
                                        "border-box",

                                    display:
                                        "flex",

                                    flexDirection:
                                        "column",

                                    alignItems:
                                        "center",

                                    justifyContent:
                                        "center",

                                    overflow:
                                        "hidden",

                                    textAlign:
                                        "center",
                                }}
                            >
                                <div
                                    style={{
                                        fontSize:
                                            "clamp(9px, 1vw, 14px)",

                                        opacity: 0.55,

                                        marginBottom:
                                            "8px",

                                        letterSpacing:
                                            "0.08em",
                                    }}
                                >
                                    MISE EN PLACE
                                </div>

                                <h2
                                    style={{
                                        margin: 0,

                                        fontSize:
                                            "clamp(14px, 1.4vw, 22px)",

                                        fontWeight: 600,
                                    }}
                                >
                                    Fried Rice
                                </h2>

                                <p
                                    style={{
                                        marginTop:
                                            "12px",

                                        fontSize:
                                            "clamp(8px, 0.8vw, 12px)",

                                        lineHeight:
                                            1.4,

                                        opacity: 0.7,

                                        maxWidth:
                                            "85%",
                                    }}
                                >
                                    Follow the recipe
                                    from preparation
                                    to plating.
                                </p>

                                <div
                                    style={{
                                        marginTop:
                                            "10px",

                                        fontSize:
                                            "clamp(7px, 0.75vw, 10px)",

                                        opacity: 0.5,
                                    }}
                                >
                                    {recipeSteps.length} steps
                                </div>
                            </div>
                        </>
                    ) : (
                        /* =================================================
                            STEP PAGE

                            ONE STEP PER SPREAD.

                            LEFT:
                            Step number + title

                            RIGHT:
                            Instruction

                            This deliberately does NOT repeat the title
                            and description on both pages.
                        ================================================== */

                        <>
                            {/* LEFT PAGE */}

                            <div
                                style={{
                                    width: "50%",
                                    height: "100%",

                                    padding:
                                        "4% 6%",

                                    boxSizing:
                                        "border-box",

                                    display:
                                        "flex",

                                    flexDirection:
                                        "column",

                                    justifyContent:
                                        "center",

                                    alignItems:
                                        "center",

                                    textAlign:
                                        "center",

                                    overflow:
                                        "hidden",
                                }}
                            >
                                <div
                                    style={{
                                        fontSize:
                                            "clamp(8px, 0.85vw, 13px)",

                                        opacity: 0.55,

                                        marginBottom:
                                            "8px",

                                        letterSpacing:
                                            "0.08em",
                                    }}
                                >
                                    STEP {page} /{" "}
                                    {
                                        recipeSteps.length
                                    }
                                </div>

                                <h2
                                    style={{
                                        margin: 0,

                                        fontSize:
                                            "clamp(13px, 1.3vw, 20px)",

                                        fontWeight: 600,

                                        lineHeight:
                                            1.25,
                                    }}
                                >
                                    {
                                        currentStep?.title
                                    }
                                </h2>
                            </div>

                            {/* RIGHT PAGE */}

                            <div
                                style={{
                                    width: "50%",
                                    height: "100%",

                                    padding:
                                        "4% 6%",

                                    boxSizing:
                                        "border-box",

                                    display:
                                        "flex",

                                    flexDirection:
                                        "column",

                                    justifyContent:
                                        "center",

                                    alignItems:
                                        "center",

                                    textAlign:
                                        "center",

                                    overflow:
                                        "hidden",
                                }}
                            >
                                <p
                                    style={{
                                        margin: 0,

                                        maxWidth:
                                            "90%",

                                        fontSize:
                                            "clamp(9px, 0.95vw, 14px)",

                                        lineHeight:
                                            1.5,
                                    }}
                                >
                                    {
                                        currentStep?.description
                                    }
                                </p>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
