"use client";

import { useState, useEffect, useRef } from "react";

import sinkBackground from "@/assets/media/mise-en-place/background/sink.jpg";
import sinkOnBackground from "@/assets/media/mise-en-place/background/sink-on.jpg";

import backButton from "@/assets/media/mise-en-place/buttons/back-button-1.png";

import InventoryBar from "../components/InventoryBar";

interface SinkScreenProps {
    onBack: () => void;

    inventory: Record<string, number>;

    onRemoveIngredient: (
        ingredient: string
    ) => void;
}

export default function SinkScreen({
    onBack,
    inventory,
    onRemoveIngredient,
}: SinkScreenProps) {

    const [sinkIsOn, setSinkIsOn] =
        useState(false);

    const audioRef = useRef<HTMLAudioElement | null>(null);

    /*
     * =========================================================
     * SINK AUDIO CONTROL (PUBLIC FOLDER)
     * =========================================================
     */
    useEffect(() => {
        if (sinkIsOn) {
            const audio = new Audio("/audio/sink-running.wav");
            audio.loop = true;
            audio.currentTime = 0;
            audio.play().catch(() => {});
            audioRef.current = audio;
        } else if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
            audioRef.current = null;
        }

        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current.currentTime = 0;
                audioRef.current = null;
            }
        };
    }, [sinkIsOn]);

    const currentBackground =
        sinkIsOn
            ? sinkOnBackground
            : sinkBackground;

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
                SINK BACKGROUND
            ================================================= */}

            <img
                src={
                    typeof currentBackground === "string"
                        ? currentBackground
                        : currentBackground.src
                }
                alt="Sink"
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
                aria-label="Back to kitchen"
                onClick={onBack}
                style={{
                    position: "absolute",
                    top: "18px",
                    left: "18px",

                    width: "64px",
                    height: "64px",

                    padding: 0,
                    border: "none",
                    background: "transparent",

                    cursor: "pointer",
                    zIndex: 100,
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

            {/* =================================================
                FAUCET HITBOX
            =================================================
            
                TEMPORARY:
                Keep this visible so you can map it.
            */}

            <button
                aria-label="Faucet"
                onClick={() => {
                    setSinkIsOn(
                        current => !current
                    );
                }}
                style={{
                    position: "absolute",

                    /*
                     * MOVE THESE UNTIL THEY
                     * PERFECTLY COVER YOUR FAUCET.
                     */

                    left: "66%",
                    top: "20%",

                    width: "10%",
                    height: "25%",

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
                onRemoveIngredient={
                    onRemoveIngredient
                }
            />

        </div>
    );
}