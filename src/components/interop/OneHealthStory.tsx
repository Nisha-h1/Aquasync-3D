import React, { useState } from 'react';
import { 
  Droplets, 
  Activity, 
  HeartHandshake, 
  ArrowRight, 
  ShieldCheck, 
  Sparkles, 
  FileCode2, 
  Layers, 
  Users, 
  AlertTriangle,
  Building2,
  TreePine,
  CheckCircle2
} from 'lucide-react';

export const OneHealthStory: React.FC = () => {
  const [selectedPillar, setSelectedPillar] = useState<number>(0);

  const PILLARS = [
    {
      step: 1,
      name: 'Aquatic Environment',
      subtitle: 'Water Catchments & Infrastructure',
      icon: Droplets,
      color: 'border-cyan-400/40 text-cyan-300',
      badge: 'WATER SOURCE',
      details: {
        domain: 'Hydrological Systems',
        examples: 'Groundwater aquifers (Well-5), municipal distribution feeder mains, river catchments, raw storage reservoirs.',
        risks: 'Subsurface sewer line seepage, pressure drop back-siphonage, industrial runoff, monsoon flood overflow.',
        indicator: 'Raw Aquatic Catchment Integrity'
      }
    },
    {
      step: 2,
      name: 'Environmental Indicators',
      subtitle: 'Pathogen & Chemical Markers',
      icon: Layers,
      color: 'border-blue-400/40 text-blue-300',
      badge: 'ANALYTE SURVEILLANCE',
      details: {
        domain: 'Microbiological & Physical Chemistry',
        examples: 'Coliform bacteria (4,800 CFU/100mL), Turbidity (18.5 NTU), Free Chlorine (0.05 mg/L), pH (6.4).',
        risks: 'Turbidity particles shield pathogenic bacteria from UV; sub-threshold chlorine residual allows rapid microbiological multiplication.',
        indicator: 'LOINC 26887-0 / LOINC 38483-4'
      }
    },
    {
      step: 3,
      name: 'OAH-FHIR Harmonization',
      subtitle: 'The Interoperability Bridge',
      icon: FileCode2,
      color: 'border-purple-400/40 text-purple-300',
      badge: 'INTEROPERABILITY',
      details: {
        domain: 'Standardized HL7 FHIR Release 4 Profile',
        examples: 'Unifying disparate SCADA hex strings, lab culture PDFs, and clinic notes into semantic Observation, Specimen, Location, and Encounter resources.',
        risks: 'Without standardization, environmental telemetry takes 72+ hours to reach public health epidemiologists.',
        indicator: 'IEEE One Health OAH-FHIR Data Model'
      }
    },
    {
      step: 4,
      name: 'Health Indicators',
      subtitle: 'Syndromic & Clinical Signals',
      icon: Activity,
      color: 'border-amber-400/40 text-amber-300',
      badge: 'CLINICAL SYNDROMIC',
      details: {
        domain: 'Hospital Emergency Triage & Primary Care',
        examples: 'Acute watery diarrhea clusters, severe dehydration (WHO Plan C), pediatric gastroenteritis admissions, oral rehydration clinic surges.',
        risks: 'Late detection leads to rapid household secondary transmission and strain on ICU beds.',
        indicator: 'SNOMED CT 63650001 (Bacterial Enteritis)'
      }
    },
    {
      step: 5,
      name: 'Human & Community Health',
      subtitle: 'Proactive One Health Protection',
      icon: HeartHandshake,
      color: 'border-emerald-400/40 text-emerald-300',
      badge: 'ONE HEALTH IMPACT',
      details: {
        domain: 'Community Public Health Interventions',
        examples: 'Targeted boil-water notices, emergency booster chlorination at Well-5, ORS pre-positioning, pipeline isolation before clinical spread.',
        risks: 'Uncoordinated response leads to broad regional epidemics and economic disruption.',
        indicator: 'Outbreak Containment & Prevention'
      }
    }
  ];

  const current = PILLARS[selectedPillar];
  const CurrentIcon = current.icon;

  return (
    <div className="p-6 md:p-8 rounded-3xl glass-panel border border-cyan-500/20 bg-slate-950/80 shadow-2xl space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/15 border border-cyan-400/40 text-cyan-300 text-xs font-bold tracking-wide">
          <Sparkles className="w-3.5 h-3.5" />
          <span>ONE HEALTH CONCEPTUAL PARADIGM</span>
        </div>
        <h3 className="text-2xl font-black text-white tracking-tight">
          The Water → Environment → Health Interoperability Story
        </h3>
        <p className="text-xs text-slate-300 max-w-3xl leading-relaxed">
          One Health recognizes that human health is inextricably connected to the health of the aquatic environment. 
          AquaSync bridges this physical and digital gap by standardizing environmental signals into clinical health formats.
        </p>
      </div>

      {/* Stepped Horizontal Visual Progression */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {PILLARS.map((p, i) => {
          const Icon = p.icon;
          const isSelected = selectedPillar === i;

          return (
            <div
              key={p.step}
              onClick={() => setSelectedPillar(i)}
              className={`p-4 rounded-2xl border cursor-pointer transition-all duration-300 flex flex-col justify-between ${
                isSelected
                  ? 'bg-cyan-950/40 border-cyan-400 shadow-[0_0_20px_rgba(0,240,255,0.3)] scale-[1.03]'
                  : 'bg-slate-900/50 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-bold">
                    STAGE 0{p.step}
                  </span>
                  <span className={`text-[9px] font-mono font-bold ${isSelected ? 'text-cyan-300' : 'text-slate-500'}`}>
                    {p.badge}
                  </span>
                </div>

                <div className="flex items-center gap-2 my-2">
                  <div className={`p-2 rounded-xl ${isSelected ? 'bg-cyan-500 text-slate-950' : 'bg-slate-800 text-cyan-400'}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">{p.name}</h4>
                    <p className="text-[10px] text-slate-400 line-clamp-1">{p.subtitle}</p>
                  </div>
                </div>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-800 text-[10px] text-cyan-400 font-medium flex items-center justify-between">
                <span>Inspect Stage</span>
                <ArrowRight className="w-3 h-3" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Deep-Dive Inspection Card for Selected Stage */}
      <div className="p-6 rounded-2xl border border-cyan-500/30 bg-slate-900/80 shadow-xl space-y-4 animate-fade-in">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-cyan-500/20 text-cyan-300 border border-cyan-400/40">
              <CurrentIcon className="w-6 h-6 text-cyan-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-cyan-400">STAGE 0{current.step}: {current.badge}</span>
                <span className="text-slate-500">|</span>
                <span className="text-xs text-slate-400">{current.details.domain}</span>
              </div>
              <h4 className="text-xl font-bold text-white mt-0.5">{current.name} — {current.subtitle}</h4>
            </div>
          </div>

          <span className="px-3 py-1 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-purple-300">
            {current.details.indicator}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1.5">
            <span className="text-slate-400 font-bold uppercase text-[10px] block">Real-World Examples in Demo:</span>
            <p className="text-slate-200 leading-relaxed text-[11px]">{current.details.examples}</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1.5">
            <span className="text-amber-400 font-bold uppercase text-[10px] block flex items-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Consequences of Unstandardized Data:</span>
            </span>
            <p className="text-slate-200 leading-relaxed text-[11px]">{current.details.risks}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
