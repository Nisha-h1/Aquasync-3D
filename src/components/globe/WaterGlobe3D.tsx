import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { useApp } from '../../context/AppContext';
import { Region } from '../../types';
import { 
  Activity, 
  Droplets, 
  AlertTriangle, 
  MapPin, 
  ShieldCheck, 
  Sparkles, 
  RotateCw, 
  ZoomIn, 
  ZoomOut, 
  Compass, 
  ArrowRight,
  TrendingUp,
  FileCode2,
  Globe2
} from 'lucide-react';

export const WaterGlobe3D: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const { regions, selectedRegion, setSelectedRegion, setCurrentSection } = useApp();
  const [hoveredRegion, setHoveredRegion] = useState<Region | null>(null);
  const [isRotating, setIsRotating] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'water' | 'timeline'>('overview');
  const [textureLoaded, setTextureLoaded] = useState<boolean>(false);

  // Three.js internal references
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const globeGroupRef = useRef<THREE.Group | null>(null);
  const cloudsMeshRef = useRef<THREE.Mesh | null>(null);
  const earthMeshRef = useRef<THREE.Mesh | null>(null);
  const markersRef = useRef<{ mesh: THREE.Mesh; ring: THREE.Mesh; label?: THREE.Sprite; region: Region }[]>([]);
  const targetRotationRef = useRef<{ x: number; y: number }>({ x: 0.2, y: 0 });
  const isDraggingRef = useRef<boolean>(false);
  const prevMouseRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const animFrameIdRef = useRef<number | null>(null);

  // Lat / Lon to 3D Cartesian coordinates on sphere
  const latLongToVector3 = (lat: number, lon: number, radius: number): THREE.Vector3 => {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lon + 180) * (Math.PI / 180);
    const x = -(radius * Math.sin(phi) * Math.cos(theta));
    const z = radius * Math.sin(phi) * Math.sin(theta);
    const y = radius * Math.cos(phi);
    return new THREE.Vector3(x, y, z);
  };

  const getSeverityColor = (severity: string): number => {
    switch (severity) {
      case 'critical': return 0xef4444; // Red
      case 'high': return 0xf97316;     // Orange
      case 'medium': return 0xeab308;   // Yellow
      case 'low': return 0x06b6d4;      // Cyan
      default: return 0x38bdf8;
    }
  };

  // Generate realistic Earth texture canvas (Natural NASA Blue Marble look)
  const createRealisticEarthCanvas = (): HTMLCanvasElement => {
    const canvas = document.createElement('canvas');
    canvas.width = 2048;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d')!;

    // 1. Realistic Deep Blue Ocean with subtle depth gradient
    const oceanGrad = ctx.createLinearGradient(0, 0, 0, canvas.height);
    oceanGrad.addColorStop(0, '#0c2744');
    oceanGrad.addColorStop(0.25, '#12385e');
    oceanGrad.addColorStop(0.5, '#194c7c');
    oceanGrad.addColorStop(0.75, '#12385e');
    oceanGrad.addColorStop(1, '#0c2744');
    ctx.fillStyle = oceanGrad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Continental shelf shallow waters
    ctx.fillStyle = '#1e5f98';
    ctx.filter = 'blur(12px)';

    // Function to draw realistic continent blobs
    const drawLand = (x: number, y: number, w: number, h: number, fillColor: string, blur: number = 0) => {
      ctx.save();
      if (blur > 0) ctx.filter = `blur(${blur}px)`;
      ctx.fillStyle = fillColor;
      ctx.beginPath();
      ctx.ellipse(x, y, w, h, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    };

    // Realistic Colors:
    const deepForest = '#1f4e2b';
    const lushGreen = '#2e6b3c';
    const savannah = '#6e7a3a';
    const desert = '#c4a45a';
    const rock = '#7a6f58';
    const ice = '#f1f5f9';

    // --- NORTH AMERICA ---
    drawLand(480, 290, 240, 160, deepForest); // Canada / North
    drawLand(500, 360, 190, 110, lushGreen);  // USA temperate
    drawLand(430, 380, 80, 80, desert);      // American Southwest / Rockies
    drawLand(470, 470, 70, 70, savannah);    // Mexico
    drawLand(680, 140, 130, 90, ice);        // Greenland ice sheet

    // --- SOUTH AMERICA ---
    drawLand(640, 640, 140, 180, deepForest); // Amazon Basin
    drawLand(670, 730, 110, 140, lushGreen);  // Brazil highlands
    drawLand(590, 750, 40, 200, rock);       // Andes mountains
    drawLand(620, 890, 50, 90, savannah);    // Patagonia

    // --- EUROPE ---
    drawLand(1060, 270, 130, 90, lushGreen);  // Western / Central Europe
    drawLand(1140, 230, 110, 80, deepForest); // Scandinavia / Eastern Europe
    drawLand(1050, 320, 90, 40, savannah);    // Mediterranean

    // --- AFRICA ---
    drawLand(1080, 440, 210, 100, desert);    // Sahara Desert (Golden Tan)
    drawLand(1100, 520, 190, 60, savannah);   // Sahel
    drawLand(1130, 620, 140, 120, deepForest);// Congo Basin (Deep Green)
    drawLand(1150, 740, 90, 90, savannah);    // Southern Africa
    drawLand(1280, 720, 35, 75, lushGreen);   // Madagascar

    // --- EURASIA & ASIA ---
    drawLand(1380, 240, 360, 110, deepForest);// Siberia Taiga
    drawLand(1220, 400, 140, 80, desert);     // Middle East
    drawLand(1420, 380, 180, 90, rock);       // Central Asia / Gobi
    drawLand(1460, 450, 110, 45, '#e2e8f0');  // Himalayas (Snow caps)
    drawLand(1400, 510, 90, 90, lushGreen);   // India subcontinent
    drawLand(1580, 430, 160, 110, lushGreen); // China / East Asia
    drawLand(1600, 580, 130, 80, deepForest); // Southeast Asia
    drawLand(1720, 420, 30, 80, lushGreen);   // Japan

    // --- AUSTRALIA ---
    drawLand(1680, 750, 150, 110, desert);    // Outback (Red/Tan)
    drawLand(1770, 750, 40, 100, lushGreen);  // East Coast
    drawLand(1840, 840, 35, 65, lushGreen);   // New Zealand

    // --- POLAR REGIONS ---
    ctx.fillStyle = ice;
    ctx.fillRect(0, 0, canvas.width, 75);      // Arctic
    ctx.fillRect(0, canvas.height - 95, canvas.width, 95); // Antarctica

    return canvas;
  };

  // Generate realistic atmospheric cloud texture
  const createCloudsCanvas = (): HTMLCanvasElement => {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 512;
    const ctx = canvas.getContext('2d')!;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Procedural wispy clouds
    for (let i = 0; i < 48; i++) {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      const r = Math.random() * 85 + 40;
      const grad = ctx.createRadialGradient(x, y, 0, x, y, r);
      grad.addColorStop(0, 'rgba(255, 255, 255, 0.65)');
      grad.addColorStop(0.4, 'rgba(255, 255, 255, 0.35)');
      grad.addColorStop(0.8, 'rgba(255, 255, 255, 0.1)');
      grad.addColorStop(1, 'transparent');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.ellipse(x, y, r * 1.8, r * 0.7, Math.random() * Math.PI, 0, Math.PI * 2);
      ctx.fill();
    }

    return canvas;
  };

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight || 650;

    // 1. Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 240;
    cameraRef.current = camera;

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 4. Realistic Space Sunlight
    // Main directional sunlight (Warm Sun like in orbit)
    const sunLight = new THREE.DirectionalLight(0xfffaed, 2.8);
    sunLight.position.set(180, 80, 160);
    scene.add(sunLight);

    // Soft celestial ambient light for dark side of Earth
    const ambientLight = new THREE.AmbientLight(0x1a2b42, 1.1);
    scene.add(ambientLight);

    // 5. Globe Group
    const globeGroup = new THREE.Group();
    scene.add(globeGroup);
    globeGroupRef.current = globeGroup;

    const globeRadius = 75;

    // Build realistic Earth canvas texture as immediate base
    const canvasTexture = new THREE.CanvasTexture(createRealisticEarthCanvas());
    canvasTexture.wrapS = THREE.RepeatWrapping;
    canvasTexture.wrapT = THREE.ClampToEdgeWrapping;

    // Photorealistic Earth Sphere Material
    const earthGeo = new THREE.SphereGeometry(globeRadius, 64, 64);
    const earthMat = new THREE.MeshStandardMaterial({
      map: canvasTexture,
      roughness: 0.65,
      metalness: 0.1,
    });

    const earthMesh = new THREE.Mesh(earthGeo, earthMat);
    globeGroup.add(earthMesh);
    earthMeshRef.current = earthMesh;

    // Asynchronously load the high-resolution realistic satellite map
    const textureLoader = new THREE.TextureLoader();
    textureLoader.load(
      '/earth-realistic-map.jpg',
      (texture) => {
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.ClampToEdgeWrapping;
        earthMat.map = texture;
        earthMat.needsUpdate = true;
        setTextureLoaded(true);
      },
      undefined,
      (err) => {
        console.warn('Satellite photo loaded procedural canvas fallback', err);
      }
    );

    // 6. Realistic Atmospheric Clouds Sphere (Orbiting gently above Earth)
    const cloudsCanvas = createCloudsCanvas();
    const cloudsTexture = new THREE.CanvasTexture(cloudsCanvas);
    const cloudsGeo = new THREE.SphereGeometry(globeRadius + 0.8, 48, 48);
    const cloudsMat = new THREE.MeshStandardMaterial({
      map: cloudsTexture,
      transparent: true,
      opacity: 0.55,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const cloudsMesh = new THREE.Mesh(cloudsGeo, cloudsMat);
    globeGroup.add(cloudsMesh);
    cloudsMeshRef.current = cloudsMesh;

    // 7. Natural Rayleigh Atmospheric Blue Glow (Halo around Earth limb)
    const atmosGeo = new THREE.SphereGeometry(globeRadius * 1.05, 32, 32);
    const atmosMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.22,
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending,
    });
    const atmosMesh = new THREE.Mesh(atmosGeo, atmosMat);
    globeGroup.add(atmosMesh);

    // 8. 10 Region Markers (Real Geographic Coordinates)
    markersRef.current = [];
    regions.forEach((region) => {
      const pos = latLongToVector3(region.latitude, region.longitude, globeRadius + 1.2);
      const color = getSeverityColor(region.severity);

      // Outer glowing base ring
      const ringGeo = new THREE.RingGeometry(1.8, 3.0, 24);
      const ringMat = new THREE.MeshBasicMaterial({
        color,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.85,
      });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.position.copy(pos);
      ringMesh.lookAt(new THREE.Vector3(0, 0, 0));
      globeGroup.add(ringMesh);

      // Core Geographic Pin
      const pinGeo = new THREE.SphereGeometry(1.8, 16, 16);
      const pinMat = new THREE.MeshStandardMaterial({
        color,
        emissive: color,
        emissiveIntensity: 0.5,
        roughness: 0.3,
      });
      const pinMesh = new THREE.Mesh(pinGeo, pinMat);
      pinMesh.position.copy(pos);
      pinMesh.userData = { region };
      globeGroup.add(pinMesh);

      markersRef.current.push({ mesh: pinMesh, ring: ringMesh, region });
    });

    // 9. Natural Geodesic Data Transmission Arcs connecting regions
    const arcConnections = [
      ['delhi-rohini', 'lagos-mainland'],
      ['mumbai-dharavi', 'bangalore-whitefield'],
      ['bangkok-rattanakosin', 'shanghai-pudong'],
      ['sao-paulo-zona-leste', 'mexico-city-iztapalapa'],
      ['cairo-giza', 'delhi-rohini']
    ];

    arcConnections.forEach(([srcId, dstId]) => {
      const srcReg = regions.find(r => r.id === srcId);
      const dstReg = regions.find(r => r.id === dstId);
      if (srcReg && dstReg) {
        const v1 = latLongToVector3(srcReg.latitude, srcReg.longitude, globeRadius + 1.2);
        const v2 = latLongToVector3(dstReg.latitude, dstReg.longitude, globeRadius + 1.2);

        const mid = v1.clone().add(v2).multiplyScalar(0.5);
        const midDist = mid.length();
        mid.normalize().multiplyScalar(midDist + 18);

        const curve = new THREE.QuadraticBezierCurve3(v1, mid, v2);
        const points = curve.getPoints(40);
        const curveGeo = new THREE.BufferGeometry().setFromPoints(points);
        const curveMat = new THREE.LineBasicMaterial({
          color: 0x38bdf8,
          transparent: true,
          opacity: 0.45,
        });
        const arcLine = new THREE.Line(curveGeo, curveMat);
        globeGroup.add(arcLine);
      }
    });

    // 10. Interactive Raycaster for picking regions
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const onPointerMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const markerMeshes = markersRef.current.map(m => m.mesh);
      const intersects = raycaster.intersectObjects(markerMeshes);

      if (intersects.length > 0) {
        const reg = intersects[0].object.userData.region as Region;
        setHoveredRegion(reg);
        container.style.cursor = 'pointer';
      } else {
        setHoveredRegion(null);
        container.style.cursor = isDraggingRef.current ? 'grabbing' : 'grab';
      }
    };

    const onPointerDown = (e: MouseEvent) => {
      isDraggingRef.current = true;
      prevMouseRef.current = { x: e.clientX, y: e.clientY };
    };

    const onPointerUp = (e: MouseEvent) => {
      isDraggingRef.current = false;

      const rect = container.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(mouse, camera);
      const markerMeshes = markersRef.current.map(m => m.mesh);
      const intersects = raycaster.intersectObjects(markerMeshes);

      if (intersects.length > 0) {
        const reg = intersects[0].object.userData.region as Region;
        setSelectedRegion(reg);
        focusOnRegion(reg);
      }
    };

    const onPointerDrag = (e: MouseEvent) => {
      if (!isDraggingRef.current) return;
      const deltaX = e.clientX - prevMouseRef.current.x;
      const deltaY = e.clientY - prevMouseRef.current.y;
      prevMouseRef.current = { x: e.clientX, y: e.clientY };

      targetRotationRef.current.y += deltaX * 0.005;
      targetRotationRef.current.x += deltaY * 0.005;
      targetRotationRef.current.x = Math.max(-Math.PI / 2.3, Math.min(Math.PI / 2.3, targetRotationRef.current.x));
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      camera.position.z += e.deltaY * 0.15;
      camera.position.z = Math.max(120, Math.min(320, camera.position.z));
    };

    container.addEventListener('mousemove', onPointerMove);
    container.addEventListener('mousedown', onPointerDown);
    window.addEventListener('mouseup', onPointerUp);
    window.addEventListener('mousemove', onPointerDrag);
    container.addEventListener('wheel', onWheel, { passive: false });

    // 11. Animation Loop
    let time = 0;
    const animate = () => {
      time += 0.02;

      if (globeGroupRef.current) {
        if (isRotating && !isDraggingRef.current) {
          targetRotationRef.current.y += 0.0015;
        }

        // Smooth damping
        globeGroupRef.current.rotation.y += (targetRotationRef.current.y - globeGroupRef.current.rotation.y) * 0.08;
        globeGroupRef.current.rotation.x += (targetRotationRef.current.x - globeGroupRef.current.rotation.x) * 0.08;
      }

      // Clouds rotate slightly faster than Earth (natural atmospheric physics)
      if (cloudsMeshRef.current) {
        cloudsMeshRef.current.rotation.y += 0.0004;
      }

      // Gentle pulsing of region marker rings
      markersRef.current.forEach((item, idx) => {
        const s = 1 + 0.25 * Math.sin(time * 3 + idx);
        item.ring.scale.set(s, s, s);
      });

      renderer.render(scene, camera);
      animFrameIdRef.current = requestAnimationFrame(animate);
    };

    animFrameIdRef.current = requestAnimationFrame(animate);

    // Resize
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const w = container.clientWidth;
      const h = container.clientHeight || 650;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    if (selectedRegion) {
      focusOnRegion(selectedRegion);
    }

    return () => {
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
      container.removeEventListener('mousemove', onPointerMove);
      container.removeEventListener('mousedown', onPointerDown);
      window.removeEventListener('mouseup', onPointerUp);
      window.removeEventListener('mousemove', onPointerDrag);
      container.removeEventListener('wheel', onWheel);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
    };
  }, [regions]);

  const focusOnRegion = (reg: Region) => {
    const phi = (90 - reg.latitude) * (Math.PI / 180);
    const theta = (reg.longitude + 180) * (Math.PI / 180);

    targetRotationRef.current = {
      x: phi - Math.PI / 2,
      y: -theta + Math.PI / 2
    };

    if (cameraRef.current) {
      cameraRef.current.position.z = 190;
    }
  };

  const handleZoom = (direction: 'in' | 'out') => {
    if (cameraRef.current) {
      const delta = direction === 'in' ? -25 : 25;
      cameraRef.current.position.z = Math.max(120, Math.min(320, cameraRef.current.position.z + delta));
    }
  };

  const handleResetView = () => {
    targetRotationRef.current = { x: 0.2, y: 0 };
    if (cameraRef.current) cameraRef.current.position.z = 240;
  };

  const getSeverityBadgeClass = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500/20 text-red-400 border-red-500/40';
      case 'high': return 'bg-orange-500/20 text-orange-400 border-orange-500/40';
      case 'medium': return 'bg-amber-500/20 text-amber-400 border-amber-500/40';
      default: return 'bg-cyan-500/20 text-cyan-400 border-cyan-500/40';
    }
  };

  return (
    <div className="relative w-full h-[780px] rounded-2xl overflow-hidden glass-panel border border-cyan-500/20 shadow-2xl flex flex-col lg:flex-row">
      {/* 3D Realistic Earth Canvas Viewport */}
      <div className="relative flex-1 h-[450px] lg:h-full cursor-grab active:cursor-grabbing">
        <div ref={mountRef} className="w-full h-full" />

        {/* Top Floating Telemetry Overlay */}
        <div className="absolute top-4 left-4 z-10 flex flex-wrap items-center gap-2 pointer-events-none">
          <div className="pointer-events-auto px-3.5 py-1.5 rounded-xl bg-slate-950/85 backdrop-blur-md border border-cyan-500/40 text-xs flex items-center gap-2 shadow-lg">
            <Globe2 className="w-4 h-4 text-cyan-400" />
            <span className="font-bold text-white">Realistic Earth Photosphere</span>
            <span className="text-slate-400">| Natural Continents & Oceans</span>
          </div>

          <div className="pointer-events-auto px-3 py-1.5 rounded-xl bg-slate-950/85 backdrop-blur-md border border-slate-700 text-xs text-slate-300">
            Drag to rotate • Wheel to zoom
          </div>
        </div>

        {/* Hover Tooltip */}
        {hoveredRegion && (
          <div className="absolute bottom-6 left-6 z-20 pointer-events-none px-4 py-2.5 rounded-xl bg-slate-950/95 backdrop-blur-md border border-cyan-400/50 shadow-2xl animate-fade-in">
            <div className="text-sm font-bold text-white flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-cyan-400" />
              {hoveredRegion.name}
            </div>
            <div className="text-xs text-slate-300 mt-1 flex items-center gap-3">
              <span>Cases: <strong className="text-cyan-300">{hoveredRegion.syntheticCases}</strong></span>
              <span>Water: <strong className="text-amber-300">{hoveredRegion.waterQuality.coliformCfu} CFU</strong></span>
              <span className={`px-1.5 py-0.5 rounded text-[10px] uppercase font-bold ${getSeverityBadgeClass(hoveredRegion.severity)}`}>
                {hoveredRegion.severity}
              </span>
            </div>
          </div>
        )}

        {/* Interactive Globe Controls */}
        <div className="absolute bottom-6 right-6 z-10 flex flex-col gap-2">
          <button
            onClick={() => setIsRotating(!isRotating)}
            title={isRotating ? 'Pause Rotation' : 'Resume Auto-Rotation'}
            className={`p-2.5 rounded-xl backdrop-blur-md border transition-all text-white ${
              isRotating ? 'bg-cyan-500/20 border-cyan-400/50 text-cyan-300 shadow-[0_0_15px_rgba(0,240,255,0.3)]' : 'bg-slate-900/80 border-slate-700 text-slate-400'
            }`}
          >
            <RotateCw className={`w-4 h-4 ${isRotating ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={() => handleZoom('in')}
            title="Zoom In"
            className="p-2.5 rounded-xl bg-slate-900/80 backdrop-blur-md border border-slate-700 hover:border-cyan-400 text-slate-200 transition-all"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleZoom('out')}
            title="Zoom Out"
            className="p-2.5 rounded-xl bg-slate-900/80 backdrop-blur-md border border-slate-700 hover:border-cyan-400 text-slate-200 transition-all"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={handleResetView}
            title="Reset Perspective"
            className="p-2.5 rounded-xl bg-slate-900/80 backdrop-blur-md border border-slate-700 hover:border-cyan-400 text-slate-200 transition-all"
          >
            <Compass className="w-4 h-4" />
          </button>
        </div>

        {/* Region Quick Select Bar */}
        <div className="absolute top-16 left-4 z-10 flex flex-wrap gap-1.5 max-w-[420px] pointer-events-auto">
          {regions.map((r) => (
            <button
              key={r.id}
              onClick={() => {
                setSelectedRegion(r);
                focusOnRegion(r);
              }}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-medium border transition-all flex items-center gap-1.5 ${
                selectedRegion?.id === r.id
                  ? 'bg-cyan-500/30 border-cyan-400 text-cyan-100 shadow-[0_0_12px_rgba(0,240,255,0.4)]'
                  : 'bg-slate-950/80 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
              }`}
            >
              <span 
                className="w-1.5 h-1.5 rounded-full" 
                style={{ 
                  backgroundColor: r.severity === 'critical' ? '#ef4444' : r.severity === 'high' ? '#f97316' : r.severity === 'medium' ? '#eab308' : '#06b6d4' 
                }} 
              />
              {r.city}
            </button>
          ))}
        </div>
      </div>

      {/* Selected Region Telemetry Drawer */}
      {selectedRegion && (
        <div className="w-full lg:w-[420px] h-[330px] lg:h-full bg-slate-950/90 backdrop-blur-xl border-t lg:border-t-0 lg:border-l border-cyan-500/20 p-6 flex flex-col justify-between overflow-y-auto">
          <div>
            {/* Header */}
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold border ${getSeverityBadgeClass(selectedRegion.severity)}`}>
                    {selectedRegion.severity}
                  </span>
                  <span className="text-[11px] text-slate-400 font-mono">
                    Lat {selectedRegion.latitude.toFixed(2)}°, Lon {selectedRegion.longitude.toFixed(2)}°
                  </span>
                </div>
                <h3 className="text-xl font-bold text-white mt-1.5 flex items-center gap-2">
                  {selectedRegion.name}
                </h3>
                <p className="text-xs text-slate-400">{selectedRegion.country} | Pop. {(selectedRegion.population / 1000000).toFixed(1)}M (Demo Area)</p>
              </div>
            </div>

            {/* Segment Tabs */}
            <div className="grid grid-cols-3 gap-1 bg-slate-900/60 p-1 rounded-lg border border-slate-800 mt-4 text-xs font-medium">
              <button
                onClick={() => setActiveTab('overview')}
                className={`py-1.5 rounded-md transition-all ${
                  activeTab === 'overview' ? 'bg-cyan-500/20 text-cyan-300 font-semibold shadow-sm' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Health
              </button>
              <button
                onClick={() => setActiveTab('water')}
                className={`py-1.5 rounded-md transition-all ${
                  activeTab === 'water' ? 'bg-cyan-500/20 text-cyan-300 font-semibold shadow-sm' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Water Lab
              </button>
              <button
                onClick={() => setActiveTab('timeline')}
                className={`py-1.5 rounded-md transition-all ${
                  activeTab === 'timeline' ? 'bg-cyan-500/20 text-cyan-300 font-semibold shadow-sm' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                7-Day Trend
              </button>
            </div>

            {/* Tab 1: Overview */}
            {activeTab === 'overview' && (
              <div className="mt-4 space-y-3.5">
                <div className="grid grid-cols-3 gap-2">
                  <div className="p-2.5 rounded-xl bg-slate-900/50 border border-slate-800 text-center">
                    <span className="text-[10px] text-slate-400 block uppercase">Synthetic Cases</span>
                    <span className="text-xl font-extrabold text-white mt-0.5 block">{selectedRegion.syntheticCases}</span>
                    <span className="text-[9px] text-rose-400 font-mono">+{selectedRegion.newCasesLast24h} (24h)</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-900/50 border border-slate-800 text-center">
                    <span className="text-[10px] text-slate-400 block uppercase">Hospitalized</span>
                    <span className="text-xl font-extrabold text-amber-300 mt-0.5 block">{selectedRegion.hospitalized}</span>
                    <span className="text-[9px] text-slate-400 font-mono">{((selectedRegion.hospitalized / selectedRegion.syntheticCases) * 100).toFixed(0)}% triage</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-900/50 border border-slate-800 text-center">
                    <span className="text-[10px] text-slate-400 block uppercase">Recovered</span>
                    <span className="text-xl font-extrabold text-emerald-400 mt-0.5 block">{selectedRegion.recovered}</span>
                    <span className="text-[9px] text-slate-400 font-mono">Simulated</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-300 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Primary Water Source:</span>
                    <strong className="text-cyan-300 font-medium">{selectedRegion.waterSource}</strong>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Contaminant Strain:</span>
                    <strong className="text-rose-300 font-medium truncate max-w-[210px]">{selectedRegion.contaminationType}</strong>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Correlation Index:</span>
                    <strong className="text-cyan-400 font-mono">{selectedRegion.syntheticCorrelation}% (Simulated)</strong>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-cyan-950/20 border border-cyan-500/20 text-xs">
                  <div className="flex items-center gap-1.5 text-cyan-300 font-semibold mb-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Real-World Geographic Intelligence</span>
                  </div>
                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    {selectedRegion.description}
                  </p>
                </div>
              </div>
            )}

            {/* Tab 2: Water Lab */}
            {activeTab === 'water' && (
              <div className="mt-4 space-y-3">
                <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400 flex items-center gap-1.5">
                      <Droplets className="w-3.5 h-3.5 text-cyan-400" />
                      Coliform Density (CFU/100mL):
                    </span>
                    <span className="font-mono font-bold text-rose-400 text-sm">{selectedRegion.waterQuality.coliformCfu}</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-cyan-400 via-amber-400 to-rose-500 h-1.5 rounded-full" 
                      style={{ width: `${Math.min(100, (selectedRegion.waterQuality.coliformCfu / 5000) * 100)}%` }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-slate-900/50 border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">pH Level</span>
                    <span className="font-mono text-base font-bold text-white mt-0.5 block">{selectedRegion.waterQuality.pH}</span>
                    <span className="text-[9px] text-slate-400">Baseline: 6.5 - 8.5</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-900/50 border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">Turbidity (NTU)</span>
                    <span className="font-mono text-base font-bold text-amber-300 mt-0.5 block">{selectedRegion.waterQuality.turbidityNtu}</span>
                    <span className="text-[9px] text-slate-400">WHO Spec: &lt;5 NTU</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-900/50 border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">Free Chlorine</span>
                    <span className="font-mono text-base font-bold text-cyan-300 mt-0.5 block">{selectedRegion.waterQuality.chlorineMgL} mg/L</span>
                    <span className="text-[9px] text-rose-400">Deficient</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-900/50 border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">Water Temp</span>
                    <span className="font-mono text-base font-bold text-white mt-0.5 block">{selectedRegion.waterQuality.temperatureC}°C</span>
                    <span className="text-[9px] text-slate-400">Ambient</span>
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <p className="text-[11px] leading-snug">
                    Simulated lab flag: Biological breakthrough confirmed at distributor outlet. Chlorine residual insufficient for microbiological barrier.
                  </p>
                </div>
              </div>
            )}

            {/* Tab 3: Timeline */}
            {activeTab === 'timeline' && (
              <div className="mt-4 space-y-3">
                <div className="text-xs text-slate-400 mb-1 flex items-center justify-between">
                  <span>Simulated Epidemic Curve vs Water Coliform</span>
                  <span className="text-cyan-400 font-mono">7 Days</span>
                </div>

                <div className="space-y-1.5">
                  {selectedRegion.timeline.map((point, index) => {
                    const maxCases = Math.max(...selectedRegion.timeline.map(t => t.cases));
                    const widthPercent = (point.cases / maxCases) * 100;
                    return (
                      <div key={index} className="flex items-center gap-2 text-xs">
                        <span className="w-12 text-[10px] font-mono text-slate-400">{point.day}</span>
                        <div className="flex-1 bg-slate-900 rounded-md h-5 p-0.5 relative overflow-hidden flex items-center">
                          <div 
                            className="bg-gradient-to-r from-cyan-500/40 to-cyan-400 h-full rounded transition-all duration-500"
                            style={{ width: `${widthPercent}%` }}
                          />
                          <span className="absolute left-2 text-[10px] font-mono text-slate-200">
                            {point.cases} cases
                          </span>
                        </div>
                        <span className="w-16 text-right text-[10px] font-mono text-amber-300">
                          {point.waterColiform} CFU
                        </span>
                      </div>
                    );
                  })}
                </div>

                <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-[11px] text-slate-300 mt-2 flex items-center gap-2">
                  <TrendingUp className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span>Projected trajectory: <strong className="text-rose-400">{selectedRegion.predictedSpread}</strong></span>
                </div>
              </div>
            )}
          </div>

          {/* Quick Action Navigation Footer */}
          <div className="pt-4 border-t border-slate-800 flex items-center gap-2">
            <button
              onClick={() => setCurrentSection('fhir')}
              className="flex-1 py-2 px-3 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400/40 text-cyan-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all shadow-md"
            >
              <FileCode2 className="w-3.5 h-3.5" />
              <span>Inspect FHIR</span>
            </button>
            <button
              onClick={() => setCurrentSection('agents')}
              className="flex-1 py-2 px-3 rounded-xl bg-purple-600/30 hover:bg-purple-600/40 border border-purple-500/40 text-purple-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI Agent Insights</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
