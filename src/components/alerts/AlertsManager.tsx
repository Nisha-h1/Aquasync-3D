import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { OneHealthAlert, SeverityLevel, ResolutionRequest } from '../../types';
import { 
  AlertTriangle, 
  CheckCircle2, 
  Droplets, 
  Activity, 
  FileCode2, 
  Share2, 
  Filter, 
  Clock, 
  ArrowRight, 
  ShieldAlert, 
  Lock, 
  ShieldCheck, 
  FileText, 
  Upload, 
  X, 
  Check, 
  AlertCircle, 
  History, 
  ChevronDown, 
  ChevronUp, 
  Paperclip,
  UserCheck
} from 'lucide-react';

export const AlertsManager: React.FC = () => {
  const { 
    alerts, 
    resolveAlert, 
    requestResolution, 
    approveResolution, 
    rejectResolution, 
    selectRegionAndNavigate, 
    currentUser 
  } = useApp();

  const [levelFilter, setLevelFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'pending' | 'resolved'>('all');

  // Modal States
  const [requestModalAlert, setRequestModalAlert] = useState<OneHealthAlert | null>(null);
  const [reviewModalAlert, setReviewModalAlert] = useState<OneHealthAlert | null>(null);
  const [directResolveModalAlert, setDirectResolveModalAlert] = useState<OneHealthAlert | null>(null);
  const [expandedAuditAlertId, setExpandedAuditAlertId] = useState<string | null>(null);

  // Request Form States
  const [profession, setProfession] = useState<string>('');
  const [organization, setOrganization] = useState<string>('');
  const [professionalId, setProfessionalId] = useState<string>('');
  const [resolutionNotes, setResolutionNotes] = useState<string>('');
  const [evidenceFile, setEvidenceFile] = useState<File | null>(null);
  const [requestError, setRequestError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Review & Approval States
  const [approvalNotes, setApprovalNotes] = useState<string>('');
  const [rejectionReason, setRejectionReason] = useState<string>('');
  const [isRejecting, setIsRejecting] = useState<boolean>(false);

  // Authorized roles: Water Authority, Public Health Official, Field Inspector, Admin
  const isAuthorizedToResolve = Boolean(
    currentUser && (
      currentUser.role === 'admin' ||
      currentUser.role === 'health_authority' ||
      currentUser.role === 'water_authority' ||
      currentUser.role === 'field_inspector' ||
      (currentUser.role as string) === 'supervisor' ||
      (currentUser.role as string)?.includes?.('admin') ||
      (currentUser.role as string)?.includes?.('authority') ||
      (currentUser.role as string)?.includes?.('inspector') ||
      (currentUser.role as string)?.includes?.('supervisor')
    )
  );

  const filteredAlerts = alerts.filter(a => {
    const matchesLevel = levelFilter === 'all' || a.level === levelFilter;
    const matchesCategory = categoryFilter === 'all' || a.category === categoryFilter;
    
    const alertStatus = a.resolved 
      ? 'resolved' 
      : a.resolutionStatus === 'pending_verification' 
      ? 'pending' 
      : 'active';

    const matchesStatus = statusFilter === 'all' || alertStatus === statusFilter;

    return matchesLevel && matchesCategory && matchesStatus;
  });

  const getAlertBadge = (level: string) => {
    switch (level) {
      case 'critical': return 'bg-rose-500/20 text-rose-300 border-rose-500/40';
      case 'high': return 'bg-orange-500/20 text-orange-300 border-orange-500/40';
      case 'medium': return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      default: return 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40';
    }
  };

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'outbreak': return Activity;
      case 'water_quality': return Droplets;
      case 'fhir_validation': return FileCode2;
      default: return Share2;
    }
  };

  // Open Request Modal with pre-filled defaults
  const handleOpenRequestModal = (alert: OneHealthAlert) => {
    setRequestModalAlert(alert);
    setProfession(
      currentUser.role === 'hospital' ? 'Healthcare Professional / Triage Specialist' :
      currentUser.role === 'researcher' ? 'Hydrological Microbiology Researcher' :
      currentUser.role === 'citizen' ? 'Community Water Sentinel' :
      'Field Technical Specialist'
    );
    setOrganization(currentUser.organization || 'Regional Public Health Network');
    setProfessionalId(
      currentUser.role === 'hospital' ? 'MED-DEL-98442' :
      currentUser.role === 'researcher' ? 'RES-UNIV-1049' :
      'TECH-INSP-7712'
    );
    setResolutionNotes('');
    setEvidenceFile(null);
    setRequestError(null);
  };

  // Submit Resolution Request
  const handleSubmitRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!requestModalAlert) return;

    if (!professionalId.trim()) {
      setRequestError('Please provide your Professional / License ID.');
      return;
    }
    if (!resolutionNotes.trim() || resolutionNotes.trim().length < 15) {
      setRequestError('Please provide detailed resolution notes explaining field actions taken (min 15 characters).');
      return;
    }

    setIsSubmitting(true);
    setRequestError(null);

    const success = await requestResolution(requestModalAlert.id, {
      profession,
      organization,
      professionalId,
      notes: resolutionNotes,
      evidenceFileName: evidenceFile ? evidenceFile.name : undefined
    });

    setIsSubmitting(false);
    if (success) {
      setRequestModalAlert(null);
    }
  };

  // Handle Review Modal Open
  const handleOpenReviewModal = (alert: OneHealthAlert) => {
    setReviewModalAlert(alert);
    setApprovalNotes('Resolution verified and confirmed in accordance with One Health containment protocol.');
    setRejectionReason('');
    setIsRejecting(false);
  };

  // Handle Approve Resolution by Authorized user
  const handleApproveResolution = async () => {
    if (!reviewModalAlert) return;
    setIsSubmitting(true);
    await approveResolution(reviewModalAlert.id, approvalNotes);
    setIsSubmitting(false);
    setReviewModalAlert(null);
  };

  // Handle Reject Resolution Request by Authorized user
  const handleRejectResolution = async () => {
    if (!reviewModalAlert) return;
    if (!rejectionReason.trim()) {
      alert('Please specify the reason for rejecting this resolution request.');
      return;
    }
    setIsSubmitting(true);
    await rejectResolution(reviewModalAlert.id, rejectionReason);
    setIsSubmitting(false);
    setReviewModalAlert(null);
  };

  // Handle Direct Resolution by Authorized user for Active alert
  const handleDirectResolve = async (alert: OneHealthAlert) => {
    setDirectResolveModalAlert(alert);
    setApprovalNotes('Direct resolution verified on-site by authorized authority.');
  };

  const handleConfirmDirectResolve = async () => {
    if (!directResolveModalAlert) return;
    setIsSubmitting(true);
    await resolveAlert(directResolveModalAlert.id, approvalNotes);
    setIsSubmitting(false);
    setDirectResolveModalAlert(null);
  };

  const toggleAuditTrail = (alertId: string) => {
    setExpandedAuditAlertId(prev => prev === alertId ? null : alertId);
  };

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="p-6 rounded-2xl glass-panel border border-cyan-500/20 bg-slate-950/70 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded text-[10px] uppercase font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                Surveillance Dispatch
              </span>
              <span className="text-xs text-slate-400">One Health Early Warning System</span>
            </div>
            <h2 className="text-2xl font-bold text-white mt-1.5 flex items-center gap-2">
              <span>Operational Alerts & Event Stream</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl">
              Real-time notices generated across hydrological sensors, municipal back-siphonage detection, and automated FHIR validation agents.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-rose-400 px-3 py-1.5 rounded-xl bg-rose-500/10 border border-rose-500/30">
              {alerts.filter(a => !a.resolved && a.resolutionStatus !== 'pending_verification').length} Active
            </span>
            <span className="text-xs font-semibold text-amber-300 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              <span>{alerts.filter(a => a.resolutionStatus === 'pending_verification' && !a.resolved).length} Pending Review</span>
            </span>
            <span className="text-xs font-semibold text-emerald-300 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
              {alerts.filter(a => a.resolved).length} Resolved
            </span>
          </div>
        </div>

        {/* User Role Authorization Indicator Banner */}
        <div className="mt-4 p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-400">Current Role:</span>
            <span className="font-bold text-white uppercase font-mono">{currentUser.displayName} ({currentUser.role})</span>
            <span className="text-slate-500">|</span>
            <span className="text-slate-400">{currentUser.organization}</span>
          </div>

          <div>
            {isAuthorizedToResolve ? (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Authorized to Finalize & Approve Resolutions</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-cyan-500/15 text-cyan-300 border border-cyan-400/30">
                <Lock className="w-3.5 h-3.5" />
                <span>Resolution Request Mode (Requires Authority Review)</span>
              </span>
            )}
          </div>
        </div>

        {/* Filters */}
        <div className="mt-4 pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
          {/* Status Filter */}
          <div className="flex items-center gap-1.5 bg-slate-900/80 p-1 rounded-xl border border-slate-800">
            <span className="text-[11px] text-slate-400 px-2 font-medium">Status:</span>
            {[
              { id: 'all', label: 'All Statuses' },
              { id: 'active', label: '🔴 Active' },
              { id: 'pending', label: '🟡 Pending Verification' },
              { id: 'resolved', label: '🟢 Resolved' },
            ].map(s => (
              <button
                key={s.id}
                onClick={() => setStatusFilter(s.id as any)}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  statusFilter === s.id ? 'bg-cyan-500/30 text-cyan-200 border border-cyan-400/40 font-semibold' : 'text-slate-400 hover:text-white'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>

          {/* Level Filter */}
          <div className="flex items-center gap-1.5 bg-slate-900/80 p-1 rounded-xl border border-slate-800">
            <span className="text-[11px] text-slate-400 px-2">Level:</span>
            {(['all', 'critical', 'high', 'medium', 'info'] as const).map(l => (
              <button
                key={l}
                onClick={() => setLevelFilter(l)}
                className={`px-2 py-1 rounded-lg capitalize transition-all ${
                  levelFilter === l ? 'bg-cyan-500/30 text-cyan-200 border border-cyan-400/40' : 'text-slate-400 hover:text-white'
                }`}
              >
                {l}
              </button>
            ))}
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-1.5 bg-slate-900/80 p-1 rounded-xl border border-slate-800">
            <span className="text-[11px] text-slate-400 px-2">Category:</span>
            {[
              { id: 'all', label: 'All' },
              { id: 'outbreak', label: 'Outbreak' },
              { id: 'water_quality', label: 'Water Quality' },
              { id: 'fhir_validation', label: 'FHIR Validation' },
            ].map(c => (
              <button
                key={c.id}
                onClick={() => setCategoryFilter(c.id)}
                className={`px-2 py-1 rounded-lg transition-all ${
                  categoryFilter === c.id ? 'bg-cyan-500/30 text-cyan-200 border border-cyan-400/40' : 'text-slate-400 hover:text-white'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Alerts Feed */}
      <div className="space-y-4">
        {filteredAlerts.length > 0 ? (
          filteredAlerts.map((alert) => {
            const Icon = getCategoryIcon(alert.category);
            const isPendingVerification = alert.resolutionStatus === 'pending_verification' && !alert.resolved;
            const isResolved = alert.resolved;
            const isActive = !isResolved && !isPendingVerification;
            const isAuditExpanded = expandedAuditAlertId === alert.id;

            return (
              <div
                key={alert.id}
                className={`p-5 rounded-2xl glass-panel border transition-all ${
                  isResolved
                    ? 'border-slate-800 bg-slate-950/40 opacity-75'
                    : isPendingVerification
                    ? 'border-amber-500/40 bg-amber-950/15 shadow-md shadow-amber-950/20'
                    : alert.level === 'critical'
                    ? 'border-rose-500/40 bg-rose-950/20 shadow-lg'
                    : 'border-slate-800 bg-slate-950/80 hover:border-slate-700'
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  <div className="flex items-start gap-3.5 flex-1">
                    <div className={`p-2.5 rounded-xl bg-slate-950 border shrink-0 ${
                      alert.level === 'critical' ? 'text-rose-400 border-rose-500/40' :
                      alert.level === 'high' ? 'text-orange-400 border-orange-500/40' :
                      'text-cyan-400 border-cyan-500/40'
                    }`}>
                      <Icon className="w-5 h-5" />
                    </div>

                    <div className="space-y-2 flex-1">
                      {/* Status Badges Row */}
                      <div className="flex items-center gap-2 flex-wrap">
                        {/* Severity Badge */}
                        <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-black tracking-wider border ${getAlertBadge(alert.level)}`}>
                          {alert.level}
                        </span>

                        {/* Tri-State Workflow Status Badge */}
                        {isResolved ? (
                          <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                            <span>🟢 Resolved</span>
                          </span>
                        ) : isPendingVerification ? (
                          <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1.5 animate-pulse">
                            <Clock className="w-3 h-3 text-amber-400" />
                            <span>🟡 Resolution Requested / Pending Verification</span>
                          </span>
                        ) : (
                          <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40 flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-ping" />
                            <span>🔴 Active Alert</span>
                          </span>
                        )}

                        <span className="text-xs font-semibold text-slate-300">
                          {alert.regionName}
                        </span>
                        <span className="text-[11px] text-slate-500 font-mono">
                          {new Date(alert.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} UTC
                        </span>
                        <span className="text-[10px] font-mono text-slate-500 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800">
                          #{alert.id}
                        </span>
                      </div>

                      {/* Alert Title & Message */}
                      <h4 className="text-base font-bold text-white">{alert.title}</h4>
                      <p className="text-xs text-slate-300 leading-relaxed">{alert.message}</p>

                      {/* Required Action Box */}
                      <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-cyan-200 flex items-start gap-2">
                        <strong className="text-slate-400 text-[11px] uppercase tracking-wider shrink-0">Required Action:</strong>
                        <span>{alert.actionRequired}</span>
                      </div>

                      {/* Pending Resolution Request Summary Box (if present) */}
                      {isPendingVerification && alert.resolutionRequest && (
                        <div className="p-3 rounded-xl bg-amber-950/30 border border-amber-500/30 text-xs space-y-1.5">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-amber-300 flex items-center gap-1.5">
                              <FileText className="w-3.5 h-3.5" />
                              <span>Pending Verification Request by {alert.resolutionRequest.requestedBy}</span>
                            </span>
                            <span className="font-mono text-[10px] text-slate-400">{alert.resolutionRequest.timestamp}</span>
                          </div>
                          <div className="text-[11px] text-slate-300">
                            <strong>Role/Org:</strong> {alert.resolutionRequest.profession} • {alert.resolutionRequest.organization} (ID: {alert.resolutionRequest.professionalId})
                          </div>
                          <div className="text-[11px] text-slate-300 bg-slate-950/60 p-2 rounded-lg border border-slate-800/80 italic">
                            "{alert.resolutionRequest.notes}"
                          </div>
                          {alert.resolutionRequest.evidenceFileName && (
                            <div className="text-[10px] text-cyan-300 flex items-center gap-1.5 font-mono">
                              <Paperclip className="w-3 h-3 text-cyan-400" />
                              <span>Attached Evidence: {alert.resolutionRequest.evidenceFileName} ({alert.resolutionRequest.evidenceFileSize || '1.2 MB'})</span>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Audit Trail Accordion Toggle */}
                      <div className="pt-1">
                        <button
                          onClick={() => toggleAuditTrail(alert.id)}
                          className="text-[11px] text-slate-400 hover:text-cyan-300 flex items-center gap-1 font-mono transition-colors"
                        >
                          <History className="w-3.5 h-3.5" />
                          <span>Audit Trail ({alert.auditTrail?.length || 0} entries)</span>
                          {isAuditExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                        </button>

                        {/* Audit Trail List */}
                        {isAuditExpanded && (
                          <div className="mt-2.5 p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-3 animate-fade-in text-xs">
                            <div className="text-[11px] font-bold text-slate-300 uppercase tracking-wider flex items-center justify-between pb-1 border-b border-slate-800">
                              <span>Security & Resolution Audit Log — Alert #{alert.id}</span>
                              <span className="text-[10px] font-mono text-emerald-400">Immutable Record</span>
                            </div>

                            {alert.auditTrail && alert.auditTrail.length > 0 ? (
                              <div className="space-y-2.5">
                                {alert.auditTrail.map((audit) => (
                                  <div key={audit.id} className="p-2.5 rounded-lg bg-slate-900/70 border border-slate-800/80 space-y-1 font-mono text-[11px]">
                                    <div className="flex items-center justify-between text-slate-400">
                                      <span className="font-bold text-white flex items-center gap-1">
                                        <UserCheck className="w-3.5 h-3.5 text-cyan-400" />
                                        <span>{audit.action}</span>
                                      </span>
                                      <span className="text-[10px] text-slate-500">{audit.timestamp}</span>
                                    </div>
                                    <div className="text-slate-300 text-[10px]">
                                      <strong>By:</strong> {audit.actor} ({audit.role}) • {audit.organization}
                                    </div>
                                    <div className="text-slate-400 text-[10px] flex items-center gap-1.5">
                                      <span className="text-rose-400">{audit.previousStatus}</span>
                                      <ArrowRight className="w-2.5 h-2.5 text-slate-600" />
                                      <span className="text-emerald-400">{audit.newStatus}</span>
                                    </div>
                                    {audit.notes && (
                                      <div className="text-[10px] text-slate-300 italic pt-0.5">
                                        Note: "{audit.notes}"
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <p className="text-[11px] text-slate-500 italic">No audit trail events recorded yet.</p>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions Column */}
                  <div className="flex flex-col sm:flex-row md:flex-col items-stretch sm:items-center gap-2 shrink-0 md:self-start">
                    {/* Locate on Globe - UNTOUCHED & PRESERVED */}
                    <button
                      onClick={() => selectRegionAndNavigate(alert.regionId, 'globe')}
                      className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 hover:border-cyan-400 text-slate-200 text-xs font-semibold transition-all flex items-center justify-center gap-1.5"
                    >
                      <span>Locate on Globe</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>

                    {/* Resolution Action Button based on Workflow & Role */}
                    {isResolved ? (
                      <span className="px-3 py-1.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center justify-center gap-1.5 cursor-default">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Resolved</span>
                      </span>
                    ) : isPendingVerification ? (
                      /* Alert is currently in Pending Verification state */
                      isAuthorizedToResolve ? (
                        <button
                          onClick={() => handleOpenReviewModal(alert)}
                          className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 text-xs font-bold transition-all shadow-md flex items-center justify-center gap-1.5"
                        >
                          <ShieldCheck className="w-3.5 h-3.5" />
                          <span>Review & Approve</span>
                        </button>
                      ) : (
                        <div className="px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-medium text-center flex items-center justify-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 animate-spin" />
                          <span>Under Review</span>
                        </div>
                      )
                    ) : (
                      /* Alert is currently Active */
                      isAuthorizedToResolve ? (
                        <button
                          onClick={() => handleDirectResolve(alert)}
                          className="px-3 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 text-xs font-semibold transition-all flex items-center justify-center gap-1.5"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Mark Resolved</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => handleOpenRequestModal(alert)}
                          className="px-3.5 py-1.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400/40 text-cyan-300 text-xs font-semibold transition-all flex items-center justify-center gap-1.5 shadow-sm"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          <span>Request Resolution</span>
                        </button>
                      )
                    )}
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="p-12 text-center rounded-2xl glass-panel border border-slate-800 text-slate-400">
            <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto mb-2" />
            <p className="font-semibold text-white text-sm">No Alerts in Selected Filter</p>
            <p className="text-xs text-slate-500 mt-1">All monitored water bodies and validation processes operating normally.</p>
          </div>
        )}
      </div>

      {/* ------------------------------------------------------------------- */}
      {/* MODAL 1: REQUEST RESOLUTION FORM (FOR UNAUTHORIZED USERS) */}
      {/* ------------------------------------------------------------------- */}
      {requestModalAlert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-lg rounded-2xl glass-panel-glow border border-cyan-500/30 bg-[#060c18] p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-3 border-b border-slate-800">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                    PROFESSIONAL VERIFICATION
                  </span>
                  <span className="text-xs text-slate-400">Alert #{requestModalAlert.id}</span>
                </div>
                <h3 className="text-lg font-bold text-white mt-1">Request Alert Resolution</h3>
              </div>
              <button
                onClick={() => setRequestModalAlert(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Alert Context Notice */}
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs">
              <span className="text-slate-400 font-bold block">{requestModalAlert.title}</span>
              <span className="text-[11px] text-slate-500">{requestModalAlert.regionName}</span>
            </div>

            {requestError && (
              <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{requestError}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmitRequest} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Profession / Role <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={profession}
                    onChange={(e) => setProfession(e.target.value)}
                    placeholder="e.g. Field Technician, Nurse, Water Chemist"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-slate-200 focus:border-cyan-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Organization <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={organization}
                    onChange={(e) => setOrganization(e.target.value)}
                    placeholder="e.g. City Hospital, Water Board, NGO"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-slate-200 focus:border-cyan-400 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Professional ID / License Number <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={professionalId}
                  onChange={(e) => setProfessionalId(e.target.value)}
                  placeholder="e.g. LIC-DL-98442 or Hospital Staff ID"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-slate-200 focus:border-cyan-400 focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Resolution Notes & Field Actions <span className="text-rose-400">*</span>
                </label>
                <textarea
                  required
                  rows={4}
                  value={resolutionNotes}
                  onChange={(e) => setResolutionNotes(e.target.value)}
                  placeholder="Detail the field interventions, water chlorination status, clinical outcomes, or negative repeat bacterial tests that warrant resolving this alert..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-slate-200 focus:border-cyan-400 focus:outline-none resize-none leading-relaxed"
                />
              </div>

              {/* Optional Evidence / Report Attachment */}
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Evidence / Report Attachment (Optional)
                </label>
                <div className="p-3 rounded-xl border border-dashed border-slate-700 bg-slate-950 hover:border-cyan-400 transition-colors flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <Upload className="w-4 h-4 text-cyan-400" />
                    <span className="text-slate-300 font-mono">
                      {evidenceFile ? evidenceFile.name : 'Upload test certificate, lab PDF or photo report'}
                    </span>
                  </div>
                  <label className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700 text-cyan-300 cursor-pointer hover:bg-slate-800 transition-colors">
                    <span>Browse</span>
                    <input
                      type="file"
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          setEvidenceFile(e.target.files[0]);
                        }
                      }}
                    />
                  </label>
                </div>
              </div>

              {/* Verification Disclosure Notice */}
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-[11px] text-amber-200 leading-snug">
                ⚠️ <strong>Workflow Notice:</strong> Submitting this request will set the alert status to 
                <strong> "Resolution Requested / Pending Verification"</strong>. It will be queued for formal sign-off by a Water Authority, Public Health Official, or Field Inspector.
              </div>

              {/* Modal Buttons */}
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setRequestModalAlert(null)}
                  className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold flex items-center gap-1.5 transition-all shadow-md disabled:opacity-50"
                >
                  {isSubmitting ? <span>Submitting...</span> : (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Submit Resolution Request</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------- */}
      {/* MODAL 2: REVIEW & APPROVE RESOLUTION (FOR AUTHORIZED USERS) */}
      {/* ------------------------------------------------------------------- */}
      {reviewModalAlert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-lg rounded-2xl glass-panel-glow border border-amber-500/40 bg-[#060c18] p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between pb-3 border-b border-slate-800">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    AUTHORITY REVIEW & SIGN-OFF
                  </span>
                  <span className="text-xs text-slate-400">Alert #{reviewModalAlert.id}</span>
                </div>
                <h3 className="text-lg font-bold text-white mt-1">Review Resolution Request</h3>
              </div>
              <button
                onClick={() => setReviewModalAlert(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Alert Details */}
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs">
              <span className="font-bold text-white block">{reviewModalAlert.title}</span>
              <p className="text-slate-400 mt-0.5">{reviewModalAlert.message}</p>
            </div>

            {/* Submitted Request Details */}
            {reviewModalAlert.resolutionRequest ? (
              <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-500/30 text-xs space-y-2">
                <div className="flex items-center justify-between font-bold text-amber-300">
                  <span>Filed by: {reviewModalAlert.resolutionRequest.requestedBy}</span>
                  <span className="text-[10px] font-mono text-slate-400">{reviewModalAlert.resolutionRequest.timestamp}</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-300 pt-1 border-t border-amber-500/20">
                  <div><strong>Profession:</strong> {reviewModalAlert.resolutionRequest.profession}</div>
                  <div><strong>Org:</strong> {reviewModalAlert.resolutionRequest.organization}</div>
                  <div className="col-span-2"><strong>Professional ID:</strong> <span className="font-mono text-cyan-300">{reviewModalAlert.resolutionRequest.professionalId}</span></div>
                </div>
                <div className="text-[11px] text-slate-200 bg-slate-950/80 p-3 rounded-lg border border-slate-800 leading-relaxed">
                  <strong>Resolution Notes:</strong>
                  <p className="mt-1 italic">"{reviewModalAlert.resolutionRequest.notes}"</p>
                </div>
                {reviewModalAlert.resolutionRequest.evidenceFileName && (
                  <div className="p-2 rounded-lg bg-cyan-950/30 border border-cyan-400/30 text-cyan-300 text-[11px] flex items-center justify-between font-mono">
                    <span className="flex items-center gap-1.5">
                      <Paperclip className="w-3.5 h-3.5 text-cyan-400" />
                      <span>{reviewModalAlert.resolutionRequest.evidenceFileName}</span>
                    </span>
                    <span className="text-[10px] text-slate-400">Attached Report Verified</span>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-xs text-slate-400 italic">No formal verification request record attached.</div>
            )}

            {/* Decision Input */}
            {!isRejecting ? (
              <div className="space-y-2 text-xs">
                <label className="block text-slate-300 font-semibold">
                  Official Approval Sign-off Note:
                </label>
                <textarea
                  rows={2}
                  value={approvalNotes}
                  onChange={(e) => setApprovalNotes(e.target.value)}
                  placeholder="Enter authority sign-off justification..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-slate-200 focus:border-emerald-400 focus:outline-none resize-none"
                />
              </div>
            ) : (
              <div className="space-y-2 text-xs">
                <label className="block text-rose-300 font-semibold">
                  Reason for Rejection / Keeping Alert Active:
                </label>
                <textarea
                  rows={2}
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="Explain why evidence is insufficient or what additional field clearance is required..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-rose-500/50 text-slate-200 focus:border-rose-400 focus:outline-none resize-none"
                />
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-800">
              {!isRejecting ? (
                <>
                  <button
                    type="button"
                    onClick={() => setIsRejecting(true)}
                    className="px-3 py-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 text-rose-300 text-xs font-semibold transition-colors"
                  >
                    Reject Request
                  </button>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setReviewModalAlert(null)}
                      className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      disabled={isSubmitting}
                      onClick={handleApproveResolution}
                      className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-all shadow-md"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Approve Resolution</span>
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => setIsRejecting(false)}
                    className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs"
                  >
                    Back to Approval
                  </button>
                  <button
                    type="button"
                    disabled={isSubmitting}
                    onClick={handleRejectResolution}
                    className="px-5 py-2 rounded-xl bg-rose-500 hover:bg-rose-400 text-white font-bold text-xs flex items-center gap-1.5 transition-all"
                  >
                    Confirm Rejection
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------- */}
      {/* MODAL 3: DIRECT RESOLUTION CONFIRMATION (FOR AUTHORIZED USERS) */}
      {/* ------------------------------------------------------------------- */}
      {directResolveModalAlert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-md rounded-2xl glass-panel-glow border border-emerald-500/40 bg-[#060c18] p-6 shadow-2xl space-y-4">
            <div className="flex items-start justify-between pb-3 border-b border-slate-800">
              <div>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  AUTHORITY DIRECT RESOLUTION
                </span>
                <h3 className="text-lg font-bold text-white mt-1">Mark Alert as Resolved</h3>
              </div>
              <button
                onClick={() => setDirectResolveModalAlert(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs">
              <span className="font-bold text-white block">{directResolveModalAlert.title}</span>
              <p className="text-slate-400 mt-0.5">{directResolveModalAlert.regionName}</p>
            </div>

            <div className="space-y-1.5 text-xs">
              <label className="block text-slate-300 font-semibold">
                Official Resolution Justification:
              </label>
              <textarea
                rows={3}
                value={approvalNotes}
                onChange={(e) => setApprovalNotes(e.target.value)}
                placeholder="Enter field notes, repeat water test results, or official closure sign-off..."
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-slate-200 focus:border-emerald-400 focus:outline-none resize-none leading-relaxed"
              />
            </div>

            <div className="text-[11px] text-slate-400 font-mono">
              Signing off as: <strong>{currentUser.displayName}</strong> ({currentUser.role})
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setDirectResolveModalAlert(null)}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isSubmitting}
                onClick={handleConfirmDirectResolve}
                className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Confirm Resolution</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
