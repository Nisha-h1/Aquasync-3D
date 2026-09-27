import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { UserRole, AuditLogEntry } from '../../types';
import { api } from '../../services/api';
import { 
  ShieldCheck, 
  User, 
  Lock, 
  Users, 
  Key, 
  History, 
  Building2, 
  Droplets, 
  BookOpen, 
  Activity, 
  Check, 
  Database,
  Cloud,
  FileCode2
} from 'lucide-react';

export const AuthAndSettings: React.FC = () => {
  const { currentUser, setUserRole, isAiOnline } = useApp();
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([]);
  const [activeTab, setActiveTab] = useState<'roles' | 'security' | 'audit'>('roles');

  useEffect(() => {
    loadAuditLogs();
  }, []);

  const loadAuditLogs = async () => {
    const logs = await api.getAuditLogs();
    if (logs) setAuditLogs(logs);
  };

  const roleConfigs: { role: UserRole; title: string; org: string; icon: any; color: string; desc: string; permissions: string[] }[] = [
    {
      role: 'admin',
      title: 'Global Administrator',
      org: 'Global One Health Interoperability Alliance',
      icon: ShieldCheck,
      color: 'text-purple-400',
      desc: 'Full administrative rights: manage security rules, provision endpoints, review audit logs, and trigger global interoperability synchronization.',
      permissions: ['Manage Users & Security Rules', 'Deploy Interoperability Adapters', 'Full Audit Log Access', 'Clear & Dispatch Alerts']
    },
    {
      role: 'health_authority',
      title: 'Public Health Epidemiologist',
      org: 'Ministry of Health & Epidemic Surveillance',
      icon: Activity,
      color: 'text-rose-400',
      desc: 'Epidemiological monitoring: view global severity heatmaps, trigger containment alerts, and analyze cross-domain synthetic disease clusters.',
      permissions: ['View Global Outbreak Dashboards', 'Dispatch Public Health Boil-Water Warnings', 'Inspect Regional Case Curves', 'Access FHIR Patient Bundles']
    },
    {
      role: 'hospital',
      title: 'Hospital Triage Director',
      org: 'Apollo Hospital Emergency Triage',
      icon: Building2,
      color: 'text-emerald-400',
      desc: 'Clinical healthcare interface: import EHR admissions into FHIR Encounters and correlate patient symptoms with municipal water pipelines.',
      permissions: ['Ingest HL7 v2 / FHIR Patient Records', 'View Water Contamination Overlay in Triage', 'Validate Clinical Diagnostic Codes', 'Export Discharge Bundles']
    },
    {
      role: 'water_authority',
      title: 'Water SCADA Engineer',
      org: 'Delhi Jal Water Board Telemetry Unit',
      icon: Droplets,
      color: 'text-cyan-400',
      desc: 'Hydrological management: stream IoT sensor telemetry, log bacterial lab samples, and trigger automated pipeline chlorination boosters.',
      permissions: ['Ingest Water Quality Observations (LOINC 58452-4)', 'Manage Municipal Well Nodes', 'Automate SCADA Telemetry Feeds', 'Schedule Mobile Water Testing Vans']
    },
    {
      role: 'researcher',
      title: 'Genomic & Hydrological Researcher',
      org: 'Institute of Hydrological Microbiology',
      icon: BookOpen,
      color: 'text-amber-400',
      desc: 'Academic & analytical research: access Interoperability Lab, audit FHIR R4 schema compliance, and evaluate synthetic correlation models.',
      permissions: ['Full Interoperability Lab Access', 'Execute AI Mapping & Validation Agents', 'Download Anonymized Research Bundles', 'Request Alert Resolution Only']
    },
    {
      role: 'field_inspector',
      title: 'Certified Field Inspector (Authorized)',
      org: 'Municipal Water Inspection & Enforcement Division',
      icon: ShieldCheck,
      color: 'text-emerald-400',
      desc: 'On-site sanitation enforcement: perform physical pipeline checks, review field resolution requests, and sign off official alert resolutions.',
      permissions: ['Approve & Finalize Alert Resolutions', 'Conduct On-Site Water Verification', 'Review Laboratory Clearance Certificates', 'Audit Field Compliance']
    },
    {
      role: 'citizen',
      title: 'Community Water Sentinel (Public/Citizen)',
      org: 'Community Water Sentinel Network',
      icon: Users,
      color: 'text-sky-400',
      desc: 'Public / Citizen observer: report tap contamination, view public alerts, and submit resolution requests with professional ID and notes.',
      permissions: ['View Public Health Water Alerts', 'Locate Outbreaks on Globe', 'Submit Verification Resolution Requests', 'Access Community Safety Advice']
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 rounded-2xl glass-panel border border-cyan-500/20 bg-slate-950/70 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded text-[10px] uppercase font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                Security & Governance
              </span>
              <span className="text-xs text-slate-400">Zero-Trust RBAC & Audit Trails</span>
            </div>
            <h2 className="text-2xl font-bold text-white mt-1.5 flex items-center gap-2">
              <span>Authentication, Roles & Platform Settings</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl">
              Switch between simulated stakeholder roles to test customized authorization boundaries across hospital EHRs, municipal water SCADA, and epidemiological command centers.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${isAiOnline ? 'bg-emerald-400' : 'bg-cyan-400'}`} />
              <span className="text-slate-300">
                AI Engine: {isAiOnline ? 'Gemini 3.8 Flash' : 'Demo Local Synthesis'}
              </span>
            </div>
          </div>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center gap-2 mt-6 pt-4 border-t border-slate-800 text-xs">
          <button
            onClick={() => setActiveTab('roles')}
            className={`px-3.5 py-1.5 rounded-lg font-semibold transition-all ${
              activeTab === 'roles' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40' : 'text-slate-400 hover:text-white'
            }`}
          >
            Role Switcher (RBAC)
          </button>
          <button
            onClick={() => setActiveTab('security')}
            className={`px-3.5 py-1.5 rounded-lg font-semibold transition-all ${
              activeTab === 'security' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40' : 'text-slate-400 hover:text-white'
            }`}
          >
            Security & Firestore Blueprint
          </button>
          <button
            onClick={() => setActiveTab('audit')}
            className={`px-3.5 py-1.5 rounded-lg font-semibold transition-all ${
              activeTab === 'audit' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40' : 'text-slate-400 hover:text-white'
            }`}
          >
            Audit Trail ({auditLogs.length} Events)
          </button>
        </div>
      </div>

      {/* TAB 1: Role Switcher & Permissions */}
      {activeTab === 'roles' && (
        <div className="space-y-4">
          <div className="text-xs text-slate-400 mb-2">
            Click any stakeholder persona below to switch active role and verify access control:
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {roleConfigs.map((config) => {
              const Icon = config.icon;
              const isActive = currentUser.role === config.role;

              return (
                <div
                  key={config.role}
                  onClick={() => setUserRole(config.role)}
                  className={`p-5 rounded-2xl cursor-pointer border transition-all flex flex-col justify-between ${
                    isActive
                      ? 'bg-cyan-950/40 border-cyan-400 ring-2 ring-cyan-400/30 shadow-2xl scale-[1.02]'
                      : 'bg-slate-950/70 border-slate-800 hover:border-slate-700 hover:bg-slate-900/60'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className={`p-2.5 rounded-xl bg-slate-950 border border-slate-800 ${config.color}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      {isActive && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 flex items-center gap-1">
                          <Check className="w-3 h-3" /> ACTIVE
                        </span>
                      )}
                    </div>

                    <h4 className="font-bold text-white text-base">{config.title}</h4>
                    <p className="text-xs text-slate-400 mt-0.5">{config.org}</p>
                    <p className="text-xs text-slate-300 mt-2.5 leading-relaxed">{config.desc}</p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-800/80 space-y-1.5">
                    <span className="text-[10px] uppercase font-bold text-slate-500 block">Granted Permissions:</span>
                    {config.permissions.map((perm, i) => (
                      <div key={i} className="text-[11px] text-slate-400 flex items-center gap-1.5">
                        <Check className="w-3 h-3 text-cyan-400 shrink-0" />
                        <span>{perm}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: Security & Firestore Blueprint */}
      {activeTab === 'security' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="p-6 rounded-2xl glass-panel border border-slate-800 bg-slate-950/80 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Database className="w-4 h-4 text-cyan-400" />
              Cloud Firestore Schema & Blueprint Integration
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              AquaSync implements <code>firebase-blueprint.json</code> declaring explicit collections:
              <code>/users</code>, <code>/regions</code>, <code>/outbreaks</code>, <code>/patients</code>, <code>/waterQuality</code>, <code>/fhirResources</code>, and <code>/alerts</code>.
            </p>

            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2 text-xs">
              <span className="font-semibold text-white block">Zero-Trust Access Control (ABAC):</span>
              <ul className="space-y-1.5 text-slate-400 text-[11px]">
                <li className="flex items-start gap-1.5">
                  <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                  <span>Document IDs verified via <code>isValidId(id)</code> against ID poisoning.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                  <span>Default deny catch-all enabled on root database documents.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                  <span>Server-side API proxy prevents browser exposure of AI credentials.</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="p-6 rounded-2xl glass-panel border border-slate-800 bg-slate-950/80 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Lock className="w-4 h-4 text-emerald-400" />
              Active Session Details
            </h3>

            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2.5 text-xs text-slate-300">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Authenticated User:</span>
                <strong className="text-white">{currentUser.displayName}</strong>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Email:</span>
                <span className="font-mono text-cyan-300">{currentUser.email}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Role ID:</span>
                <span className="font-mono uppercase text-purple-300">{currentUser.role}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Organization:</span>
                <span className="text-slate-200">{currentUser.organization}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Auth Token:</span>
                <span className="font-mono text-[10px] text-emerald-400">HS256 (Simulated IEEE Standard)</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Audit Trail */}
      {activeTab === 'audit' && (
        <div className="p-6 rounded-2xl glass-panel border border-slate-800 bg-slate-950/80 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <History className="w-4 h-4 text-cyan-400" />
              Immutable System Audit Logs
            </h3>
            <button
              onClick={loadAuditLogs}
              className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold"
            >
              Refresh Logs
            </button>
          </div>

          <div className="space-y-2 max-h-[460px] overflow-y-auto">
            {auditLogs.map((log) => (
              <div key={log.id} className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] text-cyan-400 font-bold">{log.action}</span>
                    <span className="text-[11px] text-slate-400">• By {log.actor} ({log.role})</span>
                  </div>
                  <p className="text-slate-300 text-[11px] leading-snug">{log.details}</p>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-[10px] text-slate-500 font-mono block">
                    {new Date(log.timestamp).toLocaleTimeString()}
                  </span>
                  <span className="text-[9px] uppercase font-bold text-emerald-400">SUCCESS</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
