import React from 'react';
import { ShieldCheck, Smartphone, PlayCircle, Globe, Search, Bell } from 'lucide-react';

interface UpayHeaderProps {
  activeView: 'OPERATOR' | 'CUSTOMER' | 'STORYLINE';
  setActiveView: (view: 'OPERATOR' | 'CUSTOMER' | 'STORYLINE') => void;
  lang: 'EN' | 'BN';
  setLang: (lang: 'EN' | 'BN') => void;
  criticalAlertCount: number;
}

export const UpayHeader: React.FC<UpayHeaderProps> = ({
  activeView,
  setActiveView,
  lang,
  setLang,
  criticalAlertCount,
}) => {
  return (
    <header className="sticky top-0 z-50 bg-[#0054A6] text-white shadow-md border-b border-[#004080]">
      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Zone */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => setActiveView('OPERATOR')}>
              {/* Logo Mark */}
              <div className="relative w-10 h-10 bg-white rounded-full flex items-center justify-center p-1.5 shadow-sm">
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  {/* Yellow smiley smile (upper curve) */}
                  <path
                    d="M 22 45 C 22 75 78 75 78 45"
                    fill="none"
                    stroke="#FAB915"
                    strokeWidth="14"
                    strokeLinecap="round"
                  />
                  {/* Blue smile element */}
                  <path
                    d="M 34 52 C 34 72 66 72 66 52"
                    fill="none"
                    stroke="#0054A6"
                    strokeWidth="10"
                    strokeLinecap="round"
                  />
                  {/* Red dot */}
                  <circle cx="50" cy="30" r="8" fill="#E11D48" />
                </svg>
              </div>
              <div className="flex items-center">
                <span className="text-2xl font-black tracking-tight text-white">TakaSafe</span>
              </div>
            </div>

            {/* Public Links */}
            <nav className="hidden xl:flex items-center gap-5 ml-6 text-xs text-blue-100 font-medium">
              <span className="hover:text-white cursor-pointer transition-colors">Home</span>
              <span className="hover:text-white cursor-pointer transition-colors">About Us</span>
              <span className="hover:text-white cursor-pointer transition-colors">Products & Campaigns</span>
              <span className="hover:text-white cursor-pointer transition-colors">Prepaid Card</span>
              <span className="hover:text-white cursor-pointer transition-colors">Service Location</span>
              <span className="hover:text-white cursor-pointer transition-colors">Media</span>
            </nav>
          </div>

          {/* Right Action Utilities (Matching Image 3) */}
          <div className="flex items-center gap-4">
            <button
              className="p-1.5 rounded-full text-blue-100 hover:text-white hover:bg-white/10 transition-colors"
              title="Search"
            >
              <Search className="w-4 h-4" />
            </button>

            <button
              onClick={() => setLang(lang === 'EN' ? 'BN' : 'EN')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-white/10 hover:bg-white/20 text-white transition-colors border border-white/10"
              title="Toggle Language"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>{lang === 'EN' ? 'Bangla' : 'English'}</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
