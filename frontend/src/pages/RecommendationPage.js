import React, { useState, useEffect, useRef } from 'react';
import DashboardLayout from '../components/DashboardLayout';

const cropResults = [
  { name:'Wheat',    icon:'🌾', confidence:94, profit:42000, risk:'Low',    riskScore:18, season:'Rabi', water:'Medium', waterLiters:550, days:120, demand:'High',   yield:'22 Q/acre', marketPrice:2275, reason:'Ideal for black cotton soil with pH 6.8. Winter season optimal. High MSP support.', irrigation:'Every 21 days', fertilizer:'Urea 50kg + DAP 25kg', harvest:'March–April' },
  { name:'Chickpea', icon:'🫘', confidence:87, profit:35000, risk:'Low',    riskScore:14, season:'Rabi', water:'Low',    waterLiters:350, days:100, demand:'High',   yield:'8 Q/acre',  marketPrice:5440, reason:'Drought-tolerant, fixes nitrogen. Excellent for soil health. Strong market demand.', irrigation:'Every 30 days', fertilizer:'DAP 20kg + Rhizobium', harvest:'February–March' },
  { name:'Mustard',  icon:'🌻', confidence:79, profit:28000, risk:'Medium', riskScore:42, season:'Rabi', water:'Low',    waterLiters:400, days:90,  demand:'Medium', yield:'6 Q/acre',  marketPrice:5650, reason:'Fast growing, good for crop rotation. Moderate market demand. Low water need.', irrigation:'Every 25 days', fertilizer:'Urea 30kg + SSP 25kg', harvest:'February' },
];
const RISK_FACTORS = [
  { label:'Climate Risk', score:52, icon:'🌡️', color:'#d97706', desc:'Moderate rainfall variability expected' },
  { label:'Market Risk',  score:22, icon:'📉', color:'#16a34a', desc:'Stable prices, MSP guaranteed' },
  { label:'Disease Risk', score:18, icon:'🦠', color:'#16a34a', desc:'Low fungal risk this season' },
  { label:'Drought Risk', score:38, icon:'🏜️', color:'#d97706', desc:'Moderate — monitor soil moisture' },
];
const soilTypes = ['Black Cotton','Red Laterite','Alluvial','Sandy Loam','Clay','Loamy'];
const seasons   = ['Kharif (Jun–Oct)','Rabi (Nov–Mar)','Zaid (Mar–Jun)'];

function ProfitChart({ results }) {
  const ref = useRef();
  useEffect(() => {
    const c = ref.current; if (!c || !window.Chart) return;
    const ex = window.Chart.getChart(c); if (ex) ex.destroy();
    new window.Chart(c, {
      type:'bar',
      data:{ labels:results.map(r=>r.name),
        datasets:[{ data:results.map(r=>r.profit), backgroundColor:['#16a34a30','#3b82f630','#f59e0b30'], borderColor:['#16a34a','#3b82f6','#f59e0b'], borderWidth:2, borderRadius:8 }] },
      options:{ responsive:true, maintainAspectRatio:false,
        plugins:{ legend:{ display:false }, tooltip:{ backgroundColor:'#1e293b', callbacks:{ label:ctx=>'₹'+ctx.raw.toLocaleString() } } },
        scales:{
          x:{ grid:{ display:false }, ticks:{ color:'#64748b', font:{ size:11 } } },
          y:{ grid:{ color:'#f1f5f9' }, ticks:{ color:'#94a3b8', font:{ size:10 }, callback:v=>'₹'+(v/1000)+'K' } },
        }
      }
    });
  }, [results]);
  return <div className="h-40"><canvas ref={ref}/></div>;
}

export default function RecommendationPage() {
  const [form, setForm] = useState({ soil:'', season:'', acres:'5', ph:'6.8', nitrogen:'Medium', irrigation:'drip' });
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState(0);
  const [tab, setTab] = useState('crop');
  const set = (k,v) => setForm(f=>({...f,[k]:v}));

  const analyze = e => { e.preventDefault(); setLoading(true); setTimeout(()=>{ setResults(cropResults); setLoading(false); },1800); };
  const crop = results?.[selected];
  const riskBadge = { Low:'badge-green', Medium:'badge-yellow', High:'badge-red' };

  return (
    <DashboardLayout title="Profitable Crop Prediction Engine" subtitle="AI analyzes weather, soil, market & history to maximize your profit">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">

        {/* Input */}
        <div className="lg:col-span-2 space-y-4">
          <div className="card p-5">
            <div className="flex items-center gap-2 mb-5">
              <span className="text-xl">🧪</span>
              <h3 className="font-semibold text-slate-800">Farm Analysis Input</h3>
            </div>
            <form onSubmit={analyze} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Soil Type</label>
                <select value={form.soil} onChange={e=>set('soil',e.target.value)} className="w-full px-3 py-2.5 text-sm">
                  <option value="">Select soil type</option>
                  {soilTypes.map(s=><option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Season</label>
                <select value={form.season} onChange={e=>set('season',e.target.value)} className="w-full px-3 py-2.5 text-sm">
                  <option value="">Select season</option>
                  {seasons.map(s=><option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Acres</label>
                  <input value={form.acres} onChange={e=>set('acres',e.target.value)} placeholder="5" type="number" className="w-full px-3 py-2.5 text-sm"/>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Soil pH</label>
                  <input value={form.ph} onChange={e=>set('ph',e.target.value)} placeholder="6.8" type="number" step="0.1" className="w-full px-3 py-2.5 text-sm"/>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Nitrogen Level</label>
                <div className="flex gap-2">
                  {['Low','Medium','High'].map(n=>(
                    <button key={n} type="button" onClick={()=>set('nitrogen',n)}
                      className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all border ${form.nitrogen===n?'btn-primary border-brand-600':'btn-ghost'}`}>{n}</button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Irrigation</label>
                <div className="flex gap-2">
                  {['drip','flood','rain-fed'].map(n=>(
                    <button key={n} type="button" onClick={()=>set('irrigation',n)}
                      className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all capitalize border ${form.irrigation===n?'btn-primary border-brand-600':'btn-ghost'}`}>{n}</button>
                  ))}
                </div>
              </div>
              <button type="submit" disabled={loading}
                className={`w-full btn-primary py-3.5 rounded-xl font-semibold flex items-center justify-center gap-2 ${loading?'opacity-70':''}`}>
                {loading?<><span className="animate-spin">⟳</span> AI Analyzing...</>:'🤖 Run AI Prediction Engine'}
              </button>
            </form>
          </div>

          <div className="card p-5">
            <div className="flex items-center gap-2 mb-4"><span>🛡️</span><h3 className="font-semibold text-slate-800 text-sm">AI Risk System</h3></div>
            <div className="space-y-3">
              {RISK_FACTORS.map(r=>(
                <div key={r.label}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2"><span className="text-sm">{r.icon}</span><span className="text-slate-600 text-xs">{r.label}</span></div>
                    <span className="text-xs font-bold" style={{color:r.color}}>{r.score<30?'Low':r.score<60?'Medium':'High'}</span>
                  </div>
                  <div className="progress-track h-1.5">
                    <div className="progress-fill h-full" style={{width:`${r.score}%`,background:r.color}}/>
                  </div>
                  <div className="text-slate-400 text-xs mt-0.5">{r.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="lg:col-span-3 space-y-4">
          {!results ? (
            <div className="card p-12 text-center">
              <div className="text-6xl mb-4 animate-float">🌱</div>
              <div className="font-semibold text-slate-800 text-lg mb-2">AI Ready to Analyze</div>
              <div className="text-slate-500 text-sm">Fill farm details and run the AI Prediction Engine to get crop recommendations, profit estimates, and risk analysis.</div>
            </div>
          ) : (
            <>
              <div className="flex gap-3">
                {results.map((r,i)=>(
                  <button key={i} onClick={()=>setSelected(i)}
                    className={`flex-1 card-flat rounded-xl p-3 text-center transition-all border ${selected===i?'border-brand-400 bg-brand-50':'border-slate-200 hover:border-brand-200'}`}>
                    <div className="text-2xl mb-1">{r.icon}</div>
                    <div className="text-slate-800 text-xs font-semibold">{r.name}</div>
                    <div className="text-brand-600 text-xs">{r.confidence}%</div>
                  </button>
                ))}
              </div>

              <div className="flex bg-slate-100 rounded-xl p-1 gap-1">
                {[['crop','🌱 Crop Info'],['decision','🤖 AI Decisions'],['profit','💰 Profit']].map(([t,l])=>(
                  <button key={t} onClick={()=>setTab(t)}
                    className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all ${tab===t?'bg-white text-brand-700 shadow-card':'text-slate-500 hover:text-slate-700'}`}>{l}</button>
                ))}
              </div>

              {crop && tab==='crop' && (
                <div className="card p-5 animate-fade-in">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <span className="text-5xl">{crop.icon}</span>
                      <div>
                        <h3 className="font-display font-bold text-2xl text-brand-700">{crop.name}</h3>
                        <div className="text-slate-500 text-sm">{crop.season} · {crop.days} days</div>
                      </div>
                    </div>
                    <span className={`badge ${riskBadge[crop.risk]}`}>{crop.risk} Risk</span>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
                    {[
                      {l:'Expected Yield',v:crop.yield,       c:'text-brand-600'},
                      {l:'Est. Profit',   v:`₹${(crop.profit/1000).toFixed(0)}K`,c:'text-amber-600'},
                      {l:'Water Need',    v:`${crop.waterLiters}L/acre`,c:'text-blue-600'},
                      {l:'Market Price',  v:`₹${crop.marketPrice}/Q`,c:'text-purple-600'},
                      {l:'Market Demand', v:crop.demand,      c:'text-emerald-600'},
                      {l:'AI Confidence', v:`${crop.confidence}%`,c:'text-brand-600'},
                    ].map(item=>(
                      <div key={item.l} className="card-flat rounded-xl p-3 text-center">
                        <div className={`font-bold text-sm ${item.c}`}>{item.v}</div>
                        <div className="text-slate-400 text-xs">{item.l}</div>
                      </div>
                    ))}
                  </div>
                  <div className="card-green rounded-xl p-4">
                    <div className="text-brand-700 text-xs font-semibold mb-1">🤖 AI Reasoning</div>
                    <div className="text-slate-600 text-sm">{crop.reason}</div>
                  </div>
                </div>
              )}

              {crop && tab==='decision' && (
                <div className="card p-5 animate-fade-in space-y-3">
                  <h4 className="font-semibold text-slate-800 text-sm">🤖 Optimized Farming Decisions — {crop.name}</h4>
                  {[
                    {icon:'🌱',label:'Crop Selection',    value:crop.name,       reason:`Best match for your soil & season with ${crop.confidence}% confidence`},
                    {icon:'💧',label:'Irrigation Timing', value:crop.irrigation, reason:'Based on soil moisture & weather forecast'},
                    {icon:'🧪',label:'Fertilizer Schedule',value:crop.fertilizer,reason:'Optimized for your soil nitrogen level'},
                    {icon:'🌾',label:'Harvesting Period',  value:crop.harvest,   reason:'Aligned with market peak price window'},
                  ].map((d,i)=>(
                    <div key={i} className="card-flat rounded-xl p-4 flex items-start gap-3">
                      <span className="text-2xl flex-shrink-0">{d.icon}</span>
                      <div>
                        <div className="text-slate-400 text-xs uppercase tracking-wider">{d.label}</div>
                        <div className="text-slate-800 font-semibold text-sm mt-0.5">{d.value}</div>
                        <div className="text-slate-400 text-xs mt-0.5">{d.reason}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {tab==='profit' && (
                <div className="card p-5 animate-fade-in">
                  <h4 className="font-semibold text-slate-800 text-sm mb-4">💰 Profit Comparison</h4>
                  <ProfitChart results={results}/>
                  <div className="space-y-3 mt-4">
                    {results.map((r,i)=>(
                      <div key={i} className="flex items-center gap-3">
                        <span className="text-lg w-6">{r.icon}</span>
                        <span className="text-slate-600 text-sm w-20">{r.name}</span>
                        <div className="flex-1 progress-track h-2">
                          <div className="progress-fill h-full progress-green" style={{width:`${(r.profit/50000)*100}%`}}/>
                        </div>
                        <span className="text-brand-600 text-sm font-bold w-16 text-right">₹{(r.profit/1000).toFixed(0)}K</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
