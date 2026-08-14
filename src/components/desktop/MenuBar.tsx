"use client";

import { useEffect, useState } from "react";
import menuBarLogo from "../../assets/media/menu-bar-logo.png";
import wifiIcon from "../../assets/icons/wifi.svg";
import searchIcon from "../../assets/icons/search.svg";
import githubIcon from "../../assets/icons/github.svg";
import { useAudio } from "@/context/AudioContext";

interface MenuBarProps {
  onSearch?: () => void;
}

export default function MenuBar({
  onSearch,
}: MenuBarProps) {
  const [date, setDate] = useState(new Date());
  const [showVolume, setShowVolume] = useState(false);
  const { volume, setVolume } = useAudio();
  const [showWifi, setShowWifi] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setDate(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const time = date.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
    hour12: false,
  });

  const day = date.toLocaleDateString([], {
    weekday: "short",
  });

  const dateText = date.toLocaleDateString([], {
    month: "short",
    day: "numeric",
  });

  return (
    <header
      style={{
        position: "relative",
        zIndex: 50,

        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",

        width: "100%",
        height: "40px",

        padding: "0 12px",

        color: "#ffffff",

        /* Subtle dark glass */
        background: "rgba(10, 10, 10, 0.48)",

        /* Much lighter blur than the dock */
        backdropFilter: "blur(16px) saturate(120%)",
        WebkitBackdropFilter: "blur(16px) saturate(120%)",

        /* Very subtle separation */
        borderBottom: "1px solid rgba(255, 255, 255, 0.07)",

        boxSizing: "border-box",
      }}
    >

      {/* ================================================== */}
      {/* LEFT SIDE */}
      {/* ================================================== */}

      <div
        style={{
          height: "100%",
          display: "flex",
          alignItems: "center",
          gap: "8px",
          flexShrink: 0,
        }}
      >

        {/* Sefirah Logo */}
        <div
          style={{
            width: "28px",
            height: "40px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <img
            src={
              typeof menuBarLogo === "string"
                ? menuBarLogo
                : menuBarLogo.src
            }
            alt="Sefirah"
            style={{
              width: "32px",
              height: "32px",
              objectFit: "contain",
              display: "block",
            }}
          />
        </div>

        {/* Name */}
        <span
          style={{
            fontSize: "16px",
            fontWeight: 400,
            lineHeight: 1,
            whiteSpace: "nowrap",
          }}
        >
          sefirah
        </span>

      </div>


      {/* ================================================== */}
      {/* RIGHT SIDE */}
      {/* ================================================== */}

      <div
        style={{
          height: "100%",
          display: "flex",
          alignItems: "center",
          gap: "10px",
          flexShrink: 0,
        }}
      >

        {/* ---------------- VOLUME ---------------- */}

        <div
          style={{
            position: "relative",
            display: "flex",
            alignItems: "center",
          }}
        >

          <button
            onClick={() => setShowVolume((value) => !value)}
            aria-label="Volume"
            style={{
              width: "30px",
              height: "30px",
              padding: 0,
              border: 0,
              background: "transparent",
              color: "#ffffff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              borderRadius: "6px",
            }}
          >
            {volume === 0 ? (
              // MUTED
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                <line x1="23" y1="9" x2="17" y2="15" />
                <line x1="17" y1="9" x2="23" y2="15" />
              </svg>

            ) : volume <= 30 ? (
              // LOW
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                <path d="M15 9a5 5 0 0 1 0 6" />
              </svg>

            ) : volume <= 65 ? (
              // MEDIUM
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                <path d="M15 9a5 5 0 0 1 0 6" />
                <path d="M18 6a9 9 0 0 1 0 12" />
              </svg>

            ) : (
              // HIGH
              <svg
                width="21"
                height="21"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                <path d="M15.5 8.5a5 5 0 0 1 0 7" />
                <path d="M19 5a9 9 0 0 1 0 14" />
              </svg>
            )}
          </button>


          {/* Volume Popup */}

          {showVolume && (
            <div
              style={{
                position: "absolute",
                top: "42px",
                right: 0,

                width: "300px",
                padding: "18px 18px 15px",

                background: "rgba(32, 32, 32, 0.88)",
                backdropFilter: "blur(24px) saturate(140%)",
                WebkitBackdropFilter: "blur(24px) saturate(140%)",

                border: "1px solid rgba(255,255,255,0.12)",
                borderRadius: "14px",

                boxShadow:
                  "0 12px 35px rgba(0,0,0,0.45)",

                boxSizing: "border-box",
                color: "#ffffff",
                zIndex: 2000,
              }}
            >
              {/* Volume row */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "14px",
                }}
              >
                {/* Speaker */}
                <div
                  style={{
                    width: "24px",
                    height: "24px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  {volume === 0 ? (
                    <svg
                      width="21"
                      height="21"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                      <line x1="23" y1="9" x2="17" y2="15" />
                      <line x1="17" y1="9" x2="23" y2="15" />
                    </svg>
                  ) : volume < 50 ? (
                    <svg
                      width="21"
                      height="21"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                      <path d="M15 9a4 4 0 0 1 0 6" />
                    </svg>
                  ) : (
                    <svg
                      width="21"
                      height="21"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11" />
                      <path d="M15.5 8.5a5 5 0 0 1 0 7" />
                      <path d="M19 5a9 9 0 0 1 0 14" />
                    </svg>
                  )}
                </div>

                {/* Slider */}
                <div
                  style={{
                    position: "relative",
                    flex: 1,
                    height: "24px",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  {/* Track */}
                  <div
                    style={{
                      position: "absolute",
                      left: 0,
                      right: 0,
                      height: "4px",
                      borderRadius: "999px",
                      background: "rgba(255,255,255,0.28)",
                      overflow: "hidden",
                    }}
                  >
                    {/* Filled portion */}
                    <div
                      style={{
                        width: `${volume}%`,
                        height: "100%",
                        background: "var(--dock-active-color, #3fa9ff)",
                        borderRadius: "999px",
                        transition: "width 80ms ease",
                      }}
                    />
                  </div>

                  {/* Actual input */}
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={volume}
                    onChange={(e) =>
                      setVolume(Number(e.target.value))
                    }
                    style={{
                      position: "absolute",
                      inset: 0,

                      width: "100%",
                      height: "24px",

                      margin: 0,
                      opacity: 0,

                      cursor: "pointer",
                    }}
                  />

                  {/* Thumb */}
                  <div
                    style={{
                      position: "absolute",
                      left: `calc(${volume}% - 7px)`,

                      width: "14px",
                      height: "14px",

                      borderRadius: "50%",

                      background: "#ffffff",

                      boxShadow:
                        "0 1px 4px rgba(0,0,0,0.5)",

                      pointerEvents: "none",

                      transition: "left 80ms ease",
                    }}
                  />
                </div>
              </div>

              {/* Volume percentage */}
              <div
                style={{
                  marginTop: "8px",
                  marginLeft: "38px",
                  fontSize: "12px",
                  color: "rgba(255,255,255,0.62)",
                }}
              >
                {volume}% volume
              </div>
            </div>
          )}

        </div>


        {/* ---------------- WI-FI ---------------- */}

        <div
          style={{
            position: "relative",
            display: "flex",
            alignItems: "center",
          }}
        >
          <button
            onClick={() => setShowWifi((value) => !value)}
            aria-label="Wi-Fi"
            style={{
              width: "30px",
              height: "30px",
              padding: 0,
              border: 0,
              background: "transparent",
              color: "#ffffff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              borderRadius: "6px",
            }}
          >
            <img
              src={wifiIcon.src}
              alt="Wi-Fi"
              style={{
                width: "19px",
                height: "19px",
                objectFit: "contain",
                filter: "brightness(0) invert(1)",
              }}
            />
          </button>

          {showWifi && (
            <div
              style={{
                position: "absolute",
                top: "38px",
                right: 0,
                width: "230px",
                padding: "14px",
                backgroundColor: "#222222",
                border: "1px solid rgba(255,255,255,0.12)",
                borderRadius: "10px",
                zIndex: 2000,
                boxShadow: "0 10px 30px rgba(0,0,0,0.45)",
                boxSizing: "border-box",
              }}
            >
              <div
                style={{
                  fontSize: "13px",
                  color: "rgba(255,255,255,0.55)",
                  marginBottom: "5px",
                }}
              >
                Wi-Fi
              </div>

              <div
                style={{
                  fontSize: "15px",
                  color: "#ffffff",
                  marginBottom: "12px",
                }}
              >
                <span style={{ color: "#4ade80" }}>●</span> Connected
              </div>

              <div
                style={{
                  height: "1px",
                  backgroundColor: "rgba(255,255,255,0.1)",
                  marginBottom: "12px",
                }}
              />

              <div
                style={{
                  fontSize: "13px",
                  color: "rgba(255,255,255,0.55)",
                }}
              >
                Current Network
              </div>

              <div
                style={{
                  marginTop: "4px",
                  fontSize: "15px",
                  color: "#ffffff",
                }}
              >
                Sefirah Network
              </div>

              <div
                style={{
                  marginTop: "12px",
                  fontSize: "12px",
                  color: "rgba(255,255,255,0.45)",
                }}
              >
                Signal: Excellent
              </div>
            </div>
          )}
        </div>


        {/* ---------------- SEARCH ---------------- */}

        <button
          onClick={onSearch}
          className="flex h-8 w-8 items-center justify-center rounded-md transition hover:bg-white/10"
          aria-label="Search"
        >
          <img
            src={searchIcon.src}
            alt="Search"
            className="h-[17px] w-[17px] object-contain brightness-0 invert"
          />
        </button>


        {/* ---------------- GITHUB ---------------- */}

        <button
          onClick={() =>
            window.open(
              "https://github.com/Shirbhooshan",
              "_blank"
            )
          }
          className="flex h-8 w-8 items-center justify-center rounded-md transition hover:bg-white/10 cursor-pointer"
          aria-label="GitHub"
        >
          <img
            src={githubIcon.src}
            alt="GitHub"
            className="h-[21px] w-[29px] object-contain brightness-0 invert"
          />
        </button>


        {/* ---------------- DATE + TIME ---------------- */}

        <div
          style={{
            marginLeft: "4px",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            whiteSpace: "nowrap",
            fontSize: "15px",
            fontWeight: 400,
            lineHeight: 1,
          }}
        >
          <span>
            {day} {dateText}
          </span>

          <span>
            {time}
          </span>
        </div>

      </div>

    </header>
  );
}