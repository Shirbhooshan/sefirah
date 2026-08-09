"use client";

import MenuBar from "./MenuBar";
import Dock from "./Dock";
import wallpaper from "../../assets/wallpapers/wallpaper-2.png";
import Wallpaper from "./Wallpaper";

export default function Desktop() {
  return (
    <main
      style={{
        position: "relative",
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        background: "#222222",
      }}
    >
      <MenuBar />

      <Wallpaper />

      <Dock
        openApps={[]}
        onOpenApp={(id) => {
          console.log("Opening:", id);
        }}
      />
    </main>
  );
}