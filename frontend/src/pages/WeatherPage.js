import React, { useState, useEffect, useRef } from 'react';
import DashboardLayout from '../components/DashboardLayout';

const forecast = [
  { day:'Today', icon:'⛅', high:28, low:18, rain:10, desc:'Partly Cloudy', wind:14 },
  { day:'Tue',   icon:'☀️', high:31, low:20, rain:0,  desc:'Sunny',         wind:10 },
  { day:'Wed',   icon:'🌤', high:29, low:19, rain:5,  desc:'Mostly Sunny',  wind:12 },
  { day:'Thu',   icon:'🌧️', high:24, low:17, rain:75, desc:'Heavy Rain',    wind:22 },
  { day:'Fri',   icon:'⛈️', high:22, low:16, rain:90, desc:'Thunderstorm',  wind:35 },
  { day:'Sat',   icon:'🌦️', high:26, low:18, rain:30, desc:'Light Rain',    wind:16 },
  { day:'Sun',   icon:'☀️', high:30, low:20, rain:0,  desc:'Clear Sky',     wind:8  },
];

const ALERTS = [
  { icon:'⛈️', title:'Thunderstorm Warning', severity:'High',   day:'Friday',   cardCls:'card-red',   badgeCls:'badge-red',
    actions:['Secure farm equipment in shed','Avoid field work Friday afternoon','Check drainage channels','Harvest ripe crops by Thursday'] },
  { icon:'🌧️', title:'Heavy Rainfall Alert',  severity:'Medium', day:'Thursday', cardCls:'card-amber', badgeCls:'badge-yellow',
    actions:['Avoid irrigation — natural rain sufficient','Protect crops from waterlogging','Apply fungicide preventively','Ensure field drainage is clear'] },
  { icon:'☀️', title:'Heatwave Advisory',     severity:'Low',    day:'Tuesday',  cardCls:'card-amber', badgeCls:'badge-yellow',
    actions:['Irrigate early morning (5–7 AM)','Avoid pesticide spray in peak heat','Mulch soil to retain moisture','Monitor crop wilting signs'] },
  { icon:'🌱', title:'Optimal Sowing Window', severity:'Info',   day:'Tue–Wed',  cardCls:'card-green', badgeCls:'badge-green',
    actions:['Ideal for wheat sowing','Low humidity, good temperature','Soil moisture at optimal level','Apply basal fertilizer before sowing'] },
];

const hourly = [
  { time:'6AM',  temp:22, icon:'🌅', rain:0  },
  { time:'9AM',  temp:25, icon:'☀️', rain:0  },
  { time:'12PM', temp:28, icon:'☀️', rain:5  },
  { time:'3PM',  temp:30, icon:'🌤', rain:10 },
  { time:'6PM',  temp:27, icon:'⛅', rain:15 },
  { time:'9PM',  temp:23, icon:'🌙', rain:5  },
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
        { label:'Rain %',  data:forecast.map(f=>f.rain), borderColor:'#16a34a', backgroundColor:'#16a34a12', borderWidth:2, fill:true,  tension:0.4, pointRadius:3, yAxisID:'y1' },
      ]},
      options:{ responsive:true, maintainAspectRatio:false,
        plugins:{ legend:{ labels:{ color:'#64748b', font:{ size:10 } } }, tooltip:{ backgroundColor:'#1e293b' } },
        scales:{
          x:{ grid:{ color:'#f1f5f9' }, ticks:{ color:'#94a3b8', font:{ size:10 } } },
          y:{ grid:{ color:'#f1f5f9' }, ticks:{ color:'#94a3b8', font:{ size:10 }, callback:v=>v+'°' }, position:'left' },
          y1:{ grid:{ display:false }, ticks:{ color:'#94a3b8', font:{ size:10 }, callback:v=>v+'%' }, position:'right' },
        }
      }
    });
  }, []);
  return <div className="h-52"><canvas ref={ref}/></div>;
}

export default function WeatherPage() {
  const [unit, setUnit]           = useState('C');
  const [activeAlert, setActiveAlert] = useState(0);
  const convert = t => unit === 'C' ? t : Math.round(t * 9/5 + 32);
  const maxTemp = Math.max(...forecast.map(f => f.high));

  return (
    <DashboardLayout title="Weather Alert System" subtitle="Real-time hyperlocal weather intelligence & smart farm alerts">

      {/* Current weather hero */}
      <div className="card p-6 mb-5 bg-gradient-to-r from-blue-50 to-sky-50 border-blue-100">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <span className="text-6xl">⛅</span>
            <div>
              <div className="font-display font-extrabold text-5xl text-slate-900">{convert(28)}°{unit}</div>
              <div className="text-slate-500 text-sm mt-1">Partly Cloudy · Feels like {convert(26)}°</div>
              <div className="flex items-center gap-2 mt-2">
                <span className="badge badge-green">📍 Your Farm · Maharashtra</span>
                <span className="text-slate-400 text-xs">Updated 2 min ago</span>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {[{icon:'💧',l:'Humidity',v:'65%'},{icon:'💨',l:'Wind',v:'14 km/h'},{icon:'👁️',l:'Visibility',v:'10 km'},
              {icon:'🌡️',l:'Dew Point',v:'18°C'},{icon:'🌊',l:'Pressure',v:'1013 hPa'},{icon:'☀️',l:'UV Index',v:'6.2'}].map(i=>(
              <div key={i.l} className="card-flat p-2.5 text-center rounded-xl">
                <div className="text-lg mb-0.5">{i.icon}</div>
                <div className="font-semibold text-slate-800 text-xs">{i.v}</div>
                <div className="text-slate-400 text-xs">{i.l}</div>
              </div>
            ))}
          </div>
          <button onClick={()=>setUnit(u=>u==='C'?'F':'C')} className="btn-secondary px-4 py-2 text-sm rounded-xl self-start">
            Switch to °{unit==='C'?'F':'C'}
          </button>
        </div>
      </div>

      {/* Hourly */}
      <div className="card p-5 mb-5">
        <h3 className="font-semibold text-slate-700 text-sm mb-4">⏰ Hourly Forecast</h3>
        <div className="flex gap-3 overflow-x-auto pb-1">
          {hourly.map((h,i)=>(
            <div key={i} className={`flex-shrink-0 rounded-2xl p-4 text-center min-w-[76px] border ${i===2?'bg-brand-50 border-brand-200':'card-flat'}`}>
              <div className="text-slate-400 text-xs mb-2">{h.time}</div>
              <div className="text-2xl mb-2">{h.icon}</div>
              <div className="font-bold text-slate-800 text-sm">{convert(h.temp)}°</div>
              {h.rain>0 && <div className="text-blue-500 text-xs mt-1">💧{h.rain}%</div>}
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
        <div className="card p-5">
          <h3 className="font-semibold text-slate-700 text-sm mb-4">📊 7-Day Temperature & Rain</h3>
          <TempChart/>
        </div>
        <div className="card p-5">
          <h3 className="font-semibold text-slate-700 text-sm mb-4">📅 7-Day Forecast</h3>
          <div className="space-y-1.5">
            {forecast.map((f,i)=>(
              <div key={i} className={`flex items-center gap-3 p-2.5 rounded-xl transition-colors hover:bg-slate-50 ${i===0?'bg-brand-50 border border-brand-100':''}`}>
                <div className="w-10 text-slate-500 text-xs font-semibold">{f.day}</div>
                <div className="text-xl w-7">{f.icon}</div>
                <div className="flex-1 text-slate-500 text-xs hidden sm:block">{f.desc}</div>
                <div className="text-blue-500 text-xs w-8">{f.rain}%</div>
                <div className="flex items-center gap-1.5 text-xs">
                  <span className="text-blue-500">{convert(f.low)}°</span>
                  <div className="w-12 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-blue-400 to-orange-400 rounded-full" style={{width:`${(f.high/maxTemp)*100}%`}}/>
                  </div>
                  <span className="text-orange-500">{convert(f.high)}°</span>
                </div>
                {f.wind>25 && <span className="badge badge-red text-xs">💨{f.wind}</span>}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Alerts */}
      <div>
        <h3 className="font-semibold text-slate-700 mb-4">🔔 Smart Farm Alert System</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {ALERTS.map((a,i)=>(
            <div key={i} className={`${a.cardCls} rounded-2xl overflow-hidden cursor-pointer border hover-lift ${activeAlert===i?'ring-2 ring-brand-400':''}`}
              onClick={()=>setActiveAlert(activeAlert===i?-1:i)}>
              <div className="p-4 flex items-start gap-3">
                <span className="text-2xl flex-shrink-0">{a.icon}</span>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-slate-800 text-sm">{a.title}</span>
                    <span className={`badge ${a.badgeCls}`}>{a.severity}</span>
                  </div>
                  <div className="text-slate-500 text-xs">{a.day}</div>
                </div>
                <span className="text-slate-400 text-sm">{activeAlert===i?'▲':'▼'}</span>
              </div>
              {activeAlert===i && (
                <div className="px-4 pb-4 border-t border-slate-100 pt-3 animate-fade-in">
                  <div className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-2">Preventive Actions</div>
                  <div className="space-y-1.5">
                    {a.actions.map((action,j)=>(
                      <div key={j} className="flex items-start gap-2">
                        <span className="text-brand-600 text-xs mt-0.5 font-bold">✓</span>
                        <span className="text-slate-600 text-xs">{action}</span>
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
