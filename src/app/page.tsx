"use client";

import { useEffect, useState } from "react";

import BootScreen from "@/components/boot/BootScreen";
import StartupScreen from "@/components/startup/StartupScreen";
import AccountScreen from "@/components/account/AccountScreen";
import LoginScreen from "@/components/account/LoginScreen";
import Desktop from "@/components/desktop/Desktop";

export default function Home() {
  const [stage, setStage] = useState<
    "boot" | "startup" | "account" | "login" | "desktop"
  >("boot");

  const [hasAccount, setHasAccount] = useState<boolean | null>(
    null
  );

  useEffect(() => {
    const account = localStorage.getItem("sefirah-account");

    setHasAccount(!!account);
  }, []);

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
        onFinished={() => {
          if (hasAccount) {
            setStage("login");
          } else {
            setStage("account");
          }
        }}
      />
    );
  }

  if (stage === "account") {
    return (
      <AccountScreen
        onFinished={() => {
          setHasAccount(true);
          setStage("desktop");
        }}
      />
    );
  }

  if (stage === "login") {
    return (
      <LoginScreen
        onFinished={() => setStage("desktop")}
      />
    );
  }

  return <Desktop />;
}