import React, { useState, useEffect } from 'react';
import {
  ArrowRight,
  ArrowDownLeft,
  ArrowUpRight,
  Send,
  QrCode,
  PlusCircle,
  ReceiptText,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';

interface UpayHeroServicesProps {
  onServiceSelect?: (serviceName: string) => void;
  lang: 'EN' | 'BN';
}

export const UpayHeroServices: React.FC<UpayHeroServicesProps> = ({ onServiceSelect, lang }) => {
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);

  const totalSlides = 3;

  // Auto transition every 5 seconds (matching the 23-25s carousel transition in video)
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % totalSlides);
    }, 5000);
    return () => clearInterval(timer);
  }, [isPaused, totalSlides]);

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev === 0 ? totalSlides - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  return (
    <div className="w-full bg-white select-none">
      {/* Hero Carousel Container */}
      <div
        className="relative overflow-hidden border-b border-amber-200/60"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* Slides Track with Smooth 700ms Horizontal Sliding Transition */}
        <div
          className="flex transition-transform duration-700 ease-[cubic-bezier(0.25,1,0.5,1)]"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {/* SLIDE 1: ৳200 Bonus Campaign (From 0:00 - 0:23 in video) */}
          <div className="w-full shrink-0 relative bg-gradient-to-r from-amber-100 via-amber-50 to-amber-100 py-10 px-4 sm:px-6 lg:px-8 overflow-hidden min-h-[360px] flex items-center">
            {/* Festive Confetti & Dot Accents */}
            <div className="absolute inset-0 pointer-events-none opacity-40">
              <div className="absolute top-4 left-10 w-3 h-3 rounded-full bg-blue-600" />
              <div className="absolute top-8 left-24 w-2 h-2 rounded-full bg-amber-500" />
              <div className="absolute bottom-6 left-16 w-3 h-3 rounded-full bg-blue-500" />
              <div className="absolute top-6 right-20 w-4 h-4 rounded-full bg-amber-400" />
              <div className="absolute bottom-10 right-40 w-3 h-3 rounded-full bg-blue-700" />
              <div className="absolute top-12 right-64 w-2 h-2 rounded-full bg-rose-500" />
            </div>

            <div className="max-w-6xl mx-auto w-full flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
              {/* Left Headline */}
              <div className="flex-1 text-center md:text-left">
                <div className="inline-block bg-amber-300/60 text-blue-950 font-bold px-3 py-1 rounded-full text-xs mb-3 border border-amber-400/50">
                  {lang === 'BN' ? 'টাকা সেফ বিশেষ অফার' : 'TakaSafe Special Campaign'}
                </div>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
                  {lang === 'BN' ? 'টাকা সেফ অ্যাকাউন্ট খুললেই' : 'Open a TakaSafe Account & Get'}
                </h1>
                <div className="mt-2 flex items-baseline justify-center md:justify-start gap-3">
                  <span className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#0054A6]">৳ ২০০</span>
                  <span className="text-2xl sm:text-3xl font-bold text-amber-500">{lang === 'BN' ? 'বোনাস*' : 'Bonus*'}</span>
                </div>
                <p className="mt-2 text-xs sm:text-sm text-slate-600 max-w-lg">
                  {lang === 'BN'
                    ? 'এখনই নিজের অথবা এজেন্টের মাধ্যমে টাকা সেফ একাউন্ট খুলুন আর ক্যাশ-ইন, সেন্ড মানি ও বিল পে উপভোগ করুন।'
                    : 'Open your TakaSafe wallet via smartphone or nearby agent to unlock seamless Send Money, Cash Out, and Bill Payments.'}
                </p>

                <div className="mt-5 flex items-center justify-center md:justify-start gap-4">
                  <button className="flex items-center gap-2 bg-[#FAB915] hover:bg-[#e5a80f] text-slate-950 px-6 py-2.5 rounded-full font-bold text-sm shadow-md transition-all transform hover:-translate-y-0.5 active:translate-y-0">
                    <span>{lang === 'BN' ? 'বিস্তারিত দেখুন' : 'Read More'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <div className="text-[11px] text-slate-500 italic">*শর্ত প্রযোজ্য (Terms Apply)</div>
                </div>
              </div>

              {/* Right Visual Card */}
              <div className="w-64 h-48 sm:w-80 sm:h-56 bg-white/70 backdrop-blur-sm rounded-3xl p-5 border-2 border-amber-300 shadow-xl flex flex-col justify-between relative overflow-hidden">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#0054A6]">TakaSafe Digital Trust</span>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded-full">
                    Protected by TakaSafe
                  </span>
                </div>
                <div className="flex items-center justify-center py-2">
                  <div className="relative flex items-center justify-center">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#0054A6] to-[#003B75] flex items-center justify-center text-white shadow-lg">
                      <span className="text-3xl font-black text-amber-300">৳</span>
                    </div>
                    <div className="absolute -top-1 -right-1 bg-amber-400 text-blue-950 text-[10px] font-black px-2 py-0.5 rounded-full shadow">
                      FAST
                    </div>
                  </div>
                </div>
                <div className="text-center text-xs font-semibold text-slate-700">
                  Low Cash-Out Rate · 24/7 ScamShield AI
                </div>
              </div>
            </div>
          </div>

          {/* SLIDE 2: চার্জ 0 টাকা / Zero Charge Cash Out (From 0:24 - 0:26 in video) */}
          <div className="w-full shrink-0 relative bg-gradient-to-r from-emerald-100/90 via-sky-50 to-amber-50/80 py-10 px-4 sm:px-6 lg:px-8 overflow-hidden min-h-[360px] flex items-center">
            {/* Nature / Greenery Horizon Graphic */}
            <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-emerald-600/10 to-transparent pointer-events-none" />

            <div className="max-w-6xl mx-auto w-full flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
              {/* Left Headline */}
              <div className="flex-1 text-center md:text-left">
                <div className="inline-flex items-center gap-1.5 bg-emerald-600 text-white font-bold px-3 py-1 rounded-full text-xs mb-3 shadow-sm">
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span>{lang === 'BN' ? 'জিরো ক্যাশ-আউট চার্জ' : 'Zero Cash-Out Charge'}</span>
                </div>

                <div className="flex items-baseline justify-center md:justify-start gap-3">
                  <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#0054A6] tracking-tight">
                    {lang === 'BN' ? 'চার্জ' : 'Charge'}
                  </h2>
                  <span className="text-5xl sm:text-6xl lg:text-7xl font-black text-amber-500 drop-shadow-sm">
                    ০
                  </span>
                  <span className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#0054A6]">
                    {lang === 'BN' ? 'টাকা' : 'Taka'}
                  </span>
                </div>

                {/* Offer Sub-card (Matching the video at 0:25) */}
                <div className="mt-4 bg-white/80 backdrop-blur-sm p-3.5 rounded-2xl border border-emerald-200/80 max-w-lg inline-block text-left shadow-sm">
                  <p className="text-xs sm:text-sm text-slate-800 font-semibold leading-relaxed">
                    {lang === 'BN'
                      ? 'TakaSafe এটিএম ও পার্টনার পয়েন্ট থেকে ক্যাশ আউট করুন ZERO চার্জে!'
                      : 'Cash out from any TakaSafe ATM & authorized point nationwide with ZERO service charge!'}
                  </p>
                  <span className="text-[11px] text-slate-500 block mt-1">
                    {lang === 'BN' ? 'দেশের যেকোনো অনুমোদিত বুথ থেকে নিশ্চিন্তে টাকা তুলুন।' : 'Enjoy 100% free cash withdrawals with no hidden deductions.'}
                  </span>
                </div>

                <div className="mt-5 flex items-center justify-center md:justify-start gap-4">
                  <button className="flex items-center gap-2 bg-[#FAB915] hover:bg-[#e5a80f] text-slate-950 px-6 py-2.5 rounded-full font-bold text-sm shadow-md transition-all transform hover:-translate-y-0.5 active:translate-y-0">
                    <span>{lang === 'BN' ? 'বিস্তারিত দেখুন' : 'Read More'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <div className="text-[11px] text-slate-500 italic">*শর্ত প্রযোজ্য (Terms Apply)</div>
                </div>
              </div>

              {/* Right Graphic: Modern Glass Architectural ATM Booth & 3D Plush Mascot (Matching video at 0:25) */}
              <div className="w-80 h-64 sm:w-96 sm:h-72 relative flex items-end justify-center select-none">
                {/* Background Lush Tree & Nature Foliage (From original commercial at 0:25) */}
                <div className="absolute left-2 bottom-6 z-0 pointer-events-none opacity-80">
                  <div className="relative">
                    {/* Bush / Trees clusters */}
                    <div className="w-24 h-24 rounded-full bg-gradient-to-t from-emerald-600 via-emerald-500 to-green-400 absolute -top-8 -left-4 blur-[0.5px] shadow-sm" />
                    <div className="w-20 h-20 rounded-full bg-gradient-to-t from-emerald-700 via-green-600 to-lime-400 absolute -top-12 left-6 blur-[0.5px]" />
                    <div className="w-16 h-16 rounded-full bg-gradient-to-t from-green-700 to-emerald-400 absolute -top-6 left-16" />
                  </div>
                </div>

                {/* Ground Granite Pavement Base */}
                <div className="absolute -bottom-1 left-6 right-6 h-5 bg-gradient-to-b from-slate-300 via-slate-400 to-slate-500 rounded-full blur-[1px] opacity-70 transform scale-x-110 shadow-lg z-0" />

                {/* Architectural Modern Glass ATM Booth Kiosk */}
                <div className="relative z-10 -translate-x-6 bottom-2 w-36 h-56 bg-slate-900/90 rounded-2xl border-2 border-slate-400 shadow-2xl overflow-hidden flex flex-col backdrop-blur-md">
                  {/* Roof Top Brand Canopy / Header Signage */}
                  <div className="bg-gradient-to-r from-red-600 via-red-500 to-red-600 p-2 border-b-2 border-red-700 shadow-md text-center relative overflow-hidden">
                    {/* Subtle shine sweep */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent -skew-x-12" />
                    <div className="text-[10px] font-black text-white tracking-widest uppercase flex items-center justify-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                      <span>TakaSafe ATM</span>
                    </div>
                    <div className="text-[7px] text-red-100 font-semibold uppercase tracking-wider">
                      24/7 CASH OUT · 0% FEE
                    </div>
                  </div>

                  {/* Glass Booth Cabin Body with Interior Machine & Reflections */}
                  <div className="relative flex-1 bg-gradient-to-b from-sky-950/60 via-slate-900/80 to-slate-950 p-2 flex flex-col justify-between">
                    {/* Interior Ceiling Downlight Cone */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-16 bg-gradient-to-b from-amber-200/20 to-transparent blur-sm pointer-events-none" />

                    {/* Realistic Glass Reflection Slanted Stripes */}
                    <div className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-transparent via-white/10 to-transparent" />
                    <div className="absolute -inset-x-10 top-6 h-12 bg-white/5 -rotate-45 pointer-events-none" />

                    {/* Stainless Steel Vertical Mullions & Door Frame */}
                    <div className="absolute top-0 bottom-0 left-1 w-0.5 bg-gradient-to-b from-slate-300 via-slate-500 to-slate-300 shadow-sm" />
                    <div className="absolute top-0 bottom-0 right-1 w-0.5 bg-gradient-to-b from-slate-300 via-slate-500 to-slate-300 shadow-sm" />
                    {/* Chrome Door Handle */}
                    <div className="absolute right-2 top-20 w-1 h-10 bg-gradient-to-b from-white via-slate-200 to-slate-400 rounded-full shadow border border-slate-500" />

                    {/* The ATM Terminal Inside the Booth */}
                    <div className="relative z-10 w-full bg-gradient-to-b from-slate-800 via-slate-800 to-slate-900 rounded-xl border border-slate-700 p-2 shadow-inner flex flex-col items-center gap-1.5">
                      {/* ATM Display Screen */}
                      <div className="w-full bg-[#0a192f] rounded-lg border border-sky-500/40 p-1.5 shadow-md flex flex-col items-center justify-center relative overflow-hidden">
                        <div className="text-[7px] font-bold text-sky-400 tracking-wider">TakaSafe DIGITAL</div>
                        <div className="text-[11px] font-black text-amber-300 tracking-tight leading-none my-0.5">
                          ৳০ চার্জ
                        </div>
                        <div className="text-[6.5px] text-emerald-400 font-mono flex items-center gap-0.5">
                          <span className="w-1 h-1 rounded-full bg-emerald-400 animate-ping" />
                          <span>READY FOR CASH</span>
                        </div>
                      </div>

                      {/* Card Insertion Slot & Receipt */}
                      <div className="w-full flex items-center justify-between px-1">
                        <div className="flex flex-col items-center">
                          <span className="text-[5px] text-slate-400 uppercase">Card</span>
                          <div className="w-6 h-1 bg-emerald-400 rounded-full shadow-sm animate-pulse" />
                        </div>
                        <div className="flex flex-col items-center">
                          <span className="text-[5px] text-slate-400 uppercase">Receipt</span>
                          <div className="w-5 h-0.5 bg-slate-300 rounded" />
                        </div>
                      </div>

                      {/* Tactile Keypad */}
                      <div className="w-14 grid grid-cols-3 gap-0.5 p-0.5 bg-slate-950 rounded border border-slate-700">
                        {[...Array(9)].map((_, i) => (
                          <div key={i} className="h-1 bg-slate-700 rounded-xs" />
                        ))}
                      </div>

                      {/* Cash Dispenser Slot with Illuminated Glow */}
                      <div className="w-full bg-slate-950 rounded border border-emerald-500/40 p-1 flex items-center justify-between shadow-inner">
                        <span className="text-[6px] font-black text-emerald-400 tracking-wider">CASH OUT</span>
                        <div className="w-10 h-1.5 bg-gradient-to-r from-emerald-500 via-amber-300 to-emerald-500 rounded-full shadow-sm animate-pulse" />
                      </div>
                    </div>

                    {/* Booth Floor Mat */}
                    <div className="w-full h-2 bg-gradient-to-r from-slate-800 via-red-900 to-slate-800 rounded text-center text-[5px] text-white/50 uppercase tracking-widest font-mono">
                      WELCOME
                    </div>
                  </div>
                </div>

                {/* Lovable 3D Plush Yellow "0" Mascot Character (Directly from video 0:25) */}
                <div className="relative z-20 translate-x-4 bottom-2 flex flex-col items-center">
                  <div className="relative group cursor-pointer transition-transform hover:scale-105 duration-300">
                    {/* Waving Left Arm */}
                    <div className="absolute -left-4 top-14 w-6 h-11 bg-gradient-to-b from-amber-300 to-amber-500 rounded-full -rotate-45 border-2 border-amber-200 shadow-md origin-top-right transform -rotate-12 animate-bounce" />

                    {/* Waving Right Arm */}
                    <div className="absolute -right-4 top-10 w-6 h-11 bg-gradient-to-b from-amber-300 to-amber-500 rounded-full rotate-45 border-2 border-amber-200 shadow-md origin-top-left" />

                    {/* 3D Plush Furry Body Shaped like Big 0 */}
                    <div className="w-40 h-50 rounded-[48px] bg-gradient-to-b from-amber-300 via-amber-400 to-amber-500 border-4 border-amber-200 shadow-2xl flex flex-col items-center justify-between p-3.5 relative overflow-hidden">
                      {/* Top Volumetric Specular Highlight */}
                      <div className="absolute top-1 left-4 right-4 h-8 bg-gradient-to-b from-white/40 to-transparent rounded-t-[40px] pointer-events-none" />

                      {/* Mascot Face: Big Pixar Eyes & Cheerful Smile */}
                      <div className="flex flex-col items-center mt-1">
                        {/* Eyes */}
                        <div className="flex items-center gap-5">
                          {/* Left Eye */}
                          <div className="w-5 h-7 rounded-full bg-slate-950 border-2 border-white shadow-sm flex items-center justify-center relative overflow-hidden">
                            <div className="w-2.5 h-3.5 rounded-full bg-white absolute top-1 right-1" />
                            <div className="w-1 h-1 rounded-full bg-white absolute bottom-1.5 left-1.5" />
                          </div>
                          {/* Right Eye */}
                          <div className="w-5 h-7 rounded-full bg-slate-950 border-2 border-white shadow-sm flex items-center justify-center relative overflow-hidden">
                            <div className="w-2.5 h-3.5 rounded-full bg-white absolute top-1 right-1" />
                            <div className="w-1 h-1 rounded-full bg-white absolute bottom-1.5 left-1.5" />
                          </div>
                        </div>

                        {/* Rosy Cheeks */}
                        <div className="flex items-center justify-between w-24 -mt-2">
                          <div className="w-3.5 h-2 rounded-full bg-rose-400/40 blur-[1px]" />
                          <div className="w-3.5 h-2 rounded-full bg-rose-400/40 blur-[1px]" />
                        </div>

                        {/* Warm Cheerful Open Smile */}
                        <div className="w-7 h-3.5 rounded-b-full bg-slate-900 border-t-2 border-amber-600 flex items-center justify-center overflow-hidden -mt-1 shadow-inner">
                          <div className="w-4 h-2 rounded-t-full bg-rose-500 mt-1.5" />
                        </div>
                      </div>

                      {/* Inner 0 Hole with 3D Golden Taka Emblem */}
                      <div className="w-16 h-20 rounded-3xl bg-gradient-to-b from-white via-amber-50 to-amber-100 border-2 border-amber-300 shadow-inner flex flex-col items-center justify-center relative my-1">
                        <span className="text-2xl font-black text-amber-600 drop-shadow-sm">৳০</span>
                        <span className="text-[7.5px] font-black text-[#0054A6] uppercase tracking-wider">
                          NO CHARGE
                        </span>
                      </div>

                      {/* Soft Shading Base */}
                      <div className="w-full text-center">
                        <span className="text-[8px] font-black text-amber-900/60 uppercase tracking-widest">
                          TAKASAFE BUDDY
                        </span>
                      </div>
                    </div>

                    {/* Cute Puffy Feet */}
                    <div className="flex items-center justify-center gap-6 -mt-2">
                      <div className="w-8 h-4 rounded-full bg-gradient-to-b from-amber-400 to-amber-600 border border-amber-200 shadow-md" />
                      <div className="w-8 h-4 rounded-full bg-gradient-to-b from-amber-400 to-amber-600 border border-amber-200 shadow-md" />
                    </div>
                  </div>

                  {/* Official Zero Charge Pill Badge */}
                  <div className="mt-1 flex items-center gap-1.5 bg-gradient-to-r from-[#0054A6] to-[#003d7a] text-white text-[11px] font-black px-4 py-1 rounded-full shadow-lg border border-amber-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
                    <span>ZERO CHARGE GUARANTEE</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* SLIDE 3: ScamShield AI Pre-Payment Protection (Vibrant Upay Royal Blue & Gold Palette) */}
          <div className="w-full shrink-0 relative bg-gradient-to-r from-[#002E66] via-[#0054A6] to-[#007AE6] text-white py-10 px-4 sm:px-6 lg:px-8 overflow-hidden min-h-[360px] flex items-center">
            {/* Radiant Ambient Light Orbs */}
            <div className="absolute -top-16 -right-16 w-80 h-80 rounded-full bg-amber-400/20 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-16 -left-16 w-80 h-80 rounded-full bg-sky-300/25 blur-3xl pointer-events-none" />

            {/* Subtle Tech Security Matrix Grid Pattern */}
            <div
              className="absolute inset-0 opacity-15 pointer-events-none"
              style={{
                backgroundImage: 'radial-gradient(circle, #ffffff 1.2px, transparent 1.2px)',
                backgroundSize: '24px 24px',
              }}
            />

            <div className="max-w-6xl mx-auto w-full flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
              <div className="flex-1 text-center md:text-left">
                <div className="inline-flex items-center gap-1.5 bg-[#FAB915] text-[#003B75] font-black px-3.5 py-1.5 rounded-full text-xs mb-3 shadow-md border border-amber-300">
                  <ShieldCheck className="w-4 h-4 text-[#003B75]" />
                  <span>24/7 AI Trust & ScamShield</span>
                </div>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight drop-shadow-sm">
                  {lang === 'BN' ? 'ScamShield এআই সুরক্ষা' : 'ScamShield AI Protection'}
                </h2>
                <div className="mt-2 flex items-baseline justify-center md:justify-start gap-3">
                  <span className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#FAB915] drop-shadow-sm">
                    {lang === 'BN' ? 'নিরাপদ লেনদেন' : 'Safe Payments'}
                  </span>
                  <span className="text-xl sm:text-2xl font-bold text-sky-100">
                    {lang === 'BN' ? 'প্রতিটি পদক্ষেপে' : 'Every Step'}
                  </span>
                </div>
                <p className="mt-3 text-xs sm:text-sm text-blue-50 max-w-lg leading-relaxed font-medium">
                  {lang === 'BN'
                    ? 'আপনার কষ্টের টাকাকে রাখুন সুরক্ষিত—প্রাক-পেমেন্ট এআই সতর্কতা, অস্বাভাবিক গতিবিধি নির্ণয় ও দুর্যোগকালীন এজেন্ট ব্যবস্থাপনা।'
                    : 'Pre-payment explainable scam warnings, money-mule detection, and disaster-aware agent liquidity resilience.'}
                </p>

                <div className="mt-6 flex items-center justify-center md:justify-start gap-4">
                  <button
                    onClick={() => onServiceSelect?.('Send Money')}
                    className="flex items-center gap-2 bg-[#FAB915] hover:bg-[#e5a80f] text-slate-950 px-6 py-2.5 rounded-full font-bold text-sm shadow-lg transition-all transform hover:-translate-y-0.5 active:translate-y-0 border border-amber-300"
                  >
                    <span>{lang === 'BN' ? 'সুরক্ষা যাচাই করুন' : 'Test ScamShield'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <div className="text-xs text-sky-100 font-semibold bg-white/10 px-3 py-1 rounded-full border border-white/20">
                    DIU CPC × upay AI DEV FEST 2026
                  </div>
                </div>
              </div>

              {/* Luminous 3D Glass Trust Shield Card */}
              <div className="w-72 h-60 sm:w-84 sm:h-64 bg-white/15 backdrop-blur-xl rounded-3xl p-5 border-2 border-white/40 shadow-2xl flex flex-col justify-between relative overflow-hidden">
                {/* Shiny top glass glare */}
                <div className="absolute -top-10 -left-10 right-10 h-28 bg-white/15 rounded-full blur-xl pointer-events-none" />

                <div className="flex items-center justify-between text-xs text-sky-100 relative z-10">
                  <span className="font-bold flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    <span>TakaSafe Guardian Core</span>
                  </span>
                  <span className="bg-emerald-400/20 text-emerald-300 border border-emerald-400/40 px-2.5 py-0.5 rounded-full font-mono text-[10px] font-bold">
                    ONLINE 99.9%
                  </span>
                </div>

                <div className="flex flex-col items-center justify-center py-2 relative z-10">
                  {/* Concentric Pulse Rings */}
                  <div className="relative flex items-center justify-center">
                    <div className="absolute w-28 h-28 rounded-full bg-[#FAB915]/20 animate-pulse pointer-events-none" />
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-[#FAB915] via-amber-300 to-amber-200 flex items-center justify-center shadow-xl text-[#003B75] border-2 border-white/60">
                      <ShieldCheck className="w-12 h-12 text-[#003B75]" />
                    </div>
                  </div>
                  <span className="text-sm font-black text-white mt-2.5 tracking-wide drop-shadow-sm">
                    Zero Fraud Compromise
                  </span>
                </div>

                <div className="text-center text-[11px] font-semibold text-sky-100 bg-black/20 py-1.5 px-2 rounded-xl border border-white/10 relative z-10">
                  SHAP Explainability · Disaster Liquidity Mode
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Carousel Arrow Controls */}
        <button
          onClick={handlePrev}
          className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 hover:bg-white text-slate-800 shadow-md flex items-center justify-center transition-all z-20 backdrop-blur-sm hover:scale-105"
          title="Previous Banner"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <button
          onClick={handleNext}
          className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 hover:bg-white text-slate-800 shadow-md flex items-center justify-center transition-all z-20 backdrop-blur-sm hover:scale-105"
          title="Next Banner"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Indicator Pagination Dots */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-2 z-20">
          {[0, 1, 2].map((idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`h-2 rounded-full transition-all duration-300 ${
                currentSlide === idx
                  ? 'w-7 bg-[#0054A6]'
                  : 'w-2 bg-slate-400/60 hover:bg-slate-600'
              }`}
              title={`Slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>

      {/* OUR SERVICES SECTION (Matching Image 4) */}
      <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <div className="text-center max-w-xl mx-auto mb-10">
          <h2 className="text-2xl sm:text-3xl font-black text-[#0054A6] tracking-wide uppercase">
            {lang === 'BN' ? 'আমাদের সেবাসমূহ' : 'OUR SERVICES'}
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            {lang === 'BN'
              ? 'আপনার দৈনন্দিন আর্থিক লেনদেনকে সহজ এবং নিরাপদ করতে আমাদের সেবাসমূহ প্রস্তুত'
              : 'Our services are designed to make your regular financial transactions convenient and easy'}
          </p>
        </div>

        {/* 6 Services Grid matching wireframe Image 4 */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
          {/* 1. Cash In */}
          <div
            onClick={() => onServiceSelect?.('Cash In')}
            className="group flex flex-col items-center p-4 rounded-2xl bg-white border border-slate-200/80 hover:border-amber-400 hover:shadow-lg transition-all cursor-pointer text-center"
          >
            <div className="w-16 h-16 rounded-2xl bg-blue-50 group-hover:bg-amber-50 flex items-center justify-center mb-3 transition-colors text-[#0054A6] group-hover:text-amber-600">
              <ArrowDownLeft className="w-8 h-8" />
            </div>
            <span className="text-sm font-bold text-slate-800 group-hover:text-[#0054A6]">
              {lang === 'BN' ? 'ক্যাশ ইন' : 'Cash In'}
            </span>
            <span className="text-[11px] text-slate-500 mt-0.5">Free from Agents</span>
          </div>

          {/* 2. Cash Out */}
          <div
            onClick={() => onServiceSelect?.('Cash Out')}
            className="group flex flex-col items-center p-4 rounded-2xl bg-white border border-slate-200/80 hover:border-amber-400 hover:shadow-lg transition-all cursor-pointer text-center"
          >
            <div className="w-16 h-16 rounded-2xl bg-amber-50 group-hover:bg-amber-100 flex items-center justify-center mb-3 transition-colors text-amber-600">
              <ArrowUpRight className="w-8 h-8" />
            </div>
            <span className="text-sm font-bold text-slate-800 group-hover:text-[#0054A6]">
              {lang === 'BN' ? 'ক্যাশ আউট' : 'Cash Out'}
            </span>
            <span className="text-[11px] text-slate-500 mt-0.5">Lowest charge</span>
          </div>

          {/* 3. Send Money */}
          <div
            onClick={() => onServiceSelect?.('Send Money')}
            className="group flex flex-col items-center p-4 rounded-2xl bg-white border-2 border-amber-300 shadow-sm hover:border-[#0054A6] hover:shadow-lg transition-all cursor-pointer text-center relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 bg-[#0054A6] text-white text-[9px] font-bold px-2 py-0.5 rounded-bl">
              SHIELD
            </div>
            <div className="w-16 h-16 rounded-2xl bg-sky-50 group-hover:bg-sky-100 flex items-center justify-center mb-3 transition-colors text-sky-600">
              <Send className="w-8 h-8" />
            </div>
            <span className="text-sm font-bold text-slate-800 group-hover:text-[#0054A6]">
              {lang === 'BN' ? 'সেন্ড মানি' : 'Send Money'}
            </span>
            <span className="text-[11px] text-slate-500 mt-0.5">ScamShield Active</span>
          </div>

          {/* 4. Make Payment */}
          <div
            onClick={() => onServiceSelect?.('Make Payment')}
            className="group flex flex-col items-center p-4 rounded-2xl bg-white border border-slate-200/80 hover:border-amber-400 hover:shadow-lg transition-all cursor-pointer text-center"
          >
            <div className="w-16 h-16 rounded-2xl bg-indigo-50 group-hover:bg-indigo-100 flex items-center justify-center mb-3 transition-colors text-indigo-600">
              <QrCode className="w-8 h-8" />
            </div>
            <span className="text-sm font-bold text-slate-800 group-hover:text-[#0054A6]">
              {lang === 'BN' ? 'পেমেন্ট করুন' : 'Make Payment'}
            </span>
            <span className="text-[11px] text-slate-500 mt-0.5">Merchant QR</span>
          </div>

          {/* 5. Add Money */}
          <div
            onClick={() => onServiceSelect?.('Add Money')}
            className="group flex flex-col items-center p-4 rounded-2xl bg-white border border-slate-200/80 hover:border-amber-400 hover:shadow-lg transition-all cursor-pointer text-center"
          >
            <div className="w-16 h-16 rounded-2xl bg-emerald-50 group-hover:bg-emerald-100 flex items-center justify-center mb-3 transition-colors text-emerald-600">
              <PlusCircle className="w-8 h-8" />
            </div>
            <span className="text-sm font-bold text-slate-800 group-hover:text-[#0054A6]">
              {lang === 'BN' ? 'অ্যাড মানি' : 'Add Money'}
            </span>
            <span className="text-[11px] text-slate-500 mt-0.5">Bank / Card</span>
          </div>

          {/* 6. Pay Bill */}
          <div
            onClick={() => onServiceSelect?.('Pay Bill')}
            className="group flex flex-col items-center p-4 rounded-2xl bg-white border border-slate-200/80 hover:border-amber-400 hover:shadow-lg transition-all cursor-pointer text-center"
          >
            <div className="w-16 h-16 rounded-2xl bg-purple-50 group-hover:bg-purple-100 flex items-center justify-center mb-3 transition-colors text-purple-600">
              <ReceiptText className="w-8 h-8" />
            </div>
            <span className="text-sm font-bold text-slate-800 group-hover:text-[#0054A6]">
              {lang === 'BN' ? 'পে বিল' : 'Pay Bill'}
            </span>
            <span className="text-[11px] text-slate-500 mt-0.5">DESCO, WASA, Titas</span>
          </div>
        </div>

        {/* View More Button */}
        <div className="mt-8 text-center">
          <button className="bg-[#FAB915] hover:bg-[#e5a80f] text-slate-950 font-bold px-8 py-2.5 rounded-full text-xs tracking-wide shadow-md transition-all">
            {lang === 'BN' ? 'আরও দেখুন' : 'View More'}
          </button>
        </div>
      </div>

      {/* Yellow Wavy Transition Curve (Matching Image 4 bottom wave) */}
      <div className="w-full overflow-hidden leading-none">
        <svg
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          className="relative block w-full h-12 text-[#FAB915] fill-current"
        >
          <path d="M0,0 C150,90 350,-40 500,40 C650,120 900,10 1200,60 L1200,120 L0,120 Z" />
        </svg>
      </div>
    </div>
  );
};
