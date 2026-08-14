"use client";

import {
    useEffect,
    useRef,
    useState,
} from "react";

import notesIcon from "@/assets/icons/notes.png";

import undoIcon from "@/assets/icons/notes-undo.svg";
import redoIcon from "@/assets/icons/notes-redo.svg";
import closeIcon from "@/assets/icons/explorer-close.svg";

interface NotesAppProps {
    initialTitle?: string;
    initialContent?: string;

    onClose?: () => void;
    onFocus?: () => void;

    onMove?: (
        left: number,
        top: number
    ) => void;

    windowPosition?: {
        left: number;
        top: number;
        zIndex: number;
        centered?: boolean;
    };
}

export default function NotesApp({
    initialTitle = "Untitled",
    initialContent = "",
    onClose,
    windowPosition = {
        left: 0,
        top: 0,
        zIndex: 40,
        centered: true,
    },
    onFocus,
}: NotesAppProps) {
    const [title, setTitle] =
        useState(initialTitle);

    const [content, setContent] =
        useState(initialContent);

    const [isRenaming, setIsRenaming] =
        useState(false);

    const [isDragging, setIsDragging] =
        useState(false);

    const dragOffset =
        useRef({
            x: 0,
            y: 0,
        });

    /*
     * =========================================================
     * WINDOW DRAGGING
     * =========================================================
     */

    const handleWindowMouseDown = (
        event: React.MouseEvent<HTMLDivElement>
    ) => {
        /*
         * Don't start dragging when interacting
         * with buttons, inputs, or the editor.
         */
        const target =
            event.target as HTMLElement;

        if (
            target.closest("button") ||
            target.closest("input") ||
            target.closest("textarea")
        ) {
            return;
        }

        onFocus?.();

        /*
         * If the window is currently centered,
         * convert it to a normal positioned window
         * before dragging.
         */
        const windowElement =
            event.currentTarget;

        const rect =
            windowElement.getBoundingClientRect();

        dragOffset.current = {
            x: event.clientX - rect.left,
            y: event.clientY - rect.top,
        };

        setIsDragging(true);

        event.preventDefault();
    };

    const handleWindowMouseMove = (
        event: MouseEvent
    ) => {
        if (!isDragging) {
            return;
        }

        const left =
            event.clientX -
            dragOffset.current.x;

        const top =
            event.clientY -
            dragOffset.current.y;

        const boundedLeft =
            Math.max(
                0,
                Math.min(
                    left,
                    window.innerWidth - 500
                )
            );

        const boundedTop =
            Math.max(
                40,
                Math.min(
                    top,
                    window.innerHeight - 400
                )
            );

        onMove?.(
            boundedLeft,
            boundedTop
        );
    };

    useEffect(() => {
        if (!isDragging) {
            return;
        }

        window.addEventListener(
            "mousemove",
            handleWindowMouseMove
        );

        window.addEventListener(
            "mouseup",
            handleWindowMouseUp
        );

        return () => {
            window.removeEventListener(
                "mousemove",
                handleWindowMouseMove
            );

            window.removeEventListener(
                "mouseup",
                handleWindowMouseUp
            );
        };
    }, [isDragging]);

    const handleWindowMouseUp = () => {
        setIsDragging(false);
    };

    /*
     * =========================================================
     * RENAME
     * =========================================================
     */

    const startRenaming = () => {
        setIsRenaming(true);

        setTimeout(() => {
            titleInputRef.current?.focus();
            titleInputRef.current?.select();
        }, 0);
    };

    const finishRenaming = () => {
        const trimmedTitle =
            title.trim();

        if (!trimmedTitle) {
            setTitle("Untitled");
        } else {
            setTitle(trimmedTitle);
        }

        setIsRenaming(false);
    };

    const handleTitleKeyDown = (
        event: React.KeyboardEvent<HTMLInputElement>
    ) => {
        if (event.key === "Enter") {
            event.preventDefault();

            finishRenaming();
        }

        if (event.key === "Escape") {
            event.preventDefault();

            setIsRenaming(false);
        }
    };

    /*
     * =========================================================
     * EDITOR
     * =========================================================
     */

    const handleContentChange = (
        event: React.ChangeEvent<HTMLTextAreaElement>
    ) => {
        setContent(event.target.value);
    };

    /*
     * =========================================================
     * CHARACTER COUNT
     * =========================================================
     */

    const characterCount =
        content.length;

    /*
     * =========================================================
     * WINDOW
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
            "min(850px, 82vw)",

        height:
            "min(620px, 70vh)",

        minWidth: "500px",

        minHeight: "400px",

        background: "#ffffff",

        color: "#111111",

        borderRadius: "5px",

        overflow: "hidden",

        boxShadow:
            "0 22px 60px rgba(0,0,0,0.45)",

        zIndex:
            windowPosition.zIndex,

        display: "flex",

        flexDirection: "column",

        userSelect: "none",
    };

    return (
        <div
            style={windowStyle}
            onMouseDown={handleWindowMouseDown}
        >
            {/* =====================================================
          HEADER
      ====================================================== */}

            <div
                style={{
                    height: "40px",

                    flexShrink: 0,

                    display: "flex",

                    alignItems: "center",

                    background: "#f6cf55",

                    paddingLeft: "7px",

                    paddingRight: "7px",

                    position: "relative",
                }}
                onMouseDown={handleWindowMouseDown}
            >
                {/* NOTES ICON */}

                <img
                    src={
                        typeof notesIcon === "string"
                            ? notesIcon
                            : notesIcon.src
                    }
                    alt=""
                    draggable={false}
                    style={{
                        width: "24px",
                        height: "24px",

                        objectFit: "contain",

                        marginRight: "8px",
                    }}
                />

                {/* =================================================
            TITLE TAB
        ================================================== */}

                <div
                    style={{
                        height: "33px",

                        minWidth: "115px",

                        maxWidth: "220px",

                        display: "flex",

                        alignItems: "center",

                        padding:
                            "0 8px 0 10px",

                        background: "#ffffff",

                        borderRadius:
                            "5px 5px 0 0",

                        marginTop: "7px",

                        gap: "7px",
                    }}
                    onDoubleClick={(event) => {
                        event.stopPropagation();

                        startRenaming();
                    }}
                >
                    {isRenaming ? (
                        <input
                            ref={titleInputRef}
                            value={title}
                            onChange={(event) =>
                                setTitle(
                                    event.target.value
                                )
                            }
                            onKeyDown={
                                handleTitleKeyDown
                            }
                            onBlur={
                                finishRenaming
                            }
                            style={{
                                width: "100%",

                                minWidth: 0,

                                border: 0,

                                outline: "none",

                                background:
                                    "transparent",

                                fontFamily:
                                    "Inter, Arial, sans-serif",

                                fontSize: "13px",

                                fontWeight: 600,

                                color: "#a97916",
                            }}
                        />
                    ) : (
                        <span
                            style={{
                                flex: 1,

                                overflow: "hidden",

                                whiteSpace:
                                    "nowrap",

                                textOverflow:
                                    "ellipsis",

                                fontSize: "13px",

                                fontWeight: 600,

                                color: "#a97916",

                                cursor: "default",
                            }}
                        >
                            {title}
                        </span>
                    )}

                    {/* TAB CLOSE */}

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
                        style={{
                            width: "18px",

                            height: "18px",

                            border: 0,

                            background:
                                "transparent",

                            display: "flex",

                            alignItems: "center",

                            justifyContent:
                                "center",

                            padding: 0,

                            cursor: "pointer",

                            opacity: 0.45,
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
                            draggable={false}
                            style={{
                                width: "11px",
                                height: "11px",
                            }}
                        />
                    </button>
                </div>

                {/* =================================================
            NEW NOTE / TAB
        ================================================== */}

                <button
                    style={{
                        width: "30px",

                        height: "30px",

                        marginLeft: "2px",

                        marginTop: "6px",

                        border: 0,

                        background:
                            "transparent",

                        fontSize: "17px",

                        color: "#8c731f",

                        cursor: "pointer",

                        display: "flex",

                        alignItems: "center",

                        justifyContent:
                            "center",

                        padding: 0,
                    }}
                >
                    +
                </button>

                {/* =================================================
            WINDOW CLOSE
        ================================================== */}

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
                    aria-label="Close Notes"
                    style={{
                        position: "absolute",

                        right: 0,

                        top: 0,

                        width: "40px",

                        height: "40px",

                        border: 0,

                        background:
                            "transparent",

                        display: "flex",

                        alignItems: "center",

                        justifyContent:
                            "center",

                        cursor: "pointer",

                        padding: 0,
                    }}
                    onMouseEnter={(event) => {
                        event.currentTarget.style.background =
                            "rgba(0,0,0,0.08)";
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
                        alt="Close"
                        draggable={false}
                        style={{
                            width: "16px",
                            height: "16px",
                            opacity: 0.65,
                        }}
                    />
                </button>
            </div>

            {/* =====================================================
          TOOLBAR
      ====================================================== */}

            <div
                style={{
                    height: "26px",

                    flexShrink: 0,

                    display: "flex",

                    alignItems: "center",

                    background: "#ffffff",

                    borderBottom:
                        "1px solid #eeeeee",

                    paddingLeft: "7px",

                    gap: "4px",
                }}
            >
                {/* SAVE */}

                <button
                    title="Save"
                    style={{
                        border: 0,
                        background: "transparent",
                        fontSize: "10px",
                        color: "#222",
                        cursor: "pointer",
                        padding: "2px 5px",
                    }}
                >
                    Save
                </button>

                {/* UNDO */}

                <button
                    title="Undo"
                    style={{
                        width: "22px",

                        height: "22px",

                        border: 0,

                        background:
                            "transparent",

                        display: "flex",

                        alignItems: "center",

                        justifyContent:
                            "center",

                        cursor: "pointer",

                        padding: 0,
                    }}
                >
                    <img
                        src={
                            typeof undoIcon ===
                                "string"
                                ? undoIcon
                                : undoIcon.src
                        }
                        alt="Undo"
                        draggable={false}
                        style={{
                            width: "13px",
                            height: "13px",
                            opacity: 0.7,
                        }}
                    />
                </button>

                {/* REDO */}

                <button
                    title="Redo"
                    style={{
                        width: "22px",

                        height: "22px",

                        border: 0,

                        background:
                            "transparent",

                        display: "flex",

                        alignItems: "center",

                        justifyContent:
                            "center",

                        cursor: "pointer",

                        padding: 0,
                    }}
                >
                    <img
                        src={
                            typeof redoIcon ===
                                "string"
                                ? redoIcon
                                : redoIcon.src
                        }
                        alt="Redo"
                        draggable={false}
                        style={{
                            width: "13px",
                            height: "13px",
                            opacity: 0.7,
                        }}
                    />
                </button>

                {/* FORMATTING */}

                <div
                    style={{
                        marginLeft: "105px",

                        display: "flex",

                        alignItems: "center",

                        gap: "10px",
                    }}
                >
                    <button
                        style={{
                            border: 0,

                            background:
                                "transparent",

                            fontWeight: 700,

                            fontSize: "12px",

                            cursor: "pointer",

                            padding: 0,
                        }}
                    >
                        B
                    </button>

                    <button
                        style={{
                            border: 0,

                            background:
                                "transparent",

                            fontStyle: "italic",

                            fontSize: "12px",

                            cursor: "pointer",

                            padding: 0,
                        }}
                    >
                        I
                    </button>

                    <button
                        style={{
                            border: 0,

                            background:
                                "transparent",

                            fontSize: "12px",

                            cursor: "pointer",

                            padding: 0,
                        }}
                    >
                        ↕
                    </button>
                </div>
            </div>

            {/* =====================================================
          EDITOR
      ====================================================== */}

            <div
                style={{
                    flex: 1,

                    minHeight: 0,

                    position: "relative",

                    background: "#ffffff",
                }}
            >
                <textarea
                    value={content}
                    onChange={handleContentChange}
                    placeholder=""
                    spellCheck={true}
                    style={{
                        width: "100%",

                        height: "100%",

                        resize: "none",

                        border: 0,

                        outline: "none",

                        padding:
                            "10px 8px",

                        background:
                            "#ffffff",

                        color: "#111111",

                        fontFamily:
                            "Inter, Arial, sans-serif",

                        fontSize: "14px",

                        lineHeight: "1.15",

                        userSelect: "text",

                        WebkitUserSelect:
                            "text",
                    }}
                />
            </div>

            {/* =====================================================
          CHARACTER COUNT
      ====================================================== */}

            <div
                style={{
                    height: "20px",

                    flexShrink: 0,

                    display: "flex",

                    alignItems: "center",

                    paddingLeft: "9px",

                    borderTop:
                        "1px solid #eeeeee",

                    background: "#ffffff",

                    color: "#888888",

                    fontSize: "9px",
                }}
            >
                {characterCount} characters
            </div>
        </div>
    );
}