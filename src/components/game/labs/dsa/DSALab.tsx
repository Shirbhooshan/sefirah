"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import type {
  CSSProperties,
  MouseEvent as ReactMouseEvent,
} from "react";

import oilIcon from "@/assets/media/mise-en-place/icons/cooking-oil.png";
import riceIcon from "@/assets/media/mise-en-place/icons/rice.png";
import garlicIcon from "@/assets/media/mise-en-place/icons/onion.png";
import carrotIcon from "@/assets/media/mise-en-place/icons/carrot.png";
import eggIcon from "@/assets/media/mise-en-place/icons/egg.png";
import soyIcon from "@/assets/media/mise-en-place/icons/soy-sauce.png";
import greenOnionIcon from "@/assets/media/mise-en-place/icons/green-onion.png";

/*
 * =========================================================
 * SEFIRAH — DATA STRUCTURES LAB
 * =========================================================
 *
 * Two areas only:
 *
 * EXPLANATIONS
 *   - What is DSA?
 *   - Queue
 *   - Sorting
 *   - Trees
 *   - HashMap
 *   - Stack
 *
 * IMPLEMENTATION
 *   - Cooking Game
 *   - Notes App
 *
 * The goal is not to reproduce a textbook.
 * The goal is to show:
 *
 *     concept
 *        ↓
 *     simple example
 *        ↓
 *     visualization
 *        ↓
 *     code
 *        ↓
 *     why it matters
 *        ↓
 *     where SEFIRAH uses it
 *
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
  | "intro"
  | "queue"
  | "sorting"
  | "trees"
  | "hashmap"
  | "stack"
  | "cooking"
  | "notes";

type Group =
  | "explanations"
  | "implementation";

type Ingredient =
  | "oil"
  | "garlic"
  | "carrot"
  | "rice"
  | "egg"
  | "soy"
  | "greenOnion";

interface RecipeStep {
  id: number;
  name: string;
  shortName: string;
  ingredient: Ingredient | null;
  code: string;
}

interface SortItem {
  value: number;
  id: number;
}

/*
 * =========================================================
 * RECIPE DATA
 * =========================================================
 */

const recipeSteps: RecipeStep[] = [
  {
    id: 1,
    name: "Cooking Oil",
    shortName: "OIL",
    ingredient: "oil",
    code: 'queue.enqueue("cooking_oil");',
  },
  {
    id: 2,
    name: "Cut Garlic",
    shortName: "GARLIC",
    ingredient: "garlic",
    code: 'queue.enqueue("cut_garlic");',
  },
  {
    id: 3,
    name: "Cut Carrot",
    shortName: "CARROT",
    ingredient: "carrot",
    code: 'queue.enqueue("cut_carrot");',
  },
  {
    id: 4,
    name: "Cold Rice",
    shortName: "RICE",
    ingredient: "rice",
    code: 'queue.enqueue("rice");',
  },
  {
    id: 5,
    name: "Egg",
    shortName: "EGG",
    ingredient: "egg",
    code: 'queue.enqueue("egg");',
  },
  {
    id: 6,
    name: "Soy Sauce",
    shortName: "SOY",
    ingredient: "soy",
    code: 'queue.enqueue("soy_sauce");',
  },
  {
    id: 7,
    name: "Green Onion",
    shortName: "ONION",
    ingredient: "greenOnion",
    code: 'queue.enqueue("cut_green_onion");',
  },
  {
    id: 8,
    name: "Stir",
    shortName: "STIR",
    ingredient: null,
    code: 'queue.enqueue("stir");',
  },
];

const ingredientImages: Record<
  Ingredient,
  string
> = {
  oil: oilIcon.src,
  rice: riceIcon.src,
  garlic: garlicIcon.src,
  carrot: carrotIcon.src,
  egg: eggIcon.src,
  soy: soyIcon.src,
  greenOnion: greenOnionIcon.src,
};

/*
 * =========================================================
 * NAVIGATION
 * =========================================================
 */

const explanationSections: {
  id: Section;
  label: string;
  description: string;
}[] = [
    {
      id: "intro",
      label: "What is DSA?",
      description:
        "Why data structures and algorithms matter.",
    },
    {
      id: "queue",
      label: "Queue",
      description:
        "FIFO ordering and the recipe system.",
    },
    {
      id: "sorting",
      label: "Sorting",
      description:
        "How algorithms arrange data.",
    },
    {
      id: "trees",
      label: "Trees",
      description:
        "Hierarchical data and searching.",
    },
    {
      id: "hashmap",
      label: "HashMap",
      description:
        "Fast key → value lookup.",
    },
    {
      id: "stack",
      label: "Stack",
      description:
        "LIFO and undo/redo.",
    },
  ];

const implementationSections: {
  id: Section;
  label: string;
  description: string;
}[] = [
    {
      id: "cooking",
      label: "Cooking Game",
      description:
        "Queue-driven recipe execution.",
    },
    {
      id: "notes",
      label: "Notes App",
      description:
        "Stack-based undo and redo.",
    },
  ];

/*
 * =========================================================
 * SMALL COMPONENTS
 * =========================================================
 */

function CodeBlock({
  code,
  activeLine,
}: {
  code: string;
  activeLine?: number;
}) {
  const lines = code.split("\n");

  return (
    <div
      style={{
        background: "#101412",
        border: "1px solid #25352c",
        borderRadius: "4px",
        overflow: "hidden",
        fontFamily:
          "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
        fontSize: "12px",
      }}
    >
      {lines.map((line, index) => {
        const lineNumber = index + 1;
        const active =
          activeLine === lineNumber;

        return (
          <div
            key={lineNumber}
            style={{
              display: "grid",
              gridTemplateColumns:
                "42px 1fr",
              minHeight: "27px",
              background: active
                ? "rgba(47, 155, 90, 0.22)"
                : "transparent",
              borderLeft: active
                ? "3px solid #2f9e44"
                : "3px solid transparent",
            }}
          >
            <div
              style={{
                padding:
                  "6px 10px",
                color: active
                  ? "#74d99a"
                  : "#536158",
                textAlign: "right",
                userSelect: "none",
              }}
            >
              {lineNumber}
            </div>

            <div
              style={{
                padding:
                  "6px 12px",
                color: "#d9e5dc",
                whiteSpace:
                  "pre-wrap",
              }}
            >
              {line || " "}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function InfoBox({
  title,
  children,
  accent = "#2f9e44",
}: {
  title: string;
  children: React.ReactNode;
  accent?: string;
}) {
  return (
    <div
      style={{
        border:
          "1px solid #dce5df",
        borderLeft:
          `4px solid ${accent}`,
        background: "#ffffff",
        padding: "16px 18px",
        marginTop: "18px",
      }}
    >
      <div
        style={{
          fontWeight: 800,
          fontSize: "14px",
          color: "#17221b",
          marginBottom: "7px",
        }}
      >
        {title}
      </div>

      <div
        style={{
          color: "#536158",
          fontSize: "13px",
          lineHeight: 1.75,
        }}
      >
        {children}
      </div>
    </div>
  );
}

function SectionTitle({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div
      style={{
        marginBottom: "24px",
      }}
    >
      <div
        style={{
          color: "#238b45",
          fontSize: "11px",
          fontWeight: 800,
          letterSpacing:
            "0.12em",
          textTransform:
            "uppercase",
          marginBottom: "8px",
        }}
      >
        {eyebrow}
      </div>

      <h1
        style={{
          margin: 0,
          fontSize: "28px",
          lineHeight: 1.2,
          color: "#17221b",
          fontWeight: 800,
          letterSpacing:
            "-0.025em",
        }}
      >
        {title}
      </h1>

      <p
        style={{
          margin:
            "9px 0 0",
          color: "#66736a",
          fontSize: "14px",
          lineHeight: 1.7,
          maxWidth: "760px",
        }}
      >
        {description}
      </p>
    </div>
  );
}

function MiniBadge({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding:
          "4px 8px",
        background: "#e8f5ec",
        color: "#217a3c",
        border:
          "1px solid #c8e5d0",
        borderRadius: "3px",
        fontSize: "10px",
        fontWeight: 800,
        letterSpacing:
          "0.05em",
      }}
    >
      {children}
    </span>
  );
}

/*
 * =========================================================
 * QUEUE VISUALIZER
 * =========================================================
 */

function QueueVisualizer({
  activeIndex,
  setActiveIndex,
}: {
  activeIndex: number;
  setActiveIndex: React.Dispatch<
    React.SetStateAction<number>
  >;
}) {
  const current =
    recipeSteps[activeIndex];

  return (
    <div
      style={{
        border:
          "1px solid #dce5df",
        background: "#fff",
      }}
    >
      <div
        style={{
          padding:
            "12px 15px",
          borderBottom:
            "1px solid #e1e7e3",
          display: "flex",
          alignItems: "center",
          justifyContent:
            "space-between",
        }}
      >
        <div
          style={{
            fontWeight: 800,
            color: "#1d2921",
            fontSize: "13px",
          }}
        >
          Interactive Queue
        </div>

        <MiniBadge>
          FIFO
        </MiniBadge>
      </div>

      <div
        style={{
          padding: "20px",
          overflowX: "auto",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "stretch",
            gap: "8px",
            minWidth:
              "680px",
          }}
        >
          {recipeSteps.map(
            (step, index) => {
              const isFront =
                index ===
                activeIndex;

              const completed =
                index <
                activeIndex;

              return (
                <div
                  key={step.id}
                  style={{
                    flex:
                      "0 0 78px",
                    minHeight:
                      "94px",
                    border:
                      isFront
                        ? "2px solid #2f9e44"
                        : "1px solid #d5ded8",
                    background:
                      isFront
                        ? "#eef9f1"
                        : completed
                          ? "#f4f7f5"
                          : "#fff",
                    position:
                      "relative",
                    display: "flex",
                    flexDirection:
                      "column",
                    alignItems:
                      "center",
                    justifyContent:
                      "center",
                    transition:
                      "all 180ms ease",
                  }}
                >
                  {isFront && (
                    <div
                      style={{
                        position:
                          "absolute",
                        top: "-22px",
                        fontSize:
                          "9px",
                        fontWeight:
                          800,
                        color:
                          "#2f9e44",
                        letterSpacing:
                          "0.08em",
                      }}
                    >
                      FRONT
                    </div>
                  )}

                  <div
                    style={{
                      width: "42px",
                      height: "42px",
                      display:
                        "flex",
                      alignItems:
                        "center",
                      justifyContent:
                        "center",
                      marginBottom:
                        "5px",
                    }}
                  >
                    {step.ingredient ? (
                      <img
                        src={
                          ingredientImages[
                          step.ingredient
                          ]
                        }
                        alt=""
                        style={{
                          width:
                            "38px",
                          height:
                            "38px",
                          objectFit:
                            "contain",
                        }}
                      />
                    ) : (
                      <span
                        style={{
                          fontSize:
                            "25px",
                        }}
                      >
                        🥄
                      </span>
                    )}
                  </div>

                  <div
                    style={{
                      fontSize:
                        "9px",
                      fontWeight:
                        800,
                      color:
                        completed
                          ? "#8a958e"
                          : "#27342b",
                      textAlign:
                        "center",
                    }}
                  >
                    {step.shortName}
                  </div>

                  <div
                    style={{
                      fontSize:
                        "8px",
                      color:
                        "#89958d",
                      marginTop:
                        "3px",
                    }}
                  >
                    #{step.id}
                  </div>
                </div>
              );
            }
          )}
        </div>

        <div
          style={{
            marginTop: "22px",
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <button
            onClick={() =>
              setActiveIndex(
                (value) =>
                  Math.max(
                    0,
                    value - 1
                  )
              )
            }
            style={{
              padding:
                "8px 12px",
              border:
                "1px solid #cfd9d3",
              background:
                "#fff",
              cursor:
                "pointer",
              fontFamily:
                "Inter, sans-serif",
              fontWeight: 700,
              color: "#304037",
            }}
          >
            ← Previous
          </button>

          <button
            onClick={() =>
              setActiveIndex(
                (value) =>
                  Math.min(
                    recipeSteps.length -
                    1,
                    value + 1
                  )
              )
            }
            style={{
              padding:
                "8px 12px",
              border:
                "1px solid #238b45",
              background:
                "#238b45",
              cursor:
                "pointer",
              fontFamily:
                "Inter, sans-serif",
              fontWeight: 700,
              color: "#fff",
            }}
          >
            Next →
          </button>

          <div
            style={{
              marginLeft:
                "auto",
              fontSize:
                "11px",
              color:
                "#68756d",
            }}
          >
            queue.peek() →{" "}
            <strong
              style={{
                color:
                  "#238b45",
              }}
            >
              {current.shortName}
            </strong>
          </div>
        </div>
      </div>
    </div>
  );
}

/*
 * =========================================================
 * SORTING VISUALIZER
 * =========================================================
 */

function SortingVisualizer() {
  const initial = [
    42, 17, 65, 8, 31,
    54, 23, 71,
  ];

  const [
    items,
    setItems,
  ] = useState<SortItem[]>(
    initial.map(
      (value, id) => ({
        value,
        id,
      })
    )
  );

  const [
    comparison,
    setComparison,
  ] = useState<
    [number, number] | null
  >(null);

  const [
    sorted,
    setSorted,
  ] = useState(false);

  const [
    running,
    setRunning,
  ] = useState(false);

  const reset = () => {
    setItems(
      initial.map(
        (value, id) => ({
          value,
          id,
        })
      )
    );

    setComparison(null);
    setSorted(false);
    setRunning(false);
  };

  const runBubbleSort =
    async () => {
      if (running) return;

      setRunning(true);
      setSorted(false);

      const array =
        items.map(
          (item) => ({
            ...item,
          })
        );

      for (
        let i = 0;
        i < array.length;
        i++
      ) {
        for (
          let j = 0;
          j <
          array.length -
          i -
          1;
          j++
        ) {
          setComparison([
            j,
            j + 1,
          ]);

          await new Promise(
            (resolve) =>
              setTimeout(
                resolve,
                380
              )
          );

          if (
            array[j].value >
            array[j + 1].value
          ) {
            const temp =
              array[j];

            array[j] =
              array[j + 1];

            array[j + 1] =
              temp;

            setItems([
              ...array,
            ]);
          }
        }
      }

      setComparison(null);
      setSorted(true);
      setRunning(false);
    };

  const max =
    Math.max(
      ...items.map(
        (item) => item.value
      )
    );

  return (
    <div
      style={{
        border:
          "1px solid #dce5df",
        background: "#fff",
      }}
    >
      <div
        style={{
          padding:
            "12px 15px",
          borderBottom:
            "1px solid #e1e7e3",
          display: "flex",
          justifyContent:
            "space-between",
          alignItems: "center",
        }}
      >
        <div
          style={{
            fontWeight: 800,
            fontSize: "13px",
            color: "#1d2921",
          }}
        >
          Bubble Sort Visualizer
        </div>

        <div
          style={{
            display: "flex",
            gap: "7px",
          }}
        >
          <button
            onClick={reset}
            style={{
              padding:
                "6px 10px",
              border:
                "1px solid #ccd8d0",
              background:
                "#fff",
              cursor:
                "pointer",
              fontFamily:
                "Inter, sans-serif",
              fontSize:
                "11px",
              fontWeight:
                700,
            }}
          >
            RESET
          </button>

          <button
            onClick={runBubbleSort}
            disabled={running}
            style={{
              padding:
                "6px 10px",
              border:
                "1px solid #238b45",
              background:
                running
                  ? "#a5cdb0"
                  : "#238b45",
              color: "#fff",
              cursor:
                running
                  ? "default"
                  : "pointer",
              fontFamily:
                "Inter, sans-serif",
              fontSize:
                "11px",
              fontWeight:
                800,
            }}
          >
            {running
              ? "RUNNING..."
              : "RUN SORT"}
          </button>
        </div>
      </div>

      <div
        style={{
          padding:
            "24px 20px 18px",
        }}
      >
        <div
          style={{
            height:
              "210px",
            display:
              "flex",
            alignItems:
              "flex-end",
            justifyContent:
              "center",
            gap:
              "12px",
            borderBottom:
              "1px solid #ccd7d0",
          }}
        >
          {items.map(
            (item, index) => {
              const active =
                comparison?.includes(
                  index
                );

              return (
                <div
                  key={item.id}
                  style={{
                    width:
                      "48px",
                    height:
                      `${Math.max(
                        28,
                        (item.value /
                          max) *
                        170
                      )}px`,
                    background:
                      active
                        ? "#f59f00"
                        : sorted
                          ? "#2f9e44"
                          : "#3b8f57",
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
                    fontSize:
                      "12px",
                    transition:
                      "height 180ms ease, background 180ms ease",
                    position:
                      "relative",
                  }}
                >
                  {item.value}

                  {active && (
                    <span
                      style={{
                        position:
                          "absolute",
                        top:
                          "-19px",
                        fontSize:
                          "9px",
                        color:
                          "#c46b00",
                        fontWeight:
                          800,
                      }}
                    >
                      COMPARE
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
              "16px",
            display:
              "grid",
            gridTemplateColumns:
              "1fr 1fr 1fr",
            gap: "10px",
          }}
        >
          <div>
            <div
              style={{
                color:
                  "#77847b",
                fontSize:
                  "9px",
                fontWeight:
                  800,
                letterSpacing:
                  "0.07em",
              }}
            >
              CURRENT STEP
            </div>

            <div
              style={{
                marginTop:
                  "4px",
                color:
                  "#243128",
                fontSize:
                  "12px",
              }}
            >
              {comparison
                ? `Compare positions ${comparison[0] + 1} and ${comparison[1] + 1}`
                : sorted
                  ? "Array sorted"
                  : "Press Run Sort"}
            </div>
          </div>

          <div>
            <div
              style={{
                color:
                  "#77847b",
                fontSize:
                  "9px",
                fontWeight:
                  800,
                letterSpacing:
                  "0.07em",
              }}
            >
              IDEA
            </div>

            <div
              style={{
                marginTop:
                  "4px",
                color:
                  "#243128",
                fontSize:
                  "12px",
              }}
            >
              Compare neighbours → swap
              if out of order.
            </div>
          </div>

          <div>
            <div
              style={{
                color:
                  "#77847b",
                fontSize:
                  "9px",
                fontWeight:
                  800,
                letterSpacing:
                  "0.07em",
              }}
            >
              COMPLEXITY
            </div>

            <div
              style={{
                marginTop:
                  "4px",
                color:
                  "#238b45",
                fontFamily:
                  "monospace",
                fontWeight:
                  800,
                fontSize:
                  "12px",
              }}
            >
              O(n²)
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/*
 * =========================================================
 * TREE VISUALIZER
 * =========================================================
 */

function TreeVisualizer() {
  const [
    highlighted,
    setHighlighted,
  ] = useState<number | null>(
    null
  );

  return (
    <div
      style={{
        border:
          "1px solid #dce5df",
        background:
          "#fff",
        padding:
          "20px",
      }}
    >
      <div
        style={{
          fontWeight:
            800,
          color:
            "#1d2921",
          fontSize:
            "13px",
          marginBottom:
            "18px",
        }}
      >
        Binary Search Tree
      </div>

      <div
        style={{
          position:
            "relative",
          height:
            "250px",
          maxWidth:
            "650px",
          margin:
            "0 auto",
        }}
      >
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 650 250"
          style={{
            position:
              "absolute",
            inset: 0,
          }}
        >
          <line
            x1="325"
            y1="45"
            x2="190"
            y2="120"
            stroke="#b8c7bc"
            strokeWidth="2"
          />
          <line
            x1="325"
            y1="45"
            x2="460"
            y2="120"
            stroke="#b8c7bc"
            strokeWidth="2"
          />
          <line
            x1="190"
            y1="120"
            x2="120"
            y2="195"
            stroke="#b8c7bc"
            strokeWidth="2"
          />
          <line
            x1="190"
            y1="120"
            x2="260"
            y2="195"
            stroke="#b8c7bc"
            strokeWidth="2"
          />
          <line
            x1="460"
            y1="120"
            x2="390"
            y2="195"
            stroke="#b8c7bc"
            strokeWidth="2"
          />
          <line
            x1="460"
            y1="120"
            x2="530"
            y2="195"
            stroke="#b8c7bc"
            strokeWidth="2"
          />
        </svg>

        {[
          {
            value: 50,
            x: "50%",
            y: 10,
          },
          {
            value: 25,
            x: "29%",
            y: 85,
          },
          {
            value: 75,
            x: "71%",
            y: 85,
          },
          {
            value: 10,
            x: "18%",
            y: 160,
          },
          {
            value: 35,
            x: "40%",
            y: 160,
          },
          {
            value: 65,
            x: "60%",
            y: 160,
          },
          {
            value: 90,
            x: "82%",
            y: 160,
          },
        ].map(
          (node) => {
            const active =
              highlighted ===
              node.value;

            return (
              <button
                key={
                  node.value
                }
                onClick={() =>
                  setHighlighted(
                    node.value
                  )
                }
                style={{
                  position:
                    "absolute",
                  left:
                    node.x,
                  top:
                    `${node.y}px`,
                  transform:
                    "translateX(-50%)",
                  width:
                    "45px",
                  height:
                    "45px",
                  border:
                    active
                      ? "3px solid #f59f00"
                      : "2px solid #2f9e44",
                  background:
                    active
                      ? "#fff4db"
                      : "#eef9f1",
                  color:
                    "#1e3b27",
                  borderRadius:
                    "50%",
                  fontWeight:
                    800,
                  cursor:
                    "pointer",
                  fontFamily:
                    "Inter, sans-serif",
                  zIndex: 2,
                }}
              >
                {node.value}
              </button>
            );
          }
        )}
      </div>

      <div
        style={{
          padding:
            "12px 14px",
          background:
            "#f4f7f5",
          border:
            "1px solid #dfe7e2",
          fontSize:
            "12px",
          color:
            "#526058",
          lineHeight:
            1.6,
        }}
      >
        Click a node. In a Binary Search Tree, values
        smaller than a node go left and larger values
        go right. That structure lets us eliminate
        large parts of the search space.
      </div>
    </div>
  );
}

/*
 * =========================================================
 * HASHMAP VISUALIZER
 * =========================================================
 */

function HashMapVisualizer() {
  const entries = [
    ["oil", "1"],
    ["rice", "1"],
    ["egg", "1"],
    ["soy_sauce", "∞"],
  ];

  const [
    selected,
    setSelected,
  ] = useState<string | null>(
    null
  );

  return (
    <div
      style={{
        border:
          "1px solid #dce5df",
        background:
          "#fff",
      }}
    >
      <div
        style={{
          padding:
            "12px 15px",
          borderBottom:
            "1px solid #e1e7e3",
          fontWeight:
            800,
          fontSize:
            "13px",
          color:
            "#1d2921",
        }}
      >
        HashMap — ingredient lookup
      </div>

      <div
        style={{
          padding:
            "18px",
          display:
            "grid",
          gridTemplateColumns:
            "repeat(4, 1fr)",
          gap:
            "10px",
        }}
      >
        {entries.map(
          ([key, value]) => (
            <button
              key={key}
              onClick={() =>
                setSelected(
                  key
                )
              }
              style={{
                textAlign:
                  "left",
                border:
                  selected ===
                    key
                    ? "2px solid #2f9e44"
                    : "1px solid #d4dfd8",
                background:
                  selected ===
                    key
                    ? "#eef9f1"
                    : "#fff",
                padding:
                  "12px",
                cursor:
                  "pointer",
                fontFamily:
                  "Inter, sans-serif",
              }}
            >
              <div
                style={{
                  fontSize:
                    "10px",
                  color:
                    "#7b887f",
                  marginBottom:
                    "5px",
                }}
              >
                KEY
              </div>

              <div
                style={{
                  fontFamily:
                    "monospace",
                  fontSize:
                    "11px",
                  color:
                    "#203028",
                  fontWeight:
                    700,
                }}
              >
                {key}
              </div>

              <div
                style={{
                  marginTop:
                    "10px",
                  fontSize:
                    "10px",
                  color:
                    "#7b887f",
                }}
              >
                VALUE
              </div>

              <div
                style={{
                  fontFamily:
                    "monospace",
                  fontSize:
                    "14px",
                  color:
                    "#238b45",
                  fontWeight:
                    800,
                }}
              >
                {value}
              </div>
            </button>
          )
        )}
      </div>

      <div
        style={{
          margin:
            "0 18px 18px",
          padding:
            "12px",
          background:
            "#101412",
          color:
            "#cfe2d5",
          fontFamily:
            "monospace",
          fontSize:
            "11px",
        }}
      >
        {selected
          ? `inventory.get("${selected}") → ${entries.find(
            ([key]) =>
              key ===
              selected
          )?.[1]
          }`
          : "Click a key to perform a lookup."}
      </div>
    </div>
  );
}

/*
 * =========================================================
 * STACK VISUALIZER
 * =========================================================
 */

function StackVisualizer() {
  const [
    stack,
    setStack,
  ] = useState([
    "Typed 'Hello'",
    "Typed 'Hello World'",
    "Deleted 'World'",
  ]);

  const push = () => {
    setStack(
      (previous) => [
        ...previous,
        `Edit #${previous.length + 1}`,
      ]
    );
  };

  const pop = () => {
    setStack(
      (previous) =>
        previous.length > 0
          ? previous.slice(
            0,
            -1
          )
          : previous
    );
  };

  return (
    <div
      style={{
        border:
          "1px solid #dce5df",
        background:
          "#fff",
        padding:
          "18px",
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
            "16px",
        }}
      >
        <div
          style={{
            fontWeight:
              800,
            fontSize:
              "13px",
            color:
              "#1d2921",
          }}
        >
          Stack — LIFO
        </div>

        <div
          style={{
            display:
              "flex",
            gap:
              "7px",
          }}
        >
          <button
            onClick={pop}
            style={{
              padding:
                "7px 10px",
              border:
                "1px solid #ccd8d0",
              background:
                "#fff",
              cursor:
                "pointer",
              fontFamily:
                "Inter, sans-serif",
              fontWeight:
                700,
              fontSize:
                "10px",
            }}
          >
            POP / UNDO
          </button>

          <button
            onClick={push}
            style={{
              padding:
                "7px 10px",
              border:
                "1px solid #238b45",
              background:
                "#238b45",
              color:
                "#fff",
              cursor:
                "pointer",
              fontFamily:
                "Inter, sans-serif",
              fontWeight:
                700,
              fontSize:
                "10px",
            }}
          >
            PUSH / EDIT
          </button>
        </div>
      </div>

      <div
        style={{
          minHeight:
            "235px",
          display:
            "flex",
          alignItems:
            "flex-end",
          justifyContent:
            "center",
        }}
      >
        <div
          style={{
            width:
              "240px",
            minHeight:
              "210px",
            border:
              "3px solid #33463a",
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
            gap:
              "5px",
          }}
        >
          {stack.map(
            (item, index) => (
              <div
                key={`${item}-${index}`}
                style={{
                  minHeight:
                    "35px",
                  display:
                    "flex",
                  alignItems:
                    "center",
                  justifyContent:
                    "center",
                  background:
                    index ===
                      stack.length -
                      1
                      ? "#dff3e5"
                      : "#f2f5f3",
                  border:
                    "1px solid #c6d7cb",
                  color:
                    "#27372d",
                  fontSize:
                    "11px",
                  fontWeight:
                    700,
                }}
              >
                {item}
              </div>
            )
          )}

          {stack.length ===
            0 && (
              <div
                style={{
                  color:
                    "#9aa59e",
                  fontSize:
                    "11px",
                  textAlign:
                    "center",
                  margin:
                    "auto",
                }}
              >
                EMPTY STACK
              </div>
            )}
        </div>
      </div>

      <div
        style={{
          textAlign:
            "center",
          marginTop:
            "12px",
          fontSize:
            "11px",
          color:
            "#647169",
        }}
      >
        The most recent edit is always on top.
        <strong>
          {" "}
          Undo removes that edit first.
        </strong>
      </div>
    </div>
  );
}

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
  const [
    section,
    setSection,
  ] = useState<Section>(
    "intro"
  );

  const [
    activeQueueIndex,
    setActiveQueueIndex,
  ] = useState(0);

  /*
   * Dragging
   */

  const [
    isDragging,
    setIsDragging,
  ] = useState(false);

  const [hasMovedFromCenter, setHasMovedFromCenter] = useState(false);

  const dragOffset =
    useRef({
      x: 0,
      y: 0,
    });

  const WINDOW_WIDTH = 1120;
  const WINDOW_HEIGHT = 760;
  const TITLE_BAR_HEIGHT = 42;

  const handleDragStart = (
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

  useEffect(() => {
    if (!isDragging) {
      return;
    }

    const handleMove = (
      event: MouseEvent
    ) => {
      const actualWidth =
        Math.min(
          WINDOW_WIDTH,
          window.innerWidth -
          20
        );

      const actualHeight =
        Math.min(
          WINDOW_HEIGHT,
          window.innerHeight -
          60
        );

      const left =
        event.clientX -
        dragOffset.current.x;

      const top =
        event.clientY -
        dragOffset.current.y;

      const maxLeft =
        Math.max(
          10,
          window.innerWidth -
          actualWidth -
          10
        );

      const maxTop =
        Math.max(
          TITLE_BAR_HEIGHT,
          window.innerHeight -
          actualHeight -
          10
        );

      onMove?.(
        Math.max(
          10,
          Math.min(
            left,
            maxLeft
          )
        ),
        Math.max(
          TITLE_BAR_HEIGHT,
          Math.min(
            top,
            maxTop
          )
        )
      );
      setHasMovedFromCenter(true);
    };

    const handleUp = () => {
      setIsDragging(false);
    };

    window.addEventListener(
      "mousemove",
      handleMove
    );

    window.addEventListener(
      "mouseup",
      handleUp
    );

    return () => {
      window.removeEventListener(
        "mousemove",
        handleMove
      );

      window.removeEventListener(
        "mouseup",
        handleUp
      );
    };
  }, [
    isDragging,
    onMove,
  ]);

  const allSections =
    useMemo(
      () => [
        ...explanationSections,
        ...implementationSections,
      ],
      []
    );

  const currentIndex =
    allSections.findIndex(
      (item) =>
        item.id === section
    );

  const goPrevious = () => {
    if (currentIndex <= 0) {
      return;
    }

    setSection(
      allSections[
        currentIndex - 1
      ].id
    );
  };

  const goNext = () => {
    if (
      currentIndex >=
      allSections.length - 1
    ) {
      return;
    }

    setSection(
      allSections[
        currentIndex + 1
      ].id
    );
  };

  /*
   * =========================================================
   * PAGE RENDERERS
   * =========================================================
   */

  const renderIntro =
    () => (
      <>
        <SectionTitle
          eyebrow="01 • EXPLANATIONS"
          title="What is DSA?"
          description="Data Structures and Algorithms are the tools we use to organise information and decide how a program should process it."
        />

        <div
          style={{
            display:
              "grid",
            gridTemplateColumns:
              "1.15fr 0.85fr",
            gap:
              "18px",
          }}
        >
          <div
            style={{
              border:
                "1px solid #dce5df",
              background:
                "#fff",
              padding:
                "22px",
            }}
          >
            <h2
              style={{
                margin:
                  "0 0 12px",
                fontSize:
                  "18px",
                color:
                  "#1c2920",
              }}
            >
              Think of DSA as two questions
            </h2>

            <div
              style={{
                display:
                  "grid",
                gap:
                  "12px",
              }}
            >
              <div
                style={{
                  padding:
                    "14px",
                  background:
                    "#f2f8f4",
                  borderLeft:
                    "4px solid #2f9e44",
                }}
              >
                <strong>
                  1. How should the data be stored?
                </strong>

                <div
                  style={{
                    marginTop:
                      "5px",
                    color:
                      "#5c6961",
                    fontSize:
                      "13px",
                    lineHeight:
                      1.6,
                  }}
                >
                  Queue? Stack? Tree? HashMap?
                  Each structure gives us different
                  ways of accessing and modifying data.
                </div>
              </div>

              <div
                style={{
                  padding:
                    "14px",
                  background:
                    "#f2f8f4",
                  borderLeft:
                    "4px solid #2f9e44",
                }}
              >
                <strong>
                  2. What steps should the program take?
                </strong>

                <div
                  style={{
                    marginTop:
                      "5px",
                    color:
                      "#5c6961",
                    fontSize:
                      "13px",
                    lineHeight:
                      1.6,
                  }}
                >
                  That's the algorithm: the sequence
                  of operations that transforms input
                  into the result we want.
                </div>
              </div>
            </div>
          </div>

          <div
            style={{
              border:
                "1px solid #dce5df",
              background:
                "#17221b",
              color:
                "#fff",
              padding:
                "22px",
            }}
          >
            <div
              style={{
                color:
                  "#70d894",
                fontFamily:
                  "monospace",
                fontSize:
                  "11px",
                marginBottom:
                  "15px",
              }}
            >
              PROGRAM
            </div>

            <div
              style={{
                display:
                  "flex",
                flexDirection:
                  "column",
                gap:
                  "9px",
              }}
            >
              {[
                [
                  "DATA",
                  "Queue / Stack / Tree",
                ],
                [
                  "RULES",
                  "Algorithm",
                ],
                [
                  "PROCESS",
                  "Operations",
                ],
                [
                  "RESULT",
                  "Useful behaviour",
                ],
              ].map(
                ([a, b]) => (
                  <div
                    key={a}
                    style={{
                      display:
                        "flex",
                      justifyContent:
                        "space-between",
                      gap:
                        "15px",
                      padding:
                        "10px",
                      background:
                        "rgba(255,255,255,0.06)",
                    }}
                  >
                    <span
                      style={{
                        color:
                          "#8d9b91",
                        fontFamily:
                          "monospace",
                        fontSize:
                          "10px",
                      }}
                    >
                      {a}
                    </span>

                    <span
                      style={{
                        color:
                          "#dbe7de",
                        fontSize:
                          "11px",
                        textAlign:
                          "right",
                      }}
                    >
                      {b}
                    </span>
                  </div>
                )
              )}
            </div>
          </div>
        </div>

        <InfoBox title="Why does this matter in Sefirah?">
          Our applications constantly deal with collections of
          information. The cooking game has an ordered sequence
          of actions. The Notes app needs a history of edits.
          A good data structure makes those behaviours natural
          instead of forcing the program to repeatedly search,
          reorder, or reconstruct information.
        </InfoBox>

        <InfoBox
          title="What if we ignored DSA?"
          accent="#e67700"
        >
          We could still make the application work. The problem
          is that the code would become harder to reason about
          and potentially slower as the amount of data grows.
          More importantly, some behaviours — such as undo/redo
          or strict recipe ordering — map extremely naturally
          onto specific structures.
        </InfoBox>
      </>
    );

  const renderQueue =
    () => (
      <>
        <SectionTitle
          eyebrow="02 • EXPLANATIONS"
          title="Queue"
          description="A queue follows FIFO: First In, First Out. The first item added is the first item processed."
        />

        <div
          style={{
            display:
              "grid",
            gridTemplateColumns:
              "1fr 1fr",
            gap:
              "18px",
          }}
        >
          <div
            style={{
              border:
                "1px solid #dce5df",
              background:
                "#fff",
              padding:
                "20px",
            }}
          >
            <MiniBadge>
              FIFO
            </MiniBadge>

            <h2
              style={{
                fontSize:
                  "18px",
                color:
                  "#1d2921",
                margin:
                  "13px 0 8px",
              }}
            >
              Imagine a line at a counter.
            </h2>

            <p
              style={{
                color:
                  "#59665e",
                fontSize:
                  "13px",
                lineHeight:
                  1.75,
              }}
            >
              People join at the back and the
              person at the front is served first.
              A queue gives software the same
              predictable behaviour.
            </p>

            <div
              style={{
                marginTop:
                  "18px",
                display:
                  "flex",
                alignItems:
                  "center",
                justifyContent:
                  "center",
                gap:
                  "8px",
              }}
            >
              {[
                "A",
                "B",
                "C",
                "D",
              ].map(
                (item, index) => (
                  <div
                    key={item}
                    style={{
                      width:
                        "52px",
                      height:
                        "52px",
                      background:
                        index ===
                          0
                          ? "#e5f5e9"
                          : "#f3f6f4",
                      border:
                        "1px solid #cbd9cf",
                      display:
                        "flex",
                      alignItems:
                        "center",
                      justifyContent:
                        "center",
                      fontWeight:
                        800,
                      color:
                        "#28412f",
                    }}
                  >
                    {item}
                  </div>
                )
              )}
            </div>

            <div
              style={{
                display:
                  "flex",
                justifyContent:
                  "space-between",
                marginTop:
                  "9px",
                fontSize:
                  "9px",
                fontWeight:
                  800,
                color:
                  "#718077",
              }}
            >
              <span>
                FRONT → DEQUEUE
              </span>

              <span>
                ENQUEUE ← REAR
              </span>
            </div>
          </div>

          <div>
            <CodeBlock
              code={`class Queue<T> {
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
}`}
            />
          </div>
        </div>

        <div
          style={{
            marginTop:
              "20px",
          }}
        >
          <QueueVisualizer
            activeIndex={
              activeQueueIndex
            }
            setActiveIndex={
              setActiveQueueIndex
            }
          />
        </div>

        <InfoBox title="Why is Queue useful?">
          A queue is useful whenever order matters. Tasks can
          wait their turn, print jobs can be processed in order,
          network requests can be queued, and — in Sefirah —
          recipe actions can wait for their turn.
        </InfoBox>

        <InfoBox
          title="What would go wrong without it?"
          accent="#e67700"
        >
          Without a clear ordering structure, the game could
          accept ingredients based only on what the player
          happened to drag first. That would make it difficult
          to enforce the recipe's intended sequence.
        </InfoBox>
      </>
    );

  const renderSorting =
    () => (
      <>
        <SectionTitle
          eyebrow="03 • EXPLANATIONS"
          title="Sorting"
          description="Sorting algorithms rearrange data according to a rule. Different algorithms trade simplicity, speed, and memory usage."
        />

        <div
          style={{
            display:
              "grid",
            gridTemplateColumns:
              "1fr 1fr",
            gap:
              "18px",
          }}
        >
          <div
            style={{
              border:
                "1px solid #dce5df",
              background:
                "#fff",
              padding:
                "20px",
            }}
          >
            <h2
              style={{
                margin:
                  "0 0 10px",
                fontSize:
                  "18px",
                color:
                  "#1d2921",
              }}
            >
              The basic idea
            </h2>

            <p
              style={{
                margin:
                  "0 0 14px",
                fontSize:
                  "13px",
                color:
                  "#59665e",
                lineHeight:
                  1.75,
              }}
            >
              Given:
            </p>

            <div
              style={{
                fontFamily:
                  "monospace",
                background:
                  "#f4f7f5",
                padding:
                  "12px",
                color:
                  "#26372c",
              }}
            >
              [42, 17, 65, 8, 31]
            </div>

            <p
              style={{
                margin:
                  "14px 0",
                fontSize:
                  "13px",
                color:
                  "#59665e",
                lineHeight:
                  1.75,
              }}
            >
              We want:
            </p>

            <div
              style={{
                fontFamily:
                  "monospace",
                background:
                  "#e9f6ed",
                padding:
                  "12px",
                color:
                  "#216c37",
                fontWeight:
                  800,
              }}
            >
              [8, 17, 31, 42, 65]
            </div>
          </div>

          <div>
            <CodeBlock
              code={`for (let i = 0; i < n; i++) {
  for (let j = 0; j < n - i - 1; j++) {

    if (array[j] > array[j + 1]) {
      const temp = array[j];
      array[j] = array[j + 1];
      array[j + 1] = temp;
    }

  }
}`}
            />
          </div>
        </div>

        <div
          style={{
            marginTop:
              "20px",
          }}
        >
          <SortingVisualizer />
        </div>

        <InfoBox title="Bubble Sort is not always the best choice">
          Bubble Sort is excellent for understanding the
          fundamental idea of comparisons and swaps, but its
          average and worst-case complexity is O(n²). Algorithms
          such as Quick Sort can reach O(n log n) average-case
          performance and become much more useful for larger
          datasets.
        </InfoBox>

        <InfoBox
          title="Where does sorting fit into Sefirah?"
          accent="#e67700"
        >
          Sorting isn't currently the central structure behind
          the cooking-game recipe flow. That's an important
          distinction: not every DSA concept needs to be forced
          into every feature. Sorting is demonstrated here as
          part of the algorithms we learned and as a technique
          that could be useful when organising larger datasets.
        </InfoBox>
      </>
    );

  const renderTrees =
    () => (
      <>
        <SectionTitle
          eyebrow="04 • EXPLANATIONS"
          title="Trees & Binary Search Trees"
          description="Trees represent hierarchical relationships. A Binary Search Tree adds an ordering rule that can make searching efficient."
        />

        <div
          style={{
            display:
              "grid",
            gridTemplateColumns:
              "0.9fr 1.1fr",
            gap:
              "18px",
          }}
        >
          <div
            style={{
              border:
                "1px solid #dce5df",
              background:
                "#fff",
              padding:
                "20px",
            }}
          >
            <h2
              style={{
                margin:
                  "0 0 10px",
                fontSize:
                  "18px",
                color:
                  "#1d2921",
              }}
            >
              Why use a tree?
            </h2>

            <p
              style={{
                color:
                  "#59665e",
                fontSize:
                  "13px",
                lineHeight:
                  1.75,
              }}
            >
              Some information naturally has levels.
              Think of folders:
            </p>

            <div
              style={{
                marginTop:
                  "15px",
                fontFamily:
                  "monospace",
                fontSize:
                  "12px",
                lineHeight:
                  1.9,
                color:
                  "#33443a",
              }}
            >
              Home
              <br />
              ├── Documents
              <br />
              │   ├── Notes
              <br />
              │   └── Reports
              <br />
              └── Games
              <br />
              &nbsp;&nbsp;&nbsp;&nbsp;└── Sefirah
            </div>
          </div>

          <TreeVisualizer />
        </div>

        <InfoBox title="Binary Search Tree rule">
          For each node, smaller values belong on the left and
          larger values belong on the right. This means a search
          can repeatedly decide which branch is relevant instead
          of checking every value.
        </InfoBox>

        <InfoBox
          title="What if we used a simple list instead?"
          accent="#e67700"
        >
          A list can absolutely store the same values, but a
          search may require checking items one by one. The
          appropriate structure depends on the operation we need
          to perform most often.
        </InfoBox>
      </>
    );

  const renderHashMap =
    () => (
      <>
        <SectionTitle
          eyebrow="05 • EXPLANATIONS"
          title="HashMap"
          description="A HashMap stores values using keys, making direct lookup extremely convenient."
        />

        <div
          style={{
            display:
              "grid",
            gridTemplateColumns:
              "1fr 1fr",
            gap:
              "18px",
          }}
        >
          <div
            style={{
              border:
                "1px solid #dce5df",
              background:
                "#fff",
              padding:
                "20px",
              fontSize:
                "13px",
              color:
                "#59665e",
              lineHeight: 1.75,
            }}
          >
            <h2
              style={{
                margin:
                  "0 0 10px",
                color:
                  "#1d2921",
                fontSize:
                  "18px",
              }}
            >
              Key → Value
            </h2>

            <p>
              Instead of searching through an entire
              collection for an ingredient, we can ask
              for it directly by its key.
            </p>

            <CodeBlock
              code={`const inventory = new Map();

inventory.set("rice", 1);
inventory.set("egg", 1);
inventory.set("soy_sauce", 1);

inventory.get("rice");
// → 1`}
            />
          </div>

          <HashMapVisualizer />
        </div>

        <InfoBox title="Average lookup complexity">
          HashMap lookup is typically O(1) on average. Internally,
          the key is transformed through a hash function into a
          location where the associated value can be found.
        </InfoBox>

        <InfoBox
          title="What can go wrong?"
          accent="#e67700"
        >
          Hash collisions can occur when different keys map to
          the same location. Hash table implementations therefore
          need a collision-handling strategy. This is one reason
          the internal implementation of a HashMap is more
          interesting than simply thinking of it as an object.
        </InfoBox>
      </>
    );

  const renderStack =
    () => (
      <>
        <SectionTitle
          eyebrow="06 • EXPLANATIONS"
          title="Stack"
          description="A stack follows LIFO: Last In, First Out. The newest item is the first one removed."
        />

        <div
          style={{
            display:
              "grid",
            gridTemplateColumns:
              "1fr 1fr",
            gap:
              "18px",
          }}
        >
          <div
            style={{
              border:
                "1px solid #dce5df",
              background:
                "#fff",
              padding:
                "20px",
              fontSize:
                "13px",
              color: "#59665e",
              lineHeight: 1.75,
            }}
          >
            <h2
              style={{
                margin:
                  "0 0 10px",
                color:
                  "#1d2921",
                fontSize:
                  "18px",
              }}
            >
              Think of a stack of plates.
            </h2>

            <p>
              The last plate placed on the stack is
              the first plate you can remove.
            </p>

            <CodeBlock
              code={`stack.push(edit);

const lastEdit =
  stack.pop();`}
            />

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
              <MiniBadge>
                PUSH → ADD
              </MiniBadge>

              <MiniBadge>
                POP → REMOVE LAST
              </MiniBadge>
            </div>
          </div>

          <StackVisualizer />
        </div>

        <InfoBox title="Why Stack is perfect for Undo">
          When a user makes edits A, B, C, the most recent edit C
          is the first edit that should be undone. A stack gives
          us exactly that behaviour: push every new edit, then
          pop the most recent edit when Undo is pressed.
        </InfoBox>
      </>
    );

  const renderCooking =
    () => {
      const activeStep =
        recipeSteps[
        activeQueueIndex
        ];

      return (
        <>
          <SectionTitle
            eyebrow="07 • IMPLEMENTATION"
            title="DSA inside the Cooking Game"
            description="This is where the theory becomes actual Sefirah behaviour. The recipe is represented as an ordered queue of actions."
          />

          <div
            style={{
              display:
                "grid",
              gridTemplateColumns:
                "1fr 1fr",
              gap:
                "18px",
            }}
          >
            <div
              style={{
                border:
                  "1px solid #dce5df",
                background:
                  "#fff",
                padding:
                  "20px",
              }}
            >
              <MiniBadge>
                REAL PROJECT LOGIC
              </MiniBadge>

              <h2
                style={{
                  margin:
                    "13px 0 9px",
                  color:
                    "#1d2921",
                  fontSize:
                    "18px",
                }}
              >
                The recipe is a queue.
              </h2>

              <p
                style={{
                  color:
                    "#59665e",
                  fontSize:
                    "13px",
                  lineHeight:
                    1.75,
                }}
              >
                The cooking game does not simply say
                "the player can add any ingredient at any
                time." It has a required sequence.
              </p>

              <div
                style={{
                  marginTop:
                    "15px",
                  padding:
                    "14px",
                  background:
                    "#f4f8f5",
                  border:
                    "1px solid #d9e6dd",
                }}
              >
                <div
                  style={{
                    fontSize:
                      "9px",
                    color:
                      "#728077",
                    fontWeight:
                      800,
                    letterSpacing:
                      "0.08em",
                  }}
                >
                  CURRENT REQUIRED ACTION
                </div>

                <div
                  style={{
                    marginTop:
                      "6px",
                    color:
                      "#238b45",
                    fontSize:
                      "20px",
                    fontWeight:
                      800,
                  }}
                >
                  {activeStep.name}
                </div>
              </div>

              <div
                style={{
                  marginTop:
                    "15px",
                  display:
                    "flex",
                  alignItems:
                    "center",
                  gap:
                    "12px",
                }}
              >
                {activeStep.ingredient ? (
                  <img
                    src={
                      ingredientImages[
                      activeStep
                        .ingredient
                      ]
                    }
                    alt={
                      activeStep.name
                    }
                    style={{
                      width:
                        "72px",
                      height:
                        "72px",
                      objectFit:
                        "contain",
                      border:
                        "1px solid #dbe4de",
                      background:
                        "#fff",
                    }}
                  />
                ) : (
                  <div
                    style={{
                      width:
                        "72px",
                      height:
                        "72px",
                      display:
                        "flex",
                      alignItems:
                        "center",
                      justifyContent:
                        "center",
                      background:
                        "#f1f5f2",
                      fontSize:
                        "35px",
                    }}
                  >
                    🥄
                  </div>
                )}

                <div
                  style={{
                    color:
                      "#69766e",
                    fontSize:
                      "12px",
                    lineHeight:
                      1.6,
                  }}
                >
                  The player must provide the
                  expected ingredient/action before
                  the queue advances.
                </div>
              </div>
            </div>

            <div>
              <div
                style={{
                  marginBottom:
                    "9px",
                  fontSize:
                    "10px",
                  fontWeight:
                    800,
                  color:
                    "#647169",
                  letterSpacing:
                    "0.08em",
                }}
              >
                THE ACTUAL IDEA
              </div>

              <CodeBlock
                code={`const recipe: CookingAction[] = [
  "cooking_oil",
  "cut_garlic",
  "cut_carrot",
  "rice",
  "egg",
  "soy_sauce",
  "cut_green_onion",
  "stir",
];

const nextAction =
  recipeQueue.peek();

if (nextAction !== action) {
  return;
}

completeAction(action);`}
              />
            </div>
          </div>

          <div
            style={{
              marginTop:
                "20px",
            }}
          >
            <QueueVisualizer
              activeIndex={
                activeQueueIndex
              }
              setActiveIndex={
                setActiveQueueIndex
              }
            />
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
                "18px",
            }}
          >
            <div
              style={{
                border:
                  "1px solid #dce5df",
                background:
                  "#fff",
                padding:
                  "20px",
              }}
            >
              <div
                style={{
                  color:
                    "#238b45",
                  fontWeight:
                    800,
                  fontSize:
                    "11px",
                  letterSpacing:
                    "0.08em",
                  marginBottom:
                    "12px",
                }}
              >
                WHAT HAPPENS BEHIND THE SCENES?
              </div>

              {[
                [
                  "1",
                  "Player drags ingredient",
                ],
                [
                  "2",
                  "Game reads queue.peek()",
                ],
                [
                  "3",
                  "Ingredient is compared with required action",
                ],
                [
                  "4",
                  "Correct action is consumed",
                ],
                [
                  "5",
                  "Queue moves to the next action",
                ],
                [
                  "6",
                  "UI updates to the next cooking stage",
                ],
              ].map(
                ([number, text]) => (
                  <div
                    key={number}
                    style={{
                      display:
                        "flex",
                      gap:
                        "10px",
                      marginBottom:
                        "10px",
                      alignItems:
                        "flex-start",
                    }}
                  >
                    <div
                      style={{
                        flex:
                          "0 0 22px",
                        height:
                          "22px",
                        background:
                          "#e6f4ea",
                        color:
                          "#238b45",
                        display:
                          "flex",
                        alignItems:
                          "center",
                        justifyContent:
                          "center",
                        fontWeight:
                          800,
                        fontSize:
                          "10px",
                      }}
                    >
                      {number}
                    </div>

                    <div
                      style={{
                        color:
                          "#526058",
                        fontSize:
                          "12px",
                        lineHeight:
                          1.5,
                      }}
                    >
                      {text}
                    </div>
                  </div>
                )
              )}
            </div>

            <div
              style={{
                border:
                  "1px solid #dce5df",
                background:
                  "#fff",
                padding:
                  "20px",
              }}
            >
              <div
                style={{
                  color:
                    "#c56d00",
                  fontWeight:
                    800,
                  fontSize:
                    "11px",
                  letterSpacing:
                    "0.08em",
                  marginBottom:
                    "12px",
                }}
              >
                WHAT IF THERE WAS NO QUEUE?
              </div>

              <div
                style={{
                  color:
                    "#59665e",
                  fontSize:
                    "12px",
                  lineHeight:
                    1.75,
                }}
              >
                <p
                  style={{
                    margin:
                      "0 0 10px",
                  }}
                >
                  The game would need another mechanism
                  to determine what the player is allowed
                  to do next.
                </p>

                <p
                  style={{
                    margin:
                      "0 0 10px",
                  }}
                >
                  A large collection of boolean conditions
                  such as:
                </p>

                <CodeBlock
                  code={`if (!oilAdded) ...
else if (!garlicAdded) ...
else if (!carrotAdded) ...
else if (!riceAdded) ...
else if (!eggAdded) ...`}
                />

                <p
                  style={{
                    margin:
                      "12px 0 0",
                  }}
                >
                  could eventually describe the same
                  sequence, but the queue makes the
                  ordering explicit and much easier to
                  reason about.
                </p>
              </div>
            </div>
          </div>

          <InfoBox title="Why this is a genuine DSA implementation">
            The queue is not just displayed for the presentation.
            It directly represents the sequence of actions the
            cooking game must process. <code>peek()</code> determines
            what action is currently allowed, while advancing the
            queue represents progress through the recipe.
          </InfoBox>

          <InfoBox
            title="One important implementation detail"
            accent="#e67700"
          >
            Our current JavaScript implementation uses an array
            underneath the queue. That makes the concept easy to
            understand, although operations such as
            <code>shift()</code> can have O(n) cost because the
            remaining elements may need to be moved. For our
            small recipe this is completely reasonable.
          </InfoBox>
        </>
      );
    };

  const renderNotes =
    () => (
      <>
        <SectionTitle
          eyebrow="08 • IMPLEMENTATION"
          title="DSA inside the Notes App"
          description="Undo and redo are a natural application of stacks because edits need to be reversed in the opposite order from which they were made."
        />

        <div
          style={{
            display:
              "grid",
            gridTemplateColumns:
              "1fr 1fr",
            gap:
              "18px",
          }}
        >
          <div
            style={{
              border:
                "1px solid #dce5df",
              background:
                "#fff",
              padding:
                "20px",
            }}
          >
            <MiniBadge>
              STACK
            </MiniBadge>

            <h2
              style={{
                margin:
                  "13px 0 8px",
                fontSize:
                  "18px",
                color:
                  "#1d2921",
              }}
            >
              Undo = POP
            </h2>

            <p
              style={{
                color:
                  "#59665e",
                fontSize:
                  "13px",
                lineHeight:
                  1.75,
              }}
            >
              Every time the user makes a change, that
              operation can be added to an undo stack.
              Pressing Undo removes the most recent
              operation.
            </p>

            <CodeBlock
              code={`undoStack.push(currentState);

function undo() {
  const previous =
    undoStack.pop();

  redoStack.push(currentState);
  restore(previous);
}`}
            />
          </div>

          <StackVisualizer />
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
              "18px",
          }}
        >
          <div
            style={{
              border:
                "1px solid #dce5df",
              background:
                "#fff",
              padding:
                "20px",
            }}
          >
            <div
              style={{
                color:
                  "#238b45",
                fontSize:
                  "10px",
                fontWeight:
                  800,
                letterSpacing:
                  "0.08em",
                marginBottom:
                  "12px",
              }}
            >
              UNDO FLOW
            </div>

            <div
              style={{
                fontFamily:
                  "monospace",
                fontSize:
                  "11px",
                color:
                  "#34443a",
                lineHeight:
                  2,
              }}
            >
              Edit A
              <br />
              ↓
              <br />
              Edit B
              <br />
              ↓
              <br />
              Edit C
              <br />
              ↓
              <strong
                style={{
                  color:
                    "#238b45",
                }}
              >
                Undo → remove C
              </strong>
              <br />
              ↓
              <br />
              Undo → remove B
            </div>
          </div>

          <div
            style={{
              border:
                "1px solid #dce5df",
              background:
                "#fff",
              padding:
                "20px",
            }}
          >
            <div
              style={{
                color:
                  "#238b45",
                fontSize:
                  "10px",
                fontWeight:
                  800,
                letterSpacing:
                  "0.08em",
                marginBottom:
                  "12px",
              }}
            >
              REDO FLOW
            </div>

            <div
              style={{
                fontFamily:
                  "monospace",
                fontSize:
                  "11px",
                color:
                  "#34443a",
                lineHeight:
                  2,
              }}
            >
              Undo C
              <br />
              ↓
              <br />
              C moves to redo stack
              <br />
              ↓
              <br />
              <strong
                style={{
                  color:
                    "#238b45",
                }}
              >
                Redo → restore C
              </strong>
              <br />
              ↓
              <br />
              C moves back into undo history
            </div>
          </div>
        </div>

        <InfoBox title="Why two stacks?">
          One stack remembers actions that can be undone. A second
          stack remembers actions that have been undone and can be
          restored. This gives the familiar Undo / Redo behaviour
          found in editors.
        </InfoBox>

        <InfoBox
          title="What if we didn't use a stack?"
          accent="#e67700"
        >
          We would need another way to identify the most recent
          edit and another way to maintain the correct order when
          undoing multiple operations. A stack expresses this
          requirement directly: newest edit on top, newest edit
          removed first.
        </InfoBox>

        <InfoBox title="The bigger idea">
          This is why DSA is useful beyond a classroom exercise.
          We aren't using a stack because the assignment says
          "use a stack." We use it because the behaviour we want
          — reverse the most recent operation — is exactly what a
          stack is designed to do.
        </InfoBox>
      </>
    );

  const renderCurrent =
    () => {
      switch (section) {
        case "intro":
          return renderIntro();

        case "queue":
          return renderQueue();

        case "sorting":
          return renderSorting();

        case "trees":
          return renderTrees();

        case "hashmap":
          return renderHashMap();

        case "stack":
          return renderStack();

        case "cooking":
          return renderCooking();

        case "notes":
          return renderNotes();

        default:
          return renderIntro();
      }
    };

  /*
   * =========================================================
   * SIDEBAR
   * =========================================================
   */

  const renderNavItem = (
    item: {
      id: Section;
      label: string;
      description: string;
    }
  ) => {
    const active =
      section === item.id;

    return (
      <button
        key={item.id}
        onClick={() =>
          setSection(
            item.id
          )
        }
        style={{
          width:
            "100%",
          textAlign:
            "left",
          padding:
            "11px 13px",
          border:
            "none",
          borderLeft:
            active
              ? "3px solid #2f9e44"
              : "3px solid transparent",
          background:
            active
              ? "#eaf5ed"
              : "transparent",
          color:
            active
              ? "#1e7036"
              : "#58665e",
          cursor:
            "pointer",
          fontFamily:
            "Inter, sans-serif",
          transition:
            "background 120ms ease",
        }}
      >
        <div
          style={{
            fontSize:
              "12px",
            fontWeight:
              active
                ? 800
                : 650,
          }}
        >
          {item.label}
        </div>

        <div
          style={{
            marginTop:
              "3px",
            fontSize:
              "9px",
            lineHeight:
              1.4,
            color:
              active
                ? "#4b815a"
                : "#8a958e",
          }}
        >
          {item.description}
        </div>
      </button>
    );
  };

  /*
   * =========================================================
   * RENDER
   * =========================================================
   */

  return (
    <div
      data-dsa-window
      onMouseDown={
        onFocus
      }
      style={{
        position:
          "absolute",
        left:
          windowPosition.centered && !hasMovedFromCenter
            ? "50%"
            : `${windowPosition.left}px`,
        top:
          windowPosition.centered && !hasMovedFromCenter
            ? "50%"
            : `${windowPosition.top}px`,
        transform:
          windowPosition.centered && !hasMovedFromCenter
            ? "translate(-50%, -50%)"
            : "none",
        width:
          `min(${WINDOW_WIDTH}px, calc(100vw - 20px))`,
        height:
          `min(${WINDOW_HEIGHT}px, calc(100vh - 60px))`,
        minWidth:
          "820px",
        minHeight:
          "580px",
        zIndex:
          windowPosition.zIndex,
        background:
          "#f7f9f8",
        border:
          "1px solid rgba(255,255,255,0.35)",
        borderRadius:
          "2px",
        overflow:
          "hidden",
        boxShadow:
          "0 24px 70px rgba(0,0,0,0.28)",
        display:
          "flex",
        flexDirection:
          "column",
        fontFamily:
          "Inter, Arial, sans-serif",
        color:
          "#17221b",
      }}
    >
      {/* =================================================
          TITLE BAR
      ================================================= */}

      <div
        onMouseDown={
          handleDragStart
        }
        style={{
          height:
            "42px",
          flex:
            "0 0 42px",
          display:
            "flex",
          alignItems:
            "center",
          padding:
            "0 10px 0 15px",
          background:
            "rgba(255,255,255,0.62)",
          backdropFilter:
            "blur(18px) saturate(140%)",
          WebkitBackdropFilter:
            "blur(18px) saturate(140%)",
          borderBottom:
            "1px solid rgba(40,60,48,0.12)",
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
            fontSize:
              "12px",
            fontWeight:
              800,
            color:
              "#314038",
            letterSpacing:
              "0.01em",
          }}
        >
          Data Structures Lab
        </div>

        <div
          style={{
            marginLeft:
              "9px",
            fontSize:
              "9px",
            color:
              "#829087",
          }}
        >
          Sefirah
        </div>

        <button
          onMouseDown={(
            event
          ) => {
            event.stopPropagation();
          }}
          onClick={(event) => {
            event.stopPropagation();
            onClose?.();
          }}
          aria-label="Close Data Structures Lab"
          style={{
            marginLeft:
              "auto",
            width:
              "27px",
            height:
              "27px",
            border:
              "none",
            background:
              "transparent",
            color:
              "#506057",
            cursor:
              "pointer",
            fontSize:
              "20px",
            lineHeight:
              1,
            display:
              "flex",
            alignItems:
              "center",
            justifyContent:
              "center",
            borderRadius:
              "2px",
          }}
          onMouseEnter={(
            event
          ) => {
            event.currentTarget.style.background =
              "#e95f5f";
            event.currentTarget.style.color =
              "#fff";
          }}
          onMouseLeave={(
            event
          ) => {
            event.currentTarget.style.background =
              "transparent";
            event.currentTarget.style.color =
              "#506057";
          }}
        >
          ×
        </button>
      </div>

      {/* =================================================
          BODY
      ================================================= */}

      <div
        style={{
          flex:
            "1 1 auto",
          minHeight:
            0,
          display:
            "flex",
          overflow:
            "hidden",
          background:
            "#f7f9f8",
        }}
      >
        {/* =================================================
            SIDEBAR
        ================================================= */}

        <aside
          style={{
            width:
              "225px",
            flex:
              "0 0 225px",
            borderRight:
              "1px solid #dbe4de",
            background:
              "#ffffff",
            overflowY:
              "auto",
            overflowX:
              "hidden",
          }}
        >
          <div
            style={{
              padding:
                "18px 14px 10px",
            }}
          >
            <div
              style={{
                fontSize:
                  "9px",
                color:
                  "#89968e",
                fontWeight:
                  800,
                letterSpacing:
                  "0.13em",
              }}
            >
              DATA STRUCTURES
            </div>

            <div
              style={{
                marginTop:
                  "4px",
                fontSize:
                  "15px",
                fontWeight:
                  800,
                color:
                  "#1d2921",
              }}
            >
              Sefirah Lab
            </div>
          </div>

          <div
            style={{
              padding:
                "9px 0 4px",
            }}
          >
            <div
              style={{
                padding:
                  "7px 14px",
                fontSize:
                  "9px",
                color:
                  "#238b45",
                fontWeight:
                  800,
                letterSpacing:
                  "0.11em",
              }}
            >
              EXPLANATIONS
            </div>

            {explanationSections.map(
              renderNavItem
            )}
          </div>

          <div
            style={{
              margin:
                "7px 14px",
              height:
                "1px",
              background:
                "#e2e8e4",
            }}
          />

          <div
            style={{
              padding:
                "4px 0 12px",
            }}
          >
            <div
              style={{
                padding:
                  "7px 14px",
                fontSize:
                  "9px",
                color:
                  "#238b45",
                fontWeight:
                  800,
                letterSpacing:
                  "0.11em",
              }}
            >
              IMPLEMENTATION
            </div>

            {implementationSections.map(
              renderNavItem
            )}
          </div>

          <div
            style={{
              margin:
                "0 14px 15px",
              padding:
                "11px",
              background:
                "#f1f6f3",
              border:
                "1px solid #dbe8df",
              fontSize:
                "10px",
              color:
                "#647169",
              lineHeight:
                1.6,
            }}
          >
            <strong
              style={{
                color:
                  "#31523b",
              }}
            >
              The goal
            </strong>
            <br />
            Understand the concept first,
            then see how it becomes real
            application behaviour.
          </div>
        </aside>

        {/* =================================================
            CONTENT
        ================================================= */}

        <main
          style={{
            flex:
              "1 1 auto",
            minWidth:
              0,
            overflowY:
              "auto",
            overflowX:
              "hidden",
            background:
              "#f7f9f8",
          }}
        >
          <div
            style={{
              maxWidth:
                "920px",
              margin:
                "0 auto",
              padding:
                "32px 36px 70px",
            }}
          >
            {renderCurrent()}
          </div>
        </main>
      </div>

      {/* =================================================
          BOTTOM NAVIGATION
      ================================================= */}

      <div
        style={{
          flex:
            "0 0 48px",
          height:
            "48px",
          borderTop:
            "1px solid #dbe4de",
          background:
            "#ffffff",
          display:
            "flex",
          alignItems:
            "center",
          justifyContent:
            "space-between",
          padding:
            "0 15px",
        }}
      >
        <button
          onClick={
            goPrevious
          }
          disabled={
            currentIndex <=
            0
          }
          style={{
            padding:
              "7px 12px",
            border:
              "1px solid #d3ddd6",
            background:
              "#fff",
            color:
              currentIndex <=
                0
                ? "#a7b0aa"
                : "#334238",
            cursor:
              currentIndex <=
                0
                ? "default"
                : "pointer",
            fontFamily:
              "Inter, sans-serif",
            fontSize:
              "10px",
            fontWeight:
              800,
          }}
        >
          ← PREVIOUS
        </button>

        <div
          style={{
            display:
              "flex",
            alignItems:
              "center",
            gap:
              "7px",
          }}
        >
          {allSections.map(
            (item, index) => (
              <button
                key={item.id}
                onClick={() =>
                  setSection(
                    item.id
                  )
                }
                aria-label={
                  item.label
                }
                style={{
                  width:
                    index ===
                      currentIndex
                      ? "22px"
                      : "6px",
                  height:
                    "6px",
                  padding: 0,
                  border:
                    "none",
                  background:
                    index ===
                      currentIndex
                      ? "#238b45"
                      : "#cbd6cf",
                  cursor:
                    "pointer",
                  transition:
                    "all 160ms ease",
                }}
              />
            )
          )}
        </div>

        <button
          onClick={
            goNext
          }
          disabled={
            currentIndex >=
            allSections.length -
            1
          }
          style={{
            padding:
              "7px 12px",
            border:
              "1px solid #238b45",
            background:
              currentIndex >=
                allSections.length -
                1
                ? "#e3eee6"
                : "#238b45",
            color:
              currentIndex >=
                allSections.length -
                1
                ? "#8a968e"
                : "#fff",
            cursor:
              currentIndex >=
                allSections.length -
                1
                ? "default"
                : "pointer",
            fontFamily:
              "Inter, sans-serif",
            fontSize:
              "10px",
            fontWeight:
              800,
          }}
        >
          NEXT →
        </button>
      </div>
    </div>
  );
}