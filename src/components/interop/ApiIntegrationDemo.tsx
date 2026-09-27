import React, { useState } from 'react';
import { 
  Terminal, 
  Send, 
  Copy, 
  Check, 
  ArrowRight, 
  Zap, 
  Sparkles, 
  CheckCircle2, 
  Code2, 
  FileCode2,
  Clock,
  ShieldCheck
} from 'lucide-react';

export const ApiIntegrationDemo: React.FC = () => {
  const [httpMethod] = useState<'POST'>('POST');
  const [endpointUrl] = useState<string>('/api/v1/interop/transform');
  const [authToken] = useState<string>('Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.aquasync-demo-key');
  const [sourceSystemHeader] = useState<string>('SCADA-IOT-DELHI-908');
  
  const [requestBodyText, setRequestBodyText] = useState<string>(
    JSON.stringify({
      station_id: "WQ-DEL-908",
      water_body: "Well-5 Sector 8 Aquifer",
      timestamp_iso: "2026-09-24T08:30:00Z",
      geo_lat: 28.7041,
      geo_lon: 77.1025,
      coliform_count_cfu: 4800,
      turbidity_ntu: 18.5,
      water_ph: 6.4,
      chlorine_residual_mgl: 0.05
    }, null, 2)
  );

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [responseStatus, setResponseStatus] = useState<number | null>(null);
  const [responseLatency, setResponseLatency] = useState<number | null>(null);
  const [responsePayload, setResponsePayload] = useState<any | null>(null);
  const [copiedCurl, setCopiedCurl] = useState<boolean>(false);

  const handleSendApiRequest = async () => {
    setIsLoading(true);
    setResponseStatus(null);
    setResponsePayload(null);
    const start = performance.now();

    try {
      const parsed = JSON.parse(requestBodyText);
      // Simulate real REST API call to local transformation engine
      setTimeout(() => {
        const latency = Math.round(performance.now() - start + 85);
        setResponseLatency(latency);
        setResponseStatus(201);
        setResponsePayload({
          resourceType: "Observation",
          id: `obs-api-${Date.now().toString().slice(-6)}`,
          meta: {
            profile: ["urn:aquasync:fhir:StructureDefinition:oah-water-observation"],
            lastUpdated: new Date().toISOString()
          },
          status: "final",
          code: {
            coding: [{ system: "http://loinc.org", code: "26887-0", display: "Coliform [#/volume] in Water" }]
          },
          valueQuantity: {
            value: parsed.coliform_count_cfu || 4800,
            unit: "cfu/100mL",
            system: "http://unitsofmeasure.org",
            code: "[CFU]/100mL"
          },
          interpretation: [{ text: "CRITICALLY_HIGH" }],
          extension: [
            { url: "latitude", valueDecimal: parsed.geo_lat || 28.7041 },
            { url: "longitude", valueDecimal: parsed.geo_lon || 77.1025 }
          ]
        });
        setIsLoading(false);
      }, 350);
    } catch (err: any) {
      setIsLoading(false);
      setResponseStatus(400);
      setResponsePayload({ error: "Invalid JSON Payload: " + err.message });
    }
  };

  const handleCopyCurl = () => {
    const curlCommand = `curl -X POST https://aquasync.health/api/v1/interop/transform \\
  -H "Authorization: ${authToken}" \\
  -H "Content-Type: application/json" \\
  -H "X-Source-System: ${sourceSystemHeader}" \\
  -d '${requestBodyText.replace(/\n/g, '').replace(/\s+/g, ' ')}'`;
    navigator.clipboard.writeText(curlCommand);
    setCopiedCurl(true);
    setTimeout(() => setCopiedCurl(false), 2000);
  };

  return (
    <div className="p-6 md:p-8 rounded-3xl glass-panel border border-cyan-500/20 bg-slate-950/80 shadow-2xl space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/15 border border-cyan-400/40 text-cyan-300 text-xs font-bold tracking-wide mb-2">
            <Terminal className="w-3.5 h-3.5" />
            <span>DEVELOPER & EHR INTEGRATION API DEMO</span>
          </div>
          <h3 className="text-2xl font-black text-white tracking-tight">
            RESTful Interoperability Endpoint Simulator
          </h3>
          <p className="text-xs text-slate-300">
            Simulate an external client pushing raw sensor or clinical payloads to AquaSync and receiving standard HL7 FHIR responses.
          </p>
        </div>

        {/* Demo Notice */}
        <span className="px-3 py-1 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-mono font-bold">
          SYNTHETIC DEMO API
        </span>
      </div>

      {/* Endpoint URL & Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-2xl bg-slate-900 border border-slate-800 text-xs font-mono">
        <div className="flex items-center gap-2 flex-1 overflow-hidden">
          <span className="px-2 py-1 rounded-md bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
            {httpMethod}
          </span>
          <span className="text-white font-bold truncate">{endpointUrl}</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyCurl}
            className="px-3 py-1.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-700 text-slate-300 text-[11px] flex items-center gap-1.5 transition-all"
          >
            {copiedCurl ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedCurl ? 'cURL Copied' : 'Copy cURL'}</span>
          </button>

          <button
            onClick={handleSendApiRequest}
            disabled={isLoading}
            className="px-4 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-40 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md transition-all"
          >
            <Send className="w-3.5 h-3.5 fill-slate-950" />
            <span>{isLoading ? 'Executing...' : 'Send Request'}</span>
          </button>
        </div>
      </div>

      {/* Side-by-Side Request & Response Panes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* LEFT: Request Headers & Payload */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span>Request Headers & JSON Payload</span>
            <span className="text-cyan-400">Content-Type: application/json</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5 font-mono text-[10px] text-slate-400">
            <div>Authorization: <span className="text-cyan-300">{authToken}</span></div>
            <div>X-Source-System: <span className="text-purple-300">{sourceSystemHeader}</span></div>
          </div>

          <textarea
            value={requestBodyText}
            onChange={(e) => setRequestBodyText(e.target.value)}
            spellCheck={false}
            className="w-full h-72 p-3.5 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-cyan-100 focus:border-cyan-400 focus:outline-none resize-none leading-relaxed"
          />
        </div>

        {/* RIGHT: Response Status & Standardized Output */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span>Server Response</span>
            {responseStatus && (
              <div className="flex items-center gap-2">
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  responseStatus === 201 ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-300'
                }`}>
                  HTTP {responseStatus} Created
                </span>
                <span className="text-slate-400 text-[10px] flex items-center gap-1">
                  <Clock className="w-3 h-3 text-cyan-400" />
                  {responseLatency} ms
                </span>
              </div>
            )}
          </div>

          <div className="h-88 rounded-xl bg-slate-950 border border-slate-800 p-4 font-mono text-xs text-cyan-100 overflow-y-auto leading-relaxed">
            {responsePayload ? (
              <pre className="text-[11px] text-emerald-200">
                {JSON.stringify(responsePayload, null, 2)}
              </pre>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-500 text-center">
                <Code2 className="w-8 h-8 text-cyan-400/40 mb-2" />
                <p>Click "Send Request" to test simulated REST API processing.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
