import React, { useState, useEffect, useRef } from 'react';
import DashboardLayout from '../components/DashboardLayout';

/* ── Dataset 2: Market Demand Prediction ── */
const MARKET_DATA = [
  { name:'Onion',     icon:'🧅', current:3200, predicted:3800, change:'+18.7%', demand:'Very High', trend:'up',   bestSell:'November', profitScore:92, data:[2800,2900,3000,3100,3000,3200,3300,3400,3500,3600,3700,3800] },
  { name:'Soybean',   icon:'🫘', current:6100, predicted:6300, change:'+3.3%',  demand:'High',      trend:'up',   bestSell:'October',  profitScore:88, data:[5800,5850,5900,5950,6000,6100,6150,6200,6220,6250,6280,6300] },
  { name:'Tomato',    icon:'🍅', current:2800, predicted:3200, change:'+14.3%', demand:'High',      trend:'up',   bestSell:'December', profitScore:85, data:[2200,2400,2600,2500,2700,2800,2900,3000,3050,3100,3150,3200] },
  { name:'Sugarcane', icon:'🌾', current:3400, predicted:3900, change:'+14.7%', demand:'Medium',    trend:'up',   bestSell:'January',  profitScore:74, data:[3100,3150,3200,3250,3300,3400,3500,3600,3700,3750,3850,3900] },
  { name:'Maize',     icon:'🌽', current:2400, predicted:2500, change:'+4.2%',  demand:'Medium',    trend:'up',   bestSell:'September',profitScore:70, data:[2200,2250,2280,2300,2350,2400,2420,2440,2460,2470,2490,2500] },
  { name:'Cotton',    icon:'🌿', current:7800, predicted:8200, change:'+5.1%',  demand:'High',      trend:'up',   bestSell:'Jan–Feb',  profitScore:90, data:[7200,7300,7400,7500,7600,7800,7850,7900,7950,8000,8100,8200] },
];

const MANDIS = [
  { name:'Pune APMC',     state:'Maharashtra', volume:'12,400 Q', trend:'+5%',  active:true  },
  { name:'Lasalgaon',     state:'Maharashtra', volume:'18,200 Q', trend:'+12%', active:true  },
  { name:'Azadpur Mandi', state:'Delhi',       volume:'28,000 Q', trend:'+2%',  active:true  },
  { name:'Koyambedu',     state:'Tamil Nadu',  volume:'15,600 Q', trend:'+8%',  active:true  },
  { name:'Vashi Market',  state:'Maharashtra', volume:'8,200 Q',  trend:'-1%',  active:false },
];

function PriceChart({ data, color, name }) {
  const ref = useRef();
  useEffect(() => {
    const c = ref.current; if (!c || !window.Chart) return;
    const ex = window.Chart.getChart(c); if (ex) ex.destroy();
    new window.Chart(c, {
      type:'line',
      data:{ labels:['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
        datasets:[{ label:`${name} (₹/Q)`, data, borderColor:color, backgroundColor:color+'18', borderWidth:2.5, fill:true, tension:0.4, pointRadius:3, pointBackgroundColor:color }] },
      options:{ responsive:true, maintainAspectRatio:false,
        plugins:{ legend:{ display:false }, tooltip:{ backgroundColor:'#0d2010', titleColor:'#fff', bodyColor:'rgba(255,255,255,0.6)' } },
        scales:{
          x:{ grid:{ color:'rgba(255,255,255,0.05)' }, ticks:{ color:'rgba(255,255,255,0.4)', font:{ size:10 } } },
          y:{ grid:{ color:'rgba(255,255,255,0.05)' }, ticks:{ color:'rgba(255,255,255,0.4)', font:{ size:10 }, callback:v=>'₹'+v } },
        }
      }
    });
  }, [data, color, name]);
  return <div className="h-48"><canvas ref={ref}/></div>;
}

function DemandBadge({ demand }) {
  const map = { 'Very High':'badge-green', High:'badge-green', Medium:'badge-yellow', Low:'badge-red' };
  return <span className={`badge ${map[demand]||'badge-gray'}`}>{demand}</span>;
}

export default function MarketPage() {
  const [selected, setSelected] = useState(0);
  const crop = MARKET_DATA[selected];

  return (
    <DashboardLayout title="Market Demand Prediction" subtitle="AI-powered mandi price prediction & demand intelligence">

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-5">
        {[
          { icon:'📈', label:'High Demand Crops', value:'4',       sub:'This Season',  color:'#4ade80' },
          { icon:'💹', label:'Avg Price Rise',    value:'+10.1%',  sub:'Next 30 Days', color:'#34d399' },
          { icon:'🏪', label:'Active Mandis',     value:'4/5',     sub:'Near You',     color:'#60a5fa' },
          { icon:'⏰', label:'Best Sell Window',  value:'Nov–Jan', sub:'Onion & Sugarcane', color:'#fbbf24' },
        ].map(s=>(
          <div key={s.label} className="card p-4 hover-lift">
            <div className="text-2xl mb-2">{s.icon}</div>
            <div className="font-display font-bold text-xl" style={{color:s.color}}>{s.value}</div>
            <div className="text-xs font-medium" style={{color:'var(--text-1)'}}>{s.label}</div>
            <div className="text-xs" style={{color:'var(--text-3)'}}>{s.sub}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-5">
        {/* Crop selector */}
        <div className="card p-5">
          <h3 className="font-semibold text-sm mb-4" style={{color:'var(--text-1)'}}>Crop Price Tracker</h3>
          <div className="space-y-1.5">
            {MARKET_DATA.map((c,i)=>(
              <button key={i} onClick={()=>setSelected(i)}
                className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all text-left border ${selected===i?'bg-green-900/20 border-green-700/40':'border-transparent hover:bg-white/5'}`}>
                <span className="text-xl">{c.icon}</span>
                <div className="flex-1">
                  <div className="text-sm font-semibold" style={{color:'var(--text-1)'}}>{c.name}</div>
                  <div className="text-xs" style={{color:'var(--text-3)'}}>₹{c.current}/Q · Best: {c.bestSell}</div>
                </div>
                <span className={`text-xs font-bold ${c.trend==='up'?'text-green-400':'text-red-400'}`}>
                  {c.trend==='up'?'↑':'↓'} {c.change}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Price chart */}
        <div className="lg:col-span-2 card p-5">
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xl">{crop.icon}</span>
                <h3 className="font-display font-semibold" style={{color:'var(--text-1)'}}>{crop.name} Price Forecast</h3>
              </div>
              <div className="text-xs mt-1" style={{color:'var(--text-3)'}}>12-month AI price prediction · Best sell: {crop.bestSell}</div>
            </div>
            <div className="text-right">
              <div className="font-display font-bold text-2xl" style={{color:'var(--text-1)'}}>₹{crop.current}</div>
              <div className="text-sm font-bold text-green-400">↑ Predicted ₹{crop.predicted}</div>
            </div>
          </div>
          <PriceChart data={crop.data} color={crop.trend==='up'?'#22c55e':'#ef4444'} name={crop.name}/>
          <div className="grid grid-cols-4 gap-3 mt-4">
            <div className="card-flat p-3 rounded-xl text-center">
              <div className="text-xs mb-1" style={{color:'var(--text-3)'}}>Demand</div>
              <DemandBadge demand={crop.demand}/>
            </div>
            <div className="card-flat p-3 rounded-xl text-center">
              <div className="text-xs mb-1" style={{color:'var(--text-3)'}}>Best Sell</div>
              <div className="text-xs font-bold" style={{color:'#fbbf24'}}>{crop.bestSell}</div>
            </div>
            <div className="card-flat p-3 rounded-xl text-center">
              <div className="text-xs mb-1" style={{color:'var(--text-3)'}}>Price Change</div>
              <div className="text-sm font-bold text-green-400">{crop.change}</div>
            </div>
            <div className="card-flat p-3 rounded-xl text-center">
              <div className="text-xs mb-1" style={{color:'var(--text-3)'}}>Profit Score</div>
              <div className="text-sm font-bold" style={{color:'#c084fc'}}>{crop.profitScore}/100</div>
            </div>
          </div>
        </div>
      </div>

      {/* High demand grid */}
      <div className="card p-5 mb-5">
        <h3 className="font-semibold text-sm mb-4" style={{color:'var(--text-1)'}}>🔥 High Demand Crops This Season</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {MARKET_DATA.map((c,i)=>(
            <div key={i} className="card-flat rounded-xl p-3 text-center hover-lift border border-green-900/20 cursor-pointer" onClick={()=>setSelected(i)}>
              <div className="text-3xl mb-2">{c.icon}</div>
              <div className="text-xs font-semibold mb-1" style={{color:'var(--text-1)'}}>{c.name}</div>
              <DemandBadge demand={c.demand}/>
              <div className="text-xs font-bold mt-2 text-green-400">{c.change}</div>
              <div className="text-xs mt-1" style={{color:'var(--text-3)'}}>₹{c.current}/Q</div>
            </div>
          ))}
        </div>
      </div>

      {/* Mandi trends */}
      <div className="card p-5">
        <h3 className="font-semibold text-sm mb-4" style={{color:'var(--text-1)'}}>🏪 Mandi Market Trends</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {MANDIS.map((m,i)=>(
            <div key={i} className="card-flat rounded-xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-2.5 h-2.5 rounded-full ${m.active?'bg-green-400 animate-pulse':'bg-slate-500'}`}/>
                <div>
                  <div className="text-sm font-semibold" style={{color:'var(--text-1)'}}>{m.name}</div>
                  <div className="text-xs" style={{color:'var(--text-3)'}}>{m.state} · {m.volume}</div>
                </div>
              </div>
              <span className={`font-bold text-sm ${m.trend.startsWith('+')?'text-green-400':'text-red-400'}`}>{m.trend}</span>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
