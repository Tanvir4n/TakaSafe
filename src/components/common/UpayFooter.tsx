import React from 'react';
import { MessageSquare, Mail, Phone, MapPin, Clock } from 'lucide-react';

export const UpayFooter: React.FC = () => {
  return (
    <footer className="bg-[#262626] text-slate-300 text-xs pt-12 pb-8 border-t-4 border-[#FAB915]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-10">
          {/* Column 1: Brand & Purpose */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 bg-white rounded-full flex items-center justify-center p-1">
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  <path
                    d="M 22 45 C 22 75 78 75 78 45"
                    fill="none"
                    stroke="#FAB915"
                    strokeWidth="14"
                    strokeLinecap="round"
                  />
                  <path
                    d="M 34 52 C 34 72 66 72 66 52"
                    fill="none"
                    stroke="#0054A6"
                    strokeWidth="10"
                    strokeLinecap="round"
                  />
                  <circle cx="50" cy="30" r="8" fill="#E11D48" />
                </svg>
              </div>
              <div className="flex items-center">
                <span className="text-xl font-black text-white">TakaSafe</span>
              </div>
            </div>
            <p className="text-slate-400 text-[12px] leading-relaxed">
              TakaSafe is aiming to help aspirers achieve their goals through easy, secure and innovative Digital Financial Solutions.
            </p>
          </div>

          {/* Column 2: GET IN TOUCH */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-amber-400 font-bold tracking-wider uppercase text-xs mb-3">GET IN TOUCH</h4>
            
            <div className="flex items-start gap-2.5">
              <MessageSquare className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span>Live Chat</span>
            </div>

            <div className="flex items-start gap-2.5">
              <Mail className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <a href="mailto:customerservice@takasafe.com" className="hover:text-amber-300 transition-colors">
                  customerservice@takasafe.com
                </a>
                <span className="block text-[11px] text-slate-400">(For Customer Service only)</span>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <Mail className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <a href="mailto:info@takasafe.com" className="hover:text-amber-300 transition-colors">
                  info@takasafe.com
                </a>
                <span className="block text-[11px] text-slate-400">(For Media Queries)</span>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <Phone className="w-4 h-4 text-amber-400 shrink-0" />
              <span className="font-semibold text-white">16268</span>
              <span className="text-slate-400">/</span>
              <span>09610916268</span>
            </div>

            <div className="flex items-start gap-2.5 text-[11px] text-slate-400">
              <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span>Plot CWS (A) -1, Road 34, Gulshan Avenue, Dhaka - 1212, Bangladesh</span>
            </div>

            <div className="flex items-start gap-2.5 text-[11px] text-slate-400 bg-black/20 p-2.5 rounded-lg border border-slate-700/50">
              <Clock className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <span className="text-white font-medium">TakaSafe Point (Customer Service Center):</span> Plot No.3, Block-5E(H)8, Near Shooting Club Gulshan Avenue, Gulshan-1, Dhaka-1212 · <span className="text-amber-300">Timing: 9:30 am - 4:00 pm</span>
              </div>
            </div>
          </div>

          {/* Column 3: USEFUL LINKS & COMPANY INFO */}
          <div className="space-y-6">
            <div>
              <h4 className="text-amber-400 font-bold tracking-wider uppercase text-xs mb-3">USEFUL LINKS</h4>
              <ul className="space-y-1.5 text-[12px] text-slate-400">
                <li className="hover:text-white cursor-pointer">Limits and Charges</li>
                <li className="hover:text-white cursor-pointer">Press Release</li>
                <li className="hover:text-white cursor-pointer">Need Help?</li>
                <li className="hover:text-white cursor-pointer">Partner</li>
                <li className="hover:text-white cursor-pointer">Discontinued Agents</li>
              </ul>
            </div>

            <div>
              <h4 className="text-amber-400 font-bold tracking-wider uppercase text-xs mb-2">COMPANY INFO</h4>
              <ul className="space-y-1.5 text-[12px] text-slate-400">
                <li className="hover:text-white cursor-pointer">Privacy Policy</li>
                <li className="hover:text-white cursor-pointer">Terms and Conditions</li>
                <li className="hover:text-white cursor-pointer">Who We Are</li>
                <li className="hover:text-white cursor-pointer">Business Solution</li>
              </ul>
            </div>
          </div>

          {/* Column 4: STAY CONNECTED & APP DOWNLOADS */}
          <div>
            <h4 className="text-amber-400 font-bold tracking-wider uppercase text-xs mb-3">STAY CONNECTED</h4>
            
            {/* Social Icons */}
            <div className="flex items-center gap-2 mb-4">
              <span className="w-7 h-7 rounded-full bg-slate-800 hover:bg-blue-600 text-white flex items-center justify-center font-bold text-xs cursor-pointer transition-colors">f</span>
              <span className="w-7 h-7 rounded-full bg-slate-800 hover:bg-blue-500 text-white flex items-center justify-center font-bold text-xs cursor-pointer transition-colors">in</span>
              <span className="w-7 h-7 rounded-full bg-slate-800 hover:bg-red-600 text-white flex items-center justify-center font-bold text-xs cursor-pointer transition-colors">▶</span>
              <span className="w-7 h-7 rounded-full bg-slate-800 hover:bg-emerald-600 text-white flex items-center justify-center font-bold text-xs cursor-pointer transition-colors">wa</span>
              <span className="w-7 h-7 rounded-full bg-slate-800 hover:bg-sky-500 text-white flex items-center justify-center font-bold text-xs cursor-pointer transition-colors">imo</span>
            </div>

            {/* Badges */}
            <div className="space-y-2">
              <div className="bg-black hover:bg-slate-900 border border-slate-700 rounded-lg p-2 flex items-center gap-2 cursor-pointer transition-colors">
                <div className="text-xl">▶</div>
                <div className="leading-tight">
                  <span className="text-[9px] uppercase text-slate-400 block">GET IT ON</span>
                  <span className="text-xs font-bold text-white">Google Play</span>
                </div>
              </div>

              <div className="bg-black hover:bg-slate-900 border border-slate-700 rounded-lg p-2 flex items-center gap-2 cursor-pointer transition-colors">
                <div className="text-xl"></div>
                <div className="leading-tight">
                  <span className="text-[9px] uppercase text-slate-400 block">Download on the</span>
                  <span className="text-xs font-bold text-white">App Store</span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-700/60 flex items-center gap-1.5 text-xs font-bold text-white">
              <span>Financial Trust & Resilience Platform</span>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"></span>
            </div>
          </div>
        </div>

        {/* Footer Bottom Bar */}
        <div className="pt-6 border-t border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-3 text-slate-400 text-[11px]">
          <div>
            © 2026 TakaSafe. All rights reserved.
          </div>
          <div className="flex items-center gap-3">
            <span className="text-amber-400 font-semibold">TakaSafe MFS Platform</span>
            <span>·</span>
            <span>DIU CPC × upay AI DEV FEST 2026</span>
            <span>·</span>
            <span>Team 3AM Runtime</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
