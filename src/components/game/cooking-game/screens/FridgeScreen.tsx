"use client";

import { useState } from "react";

import fridgeInterior from "@/assets/media/mise-en-place/background/fridge-fried-rice.jpg";
import backButton from "@/assets/media/mise-en-place/buttons/back-button-1.png";

import greenOnionImage from "@/assets/media/mise-en-place/icons/green-onion.png";
import eggImage from "@/assets/media/mise-en-place/icons/egg.png";
import carrotImage from "@/assets/media/mise-en-place/icons/carrot.png";

/*
 * IMPORTANT:
 *
 * onion.png is actually the GARLIC illustration.
 *
 * We therefore import it as garlicImage.
 */
import garlicImage from "@/assets/media/mise-en-place/icons/onion.png";

import riceImage from "@/assets/media/mise-en-place/icons/rice.png";

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
    | "garlic"
    | "rice"
    | "soy_sauce"
    | "sauce"
    | "salt"
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
        ingredient: string
    ) => void;
}


/*
 * =========================================================
 * RECIPE REQUIREMENTS
 * =========================================================
 *
 * Only ingredients actually needed for this simplified
 * fried rice recipe are listed as required.
 *
 * Onion has deliberately been removed.
 */

const recipeRequirements: Record<
    IngredientId,
    number
> = {

    green_onion: 1,

    egg: 1,

    carrot: 1,

    garlic: 1,

    rice: 1,

    soy_sauce: 1,

    sauce: 0,

    salt: 0,

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

    green_onion:
        "Green Onion",

    egg:
        "Egg",

    carrot:
        "Carrot",

    garlic:
        "Garlic",

    rice:
        "Rice",

    soy_sauce:
        "Soy Sauce",

    sauce:
        "Sauce",

    salt:
        "Salt",

    cooking_oil:
        "Cooking Oil",
};


/*
 * =========================================================
 * INGREDIENT IMAGES
 * =========================================================
 *
 * NOTE:
 *
 * garlicImage points to onion.png because you explained
 * that onion.png is actually the garlic illustration.
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

    garlic:
        typeof garlicImage === "string"
            ? garlicImage
            : garlicImage.src,

    rice:
        typeof riceImage === "string"
            ? riceImage
            : riceImage.src,
};


/*
 * =========================================================
 * INVENTORY / CHECKLIST ORDER
 * =========================================================
 */

const inventoryOrder: IngredientId[] = [

    "garlic",

    "carrot",

    "green_onion",

    "egg",

    "rice",

    "soy_sauce",

    "sauce",

    "salt",

    "cooking_oil",
];


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
     */

    const [inventoryVisible, setInventoryVisible] =
        useState(true);


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
         * Ingredient isn't required by this recipe.
         */

        if (
            requiredQuantity <= 0
        ) {
            return;
        }


        /*
         * Don't allow more than one of each required
         * ingredient.
         */

        if (
            currentQuantity >=
            requiredQuantity
        ) {
            return;
        }


        onTakeIngredient(
            ingredient
        );

    };


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
                    typeof fridgeInterior === "string"
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
                RECIPE CHECKLIST
            ================================================= */}

            <div
                style={{
                    position: "absolute",

                    left: "2%",
                    top: "15%",

                    width: "250px",

                    zIndex: 90,

                    color:
                        "rgb(104, 67, 41)",

                    fontSize: "18px",

                    lineHeight: 1.8,
                }}
            >

                <div
                    style={{
                        fontSize: "20px",

                        fontWeight: 700,

                        marginBottom: "6px",
                    }}
                >
                    Fried Rice
                </div>


                {inventoryOrder
                    .filter(
                        (ingredient) =>
                            recipeRequirements[
                            ingredient
                            ] > 0
                    )
                    .map(
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
                                        {quantity}/{required}
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
                type="button"

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

                    border: "none",

                    outline: "none",

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
                type="button"

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

                    border: "none",

                    outline: "none",

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
                type="button"

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

                    border: "none",

                    outline: "none",

                    background:
                        "transparent",

                    cursor: "pointer",

                    zIndex: 50,
                }}
            />


            {/* =================================================
                GARLIC
            =================================================
            
                IMPORTANT:
                This is the old ONION hitbox.

                The illustration is actually GARLIC.
            ================================================= */}

            <button
                type="button"

                aria-label="Take garlic"

                onClick={() =>
                    takeIngredient(
                        "garlic"
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

                    border: "none",

                    outline: "none",

                    background:
                        "transparent",

                    cursor: "pointer",

                    zIndex: 50,
                }}
            />


            {/* =================================================
                RICE
            ================================================= */}

            <button
                type="button"

                aria-label="Take rice"

                onClick={() =>
                    takeIngredient(
                        "rice"
                    )
                }

                style={{
                    position:
                        "absolute",

                    left: "55%",
                    top: "52%",

                    width: "15%",
                    height: "15%",

                    padding: 0,

                    border: "none",

                    outline: "none",

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
                inventory={
                    inventory
                }

                allowIngredientClickRemoval={
                    true
                }

                onRemoveIngredient={
                    onRemoveIngredient
                }

                onIngredientDragStart={
                    () => { }
                }

                onIngredientDragEnd={
                    () => { }
                }
            />

        </div>
    );
}