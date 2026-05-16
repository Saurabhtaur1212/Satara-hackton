import React, { useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';

const FERTILIZERS = {
  Wheat: [
    { name: 'Urea (46% N)', type: 'Nitrogen', qty: '50 kg/acre', timing: 'At sowing', icon: '🟡', priority: 'High', cost: 650 },
    { name: 'DAP (18-46-0)', type: 'Phosphorus', qty: '25 kg/acre', timing: 'At sowing', icon: '🟤', priority: 'High', cost: 1350 },
    { name: 'MOP (60% K)', type: 'Potassium', qty: '15 kg/acre', timing: 'At sowing', icon: '🔴', priority: 'Medium', cost: 480 },
    { name: 'Urea (Top dress)', type: 'Nitrogen', qty: '25 kg/acre', timing: '21 days after sowing', icon: '🟡', priority: 'High', cost: 325 },
    { name: 'Zinc Sulphate', type: 'Micronutrient', qty: '5 kg/acre', timing: 'At sowing', icon: '⚪', priority: 'Low', cost: 200 },
  ],
  Rice: [
    { name: 'Urea (46% N)', type: 'Nitrogen', qty: '60 kg/acre', timing: 'Split in 3 doses', icon: '🟡', priority: 'High', cost: 780 },
    { name: 'SSP (16% P)', type: 'Phosphorus', qty: '40 kg/acre', timing: 'At transplanting', icon: '🟤', priority: 'High', cost: 480 },
    { name: 'MOP (60% K)', type: 'Potassium', qty: '20 kg/acre', timing: 'At transplanting', icon: '🔴', priority: 'Medium', cost: 640 },
  ],
};

const SOIL_NUTRIENTS = [
  { name: 'Nitrogen (N)', level: 38, status: 'Low', color: '#ef4444', rec: 'Apply 50kg Urea/acre immediately' },
  { name: 'Phosphorus (P)', level: 62, status: 'Medium', color: '#f59e0b', rec: 'Apply 25kg DAP at sowing' },
  { name: 'Potassium (K)', level: 74, status: 'Good', color: '#22c55e', rec: 'Maintain with 15kg MOP' },
  { name: 'Zinc (Zn)', level: 28, status: 'Deficient', color: '#ef4444', rec: 'Apply 5kg Zinc Sulphate' },
  { name: 'Organic Matter', level: 55, status: 'Medium', color: '#f59e0b', rec: 'Add compost or FYM' },
];

const SCHEDULE_WEEKS = [
  { week: 'Week 0 (Sowing)', items: ['DAP 25kg/acre', 'MOP 15kg/acre', 'Urea 25kg/acre', 'Zinc Sulphate 5kg/acre'] },
  { week: 'Week 3 (CRI Stage)', items: ['Urea 25kg/acre (top dress)', 'Irrigate after application'] },
  { week: 'Week 6 (Tillering)', items: ['Urea 15kg/acre', 'Foliar spray: 2% Urea solution'] },
  { week: 'Week 10 (Jointing)', items: ['Potassium Nitrate 5kg/acre', 'Boron spray if needed'] },
];

export default function FertilizerPage() {
  const [crop, setCrop] = useState('Wheat');
  const [acres, setAcres] = useState(5);
  const fertilizers = FERTILIZERS[crop] || FERTILIZERS.Wheat;
  const totalCost = fertilizers.reduce((sum, f) => sum + f.cost * acres, 0);

  const priorityColor = { High: 'text-red-400 bg-red-900/20 border-red-800/30', Medium: 'text-yellow-400 bg-yellow-900/20 border-yellow-800/30', Low: 'text-green-400 bg-green-900/20 border-green-800/30' };

  return (
    <DashboardLayout title="Fertilizer Guidance System" subtitle="AI-powered fertilizer recommendations based on soil nutrients & crop type">

      {/* Controls */}
      <div className="glass rounded-2xl p-5 mb-5 border border-green-900/30 flex flex-wrap gap-4 items-end">
        <div>
          <label className="text-gray-400 text-xs uppercase tracking-wider mb-1.5 block">Select Crop</label>
          <div className="flex gap-2">
            {Object.keys(FERTILIZERS).map(c => (
              <button key={c} onClick={() => setCrop(c)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${crop === c ? 'btn-primary text-white' : 'glass-dark text-gray-400 hover:text-white'}`}>
                {c}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="text-gray-400 text-xs uppercase tracking-wider mb-1.5 block">Farm Size (Acres)</label>
          <input type="number" value={acres} onChange={e => setAcres(Number(e.target.value))} min="1" max="100"
            className="bg-black/30 border border-green-900/40 text-white rounded-xl px-4 py-2 text-sm w-28" />
        </div>
        <div className="glass-green px-5 py-2.5 rounded-xl border border-green-700/30">
          <div className="text-gray-400 text-xs">Estimated Total Cost</div>
          <div className="font-display font-bold text-green-400 text-lg">₹{totalCost.toLocaleString()}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-5">
        {/* Soil Nutrient Status */}
        <div className="glass rounded-2xl p-5 border border-green-900/30">
          <h3 className="font-semibold text-white text-sm mb-4">🧪 Soil Nutrient Status</h3>
          <div className="space-y-4">
            {SOIL_NUTRIENTS.map(n => (
              <div key={n.name}>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-gray-300 text-xs">{n.name}</span>
                  <span className="text-xs font-bold" style={{ color: n.color }}>{n.status}</span>
                </div>
                <div className="h-2 bg-black/40 rounded-full overflow-hidden mb-1">
                  <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${n.level}%`, background: n.color }} />
                </div>
                <div className="text-gray-600 text-xs">{n.rec}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Fertilizer Recommendations */}
        <div className="lg:col-span-2 glass rounded-2xl p-5 border border-green-900/30">
          <h3 className="font-semibold text-white text-sm mb-4">💊 Recommended Fertilizers for {crop} ({acres} acres)</h3>
          <div className="space-y-3">
            {fertilizers.map((f, i) => (
              <div key={i} className="glass-dark rounded-xl p-4 flex items-start gap-4">
                <span className="text-2xl flex-shrink-0">{f.icon}</span>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-white text-sm font-semibold">{f.name}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full border ${priorityColor[f.priority]}`}>{f.priority}</span>
                  </div>
                  <div className="text-gray-400 text-xs mb-1">Type: {f.type}</div>
                  <div className="flex gap-4 text-xs">
                    <span className="text-blue-400">📦 {f.qty} → <strong>{(parseFloat(f.qty) * acres).toFixed(0)} kg total</strong></span>
                    <span className="text-yellow-400">⏰ {f.timing}</span>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="text-green-400 font-bold text-sm">₹{(f.cost * acres).toLocaleString()}</div>
                  <div className="text-gray-600 text-xs">for {acres} acres</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Application Schedule */}
      <div className="glass rounded-2xl p-5 border border-green-900/30">
        <h3 className="font-semibold text-white text-sm mb-4">📅 Fertilizer Application Schedule — {crop}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {SCHEDULE_WEEKS.map((s, i) => (
            <div key={i} className="glass-dark rounded-xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 rounded-full btn-primary flex items-center justify-center text-white text-xs font-bold">{i + 1}</div>
                <div className="text-white text-xs font-semibold">{s.week}</div>
              </div>
              <div className="space-y-1.5">
                {s.items.map((item, j) => (
                  <div key={j} className="flex items-start gap-2">
                    <span className="text-green-400 text-xs mt-0.5">•</span>
                    <span className="text-gray-300 text-xs">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 glass-green rounded-xl p-4 border border-green-700/30">
          <div className="text-green-300 text-xs font-semibold mb-1">⚠️ Important Notes</div>
          <div className="text-gray-300 text-xs leading-relaxed">
            Always apply fertilizers in moist soil. Avoid application before heavy rain. Store fertilizers in dry, cool place. Use protective gear while handling chemicals.
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
