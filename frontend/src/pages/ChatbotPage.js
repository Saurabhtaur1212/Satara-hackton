import React, { useState, useRef, useEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { useAuth } from '../App';

const suggestions = [
  { icon:'🌾', text:'Best crop for black cotton soil in winter?' },
  { icon:'💧', text:'How much water does wheat need per week?' },
  { icon:'🐛', text:'How to treat aphids on cotton plants?' },
  { icon:'💰', text:'Current MSP for wheat and rice 2024?' },
  { icon:'🌱', text:'When should I apply urea fertilizer?' },
  { icon:'🌦️', text:'How to protect crops from heavy rain?' },
  { icon:'♻️', text:'Which crops improve soil health?' },
  { icon:'🏛️', text:'PM-KISAN scheme eligibility and benefits?' },
];

const RESPONSES = {
  wheat:  "🌾 Wheat Farming Guide:\n\n• Best sowing: November 1–25\n• Seed rate: 100–125 kg/acre\n• First irrigation: 20–25 days after sowing\n• Apply 50kg Urea + 25kg DAP at sowing\n• Expected yield: 18–22 quintals/acre\n• MSP 2024–25: ₹2,275/quintal",
  water:  "💧 Wheat Water Requirements:\n\n• Total irrigations: 4–6 times\n• Critical stages: Crown root (21d), Tillering (45d), Jointing (65d), Flowering (85d)\n• Avoid waterlogging — ensure drainage\n• Drip irrigation saves 40% water",
  aphid:  "🐛 Aphid Control on Cotton:\n\n• Spray Imidacloprid 17.8 SL @ 0.3ml/liter\n• Or Thiamethoxam 25 WG @ 0.2g/liter\n• Spray in early morning or evening\n• Repeat after 10–15 days if needed\n• Encourage natural predators (ladybirds)",
  msp:    "💰 MSP 2024–25 (Rabi Crops):\n\n• Wheat: ₹2,275/quintal\n• Barley: ₹1,735/quintal\n• Gram: ₹5,440/quintal\n• Lentil: ₹6,425/quintal\n• Mustard: ₹5,650/quintal\n\nSell at APMC mandi or PM-AASHA scheme.",
  urea:   "🧪 Urea Application Guide:\n\n• Wheat: 50kg/acre at sowing + 25kg at 21 days\n• Rice: 60kg/acre split in 3 doses\n• Apply in moist soil for best absorption\n• Avoid application before heavy rain\n• Use neem-coated urea for slow release",
  rain:   "🌧️ Crop Protection from Heavy Rain:\n\n• Ensure proper field drainage channels\n• Apply preventive fungicide (Mancozeb)\n• Avoid irrigation 3 days before rain\n• Harvest ripe crops before storm\n• Stake tall crops to prevent lodging",
  soil:   "♻️ Soil Health Improvement:\n\n• Practice crop rotation (wheat → legume)\n• Add FYM/compost: 5 tonnes/acre\n• Grow green manure crops (Dhaincha)\n• Reduce tillage to preserve microbiome\n• Test soil every 2 years",
  scheme: "🏛️ PM-KISAN Scheme:\n\n• Benefit: ₹6,000/year in 3 installments\n• Eligibility: All small & marginal farmers\n• Apply at: pmkisan.gov.in\n• Documents: Aadhaar, land records, bank account\n\nOther: PM Fasal Bima Yojana, Kisan Credit Card",
  default:"🤖 Namaste! I'm KisanGPT, your AI farming assistant!\n\nI can help you with:\n• 🌱 Crop recommendations & sowing tips\n• 🔬 Disease identification & treatment\n• 💧 Irrigation & water management\n• 💰 Market prices & MSP information\n• 🏛️ Government schemes & subsidies\n• 🧪 Fertilizer guidance\n\nAsk me anything in Hindi, Marathi, or English!",
};

function getResponse(msg) {
  const m = msg.toLowerCase();
  if (m.includes('wheat')||m.includes('गेहूं')||m.includes('गहू')) return RESPONSES.wheat;
  if (m.includes('water')||m.includes('irrigation')||m.includes('पानी')||m.includes('सिंचाई')) return RESPONSES.water;
  if (m.includes('aphid')||m.includes('pest')||m.includes('कीट')||m.includes('treat')) return RESPONSES.aphid;
  if (m.includes('msp')||m.includes('price')||m.includes('market')||m.includes('भाव')) return RESPONSES.msp;
  if (m.includes('urea')||m.includes('fertilizer')||m.includes('खाद')) return RESPONSES.urea;
  if (m.includes('rain')||m.includes('बारिश')||m.includes('पाऊस')) return RESPONSES.rain;
  if (m.includes('soil')||m.includes('मिट्टी')||m.includes('माती')||m.includes('eco')||m.includes('health')) return RESPONSES.soil;
  if (m.includes('scheme')||m.includes('kisan')||m.includes('yojana')||m.includes('योजना')) return RESPONSES.scheme;
  return RESPONSES.default;
}

function Message({ msg }) {
  const isBot = msg.role === 'bot';
  return (
    <div className={`flex gap-3 ${isBot ? '' : 'flex-row-reverse'} animate-slide-up`}>
      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm flex-shrink-0 font-bold
        ${isBot ? 'bg-brand-600 text-white' : 'bg-slate-200 text-slate-600'}`}>
        {isBot ? '🤖' : '👤'}
      </div>
      <div className={`max-w-[78%] rounded-2xl px-4 py-3 text-sm leading-relaxed
        ${isBot ? 'chat-bot text-slate-700' : 'chat-user'}`}>
        {msg.text.split('\n').map((line, i, arr) => (
          <span key={i}>{line}{i < arr.length-1 && <br/>}</span>
        ))}
        <div className={`text-xs mt-1.5 ${isBot ? 'text-slate-400' : 'text-brand-200'}`}>{msg.time}</div>
      </div>
    </div>
  );
}

export default function ChatbotPage() {
  const { lang } = useAuth();
  const [messages, setMessages] = useState([{ role:'bot', text:RESPONSES.default, time:'Now' }]);
  const [input, setInput]       = useState('');
  const [typing, setTyping]     = useState(false);
  const [listening, setListening] = useState(false);
  const [voiceSupported]        = useState(() => 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window);
  const bottomRef  = useRef();
  const recognitionRef = useRef(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior:'smooth' }); }, [messages, typing]);

  const send = (text) => {
    if (!text.trim()) return;
    const time = new Date().toLocaleTimeString('en-IN',{hour:'2-digit',minute:'2-digit'});
    setMessages(m => [...m, { role:'user', text, time }]);
    setInput(''); setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setMessages(m => [...m, { role:'bot', text:getResponse(text), time:new Date().toLocaleTimeString('en-IN',{hour:'2-digit',minute:'2-digit'}) }]);
    }, 900 + Math.random()*600);
  };

  const toggleVoice = () => {
    if (!voiceSupported) return;
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (listening) { recognitionRef.current?.stop(); setListening(false); return; }
    const r = new SR();
    r.lang = lang==='hi'?'hi-IN':lang==='mr'?'mr-IN':lang==='pa'?'pa-IN':lang==='te'?'te-IN':lang==='bn'?'bn-IN':lang==='gu'?'gu-IN':lang==='ta'?'ta-IN':lang==='kn'?'kn-IN':'en-IN';
    r.continuous = false; r.interimResults = false;
    r.onresult = e => { setInput(e.results[0][0].transcript); setListening(false); };
    r.onerror = () => setListening(false);
    r.onend   = () => setListening(false);
    recognitionRef.current = r; r.start(); setListening(true);
  };

  return (
    <DashboardLayout title="KisanGPT Voice Assistant" subtitle="AI farming assistant — speak or type in your language">
      <div className="flex flex-col lg:flex-row gap-5 h-[calc(100vh-180px)]">

        {/* Left panel */}
        <div className="lg:w-56 flex-shrink-0 space-y-4">
          <div className="card p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-brand-500 animate-pulse"/>
              <span className="text-brand-600 text-xs font-bold uppercase tracking-wider">AI Online</span>
            </div>
            <div className="font-semibold text-slate-800 text-sm mb-1">KisanGPT</div>
            <div className="text-slate-500 text-xs mb-3">Supports Hindi, Marathi, Punjabi, Telugu & 7 more languages.</div>
            {voiceSupported && (
              <button onClick={toggleVoice}
                className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all
                  ${listening ? 'bg-red-500 text-white voice-active' : 'btn-secondary'}`}>
                {listening ? <><span className="animate-ping">🎙️</span> Listening...</> : <><span>🎙️</span> Speak Now</>}
              </button>
            )}
          </div>

          <div className="card p-4">
            <div className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-3">Quick Questions</div>
            <div className="space-y-1.5">
              {suggestions.map((s,i) => (
                <button key={i} onClick={() => send(s.text)}
                  className="w-full text-left p-2.5 rounded-xl text-xs text-slate-600 hover:bg-brand-50 hover:text-brand-700 transition-colors flex items-start gap-2 border border-transparent hover:border-brand-100">
                  <span className="flex-shrink-0">{s.icon}</span>
                  <span className="line-clamp-2">{s.text}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Chat window */}
        <div className="flex-1 card flex flex-col overflow-hidden">
          {/* Header */}
          <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-brand-600 flex items-center justify-center text-xl agent-online">🤖</div>
            <div className="flex-1">
              <div className="font-semibold text-slate-800 text-sm">KisanGPT</div>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-500 animate-pulse"/>
                <span className="text-brand-600 text-xs">Online · Voice + Text</span>
              </div>
            </div>
            <div className="flex gap-2">
              <span className="badge badge-green">{lang.toUpperCase()}</span>
              {listening && <span className="badge badge-red">● Listening</span>}
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-slate-50">
            {messages.map((msg,i) => <Message key={i} msg={msg}/>)}
            {typing && (
              <div className="flex gap-3 animate-fade-in">
                <div className="w-8 h-8 rounded-full bg-brand-600 flex items-center justify-center text-sm">🤖</div>
                <div className="chat-bot px-4 py-3 flex items-center gap-1.5">
                  <div className="typing-dot"/><div className="typing-dot"/><div className="typing-dot"/>
                </div>
              </div>
            )}
            <div ref={bottomRef}/>
          </div>

          {/* Input */}
          <div className="px-5 py-4 border-t border-slate-100 bg-white">
            <div className="flex gap-2">
              {voiceSupported && (
                <button onClick={toggleVoice}
                  className={`w-11 h-11 rounded-xl border flex items-center justify-center text-lg flex-shrink-0 transition-all
                    ${listening ? 'bg-red-500 text-white border-red-500 voice-active' : 'border-slate-200 text-slate-400 hover:text-slate-700 hover:bg-slate-50'}`}>
                  🎙️
                </button>
              )}
              <input value={input} onChange={e=>setInput(e.target.value)}
                onKeyDown={e=>e.key==='Enter'&&!e.shiftKey&&send(input)}
                placeholder={listening?'Listening... speak now':'Ask about crops, diseases, weather, schemes...'}
                className="flex-1 px-4 py-2.5 text-sm rounded-xl"/>
              <button onClick={()=>send(input)} disabled={!input.trim()||typing}
                className={`btn-primary px-5 py-2.5 rounded-xl font-semibold text-sm flex-shrink-0 ${(!input.trim()||typing)?'opacity-50':''}`}>
                Send →
              </button>
            </div>
            <p className="text-slate-400 text-xs text-center mt-2">KisanGPT may make mistakes. Verify critical decisions with local experts.</p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
