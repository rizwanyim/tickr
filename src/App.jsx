import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  BookOpen, 
  Target, 
  Settings, 
  TrendingUp, 
  Wallet, 
  Activity, 
  Percent,
  Bell,
  Search,
  ChevronDown,
  Lock,
  Save,
  Plus,
  Filter,
  User,
  ArrowRightLeft,
  Briefcase
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

// --- MOCK DATA ---
const currentCapital = 1050.00;

// Data berbeza untuk butang Minggu/Bulan/Tahun
const dataMinggu = [
  { name: 'Isn', profit: 50 }, { name: 'Sel', profit: -20 }, { name: 'Rab', profit: 100 },
  { name: 'Kha', profit: 150 }, { name: 'Jum', profit: 90 }
];
const dataBulan = [
  { name: 'Jan', profit: 120 }, { name: 'Feb', profit: 300 }, { name: 'Mac', profit: -50 },
  { name: 'Apr', profit: 450 }, { name: 'Mei', profit: 200 }, { name: 'Jun', profit: 600 },
  { name: 'Jul', profit: 850 }, { name: 'Ogo', profit: 400 }, { name: 'Sep', profit: 950 },
  { name: 'Okt', profit: 1200 }, { name: 'Nov', profit: 1050 }, { name: 'Dis', profit: 1500 },
];
const dataTahun = [
  { name: '2024', profit: 1200 }, { name: '2025', profit: 3500 }, { name: '2026', profit: 5400 }
];

const strategyData = [
  { name: 'Pullback + Vol', value: 45 },
  { name: 'Breakout', value: 30 },
  { name: 'Reversal', value: 25 },
];
const COLORS = ['#ff2a44', '#ff7b8c', '#4a2528'];

const mockJournal = [
  { id: 1, date: '10 Jul 2026', symbol: 'YTL', setup: 'Breakout', entry: 1.250, sl: 1.150, exit: 1.450, units: 1000, pnl: 200, status: 'WIN' },
  { id: 2, date: '08 Jul 2026', symbol: 'DNEX', setup: 'Reversal', entry: 0.355, sl: 0.330, exit: 0.355, units: 3000, pnl: 0, status: 'BREAKEVEN' },
  { id: 3, date: '05 Jul 2026', symbol: 'EKOVEST', setup: 'Pullback', entry: 0.450, sl: 0.420, exit: 0.420, units: 2000, pnl: -60, status: 'LOSS' },
];

// --- COMPONENTS ---
const StatCard = ({ title, value, icon: Icon, trend, trendValue }) => (
  <div className="bg-[#170b0c] border border-[#2b1416] rounded-2xl p-6 relative overflow-hidden group">
    <div className="absolute -inset-0.5 bg-gradient-to-r from-[#ff2a44] to-transparent opacity-0 group-hover:opacity-20 blur transition duration-500 rounded-2xl"></div>
    <div className="relative">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-[#a38c8e] text-xs font-semibold tracking-wider uppercase">{title}</h3>
        <div className="p-2 bg-[#2b1416] rounded-lg text-[#ff2a44]">
          <Icon size={18} />
        </div>
      </div>
      <div className="text-3xl font-bold text-white mb-2">{value}</div>
      <div className="flex items-center text-sm">
        <TrendingUp size={14} className={trend === 'up' ? 'text-[#ff2a44] mr-1' : 'text-gray-500 mr-1'} />
        <span className={trend === 'up' ? 'text-[#ff2a44]' : 'text-gray-500'}>{trendValue}</span>
        <span className="text-[#a38c8e] ml-1 text-xs">dari bulan lepas</span>
      </div>
    </div>
  </div>
);

export default function App() {
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const [activeTabSettings, setActiveTabSettings] = useState('modal');
  const [timeframe, setTimeframe] = useState('Bulan');
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  
  const [planForm, setPlanForm] = useState({
    symbol: '', setup: 'Breakout', riskPct: 2, entry: '', sl: '', tp: '', status: 'Active'
  });

  const handlePlanChange = (e) => {
    const { name, value } = e.target;
    setPlanForm(prev => ({ ...prev, [name]: value }));
  };

  const chartData = timeframe === 'Minggu' ? dataMinggu : timeframe === 'Bulan' ? dataBulan : dataTahun;
  const filteredJournal = mockJournal.filter(trade => trade.symbol.toLowerCase().includes(searchQuery.toLowerCase()));

  // Risk Logic
  const entryPrice = parseFloat(planForm.entry) || 0;
  const slPrice = parseFloat(planForm.sl) || 0;
  const tpPrice = parseFloat(planForm.tp) || 0;
  const riskPct = parseFloat(planForm.riskPct) || 0;
  const riskAmountRM = currentCapital * (riskPct / 100);
  const riskPerUnit = entryPrice > slPrice ? (entryPrice - slPrice) : 0;
  
  let unitsToBuy = 0, capitalNeeded = 0, rrRatio = 0;
  if (entryPrice > 0 && slPrice > 0 && riskPerUnit > 0) {
    unitsToBuy = Math.floor(riskAmountRM / riskPerUnit);
    capitalNeeded = unitsToBuy * entryPrice;
  }
  if (entryPrice > 0 && slPrice > 0 && tpPrice > entryPrice) {
    rrRatio = (tpPrice - entryPrice) / riskPerUnit;
  }
  const isExecuted = planForm.status === 'Executed';

  // --- RENDER VIEWS ---
  const renderDashboard = () => (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Modal Semasa" value={`RM ${currentCapital.toLocaleString('en-MY', {minimumFractionDigits: 2})}`} icon={Wallet} trend="up" trendValue="+12.5%" />
        <StatCard title="Untung Bersih (TNP)" value="RM 511.52" icon={TrendingUp} trend="up" trendValue="+8.2%" />
        <StatCard title="Kadar Kemenangan" value="68.5%" icon={Target} trend="up" trendValue="+5.1%" />
        <StatCard title="Jumlah ROI" value="19.00%" icon={Percent} trend="up" trendValue="+2.4%" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-[#170b0c] border border-[#2b1416] rounded-2xl p-6 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-lg font-bold text-white">Analitik Prestasi Bulanan</h2>
              <p className="text-[#a38c8e] text-xs mt-1">Aliran Keuntungan Bersih (RM) untuk tahun 2026</p>
            </div>
            {/* Butang Timeframe Berfungsi */}
            <div className="flex gap-1 bg-[#090505] p-1 rounded-lg border border-[#2b1416]">
              {['Minggu', 'Bulan', 'Tahun'].map(t => (
                <button 
                  key={t}
                  onClick={() => setTimeframe(t)}
                  className={`px-3 py-1 text-xs rounded-md font-medium transition-colors ${
                    timeframe === t ? 'bg-[#2b1416] text-[#ff2a44] shadow-sm' : 'text-[#a38c8e] hover:text-white'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
          <div className="flex-1 min-h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ff2a44" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#ff2a44" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#2b1416" vertical={false} />
                <XAxis dataKey="name" stroke="#a38c8e" tick={{ fill: '#a38c8e', fontSize: 12 }} axisLine={false} tickLine={false} dy={10} />
                <YAxis stroke="#a38c8e" tick={{ fill: '#a38c8e', fontSize: 12 }} axisLine={false} tickLine={false} dx={-10} />
                <RechartsTooltip contentStyle={{ backgroundColor: '#170b0c', borderColor: '#ff2a44', borderRadius: '8px', color: '#fff' }} itemStyle={{ color: '#ff2a44', fontWeight: 'bold' }} />
                <Area type="monotone" dataKey="profit" stroke="#ff2a44" strokeWidth={3} fillOpacity={1} fill="url(#colorProfit)" activeDot={{ r: 6, fill: '#ff2a44', stroke: '#090505', strokeWidth: 2 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="space-y-6 flex flex-col h-full">
          <div className="bg-[#170b0c] border border-[#2b1416] rounded-2xl p-6 flex-1 flex flex-col min-h-[280px]">
            <h2 className="text-sm font-bold text-white">Pecahan Strategi</h2>
            <p className="text-[#a38c8e] text-xs mb-4">Prestasi mengikut setup (Win Rate %)</p>
            <div className="flex-1 flex flex-col items-center justify-center relative min-h-[150px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={strategyData} cx="50%" cy="50%" innerRadius={50} outerRadius={70} paddingAngle={5} dataKey="value" stroke="none">
                    {strategyData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-2xl font-bold text-white">68%</span>
              </div>
            </div>
            {/* Legend Dikembalikan */}
            <div className="mt-4 space-y-2">
              {strategyData.map((item, index) => (
                <div key={index} className="flex justify-between items-center text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[index] }}></div>
                    <span className="text-[#a38c8e]">{item.name}</span>
                  </div>
                  <span className="text-white font-bold">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Trade Terkini Dikembalikan & Ditapis Berdasarkan Carian */}
      <div className="bg-[#170b0c] border border-[#2b1416] rounded-2xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold">Trade Terkini</h2>
          <button onClick={() => setActiveMenu('journal')} className="text-sm text-[#ff2a44] hover:text-white transition-colors">Lihat Semua</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="border-b border-[#2b1416] text-[#a38c8e] text-xs uppercase tracking-wider">
                <th className="pb-4 pl-2 font-medium">Saham</th>
                <th className="pb-4 font-medium">Strategi</th>
                <th className="pb-4 font-medium">Entry</th>
                <th className="pb-4 font-medium">P&L</th>
                <th className="pb-4 font-medium text-right pr-2">Status</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {filteredJournal.slice(0, 3).map((trade) => (
                <tr key={trade.id} className="border-b border-[#2b1416]/50 hover:bg-[#2b1416]/20 transition-colors">
                  <td className="py-4 pl-2 font-semibold text-white">{trade.symbol}</td>
                  <td className="py-4 text-[#a38c8e]">{trade.setup}</td>
                  <td className="py-4 font-mono text-white">RM {trade.entry.toFixed(3)}</td>
                  <td className={`py-4 font-mono font-bold ${trade.pnl > 0 ? 'text-emerald-400' : trade.pnl < 0 ? 'text-red-400' : 'text-gray-400'}`}>
                    {trade.pnl > 0 ? '+' : ''}{trade.pnl}
                  </td>
                  <td className="py-4 text-right pr-2">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${
                      trade.status === 'WIN' ? 'bg-emerald-900/30 text-emerald-400 border border-emerald-500/30' :
                      trade.status === 'LOSS' ? 'bg-red-900/30 text-red-400 border border-red-500/30' :
                      'bg-gray-800/50 text-gray-400 border border-gray-600/50'
                    }`}>{trade.status}</span>
                  </td>
                </tr>
              ))}
              {filteredJournal.length === 0 && (
                <tr>
                  <td colSpan="5" className="py-8 text-center text-[#a38c8e]">Tiada rekod dijumpai untuk carian ini.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderTradingPlan = () => (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center mb-4">
        <div><h1 className="text-2xl font-bold text-white">Pelan Trading & Position Sizing</h1><p className="text-[#a38c8e] text-sm">Kira saiz lot dan kawal risiko sebelum masuk pasaran.</p></div>
        <div className="bg-[#170b0c] border border-[#2b1416] px-4 py-2 rounded-xl">
           <p className="text-xs text-[#a38c8e]">Modal Rujukan</p>
           <p className="text-lg font-bold text-white">RM {currentCapital.toLocaleString('en-MY', {minimumFractionDigits: 2})}</p>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-[#170b0c] border border-[#2b1416] rounded-2xl p-6 shadow-xl">
          <div className="flex justify-between items-center mb-6 border-b border-[#2b1416] pb-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2"><Target size={20} className="text-[#ff2a44]"/> Parameter Setup</h2>
            <select name="status" value={planForm.status} onChange={handlePlanChange} className={`text-xs font-bold px-3 py-1.5 rounded-full outline-none cursor-pointer border ${planForm.status === 'Active' ? 'bg-blue-900/30 text-blue-400 border-blue-500/30' : planForm.status === 'Watchlist' ? 'bg-yellow-900/30 text-yellow-400 border-yellow-500/30' : planForm.status === 'Executed' ? 'bg-emerald-900/30 text-emerald-400 border-emerald-500/30' : 'bg-gray-800/50 text-gray-400 border-gray-600/50'}`}>
              <option value="Active">🟢 ACTIVE</option><option value="Watchlist">🟡 WATCHLIST</option><option value="Executed">🔒 EXECUTED</option><option value="Cancelled">⚫ CANCELLED</option>
            </select>
          </div>
          {isExecuted && (
            <div className="mb-6 p-3 bg-emerald-900/10 border border-emerald-500/20 rounded-xl flex items-center gap-3 text-emerald-400/80 text-sm">
              <Lock size={16} /><p>Status ditetapkan kepada <strong>Executed</strong>. Data harga dikunci.</p>
            </div>
          )}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="space-y-1"><label className="text-xs text-[#a38c8e] uppercase">Simbol Saham</label><input type="text" name="symbol" value={planForm.symbol} onChange={handlePlanChange} disabled={isExecuted} placeholder="Cth: YTL" className={`w-full bg-[#090505] border border-[#2b1416] rounded-lg p-3 text-white uppercase outline-none focus:border-[#ff2a44] ${isExecuted ? 'opacity-50' : ''}`} /></div>
            <div className="space-y-1"><label className="text-xs text-[#a38c8e] uppercase">Strategi</label><select name="setup" value={planForm.setup} onChange={handlePlanChange} disabled={isExecuted} className={`w-full bg-[#090505] border border-[#2b1416] rounded-lg p-3 text-white outline-none focus:border-[#ff2a44] ${isExecuted ? 'opacity-50' : ''}`}><option>Breakout</option><option>Pullback + Vol</option><option>Reversal</option></select></div>
          </div>
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="space-y-1"><label className="text-xs text-[#a38c8e] uppercase">Entry Price</label><input type="number" step="0.005" name="entry" value={planForm.entry} onChange={handlePlanChange} disabled={isExecuted} placeholder="0.00" className={`w-full bg-[#090505] border border-[#2b1416] rounded-lg p-3 text-white outline-none focus:border-[#ff2a44] font-mono ${isExecuted ? 'opacity-50 text-[#a38c8e]' : ''}`} /></div>
            <div className="space-y-1"><label className="text-xs text-[#a38c8e] uppercase">Stop Loss</label><input type="number" step="0.005" name="sl" value={planForm.sl} onChange={handlePlanChange} disabled={isExecuted} placeholder="0.00" className={`w-full bg-[#090505] border border-[#2b1416] rounded-lg p-3 text-red-400 outline-none focus:border-[#ff2a44] font-mono ${isExecuted ? 'opacity-50' : ''}`} /></div>
            <div className="space-y-1"><label className="text-xs text-[#a38c8e] uppercase">Target Profit</label><input type="number" step="0.005" name="tp" value={planForm.tp} onChange={handlePlanChange} disabled={isExecuted} placeholder="0.00" className={`w-full bg-[#090505] border border-[#2b1416] rounded-lg p-3 text-emerald-400 outline-none focus:border-[#ff2a44] font-mono ${isExecuted ? 'opacity-50' : ''}`} /></div>
          </div>
          <div className="w-1/3 pr-2 space-y-1 mb-8"><label className="text-xs text-[#a38c8e] uppercase">Risiko (%)</label><div className="relative"><input type="number" name="riskPct" value={planForm.riskPct} onChange={handlePlanChange} disabled={isExecuted} className={`w-full bg-[#090505] border border-[#2b1416] rounded-lg p-3 pl-8 text-white outline-none focus:border-[#ff2a44] font-mono ${isExecuted ? 'opacity-50' : ''}`} /><Percent size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#a38c8e]" /></div></div>
          <div className="flex justify-end gap-3">
             <button className="px-6 py-2 rounded-lg border border-[#2b1416] text-[#a38c8e] hover:bg-[#2b1416] text-sm font-semibold">Kosongkan</button>
             <button className="px-6 py-2 rounded-lg bg-[#ff2a44] text-white hover:bg-[#e0253b] flex items-center gap-2 text-sm font-semibold shadow-[0_0_15px_rgba(255,42,68,0.3)]"><Save size={16} /> Simpan Pelan</button>
          </div>
        </div>
        <div className="bg-gradient-to-b from-[#1c0d0f] to-[#110809] border border-[#2b1416] rounded-2xl p-6 relative overflow-hidden">
           <div className="absolute top-0 left-0 w-full h-1 bg-[#ff2a44]"></div><h2 className="text-sm font-bold text-[#a38c8e] uppercase tracking-widest mb-6">Position Sizing</h2>
           <div className="space-y-6">
              <div><p className="text-xs text-[#a38c8e] mb-1">Risiko RM (Sedia Rugi)</p><p className="text-3xl font-bold text-white font-mono">RM {riskAmountRM.toFixed(2)}</p></div>
              <div className="pt-4 border-t border-[#2b1416]"><p className="text-xs text-[#a38c8e] mb-1">Unit Boleh Beli (Lot)</p><p className="text-3xl font-bold text-blue-400 font-mono">{unitsToBuy.toLocaleString()}</p><p className="text-xs text-[#a38c8e] mt-1">= {Math.floor(unitsToBuy/100)} Lot</p></div>
              <div className="pt-4 border-t border-[#2b1416]"><p className="text-xs text-[#a38c8e] mb-1">Modal Diperlukan</p><p className="text-2xl font-bold text-white font-mono">RM {capitalNeeded.toLocaleString('en-MY', {minimumFractionDigits: 2})}</p></div>
              <div className="pt-4 border-t border-[#2b1416] flex justify-between items-center">
                 <div><p className="text-xs text-[#a38c8e] mb-1">Potensi R:R</p><p className={`text-xl font-bold font-mono ${rrRatio >= 2 ? 'text-emerald-400' : 'text-yellow-400'}`}>1 : {rrRatio.toFixed(2)}</p></div>
                 {isExecuted && <div className="bg-[#2b1416] p-2 rounded-full border border-[#4a2528]"><Lock size={20} className="text-[#ff2a44]" /></div>}
              </div>
           </div>
        </div>
      </div>
    </div>
  );

  const renderJournal = () => (
    <div className="space-y-6 animate-in fade-in duration-500">
       <div className="flex justify-between items-center mb-6">
        <div><h1 className="text-2xl font-bold text-white">Jurnal Perdagangan</h1><p className="text-[#a38c8e] text-sm">Rekod sejarah untuk kaji kesilapan dan baiki strategi.</p></div>
        <div className="flex gap-3"><button className="flex items-center gap-2 bg-[#170b0c] border border-[#2b1416] text-[#a38c8e] px-4 py-2 rounded-lg text-sm hover:text-white"><Filter size={16} /> Filter</button><button className="flex items-center gap-2 bg-[#ff2a44] text-white px-4 py-2 rounded-lg text-sm font-bold shadow-[0_0_15px_rgba(255,42,68,0.3)]">Eksport CSV</button></div>
      </div>
      <div className="bg-[#170b0c] border border-[#2b1416] rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="bg-[#110809] border-b border-[#2b1416] text-[#a38c8e] text-xs uppercase tracking-wider"><th className="py-4 pl-6 font-medium">Tarikh</th><th className="py-4 px-4 font-medium">Saham</th><th className="py-4 px-4 font-medium">Setup</th><th className="py-4 px-4 font-medium">Entry</th><th className="py-4 px-4 font-medium">SL</th><th className="py-4 px-4 font-medium">Exit</th><th className="py-4 px-4 font-medium text-center">Unit</th><th className="py-4 px-4 font-medium text-right">Untung/Rugi (RM)</th><th className="py-4 pr-6 font-medium text-right">Status</th></tr>
            </thead>
            <tbody className="text-sm">
              {filteredJournal.map((trade) => (
                <tr key={trade.id} className="border-b border-[#2b1416]/50 hover:bg-[#2b1416]/30">
                  <td className="py-4 pl-6 text-[#a38c8e]">{trade.date}</td><td className="py-4 px-4 font-bold text-white">{trade.symbol}</td><td className="py-4 px-4 text-[#a38c8e]">{trade.setup}</td><td className="py-4 px-4 font-mono">RM {trade.entry.toFixed(3)}</td><td className="py-4 px-4 font-mono text-red-400/80">RM {trade.sl.toFixed(3)}</td><td className="py-4 px-4 font-mono">RM {trade.exit.toFixed(3)}</td><td className="py-4 px-4 font-mono text-center text-[#a38c8e]">{trade.units}</td>
                  <td className={`py-4 px-4 font-mono text-right font-bold ${trade.pnl > 0 ? 'text-emerald-400' : trade.pnl < 0 ? 'text-red-400' : 'text-gray-400'}`}>{trade.pnl > 0 ? '+' : ''}{trade.pnl.toFixed(2)}</td>
                  <td className="py-4 pr-6 text-right"><span className={`px-3 py-1 rounded-full text-[10px] font-bold tracking-wider ${trade.status === 'WIN' ? 'bg-emerald-900/30 text-emerald-400 border border-emerald-500/30' : trade.status === 'LOSS' ? 'bg-red-900/30 text-red-400 border border-red-500/30' : 'bg-gray-800/50 text-gray-400 border border-gray-600/50'}`}>{trade.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Tetapan Sistem</h1>
        <p className="text-[#a38c8e] text-sm">Urus profil, aliran modal, dan parameter trading anda.</p>
      </div>

      <div className="flex gap-4 border-b border-[#2b1416] pb-4 mb-6">
        <button onClick={() => setActiveTabSettings('modal')} className={`px-4 py-2 font-semibold text-sm rounded-lg transition-colors ${activeTabSettings === 'modal' ? 'bg-[#2b1416] text-[#ff2a44]' : 'text-[#a38c8e] hover:text-white'}`}><ArrowRightLeft size={16} className="inline mr-2"/>Deposit / Withdrawal</button>
        <button onClick={() => setActiveTabSettings('setup')} className={`px-4 py-2 font-semibold text-sm rounded-lg transition-colors ${activeTabSettings === 'setup' ? 'bg-[#2b1416] text-[#ff2a44]' : 'text-[#a38c8e] hover:text-white'}`}><Briefcase size={16} className="inline mr-2"/>Setup Trading</button>
        <button onClick={() => setActiveTabSettings('profil')} className={`px-4 py-2 font-semibold text-sm rounded-lg transition-colors ${activeTabSettings === 'profil' ? 'bg-[#2b1416] text-[#ff2a44]' : 'text-[#a38c8e] hover:text-white'}`}><User size={16} className="inline mr-2"/>Profil Akaun</button>
      </div>

      {activeTabSettings === 'modal' && (
        <div className="bg-[#170b0c] border border-[#2b1416] rounded-2xl p-6">
          <h2 className="text-lg font-bold mb-4">Pengurusan Modal Semasa</h2>
          <div className="grid grid-cols-2 gap-6 mb-6">
            <div className="bg-[#090505] p-4 rounded-xl border border-[#2b1416]">
              <p className="text-xs text-[#a38c8e] mb-1">Modal Berdaftar</p>
              <p className="text-2xl font-bold font-mono text-white">RM {currentCapital.toFixed(2)}</p>
            </div>
          </div>
          <div className="flex gap-4 items-end">
            <div className="flex-1 space-y-1">
              <label className="text-xs text-[#a38c8e] uppercase">Jenis Transaksi</label>
              <select className="w-full bg-[#090505] border border-[#2b1416] rounded-lg p-3 text-white outline-none focus:border-[#ff2a44]">
                <option>Deposit (+)</option>
                <option>Withdrawal (-)</option>
              </select>
            </div>
            <div className="flex-1 space-y-1">
              <label className="text-xs text-[#a38c8e] uppercase">Jumlah (RM)</label>
              <input type="number" placeholder="0.00" className="w-full bg-[#090505] border border-[#2b1416] rounded-lg p-3 text-white outline-none focus:border-[#ff2a44] font-mono" />
            </div>
            <button className="bg-[#ff2a44] text-white px-6 py-3 rounded-lg font-bold hover:bg-[#e0253b]">Kemaskini Modal</button>
          </div>
        </div>
      )}

      {activeTabSettings === 'profil' && (
        <div className="bg-[#170b0c] border border-[#2b1416] rounded-2xl p-6">
          <h2 className="text-lg font-bold mb-6">Maklumat Peribadi</h2>
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className="text-xs text-[#a38c8e] uppercase">Nama Penuh</label>
              <input type="text" defaultValue="Aiman Zulkifli" className="w-full bg-[#090505] border border-[#2b1416] rounded-lg p-3 text-white outline-none focus:border-[#ff2a44]" />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-[#a38c8e] uppercase">Emel</label>
              <input type="email" defaultValue="aiman@example.com" className="w-full bg-[#090505] border border-[#2b1416] rounded-lg p-3 text-white outline-none focus:border-[#ff2a44]" />
            </div>
          </div>
          <div className="mt-6">
            <button className="bg-[#2b1416] border border-[#ff2a44] text-[#ff2a44] px-6 py-2 rounded-lg font-bold hover:bg-[#ff2a44] hover:text-white transition-colors">Simpan Profil</button>
          </div>
        </div>
      )}

      {activeTabSettings === 'setup' && (
        <div className="bg-[#170b0c] border border-[#2b1416] rounded-2xl p-6">
          <h2 className="text-lg font-bold mb-2">Senarai Strategi & Setup</h2>
          <p className="text-sm text-[#a38c8e] mb-6">Tambah atau buang nama setup yang anda gunakan dalam jurnal.</p>
          <div className="space-y-3 mb-6">
            <div className="flex justify-between items-center bg-[#090505] border border-[#2b1416] p-3 rounded-lg">
              <span className="text-white font-medium">Breakout</span>
              <button className="text-red-500 text-xs font-bold hover:underline">Padam</button>
            </div>
            <div className="flex justify-between items-center bg-[#090505] border border-[#2b1416] p-3 rounded-lg">
              <span className="text-white font-medium">Pullback + Vol</span>
              <button className="text-red-500 text-xs font-bold hover:underline">Padam</button>
            </div>
            <div className="flex justify-between items-center bg-[#090505] border border-[#2b1416] p-3 rounded-lg">
              <span className="text-white font-medium">Reversal</span>
              <button className="text-red-500 text-xs font-bold hover:underline">Padam</button>
            </div>
          </div>
          <div className="flex gap-3">
            <input type="text" placeholder="Nama setup baru..." className="flex-1 bg-[#090505] border border-[#2b1416] rounded-lg p-3 text-white outline-none focus:border-[#ff2a44]" />
            <button className="bg-[#ff2a44] text-white px-6 py-3 rounded-lg font-bold hover:bg-[#e0253b]">Tambah</button>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="flex h-screen bg-[#090505] text-white font-sans overflow-hidden">
      
      {/* SIDEBAR */}
      <div className="w-64 bg-[#110809] border-r border-[#2b1416] flex flex-col justify-between shrink-0">
        <div>
          <div className="p-8 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#ff2a44] to-[#801522] shadow-[0_0_15px_rgba(255,42,68,0.4)] flex items-center justify-center">
              <Activity size={18} className="text-white" />
            </div>
            <span className="font-bold text-xl tracking-wide">Tickr<span className="text-[#ff2a44]">Log</span></span>
          </div>

          <nav className="px-4 space-y-2 mt-4">
            <p className="px-4 text-[10px] uppercase tracking-widest text-[#a38c8e] font-semibold mb-4">Menu Utama</p>
            
            <button onClick={() => setActiveMenu('dashboard')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeMenu === 'dashboard' ? 'bg-gradient-to-r from-[#2b1416] to-transparent text-[#ff2a44] border-l-2 border-[#ff2a44]' : 'text-[#a38c8e] hover:bg-[#170b0c] hover:text-white'}`}>
              <LayoutDashboard size={18} /> <span className="font-medium text-sm">Dashboard</span>
            </button>
            <button onClick={() => setActiveMenu('plan')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeMenu === 'plan' ? 'bg-gradient-to-r from-[#2b1416] to-transparent text-[#ff2a44] border-l-2 border-[#ff2a44]' : 'text-[#a38c8e] hover:bg-[#170b0c] hover:text-white'}`}>
              <Target size={18} /> <span className="font-medium text-sm">Pelan Trading</span>
            </button>
            <button onClick={() => setActiveMenu('journal')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeMenu === 'journal' ? 'bg-gradient-to-r from-[#2b1416] to-transparent text-[#ff2a44] border-l-2 border-[#ff2a44]' : 'text-[#a38c8e] hover:bg-[#170b0c] hover:text-white'}`}>
              <BookOpen size={18} /> <span className="font-medium text-sm">Jurnal</span>
            </button>
          </nav>
        </div>
        
        {/* Butang Tetapan (Settings) di Bawah Kiri */}
        <div className="p-4 border-t border-[#2b1416]">
          <button onClick={() => setActiveMenu('settings')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeMenu === 'settings' ? 'bg-gradient-to-r from-[#2b1416] to-transparent text-[#ff2a44] border-l-2 border-[#ff2a44]' : 'text-[#a38c8e] hover:bg-[#170b0c] hover:text-white'}`}>
            <Settings size={18} /> <span className="font-medium text-sm">Tetapan</span>
          </button>
        </div>
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Header */}
        <header className="h-20 border-b border-[#2b1416] flex items-center justify-between px-8 bg-[#090505]/80 backdrop-blur-md sticky top-0 z-10 shrink-0">
          <div className="relative w-72">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#a38c8e]" />
            <input 
              type="text" 
              placeholder="Cari simbol saham..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#170b0c] border border-[#2b1416] rounded-full py-2 pl-10 pr-4 text-sm text-white placeholder-[#a38c8e] focus:outline-none focus:border-[#ff2a44] transition-colors uppercase" 
            />
          </div>
          
          <div className="flex items-center gap-6">
            <button onClick={() => setActiveMenu('plan')} className="hidden md:flex items-center gap-2 bg-[#ff2a44] text-white px-4 py-2 rounded-lg text-sm font-bold shadow-[0_0_15px_rgba(255,42,68,0.3)] hover:bg-[#e0253b] transition-all">
              <Plus size={16} /> Trade Baru
            </button>
            <div className="w-px h-6 bg-[#2b1416]"></div>
            
            {/* Loceng Notifikasi */}
            <div className="relative">
              <button onClick={() => setShowNotifications(!showNotifications)} className="text-[#a38c8e] hover:text-white transition-colors relative">
                <Bell size={20} />
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-[#ff2a44] rounded-full shadow-[0_0_5px_#ff2a44]"></span>
              </button>
              {showNotifications && (
                <div className="absolute right-0 mt-4 w-64 bg-[#170b0c] border border-[#2b1416] rounded-xl shadow-2xl py-2 z-50">
                  <p className="text-xs text-[#a38c8e] uppercase px-4 py-2 border-b border-[#2b1416] font-bold">Notifikasi Baru</p>
                  <div className="px-4 py-3 hover:bg-[#2b1416]/40 cursor-pointer">
                    <p className="text-sm text-white font-medium">Amaran Risiko</p>
                    <p className="text-xs text-[#a38c8e] mt-1">YTL sedang menghampiri paras Stop Loss.</p>
                  </div>
                </div>
              )}
            </div>
            
            <div onClick={() => setActiveMenu('settings')} className="flex items-center gap-3 cursor-pointer group">
              <div className="w-9 h-9 rounded-full bg-[#2b1416] border border-[#ff2a44] flex items-center justify-center text-sm font-bold group-hover:bg-[#ff2a44] transition-colors">AZ</div>
              <div className="hidden md:block">
                <p className="text-sm font-semibold group-hover:text-[#ff2a44] transition-colors">Aiman Zulkifli</p>
                <p className="text-[10px] text-[#a38c8e]">Trader Profesional</p>
              </div>
              <ChevronDown size={14} className="text-[#a38c8e]" />
            </div>
          </div>
        </header>

        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto p-8 scrollbar-hide">
          {activeMenu === 'dashboard' && renderDashboard()}
          {activeMenu === 'plan' && renderTradingPlan()}
          {activeMenu === 'journal' && renderJournal()}
          {activeMenu === 'settings' && renderSettings()}
        </main>
      </div>
    </div>
  );
}
```eof
