"use client";

import {
    useCallback,
    useEffect,
    useRef,
    useState,
} from "react";

import notesIcon from "@/assets/icons/notes.png";

import undoIcon from "@/assets/icons/notes-undo.svg";
import redoIcon from "@/assets/icons/notes-redo.svg";
import closeIcon from "@/assets/icons/explorer-close.svg";

import boldIcon from "@/assets/icons/notes-bold.svg";
import italicIcon from "@/assets/icons/notes-italic.svg";
import lineSpacingIcon from "@/assets/icons/notes-strikethrough.svg";

interface NotesAppProps {
    itemId?: string;

    initialTitle?: string;
    initialContent?: string;

    onClose?: () => void;
    onFocus?: () => void;

    onSave?: (item: {
        id: string;
        name: string;
        content: string;
    }) => void;

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

interface NoteTab {
    id: string;
    itemId?: string;
    title: string;
    content: string;
}

const MAX_NOTE_TABS = 10;

export default function NotesApp({
    itemId,
    initialTitle = "Untitled",
    initialContent = "",
    onClose,
    onFocus,
    onSave,
    onMove,
    windowPosition = {
        left: 0,
        top: 0,
        zIndex: 40,
        centered: true,
    },
}: NotesAppProps) {
    /*
     * =========================================================
     * INITIAL NOTE
     * =========================================================
     */

    const initialNoteId = useRef(
        `note-${Date.now()}-${Math.random()
            .toString(36)
            .slice(2, 8)}`
    );

    /*
     * =========================================================
     * NOTE TABS
     * =========================================================
     */

    const [noteTabs, setNoteTabs] =
        useState<NoteTab[]>([
            {
                id: initialNoteId.current,
                itemId,
                title: initialTitle,
                content: initialContent,
            },
        ]);

    const [activeNoteId, setActiveNoteId] =
        useState(initialNoteId.current);

    const activeNote =
        noteTabs.find(
            (note) =>
                note.id === activeNoteId
        ) ?? noteTabs[0];

    /*
     * =========================================================
     * SAVE STATE
     * =========================================================
     */

    const [isSaving, setIsSaving] =
        useState(false);

    const [saveMessage, setSaveMessage] =
        useState("");

    /*
     * =========================================================
     * RENAME STATE
     * =========================================================
     */

    const [isRenaming, setIsRenaming] =
        useState(false);

    const [renameValue, setRenameValue] =
        useState("");

    const titleInputRef =
        useRef<HTMLInputElement>(null);

    /*
     * =========================================================
     * DRAGGING STATE
     * =========================================================
     */

    const [isDragging, setIsDragging] =
        useState(false);

    const dragOffset =
        useRef({
            x: 0,
            y: 0,
        });

    /*
     * =========================================================
     * ACTIVE NOTE UPDATE
     * =========================================================
     */

    const updateActiveNote = (
        updates: Partial<NoteTab>
    ) => {
        setNoteTabs((previous) =>
            previous.map((note) =>
                note.id === activeNoteId
                    ? {
                        ...note,
                        ...updates,
                    }
                    : note
            )
        );
    };

    /*
     * =========================================================
     * SAVE
     * =========================================================
     */

    const handleSave = async () => {
        if (isSaving || !activeNote) {
            return;
        }

        setIsSaving(true);
        setSaveMessage("");

        const savedTitle =
            activeNote.title.trim() || "Untitled";

        const savedContent =
            activeNote.content;

        try {
            const response = await fetch("/api/notes", {
                method: "POST",

                headers: {
                    "Content-Type": "application/json",
                },

                credentials: "include",

                body: JSON.stringify({
                    itemId: activeNote.itemId,

                    name: savedTitle,

                    content: savedContent,

                    parentId: null,
                }),
            });

            const data = await response.json();

            if (!response.ok || !data.success) {
                throw new Error(
                    data.message ||
                    "Failed to save note."
                );
            }

            const savedId =
                data.item?.id ??
                activeNote.itemId;

            /*
             * =====================================================
             * UPDATE THE ACTIVE TAB'S DATABASE ID
             * =====================================================
             */

            setNoteTabs((previous) =>
                previous.map((note) =>
                    note.id === activeNoteId
                        ? {
                            ...note,
                            itemId: savedId,
                            title: savedTitle,
                            content: savedContent,
                        }
                        : note
                )
            );

            /*
             * =====================================================
             * TELL DESKTOP ABOUT THE UPDATE
             * =====================================================
             */

            onSave?.({
                id: savedId,
                name: savedTitle,
                content: savedContent,
            });

            setSaveMessage("Saved");

            window.setTimeout(() => {
                setSaveMessage("");
            }, 1500);

        } catch (error) {
            console.error(
                "Failed to save note:",
                error
            );

            setSaveMessage("Failed to save");

        } finally {
            setIsSaving(false);
        }
    };

    /*
     * =========================================================
     * CREATE NEW TAB
     * =========================================================
     */

    const createNoteTab = () => {
        if (
            noteTabs.length >=
            MAX_NOTE_TABS
        ) {
            return;
        }

        const id =
            `note-${Date.now()}-${Math.random()
                .toString(36)
                .slice(2, 8)}`;

        const newNote: NoteTab = {
            id,

            itemId:
                undefined,

            title:
                "Untitled",

            content:
                "",
        };

        setNoteTabs((previous) => [
            ...previous,
            newNote,
        ]);

        setActiveNoteId(id);

        setIsRenaming(false);
        setSaveMessage("");

        onFocus?.();
    };

    /*
     * =========================================================
     * SWITCH TAB
     * =========================================================
     */

    const switchNoteTab = (
        id: string
    ) => {
        setActiveNoteId(id);

        setIsRenaming(false);
        setSaveMessage("");

        onFocus?.();
    };

    /*
     * =========================================================
     * CLOSE TAB
     * =========================================================
     */

    const closeNoteTab = (
        id: string
    ) => {
        /*
         * If this is the only tab,
         * close the entire Notes window.
         */

        if (noteTabs.length === 1) {
            onClose?.();
            return;
        }

        const index =
            noteTabs.findIndex(
                (note) =>
                    note.id === id
            );

        const remainingTabs =
            noteTabs.filter(
                (note) =>
                    note.id !== id
            );

        setNoteTabs(
            remainingTabs
        );

        /*
         * If closing the active tab,
         * select a neighboring tab.
         */

        if (
            id === activeNoteId
        ) {
            const nextIndex =
                Math.min(
                    index,
                    remainingTabs.length - 1
                );

            const nextTab =
                remainingTabs[
                nextIndex
                ];

            setActiveNoteId(
                nextTab.id
            );
        }

        setIsRenaming(false);
        setSaveMessage("");

        onFocus?.();
    };

    /*
     * =========================================================
     * RENAME
     * =========================================================
     */

    const startRenaming = () => {
        if (!activeNote) {
            return;
        }

        setRenameValue(
            activeNote.title
        );

        setIsRenaming(true);

        window.setTimeout(() => {
            titleInputRef.current?.focus();

            titleInputRef.current?.select();
        }, 20);
    };

    const finishRenaming = () => {
        const trimmed =
            renameValue.trim();

        updateActiveNote({
            title:
                trimmed ||
                "Untitled",
        });

        setIsRenaming(false);
    };

    const cancelRenaming = () => {
        setIsRenaming(false);

        setRenameValue(
            activeNote?.title ??
            "Untitled"
        );
    };

    const handleTitleKeyDown = (
        event: React.KeyboardEvent<HTMLInputElement>
    ) => {
        if (
            event.key === "Enter"
        ) {
            event.preventDefault();

            finishRenaming();
        }

        if (
            event.key === "Escape"
        ) {
            event.preventDefault();

            cancelRenaming();
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
        updateActiveNote({
            content:
                event.target.value,
        });
    };

    /*
     * =========================================================
     * CHARACTER COUNT
     * =========================================================
     */

    const characterCount =
        activeNote?.content.length ??
        0;

    /*
     * =========================================================
     * HEADER DRAGGING
     *
     * ONLY THE YELLOW HEADER IS DRAGGABLE.
     * =========================================================
     */

    const handleHeaderMouseDown = (
        event: React.MouseEvent<HTMLDivElement>
    ) => {
        if (event.button !== 0) {
            return;
        }

        const target =
            event.target as HTMLElement;

        /*
         * Never drag from:
         *
         * - buttons
         * - inputs
         * - tabs
         */

        if (
            target.closest("button") ||
            target.closest("input") ||
            target.closest("[data-note-tab]")
        ) {
            return;
        }

        onFocus?.();

        const windowElement =
            event.currentTarget.parentElement;

        if (!windowElement) {
            return;
        }

        const rect =
            windowElement.getBoundingClientRect();

        dragOffset.current = {
            x:
                event.clientX -
                rect.left,

            y:
                event.clientY -
                rect.top,
        };

        setIsDragging(true);

        event.preventDefault();
    };

    /*
     * =========================================================
     * DRAG MOVEMENT
     * =========================================================
     */

    useEffect(() => {
        if (!isDragging) {
            return;
        }

        const handleMouseMove = (
            event: MouseEvent
        ) => {
            const left =
                event.clientX -
                dragOffset.current.x;

            const top =
                event.clientY -
                dragOffset.current.y;

            const leftPercent =
                (left /
                    window.innerWidth) *
                100;

            const topPercent =
                (top /
                    window.innerHeight) *
                100;

            onMove?.(
                leftPercent,
                topPercent
            );
        };

        const handleMouseUp = () => {
            setIsDragging(false);
        };

        window.addEventListener(
            "mousemove",
            handleMouseMove
        );

        window.addEventListener(
            "mouseup",
            handleMouseUp
        );

        return () => {
            window.removeEventListener(
                "mousemove",
                handleMouseMove
            );

            window.removeEventListener(
                "mouseup",
                handleMouseUp
            );
        };
    }, [
        isDragging,
        onMove,
    ]);

    /*
     * =========================================================
     * WINDOW STYLE
     * =========================================================
     */

    const windowStyle:
        React.CSSProperties =
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

        minWidth:
            "500px",

        minHeight:
            "400px",

        background:
            "#ffffff",

        color:
            "#111111",

        borderRadius:
            "5px",

        overflow:
            "hidden",

        boxShadow:
            "0 22px 60px rgba(0,0,0,0.45)",

        zIndex:
            windowPosition.zIndex,

        display:
            "flex",

        flexDirection:
            "column",

        userSelect:
            "none",

        cursor:
            isDragging
                ? "grabbing"
                : "default",
    };

    /*
     * =========================================================
     * RENDER
     * =========================================================
     */

    return (
        <div
            style={
                windowStyle
            }
        >
            {/* =====================================================
                HEADER
            ====================================================== */}

            <div
                style={{
                    height:
                        "40px",

                    flexShrink:
                        0,

                    display:
                        "flex",

                    alignItems:
                        "center",

                    background: "rgba(238, 201, 68, 0.75)",

                    paddingLeft:
                        "7px",

                    paddingRight:
                        "46px",

                    position:
                        "relative",

                    overflow:
                        "hidden",

                    cursor:
                        isDragging
                            ? "grabbing"
                            : "grab",
                }}
                onMouseDown={
                    handleHeaderMouseDown
                }
            >
                {/* NOTES ICON */}

                <img
                    src={
                        typeof notesIcon ===
                            "string"
                            ? notesIcon
                            : notesIcon.src
                    }
                    alt=""
                    draggable={false}
                    style={{
                        width:
                            "24px",

                        height:
                            "24px",

                        objectFit:
                            "contain",

                        marginRight:
                            "8px",

                        pointerEvents:
                            "none",
                    }}
                />

                {/* =================================================
                    NOTE TABS
                ================================================== */}

                <div
                    style={{
                        display:
                            "flex",

                        alignItems:
                            "flex-end",

                        height:
                            "100%",

                        gap:
                            "2px",

                        minWidth:
                            0,

                        overflow:
                            "hidden",
                    }}
                >
                    {noteTabs.map(
                        (note) => {
                            const isActive =
                                note.id ===
                                activeNoteId;

                            return (
                                <div
                                    key={
                                        note.id
                                    }

                                    data-note-tab="true"

                                    onClick={(
                                        event
                                    ) => {
                                        event.stopPropagation();

                                        switchNoteTab(
                                            note.id
                                        );
                                    }}

                                    onDoubleClick={(
                                        event
                                    ) => {
                                        event.stopPropagation();

                                        if (
                                            isActive
                                        ) {
                                            startRenaming();
                                        }
                                    }}

                                    style={{
                                        height:
                                            "33px",

                                        width:
                                            isActive &&
                                                isRenaming
                                                ? "220px"
                                                : "115px",

                                        maxWidth:
                                            "220px",

                                        flexShrink:
                                            0,

                                        display:
                                            "flex",

                                        alignItems:
                                            "center",

                                        padding:
                                            "0 8px 0 10px",

                                        background:
                                            isActive
                                                ? "#ffffff"
                                                : "rgba(255,255,255,0.45)",

                                        borderRadius:
                                            "5px 5px 0 0",

                                        marginTop:
                                            "7px",

                                        gap:
                                            "7px",

                                        transition:
                                            "width 220ms cubic-bezier(0.2,0.8,0.2,1), background 150ms ease",

                                        cursor:
                                            isActive
                                                ? "default"
                                                : "pointer",
                                    }}
                                >
                                    {/* TITLE */}

                                    {isActive &&
                                        isRenaming ? (
                                        <input
                                            ref={
                                                titleInputRef
                                            }

                                            value={
                                                renameValue
                                            }

                                            onChange={(
                                                event
                                            ) =>
                                                setRenameValue(
                                                    event
                                                        .target
                                                        .value
                                                )
                                            }

                                            onKeyDown={
                                                handleTitleKeyDown
                                            }

                                            onBlur={
                                                finishRenaming
                                            }

                                            onMouseDown={(
                                                event
                                            ) =>
                                                event.stopPropagation()
                                            }

                                            style={{
                                                flex:
                                                    1,

                                                minWidth:
                                                    0,

                                                border:
                                                    0,

                                                outline:
                                                    "none",

                                                background:
                                                    "transparent",

                                                fontFamily:
                                                    "Inter, Arial, sans-serif",

                                                fontSize:
                                                    "13px",

                                                fontWeight:
                                                    600,

                                                color:
                                                    "#a97916",
                                            }}
                                        />
                                    ) : (
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
                                                    "13px",

                                                fontWeight:
                                                    600,

                                                color:
                                                    "#a97916",
                                            }}
                                        >
                                            {
                                                note.title
                                            }
                                        </span>
                                    )}

                                    {/* TAB CLOSE */}

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

                                            closeNoteTab(
                                                note.id
                                            );
                                        }}

                                        aria-label="Close note tab"

                                        style={{
                                            width:
                                                "18px",

                                            height:
                                                "18px",

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

                                            padding:
                                                0,

                                            cursor:
                                                "pointer",

                                            opacity:
                                                0.45,
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
                                                    "11px",

                                                height:
                                                    "11px",

                                                pointerEvents:
                                                    "none",
                                            }}
                                        />
                                    </button>
                                </div>
                            );
                        }
                    )}
                </div>

                {/* =================================================
                    NEW TAB
                ================================================== */}

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

                        createNoteTab();
                    }}

                    disabled={
                        noteTabs.length >=
                        MAX_NOTE_TABS
                    }

                    aria-label="New note"

                    style={{
                        width:
                            "30px",

                        height:
                            "30px",

                        marginLeft:
                            "2px",

                        marginTop:
                            "6px",

                        flexShrink:
                            0,

                        border:
                            0,

                        background:
                            "transparent",

                        fontSize:
                            "19px",

                        color:
                            "#8c731f",

                        cursor:
                            noteTabs.length >=
                                MAX_NOTE_TABS
                                ? "default"
                                : "pointer",

                        opacity:
                            noteTabs.length >=
                                MAX_NOTE_TABS
                                ? 0.35
                                : 1,

                        display:
                            "flex",

                        alignItems:
                            "center",

                        justifyContent:
                            "center",

                        padding:
                            0,
                    }}
                >
                    +
                </button>

                {/* =================================================
                    WINDOW CLOSE
                ================================================== */}

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

                    aria-label="Close Notes"

                    style={{
                        position:
                            "absolute",

                        right:
                            0,

                        top:
                            0,

                        width:
                            "46px",

                        height:
                            "40px",

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

                        padding:
                            0,

                        transition:
                            "background 120ms ease",
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

                        draggable={
                            false
                        }

                        style={{
                            width:
                                "18px",

                            height:
                                "18px",

                            opacity:
                                0.85,

                            pointerEvents:
                                "none",
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
                        "34px",

                    flexShrink:
                        0,

                    display:
                        "flex",

                    alignItems:
                        "center",

                    background:
                        "#ffffff",

                    borderBottom:
                        "1px solid #eeeeee",

                    paddingLeft:
                        "7px",

                    gap:
                        "5px",

                    position:
                        "relative",
                }}
            >
                {/* SAVE */}

                <button
                    title="Save"

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

                        handleSave();
                    }}

                    disabled={
                        isSaving
                    }

                    style={{
                        border:
                            0,

                        background:
                            "transparent",

                        fontSize:
                            "14px",

                        fontWeight:
                            500,

                        color:
                            "#222",

                        cursor:
                            isSaving
                                ? "default"
                                : "pointer",

                        padding:
                            "3px 6px",

                        opacity:
                            isSaving
                                ? 0.5
                                : 1,
                    }}
                >
                    {isSaving
                        ? "Saving..."
                        : "Save"}
                </button>

                {/* UNDO */}

                <button
                    title="Undo"

                    onMouseDown={(
                        event
                    ) => {
                        event.stopPropagation();
                    }}

                    style={{
                        width:
                            "30px",

                        height:
                            "30px",

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

                        padding:
                            0,
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

                        draggable={
                            false
                        }

                        style={{
                            width:
                                "20px",

                            height:
                                "20px",

                            opacity:
                                0.75,
                        }}
                    />
                </button>

                {/* REDO */}

                <button
                    title="Redo"

                    onMouseDown={(
                        event
                    ) => {
                        event.stopPropagation();
                    }}

                    style={{
                        width:
                            "30px",

                        height:
                            "30px",

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

                        padding:
                            0,
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

                        draggable={
                            false
                        }

                        style={{
                            width:
                                "20px",

                            height:
                                "20px",

                            opacity:
                                0.75,
                        }}
                    />
                </button>

                {/* =================================================
                    CENTERED FORMATTING
                ================================================== */}

                <div
                    style={{
                        position:
                            "absolute",

                        left:
                            "50%",

                        top:
                            "50%",

                        transform:
                            "translate(-50%, -50%)",

                        height:
                            "34px",

                        display:
                            "flex",

                        alignItems:
                            "center",

                        justifyContent:
                            "center",

                        gap:
                            "18px",

                        pointerEvents:
                            "auto",
                    }}
                >
                    {/* BOLD */}

                    <button
                        title="Bold"

                        onMouseDown={(
                            event
                        ) => {
                            event.stopPropagation();
                        }}

                        style={{
                            width:
                                "30px",

                            height:
                                "30px",

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

                            padding:
                                0,
                        }}
                    >
                        <img
                            src={
                                typeof boldIcon ===
                                    "string"
                                    ? boldIcon
                                    : boldIcon.src
                            }

                            alt="Bold"

                            draggable={
                                false
                            }

                            style={{
                                width:
                                    "19px",

                                height:
                                    "19px",
                            }}
                        />
                    </button>

                    {/* ITALIC */}

                    <button
                        title="Italic"

                        onMouseDown={(
                            event
                        ) => {
                            event.stopPropagation();
                        }}

                        style={{
                            width:
                                "30px",

                            height:
                                "30px",

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

                            padding:
                                0,
                        }}
                    >
                        <img
                            src={
                                typeof italicIcon ===
                                    "string"
                                    ? italicIcon
                                    : italicIcon.src
                            }

                            alt="Italic"

                            draggable={
                                false
                            }

                            style={{
                                width:
                                    "22px",

                                height:
                                    "22px",
                            }}
                        />
                    </button>

                    {/* LINE SPACING */}

                    <button
                        title="Formatting"

                        onMouseDown={(
                            event
                        ) => {
                            event.stopPropagation();
                        }}

                        style={{
                            width:
                                "30px",

                            height:
                                "30px",

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

                            padding:
                                0,
                        }}
                    >
                        <img
                            src={
                                typeof lineSpacingIcon ===
                                    "string"
                                    ? lineSpacingIcon
                                    : lineSpacingIcon.src
                            }

                            alt="Formatting"

                            draggable={
                                false
                            }

                            style={{
                                width:
                                    "22px",

                                height:
                                    "22px",
                            }}
                        />
                    </button>
                </div>
            </div>

            {/* =====================================================
                EDITOR
            ====================================================== */}

            <div
                style={{
                    flex:
                        1,

                    minHeight:
                        0,

                    position:
                        "relative",

                    background:
                        "#ffffff",
                }}
            >
                <textarea
                    value={
                        activeNote?.content ??
                        ""
                    }

                    onChange={
                        handleContentChange
                    }

                    spellCheck={
                        true
                    }

                    style={{
                        width:
                            "100%",

                        height:
                            "100%",

                        resize:
                            "none",

                        border:
                            0,

                        outline:
                            "none",

                        padding:
                            "10px 8px",

                        background:
                            "#ffffff",

                        color:
                            "#111111",

                        fontFamily:
                            "Inter, Arial, sans-serif",

                        fontSize:
                            "16px",

                        lineHeight:
                            "1.5",

                        userSelect:
                            "text",

                        WebkitUserSelect:
                            "text",
                    }}
                />
            </div>

            {/* =====================================================
                FOOTER
            ====================================================== */}

            <div
                style={{
                    height:
                        "30px",

                    flexShrink:
                        0,

                    display:
                        "flex",

                    alignItems:
                        "center",

                    justifyContent:
                        "space-between",

                    paddingLeft:
                        "9px",

                    paddingRight:
                        "9px",

                    borderTop:
                        "1px solid #eeeeee",

                    background:
                        "#ffffff",

                    color:
                        "#888888",

                    fontSize:
                        "13px",
                }}
            >
                <span>
                    {characterCount}{" "}
                    characters
                </span>

                {saveMessage && (
                    <span>
                        {saveMessage}
                    </span>
                )}
            </div>
        </div>
    );
}