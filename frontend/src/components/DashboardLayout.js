import React, { useState } from 'react';
import Sidebar from './Sidebar';
import { useAuth } from '../App';

export default function DashboardLayout({ children, title, subtitle }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifOpen, setNotifOpen]     = useState(false);
  const { user } = useAuth();

  const alerts = [
    { icon: '⚠️', text: 'Heavy rain expected Thursday',    time: '2h ago',  color: '#fbbf24' },
    { icon: '🔬', text: 'Rust risk detected in your zone', time: '5h ago',  color: '#f87171' },
    { icon: '💰', text: 'Wheat MSP increased to ₹2,275',  time: '1d ago',  color: '#4ade80' },
  ];

  return (
    <div className="page-bg flex">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 lg:ml-60 flex flex-col min-h-screen">
        {/* Topbar */}
        <header className="topbar sticky top-0 z-20 px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-xl transition-colors"
              style={{ color: 'var(--text-2)' }}
            >☰</button>
            <div>
              <h1 className="font-display font-bold text-lg leading-tight" style={{ color: 'var(--text-1)' }}>{title}</h1>
              {subtitle && <p className="text-xs mt-0.5" style={{ color: 'var(--text-3)' }}>{subtitle}</p>}
            </div>
          </div>

          <div className="flex items-center gap-3">
            {user?.gps && (
              <div className="hidden sm:flex items-center gap-1.5 badge badge-green">
                <span className="text-xs">📍</span>
                <span>{user.gps.city || `${user.gps.lat}, ${user.gps.lng}`}</span>
              </div>
            )}

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setNotifOpen(n => !n)}
                className="relative w-9 h-9 rounded-lg flex items-center justify-center text-sm transition-colors"
                style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text-2)' }}
              >
                🔔
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-white text-xs flex items-center justify-center font-bold">3</span>
              </button>

              {notifOpen && (
                <div className="absolute right-0 top-11 w-72 notif-dropdown z-50 overflow-hidden animate-fade-in">
                  <div className="px-4 py-3" style={{ borderBottom: '1px solid var(--border)' }}>
                    <span className="font-semibold text-sm" style={{ color: 'var(--text-1)' }}>Notifications</span>
                  </div>
                  {alerts.map((a, i) => (
                    <div key={i} className="px-4 py-3 flex items-start gap-3 transition-colors"
                      style={{ borderBottom: i < alerts.length - 1 ? '1px solid var(--border-dim)' : 'none' }}
                      onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-card2)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                      <span className="text-lg flex-shrink-0">{a.icon}</span>
                      <div className="flex-1">
                        <div className="text-xs font-medium" style={{ color: a.color }}>{a.text}</div>
                        <div className="text-xs mt-0.5" style={{ color: 'var(--text-3)' }}>{a.time}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* AI status */}
            <div className="hidden sm:flex items-center gap-1.5 badge badge-green">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              AI Active
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-5 overflow-auto" onClick={() => setNotifOpen(false)}>
          {children}
        </main>
      </div>
    </div>
  );
}
