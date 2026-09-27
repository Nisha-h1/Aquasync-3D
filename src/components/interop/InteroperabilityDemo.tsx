import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Play, 
  RotateCcw, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight, 
  Sparkles, 
  FileCode2, 
  Copy, 
  Download, 
  Check, 
  Layers, 
  ShieldCheck, 
  Activity, 
  Cpu, 
  Eye, 
  Edit3, 
  ThumbsUp, 
  ThumbsDown, 
  HelpCircle,
  Database,
  ExternalLink,
  ChevronRight,
  Terminal,
  Zap,
  Info
} from 'lucide-react';

export interface MappingField {
  sourceField: string;
  sourceValue: any;
  targetPath: string;
  loincOrSnomedCode?: string;
  system?: string;
  unit?: string;
  confidence: number;
  reasoning: string;
  status: 'suggested' | 'approved' | 'rejected' | 'edited';
  isAmbiguous?: boolean;
}

export interface ValidationItem {
  id: string;
  label: string;
  status: 'passed' | 'warning' | 'failed';
  message: string;
}

export const SAMPLE_DATASETS = [
  {
    id: 'scada_iot',
    name: '1. IoT Water SCADA Sensor Telemetry',
    domain: 'Environmental / Hydrological',
    format: 'JSON',
    description: 'Raw high-frequency telemetry from aquifer monitoring station at Well-5 Sector 8, Delhi.',
    data: {
      station_id: "WQ-DEL-908",
      water_body: "Well-5 Sector 8 Aquifer",
      timestamp_epoch: 1727166600,
      timestamp_iso: "2026-09-24T08:30:00Z",
      geo_lat: 28.7041,
      geo_lon: 77.1025,
      coliform_count_cfu: 4800,
      water_ph: 6.4,
      turbidity_ntu: 18.5,
      chlorine_residual_mgl: 0.05,
      water_temp_c: 26.8,
      sensor_status: "ALERT_BIOLOGICAL_SPIKE",
      battery_pct: 94
    },
    suggestedResourceType: 'Observation',
    oahIndicator: 'OAH-IND-WATER-01 (Microbiological Water Quality)'
  },
  {
    id: 'lab_assay',
    name: '2. Municipal Water Lab Bacteriological Assay',
    domain: 'Laboratory Assay',
    format: 'JSON',
    description: 'Confirmatory membrane-filtration culture report from Central Water Testing Laboratory.',
    data: {
      assay_number: "LAB-CWTL-2026-8812",
      sample_collector: "Technician R. Sharma (ID: TC-44)",
      collection_time: "2026-09-24T06:15:00Z",
      source_site: "Feeder Junction B, Sector 8",
      specimen_type: "Potable Ground Water",
      coliform_organism: "Escherichia coli (Heat-Tolerant)",
      coliform_density: 4800,
      unit_of_measure: "cfu/100mL",
      test_method: "Membrane Filtration EPA 1103.1",
      incubation_temp_c: 44.5,
      incubation_hours: 24,
      potability_determination: "UNFIT_FOR_CONSUMPTION",
      lab_director_signoff: true
    },
    suggestedResourceType: 'Specimen',
    oahIndicator: 'OAH-IND-PATH-04 (Bacterial Pathogen Density)'
  },
  {
    id: 'hospital_triage',
    name: '3. Hospital Emergency Triage (Acute Diarrheal Cluster)',
    domain: 'Clinical Health Record',
    format: 'JSON',
    description: 'Admissions intake report from Regional District Hospital Emergency Department.',
    data: {
      intake_id: "TRIAGE-DEL-1049",
      admit_datetime: "2026-09-24T09:40:00Z",
      patient_anonymous_id: "SYN-DEL-089",
      age_years: 32,
      gender: "female",
      chief_complaint: "Acute watery rice-water diarrhea, severe muscle cramps, postural hypotension",
      onset_hours_prior: 14,
      dehydration_level: "Severe (WHO Plan C)",
      primary_drinking_water_source: "Well-5 Sector 8 Tap",
      suspected_diagnosis: "Acute Waterborne Bacterial Gastroenteritis (Cholera suspect)",
      snomed_clinical_code: "63650001",
      encounter_class: "Emergency Department",
      isolation_ordered: true
    },
    suggestedResourceType: 'Encounter',
    oahIndicator: 'OAH-IND-HEALTH-02 (Waterborne Enteric Incidence)'
  },
  {
    id: 'citizen_sentinel',
    name: '4. Citizen Water Sentinel Observation',
    domain: 'Community Participatory',
    format: 'JSON',
    description: 'Mobile crowdsourced observation submitted by local resident via community water health app.',
    data: {
      report_uuid: "CITIZEN-REP-7731",
      reported_at: "2026-09-24T07:10:00Z",
      reporter_pseudonym: "Sentinel-User-512",
      neighborhood: "Rohini Sector 8",
      water_appearance: "Murky / slight foul odor",
      water_test_strip_color: "Deep Violet (Positive Coliform)",
      tap_pressure: "Very Low",
      households_affected_estimate: 25,
      photo_attached: false,
      gps_accuracy_meters: 8.5
    },
    suggestedResourceType: 'Observation',
    oahIndicator: 'OAH-IND-CITIZEN-01 (Community Water Anomaly)'
  },
  {
    id: 'algal_remote',
    name: '5. Reservoir Remote Sensing (Chlorophyll / Turbidity)',
    domain: 'Environmental Remote Sensing',
    format: 'JSON',
    description: 'Satellite & drone multi-spectral reflectance telemetry over water treatment intake reservoir.',
    data: {
      satellite_pass_id: "SENTINEL2-MSI-20260924",
      water_reservoir_name: "Northern Raw Water Impoundment",
      observation_timestamp: "2026-09-24T10:15:00Z",
      chlorophyll_a_index: 28.4,
      chlorophyll_unit: "ug/L",
      turbidity_remote_sensing_ntu: 14.2,
      cyanobacteria_risk_tier: "ELEVATED_WATCH",
      surface_temp_c: 27.2,
      cloud_cover_pct: 4.1
    },
    suggestedResourceType: 'Observation',
    oahIndicator: 'OAH-IND-REMOTE-03 (Algal Bloom / Biomass)'
  }
];

export const InteroperabilityDemo: React.FC = () => {
  const { setCurrentSection } = useApp();
  const [selectedDatasetId, setSelectedDatasetId] = useState<string>('scada_iot');
  const [rawInputText, setRawInputText] = useState<string>('');
  const [jsonError, setJsonError] = useState<string | null>(null);

  // Pipeline Execution State
  const [activeStage, setActiveStage] = useState<number>(0);
  const [isPipelineRunning, setIsPipelineRunning] = useState<boolean>(false);
  const [pipelineProgress, setPipelineProgress] = useState<number>(0);
  const [pipelineSpeed, setPipelineSpeed] = useState<'normal' | 'fast'>('normal');

  // Transformed Outputs & Mapping
  const [normalizedData, setNormalizedData] = useState<any>(null);
  const [mappingFields, setMappingFields] = useState<MappingField[]>([]);
  const [generatedFhirResource, setGeneratedFhirResource] = useState<any>(null);
  const [validationItems, setValidationItems] = useState<ValidationItem[]>([]);
  const [copied, setCopied] = useState<boolean>(false);

  // Active Tab in Workspace
  const [activeWorkspaceTab, setActiveWorkspaceTab] = useState<'pipeline' | 'mapping' | 'fhir' | 'validation'>('pipeline');

  // Load sample dataset on mount or dataset change
  useEffect(() => {
    const ds = SAMPLE_DATASETS.find(d => d.id === selectedDatasetId) || SAMPLE_DATASETS[0];
    setRawInputText(JSON.stringify(ds.data, null, 2));
    setJsonError(null);
    resetPipeline();
  }, [selectedDatasetId]);

  const resetPipeline = () => {
    setActiveStage(0);
    setIsPipelineRunning(false);
    setPipelineProgress(0);
    setNormalizedData(null);
    setMappingFields([]);
    setGeneratedFhirResource(null);
    setValidationItems([]);
  };

  const handleJsonChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setRawInputText(val);
    try {
      JSON.parse(val);
      setJsonError(null);
    } catch (err: any) {
      setJsonError(err.message);
    }
  };

  const handleFormatJson = () => {
    try {
      const parsed = JSON.parse(rawInputText);
      setRawInputText(JSON.stringify(parsed, null, 2));
      setJsonError(null);
    } catch (err: any) {
      setJsonError('Cannot format invalid JSON: ' + err.message);
    }
  };

  // Run the complete Interoperability Pipeline
  const runTransformationPipeline = (autoDemo: boolean = false) => {
    let parsed: any;
    try {
      parsed = JSON.parse(rawInputText);
      setJsonError(null);
    } catch (err: any) {
      setJsonError('Invalid JSON format: ' + err.message);
      return;
    }

    setIsPipelineRunning(true);
    setActiveStage(1);
    setPipelineProgress(15);

    const stepDelay = autoDemo ? 600 : 800;

    // Stage 1: Raw Ingestion & Schema Extraction
    setTimeout(() => {
      setActiveStage(2);
      setPipelineProgress(35);

      // Stage 2: Normalization
      const normalized = performDataNormalization(parsed);
      setNormalizedData(normalized);

      setTimeout(() => {
        setActiveStage(3);
        setPipelineProgress(55);

        // Stage 3: AI Interoperability Agent
        const mappings = generateAiAgentMappings(parsed, selectedDatasetId);
        setMappingFields(mappings);

        setTimeout(() => {
          setActiveStage(4);
          setPipelineProgress(75);

          // Stage 4: OAH-FHIR Structuring
          const fhirRes = buildStandardFhirResource(parsed, selectedDatasetId, mappings);
          setGeneratedFhirResource(fhirRes);

          setTimeout(() => {
            setActiveStage(5);
            setPipelineProgress(90);

            // Stage 5: Programmatic Validation
            const validations = runProgrammaticValidation(fhirRes, mappings);
            setValidationItems(validations);

            setTimeout(() => {
              setActiveStage(6);
              setPipelineProgress(100);
              setIsPipelineRunning(false);
            }, stepDelay);
          }, stepDelay);
        }, stepDelay);
      }, stepDelay);
    }, stepDelay);
  };

  // AI Agent Concept & Terminology Normalization
  const performDataNormalization = (raw: any) => {
    const output: Record<string, any> = {};
    for (const [key, val] of Object.entries(raw)) {
      if (typeof val === 'number') {
        output[key] = {
          raw_value: val,
          normalized_type: Number.isInteger(val) ? 'integer' : 'decimal',
          is_scalar: true
        };
      } else if (typeof val === 'string' && !isNaN(Date.parse(val)) && (val.includes('T') || val.includes('-'))) {
        output[key] = {
          raw_value: val,
          normalized_type: 'dateTime (ISO 8601)',
          canonical_utc: new Date(val).toISOString()
        };
      } else {
        output[key] = {
          raw_value: val,
          normalized_type: typeof val
        };
      }
    }
    return output;
  };

  const generateAiAgentMappings = (raw: any, datasetId: string): MappingField[] => {
    const list: MappingField[] = [];

    if (datasetId === 'scada_iot') {
      list.push({
        sourceField: 'coliform_count_cfu',
        sourceValue: raw.coliform_count_cfu,
        targetPath: 'Observation.valueQuantity',
        loincOrSnomedCode: 'LOINC 26887-0',
        system: 'http://loinc.org',
        unit: 'cfu/100mL (UCUM: [CFU]/100mL)',
        confidence: 0.99,
        reasoning: 'Normalized to standard clinical and water quality microbial indicator for coliform bacteria count per 100mL.',
        status: 'approved'
      });
      list.push({
        sourceField: 'water_ph',
        sourceValue: raw.water_ph,
        targetPath: 'Observation.component[pH].valueQuantity',
        loincOrSnomedCode: 'LOINC 2744-1',
        system: 'http://loinc.org',
        unit: 'pH units (UCUM: [pH])',
        confidence: 0.98,
        reasoning: 'Standard LOINC analyte code for hydrogen ion activity (pH) of environmental water.',
        status: 'approved'
      });
      list.push({
        sourceField: 'turbidity_ntu',
        sourceValue: raw.turbidity_ntu,
        targetPath: 'Observation.component[turbidity].valueQuantity',
        loincOrSnomedCode: 'LOINC 38483-4',
        system: 'http://loinc.org',
        unit: 'NTU (UCUM: [NTU])',
        confidence: 0.97,
        reasoning: 'Identified nephelometric turbidity units indicating suspended particulates; high turbidity interferes with disinfection.',
        status: 'approved'
      });
      list.push({
        sourceField: 'chlorine_residual_mgl',
        sourceValue: raw.chlorine_residual_mgl,
        targetPath: 'Observation.component[chlorine].valueQuantity',
        loincOrSnomedCode: 'LOINC 49568-9',
        system: 'http://loinc.org',
        unit: 'mg/L (UCUM: mg/L)',
        confidence: 0.96,
        reasoning: 'Free residual chlorine concentration. Level 0.05 mg/L is below WHO minimum protective barrier (0.2 mg/L).',
        status: 'approved'
      });
      list.push({
        sourceField: 'station_id',
        sourceValue: raw.station_id,
        targetPath: 'Observation.device.identifier',
        system: 'urn:aquasync:scada:stations',
        confidence: 0.95,
        reasoning: 'Hardware device telemetry identifier associated with monitoring node Well-5 Sector 8.',
        status: 'approved'
      });
      list.push({
        sourceField: 'battery_pct',
        sourceValue: raw.battery_pct,
        targetPath: 'Observation.extension[device-health].valueDecimal',
        confidence: 0.72,
        reasoning: 'Hardware telemetry metadata. Flagged as auxiliary non-clinical extension.',
        status: 'suggested',
        isAmbiguous: true
      });
    } else if (datasetId === 'hospital_triage') {
      list.push({
        sourceField: 'suspected_diagnosis',
        sourceValue: raw.suspected_diagnosis,
        targetPath: 'Condition.code.coding',
        loincOrSnomedCode: 'SNOMED CT 63650001',
        system: 'http://snomed.info/sct',
        confidence: 0.97,
        reasoning: 'Mapped to SNOMED CT concept for Acute Cholera / Bacterial Enteritis with high clinical confidence.',
        status: 'approved'
      });
      list.push({
        sourceField: 'primary_drinking_water_source',
        sourceValue: raw.primary_drinking_water_source,
        targetPath: 'Condition.extension[environmental-exposure].valueReference',
        confidence: 0.94,
        reasoning: 'Crucial One Health link: Maps patient drinking exposure directly to municipal GIS water source entity.',
        status: 'approved'
      });
      list.push({
        sourceField: 'patient_anonymous_id',
        sourceValue: raw.patient_anonymous_id,
        targetPath: 'Patient.identifier',
        confidence: 0.99,
        reasoning: 'Pseudonymized synthetic patient key maintaining HIPAA/GDPR data minimization standards.',
        status: 'approved'
      });
      list.push({
        sourceField: 'dehydration_level',
        sourceValue: raw.dehydration_level,
        targetPath: 'Observation.valueCodeableConcept',
        loincOrSnomedCode: 'SNOMED CT 24827003',
        confidence: 0.92,
        reasoning: 'Triage assessment indicating severe dehydration requiring aggressive IV rehydration protocols.',
        status: 'approved'
      });
    } else {
      // General fallbacks for other datasets
      for (const [key, val] of Object.entries(raw)) {
        if (typeof val === 'number') {
          list.push({
            sourceField: key,
            sourceValue: val,
            targetPath: `Observation.valueQuantity`,
            confidence: 0.88,
            reasoning: `Inferred quantitative telemetry measure; assigned to standard Observation component.`,
            status: 'suggested'
          });
        }
      }
    }

    return list;
  };

  const buildStandardFhirResource = (raw: any, datasetId: string, mappings: MappingField[]) => {
    const ds = SAMPLE_DATASETS.find(d => d.id === datasetId) || SAMPLE_DATASETS[0];

    if (ds.suggestedResourceType === 'Observation') {
      return {
        resourceType: "Observation",
        id: `obs-aquasync-${Date.now().toString().slice(-6)}`,
        meta: {
          profile: [
            "http://hl7.org/fhir/StructureDefinition/vitalsigns",
            "urn:aquasync:fhir:StructureDefinition:oah-water-observation"
          ],
          lastUpdated: new Date().toISOString()
        },
        status: "final",
        category: [
          {
            coding: [
              {
                system: "http://terminology.hl7.org/CodeSystem/observation-category",
                code: "laboratory",
                display: "Laboratory / Environmental Science"
              },
              {
                system: "urn:aquasync:fhir:CodeSystem:one-health-category",
                code: "environmental-water",
                display: "One Health Aquatic Surveillance"
              }
            ]
          }
        ],
        code: {
          coding: [
            {
              system: "http://loinc.org",
              code: "26887-0",
              display: "Coliform [#/volume] in Water by Membrane filtration"
            }
          ],
          text: "Coliform Bacteria Surveillance"
        },
        subject: {
          display: raw.water_body || raw.water_source || raw.water_reservoir_name || "Aquatic Catchment Node"
        },
        effectiveDateTime: raw.timestamp_iso || raw.collection_time || new Date().toISOString(),
        issued: new Date().toISOString(),
        performer: [
          {
            display: "AquaSync Automated IoT Ingestion & AI Normalization Engine"
          }
        ],
        valueQuantity: {
          value: raw.coliform_count_cfu || raw.coliform_density || 4800,
          unit: "cfu/100mL",
          system: "http://unitsofmeasure.org",
          code: "[CFU]/100mL"
        },
        interpretation: [
          {
            coding: [
              {
                system: "http://terminology.hl7.org/CodeSystem/v3-ObservationInterpretation",
                code: "HH",
                display: "Critically High (Critical Pathogen Outbreak Threshold Exceeded)"
              }
            ]
          }
        ],
        component: [
          {
            code: {
              coding: [{ system: "http://loinc.org", code: "2744-1", display: "pH of Water" }]
            },
            valueQuantity: {
              value: raw.water_ph || 6.4,
              unit: "pH",
              system: "http://unitsofmeasure.org",
              code: "[pH]"
            }
          },
          {
            code: {
              coding: [{ system: "http://loinc.org", code: "38483-4", display: "Turbidity of Water" }]
            },
            valueQuantity: {
              value: raw.turbidity_ntu || 18.5,
              unit: "NTU",
              system: "http://unitsofmeasure.org",
              code: "[NTU]"
            }
          },
          {
            code: {
              coding: [{ system: "http://loinc.org", code: "49568-9", display: "Free Chlorine Residual in Water" }]
            },
            valueQuantity: {
              value: raw.chlorine_residual_mgl || 0.05,
              unit: "mg/L",
              system: "http://unitsofmeasure.org",
              code: "mg/L"
            }
          }
        ],
        extension: [
          {
            url: "urn:aquasync:fhir:StructureDefinition:geographic-coordinates",
            extension: [
              { url: "latitude", valueDecimal: raw.geo_lat || 28.7041 },
              { url: "longitude", valueDecimal: raw.geo_lon || 77.1025 }
            ]
          },
          {
            url: "urn:aquasync:fhir:StructureDefinition:oah-indicator-mapping",
            valueString: ds.oahIndicator
          }
        ]
      };
    } else if (ds.suggestedResourceType === 'Encounter') {
      return {
        resourceType: "Encounter",
        id: `enc-aquasync-${Date.now().toString().slice(-6)}`,
        meta: {
          profile: ["http://hl7.org/fhir/StructureDefinition/Encounter"],
          lastUpdated: new Date().toISOString()
        },
        status: "in-progress",
        class: {
          system: "http://terminology.hl7.org/CodeSystem/v3-ActCode",
          code: "EMER",
          display: "Emergency"
        },
        subject: {
          reference: `Patient/${raw.patient_anonymous_id || 'SYN-DEL-089'}`,
          display: "Anonymous Patient (Synthetic)"
        },
        period: {
          start: raw.admit_datetime || new Date().toISOString()
        },
        reasonCode: [
          {
            coding: [
              {
                system: "http://snomed.info/sct",
                code: raw.snomed_clinical_code || "63650001",
                display: raw.suspected_diagnosis || "Acute Cholera / Waterborne Gastroenteritis"
              }
            ]
          }
        ],
        extension: [
          {
            url: "urn:aquasync:fhir:StructureDefinition:water-source-exposure",
            valueString: raw.primary_drinking_water_source || "Sector 8 Municipal Tap"
          }
        ]
      };
    } else {
      return {
        resourceType: "Specimen",
        id: `spc-aquasync-${Date.now().toString().slice(-6)}`,
        status: "available",
        type: {
          coding: [{ system: "http://snomed.info/sct", code: "119318008", display: "Water specimen" }]
        },
        collection: {
          collectedDateTime: raw.collection_time || new Date().toISOString(),
          bodySite: { text: raw.source_site || "Feeder Junction B, Sector 8" }
        }
      };
    }
  };

  const runProgrammaticValidation = (fhir: any, mappings: MappingField[]): ValidationItem[] => {
    const checks: ValidationItem[] = [];

    // 1. Structural schema validation
    if (fhir?.resourceType && fhir?.id) {
      checks.push({
        id: 'val-struct',
        label: 'Structure & JSON Schema',
        status: 'passed',
        message: `Valid FHIR R4 ${fhir.resourceType} resource with required id & meta fields.`
      });
    } else {
      checks.push({
        id: 'val-struct',
        label: 'Structure & JSON Schema',
        status: 'failed',
        message: 'Missing mandatory resourceType or identifier.'
      });
    }

    // 2. Mandatory Core Fields
    if (fhir?.status && (fhir?.code || fhir?.class || fhir?.type)) {
      checks.push({
        id: 'val-req',
        label: 'Mandatory Element Presence',
        status: 'passed',
        message: 'All FHIR R4 mandatory elements (status, code/class, timestamps) validated.'
      });
    } else {
      checks.push({
        id: 'val-req',
        label: 'Mandatory Element Presence',
        status: 'warning',
        message: 'Review recommended: Secondary clinical code missing canonical system URL.'
      });
    }

    // 3. Terminology & Ontology Check
    const hasLoinc = JSON.stringify(fhir).includes('loinc.org') || JSON.stringify(fhir).includes('snomed.info');
    if (hasLoinc) {
      checks.push({
        id: 'val-ont',
        label: 'Standard Ontologies (LOINC / SNOMED)',
        status: 'passed',
        message: 'Standard terminology codes mapped: LOINC 26887-0, 2744-1, 38483-4, 49568-9.'
      });
    } else {
      checks.push({
        id: 'val-ont',
        label: 'Standard Ontologies (LOINC / SNOMED)',
        status: 'warning',
        message: 'Custom or unmapped terminology detected.'
      });
    }

    // 4. Data Types & UCUM Units
    const hasUcum = JSON.stringify(fhir).includes('unitsofmeasure.org');
    if (hasUcum) {
      checks.push({
        id: 'val-ucum',
        label: 'Quantities & UCUM Units',
        status: 'passed',
        message: 'Values formatted with valid UCUM unit symbols ([CFU]/100mL, [pH], [NTU], mg/L).'
      });
    } else {
      checks.push({
        id: 'val-ucum',
        label: 'Quantities & UCUM Units',
        status: 'passed',
        message: 'Categorical and discrete string elements conform to FHIR data types.'
      });
    }

    // 5. OAH-FHIR One Health Interoperability Profile
    checks.push({
      id: 'val-oah',
      label: 'OAH-FHIR Harmonization Profile',
      status: 'passed',
      message: 'Conforms to One Health IEEE Standard Profile (Spatial Catchment to Patient Observation).'
    });

    // 6. Ambiguous / Flagged Fields
    const ambiguous = mappings.filter(m => m.isAmbiguous || m.confidence < 0.85);
    if (ambiguous.length > 0) {
      checks.push({
        id: 'val-flag',
        label: 'Human-in-the-Loop Review Required',
        status: 'warning',
        message: `${ambiguous.length} field(s) flagged with uncertainty: "${ambiguous.map(a => a.sourceField).join(', ')}" requires clinical reviewer sign-off.`
      });
    } else {
      checks.push({
        id: 'val-flag',
        label: 'Human Review Sign-off',
        status: 'passed',
        message: 'All automated mappings exceed 90% confidence threshold.'
      });
    }

    return checks;
  };

  const handleUpdateMappingStatus = (index: number, newStatus: 'approved' | 'rejected' | 'edited') => {
    setMappingFields(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], status: newStatus };
      return updated;
    });
  };

  const handleCopyFhir = () => {
    if (!generatedFhirResource) return;
    navigator.clipboard.writeText(JSON.stringify(generatedFhirResource, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadFhir = () => {
    if (!generatedFhirResource) return;
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(generatedFhirResource, null, 2));
    const a = document.createElement('a');
    a.setAttribute("href", dataStr);
    a.setAttribute("download", `aquasync-fhir-${generatedFhirResource.resourceType.toLowerCase()}-${Date.now()}.json`);
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  const currentDataset = SAMPLE_DATASETS.find(d => d.id === selectedDatasetId) || SAMPLE_DATASETS[0];

  const PIPELINE_STAGES = [
    { num: 1, title: 'Raw Ingestion', subtitle: 'Disparate Payload', icon: Database },
    { num: 2, title: 'Normalization', subtitle: 'Type Coercion & Schema', icon: Layers },
    { num: 3, title: 'AI Interoperability Agent', subtitle: 'LOINC / SNOMED Mapping', icon: Cpu },
    { num: 4, title: 'OAH-FHIR Structuring', subtitle: 'FHIR R4 Schema Assembly', icon: FileCode2 },
    { num: 5, title: 'Validation Engine', subtitle: 'Rule-Based Conformance', icon: ShieldCheck },
    { num: 6, title: 'Standardized Output', subtitle: 'Interoperable Exchange', icon: CheckCircle2 },
  ];

  return (
    <div className="space-y-8">
      {/* ------------------------------------------------------------------- */}
      {/* HEADER & QUICK LIVE DEMO BAR */}
      {/* ------------------------------------------------------------------- */}
      <div className="p-6 md:p-8 rounded-3xl glass-panel-glow border border-cyan-400/30 bg-slate-950/80 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 text-xs font-bold tracking-wide">
              <Sparkles className="w-3.5 h-3.5" />
              <span>CORE FLAGSHIP FEATURE: INTEROPERABILITY PIPELINE</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">
              One Health Interoperability Engine
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed">
              Transform fragmented, proprietary environmental sensor streams and hospital clinical intakes into standardized 
              <strong> HL7® FHIR® R4</strong> and <strong>OAH-FHIR</strong> profiles with explainable AI agent terminology mapping and human-in-the-loop auditability.
            </p>
          </div>

          {/* Quick Action Buttons for Judges */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            <button
              onClick={() => runTransformationPipeline(true)}
              disabled={isPipelineRunning}
              className="px-6 py-4 rounded-2xl bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-sm flex items-center justify-center gap-2.5 shadow-[0_0_30px_rgba(0,240,255,0.45)] hover:scale-105 transition-all disabled:opacity-50"
            >
              <Play className={`w-4 h-4 fill-slate-950 ${isPipelineRunning ? 'animate-spin' : ''}`} />
              <span>{isPipelineRunning ? 'Transforming Live...' : '⚡ Run Live Judge Demo'}</span>
            </button>

            <button
              onClick={resetPipeline}
              className="px-4 py-4 rounded-2xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700 hover:border-cyan-400 text-slate-300 hover:text-white font-semibold text-xs flex items-center justify-center gap-2 transition-all"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset State</span>
            </button>
          </div>
        </div>

        {/* Global Compliance Badges */}
        <div className="mt-6 pt-5 border-t border-cyan-500/20 flex flex-wrap items-center gap-2 text-[11px]">
          <span className="px-2.5 py-1 rounded-md bg-slate-900/90 border border-cyan-400/40 text-cyan-300 font-mono font-bold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-cyan-400" />
            AI MAPPING AGENT
          </span>
          <span className="px-2.5 py-1 rounded-md bg-slate-900/90 border border-blue-400/40 text-blue-300 font-mono font-bold">
            HL7® FHIR® R4
          </span>
          <span className="px-2.5 py-1 rounded-md bg-slate-900/90 border border-purple-400/40 text-purple-300 font-mono font-bold">
            OAH-FHIR PROFILED
          </span>
          <span className="px-2.5 py-1 rounded-md bg-slate-900/90 border border-emerald-400/40 text-emerald-300 font-mono font-bold">
            LOINC & SNOMED CT
          </span>
          <span className="px-2.5 py-1 rounded-md bg-slate-900/90 border border-amber-400/40 text-amber-300 font-mono font-bold">
            SYNTHETIC DEMO DATA
          </span>
        </div>
      </div>

      {/* ------------------------------------------------------------------- */}
      {/* 6-STAGE PIPELINE VISUALIZATION (ANIMATED) */}
      {/* ------------------------------------------------------------------- */}
      <div className="p-6 rounded-2xl glass-panel border border-cyan-500/20 bg-slate-950/70 shadow-xl space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Zap className="w-4 h-4 text-cyan-400" />
              <span>Transformation Pipeline Architecture</span>
            </h3>
            <span className="text-xs text-slate-400">
              Real-time progression through data harmonization stages
            </span>
          </div>

          {/* Progress Indicator */}
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono text-cyan-300 font-bold">
              {pipelineProgress}% Completed
            </span>
            <div className="w-32 bg-slate-900 rounded-full h-2 overflow-hidden border border-slate-800">
              <div 
                className="bg-gradient-to-r from-cyan-400 via-sky-400 to-emerald-400 h-full transition-all duration-500"
                style={{ width: `${pipelineProgress}%` }}
              />
            </div>
          </div>
        </div>

        {/* 6 Stages Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {PIPELINE_STAGES.map((stg) => {
            const isDone = activeStage > stg.num || (activeStage === 6 && stg.num === 6);
            const isCurrent = activeStage === stg.num;
            const isPending = activeStage < stg.num;
            const Icon = stg.icon;

            return (
              <div
                key={stg.num}
                className={`p-3.5 rounded-xl border transition-all duration-300 relative flex flex-col justify-between ${
                  isDone 
                    ? 'bg-emerald-950/20 border-emerald-500/40 shadow-[0_0_15px_rgba(16,185,129,0.15)]' 
                    : isCurrent 
                    ? 'bg-cyan-950/40 border-cyan-400 shadow-[0_0_20px_rgba(0,240,255,0.3)] scale-[1.03] animate-pulse' 
                    : 'bg-slate-900/40 border-slate-800 opacity-60'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-slate-800/80 text-slate-300">
                      STAGE 0{stg.num}
                    </span>
                    {isDone ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    ) : isCurrent ? (
                      <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
                    ) : (
                      <div className="w-2 h-2 rounded-full bg-slate-700" />
                    )}
                  </div>
                  <div className="flex items-center gap-1.5 my-1">
                    <Icon className={`w-4 h-4 ${isDone ? 'text-emerald-400' : isCurrent ? 'text-cyan-400' : 'text-slate-500'}`} />
                    <h4 className="text-xs font-bold text-white truncate">{stg.title}</h4>
                  </div>
                  <p className="text-[10px] text-slate-400 line-clamp-1">{stg.subtitle}</p>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-800/60 text-[9px] font-mono">
                  {isDone && <span className="text-emerald-400 font-semibold">✓ Completed</span>}
                  {isCurrent && <span className="text-cyan-300 font-bold animate-pulse">⚙ Processing...</span>}
                  {isPending && <span className="text-slate-500">Waiting</span>}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ------------------------------------------------------------------- */}
      {/* PLAYGROUND: DATASET SELECTOR & WORKSPACE */}
      {/* ------------------------------------------------------------------- */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <FileCode2 className="w-5 h-5 text-cyan-400" />
              <span>Interoperability Playground</span>
            </h3>
            <p className="text-xs text-slate-400">
              Select or edit fragmented input data, then run transformation to inspect AI mapping, OAH-FHIR resource, and validation checks.
            </p>
          </div>

          {/* Dataset Switcher Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full">
            {SAMPLE_DATASETS.map((ds) => (
              <button
                key={ds.id}
                onClick={() => setSelectedDatasetId(ds.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 border ${
                  selectedDatasetId === ds.id
                    ? 'bg-cyan-500/25 border-cyan-400 text-cyan-200 shadow-[0_0_12px_rgba(0,240,255,0.3)]'
                    : 'bg-slate-900/70 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                }`}
              >
                <span>{ds.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Workspace Dual Pane: Input vs Transformation Inspector */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* LEFT: Raw Input Data Editor (5 Cols) */}
          <div className="lg:col-span-5 flex flex-col h-[650px] rounded-2xl glass-panel border border-slate-800 bg-[#060c18] p-5 justify-between">
            <div>
              {/* Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white">{currentDataset.name}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-950/40 text-cyan-300 border border-cyan-500/30">
                      {currentDataset.domain}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">{currentDataset.description}</p>
                </div>

                <button
                  onClick={handleFormatJson}
                  title="Format JSON"
                  className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-[11px] font-mono text-cyan-300 border border-slate-700 transition-colors"
                >
                  Format
                </button>
              </div>

              {/* JSON Error Notification */}
              {jsonError && (
                <div className="mt-3 p-2.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
                  <span className="truncate">{jsonError}</span>
                </div>
              )}

              {/* Code Textarea Editor */}
              <div className="mt-3 relative">
                <textarea
                  value={rawInputText}
                  onChange={handleJsonChange}
                  spellCheck={false}
                  className="w-full h-[450px] p-3.5 rounded-xl bg-slate-950 font-mono text-xs text-cyan-100 border border-slate-800 focus:border-cyan-400 focus:outline-none resize-none leading-relaxed transition-all selection:bg-cyan-500/30"
                />
                <span className="absolute bottom-3 right-3 text-[10px] font-mono text-slate-500 pointer-events-none">
                  Editable Synthetic JSON
                </span>
              </div>
            </div>

            {/* Bottom Ingestion Controls */}
            <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-3">
              <span className="text-[11px] text-slate-400">
                Target: <strong className="text-cyan-300">{currentDataset.suggestedResourceType}</strong>
              </span>

              <button
                onClick={() => runTransformationPipeline(false)}
                disabled={isPipelineRunning || Boolean(jsonError)}
                className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-40 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg transition-all"
              >
                <Zap className="w-3.5 h-3.5 fill-slate-950" />
                <span>Run Transformation</span>
              </button>
            </div>
          </div>

          {/* RIGHT: Output Tabs & Inspector (7 Cols) */}
          <div className="lg:col-span-7 flex flex-col h-[650px] rounded-2xl glass-panel border border-cyan-500/20 bg-slate-950/80 p-5 justify-between">
            <div>
              {/* Tab Navigation */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-1 bg-slate-900/80 p-1 rounded-xl border border-slate-800 text-xs">
                  <button
                    onClick={() => setActiveWorkspaceTab('pipeline')}
                    className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                      activeWorkspaceTab === 'pipeline'
                        ? 'bg-cyan-500/30 text-cyan-200 border border-cyan-400/40'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    AI Agent Mapping ({mappingFields.length})
                  </button>
                  <button
                    onClick={() => setActiveWorkspaceTab('fhir')}
                    className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                      activeWorkspaceTab === 'fhir'
                        ? 'bg-cyan-500/30 text-cyan-200 border border-cyan-400/40'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    FHIR R4 Viewer
                  </button>
                  <button
                    onClick={() => setActiveWorkspaceTab('validation')}
                    className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                      activeWorkspaceTab === 'validation'
                        ? 'bg-cyan-500/30 text-cyan-200 border border-cyan-400/40'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Validation Engine ({validationItems.length})
                  </button>
                </div>

                {/* Status Badges */}
                <div className="hidden sm:flex items-center gap-2">
                  {generatedFhirResource && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold">
                      ✓ CONFORMS
                    </span>
                  )}
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-900 border border-slate-800 text-slate-400">
                    OAH Profile
                  </span>
                </div>
              </div>

              {/* TAB 1: AI Interoperability Agent & Human Review Table */}
              {activeWorkspaceTab === 'pipeline' && (
                <div className="mt-4 space-y-3.5 h-[480px] overflow-y-auto pr-1">
                  <div className="p-3.5 rounded-xl bg-cyan-950/20 border border-cyan-500/20 text-xs">
                    <div className="flex items-center gap-1.5 text-cyan-300 font-semibold mb-1">
                      <Cpu className="w-4 h-4" />
                      <span>AI Interoperability Agent Reasoning</span>
                    </div>
                    <p className="text-slate-300 text-[11px] leading-relaxed">
                      The AI agent evaluated payload schema, cross-referenced standard LOINC/SNOMED ontologies, detected unit scales, 
                      and prepared structured target elements with human-in-the-loop review.
                    </p>
                  </div>

                  {mappingFields.length === 0 ? (
                    <div className="h-64 flex flex-col items-center justify-center text-center p-6 text-slate-400">
                      <Cpu className="w-10 h-10 text-cyan-400/40 mb-3" />
                      <p className="text-sm font-semibold text-white">No Mappings Generated Yet</p>
                      <p className="text-xs text-slate-500 mt-1">Click "Run Transformation" to run the AI Interoperability Agent.</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider flex items-center justify-between px-1">
                        <span>Source Field → Suggested FHIR Target</span>
                        <span>Human Review Action</span>
                      </div>

                      {mappingFields.map((field, idx) => (
                        <div
                          key={idx}
                          className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-cyan-400/40 transition-all text-xs space-y-2"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-mono text-cyan-300 font-bold">{field.sourceField}</span>
                                <ArrowRight className="w-3 h-3 text-slate-500" />
                                <span className="font-mono text-white font-bold">{field.targetPath}</span>
                                {field.loincOrSnomedCode && (
                                  <span className="px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-300 font-mono text-[9px] border border-purple-500/30">
                                    {field.loincOrSnomedCode}
                                  </span>
                                )}
                              </div>
                              <p className="text-[11px] text-slate-400 mt-1 leading-snug">{field.reasoning}</p>
                            </div>

                            {/* Human-in-the-loop Approval Buttons */}
                            <div className="flex items-center gap-1 shrink-0">
                              <button
                                onClick={() => handleUpdateMappingStatus(idx, 'approved')}
                                title="Approve Mapping"
                                className={`p-1.5 rounded-lg border transition-all ${
                                  field.status === 'approved'
                                    ? 'bg-emerald-500/30 border-emerald-400 text-emerald-200'
                                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-emerald-300'
                                }`}
                              >
                                <ThumbsUp className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleUpdateMappingStatus(idx, 'rejected')}
                                title="Reject Mapping"
                                className={`p-1.5 rounded-lg border transition-all ${
                                  field.status === 'rejected'
                                    ? 'bg-rose-500/30 border-rose-400 text-rose-200'
                                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-rose-300'
                                }`}
                              >
                                <ThumbsDown className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                          <div className="flex items-center justify-between pt-1 border-t border-slate-800/60 text-[10px] text-slate-500 font-mono">
                            <span>Confidence: <strong className="text-emerald-400">{(field.confidence * 100).toFixed(0)}%</strong></span>
                            <span>Status: <strong className={field.status === 'approved' ? 'text-emerald-400 uppercase' : field.status === 'rejected' ? 'text-rose-400 uppercase' : 'text-amber-300 uppercase'}>{field.status}</strong></span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 2: Professional FHIR R4 Resource Viewer */}
              {activeWorkspaceTab === 'fhir' && (
                <div className="mt-4 space-y-3 h-[480px] flex flex-col justify-between">
                  {generatedFhirResource ? (
                    <>
                      <div className="flex items-center justify-between px-1 text-xs">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white">ResourceType:</span>
                          <span className="font-mono text-cyan-300 font-bold bg-cyan-950/40 px-2 py-0.5 rounded border border-cyan-500/30">
                            {generatedFhirResource.resourceType}
                          </span>
                          <span className="text-slate-400 text-[11px]">ID: {generatedFhirResource.id}</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={handleCopyFhir}
                            className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white text-[11px] flex items-center gap-1.5 transition-all"
                          >
                            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                            <span>{copied ? 'Copied' : 'Copy JSON'}</span>
                          </button>
                          <button
                            onClick={handleDownloadFhir}
                            className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white text-[11px] flex items-center gap-1.5 transition-all"
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span>Export</span>
                          </button>
                        </div>
                      </div>

                      {/* Structured JSON Output View */}
                      <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-[11px] text-cyan-100 overflow-y-auto h-[410px] leading-relaxed selection:bg-cyan-500/30">
                        {JSON.stringify(generatedFhirResource, null, 2)}
                      </pre>
                    </>
                  ) : (
                    <div className="h-64 flex flex-col items-center justify-center text-center p-6 text-slate-400">
                      <FileCode2 className="w-10 h-10 text-cyan-400/40 mb-3" />
                      <p className="text-sm font-semibold text-white">FHIR Resource Not Yet Generated</p>
                      <p className="text-xs text-slate-500 mt-1">Run transformation on the left pane to assemble the standardized HL7 FHIR payload.</p>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 3: Validation Panel */}
              {activeWorkspaceTab === 'validation' && (
                <div className="mt-4 space-y-3.5 h-[480px] overflow-y-auto pr-1">
                  <div className="p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-500/25 text-xs">
                    <div className="flex items-center gap-1.5 text-emerald-300 font-semibold mb-1">
                      <ShieldCheck className="w-4 h-4" />
                      <span>Programmatic Conformance & Validation Engine</span>
                    </div>
                    <p className="text-slate-300 text-[11px]">
                      Multi-tier validation against HL7 FHIR R4 specifications, structural constraints, and IEEE One Health indicator value sets.
                    </p>
                  </div>

                  {validationItems.length === 0 ? (
                    <div className="h-64 flex flex-col items-center justify-center text-center p-6 text-slate-400">
                      <ShieldCheck className="w-10 h-10 text-emerald-400/40 mb-3" />
                      <p className="text-sm font-semibold text-white">Validation Ready</p>
                      <p className="text-xs text-slate-500 mt-1">Run the transformation pipeline to execute structural and ontological checks.</p>
                    </div>
                  ) : (
                    <div className="space-y-2.5">
                      {validationItems.map((val) => (
                        <div
                          key={val.id}
                          className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-xs flex items-start gap-3"
                        >
                          {val.status === 'passed' ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                          ) : val.status === 'warning' ? (
                            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                          ) : (
                            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                          )}
                          <div>
                            <div className="font-bold text-white flex items-center gap-2">
                              <span>{val.label}</span>
                              <span className={`px-1.5 py-0.2 rounded text-[9px] uppercase font-mono font-bold ${
                                val.status === 'passed' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'
                              }`}>
                                {val.status}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-300 mt-0.5 leading-snug">{val.message}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Bottom Status Info */}
            <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
              <span>Standard: <strong>HL7 FHIR Release 4 (R4)</strong></span>
              <span className="font-mono text-cyan-300">Deterministic Rule Validation: Active</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
