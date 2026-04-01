'use client';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowTrendUp, faArrowTrendDown } from '@fortawesome/free-solid-svg-icons';

const monthlyData = [
  { month: 'Jun', sales: 145000, orders: 82 },
  { month: 'Jul', sales: 189000, orders: 105 },
  { month: 'Aug', sales: 162000, orders: 91 },
  { month: 'Sep', sales: 201000, orders: 118 },
  { month: 'Oct', sales: 178000, orders: 98 },
  { month: 'Nov', sales: 245890, orders: 142 },
];

const maxSales = Math.max(...monthlyData.map(d => d.sales));

const categoryRevenue = [
  { name: 'Garments', value: 45, color: 'from-pink-500 to-rose-400', amount: 110650 },
  { name: 'Toys', value: 30, color: 'from-amber-400 to-yellow-300', amount: 73767 },
  { name: 'New Born', value: 15, color: 'from-blue-400 to-cyan-400', amount: 36884 },
  { name: 'Stationery', value: 10, color: 'from-purple-500 to-violet-400', amount: 24589 },
];

const kpis = [
  { label: 'Total Revenue (Nov)', value: 'Rs. 2,45,890', change: '+18.2%', up: true },
  { label: 'Average Order Value', value: 'Rs. 1,731', change: '+5.4%', up: true },
  { label: 'Conversion Rate', value: '3.8%', change: '-0.2%', up: false },
  { label: 'Return Rate', value: '2.1%', change: '-1.3%', up: true },
];

export default function AdminAnalyticsPage() {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4 flex items-center gap-3">
        <Link href="/admin" className="p-2 rounded-xl hover:bg-gray-100 text-gray-500">
          <FontAwesomeIcon icon={faArrowLeft} className="w-5 h-5" />
        </Link>
        <h1 className="font-display text-2xl text-gray-800">Analytics</h1>
        <span className="text-gray-400 text-sm font-semibold">Last 6 months</span>
      </div>

      <div className="p-4 sm:p-6 space-y-6">
        {/* KPI Cards */}
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
          {kpis.map((kpi, i) => (
            <div key={i} className="bg-white rounded-2xl p-4 sm:p-5 shadow-soft">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">{kpi.label}</p>
              <p className="font-display text-xl sm:text-2xl text-gray-800 mb-1">{kpi.value}</p>
              <div className={`flex items-center gap-1 text-xs font-bold ${kpi.up ? 'text-green-600' : 'text-red-500'}`}>
                <FontAwesomeIcon icon={kpi.up ? faArrowTrendUp : faArrowTrendDown} className="w-3 h-3" />
                {kpi.change} vs last month
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-5 sm:gap-6">
          {/* Revenue Chart */}
          <div className="xl:col-span-2 bg-white rounded-2xl p-5 sm:p-6 shadow-soft">
            <h2 className="font-display text-xl text-gray-800 mb-6">Monthly Revenue</h2>
            <div className="flex items-end gap-2 sm:gap-3 h-48">
              {monthlyData.map((d, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-2">
                  <p className="text-[10px] sm:text-xs font-bold text-gray-600">
                    {d.sales >= 100000 ? `${(d.sales / 1000).toFixed(0)}K` : d.sales}
                  </p>
                  <div className="w-full flex items-end justify-center" style={{ height: '140px' }}>
                    <div
                      className="w-full rounded-t-xl bg-gradient-to-t from-purple-600 to-pink-500 relative group cursor-pointer transition-all hover:opacity-90"
                      style={{ height: `${(d.sales / maxSales) * 100}%` }}>
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs font-bold px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        {d.orders} orders
                      </div>
                    </div>
                  </div>
                  <p className="text-[10px] sm:text-xs font-bold text-gray-500">{d.month}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Category Breakdown */}
          <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-soft">
            <h2 className="font-display text-xl text-gray-800 mb-6">Revenue by Category</h2>
            <div className="space-y-4">
              {categoryRevenue.map((cat, i) => (
                <div key={i}>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-bold text-gray-700">{cat.name}</span>
                    <span className="text-sm font-bold text-gray-500">{cat.value}%</span>
                  </div>
                  <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className={`h-full bg-gradient-to-r ${cat.color} rounded-full transition-all duration-700`}
                      style={{ width: `${cat.value}%` }} />
                  </div>
                  <p className="text-xs text-gray-400 font-semibold mt-1">Rs. {cat.amount.toLocaleString()}</p>
                </div>
              ))}
            </div>
            <div className="mt-6 p-4 bg-gray-50 rounded-2xl text-center">
              <p className="font-display text-2xl sm:text-3xl text-purple-600">Rs. 2.45L</p>
              <p className="text-xs text-gray-400 font-bold mt-1">Total Nov Revenue</p>
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
          {[
            { emoji: '📦', label: 'Orders This Week', value: '47', sub: '+12 vs last week', color: 'bg-purple-50' },
            { emoji: '👥', label: 'New Customers', value: '89', sub: '+23% this month', color: 'bg-green-50' },
            { emoji: '⭐', label: 'Customer Rating', value: '4.8', sub: 'Across 1,234 reviews', color: 'bg-amber-50' },
          ].map((s, i) => (
            <div key={i} className="bg-white rounded-2xl p-4 sm:p-5 shadow-soft">
              <h3 className="font-display text-lg text-gray-800 mb-3">{s.label}</h3>
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-2xl ${s.color} flex items-center justify-center text-2xl`}>{s.emoji}</div>
                <div>
                  <p className="font-display text-2xl sm:text-3xl text-purple-600">{s.value}</p>
                  <p className="text-xs text-gray-400 font-semibold">{s.sub}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
