import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Region, SeverityLevel } from '../../types';
import { 
  MapPin, 
  Search, 
  Filter, 
  Droplets, 
  AlertTriangle, 
  Calendar, 
  TrendingUp, 
  Activity, 
  ArrowRight,
  ShieldAlert,
  Info,
  Globe2,
  Layers
} from 'lucide-react';

export const LiveWorldMap: React.FC = () => {
  const { regions, selectedRegion, setSelectedRegion, setCurrentSection } = useApp();
  const [filterSeverity, setFilterSeverity] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [mapStyle, setMapStyle] = useState<'satellite' | 'natural'>('satellite');

  const filteredRegions = regions.filter(r => {
    const matchesSeverity = filterSeverity === 'all' || r.severity === filterSeverity;
    const matchesSearch = r.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          r.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          r.waterSource.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSeverity && matchesSearch;
  });

  // Convert lat/long to 2D Equirectangular percentage positions
  // Lat: +90 to -90 -> 0% to 100%
  // Lon: -180 to +180 -> 0% to 100%
  const getCoordinates = (lat: number, lon: number) => {
    const x = ((lon + 180) / 360) * 100;
    const y = ((90 - lat) / 180) * 100;
    return { x, y };
  };

  const getSeverityBg = (severity: SeverityLevel) => {
    switch (severity) {
      case 'critical': return 'bg-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.85)]';
      case 'high': return 'bg-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.85)]';
      case 'medium': return 'bg-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.85)]';
      default: return 'bg-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.85)]';
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner / Disclaimer */}
      <div className="p-4 rounded-xl glass-panel border border-cyan-500/25 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs shadow-xl">
        <div className="flex items-center gap-2.5 text-cyan-300">
          <Globe2 className="w-4 h-4 shrink-0 text-cyan-400" />
          <span>
            <strong>Real-World Geographical Earth Map:</strong> True satellite Earth imagery and natural continental geography monitoring 10 water sources & health nodes.
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-[11px] font-mono">
            REAL EARTH CARTOGRAPHY
          </span>
        </div>
      </div>

      {/* Control Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search region, country, or water source..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-900/80 border border-slate-700 focus:border-cyan-400 text-white placeholder-slate-500 text-xs focus:outline-none transition-all"
          />
        </div>

        {/* Filters and Layer Toggles */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Map Layer Mode */}
          <div className="flex items-center gap-1 bg-slate-900/80 p-1 rounded-xl border border-slate-800 text-xs">
            <button
              onClick={() => setMapStyle('satellite')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                mapStyle === 'satellite' ? 'bg-cyan-500/30 text-cyan-200 border border-cyan-400/40' : 'text-slate-400 hover:text-white'
              }`}
            >
              Satellite Imagery
            </button>
            <button
              onClick={() => setMapStyle('natural')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                mapStyle === 'natural' ? 'bg-cyan-500/30 text-cyan-200 border border-cyan-400/40' : 'text-slate-400 hover:text-white'
              }`}
            >
              Topographical
            </button>
          </div>

          {/* Severity Filters */}
          <div className="flex items-center gap-1 bg-slate-900/80 p-1 rounded-xl border border-slate-800 text-xs">
            <span className="text-[11px] text-slate-400 px-2 flex items-center gap-1">
              <Filter className="w-3 h-3" /> Severity:
            </span>
            {(['all', 'critical', 'high', 'medium', 'low'] as const).map(sev => (
              <button
                key={sev}
                onClick={() => setFilterSeverity(sev)}
                className={`px-2.5 py-1 rounded-lg capitalize font-medium transition-all ${
                  filterSeverity === sev
                    ? 'bg-cyan-500/30 text-cyan-200 border border-cyan-400/40'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {sev}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Map Canvas Viewport with Detailed Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Interactive Real-World Map Viewport */}
        <div className="lg:col-span-2 relative h-[540px] rounded-2xl overflow-hidden glass-panel border border-cyan-500/30 bg-[#061528] shadow-2xl p-4 flex flex-col justify-between">
          
          {/* REAL WORLD SATELLITE EARTH MAP BACKGROUND */}
          {mapStyle === 'satellite' ? (
            <div 
              className="absolute inset-0 bg-center bg-cover opacity-95 transition-opacity duration-500"
              style={{
                backgroundImage: `url('/earth-realistic-map.jpg')`,
                backgroundColor: '#0c2744'
              }}
            />
          ) : (
            /* Natural Topographical View with Real Ocean and Earth Colors */
            <div 
              className="absolute inset-0 bg-[#12385e] transition-opacity duration-500"
              style={{
                backgroundImage: `radial-gradient(ellipse at center, rgba(18, 56, 94, 0.4) 0%, rgba(8, 26, 48, 0.95) 100%), url('/earth-realistic-map.jpg')`,
                backgroundSize: 'cover',
                backgroundBlendMode: 'soft-light'
              }}
            />
          )}

          {/* Real World Geographic Lat/Lon Grid Overlay */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-25">
            {/* Equator */}
            <line x1="0" y1="50%" x2="100%" y2="50%" stroke="#00f0ff" strokeWidth="1.2" strokeDasharray="4 4" />
            {/* Tropic of Cancer (23.5° N = 36.9%) */}
            <line x1="0" y1="36.9%" x2="100%" y2="36.9%" stroke="#ffffff" strokeWidth="0.8" strokeDasharray="3 3" />
            {/* Tropic of Capricorn (23.5° S = 63.1%) */}
            <line x1="0" y1="63.1%" x2="100%" y2="63.1%" stroke="#ffffff" strokeWidth="0.8" strokeDasharray="3 3" />
            {/* Prime Meridian (0° = 50%) */}
            <line x1="50%" y1="0" x2="50%" y2="100%" stroke="#00f0ff" strokeWidth="1.2" strokeDasharray="4 4" />
          </svg>

          {/* Geographic Continents Labels */}
          <div className="absolute inset-0 pointer-events-none select-none text-[10px] font-bold tracking-widest text-slate-200/40 uppercase">
            <span className="absolute top-[28%] left-[18%]">NORTH AMERICA</span>
            <span className="absolute top-[68%] left-[28%]">SOUTH AMERICA</span>
            <span className="absolute top-[26%] left-[51%]">EUROPE</span>
            <span className="absolute top-[52%] left-[52%]">AFRICA</span>
            <span className="absolute top-[32%] left-[72%]">ASIA</span>
            <span className="absolute top-[75%] left-[82%]">AUSTRALIA</span>
            <span className="absolute top-[92%] left-[48%]">ANTARCTICA</span>
          </div>

          {/* Markers Layer */}
          <div className="absolute inset-0">
            {filteredRegions.map((region) => {
              const { x, y } = getCoordinates(region.latitude, region.longitude);
              const isSelected = selectedRegion?.id === region.id;

              return (
                <div
                  key={region.id}
                  style={{ left: `${x}%`, top: `${y}%` }}
                  onClick={() => setSelectedRegion(region)}
                  className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer group z-30"
                >
                  {/* Ping Animation Ring */}
                  <span className={`absolute -inset-2.5 rounded-full opacity-70 animate-ping ${getSeverityBg(region.severity)}`} />

                  {/* Marker Pin Dot */}
                  <div className={`relative w-4 h-4 rounded-full border-2 border-white flex items-center justify-center transition-transform group-hover:scale-125 ${getSeverityBg(region.severity)} ${isSelected ? 'scale-125 ring-4 ring-cyan-400' : ''}`}>
                    <span className="w-1.5 h-1.5 rounded-full bg-white" />
                  </div>

                  {/* Clean City Label Badge directly on map */}
                  <div className={`absolute left-1/2 -translate-x-1/2 top-4.5 whitespace-nowrap px-2 py-0.5 rounded-md bg-slate-950/90 border text-[10px] font-bold shadow-lg transition-all ${
                    isSelected ? 'border-cyan-400 text-cyan-200 scale-105' : 'border-slate-700 text-white group-hover:border-cyan-400'
                  }`}>
                    {region.city}
                  </div>

                  {/* Hover Tooltip */}
                  <div className="absolute left-1/2 -translate-x-1/2 bottom-7 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap px-3 py-1.5 rounded-lg bg-slate-950/95 border border-cyan-400/60 text-xs text-white font-medium shadow-2xl z-40">
                    <div className="font-bold flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-cyan-400" />
                      {region.name}
                    </div>
                    <div className="text-[11px] text-slate-300 mt-0.5 flex items-center gap-2">
                      <span>Cases: <strong className="text-cyan-300">{region.syntheticCases}</strong></span>
                      <span>Coliform: <strong className="text-amber-300">{region.waterQuality.coliformCfu} CFU</strong></span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Map Top Status Pill */}
          <div className="relative z-10 flex items-center gap-2 pointer-events-none">
            <div className="pointer-events-auto px-3 py-1 rounded-lg bg-slate-950/80 backdrop-blur-md border border-slate-700 text-[11px] text-slate-300">
              Equirectangular Real Satellite Projection (WGS84)
            </div>
          </div>

          {/* Map Footer Overlay Legend */}
          <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 text-[11px] text-slate-300 bg-slate-950/85 backdrop-blur-md p-2.5 rounded-xl border border-slate-800">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500" /> Critical
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-orange-500" /> High
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Medium
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" /> Low
              </span>
            </div>

            <div className="font-mono text-cyan-300">
              Showing {filteredRegions.length} of {regions.length} Monitored Nodes
            </div>
          </div>
        </div>

        {/* Selected Region Detailed Intelligence Card */}
        <div className="h-[540px] rounded-2xl glass-panel border border-cyan-500/20 bg-slate-950/85 p-6 flex flex-col justify-between overflow-y-auto">
          {selectedRegion ? (
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between">
                  <span className={`px-2.5 py-0.5 rounded text-[10px] font-extrabold uppercase border ${
                    selectedRegion.severity === 'critical' ? 'bg-rose-500/20 text-rose-400 border-rose-500/40' :
                    selectedRegion.severity === 'high' ? 'bg-orange-500/20 text-orange-400 border-orange-500/40' :
                    selectedRegion.severity === 'medium' ? 'bg-amber-500/20 text-amber-400 border-amber-500/40' :
                    'bg-cyan-500/20 text-cyan-400 border-cyan-500/40'
                  }`}>
                    {selectedRegion.severity} RISK
                  </span>
                  <span className="text-xs text-slate-400 font-mono">
                    {selectedRegion.latitude > 0 ? `${selectedRegion.latitude.toFixed(1)}°N` : `${Math.abs(selectedRegion.latitude).toFixed(1)}°S`},{' '}
                    {selectedRegion.longitude > 0 ? `${selectedRegion.longitude.toFixed(1)}°E` : `${Math.abs(selectedRegion.longitude).toFixed(1)}°W`}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-white mt-1.5">{selectedRegion.name}</h3>
                <p className="text-xs text-slate-400">{selectedRegion.country} • Simulated Population {(selectedRegion.population / 1000000).toFixed(2)}M</p>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">Synthetic Cases</span>
                  <span className="text-lg font-bold text-white block mt-0.5">{selectedRegion.syntheticCases}</span>
                  <span className="text-[9px] text-rose-400 font-mono">+{selectedRegion.newCasesLast24h} in 24h</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">Correlation Index</span>
                  <span className="text-lg font-bold text-cyan-300 block mt-0.5">{selectedRegion.syntheticCorrelation}%</span>
                  <span className="text-[9px] text-slate-400">Water to Clinical</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">Hospitalized</span>
                  <span className="text-lg font-bold text-amber-300 block mt-0.5">{selectedRegion.hospitalized}</span>
                  <span className="text-[9px] text-slate-400">{selectedRegion.recovered} Recovered</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">Coliform Density</span>
                  <span className="text-lg font-bold text-rose-400 block mt-0.5">{selectedRegion.waterQuality.coliformCfu}</span>
                  <span className="text-[9px] text-slate-400">CFU/100mL</span>
                </div>
              </div>

              {/* Water Source Specifics */}
              <div className="p-3 rounded-xl bg-slate-900/50 border border-slate-800 text-xs space-y-2">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase">Water Infrastructure:</span>
                  <strong className="text-cyan-300 font-medium text-[11px] block mt-0.5">{selectedRegion.waterSource}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase">Contaminant Strain:</span>
                  <strong className="text-rose-300 font-medium text-[11px] block mt-0.5">{selectedRegion.contaminationType}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase">Projected Spread:</span>
                  <strong className="text-amber-300 font-medium text-[11px] block mt-0.5">{selectedRegion.predictedSpread}</strong>
                </div>
              </div>

              <div className="text-[11px] text-slate-300 leading-relaxed p-3 rounded-xl bg-cyan-950/20 border border-cyan-500/20">
                <span className="text-cyan-300 font-semibold block mb-1">One Health Spatial Note:</span>
                {selectedRegion.description}
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex items-center gap-2">
                <button
                  onClick={() => setCurrentSection('globe')}
                  className="flex-1 py-2 px-3 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400/40 text-cyan-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
                >
                  <MapPin className="w-3.5 h-3.5" />
                  <span>View on 3D Earth</span>
                </button>
                <button
                  onClick={() => setCurrentSection('fhir')}
                  className="flex-1 py-2 px-3 rounded-xl bg-purple-600/30 hover:bg-purple-600/40 border border-purple-500/40 text-purple-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
                >
                  <span>Export FHIR</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400">
              <Globe2 className="w-10 h-10 text-cyan-400/50 mb-3" />
              <p className="text-sm font-semibold text-white">Select a Geographical Node</p>
              <p className="text-xs text-slate-400 mt-1">Click any pin on the real Earth map to inspect hydrological & clinical telemetry.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
