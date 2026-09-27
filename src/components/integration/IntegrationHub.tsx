import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Share2, 
  CheckCircle2, 
  Activity, 
  Droplets, 
  Building2, 
  BookOpen, 
  ShieldAlert, 
  Sparkles, 
  ArrowRight, 
  XCircle, 
  RefreshCw,
  Zap,
  Globe2,
  Lock,
  Layers
} from 'lucide-react';

export const IntegrationHub: React.FC = () => {
  const { 
    integrationSystems, 
    isInteroperabilityActive, 
    activateInteroperability 
  } = useApp();
  const [isActivating, setIsActivating] = useState<boolean>(false);
  const [showTransformationModal, setShowTransformationModal] = useState<boolean>(false);

  const handleActivate = async () => {
    setIsActivating(true);
    await activateInteroperability();
    setIsActivating(false);
    setShowTransformationModal(true);
  };

  const getSystemIcon = (type: string) => {
    switch (type) {
      case 'hospital_ehr': return Building2;
      case 'water_scada': return Droplets;
      case 'environmental_epa': return Globe2;
      case 'research_lab': return BookOpen;
      default: return ShieldAlert;
    }
  };

  return (
    <div className="space-y-8">
      {/* --------------------------------------------------------------------- */}
      {/* SECTION 19: BEFORE vs AFTER INTEROPERABILITY SHOWCASE */}
      {/* --------------------------------------------------------------------- */}
      <div className="p-6 md:p-8 rounded-3xl glass-panel-glow border border-cyan-400/40 relative overflow-hidden">
        {/* Animated background particles effect */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-cyan-500/20">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-[11px] font-extrabold uppercase bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 tracking-wider">
                Hackathon Keynote Demo
              </span>
              <span className="text-xs text-slate-400">One Health Interoperability Catalyst</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-white mt-2">
              Before & After Interoperability
            </h2>
            <p className="text-xs md:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Witness how fragmented, incompatible silos transform into a unified, real-time synchronized HL7 FHIR R4 intelligence fabric.
            </p>
          </div>

          <div>
            <button
              onClick={handleActivate}
              disabled={isActivating}
              className={`px-6 py-3.5 rounded-2xl font-extrabold text-sm flex items-center gap-3 transition-all shadow-2xl ${
                isInteroperabilityActive
                  ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-[0_0_30px_rgba(16,185,129,0.5)]'
                  : 'bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 hover:scale-105 text-slate-950 shadow-[0_0_30px_rgba(0,240,255,0.6)] animate-pulse'
              }`}
            >
              <Zap className={`w-5 h-5 ${isActivating ? 'animate-spin' : ''}`} />
              <span>
                {isActivating
                  ? 'Harmonizing Data Streams...'
                  : isInteroperabilityActive
                  ? 'Interoperability Active (Re-Sync)'
                  : 'ACTIVATE INTEROPERABILITY'}
              </span>
            </button>
          </div>
        </div>

        {/* Before vs After Interactive Comparison Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          {/* BEFORE CARD */}
          <div className={`p-6 rounded-2xl border transition-all ${
            !isInteroperabilityActive 
              ? 'bg-rose-950/20 border-rose-500/40 ring-2 ring-rose-500/30' 
              : 'bg-slate-950/60 border-slate-800 opacity-60'
          }`}>
            <div className="flex items-center justify-between mb-4">
              <span className="px-3 py-1 rounded-md text-xs font-black uppercase tracking-wider bg-rose-500/20 text-rose-300 border border-rose-500/40 flex items-center gap-1.5">
                <XCircle className="w-3.5 h-3.5" />
                BEFORE: Fragmented Data Silos
              </span>
              <span className="text-[11px] text-slate-400 font-mono">Incompatible Standards</span>
            </div>

            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-300 flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-slate-400" /> Hospital EHR
                </span>
                <span className="text-rose-400 font-mono flex items-center gap-1">
                  ✕ Isolated from water authorities
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-300 flex items-center gap-2">
                  <Droplets className="w-4 h-4 text-slate-400" /> Water SCADA
                </span>
                <span className="text-rose-400 font-mono flex items-center gap-1">
                  ✕ Proprietary Modbus / no clinical link
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-300 flex items-center gap-2">
                  <Globe2 className="w-4 h-4 text-slate-400" /> EPA Environmental
                </span>
                <span className="text-rose-400 font-mono flex items-center gap-1">
                  ✕ CSV dumps delayed by 48-72h
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-300 flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-slate-400" /> Research Registry
                </span>
                <span className="text-rose-400 font-mono flex items-center gap-1">
                  ✕ Manual reformatting required
                </span>
              </div>
            </div>

            <div className="mt-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-200">
              <strong>Outcome:</strong> Delayed outbreak awareness, unrecognized waterborne pathogen clusters, and missed containment opportunities.
            </div>
          </div>

          {/* AFTER CARD */}
          <div className={`p-6 rounded-2xl border transition-all ${
            isInteroperabilityActive 
              ? 'bg-cyan-950/30 border-cyan-400/60 ring-2 ring-cyan-400/40 shadow-2xl' 
              : 'bg-slate-950/60 border-slate-800'
          }`}>
            <div className="flex items-center justify-between mb-4">
              <span className="px-3 py-1 rounded-md text-xs font-black uppercase tracking-wider bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                AFTER: AquaSync FHIR Harmonization
              </span>
              <span className="text-[11px] text-cyan-300 font-mono">Real-Time One Health</span>
            </div>

            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between text-xs">
                <span className="text-white flex items-center gap-2 font-medium">
                  <Building2 className="w-4 h-4 text-cyan-400" /> Hospital EHR
                </span>
                <span className="text-emerald-400 font-mono flex items-center gap-1">
                  ✓ FHIR Patient & Condition mapped
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between text-xs">
                <span className="text-white flex items-center gap-2 font-medium">
                  <Droplets className="w-4 h-4 text-cyan-400" /> Water SCADA
                </span>
                <span className="text-emerald-400 font-mono flex items-center gap-1">
                  ✓ FHIR Observation (LOINC 58452-4)
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between text-xs">
                <span className="text-white flex items-center gap-2 font-medium">
                  <Globe2 className="w-4 h-4 text-cyan-400" /> EPA Environmental
                </span>
                <span className="text-emerald-400 font-mono flex items-center gap-1">
                  ✓ FHIR Location & GIS Coordinates
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between text-xs">
                <span className="text-white flex items-center gap-2 font-medium">
                  <Share2 className="w-4 h-4 text-purple-400" /> Unified Exchange
                </span>
                <span className="text-purple-300 font-mono flex items-center gap-1">
                  ✓ FHIR Bundle Ready for Broadcast
                </span>
              </div>
            </div>

            <div className="mt-4 p-3 rounded-xl bg-cyan-500/10 border border-cyan-400/30 text-xs text-cyan-200">
              <strong>Outcome:</strong> Real-time cross-domain epidemic alerts, immediate chlorine boost dispatched, and cross-sector coordination in minutes.
            </div>
          </div>
        </div>
      </div>

      {/* --------------------------------------------------------------------- */}
      {/* SECTION 18: ARCHITECTURE DATA STREAM VISUALIZATION */}
      {/* --------------------------------------------------------------------- */}
      <div className="p-6 md:p-8 rounded-2xl glass-panel border border-slate-800 bg-slate-950/80 shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Share2 className="w-5 h-5 text-cyan-400" />
              Connected Source Systems & Interoperability Gateway
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Active adapters transforming legacy feeds into HL7 FHIR Release 4 standard representations.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-emerald-300 font-medium">All 5 System Gateways Active</span>
          </div>
        </div>

        {/* System Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {integrationSystems.map((sys) => {
            const Icon = getSystemIcon(sys.type);
            const isReady = sys.status === 'ready_for_exchange';

            return (
              <div
                key={sys.id}
                className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-cyan-500/40 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-cyan-400">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${
                      isReady ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' : 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                    }`}>
                      {sys.status.replace(/_/g, ' ')}
                    </span>
                  </div>

                  <h4 className="font-bold text-white text-sm">{sys.name}</h4>
                  <div className="text-[11px] font-mono text-slate-400 mt-1 truncate">
                    {sys.endpoint}
                  </div>

                  <div className="mt-3.5 pt-3 border-t border-slate-800/80 space-y-1.5 text-xs text-slate-300">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Data Protocol:</span>
                      <span className="font-mono text-[11px] text-cyan-300">{sys.dataProtocol}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">FHIR Target:</span>
                      <span className="font-mono text-[11px] text-purple-300">{sys.fhirTarget}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Processed:</span>
                      <span className="font-mono text-[11px] text-white font-bold">{sys.recordsProcessed.toLocaleString()} records</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500">
                  <span>Last sync: {sys.lastSync}</span>
                  <span className="text-emerald-400 font-semibold">Active Pipeline</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
