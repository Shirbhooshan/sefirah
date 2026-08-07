"use client";

import { useEffect, useState } from "react";

interface BootTaskProps {
  text: string;
  status: "OK" | "WARN" | "INFO";
  duration: number;
  onComplete?: () => void;
}

export default function BootTask({
  text,
  duration,
  onComplete,
}: BootTaskProps) {

  const [dots, setDots] = useState("");

  useEffect(() => {

    const frames = ["", ".", "..", "..."];

    let frame = 0;

    const interval = duration / frames.length;

    const timer = setInterval(() => {

      frame++;

      if (frame >= frames.length) {
        clearInterval(timer);
        onComplete?.();
        return;
      }

      setDots(frames[frame]);

    }, interval);

    return () => clearInterval(timer);

  }, [duration, onComplete]);

  return (
    <div className="whitespace-pre">

      {text}
      {dots}

    </div>
  );
}