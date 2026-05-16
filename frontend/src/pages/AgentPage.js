import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout';

const AGENTS = [
  { id: 'weather', icon: '🌤', name: 'Weather Agent', desc: 'Fetches real-time weather, rainfall, temperature & storm data from OpenWeather API', status: 'active', color: '#38bdf8', tasks: ['Fetch hourly forecast', 'Detect storm patterns', 'Calculate heat index', 'Issue weather alerts'], api: 'OpenWeather API', lastRun: '2 min ago' },
  { id: 'soil', icon: '🪨', name: 'Soil Analysis Agent', desc: 'Analyzes soil type, pH, nutrients, and moisture using SoilGrids API and sensor data', status: 'active', color: '#f59e0b', tasks: ['Analyze soil pH', 'Detect nutrient levels', 'Monitor moisture', 'Recommend amendments'], api: 'SoilGrids API', lastRun: '15 min ago' },
  { id: 'market', icon: '📈', name: 'Market Trend Agent', desc: 'Tracks mandi prices, demand trends, and predicts future crop prices using ML models', status: 'active', color: '#22c55e', tasks: ['Fetch mandi prices', 'Predict price trends', 'Analyze demand', 'Recommend sell time'], api: 'Agmarknet API', lastRun: '5 min ago' },
  { id: 'disease', icon: '🔬', name: 'Disease Prediction Agent', desc: 'Detects crop diseases from images using CNN model and predicts outbreak risk', status: 'active', color: '#ef4444', tasks: ['Analyze crop images', 'Detect fungal infections', 'Predict pest outbreaks', 'Recommend treatment'], api: 'TensorFlow CNN', lastRun: '1 hr ago' },
  { id: 'water', icon: '💧', name: 'Water Optimization Agent', desc: 'Schedules smart irrigation based on soil moisture, weather, and crop water needs', status: 'idle', color: '#06b6d4', tasks: ['Monitor soil moisture', 'Schedule irrigation', 'Calculate water needs', 'Detect drought risk'], api: 'IoT Sensors', lastRun: '30 min ago' },
  { id: 'profit', icon: '💰', name: 'Profit Prediction Agent', desc: 'Predicts crop profitability using market data, yield models, and input cost analysis', status: 'active', color: '#a78bfa', tasks: ['Calculate input costs', 'Predict yield', 'Estimate market price', 'Compute net profit'], api: 'ML Regression', lastRun: '10 min ago' },
  { id: 'sustain', icon: '♻️', name: 'Sustainability Agent', desc: 'Monitors carbon footprint, water usage, and recommends eco-friendly farming practices', status: 'idle', color: '#4ade80', tasks: ['Track carbon footprint', 'Monitor water usage', 'Score sustainability', 'Recommend eco crops'], api: 'Internal Model', lastRun: '2 hr ago' },
];

const DECISIONS = [
  { time: '09:15 AM', decision: 'Recommend Wheat sowing by Nov 20', agents: ['weather', 'soil', 'market'], confidence: 94 },
  { time: '09:12 AM', decision: 'Irrigate Zone A — moisture at 42%', agents: ['water', 'weather'], confidence: 98 },
  { time: '09:08 AM', decision: 'Hold wheat — price rising next 2 weeks', agents: ['market', 'profit'], confidence: 87 },
  { time: '09:01 AM', decision: 'Apply Urea before Thursday rain', agents: ['weather', 'soil'], confidence: 91 },
];

const AGENT_COLORS = { weather: '#38bdf8', soil: '#f59e0b', market: '#22c55e', disease: '#ef4444', water: '#06b6d4', profit: '#a78bfa', sustain: '#4ade80' };

function AgentNode({ agent, selected, onClick }) {
  return (
    <button onClick={onClick}
      className={`glass rounded-2xl p-4 border card-hover text-left transition-all ${selected ? 'border-opacity-100 scale-105' : 'border-green-900/30 hover:border-green-700/40'}`}
      style={{ borderColor: selected ? agent.color : undefined }}>
      <div className="flex items-start justify-between mb-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl agent-pulse"
          style={{ background: agent.color + '20', border: `1px solid ${agent.color}40` }}>
          {agent.icon}
        </div>
        <div className="flex items-center gap-1.5">
          <div className={`w-2 h-2 rounded-full ${agent.status === 'active' ? 'animate-pulse' : 'opacity-40'}`}
            style={{ background: agent.color }} />
          <span className="text-xs" style={{ color: agent.color }}>{agent.status}</span>
        </div>
      </div>
      <div className="text-white text-sm font-semibold mb-1">{agent.name}</div>
      <div className="text-gray-500 text-xs mb-2 line-clamp-2">{agent.desc}</div>
      <div className="flex items-center justify-between">
        <span className="text-gray-600 text-xs">{agent.api}</span>
        <span className="text-gray-600 text-xs">{agent.lastRun}</span>
      </div>
    </button>
  );
}

function CentralEngine({ decisions }) {
  const [tick, setTick] = useState(0);
  useEffect(() => { const t = setInterval(() => setTick(x => x + 1), 2000); return () => clearInterval(t); }, []);

  return (
    <div className="glass rounded-2xl p-6 border border-green-700/40 relative overflow-hidden">
      {/* Animated rings */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        {[1, 2, 3].map(i => (
          <div key={i} className="absolute rounded-full border border-green-500/10 animate-ping"
            style={{ width: `${i * 80}px`, height: `${i * 80}px`, animationDelay: `${i * 0.5}s`, animationDuration: '3s' }} />
        ))}
      </div>

      <div className="relative z-10 text-center mb-4">
        <div className="w-16 h-16 rounded-2xl btn-primary flex items-center justify-center text-3xl ai-glow mx-auto mb-3">🧠</div>
        <h3 className="font-display font-bold text-white text-lg">Central AI Decision Engine</h3>
        <p className="text-gray-400 text-xs mt-1">LangChain + CrewAI Multi-Agent Orchestrator</p>
        <div className="flex items-center justify-center gap-2 mt-2">
          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span className="text-green-400 text-xs font-semibold">Processing {tick % 4 + 1} agent tasks</span>
        </div>
      </div>

      <div className="space-y-2">
        <div className="text-gray-500 text-xs uppercase tracking-wider mb-2">Recent Decisions</div>
        {decisions.map((d, i) => (
          <div key={i} className="glass-dark rounded-xl p-3 flex items-start gap-3">
            <div className="w-1.5 h-1.5 rounded-full bg-green-400 mt-1.5 flex-shrink-0 animate-pulse" />
            <div className="flex-1 min-w-0">
              <div className="text-gray-200 text-xs">{d.decision}</div>
              <div className="flex items-center gap-2 mt-1">
                <div className="flex gap-1">
                  {d.agents.map(a => (
                    <span key={a} className="text-xs px-1.5 py-0.5 rounded-full" style={{ background: AGENT_COLORS[a] + '20', color: AGENT_COLORS[a] }}>
                      {AGENTS.find(ag => ag.id === a)?.icon}
                    </span>
                  ))}
                </div>
                <span className="text-gray-600 text-xs">{d.confidence}% confidence</span>
              </div>
            </div>
            <span className="text-gray-600 text-xs flex-shrink-0">{d.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function AgentPage() {
  const [selected, setSelected] = useState(null);
  const agent = AGENTS.find(a => a.id === selected);

  return (
    <DashboardLayout title="AI Agent Architecture" subtitle="Multi-agent AI system powering SmartSheti's intelligence">

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-5">
        {[
          { icon: '🤖', label: 'Active Agents', value: `${AGENTS.filter(a => a.status === 'active').length}/${AGENTS.length}`, color: 'text-green-400' },
          { icon: '⚡', label: 'Decisions Today', value: '142', color: 'text-yellow-400' },
          { icon: '🎯', label: 'Avg Confidence', value: '91.2%', color: 'text-blue-400' },
          { icon: '🔄', label: 'Agent Syncs', value: '1,840', color: 'text-purple-400' },
        ].map(s => (
          <div key={s.label} className="glass rounded-2xl p-4 border border-green-900/30">
            <div className="text-2xl mb-2">{s.icon}</div>
            <div className={`font-display font-bold text-xl ${s.color}`}>{s.value}</div>
            <div className="text-gray-400 text-xs">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Agent Grid */}
        <div className="lg:col-span-2">
          <h3 className="font-semibold text-white text-sm mb-3">🤖 AI Agent Network</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
            {AGENTS.map(a => (
              <AgentNode key={a.id} agent={a} selected={selected === a.id} onClick={() => setSelected(selected === a.id ? null : a.id)} />
            ))}
          </div>

          {/* Agent Detail */}
          {agent && (
            <div className="glass rounded-2xl p-5 border animate-fade-in" style={{ borderColor: agent.color + '60' }}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl" style={{ background: agent.color + '20' }}>{agent.icon}</div>
                <div>
                  <h4 className="font-display font-bold text-white">{agent.name}</h4>
                  <div className="text-gray-400 text-xs">{agent.api}</div>
                </div>
              </div>
              <p className="text-gray-300 text-sm mb-4">{agent.desc}</p>
              <div className="grid grid-cols-2 gap-2">
                {agent.tasks.map((task, i) => (
                  <div key={i} className="flex items-center gap-2 glass-dark rounded-lg p-2">
                    <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: agent.color }} />
                    <span className="text-gray-300 text-xs">{task}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Central Engine */}
        <div>
          <h3 className="font-semibold text-white text-sm mb-3">🧠 Decision Engine</h3>
          <CentralEngine decisions={DECISIONS} />

          {/* Tech Stack */}
          <div className="glass rounded-2xl p-5 border border-green-900/30 mt-4">
            <h4 className="font-semibold text-white text-sm mb-3">⚙️ AI Tech Stack</h4>
            <div className="space-y-2">
              {[
                { name: 'LangChain', role: 'Agent Orchestration', color: '#22c55e' },
                { name: 'CrewAI', role: 'Multi-Agent Framework', color: '#a78bfa' },
                { name: 'TensorFlow', role: 'Disease Detection CNN', color: '#ef4444' },
                { name: 'Scikit-learn', role: 'Price & Yield Prediction', color: '#f59e0b' },
                { name: 'FastAPI', role: 'Backend API Layer', color: '#38bdf8' },
                { name: 'Firebase', role: 'Real-time Database', color: '#fb923c' },
              ].map(t => (
                <div key={t.name} className="flex items-center gap-3 glass-dark rounded-lg p-2.5">
                  <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: t.color }} />
                  <span className="text-white text-xs font-semibold w-24">{t.name}</span>
                  <span className="text-gray-500 text-xs">{t.role}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
