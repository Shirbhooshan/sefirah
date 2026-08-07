export const bootSequence = [

    // Hardware
    { type: "text", text: "CPU: React Runtime 19.2", delay: 250 },
    { type: "text", text: "Memory: 16384 MB", delay: 150 },
    { type: "text", text: "GPU: WebGL Renderer", delay: 150 },
    { type: "text", text: "Storage: Mounted", delay: 200 },
    { type: "space" },

    // Boot
    { type: "task", text: "Performing Power-On Self Test", status: "OK", duration: 500 },
    { type: "task", text: "Checking Memory Integrity", status: "OK", duration: 350 },
    { type: "task", text: "Checking Storage Volumes", status: "OK", duration: 300 },
    { type: "task", text: "Mounting Virtual File System", status: "OK", duration: 450 },
    { type: "task", text: "Loading Runtime Kernel", status: "OK", duration: 700 },
    { type: "task", text: "Loading Display Driver", status: "OK", duration: 350 },
    { type: "task", text: "Loading Audio Engine", status: "OK", duration: 250 },
    { type: "task", text: "Loading Input Manager", status: "OK", duration: 300 },
    { type: "task", text: "Loading Font Registry", status: "OK", duration: 350 },
    { type: "task", text: "Initializing Graphics Pipeline", status: "OK", duration: 500 },
    { type: "space" },

    // System Services
    { type: "task", text: "Starting Notification Center", status: "OK", duration: 300 },
    { type: "task", text: "Starting Window Server", status: "OK", duration: 450 },
    { type: "task", text: "Loading Wallpaper Engine", status: "OK", duration: 300 },
    { type: "task", text: "Building Icon Cache", status: "OK", duration: 400 },
    { type: "task", text: "Loading Process Scheduler", status: "OK", duration: 350 },
    { type: "task", text: "Loading Security Policies", status: "OK", duration: 500 },
    { type: "task", text: "Registering Window Manager", status: "OK", duration: 600 },
    { type: "task", text: "Preparing User Workspace", status: "OK", duration: 700 },
    { type: "space" },

    // Operator Detection
    { type: "task", text: "Scanning Registered Operator", status: "INFO", duration: 1400 },
    { type: "task", text: "Operator Metadata Recovered", status: "OK", duration: 600 },
    { type: "text", text: "", delay: 200 },

    { type: "space" },

    { type: "text", text: "Honorific Registry", delay: 250 },
    { type: "text", text: "──────────────────────────────────────", delay: 150 },

    {
        type: "typewriter",
        text: '"The wanderer that belongs to no destination;',
        speed: 35,
    },

    {
        type: "typewriter",
        text: 'The silent observer beyond countless paths;',
        speed: 35,
    },

    {
        type: "typewriter",
        text: 'The one whom every journey remembers."',
        speed: 35,
    },

    { type: "space" },

    // Identity
    { type: "task", text: "Identity Verification", status: "OK", duration: 600 },

    { type: "space" },

    // Journey
    { type: "task", text: "Searching for destination", status: "WARN", duration: 1800 },
    { type: "task", text: "Destination not found", status: "WARN", duration: 700 },
    { type: "task", text: "Searching previous journeys", status: "INFO", duration: 900 },
    { type: "task", text: "Recovering memories", status: "OK", duration: 900 },
    { type: "task", text: "Resuming traversal", status: "OK", duration: 700 },

    { type: "space" },

    // Desktop
    { type: "task", text: "Loading Installed Applications", status: "OK", duration: 500 },
    { type: "task", text: "Initializing Desktop Environment", status: "OK", duration: 700 },
    { type: "task", text: "Synchronizing System Clock", status: "OK", duration: 450 },
    { type: "task", text: "Desktop Environment Ready", status: "OK", duration: 800 },

    { type: "space" },

    { type: "text", text: "────────────────────────────────────────────", delay: 150 },
    { type: "text", text: "Awaiting operator input...", delay: 900 },
    { type: "space" },
    { type: "text", text: "SYSTEM READY.", delay: 300 },
    { type: "text", text: "Press any key to continue...", delay: 300 },
];