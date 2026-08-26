"use client";

import { useState } from "react";

import fridgeInterior from "@/assets/media/mise-en-place/background/fridge-fried-rice.jpg";
import backButton from "@/assets/media/mise-en-place/buttons/back-button-1.png";

import greenOnionImage from "@/assets/media/mise-en-place/icons/green-onion.png";
import eggImage from "@/assets/media/mise-en-place/icons/egg.png";
import carrotImage from "@/assets/media/mise-en-place/icons/carrot.png";
import onionImage from "@/assets/media/mise-en-place/icons/onion.png";
import InventoryBar from "../components/InventoryBar";

/*
 * =========================================================
 * INGREDIENT TYPES
 * =========================================================
 */

export type IngredientId =
    | "green_onion"
    | "egg"
    | "carrot"
    | "onion"
    | "garlic"
    | "rice"
    | "soy_sauce"
    | "cooking_oil";

interface Inventory {
    [key: string]: number;
}

interface FridgeScreenProps {
    onBack: () => void;

    inventory: Inventory;

    onTakeIngredient: (
        ingredient: IngredientId
    ) => void;

    onRemoveIngredient: (
        ingredient: IngredientId
    ) => void;
}

/*
 * =========================================================
 * RECIPE REQUIREMENTS
 * =========================================================
 */

const recipeRequirements: Record<
    IngredientId,
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

/*
 * =========================================================
 * DISPLAY NAMES
 * =========================================================
 */

const ingredientNames: Record<
    IngredientId,
    string
> = {
    green_onion: "Green Onion",
    egg: "Egg",
    carrot: "Carrot",
    onion: "Onion",
    garlic: "Garlic",
    rice: "Rice",
    soy_sauce: "Soy Sauce",
    cooking_oil: "Cooking Oil",
};

/*
 * =========================================================
 * INGREDIENT IMAGES
 * =========================================================
 *
 * Add more images here later as you create them.
 */

const ingredientImages: Partial<
    Record<IngredientId, string>
> = {
    green_onion:
        typeof greenOnionImage === "string"
            ? greenOnionImage
            : greenOnionImage.src,

    egg:
        typeof eggImage === "string"
            ? eggImage
            : eggImage.src,

    carrot:
        typeof carrotImage === "string"
            ? carrotImage
            : carrotImage.src,

    onion:
        typeof onionImage === "string"
            ? onionImage
            : onionImage.src,
};

/*
 * =========================================================
 * INVENTORY ORDER
 * =========================================================
 *
 * This controls the order in which ingredients appear
 * inside the red inventory bar.
 */

const inventoryOrder: IngredientId[] = [
    "garlic",
    "carrot",
    "green_onion",
    "egg",
    "onion",
    "rice",
    "soy_sauce",
    "cooking_oil",
];

/*
 * =========================================================
 * COMPONENT
 * =========================================================
 */

export default function FridgeScreen({
    onBack,
    inventory,
    onTakeIngredient,
    onRemoveIngredient,
}: FridgeScreenProps) {

    /*
     * =====================================================
     * INVENTORY VISIBILITY
     * =====================================================
     *
     * true  = inventory is visible
     * false = inventory slides down
     */

    const [inventoryVisible, setInventoryVisible] =
        useState(true);

    /*
     * =====================================================
     * INVENTORY FLY-IN ANIMATIONS
     * =====================================================
     *
     * These are completely separate from the fridge.
     *
     * When an ingredient is taken:
     *
     * right side
     *      ↓
     * fades in
     *      ↓
     * moves left
     *      ↓
     * disappears
     *
     * The actual inventory item remains in the red bar.
     */

    const [inventoryAnimations, setInventoryAnimations] =
        useState<
            {
                id: number;
                ingredient: IngredientId;
            }[]
        >([]);

    /*
     * =====================================================
     * GET QUANTITY
     * =====================================================
     */

    const getQuantity = (
        ingredient: IngredientId
    ) => {
        return inventory[ingredient] ?? 0;
    };

    /*
     * =====================================================
     * PLAY INVENTORY FLY-IN
     * =====================================================
     */

    const playInventoryAnimation = (
        ingredient: IngredientId
    ) => {
        const id =
            Date.now() +
            Math.random();

        setInventoryAnimations(
            (current) => [
                ...current,
                {
                    id,
                    ingredient,
                },
            ]
        );

        window.setTimeout(() => {
            setInventoryAnimations(
                (current) =>
                    current.filter(
                        (animation) =>
                            animation.id !== id
                    )
            );
        }, 450);
    };

    /*
     * =====================================================
     * TAKE INGREDIENT
     * =====================================================
     */

    const takeIngredient = (
        ingredient: IngredientId
    ) => {

        const currentQuantity =
            getQuantity(ingredient);

        const requiredQuantity =
            recipeRequirements[
                ingredient
            ];

        /*
         * Don't allow more than the recipe requires.
         */

        if (
            currentQuantity >=
            requiredQuantity
        ) {
            return;
        }

        /*
         * Add to actual inventory.
         */

        onTakeIngredient(
            ingredient
        );

        /*
         * Play the visual inventory animation.
         */

        playInventoryAnimation(
            ingredient
        );
    };

    /*
     * =====================================================
     * RENDER
     * =====================================================
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
                FRIDGE INTERIOR
            ================================================= */}

            <img
                src={
                    typeof fridgeInterior ===
                        "string"
                        ? fridgeInterior
                        : fridgeInterior.src
                }

                alt="Fridge interior"

                draggable={false}

                style={{
                    position: "absolute",

                    inset: 0,

                    width: "100%",
                    height: "100%",

                    objectFit: "cover",

                    pointerEvents:
                        "none",
                }}
            />


            {/* =================================================
                BACK BUTTON
            ================================================= */}

            <button
                onClick={onBack}

                aria-label="Back"

                style={{
                    position: "absolute",

                    top: "18px",
                    left: "18px",

                    width: "64px",
                    height: "64px",

                    padding: 0,

                    border: 0,

                    background:
                        "transparent",

                    cursor: "pointer",

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
                RECIPE CHECKLIST
            ================================================= */}

            <div
                style={{
                    position: "absolute",

                    left: "2%",
                    top: "15%",

                    width: "240px",

                    padding: "12px",

                    borderRadius: "8px",

                    zIndex: 90,

                    color:
                        "rgb(104, 67, 41)",

                    fontSize: "18px",

                    lineHeight: 1.8,

                    boxSizing:
                        "border-box",
                }}
            >

                <div
                    style={{
                        fontSize: "20px",

                        fontWeight: 700,

                        marginBottom:
                            "4px",
                    }}
                >
                    Fried Rice
                </div>

                {inventoryOrder.map(
                    (ingredient) => {

                        const quantity =
                            getQuantity(
                                ingredient
                            );

                        const required =
                            recipeRequirements[
                                ingredient
                            ];

                        const complete =
                            quantity >=
                            required;

                        return (
                            <div
                                key={ingredient}

                                style={{
                                    display:
                                        "flex",

                                    alignItems:
                                        "center",

                                    justifyContent:
                                        "space-between",

                                    opacity:
                                        complete
                                            ? 0.55
                                            : 1,
                                }}
                            >

                                <span>
                                    {complete
                                        ? "✓"
                                        : "☐"}{" "}

                                    {
                                        ingredientNames[
                                            ingredient
                                        ]
                                    }
                                </span>

                                <span>
                                    {
                                        quantity
                                    }/
                                    {
                                        required
                                    }
                                </span>

                            </div>
                        );
                    }
                )}

            </div>


            {/* =================================================
                GREEN ONION
            ================================================= */}

            <button
                aria-label="Take green onion"

                onClick={() =>
                    takeIngredient(
                        "green_onion"
                    )
                }

                style={{
                    position:
                        "absolute",

                    left: "43%",
                    top: "15%",

                    width: "23%",
                    height: "18%",

                    padding: 0,

                    border:
                        "none",

                    background:
                        "transparent",

                    cursor: "pointer",

                    zIndex: 50,
                }}
            />


            {/* =================================================
                EGG
            ================================================= */}

            <button
                aria-label="Take egg"

                onClick={() =>
                    takeIngredient(
                        "egg"
                    )
                }

                style={{
                    position:
                        "absolute",

                    left: "41%",
                    top: "35%",

                    width: "12%",
                    height: "15%",

                    padding: 0,

                    border:
                        "none",

                    background:
                        "transparent",

                    cursor: "pointer",

                    zIndex: 50,
                }}
            />


            {/* =================================================
                CARROT
            ================================================= */}

            <button
                aria-label="Take carrot"

                onClick={() =>
                    takeIngredient(
                        "carrot"
                    )
                }

                style={{
                    position:
                        "absolute",

                    left: "54%",
                    top: "35%",

                    width: "14%",
                    height: "15%",

                    padding: 0,

                    border:
                        "none",

                    background:
                        "transparent",

                    cursor: "pointer",

                    zIndex: 50,
                }}
            />


            {/* =================================================
                ONION
            ================================================= */}

            <button
                aria-label="Take onion"

                onClick={() =>
                    takeIngredient(
                        "onion"
                    )
                }

                style={{
                    position:
                        "absolute",

                    left: "41%",
                    top: "52%",

                    width: "15%",
                    height: "15%",

                    padding: 0,

                    border:
                        "none",

                    background:
                        "transparent",

                    cursor: "pointer",

                    zIndex: 50,
                }}
            />


            
            {/* =================================================
                INVENTORY
            ================================================= */}

            <InventoryBar
                inventory={inventory}

                ingredientImages={
                    ingredientImages
                }

                onRemoveIngredient={
                    onRemoveIngredient
                }
            />
            </div>
    );
}