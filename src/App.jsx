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
  Plus,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

// --- MOCK DATA ---
const monthlyData = [
  { name: 'Jan', profit: 120 },
  { name: 'Feb', profit: 300 },
  { name: 'Mac', profit: -50 },
  { name: 'Apr', profit: 450 },
  { name: 'Mei', profit: 200 },
  { name: 'Jun', profit: 600 },
  { name: 'Jul', profit: 850 },
  { name: 'Ogo', profit: 400 },
  { name: 'Sep', profit: 950 },
  { name: 'Okt', profit: 1200 },
  { name: 'Nov', profit: 1050 },
  { name: 'Dis', profit: 1500 },
];

const strategyData = [
  { name: 'Pullback + Vol', value: 45 },
  { name: 'Breakout', value: 30 },
  { name: 'Reversal', value: 25 },
];

const COLORS = ['#ff2a44', '#ff7b8c', '#4a2528'];

// --- COMPONENTS ---
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
        <span className={trend === 'up' ? 'text-[#ff2a44]' : 'text-gray-500'}>
          {trendValue}
        </span>
        <span className="text-[#a38c8e] ml-1 text-xs">dari bulan lepas</span>
      </div>
    </div>
  </div>
);

export default function App() {
  const [activeMenu, setActiveMenu] = useState('dashboard');

  // Fungsi untuk memaparkan kandungan berdasarkan menu yang dipilih
  const renderContent = () => {
    if (activeMenu === 'plan') {
      return (
        <div className="flex-1 flex flex-col items-center justify-center h-full text-center p-8">
          <Target size={64} className="text-[#ff2a44] mb-4 opacity-50" />
          <h2 className="text-2xl font-bold mb-2">Pelan Trading</h2>
          <p className="text-[#a38c8e]">Modul Position Sizing sedang dibangunkan...</p>
        </div>
      );
    }

    if (activeMenu === 'journal') {
      return (
        <div className="flex-1 flex flex-col items-center justify-center h-full text-center p-8">
          <BookOpen size={64} className="text-[#ff2a44] mb-4 opacity-50" />
          <h2 className="text-2xl font-bold mb-2">Jurnal Trading</h2>
          <p className="text-[#a38c8e]">Modul Rekod Transaksi sedang dibangunkan...</p>
        </div>
      );
    }

    // Jika menu = 'dashboard', keluarkan paparan asal
    return (
      <div className="grid-cols-1 overflow-y-auto scrollbar-hide">
        {/* Top Widgets Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard title="Modal Semasa" value="RM 1,050.00" icon={Wallet} trend="up" trendValue="+12.5%" />
          <StatCard title="Untung Bersih (TNP)" value="RM 511.52" icon={TrendingUp} trend="up" trendValue="+8.2%" />
          <StatCard title="Kadar Kemenangan" value="68.5%" icon={Target} trend="up" trendValue="+5.1%" />
          <StatCard title="Jumlah ROI" value="19.00%" icon={Percent} trend="up" trendValue="+2.4%" />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Area Chart */}
          <div className="lg:col-span-2 bg-[#170b0c] border border-[#2b1416] rounded-2xl p-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-lg font-bold">Analitik Prestasi Bulanan</h2>
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
                  <Tooltip contentStyle={{ backgroundColor: '#170b0c', borderColor: '#ff2a44', borderRadius: '8px', color: '#fff' }} itemStyle={{ color: '#ff2a44', fontWeight: 'bold' }} />
                  <Area type="monotone" dataKey="profit" stroke="#ff2a44" strokeWidth={3} fillOpacity={1} fill="url(#colorProfit)" activeDot={{ r: 6, fill: '#ff2a44', stroke: '#090505', strokeWidth: 2 }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Donut Chart */}
          <div className="bg-[#170b0c] border border-[#2b1416] rounded-2xl p-6 flex flex-col">
            <h2 className="text-lg font-bold mb-1">Pecahan Strategi</h2>
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
                    <Tooltip contentStyle={{ backgroundColor: '#090505', borderColor: '#2b1416', borderRadius: '8px' }} itemStyle={{ color: '#fff' }} />
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
                  <span className="text-sm font-semibold">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Bottom Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-[#170b0c] border border-[#2b1416] rounded-2xl p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold">Trade Terkini</h2>
              <button className="text-sm text-[#ff2a44] hover:text-white transition-colors">Lihat Semua</button>
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
                    <td className="py-4 pl-2 font-semibold group-hover:text-[#ff2a44] transition-colors">QES (0196)</td>
                    <td className="py-4 text-[#a38c8e]">Pullback + Vol</td>
                    <td className="py-4">RM 0.545</td>
                    <td className="py-4">RM 817.50</td>
                    <td className="py-4 text-right pr-2"><span className="bg-[#4a2528]/40 text-[#ff2a44] border border-[#ff2a44]/30 px-3 py-1 rounded-full text-xs font-bold">FLOATING</span></td>
                  </tr>
                  <tr className="border-b border-[#2b1416]/50 hover:bg-[#2b1416]/40 transition-colors cursor-pointer group">
                    <td className="py-4 pl-2 font-semibold group-hover:text-[#ff2a44] transition-colors">YTL (4677)</td>
                    <td className="py-4 text-[#a38c8e]">Breakout</td>
                    <td className="py-4">RM 1.250</td>
                    <td className="py-4">RM 1,250.00</td>
                    <td className="py-4 text-right pr-2"><span className="bg-emerald-900/30 text-emerald-400 border border-emerald-500/30 px-3 py-1 rounded-full text-xs font-bold">WIN</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          
          <div className="bg-[#170b0c] border border-[#2b1416] rounded-2xl p-6 flex flex-col justify-between hover:border-[#ff2a44]/50 transition-colors duration-300">
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-bold">Nisbah Risiko : Ganjaran</h2>
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
  };

  return (
    <div className="flex h-screen bg-[#090505] text-white overflow-hidden selection:bg-[#ff2a44] selection:text-white">
      {/* SIDEBAR */}
      <div className="w-64 bg-[#110809] border-r border-[#2b1416] flex flex-col justify-between z-20 relative">
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
              <LayoutDashboard size={18} />
              <span className="font-medium text-sm">Dashboard</span>
            </button>
            <button onClick={() => setActiveMenu('plan')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeMenu === 'plan' ? 'bg-gradient-to-r from-[#2b1416] to-transparent text-[#ff2a44] border-l-2 border-[#ff2a44]' : 'text-[#a38c8e] hover:bg-[#170b0c] hover:text-white'}`}>
              <Target size={18} />
              <span className="font-medium text-sm">Pelan Trading</span>
            </button>
            <button onClick={() => setActiveMenu('journal')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeMenu === 'journal' ? 'bg-gradient-to-r from-[#2b1416] to-transparent text-[#ff2a44] border-l-2 border-[#ff2a44]' : 'text-[#a38c8e] hover:bg-[#170b0c] hover:text-white'}`}>
              <BookOpen size={18} />
              <span className="font-medium text-sm">Jurnal</span>
            </button>
          </nav>
        </div>

        <div className="p-4">
          <button className="w-full flex items-center gap-3 px-4 py-3 text-[#a38c8e] hover:text-white transition-colors">
            <Settings size={18} />
            <span className="font-medium text-sm">Tetapan</span>
          </button>
        </div>
      </div>

      {/* MAIN CONTENT HEADER & DYNAMIC CONTENT */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="h-20 border-b border-[#2b1416] flex items-center justify-between px-8 bg-[#090505]/80 backdrop-blur-md sticky top-0 z-10">
          <div className="relative w-64">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#a38c8e]" />
            <input type="text" placeholder="Cari simbol saham..." className="w-full bg-[#170b0c] border border-[#2b1416] rounded-full py-2 pl-10 pr-4 text-sm text-white placeholder-[#a38c8e] focus:outline-none focus:border-[#ff2a44] transition-colors" />
          </div>
          
          <div className="flex items-center gap-6">
            <button className="bg-gradient-to-r from-[#ff2a44] to-[#cc1f33] hover:from-[#ff1533] hover:to-[#b3192b] text-white px-5 py-2.5 rounded-lg text-sm font-bold flex items-center gap-2 transition-all shadow-[0_0_15px_rgba(255,42,68,0.3)] hover:shadow-[0_0_25px_rgba(255,42,68,0.5)] transform hover:-translate-y-0.5">
              <Plus size={18} /> Trade Baru
            </button>
            <div className="w-px h-6 bg-[#2b1416]"></div>
            <button className="relative text-[#a38c8e] hover:text-white transition-colors">
              <Bell size={20} />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-[#ff2a44] rounded-full shadow-[0_0_5px_#ff2a44]"></span>
            </button>
            <div className="flex items-center gap-3 cursor-pointer group">
              <div className="w-9 h-9 rounded-full bg-[#2b1416] border border-[#ff2a44] flex items-center justify-center text-sm font-bold group-hover:bg-[#ff2a44] group-hover:text-white transition-colors">AZ</div>
              <div className="hidden md:block">
                <p className="text-sm font-semibold">Aiman Zulkifli</p>
                <p className="text-[10px] text-[#a38c8e]">Trader Profesional</p>
              </div>
              <ChevronDown size={14} className="text-[#a38c8e]" />
            </div>
          </div>
        </header>

        {/* Dynamic Main Section */}
        <main className="flex-1 overflow-y-auto p-8 scrollbar-hide">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}
