"use client";

import { useState } from "react";

interface LoginScreenProps {
  onLogin: () => void;
  onCreateAccount: () => void;
}

export default function LoginScreen({
  onLogin,
  onCreateAccount,
}: LoginScreenProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!username || !password) {
      setError("enter username and password");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          username,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setError(data.message || "invalid credentials");
        setLoading(false);
        return;
      }

      onLogin();
    } catch (error) {
      console.error("Login error:", error);
      setError("connection error");
      setLoading(false);
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Enter") {
      handleLogin();
    }
  };

  const inputStyle: React.CSSProperties = {
    width: "280px",
    height: "42px",

    padding: "0",

    background: "transparent",
    color: "#ffffff",

    border: "none",
    borderBottom: "1px solid #555555",

    borderRadius: 0,
    outline: "none",

    fontFamily: "var(--font-vga), monospace",
    fontSize: "18px",
    letterSpacing: "0.03em",

    transition: "border-color 120ms ease",
  };

  return (
    <main
      style={{
        width: "100vw",
        height: "100vh",

        background: "#000000",

        display: "flex",
        alignItems: "center",
        justifyContent: "center",

        fontFamily: "var(--font-vga), monospace",
        color: "#ffffff",
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
        {/* Username */}
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="username"
          autoComplete="username"
          disabled={loading}
          style={inputStyle}
          onFocus={(e) => {
            e.currentTarget.style.borderBottomColor =
              "#ffffff";
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderBottomColor =
              "#555555";
          }}
        />

        {/* Password + Arrow */}
        <div
          style={{
            position: "relative",
            width: "280px",
          }}
        >
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="password"
            autoComplete="current-password"
            disabled={loading}
            style={inputStyle}
            onFocus={(e) => {
              e.currentTarget.style.borderBottomColor =
                "#ffffff";
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderBottomColor =
                "#555555";
            }}
          />

          {/* Arrow */}
          <button
            onClick={handleLogin}
            disabled={loading}
            aria-label="Login"
            style={{
              position: "absolute",

              left: "calc(100% + 8px)",
              bottom: "8px",

              width: "22px",
              height: "22px",

              padding: 0,

              background: "transparent",
              border: 0,

              color: "#ffffff",

              cursor: loading
                ? "default"
                : "pointer",

              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line
                x1="5"
                y1="12"
                x2="19"
                y2="12"
              />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </button>
        </div>

        {/* Error */}
        {error && (
          <div
            style={{
              width: "280px",
              marginTop: "12px",

              fontSize: "12px",
              lineHeight: "1.4",

              color: "#ffffff",
            }}
          >
            {error}
          </div>
        )}

        {/* Create Account */}
        <button
          onClick={onCreateAccount}
          disabled={loading}
          style={{
            marginTop: "28px",

            padding: 0,

            background: "transparent",
            border: 0,

            color: "#666666",

            fontFamily:
              "var(--font-vga), monospace",

            fontSize: "15px",

            cursor: loading
              ? "default"
              : "pointer",

            transition: "color 120ms ease",
          }}
          onMouseEnter={(e) => {
            if (!loading) {
              e.currentTarget.style.color =
                "#ffffff";
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color =
              "#666666";
          }}
        >
          create account
        </button>
      </div>
    </main>
  );
}