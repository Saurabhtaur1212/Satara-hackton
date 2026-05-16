import React, { useState, useEffect, useRef } from 'react';
import DashboardLayout from '../components/DashboardLayout';

/* ── Dataset 1: Crop Yield Prediction ── */
const CROP_YIELD_DB = [
  { crop:'Soybean',  state:'Maharashtra', soilType:'Black',     rainfall:720,  temperature:29, predictedYield:'18 quintal/acre', profitEstimate:52000 },
  { crop:'Rice',     state:'West Bengal', soilType:'Clayey',    rainfall:1300, temperature:31, predictedYield:'25 quintal/acre', profitEstimate:65000 },
  { crop:'Wheat',    state:'Punjab',      soilType:'Loamy',     rainfall:480,  temperature:21, predictedYield:'24 quintal/acre', profitEstimate:50000 },
  { crop:'Cotton',   state:'Gujarat',     soilType:'Black',     rainfall:650,  temperature:33, predictedYield:'16 quintal/acre', profitEstimate:72000 },
  { crop:'Tomato',   state:'Karnataka',   soilType:'Sandy Loam',rainfall:600,  temperature:26, predictedYield:'32 quintal/acre', profitEstimate:88000 },
];

/* ── Dataset 6: AI Farming Suggestions ── */
const AI_SUGGESTIONS = {
  Soybean: { suggestion:'Use organic compost for better nitrogen balance.', fertilizer:'DAP + Urea',                  watering:'Water every 4 days' },
  Rice:    { suggestion:'Maintain standing water during early growth stages.', fertilizer:'NPK 20:20:20',             watering:'Continuous irrigation' },
  Tomato:  { suggestion:'Use mulch to reduce soil moisture evaporation.',   fertilizer:'Potassium-rich fertilizer',  watering:'Drip irrigation recommended' },
  Cotton:  { suggestion:'Monitor pest attacks weekly.',                     fertilizer:'Nitrogen fertilizer',        watering:'Water twice weekly' },
  Wheat:   { suggestion:'Avoid over-irrigation during winter.',             fertilizer:'Urea',                       watering:'Moderate irrigation' },
};

const CROP_ICONS = { Soybean:'🫘', Rice:'🍚', Wheat:'🌾', Cotton:'🌿', Tomato:'🍅' };
const CROP_SEASONS = { Soybean:'Kharif', Rice:'Kharif', Wheat:'Rabi', Cotton:'Kharif', Tomato:'Zaid' };
const CROP_DAYS = { Soybean:100, Rice:120, Wheat:120, Cotton:180, Tomato:90 };
const CROP_MARKET = { Soybean:6100, Rice:3200, Wheat:2800, Cotton:7800, Tomato:2800 };
const CROP_DEMAND = { Soybean:'High', Rice:'Medium', Wheat:'Medium', Cotton:'High', Tomato:'Very High' };
const CROP_IRRIGATION = { Soybean:'Every 4 days', Rice:'Continuous', Wheat:'Every 21 days', Cotton:'Twice weekly', Tomato:'Daily drip' };
const CROP_HARVEST = { Soybean:'October', Rice:'November', Wheat:'March–April', Cotton:'January–Feb', Tomato:'December' };

/* ── Risk Factors ── */
const RISK_FACTORS = [
  { label:'Climate Risk', score:52, icon:'🌡️', color:'#d97706', desc:'Moderate rainfall variability expected' },
  { label:'Market Risk',  score:22, icon:'📉', color:'#16a34a', desc:'Stable prices, MSP guaranteed' },
  { label:'Disease Risk', score:35, icon:'🦠', color:'#ef4444', desc:'Pink Bollworm risk in Cotton zone' },
  { label:'Drought Risk', score:38, icon:'🏜️', color:'#d97706', desc:'Moderate — monitor soil moisture' },
];

const soilTypes = ['Black','Clayey','Loamy','Sandy Loam','Red Laterite','Alluvial'];
const seasons   = ['Kharif (Jun–Oct)','Rabi (Nov–Mar)','Zaid (Mar–Jun)'];
const states    = ['Maharashtra','West Bengal','Punjab','Gujarat','Karnataka','Andhra Pradesh','Tamil Nadu'];

/* ── AI Engine: match crops to soil+season+temp+rainfall ── */
function getRecommendations(form) {
  const ph    = parseFloat(form.ph) || 7.0;
  const temp  = parseFloat(form.temp) || 28;
  const rain  = parseFloat(form.rainfall) || 700;
  const soil  = form.soil;
  const season = form.season;

  return CROP_YIELD_DB.map(c => {
    let score = 60;
    if (soil && c.soilType.toLowerCase().includes(soil.toLowerCase().split(' ')[0])) score += 20;
    if (season && CROP_SEASONS[c.crop] && season.includes(CROP_SEASONS[c.crop])) score += 15;
    if (Math.abs(c.temperature - temp) < 5) score += 10;
    if (Math.abs(c.rainfall - rain) < 200) score += 10;
    if (ph >= 6.0 && ph <= 7.5) score += 5;
    score = Math.min(score, 98);

    const ai = AI_SUGGESTIONS[c.crop] || {};
    return {
      name: c.crop,
      icon: CROP_ICONS[c.crop] || '🌱',
      confidence: score,
      profit: c.profitEstimate,
      risk: score > 85 ? 'Low' : score > 70 ? 'Medium' : 'High',
      riskScore: 100 - score,
      season: CROP_SEASONS[c.crop] || 'Kharif',
      water: c.rainfall > 900 ? 'High' : c.rainfall > 600 ? 'Medium' : 'Low',
      waterLiters: Math.round(c.rainfall * 0.8),
      days: CROP_DAYS[c.crop] || 120,
      demand: CROP_DEMAND[c.crop] || 'Medium',
      yield: c.predictedYield,
      marketPrice: CROP_MARKET[c.crop] || 3000,
      state: c.state,
      soilType: c.soilType,
      temperature: c.temperature,
      rainfall: c.rainfall,
      reason: `${c.crop} suits ${c.soilType} soil in ${c.state}. Temp: ${c.temperature}°C, Rainfall: ${c.rainfall}mm. ${ai.suggestion || ''}`,
      irrigation: CROP_IRRIGATION[c.crop] || 'Every 7 days',
      fertilizer: ai.fertilizer || 'NPK balanced',
      harvest: CROP_HARVEST[c.crop] || 'Season end',
      aiSuggestion: ai.suggestion || '',
      wateringAdvice: ai.watering || 'As needed',
    };
  }).sort((a, b) => b.confidence - a.confidence);
}

function ProfitChart({ results }) {
  const ref = useRef();
  useEffect(() => {
    const c = ref.current; if (!c || !window.Chart) return;
    const ex = window.Chart.getChart(c); if (ex) ex.destroy();
    const colors = ['#16a34a','#3b82f6','#f59e0b','#ef4444','#a78bfa'];
    new window.Chart(c, {
      type:'bar',
      data:{ labels: results.map(r=>r.name),
        datasets:[{ data: results.map(r=>r.profit),
          backgroundColor: colors.map(c=>c+'30'),
          borderColor: colors,
          borderWidth:2, borderRadius:8 }] },
      options:{ responsive:true, maintainAspectRatio:false,
        plugins:{ legend:{ display:false }, tooltip:{ backgroundColor:'#0d2010', callbacks:{ label:ctx=>'₹'+ctx.raw.toLocaleString() } } },
        scales:{
          x:{ grid:{ display:false }, ticks:{ color:'rgba(255,255,255,0.5)', font:{ size:10 } } },
          y:{ grid:{ color:'rgba(255,255,255,0.06)' }, ticks:{ color:'rgba(255,255,255,0.4)', font:{ size:10 }, callback:v=>'₹'+(v/1000)+'K' } },
        }
      }
    });
  }, [results]);
  return <div className="h-44"><canvas ref={ref}/></div>;
}

export default function RecommendationPage() {
  const [form, setForm] = useState({ soil:'Black', season:'Kharif (Jun–Oct)', state:'Maharashtra', acres:'5', ph:'6.8', temp:'28', rainfall:'720', nitrogen:'Medium', irrigation:'drip' });
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState(0);
  const [tab, setTab] = useState('crop');
  const set = (k,v) => setForm(f=>({...f,[k]:v}));

  const analyze = e => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => { setResults(getRecommendations(form)); setLoading(false); setSelected(0); }, 1600);
  };

  const crop = results?.[selected];
  const riskBadge = { Low:'badge-green', Medium:'badge-yellow', High:'badge-red' };
  const riskColor = { Low:'#22c55e', Medium:'#f59e0b', High:'#ef4444' };

  return (
    <DashboardLayout title="Crop Yield Prediction Engine" subtitle="AI analyzes soil, weather, temperature & rainfall to predict best crops">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">

        {/* ── Input Panel ── */}
        <div className="lg:col-span-2 space-y-4">
          <div className="card p-5">
            <div className="flex items-center gap-2 mb-5">
              <span className="text-xl">🧪</span>
              <h3 className="font-semibold text-sm" style={{color:'var(--text-1)'}}>Farm Conditions Input</h3>
            </div>
            <form onSubmit={analyze} className="space-y-3">

              {/* State */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{color:'var(--text-3)'}}>State / Region</label>
                <select value={form.state} onChange={e=>set('state',e.target.value)} className="w-full px-3 py-2.5 text-sm">
                  {states.map(s=><option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              {/* Soil + Season */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{color:'var(--text-3)'}}>Soil Type</label>
                  <select value={form.soil} onChange={e=>set('soil',e.target.value)} className="w-full px-3 py-2.5 text-sm">
                    {soilTypes.map(s=><option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{color:'var(--text-3)'}}>Season</label>
                  <select value={form.season} onChange={e=>set('season',e.target.value)} className="w-full px-3 py-2.5 text-sm">
                    {seasons.map(s=><option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>

              {/* Temperature + Rainfall */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{color:'var(--text-3)'}}>Temperature (°C)</label>
                  <input value={form.temp} onChange={e=>set('temp',e.target.value)} placeholder="28" type="number" className="w-full px-3 py-2.5 text-sm"/>
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{color:'var(--text-3)'}}>Rainfall (mm)</label>
                  <input value={form.rainfall} onChange={e=>set('rainfall',e.target.value)} placeholder="720" type="number" className="w-full px-3 py-2.5 text-sm"/>
                </div>
              </div>

              {/* pH + Acres */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{color:'var(--text-3)'}}>Soil pH</label>
                  <input value={form.ph} onChange={e=>set('ph',e.target.value)} placeholder="6.8" type="number" step="0.1" className="w-full px-3 py-2.5 text-sm"/>
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{color:'var(--text-3)'}}>Farm Size (Acres)</label>
                  <input value={form.acres} onChange={e=>set('acres',e.target.value)} placeholder="5" type="number" className="w-full px-3 py-2.5 text-sm"/>
                </div>
              </div>

              {/* Nitrogen */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{color:'var(--text-3)'}}>Nitrogen Level</label>
                <div className="flex gap-2">
                  {['Low','Medium','High'].map(n=>(
                    <button key={n} type="button" onClick={()=>set('nitrogen',n)}
                      className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all border ${form.nitrogen===n?'btn-primary':'btn-ghost'}`}>{n}</button>
                  ))}
                </div>
              </div>

              {/* Irrigation */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{color:'var(--text-3)'}}>Irrigation Type</label>
                <div className="flex gap-2">
                  {['drip','flood','rain-fed'].map(n=>(
                    <button key={n} type="button" onClick={()=>set('irrigation',n)}
                      className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all capitalize border ${form.irrigation===n?'btn-primary':'btn-ghost'}`}>{n}</button>
                  ))}
                </div>
              </div>

              <button type="submit" disabled={loading}
                className={`w-full btn-primary py-3.5 rounded-xl font-semibold flex items-center justify-center gap-2 ${loading?'opacity-70':''}`}>
                {loading ? <><span className="animate-spin">⟳</span> AI Analyzing...</> : '🤖 Predict Best Crops'}
              </button>
            </form>
          </div>

          {/* Risk Panel */}
          <div className="card p-5">
            <div className="flex items-center gap-2 mb-4">
              <span>🛡️</span>
              <h3 className="font-semibold text-sm" style={{color:'var(--text-1)'}}>AI Risk Analysis</h3>
            </div>
            <div className="space-y-3">
              {RISK_FACTORS.map(r=>(
                <div key={r.label}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm">{r.icon}</span>
                      <span className="text-xs" style={{color:'var(--text-2)'}}>{r.label}</span>
                    </div>
                    <span className="text-xs font-bold" style={{color:r.color}}>{r.score<30?'Low':r.score<60?'Medium':'High'}</span>
                  </div>
                  <div className="progress-track h-1.5">
                    <div className="progress-fill h-full" style={{width:`${r.score}%`,background:r.color}}/>
                  </div>
                  <div className="text-xs mt-0.5" style={{color:'var(--text-3)'}}>{r.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Results Panel ── */}
        <div className="lg:col-span-3 space-y-4">
          {!results ? (
            <div className="card p-12 text-center">
              <div className="text-6xl mb-4 animate-float">🌱</div>
              <div className="font-semibold text-lg mb-2" style={{color:'var(--text-1)'}}>AI Ready to Predict</div>
              <div className="text-sm mb-6" style={{color:'var(--text-2)'}}>
                Enter your farm conditions — soil type, temperature, rainfall, and pH — to get AI-powered crop yield predictions with profit estimates.
              </div>
              {/* Dataset preview */}
              <div className="grid grid-cols-1 gap-2 text-left">
                {CROP_YIELD_DB.slice(0,3).map((c,i)=>(
                  <div key={i} className="card-flat rounded-xl p-3 flex items-center gap-3">
                    <span className="text-2xl">{CROP_ICONS[c.crop]}</span>
                    <div className="flex-1">
                      <div className="text-sm font-semibold" style={{color:'var(--text-1)'}}>{c.crop} — {c.state}</div>
                      <div className="text-xs" style={{color:'var(--text-3)'}}>{c.soilType} soil · {c.temperature}°C · {c.rainfall}mm rain</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-bold" style={{color:'#4ade80'}}>{c.predictedYield}</div>
                      <div className="text-xs" style={{color:'var(--text-3)'}}>₹{(c.profitEstimate/1000).toFixed(0)}K profit</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <>
              {/* Crop selector tabs */}
              <div className="flex gap-2 overflow-x-auto pb-1">
                {results.map((r,i)=>(
                  <button key={i} onClick={()=>setSelected(i)}
                    className={`flex-shrink-0 card-flat rounded-xl p-3 text-center transition-all border min-w-[80px] ${selected===i?'border-green-400/60 bg-green-900/20':'hover:border-green-700/40'}`}
                    style={{borderColor: selected===i ? riskColor[r.risk] : undefined}}>
                    <div className="text-2xl mb-1">{r.icon}</div>
                    <div className="text-xs font-semibold" style={{color:'var(--text-1)'}}>{r.name}</div>
                    <div className="text-xs font-bold" style={{color: riskColor[r.risk]}}>{r.confidence}%</div>
                  </button>
                ))}
              </div>

              {/* Tab nav */}
              <div className="flex rounded-xl p-1 gap-1" style={{background:'rgba(0,0,0,0.25)',border:'1px solid rgba(255,255,255,0.08)'}}>
                {[['crop','🌱 Crop Info'],['ai','🤖 AI Insights'],['profit','💰 Profit']].map(([t,l])=>(
                  <button key={t} onClick={()=>setTab(t)}
                    className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all ${tab===t?'btn-primary':'btn-ghost'}`}>{l}</button>
                ))}
              </div>

              {/* Crop Info Tab */}
              {crop && tab==='crop' && (
                <div className="card p-5 animate-fade-in">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <span className="text-5xl">{crop.icon}</span>
                      <div>
                        <h3 className="font-display font-bold text-2xl" style={{color:'#4ade80'}}>{crop.name}</h3>
                        <div className="text-sm" style={{color:'var(--text-3)'}}>{crop.season} · {crop.days} days · {crop.state}</div>
                      </div>
                    </div>
                    <span className={`badge ${riskBadge[crop.risk]}`}>{crop.risk} Risk</span>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
                    {[
                      {l:'Predicted Yield', v:crop.yield,                          c:'#4ade80'},
                      {l:'Est. Profit',     v:`₹${(crop.profit/1000).toFixed(0)}K`,c:'#fbbf24'},
                      {l:'Water Need',      v:`${crop.waterLiters}L/acre`,          c:'#60a5fa'},
                      {l:'Market Price',    v:`₹${crop.marketPrice}/Q`,             c:'#c084fc'},
                      {l:'Market Demand',   v:crop.demand,                          c:'#34d399'},
                      {l:'AI Confidence',   v:`${crop.confidence}%`,                c:'#4ade80'},
                    ].map(item=>(
                      <div key={item.l} className="card-flat rounded-xl p-3 text-center">
                        <div className="font-bold text-sm" style={{color:item.c}}>{item.v}</div>
                        <div className="text-xs" style={{color:'var(--text-3)'}}>{item.l}</div>
                      </div>
                    ))}
                  </div>

                  {/* Soil & Weather match */}
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="card-flat rounded-xl p-3">
                      <div className="text-xs font-semibold mb-2" style={{color:'var(--text-3)'}}>🌡️ Weather Match</div>
                      <div className="flex justify-between text-xs mb-1"><span style={{color:'var(--text-2)'}}>Temperature</span><span style={{color:'#fbbf24'}}>{crop.temperature}°C</span></div>
                      <div className="flex justify-between text-xs"><span style={{color:'var(--text-2)'}}>Rainfall</span><span style={{color:'#60a5fa'}}>{crop.rainfall}mm</span></div>
                    </div>
                    <div className="card-flat rounded-xl p-3">
                      <div className="text-xs font-semibold mb-2" style={{color:'var(--text-3)'}}>🪨 Soil Match</div>
                      <div className="flex justify-between text-xs mb-1"><span style={{color:'var(--text-2)'}}>Soil Type</span><span style={{color:'#f59e0b'}}>{crop.soilType}</span></div>
                      <div className="flex justify-between text-xs"><span style={{color:'var(--text-2)'}}>Best State</span><span style={{color:'#4ade80'}}>{crop.state}</span></div>
                    </div>
                  </div>

                  <div className="card-green rounded-xl p-4">
                    <div className="text-xs font-semibold mb-1" style={{color:'#4ade80'}}>🤖 AI Reasoning</div>
                    <div className="text-sm" style={{color:'var(--text-2)'}}>{crop.reason}</div>
                  </div>
                </div>
              )}

              {/* AI Insights Tab */}
              {crop && tab==='ai' && (
                <div className="card p-5 animate-fade-in space-y-3">
                  <h4 className="font-semibold text-sm" style={{color:'var(--text-1)'}}>🤖 AI Farming Decisions — {crop.name}</h4>
                  {[
                    {icon:'🌱', label:'Crop Selection',      value:crop.name,          reason:`Best match for your conditions with ${crop.confidence}% AI confidence`},
                    {icon:'💧', label:'Irrigation Timing',   value:crop.irrigation,    reason:crop.wateringAdvice},
                    {icon:'🧪', label:'Fertilizer Schedule', value:crop.fertilizer,    reason:'Optimized for your soil nitrogen level'},
                    {icon:'🌾', label:'Harvesting Period',   value:crop.harvest,       reason:'Aligned with market peak price window'},
                    {icon:'💡', label:'AI Suggestion',       value:crop.aiSuggestion,  reason:'Based on crop history and weather patterns'},
                  ].map((d,i)=>(
                    <div key={i} className="card-flat rounded-xl p-4 flex items-start gap-3">
                      <span className="text-2xl flex-shrink-0">{d.icon}</span>
                      <div>
                        <div className="text-xs uppercase tracking-wider" style={{color:'var(--text-3)'}}>{d.label}</div>
                        <div className="font-semibold text-sm mt-0.5" style={{color:'var(--text-1)'}}>{d.value}</div>
                        <div className="text-xs mt-0.5" style={{color:'var(--text-3)'}}>{d.reason}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Profit Tab */}
              {tab==='profit' && (
                <div className="card p-5 animate-fade-in">
                  <h4 className="font-semibold text-sm mb-4" style={{color:'var(--text-1)'}}>💰 Profit Comparison — All Crops</h4>
                  <ProfitChart results={results}/>
                  <div className="space-y-2 mt-4">
                    {results.map((r,i)=>(
                      <div key={i} className="flex items-center gap-3">
                        <span className="text-lg w-6">{r.icon}</span>
                        <span className="text-sm w-20" style={{color:'var(--text-2)'}}>{r.name}</span>
                        <div className="flex-1 progress-track h-2">
                          <div className="progress-fill h-full" style={{width:`${(r.profit/100000)*100}%`,background:riskColor[r.risk]}}/>
                        </div>
                        <span className="text-sm font-bold w-16 text-right" style={{color:'#4ade80'}}>₹{(r.profit/1000).toFixed(0)}K</span>
                        <span className={`badge ${riskBadge[r.risk]} text-xs w-16 text-center`}>{r.yield}</span>
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
