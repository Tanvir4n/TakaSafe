import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  CreditCard,
  MapPin,
  Newspaper,
  HelpCircle,
  Users,
  Briefcase,
  AlertOctagon,
  FileText,
  Lock,
  Download,
  Send,
  Search,
  CheckCircle,
  ExternalLink,
  MessageSquare,
  Sparkles,
  Smartphone,
  Phone,
  ArrowRight,
} from 'lucide-react';

interface UpayInfoModalProps {
  modalType: string | null;
  onClose: () => void;
  lang: 'EN' | 'BN';
  onNavigateView?: (view: 'OPERATOR' | 'CUSTOMER' | 'STORYLINE') => void;
}

export const UpayInfoModal: React.FC<UpayInfoModalProps> = ({
  modalType,
  onClose,
  lang,
  onNavigateView,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'bot' | 'user'; text: string; time: string }>>([
    {
      sender: 'bot',
      text: lang === 'BN' 
        ? 'আসসালামু আলাইকুম! TakaSafe কাস্টমার কেয়ারে স্বাগতম। আপনাকে কীভাবে সাহায্য করতে পারি?' 
        : 'Welcome to TakaSafe 24/7 Digital Assistant. How can we assist you today?',
      time: 'Just now',
    },
  ]);
  const [inputMsg, setInputMsg] = useState('');

  if (!modalType) return null;

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMsg.trim()) return;

    const userText = inputMsg;
    const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    setChatMessages((prev) => [...prev, { sender: 'user', text: userText, time: timeNow }]);
    setInputMsg('');

    setTimeout(() => {
      let botReply = '';
      const lower = userText.toLowerCase();

      if (lower.includes('cash out') || lower.includes('atm') || lower.includes('charge') || lower.includes('খরচ')) {
        botReply = lang === 'BN'
          ? 'আমাদের যেকোনো TakaSafe এটিএম বুথ থেকে ক্যাশ আউট সম্পূর্ণ ফ্রি (০ টাকা)। কোনো লুকানো চার্জ নেই!'
          : 'Cash out from any TakaSafe ATM nationwide is 100% FREE (৳0 fee) with no hidden deductions!';
      } else if (lower.includes('scam') || lower.includes('fraud') || lower.includes('সুরক্ষা') || lower.includes('প্রতারণা')) {
        botReply = lang === 'BN'
          ? 'TakaSafe ScamShield এআই প্রতিটি পেমেন্টের আগে রিসিভারের অ্যাকাউন্ট বিশ্লেষণ করে ঝুঁকি থাকলে আপনাকে তাৎক্ষণিক সতর্ক করে।'
          : 'TakaSafe ScamShield AI scans receiver accounts in real-time before payment and gives explainable risk warnings to protect your hard-earned money.';
      } else if (lower.includes('agent') || lower.includes('location') || lower.includes('এজেন্ট') || lower.includes('বুথ')) {
        botReply = lang === 'BN'
          ? 'আমাদের গুলশান প্রধান পয়েন্ট: প্লট সিডব্লিউএস (এ)-১, রোড ৩৪, গুলশান এভিনিউ, ঢাকা-১২১২ (সময়: সকাল ৯:৩০ - বিকাল ৪:০০)।'
          : 'Our Gulshan Flagship Point: Plot CWS (A)-1, Road 34, Gulshan Avenue, Dhaka-1212 (Timing: 9:30 am - 4:00 pm).';
      } else if (lower.includes('bonus') || lower.includes('বোনাস')) {
        botReply = lang === 'BN'
          ? 'নতুন টাকা সেফ অ্যাকাউন্ট খুললে তাৎক্ষণিক ৳২০০ বোনাস পাবেন প্রথম লেনদেনের পর!'
          : 'Open a new TakaSafe account today and receive up to ৳200 bonus on your qualifying transactions!';
      } else {
        botReply = lang === 'BN'
          ? 'ধন্যবাদ আপনার বার্তার জন্য! আমাদের একজন কাস্টমার প্রতিনিধি শীঘ্রই আপনার সাথে যোগাযোগ করবেন। হেল্পলাইন: ১৬২৬৮।'
          : 'Thank you for reaching out! Our senior representative is on standby. You can also dial our 24/7 hotline at 16268.';
      }

      setChatMessages((prev) => [...prev, { sender: 'bot', text: botReply, time: 'Just now' }]);
    }, 600);
  };

  const renderContent = () => {
    switch (modalType) {
      case 'ABOUT_US':
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-2xl border border-blue-200">
              <div className="w-12 h-12 rounded-xl bg-[#0054A6] text-white flex items-center justify-center font-bold text-xl">
                TS
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm">TakaSafe MFS Platform</h4>
                <p className="text-xs text-slate-600">
                  Developed for DIU CPC × upay AI DEV FEST 2026 by Team 3AM Runtime
                </p>
              </div>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed">
              TakaSafe is a next-generation Mobile Financial Services (MFS) Trust & Resilience Engine designed to empower Bangladeshi aspirers with financial inclusion, zero-compromise security, and proactive protection.
            </p>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="font-bold text-slate-900 block">Core Architecture</span>
                <span className="text-slate-600 text-[11px] block mt-0.5">Dual-Head Neural Fusion + Graph Attention Network (GAT)</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="font-bold text-slate-900 block">Compliance</span>
                <span className="text-slate-600 text-[11px] block mt-0.5">Bangladesh Bank MFS Regulations & BFIU Guidelines 2026</span>
              </div>
            </div>
            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900">
              <span className="font-bold block">Team 3AM Runtime:</span>
              <span>Sourov Kumar (Chief Risk Analyst) · Md. Sadman Al Islam Shabab (Model Architecture Lead) · Md. Tanvir Hasan (SOC Ops)</span>
            </div>
          </div>
        );

      case 'PREPAID_CARD':
        return (
          <div className="space-y-4">
            <div className="bg-gradient-to-r from-[#003875] via-[#0054A6] to-[#002855] text-white p-5 rounded-2xl shadow-lg border border-blue-400/40 relative overflow-hidden">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-amber-300 font-bold">TakaSafe Platinum</span>
                  <div className="text-lg font-black mt-1">Dual Currency Prepaid Card</div>
                </div>
                <CreditCard className="w-7 h-7 text-amber-300" />
              </div>
              <div className="my-4 font-mono text-sm tracking-widest">•••• •••• •••• 8421</div>
              <div className="flex justify-between items-end text-xs">
                <div>
                  <span className="text-[9px] text-blue-200 block uppercase">Cardholder</span>
                  <span className="font-bold">MD RAHIM UDDIN</span>
                </div>
                <div>
                  <span className="text-[9px] text-blue-200 block uppercase">ATM Cash Out</span>
                  <span className="text-amber-300 font-bold">৳০ FREE</span>
                </div>
              </div>
            </div>
            <ul className="text-xs space-y-2 text-slate-700">
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Zero annual renewal fee & 100% free cash-out at all partner ATMs.</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Contactless NFC wave-to-pay for transit, supermarkets, and merchant POS.</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Instant lock/unlock via TakaSafe app if misplaced.</span>
              </li>
            </ul>
          </div>
        );

      case 'SERVICE_LOCATIONS':
        return (
          <div className="space-y-3">
            <p className="text-xs text-slate-600">
              Find authorized TakaSafe Points, partner branch counters, and ৳0 ATM booths nationwide.
            </p>
            <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
              {[
                { name: 'TakaSafe Flagship Point', addr: 'Plot CWS (A) -1, Road 34, Gulshan-1, Dhaka', type: 'Customer Center', time: '9:30 AM - 4:00 PM' },
                { name: 'UCB Taqwa Islamic Branch ATM', addr: 'Near Shooting Club, Gulshan Avenue, Dhaka', type: '0% Free ATM', time: '24/7 Hours' },
                { name: 'Agrabad Commercial Branch', addr: 'Shaheed Sohrawardi Road, Agrabad, Chattogram', type: 'Regional Hub', time: '9:30 AM - 4:00 PM' },
                { name: 'Zindabazar Service Point', addr: 'East Zindabazar, Sylhet', type: 'Fast Agent Point', time: '8:00 AM - 10:00 PM' },
                { name: 'Barishal Sadar Coastal Node', addr: 'Sadullapur Road, Barishal', type: 'Disaster Liquidity Buffer', time: 'Emergency Priority' },
              ].map((loc, i) => (
                <div key={i} className="p-3 bg-slate-50 hover:bg-blue-50/50 rounded-xl border border-slate-200 text-xs flex justify-between items-center transition-colors">
                  <div>
                    <div className="font-bold text-slate-900">{loc.name}</div>
                    <div className="text-slate-500 text-[11px] flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-amber-500" />
                      <span>{loc.addr}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 block">
                      {loc.type}
                    </span>
                    <span className="text-[10px] text-slate-400 block mt-1">{loc.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'LIMITS_CHARGES':
        return (
          <div className="space-y-3">
            <p className="text-xs text-slate-600">
              Official schedule of charges and transaction ceilings approved by Bangladesh Bank.
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-100 text-slate-700 font-bold uppercase text-[10px]">
                  <tr>
                    <th className="p-2.5">Service</th>
                    <th className="p-2.5">Charge</th>
                    <th className="p-2.5">Per Txn Limit</th>
                    <th className="p-2.5">Daily Limit</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  <tr className="hover:bg-slate-50">
                    <td className="p-2.5 font-semibold text-slate-900">ATM Cash-Out</td>
                    <td className="p-2.5 text-emerald-600 font-black">৳ 0.00 (FREE)</td>
                    <td className="p-2.5">৳ 10,000</td>
                    <td className="p-2.5">৳ 25,000</td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="p-2.5 font-semibold text-slate-900">Agent Cash-Out</td>
                    <td className="p-2.5 font-bold">1.4% (৳14/k)</td>
                    <td className="p-2.5">৳ 25,000</td>
                    <td className="p-2.5">৳ 50,000</td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="p-2.5 font-semibold text-slate-900">Send Money</td>
                    <td className="p-2.5 text-slate-700 font-medium">৳ 5.00</td>
                    <td className="p-2.5">৳ 25,000</td>
                    <td className="p-2.5">৳ 50,000</td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="p-2.5 font-semibold text-slate-900">Cash In (Agent/Bank)</td>
                    <td className="p-2.5 text-emerald-600 font-bold">FREE</td>
                    <td className="p-2.5">৳ 30,000</td>
                    <td className="p-2.5">৳ 100,000</td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="p-2.5 font-semibold text-slate-900">Utility Bill Pay</td>
                    <td className="p-2.5 text-emerald-600 font-bold">FREE</td>
                    <td className="p-2.5">৳ 50,000</td>
                    <td className="p-2.5">৳ 100,000</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        );

      case 'LIVE_CHAT':
        return (
          <div className="flex flex-col h-80">
            <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-slate-50 rounded-xl border border-slate-200">
              {chatMessages.map((m, idx) => (
                <div
                  key={idx}
                  className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-3.5 py-2 text-xs leading-relaxed ${
                      m.sender === 'user'
                        ? 'bg-[#0054A6] text-white rounded-br-xs'
                        : 'bg-white text-slate-800 border border-slate-200 shadow-xs rounded-bl-xs'
                    }`}
                  >
                    {m.text}
                  </div>
                  <span className="text-[9px] text-slate-400 mt-0.5 px-1">{m.time}</span>
                </div>
              ))}
            </div>

            <form onSubmit={handleSendMessage} className="mt-3 flex items-center gap-2">
              <input
                type="text"
                value={inputMsg}
                onChange={(e) => setInputMsg(e.target.value)}
                placeholder="Ask about 0% ATM cash-out, ScamShield, points..."
                className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#0054A6]"
              />
              <button
                type="submit"
                className="bg-[#0054A6] hover:bg-[#004080] text-white p-2 rounded-xl transition-colors cursor-pointer"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        );

      case 'SEARCH':
        return (
          <div className="space-y-4">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search services, ATM booths, ScamShield, audit logs..."
                className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0054A6]"
              />
            </div>

            <div className="space-y-2 max-h-64 overflow-y-auto">
              {[
                { title: 'ATM Cash-Out (Zero Charge)', category: 'MFS Service', action: () => onNavigateView?.('CUSTOMER') },
                { title: 'ScamShield Pre-Payment Warning', category: 'Security Feature', action: () => onNavigateView?.('CUSTOMER') },
                { title: 'Operator Risk Cockpit & GAT Graph', category: 'Dashboard', action: () => onNavigateView?.('OPERATOR') },
                { title: 'Disaster Liquidity Mode (Cyclone Buffer)', category: 'Resilience', action: () => onNavigateView?.('OPERATOR') },
                { title: 'Compliance Audit Trail (.CSV Export)', category: 'Regulatory', action: () => onNavigateView?.('OPERATOR') },
                { title: 'Dual-Currency Platinum Prepaid Card', category: 'Products', action: () => {} },
              ]
                .filter((item) => !searchQuery || item.title.toLowerCase().includes(searchQuery.toLowerCase()) || item.category.toLowerCase().includes(searchQuery.toLowerCase()))
                .map((item, idx) => (
                  <div
                    key={idx}
                    onClick={() => {
                      item.action();
                      onClose();
                    }}
                    className="p-2.5 bg-slate-50 hover:bg-blue-50/80 rounded-xl border border-slate-200 flex items-center justify-between text-xs cursor-pointer transition-colors"
                  >
                    <div>
                      <span className="font-bold text-slate-900 block">{item.title}</span>
                      <span className="text-[10px] text-slate-500">{item.category}</span>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-[#0054A6]" />
                  </div>
                ))}
            </div>
          </div>
        );

      case 'APP_DOWNLOAD':
        return (
          <div className="text-center space-y-4 py-2">
            <div className="w-16 h-16 rounded-2xl bg-[#0054A6] text-white flex items-center justify-center mx-auto shadow-md">
              <Smartphone className="w-8 h-8 text-amber-300" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-sm">Download TakaSafe MFS Mobile App</h4>
              <p className="text-xs text-slate-500 mt-1">Available for Android & iOS devices with built-in ScamShield AI protection.</p>
            </div>
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 inline-block">
              {/* QR Mockup */}
              <div className="w-32 h-32 bg-white p-2 rounded-xl border border-slate-300 mx-auto flex items-center justify-center font-mono text-[9px] text-slate-400 text-center">
                [ SCAN QR CODE TO INSTALL TAKASAFE APP ]
              </div>
              <span className="text-[10px] text-slate-500 block mt-2 font-medium">Scan with your smartphone camera</span>
            </div>
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => {
                  onNavigateView?.('CUSTOMER');
                  onClose();
                }}
                className="bg-[#0054A6] hover:bg-[#004080] text-white px-5 py-2 rounded-xl text-xs font-bold transition-all shadow"
              >
                Launch Web App Simulator
              </button>
            </div>
          </div>
        );

      case 'MEDIA':
        return (
          <div className="space-y-3">
            <p className="text-xs text-slate-600">Official press releases and AI DEV FEST 2026 announcements.</p>
            <div className="space-y-2.5">
              {[
                { date: 'Oct 2026', title: 'TakaSafe Unveils ScamShield AI at DIU CPC × upay AI DEV FEST 2026', tag: 'Championship' },
                { date: 'Sep 2026', title: 'Zero Cash-Out Charge Announced for 15,000+ ATM Booths Across Bangladesh', tag: 'Campaign' },
                { date: 'Aug 2026', title: 'TakaSafe Partners with UCB Taqwa Islamic Banking for Resilient Agent Liquidity', tag: 'Partnership' },
              ].map((item, i) => (
                <div key={i} className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                  <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
                    <span>{item.date}</span>
                    <span className="bg-blue-100 text-[#0054A6] px-2 py-0.2 rounded-full font-bold">{item.tag}</span>
                  </div>
                  <h5 className="font-bold text-slate-900">{item.title}</h5>
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return (
          <div className="space-y-3 text-xs text-slate-700">
            <p>
              Information for <strong className="text-slate-900">{modalType.replace(/_/g, ' ')}</strong> is fully compliant with Bangladesh Bank BFIU MFS Regulatory Guidelines 2026.
            </p>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="font-bold block text-slate-900">Need specific assistance?</span>
              <span className="text-slate-600">Call our 24/7 hotline at 16268 or email customerservice@takasafe.com.</span>
            </div>
          </div>
        );
    }
  };

  const getTitle = () => {
    switch (modalType) {
      case 'ABOUT_US': return 'About TakaSafe';
      case 'PREPAID_CARD': return 'TakaSafe Prepaid Cards';
      case 'SERVICE_LOCATIONS': return 'Service Locations & ATM Finder';
      case 'LIMITS_CHARGES': return 'Limits and Service Charges';
      case 'LIVE_CHAT': return '24/7 Live Support Assistant';
      case 'SEARCH': return 'Quick Search Directory';
      case 'APP_DOWNLOAD': return 'Download TakaSafe App';
      case 'MEDIA': return 'Press Releases & Media';
      case 'NEED_HELP': return 'Customer Help & Support';
      case 'PARTNER': return 'Partner & Merchant Enrollment';
      case 'PRIVACY_POLICY': return 'Privacy & Data Protection Policy';
      case 'TERMS': return 'Terms & Conditions';
      case 'BUSINESS': return 'TakaSafe Enterprise Solutions';
      default: return modalType.replace(/_/g, ' ');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#0054A6] text-white flex items-center justify-center shadow-xs">
              <Sparkles className="w-4 h-4 text-amber-300" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">{getTitle()}</h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-200/80 hover:bg-slate-300 text-slate-700 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto max-h-[70vh]">
          {renderContent()}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
          <span>TakaSafe · DIU CPC × upay AI DEV FEST 2026</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold rounded-xl transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
