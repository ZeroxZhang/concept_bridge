"use client";

import { useState, useCallback } from "react";
import Graph from "@/components/Graph";
import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";

// Starfield can access window/document, so disable SSR for it to avoid hydration mismatch
const StarfieldNoSSR = dynamic(() => import("@/components/Starfield"), { ssr: false });

export default function Home() {
  const [source, setSource] = useState("");
  const [target, setTarget] = useState("");
  const [loading, setLoading] = useState(false);
  const [graphData, setGraphData] = useState<{ nodes: any[]; links: any[] }>({
    nodes: [],
    links: [],
  });

  const handleBridge = async () => {
    if (!source || !target) return;
    setLoading(true);

    try {
      const res = await fetch("/api/bridge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ source, target }),
      });

      if (!res.ok) throw new Error("Failed to bridge concepts");

      const data = await res.json();
      
      setGraphData({
        nodes: data.nodes,
        links: data.links,
      });
    } catch (error) {
      console.error(error);
      alert("Failed to build concept bridge.");
    } finally {
      setLoading(false);
    }
  };

  const handleNodeClick = useCallback(async (node: any) => {
    // Avoid re-expanding nodes that are already expanded, though we could allow it
    if (loading) return;
    
    setLoading(true);
    try {
      const res = await fetch("/api/expand", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ concept: node.id }),
      });

      if (!res.ok) throw new Error("Failed to expand concept");

      const data = await res.json();
      
      setGraphData((prevData) => {
        // Merge new nodes and links, avoiding duplicates
        const existingNodeIds = new Set(prevData.nodes.map((n) => n.id));
        const newNodes = data.nodes.filter((n: any) => !existingNodeIds.has(n.id));
        
        // Ensure the source node exists in our graph just in case
        if (!existingNodeIds.has(node.id)) {
          // This shouldn't happen usually
        }

        const newLinks = data.links.filter((l: any) => {
          // Check if link already exists
          return !prevData.links.some(
            (pl: any) =>
              (pl.source.id === l.source || pl.source === l.source) &&
              (pl.target.id === l.target || pl.target === l.target)
          );
        });

        return {
          nodes: [...prevData.nodes, ...newNodes],
          links: [...prevData.links, ...newLinks],
        };
      });
    } catch (error) {
      console.error(error);
      // alert("Failed to expand concept.");
    } finally {
      setLoading(false);
    }
  }, [loading]);

  return (
    <main className="relative w-screen h-screen bg-black overflow-hidden">
      {/* Background Starfield */}
      <StarfieldNoSSR />

      {/* 3D Graph Container */}
      <div className="absolute inset-0 z-10">
        <Graph graphData={graphData} onNodeClick={handleNodeClick} />
      </div>

      {/* UI Overlay */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center space-x-4 bg-black/40 backdrop-blur-md p-4 rounded-2xl border border-white/10 shadow-[0_0_30px_rgba(255,255,255,0.05)] z-20">
        <input
          type="text"
          value={source}
          onChange={(e) => setSource(e.target.value)}
          placeholder="概念 A (e.g. 宇宙)"
          className="bg-transparent border-b border-white/30 text-white px-2 py-1 outline-none focus:border-white transition-colors w-40 text-center"
        />
        <span className="text-white/50">→</span>
        <input
          type="text"
          value={target}
          onChange={(e) => setTarget(e.target.value)}
          placeholder="概念 B (e.g. 意识)"
          className="bg-transparent border-b border-white/30 text-white px-2 py-1 outline-none focus:border-white transition-colors w-40 text-center"
        />
        <button
          onClick={handleBridge}
          disabled={loading || !source || !target}
          className="ml-4 bg-white text-black px-6 py-2 rounded-full font-medium hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
        >
          {loading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            "连接"
          )}
        </button>
      </div>
      
      {/* Instructions */}
      {graphData.nodes.length === 0 && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white/30 text-center pointer-events-none z-20">
          <h1 className="text-4xl font-light mb-4 tracking-[0.2em]">CONCEPT BRIDGE</h1>
          <p className="text-sm tracking-widest">输入两个概念，探索它们在隐空间中的逻辑桥梁</p>
        </div>
      )}

      {/* Copyright */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-white/20 text-xs tracking-wider z-20 pointer-events-none">
        © 2026 zeroxzhang.cc
      </div>
    </main>
  );
}
