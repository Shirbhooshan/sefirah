"use client";

import { useEffect, useState } from "react";

interface LoginScreenProps {
  onFinished?: () => void;
}

export default function LoginScreen({
  onFinished,
}: LoginScreenProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [savedUsername, setSavedUsername] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("sefirah-account");

    if (saved) {
      try {
        const account = JSON.parse(saved);
        setSavedUsername(account.username);
        setUsername(account.username);
      } catch {
        localStorage.removeItem("sefirah-account");
      }
    }
  }, []);

  const login = () => {
    setError("");

    const saved = localStorage.getItem("sefirah-account");

    if (!saved) {
      setError("No account found.");
      return;
    }

    try {
      const account = JSON.parse(saved);

      if (
        username !== account.username ||
        password !== account.password
      ) {
        setError("Incorrect username or password.");
        return;
      }

      localStorage.setItem("sefirah-logged-in", "true");

      onFinished?.();
    } catch {
      setError("Unable to load account.");
    }
  };

  return (
    <main
      style={{
        width: "100vw",
        height: "100vh",
        background: "#0874c9",
        color: "#ffffff",

        display: "flex",
        alignItems: "center",
        justifyContent: "center",

        fontFamily: "var(--font-vga)",
      }}
    >
      <div
        style={{
          width: "280px",

          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <div
          style={{
            fontSize: "20px",
            marginBottom: "28px",
          }}
        >
          SEFIRAH
        </div>

        {/* Username */}
        <div
          style={{
            width: "100%",
            marginBottom: "12px",
          }}
        >
          <label
            style={{
              display: "block",
              marginBottom: "5px",
              fontSize: "14px",
            }}
          >
            Username
          </label>

          <input
            autoFocus
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                login();
              }
            }}
            style={{
              width: "100%",
              height: "32px",

              boxSizing: "border-box",

              background: "#ffffff",
              color: "#000000",

              border: "1px solid #000000",
              borderRadius: 0,

              padding: "4px 7px",

              fontFamily: "var(--font-vga)",
              fontSize: "14px",

              outline: "none",
            }}
          />
        </div>

        {/* Password */}
        <div
          style={{
            width: "100%",
            marginBottom: "18px",
          }}
        >
          <label
            style={{
              display: "block",
              marginBottom: "5px",
              fontSize: "14px",
            }}
          >
            Password
          </label>

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                login();
              }
            }}
            style={{
              width: "100%",
              height: "32px",

              boxSizing: "border-box",

              background: "#ffffff",
              color: "#000000",

              border: "1px solid #000000",
              borderRadius: 0,

              padding: "4px 7px",

              fontFamily: "var(--font-vga)",
              fontSize: "14px",

              outline: "none",
            }}
          />
        </div>

        {/* Error */}
        {error && (
          <div
            style={{
              width: "100%",
              marginBottom: "14px",
              color: "#ffff00",
              fontSize: "13px",
            }}
          >
            {error}
          </div>
        )}

        <button
          onClick={login}
          style={{
            height: "32px",
            padding: "0 22px",

            background: "#ffffff",
            color: "#000000",

            border: "1px solid #000000",
            borderRadius: 0,

            fontFamily: "var(--font-vga)",
            fontSize: "14px",

            cursor: "pointer",
          }}
        >
          LOGIN
        </button>
      </div>
    </main>
  );
}