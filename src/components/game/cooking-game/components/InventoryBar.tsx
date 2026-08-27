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
import cutGarlicImage from "@/assets/media/mise-en-place/icons/cut-garlic.png";
import soySauceImage from "@/assets/media/mise-en-place/icons/soy-sauce.png";
import sauceImage from "@/assets/media/mise-en-place/icons/sauce.png";
import saltImage from "@/assets/media/mise-en-place/icons/salt.png";
import cookingOilImage from "@/assets/media/mise-en-place/icons/cooking-oil.png";
import riceImage from "@/assets/media/mise-en-place/icons/rice.png";

export type IngredientId =
    | "green_onion"
    | "egg"
    | "carrot"
    | "onion"
    | "garlic"
    | "rice"
    | "soy_sauce"
    | "sauce"
    | "salt"
    | "cooking_oil"
    | "cut_carrot"
    | "cut_green_onion"
    | "cut_garlic";

interface Inventory {
    [key: string]: number;
}

interface InventoryBarProps {
    inventory: Inventory;

    onRemoveIngredient: (
        ingredient: string
    ) => void;

    allowIngredientClickRemoval?: boolean;

    onIngredientDragStart?: (
        ingredient: string,
        event: React.DragEvent
    ) => void;

    onIngredientDragEnd?: () => void;
}

const ingredientNames: Record<
    IngredientId,
    string
> = {
    green_onion: "Green Onion",
    cut_green_onion: "Cut Green Onion",

    egg: "Egg",

    carrot: "Carrot",
    cut_carrot: "Cut Carrot",

    onion: "Onion",

    garlic: "Garlic",
    cut_garlic: "Cut Garlic",

    rice: "Rice",

    soy_sauce: "Soy Sauce",
    sauce: "Sauce",
    salt: "Salt",
    cooking_oil: "Cooking Oil",
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

    garlic:
        typeof onionImage === "string"
            ? onionImage
            : onionImage.src,

    cut_garlic:
        typeof cutGarlicImage === "string"
            ? cutGarlicImage
            : cutGarlicImage.src,

    cut_carrot:
        typeof cutCarrotImage === "string"
            ? cutCarrotImage
            : cutCarrotImage.src,

    cut_green_onion:
        typeof cutGreenOnionImage === "string"
            ? cutGreenOnionImage
            : cutGreenOnionImage.src,

    soy_sauce:
        typeof soySauceImage === "string"
            ? soySauceImage
            : soySauceImage.src,

    sauce:
        typeof sauceImage === "string"
            ? sauceImage
            : sauceImage.src,

    salt:
        typeof saltImage === "string"
            ? saltImage
            : saltImage.src,

    rice:
        typeof riceImage === "string"
            ? riceImage
            : riceImage.src,

    cooking_oil:
        typeof cookingOilImage === "string"
            ? cookingOilImage
            : cookingOilImage.src,
};

const inventoryOrder: IngredientId[] = [
    "green_onion",
    "cut_green_onion",

    "egg",

    "carrot",
    "cut_carrot",

    "garlic",
    "cut_garlic",
    "rice",

    "soy_sauce",
    "sauce",
    "salt",
    "cooking_oil",
];

const seasoningIngredients: IngredientId[] = [
    "soy_sauce",
    "sauce",
    "salt",
    "cooking_oil",
];

export default function InventoryBar({
    inventory,
    onRemoveIngredient,
    allowIngredientClickRemoval = false,
    onIngredientDragStart,
    onIngredientDragEnd,
}: InventoryBarProps) {

    /*
     * =========================================================
     * INVENTORY OPEN / CLOSE
     * =========================================================
     */

    const [
        inventoryVisible,
        setInventoryVisible,
    ] = useState(true);


    /*
     * =========================================================
     * PREVIOUS INVENTORY
     * =========================================================
     */

    const [
        previousInventory,
        setPreviousInventory,
    ] = useState<Inventory>(inventory);


    /*
     * =========================================================
     * FLY-IN ANIMATIONS
     * =========================================================
     */

    const [
        inventoryAnimations,
        setInventoryAnimations,
    ] = useState<
        {
            id: number;
            ingredient: IngredientId;
        }[]
    >([]);


    /*
     * =========================================================
     * SCROLL REFERENCES
     * =========================================================
     */

    const leftInventoryRef =
        useRef<HTMLDivElement>(null);

    const rightInventoryRef =
        useRef<HTMLDivElement>(null);


    /*
     * =========================================================
     * MOUSE DRAG SCROLL STATE
     * =========================================================
     */

    const dragScroll =
        useRef<{
            element: HTMLDivElement | null;
            startX: number;
            startScrollLeft: number;
            moved: boolean;
        } | null>(null);


    /*
     * =========================================================
     * DETECT NEW INGREDIENTS
     * =========================================================
     */

    useEffect(() => {

        inventoryOrder.forEach(
            (ingredient) => {

                const previous =
                    previousInventory[
                    ingredient
                    ] ?? 0;

                const current =
                    inventory[
                    ingredient
                    ] ?? 0;

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

                    window.setTimeout(() => {

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
            }
        );

        setPreviousInventory(inventory);

    }, [
        inventory,
        previousInventory,
    ]);


    /*
     * =========================================================
     * START DRAG-SCROLL
     * =========================================================
     */

    const handleInventoryMouseDown = (
        event: React.MouseEvent<HTMLDivElement>,
        element: HTMLDivElement | null
    ) => {

        if (!element) {
            return;
        }

        /*
         * Only react to the primary mouse button.
         */

        if (event.button !== 0) {
            return;
        }

        dragScroll.current = {
            element,
            startX: event.clientX,
            startScrollLeft:
                element.scrollLeft,
            moved: false,
        };

        element.style.cursor =
            "grabbing";

        element.style.userSelect =
            "none";
    };


    /*
     * =========================================================
     * DRAG-SCROLL MOVE
     * =========================================================
     */

    const handleInventoryMouseMove = (
        event: React.MouseEvent<HTMLDivElement>
    ) => {

        if (!dragScroll.current) {
            return;
        }

        const {
            element,
            startX,
            startScrollLeft,
        } = dragScroll.current;

        if (!element) {
            return;
        }

        const distance =
            event.clientX - startX;

        /*
         * Prevent tiny mouse movements from
         * counting as an actual drag.
         */

        if (Math.abs(distance) > 4) {
            dragScroll.current.moved = true;
        }

        element.scrollLeft =
            startScrollLeft - distance;
    };


    /*
     * =========================================================
     * END DRAG-SCROLL
     * =========================================================
     */

    const handleInventoryMouseUp = (
        event?: React.MouseEvent<HTMLDivElement>
    ) => {

        if (!dragScroll.current) {
            return;
        }

        const element =
            dragScroll.current.element;

        if (element) {

            element.style.cursor =
                "grab";

            element.style.userSelect =
                "";
        }

        dragScroll.current = null;
    };


    /*
     * =========================================================
     * MOUSE WHEEL
     * =========================================================
     *
     * Vertical wheel movement is converted
     * into horizontal scrolling.
     */

    const handleInventoryWheel = (
        event: React.WheelEvent<HTMLDivElement>
    ) => {

        const element =
            event.currentTarget;

        if (
            Math.abs(event.deltaY) >
            Math.abs(event.deltaX)
        ) {

            event.preventDefault();

            element.scrollLeft +=
                event.deltaY;
        }
    };


    /*
     * =========================================================
     * RENDER
     * =========================================================
     */

    return (
        <div
            style={{
                position: "absolute",

                left: 0,
                right: 0,
                bottom: 0,

                height: "90px",

                zIndex: 80,

                transform:
                    inventoryVisible
                        ? "translateY(0)"
                        : "translateY(calc(100% - 24px))",

                transition:
                    "transform 280ms cubic-bezier(0.22, 1, 0.36, 1)",

                pointerEvents: "auto",

                overflow: "visible",
            }}
        >

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

                    background: "#9C4242",

                    overflow: "visible",

                    display: "flex",

                    alignItems: "stretch",

                    boxSizing: "border-box",
                }}
            >

                {/* =================================================
                    LEFT 60% — INGREDIENTS
                ================================================= */}

                <div
                    ref={leftInventoryRef}

                    onMouseDown={(event) =>
                        handleInventoryMouseDown(
                            event,
                            leftInventoryRef.current
                        )
                    }

                    onMouseMove={
                        handleInventoryMouseMove
                    }

                    onMouseUp={
                        handleInventoryMouseUp
                    }

                    onMouseLeave={
                        handleInventoryMouseUp
                    }

                    onWheel={
                        handleInventoryWheel
                    }

                    style={{
                        width: "60%",

                        height: "120px",

                        marginTop: "-30px",

                        display: "flex",

                        alignItems: "flex-end",

                        gap: "4px",

                        padding:
                            "30px 8px 4px 16px",

                        boxSizing: "border-box",

                        overflowX: "auto",

                        overflowY: "visible",

                        scrollbarWidth: "none",

                        flexShrink: 0,

                        cursor: "grab",

                        WebkitOverflowScrolling:
                            "touch",
                    }}
                >

                    {inventoryOrder
                        .filter(
                            (ingredient) =>
                                !seasoningIngredients.includes(
                                    ingredient
                                ) &&
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


                                    allowClickRemoval={
                                        allowIngredientClickRemoval
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
                    RIGHT 40% — SEASONINGS
                ================================================= */}

                <div
                    ref={rightInventoryRef}

                    onMouseDown={(event) =>
                        handleInventoryMouseDown(
                            event,
                            rightInventoryRef.current
                        )
                    }

                    onMouseMove={
                        handleInventoryMouseMove
                    }

                    onMouseUp={
                        handleInventoryMouseUp
                    }

                    onMouseLeave={
                        handleInventoryMouseUp
                    }

                    onWheel={
                        handleInventoryWheel
                    }

                    style={{
                        width: "40%",

                        height: "120px",

                        marginTop: "-30px",

                        display: "flex",

                        alignItems: "flex-end",

                        gap: "4px",

                        padding:
                            "30px 70px 4px 8px",

                        boxSizing: "border-box",

                        overflowX: "auto",

                        overflowY: "visible",

                        scrollbarWidth: "none",

                        flexShrink: 0,

                        cursor: "grab",

                        borderLeft:
                            "1px solid rgba(255,255,255,0.15)",

                        WebkitOverflowScrolling:
                            "touch",
                    }}
                >

                    {seasoningIngredients.map(
                        (ingredient) => (
                            <InventoryItem
                                key={ingredient}

                                ingredient={
                                    ingredient
                                }

                                /*
                                 * Seasonings are
                                 * available by default.
                                 */

                                quantity={
                                    inventory[
                                    ingredient
                                    ] ?? 1
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

                                allowClickRemoval={
                                    allowIngredientClickRemoval
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
                                key={
                                    animation.id
                                }

                                src={image}

                                alt=""

                                draggable={false}

                                className={
                                    "inventory-fly-in"
                                }

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
                type="button"

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

                    top: "-20px",

                    width: "44px",

                    height: "44px",

                    borderRadius:
                        "50%",

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
                {inventoryVisible
                    ? "×"
                    : "↑"}
            </button>


            <style jsx>{`

                /*
                 * Hide scrollbars while keeping
                 * the areas horizontally scrollable.
                 */

                div::-webkit-scrollbar {
                    display: none;
                }

                /*
                 * New ingredient fly-in.
                 */

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
    allowClickRemoval,
    onDragStart,
    onDragEnd,
}: {
    ingredient: IngredientId;

    quantity: number;

    image?: string;

    onRemove: () => void;

    allowClickRemoval?: boolean;

    onDragStart?: (
        ingredient: string,
        event: React.DragEvent
    ) => void;

    onDragEnd?: () => void;
}) {

    /*
     * Only raw cutting ingredients are
     * draggable to the cutting board.
     */

    const canDrag =
        ingredient === "carrot" ||
        ingredient === "green_onion" ||
        ingredient === "garlic" ||
        ingredient === "cut_carrot" ||
        ingredient === "cut_green_onion" ||
        ingredient === "cut_garlic" ||
        ingredient === "rice" ||
        ingredient === "egg" ||
        ingredient === "cooking_oil" ||
        ingredient === "soy_sauce";

    const wasDragging =
        useRef(false);


    /*
     * =========================================================
     * DRAG START
     * =========================================================
     */

    const handleDragStart = (
        event: React.DragEvent
    ) => {

        if (!canDrag) {

            event.preventDefault();

            return;
        }

        wasDragging.current =
            true;

        event.dataTransfer.effectAllowed =
            "move";

        event.dataTransfer.setData(
            "application/x-cutting-board-ingredient",
            ingredient
        );

        onDragStart?.(
            ingredient,
            event
        );
    };


    /*
     * =========================================================
     * DRAG END
     * =========================================================
     */

    const handleDragEnd = () => {

        setTimeout(() => {

            wasDragging.current =
                false;

        }, 0);

        onDragEnd?.();
    };


    /*
     * =========================================================
     * CLICK
     * =========================================================
     */

    const handleClick = () => {

        if (wasDragging.current) {
            return;
        }

        if (!allowClickRemoval) {
            return;
        }

        onRemove();
    };


    /*
     * =========================================================
     * RENDER
     * =========================================================
     */

    return (
        <div
            role="button"

            tabIndex={0}

            draggable={canDrag}

            onDragStart={
                handleDragStart
            }

            onDragEnd={
                handleDragEnd
            }

            onClick={
                handleClick
            }

            onKeyDown={(event) => {

                if (
                    event.key ===
                    "Enter"
                ) {
                    handleClick();
                }

            }}

            aria-label={
                `Remove ${ingredientNames[
                ingredient
                ]
                }`
            }

            style={{
                position: "relative",

                width: "90px",

                height: "90px",

                flexShrink: 0,

                padding: 0,

                border: "none",

                background:
                    "transparent",

                cursor:
                    canDrag
                        ? "grab"
                        : "pointer",

                display: "flex",

                alignItems:
                    "flex-end",

                justifyContent:
                    "center",

                overflow:
                    "visible",

                outline: "none",

                userSelect: "none",
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

                        maxWidth:
                            "130px",

                        maxHeight:
                            "110px",

                        objectFit:
                            "contain",

                        pointerEvents:
                            "none",

                        transform:
                            "translateY(-5px)",
                    }}
                />

            ) : (

                <span
                    style={{
                        color: "#fff",

                        fontSize: "11px",

                        pointerEvents:
                            "none",
                    }}
                >
                    {
                        ingredientNames[
                        ingredient
                        ]
                    }
                </span>

            )}


            {/* =================================================
                QUANTITY
            ================================================= */}

            <div
                style={{
                    position:
                        "absolute",

                    right: "4px",

                    bottom: "2px",

                    width: "22px",

                    height: "22px",

                    borderRadius:
                        "50%",

                    background: "#fff",

                    color: "#9C4242",

                    display: "flex",

                    alignItems:
                        "center",

                    justifyContent:
                        "center",

                    fontSize: "11px",

                    fontWeight: 700,

                    zIndex: 5,

                    pointerEvents:
                        "none",
                }}
            >
                {quantity}
            </div>

        </div>
    );
}