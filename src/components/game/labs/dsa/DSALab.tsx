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
 * EXPLANATIONS
 *  01 What is DSA?
 *  02 Queue
 *  03 Sorting
 *  04 Trees / BST
 *  05 HashMap
 *  06 Stack
 *
 * IMPLEMENTATION
 *  07 Cooking Game
 *  08 Notes App
 *
 * IMPORTANT:
 *
 * Only the structures that are actually represented in
 * Sefirah are presented as project implementations.
 *
 * Cooking Game:
 *   Queue / ordered recipe execution
 *
 * Notes App:
 *   Stack / undo + redo
 *
 * Sorting, Trees and HashMap remain educational
 * visualizers and are not falsely presented as active
 * production logic.
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
  onMove?: (left: number, top: number) => void;
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
 * RECIPE
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

const ingredientImages: Record<Ingredient, string> = {
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
      description: "The big picture.",
    },
    {
      id: "queue",
      label: "Queue",
      description: "FIFO and ordered processing.",
    },
    {
      id: "sorting",
      label: "Sorting",
      description: "Bubble sort and algorithm steps.",
    },
    {
      id: "trees",
      label: "Trees / BST",
      description: "Hierarchy and searching.",
    },
    {
      id: "hashmap",
      label: "HashMap",
      description: "Key → value lookup.",
    },
    {
      id: "stack",
      label: "Stack",
      description: "LIFO and undo/redo.",
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
      description: "Fried-rice recipe queue.",
    },
    {
      id: "notes",
      label: "Notes App",
      description: "Stack-based undo/redo.",
    },
  ];

/*
 * =========================================================
 * SMALL UI
 * =========================================================
 */

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
    <div style={{ marginBottom: 22 }}>
      <div
        style={{
          color: "#238b45",
          fontSize: 10,
          fontWeight: 800,
          letterSpacing: "0.1em",
          marginBottom: 8,
        }}
      >
        {eyebrow}
      </div>

      <h1
        style={{
          margin: 0,
          color: "#18231d",
          fontFamily: "Inter, sans-serif",
          fontSize: 28,
          lineHeight: 1.15,
          fontWeight: 800,
          letterSpacing: "-0.025em",
        }}
      >
        {title}
      </h1>

      <p
        style={{
          margin: "9px 0 0",
          maxWidth: 780,
          color: "#657168",
          fontFamily: "Inter, sans-serif",
          fontSize: 14,
          lineHeight: 1.7,
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
        padding: "4px 8px",
        background: "#e8f5ec",
        border: "1px solid #c8e5d0",
        borderRadius: 2,
        color: "#217a3c",
        fontSize: 10,
        fontWeight: 800,
        letterSpacing: "0.06em",
        fontFamily: "Inter, sans-serif",
      }}
    >
      {children}
    </span>
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
        marginTop: 18,
        border: "1px solid #dce5df",
        borderLeft: `4px solid ${accent}`,
        background: "#fff",
        padding: "17px 19px",
      }}
    >
      <div
        style={{
          color: "#26342b",
          fontSize: 13,
          fontWeight: 800,
          fontFamily: "Inter, sans-serif",
          marginBottom: 7,
        }}
      >
        {title}
      </div>

      <div
        style={{
          color: "#59665e",
          fontSize: 12,
          lineHeight: 1.75,
          fontFamily: "Inter, sans-serif",
        }}
      >
        {children}
      </div>
    </div>
  );
}

function CodeBlock({
  code,
  activeLine,
}: {
  code: string;
  activeLine?: number;
}) {
  return (
    <div
      style={{
        background: "#101412",
        border: "1px solid #26362d",
        borderRadius: 2,
        overflow: "hidden",
        fontFamily:
          "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
        fontSize: 12,
      }}
    >
      {code.split("\n").map((line, index) => {
        const number = index + 1;
        const active = activeLine === number;

        return (
          <div
            key={number}
            style={{
              display: "grid",
              gridTemplateColumns: "40px 1fr",
              minHeight: 27,
              background: active
                ? "rgba(47, 158, 68, 0.24)"
                : "transparent",
              borderLeft: active
                ? "3px solid #2f9e44"
                : "3px solid transparent",
            }}
          >
            <div
              style={{
                padding: "6px 8px",
                textAlign: "right",
                color: active ? "#79df9d" : "#536158",
                userSelect: "none",
              }}
            >
              {number}
            </div>

            <div
              style={{
                padding: "6px 12px",
                color: "#d9e5dc",
                whiteSpace: "pre-wrap",
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
  const current = recipeSteps[activeIndex];

  return (
    <div
      style={{
        border: "1px solid #dce5df",
        background: "#fff",
      }}
    >
      <div
        style={{
          padding: "13px 16px",
          borderBottom: "1px solid #e1e7e3",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div
          style={{
            color: "#1d2921",
            fontSize: 13,
            fontWeight: 800,
          }}
        >
          Interactive Queue
        </div>

        <MiniBadge>FIFO</MiniBadge>
      </div>

      <div
        style={{
          padding: 20,
          overflowX: "auto",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "stretch",
            gap: 8,
            minWidth: 710,
          }}
        >
          {recipeSteps.map((step, index) => {
            const front = index === activeIndex;
            const completed = index < activeIndex;

            return (
              <button
                key={step.id}
                onClick={() => setActiveIndex(index)}
                style={{
                  position: "relative",
                  flex: "0 0 78px",
                  minHeight: 108,
                  border: front
                    ? "2px solid #2f9e44"
                    : "1px solid #d5ded8",
                  background: front
                    ? "#eef9f1"
                    : completed
                      ? "#f5f7f6"
                      : "#fff",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  fontFamily: "Inter, sans-serif",
                  transition: "all 160ms ease",
                }}
              >
                {front && (
                  <div
                    style={{
                      position: "absolute",
                      top: -19,
                      color: "#238b45",
                      fontSize: 9,
                      fontWeight: 800,
                      letterSpacing: "0.08em",
                    }}
                  >
                    FRONT
                  </div>
                )}

                <div
                  style={{
                    width: 45,
                    height: 45,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {step.ingredient ? (
                    <img
                      src={
                        ingredientImages[step.ingredient]
                      }
                      alt={step.name}
                      style={{
                        width: 40,
                        height: 40,
                        objectFit: "contain",
                      }}
                    />
                  ) : (
                    <span style={{ fontSize: 27 }}>🥄</span>
                  )}
                </div>

                <div
                  style={{
                    marginTop: 5,
                    color: completed
                      ? "#89948d"
                      : "#27342b",
                    fontSize: 9,
                    fontWeight: 800,
                  }}
                >
                  {step.shortName}
                </div>

                <div
                  style={{
                    marginTop: 4,
                    color: "#8a958e",
                    fontSize: 8,
                  }}
                >
                  #{step.id}
                </div>
              </button>
            );
          })}
        </div>

        <div
          style={{
            marginTop: 20,
            display: "flex",
            alignItems: "center",
            gap: 9,
          }}
        >
          <button
            disabled={activeIndex === 0}
            onClick={() =>
              setActiveIndex((v) => Math.max(0, v - 1))
            }
            style={{
              padding: "8px 12px",
              border: "1px solid #cfd9d3",
              background: "#fff",
              color: "#304037",
              cursor:
                activeIndex === 0 ? "not-allowed" : "pointer",
              opacity: activeIndex === 0 ? 0.5 : 1,
              fontWeight: 700,
            }}
          >
            ← Previous
          </button>

          <button
            disabled={activeIndex === recipeSteps.length - 1}
            onClick={() =>
              setActiveIndex((v) =>
                Math.min(recipeSteps.length - 1, v + 1)
              )
            }
            style={{
              padding: "8px 12px",
              border: "1px solid #238b45",
              background: "#238b45",
              color: "#fff",
              cursor:
                activeIndex === recipeSteps.length - 1
                  ? "not-allowed"
                  : "pointer",
              opacity:
                activeIndex === recipeSteps.length - 1
                  ? 0.5
                  : 1,
              fontWeight: 700,
            }}
          >
            Next →
          </button>

          <div
            style={{
              marginLeft: "auto",
              color: "#68756d",
              fontSize: 11,
            }}
          >
            queue.peek() →{" "}
            <strong style={{ color: "#238b45" }}>
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
  const initial = [42, 17, 65, 8, 31, 54, 23, 71];

  const [items, setItems] = useState<SortItem[]>(
    initial.map((value, id) => ({ value, id }))
  );

  const [comparison, setComparison] = useState<
    [number, number] | null
  >(null);

  const [running, setRunning] = useState(false);
  const [sorted, setSorted] = useState(false);

  const reset = () => {
    setItems(
      initial.map((value, id) => ({
        value,
        id,
      }))
    );
    setComparison(null);
    setRunning(false);
    setSorted(false);
  };

  const runBubbleSort = async () => {
    if (running) return;

    setRunning(true);
    setSorted(false);

    const array = items.map((item) => ({ ...item }));

    for (let i = 0; i < array.length; i++) {
      for (let j = 0; j < array.length - i - 1; j++) {
        setComparison([j, j + 1]);

        await new Promise((resolve) =>
          setTimeout(resolve, 320)
        );

        if (
          array[j].value >
          array[j + 1].value
        ) {
          const temp = array[j];
          array[j] = array[j + 1];
          array[j + 1] = temp;

          setItems([...array]);
        }
      }
    }

    setComparison(null);
    setSorted(true);
    setRunning(false);
  };

  return (
    <div
      style={{
        border: "1px solid #dce5df",
        background: "#fff",
      }}
    >
      <div
        style={{
          padding: "13px 16px",
          borderBottom: "1px solid #e1e7e3",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <div
            style={{
              color: "#1d2921",
              fontWeight: 800,
              fontSize: 13,
            }}
          >
            Bubble Sort Visualizer
          </div>

          <div
            style={{
              marginTop: 3,
              color: "#89948d",
              fontSize: 10,
            }}
          >
            Compare neighbours → swap when out of order.
          </div>
        </div>

        <div style={{ display: "flex", gap: 7 }}>
          <button
            onClick={reset}
            style={{
              padding: "7px 10px",
              background: "#fff",
              border: "1px solid #cfd9d3",
              cursor: "pointer",
              fontWeight: 700,
              fontSize: 11,
            }}
          >
            Reset
          </button>

          <button
            onClick={runBubbleSort}
            disabled={running}
            style={{
              padding: "7px 12px",
              background: "#238b45",
              border: "1px solid #238b45",
              color: "#fff",
              cursor: running ? "not-allowed" : "pointer",
              opacity: running ? 0.6 : 1,
              fontWeight: 700,
              fontSize: 11,
            }}
          >
            {running ? "Running..." : "Run Sort"}
          </button>
        </div>
      </div>

      <div style={{ padding: 20 }}>
        <div
          style={{
            height: 190,
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "center",
            gap: 9,
            borderBottom: "1px solid #dfe7e2",
            padding: "10px 12px 0",
          }}
        >
          {items.map((item, index) => {
            const active =
              comparison?.includes(index) ?? false;

            return (
              <div
                key={item.id}
                style={{
                  flex: "1 1 0",
                  maxWidth: 58,
                  height: `${Math.max(
                    30,
                    item.value * 1.65
                  )}px`,
                  background: active
                    ? "#fff1d6"
                    : sorted
                      ? "#dff3e5"
                      : "#eef3f0",
                  border: active
                    ? "2px solid #e67700"
                    : "1px solid #c6d5cc",
                  display: "flex",
                  alignItems: "flex-start",
                  justifyContent: "center",
                  paddingTop: 7,
                  color: "#243128",
                  fontSize: 11,
                  fontWeight: 800,
                  transition: "height 180ms ease",
                }}
              >
                {item.value}
              </div>
            );
          })}
        </div>

        <div
          style={{
            marginTop: 15,
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: 12,
          }}
        >
          <Stat
            label="CURRENT"
            value={
              comparison
                ? `Compare ${comparison[0] + 1} ↔ ${comparison[1] + 1
                }`
                : sorted
                  ? "Sorted"
                  : "Waiting"
            }
          />

          <Stat
            label="RULE"
            value="Compare neighbours"
          />

          <Stat
            label="COMPLEXITY"
            value="O(n²)"
            green
          />
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
  const [highlighted, setHighlighted] =
    useState<number | null>(null);

  const nodes = [
    { value: 50, x: 50, y: 30 },
    { value: 25, x: 28, y: 105 },
    { value: 75, x: 72, y: 105 },
    { value: 10, x: 17, y: 180 },
    { value: 35, x: 39, y: 180 },
    { value: 65, x: 61, y: 180 },
    { value: 90, x: 83, y: 180 },
  ];

  return (
    <div
      style={{
        border: "1px solid #dce5df",
        background: "#fff",
        padding: 20,
      }}
    >
      <div
        style={{
          color: "#1d2921",
          fontWeight: 800,
          fontSize: 13,
          marginBottom: 15,
        }}
      >
        Binary Search Tree
      </div>

      <div
        style={{
          position: "relative",
          height: 250,
          maxWidth: 650,
          margin: "0 auto",
        }}
      >
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 650 250"
          style={{
            position: "absolute",
            inset: 0,
          }}
        >
          <line
            x1="325"
            y1="70"
            x2="182"
            y2="120"
            stroke="#aebdb4"
            strokeWidth="2"
          />
          <line
            x1="325"
            y1="70"
            x2="468"
            y2="120"
            stroke="#aebdb4"
            strokeWidth="2"
          />
          <line
            x1="182"
            y1="145"
            x2="110"
            y2="195"
            stroke="#aebdb4"
            strokeWidth="2"
          />
          <line
            x1="182"
            y1="145"
            x2="250"
            y2="195"
            stroke="#aebdb4"
            strokeWidth="2"
          />
          <line
            x1="468"
            y1="145"
            x2="395"
            y2="195"
            stroke="#aebdb4"
            strokeWidth="2"
          />
          <line
            x1="468"
            y1="145"
            x2="540"
            y2="195"
            stroke="#aebdb4"
            strokeWidth="2"
          />
        </svg>

        {nodes.map((node) => {
          const active = highlighted === node.value;

          return (
            <button
              key={node.value}
              onClick={() =>
                setHighlighted(node.value)
              }
              style={{
                position: "absolute",
                left: `${node.x}%`,
                top: node.y,
                transform: "translateX(-50%)",
                width: 46,
                height: 46,
                border: active
                  ? "3px solid #e67700"
                  : "2px solid #2f9e44",
                background: active
                  ? "#fff3d8"
                  : "#eef9f1",
                borderRadius: "50%",
                color: "#1e3b27",
                fontWeight: 800,
                cursor: "pointer",
                zIndex: 2,
              }}
            >
              {node.value}
            </button>
          );
        })}
      </div>

      <div
        style={{
          padding: "12px 14px",
          background: "#f4f7f5",
          border: "1px solid #dfe7e2",
          color: "#526058",
          fontSize: 12,
          lineHeight: 1.6,
        }}
      >
        Click a node. Values smaller than the current node
        go left; larger values go right.
        {highlighted !== null && (
          <strong>
            {" "}
            You selected {highlighted}.
          </strong>
        )}
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
    ["soy_sauce", "1"],
  ];

  const [selected, setSelected] =
    useState<string | null>(null);

  return (
    <div
      style={{
        border: "1px solid #dce5df",
        background: "#fff",
      }}
    >
      <div
        style={{
          padding: "13px 16px",
          borderBottom: "1px solid #e1e7e3",
          color: "#1d2921",
          fontWeight: 800,
          fontSize: 13,
        }}
      >
        HashMap — ingredient lookup
      </div>

      <div
        style={{
          padding: 18,
          display: "grid",
          gridTemplateColumns:
            "repeat(4, minmax(0, 1fr))",
          gap: 10,
        }}
      >
        {entries.map(([key, value]) => (
          <button
            key={key}
            onClick={() => setSelected(key)}
            style={{
              textAlign: "left",
              border:
                selected === key
                  ? "2px solid #2f9e44"
                  : "1px solid #d4dfd8",
              background:
                selected === key
                  ? "#eef9f1"
                  : "#fff",
              padding: 12,
              cursor: "pointer",
              fontFamily: "Inter, sans-serif",
            }}
          >
            <div
              style={{
                color: "#7b887f",
                fontSize: 9,
                fontWeight: 800,
              }}
            >
              KEY
            </div>

            <div
              style={{
                marginTop: 5,
                color: "#203028",
                fontFamily: "monospace",
                fontSize: 11,
                fontWeight: 700,
              }}
            >
              {key}
            </div>

            <div
              style={{
                marginTop: 10,
                color: "#7b887f",
                fontSize: 9,
                fontWeight: 800,
              }}
            >
              VALUE
            </div>

            <div
              style={{
                marginTop: 4,
                color: "#238b45",
                fontFamily: "monospace",
                fontSize: 14,
                fontWeight: 800,
              }}
            >
              {value}
            </div>
          </button>
        ))}
      </div>

      <div
        style={{
          margin: "0 18px 18px",
          padding: 12,
          background: "#101412",
          color: "#cfe2d5",
          fontFamily: "monospace",
          fontSize: 11,
        }}
      >
        {selected
          ? `inventory.get("${selected}") → ${entries.find(
            ([key]) => key === selected
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
  const [undoStack, setUndoStack] =
    useState<string[]>([
      "Typed Hello",
      "Typed Hello World",
      "Deleted World",
    ]);

  const [redoStack, setRedoStack] =
    useState<string[]>([]);

  const pushEdit = () => {
    const edit = `Edit #${undoStack.length + 1}`;

    setUndoStack((previous) => [
      ...previous,
      edit,
    ]);

    setRedoStack([]);
  };

  const undo = () => {
    if (undoStack.length === 0) return;

    const latest =
      undoStack[undoStack.length - 1];

    setUndoStack((previous) =>
      previous.slice(0, -1)
    );

    setRedoStack((previous) => [
      ...previous,
      latest,
    ]);
  };

  const redo = () => {
    if (redoStack.length === 0) return;

    const latest =
      redoStack[redoStack.length - 1];

    setRedoStack((previous) =>
      previous.slice(0, -1)
    );

    setUndoStack((previous) => [
      ...previous,
      latest,
    ]);
  };

  return (
    <div
      style={{
        border: "1px solid #dce5df",
        background: "#fff",
        padding: 18,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 15,
        }}
      >
        <div
          style={{
            color: "#1d2921",
            fontWeight: 800,
            fontSize: 13,
          }}
        >
          Interactive Stack
        </div>

        <MiniBadge>LIFO</MiniBadge>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 15,
        }}
      >
        <StackColumn
          title="UNDO STACK"
          items={undoStack}
          topLabel="TOP → POP"
        />

        <StackColumn
          title="REDO STACK"
          items={redoStack}
          topLabel="TOP → REDO"
        />
      </div>

      <div
        style={{
          marginTop: 15,
          display: "flex",
          gap: 8,
        }}
      >
        <button
          onClick={pushEdit}
          style={stackButtonStyle(true)}
        >
          New Edit
        </button>

        <button
          onClick={undo}
          disabled={undoStack.length === 0}
          style={stackButtonStyle(false)}
        >
          Undo
        </button>

        <button
          onClick={redo}
          disabled={redoStack.length === 0}
          style={stackButtonStyle(false)}
        >
          Redo
        </button>
      </div>

      <div
        style={{
          marginTop: 12,
          color: "#68756d",
          fontSize: 11,
          textAlign: "center",
        }}
      >
        The newest operation is always on top.
        Undo removes that operation first.
      </div>
    </div>
  );
}

function StackColumn({
  title,
  items,
  topLabel,
}: {
  title: string;
  items: string[];
  topLabel: string;
}) {
  return (
    <div
      style={{
        border: "1px solid #dfe7e2",
        background: "#f8faf9",
        padding: 12,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 10,
          color: "#66736a",
          fontSize: 9,
          fontWeight: 800,
          letterSpacing: "0.07em",
        }}
      >
        <span>{title}</span>
        <span>{topLabel}</span>
      </div>

      <div
        style={{
          minHeight: 135,
          display: "flex",
          flexDirection: "column-reverse",
          gap: 5,
        }}
      >
        {items.map((item, index) => (
          <div
            key={`${item}-${index}`}
            style={{
              padding: "9px 10px",
              background:
                index === items.length - 1
                  ? "#dff3e5"
                  : "#f0f4f1",
              border: "1px solid #c6d7cb",
              color: "#27372d",
              fontSize: 10,
              fontWeight: 700,
            }}
          >
            {item}
          </div>
        ))}

        {items.length === 0 && (
          <div
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#9aa59e",
              fontSize: 10,
            }}
          >
            EMPTY STACK
          </div>
        )}
      </div>
    </div>
  );
}

function stackButtonStyle(primary: boolean): CSSProperties {
  return {
    padding: "8px 12px",
    border: primary
      ? "1px solid #238b45"
      : "1px solid #cfd9d3",
    background: primary ? "#238b45" : "#fff",
    color: primary ? "#fff" : "#304037",
    cursor: "pointer",
    fontWeight: 700,
    fontSize: 11,
  };
}

function Stat({
  label,
  value,
  green = false,
}: {
  label: string;
  value: string;
  green?: boolean;
}) {
  return (
    <div>
      <div
        style={{
          color: "#77847b",
          fontSize: 9,
          fontWeight: 800,
          letterSpacing: "0.07em",
        }}
      >
        {label}
      </div>

      <div
        style={{
          marginTop: 4,
          color: green ? "#238b45" : "#243128",
          fontSize: 11,
          fontWeight: green ? 800 : 500,
          fontFamily: green ? "monospace" : "Inter, sans-serif",
        }}
      >
        {value}
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
  const [section, setSection] =
    useState<Section>("intro");

  const [activeQueueIndex, setActiveQueueIndex] =
    useState(0);

  const [isDragging, setIsDragging] =
    useState(false);

  const [hasMovedFromCenter, setHasMovedFromCenter] =
    useState(false);

  const dragOffset = useRef({
    x: 0,
    y: 0,
  });

  const WINDOW_WIDTH = 1120;
  const WINDOW_HEIGHT = 760;
  const TITLE_BAR_HEIGHT = 42;

  /*
   * ---------------------------------------------------------
   * DRAGGING
   * ---------------------------------------------------------
   */

  const handleDragStart = (
    event: ReactMouseEvent
  ) => {
    if (event.button !== 0) return;

    event.preventDefault();
    event.stopPropagation();

    onFocus?.();

    const windowElement =
      event.currentTarget.closest(
        "[data-dsa-window]"
      ) as HTMLElement | null;

    if (!windowElement) return;

    const rect =
      windowElement.getBoundingClientRect();

    dragOffset.current = {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    };

    setIsDragging(true);
  };

  useEffect(() => {
    if (!isDragging) return;

    const handleMove = (
      event: MouseEvent
    ) => {
      const actualWidth = Math.min(
        WINDOW_WIDTH,
        window.innerWidth - 20
      );

      const actualHeight = Math.min(
        WINDOW_HEIGHT,
        window.innerHeight - 60
      );

      const left =
        event.clientX -
        dragOffset.current.x;

      const top =
        event.clientY -
        dragOffset.current.y;

      const maxLeft = Math.max(
        10,
        window.innerWidth -
        actualWidth -
        10
      );

      const maxTop = Math.max(
        TITLE_BAR_HEIGHT,
        window.innerHeight -
        actualHeight -
        10
      );

      onMove?.(
        Math.max(
          10,
          Math.min(left, maxLeft)
        ),
        Math.max(
          TITLE_BAR_HEIGHT,
          Math.min(top, maxTop)
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
  }, [isDragging, onMove]);

  const allSections = useMemo(
    () => [
      ...explanationSections,
      ...implementationSections,
    ],
    []
  );

  const currentIndex =
    allSections.findIndex(
      (item) => item.id === section
    );

  const goPrevious = () => {
    if (currentIndex <= 0) return;

    setSection(
      allSections[currentIndex - 1].id
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
      allSections[currentIndex + 1].id
    );
  };

  /*
   * =========================================================
   * PAGE RENDERERS
   * =========================================================
   */

  const renderIntro = () => (
    <>
      <SectionTitle
        eyebrow="01 • EXPLANATIONS"
        title="What is DSA?"
        description="Data Structures and Algorithms are the tools we use to organise information and decide how a program should process it."
      />

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1.1fr 0.9fr",
          gap: 18,
        }}
      >
        <div style={cardStyle}>
          <h2 style={headingStyle}>
            Think of DSA as two questions
          </h2>

          <div
            style={{
              display: "grid",
              gap: 12,
            }}
          >
            <div
              style={{
                padding: 15,
                background: "#f2f8f4",
                borderLeft: "4px solid #2f9e44",
              }}
            >
              <strong>
                1. How should the data be stored?
              </strong>

              <div style={bodyStyle}>
                Queue? Stack? Tree? HashMap?
                Each structure gives us different
                ways to access and modify data.
              </div>
            </div>

            <div
              style={{
                padding: 15,
                background: "#f7f7f4",
                borderLeft: "4px solid #5d6b63",
              }}
            >
              <strong>
                2. What steps should the program take?
              </strong>

              <div style={bodyStyle}>
                That is where algorithms come in:
                sorting, searching, traversal,
                comparison and decision-making.
              </div>
            </div>
          </div>
        </div>

        <div style={cardStyle}>
          <MiniBadge>SEFIRAH CONNECTION</MiniBadge>

          <h2 style={headingStyle}>
            DSA is about behaviour
          </h2>

          <p style={bodyStyle}>
            The important question is not simply
            "where did we write the word Queue?"
          </p>

          <p style={bodyStyle}>
            The useful question is:
            <strong>
              {" "}
              what behaviour does the program need?
            </strong>
          </p>

          <div
            style={{
              marginTop: 14,
              padding: 14,
              background: "#101412",
              color: "#d7e4db",
              fontFamily: "monospace",
              fontSize: 11,
              lineHeight: 1.9,
            }}
          >
            requirement
            <br />
            ↓
            <br />
            choose structure
            <br />
            ↓
            <br />
            implement operations
            <br />
            ↓
            <br />
            observe behaviour
          </div>
        </div>
      </div>

      <InfoBox title="The main idea">
        A good data structure makes the operations we care
        about easier to express. A good algorithm gives us
        a repeatable method for solving a problem.
      </InfoBox>

      <InfoBox
        title="What if we choose the wrong structure?"
        accent="#e67700"
      >
        The application may still work, but the code can
        become harder to reason about or slower for larger
        amounts of data. DSA is therefore about matching
        the structure to the behaviour we need.
      </InfoBox>
    </>
  );

  const renderQueue = () => (
    <>
      <SectionTitle
        eyebrow="02 • EXPLANATIONS"
        title="Queue"
        description="A queue follows FIFO — First In, First Out. The item that arrives first is the item processed first."
      />

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 18,
        }}
      >
        <div style={cardStyle}>
          <MiniBadge>FIFO</MiniBadge>

          <h2 style={headingStyle}>
            Think about a line
          </h2>

          <p style={bodyStyle}>
            People join at the back. The person at
            the front is served first.
          </p>

          <div
            style={{
              marginTop: 18,
              display: "flex",
              justifyContent: "center",
              gap: 8,
            }}
          >
            {["A", "B", "C", "D"].map(
              (item, index) => (
                <div
                  key={item}
                  style={{
                    width: 55,
                    height: 55,
                    background:
                      index === 0
                        ? "#e5f5e9"
                        : "#f3f6f4",
                    border:
                      "1px solid #cbd9cf",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#28412f",
                    fontWeight: 800,
                  }}
                >
                  {item}
                </div>
              )
            )}
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: 9,
              color: "#718077",
              fontSize: 9,
              fontWeight: 800,
            }}
          >
            <span>FRONT → DEQUEUE</span>
            <span>ENQUEUE ← REAR</span>
          </div>
        </div>

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

      <div style={{ marginTop: 20 }}>
        <QueueVisualizer
          activeIndex={activeQueueIndex}
          setActiveIndex={setActiveQueueIndex}
        />
      </div>

      <InfoBox title="Why is Queue useful?">
        Queues are useful whenever order matters:
        print jobs, background tasks, requests, event
        processing — and in Sefirah, the ordered sequence
        of cooking actions.
      </InfoBox>

      <InfoBox
        title="What if there was no queue?"
        accent="#e67700"
      >
        We could manually track many boolean variables:
        oilAdded, garlicAdded, carrotAdded, riceAdded,
        and so on. That can work for a tiny example, but
        the intended sequence becomes scattered across
        conditions instead of being represented as one
        ordered structure.
      </InfoBox>
    </>
  );

  const renderSorting = () => (
    <>
      <SectionTitle
        eyebrow="03 • EXPLANATIONS"
        title="Sorting"
        description="Sorting algorithms rearrange data according to a rule. Bubble Sort is a simple example that repeatedly compares neighbouring values."
      />

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "0.85fr 1.15fr",
          gap: 18,
        }}
      >
        <div style={cardStyle}>
          <MiniBadge>BUBBLE SORT</MiniBadge>

          <h2 style={headingStyle}>
            The simple idea
          </h2>

          <p style={bodyStyle}>
            Look at two neighbours. If they are in the
            wrong order, swap them.
          </p>

          <div
            style={{
              marginTop: 15,
              display: "grid",
              gap: 8,
            }}
          >
            {[
              "Compare two neighbours",
              "Swap if left > right",
              "Continue through the array",
              "Repeat until no more swaps are needed",
            ].map((text, index) => (
              <div
                key={text}
                style={{
                  display: "flex",
                  gap: 9,
                  alignItems: "center",
                  color: "#526058",
                  fontSize: 12,
                }}
              >
                <div
                  style={{
                    width: 23,
                    height: 23,
                    background: "#e6f4ea",
                    color: "#238b45",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 800,
                    fontSize: 10,
                  }}
                >
                  {index + 1}
                </div>

                {text}
              </div>
            ))}
          </div>

          <div style={{ marginTop: 17 }}>
            <CodeBlock
              code={`for (let i = 0; i < n; i++) {
  for (let j = 0; j < n-i-1; j++) {
    if (a[j] > a[j+1]) {
      swap(a[j], a[j+1]);
    }
  }
}`}
            />
          </div>
        </div>

        <SortingVisualizer />
      </div>

      <InfoBox title="Why do we learn this if Sefirah does not use it?">
        Because an educational DSA project should demonstrate
        that you understand the structures and algorithms,
        not merely show the one structure that happens to
        appear in the current game.
      </InfoBox>

      <InfoBox
        title="What if the data becomes much larger?"
        accent="#e67700"
      >
        Bubble Sort is easy to understand but has O(n²)
        worst-case behaviour. For larger datasets, algorithms
        such as Merge Sort or Quick Sort can provide much
        better performance.
      </InfoBox>
    </>
  );

  const renderTrees = () => (
    <>
      <SectionTitle
        eyebrow="04 • EXPLANATIONS"
        title="Trees & Binary Search Trees"
        description="Trees represent hierarchical relationships. A Binary Search Tree adds an ordering rule that helps guide searches."
      />

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "0.8fr 1.2fr",
          gap: 18,
        }}
      >
        <div style={cardStyle}>
          <h2 style={headingStyle}>
            Why use a tree?
          </h2>

          <p style={bodyStyle}>
            Some information naturally has levels:
            folders, categories, organisation structures,
            expression trees and search structures.
          </p>

          <div
            style={{
              marginTop: 15,
              padding: 15,
              background: "#f5f8f6",
              border: "1px solid #dce5df",
              color: "#33443a",
              fontFamily: "monospace",
              fontSize: 11,
              lineHeight: 1.9,
            }}
          >
            Home
            <br />
            ├── Documents
            <br />
            │ ├── Notes
            <br />
            │ └── Reports
            <br />
            └── Games
            <br />
            &nbsp;&nbsp;&nbsp;└── Sefirah
          </div>
        </div>

        <TreeVisualizer />
      </div>

      <InfoBox title="Binary Search Tree rule">
        Smaller values go to the left and larger values
        go to the right. When searching for a value, we
        can therefore decide which branch to follow.
      </InfoBox>

      <InfoBox
        title="What if the tree becomes unbalanced?"
        accent="#e67700"
      >
        A badly unbalanced BST can start behaving like a
        linked list. That is why balanced tree structures
        such as AVL trees and Red-Black trees are important
        in more advanced applications.
      </InfoBox>
    </>
  );

  const renderHashMap = () => (
    <>
      <SectionTitle
        eyebrow="05 • EXPLANATIONS"
        title="HashMap"
        description="A HashMap associates keys with values so that we can perform convenient direct lookups."
      />

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "0.85fr 1.15fr",
          gap: 18,
        }}
      >
        <div style={cardStyle}>
          <MiniBadge>KEY → VALUE</MiniBadge>

          <h2 style={headingStyle}>
            Ask for the thing directly
          </h2>

          <p style={bodyStyle}>
            Instead of scanning an entire collection,
            a hash table uses a hash function to map a
            key toward a storage location.
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

      <InfoBox title="Average complexity">
        HashMap lookup is typically O(1) on average,
        although the exact behaviour depends on the
        implementation and collision patterns.
      </InfoBox>

      <InfoBox
        title="What if two keys collide?"
        accent="#e67700"
      >
        Different keys can produce the same hash location.
        Hash table implementations therefore need a way
        to resolve collisions, such as chaining or probing.
      </InfoBox>
    </>
  );

  const renderStack = () => (
    <>
      <SectionTitle
        eyebrow="06 • EXPLANATIONS"
        title="Stack"
        description="A stack follows LIFO — Last In, First Out. The newest item is the first item removed."
      />

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 18,
        }}
      >
        <div style={cardStyle}>
          <MiniBadge>LIFO</MiniBadge>

          <h2 style={headingStyle}>
            Think of a pile
          </h2>

          <p style={bodyStyle}>
            If you place three books on top of one
            another, you normally remove the newest
            book first.
          </p>

          <CodeBlock
            code={`const stack: string[] = [];

stack.push("A");
stack.push("B");
stack.push("C");

const latest = stack.pop();
// → "C"`}
          />

          <div
            style={{
              marginTop: 14,
              padding: 13,
              background: "#f2f8f4",
              borderLeft: "4px solid #2f9e44",
              color: "#526058",
              fontSize: 12,
              lineHeight: 1.7,
            }}
          >
            The most recent operation is always at
            the top of the stack.
          </div>
        </div>

        <StackVisualizer />
      </div>

      <InfoBox title="Why is Stack perfect for Undo?">
        When we undo an edit, we want the most recent
        edit to disappear first. That is exactly LIFO
        behaviour: push new edits, then pop the newest
        edit when Undo is pressed.
      </InfoBox>

      <InfoBox
        title="What about Redo?"
        accent="#e67700"
      >
        A second stack can hold the operations removed
        by Undo. Pressing Redo pops from that stack and
        places the operation back onto the undo stack.
        This gives us the familiar two-direction history
        behaviour.
      </InfoBox>
    </>
  );

  const renderCooking = () => {
    const activeStep =
      recipeSteps[activeQueueIndex];

    return (
      <>
        <SectionTitle
          eyebrow="07 • IMPLEMENTATION"
          title="DSA inside the Cooking Game"
          description="This is the strongest real DSA implementation in the current Sefirah project: the fried-rice recipe is represented as an ordered sequence of cooking actions."
        />

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "0.9fr 1.1fr",
            gap: 18,
          }}
        >
          <div style={cardStyle}>
            <MiniBadge>
              REAL PROJECT LOGIC
            </MiniBadge>

            <h2 style={headingStyle}>
              The recipe behaves like a queue
            </h2>

            <p style={bodyStyle}>
              The player should not be able to randomly
              complete the recipe. The game has a required
              order.
            </p>

            <div
              style={{
                marginTop: 15,
                padding: 15,
                background: "#eef9f1",
                border: "1px solid #d5e8da",
              }}
            >
              <div
                style={{
                  color: "#728077",
                  fontSize: 9,
                  fontWeight: 800,
                  letterSpacing: "0.08em",
                }}
              >
                CURRENT REQUIRED ACTION
              </div>

              <div
                style={{
                  marginTop: 6,
                  color: "#238b45",
                  fontSize: 21,
                  fontWeight: 800,
                }}
              >
                {activeStep.name}
              </div>
            </div>

            <div
              style={{
                marginTop: 15,
                display: "flex",
                alignItems: "center",
                gap: 12,
              }}
            >
              {activeStep.ingredient ? (
                <img
                  src={
                    ingredientImages[
                    activeStep.ingredient
                    ]
                  }
                  alt={activeStep.name}
                  style={{
                    width: 78,
                    height: 78,
                    objectFit: "contain",
                    border:
                      "1px solid #dbe4de",
                    background: "#fff",
                  }}
                />
              ) : (
                <div
                  style={{
                    width: 78,
                    height: 78,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "#f1f5f2",
                    fontSize: 35,
                  }}
                >
                  🥄
                </div>
              )}

              <div
                style={{
                  color: "#69766e",
                  fontSize: 12,
                  lineHeight: 1.6,
                }}
              >
                The player must provide the expected
                ingredient/action before the queue moves
                forward.
              </div>
            </div>
          </div>

          <div>
            <div
              style={{
                color: "#647169",
                fontSize: 10,
                fontWeight: 800,
                letterSpacing: "0.08em",
                marginBottom: 9,
              }}
            >
              RECIPE QUEUE
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

        <div style={{ marginTop: 20 }}>
          <QueueVisualizer
            activeIndex={activeQueueIndex}
            setActiveIndex={setActiveQueueIndex}
          />
        </div>

        <div
          style={{
            marginTop: 20,
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 18,
          }}
        >
          <div style={cardStyle}>
            <div style={labelStyle}>
              WHAT HAPPENS BEHIND THE SCENES?
            </div>

            {[
              "Player chooses an ingredient/action.",
              "Game checks the current required action.",
              "The action is compared with queue.peek().",
              "Incorrect action does not advance the recipe.",
              "Correct action completes the current step.",
              "The next queue element becomes the new required action.",
            ].map((text, index) => (
              <div
                key={text}
                style={{
                  display: "flex",
                  gap: 10,
                  marginBottom: 10,
                  alignItems: "flex-start",
                }}
              >
                <div
                  style={{
                    flex: "0 0 23px",
                    height: 23,
                    background: "#e6f4ea",
                    color: "#238b45",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 800,
                    fontSize: 10,
                  }}
                >
                  {index + 1}
                </div>

                <div
                  style={{
                    color: "#526058",
                    fontSize: 12,
                    lineHeight: 1.5,
                  }}
                >
                  {text}
                </div>
              </div>
            ))}
          </div>

          <div
            style={{
              border: "1px solid #dce5df",
              background: "#fff",
              padding: 20,
            }}
          >
            <div
              style={{
                color: "#c56d00",
                fontWeight: 800,
                fontSize: 10,
                letterSpacing: "0.08em",
                marginBottom: 12,
              }}
            >
              WHAT IF THE PLAYER DOES THE WRONG THING?
            </div>

            <p style={bodyStyle}>
              The important part of a queue is that the
              front represents the next expected operation.
            </p>

            <CodeBlock
              code={`const expected =
  recipeQueue.peek();

if (playerAction !== expected) {
  showWrongAction();
  return;
}

completeAction();
recipeQueue.dequeue();`}
            />

            <p style={bodyStyle}>
              The queue therefore gives the game a clear
              definition of what "next" means.
            </p>
          </div>
        </div>

        <InfoBox title="Why this is a genuine DSA implementation">
          The queue is not merely displayed for this
          presentation. It represents the ordered cooking
          actions the game needs to process. The front of
          the queue determines what should happen next.
        </InfoBox>

        <InfoBox
          title="One implementation detail"
          accent="#e67700"
        >
          The current JavaScript representation uses an
          array underneath. For a small eight-step recipe
          this is perfectly reasonable. A production queue
          implementation could avoid the O(n) behaviour
          associated with removing from the front of an
          array.
        </InfoBox>

        <InfoBox title="Why we are not claiming the other structures are used here">
          Sorting, trees and hashmaps are part of the DSA
          learning material and are demonstrated above with
          interactive visualizers. The current cooking-game
          implementation we are demonstrating here is the
          queue-based fried-rice workflow.
        </InfoBox>
      </>
    );
  };

  const renderNotes = () => (
    <>
      <SectionTitle
        eyebrow="08 • IMPLEMENTATION"
        title="DSA inside the Notes App"
        description="Undo and redo naturally map to stacks because edits need to be reversed in the opposite order from which they were created."
      />

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 18,
        }}
      >
        <div style={cardStyle}>
          <MiniBadge>STACK</MiniBadge>

          <h2 style={headingStyle}>
            Undo = POP
          </h2>

          <p style={bodyStyle}>
            Whenever the user makes a new edit, that
            operation can be placed on the undo stack.
            Undo removes the newest operation.
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

          <div
            style={{
              marginTop: 14,
              padding: 13,
              background: "#f2f8f4",
              borderLeft: "4px solid #2f9e44",
              color: "#526058",
              fontSize: 12,
              lineHeight: 1.7,
            }}
          >
            Most recent edit → top of stack
            <br />
            Undo → pop
            <br />
            Removed edit → redo stack
          </div>
        </div>

        <StackVisualizer />
      </div>

      <div
        style={{
          marginTop: 20,
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 18,
        }}
      >
        <div style={cardStyle}>
          <div style={labelStyle}>
            UNDO / REDO FLOW
          </div>

          <div
            style={{
              display: "grid",
              gap: 8,
              color: "#526058",
              fontSize: 12,
            }}
          >
            {[
              ["1", "User edits note"],
              ["2", "Previous state is pushed"],
              ["3", "User presses Undo"],
              ["4", "Undo stack is popped"],
              ["5", "Current state moves to Redo"],
              ["6", "Redo restores the operation"],
            ].map(([number, text]) => (
              <div
                key={number}
                style={{
                  display: "flex",
                  gap: 10,
                  alignItems: "center",
                }}
              >
                <div
                  style={{
                    width: 23,
                    height: 23,
                    background: "#e6f4ea",
                    color: "#238b45",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 800,
                    fontSize: 10,
                  }}
                >
                  {number}
                </div>

                {text}
              </div>
            ))}
          </div>
        </div>

        <div style={cardStyle}>
          <div style={labelStyle}>
            WHAT IF WE DID NOT USE A STACK?
          </div>

          <p style={bodyStyle}>
            We could keep a large list of previous states
            and manually decide which state should be
            restored next.
          </p>

          <p style={bodyStyle}>
            The stack gives us the rule automatically:
            the newest history entry is the first one to
            be removed.
          </p>

          <CodeBlock
            code={`history.push(newState);

const previous =
  history.pop();

restore(previous);`}
          />
        </div>
      </div>

      <InfoBox title="The bigger idea">
        We are not using a stack simply because the DSA
        assignment says "use a stack." Undo and redo have
        LIFO behaviour, so a stack is an appropriate model
        for the problem.
      </InfoBox>
    </>
  );

  const renderCurrent = () => {
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
   * SIDEBAR ITEM
   * =========================================================
   */

  const renderNavItem = (
    item: {
      id: Section;
      label: string;
      description: string;
    }
  ) => {
    const active = section === item.id;

    return (
      <button
        key={item.id}
        onClick={() => setSection(item.id)}
        style={{
          width: "100%",
          textAlign: "left",
          padding: "10px 13px",
          border: "none",
          borderLeft: active
            ? "3px solid #2f9e44"
            : "3px solid transparent",
          background: active
            ? "#eaf5ed"
            : "transparent",
          color: active
            ? "#1e7036"
            : "#58665e",
          cursor: "pointer",
          fontFamily: "Inter, sans-serif",
        }}
      >
        <div
          style={{
            fontSize: 12,
            fontWeight: active ? 800 : 650,
          }}
        >
          {item.label}
        </div>

        <div
          style={{
            marginTop: 3,
            fontSize: 9,
            lineHeight: 1.4,
            color: active
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
   * WINDOW
   * =========================================================
   */

  return (
    <div
      data-dsa-window
      onMouseDown={() => onFocus?.()}
      style={{
        position: "absolute",

        left:
          windowPosition.centered &&
            !hasMovedFromCenter
            ? "50%"
            : `${windowPosition.left}px`,

        top:
          windowPosition.centered &&
            !hasMovedFromCenter
            ? "50%"
            : `${windowPosition.top}px`,

        transform:
          windowPosition.centered &&
            !hasMovedFromCenter
            ? "translate(-50%, -50%)"
            : "none",

        width: `min(${WINDOW_WIDTH}px, calc(100vw - 20px))`,
        height: `min(${WINDOW_HEIGHT}px, calc(100vh - 60px))`,
        minWidth: 820,
        minHeight: 580,

        zIndex: windowPosition.zIndex,

        background: "#f6f8f7",
        border: "2px solid #202d25",
        borderRadius: 2,

        overflow: "hidden",

        display: "flex",
        flexDirection: "column",

        boxShadow:
          "0 18px 55px rgba(20, 35, 27, 0.20)",

        fontFamily: "Inter, sans-serif",
      }}
    >
      {/*
       * TITLE BAR
       */}

      <div
        onMouseDown={handleDragStart}
        style={{
          height: TITLE_BAR_HEIGHT,
          flex: "0 0 42px",

          display: "flex",
          alignItems: "center",

          padding: "0 10px 0 14px",

          background:
            "rgba(250, 252, 251, 0.82)",

          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",

          borderBottom:
            "1px solid rgba(42, 58, 49, 0.16)",

          cursor: isDragging
            ? "grabbing"
            : "grab",

          userSelect: "none",
        }}
      >
        <div
          style={{
            width: 8,
            height: 8,
            borderRadius: "50%",
            background: "#2f9e44",
            marginRight: 9,
          }}
        />

        <div
          style={{
            color: "#1d2921",
            fontSize: 12,
            fontWeight: 800,
            letterSpacing: "0.01em",
          }}
        >
          Sefirah — Data Structures Lab
        </div>

        <div
          style={{
            marginLeft: 9,
            color: "#89958d",
            fontSize: 9,
          }}
        >
          DSA visualizer
        </div>

        <div
          style={{
            marginLeft: "auto",
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          <button
            onMouseDown={(event) =>
              event.stopPropagation()
            }
            onClick={(event) => {
              event.stopPropagation();
              onClose?.();
            }}
            aria-label="Close DSA Lab"
            style={{
              width: 25,
              height: 25,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "none",
              background: "transparent",
              color: "#59665e",
              cursor: "pointer",
              fontSize: 18,
              lineHeight: 1,
            }}
          >
            ×
          </button>
        </div>
      </div>

      {/*
       * BODY
       */}

      <div
        style={{
          flex: 1,
          minHeight: 0,
          display: "grid",
          gridTemplateColumns: "218px minmax(0, 1fr)",
        }}
      >
        {/*
         * SIDEBAR
         */}

        <aside
          style={{
            background: "#fff",
            borderRight: "1px solid #dce5df",
            overflowY: "auto",
            overflowX: "hidden",
            paddingTop: 10,
          }}
        >
          <div
            style={{
              padding: "8px 13px 7px",
              color: "#89958d",
              fontSize: 9,
              fontWeight: 800,
              letterSpacing: "0.1em",
            }}
          >
            EXPLANATIONS
          </div>

          {explanationSections.map(
            renderNavItem
          )}

          <div
            style={{
              margin: "14px 13px 7px",
              height: 1,
              background: "#e1e7e3",
            }}
          />

          <div
            style={{
              padding: "8px 13px 7px",
              color: "#89958d",
              fontSize: 9,
              fontWeight: 800,
              letterSpacing: "0.1em",
            }}
          >
            IMPLEMENTATION
          </div>

          {implementationSections.map(
            renderNavItem
          )}

          <div
            style={{
              margin: "18px 13px 12px",
              padding: 10,
              background: "#f3f7f4",
              border: "1px solid #dce8df",
              color: "#728077",
              fontSize: 9,
              lineHeight: 1.55,
            }}
          >
            <strong
              style={{
                color: "#238b45",
              }}
            >
              PROJECT NOTE
            </strong>

            <br />

            The implementation pages show the
            structures actually used in Sefirah.
          </div>
        </aside>

        {/*
         * CONTENT
         */}

        <main
          style={{
            minWidth: 0,
            minHeight: 0,
            overflowY: "auto",
            overflowX: "hidden",
            background: "#f6f8f7",
          }}
        >
          <div
            style={{
              maxWidth: 950,
              margin: "0 auto",
              padding: "30px 32px 42px",
            }}
          >
            {renderCurrent()}

            {/*
             * BOTTOM NAVIGATION
             */}

            <div
              style={{
                marginTop: 30,
                paddingTop: 16,
                borderTop: "1px solid #dce5df",
                display: "flex",
                alignItems: "center",
              }}
            >
              <button
                disabled={currentIndex <= 0}
                onClick={goPrevious}
                style={{
                  padding: "8px 12px",
                  border: "1px solid #cfd9d3",
                  background: "#fff",
                  color: "#304037",
                  cursor:
                    currentIndex <= 0
                      ? "not-allowed"
                      : "pointer",
                  opacity:
                    currentIndex <= 0
                      ? 0.45
                      : 1,
                  fontWeight: 700,
                  fontSize: 11,
                }}
              >
                ← Previous
              </button>

              <div
                style={{
                  margin: "0 auto",
                  color: "#87938b",
                  fontSize: 10,
                }}
              >
                {currentIndex + 1} /{" "}
                {allSections.length}
              </div>

              <button
                disabled={
                  currentIndex >=
                  allSections.length - 1
                }
                onClick={goNext}
                style={{
                  padding: "8px 12px",
                  border: "1px solid #238b45",
                  background: "#238b45",
                  color: "#fff",
                  cursor:
                    currentIndex >=
                      allSections.length - 1
                      ? "not-allowed"
                      : "pointer",
                  opacity:
                    currentIndex >=
                      allSections.length - 1
                      ? 0.45
                      : 1,
                  fontWeight: 700,
                  fontSize: 11,
                }}
              >
                Next →
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

/*
 * =========================================================
 * SHARED STYLES
 * =========================================================
 */

const cardStyle: CSSProperties = {
  border: "1px solid #dce5df",
  background: "#fff",
  padding: 20,
};

const headingStyle: CSSProperties = {
  margin: "13px 0 9px",
  color: "#1d2921",
  fontSize: 18,
  fontWeight: 800,
  lineHeight: 1.25,
};

const bodyStyle: CSSProperties = {
  margin: "0 0 11px",
  color: "#59665e",
  fontSize: 13,
  lineHeight: 1.75,
};

const labelStyle: CSSProperties = {
  color: "#238b45",
  fontSize: 10,
  fontWeight: 800,
  letterSpacing: "0.08em",
  marginBottom: 12,
};