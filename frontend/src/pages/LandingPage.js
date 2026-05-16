import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, LANG_LIST } from '../App';

const features = [
  { icon: '🌱', title: 'AI Crop Recommendation', desc: 'Personalized crop suggestions based on soil, weather & market trends.' },
  { icon: '🔬', title: 'Disease Detection', desc: 'Upload a photo — AI identifies crop diseases with 95% accuracy instantly.' },
  { icon: '🌦️', title: 'Smart Weather Alerts', desc: 'Hyperlocal forecasts, storm warnings, and smart irrigation scheduling.' },
  { icon: '💰', title: 'Profit Prediction', desc: 'AI-powered market analysis to maximize your harvest income.' },
  { icon: '🤖', title: 'KisanGPT Assistant', desc: 'Ask anything in Hindi, Marathi, Punjabi, Telugu & 7 more languages.' },
  { icon: '📍', title: 'GPS Field Mapping', desc: 'Map your fields, track soil zones and monitor crop health remotely.' },
];

const stats = [
  { value: '2.4L+', label: 'Farmers Empowered' },
  { value: '95%',   label: 'Disease Accuracy' },
  { value: '₹18K',  label: 'Avg Income Boost' },
  { value: '11',    label: 'Languages Supported' },
];

const steps = [
  { step: '01', title: 'Choose Language', desc: 'Select your preferred language from 11 Indian languages.' },
  { step: '02', title: 'Register Your Farm', desc: 'Add your location, soil type, and crop details.' },
  { step: '03', title: 'Get AI Insights', desc: 'Receive crop recommendations, weather alerts & profit predictions.' },
];

export default function LandingPage() {
  const navigate = useNavigate();
  const { lang } = useAuth();
  const currentLang = LANG_LIST?.find(l => l.code === lang);

  return (
    <div className="landing-bg text-slate-800 overflow-x-hidden">

      {/* Navbar */}
      <nav className="bg-white border-b border-slate-100 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl btn-primary flex items-center justify-center text-lg">🌿</div>
            <span className="font-display font-bold text-slate-800 text-lg">
              SmartSheti <span className="text-brand-600">AI</span>
            </span>
          </div>

          <div className="hidden md:flex items-center gap-7 text-sm text-slate-500 font-medium">
            <a href="#features" className="hover:text-brand-600 transition-colors">Features</a>
            <a href="#how"      className="hover:text-brand-600 transition-colors">How it Works</a>
            <a href="#stats"    className="hover:text-brand-600 transition-colors">Impact</a>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/select-language')}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 text-xs font-medium hover:bg-slate-50 transition-colors"
            >
              <span>{currentLang?.flag || '🇮🇳'}</span>
              <span>{currentLang?.native || 'EN'}</span>
            </button>
            <button onClick={() => navigate('/login')} className="btn-ghost text-sm px-4 py-2">Login</button>
            <button onClick={() => navigate('/login')} className="btn-primary text-sm px-5 py-2">Get Started →</button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 pt-20 pb-16 flex flex-col lg:flex-row items-center gap-14">
        <div className="flex-1 animate-slide-up">
          <div className="inline-flex items-center gap-2 bg-brand-50 border border-brand-200 text-brand-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-500 animate-pulse" />
            Powered by AI & Machine Learning
          </div>

          <h1 className="font-display font-extrabold text-4xl md:text-5xl lg:text-6xl text-slate-900 leading-tight mb-5">
            Farm Smarter.<br />
            <span className="text-brand-600">Earn Better.</span>
          </h1>

          <p className="text-slate-500 text-lg leading-relaxed mb-8 max-w-lg">
            SmartSheti AI brings cutting-edge intelligence to every Indian farmer — crop recommendations, disease detection, weather insights, and profit predictions in your language.
          </p>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => navigate('/login')}
              className="btn-primary px-7 py-3 text-base font-semibold rounded-xl shadow-green"
            >
              🚀 Start Farming Smart
            </button>
            <button
              onClick={() => navigate('/select-language')}
              className="btn-secondary px-7 py-3 text-base font-semibold rounded-xl"
            >
              🌐 Choose Language
            </button>
          </div>

          <div className="flex items-center gap-5 mt-8">
            {['Hindi', 'Marathi', 'Punjabi', 'Telugu', '+7 more'].map(l => (
              <span key={l} className="text-xs text-slate-400 font-medium">{l}</span>
            ))}
          </div>
        </div>

        {/* Hero dashboard preview */}
        <div className="flex-1 w-full max-w-md animate-fade-in">
          <div className="card p-5 shadow-card-lg">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="font-display font-bold text-slate-800 text-sm">Farm Dashboard</div>
                <div className="text-slate-400 text-xs">Today's Overview</div>
              </div>
              <span className="badge badge-green">AI Active</span>
            </div>
            <div className="grid grid-cols-2 gap-3 mb-4">
              {[
                { icon: '🌱', label: 'Soil Health', val: '87%',  color: 'text-brand-600' },
                { icon: '💧', label: 'Moisture',    val: '62%',  color: 'text-blue-600' },
                { icon: '☀️', label: 'UV Index',    val: '6.2',  color: 'text-amber-600' },
                { icon: '💰', label: 'Est. Profit', val: '₹42K', color: 'text-emerald-600' },
              ].map(item => (
                <div key={item.label} className="card-flat p-3 hover-lift">
                  <div className="text-2xl mb-1">{item.icon}</div>
                  <div className={`font-display font-bold text-xl ${item.color}`}>{item.val}</div>
                  <div className="text-slate-400 text-xs">{item.label}</div>
                </div>
              ))}
            </div>
            <div className="card-green p-3 rounded-xl">
              <div className="text-xs font-semibold text-brand-700 mb-1">🤖 AI Recommendation</div>
              <div className="text-slate-600 text-xs">Sow Wheat by Nov 20 — optimal soil & weather conditions detected.</div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section id="stats" className="bg-brand-600 py-14 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map(s => (
            <div key={s.label} className="text-center">
              <div className="stat-number text-4xl text-white mb-1">{s.value}</div>
              <div className="text-brand-200 text-sm">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="section-label mb-2">AI-Powered Features</div>
            <h2 className="font-display font-bold text-3xl md:text-4xl text-slate-900">Everything a Farmer Needs</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f, i) => (
              <div key={i} className="card p-6 hover-lift group">
                <div className="w-12 h-12 bg-brand-50 border border-brand-100 rounded-xl flex items-center justify-center text-2xl mb-4 group-hover:bg-brand-100 transition-colors">
                  {f.icon}
                </div>
                <h3 className="font-display font-semibold text-slate-800 text-base mb-2">{f.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="py-20 px-6 bg-slate-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="section-label mb-2">Simple Process</div>
            <h2 className="font-display font-bold text-3xl text-slate-900">Get Started in 3 Steps</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {steps.map((s, i) => (
              <div key={i} className="card p-6 text-center hover-lift">
                <div className="w-12 h-12 rounded-full bg-brand-600 text-white font-display font-bold text-lg flex items-center justify-center mx-auto mb-4">
                  {s.step}
                </div>
                <h3 className="font-display font-semibold text-slate-800 mb-2">{s.title}</h3>
                <p className="text-slate-500 text-sm">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-2xl mx-auto text-center card p-12 shadow-card-lg">
          <div className="text-5xl mb-5">🌿</div>
          <h2 className="font-display font-bold text-3xl text-slate-900 mb-3">Ready to Transform Your Farm?</h2>
          <p className="text-slate-500 mb-8">Join 2.4 lakh farmers already using SmartSheti AI to grow more, earn more, and waste less.</p>
          <button onClick={() => navigate('/login')} className="btn-primary px-10 py-3.5 text-base font-semibold rounded-xl shadow-green">
            🚀 Join SmartSheti AI — Free
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 py-8 px-6 text-center text-slate-500 text-sm">
        © 2025 SmartSheti AI · Built for Indian Farmers · Powered by AI
      </footer>
    </div>
  );
}
