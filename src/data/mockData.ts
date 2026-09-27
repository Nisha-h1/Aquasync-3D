import { 
  Region, 
  OutbreakData, 
  PatientRecord, 
  WaterQualityRecord, 
  FhirResourceData, 
  OneHealthAlert, 
  IntegrationSystem,
  UserProfile,
  AuditLogEntry
} from '../types';

export const DEMO_REGIONS: Region[] = [
  {
    id: 'delhi-rohini',
    name: 'Delhi – Rohini',
    city: 'Delhi',
    country: 'India',
    latitude: 28.7041,
    longitude: 77.1025,
    population: 860000,
    severity: 'critical',
    waterSource: 'Well-5 Sector 8 Aquifer',
    syntheticCases: 247,
    hospitalized: 68,
    recovered: 142,
    newCasesLast24h: 37,
    contaminationType: 'Escherichia coli (O157:H7) & Total Coliforms',
    contaminationLevel: '4,800 CFU/100mL (Extreme)',
    syntheticCorrelation: 99.2,
    predictedSpread: '+18% next 48h unless supply isolated',
    outbreakStartDate: '2026-09-18',
    status: 'active',
    description: 'Acute gastroenteritis spike concentrated along pipeline distribution radius of Well-5 Sector 8. High coliform density observed in municipal junction samples.',
    timeline: [
      { day: 'Day 1', cases: 14, waterColiform: 210 },
      { day: 'Day 2', cases: 38, waterColiform: 850 },
      { day: 'Day 3', cases: 82, waterColiform: 1950 },
      { day: 'Day 4', cases: 145, waterColiform: 3200 },
      { day: 'Day 5', cases: 198, waterColiform: 4100 },
      { day: 'Day 6', cases: 232, waterColiform: 4600 },
      { day: 'Day 7', cases: 247, waterColiform: 4800 }
    ],
    waterQuality: {
      pH: 6.4,
      turbidityNtu: 18.5,
      coliformCfu: 4800,
      chlorineMgL: 0.05,
      temperatureC: 28.4,
      status: 'unsafe'
    }
  },
  {
    id: 'mumbai-dharavi',
    name: 'Mumbai – Dharavi',
    city: 'Mumbai',
    country: 'India',
    latitude: 19.0434,
    longitude: 72.8550,
    population: 1000000,
    severity: 'high',
    waterSource: '90-Feet Road Sub-surface Distribution Pipeline',
    syntheticCases: 156,
    hospitalized: 45,
    recovered: 89,
    newCasesLast24h: 22,
    contaminationType: 'Vibrio cholerae (El Tor variant)',
    contaminationLevel: '2,900 CFU/100mL (High Alert)',
    syntheticCorrelation: 94.8,
    predictedSpread: '+12% risk in high-density informal clusters',
    outbreakStartDate: '2026-09-19',
    status: 'active',
    description: 'Post-monsoon pipeline cross-contamination detected at intersection of municipal storm drain and domestic drinking main.',
    timeline: [
      { day: 'Day 1', cases: 9, waterColiform: 180 },
      { day: 'Day 2', cases: 24, waterColiform: 640 },
      { day: 'Day 3', cases: 58, waterColiform: 1300 },
      { day: 'Day 4', cases: 98, waterColiform: 2100 },
      { day: 'Day 5', cases: 132, waterColiform: 2600 },
      { day: 'Day 6', cases: 149, waterColiform: 2850 },
      { day: 'Day 7', cases: 156, waterColiform: 2900 }
    ],
    waterQuality: {
      pH: 6.8,
      turbidityNtu: 12.2,
      coliformCfu: 2900,
      chlorineMgL: 0.12,
      temperatureC: 29.8,
      status: 'unsafe'
    }
  },
  {
    id: 'bangalore-whitefield',
    name: 'Bangalore – Whitefield',
    city: 'Bangalore',
    country: 'India',
    latitude: 12.9698,
    longitude: 77.7499,
    population: 450000,
    severity: 'medium',
    waterSource: 'Varthur Borewell Network Cluster B',
    syntheticCases: 89,
    hospitalized: 18,
    recovered: 58,
    newCasesLast24h: 8,
    contaminationType: 'Salmonella enterica serovar Typhi',
    contaminationLevel: '850 CFU/100mL (Moderate)',
    syntheticCorrelation: 88.4,
    predictedSpread: 'Plateauing with mobile filtration units deployed',
    outbreakStartDate: '2026-09-20',
    status: 'monitored',
    description: 'Borewell seepage following industrial discharge percolation near Varthur drainage basin.',
    timeline: [
      { day: 'Day 1', cases: 5, waterColiform: 90 },
      { day: 'Day 2', cases: 18, waterColiform: 240 },
      { day: 'Day 3', cases: 39, waterColiform: 510 },
      { day: 'Day 4', cases: 62, waterColiform: 720 },
      { day: 'Day 5', cases: 78, waterColiform: 820 },
      { day: 'Day 6', cases: 85, waterColiform: 840 },
      { day: 'Day 7', cases: 89, waterColiform: 850 }
    ],
    waterQuality: {
      pH: 7.1,
      turbidityNtu: 6.4,
      coliformCfu: 850,
      chlorineMgL: 0.28,
      temperatureC: 24.1,
      status: 'warning'
    }
  },
  {
    id: 'new-york-manhattan',
    name: 'New York – Manhattan',
    city: 'New York',
    country: 'USA',
    latitude: 40.7831,
    longitude: -73.9712,
    population: 1630000,
    severity: 'low',
    waterSource: 'Catskill / Delaware Water System Tunnel No. 1',
    syntheticCases: 12,
    hospitalized: 1,
    recovered: 10,
    newCasesLast24h: 1,
    contaminationType: 'Trace Biofilm / Residual Coliform',
    contaminationLevel: '14 CFU/100mL (Trace)',
    syntheticCorrelation: 41.2,
    predictedSpread: 'Isolated rooftop auxiliary tank issue, stable',
    outbreakStartDate: '2026-09-21',
    status: 'contained',
    description: 'Controlled low-severity scenario involving isolated residential cooling tower backflow in lower Manhattan.',
    timeline: [
      { day: 'Day 1', cases: 1, waterColiform: 4 },
      { day: 'Day 2', cases: 3, waterColiform: 8 },
      { day: 'Day 3', cases: 6, waterColiform: 18 },
      { day: 'Day 4', cases: 9, waterColiform: 15 },
      { day: 'Day 5', cases: 11, waterColiform: 14 },
      { day: 'Day 6', cases: 12, waterColiform: 12 },
      { day: 'Day 7', cases: 12, waterColiform: 14 }
    ],
    waterQuality: {
      pH: 7.4,
      turbidityNtu: 0.8,
      coliformCfu: 14,
      chlorineMgL: 0.95,
      temperatureC: 18.2,
      status: 'normal'
    }
  },
  {
    id: 'lagos-mainland',
    name: 'Lagos – Mainland',
    city: 'Lagos',
    country: 'Nigeria',
    latitude: 6.5244,
    longitude: 3.3792,
    population: 1450000,
    severity: 'critical',
    waterSource: 'Iju Waterworks Trunk Distribution Line 4',
    syntheticCases: 312,
    hospitalized: 94,
    recovered: 160,
    newCasesLast24h: 46,
    contaminationType: 'Vibrio cholerae (Classical & Inaba)',
    contaminationLevel: '5,200 CFU/100mL (Extreme Emergency)',
    syntheticCorrelation: 98.7,
    predictedSpread: '+24% spread across secondary informal water vendors',
    outbreakStartDate: '2026-09-17',
    status: 'active',
    description: 'High pressure drop in municipal mains created back-siphonage of lagoon marsh water into domestic supply network.',
    timeline: [
      { day: 'Day 1', cases: 18, waterColiform: 320 },
      { day: 'Day 2', cases: 54, waterColiform: 980 },
      { day: 'Day 3', cases: 115, waterColiform: 2400 },
      { day: 'Day 4', cases: 195, waterColiform: 3800 },
      { day: 'Day 5', cases: 255, waterColiform: 4700 },
      { day: 'Day 6', cases: 290, waterColiform: 5050 },
      { day: 'Day 7', cases: 312, waterColiform: 5200 }
    ],
    waterQuality: {
      pH: 6.2,
      turbidityNtu: 24.1,
      coliformCfu: 5200,
      chlorineMgL: 0.02,
      temperatureC: 31.0,
      status: 'unsafe'
    }
  },
  {
    id: 'bangkok-rattanakosin',
    name: 'Bangkok – Rattanakosin',
    city: 'Bangkok',
    country: 'Thailand',
    latitude: 13.7563,
    longitude: 100.5018,
    population: 580000,
    severity: 'high',
    waterSource: 'Chao Phraya River Basin Intake Canal 3',
    syntheticCases: 178,
    hospitalized: 42,
    recovered: 108,
    newCasesLast24h: 21,
    contaminationType: 'Leptospira interrogans & Enterotoxigenic E. coli',
    contaminationLevel: '3,100 CFU/100mL (High)',
    syntheticCorrelation: 93.6,
    predictedSpread: '+15% during ongoing tidal surge period',
    outbreakStartDate: '2026-09-18',
    status: 'active',
    description: 'Heavy seasonal flood overflow submerged drainage locks, contaminating raw water pump stations.',
    timeline: [
      { day: 'Day 1', cases: 11, waterColiform: 210 },
      { day: 'Day 2', cases: 32, waterColiform: 680 },
      { day: 'Day 3', cases: 74, waterColiform: 1450 },
      { day: 'Day 4', cases: 118, waterColiform: 2200 },
      { day: 'Day 5', cases: 149, waterColiform: 2750 },
      { day: 'Day 6', cases: 166, waterColiform: 2980 },
      { day: 'Day 7', cases: 178, waterColiform: 3100 }
    ],
    waterQuality: {
      pH: 6.6,
      turbidityNtu: 16.8,
      coliformCfu: 3100,
      chlorineMgL: 0.08,
      temperatureC: 30.2,
      status: 'unsafe'
    }
  },
  {
    id: 'sao-paulo-zona-leste',
    name: 'São Paulo – Zona Leste',
    city: 'São Paulo',
    country: 'Brazil',
    latitude: -23.5505,
    longitude: -46.6333,
    population: 2200000,
    severity: 'medium',
    waterSource: 'Guarapiranga Reservoir Tributary Branch B',
    syntheticCases: 143,
    hospitalized: 31,
    recovered: 92,
    newCasesLast24h: 12,
    contaminationType: 'Hepatitis A Virus & Giardia lamblia cysts',
    contaminationLevel: '1,450 CFU/100mL (Elevated)',
    syntheticCorrelation: 86.9,
    predictedSpread: '+7% moderate rise in unpaved peripheral sectors',
    outbreakStartDate: '2026-09-19',
    status: 'monitored',
    description: 'Informal occupation runoff reaching secondary reservoir feeder tributary without chlorination step.',
    timeline: [
      { day: 'Day 1', cases: 8, waterColiform: 150 },
      { day: 'Day 2', cases: 27, waterColiform: 420 },
      { day: 'Day 3', cases: 61, waterColiform: 840 },
      { day: 'Day 4', cases: 94, waterColiform: 1150 },
      { day: 'Day 5', cases: 121, waterColiform: 1320 },
      { day: 'Day 6', cases: 136, waterColiform: 1410 },
      { day: 'Day 7', cases: 143, waterColiform: 1450 }
    ],
    waterQuality: {
      pH: 7.0,
      turbidityNtu: 9.3,
      coliformCfu: 1450,
      chlorineMgL: 0.22,
      temperatureC: 22.8,
      status: 'warning'
    }
  },
  {
    id: 'cairo-giza',
    name: 'Cairo – Giza',
    city: 'Cairo',
    country: 'Egypt',
    latitude: 30.0131,
    longitude: 31.2089,
    population: 1890000,
    severity: 'medium',
    waterSource: 'El-Giza Nile Irrigation Canal Network',
    syntheticCases: 95,
    hospitalized: 19,
    recovered: 64,
    newCasesLast24h: 9,
    contaminationType: 'Schistosoma mansoni cercariae & Enterococcus',
    contaminationLevel: '980 CFU/100mL (Moderate)',
    syntheticCorrelation: 84.1,
    predictedSpread: 'Contained to agricultural canal washing zones',
    outbreakStartDate: '2026-09-20',
    status: 'monitored',
    description: 'Seasonal snail host proliferation along unlined irrigation feeder channels in peri-urban Giza.',
    timeline: [
      { day: 'Day 1', cases: 6, waterColiform: 120 },
      { day: 'Day 2', cases: 21, waterColiform: 310 },
      { day: 'Day 3', cases: 44, waterColiform: 580 },
      { day: 'Day 4', cases: 68, waterColiform: 780 },
      { day: 'Day 5', cases: 81, waterColiform: 890 },
      { day: 'Day 6', cases: 91, waterColiform: 950 },
      { day: 'Day 7', cases: 95, waterColiform: 980 }
    ],
    waterQuality: {
      pH: 7.5,
      turbidityNtu: 8.1,
      coliformCfu: 980,
      chlorineMgL: 0.25,
      temperatureC: 27.5,
      status: 'warning'
    }
  },
  {
    id: 'shanghai-pudong',
    name: 'Shanghai – Pudong',
    city: 'Shanghai',
    country: 'China',
    latitude: 31.2222,
    longitude: 121.5440,
    population: 2900000,
    severity: 'low',
    waterSource: 'Qingcaosha Reservoir Sub-pipeline 12',
    syntheticCases: 34,
    hospitalized: 4,
    recovered: 28,
    newCasesLast24h: 2,
    contaminationType: 'Microcystin Cyanotoxin (Trace levels)',
    contaminationLevel: '45 CFU/100mL (Low)',
    syntheticCorrelation: 52.3,
    predictedSpread: 'Automated ozone activated-carbon filtration active',
    outbreakStartDate: '2026-09-21',
    status: 'surveillance',
    description: 'Minor seasonal algal bloom triggered automated telemetry alert; tertiary purification keeping residential tap risk low.',
    timeline: [
      { day: 'Day 1', cases: 2, waterColiform: 10 },
      { day: 'Day 2', cases: 8, waterColiform: 25 },
      { day: 'Day 3', cases: 16, waterColiform: 38 },
      { day: 'Day 4', cases: 24, waterColiform: 48 },
      { day: 'Day 5', cases: 30, waterColiform: 44 },
      { day: 'Day 6', cases: 33, waterColiform: 42 },
      { day: 'Day 7', cases: 34, waterColiform: 45 }
    ],
    waterQuality: {
      pH: 7.3,
      turbidityNtu: 1.2,
      coliformCfu: 45,
      chlorineMgL: 0.88,
      temperatureC: 21.0,
      status: 'normal'
    }
  },
  {
    id: 'mexico-city-iztapalapa',
    name: 'Mexico City – Iztapalapa',
    city: 'Mexico City',
    country: 'Mexico',
    latitude: 19.3553,
    longitude: -99.0622,
    population: 1830000,
    severity: 'high',
    waterSource: 'Cerro de la Estrella Tanker Truck Terminal',
    syntheticCases: 167,
    hospitalized: 39,
    recovered: 102,
    newCasesLast24h: 19,
    contaminationType: 'Cryptosporidium parvum oocysts & Giardia',
    contaminationLevel: '2,650 CFU/100mL (High Hazard)',
    syntheticCorrelation: 92.1,
    predictedSpread: '+11% in neighborhoods reliant on unchlorinated tanker deliveries',
    outbreakStartDate: '2026-09-18',
    status: 'active',
    description: 'Chlorine-resistant protozoan oocysts traced to unwashed commercial distribution tanker fleet reservoirs.',
    timeline: [
      { day: 'Day 1', cases: 10, waterColiform: 190 },
      { day: 'Day 2', cases: 31, waterColiform: 580 },
      { day: 'Day 3', cases: 71, waterColiform: 1250 },
      { day: 'Day 4', cases: 112, waterColiform: 1900 },
      { day: 'Day 5', cases: 142, waterColiform: 2350 },
      { day: 'Day 6', cases: 158, waterColiform: 2550 },
      { day: 'Day 7', cases: 167, waterColiform: 2650 }
    ],
    waterQuality: {
      pH: 6.9,
      turbidityNtu: 13.5,
      coliformCfu: 2650,
      chlorineMgL: 0.45,
      temperatureC: 19.4,
      status: 'unsafe'
    }
  }
];

export const DEMO_OUTBREAKS: OutbreakData[] = DEMO_REGIONS.map(r => ({
  id: `outbreak-${r.id}`,
  regionId: r.id,
  regionName: r.name,
  waterSource: r.waterSource,
  contaminationType: r.contaminationType,
  contaminationLevel: r.contaminationLevel,
  patientCount: r.syntheticCases,
  severity: r.severity,
  detectedDate: r.outbreakStartDate,
  outbreakStartDate: r.outbreakStartDate,
  correlationScore: r.syntheticCorrelation,
  predictedSpread: r.predictedSpread,
  status: r.status,
  aiSummary: `Simulated correlation between ${r.waterSource} bacterial levels and synthetic clinical presentations (${r.syntheticCases} cases) indicates a ${r.syntheticCorrelation}% statistical alignment across regional reporting nodes.`
}));

export const DEMO_PATIENTS: PatientRecord[] = [
  {
    id: 'SYN-PAT-001',
    regionId: 'delhi-rohini',
    regionName: 'Delhi – Rohini',
    outbreakId: 'outbreak-delhi-rohini',
    ageGroup: '25-34',
    gender: 'Female',
    symptoms: ['Watery diarrhea', 'Severe abdominal cramps', 'Low-grade fever', 'Nausea'],
    severity: 'critical',
    status: 'admitted',
    reportedDate: '2026-09-23',
    waterExposure: 'Ingested untreated tap water from Sector 8 municipal line',
    primaryWaterSource: 'Well-5 Sector 8 Aquifer',
    syntheticFlag: true
  },
  {
    id: 'SYN-PAT-002',
    regionId: 'delhi-rohini',
    regionName: 'Delhi – Rohini',
    outbreakId: 'outbreak-delhi-rohini',
    ageGroup: '5-14',
    gender: 'Male',
    symptoms: ['Acute dehydration', 'Vomiting', 'Lethargy', 'Colic'],
    severity: 'critical',
    status: 'admitted',
    reportedDate: '2026-09-23',
    waterExposure: 'School water cooler supplied by local aquifer',
    primaryWaterSource: 'Well-5 Sector 8 Aquifer',
    syntheticFlag: true
  },
  {
    id: 'SYN-PAT-003',
    regionId: 'mumbai-dharavi',
    regionName: 'Mumbai – Dharavi',
    outbreakId: 'outbreak-mumbai-dharavi',
    ageGroup: '35-49',
    gender: 'Male',
    symptoms: ['Profuse watery diarrhea (rice-water)', 'Severe muscle cramps', 'Rapid pulse'],
    severity: 'high',
    status: 'admitted',
    reportedDate: '2026-09-22',
    waterExposure: 'Community tap along 90-Feet road',
    primaryWaterSource: '90-Feet Road Sub-surface Distribution Pipeline',
    syntheticFlag: true
  },
  {
    id: 'SYN-PAT-004',
    regionId: 'lagos-mainland',
    regionName: 'Lagos – Mainland',
    outbreakId: 'outbreak-lagos-mainland',
    ageGroup: '15-24',
    gender: 'Female',
    symptoms: ['Severe dehydration', 'Hypovolemic symptoms', 'Electrolyte imbalance'],
    severity: 'critical',
    status: 'admitted',
    reportedDate: '2026-09-23',
    waterExposure: 'Informal tanker bulk water purchase',
    primaryWaterSource: 'Iju Waterworks Trunk Distribution Line 4',
    syntheticFlag: true
  },
  {
    id: 'SYN-PAT-005',
    regionId: 'bangalore-whitefield',
    regionName: 'Bangalore – Whitefield',
    outbreakId: 'outbreak-bangalore-whitefield',
    ageGroup: '18-29',
    gender: 'Male',
    symptoms: ['Sustained step-ladder fever', 'Rose spots on trunk', 'Headache', 'Constipation'],
    severity: 'medium',
    status: 'recovering',
    reportedDate: '2026-09-21',
    waterExposure: 'Apartment borewell water without secondary reverse osmosis',
    primaryWaterSource: 'Varthur Borewell Network Cluster B',
    syntheticFlag: true
  },
  {
    id: 'SYN-PAT-006',
    regionId: 'mexico-city-iztapalapa',
    regionName: 'Mexico City – Iztapalapa',
    outbreakId: 'outbreak-mexico-city-iztapalapa',
    ageGroup: '30-45',
    gender: 'Female',
    symptoms: ['Persistent watery diarrhea (>10 days)', 'Malabsorption', 'Weight loss', 'Nausea'],
    severity: 'high',
    status: 'outpatient',
    reportedDate: '2026-09-22',
    waterExposure: 'Unboiled private tanker water delivery',
    primaryWaterSource: 'Cerro de la Estrella Tanker Truck Terminal',
    syntheticFlag: true
  }
];

export const DEMO_WATER_QUALITY: WaterQualityRecord[] = [
  {
    sampleId: 'WQ-DEL-2026-0924-01',
    regionId: 'delhi-rohini',
    regionName: 'Delhi – Rohini',
    sampleDate: '2026-09-24',
    sampleTime: '08:30 IST',
    pH: 6.4,
    turbidity: 18.5,
    coliformCount: 4800,
    bacteriaLevel: 'Critical Pathogen Exceedance (>48x WHO Guideline)',
    contaminationType: 'E. coli O157:H7 & Coliform isolates',
    status: 'critical',
    testedBy: 'Delhi Jal Board Mobile Lab #4 & Autonomous Spectrometry Sensor',
    notes: 'Chlorination levels below detectable limits (0.05 mg/L). Urgent booster dosage recommended.'
  },
  {
    sampleId: 'WQ-MUM-2026-0924-02',
    regionId: 'mumbai-dharavi',
    regionName: 'Mumbai – Dharavi',
    sampleDate: '2026-09-24',
    sampleTime: '09:15 IST',
    pH: 6.8,
    turbidity: 12.2,
    coliformCount: 2900,
    bacteriaLevel: 'High Biological Risk',
    contaminationType: 'Vibrio cholerae isolates',
    status: 'critical',
    testedBy: 'BMC Public Health Hydrology Unit',
    notes: 'Secondary line breach verified at junction 90-A. Pressure drop allows suction of soil fluids.'
  },
  {
    sampleId: 'WQ-LAG-2026-0924-03',
    regionId: 'lagos-mainland',
    regionName: 'Lagos – Mainland',
    sampleDate: '2026-09-24',
    sampleTime: '07:45 WAT',
    pH: 6.2,
    turbidity: 24.1,
    coliformCount: 5200,
    bacteriaLevel: 'Extreme Biological Hazard',
    contaminationType: 'Vibrio cholerae',
    status: 'critical',
    testedBy: 'Lagos State Water Corporation Lab',
    notes: 'Total chlorine neutralization detected across sub-trunk branch.'
  },
  {
    sampleId: 'WQ-BLR-2026-0923-04',
    regionId: 'bangalore-whitefield',
    regionName: 'Bangalore – Whitefield',
    sampleDate: '2026-09-23',
    sampleTime: '14:20 IST',
    pH: 7.1,
    turbidity: 6.4,
    coliformCount: 850,
    bacteriaLevel: 'Elevated Biological Risk',
    contaminationType: 'Salmonella enterica',
    status: 'alert',
    testedBy: 'KSPCB Environmental Surveillance Node',
    notes: 'Percolation gradient moving towards southern borewell perimeter.'
  }
];

export const DEMO_FHIR_RESOURCES: FhirResourceData[] = [
  {
    resourceType: 'Observation',
    resourceId: 'obs-water-sample-delhi-001',
    title: 'Water Quality Observation (E. coli / Coliform)',
    sourceSystem: 'Municipal Water SCADA IoT Telemetry',
    validationStatus: 'valid',
    validationScore: 98,
    validationNotes: [
      'Resource conforms strictly to HL7 FHIR R4 Observation specification',
      'LOINC code 58452-4 (Escherichia coli [Presence] in Water) mapped successfully',
      'ValueQuantity units (CFU/100mL) verified against UCUM dictionary'
    ],
    createdAt: '2026-09-24T08:35:00Z',
    mappingNotes: 'Raw telemetry payload transformed: sensor_id:WQ-DEL -> Observation.identifier; coliform_cfu:4800 -> Observation.valueQuantity.',
    resourceJSON: {
      resourceType: 'Observation',
      id: 'obs-water-sample-delhi-001',
      meta: {
        versionId: '1',
        lastUpdated: '2026-09-24T08:35:00Z',
        profile: ['http://hl7.org/fhir/StructureDefinition/Observation']
      },
      status: 'final',
      category: [
        {
          coding: [
            {
              system: 'http://terminology.hl7.org/CodeSystem/observation-category',
              code: 'laboratory',
              display: 'Laboratory'
            }
          ],
          text: 'Environmental / Water Quality Testing'
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
        text: 'Total Coliform & E. coli Count'
      },
      subject: {
        reference: 'Location/loc-well-5-delhi',
        display: 'Well-5 Sector 8 Aquifer, Rohini'
      },
      effectiveDateTime: '2026-09-24T08:30:00+05:30',
      valueQuantity: {
        value: 4800,
        unit: 'CFU/100mL',
        system: 'http://unitsofmeasure.org',
        code: 'CFU/100mL'
      },
      interpretation: [
        {
          coding: [
            {
              system: 'http://terminology.hl7.org/CodeSystem/v3-ObservationInterpretation',
              code: 'AA',
              display: 'Critical abnormal'
            }
          ],
          text: 'Critical bacterial exceedance (>48x WHO drinking standard)'
        }
      ],
      note: [
        {
          authorString: 'AquaSync AI Ingestion Engine',
          text: 'Standardized from municipal IoT sensor raw telemetry feed.'
        }
      ]
    }
  },
  {
    resourceType: 'Patient',
    resourceId: 'pat-syn-delhi-001',
    title: 'Synthetic Patient Demographics & Exposure',
    sourceSystem: 'Apollo Rohini Hospital EHR System (HL7 v2.5 ADT feed)',
    validationStatus: 'valid',
    validationScore: 100,
    validationNotes: [
      'FHIR R4 Patient schema validation passed with zero errors',
      'All synthetic anonymized fields conform to GDPR / HIPAA de-identification guidance',
      'Address postal code and administrative gender verified'
    ],
    createdAt: '2026-09-23T11:15:00Z',
    mappingNotes: 'HL7 v2 PID segment mapped into FHIR Patient resource. Patient name synthetically generated and marked non-identifiable.',
    resourceJSON: {
      resourceType: 'Patient',
      id: 'pat-syn-delhi-001',
      meta: {
        profile: ['http://hl7.org/fhir/StructureDefinition/Patient']
      },
      identifier: [
        {
          use: 'usual',
          system: 'http://hospital.example.org/synthetic-patient-id',
          value: 'SYN-DEL-2026-001'
        }
      ],
      active: true,
      name: [
        {
          use: 'official',
          family: 'SyntheticDemoCase',
          given: ['Case-001']
        }
      ],
      gender: 'female',
      birthDate: '1998-04-12',
      address: [
        {
          use: 'home',
          city: 'Delhi',
          state: 'Delhi',
          postalCode: '110085',
          country: 'IND'
        }
      ],
      extension: [
        {
          url: 'http://aquasync.onehealth.org/fhir/StructureDefinition/primary-water-source',
          valueString: 'Well-5 Sector 8 Aquifer'
        }
      ]
    }
  },
  {
    resourceType: 'Condition',
    resourceId: 'cond-syn-delhi-001',
    title: 'Clinical Condition: Acute Gastroenteritis / Waterborne Infection',
    sourceSystem: 'Regional Outbreak Triage Registry',
    validationStatus: 'valid',
    validationScore: 96,
    validationNotes: [
      'SNOMED CT concept 398909004 (Infection caused by Escherichia coli) mapped',
      'Subject reference pat-syn-delhi-001 validated and resolved',
      'ClinicalStatus coding conforms to HL7 condition-clinical code system'
    ],
    createdAt: '2026-09-23T11:45:00Z',
    mappingNotes: 'Clinical diagnosis text mapped to standardized SNOMED CT and ICD-10 codings.',
    resourceJSON: {
      resourceType: 'Condition',
      id: 'cond-syn-delhi-001',
      clinicalStatus: {
        coding: [
          {
            system: 'http://terminology.hl7.org/CodeSystem/condition-clinical',
            code: 'active'
          }
        ]
      },
      verificationStatus: {
        coding: [
          {
            system: 'http://terminology.hl7.org/CodeSystem/condition-ver-status',
            code: 'confirmed'
          }
        ]
      },
      category: [
        {
          coding: [
            {
              system: 'http://terminology.hl7.org/CodeSystem/condition-category',
              code: 'encounter-diagnosis'
            }
          ]
        }
      ],
      severity: {
        coding: [
          {
            system: 'http://snomed.info/sct',
            code: '24484000',
            display: 'Severe'
          }
        ]
      },
      code: {
        coding: [
          {
            system: 'http://snomed.info/sct',
            code: '398909004',
            display: 'Infection caused by Escherichia coli'
          },
          {
            system: 'http://hl7.org/fhir/sid/icd-10',
            code: 'A04.4',
            display: 'Other intestinal Escherichia coli infections'
          }
        ],
        text: 'Acute waterborne gastroenteritis secondary to bacterial contamination'
      },
      subject: {
        reference: 'Patient/pat-syn-delhi-001',
        display: 'SyntheticDemoCase Case-001'
      },
      recordedDate: '2026-09-23T11:30:00+05:30'
    }
  },
  {
    resourceType: 'Location',
    resourceId: 'loc-well-5-delhi',
    title: 'Water Source Location (Geographic Node)',
    sourceSystem: 'Municipal Geographic Information System (GIS)',
    validationStatus: 'valid',
    validationScore: 100,
    validationNotes: [
      'WGS84 geo-coordinates (28.7041, 77.1025) validated within Delhi metropolitan boundary',
      'Location type physicalType site verified'
    ],
    createdAt: '2026-09-20T00:00:00Z',
    mappingNotes: 'GIS shapefile coordinate transformed to FHIR Location.position structure.',
    resourceJSON: {
      resourceType: 'Location',
      id: 'loc-well-5-delhi',
      name: 'Well-5 Sector 8 Aquifer Pump Station',
      status: 'active',
      mode: 'instance',
      type: [
        {
          coding: [
            {
              system: 'http://terminology.hl7.org/CodeSystem/v3-EntityCode',
              code: 'WTRBND',
              display: 'Water body or drinking water source'
            }
          ]
        }
      ],
      physicalType: {
        coding: [
          {
            system: 'http://terminology.hl7.org/CodeSystem/location-physical-type',
            code: 'si',
            display: 'Site'
          }
        ]
      },
      position: {
        longitude: 77.1025,
        latitude: 28.7041,
        altitude: 216
      }
    }
  },
  {
    resourceType: 'Encounter',
    resourceId: 'enc-rohini-er-001',
    title: 'Emergency Department Triage Encounter',
    sourceSystem: 'Apollo Emergency Triage System',
    validationStatus: 'valid',
    validationScore: 95,
    validationNotes: [
      'Encounter class EMER (Emergency) conforms to ActEncounterCode',
      'Period dates formatted to ISO 8601 with timezone offset'
    ],
    createdAt: '2026-09-23T12:00:00Z',
    mappingNotes: 'Emergency room triage admission record converted into FHIR Encounter.',
    resourceJSON: {
      resourceType: 'Encounter',
      id: 'enc-rohini-er-001',
      status: 'in-progress',
      class: {
        system: 'http://terminology.hl7.org/CodeSystem/v3-ActCode',
        code: 'EMER',
        display: 'emergency'
      },
      subject: {
        reference: 'Patient/pat-syn-delhi-001'
      },
      period: {
        start: '2026-09-23T11:00:00+05:30'
      },
      reasonCode: [
        {
          coding: [
            {
              system: 'http://snomed.info/sct',
              code: '62315008',
              display: 'Diarrhea'
            }
          ]
        }
      ]
    }
  },
  {
    resourceType: 'Bundle',
    resourceId: 'bnd-delhi-onehealth-001',
    title: 'One Health Integrated Exchange Bundle',
    sourceSystem: 'AquaSync AI Interoperability Gateway',
    validationStatus: 'valid',
    validationScore: 99,
    validationNotes: [
      'Bundle type collection verified',
      'All internal fullUrl references (Patient, Observation, Condition, Location) resolve cleanly',
      'Complete One Health chain represented: Water Test -> GIS Location -> Clinical Patient -> Encounter'
    ],
    createdAt: '2026-09-24T09:00:00Z',
    mappingNotes: 'Cross-domain Bundle stitching environmental water quality observation with clinical encounters.',
    resourceJSON: {
      resourceType: 'Bundle',
      id: 'bnd-delhi-onehealth-001',
      type: 'collection',
      timestamp: '2026-09-24T09:00:00Z',
      total: 4,
      entry: [
        {
          fullUrl: 'urn:uuid:Location/loc-well-5-delhi',
          resource: { resourceType: 'Location', id: 'loc-well-5-delhi' }
        },
        {
          fullUrl: 'urn:uuid:Observation/obs-water-sample-delhi-001',
          resource: { resourceType: 'Observation', id: 'obs-water-sample-delhi-001' }
        },
        {
          fullUrl: 'urn:uuid:Patient/pat-syn-delhi-001',
          resource: { resourceType: 'Patient', id: 'pat-syn-delhi-001' }
        },
        {
          fullUrl: 'urn:uuid:Condition/cond-syn-delhi-001',
          resource: { resourceType: 'Condition', id: 'cond-syn-delhi-001' }
        }
      ]
    }
  }
];

export const DEMO_ALERTS: OneHealthAlert[] = [
  {
    id: 'ALT-2026-0901',
    title: 'CRITICAL: Severe Pathogen Spike in Well-5 Sector 8',
    regionId: 'delhi-rohini',
    regionName: 'Delhi – Rohini',
    level: 'critical',
    message: 'Coliform density reached 4,800 CFU/100mL with 247 synthetic acute cases reported. AI Correlation index 99.2% with domestic line seepage.',
    category: 'outbreak',
    timestamp: '2026-09-24T10:45:00Z',
    resolved: false,
    resolutionStatus: 'active',
    auditTrail: [
      {
        id: 'AUD-ALT-101',
        actor: 'Automated SCADA Sentinel',
        role: 'System Sentinel',
        organization: 'Delhi Jal Water Board Telemetry Unit',
        action: 'Alert Dispatched',
        timestamp: '24 Sep 2026, 10:45 IST',
        previousStatus: 'None',
        newStatus: 'Active Alert',
        notes: 'Automated telemetry trigger: Coliform > 4,000 CFU/100mL critical threshold exceeded.'
      }
    ],
    actionRequired: 'Isolate pump sector 8, dispatch emergency UV/chlorination tankers, alert district pediatric hospitals.'
  },
  {
    id: 'ALT-2026-0902',
    title: 'CRITICAL: Secondary Suction Influx in Pipeline Main',
    regionId: 'lagos-mainland',
    regionName: 'Lagos – Mainland',
    level: 'critical',
    message: 'Back-siphonage of lagoon marsh fluid into domestic drinking main. 312 synthetic cholera cases admitted across 3 clinics.',
    category: 'outbreak',
    timestamp: '2026-09-24T09:12:00Z',
    resolved: false,
    resolutionStatus: 'active',
    auditTrail: [
      {
        id: 'AUD-ALT-102',
        actor: 'Regional Surveillance Unit',
        role: 'Health Authority',
        organization: 'Ministry of Health & Epidemic Surveillance',
        action: 'Alert Dispatched',
        timestamp: '24 Sep 2026, 09:12 IST',
        previousStatus: 'None',
        newStatus: 'Active Alert',
        notes: 'Back-siphonage pressure drop wave detected across domestic drinking main.'
      }
    ],
    actionRequired: 'Pressure boost on trunk line 4, issue immediate boil-water advisory via broadcast SMS.'
  },
  {
    id: 'ALT-2026-0903',
    title: 'HIGH: Vibrio Strain Detected in 90-Feet Trunk',
    regionId: 'mumbai-dharavi',
    regionName: 'Mumbai – Dharavi',
    level: 'high',
    message: '156 synthetic hospital admissions correlated with low chlorine residual (0.12 mg/L) at sub-surface junction.',
    category: 'water_quality',
    timestamp: '2026-09-24T08:30:00Z',
    resolved: false,
    resolutionStatus: 'pending_verification',
    resolutionRequest: {
      id: 'REQ-2026-0903',
      requestedBy: 'Elena Rostova, RN',
      role: 'hospital',
      profession: 'Hospital Triage Specialist',
      organization: 'Apollo Hospital Emergency Triage',
      professionalId: 'NUR-DEL-98442',
      notes: 'Super-chlorination booster at Junction 90-A verified. Free chlorine restored to 0.52 mg/L across feeder taps. Past 12h patient intake dropped from 46 to 2 cases.',
      evidenceFileName: 'apollo_water_triage_recovery_report.pdf',
      evidenceFileSize: '1.4 MB',
      timestamp: '26 Sep 2026, 14:15 IST'
    },
    auditTrail: [
      {
        id: 'AUD-ALT-103-B',
        actor: 'Elena Rostova, RN',
        role: 'Healthcare Professional (Hospital Triage)',
        organization: 'Apollo Hospital Emergency Triage',
        action: 'Resolution Requested',
        timestamp: '26 Sep 2026, 14:15 IST',
        previousStatus: 'Active Alert',
        newStatus: 'Resolution Requested / Pending Verification',
        notes: 'Super-chlorination confirmed at Junction 90-A; official clinical clearance report attached.'
      },
      {
        id: 'AUD-ALT-103-A',
        actor: 'SCADA Telemetry System',
        role: 'System Sentinel',
        organization: 'Water Board',
        action: 'Alert Dispatched',
        timestamp: '24 Sep 2026, 08:30 IST',
        previousStatus: 'None',
        newStatus: 'Active Alert',
        notes: 'Chlorine residual dropped below 0.2 mg/L.'
      }
    ],
    actionRequired: 'Inject super-chlorination at junction 90-A, mobile ORS distribution teams activated.'
  },
  {
    id: 'ALT-2026-0904',
    title: 'WARNING: Cryptosporidium Oocysts Bypass Tanker Filters',
    regionId: 'mexico-city-iztapalapa',
    regionName: 'Mexico City – Iztapalapa',
    level: 'high',
    message: 'Chlorine-resistant protozoan cysts identified in private commercial tanker distribution fleet.',
    category: 'water_quality',
    timestamp: '2026-09-24T06:50:00Z',
    resolved: false,
    resolutionStatus: 'active',
    auditTrail: [
      {
        id: 'AUD-ALT-104',
        actor: 'Environmental Health Lab',
        role: 'Laboratory Staff',
        organization: 'Municipal Water Lab',
        action: 'Alert Dispatched',
        timestamp: '24 Sep 2026, 06:50 IST',
        previousStatus: 'None',
        newStatus: 'Active Alert',
        notes: 'Oocysts detected in optical fluorescence microscopy.'
      }
    ],
    actionRequired: 'Enforce secondary UV / micron filtration at tanker filling terminals.'
  },
  {
    id: 'ALT-2026-0905',
    title: 'INFO: FHIR R4 Bundle Validation Benchmark Completed',
    regionId: 'bangalore-whitefield',
    regionName: 'Bangalore – Whitefield',
    level: 'info',
    message: '420 IoT sensor packets mapped to FHIR Observation resources with 99.4% conformance score.',
    category: 'fhir_validation',
    timestamp: '2026-09-24T05:20:00Z',
    resolved: true,
    resolutionStatus: 'resolved',
    auditTrail: [
      {
        id: 'AUD-ALT-105-B',
        actor: 'Vikram Kulkarni',
        role: 'Field Inspector',
        organization: 'Municipal Water Inspection & Enforcement Division',
        action: 'Resolution Approved',
        timestamp: '24 Sep 2026, 06:10 IST',
        previousStatus: 'Resolution Requested / Pending Verification',
        newStatus: 'Resolved',
        notes: 'FHIR conformance logs inspected and confirmed compliant with IEEE/HL7 guidelines.'
      },
      {
        id: 'AUD-ALT-105-A',
        actor: 'System Orchestrator',
        role: 'System Sentinel',
        organization: 'AquaSync Gateway',
        action: 'Alert Dispatched',
        timestamp: '24 Sep 2026, 05:20 IST',
        previousStatus: 'None',
        newStatus: 'Active Alert',
        notes: 'Validation batch execution notice.'
      }
    ],
    actionRequired: 'Automatic replication to regional health repository.'
  }
];

export const DEMO_INTEGRATION_SYSTEMS: IntegrationSystem[] = [
  {
    id: 'sys-hospital-ehr',
    name: 'Hospital EHR Network (Epic / Cerner HL7 v2)',
    type: 'hospital_ehr',
    endpoint: 'mllp://ehr.regional-health.int:2575/fhir',
    status: 'ready_for_exchange',
    recordsProcessed: 14820,
    lastSync: '2 minutes ago',
    dataProtocol: 'HL7 v2.5.1 / FHIR R4 REST',
    fhirTarget: 'Patient, Condition, Encounter'
  },
  {
    id: 'sys-water-scada',
    name: 'Municipal Water SCADA & IoT Telemetry',
    type: 'water_scada',
    endpoint: 'mqtts://scada.water-board.gov:8883/telemetry',
    status: 'ready_for_exchange',
    recordsProcessed: 96400,
    lastSync: '30 seconds ago',
    dataProtocol: 'MQTT / Modbus over TCP -> JSON',
    fhirTarget: 'Observation (LOINC 58452-4), Device'
  },
  {
    id: 'sys-environmental-epa',
    name: 'Environmental Agency Contamination Registry',
    type: 'environmental_epa',
    endpoint: 'https://api.epa-sentinel.gov/v2/contaminants',
    status: 'validated',
    recordsProcessed: 3210,
    lastSync: '12 minutes ago',
    dataProtocol: 'OpenAPI REST / GeoJSON',
    fhirTarget: 'Location, Observation, RiskAssessment'
  },
  {
    id: 'sys-research-lab',
    name: 'University Genomic Pathogen Sequencing Lab',
    type: 'research_lab',
    endpoint: 'https://lab.genomics-health.edu/api/pathogens',
    status: 'fhir_mapped',
    recordsProcessed: 890,
    lastSync: '1 hour ago',
    dataProtocol: 'FASTA / BioJSON -> FHIR',
    fhirTarget: 'MolecularSequence, DiagnosticReport'
  },
  {
    id: 'sys-public-health',
    name: 'National Public Health Surveillance Hub',
    type: 'public_health',
    endpoint: 'https://cdc-surveillance.gov/api/v1/alerts',
    status: 'ready_for_exchange',
    recordsProcessed: 52400,
    lastSync: 'Just now',
    dataProtocol: 'FHIR Subscription / Webhooks',
    fhirTarget: 'Bundle, Flag, Communication'
  }
];

export const DEMO_USER_PROFILES: Record<string, UserProfile> = {
  admin: {
    uid: 'USR-ADMIN-01',
    email: 'admin@aquasync.onehealth.org',
    displayName: 'Dr. Sarah Vance',
    role: 'admin',
    organization: 'Global One Health Interoperability Alliance',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'
  },
  health_authority: {
    uid: 'USR-HLTH-02',
    email: 'epidemiology@who-sim.int',
    displayName: 'Dr. Rajesh Patel',
    role: 'health_authority',
    organization: 'Ministry of Health & Epidemic Surveillance',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150'
  },
  hospital: {
    uid: 'USR-HOSP-03',
    email: 'triage@rohini-med.org',
    displayName: 'Elena Rostova, RN',
    role: 'hospital',
    organization: 'Apollo Hospital Emergency Triage',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150'
  },
  water_authority: {
    uid: 'USR-WATR-04',
    email: 'scada-operations@delhijal.gov',
    displayName: 'Marcus Thorne',
    role: 'water_authority',
    organization: 'Delhi Jal Water Board Telemetry Unit',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150'
  },
  researcher: {
    uid: 'USR-RSCH-05',
    email: 'kenji.tanaka@tokyo-health.ac.jp',
    displayName: 'Prof. Kenji Tanaka',
    role: 'researcher',
    organization: 'Institute of Hydrological Microbiology',
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150'
  },
  field_inspector: {
    uid: 'USR-INSP-06',
    email: 'inspector.kulkarni@water-board.gov',
    displayName: 'Vikram Kulkarni',
    role: 'field_inspector',
    organization: 'Municipal Water Inspection & Enforcement Division',
    avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150'
  },
  citizen: {
    uid: 'USR-CITZ-07',
    email: 'citizen.observer@community.org',
    displayName: 'Pooja Sharma',
    role: 'citizen',
    organization: 'Community Water Sentinel Network',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150'
  }
};

export const DEMO_AUDIT_LOGS: AuditLogEntry[] = [
  {
    id: 'AUD-001',
    timestamp: '2026-09-24T10:52:10Z',
    actor: 'AquaSync AI Ingestion Engine',
    role: 'system',
    action: 'FHIR_MAPPING_PIPELINE',
    details: 'Transformed 247 raw hospital admission records into HL7 FHIR R4 Bundle (ID: bnd-delhi-onehealth-001)',
    status: 'success'
  },
  {
    id: 'AUD-002',
    timestamp: '2026-09-24T10:48:33Z',
    actor: 'Dr. Rajesh Patel',
    role: 'health_authority',
    action: 'ALERT_DISPATCH',
    details: 'Dispatched Level-1 Critical Alert: Well-5 Sector 8 Aquifer pathogen exceedance',
    status: 'success'
  },
  {
    id: 'AUD-003',
    timestamp: '2026-09-24T10:40:15Z',
    actor: 'Validation Agent #2',
    role: 'ai_agent',
    action: 'FHIR_SCHEMA_VALIDATION',
    details: 'Validated 6 FHIR resources against HL7 R4 schema; 0 errors, 1 optional field recommendation',
    status: 'success'
  },
  {
    id: 'AUD-004',
    timestamp: '2026-09-24T10:35:00Z',
    actor: 'Marcus Thorne',
    role: 'water_authority',
    action: 'SCADA_TELEMETRY_INGEST',
    details: 'Automated sample WQ-DEL-2026-0924-01 received via MQTT topic /delhi/rohini/well5',
    status: 'success'
  },
  {
    id: 'AUD-005',
    timestamp: '2026-09-24T10:20:10Z',
    actor: 'Health Insight Agent #3',
    role: 'ai_agent',
    action: 'CORRELATION_ANALYSIS',
    details: 'Calculated synthetic epidemiological correlation score: 99.2% between coliform curve and case onset',
    status: 'success'
  }
];
