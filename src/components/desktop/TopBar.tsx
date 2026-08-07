import { User, Volume2, Monitor, MoreHorizontal } from "lucide-react";

export default function TopBar() {
  return (
    <div className="absolute top-2 left-3 right-3 z-50">
      <header className="flex h-10 w-full items-center justify-between rounded-full bg-black/40 px-5 text-sm font-serif text-white backdrop-blur-md border border-white/10 shadow-lg select-none [font-family:var(--font-merriweather),serif]">
        {/* Left: Applications */}
        <button className="font-semibold hover:text-neutral-300 transition-colors">
          Applications
        </button>

        {/* Middle: Date & Time */}
        <div className="absolute left-1/2 -translate-x-1/2 font-normal text-neutral-200">
          06 Nov 2020 | 10:46 AM
        </div>

        {/* Right: Status Icons */}
        <div className="flex items-center gap-3 text-neutral-300">
          <User className="h-4 w-4 cursor-pointer hover:text-white transition-colors" />
          <Volume2 className="h-4 w-4 cursor-pointer hover:text-white transition-colors" />
          <Monitor className="h-4 w-4 cursor-pointer hover:text-white transition-colors" />
          <MoreHorizontal className="h-4 w-4 cursor-pointer hover:text-white transition-colors" />
        </div>
      </header>
    </div>
  );
}