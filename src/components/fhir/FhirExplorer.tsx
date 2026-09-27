import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { DEMO_FHIR_RESOURCES } from '../../data/mockData';
import { FhirResourceData } from '../../types';
import { api } from '../../services/api';
import { 
  FileCode2, 
  CheckCircle2, 
  AlertTriangle, 
  Copy, 
  Download, 
  ArrowRight, 
  Sparkles, 
  Activity, 
  Droplets, 
  MapPin, 
  Users, 
  Share2,
  RefreshCw,
  Check,
  Layers,
  Database,
  ShieldCheck,
  Bookmark,
  BookOpen
} from 'lucide-react';

interface OahConcept {
  id: string;
  name: string;
  category: 'OAH Architecture' | 'HL7 FHIR R4 Core' | 'Terminologies & Value Sets';
  icon: any;
  color: string;
  badge: string;
  purpose: string;
  interoperabilityRole: string;
  schemaExample: any;
}

export const FhirExplorer: React.FC = () => {
  const [selectedConceptId, setSelectedConceptId] = useState<string>('obs');
  const [copied, setCopied] = useState<boolean>(false);
  const [activeFilter, setActiveFilter] = useState<string>('all');

  const OAH_CONCEPTS: OahConcept[] = [
    {
      id: 'oah_dataset',
      name: 'OAH Data Set',
      category: 'OAH Architecture',
      icon: Database,
      color: 'border-cyan-400/40 text-cyan-300',
      badge: 'HARMONIZATION CONTAINER',
      purpose: 'Represents the aggregated spatial-temporal boundary for cross-domain One Health telemetry.',
      interoperabilityRole: 'Bundles heterogeneous environmental sensor readings with regional hospital clinical signals under unified provenance and GIS geometry.',
      schemaExample: {
        resourceType: "Bundle",
        type: "collection",
        identifier: {
          system: "urn:aquasync:oah:dataset",
          value: "OAH-DS-DELHI-ROHINI-2026Q3"
        },
        meta: {
          profile: ["urn:aquasync:fhir:StructureDefinition:oah-dataset-bundle"],
          lastUpdated: "2026-09-24T08:30:00Z"
        },
        entry: [
          { fullUrl: "urn:uuid:obs-coliform-908", resource: { resourceType: "Observation", status: "final" } },
          { fullUrl: "urn:uuid:loc-well-5", resource: { resourceType: "Location", status: "active" } }
        ]
      }
    },
    {
      id: 'oah_indicator',
      name: 'OAH Indicators',
      category: 'OAH Architecture',
      icon: Layers,
      color: 'border-blue-400/40 text-blue-300',
      badge: 'CROSS-DOMAIN METRICS',
      purpose: 'Calculated composite environmental and ecological indices reflecting water source safety and vulnerability.',
      interoperabilityRole: 'Standardizes complex multi-variate water conditions (pH + Turbidity + Coliform + Residual Cl) into normalized risk tiers for clinical dashboards.',
      schemaExample: {
        indicatorId: "OAH-IND-WATER-01",
        name: "Aquatic Microbiological Outbreak Vulnerability Index",
        domain: "Environmental Microbiology",
        calculation: "(Coliform_CFU / 100) * (Turbidity_NTU / 5) * (1 / (Chlorine_Residual + 0.01))",
        currentCompositeScore: 98.4,
        riskTier: "CRITICAL_SPIKE",
        fhirMapping: "Observation.extension[oah-indicator-composite]"
      }
    },
    {
      id: 'health_indicator',
      name: 'Health Indicators',
      category: 'OAH Architecture',
      icon: Activity,
      color: 'border-rose-400/40 text-rose-300',
      badge: 'SYNDROMIC EPIDEMIOLOGY',
      purpose: 'Quantifies community syndromic signals, acute clinical presentations, and hospital triage volume.',
      interoperabilityRole: 'Converts emergency department complaint texts into standardized disease surveillance counters linked to municipal water distribution zones.',
      schemaExample: {
        indicatorId: "OAH-IND-HEALTH-02",
        name: "Acute Waterborne Enteric Infection Rate",
        clinicalOntology: "SNOMED CT 63650001 (Bacterial Enteritis)",
        monitoredCatchment: "Delhi Rohini Sector 8",
        newCasesLast24h: 18,
        activeClusterCount: 247,
        correlationConfidence: "99.2% Alignment with Well-5 pressure drop"
      }
    },
    {
      id: 'health_measure',
      name: 'Health Measures',
      category: 'OAH Architecture',
      icon: Bookmark,
      color: 'border-purple-400/40 text-purple-300',
      badge: 'PERFORMANCE MEASURE',
      purpose: 'Defines formal quantitative benchmarks and public health intervention thresholds based on IEEE/WHO guidelines.',
      interoperabilityRole: 'Automates clinical and environmental rule triggers when thresholds (e.g. Coliform > 0 CFU/100mL or Turbidity > 5 NTU) are breached.',
      schemaExample: {
        resourceType: "Measure",
        id: "measure-potable-water-safety",
        status: "active",
        scoring: { coding: [{ system: "http://terminology.hl7.org/CodeSystem/measure-scoring", code: "continuous-variable" }] },
        group: [
          {
            description: "Percentage of community tap samples compliant with WHO bacteriological standards",
            population: [{ code: { text: "Water Catchment Samples" }, count: 120 }]
          }
        ]
      }
    },
    {
      id: 'obs',
      name: 'Observation (HL7 FHIR R4)',
      category: 'HL7 FHIR R4 Core',
      icon: Droplets,
      color: 'border-cyan-400/40 text-cyan-300',
      badge: 'CORE FHIR RESOURCE',
      purpose: 'The fundamental FHIR R4 resource for clinical observations, vital signs, and water quality telemetry.',
      interoperabilityRole: 'Encapsulates analyte measurements (Coliform, pH, Chlorine), UCUM units, and LOINC codes into standard JSON-LD structures accepted by any modern EHR.',
      schemaExample: {
        resourceType: "Observation",
        id: "obs-water-coliform-908",
        status: "final",
        code: {
          coding: [{ system: "http://loinc.org", code: "26887-0", display: "Coliform in Water by Membrane filtration" }]
        },
        valueQuantity: {
          value: 4800,
          unit: "cfu/100mL",
          system: "http://unitsofmeasure.org",
          code: "[CFU]/100mL"
        },
        effectiveDateTime: "2026-09-24T08:30:00Z"
      }
    },
    {
      id: 'specimen',
      name: 'Specimen (HL7 FHIR R4)',
      category: 'HL7 FHIR R4 Core',
      icon: BookOpen,
      color: 'border-emerald-400/40 text-emerald-300',
      badge: 'CORE FHIR RESOURCE',
      purpose: 'Represents the physical water sample, clinical stool culture, or environmental swab collected for testing.',
      interoperabilityRole: 'Maintains chain-of-custody, collection timestamps, container metadata, and temperature maintenance between field sensors and hospital laboratories.',
      schemaExample: {
        resourceType: "Specimen",
        id: "spc-potable-water-908",
        status: "available",
        type: {
          coding: [{ system: "http://snomed.info/sct", code: "119318008", display: "Water specimen" }]
        },
        collection: {
          collectedDateTime: "2026-09-24T06:15:00Z",
          bodySite: { text: "Well-5 Sector 8 Aquifer Outlet Valve" }
        }
      }
    },
    {
      id: 'location',
      name: 'Location (HL7 FHIR R4)',
      category: 'HL7 FHIR R4 Core',
      icon: MapPin,
      color: 'border-amber-400/40 text-amber-300',
      badge: 'CORE FHIR RESOURCE',
      purpose: 'Defines the physical geographic catchment, water treatment plant, or clinic facility.',
      interoperabilityRole: 'Enables spatial GIS correlation by providing WGS84 latitude/longitude coordinates and water basin hierarchy to epidemiological queries.',
      schemaExample: {
        resourceType: "Location",
        id: "loc-well-5-rohini",
        status: "active",
        name: "Well-5 Sector 8 Aquifer Pumping Station",
        mode: "instance",
        position: {
          longitude: 77.1025,
          latitude: 28.7041,
          altitude: 216
        }
      }
    },
    {
      id: 'valuesets',
      name: 'Standard Value Sets & Ontologies',
      category: 'Terminologies & Value Sets',
      icon: ShieldCheck,
      color: 'border-purple-400/40 text-purple-300',
      badge: 'ONTOLOGY STANDARDS',
      purpose: 'Standard vocabularies ensuring semantic precision without linguistic ambiguity.',
      interoperabilityRole: 'Eliminates proprietary naming (e.g. "bact_lvl" or "ph_val") by requiring canonical LOINC codes, SNOMED concepts, and UCUM units.',
      schemaExample: {
        vocabularySystems: [
          { system: "LOINC (Logical Observation Identifiers Names and Codes)", code: "26887-0", term: "Coliform Bacteria Count" },
          { system: "SNOMED CT (Systematized Nomenclature of Medicine)", code: "63650001", term: "Cholera / Waterborne Enteritis" },
          { system: "UCUM (Unified Code for Units of Measure)", code: "[CFU]/100mL", term: "Colony Forming Units per 100 Milliliters" },
          { system: "HL7 v3 ObservationInterpretation", code: "HH", term: "Critically High Above Epidemic Threshold" }
        ]
      }
    }
  ];

  const currentConcept = OAH_CONCEPTS.find(c => c.id === selectedConceptId) || OAH_CONCEPTS[0];

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(currentConcept.schemaExample, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const filteredConcepts = activeFilter === 'all' 
    ? OAH_CONCEPTS 
    : OAH_CONCEPTS.filter(c => c.category === activeFilter);

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="p-6 md:p-8 rounded-3xl glass-panel-glow border border-cyan-400/30 bg-slate-950/80 shadow-2xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/15 border border-cyan-400/40 text-cyan-300 text-xs font-bold tracking-wide">
              <Sparkles className="w-3.5 h-3.5" />
              <span>IEEE ONE HEALTH DIGITAL HEALTH STANDARDS</span>
            </div>
            <h2 className="text-3xl font-black text-white tracking-tight">
              OAH-FHIR Common Data Model Explorer
            </h2>
            <p className="text-xs text-slate-300 max-w-3xl leading-relaxed">
              Explore the exact interoperability building blocks connecting environmental monitoring to clinical health systems. 
              Built on <strong>HL7® FHIR® R4</strong>, <strong>LOINC®</strong>, and <strong>SNOMED CT®</strong> standards with zero fabricated specifications.
            </p>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 bg-slate-900/90 p-1.5 rounded-2xl border border-slate-800 text-xs">
            {['all', 'OAH Architecture', 'HL7 FHIR R4 Core', 'Terminologies & Value Sets'].map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveFilter(cat)}
                className={`px-3 py-1.5 rounded-xl font-medium transition-all ${
                  activeFilter === cat
                    ? 'bg-cyan-500/30 text-cyan-200 border border-cyan-400/40'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {cat === 'all' ? 'All (8)' : cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid of Interactive Concept Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {filteredConcepts.map((concept) => {
          const Icon = concept.icon;
          const isSelected = selectedConceptId === concept.id;

          return (
            <div
              key={concept.id}
              onClick={() => setSelectedConceptId(concept.id)}
              className={`p-4 rounded-2xl border cursor-pointer transition-all duration-300 flex flex-col justify-between ${
                isSelected
                  ? 'bg-cyan-950/40 border-cyan-400 shadow-[0_0_20px_rgba(0,240,255,0.3)] scale-[1.02]'
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-bold">
                    {concept.badge}
                  </span>
                  <Icon className={`w-4 h-4 ${isSelected ? 'text-cyan-400' : 'text-slate-500'}`} />
                </div>
                <h4 className="text-sm font-bold text-white mt-1">{concept.name}</h4>
                <p className="text-[11px] text-slate-400 mt-1 line-clamp-2 leading-snug">{concept.purpose}</p>
              </div>

              <div className="mt-4 pt-2.5 border-t border-slate-800/80 text-[10px] text-cyan-400 font-medium flex items-center justify-between">
                <span>Inspect Schema</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Concept Deep-Dive Inspection Pane */}
      <div className="p-6 md:p-8 rounded-3xl glass-panel border border-cyan-500/30 bg-slate-950/85 shadow-2xl space-y-6 animate-fade-in">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                {currentConcept.category}
              </span>
              <span className="text-xs text-slate-400">IEEE One Health Harmonization Model</span>
            </div>
            <h3 className="text-2xl font-black text-white mt-1">{currentConcept.name}</h3>
          </div>

          <button
            onClick={handleCopy}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-2 transition-all shrink-0"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Schema Copied!' : 'Copy Schema JSON'}</span>
          </button>
        </div>

        {/* Purpose & Interoperability Role */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 space-y-1.5">
            <span className="text-cyan-400 font-bold uppercase text-[10px] block">Core Function & Purpose:</span>
            <p className="text-slate-200 leading-relaxed text-[11px]">{currentConcept.purpose}</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 space-y-1.5">
            <span className="text-purple-300 font-bold uppercase text-[10px] block">Interoperability Bridge Role:</span>
            <p className="text-slate-200 leading-relaxed text-[11px]">{currentConcept.interoperabilityRole}</p>
          </div>
        </div>

        {/* Structured Schema JSON Viewer */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span>Canonical JSON-LD Structure Definition Example:</span>
            <span className="text-emerald-400">HL7 FHIR R4 Compliant</span>
          </div>
          <pre className="p-5 rounded-2xl bg-slate-950 border border-slate-800 font-mono text-xs text-cyan-100 overflow-x-auto max-h-96 leading-relaxed selection:bg-cyan-500/30">
            {JSON.stringify(currentConcept.schemaExample, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
};
