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

type NoteHistoryState = {
    title: string;
    content: string;
};

interface NoteTab {
    id: string;
    itemId?: string;
    title: string;
    content: string;

    /*
     * =========================================================
     * UNDO / REDO HISTORY
     * =========================================================
     *
     * Every note tab owns its own history.
     *
     * This means:
     *
     * Note A → history A
     * Note B → history B
     *
     * Switching tabs will never mix their undo/redo states.
     */

    undoStack: NoteHistoryState[];
    redoStack: NoteHistoryState[];
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

                undoStack: [],
                redoStack: [],
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

    const editorRef =
        useRef<HTMLDivElement>(null);

    const [activeFormats, setActiveFormats] =
        useState({
            bold: false,
            italic: false,
            strikeThrough: false,
        });

    const [selectionHandles, setSelectionHandles] =
        useState<{
            start: {
                left: number;
                top: number;
            };
            end: {
                left: number;
                top: number;
            };
        } | null>(null);

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
     * HISTORY HELPERS
     * =========================================================
     */

    /*
     * Pushes the CURRENT state onto the active note's
     * undo stack before a new edit is made.
     *
     * Any new edit clears redo history because the user
     * has now created a new branch of the document history.
     */

    const pushToUndoStack = (
        state: NoteHistoryState
    ) => {
        setNoteTabs((previous) =>
            previous.map((note) => {
                if (
                    note.id !== activeNoteId
                ) {
                    return note;
                }

                return {
                    ...note,

                    undoStack: [
                        ...note.undoStack,
                        state,
                    ],

                    redoStack: [],
                };
            })
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
            const response = await fetch(
                "/api/notes",
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json",
                    },

                    credentials: "include",

                    body: JSON.stringify({
                        itemId:
                            activeNote.itemId,

                        name:
                            savedTitle,

                        content:
                            savedContent,

                        parentId:
                            null,
                    }),
                }
            );

            const data =
                await response.json();

            if (
                !response.ok ||
                !data.success
            ) {
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
             * UPDATE DATABASE ID
             * =====================================================
             */

            setNoteTabs((previous) =>
                previous.map((note) =>
                    note.id === activeNoteId
                        ? {
                            ...note,

                            itemId:
                                savedId,

                            title:
                                savedTitle,

                            content:
                                savedContent,
                        }
                        : note
                )
            );

            /*
             * =====================================================
             * TELL DESKTOP ABOUT UPDATE
             * =====================================================
             */

            onSave?.({
                id:
                    savedId,
                name:
                    savedTitle,
                content:
                    savedContent,
            });

            setSaveMessage(
                "Saved"
            );

            window.setTimeout(() => {
                setSaveMessage("");
            }, 1500);

        } catch (error) {
            console.error(
                "Failed to save note:",
                error
            );

            setSaveMessage(
                "Failed to save"
            );

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

            undoStack:
                [],

            redoStack:
                [],
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
        if (!activeNote) {
            return;
        }

        const trimmed =
            renameValue.trim();

        /*
         * Only create a history entry if
         * the title actually changed.
         */

        const newTitle =
            trimmed ||
            "Untitled";

        if (
            newTitle !==
            activeNote.title
        ) {
            pushToUndoStack({
                title:
                    activeNote.title,

                content:
                    activeNote.content,
            });
        }

        updateActiveNote({
            title:
                newTitle,
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
     * CONTENT EDITING
     * =========================================================
     */

    const handleContentChange = (
        newContent: string
    ) => {
        if (!activeNote) {
            return;
        }

        /*
         * Don't create history entries when
         * the content hasn't actually changed.
         */

        if (
            newContent ===
            activeNote.content
        ) {
            return;
        }

        /*
         * Store the state BEFORE this edit.
         */

        pushToUndoStack({
            title:
                activeNote.title,

            content:
                activeNote.content,
        });

        updateActiveNote({
            content:
                newContent,
        });
    };

    /*
     * =========================================================
     * UNDO
     * =========================================================
     */

    const handleUndo = () => {
        if (
            !activeNote ||
            activeNote.undoStack.length === 0
        ) {
            return;
        }

        const previousState =
            activeNote.undoStack[
                activeNote.undoStack.length - 1
            ];

        const currentState: NoteHistoryState = {
            title:
                activeNote.title,

            content:
                activeNote.content,
        };

        /*
         * Move current state to REDO.
         */

        setNoteTabs((previous) =>
            previous.map((note) => {
                if (
                    note.id !== activeNoteId
                ) {
                    return note;
                }

                return {
                    ...note,

                    title:
                        previousState.title,

                    content:
                        previousState.content,

                    undoStack:
                        note.undoStack.slice(
                            0,
                            -1
                        ),

                    redoStack: [
                        ...note.redoStack,
                        currentState,
                    ],
                };
            })
        );

        /*
         * React will update the editor through
         * the active-note synchronization effect.
         */
    };

    /*
     * =========================================================
     * REDO
     * =========================================================
     */

    const handleRedo = () => {
        if (
            !activeNote ||
            activeNote.redoStack.length === 0
        ) {
            return;
        }

        const nextState =
            activeNote.redoStack[
                activeNote.redoStack.length - 1
            ];

        const currentState: NoteHistoryState = {
            title:
                activeNote.title,

            content:
                activeNote.content,
        };

        /*
         * Move current state back to UNDO.
         */

        setNoteTabs((previous) =>
            previous.map((note) => {
                if (
                    note.id !== activeNoteId
                ) {
                    return note;
                }

                return {
                    ...note,

                    title:
                        nextState.title,

                    content:
                        nextState.content,

                    undoStack: [
                        ...note.undoStack,
                        currentState,
                    ],

                    redoStack:
                        note.redoStack.slice(
                            0,
                            -1
                        ),
                };
            })
        );
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
        if (
            event.button !== 0
        ) {
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
     * SELECTION HANDLES
     * =========================================================
     */

    const updateSelectionHandles = () => {
        const editor =
            editorRef.current;

        if (!editor) {
            return;
        }

        const selection =
            window.getSelection();

        if (
            !selection ||
            selection.rangeCount === 0
        ) {
            setSelectionHandles(null);
            return;
        }

        if (
            selection.isCollapsed
        ) {
            setSelectionHandles(null);
            return;
        }

        const range =
            selection.getRangeAt(0);

        /*
         * Make sure the selection actually
         * belongs to our editor.
         */

        if (
            !editor.contains(
                range.commonAncestorContainer
            )
        ) {
            setSelectionHandles(null);
            return;
        }

        const rects =
            range.getClientRects();

        if (!rects.length) {
            setSelectionHandles(null);
            return;
        }

        const firstRect =
            rects[0];

        const lastRect =
            rects[rects.length - 1];

        const editorRect =
            editor.getBoundingClientRect();

        /*
         * Start handle
         */

        const startLeft =
            firstRect.left -
            editorRect.left;

        const startTop =
            firstRect.bottom -
            editorRect.top;

        /*
         * End handle
         */

        const endLeft =
            lastRect.right -
            editorRect.left;

        const endTop =
            lastRect.bottom -
            editorRect.top;

        setSelectionHandles({
            start: {
                left:
                    startLeft,

                top:
                    startTop,
            },

            end: {
                left:
                    endLeft,

                top:
                    endTop,
            },
        });
    };

    useEffect(() => {
        const handleSelectionChange =
            () => {
                updateSelectionHandles();
            };

        document.addEventListener(
            "selectionchange",
            handleSelectionChange
        );

        return () => {
            document.removeEventListener(
                "selectionchange",
                handleSelectionChange
            );
        };
    }, []);

    /*
     * =========================================================
     * ACTIVE FORMATTING
     * =========================================================
     */

    const updateActiveFormats = () => {
        if (!editorRef.current) {
            return;
        }

        setActiveFormats({
            bold:
                document.queryCommandState(
                    "bold"
                ),

            italic:
                document.queryCommandState(
                    "italic"
                ),

            strikeThrough:
                document.queryCommandState(
                    "strikeThrough"
                ),
        });
    };

    /*
     * =========================================================
     * FORMATTING
     * =========================================================
     */

    const applyFormatting = (
        command:
            | "bold"
            | "italic"
            | "strikeThrough"
    ) => {
        if (
            !editorRef.current ||
            !activeNote
        ) {
            return;
        }

        /*
         * Store the state BEFORE formatting.
         */

        const previousState:
            NoteHistoryState = {
            title:
                activeNote.title,

            content:
                activeNote.content,
        };

        /*
         * Preserve selection while applying
         * the browser formatting command.
         */

        editorRef.current.focus();

        document.execCommand(
            command,
            false
        );

        const newContent =
            editorRef.current.innerHTML;

        /*
         * Only create a history state if
         * the formatting actually changed
         * the HTML.
         */

        if (
            newContent !==
            activeNote.content
        ) {
            pushToUndoStack(
                previousState
            );

            updateActiveNote({
                content:
                    newContent,
            });
        }

        updateActiveFormats();
        updateSelectionHandles();
    };

    /*
     * =========================================================
     * KEYBOARD SHORTCUTS
     * =========================================================
     */

    const handleEditorKeyDown = (
        event: React.KeyboardEvent<HTMLDivElement>
    ) => {
        /*
         * Ctrl + B
         */

        if (
            event.ctrlKey &&
            !event.shiftKey &&
            event.key.toLowerCase() ===
                "b"
        ) {
            event.preventDefault();

            applyFormatting(
                "bold"
            );

            return;
        }

        /*
         * Ctrl + I
         */

        if (
            event.ctrlKey &&
            !event.shiftKey &&
            event.key.toLowerCase() ===
                "i"
        ) {
            event.preventDefault();

            applyFormatting(
                "italic"
            );

            return;
        }

        /*
         * Ctrl + Shift + X
         */

        if (
            event.ctrlKey &&
            event.shiftKey &&
            event.key.toLowerCase() ===
                "x"
        ) {
            event.preventDefault();

            applyFormatting(
                "strikeThrough"
            );

            return;
        }

        /*
         * Ctrl + Z
         *
         * We handle this ourselves so that
         * the custom React history stack is used.
         */

        if (
            event.ctrlKey &&
            !event.shiftKey &&
            event.key.toLowerCase() ===
                "z"
        ) {
            event.preventDefault();

            handleUndo();

            return;
        }

        /*
         * Ctrl + Y
         */

        if (
            event.ctrlKey &&
            !event.shiftKey &&
            event.key.toLowerCase() ===
                "y"
        ) {
            event.preventDefault();

            handleRedo();

            return;
        }

        /*
         * Ctrl + Shift + Z
         *
         * Common alternative redo shortcut.
         */

        if (
            event.ctrlKey &&
            event.shiftKey &&
            event.key.toLowerCase() ===
                "z"
        ) {
            event.preventDefault();

            handleRedo();

            return;
        }
    };

    /*
     * =========================================================
     * ACTIVE NOTE → EDITOR SYNCHRONIZATION
     * =========================================================
     *
     * Whenever the active note changes OR undo/redo changes
     * its content, update the actual contentEditable element.
     */

    useEffect(() => {
        if (!editorRef.current) {
            return;
        }

        const newContent =
            activeNote?.content ?? "";

        if (
            editorRef.current.innerHTML !==
            newContent
        ) {
            editorRef.current.innerHTML =
                newContent;
        }

        updateActiveFormats();
        updateSelectionHandles();
    }, [
        activeNoteId,
        activeNote?.content,
    ]);

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

                    background:
                        "rgba(238, 201, 68, 0.75)",

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

                    draggable={
                        false
                    }

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
                    onClick={
                        handleUndo
                    }

                    title="Undo"

                    disabled={
                        !activeNote ||
                        activeNote.undoStack.length ===
                            0
                    }

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
                            !activeNote ||
                            activeNote.undoStack.length ===
                                0
                                ? "default"
                                : "pointer",

                        padding:
                            0,

                        opacity:
                            !activeNote ||
                            activeNote.undoStack.length ===
                                0
                                ? 0.3
                                : 1,
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
                    onClick={
                        handleRedo
                    }

                    title="Redo"

                    disabled={
                        !activeNote ||
                        activeNote.redoStack.length ===
                            0
                    }

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
                            !activeNote ||
                            activeNote.redoStack.length ===
                                0
                                ? "default"
                                : "pointer",

                        padding:
                            0,

                        opacity:
                            !activeNote ||
                            activeNote.redoStack.length ===
                                0
                                ? 0.3
                                : 1,
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
                            event.preventDefault();

                            event.stopPropagation();

                            applyFormatting(
                                "bold"
                            );
                        }}

                        style={{
                            width:
                                "30px",

                            height:
                                "30px",

                            border:
                                0,

                            borderRadius:
                                "4px",

                            background:
                                activeFormats.bold
                                    ? "#e8e8e8"
                                    : "transparent",

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
                                "background 100ms ease",
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

                                opacity:
                                    activeFormats.bold
                                        ? 1
                                        : 0.75,
                            }}
                        />
                    </button>

                    {/* ITALIC */}

                    <button
                        title="Italic"

                        onMouseDown={(
                            event
                        ) => {
                            event.preventDefault();

                            event.stopPropagation();

                            applyFormatting(
                                "italic"
                            );
                        }}

                        style={{
                            width:
                                "30px",

                            height:
                                "30px",

                            border:
                                0,

                            borderRadius:
                                "4px",

                            background:
                                activeFormats.italic
                                    ? "#e8e8e8"
                                    : "transparent",

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
                                "background 100ms ease",
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

                                opacity:
                                    activeFormats.italic
                                        ? 1
                                        : 0.75,
                            }}
                        />
                    </button>

                    {/* STRIKETHROUGH */}

                    <button
                        title="Strikethrough"

                        onMouseDown={(
                            event
                        ) => {
                            event.preventDefault();

                            event.stopPropagation();

                            applyFormatting(
                                "strikeThrough"
                            );
                        }}

                        style={{
                            width:
                                "30px",

                            height:
                                "30px",

                            border:
                                0,

                            borderRadius:
                                "4px",

                            background:
                                activeFormats.strikeThrough
                                    ? "#e8e8e8"
                                    : "transparent",

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
                                "background 100ms ease",
                        }}
                    >
                        <img
                            src={
                                typeof lineSpacingIcon ===
                                    "string"
                                    ? lineSpacingIcon
                                    : lineSpacingIcon.src
                            }

                            alt="Strikethrough"

                            draggable={
                                false
                            }

                            style={{
                                width:
                                    "22px",

                                height:
                                    "22px",

                                opacity:
                                    activeFormats.strikeThrough
                                        ? 1
                                        : 0.75,
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
                <style>{`
                    .marker-editor-field::selection {
                        background-color: rgba(244, 154, 81, 0.35) !important;
                        color: inherit !important;
                    }

                    .marker-editor-field *::selection {
                        background-color: rgba(244, 154, 81, 0.35) !important;
                        color: inherit !important;
                    }
                `}</style>

                <div
                    ref={
                        editorRef
                    }

                    contentEditable

                    className="marker-editor-field"

                    suppressContentEditableWarning

                    spellCheck={
                        true
                    }

                    onInput={() => {
                        if (
                            !editorRef.current
                        ) {
                            return;
                        }

                        handleContentChange(
                            editorRef.current
                                .innerHTML
                        );

                        updateActiveFormats();
                        updateSelectionHandles();
                    }}

                    onKeyDown={
                        handleEditorKeyDown
                    }

                    onMouseUp={() => {
                        updateActiveFormats();
                        updateSelectionHandles();
                    }}

                    onKeyUp={() => {
                        updateActiveFormats();
                        updateSelectionHandles();
                    }}

                    style={{
                        width:
                            "100%",

                        height:
                            "100%",

                        overflowY:
                            "auto",

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

                        cursor:
                            "text",

                        whiteSpace:
                            "pre-wrap",

                        wordBreak:
                            "break-word",

                        position:
                            "relative",
                    }}
                >
                    {/* Actual editable content is managed by contentEditable. */}
                </div>

                {/* =====================================================
                    SELECTION HANDLES — VISUAL ONLY
                ====================================================== */}

                {selectionHandles && (
                    <>
                        {/* LEFT / START HANDLE */}

                        <div
                            style={{
                                position:
                                    "absolute",

                                left:
                                    selectionHandles
                                        .start
                                        .left,

                                top:
                                    selectionHandles
                                        .start
                                        .top,

                                width:
                                    "16px",

                                height:
                                    "20px",

                                transform:
                                    "translate(-50%, calc(-100% - 16px))",

                                pointerEvents:
                                    "none",

                                zIndex:
                                    50,
                            }}
                        >
                            {/* circular handle — TOP */}

                            <div
                                style={{
                                    position:
                                        "absolute",

                                    left:
                                        "3px",

                                    top:
                                        "0px",

                                    width:
                                        "10px",

                                    height:
                                        "10px",

                                    borderRadius:
                                        "50%",

                                    background:
                                        "#f49a51",

                                    boxShadow:
                                        "0 1px 3px rgba(0,0,0,0.22)",
                                }}
                            />

                            {/* vertical stem */}

                            <div
                                style={{
                                    position:
                                        "absolute",

                                    left:
                                        "7px",

                                    top:
                                        "8px",

                                    width:
                                        "2px",

                                    height:
                                        "10px",

                                    background:
                                        "#f49a51",

                                    borderRadius:
                                        "2px",
                                }}
                            />
                        </div>

                        {/* RIGHT / END HANDLE */}

                        <div
                            style={{
                                position:
                                    "absolute",

                                left:
                                    selectionHandles
                                        .end
                                        .left,

                                top:
                                    selectionHandles
                                        .end
                                        .top,

                                width:
                                    "16px",

                                height:
                                    "20px",

                                transform:
                                    "translate(-50%, 0)",

                                pointerEvents:
                                    "none",

                                zIndex:
                                    50,
                            }}
                        >
                            <div
                                style={{
                                    position:
                                        "absolute",

                                    left:
                                        "7px",

                                    top:
                                        "0px",

                                    width:
                                        "2px",

                                    height:
                                        "9px",

                                    background:
                                        "#f49a51",

                                    borderRadius:
                                        "2px",
                                }}
                            />

                            <div
                                style={{
                                    position:
                                        "absolute",

                                    left:
                                        "3px",

                                    top:
                                        "7px",

                                    width:
                                        "10px",

                                    height:
                                        "10px",

                                    borderRadius:
                                        "50%",

                                    background:
                                        "#f49a51",

                                    boxShadow:
                                        "0 1px 3px rgba(0,0,0,0.22)",
                                }}
                            />
                        </div>
                    </>
                )}
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
