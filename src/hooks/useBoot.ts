"use client";

import { useEffect, useState } from "react";

export type BootPhase =
    | "black"
    | "booting"
    | "waiting"
    | "fading";

export function useBoot(totalEntries: number) {
    const [phase, setPhase] = useState<BootPhase>("black");
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        if (phase !== "black") return;

        const timer = setTimeout(() => {
            setPhase("booting");
        }, 1500);

        return () => clearTimeout(timer);
    }, [phase]);

    function next() {
        setCurrentIndex((i) => {
            const nextIndex = i + 1;

            if (nextIndex >= totalEntries) {
                setPhase("waiting");
            }

            return nextIndex;
        });
    }

    return {
        phase,
        setPhase,
        currentIndex,
        next,
    };
}