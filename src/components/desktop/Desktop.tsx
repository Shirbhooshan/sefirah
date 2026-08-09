"use client";

import MenuBar from "./MenuBar";

export default function Desktop() {
  return (
    <main
      style={{
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        backgroundColor: "#292929",
        display: "flex",
        flexDirection: "column",
      }}
    >

      <MenuBar />

      <section
        style={{
          position: "relative",
          width: "100%",
          flex: 1,
          minHeight: 0,
          overflow: "hidden",
          backgroundColor: "#292929",
        }}
      >

        {/* Desktop content will go here */}

      </section>

    </main>
  );
}