import React, { useState, useEffect, useCallback } from 'react';

/* ── Reverse geocode via OpenStreetMap Nominatim (free, no key) ── */
async function reverseGeocode(lat, lng) {
  const res = await fetch(
    `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&addressdetails=1`,
    { headers: { 'Accept-Language': 'en' } }
  );
  if (!res.ok) throw new Error('Geocoding failed');
  const data = await res.json();
  const a = data.address || {};
  return {
    village:  a.village || a.hamlet || a.suburb || a.neighbourhood || '',
    city:     a.city || a.town || a.county || '',
    district: a.county || a.state_district || '',
    state:    a.state || '',
    country:  a.country || '',
    postcode: a.postcode || '',
    display:  data.display_name || '',
  };
}

/* ── Live weather via Open-Meteo (free, no API key) ── */
async function fetchWeather(lat, lng) {
  const res = await fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}` +
    `&current=temperature_2m,relative_humidity_2m,wind_speed_10m,precipitation_probability,weather_code` +
    `&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max` +
    `&timezone=auto&forecast_days=3`
  );
  if (!res.ok) throw new Error('Weather fetch failed');
  const d = await res.json();
  const c = d.current;
  const wc = c.weather_code;
  const icon =
    wc === 0 ? '☀️' : wc <= 3 ? '⛅' : wc <= 48 ? '🌫️' :
    wc <= 67 ? '🌧️' : wc <= 77 ? '🌨️' : wc <= 82 ? '🌦️' :
    wc <= 99 ? '⛈️' : '🌤';
  const desc =
    wc === 0 ? 'Clear Sky' : wc <= 3 ? 'Partly Cloudy' : wc <= 48 ? 'Foggy' :
    wc <= 67 ? 'Rainy' : wc <= 77 ? 'Snowy' : wc <= 82 ? 'Showers' :
    wc <= 99 ? 'Thunderstorm' : 'Cloudy';
  return {
    temp:     Math.round(c.temperature_2m),
    humidity: c.relative_humidity_2m,
    wind:     Math.round(c.wind_speed_10m),
    rainProb: c.precipitation_probability,
    icon, desc,
    maxTemp:  Math.round(d.daily.temperature_2m_max[0]),
    minTemp:  Math.round(d.daily.temperature_2m_min[0]),
  };
}

/* ── Crop insight engine based on location + weather ── */
function getCropInsights(address, weather) {
  const state = (address?.state || '').toLowerCase();
  const temp  = weather?.temp || 28;
  const rain  = weather?.rainProb || 30;

  const stateMap = {
    maharashtra: ['Soybean 🫘','Cotton 🌿','Sugarcane 🌾','Onion 🧅'],
    punjab:      ['Wheat 🌾','Rice 🍚','Maize 🌽','Mustard 🌻'],
    'uttar pradesh': ['Wheat 🌾','Sugarcane 🌾','Rice 🍚','Potato 🥔'],
    gujarat:     ['Cotton 🌿','Groundnut 🥜','Wheat 🌾','Cumin 🌿'],
    karnataka:   ['Ragi 🌾','Maize 🌽','Sunflower 🌻','Cotton 🌿'],
    'andhra pradesh': ['Rice 🍚','Cotton 🌿','Chilli 🌶️','Groundnut 🥜'],
    'tamil nadu':['Rice 🍚','Banana 🍌','Sugarcane 🌾','Groundnut 🥜'],
    rajasthan:   ['Bajra 🌾','Mustard 🌻','Wheat 🌾','Cumin 🌿'],
    'madhya pradesh': ['Soybean 🫘','Wheat 🌾','Gram 🫘','Cotton 🌿'],
    'west bengal':['Rice 🍚','Jute 🌿','Potato 🥔','Mustard 🌻'],
  };

  const crops = stateMap[state] || ['Wheat 🌾','Rice 🍚','Maize 🌽','Soybean 🫘'];
  const bestCrop = crops[0];

  let advice = '';
  if (rain > 70)  advice = '🌧️ Heavy rain likely — avoid sowing, check drainage';
  else if (rain > 40) advice = '🌦️ Moderate rain — good for transplanting';
  else if (temp > 35) advice = '🌡️ High heat — irrigate early morning, mulch soil';
  else if (temp < 15) advice = '❄️ Cool weather — ideal for Rabi crops';
  else advice = '✅ Optimal conditions — good time for field work';

  return { crops: crops.slice(0, 4), bestCrop, advice };
}

/* ── Accuracy label ── */
function accuracyLabel(acc) {
  if (!acc) return { label: 'Unknown', color: '#6b7280' };
  if (acc < 20)  return { label: 'Excellent', color: '#4ade80' };
  if (acc < 100) return { label: 'Good',      color: '#22c55e' };
  if (acc < 500) return { label: 'Fair',      color: '#fbbf24' };
  return              { label: 'Poor',       color: '#f87171' };
}

/* ── Pulse ring animation ── */
function PulseRing() {
  return (
    <div className="relative flex items-center justify-center w-12 h-12">
      {[1,2,3].map(i => (
        <div key={i} className="absolute rounded-full border border-green-400"
          style={{
            width: `${i*16}px`, height: `${i*16}px`,
            opacity: 0.6 / i,
            animation: `ping ${1 + i*0.3}s cubic-bezier(0,0,0.2,1) infinite`,
            animationDelay: `${i*0.2}s`,
          }}/>
      ))}
      <div className="w-4 h-4 rounded-full bg-green-400 z-10 shadow-lg"
        style={{ boxShadow: '0 0 12px rgba(74,222,128,0.8)' }}/>
    </div>
  );
}

const LS_KEY = 'ss_gps_cache';

export default function GPSLocationCard() {
  const [status,  setStatus]  = useState('idle'); // idle | loading | success | denied | error
  const [coords,  setCoords]  = useState(null);
  const [address, setAddress] = useState(null);
  const [weather, setWeather] = useState(null);
  const [accuracy,setAccuracy]= useState(null);
  const [errMsg,  setErrMsg]  = useState('');
  const [lastUpdated, setLastUpdated] = useState(null);

  /* Load cached location on mount */
  useEffect(() => {
    const cached = localStorage.getItem(LS_KEY);
    if (cached) {
      try {
        const { coords: c, address: a, weather: w, accuracy: ac, ts } = JSON.parse(cached);
        setCoords(c); setAddress(a); setWeather(w); setAccuracy(ac);
        setLastUpdated(new Date(ts));
        setStatus('success');
      } catch {}
    }
  }, []);

  const detect = useCallback(() => {
    if (!navigator.geolocation) {
      setStatus('error'); setErrMsg('Geolocation is not supported by your browser.');
      return;
    }
    setStatus('loading'); setErrMsg('');

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = +pos.coords.latitude.toFixed(6);
        const lng = +pos.coords.longitude.toFixed(6);
        const acc = Math.round(pos.coords.accuracy);
        setCoords({ lat, lng }); setAccuracy(acc);

        try {
          const [addr, wx] = await Promise.all([
            reverseGeocode(lat, lng),
            fetchWeather(lat, lng),
          ]);
          setAddress(addr); setWeather(wx);
          const ts = new Date();
          setLastUpdated(ts);
          setStatus('success');
          localStorage.setItem(LS_KEY, JSON.stringify({ coords:{lat,lng}, address:addr, weather:wx, accuracy:acc, ts }));
        } catch (e) {
          setStatus('error');
          setErrMsg('Could not fetch location details. Check your internet connection.');
        }
      },
      (err) => {
        if (err.code === 1) { setStatus('denied');  setErrMsg('Location permission denied. Please allow access in browser settings.'); }
        else if (err.code === 2) { setStatus('error'); setErrMsg('Location unavailable. Please try again.'); }
        else { setStatus('error'); setErrMsg('Location request timed out. Please try again.'); }
      },
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 60000 }
    );
  }, []);

  /* Auto-detect on first load if no cache */
  useEffect(() => {
    const cached = localStorage.getItem(LS_KEY);
    if (!cached) detect();
  }, [detect]);

  const insights = status === 'success' ? getCropInsights(address, weather) : null;
  const accInfo  = accuracyLabel(accuracy);

  /* ── LOADING STATE ── */
  if (status === 'loading') {
    return (
      <div className="card p-6 mb-5">
        <div className="flex items-center gap-4">
          <PulseRing />
          <div>
            <div className="font-semibold text-sm mb-1" style={{ color:'var(--text-1)' }}>Detecting Your Location...</div>
            <div className="text-xs" style={{ color:'var(--text-3)' }}>Fetching GPS coordinates, weather & local insights</div>
          </div>
          <div className="ml-auto">
            <div className="flex gap-1">
              {['GPS','Weather','Insights'].map((s,i) => (
                <div key={s} className="text-xs px-2 py-1 rounded-full"
                  style={{ background:'rgba(74,222,128,0.10)', border:'1px solid rgba(74,222,128,0.20)', color:'rgba(74,222,128,0.60)',
                    animation:`pulse 1.5s ease-in-out ${i*0.3}s infinite` }}>
                  {s}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ── DENIED / ERROR STATE ── */
  if (status === 'denied' || status === 'error') {
    return (
      <div className="card p-5 mb-5" style={{ border:'1px solid rgba(248,113,113,0.25)', background:'rgba(239,68,68,0.06)' }}>
        <div className="flex items-start gap-4">
          <div className="text-3xl flex-shrink-0">{status === 'denied' ? '🚫' : '⚠️'}</div>
          <div className="flex-1">
            <div className="font-semibold text-sm mb-1" style={{ color:'#f87171' }}>
              {status === 'denied' ? 'Location Access Denied' : 'Location Error'}
            </div>
            <div className="text-xs mb-3" style={{ color:'var(--text-3)' }}>{errMsg}</div>
            {status === 'denied' && (
              <div className="text-xs mb-3 p-3 rounded-xl" style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)', color:'var(--text-2)' }}>
                💡 To enable: Click the 🔒 lock icon in your browser address bar → Site Settings → Location → Allow
              </div>
            )}
            <button onClick={detect} className="btn-primary px-4 py-2 text-xs rounded-lg">
              🔄 Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* ── IDLE STATE ── */
  if (status === 'idle') {
    return (
      <div className="card p-5 mb-5">
        <div className="flex items-center gap-4">
          <div className="text-4xl">📍</div>
          <div className="flex-1">
            <div className="font-semibold text-sm mb-1" style={{ color:'var(--text-1)' }}>GPS Location Not Detected</div>
            <div className="text-xs" style={{ color:'var(--text-3)' }}>Enable GPS to get hyperlocal weather, crop recommendations & farming insights.</div>
          </div>
          <button onClick={detect} className="btn-primary px-4 py-2.5 text-xs rounded-xl flex items-center gap-2 flex-shrink-0">
            📍 Detect Location
          </button>
        </div>
      </div>
    );
  }

  /* ── SUCCESS STATE ── */
  return (
    <div className="card p-5 mb-5" style={{ border:'1px solid rgba(74,222,128,0.20)' }}>
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
              style={{ background:'rgba(74,222,128,0.15)', border:'1px solid rgba(74,222,128,0.30)' }}>
              📍
            </div>
            <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-green-400"
              style={{ animation:'ping 2s cubic-bezier(0,0,0.2,1) infinite', boxShadow:'0 0 6px rgba(74,222,128,0.8)' }}/>
          </div>
          <div>
            <div className="font-display font-bold text-base" style={{ color:'var(--text-1)' }}>
              {address?.city || address?.village || 'Your Location'}
              {address?.state ? `, ${address.state}` : ''}
            </div>
            <div className="text-xs" style={{ color:'var(--text-3)' }}>
              {address?.district ? `${address.district} · ` : ''}{address?.country || 'India'}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-xs px-2 py-1 rounded-full" style={{ background:'rgba(74,222,128,0.12)', border:'1px solid rgba(74,222,128,0.25)', color:'#4ade80' }}>
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block mr-1" style={{ animation:'pulse 2s infinite' }}/>
            Live GPS
          </div>
          <button onClick={detect} title="Refresh location"
            className="w-8 h-8 rounded-lg flex items-center justify-center text-sm transition-all hover-lift"
            style={{ background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.10)', color:'var(--text-2)' }}>
            🔄
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

        {/* Coordinates + Accuracy */}
        <div className="rounded-xl p-4" style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)' }}>
          <div className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color:'rgba(74,222,128,0.70)' }}>
            📡 GPS Coordinates
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs" style={{ color:'var(--text-3)' }}>Latitude</span>
              <span className="font-mono text-xs font-bold" style={{ color:'var(--text-1)' }}>{coords?.lat}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs" style={{ color:'var(--text-3)' }}>Longitude</span>
              <span className="font-mono text-xs font-bold" style={{ color:'var(--text-1)' }}>{coords?.lng}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs" style={{ color:'var(--text-3)' }}>Accuracy</span>
              <span className="text-xs font-bold" style={{ color: accInfo.color }}>
                ±{accuracy}m · {accInfo.label}
              </span>
            </div>
            {address?.postcode && (
              <div className="flex justify-between items-center">
                <span className="text-xs" style={{ color:'var(--text-3)' }}>Pincode</span>
                <span className="text-xs font-bold" style={{ color:'var(--text-1)' }}>{address.postcode}</span>
              </div>
            )}
            {lastUpdated && (
              <div className="text-xs mt-2 pt-2" style={{ color:'var(--text-3)', borderTop:'1px solid rgba(255,255,255,0.06)' }}>
                🕐 {lastUpdated.toLocaleTimeString('en-IN', { hour:'2-digit', minute:'2-digit' })}
              </div>
            )}
          </div>
        </div>

        {/* Live Weather */}
        {weather && (
          <div className="rounded-xl p-4" style={{ background:'rgba(59,130,246,0.08)', border:'1px solid rgba(96,165,250,0.20)' }}>
            <div className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color:'rgba(96,165,250,0.80)' }}>
              🌦 Live Weather
            </div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-3xl">{weather.icon}</span>
              <div>
                <div className="font-display font-bold text-2xl" style={{ color:'var(--text-1)' }}>{weather.temp}°C</div>
                <div className="text-xs" style={{ color:'var(--text-3)' }}>{weather.desc}</div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {[
                { l:'Humidity',  v:`${weather.humidity}%`,  c:'#60a5fa' },
                { l:'Wind',      v:`${weather.wind} km/h`,  c:'#60a5fa' },
                { l:'Rain Prob', v:`${weather.rainProb}%`,  c: weather.rainProb > 60 ? '#f87171' : '#fbbf24' },
                { l:'Max/Min',   v:`${weather.maxTemp}°/${weather.minTemp}°`, c:'#60a5fa' },
              ].map(w => (
                <div key={w.l} className="rounded-lg p-2 text-center"
                  style={{ background:'rgba(255,255,255,0.04)' }}>
                  <div className="font-bold text-xs" style={{ color: w.c }}>{w.v}</div>
                  <div className="text-xs" style={{ color:'var(--text-3)' }}>{w.l}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Hyperlocal Crop Insights */}
        {insights && (
          <div className="rounded-xl p-4" style={{ background:'rgba(34,197,94,0.08)', border:'1px solid rgba(74,222,128,0.20)' }}>
            <div className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color:'rgba(74,222,128,0.80)' }}>
              🌱 Local Crop Insights
            </div>
            <div className="mb-3">
              <div className="text-xs mb-1" style={{ color:'var(--text-3)' }}>Best crop for your location</div>
              <div className="font-display font-bold text-sm" style={{ color:'#4ade80' }}>{insights.bestCrop}</div>
            </div>
            <div className="mb-3">
              <div className="text-xs mb-1.5" style={{ color:'var(--text-3)' }}>Recommended crops</div>
              <div className="flex flex-wrap gap-1.5">
                {insights.crops.map(c => (
                  <span key={c} className="text-xs px-2 py-0.5 rounded-full"
                    style={{ background:'rgba(74,222,128,0.12)', border:'1px solid rgba(74,222,128,0.25)', color:'#4ade80' }}>
                    {c}
                  </span>
                ))}
              </div>
            </div>
            <div className="text-xs p-2 rounded-lg" style={{ background:'rgba(255,255,255,0.04)', color:'var(--text-2)' }}>
              {insights.advice}
            </div>
          </div>
        )}
      </div>

      {/* Full address strip */}
      {address?.display && (
        <div className="mt-3 text-xs px-3 py-2 rounded-lg truncate"
          style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.06)', color:'var(--text-3)' }}>
          📌 {address.display}
        </div>
      )}
    </div>
  );
}
