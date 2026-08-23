"use client";

import {
    useEffect,
    useState,
} from "react";

import kitchenBackground from "@/assets/media/mise-en-place/background/kitchen-default.jpg";
import homeButton from "@/assets/media/mise-en-place/buttons/back-button-1.png";

interface KitchenScreenProps {
    onHome: () => void;
}

export default function KitchenScreen({
    onHome,
}: KitchenScreenProps) {

    const [visible, setVisible] =
        useState(false);

    useEffect(() => {
        requestAnimationFrame(() => {
            setVisible(true);
        });
    }, []);

    return (
        <div
            style={{
                position: "absolute",
                inset: 0,

                overflow: "hidden",

                fontFamily:
                    "Comfortaa, sans-serif",

                background: "#000",

                opacity: visible ? 1 : 0,

                transform:
                    visible
                        ? "scale(1)"
                        : "scale(1.01)",

                transition:
                    "opacity 500ms ease, transform 500ms ease",
            }}
        >
            {/* =====================================================
                KITCHEN BACKGROUND
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

                    inset: 0,

                    width: "100%",
                    height: "100%",

                    objectFit: "cover",

                    pointerEvents: "none",
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
        </div>
    );
}