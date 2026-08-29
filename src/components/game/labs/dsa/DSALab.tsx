"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import type {
  CSSProperties,
  MouseEvent as ReactMouseEvent,
} from "react";

/*
 * =========================================================
 * DSA LAB
 * =========================================================
 *
 * Interactive presentation + DSA visualizer for SEFIRAH.
 *
 * Demonstrates:
 *
 * 1. Queue
 * 2. Set
 * 3. State-machine style transitions
 * 4. Actual project code
 * 5. Complexity
 * 6. Failure cases
 *
 * This component is intentionally self-contained.
 * =========================================================
 */


/*
 * =========================================================
 * TYPES
 * =========================================================
 */

interface WindowPosition {
  left: number;
  top: number;
  zIndex: number;
  centered: boolean;
}

interface DSALabProps {
  onClose?: () => void;
  onFocus?: () => void;

  onMove?: (
    left: number,
    top: number
  ) => void;

  windowPosition: WindowPosition;
}


type Section =
  | "overview"
  | "why"
  | "queue"
  | "code"
  | "set"
  | "state"
  | "failure"
  | "complexity"
  | "presentation"
  | "summary";


type CookingAction =
  | "cooking_oil"
  | "cut_garlic"
  | "cut_carrot"
  | "rice"
  | "egg"
  | "soy_sauce"
  | "cut_green_onion"
  | "stir";


interface QueueItem {
  id: number;
  action: CookingAction;
  label: string;
  icon: string;
}


/*
 * =========================================================
 * RECIPE DATA
 * =========================================================
 */

const RECIPE: QueueItem[] = [
  {
    id: 1,
    action: "cooking_oil",
    label: "Cooking Oil",
    icon: "🫗",
  },

  {
    id: 2,
    action: "cut_garlic",
    label: "Cut Garlic",
    icon: "🧄",
  },

  {
    id: 3,
    action: "cut_carrot",
    label: "Cut Carrot",
    icon: "🥕",
  },

  {
    id: 4,
    action: "rice",
    label: "Cold Rice",
    icon: "🍚",
  },

  {
    id: 5,
    action: "egg",
    label: "Egg",
    icon: "🥚",
  },

  {
    id: 6,
    action: "soy_sauce",
    label: "Soy Sauce",
    icon: "🥣",
  },

  {
    id: 7,
    action: "cut_green_onion",
    label: "Green Onion",
    icon: "🌱",
  },

  {
    id: 8,
    action: "stir",
    label: "Stir",
    icon: "🥄",
  },
];


/*
 * =========================================================
 * HELPERS
 * =========================================================
 */

const actionText: Record<
  CookingAction,
  string
> = {
  cooking_oil: "Add cooking oil",
  cut_garlic: "Add cut garlic",
  cut_carrot: "Add cut carrot",
  rice: "Add cold rice",
  egg: "Add egg",
  soy_sauce: "Add soy sauce",
  cut_green_onion:
    "Add cut green onion",
  stir: "Stir the fried rice",
};


const sectionLabels: Record<
  Section,
  string
> = {
  overview: "Overview",
  why: "Why DSA?",
  queue: "Queue",
  code: "Source Code",
  set: "Set",
  state: "State Machine",
  failure: "Failure Case",
  complexity: "Complexity",
  presentation: "How To Present",
  summary: "Summary",
};


/*
 * =========================================================
 * COMPONENT
 * =========================================================
 */

export default function DSALab({
  onClose,
  onFocus,
  onMove,
  windowPosition,
}: DSALabProps) {


  /*
   * =========================================================
   * SECTION
   * =========================================================
   */

  const [
    section,
    setSection,
  ] = useState<Section>("overview");


  /*
   * =========================================================
   * QUEUE DEMO
   * =========================================================
   */

  const [
    queue,
    setQueue,
  ] = useState<QueueItem[]>(RECIPE);


  const [
    queueMessage,
    setQueueMessage,
  ] = useState(
    "Queue initialized with the Fried Rice recipe."
  );


  const [
    highlightedId,
    setHighlightedId,
  ] = useState<number | null>(null);


  const [
    lastOperation,
    setLastOperation,
  ] = useState(
    "Waiting for an operation..."
  );


  /*
   * =========================================================
   * SET DEMO
   * =========================================================
   */

  const [
    completedSet,
    setCompletedSet,
  ] = useState<CookingAction[]>([
    "cooking_oil",
    "cut_garlic",
    "cut_carrot",
  ]);


  const [
    setMessage,
    setSetMessage,
  ] = useState(
    "These actions have already been completed."
  );


  /*
   * =========================================================
   * FAILURE DEMO
   * =========================================================
   */

  const [
    failureStep,
    setFailureStep,
  ] = useState(0);


  /*
   * =========================================================
   * DRAGGING
   * =========================================================
   */

  const [
    isDragging,
    setIsDragging,
  ] = useState(false);


  const dragOffset =
    useRef({
      x: 0,
      y: 0,
    });


  /*
   * =========================================================
   * WINDOW DIMENSIONS
   * =========================================================
   */

  const WINDOW_WIDTH = 1080;
  const WINDOW_HEIGHT = 720;
  const MENU_BAR_HEIGHT = 38;


  /*
   * =========================================================
   * WINDOW DRAG START
   * =========================================================
   */

  const handleWindowDragStart = (
    event: ReactMouseEvent
  ) => {

    if (event.button !== 0) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();

    onFocus?.();

    const windowElement =
      event.currentTarget.closest(
        "[data-dsa-window]"
      ) as HTMLElement | null;

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
  };


  /*
   * =========================================================
   * WINDOW DRAGGING
   * =========================================================
   */

  useEffect(() => {

    if (!isDragging) {
      return;
    }

    const handleMouseMove = (
      event: MouseEvent
    ) => {

      const newLeft =
        event.clientX -
        dragOffset.current.x;

      const newTop =
        event.clientY -
        dragOffset.current.y;


      const actualWidth =
        Math.min(
          WINDOW_WIDTH,
          window.innerWidth * 0.94
        );


      const actualHeight =
        Math.min(
          WINDOW_HEIGHT,
          window.innerHeight * 0.88
        );


      const maxLeft =
        Math.max(
          0,
          window.innerWidth -
            actualWidth
        );


      const maxTop =
        Math.max(
          MENU_BAR_HEIGHT,
          window.innerHeight -
            actualHeight
        );


      const clampedLeft =
        Math.max(
          0,
          Math.min(
            newLeft,
            maxLeft
          )
        );


      const clampedTop =
        Math.max(
          MENU_BAR_HEIGHT,
          Math.min(
            newTop,
            maxTop
          )
        );


      onMove?.(
        clampedLeft,
        clampedTop
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
   * FOCUS
   * =========================================================
   */

  const focusWindow = useCallback(() => {
    onFocus?.();
  }, [onFocus]);


  /*
   * =========================================================
   * QUEUE RESET
   * =========================================================
   */

  const resetQueue = () => {

    setQueue(RECIPE);

    setHighlightedId(null);

    setQueueMessage(
      "Queue reset. All 8 recipe actions are waiting."
    );

    setLastOperation(
      "RESET"
    );
  };


  /*
   * =========================================================
   * QUEUE PEEK
   * =========================================================
   */

  const peekQueue = () => {

    const first =
      queue[0];

    if (!first) {

      setQueueMessage(
        "Queue is empty."
      );

      setLastOperation(
        "peek() → undefined"
      );

      return;
    }


    setHighlightedId(
      first.id
    );


    setQueueMessage(
      `PEEK → ${first.label}`
    );


    setLastOperation(
      `peek() → ${first.action}`
    );
  };


  /*
   * =========================================================
   * QUEUE DEQUEUE
   * =========================================================
   */

  const dequeueQueue = () => {

    if (queue.length === 0) {

      setQueueMessage(
        "Cannot dequeue. Queue is empty."
      );

      setLastOperation(
        "dequeue() → undefined"
      );

      return;
    }


    const removed =
      queue[0];


    setHighlightedId(
      removed.id
    );


    setLastOperation(
      `dequeue() → ${removed.action}`
    );


    setQueueMessage(
      `${removed.label} completed. The next action is now at FRONT.`
    );


    setTimeout(() => {

      setQueue(
        (previous) =>
          previous.slice(1)
      );

      setHighlightedId(null);

    }, 450);
  };


  /*
   * =========================================================
   * ENQUEUE
   * =========================================================
   */

  const enqueueQueue = () => {

    const nextId =
      Math.max(
        0,
        ...queue.map(
          (item) => item.id
        )
      ) + 1;


    const newItem: QueueItem = {
      id: nextId,

      action:
        "stir",

      label:
        "Extra Stir",

      icon:
        "🥄",
    };


    setQueue(
      (previous) => [
        ...previous,
        newItem,
      ]
    );


    setLastOperation(
      "enqueue(stir)"
    );


    setQueueMessage(
      "New action added at the REAR of the queue."
    );


    setHighlightedId(
      nextId
    );


    setTimeout(() => {
      setHighlightedId(null);
    }, 600);
  };


  /*
   * =========================================================
   * SET TOGGLE
   * =========================================================
   */

  const toggleSetAction = (
    action: CookingAction
  ) => {

    const exists =
      completedSet.includes(
        action
      );


    if (exists) {

      setCompletedSet(
        (previous) =>
          previous.filter(
            (item) =>
              item !== action
          )
      );


      setSetMessage(
        `"${action}" removed from completed Set.`
      );

      return;
    }


    setCompletedSet(
      (previous) => [
        ...previous,
        action,
      ]
    );


    setSetMessage(
      `"${action}" added to completed Set.`
    );
  };


  /*
   * =========================================================
   * FAILURE DEMO
   * =========================================================
   */

  const failureData = [
    {
      title:
        "Player tries to add rice first",

      text:
        "The queue says OIL is the next required action.",

      result:
        "❌ Action rejected",

      explanation:
        "The game checks queue.peek() before accepting the action.",
    },

    {
      title:
        "Player tries soy sauce before egg",

      text:
        "The queue still expects the egg.",

      result:
        "❌ Action rejected",

      explanation:
        "The player cannot skip forward in the recipe.",
    },

    {
      title:
        "Player follows the queue",

      text:
        "The next action matches queue.peek().",

      result:
        "✅ Action accepted",

      explanation:
        "The ingredient is consumed and the action is marked complete.",
    },
  ];


  /*
   * =========================================================
   * CURRENT FAILURE
   * =========================================================
   */

  const currentFailure =
    failureData[
      failureStep
    ];


  /*
   * =========================================================
   * SECTION NAVIGATION
   * =========================================================
   */

  const sections =
    Object.keys(
      sectionLabels
    ) as Section[];


  const currentSectionIndex =
    sections.indexOf(
      section
    );


  const goNext = () => {

    if (
      currentSectionIndex <
      sections.length - 1
    ) {

      setSection(
        sections[
          currentSectionIndex + 1
        ]
      );

    }
  };


  const goPrevious = () => {

    if (
      currentSectionIndex > 0
    ) {

      setSection(
        sections[
          currentSectionIndex - 1
        ]
      );

    }
  };


  /*
   * =========================================================
   * QUEUE STATISTICS
   * =========================================================
   */

  const queueProgress =
    Math.round(
      (
        (
          RECIPE.length -
          queue.length
        ) /
        RECIPE.length
      ) * 100
    );


  /*
   * =========================================================
   * SHARED STYLES
   * =========================================================
   */

  const panelStyle:
    CSSProperties = {

    background:
      "rgba(255,255,255,0.045)",

    border:
      "1px solid rgba(255,255,255,0.10)",

    borderRadius:
      "14px",

    boxShadow:
      "inset 0 1px 0 rgba(255,255,255,0.035)",
  };


  const buttonStyle:
    CSSProperties = {

    border:
      "1px solid rgba(255,255,255,0.12)",

    background:
      "rgba(255,255,255,0.07)",

    color:
      "#f7f7f7",

    borderRadius:
      "9px",

    padding:
      "9px 14px",

    fontFamily:
      "Comfortaa, sans-serif",

    fontSize:
      "12px",

    fontWeight:
      700,

    cursor:
      "pointer",

    transition:
      "all 140ms ease",
  };


  /*
   * =========================================================
   * RENDER: OVERVIEW
   * =========================================================
   */

  const renderOverview = () => (

    <div style={contentStyle}>

      <div
        style={{
          fontSize: "13px",
          color: "#8e9aaa",
          marginBottom: "8px",
          letterSpacing: "0.08em",
        }}
      >
        SEFIRAH • DATA STRUCTURES LAB
      </div>


      <h1 style={heroTitleStyle}>
        Data Structures
        <br />
        inside a real project.
      </h1>


      <p style={heroTextStyle}>
        DSA is not a separate academic exercise
        inside Sefirah. It controls actual game
        behaviour.
      </p>


      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(3, 1fr)",
          gap: "12px",
          marginTop: "28px",
        }}
      >

        {[
          {
            icon: "📋",
            title: "Queue",
            text:
              "Controls recipe order.",
          },

          {
            icon: "⚡",
            title: "Set",
            text:
              "Tracks completed actions.",
          },

          {
            icon: "🔄",
            title: "State",
            text:
              "Controls what the game displays.",
          },
        ].map(
          (item) => (

            <div
              key={item.title}
              style={{
                ...panelStyle,
                padding: "20px",
              }}
            >

              <div
                style={{
                  fontSize: "30px",
                  marginBottom: "10px",
                }}
              >
                {item.icon}
              </div>

              <div
                style={{
                  fontSize: "17px",
                  fontWeight: 800,
                  color: "#fff",
                  marginBottom: "7px",
                }}
              >
                {item.title}
              </div>

              <div
                style={{
                  color: "#9aa5b4",
                  fontSize: "12px",
                  lineHeight: 1.6,
                }}
              >
                {item.text}
              </div>

            </div>
          )
        )}

      </div>


      <div
        style={{
          ...panelStyle,
          marginTop: "18px",
          padding: "18px",
        }}
      >

        <div
          style={{
            color: "#aab4c2",
            fontSize: "11px",
            letterSpacing: "0.08em",
            marginBottom: "10px",
          }}
        >
          THE CORE IDEA
        </div>

        <div
          style={{
            fontSize: "18px",
            color: "#fff",
            fontWeight: 700,
            lineHeight: 1.5,
          }}
        >
          Data structures turn complicated
          game logic into predictable operations.
        </div>

      </div>

    </div>
  );


  /*
   * =========================================================
   * RENDER: WHY DSA
   * =========================================================
   */

  const renderWhy = () => (

    <div style={contentStyle}>

      <SectionHeading
        eyebrow="01 • MOTIVATION"
        title="Why did we need DSA?"
        subtitle="The problem existed before the data structure."
      />


      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "1fr 1fr",
          gap: "16px",
        }}
      >

        <div
          style={{
            ...panelStyle,
            padding: "22px",
          }}
        >

          <div
            style={{
              color: "#ff7676",
              fontWeight: 800,
              fontSize: "14px",
              marginBottom: "14px",
            }}
          >
            ❌ WITHOUT A STRUCTURE
          </div>

          <div
            style={{
              color: "#d4d9e0",
              lineHeight: 1.8,
              fontSize: "13px",
            }}
          >
            The game would need to manually
            remember which ingredient should
            happen next.
          </div>

          <div
            style={{
              marginTop: "18px",
              padding: "14px",
              background:
                "rgba(255,80,80,0.07)",
              borderRadius: "10px",
              fontFamily:
                "monospace",
              fontSize: "11px",
              color: "#ffaaa9",
              lineHeight: 1.8,
            }}
          >
            if (step === 1) ...
            <br />
            if (step === 2) ...
            <br />
            if (step === 3) ...
            <br />
            if (ingredient === "...") ...
            <br />
            if (ingredient === "...") ...
          </div>

        </div>


        <div
          style={{
            ...panelStyle,
            padding: "22px",
          }}
        >

          <div
            style={{
              color: "#69e3a3",
              fontWeight: 800,
              fontSize: "14px",
              marginBottom: "14px",
            }}
          >
            ✅ WITH A QUEUE
          </div>

          <div
            style={{
              color: "#d4d9e0",
              lineHeight: 1.8,
              fontSize: "13px",
            }}
          >
            The queue naturally represents
            the recipe's ordered sequence.
          </div>

          <div
            style={{
              marginTop: "18px",
              padding: "14px",
              background:
                "rgba(70,220,150,0.07)",
              borderRadius: "10px",
              fontFamily:
                "monospace",
              fontSize: "11px",
              color: "#9ff0c5",
              lineHeight: 1.8,
            }}
          >
            queue.peek()
            <br />
            ↓
            <br />
            "cooking_oil"
            <br />
            ↓
            <br />
            validate action
          </div>

        </div>

      </div>


      <div
        style={{
          ...panelStyle,
          marginTop: "16px",
          padding: "20px",
        }}
      >

        <div
          style={{
            color: "#fff",
            fontWeight: 800,
            marginBottom: "8px",
          }}
        >
          The important part
        </div>

        <div
          style={{
            color: "#aab4c2",
            fontSize: "13px",
            lineHeight: 1.7,
          }}
        >
          The data structure isn't there just
          because the assignment requires one.
          It solves an actual problem in the
          cooking game:{" "}
          <strong
            style={{ color: "#fff" }}
          >
            enforcing order.
          </strong>
        </div>

      </div>

    </div>
  );


  /*
   * =========================================================
   * RENDER: QUEUE
   * =========================================================
   */

  const renderQueue = () => (

    <div style={contentStyle}>

      <SectionHeading
        eyebrow="02 • LIVE VISUALIZER"
        title="Recipe Queue"
        subtitle="Operate the same concept used by the cooking game."
      />


      <div
        style={{
          ...panelStyle,
          padding: "16px",
          marginBottom: "14px",
        }}
      >

        <div
          style={{
            display: "flex",
            justifyContent:
              "space-between",
            alignItems: "center",
            marginBottom: "12px",
          }}
        >

          <div>
            <div
              style={{
                fontSize: "11px",
                color: "#7f8998",
                marginBottom: "4px",
              }}
            >
              RECIPE PROGRESS
            </div>

            <div
              style={{
                fontSize: "18px",
                fontWeight: 800,
                color: "#fff",
              }}
            >
              {queueProgress}%
            </div>
          </div>


          <div
            style={{
              fontSize: "12px",
              color: "#aeb7c4",
            }}
          >
            {queue.length} actions remaining
          </div>

        </div>


        <div
          style={{
            height: "6px",
            background:
              "rgba(255,255,255,0.08)",
            borderRadius: "999px",
            overflow: "hidden",
          }}
        >

          <div
            style={{
              width:
                `${queueProgress}%`,
              height: "100%",
              background:
                "linear-gradient(90deg,#62d89b,#66aaff)",
              transition:
                "width 350ms ease",
            }}
          />

        </div>

      </div>


      <div
        style={{
          ...panelStyle,
          padding: "22px 18px",
          minHeight: "235px",
        }}
      >

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            marginBottom: "18px",
          }}
        >

          <span
            style={{
              color: "#69e3a3",
              fontSize: "11px",
              fontWeight: 800,
              letterSpacing:
                "0.08em",
            }}
          >
            FRONT
          </span>

          <div
            style={{
              height: "1px",
              flex: 1,
              background:
                "rgba(255,255,255,0.08)",
            }}
          />

          <span
            style={{
              color: "#778191",
              fontSize: "11px",
              fontWeight: 700,
            }}
          >
            REAR
          </span>

        </div>


        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            overflowX: "auto",
            paddingBottom: "8px",
          }}
        >

          {queue.length === 0 ? (

            <div
              style={{
                width: "100%",
                textAlign: "center",
                padding: "50px",
                color: "#657080",
                fontFamily:
                  "monospace",
                fontSize: "13px",
              }}
            >
              QUEUE EMPTY
            </div>

          ) : (

            queue.map(
              (item, index) => {

                const isFront =
                  index === 0;

                const isHighlighted =
                  highlightedId ===
                  item.id;

                return (

                  <div
                    key={item.id}
                    style={{
                      minWidth: "105px",

                      padding:
                        "16px 10px",

                      borderRadius:
                        "12px",

                      border:
                        isHighlighted
                          ? "1px solid #69e3a3"
                          : isFront
                            ? "1px solid rgba(105,227,163,0.4)"
                            : "1px solid rgba(255,255,255,0.09)",

                      background:
                        isHighlighted
                          ? "rgba(105,227,163,0.13)"
                          : isFront
                            ? "rgba(105,227,163,0.07)"
                            : "rgba(255,255,255,0.035)",

                      textAlign: "center",

                      transform:
                        isHighlighted
                          ? "translateY(-6px)"
                          : "translateY(0)",

                      transition:
                        "all 280ms ease",

                      boxShadow:
                        isHighlighted
                          ? "0 8px 25px rgba(105,227,163,0.12)"
                          : "none",
                    }}
                  >

                    <div
                      style={{
                        fontSize: "30px",
                        marginBottom: "7px",
                      }}
                    >
                      {item.icon}
                    </div>

                    <div
                      style={{
                        color: "#fff",
                        fontSize: "10px",
                        fontWeight: 800,
                        lineHeight: 1.35,
                      }}
                    >
                      {item.label}
                    </div>

                    <div
                      style={{
                        color:
                          isFront
                            ? "#69e3a3"
                            : "#697384",
                        fontSize: "9px",
                        marginTop: "6px",
                        fontFamily:
                          "monospace",
                      }}
                    >
                      {isFront
                        ? "PEEK"
                        : `#${index + 1}`}
                    </div>

                  </div>

                );
              }
            )

          )}

        </div>

      </div>


      <div
        style={{
          display: "flex",
          gap: "8px",
          marginTop: "14px",
          flexWrap: "wrap",
        }}
      >

        <DemoButton
          label="PEEK()"
          onClick={peekQueue}
        />

        <DemoButton
          label="DEQUEUE()"
          onClick={dequeueQueue}
        />

        <DemoButton
          label="ENQUEUE()"
          onClick={enqueueQueue}
        />

        <DemoButton
          label="RESET"
          onClick={resetQueue}
        />

      </div>


      <div
        style={{
          ...panelStyle,
          marginTop: "14px",
          padding: "14px 16px",
          display: "flex",
          gap: "12px",
          alignItems: "center",
        }}
      >

        <div
          style={{
            width: "8px",
            height: "8px",
            borderRadius: "50%",
            background:
              "#69e3a3",
            boxShadow:
              "0 0 12px rgba(105,227,163,0.7)",
          }}
        />

        <div
          style={{
            color: "#d5dbe3",
            fontSize: "12px",
          }}
        >
          {queueMessage}
        </div>

        <div
          style={{
            marginLeft: "auto",
            color: "#697384",
            fontFamily:
              "monospace",
            fontSize: "10px",
          }}
        >
          {lastOperation}
        </div>

      </div>

    </div>
  );


  /*
   * =========================================================
   * RENDER: CODE
   * =========================================================
   */

  const renderCode = () => (

    <div style={contentStyle}>

      <SectionHeading
        eyebrow="03 • IMPLEMENTATION"
        title="The actual Queue"
        subtitle="This is the core structure behind the recipe ordering."
      />


      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "1.15fr 0.85fr",
          gap: "16px",
        }}
      >

        <CodeBlock
          title="CookingQueue<T>"
          code={`class CookingQueue<T> {

  private items: T[] = [];

  enqueue(item: T) {
    this.items.push(item);
  }

  peek(): T | undefined {
    return this.items[0];
  }

  dequeue(): T | undefined {
    return this.items.shift();
  }

  get size(): number {
    return this.items.length;
  }
}`}
        />


        <div
          style={{
            ...panelStyle,
            padding: "20px",
          }}
        >

          <div
            style={{
              color: "#69e3a3",
              fontSize: "11px",
              fontWeight: 800,
              letterSpacing:
                "0.08em",
              marginBottom: "16px",
            }}
          >
            WHAT EACH OPERATION DOES
          </div>


          {[
            [
              "enqueue()",
              "Adds an action to the rear.",
            ],

            [
              "peek()",
              "Looks at the next action without removing it.",
            ],

            [
              "dequeue()",
              "Removes the action at the front.",
            ],

            [
              "size",
              "Tells us how many actions remain.",
            ],
          ].map(
            ([name, explanation]) => (

              <div
                key={name}
                style={{
                  padding:
                    "12px 0",
                  borderBottom:
                    "1px solid rgba(255,255,255,0.07)",
                }}
              >

                <div
                  style={{
                    color: "#fff",
                    fontFamily:
                      "monospace",
                    fontSize: "12px",
                    marginBottom: "5px",
                  }}
                >
                  {name}
                </div>

                <div
                  style={{
                    color: "#8e99a9",
                    fontSize: "11px",
                    lineHeight: 1.5,
                  }}
                >
                  {explanation}
                </div>

              </div>

            )
          )}

        </div>

      </div>


      <div
        style={{
          ...panelStyle,
          marginTop: "16px",
          padding: "18px",
        }}
      >

        <div
          style={{
            color: "#7e8999",
            fontSize: "10px",
            letterSpacing:
              "0.08em",
            marginBottom: "10px",
          }}
        >
          RECIPE ORDER
        </div>


        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            flexWrap: "wrap",
          }}
        >

          {RECIPE.map(
            (item, index) => (

              <div
                key={item.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >

                <span
                  style={{
                    padding:
                      "7px 10px",
                    background:
                      "rgba(255,255,255,0.06)",
                    border:
                      "1px solid rgba(255,255,255,0.09)",
                    borderRadius:
                      "8px",
                    color: "#dce2e9",
                    fontSize: "10px",
                  }}
                >
                  {item.icon}{" "}
                  {item.label}
                </span>

                {index <
                  RECIPE.length - 1 && (
                    <span
                      style={{
                        color: "#586272",
                      }}
                    >
                      →
                    </span>
                  )}

              </div>

            )
          )}

        </div>

      </div>

    </div>
  );


  /*
   * =========================================================
   * RENDER: SET
   * =========================================================
   */

  const renderSet = () => (

    <div style={contentStyle}>

      <SectionHeading
        eyebrow="04 • MEMBERSHIP"
        title="Set — Have we done this already?"
        subtitle="The Queue controls order. The Set remembers completion."
      />


      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "1fr 1fr",
          gap: "16px",
        }}
      >

        <div
          style={{
            ...panelStyle,
            padding: "20px",
          }}
        >

          <div
            style={{
              color: "#69aaff",
              fontSize: "11px",
              fontWeight: 800,
              letterSpacing:
                "0.08em",
              marginBottom: "15px",
            }}
          >
            COMPLETED ACTIONS
          </div>


          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "8px",
            }}
          >

            {RECIPE.map(
              (item) => {

                const completed =
                  completedSet.includes(
                    item.action
                  );

                return (

                  <button
                    key={item.id}
                    type="button"
                    onClick={() =>
                      toggleSetAction(
                        item.action
                      )
                    }
                    style={{
                      border:
                        completed
                          ? "1px solid rgba(105,170,255,0.55)"
                          : "1px solid rgba(255,255,255,0.09)",

                      background:
                        completed
                          ? "rgba(105,170,255,0.13)"
                          : "rgba(255,255,255,0.035)",

                      color:
                        completed
                          ? "#a9d0ff"
                          : "#737d8c",

                      borderRadius:
                        "9px",

                      padding:
                        "9px 10px",

                      cursor:
                        "pointer",

                      fontFamily:
                        "Comfortaa, sans-serif",

                      fontSize:
                        "10px",

                      transition:
                        "all 160ms ease",
                    }}
                  >
                    {completed
                      ? "✓ "
                      : ""}
                    {item.label}
                  </button>

                );
              }
            )}

          </div>


          <div
            style={{
              marginTop: "18px",
              color: "#8994a3",
              fontSize: "11px",
              lineHeight: 1.6,
            }}
          >
            Click actions to add/remove them
            from the simulated completed Set.
          </div>

        </div>


        <div
          style={{
            ...panelStyle,
            padding: "20px",
          }}
        >

          <div
            style={{
              color: "#69aaff",
              fontSize: "11px",
              fontWeight: 800,
              letterSpacing:
                "0.08em",
              marginBottom: "15px",
            }}
          >
            WHY A SET?
          </div>


          <div
            style={{
              fontSize: "17px",
              color: "#fff",
              fontWeight: 800,
              marginBottom: "12px",
            }}
          >
            Fast membership checking.
          </div>


          <div
            style={{
              color: "#9ba5b4",
              fontSize: "12px",
              lineHeight: 1.7,
            }}
          >
            Before performing an operation,
            the game can determine whether
            an action has already been completed.
          </div>


          <div
            style={{
              marginTop: "18px",
              background:
                "rgba(0,0,0,0.28)",
              borderRadius: "10px",
              padding: "15px",
              fontFamily:
                "monospace",
              color: "#bcd7ff",
              fontSize: "11px",
              lineHeight: 1.7,
            }}
          >
            completedActions.has(action)
            <br />
            <br />
            → true
            <br />
            <span
              style={{
                color: "#758193",
              }}
            >
              Action already completed.
            </span>
          </div>


          <div
            style={{
              marginTop: "14px",
              color: "#697384",
              fontSize: "10px",
            }}
          >
            {setMessage}
          </div>

        </div>

      </div>

    </div>
  );


  /*
   * =========================================================
   * RENDER: STATE MACHINE
   * =========================================================
   */

  const renderState = () => (

    <div style={contentStyle}>

      <SectionHeading
        eyebrow="05 • STATE"
        title="State controls the screen"
        subtitle="Completing an action changes the cooking state."
      />


      <div
        style={{
          ...panelStyle,
          padding: "20px",
          marginBottom: "16px",
        }}
      >

        <div
          style={{
            display: "flex",
            justifyContent:
              "center",
            alignItems: "center",
            gap: "8px",
            flexWrap: "wrap",
          }}
        >

          {[
            "IDLE",
            "OIL",
            "GARLIC",
            "CARROT",
            "RICE",
            "EGG",
            "SOY",
            "GREEN ONION",
            "STIRRING",
            "READY",
          ].map(
            (stateName, index, array) => (

              <div
                key={stateName}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >

                <div
                  style={{
                    padding:
                      "11px 13px",
                    borderRadius:
                      "9px",
                    background:
                      index === 0
                        ? "rgba(105,227,163,0.12)"
                        : "rgba(255,255,255,0.04)",
                    border:
                      index === 0
                        ? "1px solid rgba(105,227,163,0.45)"
                        : "1px solid rgba(255,255,255,0.08)",
                    color:
                      index === 0
                        ? "#7deab0"
                        : "#8c96a4",
                    fontFamily:
                      "monospace",
                    fontSize:
                      "9px",
                    fontWeight:
                      800,
                  }}
                >
                  {stateName}
                </div>

                {index <
                  array.length - 1 && (
                    <span
                      style={{
                        color: "#515b69",
                      }}
                    >
                      →
                    </span>
                  )}

              </div>

            )
          )}

        </div>

      </div>


      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "1fr 1fr",
          gap: "16px",
        }}
      >

        <CodeBlock
          title="State transition"
          code={`switch (action) {

  case "cooking_oil":
    nextStage = "oil";
    break;

  case "cut_garlic":
    nextStage = "garlic";
    break;

  case "rice":
    nextStage = "rice";
    break;

  case "egg":
    nextStage = "egg";
    break;
}`}
        />


        <div
          style={{
            ...panelStyle,
            padding: "20px",
          }}
        >

          <div
            style={{
              color: "#fff",
              fontWeight: 800,
              fontSize: "14px",
              marginBottom: "12px",
            }}
          >
            What does this achieve?
          </div>


          <div
            style={{
              color: "#98a2b0",
              fontSize: "12px",
              lineHeight: 1.75,
            }}
          >
            The game doesn't have to manually
            redraw the entire cooking scene.
            The current state determines which
            visual stage and behaviour should
            appear.
          </div>


          <div
            style={{
              marginTop: "18px",
              padding: "15px",
              background:
                "rgba(255,255,255,0.035)",
              borderRadius: "10px",
              color: "#dce1e8",
              fontSize: "11px",
              lineHeight: 1.7,
            }}
          >
            Action completed
            <br />
            ↓
            <br />
            State changes
            <br />
            ↓
            <br />
            Image changes
            <br />
            ↓
            <br />
            Audio / controls change
          </div>

        </div>

      </div>

    </div>
  );


  /*
   * =========================================================
   * RENDER: FAILURE
   * =========================================================
   */

  const renderFailure = () => (

    <div style={contentStyle}>

      <SectionHeading
        eyebrow="06 • FAILURE ANALYSIS"
        title="What breaks without DSA?"
        subtitle="Let's deliberately give the player the wrong action."
      />


      <div
        style={{
          ...panelStyle,
          padding: "24px",
          minHeight: "280px",
        }}
      >

        <div
          style={{
            color: "#ffcb70",
            fontSize: "12px",
            fontWeight: 800,
            letterSpacing:
              "0.08em",
            marginBottom: "18px",
          }}
        >
          SCENARIO {failureStep + 1}
        </div>


        <div
          style={{
            fontSize: "23px",
            color: "#fff",
            fontWeight: 800,
            marginBottom: "12px",
          }}
        >
          {currentFailure.title}
        </div>


        <div
          style={{
            color: "#9da7b5",
            fontSize: "13px",
            marginBottom: "22px",
          }}
        >
          {currentFailure.text}
        </div>


        <div
          style={{
            display: "inline-block",
            padding:
              "11px 16px",
            borderRadius:
              "9px",
            background:
              currentFailure.result.startsWith(
                "❌"
              )
                ? "rgba(255,80,80,0.10)"
                : "rgba(80,220,150,0.10)",
            border:
              currentFailure.result.startsWith(
                "❌"
              )
                ? "1px solid rgba(255,100,100,0.25)"
                : "1px solid rgba(100,220,160,0.25)",
            color:
              currentFailure.result.startsWith(
                "❌"
              )
                ? "#ff9e9e"
                : "#83eab1",
            fontWeight: 800,
            fontSize: "13px",
          }}
        >
          {currentFailure.result}
        </div>


        <div
          style={{
            marginTop: "20px",
            color: "#a3adbb",
            fontSize: "12px",
            lineHeight: 1.7,
          }}
        >
          {currentFailure.explanation}
        </div>

      </div>


      <div
        style={{
          display: "flex",
          gap: "8px",
          marginTop: "14px",
        }}
      >

        <DemoButton
          label="← PREVIOUS CASE"
          onClick={() =>
            setFailureStep(
              (previous) =>
                Math.max(
                  0,
                  previous - 1
                )
            )
          }
        />

        <DemoButton
          label="NEXT CASE →"
          onClick={() =>
            setFailureStep(
              (previous) =>
                Math.min(
                  failureData.length - 1,
                  previous + 1
                )
            )
          }
        />

      </div>


      <div
        style={{
          marginTop: "16px",
          padding: "17px",
          background:
            "rgba(255,255,255,0.035)",
          borderRadius: "10px",
          color: "#d8dee6",
          fontSize: "12px",
          lineHeight: 1.7,
        }}
      >
        <strong>
          The important question:
        </strong>{" "}
        how does the game know whether an
        ingredient is allowed?
        <br />
        <br />
        It checks the current required action
        before accepting the drop.
      </div>

    </div>
  );


  /*
   * =========================================================
   * RENDER: COMPLEXITY
   * =========================================================
   */

  const renderComplexity = () => (

    <div style={contentStyle}>

      <SectionHeading
        eyebrow="07 • PERFORMANCE"
        title="Complexity & implementation"
        subtitle="The data structure matters — but so does how we implement it."
      />


      <div
        style={{
          ...panelStyle,
          overflow: "hidden",
        }}
      >

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "1fr 1fr 1fr",
            background:
              "rgba(255,255,255,0.035)",
            padding:
              "13px 16px",
            color: "#7f8997",
            fontSize: "10px",
            fontWeight: 800,
          }}
        >

          <div>
            OPERATION
          </div>

          <div>
            PURPOSE
          </div>

          <div>
            CURRENT ARRAY COST
          </div>

        </div>


        {[
          [
            "enqueue()",
            "Add to rear",
            "O(1) amortized",
          ],

          [
            "peek()",
            "Inspect front",
            "O(1)",
          ],

          [
            "dequeue()",
            "Remove front",
            "O(n) with shift()",
          ],

          [
            "Set membership",
            "Check completion",
            "O(1) average",
          ],
        ].map(
          ([operation, purpose, complexity]) => (

            <div
              key={operation}
              style={{
                display: "grid",
                gridTemplateColumns:
                  "1fr 1fr 1fr",
                padding:
                  "15px 16px",
                borderTop:
                  "1px solid rgba(255,255,255,0.06)",
                color: "#c8ced7",
                fontSize: "11px",
              }}
            >

              <div
                style={{
                  fontFamily:
                    "monospace",
                  color: "#fff",
                }}
              >
                {operation}
              </div>

              <div
                style={{
                  color: "#929dac",
                }}
              >
                {purpose}
              </div>

              <div
                style={{
                  color:
                    complexity.includes(
                      "O(1)"
                    )
                      ? "#72dca3"
                      : "#ffcb70",
                  fontFamily:
                    "monospace",
                }}
              >
                {complexity}
              </div>

            </div>

          )
        )}

      </div>


      <div
        style={{
          ...panelStyle,
          marginTop: "16px",
          padding: "20px",
        }}
      >

        <div
          style={{
            color: "#ffcb70",
            fontSize: "11px",
            fontWeight: 800,
            letterSpacing:
              "0.08em",
            marginBottom: "12px",
          }}
        >
          IMPORTANT TECHNICAL DETAIL
        </div>


        <div
          style={{
            color: "#d7dce3",
            fontSize: "13px",
            lineHeight: 1.75,
          }}
        >
          Our current queue uses a JavaScript
          array and{" "}
          <code
            style={{
              color: "#fff",
              background:
                "rgba(255,255,255,0.08)",
              padding:
                "2px 5px",
              borderRadius:
                "4px",
            }}
          >
            shift()
          </code>
          .
          <br />
          <br />
          That means removing the first item
          can require the remaining elements
          to be shifted.
          <br />
          <br />
          A production queue could instead use
          a front index or a linked structure
          to avoid that repeated shifting.
        </div>

      </div>

    </div>
  );


  /*
   * =========================================================
   * RENDER: PRESENTATION
   * =========================================================
   */

  const renderPresentation = () => (

    <div style={contentStyle}>

      <SectionHeading
        eyebrow="08 • DEMONSTRATION GUIDE"
        title="How to present this"
        subtitle="A short sequence that turns the lab into a live explanation."
      />


      {[
        [
          "01",
          "Start with the problem",
          "“Our cooking game has a fixed sequence of actions. We needed a way to enforce that order.”",
        ],

        [
          "02",
          "Show the Queue",
          "Open the Queue visualizer and explain FRONT, REAR, PEEK and DEQUEUE.",
        ],

        [
          "03",
          "Run it",
          "Click PEEK(), then DEQUEUE(). Let the teacher watch the FRONT move.",
        ],

        [
          "04",
          "Show the source",
          "Open the Source Code section and point to enqueue(), peek() and dequeue().",
        ],

        [
          "05",
          "Break it",
          "Go to Failure Case and show what happens when the player attempts to skip an action.",
        ],

        [
          "06",
          "Discuss complexity",
          "Mention the current array implementation and honestly explain why shift() makes dequeue O(n).",
        ],
      ].map(
        ([number, title, text]) => (

          <div
            key={number}
            style={{
              ...panelStyle,
              padding:
                "16px 18px",
              marginBottom:
                "9px",
              display:
                "flex",
              gap:
                "16px",
              alignItems:
                "flex-start",
            }}
          >

            <div
              style={{
                color: "#69e3a3",
                fontFamily:
                  "monospace",
                fontSize: "12px",
                fontWeight: 800,
                paddingTop: "2px",
              }}
            >
              {number}
            </div>


            <div>

              <div
                style={{
                  color: "#fff",
                  fontSize: "13px",
                  fontWeight: 800,
                  marginBottom:
                    "5px",
                }}
              >
                {title}
              </div>

              <div
                style={{
                  color: "#929dab",
                  fontSize: "11px",
                  lineHeight: 1.6,
                }}
              >
                {text}
              </div>

            </div>

          </div>

        )
      )}


      <div
        style={{
          marginTop: "15px",
          padding: "18px",
          borderRadius: "12px",
          background:
            "linear-gradient(135deg, rgba(105,227,163,0.10), rgba(100,160,255,0.08))",
          border:
            "1px solid rgba(105,227,163,0.18)",
        }}
      >

        <div
          style={{
            color: "#fff",
            fontWeight: 800,
            fontSize: "13px",
            marginBottom: "8px",
          }}
        >
          The line to remember
        </div>

        <div
          style={{
            color: "#cbd3dc",
            fontSize: "13px",
            lineHeight: 1.7,
          }}
        >
          “We didn't implement a Queue just to
          demonstrate a Queue. We used it because
          the recipe itself is a FIFO problem.”
        </div>

      </div>

    </div>
  );


  /*
   * =========================================================
   * RENDER: SUMMARY
   * =========================================================
   */

  const renderSummary = () => (

    <div style={contentStyle}>

      <SectionHeading
        eyebrow="09 • FINAL"
        title="DSA in Sefirah"
        subtitle="Three structures. Three responsibilities."
      />


      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(3, 1fr)",
          gap: "12px",
        }}
      >

        {[
          {
            icon: "📋",
            name: "QUEUE",
            role:
              "Controls the order of recipe actions.",
          },

          {
            icon: "⚡",
            name: "SET",
            role:
              "Tracks whether actions have already been completed.",
          },

          {
            icon: "🔄",
            name: "STATE",
            role:
              "Controls the current cooking stage and UI.",
          },
        ].map(
          (item) => (

            <div
              key={item.name}
              style={{
                ...panelStyle,
                padding: "22px",
              }}
            >

              <div
                style={{
                  fontSize: "30px",
                  marginBottom:
                    "12px",
                }}
              >
                {item.icon}
              </div>

              <div
                style={{
                  color: "#69e3a3",
                  fontFamily:
                    "monospace",
                  fontSize: "11px",
                  fontWeight: 800,
                  marginBottom:
                    "10px",
                }}
              >
                {item.name}
              </div>

              <div
                style={{
                  color: "#a3adbb",
                  fontSize: "11px",
                  lineHeight: 1.6,
                }}
              >
                {item.role}
              </div>

            </div>

          )
        )}

      </div>


      <div
        style={{
          marginTop: "18px",
          ...panelStyle,
          padding: "25px",
          textAlign: "center",
        }}
      >

        <div
          style={{
            color: "#fff",
            fontSize: "22px",
            fontWeight: 800,
            lineHeight: 1.4,
          }}
        >
          Theory became
          <br />
          working software.
        </div>


        <div
          style={{
            color: "#8994a3",
            fontSize: "12px",
            marginTop: "12px",
          }}
        >
          That is the point of DSA in Sefirah.
        </div>

      </div>


      <div
        style={{
          display: "flex",
          justifyContent:
            "center",
          marginTop: "20px",
        }}
      >

        <button
          type="button"
          onClick={() =>
            setSection(
              "queue"
            )
          }
          style={{
            ...buttonStyle,
            background:
              "rgba(105,227,163,0.13)",
            border:
              "1px solid rgba(105,227,163,0.35)",
            color:
              "#83eab1",
            padding:
              "12px 22px",
          }}
        >
          RUN QUEUE DEMO AGAIN
        </button>

      </div>

    </div>
  );


  /*
   * =========================================================
   * CONTENT SELECTOR
   * =========================================================
   */

  const renderContent = () => {

    switch (section) {

      case "overview":
        return renderOverview();

      case "why":
        return renderWhy();

      case "queue":
        return renderQueue();

      case "code":
        return renderCode();

      case "set":
        return renderSet();

      case "state":
        return renderState();

      case "failure":
        return renderFailure();

      case "complexity":
        return renderComplexity();

      case "presentation":
        return renderPresentation();

      case "summary":
        return renderSummary();

      default:
        return renderOverview();
    }
  };


  /*
   * =========================================================
   * WINDOW STYLE
   * =========================================================
   */

  const windowStyle:
    CSSProperties = {

    position:
      "fixed",

    left:
      windowPosition.centered
        ? "50%"
        : `${windowPosition.left}px`,

    top:
      windowPosition.centered
        ? "50%"
        : `${windowPosition.top}px`,

    width:
      `min(${WINDOW_WIDTH}px, 94vw)`,

    height:
      `min(${WINDOW_HEIGHT}px, 88vh)`,

    transform:
      windowPosition.centered
        ? "translate(-50%, -50%)"
        : "none",

    zIndex:
      windowPosition.zIndex,

    display:
      "flex",

    flexDirection:
      "column",

    overflow:
      "hidden",

    background:
      "rgba(16,18,22,0.94)",

    border:
      "1px solid rgba(255,255,255,0.13)",

    borderRadius:
      "14px",

    boxShadow:
      "0 30px 90px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.04)",

    backdropFilter:
      "blur(30px) saturate(140%)",

    WebkitBackdropFilter:
      "blur(30px) saturate(140%)",

    fontFamily:
      "Comfortaa, sans-serif",
  };


  /*
   * =========================================================
   * RENDER
   * =========================================================
   */

  return (

    <div
      data-dsa-window
      style={windowStyle}
      onMouseDown={focusWindow}
    >

      {/* =====================================================
          TITLE BAR
      ===================================================== */}

      <div
        onMouseDown={
          handleWindowDragStart
        }
        style={{
          height: "42px",
          flexShrink: 0,

          display: "flex",
          alignItems: "center",

          padding:
            "0 12px",

          background:
            "rgba(255,255,255,0.045)",

          borderBottom:
            "1px solid rgba(255,255,255,0.08)",

          cursor:
            isDragging
              ? "grabbing"
              : "grab",

          userSelect:
            "none",
        }}
      >

        <div
          style={{
            display: "flex",
            gap: "7px",
            marginRight: "14px",
          }}
        >

          <WindowDot
            color="#ff5f57"
            onClick={onClose}
          />

          <WindowDot
            color="#febc2e"
          />

          <WindowDot
            color="#28c840"
          />

        </div>


        <div
          style={{
            fontSize: "11px",
            color: "#dbe1e8",
            fontWeight: 800,
          }}
        >
          Data Structures Lab
        </div>


        <div
          style={{
            marginLeft: "auto",
            fontSize: "9px",
            color: "#657080",
            fontFamily:
              "monospace",
          }}
        >
          SEFIRAH • DSA
        </div>

      </div>


      {/* =====================================================
          BODY
      ===================================================== */}

      <div
        style={{
          flex: 1,
          minHeight: 0,
          display: "flex",
        }}
      >

        {/* ===================================================
            SIDEBAR
        =================================================== */}

        <aside
          style={{
            width: "190px",
            flexShrink: 0,

            borderRight:
              "1px solid rgba(255,255,255,0.08)",

            background:
              "rgba(0,0,0,0.16)",

            padding:
              "14px 10px",

            overflowY:
              "auto",
          }}
        >

          <div
            style={{
              padding:
                "7px 9px",
              color:
                "#687384",
              fontSize:
                "9px",
              fontWeight:
                800,
              letterSpacing:
                "0.08em",
            }}
          >
            LAB SECTIONS
          </div>


          {sections.map(
            (item, index) => {

              const active =
                section === item;

              return (

                <button
                  key={item}
                  type="button"
                  onClick={() =>
                    setSection(item)
                  }
                  style={{
                    width: "100%",
                    border: "none",
                    background:
                      active
                        ? "rgba(105,227,163,0.10)"
                        : "transparent",
                    color:
                      active
                        ? "#82eab0"
                        : "#8994a3",
                    borderRadius:
                      "8px",
                    padding:
                      "9px 10px",
                    marginBottom:
                      "2px",
                    textAlign:
                      "left",
                    cursor:
                      "pointer",
                    fontFamily:
                      "Comfortaa, sans-serif",
                    fontSize:
                      "10px",
                    fontWeight:
                      active
                        ? 800
                        : 600,
                    display:
                      "flex",
                    alignItems:
                      "center",
                    gap:
                      "9px",
                  }}
                >

                  <span
                    style={{
                      width: "18px",
                      color:
                        active
                          ? "#69e3a3"
                          : "#596373",
                      fontFamily:
                        "monospace",
                      fontSize:
                        "9px",
                    }}
                  >
                    {String(
                      index + 1
                    ).padStart(
                      2,
                      "0"
                    )}
                  </span>

                  {sectionLabels[item]}

                </button>

              );
            }
          )}


          <div
            style={{
              marginTop:
                "18px",
              padding:
                "12px 9px",
              borderTop:
                "1px solid rgba(255,255,255,0.07)",
              color:
                "#596373",
              fontSize:
                "9px",
              lineHeight:
                1.6,
            }}
          >
            TIP
            <br />
            Use Queue → Source Code →
            Failure Case when presenting
            this lab live.
          </div>

        </aside>


        {/* ===================================================
            MAIN CONTENT
        =================================================== */}

        <main
          style={{
            flex: 1,
            minWidth: 0,
            overflowY: "auto",
            background:
              "radial-gradient(circle at 80% 0%, rgba(80,120,180,0.06), transparent 40%)",
          }}
        >

          {renderContent()}

        </main>

      </div>


      {/* =====================================================
          FOOTER / PRESENTATION CONTROLS
      ===================================================== */}

      <div
        style={{
          height: "45px",
          flexShrink: 0,

          borderTop:
            "1px solid rgba(255,255,255,0.08)",

          display:
            "flex",

          alignItems:
            "center",

          padding:
            "0 12px",

          background:
            "rgba(0,0,0,0.12)",
        }}
      >

        <div
          style={{
            color: "#626d7c",
            fontFamily:
              "monospace",
            fontSize: "9px",
          }}
        >
          {String(
            currentSectionIndex + 1
          ).padStart(2, "0")}
          {" / "}
          {String(
            sections.length
          ).padStart(2, "0")}
        </div>


        <div
          style={{
            marginLeft:
              "auto",
            display:
              "flex",
            gap:
              "7px",
          }}
        >

          <button
            type="button"
            onClick={goPrevious}
            disabled={
              currentSectionIndex === 0
            }
            style={{
              ...buttonStyle,
              padding:
                "6px 10px",
              opacity:
                currentSectionIndex === 0
                  ? 0.35
                  : 1,
            }}
          >
            ←
          </button>


          <button
            type="button"
            onClick={goNext}
            disabled={
              currentSectionIndex ===
              sections.length - 1
            }
            style={{
              ...buttonStyle,
              padding:
                "6px 10px",
              opacity:
                currentSectionIndex ===
                sections.length - 1
                  ? 0.35
                  : 1,
            }}
          >
            →
          </button>

        </div>

      </div>

    </div>
  );
}


/*
 * =========================================================
 * SECTION HEADING
 * =========================================================
 */

function SectionHeading({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
}) {

  return (

    <div
      style={{
        marginBottom:
          "22px",
      }}
    >

      <div
        style={{
          color:
            "#69e3a3",
          fontSize:
            "10px",
          fontWeight:
            800,
          letterSpacing:
            "0.1em",
          marginBottom:
            "8px",
        }}
      >
        {eyebrow}
      </div>


      <h2
        style={{
          margin:
            0,
          color:
            "#fff",
          fontSize:
            "27px",
          lineHeight:
            1.2,
          fontWeight:
            800,
        }}
      >
        {title}
      </h2>


      <div
        style={{
          marginTop:
            "8px",
          color:
            "#818c9b",
          fontSize:
            "12px",
        }}
      >
        {subtitle}
      </div>

    </div>
  );
}


/*
 * =========================================================
 * CODE BLOCK
 * =========================================================
 */

function CodeBlock({
  title,
  code,
}: {
  title: string;
  code: string;
}) {

  return (

    <div
      style={{
        background:
          "#0a0c0f",
        border:
          "1px solid rgba(255,255,255,0.09)",
        borderRadius:
          "12px",
        overflow:
          "hidden",
      }}
    >

      <div
        style={{
          padding:
            "10px 13px",
          borderBottom:
            "1px solid rgba(255,255,255,0.07)",
          color:
            "#7d8897",
          fontSize:
            "10px",
          fontFamily:
            "monospace",
        }}
      >
        {title}
      </div>


      <pre
        style={{
          margin:
            0,
          padding:
            "18px",
          color:
            "#dce3ec",
          fontFamily:
            "monospace",
          fontSize:
            "10px",
          lineHeight:
            1.7,
          overflowX:
            "auto",
        }}
      >
        <code>
          {code}
        </code>
      </pre>

    </div>
  );
}


/*
 * =========================================================
 * DEMO BUTTON
 * =========================================================
 */

function DemoButton({
  label,
  onClick,
}: {
  label: string;
  onClick: () => void;
}) {

  return (

    <button
      type="button"
      onClick={onClick}
      style={{
        border:
          "1px solid rgba(105,227,163,0.22)",

        background:
          "rgba(105,227,163,0.07)",

        color:
          "#83eab1",

        borderRadius:
          "8px",

        padding:
          "9px 13px",

        fontFamily:
          "Comfortaa, sans-serif",

        fontSize:
          "10px",

        fontWeight:
          800,

        cursor:
          "pointer",

        transition:
          "all 140ms ease",
      }}
    >
      {label}
    </button>
  );
}


/*
 * =========================================================
 * WINDOW DOT
 * =========================================================
 */

function WindowDot({
  color,
  onClick,
}: {
  color: string;
  onClick?: () => void;
}) {

  return (

    <button
      type="button"
      onClick={(event) => {

        event.stopPropagation();

        onClick?.();
      }}
      style={{
        width:
          "11px",

        height:
          "11px",

        padding:
          0,

        border:
          "none",

        borderRadius:
          "50%",

        background:
          color,

        cursor:
          onClick
            ? "pointer"
            : "default",

        boxShadow:
          `inset 0 0 0 1px rgba(0,0,0,0.15)`,
      }}
      aria-label={
        onClick
          ? "Close"
          : undefined
      }
    />

  );
}


/*
 * =========================================================
 * STYLES
 * =========================================================
 */

const contentStyle:
  CSSProperties = {

  padding:
    "28px 30px 35px",

  maxWidth:
    "930px",

  margin:
    "0 auto",

  minHeight:
    "100%",
};


const heroTitleStyle:
  CSSProperties = {

  margin:
    0,

  color:
    "#ffffff",

  fontSize:
    "42px",

  lineHeight:
    1.08,

  fontWeight:
    800,

  letterSpacing:
    "-0.025em",
};


const heroTextStyle:
  CSSProperties = {

  maxWidth:
    "650px",

  marginTop:
    "16px",

  color:
    "#9aa5b4",

  fontSize:
    "14px",

  lineHeight:
    1.75,
};