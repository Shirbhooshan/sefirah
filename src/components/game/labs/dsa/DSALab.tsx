"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

/*
 * =========================================================
>>>>>>> parent of 9f78dab (DSALab Ver.1.2.0 restructring the slides)
 * TYPES
 * ============================================================
 */

interface DSALabProps {
  onClose?: () => void;
  onFocus?: () => void;

  onMove?: (
    left: number,
    top: number
  ) => void;

  windowPosition: {
    left: number;
    top: number;
    zIndex: number;
    centered: boolean;
  };
}


/*
 * =========================================================
 * DSA TYPES
 * =========================================================
 */

type CookingAction =
  | "cooking_oil"
  | "cut_garlic"
  | "cut_carrot"
  | "rice"
  | "egg"
  | "soy_sauce"
  | "cut_green_onion"
  | "stir";


/*
 * =========================================================
 * QUEUE
 *
 * Same basic structure used by the cooking-game logic.
 * =========================================================
 */

class CookingQueue<T> {
  private items: T[] = [];

  constructor(initial: T[] = []) {
    this.items = [...initial];
  }

  enqueue(item: T) {
    this.items.push(item);
  }

  peek(): T | undefined {
    return this.items[0];
  }

  dequeue(): T | undefined {
    return this.items.shift();
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
 * SLIDES
 * =========================================================
 */

const recipeActions: CookingAction[] = [
  "cooking_oil",
  "cut_garlic",
  "cut_carrot",
  "rice",
  "egg",
  "soy_sauce",
  "cut_green_onion",
  "stir",
];


const actionLabels: Record<
  CookingAction,
  string
> = {
  cooking_oil: "Add Cooking Oil",
  cut_garlic: "Add Cut Garlic",
  cut_carrot: "Add Cut Carrot",
  rice: "Add Cold Rice",
  egg: "Add Egg",
  soy_sauce: "Add Soy Sauce",
  cut_green_onion: "Add Green Onion",
  stir: "Stir Fried Rice",
};


/*
 * =========================================================
 * SLIDES
 * =========================================================
 */

const slides = [
  {
    title: "DSA IN SEFIRAH",
    subtitle:
      "How Data Structures actually control our cooking game",
    type: "intro",
  },

  {
    title: "1. THE PROBLEM",
    subtitle:
      "Why does the game need Data Structures?",
    type: "problem",
  },

  {
    title: "2. QUEUE",
    subtitle:
      "FIFO — First In, First Out",
    type: "queue",
  },

  {
    title: "3. LIVE QUEUE SIMULATION",
    subtitle:
      "Watch the cooking pipeline change in real time",
    type: "queue-demo",
  },

  {
    title: "4. SET",
    subtitle:
      "Tracking which cooking actions are already completed",
    type: "set",
  },

  {
    title: "5. STATE MACHINE",
    subtitle:
      "Data structures + state transitions control the game",
    type: "state",
  },

  {
    title: "6. TREE",
    subtitle:
      "Representing the recipe hierarchy",
    type: "tree",
  },

  {
    title: "7. STACK",
    subtitle:
      "A live LIFO demonstration",
    type: "stack",
  },

  {
    title: "8. HOW TO PRESENT THIS",
    subtitle:
      "The 60-second explanation for the evaluator",
    type: "presentation",
  },
];


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
   * ---------------------------------------------------------
   * SLIDE STATE
   * ---------------------------------------------------------
   */

  const [
    currentSlide,
    setCurrentSlide,
  ] = useState(0);


  /*
   * ---------------------------------------------------------
   * QUEUE DEMO
   * ---------------------------------------------------------
   */

  const [
    queueItems,
    setQueueItems,
  ] = useState<CookingAction[]>(
    recipeActions
  );

  const [
    completedQueueItems,
    setCompletedQueueItems,
  ] = useState<CookingAction[]>(
    []
  );


  /*
   * ---------------------------------------------------------
   * SET DEMO
   * ---------------------------------------------------------
   */

  const [
    completedSet,
    setCompletedSet,
  ] = useState<Set<CookingAction>>(
    new Set()
  );


  /*
   * ---------------------------------------------------------
   * STACK DEMO
   * ---------------------------------------------------------
   */

  const [
    stackItems,
    setStackItems,
  ] = useState<string[]>([
    "Serve",
    "Cook",
    "Add Soy Sauce",
    "Add Rice",
  ]);


  /*
   * ---------------------------------------------------------
   * WINDOW DRAGGING
   * ---------------------------------------------------------
   */

  const dragOffset = useRef({
    x: 0,
    y: 0,
  });

  const [
    isDragging,
    setIsDragging,
  ] = useState(false);


  const handleWindowDragStart = (
    event: React.MouseEvent
  ) => {

    if (event.button !== 0) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();

    onFocus?.();

    const windowElement =
      event.currentTarget.closest(
        "[data-dsa-lab-window]"
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

      /*
       * Keep the window below the menu bar.
       */

      const menuBarHeight = 38;

      /*
       * DSA Lab is intentionally larger
       * than the Cooking Game.
       */

      const windowWidth = 1050;
      const windowHeight = 680;

      const actualWidth =
        Math.min(
          windowWidth,
          window.innerWidth * 0.92
        );

      const actualHeight =
        Math.min(
          windowHeight,
          window.innerHeight * 0.86
        );

      const maxLeft =
        Math.max(
          0,
          window.innerWidth -
            actualWidth
        );

      const maxTop =
        Math.max(
          menuBarHeight,
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
          menuBarHeight,
          Math.min(
            newTop,
            maxTop
          )
        );

      onMove?.(
        clampedLeft,
        clampedTop
      );
>>>>>>> parent of 9f78dab (DSALab Ver.1.2.0 restructring the slides)
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

<<<<<<< HEAD
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
=======
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
   * QUEUE OPERATIONS
   * =========================================================
   */

  const runQueueStep = () => {

    if (queueItems.length === 0) {
      return;
    }

    const queue =
      new CookingQueue(
        queueItems
      );

    /*
     * peek()
     *
     * Look at the next operation
     * without removing it.
     */

    const next =
      queue.peek();

    if (!next) {
      return;
    }

    /*
     * dequeue()
     *
     * Complete the operation and
     * remove it from the front.
     */

    const completed =
      queue.dequeue();

    if (!completed) {
      return;
    }

    setQueueItems(
      queue.toArray()
    );

    setCompletedQueueItems(
      (previous) => [
        ...previous,
        completed,
      ]
    );
  };


  const resetQueue = () => {

    setQueueItems(
      recipeActions
    );

    setCompletedQueueItems(
      []
    );

  };


  /*
   * =========================================================
   * SET OPERATION
   * =========================================================
   */

  const completeSetAction = (
    action: CookingAction
  ) => {

    setCompletedSet(
      (previous) => {

        const next =
          new Set(previous);

        next.add(action);

        return next;
      }
    );

  };


  const resetSet = () => {

    setCompletedSet(
      new Set()
    );

  };


  /*
   * =========================================================
   * STACK OPERATIONS
   * =========================================================
   */

  const pushStack = () => {

    setStackItems(
      (previous) => [
        ...previous,
        "New Cooking Step",
      ]
    );

  };


  const popStack = () => {

    setStackItems(
      (previous) => {

        if (
          previous.length === 0
        ) {
          return previous;
        }

        return previous.slice(
          0,
          -1
        );

      }
    );

  };


  const resetStack = () => {

    setStackItems([
      "Serve",
      "Cook",
      "Add Soy Sauce",
      "Add Rice",
    ]);

  };


  /*
   * =========================================================
   * NAVIGATION
   * =========================================================
   */

  const goNext = () => {

    setCurrentSlide(
      (current) =>
        Math.min(
          slides.length - 1,
          current + 1
        )
    );

  };


  const goPrevious = () => {

    setCurrentSlide(
      (current) =>
        Math.max(
          0,
          current - 1
        )
    );

  };


  useEffect(() => {

    const handleKeyboard = (
      event: KeyboardEvent
    ) => {

      if (
        event.key === "ArrowRight"
      ) {
        goNext();
      }

      if (
        event.key === "ArrowLeft"
      ) {
        goPrevious();
      }

      if (
        event.key === "Escape"
      ) {
        onClose?.();
      }

    };

    window.addEventListener(
      "keydown",
      handleKeyboard
    );

    return () => {

      window.removeEventListener(
        "keydown",
        handleKeyboard
      );

    };

  });


  /*
   * =========================================================
   * CURRENT SLIDE
   * =========================================================
   */

  const slide =
    slides[currentSlide];


  /*
   * =========================================================
   * WINDOW STYLE
   * =========================================================
   */

  const windowStyle:
    React.CSSProperties = {

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
      "min(1050px, 92vw)",

    height:
      "min(680px, 86vh)",

    minWidth:
      "760px",

    minHeight:
      "520px",

    background:
      "rgba(16,16,20,0.96)",

    border:
      "1px solid rgba(255,255,255,0.16)",

    borderRadius:
      "14px",

    backdropFilter:
      "blur(30px) saturate(150%)",

    WebkitBackdropFilter:
      "blur(30px) saturate(150%)",

    boxShadow:
      "0 30px 80px rgba(0,0,0,0.55)",

    overflow:
      "hidden",

    zIndex:
      windowPosition.zIndex,

    color:
      "#fff",

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
      data-dsa-lab-window
      style={windowStyle}
      onMouseDown={() =>
        onFocus?.()
      }
    >

      {/* =====================================================
          TITLE BAR
      ====================================================== */}

      <div
        onMouseDown={
          handleWindowDragStart
        }

        style={{
          height: "42px",

          flexShrink: 0,

          display: "flex",

          alignItems: "center",

          justifyContent:
            "space-between",

          padding:
            "0 14px",

          background:
            "rgba(255,255,255,0.055)",

          borderBottom:
            "1px solid rgba(255,255,255,0.10)",

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
            alignItems: "center",
            gap: "9px",
          }}
        >

          <div
            style={{
              width: "10px",
              height: "10px",
              borderRadius: "50%",
              background:
                "#e96b6b",
            }}
          />

          <div
            style={{
              width: "10px",
              height: "10px",
              borderRadius: "50%",
              background:
                "#e5bd5c",
            }}
          />

          <div
            style={{
              width: "10px",
              height: "10px",
              borderRadius: "50%",
              background:
                "#67c879",
            }}
          />

          <span
            style={{
              marginLeft: "8px",

              fontSize: "13px",

              fontWeight: 700,

              opacity: 0.82,
            }}
          >
            Data Structures Lab
          </span>

        </div>


        <button
          type="button"
          onClick={onClose}
          onMouseDown={(event) =>
            event.stopPropagation()
          }
          style={{
            width: "28px",
            height: "28px",

            border: "none",
            borderRadius: "7px",

            background:
              "rgba(255,255,255,0.08)",

            color: "#fff",

            cursor: "pointer",

            fontSize: "16px",
          }}
        >
          ×
        </button>

      </div>


      {/* =====================================================
          MAIN CONTENT
      ====================================================== */}

      <div
        style={{
          display: "flex",
          height:
            "calc(100% - 42px)",
        }}
      >

        {/* =================================================
            SLIDE SIDEBAR
        ================================================= */}

        <aside
          style={{
            width: "190px",

            flexShrink: 0,

            padding: "18px 10px",

            background:
              "rgba(0,0,0,0.18)",

            borderRight:
              "1px solid rgba(255,255,255,0.08)",

            overflowY: "auto",
          }}
        >

          <div
            style={{
              fontSize: "10px",

              fontWeight: 700,

              letterSpacing:
                "0.12em",

              opacity: 0.42,

              padding:
                "0 10px 12px",
            }}
          >
            PRESENTATION
          </div>


          {slides.map(
            (
              item,
              index
            ) => {

              const active =
                index ===
                currentSlide;

              return (

                <button
                  key={
                    item.title
                  }

                  type="button"

                  onClick={() =>
                    setCurrentSlide(
                      index
                    )
                  }

                  style={{
                    width: "100%",

                    padding:
                      "10px",

                    marginBottom:
                      "4px",

                    border: "none",

                    borderRadius:
                      "8px",

                    background:
                      active
                        ? "rgba(63,169,255,0.16)"
                        : "transparent",

                    color:
                      active
                        ? "#fff"
                        : "rgba(255,255,255,0.48)",

                    textAlign:
                      "left",

                    cursor:
                      "pointer",

                    fontFamily:
                      "Comfortaa, sans-serif",
                  }}
                >

                  <div
                    style={{
                      fontSize:
                        "10px",

                      fontWeight:
                        700,

                      marginBottom:
                        "4px",

                      opacity:
                        active
                          ? 1
                          : 0.7,
                    }}
                  >
                    {String(
                      index + 1
                    ).padStart(
                      2,
                      "0"
                    )}
                  </div>

                  <div
                    style={{
                      fontSize:
                        "11px",

                      lineHeight:
                        1.4,
                    }}
                  >
                    {item.title}
                  </div>

                </button>

              );

            }
          )}

        </aside>


        {/* =================================================
            SLIDE
        ================================================= */}

        <main
          style={{
            flex: 1,

            minWidth: 0,

            display: "flex",

            flexDirection:
              "column",
          }}
        >

          {/* =================================================
              SLIDE HEADER
          ================================================= */}

          <div
            style={{
              padding:
                "25px 34px 15px",

              flexShrink: 0,
            }}
          >

            <div
              style={{
                fontSize:
                  "11px",

                letterSpacing:
                  "0.14em",

                color:
                  "#67b7ff",

                fontWeight:
                  700,

                marginBottom:
                  "7px",
              }}
            >
              DSA LAB ·{" "}
              {String(
                currentSlide + 1
              ).padStart(
                2,
                "0"
              )}{" "}
              /{" "}
              {String(
                slides.length
              ).padStart(
                2,
                "0"
              )}
            </div>

            <h1
              style={{
                margin: 0,

                fontSize:
                  "27px",

                lineHeight:
                  1.2,

                fontWeight:
                  800,
              }}
            >
              {slide.title}
            </h1>

            <div
              style={{
                marginTop:
                  "7px",

                fontSize:
                  "13px",

                opacity:
                  0.52,
              }}
            >
              {slide.subtitle}
            </div>

          </div>


          {/* =================================================
              SLIDE BODY
          ================================================= */}

          <div
            style={{
              flex: 1,

              overflowY:
                "auto",

              padding:
                "8px 34px 20px",
            }}
          >

            {/* =================================================
                INTRO
            ================================================= */}

            {slide.type ===
              "intro" && (

              <div
                style={{
                  minHeight:
                    "100%",

                  display:
                    "flex",

                  flexDirection:
                    "column",

                  justifyContent:
                    "center",

                  maxWidth:
                    "760px",
                }}
              >

                <div
                  style={{
                    fontSize:
                      "58px",

                    fontWeight:
                      900,

                    lineHeight:
                      1,

                    marginBottom:
                      "22px",
                  }}
                >
                  DSA
                  <span
                    style={{
                      opacity:
                        0.35,
                    }}
                  >
                    ×
                  </span>
                  SEFIRAH
                </div>

                <div
                  style={{
                    fontSize:
                      "19px",

                    lineHeight:
                      1.7,

                    opacity:
                      0.72,
                  }}
                >
                  We didn't add Data Structures
                  just to satisfy a subject
                  requirement.
                </div>

                <div
                  style={{
                    marginTop:
                      "22px",

                    padding:
                      "18px",

                    borderRadius:
                      "12px",

                    background:
                      "rgba(63,169,255,0.08)",

                    border:
                      "1px solid rgba(63,169,255,0.18)",

                    fontSize:
                      "15px",

                    lineHeight:
                      1.7,
                  }}
                >
                  Our cooking engine has to
                  maintain an ordered sequence
                  of operations, track completed
                  operations, and transition
                  between cooking states.
                  <br />
                  <br />
                  That is where DSA becomes
                  part of the actual application.
                </div>

              </div>
            )}


            {/* =================================================
                PROBLEM
            ================================================= */}

            {slide.type ===
              "problem" && (

              <div
                style={{
                  display:
                    "grid",

                  gridTemplateColumns:
                    "1fr 1fr",

                  gap:
                    "18px",

                  maxWidth:
                    "850px",

                  margin:
                    "20px auto",
                }}
              >

                <div
                  style={{
                    padding:
                      "22px",

                    borderRadius:
                      "14px",

                    background:
                      "rgba(255,255,255,0.045)",

                    border:
                      "1px solid rgba(255,255,255,0.08)",
                  }}
                >

                  <div
                    style={{
                      color:
                        "#ff8585",

                      fontWeight:
                        800,

                      marginBottom:
                        "15px",
                    }}
                  >
                    WITHOUT DSA
                  </div>

                  <div
                    style={{
                      lineHeight:
                        1.8,

                      opacity:
                        0.65,
                    }}
                  >
                    Random UI handlers
                    <br />
                    Random recipe checks
                    <br />
                    Hard-coded progression
                    <br />
                    Difficult state tracking
                  </div>

                </div>

          {/* =================================================
              SLIDE BODY
          ================================================= */}

                <div
                  style={{
                    padding:
                      "22px",

                    borderRadius:
                      "14px",

                    background:
                      "rgba(63,169,255,0.07)",

                    border:
                      "1px solid rgba(63,169,255,0.18)",
                  }}
                >

                  <div
                    style={{
                      color:
                        "#69bbff",

                      fontWeight:
                        800,

                      marginBottom:
                        "15px",
                    }}
                  >
                    WITH DSA
                  </div>

                  <div
                    style={{
                      lineHeight:
                        1.8,

                      opacity:
                        0.78,
                    }}
                  >
                    Ordered operations
                    <br />
                    Fast state lookup
                    <br />
                    Predictable progression
                    <br />
                    Explicit algorithms
                  </div>

                </div>

              </div>
            )}


            {/* =================================================
                QUEUE
            ================================================= */}

            {slide.type ===
              "queue" && (

              <div
                style={{
                  maxWidth:
                    "850px",

                  margin:
                    "15px auto",
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
                      "22px",
                  }}
                >

                  <div
                    style={{
                      fontSize:
                        "18px",

                      fontWeight:
                        800,
                    }}
                  >
                    Cooking Queue
                  </div>

                  <div
                    style={{
                      fontSize:
                        "11px",

                      padding:
                        "6px 10px",

                      borderRadius:
                        "999px",

                      background:
                        "rgba(103,187,255,0.12)",

                      color:
                        "#70c2ff",
                    }}
                  >
                    FIFO
                  </div>

                </div>


                <div
                  style={{
                    display:
                      "flex",

                    alignItems:
                      "center",

                    gap:
                      "8px",

                    overflowX:
                      "auto",

                    padding:
                      "20px 0",
                  }}
                >

                  {[
                    "Egg",
                    "Rice",
                    "Final Cook",
                  ].map(
                    (
                      item,
                      index
                    ) => (

                      <div
                        key={
                          item
                        }

                        style={{
                          display:
                            "flex",

                          alignItems:
                            "center",

                          gap:
                            "8px",
                        }}
                      >

                        <div
                          style={{
                            minWidth:
                              "120px",

                            padding:
                              "18px 14px",

                            textAlign:
                              "center",

                            borderRadius:
                              "12px",

                            background:
                              index === 0
                                ? "rgba(103,187,255,0.16)"
                                : "rgba(255,255,255,0.055)",

                            border:
                              index === 0
                                ? "1px solid rgba(103,187,255,0.35)"
                                : "1px solid rgba(255,255,255,0.08)",
                          }}
                        >
                          <div
                            style={{
                              fontSize:
                                "10px",

                              opacity:
                                0.45,

                              marginBottom:
                                "5px",
                            }}
                          >
                            {index === 0
                              ? "FRONT"
                              : ""}
                          </div>

                          {item}

                        </div>

                        {index <
                          2 && (
                          <span
                            style={{
                              opacity:
                                0.35,

                              fontSize:
                                "20px",
                            }}
                          >
                            →
                          </span>
                        )}

                      </div>

                    )
                  )}

                </div>


                <div
                  style={{
                    marginTop:
                      "15px",

                    padding:
                      "18px",

                    borderRadius:
                      "12px",

                    background:
                      "rgba(255,255,255,0.035)",

                    lineHeight:
                      1.7,

                    opacity:
                      0.7,
                  }}
                >
                  <strong
                    style={{
                      color:
                        "#fff",
                    }}
                  >
                    Why Queue?
                  </strong>

                  <br />

                  Cooking operations can be
                  processed in the order they
                  are scheduled.

                  <br />
                  <br />

                  The implementation provides:

                  <br />

                  <code>
                    enqueue()
                  </code>{" "}
                  → add an operation

                  <br />

                  <code>
                    peek()
                  </code>{" "}
                  → inspect the next operation

                  <br />

                  <code>
                    dequeue()
                  </code>{" "}
                  → process/remove it
                </div>

              </div>
            )}


            {/* =================================================
                QUEUE DEMO
            ================================================= */}

            {slide.type ===
              "queue-demo" && (

              <div>

                <div
                  style={{
                    display:
                      "flex",

                    gap:
                      "10px",

                    marginBottom:
                      "18px",
                  }}
                >

                  <button
                    type="button"
                    onClick={
                      runQueueStep
                    }

                    disabled={
                      queueItems.length ===
                      0
                    }

                    style={{
                      padding:
                        "10px 15px",

                      border:
                        "none",

                      borderRadius:
                        "8px",

                      background:
                        "#3fa9ff",

                      color:
                        "#fff",

                      fontWeight:
                        700,

                      cursor:
                        "pointer",
                    }}
                  >
                    PROCESS NEXT → dequeue()
                  </button>


                  <button
                    type="button"
                    onClick={
                      resetQueue
                    }

                    style={{
                      padding:
                        "10px 15px",

                      border:
                        "1px solid rgba(255,255,255,0.12)",

                      borderRadius:
                        "8px",

                      background:
                        "rgba(255,255,255,0.05)",

                      color:
                        "#fff",

                      cursor:
                        "pointer",
                    }}
                  >
                    RESET
                  </button>

                </div>


                <div
                  style={{
                    fontSize:
                      "11px",

                    opacity:
                      0.45,

                    marginBottom:
                      "8px",
                  }}
                >
                  FRONT → next required operation → REAR
                </div>


                <div
                  style={{
                    display:
                      "flex",

                    gap:
                      "8px",

                    minHeight:
                      "90px",

                    padding:
                      "15px",

                    borderRadius:
                      "12px",

                    background:
                      "rgba(255,255,255,0.035)",

                    border:
                      "1px solid rgba(255,255,255,0.08)",

                    overflowX:
                      "auto",
                  }}
                >

                  {queueItems.length ===
                    0 && (

                    <div
                      style={{
                        display:
                          "flex",

                        alignItems:
                          "center",

                        opacity:
                          0.35,
                      }}
                    >
                      QUEUE EMPTY
                    </div>

                  )}


                  {queueItems.map(
                    (
                      action,
                      index
                    ) => (

                      <div
                        key={
                          `${action}-${index}`
                        }

                        style={{
                          minWidth:
                            "130px",

                          padding:
                            "14px",

                          borderRadius:
                            "10px",

                          background:
                            index === 0
                              ? "rgba(63,169,255,0.16)"
                              : "rgba(255,255,255,0.05)",

                          border:
                            index === 0
                              ? "1px solid rgba(63,169,255,0.38)"
                              : "1px solid rgba(255,255,255,0.08)",
                        }}
                      >

                        <div
                          style={{
                            fontSize:
                              "9px",

                            opacity:
                              0.45,

                            marginBottom:
                              "6px",
                          }}
                        >
                          {index === 0
                            ? "PEEK()"
                            : `QUEUE[${index}]`}
                        </div>

                        <div
                          style={{
                            fontSize:
                              "12px",

                            fontWeight:
                              700,
                          }}
                        >
                          {
                            actionLabels[
                              action
                            ]
                          }
                        </div>

                      </div>

                    )
                  )}

                </div>


                <div
                  style={{
                    marginTop:
                      "20px",

                    display:
                      "grid",

                    gridTemplateColumns:
                      "1fr 1fr",

                    gap:
                      "12px",
                  }}
                >

                  <div
                    style={{
                      padding:
                        "15px",

                      borderRadius:
                        "10px",

                      background:
                        "rgba(103,187,255,0.07)",

                      border:
                        "1px solid rgba(103,187,255,0.15)",
                    }}
                  >
                    <div
                      style={{
                        fontSize:
                          "10px",

                        opacity:
                          0.45,

                        marginBottom:
                          "5px",
                      }}
                    >
                      COMPLETED
                    </div>

                    {
                      completedQueueItems
                        .map(
                          (
                            action
                          ) =>
                            actionLabels[
                              action
                            ]
                        )
                        .join(
                          " → "
                        ) ||
                      "Nothing yet"
                    }
                  </div>


                  <div
                    style={{
                      padding:
                        "15px",

                      borderRadius:
                        "10px",

                      background:
                        "rgba(255,255,255,0.04)",
                    }}
                  >
                    <div
                      style={{
                        fontSize:
                          "10px",

                        opacity:
                          0.45,

                        marginBottom:
                          "5px",
                      }}
                    >
                      QUEUE SIZE
                    </div>

                    <div
                      style={{
                        fontSize:
                          "25px",

                        fontWeight:
                          800,
                      }}
                    >
                      {
                        queueItems.length
                      }
                    </div>
                  </div>

                </div>

              </div>
            )}


            {/* =================================================
                SET
            ================================================= */}

            {slide.type ===
              "set" && (

              <div
                style={{
                  maxWidth:
                    "850px",

                  margin:
                    "10px auto",
                }}
              >

                <div
                  style={{
                    display:
                      "flex",

                    gap:
                      "10px",

                    flexWrap:
                      "wrap",

                    marginBottom:
                      "18px",
                  }}
                >

                  {recipeActions.map(
                    (
                      action
                    ) => {

                      const exists =
                        completedSet.has(
                          action
                        );

                      return (

                        <button
                          key={
                            action
                          }

                          type="button"

                          onClick={() =>
                            completeSetAction(
                              action
                            )
                          }

                          style={{
                            padding:
                              "9px 12px",

                            border:
                              "1px solid " +
                              (
                                exists
                                  ? "rgba(103,200,121,0.4)"
                                  : "rgba(255,255,255,0.1)"
                              ),

                            borderRadius:
                              "8px",

                            background:
                              exists
                                ? "rgba(103,200,121,0.12)"
                                : "rgba(255,255,255,0.04)",

                            color:
                              "#fff",

                            cursor:
                              "pointer",

                            fontSize:
                              "11px",
                          }}
                        >
                          {exists
                            ? "✓ "
                            : "+ "}
                          {
                            actionLabels[
                              action
                            ]
                          }
                        </button>

                      );

                    }
                  )}

                </div>


                <button
                  type="button"
                  onClick={
                    resetSet
                  }

                  style={{
                    padding:
                      "9px 13px",

                    border:
                      "none",

                    borderRadius:
                      "8px",

                    background:
                      "rgba(255,255,255,0.07)",

                    color:
                      "#fff",

                    cursor:
                      "pointer",

                    marginBottom:
                      "20px",
                  }}
                >
                  RESET SET
                </button>


                <div
                  style={{
                    padding:
                      "20px",

                    borderRadius:
                      "12px",

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

                      opacity:
                        0.45,

                      marginBottom:
                        "10px",
                    }}
                  >
                    COMPLETED ACTIONS SET
                  </div>

                  <code
                    style={{
                      fontSize:
                        "14px",

                      lineHeight:
                        2,
                    }}
                  >
                    {"{"}
                    {" "}
                    {
                      Array.from(
                        completedSet
                      ).join(
                        ", "
                      )
                    }{" "}
                    {"}"}
                  </code>

                  <div
                    style={{
                      marginTop:
                        "14px",

                      opacity:
                        0.65,

                      fontSize:
                        "12px",

                      lineHeight:
                        1.6,
                    }}
                  >
                    A Set prevents duplicate
                    entries and lets the game
                    quickly check whether an
                    action has already been
                    completed.
                  </div>

                </div>

              </div>
            )}


            {/* =================================================
                STATE MACHINE
            ================================================= */}

            {slide.type ===
              "state" && (

              <div
                style={{
                  maxWidth:
                    "850px",

                  margin:
                    "15px auto",
                }}
              >

                <div
                  style={{
                    display:
                      "flex",

                    flexWrap:
                      "wrap",

                    gap:
                      "8px",

                    alignItems:
                      "center",
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
                    (
                      state,
                      index,
                      array
                    ) => (

                      <div
                        key={
                          state
                        }

                        style={{
                          display:
                            "flex",

                          alignItems:
                            "center",

                          gap:
                            "8px",
                        }}
                      >

                        <div
                          style={{
                            padding:
                              "12px",

                            borderRadius:
                              "10px",

                            background:
                              "rgba(63,169,255,0.09)",

                            border:
                              "1px solid rgba(63,169,255,0.20)",

                            fontSize:
                              "11px",

                            fontWeight:
                              700,
                          }}
                        >
                          {state}
                        </div>

                        {index <
                          array.length -
                            1 && (
                          <span
                            style={{
                              opacity:
                                0.3,
                            }}
                          >
                            →
                          </span>
                        )}

                      </div>

                    )
                  )}

                </div>


                <div
                  style={{
                    marginTop:
                      "28px",

                    padding:
                      "20px",

                    borderRadius:
                      "12px",

                    background:
                      "rgba(255,255,255,0.035)",

                    lineHeight:
                      1.8,

                    fontSize:
                      "13px",

                    opacity:
                      0.72,
                  }}
                >

                  <strong
                    style={{
                      color:
                        "#fff",
                    }}
                  >
                    Example:
                  </strong>

                  <br />

                  The queue tells us what action
                  should happen next.

                  <br />

                  The game then changes its
                  cooking state after that action
                  is successfully completed.

                  <br />
                  <br />

                  <code>
                    Queue → Validator → State
                    Transition → New Image
                  </code>

                </div>

              </div>
            )}


            {/* =================================================
                TREE
            ================================================= */}

            {slide.type ===
              "tree" && (

              <div
                style={{
                  maxWidth:
                    "800px",

                  margin:
                    "10px auto",

                  textAlign:
                    "center",
                }}
              >

                <div
                  style={{
                    display:
                      "inline-block",

                    padding:
                      "15px 24px",

                    borderRadius:
                      "12px",

                    background:
                      "rgba(103,187,255,0.14)",

                    border:
                      "1px solid rgba(103,187,255,0.3)",

                    fontWeight:
                      800,
                  }}
                >
                  FRIED RICE
                </div>


                <div
                  style={{
                    fontSize:
                      "30px",

                    opacity:
                      0.35,

                    lineHeight:
                      1,
                  }}
                >
                  ↓
                </div>


                <div
                  style={{
                    display:
                      "flex",

                    justifyContent:
                      "center",

                    gap:
                      "50px",
                  }}
                >

                  <div>

                    <div
                      style={{
                        padding:
                          "12px 18px",

                        borderRadius:
                          "10px",

                        background:
                          "rgba(255,255,255,0.06)",
                      }}
                    >
                      PREPARATION
                    </div>

                    <div
                      style={{
                        marginTop:
                          "10px",

                        display:
                          "flex",

                        gap:
                          "8px",
                      }}
                    >

                      {[
                        "Garlic",
                        "Carrot",
                      ].map(
                        (
                          item
                        ) => (
                          <div
                            key={
                              item
                            }
                            style={{
                              padding:
                                "9px",

                              borderRadius:
                                "8px",

                              background:
                                "rgba(255,255,255,0.04)",

                              fontSize:
                                "11px",
                            }}
                          >
                            {item}
                          </div>
                        )
                      )}

                    </div>

                  </div>


                  <div>

                    <div
                      style={{
                        padding:
                          "12px 18px",

                        borderRadius:
                          "10px",

                        background:
                          "rgba(255,255,255,0.06)",
                      }}
                    >
                      COOKING
                    </div>

                    <div
                      style={{
                        marginTop:
                          "10px",

                        display:
                          "flex",

                        gap:
                          "8px",
                      }}
                    >

                      {[
                        "Oil",
                        "Rice",
                        "Egg",
                      ].map(
                        (
                          item
                        ) => (
                          <div
                            key={
                              item
                            }
                            style={{
                              padding:
                                "9px",

                              borderRadius:
                                "8px",

                              background:
                                "rgba(255,255,255,0.04)",

                              fontSize:
                                "11px",
                            }}
                          >
                            {item}
                          </div>
                        )
                      )}

                    </div>

                  </div>

                </div>


                <div
                  style={{
                    marginTop:
                      "28px",

                    opacity:
                      0.55,

                    fontSize:
                      "12px",

                    lineHeight:
                      1.6,
                  }}
                >
                  This is a general recipe
                  hierarchy/tree representation,
                  not a Binary Search Tree or AVL
                  Tree.
                </div>

              </div>
            )}


            {/* =================================================
                STACK
            ================================================= */}

            {slide.type ===
              "stack" && (

              <div
                style={{
                  maxWidth:
                    "750px",

                  margin:
                    "10px auto",
                }}
              >

                <div
                  style={{
                    display:
                      "flex",

                    gap:
                      "10px",

                    marginBottom:
                      "18px",
                  }}
                >

                  <button
                    type="button"
                    onClick={
                      pushStack
                    }

                    style={{
                      padding:
                        "10px 16px",

                      border:
                        "none",

                      borderRadius:
                        "8px",

                      background:
                        "#3fa9ff",

                      color:
                        "#fff",

                      fontWeight:
                        700,

                      cursor:
                        "pointer",
                    }}
                  >
                    PUSH
                  </button>


                  <button
                    type="button"
                    onClick={
                      popStack
                    }

                    style={{
                      padding:
                        "10px 16px",

                      border:
                        "none",

                      borderRadius:
                        "8px",

                      background:
                        "rgba(255,255,255,0.08)",

                      color:
                        "#fff",

                      cursor:
                        "pointer",
                    }}
                  >
                    POP
                  </button>


                  <button
                    type="button"
                    onClick={
                      resetStack
                    }

                    style={{
                      padding:
                        "10px 16px",

                      border:
                        "none",

                      borderRadius:
                        "8px",

                      background:
                        "rgba(255,255,255,0.08)",

                      color:
                        "#fff",

                      cursor:
                        "pointer",
                    }}
                  >
                    RESET
                  </button>

                </div>


                <div
                  style={{
                    display:
                      "flex",

                    flexDirection:
                      "column",

                    alignItems:
                      "center",

                    gap:
                      "5px",
                  }}
                >

                  <div
                    style={{
                      fontSize:
                        "10px",

                      opacity:
                        0.45,

                      marginBottom:
                        "5px",
                    }}
                  >
                    TOP
                  </div>

                  {[
                    ...stackItems,
                  ]
                    .reverse()
                    .map(
                      (
                        item,
                        index
                      ) => (

                        <div
                          key={
                            `${item}-${index}`
                          }

                          style={{
                            width:
                              "300px",

                            padding:
                              "13px",

                            textAlign:
                              "center",

                            borderRadius:
                              "8px",

                            background:
                              index === 0
                                ? "rgba(103,187,255,0.16)"
                                : "rgba(255,255,255,0.05)",

                            border:
                              "1px solid rgba(255,255,255,0.09)",

                            fontSize:
                              "12px",
                          }}
                        >
                          {item}
                        </div>

                      )
                    )}

                </div>


                <div
                  style={{
                    marginTop:
                      "20px",

                    textAlign:
                      "center",

                    opacity:
                      0.6,

                    fontSize:
                      "12px",
                  }}
                >
                  LIFO — Last In, First Out
                </div>

              </div>
            )}


            {/* =================================================
                PRESENTATION
            ================================================= */}

            {slide.type ===
              "presentation" && (

              <div
                style={{
                  maxWidth:
                    "850px",

                  margin:
                    "5px auto",
                }}
              >

                <div
                  style={{
                    padding:
                      "20px",

                    borderRadius:
                      "12px",

                    background:
                      "rgba(103,187,255,0.08)",

                    border:
                      "1px solid rgba(103,187,255,0.18)",

                    marginBottom:
                      "18px",
                  }}
                >

                  <div
                    style={{
                      fontSize:
                        "10px",

                      letterSpacing:
                        "0.12em",

                      color:
                        "#6bbcff",

                      fontWeight:
                        800,

                      marginBottom:
                        "10px",
                    }}
                  >
                    SAY THIS FIRST
                  </div>

                  <div
                    style={{
                      fontSize:
                        "16px",

                      lineHeight:
                        1.7,

                      fontWeight:
                        700,
                    }}
                  >
                    "Instead of implementing DSA
                    separately from our project,
                    we used it to solve actual
                    problems inside the cooking
                    engine."
                  </div>

                </div>


                <div
                  style={{
                    display:
                      "grid",

                    gridTemplateColumns:
                      "1fr 1fr",

                    gap:
                      "12px",
                  }}
                >

                  {[
                    [
                      "1",
                      "Show the Queue",
                      "Explain FIFO and demonstrate peek() and dequeue().",
                    ],

                    [
                      "2",
                      "Run the Simulation",
                      "Click PROCESS NEXT and let the teacher watch the queue shrink.",
                    ],

                    [
                      "3",
                      "Show the Set",
                      "Explain how completed cooking actions are tracked without duplicates.",
                    ],

                    [
                      "4",
                      "Connect It To Gameplay",
                      "Explain that the data structure determines what the player can do next.",
                    ],

                  ].map(
                    (
                      item
                    ) => (

                      <div
                        key={
                          item[0]
                        }

                        style={{
                          padding:
                            "16px",

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
                              "10px",

                            color:
                              "#6bbcff",

                            fontWeight:
                              800,

                            marginBottom:
                              "7px",
                          }}
                        >
                          STEP{" "}
                          {item[0]}
                        </div>

                        <div
                          style={{
                            fontWeight:
                              800,

                            marginBottom:
                              "5px",
                          }}
                        >
                          {item[1]}
                        </div>

                        <div
                          style={{
                            fontSize:
                              "11px",

                            lineHeight:
                              1.6,

                            opacity:
                              0.55,
                          }}
                        >
                          {item[2]}
                        </div>

                      </div>

                    )
                  )}

                </div>


                <div
                  style={{
                    marginTop:
                      "18px",

                    padding:
                      "15px",

                    borderRadius:
                      "10px",

                    background:
                      "rgba(255,255,255,0.035)",

                    fontSize:
                      "12px",

                    lineHeight:
                      1.7,

                    opacity:
                      0.65,
                  }}
                >
                  <strong
                    style={{
                      color:
                        "#fff",
                    }}
                  >
                    The killer line:
                  </strong>

                  <br />

                  "The data structure isn't just
                  displayed in our project — it
                  controls the workflow."
                </div>

              </div>
            )}

          </div>


          {/* =================================================
              NAVIGATION
          ================================================= */}

          <div
            style={{
              height:
                "62px",

              flexShrink: 0,

              display:
                "flex",

              alignItems:
                "center",

              justifyContent:
                "space-between",

              padding:
                "0 25px",

              borderTop:
                "1px solid rgba(255,255,255,0.08)",

              background:
                "rgba(0,0,0,0.16)",
            }}
          >

            <button
              type="button"

              onClick={
                goPrevious
              }

              disabled={
                currentSlide === 0
              }

              style={{
                padding:
                  "9px 16px",

                border:
                  "1px solid rgba(255,255,255,0.1)",

                borderRadius:
                  "8px",

                background:
                  "rgba(255,255,255,0.05)",

                color:
                  "#fff",

                opacity:
                  currentSlide === 0
                    ? 0.3
                    : 1,

                cursor:
                  "pointer",
              }}
            >
              ← PREVIOUS
            </button>


            <div
              style={{
                display:
                  "flex",

                gap:
                  "5px",
              }}
            >

              {slides.map(
                (
                  _,
                  index
                ) => (

                  <button
                    key={
                      index
                    }

                    type="button"

                    onClick={() =>
                      setCurrentSlide(
                        index
                      )
                    }

                    aria-label={`Go to slide ${index + 1}`}

                    style={{
                      width:
                        index ===
                        currentSlide
                          ? "22px"
                          : "6px",

                      height:
                        "6px",

                      padding: 0,

                      border:
                        "none",

                      borderRadius:
                        "999px",

                      background:
                        index ===
                        currentSlide
                          ? "#3fa9ff"
                          : "rgba(255,255,255,0.2)",

                      cursor:
                        "pointer",

                      transition:
                        "all 150ms ease",
                    }}
                  />

                )
              )}

            </div>


            <button
              type="button"

              onClick={
                goNext
              }

              disabled={
                currentSlide ===
                slides.length - 1
              }

              style={{
                padding:
                  "9px 16px",

                border:
                  "none",

                borderRadius:
                  "8px",

                background:
                  "#3fa9ff",

                color:
                  "#fff",

                opacity:
                  currentSlide ===
                  slides.length - 1
                    ? 0.3
                    : 1,

                cursor:
                  "pointer",

                fontWeight:
                  700,
              }}
            >
              NEXT →
            </button>

          </div>

        </main>

      </div>

    </div>
  );
}