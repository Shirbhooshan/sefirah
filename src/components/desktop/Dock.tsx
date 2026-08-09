"use client";

import { useState } from "react";
import fileExplorerIcon from "../../assets/icons/file_explorer.png";
import notesIcon from "../../assets/icons/notes.png";
import recycleIcon from "../../assets/icons/recycle.png";
import settingsIcon from "../../assets/icons/settings.png";
import youtubeIcon from "../../assets/icons/youtube.png";

interface DockApp {
  id: string;
  name: string;
  icon: string;
}

interface DockProps {
  openApps?: string[];
  onOpenApp?: (id: string) => void;
}

const dockApps = [
  {
    id: "files",
    name: "File Explorer",
    icon: fileExplorerIcon,
  },
  {
    id: "notes",
    name: "Notes",
    icon: notesIcon,
  },
  {
    id: "youtube",
    name: "YouTube",
    icon: youtubeIcon,
  },
  {
    id: "settings",
    name: "Settings",
    icon: settingsIcon,
  },
  {
    id: "recycle",
    name: "Recycle Bin",
    icon: recycleIcon,
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
                src={
                  typeof app.icon === "string"
                    ? app.icon
                    : app.icon.src
                }
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
                    bottom: "-5px",
                    left: "50%",
                    transform: "translateX(-50%)",

                    width: "26px",
                    height: "2px",

                    borderRadius: "999px",

                    backgroundColor:
                      "var(--dock-active-color, #3fa9ff)",

                    boxShadow:
                      "0 0 5px var(--dock-active-color, #3fa9ff)",
                  }}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}