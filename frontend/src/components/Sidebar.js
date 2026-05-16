import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth, LANG_LIST } from '../App';

const navGroups = [
  { label: 'Overview', items: [
    { path: '/dashboard',       icon: '▦',  label: 'Dashboard' },
    { path: '/agents',          icon: '🧠', label: 'AI Agents' },
  ]},
  { label: 'Intelligence', items: [
    { path: '/recommendations', icon: '🌱', label: 'Crop Prediction' },
    { path: '/market',          icon: '📈', label: 'Market Trends' },
    { path: '/disease-scanner', icon: '🔬', label: 'Disease Scanner' },
  ]},
  { label: 'Farm Tools', items: [
    { path: '/weather',         icon: '🌤', label: 'Weather Alerts' },
    { path: '/water',           icon: '💧', label: 'Water Management' },
    { path: '/fertilizer',      icon: '🧪', label: 'Fertilizer Guide' },
    { path: '/sustainability',  icon: '♻️', label: 'Sustainability' },
  ]},
  { label: 'Assistant', items: [
    { path: '/chatbot',         icon: '🤖', label: 'KisanGPT' },
    { path: '/select-language', icon: '🌐', label: 'Change Language' },
  ]},
];

export default function Sidebar({ open, onClose }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, setUser, lang, setLang } = useAuth();

  const go = (path) => { navigate(path); onClose?.(); };

  return (
    <>
      {open && (
        <div className="fixed inset-0 bg-black/60 z-30 lg:hidden" onClick={onClose} />
      )}
      <aside className={`fixed top-0 left-0 h-full w-60 z-40 sidebar flex flex-col transition-transform duration-300
        ${open ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>

        {/* Logo */}
        <div className="px-5 py-4 flex items-center gap-2.5" style={{ borderBottom: '1px solid var(--border)' }}>
          <div className="w-8 h-8 rounded-lg btn-primary flex items-center justify-center text-base flex-shrink-0">🌿</div>
          <div>
            <div className="font-display font-bold text-sm leading-tight" style={{ color: 'var(--text-1)' }}>SmartSheti AI</div>
            <div className="text-xs font-medium" style={{ color: 'var(--green)' }}>Smart Farming</div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-2 overflow-y-auto">
          {navGroups.map(group => (
            <div key={group.label}>
              <div className="sidebar-group-label">{group.label}</div>
              {group.items.map(item => (
                <button
                  key={item.path}
                  onClick={() => go(item.path)}
                  className={`sidebar-link ${location.pathname === item.path ? 'active' : ''}`}
                >
                  <span className="text-base w-5 text-center leading-none">{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          ))}
        </nav>

        {/* Language */}
        <div className="px-4 py-3" style={{ borderTop: '1px solid var(--border)' }}>
          <div className="text-xs font-bold uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-3)' }}>Language</div>
          <select
            value={lang}
            onChange={e => setLang(e.target.value)}
            className="w-full text-xs px-2.5 py-1.5 rounded-lg"
            style={{ background: 'var(--bg-card2)', border: '1px solid var(--border)', color: 'var(--text-1)' }}
          >
            {LANG_LIST.map(l => (
              <option key={l.code} value={l.code}>{l.flag} {l.native}</option>
            ))}
          </select>
        </div>

        {/* User */}
        <div className="px-4 py-3" style={{ borderTop: '1px solid var(--border)' }}>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full btn-primary flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
              {user?.name?.[0]?.toUpperCase() || 'F'}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold truncate" style={{ color: 'var(--text-1)' }}>{user?.name || 'Farmer'}</div>
              <div className="text-xs truncate" style={{ color: 'var(--text-3)' }}>{user?.state || 'India'} · {user?.acres || '5'} acres</div>
            </div>
            <button
              onClick={() => setUser(null)}
              className="text-sm transition-colors hover:text-red-400"
              style={{ color: 'var(--text-3)' }}
              title="Logout"
            >⏻</button>
          </div>
        </div>
      </aside>
    </>
  );
}
