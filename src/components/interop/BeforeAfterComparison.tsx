import React, { useState } from 'react';
import { 
  ArrowRight, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Layers, 
  Zap, 
  FileCode2, 
  Database, 
  Clock, 
  TrendingDown, 
  ShieldCheck, 
  Activity,
  Sparkles
} from 'lucide-react';

export const BeforeAfterComparison: React.FC = () => {
  const [viewMode, setViewMode] = useState<'after' | 'before' | 'split'>('after');

  return (
    <div className="p-6 md:p-8 rounded-3xl glass-panel border border-cyan-500/20 bg-slate-950/75 shadow-2xl space-y-6">
      {/* Header & Mode Switcher */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/15 border border-cyan-400/40 text-cyan-300 text-xs font-bold tracking-wide mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>INTEROPERABILITY IMPACT ANALYSIS</span>
          </div>
          <h3 className="text-2xl font-black text-white tracking-tight">
            Before vs. After AquaSync Harmonization
          </h3>
          <p className="text-xs text-slate-300">
            Compare traditional fragmented epidemiological data workflows against the automated One Health OAH-FHIR pipeline.
          </p>
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-1 bg-slate-900/90 p-1.5 rounded-2xl border border-slate-800 text-xs font-semibold">
          <button
            onClick={() => setViewMode('before')}
            className={`px-3 py-1.5 rounded-xl transition-all ${
              viewMode === 'before'
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            ❌ Traditional (Before)
          </button>
          <button
            onClick={() => setViewMode('after')}
            className={`px-3 py-1.5 rounded-xl transition-all ${
              viewMode === 'after'
                ? 'bg-cyan-500/30 text-cyan-200 border border-cyan-400/50 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            ✨ AquaSync (After)
          </button>
          <button
            onClick={() => setViewMode('split')}
            className={`px-3 py-1.5 rounded-xl transition-all ${
              viewMode === 'split'
                ? 'bg-purple-500/20 text-purple-200 border border-purple-500/40 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            ⚖️ Side-by-Side
          </button>
        </div>
      </div>

      {/* Metric Impact Summary Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
        <div className="p-3.5 rounded-xl bg-slate-900/50 border border-slate-800">
          <span className="text-[10px] text-slate-400 uppercase block font-semibold">Integration Time</span>
          <div className="flex items-center justify-center gap-1.5 mt-1">
            <span className="text-rose-400 line-through text-xs font-mono">72 Hours</span>
            <ArrowRight className="w-3 h-3 text-cyan-400" />
            <span className="text-emerald-400 font-bold text-base font-mono">&lt; 350 ms</span>
          </div>
          <span className="text-[9px] text-emerald-400 font-semibold block mt-0.5">99.8% Latency Reduction</span>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-900/50 border border-slate-800">
          <span className="text-[10px] text-slate-400 uppercase block font-semibold">Manual Field Mapping</span>
          <div className="flex items-center justify-center gap-1.5 mt-1">
            <span className="text-rose-400 line-through text-xs font-mono">100% Manual</span>
            <ArrowRight className="w-3 h-3 text-cyan-400" />
            <span className="text-cyan-300 font-bold text-base font-mono">AI-Assisted</span>
          </div>
          <span className="text-[9px] text-cyan-300 font-semibold block mt-0.5">With Human-in-the-Loop Signoff</span>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-900/50 border border-slate-800">
          <span className="text-[10px] text-slate-400 uppercase block font-semibold">Data Schema Divergence</span>
          <div className="flex items-center justify-center gap-1.5 mt-1">
            <span className="text-rose-400 line-through text-xs font-mono">6+ Siloed Formats</span>
            <ArrowRight className="w-3 h-3 text-cyan-400" />
            <span className="text-purple-300 font-bold text-base font-mono">HL7 FHIR R4</span>
          </div>
          <span className="text-[9px] text-purple-300 font-semibold block mt-0.5">OAH Harmonized Model</span>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-900/50 border border-slate-800">
          <span className="text-[10px] text-slate-400 uppercase block font-semibold">Epidemic Correlation Alert</span>
          <div className="flex items-center justify-center gap-1.5 mt-1">
            <span className="text-rose-400 line-through text-xs font-mono">Post-Outbreak</span>
            <ArrowRight className="w-3 h-3 text-cyan-400" />
            <span className="text-emerald-400 font-bold text-base font-mono">Automated</span>
          </div>
          <span className="text-[9px] text-emerald-400 font-semibold block mt-0.5">Proactive Water Intervention</span>
        </div>
      </div>

      {/* Main Flow Visualizers */}
      <div className={`grid gap-6 ${viewMode === 'split' ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'}`}>
        
        {/* BEFORE: Fragmented Silos */}
        {(viewMode === 'before' || viewMode === 'split') && (
          <div className="p-6 rounded-2xl border border-rose-500/30 bg-rose-950/10 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-rose-400 font-bold text-sm">
                <XCircle className="w-5 h-5 text-rose-400" />
                <span>BEFORE: Fragmented, Incompatible Data Silos</span>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-rose-500/20 text-rose-300 border border-rose-500/30 font-bold">
                HIGH LATENCY
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Water authorities, hospitals, and environmental labs use incompatible proprietary formats. Data sits isolated in separate databases with no automated correlation.
            </p>

            {/* Stepped Fragmented Diagram */}
            <div className="space-y-3 font-mono text-xs">
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-slate-400 block text-[10px]">SCADA Telemetry</span>
                  <span className="text-white font-bold">Proprietary CSV / Hex Modbus</span>
                </div>
                <span className="text-rose-400 text-[11px]">Isolated in Water SCADA Server</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-slate-400 block text-[10px]">Hospital ER Triage</span>
                  <span className="text-white font-bold">Legacy HL7 v2 / PDF Encounter Notes</span>
                </div>
                <span className="text-rose-400 text-[11px]">Locked in Hospital EHR System</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-slate-400 block text-[10px]">Public Health Labs</span>
                  <span className="text-white font-bold">Physical Paper / Spreadsheets</span>
                </div>
                <span className="text-rose-400 text-[11px]">Manual Emailing (3-5 Days Delay)</span>
              </div>

              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-200 text-[11px]">
                ⚠️ <strong>Result:</strong> Waterborne cholera / E. coli outbreaks spread for 72+ hours before public health officials connect hospital triage cases to municipal pipeline contamination.
              </div>
            </div>
          </div>
        )}

        {/* AFTER: AquaSync Interoperable Pipeline */}
        {(viewMode === 'after' || viewMode === 'split') && (
          <div className="p-6 rounded-2xl border border-cyan-500/40 bg-cyan-950/15 space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-cyan-300 font-bold text-sm">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <span>AFTER: AquaSync Interoperability Engine</span>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-500/20 text-cyan-200 border border-cyan-400/40 font-bold">
                REAL-TIME (FHIR R4)
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Multiple disparate data feeds enter the AquaSync pipeline, are normalized, mapped with AI explainability, validated against OAH-FHIR profiles, and shared seamlessly across connected systems.
            </p>

            {/* Stepped Interoperable Diagram */}
            <div className="space-y-3 font-mono text-xs">
              <div className="p-3 rounded-xl bg-slate-900/90 border border-cyan-500/30 flex items-center justify-between">
                <div>
                  <span className="text-cyan-400 block text-[10px]">1. Ingestion Layer</span>
                  <span className="text-white font-bold">Multi-Stream Connectors (REST / MQTT / CSV)</span>
                </div>
                <span className="text-emerald-400 text-[11px]">Instant Payload Ingestion</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/90 border border-cyan-500/30 flex items-center justify-between">
                <div>
                  <span className="text-cyan-400 block text-[10px]">2. AI Terminology Normalization</span>
                  <span className="text-white font-bold">LOINC (26887-0) & SNOMED CT (63650001)</span>
                </div>
                <span className="text-purple-300 text-[11px]">Explainable Field Mapping</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/90 border border-cyan-500/30 flex items-center justify-between">
                <div>
                  <span className="text-cyan-400 block text-[10px]">3. OAH-FHIR Harmonization</span>
                  <span className="text-white font-bold">Observation • Specimen • Location • Encounter</span>
                </div>
                <span className="text-cyan-300 text-[11px]">HL7 Conformance Validated</span>
              </div>

              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-200 text-[11px]">
                ✓ <strong>Result:</strong> Automated cross-domain epidemiological link establishes within seconds, triggering localized boil-water warnings and emergency booster chlorination.
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
