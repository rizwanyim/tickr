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
  Unlock,
  Save,
  Plus,
  ArrowRight,
  Filter,
  ArrowUpRight,
  ArrowDownRight
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

const currentCapital = 1050.00; 

const monthlyData = [
  { name: 'Jan', profit: 120 }, { name: 'Feb', profit: 300 },
  { name: 'Mac', profit: -50 }, { name: 'Apr', profit: 450 },
  { name: 'Mei', profit: 200 }, { name: 'Jun', profit: 600 },
  { name: 'Jul', profit: 850 }, { name: 'Ogo', profit: 400 },
  { name: 'Sep', profit: 950 }, { name: 'Okt', profit: 1200 },
  { name: 'Nov', profit: 1050 }, { name: 'Dis', profit: 1500 },
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

const StatCard = ({ title, value, icon: Icon, trend, trendValue }) => (
  <div className="bg-[#170b0c] border border-[#2b1416] rounded-2xl p-6 relative overflow-hidden group hover:border-[#ff2a44]/50 transition-colors duration-300">
    <div className="absolute -inset-0.5 bg-gradient-to-r from-[#ff2a44] to-transparent opacity-0 group-hover:opacity-20 blur transition duration-500 rounded-2xl"></div>
    <div className="relative">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-[#a38c8e] text-xs font-semibold tracking-wider uppercase">{title}</h3>
        <div className="p-2 bg-[#2b1416] rounded-lg text-[#ff2a44] group-hover:scale-110 transition-transform duration-300">
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
  
  // State untuk Kalkulator Pelan Trading
  const [planForm, setPlanForm] = useState({
    symbol: '',
    setup: 'Breakout',
    riskPct: 2,
    entry: '',
    sl: '',
    tp: '',
    status: 'Active'
  });

  const handlePlanChange = (e) => {
    const { name, value } = e.target;
    setPlanForm(prev => ({ ...prev, [name]: value }));
  };

  const entryPrice = parseFloat(planForm.entry) || 0;
  const slPrice = parseFloat(planForm.sl) || 0;
  const tpPrice = parseFloat(planForm.tp) || 0;
  const riskPct = parseFloat(planForm.riskPct) || 0;

  const riskAmountRM = currentCapital * (riskPct / 100);
  const riskPerUnit = entryPrice > slPrice ? (entryPrice - slPrice) : 0;
  
  let unitsToBuy = 0;
  let capitalNeeded = 0;
  let rrRatio = 0;

  if (entryPrice > 0 && slPrice > 0 && riskPerUnit > 0) {
    unitsToBuy = Math.floor(riskAmountRM / riskPerUnit);
    capitalNeeded = unitsToBuy * entryPrice;
  }

  if (entryPrice > 0 && slPrice > 0 && tpPrice > entryPrice) {
    const rewardPerUnit = tpPrice - entryPrice;
    rrRatio = rewardPerUnit / riskPerUnit;
  }

  const isExecuted = planForm.status === 'Executed';

  const renderDashboard = () => (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Top Widgets Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Modal Semasa" value={`RM ${currentCapital.toLocaleString('en-MY', {minimumFractionDigits: 2})}`} icon={Wallet} trend="up" trendValue="+12.5%" />
        <StatCard title="Untung Bersih (TNP)" value="RM 511.52" icon={TrendingUp} trend="up" trendValue="+8.2%" />
        <StatCard title="Kadar Kemenangan" value="68.5%" icon={Target} trend="up" trendValue="+5.1%" />
        <StatCard title="Jumlah ROI" value="19.00%" icon={Percent} trend="up" trendValue="+2.4%" />
      </div>

      {/* Middle Row: Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Area Chart */}
        <div className="lg:col-span-2 bg-[#170b0c] border border-[#2b1416] rounded-2xl p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-lg font-bold text-white">Analitik Prestasi Bulanan</h2>
              <p className="text-[#a38c8e] text-xs mt-1">Aliran Keuntungan Bersih (RM) untuk tahun 2026</p>
            </div>
            <div className="flex gap-2 bg-[#090505] p-1 rounded-lg border border-[#2b1416]">
                <button className="px-3 py-1 text-xs rounded-md text-[#a38c8e] hover:text-white transition-colors">Minggu</button>
                <button className="px-3 py-1 text-xs rounded-md bg-[#2b1416] text-[#ff2a44] font-medium shadow-sm">Bulan</button>
                <button className="px-3 py-1 text-xs rounded-md text-[#a38c8e] hover:text-white transition-colors">Tahun</button>
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
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

        {/* Strategy Donut */}
        <div className="bg-[#170b0c] border border-[#2b1416] rounded-2xl p-6 flex flex-col">
          <h2 className="text-lg font-bold mb-1 text-white">Pecahan Strategi</h2>
          <p className="text-[#a38c8e] text-xs mb-6">Prestasi mengikut setup (Win Rate %)</p>
          <div className="flex-1 flex flex-col items-center justify-center relative">
            <div className="h-[200px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={strategyData} cx="50%" cy="50%" innerRadius={65} outerRadius={85} paddingAngle={5} dataKey="value" stroke="none">
                    {strategyData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} className="hover:opacity-80 transition-opacity cursor-pointer" />
                    ))}
                  </Pie>
                  <RechartsTooltip contentStyle={{ backgroundColor: '#090505', borderColor: '#2b1416', borderRadius: '8px' }} itemStyle={{ color: '#fff' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pb-2">
              <span className="text-3xl font-bold text-white">68%</span>
              <span className="text-[10px] text-[#a38c8e] uppercase tracking-wider">Avg Win</span>
            </div>
          </div>
          <div className="mt-4 space-y-3">
            {strategyData.map((item, index) => (
              <div key={index} className="flex items-center justify-between group cursor-pointer">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full group-hover:scale-125 transition-transform" style={{ backgroundColor: COLORS[index] }}></div>
                  <span className="text-sm text-[#a38c8e] group-hover:text-white transition-colors">{item.name}</span>
                </div>
                <span className="text-sm font-semibold text-white">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Row: Recent Trades & Risk Reward */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Trades Table */}
        <div className="lg:col-span-2 bg-[#170b0c] border border-[#2b1416] rounded-2xl p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-white">Trade Terkini</h2>
            <button onClick={() => setActiveMenu('journal')} className="text-sm text-[#ff2a44] hover:text-white transition-colors">Lihat Semua</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#2b1416] text-[#a38c8e] text-xs uppercase tracking-wider">
                  <th className="pb-4 pl-2 font-medium">Saham</th>
                  <th className="pb-4 font-medium">Strategi</th>
                  <th className="pb-4 font-medium">Entry</th>
                  <th className="pb-4 font-medium">Nilai</th>
                  <th className="pb-4 font-medium text-right pr-2">Status</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                <tr className="border-b border-[#2b1416]/50 hover:bg-[#2b1416]/40 transition-colors cursor-pointer group">
                  <td className="py-4 pl-2 font-semibold text-white group-hover:text-[#ff2a44] transition-colors">QES (0196)</td>
                  <td className="py-4 text-[#a38c8e]">Pullback + Vol</td>
                  <td className="py-4 text-white">RM 0.545</td>
                  <td className="py-4 text-white">RM 817.50</td>
                  <td className="py-4 text-right pr-2"><span className="bg-[#4a2528]/40 text-[#ff2a44] border border-[#ff2a44]/30 px-3 py-1 rounded-full text-xs font-bold">FLOATING</span></td>
                </tr>
                <tr className="border-b border-[#2b1416]/50 hover:bg-[#2b1416]/40 transition-colors cursor-pointer group">
                  <td className="py-4 pl-2 font-semibold text-white group-hover:text-[#ff2a44] transition-colors">YTL (4677)</td>
                  <td className="py-4 text-[#a38c8e]">Breakout</td>
                  <td className="py-4 text-white">RM 1.250</td>
                  <td className="py-4 text-white">RM 1,250.00</td>
                  <td className="py-4 text-right pr-2"><span className="bg-emerald-900/30 text-emerald-400 border border-emerald-500/30 px-3 py-1 rounded-full text-xs font-bold">WIN</span></td>
                </tr>
                <tr className="hover:bg-[#2b1416]/40 transition-colors cursor-pointer group">
                  <td className="py-4 pl-2 font-semibold text-white group-hover:text-[#ff2a44] transition-colors">DNEX (4456)</td>
                  <td className="py-4 text-[#a38c8e]">Reversal</td>
                  <td className="py-4 text-white">RM 0.355</td>
                  <td className="py-4 text-white">RM 1,065.00</td>
                  <td className="py-4 text-right pr-2"><span className="bg-gray-800/50 text-gray-400 border border-gray-600/50 px-3 py-1 rounded-full text-xs font-bold">BREAKEVEN</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Risk Reward Ratio Card */}
        <div className="bg-[#170b0c] border border-[#2b1416] rounded-2xl p-6 flex flex-col justify-between hover:border-[#ff2a44]/50 transition-colors duration-300">
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold text-white">Nisbah Risiko : Ganjaran</h2>
              <div className="p-2 bg-[#2b1416] rounded-lg text-white"><Target size={16} /></div>
            </div>
            <p className="text-[#a38c8e] text-xs mb-6 leading-relaxed">Purata kemenangan berbanding purata kerugian anda. Penunjuk kesihatan jangka panjang.</p>
            <div className="flex justify-between items-end mb-2">
              <div>
                <p className="text-[#a38c8e] text-xs mb-1">Purata Untung</p>
                <div className="flex items-center text-emerald-400 font-bold text-xl"><ArrowUpRight size={18} className="mr-1" />RM 420.50</div>
              </div>
              <div className="text-right">
                <p className="text-[#a38c8e] text-xs mb-1">Purata Rugi</p>
                <div className="flex items-center text-[#ff2a44] font-bold text-xl justify-end"><ArrowDownRight size={18} className="mr-1" />RM 180.20</div>
              </div>
            </div>
          </div>
          <div className="mt-6">
            <div className="flex justify-between text-xs font-bold mb-2">
              <span className="text-white">Nisbah Semasa</span>
              <span className="text-[#ff2a44]">1 : 2.33</span>
            </div>
            <div className="h-3 w-full bg-[#090505] rounded-full overflow-hidden flex border border-[#2b1416]">
              <div className="h-full bg-emerald-500 w-[70%]"></div>
              <div className="h-full bg-[#ff2a44] w-[30%]"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTradingPlan = () => (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Pelan Trading & Position Sizing</h1>
          <p className="text-[#a38c8e] text-sm">Kira saiz lot dan kawal risiko sebelum masuk pasaran.</p>
        </div>
        <div className="bg-[#170b0c] border border-[#2b1416] px-4 py-2 rounded-xl">
           <p className="text-xs text-[#a38c8e]">Modal Rujukan</p>
           <p className="text-lg font-bold text-white">RM {currentCapital.toLocaleString('en-MY', {minimumFractionDigits: 2})}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-[#170b0c] border border-[#2b1416] rounded-2xl p-6 shadow-xl">
          <div className="flex justify-between items-center mb-6 border-b border-[#2b1416] pb-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Target size={20} className="text-[#ff2a44]"/> Parameter Setup
            </h2>
            <select 
              name="status"
              value={planForm.status}
              onChange={handlePlanChange}
              className={`text-xs font-bold px-3 py-1.5 rounded-full outline-none cursor-pointer border ${
                planForm.status === 'Active' ? 'bg-blue-900/30 text-blue-400 border-blue-500/30' :
                planForm.status === 'Watchlist' ? 'bg-yellow-900/30 text-yellow-400 border-yellow-500/30' :
                planForm.status === 'Executed' ? 'bg-emerald-900/30 text-emerald-400 border-emerald-500/30' :
                'bg-gray-800/50 text-gray-400 border-gray-600/50'
              }`}
            >
              <option value="Active">🟢 ACTIVE</option>
              <option value="Watchlist">🟡 WATCHLIST</option>
              <option value="Executed">🔒 EXECUTED</option>
              <option value="Cancelled">⚫ CANCELLED</option>
            </select>
          </div>

          {isExecuted && (
            <div className="mb-6 p-3 bg-emerald-900/10 border border-emerald-500/20 rounded-xl flex items-center gap-3 text-emerald-400/80 text-sm">
              <Lock size={16} />
              <p>Status ditetapkan kepada <strong>Executed</strong>. Data harga dikunci dan tidak akan terjejas oleh perubahan modal.</p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="space-y-1">
              <label className="text-xs text-[#a38c8e] uppercase tracking-wider">Simbol Saham</label>
              <input type="text" name="symbol" value={planForm.symbol} onChange={handlePlanChange} disabled={isExecuted} placeholder="Cth: YTL" 
                className={`w-full bg-[#090505] border border-[#2b1416] rounded-lg p-3 text-white focus:outline-none focus:border-[#ff2a44] uppercase ${isExecuted ? 'opacity-50 cursor-not-allowed' : ''}`} />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-[#a38c8e] uppercase tracking-wider">Strategi</label>
              <select name="setup" value={planForm.setup} onChange={handlePlanChange} disabled={isExecuted}
                className={`w-full bg-[#090505] border border-[#2b1416] rounded-lg p-3 text-white focus:outline-none focus:border-[#ff2a44] ${isExecuted ? 'opacity-50 cursor-not-allowed' : ''}`}>
                <option>Breakout</option>
                <option>Pullback + Vol</option>
                <option>Reversal</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="space-y-1">
              <label className="text-xs text-[#a38c8e] uppercase tracking-wider">Entry Price</label>
              <input type="number" step="0.005" name="entry" value={planForm.entry} onChange={handlePlanChange} disabled={isExecuted} placeholder="0.00" 
                className={`w-full bg-[#090505] border border-[#2b1416] rounded-lg p-3 text-white focus:outline-none focus:border-[#ff2a44] font-mono ${isExecuted ? 'opacity-50 cursor-not-allowed text-[#a38c8e]' : ''}`} />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-[#a38c8e] uppercase tracking-wider">Stop Loss</label>
              <input type="number" step="0.005" name="sl" value={planForm.sl} onChange={handlePlanChange} disabled={isExecuted} placeholder="0.00" 
                className={`w-full bg-[#090505] border border-[#2b1416] rounded-lg p-3 text-red-400 focus:outline-none focus:border-[#ff2a44] font-mono ${isExecuted ? 'opacity-50 cursor-not-allowed' : ''}`} />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-[#a38c8e] uppercase tracking-wider">Target Profit</label>
              <input type="number" step="0.005" name="tp" value={planForm.tp} onChange={handlePlanChange} disabled={isExecuted} placeholder="0.00" 
                className={`w-full bg-[#090505] border border-[#2b1416] rounded-lg p-3 text-emerald-400 focus:outline-none focus:border-[#ff2a44] font-mono ${isExecuted ? 'opacity-50 cursor-not-allowed' : ''}`} />
            </div>
          </div>
          
          <div className="w-1/3 pr-2 space-y-1 mb-8">
            <label className="text-xs text-[#a38c8e] uppercase tracking-wider">Risiko (%)</label>
            <div className="relative">
              <input type="number" name="riskPct" value={planForm.riskPct} onChange={handlePlanChange} disabled={isExecuted} 
                className={`w-full bg-[#090505] border border-[#2b1416] rounded-lg p-3 pl-8 text-white focus:outline-none focus:border-[#ff2a44] font-mono ${isExecuted ? 'opacity-50 cursor-not-allowed' : ''}`} />
              <Percent size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#a38c8e]" />
            </div>
          </div>

          <div className="flex justify-end gap-3">
             <button className="px-6 py-2 rounded-lg border border-[#2b1416] text-[#a38c8e] hover:bg-[#2b1416] transition-colors text-sm font-semibold">Kosongkan</button>
             <button className="px-6 py-2 rounded-lg bg-[#ff2a44] text-white hover:bg-[#e0253b] transition-colors flex items-center gap-2 text-sm font-semibold shadow-[0_0_15px_rgba(255,42,68,0.3)]">
                <Save size={16} /> Simpan Pelan
             </button>
          </div>
        </div>

        <div className="bg-gradient-to-b from-[#1c0d0f] to-[#110809] border border-[#2b1416] rounded-2xl p-6 relative overflow-hidden">
           <div className="absolute top-0 left-0 w-full h-1 bg-[#ff2a44]"></div>
           <h2 className="text-sm font-bold text-[#a38c8e] uppercase tracking-widest mb-6">Position Sizing</h2>
           
           <div className="space-y-6">
              <div>
                 <p className="text-xs text-[#a38c8e] mb-1">Risiko RM (Sedia Rugi)</p>
                 <p className="text-3xl font-bold text-white font-mono">RM {riskAmountRM.toFixed(2)}</p>
              </div>
              
              <div className="pt-4 border-t border-[#2b1416]">
                 <p className="text-xs text-[#a38c8e] mb-1">Unit Boleh Beli (Lot)</p>
                 <p className="text-3xl font-bold text-blue-400 font-mono">{unitsToBuy.toLocaleString()}</p>
                 <p className="text-xs text-[#a38c8e] mt-1">= {Math.floor(unitsToBuy/100)} Lot (Bursa)</p>
              </div>

              <div className="pt-4 border-t border-[#2b1416]">
                 <p className="text-xs text-[#a38c8e] mb-1">Modal Diperlukan</p>
                 <p className="text-2xl font-bold text-white font-mono">RM {capitalNeeded.toLocaleString('en-MY', {minimumFractionDigits: 2})}</p>
                 {capitalNeeded > currentCapital && (
                    <p className="text-xs text-[#ff2a44] mt-1 font-semibold flex items-center gap-1">
                      ⚠️ Modal Semasa Tidak Mencukupi
                    </p>
                 )}
              </div>

              <div className="pt-4 border-t border-[#2b1416] flex justify-between items-center">
                 <div>
                    <p className="text-xs text-[#a38c8e] mb-1">Potensi R:R</p>
                    <p className={`text-xl font-bold font-mono ${rrRatio >= 2 ? 'text-emerald-400' : 'text-yellow-400'}`}>
                      1 : {rrRatio.toFixed(2)}
                    </p>
                 </div>
                 {isExecuted && (
                   <div className="bg-[#2b1416] p-2 rounded-full border border-[#4a2528] shadow-[0_0_10px_rgba(255,42,68,0.2)]">
                     <Lock size={20} className="text-[#ff2a44]" />
                   </div>
                 )}
              </div>
           </div>
        </div>
      </div>
    </div>
  );

  const renderJournal = () => (
    <div className="space-y-6 animate-in fade-in duration-500">
       <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Jurnal Perdagangan</h1>
          <p className="text-[#a38c8e] text-sm">Rekod sejarah untuk kaji kesilapan dan baiki strategi.</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 bg-[#170b0c] border border-[#2b1416] text-[#a38c8e] px-4 py-2 rounded-lg text-sm hover:text-white transition-colors">
            <Filter size={16} /> Filter
          </button>
          <button className="flex items-center gap-2 bg-[#ff2a44] text-white px-4 py-2 rounded-lg text-sm font-bold shadow-[0_0_15px_rgba(255,42,68,0.3)]">
            Eksport CSV
          </button>
        </div>
      </div>

      <div className="bg-[#170b0c] border border-[#2b1416] rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="bg-[#110809] border-b border-[#2b1416] text-[#a38c8e] text-xs uppercase tracking-wider">
                <th className="py-4 pl-6 font-medium">Tarikh</th>
                <th className="py-4 px-4 font-medium">Saham</th>
                <th className="py-4 px-4 font-medium">Setup</th>
                <th className="py-4 px-4 font-medium">Entry</th>
                <th className="py-4 px-4 font-medium">SL</th>
                <th className="py-4 px-4 font-medium">Exit</th>
                <th className="py-4 px-4 font-medium text-center">Unit</th>
                <th className="py-4 px-4 font-medium text-right">Untung/Rugi (RM)</th>
                <th className="py-4 pr-6 font-medium text-right">Status</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {mockJournal.map((trade) => (
                <tr key={trade.id} className="border-b border-[#2b1416]/50 hover:bg-[#2b1416]/30 transition-colors">
                  <td className="py-4 pl-6 text-[#a38c8e]">{trade.date}</td>
                  <td className="py-4 px-4 font-bold text-white">{trade.symbol}</td>
                  <td className="py-4 px-4 text-[#a38c8e]">{trade.setup}</td>
                  <td className="py-4 px-4 font-mono">RM {trade.entry.toFixed(3)}</td>
                  <td className="py-4 px-4 font-mono text-red-400/80">RM {trade.sl.toFixed(3)}</td>
                  <td className="py-4 px-4 font-mono">RM {trade.exit.toFixed(3)}</td>
                  <td className="py-4 px-4 font-mono text-center text-[#a38c8e]">{trade.units}</td>
                  <td className={`py-4 px-4 font-mono text-right font-bold ${trade.pnl > 0 ? 'text-emerald-400' : trade.pnl < 0 ? 'text-red-400' : 'text-gray-400'}`}>
                    {trade.pnl > 0 ? '+' : ''}{trade.pnl.toFixed(2)}
                  </td>
                  <td className="py-4 pr-6 text-right">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold tracking-wider ${
                      trade.status === 'WIN' ? 'bg-emerald-900/30 text-emerald-400 border border-emerald-500/30' :
                      trade.status === 'LOSS' ? 'bg-red-900/30 text-red-400 border border-red-500/30' :
                      'bg-gray-800/50 text-gray-400 border border-gray-600/50'
                    }`}>
                      {trade.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
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
            
            <button onClick={() => setActiveMenu('dashboard')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                activeMenu === 'dashboard' ? 'bg-gradient-to-r from-[#2b1416] to-transparent text-[#ff2a44] border-l-2 border-[#ff2a44]' : 'text-[#a38c8e] hover:bg-[#170b0c] hover:text-white'
              }`}>
              <LayoutDashboard size={18} /> <span className="font-medium text-sm">Dashboard</span>
            </button>

            <button onClick={() => setActiveMenu('plan')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                activeMenu === 'plan' ? 'bg-gradient-to-r from-[#2b1416] to-transparent text-[#ff2a44] border-l-2 border-[#ff2a44]' : 'text-[#a38c8e] hover:bg-[#170b0c] hover:text-white'
              }`}>
              <Target size={18} /> <span className="font-medium text-sm">Pelan Trading</span>
            </button>

            <button onClick={() => setActiveMenu('journal')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                activeMenu === 'journal' ? 'bg-gradient-to-r from-[#2b1416] to-transparent text-[#ff2a44] border-l-2 border-[#ff2a44]' : 'text-[#a38c8e] hover:bg-[#170b0c] hover:text-white'
              }`}>
              <BookOpen size={18} /> <span className="font-medium text-sm">Jurnal</span>
            </button>
          </nav>
        </div>

        {/* SETTINGS BUTTON AT BOTTOM LEFT */}
        <div className="p-4">
          <button className="w-full flex items-center gap-3 px-4 py-3 text-[#a38c8e] hover:bg-[#170b0c] hover:text-white rounded-xl transition-colors">
            <Settings size={18} />
            <span className="font-medium text-sm">Tetapan</span>
          </button>
        </div>
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        
        {/* Header */}
        <header className="h-20 border-b border-[#2b1416] flex items-center justify-between px-8 bg-[#090505]/80 backdrop-blur-md sticky top-0 z-10 shrink-0">
          <div className="relative w-72">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#a38c8e]" />
            <input type="text" placeholder="Cari simbol saham..." 
              className="w-full bg-[#170b0c] border border-[#2b1416] rounded-full py-2 pl-10 pr-4 text-sm text-white placeholder-[#a38c8e] focus:outline-none focus:border-[#ff2a44] transition-colors" />
          </div>
          
          <div className="flex items-center gap-6">
            <button onClick={() => setActiveMenu('plan')} className="hidden md:flex items-center gap-2 bg-[#ff2a44] text-white px-4 py-2 rounded-lg text-sm font-bold shadow-[0_0_15px_rgba(255,42,68,0.3)] hover:bg-[#e0253b] transition-all">
              <Plus size={16} /> Trade Baru
            </button>
            <div className="w-px h-6 bg-[#2b1416]"></div>
            <button className="relative text-[#a38c8e] hover:text-white transition-colors">
              <Bell size={20} />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-[#ff2a44] rounded-full shadow-[0_0_5px_#ff2a44]"></span>
            </button>
            <div className="flex items-center gap-3 cursor-pointer group">
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
        </main>
      </div>
    </div>
  );
}
