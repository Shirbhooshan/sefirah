"use client";

import { useState } from "react";

import MenuBar from "./MenuBar";
import Dock from "./Dock";
import Wallpaper from "./Wallpaper";
import FileExplorer from "@/components/filesystem/FileExplorer";

interface ExplorerWindow {
  id: string;

  location:
  | "home"
  | "recycle";

  left: number;
  top: number;

  zIndex: number;

  centered: boolean;
}

interface NotesWindow {
  id: string;
  left: number;
  top: number;
  zIndex: number;
  centered: boolean;
}

const MAX_WINDOWS = 5;

export default function Desktop() {
  const [
    explorerWindows,
    setExplorerWindows,
  ] = useState<ExplorerWindow[]>([]);

  const [
    nextZIndex,
    setNextZIndex,
  ] = useState(50);

  const [
    notesWindows,
    setNotesWindows,
  ] = useState<NotesWindow[]>([]);

  /*
   * =========================================================
   * RANDOM WINDOW POSITIONS
   * =========================================================
   *
   * These are only used for windows AFTER
   * the first one.
   */

  const getWindowPosition = () => {
    const positions = [
      {
        left: 8,
        top: 10,
      },
      {
        left: 14,
        top: 15,
      },
      {
        left: 20,
        top: 8,
      },
      {
        left: 11,
        top: 22,
      },
      {
        left: 24,
        top: 17,
      },
    ];

    const available =
      positions.filter(
        (position) =>
          !explorerWindows.some(
            (window) =>
              Math.abs(
                window.left -
                position.left
              ) < 3 &&
              Math.abs(
                window.top -
                position.top
              ) < 3
          )
      );

    if (
      available.length > 0
    ) {
      return available[
        Math.floor(
          Math.random() *
          available.length
        )
      ];
    }

    return positions[
      Math.floor(
        Math.random() *
        positions.length
      )
    ];
  };

  /* Open Notes */
  const openNotes = () => {
    const id =
      `notes-${Date.now()}-${Math.random()
        .toString(36)
        .slice(2, 10)}`;

    const isFirst =
      notesWindows.length === 0;

    setNotesWindows(
      (previous) => [
        ...previous,
        {
          id,

          left: isFirst
            ? 0
            : 15,

          top: isFirst
            ? 0
            : 15,

          zIndex: nextZIndex,

          centered: isFirst,
        },
      ]
    );

    setNextZIndex(
      (value) => value + 1
    );
  };

  {
    notesWindows.map((window) => (
      <NotesApp
        key={window.id}

        windowPosition={{
          left: window.left,
          top: window.top,
          zIndex: window.zIndex,
          centered: window.centered,
        }}

        onFocus={() => {
          const zIndex =
            nextZIndex;

          setNextZIndex(
            (value) => value + 1
          );

          setNotesWindows(
            (previous) =>
              previous.map(
                (item) =>
                  item.id ===
                    window.id
                    ? {
                      ...item,
                      zIndex,
                    }
                    : item
              )
          );
        }}

        onMove={(left, top) => {
          setNotesWindows(
            (previous) =>
              previous.map(
                (item) =>
                  item.id ===
                    window.id
                    ? {
                      ...item,
                      left,
                      top,
                      centered:
                        false,
                    }
                    : item
              )
          );
        }}

        onClose={() => {
          setNotesWindows(
            (previous) =>
              previous.filter(
                (item) =>
                  item.id !==
                  window.id
              )
          );
        }}
      />
    ))
  }

  /*
   * =========================================================
   * OPEN EXPLORER WINDOW
   * =========================================================
   *
   * IMPORTANT:
   *
   * 1st window:
   *     EXACT CENTER
   *
   * 2nd - 5th:
   *     RANDOM POSITION
   *
   * Folders do NOT call this function anymore.
   * Double-clicking a folder navigates inside the
   * existing Explorer window.
   */

  const openExplorer = (
    location:
      | "home"
      | "recycle"
  ) => {
    if (
      explorerWindows.length >=
      MAX_WINDOWS
    ) {
      return;
    }

    const isFirstWindow =
      explorerWindows.length === 0;

    const position =
      isFirstWindow
        ? {
          left: 0,
          top: 0,
        }
        : getWindowPosition();

    const zIndex =
      nextZIndex;

    const newWindow: ExplorerWindow =
    {
      id:
        `explorer-${Date.now()}-${Math.random()
          .toString(36)
          .slice(2, 10)}`,

      location,

      left:
        position.left,

      top:
        position.top,

      zIndex,

      centered:
        isFirstWindow,
    };

    setExplorerWindows(
      (previous) => [
        ...previous,
        newWindow,
      ]
    );

    setNextZIndex(
      (value) =>
        value + 1
    );
  };

  /*
   * =========================================================
   * CLOSE WINDOW
   * =========================================================
   */

  const closeExplorer = (
    id: string
  ) => {
    setExplorerWindows(
      (previous) =>
        previous.filter(
          (window) =>
            window.id !== id
        )
    );
  };

  /*
   * =========================================================
   * FOCUS WINDOW
   * =========================================================
   */

  const focusExplorer = (
    id: string
  ) => {
    const zIndex =
      nextZIndex;

    setNextZIndex(
      (value) =>
        value + 1
    );

    setExplorerWindows(
      (previous) =>
        previous.map(
          (window) =>
            window.id === id
              ? {
                ...window,
                zIndex,
              }
              : window
        )
    );
  };

  const moveExplorer = (
    id: string,
    left: number,
    top: number
  ) => {
    setExplorerWindows((previous) =>
      previous.map((window) =>
        window.id === id
          ? {
            ...window,
            left,
            top,
            centered: false,
          }
          : window
      )
    );
  };

  /*
   * =========================================================
   * DOCK
   * =========================================================
   */

  const handleOpenApp = (
    id: string
  ) => {
    /*
     * FILE EXPLORER
     *
     * Every click from the Dock creates
     * a new independent Explorer window.
     */

    if (
      id === "files"
    ) {
      openExplorer(
        "home"
      );

      return;
    }

    /*
     * RECYCLE BIN
     *
     * Also opens as its own independent window.
     */

    if (
      id === "recycle"
    ) {
      openExplorer(
        "recycle"
      );

      return;
    }

    console.log(
      "Opening:",
      id
    );
  };

  /*
   * =========================================================
   * RENDER
   * =========================================================
   */

  return (
    <main
      style={{
        position:
          "relative",

        width:
          "100vw",

        height:
          "100vh",

        overflow:
          "hidden",

        background:
          "#222222",
      }}
    >
      <div
        style={{
          position: "relative",
          zIndex: 1000,
        }}
      >
        <MenuBar />
      </div>

      <Wallpaper />

      {/* =====================================================
          EXPLORER WINDOWS
      ====================================================== */}

      {explorerWindows.map(
        (window) => (
          <FileExplorer
            key={window.id}

            initialLocation={
              window.location
            }

            onClose={() =>
              closeExplorer(
                window.id
              )
            }

            onMove={(left, top) =>
              moveExplorer(
                window.id,
                left,
                top
              )
            }

            windowPosition={{
              left:
                window.left,

              top:
                window.top,

              zIndex:
                window.zIndex,

              centered:
                window.centered,
            }}

            onFocus={() =>
              focusExplorer(
                window.id
              )
            }
          />
        )
      )}

      {/* =====================================================
          DOCK
      ====================================================== */}

      <Dock
        openApps={
          explorerWindows.length >
            0
            ? ["files"]
            : []
        }

        onOpenApp={
          handleOpenApp
        }
      />
    </main>
  );
}