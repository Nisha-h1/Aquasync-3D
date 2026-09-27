import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Region, 
  UserProfile, 
  UserRole, 
  OneHealthAlert, 
  IntegrationSystem,
  ResolutionRequest,
  AlertAuditRecord
} from '../types';
import { DEMO_REGIONS, DEMO_USER_PROFILES, DEMO_ALERTS, DEMO_INTEGRATION_SYSTEMS } from '../data/mockData';
import { api } from '../services/api';

export type NavSection = 
  | 'home' 
  | 'interop-demo'
  | 'dashboard' 
  | 'globe' 
  | 'map' 
  | 'fhir' 
  | 'agents' 
  | 'lab' 
  | 'voice' 
  | 'integration' 
  | 'alerts' 
  | 'transparency' 
  | 'settings';

interface AppContextType {
  currentSection: NavSection;
  setCurrentSection: (section: NavSection) => void;
  regions: Region[];
  selectedRegion: Region | null;
  setSelectedRegion: (region: Region | null) => void;
  currentUser: UserProfile;
  setUserRole: (role: UserRole) => void;
  alerts: OneHealthAlert[];
  unreadAlertsCount: number;
  resolveAlert: (id: string, notes?: string) => Promise<boolean>;
  requestResolution: (id: string, requestData: any) => Promise<boolean>;
  approveResolution: (id: string, notes?: string) => Promise<boolean>;
  rejectResolution: (id: string, reason: string) => Promise<boolean>;
  integrationSystems: IntegrationSystem[];
  isInteroperabilityActive: boolean;
  activateInteroperability: () => Promise<void>;
  isAiOnline: boolean;
  refreshData: () => Promise<void>;
  selectRegionAndNavigate: (regionId: string, targetSection?: NavSection) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentSection, setCurrentSection] = useState<NavSection>('home');
  const [regions, setRegions] = useState<Region[]>(DEMO_REGIONS);
  const [selectedRegion, setSelectedRegion] = useState<Region | null>(DEMO_REGIONS[0]); // Default to Delhi
  const [currentUser, setCurrentUser] = useState<UserProfile>(DEMO_USER_PROFILES.health_authority);
  const [alerts, setAlerts] = useState<OneHealthAlert[]>(DEMO_ALERTS);
  const [integrationSystems, setIntegrationSystems] = useState<IntegrationSystem[]>(DEMO_INTEGRATION_SYSTEMS);
  const [isInteroperabilityActive, setIsInteroperabilityActive] = useState<boolean>(false);
  const [isAiOnline, setIsAiOnline] = useState<boolean>(false);

  useEffect(() => {
    refreshData();
  }, []);

  const refreshData = async () => {
    try {
      const health = await api.getHealth();
      setIsAiOnline(Boolean(health.aiConnected));
      const fetchedRegions = await api.getRegions();
      if (fetchedRegions && fetchedRegions.length > 0) {
        setRegions(fetchedRegions);
      }
      const fetchedAlerts = await api.getAlerts();
      if (fetchedAlerts) {
        setAlerts(fetchedAlerts);
      }
      const fetchedSystems = await api.getIntegrationSystems();
      if (fetchedSystems) {
        setIntegrationSystems(fetchedSystems);
      }
    } catch (e) {
      console.warn('Using client initial state', e);
    }
  };

  const setUserRole = (role: UserRole) => {
    const profile = DEMO_USER_PROFILES[role] || DEMO_USER_PROFILES.health_authority;
    setCurrentUser(profile);
  };

  const isAuthorizedToResolve = (role?: string) => {
    if (!role) return false;
    const r = role.toLowerCase().trim();
    return (
      r === 'admin' ||
      r === 'water_authority' ||
      r === 'health_authority' ||
      r === 'field_inspector' ||
      r === 'supervisor' ||
      r.includes('admin') ||
      r.includes('authority') ||
      r.includes('inspector') ||
      r.includes('supervisor')
    );
  };

  const resolveAlert = async (id: string, notes?: string): Promise<boolean> => {
    if (!isAuthorizedToResolve(currentUser?.role)) {
      console.warn('Unauthorized: Only Admin/Supervisor/Authority users can mark an alert as resolved.');
      return false;
    }
    const res = await api.resolveAlert(id, currentUser, notes);
    if (res && res.error) {
      alert(res.error);
      return false;
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

    setAlerts(prev => prev.map(a => {
      if (a.id !== id) return a;
      const prevStatus = a.resolutionStatus === 'pending_verification'
        ? 'Resolution Requested / Pending Verification'
        : 'Active Alert';

      const newAudit: AlertAuditRecord = {
        id: `AUD-${Date.now()}`,
        actor: currentUser.displayName,
        role: currentUser.role === 'water_authority' ? 'Water Authority' : currentUser.role === 'health_authority' ? 'Public Health Official' : currentUser.role === 'field_inspector' ? 'Field Inspector' : 'Administrator',
        organization: currentUser.organization,
        action: 'Direct Resolution Marked',
        timestamp: nowIst,
        previousStatus: prevStatus,
        newStatus: 'Resolved',
        notes: notes || 'Direct resolution signed off by authorized official.'
      };

      return {
        ...a,
        resolved: true,
        resolutionStatus: 'resolved',
        auditTrail: [newAudit, ...(a.auditTrail || [])]
      };
    }));
    return true;
  };

  const requestResolution = async (id: string, requestData: any): Promise<boolean> => {
    const res = await api.requestAlertResolution(id, requestData, currentUser);
    if (res && res.error) {
      alert(res.error);
      return false;
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

    const reqRecord: ResolutionRequest = {
      id: `REQ-${Date.now()}`,
      requestedBy: currentUser.displayName || requestData.requestedBy,
      role: currentUser.role || requestData.role,
      profession: requestData.profession,
      organization: requestData.organization || currentUser.organization,
      professionalId: requestData.professionalId,
      notes: requestData.notes,
      evidenceFileName: requestData.evidenceFileName,
      timestamp: nowIst
    };

    const auditRecord: AlertAuditRecord = {
      id: `AUD-${Date.now()}`,
      actor: currentUser.displayName || requestData.requestedBy,
      role: requestData.profession || currentUser.role,
      organization: requestData.organization || currentUser.organization,
      action: 'Resolution Requested',
      timestamp: nowIst,
      previousStatus: 'Active Alert',
      newStatus: 'Resolution Requested / Pending Verification',
      notes: requestData.notes
    };

    setAlerts(prev => prev.map(a => {
      if (a.id !== id) return a;
      return {
        ...a,
        resolved: false,
        resolutionStatus: 'pending_verification',
        resolutionRequest: reqRecord,
        auditTrail: [auditRecord, ...(a.auditTrail || [])]
      };
    }));
    return true;
  };

  const approveResolution = async (id: string, notes?: string): Promise<boolean> => {
    if (!isAuthorizedToResolve(currentUser?.role)) {
      console.warn('Unauthorized: Only authorized Water Authority, Public Health Official, or Field Inspector users can approve resolutions.');
      return false;
    }
    const res = await api.approveAlertResolution(id, currentUser, notes);
    if (res && res.error) {
      alert(res.error);
      return false;
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

    setAlerts(prev => prev.map(a => {
      if (a.id !== id) return a;
      const approvalNotes = notes || (a.resolutionRequest ? `Approved resolution request filed by ${a.resolutionRequest.requestedBy} (${a.resolutionRequest.professionalId}).` : 'Resolution verified and signed off.');
      const auditRecord: AlertAuditRecord = {
        id: `AUD-${Date.now()}`,
        actor: currentUser.displayName,
        role: currentUser.role === 'water_authority' ? 'Water Authority' : currentUser.role === 'health_authority' ? 'Public Health Official' : currentUser.role === 'field_inspector' ? 'Field Inspector' : 'Administrator',
        organization: currentUser.organization,
        action: 'Resolution Approved',
        timestamp: nowIst,
        previousStatus: 'Resolution Requested / Pending Verification',
        newStatus: 'Resolved',
        notes: approvalNotes
      };
      return {
        ...a,
        resolved: true,
        resolutionStatus: 'resolved',
        auditTrail: [auditRecord, ...(a.auditTrail || [])]
      };
    }));
    return true;
  };

  const rejectResolution = async (id: string, reason: string): Promise<boolean> => {
    if (!isAuthorizedToResolve(currentUser?.role)) {
      return false;
    }
    await api.rejectAlertResolution(id, reason, currentUser);

    const nowIst = new Date().toLocaleString('en-IN', {
      timeZone: 'Asia/Kolkata',
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    }) + ' IST';

    setAlerts(prev => prev.map(a => {
      if (a.id !== id) return a;
      const auditRecord: AlertAuditRecord = {
        id: `AUD-${Date.now()}`,
        actor: currentUser.displayName,
        role: currentUser.role === 'water_authority' ? 'Water Authority' : currentUser.role === 'health_authority' ? 'Public Health Official' : currentUser.role === 'field_inspector' ? 'Field Inspector' : 'Administrator',
        organization: currentUser.organization,
        action: 'Resolution Rejected / Reopened',
        timestamp: nowIst,
        previousStatus: 'Resolution Requested / Pending Verification',
        newStatus: 'Active Alert',
        notes: reason || 'Resolution evidence insufficient; alert remains active.'
      };
      return {
        ...a,
        resolved: false,
        resolutionStatus: 'active',
        auditTrail: [auditRecord, ...(a.auditTrail || [])]
      };
    }));
    return true;
  };

  const activateInteroperability = async () => {
    const res = await api.activateInteroperability();
    if (res && res.systems) {
      setIntegrationSystems(res.systems);
    }
    setIsInteroperabilityActive(true);
  };

  const selectRegionAndNavigate = (regionId: string, targetSection: NavSection = 'globe') => {
    const found = regions.find(r => r.id === regionId);
    if (found) {
      setSelectedRegion(found);
      setCurrentSection(targetSection);
    }
  };

  const unreadAlertsCount = alerts.filter(a => !a.resolved).length;

  return (
    <AppContext.Provider
      value={{
        currentSection,
        setCurrentSection,
        regions,
        selectedRegion,
        setSelectedRegion,
        currentUser,
        setUserRole,
        alerts,
        unreadAlertsCount,
        resolveAlert,
        requestResolution,
        approveResolution,
        rejectResolution,
        integrationSystems,
        isInteroperabilityActive,
        activateInteroperability,
        isAiOnline,
        refreshData,
        selectRegionAndNavigate
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
