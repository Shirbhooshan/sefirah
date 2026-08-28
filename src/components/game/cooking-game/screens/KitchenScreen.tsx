"use client";

import { useState } from "react";

import kitchenBackground from "@/assets/media/mise-en-place/background/kitchen-default-2.jpg";
import homeButton from "@/assets/media/mise-en-place/buttons/home-button.png";

/*
 * =========================================================
 * KITCHEN STATE IMAGES
 * =========================================================
 */

import fridgeClosed from "@/assets/media/mise-en-place/background/kitchen-default-2.jpg";

import fridgeOpen from "@/assets/media/mise-en-place/background/kitchen-default-fridge-open.jpg";
import fridgeOpenBoiler from "@/assets/media/mise-en-place/background/kitchen-default-boiler-and-fridge-open.jpg";
import fridgeOpenPan from "@/assets/media/mise-en-place/background/kitchen-default-pan-and-fridge-open.jpg";
import fridgeOpenBoilerPan from "@/assets/media/mise-en-place/background/kitchen-default-boiler-and-pan-and-fridge-open.jpg";

import boilerOnImage from "@/assets/media/mise-en-place/background/kitchen-default-boiler.jpg";
import panOnImage from "@/assets/media/mise-en-place/background/kitchen-default-pan.jpg";
import boilerPanOn from "@/assets/media/mise-en-place/background/kitchen-default-boiler-and-pan.jpg";

import tableEmpty from "@/assets/media/mise-en-place/background/plate-empty.jpg";
import tableFriedRice from "@/assets/media/mise-en-place/background/plate-fried-rice.jpg";

interface KitchenScreenProps {
    onHome: () => void;

    onFridge?: () => void;
    onPan?: () => void;
    onBoiler?: () => void;

    onCuttingBoard?: () => void;
    onSink?: () => void;
    onPlate: () => void;

    boilerOn: boolean;
    panOn: boolean;

    onToggleBoiler: () => void;
    onTogglePan: () => void;
}


export default function KitchenScreen({
    onHome,
    onFridge,
    onPan,
    onBoiler,

    onCuttingBoard,
    onSink,
    onPlate,

    boilerOn,
    panOn,

    onToggleBoiler,
    onTogglePan,
}: KitchenScreenProps) {

    /*
     * =========================================================
     * FRIDGE STATE
     * =========================================================
     */

    const [fridgeIsOpen, setFridgeIsOpen] =
        useState(false);


    /*
     * =========================================================
     * PLAY SOUND
     * =========================================================
     */

    const playSound = (src: string) => {
        const audio = new Audio(src);

        audio.currentTime = 0;

        audio.play().catch(() => { });
    };


    /*
     * =========================================================
     * FRIDGE
     * =========================================================
     */

    const openFridge = () => {

        if (fridgeIsOpen) {
            return;
        }

        playSound("/audio/fridge-open.wav");

        setFridgeIsOpen(true);
    };


    const closeFridge = () => {

        if (!fridgeIsOpen) {
            return;
        }

        /*
         * KEEPING YOUR ORIGINAL CLOSE SOUND
         */

        playSound("/audio/fridge-close.wav");

        setFridgeIsOpen(false);
    };


    const enterFridge = () => {

        if (onFridge) {
            onFridge();
        } else {
            console.log(
                "FRIDGE SCREEN NOT CONNECTED YET"
            );
        }
    };


    /*
     * =========================================================
     * STOVE KNOBS
     * =========================================================
     *
     * KitchenScreen remains responsible for these.
     *
     * Clicking the knob changes the kitchen artwork.
     */

    const toggleBoiler = () => {

        playSound("/audio/stove-knob.wav");

        onToggleBoiler();
    };


    const togglePan = () => {

        playSound("/audio/stove-knob.wav");

        onTogglePan();
    };


    /*
     * =========================================================
     * BOILER SCREEN
     * =========================================================
     */

    const openBoilerScreen = () => {

        if (onBoiler) {
            onBoiler();
        } else {
            console.log(
                "BOILER SCREEN NOT CONNECTED YET"
            );
        }
    };

    /*
     * =========================================================
     * PAN SCREEN
     * =========================================================
     */

    const openPanScreen = () => {

        if (onPan) {
            onPan();
        } else {
            console.log(
                "PAN SCREEN NOT CONNECTED YET"
            );
        }
    };


    /*
     * =========================================================
     * CUTTING BOARD
     * =========================================================
     */

    const handleCuttingBoard = () => {

        if (onCuttingBoard) {
            onCuttingBoard();
        } else {
            console.log(
                "CUTTING BOARD SCREEN NOT CONNECTED YET"
            );
        }
    };


    /*
     * =========================================================
     * SINK
     * =========================================================
     */

    const handleSink = () => {

        if (onSink) {
            onSink();
        } else {
            console.log(
                "SINK SCREEN NOT CONNECTED YET"
            );
        }
    };


    /*
     * =========================================================
     * DETERMINE KITCHEN IMAGE
     * =========================================================
     *
     * IMPORTANT:
     * Keep these exact combinations.
     */

    const getKitchenImage = () => {

        /*
         * FRIDGE + BOILER + PAN
         */

        if (
            fridgeIsOpen &&
            boilerOn &&
            panOn
        ) {
            return fridgeOpenBoilerPan;
        }


        /*
         * FRIDGE + BOILER
         */

        if (
            fridgeIsOpen &&
            boilerOn
        ) {
            return fridgeOpenBoiler;
        }


        /*
         * FRIDGE + PAN
         */

        if (
            fridgeIsOpen &&
            panOn
        ) {
            return fridgeOpenPan;
        }


        /*
         * BOILER + PAN
         */

        if (
            boilerOn &&
            panOn
        ) {
            return boilerPanOn;
        }


        /*
         * ONLY FRIDGE
         */

        if (fridgeIsOpen) {
            return fridgeOpen;
        }


        /*
         * ONLY BOILER
         */

        if (boilerOn) {
            return boilerOnImage;
        }


        /*
         * ONLY PAN
         */

        if (panOn) {
            return panOnImage;
        }


        /*
         * DEFAULT
         */

        return fridgeClosed;
    };


    const currentKitchenImage =
        getKitchenImage();


    /*
     * =========================================================
     * DEBUG
     * =========================================================
     */

    const currentState =
        `Fridge: ${fridgeIsOpen ? "OPEN" : "CLOSED"}
Boiler: ${boilerOn ? "ON" : "OFF"}
Pan: ${panOn ? "ON" : "OFF"}`;


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
                KITCHEN ARTWORK
            ====================================================== */}

            <img
                src={
                    typeof currentKitchenImage === "string"
                        ? currentKitchenImage
                        : currentKitchenImage.src
                }
                alt="Kitchen"
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
            ====================================================== */}

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

                    border: "none",

                    background: "transparent",

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
                        typeof homeButton === "string"
                            ? homeButton
                            : homeButton.src
                    }
                    alt="Home"
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
                DEBUG
            ====================================================== */}

            <div
                style={{
                    position: "absolute",

                    top: "20px",
                    right: "20px",

                    padding: "10px 14px",

                    background:
                        "rgba(0, 0, 0, 0.75)",

                    color: "#fff",

                    borderRadius: "6px",

                    fontSize: "11px",

                    lineHeight: 1.6,

                    whiteSpace: "pre-line",

                    zIndex: 200,

                    pointerEvents: "none",
                }}
            >
                {currentState}
            </div>


            {/* =====================================================
                CLOSED FRIDGE
            ====================================================== */}

            {!fridgeIsOpen && (
                <button
                    aria-label="Open fridge"
                    onClick={openFridge}
                    style={{
                        position: "absolute",

                        left: "3%",
                        top: "15%",

                        width: "18%",
                        height: "75%",

                        padding: 0,

                        border: "none",

                        background: "transparent",

                        cursor: "pointer",

                        zIndex: 50,
                    }}
                />
            )}


            {/* =====================================================
                OPEN FRIDGE — INTERIOR
            ====================================================== */}

            {fridgeIsOpen && (
                <button
                    aria-label="Enter fridge"
                    onClick={enterFridge}
                    style={{
                        position: "absolute",

                        left: "5%",
                        top: "22%",

                        width: "13%",
                        height: "55%",

                        padding: 0,

                        border: "none",

                        background: "transparent",

                        cursor: "pointer",

                        zIndex: 55,
                    }}
                />
            )}


            {/* =====================================================
                OPEN FRIDGE — DOOR
            ====================================================== */}

            {fridgeIsOpen && (
                <button
                    aria-label="Close fridge"
                    onClick={closeFridge}
                    style={{
                        position: "absolute",

                        left: "14%",
                        top: "15%",

                        width: "7%",
                        height: "75%",

                        padding: 0,

                        border: "none",

                        background: "transparent",

                        cursor: "pointer",

                        zIndex: 60,
                    }}
                />
            )}


            {/* =====================================================
                BOILER STOVE KNOB
            ====================================================== */}

            <button
                aria-label="Boiler stove knob"
                onClick={toggleBoiler}
                style={{
                    position: "absolute",

                    left: "40.8%",
                    top: "55.5%",

                    width: "25px",
                    height: "25px",

                    padding: 0,

                    border: "none",

                    borderRadius: "50%",

                    background: "transparent",

                    cursor: "pointer",

                    zIndex: 50,
                }}
            />


            {/* =====================================================
                PAN STOVE KNOB
            ====================================================== */}

            <button
                aria-label="Pan stove knob"
                onClick={togglePan}
                style={{
                    position: "absolute",

                    left: "51%",
                    top: "55.5%",

                    width: "25px",
                    height: "25px",

                    padding: 0,

                    border: "none",

                    borderRadius: "50%",

                    background: "transparent",

                    cursor: "pointer",

                    zIndex: 50,
                }}
            />


            {/* =====================================================
                PAN
            ====================================================== */}

            <button
                aria-label="Pan"
                onClick={openPanScreen}
                style={{
                    position: "absolute",

                    left: "48%",
                    top: "43.8%",

                    width: "7%",
                    height: "10%",

                    padding: 0,

                    border: "none",

                    background: "transparent",

                    cursor: "pointer",

                    zIndex: 50,
                }}
            />


            {/* =====================================================
                BOILER
            ====================================================== */}

            <button
                aria-label="Boiler"
                onClick={openBoilerScreen}
                style={{
                    position: "absolute",

                    left: "39.5%",
                    top: "43.8%",

                    width: "8%",
                    height: "10%",

                    padding: 0,

                    border: "none",

                    background: "transparent",

                    cursor: "pointer",

                    zIndex: 50,
                }}
            />


            {/* =====================================================
                CUTTING BOARD
            ====================================================== */}

            <button
                aria-label="Cutting board"
                onClick={handleCuttingBoard}
                style={{
                    position: "absolute",

                    left: "56%",
                    top: "38%",

                    width: "8%",
                    height: "15%",

                    padding: 0,

                    border: "none",

                    background: "transparent",

                    cursor: "pointer",

                    zIndex: 50,
                }}
            />


            {/* =====================================================
                SINK
            ====================================================== */}

            <button
                aria-label="Sink"
                onClick={handleSink}
                style={{
                    position: "absolute",

                    left: "68%",
                    top: "38%",

                    width: "12%",
                    height: "18%",

                    padding: 0,

                    border: "none",

                    background: "transparent",

                    cursor: "pointer",

                    zIndex: 50,
                }}
            />


            {/* =====================================================
    PLATE 1
===================================================== */}

            <button
                type="button"
                aria-label="Plate 1"
                onClick={onPlate}
                style={{
                    position: "absolute",

                    left: "42%",
                    top: "77%",

                    width: "12%",
                    height: "12%",

                    padding: 0,

                    border: "none",
                    borderRadius: "50%",

                    background: "transparent",

                    cursor: "pointer",

                    zIndex: 50,
                }}
            />


            {/* =====================================================
    PLATE 2
===================================================== */}

            <button
                type="button"
                aria-label="Plate 2"
                onClick={onPlate}
                style={{
                    position: "absolute",

                    left: "57%",
                    top: "79%",

                    width: "12%",
                    height: "12%",

                    padding: 0,

                    border: "none",
                    borderRadius: "50%",

                    background: "transparent",

                    cursor: "pointer",

                    zIndex: 50,
                }}
            />

        </div>
    );
}