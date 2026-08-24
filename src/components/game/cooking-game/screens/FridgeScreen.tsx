"use client";

import { useState } from "react";

import fridgeInterior from "@/assets/media/mise-en-place/background/fridge-fried-rice.jpg";
import backButton from "@/assets/media/mise-en-place/buttons/back-button-1.png";

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
}

/*
 * =========================================================
 * RECIPE REQUIREMENTS
 * =========================================================
 *
 * These are the maximum quantities the player can take
 * for the current Fried Rice recipe.
 *
 * Change these later when the recipe is finalized.
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

export default function FridgeScreen({
    onBack,
    inventory,
    onTakeIngredient,
}: FridgeScreenProps) {

    /*
     * =====================================================
     * CHECKLIST
     * =====================================================
     *
     * This is temporary UI state.
     *
     * The actual quantity comes from inventory.
     */

    const getQuantity = (
        ingredient: IngredientId
    ) => {
        return inventory[ingredient] ?? 0;
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
            recipeRequirements[ingredient];

        /*
         * Don't allow the player to take more
         * than the recipe requires.
         */

        if (
            currentQuantity >=
            requiredQuantity
        ) {
            return;
        }

        onTakeIngredient(ingredient);
    };

    /*
     * =====================================================
     * INGREDIENT CLICK ZONES
     * =====================================================
     *
     * These are deliberately visible for mapping.
     *
     * Once aligned:
     *
     * background: "transparent"
     * border: "none"
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

                    pointerEvents: "none",
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

                        objectFit: "contain",

                        pointerEvents:
                            "none",
                    }}
                />
            </button>


            {/* =================================================
                RECIPE CHECKLIST
            =================================================
            
            Move this entire block later if you want
            the checklist somewhere else.
            */}

            <div
                style={{
                    position: "absolute",

                    left: "2%",
                    top: "15%",

                    width: "240px",

                    padding: "12px",

                    borderRadius: "8px",

                    zIndex: 90,

                    color: "rgb(104, 67, 41)",

                    fontSize: "18px",

                    lineHeight: 1.8,

                    boxSizing: "border-box",
                }}
            >

                <div
                    style={{
                        fontSize: "20px",
                        fontWeight: 700,
                        marginBottom: "4px",
                    }}
                >
                    Fried Rice
                </div>

                {(
                    [
                        "garlic",
                        "carrot",
                        "green_onion",
                        "egg",
                        "onion",
                        "rice",
                        "soy_sauce",
                        "cooking_oil",
                    ] as IngredientId[]
                ).map((ingredient) => {

                    const quantity =
                        getQuantity(
                            ingredient
                        );

                    const required =
                        recipeRequirements[
                        ingredient
                        ];

                    const complete =
                        quantity >= required;

                    return (
                        <div
                            key={ingredient}
                            style={{
                                display: "flex",
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
                                {quantity}/{required}
                            </span>
                        </div>
                    );
                })}
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
                    position: "absolute",

                    /*
                     * MAP THIS
                     */

                    left: "43%",
                    top: "15%",

                    width: "23%",
                    height: "18%",

                    padding: 0,

                    border:
                        "2px solid white",

                    background:
                        "rgba(0, 220, 100, 0.25)",

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
                    position: "absolute",

                    /*
                     * MAP THIS
                     */

                    left: "41%",
                    top: "35%",

                    width: "12%",
                    height: "15%",

                    padding: 0,

                    border:
                        "2px solid white",

                    background:
                        "rgba(255, 255, 0, 0.25)",

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
                    position: "absolute",

                    /*
                     * MAP THIS
                     */

                    left: "54%",
                    top: "35%",

                    width: "14%",
                    height: "15%",

                    padding: 0,

                    border:
                        "2px solid white",

                    background:
                        "rgba(255, 120, 0, 0.25)",

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
                    position: "absolute",

                    /*
                     * MAP THIS
                     */

                    left: "41%",
                    top: "52%",

                    width: "15%",
                    height: "15%",

                    padding: 0,

                    border:
                        "2px solid white",

                    background:
                        "rgba(180, 100, 255, 0.25)",

                    cursor: "pointer",

                    zIndex: 50,
                }}
            />


            {/* =================================================
                INVENTORY BAR
            ================================================= */}

            <div
                style={{
                    position: "absolute",

                    left: 0,
                    right: 0,
                    bottom: 0,

                    height: "90px",

                    background:
                        "#9C4242",

                    zIndex: 80,

                    display: "flex",

                    alignItems: "center",

                    gap: "10px",

                    padding:
                        "8px 16px",

                    boxSizing:
                        "border-box",

                    overflowX:
                        "auto",
                }}
            >

                {(
                    Object.keys(
                        inventory
                    ) as IngredientId[]
                )
                    .filter(
                        (ingredient) =>
                            inventory[
                            ingredient
                            ] > 0
                    )
                    .map(
                        (ingredient) => (
                            <InventoryItem
                                key={ingredient}
                                ingredient={
                                    ingredient
                                }
                                quantity={
                                    inventory[
                                    ingredient
                                    ]
                                }
                            />
                        )
                    )}

            </div>

        </div>
    );
}


/*
 * =========================================================
 * INVENTORY ITEM
 * =========================================================
 *
 * For now this is a placeholder.
 *
 * Later we'll replace the text with:
 *
 * carrot.png
 * egg.png
 * garlic.png
 *
 * etc.
 */

function InventoryItem({
    ingredient,
    quantity,
}: {
    ingredient: IngredientId;
    quantity: number;
}) {
    return (
        <div
            style={{
                position: "relative",

                width: "65px",
                height: "65px",

                flexShrink: 0,

                background:
                    "rgba(255,255,255,0.15)",

                borderRadius: "8px",

                border:
                    "1px solid rgba(255,255,255,0.25)",

                display: "flex",

                alignItems: "center",

                justifyContent: "center",

                color: "#fff",

                fontSize: "9px",

                textAlign: "center",

                padding: "4px",

                boxSizing: "border-box",
            }}
        >

            {ingredient
                .replace("_", " ")}

            {/* Quantity circle */}

            <div
                style={{
                    position: "absolute",

                    right: "-3px",
                    bottom: "-3px",

                    width: "20px",
                    height: "20px",

                    borderRadius: "50%",

                    background:
                        "#ffffff",

                    color: "#9C4242",

                    display: "flex",

                    alignItems: "center",

                    justifyContent:
                        "center",

                    fontSize: "10px",

                    fontWeight: 700,
                }}
            >
                {quantity}
            </div>

        </div>
    );
}