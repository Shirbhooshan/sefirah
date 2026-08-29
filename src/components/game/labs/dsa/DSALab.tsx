"use client";

import React, {
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

/* =========================================================
   TYPES
========================================================= */

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
  | "overview"
  | "bubble"
  | "quick"
  | "stack"
  | "queue"
  | "hashmap"
  | "tree"
  | "search"
  | "cooking"
  | "notes";

/* =========================================================
   DATA
========================================================= */

const topics: {
  id: Topic;
  label: string;
}[] = [
  { id: "overview", label: "DSA Overview" },
  { id: "bubble", label: "Bubble Sort" },
  { id: "quick", label: "Quick Sort" },
  { id: "stack", label: "Stack" },
  { id: "queue", label: "Queue" },
  { id: "hashmap", label: "HashMap" },
  { id: "tree", label: "Binary Tree" },
  { id: "search", label: "Searching" },
  { id: "cooking", label: "SEFIRAH — Cooking" },
  { id: "notes", label: "SEFIRAH — Notes" },
];

/* =========================================================
   CODE
========================================================= */

const bubbleCode = [
  "for (let i = 0; i < arr.length; i++) {",
  "  for (let j = 0; j < arr.length - i - 1; j++) {",
  "    if (arr[j] > arr[j + 1]) {",
  "      [arr[j], arr[j + 1]] =",
  "        [arr[j + 1], arr[j]];",
  "    }",
  "  }",
  "}",
];

const quickCode = [
  "function quickSort(arr, low, high) {",
  "  if (low >= high) return;",
  "",
  "  const pivot = arr[high];",
  "  let i = low;",
  "",
  "  for (let j = low; j < high; j++) {",
  "    if (arr[j] < pivot) {",
  "      swap(arr, i, j);",
  "      i++;",
  "    }",
  "  }",
  "",
  "  swap(arr, i, high);",
  "  quickSort(arr, low, i - 1);",
  "  quickSort(arr, i + 1, high);",
  "}",
];

const stackCode = [
  "const stack = [];",
  "",
  "stack.push(action);",
  "",
  "const latest = stack.pop();",
  "",
  "stack.push(newState);",
];

const queueCode = [
  "const queue = [];",
  "",
  "queue.push(nextAction);",
  "",
  "const action = queue.shift();",
  "",
  "process(action);",
];

const hashCode = [
  "const inventory = new Map();",
  "",
  "inventory.set(\"rice\", 2);",
  "inventory.set(\"egg\", 3);",
  "",
  "const amount = inventory.get(\"rice\");",
];

const treeCode = [
  "class Node {",
  "  constructor(value) {",
  "    this.value = value;",
  "    this.left = null;",
  "    this.right = null;",
  "  }",
  "}",
  "",
  "if (value < node.value)",
  "  node.left = insert(node.left, value);",
  "else",
  "  node.right = insert(node.right, value);",
];

const searchCode = [
  "let low = 0;",
  "let high = arr.length - 1;",
  "",
  "while (low <= high) {",
  "  const mid = Math.floor((low + high) / 2);",
  "",
  "  if (arr[mid] === target)",
  "    return mid;",
  "",
  "  if (arr[mid] < target)",
  "    low = mid + 1;",
  "  else",
  "    high = mid - 1;",
  "}",
];

/* =========================================================
   HELPERS
========================================================= */

function CodePanel({
  code,
  activeLine,
}: {
  code: string[];
  activeLine: number;
}) {
  return (
    <div className="code-panel">
      <div className="code-header">
        <span>IMPLEMENTATION</span>
        <span className="code-lang">TypeScript</span>
      </div>

      <div className="code-body">
        {code.map((line, index) => (
          <div
            key={index}
            className={`code-line ${
              index === activeLine ? "active" : ""
            }`}
          >
            <span className="line-number">
              {index + 1}
            </span>

            <code>{line || " "}</code>
          </div>
        ))}
      </div>
    </div>
  );
}

function SectionHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="section-header">
      <div className="eyebrow">{eyebrow}</div>
      <h1>{title}</h1>
      <p>{description}</p>
    </div>
  );
}

function Complexity({
  time,
  space,
}: {
  time: string;
  space: string;
}) {
  return (
    <div className="complexity-row">
      <div>
        <span>TIME</span>
        <strong>{time}</strong>
      </div>

      <div>
        <span>SPACE</span>
        <strong>{space}</strong>
      </div>
    </div>
  );
}

/* =========================================================
   BUBBLE SORT
========================================================= */

function BubbleSortVisualizer() {
  const original = [7, 2, 9, 4, 1, 6];

  const [values, setValues] =
    useState(original);

  const [i, setI] = useState(0);
  const [j, setJ] = useState(0);
  const [activeLine, setActiveLine] =
    useState(2);

  const [running, setRunning] =
    useState(false);

  const timer = useRef<NodeJS.Timeout | null>(
    null
  );

  const step = () => {
    setValues((previous) => {
      const next = [...previous];

      if (i >= next.length - 1) {
        return next;
      }

      if (
        j >=
        next.length - i - 1
      ) {
        setJ(0);
        setI((value) => value + 1);
        setActiveLine(0);
        return next;
      }

      setActiveLine(2);

      if (next[j] > next[j + 1]) {
        [next[j], next[j + 1]] = [
          next[j + 1],
          next[j],
        ];

        setActiveLine(3);
      }

      setJ((value) => value + 1);

      return next;
    });
  };

  const reset = () => {
    if (timer.current) {
      clearInterval(timer.current);
    }

    setValues(original);
    setI(0);
    setJ(0);
    setActiveLine(2);
    setRunning(false);
  };

  useEffect(() => {
    if (!running) return;

    timer.current = setInterval(() => {
      step();
    }, 650);

    return () => {
      if (timer.current) {
        clearInterval(timer.current);
      }
    };
  }, [running, i, j]);

  return (
    <VisualizerLayout
      title="Bubble Sort"
      subtitle="Repeatedly compare neighbouring values and swap them when they are in the wrong order."
      code={
        <CodePanel
          code={bubbleCode}
          activeLine={activeLine}
        />
      }
    >
      <div className="visualizer-card">
        <div className="visualizer-top">
          <div>
            <span className="mini-label">
              ARRAY
            </span>
            <strong>
              Compare → Swap → Repeat
            </strong>
          </div>

          <div className="step-info">
            i = {i} · j = {j}
          </div>
        </div>

        <div className="array-stage">
          {values.map((value, index) => {
            const isCurrent =
              index === j ||
              index === j + 1;

            return (
              <div
                key={`${index}-${value}`}
                className={`array-cell ${
                  isCurrent ? "array-active" : ""
                }`}
                style={{
                  height: `${55 + value * 16}px`,
                }}
              >
                <strong>{value}</strong>
                <small>[{index}]</small>
              </div>
            );
          })}
        </div>

        <div className="visualizer-message">
          {j < values.length - i - 1
            ? `Comparing ${values[j]} and ${
                values[j + 1]
              }`
            : "End of this pass"}
        </div>

        <VisualizerControls
          running={running}
          onRun={() => setRunning(true)}
          onPause={() => setRunning(false)}
          onStep={step}
          onReset={reset}
        />
      </div>
    </VisualizerLayout>
  );
}

/* =========================================================
   QUICK SORT
========================================================= */

function QuickSortVisualizer() {
  const initial = [8, 3, 7, 4, 9, 2, 6];

  const [values, setValues] =
    useState(initial);

  const [active, setActive] =
    useState<number[]>([]);

  const [pivot, setPivot] =
    useState<number | null>(null);

  const [message, setMessage] =
    useState(
      "Choose the last element as the pivot."
    );

  const [running, setRunning] =
    useState(false);

  const [activeLine, setActiveLine] =
    useState(3);

  const reset = () => {
    setValues(initial);
    setActive([]);
    setPivot(null);
    setMessage(
      "Choose the last element as the pivot."
    );
    setRunning(false);
    setActiveLine(3);
  };

  const runDemo = () => {
    if (running) return;

    setRunning(true);

    let array = [...initial];

    const pivotValue =
      array[array.length - 1];

    setPivot(pivotValue);
    setActiveLine(3);
    setMessage(
      `Pivot selected: ${pivotValue}`
    );

    setTimeout(() => {
      setActive([0, 1, 2, 3, 4]);

      setActiveLine(7);

      setMessage(
        `Elements smaller than ${pivotValue} move to the left.`
      );
    }, 800);

    setTimeout(() => {
      array = [3, 4, 2, 6, 7, 8, 9];

      setValues(array);
      setActive([0, 1, 2, 3, 4, 5]);

      setActiveLine(13);

      setMessage(
        "Pivot is now in its final position."
      );
    }, 1700);

    setTimeout(() => {
      setActive([]);
      setPivot(null);
      setMessage(
        "Quick Sort recursively sorts the left and right partitions."
      );
      setActiveLine(14);
      setRunning(false);
    }, 2600);
  };

  return (
    <VisualizerLayout
      title="Quick Sort"
      subtitle="Partition the array around a pivot, then recursively sort the smaller partitions."
      code={
        <CodePanel
          code={quickCode}
          activeLine={activeLine}
        />
      }
    >
      <div className="visualizer-card">
        <div className="visualizer-top">
          <div>
            <span className="mini-label">
              PARTITION
            </span>
            <strong>
              Divide the problem
            </strong>
          </div>

          {pivot !== null && (
            <div className="pivot-badge">
              PIVOT {pivot}
            </div>
          )}
        </div>

        <div className="quick-stage">
          {values.map((value, index) => (
            <div
              key={index}
              className={`quick-cell ${
                active.includes(index)
                  ? "quick-active"
                  : ""
              } ${
                value === pivot
                  ? "quick-pivot"
                  : ""
              }`}
            >
              <strong>{value}</strong>
              <span>{index}</span>
            </div>
          ))}
        </div>

        <div className="partition-line">
          <span>LOWER VALUES</span>
          <div />
          <span>HIGHER VALUES</span>
        </div>

        <p className="visualizer-message">
          {message}
        </p>

        <VisualizerControls
          running={running}
          onRun={runDemo}
          onPause={() => setRunning(false)}
          onStep={runDemo}
          onReset={reset}
        />
      </div>
    </VisualizerLayout>
  );
}

/* =========================================================
   STACK
========================================================= */

function StackVisualizer() {
  const [items, setItems] =
    useState([
      "Open Notes",
      "Type text",
      "Bold text",
    ]);

  const [activeLine, setActiveLine] =
    useState(2);

  const push = () => {
    setItems((previous) => [
      ...previous,
      "New State",
    ]);

    setActiveLine(2);
  };

  const pop = () => {
    setItems((previous) =>
      previous.length
        ? previous.slice(0, -1)
        : previous
    );

    setActiveLine(4);
  };

  const reset = () => {
    setItems([
      "Open Notes",
      "Type text",
      "Bold text",
    ]);

    setActiveLine(2);
  };

  return (
    <VisualizerLayout
      title="Stack"
      subtitle="A stack follows LIFO: Last In, First Out."
      code={
        <CodePanel
          code={stackCode}
          activeLine={activeLine}
        />
      }
    >
      <div className="visualizer-card stack-card">
        <div className="stack-explanation">
          <div className="stack-rule">
            <strong>LIFO</strong>
            <span>
              The newest state is the first one
              removed.
            </span>
          </div>
        </div>

        <div className="stack-stage">
          <div className="stack-label">
            TOP
          </div>

          <div className="stack-container">
            {[...items]
              .reverse()
              .map((item, index) => (
                <div
                  key={`${item}-${index}`}
                  className={`stack-item ${
                    index === 0
                      ? "stack-top"
                      : ""
                  }`}
                >
                  <span>
                    {index === 0
                      ? "LATEST"
                      : ""}
                  </span>
                  {item}
                </div>
              ))}
          </div>

          <div className="stack-base">
            STACK
          </div>
        </div>

        <div className="stack-actions">
          <button onClick={push}>
            PUSH STATE
          </button>

          <button onClick={pop}>
            POP / UNDO
          </button>

          <button
            className="secondary"
            onClick={reset}
          >
            RESET
          </button>
        </div>
      </div>
    </VisualizerLayout>
  );
}

/* =========================================================
   QUEUE
========================================================= */

function QueueVisualizer() {
  const [items, setItems] =
    useState([
      "Oil",
      "Garlic",
      "Carrot",
      "Rice",
    ]);

  const enqueue = () => {
    setItems((previous) => [
      ...previous,
      "Egg",
    ]);
  };

  const dequeue = () => {
    setItems((previous) =>
      previous.slice(1)
    );
  };

  return (
    <VisualizerLayout
      title="Queue"
      subtitle="A queue follows FIFO: First In, First Out."
      code={
        <CodePanel
          code={queueCode}
          activeLine={2}
        />
      }
    >
      <div className="visualizer-card">
        <div className="queue-direction">
          <span>FRONT</span>
          <div className="arrow-line" />
          <span>BACK</span>
        </div>

        <div className="queue-stage">
          {items.map((item, index) => (
            <div
              className={`queue-item ${
                index === 0
                  ? "queue-front"
                  : ""
              }`}
              key={`${item}-${index}`}
            >
              <span>
                {index === 0
                  ? "NEXT"
                  : index + 1}
              </span>
              {item}
            </div>
          ))}
        </div>

        <p className="visualizer-message">
          The action at the front is processed
          first.
        </p>

        <div className="stack-actions">
          <button onClick={enqueue}>
            ENQUEUE
          </button>

          <button onClick={dequeue}>
            DEQUEUE
          </button>
        </div>
      </div>
    </VisualizerLayout>
  );
}

/* =========================================================
   HASH MAP
========================================================= */

function HashMapVisualizer() {
  const ingredients = [
    {
      name: "rice",
      amount: 2,
      icon: riceIcon.src,
    },
    {
      name: "egg",
      amount: 3,
      icon: eggIcon.src,
    },
    {
      name: "carrot",
      amount: 1,
      icon: carrotIcon.src,
    },
    {
      name: "soy sauce",
      amount: 1,
      icon: soyIcon.src,
    },
  ];

  const [selected, setSelected] =
    useState("rice");

  const selectedIngredient =
    ingredients.find(
      (item) => item.name === selected
    );

  return (
    <VisualizerLayout
      title="HashMap"
      subtitle="Store values by a key so the program can retrieve the information directly."
      code={
        <CodePanel
          code={hashCode}
          activeLine={5}
        />
      }
    >
      <div className="visualizer-card">
        <div className="hash-layout">
          <div className="hash-buckets">
            {ingredients.map(
              (ingredient, index) => (
                <button
                  key={ingredient.name}
                  className={`hash-bucket ${
                    selected === ingredient.name
                      ? "selected"
                      : ""
                  }`}
                  onClick={() =>
                    setSelected(
                      ingredient.name
                    )
                  }
                >
                  <span>
                    bucket {index}
                  </span>

                  <img
                    src={ingredient.icon}
                    alt=""
                  />

                  <strong>
                    {ingredient.name}
                  </strong>

                  <small>
                    quantity:{" "}
                    {ingredient.amount}
                  </small>
                </button>
              )
            )}
          </div>

          <div className="hash-result">
            <span>GET(KEY)</span>

            <strong>
              inventory.get(
              <br />
              "{selected}"
              )
            </strong>

            <div className="hash-arrow">
              ↓
            </div>

            <div className="hash-value">
              {selectedIngredient?.amount ??
                0}
            </div>

            <p>
              One key gives us the required
              inventory value without scanning
              every ingredient.
            </p>
          </div>
        </div>
      </div>
    </VisualizerLayout>
  );
}

/* =========================================================
   TREE
========================================================= */

function TreeNode({
  value,
  x,
  y,
  active,
}: {
  value: number;
  x: number;
  y: number;
  active?: boolean;
}) {
  return (
    <g>
      <circle
        cx={x}
        cy={y}
        r="28"
        className={
          active
            ? "svg-node active"
            : "svg-node"
        }
      />

      <text
        x={x}
        y={y + 6}
        textAnchor="middle"
        className="svg-node-text"
      >
        {value}
      </text>
    </g>
  );
}

function TreeVisualizer() {
  const [target, setTarget] =
    useState(7);

  const [active, setActive] =
    useState<number[]>([]);

  const run = () => {
    setActive([]);

    setTimeout(
      () => setActive([8]),
      250
    );

    setTimeout(
      () => setActive([8, 5]),
      800
    );

    setTimeout(
      () => setActive([8, 5, 7]),
      1350
    );
  };

  return (
    <VisualizerLayout
      title="Binary Search Tree"
      subtitle="A tree organizes data hierarchically. In a BST, smaller values go left and larger values go right."
      code={
        <CodePanel
          code={treeCode}
          activeLine={8}
        />
      }
    >
      <div className="visualizer-card tree-card">
        <div className="tree-target">
          Searching for:
          <strong>{target}</strong>
        </div>

        <svg
          viewBox="0 0 620 370"
          className="tree-svg"
        >
          <line
            x1="310"
            y1="85"
            x2="170"
            y2="175"
            className="tree-edge"
          />

          <line
            x1="310"
            y1="85"
            x2="450"
            y2="175"
            className="tree-edge"
          />

          <line
            x1="170"
            y1="175"
            x2="100"
            y2="275"
            className="tree-edge"
          />

          <line
            x1="170"
            y1="175"
            x2="240"
            y2="275"
            className="tree-edge"
          />

          <line
            x1="450"
            y1="175"
            x2="380"
            y2="275"
            className="tree-edge"
          />

          <line
            x1="450"
            y1="175"
            x2="520"
            y2="275"
            className="tree-edge"
          />

          <TreeNode
            value={8}
            x={310}
            y={85}
            active={active.includes(8)}
          />

          <TreeNode
            value={5}
            x={170}
            y={175}
            active={active.includes(5)}
          />

          <TreeNode
            value={12}
            x={450}
            y={175}
          />

          <TreeNode
            value={3}
            x={100}
            y={275}
          />

          <TreeNode
            value={7}
            x={240}
            y={275}
            active={active.includes(7)}
          />

          <TreeNode
            value={10}
            x={380}
            y={275}
          />

          <TreeNode
            value={15}
            x={520}
            y={275}
          />
        </svg>

        <button
          className="run-large"
          onClick={run}
        >
          SEARCH FOR {target}
        </button>
      </div>
    </VisualizerLayout>
  );
}

/* =========================================================
   BINARY SEARCH
========================================================= */

function SearchVisualizer() {
  const values = [
    2, 5, 8, 11, 15, 19, 24, 31,
  ];

  const [target, setTarget] =
    useState(19);

  const [low, setLow] =
    useState(0);

  const [high, setHigh] =
    useState(values.length - 1);

  const [mid, setMid] =
    useState(
      Math.floor(
        (0 + values.length - 1) / 2
      )
    );

  const [message, setMessage] =
    useState(
      "Check the middle element."
    );

  const step = () => {
    const middle = Math.floor(
      (low + high) / 2
    );

    setMid(middle);

    if (values[middle] === target) {
      setMessage(
        `Found ${target} at index ${middle}.`
      );
      return;
    }

    if (values[middle] < target) {
      setLow(middle + 1);
      setMessage(
        `${values[middle]} is too small → search right.`
      );
    } else {
      setHigh(middle - 1);
      setMessage(
        `${values[middle]} is too large → search left.`
      );
    }
  };

  const reset = () => {
    setLow(0);
    setHigh(values.length - 1);
    setMid(3);
    setMessage(
      "Check the middle element."
    );
  };

  return (
    <VisualizerLayout
      title="Binary Search"
      subtitle="Instead of checking every item, repeatedly eliminate half of the search space."
      code={
        <CodePanel
          code={searchCode}
          activeLine={4}
        />
      }
    >
      <div className="visualizer-card">
        <div className="search-input">
          <span>TARGET</span>

          <input
            type="number"
            value={target}
            onChange={(event) =>
              setTarget(
                Number(event.target.value)
              )
            }
          />
        </div>

        <div className="search-array">
          {values.map((value, index) => {
            const eliminated =
              index < low ||
              index > high;

            return (
              <div
                key={value}
                className={`search-cell ${
                  index === mid
                    ? "search-mid"
                    : ""
                } ${
                  eliminated
                    ? "search-eliminated"
                    : ""
                }`}
              >
                <strong>{value}</strong>
                <small>{index}</small>
              </div>
            );
          })}
        </div>

        <div className="search-range">
          low = {low} · mid = {mid} · high =
          {high}
        </div>

        <p className="visualizer-message">
          {message}
        </p>

        <VisualizerControls
          running={false}
          onRun={step}
          onPause={() => {}}
          onStep={step}
          onReset={reset}
        />
      </div>
    </VisualizerLayout>
  );
}

/* =========================================================
   VISUALIZER LAYOUT
========================================================= */

function VisualizerLayout({
  title,
  subtitle,
  code,
  children,
}: {
  title: string;
  subtitle: string;
  code: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="topic-intro">
        <h2>{title}</h2>
        <p>{subtitle}</p>
      </div>

      <div className="split-layout">
        <div>{code}</div>

        <div>{children}</div>
      </div>
    </div>
  );
}

function VisualizerControls({
  running,
  onRun,
  onPause,
  onStep,
  onReset,
}: {
  running: boolean;
  onRun: () => void;
  onPause: () => void;
  onStep: () => void;
  onReset: () => void;
}) {
  return (
    <div className="visualizer-controls">
      {!running ? (
        <button onClick={onRun}>
          ▶ RUN
        </button>
      ) : (
        <button onClick={onPause}>
          ❚❚ PAUSE
        </button>
      )}

      <button
        className="secondary"
        onClick={onStep}
      >
        STEP
      </button>

      <button
        className="secondary"
        onClick={onReset}
      >
        RESET
      </button>
    </div>
  );
}

/* =========================================================
   OVERVIEW
========================================================= */

function Overview() {
  return (
    <div>
      <SectionHeader
        eyebrow="DATA STRUCTURES & ALGORITHMS"
        title="Why DSA exists"
        description="Algorithms tell the computer what to do. Data structures determine how the information needed by those algorithms is organized."
      />

      <div className="overview-grid">
        <article>
          <span>01</span>
          <h3>Organize</h3>
          <p>
            Arrays, stacks, queues, maps and trees
            give our programs predictable ways to
            store information.
          </p>
        </article>

        <article>
          <span>02</span>
          <h3>Search</h3>
          <p>
            Good structures prevent unnecessary
            scanning. A HashMap can retrieve a
            value directly using a key.
          </p>
        </article>

        <article>
          <span>03</span>
          <h3>Process</h3>
          <p>
            Queues control order. Stacks control
            history. Algorithms control how that
            information is processed.
          </p>
        </article>

        <article>
          <span>04</span>
          <h3>Scale</h3>
          <p>
            Code that works with ten objects can
            behave very differently with ten
            thousand.
          </p>
        </article>
      </div>

      <div className="what-if">
        <div>
          <span className="danger-label">
            WITHOUT DSA
          </span>

          <h3>
            Everything becomes a search,
            scan or pile of special cases.
          </h3>
        </div>

        <p>
          Imagine storing every ingredient as a
          separate variable, scanning every
          ingredient every time the player drops
          something, and keeping undo history in
          unrelated variables. It might work for a
          tiny demo — but it becomes difficult to
          maintain and increasingly expensive as
          the application grows.
        </p>
      </div>
    </div>
  );
}

/* =========================================================
   COOKING GAME
========================================================= */

function CookingGameDSA() {
  const [demo, setDemo] =
    useState<
      "queue" | "inventory" | "state"
    >("queue");

  const [queue, setQueue] =
    useState([
      {
        name: "Oil",
        icon: oilIcon.src,
      },
      {
        name: "Garlic",
        icon: garlicIcon.src,
      },
      {
        name: "Carrot",
        icon: carrotIcon.src,
      },
      {
        name: "Rice",
        icon: riceIcon.src,
      },
      {
        name: "Egg",
        icon: eggIcon.src,
      },
      {
        name: "Soy Sauce",
        icon: soyIcon.src,
      },
      {
        name: "Green Onion",
        icon: greenOnionIcon.src,
      },
    ]);

  const processNext = () => {
    setQueue((previous) =>
      previous.length > 1
        ? previous.slice(1)
        : previous
    );
  };

  const stateStages = [
    "idle",
    "oil",
    "garlic",
    "carrot",
    "rice",
    "egg",
    "soy",
    "green onion",
    "stirring",
    "ready",
  ];

  const [stateIndex, setStateIndex] =
    useState(0);

  return (
    <div>
      <SectionHeader
        eyebrow="APPLICATION OF DSA"
        title="DSA inside the SEFIRAH Cooking Game"
        description="The cooking game is not just a collection of buttons. Its recipe flow, inventory and cooking progression can all be represented using familiar data structures."
      />

      <div className="application-tabs">
        <button
          className={
            demo === "queue"
              ? "active"
              : ""
          }
          onClick={() =>
            setDemo("queue")
          }
        >
          RECIPE QUEUE
        </button>

        <button
          className={
            demo === "inventory"
              ? "active"
              : ""
          }
          onClick={() =>
            setDemo("inventory")
          }
        >
          INVENTORY MAP
        </button>

        <button
          className={
            demo === "state"
              ? "active"
              : ""
          }
          onClick={() =>
            setDemo("state")
          }
        >
          COOKING STATE
        </button>
      </div>

      {demo === "queue" && (
        <div className="application-panel">
          <div className="application-code">
            <CodePanel
              code={[
                "const queue = new CookingQueue();",
                "",
                "queue.enqueue(\"oil\");",
                "queue.enqueue(\"garlic\");",
                "queue.enqueue(\"rice\");",
                "",
                "const next = queue.peek();",
                "queue.dequeue();",
              ]}
              activeLine={6}
            />

            <div className="application-explanation">
              <h3>
                The recipe behaves like a Queue
              </h3>

              <p>
                The player shouldn't be allowed to
                add random ingredients whenever they
                want. The recipe defines an order.
              </p>

              <p>
                Our queue keeps the next valid
                cooking action at the front.
              </p>

              <div className="logic-flow">
                <span>Recipe</span>
                <b>→</b>
                <span>Queue</span>
                <b>→</b>
                <span>peek()</span>
                <b>→</b>
                <span>Player Action</span>
              </div>
            </div>
          </div>

          <div className="application-visual">
            <div className="visual-title">
              <span>LIVE RECIPE QUEUE</span>

              <button
                onClick={processNext}
              >
                PROCESS NEXT
              </button>
            </div>

            <div className="ingredient-queue">
              {queue.map(
                (ingredient, index) => (
                  <div
                    className={`ingredient-card ${
                      index === 0
                        ? "ingredient-next"
                        : ""
                    }`}
                    key={ingredient.name}
                  >
                    <img
                      src={ingredient.icon}
                      alt=""
                    />

                    <strong>
                      {ingredient.name}
                    </strong>

                    {index === 0 && (
                      <small>
                        NEXT ACTION
                      </small>
                    )}
                  </div>
                )
              )}
            </div>

            <div className="application-note">
              <strong>
                Why this matters:
              </strong>

              <span>
                Without a queue, every possible
                ingredient combination would have
                to be checked manually.
              </span>
            </div>
          </div>
        </div>
      )}

      {demo === "inventory" && (
        <div className="application-panel">
          <div className="application-code">
            <CodePanel
              code={[
                "const inventory = new Map();",
                "",
                "inventory.set(\"rice\", 2);",
                "inventory.set(\"egg\", 3);",
                "inventory.set(\"oil\", 1);",
                "",
                "inventory.get(\"rice\");",
              ]}
              activeLine={6}
            />

            <div className="application-explanation">
              <h3>
                Inventory is naturally key-based
              </h3>

              <p>
                Every ingredient has a name and a
                quantity. A map lets the program
                connect the two directly.
              </p>

              <p>
                Instead of asking "is this rice?
                is this egg? is this oil?" over and
                over, the ingredient name becomes the
                key.
              </p>

              <div className="logic-flow">
                <span>"rice"</span>
                <b>→</b>
                <span>HashMap</span>
                <b>→</b>
                <span>2 units</span>
              </div>
            </div>
          </div>

          <div className="application-visual">
            <div className="visual-title">
              <span>
                SEFIRAH INVENTORY
              </span>
            </div>

            <div className="inventory-grid">
              {[
                [
                  "rice",
                  riceIcon.src,
                  2,
                ],
                [
                  "egg",
                  eggIcon.src,
                  3,
                ],
                [
                  "oil",
                  oilIcon.src,
                  1,
                ],
                [
                  "garlic",
                  garlicIcon.src,
                  1,
                ],
                [
                  "carrot",
                  carrotIcon.src,
                  1,
                ],
                [
                  "soy sauce",
                  soyIcon.src,
                  1,
                ],
              ].map(
                ([name, icon, amount]) => (
                  <div
                    className="inventory-card"
                    key={name as string}
                  >
                    <img
                      src={icon as string}
                      alt=""
                    />

                    <div>
                      <strong>
                        {name}
                      </strong>

                      <span>
                        quantity: {amount}
                      </span>
                    </div>
                  </div>
                )
              )}
            </div>

            <div className="application-note">
              <strong>
                What if we didn't use a Map?
              </strong>

              <span>
                We could scan an array of ingredients
                each time. As inventory grows, that
                means more unnecessary comparisons.
              </span>
            </div>
          </div>
        </div>
      )}

      {demo === "state" && (
        <div className="application-panel">
          <div className="application-code">
            <CodePanel
              code={[
                "switch (action) {",
                "  case \"rice\":",
                "    stage = \"rice\";",
                "    break;",
                "",
                "  case \"egg\":",
                "    stage = \"egg\";",
                "    break;",
                "",
                "  case \"stir\":",
                "    stage = \"stirring\";",
                "}",
              ]}
              activeLine={
                Math.min(
                  stateIndex + 1,
                  11
                )
              }
            />

            <div className="application-explanation">
              <h3>
                Cooking is a state progression
              </h3>

              <p>
                At any moment the pan has a known
                state. That state determines what
                actions are legal next.
              </p>

              <p>
                This prevents impossible actions such
                as adding rice before oil or plating
                before the food is finished.
              </p>

              <div className="logic-flow">
                <span>Current State</span>
                <b>→</b>
                <span>Action</span>
                <b>→</b>
                <span>Next State</span>
              </div>
            </div>
          </div>

          <div className="application-visual">
            <div className="state-track">
              {stateStages.map(
                (stage, index) => (
                  <div
                    key={stage}
                    className={`state-node ${
                      index === stateIndex
                        ? "current"
                        : ""
                    } ${
                      index < stateIndex
                        ? "completed"
                        : ""
                    }`}
                  >
                    <span>
                      {index + 1}
                    </span>
                    <strong>
                      {stage}
                    </strong>
                  </div>
                )
              )}
            </div>

            <button
              className="run-large"
              onClick={() =>
                setStateIndex(
                  (value) =>
                    value <
                    stateStages.length - 1
                      ? value + 1
                      : 0
                )
              }
            >
              ADVANCE COOKING STATE
            </button>

            <div className="application-note">
              <strong>
                What can go wrong without states?
              </strong>

              <span>
                The player could perform actions in
                the wrong order, producing invalid
                game states and inconsistent UI.
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* =========================================================
   NOTES APP
========================================================= */

function NotesDSA() {
  const [history, setHistory] =
    useState([
      "Untitled",
      "My Notes",
      "My Notes — edited",
    ]);

  const [current, setCurrent] =
    useState(2);

  const undo = () => {
    setCurrent((value) =>
      Math.max(0, value - 1)
    );
  };

  const redo = () => {
    setCurrent((value) =>
      Math.min(
        history.length - 1,
        value + 1
      )
    );
  };

  return (
    <div>
      <SectionHeader
        eyebrow="APPLICATION OF DSA"
        title="Stack in the SEFIRAH Notes App"
        description="Undo and redo are a natural example of stack-based history. The most recent editor state is the first state that should be reversed."
      />

      <div className="application-panel notes-panel">
        <div className="application-code">
          <CodePanel
            code={[
              "undoStack.push(currentState);",
              "",
              "function undo() {",
              "  const previous =",
              "    undoStack.pop();",
              "  restore(previous);",
              "}",
              "",
              "redoStack.push(currentState);",
            ]}
            activeLine={4}
          />

          <div className="application-explanation">
            <h3>
              Why a Stack?
            </h3>

            <p>
              If the user types three changes, the
              third change must be undone first.
            </p>

            <p>
              That is exactly LIFO:
              <strong>
                {" "}Last In, First Out.
              </strong>
            </p>

            <div className="what-if-small">
              Without a stack, undo would require
              manually tracking which change happened
              most recently and how to restore it.
            </div>
          </div>
        </div>

        <div className="notes-visual">
          <div className="notes-editor">
            <div className="notes-toolbar">
              <b>B</b>
              <i>I</i>
              <span>S</span>

              <div />

              <button onClick={undo}>
                ↶
              </button>

              <button onClick={redo}>
                ↷
              </button>
            </div>

            <div className="notes-content">
              <small>
                CURRENT DOCUMENT
              </small>

              <h3>
                {history[current]}
              </h3>

              <p>
                This is the current state of the
                Notes document.
              </p>
            </div>
          </div>

          <div className="history-stack">
            <span>UNDO STACK</span>

            {[...history]
              .slice(0, current + 1)
              .reverse()
              .map((item, index) => (
                <div
                  className={`history-item ${
                    index === 0
                      ? "latest"
                      : ""
                  }`}
                  key={`${item}-${index}`}
                >
                  {index === 0 && (
                    <small>
                      POP FIRST
                    </small>
                  )}

                  {item}
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   MAIN COMPONENT
========================================================= */

export default function DSALab({
  onClose,
  onFocus,
  onMove,
  windowPosition,
}: DSALabProps) {
  const [topic, setTopic] =
    useState<Topic>("overview");

  const dragState =
    useRef<{
      dragging: boolean;
      offsetX: number;
      offsetY: number;
    }>({
      dragging: false,
      offsetX: 0,
      offsetY: 0,
    });

  const handlePointerDown = (
    event: React.PointerEvent<HTMLDivElement>
  ) => {
    if (
      (event.target as HTMLElement).closest(
        "button"
      )
    ) {
      return;
    }

    onFocus();

    const currentTarget =
      event.currentTarget.parentElement;

    if (!currentTarget) return;

    const rect =
      currentTarget.getBoundingClientRect();

    dragState.current = {
      dragging: true,
      offsetX:
        event.clientX - rect.left,
      offsetY:
        event.clientY - rect.top,
    };

    (
      event.currentTarget as HTMLElement
    ).setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (
    event: React.PointerEvent<HTMLDivElement>
  ) => {
    if (!dragState.current.dragging) {
      return;
    }

    onMove(
      event.clientX -
        dragState.current.offsetX,
      event.clientY -
        dragState.current.offsetY
    );
  };

  const handlePointerUp = (
    event: React.PointerEvent<HTMLDivElement>
  ) => {
    dragState.current.dragging = false;

    try {
      (
        event.currentTarget as HTMLElement
      ).releasePointerCapture(
        event.pointerId
      );
    } catch {}
  };

  const renderTopic = () => {
    switch (topic) {
      case "bubble":
        return (
          <>
            <SectionHeader
              eyebrow="ALGORITHM"
              title="Bubble Sort"
              description="A simple sorting algorithm that repeatedly compares neighbouring values and swaps them when necessary."
            />

            <Complexity
              time="O(n²)"
              space="O(1)"
            />

            <BubbleSortVisualizer />
          </>
        );

      case "quick":
        return (
          <>
            <SectionHeader
              eyebrow="ALGORITHM"
              title="Quick Sort"
              description="Quick Sort chooses a pivot, partitions the array and recursively sorts the resulting sections."
            />

            <Complexity
              time="O(n log n) average"
              space="O(log n)"
            />

            <QuickSortVisualizer />
          </>
        );

      case "stack":
        return (
          <>
            <SectionHeader
              eyebrow="DATA STRUCTURE"
              title="Stack"
              description="A LIFO structure. The latest item added is the first item removed."
            />

            <Complexity
              time="O(1) push/pop"
              space="O(n)"
            />

            <StackVisualizer />
          </>
        );

      case "queue":
        return (
          <>
            <SectionHeader
              eyebrow="DATA STRUCTURE"
              title="Queue"
              description="A FIFO structure. The first item added is the first item processed."
            />

            <Complexity
              time="O(1) enqueue"
              space="O(n)"
            />

            <QueueVisualizer />
          </>
        );

      case "hashmap":
        return (
          <>
            <SectionHeader
              eyebrow="DATA STRUCTURE"
              title="HashMap"
              description="Associate a key with a value so the program can retrieve information efficiently."
            />

            <Complexity
              time="O(1) average lookup"
              space="O(n)"
            />

            <HashMapVisualizer />
          </>
        );

      case "tree":
        return (
          <>
            <SectionHeader
              eyebrow="DATA STRUCTURE"
              title="Binary Search Tree"
              description="A hierarchical structure where smaller values move left and larger values move right."
            />

            <Complexity
              time="O(log n) average search"
              space="O(n)"
            />

            <TreeVisualizer />
          </>
        );

      case "search":
        return (
          <>
            <SectionHeader
              eyebrow="ALGORITHM"
              title="Searching"
              description="Binary Search uses an ordered dataset to eliminate half of the remaining possibilities after each comparison."
            />

            <Complexity
              time="O(log n)"
              space="O(1)"
            />

            <SearchVisualizer />
          </>
        );

      case "cooking":
        return <CookingGameDSA />;

      case "notes":
        return <NotesDSA />;

      case "overview":
      default:
        return <Overview />;
    }
  };

  return (
    <div
      className="dsa-window"
      style={{
        position: "absolute",
        left: windowPosition.centered
          ? "50%"
          : windowPosition.left,
        top: windowPosition.centered
          ? "50%"
          : windowPosition.top,
        transform:
          windowPosition.centered
            ? "translate(-50%, -50%)"
            : "none",
        zIndex: windowPosition.zIndex,
      }}
      onMouseDown={onFocus}
    >
      {/* =====================================================
          TITLE BAR
      ===================================================== */}

      <div
        className="dsa-titlebar"
        onPointerDown={
          handlePointerDown
        }
        onPointerMove={
          handlePointerMove
        }
        onPointerUp={
          handlePointerUp
        }
      >
        <div className="window-title">
          <span className="window-mark">
            DS
          </span>

          <strong>
            Data Structures & Algorithms
          </strong>
        </div>

        <button
          className="window-close"
          onClick={onClose}
          aria-label="Close"
        >
          ×
        </button>
      </div>

      {/* =====================================================
          TOPIC NAVIGATION
      ===================================================== */}

      <div className="dsa-nav">
        {topics.map((item) => (
          <button
            key={item.id}
            className={
              topic === item.id
                ? "active"
                : ""
            }
            onClick={() =>
              setTopic(item.id)
            }
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* =====================================================
          CONTENT
      ===================================================== */}

      <div className="dsa-content">
        {renderTopic()}
      </div>

      {/* =====================================================
          STYLES
      ===================================================== */}

      <style jsx>{`
        @import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap");

        * {
          box-sizing: border-box;
        }

        .dsa-window {
          width: min(1220px, 94vw);
          height: min(820px, 88vh);

          background: #ffffff;

          border: 1px solid #c8d2ca;
          border-radius: 2px;

          box-shadow:
            0 24px 70px rgba(0, 0, 0, 0.32),
            0 4px 15px rgba(0, 0, 0, 0.15);

          overflow: hidden;

          display: flex;
          flex-direction: column;

          font-family:
            "Inter",
            Arial,
            sans-serif;

          color: #202124;
        }

        /* =====================================================
           TITLE BAR
        ===================================================== */

        .dsa-titlebar {
          height: 46px;
          min-height: 46px;

          display: flex;
          align-items: center;
          justify-content: space-between;

          padding: 0 12px 0 16px;

          background:
            rgba(255, 255, 255, 0.76);

          backdrop-filter: blur(18px);
          -webkit-backdrop-filter: blur(18px);

          border-bottom:
            1px solid rgba(0, 0, 0, 0.1);

          cursor: grab;

          user-select: none;
          touch-action: none;
        }

        .dsa-titlebar:active {
          cursor: grabbing;
        }

        .window-title {
          display: flex;
          align-items: center;
          gap: 10px;

          font-size: 13px;
          letter-spacing: -0.01em;
        }

        .window-mark {
          width: 25px;
          height: 25px;

          display: grid;
          place-items: center;

          background: #138a3d;
          color: white;

          font-size: 10px;
          font-weight: 800;

          border-radius: 2px;
        }

        .window-close {
          width: 30px;
          height: 30px;

          border: 0;
          background: transparent;

          color: #444;

          font-size: 22px;
          line-height: 1;

          cursor: pointer;

          border-radius: 2px;
        }

        .window-close:hover {
          background: #d93025;
          color: white;
        }

        /* =====================================================
           NAV
        ===================================================== */

        .dsa-nav {
          min-height: 48px;

          display: flex;
          align-items: stretch;

          gap: 0;

          overflow-x: auto;
          overflow-y: hidden;

          background: #f7f8f7;

          border-bottom:
            1px solid #dce2dd;

          scrollbar-width: thin;
        }

        .dsa-nav button {
          flex: 0 0 auto;

          padding:
            0 17px;

          border: 0;

          border-right:
            1px solid #e2e6e3;

          background: transparent;

          color: #454a46;

          font-family: inherit;
          font-size: 12px;
          font-weight: 600;

          cursor: pointer;

          white-space: nowrap;

          transition:
            background 120ms ease,
            color 120ms ease;
        }

        .dsa-nav button:hover {
          background: #edf5ef;
          color: #138a3d;
        }

        .dsa-nav button.active {
          background: #138a3d;
          color: white;
        }

        /* =====================================================
           CONTENT
        ===================================================== */

        .dsa-content {
          flex: 1;

          overflow-y: auto;
          overflow-x: hidden;

          padding: 34px 38px 80px;

          background: #ffffff;
        }

        .section-header {
          max-width: 900px;
          margin-bottom: 24px;
        }

        .eyebrow {
          color: #138a3d;

          font-size: 11px;
          font-weight: 800;

          letter-spacing: 0.12em;

          margin-bottom: 7px;
        }

        .section-header h1 {
          margin: 0;

          color: #171a18;

          font-size: 31px;
          line-height: 1.12;

          letter-spacing: -0.035em;
        }

        .section-header p {
          max-width: 780px;

          margin:
            10px 0 0;

          color: #5e655f;

          font-size: 14px;
          line-height: 1.7;
        }

        /* =====================================================
           OVERVIEW
        ===================================================== */

        .overview-grid {
          display: grid;

          grid-template-columns:
            repeat(4, minmax(0, 1fr));

          gap: 12px;

          margin-top: 28px;
        }

        .overview-grid article {
          min-height: 180px;

          padding: 20px;

          border:
            1px solid #d9dfda;

          border-radius: 2px;

          background: #ffffff;
        }

        .overview-grid article > span {
          color: #138a3d;

          font-size: 12px;
          font-weight: 800;
        }

        .overview-grid h3 {
          margin:
            25px 0 8px;

          font-size: 17px;
        }

        .overview-grid p {
          margin: 0;

          color: #656c67;

          font-size: 12px;
          line-height: 1.65;
        }

        .what-if {
          display: grid;

          grid-template-columns:
            0.8fr 1.2fr;

          gap: 30px;

          margin-top: 18px;

          padding: 25px;

          background: #f2f8f3;

          border-left:
            4px solid #138a3d;
        }

        .what-if h3 {
          margin:
            7px 0 0;

          font-size: 19px;
          line-height: 1.35;
        }

        .what-if p {
          margin: 0;

          color: #505852;

          font-size: 13px;
          line-height: 1.7;
        }

        .danger-label {
          color: #a33b31;

          font-size: 10px;
          font-weight: 800;
          letter-spacing: 0.1em;
        }

        /* =====================================================
           COMPLEXITY
        ===================================================== */

        .complexity-row {
          display: flex;

          gap: 10px;

          margin:
            -4px 0 28px;
        }

        .complexity-row div {
          min-width: 170px;

          padding:
            12px 15px;

          border:
            1px solid #d8ded9;

          background: #fafbfa;

          border-radius: 2px;
        }

        .complexity-row span {
          display: block;

          color: #7a817c;

          font-size: 9px;
          font-weight: 800;

          letter-spacing: 0.12em;

          margin-bottom: 5px;
        }

        .complexity-row strong {
          color: #138a3d;

          font-size: 14px;
        }

        /* =====================================================
           TOPIC
        ===================================================== */

        .topic-intro {
          margin-bottom: 18px;
        }

        .topic-intro h2 {
          margin: 0 0 5px;

          font-size: 20px;
          letter-spacing: -0.025em;
        }

        .topic-intro p {
          margin: 0;

          color: #656c67;

          font-size: 12px;
          line-height: 1.6;
        }

        .split-layout {
          display: grid;

          grid-template-columns:
            minmax(0, 0.95fr)
            minmax(0, 1.05fr);

          gap: 16px;

          align-items: stretch;
        }

        /* =====================================================
           CODE
        ===================================================== */

        .code-panel {
          height: 100%;

          min-height: 400px;

          background: #111614;

          border:
            1px solid #252d29;

          border-radius: 2px;

          overflow: hidden;
        }

        .code-header {
          height: 39px;

          display: flex;
          align-items: center;
          justify-content: space-between;

          padding:
            0 13px;

          background: #181f1c;

          border-bottom:
            1px solid #29312d;

          color: #d5ddd8;

          font-size: 9px;
          font-weight: 800;
          letter-spacing: 0.12em;
        }

        .code-lang {
          color: #66d28d;

          font-size: 9px;
          font-weight: 600;

          letter-spacing: 0;
        }

        .code-body {
          padding:
            12px 0 15px;

          overflow-x: auto;
        }

        .code-line {
          display: grid;

          grid-template-columns:
            42px 1fr;

          min-height: 23px;

          padding:
            2px 13px 2px 0;

          font-family:
            "JetBrains Mono",
            "Cascadia Code",
            Consolas,
            monospace;

          font-size: 11px;
          line-height: 19px;

          color: #c7d0ca;
        }

        .code-line.active {
          background:
            rgba(19, 138, 61, 0.24);

          border-left:
            3px solid #37c96b;

          color: white;
        }

        .line-number {
          color: #68736d;

          text-align: right;

          padding-right: 12px;

          user-select: none;
        }

        .code-line.active
          .line-number {
          color: #66d28d;
        }

        /* =====================================================
           VISUALIZER
        ===================================================== */

        .visualizer-card {
          min-height: 400px;

          padding: 20px;

          border:
            1px solid #d8ded9;

          border-radius: 2px;

          background: #fbfcfb;

          display: flex;
          flex-direction: column;
        }

        .visualizer-top {
          display: flex;
          justify-content: space-between;
          align-items: center;

          padding-bottom: 15px;

          border-bottom:
            1px solid #e0e5e1;
        }

        .mini-label {
          display: block;

          color: #7b827d;

          font-size: 9px;
          font-weight: 800;

          letter-spacing: 0.1em;

          margin-bottom: 4px;
        }

        .visualizer-top strong {
          font-size: 13px;
        }

        .step-info {
          color: #138a3d;

          font-family:
            monospace;

          font-size: 11px;
        }

        .array-stage {
          min-height: 230px;

          display: flex;

          align-items: flex-end;
          justify-content: center;

          gap: 9px;

          padding:
            25px 10px 15px;
        }

        .array-cell {
          width: 46px;

          min-height: 55px;

          display: flex;
          flex-direction: column;

          align-items: center;
          justify-content: flex-end;

          padding-bottom: 7px;

          background: #138a3d;

          color: white;

          border-radius: 2px;

          transition:
            all 180ms ease;

          box-shadow:
            0 3px 0 #09652b;
        }

        .array-cell strong {
          font-size: 17px;
        }

        .array-cell small {
          opacity: 0.7;

          font-size: 8px;

          margin-top: 3px;
        }

        .array-cell.array-active {
          background: #f1a72b;

          box-shadow:
            0 3px 0 #b9750b;

          transform:
            translateY(-8px);
        }

        .visualizer-message {
          min-height: 40px;

          margin:
            10px 0;

          padding:
            11px 13px;

          background: #f0f6f1;

          border-left:
            3px solid #138a3d;

          color: #48504a;

          font-size: 11px;
          line-height: 1.5;
        }

        .visualizer-controls {
          display: flex;

          gap: 7px;

          margin-top: auto;
        }

        .visualizer-controls button,
        .stack-actions button,
        .run-large {
          border: 0;
          border-radius: 2px;

          padding:
            10px 15px;

          background: #138a3d;

          color: white;

          font-family: inherit;

          font-size: 10px;
          font-weight: 800;

          cursor: pointer;
        }

        .visualizer-controls button:hover,
        .stack-actions button:hover,
        .run-large:hover {
          background: #0b6f2e;
        }

        .visualizer-controls .secondary,
        .stack-actions .secondary {
          background: #e8ece9;

          color: #39403b;
        }

        .visualizer-controls .secondary:hover,
        .stack-actions .secondary:hover {
          background: #dce2dd;
        }

        /* =====================================================
           QUICK SORT
        ===================================================== */

        .pivot-badge {
          padding:
            7px 10px;

          background: #fff4dd;

          border:
            1px solid #f0c46c;

          color: #9a6408;

          font-size: 10px;
          font-weight: 800;
        }

        .quick-stage {
          display: flex;

          align-items: center;
          justify-content: center;

          gap: 7px;

          min-height: 210px;
        }

        .quick-cell {
          width: 54px;
          height: 54px;

          display: flex;
          flex-direction: column;

          justify-content: center;
          align-items: center;

          border:
            1px solid #cfd7d1;

          background: white;

          border-radius: 2px;

          transition:
            all 250ms ease;
        }

        .quick-cell strong {
          font-size: 17px;
        }

        .quick-cell span {
          color: #89918b;
          font-size: 8px;
        }

        .quick-active {
          border-color: #138a3d;

          background: #edf8f0;

          transform:
            translateY(-8px);
        }

        .quick-pivot {
          background: #f1a72b !important;

          color: white;

          border-color: #d68b0d;
        }

        .partition-line {
          display: flex;

          align-items: center;

          gap: 10px;

          color: #7b827d;

          font-size: 8px;
          font-weight: 800;
        }

        .partition-line div {
          height: 1px;

          flex: 1;

          background: #d4dbd6;
        }

        /* =====================================================
           STACK
        ===================================================== */

        .stack-rule {
          display: flex;
          gap: 12px;

          padding:
            12px;

          background: #f0f6f1;

          border-left:
            3px solid #138a3d;
        }

        .stack-rule strong {
          color: #138a3d;
        }

        .stack-rule span {
          font-size: 11px;
        }

        .stack-stage {
          width: 230px;

          margin:
            25px auto;

          text-align: center;
        }

        .stack-label {
          color: #138a3d;

          font-size: 9px;
          font-weight: 800;

          margin-bottom: 5px;
        }

        .stack-container {
          min-height: 250px;

          display: flex;
          flex-direction: column;

          justify-content: flex-start;

          border-left:
            3px solid #222;
          border-right:
            3px solid #222;

          padding:
            7px 10px;

          gap: 4px;
        }

        .stack-item {
          padding:
            11px;

          background: #e8eee9;

          border:
            1px solid #ccd5ce;

          font-size: 11px;

          position: relative;
        }

        .stack-item.stack-top {
          background: #138a3d;
          color: white;
          border-color: #138a3d;
        }

        .stack-item small,
        .stack-item span {
          display: block;

          font-size: 7px;
          font-weight: 800;

          letter-spacing: 0.1em;
        }

        .stack-base {
          margin-top: 5px;

          padding:
            7px;

          background: #202421;

          color: white;

          font-size: 9px;
          font-weight: 800;
        }

        .stack-actions {
          display: flex;
          gap: 7px;

          margin-top: auto;
        }

        /* =====================================================
           QUEUE
        ===================================================== */

        .queue-direction {
          display: flex;
          align-items: center;

          gap: 10px;

          color: #138a3d;

          font-size: 9px;
          font-weight: 800;
        }

        .arrow-line {
          height: 1px;

          flex: 1;

          background: #138a3d;

          position: relative;
        }

        .queue-stage {
          display: flex;

          align-items: center;

          gap: 7px;

          min-height: 230px;

          overflow-x: auto;
        }

        .queue-item {
          min-width: 80px;

          height: 80px;

          display: flex;
          flex-direction: column;

          justify-content: center;
          align-items: center;

          background: white;

          border:
            1px solid #ccd5ce;

          font-size: 11px;

          flex-shrink: 0;
        }

        .queue-item span {
          color: #7a827c;

          font-size: 8px;

          margin-bottom: 7px;
        }

        .queue-front {
          border:
            2px solid #138a3d;

          background: #f0f8f2;
        }

        /* =====================================================
           HASH MAP
        ===================================================== */

        .hash-layout {
          display: grid;

          grid-template-columns:
            1.2fr 0.8fr;

          gap: 15px;

          min-height: 320px;
        }

        .hash-buckets {
          display: grid;

          grid-template-columns:
            repeat(2, 1fr);

          gap: 8px;
        }

        .hash-bucket {
          display: grid;

          grid-template-columns:
            35px 42px 1fr;

          grid-template-rows:
            1fr 1fr;

          align-items: center;

          padding:
            8px;

          border:
            1px solid #d3dad5;

          background: white;

          text-align: left;

          cursor: pointer;

          border-radius: 2px;
        }

        .hash-bucket:hover,
        .hash-bucket.selected {
          border-color: #138a3d;
          background: #f0f8f2;
        }

        .hash-bucket span {
          grid-row: span 2;

          color: #8a928c;

          font-size: 8px;
        }

        .hash-bucket img {
          width: 34px;
          height: 34px;

          object-fit: contain;

          grid-row: span 2;
        }

        .hash-bucket strong {
          font-size: 10px;
        }

        .hash-bucket small {
          color: #7a827c;

          font-size: 8px;
        }

        .hash-result {
          display: flex;
          flex-direction: column;

          justify-content: center;
          align-items: center;

          text-align: center;

          border:
            1px solid #d3dad5;

          background: #111614;

          color: white;
        }

        .hash-result > span {
          color: #67d18e;

          font-size: 8px;
          font-weight: 800;
        }

        .hash-result > strong {
          margin-top: 15px;

          font-family: monospace;

          font-size: 13px;

          line-height: 1.6;
        }

        .hash-arrow {
          margin:
            10px 0;

          color: #67d18e;

          font-size: 20px;
        }

        .hash-value {
          width: 54px;
          height: 54px;

          display: grid;
          place-items: center;

          background: #138a3d;

          font-size: 20px;
          font-weight: 800;
        }

        .hash-result p {
          max-width: 190px;

          color: #aab3ad;

          font-size: 9px;
          line-height: 1.6;
        }

        /* =====================================================
           TREE
        ===================================================== */

        .tree-target {
          display: flex;
          align-items: center;
          gap: 8px;

          font-size: 11px;
        }

        .tree-target strong {
          color: #138a3d;
          font-size: 16px;
        }

        .tree-svg {
          width: 100%;
          height: 280px;

          margin:
            5px 0;
        }

        .tree-edge {
          stroke: #b9c5bc;
          stroke-width: 2;
        }

        .svg-node {
          fill: white;
          stroke: #138a3d;
          stroke-width: 2;
        }

        .svg-node.active {
          fill: #138a3d;
        }

        .svg-node-text {
          fill: #222;
          font-family: Inter, sans-serif;
          font-size: 14px;
          font-weight: 700;
        }

        .svg-node.active
          + .svg-node-text {
          fill: white;
        }

        /* =====================================================
           SEARCH
        ===================================================== */

        .search-input {
          display: flex;

          align-items: center;

          gap: 8px;

          margin-bottom: 12px;
        }

        .search-input span {
          color: #777f79;

          font-size: 9px;
          font-weight: 800;
        }

        .search-input input {
          width: 80px;

          border:
            1px solid #ccd5ce;

          border-radius: 2px;

          padding:
            7px 8px;

          font-family: inherit;
        }

        .search-array {
          display: flex;

          justify-content: center;

          gap: 5px;

          min-height: 160px;

          align-items: center;
        }

        .search-cell {
          width: 55px;
          height: 65px;

          display: flex;
          flex-direction: column;

          justify-content: center;
          align-items: center;

          border:
            1px solid #ccd5ce;

          background: white;

          transition: all 180ms ease;
        }

        .search-cell strong {
          font-size: 15px;
        }

        .search-cell small {
          margin-top: 5px;

          color: #8a918c;

          font-size: 8px;
        }

        .search-mid {
          background: #138a3d;
          color: white;

          transform:
            translateY(-8px);

          border-color: #138a3d;
        }

        .search-mid small {
          color: rgba(
            255,
            255,
            255,
            0.7
          );
        }

        .search-eliminated {
          opacity: 0.25;
          transform: scale(0.92);
        }

        .search-range {
          text-align: center;

          color: #138a3d;

          font-family: monospace;

          font-size: 10px;
        }

        /* =====================================================
           APPLICATION
        ===================================================== */

        .application-tabs {
          display: flex;

          gap: 5px;

          margin-bottom: 15px;
        }

        .application-tabs button {
          border:
            1px solid #ccd5ce;

          border-radius: 2px;

          padding:
            9px 13px;

          background: white;

          color: #505852;

          font-family: inherit;

          font-size: 9px;
          font-weight: 800;

          cursor: pointer;
        }

        .application-tabs button.active {
          background: #138a3d;
          border-color: #138a3d;

          color: white;
        }

        .application-panel {
          display: flex;
          flex-direction: column;

          gap: 16px;
        }

        .application-code {
          display: grid;

          grid-template-columns:
            0.9fr 1.1fr;

          gap: 16px;
        }

        .application-code .code-panel {
          min-height: 300px;
        }

        .application-explanation {
          padding: 22px;

          border:
            1px solid #d8ded9;

          background: #f8faf8;

          border-radius: 2px;
        }

        .application-explanation h3 {
          margin: 0 0 10px;

          font-size: 18px;
        }

        .application-explanation p {
          color: #59615b;

          font-size: 12px;

          line-height: 1.7;
        }

        .logic-flow {
          display: flex;

          align-items: center;

          flex-wrap: wrap;

          gap: 8px;

          margin-top: 20px;

          color: #138a3d;

          font-size: 10px;
          font-weight: 800;
        }

        .logic-flow span {
          padding:
            8px 10px;

          border:
            1px solid #bcd1c1;

          background: white;
        }

        .application-visual {
          padding: 20px;

          border:
            1px solid #d8ded9;

          background: white;

          border-radius: 2px;
        }

        .visual-title {
          display: flex;

          align-items: center;
          justify-content: space-between;

          padding-bottom: 13px;

          border-bottom:
            1px solid #e0e5e1;

          color: #138a3d;

          font-size: 10px;
          font-weight: 800;
        }

        .visual-title button {
          border: 0;
          border-radius: 2px;

          padding:
            8px 12px;

          background: #138a3d;
          color: white;

          font-family: inherit;

          font-size: 9px;
          font-weight: 800;

          cursor: pointer;
        }

        .ingredient-queue {
          display: flex;

          align-items: center;

          gap: 8px;

          padding:
            25px 5px;

          overflow-x: auto;
        }

        .ingredient-card {
          min-width: 105px;

          min-height: 105px;

          display: flex;
          flex-direction: column;

          align-items: center;
          justify-content: center;

          gap: 5px;

          border:
            1px solid #d5ddd7;

          background: #fafbfa;

          transition: all 180ms ease;
        }

        .ingredient-card img {
          width: 48px;
          height: 48px;

          object-fit: contain;
        }

        .ingredient-card strong {
          font-size: 10px;
        }

        .ingredient-card small {
          color: #138a3d;

          font-size: 7px;
          font-weight: 800;
        }

        .ingredient-next {
          border:
            2px solid #138a3d;

          background: #eef8f0;

          transform:
            translateY(-5px);
        }

        .application-note {
          display: flex;

          gap: 10px;

          padding:
            12px;

          background: #f1f7f2;

          border-left:
            3px solid #138a3d;

          font-size: 10px;
          line-height: 1.6;
        }

        .application-note strong {
          color: #138a3d;
          white-space: nowrap;
        }

        .inventory-grid {
          display: grid;

          grid-template-columns:
            repeat(3, 1fr);

          gap: 8px;

          padding-top: 18px;
        }

        .inventory-card {
          display: flex;

          align-items: center;

          gap: 10px;

          padding:
            11px;

          border:
            1px solid #d8ded9;

          background: #fafbfa;
        }

        .inventory-card img {
          width: 42px;
          height: 42px;

          object-fit: contain;
        }

        .inventory-card div {
          display: flex;
          flex-direction: column;

          gap: 4px;
        }

        .inventory-card strong {
          font-size: 10px;
        }

        .inventory-card span {
          color: #7b837d;

          font-size: 8px;
        }

        /* =====================================================
           STATE MACHINE
        ===================================================== */

        .state-track {
          display: flex;

          align-items: flex-start;

          gap: 0;

          overflow-x: auto;

          padding:
            35px 5px 25px;
        }

        .state-node {
          min-width: 90px;

          position: relative;

          display: flex;
          flex-direction: column;

          align-items: center;

          color: #8b938d;

          text-align: center;
        }

        .state-node:not(:last-child)::after {
          content: "";

          position: absolute;

          top: 15px;
          left: calc(50% + 15px);

          width: 60px;
          height: 2px;

          background: #d4dbd6;
        }

        .state-node span {
          width: 30px;
          height: 30px;

          display: grid;
          place-items: center;

          border:
            2px solid #cbd4ce;

          background: white;

          border-radius: 50%;

          font-size: 9px;
          font-weight: 800;

          position: relative;

          z-index: 2;
        }

        .state-node strong {
          margin-top: 9px;

          font-size: 8px;

          max-width: 80px;
        }

        .state-node.completed {
          color: #138a3d;
        }

        .state-node.completed span {
          background: #138a3d;
          border-color: #138a3d;

          color: white;
        }

        .state-node.current {
          color: #111;
        }

        .state-node.current span {
          background: #f1a72b;
          border-color: #d68b0d;

          color: white;

          box-shadow:
            0 0 0 5px #fff4dd;
        }

        .run-large {
          margin:
            0 auto 18px;
        }

        /* =====================================================
           NOTES
        ===================================================== */

        .notes-panel {
          margin-top: 10px;
        }

        .notes-visual {
          display: grid;

          grid-template-columns:
            1.2fr 0.8fr;

          gap: 16px;
        }

        .notes-editor {
          min-height: 300px;

          border:
            1px solid #ccd5ce;

          background: white;
        }

        .notes-toolbar {
          height: 40px;

          display: flex;
          align-items: center;

          gap: 13px;

          padding:
            0 13px;

          background: #f4f6f4;

          border-bottom:
            1px solid #d9dfda;

          font-size: 12px;
        }

        .notes-toolbar div {
          flex: 1;
        }

        .notes-toolbar button {
          border: 0;
          background: transparent;

          font-size: 19px;

          cursor: pointer;

          color: #138a3d;
        }

        .notes-content {
          padding: 25px;
        }

        .notes-content small {
          color: #138a3d;

          font-size: 8px;
          font-weight: 800;

          letter-spacing: 0.1em;
        }

        .notes-content h3 {
          margin:
            15px 0 8px;

          font-size: 22px;
        }

        .notes-content p {
          color: #646c66;

          font-size: 12px;
        }

        .history-stack {
          display: flex;
          flex-direction: column;

          justify-content: flex-end;

          min-height: 300px;

          padding:
            15px;

          border:
            1px solid #ccd5ce;

          background: #111614;

          color: white;
        }

        .history-stack > span {
          color: #67d18e;

          font-size: 9px;
          font-weight: 800;

          letter-spacing: 0.1em;

          margin-bottom: auto;
        }

        .history-item {
          padding:
            10px;

          margin-top: 4px;

          border:
            1px solid #313a35;

          background: #1b221f;

          color: #aeb8b1;

          font-size: 10px;
        }

        .history-item.latest {
          border-color: #138a3d;

          background: #163b24;

          color: white;
        }

        .history-item small {
          display: block;

          margin-bottom: 4px;

          color: #67d18e;

          font-size: 7px;
          font-weight: 800;
        }

        .what-if-small {
          margin-top: 20px;

          padding:
            12px;

          background: #fff6e5;

          border-left:
            3px solid #e1a128;

          color: #66552f;

          font-size: 10px;

          line-height: 1.6;
        }

        /* =====================================================
           RESPONSIVE
        ===================================================== */

        @media (max-width: 900px) {
          .split-layout,
          .application-code,
          .notes-visual,
          .hash-layout,
          .what-if {
            grid-template-columns: 1fr;
          }

          .overview-grid {
            grid-template-columns:
              repeat(2, 1fr);
          }
        }

        @media (max-width: 600px) {
          .dsa-content {
            padding: 22px 18px 60px;
          }

          .overview-grid {
            grid-template-columns: 1fr;
          }

          .complexity-row {
            flex-direction: column;
          }

          .inventory-grid {
            grid-template-columns:
              repeat(2, 1fr);
          }
        }
      `}</style>
    </div>
  );
}