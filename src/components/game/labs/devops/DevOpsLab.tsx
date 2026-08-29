"use client";

import {
    useEffect,
    useRef,
    useState,
} from "react";

import type {
    CSSProperties,
    MouseEvent as ReactMouseEvent,
    ReactNode,
} from "react";

/*

* =========================================================
* SEFIRAH — DEVOPS LAB
* =========================================================
*
* THEORY
* * Containerization
* * Images & Persistence
* * Docker Compose
* * Nginx & Load Balancing
* * Cloud Infrastructure
* * Git & CI/CD
*
* IMPLEMENTATION
* * Dockerizing Sefirah
* * Environment variables
* * Multi-stage builds
* * Docker Compose
* * CI/CD with GitHub Actions
* * Vercel deployment
* * Docker optimization & cleanup
*
* The lab follows the same approach as DSALab:
*
* ```
  concept
  ```
* ```
     ↓
  ```
* ```
  simple explanation
  ```
* ```
     ↓
  ```
* ```
  architecture / visualization
  ```
* ```
     ↓
  ```
* ```
  code
  ```
* ```
     ↓
  ```
* ```
  actual Sefirah implementation
  ```
*
* =========================================================
  */

interface WindowPosition {
    left: number;
    top: number;
    zIndex: number;
    centered: boolean;
}

interface DevOpsLabProps {
    onClose?: () => void;
    onFocus?: () => void;

    onMove?: (
        left: number,
        top: number
    ) => void;

    windowPosition: WindowPosition;
}

type Group =
    | "theory"
    | "implementation";

type Section =
    | "intro"
    | "containers"
    | "images"
    | "compose"
    | "nginx"
    | "cloud"
    | "cicd"
    | "sefirah"
    | "environment"
    | "docker"
    | "pipeline"
    | "deployment"
    | "optimization";

/*

* =========================================================
* CONSTANTS
* =========================================================
  */

const WINDOW_WIDTH = 1120;
const WINDOW_HEIGHT = 760;
const TITLE_BAR_HEIGHT = 42;

/*

* =========================================================
* SMALL REUSABLE COMPONENTS
* =========================================================
  */

function MiniBadge({
    children,
}: {
    children: ReactNode;
}) {
    return (
        <span
            style={{
                display: "inline-flex",
                alignItems: "center",
                padding: "4px 8px",
                border: "1px solid #b8d9c1",
                background: "#edf8f0",
                color: "#238b45",
                fontSize: "9px",
                fontWeight: 800,
                letterSpacing: "0.08em",
            }}
        >
            {children} </span>
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
                marginBottom: "22px",
            }}
        >
            <div
                style={{
                    color: "#238b45",
                    fontSize: "10px",
                    fontWeight: 800,
                    letterSpacing: "0.09em",
                    marginBottom: "8px",
                }}
            >
                {eyebrow} </div>

            <h1
                style={{
                    margin: 0,
                    fontSize: "27px",
                    lineHeight: 1.15,
                    color: "#1d2921",
                    fontWeight: 800,
                    letterSpacing: "-0.03em",
                }}
            >
                {title}
            </h1>

            <p
                style={{
                    margin: "10px 0 0",
                    maxWidth: "820px",
                    color: "#647169",
                    fontSize: "13px",
                    lineHeight: 1.75,
                }}
            >
                {description}
            </p>
        </div>

    );
}

function CodeBlock({
    code,
}: {
    code: string;
}) {
    return (
        <pre
            style={{
                margin: "14px 0 0",
                padding: "15px",
                overflowX: "auto",
                background: "#17201a",
                color: "#d9f3df",
                border: "1px solid #26372b",
                borderRadius: "2px",
                fontFamily:
                    '"SFMono-Regular", Consolas, "Liberation Mono", monospace',
                fontSize: "11px",
                lineHeight: 1.7,
                whiteSpace: "pre-wrap",
            }}
        >
            {code} </pre>
    );
}

function InfoBox({
    title,
    accent = "#238b45",
    children,
}: {
    title: string;
    accent?: string;
    children: ReactNode;
}) {
    return (
        <div
            style={{
                marginTop: "18px",
                padding: "17px 18px",
                borderLeft: `3px solid ${accent}`,
                borderTop: "1px solid #dce5df",
                borderRight: "1px solid #dce5df",
                borderBottom: "1px solid #dce5df",
                background: "#fbfcfb",
            }}
        >
            <div
                style={{
                    color: "#27372d",
                    fontSize: "12px",
                    fontWeight: 800,
                    marginBottom: "7px",
                }}
            >
                {title} </div>

            <div
                style={{
                    color: "#5d6a62",
                    fontSize: "12px",
                    lineHeight: 1.75,
                }}
            >
                {children}
            </div>
        </div>

    );
}

function Card({
    children,
    style,
}: {
    children: ReactNode;
    style?: CSSProperties;
}) {
    return (
        <div
            style={{
                border: "1px solid #dce5df",
                background: "#fff",
                padding: "20px",
                ...style,
            }}
        >
            {children} </div>
    );
}

/*

* =========================================================
* VISUALIZERS
* =========================================================
  */

function VMVsContainerVisualizer() {
    return (
        <div
            style={{
                border: "1px solid #dce5df",
                background: "#fff",
                padding: "20px",
            }}
        >
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "16px",
                }}
            > <div>
                    <div
                        style={{
                            fontSize: "10px",
                            fontWeight: 800,
                            color: "#7b6352",
                            letterSpacing: "0.08em",
                            marginBottom: "12px",
                        }}
                    >
                        VIRTUAL MACHINE </div>

                    <div
                        style={{
                            border: "1px solid #dfd8d1",
                            background: "#faf8f6",
                            padding: "9px",
                            textAlign: "center",
                            fontSize: "10px",
                            fontWeight: 700,
                            color: "#65584e",
                        }}
                    >
                        Application
                    </div>

                    <div
                        style={{
                            height: "7px",
                            background: "#e9e2db",
                        }}
                    />

                    <div
                        style={{
                            border: "1px solid #dfd8d1",
                            background: "#faf8f6",
                            padding: "9px",
                            textAlign: "center",
                            fontSize: "10px",
                            fontWeight: 700,
                            color: "#65584e",
                        }}
                    >
                        Guest OS
                    </div>

                    <div
                        style={{
                            height: "7px",
                            background: "#e9e2db",
                        }}
                    />

                    <div
                        style={{
                            border: "1px solid #dfd8d1",
                            background: "#f1ece7",
                            padding: "9px",
                            textAlign: "center",
                            fontSize: "10px",
                            fontWeight: 700,
                            color: "#65584e",
                        }}
                    >
                        Hypervisor
                    </div>

                    <div
                        style={{
                            height: "7px",
                            background: "#e9e2db",
                        }}
                    />

                    <div
                        style={{
                            border: "1px solid #cfc6bc",
                            background: "#e8e1d8",
                            padding: "9px",
                            textAlign: "center",
                            fontSize: "10px",
                            fontWeight: 800,
                            color: "#51473e",
                        }}
                    >
                        Host Hardware
                    </div>
                </div>

                <div>
                    <div
                        style={{
                            fontSize: "10px",
                            fontWeight: 800,
                            color: "#238b45",
                            letterSpacing: "0.08em",
                            marginBottom: "12px",
                        }}
                    >
                        CONTAINER
                    </div>

                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns: "1fr 1fr",
                            gap: "6px",
                        }}
                    >
                        {["App A", "App B"].map(
                            (app) => (
                                <div
                                    key={app}
                                    style={{
                                        border: "1px solid #b9d9c1",
                                        background: "#f2faf4",
                                        padding: "12px 6px",
                                        textAlign: "center",
                                        fontSize: "10px",
                                        fontWeight: 800,
                                        color: "#28713d",
                                    }}
                                >
                                    {app}
                                </div>
                            )
                        )}
                    </div>

                    <div
                        style={{
                            marginTop: "7px",
                            border: "1px solid #c9dfcf",
                            background: "#e9f6ed",
                            padding: "9px",
                            textAlign: "center",
                            fontSize: "10px",
                            fontWeight: 700,
                            color: "#28683b",
                        }}
                    >
                        Container Runtime
                    </div>

                    <div
                        style={{
                            marginTop: "7px",
                            border: "1px solid #d4e2d7",
                            background: "#f5f8f5",
                            padding: "9px",
                            textAlign: "center",
                            fontSize: "10px",
                            fontWeight: 700,
                            color: "#506258",
                        }}
                    >
                        Shared Host OS Kernel
                    </div>

                    <div
                        style={{
                            marginTop: "7px",
                            border: "1px solid #cfc6bc",
                            background: "#e8e1d8",
                            padding: "9px",
                            textAlign: "center",
                            fontSize: "10px",
                            fontWeight: 800,
                            color: "#51473e",
                        }}
                    >
                        Host Hardware
                    </div>
                </div>
            </div>

            <div
                style={{
                    marginTop: "15px",
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "12px",
                    fontSize: "10px",
                }}
            >
                <div
                    style={{
                        color: "#7a695c",
                    }}
                >
                    Full guest operating systems increase
                    startup time and resource usage.
                </div>

                <div
                    style={{
                        color: "#28713d",
                    }}
                >
                    Containers share the host kernel, making
                    deployment smaller and faster.
                </div>
            </div>
        </div>

    );
}

function DockerArchitectureVisualizer() {
    const boxStyle: CSSProperties = {
        border: "1px solid #cbd9cf",
        background: "#fff",
        padding: "12px",
        textAlign: "center",
        fontSize: "10px",
        fontWeight: 800,
        color: "#304037",
    };

    return (
        <div
            style={{
                border: "1px solid #dce5df",
                padding: "20px",
                background: "#f9fbf9",
            }}
        >
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns:
                        "1fr 34px 1.1fr 34px 1fr",
                    alignItems: "center",
                }}
            > <div style={boxStyle}>
                    Docker Client
                    <div
                        style={{
                            marginTop: "5px",
                            fontWeight: 500,
                            color: "#7a8780",
                        }}
                    >
                        docker build / run </div> </div>

                <div
                    style={{
                        textAlign: "center",
                        color: "#2f9e44",
                        fontSize: "18px",
                    }}
                >
                    →
                </div>

                <div
                    style={{
                        ...boxStyle,
                        background: "#edf8f0",
                        borderColor: "#9acaa6",
                        color: "#23713b",
                    }}
                >
                    Docker Daemon
                    <div
                        style={{
                            marginTop: "5px",
                            fontWeight: 500,
                            color: "#5f8068",
                        }}
                    >
                        builds & manages
                    </div>
                </div>

                <div
                    style={{
                        textAlign: "center",
                        color: "#2f9e44",
                        fontSize: "18px",
                    }}
                >
                    →
                </div>

                <div style={boxStyle}>
                    Registry
                    <div
                        style={{
                            marginTop: "5px",
                            fontWeight: 500,
                            color: "#7a8780",
                        }}
                    >
                        Docker Hub / ECR
                    </div>
                </div>
            </div>

            <div
                style={{
                    marginTop: "15px",
                    padding: "13px",
                    border: "1px dashed #b9cbbf",
                    color: "#607067",
                    fontSize: "11px",
                    lineHeight: 1.6,
                }}
            >
                The Docker client sends instructions.
                The Docker daemon performs the actual
                building and container management.
                Images can be downloaded from or uploaded
                to registries.
            </div>
        </div>

    );
}

function PersistenceVisualizer() {
    return (
        <div
            style={{
                border: "1px solid #dce5df",
                background: "#fff",
                padding: "20px",
            }}
        >
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns:
                        "1fr 50px 1fr",
                    alignItems: "center",
                }}
            > <div>
                    <div
                        style={{
                            padding: "16px",
                            border: "1px solid #f0c9c9",
                            background: "#fff7f7",
                            textAlign: "center",
                            fontSize: "11px",
                            fontWeight: 800,
                            color: "#a64242",
                        }}
                    >
                        Container Filesystem </div>

                    <div
                        style={{
                            marginTop: "8px",
                            textAlign: "center",
                            color: "#a64242",
                            fontSize: "10px",
                        }}
                    >
                        Deleted container → data disappears
                    </div>
                </div>

                <div
                    style={{
                        textAlign: "center",
                        fontSize: "20px",
                        color: "#7d8a81",
                    }}
                >
                    vs
                </div>

                <div>
                    <div
                        style={{
                            padding: "16px",
                            border: "1px solid #b9d9c1",
                            background: "#f2faf4",
                            textAlign: "center",
                            fontSize: "11px",
                            fontWeight: 800,
                            color: "#23713b",
                        }}
                    >
                        Docker Volume
                    </div>

                    <div
                        style={{
                            marginTop: "8px",
                            textAlign: "center",
                            color: "#39804e",
                            fontSize: "10px",
                        }}
                    >
                        Container deleted → volume survives
                    </div>
                </div>
            </div>
        </div>

    );
}

function ComposeVisualizer() {
    return (
        <div
            style={{
                border: "1px solid #dce5df",
                background: "#fff",
                padding: "20px",
            }}
        >
            <div
                style={{
                    textAlign: "center",
                    color: "#238b45",
                    fontSize: "10px",
                    fontWeight: 800,
                    letterSpacing: "0.08em",
                    marginBottom: "15px",
                }}
            >
                docker compose up </div>

            <div
                style={{
                    display: "grid",
                    gridTemplateColumns:
                        "1fr 34px 1fr",
                    alignItems: "center",
                }}
            >
                <div
                    style={{
                        border: "1px solid #b9d9c1",
                        background: "#edf8f0",
                        padding: "18px",
                        textAlign: "center",
                    }}
                >
                    <strong
                        style={{
                            display: "block",
                            color: "#23713b",
                            fontSize: "12px",
                        }}
                    >
                        Sefirah App
                    </strong>

                    <span
                        style={{
                            display: "block",
                            marginTop: "5px",
                            fontSize: "10px",
                            color: "#62836b",
                        }}
                    >
                        Next.js · Port 3000
                    </span>
                </div>

                <div
                    style={{
                        textAlign: "center",
                        color: "#2f9e44",
                        fontSize: "18px",
                    }}
                >
                    →
                </div>

                <div
                    style={{
                        border: "1px solid #cbd9cf",
                        background: "#f8faf8",
                        padding: "18px",
                        textAlign: "center",
                    }}
                >
                    <strong
                        style={{
                            display: "block",
                            color: "#34433a",
                            fontSize: "12px",
                        }}
                    >
                        MongoDB Atlas
                    </strong>

                    <span
                        style={{
                            display: "block",
                            marginTop: "5px",
                            fontSize: "10px",
                            color: "#718077",
                        }}
                    >
                        External database
                    </span>
                </div>
            </div>

            <div
                style={{
                    marginTop: "15px",
                    padding: "12px",
                    border: "1px dashed #c8d7cc",
                    color: "#647169",
                    fontSize: "10px",
                    lineHeight: 1.7,
                }}
            >
                Docker Compose gives the project one
                configuration for building the application,
                exposing port 3000, loading environment
                variables, and managing restart behaviour.
            </div>
        </div>

    );
}

function NginxVisualizer() {
    return (
        <div
            style={{
                border: "1px solid #dce5df",
                background: "#fff",
                padding: "20px",
            }}
        >
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns:
                        "1fr 36px 1fr 36px 1fr",
                    alignItems: "center",
                }}
            >
                <div
                    style={{
                        padding: "13px",
                        border: "1px solid #d8e0da",
                        textAlign: "center",
                        fontSize: "10px",
                        fontWeight: 800,
                        color: "#47564c",
                    }}
                >
                    Users </div>

                <div
                    style={{
                        textAlign: "center",
                        color: "#2f9e44",
                        fontSize: "18px",
                    }}
                >
                    →
                </div>

                <div
                    style={{
                        padding: "13px",
                        border: "1px solid #9bcbaa",
                        background: "#edf8f0",
                        textAlign: "center",
                        fontSize: "11px",
                        fontWeight: 800,
                        color: "#23713b",
                    }}
                >
                    Nginx
                    <div
                        style={{
                            fontSize: "9px",
                            marginTop: "5px",
                            fontWeight: 500,
                            color: "#5d8066",
                        }}
                    >
                        Reverse Proxy
                    </div>
                </div>

                <div
                    style={{
                        textAlign: "center",
                        color: "#2f9e44",
                        fontSize: "18px",
                    }}
                >
                    →
                </div>

                <div
                    style={{
                        display: "grid",
                        gap: "7px",
                    }}
                >
                    <div
                        style={{
                            padding: "8px",
                            border: "1px solid #cbd9cf",
                            textAlign: "center",
                            fontSize: "9px",
                            fontWeight: 700,
                        }}
                    >
                        Backend 1
                    </div>

                    <div
                        style={{
                            padding: "8px",
                            border: "1px solid #cbd9cf",
                            textAlign: "center",
                            fontSize: "9px",
                            fontWeight: 700,
                        }}
                    >
                        Backend 2
                    </div>
                </div>
            </div>
        </div>

    );
}

function CICDVisualizer() {
    const steps = [
        "Code",
        "Git Push",
        "GitHub Actions",
        "Build",
        "Validate",
        "Vercel",
    ];

    return (
        <div
            style={{
                border: "1px solid #dce5df",
                background: "#fff",
                padding: "20px",
            }}
        >
            <div
                style={{
                    display: "flex",
                    alignItems: "stretch",
                    gap: "6px",
                    flexWrap: "wrap",
                }}
            >
                {steps.map(
                    (step, index) => (
                        <div
                            key={step}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "6px",
                            }}
                        >
                            <div
                                style={{
                                    minWidth: "105px",
                                    padding: "11px 8px",
                                    textAlign: "center",
                                    border:
                                        index === 2 ||
                                            index === 3 ||
                                            index === 4
                                            ? "1px solid #9bcbaa"
                                            : "1px solid #d5dfd7",
                                    background:
                                        index === 2 ||
                                            index === 3 ||
                                            index === 4
                                            ? "#edf8f0"
                                            : "#fafbfa",
                                    color:
                                        index === 2 ||
                                            index === 3 ||
                                            index === 4
                                            ? "#23713b"
                                            : "#4d5c52",
                                    fontSize: "9px",
                                    fontWeight: 800,
                                }}
                            >
                                {step} </div>

                            {index <
                                steps.length - 1 && (
                                    <span
                                        style={{
                                            color: "#2f9e44",
                                            fontSize: "15px",
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
                    marginTop: "17px",
                    display: "grid",
                    gridTemplateColumns:
                        "1fr 1fr",
                    gap: "10px",
                }}
            >
                <div
                    style={{
                        padding: "11px",
                        border: "1px solid #dce5df",
                        fontSize: "10px",
                        color: "#647169",
                    }}
                >
                    CI checks whether the project can build
                    successfully before deployment.
                </div>

                <div
                    style={{
                        padding: "11px",
                        border: "1px solid #dce5df",
                        fontSize: "10px",
                        color: "#647169",
                    }}
                >
                    Deployment happens only after the code
                    reaches a valid state.
                </div>
            </div>
        </div>

    );
}

function DockerBuildVisualizer() {
    return (
        <div
            style={{
                border: "1px solid #dce5df",
                background: "#fff",
                padding: "20px",
            }}
        >
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns:
                        "1fr 35px 1fr",
                    alignItems: "stretch",
                }}
            >
                <div
                    style={{
                        border: "1px solid #d5dfd7",
                        background: "#fafbfa",
                        padding: "15px",
                    }}
                >
                    <div
                        style={{
                            color: "#6a786f",
                            fontSize: "9px",
                            fontWeight: 800,
                            letterSpacing: "0.08em",
                            marginBottom: "10px",
                        }}
                    >
                        BUILDER STAGE </div>

                    <div
                        style={{
                            fontFamily: "monospace",
                            fontSize: "10px",
                            color: "#405047",
                            lineHeight: 1.9,
                        }}
                    >
                        node:20-alpine
                        <br />
                        npm install
                        <br />
                        COPY source
                        <br />
                        npm run build
                    </div>
                </div>

                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#2f9e44",
                        fontSize: "20px",
                    }}
                >
                    →
                </div>

                <div
                    style={{
                        border: "1px solid #9bcbaa",
                        background: "#edf8f0",
                        padding: "15px",
                    }}
                >
                    <div
                        style={{
                            color: "#23713b",
                            fontSize: "9px",
                            fontWeight: 800,
                            letterSpacing: "0.08em",
                            marginBottom: "10px",
                        }}
                    >
                        RUNTIME STAGE
                    </div>

                    <div
                        style={{
                            fontFamily: "monospace",
                            fontSize: "10px",
                            color: "#3d6647",
                            lineHeight: 1.9,
                        }}
                    >
                        production files
                        <br />
                        .next
                        <br />
                        node_modules
                        <br />
                        npm start
                    </div>
                </div>
            </div>

            <div
                style={{
                    marginTop: "15px",
                    color: "#657269",
                    fontSize: "10px",
                    lineHeight: 1.7,
                }}
            >
                Multi-stage builds separate the environment
                needed to build the application from the
                environment needed to run it.
            </div>
        </div>

    );
}

/*

* =========================================================
* COMPONENT
* =========================================================
  */

export default function DevOpsLab({
    onClose,
    onFocus,
    onMove,
    windowPosition,
}: DevOpsLabProps) {
    const [
        group,
        setGroup,
    ] = useState<Group>(
        "theory"
    );

    const [
        section,
        setSection,
    ] = useState<Section>(
        "intro"
    );

    const [
        isDragging,
        setIsDragging,
    ] = useState(false);

    const [
        hasMovedFromCenter,
        setHasMovedFromCenter,
    ] = useState(false);

    const dragOffset =
        useRef({
            x: 0,
            y: 0,
        });

    /*
    
    * =======================================================
    * DRAGGING
    * =======================================================
      */

    const handleDragStart = (
        event: ReactMouseEvent
    ) => {
        if (
            event.button !== 0
        ) {
            return;
        }

        event.preventDefault();
        event.stopPropagation();

        onFocus?.();

        const windowElement =
            event.currentTarget.closest(
                "[data-devops-window]"
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
                    10,
                    window.innerHeight -
                    actualHeight -
                    50
                );

            const clampedLeft =
                Math.min(
                    Math.max(
                        10,
                        left
                    ),
                    maxLeft
                );

            const clampedTop =
                Math.min(
                    Math.max(
                        10,
                        top
                    ),
                    maxTop
                );

            setHasMovedFromCenter(
                true
            );

            onMove?.(
                clampedLeft,
                clampedTop
            );
        };

        const handleMouseUp =
            () => {
                setIsDragging(
                    false
                );
            };

        window.addEventListener(
            "mousemove",
            handleMove
        );

        window.addEventListener(
            "mouseup",
            handleMouseUp
        );

        return () => {
            window.removeEventListener(
                "mousemove",
                handleMove
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
    
    * =======================================================
    * NAVIGATION
    * =======================================================
      */

    const theoryItems = [
        {
            id: "intro" as Section,
            label: "DevOps Overview",
            description:
                "The development-to-deployment lifecycle",
        },
        {
            id: "containers" as Section,
            label: "Containerization",
            description:
                "VMs, containers and Docker architecture",
        },
        {
            id: "images" as Section,
            label: "Images & Persistence",
            description:
                "Layers, volumes and optimization",
        },
        {
            id: "compose" as Section,
            label: "Docker Compose",
            description:
                "Managing application stacks",
        },
        {
            id: "nginx" as Section,
            label: "Nginx",
            description:
                "Reverse proxies and load balancing",
        },
        {
            id: "cloud" as Section,
            label: "Cloud Infrastructure",
            description:
                "AWS compute, storage and deployment",
        },
        {
            id: "cicd" as Section,
            label: "Git & CI/CD",
            description:
                "Automation with GitHub Actions",
        },
    ];

    const implementationItems = [
        {
            id: "sefirah" as Section,
            label: "Sefirah Architecture",
            description:
                "What was actually deployed",
        },
        {
            id: "environment" as Section,
            label: "Environment Variables",
            description:
                "MongoDB and runtime configuration",
        },
        {
            id: "docker" as Section,
            label: "Docker Implementation",
            description:
                "Image, build and container workflow",
        },
        {
            id: "pipeline" as Section,
            label: "CI Pipeline",
            description:
                "GitHub build and validation workflow",
        },
        {
            id: "deployment" as Section,
            label: "Vercel Deployment",
            description:
                "Production deployment and fixes",
        },
        {
            id: "optimization" as Section,
            label: "Optimization",
            description:
                "Image size, cache and disk cleanup",
        },
    ];

    const handleSelect =
        (id: Section) => {
            setSection(id);

            if (
                theoryItems.some(
                    (item) =>
                        item.id === id
                )
            ) {
                setGroup(
                    "theory"
                );
            } else {
                setGroup(
                    "implementation"
                );
            }
        };

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
                    handleSelect(
                        item.id
                    )
                }
                style={{
                    width: "100%",
                    textAlign: "left",
                    padding: "11px 13px",
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
                    fontFamily:
                        "Inter, sans-serif",
                }}
            >
                <div
                    style={{
                        fontSize: "12px",
                        fontWeight: active
                            ? 800
                            : 650,
                    }}
                >
                    {item.label}
                </div>

                <div
                    style={{
                        marginTop: "3px",
                        fontSize: "9px",
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
    
    * =======================================================
    * THEORY CONTENT
    * =======================================================
      */

    const renderIntro =
        () => (
            <> <SectionTitle
                eyebrow="01 • THEORY"
                title="What does DevOps actually connect?"
                description="DevOps connects the work of building software with the work of reliably delivering and operating it. Instead of treating development and deployment as completely separate activities, the workflow becomes a continuous path."
            />

                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns:
                            "1fr 1fr",
                        gap: "18px",
                    }}
                >
                    <Card>
                        <MiniBadge>
                            DEVELOPMENT
                        </MiniBadge>

                        <h2
                            style={{
                                margin:
                                    "13px 0 8px",
                                color:
                                    "#1d2921",
                                fontSize:
                                    "18px",
                            }}
                        >
                            Build the software.
                        </h2>

                        <p
                            style={{
                                color:
                                    "#5f6c64",
                                fontSize:
                                    "13px",
                                lineHeight:
                                    1.75,
                            }}
                        >
                            Developers write
                            features, fix bugs,
                            manage source
                            code and create
                            production builds.
                        </p>

                        <CodeBlock
                            code={`git add .

git commit -m "feature"
git push

npm run build`}
                        /> </Card>

                    <Card>
                        <MiniBadge>
                            OPERATIONS
                        </MiniBadge>

                        <h2
                            style={{
                                margin:
                                    "13px 0 8px",
                                color:
                                    "#1d2921",
                                fontSize:
                                    "18px",
                            }}
                        >
                            Run it reliably.
                        </h2>

                        <p
                            style={{
                                color:
                                    "#5f6c64",
                                fontSize:
                                    "13px",
                                lineHeight:
                                    1.75,
                            }}
                        >
                            Operations focuses
                            on environments,
                            containers,
                            deployment,
                            networking and
                            keeping services
                            available.
                        </p>

                        <CodeBlock
                            code={`docker build

docker run
docker compose up
deploy`}
                        /> </Card> </div>

                <InfoBox title="The main idea">
                    The important DevOps question is not only
                    "does the code work on my computer?".
                    It is also "can this exact project be
                    reproduced, validated and deployed in a
                    predictable environment?"
                </InfoBox>

                <InfoBox
                    title="How this applies to Sefirah"
                    accent="#2f9e44"
                >
                    In this project, we moved from running
                    Next.js manually on the development
                    machine to defining a Docker image,
                    running it through Docker Compose,
                    validating the project with GitHub
                    Actions and deploying the application
                    through Vercel.
                </InfoBox>
            </>
        );

    const renderContainers =
        () => (
            <> <SectionTitle
                eyebrow="02 • THEORY"
                title="Containers and Virtual Machines"
                description="Both VMs and containers isolate workloads, but they do it at different layers."
            />

                <VMVsContainerVisualizer />

                <div
                    style={{
                        marginTop: "18px",
                        display: "grid",
                        gridTemplateColumns:
                            "1fr 1fr",
                        gap: "18px",
                    }}
                >
                    <Card>
                        <h2
                            style={{
                                margin: 0,
                                color:
                                    "#1d2921",
                                fontSize:
                                    "17px",
                            }}
                        >
                            Virtual Machine
                        </h2>

                        <p
                            style={{
                                color:
                                    "#657269",
                                fontSize:
                                    "12px",
                                lineHeight:
                                    1.75,
                            }}
                        >
                            A virtual machine
                            emulates a complete
                            computer environment.
                            Each VM can contain
                            its own guest
                            operating system.
                        </p>
                    </Card>

                    <Card>
                        <h2
                            style={{
                                margin: 0,
                                color:
                                    "#1d2921",
                                fontSize:
                                    "17px",
                            }}
                        >
                            Container
                        </h2>

                        <p
                            style={{
                                color:
                                    "#657269",
                                fontSize:
                                    "12px",
                                lineHeight:
                                    1.75,
                            }}
                        >
                            A container packages
                            an application and
                            its dependencies while
                            sharing the host
                            operating system
                            kernel.
                        </p>
                    </Card>
                </div>

                <div
                    style={{
                        marginTop: "20px",
                    }}
                >
                    <DockerArchitectureVisualizer />
                </div>

                <InfoBox title="Essential Docker commands">
                    <CodeBlock
                        code={`docker pull <image>:<tag>

docker run -it <image>

docker run -p 3000:3000 <image>

docker ps -a`}
                    /> </InfoBox>
            </>
        );

    const renderImages =
        () => (
            <> <SectionTitle
                eyebrow="03 • THEORY"
                title="Images, Layers and Persistence"
                description="An image is the reusable blueprint used to create containers. Containers created from an image have a writable layer, but that container data is temporary."
            />

                <PersistenceVisualizer />

                <div
                    style={{
                        marginTop: "18px",
                        display: "grid",
                        gridTemplateColumns:
                            "1fr 1fr",
                        gap: "18px",
                    }}
                >
                    <Card>
                        <MiniBadge>
                            BIND MOUNT
                        </MiniBadge>

                        <h2
                            style={{
                                fontSize:
                                    "17px",
                                margin:
                                    "13px 0 8px",
                                color:
                                    "#1d2921",
                            }}
                        >
                            Host-controlled
                            storage
                        </h2>

                        <p
                            style={{
                                color:
                                    "#657269",
                                fontSize:
                                    "12px",
                                lineHeight:
                                    1.75,
                            }}
                        >
                            A host directory is
                            directly mapped into
                            a container path.
                            This is particularly
                            useful during local
                            development.
                        </p>
                    </Card>

                    <Card>
                        <MiniBadge>
                            DOCKER VOLUME
                        </MiniBadge>

                        <h2
                            style={{
                                fontSize:
                                    "17px",
                                margin:
                                    "13px 0 8px",
                                color:
                                    "#1d2921",
                            }}
                        >
                            Docker-managed
                            storage
                        </h2>

                        <p
                            style={{
                                color:
                                    "#657269",
                                fontSize:
                                    "12px",
                                lineHeight:
                                    1.75,
                            }}
                        >
                            Docker manages the
                            storage independently
                            from an individual
                            container, making it
                            useful for persistent
                            services such as
                            databases.
                        </p>
                    </Card>
                </div>

                <div
                    style={{
                        marginTop: "20px",
                    }}
                >
                    <DockerBuildVisualizer />
                </div>

                <InfoBox title="Why image optimization matters">
                    A production image should contain what is
                    necessary to run the application, not every
                    temporary compiler, cache or development
                    dependency used while building it.
                </InfoBox>
            </>
        );

    const renderCompose =
        () => (
            <> <SectionTitle
                eyebrow="04 • THEORY"
                title="Multi-Container Orchestration"
                description="Docker Compose describes services and their configuration in YAML so an application stack can be started through a single workflow."
            />

                <ComposeVisualizer />

                <div
                    style={{
                        marginTop: "18px",
                    }}
                >
                    <CodeBlock
                        code={`services:

app:
build: .
ports:
- "3000:3000"
environment:
NODE_ENV: production`}
                    /> </div>

                <InfoBox title="Compose lifecycle">
                    <CodeBlock
                        code={`docker compose up -d

docker compose ps

docker compose down -v`}
                    /> </InfoBox>

                <InfoBox
                    title="Health checks and dependency ordering"
                    accent="#e67700"
                >
                    In larger multi-container stacks,
                    <code> depends_on </code>
                    can work together with health checks so
                    dependent services wait until another
                    service is actually ready rather than
                    merely started.
                </InfoBox>
            </>
        );

    const renderNginx =
        () => (
            <> <SectionTitle
                eyebrow="05 • THEORY"
                title="Nginx, Reverse Proxies and Load Balancing"
                description="Nginx can sit between users and application servers, forwarding requests while also providing an important networking and security boundary."
            />

                <NginxVisualizer />

                <div
                    style={{
                        marginTop: "18px",
                        display: "grid",
                        gridTemplateColumns:
                            "1fr 1fr",
                        gap: "18px",
                    }}
                >
                    <Card>
                        <h2
                            style={{
                                margin: 0,
                                fontSize:
                                    "16px",
                                color:
                                    "#1d2921",
                            }}
                        >
                            Reverse proxy
                        </h2>

                        <p
                            style={{
                                color:
                                    "#657269",
                                fontSize:
                                    "12px",
                                lineHeight:
                                    1.75,
                            }}
                        >
                            The public client
                            talks to Nginx.
                            Nginx forwards the
                            request internally
                            using
                            <code>
                                {" "}
                                proxy_pass
                            </code>.
                        </p>
                    </Card>

                    <Card>
                        <h2
                            style={{
                                margin: 0,
                                fontSize:
                                    "16px",
                                color:
                                    "#1d2921",
                            }}
                        >
                            Client information
                        </h2>

                        <p
                            style={{
                                color:
                                    "#657269",
                                fontSize:
                                    "12px",
                                lineHeight:
                                    1.75,
                            }}
                        >
                            Headers such as
                            <code>
                                {" "}
                                X-Real-IP
                            </code>
                            can preserve
                            information about
                            the original client.
                        </p>
                    </Card>
                </div>

                <InfoBox title="Load balancing strategies">
                    Round Robin distributes requests in
                    sequence. Weighted Round Robin gives
                    stronger servers more traffic. Least
                    Connections prefers the server with fewer
                    active connections. IP Hash can provide
                    sticky behaviour based on a client IP.
                </InfoBox>

                <InfoBox
                    title="Was Nginx added to Sefirah?"
                    accent="#e67700"
                >
                    No. This section documents the DevOps
                    concepts studied in the module. The current
                    Sefirah deployment does not claim to use
                    an Nginx reverse proxy.
                </InfoBox>
            </>
        );

    const renderCloud =
        () => (
            <> <SectionTitle
                eyebrow="06 • THEORY"
                title="Cloud Infrastructure and AWS"
                description="Cloud services provide managed building blocks for storage, container registries and scalable application deployment."
            />

                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns:
                            "repeat(3, 1fr)",
                        gap: "16px",
                    }}
                >
                    {[
                        {
                            title:
                                "Amazon S3",
                            description:
                                "Object storage for static files, backups and other durable objects.",
                        },
                        {
                            title:
                                "Amazon ECR",
                            description:
                                "A private container registry integrated with AWS IAM.",
                        },
                        {
                            title:
                                "Elastic Beanstalk",
                            description:
                                "A platform that manages infrastructure around application deployment.",
                        },
                    ].map(
                        (service) => (
                            <Card
                                key={
                                    service.title
                                }
                            >
                                <MiniBadge>
                                    AWS
                                </MiniBadge>

                                <h2
                                    style={{
                                        margin:
                                            "13px 0 8px",
                                        color:
                                            "#1d2921",
                                        fontSize:
                                            "16px",
                                    }}
                                >
                                    {
                                        service.title
                                    }
                                </h2>

                                <p
                                    style={{
                                        margin: 0,
                                        color:
                                            "#657269",
                                        fontSize:
                                            "11px",
                                        lineHeight:
                                            1.75,
                                    }}
                                >
                                    {
                                        service.description
                                    }
                                </p>
                            </Card>
                        )
                    )}
                </div>

                <InfoBox title="Security principles">
                    Restrict SSH access through Security Groups
                    instead of exposing port 22 to everyone.
                    Deployment environments should also receive
                    only the IAM permissions they actually need.
                </InfoBox>

                <InfoBox
                    title="How AWS could fit Sefirah"
                    accent="#e67700"
                >
                    AWS was studied as part of the module but
                    was not deployed for this project. A
                    possible architecture would be:
                    GitHub Actions builds a Docker image →
                    pushes it to ECR → an AWS deployment
                    service pulls the image → infrastructure
                    runs and exposes the application.
                </InfoBox>
            </>
        );

    const renderCICD =
        () => (
            <> <SectionTitle
                eyebrow="07 • THEORY"
                title="Version Control and Automated CI/CD"
                description="Git tracks changes through stages, while CI/CD systems automate validation and delivery when those changes are pushed."
            />

                <CICDVisualizer />

                <div
                    style={{
                        marginTop: "18px",
                        display: "grid",
                        gridTemplateColumns:
                            "1fr 1fr 1fr",
                        gap: "12px",
                    }}
                >
                    {[
                        {
                            title:
                                "Working Directory",
                            text:
                                "Files currently being changed.",
                        },
                        {
                            title:
                                "Staging Area",
                            text:
                                "Changes selected using git add.",
                        },
                        {
                            title:
                                "Local Repository",
                            text:
                                "A committed project history.",
                        },
                    ].map(
                        (item) => (
                            <Card
                                key={
                                    item.title
                                }
                                style={{
                                    padding:
                                        "15px",
                                }}
                            >
                                <div
                                    style={{
                                        fontSize:
                                            "11px",
                                        fontWeight:
                                            800,
                                        color:
                                            "#28382e",
                                    }}
                                >
                                    {
                                        item.title
                                    }
                                </div>

                                <div
                                    style={{
                                        marginTop:
                                            "7px",
                                        fontSize:
                                            "10px",
                                        lineHeight:
                                            1.6,
                                        color:
                                            "#748078",
                                    }}
                                >
                                    {
                                        item.text
                                    }
                                </div>
                            </Card>
                        )
                    )}
                </div>

                <InfoBox title="GitHub Actions structure">
                    A workflow YAML file defines an event such
                    as a push, one or more jobs running on a
                    runner such as <code>ubuntu-latest</code>,
                    and steps that execute actions or shell
                    commands.
                </InfoBox>

                <CodeBlock
                    code={`on:

push:

jobs:
validate:
runs-on: ubuntu-latest

steps:
  - checkout
  - install dependencies
  - npm run build`}
                />
            </>
        );

    /*
    
    * =======================================================
    * IMPLEMENTATION CONTENT
    * =======================================================
      */

    const renderSefirah =
        () => (
            <> <SectionTitle
                eyebrow="08 • IMPLEMENTATION"
                title="DevOps implementation in Sefirah"
                description="The DevOps work in this project focused on making the existing Next.js application reproducible, containerized, validated and deployable."
            />

                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns:
                            "1fr 1fr",
                        gap: "18px",
                    }}
                >
                    <Card>
                        <MiniBadge>
                            APPLICATION
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
                            Sefirah
                        </h2>

                        <p
                            style={{
                                color:
                                    "#657269",
                                fontSize:
                                    "12px",
                                lineHeight:
                                    1.75,
                            }}
                        >
                            The project is a
                            Next.js application
                            containing the
                            desktop interface,
                            filesystem,
                            authentication,
                            notes and the
                            cooking game.
                        </p>
                    </Card>

                    <Card>
                        <MiniBadge>
                            DATABASE
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
                            MongoDB
                        </h2>

                        <p
                            style={{
                                color:
                                    "#657269",
                                fontSize:
                                    "12px",
                                lineHeight:
                                    1.75,
                            }}
                        >
                            The application
                            requires the
                            MongoDB connection
                            string through
                            <code>
                                {" "}
                                MONGODB_URI
                            </code>.
                        </p>
                    </Card>
                </div>

                <div
                    style={{
                        marginTop: "20px",
                    }}
                >
                    <ComposeVisualizer />
                </div>

                <InfoBox title="The important DevOps improvement">
                    Instead of requiring every machine to have
                    the exact local development setup, Docker
                    provides a defined application environment.
                    The same image can be built and run through
                    a consistent workflow.
                </InfoBox>
            </>
        );

    const renderEnvironment =
        () => (
            <> <SectionTitle
                eyebrow="09 • IMPLEMENTATION"
                title="Environment variables and MONGODB_URI"
                description="One of the main problems encountered during containerization was that the application needed MongoDB configuration while Next.js was performing its production build."
            />

                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns:
                            "1fr 1fr",
                        gap: "18px",
                    }}
                >
                    <Card>
                        <MiniBadge>
                            THE ERROR
                        </MiniBadge>

                        <h2
                            style={{
                                margin:
                                    "13px 0 8px",
                                fontSize:
                                    "17px",
                                color:
                                    "#1d2921",
                            }}
                        >
                            Build-time failure
                        </h2>

                        <CodeBlock
                            code={`Error:

Invalid/Missing environment variable:
"MONGODB_URI"`}
                        />

                        <p
                            style={{
                                color:
                                    "#657269",
                                fontSize:
                                    "12px",
                                lineHeight:
                                    1.75,
                            }}
                        >
                            The application
                            imported MongoDB
                            configuration while
                            Next.js collected
                            route configuration
                            during the build.
                        </p>
                    </Card>

                    <Card>
                        <MiniBadge>
                            THE SOLUTION
                        </MiniBadge>

                        <h2
                            style={{
                                margin:
                                    "13px 0 8px",
                                fontSize:
                                    "17px",
                                color:
                                    "#1d2921",
                            }}
                        >
                            Separate build and runtime configuration
                        </h2>

                        <CodeBlock
                            code={`docker run \\
-p 3000:3000 \
--env-file .env.local \
sefirah`}
                        />

                        <p
                            style={{
                                color:
                                    "#657269",
                                fontSize:
                                    "12px",
                                lineHeight:
                                    1.75,
                            }}
                        >
                            Docker Compose was
                            also configured to
                            load
                            <code>
                                {" "}
                                .env.local
                            </code>
                            into the running
                            container.
                        </p>
                    </Card>
                </div>

                <InfoBox title="Why this matters">
                    Environment variables should not be hard
                    coded into application source code. The same
                    image can therefore run with different
                    configuration in development, testing and
                    production environments.
                </InfoBox>

                <InfoBox
                    title="Important security practice"
                    accent="#e67700"
                >
                    The actual MongoDB connection string should
                    remain outside the public Git repository.
                    Production environments should store their
                    own secure environment variables.
                </InfoBox>
            </>
        );

    const renderDocker =
        () => (
            <> <SectionTitle
                eyebrow="10 • IMPLEMENTATION"
                title="Dockerizing Sefirah"
                description="The project was built into a Docker image and successfully run as a production Next.js container on port 3000."
            />

                <DockerBuildVisualizer />

                <div
                    style={{
                        marginTop: "18px",
                    }}
                >
                    <CodeBlock
                        code={`docker build -t sefirah .

docker images sefirah

docker run \
-p 3000:3000 \
--env-file .env.local \
sefirah`}
                    /> </div>

                <InfoBox title="What was verified">
                    The Docker image successfully completed the
                    production build, the container started with
                    <code> npm start </code>, and the application
                    was exposed through host port 3000.
                </InfoBox>

                <InfoBox title="Container monitoring">
                    Docker commands were also used to inspect
                    resource usage and image layers:
                    <CodeBlock
                        code={`docker history sefirah-sefirah

docker stats --no-stream

docker system df`}
                    /> </InfoBox>
            </>
        );

    const renderPipeline =
        () => (
            <> <SectionTitle
                eyebrow="11 • IMPLEMENTATION"
                title="Continuous Integration with GitHub Actions"
                description="A CI workflow was added to automatically build and validate the project after code changes were pushed to GitHub."
            />

                <CICDVisualizer />

                <div
                    style={{
                        marginTop: "18px",
                        display: "grid",
                        gridTemplateColumns:
                            "1fr 1fr",
                        gap: "18px",
                    }}
                >
                    <Card>
                        <MiniBadge>
                            AUTOMATED CHECK
                        </MiniBadge>

                        <h2
                            style={{
                                margin:
                                    "13px 0 8px",
                                fontSize:
                                    "17px",
                                color:
                                    "#1d2921",
                            }}
                        >
                            Production build
                        </h2>

                        <p
                            style={{
                                color:
                                    "#657269",
                                fontSize:
                                    "12px",
                                lineHeight:
                                    1.75,
                            }}
                        >
                            The CI pipeline
                            checks whether
                            <code>
                                {" "}
                                npm run build
                            </code>
                            succeeds in a clean
                            environment.
                        </p>
                    </Card>

                    <Card>
                        <MiniBadge>
                            RESULT
                        </MiniBadge>

                        <h2
                            style={{
                                margin:
                                    "13px 0 8px",
                                fontSize:
                                    "17px",
                                color:
                                    "#1d2921",
                            }}
                        >
                            Build and validation passed
                        </h2>

                        <p
                            style={{
                                color:
                                    "#657269",
                                fontSize:
                                    "12px",
                                lineHeight:
                                    1.75,
                            }}
                        >
                            The workflow was
                            successfully run,
                            demonstrating that
                            the project could
                            be automatically
                            validated without
                            manually running
                            every check.
                        </p>
                    </Card>
                </div>

                <InfoBox title="Why CI is useful">
                    A local machine can contain cached
                    dependencies or environment differences.
                    CI provides an independent environment that
                    can catch build problems before deployment.
                </InfoBox>
            </>
        );


    const renderDeployment =
        () => (
            <> <SectionTitle
                eyebrow="12 • IMPLEMENTATION"
                title="Deployment through Vercel"
                description="The production deployment pipeline exposed a Next.js build issue that had to be fixed before the application could deploy successfully."
            />

                <Card>
                    <MiniBadge>
                        DEPLOYMENT ISSUE
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
                        Build artifact mismatch
                    </h2>

                    <CodeBlock
                        code={`ENOENT:

no such file or directory

.next/next-server.js.nft.json`}
                    />

                    <p
                        style={{
                            color:
                                "#657269",
                            fontSize:
                                "12px",
                            lineHeight:
                                1.75,
                        }}
                    >
                        The Vercel build
                        successfully compiled
                        and generated pages,
                        but a build completion
                        step attempted to
                        access a file that was
                        not present in the
                        generated output.
                    </p>
                </Card>

                <InfoBox title="What the deployment process demonstrated">
                    Deployment is also validation. A project
                    can work locally and still expose problems
                    when built inside another environment.
                    Fixing these differences is part of making
                    a deployment reproducible.
                </InfoBox>

                <InfoBox
                    title="Current project outcome"
                    accent="#2f9e44"
                >
                    The CI build and validation workflow
                    completed successfully, and the project was
                    prepared for production deployment through
                    Vercel.
                </InfoBox>
            </>
        );

    const renderOptimization =
        () => (
            <> <SectionTitle
                eyebrow="13 • IMPLEMENTATION"
                title="Docker optimization and disk management"
                description="Container development can consume significant disk space because Docker stores images, stopped containers, networks, volumes and build caches."
            />

                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns:
                            "1fr 1fr",
                        gap: "18px",
                    }}
                >
                    <Card>
                        <MiniBadge>
                            THE PROBLEM
                        </MiniBadge>

                        <h2
                            style={{
                                margin:
                                    "13px 0 8px",
                                color:
                                    "#1d2921",
                                fontSize:
                                    "17px",
                            }}
                        >
                            Repeated builds accumulated storage
                        </h2>

                        <p
                            style={{
                                color:
                                    "#657269",
                                fontSize:
                                    "12px",
                                lineHeight:
                                    1.75,
                            }}
                        >
                            Multiple versions of
                            large Sefirah images,
                            stopped containers and
                            build cache objects
                            accumulated inside
                            Docker Desktop.
                        </p>
                    </Card>

                    <Card>
                        <MiniBadge>
                            THE SOLUTION
                        </MiniBadge>

                        <h2
                            style={{
                                margin:
                                    "13px 0 8px",
                                color:
                                    "#1d2921",
                                fontSize:
                                    "17px",
                            }}
                        >
                            Inspect and prune unused resources
                        </h2>

                        <CodeBlock
                            code={`docker system df

docker system prune

docker builder prune -a`}
                        /> </Card> </div>

                <InfoBox title="What was observed">
                    Running Docker cleanup reclaimed a large
                    amount of unused disk space, including
                    stopped containers and unused build cache.
                    This demonstrated why image lifecycle
                    management matters during repeated builds.
                </InfoBox>

                <InfoBox
                    title="Important caution"
                    accent="#e67700"
                >
                    Pruning removes unused Docker resources.
                    It should be used carefully when containers,
                    volumes or cached images contain data that
                    is still needed.
                </InfoBox>
            </>
        );

    /*
    
    * =======================================================
    * CURRENT SECTION
    * =======================================================
      */

    const renderCurrent =
        () => {
            switch (
            section
            ) {
                case "intro":
                    return renderIntro();

                case "containers":
                    return renderContainers();

                case "images":
                    return renderImages();

                case "compose":
                    return renderCompose();

                case "nginx":
                    return renderNginx();

                case "cloud":
                    return renderCloud();

                case "cicd":
                    return renderCICD();

                case "sefirah":
                    return renderSefirah();

                case "environment":
                    return renderEnvironment();

                case "docker":
                    return renderDocker();

                case "pipeline":
                    return renderPipeline();

                case "deployment":
                    return renderDeployment();

                case "optimization":
                    return renderOptimization();

                default:
                    return renderIntro();
            }
        };

    /*
    
    * =======================================================
    * RENDER
    * =======================================================
      */

    return (
        <div
            data-devops-window
            onMouseDown={
                onFocus
            }
            style={{
                position:
                    "absolute",

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

                display:
                    "flex",

                flexDirection:
                    "column",

                overflow:
                    "hidden",

                background:
                    "#ffffff",

                border:
                    "1px solid #b8c8bc",

                borderRadius:
                    "2px",

                boxShadow:
                    "0 18px 55px rgba(21, 36, 26, 0.22)",

                fontFamily:
                    "Inter, sans-serif",

                userSelect:
                    isDragging
                        ? "none"
                        : "auto",
            }}
        >
            {/* TITLE BAR */}

            <div
                onMouseDown={
                    handleDragStart
                }
                style={{
                    height:
                        `${TITLE_BAR_HEIGHT}px`,

                    flexShrink:
                        0,

                    display:
                        "flex",

                    alignItems:
                        "center",

                    justifyContent:
                        "space-between",

                    padding:
                        "0 12px 0 14px",

                    borderBottom:
                        "1px solid rgba(195, 211, 199, 0.8)",

                    background:
                        "rgba(255, 255, 255, 0.76)",

                    backdropFilter:
                        "blur(16px)",

                    cursor:
                        isDragging
                            ? "grabbing"
                            : "grab",
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
                                "18px",

                            height:
                                "18px",

                            display:
                                "flex",

                            alignItems:
                                "center",

                            justifyContent:
                                "center",

                            background:
                                "#238b45",

                            color:
                                "#fff",

                            fontSize:
                                "10px",

                            fontWeight:
                                900,

                            borderRadius:
                                "2px",
                        }}
                    >
                        D
                    </div>

                    <span
                        style={{
                            color:
                                "#28372e",

                            fontSize:
                                "12px",

                            fontWeight:
                                750,
                        }}
                    >
                        DevOps Lab
                    </span>

                    <span
                        style={{
                            color:
                                "#8a958e",

                            fontSize:
                                "9px",

                            borderLeft:
                                "1px solid #d6dfd8",

                            paddingLeft:
                                "9px",
                        }}
                    >
                        Sefirah
                    </span>
                </div>

                <button
                    onMouseDown={
                        (event) =>
                            event.stopPropagation()
                    }
                    onClick={
                        onClose
                    }
                    style={{
                        width:
                            "26px",

                        height:
                            "26px",

                        border:
                            "none",

                        background:
                            "transparent",

                        color:
                            "#68746c",

                        cursor:
                            "pointer",

                        fontSize:
                            "18px",

                        lineHeight:
                            1,

                        display:
                            "flex",

                        alignItems:
                            "center",

                        justifyContent:
                            "center",
                    }}
                    aria-label="Close DevOps Lab"
                >
                    ×
                </button>
            </div>

            {/* BODY */}

            <div
                style={{
                    flex:
                        1,

                    minHeight:
                        0,

                    display:
                        "grid",

                    gridTemplateColumns:
                        "218px 1fr",

                    overflow:
                        "hidden",
                }}
            >
                {/* SIDEBAR */}

                <aside
                    style={{
                        borderRight:
                            "1px solid #dce5df",

                        background:
                            "#f8faf8",

                        overflowY:
                            "auto",

                        padding:
                            "14px 0",
                    }}
                >
                    <div
                        style={{
                            padding:
                                "0 13px 10px",
                        }}
                    >
                        <div
                            style={{
                                display:
                                    "flex",

                                border:
                                    "1px solid #d4dfd6",

                                background:
                                    "#fff",
                            }}
                        >
                            <button
                                onClick={() =>
                                    setGroup(
                                        "theory"
                                    )
                                }
                                style={{
                                    flex:
                                        1,

                                    border:
                                        "none",

                                    padding:
                                        "8px 4px",

                                    background:
                                        group ===
                                            "theory"
                                            ? "#238b45"
                                            : "transparent",

                                    color:
                                        group ===
                                            "theory"
                                            ? "#fff"
                                            : "#738077",

                                    cursor:
                                        "pointer",

                                    fontFamily:
                                        "Inter, sans-serif",

                                    fontSize:
                                        "9px",

                                    fontWeight:
                                        800,
                                }}
                            >
                                THEORY
                            </button>

                            <button
                                onClick={() =>
                                    setGroup(
                                        "implementation"
                                    )
                                }
                                style={{
                                    flex:
                                        1,

                                    border:
                                        "none",

                                    padding:
                                        "8px 4px",

                                    background:
                                        group ===
                                            "implementation"
                                            ? "#238b45"
                                            : "transparent",

                                    color:
                                        group ===
                                            "implementation"
                                            ? "#fff"
                                            : "#738077",

                                    cursor:
                                        "pointer",

                                    fontFamily:
                                        "Inter, sans-serif",

                                    fontSize:
                                        "9px",

                                    fontWeight:
                                        800,
                                }}
                            >
                                IMPLEMENTATION
                            </button>
                        </div>
                    </div>

                    <div
                        style={{
                            padding:
                                "8px 13px 6px",

                            color:
                                "#8a958e",

                            fontSize:
                                "9px",

                            fontWeight:
                                800,

                            letterSpacing:
                                "0.09em",
                        }}
                    >
                        {group ===
                            "theory"
                            ? "DEVOPS CONCEPTS"
                            : "SEFIRAH IMPLEMENTATION"}
                    </div>

                    {group ===
                        "theory"
                        ? theoryItems.map(
                            renderNavItem
                        )
                        : implementationItems.map(
                            renderNavItem
                        )}
                </aside>

                {/* CONTENT */}

                <main
                    style={{
                        overflowY:
                            "auto",

                        background:
                            "#ffffff",

                        padding:
                            "30px 34px 48px",
                    }}
                >
                    {renderCurrent()}
                </main>
            </div>
        </div>

    );
}
