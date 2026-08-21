"use client";

import { useState } from "react";

import MenuBar from "./MenuBar";
import Dock from "./Dock";
import Wallpaper from "./Wallpaper";

import FileExplorer from "@/components/filesystem/FileExplorer";
import NotesApp from "@/components/notes/NotesApp";
import CookingGame from "@/components/game/cooking-game/CookingGame";

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

  itemId?: string;

  title: string;

  content: string;

  left: number;
  top: number;

  zIndex: number;

  centered: boolean;
}

const MAX_WINDOWS = 5;
const MAX_NOTES_WINDOWS = 3;

interface CookingGameWindow {
  id: string;

  left: number;
  top: number;

  zIndex: number;

  centered: boolean;
}

export default function Desktop() {
  /*
   * =========================================================
   * EXPLORER WINDOWS
   * =========================================================
   */

  const [
    explorerWindows,
    setExplorerWindows,
  ] = useState<ExplorerWindow[]>([]);

  /*
   * =========================================================
   * NOTES WINDOWS
   * =========================================================
   */

  const [
    notesWindows,
    setNotesWindows,
  ] = useState<NotesWindow[]>([]);

  /*
 * =========================================================
 * COOKING GAME WINDOW
 *
 * Only one Cooking Game window is allowed.
 * =========================================================
 */

  const [
    cookingGameWindow,
    setCookingGameWindow,
  ] =
    useState<CookingGameWindow | null>(
      null
    );

  /*
   * =========================================================
   * Z-INDEX
   * =========================================================
   */

  const [
    nextZIndex,
    setNextZIndex,
  ] = useState(50);

  /*
   * =========================================================
   * WINDOW POSITIONS
   * =========================================================
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

    if (available.length > 0) {
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

  const getNotesWindowPosition = () => {
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
    ];

    const available =
      positions.filter(
        (position) =>
          !notesWindows.some(
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

    if (available.length > 0) {
      return available[
        Math.floor(
          Math.random() *
          available.length
        )
      ];
    }

    return {
      left: 15,
      top: 15,
    };
  };

  /*
   * =========================================================
   * FOCUS NOTES
   * =========================================================
   */

  const focusNotes = (
    id: string
  ) => {
    const zIndex =
      nextZIndex;

    setNextZIndex(
      (value) => value + 1
    );

    setNotesWindows(
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

  /*
   * =========================================================
   * CLOSE NOTES WINDOW
   * =========================================================
   */

  const closeNotes = (
    id: string
  ) => {
    setNotesWindows(
      (previous) =>
        previous.filter(
          (window) =>
            window.id !== id
        )
    );
  };

  /*
   * =========================================================
   * MOVE NOTES WINDOW
   * =========================================================
   */

  const moveNotes = (
    id: string,
    left: number,
    top: number
  ) => {
    setNotesWindows(
      (previous) =>
        previous.map(
          (window) =>
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
 * OPEN COOKING GAME
 *
 * Only one instance can exist.
 *
 * If it is already open, simply bring it to the front.
 * =========================================================
 */

  /*
 * =========================================================
 * COOKING GAME
 * =========================================================
 */

  const openCookingGame = () => {
    /*
     * Already open:
     * simply focus the existing window.
     */

    if (cookingGameWindow) {
      const zIndex = nextZIndex;

      setNextZIndex(
        (value) => value + 1
      );

      setCookingGameWindow(
        (previous) =>
          previous
            ? {
              ...previous,
              zIndex,
            }
            : previous
      );

      return;
    }

    const zIndex = nextZIndex;

    const newWindow: CookingGameWindow = {
      id: `cooking-game-${Date.now()}`,

      left: 0,
      top: 0,

      zIndex,

      centered: true,
    };

    setCookingGameWindow(
      newWindow
    );

    setNextZIndex(
      (value) => value + 1
    );
  };

  const closeCookingGame = () => {
    setCookingGameWindow(null);
  };

  const focusCookingGame = () => {
    if (!cookingGameWindow) {
      return;
    }

    const zIndex = nextZIndex;

    setNextZIndex(
      (value) => value + 1
    );

    setCookingGameWindow(
      (previous) =>
        previous
          ? {
            ...previous,
            zIndex,
          }
          : previous
    );
  };

  const moveCookingGame = (
    left: number,
    top: number
  ) => {
    setCookingGameWindow(
      (previous) =>
        previous
          ? {
            ...previous,
            left,
            top,
            centered: false,
          }
          : previous
    );
  };
  /*
   * =========================================================
   * SAVE NOTES WINDOW
   *
   * NotesApp calls this after the API successfully saves.
   *
   * This is important because Desktop owns the window state.
   * Without this callback, the database gets updated but
   * Desktop continues holding the old title/content.
   * =========================================================
   */

  const saveNotesWindow = (
    windowId: string,
    item: {
      id: string;
      name: string;
      content: string;
    }
  ) => {
    setNotesWindows(
      (previous) =>
        previous.map(
          (window) =>
            window.id === windowId
              ? {
                ...window,

                itemId: item.id,

                title: item.name,

                content: item.content,
              }
              : window
        )
    );
  };

  /*
   * =========================================================
   * OPEN NOTE FROM FILE EXPLORER
   * =========================================================
   */

  const openNote = (
    item: {
      id?: string;
      _id?: string;
      name: string;
      content?: string;
    }
  ) => {
    const itemId =
      item._id ??
      item.id;

    if (!itemId) {
      console.error(
        "Cannot open note: missing ID",
        item
      );

      return;
    }

    /*
     * If this note is already open,
     * focus its existing window.
     */

    const existing =
      notesWindows.find(
        (window) =>
          window.itemId ===
          itemId
      );

    if (existing) {
      focusNotes(existing.id);
      return;
    }

    /*
     * Maximum Notes windows.
     */

    if (
      notesWindows.length >=
      MAX_NOTES_WINDOWS
    ) {
      return;
    }

    const isFirst =
      notesWindows.length === 0;

    const position =
      isFirst
        ? {
          left: 0,
          top: 0,
        }
        : getNotesWindowPosition();

    const zIndex =
      nextZIndex;

    const newWindow: NotesWindow =
    {
      id:
        `notes-${Date.now()}-${Math.random()
          .toString(36)
          .slice(2, 10)}`,

      itemId,

      title:
        item.name,

      content:
        item.content ?? "",

      left:
        position.left,

      top:
        position.top,

      zIndex,

      centered:
        isFirst,
    };

    setNotesWindows(
      (previous) => [
        ...previous,
        newWindow,
      ]
    );

    setNextZIndex(
      (value) => value + 1
    );
  };

  /*
   * =========================================================
   * OPEN NEW EMPTY NOTE
   * =========================================================
   */

  const openNewNote = () => {
    /*
     * Don't allow more than 3 Notes windows.
     */

    if (
      notesWindows.length >=
      MAX_NOTES_WINDOWS
    ) {
      return;
    }

    const isFirst =
      notesWindows.length === 0;

    const position =
      isFirst
        ? {
          left: 0,
          top: 0,
        }
        : getNotesWindowPosition();

    const zIndex =
      nextZIndex;

    const newWindow: NotesWindow =
    {
      id:
        `notes-${Date.now()}-${Math.random()
          .toString(36)
          .slice(2, 10)}`,

      itemId:
        undefined,

      title:
        "Untitled",

      content:
        "",

      left:
        position.left,

      top:
        position.top,

      zIndex,

      centered:
        isFirst,
    };

    setNotesWindows(
      (previous) => [
        ...previous,
        newWindow,
      ]
    );

    setNextZIndex(
      (value) => value + 1
    );
  };

  /*
   * =========================================================
   * OPEN EXPLORER
   * =========================================================
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
   * CLOSE EXPLORER
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
   * FOCUS EXPLORER
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

  /*
   * =========================================================
   * MOVE EXPLORER
   * =========================================================
   */

  const moveExplorer = (
    id: string,
    left: number,
    top: number
  ) => {
    setExplorerWindows(
      (previous) =>
        previous.map(
          (window) =>
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
     */

    if (id === "files") {
      openExplorer("home");
      return;
    }

    /*
     * NOTES
     */

    if (id === "notes") {
      openNewNote();
      return;
    }

    /*
 * COOKING GAME
 */

    if (id === "cooking-game") {
      openCookingGame();
      return;
    }

    /*
     * RECYCLE BIN
     */

    if (id === "recycle") {
      openExplorer("recycle");
      return;
    }

    console.log(
      "Opening:",
      id
    );
  };

  /*
   * =========================================================
   * OPEN APPS FOR DOCK
   *
   * Notes was previously missing here.
   * =========================================================
   */

  const openApps: string[] = [];

  if (
    explorerWindows.length > 0
  ) {
    openApps.push("files");
  }

  if (
    notesWindows.length > 0
  ) {
    openApps.push("notes");
  }

  if (cookingGameWindow) {
    openApps.push("cooking-game");
  }

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
      {/* =====================================================
          MENU BAR
      ====================================================== */}

      <div
        style={{
          position:
            "relative",

          zIndex: 1000,
        }}
      >
        <MenuBar />
      </div>

      {/* =====================================================
          WALLPAPER
      ====================================================== */}

      <Wallpaper />

      {/* =====================================================
          EXPLORER WINDOWS
      ====================================================== */}

      {explorerWindows.map(
        (window) => (
          <FileExplorer
            key={
              window.id
            }

            initialLocation={
              window.location
            }

            onClose={() =>
              closeExplorer(
                window.id
              )
            }

            onMove={(
              left,
              top
            ) =>
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

            onOpenFile={
              openNote
            }
          />
        )
      )}

      {/* =====================================================
          NOTES WINDOWS
      ====================================================== */}

      {notesWindows.map(
        (window) => (
          <NotesApp
            key={
              window.id
            }

            itemId={
              window.itemId
            }

            initialTitle={
              window.title
            }

            initialContent={
              window.content
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
              focusNotes(
                window.id
              )
            }

            onClose={() =>
              closeNotes(
                window.id
              )
            }

            onMove={(
              left,
              top
            ) =>
              moveNotes(
                window.id,
                left,
                top
              )
            }

            /*
             * IMPORTANT:
             *
             * NotesApp saves to the database.
             * This callback synchronizes the
             * Desktop window with the saved DB data.
             */

            onSave={(savedItem) => {
              setNotesWindows(
                (previous) =>
                  previous.map(
                    (item) =>
                      item.id ===
                        window.id
                        ? {
                          ...item,

                          itemId:
                            savedItem.id,

                          title:
                            savedItem.name,

                          content:
                            savedItem.content,
                        }
                        : item
                  )
              );
            }}
          />
        )
      )}

      {/* =====================================================
          COOKING GAME WINDOW
      ====================================================== */}

      {cookingGameWindow && (
        <CookingGame
          onClose={
            closeCookingGame
          }

          onFocus={
            focusCookingGame
          }

          onMove={(
            left,
            top
          ) =>
            moveCookingGame(
              left,
              top
            )
          }

          windowPosition={{
            left:
              cookingGameWindow.left,

            top:
              cookingGameWindow.top,

            zIndex:
              cookingGameWindow.zIndex,

            centered:
              cookingGameWindow.centered,
          }}
        />
      )}

      {/* =====================================================
          DOCK
      ====================================================== */}

      <Dock
        openApps={
          openApps
        }

        onOpenApp={
          handleOpenApp
        }
      />
    </main>
  );
}
  