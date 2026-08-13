"use client";

import { useEffect, useState } from "react";

import BootScreen from "@/components/boot/BootScreen";
import LoginScreen from "@/components/auth/LoginScreen";
import CreateAccountScreen from "@/components/auth/CreateAccountScreen";
import Desktop from "@/components/desktop/Desktop";
import StartupScreen from "@/components/startup/StartupScreen";

type Stage =
  | "boot"
  | "login"
  | "create-account"
  | "startup"
  | "desktop";

type TransitionState = "idle" | "out" | "in";

export default function Home() {
  const [stage, setStage] = useState<Stage>("boot");
  const [checkingAuth, setCheckingAuth] = useState(true);

  const [transitionState, setTransitionState] =
    useState<TransitionState>("idle");

  const [bootKey, setBootKey] = useState(0);

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        const response = await fetch("/api/auth/me", {
          credentials: "include",
        });

        if (response.ok) {
          setStage("desktop");
        } else {
          setStage("login");
        }
      } catch (error) {
        console.error(
          "Authentication check failed:",
          error
        );

        setStage("login");
      } finally {
        setCheckingAuth(false);
      }
    };

    checkAuthentication();
  }, []);

  useEffect(() => {
    const keys = new Set<string>();

    const handleKeyDown = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();

      keys.add(key);

      if (
        keys.has("s") &&
        keys.has("f") &&
        keys.has("r")
      ) {
        // Restart Sefirah completely
        setBootKey((key) => key + 1);
        setStage("boot");
        setTransitionState("idle");

        // Prevent repeated triggering while keys are held
        keys.clear();
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      keys.delete(event.key.toLowerCase());
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  /**
   * Crossfade from the current screen
   * into the next screen.
   */
  const transitionTo = (nextStage: Stage) => {
    // Fade current screen out
    setTransitionState("out");

    setTimeout(() => {
      // Change the actual screen while invisible
      setStage(nextStage);

      // Start fading the new screen in
      requestAnimationFrame(() => {
        setTransitionState("in");

        setTimeout(() => {
          setTransitionState("idle");
        }, 500);
      });
    }, 500);
  };

  if (checkingAuth) {
    return null;
  }

  const opacity =
    transitionState === "out" ? 0 : 1;

  return (
    <main
      style={{
        position: "relative",
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        background: "#000000",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity,
          transition:
            "opacity 500ms ease-in-out",
        }}
      >
        {stage === "boot" && (
          <BootScreen
            key={bootKey}
            onFinished={() => transitionTo("login")}
          />
        )}

        {stage === "login" && (
          <LoginScreen
            onLogin={() =>
              transitionTo("startup")
            }
            onCreateAccount={() =>
              transitionTo("create-account")
            }
          />
        )}

        {stage === "create-account" && (
          <CreateAccountScreen
            onCreated={() =>
              transitionTo("login")
            }
            onBack={() =>
              transitionTo("login")
            }
          />
        )}

        {stage === "startup" && (
          <StartupScreen
            onFinished={() =>
              transitionTo("desktop")
            }
          />
        )}

        {stage === "desktop" && <Desktop />}
      </div>
    </main>
  );
}