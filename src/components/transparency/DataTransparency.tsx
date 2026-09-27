import React from 'react';
import { 
  ShieldCheck, 
  AlertTriangle, 
  Database, 
  FileText, 
  Lock, 
  Sparkles, 
  BookOpen, 
  Scale, 
  Info,
  CheckCircle2
} from 'lucide-react';

export const DataTransparency: React.FC = () => {
  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header Banner */}
      <div className="p-8 rounded-3xl glass-panel border border-cyan-500/20 bg-slate-950/70 shadow-2xl">
        <div className="flex items-center gap-2 mb-2">
          <span className="px-3 py-1 rounded-full text-[11px] font-black uppercase bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
            IEEE One Health / Digital Health Standards
          </span>
          <span className="text-xs text-slate-400">Governance & Ethics Statement</span>
        </div>
        <h2 className="text-3xl font-extrabold text-white">
          Data Provenance & Ethical Transparency
        </h2>
        <p className="text-sm text-slate-300 mt-2 leading-relaxed">
          AquaSync 3D demonstrates technical interoperability between hydrological telemetry, municipal water supply networks, and clinical healthcare systems. To ensure ethical compliance, all health and environmental data used in this hackathon prototype is synthetic and strictly non-clinical.
        </p>
      </div>

      {/* 4 Data Classifications Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* SYNTHETIC DATA */}
        <div className="p-6 rounded-2xl glass-panel border border-cyan-500/20 bg-slate-950/80 space-y-3">
          <div className="flex items-center justify-between">
            <span className="px-3 py-1 rounded-lg text-xs font-black uppercase tracking-wider bg-cyan-500/20 text-cyan-300 border border-cyan-400/40">
              SYNTHETIC DATA
            </span>
            <span className="text-[11px] text-slate-400 font-mono">100% De-Identified</span>
          </div>
          <h3 className="text-base font-bold text-white">Demonstration Clinical Cases & Water Tests</h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            All patient records (e.g. 247 cases in Delhi, 156 in Mumbai), lab measurements (coliform densities, turbidity levels), and correlation scores are synthetically generated for demonstration. No real human individuals or hospital patients are represented.
          </p>
          <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-[11px] text-slate-400 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>Zero Protected Health Information (PHI) or PII present.</span>
          </div>
        </div>

        {/* PUBLIC REFERENCE */}
        <div className="p-6 rounded-2xl glass-panel border border-blue-500/20 bg-slate-950/80 space-y-3">
          <div className="flex items-center justify-between">
            <span className="px-3 py-1 rounded-lg text-xs font-black uppercase tracking-wider bg-blue-500/20 text-blue-300 border border-blue-400/40">
              PUBLIC REFERENCE STANDARDS
            </span>
            <span className="text-[11px] text-slate-400 font-mono">HL7 / LOINC / SNOMED</span>
          </div>
          <h3 className="text-base font-bold text-white">Official Interoperability Dictionaries</h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Standard terminology codings referenced throughout the app adhere to authentic global specifications: HL7 FHIR R4 schema structures, LOINC codes (e.g., 58452-4 for E. coli), SNOMED CT clinical terms, and UCUM units of measure.
          </p>
          <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-[11px] text-slate-400 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
            <span>Authentic clinical standard structure without real clinical data.</span>
          </div>
        </div>

        {/* USER UPLOADED */}
        <div className="p-6 rounded-2xl glass-panel border border-emerald-500/20 bg-slate-950/80 space-y-3">
          <div className="flex items-center justify-between">
            <span className="px-3 py-1 rounded-lg text-xs font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-400/40">
              USER UPLOADED DATASETS
            </span>
            <span className="text-[11px] text-slate-400 font-mono">Interoperability Lab</span>
          </div>
          <h3 className="text-base font-bold text-white">Client-Controlled Ingestion</h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Data uploaded into the Data Interoperability Lab (CSV, JSON, TXT) is processed ephemerally within the session buffer for mapping validation. No uploaded data is transmitted to unapproved third parties.
          </p>
          <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-[11px] text-slate-400 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Local session boundary maintained during lab tests.</span>
          </div>
        </div>

        {/* AI GENERATED */}
        <div className="p-6 rounded-2xl glass-panel border border-purple-500/20 bg-slate-950/80 space-y-3">
          <div className="flex items-center justify-between">
            <span className="px-3 py-1 rounded-lg text-xs font-black uppercase tracking-wider bg-purple-500/20 text-purple-300 border border-purple-400/40">
              AI GENERATED OUTPUTS
            </span>
            <span className="text-[11px] text-slate-400 font-mono">Gemini 3.8 Flash</span>
          </div>
          <h3 className="text-base font-bold text-white">Autonomous Agent Inferences</h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            FHIR transformations, schema audit reports, and voice answers are generated via Google GenAI or deterministic rules. Explanations and epidemiological correlation indices are hypothetical scenario models, not clinical diagnoses.
          </p>
          <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-[11px] text-slate-400 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0" />
            <span>Strict prompt boundaries forbidding clinical diagnosis.</span>
          </div>
        </div>
      </div>

      {/* Production Notice Card */}
      <div className="p-6 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200 space-y-2">
        <div className="flex items-center gap-2 text-amber-300 font-bold text-sm">
          <AlertTriangle className="w-5 h-5 shrink-0 text-amber-400" />
          <span>Production Architecture & Regulatory Guidance Note</span>
        </div>
        <p className="text-xs leading-relaxed text-slate-300">
          “Production deployment would require appropriate encryption (TLS 1.3 in-transit, AES-256 at-rest), mutual TLS (mTLS) for SCADA connectors, OAuth 2.0 SMART on FHIR authorization, consent management, rigorous audit controls, secure healthcare APIs and applicable regulatory compliance (e.g. HIPAA, GDPR, ISO/IEEE 11073).”
        </p>
      </div>

      {/* Strict Truthfulness Directives */}
      <div className="p-6 rounded-2xl glass-panel border border-slate-800 bg-slate-950/70 space-y-3">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Scale className="w-4 h-4 text-cyan-400" />
          Hackathon Truthfulness & Verification Boundaries
        </h3>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-slate-400">
          <li className="p-2 rounded-lg bg-slate-900/50 border border-slate-800 flex items-center gap-2">
            <span className="text-rose-400 font-bold">✕</span> No real-world outbreak detection claimed.
          </li>
          <li className="p-2 rounded-lg bg-slate-900/50 border border-slate-800 flex items-center gap-2">
            <span className="text-rose-400 font-bold">✕</span> No medical diagnosis or clinical treatment guidance.
          </li>
          <li className="p-2 rounded-lg bg-slate-900/50 border border-slate-800 flex items-center gap-2">
            <span className="text-rose-400 font-bold">✕</span> Correlation figures (e.g. 99.2%) are simulated indices.
          </li>
          <li className="p-2 rounded-lg bg-slate-900/50 border border-slate-800 flex items-center gap-2">
            <span className="text-rose-400 font-bold">✕</span> No automatic HIPAA compliance claims.
          </li>
        </ul>
      </div>
    </div>
  );
};
