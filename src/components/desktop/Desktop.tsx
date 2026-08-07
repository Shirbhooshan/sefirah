"use client";

import Wallpaper from "./Wallpaper";
import TopBar from "./TopBar";
import Dock from "./Dock";

export default function Desktop() {
  return (
    <main className="relative h-screen overflow-hidden bg-[#080808]">

      <Wallpaper />

      <TopBar />

      {/* Apps & windows go here */}

      <Dock />

    </main>
  );
}