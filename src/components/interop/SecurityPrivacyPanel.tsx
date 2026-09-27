import React from 'react';
import { 
  ShieldCheck, 
  Lock, 
  EyeOff, 
  FileText, 
  CheckCircle2, 
  UserCheck, 
  Sparkles,
  AlertCircle
} from 'lucide-react';

export const SecurityPrivacyPanel: React.FC = () => {
  const PILLARS = [
    {
      title: 'Data Minimization & De-Identification',
      status: 'Implemented in Demo',
      icon: EyeOff,
      color: 'border-cyan-400/40 text-cyan-300',
      description: 'Patient records are assigned pseudonymized synthetic identifiers (e.g. SYN-DEL-089). No direct PHI (names, national IDs, exact home addresses) is ingested or emitted into public channels.'
    },
    {
      title: 'Role-Based Access Control (RBAC)',
      status: 'Implemented in Demo',
      icon: UserCheck,
      color: 'border-purple-400/40 text-purple-300',
      description: 'Multi-role permission model with separate access levels for Public Health Authorities, Hospital Triage Clinicians, Water SCADA Engineers, and Academic Researchers.'
    },
    {
      title: 'Human-in-the-Loop AI Oversight',
      status: 'Implemented in Demo',
      icon: CheckCircle2,
      color: 'border-emerald-400/40 text-emerald-300',
      description: 'Automated AI mappings require explicit human reviewer sign-off (Approve / Edit / Reject). Low-confidence or ambiguous fields are strictly flagged with REVIEW REQUIRED.'
    },
    {
      title: 'Immutable Interoperability Audit Trails',
      status: 'Implemented in Demo',
      icon: FileText,
      color: 'border-amber-400/40 text-amber-300',
      description: 'Every transformation, mapping approval, and FHIR export is time-stamped and logged to audit trails with actor identity and payload checksums.'
    },
    {
      title: 'Transport Encryption & API Security',
      status: 'Architecture Design',
      icon: Lock,
      color: 'border-blue-400/40 text-blue-300',
      description: 'Designed for mutual TLS (mTLS) and OAuth 2.0 / SMART-on-FHIR token-based authentication across health system and municipal SCADA network boundaries.'
    }
  ];

  return (
    <div className="p-6 md:p-8 rounded-3xl glass-panel border border-cyan-500/20 bg-slate-950/80 shadow-2xl space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/15 border border-cyan-400/40 text-cyan-300 text-xs font-bold tracking-wide mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>SECURITY, PRIVACY & GOVERNANCE</span>
          </div>
          <h3 className="text-2xl font-black text-white tracking-tight">
            Security & Privacy Architecture
          </h3>
          <p className="text-xs text-slate-300">
            Engineered with strict healthcare data governance, HIPAA/GDPR alignment, and human oversight.
          </p>
        </div>

        <span className="px-3 py-1 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-xs font-mono font-bold">
          HUMAN-IN-THE-LOOP
        </span>
      </div>

      {/* Grid of Security Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {PILLARS.map((p, idx) => {
          const Icon = p.icon;
          return (
            <div
              key={idx}
              className={`p-4 rounded-2xl bg-slate-900/60 border ${p.color} transition-all hover:scale-105 flex flex-col justify-between`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Icon className="w-5 h-5" />
                  <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                    {p.status}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-white mb-1">{p.title}</h4>
                <p className="text-[11px] text-slate-300 leading-relaxed">{p.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
