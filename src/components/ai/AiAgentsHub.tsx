import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { api } from '../../services/api';
import { 
  Sparkles, 
  FileCode2, 
  CheckCircle2, 
  AlertTriangle, 
  Activity, 
  Droplets, 
  ArrowRight, 
  Cpu, 
  Play, 
  RefreshCw, 
  ShieldCheck, 
  HelpCircle,
  FileText,
  Share2
} from 'lucide-react';

export const AiAgentsHub: React.FC = () => {
  const { regions, selectedRegion } = useApp();
  const [activeAgentTab, setActiveAgentTab] = useState<'mapping' | 'validation' | 'insights'>('mapping');

  // Agent 1: Mapping State
  const [mappingInput, setMappingInput] = useState<string>(
`sensor_id,water_source,sample_timestamp,ph_level,turbidity_ntu,coliform_cfu,chlorine_residual,lat,lon
WQ-DEL-908,"Well-5 Sector 8 Aquifer",2026-09-24T08:30:00Z,6.4,18.5,4800,0.05,28.7041,77.1025`
  );
  const [mappingTargetType, setMappingTargetType] = useState<string>('Observation');
  const [isMappingRunning, setIsMappingRunning] = useState<boolean>(false);
  const [mappingResult, setMappingResult] = useState<any>(null);

  // Agent 2: Validation State
  const [validationInput, setValidationInput] = useState<string>(
JSON.stringify({
  resourceType: "Observation",
  id: "obs-water-sample-delhi-001",
  status: "final",
  code: {
    coding: [{
      system: "http://loinc.org",
      code: "58452-4",
      display: "Escherichia coli [Presence] in Water"
    }]
  },
  effectiveDateTime: "2026-09-24T08:30:00Z",
  valueQuantity: {
    value: 4800,
    unit: "CFU/100mL",
    system: "http://unitsofmeasure.org"
  }
}, null, 2)
  );
  const [isValidationRunning, setIsValidationRunning] = useState<boolean>(false);
  const [validationResult, setValidationResult] = useState<any>(null);

  // Agent 3: Health Insights State
  const [insightRegionId, setInsightRegionId] = useState<string>(selectedRegion?.id || 'delhi-rohini');
  const [isInsightsRunning, setIsInsightsRunning] = useState<boolean>(false);
  const [insightsResult, setInsightsResult] = useState<any>(null);

  // Run Agent 1: Mapping
  const handleRunMapping = async () => {
    setIsMappingRunning(true);
    setMappingResult(null);
    try {
      const res = await api.mapToFhir(mappingInput, mappingTargetType);
      if (res && res.data) {
        setMappingResult(res.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsMappingRunning(false);
    }
  };

  // Run Agent 2: Validation
  const handleRunValidation = async () => {
    setIsValidationRunning(true);
    setValidationResult(null);
    try {
      let parsed = {};
      try {
        parsed = JSON.parse(validationInput);
      } catch {
        parsed = { raw: validationInput };
      }
      const res = await api.validateFhir(parsed);
      if (res && res.data) {
        setValidationResult(res.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsValidationRunning(false);
    }
  };

  // Run Agent 3: Health Insights
  const handleRunInsights = async () => {
    setIsInsightsRunning(true);
    setInsightsResult(null);
    try {
      const res = await api.getHealthInsights(insightRegionId);
      if (res && res.data) {
        setInsightsResult(res.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsInsightsRunning(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Agents Header */}
      <div className="p-6 rounded-2xl glass-panel border border-cyan-500/20 bg-slate-950/70 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded text-[10px] uppercase font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                Multi-Agent Intelligence Suite
              </span>
              <span className="text-xs text-slate-400">Powered by Gemini 3.8 Flash & Rule Engine</span>
            </div>
            <h2 className="text-2xl font-bold text-white mt-1.5 flex items-center gap-2">
              <span>Three Autonomous One Health AI Agents</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl">
              Specialized AI agents that automate data ingestion, HL7 FHIR R4 schema conversion, semantic validation, and cross-domain water-to-clinical epidemiological correlation.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-slate-900/80 p-1.5 rounded-xl border border-slate-800 text-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse ml-2" />
            <span className="text-slate-300 pr-2">3 Agents Operational</span>
          </div>
        </div>

        {/* Agent Navigation Tabs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-6">
          <button
            onClick={() => setActiveAgentTab('mapping')}
            className={`p-4 rounded-xl text-left border transition-all flex items-start gap-3.5 ${
              activeAgentTab === 'mapping'
                ? 'bg-cyan-500/20 border-cyan-400/60 shadow-lg text-white'
                : 'bg-slate-900/50 border-slate-800 text-slate-400 hover:border-slate-700'
            }`}
          >
            <div className="p-2.5 rounded-xl bg-slate-950/80 text-cyan-400 border border-cyan-500/30 shrink-0">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] font-mono text-cyan-400 uppercase tracking-wider">Agent #1</div>
              <div className="font-bold text-white text-sm">FHIR Mapping Agent</div>
              <div className="text-[11px] text-slate-400 mt-1">Converts unstructured CSV/JSON to FHIR R4 resources</div>
            </div>
          </button>

          <button
            onClick={() => setActiveAgentTab('validation')}
            className={`p-4 rounded-xl text-left border transition-all flex items-start gap-3.5 ${
              activeAgentTab === 'validation'
                ? 'bg-emerald-500/20 border-emerald-400/60 shadow-lg text-white'
                : 'bg-slate-900/50 border-slate-800 text-slate-400 hover:border-slate-700'
            }`}
          >
            <div className="p-2.5 rounded-xl bg-slate-950/80 text-emerald-400 border border-emerald-500/30 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] font-mono text-emerald-400 uppercase tracking-wider">Agent #2</div>
              <div className="font-bold text-white text-sm">Validation Agent</div>
              <div className="text-[11px] text-slate-400 mt-1">Audits FHIR schemas, LOINC codes & reference integrity</div>
            </div>
          </button>

          <button
            onClick={() => setActiveAgentTab('insights')}
            className={`p-4 rounded-xl text-left border transition-all flex items-start gap-3.5 ${
              activeAgentTab === 'insights'
                ? 'bg-purple-500/20 border-purple-400/60 shadow-lg text-white'
                : 'bg-slate-900/50 border-slate-800 text-slate-400 hover:border-slate-700'
            }`}
          >
            <div className="p-2.5 rounded-xl bg-slate-950/80 text-purple-400 border border-purple-500/30 shrink-0">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] font-mono text-purple-400 uppercase tracking-wider">Agent #3</div>
              <div className="font-bold text-white text-sm">Health Insight Agent</div>
              <div className="text-[11px] text-slate-400 mt-1">Correlates water tests with simulated clinical trends</div>
            </div>
          </button>
        </div>
      </div>

      {/* --------------------------------------------------------------------- */}
      {/* AGENT 1: FHIR Mapping Agent Panel */}
      {/* --------------------------------------------------------------------- */}
      {activeAgentTab === 'mapping' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input & Configuration */}
          <div className="rounded-2xl glass-panel border border-slate-800 bg-slate-950/80 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-cyan-400" />
                Raw Data Ingestion Buffer
              </h3>
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-slate-400">Target FHIR:</span>
                <select
                  value={mappingTargetType}
                  onChange={(e) => setMappingTargetType(e.target.value)}
                  className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs font-mono focus:outline-none"
                >
                  <option value="Observation">Observation (Water)</option>
                  <option value="Patient">Patient (Clinical)</option>
                  <option value="Condition">Condition (Illness)</option>
                  <option value="Bundle">Bundle (Combined)</option>
                </select>
              </div>
            </div>

            {/* Quick Sample Load Buttons */}
            <div className="flex flex-wrap gap-2 text-xs">
              <span className="text-[11px] text-slate-500 py-1">Quick Sample:</span>
              <button
                onClick={() => {
                  setMappingTargetType('Observation');
                  setMappingInput(
`sensor_id,water_source,sample_timestamp,ph_level,turbidity_ntu,coliform_cfu,chlorine_residual,lat,lon
WQ-DEL-908,"Well-5 Sector 8 Aquifer",2026-09-24T08:30:00Z,6.4,18.5,4800,0.05,28.7041,77.1025`
                  );
                }}
                className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
              >
                Water SCADA CSV
              </button>
              <button
                onClick={() => {
                  setMappingTargetType('Patient');
                  setMappingInput(
JSON.stringify({
  hospital_id: "APOLLO-ROHINI",
  triage_code: "EMER-49",
  patient_gender: "female",
  age: 28,
  water_exposure_location: "Sector 8 Rohini Domestic Supply",
  symptoms: ["Severe watery diarrhea", "Nausea", "Fever"],
  admission_time: "2026-09-24T09:15:00Z"
}, null, 2)
                  );
                }}
                className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
              >
                Hospital EHR JSON
              </button>
            </div>

            <textarea
              value={mappingInput}
              onChange={(e) => setMappingInput(e.target.value)}
              rows={11}
              className="w-full p-3.5 rounded-xl bg-[#070d19] border border-slate-800 focus:border-cyan-400 font-mono text-xs text-cyan-200 focus:outline-none transition-all"
            />

            <div className="flex items-center justify-between pt-2">
              <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
                <HelpCircle className="w-3.5 h-3.5 text-cyan-400" />
                <span>Deterministic mapping + Gemini LLM entity extraction</span>
              </div>
              <button
                onClick={handleRunMapping}
                disabled={isMappingRunning}
                className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-2 transition-all shadow-[0_0_20px_rgba(0,240,255,0.4)] disabled:opacity-50"
              >
                <Play className={`w-3.5 h-3.5 ${isMappingRunning ? 'animate-spin' : ''}`} />
                <span>{isMappingRunning ? 'Mapping Fields...' : 'Execute FHIR Mapping Agent'}</span>
              </button>
            </div>
          </div>

          {/* Mapping Output & Confidence */}
          <div className="rounded-2xl glass-panel border border-cyan-500/20 bg-slate-950/85 p-6 flex flex-col justify-between shadow-2xl">
            {mappingResult ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-mono">Agent Output:</span>
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      <span>Standardized HL7 FHIR R4 {mappingResult.resourceType}</span>
                    </h3>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 block">Mapping Confidence</span>
                    <span className="font-mono text-base font-extrabold text-cyan-400">
                      {mappingResult.confidenceScore}%
                    </span>
                  </div>
                </div>

                {/* Mapped Fields Breakdown */}
                {mappingResult.mappedFields && mappingResult.mappedFields.length > 0 && (
                  <div className="space-y-1.5">
                    <span className="text-[11px] font-semibold text-slate-300 block">Field Mappings Identified:</span>
                    <div className="grid grid-cols-1 gap-1 max-h-32 overflow-y-auto">
                      {mappingResult.mappedFields.map((f: any, i: number) => (
                        <div key={i} className="px-2.5 py-1.5 rounded-lg bg-slate-900/60 border border-slate-800 text-[11px] flex items-center justify-between">
                          <span className="text-slate-400 font-mono">{f.sourceField}</span>
                          <span className="text-cyan-400 mx-2">→</span>
                          <span className="text-emerald-300 font-mono font-medium truncate max-w-[200px]">{f.fhirField}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Generated FHIR JSON */}
                <div>
                  <span className="text-[11px] font-semibold text-slate-300 block mb-1">Generated FHIR Payload:</span>
                  <div className="bg-[#070d19] rounded-xl border border-slate-800 p-3.5 font-mono text-[11px] text-cyan-300 max-h-56 overflow-y-auto">
                    <pre>{JSON.stringify(mappingResult.fhirResource, null, 2)}</pre>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-cyan-950/20 border border-cyan-500/20 text-xs text-slate-300">
                  <span className="text-cyan-300 font-semibold block mb-0.5">Agent Reasoning:</span>
                  {mappingResult.reasoning}
                </div>
              </div>
            ) : (
              <div className="h-full min-h-[350px] flex flex-col items-center justify-center text-center p-6 text-slate-400">
                <Cpu className="w-12 h-12 text-cyan-400/40 mb-3 animate-pulse" />
                <p className="text-sm font-semibold text-white">Agent #1 Ready</p>
                <p className="text-xs text-slate-400 mt-1 max-w-sm">
                  Click "Execute FHIR Mapping Agent" to parse the raw unstructured telemetry into an HL7 FHIR R4 compliant specification.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* --------------------------------------------------------------------- */}
      {/* AGENT 2: Validation Agent Panel */}
      {/* --------------------------------------------------------------------- */}
      {activeAgentTab === 'validation' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="rounded-2xl glass-panel border border-slate-800 bg-slate-950/80 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <FileCode2 className="w-4 h-4 text-emerald-400" />
                FHIR Resource Schema Validator
              </h3>
              <span className="text-[11px] text-slate-400 font-mono">HL7 R4 Engine</span>
            </div>

            <p className="text-xs text-slate-400">
              Paste any FHIR R4 JSON object to verify required fields, data types, LOINC/SNOMED terminology codings, and reference integrity.
            </p>

            <textarea
              value={validationInput}
              onChange={(e) => setValidationInput(e.target.value)}
              rows={14}
              className="w-full p-3.5 rounded-xl bg-[#070d19] border border-slate-800 focus:border-emerald-400 font-mono text-xs text-emerald-200 focus:outline-none transition-all"
            />

            <div className="flex justify-end">
              <button
                onClick={handleRunValidation}
                disabled={isValidationRunning}
                className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-2 transition-all shadow-[0_0_20px_rgba(16,185,129,0.4)] disabled:opacity-50"
              >
                <ShieldCheck className={`w-4 h-4 ${isValidationRunning ? 'animate-spin' : ''}`} />
                <span>{isValidationRunning ? 'Auditing Schema...' : 'Run Validation Agent'}</span>
              </button>
            </div>
          </div>

          <div className="rounded-2xl glass-panel border border-emerald-500/20 bg-slate-950/85 p-6 flex flex-col justify-between shadow-2xl">
            {validationResult ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-mono">Validation Audit:</span>
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      <span className={`px-2.5 py-0.5 rounded text-xs uppercase font-extrabold border ${
                        validationResult.validationStatus === 'valid' ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                      }`}>
                        STATUS: {validationResult.validationStatus}
                      </span>
                    </h3>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 block">Conformance Score</span>
                    <span className="font-mono text-xl font-extrabold text-emerald-400">
                      {validationResult.conformanceScore}%
                    </span>
                  </div>
                </div>

                {/* Validation Checks List */}
                <div className="space-y-2">
                  <span className="text-xs font-semibold text-slate-300 block">Pillars of Interoperability Audited:</span>
                  <div className="space-y-1.5">
                    {validationResult.checks?.map((chk: any, idx: number) => (
                      <div key={idx} className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-start gap-2.5 text-xs">
                        <CheckCircle2 className={`w-4 h-4 shrink-0 mt-0.5 ${chk.passed ? 'text-emerald-400' : 'text-amber-400'}`} />
                        <div>
                          <strong className="text-white block">{chk.checkName}</strong>
                          <span className="text-slate-400 text-[11px] leading-snug">{chk.message}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recommendations */}
                <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-800 text-xs">
                  <span className="text-slate-300 font-semibold block mb-1">Interoperability Readiness:</span>
                  <ul className="list-disc list-inside text-slate-400 text-[11px] space-y-1">
                    {validationResult.recommendations?.map((r: string, i: number) => (
                      <li key={i}>{r}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              <div className="h-full min-h-[350px] flex flex-col items-center justify-center text-center p-6 text-slate-400">
                <ShieldCheck className="w-12 h-12 text-emerald-400/40 mb-3" />
                <p className="text-sm font-semibold text-white">Validation Agent #2 Ready</p>
                <p className="text-xs text-slate-400 mt-1 max-w-sm">
                  Run the audit to check structural consistency, data type boundaries, and terminology dictionaries.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* --------------------------------------------------------------------- */}
      {/* AGENT 3: Health Insight & Integration Agent Panel */}
      {/* --------------------------------------------------------------------- */}
      {activeAgentTab === 'insights' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Controls Column */}
          <div className="rounded-2xl glass-panel border border-slate-800 bg-slate-950/80 p-6 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Activity className="w-4 h-4 text-purple-400" />
              One Health Cross-Domain Synthesis
            </h3>

            <p className="text-xs text-slate-400">
              Select a monitored node. Agent #3 fuses water lab tests, municipal pipe telemetry, and synthetic patient admissions to compute risk trajectories.
            </p>

            <div>
              <label className="text-[11px] text-slate-400 uppercase font-semibold block mb-1.5">
                Select Monitored Region Node:
              </label>
              <select
                value={insightRegionId}
                onChange={(e) => setInsightRegionId(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-semibold focus:outline-none"
              >
                {regions.map(r => (
                  <option key={r.id} value={r.id}>
                    {r.name} ({r.severity.toUpperCase()} - {r.syntheticCases} cases)
                  </option>
                ))}
              </select>
            </div>

            <div className="p-3 rounded-xl bg-purple-950/20 border border-purple-500/20 text-xs text-slate-300">
              <span className="text-purple-300 font-semibold block mb-1">One Health Truthfulness Standard:</span>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                All correlation indices, risk levels, and projections are computed on simulated demonstration data for technological validation purposes.
              </p>
            </div>

            <button
              onClick={handleRunInsights}
              disabled={isInsightsRunning}
              className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(168,85,247,0.4)] disabled:opacity-50"
            >
              <Sparkles className={`w-4 h-4 ${isInsightsRunning ? 'animate-spin' : ''}`} />
              <span>{isInsightsRunning ? 'Analyzing Data Streams...' : 'Synthesize One Health Insights'}</span>
            </button>
          </div>

          {/* Results 2 Columns */}
          <div className="lg:col-span-2 rounded-2xl glass-panel border border-purple-500/20 bg-slate-950/85 p-6 shadow-2xl">
            {insightsResult ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-mono">Agent #3 Synthesis Report:</span>
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                      <span>Simulated Epidemiological & Water Correlation</span>
                    </h3>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 block">Correlation Score</span>
                    <span className="font-mono text-2xl font-black text-purple-400">
                      {insightsResult.correlationIndex}%
                    </span>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-purple-950/30 border border-purple-500/30 text-xs text-purple-200 leading-relaxed">
                  <strong className="block text-white mb-1">Executive Summary:</strong>
                  {insightsResult.summary}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Key Findings */}
                  <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
                    <span className="text-xs font-semibold text-white flex items-center gap-1.5">
                      <Droplets className="w-3.5 h-3.5 text-cyan-400" /> Key Epidemiological Findings
                    </span>
                    <ul className="space-y-1.5 text-[11px] text-slate-300">
                      {insightsResult.keyFindings?.map((f: string, i: number) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <span className="text-cyan-400 font-bold">•</span>
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Environmental Interventions */}
                  <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
                    <span className="text-xs font-semibold text-white flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Environmental Interventions
                    </span>
                    <ul className="space-y-1.5 text-[11px] text-slate-300">
                      {insightsResult.environmentalInterventions?.map((item: string, i: number) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <span className="text-emerald-400 font-bold">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Interoperability Action */}
                <div className="p-3 rounded-xl bg-cyan-950/20 border border-cyan-500/20 text-xs flex items-start gap-2.5">
                  <Share2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-cyan-300 block">Recommended Data Integration Action:</strong>
                    <span className="text-slate-300 text-[11px]">{insightsResult.interoperabilityAction}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-full min-h-[350px] flex flex-col items-center justify-center text-center p-6 text-slate-400">
                <Activity className="w-12 h-12 text-purple-400/40 mb-3" />
                <p className="text-sm font-semibold text-white">Agent #3 Waiting for Trigger</p>
                <p className="text-xs text-slate-400 mt-1 max-w-sm">
                  Select a region and trigger the synthesis to generate cross-domain correlation indexes and water intervention guidance.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
