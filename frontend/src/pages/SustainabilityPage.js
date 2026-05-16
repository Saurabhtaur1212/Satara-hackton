import React, { useEffect, useRef } from 'react';
import DashboardLayout from '../components/DashboardLayout';

const ECO_CROPS = [
  { name: 'Millet', icon: '🌿', water: 300, carbon: 'Low', score: 94, benefit: 'Drought-resistant, improves soil nitrogen' },
  { name: 'Chickpea', icon: '🫘', water: 350, carbon: 'Very Low', score: 91, benefit: 'Fixes atmospheric nitrogen, reduces fertilizer need' },
  { name: 'Sorghum', icon: '🌾', water: 450, carbon: 'Low', score: 87, benefit: 'Deep roots prevent soil erosion' },
  { name: 'Lentil', icon: '🟤', water: 280, carbon: 'Very Low', score: 89, benefit: 'Excellent nitrogen fixer, minimal pesticide need' },
];

const SOIL_TIPS = [
  { icon: '🌱', title: 'Cover Cropping', desc: 'Plant legumes between seasons to restore nitrogen and prevent erosion.', impact: '+15% soil health' },
  { icon: '♻️', title: 'Crop Rotation', desc: 'Alternate wheat with legumes every season to break pest cycles.', impact: '+20% yield' },
  { icon: '🍂', title: 'Composting', desc: 'Use crop residue as compost instead of burning. Adds organic matter.', impact: '+12% fertility' },
  { icon: '🚫', title: 'Reduce Tillage', desc: 'Minimum tillage preserves soil microbiome and reduces carbon emission.', impact: '-30% carbon' },
];

const METRICS = [
  { label: 'Carbon Footprint', value: 'Low', score: 28, icon: '🌍', color: '#22c55e', desc: 'Your farm emits 28% less CO₂ than average' },
  { label: 'Biodiversity Index', value: '72/100', score: 72, icon: '🦋', color: '#a78bfa', desc: 'Good crop diversity detected' },
  { label: 'Soil Organic Matter', value: '2.4%', score: 55, icon: '🪱', color: '#f59e0b', desc: 'Target: 3%+ for optimal health' },
  { label: 'Water Footprint', value: 'Medium', score: 48, icon: '💧', color: '#38bdf8', desc: 'Reduce by switching to drip irrigation' },
];

function SustainChart() {
  const canvasRef = useRef();
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !window.Chart) return;
    const existing = window.Chart.getChart(canvas);
    if (existing) existing.destroy();
    new window.Chart(canvas, {
      type: 'radar',
      data: {
        labels: ['Water Use', 'Soil Health', 'Biodiversity', 'Carbon', 'Profit', 'Resilience'],
        datasets: [
          { label: 'Your Farm', data: [68, 74, 72, 82, 78, 65], borderColor: '#22c55e', backgroundColor: '#22c55e20', borderWidth: 2, pointBackgroundColor: '#22c55e' },
          { label: 'Avg Farm', data: [45, 50, 48, 55, 60, 50], borderColor: '#6b7280', backgroundColor: '#6b728020', borderWidth: 1.5, pointBackgroundColor: '#6b7280' },
        ]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { labels: { color: '#9ca3af', font: { size: 10 } } } },
        scales: { r: { grid: { color: 'rgba(255,255,255,0.08)' }, ticks: { display: false }, pointLabels: { color: '#9ca3af', font: { size: 10 } }, suggestedMin: 0, suggestedMax: 100 } }
      }
    });
  }, []);
  return <div className="h-56"><canvas ref={canvasRef} /></div>;
}

export default function SustainabilityPage() {
  const sustainScore = 71;

  return (
    <DashboardLayout title="Sustainable Farming Intelligence" subtitle="Eco-friendly farming recommendations & sustainability analytics">

      {/* Hero Score */}
      <div className="glass rounded-2xl p-6 mb-5 border border-green-900/30 flex flex-col md:flex-row items-center gap-6">
        <div className="relative flex-shrink-0">
          <svg width="120" height="120" className="-rotate-90">
            <circle cx="60" cy="60" r="50" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="8" />
            <circle cx="60" cy="60" r="50" fill="none" stroke="#22c55e" strokeWidth="8"
              strokeDasharray={`${2 * Math.PI * 50}`} strokeDashoffset={`${2 * Math.PI * 50 * (1 - sustainScore / 100)}`}
              strokeLinecap="round" className="progress-ring" />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="font-display font-black text-3xl gradient-text">{sustainScore}</div>
            <div className="text-gray-400 text-xs">/ 100</div>
          </div>
        </div>
        <div className="flex-1 text-center md:text-left">
          <h2 className="font-display font-bold text-2xl text-white mb-1">Sustainability Score: <span className="gradient-text">Good</span></h2>
          <p className="text-gray-400 text-sm mb-4">Your farm is performing better than 68% of farms in your region. Implement the recommendations below to reach 85+.</p>
          <div className="flex flex-wrap gap-3 justify-center md:justify-start">
            {['♻️ Low Carbon', '💧 Water Smart', '🌱 Soil Healthy'].map(tag => (
              <span key={tag} className="glass-green px-3 py-1.5 rounded-full text-green-300 text-xs border border-green-700/30">{tag}</span>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 flex-shrink-0">
          {[{ v: '28%', l: 'Less CO₂' }, { v: '32%', l: 'Less Water' }, { v: '2.4%', l: 'Organic Matter' }, { v: '72', l: 'Biodiversity' }].map(s => (
            <div key={s.l} className="glass-dark rounded-xl p-3 text-center">
              <div className="text-green-400 font-bold text-lg">{s.v}</div>
              <div className="text-gray-500 text-xs">{s.l}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
        {/* Radar Chart */}
        <div className="glass rounded-2xl p-5 border border-green-900/30">
          <h3 className="font-semibold text-white text-sm mb-4">📊 Farm Sustainability Radar</h3>
          <SustainChart />
        </div>

        {/* Sustainability Metrics */}
        <div className="glass rounded-2xl p-5 border border-green-900/30">
          <h3 className="font-semibold text-white text-sm mb-4">📈 Key Sustainability Metrics</h3>
          <div className="space-y-4">
            {METRICS.map(m => (
              <div key={m.label}>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span>{m.icon}</span>
                    <span className="text-gray-300 text-sm">{m.label}</span>
                  </div>
                  <span className="font-bold text-sm" style={{ color: m.color }}>{m.value}</span>
                </div>
                <div className="h-2 bg-black/40 rounded-full overflow-hidden mb-1">
                  <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${m.score}%`, background: m.color }} />
                </div>
                <div className="text-gray-600 text-xs">{m.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Eco-Friendly Crops */}
      <div className="glass rounded-2xl p-5 border border-green-900/30 mb-5">
        <h3 className="font-semibold text-white text-sm mb-4">🌿 Recommended Eco-Friendly Crops</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {ECO_CROPS.map((c, i) => (
            <div key={i} className="glass-dark rounded-xl p-4 card-hover border border-green-900/20">
              <div className="text-4xl mb-3">{c.icon}</div>
              <div className="text-white font-semibold text-sm mb-1">{c.name}</div>
              <div className="flex items-center gap-2 mb-2">
                <div className="h-1.5 flex-1 bg-black/40 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-green-700 to-green-400 rounded-full" style={{ width: `${c.score}%` }} />
                </div>
                <span className="text-green-400 text-xs font-bold">{c.score}</span>
              </div>
              <div className="text-gray-500 text-xs mb-1">💧 {c.water} L/acre · Carbon: {c.carbon}</div>
              <div className="text-gray-400 text-xs">{c.benefit}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Soil Health Tips */}
      <div className="glass rounded-2xl p-5 border border-green-900/30">
        <h3 className="font-semibold text-white text-sm mb-4">🪱 Soil Health Improvement Tips</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {SOIL_TIPS.map((t, i) => (
            <div key={i} className="glass-dark rounded-xl p-4 flex items-start gap-4 card-hover">
              <span className="text-3xl flex-shrink-0">{t.icon}</span>
              <div>
                <div className="text-white font-semibold text-sm mb-1">{t.title}</div>
                <div className="text-gray-400 text-xs mb-2">{t.desc}</div>
                <span className="text-green-400 text-xs font-bold glass-green px-2 py-0.5 rounded-full border border-green-700/30">{t.impact}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
