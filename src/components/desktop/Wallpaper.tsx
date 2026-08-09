"use client";

import wallpaper from "../../assets/wallpapers/wallpaper-2.png";

export default function Wallpaper() {
  return (
    <div
      style={{
        position: "absolute",
        top: "40px", // menu bar height
        left: 0,
        right: 0,
        bottom: 0,

        backgroundImage: `url(${typeof wallpaper === "string" ? wallpaper : wallpaper.src})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",

        zIndex: 0,
      }}
    />
  );
}