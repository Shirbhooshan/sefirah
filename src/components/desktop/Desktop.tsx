"use client";

import { useState } from "react";

import MenuBar from "./MenuBar";
import Dock from "./Dock";
import Wallpaper from "./Wallpaper";

import FileExplorer from "@/components/filesystem/FileExplorer";
import NotesApp from "@/components/notes/NotesApp";
import CookingGame from "@/components/game/cooking-game/CookingGame";
import DSALab from "@/components/game/labs/dsa/DSALab";
import DevOpsLab from "@/components/game/labs/devops/DevOpsLab";

/*
 * =========================================================
 * EXPLORER WINDOW
 * =========================================================
 */

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

/*
 * =========================================================
 * NOTES WINDOW
 * =========================================================
 */

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

/*
 * =========================================================
 * COOKING GAME WINDOW
 * =========================================================
 */

interface CookingGameWindow {
  id: string;

  left: number;
  top: number;

  zIndex: number;

  centered: boolean;
}

/*
 * =========================================================
 * DSA LAB WINDOW
 * =========================================================
 */

interface DSALabWindow {
  id: string;

  left: number;
  top: number;

  zIndex: number;

  centered: boolean;
}

/*
 * =========================================================
 * Dev Ops LAB WINDOW
 * =========================================================
 */

interface DevOpsLabWindow {
  id: string;

  left: number;
  top: number;

  zIndex: number;

  centered: boolean;
}

/*
 * =========================================================
 * LIMITS
 * =========================================================
 */

const MAX_WINDOWS = 5;
const MAX_NOTES_WINDOWS = 3;

/*
 * =========================================================
 * DESKTOP
 * =========================================================
 */

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
  ] = useState<CookingGameWindow | null>(null);

  /*
   * =========================================================
   * DSA LAB WINDOW
   *
   * Only one DSA Lab window is allowed.
   * =========================================================
   */

  const [
    dsaLabWindow,
    setDSALabWindow,
  ] =
    useState<DSALabWindow | null>(
      null
    );

  /*
* =========================================================
* DevOps LAB WINDOW
*
* Only one DevOps Lab window is allowed.
* =========================================================
*/

  const [
    devOpsLabWindow,
    setDevOpsLabWindow,
  ] =
    useState<DevOpsLabWindow | null>(
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
   * EXPLORER WINDOW POSITION
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

  /*
   * =========================================================
   * NOTES WINDOW POSITION
   * =========================================================
   */

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
   * NOTES
   * =========================================================
   */

  const focusNotes = (
    id: string
  ) => {

    const zIndex = nextZIndex;

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
   * OPEN NOTE
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
     * Already open.
     */

    const existing =
      notesWindows.find(
        (window) =>
          window.itemId === itemId
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

    const newWindow: NotesWindow = {

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
   * OPEN NEW NOTE
   * =========================================================
   */

  const openNewNote = () => {

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

    const newWindow: NotesWindow = {

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

    const newWindow: ExplorerWindow = {

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
   * COOKING GAME
   * =========================================================
   */

  const openCookingGame = () => {

    /*
     * Already open:
     * focus it instead.
     */

    if (cookingGameWindow) {

      const zIndex =
        nextZIndex;

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

    const zIndex =
      nextZIndex;

    const newWindow: CookingGameWindow = {

      id:
        `cooking-game-${Date.now()}`,

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

    const zIndex =
      nextZIndex;

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
   * DSA LAB
   *
   * Only one DSA Lab window is allowed.
   * =========================================================
   */

  const openDSALab = () => {
    /*
     * Already open:
     * bring existing window to front.
     */
    if (dsaLabWindow) {
      const zIndex = nextZIndex;

      setNextZIndex(
        (value) => value + 1
      );

      setDSALabWindow(
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

    const newWindow: DSALabWindow = {
      id: `dsa-lab-${Date.now()}`,

      left: 0,
      top: 0,

      zIndex,

      centered: true,
    };

    setDSALabWindow(newWindow);

    setNextZIndex(
      (value) => value + 1
    );
  };


  const closeDSALab = () => {
    setDSALabWindow(null);
  };


  const focusDSALab = () => {
    if (!dsaLabWindow) {
      return;
    }

    const zIndex = nextZIndex;

    setNextZIndex(
      (value) => value + 1
    );

    setDSALabWindow(
      (previous) =>
        previous
          ? {
            ...previous,
            zIndex,
          }
          : previous
    );
  };

  const moveDSALab = (
    left: number,
    top: number
  ) => {
    setDSALabWindow(
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
  * DevOps LAB
  *
  * Only one Dev Ops Lab window is allowed.
  * =========================================================
  */

  const openDevOpsLab = () => {
    /*
     * Already open:
     * bring existing window to front.
     */
    if (devOpsLabWindow) {
      const zIndex = nextZIndex;

      setNextZIndex(
        (value) => value + 1
      );

      setDevOpsLabWindow(
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

    const newWindow: DevOpsLabWindow = {
      id: `dev-ops-lab-${Date.now()}`,

      left: 0,
      top: 0,

      zIndex,

      centered: true,
    };

    setDevOpsLabWindow(newWindow);

    setNextZIndex(
      (value) => value + 1
    );
  };


  const closeDevOpsLab = () => {
    setDevOpsLabWindow(null);
  };


  const focusDevOpsLab = () => {
    if (!devOpsLabWindow) {
      return;
    }

    const zIndex = nextZIndex;

    setNextZIndex(
      (value) => value + 1
    );

    setDevOpsLabWindow(
      (previous) =>
        previous
          ? {
            ...previous,
            zIndex,
          }
          : previous
    );
  };

  const moveDevOpsLab = (
    left: number,
    top: number
  ) => {
    setDevOpsLabWindow(
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
     * DSA LAB
     *
     * This replaces the old Settings app.
     */

    if (id === "dsa") {

      openDSALab();

      return;
    }

    /*
 * Dev Ops LAB
 *
 * This replaces the old Settings app.
 */

    if (id === "devops") {

      openDevOpsLab();

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
   * OPEN APPS
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

  if (dsaLabWindow) {

    openApps.push("dsa");
  }

  if (devOpsLabWindow) {

    openApps.push("devops");
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

          zIndex:
            1000,
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
    DSA LAB WINDOW
====================================================== */}

      {dsaLabWindow && (
        <DSALab
          onClose={
            closeDSALab
          }

          onFocus={
            focusDSALab
          }

          onMove={(
            left,
            top
          ) =>
            moveDSALab(
              left,
              top
            )
          }

          windowPosition={{
            left:
              dsaLabWindow.left,

            top:
              dsaLabWindow.top,

            zIndex:
              dsaLabWindow.zIndex,

            centered:
              dsaLabWindow.centered,
          }}
        />
      )}

      {/* =====================================================
    DEVOPS LAB WINDOW
===================================================== */}

      {devOpsLabWindow && (
        <DevOpsLab
          onClose={
            closeDevOpsLab
          }

          onFocus={
            focusDevOpsLab
          }

          onMove={(
            left,
            top
          ) =>
            moveDevOpsLab(
              left,
              top
            )
          }

          windowPosition={{
            left:
              devOpsLabWindow.left,

            top:
              devOpsLabWindow.top,

            zIndex:
              devOpsLabWindow.zIndex,

            centered:
              devOpsLabWindow.centered,
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

