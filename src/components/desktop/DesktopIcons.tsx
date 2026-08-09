"use client";

interface DesktopIconProps {
  name: string;
  icon?: string;
  onDoubleClick?: () => void;
}

export default function DesktopIcon({
  name,
  icon = "📁",
  onDoubleClick,
}: DesktopIconProps) {
  return (
    <button
      onDoubleClick={onDoubleClick}
      className="group flex w-20 flex-col items-center gap-2 rounded-lg p-2 text-center text-xs text-white transition hover:bg-white/10"
    >
      <div className="flex h-12 w-12 items-center justify-center text-4xl">
        {icon}
      </div>

      <span className="max-w-20 truncate">
        {name}
      </span>
    </button>
  );
}