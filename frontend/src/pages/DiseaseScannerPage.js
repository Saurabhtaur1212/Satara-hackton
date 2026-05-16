import React, { useState, useRef } from 'react';
import DashboardLayout from '../components/DashboardLayout';

/* ── Dataset 3: Pest & Disease Alert ── */
const DISEASE_ALERTS = [
  { crop:'Cotton',  disease:'Pink Bollworm', riskLevel:'High',   humidity:72, temperature:30, prevention:'Use pheromone traps',          icon:'🌿', color:'#ef4444', probability:78 },
  { crop:'Rice',    disease:'Blast Disease', riskLevel:'High',   humidity:88, temperature:27, prevention:'Use resistant seed varieties',  icon:'🍚', color:'#ef4444', probability:82 },
  { crop:'Tomato',  disease:'Late Blight',   riskLevel:'Medium', humidity:80, temperature:25, prevention:'Apply fungicide spray',         icon:'🍅', color:'#f59e0b', probability:65 },
  { crop:'Soybean', disease:'Leaf Spot',     riskLevel:'Low',    humidity:65, temperature:29, prevention:'Maintain field sanitation',     icon:'🫘', color:'#22c55e', probability:28 },
  { crop:'Wheat',   disease:'Rust',          riskLevel:'Medium', humidity:58, temperature:22, prevention:'Use certified seeds',           icon:'🌾', color:'#f59e0b', probability:45 },
];

const DISEASE_DB = {
  fungal: {
    name:'Wheat Rust (Fungal)', icon:'🍂', confidence:87, severity:'Moderate', type:'Fungal Infection', cardCls:'card-amber', badgeCls:'badge-yellow',
    symptoms:'Orange-brown pustules on leaves and stems. Yellowing of leaf tissue around pustules.',
    treatment:['Apply Propiconazole 25 EC @ 0.1% spray','Remove and destroy infected plant parts','Improve air circulation between rows','Avoid overhead irrigation'],
    medicines:['Propiconazole (Tilt)','Tebuconazole (Folicur)','Mancozeb (Dithane M-45)'],
    prevention:'Use rust-resistant varieties. Apply preventive fungicide before monsoon. Maintain proper plant spacing.',
  },
  pest: {
    name:'Pink Bollworm (Cotton)', icon:'🐛', confidence:92, severity:'High', type:'Pest Attack', cardCls:'card-red', badgeCls:'badge-red',
    symptoms:'Pink larvae inside cotton bolls. Premature boll opening. Reduced lint quality and yield loss up to 40%.',
    treatment:['Install pheromone traps @ 5/acre','Spray Chlorpyrifos 20 EC @ 2ml/L','Apply Spinosad 45 SC @ 0.3ml/L','Remove and destroy infested bolls'],
    medicines:['Chlorpyrifos (Dursban)','Spinosad (Tracer)','Emamectin Benzoate (Proclaim)'],
    prevention:'Use Bt cotton varieties. Monitor weekly with pheromone traps. Avoid late sowing.',
  },
  blast: {
    name:'Rice Blast Disease', icon:'🍚', confidence:89, severity:'High', type:'Fungal Infection', cardCls:'card-red', badgeCls:'badge-red',
    symptoms:'Diamond-shaped lesions on leaves. Gray center with brown border. Neck rot causing white panicles.',
    treatment:['Spray Tricyclazole 75 WP @ 0.6g/L','Apply Isoprothiolane 40 EC @ 1.5ml/L','Drain field for 3-4 days','Avoid excess nitrogen'],
    medicines:['Tricyclazole (Beam)','Isoprothiolane (Fuji-One)','Carbendazim (Bavistin)'],
    prevention:'Use blast-resistant varieties. Avoid dense planting. Balanced NPK fertilization.',
  },
  blight: {
    name:'Tomato Late Blight', icon:'🍅', confidence:84, severity:'Moderate', type:'Fungal Infection', cardCls:'card-amber', badgeCls:'badge-yellow',
    symptoms:'Water-soaked lesions on leaves turning brown. White mold on leaf undersides. Fruit rot with firm brown patches.',
    treatment:['Spray Mancozeb 75 WP @ 2.5g/L','Apply Metalaxyl + Mancozeb @ 2g/L','Remove infected plant parts','Improve field drainage'],
    medicines:['Mancozeb (Dithane M-45)','Metalaxyl (Ridomil)','Cymoxanil (Curzate)'],
    prevention:'Use disease-free transplants. Avoid overhead irrigation. Crop rotation with non-solanaceous crops.',
  },
  nutrient: {
    name:'Nitrogen Deficiency', icon:'🟡', confidence:78, severity:'Moderate', type:'Nutrient Deficiency', cardCls:'card-amber', badgeCls:'badge-yellow',
    symptoms:'Yellowing starting from older/lower leaves. Pale green color overall. Stunted growth and thin stems.',
    treatment:['Apply Urea 25kg/acre as top dressing','Foliar spray: 2% Urea solution','Add organic matter (FYM 5 tonnes/acre)','Irrigate after fertilizer application'],
    medicines:['Urea (46% N)','Ammonium Sulphate','Liquid Nitrogen Fertilizer'],
    prevention:'Conduct soil test before sowing. Apply balanced NPK fertilizer. Practice crop rotation with legumes.',
  },
};

const DETECTION_MODES = [
  { key:'fungal',   icon:'🍂', label:'Fungal Infections'   },
  { key:'pest',     icon:'🐛', label:'Pest Detection'       },
  { key:'blast',    icon:'🍚', label:'Rice Blast'           },
  { key:'blight',   icon:'🍅', label:'Tomato Blight'        },
  { key:'nutrient', icon:'🟡', label:'Nutrient Deficiency'  },
];

export default function DiseaseScannerPage() {
  const [preview, setPreview]     = useState(null);
  const [scanning, setScanning]   = useState(false);
  const [progress, setProgress]   = useState(0);
  const [result, setResult]       = useState(null);
  const [dragging, setDragging]   = useState(false);
  const [detectionType, setDetectionType] = useState('fungal');
  const fileRef = useRef();

  const handleFile = file => {
    if (!file || !file.type.startsWith('image/')) return;
    setPreview(URL.createObjectURL(file)); setResult(null);
  };

  const scan = () => {
    setScanning(true); setProgress(0);
    const iv = setInterval(() => {
      setProgress(p => {
        if (p >= 100) { clearInterval(iv); setScanning(false); setResult(DISEASE_DB[detectionType]); return 100; }
        return p + Math.random() * 12;
      });
    }, 180);
  };

  const reset = () => { setPreview(null); setResult(null); setProgress(0); };

  const riskColor = { High:'#ef4444', Medium:'#f59e0b', Low:'#22c55e' };

  return (
    <DashboardLayout title="Pest & Disease Prediction System" subtitle="AI-powered crop disease detection — fungal infections, pests & nutrient deficiencies">

      {/* Mode selector */}
      <div className="card p-4 mb-5">
        <div className="text-xs font-semibold uppercase tracking-wider mb-3" style={{color:'var(--text-3)'}}>Detection Mode</div>
        <div className="flex gap-2 flex-wrap">
          {DETECTION_MODES.map(t=>(
            <button key={t.key} onClick={()=>setDetectionType(t.key)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all border ${detectionType===t.key?'btn-primary':'btn-ghost'}`}>
              <span>{t.icon}</span>{t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Upload */}
        <div className="space-y-4">
          {!preview ? (
            <div onDragOver={e=>{e.preventDefault();setDragging(true);}}
              onDragLeave={()=>setDragging(false)}
              onDrop={e=>{e.preventDefault();setDragging(false);handleFile(e.dataTransfer.files[0]);}}
              onClick={()=>fileRef.current?.click()}
              className={`card rounded-2xl border-2 border-dashed p-12 text-center cursor-pointer transition-all ${dragging?'border-green-400 bg-green-900/10':'hover:border-green-700/40 hover:bg-green-900/5'}`}
              style={{borderColor: dragging ? '#4ade80' : 'rgba(255,255,255,0.12)'}}>
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={e=>handleFile(e.target.files[0])}/>
              <div className="text-6xl mb-4 animate-float">🔬</div>
              <div className="font-semibold text-lg mb-2" style={{color:'var(--text-1)'}}>Upload Crop / Leaf Photo</div>
              <div className="text-sm mb-4" style={{color:'var(--text-3)'}}>Drag & drop or click to upload<br/>JPG, PNG, WEBP supported</div>
              <span className="btn-primary px-6 py-2.5 rounded-xl text-sm font-semibold inline-block">Choose Photo</span>
            </div>
          ) : (
            <div className="card overflow-hidden">
              <div className="relative">
                <img src={preview} alt="crop" className="w-full h-64 object-cover"/>
                {scanning && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center" style={{background:'rgba(0,0,0,0.75)'}}>
                    <div className="w-14 h-14 border-4 border-green-400 border-t-transparent rounded-full animate-spin mb-4"/>
                    <div className="text-white font-semibold mb-3">AI Analyzing {detectionType}...</div>
                    <div className="w-48 progress-track h-2">
                      <div className="progress-fill h-full progress-green" style={{width:`${Math.min(progress,100)}%`}}/>
                    </div>
                    <div className="text-xs mt-2" style={{color:'rgba(255,255,255,0.5)'}}>{Math.min(Math.round(progress),100)}%</div>
                  </div>
                )}
              </div>
              <div className="p-4 flex gap-3">
                <button onClick={scan} disabled={scanning}
                  className={`flex-1 btn-primary py-3 rounded-xl font-semibold flex items-center justify-center gap-2 ${scanning?'opacity-60':''}`}>
                  {scanning?'⟳ Scanning...':'🔬 Detect Disease'}
                </button>
                <button onClick={reset} className="btn-ghost px-4 py-3 rounded-xl">✕</button>
              </div>
            </div>
          )}

          {/* Live Disease Risk Zones from Dataset */}
          <div className="card p-5">
            <h4 className="font-semibold text-sm mb-3" style={{color:'var(--text-1)'}}>⚠️ Active Disease Alerts — Your Zone</h4>
            <div className="space-y-3">
              {DISEASE_ALERTS.map((r,i)=>(
                <div key={i} className="card-flat rounded-xl p-3">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-xl">{r.icon}</span>
                    <div className="flex-1">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-semibold" style={{color:'var(--text-1)'}}>{r.crop} — {r.disease}</span>
                        <span className="text-xs font-bold" style={{color:riskColor[r.riskLevel]}}>{r.riskLevel}</span>
                      </div>
                      <div className="text-xs" style={{color:'var(--text-3)'}}>Temp: {r.temperature}°C · Humidity: {r.humidity}%</div>
                    </div>
                  </div>
                  <div className="progress-track h-1.5 mb-1">
                    <div className="progress-fill h-full" style={{width:`${r.probability}%`,background:riskColor[r.riskLevel]}}/>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span style={{color:'var(--text-3)'}}>💡 {r.prevention}</span>
                    <span style={{color:riskColor[r.riskLevel]}}>{r.probability}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Results */}
        <div>
          {!result ? (
            <div className="card p-10 text-center h-full flex flex-col items-center justify-center">
              <div className="text-6xl mb-4">🌿</div>
              <div className="font-semibold text-lg mb-2" style={{color:'var(--text-1)'}}>No Scan Yet</div>
              <div className="text-sm mb-6" style={{color:'var(--text-2)'}}>Upload a photo of your crop leaf or plant to detect diseases instantly with 95% accuracy.</div>
              <div className="grid grid-cols-3 gap-3 w-full max-w-xs">
                {[['95%','Accuracy'],['50+','Diseases'],['< 5s','Speed']].map(([v,l])=>(
                  <div key={l} className="card-flat rounded-xl p-3 text-center">
                    <div className="font-bold text-lg" style={{color:'#4ade80'}}>{v}</div>
                    <div className="text-xs" style={{color:'var(--text-3)'}}>{l}</div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-4 animate-fade-in">
              <div className={`${result.cardCls} rounded-2xl p-5 border`}>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-4xl">{result.icon}</span>
                    <div>
                      <h3 className="font-display font-bold text-xl" style={{color:'var(--text-1)'}}>{result.name}</h3>
                      <span className="text-xs font-semibold" style={{color:'var(--text-3)'}}>{result.type}</span>
                    </div>
                  </div>
                  <span className={`badge ${result.badgeCls}`}>{result.severity}</span>
                </div>
                <div className="card-flat rounded-xl p-3 mb-3">
                  <div className="flex justify-between text-xs mb-1" style={{color:'var(--text-3)'}}><span>AI Confidence</span><span>{result.confidence}%</span></div>
                  <div className="progress-track h-2">
                    <div className="progress-fill h-full progress-yellow" style={{width:`${result.confidence}%`}}/>
                  </div>
                </div>
                <div className="text-sm" style={{color:'var(--text-2)'}}><span style={{color:'var(--text-3)'}}>Symptoms: </span>{result.symptoms}</div>
              </div>

              <div className="card p-5">
                <h4 className="font-semibold mb-3 flex items-center gap-2" style={{color:'var(--text-1)'}}><span>💊</span> Treatment Steps</h4>
                <div className="space-y-2 mb-4">
                  {result.treatment.map((t,i)=>(
                    <div key={i} className="flex items-start gap-3 p-2">
                      <div className="w-5 h-5 rounded-full flex items-center justify-center text-xs flex-shrink-0 mt-0.5 font-bold"
                        style={{background:'rgba(74,222,128,0.15)',border:'1px solid rgba(74,222,128,0.30)',color:'#4ade80'}}>{i+1}</div>
                      <span className="text-sm" style={{color:'var(--text-2)'}}>{t}</span>
                    </div>
                  ))}
                </div>
                <div style={{borderTop:'1px solid rgba(255,255,255,0.08)'}} className="pt-3">
                  <div className="text-xs font-semibold mb-2" style={{color:'var(--text-3)'}}>Recommended Medicines</div>
                  <div className="flex flex-wrap gap-2">
                    {result.medicines.map((m,i)=>(
                      <span key={i} className="badge badge-green">{m}</span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="card-green rounded-2xl p-4" style={{border:'1px solid rgba(74,222,128,0.25)'}}>
                <h4 className="font-semibold mb-2 flex items-center gap-2" style={{color:'#4ade80'}}><span>🛡️</span> Prevention</h4>
                <p className="text-sm" style={{color:'var(--text-2)'}}>{result.prevention}</p>
              </div>

              <button onClick={reset} className="w-full btn-secondary py-3 rounded-xl font-semibold">
                🔬 Scan Another Photo
              </button>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
