"use client";

import {
    useState,
} from "react";

import kitchenBackground from "@/assets/media/mise-en-place/background/kitchen-default.jpg";
import homeButton from "@/assets/media/mise-en-place/buttons/home-button.png";

// Change these two imports to whatever your actual filenames are.
import leftButton from "@/assets/media/mise-en-place/buttons/left-arrow-button.png";
import rightButton from "@/assets/media/mise-en-place/buttons/right-arrow-button.png";

interface KitchenScreenProps {
    onHome: () => void;
}

export default function KitchenScreen({
    onHome,
}: KitchenScreenProps) {

    /*
     * =========================================================
     * KITCHEN PANORAMA POSITION
     * =========================================================
     *
     * 0   = far left
     * 50  = center
     * 100 = far right
     *
     * Change this initial value if you want the kitchen to
     * start looking more toward one side.
     */

    const [panoramaPosition, setPanoramaPosition] =
        useState(50);

    /*
     * =========================================================
     * MOVE KITCHEN LEFT
     * =========================================================
     */

    const moveLeft = () => {
        setPanoramaPosition((current) =>
            Math.max(
                0,
                current - 25
            )
        );
    };

    /*
     * =========================================================
     * MOVE KITCHEN RIGHT
     * =========================================================
     */

    const moveRight = () => {
        setPanoramaPosition((current) =>
            Math.min(
                100,
                current + 25
            )
        );
    };

    return (
        <div
            style={{
                position: "absolute",
                inset: 0,

                overflow: "hidden",

                fontFamily:
                    "Comfortaa, sans-serif",

                background: "#000",
            }}
        >

            {/* =====================================================
                KITCHEN PANORAMA
            ===================================================== */}

            <img
                src={
                    typeof kitchenBackground ===
                        "string"
                        ? kitchenBackground
                        : kitchenBackground.src
                }
                alt=""
                draggable={false}
                style={{
                    position: "absolute",

                    top: 0,
                    left: 0,

                    width: "100%",
                    height: "100%",

                    objectFit: "cover",

                    objectPosition:
                        `${panoramaPosition}% center`,

                    pointerEvents: "none",

                    transition:
                        "object-position 600ms ease",
                }}
            />

            {/* =====================================================
                HOME BUTTON
            ===================================================== */}

            <button
                onClick={onHome}
                aria-label="Home"
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

                    zIndex: 20,

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
                        typeof homeButton ===
                            "string"
                            ? homeButton
                            : homeButton.src
                    }
                    alt="Home"
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


            {/* =====================================================
                LEFT PANORAMA BUTTON
            ===================================================== */}

            <button
                onClick={moveLeft}
                aria-label="Look left"
                style={{
                    position: "absolute",

                    left: "18px",
                    top: "50%",

                    transform:
                        "translateY(-50%)",

                    width: "64px",
                    height: "64px",

                    padding: 0,

                    border: 0,

                    background:
                        "transparent",

                    cursor: panoramaPosition <= 0
                        ? "default"
                        : "pointer",

                    zIndex: 20,

                    opacity:
                        panoramaPosition <= 0
                            ? 0.35
                            : 1,

                    transition:
                        "transform 140ms ease, opacity 140ms ease",
                }}
                onMouseEnter={(event) => {
                    if (panoramaPosition > 0) {
                        event.currentTarget.style.transform =
                            "translateY(-50%) scale(1.043)";
                    }
                }}
                onMouseLeave={(event) => {
                    event.currentTarget.style.transform =
                        "translateY(-50%) scale(1)";
                }}
            >
                <img
                    src={
                        typeof leftButton ===
                            "string"
                            ? leftButton
                            : leftButton.src
                    }
                    alt="Look left"
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


            {/* =====================================================
                RIGHT PANORAMA BUTTON
            ===================================================== */}

            <button
                onClick={moveRight}
                aria-label="Look right"
                style={{
                    position: "absolute",

                    right: "18px",
                    top: "50%",

                    transform:
                        "translateY(-50%)",

                    width: "64px",
                    height: "64px",

                    padding: 0,

                    border: 0,

                    background:
                        "transparent",

                    cursor: panoramaPosition >= 100
                        ? "default"
                        : "pointer",

                    zIndex: 20,

                    opacity:
                        panoramaPosition >= 100
                            ? 0.35
                            : 1,

                    transition:
                        "transform 140ms ease, opacity 140ms ease",
                }}
                onMouseEnter={(event) => {
                    if (panoramaPosition < 100) {
                        event.currentTarget.style.transform =
                            "translateY(-50%) scale(1.043)";
                    }
                }}
                onMouseLeave={(event) => {
                    event.currentTarget.style.transform =
                        "translateY(-50%) scale(1)";
                }}
            >
                <img
                    src={
                        typeof rightButton ===
                            "string"
                            ? rightButton
                            : rightButton.src
                    }
                    alt="Look right"
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
            {/* =====================================================
    INVENTORY BAR
===================================================== */}

            <div
                style={{
                    position: "absolute",

                    left: 0,
                    right: 0,
                    bottom: 0,

                    /*
                     * CHANGE THIS VALUE
                     *
                     * Controls the height of the inventory bar.
                     */
                    height: "90px",

                    background: "#9C4242",

                    /*
                     * Only the top border is visible.
                     * The other three sides are technically
                     * against the screen edges.
                     */
                    borderTop:
                        "4px solid #ffffff",

                    zIndex: 30,

                    boxSizing: "border-box",
                }}
            >
                {/* Inventory items will go here later */}
            </div>
        </div>
    );
}