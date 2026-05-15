"use client";

import { useEffect, useRef } from "react";
import ForceGraph3D from "react-force-graph-3d";
import * as THREE from "three";

interface ForceGraphProps {
  graphData: {
    nodes: any[];
    links: any[];
  };
  onNodeClick: (node: any) => void;
}

export default function ForceGraph({ graphData, onNodeClick }: ForceGraphProps) {
  const fgRef = useRef<any>(null);

  useEffect(() => {
    // Add a slow rotation to the graph
    let animationFrameId: number;
    
    const rotateGraph = () => {
      if (fgRef.current) {
        const scene = fgRef.current.scene();
        if (scene) {
          scene.rotation.y += 0.001;
        }
      }
      
      // Also rotate individual particle clouds if they exist
      if (fgRef.current && typeof fgRef.current.graphData === 'function') {
        const graphData = fgRef.current.graphData();
        if (graphData && graphData.nodes) {
          graphData.nodes.forEach((node: any) => {
            if (node.__threeObj) {
              node.__threeObj.rotation.y += 0.005;
              node.__threeObj.rotation.x += 0.002;
            }
          });
        }
      }
      
      animationFrameId = requestAnimationFrame(rotateGraph);
    };
    
    rotateGraph();
    
    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <ForceGraph3D
      ref={fgRef}
      graphData={graphData}
      backgroundColor="rgba(0,0,0,0)"
      nodeLabel={(node: any) => `
        <div style="background: rgba(0,0,0,0.8); border: 1px solid rgba(255,255,255,0.1); padding: 8px; border-radius: 6px; max-width: 220px; backdrop-filter: blur(4px); pointer-events: none;">
          <div style="color: ${node.type === 'main' ? '#00f0ff' : '#ffffff'}; font-weight: bold; font-size: 14px; margin-bottom: 4px;">${node.id}</div>
          <div style="color: #aaaaaa; font-size: 12px; white-space: normal; line-height: 1.4;">${node.description || '探索中...'}</div>
        </div>
      `}
      nodeColor={(node: any) => {
        if (node.type === "main") return "#00f0ff";
        if (node.type === "intermediate") return "#ffffff";
        return "#888888";
      }}
      nodeRelSize={6}
      nodeVal={(node: any) => {
        if (node.type === "main") return 20;
        if (node.type === "intermediate") return 10;
        return 5;
      }}
      linkWidth={1}
      linkColor={() => "rgba(255, 255, 255, 0.2)"}
      linkDirectionalParticles={2}
      linkDirectionalParticleWidth={2}
      linkDirectionalParticleSpeed={0.005}
      onNodeClick={onNodeClick}
      nodeThreeObject={(node: any) => {
        const group = new THREE.Group();
        const size = node.type === "main" ? 12 : node.type === "intermediate" ? 8 : 5;
        const color = node.type === "main" ? 0x00f0ff : node.type === "intermediate" ? 0xffffff : 0x888888;

        // 1. Particle Cloud (Instead of solid sphere)
        const particleCount = node.type === "main" ? 400 : node.type === "intermediate" ? 200 : 100;
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);

        for (let i = 0; i < particleCount; i++) {
          // Random point in a spherical volume
          const u = Math.random();
          const v = Math.random();
          const theta = u * 2.0 * Math.PI;
          const phi = Math.acos(2.0 * v - 1.0);
          const r = Math.cbrt(Math.random()) * size;

          const sinPhi = Math.sin(phi);
          positions[i * 3] = r * sinPhi * Math.cos(theta);
          positions[i * 3 + 1] = r * sinPhi * Math.sin(theta);
          positions[i * 3 + 2] = r * Math.cos(phi);
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        
        // Create a soft circular texture for the particles
        const canvas = document.createElement('canvas');
        canvas.width = 16;
        canvas.height = 16;
        const context = canvas.getContext('2d');
        if (context) {
          const gradient = context.createRadialGradient(8, 8, 0, 8, 8, 8);
          gradient.addColorStop(0, 'rgba(255,255,255,1)');
          gradient.addColorStop(1, 'rgba(255,255,255,0)');
          context.fillStyle = gradient;
          context.fillRect(0, 0, 16, 16);
        }
        const map = new THREE.CanvasTexture(canvas);

        const material = new THREE.PointsMaterial({
          color: color,
          size: node.type === "main" ? 1.5 : 1.0,
          map: map,
          transparent: true,
          opacity: 0.8,
          depthWrite: false,
          blending: THREE.AdditiveBlending,
        });

        const particleCloud = new THREE.Points(geometry, material);
        group.add(particleCloud);

        // 2. Faint Inner Core (gives a subtle center mass)
        const coreGeometry = new THREE.SphereGeometry(size * 0.3, 16, 16);
        const coreMaterial = new THREE.MeshBasicMaterial({
          color: color,
          transparent: true,
          opacity: 0.2,
          blending: THREE.AdditiveBlending
        });
        const coreMesh = new THREE.Mesh(coreGeometry, coreMaterial);
        group.add(coreMesh);

        // 3. Text Label
        const sprite = new THREE.Sprite(
          new THREE.SpriteMaterial({
            map: createTextTexture(node.id, node.type),
            depthWrite: false,
            depthTest: false
          })
        );
        // Move the text further up to prevent overlapping with the cloud
        sprite.position.set(0, size + 10, 0);
        sprite.scale.set(30, 15, 1);
        group.add(sprite);

        // Store reference in node so we can animate the rotation
        node.__threeObj = group;

        return group;
      }}
    />
  );
}

// Helper to create text texture for labels
function createTextTexture(text: string, type: string) {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  canvas.width = 256;
  canvas.height = 128;
  
  if (context) {
    context.fillStyle = "rgba(0,0,0,0)";
    context.fillRect(0, 0, canvas.width, canvas.height);
    
    context.font = type === "main" ? "bold 32px Arial" : "bold 24px Arial";
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillStyle = type === "main" ? "rgba(0, 240, 255, 1)" : "rgba(255, 255, 255, 1)";
    
    // Add a stronger glow to the text to ensure it stands out against lines
    context.shadowColor = "rgba(0, 0, 0, 0.8)";
    context.shadowBlur = 8;
    
    // Draw text multiple times for stronger shadow/outline effect
    context.fillText(text, canvas.width / 2, canvas.height / 2);
    context.fillText(text, canvas.width / 2, canvas.height / 2);
    context.fillText(text, canvas.width / 2, canvas.height / 2);
  }
  
  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}
