"use client";

import { useState } from "react";
import BootScreen from "@/components/boot/BootScreen";
import StartupScreen from "@/components/startup/StartupScreen";
import Desktop from "@/components/desktop/Desktop";

export default function Home() {
  const [stage, setStage] = useState<
    "boot" | "startup" | "desktop"
  >("boot");

  if (stage === "boot") {
    return (
      <BootScreen
        onFinished={() => setStage("startup")}
      />
    );
  }

  if (stage === "startup") {
    return (
      <StartupScreen
        onFinished={() => setStage("desktop")}
      />
    );
  }

  return <Desktop />;
}