"use client";

import BootCursor from "./BootCursor";
import { useEffect, useRef, useState } from "react";

interface TypewriterProps {
    text: string;
    speed?: number;
    onComplete?: () => void;
}

export default function Typewriter({
    text,
    speed = 55,
    onComplete,
}: TypewriterProps) {
    const [current, setCurrent] = useState("");

    const completed = useRef(false);

    useEffect(() => {
        let index = 0;

        const timer = setInterval(() => {
            index++;

            setCurrent(text.slice(0, index));

            if (index >= text.length) {
                clearInterval(timer);

                if (!completed.current) {
                    completed.current = true;

                    setTimeout(() => {
                        onComplete?.();
                    }, 400);
                }
            }
        }, speed);

        return () => clearInterval(timer);
    }, [text, speed, onComplete]);

    return (
        <div className="whitespace-pre text-[#d4d4d4]">
            {current}
            <BootCursor />
        </div>
    );
}