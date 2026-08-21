"use client";

import menuBook from "@/assets/media/mise-en-place/background/menu.png";
import backButton from "@/assets/media/mise-en-place/buttons/back-button-1.png";

interface RecipeMenuScreenProps {
    onBack: () => void;
}

export default function RecipeMenuScreen({
    onBack,
}: RecipeMenuScreenProps) {
    return (
        <div
            style={{
                width: "100%",
                height: "100%",

                position: "relative",

                overflow: "hidden",

                fontFamily: "Comfortaa, sans-serif",
            }}
        >
            {/* =====================================================
          MENU BOOK BACKGROUND
      ====================================================== */}

            <img
                src={
                    typeof menuBook === "string"
                        ? menuBook
                        : menuBook.src
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
          BACK BUTTON
      ====================================================== */}

            <button
                onClick={onBack}
                aria-label="Back"
                style={{
                    position: "absolute",

                    top: "20px",
                    left: "20px",

                    width: "70px",
                    height: "70px",

                    padding: 0,

                    border: 0,

                    background: "transparent",

                    cursor: "pointer",

                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",

                    transition:
                        "transform 120ms ease",

                    zIndex: 10,
                }}
                onMouseEnter={(event) => {
                    event.currentTarget.style.transform =
                        "scale(1.08)";
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

                        objectFit: "contain",

                        pointerEvents: "none",
                    }}
                />
            </button>

            {/* =====================================================
          FRIED RICE
      ====================================================== */}

            <div
                style={{
                    position: "absolute",

                    /*
                     * CHANGE THESE TWO VALUES
                     *
                     * left = moves recipe left/right
                     * top  = moves recipe up/down
                     */
                    left: "7%",
                    top: "20%",

                    width: "35%",

                    textAlign: "left",

                    fontFamily: "Comfortaa, sans-serif",
                }}
            >
                {/* Recipe title */}

                <div
                    style={{
                        fontSize: "25px",

                        fontWeight: 700,

                        marginBottom: "8px",

                        color: "#222",
                    }}
                >
                    Fried Rice
                </div>

                {/* Ingredients */}

                <div
                    style={{
                        fontSize: "12px",

                        fontWeight: 400,

                        lineHeight: 1.7,

                        color: "#333",
                    }}
                >
                    <div>• Rice</div>
                    <div>• Egg</div>
                    <div>• Carrot</div>
                    <div>• Green onion</div>
                    <div>• Soy sauce</div>
                    <div>• Garlic</div>
                    <div>• Cooking oil</div>
                </div>
            </div>

            {/* =====================================================
          FRIED RICE DIFFICULTY + IMAGE
      ====================================================== */}

            <div
                style={{
                    position: "absolute",

                    /*
                     * CHANGE THESE TO MOVE THE
                     * DIFFICULTY + IMAGE GROUP
                     */
                    left: "25%",
                    top: "25%",

                    display: "flex",

                    alignItems: "center",

                    gap: "12px",

                    fontFamily: "Comfortaa, sans-serif",
                }}
            >
                {/* Difficulty */}

                <div
                    style={{
                        fontSize: "13px",
                        fontWeight: 700,
                        color: "#d4a72c",
                        whiteSpace: "nowrap",
                    }}
                >
                    Medium
                </div>

                {/* Recipe image */}

                <div
                    style={{
                        width: "105px",
                        height: "105px",

                        borderRadius: "6px",

                        overflow: "hidden",

                        /*
                         * Temporary placeholder.
                         * Replace this with the actual
                         * recipe image when you have it.
                         */
                        background: "#ddd",

                        display: "flex",

                        alignItems: "center",

                        justifyContent: "center",

                        fontSize: "11px",

                        color: "#777",
                    }}
                >
                    Image
                </div>
            </div>

            {/* =====================================================
          BLACK TEA
      ====================================================== */}

            <div
                style={{
                    position: "absolute",

                    /*
                     * CHANGE THESE VALUES TO MOVE
                     * THE SECOND RECIPE.
                     */
                    left: "7%",
                    top: "58%",

                    width: "35%",

                    textAlign: "left",

                    fontFamily: "Comfortaa, sans-serif",
                }}
            >
                {/* Recipe title */}

                <div
                    style={{
                        fontSize: "25px",

                        fontWeight: 700,

                        marginBottom: "8px",

                        color: "#222",
                    }}
                >
                    Black Tea
                </div>

                {/* Ingredients */}

                <div
                    style={{
                        fontSize: "13px",

                        fontWeight: 400,

                        lineHeight: 1.7,

                        color: "#333",
                    }}
                >
                    <div>• Black tea leaves</div>
                    <div>• Water</div>
                    <div>• Sugar</div>
                    <div>• Milk</div>
                </div>
            </div>

            {/* =====================================================
          BLACK TEA DIFFICULTY + IMAGE
      ====================================================== */}

            <div
                style={{
                    position: "absolute",

                    left: "25%",
                    top: "58%",

                    display: "flex",

                    alignItems: "center",

                    gap: "12px",

                    fontFamily: "Comfortaa, sans-serif",
                }}
            >
                {/* Difficulty */}

                <div
                    style={{
                        fontSize: "13px",
                        fontWeight: 700,
                        color: "#4f9d69",
                        whiteSpace: "nowrap",
                    }}
                >
                    Easy
                </div>

                {/* Recipe image */}

                <div
                    style={{
                        width: "105px",
                        height: "105px",

                        borderRadius: "6px",

                        overflow: "hidden",

                        background: "#ddd",

                        display: "flex",

                        alignItems: "center",

                        justifyContent: "center",

                        fontSize: "11px",

                        color: "#777",
                    }}
                >
                    Image
                </div>
            </div>

            {/* =====================================================
          RIGHT PAGE — COMING SOON
      ====================================================== */}

            <div
                style={{
                    position: "absolute",

                    /*
                     * CHANGE THESE TO POSITION
                     * "COMING SOON" ON THE RIGHT PAGE.
                     */
                    right: "14%",
                    top: "45%",

                    width: "30%",

                    textAlign: "center",

                    fontSize: "22px",

                    fontWeight: 500,

                    color: "#555",

                    fontFamily: "Comfortaa, sans-serif",
                }}
            >
                Coming Soon...
            </div>
        </div>
    );
}