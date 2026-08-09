"use client";

import { useState } from "react";

interface DockApp {
  id: string;
  name: string;
  icon: string;
}

interface DockProps {
  openApps?: string[];
  onOpenApp?: (id: string) => void;
}

const dockApps: DockApp[] = [
  {
    id: "messages",
    name: "Messages",
    icon: "/icons/messages.svg",
  },
  {
    id: "video",
    name: "Video",
    icon: "/icons/video.svg",
  },
  {
    id: "whatsapp",
    name: "WhatsApp",
    icon: "/icons/whatsapp.svg",
  },
  {
    id: "spotify",
    name: "Spotify",
    icon: "/icons/spotify.svg",
  },
  {
    id: "discord",
    name: "Discord",
    icon: "/icons/discord.svg",
  },
  {
    id: "appstore",
    name: "App Store",
    icon: "/icons/appstore.svg",
  },
  {
    id: "github",
    name: "GitHub",
    icon: "/icons/github.svg",
  },
  {
    id: "settings",
    name: "Settings",
    icon: "/icons/settings.svg",
  },
];

export default function Dock({
  openApps = [],
  onOpenApp,
}: DockProps) {

  const handleClick = (id: string) => {
    onOpenApp?.(id);
  };

  return (
    <div
      style={{
        position: "absolute",
        left: "50%",
        bottom: "18px",
        transform: "translateX(-50%)",

        display: "flex",
        flexDirection: "column",
        alignItems: "center",

        zIndex: 40,
      }}
    >
      {/* Dock */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-end",
          gap: "10px",

          padding: "10px 14px 8px",

          background: "rgba(25, 25, 25, 0.82)",
          backdropFilter: "blur(18px)",
          WebkitBackdropFilter: "blur(18px)",

          border: "1px solid rgba(255,255,255,0.18)",
          borderRadius: "18px",

          boxShadow:
            "0 8px 30px rgba(0,0,0,0.45)",

          minHeight: "76px",
        }}
      >
        {dockApps.map((app) => {
          const isOpen = openApps.includes(app.id);

          return (
            <button
              key={app.id}
              onClick={() => handleClick(app.id)}
              title={app.name}
              style={{
                position: "relative",

                width: "62px",
                height: "62px",

                padding: 0,
                border: 0,
                background: "transparent",

                cursor: "pointer",

                display: "flex",
                alignItems: "center",
                justifyContent: "center",

                transition:
                  "transform 150ms ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform =
                  "translateY(-6px) scale(1.08)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform =
                  "translateY(0) scale(1)";
              }}
            >
              <img
                src={app.icon}
                alt={app.name}
                style={{
                  width: "58px",
                  height: "58px",
                  objectFit: "contain",
                  display: "block",
                }}
              />

              {/* Open indicator */}
              {isOpen && (
                <span
                  style={{
                    position: "absolute",
                    bottom: "-7px",
                    left: "50%",
                    transform: "translateX(-50%)",

                    width: "5px",
                    height: "5px",

                    borderRadius: "2px",

                    backgroundColor:
                      "var(--dock-active-color, #ffffff)",

                    boxShadow:
                      "0 0 6px var(--dock-active-color, #ffffff)",
                  }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Bottom line */}
      {openApps.length > 0 && (
        <div
          style={{
            marginTop: "7px",
            width: "100%",
            height: "2px",
            background:
              "var(--dock-line-color, #3fa9ff)",
            borderRadius: "999px",
            boxShadow:
              "0 0 5px var(--dock-line-color, #3fa9ff)",
          }}
        />
      )}
    </div>
  );
}