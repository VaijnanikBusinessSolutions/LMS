import React, { useEffect, useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import {
  Users, BookOpen, PlayCircle, Calendar as CalendarIcon,
  Download, RefreshCw, ArrowUpRight, ChevronLeft, ChevronRight,
  FileText, FileSpreadsheet, ChevronDown, Activity, MoreHorizontal,
  TrendingUp, Sparkles
} from 'lucide-react';
import {
  AreaChart, Area, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid
} from 'recharts';
import {
  formatDistanceToNow, format, startOfMonth, endOfMonth,
  startOfWeek, endOfWeek, eachDayOfInterval, subMonths, addMonths,
  isSameMonth, isSameDay, subDays, eachMonthOfInterval
} from 'date-fns';
import type { RootState } from '../../store/store';

type TimeRange = '15D' | '1M' | '3M' | '6M';

interface DashboardStats {
  total_users: number;
  total_courses: number;
  total_lesson_videos: number;
}

interface AnalyticsResponse {
  user_growth_monthly: { label: string; users: number; fullLabel: string }[];
  calendar_data: Record<string, number>;
  course_stats: { name: string; value: number; color: string }[];
  recent_activity: { id: number; text: string; time: string; type: string }[];
  system_overview: { day: string; value: number }[];
}

const generateChartData = (range: TimeRange) => {
  const now = new Date(2026, 1, 10);
  let dates: Date[] = [];
  let dateFormat = 'd MMM yy';

  if (range === '6M') {
    const start = subMonths(now, 5);
    dates = eachMonthOfInterval({ start, end: now });
    dateFormat = 'MMM yyyy';
  } else {
    let start;
    if (range === '3M') start = subMonths(now, 3);
    else if (range === '1M') start = subMonths(now, 1);
    else start = subDays(now, 14);
    dates = eachDayOfInterval({ start, end: now });
    dateFormat = 'd MMM yy';
  }

  return dates.map((date) => {
    let value = 60;
    const volatility = Math.floor(Math.random() * 60) - 30;
    value += volatility;
    if (range !== '6M') {
      const day = date.getDay();
      if (day === 0 || day === 6) value = value * 0.6;
    }
    value = Math.max(10, Math.floor(value));
    if (Math.random() > 0.9) value += 40;
    return {
      label: format(date, dateFormat),
      users: value,
      fullLabel: format(date, 'dd MMMM yyyy')
    };
  });
};

const DUMMY_STATS: DashboardStats = {
  total_users: 86,
  total_courses: 42,
  total_lesson_videos: 10
};

const AdminDashboard = () => {
  const { accessToken: token, user } = useSelector((state: RootState) => state.auth);

  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [analytics, setAnalytics] = useState<AnalyticsResponse | null>(null);
  const [timeRange, setTimeRange] = useState<TimeRange>('1M');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [exportingType, setExportingType] = useState<'csv' | 'pdf' | null>(null);
  const exportMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (exportMenuRef.current && !exportMenuRef.current.contains(event.target as Node)) {
        setShowExportMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 500));
      const chartData = generateChartData(timeRange);
      const simulationDate = new Date(2026, 1, 10);

      setStats(DUMMY_STATS);
      setAnalytics({
        user_growth_monthly: chartData,
        calendar_data: {
          [format(simulationDate, 'yyyy-MM-dd')]: 4,
          [format(subDays(simulationDate, 1), 'yyyy-MM-dd')]: 2,
          [format(subDays(simulationDate, 2), 'yyyy-MM-dd')]: 7,
          [format(subDays(simulationDate, 5), 'yyyy-MM-dd')]: 3,
          [format(subDays(simulationDate, 8), 'yyyy-MM-dd')]: 5,
        },
        course_stats: [
          { name: 'Enrolled Users', value: 56, color: '#a78bfa' },
          { name: 'Total Registered', value: 86, color: '#67e8f9' },
        ],
        recent_activity: [
          { id: 1, text: "Sarah Jenkins enrolled in 'React Pro'", time: simulationDate.toISOString(), type: 'enrollment' },
          { id: 2, text: "Course 'UI Basics' published", time: subDays(simulationDate, 1).toISOString(), type: 'course' },
          { id: 3, text: "New user 'Alex M.' registered", time: subDays(simulationDate, 2).toISOString(), type: 'registration' },
          { id: 4, text: "Video lesson 'Hooks Deep Dive' uploaded", time: subDays(simulationDate, 3).toISOString(), type: 'content' },
        ],
        system_overview: [
          { day: 'Mon', value: 12 }, { day: 'Tue', value: 15 }, { day: 'Wed', value: 8 },
          { day: 'Thu', value: 22 }, { day: 'Fri', value: 14 }, { day: 'Sat', value: 5 }, { day: 'Sun', value: 9 },
        ]
      });
      setError(null);
    } catch {
      setError('Failed to load dashboard data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [token, timeRange]);

  const handleDownload = async (type: 'csv' | 'pdf') => {
    setExportingType(type);
    setShowExportMenu(false);
    await new Promise(resolve => setTimeout(resolve, 1000));
    alert(`Report exported as ${type.toUpperCase()}`);
    setExportingType(null);
  };

  if (loading && !analytics) return <LoadingSkeleton />;
  if (error) return <ErrorDisplay error={error} retry={fetchDashboardData} />;

  return (
    <div className="min-h-screen p-4 md:p-6 lg:p-10 transition-colors duration-500"
      style={{ backgroundColor: 'rgb(var(--bg-main))', color: 'rgb(var(--text-main))' }}>
      <div className="max-w-[1920px] mx-auto space-y-8">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-500 via-fuchsia-500 to-cyan-400">
                Welcome back, {user?.name || 'Admin'}
              </h1>
              <Sparkles size={24} className="text-amber-400 animate-pulse" />
            </div>
            <p className="mt-1.5 text-sm opacity-50 font-medium">Platform performance overview · 2026</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={fetchDashboardData}
              className="p-2.5 rounded-xl border backdrop-blur-xl transition-all duration-300 hover:scale-105"
              style={{
                backgroundColor: 'rgba(var(--bg-card), 0.6)',
                borderColor: 'rgba(var(--border-main), 0.5)',
              }}
            >
              <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
            </button>

            <div className="relative" ref={exportMenuRef}>
              <button
                onClick={() => setShowExportMenu(!showExportMenu)}
                className="flex items-center gap-2 px-5 py-2.5 text-white rounded-xl shadow-lg transition-all duration-300 hover:scale-[1.03] hover:shadow-xl"
                style={{ background: 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 50%, #06b6d4 100%)' }}
              >
                <Download size={18} />
                <span className="font-semibold text-sm">Export</span>
                <ChevronDown size={14} className={`transition-transform duration-200 ${showExportMenu ? 'rotate-180' : ''}`} />
              </button>
              {showExportMenu && (
                <div className="absolute right-0 mt-2 w-52 rounded-2xl shadow-2xl border z-50 overflow-hidden backdrop-blur-2xl"
                  style={{ backgroundColor: 'rgba(var(--bg-card), 0.95)', borderColor: 'rgba(var(--border-main), 0.5)' }}>
                  <button onClick={() => handleDownload('csv')}
                    className="w-full text-left px-4 py-3.5 text-sm flex items-center gap-3 transition-all duration-200 hover:pl-6 hover:bg-emerald-500/10"
                    style={{ color: 'rgb(var(--text-main))' }}>
                    <FileSpreadsheet size={16} className="text-emerald-400" />
                    <span className="font-medium">Excel (CSV)</span>
                  </button>
                  <div className="h-px mx-4" style={{ backgroundColor: 'rgb(var(--border-main))' }} />
                  <button onClick={() => handleDownload('pdf')}
                    className="w-full text-left px-4 py-3.5 text-sm flex items-center gap-3 transition-all duration-200 hover:pl-6 hover:bg-rose-500/10"
                    style={{ color: 'rgb(var(--text-main))' }}>
                    <FileText size={16} className="text-rose-400" />
                    <span className="font-medium">PDF Report</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ========== BOLD COLOR STAT CARDS ========== */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <BoldStatCard
            title="Total Users"
            value={stats?.total_users || 0}
            icon={Users}
            trend="+12%"
            bgGradient="linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)"
            shadowColor="rgba(59, 130, 246, 0.4)"
            iconBg="rgba(255,255,255,0.2)"
          />
          <BoldStatCard
            title="Total Courses"
            value={stats?.total_courses || 0}
            icon={BookOpen}
            trend="+5%"
            bgGradient="linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)"
            shadowColor="rgba(20, 184, 166, 0.4)"
            iconBg="rgba(255,255,255,0.2)"
          />
          <BoldStatCard
            title="Video Lessons"
            value={stats?.total_lesson_videos || 0}
            icon={PlayCircle}
            trend="+24%"
            bgGradient="linear-gradient(135deg, #f59e0b 0%, #d97706 100%)"
            shadowColor="rgba(245, 158, 11, 0.4)"
            iconBg="rgba(255,255,255,0.2)"
          />
        </div>

        {/* Row 1: Area Chart & Pie Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* User Volume Chart */}
          <div className="lg:col-span-2 p-6 rounded-2xl shadow-sm border backdrop-blur-xl relative overflow-hidden"
            style={{ backgroundColor: 'rgba(var(--bg-card), 0.7)', borderColor: 'rgba(var(--border-main), 0.5)' }}>
            <div className="absolute -top-20 -right-20 w-60 h-60 rounded-full opacity-[0.05] pointer-events-none"
              style={{ background: 'radial-gradient(circle, #3b82f6, transparent)' }} />

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4 relative z-10">
              <div>
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <TrendingUp size={18} className="text-blue-400" />
                  User Login Activity
                </h3>
                <p className="text-xs opacity-40 font-medium mt-1">Growth over time</p>
              </div>
              <div className="flex p-1 rounded-xl border backdrop-blur-sm"
                style={{ backgroundColor: 'rgba(var(--bg-main), 0.6)', borderColor: 'rgba(var(--border-main), 0.4)' }}>
                {(['15D', '1M', '3M', '6M'] as TimeRange[]).map((range) => (
                  <button
                    key={range}
                    onClick={() => setTimeRange(range)}
                    className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all duration-300 whitespace-nowrap`}
                    style={timeRange === range
                      ? { background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)', color: '#fff' }
                      : { color: 'rgb(var(--text-muted))' }
                    }
                  >
                    {range}
                  </button>
                ))}
              </div>
            </div>

            <div className={`h-80 w-full transition-opacity duration-500 ${loading ? 'opacity-40' : 'opacity-100'}`}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={analytics?.user_growth_monthly || []}>
                  <defs>
                    <linearGradient id="colorUsersBlue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.35} />
                      <stop offset="50%" stopColor="#3b82f6" stopOpacity={0.12} />
                      <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.02} />
                    </linearGradient>
                    <linearGradient id="lineGradientBlue" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#3b82f6" />
                      <stop offset="100%" stopColor="#06b6d4" />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgb(var(--border-main))" opacity={0.3} />
                  <XAxis dataKey="label" axisLine={false} tickLine={false}
                    tick={{ fill: 'rgb(var(--text-muted))', fontSize: 10, fontWeight: 500 }}
                    interval={timeRange === '15D' ? 1 : 'preserveStartEnd'} minTickGap={25} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: 'rgb(var(--text-muted))', fontSize: 11 }} width={35} />
                  <Tooltip content={<CustomGraphTooltip />} cursor={{ stroke: '#3b82f6', strokeWidth: 1, strokeDasharray: '4 4' }} />
                  <Area type="monotone" dataKey="users" stroke="url(#lineGradientBlue)" strokeWidth={2.5}
                    fill="url(#colorUsersBlue)" animationDuration={1500} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Pie Chart */}
          <div className="p-6 rounded-2xl shadow-sm border backdrop-blur-xl flex flex-col relative overflow-hidden"
            style={{ backgroundColor: 'rgba(var(--bg-card), 0.7)', borderColor: 'rgba(var(--border-main), 0.5)' }}>
            <div className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full opacity-[0.06] pointer-events-none"
              style={{ background: 'radial-gradient(circle, #14b8a6, transparent)' }} />

            <div className="flex items-center justify-between mb-2 relative z-10">
              <div>
                <h3 className="text-lg font-bold">User Metrics</h3>
                <p className="text-xs opacity-40 font-medium">Registration Status</p>
              </div>
              <MoreHorizontal size={20} className="opacity-30" />
            </div>

            <div className="h-[220px] w-full relative my-4">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={analytics?.course_stats || []} cx="50%" cy="50%"
                    innerRadius={60} outerRadius={82} paddingAngle={4} dataKey="value"
                    stroke="none" animationDuration={1200}>
                    {(analytics?.course_stats || []).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{
                    backgroundColor: 'rgba(var(--bg-card), 0.95)', borderColor: 'rgba(var(--border-main), 0.5)',
                    borderRadius: '12px', backdropFilter: 'blur(12px)', boxShadow: '0 20px 40px -12px rgba(0, 0, 0, 0.25)'
                  }} itemStyle={{ color: 'rgb(var(--text-main))', fontWeight: 'bold' }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-3xl font-bold" style={{ color: 'rgb(var(--text-main))' }}>{stats?.total_courses}</span>
                <span className="text-[10px] uppercase opacity-40 font-bold tracking-widest text-center leading-tight">Total<br />Courses</span>
              </div>
            </div>

            <div className="space-y-3 mt-auto relative z-10">
              {(analytics?.course_stats || []).map((item, index) => (
                <div key={index} className="flex items-center justify-between text-sm group cursor-default">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full transition-all duration-300 group-hover:scale-150"
                      style={{ backgroundColor: item.color, boxShadow: `0 0 12px ${item.color}50` }} />
                    <span className="opacity-60 font-medium text-sm">{item.name}</span>
                  </div>
                  <span className="font-bold text-sm">{item.value.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Row 2: Calendar, Enrollments, Activity */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

          {/* Calendar */}
          <div className="p-6 rounded-2xl shadow-sm border backdrop-blur-xl relative overflow-hidden"
            style={{ backgroundColor: 'rgba(var(--bg-card), 0.7)', borderColor: 'rgba(var(--border-main), 0.5)' }}>
            <div className="absolute -top-10 -left-10 w-40 h-40 rounded-full opacity-[0.06] pointer-events-none"
              style={{ background: 'radial-gradient(circle, #f59e0b, transparent)' }} />
            <CalendarWidget data={analytics?.calendar_data || {}} />
          </div>

          {/* Enrollments Bar Chart */}
          <div className="p-6 rounded-2xl shadow-sm border backdrop-blur-xl flex flex-col h-full overflow-hidden relative"
            style={{ backgroundColor: 'rgba(var(--bg-card), 0.7)', borderColor: 'rgba(var(--border-main), 0.5)' }}>
            <div className="absolute -bottom-10 -right-10 w-40 h-40 rounded-full opacity-[0.06] pointer-events-none"
              style={{ background: 'radial-gradient(circle, #14b8a6, transparent)' }} />

            <div className="flex items-center justify-between mb-6 relative z-10">
              <div>
                <h3 className="text-lg font-bold">Enrollments</h3>
                <p className="text-xs opacity-40 font-medium mt-0.5">Activity (Last 7 Days)</p>
              </div>
              <div className="p-2.5 rounded-xl" style={{ background: 'linear-gradient(135deg, rgba(20,184,166,0.15), rgba(6,182,212,0.1))' }}>
                <CalendarIcon size={18} className="text-teal-400" />
              </div>
            </div>
            <div className="flex-1 w-full mt-auto relative" style={{ minHeight: '250px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analytics?.system_overview || []} margin={{ top: 0, right: 5, left: -25, bottom: 0 }}>
                  <defs>
                    <linearGradient id="barGradientTeal" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#14b8a6" stopOpacity={0.9} />
                      <stop offset="100%" stopColor="#0d9488" stopOpacity={0.6} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgb(var(--border-main))" opacity={0.3} />
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: 'rgb(var(--text-muted))', fontSize: 11 }} interval={0} height={40} dy={15} />
                  <YAxis axisLine={false} tickLine={false} hide />
                  <Tooltip cursor={{ fill: 'rgba(20, 184, 166, 0.06)' }}
                    contentStyle={{ borderRadius: '12px', border: 'none', backdropFilter: 'blur(12px)',
                      backgroundColor: 'rgba(var(--bg-card), 0.95)', boxShadow: '0 20px 40px -12px rgba(0,0,0,0.25)' }} />
                  <Bar dataKey="value" fill="url(#barGradientTeal)" radius={[8, 8, 0, 0]} barSize={32} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Live Activity */}
          <div className="p-6 rounded-2xl shadow-sm border backdrop-blur-xl relative overflow-hidden"
            style={{ backgroundColor: 'rgba(var(--bg-card), 0.7)', borderColor: 'rgba(var(--border-main), 0.5)' }}>
            <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full opacity-[0.06] pointer-events-none"
              style={{ background: 'radial-gradient(circle, #ec4899, transparent)' }} />

            <h3 className="text-lg font-bold mb-6 flex items-center gap-2 relative z-10">
              <div className="relative">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping absolute" />
                <div className="w-2 h-2 rounded-full bg-emerald-400" />
              </div>
              Live Activity
            </h3>
            <div className="space-y-5 relative ml-2">
              <div className="absolute left-0 top-1 bottom-0 w-0.5 rounded-full"
                style={{ background: 'linear-gradient(to bottom, #3b82f6, #14b8a6, #f59e0b, transparent)' }} />

              {(analytics?.recent_activity || []).map((item, index) => {
                const dotColors = ['#3b82f6', '#14b8a6', '#f59e0b', '#ec4899'];
                const bgColors = ['rgba(59,130,246,0.1)', 'rgba(20,184,166,0.1)', 'rgba(245,158,11,0.1)', 'rgba(236,72,153,0.1)'];
                const color = dotColors[index % dotColors.length];
                const bg = bgColors[index % bgColors.length];

                return (
                  <div key={item.id} className="relative pl-7 flex flex-col group">
                    <div className="absolute -left-[5px] top-1.5 w-[10px] h-[10px] rounded-full border-2 transition-all duration-300 group-hover:scale-150"
                      style={{ borderColor: 'rgb(var(--bg-card))', backgroundColor: color, boxShadow: `0 0 10px ${color}60` }} />
                    <div className="p-3 rounded-xl transition-all duration-300 group-hover:translate-x-1"
                      style={{ backgroundColor: bg }}>
                      <p className="text-sm font-medium leading-snug">{item.text}</p>
                      <p className="text-[11px] opacity-40 mt-1.5 font-medium">
                        {formatDistanceToNow(new Date(item.time), { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ========== BOLD FULL-COLOR STAT CARD ==========
const BoldStatCard = ({
  title, value, icon: Icon, trend, bgGradient, shadowColor, iconBg
}: {
  title: string; value: number; icon: any; trend: string;
  bgGradient: string; shadowColor: string; iconBg: string;
}) => (
  <div
    className="group relative p-6 rounded-2xl overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl cursor-default"
    style={{
      background: bgGradient,
      boxShadow: `0 10px 30px -8px ${shadowColor}`,
      color: '#fff',
    }}
  >
    {/* Decorative circles */}
    <div className="absolute -top-6 -right-6 w-28 h-28 rounded-full opacity-20 pointer-events-none transition-transform duration-700 group-hover:scale-125"
      style={{ backgroundColor: 'rgba(255,255,255,0.15)' }} />
    <div className="absolute -bottom-4 -right-4 w-20 h-20 rounded-full opacity-10 pointer-events-none transition-transform duration-700 group-hover:scale-150"
      style={{ backgroundColor: 'rgba(255,255,255,0.2)' }} />
    <div className="absolute top-1/2 left-1/3 w-40 h-40 rounded-full opacity-[0.06] pointer-events-none blur-2xl"
      style={{ backgroundColor: '#fff' }} />

    {/* Content */}
    <div className="relative z-10 flex justify-between items-start">
      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-white/70">{title}</p>
        <h3 className="text-4xl font-extrabold mt-3 tracking-tight drop-shadow-sm">{value.toLocaleString()}</h3>
      </div>
      <div className="p-3.5 rounded-xl transition-all duration-500 group-hover:scale-110 group-hover:rotate-6"
        style={{ backgroundColor: iconBg, backdropFilter: 'blur(8px)' }}>
        <Icon size={26} className="text-white drop-shadow-sm" />
      </div>
    </div>

    {/* Trend badge */}
    <div className="mt-5 flex items-center gap-2 relative z-10">
      <div className="flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-lg"
        style={{ backgroundColor: 'rgba(255,255,255,0.2)', color: '#fff', backdropFilter: 'blur(4px)' }}>
        <ArrowUpRight size={13} />
        {trend}
      </div>
      <span className="text-xs text-white/50 font-medium">vs last period</span>
    </div>

    {/* Shine effect on hover */}
    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
      style={{
        background: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.12) 45%, rgba(255,255,255,0.06) 50%, transparent 55%)',
      }} />
  </div>
);

// ========== CALENDAR WIDGET ==========
const CalendarWidget = ({ data }: { data: Record<string, number> }) => {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 1, 10));

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);
  const calendarDays = eachDayOfInterval({ start: startDate, end: endDate });

  return (
    <div className="h-full flex flex-col relative z-10">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold flex items-center gap-2">
          <CalendarIcon size={18} className="text-amber-400" />
          Registration Calendar
        </h3>
        <div className="flex gap-0.5 items-center p-1 rounded-xl border backdrop-blur-sm"
          style={{ backgroundColor: 'rgba(var(--bg-main), 0.6)', borderColor: 'rgba(var(--border-main), 0.4)' }}>
          <button onClick={() => setCurrentDate(subMonths(currentDate, 1))}
            className="p-1.5 rounded-lg transition-colors duration-200 hover:bg-white/10">
            <ChevronLeft size={14} />
          </button>
          <span className="text-xs font-bold px-2 min-w-[80px] text-center">{format(currentDate, 'MMM yyyy')}</span>
          <button onClick={() => setCurrentDate(addMonths(currentDate, 1))}
            className="p-1.5 rounded-lg transition-colors duration-200 hover:bg-white/10">
            <ChevronRight size={14} />
          </button>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-2 text-center text-[10px] font-bold opacity-30 mb-3 tracking-wider">
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => <div key={i}>{d}</div>)}
      </div>
      <div className="grid grid-cols-7 gap-1.5 flex-1">
        {calendarDays.map((day, idx) => {
          const dateKey = format(day, 'yyyy-MM-dd');
          const count = data[dateKey] || 0;
          const isCurrentMonth = isSameMonth(day, monthStart);
          const isToday = isSameDay(day, new Date(2026, 1, 10));

          let cellBg = 'rgba(var(--bg-main), 0.6)';
          let cellColor = 'inherit';
          let cellShadow = 'none';

          if (count > 0 && count <= 2) {
            cellBg = 'rgba(59, 130, 246, 0.25)';
            cellColor = '#93c5fd';
          } else if (count > 2 && count <= 5) {
            cellBg = 'rgba(59, 130, 246, 0.5)';
            cellColor = '#fff';
          } else if (count > 5) {
            cellBg = 'linear-gradient(135deg, #3b82f6, #1d4ed8)';
            cellColor = '#fff';
            cellShadow = '0 4px 12px rgba(59, 130, 246, 0.4)';
          }

          return (
            <div key={idx}
              className={`relative aspect-square rounded-lg flex items-center justify-center text-[11px] font-medium transition-all duration-300 group
                ${isCurrentMonth ? 'opacity-100' : 'opacity-15'}
                ${isCurrentMonth ? 'hover:scale-110 hover:shadow-lg cursor-default' : ''}
              `}
              style={{
                background: cellBg,
                color: cellColor,
                boxShadow: isToday ? '0 0 0 2px #3b82f6, 0 0 12px rgba(59,130,246,0.3)' : cellShadow,
              }}
            >
              {format(day, 'd')}
              {isCurrentMonth && (
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-50 whitespace-nowrap text-[10px] px-3 py-1.5 rounded-lg text-white shadow-xl pointer-events-none font-medium"
                  style={{ background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)' }}>
                  {format(day, 'MMM d')}: {count} Users
                  <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-blue-500" />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ========== CUSTOM TOOLTIP ==========
const CustomGraphTooltip = ({ active, payload }: any) => {
  if (active && payload?.length) {
    return (
      <div className="p-3.5 rounded-xl shadow-2xl border backdrop-blur-xl"
        style={{ backgroundColor: 'rgba(var(--bg-card), 0.95)', borderColor: 'rgba(var(--border-main), 0.5)' }}>
        <p className="text-[11px] font-bold opacity-40">{payload[0].payload.fullLabel}</p>
        <p className="text-lg font-bold mt-0.5"
          style={{ background: 'linear-gradient(135deg, #3b82f6, #06b6d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          +{payload[0].value} Users
        </p>
      </div>
    );
  }
  return null;
};

// ========== LOADING SKELETON ==========
const LoadingSkeleton = () => (
  <div className="min-h-screen p-6 lg:p-10 animate-pulse" style={{ backgroundColor: 'rgb(var(--bg-main))' }}>
    <div className="max-w-[1920px] mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <div className="h-8 w-72 rounded-xl" style={{ backgroundColor: 'rgba(var(--bg-card), 0.8)' }} />
          <div className="h-4 w-48 rounded-lg mt-3" style={{ backgroundColor: 'rgba(var(--bg-card), 0.5)' }} />
        </div>
        <div className="h-10 w-32 rounded-xl" style={{ backgroundColor: 'rgba(var(--bg-card), 0.8)' }} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          'linear-gradient(135deg, #3b82f650, #1d4ed850)',
          'linear-gradient(135deg, #14b8a650, #0d948850)',
          'linear-gradient(135deg, #f59e0b50, #d9770650)',
        ].map((bg, i) => (
          <div key={i} className="h-36 rounded-2xl" style={{ background: bg }} />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 h-96 rounded-2xl" style={{ backgroundColor: 'rgba(var(--bg-card), 0.6)' }} />
        <div className="h-96 rounded-2xl" style={{ backgroundColor: 'rgba(var(--bg-card), 0.6)' }} />
      </div>
    </div>
  </div>
);

// ========== ERROR DISPLAY ==========
const ErrorDisplay = ({ error, retry }: any) => (
  <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'rgb(var(--bg-main))' }}>
    <div className="text-center p-10 rounded-3xl shadow-2xl border backdrop-blur-xl"
      style={{ backgroundColor: 'rgba(var(--bg-card), 0.8)', borderColor: 'rgba(var(--border-main), 0.5)' }}>
      <div className="w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center"
        style={{ background: 'rgba(239, 68, 68, 0.1)' }}>
        <Activity size={32} className="text-red-400" />
      </div>
      <h2 className="text-xl font-bold mb-2" style={{ color: 'rgb(var(--text-main))' }}>Failed to Load</h2>
      <p className="opacity-50 mb-6 text-sm">{error}</p>
      <button onClick={retry}
        className="px-8 py-3 text-white rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg font-semibold text-sm"
        style={{ background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)' }}>
        Retry Sync
      </button>
    </div>
  </div>
);

export default AdminDashboard;




// import React, { useEffect, useState, useRef } from 'react';
// import { useSelector } from 'react-redux';
// import axios from 'axios';
// import {
//   Users, BookOpen, PlayCircle, Calendar as CalendarIcon,
//   Download, RefreshCw, ArrowUpRight, ChevronLeft, ChevronRight,
//   FileText, FileSpreadsheet, ChevronDown, Activity, MoreHorizontal,
//   TrendingUp, Award, GraduationCap, ArrowDownRight
// } from 'lucide-react';
// import {
//   AreaChart, Area, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip,
//   ResponsiveContainer, CartesianGrid
// } from 'recharts';
// import { 
//   formatDistanceToNow, format, startOfMonth, endOfMonth, 
//   startOfWeek, endOfWeek, eachDayOfInterval, subMonths, 
//   isSameMonth, isSameDay, subDays, eachMonthOfInterval, addMonths 
// } from 'date-fns';
// import type { RootState } from '../../store/store';

// // --- API Configuration ---
// const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// // --- Types ---
// type TimeRange = '15D' | '1M' | '3M' | '6M';

// interface DashboardStats {
//   total_users: number;
//   total_courses: number;
//   total_lesson_videos: number;
// }

// interface AnalyticsResponse {
//   user_growth_monthly: { label: string; users: number; fullLabel: string }[];
//   calendar_data: Record<string, number>;
//   course_stats: { name: string; value: number; color: string }[];
//   recent_activity: { id: number; text: string; time: string; type: string }[];
//   system_overview: { day: string; value: number }[];
// }

// interface CourseReportData {
//   id: number;
//   name: string;
//   category: string;
//   instructor: string;
//   students: number;
//   completionRate: number;
//   avgScore: number;
//   rating: number;
//   status: string;
//   revenue: number;
//   duration: string;
//   createdAt: string;
//   department: string;
// }

// interface CourseReportResponse {
//   role: string;
//   summary: {
//     totalCourses: number;
//     totalEnrollments: number;
//     completionRate: number;
//     avgRating: number;
//     totalRevenue: number;
//     certificatesIssued: number;
//     activeStudents: number;
//     totalInstructors: number;
//   };
//   courses: CourseReportData[];
//   categories: { name: string; count: number }[];
// }

// const AdminDashboard = () => {
//   const { accessToken: token, user } = useSelector((state: RootState) => state.auth);

//   // State for all data
//   const [stats, setStats] = useState<DashboardStats | null>(null);
//   const [analytics, setAnalytics] = useState<AnalyticsResponse | null>(null);
//   const [courseReport, setCourseReport] = useState<CourseReportResponse | null>(null);
  
//   // UI State
//   const [timeRange, setTimeRange] = useState<TimeRange>('1M'); 
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [showExportMenu, setShowExportMenu] = useState(false);
//   const [exporting, setExporting] = useState(false);
  
//   const exportMenuRef = useRef<HTMLDivElement>(null);

//   // Close menu on outside click
//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       if (exportMenuRef.current && !exportMenuRef.current.contains(event.target as Node)) {
//         setShowExportMenu(false);
//       }
//     };
//     document.addEventListener('mousedown', handleClickOutside);
//     return () => document.removeEventListener('mousedown', handleClickOutside);
//   }, []);

//   // Fetch Data Function
//   const fetchDashboardData = async () => {
//     if (!token) return;

//     try {
//       setLoading(true);
//       setError(null);

//       // Parallel Fetching
//       const [statsRes, analyticsRes, courseRes] = await Promise.all([
//         axios.get(`${API_BASE_URL}/lms/admins/users/`, {
//           headers: { Authorization: `Bearer ${token}` }
//         }),
//         axios.get(`${API_BASE_URL}/lms/admins/users/analytics/`, {
//           headers: { Authorization: `Bearer ${token}` }
//         }),
//         axios.get(`${API_BASE_URL}/lms/api/reports/course-stats/`, {
//           headers: { Authorization: `Bearer ${token}` }
//         })
//       ]);

//       setStats(statsRes.data);
//       setAnalytics(analyticsRes.data);
//       setCourseReport(courseRes.data);

//     } catch (err: any) {
//       console.error("Dashboard fetch error:", err);
//       setError(err.response?.data?.detail || 'Failed to load dashboard data.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => { 
//     fetchDashboardData(); 
//   }, [token]); // removed timeRange dependency as backend handles fixed range currently

//   // Export Handler
//   const handleDownload = async (type: 'csv' | 'pdf') => {
//     if (!token) return;
    
//     try {
//       setExporting(true);
//       setShowExportMenu(false);

//       const endpoint = type === 'csv' 
//         ? `${API_BASE_URL}/lms/admins/users/export_csv/`
//         : `${API_BASE_URL}/lms/admins/users/export_pdf/`;

//       const response = await axios.get(endpoint, {
//         headers: { Authorization: `Bearer ${token}` },
//         responseType: 'blob'
//       });

//       // Create download link
//       const url = window.URL.createObjectURL(new Blob([response.data]));
//       const link = document.createElement('a');
//       link.href = url;
//       const dateStr = new Date().toISOString().split('T')[0];
//       link.download = `LMS_Report_${dateStr}.${type}`;
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);
//       window.URL.revokeObjectURL(url);

//     } catch (err) {
//       console.error("Export failed", err);
//       alert("Failed to export report");
//     } finally {
//       setExporting(false);
//     }
//   };

//   // Helper for trend calculation (simulated since backend doesn't send prev period yet)
//   const calculateTrend = (current: number) => {
//     return { value: '+0%', positive: true }; // Placeholder until backend supports trends
//   };

//   if (loading && !analytics) return <LoadingSkeleton />; 
//   if (error) return <ErrorDisplay error={error} retry={fetchDashboardData} />;

//   return (
//     <div className="min-h-screen p-6 lg:p-10 transition-colors duration-300" style={{ backgroundColor: 'rgb(var(--bg-main))', color: 'rgb(var(--text-main))' }}>
//       <div className="max-w-[1920px] mx-auto space-y-8">
        
//         {/* Header */}
//         <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
//           <div>
//             <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[rgb(var(--brand-primary))] to-[rgb(var(--brand-accent))]">
//               Welcome back, {user?.name || user?.first_name || 'Admin'}
//             </h1>
//             <p className="mt-1 opacity-60">
//               Platform performance overview • {format(new Date(), 'MMM d, yyyy')}
//             </p>
//           </div>
//           <div className="flex items-center gap-3">
//             <button 
//               onClick={fetchDashboardData} 
//               disabled={loading}
//               className="p-2.5 rounded-xl border border-[rgb(var(--border-main))] bg-[rgb(var(--bg-card))] hover:bg-[rgb(var(--bg-main))] transition-colors disabled:opacity-50"
//             >
//               <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
//             </button>
            
//             <div className="relative" ref={exportMenuRef}>
//               <button 
//                 onClick={() => setShowExportMenu(!showExportMenu)} 
//                 disabled={exporting}
//                 className="flex items-center gap-2 px-4 py-2.5 text-white rounded-xl shadow-lg bg-[rgb(var(--brand-primary))] transition-transform hover:scale-[1.02] disabled:opacity-50"
//               >
//                 {exporting ? <RefreshCw size={18} className="animate-spin"/> : <Download size={18} />}
//                 <span className="font-medium">Export Report</span>
//                 <ChevronDown size={16} />
//               </button>
//               {showExportMenu && (
//                 <div className="absolute right-0 mt-2 w-48 rounded-xl shadow-xl border bg-[rgb(var(--bg-card))] border-[rgb(var(--border-main))] z-50 overflow-hidden animate-in fade-in slide-in-from-top-2">
//                   <button onClick={() => handleDownload('csv')} className="w-full text-left px-4 py-3 text-sm flex items-center gap-2 hover:bg-[rgb(var(--bg-main))] text-[rgb(var(--text-main))]">
//                     <FileSpreadsheet size={16} className="text-emerald-500" /> Excel (CSV)
//                   </button>
//                   <button onClick={() => handleDownload('pdf')} className="w-full text-left px-4 py-3 text-sm flex items-center gap-2 hover:bg-[rgb(var(--bg-main))] text-[rgb(var(--text-main))]">
//                     <FileText size={16} className="text-rose-500" /> PDF Report
//                   </button>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* Top Stats Cards */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//           <StatCard title="Total Users" value={stats?.total_users || 0} icon={Users} colorVar="--brand-primary" trend={calculateTrend(stats?.total_users || 0)} />
//           <StatCard title="Total Courses" value={stats?.total_courses || 0} icon={BookOpen} colorVar="--brand-accent" trend={calculateTrend(stats?.total_courses || 0)} />
//           <StatCard title="Video Lessons" value={stats?.total_lesson_videos || 0} icon={PlayCircle} colorVar="--brand-muted" trend={calculateTrend(stats?.total_lesson_videos || 0)} />
//           <StatCard title="Completion Rate" value={`${courseReport?.summary.completionRate || 0}%`} icon={Award} colorVar="--brand-primary" trend={{value: '', positive: true}} isPercentage />
//         </div>

//         {/* Secondary Stats Row */}
//         {courseReport && (
//           <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
//             <MiniStatCard label="Active Students" value={courseReport.summary.activeStudents} icon={GraduationCap} />
//             <MiniStatCard label="Total Enrollments" value={courseReport.summary.totalEnrollments} icon={Users} />
//             <MiniStatCard label="Certificates Issued" value={courseReport.summary.certificatesIssued} icon={Award} />
//             <MiniStatCard label="Instructors" value={courseReport.summary.totalInstructors} icon={BookOpen} />
//           </div>
//         )}

//         {/* Row 1: Area Chart & Pie Chart */}
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
//           {/* User Volume Chart */}
//           <div className="lg:col-span-2 p-6 rounded-2xl shadow-sm border bg-[rgb(var(--bg-card))] border-[rgb(var(--border-main))]">
//             <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
//               <div>
//                 <h3 className="text-lg font-bold">User Login Activity</h3>
//                 <p className="text-xs opacity-50 font-medium mt-1">Growth over time</p>
//               </div>
              
//               {/* Time Range Selectors - For UI Only until backend supports filtering */}
//               <div className="flex p-1 bg-[rgb(var(--bg-main))] rounded-xl border border-[rgb(var(--border-main))] overflow-x-auto max-w-full">
//                 {(['15D', '1M', '3M', '6M'] as TimeRange[]).map((range) => (
//                   <button
//                     key={range}
//                     onClick={() => setTimeRange(range)}
//                     className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all whitespace-nowrap ${
//                       timeRange === range
//                         ? 'bg-[rgb(var(--bg-card))] text-[rgb(var(--brand-primary))] shadow-sm'
//                         : 'text-[rgb(var(--text-muted))] hover:text-[rgb(var(--text-main))]'
//                     }`}
//                   >
//                     {range}
//                   </button>
//                 ))}
//               </div>
//             </div>

//             <div className={`h-80 w-full transition-opacity duration-300 ${loading ? 'opacity-50' : 'opacity-100'}`}>
//               <ResponsiveContainer width="100%" height="100%">
//                 <AreaChart data={analytics?.user_growth_monthly || []}>
//                   <defs>
//                     <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
//                       <stop offset="5%" stopColor="rgb(var(--brand-primary))" stopOpacity={0.3}/>
//                       <stop offset="95%" stopColor="rgb(var(--brand-primary))" stopOpacity={0}/>
//                     </linearGradient>
//                   </defs>
//                   <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgb(var(--border-main))" opacity={0.5} />
//                   <XAxis 
//                     dataKey="label" 
//                     axisLine={false} 
//                     tickLine={false} 
//                     tick={{fill: 'rgb(var(--text-muted))', fontSize: 10, fontWeight: 500}}
//                     interval="preserveStartEnd"
//                     minTickGap={30}
//                   />
//                   <YAxis 
//                     axisLine={false} 
//                     tickLine={false} 
//                     tick={{fill: 'rgb(var(--text-muted))', fontSize: 11}} 
//                     width={35}
//                   />
//                   <Tooltip content={<CustomGraphTooltip />} cursor={{ stroke: 'rgb(var(--brand-primary))', strokeWidth: 1, strokeDasharray: '4 4' }} />
//                   <Area 
//                     type="monotone" 
//                     dataKey="users" 
//                     stroke="rgb(var(--brand-primary))" 
//                     strokeWidth={2} 
//                     fill="url(#colorUsers)" 
//                     animationDuration={1500} 
//                   />
//                 </AreaChart>
//               </ResponsiveContainer>
//             </div>
//           </div>

//           {/* User Metrics Pie Chart */}
//           <div className="p-6 rounded-2xl shadow-sm border bg-[rgb(var(--bg-card))] border-[rgb(var(--border-main))] flex flex-col">
//             <div className="flex items-center justify-between mb-2">
//               <div>
//                 <h3 className="text-lg font-bold">Course Status</h3>
//                 <p className="text-xs opacity-50 font-medium">Published vs Draft</p>
//               </div>
//               <MoreHorizontal size={20} className="opacity-40" />
//             </div>

//             {/* Chart Area */}
//             <div className="h-[220px] w-full relative my-4">
//               <ResponsiveContainer width="100%" height="100%">
//                 <PieChart>
//                   <Pie
//                     data={analytics?.course_stats || []}
//                     cx="50%"
//                     cy="50%"
//                     innerRadius={60}
//                     outerRadius={80}
//                     paddingAngle={5}
//                     dataKey="value"
//                     stroke="none"
//                     animationDuration={1200}
//                   >
//                     {(analytics?.course_stats || []).map((entry, index) => (
//                       <Cell key={`cell-${index}`} fill={entry.color} />
//                     ))}
//                   </Pie>
//                   <Tooltip 
//                     contentStyle={{ 
//                       backgroundColor: 'rgb(var(--bg-card))', 
//                       borderColor: 'rgb(var(--border-main))', 
//                       borderRadius: '12px',
//                       boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
//                     }}
//                     itemStyle={{ color: 'rgb(var(--text-main))', fontWeight: 'bold' }}
//                   />
//                 </PieChart>
//               </ResponsiveContainer>
              
//               {/* Center Text */}
//               <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
//                 <span className="text-3xl font-bold text-[rgb(var(--text-main))]">{stats?.total_courses}</span>
//                 <span className="text-xs uppercase opacity-50 font-bold tracking-wider text-center">
//                   Total<br/>Courses
//                 </span>
//               </div>
//             </div>

//             {/* Legend / Reference Section */}
//             <div className="space-y-3 mt-auto">
//               {(analytics?.course_stats || []).map((item, index) => (
//                 <div key={index} className="flex items-center justify-between text-sm group cursor-default">
//                   <div className="flex items-center gap-3">
//                     <div 
//                       className="w-3 h-3 rounded-full transition-transform group-hover:scale-125 duration-300" 
//                       style={{ backgroundColor: item.color, boxShadow: `0 0 8px ${item.color}60` }} 
//                     />
//                     <span className="opacity-70 font-medium">{item.name}</span>
//                   </div>
//                   <div className="flex items-center gap-2">
//                     <span className="font-bold">{item.value.toLocaleString()}</span>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>

//         {/* Row 2: Calendar, Enrollments, Activity */}
//         <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
//           <div className="p-6 rounded-2xl shadow-sm border bg-[rgb(var(--bg-card))] border-[rgb(var(--border-main))]">
//              <CalendarWidget data={analytics?.calendar_data || {}} />
//           </div>

//           <div className="p-6 rounded-2xl shadow-sm border bg-[rgb(var(--bg-card))] border-[rgb(var(--border-main))] flex flex-col h-full overflow-hidden">
//             <div className="flex items-center justify-between mb-6">
//               <div>
//                 <h3 className="text-lg font-bold">Enrollments</h3>
//                 <p className="text-sm opacity-60">Activity (Last 7 Days)</p>
//               </div>
//               <div className="p-2 rounded-lg bg-[rgba(var(--brand-accent),0.1)] text-[rgb(var(--brand-accent))]"><CalendarIcon size={20} /></div>
//             </div>
//             <div className="flex-1 w-full mt-auto relative" style={{ minHeight: '250px' }}>
//               <ResponsiveContainer width="100%" height="100%">
//                 <BarChart data={analytics?.system_overview || []} margin={{ top: 0, right: 5, left: -25, bottom: 0 }}>
//                   <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgb(var(--border-main))" opacity={0.5} />
//                   <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: 'rgb(var(--text-muted))', fontSize: 11}} interval={0} height={40} dy={15} />
//                   <YAxis axisLine={false} tickLine={false} hide />
//                   <Tooltip cursor={{fill: 'rgba(var(--brand-accent), 0.05)'}} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
//                   <Bar dataKey="value" fill="rgb(var(--brand-accent))" radius={[6, 6, 0, 0]} barSize={35} />
//                 </BarChart>
//               </ResponsiveContainer>
//             </div>
//           </div>

//           <div className="p-6 rounded-2xl shadow-sm border bg-[rgb(var(--bg-card))] border-[rgb(var(--border-main))]">
//             <h3 className="text-lg font-bold mb-6">Live Activity</h3>
//             <div className="space-y-6 relative border-l-2 border-[rgb(var(--border-main))] ml-2 max-h-[300px] overflow-y-auto">
//               {(analytics?.recent_activity || []).length > 0 ? (
//                 analytics?.recent_activity.map((item) => (
//                   <div key={item.id} className="relative pl-6 flex flex-col">
//                     <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full border-2 border-[rgb(var(--bg-card))] bg-[rgb(var(--brand-primary))]" />
//                     <p className="text-sm font-medium">{item.text}</p>
//                     <p className="text-xs opacity-50 mt-1">
//                       {/* Safe Date Parsing */}
//                       {(() => {
//                         try {
//                           return formatDistanceToNow(new Date(item.time), { addSuffix: true })
//                         } catch {
//                           return item.time
//                         }
//                       })()}
//                     </p>
//                   </div>
//                 ))
//               ) : (
//                 <p className="text-sm opacity-50 pl-6">No recent activity</p>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* Row 3: Course Categories (From CourseReport) */}
//         {courseReport && (
//           <div className="p-6 rounded-2xl shadow-sm border bg-[rgb(var(--bg-card))] border-[rgb(var(--border-main))]">
//              <h3 className="text-lg font-bold mb-6">Course Categories</h3>
//              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//                {courseReport.categories.map((cat, idx) => (
//                  <div key={idx} className="flex items-center justify-between p-3 border rounded-lg hover:bg-[rgb(var(--bg-main))] transition-colors" style={{borderColor: 'rgb(var(--border-main))'}}>
//                     <span className="font-medium">{cat.name}</span>
//                     <span className="bg-[rgb(var(--brand-primary))] text-white text-xs px-2 py-1 rounded-full">{cat.count}</span>
//                  </div>
//                ))}
//              </div>
//           </div>
//         )}

//       </div>
//     </div>
//   );
// };

// // --- Sub Components ---

// const CalendarWidget = ({ data }: { data: Record<string, number> }) => {
//   const [currentDate, setCurrentDate] = useState(new Date()); 
  
//   const monthStart = startOfMonth(currentDate);
//   const monthEnd = endOfMonth(monthStart);
//   const startDate = startOfWeek(monthStart);
//   const endDate = endOfWeek(monthEnd);
//   const calendarDays = eachDayOfInterval({ start: startDate, end: endDate });

//   const getIntensity = (count: number) => {
//      if (count === 0) return 'bg-[rgb(var(--bg-main))]';
//      if (count <= 2) return 'bg-[rgba(var(--brand-primary),0.3)]';
//      if (count <= 5) return 'bg-[rgba(var(--brand-primary),0.6)]';
//      return 'bg-[rgb(var(--brand-primary))]';
//   };

//   return (
//     <div className="h-full flex flex-col">
//       <div className="flex items-center justify-between mb-6">
//         <h3 className="text-lg font-bold">Registration Calendar</h3>
//         <div className="flex gap-1 items-center bg-[rgb(var(--bg-main))] p-1 rounded-lg">
//           <button onClick={() => setCurrentDate(subMonths(currentDate, 1))} className="p-1 hover:bg-[rgb(var(--bg-card))] rounded transition-colors"><ChevronLeft size={16}/></button>
//           <span className="text-xs font-bold px-2">{format(currentDate, 'MMM yyyy')}</span>
//           <button onClick={() => setCurrentDate(addMonths(currentDate, 1))} className="p-1 hover:bg-[rgb(var(--bg-card))] rounded transition-colors"><ChevronRight size={16}/></button>
//         </div>
//       </div>
//       <div className="grid grid-cols-7 gap-2 text-center text-[10px] font-bold opacity-40 mb-2">
//         {['S','M','T','W','T','F','S'].map(d => <div key={d}>{d}</div>)}
//       </div>
//       <div className="grid grid-cols-7 gap-2 flex-1">
//         {calendarDays.map((day, idx) => {
//           const dateKey = format(day, 'yyyy-MM-dd');
//           const count = data[dateKey] || 0;
//           const isCurrentMonth = isSameMonth(day, monthStart);
//           const isToday = isSameDay(day, new Date()); 
          
//           return (
//             <div key={idx} className={`relative aspect-square rounded-lg flex items-center justify-center text-xs transition-all group duration-200 ${isCurrentMonth ? 'opacity-100' : 'opacity-20'} ${isCurrentMonth ? 'hover:scale-105 hover:shadow-md' : ''} ${getIntensity(count)}`}
//                  style={{ 
//                    color: count > 0 ? '#fff' : 'inherit',
//                    boxShadow: isToday ? '0 0 0 2px rgb(var(--brand-primary))' : 'none'
//                  }}>
//               {format(day, 'd')}
//               <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-50 whitespace-nowrap text-[10px] px-2 py-1 rounded bg-[rgb(var(--brand-primary))] text-white shadow-lg pointer-events-none animate-in fade-in zoom-in-95 duration-200">
//                  {format(day, 'MMM d')}: {count} Users
//               </div>
//             </div>
//           );
//         })}
//       </div>
//     </div>
//   );
// };

// const StatCard = ({ title, value, icon: Icon, colorVar, trend, isPercentage }: any) => (
//   <div className="p-6 rounded-2xl shadow-sm border bg-[rgb(var(--bg-card))] border-[rgb(var(--border-main))] group hover:-translate-y-1 transition-all duration-300">
//     <div className="flex justify-between items-start">
//       <div>
//         <p className="text-xs font-bold opacity-50 uppercase tracking-wider">{title}</p>
//         <h3 className="text-3xl font-bold mt-2">{typeof value === 'number' ? value.toLocaleString() : value}</h3>
//       </div>
//       <div className="p-3 rounded-xl transition-colors duration-300 group-hover:scale-110" style={{ backgroundColor: `rgba(var(${colorVar}), 0.1)`, color: `rgb(var(${colorVar}))` }}><Icon size={24} /></div>
//     </div>
//     <div className="mt-4 flex items-center gap-1 text-xs font-bold text-emerald-500 bg-emerald-500/10 w-fit px-2 py-1 rounded-lg">
//       <ArrowUpRight size={14} /> {trend.value} <span className="opacity-50 font-normal ml-1">growth</span>
//     </div>
//   </div>
// );

// const MiniStatCard = ({ label, value, icon: Icon }: any) => (
//   <div className="p-4 rounded-xl border bg-[rgb(var(--bg-card))] border-[rgb(var(--border-main))] flex items-center gap-3">
//     <div className="p-2 rounded-lg bg-[rgba(var(--brand-primary),0.1)]">
//       <Icon size={18} />
//     </div>
//     <div>
//       <p className="text-lg font-bold">{typeof value === 'number' ? value.toLocaleString() : value}</p>
//       <p className="text-xs opacity-50">{label}</p>
//     </div>
//   </div>
// );

// const CustomGraphTooltip = ({ active, payload }: any) => {
//   if (active && payload?.length) {
//     return (
//       <div className="p-3 rounded-lg shadow-xl bg-[rgb(var(--bg-card))] border border-[rgb(var(--border-main))] animate-in fade-in zoom-in-95 duration-200">
//         <p className="text-xs font-bold opacity-50">{payload[0].payload.fullLabel || payload[0].payload.label}</p>
//         <p className="text-lg font-bold text-[rgb(var(--brand-primary))]">+{payload[0].value} Users</p>
//       </div>
//     );
//   }
//   return null;
// };

// const LoadingSkeleton = () => <div className="min-h-screen bg-[rgb(var(--bg-main))] p-10 animate-pulse"><div className="h-32 bg-[rgb(var(--bg-card))] rounded-3xl w-full mb-8"/><div className="grid grid-cols-3 gap-6"><div className="h-40 bg-[rgb(var(--bg-card))] rounded-3xl"/><div className="h-40 bg-[rgb(var(--bg-card))] rounded-3xl"/><div className="h-40 bg-[rgb(var(--bg-card))] rounded-3xl"/></div></div>;

// const ErrorDisplay = ({ error, retry }: any) => (
//   <div className="min-h-screen flex items-center justify-center bg-[rgb(var(--bg-main))]">
//     <div className="text-center p-10 bg-[rgb(var(--bg-card))] rounded-3xl shadow-xl border border-[rgb(var(--border-main))]">
//       <Activity size={48} className="mx-auto text-red-500 mb-4" />
//       <h2 className="text-xl font-bold mb-2">Failed to Load</h2>
//       <p className="opacity-60 mb-6">{error}</p>
//       <button onClick={retry} className="px-8 py-3 bg-[rgb(var(--brand-primary))] text-white rounded-xl hover:opacity-90 transition-opacity">Retry Sync</button>
//     </div>
//   </div>
// );

// export default AdminDashboard;