"use client";

import { useEffect, useState } from "react";

import BootScreen from "@/components/boot/BootScreen";
import LoginScreen from "@/components/auth/LoginScreen";
import CreateAccountScreen from "@/components/auth/CreateAccountScreen";
import StartupScreen from "@/components/startup/StartupScreen";
import Desktop from "@/components/desktop/Desktop";

type Stage =
  | "boot"
  | "login"
  | "create-account"
  | "startup"
  | "desktop";

export default function Home() {
  const [stage, setStage] = useState<Stage>("boot");

  // S + F + R → restart boot sequence
  useEffect(() => {
    if (process.env.NODE_ENV !== "development") {
      return;
    }

    const keys = new Set<string>();

    const handleKeyDown = (e: KeyboardEvent) => {
      keys.add(e.key.toLowerCase());

      if (
        keys.has("s") &&
        keys.has("f") &&
        keys.has("r")
      ) {
        setStage("boot");
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keys.delete(e.key.toLowerCase());
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyDown
      );

      window.removeEventListener(
        "keyup",
        handleKeyUp
      );
    };
  }, []);

  if (stage === "boot") {
    return (
      <BootScreen
        onFinished={() => setStage("login")}
      />
    );
  }

  if (stage === "login") {
    return (
      <LoginScreen
        onLogin={() => setStage("startup")}
        onCreateAccount={() =>
          setStage("create-account")
        }
      />
    );
  }

  if (stage === "create-account") {
    return (
      <CreateAccountScreen
        onCreated={() => setStage("login")}
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