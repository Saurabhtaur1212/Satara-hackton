import React, { useState, useEffect, useRef } from 'react';
import DashboardLayout from '../components/DashboardLayout';

/* ── Dataset 4: Smart Irrigation Recommendations ── */
const IRRIGATION_DATA = [
  { crop:'Sugarcane', icon:'🌾', soilType:'Black',      waterNeed:'Very High', method:'Drip Irrigation',      dailyLiters:6000, saving:'35%', rating:5, color:'#22c55e' },
  { crop:'Soybean',   icon:'🫘', soilType:'Black',      waterNeed:'Medium',    method:'Sprinkler Irrigation', dailyLiters:2500, saving:'55%', rating:5, color:'#22c55e' },
  { crop:'Rice',      icon:'🍚', soilType:'Clayey',     waterNeed:'High',      method:'Flood Irrigation',     dailyLiters:5000, saving:'20%', rating:3, color:'#f59e0b' },
  { crop:'Tomato',    icon:'🍅', soilType:'Sandy Loam', waterNeed:'High',      method:'Drip Irrigation',      dailyLiters:4200, saving:'40%', rating:5, color:'#22c55e' },
  { crop:'Wheat',     icon:'🌾', soilType:'Loamy',      waterNeed:'Medium',    method:'Sprinkler Irrigation', dailyLiters:3100, saving:'45%', rating:4, color:'#22c55e' },
];

const ZONES = [
  { name:'Zone A', crop:'Sugarcane', moisture:38, optimal:65, status:'Needs Water',  colorHex:'#ef4444' },
  { name:'Zone B', crop:'Soybean',   moisture:60, optimal:58, status:'Optimal',      colorHex:'#22c55e' },
  { name:'Zone C', crop:'Tomato',    moisture:72, optimal:65, status:'Over-watered', colorHex:'#f59e0b' },
  { name:'Zone D', crop:'Wheat',     moisture:50, optimal:55, status:'Slightly Low', colorHex:'#f59e0b' },
];

const SCHEDULE = [
  { day:'Monday',    time:'5:30 AM', duration:'60 min', zone:'Zone A (Sugarcane)', status:'done',     water:180 },
  { day:'Wednesday', time:'6:00 AM', duration:'45 min', zone:'Zone B (Soybean)',   status:'upcoming', water:120 },
  { day:'Friday',    time:'5:30 AM', duration:'75 min', zone:'Zone A+C',           status:'upcoming', water:220 },
  { day:'Sunday',    time:'6:00 AM', duration:'50 min', zone:'Zone D (Wheat)',     status:'upcoming', water:140 },
];

function WaterGauge({ value, color }) {
  const r = 36, circ = 2 * Math.PI * r;
  const offset = circ - (value / 100) * circ;
  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width="88" height="88" className="-rotate-90">
        <circle cx="44" cy="44" r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="7"/>
        <circle cx="44" cy="44" r={r} fill="none" stroke={color} strokeWidth="7"
          strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round" className="progress-ring"/>
      </svg>
      <div className="absolute text-center">
        <div className="font-bold text-lg leading-none" style={{color:'var(--text-1)'}}>{value}%</div>
      </div>
    </div>
  );
}

function WaterChart() {
  const ref = useRef();
  useEffect(() => {
    const c = ref.current; if (!c || !window.Chart) return;
    const ex = window.Chart.getChart(c); if (ex) ex.destroy();
    new window.Chart(c, {
      type:'bar',
      data:{
        labels:['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],
        datasets:[
          { label:'Used (L)',    data:[180,0,120,0,220,0,140], backgroundColor:'#22c55e40', borderColor:'#22c55e', borderWidth:2, borderRadius:6 },
          { label:'Optimal (L)', data:[170,0,130,0,210,0,135], backgroundColor:'#3b82f640', borderColor:'#3b82f6', borderWidth:2, borderRadius:6 },
        ]
      },
      options:{
        responsive:true, maintainAspectRatio:false,
        plugins:{ legend:{ labels:{ color:'rgba(255,255,255,0.5)', font:{ size:10 } } }, tooltip:{ backgroundColor:'#0d2010' } },
        scales:{
          x:{ grid:{ color:'rgba(255,255,255,0.05)' }, ticks:{ color:'rgba(255,255,255,0.4)', font:{ size:10 } } },
          y:{ grid:{ color:'rgba(255,255,255,0.05)' }, ticks:{ color:'rgba(255,255,255,0.4)', font:{ size:10 } } }
        }
      }
    });
  }, []);
  return <div className="h-44"><canvas ref={ref}/></div>;
}

export default function WaterPage() {
  const [selectedCrop, setSelectedCrop] = useState(0);
  const irr = IRRIGATION_DATA[selectedCrop];

  return (
    <DashboardLayout title="Smart Irrigation Management" subtitle="AI irrigation scheduling based on crop water needs & soil conditions">

      {/* Top Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-5">
        {[
          { icon:'💧', label:'Water Used Today',  value:'660 L',  sub:'Across 4 zones',    color:'#60a5fa' },
          { icon:'📉', label:'Water Saved',        value:'38%',    sub:'vs flood method',   color:'#4ade80' },
          { icon:'🌡️', label:'Soil Moisture Avg', value:'55%',    sub:'Optimal: 55–65%',   color:'#06b6d4' },
          { icon:'⚠️', label:'Drought Risk',       value:'Medium', sub:'Score: 42%',        color:'#fbbf24' },
        ].map(s=>(
          <div key={s.label} className="card p-4 hover-lift">
            <div className="text-2xl mb-2">{s.icon}</div>
            <div className="font-display font-bold text-xl" style={{color:s.color}}>{s.value}</div>
            <div className="text-xs" style={{color:'var(--text-1)'}}>{s.label}</div>
            <div className="text-xs" style={{color:'var(--text-3)'}}>{s.sub}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-5">
        {/* Zone Moisture */}
        <div className="card p-5">
          <h3 className="font-semibold text-sm mb-4" style={{color:'var(--text-1)'}}>🗺️ Field Zone Moisture</h3>
          <div className="space-y-4">
            {ZONES.map(z=>(
              <div key={z.name} className="card-flat rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <div className="text-sm font-medium" style={{color:'var(--text-1)'}}>{z.name} — {z.crop}</div>
                    <div className="text-xs font-semibold" style={{color:z.colorHex}}>{z.status}</div>
                  </div>
                  <WaterGauge value={z.moisture} color={z.colorHex}/>
                </div>
                <div className="flex justify-between text-xs mb-1" style={{color:'var(--text-3)'}}>
                  <span>Current: {z.moisture}%</span><span>Optimal: {z.optimal}%</span>
                </div>
                <div className="progress-track h-1.5">
                  <div className="progress-fill h-full" style={{width:`${z.moisture}%`,background:z.colorHex}}/>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Weekly Chart */}
        <div className="lg:col-span-2 card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-sm" style={{color:'var(--text-1)'}}>📊 Weekly Water Usage</h3>
            <span className="badge badge-green">Efficiency: 72%</span>
          </div>
          <WaterChart/>
          <div className="grid grid-cols-3 gap-3 mt-4">
            <div className="card-flat rounded-xl p-3 text-center">
              <div className="font-bold text-sm" style={{color:'#60a5fa'}}>660 L</div>
              <div className="text-xs" style={{color:'var(--text-3)'}}>This Week</div>
            </div>
            <div className="card-flat rounded-xl p-3 text-center">
              <div className="font-bold text-sm" style={{color:'#4ade80'}}>410 L</div>
              <div className="text-xs" style={{color:'var(--text-3)'}}>Saved</div>
            </div>
            <div className="card-flat rounded-xl p-3 text-center">
              <div className="font-bold text-sm" style={{color:'#fbbf24'}}>Drip</div>
              <div className="text-xs" style={{color:'var(--text-3)'}}>Best Method</div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
        {/* Irrigation Schedule */}
        <div className="card p-5">
          <h3 className="font-semibold text-sm mb-4" style={{color:'var(--text-1)'}}>📅 AI Irrigation Schedule</h3>
          <div className="space-y-3">
            {SCHEDULE.map((s,i)=>(
              <div key={i} className={`flex items-center gap-4 p-3 rounded-xl transition-all ${s.status==='done'?'opacity-50':''}`}
                style={{background: s.status==='done' ? 'transparent' : 'rgba(255,255,255,0.02)'}}>
                <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${s.status==='done'?'bg-slate-600':'bg-green-400 animate-pulse'}`}/>
                <div className="flex-1">
                  <div className="text-sm font-medium" style={{color:'var(--text-1)'}}>{s.day}</div>
                  <div className="text-xs" style={{color:'var(--text-3)'}}>{s.time} · {s.duration} · {s.zone}</div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-semibold" style={{color:'#60a5fa'}}>{s.water} L</div>
                  <div className="text-xs" style={{color: s.status==='done'?'var(--text-3)':'#4ade80'}}>{s.status==='done'?'✓ Done':'⏰ Upcoming'}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Irrigation Recommendations */}
        <div className="card p-5">
          <h3 className="font-semibold text-sm mb-4" style={{color:'var(--text-1)'}}>💧 Crop Irrigation Guide</h3>
          <div className="flex gap-2 mb-4 flex-wrap">
            {IRRIGATION_DATA.map((c,i)=>(
              <button key={i} onClick={()=>setSelectedCrop(i)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border ${selectedCrop===i?'btn-primary':'btn-ghost'}`}>
                {c.icon} {c.crop}
              </button>
            ))}
          </div>
          {irr && (
            <div className="card-flat rounded-xl p-4 space-y-3">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-3xl">{irr.icon}</span>
                <div>
                  <div className="font-semibold" style={{color:'var(--text-1)'}}>{irr.crop}</div>
                  <div className="text-xs" style={{color:'var(--text-3)'}}>{irr.soilType} soil</div>
                </div>
                <span className="badge badge-green ml-auto">Saves {irr.saving}</span>
              </div>
              {[
                {l:'Water Need',    v:irr.waterNeed,              c:'#f87171'},
                {l:'Best Method',   v:irr.method,                 c:'#4ade80'},
                {l:'Daily Usage',   v:`${irr.dailyLiters.toLocaleString()} L/day`, c:'#60a5fa'},
              ].map(item=>(
                <div key={item.l} className="flex justify-between items-center">
                  <span className="text-xs" style={{color:'var(--text-3)'}}>{item.l}</span>
                  <span className="text-xs font-bold" style={{color:item.c}}>{item.v}</span>
                </div>
              ))}
              <div className="flex gap-0.5 mt-1">
                {Array.from({length:5}).map((_,j)=>(
                  <span key={j} className="text-sm" style={{color: j < irr.rating ? '#fbbf24' : 'rgba(255,255,255,0.15)'}}>★</span>
                ))}
                <span className="text-xs ml-2" style={{color:'var(--text-3)'}}>Efficiency Rating</span>
              </div>
            </div>
          )}
          <div className="mt-4 card-green rounded-xl p-3" style={{border:'1px solid rgba(74,222,128,0.25)'}}>
            <div className="text-xs font-semibold mb-1" style={{color:'#4ade80'}}>💡 AI Tip</div>
            <div className="text-xs" style={{color:'var(--text-2)'}}>Switch to drip irrigation to save up to 40% water. Sugarcane & Tomato benefit most from drip systems in Maharashtra conditions.</div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
