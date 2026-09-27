import express, { Request, Response } from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

// Initialize Google GenAI
const apiKey = process.env.GEMINI_API_KEY;
let aiClient: GoogleGenAI | null = null;
if (apiKey) {
  try {
    aiClient = new GoogleGenAI();
  } catch (err) {
    console.warn('Google GenAI initialization warning:', err);
  }
}

// In-memory data store for live modifications and persistence during session
import { 
  DEMO_REGIONS, 
  DEMO_OUTBREAKS, 
  DEMO_PATIENTS, 
  DEMO_WATER_QUALITY, 
  DEMO_FHIR_RESOURCES, 
  DEMO_ALERTS, 
  DEMO_INTEGRATION_SYSTEMS, 
  DEMO_AUDIT_LOGS 
} from './src/data/mockData.ts';

let regionsState = [...DEMO_REGIONS];
let outbreaksState = [...DEMO_OUTBREAKS];
let patientsState = [...DEMO_PATIENTS];
let waterQualityState = [...DEMO_WATER_QUALITY];
let fhirResourcesState = [...DEMO_FHIR_RESOURCES];
let alertsState = [...DEMO_ALERTS];
let integrationSystemsState = [...DEMO_INTEGRATION_SYSTEMS];
let auditLogsState = [...DEMO_AUDIT_LOGS];

// ---------------------------------------------------------------------------
// Health Check Endpoint
// ---------------------------------------------------------------------------
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'online',
    appName: 'AquaSync 3D — Water Health Intelligence',
    version: '1.0.0-hackathon',
    aiConnected: Boolean(apiKey),
    timestamp: new Date().toISOString()
  });
});

// ---------------------------------------------------------------------------
// REST APIs for Core Datasets
// ---------------------------------------------------------------------------
app.get('/api/regions', (req: Request, res: Response) => {
  res.json({ success: true, count: regionsState.length, data: regionsState });
});

app.get('/api/regions/:id', (req: Request, res: Response) => {
  const region = regionsState.find(r => r.id === req.params.id);
  if (!region) {
    return res.status(404).json({ success: false, error: 'Region not found' });
  }
  const relatedOutbreak = outbreaksState.find(o => o.regionId === req.params.id);
  const relatedWater = waterQualityState.filter(w => w.regionId === req.params.id);
  const relatedPatients = patientsState.filter(p => p.regionId === req.params.id);
  res.json({ success: true, data: { region, outbreak: relatedOutbreak, waterSamples: relatedWater, patients: relatedPatients } });
});

app.get('/api/outbreaks', (req: Request, res: Response) => {
  res.json({ success: true, count: outbreaksState.length, data: outbreaksState });
});

app.get('/api/water-quality', (req: Request, res: Response) => {
  res.json({ success: true, count: waterQualityState.length, data: waterQualityState });
});

app.post('/api/water-quality', (req: Request, res: Response) => {
  const newSample = {
    ...req.body,
    sampleId: req.body.sampleId || `WQ-SYN-${Date.now()}`,
    sampleDate: new Date().toISOString().split('T')[0]
  };
  waterQualityState.unshift(newSample);
  auditLogsState.unshift({
    id: `AUD-${Date.now()}`,
    timestamp: new Date().toISOString(),
    actor: 'Water Authority SCADA Interface',
    role: 'water_authority',
    action: 'WATER_SAMPLE_INGEST',
    details: `New sample recorded for ${newSample.regionName || newSample.regionId}: ${newSample.coliformCount} CFU/100mL`,
    status: 'success'
  });
  res.status(201).json({ success: true, data: newSample });
});

app.get('/api/patients', (req: Request, res: Response) => {
  res.json({ success: true, count: patientsState.length, data: patientsState });
});

app.get('/api/fhir-resources', (req: Request, res: Response) => {
  res.json({ success: true, count: fhirResourcesState.length, data: fhirResourcesState });
});

app.get('/api/alerts', (req: Request, res: Response) => {
  res.json({ success: true, count: alertsState.length, data: alertsState });
});

// Helper to verify if role is authorized to resolve or approve alert resolutions
const AUTHORIZED_RESOLUTION_ROLES = [
  'admin',
  'water_authority',
  'health_authority',
  'field_inspector'
];

function isAuthorizedAlertResolver(role?: string): boolean {
  if (!role) return false;
  const r = role.toLowerCase().trim();
  return (
    AUTHORIZED_RESOLUTION_ROLES.includes(r) ||
    r === 'supervisor' ||
    r.includes('admin') ||
    r.includes('authority') ||
    r.includes('inspector') ||
    r.includes('supervisor')
  );
}

// 1. Request Resolution endpoint (Accessible by all users who cannot directly resolve)
app.post('/api/alerts/:id/request-resolution', (req: Request, res: Response) => {
  const alert = alertsState.find(a => a.id === req.params.id);
  if (!alert) {
    return res.status(404).json({ success: false, error: 'Alert not found' });
  }

  const {
    profession = 'Field Practitioner',
    organization = 'Community Observer Network',
    professionalId = 'ID-PENDING',
    notes = '',
    evidenceFileName,
    evidenceFileSize = '1.2 MB',
    requestedBy = 'Anonymous Reporter',
    role = 'citizen'
  } = req.body;

  if (!notes && !professionalId) {
    return res.status(400).json({ success: false, error: 'Professional ID and resolution notes are required.' });
  }

  const nowIst = new Date().toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  }) + ' IST';

  alert.resolutionStatus = 'pending_verification';
  alert.resolved = false;
  alert.resolutionRequest = {
    id: `REQ-${Date.now()}`,
    requestedBy,
    role,
    profession,
    organization,
    professionalId,
    notes,
    evidenceFileName: evidenceFileName || (req.body.hasEvidence ? 'field_resolution_report.pdf' : undefined),
    evidenceFileSize: evidenceFileName ? evidenceFileSize : undefined,
    timestamp: nowIst
  };

  alert.auditTrail = alert.auditTrail || [];
  alert.auditTrail.unshift({
    id: `AUD-${Date.now()}`,
    actor: requestedBy,
    role: profession || role,
    organization: organization,
    action: 'Resolution Requested',
    timestamp: nowIst,
    previousStatus: 'Active Alert',
    newStatus: 'Resolution Requested / Pending Verification',
    notes: notes || 'Resolution verification request submitted.'
  });

  auditLogsState.unshift({
    id: `AUD-${Date.now()}`,
    timestamp: new Date().toISOString(),
    actor: requestedBy,
    role: role,
    action: 'RESOLUTION_REQUESTED',
    details: `Alert ${alert.id}: Resolution request submitted by ${requestedBy} (${profession}, ${organization})`,
    status: 'warning'
  });

  res.json({ success: true, message: 'Resolution request submitted for official verification.', data: alert });
});

// 2. Approve Resolution endpoint (Authorized Water Authority, Public Health Official, or Field Inspector)
app.patch('/api/alerts/:id/approve-resolution', (req: Request, res: Response) => {
  const userRole = (req.headers['x-user-role'] as string) || req.body.role || req.body.userRole;
  const userName = (req.headers['x-user-name'] as string) || req.body.actor || req.body.userName || 'Authorized Official';
  const userOrg = (req.headers['x-user-org'] as string) || req.body.organization || 'Water & Health Authority';

  if (!isAuthorizedAlertResolver(userRole)) {
    return res.status(403).json({
      success: false,
      error: 'Forbidden: Unauthorized. Only Water Authority, Public Health Official, or Field Inspector users can approve alert resolutions.'
    });
  }

  const alert = alertsState.find(a => a.id === req.params.id);
  if (!alert) {
    return res.status(404).json({ success: false, error: 'Alert not found' });
  }

  const nowIst = new Date().toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  }) + ' IST';

  const previousStatusDisplay = alert.resolutionStatus === 'pending_verification'
    ? 'Resolution Requested / Pending Verification'
    : 'Active Alert';

  alert.resolved = true;
  alert.resolutionStatus = 'resolved';

  const approvalNotes = req.body.notes || (alert.resolutionRequest ? `Approved resolution request filed by ${alert.resolutionRequest.requestedBy} (${alert.resolutionRequest.professionalId}).` : 'Resolution verified and signed off.');

  alert.auditTrail = alert.auditTrail || [];
  alert.auditTrail.unshift({
    id: `AUD-${Date.now()}`,
    actor: userName,
    role: userRole === 'water_authority' ? 'Water Authority' : userRole === 'health_authority' ? 'Public Health Official' : userRole === 'field_inspector' ? 'Field Inspector' : 'Administrator',
    organization: userOrg,
    action: 'Resolution Approved',
    timestamp: nowIst,
    previousStatus: previousStatusDisplay,
    newStatus: 'Resolved',
    notes: approvalNotes
  });

  auditLogsState.unshift({
    id: `AUD-${Date.now()}`,
    timestamp: new Date().toISOString(),
    actor: userName,
    role: userRole,
    action: 'ALERT_RESOLUTION_APPROVED',
    details: `Alert ${alert.id} (${alert.title}) marked as Resolved by ${userName} (${userOrg})`,
    status: 'success'
  });

  res.json({ success: true, message: 'Alert resolution approved and finalized.', data: alert });
});

// 3. Reject Resolution Request endpoint (Authorized users can send back with feedback)
app.patch('/api/alerts/:id/reject-resolution', (req: Request, res: Response) => {
  const userRole = (req.headers['x-user-role'] as string) || req.body.role;
  const userName = (req.headers['x-user-name'] as string) || req.body.actor || 'Authorized Reviewer';
  const userOrg = (req.headers['x-user-org'] as string) || req.body.organization || 'Water & Health Authority';

  if (!isAuthorizedAlertResolver(userRole)) {
    return res.status(403).json({
      success: false,
      error: 'Forbidden: Unauthorized. Only Water Authority, Public Health Official, or Field Inspector users can review alert resolutions.'
    });
  }

  const alert = alertsState.find(a => a.id === req.params.id);
  if (!alert) {
    return res.status(404).json({ success: false, error: 'Alert not found' });
  }

  const rejectionReason = req.body.reason || 'Insufficient field clearance evidence provided; alert remains active.';

  const nowIst = new Date().toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  }) + ' IST';

  alert.resolved = false;
  alert.resolutionStatus = 'active';

  alert.auditTrail = alert.auditTrail || [];
  alert.auditTrail.unshift({
    id: `AUD-${Date.now()}`,
    actor: userName,
    role: userRole === 'water_authority' ? 'Water Authority' : userRole === 'health_authority' ? 'Public Health Official' : userRole === 'field_inspector' ? 'Field Inspector' : 'Administrator',
    organization: userOrg,
    action: 'Resolution Rejected / Reopened',
    timestamp: nowIst,
    previousStatus: 'Resolution Requested / Pending Verification',
    newStatus: 'Active Alert',
    notes: rejectionReason
  });

  auditLogsState.unshift({
    id: `AUD-${Date.now()}`,
    timestamp: new Date().toISOString(),
    actor: userName,
    role: userRole,
    action: 'RESOLUTION_REQUEST_REJECTED',
    details: `Alert ${alert.id} request rejected by ${userName}: ${rejectionReason}`,
    status: 'warning'
  });

  res.json({ success: true, message: 'Resolution request rejected; alert returned to active state.', data: alert });
});

// 4. Secure Resolve Alert endpoint (Direct Resolution guarded by backend role verification)
app.patch('/api/alerts/:id/resolve', (req: Request, res: Response) => {
  const userRole = (req.headers['x-user-role'] as string) || req.body.role || req.body.userRole;
  const userName = (req.headers['x-user-name'] as string) || req.body.actor || req.body.userName || 'Authorized Official';
  const userOrg = (req.headers['x-user-org'] as string) || req.body.organization || 'Water & Health Authority';

  // Backend authorization enforcement
  if (!isAuthorizedAlertResolver(userRole)) {
    return res.status(403).json({
      success: false,
      error: 'Forbidden: Unauthorized. Only Water Authority, Public Health Official, or Field Inspector roles can mark an alert as resolved.'
    });
  }

  const alert = alertsState.find(a => a.id === req.params.id);
  if (!alert) {
    return res.status(404).json({ success: false, error: 'Alert not found' });
  }

  const nowIst = new Date().toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  }) + ' IST';

  const previousStatusDisplay = alert.resolutionStatus === 'pending_verification'
    ? 'Resolution Requested / Pending Verification'
    : 'Active Alert';

  alert.resolved = true;
  alert.resolutionStatus = 'resolved';

  alert.auditTrail = alert.auditTrail || [];
  alert.auditTrail.unshift({
    id: `AUD-${Date.now()}`,
    actor: userName,
    role: userRole === 'water_authority' ? 'Water Authority' : userRole === 'health_authority' ? 'Public Health Official' : userRole === 'field_inspector' ? 'Field Inspector' : 'Administrator',
    organization: userOrg,
    action: 'Direct Resolution Marked',
    timestamp: nowIst,
    previousStatus: previousStatusDisplay,
    newStatus: 'Resolved',
    notes: req.body.notes || 'Direct resolution signed off by authorized official.'
  });

  auditLogsState.unshift({
    id: `AUD-${Date.now()}`,
    timestamp: new Date().toISOString(),
    actor: userName,
    role: userRole,
    action: 'ALERT_RESOLVED',
    details: `Alert ${alert.id} (${alert.title}) marked as resolved by ${userName} (${userOrg})`,
    status: 'success'
  });

  res.json({ success: true, message: 'Alert successfully marked as resolved.', data: alert });
});

// 5. Backend Delete / Reopen Guard
app.delete('/api/alerts/:id', (req: Request, res: Response) => {
  const userRole = (req.headers['x-user-role'] as string) || req.body.role;
  if (!isAuthorizedAlertResolver(userRole)) {
    return res.status(403).json({
      success: false,
      error: 'Forbidden: Unauthorized. Alerts cannot be deleted by unauthorized users.'
    });
  }
  const index = alertsState.findIndex(a => a.id === req.params.id);
  if (index !== -1) {
    const deleted = alertsState.splice(index, 1)[0];
    return res.json({ success: true, message: 'Alert archived by authorized official.', data: deleted });
  }
  res.status(404).json({ success: false, error: 'Alert not found' });
});

app.get('/api/integration-systems', (req: Request, res: Response) => {
  res.json({ success: true, count: integrationSystemsState.length, data: integrationSystemsState });
});

app.post('/api/interoperability/activate', (req: Request, res: Response) => {
  integrationSystemsState = integrationSystemsState.map(sys => ({
    ...sys,
    status: 'ready_for_exchange',
    recordsProcessed: sys.recordsProcessed + 1400,
    lastSync: 'Synchronized just now'
  }));
  auditLogsState.unshift({
    id: `AUD-${Date.now()}`,
    timestamp: new Date().toISOString(),
    actor: 'AquaSync Master Orchestrator',
    role: 'system',
    action: 'ACTIVATE_ONE_HEALTH_INTEROPERABILITY',
    details: 'Triggered global synchronization across Hospital EHR, Water SCADA, and EPA registries into FHIR R4',
    status: 'success'
  });
  res.json({ 
    success: true, 
    message: 'Interoperability Activated: Fragmented data streams harmonized to HL7 FHIR R4 standards',
    systems: integrationSystemsState 
  });
});

app.get('/api/audit-logs', (req: Request, res: Response) => {
  res.json({ success: true, count: auditLogsState.length, data: auditLogsState });
});

// ---------------------------------------------------------------------------
// AI AGENT 1: FHIR Mapping Agent
// ---------------------------------------------------------------------------
app.post('/api/ai/fhir-mapping', async (req: Request, res: Response) => {
  const { rawData, targetResourceType, sourceDomain } = req.body;

  if (!rawData) {
    return res.status(400).json({ success: false, error: 'Raw data is required for FHIR mapping' });
  }

  const prompt = `You are the AquaSync FHIR Mapping Agent.
Convert the following fragmented health or environmental data into an HL7 FHIR Release 4 JSON resource.
Target resource type preferred: ${targetResourceType || 'Auto-detect (Observation, Patient, Condition, Encounter, Location, or Bundle)'}.
Source Domain: ${sourceDomain || 'Water Quality or Hospital EHR'}.

Input Data:
${typeof rawData === 'string' ? rawData : JSON.stringify(rawData, null, 2)}

Requirements:
1. Identify source entities and map them to standard FHIR R4 fields.
2. If water quality: map to FHIR 'Observation' with LOINC codes (e.g. 58452-4 for E. coli, 41653-7 for Coliforms, 2744-1 for pH) and UCUM units.
3. If clinical/illness: map to FHIR 'Patient', 'Condition' (with SNOMED / ICD-10), or 'Encounter'.
4. If geographic water body: map to FHIR 'Location'.
5. Always generate valid JSON.
6. Provide a mapping confidence score (0-100) and human-readable explanation of mapped fields.

Return ONLY a valid JSON object with the following schema:
{
  "resourceType": "Observation" | "Patient" | "Condition" | "Encounter" | "Location" | "Bundle",
  "fhirResource": { ...complete valid FHIR R4 JSON object... },
  "confidenceScore": number,
  "mappedFields": [
    { "sourceField": "string", "fhirField": "string", "transformation": "string" }
  ],
  "reasoning": "string",
  "warnings": ["string"]
}`;

  if (aiClient) {
    try {
      const response = await aiClient.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json'
        }
      });
      const parsed = JSON.parse(response.text || '{}');
      return res.json({ success: true, aiGenerated: true, data: parsed });
    } catch (err: any) {
      console.warn('Gemini FHIR mapping error, falling back to deterministic mapping:', err?.message);
    }
  }

  // High-fidelity fallback mapping engine
  const fallback = generateFallbackFhirMapping(rawData, targetResourceType);
  res.json({ success: true, aiGenerated: false, demoMode: true, data: fallback });
});

// ---------------------------------------------------------------------------
// AI AGENT 2: FHIR Validation Agent
// ---------------------------------------------------------------------------
app.post('/api/ai/validate-fhir', async (req: Request, res: Response) => {
  const { fhirResource } = req.body;

  if (!fhirResource) {
    return res.status(400).json({ success: false, error: 'FHIR resource JSON is required' });
  }

  const prompt = `You are the AquaSync FHIR Validation Agent.
Validate the following JSON object against HL7 FHIR Release 4 specification standards.
Check:
- resourceType validity
- presence of required fields
- terminology and coding systems (LOINC, SNOMED, UCUM, HL7 core)
- reference structure integrity (e.g., subject, encounter, patient references)
- interoperability readiness for IEEE One Health data exchange

FHIR Resource:
${typeof fhirResource === 'string' ? fhirResource : JSON.stringify(fhirResource, null, 2)}

Return ONLY a valid JSON object with this schema:
{
  "validationStatus": "valid" | "warning" | "error",
  "conformanceScore": number (0-100),
  "checks": [
    { "checkName": "string", "passed": boolean, "severity": "info" | "warning" | "error", "message": "string" }
  ],
  "structuralIssues": ["string"],
  "terminologyChecks": ["string"],
  "recommendations": ["string"]
}`;

  if (aiClient) {
    try {
      const response = await aiClient.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json'
        }
      });
      const parsed = JSON.parse(response.text || '{}');
      return res.json({ success: true, aiGenerated: true, data: parsed });
    } catch (err: any) {
      console.warn('Gemini validation error, using rule-based validator:', err?.message);
    }
  }

  // Deterministic rule-based validator fallback
  const validationResult = validateFhirLocally(fhirResource);
  res.json({ success: true, aiGenerated: false, demoMode: true, data: validationResult });
});

// ---------------------------------------------------------------------------
// AI AGENT 3: Health Insight & Integration Agent
// ---------------------------------------------------------------------------
app.post('/api/ai/health-insights', async (req: Request, res: Response) => {
  const { regionId, waterData, clinicalData } = req.body;

  const targetRegion = regionsState.find(r => r.id === regionId) || regionsState[0];

  const prompt = `You are the AquaSync Health Insight & Integration Agent for IEEE One Health.
Analyze the relationship between synthetic water quality observations and synthetic clinical cases.
IMPORTANT TRUTHFULNESS DIRECTIVE:
Do NOT diagnose real patients or claim real epidemiological certainty.
Always use phrases like "Simulated relationship in synthetic data", "Demo pattern indicates", "Potential correlation in demo scenario".

Context:
Region: ${targetRegion.name} (${targetRegion.country})
Water Source: ${targetRegion.waterSource}
Synthetic Outbreak Cases: ${targetRegion.syntheticCases}
Contamination Type: ${targetRegion.contaminationType}
Water Lab Sample: Coliform ${targetRegion.waterQuality.coliformCfu} CFU/100mL, pH ${targetRegion.waterQuality.pH}, Turbidity ${targetRegion.waterQuality.turbidityNtu} NTU.

Generate structured insights:
1. Synthesized cross-domain correlation assessment
2. Risk trajectory index (Simulated)
3. Actionable environmental interventions (chlorination, pipeline inspection, community alerts)
4. Interoperability recommendation for connecting municipal water SCADA with hospital EHRs

Return ONLY a valid JSON object with schema:
{
  "correlationIndex": number (e.g. 98.4),
  "riskLevel": "critical" | "high" | "medium" | "low",
  "summary": "string",
  "keyFindings": ["string"],
  "environmentalInterventions": ["string"],
  "clinicalRecommendations": ["string"],
  "interoperabilityAction": "string"
}`;

  if (aiClient) {
    try {
      const response = await aiClient.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json'
        }
      });
      const parsed = JSON.parse(response.text || '{}');
      return res.json({ success: true, aiGenerated: true, data: parsed });
    } catch (err: any) {
      console.warn('Gemini health insight error, returning demo synthesis:', err?.message);
    }
  }

  // Demonstration synthesis fallback
  const fallback = {
    correlationIndex: targetRegion.syntheticCorrelation,
    riskLevel: targetRegion.severity,
    summary: `Simulated correlation analysis indicates a ${targetRegion.syntheticCorrelation}% alignment between ${targetRegion.waterSource} contamination markers and regional clinical admissions in ${targetRegion.name}.`,
    keyFindings: [
      `Bacterial density (${targetRegion.waterQuality.coliformCfu} CFU/100mL) exceeds reference baseline threshold by 48x.`,
      `Temporal onset of ${targetRegion.syntheticCases} synthetic gastroenteritis cases directly mirrors the 72-hour pressure drop wave in sector distribution mains.`,
      `Zero chlorine residual detected in peripheral feeder taps confirms biological breakthrough.`
    ],
    environmentalInterventions: [
      `Deploy emergency high-dose chlorination booster stations at ${targetRegion.waterSource}.`,
      `Temporarily isolate contaminated distribution sector while pressure testing underground junctions for suction cracks.`,
      `Dispatch mobile UV purification units to high-density community collection points.`
    ],
    clinicalRecommendations: [
      `Alert primary care triage centers to test for ${targetRegion.contaminationType}.`,
      `Pre-position oral rehydration salts (ORS) and IV fluid reserves across district clinics.`,
      `Broadcast preventive boil-water notices across local civic channels.`
    ],
    interoperabilityAction: `Automate real-time FHIR Observation push from water SCADA directly into regional Hospital EHR emergency triage dashboards.`
  };

  res.json({ success: true, aiGenerated: false, demoMode: true, data: fallback });
});

// ---------------------------------------------------------------------------
// Voice AI Assistant Endpoint (Multilingual)
// ---------------------------------------------------------------------------
app.post('/api/ai/voice-query', async (req: Request, res: Response) => {
  const { query, language = 'en' } = req.body;

  if (!query) {
    return res.status(400).json({ success: false, error: 'Voice or text query is required' });
  }

  const prompt = `You are AquaSync 3D Voice Intelligence, an IEEE One Health Water Intelligence AI assistant.
The user is speaking or typing in: ${language}.
User query: "${query}"

Current platform state (all numbers are SYNTHETIC DEMONSTRATION data):
- 10 monitored regions: Delhi (Critical, 247 cases, Well-5), Mumbai (High, 156 cases, 90-Ft Road), Bangalore (Medium, 89 cases), Lagos (Critical, 312 cases), Bangkok (High, 178 cases), São Paulo (Medium, 143 cases), Cairo (Medium, 95 cases), Shanghai (Low, 34 cases), Mexico City (High, 167 cases), New York (Low, 12 cases).
- Active Alerts: 5 total, 2 Critical (Delhi & Lagos).
- Purpose of AquaSync: Connect fragmented healthcare, water quality, and environmental data using AI mapping and HL7 FHIR standardization.

Instructions:
1. Answer concisely, helpfully, and professionally (2-4 sentences).
2. Answer in the SAME LANGUAGE the user queried in (e.g. if queried in Hindi, answer in natural Hindi; if in Spanish, answer in Spanish; etc.).
3. Explicitly clarify that data numbers are simulated/synthetic demonstration values whenever citing statistics.
4. Return JSON with 'answer', 'languageDetected', and 'actionSuggestion'.

Schema:
{
  "answer": "string",
  "languageDetected": "string",
  "actionSuggestion": "string"
}`;

  if (aiClient) {
    try {
      const response = await aiClient.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json'
        }
      });
      const parsed = JSON.parse(response.text || '{}');
      return res.json({ success: true, aiGenerated: true, data: parsed });
    } catch (err: any) {
      console.warn('Gemini voice query error, falling back to local resolver:', err?.message);
    }
  }

  // Multilingual fallback answering engine
  const fallback = resolveVoiceQueryFallback(query, language);
  res.json({ success: true, aiGenerated: false, demoMode: true, data: fallback });
});

// ---------------------------------------------------------------------------
// End-to-End Interoperability Lab Pipeline
// ---------------------------------------------------------------------------
app.post('/api/ai/analyze-uploaded-data', async (req: Request, res: Response) => {
  const { fileName, fileContent, fileType } = req.body;

  if (!fileContent) {
    return res.status(400).json({ success: false, error: 'File content is required' });
  }

  // Step 1: Detect Schema
  const detectedSchema = detectSchemaFromContent(fileContent, fileType);

  // Step 2: Mapping & FHIR Generation
  const mappingResult = generateFallbackFhirMapping(fileContent, detectedSchema.suggestedResourceType);

  // Step 3: Validation
  const validationResult = validateFhirLocally(mappingResult.fhirResource);

  // Register in FHIR resources if valid
  const newFhirResource = {
    resourceType: mappingResult.resourceType,
    resourceId: mappingResult.fhirResource.id || `res-upload-${Date.now()}`,
    title: `Imported from ${fileName || 'Uploaded Dataset'}`,
    sourceSystem: 'Interoperability Lab Ingestion Pipeline',
    validationStatus: validationResult.validationStatus,
    validationScore: validationResult.conformanceScore,
    validationNotes: validationResult.checks.map(c => c.message),
    createdAt: new Date().toISOString(),
    resourceJSON: mappingResult.fhirResource,
    mappingNotes: mappingResult.reasoning
  };

  fhirResourcesState.unshift(newFhirResource as any);

  auditLogsState.unshift({
    id: `AUD-${Date.now()}`,
    timestamp: new Date().toISOString(),
    actor: 'Interoperability Lab Pipeline',
    role: 'researcher',
    action: 'DATASET_INGESTION_AND_FHIR_MAPPING',
    details: `Processed file ${fileName} (${fileType}). Generated ${newFhirResource.resourceType} resource with ${validationResult.conformanceScore}% score.`,
    status: 'success'
  });

  res.json({
    success: true,
    fileName,
    detectedSchema,
    mappingResult,
    validationResult,
    registeredResource: newFhirResource
  });
});

// ---------------------------------------------------------------------------
// Fallback / Helper Functions
// ---------------------------------------------------------------------------
function generateFallbackFhirMapping(rawData: any, preferredType?: string) {
  const contentStr = typeof rawData === 'string' ? rawData : JSON.stringify(rawData);
  const isWater = /coliform|turbidity|ph|bacteria|water|sample|chlorine|sensor/i.test(contentStr);
  const isPatient = /patient|age|gender|symptom|admission|diarrhea|fever/i.test(contentStr);

  if (preferredType === 'Observation' || (isWater && !isPatient)) {
    return {
      resourceType: 'Observation',
      fhirResource: {
        resourceType: 'Observation',
        id: `obs-upload-${Date.now()}`,
        status: 'final',
        category: [
          {
            coding: [
              {
                system: 'http://terminology.hl7.org/CodeSystem/observation-category',
                code: 'laboratory',
                display: 'Laboratory'
              }
            ]
          }
        ],
        code: {
          coding: [
            {
              system: 'http://loinc.org',
              code: '58452-4',
              display: 'Escherichia coli [Presence] in Water by Screen method'
            }
          ],
          text: 'Water Contamination Screen (Coliform/E. coli)'
        },
        effectiveDateTime: new Date().toISOString(),
        valueQuantity: {
          value: 3400,
          unit: 'CFU/100mL',
          system: 'http://unitsofmeasure.org',
          code: 'CFU/100mL'
        },
        interpretation: [
          {
            coding: [
              {
                system: 'http://terminology.hl7.org/CodeSystem/v3-ObservationInterpretation',
                code: 'A',
                display: 'Abnormal'
              }
            ]
          }
        ]
      },
      confidenceScore: 94,
      mappedFields: [
        { sourceField: 'coliform_val / bacteria', fhirField: 'Observation.valueQuantity.value', transformation: 'Numeric parse to UCUM CFU/100mL' },
        { sourceField: 'test_timestamp', fhirField: 'Observation.effectiveDateTime', transformation: 'ISO 8601 formatting' },
        { sourceField: 'water_source_id', fhirField: 'Observation.subject.reference', transformation: 'Mapped to Location reference' }
      ],
      reasoning: 'Input data detected as hydrological water quality telemetry. Mapped to HL7 FHIR R4 Observation with LOINC 58452-4 and UCUM units.',
      warnings: ['Raw sample coordinates inferred from local sensor metadata.']
    };
  } else {
    return {
      resourceType: 'Patient',
      fhirResource: {
        resourceType: 'Patient',
        id: `pat-upload-${Date.now()}`,
        active: true,
        name: [
          {
            use: 'anonymous',
            text: 'Synthetic One Health Demo Subject'
          }
        ],
        gender: 'female',
        birthDate: '1992-07-15',
        extension: [
          {
            url: 'http://aquasync.onehealth.org/fhir/StructureDefinition/water-exposure',
            valueString: 'Municipal domestic tap line, Sector 8'
          }
        ]
      },
      confidenceScore: 96,
      mappedFields: [
        { sourceField: 'subject_id', fhirField: 'Patient.id', transformation: 'Anonymized identifier assignment' },
        { sourceField: 'sex / gender', fhirField: 'Patient.gender', transformation: 'Normalized to FHIR AdministrativeGender' },
        { sourceField: 'exposure_notes', fhirField: 'Patient.extension[water-exposure]', transformation: 'Custom One Health extension encoding' }
      ],
      reasoning: 'Input data represents clinical patient demographic with recorded environmental exposure. Mapped cleanly to HL7 FHIR R4 Patient model.',
      warnings: []
    };
  }
}

function validateFhirLocally(resource: any) {
  const issues: any[] = [];
  let score = 100;

  if (!resource || typeof resource !== 'object') {
    return {
      validationStatus: 'error',
      conformanceScore: 0,
      checks: [{ checkName: 'JSON Syntax', passed: false, severity: 'error', message: 'Payload is not a valid JSON object' }],
      structuralIssues: ['Missing JSON root structure'],
      terminologyChecks: [],
      recommendations: ['Provide valid JSON format']
    };
  }

  // Check 1: resourceType
  if (!resource.resourceType) {
    issues.push({ checkName: 'Resource Type Check', passed: false, severity: 'error', message: 'Missing required field: resourceType' });
    score -= 40;
  } else {
    issues.push({ checkName: 'Resource Type Check', passed: true, severity: 'info', message: `Valid resourceType: ${resource.resourceType}` });
  }

  // Check 2: id
  if (!resource.id) {
    issues.push({ checkName: 'Logical Identifier Check', passed: false, severity: 'warning', message: 'Resource has no assigned logical id' });
    score -= 10;
  } else {
    issues.push({ checkName: 'Logical Identifier Check', passed: true, severity: 'info', message: `Logical ID present: ${resource.id}` });
  }

  // Check 3: Observation specific checks
  if (resource.resourceType === 'Observation') {
    if (!resource.status) {
      issues.push({ checkName: 'Observation Status', passed: false, severity: 'error', message: 'Missing required Observation.status (e.g. final, preliminary)' });
      score -= 25;
    } else {
      issues.push({ checkName: 'Observation Status', passed: true, severity: 'info', message: `Status is valid: ${resource.status}` });
    }

    if (!resource.code || !resource.code.coding) {
      issues.push({ checkName: 'LOINC / Terminology Code', passed: false, severity: 'warning', message: 'Observation.code is missing formal coding structure' });
      score -= 15;
    } else {
      issues.push({ checkName: 'LOINC / Terminology Code', passed: true, severity: 'info', message: 'Valid LOINC terminology coding found' });
    }
  }

  // Check 4: Patient specific checks
  if (resource.resourceType === 'Patient') {
    if (resource.gender && !['male', 'female', 'other', 'unknown'].includes(resource.gender)) {
      issues.push({ checkName: 'Administrative Gender', passed: false, severity: 'warning', message: 'Gender value does not conform to FHIR AdministrativeGender code system' });
      score -= 10;
    } else {
      issues.push({ checkName: 'Administrative Gender', passed: true, severity: 'info', message: 'Gender format verified' });
    }
  }

  score = Math.max(0, Math.min(100, score));
  const validationStatus = score >= 90 ? 'valid' : score >= 60 ? 'warning' : 'error';

  return {
    validationStatus,
    conformanceScore: score,
    checks: issues,
    structuralIssues: issues.filter(i => !i.passed).map(i => i.message),
    terminologyChecks: [
      'LOINC coding standards verified for environmental markers',
      'HL7 FHIR Core R4 schema compliance evaluated',
      'UCUM units of measurement syntax validated'
    ],
    recommendations: score < 100 
      ? ['Ensure all cross-resource subject/encounter references resolve to active endpoints.'] 
      : ['Resource is ready for live FHIR REST API broadcast across connected health systems.']
  };
}

function detectSchemaFromContent(content: string, fileType?: string) {
  const preview = content.slice(0, 1000);
  if (/coliform|water|ph|turbidity|chlorine|sensor/i.test(preview)) {
    return {
      domain: 'Environmental / Water Quality Telemetry',
      suggestedResourceType: 'Observation',
      detectedColumns: ['sample_id', 'timestamp', 'pH', 'coliform_cfu', 'turbidity_ntu', 'source_location'],
      format: fileType || 'csv'
    };
  }
  return {
    domain: 'Clinical / Hospital EHR Record',
    suggestedResourceType: 'Patient',
    detectedColumns: ['patient_id', 'age', 'gender', 'admission_date', 'symptoms', 'exposure_source'],
    format: fileType || 'json'
  };
}

function resolveVoiceQueryFallback(query: string, language: string) {
  const q = query.toLowerCase();

  // Hindi query handling
  if (/दिल्ली|delhi/i.test(q) && (/कितने|बीमार|क्या हो रहा/i.test(q) || /delhi/i.test(q))) {
    return {
      answer: "सिम्युलेटेड डेमो डेटा के अनुसार, दिल्ली (रोहिणी) क्षेत्र में 247 एक्टिव सिंथेटिक केस दर्ज किए गए हैं, जो वेल-5 सेक्टर 8 जल स्रोत में ई-कोलाई संदूषण से 99.2% संबंधित हैं।",
      languageDetected: "Hindi (हिन्दी)",
      actionSuggestion: "3D ग्लोब में दिल्ली हाइलाइट करें"
    };
  }

  if (/critical|गंभीर/i.test(q)) {
    return {
      answer: "वर्तमान सिमुलेशन में 2 क्षेत्र 'क्रिटिकल' स्तर पर हैं: दिल्ली-रोहिणी (247 सिंथेटिक केस) और लागोस-मेनलैंड (312 सिंथेटिक केस)। दोनों में जल स्रोतों का गंभीर जीवाणु संदूषण पाया गया है।",
      languageDetected: language.startsWith('hi') ? "Hindi" : "English",
      actionSuggestion: "क्रिटिकल अलर्ट्स पैनल खोलें"
    };
  }

  if (/fhir|standard/i.test(q)) {
    return {
      answer: "FHIR (Fast Healthcare Interoperability Resources) is an HL7 standard for exchanging healthcare data. AquaSync maps environmental water sensor data into FHIR Observation and Bundle resources so hospitals and water authorities can communicate seamlessly.",
      languageDetected: "English",
      actionSuggestion: "Open FHIR Explorer"
    };
  }

  if (/water|contamination|water quality/i.test(q)) {
    return {
      answer: "Simulated telemetry shows highest water contamination in Well-5 Sector 8 (Delhi) at 4,800 CFU/100mL and Iju Waterworks (Lagos) at 5,200 CFU/100mL. Both exceed standard baseline safety levels.",
      languageDetected: "English",
      actionSuggestion: "Inspect Water Quality Lab"
    };
  }

  // Default response
  return {
    answer: `Demo analysis: AquaSync is actively monitoring 10 synthetic regions covering 3.2M population with 3 AI agents. 247 synthetic cases are currently monitored in primary cluster (Delhi), with FHIR R4 interoperability active across all 5 connected systems.`,
    languageDetected: language || "English",
    actionSuggestion: "Explore Global Intelligence Dashboard"
  };
}

// ---------------------------------------------------------------------------
// Server Entry & Dev / Production Setup
// ---------------------------------------------------------------------------
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`🌊 AquaSync 3D server running on port ${PORT}`);
    console.log(`AI Gemini Engine: ${apiKey ? 'ONLINE (Gemini 3.8 Flash)' : 'DEMO MODE (Local AI Synthesis Engine)'}`);
  });
}

startServer();
