"use client";

import { useEffect, useState } from "react";
import BootScreen from "@/components/boot/BootScreen";
import StartupScreen from "@/components/startup/StartupScreen";
import Desktop from "@/components/desktop/Desktop";

export default function Home() {
  const [stage, setStage] = useState<
    "checking" | "boot" | "startup" | "desktop"
  >("checking");

  useEffect(() => {
    const hasBooted = localStorage.getItem("sefirah-booted");

    if (hasBooted === "true") {
      setStage("startup");
    } else {
      setStage("boot");
    }
  }, []);

  // Wait until we know whether this is the first visit.
  if (stage === "checking") {
    return <div className="h-screen bg-black" />;
  }

  if (stage === "boot") {
    return (
      <BootScreen
        onFinished={() => {
          localStorage.setItem("sefirah-booted", "true");
          setStage("startup");
        }}
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