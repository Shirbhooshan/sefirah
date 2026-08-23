"use client";

import { useEffect, useState } from "react";

interface LoadingScreenProps {
    onComplete: () => void;
}

export default function LoadingScreen({
    onComplete,
}: LoadingScreenProps) {
    const [progress, setProgress] =
        useState(0);

    useEffect(() => {
        const duration = 1400;
        const start = performance.now();

        let animationFrame: number;

        const animate = (time: number) => {
            const elapsed = time - start;

            const percentage =
                Math.min(
                    elapsed / duration,
                    1
                );

            setProgress(percentage);

            if (percentage < 1) {
                animationFrame =
                    requestAnimationFrame(
                        animate
                    );
            } else {
                setTimeout(() => {
                    onComplete();
                }, 100);
            }
        };

        animationFrame =
            requestAnimationFrame(
                animate
            );

        return () => {
            cancelAnimationFrame(
                animationFrame
            );
        };
    }, [onComplete]);

    return (
        <div
            style={{
                position: "absolute",
                inset: 0,

                background: "#ffffff",

                display: "flex",

                alignItems: "flex-end",
                justifyContent: "flex-end",

                padding: "18px",

                fontFamily:
                    "Comfortaa, sans-serif",
            }}
        >
            <div
                style={{
                    width: "120px",
                    height: "4px",

                    background: "#eeeeee",

                    overflow: "hidden",

                    borderRadius: "4px",
                }}
            >
                <div
                    style={{
                        width:
                            `${progress * 100}%`,

                        height: "100%",

                        background: "#555",

                        borderRadius: "4px",

                        transition:
                            "width 40ms linear",
                    }}
                />
            </div>
        </div>
    );
}