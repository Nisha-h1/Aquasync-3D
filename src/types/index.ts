export type SeverityLevel = 'critical' | 'high' | 'medium' | 'low';

export type UserRole = 
  | 'admin' 
  | 'health_authority' 
  | 'hospital' 
  | 'water_authority' 
  | 'researcher'
  | 'field_inspector'
  | 'citizen';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  role: UserRole;
  organization: string;
  avatarUrl?: string;
}

export interface Region {
  id: string;
  name: string;
  city: string;
  country: string;
  latitude: number;
  longitude: number;
  population: number;
  severity: SeverityLevel;
  waterSource: string;
  syntheticCases: number;
  hospitalized: number;
  recovered: number;
  newCasesLast24h: number;
  contaminationType: string;
  contaminationLevel: string;
  syntheticCorrelation: number;
  predictedSpread: string;
  outbreakStartDate: string;
  status: 'active' | 'monitored' | 'contained' | 'surveillance';
  description: string;
  timeline: {
    day: string;
    cases: number;
    waterColiform: number;
  }[];
  waterQuality: {
    pH: number;
    turbidityNtu: number;
    coliformCfu: number;
    chlorineMgL: number;
    temperatureC: number;
    status: 'unsafe' | 'warning' | 'normal';
  };
}

export interface OutbreakData {
  id: string;
  regionId: string;
  regionName: string;
  waterSource: string;
  contaminationType: string;
  contaminationLevel: string;
  patientCount: number;
  severity: SeverityLevel;
  detectedDate: string;
  outbreakStartDate: string;
  correlationScore: number;
  predictedSpread: string;
  status: string;
  aiSummary: string;
}

export interface PatientRecord {
  id: string;
  regionId: string;
  regionName: string;
  outbreakId: string;
  ageGroup: string;
  gender: string;
  symptoms: string[];
  severity: SeverityLevel;
  status: 'admitted' | 'recovering' | 'discharged' | 'outpatient';
  reportedDate: string;
  waterExposure: string;
  primaryWaterSource: string;
  syntheticFlag: true;
}

export interface WaterQualityRecord {
  sampleId: string;
  regionId: string;
  regionName: string;
  sampleDate: string;
  sampleTime: string;
  pH: number;
  turbidity: number;
  coliformCount: number;
  bacteriaLevel: string;
  contaminationType: string;
  status: 'critical' | 'alert' | 'acceptable' | 'pure';
  testedBy: string;
  notes: string;
}

export interface FhirResourceData {
  resourceType: 'Patient' | 'Observation' | 'Condition' | 'Encounter' | 'Location' | 'Bundle';
  resourceId: string;
  title: string;
  sourceSystem: string;
  validationStatus: 'valid' | 'warning' | 'error';
  validationScore: number;
  validationNotes: string[];
  createdAt: string;
  resourceJSON: Record<string, any>;
  mappingNotes: string;
}

export type AlertResolutionStatus = 'active' | 'pending_verification' | 'resolved';

export interface ResolutionRequest {
  id: string;
  requestedBy: string;
  role: string;
  profession: string;
  organization: string;
  professionalId: string;
  notes: string;
  evidenceFileName?: string;
  evidenceFileSize?: string;
  timestamp: string;
}

export interface AlertAuditRecord {
  id: string;
  actor: string;
  role: string;
  organization: string;
  action: string;
  timestamp: string;
  previousStatus: string;
  newStatus: string;
  notes?: string;
}

export interface OneHealthAlert {
  id: string;
  title: string;
  regionId: string;
  regionName: string;
  level: SeverityLevel | 'info';
  message: string;
  category: 'outbreak' | 'water_quality' | 'fhir_validation' | 'integration';
  timestamp: string;
  resolved: boolean;
  resolutionStatus?: AlertResolutionStatus;
  resolutionRequest?: ResolutionRequest;
  auditTrail?: AlertAuditRecord[];
  actionRequired: string;
}

export interface IntegrationSystem {
  id: string;
  name: string;
  type: 'hospital_ehr' | 'water_scada' | 'environmental_epa' | 'research_lab' | 'public_health';
  endpoint: string;
  status: 'connected' | 'fhir_mapped' | 'validated' | 'ready_for_exchange';
  recordsProcessed: number;
  lastSync: string;
  dataProtocol: string;
  fhirTarget: string;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  actor: string;
  role: string;
  action: string;
  details: string;
  status: 'success' | 'warning' | 'error';
}

export interface LabPipelineStep {
  stepNumber: number;
  title: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  details?: string;
  timestamp?: string;
}
