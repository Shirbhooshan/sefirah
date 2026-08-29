"use client";

import { useEffect, useRef, useState } from "react";
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
 * 01 DevOps overview
 * 02 Containerization
 * 03 Images, layers and persistence
 * 04 Docker Compose
 * 05 Nginx and load balancing
 * 06 Cloud infrastructure
 * 07 Git and CI/CD
 *
 * IMPLEMENTATION
 * 08 Sefirah architecture
 * 09 Environment variables
 * 10 Docker implementation
 * 11 CI pipeline
 * 12 Deployment
 * 13 Optimization
 *
 * Every section follows:
 *
 * concept
 *   ↓
 * command / configuration
 *   ↓
 * what this does
 *   ↓
 * why we use it
 *   ↓
 * what happens without it
 *   ↓
 * actual Sefirah implementation
 *   ↓
 * verification commands
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
    onMove?: (left: number, top: number) => void;
    windowPosition: WindowPosition;
}

type Group = "theory" | "implementation";

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

const WINDOW_WIDTH = 1120;
const WINDOW_HEIGHT = 760;
const TITLE_BAR_HEIGHT = 42;

/* =========================================================
 * REUSABLE UI
 * ========================================================= */

function MiniBadge({ children }: { children: ReactNode }) {
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
            {children}
        </span>
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
        <div style={{ marginBottom: "22px" }}>
            <div
                style={{
                    color: "#238b45",
                    fontSize: "10px",
                    fontWeight: 800,
                    letterSpacing: "0.09em",
                    marginBottom: "8px",
                }}
            >
                {eyebrow}
            </div>

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
    label,
}: {
    code: string;
    label?: string;
}) {
    return (
        <div style={{ marginTop: "14px" }}>
            {label && (
                <div
                    style={{
                        marginBottom: "6px",
                        color: "#6c7b71",
                        fontSize: "9px",
                        fontWeight: 800,
                        letterSpacing: "0.09em",
                    }}
                >
                    {label}
                </div>
            )}

            <pre
                style={{
                    margin: 0,
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
                {code}
            </pre>
        </div>
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
                {title}
            </div>

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
            {children}
        </div>
    );
}

function CommandLesson({
    title,
    command,
    does,
    why,
    without,
}: {
    title: string;
    command: string;
    does: string;
    why: string;
    without: string;
}) {
    return (
        <Card style={{ marginTop: "18px" }}>
            <MiniBadge>COMMAND BREAKDOWN</MiniBadge>

            <h2
                style={{
                    margin: "13px 0 8px",
                    color: "#1d2921",
                    fontSize: "17px",
                }}
            >
                {title}
            </h2>

            <CodeBlock code={command} />

            <div
                style={{
                    marginTop: "15px",
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "12px",
                }}
            >
                <div
                    style={{
                        padding: "12px",
                        border: "1px solid #dce5df",
                        fontSize: "11px",
                        lineHeight: 1.7,
                        color: "#5d6a62",
                    }}
                >
                    <strong style={{ color: "#28372e" }}>
                        THIS DOES
                    </strong>
                    <br />
                    {does}
                </div>

                <div
                    style={{
                        padding: "12px",
                        border: "1px solid #f0d4d4",
                        background: "#fffafa",
                        fontSize: "11px",
                        lineHeight: 1.7,
                        color: "#755f5f",
                    }}
                >
                    <strong style={{ color: "#a64242" }}>
                        IF WE DID NOT DO THIS
                    </strong>
                    <br />
                    {without}
                </div>
            </div>

            <InfoBox title="Why we use it">
                {why}
            </InfoBox>
        </Card>
    );
}

function StepsVisualizer({
    steps,
}: {
    steps: string[];
}) {
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
                {steps.map((step, index) => (
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
                                border: "1px solid #cbd9cf",
                                background:
                                    index === steps.length - 1
                                        ? "#edf8f0"
                                        : "#fafbfa",
                                color:
                                    index === steps.length - 1
                                        ? "#23713b"
                                        : "#4d5c52",
                                fontSize: "9px",
                                fontWeight: 800,
                            }}
                        >
                            {step}
                        </div>

                        {index < steps.length - 1 && (
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
                ))}
            </div>
        </div>
    );
}

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
            >
                <Card style={{ background: "#faf8f6" }}>
                    <MiniBadge>VIRTUAL MACHINE</MiniBadge>
                    <p style={{ fontSize: "11px", lineHeight: 1.8 }}>
                        Application → Guest OS → Hypervisor → Host Hardware
                    </p>
                    <p
                        style={{
                            fontSize: "11px",
                            color: "#7b6352",
                            lineHeight: 1.7,
                        }}
                    >
                        Each VM includes a complete guest operating system.
                    </p>
                </Card>

                <Card style={{ background: "#f2faf4" }}>
                    <MiniBadge>CONTAINER</MiniBadge>
                    <p style={{ fontSize: "11px", lineHeight: 1.8 }}>
                        Application → Dependencies → Container Runtime →
                        Shared Host Kernel
                    </p>
                    <p
                        style={{
                            fontSize: "11px",
                            color: "#28713d",
                            lineHeight: 1.7,
                        }}
                    >
                        Containers share the host kernel and package only the
                        application environment.
                    </p>
                </Card>
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
                    gridTemplateColumns: "1fr 35px 1fr",
                    alignItems: "stretch",
                }}
            >
                <Card style={{ background: "#fafbfa" }}>
                    <MiniBadge>BUILDER STAGE</MiniBadge>
                    <CodeBlock
                        code={`node:20-alpine
npm ci
COPY source
npm run build`}
                    />
                </Card>

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

                <Card style={{ background: "#edf8f0" }}>
                    <MiniBadge>RUNNER STAGE</MiniBadge>
                    <CodeBlock
                        code={`node:20-alpine
public
.next
node_modules
npm start`}
                    />
                </Card>
            </div>
        </div>
    );
}

function LoadBalancerVisualizer() {
    return (
        <div
            style={{
                border: "1px solid #dce5df",
                background: "#fff",
                padding: "20px",
            }}
        >
            <StepsVisualizer
                steps={[
                    "Users",
                    "Nginx :80",
                    "Sefirah-1",
                    "Sefirah-2",
                    "Sefirah-3",
                ]}
            />

            <InfoBox title="Actual project architecture">
                Nginx is the public entry point. The three Sefirah services
                are internal backend replicas listening on port 3000 inside
                the Docker network.
            </InfoBox>
        </div>
    );
}

/* =========================================================
 * COMPONENT
 * ========================================================= */

export default function DevOpsLab({
    onClose,
    onFocus,
    onMove,
    windowPosition,
}: DevOpsLabProps) {
    const [group, setGroup] = useState<Group>("theory");
    const [section, setSection] = useState<Section>("intro");
    const [isDragging, setIsDragging] = useState(false);
    const [hasMovedFromCenter, setHasMovedFromCenter] =
        useState(false);

    const dragOffset = useRef({ x: 0, y: 0 });

    const handleDragStart = (event: ReactMouseEvent) => {
        if (event.button !== 0) return;

        event.preventDefault();
        event.stopPropagation();
        onFocus?.();

        const windowElement = event.currentTarget.closest(
            "[data-devops-window]"
        ) as HTMLElement | null;

        if (!windowElement) return;

        const rect = windowElement.getBoundingClientRect();

        dragOffset.current = {
            x: event.clientX - rect.left,
            y: event.clientY - rect.top,
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

    /* =====================================================
     * NAVIGATION
     * ===================================================== */

    const theoryItems = [
        {
            id: "intro" as Section,
            label: "DevOps Overview",
            description: "The development-to-deployment lifecycle",
        },
        {
            id: "containers" as Section,
            label: "Containerization",
            description: "VMs, containers and Docker architecture",
        },
        {
            id: "images" as Section,
            label: "Images & Persistence",
            description: "Layers, volumes and optimization",
        },
        {
            id: "compose" as Section,
            label: "Docker Compose",
            description: "Managing application stacks",
        },
        {
            id: "nginx" as Section,
            label: "Nginx",
            description: "Reverse proxies and load balancing",
        },
        {
            id: "cloud" as Section,
            label: "Cloud Infrastructure",
            description: "Compute, storage and deployment",
        },
        {
            id: "cicd" as Section,
            label: "Git & CI/CD",
            description: "Automation and validation",
        },
    ];

    const implementationItems = [
        {
            id: "sefirah" as Section,
            label: "Sefirah Architecture",
            description: "What was actually implemented",
        },
        {
            id: "environment" as Section,
            label: "Environment Variables",
            description: "Build-time and runtime configuration",
        },
        {
            id: "docker" as Section,
            label: "Docker Implementation",
            description: "Image, build and container workflow",
        },
        {
            id: "pipeline" as Section,
            label: "CI Pipeline",
            description: "Automated validation workflow",
        },
        {
            id: "deployment" as Section,
            label: "Deployment",
            description: "Production deployment and debugging",
        },
        {
            id: "optimization" as Section,
            label: "Optimization",
            description: "Caching, image size and cleanup",
        },
    ];

    const handleSelect = (id: Section) => {
        setSection(id);

        setGroup(
            theoryItems.some((item) => item.id === id)
                ? "theory"
                : "implementation"
        );
    };

    const renderNavItem = (item: {
        id: Section;
        label: string;
        description: string;
    }) => {
        const active = section === item.id;

        return (
            <button
                key={item.id}
                onClick={() => handleSelect(item.id)}
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
                    fontFamily: "Inter, sans-serif",
                }}
            >
                <div
                    style={{
                        fontSize: "12px",
                        fontWeight: active ? 800 : 650,
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

    /* =====================================================
     * THEORY
     * ===================================================== */

    const renderIntro = () => (
        <>
            <SectionTitle
                eyebrow="01 • THEORY"
                title="What does DevOps actually connect?"
                description="DevOps connects software development with the systems and processes used to build, validate, deploy and operate that software."
            />

            <StepsVisualizer
                steps={[
                    "Write Code",
                    "Git Commit",
                    "Build",
                    "Test",
                    "Container",
                    "Deploy",
                    "Monitor",
                ]}
            />

            <CommandLesson
                title="The development workflow"
                command={`git status

git add .

git commit -m "feature"

git push

npm run build`}
                does="Git status shows changed files. Git add selects changes for a commit. Git commit records a version of the project. Git push sends that version to the remote repository. npm run build checks whether the production application can actually be created."
                why="This creates a repeatable path from local development to a version that automation and deployment systems can process."
                without="Without version control and repeatable build commands, deployments depend more heavily on manual machine state and it becomes harder to know exactly which version is running."
            />

            <InfoBox title="How this applies to Sefirah">
                The Sefirah workflow uses source control, production builds,
                Docker images, Docker Compose, multiple application
                containers, Nginx and automated validation concepts to make
                the application environment reproducible.
            </InfoBox>
        </>
    );

    const renderContainers = () => (
        <>
            <SectionTitle
                eyebrow="02 • THEORY"
                title="Containers and Virtual Machines"
                description="Both technologies isolate workloads, but virtual machines virtualize entire operating systems while containers package application processes on a shared host kernel."
            />

            <VMVsContainerVisualizer />

            <CommandLesson
                title="Download an application image"
                command={`docker pull node:20-alpine

docker images`}
                does="docker pull downloads an image from a registry. docker images lists images currently stored by Docker on the machine."
                why="Images provide reusable starting environments. The same image definition can be used repeatedly instead of manually installing every dependency."
                without="Without a reusable image, every developer or server would need to manually reconstruct the runtime environment, increasing configuration differences."
            />

            <CommandLesson
                title="Create and run a container"
                command={`docker run -it node:20-alpine sh

docker ps

docker ps -a`}
                does="docker run creates a container from an image and starts it. docker ps lists running containers, while docker ps -a also includes stopped containers."
                why="A container lets an application run inside the environment described by its image."
                without="Without containers, the application must depend directly on the host machine's installed runtime and dependencies."
            />

            <InfoBox title="Important distinction">
                An image is the reusable blueprint. A container is a running
                or stopped instance created from that image.
            </InfoBox>
        </>
    );

    const renderImages = () => (
        <>
            <SectionTitle
                eyebrow="03 • THEORY"
                title="Images, layers and persistence"
                description="Docker images are built from layers. Containers add a writable layer, while persistent data can be stored outside the container through volumes or bind mounts."
            />

            <DockerBuildVisualizer />

            <CommandLesson
                title="Inspect image layers"
                command={`docker history sefirah

docker image inspect sefirah`}
                does="docker history displays the image's layer history. docker image inspect shows detailed metadata such as configuration and image information."
                why="Layer inspection helps explain why an image is large and which Dockerfile instructions contributed to the final artifact."
                without="Without inspecting layers, large images can accumulate unnecessary build tools, caches and files without an obvious explanation."
            />

            <CommandLesson
                title="Create persistent storage"
                command={`docker volume create sefirah-data

docker volume ls

docker volume inspect sefirah-data`}
                does="The first command creates a Docker-managed volume. The remaining commands list and inspect Docker volumes."
                why="Volumes allow data to survive independently from a particular container lifecycle."
                without="If important data existed only in a container writable layer, deleting that container could also remove the data."
            />

            <InfoBox title="Layer ordering matters">
                Docker can reuse cached layers. Instructions that change
                frequently should generally appear later than stable
                dependency installation steps. Otherwise a small source
                change can invalidate an earlier layer and force expensive
                work to run again.
            </InfoBox>
        </>
    );

    const renderCompose = () => (
        <>
            <SectionTitle
                eyebrow="04 • THEORY"
                title="Multi-container orchestration with Docker Compose"
                description="Docker Compose stores application services and their configuration in one YAML file so the stack can be started, inspected and stopped consistently."
            />

            <CodeBlock
                label="SIMPLE COMPOSE EXAMPLE"
                code={`services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      NODE_ENV: production`}
            />

            <CommandLesson
                title="Start the entire stack"
                command={`docker compose up -d

docker compose ps

docker compose logs`}
                does="docker compose up creates and starts the declared services. The -d flag runs them in the background. docker compose ps shows service state and docker compose logs displays output."
                why="One command can reproduce the same multi-service environment instead of starting every service manually."
                without="Without Compose, service commands, networks, ports and environment settings can become inconsistent and difficult to reproduce."
            />

            <CommandLesson
                title="Stop and remove the stack"
                command={`docker compose down

docker compose down -v`}
                does="docker compose down stops and removes containers and networks created for the stack. Adding -v also removes associated volumes."
                why="This provides a controlled way to reset a development stack."
                without="If resources are left behind indefinitely, stopped containers, networks and volumes can accumulate and consume disk space."
            />
        </>
    );

    const renderNginx = () => (
        <>
            <SectionTitle
                eyebrow="05 • THEORY + IMPLEMENTED ARCHITECTURE"
                title="Nginx, reverse proxy and load balancing"
                description="In the Sefirah Compose architecture, Nginx is the public entry point while three internal Sefirah application containers provide backend capacity."
            />

            <LoadBalancerVisualizer />

            <CodeBlock
                label="LOAD BALANCER CONCEPT"
                code={`upstream sefirah_backend {
    server sefirah-1:3000;
    server sefirah-2:3000;
    server sefirah-3:3000;
}

server {
    listen 80;

    location / {
        proxy_pass http://sefirah_backend;
    }
}`}
            />

            <CommandLesson
                title="Start Nginx and backend replicas"
                command={`docker compose up -d

docker compose ps

curl http://localhost`}
                does="Compose starts Nginx and the Sefirah backend services. The curl command then sends an HTTP request to the public entry point."
                why="Nginx provides one public address while backend containers remain internal to the Docker network."
                without="If every backend container were exposed directly to users, separate public ports would need to be managed and clients would need to know which container to contact."
            />

            <InfoBox title="What the upstream block does">
                The upstream group gives Nginx multiple backend servers. The
                proxy can forward requests to these services rather than
                sending all traffic to a single application container.
            </InfoBox>

            <InfoBox title="Important implementation note" accent="#e67700">
                The exact routing behavior depends on the contents of your
                actual <code>nginx/nginx.conf</code>. The Compose file supplied
                for Sefirah confirms the Nginx service, the mounted
                configuration file and the three application services.
            </InfoBox>
        </>
    );

    const renderCloud = () => (
        <>
            <SectionTitle
                eyebrow="06 • THEORY"
                title="Cloud infrastructure"
                description="Cloud platforms provide managed building blocks for compute, storage, networking, registries and deployment."
            />

            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(3, 1fr)",
                    gap: "16px",
                }}
            >
                {[
                    [
                        "Object Storage",
                        "Durable storage for files, backups and static objects.",
                    ],
                    [
                        "Container Registry",
                        "A place to store and distribute built container images.",
                    ],
                    [
                        "Compute Platform",
                        "Infrastructure capable of running application workloads.",
                    ],
                ].map(([title, description]) => (
                    <Card key={title}>
                        <MiniBadge>CLOUD</MiniBadge>
                        <h2
                            style={{
                                margin: "13px 0 8px",
                                fontSize: "16px",
                            }}
                        >
                            {title}
                        </h2>
                        <p
                            style={{
                                margin: 0,
                                fontSize: "11px",
                                lineHeight: 1.7,
                                color: "#657269",
                            }}
                        >
                            {description}
                        </p>
                    </Card>
                ))}
            </div>

            <CommandLesson
                title="Typical container delivery sequence"
                command={`docker build -t sefirah:latest .

docker tag sefirah:latest registry.example/sefirah:latest

docker push registry.example/sefirah:latest`}
                does="The application is built locally, tagged for a registry and then pushed so another deployment environment can retrieve the same image."
                why="The image becomes a deployable artifact that can move independently from the developer's machine."
                without="Without a registry or another artifact distribution mechanism, production infrastructure has no consistent way to obtain the exact image that was built and validated."
            />

            <InfoBox title="How cloud infrastructure could extend Sefirah">
                A future architecture could build the Sefirah image in CI,
                push it to a container registry and run that exact artifact
                on managed cloud infrastructure.
            </InfoBox>
        </>
    );

    const renderCICD = () => (
        <>
            <SectionTitle
                eyebrow="07 • THEORY"
                title="Git and automated CI/CD"
                description="Git records project history while continuous integration automatically validates changes in a clean environment."
            />

            <StepsVisualizer
                steps={[
                    "Code",
                    "Git Add",
                    "Commit",
                    "Push",
                    "CI Runner",
                    "Build",
                    "Deploy",
                ]}
            />

            <CommandLesson
                title="Record a change with Git"
                command={`git status

git add .

git commit -m "describe the change"

git push`}
                does="Git status shows changes, git add places selected changes into the staging area, git commit records a snapshot and git push sends commits to the remote repository."
                why="This provides traceable project history and creates an event that CI systems can respond to."
                without="Without version history, it becomes harder to identify what changed, reproduce an earlier version or automate actions from repository events."
            />

            <CodeBlock
                label="GITHUB ACTIONS WORKFLOW STRUCTURE"
                code={`name: Validate

on:
  push:

jobs:
  validate:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build`}
            />

            <InfoBox title="What CI protects against">
                A local machine may contain cached dependencies, locally
                generated files or configuration that accidentally hides a
                problem. A clean CI environment helps reveal whether the
                repository itself contains everything required to build.
            </InfoBox>
        </>
    );

    /* =====================================================
     * IMPLEMENTATION
     * ===================================================== */

    const renderSefirah = () => (
        <>
            <SectionTitle
                eyebrow="08 • IMPLEMENTATION"
                title="Actual Sefirah DevOps architecture"
                description="The implemented stack uses a multi-stage Docker build, three Sefirah application services, environment configuration and an Nginx public entry point."
            />

            <LoadBalancerVisualizer />

            <CodeBlock
                label="ACTUAL DOCKER COMPOSE ARCHITECTURE"
                code={`services:
  sefirah-1:
    build: .
    expose:
      - "3000"
    env_file:
      - .env.local

  sefirah-2:
    build: .
    expose:
      - "3000"
    env_file:
      - .env.local

  sefirah-3:
    build: .
    expose:
      - "3000"
    env_file:
      - .env.local

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
    depends_on:
      - sefirah-1
      - sefirah-2
      - sefirah-3`}
            />

            <InfoBox title="What we actually implemented">
                All three Sefirah services are built from the same
                Dockerfile. They expose port 3000 inside Docker rather than
                publishing separate host ports. Nginx publishes port 80 and
                acts as the public entry point.
            </InfoBox>

            <InfoBox title="Why this architecture is useful" accent="#2f9e44">
                The application can have multiple backend replicas while
                users interact with one public endpoint. This separates
                public traffic handling from the application containers.
            </InfoBox>

            <InfoBox
                title="What would happen without the proxy layer"
                accent="#e67700"
            >
                Multiple replicas could still exist, but clients would need a
                separate way to choose or discover which backend instance to
                contact.
            </InfoBox>
        </>
    );

    const renderEnvironment = () => (
        <>
            <SectionTitle
                eyebrow="09 • IMPLEMENTATION"
                title="Environment variables and MONGODB_URI"
                description="The Sefirah build required MongoDB configuration during the Next.js production build, while the running containers also load environment configuration."
            />

            <CodeBlock
                label="ACTUAL DOCKERFILE BUILD-TIME CONFIGURATION"
                code={`# Build-time environment variable.
# This is supplied by docker-compose.yml.
ARG MONGODB_URI
ENV MONGODB_URI=$MONGODB_URI

RUN npm run build`}
            />

            <CodeBlock
                label="ACTUAL COMPOSE BUILD ARGUMENT"
                code={`build:
  context: .
  dockerfile: Dockerfile
  args:
    MONGODB_URI: \${MONGODB_URI}`}
            />

            <CodeBlock
                label="ACTUAL RUNTIME ENVIRONMENT FILE"
                code={`env_file:
  - .env.local`}
            />

            <CommandLesson
                title="Build with the required MongoDB configuration"
                command={`docker build \\
  --build-arg MONGODB_URI="$MONGODB_URI" \\
  -t sefirah .`}
                does="The build argument provides MONGODB_URI to the Docker build. The Dockerfile then exposes it to the build environment before npm run build executes."
                why="The Sefirah project encountered a production build requirement where MongoDB configuration was needed while Next.js generated the application build."
                without="If the build requires MONGODB_URI but it is only provided after the container starts, the production build can fail before the runtime container exists."
            />

            <InfoBox title="Security principle" accent="#e67700">
                Environment values such as database connection strings should
                not be hard-coded into application source or committed to a
                public repository. Production environments should provide
                their own secure configuration.
            </InfoBox>
        </>
    );

    const renderDocker = () => (
        <>
            <SectionTitle
                eyebrow="10 • IMPLEMENTATION"
                title="Dockerizing Sefirah"
                description="Sefirah uses a multi-stage Dockerfile that builds the Next.js application in one stage and creates a smaller runtime environment in another."
            />

            <CodeBlock
                label="ACTUAL SEFIRAH DOCKERFILE"
                code={`# =========================================================
# BUILDER
# =========================================================

FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

ARG MONGODB_URI
ENV MONGODB_URI=$MONGODB_URI

RUN npm run build


# =========================================================
# RUNNER
# =========================================================

FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

COPY --from=builder /app/public ./public

COPY --from=builder /app/.next ./.next

COPY --from=builder /app/node_modules ./node_modules

COPY --from=builder /app/package.json ./package.json

EXPOSE 3000

CMD ["npm", "start"]`}
            />

            <DockerBuildVisualizer />

            <CommandLesson
                title="Build the actual Sefirah image"
                command={`docker compose build

docker images`}
                does="docker compose build processes the Dockerfile for each declared Sefirah service. docker images can then be used to inspect locally stored image artifacts."
                why="The Dockerfile defines the application environment as code, allowing the same build procedure to be repeated."
                without="Without an image build definition, each environment would need to manually reproduce the Node.js runtime, dependencies and production build."
            />

            <CommandLesson
                title="Inspect the running containers"
                command={`docker compose up -d

docker compose ps

docker stats --no-stream`}
                does="The stack starts in the background, service status is displayed and Docker reports container resource usage."
                why="Verification commands confirm that the configuration not only builds but also produces running containers."
                without="A successful image build alone does not prove that the runtime command, environment configuration or networking actually works."
            />
        </>
    );

    const renderPipeline = () => (
        <>
            <SectionTitle
                eyebrow="11 • IMPLEMENTATION"
                title="Continuous integration pipeline"
                description="The CI objective is to automatically validate that the repository can install dependencies and produce a production build in an independent environment."
            />

            <StepsVisualizer
                steps={[
                    "Push",
                    "Checkout",
                    "npm ci",
                    "Build",
                    "Validation",
                    "Result",
                ]}
            />

            <CodeBlock
                label="CI VALIDATION EXAMPLE"
                code={`name: Sefirah CI

on:
  push:

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: 20

      - run: npm ci

      - run: npm run build`}
            />

            <CommandLesson
                title="Install dependencies reproducibly"
                command={`npm ci`}
                does="npm ci installs dependencies according to the project's lockfile and is designed for clean, repeatable installation environments."
                why="CI should avoid depending on whatever packages happen to be cached or installed on a developer's machine."
                without="A non-reproducible dependency installation can make builds differ between environments and make failures harder to reproduce."
            />

            <CommandLesson
                title="Validate the production build"
                command={`npm run build`}
                does="Next.js performs its production build process and generates the application artifacts required by the configured production runtime."
                why="This catches problems that development mode may not reveal."
                without="A project could appear to work while developing but fail only when production compilation or route generation occurs."
            />
        </>
    );

    const renderDeployment = () => (
        <>
            <SectionTitle
                eyebrow="12 • IMPLEMENTATION"
                title="Deployment and production validation"
                description="Deployment is another validation environment. A project can compile locally yet expose configuration or build artifact problems when another platform builds it."
            />

            <Card>
                <MiniBadge>DEPLOYMENT ISSUE</MiniBadge>

                <h2
                    style={{
                        margin: "13px 0 8px",
                        fontSize: "18px",
                        color: "#1d2921",
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
                        color: "#657269",
                        fontSize: "12px",
                        lineHeight: 1.75,
                    }}
                >
                    The deployment workflow exposed an expected output file
                    that was not present in the generated build artifact.
                    This demonstrates why deployment environments are useful
                    as independent validation systems.
                </p>
            </Card>

            <CommandLesson
                title="Reproduce production checks before deployment"
                command={`npm run build

docker compose build

docker compose up -d

docker compose logs`}
                does="The production application is built, the container image is rebuilt, the stack is started and logs are inspected for runtime failures."
                why="Running these stages together tests more of the delivery path before relying on a production deployment platform."
                without="If only local development mode is tested, production-only build or container issues may first appear after deployment."
            />

            <InfoBox title="Important outcome">
                A deployment platform is not merely a hosting destination. It
                is also an independent environment that can expose hidden
                assumptions about files, configuration, dependencies and build
                output.
            </InfoBox>
        </>
    );

    const renderOptimization = () => (
        <>
            <SectionTitle
                eyebrow="13 • IMPLEMENTATION"
                title="Docker optimization and disk management"
                description="Repeated image builds can consume significant storage through images, stopped containers, build cache, networks and volumes."
            />

            <CommandLesson
                title="Inspect Docker disk usage"
                command={`docker system df

docker image ls

docker builder du`}
                does="docker system df summarizes Docker storage usage, docker image ls lists images and docker builder du examines build cache usage."
                why="Storage should be inspected before aggressively deleting resources so the source of disk usage is understood."
                without="Blind cleanup can remove useful caches or data without identifying what was actually consuming disk space."
            />

            <CommandLesson
                title="Remove unused resources"
                command={`docker system prune

docker builder prune -a`}
                does="docker system prune removes unused Docker resources. docker builder prune -a removes unused build cache more aggressively."
                why="Cleanup can reclaim storage after repeated development and build cycles."
                without="Unused images, stopped containers and cache layers can continue accumulating until local storage becomes constrained."
            />

            <InfoBox title="Why cleanup can make the next build slower" accent="#e67700">
                Docker caching exists to avoid repeating expensive operations.
                If build cache is removed, Docker may need to download base
                images and rerun dependency installation or other build steps.
                Cleanup saves disk space, but excessive cleanup can trade disk
                space for slower future builds.
            </InfoBox>

            <CodeBlock
                label="CACHE-FRIENDLY DOCKERFILE ORDER"
                code={`COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build`}
            />

            <InfoBox title="What this ordering does">
                Dependency files are copied before the complete source tree.
                When only application source changes, Docker can potentially
                reuse the cached dependency installation layer. If all source
                files were copied before npm ci, small code changes could
                invalidate the dependency layer and force installation again.
            </InfoBox>
        </>
    );

    /* =====================================================
     * CURRENT SECTION
     * ===================================================== */

    const renderCurrent = () => {
        switch (section) {
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

    /* =====================================================
     * RENDER
     * ===================================================== */

    return (
        <div
            data-devops-window
            onMouseDown={onFocus}
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
                minWidth: "820px",
                minHeight: "580px",
                zIndex: windowPosition.zIndex,
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
                background: "#ffffff",
                border: "1px solid #b8c8bc",
                borderRadius: "2px",
                boxShadow:
                    "0 18px 55px rgba(21, 36, 26, 0.22)",
                fontFamily: "Inter, sans-serif",
                userSelect: isDragging ? "none" : "auto",
            }}
        >
            {/* TITLE BAR */}

            <div
                onMouseDown={handleDragStart}
                style={{
                    height: `${TITLE_BAR_HEIGHT}px`,
                    flexShrink: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "0 12px 0 14px",
                    borderBottom:
                        "1px solid rgba(195, 211, 199, 0.8)",
                    background:
                        "rgba(255, 255, 255, 0.76)",
                    backdropFilter: "blur(16px)",
                    cursor: isDragging ? "grabbing" : "grab",
                }}
            >
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                    }}
                >

                    <span
                        style={{
                            color: "#28372e",
                            fontSize: "12px",
                            fontWeight: 750,
                        }}
                    >
                        DevOps Lab
                    </span>

                    <span
                        style={{
                            color: "#8a958e",
                            fontSize: "9px",
                            borderLeft: "1px solid #d6dfd8",
                            paddingLeft: "9px",
                        }}
                    >
                        Sefirah
                    </span>
                </div>

                <button
                    onMouseDown={(event) =>
                        event.stopPropagation()
                    }
                    onClick={onClose}
                    style={{
                        width: "26px",
                        height: "26px",
                        border: "none",
                        background: "transparent",
                        color: "#68746c",
                        cursor: "pointer",
                        fontSize: "18px",
                        lineHeight: 1,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                    aria-label="Close DevOps Lab"
                >
                    ×
                </button>
            </div>

            {/* BODY */}

            <div
                style={{
                    flex: 1,
                    minHeight: 0,
                    display: "grid",
                    gridTemplateColumns: "218px 1fr",
                    overflow: "hidden",
                }}
            >
                {/* SIDEBAR */}

                <aside
                    style={{
                        borderRight: "1px solid #dce5df",
                        background: "#f8faf8",
                        overflowY: "auto",
                        padding: "14px 0",
                    }}
                >
                    <div style={{ padding: "0 13px 10px" }}>
                        <div
                            style={{
                                display: "flex",
                                border: "1px solid #d4dfd6",
                                background: "#fff",
                            }}
                        >
                            <button
                                onClick={() =>
                                    setGroup("theory")
                                }
                                style={{
                                    flex: 1,
                                    border: "none",
                                    padding: "8px 4px",
                                    background:
                                        group === "theory"
                                            ? "#238b45"
                                            : "transparent",
                                    color:
                                        group === "theory"
                                            ? "#fff"
                                            : "#738077",
                                    cursor: "pointer",
                                    fontFamily:
                                        "Inter, sans-serif",
                                    fontSize: "9px",
                                    fontWeight: 800,
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
                                    flex: 1,
                                    border: "none",
                                    padding: "8px 4px",
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
                                    cursor: "pointer",
                                    fontFamily:
                                        "Inter, sans-serif",
                                    fontSize: "9px",
                                    fontWeight: 800,
                                }}
                            >
                                IMPLEMENTATION
                            </button>
                        </div>
                    </div>

                    <div
                        style={{
                            padding: "8px 13px 6px",
                            color: "#8a958e",
                            fontSize: "9px",
                            fontWeight: 800,
                            letterSpacing: "0.09em",
                        }}
                    >
                        {group === "theory"
                            ? "DEVOPS CONCEPTS"
                            : "SEFIRAH IMPLEMENTATION"}
                    </div>

                    {group === "theory"
                        ? theoryItems.map(renderNavItem)
                        : implementationItems.map(
                            renderNavItem
                        )}
                </aside>

                {/* CONTENT */}

                <main
                    style={{
                        overflowY: "auto",
                        background: "#ffffff",
                        padding: "30px 34px 48px",
                    }}
                >
                    {renderCurrent()}
                </main>
            </div>
        </div>
    );
}