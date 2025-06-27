"use client";

import React from "react";

export default function VideoBackground() {
  return (
    <>
      {/* Background Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        className="fixed top-0 left-0 w-full h-full object-cover -z-10"
        src="/videos/background.mp4"
      />

      {/* Dark Overlay */}
      <div className="fixed inset-0 bg-black/60 -z-10" />
    </>
  );
}
