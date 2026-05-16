import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import GPSLocationCard from '../components/GPSLocationCard';
import { useAuth } from '../App';

const RISKS = [
  { label:'Climate Risk',  level:'Medium', score:52, cls:'risk-medium' },
  { label:'Market Risk',   level:'Low',    score:22, cls:'risk-low'    },
  { label:'Disease Risk',  level:'Low',    score:18, cls:'risk-low'    },
  { label:'Drought Risk',  level:'Medium', score:45, cls:'risk-medium' },
];
const AI_RECS = [
  { icon:'🌾', text:'Sow Wheat by Nov 20 for optimal yield',   priority:'High',   pc:'badge-red'    },
  { icon:'💧', text:'Irrigate Tuesday — soil moisture at 42%', priority:'Medium', pc:'badge-yellow' },
  { icon:'🧪', text:'Apply 25kg Urea/acre before next rain',   priority:'High',   pc:'badge-red'    },
  { icon:'📈', text:'Hold wheat — prices rising next 2 weeks', priority:'Info',   pc:'badge-blue'   },
  { icon:'🔬', text:'Monitor for rust — humidity elevated',    priority:'Medium', pc:'badge-yellow' },
];

const quickActions = [
  { icon:'🌱', label:'Crop AI',    path:'/recommendations', color:'#22c55e' },
  { icon:'📈', label:'Market',     path:'/market',          color:'#3b82f6' },
  { icon:'🔬', label:'Disease',    path:'/disease-scanner', color:'#ef4444' },
  { icon:'💧', label:'Water',      path:'/water',           color:'#06b6d4' },
  { icon:'🧪', label:'Fertilizer', path:'/fertilizer',      color:'#f59e0b' },
  { icon:'♻️', label:'Eco Farm',   path:'/sustainability',  color:'#a78bfa' },
  { icon:'🌤', label:'Weather',    path:'/weather',         color:'#38bdf8' },
  { icon:'🧠', label:'AI Agents',  path:'/agents',          color:'#818cf8' },
  { icon:'🤖', label:'KisanGPT',   path:'/chatbot',         color:'#c084fc' },
];

function ScoreRing({ score, size=80, color='#22c55e', label }) {
  const r = (size-10)/2, circ = 2*Math.PI*r;
  return (
    <div className="flex flex-col items-center gap-1">
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="6"/>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth="6"
          strokeDasharray={circ} strokeDashoffset={circ-(score/100)*circ}
          strokeLinecap="round" className="progress-ring"/>
      </svg>
      <div className="text-center -mt-1">
        <div className="font-display font-bold text-lg leading-none" style={{color:'var(--text-1)'}}>{score}</div>
        {label && <div className="text-xs" style={{color:'var(--text-3)'}}>{label}</div>}
      </div>
    </div>
  );
}

function MiniChart({ data, color='#22c55e' }) {
  const ref = useRef();
  useEffect(() => {
    const c = ref.current; if (!c || !window.Chart) return;
    const ex = window.Chart.getChart(c); if (ex) ex.destroy();
    new window.Chart(c, {
      type:'line',
      data:{ labels:data.map((_,i)=>i), datasets:[{ data, borderColor:color, borderWidth:2, fill:true, backgroundColor:color+'18', tension:0.4, pointRadius:0 }] },
      options:{ responsive:true, maintainAspectRatio:false, plugins:{legend:{display:false}}, scales:{x:{display:false},y:{display:false}}, animation:{duration:800} }
    });
  }, [data, color]);
  return <div className="h-12"><canvas ref={ref}/></div>;
}

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [time, setTime] = useState(new Date());
  useEffect(() => { const t = setInterval(()=>setTime(new Date()),60000); return ()=>clearInterval(t); },[]);
  const hour = time.getHours();
  const greeting = hour<12?'Good Morning':hour<17?'Good Afternoon':'Good Evening';
  const profitData  = [28,32,29,35,38,34,42,40,45,42,48,52];
  const weatherData = [22,25,28,26,24,27,30,28,26,29,31,28];

  return (
    <DashboardLayout
      title="Farm Dashboard"
      subtitle={time.toLocaleDateString('en-IN',{weekday:'long',day:'numeric',month:'long',year:'numeric'})}
    >
      {/* Greeting */}
      <div className="card p-5 mb-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h2 className="font-display font-bold text-xl" style={{color:'var(--text-1)'}}>
            {greeting}, {user?.name||'Farmer'} 👋
          </h2>
          <p className="text-sm mt-0.5" style={{color:'var(--text-2)'}}>
            AI has <span style={{color:'var(--green)'}} className="font-semibold">5 new recommendations</span> for your farm today.
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
          {user?.gps && <span className="badge badge-green">📍 GPS Active</span>}
          <span className="badge badge-gray">{user?.crop||'Wheat'} · {user?.acres||'5'} Acres</span>
          <span className="badge badge-gray">{user?.state||'Maharashtra'}</span>
        </div>
      </div>

      {/* GPS Location Card */}
      <GPSLocationCard />

      {/* Score rings */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-5">
        {[
          { label:'Productivity',  score:82, color:'#22c55e', sub:'Overall'  },
          { label:'Soil Health',   score:74, color:'#f59e0b', sub:'Index'    },
          { label:'Water Eff.',    score:68, color:'#3b82f6', sub:'Score'    },
          { label:'Sustainability',score:71, color:'#a78bfa', sub:'Rating'   },
        ].map(item => (
          <div key={item.label} className="card p-4 flex flex-col items-center hover-lift">
            <ScoreRing score={item.score} color={item.color} label={item.sub}/>
            <div className="text-xs text-center mt-2" style={{color:'var(--text-2)'}}>{item.label}</div>
          </div>
        ))}
      </div>

      {/* Main 3-col */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-5">

        {/* Profit */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="text-lg">💰</span>
              <span className="font-semibold text-sm" style={{color:'var(--text-1)'}}>Profit Analytics</span>
            </div>
            <span className="badge badge-green">+12%</span>
          </div>
          <div className="font-display font-extrabold text-3xl mb-0.5" style={{color:'var(--text-1)'}}>₹42,000</div>
          <div className="text-xs mb-3" style={{color:'var(--text-3)'}}>Estimated this season</div>
          <MiniChart data={profitData} color="#22c55e"/>
          <div className="grid grid-cols-2 gap-2 mt-3">
            <div className="card-green p-2.5 rounded-xl text-center">
              <div className="font-bold text-sm" style={{color:'#4ade80'}}>₹8,400</div>
              <div className="text-xs" style={{color:'var(--text-3)'}}>Per Acre</div>
            </div>
            <div className="card-blue p-2.5 rounded-xl text-center">
              <div className="font-bold text-sm" style={{color:'#60a5fa'}}>₹2,150</div>
              <div className="text-xs" style={{color:'var(--text-3)'}}>Market/Q</div>
            </div>
          </div>
        </div>

        {/* Weather */}
        <div className="card p-5 cursor-pointer hover-lift" onClick={()=>navigate('/weather')}>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg">🌤</span>
            <span className="font-semibold text-sm" style={{color:'var(--text-1)'}}>Weather Forecast</span>
          </div>
          <div className="flex items-center gap-3 mb-3">
            <span className="text-4xl">⛅</span>
            <div>
              <div className="font-display font-bold text-3xl" style={{color:'var(--text-1)'}}>28°C</div>
              <div className="text-xs" style={{color:'var(--text-3)'}}>Partly Cloudy · Feels 26°C</div>
            </div>
          </div>
          <MiniChart data={weatherData} color="#3b82f6"/>
          <div className="grid grid-cols-3 gap-2 mt-3">
            {[{l:'Humidity',v:'65%'},{l:'Rain',v:'12mm'},{l:'Wind',v:'14km/h'}].map(i=>(
              <div key={i.l} className="card-blue p-2 rounded-xl text-center">
                <div className="font-bold text-xs" style={{color:'#60a5fa'}}>{i.v}</div>
                <div className="text-xs" style={{color:'var(--text-3)'}}>{i.l}</div>
              </div>
            ))}
          </div>
          <div className="mt-3 card-amber p-2.5 rounded-xl">
            <span className="text-xs font-semibold" style={{color:'#fbbf24'}}>⚠️ Heavy rain alert Thursday</span>
          </div>
        </div>

        {/* Risk */}
        <div className="card p-5">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-lg">🛡️</span>
            <span className="font-semibold text-sm" style={{color:'var(--text-1)'}}>AI Risk System</span>
          </div>
          <div className="space-y-3">
            {RISKS.map(r => (
              <div key={r.label}>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs" style={{color:'var(--text-2)'}}>{r.label}</span>
                  <span className={`badge ${r.level==='Low'?'badge-green':r.level==='Medium'?'badge-yellow':'badge-red'}`}>{r.level}</span>
                </div>
                <div className="progress-track h-1.5">
                  <div className={`progress-fill h-full ${r.cls}`} style={{width:`${r.score}%`}}/>
                </div>
              </div>
            ))}
          </div>
          <button onClick={()=>navigate('/recommendations')} className="w-full mt-4 btn-secondary py-2 text-xs rounded-lg">
            View Full Risk Analysis →
          </button>
        </div>
      </div>

      {/* Bottom 2-col */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

        {/* AI Summary */}
        <div className="card p-5">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-7 h-7 rounded-lg btn-primary flex items-center justify-center text-sm">🤖</div>
            <span className="font-semibold text-sm" style={{color:'var(--text-1)'}}>AI Recommendation Summary</span>
          </div>
          <div className="space-y-1.5">
            {AI_RECS.map((item,i) => (
              <div key={i} className="flex items-start gap-3 p-2.5 rounded-xl transition-colors"
                style={{cursor:'default'}}
                onMouseEnter={e=>e.currentTarget.style.background='var(--bg-card2)'}
                onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
                <span className="text-lg flex-shrink-0">{item.icon}</span>
                <div className="flex-1 text-xs leading-relaxed" style={{color:'var(--text-2)'}}>{item.text}</div>
                <span className={`badge ${item.pc} flex-shrink-0`}>{item.priority}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="card p-5">
          <div className="font-semibold text-sm mb-4" style={{color:'var(--text-1)'}}>Quick Actions</div>
          <div className="grid grid-cols-3 gap-2.5">
            {quickActions.map(a => (
              <button key={a.path} onClick={()=>navigate(a.path)}
                className="rounded-xl p-3 text-center hover-lift transition-all"
                style={{
                  background: a.color+'14',
                  border: `1px solid ${a.color}30`,
                  color: a.color,
                }}>
                <div className="text-2xl mb-1">{a.icon}</div>
                <div className="text-xs font-semibold">{a.label}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
