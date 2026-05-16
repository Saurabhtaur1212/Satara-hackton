import React, { createContext, useContext, useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import i18n from './i18n';

import LanguageSelectPage from './pages/LanguageSelectPage';
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import Dashboard from './pages/Dashboard';
import WeatherPage from './pages/WeatherPage';
import RecommendationPage from './pages/RecommendationPage';
import DiseaseScannerPage from './pages/DiseaseScannerPage';
import ChatbotPage from './pages/ChatbotPage';
import MarketPage from './pages/MarketPage';
import WaterPage from './pages/WaterPage';
import FertilizerPage from './pages/FertilizerPage';
import SustainabilityPage from './pages/SustainabilityPage';
import AgentPage from './pages/AgentPage';

export const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

export const LANG_LIST = [
  { code: 'en', name: 'English',  native: 'English',   flag: '🇬🇧', voiceCode: 'en-IN' },
  { code: 'hi', name: 'Hindi',    native: 'हिंदी',      flag: '🇮🇳', voiceCode: 'hi-IN' },
  { code: 'mr', name: 'Marathi',  native: 'मराठी',      flag: '🌾', voiceCode: 'mr-IN' },
  { code: 'pa', name: 'Punjabi',  native: 'ਪੰਜਾਬੀ',     flag: '🌻', voiceCode: 'pa-IN' },
  { code: 'te', name: 'Telugu',   native: 'తెలుగు',     flag: '🌴', voiceCode: 'te-IN' },
  { code: 'bn', name: 'Bengali',  native: 'বাংলা',      flag: '🐯', voiceCode: 'bn-IN' },
  { code: 'gu', name: 'Gujarati', native: 'ગુજરાતી',    flag: '🦁', voiceCode: 'gu-IN' },
  { code: 'ta', name: 'Tamil',    native: 'தமிழ்',      flag: '🌺', voiceCode: 'ta-IN' },
  { code: 'kn', name: 'Kannada',  native: 'ಕನ್ನಡ',      flag: '🐘', voiceCode: 'kn-IN' },
  { code: 'or', name: 'Odia',     native: 'ଓଡ଼ିଆ',      flag: '🌊', voiceCode: 'or-IN' },
  { code: 'ur', name: 'Urdu',     native: 'اردو',       flag: '🌙', voiceCode: 'ur-IN' },
];

function ProtectedRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" replace />;
}

// Redirect to language select if lang not yet chosen
function LangGuard({ children }) {
  const { langChosen } = useAuth();
  return langChosen ? children : <Navigate to="/select-language" replace />;
}

export default function App() {
  const [user, setUser] = useState(null);
  const [lang, setLang] = useState(() => localStorage.getItem('language') || 'en');
  const [langChosen, setLangChosen] = useState(() => Boolean(localStorage.getItem('language')));
  const [darkMode, setDarkMode] = useState(true);

  const chooseLang = (code) => {
    setLang(code);
    setLangChosen(true);
    localStorage.setItem('language', code);
  };

  useEffect(() => {
    if (lang) {
      i18n.changeLanguage(lang);
      localStorage.setItem('language', lang);
    }
  }, [lang]);

  return (
    <AuthContext.Provider value={{ user, setUser, lang, setLang: chooseLang, langChosen, setLangChosen, LANG_LIST, darkMode, setDarkMode }}>
      <div className={darkMode ? '' : 'light-mode'}>
        <Router>
          <Routes>
            {/* Language selection — always accessible */}
            <Route path="/select-language" element={<LanguageSelectPage />} />

            {/* Landing & auth — require lang chosen */}
            <Route path="/" element={<LangGuard><LandingPage /></LangGuard>} />
            <Route path="/login" element={<LangGuard><AuthPage /></LangGuard>} />

            {/* Protected app routes */}
            <Route path="/dashboard"       element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/weather"         element={<ProtectedRoute><WeatherPage /></ProtectedRoute>} />
            <Route path="/recommendations" element={<ProtectedRoute><RecommendationPage /></ProtectedRoute>} />
            <Route path="/disease-scanner" element={<ProtectedRoute><DiseaseScannerPage /></ProtectedRoute>} />
            <Route path="/chatbot"         element={<ProtectedRoute><ChatbotPage /></ProtectedRoute>} />
            <Route path="/market"          element={<ProtectedRoute><MarketPage /></ProtectedRoute>} />
            <Route path="/water"           element={<ProtectedRoute><WaterPage /></ProtectedRoute>} />
            <Route path="/fertilizer"      element={<ProtectedRoute><FertilizerPage /></ProtectedRoute>} />
            <Route path="/sustainability"  element={<ProtectedRoute><SustainabilityPage /></ProtectedRoute>} />
            <Route path="/agents"          element={<ProtectedRoute><AgentPage /></ProtectedRoute>} />

            {/* Fallback — retain chosen language and redirect to login if already selected */}
            <Route path="*" element={<Navigate to={langChosen ? '/login' : '/select-language'} replace />} />
          </Routes>
        </Router>
      </div>
    </AuthContext.Provider>
  );
}
