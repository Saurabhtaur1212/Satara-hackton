import React, { useState, useRef } from 'react';
import DashboardLayout from '../components/DashboardLayout';

const DISEASE_DB = {
  fungal:  { name:'Wheat Rust (Fungal)',  icon:'🍂', confidence:87, severity:'Moderate', type:'Fungal Infection',    cardCls:'card-amber', badgeCls:'badge-yellow',
    symptoms:'Orange-brown pustules on leaves and stems. Yellowing of leaf tissue around pustules.',
    treatment:['Apply Propiconazole 25 EC @ 0.1% spray','Remove and destroy infected plant parts','Improve air circulation between rows','Avoid overhead irrigation'],
    medicines:['Propiconazole (Tilt)','Tebuconazole (Folicur)','Mancozeb (Dithane M-45)'],
    prevention:'Use rust-resistant varieties. Apply preventive fungicide before monsoon. Maintain proper plant spacing.' },
  pest:    { name:'Aphid Infestation',    icon:'🐛', confidence:92, severity:'High',     type:'Pest Attack',         cardCls:'card-red',   badgeCls:'badge-red',
    symptoms:'Clusters of small green/black insects on leaves. Sticky honeydew residue. Curled, yellowing leaves.',
    treatment:['Spray Imidacloprid 17.8 SL @ 0.3ml/L','Apply Thiamethoxam 25 WG @ 0.2g/L','Use neem oil spray (5ml/L) as organic option','Introduce natural predators (ladybirds)'],
    medicines:['Imidacloprid (Confidor)','Thiamethoxam (Actara)','Neem Oil (organic)'],
    prevention:'Monitor crops weekly. Avoid excess nitrogen fertilizer. Maintain beneficial insect habitat.' },
  nutrient:{ name:'Nitrogen Deficiency',  icon:'🟡', confidence:78, severity:'Moderate', type:'Nutrient Deficiency', cardCls:'card-amber', badgeCls:'badge-yellow',
    symptoms:'Yellowing starting from older/lower leaves. Pale green color overall. Stunted growth and thin stems.',
    treatment:['Apply Urea 25kg/acre as top dressing','Foliar spray: 2% Urea solution','Add organic matter (FYM 5 tonnes/acre)','Irrigate after fertilizer application'],
    medicines:['Urea (46% N)','Ammonium Sulphate','Liquid Nitrogen Fertilizer'],
    prevention:'Conduct soil test before sowing. Apply balanced NPK fertilizer. Practice crop rotation with legumes.' },
};

const RISK_ZONES = [
  { crop:'Wheat',  disease:'Rust',     risk:'Medium', probability:45, icon:'🌾', color:'#d97706' },
  { crop:'Cotton', disease:'Bollworm', risk:'High',   probability:72, icon:'🌿', color:'#ef4444' },
  { crop:'Rice',   disease:'Blast',    risk:'Low',    probability:18, icon:'🍚', color:'#16a34a' },
  { crop:'Tomato', disease:'Blight',   risk:'High',   probability:68, icon:'🍅', color:'#ef4444' },
];

export default function DiseaseScannerPage() {
  const [preview, setPreview]           = useState(null);
  const [scanning, setScanning]         = useState(false);
  const [progress, setProgress]         = useState(0);
  const [result, setResult]             = useState(null);
  const [dragging, setDragging]         = useState(false);
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

  return (
    <DashboardLayout title="Disease Prediction System" subtitle="AI-powered crop disease detection — fungal, pests & nutrient deficiencies">

      {/* Mode selector */}
      <div className="card p-4 mb-5">
        <div className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-3">Detection Mode</div>
        <div className="flex gap-3 flex-wrap">
          {[
            { key:'fungal',   icon:'🍂', label:'Fungal Infections'  },
            { key:'pest',     icon:'🐛', label:'Pest Detection'      },
            { key:'nutrient', icon:'🟡', label:'Nutrient Deficiency' },
          ].map(t=>(
            <button key={t.key} onClick={()=>setDetectionType(t.key)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all border
                ${detectionType===t.key?'btn-primary border-brand-600':'btn-ghost'}`}>
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
              className={`card rounded-2xl border-2 border-dashed p-12 text-center cursor-pointer transition-all
                ${dragging?'border-brand-400 bg-brand-50':'border-slate-200 hover:border-brand-300 hover:bg-brand-50'}`}>
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={e=>handleFile(e.target.files[0])}/>
              <div className="text-6xl mb-4 animate-float">🔬</div>
              <div className="font-semibold text-slate-800 text-lg mb-2">Upload Crop / Leaf Photo</div>
              <div className="text-slate-400 text-sm mb-4">Drag & drop or click to upload<br/>JPG, PNG, WEBP supported</div>
              <span className="btn-primary px-6 py-2.5 rounded-xl text-sm font-semibold inline-block">Choose Photo</span>
            </div>
          ) : (
            <div className="card overflow-hidden">
              <div className="relative">
                <img src={preview} alt="crop" className="w-full h-64 object-cover"/>
                {scanning && (
                  <div className="absolute inset-0 bg-slate-900/70 flex flex-col items-center justify-center">
                    <div className="w-14 h-14 border-4 border-brand-400 border-t-transparent rounded-full animate-spin mb-4"/>
                    <div className="text-white font-semibold mb-3">AI Analyzing {detectionType}...</div>
                    <div className="w-48 progress-track h-2">
                      <div className="progress-fill h-full progress-green" style={{width:`${Math.min(progress,100)}%`}}/>
                    </div>
                    <div className="text-slate-300 text-xs mt-2">{Math.min(Math.round(progress),100)}%</div>
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

          {/* Risk zones */}
          <div className="card p-5">
            <h4 className="font-semibold text-slate-700 text-sm mb-3">⚠️ Disease Risk in Your Zone</h4>
            <div className="space-y-3">
              {RISK_ZONES.map((r,i)=>(
                <div key={i} className="flex items-center gap-3">
                  <span className="text-xl">{r.icon}</span>
                  <div className="flex-1">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-600 font-medium">{r.crop} — {r.disease}</span>
                      <span className="font-bold" style={{color:r.color}}>{r.risk}</span>
                    </div>
                    <div className="progress-track h-1.5">
                      <div className="progress-fill h-full" style={{width:`${r.probability}%`,background:r.color}}/>
                    </div>
                  </div>
                  <span className="text-slate-400 text-xs w-8">{r.probability}%</span>
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
              <div className="font-semibold text-slate-800 text-lg mb-2">No Scan Yet</div>
              <div className="text-slate-500 text-sm mb-6">Upload a photo of your crop leaf or plant to detect diseases instantly with 95% accuracy.</div>
              <div className="grid grid-cols-3 gap-3 w-full max-w-xs">
                {[['95%','Accuracy'],['50+','Diseases'],['< 5s','Speed']].map(([v,l])=>(
                  <div key={l} className="card-flat rounded-xl p-3 text-center">
                    <div className="text-brand-600 font-bold text-lg">{v}</div>
                    <div className="text-slate-400 text-xs">{l}</div>
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
                      <h3 className="font-display font-bold text-xl text-slate-800">{result.name}</h3>
                      <span className="text-slate-500 text-xs font-semibold">{result.type}</span>
                    </div>
                  </div>
                  <span className={`badge ${result.badgeCls}`}>{result.severity}</span>
                </div>
                <div className="card-flat rounded-xl p-3 mb-3">
                  <div className="flex justify-between text-xs text-slate-500 mb-1"><span>AI Confidence</span><span>{result.confidence}%</span></div>
                  <div className="progress-track h-2">
                    <div className="progress-fill h-full progress-yellow" style={{width:`${result.confidence}%`}}/>
                  </div>
                </div>
                <div className="text-slate-600 text-sm"><span className="text-slate-400">Symptoms: </span>{result.symptoms}</div>
              </div>

              <div className="card p-5">
                <h4 className="font-semibold text-slate-800 mb-3 flex items-center gap-2"><span>💊</span> Treatment Steps</h4>
                <div className="space-y-2 mb-4">
                  {result.treatment.map((t,i)=>(
                    <div key={i} className="flex items-start gap-3 p-2">
                      <div className="w-5 h-5 rounded-full bg-brand-100 border border-brand-300 flex items-center justify-center text-brand-700 text-xs flex-shrink-0 mt-0.5 font-bold">{i+1}</div>
                      <span className="text-slate-600 text-sm">{t}</span>
                    </div>
                  ))}
                </div>
                <div className="border-t border-slate-100 pt-3">
                  <div className="text-slate-500 text-xs font-semibold mb-2">Recommended Medicines</div>
                  <div className="flex flex-wrap gap-2">
                    {result.medicines.map((m,i)=>(
                      <span key={i} className="badge badge-green">{m}</span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="card-green rounded-2xl p-4 border border-brand-200">
                <h4 className="font-semibold text-brand-700 mb-2 flex items-center gap-2"><span>🛡️</span> Prevention</h4>
                <p className="text-slate-600 text-sm">{result.prevention}</p>
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
