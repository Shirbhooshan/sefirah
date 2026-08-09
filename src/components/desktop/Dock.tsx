"use client";

export default function Dock() {
  return (
    <div className="absolute bottom-4 left-1/2 z-50 -translate-x-1/2">

      <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/50 px-4 py-3 shadow-2xl backdrop-blur-xl">

        {/* Finder */}
        <DockItem
          icon="📁"
          label="Files"
        />

        {/* Cooking */}
        <DockItem
          icon="🍳"
          label="Cooking"
        />

        {/* Music */}
        <DockItem
          icon="♫"
          label="Music"
        />

        {/* Settings */}
        <DockItem
          icon="⚙"
          label="Settings"
        />

      </div>

    </div>
  );
}

interface DockItemProps {
  icon: string;
  label: string;
}

function DockItem({
  icon,
  label,
}: DockItemProps) {
  return (
    <button
      title={label}
      className="flex h-12 w-12 items-center justify-center rounded-xl text-2xl transition duration-150 hover:-translate-y-2 hover:scale-110 hover:bg-white/10"
    >
      {icon}
    </button>
  );
}