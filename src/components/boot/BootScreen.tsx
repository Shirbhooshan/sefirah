"use client";

import { useEffect } from "react";

import BootHeader from "./BootHeader";
import BootLog from "./BootLog";
import BootLine from "./BootLine";
import BootTask from "./BootTask";
import Typewriter from "./Typewriter";
import BlackScreen from "./BlackScreen";

import { useBoot } from "@/hooks/useBoot";
import { bootSequence } from "@/lib/bootSequence";

interface BootScreenProps {
  onFinished?: () => void;
}

export default function BootScreen({
  onFinished,
}: BootScreenProps) {
  const {
    phase,
    setPhase,
    currentIndex,
    next,
  } = useBoot(bootSequence.length);

  // Any key after boot finishes
  useEffect(() => {
    const handleKey = () => {
      if (phase !== "waiting") return;

      setPhase("fading");

      setTimeout(() => {
        onFinished?.();
      }, 700);
    };

    window.addEventListener("keydown", handleKey);

    return () =>
      window.removeEventListener("keydown", handleKey);
  }, [phase, onFinished, setPhase]);

  // Automatically advance normal text lines
  useEffect(() => {
    if (phase !== "booting") return;

    const entry = bootSequence[currentIndex];

    if (!entry) return;

    if (entry.type === "text") {
      const timer = setTimeout(() => {
        next();
      }, entry.delay ?? 150);

      return () => clearTimeout(timer);
    }

    if (entry.type === "space") {
      const timer = setTimeout(() => {
        next();
      }, 50);

      return () => clearTimeout(timer);
    }
  }, [currentIndex, phase, next]);

  // Auto-scroll
  useEffect(() => {
    const container = document.getElementById("boot-scroll");

    if (!container) return;

    requestAnimationFrame(() => {
      container.scrollTo({
        top: container.scrollHeight,
        behavior: "smooth",
      });
    });
  }, [currentIndex]);

  if (phase === "black") {
    return <BlackScreen />;
  }

  return (
    <main className="relative flex h-screen flex-col overflow-hidden bg-black px-10 py-6 text-[#d4d4d4]">

      <div
        style={{ paddingLeft: "10px", paddingRight: "24px", paddingTop: "10px" }}
        className="flex h-full flex-col"
      >

        <BootHeader />

        <BootLog>

          {bootSequence
            .slice(0, currentIndex + 1)
            .map((entry, index) => {
              const isCurrent = index === currentIndex;

              switch (entry.type) {

                case "text":
                  return (
                    <BootLine
                      key={index}
                      text={entry.text}
                    />
                  );

                case "space":
                  return <br key={index} />;

                case "task":

                  if (!isCurrent) {
                    return (
                      <BootLine
                        key={index}
                        text={entry.text}
                        status={entry.status}
                      />
                    );
                  }

                  return (
                    <BootTask
                      key={index}
                      text={entry.text}
                      status={entry.status}
                      duration={entry.duration}
                      onComplete={next}
                    />
                  );

                case "typewriter":

                  if (!isCurrent) {
                    return (
                      <BootLine
                        key={index}
                        text={entry.text}
                      />
                    );
                  }

                  return (
                    <Typewriter
                      key={index}
                      text={entry.text}
                      speed={entry.speed}
                      onComplete={next}
                    />
                  );

                default:
                  return null;
              }
            })}

        </BootLog>
      </div>

      {/* Fade Overlay */}
      <div
        className={`pointer-events-none absolute inset-0 bg-black transition-opacity duration-700 ${phase === "fading" ? "opacity-100" : "opacity-0"
          }`}
      />

    </main>
  );
}