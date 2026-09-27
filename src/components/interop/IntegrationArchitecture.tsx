import React, { useState, useEffect } from 'react';
import { 
  Database, 
  Layers, 
  Cpu, 
  FileCode2, 
  ShieldCheck, 
  Share2, 
  ArrowDown, 
  Sparkles, 
  CheckCircle2, 
  Radio, 
  Activity, 
  Users, 
  Building2, 
  FlaskConical,
  ExternalLink
} from 'lucide-react';

export const IntegrationArchitecture: React.FC = () => {
  const [activeDataPacket, setActiveDataPacket] = useState<number>(0);

  // Animate data flow packet moving through tiers
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveDataPacket((prev) => (prev + 1) % 6);
    }, 1800);
    return () => clearInterval(interval);
  }, []);

  const SOURCE_NODES = [
    { title: 'Environmental Sensors', subtitle: 'SCADA, IoT, Hydrological Probes', icon: Radio, protocol: 'MQTT / CoAP / REST', color: 'border-cyan-400/40 text-cyan-300' },
    { title: 'Laboratory Data', subtitle: 'Membrane Filtration Culture Assays', icon: FlaskConical, protocol: 'LIMS Export / JSON', color: 'border-purple-400/40 text-purple-300' },
    { title: 'Hospital EHR Systems', subtitle: 'Emergency Triage & Inpatient Admissions', icon: Building2, protocol: 'HL7 v2 / FHIR REST', color: 'border-rose-400/40 text-rose-300' },
    { title: 'Citizen Sentinels', subtitle: 'Community Mobile Water Telemetry', icon: Users, protocol: 'GeoJSON / HTTPS API', color: 'border-emerald-400/40 text-emerald-300' },
    { title: 'Remote Sensing', subtitle: 'Earth Observation & Drone Spectral Data', icon: Activity, protocol: 'WCS / GeoTIFF', color: 'border-sky-400/40 text-sky-300' },
  ];

  const PIPELINE_NODES = [
    { 
      step: 1, 
      title: 'AquaSync Ingestion Layer', 
      desc: 'High-throughput stream adapters, schema detection, authentication & payload validation.',
      badge: 'INGESTION ENGINE',
      icon: Database 
    },
    { 
      step: 2, 
      title: 'Normalization Engine', 
      desc: 'Type coercion (scalar, temporal ISO 8601 UTC), unit standardizations, sanitization.',
      badge: 'PRE-PROCESSING',
      icon: Layers 
    },
    { 
      step: 3, 
      title: 'AI Interoperability Agent', 
      desc: 'Concept identification, LOINC / SNOMED CT terminology mapping, missing field detection & uncertainty audit.',
      badge: 'GEMINI FLASH AI',
      icon: Cpu 
    },
    { 
      step: 4, 
      title: 'OAH-FHIR Structuring', 
      desc: 'HL7 FHIR Release 4 resource assembly (Observation, Specimen, Location, Encounter, Bundle).',
      badge: 'HL7 FHIR R4',
      icon: FileCode2 
    },
    { 
      step: 5, 
      title: 'Validation & Conformance', 
      desc: 'Multi-tier deterministic schema checks, required cardinality, UCUM unit validation.',
      badge: 'CONFORMANCE ENGINE',
      icon: ShieldCheck 
    },
    { 
      step: 6, 
      title: 'Interoperable Exchange', 
      desc: 'Push to hospital EHR emergency dashboards, public health CDC/WHO systems, municipal water automation.',
      badge: 'CONNECTED ECOSYSTEM',
      icon: Share2 
    },
  ];

  return (
    <div className="p-6 md:p-8 rounded-3xl glass-panel border border-cyan-500/20 bg-slate-950/80 shadow-2xl space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/15 border border-cyan-400/40 text-cyan-300 text-xs font-bold tracking-wide mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>FULL INTEGRATION ARCHITECTURE</span>
          </div>
          <h3 className="text-2xl font-black text-white tracking-tight">
            End-to-End One Health Data Flow
          </h3>
          <p className="text-xs text-slate-300">
            Real-time visualization of data moving through AquaSync harmonization nodes into connected health & environmental infrastructure.
          </p>
        </div>

        {/* Live Stream Pulse Badge */}
        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-900 border border-cyan-400/40 text-xs text-cyan-300 font-mono">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          <span>Active Packet in Step 0{activeDataPacket + 1}</span>
        </div>
      </div>

      {/* Tier 1: Source Nodes Grid */}
      <div className="space-y-3">
        <div className="text-xs font-mono uppercase text-slate-400 tracking-wider flex items-center justify-between">
          <span>Tier 1: Disparate Upstream Data Sources</span>
          <span className="text-cyan-400">Multiple Protocols & Formats</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {SOURCE_NODES.map((src, i) => {
            const Icon = src.icon;
            return (
              <div
                key={i}
                className={`p-3.5 rounded-2xl bg-slate-900/60 border ${src.color} transition-all hover:scale-105 flex flex-col justify-between`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Icon className="w-5 h-5" />
                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                      SOURCE
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-white">{src.title}</h4>
                  <p className="text-[10px] text-slate-400 mt-0.5 leading-snug">{src.subtitle}</p>
                </div>
                <div className="mt-3 pt-2 border-t border-slate-800/80 text-[9px] font-mono text-cyan-300 truncate">
                  {src.protocol}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Visual Downward Data Flow Pulse Connector */}
      <div className="flex items-center justify-center my-2">
        <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/15 border border-cyan-400/40 text-cyan-300 text-xs font-mono font-bold animate-pulse">
          <ArrowDown className="w-4 h-4 text-cyan-400" />
          <span>Continuous Streaming Ingestion Stream (Zero Semantic Loss)</span>
          <ArrowDown className="w-4 h-4 text-cyan-400" />
        </div>
      </div>

      {/* Tier 2: AquaSync Processing Pipeline Nodes */}
      <div className="space-y-3">
        <div className="text-xs font-mono uppercase text-slate-400 tracking-wider flex items-center justify-between">
          <span>Tier 2: AquaSync Core Processing & Harmonization Engine</span>
          <span className="text-emerald-400">HL7 FHIR R4 & OAH Standards</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {PIPELINE_NODES.map((node, i) => {
            const isHighlighted = activeDataPacket === i;
            const Icon = node.icon;

            return (
              <div
                key={node.step}
                className={`p-4 rounded-2xl border transition-all duration-500 relative flex flex-col justify-between ${
                  isHighlighted
                    ? 'bg-cyan-950/40 border-cyan-400 shadow-[0_0_25px_rgba(0,240,255,0.35)] scale-[1.02]'
                    : 'bg-slate-900/50 border-slate-800'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                      STAGE 0{node.step}
                    </span>
                    <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-bold">
                      {node.badge}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 mb-1.5">
                    <div className={`p-1.5 rounded-lg ${isHighlighted ? 'bg-cyan-500 text-slate-950' : 'bg-slate-800 text-cyan-400'}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <h4 className="text-sm font-bold text-white">{node.title}</h4>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed mt-1">
                    {node.desc}
                  </p>
                </div>

                <div className="mt-4 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono">
                  <span className="text-slate-500">Latency: ~45ms</span>
                  {isHighlighted ? (
                    <span className="text-cyan-300 font-bold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                      Active Packet Processing
                    </span>
                  ) : (
                    <span className="text-slate-400">Idle / Ready</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Tier 3: Connected Interoperable Endpoints */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-cyan-950/30 via-slate-900/60 to-purple-950/30 border border-cyan-500/30 flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-300">
            <Share2 className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <div className="font-bold text-white text-sm">Interoperable Ecosystem Outlets</div>
            <div className="text-slate-400 text-[11px]">
              Standardized FHIR REST Bundles delivered to Hospital EHRs, WHO Surveillance, and Regional Water Actuators.
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 font-mono text-[11px]">
            FHIR REST API
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 font-mono text-[11px]">
            SMART-on-FHIR
          </span>
        </div>
      </div>
    </div>
  );
};
