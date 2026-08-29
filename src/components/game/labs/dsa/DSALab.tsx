"use client";

import {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";

import oilIcon from "@/assets/media/mise-en-place/icons/cooking-oil.png";
import riceIcon from "@/assets/media/mise-en-place/icons/rice.png";
import garlicIcon from "@/assets/media/mise-en-place/icons/onion.png";
import carrotIcon from "@/assets/media/mise-en-place/icons/carrot.png";
import eggIcon from "@/assets/media/mise-en-place/icons/egg.png";
import soyIcon from "@/assets/media/mise-en-place/icons/soy-sauce.png";
import greenOnionIcon from "@/assets/media/mise-en-place/icons/green-onion.png";

/*
 * ============================================================
 * TYPES
 * ============================================================
 */

interface WindowPosition {
    left: number;
    top: number;
    zIndex: number;
    centered: boolean;
}

interface DSALabProps {
    onClose: () => void;
    onFocus: () => void;
    onMove: (left: number, top: number) => void;
    windowPosition: WindowPosition;
}

type Topic =
    | "intro"
    | "bubble"
    | "quick"
    | "stack"
    | "hashmap"
    | "tree"
    | "search"
    | "game";

type AlgorithmMode =
    | "bubble"
    | "quick"
    | "search"
    | null;

/*
 * ============================================================
 * CONSTANTS
 * ============================================================
 */

const INITIAL_ARRAY = [
    8,
    3,
    7,
    4,
    9,
    2,
];

const SEARCH_ARRAY = [
    2,
    4,
    7,
    9,
    13,
    18,
];

const recipeIngredients = [
    {
        name: "Cooking Oil",
        short: "Oil",
        image: oilIcon,
    },
    {
        name: "Cut Garlic",
        short: "Garlic",
        image: garlicIcon,
    },
    {
        name: "Cut Carrot",
        short: "Carrot",
        image: carrotIcon,
    },
    {
        name: "Cold Rice",
        short: "Rice",
        image: riceIcon,
    },
    {
        name: "Egg",
        short: "Egg",
        image: eggIcon,
    },
    {
        name: "Soy Sauce",
        short: "Soy",
        image: soyIcon,
    },
    {
        name: "Green Onion",
        short: "Onion",
        image: greenOnionIcon,
    },
];

/*
 * ============================================================
 * HELPER
 * ============================================================
 */

function imageSrc(image: any) {
    return typeof image === "string"
        ? image
        : image?.src ?? "";
}

/*
 * ============================================================
 * MAIN COMPONENT
 * ============================================================
 */

export default function DSALab({
    onClose,
    onFocus,
    onMove,
    windowPosition,
}: DSALabProps) {

    /*
     * ========================================================
     * WINDOW DRAGGING
     * ========================================================
     */

    const dragState = useRef<{
        dragging: boolean;
        offsetX: number;
        offsetY: number;
    }>({
        dragging: false,
        offsetX: 0,
        offsetY: 0,
    });

    const handleTitleMouseDown = (
        event: React.MouseEvent<HTMLDivElement>
    ) => {

        /*
         * Do not start dragging when clicking buttons.
         */

        const target = event.target as HTMLElement;

        if (
            target.closest("button") ||
            target.closest("input")
        ) {
            return;
        }

        onFocus();

        const windowElement =
            event.currentTarget.parentElement;

        if (!windowElement) {
            return;
        }

        const rect =
            windowElement.getBoundingClientRect();

        dragState.current = {
            dragging: true,
            offsetX:
                event.clientX - rect.left,
            offsetY:
                event.clientY - rect.top,
        };

        document.body.style.userSelect = "none";
    };

    useEffect(() => {

        const handleMouseMove = (
            event: MouseEvent
        ) => {

            if (
                !dragState.current.dragging
            ) {
                return;
            }

            const nextLeft =
                event.clientX -
                dragState.current.offsetX;

            const nextTop =
                event.clientY -
                dragState.current.offsetY;

            onMove(
                nextLeft,
                nextTop
            );
        };

        const handleMouseUp = () => {

            if (
                dragState.current.dragging
            ) {

                dragState.current.dragging =
                    false;

                document.body.style.userSelect =
                    "";
            }
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

    }, [onMove]);

    /*
     * ========================================================
     * TOPIC
     * ========================================================
     */

    const [topic, setTopic] =
        useState<Topic>("intro");

    /*
     * ========================================================
     * ALGORITHM STATE
     * ========================================================
     */

    const [algorithmMode, setAlgorithmMode] =
        useState<AlgorithmMode>(null);

    const [array, setArray] =
        useState<number[]>(INITIAL_ARRAY);

    const [bubbleI, setBubbleI] =
        useState(0);

    const [bubbleJ, setBubbleJ] =
        useState(0);

    const [bubbleSorted, setBubbleSorted] =
        useState<number[]>([]);

    const [quickArray, setQuickArray] =
        useState<number[]>(INITIAL_ARRAY);

    const [quickLow, setQuickLow] =
        useState(0);

    const [quickHigh, setQuickHigh] =
        useState(INITIAL_ARRAY.length - 1);

    const [quickPivot, setQuickPivot] =
        useState<number | null>(null);

    const [quickI, setQuickI] =
        useState(0);

    const [quickJ, setQuickJ] =
        useState(0);

    const [quickDone, setQuickDone] =
        useState(false);

    const [searchTarget, setSearchTarget] =
        useState(13);

    const [searchIndex, setSearchIndex] =
        useState(0);

    const [searchFound, setSearchFound] =
        useState(false);

    const [searchFinished, setSearchFinished] =
        useState(false);

    /*
     * ========================================================
     * STACK
     * ========================================================
     */

    const [stack, setStack] =
        useState<string[]>([
            "Rice",
            "Carrot",
        ]);

    const [stackMessage, setStackMessage] =
        useState(
            "A stack follows LIFO: Last In, First Out."
        );

    /*
     * ========================================================
     * HASHMAP
     * ========================================================
     */

    const hashmap = useMemo(
        () => [
            {
                key: "oil",
                value: "Cooking Oil",
            },
            {
                key: "rice",
                value: "Cold Rice",
            },
            {
                key: "egg",
                value: "Egg",
            },
            {
                key: "soy",
                value: "Soy Sauce",
            },
        ],
        []
    );

    const [hashLookup, setHashLookup] =
        useState("rice");

    const [hashMessage, setHashMessage] =
        useState(
            "Enter a key and look it up."
        );

    /*
     * ========================================================
     * TREE
     * ========================================================
     */

    const treeNodes = [
        {
            value: 50,
            x: 50,
            y: 16,
        },
        {
            value: 30,
            x: 27,
            y: 40,
        },
        {
            value: 70,
            x: 73,
            y: 40,
        },
        {
            value: 20,
            x: 15,
            y: 66,
        },
        {
            value: 40,
            x: 39,
            y: 66,
        },
        {
            value: 60,
            x: 61,
            y: 66,
        },
        {
            value: 80,
            x: 85,
            y: 66,
        },
    ];

    const [treeSearch, setTreeSearch] =
        useState(60);

    const [treeVisited, setTreeVisited] =
        useState<number[]>([]);

    /*
     * ========================================================
     * RESET ALGORITHM
     * ========================================================
     */

    const resetAlgorithm = useCallback(() => {

        setArray(INITIAL_ARRAY);

        setBubbleI(0);
        setBubbleJ(0);
        setBubbleSorted([]);

        setQuickArray(INITIAL_ARRAY);
        setQuickLow(0);
        setQuickHigh(
            INITIAL_ARRAY.length - 1
        );
        setQuickPivot(null);
        setQuickI(0);
        setQuickJ(0);
        setQuickDone(false);

        setSearchIndex(0);
        setSearchFound(false);
        setSearchFinished(false);

    }, []);

    /*
     * ========================================================
     * BUBBLE SORT
     * ========================================================
     */

    const runBubbleStep = () => {

        const current =
            [...array];

        if (
            bubbleI >=
            current.length - 1
        ) {

            return;
        }

        if (
            bubbleJ >=
            current.length - 1 - bubbleI
        ) {

            setBubbleI(
                (value) => value + 1
            );

            setBubbleJ(0);

            return;
        }

        const a =
            bubbleJ;

        const b =
            bubbleJ + 1;

        if (
            current[a] >
            current[b]
        ) {

            [
                current[a],
                current[b],
            ] = [
                current[b],
                current[a],
            ];
        }

        setArray(current);

        setBubbleJ(
            (value) => value + 1
        );

        if (
            bubbleJ ===
            current.length - 2 - bubbleI
        ) {

            setBubbleSorted(
                (previous) => [
                    ...previous,
                    current.length -
                    1 -
                    bubbleI,
                ]
            );
        }
    };

    /*
     * ========================================================
     * QUICK SORT
     * ========================================================
     */

    const runQuickStep = () => {

        if (quickDone) {
            return;
        }

        const current =
            [...quickArray];

        if (
            quickPivot === null
        ) {

            const pivot =
                current[quickHigh];

            setQuickPivot(pivot);

            setQuickI(
                quickLow
            );

            setQuickJ(
                quickLow
            );

            return;
        }

        if (
            quickJ >=
            quickHigh
        ) {

            const pivotIndex =
                quickI;

            [
                current[pivotIndex],
                current[quickHigh],
            ] = [
                current[quickHigh],
                current[pivotIndex],
            ];

            setQuickArray(
                current
            );

            setQuickPivot(null);

            if (
                pivotIndex - 1 >
                quickLow
            ) {

                setQuickLow(
                    quickLow
                );

                setQuickHigh(
                    pivotIndex - 1
                );

            } else if (
                pivotIndex + 1 <
                quickHigh
            ) {

                setQuickLow(
                    pivotIndex + 1
                );

                setQuickHigh(
                    quickHigh
                );

            } else {

                setQuickDone(
                    true
                );
            }

            setQuickJ(
                quickLow
            );

            return;
        }

        if (
            current[quickJ] <
            (quickPivot ?? Infinity)
        ) {

            [
                current[quickI],
                current[quickJ],
            ] = [
                current[quickJ],
                current[quickI],
            ];

            setQuickI(
                (value) => value + 1
            );
        }

        setQuickJ(
            (value) => value + 1
        );

        setQuickArray(
            current
        );
    };

    /*
     * ========================================================
     * SEARCH
     * ========================================================
     */

    const runSearchStep = () => {

        if (
            searchFinished ||
            searchFound
        ) {
            return;
        }

        const value =
            SEARCH_ARRAY[searchIndex];

        if (
            value ===
            searchTarget
        ) {

            setSearchFound(
                true
            );

            return;
        }

        if (
            searchIndex >=
            SEARCH_ARRAY.length - 1
        ) {

            setSearchFinished(
                true
            );

            return;
        }

        setSearchIndex(
            (value) =>
                value + 1
        );
    };

    /*
     * ========================================================
     * STACK
     * ========================================================
     */

    const pushStack = () => {

        const items = [
            ...stack,
            "Egg",
        ];

        setStack(items);

        setStackMessage(
            "push(\"Egg\") → Egg is placed on top."
        );
    };

    const popStack = () => {

        if (
            stack.length === 0
        ) {

            setStackMessage(
                "Stack is empty."
            );

            return;
        }

        const removed =
            stack[stack.length - 1];

        setStack(
            stack.slice(
                0,
                -1
            )
        );

        setStackMessage(
            `pop() → ${removed} was removed from the top.`
        );
    };

    /*
     * ========================================================
     * HASHMAP LOOKUP
     * ========================================================
     */

    const lookupHash = () => {

        const result =
            hashmap.find(
                (item) =>
                    item.key ===
                    hashLookup
                        .trim()
                        .toLowerCase()
            );

        if (result) {

            setHashMessage(
                `Found "${hashLookup}" → ${result.value}`
            );

        } else {

            setHashMessage(
                `"${hashLookup}" is not present in the map.`
            );
        }
    };

    /*
     * ========================================================
     * TREE SEARCH
     * ========================================================
     */

    const runTreeSearch = () => {

        const path: number[] = [];

        let current =
            50;

        while (true) {

            path.push(
                current
            );

            if (
                current ===
                treeSearch
            ) {
                break;
            }

            if (
                treeSearch <
                current
            ) {

                current =
                    current === 50
                        ? 30
                        : current === 30
                            ? 20
                            : 40;

            } else {

                current =
                    current === 50
                        ? 70
                        : current === 70
                            ? 60
                            : 80;
            }

            if (
                path.length > 4
            ) {
                break;
            }
        }

        setTreeVisited(
            path
        );
    };

    /*
     * ========================================================
     * TOPIC DATA
     * ========================================================
     */

    const topicData: Record<
        Topic,
        {
            label: string;
            title: string;
            description: string;
        }
    > = {

        intro: {
            label: "Overview",
            title: "Data Structures & Algorithms",
            description:
                "A visual tour of the structures and algorithms used to organise data, solve problems and make software efficient.",
        },

        bubble: {
            label: "Sorting",
            title: "Bubble Sort",
            description:
                "Bubble Sort repeatedly compares neighbouring values and swaps them when they are in the wrong order.",
        },

        quick: {
            label: "Sorting",
            title: "Quick Sort",
            description:
                "Quick Sort chooses a pivot and partitions the data into values smaller and larger than that pivot.",
        },

        stack: {
            label: "Linear Structure",
            title: "Stack",
            description:
                "A Stack stores items using the LIFO rule: the last item inserted is the first item removed.",
        },

        hashmap: {
            label: "Key / Value",
            title: "HashMap",
            description:
                "A HashMap associates a key with a value, allowing fast lookup when the key is known.",
        },

        tree: {
            label: "Non-Linear Structure",
            title: "Binary Search Tree",
            description:
                "A Binary Search Tree organises values so smaller values go left and larger values go right.",
        },

        search: {
            label: "Searching",
            title: "Searching",
            description:
                "Searching algorithms determine whether a value exists and where it can be found.",
        },

        game: {
            label: "Sefirah",
            title: "DSA Inside Sefirah",
            description:
                "The cooking game uses DSA concepts to control the order of actions and keep gameplay predictable.",
        },
    };

    const currentTopic =
        topicData[topic];

    /*
     * ========================================================
     * NAVIGATION
     * ========================================================
     */

    const topics: Topic[] = [
        "intro",
        "bubble",
        "quick",
        "stack",
        "hashmap",
        "tree",
        "search",
        "game",
    ];

    const currentTopicIndex =
        topics.indexOf(topic);

    const nextTopic = () => {

        const next =
            topics[
                Math.min(
                    topics.length - 1,
                    currentTopicIndex + 1
                )
            ];

        setTopic(next);

        resetAlgorithm();
    };

    const previousTopic = () => {

        const previous =
            topics[
                Math.max(
                    0,
                    currentTopicIndex - 1
                )
            ];

        setTopic(previous);

        resetAlgorithm();
    };

    /*
     * ========================================================
     * CODE BLOCK
     * ========================================================
     */

    const codeLines: Record<
        Topic,
        string[]
    > = {

        intro: [
            "// DSA is about choosing the right",
            "// structure and algorithm for a problem.",
            "",
            "data = organizeData();",
            "result = solveProblem(data);",
        ],

        bubble: [
            "for (let i = 0; i < n - 1; i++) {",
            "  for (let j = 0; j < n - 1 - i; j++) {",
            "    if (arr[j] > arr[j + 1]) {",
            "      swap(arr[j], arr[j + 1]);",
            "    }",
            "  }",
            "}",
        ],

        quick: [
            "function quickSort(arr, low, high) {",
            "  if (low >= high) return;",
            "",
            "  const pivot = arr[high];",
            "  const index = partition(arr, pivot);",
            "",
            "  quickSort(arr, low, index - 1);",
            "  quickSort(arr, index + 1, high);",
            "}",
        ],

        stack: [
            "const stack = [];",
            "",
            "stack.push(item);",
            "",
            "const top = stack[",
            "  stack.length - 1",
            "];",
            "",
            "stack.pop();",
        ],

        hashmap: [
            "const ingredients = new Map();",
            "",
            "ingredients.set(",
            '  "rice",',
            '  "Cold Rice"',
            ");",
            "",
            'ingredients.get("rice");',
        ],

        tree: [
            "function search(node, value) {",
            "  if (!node) return false;",
            "",
            "  if (value === node.value)",
            "    return true;",
            "",
            "  if (value < node.value)",
            "    return search(node.left, value);",
            "",
            "  return search(node.right, value);",
            "}",
        ],

        search: [
            "for (let i = 0; i < arr.length; i++) {",
            "",
            "  if (arr[i] === target) {",
            "    return i;",
            "  }",
            "",
            "}",
            "",
            "return -1;",
        ],

        game: [
            "const recipe = [",
            '  "cooking_oil",',
            '  "cut_garlic",',
            '  "cut_carrot",',
            '  "rice",',
            '  "egg",',
            '  "soy_sauce",',
            '  "cut_green_onion",',
            '  "stir"',
            "];",
            "",
            "queue.enqueue(action);",
            "",
            "const next = queue.peek();",
        ],
    };

    /*
     * ========================================================
     * ACTIVE CODE LINE
     * ========================================================
     */

    const activeCodeLine = useMemo(() => {

        switch (topic) {

            case "bubble":
                return Math.min(
                    3 + bubbleJ,
                    5
                );

            case "quick":
                if (
                    quickDone
                ) {
                    return 9;
                }

                if (
                    quickPivot === null
                ) {
                    return 4;
                }

                return quickJ < quickHigh
                    ? 5
                    : 6;

            case "search":
                return searchFound
                    ? 3
                    : searchFinished
                        ? 9
                        : 2;

            case "stack":
                return 3;

            case "hashmap":
                return 8;

            case "tree":
                return 8;

            case "game":
                return 15;

            default:
                return 1;
        }

    }, [
        topic,
        bubbleJ,
        quickDone,
        quickPivot,
        quickJ,
        quickHigh,
        searchFound,
        searchFinished,
    ]);

    /*
     * ========================================================
     * RENDER
     * ========================================================
     */

    return (
        <div
            onMouseDown={onFocus}
            style={{
                position: "fixed",

                left:
                    windowPosition.centered
                        ? "50%"
                        : `${windowPosition.left}px`,

                top:
                    windowPosition.centered
                        ? "50%"
                        : `${windowPosition.top}px`,

                transform:
                    windowPosition.centered
                        ? "translate(-50%, -50%)"
                        : "none",

                width:
                    "min(1180px, 88vw)",

                height:
                    "min(760px, 82vh)",

                minWidth:
                    "900px",

                minHeight:
                    "600px",

                zIndex:
                    windowPosition.zIndex,

                display:
                    "flex",

                flexDirection:
                    "column",

                overflow:
                    "hidden",

                borderRadius:
                    "2px",

                border:
                    "1px solid rgba(0,0,0,0.18)",

                background:
                    "#ffffff",

                boxShadow:
                    "0 30px 80px rgba(0,0,0,0.40)",

                fontFamily:
                    "Arial, Helvetica, sans-serif",
            }}
        >

            {/* =================================================
                TRANSLUCENT TITLE BAR
            ================================================= */}

            <div
                onMouseDown={
                    handleTitleMouseDown
                }
                style={{
                    height:
                        "44px",

                    flexShrink:
                        0,

                    display:
                        "flex",

                    alignItems:
                        "center",

                    justifyContent:
                        "space-between",

                    padding:
                        "0 12px 0 16px",

                    background:
                        "rgba(255,255,255,0.76)",

                    backdropFilter:
                        "blur(22px)",

                    WebkitBackdropFilter:
                        "blur(22px)",

                    borderBottom:
                        "1px solid rgba(0,0,0,0.10)",

                    cursor:
                        "grab",

                    userSelect:
                        "none",
                }}
            >

                <div
                    style={{
                        display:
                            "flex",

                        alignItems:
                            "center",

                        gap:
                            "10px",
                    }}
                >

                    <div
                        style={{
                            width:
                                "22px",

                            height:
                                "22px",

                            borderRadius:
                                "5px",

                            display:
                                "flex",

                            alignItems:
                                "center",

                            justifyContent:
                                "center",

                            background:
                                "#2f8d46",

                            color:
                                "#ffffff",

                            fontSize:
                                "12px",

                            fontWeight:
                                800,
                        }}
                    >
                        G
                    </div>

                    <span
                        style={{
                            color:
                                "#222",

                            fontSize:
                                "13px",

                            fontWeight:
                                700,
                        }}
                    >
                        Data Structures Lab
                    </span>

                    <span
                        style={{
                            color:
                                "#777",

                            fontSize:
                                "11px",
                        }}
                    >
                        Sefirah
                    </span>

                </div>

                <button
                    type="button"
                    onClick={(event) => {
                        event.stopPropagation();
                        onClose();
                    }}
                    style={{
                        width:
                            "30px",

                        height:
                            "30px",

                        border:
                            "none",

                        borderRadius:
                            "6px",

                        background:
                            "transparent",

                        color:
                            "#333",

                        fontSize:
                            "20px",

                        lineHeight:
                            1,

                        cursor:
                            "pointer",

                        display:
                            "flex",

                        alignItems:
                            "center",

                        justifyContent:
                            "center",
                    }}
                    onMouseEnter={(event) => {
                        event.currentTarget.style.background =
                            "#e81123";
                        event.currentTarget.style.color =
                            "#ffffff";
                    }}
                    onMouseLeave={(event) => {
                        event.currentTarget.style.background =
                            "transparent";
                        event.currentTarget.style.color =
                            "#333";
                    }}
                >
                    ×
                </button>

            </div>

            {/* =================================================
                APP BODY
            ================================================= */}

            <div
                style={{
                    flex:
                        1,

                    minHeight:
                        0,

                    display:
                        "flex",

                    overflow:
                        "hidden",

                    background:
                        "#f7f7f7",
                }}
            >

                {/* =================================================
                    SIDEBAR
                ================================================= */}

                <aside
                    style={{
                        width:
                            "205px",

                        flexShrink:
                            0,

                        overflowY:
                            "auto",

                        background:
                            "#ffffff",

                        borderRight:
                            "1px solid #dddddd",

                        padding:
                            "18px 10px",
                    }}
                >

                    <div
                        style={{
                            padding:
                                "4px 10px 12px",

                            color:
                                "#222",

                            fontSize:
                                "12px",

                            fontWeight:
                                800,

                            textTransform:
                                "uppercase",

                            letterSpacing:
                                "0.05em",
                        }}
                    >
                        DSA Topics
                    </div>

                    {topics.map(
                        (item) => {

                            const data =
                                topicData[item];

                            const active =
                                topic === item;

                            return (
                                <button
                                    key={item}
                                    type="button"
                                    onClick={() => {
                                        setTopic(item);
                                        resetAlgorithm();
                                    }}
                                    style={{
                                        width:
                                            "100%",

                                        border:
                                            "none",

                                        borderRadius:
                                            "5px",

                                        padding:
                                            "10px",

                                        marginBottom:
                                            "3px",

                                        textAlign:
                                            "left",

                                        cursor:
                                            "pointer",

                                        background:
                                            active
                                                ? "#e8f5e9"
                                                : "transparent",

                                        color:
                                            active
                                                ? "#218739"
                                                : "#333",

                                        fontSize:
                                            "13px",

                                        fontWeight:
                                            active
                                                ? 700
                                                : 500,
                                    }}
                                >
                                    {data.title}
                                </button>
                            );
                        }
                    )}

                    <div
                        style={{
                            margin:
                                "18px 10px 10px",

                            height:
                                "1px",

                            background:
                                "#e3e3e3",
                        }}
                    />

                    <div
                        style={{
                            padding:
                                "0 10px",

                            color:
                                "#777",

                            fontSize:
                                "11px",

                            lineHeight:
                                1.5,
                        }}
                    >
                        Interactive examples demonstrate
                        how the algorithm changes data
                        step by step.
                    </div>

                </aside>

                {/* =================================================
                    MAIN CONTENT
                ================================================= */}

                <section
                    style={{
                        flex:
                            1,

                        minWidth:
                            0,

                        overflowY:
                            "auto",

                        padding:
                            "30px 34px 80px",

                        background:
                            "#ffffff",
                    }}
                >

                    {/* =================================================
                        HEADER
                    ================================================= */}

                    <div
                        style={{
                            maxWidth:
                                "980px",

                            margin:
                                "0 auto",
                        }}
                    >

                        <div
                            style={{
                                color:
                                    "#2f8d46",

                                fontSize:
                                    "12px",

                                fontWeight:
                                    800,

                                textTransform:
                                    "uppercase",

                                letterSpacing:
                                    "0.06em",

                                marginBottom:
                                    "7px",
                            }}
                        >
                            {currentTopic.label}
                        </div>

                        <h1
                            style={{
                                margin:
                                    0,

                                color:
                                    "#1d1d1d",

                                fontSize:
                                    "31px",

                                lineHeight:
                                    1.2,

                                fontWeight:
                                    700,
                            }}
                        >
                            {currentTopic.title}
                        </h1>

                        <p
                            style={{
                                maxWidth:
                                    "850px",

                                margin:
                                    "12px 0 0",

                                color:
                                    "#555",

                                fontSize:
                                    "15px",

                                lineHeight:
                                    1.7,
                            }}
                        >
                            {currentTopic.description}
                        </p>

                        {/* =================================================
                            INTRO
                        ================================================= */}

                        {topic === "intro" && (
                            <div
                                style={{
                                    marginTop:
                                        "32px",
                                }}
                            >

                                <InfoCard
                                    title="Why DSA matters"
                                    text="Data Structures determine how information is stored. Algorithms determine how we operate on that information. A good combination can make a program faster, cleaner and easier to maintain."
                                />

                                <div
                                    style={{
                                        display:
                                            "grid",

                                        gridTemplateColumns:
                                            "repeat(3, 1fr)",

                                        gap:
                                            "16px",

                                        marginTop:
                                            "20px",
                                    }}
                                >

                                    <ConceptCard
                                        title="Data Structure"
                                        text="How data is organised."
                                    />

                                    <ConceptCard
                                        title="Algorithm"
                                        text="How a problem is solved."
                                    />

                                    <ConceptCard
                                        title="Complexity"
                                        text="How the solution behaves as data grows."
                                    />

                                </div>

                                <div
                                    style={{
                                        marginTop:
                                            "26px",

                                        padding:
                                            "20px",

                                        background:
                                            "#f6f8f6",

                                        borderLeft:
                                            "4px solid #2f8d46",
                                    }}
                                >

                                    <strong>
                                        Simple example:
                                    </strong>

                                    <p
                                        style={{
                                            margin:
                                                "8px 0 0",

                                            color:
                                                "#555",

                                            lineHeight:
                                                1.7,
                                        }}
                                    >
                                        Imagine looking for one ingredient
                                        inside a box. You could inspect every
                                        item one by one, or use a structure
                                        designed for quick lookup. DSA is about
                                        making that choice deliberately.
                                    </p>

                                </div>

                            </div>
                        )}

                        {/* =================================================
                            BUBBLE SORT
                        ================================================= */}

                        {topic === "bubble" && (
                            <AlgorithmSection
                                explanation="Bubble Sort is easy to understand because every step is visible: compare two neighbours, swap them if necessary, then continue through the array."
                                complexity="Worst case: O(n²)"
                                onRun={() => {
                                    setAlgorithmMode("bubble");
                                    runBubbleStep();
                                }}
                                onReset={() => {
                                    resetAlgorithm();
                                    setAlgorithmMode(null);
                                }}
                                running={algorithmMode === "bubble"}
                                code={codeLines.bubble}
                                activeLine={activeCodeLine}
                            >
                                <BubbleVisualizer
                                    array={array}
                                    activeA={
                                        bubbleJ
                                    }
                                    activeB={
                                        bubbleJ + 1
                                    }
                                    sorted={
                                        bubbleSorted
                                    }
                                />
                            </AlgorithmSection>
                        )}

                        {/* =================================================
                            QUICK SORT
                        ================================================= */}

                        {topic === "quick" && (
                            <AlgorithmSection
                                explanation="Quick Sort does not compare every pair. Instead, it selects a pivot and rearranges values around it. This allows large datasets to be divided into smaller problems."
                                complexity="Average: O(n log n) • Worst: O(n²)"
                                onRun={() => {
                                    setAlgorithmMode("quick");
                                    runQuickStep();
                                }}
                                onReset={() => {
                                    resetAlgorithm();
                                    setAlgorithmMode(null);
                                }}
                                running={algorithmMode === "quick"}
                                code={codeLines.quick}
                                activeLine={activeCodeLine}
                            >
                                <QuickVisualizer
                                    array={
                                        quickArray
                                    }
                                    pivot={
                                        quickPivot
                                    }
                                    i={
                                        quickI
                                    }
                                    j={
                                        quickJ
                                    }
                                    low={
                                        quickLow
                                    }
                                    high={
                                        quickHigh
                                    }
                                    done={
                                        quickDone
                                    }
                                />
                            </AlgorithmSection>
                        )}

                        {/* =================================================
                            STACK
                        ================================================= */}

                        {topic === "stack" && (
                            <>
                                <InfoCard
                                    title="LIFO — Last In, First Out"
                                    text="A stack behaves like a pile of plates. You add to the top and you remove from the top."
                                />

                                <div
                                    style={{
                                        display:
                                            "grid",

                                        gridTemplateColumns:
                                            "1fr 1fr",

                                        gap:
                                            "24px",

                                        marginTop:
                                            "25px",
                                    }}
                                >

                                    <CodePanel
                                        code={
                                            codeLines.stack
                                        }
                                        activeLine={
                                            3
                                        }
                                    />

                                    <div>
                                        <h3>
                                            Interactive Stack
                                        </h3>

                                        <p
                                            style={{
                                                color:
                                                    "#666",

                                                lineHeight:
                                                    1.6,
                                            }}
                                        >
                                            Push an ingredient
                                            onto the stack or
                                            pop the top one.
                                        </p>

                                        <div
                                            style={{
                                                display:
                                                    "flex",

                                                alignItems:
                                                    "flex-end",

                                                justifyContent:
                                                    "center",

                                                minHeight:
                                                    "310px",

                                                border:
                                                    "1px solid #ddd",

                                                background:
                                                    "#fafafa",

                                                padding:
                                                    "20px",
                                            }}
                                        >

                                            <div
                                                style={{
                                                    width:
                                                        "180px",

                                                    minHeight:
                                                        "230px",

                                                    border:
                                                        "3px solid #222",

                                                    borderTop:
                                                        "none",

                                                    display:
                                                        "flex",

                                                    flexDirection:
                                                        "column-reverse",

                                                    justifyContent:
                                                        "flex-start",

                                                    padding:
                                                        "8px",
                                                }}
                                            >

                                                {stack.map(
                                                    (
                                                        item,
                                                        index
                                                    ) => (
                                                        <div
                                                            key={`${item}-${index}`}
                                                            style={{
                                                                padding:
                                                                    "12px",

                                                                marginTop:
                                                                    "5px",

                                                                background:
                                                                    "#e8f5e9",

                                                                border:
                                                                    "1px solid #2f8d46",

                                                                textAlign:
                                                                    "center",

                                                                fontWeight:
                                                                    700,

                                                                color:
                                                                    "#267a39",
                                                            }}
                                                        >
                                                            {item}
                                                        </div>
                                                    )
                                                )}

                                            </div>

                                        </div>

                                        <div
                                            style={{
                                                display:
                                                    "flex",

                                                gap:
                                                    "8px",

                                                marginTop:
                                                    "12px",
                                            }}
                                        >

                                            <GreenButton
                                                onClick={
                                                    pushStack
                                                }
                                            >
                                                push("Egg")
                                            </GreenButton>

                                            <button
                                                onClick={
                                                    popStack
                                                }
                                                style={
                                                    secondaryButton
                                                }
                                            >
                                                pop()
                                            </button>

                                        </div>

                                        <div
                                            style={{
                                                marginTop:
                                                    "12px",

                                                padding:
                                                    "12px",

                                                background:
                                                    "#f5f5f5",

                                                fontFamily:
                                                    "monospace",

                                                fontSize:
                                                    "12px",
                                            }}
                                        >
                                            {stackMessage}
                                        </div>

                                    </div>

                                </div>
                            </>
                        )}

                        {/* =================================================
                            HASHMAP
                        ================================================= */}

                        {topic === "hashmap" && (
                            <>
                                <InfoCard
                                    title="Key → Value"
                                    text="A HashMap stores information as key/value pairs. Instead of scanning every ingredient, we can ask directly for the value associated with a key."
                                />

                                <div
                                    style={{
                                        display:
                                            "grid",

                                        gridTemplateColumns:
                                            "1fr 1fr",

                                        gap:
                                            "24px",

                                        marginTop:
                                            "25px",
                                    }}
                                >

                                    <CodePanel
                                        code={
                                            codeLines.hashmap
                                        }
                                        activeLine={
                                            8
                                        }
                                    />

                                    <div>

                                        <h3>
                                            HashMap Visualizer
                                        </h3>

                                        <div
                                            style={{
                                                border:
                                                    "1px solid #ddd",
                                            }}
                                        >

                                            {hashmap.map(
                                                (item) => (
                                                    <div
                                                        key={
                                                            item.key
                                                        }
                                                        style={{
                                                            display:
                                                                "grid",

                                                            gridTemplateColumns:
                                                                "110px 1fr",

                                                            borderBottom:
                                                                "1px solid #eee",

                                                            padding:
                                                                "13px 15px",
                                                        }}
                                                    >
                                                        <strong>
                                                            {item.key}
                                                        </strong>

                                                        <span>
                                                            {item.value}
                                                        </span>
                                                    </div>
                                                )
                                            )}

                                        </div>

                                        <div
                                            style={{
                                                marginTop:
                                                    "15px",

                                                display:
                                                    "flex",

                                                gap:
                                                    "8px",
                                            }}
                                        >

                                            <input
                                                value={
                                                    hashLookup
                                                }
                                                onChange={(event) =>
                                                    setHashLookup(
                                                        event.target.value
                                                    )
                                                }
                                                placeholder="rice"
                                                style={{
                                                    flex:
                                                        1,

                                                    padding:
                                                        "10px",

                                                    border:
                                                        "1px solid #ccc",

                                                    fontSize:
                                                        "14px",
                                                }}
                                            />

                                            <GreenButton
                                                onClick={
                                                    lookupHash
                                                }
                                            >
                                                Lookup
                                            </GreenButton>

                                        </div>

                                        <div
                                            style={{
                                                marginTop:
                                                    "10px",

                                                color:
                                                    "#2f8d46",

                                                fontWeight:
                                                    700,

                                                fontSize:
                                                    "13px",
                                            }}
                                        >
                                            {hashMessage}
                                        </div>

                                    </div>

                                </div>
                            </>
                        )}

                        {/* =================================================
                            TREE
                        ================================================= */}

                        {topic === "tree" && (
                            <>
                                <InfoCard
                                    title="Binary Search Tree"
                                    text="Every node has at most two children. Values smaller than a node move left; larger values move right. This lets us eliminate large portions of the tree while searching."
                                />

                                <div
                                    style={{
                                        display:
                                            "grid",

                                        gridTemplateColumns:
                                            "1fr 1fr",

                                        gap:
                                            "24px",

                                        marginTop:
                                            "25px",
                                    }}
                                >

                                    <CodePanel
                                        code={
                                            codeLines.tree
                                        }
                                        activeLine={
                                            8
                                        }
                                    />

                                    <div>

                                        <h3>
                                            Search the Tree
                                        </h3>

                                        <div
                                            style={{
                                                position:
                                                    "relative",

                                                height:
                                                    "340px",

                                                border:
                                                    "1px solid #ddd",

                                                background:
                                                    "#fafafa",
                                            }}
                                        >

                                            <svg
                                                viewBox="0 0 100 100"
                                                preserveAspectRatio="none"
                                                style={{
                                                    position:
                                                        "absolute",

                                                    inset:
                                                        "0",

                                                    width:
                                                        "100%",

                                                    height:
                                                        "100%",
                                                }}
                                            >

                                                <line
                                                    x1="50"
                                                    y1="19"
                                                    x2="27"
                                                    y2="40"
                                                    stroke="#999"
                                                    strokeWidth="0.7"
                                                />

                                                <line
                                                    x1="50"
                                                    y1="19"
                                                    x2="73"
                                                    y2="40"
                                                    stroke="#999"
                                                    strokeWidth="0.7"
                                                />

                                                <line
                                                    x1="27"
                                                    y1="43"
                                                    x2="15"
                                                    y2="66"
                                                    stroke="#999"
                                                    strokeWidth="0.7"
                                                />

                                                <line
                                                    x1="27"
                                                    y1="43"
                                                    x2="39"
                                                    y2="66"
                                                    stroke="#999"
                                                    strokeWidth="0.7"
                                                />

                                                <line
                                                    x1="73"
                                                    y1="43"
                                                    x2="61"
                                                    y2="66"
                                                    stroke="#999"
                                                    strokeWidth="0.7"
                                                />

                                                <line
                                                    x1="73"
                                                    y1="43"
                                                    x2="85"
                                                    y2="66"
                                                    stroke="#999"
                                                    strokeWidth="0.7"
                                                />

                                            </svg>

                                            {treeNodes.map(
                                                (node) => {

                                                    const active =
                                                        treeVisited.includes(
                                                            node.value
                                                        );

                                                    return (
                                                        <div
                                                            key={
                                                                node.value
                                                            }
                                                            style={{
                                                                position:
                                                                    "absolute",

                                                                left:
                                                                    `${node.x}%`,

                                                                top:
                                                                    `${node.y}%`,

                                                                transform:
                                                                    "translate(-50%, -50%)",

                                                                width:
                                                                    "44px",

                                                                height:
                                                                    "44px",

                                                                borderRadius:
                                                                    "50%",

                                                                display:
                                                                    "flex",

                                                                alignItems:
                                                                    "center",

                                                                justifyContent:
                                                                    "center",

                                                                background:
                                                                    active
                                                                        ? "#2f8d46"
                                                                        : "#ffffff",

                                                                color:
                                                                    active
                                                                        ? "#ffffff"
                                                                        : "#222",

                                                                border:
                                                                    "2px solid #2f8d46",

                                                                fontWeight:
                                                                    800,

                                                                zIndex:
                                                                    2,

                                                                transition:
                                                                    "all 250ms ease",
                                                            }}
                                                        >
                                                            {node.value}
                                                        </div>
                                                    );
                                                }
                                            )}

                                        </div>

                                        <div
                                            style={{
                                                display:
                                                    "flex",

                                                gap:
                                                    "8px",

                                                marginTop:
                                                    "12px",
                                            }}
                                        >

                                            <input
                                                type="number"
                                                value={
                                                    treeSearch
                                                }
                                                onChange={(event) =>
                                                    setTreeSearch(
                                                        Number(
                                                            event.target.value
                                                        )
                                                    )
                                                }
                                                style={{
                                                    width:
                                                        "100px",

                                                    padding:
                                                        "10px",

                                                    border:
                                                        "1px solid #ccc",
                                                }}
                                            />

                                            <GreenButton
                                                onClick={
                                                    runTreeSearch
                                                }
                                            >
                                                Search Tree
                                            </GreenButton>

                                        </div>

                                        {treeVisited.length >
                                            0 && (
                                            <p
                                                style={{
                                                    color:
                                                        "#2f8d46",

                                                    fontWeight:
                                                        700,

                                                    fontSize:
                                                        "13px",
                                                }}
                                            >
                                                Path:{" "}
                                                {treeVisited.join(
                                                    " → "
                                                )}
                                            </p>
                                        )}

                                    </div>

                                </div>
                            </>
                        )}

                        {/* =================================================
                            SEARCH
                        ================================================= */}

                        {topic === "search" && (
                            <AlgorithmSection
                                explanation="Linear Search checks values one at a time until the target is found. It is simple, but the number of checks grows with the size of the dataset."
                                complexity="Time: O(n)"
                                onRun={() => {
                                    setAlgorithmMode("search");
                                    runSearchStep();
                                }}
                                onReset={() => {
                                    resetAlgorithm();
                                    setAlgorithmMode(null);
                                }}
                                running={algorithmMode === "search"}
                                code={codeLines.search}
                                activeLine={activeCodeLine}
                            >
                                <SearchVisualizer
                                    array={
                                        SEARCH_ARRAY
                                    }
                                    index={
                                        searchIndex
                                    }
                                    target={
                                        searchTarget
                                    }
                                    found={
                                        searchFound
                                    }
                                    finished={
                                        searchFinished
                                    }
                                    setTarget={
                                        setSearchTarget
                                    }
                                />
                            </AlgorithmSection>
                        )}

                        {/* =================================================
                            GAME APPLICATION
                        ================================================= */}

                        {topic === "game" && (
                            <>
                                <InfoCard
                                    title="Where DSA actually appears in Sefirah"
                                    text="The strongest example in the cooking game is the recipe queue. Cooking actions have to happen in a specific order. The queue makes that order explicit and prevents the player from performing a later action before the required earlier action."
                                />

                                <div
                                    style={{
                                        display:
                                            "grid",

                                        gridTemplateColumns:
                                            "1fr 1fr",

                                        gap:
                                            "24px",

                                        marginTop:
                                            "25px",
                                    }}
                                >

                                    <CodePanel
                                        code={
                                            codeLines.game
                                        }
                                        activeLine={
                                            15
                                        }
                                    />

                                    <div>

                                        <h3>
                                            Recipe Queue
                                        </h3>

                                        <p
                                            style={{
                                                color:
                                                    "#666",

                                                lineHeight:
                                                    1.6,
                                            }}
                                        >
                                            Each ingredient/action
                                            waits for its turn.
                                            The front of the queue
                                            represents the next
                                            valid cooking action.
                                        </p>

                                        <div
                                            style={{
                                                border:
                                                    "1px solid #ddd",

                                                padding:
                                                    "16px",

                                                background:
                                                    "#fafafa",
                                            }}
                                        >

                                            {recipeIngredients.map(
                                                (
                                                    ingredient,
                                                    index
                                                ) => {

                                                    const isFront =
                                                        index === 0;

                                                    return (
                                                        <div
                                                            key={
                                                                ingredient.name
                                                            }
                                                            style={{
                                                                display:
                                                                    "flex",

                                                                alignItems:
                                                                    "center",

                                                                gap:
                                                                    "12px",

                                                                padding:
                                                                    "10px",

                                                                marginBottom:
                                                                    "7px",

                                                                background:
                                                                    isFront
                                                                        ? "#e8f5e9"
                                                                        : "#ffffff",

                                                                border:
                                                                    isFront
                                                                        ? "2px solid #2f8d46"
                                                                        : "1px solid #ddd",

                                                                borderRadius:
                                                                    "5px",

                                                                transform:
                                                                    isFront
                                                                        ? "translateX(8px)"
                                                                        : "none",

                                                                transition:
                                                                    "all 250ms ease",
                                                            }}
                                                        >

                                                            <img
                                                                src={
                                                                    imageSrc(
                                                                        ingredient.image
                                                                    )
                                                                }
                                                                alt={
                                                                    ingredient.name
                                                                }
                                                                style={{
                                                                    width:
                                                                        "42px",

                                                                    height:
                                                                        "42px",

                                                                    objectFit:
                                                                        "contain",
                                                                }}
                                                            />

                                                            <div
                                                                style={{
                                                                    flex:
                                                                        1,
                                                                }}
                                                            >
                                                                <strong>
                                                                    {ingredient.name}
                                                                </strong>

                                                                <div
                                                                    style={{
                                                                        color:
                                                                            "#777",

                                                                        fontSize:
                                                                            "11px",

                                                                        marginTop:
                                                                            "2px",
                                                                    }}
                                                                >
                                                                    Step{" "}
                                                                    {index +
                                                                        1}
                                                                </div>
                                                            </div>

                                                            {isFront && (
                                                                <span
                                                                    style={{
                                                                        color:
                                                                            "#2f8d46",

                                                                        fontSize:
                                                                            "11px",

                                                                        fontWeight:
                                                                            800,

                                                                        textTransform:
                                                                            "uppercase",
                                                                    }}
                                                                >
                                                                    PEEK
                                                                </span>
                                                            )}

                                                        </div>
                                                    );
                                                }
                                            )}

                                        </div>

                                    </div>

                                </div>

                                <div
                                    style={{
                                        marginTop:
                                            "30px",

                                        padding:
                                            "20px",

                                        border:
                                            "1px solid #ddd",

                                        background:
                                            "#ffffff",
                                    }}
                                >

                                    <h3
                                        style={{
                                            marginTop:
                                                0,
                                        }}
                                    >
                                        Why this matters
                                    </h3>

                                    <div
                                        style={{
                                            display:
                                                "grid",

                                            gridTemplateColumns:
                                                "repeat(3, 1fr)",

                                            gap:
                                                "15px",
                                        }}
                                    >

                                        <GamePoint
                                            number="01"
                                            title="Correct order"
                                            text="The queue prevents future recipe actions from becoming available too early."
                                        />

                                        <GamePoint
                                            number="02"
                                            title="State tracking"
                                            text="Completed actions are tracked so the queue can be reconstructed when the player returns."
                                        />

                                        <GamePoint
                                            number="03"
                                            title="Predictable logic"
                                            text="peek() tells the game exactly what action should be accepted next."
                                        />

                                    </div>

                                </div>

                                <div
                                    style={{
                                        marginTop:
                                            "25px",

                                        padding:
                                            "18px",

                                        background:
                                            "#1f1f1f",

                                        color:
                                            "#ffffff",

                                        borderRadius:
                                            "5px",
                                    }}
                                >

                                    <div
                                        style={{
                                            color:
                                                "#7bd88f",

                                            fontSize:
                                                "11px",

                                            fontWeight:
                                                800,

                                            marginBottom:
                                                "8px",

                                            textTransform:
                                                "uppercase",
                                        }}
                                    >
                                        The important idea
                                    </div>

                                    <div
                                        style={{
                                            fontSize:
                                                "18px",

                                            lineHeight:
                                                1.5,
                                        }}
                                    >
                                        DSA is not just something
                                        implemented for a lab.
                                        It becomes useful when the
                                        problem naturally requires
                                        a particular way of organising
                                        information.
                                    </div>

                                </div>

                            </>
                        )}

                        {/* =================================================
                            FOOTER NAVIGATION
                        ================================================= */}

                        <div
                            style={{
                                display:
                                    "flex",

                                justifyContent:
                                    "space-between",

                                marginTop:
                                    "45px",

                                paddingTop:
                                    "20px",

                                borderTop:
                                    "1px solid #ddd",
                            }}
                        >

                            <button
                                type="button"
                                onClick={
                                    previousTopic
                                }
                                disabled={
                                    currentTopicIndex ===
                                    0
                                }
                                style={{
                                    ...secondaryButton,

                                    opacity:
                                        currentTopicIndex ===
                                        0
                                            ? 0.4
                                            : 1,
                                }}
                            >
                                ← Previous
                            </button>

                            <span
                                style={{
                                    alignSelf:
                                        "center",

                                    color:
                                        "#999",

                                    fontSize:
                                        "12px",
                                }}
                            >
                                {currentTopicIndex +
                                    1}{" "}
                                /{" "}
                                {topics.length}
                            </span>

                            <button
                                type="button"
                                onClick={
                                    nextTopic
                                }
                                disabled={
                                    currentTopicIndex ===
                                    topics.length - 1
                                }
                                style={{
                                    ...secondaryButton,

                                    opacity:
                                        currentTopicIndex ===
                                        topics.length - 1
                                            ? 0.4
                                            : 1,
                                }}
                            >
                                Next →
                            </button>

                        </div>

                    </div>

                </section>

            </div>

        </div>
    );
}

/*
 * ============================================================
 * REUSABLE COMPONENTS
 * ============================================================
 */

function InfoCard({
    title,
    text,
}: {
    title: string;
    text: string;
}) {
    return (
        <div
            style={{
                marginTop:
                    "26px",

                padding:
                    "18px 20px",

                background:
                    "#f1f8f3",

                borderLeft:
                    "4px solid #2f8d46",
            }}
        >

            <strong
                style={{
                    color:
                        "#1f6f32",
                }}
            >
                {title}
            </strong>

            <p
                style={{
                    margin:
                        "8px 0 0",

                    color:
                        "#555",

                    lineHeight:
                        1.7,
                }}
            >
                {text}
            </p>

        </div>
    );
}

function ConceptCard({
    title,
    text,
}: {
    title: string;
    text: string;
}) {
    return (
        <div
            style={{
                padding:
                    "18px",

                border:
                    "1px solid #ddd",

                background:
                    "#fff",
            }}
        >

            <div
                style={{
                    color:
                        "#2f8d46",

                    fontWeight:
                        800,

                    marginBottom:
                        "7px",
                }}
            >
                {title}
            </div>

            <div
                style={{
                    color:
                        "#666",

                    fontSize:
                        "13px",

                    lineHeight:
                        1.5,
                }}
            >
                {text}
            </div>

        </div>
    );
}

function GamePoint({
    number,
    title,
    text,
}: {
    number: string;
    title: string;
    text: string;
}) {
    return (
        <div>

            <div
                style={{
                    color:
                        "#2f8d46",

                    fontFamily:
                        "monospace",

                    fontWeight:
                        800,

                    fontSize:
                        "12px",

                    marginBottom:
                        "5px",
                }}
            >
                {number}
            </div>

            <strong>
                {title}
            </strong>

            <p
                style={{
                    color:
                        "#666",

                    fontSize:
                        "12px",

                    lineHeight:
                        1.6,
                }}
            >
                {text}
            </p>

        </div>
    );
}

function CodePanel({
    code,
    activeLine,
}: {
    code: string[];
    activeLine: number;
}) {
    return (
        <div>

            <div
                style={{
                    display:
                        "flex",

                    justifyContent:
                        "space-between",

                    padding:
                        "10px 12px",

                    background:
                        "#222",

                    color:
                        "#fff",

                    fontSize:
                        "11px",

                    fontWeight:
                        700,
                }}
            >
                <span>
                    IMPLEMENTATION
                </span>

                <span
                    style={{
                        color:
                            "#7bd88f",
                    }}
                >
                    JavaScript
                </span>
            </div>

            <pre
                style={{
                    margin:
                        0,

                    padding:
                        "15px 0",

                    background:
                        "#181818",

                    color:
                        "#eeeeee",

                    overflow:
                        "auto",

                    fontFamily:
                        "Consolas, Monaco, monospace",

                    fontSize:
                        "12px",

                    lineHeight:
                        1.8,
                }}
            >
                {code.map(
                    (
                        line,
                        index
                    ) => {

                        const lineNumber =
                            index + 1;

                        const active =
                            lineNumber ===
                            activeLine;

                        return (
                            <div
                                key={
                                    lineNumber
                                }
                                style={{
                                    display:
                                        "flex",

                                    background:
                                        active
                                            ? "rgba(47,141,70,0.28)"
                                            : "transparent",

                                    borderLeft:
                                        active
                                            ? "3px solid #2f8d46"
                                            : "3px solid transparent",

                                    transition:
                                        "background 150ms ease",
                                }}
                            >

                                <span
                                    style={{
                                        width:
                                            "38px",

                                        flexShrink:
                                            0,

                                        paddingLeft:
                                            "10px",

                                        color:
                                            active
                                                ? "#7bd88f"
                                                : "#666",

                                        userSelect:
                                            "none",
                                    }}
                                >
                                    {lineNumber}
                                </span>

                                <span>
                                    {line ||
                                        " "}
                                </span>

                            </div>
                        );
                    }
                )}
            </pre>

        </div>
    );
}

function AlgorithmSection({
    explanation,
    complexity,
    code,
    activeLine,
    onRun,
    onReset,
    running,
    children,
}: {
    explanation: string;
    complexity: string;
    code: string[];
    activeLine: number;
    onRun: () => void;
    onReset: () => void;
    running: boolean;
    children: React.ReactNode;
}) {

    return (
        <div
            style={{
                marginTop:
                    "26px",
            }}
        >

            <div
                style={{
                    padding:
                        "18px 20px",

                    background:
                        "#f1f8f3",

                    borderLeft:
                        "4px solid #2f8d46",
                }}
            >

                <strong>
                    How it works
                </strong>

                <p
                    style={{
                        margin:
                            "8px 0 0",

                        color:
                            "#555",

                        lineHeight:
                            1.7,
                    }}
                >
                    {explanation}
                </p>

                <div
                    style={{
                        marginTop:
                            "10px",

                        color:
                            "#2f8d46",

                        fontWeight:
                            800,

                        fontSize:
                            "12px",
                    }}
                >
                    {complexity}
                </div>

            </div>

            <div
                style={{
                    display:
                        "grid",

                    gridTemplateColumns:
                        "1fr 1fr",

                    gap:
                        "22px",

                    marginTop:
                        "25px",

                    alignItems:
                        "start",
                }}
            >

                <div>

                    <CodePanel
                        code={
                            code
                        }
                        activeLine={
                            activeLine
                        }
                    />

                    <div
                        style={{
                            display:
                                "flex",

                            gap:
                                "8px",

                            marginTop:
                                "10px",
                        }}
                    >

                        <GreenButton
                            onClick={
                                onRun
                            }
                        >
                            {running
                                ? "Next Step"
                                : "Run"}
                        </GreenButton>

                        <button
                            type="button"
                            onClick={
                                onReset
                            }
                            style={
                                secondaryButton
                            }
                        >
                            Reset
                        </button>

                    </div>

                </div>

                <div>

                    <div
                        style={{
                            display:
                                "flex",

                            justifyContent:
                                "space-between",

                            alignItems:
                                "center",

                            marginBottom:
                                "10px",
                        }}
                    >

                        <h3
                            style={{
                                margin:
                                    0,
                            }}
                        >
                            Visualizer
                        </h3>

                        <span
                            style={{
                                color:
                                    "#777",

                                fontSize:
                                    "11px",
                            }}
                        >
                            Step-by-step
                        </span>

                    </div>

                    {children}

                </div>

            </div>

        </div>
    );
}

function GreenButton({
    children,
    onClick,
}: {
    children: React.ReactNode;
    onClick: () => void;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            style={{
                padding:
                    "10px 16px",

                border:
                    "none",

                borderRadius:
                    "4px",

                background:
                    "#2f8d46",

                color:
                    "#fff",

                fontWeight:
                    700,

                cursor:
                    "pointer",
            }}
        >
            {children}
        </button>
    );
}

const secondaryButton: React.CSSProperties = {
    padding:
        "10px 16px",

    border:
        "1px solid #cfcfcf",

    borderRadius:
        "4px",

    background:
        "#ffffff",

    color:
        "#333",

    fontWeight:
        600,

    cursor:
        "pointer",
};

/*
 * ============================================================
 * BUBBLE VISUALIZER
 * ============================================================
 */

function BubbleVisualizer({
    array,
    activeA,
    activeB,
    sorted,
}: {
    array: number[];
    activeA: number;
    activeB: number;
    sorted: number[];
}) {
    return (
        <div
            style={{
                border:
                    "1px solid #ddd",

                minHeight:
                    "310px",

                padding:
                    "25px",

                display:
                    "flex",

                alignItems:
                    "center",

                justifyContent:
                    "center",

                background:
                    "#fafafa",
            }}
        >

            <div
                style={{
                    display:
                        "flex",

                    alignItems:
                        "flex-end",

                    gap:
                        "9px",

                    height:
                        "210px",
                }}
            >

                {array.map(
                    (
                        value,
                        index
                    ) => {

                        const active =
                            index ===
                                activeA ||
                            index ===
                                activeB;

                        const isSorted =
                            sorted.includes(
                                index
                            );

                        return (
                            <div
                                key={
                                    `${value}-${index}`
                                }
                                style={{
                                    width:
                                        "42px",

                                    height:
                                        `${value * 18}px`,

                                    display:
                                        "flex",

                                    alignItems:
                                        "center",

                                    justifyContent:
                                        "center",

                                    background:
                                        active
                                            ? "#f1a208"
                                            : isSorted
                                                ? "#2f8d46"
                                                : "#333",

                                    color:
                                        "#fff",

                                    fontWeight:
                                        800,

                                    borderRadius:
                                        "4px 4px 0 0",

                                    transition:
                                        "all 250ms ease",
                                }}
                            >
                                {value}
                            </div>
                        );
                    }
                )}

            </div>

        </div>
    );
}

/*
 * ============================================================
 * QUICK SORT VISUALIZER
 * ============================================================
 */

function QuickVisualizer({
    array,
    pivot,
    i,
    j,
    low,
    high,
    done,
}: {
    array: number[];
    pivot: number | null;
    i: number;
    j: number;
    low: number;
    high: number;
    done: boolean;
}) {
    return (
        <div
            style={{
                border:
                    "1px solid #ddd",

                minHeight:
                    "310px",

                padding:
                    "25px",

                background:
                    "#fafafa",
            }}
        >

            <div
                style={{
                    display:
                        "flex",

                    alignItems:
                        "flex-end",

                    justifyContent:
                        "center",

                    gap:
                        "8px",

                    height:
                        "190px",
                }}
            >

                {array.map(
                    (
                        value,
                        index
                    ) => {

                        const isPivot =
                            pivot ===
                            value;

                        const inRange =
                            index >=
                                low &&
                            index <=
                                high;

                        const pointer =
                            index === i ||
                            index === j;

                        return (
                            <div
                                key={
                                    `${value}-${index}`
                                }
                                style={{
                                    width:
                                        "44px",

                                    height:
                                        `${value * 17}px`,

                                    background:
                                        isPivot
                                            ? "#f1a208"
                                            : pointer
                                                ? "#2f8d46"
                                                : inRange
                                                    ? "#333"
                                                    : "#bbb",

                                    color:
                                        "#fff",

                                    display:
                                        "flex",

                                    alignItems:
                                        "center",

                                    justifyContent:
                                        "center",

                                    fontWeight:
                                        800,

                                    borderRadius:
                                        "4px 4px 0 0",

                                    transition:
                                        "all 250ms ease",

                                    position:
                                        "relative",
                                }}
                            >

                                {value}

                                {pointer && (
                                    <span
                                        style={{
                                            position:
                                                "absolute",

                                            bottom:
                                                "-22px",

                                            fontSize:
                                                "9px",

                                            color:
                                                "#2f8d46",
                                        }}
                                    >
                                        {index === i
                                            ? "i"
                                            : "j"}
                                    </span>
                                )}

                            </div>
                        );
                    }
                )}

            </div>

            <div
                style={{
                    marginTop:
                        "35px",

                    textAlign:
                        "center",

                    fontSize:
                        "12px",

                    color:
                        "#555",
                }}
            >
                {done
                    ? "Partition complete."
                    : pivot === null
                        ? "Choose the last element as the pivot."
                        : `Pivot = ${pivot} • compare values against it.`}
            </div>

        </div>
    );
}

/*
 * ============================================================
 * SEARCH VISUALIZER
 * ============================================================
 */

function SearchVisualizer({
    array,
    index,
    target,
    found,
    finished,
    setTarget,
}: {
    array: number[];
    index: number;
    target: number;
    found: boolean;
    finished: boolean;
    setTarget: (value: number) => void;
}) {

    return (
        <div
            style={{
                border:
                    "1px solid #ddd",

                minHeight:
                    "310px",

                padding:
                    "25px",

                background:
                    "#fafafa",
            }}
        >

            <div
                style={{
                    display:
                        "flex",

                    justifyContent:
                        "center",

                    gap:
                        "8px",

                    marginTop:
                        "60px",
                }}
            >

                {array.map(
                    (
                        value,
                        i
                    ) => {

                        const checked =
                            i <
                            index ||
                            (i === index &&
                                (found ||
                                    finished));

                        const current =
                            i ===
                            index &&
                            !found &&
                            !finished;

                        return (
                            <div
                                key={
                                    value
                                }
                                style={{
                                    width:
                                        "55px",

                                    height:
                                        "55px",

                                    borderRadius:
                                        "5px",

                                    border:
                                        current
                                            ? "3px solid #f1a208"
                                            : "1px solid #ccc",

                                    background:
                                        found &&
                                        i === index
                                            ? "#2f8d46"
                                            : checked
                                                ? "#eeeeee"
                                                : "#ffffff",

                                    color:
                                        found &&
                                        i === index
                                            ? "#ffffff"
                                            : "#222",

                                    display:
                                        "flex",

                                    alignItems:
                                        "center",

                                    justifyContent:
                                        "center",

                                    fontWeight:
                                        800,

                                    transition:
                                        "all 250ms ease",
                                }}
                            >
                                {value}
                            </div>
                        );
                    }
                )}

            </div>

            <div
                style={{
                    marginTop:
                        "35px",

                    textAlign:
                        "center",
                }}
            >

                <label
                    style={{
                        fontSize:
                            "12px",

                        color:
                            "#777",

                        marginRight:
                            "8px",
                    }}
                >
                    Target:
                </label>

                <input
                    type="number"
                    value={
                        target
                    }
                    onChange={(event) =>
                        setTarget(
                            Number(
                                event.target.value
                            )
                        )
                    }
                    style={{
                        width:
                            "70px",

                        padding:
                            "7px",

                        border:
                            "1px solid #ccc",
                    }}
                />

                <div
                    style={{
                        marginTop:
                            "14px",

                        fontWeight:
                            700,

                        color:
                            found
                                ? "#2f8d46"
                                : finished
                                    ? "#c33"
                                    : "#555",
                    }}
                >
                    {found
                        ? `Found ${target}!`
                        : finished
                            ? "Value was not found."
                            : `Checking index ${index}...`}
                </div>

            </div>

        </div>
    );
}