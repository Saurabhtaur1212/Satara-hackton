import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../App';

const LANG_LIST = [
  { code:'en', native:'English',   flag:'🇬🇧', region:'Pan India',          greeting:'Welcome Farmer!' },
  { code:'hi', native:'हिंदी',      flag:'🇮🇳', region:'North India',        greeting:'किसान भाई, स्वागत है!' },
  { code:'mr', native:'मराठी',      flag:'🌾', region:'Maharashtra',        greeting:'शेतकरी बंधू, स्वागत आहे!' },
  { code:'pa', native:'ਪੰਜਾਬੀ',     flag:'🌻', region:'Punjab',             greeting:'ਕਿਸਾਨ ਵੀਰ, ਜੀ ਆਇਆਂ ਨੂੰ!' },
  { code:'te', native:'తెలుగు',     flag:'🌴', region:'Andhra / Telangana', greeting:'రైతు అన్నా, స్వాగతం!' },
  { code:'bn', native:'বাংলা',      flag:'🐯', region:'West Bengal',        greeting:'কৃষক ভাই, স্বাগতম!' },
  { code:'gu', native:'ગુજરાતી',    flag:'🦁', region:'Gujarat',            greeting:'ખેડૂત ભાઈ, સ્વાગત છે!' },
  { code:'ta', native:'தமிழ்',      flag:'🌺', region:'Tamil Nadu',         greeting:'விவசாயி அண்ணா, வரவேற்கிறோம்!' },
  { code:'kn', native:'ಕನ್ನಡ',      flag:'🐘', region:'Karnataka',          greeting:'ರೈತ ಬಂಧು, ಸ್ವಾಗತ!' },
  { code:'or', native:'ଓଡ଼ିଆ',      flag:'🌊', region:'Odisha',             greeting:'କୃଷକ ଭାଇ, ସ୍ୱାଗତ!' },
  { code:'ur', native:'اردو',       flag:'🌙', region:'Pan India',          greeting:'!کسان بھائی، خوش آمدید' },
];

export default function LanguageSelectPage() {
  const { setLang } = useAuth();
  const navigate    = useNavigate();
  const [selected, setSelected]   = useState(null);
  const [confirming, setConfirming] = useState(false);
  const selectedLang = LANG_LIST.find(l => l.code === selected);

  const confirm = () => {
    if (!selected) return;
    setConfirming(true);
    setLang(selected);
    setTimeout(() => navigate('/login'), 500);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center px-4 py-12">

      {/* Header */}
      <div className="text-center mb-10 animate-fade-in">
        <div className="inline-flex items-center gap-3 mb-5">
          <div className="w-12 h-12 rounded-2xl btn-primary flex items-center justify-center text-2xl shadow-green">🌿</div>
          <div className="text-left">
            <div className="font-display font-extrabold text-2xl text-slate-900">SmartSheti <span className="text-brand-600">AI</span></div>
            <div className="text-brand-600 text-xs font-semibold tracking-wider uppercase">Smart Farming Platform</div>
          </div>
        </div>

        <h1 className="font-display font-bold text-2xl text-slate-800 mb-2">
          अपनी भाषा चुनें · Choose Your Language
        </h1>
        <p className="text-slate-500 text-sm max-w-md mx-auto">
          Select your preferred language to get AI farming guidance in your mother tongue.
        </p>

        {/* Greeting preview */}
        <div className={`mt-4 transition-all duration-300 ${selectedLang ? 'opacity-100' : 'opacity-0'}`}>
          <div className="inline-flex items-center gap-2 bg-brand-50 border border-brand-200 text-brand-700 px-4 py-2 rounded-full text-sm font-medium">
            <span>{selectedLang?.flag}</span>
            <span>{selectedLang?.greeting}</span>
          </div>
        </div>
      </div>

      {/* Language Grid */}
      <div className="w-full max-w-3xl animate-slide-up">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mb-6">
          {LANG_LIST.map(lang => (
            <button
              key={lang.code}
              onClick={() => setSelected(lang.code)}
              className={`lang-card p-4 text-center relative ${selected === lang.code ? 'selected' : ''}`}
            >
              {selected === lang.code && (
                <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-brand-600 flex items-center justify-center">
                  <span className="text-white text-xs font-bold">✓</span>
                </div>
              )}
              <div className="text-3xl mb-2">{lang.flag}</div>
              <div className={`font-display font-bold text-sm mb-0.5 ${selected === lang.code ? 'text-brand-700' : 'text-slate-800'}`}>
                {lang.native}
              </div>
              <div className="text-slate-400 text-xs">{lang.name || lang.native}</div>
              <div className={`text-xs mt-1 ${selected === lang.code ? 'text-brand-500' : 'text-slate-300'}`}>
                {lang.region}
              </div>
            </button>
          ))}
        </div>

        {/* Confirm */}
        <div className="flex flex-col items-center gap-3">
          <button
            onClick={confirm}
            disabled={!selected || confirming}
            className={`w-full max-w-sm py-3.5 rounded-xl text-base font-semibold flex items-center justify-center gap-2 transition-all
              ${selected ? 'btn-primary shadow-green' : 'bg-slate-200 text-slate-400 cursor-not-allowed'}
              ${confirming ? 'opacity-70' : ''}`}
          >
            {confirming
              ? <><span className="animate-spin">⟳</span> Setting up...</>
              : selected
                ? <><span>{selectedLang?.flag}</span> Continue in {selectedLang?.native} →</>
                : <>👆 Select a language to continue</>
            }
          </button>
          <p className="text-slate-400 text-xs">You can change your language anytime from the sidebar</p>
        </div>
      </div>

      <p className="mt-10 text-slate-300 text-xs">Supporting 11 Indian languages for every farmer</p>
    </div>
  );
}
