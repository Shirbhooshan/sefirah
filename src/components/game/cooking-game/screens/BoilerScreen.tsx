"use client";

import boilerInner from "@/assets/media/mise-en-place/background/boiler.jpg";
import boilerInnerOn from "@/assets/media/mise-en-place/background/boiler-on.jpg";
import backButton from "@/assets/media/mise-en-place/buttons/back-button-1.png";

interface BoilerScreenProps {
    boilerOn: boolean;
    onBack: () => void;
}

export default function BoilerScreen({
    boilerOn,
    onBack,
}: BoilerScreenProps) {

    const currentImage =
        boilerOn
            ? boilerInnerOn
            : boilerInner;

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
                BOILER INTERIOR
            ================================================= */}

            <img
                src={
                    typeof currentImage === "string"
                        ? currentImage
                        : currentImage.src
                }
                alt="Boiler interior"
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
                aria-label="Back to kitchen"
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

        </div>
    );
}