"use client";

import { useState } from "react";

interface CreateAccountScreenProps {
  onCreated: () => void;
}

export default function CreateAccountScreen({
  onCreated,
}: CreateAccountScreenProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCreateAccount = async () => {
    setError("");

    if (!username || !password || !confirmPassword) {
      setError("complete all fields");
      return;
    }

    if (password !== confirmPassword) {
      setError("passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "/api/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            username,
            password,
            confirmPassword,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        setError(
          data.message ||
            "account creation failed"
        );
        setLoading(false);
        return;
      }

      onCreated();
    } catch (error) {
      console.error(
        "Account creation error:",
        error
      );

      setError("connection error");
      setLoading(false);
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Enter") {
      handleCreateAccount();
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

        fontFamily:
          "var(--font-vga), monospace",

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
          onChange={(e) =>
            setUsername(e.target.value)
          }
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

        {/* Password */}
        <input
          type="password"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
          onKeyDown={handleKeyDown}
          placeholder="password"
          autoComplete="new-password"
          disabled={loading}
          style={{
            ...inputStyle,
            marginTop: "8px",
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderBottomColor =
              "#ffffff";
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderBottomColor =
              "#555555";
          }}
        />

        {/* Confirm Password + Arrow */}
        <div
          style={{
            position: "relative",
            width: "280px",
          }}
        >
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) =>
              setConfirmPassword(e.target.value)
            }
            onKeyDown={handleKeyDown}
            placeholder="confirm password"
            autoComplete="new-password"
            disabled={loading}
            style={{
              ...inputStyle,
              marginTop: "8px",
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderBottomColor =
                "#ffffff";
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderBottomColor =
                "#555555";
            }}
          />

          <button
            onClick={handleCreateAccount}
            disabled={loading}
            aria-label="Create account"
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
      </div>
    </main>
  );
}