import React, { useState, useEffect, useRef } from 'react';
import DashboardLayout from '../components/DashboardLayout';

const CROPS_DATA = [
  { name:'Wheat',   icon:'🌾', current:2275, predicted:2480, change:'+9%',   demand:'High',      trend:'up',   bestSell:'Feb–Mar', data:[2100,2150,2200,2180,2250,2275,2300,2350,2400,2450,2480,2500] },
  { name:'Rice',    icon:'🍚', current:2183, predicted:2050, change:'-6%',   demand:'Medium',    trend:'down', bestSell:'Nov–Dec', data:[2300,2280,2250,2220,2200,2183,2160,2100,2080,2060,2050,2040] },
  { name:'Cotton',  icon:'🌿', current:6620, predicted:7200, change:'+8.7%', demand:'High',      trend:'up',   bestSell:'Jan–Feb', data:[6200,6300,6400,6350,6500,6620,6700,6800,6900,7000,7100,7200] },
  { name:'Soybean', icon:'🫘', current:4600, predicted:4900, change:'+6.5%', demand:'High',      trend:'up',   bestSell:'Dec–Jan', data:[4300,4350,4400,4450,4500,4600,4650,4700,4750,4800,4850,4900] },
  { name:'Onion',   icon:'🧅', current:1800, predicted:2400, change:'+33%',  demand:'Very High', trend:'up',   bestSell:'Mar–Apr', data:[1200,1400,1600,1500,1700,1800,1900,2000,2100,2200,2300,2400] },
  { name:'Tomato',  icon:'🍅', current:2200, predicted:1800, change:'-18%',  demand:'Low',       trend:'down', bestSell:'Oct–Nov', data:[2800,2600,2400,2300,2200,2100,2000,1950,1900,1850,1820,1800] },
];
const MANDIS = [
  { name:'Pune APMC',     state:'Maharashtra', volume:'12,400 Q', trend:'+5%', active:true  },
  { name:'Azadpur Mandi', state:'Delhi',       volume:'28,000 Q', trend:'+2%', active:true  },
  { name:'Vashi Market',  state:'Maharashtra', volume:'8,200 Q',  trend:'-1%', active:false },
  { name:'Koyambedu',     state:'Tamil Nadu',  volume:'15,600 Q', trend:'+8%', active:true  },
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
        plugins:{ legend:{ display:false }, tooltip:{ backgroundColor:'#1e293b', titleColor:'#f8fafc', bodyColor:'#94a3b8' } },
        scales:{
          x:{ grid:{ color:'#f1f5f9' }, ticks:{ color:'#94a3b8', font:{ size:10 } } },
          y:{ grid:{ color:'#f1f5f9' }, ticks:{ color:'#94a3b8', font:{ size:10 }, callback:v=>'₹'+v } },
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
  const crop = CROPS_DATA[selected];

  return (
    <DashboardLayout title="Market Trend Analysis" subtitle="AI-powered mandi price prediction & demand intelligence">

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-5">
        {[
          { icon:'📈', label:'High Demand Crops', value:'4',       sub:'This Season',  color:'text-brand-600' },
          { icon:'💹', label:'Avg Price Rise',    value:'+8.2%',   sub:'Next 30 Days', color:'text-emerald-600' },
          { icon:'🏪', label:'Active Mandis',     value:'3/4',     sub:'Near You',     color:'text-blue-600' },
          { icon:'⏰', label:'Best Sell Window',  value:'Feb–Mar', sub:'For Wheat',    color:'text-amber-600' },
        ].map(s=>(
          <div key={s.label} className="card p-4 hover-lift">
            <div className="text-2xl mb-2">{s.icon}</div>
            <div className={`font-display font-bold text-xl ${s.color}`}>{s.value}</div>
            <div className="text-slate-600 text-xs font-medium">{s.label}</div>
            <div className="text-slate-400 text-xs">{s.sub}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-5">
        <div className="card p-5">
          <h3 className="font-semibold text-slate-700 text-sm mb-4">Crop Price Tracker</h3>
          <div className="space-y-1.5">
            {CROPS_DATA.map((c,i)=>(
              <button key={i} onClick={()=>setSelected(i)}
                className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all text-left border ${selected===i?'bg-brand-50 border-brand-200':'border-transparent hover:bg-slate-50'}`}>
                <span className="text-xl">{c.icon}</span>
                <div className="flex-1">
                  <div className="text-slate-800 text-sm font-semibold">{c.name}</div>
                  <div className="text-slate-400 text-xs">₹{c.current}/Q</div>
                </div>
                <span className={`text-xs font-bold ${c.trend==='up'?'text-brand-600':'text-red-600'}`}>
                  {c.trend==='up'?'↑':'↓'} {c.change}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="lg:col-span-2 card p-5">
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xl">{crop.icon}</span>
                <h3 className="font-display font-semibold text-slate-800">{crop.name} Price Forecast</h3>
              </div>
              <div className="text-slate-400 text-xs mt-1">12-month AI price prediction</div>
            </div>
            <div className="text-right">
              <div className="font-display font-bold text-2xl text-slate-900">₹{crop.current}</div>
              <div className={`text-sm font-bold ${crop.trend==='up'?'text-brand-600':'text-red-600'}`}>
                {crop.trend==='up'?'↑':'↓'} Predicted ₹{crop.predicted}
              </div>
            </div>
          </div>
          <PriceChart data={crop.data} color={crop.trend==='up'?'#16a34a':'#ef4444'} name={crop.name}/>
          <div className="grid grid-cols-3 gap-3 mt-4">
            <div className="card-flat p-3 rounded-xl text-center">
              <div className="text-slate-400 text-xs mb-1">Demand</div>
              <DemandBadge demand={crop.demand}/>
            </div>
            <div className="card-flat p-3 rounded-xl text-center">
              <div className="text-slate-400 text-xs mb-1">Best Sell Time</div>
              <div className="text-amber-600 text-xs font-bold">{crop.bestSell}</div>
            </div>
            <div className="card-flat p-3 rounded-xl text-center">
              <div className="text-slate-400 text-xs mb-1">Price Change</div>
              <div className={`text-sm font-bold ${crop.trend==='up'?'text-brand-600':'text-red-600'}`}>{crop.change}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="card p-5 mb-5">
        <h3 className="font-semibold text-slate-700 text-sm mb-4">🔥 High Demand Crops This Season</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {CROPS_DATA.map((c,i)=>(
            <div key={i} className={`card-flat rounded-xl p-3 text-center hover-lift border ${c.trend==='up'?'border-brand-100':'border-red-100'}`}>
              <div className="text-3xl mb-2">{c.icon}</div>
              <div className="text-slate-800 text-xs font-semibold mb-1">{c.name}</div>
              <DemandBadge demand={c.demand}/>
              <div className={`text-xs font-bold mt-2 ${c.trend==='up'?'text-brand-600':'text-red-600'}`}>{c.change}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="card p-5">
        <h3 className="font-semibold text-slate-700 text-sm mb-4">🏪 Mandi Market Trends</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {MANDIS.map((m,i)=>(
            <div key={i} className="card-flat rounded-xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-2.5 h-2.5 rounded-full ${m.active?'bg-brand-500 animate-pulse':'bg-slate-300'}`}/>
                <div>
                  <div className="text-slate-800 text-sm font-semibold">{m.name}</div>
                  <div className="text-slate-400 text-xs">{m.state} · {m.volume}</div>
                </div>
              </div>
              <span className={`font-bold text-sm ${m.trend.startsWith('+')?'text-brand-600':'text-red-600'}`}>{m.trend}</span>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
