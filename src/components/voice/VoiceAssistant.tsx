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
  HelpCircle, 
  RefreshCw,
  MapPin,
  FileCode2,
  AlertTriangle
} from 'lucide-react';

interface VoiceMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  language?: string;
  timestamp: string;
  actionSuggestion?: string;
}

export const VoiceAssistant: React.FC = () => {
  const { regions, setCurrentSection, selectRegionAndNavigate } = useApp();
  const [selectedLanguage, setSelectedLanguage] = useState<string>('en-US');
  const [isListening, setIsListening] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [textInput, setTextInput] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [messages, setMessages] = useState<VoiceMessage[]>([
    {
      id: 'msg-welcome',
      sender: 'assistant',
      text: 'Welcome to AquaSync 3D Voice Intelligence. You can speak or ask questions in Hindi, English, Spanish, and 7 other languages about water quality observations, synthetic outbreak clusters, and FHIR interoperability.',
      language: 'English',
      timestamp: 'Just now',
      actionSuggestion: 'Ask: "दिल्ली में कितने लोग बीमार हैं?"'
    }
  ]);

  const recognitionRef = useRef<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const supportedLanguages = [
    { code: 'en-US', name: 'English', native: 'English', flag: '🇺🇸' },
    { code: 'hi-IN', name: 'Hindi', native: 'हिन्दी', flag: '🇮🇳' },
    { code: 'es-ES', name: 'Spanish', native: 'Español', flag: '🇪🇸' },
    { code: 'zh-CN', name: 'Chinese', native: '中文', flag: '🇨🇳' },
    { code: 'ar-SA', name: 'Arabic', native: 'العربية', flag: '🇸🇦' },
    { code: 'pt-BR', name: 'Portuguese', native: 'Português', flag: '🇧🇷' },
    { code: 'fr-FR', name: 'French', native: 'Français', flag: '🇫🇷' },
    { code: 'de-DE', name: 'German', native: 'Deutsch', flag: '🇩🇪' },
    { code: 'ja-JP', name: 'Japanese', native: '日本語', flag: '🇯🇵' },
    { code: 'ru-RU', name: 'Russian', native: 'Русский', flag: '🇷🇺' },
  ];

  const presetQuestions = [
    { text: 'दिल्ली में कितने लोग बीमार हैं?', lang: 'hi-IN', label: 'Hindi: Delhi Status' },
    { text: 'How many critical regions are monitored?', lang: 'en-US', label: 'Critical Regions' },
    { text: 'What is happening in Delhi?', lang: 'en-US', label: 'Delhi Situation' },
    { text: 'What is FHIR and how does it connect water data?', lang: 'en-US', label: 'FHIR Explanation' },
    { text: 'Show water contamination levels across nodes.', lang: 'en-US', label: 'Water Contamination' },
    { text: 'Which healthcare and SCADA systems are connected?', lang: 'en-US', label: 'Connected Systems' }
  ];

  // Initialize Speech Recognition if supported
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
          handleSendMessage(transcript);
        }
        setIsListening(false);
      };

      recognition.onerror = (err: any) => {
        console.warn('Speech recognition event:', err);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, [selectedLanguage]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

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
        alert('Web Speech Recognition is not supported in this browser. Please use text input below.');
      }
    }
  };

  const handleSpeakText = (text: string, langCode: string = 'en-US') => {
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

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  const handleSendMessage = async (queryText: string) => {
    if (!queryText.trim()) return;

    const userMsg: VoiceMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: queryText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setTextInput('');
    setIsLoading(true);

    try {
      const res = await api.askVoiceQuery(queryText, selectedLanguage);
      const assistantMsg: VoiceMessage = {
        id: `ast-${Date.now()}`,
        sender: 'assistant',
        text: res.data?.answer || res.answer || 'Demo intelligence query processed.',
        language: res.data?.languageDetected || 'English',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        actionSuggestion: res.data?.actionSuggestion
      };

      setMessages(prev => [...prev, assistantMsg]);

      // Automatically speak the response
      handleSpeakText(assistantMsg.text, selectedLanguage);
    } catch (err) {
      console.error(err);
      const fallbackMsg: VoiceMessage = {
        id: `ast-${Date.now()}`,
        sender: 'assistant',
        text: 'Demo simulated response: AquaSync 3D currently tracks 10 monitored municipal water regions with 247 synthetic cases in Delhi (Rohini). All data is standardized using HL7 FHIR R4.',
        language: 'English',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleActionClick = (action?: string) => {
    if (!action) return;
    if (action.includes('दिल्ली') || action.includes('Delhi') || action.includes('ग्लोब') || action.includes('Globe')) {
      selectRegionAndNavigate('delhi-rohini', 'globe');
    } else if (action.includes('FHIR')) {
      setCurrentSection('fhir');
    } else if (action.includes('अलर्ट्स') || action.includes('Alerts')) {
      setCurrentSection('alerts');
    } else if (action.includes('Water Quality') || action.includes('Lab')) {
      setCurrentSection('lab');
    } else {
      setCurrentSection('dashboard');
    }
  };

  return (
    <div className="space-y-6">
      {/* Voice Assistant Header */}
      <div className="p-6 rounded-2xl glass-panel border border-cyan-500/20 bg-slate-950/70 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded text-[10px] uppercase font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                10-Language Natural Voice Engine
              </span>
              <span className="text-xs text-slate-400">Browser Speech API + Gemini Multilingual</span>
            </div>
            <h2 className="text-2xl font-bold text-white mt-1.5 flex items-center gap-2">
              <span>Voice AI Intelligence Assistant</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl">
              Ask questions naturally in Hindi, English, Spanish, or your preferred language. The system queries connected FHIR repositories and hydrological telemetry to speak answers.
            </p>
          </div>

          {/* Language Selector */}
          <div className="flex items-center gap-2 bg-slate-900/80 p-1.5 rounded-xl border border-slate-800">
            <Languages className="w-4 h-4 text-cyan-400 ml-2" />
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs font-medium focus:outline-none"
            >
              {supportedLanguages.map(l => (
                <option key={l.code} value={l.code}>
                  {l.flag} {l.name} ({l.native})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Quick Voice Prompt Shortcuts */}
        <div className="mt-5 flex flex-wrap gap-2 text-xs">
          <span className="text-[11px] text-slate-400 py-1 flex items-center gap-1">
            <HelpCircle className="w-3.5 h-3.5 text-cyan-400" /> Instant Queries:
          </span>
          {presetQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => {
                setSelectedLanguage(q.lang);
                handleSendMessage(q.text);
              }}
              className="px-2.5 py-1 rounded-lg bg-slate-900/70 border border-slate-800 hover:border-cyan-400/50 hover:bg-slate-900 text-slate-300 text-[11px] transition-all"
            >
              {q.text}
            </button>
          ))}
        </div>
      </div>

      {/* Chat & Voice Interaction Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Visual Mic Orb & Audio Waves */}
        <div className="rounded-2xl glass-panel border border-cyan-500/20 bg-slate-950/80 p-6 flex flex-col items-center justify-center text-center shadow-xl">
          <div className="relative my-6 flex items-center justify-center">
            {/* Animated Ripples when listening or speaking */}
            {(isListening || isSpeaking) && (
              <>
                <span className="absolute w-44 h-44 rounded-full bg-cyan-500/20 animate-ping" />
                <span className="absolute w-36 h-36 rounded-full bg-cyan-400/25 animate-pulse" />
              </>
            )}

            <button
              onClick={toggleListening}
              className={`relative z-10 w-24 h-24 rounded-full flex items-center justify-center transition-all ${
                isListening
                  ? 'bg-rose-500 text-white shadow-[0_0_35px_rgba(244,63,94,0.6)] scale-105'
                  : 'bg-gradient-to-tr from-cyan-500 to-blue-600 text-slate-950 shadow-[0_0_30px_rgba(0,240,255,0.4)] hover:scale-105'
              }`}
            >
              {isListening ? (
                <MicOff className="w-10 h-10 animate-bounce" />
              ) : (
                <Mic className="w-10 h-10" />
              )}
            </button>
          </div>

          <h3 className="text-base font-bold text-white mt-2">
            {isListening ? 'Listening in ' + supportedLanguages.find(l => l.code === selectedLanguage)?.name : 'Click to Speak'}
          </h3>
          <p className="text-xs text-slate-400 mt-1 max-w-xs">
            {isListening ? 'Say your question now...' : 'Or select a quick question on the right.'}
          </p>

          {isSpeaking && (
            <div className="mt-4 flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 text-xs">
              <Volume2 className="w-4 h-4 animate-pulse" />
              <span>Speaking response...</span>
              <button onClick={stopSpeaking} className="ml-1 text-slate-400 hover:text-white">
                <VolumeX className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* Right 2 Columns: Conversation Feed & Text Input */}
        <div className="lg:col-span-2 rounded-2xl glass-panel border border-cyan-500/20 bg-slate-950/85 p-6 flex flex-col justify-between h-[520px] shadow-2xl">
          {/* Scrollable Messages Stream */}
          <div className="flex-1 overflow-y-auto space-y-3.5 pr-2">
            {messages.map((msg) => {
              const isAssistant = msg.sender === 'assistant';
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isAssistant ? 'items-start' : 'items-end'}`}
                >
                  <div
                    className={`max-w-[85%] p-4 rounded-2xl text-xs leading-relaxed ${
                      isAssistant
                        ? 'bg-slate-900/90 border border-cyan-500/20 text-slate-200'
                        : 'bg-cyan-600 text-white font-medium shadow-md'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3 text-[10px] text-slate-400 mb-1">
                      <span className="font-semibold text-cyan-300">
                        {isAssistant ? 'AquaSync Intelligence' : 'You'}
                      </span>
                      <span>{msg.timestamp}</span>
                    </div>
                    <p>{msg.text}</p>

                    {/* Action Suggestion Pill */}
                    {msg.actionSuggestion && (
                      <div className="mt-2.5 pt-2 border-t border-slate-800 flex items-center justify-between">
                        <button
                          onClick={() => handleActionClick(msg.actionSuggestion)}
                          className="px-2.5 py-1 rounded-md bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400/40 text-cyan-200 text-[11px] font-semibold flex items-center gap-1.5 transition-all"
                        >
                          <Sparkles className="w-3 h-3 text-cyan-400" />
                          <span>Action: {msg.actionSuggestion}</span>
                        </button>
                        <button
                          onClick={() => handleSpeakText(msg.text, selectedLanguage)}
                          className="text-slate-400 hover:text-cyan-300 p-1"
                          title="Replay Voice Audio"
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
            {isLoading && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-cyan-300">
                <Sparkles className="w-4 h-4 animate-spin" />
                <span>Processing natural language & querying One Health FHIR index...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Bottom Text Fallback Input Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage(textInput);
            }}
            className="pt-4 border-t border-slate-800 flex items-center gap-2"
          >
            <input
              type="text"
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              placeholder={`Ask in ${supportedLanguages.find(l => l.code === selectedLanguage)?.name} (e.g. दिल्ली में क्या हो रहा है?)...`}
              className="flex-1 px-4 py-2.5 rounded-xl bg-[#070d19] border border-slate-800 focus:border-cyan-400 text-white placeholder-slate-500 text-xs focus:outline-none transition-all"
            />
            <button
              type="submit"
              disabled={!textInput.trim() || isLoading}
              className="p-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold transition-all disabled:opacity-40"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
