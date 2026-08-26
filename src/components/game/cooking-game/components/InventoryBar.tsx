"use client";

import {
    useEffect,
    useRef,
    useState,
} from "react";

import greenOnionImage from "@/assets/media/mise-en-place/icons/green-onion.png";
import eggImage from "@/assets/media/mise-en-place/icons/egg.png";
import carrotImage from "@/assets/media/mise-en-place/icons/carrot.png";
import onionImage from "@/assets/media/mise-en-place/icons/onion.png";
import cutCarrotImage from "@/assets/media/mise-en-place/icons/cut-carrot.png";
import cutGreenOnionImage from "@/assets/media/mise-en-place/icons/cut-green-onion.png";

export type IngredientId =
    | "green_onion"
    | "egg"
    | "carrot"
    | "onion"
    | "garlic"
    | "rice"
    | "soy_sauce"
    | "cooking_oil"
    | "cut_carrot"
    | "cut_green_onion";

interface Inventory {
    [key: string]: number;
}

interface InventoryBarProps {
    inventory: Inventory;

    onRemoveIngredient: (
        ingredient: string
    ) => void;

    onIngredientDragStart?: (
        ingredient: string,
        event: React.DragEvent
    ) => void;

    onIngredientDragEnd?: () => void;
}

const ingredientNames: Record<IngredientId, string> = {
    green_onion: "Green Onion",
    egg: "Egg",
    carrot: "Carrot",
    onion: "Onion",
    garlic: "Garlic",
    rice: "Rice",
    soy_sauce: "Soy Sauce",
    cooking_oil: "Cooking Oil",

    cut_carrot: "Cut Carrot",
    cut_green_onion: "Cut Green Onion",
};

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

    cut_carrot:
        typeof cutCarrotImage === "string"
            ? cutCarrotImage
            : cutCarrotImage.src,

    cut_green_onion:
        typeof cutGreenOnionImage === "string"
            ? cutGreenOnionImage
            : cutGreenOnionImage.src,
};

const inventoryOrder: IngredientId[] = [
    "green_onion",
    "cut_green_onion",

    "egg",

    "carrot",
    "cut_carrot",

    "onion",
    "garlic",
    "rice",
    "soy_sauce",
    "cooking_oil",
];

export default function InventoryBar({
    inventory,
    onRemoveIngredient,
    onIngredientDragStart,
    onIngredientDragEnd,
}: InventoryBarProps) {

    const [inventoryVisible, setInventoryVisible] =
        useState(true);

    /*
     * =========================================================
     * REMEMBER WHICH INGREDIENTS EXISTED
     * =========================================================
     *
     * This lets us detect a newly-added ingredient and play
     * the fly-in animation.
     */

    const [previousInventory, setPreviousInventory] =
        useState<Inventory>(inventory);

    const [inventoryAnimations, setInventoryAnimations] =
        useState<
            {
                id: number;
                ingredient: IngredientId;
            }[]
        >([]);

    useEffect(() => {

        inventoryOrder.forEach((ingredient) => {

            const previous =
                previousInventory[ingredient] ?? 0;

            const current =
                inventory[ingredient] ?? 0;

            /*
             * New item added.
             */

            if (current > previous) {

                const animation = {
                    id:
                        Date.now() +
                        Math.random(),

                    ingredient,
                };

                setInventoryAnimations(
                    (existing) => [
                        ...existing,
                        animation,
                    ]
                );

                setTimeout(() => {
                    setInventoryAnimations(
                        (existing) =>
                            existing.filter(
                                (item) =>
                                    item.id !==
                                    animation.id
                            )
                    );
                }, 500);
            }
        });

        setPreviousInventory(inventory);

    }, [inventory, previousInventory]);


    return (
        <div
            style={{
                position: "absolute",

                left: 0,
                right: 0,
                bottom: 0,

                height: "90px",

                zIndex: 80,

                pointerEvents:
                    inventoryVisible
                        ? "auto"
                        : "none",

                transform:
                    inventoryVisible
                        ? "translateY(0)"
                        : "translateY(100%)",

                transition:
                    "transform 280ms cubic-bezier(0.22, 1, 0.36, 1)",
            }}
        >

            {/* =================================================
                RED INVENTORY BAR
            ================================================= */}

            <div
                style={{
                    position: "absolute",

                    inset: 0,

                    background: "#9C4242",

                    display: "flex",

                    alignItems: "flex-end",

                    gap: "4px",

                    padding:
                        "8px 70px 4px 16px",

                    boxSizing: "border-box",

                    overflow: "visible",
                }}
            >

                {inventoryOrder
                    .filter(
                        (ingredient) =>
                            (
                                inventory[
                                ingredient
                                ] ?? 0
                            ) > 0
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
                                    ] ?? 0
                                }

                                image={
                                    ingredientImages[
                                    ingredient
                                    ]
                                }

                                onRemove={() =>
                                    onRemoveIngredient(
                                        ingredient
                                    )
                                }

                                onDragStart={
                                    onIngredientDragStart
                                }

                                onDragEnd={
                                    onIngredientDragEnd
                                }
                            />
                        )
                    )}

            </div>


            {/* =================================================
                FLY-IN ANIMATION
            ================================================= */}

            <div
                style={{
                    position: "absolute",

                    left: 0,
                    right: 0,
                    bottom: 0,

                    height: "120px",

                    overflow: "visible",

                    pointerEvents: "none",

                    zIndex: 10,
                }}
            >

                {inventoryAnimations.map(
                    (animation) => {

                        const image =
                            ingredientImages[
                            animation.ingredient
                            ];

                        if (!image) {
                            return null;
                        }

                        return (
                            <img
                                key={animation.id}

                                src={image}

                                alt=""

                                draggable={false}

                                className="inventory-fly-in"

                                style={{
                                    position:
                                        "absolute",

                                    right:
                                        "-120px",

                                    bottom:
                                        "0px",

                                    width:
                                        "auto",

                                    height:
                                        "auto",

                                    maxWidth:
                                        "130px",

                                    maxHeight:
                                        "110px",

                                    objectFit:
                                        "contain",

                                    pointerEvents:
                                        "none",
                                }}
                            />
                        );
                    }
                )}

            </div>


            {/* =================================================
                CLOSE / OPEN BUTTON
            ================================================= */}

            <button
                aria-label={
                    inventoryVisible
                        ? "Hide inventory"
                        : "Show inventory"
                }

                onClick={() =>
                    setInventoryVisible(
                        (current) =>
                            !current
                    )
                }

                style={{
                    position:
                        "absolute",

                    right: "22px",

                    top: "-22px",

                    width: "44px",

                    height: "44px",

                    borderRadius: "50%",

                    border:
                        "2px solid rgba(255,255,255,0.8)",

                    background:
                        "#9C4242",

                    color: "#fff",

                    fontSize: "22px",

                    fontWeight: 700,

                    cursor: "pointer",

                    zIndex: 20,

                    display: "flex",

                    alignItems:
                        "center",

                    justifyContent:
                        "center",
                }}
            >
                ×
            </button>


            <style jsx>{`

                .inventory-fly-in {
                    animation:
                        inventoryFlyIn
                        450ms
                        cubic-bezier(
                            0.22,
                            1,
                            0.36,
                            1
                        )
                        forwards;
                }

                @keyframes inventoryFlyIn {

                    0% {
                        opacity: 0;

                        transform:
                            translateX(120px)
                            scale(0.85);
                    }

                    30% {
                        opacity: 1;
                    }

                    100% {
                        opacity: 1;

                        transform:
                            translateX(-420px)
                            scale(1);
                    }

                }

            `}</style>

        </div>
    );
}


/*
 * =========================================================
 * INVENTORY ITEM
 * =========================================================
 */

function InventoryItem({
    ingredient,
    quantity,
    image,
    onRemove,
    onDragStart,
    onDragEnd,
}: {
    ingredient: IngredientId;
    quantity: number;
    image?: string;
    onRemove: () => void;
    onDragStart?: (
        ingredient: string,
        event: React.DragEvent
    ) => void;
    onDragEnd?: () => void;
}) {
    const canDrag =
        ingredient === "carrot" ||
        ingredient === "green_onion";

    const wasDragging = useRef(false);

    const handleDragStart = (
        event: React.DragEvent
    ) => {
        if (!canDrag) {
            event.preventDefault();
            return;
        }

        wasDragging.current = true;

        event.dataTransfer.effectAllowed = "move";

        event.dataTransfer.setData(
            "application/x-cutting-board-ingredient",
            ingredient
        );

        onDragStart?.(
            ingredient,
            event
        );
    };

    const handleDragEnd = () => {
        setTimeout(() => {
            wasDragging.current = false;
        }, 0);

        onDragEnd?.();
    };

    const handleClick = () => {
        if (wasDragging.current) {
            return;
        }

        onRemove();
    };

    return (
        <button
            type="button"
            draggable={canDrag}
            onClick={handleClick}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            aria-label={
                `Remove ${ingredientNames[ingredient]
                }`
            }
            style={{
                position: "relative",

                width: "90px",
                height: "90px",

                flexShrink: 0,

                padding: 0,

                border: "none",

                background: "transparent",

                cursor:
                    canDrag
                        ? "grab"
                        : "pointer",

                display: "flex",

                alignItems: "flex-end",

                justifyContent: "center",

                overflow: "visible",
            }}
        >
            {image ? (
                <img
                    src={image}
                    alt={
                        ingredientNames[
                        ingredient
                        ]
                    }
                    draggable={false}
                    style={{
                        width: "auto",
                        height: "auto",

                        maxWidth: "130px",
                        maxHeight: "110px",

                        objectFit: "contain",

                        pointerEvents: "none",

                        transform:
                            "translateY(-5px)",
                    }}
                />
            ) : (
                <span
                    style={{
                        color: "#fff",
                        fontSize: "11px",
                    }}
                >
                    {
                        ingredientNames[
                        ingredient
                        ]
                    }
                </span>
            )}

            <div
                style={{
                    position: "absolute",

                    right: "4px",
                    bottom: "2px",

                    width: "22px",
                    height: "22px",

                    borderRadius: "50%",

                    background: "#fff",

                    color: "#9C4242",

                    display: "flex",

                    alignItems: "center",
                    justifyContent: "center",

                    fontSize: "11px",
                    fontWeight: 700,

                    zIndex: 5,

                    pointerEvents: "none",
                }}
            >
                {quantity}
            </div>
        </button>
    );
}