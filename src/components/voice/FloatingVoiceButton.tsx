import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { api } from '../../services/api';
import { 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Languages, 
  Send, 
  Sparkles, 
  X, 
  ArrowRight,
  HelpCircle,
  Maximize2
} from 'lucide-react';

export const FloatingVoiceButton: React.FC = () => {
  const { setCurrentSection, selectRegionAndNavigate } = useApp();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selectedLanguage, setSelectedLanguage] = useState<string>('hi-IN');
  const [isListening, setIsListening] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [textInput, setTextInput] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [lastResponse, setLastResponse] = useState<{
    answer: string;
    lang: string;
    action?: string;
  } | null>(null);

  const recognitionRef = useRef<any>(null);

  const languages = [
    { code: 'hi-IN', label: 'Hindi (हिन्दी)', flag: '🇮🇳' },
    { code: 'en-US', label: 'English', flag: '🇺🇸' },
    { code: 'es-ES', label: 'Spanish (Español)', flag: '🇪🇸' },
    { code: 'zh-CN', label: 'Chinese (中文)', flag: '🇨🇳' },
    { code: 'ar-SA', label: 'Arabic (العربية)', flag: '🇸🇦' },
  ];

  const quickQuestions = [
    'दिल्ली में कितने लोग बीमार हैं?',
    'How many critical regions are monitored?',
    'What is happening in Delhi?',
    'What is FHIR and water quality mapping?'
  ];

  // Initialize Speech Recognition
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = selectedLanguage;

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          handleSendQuery(transcript);
        }
        setIsListening(false);
      };

      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);

      recognitionRef.current = recognition;
    }
  }, [selectedLanguage]);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      if (recognitionRef.current) {
        recognitionRef.current.lang = selectedLanguage;
        try {
          recognitionRef.current.start();
          setIsListening(true);
        } catch (err) {
          console.error(err);
        }
      } else {
        alert('Web Speech Recognition is not supported in this browser. You can type below.');
      }
    }
  };

  const speakText = (text: string, langCode: string = 'hi-IN') => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = langCode;
      utterance.rate = 1.0;
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleSendQuery = async (queryText: string) => {
    if (!queryText.trim()) return;
    setIsLoading(true);
    setTextInput('');

    try {
      const res = await api.askVoiceQuery(queryText, selectedLanguage);
      const answer = res.data?.answer || res.answer || 'Query processed.';
      const action = res.data?.actionSuggestion;

      setLastResponse({
        answer,
        lang: res.data?.languageDetected || selectedLanguage,
        action
      });

      speakText(answer, selectedLanguage);
    } catch {
      const fallback = 'सिम्युलेटेड डेटा के अनुसार, दिल्ली (रोहिणी) क्षेत्र में 247 एक्टिव केस दर्ज हैं, जो वेल-5 सेक्टर 8 जल स्रोत से 99.2% संबंधित हैं।';
      setLastResponse({
        answer: fallback,
        lang: 'Hindi',
        action: '3D ग्लोब में दिल्ली देखें'
      });
      speakText(fallback, 'hi-IN');
    } finally {
      setIsLoading(false);
    }
  };

  const handleActionClick = (action?: string) => {
    if (!action) return;
    setIsOpen(false);
    if (action.includes('दिल्ली') || action.includes('Delhi') || action.includes('ग्लोब') || action.includes('Globe')) {
      selectRegionAndNavigate('delhi-rohini', 'globe');
    } else if (action.includes('FHIR')) {
      setCurrentSection('fhir');
    } else if (action.includes('अलर्ट्स') || action.includes('Alerts')) {
      setCurrentSection('alerts');
    } else {
      setCurrentSection('voice');
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 select-none">
      {/* Expanded Quick Voice Assistant Popover */}
      {isOpen ? (
        <div className="w-80 sm:w-96 rounded-2xl glass-panel-glow border border-cyan-400/50 bg-slate-950/95 p-5 shadow-[0_0_40px_rgba(0,240,255,0.4)] animate-fade-in flex flex-col justify-between max-h-[500px]">
          <div>
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-cyan-500/20">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-300">
                  <Mic className="w-4 h-4 animate-pulse" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                    <span>Voice Assistant</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                  </h4>
                  <span className="text-[10px] text-slate-400 font-mono">आवाज़ से पूछें • Multilingual AI</span>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => {
                    setIsOpen(false);
                    setCurrentSection('voice');
                  }}
                  title="Open Full Voice Studio"
                  className="text-slate-400 hover:text-cyan-300 p-1.5 rounded-lg hover:bg-slate-900 transition-colors"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => {
                    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
                    setIsOpen(false);
                  }}
                  className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-900 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Language Selector */}
            <div className="mt-3 flex items-center justify-between bg-slate-900/80 p-1.5 rounded-xl border border-slate-800 text-xs">
              <span className="text-[11px] text-slate-400 flex items-center gap-1">
                <Languages className="w-3 h-3 text-cyan-400" /> Language:
              </span>
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="bg-slate-950 text-white text-xs font-medium rounded-lg px-2 py-1 border border-slate-700 focus:outline-none"
              >
                {languages.map((l) => (
                  <option key={l.code} value={l.code}>
                    {l.flag} {l.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Mic Center Trigger */}
            <div className="my-4 flex flex-col items-center justify-center">
              <button
                onClick={toggleListening}
                className={`relative w-16 h-16 rounded-full flex items-center justify-center transition-all ${
                  isListening
                    ? 'bg-rose-500 text-white shadow-[0_0_30px_rgba(244,63,94,0.7)] scale-110 animate-pulse'
                    : 'bg-gradient-to-tr from-cyan-500 to-blue-600 text-slate-950 shadow-[0_0_25px_rgba(0,240,255,0.4)] hover:scale-105'
                }`}
              >
                {isListening ? (
                  <MicOff className="w-7 h-7" />
                ) : (
                  <Mic className="w-7 h-7" />
                )}
              </button>
              <span className="text-xs font-semibold text-slate-200 mt-2">
                {isListening ? 'Listening... Speak now' : 'Click microphone to speak'}
              </span>
              <span className="text-[10px] text-slate-400">Supports Hindi, English, Spanish & more</span>
            </div>

            {/* AI Speech Output Bubble */}
            {lastResponse && (
              <div className="p-3 rounded-xl bg-slate-900/90 border border-cyan-400/30 text-xs space-y-2 animate-fade-in max-h-36 overflow-y-auto">
                <div className="flex items-center justify-between text-[10px] text-cyan-300 font-semibold">
                  <span>AquaSync Response ({lastResponse.lang})</span>
                  <button 
                    onClick={() => speakText(lastResponse.answer, selectedLanguage)} 
                    className="text-slate-400 hover:text-white"
                    title="Repeat speech"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <p className="text-slate-200 leading-relaxed text-[11px]">{lastResponse.answer}</p>
                {lastResponse.action && (
                  <button
                    onClick={() => handleActionClick(lastResponse.action)}
                    className="mt-1 px-2 py-0.5 rounded bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400/40 text-cyan-200 text-[10px] font-semibold flex items-center gap-1 transition-all"
                  >
                    <Sparkles className="w-3 h-3 text-cyan-400" />
                    <span>{lastResponse.action}</span>
                  </button>
                )}
              </div>
            )}

            {/* Quick Sample Prompts */}
            {!lastResponse && (
              <div className="space-y-1.5">
                <span className="text-[10px] font-mono text-slate-500 uppercase block">Quick Questions:</span>
                <div className="flex flex-wrap gap-1">
                  {quickQuestions.map((q, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSendQuery(q)}
                      className="text-left px-2 py-1 rounded-lg bg-slate-900/80 hover:bg-slate-850 border border-slate-800 hover:border-cyan-400/40 text-[10px] text-slate-300 transition-all truncate max-w-full"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Bottom Text Fallback Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendQuery(textInput);
            }}
            className="mt-3 pt-2.5 border-t border-slate-800 flex items-center gap-1.5"
          >
            <input
              type="text"
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              placeholder="Or type your question here..."
              className="flex-1 px-3 py-1.5 rounded-lg bg-[#070d19] border border-slate-800 focus:border-cyan-400 text-white placeholder-slate-500 text-xs focus:outline-none"
            />
            <button
              type="submit"
              disabled={!textInput.trim() || isLoading}
              className="p-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold transition-all disabled:opacity-40"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      ) : (
        /* Floating Voice Assistant Trigger in Left Corner at End */
        <button
          onClick={() => setIsOpen(true)}
          className="group relative flex items-center gap-2.5 p-3 rounded-2xl glass-panel-glow border border-cyan-400/60 bg-slate-950/90 hover:border-cyan-300 shadow-[0_0_25px_rgba(0,240,255,0.4)] hover:shadow-[0_0_35px_rgba(0,240,255,0.65)] hover:scale-105 transition-all"
        >
          {/* Animated Glowing Mic Circle */}
          <div className="relative w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-slate-950 shadow-md">
            <Mic className="w-5 h-5 text-slate-950 group-hover:scale-110 transition-transform" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-cyan-300 animate-ping" />
          </div>

          <div className="pr-2 text-left">
            <div className="text-xs font-bold text-white flex items-center gap-1.5">
              <span>Voice Assistant</span>
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            </div>
            <div className="text-[10px] text-cyan-300 font-mono">
              आवाज़ से पूछें • Click to Speak
            </div>
          </div>
        </button>
      )}
    </div>
  );
};
