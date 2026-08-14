"use client";

import { useState } from "react";

import MenuBar from "./MenuBar";
import Dock from "./Dock";
import Wallpaper from "./Wallpaper";
import FileExplorer from "@/components/filesystem/FileExplorer";

export default function Desktop() {
  const [fileExplorerOpen, setFileExplorerOpen] =
    useState(false);

  const handleOpenApp = (id: string) => {
    if (id === "files") {
      setFileExplorerOpen(true);
    }
  };

  return (
    <main
      style={{
        position: "relative",
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        background: "#222222",
      }}
    >
      <MenuBar />

      <Wallpaper />

      {/* File Explorer Window */}
      {fileExplorerOpen && (
        <div
          style={{
            position: "absolute",
            top: "80px",
            left: "50%",
            transform: "translateX(-50%)",

            width: "720px",
            height: "500px",

            background: "#000000",
            border: "1px solid #ffffff",

            zIndex: 30,

            padding: "20px",
            boxSizing: "border-box",

            fontFamily: "var(--font-vga)",
          }}
        >
          {/* Window Header */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",

              marginBottom: "20px",

              color: "#ffffff",
            }}
          >
            <span
              style={{
                fontSize: "14px",
              }}
            >
              FILE EXPLORER
            </span>

            <button
              onClick={() =>
                setFileExplorerOpen(false)
              }
              style={{
                background: "none",
                border: "none",
                color: "#ffffff",

                padding: 0,

                fontFamily: "inherit",
                fontSize: "18px",

                cursor: "pointer",
              }}
              aria-label="Close File Explorer"
            >
              ×
            </button>
          </div>

          {/* File Explorer */}
          <div
            style={{
              height: "calc(100% - 50px)",
              overflow: "auto",
            }}
          >
            <FileExplorer />
          </div>
        </div>
      )}

      <Dock
        openApps={
          fileExplorerOpen
            ? ["files"]
            : []
        }
        onOpenApp={handleOpenApp}
      />
    </main>
  );
}