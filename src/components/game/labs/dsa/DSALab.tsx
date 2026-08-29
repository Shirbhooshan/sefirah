"use client";

import { useMemo, useState } from "react";

/*

* =========================================================
* DSA LAB
* =========================================================
*
* This is an independent DSA demonstration window.
*
* The Queue below is a REAL data structure.
* The visual boxes are rendered from the actual queue state.
*
* FIFO:
* First In — First Out
*
* enqueue() -> adds to the back
* dequeue() -> removes from the front
* peek()    -> looks at the front
*
* Time Complexity:
*
* enqueue : O(1)
* peek    : O(1)
* dequeue : O(n) with this array implementation
*
* NOTE:
* If we later implement a linked-list queue,
* dequeue can become O(1).
* =========================================================
  */

/*

* =========================================================
* TYPES
* =========================================================
  */

interface DSALabProps {
onClose?: () => void;
}

/*

* =========================================================
* QUEUE IMPLEMENTATION
* =========================================================
  */

class Queue<T> {

private items: T[] = [];

enqueue(item: T) {
    this.items.push(item);
}

dequeue(): T | undefined {
    return this.items.shift();
}

peek(): T | undefined {
    return this.items[0];
}

get size() {
    return this.items.length;
}

toArray() {
    return [...this.items];
}

}

/*

* =========================================================
* INITIAL DATA
* =========================================================
  */

const initialQueue = [
"STOVE",
"OIL",
"GARLIC",
"CARROT",
];

/*

* =========================================================
* COMPONENT
* =========================================================
  */

export default function DSALab({
onClose,
}: DSALabProps) {


/*
 * -----------------------------------------------------
 * QUEUE STATE
 * -----------------------------------------------------
 */

const [
    queueItems,
    setQueueItems,
] = useState<string[]>(
    initialQueue
);


/*
 * -----------------------------------------------------
 * OPERATION HISTORY
 * -----------------------------------------------------
 */

const [
    history,
    setHistory,
] = useState<string[]>([]);


/*
 * -----------------------------------------------------
 * CUSTOM VALUE
 * -----------------------------------------------------
 */

const [
    inputValue,
    setInputValue,
] = useState("EGG");


/*
 * -----------------------------------------------------
 * LAST OPERATION
 * -----------------------------------------------------
 */

const [
    lastOperation,
    setLastOperation,
] = useState(
    "Queue initialized"
);


/*
 * -----------------------------------------------------
 * QUEUE INSTANCE
 *
 * We reconstruct the real Queue from the React state
 * whenever an operation is performed.
 * -----------------------------------------------------
 */

const createQueue = () => {

    const queue =
        new Queue<string>();

    queueItems.forEach(
        (item) => {
            queue.enqueue(item);
        }
    );

    return queue;
};


/*
 * -----------------------------------------------------
 * ENQUEUE
 * -----------------------------------------------------
 */

const handleEnqueue = () => {

    const value =
        inputValue.trim();

    if (!value) {
        return;
    }

    const queue =
        createQueue();

    queue.enqueue(value);

    const newQueue =
        queue.toArray();

    setQueueItems(
        newQueue
    );

    setHistory(
        (current) => [
            ...current,
            `enqueue("${value}")`,
        ]
    );

    setLastOperation(
        `enqueue("${value}") → added to rear`
    );

    setInputValue("");
};


/*
 * -----------------------------------------------------
 * DEQUEUE
 * -----------------------------------------------------
 */

const handleDequeue = () => {

    const queue =
        createQueue();

    const removed =
        queue.dequeue();

    if (
        removed === undefined
    ) {

        setLastOperation(
            "dequeue() → queue is empty"
        );

        return;
    }

    setQueueItems(
        queue.toArray()
    );

    setHistory(
        (current) => [
            ...current,
            `dequeue() → "${removed}"`,
        ]
    );

    setLastOperation(
        `dequeue() → removed "${removed}" from front`
    );
};


/*
 * -----------------------------------------------------
 * PEEK
 * -----------------------------------------------------
 */

const handlePeek = () => {

    const queue =
        createQueue();

    const front =
        queue.peek();

    if (
        front === undefined
    ) {

        setLastOperation(
            "peek() → queue is empty"
        );

        return;
    }

    setHistory(
        (current) => [
            ...current,
            `peek() → "${front}"`,
        ]
    );

    setLastOperation(
        `peek() → "${front}" is at the front`
    );
};


/*
 * -----------------------------------------------------
 * CLEAR
 * -----------------------------------------------------
 */

const handleClear = () => {

    setQueueItems([]);

    setHistory(
        (current) => [
            ...current,
            "clear()",
        ]
    );

    setLastOperation(
        "Queue cleared"
    );
};


/*
 * -----------------------------------------------------
 * RESET
 * -----------------------------------------------------
 */

const handleReset = () => {

    setQueueItems(
        initialQueue
    );

    setHistory([]);

    setLastOperation(
        "Queue reset"
    );
};


/*
 * -----------------------------------------------------
 * FRONT / REAR
 * -----------------------------------------------------
 */

const front =
    queueItems.length > 0
        ? queueItems[0]
        : "EMPTY";

const rear =
    queueItems.length > 0
        ? queueItems[
            queueItems.length - 1
        ]
        : "EMPTY";


/*
 * -----------------------------------------------------
 * OPERATION COUNT
 * -----------------------------------------------------
 */

const operationCount =
    useMemo(
        () => history.length,
        [history]
    );


/*
 * =====================================================
 * RENDER
 * =====================================================
 */

return (

    <div
        style={{
            position: "absolute",

            inset: 0,

            background:
                "rgba(12, 12, 14, 0.96)",

            color: "#f5f1ea",

            fontFamily:
                "Comfortaa, sans-serif",

            overflow: "hidden",

            zIndex: 1000,
        }}
    >

        {/* =================================================
            WINDOW HEADER
        ================================================= */}

        <div
            style={{
                position: "absolute",

                top: 0,
                left: 0,
                right: 0,

                height: "58px",

                display: "flex",

                alignItems: "center",

                justifyContent:
                    "space-between",

                padding:
                    "0 22px",

                boxSizing:
                    "border-box",

                background:
                    "rgba(255,255,255,0.055)",

                borderBottom:
                    "1px solid rgba(255,255,255,0.10)",

                backdropFilter:
                    "blur(20px)",

                zIndex: 10,
            }}
        >

            <div
                style={{
                    display: "flex",

                    alignItems: "center",

                    gap: "12px",
                }}
            >

                <div
                    style={{
                        width: "10px",
                        height: "10px",

                        borderRadius:
                            "50%",

                        background:
                            "#c7a66b",

                        boxShadow:
                            "0 0 12px rgba(199,166,107,0.55)",
                    }}
                />

                <div
                    style={{
                        fontSize:
                            "15px",

                        fontWeight: 700,

                        letterSpacing:
                            "0.04em",
                    }}
                >
                    DSA LAB
                </div>

                <div
                    style={{
                        fontSize:
                            "11px",

                        opacity: 0.45,
                    }}
                >
                    Data Structures & Algorithms
                </div>

            </div>


            {onClose && (
                <button
                    type="button"
                    onClick={onClose}
                    style={{
                        width: "32px",
                        height: "32px",

                        border: "none",

                        borderRadius:
                            "7px",

                        background:
                            "rgba(255,255,255,0.07)",

                        color: "#fff",

                        cursor: "pointer",

                        fontSize: "16px",
                    }}
                >
                    ×
                </button>
            )}

        </div>


        {/* =================================================
            MAIN CONTENT
        ================================================= */}

        <div
            style={{
                position:
                    "absolute",

                top: "58px",
                left: 0,
                right: 0,
                bottom: 0,

                display: "flex",

                overflow: "hidden",
            }}
        >

            {/* =================================================
                LEFT SIDEBAR
            ================================================= */}

            <aside
                style={{
                    width: "230px",

                    flexShrink: 0,

                    padding:
                        "24px 18px",

                    boxSizing:
                        "border-box",

                    borderRight:
                        "1px solid rgba(255,255,255,0.08)",

                    background:
                        "rgba(255,255,255,0.025)",
                }}
            >

                <div
                    style={{
                        fontSize:
                            "10px",

                        letterSpacing:
                            "0.12em",

                        opacity: 0.4,

                        marginBottom:
                            "12px",
                    }}
                >
                    DATA STRUCTURES
                </div>


                {[
                    "Queue",
                    "Stack",
                    "Linked List",
                    "Searching",
                    "Sorting",
                ].map(
                    (
                        item,
                        index
                    ) => (

                        <div
                            key={item}
                            style={{
                                padding:
                                    "11px 13px",

                                marginBottom:
                                    "5px",

                                borderRadius:
                                    "7px",

                                background:
                                    index === 0
                                        ? "rgba(199,166,107,0.14)"
                                        : "transparent",

                                border:
                                    index === 0
                                        ? "1px solid rgba(199,166,107,0.20)"
                                        : "1px solid transparent",

                                color:
                                    index === 0
                                        ? "#e5c98e"
                                        : "rgba(255,255,255,0.48)",

                                fontSize:
                                    "12px",

                                fontWeight:
                                    index === 0
                                        ? 700
                                        : 500,
                            }}
                        >
                            {item}

                        </div>

                    )
                )}


                <div
                    style={{
                        marginTop:
                            "30px",

                        padding:
                            "14px",

                        borderRadius:
                            "8px",

                        background:
                            "rgba(255,255,255,0.035)",

                        border:
                            "1px solid rgba(255,255,255,0.07)",
                    }}
                >

                    <div
                        style={{
                            fontSize:
                                "10px",

                            opacity:
                                0.4,

                            marginBottom:
                                "8px",
                        }}
                    >
                        CURRENT STRUCTURE
                    </div>

                    <div
                        style={{
                            fontSize:
                                "14px",

                            fontWeight:
                                700,
                        }}
                    >
                        Queue
                    </div>

                    <div
                        style={{
                            marginTop:
                                "5px",

                            fontSize:
                                "10px",

                            opacity:
                                0.45,

                            lineHeight:
                                1.5,
                        }}
                    >
                        FIFO — First In,
                        First Out
                    </div>

                </div>

            </aside>


            {/* =================================================
                WORKSPACE
            ================================================= */}

            <main
                style={{
                    flex: 1,

                    overflowY:
                        "auto",

                    padding:
                        "30px 34px",

                    boxSizing:
                        "border-box",
                }}
            >

                {/* =================================================
                    TITLE
                ================================================= */}

                <div
                    style={{
                        marginBottom:
                            "26px",
                    }}
                >

                    <div
                        style={{
                            fontSize:
                                "25px",

                            fontWeight:
                                700,

                            marginBottom:
                                "7px",
                        }}
                    >
                        Queue Visualizer
                    </div>

                    <div
                        style={{
                            fontSize:
                                "12px",

                            opacity:
                                0.48,
                        }}
                    >
                        Explore FIFO operations using
                        a live data structure.
                    </div>

                </div>


                {/* =================================================
                    QUEUE VISUALIZATION
                ================================================= */}

                <section
                    style={{
                        padding:
                            "24px",

                        borderRadius:
                            "12px",

                        background:
                            "rgba(255,255,255,0.045)",

                        border:
                            "1px solid rgba(255,255,255,0.09)",

                        boxShadow:
                            "0 12px 35px rgba(0,0,0,0.20)",
                    }}
                >

                    <div
                        style={{
                            display:
                                "flex",

                            justifyContent:
                                "space-between",

                            alignItems:
                                "center",

                            marginBottom:
                                "24px",
                        }}
                    >

                        <div
                            style={{
                                fontSize:
                                    "11px",

                                opacity:
                                    0.45,

                                letterSpacing:
                                    "0.08em",
                            }}
                        >
                            LIVE QUEUE
                        </div>

                        <div
                            style={{
                                fontSize:
                                    "11px",

                                opacity:
                                    0.45,
                            }}
                        >
                            SIZE: {queueItems.length}
                        </div>

                    </div>


                    {/* FRONT / REAR */}

                    <div
                        style={{
                            display:
                                "flex",

                            justifyContent:
                                "space-between",

                            marginBottom:
                                "10px",

                            fontSize:
                                "9px",

                            opacity:
                                0.4,

                            letterSpacing:
                                "0.08em",
                        }}
                    >

                        <span>
                            FRONT
                        </span>

                        <span>
                            REAR
                        </span>

                    </div>


                    {/* QUEUE */}

                    <div
                        style={{
                            minHeight:
                                "92px",

                            display:
                                "flex",

                            alignItems:
                                "center",

                            gap:
                                "10px",

                            padding:
                                "18px",

                            borderRadius:
                                "9px",

                            background:
                                "rgba(0,0,0,0.20)",

                            border:
                                "1px dashed rgba(255,255,255,0.12)",

                            overflowX:
                                "auto",
                        }}
                    >

                        {queueItems.length === 0 ? (

                            <div
                                style={{
                                    width:
                                        "100%",

                                    textAlign:
                                        "center",

                                    fontSize:
                                        "12px",

                                    opacity:
                                        0.3,
                                }}
                            >
                                QUEUE EMPTY
                            </div>

                        ) : (

                            queueItems.map(
                                (
                                    item,
                                    index
                                ) => (

                                    <div
                                        key={`${item}-${index}`}
                                        style={{
                                            minWidth:
                                                "100px",

                                            height:
                                                "56px",

                                            display:
                                                "flex",

                                            alignItems:
                                                "center",

                                            justifyContent:
                                                "center",

                                            position:
                                                "relative",

                                            borderRadius:
                                                "8px",

                                            background:
                                                index === 0
                                                    ? "rgba(199,166,107,0.18)"
                                                    : "rgba(255,255,255,0.07)",

                                            border:
                                                index === 0
                                                    ? "1px solid rgba(199,166,107,0.40)"
                                                    : "1px solid rgba(255,255,255,0.10)",

                                            color:
                                                index === 0
                                                    ? "#e7ca91"
                                                    : "#fff",

                                            fontSize:
                                                "11px",

                                            fontWeight:
                                                700,

                                            boxShadow:
                                                index === 0
                                                    ? "0 0 18px rgba(199,166,107,0.10)"
                                                    : "none",

                                            flexShrink:
                                                0,
                                        }}
                                    >

                                        {item}

                                        {index === 0 && (
                                            <div
                                                style={{
                                                    position:
                                                        "absolute",

                                                    bottom:
                                                        "-18px",

                                                    fontSize:
                                                        "8px",

                                                    opacity:
                                                        0.45,

                                                    fontWeight:
                                                        500,
                                                }}
                                            >
                                                dequeue →
                                            </div>
                                        )}

                                    </div>

                                )
                            )

                        )}

                    </div>


                    {/* OPERATION */}

                    <div
                        style={{
                            marginTop:
                                "25px",

                            padding:
                                "12px 14px",

                            borderRadius:
                                "7px",

                            background:
                                "rgba(199,166,107,0.07)",

                            border:
                                "1px solid rgba(199,166,107,0.12)",

                            fontSize:
                                "11px",

                            color:
                                "#e3c88f",
                        }}
                    >
                        {lastOperation}
                    </div>

                </section>


                {/* =================================================
                    CONTROLS
                ================================================= */}

                <section
                    style={{
                        marginTop:
                            "18px",

                        display:
                            "grid",

                        gridTemplateColumns:
                            "1fr 1fr",

                        gap:
                            "18px",
                    }}
                >

                    {/* ENQUEUE */}

                    <div
                        style={{
                            padding:
                                "20px",

                            borderRadius:
                                "10px",

                            background:
                                "rgba(255,255,255,0.04)",

                            border:
                                "1px solid rgba(255,255,255,0.08)",
                        }}
                    >

                        <div
                            style={{
                                fontSize:
                                    "11px",

                                fontWeight:
                                    700,

                                marginBottom:
                                    "12px",
                            }}
                        >
                            ENQUEUE
                        </div>

                        <div
                            style={{
                                display:
                                    "flex",

                                gap:
                                    "8px",
                            }}
                        >

                            <input
                                value={
                                    inputValue
                                }

                                onChange={(
                                    event
                                ) =>
                                    setInputValue(
                                        event
                                            .target
                                            .value
                                    )
                                }

                                onKeyDown={(
                                    event
                                ) => {

                                    if (
                                        event.key ===
                                        "Enter"
                                    ) {

                                        handleEnqueue();

                                    }

                                }}

                                placeholder="Value"

                                style={{
                                    flex: 1,

                                    minWidth:
                                        0,

                                    padding:
                                        "10px 11px",

                                    border:
                                        "1px solid rgba(255,255,255,0.10)",

                                    borderRadius:
                                        "7px",

                                    outline:
                                        "none",

                                    background:
                                        "rgba(0,0,0,0.25)",

                                    color:
                                        "#fff",

                                    fontFamily:
                                        "Comfortaa, sans-serif",

                                    fontSize:
                                        "11px",
                                }}
                            />

                            <button
                                type="button"

                                onClick={
                                    handleEnqueue
                                }

                                style={{
                                    padding:
                                        "0 15px",

                                    border:
                                        "1px solid rgba(199,166,107,0.25)",

                                    borderRadius:
                                        "7px",

                                    background:
                                        "rgba(199,166,107,0.14)",

                                    color:
                                        "#e4c98f",

                                    fontFamily:
                                        "Comfortaa, sans-serif",

                                    fontSize:
                                        "10px",

                                    fontWeight:
                                        700,

                                    cursor:
                                        "pointer",
                                }}
                            >
                                ENQUEUE
                            </button>

                        </div>

                    </div>


                    {/* DEQUEUE */}

                    <div
                        style={{
                            padding:
                                "20px",

                            borderRadius:
                                "10px",

                            background:
                                "rgba(255,255,255,0.04)",

                            border:
                                "1px solid rgba(255,255,255,0.08)",
                        }}
                    >

                        <div
                            style={{
                                fontSize:
                                    "11px",

                                fontWeight:
                                    700,

                                marginBottom:
                                    "12px",
                            }}
                        >
                            QUEUE OPERATIONS
                        </div>

                        <div
                            style={{
                                display:
                                    "flex",

                                gap:
                                    "8px",
                            }}
                        >

                            <button
                                type="button"
                                onClick={
                                    handleDequeue
                                }
                                style={{
                                    flex: 1,

                                    padding:
                                        "10px",

                                    border:
                                        "1px solid rgba(255,255,255,0.10)",

                                    borderRadius:
                                        "7px",

                                    background:
                                        "rgba(255,255,255,0.06)",

                                    color:
                                        "#fff",

                                    fontFamily:
                                        "Comfortaa, sans-serif",

                                    fontSize:
                                        "10px",

                                    fontWeight:
                                        700,

                                    cursor:
                                        "pointer",
                                }}
                            >
                                DEQUEUE
                            </button>

                            <button
                                type="button"
                                onClick={
                                    handlePeek
                                }
                                style={{
                                    flex: 1,

                                    padding:
                                        "10px",

                                    border:
                                        "1px solid rgba(255,255,255,0.10)",

                                    borderRadius:
                                        "7px",

                                    background:
                                        "rgba(255,255,255,0.06)",

                                    color:
                                        "#fff",

                                    fontFamily:
                                        "Comfortaa, sans-serif",

                                    fontSize:
                                        "10px",

                                    fontWeight:
                                        700,

                                    cursor:
                                        "pointer",
                                }}
                            >
                                PEEK
                            </button>

                            <button
                                type="button"
                                onClick={
                                    handleClear
                                }
                                style={{
                                    padding:
                                        "10px 12px",

                                    border:
                                        "1px solid rgba(255,255,255,0.08)",

                                    borderRadius:
                                        "7px",

                                    background:
                                        "transparent",

                                    color:
                                        "rgba(255,255,255,0.45)",

                                    fontFamily:
                                        "Comfortaa, sans-serif",

                                    fontSize:
                                        "10px",

                                    cursor:
                                        "pointer",
                                }}
                            >
                                CLEAR
                            </button>

                        </div>

                    </div>

                </section>


                {/* =================================================
                    INFORMATION
                ================================================= */}

                <section
                    style={{
                        marginTop:
                            "18px",

                        display:
                            "grid",

                        gridTemplateColumns:
                            "1fr 1fr 1fr",

                        gap:
                            "12px",
                    }}
                >

                    <div
                        style={{
                            padding:
                                "16px",

                            borderRadius:
                                "9px",

                            background:
                                "rgba(255,255,255,0.035)",

                            border:
                                "1px solid rgba(255,255,255,0.07)",
                        }}
                    >

                        <div
                            style={{
                                fontSize:
                                    "9px",

                                opacity:
                                    0.4,

                                marginBottom:
                                    "7px",
                            }}
                        >
                            FRONT
                        </div>

                        <div
                            style={{
                                fontSize:
                                    "14px",

                                fontWeight:
                                    700,
                            }}
                        >
                            {front}
                        </div>

                    </div>


                    <div
                        style={{
                            padding:
                                "16px",

                            borderRadius:
                                "9px",

                            background:
                                "rgba(255,255,255,0.035)",

                            border:
                                "1px solid rgba(255,255,255,0.07)",
                        }}
                    >

                        <div
                            style={{
                                fontSize:
                                    "9px",

                                opacity:
                                    0.4,

                                marginBottom:
                                    "7px",
                            }}
                        >
                            REAR
                        </div>

                        <div
                            style={{
                                fontSize:
                                    "14px",

                                fontWeight:
                                    700,
                            }}
                        >
                            {rear}
                        </div>

                    </div>


                    <div
                        style={{
                            padding:
                                "16px",

                            borderRadius:
                                "9px",

                            background:
                                "rgba(255,255,255,0.035)",

                            border:
                                "1px solid rgba(255,255,255,0.07)",
                        }}
                    >

                        <div
                            style={{
                                fontSize:
                                    "9px",

                                opacity:
                                    0.4,

                                marginBottom:
                                    "7px",
                            }}
                        >
                            OPERATIONS
                        </div>

                        <div
                            style={{
                                fontSize:
                                    "14px",

                                fontWeight:
                                    700,
                            }}
                        >
                            {operationCount}
                        </div>

                    </div>

                </section>


                {/* =================================================
                    COMPLEXITY
                ================================================= */}

                <section
                    style={{
                        marginTop:
                            "18px",

                        padding:
                            "20px",

                        borderRadius:
                            "10px",

                        background:
                            "rgba(255,255,255,0.035)",

                        border:
                            "1px solid rgba(255,255,255,0.07)",
                    }}
                >

                    <div
                        style={{
                            fontSize:
                                "10px",

                            letterSpacing:
                                "0.08em",

                            opacity:
                                0.4,

                            marginBottom:
                                "14px",
                        }}
                    >
                        QUEUE COMPLEXITY
                    </div>

                    <div
                        style={{
                            display:
                                "grid",

                            gridTemplateColumns:
                                "repeat(3, 1fr)",

                            gap:
                                "12px",
                        }}
                    >

                        <ComplexityCard
                            title="enqueue()"
                            complexity="O(1)"
                            description="Add item to rear"
                        />

                        <ComplexityCard
                            title="peek()"
                            complexity="O(1)"
                            description="Read front item"
                        />

                        <ComplexityCard
                            title="dequeue()"
                            complexity="O(n)"
                            description="Remove front item"
                        />

                    </div>

                </section>


                {/* =================================================
                    HISTORY
                ================================================= */}

                <section
                    style={{
                        marginTop:
                            "18px",

                        padding:
                            "20px",

                        borderRadius:
                            "10px",

                        background:
                            "rgba(255,255,255,0.035)",

                        border:
                            "1px solid rgba(255,255,255,0.07)",
                    }}
                >

                    <div
                        style={{
                            display:
                                "flex",

                            justifyContent:
                                "space-between",

                            marginBottom:
                                "12px",
                        }}
                    >

                        <div
                            style={{
                                fontSize:
                                    "10px",

                                letterSpacing:
                                    "0.08em",

                                opacity:
                                    0.4,
                            }}
                        >
                            OPERATION HISTORY
                        </div>

                        <button
                            type="button"
                            onClick={
                                handleReset
                            }
                            style={{
                                border:
                                    "none",

                                background:
                                    "transparent",

                                color:
                                    "rgba(255,255,255,0.4)",

                                fontFamily:
                                    "Comfortaa, sans-serif",

                                fontSize:
                                    "9px",

                                cursor:
                                    "pointer",
                            }}
                        >
                            RESET
                        </button>

                    </div>


                    {history.length === 0 ? (

                        <div
                            style={{
                                fontSize:
                                    "10px",

                                opacity:
                                    0.25,
                            }}
                        >
                            No operations yet.
                        </div>

                    ) : (

                        <div
                            style={{
                                display:
                                    "flex",

                                flexDirection:
                                    "column",

                                gap:
                                    "5px",

                                maxHeight:
                                    "140px",

                                overflowY:
                                    "auto",
                            }}
                        >

                            {history
                                .map(
                                    (
                                        operation,
                                        index
                                    ) => (

                                        <div
                                            key={
                                                index
                                            }
                                            style={{
                                                padding:
                                                    "7px 10px",

                                                borderRadius:
                                                    "5px",

                                                background:
                                                    "rgba(0,0,0,0.16)",

                                                fontFamily:
                                                    "monospace",

                                                fontSize:
                                                    "10px",

                                                color:
                                                    "rgba(255,255,255,0.65)",
                                            }}
                                        >
                                            <span
                                                style={{
                                                    opacity:
                                                        0.3,

                                                    marginRight:
                                                        "8px",
                                                }}
                                            >
                                                {String(
                                                    index + 1
                                                ).padStart(
                                                    2,
                                                    "0"
                                                )}
                                            </span>

                                            {operation}

                                        </div>

                                    )
                                )}

                        </div>

                    )}

                </section>

            </main>

        </div>

    </div>
);

}

/*

* =========================================================
* COMPLEXITY CARD
* =========================================================
  */

function ComplexityCard({
title,
complexity,
description,
}: {
title: string;
complexity: string;
description: string;
}) {


return (

    <div
        style={{
            padding:
                "14px",

            borderRadius:
                "7px",

            background:
                "rgba(0,0,0,0.18)",

            border:
                "1px solid rgba(255,255,255,0.06)",
        }}
    >

        <div
            style={{
                fontFamily:
                    "monospace",

                fontSize:
                    "10px",

                opacity:
                    0.5,

                marginBottom:
                    "8px",
            }}
        >
            {title}
        </div>

        <div
            style={{
                fontSize:
                    "18px",

                fontWeight:
                    700,

                color:
                    "#e4c98f",

                marginBottom:
                    "5px",
            }}
        >
            {complexity}
        </div>

        <div
            style={{
                fontSize:
                    "9px",

                opacity:
                    0.4,
            }}
        >
            {description}
        </div>

    </div>
);

}
