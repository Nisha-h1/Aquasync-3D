import React, { useState } from 'react';
import { useApp, NavSection } from '../../context/AppContext';
import { 
  Globe2, 
  Map, 
  Activity, 
  Cpu, 
  FileCode2, 
  FlaskConical, 
  Mic, 
  Share2, 
  Bell, 
  ShieldCheck, 
  Settings, 
  Menu, 
  X,
  Droplets,
  ExternalLink,
  Info,
  Zap
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { 
    currentSection, 
    setCurrentSection, 
    unreadAlertsCount, 
    currentUser, 
    isAiOnline 
  } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  const navItems: { id: NavSection; label: string; icon: any; badge?: number; highlight?: boolean }[] = [
    { id: 'home', label: 'Command Center', icon: Globe2 },
    { id: 'interop-demo', label: '⭐ Interop Demo', icon: Zap, highlight: true },
    { id: 'dashboard', label: 'Dashboard', icon: Activity },
    { id: 'fhir', label: 'OAH-FHIR', icon: FileCode2 },
    { id: 'globe', label: '3D Globe', icon: Globe2 },
    { id: 'map', label: 'World Map', icon: Map },
    { id: 'lab', label: 'Ingest Lab', icon: FlaskConical },
    { id: 'agents', label: 'AI Agents', icon: Cpu },
    { id: 'voice', label: 'Voice AI', icon: Mic },
    { id: 'integration', label: 'Integration Hub', icon: Share2 },
    { id: 'alerts', label: 'Alerts', icon: Bell, badge: unreadAlertsCount },
    { id: 'transparency', label: 'Transparency', icon: Info },
    { id: 'settings', label: 'Admin / RBAC', icon: Settings },
  ];

  const handleNavClick = (section: NavSection) => {
    setCurrentSection(section);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-xl bg-[#050811]/90 border-b border-cyan-500/20 shadow-xl">
      {/* Top Telemetry Ticker Bar */}
      <div className="bg-slate-950/90 border-b border-slate-800/80 px-4 py-1 text-[11px] text-slate-400 flex items-center justify-between overflow-x-auto whitespace-nowrap">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5 text-cyan-300 font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
            AquaSync Telemetry: 10 Global Water Nodes Streaming
          </span>
          <span className="text-slate-500 hidden sm:inline">|</span>
          <span className="hidden sm:inline text-amber-300 font-mono">
            Critical Alert: Well-5 Sector 8 (Delhi) Coliform 4,800 CFU/100mL
          </span>
        </div>

        <div className="flex items-center gap-3 font-mono text-[10px]">
          <span className="text-purple-300">
            AI Engine: {isAiOnline ? 'Gemini 3.8 Flash' : 'Demo Local Synthesis'}
          </span>
          <span className="text-slate-500">|</span>
          <span className="text-emerald-400 font-semibold uppercase">
            Role: {currentUser.role}
          </span>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo & Brand */}
        <div 
          onClick={() => handleNavClick('home')} 
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="relative w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-purple-600 p-0.5 shadow-[0_0_20px_rgba(0,240,255,0.4)] group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center relative overflow-hidden">
              <Droplets className="w-5 h-5 text-cyan-400 group-hover:scale-110 transition-transform" />
            </div>
          </div>
          <div>
            <div className="text-base font-black tracking-tight text-white flex items-center gap-1.5">
              <span>AquaSync 3D</span>
              <span className="px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300 text-[10px] font-mono border border-cyan-400/40">
                WATER FLOW
              </span>
            </div>
            <div className="text-[10px] text-slate-400 tracking-wider uppercase font-semibold">
              Water Health Intelligence
            </div>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden xl:flex items-center gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`relative px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/50 shadow-[0_0_12px_rgba(0,240,255,0.25)]'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900/60'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-extrabold flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Right Action Icons & Mobile Hamburger */}
        <div className="flex items-center gap-2.5">
          {/* Quick Active Role Pill */}
          <button
            onClick={() => handleNavClick('settings')}
            className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/80 border border-slate-700 hover:border-cyan-400/50 text-slate-200 text-xs transition-all"
            title="Switch User Role & Permissions"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
            <span className="font-medium truncate max-w-[120px]">{currentUser.displayName.split(' ')[0]}</span>
            <span className="text-[10px] uppercase font-bold text-purple-300 font-mono">
              ({currentUser.role.split('_')[0]})
            </span>
          </button>

          {/* Alerts Bell Shortcut */}
          <button
            onClick={() => handleNavClick('alerts')}
            className="relative p-2 rounded-xl bg-slate-900/80 border border-slate-700 hover:border-cyan-400/50 text-slate-300 transition-all"
            title="View Real-Time Alerts"
          >
            <Bell className="w-4 h-4" />
            {unreadAlertsCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center animate-pulse">
                {unreadAlertsCount}
              </span>
            )}
          </button>

          {/* Mobile Hamburger Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="xl:hidden p-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 hover:text-white"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-slate-950/95 border-b border-cyan-500/20 px-4 pt-3 pb-6 space-y-1 animate-fade-in">
          <div className="grid grid-cols-2 gap-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`p-2.5 rounded-xl text-left text-xs font-semibold flex items-center justify-between border ${
                    isActive
                      ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400'
                      : 'bg-slate-900/50 text-slate-400 border-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Icon className="w-4 h-4 text-cyan-400" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className="px-1.5 py-0.5 rounded-full bg-rose-500 text-white text-[9px] font-bold">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
};
