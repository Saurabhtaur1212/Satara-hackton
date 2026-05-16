import React, { useState, useEffect, useRef } from 'react';
import DashboardLayout from '../components/DashboardLayout';

const SCHEDULE = [
  { day: 'Monday', time: '6:00 AM', duration: '45 min', zone: 'Zone A', status: 'done', water: 120 },
  { day: 'Wednesday', time: '6:00 AM', duration: '30 min', zone: 'Zone B', status: 'upcoming', water: 80 },
  { day: 'Friday', time: '5:30 AM', duration: '60 min', zone: 'Zone A+B', status: 'upcoming', water: 160 },
  { day: 'Sunday', time: '6:00 AM', duration: '45 min', zone: 'Zone C', status: 'upcoming', water: 120 },
];

const ZONES = [
  { name: 'Zone A', crop: 'Wheat', moisture: 42, optimal: 60, status: 'Needs Water', color: 'text-red-400', bg: 'border-red-800/30' },
  { name: 'Zone B', crop: 'Chickpea', moisture: 58, optimal: 55, status: 'Optimal', color: 'text-green-400', bg: 'border-green-800/30' },
  { name: 'Zone C', crop: 'Mustard', moisture: 71, optimal: 65, status: 'Over-watered', color: 'text-yellow-400', bg: 'border-yellow-800/30' },
];

const WATER_CROPS = [
  { name: 'Chickpea', icon: '🫘', water: 350, saving: '65%', rating: 5 },
  { name: 'Mustard', icon: '🌻', water: 400, saving: '60%', rating: 5 },
  { name: 'Sorghum', icon: '🌾', water: 450, saving: '55%', rating: 4 },
  { name: 'Millet', icon: '🌿', water: 300, saving: '70%', rating: 5 },
];

function WaterGauge({ value, max = 100, color = '#22c55e' }) {
  const pct = (value / max) * 100;
  const r = 36, circ = 2 * Math.PI * r;
  const offset = circ - (pct / 100) * circ;
  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width="88" height="88" className="-rotate-90">
        <circle cx="44" cy="44" r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="7" />
        <circle cx="44" cy="44" r={r} fill="none" stroke={color} strokeWidth="7"
          strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round" className="progress-ring" />
      </svg>
      <div className="absolute text-center">
        <div className="font-bold text-white text-lg leading-none">{value}%</div>
      </div>
    </div>
  );
}

function WaterChart() {
  const canvasRef = useRef();
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !window.Chart) return;
    const existing = window.Chart.getChart(canvas);
    if (existing) existing.destroy();
    new window.Chart(canvas, {
      type: 'bar',
      data: {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [
          { label: 'Used (L)', data: [120, 0, 80, 0, 160, 0, 120], backgroundColor: '#22c55e40', borderColor: '#22c55e', borderWidth: 2, borderRadius: 6 },
          { label: 'Optimal (L)', data: [110, 0, 90, 0, 150, 0, 115], backgroundColor: '#38bdf840', borderColor: '#38bdf8', borderWidth: 2, borderRadius: 6 },
        ]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { labels: { color: '#9ca3af', font: { size: 10 } } }, tooltip: { backgroundColor: '#0a1a0f' } },
        scales: {
          x: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#6b7280', font: { size: 10 } } },
          y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#6b7280', font: { size: 10 } } }
        }
      }
    });
  }, []);
  return <div className="h-44"><canvas ref={canvasRef} /></div>;
}

export default function WaterPage() {
  const [droughtRisk] = useState(38);

  return (
    <DashboardLayout title="Smart Water Management" subtitle="AI irrigation scheduling, drought prediction & water efficiency">

      {/* Top Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-5">
        {[
          { icon: '💧', label: 'Water Used Today', value: '480 L', sub: 'Across 3 zones', color: 'text-blue-400' },
          { icon: '📉', label: 'Water Saved', value: '32%', sub: 'vs last week', color: 'text-green-400' },
          { icon: '🌡️', label: 'Soil Moisture Avg', value: '57%', sub: 'Optimal: 55–65%', color: 'text-cyan-400' },
          { icon: '⚠️', label: 'Drought Risk', value: 'Medium', sub: `Score: ${droughtRisk}%`, color: 'text-yellow-400' },
        ].map(s => (
          <div key={s.label} className="glass rounded-2xl p-4 border border-green-900/30 card-hover">
            <div className="text-2xl mb-2">{s.icon}</div>
            <div className={`font-display font-bold text-xl ${s.color}`}>{s.value}</div>
            <div className="text-gray-400 text-xs">{s.label}</div>
            <div className="text-gray-600 text-xs">{s.sub}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-5">
        {/* Zone Moisture */}
        <div className="glass rounded-2xl p-5 border border-green-900/30">
          <h3 className="font-semibold text-white text-sm mb-4">🗺️ Field Zone Moisture</h3>
          <div className="space-y-4">
            {ZONES.map(z => (
              <div key={z.name} className={`glass-dark rounded-xl p-4 border ${z.bg}`}>
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <div className="text-white text-sm font-medium">{z.name} — {z.crop}</div>
                    <div className={`text-xs font-semibold ${z.color}`}>{z.status}</div>
                  </div>
                  <WaterGauge value={z.moisture} color={z.moisture < 50 ? '#ef4444' : z.moisture > 68 ? '#f59e0b' : '#22c55e'} />
                </div>
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Current: {z.moisture}%</span>
                  <span>Optimal: {z.optimal}%</span>
                </div>
                <div className="h-1.5 bg-black/40 rounded-full overflow-hidden mt-1">
                  <div className="h-full rounded-full transition-all duration-1000"
                    style={{ width: `${z.moisture}%`, background: z.moisture < 50 ? '#ef4444' : z.moisture > 68 ? '#f59e0b' : '#22c55e' }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Weekly Usage Chart */}
        <div className="lg:col-span-2 glass rounded-2xl p-5 border border-green-900/30">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-white text-sm">📊 Weekly Water Usage</h3>
            <div className="glass-green px-3 py-1 rounded-full text-green-300 text-xs border border-green-700/30">Efficiency: 68%</div>
          </div>
          <WaterChart />
          <div className="grid grid-cols-3 gap-3 mt-4">
            <div className="glass-dark rounded-xl p-3 text-center">
              <div className="text-blue-400 font-bold text-sm">480 L</div>
              <div className="text-gray-600 text-xs">This Week</div>
            </div>
            <div className="glass-dark rounded-xl p-3 text-center">
              <div className="text-green-400 font-bold text-sm">225 L</div>
              <div className="text-gray-600 text-xs">Saved</div>
            </div>
            <div className="glass-dark rounded-xl p-3 text-center">
              <div className="text-yellow-400 font-bold text-sm">Drip</div>
              <div className="text-gray-600 text-xs">Method</div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Irrigation Schedule */}
        <div className="glass rounded-2xl p-5 border border-green-900/30">
          <h3 className="font-semibold text-white text-sm mb-4">📅 AI Irrigation Schedule</h3>
          <div className="space-y-3">
            {SCHEDULE.map((s, i) => (
              <div key={i} className={`flex items-center gap-4 p-3 rounded-xl ${s.status === 'done' ? 'opacity-50' : 'hover:bg-white/5'} transition-all`}>
                <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${s.status === 'done' ? 'bg-gray-600' : 'bg-green-400 animate-pulse'}`} />
                <div className="flex-1">
                  <div className="text-white text-sm font-medium">{s.day}</div>
                  <div className="text-gray-500 text-xs">{s.time} · {s.duration} · {s.zone}</div>
                </div>
                <div className="text-right">
                  <div className="text-blue-400 text-xs font-semibold">{s.water} L</div>
                  <div className={`text-xs ${s.status === 'done' ? 'text-gray-600' : 'text-green-400'}`}>{s.status === 'done' ? '✓ Done' : '⏰ Upcoming'}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Water-Saving Crops */}
        <div className="glass rounded-2xl p-5 border border-green-900/30">
          <h3 className="font-semibold text-white text-sm mb-4">🌱 Water-Saving Crop Recommendations</h3>
          <div className="space-y-3">
            {WATER_CROPS.map((c, i) => (
              <div key={i} className="glass-dark rounded-xl p-4 flex items-center gap-4">
                <span className="text-3xl">{c.icon}</span>
                <div className="flex-1">
                  <div className="text-white text-sm font-medium">{c.name}</div>
                  <div className="text-gray-500 text-xs">{c.water} L/acre · Saves {c.saving} water</div>
                  <div className="flex gap-0.5 mt-1">
                    {Array.from({ length: 5 }).map((_, j) => (
                      <span key={j} className={`text-xs ${j < c.rating ? 'text-yellow-400' : 'text-gray-700'}`}>★</span>
                    ))}
                  </div>
                </div>
                <div className="text-green-400 text-xs font-bold">{c.saving}</div>
              </div>
            ))}
          </div>
          <div className="mt-4 glass-green rounded-xl p-3 border border-green-700/30">
            <div className="text-green-300 text-xs font-semibold mb-1">💡 AI Tip</div>
            <div className="text-gray-300 text-xs">Switch to drip irrigation to save up to 40% water. Millet & Chickpea are ideal for your soil type this season.</div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
