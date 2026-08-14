"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import backIcon from "@/assets/icons/explorer-arrow-back.svg";
import forwardIcon from "@/assets/icons/explorer-arrow-front.svg";
import upIcon from "@/assets/icons/explorer-arrow-up.svg";
import reloadIcon from "@/assets/icons/explorer-reload.svg";
import searchIcon from "@/assets/icons/explorer-search.svg";
import closeIcon from "@/assets/icons/explorer-close.svg";
import newTabIcon from "@/assets/icons/explorer-new-tab.svg";

import folderIcon from "@/assets/icons/file_explorer.png";
import fileIcon from "@/assets/icons/notes.png";
import recycleIcon from "@/assets/icons/recycle.png";

interface FileSystemItem {
  _id: string;
  name: string;
  type: "folder" | "file";
  parentId?: string | null;
}

interface ExplorerTab {
  id: string;
  folderId: string | null;
  title: string;
  isRecycleBin?: boolean;
}

interface FileExplorerProps {
  initialLocation?: "home" | "recycle";
  initialFolderId?: string | null;

  onClose?: () => void;

  onOpenFolder?: (
    folderId: string
  ) => void;

  windowPosition?: {
    left: number;
    top: number;
    zIndex: number;
  };

  onFocus?: () => void;
}

const ROOT_FOLDER_ID = null;

export default function FileExplorer({
  initialLocation = "home",
  initialFolderId = null,
  onClose,
  onOpenFolder,
  windowPosition = {
    left: 10,
    top: 10,
    zIndex: 30,
  },
  onFocus,
}: FileExplorerProps) {
  /*
   * =========================================================
   * STATE
   * =========================================================
   */

  const initialTabId =
    `tab-${Date.now()}-${Math.random()}`;

  const initialHistory =
    initialLocation === "recycle"
      ? []
      : initialFolderId
        ? [ROOT_FOLDER_ID, initialFolderId]
        : [ROOT_FOLDER_ID];

  const [tabs, setTabs] = useState<
    ExplorerTab[]
  >([
    {
      id: initialTabId,

      folderId:
        initialLocation === "recycle"
          ? null
          : initialFolderId,

      title:
        initialLocation === "recycle"
          ? "Recycle Bin"
          : initialFolderId
            ? "Folder"
            : "Home",

      isRecycleBin:
        initialLocation === "recycle",
    },
  ]);

  const [activeTabId, setActiveTabId] =
    useState(initialTabId);

  const [items, setItems] =
    useState<FileSystemItem[]>([]);

  const [selectedItem, setSelectedItem] =
    useState<string | null>(null);

  const [search, setSearch] =
    useState("");

  const [history, setHistory] =
    useState<(string | null)[]>(
      initialHistory
    );

  const [historyIndex, setHistoryIndex] =
    useState(
      initialHistory.length - 1
    );

  /*
   * =========================================================
   * ACTIVE TAB
   * =========================================================
   */

  const activeTab =
    tabs.find(
      (tab) =>
        tab.id === activeTabId
    ) ?? tabs[0];

  /*
   * =========================================================
   * LOAD FILESYSTEM
   * =========================================================
   */

  const loadItems = async () => {
    try {
      const response =
        await fetch(
          "/api/filesystem",
          {
            credentials:
              "include",
          }
        );

      const data =
        await response.json();

      if (
        response.ok &&
        data.success
      ) {
        setItems(
          data.items ?? []
        );
      }
    } catch (error) {
      console.error(
        "Failed to load filesystem:",
        error
      );
    }
  };

  useEffect(() => {
    loadItems();
  }, []);

  /*
   * =========================================================
   * TAB ICON
   * =========================================================
   */

  const getTabIcon = (
    tab: ExplorerTab
  ) => {
    if (
      tab.isRecycleBin
    ) {
      return recycleIcon;
    }

    return folderIcon;
  };

  /*
   * =========================================================
   * CURRENT ITEMS
   * =========================================================
   */

  const currentItems =
    useMemo(() => {
      if (!activeTab) {
        return [];
      }

      /*
       * Recycle Bin
       *
       * This will stay empty until deleted
       * filesystem items are connected to it.
       */

      if (
        activeTab.isRecycleBin
      ) {
        return [];
      }

      let result =
        items.filter(
          (item) =>
            (item.parentId ??
              null) ===
            (activeTab.folderId ??
              null)
        );

      /*
       * Search
       */

      if (
        search.trim()
      ) {
        const query =
          search
            .trim()
            .toLowerCase();

        result =
          result.filter(
            (item) =>
              item.name
                .toLowerCase()
                .includes(query)
          );
      }

      return result;
    }, [
      items,
      activeTab,
      search,
    ]);

  /*
   * =========================================================
   * CREATE NEW TAB
   * =========================================================
   */

  const createTab = () => {
    const id =
      `tab-${Date.now()}-${Math.random()}`;

    setTabs(
      (previous) => [
        ...previous,

        {
          id,

          folderId:
            ROOT_FOLDER_ID,

          title:
            "Home",

          isRecycleBin:
            false,
        },
      ]
    );

    setActiveTabId(id);

    setSelectedItem(null);

    setHistory([
      ROOT_FOLDER_ID,
    ]);

    setHistoryIndex(0);

    setSearch("");

    onFocus?.();
  };

  /*
   * =========================================================
   * CLOSE TAB
   * =========================================================
   */

  const closeTab = (
    id: string
  ) => {
    /*
     * If this is the only tab,
     * close the entire Explorer window.
     */

    if (
      tabs.length === 1
    ) {
      onClose?.();
      return;
    }

    const index =
      tabs.findIndex(
        (tab) =>
          tab.id === id
      );

    const remaining =
      tabs.filter(
        (tab) =>
          tab.id !== id
      );

    setTabs(
      remaining
    );

    if (
      id === activeTabId
    ) {
      const newIndex =
        Math.max(
          0,
          index - 1
        );

      setActiveTabId(
        remaining[
          newIndex
        ].id
      );
    }

    setSelectedItem(null);
  };

  /*
   * =========================================================
   * NAVIGATION
   * =========================================================
   */

  const navigateTo = (
    folderId: string | null
  ) => {
    if (
      !activeTab ||
      activeTab.isRecycleBin
    ) {
      return;
    }

    if (
      folderId ===
      activeTab.folderId
    ) {
      return;
    }

    /*
     * Remove forward history
     */

    const newHistory =
      history.slice(
        0,
        historyIndex + 1
      );

    newHistory.push(
      folderId
    );

    setHistory(
      newHistory
    );

    setHistoryIndex(
      newHistory.length - 1
    );

    const folder =
      folderId
        ? items.find(
          (item) =>
            item._id ===
            folderId
        )
        : null;

    setTabs(
      (previous) =>
        previous.map(
          (tab) =>
            tab.id ===
              activeTabId
              ? {
                ...tab,

                folderId,

                title:
                  folder?.name ??
                  "Home",

                isRecycleBin:
                  false,
              }
              : tab
        )
    );

    setSelectedItem(null);

    setSearch("");
  };

  /*
   * =========================================================
   * BACK
   * =========================================================
   */

  const goBack = () => {
    if (
      historyIndex <= 0
    ) {
      return;
    }

    const previousFolder =
      history[
      historyIndex - 1
      ] ?? ROOT_FOLDER_ID;

    setHistoryIndex(
      historyIndex - 1
    );

    const folder =
      previousFolder
        ? items.find(
          (item) =>
            item._id ===
            previousFolder
        )
        : null;

    setTabs(
      (previous) =>
        previous.map(
          (tab) =>
            tab.id ===
              activeTabId
              ? {
                ...tab,

                folderId:
                  previousFolder,

                title:
                  folder?.name ??
                  "Home",

                isRecycleBin:
                  false,
              }
              : tab
        )
    );

    setSelectedItem(null);

    setSearch("");
  };

  /*
   * =========================================================
   * FORWARD
   * =========================================================
   */

  const goForward = () => {
    if (
      historyIndex >=
      history.length - 1
    ) {
      return;
    }

    const nextFolder =
      history[
      historyIndex + 1
      ];

    setHistoryIndex(
      historyIndex + 1
    );

    const folder =
      nextFolder
        ? items.find(
          (item) =>
            item._id ===
            nextFolder
        )
        : null;

    setTabs(
      (previous) =>
        previous.map(
          (tab) =>
            tab.id ===
              activeTabId
              ? {
                ...tab,

                folderId:
                  nextFolder,

                title:
                  folder?.name ??
                  "Home",

                isRecycleBin:
                  false,
              }
              : tab
        )
    );

    setSelectedItem(null);

    setSearch("");
  };

  /*
   * =========================================================
   * UP
   * =========================================================
   */

  const goUp = () => {
    if (
      !activeTab ||
      activeTab.isRecycleBin ||
      activeTab.folderId ===
      null
    ) {
      return;
    }

    const currentFolder =
      items.find(
        (item) =>
          item._id ===
          activeTab.folderId
      );

    navigateTo(
      currentFolder?.parentId ??
      null
    );
  };

  /*
   * =========================================================
   * SINGLE CLICK
   * =========================================================
   */

  const handleItemClick = (
    item: FileSystemItem
  ) => {
    setSelectedItem(
      item._id
    );
  };

  /*
   * =========================================================
   * DOUBLE CLICK
   * =========================================================
   */

  const handleItemDoubleClick = (
    item: FileSystemItem
  ) => {
    if (
      item.type !==
      "folder"
    ) {
      return;
    }

    /*
     * Desktop can create a completely
     * separate Explorer window.
     */

    if (
      onOpenFolder
    ) {
      onOpenFolder(
        item._id
      );

      return;
    }

    /*
     * Fallback:
     * navigate inside this window.
     */

    navigateTo(
      item._id
    );
  };

  /*
   * =========================================================
   * BREADCRUMBS
   * =========================================================
   */

  const breadcrumbs =
    useMemo(() => {
      if (
        !activeTab ||
        activeTab.isRecycleBin
      ) {
        return [];
      }

      const path: FileSystemItem[] =
        [];

      let currentId =
        activeTab.folderId;

      while (
        currentId
      ) {
        const folder =
          items.find(
            (item) =>
              item._id ===
              currentId
          );

        if (!folder) {
          break;
        }

        path.unshift(
          folder
        );

        currentId =
          folder.parentId ??
          null;
      }

      return path;
    }, [
      activeTab,
      items,
    ]);

  if (!activeTab) {
    return null;
  }

  /*
   * =========================================================
   * RENDER
   * =========================================================
   */

  return (
    <div
      onMouseDown={() => {
        onFocus?.();
      }}
      style={{
        position:
          "fixed",

        left:
          `${windowPosition.left}vw`,

        top:
          `${windowPosition.top}vh`,

        width:
          "min(1100px, 88vw)",

        height:
          "min(680px, 72vh)",

        /*
         * DARK TRANSPARENT WINDOW
         */

        background:
          "rgba(18, 18, 18, 0.90)",

        color:
          "#e5e5e5",

        border:
          "1px solid rgba(255,255,255,0.12)",

        borderRadius:
          "10px",

        overflow:
          "hidden",

        boxShadow:
          "0 22px 60px rgba(0,0,0,0.48)",

        backdropFilter:
          "blur(24px) saturate(140%)",

        WebkitBackdropFilter:
          "blur(24px) saturate(140%)",

        fontFamily:
          "Inter, Arial, sans-serif",

        zIndex:
          windowPosition.zIndex,

        display:
          "flex",

        flexDirection:
          "column",

        userSelect:
          "none",
      }}
    >

      {/* =====================================================
          WINDOW CLOSE BUTTON
      ====================================================== */}

      <button
        onMouseDown={(
          event
        ) => {
          event.preventDefault();
          event.stopPropagation();
        }}
        onClick={(
          event
        ) => {
          event.preventDefault();
          event.stopPropagation();

          onClose?.();
        }}
        aria-label="Close window"
        style={{
          position:
            "absolute",

          top: 0,
          right: 0,

          width:
            "58px",

          height:
            "40px",

          border: 0,

          borderRadius:
            "0 10px 0 0",

          background:
            "rgba(15,15,15,0.90)",

          display:
            "flex",

          alignItems:
            "center",

          justifyContent:
            "center",

          cursor:
            "pointer",

          padding: 0,

          zIndex: 100,
        }}
        onMouseEnter={(
          event
        ) => {
          event.currentTarget.style.background =
            "#e81123";
        }}
        onMouseLeave={(
          event
        ) => {
          event.currentTarget.style.background =
            "rgba(15,15,15,0.90)";
        }}
      >
        <img
          src={
            typeof closeIcon ===
              "string"
              ? closeIcon
              : closeIcon.src
          }
          alt="Close"
          style={{
            width:
              "16px",

            height:
              "16px",

            filter:
              "brightness(0) invert(1)",
          }}
        />
      </button>

      {/* =====================================================
          TABS
      ====================================================== */}

      <div
        style={{
          height:
            "48px",

          display:
            "flex",

          alignItems:
            "flex-end",

          background:
            "rgba(12,12,12,0.72)",

          borderBottom:
            "1px solid rgba(255,255,255,0.10)",

          paddingLeft:
            "10px",

          paddingRight:
            "62px",

          overflow:
            "hidden",
        }}
        onClick={(
          event
        ) => {
          event.stopPropagation();
        }}
      >
        {tabs.map(
          (tab) => {
            const isActive =
              tab.id ===
              activeTabId;

            const icon =
              getTabIcon(
                tab
              );

            return (
              <div
                key={
                  tab.id
                }
                onMouseDown={(
                  event
                ) => {
                  event.preventDefault();
                  event.stopPropagation();

                  onFocus?.();
                }}
                onClick={(
                  event
                ) => {
                  event.stopPropagation();

                  setActiveTabId(
                    tab.id
                  );

                  setSelectedItem(
                    null
                  );
                }}
                style={{
                  height:
                    "38px",

                  minWidth:
                    "180px",

                  maxWidth:
                    "230px",

                  display:
                    "flex",

                  alignItems:
                    "center",

                  gap:
                    "9px",

                  padding:
                    "0 10px",

                  background:
                    isActive
                      ? "rgba(32,32,32,0.96)"
                      : "rgba(20,20,20,0.62)",

                  border:
                    "1px solid rgba(255,255,255,0.10)",

                  borderBottom:
                    isActive
                      ? "1px solid rgba(32,32,32,0.96)"
                      : "1px solid rgba(255,255,255,0.10)",

                  borderRadius:
                    "7px 7px 0 0",

                  cursor:
                    "pointer",

                  userSelect:
                    "none",
                }}
              >
                <img
                  src={
                    typeof icon ===
                      "string"
                      ? icon
                      : icon.src
                  }
                  alt=""
                  style={{
                    width:
                      "21px",

                    height:
                      "21px",

                    objectFit:
                      "contain",

                    flexShrink:
                      0,
                  }}
                />

                <span
                  style={{
                    flex:
                      1,

                    overflow:
                      "hidden",

                    whiteSpace:
                      "nowrap",

                    textOverflow:
                      "ellipsis",

                    fontSize:
                      "14px",

                    color:
                      "#e5e5e5",
                  }}
                >
                  {
                    tab.title
                  }
                </span>

                <button
                  onMouseDown={(
                    event
                  ) => {
                    event.preventDefault();
                    event.stopPropagation();
                  }}
                  onClick={(
                    event
                  ) => {
                    event.preventDefault();
                    event.stopPropagation();

                    closeTab(
                      tab.id
                    );
                  }}
                  aria-label="Close tab"
                  style={{
                    width:
                      "24px",

                    height:
                      "24px",

                    border:
                      0,

                    background:
                      "transparent",

                    borderRadius:
                      "5px",

                    display:
                      "flex",

                    alignItems:
                      "center",

                    justifyContent:
                      "center",

                    cursor:
                      "pointer",

                    padding: 0,

                    flexShrink:
                      0,
                  }}
                  onMouseEnter={(
                    event
                  ) => {
                    event.currentTarget.style.background =
                      "#d9363e";
                  }}
                  onMouseLeave={(
                    event
                  ) => {
                    event.currentTarget.style.background =
                      "transparent";
                  }}
                >
                  <img
                    src={
                      typeof closeIcon ===
                        "string"
                        ? closeIcon
                        : closeIcon.src
                    }
                    alt=""
                    style={{
                      width:
                        "13px",

                      height:
                        "13px",

                      filter:
                        "brightness(0) invert(1)",
                    }}
                  />
                </button>
              </div>
            );
          }
        )}

        {/* ===================================================
            NEW TAB
        ==================================================== */}

        <button
          onMouseDown={(
            event
          ) => {
            event.preventDefault();
            event.stopPropagation();
          }}
          onClick={(
            event
          ) => {
            event.preventDefault();
            event.stopPropagation();

            createTab();
          }}
          aria-label="New tab"
          style={{
            width:
              "38px",

            height:
              "38px",

            marginLeft:
              "4px",

            border:
              0,

            background:
              "transparent",

            display:
              "flex",

            alignItems:
              "center",

            justifyContent:
              "center",

            cursor:
              "pointer",

            borderRadius:
              "6px",

            padding: 0,

            flexShrink:
              0,
          }}
          onMouseEnter={(
            event
          ) => {
            event.currentTarget.style.background =
              "rgba(255,255,255,0.10)";
          }}
          onMouseLeave={(
            event
          ) => {
            event.currentTarget.style.background =
              "transparent";
          }}
        >
          <img
            src={
              typeof newTabIcon ===
                "string"
                ? newTabIcon
                : newTabIcon.src
            }
            alt="New tab"
            style={{
              width:
                "18px",

              height:
                "18px",

              filter:
                "brightness(0) invert(1)",
            }}
          />
        </button>
      </div>

      {/* =====================================================
          TOOLBAR
      ====================================================== */}

      <div
        style={{
          height:
            "58px",

          display:
            "flex",

          alignItems:
            "center",

          gap:
            "4px",

          padding:
            "0 14px",

          background:
            "rgba(30,30,30,0.82)",

          borderBottom:
            "1px solid rgba(255,255,255,0.10)",

          flexShrink:
            0,
        }}
        onClick={(
          event
        ) => {
          event.stopPropagation();
        }}
      >

        <ToolbarButton
          icon={
            backIcon
          }
          label="Back"
          disabled={
            historyIndex <= 0
          }
          onClick={
            goBack
          }
          dark
        />

        <ToolbarButton
          icon={
            forwardIcon
          }
          label="Forward"
          disabled={
            historyIndex >=
            history.length - 1
          }
          onClick={
            goForward
          }
          dark
        />

        <ToolbarButton
          icon={
            upIcon
          }
          label="Up"
          disabled={
            activeTab.isRecycleBin ||
            activeTab.folderId ===
            null
          }
          onClick={
            goUp
          }
          dark
        />

        <ToolbarButton
          icon={
            reloadIcon
          }
          label="Reload"
          onClick={
            loadItems
          }
          dark
        />

        {/* =================================================
            PATH
        ================================================== */}

        <div
          style={{
            flex:
              1,

            height:
              "38px",

            display:
              "flex",

            alignItems:
              "center",

            padding:
              "0 12px",

            background:
              "rgba(0,0,0,0.34)",

            border:
              "1px solid rgba(255,255,255,0.12)",

            borderRadius:
              "7px",

            marginLeft:
              "8px",

            overflow:
              "hidden",

            minWidth:
              0,
          }}
        >
          <img
            src={
              typeof getTabIcon(
                activeTab
              ) === "string"
                ? getTabIcon(
                  activeTab
                )
                : getTabIcon(
                  activeTab
                ).src
            }
            alt=""
            style={{
              width:
                "19px",

              height:
                "19px",

              objectFit:
                "contain",

              marginRight:
                "8px",

              flexShrink:
                0,
            }}
          />

          <span
            style={{
              display:
                "flex",

              alignItems:
                "center",

              overflow:
                "hidden",

              whiteSpace:
                "nowrap",

              textOverflow:
                "ellipsis",

              fontSize:
                "14px",

              color:
                "#e5e5e5",
            }}
          >
            <span>
              {activeTab.isRecycleBin
                ? "Recycle Bin"
                : "Home"}
            </span>

            {!activeTab.isRecycleBin &&
              breadcrumbs.map(
                (
                  folder
                ) => (
                  <span
                    key={
                      folder._id
                    }
                    style={{
                      display:
                        "flex",

                      alignItems:
                        "center",

                      flexShrink:
                        0,
                    }}
                  >
                    <span
                      style={{
                        margin:
                          "0 8px",

                        color:
                          "#777",
                      }}
                    >
                      ›
                    </span>

                    <span>
                      {
                        folder.name
                      }
                    </span>
                  </span>
                )
              )}
          </span>
        </div>

        {/* =================================================
            SEARCH
        ================================================== */}

        <div
          style={{
            width:
              "220px",

            height:
              "38px",

            display:
              "flex",

            alignItems:
              "center",

            background:
              "rgba(0,0,0,0.34)",

            border:
              "1px solid rgba(255,255,255,0.12)",

            borderRadius:
              "7px",

            marginLeft:
              "8px",

            padding:
              "0 10px",

            flexShrink:
              0,
          }}
        >
          <img
            src={
              typeof searchIcon ===
                "string"
                ? searchIcon
                : searchIcon.src
            }
            alt=""
            style={{
              width:
                "17px",

              height:
                "17px",

              marginRight:
                "8px",

              opacity:
                0.75,

              filter:
                "brightness(0) invert(1)",
            }}
          />

          <input
            type="text"
            placeholder="Search"
            value={
              search
            }
            onChange={(
              event
            ) =>
              setSearch(
                event.target
                  .value
              )
            }
            onMouseDown={(
              event
            ) => {
              event.stopPropagation();
            }}
            style={{
              width:
                "100%",

              border:
                0,

              outline:
                "none",

              background:
                "transparent",

              fontFamily:
                "Inter, Arial, sans-serif",

              fontSize:
                "14px",

              color:
                "#ffffff",
            }}
          />
        </div>
      </div>

      {/* =====================================================
          FILE AREA
      ====================================================== */}

      <div
        style={{
          flex:
            1,

          overflowY:
            "auto",

          padding:
            "22px",

          minHeight:
            0,
        }}
        onMouseDown={(
          event
        ) => {
          /*
           * Only clear selection when clicking
           * the actual empty content area.
           */
          if (
            event.target ===
            event.currentTarget
          ) {
            event.preventDefault();

            setSelectedItem(
              null
            );
          }
        }}
        onClick={(
          event
        ) => {
          if (
            event.target ===
            event.currentTarget
          ) {
            setSelectedItem(
              null
            );
          }
        }}
      >
        <div
          style={{
            display:
              "grid",

            gridTemplateColumns:
              "repeat(auto-fill, minmax(130px, 1fr))",

            gap:
              "8px",

            alignContent:
              "start",
          }}
        >
          {currentItems.map(
            (item) => {
              const isSelected =
                selectedItem ===
                item._id;

              const icon =
                item.type ===
                  "folder"
                  ? folderIcon
                  : fileIcon;

              return (
                <div
                  key={
                    item._id
                  }
                  onMouseDown={(
                    event
                  ) => {
                    /*
                     * VERY IMPORTANT:
                     *
                     * This prevents the browser from
                     * selecting all the Explorer contents.
                     */

                    event.preventDefault();

                    event.stopPropagation();

                    onFocus?.();
                  }}
                  onClick={(
                    event
                  ) => {
                    event.preventDefault();

                    event.stopPropagation();

                    handleItemClick(
                      item
                    );
                  }}
                  onDoubleClick={(
                    event
                  ) => {
                    event.preventDefault();

                    event.stopPropagation();

                    handleItemDoubleClick(
                      item
                    );
                  }}
                  style={{
                    height:
                      "130px",

                    display:
                      "flex",

                    flexDirection:
                      "column",

                    alignItems:
                      "center",

                    justifyContent:
                      "center",

                    borderRadius:
                      "7px",

                    background:
                      isSelected
                        ? "rgba(255,255,255,0.14)"
                        : "transparent",

                    border:
                      isSelected
                        ? "1px solid rgba(255,255,255,0.10)"
                        : "1px solid transparent",

                    cursor:
                      "pointer",

                    userSelect:
                      "none",

                    WebkitUserSelect:
                      "none",

                    transition:
                      "background 100ms ease, border 100ms ease",
                  }}
                >
                  <img
                    src={
                      typeof icon ===
                        "string"
                        ? icon
                        : icon.src
                    }
                    alt=""
                    draggable={
                      false
                    }
                    style={{
                      width:
                        "72px",

                      height:
                        "72px",

                      objectFit:
                        "contain",

                      marginBottom:
                        "8px",

                      pointerEvents:
                        "none",
                    }}
                  />

                  <span
                    style={{
                      maxWidth:
                        "115px",

                      overflow:
                        "hidden",

                      whiteSpace:
                        "nowrap",

                      textOverflow:
                        "ellipsis",

                      fontSize:
                        "15px",

                      textAlign:
                        "center",

                      color:
                        "#e5e5e5",

                      pointerEvents:
                        "none",
                    }}
                  >
                    {
                      item.name
                    }
                  </span>
                </div>
              );
            }
          )}
        </div>

        {/* =================================================
            EMPTY STATES
        ================================================== */}

        {activeTab.isRecycleBin &&
          currentItems.length ===
          0 && (
            <EmptyState
              dark
            >
              Recycle Bin is empty
            </EmptyState>
          )}

        {!activeTab.isRecycleBin &&
          currentItems.length ===
          0 && (
            <EmptyState
              dark
            >
              This folder is empty
            </EmptyState>
          )}
      </div>
    </div>
  );
}

/*
 * =========================================================
 * TOOLBAR BUTTON
 * =========================================================
 */

interface ToolbarButtonProps {
  icon: any;
  label: string;
  disabled?: boolean;
  onClick: () => void;
  dark?: boolean;
}

function ToolbarButton({
  icon,
  label,
  disabled = false,
  onClick,
  dark = false,
}: ToolbarButtonProps) {
  return (
    <button
      onMouseDown={(
        event
      ) => {
        event.preventDefault();
        event.stopPropagation();
      }}
      onClick={(
        event
      ) => {
        event.preventDefault();
        event.stopPropagation();

        onClick();
      }}
      disabled={
        disabled
      }
      aria-label={
        label
      }
      title={
        label
      }
      style={{
        width:
          "38px",

        height:
          "38px",

        border:
          0,

        background:
          "transparent",

        borderRadius:
          "6px",

        display:
          "flex",

        alignItems:
          "center",

        justifyContent:
          "center",

        cursor:
          disabled
            ? "default"
            : "pointer",

        opacity:
          disabled
            ? 0.30
            : 1,

        padding: 0,

        flexShrink:
          0,
      }}
      onMouseEnter={(
        event
      ) => {
        if (
          !disabled
        ) {
          event.currentTarget.style.background =
            dark
              ? "rgba(255,255,255,0.10)"
              : "rgba(0,0,0,0.08)";
        }
      }}
      onMouseLeave={(
        event
      ) => {
        event.currentTarget.style.background =
          "transparent";
      }}
    >
      <img
        src={
          typeof icon ===
            "string"
            ? icon
            : icon.src
        }
        alt=""
        style={{
          width:
            "18px",

          height:
            "18px",

          objectFit:
            "contain",

          filter:
            dark
              ? "brightness(0) invert(1)"
              : "none",
        }}
      />
    </button>
  );
}

/*
 * =========================================================
 * EMPTY STATE
 * =========================================================
 */

function EmptyState({
  children,
  dark = false,
}: {
  children: React.ReactNode;
  dark?: boolean;
}) {
  return (
    <div
      style={{
        width:
          "100%",

        height:
          "calc(100% - 20px)",

        minHeight:
          "300px",

        display:
          "flex",

        alignItems:
          "center",

        justifyContent:
          "center",

        color:
          dark
            ? "#777"
            : "#888",

        fontSize:
          "14px",

        pointerEvents:
          "none",
      }}
    >
      {children}
    </div>
  );
}