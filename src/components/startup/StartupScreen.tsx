"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

import logo from "@/assets/media/boot-logo.png";
import Spinner from "./Spinner";

interface StartupScreenProps {
  onFinished?: () => void;
}

export default function StartupScreen({
  onFinished,
}: StartupScreenProps) {
  const [fade, setFade] = useState(false);

  // Start fading after the spinner finishes
  useEffect(() => {
    const fadeTimer = setTimeout(() => {
      setFade(true);
    }, 1800);

    return () => clearTimeout(fadeTimer);
  }, []);

  // Switch to desktop after fade completes
  useEffect(() => {
    if (!fade) return;

    const finishTimer = setTimeout(() => {
      onFinished?.();
    }, 400);

    return () => clearTimeout(finishTimer);
  }, [fade, onFinished]);

  return (
    <main
      className={`flex h-screen items-center justify-center bg-black transition-opacity duration-500 ${
        fade ? "opacity-0" : "opacity-100"
      }`}
    >
      <div className="flex flex-col items-center">

        <Image
          src={logo}
          alt="Sefirah"
          width={140}
          priority
        />

        <div className="mt-10">
          <Spinner />
        </div>

      </div>
    </main>
  );
}