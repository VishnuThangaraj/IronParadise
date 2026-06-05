import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { 
  LuUsers, 
  LuDumbbell, 
  LuCalendarCheck, 
  LuMessageSquare,
  LuTrendingUp,
  LuArrowRight,
  LuDollarSign,
  LuActivity,
  LuUserPlus
} from "react-icons/lu";
import { FiPieChart } from "react-icons/fi";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from "recharts";
import dayjs from "dayjs";

import useDashboard from "../hooks/useDashboard";

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

const AdminDashboard = () => {
  const { metrics, isLoading } = useDashboard();

  if (isLoading || !metrics) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-[400px]">
        <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-slate-500 text-sm font-semibold animate-pulse">Loading dashboard insights...</p>
      </div>
    );
  }

  const { summary, weeklyTrend, demographics, memberStatusDist, memberGenderDist, recentMembers } = metrics;

  const COLORS = ["#4f46e5", "#10b981"]; // Indigo, Emerald
  const STATUS_COLORS = ["#10b981", "#ef4444"]; // Emerald for Active, Red for Inactive
  const GENDER_COLORS = ["#3b82f6", "#ec4899", "#8b5cf6"]; // Blue, Pink, Purple

  // Format currency
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(value || 0);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12 font-montserrat">
      
      {/* Header */}
      <motion.div {...fadeUp} className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold bg-linear-to-r from-slate-800 to-indigo-900 bg-clip-text text-transparent">
          Dashboard Overview
        </h1>
        <p className="text-sm font-medium text-slate-500">
          Welcome back. Here is what's happening at IronParadise today.
        </p>
      </motion.div>

      {/* KPI Cards Row */}
      <motion.div 
        {...fadeUp} 
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4"
      >
        {/* Revenue */}
        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-5 rounded-3xl shadow-md text-white flex flex-col justify-between hover:shadow-lg transition-all transform hover:-translate-y-1">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-xs">
              <LuDollarSign className="w-5 h-5 text-white" />
            </div>
            <span className="text-xs font-bold bg-white/20 px-2 py-1 rounded-full">This Month</span>
          </div>
          <div>
            <p className="text-3xl font-black">{formatCurrency(summary.revenueThisMonth)}</p>
            <p className="text-xs font-medium text-indigo-100 uppercase tracking-wider mt-1">Total Revenue</p>
          </div>
        </div>

        {/* Total Members */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 mb-4">
            <LuUsers className="w-5 h-5" />
          </div>
          <div>
            <p className="text-2xl font-black text-slate-800">{summary.totalMembers}</p>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-1">Total Members</p>
          </div>
        </div>

        {/* Active Trainers */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 mb-4">
            <LuDumbbell className="w-5 h-5" />
          </div>
          <div>
            <p className="text-2xl font-black text-slate-800">{summary.totalTrainers}</p>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-1">Active Trainers</p>
          </div>
        </div>

        {/* Today's Checkins */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 mb-4">
            <LuCalendarCheck className="w-5 h-5" />
          </div>
          <div>
            <p className="text-2xl font-black text-slate-800">{summary.todayCheckins}</p>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-1">Check-ins Today</p>
          </div>
        </div>

        {/* Pending Enquiries */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow relative overflow-hidden">
          {summary.pendingEnquiries > 0 && (
            <div className="absolute top-0 right-0 w-1.5 h-full bg-amber-500"></div>
          )}
          <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600 mb-4">
            <LuMessageSquare className="w-5 h-5" />
          </div>
          <div>
            <p className="text-2xl font-black text-slate-800">{summary.pendingEnquiries}</p>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-1">Pending Enquiries</p>
          </div>
        </div>
      </motion.div>

      {/* Charts Row 1 */}
      <motion.div 
        {...fadeUp} 
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
      >
        {/* Bar Chart - Weekly Attendance */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm lg:col-span-2 flex flex-col gap-6 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-50 rounded-lg">
              <LuTrendingUp className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-800">Weekly Attendance Trends</h2>
              <p className="text-xs text-slate-500">Check-ins over the last 7 days</p>
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#64748b', fontSize: 12, fontWeight: 600 }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#64748b', fontSize: 12, fontWeight: 600 }}
                  allowDecimals={false}
                />
                <Tooltip 
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar 
                  dataKey="checkins" 
                  fill="#4f46e5" 
                  radius={[6, 6, 0, 0]}
                  barSize={40}
                  animationDuration={1500}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart - Demographics */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col gap-6 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-50 rounded-lg">
              <LuUsers className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-800">User Types</h2>
              <p className="text-xs text-slate-500">Members vs Trainers</p>
            </div>
          </div>
          <div className="h-[300px] w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={demographics}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                  animationDuration={1500}
                >
                  {demographics?.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Legend 
                  verticalAlign="bottom" 
                  height={36}
                  iconType="circle"
                  formatter={(value) => <span className="text-sm font-bold text-slate-600">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </motion.div>

      {/* Additional Charts Row */}
      <motion.div 
        {...fadeUp} 
        transition={{ delay: 0.3 }}
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
      >
        {/* Status Pie Chart */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col gap-6 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-rose-50 rounded-lg">
              <LuActivity className="w-5 h-5 text-rose-500" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-800">Member Status</h2>
              <p className="text-xs text-slate-500">Active vs Inactive</p>
            </div>
          </div>
          <div className="h-[250px] w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={memberStatusDist}
                  cx="50%"
                  cy="50%"
                  innerRadius={0}
                  outerRadius={90}
                  dataKey="value"
                  stroke="none"
                  animationDuration={1500}
                >
                  {memberStatusDist?.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={STATUS_COLORS[index % STATUS_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Legend 
                  verticalAlign="bottom" 
                  height={36}
                  iconType="circle"
                  formatter={(value) => <span className="text-sm font-bold text-slate-600">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Gender Demographics Chart */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col gap-6 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 rounded-lg">
              <FiPieChart className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-800">Gender Distribution</h2>
              <p className="text-xs text-slate-500">Members breakdown</p>
            </div>
          </div>
          <div className="h-[250px] w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={memberGenderDist}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                  animationDuration={1500}
                >
                  {memberGenderDist?.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={GENDER_COLORS[index % GENDER_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Legend 
                  verticalAlign="bottom" 
                  height={36}
                  iconType="circle"
                  formatter={(value) => <span className="text-sm font-bold text-slate-600">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Members List */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col gap-4 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-50 rounded-lg">
                <LuUserPlus className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-800">Recent Joinees</h2>
                <p className="text-xs text-slate-500">Latest 5 members</p>
              </div>
            </div>
            <Link to="/member/list" className="text-xs font-bold text-indigo-600 hover:text-indigo-800">View All</Link>
          </div>
          
          <div className="flex-1 overflow-y-auto pr-2 mt-2 space-y-3 custom-scrollbar">
            {recentMembers?.length > 0 ? (
              recentMembers.map((member) => (
                <div key={member.id} className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 hover:bg-slate-100 transition-colors border border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-sm">
                      {member.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex flex-col max-w-[120px]">
                      <span className="text-sm font-bold text-slate-800 truncate">{member.name}</span>
                      <span className="text-xs text-slate-500 truncate">{member.email}</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-xs font-semibold text-slate-600">
                      {member.joinDate ? dayjs(member.joinDate).format('MMM D, YYYY') : 'N/A'}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full mt-1 ${member.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                      {member.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center py-6">
                <LuUsers className="w-8 h-8 text-slate-300 mb-2" />
                <p className="text-sm text-slate-500 font-medium">No recent members</p>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Quick Links Row */}
      <motion.div 
        {...fadeUp} 
        transition={{ delay: 0.4 }}
        className="grid grid-cols-1 sm:grid-cols-3 gap-6"
      >
        <Link to="/attendance" className="bg-gradient-to-r from-indigo-50 to-white hover:from-indigo-100 transition-colors p-6 rounded-3xl border border-indigo-100 flex items-center justify-between group cursor-pointer shadow-sm hover:shadow-md">
          <div className="flex flex-col gap-1">
            <span className="text-sm font-bold text-indigo-900">Live Attendance</span>
            <span className="text-xs font-semibold text-indigo-600/70">View the daily calendar logs</span>
          </div>
          <div className="w-10 h-10 rounded-full bg-indigo-200/50 flex items-center justify-center text-indigo-700 group-hover:scale-110 group-hover:bg-indigo-600 group-hover:text-white transition-all">
            <LuArrowRight className="w-5 h-5" />
          </div>
        </Link>
        
        <Link to="/enquiry/list" className="bg-gradient-to-r from-amber-50 to-white hover:from-amber-100 transition-colors p-6 rounded-3xl border border-amber-100 flex items-center justify-between group cursor-pointer shadow-sm hover:shadow-md">
          <div className="flex flex-col gap-1">
            <span className="text-sm font-bold text-amber-900">Manage Enquiries</span>
            <span className="text-xs font-semibold text-amber-600/70">Reply to pending messages</span>
          </div>
          <div className="w-10 h-10 rounded-full bg-amber-200/50 flex items-center justify-center text-amber-700 group-hover:scale-110 group-hover:bg-amber-500 group-hover:text-white transition-all">
            <LuArrowRight className="w-5 h-5" />
          </div>
        </Link>

        <Link to="/attendance-log" className="bg-gradient-to-r from-slate-900 to-slate-800 hover:from-slate-800 hover:to-slate-700 transition-colors p-6 rounded-3xl border border-slate-700 flex items-center justify-between group cursor-pointer shadow-sm hover:shadow-md">
          <div className="flex flex-col gap-1">
            <span className="text-sm font-bold text-white">Open Kiosk</span>
            <span className="text-xs font-semibold text-slate-300">Launch public check-in mode</span>
          </div>
          <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-white group-hover:scale-110 group-hover:bg-slate-600 transition-all">
            <LuArrowRight className="w-5 h-5" />
          </div>
        </Link>
      </motion.div>

    </div>
  );
};

export default AdminDashboard;
