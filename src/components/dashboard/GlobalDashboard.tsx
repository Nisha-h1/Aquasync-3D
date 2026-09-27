import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Activity, 
  Droplets, 
  AlertTriangle, 
  MapPin, 
  Globe2, 
  TrendingUp, 
  ShieldAlert, 
  Sparkles, 
  RefreshCw, 
  ArrowRight,
  Share2,
  FileCode2,
  CheckCircle2,
  Database,
  Layers,
  Radio,
  Clock,
  ExternalLink
} from 'lucide-react';

export const GlobalDashboard: React.FC = () => {
  const { 
    regions, 
    alerts, 
    integrationSystems, 
    setCurrentSection,
    refreshData 
  } = useApp();
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refreshData();
    setTimeout(() => setIsRefreshing(false), 500);
  };

  const totalSyntheticCases = regions.reduce((acc, r) => acc + r.syntheticCases, 0);

  // Interoperability-focused metrics
  const activeDataSourcesCount = 5; // SCADA IoT, CWTL Lab, Hospital Triage EHR, Citizen Sentinels, Satellite Remote Sensing
  const totalTransformations = 1428;
  const fhirResourcesGenerated = 1412;
  const conformanceRate = 98.9;
  const pendingHumanReviews = 3;

  const RECENT_INTEROP_EVENTS = [
    {
      id: 'EVT-9081',
      time: '2 mins ago',
      source: 'Well-5 SCADA Station (Delhi)',
      target: 'HL7 FHIR Observation (LOINC 26887-0)',
      status: 'VALIDATED',
      latency: '142ms',
      notes: 'Coliform biological spike (4,800 CFU) normalized into FHIR Observation.'
    },
    {
      id: 'EVT-9080',
      time: '8 mins ago',
      source: 'Central Water Testing Lab (CWTL)',
      target: 'HL7 FHIR Specimen & DiagnosticReport',
      status: 'VALIDATED',
      latency: '198ms',
      notes: 'Membrane filtration assay verified unfit for human consumption.'
    },
    {
      id: 'EVT-9079',
      time: '14 mins ago',
      source: 'Regional Emergency Department',
      target: 'HL7 FHIR Encounter (SNOMED 63650001)',
      status: 'REVIEW REQUIRED',
      latency: '280ms',
      notes: 'Unmapped triage symptom string flagged for human clinical reviewer signoff.'
    },
    {
      id: 'EVT-9078',
      time: '26 mins ago',
      source: 'Citizen Water Sentinel Mobile App',
      target: 'HL7 FHIR Observation (OAH-IND-CITIZEN)',
      status: 'VALIDATED',
      latency: '115ms',
      notes: 'Rohini Sector 8 community tap discolouration observation ingested.'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 md:p-8 rounded-3xl glass-panel-glow border border-cyan-400/30 bg-slate-950/80 shadow-2xl">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded text-[10px] uppercase font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-mono">
              ONE HEALTH INTEROPERABILITY COMMAND
            </span>
            <span className="text-xs text-slate-400 font-mono">Real-Time Data Harmonization Telemetry</span>
          </div>
          <h2 className="text-3xl font-black text-white mt-1.5 flex items-center gap-2">
            <span>Interoperability Operations Dashboard</span>
          </h2>
          <p className="text-xs text-slate-300 mt-1">
            Monitoring data stream ingestion, AI agent mappings, and HL7 FHIR conformance rates across global One Health nodes.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-[10px] text-slate-500 font-mono uppercase block">Synthetic Stream Status</span>
            <span className="text-xs text-emerald-400 font-mono flex items-center gap-1.5 font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              10 Global Nodes Streaming
            </span>
          </div>
          <button
            onClick={handleRefresh}
            className="p-3 rounded-2xl bg-slate-900 border border-slate-700 hover:border-cyan-400 text-slate-300 hover:text-white transition-all shadow-md"
            title="Refresh Telemetry"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Top 6 Interoperability Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
        <div className="p-4 rounded-2xl glass-panel border border-cyan-500/30 bg-slate-950/70">
          <span className="text-[10px] text-slate-400 uppercase font-semibold block">Data Sources</span>
          <div className="text-2xl font-black text-white mt-1">{activeDataSourcesCount}</div>
          <span className="text-[10px] text-cyan-400 mt-1 block font-mono">Active Streams</span>
        </div>

        <div className="p-4 rounded-2xl glass-panel border border-slate-800 bg-slate-950/70">
          <span className="text-[10px] text-slate-400 uppercase font-semibold block">Transformations</span>
          <div className="text-2xl font-black text-white mt-1">{totalTransformations.toLocaleString()}</div>
          <span className="text-[10px] text-slate-400 mt-1 block font-mono">Payloads Ingested</span>
        </div>

        <div className="p-4 rounded-2xl glass-panel border border-purple-500/30 bg-purple-950/20">
          <span className="text-[10px] text-purple-300 uppercase font-semibold block">FHIR Generated</span>
          <div className="text-2xl font-black text-purple-300 mt-1">{fhirResourcesGenerated.toLocaleString()}</div>
          <span className="text-[10px] text-slate-400 mt-1 block font-mono">R4 Bundles</span>
        </div>

        <div className="p-4 rounded-2xl glass-panel border border-emerald-500/30 bg-emerald-950/20">
          <span className="text-[10px] text-emerald-300 uppercase font-semibold block">Validation Status</span>
          <div className="text-2xl font-black text-emerald-400 mt-1">{conformanceRate}%</div>
          <span className="text-[10px] text-emerald-400 mt-1 block font-mono">Schema Conformance</span>
        </div>

        <div className="p-4 rounded-2xl glass-panel border border-amber-500/30 bg-amber-950/20">
          <span className="text-[10px] text-amber-300 uppercase font-semibold block">Pending Reviews</span>
          <div className="text-2xl font-black text-amber-400 mt-1">{pendingHumanReviews}</div>
          <span className="text-[10px] text-amber-300 mt-1 block font-mono">Human Signoff</span>
        </div>

        <div className="p-4 rounded-2xl glass-panel border border-rose-500/30 bg-rose-950/20">
          <span className="text-[10px] text-rose-300 uppercase font-semibold block">Synthetic Cases</span>
          <div className="text-2xl font-black text-rose-400 mt-1">{totalSyntheticCases}</div>
          <span className="text-[10px] text-rose-400 mt-1 block font-mono">Demo Patients</span>
        </div>
      </div>

      {/* Main Dual Grid: Interoperability Stream Events vs Live Node Status */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Interoperability Events Audit Log (7 cols) */}
        <div className="lg:col-span-7 p-6 rounded-2xl glass-panel border border-cyan-500/20 bg-slate-950/80 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <FileCode2 className="w-4 h-4 text-cyan-400" />
                <span>Real-Time Interoperability Audit Stream</span>
              </h3>
              <p className="text-xs text-slate-400">Live transformations, mapping validation, and latency records</p>
            </div>

            <button
              onClick={() => setCurrentSection('interop-demo')}
              className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-semibold transition-colors"
            >
              <span>Launch Demo</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {RECENT_INTEROP_EVENTS.map((evt) => (
              <div
                key={evt.id}
                className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-cyan-400/30 transition-all text-xs space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-cyan-300 font-bold">{evt.id}</span>
                    <span className="text-slate-500">•</span>
                    <span className="text-slate-400">{evt.time}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                      evt.status === 'VALIDATED' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    }`}>
                      {evt.status}
                    </span>
                    <span className="font-mono text-[10px] text-slate-500">{evt.latency}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 font-mono text-[11px]">
                  <span className="text-slate-300 font-semibold">{evt.source}</span>
                  <ArrowRight className="w-3 h-3 text-cyan-400" />
                  <span className="text-purple-300 font-semibold">{evt.target}</span>
                </div>

                <p className="text-[11px] text-slate-400 leading-snug">{evt.notes}</p>
              </div>
            ))}
          </div>

          <div className="pt-2 text-center">
            <span className="text-[11px] font-mono text-slate-500">
              * Showing synthetic simulated audit events. Metrics update automatically with transformation pipeline runs.
            </span>
          </div>
        </div>

        {/* Right: Active Monitored Water Catchment Nodes (5 cols) */}
        <div className="lg:col-span-5 p-6 rounded-2xl glass-panel border border-cyan-500/20 bg-slate-950/80 space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Globe2 className="w-4 h-4 text-cyan-400" />
                  <span>Monitored One Health Catchments</span>
                </h3>
                <p className="text-xs text-slate-400">10 global water sources linked to clinical surveillance</p>
              </div>
            </div>

            <div className="space-y-2 mt-4 max-h-[380px] overflow-y-auto pr-1">
              {regions.map((reg) => (
                <div
                  key={reg.id}
                  onClick={() => setCurrentSection('globe')}
                  className="p-3 rounded-xl bg-slate-900/50 hover:bg-slate-900 border border-slate-800 hover:border-cyan-400/40 cursor-pointer transition-all flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-2.5">
                    <span 
                      className="w-2.5 h-2.5 rounded-full shrink-0" 
                      style={{ 
                        backgroundColor: reg.severity === 'critical' ? '#ef4444' : reg.severity === 'high' ? '#f97316' : reg.severity === 'medium' ? '#eab308' : '#06b6d4' 
                      }} 
                    />
                    <div>
                      <h4 className="font-bold text-white">{reg.name}</h4>
                      <span className="text-[11px] text-slate-400 block">{reg.waterSource}</span>
                    </div>
                  </div>

                  <div className="text-right font-mono text-[11px]">
                    <span className="text-rose-400 font-bold block">{reg.waterQuality.coliformCfu} CFU</span>
                    <span className="text-slate-400 text-[10px]">{reg.syntheticCases} cases</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => setCurrentSection('globe')}
            className="w-full mt-4 py-2.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400/40 text-cyan-300 font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md"
          >
            <span>Explore 3D Photosphere Globe</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
