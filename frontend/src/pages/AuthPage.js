import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../App';

const LANG_META = {
  en:{native:'English',flag:'🇬🇧'}, hi:{native:'हिंदी',flag:'🇮🇳'}, mr:{native:'मराठी',flag:'🌾'},
  pa:{native:'ਪੰਜਾਬੀ',flag:'🌻'}, te:{native:'తెలుగు',flag:'🌴'}, bn:{native:'বাংলা',flag:'🐯'},
  gu:{native:'ગુજરાતી',flag:'🦁'}, ta:{native:'தமிழ்',flag:'🌺'}, kn:{native:'ಕನ್ನಡ',flag:'🐘'},
  or:{native:'ଓଡ଼ିଆ',flag:'🌊'}, ur:{native:'اردو',flag:'🌙'},
};
const CROPS  = ['Wheat','Rice','Cotton','Sugarcane','Maize','Soybean','Tomato','Onion'];
const STATES = ['Maharashtra','Punjab','Uttar Pradesh','Madhya Pradesh','Rajasthan','Gujarat','Karnataka','Andhra Pradesh'];

/* ── localStorage helpers ── */
const getUsers  = ()      => JSON.parse(localStorage.getItem('ss_users') || '[]');
const saveUsers = (users) => localStorage.setItem('ss_users', JSON.stringify(users));

/* ── Password strength ── */
function getStrength(pw) {
  if (!pw) return { score: 0, label: '', color: '' };
  let score = 0;
  if (pw.length >= 6)  score++;
  if (pw.length >= 10) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  if (score <= 1) return { score, label: 'Weak',   color: '#ef4444', pct: 20  };
  if (score <= 2) return { score, label: 'Fair',   color: '#f59e0b', pct: 45  };
  if (score <= 3) return { score, label: 'Good',   color: '#3b82f6', pct: 65  };
  if (score <= 4) return { score, label: 'Strong', color: '#22c55e', pct: 85  };
  return              { score, label: 'Very Strong', color: '#4ade80', pct: 100 };
}

/* ── Particles ── */
function Particles() {
  const particles = useMemo(() => Array.from({ length: 18 }, (_, i) => ({
    id: i, size: Math.random()*4+2, left: Math.random()*100,
    delay: Math.random()*8, dur: Math.random()*6+7,
  })), []);
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {particles.map(p => (
        <div key={p.id} className="particle" style={{
          width:p.size, height:p.size, left:`${p.left}%`,
          animationDuration:`${p.dur}s`, animationDelay:`${p.delay}s`,
        }}/>
      ))}
    </div>
  );
}

/* ── GPS Popup ── */
function GPSPopup({ onAllow, onSkip }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ background:'rgba(0,0,0,0.75)', backdropFilter:'blur(8px)' }}>
      <div className="gps-popup p-8 max-w-sm w-full text-center animate-slide-up">
        <div className="text-6xl mb-4 animate-float">📍</div>
        <h3 className="font-display font-bold text-white text-xl mb-2">Enable GPS Location</h3>
        <p className="text-green-300 text-sm mb-1 font-medium">SmartSheti AI wants to access your location</p>
        <p className="text-gray-400 text-xs mb-7 leading-relaxed">
          We use your GPS to provide hyperlocal weather forecasts, soil data, and crop recommendations specific to your farm.
        </p>
        <div className="space-y-3">
          <button onClick={onAllow} className="login-btn w-full py-3.5 text-base font-bold rounded-xl flex items-center justify-center gap-2">
            📍 Allow Location Access
          </button>
          <button onClick={onSkip} className="w-full py-3 text-sm font-medium rounded-xl transition-all"
            style={{ color:'rgba(255,255,255,0.50)', background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.12)' }}>
            Skip for now
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Left Info Panel ── */
function InfoPanel() {
  const features = [
    { icon:'🌱', text:'AI Crop Recommendations' },
    { icon:'🔬', text:'Disease Detection (95% accuracy)' },
    { icon:'💰', text:'Profit & Market Predictions' },
    { icon:'🌦️', text:'Hyperlocal Weather Alerts' },
    { icon:'🤖', text:'KisanGPT Voice Assistant' },
  ];
  return (
    <div className="hidden lg:flex flex-col justify-center px-12 py-16 max-w-lg">
      <div className="mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-6"
          style={{ background:'rgba(74,222,128,0.15)', border:'1px solid rgba(74,222,128,0.30)' }}>
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"/>
          <span className="text-green-300 text-xs font-semibold tracking-wider uppercase">AI-Powered Platform</span>
        </div>
        <h1 className="font-display font-black text-5xl text-white leading-tight mb-4">
          Farm Smarter.<br/>
          <span style={{ background:'linear-gradient(135deg,#4ade80,#22c55e,#86efac)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>
            Earn Better.
          </span>
        </h1>
        <p className="text-gray-300 text-base leading-relaxed">
          India's most advanced AI farming platform — giving every farmer the power of data, intelligence, and technology.
        </p>
      </div>
      <div className="space-y-3 mb-10">
        {features.map((f,i) => (
          <div key={i} className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
              style={{ background:'rgba(22,163,74,0.20)', border:'1px solid rgba(74,222,128,0.25)' }}>
              {f.icon}
            </div>
            <span className="text-gray-200 text-sm font-medium">{f.text}</span>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-3 gap-4">
        {[{val:'2.4L+',label:'Farmers'},{val:'95%',label:'Accuracy'},{val:'11',label:'Languages'}].map(s => (
          <div key={s.label} className="text-center p-3 rounded-2xl"
            style={{ background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.10)' }}>
            <div className="font-display font-black text-2xl text-green-400">{s.val}</div>
            <div className="text-gray-400 text-xs mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Main Auth Component ── */
export default function AuthPage() {
  const [tab, setTab]           = useState('login');
  const [form, setForm]         = useState({ username:'', name:'', password:'', confirmPass:'', state:'', crop:'', acres:'' });
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [locating, setLocating] = useState(false);
  const [location, setLocation] = useState(null);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');
  const [success, setSuccess]   = useState('');
  const [showGPS, setShowGPS]   = useState(false);
  const [pendingUser, setPendingUser] = useState(null);
  const { setUser, lang }       = useAuth();
  const navigate                = useNavigate();
  const langMeta                = LANG_META[lang] || LANG_META.en;
  const strength                = getStrength(form.password);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const detectGPS = () => {
    setLocating(true);
    navigator.geolocation?.getCurrentPosition(
      pos => { setLocation({ lat:pos.coords.latitude.toFixed(4), lng:pos.coords.longitude.toFixed(4) }); setLocating(false); },
      ()  => { setLocation({ lat:'18.5204', lng:'73.8567' }); setLocating(false); }
    );
  };

  /* ── LOGIN ── */
  const handleLogin = () => {
    setError('');
    if (!form.username.trim()) { setError('Please enter your username or phone number.'); return; }
    if (!form.password)        { setError('Please enter your password.'); return; }

    const users = getUsers();
    const found = users.find(u =>
      (u.username.toLowerCase() === form.username.toLowerCase() ||
       u.phone === form.username) &&
      u.password === form.password
    );

    if (!found) {
      setError('Invalid username or password. Please try again.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setPendingUser({ name:found.name, username:found.username, phone:found.phone, state:found.state, crop:found.crop, acres:found.acres });
      setShowGPS(true);
    }, 800);
  };

  /* ── REGISTER ── */
  const handleRegister = () => {
    setError('');
    if (!form.username.trim())  { setError('Username is required.'); return; }
    if (form.username.length < 4) { setError('Username must be at least 4 characters.'); return; }
    if (!/^[a-zA-Z0-9_]+$/.test(form.username)) { setError('Username can only contain letters, numbers and underscore.'); return; }
    if (!form.name.trim())      { setError('Full name is required.'); return; }
    if (!form.password)         { setError('Password is required.'); return; }
    if (form.password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    if (form.password !== form.confirmPass) { setError('Passwords do not match.'); return; }

    const users = getUsers();
    if (users.find(u => u.username.toLowerCase() === form.username.toLowerCase())) {
      setError('Username already taken. Please choose another.'); return;
    }

    const newUser = {
      username: form.username.trim(),
      name:     form.name.trim(),
      password: form.password,
      phone:    '',
      state:    form.state,
      crop:     form.crop,
      acres:    form.acres,
      createdAt: new Date().toISOString(),
    };
    saveUsers([...users, newUser]);
    setSuccess('Account created! You can now login.');
    setTab('login');
    setForm(f => ({ ...f, username: newUser.username, password: '', confirmPass: '' }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (tab === 'login') handleLogin();
    else handleRegister();
  };

  const handleGPSAllow = () => {
    navigator.geolocation?.getCurrentPosition(
      pos => { setUser({ ...pendingUser, gps:{ lat:pos.coords.latitude.toFixed(4), lng:pos.coords.longitude.toFixed(4) } }); navigate('/dashboard'); },
      ()  => { setUser(pendingUser); navigate('/dashboard'); }
    );
  };
  const handleGPSSkip = () => { setUser(pendingUser); navigate('/dashboard'); };

  const inp = "login-input px-4 py-3 text-sm";
  const sel = "login-input px-3 py-3 text-sm";

  return (
    <div className="auth-bg flex min-h-screen">
      <Particles />
      {showGPS && <GPSPopup onAllow={handleGPSAllow} onSkip={handleGPSSkip} />}

      {/* Left panel */}
      <div className="relative z-10 flex-1 flex items-center">
        <InfoPanel />
      </div>

      {/* Right — login card */}
      <div className="relative z-10 flex items-center justify-center w-full lg:w-auto px-4 py-10 lg:px-16">
        <div className="w-full max-w-md animate-slide-up">
          <div className="login-glass p-8 relative overflow-hidden">
            <div className="scan-line" />

            {/* Logo */}
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-3 logo-glow"
                style={{ background:'linear-gradient(135deg,#15803d,#22c55e)' }}>
                <span className="text-2xl">🌿</span>
              </div>
              <h2 className="font-display font-black text-2xl text-white mb-0.5">SmartSheti <span className="text-green-400">AI</span></h2>
              <p className="text-gray-400 text-xs">India's Smartest Farming Platform</p>
              <div className="flex items-center justify-center gap-2 mt-2">
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold"
                  style={{ background:'rgba(74,222,128,0.15)', border:'1px solid rgba(74,222,128,0.30)', color:'#4ade80' }}>
                  <span>{langMeta.flag}</span> {langMeta.native}
                </div>
                <button onClick={() => navigate('/select-language')} className="text-xs underline underline-offset-2"
                  style={{ color:'rgba(255,255,255,0.40)' }}>Change</button>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex p-1 rounded-xl mb-5 gap-1"
              style={{ background:'rgba(0,0,0,0.25)', border:'1px solid rgba(255,255,255,0.08)' }}>
              {['login','register'].map(t => (
                <button key={t} onClick={() => { setTab(t); setError(''); setSuccess(''); }}
                  className={`flex-1 py-2.5 text-sm font-semibold transition-all capitalize ${tab===t?'login-tab-active':'login-tab-inactive'}`}>
                  {t === 'login' ? '🔑 Login' : '🌱 Register'}
                </button>
              ))}
            </div>

            {/* Success message */}
            {success && (
              <div className="px-4 py-2.5 rounded-xl text-sm text-center font-medium mb-4"
                style={{ background:'rgba(34,197,94,0.15)', border:'1px solid rgba(74,222,128,0.35)', color:'#4ade80' }}>
                ✅ {success}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3.5">

              {/* USERNAME */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5"
                  style={{ color:'rgba(255,255,255,0.55)' }}>
                  👤 {tab === 'login' ? 'Username or Phone' : 'Username *'}
                </label>
                <input value={form.username} onChange={e => set('username', e.target.value)}
                  placeholder={tab === 'login' ? 'Enter username or phone' : 'e.g. ramesh_farmer'}
                  className={inp} autoComplete="username"/>
                {tab === 'register' && form.username.length > 0 && (
                  <div className="text-xs mt-1" style={{ color: /^[a-zA-Z0-9_]{4,}$/.test(form.username) ? '#4ade80' : '#f87171' }}>
                    {/^[a-zA-Z0-9_]{4,}$/.test(form.username) ? '✓ Valid username' : '✗ Min 4 chars, letters/numbers/underscore only'}
                  </div>
                )}
              </div>

              {/* FULL NAME — register only */}
              {tab === 'register' && (
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5"
                    style={{ color:'rgba(255,255,255,0.55)' }}>Full Name *</label>
                  <input value={form.name} onChange={e => set('name', e.target.value)}
                    placeholder="Ramesh Kumar" className={inp}/>
                </div>
              )}

              {/* PASSWORD */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider"
                    style={{ color:'rgba(255,255,255,0.55)' }}>🔒 Password *</label>
                  {tab === 'login' && (
                    <button type="button" className="text-xs" style={{ color:'rgba(74,222,128,0.80)' }}>
                      Forgot password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <input value={form.password} onChange={e => set('password', e.target.value)}
                    placeholder="••••••••" type={showPass ? 'text' : 'password'}
                    className={inp} style={{ paddingRight:'44px' }} autoComplete={tab==='login'?'current-password':'new-password'}/>
                  <button type="button" onClick={() => setShowPass(s => !s)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-base"
                    style={{ color:'rgba(255,255,255,0.40)' }}>
                    {showPass ? '🙈' : '👁️'}
                  </button>
                </div>
                {/* Password strength — register only */}
                {tab === 'register' && form.password.length > 0 && (
                  <div className="mt-2">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs" style={{ color:'rgba(255,255,255,0.40)' }}>Password strength</span>
                      <span className="text-xs font-semibold" style={{ color: strength.color }}>{strength.label}</span>
                    </div>
                    <div className="h-1.5 rounded-full overflow-hidden" style={{ background:'rgba(255,255,255,0.10)' }}>
                      <div className="h-full rounded-full transition-all duration-300"
                        style={{ width:`${strength.pct}%`, background: strength.color }}/>
                    </div>
                    <div className="text-xs mt-1" style={{ color:'rgba(255,255,255,0.30)' }}>
                      Use uppercase, numbers & symbols for a stronger password
                    </div>
                  </div>
                )}
              </div>

              {/* CONFIRM PASSWORD — register only */}
              {tab === 'register' && (
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5"
                    style={{ color:'rgba(255,255,255,0.55)' }}>🔒 Confirm Password *</label>
                  <div className="relative">
                    <input value={form.confirmPass} onChange={e => set('confirmPass', e.target.value)}
                      placeholder="Re-enter password" type={showConfirm ? 'text' : 'password'}
                      className={inp} style={{ paddingRight:'44px' }} autoComplete="new-password"/>
                    <button type="button" onClick={() => setShowConfirm(s => !s)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-base"
                      style={{ color:'rgba(255,255,255,0.40)' }}>
                      {showConfirm ? '🙈' : '👁️'}
                    </button>
                  </div>
                  {form.confirmPass.length > 0 && (
                    <div className="text-xs mt-1" style={{ color: form.password === form.confirmPass ? '#4ade80' : '#f87171' }}>
                      {form.password === form.confirmPass ? '✓ Passwords match' : '✗ Passwords do not match'}
                    </div>
                  )}
                </div>
              )}

              {/* REGISTER EXTRA FIELDS */}
              {tab === 'register' && (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5"
                        style={{ color:'rgba(255,255,255,0.55)' }}>State</label>
                      <select value={form.state} onChange={e => set('state', e.target.value)} className={sel}>
                        <option value="">Select</option>
                        {STATES.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5"
                        style={{ color:'rgba(255,255,255,0.55)' }}>Main Crop</label>
                      <select value={form.crop} onChange={e => set('crop', e.target.value)} className={sel}>
                        <option value="">Select</option>
                        {CROPS.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5"
                      style={{ color:'rgba(255,255,255,0.55)' }}>Farm Size (Acres)</label>
                    <input value={form.acres} onChange={e => set('acres', e.target.value)}
                      placeholder="e.g. 5" type="number" className={inp}/>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5"
                      style={{ color:'rgba(255,255,255,0.55)' }}>GPS Location</label>
                    <button type="button" onClick={detectGPS}
                      className={`w-full py-3 text-sm font-semibold rounded-xl flex items-center justify-center gap-2 transition-all ${locating ? 'opacity-60' : ''}`}
                      style={{ background:'rgba(22,163,74,0.15)', border:'1.5px solid rgba(74,222,128,0.35)', color:'#4ade80' }}>
                      {locating ? <><span className="animate-spin">⟳</span> Detecting...</>
                        : location ? <>📍 {location.lat}, {location.lng}</>
                        : <>📍 Detect My Location</>}
                    </button>
                  </div>
                </>
              )}

              {/* ERROR */}
              {error && (
                <div className="px-4 py-2.5 rounded-xl text-sm text-center font-medium"
                  style={{ background:'rgba(239,68,68,0.15)', border:'1px solid rgba(239,68,68,0.35)', color:'#fca5a5' }}>
                  ⚠️ {error}
                </div>
              )}

              {/* SUBMIT */}
              <button type="submit" disabled={loading}
                className={`login-btn w-full py-4 text-base font-bold rounded-xl flex items-center justify-center gap-2 mt-1 ${loading ? 'opacity-70' : ''}`}>
                {loading
                  ? <><span className="animate-spin text-xl">⟳</span> Processing...</>
                  : tab === 'login' ? '🚀 Login to Dashboard' : '🌱 Create My Farm Account'
                }
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-3 my-4">
              <div className="flex-1 h-px" style={{ background:'rgba(255,255,255,0.10)' }}/>
              <span className="text-xs" style={{ color:'rgba(255,255,255,0.25)' }}>or</span>
              <div className="flex-1 h-px" style={{ background:'rgba(255,255,255,0.10)' }}/>
            </div>

            {/* Switch tab */}
            <p className="text-center text-xs" style={{ color:'rgba(255,255,255,0.40)' }}>
              {tab === 'login' ? "Don't have an account? " : 'Already registered? '}
              <button onClick={() => { setTab(tab === 'login' ? 'register' : 'login'); setError(''); setSuccess(''); }}
                className="font-bold" style={{ color:'#4ade80' }}>
                {tab === 'login' ? 'Register Free →' : 'Login →'}
              </button>
            </p>
          </div>

          <p className="text-center mt-4 text-xs" style={{ color:'rgba(255,255,255,0.25)' }}>
            🔒 Secured · 🌿 Built for Indian Farmers · 🤖 Powered by AI
          </p>
        </div>
      </div>
    </div>
  );
}
