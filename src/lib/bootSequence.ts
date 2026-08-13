export const bootSequence = [

    // =========================================
    // HARDWARE — RAPID
    // =========================================

    { type: "text", text: "CPU: React Runtime 19.2", delay: 70 },
    { type: "text", text: "Memory: 16384 MB", delay: 50 },
    { type: "text", text: "GPU: WebGL Renderer", delay: 50 },
    { type: "text", text: "Storage: Mounted", delay: 70 },

    { type: "space" },


    // =========================================
    // BOOT — RAPID
    // =========================================

    { type: "task", text: "Performing Power-On Self Test", status: "OK", duration: 120 },
    { type: "task", text: "Checking Memory Integrity", status: "OK", duration: 100 },
    { type: "task", text: "Checking Storage Volumes", status: "OK", duration: 100 },
    { type: "task", text: "Mounting Virtual File System", status: "OK", duration: 120 },
    { type: "task", text: "Loading Runtime Kernel", status: "OK", duration: 150 },
    { type: "task", text: "Loading Display Driver", status: "OK", duration: 100 },
    { type: "task", text: "Loading Audio Engine", status: "OK", duration: 80 },
    { type: "task", text: "Loading Input Manager", status: "OK", duration: 100 },
    { type: "task", text: "Loading Font Registry", status: "OK", duration: 100 },
    { type: "task", text: "Initializing Graphics Pipeline", status: "OK", duration: 130 },

    { type: "space" },


    // =========================================
    // SYSTEM SERVICES — RAPID
    // =========================================

    { type: "task", text: "Starting Notification Center", status: "OK", duration: 90 },
    { type: "task", text: "Starting Window Server", status: "OK", duration: 120 },
    { type: "task", text: "Loading Wallpaper Engine", status: "OK", duration: 90 },
    { type: "task", text: "Building Icon Cache", status: "OK", duration: 110 },
    { type: "task", text: "Loading Process Scheduler", status: "OK", duration: 100 },
    { type: "task", text: "Loading Security Policies", status: "OK", duration: 130 },
    { type: "task", text: "Registering Window Manager", status: "OK", duration: 140 },
    { type: "task", text: "Preparing User Workspace", status: "OK", duration: 160 },

    { type: "space" },


    // =========================================
    // OPERATOR — RAPID
    // =========================================

    { type: "task", text: "Scanning Registered Operator", status: "INFO", duration: 180 },
    { type: "task", text: "Operator Metadata Recovered", status: "OK", duration: 120 },

    { type: "space" },


    // =========================================
    // JOURNEY — SLOW
    // =========================================

    { type: "task", text: "Searching for journey", status: "INFO", duration: 700 },
    { type: "task", text: "Searching for journey", status: "INFO", duration: 900 },
    { type: "task", text: "Searching for journey", status: "INFO", duration: 1100 },
    { type: "task", text: "Searching for journey", status: "INFO", duration: 900 },

    {
        type: "task",
        text: "Journey found",
        status: "OK",
        duration: 900,
    },

    { type: "space" },


    // =========================================
    // SYSTEM RESUME — RAPID
    // =========================================

    { type: "task", text: "Recovering previous journeys", status: "OK", duration: 130 },
    { type: "task", text: "Restoring traversal state", status: "OK", duration: 120 },
    { type: "task", text: "Loading Installed Applications", status: "OK", duration: 100 },
    { type: "task", text: "Initializing Desktop Environment", status: "OK", duration: 140 },
    { type: "task", text: "Synchronizing System Clock", status: "OK", duration: 100 },
    { type: "task", text: "Desktop Environment Ready", status: "OK", duration: 160 },

    { type: "space" },


    // =========================================
    // READY
    // =========================================

    { type: "text", text: "────────────────────────────────────────────", delay: 60 },
    { type: "text", text: "Awaiting operator input...", delay: 350 },
    { type: "space" },
    { type: "text", text: "SYSTEM READY.", delay: 100 },
    {
        type: "text",
        text: "Press any key to continue...",
        delay: 1000000,
    },
];