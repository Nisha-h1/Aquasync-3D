import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export const ThreeWaterDroplets: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let width = window.innerWidth;
    let height = window.innerHeight;

    // 1. Scene & Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, width / height, 1, 1000);
    camera.position.z = 400;

    // 2. Renderer (Transparent WebGL layer overlaying water flow)
    const renderer = new THREE.WebGLRenderer({ 
      alpha: true, 
      antialias: true,
      powerPreference: 'high-performance' 
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0); // 100% transparent background
    container.appendChild(renderer.domElement);

    // 3. Procedural Canvas Texture for Glowing Droplets with Specular Glint
    const createDropletTexture = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 128;
      canvas.height = 128;
      const ctx = canvas.getContext('2d');
      if (!ctx) return null;

      const centerX = 64;
      const centerY = 64;
      const radius = 54;

      // Outer ethereal aquatic glow
      const outerGlow = ctx.createRadialGradient(centerX, centerY, radius * 0.2, centerX, centerY, radius);
      outerGlow.addColorStop(0, 'rgba(0, 240, 255, 0.95)');
      outerGlow.addColorStop(0.35, 'rgba(14, 165, 233, 0.7)');
      outerGlow.addColorStop(0.7, 'rgba(56, 189, 248, 0.25)');
      outerGlow.addColorStop(1, 'rgba(0, 240, 255, 0)');

      ctx.fillStyle = outerGlow;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.fill();

      // Refractive Bubble Ring
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius * 0.78, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.85)';
      ctx.lineWidth = 3.5;
      ctx.shadowColor = '#00f0ff';
      ctx.shadowBlur = 10;
      ctx.stroke();

      // Inner soft water core
      const innerCore = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius * 0.7);
      innerCore.addColorStop(0, 'rgba(255, 255, 255, 0.15)');
      innerCore.addColorStop(0.5, 'rgba(6, 182, 212, 0.2)');
      innerCore.addColorStop(1, 'rgba(2, 132, 199, 0.5)');
      ctx.fillStyle = innerCore;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius * 0.76, 0, Math.PI * 2);
      ctx.fill();

      // Specular highlight droplet reflection glint (Top-left)
      ctx.shadowBlur = 0;
      ctx.beginPath();
      ctx.arc(centerX - 18, centerY - 18, 9, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
      ctx.fill();

      // Secondary micro reflection (Bottom-right)
      ctx.beginPath();
      ctx.arc(centerX + 16, centerY + 16, 4.5, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.65)';
      ctx.fill();

      return new THREE.CanvasTexture(canvas);
    };

    const dropletTexture = createDropletTexture();

    // 4. Create Main Particle System (Floating Glowing Water Droplets)
    const particleCount = 220;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const scales = new Float32Array(particleCount);
    const speeds = new Float32Array(particleCount);
    const wobbles = new Float32Array(particleCount);
    const wobbleSpeeds = new Float32Array(particleCount);
    const colors = new Float32Array(particleCount * 3);

    const xRange = 600;
    const yRange = 550;
    const zRange = 350;

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * xRange;
      positions[i * 3 + 1] = (Math.random() - 0.5) * yRange;
      positions[i * 3 + 2] = (Math.random() - 0.5) * zRange;

      // Varied droplet sizes: foreground large water spheres & background delicate mist
      const isBig = Math.random() < 0.15;
      scales[i] = isBig ? Math.random() * 26 + 28 : Math.random() * 16 + 10;

      // Upward buoyant drift speed
      speeds[i] = Math.random() * 0.45 + 0.2;

      // Horizontal wave wobble oscillation
      wobbles[i] = Math.random() * Math.PI * 2;
      wobbleSpeeds[i] = Math.random() * 0.015 + 0.008;

      // Droplet hues: Cyan (0, 0.94, 1), Aqua (0.05, 0.8, 0.95), Deep Azure (0.2, 0.5, 1)
      const colorChoice = Math.random();
      if (colorChoice > 0.6) {
        colors[i * 3] = 0.0;     // R
        colors[i * 3 + 1] = 0.94; // G
        colors[i * 3 + 2] = 1.0;  // B (Electric Cyan)
      } else if (colorChoice > 0.3) {
        colors[i * 3] = 0.25;    // R
        colors[i * 3 + 1] = 0.85; // G
        colors[i * 3 + 2] = 1.0;  // B (Aqua Sky)
      } else {
        colors[i * 3] = 0.45;    // R
        colors[i * 3 + 1] = 0.70; // G
        colors[i * 3 + 2] = 1.0;  // B (Luminescent Azure)
      }
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 24,
      map: dropletTexture,
      transparent: true,
      opacity: 0.85,
      vertexColors: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      sizeAttenuation: true,
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    // 5. Secondary Floating Luminescent Water Mist / Micro-Bubbles
    const mistCount = 160;
    const mistGeo = new THREE.BufferGeometry();
    const mistPositions = new Float32Array(mistCount * 3);
    const mistSpeeds = new Float32Array(mistCount);

    for (let i = 0; i < mistCount; i++) {
      mistPositions[i * 3] = (Math.random() - 0.5) * (xRange * 1.2);
      mistPositions[i * 3 + 1] = (Math.random() - 0.5) * (yRange * 1.2);
      mistPositions[i * 3 + 2] = (Math.random() - 0.5) * (zRange * 1.2);
      mistSpeeds[i] = Math.random() * 0.3 + 0.1;
    }

    mistGeo.setAttribute('position', new THREE.BufferAttribute(mistPositions, 3));

    const mistMat = new THREE.PointsMaterial({
      size: 10,
      map: dropletTexture,
      transparent: true,
      opacity: 0.45,
      color: 0x38bdf8,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      sizeAttenuation: true,
    });

    const mistParticles = new THREE.Points(mistGeo, mistMat);
    scene.add(mistParticles);

    // 6. Interactive Mouse Fluid Flow Dynamics
    const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    const mouseVelocity = { x: 0, y: 0 };
    let lastMouse = { x: 0, y: 0 };

    const handlePointerMove = (e: MouseEvent) => {
      // Normalize to Three.js coordinates
      mouse.targetX = (e.clientX / width) * 2 - 1;
      mouse.targetY = -(e.clientY / height) * 2 + 1;

      mouseVelocity.x = (e.clientX - lastMouse.x) * 0.005;
      mouseVelocity.y = (e.clientY - lastMouse.y) * 0.005;
      lastMouse = { x: e.clientX, y: e.clientY };
    };

    // Click burst: spawn an upward effervescent bubble surge
    const handlePointerClick = (e: MouseEvent) => {
      const clickX = ((e.clientX / width) * 2 - 1) * (xRange * 0.4);
      const clickY = (-(e.clientY / height) * 2 + 1) * (yRange * 0.4);

      const pos = geometry.attributes.position.array as Float32Array;
      // Reposition 15 random droplets near click point to burst upward
      for (let j = 0; j < 18; j++) {
        const idx = Math.floor(Math.random() * particleCount);
        pos[idx * 3] = clickX + (Math.random() - 0.5) * 60;
        pos[idx * 3 + 1] = clickY + (Math.random() - 0.5) * 40;
        speeds[idx] = Math.random() * 2.2 + 1.2; // Fast upward burst
      }
      geometry.attributes.position.needsUpdate = true;
    };

    window.addEventListener('mousemove', handlePointerMove, { passive: true });
    window.addEventListener('click', handlePointerClick, { passive: true });

    // 7. Window Resize Handler
    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener('resize', handleResize);

    // 8. Animation & Buoyancy Physics Loop
    let animId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth mouse current interpolation
      mouse.x += (mouse.targetX - mouse.x) * 0.05;
      mouse.y += (mouse.targetY - mouse.y) * 0.05;

      // Parallax camera tilt gently swaying with ocean current
      camera.position.x = mouse.x * 35 + Math.sin(elapsedTime * 0.5) * 8;
      camera.position.y = mouse.y * 25 + Math.cos(elapsedTime * 0.4) * 6;
      camera.lookAt(0, 0, 0);

      // Animate main water droplets
      const posArray = geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;

        // Upward buoyancy float
        posArray[i3 + 1] += speeds[i];

        // Horizontal sinusoidal wobble mimicking water buoyancy
        wobbles[i] += wobbleSpeeds[i];
        posArray[i3] += Math.sin(wobbles[i]) * 0.35 + mouse.x * 0.4;
        posArray[i3 + 2] += Math.cos(wobbles[i]) * 0.2;

        // If droplet floats beyond top of viewport, recycle it to bottom with random X/Z
        if (posArray[i3 + 1] > yRange * 0.55) {
          posArray[i3 + 1] = -yRange * 0.55;
          posArray[i3] = (Math.random() - 0.5) * xRange;
          posArray[i3 + 2] = (Math.random() - 0.5) * zRange;
          speeds[i] = Math.random() * 0.45 + 0.2; // Reset speed
        }
      }
      geometry.attributes.position.needsUpdate = true;

      // Animate delicate background mist
      const mistArray = mistGeo.attributes.position.array as Float32Array;
      for (let i = 0; i < mistCount; i++) {
        const i3 = i * 3;
        mistArray[i3 + 1] += mistSpeeds[i];
        mistArray[i3] += Math.sin(elapsedTime * 0.6 + i) * 0.15;

        if (mistArray[i3 + 1] > yRange * 0.6) {
          mistArray[i3 + 1] = -yRange * 0.6;
          mistArray[i3] = (Math.random() - 0.5) * (xRange * 1.2);
        }
      }
      mistGeo.attributes.position.needsUpdate = true;

      renderer.render(scene, camera);
    };

    animate();

    // Cleanup on unmount
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('click', handlePointerClick);
      window.removeEventListener('resize', handleResize);
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      geometry.dispose();
      mistGeo.dispose();
      material.dispose();
      mistMat.dispose();
      if (dropletTexture) dropletTexture.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none z-[1] overflow-hidden"
      aria-hidden="true"
    />
  );
};
