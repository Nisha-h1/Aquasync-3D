import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Globe2, 
  Droplets, 
  Activity, 
  Cpu, 
  Share2, 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  Database, 
  Zap, 
  CheckCircle2, 
  XCircle,
  Building2,
  FileCode2,
  Mic,
  Play,
  Layers,
  Terminal,
  Info
} from 'lucide-react';
import { WaterGlobe3D } from '../globe/WaterGlobe3D';
import { InteroperabilityDemo } from '../interop/InteroperabilityDemo';
import { BeforeAfterComparison } from '../interop/BeforeAfterComparison';
import { IntegrationArchitecture } from '../interop/IntegrationArchitecture';
import { OneHealthStory } from '../interop/OneHealthStory';
import { ApiIntegrationDemo } from '../interop/ApiIntegrationDemo';
import { JudgeTechnicalPanel } from '../interop/JudgeTechnicalPanel';
import { SecurityPrivacyPanel } from '../interop/SecurityPrivacyPanel';

export const HomeView: React.FC = () => {
  const { setCurrentSection, selectRegionAndNavigate } = useApp();

  return (
    <div className="space-y-14 pb-16">
      {/* ------------------------------------------------------------------- */}
      {/* 1. HERO SECTION */}
      {/* ------------------------------------------------------------------- */}
      <div className="relative rounded-3xl glass-panel-glow border border-cyan-400/30 p-8 md:p-12 overflow-hidden shadow-2xl">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div className="max-w-2xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/15 border border-cyan-400/40 text-cyan-300 text-xs font-bold tracking-wide">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              <span>IEEE ONE HEALTH / DIGITAL HEALTH STANDARDS HACKATHON</span>
            </div>

            <div className="space-y-3">
              <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight leading-none flex items-center gap-3">
                <span>🌊 AquaSync 3D</span>
              </h1>
              <h2 className="text-xl md:text-3xl font-extrabold shimmer-text tracking-normal">
                “From Water Sources to Patient Care — One Health Interoperability in Real Time”
              </h2>
            </div>

            <p className="text-sm md:text-base text-slate-300 leading-relaxed">
              Harmonize fragmented environmental sensors, municipal water laboratory tests, and hospital clinical health records 
              using AI-assisted mapping into standardized <strong>HL7® FHIR® R4</strong> and <strong>OAH-FHIR</strong> profiles.
            </p>

            {/* Main Action CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => setCurrentSection('interop-demo')}
                className="water-btn-interactive px-6 py-4 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs md:text-sm flex items-center gap-2.5 transition-all shadow-[0_0_30px_rgba(0,240,255,0.5)] hover:scale-105"
              >
                <Zap className="w-4 h-4 fill-slate-950" />
                <span>Launch Interoperability Demo</span>
              </button>

              <button
                onClick={() => setCurrentSection('globe')}
                className="water-btn-interactive px-5 py-4 rounded-2xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700 hover:border-cyan-400 text-slate-200 text-xs md:text-sm font-semibold flex items-center gap-2 transition-all"
              >
                <Globe2 className="w-4 h-4 text-cyan-400" />
                <span>3D Earth Photosphere</span>
              </button>

              <button
                onClick={() => setCurrentSection('fhir')}
                className="water-btn-interactive px-5 py-4 rounded-2xl bg-purple-600/30 hover:bg-purple-600/40 border border-purple-500/40 text-purple-200 text-xs md:text-sm font-semibold flex items-center gap-2 transition-all"
              >
                <FileCode2 className="w-4 h-4 text-purple-300" />
                <span>OAH-FHIR Explorer</span>
              </button>
            </div>
          </div>

          {/* Hero Live One Health Telemetry & Voice Query Monitor Card */}
          <div className="glass-card-interactive p-6 rounded-3xl bg-slate-950/70 border border-cyan-400/40 shadow-2xl flex flex-col justify-between shrink-0 w-full lg:w-80">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-cyan-500/20">
                <div className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider font-bold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                  <span>Real-Time One Health Feed</span>
                </div>
                <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  ONLINE
                </span>
              </div>

              {/* Voice Query Feature Highlight */}
              <div 
                onClick={() => setCurrentSection('voice')}
                className="my-4 p-3.5 rounded-2xl bg-cyan-950/30 border border-cyan-400/30 hover:border-cyan-300 cursor-pointer transition-all group flex items-center gap-3"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-slate-950 shadow-[0_0_15px_rgba(0,240,255,0.4)] group-hover:scale-110 transition-transform shrink-0">
                  <Mic className="w-6 h-6 text-slate-950" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors flex items-center gap-1">
                    <span>Voice Intelligence</span>
                    <Sparkles className="w-3 h-3 text-cyan-400" />
                  </div>
                  <div className="text-[10px] text-cyan-300 font-mono mt-0.5">
                    "दिल्ली में कितने लोग बीमार हैं?"
                  </div>
                  <span className="text-[9px] text-slate-400 block mt-0.5">
                    Click to launch voice query
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-2 pt-2 border-t border-slate-800 text-[11px]">
              <div className="flex items-center justify-between text-slate-300">
                <span className="text-slate-400">Delhi Rohini Well-5:</span>
                <span className="font-mono text-rose-400 font-bold">4,800 CFU/100mL</span>
              </div>
              <div className="flex items-center justify-between text-slate-300">
                <span className="text-slate-400">FHIR Conformance:</span>
                <span className="font-mono text-emerald-400 font-bold">98.9% R4 Valid</span>
              </div>
              <div className="flex items-center justify-between text-slate-300">
                <span className="text-slate-400">Multi-Lang Engine:</span>
                <span className="font-mono text-cyan-300 font-bold">10 Languages</span>
              </div>
            </div>
          </div>
        </div>

        {/* Demo Synthetic Statistics Bar */}
        <div className="relative z-10 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 mt-10 pt-8 border-t border-cyan-500/20">
          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-center">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Monitored</span>
            <span className="text-xl font-black text-white mt-0.5 block">10 Regions</span>
            <span className="text-[9px] text-cyan-400 font-mono">Global Nodes</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-center">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Transformations</span>
            <span className="text-xl font-black text-white mt-0.5 block">1,428</span>
            <span className="text-[9px] text-emerald-400 font-mono">Payloads Normalized</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-center">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Synthetic Cases</span>
            <span className="text-xl font-black text-white mt-0.5 block">247 Active</span>
            <span className="text-[9px] text-rose-400 font-mono">Delhi Cluster</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-center">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Conformance</span>
            <span className="text-xl font-black text-purple-300 mt-0.5 block">98.9%</span>
            <span className="text-[9px] text-purple-400 font-mono">FHIR R4 / OAH</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-center">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Standard</span>
            <span className="text-xl font-black text-emerald-300 mt-0.5 block">HL7 R4</span>
            <span className="text-[9px] text-emerald-400 font-mono">LOINC / SNOMED</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-center">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Monitoring</span>
            <span className="text-xl font-black text-cyan-300 mt-0.5 block">24/7 Live</span>
            <span className="text-[9px] text-slate-400 font-mono">Simulated Telemetry</span>
          </div>
        </div>

        <div className="mt-3 text-center">
          <span className="text-[11px] text-slate-400 font-mono">
            * All epidemiological case counts, patient records, and hydrological sensor telemetry are synthetic demonstration values.
          </span>
        </div>
      </div>

      {/* ------------------------------------------------------------------- */}
      {/* 2. PROMINENT INTEROPERABILITY DEMO EMBED */}
      {/* ------------------------------------------------------------------- */}
      <InteroperabilityDemo />

      {/* ------------------------------------------------------------------- */}
      {/* 3. BEFORE VS AFTER COMPARISON */}
      {/* ------------------------------------------------------------------- */}
      <BeforeAfterComparison />

      {/* ------------------------------------------------------------------- */}
      {/* 4. WATER → ENVIRONMENT → HEALTH ONE HEALTH STORY */}
      {/* ------------------------------------------------------------------- */}
      <OneHealthStory />

      {/* ------------------------------------------------------------------- */}
      {/* 5. END-TO-END INTEGRATION ARCHITECTURE */}
      {/* ------------------------------------------------------------------- */}
      <IntegrationArchitecture />

      {/* ------------------------------------------------------------------- */}
      {/* 6. REALISTIC 3D EARTH PHOTOSPHERE GLOBE */}
      {/* ------------------------------------------------------------------- */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-2xl font-black text-white flex items-center gap-2">
              <Globe2 className="w-6 h-6 text-cyan-400" />
              <span>Realistic 3D Earth Photosphere & Epidemiological Surveillance</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Photorealistic satellite Earth continents, natural blue oceans, and atmospheric clouds. Rotate, zoom, and inspect real-world coordinates.
            </p>
          </div>
          <button
            onClick={() => selectRegionAndNavigate('delhi-rohini', 'globe')}
            className="px-4 py-2 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400/40 text-cyan-300 text-xs font-bold transition-all shrink-0"
          >
            Inspect Delhi (Critical Node) →
          </button>
        </div>

        <WaterGlobe3D />
      </div>

      {/* ------------------------------------------------------------------- */}
      {/* 7. REST API INTEGRATION DEMO SIMULATOR */}
      {/* ------------------------------------------------------------------- */}
      <ApiIntegrationDemo />

      {/* ------------------------------------------------------------------- */}
      {/* 8. JUDGE & TECHNICAL DETAILS PANEL */}
      {/* ------------------------------------------------------------------- */}
      <JudgeTechnicalPanel />

      {/* ------------------------------------------------------------------- */}
      {/* 9. SECURITY & PRIVACY SECTION */}
      {/* ------------------------------------------------------------------- */}
      <SecurityPrivacyPanel />

      {/* ------------------------------------------------------------------- */}
      {/* 10. FINAL SYNTHESIS: THE 5-TIER ONE HEALTH INTEROPERABILITY CHAIN */}
      {/* ------------------------------------------------------------------- */}
      <div className="p-8 rounded-3xl glass-panel border border-cyan-500/30 bg-slate-950/85 shadow-2xl space-y-6">
        <div className="text-center max-w-3xl mx-auto space-y-2">
          <span className="text-xs font-mono uppercase font-bold text-cyan-400 tracking-widest">
            SYNTHESIS ARCHITECTURE
          </span>
          <h3 className="text-2xl font-black text-white">
            The Complete Interoperable Pipeline at a Glance
          </h3>
          <p className="text-xs text-slate-400">
            How AquaSync transforms isolated environmental records into standardized clinical life-saving interventions.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          <div className="p-4 rounded-2xl bg-rose-950/20 border border-rose-500/30 text-center flex flex-col justify-between">
            <span className="text-[10px] font-mono text-rose-400 uppercase font-bold">Step 1</span>
            <div className="font-bold text-white text-xs my-2">Fragmented Data</div>
            <p className="text-[10px] text-slate-400">Disparate SCADA, LIMS, and clinical systems</p>
          </div>

          <div className="p-4 rounded-2xl bg-cyan-950/30 border border-cyan-500/30 text-center flex flex-col justify-between">
            <span className="text-[10px] font-mono text-cyan-400 uppercase font-bold">Step 2</span>
            <div className="font-bold text-white text-xs my-2">AI-Assisted Interoperability</div>
            <p className="text-[10px] text-slate-400">Concept detection & LOINC / SNOMED mapping</p>
          </div>

          <div className="p-4 rounded-2xl bg-purple-950/30 border border-purple-500/30 text-center flex flex-col justify-between">
            <span className="text-[10px] font-mono text-purple-400 uppercase font-bold">Step 3</span>
            <div className="font-bold text-white text-xs my-2">OAH-FHIR Harmonization</div>
            <p className="text-[10px] text-slate-400">HL7 FHIR Release 4 common data schemas</p>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 text-center flex flex-col justify-between">
            <span className="text-[10px] font-mono text-emerald-400 uppercase font-bold">Step 4</span>
            <div className="font-bold text-white text-xs my-2">Validated Standardized Data</div>
            <p className="text-[10px] text-slate-400">Multi-tier structural & semantic rules check</p>
          </div>

          <div className="p-4 rounded-2xl bg-blue-950/30 border border-blue-500/30 text-center flex flex-col justify-between">
            <span className="text-[10px] font-mono text-blue-400 uppercase font-bold">Step 5</span>
            <div className="font-bold text-white text-xs my-2">Connected One Health Systems</div>
            <p className="text-[10px] text-slate-400">Hospital EHRs, public health & water actuators</p>
          </div>
        </div>
      </div>
    </div>
  );
};
