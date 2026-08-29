"use client";

import fileExplorerIcon from "../../assets/icons/file_explorer.png";
import notesIcon from "../../assets/icons/notes.png";
import recycleIcon from "../../assets/icons/recycle.png";
import dsaLabIcon from "../../assets/icons/dsa.png";
import devOpsLabIcon from "../../assets/icons/devops.png";
import cookingGameIcon from "../../assets/icons/cooking-game.png";

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
    id: "files",
    name: "File Explorer",
    icon: fileExplorerIcon.src,
  },
  {
    id: "notes",
    name: "Notes",
    icon: notesIcon.src,
  },
  {
    id: "cooking-game",
    name: "Cooking Game",
    icon: cookingGameIcon.src,
  },
  {
    id: "dsa",
    name: "Data Structures Lab",
    icon: dsaLabIcon.src,
  },
    {
    id: "devops",
    name: "Dev Ops Lab",
    icon: devOpsLabIcon.src,
  },
];

const systemApps: DockApp[] = [
  {
    id: "recycle",
    name: "Recycle Bin",
    icon: recycleIcon.src,
  },
];

export default function Dock({
  openApps = [],
  onOpenApp,
}: DockProps) {
  const handleClick = (id: string) => {
    onOpenApp?.(id);
  };

  const renderDockApp = (app: DockApp) => {
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
          transition: "transform 150ms ease",
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
  };

  return (
    <div
      style={{
        position: "absolute",
        left: "50%",
        bottom: "8px",
        transform: "translateX(-50%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        zIndex: 40,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "flex-end",
          gap: "10px",
          padding: "10px 14px 8px",

          background:
            "linear-gradient(180deg, rgba(255,255,255,0.22), rgba(255,255,255,0.10))",

          backdropFilter: "blur(30px) saturate(180%)",
          WebkitBackdropFilter:
            "blur(30px) saturate(180%)",

          border: "1px solid rgba(255,255,255,0.28)",
          borderRadius: "20px",

          boxShadow: `
            0 10px 35px rgba(0,0,0,0.35),
            inset 0 1px 0 rgba(255,255,255,0.20),
            inset 0 -1px 0 rgba(255,255,255,0.06)
          `,

          minHeight: "76px",
        }}
      >
        {dockApps.map(renderDockApp)}

        {/* Divider before Recycle Bin */}
        <div
          style={{
            width: "1px",
            height: "42px",
            margin: "0 6px",
            backgroundColor: "rgba(255,255,255,0.20)",
            alignSelf: "center",
          }}
        />

        {systemApps.map(renderDockApp)}
      </div>
    </div>
  );
}