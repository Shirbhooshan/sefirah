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
  _id?: string;
  id?: string;
  name: string;
  type: "folder" | "file";
  parentId?: string | null;
}

interface ExplorerTab {
  id: string;
  folderId: string | null;
  title: string;
  isRecycleBin: boolean;

  history: (string | null)[];
  historyIndex: number;
}

interface FileExplorerProps {
  initialLocation?: "home" | "recycle";
  initialFolderId?: string | null;

  onClose?: () => void;

  windowPosition?: {
    left: number;
    top: number;
    zIndex: number;
    centered?: boolean;
  };

  onFocus?: () => void;
}

const ROOT_FOLDER_ID = null;

function createTabId() {
  return `tab-${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 10)}`;
}

export default function FileExplorer({
  initialLocation = "home",
  initialFolderId = null,
  onClose,
  windowPosition = {
    left: 10,
    top: 10,
    zIndex: 30,
    centered: false,
  },
  onFocus,
}: FileExplorerProps) {
  /*
   * =========================================================
   * INITIAL TAB
   * =========================================================
   */

  const [tabs, setTabs] = useState<ExplorerTab[]>(() => {
    const isRecycleBin =
      initialLocation === "recycle";

    const startingHistory = isRecycleBin
      ? []
      : initialFolderId
        ? [ROOT_FOLDER_ID, initialFolderId]
        : [ROOT_FOLDER_ID];

    return [
      {
        id: createTabId(),

        folderId: isRecycleBin
          ? null
          : initialFolderId,

        title: isRecycleBin
          ? "Recycle Bin"
          : initialFolderId
            ? "Folder"
            : "Home",

        isRecycleBin,

        history: startingHistory,

        historyIndex:
          startingHistory.length - 1,
      },
    ];
  });

  const [activeTabId, setActiveTabId] =
    useState(() => tabs[0]?.id);

  const [items, setItems] =
    useState<FileSystemItem[]>([]);

  const [selectedItem, setSelectedItem] =
    useState<string | null>(null);

  const [search, setSearch] =
    useState("");

  /*
   * =========================================================
   * ACTIVE TAB
   * =========================================================
   */

  const activeTab =
    tabs.find(
      (tab) => tab.id === activeTabId
    ) ?? tabs[0];

  /*
   * =========================================================
   * LOAD FILESYSTEM
   * =========================================================
   */

  const loadItems = async () => {
    try {
      const response = await fetch(
        "/api/filesystem",
        {
          credentials: "include",
        }
      );

      const data = await response.json();

      if (response.ok && data.success) {
        const normalizedItems: FileSystemItem[] =
          (data.items ?? [])
            .map((item: any) => {
              const id =
                item._id?.toString() ??
                item.id?.toString();

              if (!id) {
                console.warn(
                  "Filesystem item has no ID:",
                  item
                );
                return null;
              }

              return {
                ...item,
                _id: id,
              };
            })
            .filter(
              (
                item
              ): item is FileSystemItem =>
                item !== null
            );

        setItems(normalizedItems);
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
    if (tab.isRecycleBin) {
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
       */

      if (activeTab.isRecycleBin) {
        return [];
      }

      let result =
        items.filter(
          (item) =>
            (item.parentId ?? null) ===
            (activeTab.folderId ?? null)
        );

      /*
       * SEARCH
       */

      if (search.trim()) {
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
      createTabId();

    const newTab: ExplorerTab = {
      id,

      folderId:
        ROOT_FOLDER_ID,

      title:
        "Home",

      isRecycleBin:
        false,

      history: [
        ROOT_FOLDER_ID,
      ],

      historyIndex: 0,
    };

    setTabs(
      (previous) => [
        ...previous,
        newTab,
      ]
    );

    setActiveTabId(id);

    setSelectedItem(null);

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

    if (tabs.length === 1) {
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

    if (id === activeTabId) {
      const newIndex =
        Math.max(
          0,
          index - 1
        );

      setActiveTabId(
        remaining[newIndex].id
      );
    }

    setSelectedItem(null);
  };

  /*
   * =========================================================
   * UPDATE ACTIVE TAB
   * =========================================================
   */

  const updateActiveTab = (
    updater: (
      tab: ExplorerTab
    ) => ExplorerTab
  ) => {
    setTabs(
      (previous) =>
        previous.map(
          (tab) =>
            tab.id === activeTabId
              ? updater(tab)
              : tab
        )
    );
  };

  /*
   * =========================================================
   * NAVIGATE TO FOLDER
   * =========================================================
   *
   * IMPORTANT:
   * This changes the CURRENT WINDOW.
   *
   * It does NOT create a new Explorer window.
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
      folderId === activeTab.folderId
    ) {
      return;
    }

    const newHistory =
      activeTab.history.slice(
        0,
        activeTab.historyIndex + 1
      );

    newHistory.push(folderId);

    const folder = folderId
      ? items.find(
        (item) =>
          (item._id ?? item.id) === folderId
      )
      : null;

    setTabs((previous) =>
      previous.map((tab) =>
        tab.id === activeTabId
          ? {
            ...tab,
            folderId,
            title:
              folder?.name ??
              "Home",
            isRecycleBin: false,
            history: newHistory,
            historyIndex:
              newHistory.length - 1,
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
      !activeTab ||
      activeTab.historyIndex <= 0
    ) {
      return;
    }

    const newIndex =
      activeTab.historyIndex - 1;

    const previousFolder =
      activeTab.history[
      newIndex
      ] ?? ROOT_FOLDER_ID;

    const folder =
      previousFolder
        ? items.find(
          (item) =>
            (item._id ?? item.id) ===
            previousFolder
        )
        : null;

    updateActiveTab(
      (tab) => ({
        ...tab,

        folderId:
          previousFolder,

        title:
          folder?.name ??
          "Home",

        isRecycleBin:
          false,

        historyIndex:
          newIndex,
      })
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
      !activeTab ||
      activeTab.historyIndex >=
      activeTab.history.length - 1
    ) {
      return;
    }

    const newIndex =
      activeTab.historyIndex + 1;

    const nextFolder =
      activeTab.history[
      newIndex
      ];

    const folder =
      nextFolder
        ? items.find(
          (item) =>
            (item._id ?? item.id) ===
            nextFolder
        )
        : null;

    updateActiveTab(
      (tab) => ({
        ...tab,

        folderId:
          nextFolder,

        title:
          folder?.name ??
          "Home",

        isRecycleBin:
          false,

        historyIndex:
          newIndex,
      })
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
      activeTab.folderId === null
    ) {
      return;
    }

    const currentFolder =
      items.find(
        (item) =>
          (item._id ?? item.id) ===
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
   *
   * Only selects the clicked item.
   */

  const handleItemClick = (
    item: FileSystemItem
  ) => {
    const itemId = item._id;

    if (!itemId) {
      return;
    }

    setSelectedItem(itemId);
  };

  /*
   * =========================================================
   * DOUBLE CLICK
   * =========================================================
   *
   * FOLDER:
   * Navigate inside the SAME Explorer window.
   *
   * FILE:
   * Nothing yet.
   */

  const handleItemDoubleClick = (
    item: FileSystemItem
  ) => {
    if (item.type !== "folder") {
      return;
    }

    const folderId = item._id ?? item.id;

    if (!folderId) {
      console.error(
        "Cannot open folder: folder has no ID",
        item
      );
      return;
    }

    /*
     * IMPORTANT:
     * Opening a folder changes the CURRENT
     * Explorer window.
     *
     * It does NOT create another window.
     */
    navigateTo(folderId);
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

      while (currentId) {
        const folder =
          items.find(
            (item) =>
              (item._id ?? item.id) ===
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
   * WINDOW POSITION
   * =========================================================
   */

  const windowStyle: React.CSSProperties =
  {
    position: "fixed",

    left:
      windowPosition.centered
        ? "50%"
        : `${windowPosition.left}vw`,

    top:
      windowPosition.centered
        ? "50%"
        : `${windowPosition.top}vh`,

    transform:
      windowPosition.centered
        ? "translate(-50%, -50%)"
        : "none",

    width:
      "min(1100px, 88vw)",

    height:
      "min(680px, 72vh)",

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

    WebkitUserSelect:
      "none",
  };

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
      style={
        windowStyle
      }
    >
      {/* =====================================================
          WINDOW CLOSE BUTTON
      ====================================================== */}

      <button
        onMouseDown={(event) => {
          event.preventDefault();
          event.stopPropagation();
        }}
        onClick={(event) => {
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
            "64px",

          height:
            "44px",

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
        onMouseEnter={(event) => {
          event.currentTarget.style.background =
            "#e81123";
        }}
        onMouseLeave={(event) => {
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
              "20px",

            height:
              "20px",

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
        onClick={(event) => {
          event.stopPropagation();
        }}
      >
        {tabs.map((tab) => {
          const isActive =
            tab.id ===
            activeTabId;

          const icon =
            getTabIcon(tab);

          return (
            <div
              key={tab.id}
              onMouseDown={(event) => {
                event.preventDefault();
                event.stopPropagation();

                onFocus?.();
              }}
              onClick={(event) => {
                event.stopPropagation();

                setActiveTabId(
                  tab.id
                );

                setSelectedItem(
                  null
                );

                setSearch("");
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
                draggable={
                  false
                }
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
                  flex: 1,

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
                {tab.title}
              </span>

              <button
                onMouseDown={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                }}
                onClick={(event) => {
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
                onMouseEnter={(event) => {
                  event.currentTarget.style.background =
                    "#d9363e";
                }}
                onMouseLeave={(event) => {
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
                  draggable={
                    false
                  }
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
        })}

        {/* ===================================================
            NEW TAB
        ==================================================== */}

        <button
          onMouseDown={(event) => {
            event.preventDefault();
            event.stopPropagation();
          }}
          onClick={(event) => {
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
          onMouseEnter={(event) => {
            event.currentTarget.style.background =
              "rgba(255,255,255,0.10)";
          }}
          onMouseLeave={(event) => {
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
            draggable={false}
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
        onClick={(event) => {
          event.stopPropagation();
        }}
      >
        <ToolbarButton
          icon={backIcon}
          label="Back"
          disabled={
            activeTab.historyIndex <= 0
          }
          onClick={
            goBack
          }
          dark
        />

        <ToolbarButton
          icon={forwardIcon}
          label="Forward"
          disabled={
            activeTab.historyIndex >=
            activeTab.history.length - 1
          }
          onClick={
            goForward
          }
          dark
        />

        <ToolbarButton
          icon={upIcon}
          label="Up"
          disabled={
            activeTab.isRecycleBin ||
            activeTab.folderId === null
          }
          onClick={
            goUp
          }
          dark
        />

        <ToolbarButton
          icon={reloadIcon}
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
            flex: 1,

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
            draggable={false}
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
                (folder) => (
                  <span
                    key={
                      `breadcrumb-${folder._id}`
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
                      {folder.name}
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
            draggable={false}
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
            onChange={(event) =>
              setSearch(
                event.target.value
              )
            }
            onMouseDown={(event) => {
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

          userSelect:
            "none",

          WebkitUserSelect:
            "none",
        }}
        onMouseDown={(event) => {
          /*
           * Clicking genuinely empty space
           * clears the selection.
           */
          if (
            event.target ===
            event.currentTarget
          ) {
            setSelectedItem(
              null
            );
          }
        }}
        onClick={(event) => {
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

            userSelect:
              "none",

            WebkitUserSelect:
              "none",
          }}
        >
          {currentItems.map((item) => {
            const itemId = item._id ?? item.id;

            if (!itemId) {
              console.warn(
                "Filesystem item has no ID:",
                item
              );
              return null;
            }

            const isSelected =
              selectedItem === itemId;

            const icon =
              item.type === "folder"
                ? folderIcon
                : fileIcon;

            return (
              <div
                key={itemId}
                onMouseDown={(event) => {
                  event.preventDefault();
                  event.stopPropagation();

                  onFocus?.();
                }}
                onClick={(event) => {
                  event.preventDefault();
                  event.stopPropagation();

                  setSelectedItem(itemId);
                }}
                onDoubleClick={(event) => {
                  event.preventDefault();
                  event.stopPropagation();

                  handleItemDoubleClick(item);
                }}
                style={{
                  height: "130px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",

                  borderRadius: "7px",

                  background: isSelected
                    ? "rgba(255,255,255,0.14)"
                    : "transparent",

                  border: isSelected
                    ? "1px solid rgba(255,255,255,0.10)"
                    : "1px solid transparent",

                  cursor: "pointer",

                  userSelect: "none",
                  WebkitUserSelect: "none",

                  transition:
                    "background 100ms ease, border 100ms ease",
                }}
              >
                <img
                  src={
                    typeof icon === "string"
                      ? icon
                      : icon.src
                  }
                  alt=""
                  draggable={false}
                  style={{
                    width: "72px",
                    height: "72px",
                    objectFit: "contain",
                    marginBottom: "8px",
                    pointerEvents: "none",
                  }}
                />

                <span
                  style={{
                    maxWidth: "115px",
                    overflow: "hidden",
                    whiteSpace: "nowrap",
                    textOverflow: "ellipsis",
                    fontSize: "15px",
                    textAlign: "center",
                    color: "#e5e5e5",
                    pointerEvents: "none",
                  }}
                >
                  {item.name}
                </span>
              </div>
            );
          })}
        </div>

        {/* =================================================
            EMPTY STATES
        ================================================== */}

        {activeTab.isRecycleBin &&
          currentItems.length === 0 && (
            <EmptyState dark>
              Recycle Bin is empty
            </EmptyState>
          )}

        {!activeTab.isRecycleBin &&
          currentItems.length === 0 && (
            <EmptyState dark>
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
      onMouseDown={(event) => {
        event.preventDefault();
        event.stopPropagation();
      }}
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();

        onClick();
      }}
      disabled={disabled}
      aria-label={label}
      title={label}
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
      onMouseEnter={(event) => {
        if (!disabled) {
          event.currentTarget.style.background =
            dark
              ? "rgba(255,255,255,0.10)"
              : "rgba(0,0,0,0.08)";
        }
      }}
      onMouseLeave={(event) => {
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
        draggable={false}
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