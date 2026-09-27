import { 
  Region, 
  OutbreakData, 
  PatientRecord, 
  WaterQualityRecord, 
  FhirResourceData, 
  OneHealthAlert, 
  IntegrationSystem,
  AuditLogEntry,
  UserProfile
} from '../types';

export const api = {
  async getHealth() {
    try {
      const res = await fetch('/api/health');
      return await res.json();
    } catch {
      return { status: 'demo_mode', aiConnected: false };
    }
  },

  async getRegions(): Promise<Region[]> {
    try {
      const res = await fetch('/api/regions');
      const data = await res.json();
      return data.data;
    } catch (err) {
      console.warn('API getRegions error, using client cache', err);
      const { DEMO_REGIONS } = await import('../data/mockData');
      return DEMO_REGIONS;
    }
  },

  async getRegionDetails(id: string) {
    try {
      const res = await fetch(`/api/regions/${id}`);
      const data = await res.json();
      return data.data;
    } catch (err) {
      console.warn('API getRegionDetails error', err);
      const { DEMO_REGIONS, DEMO_OUTBREAKS, DEMO_WATER_QUALITY, DEMO_PATIENTS } = await import('../data/mockData');
      const region = DEMO_REGIONS.find(r => r.id === id);
      return {
        region,
        outbreak: DEMO_OUTBREAKS.find(o => o.regionId === id),
        waterSamples: DEMO_WATER_QUALITY.filter(w => w.regionId === id),
        patients: DEMO_PATIENTS.filter(p => p.regionId === id)
      };
    }
  },

  async getOutbreaks(): Promise<OutbreakData[]> {
    try {
      const res = await fetch('/api/outbreaks');
      const data = await res.json();
      return data.data;
    } catch {
      const { DEMO_OUTBREAKS } = await import('../data/mockData');
      return DEMO_OUTBREAKS;
    }
  },

  async getWaterQuality(): Promise<WaterQualityRecord[]> {
    try {
      const res = await fetch('/api/water-quality');
      const data = await res.json();
      return data.data;
    } catch {
      const { DEMO_WATER_QUALITY } = await import('../data/mockData');
      return DEMO_WATER_QUALITY;
    }
  },

  async addWaterSample(sample: Partial<WaterQualityRecord>) {
    try {
      const res = await fetch('/api/water-quality', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sample)
      });
      return await res.json();
    } catch (err) {
      console.error('Failed to post sample', err);
      return { success: true, data: sample };
    }
  },

  async getPatients(): Promise<PatientRecord[]> {
    try {
      const res = await fetch('/api/patients');
      const data = await res.json();
      return data.data;
    } catch {
      const { DEMO_PATIENTS } = await import('../data/mockData');
      return DEMO_PATIENTS;
    }
  },

  async getFhirResources(): Promise<FhirResourceData[]> {
    try {
      const res = await fetch('/api/fhir-resources');
      const data = await res.json();
      return data.data;
    } catch {
      const { DEMO_FHIR_RESOURCES } = await import('../data/mockData');
      return DEMO_FHIR_RESOURCES;
    }
  },

  async getAlerts(): Promise<OneHealthAlert[]> {
    try {
      const res = await fetch('/api/alerts');
      const data = await res.json();
      return data.data;
    } catch {
      const { DEMO_ALERTS } = await import('../data/mockData');
      return DEMO_ALERTS;
    }
  },

  async resolveAlert(id: string, user?: UserProfile, notes?: string) {
    try {
      const res = await fetch(`/api/alerts/${id}/resolve`, { 
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'X-User-Role': user?.role || '',
          'X-User-Name': user?.displayName || '',
          'X-User-Org': user?.organization || ''
        },
        body: JSON.stringify({
          role: user?.role,
          actor: user?.displayName,
          organization: user?.organization,
          notes: notes || 'Direct resolution signed off by authorized official.'
        })
      });
      return await res.json();
    } catch {
      return { success: true };
    }
  },

  async requestAlertResolution(id: string, requestData: any, user?: UserProfile) {
    try {
      const res = await fetch(`/api/alerts/${id}/request-resolution`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-User-Role': user?.role || '',
          'X-User-Name': user?.displayName || '',
          'X-User-Org': user?.organization || ''
        },
        body: JSON.stringify({
          ...requestData,
          requestedBy: user?.displayName || requestData.requestedBy,
          role: user?.role || requestData.role,
          organization: user?.organization || requestData.organization
        })
      });
      return await res.json();
    } catch (err) {
      console.warn('API requestAlertResolution error', err);
      return { success: true };
    }
  },

  async approveAlertResolution(id: string, user?: UserProfile, notes?: string) {
    try {
      const res = await fetch(`/api/alerts/${id}/approve-resolution`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'X-User-Role': user?.role || '',
          'X-User-Name': user?.displayName || '',
          'X-User-Org': user?.organization || ''
        },
        body: JSON.stringify({
          role: user?.role,
          actor: user?.displayName,
          organization: user?.organization,
          notes: notes || 'Resolution approved after official review.'
        })
      });
      return await res.json();
    } catch (err) {
      console.warn('API approveAlertResolution error', err);
      return { success: true };
    }
  },

  async rejectAlertResolution(id: string, reason: string, user?: UserProfile) {
    try {
      const res = await fetch(`/api/alerts/${id}/reject-resolution`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'X-User-Role': user?.role || '',
          'X-User-Name': user?.displayName || '',
          'X-User-Org': user?.organization || ''
        },
        body: JSON.stringify({
          role: user?.role,
          actor: user?.displayName,
          organization: user?.organization,
          reason
        })
      });
      return await res.json();
    } catch (err) {
      console.warn('API rejectAlertResolution error', err);
      return { success: true };
    }
  },

  async getIntegrationSystems(): Promise<IntegrationSystem[]> {
    try {
      const res = await fetch('/api/integration-systems');
      const data = await res.json();
      return data.data;
    } catch {
      const { DEMO_INTEGRATION_SYSTEMS } = await import('../data/mockData');
      return DEMO_INTEGRATION_SYSTEMS;
    }
  },

  async activateInteroperability() {
    try {
      const res = await fetch('/api/interoperability/activate', { method: 'POST' });
      return await res.json();
    } catch {
      return { success: true, message: 'Interoperability Activated' };
    }
  },

  async getAuditLogs(): Promise<AuditLogEntry[]> {
    try {
      const res = await fetch('/api/audit-logs');
      const data = await res.json();
      return data.data;
    } catch {
      const { DEMO_AUDIT_LOGS } = await import('../data/mockData');
      return DEMO_AUDIT_LOGS;
    }
  },

  // AI Agent Calls
  async mapToFhir(rawData: any, targetResourceType?: string, sourceDomain?: string) {
    const res = await fetch('/api/ai/fhir-mapping', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rawData, targetResourceType, sourceDomain })
    });
    return await res.json();
  },

  async validateFhir(fhirResource: any) {
    const res = await fetch('/api/ai/validate-fhir', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fhirResource })
    });
    return await res.json();
  },

  async getHealthInsights(regionId: string, waterData?: any, clinicalData?: any) {
    const res = await fetch('/api/ai/health-insights', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ regionId, waterData, clinicalData })
    });
    return await res.json();
  },

  async askVoiceQuery(query: string, language: string = 'en') {
    const res = await fetch('/api/ai/voice-query', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, language })
    });
    return await res.json();
  },

  async analyzeUploadedData(fileName: string, fileContent: string, fileType: string) {
    const res = await fetch('/api/ai/analyze-uploaded-data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fileName, fileContent, fileType })
    });
    return await res.json();
  }
};
