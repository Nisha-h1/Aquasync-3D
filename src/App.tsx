/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/layout/Navbar';
import { HomeView } from './components/home/HomeView';
import { GlobalDashboard } from './components/dashboard/GlobalDashboard';
import { WaterGlobe3D } from './components/globe/WaterGlobe3D';
import { LiveWorldMap } from './components/map/LiveWorldMap';
import { FhirExplorer } from './components/fhir/FhirExplorer';
import { AiAgentsHub } from './components/ai/AiAgentsHub';
import { InteroperabilityLab } from './components/lab/InteroperabilityLab';
import { VoiceAssistant } from './components/voice/VoiceAssistant';
import { IntegrationHub } from './components/integration/IntegrationHub';
import { AlertsManager } from './components/alerts/AlertsManager';
import { DataTransparency } from './components/transparency/DataTransparency';
import { AuthAndSettings } from './components/auth/AuthAndSettings';
import { InteroperabilityDemo } from './components/interop/InteroperabilityDemo';
import { WaterFlowBackground } from './components/effects/WaterFlowBackground';
import { ThreeWaterDroplets } from './components/effects/ThreeWaterDroplets';
import { FloatingVoiceButton } from './components/voice/FloatingVoiceButton';
import { VortexCursor } from './components/effects/VortexCursor';
import { 
  Droplets, 
  ShieldCheck, 
  Globe2, 
  Info, 
  HeartHandshake, 
  Zap,
  Activity,
  Layers,
  Sparkles
} from 'lucide-react';

const MainContent: React.FC = () => {
  const { currentSection, setCurrentSection } = useApp();

  return (
    <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-[calc(100vh-140px)]">
      {currentSection === 'home' && <HomeView />}
      {currentSection === 'interop-demo' && <InteroperabilityDemo />}
      {currentSection === 'dashboard' && <GlobalDashboard />}
      {currentSection === 'globe' && (
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-4 rounded-xl glass-panel border border-cyan-500/25 text-xs">
            <span className="text-cyan-300 font-semibold flex items-center gap-2">
              <Globe2 className="w-4 h-4 text-cyan-400" />
              <span>3D Global Hydrological Globe: Click any of the 10 markers or drag to rotate.</span>
            </span>
            <span className="text-slate-400 font-mono text-[11px]">
              CRITICAL: Red • HIGH: Orange • MEDIUM: Yellow • LOW: Cyan
            </span>
          </div>
          <WaterGlobe3D />
        </div>
      )}
      {currentSection === 'map' && <LiveWorldMap />}
      {currentSection === 'fhir' && <FhirExplorer />}
      {currentSection === 'agents' && <AiAgentsHub />}
      {currentSection === 'lab' && <InteroperabilityLab />}
      {currentSection === 'voice' && <VoiceAssistant />}
      {currentSection === 'integration' && <IntegrationHub />}
      {currentSection === 'alerts' && <AlertsManager />}
      {currentSection === 'transparency' && <DataTransparency />}
      {currentSection === 'settings' && <AuthAndSettings />}
    </main>
  );
};

const Footer: React.FC = () => {
  const { setCurrentSection } = useApp();

  return (
    <footer className="relative z-10 border-t border-cyan-500/20 bg-slate-950/90 backdrop-blur-xl py-10 mt-16 text-xs text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center shadow-[0_0_15px_rgba(0,240,255,0.3)]">
            <Droplets className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <div className="font-bold text-white text-sm flex items-center gap-2">
              <span>AquaSync 3D — Water Health Intelligence</span>
              <span className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                FLOW THEME ACTIVE
              </span>
            </div>
            <div className="text-[11px] text-slate-500">IEEE One Health / Digital Health Standards Hackathon Project</div>
          </div>
        </div>

        {/* Links */}
        <div className="flex flex-wrap items-center gap-4 text-slate-400 text-xs">
          <button onClick={() => setCurrentSection('home')} className="hover:text-cyan-300 transition-colors">Home</button>
          <button onClick={() => setCurrentSection('globe')} className="hover:text-cyan-300 transition-colors">3D Globe</button>
          <button onClick={() => setCurrentSection('fhir')} className="hover:text-cyan-300 transition-colors">FHIR Explorer</button>
          <button onClick={() => setCurrentSection('agents')} className="hover:text-cyan-300 transition-colors">AI Agents</button>
          <button onClick={() => setCurrentSection('lab')} className="hover:text-cyan-300 transition-colors">Interoperability Lab</button>
          <button onClick={() => setCurrentSection('integration')} className="hover:text-cyan-300 transition-colors">Integration Hub</button>
          <button onClick={() => setCurrentSection('transparency')} className="hover:text-cyan-300 text-cyan-400 font-semibold transition-colors">Data Transparency</button>
        </div>

        {/* Disclaimer */}
        <div className="text-right text-[11px] text-slate-500 max-w-xs">
          <span>All demonstration statistics are synthetic/demo data for technological validation purposes.</span>
        </div>
      </div>
    </footer>
  );
};

export default function App() {
  return (
    <AppProvider>
      <div className="min-h-screen bg-[#030712] text-slate-100 flex flex-col selection:bg-cyan-500/30 selection:text-cyan-200 relative overflow-hidden">
        {/* Dynamic Water Flow Background with Interactive Mouse Ripples */}
        <WaterFlowBackground />

        {/* Three.js 3D Floating Glowing Water Droplets & Bubble Particle System */}
        <ThreeWaterDroplets />

        {/* Floating Voice Assistant Button in Right Corner */}
        <FloatingVoiceButton />

        {/* Custom Mini Aquatic Vortex Sign Cursor */}
        <VortexCursor />

        {/* Main Interface Content Layer */}
        <Navbar />
        <MainContent />
        <Footer />
      </div>
    </AppProvider>
  );
}
