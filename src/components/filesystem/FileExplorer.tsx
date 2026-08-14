"use client";

import { useEffect, useState } from "react";
import {
  FileSystemItem,
  getFileSystem,
} from "@/lib/filesystem";

interface FolderLocation {
  id: string | null;
  name: string;
}

export default function FileExplorer() {
  const [items, setItems] = useState<FileSystemItem[]>([]);
  const [location, setLocation] = useState<FolderLocation[]>([
    {
      id: null,
      name: "root",
    },
  ]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const currentFolder =
    location[location.length - 1];

  const loadFiles = async (parentId: string | null) => {
    try {
      setLoading(true);
      setError("");

      const files = await getFileSystem(parentId);

      setItems(files);
    } catch (error) {
      console.error(
        "Failed to load filesystem:",
        error
      );

      setError("FAILED TO LOAD FILESYSTEM");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFiles(currentFolder.id);
  }, [currentFolder.id]);

  const openFolder = (folder: FileSystemItem) => {
    setLocation((previous) => [
      ...previous,
      {
        id: folder.id,
        name: folder.name,
      },
    ]);
  };

  const goBack = () => {
    if (location.length <= 1) {
      return;
    }

    setLocation((previous) =>
      previous.slice(0, -1)
    );
  };

  const goToLocation = (index: number) => {
    setLocation((previous) =>
      previous.slice(0, index + 1)
    );
  };

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        fontFamily: "var(--font-vga)",
        color: "#ffffff",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          marginBottom: "20px",
        }}
      >
        {/* Back */}
        <button
          onClick={goBack}
          disabled={location.length <= 1}
          style={{
            background: "none",
            border: "none",
            color: "#ffffff",
            fontFamily: "inherit",
            fontSize: "20px",
            padding: 0,
            cursor:
              location.length <= 1
                ? "default"
                : "pointer",
            opacity:
              location.length <= 1 ? 0.3 : 1,
          }}
          aria-label="Go back"
        >
          ←
        </button>

        {/* Breadcrumb */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            fontSize: "14px",
          }}
        >
          {location.map((folder, index) => (
            <div
              key={folder.id ?? "root"}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <button
                onClick={() =>
                  goToLocation(index)
                }
                style={{
                  background: "none",
                  border: "none",
                  color: "#ffffff",
                  padding: 0,
                  fontFamily: "inherit",
                  fontSize: "14px",
                  cursor: "pointer",
                }}
              >
                {folder.name}
              </button>

              {index < location.length - 1 && (
                <span style={{ opacity: 0.4 }}>
                  /
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div
          style={{
            fontSize: "14px",
            opacity: 0.6,
          }}
        >
          LOADING...
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div
          style={{
            fontSize: "14px",
          }}
        >
          {error}
        </div>
      )}

      {/* Empty */}
      {!loading &&
        !error &&
        items.length === 0 && (
          <div
            style={{
              fontSize: "14px",
              opacity: 0.5,
            }}
          >
            EMPTY
          </div>
        )}

      {/* Items */}
      {!loading &&
        !error &&
        items.length > 0 && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "2px",
            }}
          >
            {items.map((item) => (
              <button
                key={item.id}
                onDoubleClick={() => {
                  if (item.type === "folder") {
                    openFolder(item);
                  }
                }}
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  padding: "8px 10px",
                  background: "transparent",
                  border: "none",
                  color: "#ffffff",
                  fontFamily: "inherit",
                  fontSize: "14px",
                  textAlign: "left",
                  cursor:
                    item.type === "folder"
                      ? "pointer"
                      : "default",
                }}
              >
                <span
                  style={{
                    width: "18px",
                    textAlign: "center",
                    opacity: 0.8,
                  }}
                >
                  {item.type === "folder"
                    ? "▸"
                    : "·"}
                </span>

                <span>{item.name}</span>
              </button>
            ))}
          </div>
        )}
    </div>
  );
}