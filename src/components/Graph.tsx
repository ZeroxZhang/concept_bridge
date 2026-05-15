"use client";

import dynamic from "next/dynamic";

const ForceGraph3DNoSSR = dynamic(() => import("./ForceGraph"), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 flex items-center justify-center bg-transparent">
      <div className="text-white/50 animate-pulse">Initializing Universe...</div>
    </div>
  ),
});

export default ForceGraph3DNoSSR;
