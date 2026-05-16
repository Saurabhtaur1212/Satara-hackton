import React, { useState, useEffect, useRef } from 'react';
import DashboardLayout from '../components/DashboardLayout';

/* ── Dataset 5: Weather Risk Analysis ── */
const WEATHER_RISKS = [
  { location:'Sangli',   weatherRisk:'Heavy Rainfall', riskLevel:'Medium', cropImpact:'Possible waterlogging',  advice:'Improve drainage system',          icon:'🌧️', color:'#f59e0b' },
  { location:'Pune',     weatherRisk:'Heatwave',        riskLevel:'High',   cropImpact:'Soil moisture loss',     advice:'Increase irrigation frequency',    icon:'🌡️', color:'#ef4444' },
  { location:'Kolhapur', weatherRisk:'Flooding',        riskLevel:'High',   cropImpact:'Crop root damage',       advice:'Avoid lowland cultivation',        icon:'🌊', color:'#ef4444' },
  { location:'Nashik',   weatherRisk:'Low Rainfall',    riskLevel:'Medium', cropImpact:'Reduced yield',          advice:'Use drought-resistant crops',       icon:'☀️', color:'#f59e0b' },
  { location:'Nagpur',   weatherRisk:'Dry Climate',     riskLevel:'Low',    cropImpact:'Water stress',           advice:'Adopt drip irrigation',            icon:'🏜️', color:'#22c55e' },
];

const forecast = [
  { day:'Today', icon:'⛅', high:31, low:20, rain:10,  desc:'Partly Cloudy',  wind:14, location:'Sangli'   },
  { day:'Tue',   icon:'🌡️', high:36, low:24, rain:0,   desc:'Heatwave Alert', wind:8,  location:'Pune'     },
  { day:'Wed',   icon:'🌧️', high:27, low:18, rain:75,  desc:'Heavy Rain',     wind:22, location:'Kolhapur' },
  { day:'Thu',   icon:'⛈️', high:24, low:17, rain:90,  desc:'Thunderstorm',   wind:35, location:'Kolhapur' },
  { day:'Fri',   icon:'☀️', high:33, low:21, rain:0,   desc:'Dry & Hot',      wind:10, location:'Nashik'   },
  { day:'Sat',   icon:'🌦️', high:28, low:19, rain:30,  desc:'Light Rain',     wind:16, location:'Sangli'   },
  { day:'Sun',   icon:'☀️', high:30, low:20, rain:0,   desc:'Clear Sky',      wind:8,  location:'Nagpur'   },
];

const ALERTS = [
  { icon:'🌡️', title:'Heatwave Warning — Pune',      severity:'High',   day:'Tuesday',  cardCls:'card-red',   badgeCls:'badge-red',
    actions:['Increase irrigation frequency to twice daily','Mulch soil to retain moisture','Avoid field work 11AM–4PM','Monitor crop wilting signs'] },
  { icon:'🌊', title:'Flood Risk — Kolhapur',         severity:'High',   day:'Wed–Thu',  cardCls:'card-red',   badgeCls:'badge-red',
    actions:['Avoid lowland cultivation immediately','Improve field drainage channels','Harvest any ripe crops before Wednesday','Secure farm equipment'] },
  { icon:'🌧️', title:'Heavy Rainfall — Sangli',       severity:'Medium', day:'Wednesday',cardCls:'card-amber', badgeCls:'badge-yellow',
    actions:['Avoid irrigation — natural rain sufficient','Protect crops from waterlogging','Apply fungicide preventively','Ensure field drainage is clear'] },
  { icon:'🏜️', title:'Drought Advisory — Nashik',     severity:'Medium', day:'Ongoing',  cardCls:'card-amber', badgeCls:'badge-yellow',
    actions:['Switch to drought-resistant crop varieties','Adopt drip irrigation system','Mulch soil to reduce evaporation','Monitor soil moisture daily'] },
];

const hourly = [
  { time:'6AM',  temp:22, icon:'🌅', rain:0  },
  { time:'9AM',  temp:26, icon:'☀️', rain:0  },
  { time:'12PM', temp:31, icon:'🌡️', rain:0  },
  { time:'3PM',  temp:33, icon:'🌡️', rain:5  },
  { time:'6PM',  temp:29, icon:'⛅', rain:15 },
  { time:'9PM',  temp:24, icon:'🌙', rain:5  },
];

function TempChart() {
  const ref = useRef();
  useEffect(() => {
    const c = ref.current; if (!c || !window.Chart) return;
    const ex = window.Chart.getChart(c); if (ex) ex.destroy();
    new window.Chart(c, {
      type:'line',
      data:{ labels:forecast.map(f=>f.day), datasets:[
        { label:'High °C', data:forecast.map(f=>f.high), borderColor:'#f97316', backgroundColor:'#f9731615', borderWidth:2, fill:false, tension:0.4, pointRadius:4, pointBackgroundColor:'#f97316' },
        { label:'Low °C',  data:forecast.map(f=>f.low),  borderColor:'#3b82f6', backgroundColor:'#3b82f615', borderWidth:2, fill:false, tension:0.4, pointRadius:4, pointBackgroundColor:'#3b82f6' },
        { label:'Rain %',  data:forecast.map(f=>f.rain), borderColor:'#22c55e', backgroundColor:'#22c55e12', borderWidth:2, fill:true,  tension:0.4, pointRadius:3, yAxisID:'y1' },
      ]},
      options:{ responsive:true, maintainAspectRatio:false,
        plugins:{ legend:{ labels:{ color:'rgba(255,255,255,0.5)', font:{ size:10 } } }, tooltip:{ backgroundColor:'#0d2010' } },
        scales:{
          x:{ grid:{ color:'rgba(255,255,255,0.05)' }, ticks:{ color:'rgba(255,255,255,0.4)', font:{ size:10 } } },
          y:{ grid:{ color:'rgba(255,255,255,0.05)' }, ticks:{ color:'rgba(255,255,255,0.4)', font:{ size:10 }, callback:v=>v+'°' }, position:'left' },
          y1:{ grid:{ display:false }, ticks:{ color:'rgba(255,255,255,0.4)', font:{ size:10 }, callback:v=>v+'%' }, position:'right' },
        }
      }
    });
  }, []);
  return <div className="h-52"><canvas ref={ref}/></div>;
}

export default function WeatherPage() {
  const [unit, setUnit]       = useState('C');
  const [activeAlert, setActiveAlert] = useState(0);
  const [activeLocation, setActiveLocation] = useState(0);
  const convert = t => unit === 'C' ? t : Math.round(t * 9/5 + 32);
  const maxTemp = Math.max(...forecast.map(f => f.high));
  const riskColor = { High:'#ef4444', Medium:'#f59e0b', Low:'#22c55e' };
  const riskBadge = { High:'badge-red', Medium:'badge-yellow', Low:'badge-green' };

  return (
    <DashboardLayout title="Weather Risk Analysis System" subtitle="Real-time hyperlocal weather intelligence & smart farm alerts for Maharashtra">

      {/* Current weather hero */}
      <div className="card p-6 mb-5" style={{background:'linear-gradient(135deg,rgba(59,130,246,0.08),rgba(14,165,233,0.05))'}}>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <span className="text-6xl">⛅</span>
            <div>
              <div className="font-display font-extrabold text-5xl" style={{color:'var(--text-1)'}}>{convert(31)}°{unit}</div>
              <div className="text-sm mt-1" style={{color:'var(--text-3)'}}>Partly Cloudy · Feels like {convert(29)}°</div>
              <div className="flex items-center gap-2 mt-2">
                <span className="badge badge-green">📍 Maharashtra Region</span>
                <span className="text-xs" style={{color:'var(--text-3)'}}>Updated 2 min ago</span>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {[{icon:'💧',l:'Humidity',v:'68%'},{icon:'💨',l:'Wind',v:'14 km/h'},{icon:'👁️',l:'Visibility',v:'10 km'},
              {icon:'🌡️',l:'Dew Point',v:'20°C'},{icon:'🌊',l:'Pressure',v:'1010 hPa'},{icon:'☀️',l:'UV Index',v:'7.2'}].map(i=>(
              <div key={i.l} className="card-flat p-2.5 text-center rounded-xl">
                <div className="text-lg mb-0.5">{i.icon}</div>
                <div className="font-semibold text-xs" style={{color:'var(--text-1)'}}>{i.v}</div>
                <div className="text-xs" style={{color:'var(--text-3)'}}>{i.l}</div>
              </div>
            ))}
          </div>
          <button onClick={()=>setUnit(u=>u==='C'?'F':'C')} className="btn-secondary px-4 py-2 text-sm rounded-xl self-start">
            Switch to °{unit==='C'?'F':'C'}
          </button>
        </div>
      </div>

      {/* Weather Risk by Location */}
      <div className="card p-5 mb-5">
        <h3 className="font-semibold text-sm mb-4" style={{color:'var(--text-1)'}}>🗺️ Weather Risk Analysis — Maharashtra Districts</h3>
        <div className="flex gap-2 mb-4 flex-wrap">
          {WEATHER_RISKS.map((r,i)=>(
            <button key={i} onClick={()=>setActiveLocation(i)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border ${activeLocation===i?'btn-primary':'btn-ghost'}`}>
              {r.icon} {r.location}
            </button>
          ))}
        </div>
        {(() => {
          const r = WEATHER_RISKS[activeLocation];
          return (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="card-flat rounded-xl p-4">
                <div className="text-xs font-semibold mb-2" style={{color:'var(--text-3)'}}>⚠️ Weather Risk</div>
                <div className="font-bold text-lg mb-1" style={{color:riskColor[r.riskLevel]}}>{r.weatherRisk}</div>
                <span className={`badge ${riskBadge[r.riskLevel]}`}>{r.riskLevel} Risk</span>
              </div>
              <div className="card-flat rounded-xl p-4">
                <div className="text-xs font-semibold mb-2" style={{color:'var(--text-3)'}}>🌾 Crop Impact</div>
                <div className="text-sm font-medium" style={{color:'var(--text-1)'}}>{r.cropImpact}</div>
              </div>
              <div className="card-flat rounded-xl p-4">
                <div className="text-xs font-semibold mb-2" style={{color:'var(--text-3)'}}>💡 AI Advice</div>
                <div className="text-sm" style={{color:'#4ade80'}}>{r.advice}</div>
              </div>
            </div>
          );
        })()}
      </div>

      {/* Hourly */}
      <div className="card p-5 mb-5">
        <h3 className="font-semibold text-sm mb-4" style={{color:'var(--text-1)'}}>⏰ Hourly Forecast</h3>
        <div className="flex gap-3 overflow-x-auto pb-1">
          {hourly.map((h,i)=>(
            <div key={i} className={`flex-shrink-0 rounded-2xl p-4 text-center min-w-[76px] card-flat ${i===2||i===3?'border-red-700/40':''}`}>
              <div className="text-xs mb-2" style={{color:'var(--text-3)'}}>{h.time}</div>
              <div className="text-2xl mb-2">{h.icon}</div>
              <div className="font-bold text-sm" style={{color:'var(--text-1)'}}>{convert(h.temp)}°</div>
              {h.rain>0 && <div className="text-xs mt-1" style={{color:'#60a5fa'}}>💧{h.rain}%</div>}
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
        <div className="card p-5">
          <h3 className="font-semibold text-sm mb-4" style={{color:'var(--text-1)'}}>📊 7-Day Temperature & Rain</h3>
          <TempChart/>
        </div>
        <div className="card p-5">
          <h3 className="font-semibold text-sm mb-4" style={{color:'var(--text-1)'}}>📅 7-Day Forecast</h3>
          <div className="space-y-1.5">
            {forecast.map((f,i)=>(
              <div key={i} className={`flex items-center gap-3 p-2.5 rounded-xl transition-all ${i===0?'bg-green-900/10 border border-green-900/20':''}`}
                style={{cursor:'default'}}
                onMouseEnter={e=>e.currentTarget.style.background='rgba(255,255,255,0.03)'}
                onMouseLeave={e=>e.currentTarget.style.background=i===0?'rgba(34,197,94,0.05)':'transparent'}>
                <div className="w-10 text-xs font-semibold" style={{color:'var(--text-3)'}}>{f.day}</div>
                <div className="text-xl w-7">{f.icon}</div>
                <div className="flex-1 text-xs hidden sm:block" style={{color:'var(--text-3)'}}>{f.desc}</div>
                <div className="text-xs w-8" style={{color:'#60a5fa'}}>{f.rain}%</div>
                <div className="flex items-center gap-1.5 text-xs">
                  <span style={{color:'#60a5fa'}}>{convert(f.low)}°</span>
                  <div className="w-12 h-1.5 rounded-full overflow-hidden" style={{background:'rgba(255,255,255,0.08)'}}>
                    <div className="h-full bg-gradient-to-r from-blue-400 to-orange-400 rounded-full" style={{width:`${(f.high/maxTemp)*100}%`}}/>
                  </div>
                  <span style={{color:'#f97316'}}>{convert(f.high)}°</span>
                </div>
                {f.wind>25 && <span className="badge badge-red text-xs">💨{f.wind}</span>}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Smart Alerts */}
      <div>
        <h3 className="font-semibold mb-4" style={{color:'var(--text-1)'}}>🔔 Smart Farm Alert System</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {ALERTS.map((a,i)=>(
            <div key={i} className={`${a.cardCls} rounded-2xl overflow-hidden cursor-pointer border hover-lift ${activeAlert===i?'ring-2 ring-green-500/30':''}`}
              onClick={()=>setActiveAlert(activeAlert===i?-1:i)}>
              <div className="p-4 flex items-start gap-3">
                <span className="text-2xl flex-shrink-0">{a.icon}</span>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-sm" style={{color:'var(--text-1)'}}>{a.title}</span>
                    <span className={`badge ${a.badgeCls}`}>{a.severity}</span>
                  </div>
                  <div className="text-xs" style={{color:'var(--text-3)'}}>{a.day}</div>
                </div>
                <span className="text-sm" style={{color:'var(--text-3)'}}>{activeAlert===i?'▲':'▼'}</span>
              </div>
              {activeAlert===i && (
                <div className="px-4 pb-4 pt-3 animate-fade-in" style={{borderTop:'1px solid rgba(255,255,255,0.06)'}}>
                  <div className="text-xs font-semibold uppercase tracking-wider mb-2" style={{color:'var(--text-3)'}}>Preventive Actions</div>
                  <div className="space-y-1.5">
                    {a.actions.map((action,j)=>(
                      <div key={j} className="flex items-start gap-2">
                        <span className="text-xs mt-0.5 font-bold" style={{color:'#4ade80'}}>✓</span>
                        <span className="text-xs" style={{color:'var(--text-2)'}}>{action}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
