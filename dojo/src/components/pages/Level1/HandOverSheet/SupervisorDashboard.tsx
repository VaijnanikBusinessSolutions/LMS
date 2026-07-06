import React, { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import {
  Users,
  ClipboardCheck,
  Building2,
  Calendar as CalendarIcon,
  RefreshCw,
  TrendingUp,
  Layers,
  Activity,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  Search,
  Sparkles,
} from "lucide-react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  startOfMonth,
  startOfWeek,
  subDays,
  subMonths,
} from "date-fns";
import type { RootState } from "../../../store/store";

interface AllocationRecord {
  id: number;
  employee_name: string;
  employee_lastname: string;
  employee_id_card: string;
  supervisor_name: string;
  supervisor_id: number;
  department_name: string;
  line_name: string;
  subline_name: string;
  station_name: string;
  handover_date: string;
  is_training_completed: boolean;
}

type SortBy = "date" | "name" | "dept";
type SortOrder = "asc" | "desc";

const PIE_COLORS = ["#8b5cf6", "#06b6d4", "#f59e0b", "#10b981", "#ef4444"];

const SupervisorDashboard: React.FC = () => {
  const { accessToken, user } = useSelector((state: RootState) => state.auth);
  const location = useLocation();

  const [records, setRecords] = useState<AllocationRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [sortBy, setSortBy] = useState<SortBy>("date");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [calendarDate, setCalendarDate] = useState(new Date());

  const supervisorIdFilter = useMemo(() => {
    const params = new URLSearchParams(location.search);
    return params.get("supervisor_id");
  }, [location.search]);

  useEffect(() => {
    const fetchData = async () => {
      if (!accessToken) {
        setLoading(false);
        setError("No access token found. Please log in again.");
        return;
      }

      try {
        setLoading(true);
        const response = await fetch("http://127.0.0.1:8000/reports/supervisor-allocations/", {
          headers: { Authorization: `Bearer ${accessToken}` },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch team leader dashboard data");
        }

        const data: AllocationRecord[] = await response.json();
        setRecords(Array.isArray(data) ? data : []);
        setError(null);
      } catch (fetchError) {
        console.error(fetchError);
        setError("Unable to load team leader dashboard right now.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [accessToken]);

  const filteredRecords = useMemo(() => {
    let nextRecords = [...records];

    if (supervisorIdFilter) {
      nextRecords = nextRecords.filter(
        (record) => String(record.supervisor_id) === supervisorIdFilter,
      );
    }

    if (searchTerm.trim()) {
      const normalized = searchTerm.trim().toLowerCase();
      nextRecords = nextRecords.filter((record) =>
        [
          record.employee_name,
          record.employee_lastname,
          record.employee_id_card,
          record.supervisor_name,
          record.department_name,
          record.line_name,
          record.station_name,
        ]
          .filter(Boolean)
          .some((value) => value.toLowerCase().includes(normalized)),
      );
    }

    if (selectedMonth) {
      nextRecords = nextRecords.filter((record) =>
        record.handover_date.startsWith(selectedMonth),
      );
    }

    nextRecords.sort((left, right) => {
      let leftValue: number | string = "";
      let rightValue: number | string = "";

      if (sortBy === "date") {
        leftValue = new Date(left.handover_date).getTime();
        rightValue = new Date(right.handover_date).getTime();
      } else if (sortBy === "name") {
        leftValue = `${left.employee_name} ${left.employee_lastname}`.trim().toLowerCase();
        rightValue = `${right.employee_name} ${right.employee_lastname}`.trim().toLowerCase();
      } else {
        leftValue = (left.department_name || "").toLowerCase();
        rightValue = (right.department_name || "").toLowerCase();
      }

      if (leftValue < rightValue) {
        return sortOrder === "asc" ? -1 : 1;
      }
      if (leftValue > rightValue) {
        return sortOrder === "asc" ? 1 : -1;
      }
      return 0;
    });

    return nextRecords;
  }, [records, searchTerm, selectedMonth, sortBy, sortOrder, supervisorIdFilter]);

  const stats = useMemo(() => {
    const uniqueSupervisors = new Set(filteredRecords.map((record) => record.supervisor_name).filter(Boolean));
    const uniqueDepartments = new Set(filteredRecords.map((record) => record.department_name).filter(Boolean));
    const completedCount = filteredRecords.filter((record) => record.is_training_completed).length;

    return {
      totalAllocations: filteredRecords.length,
      activeSupervisors: uniqueSupervisors.size,
      completedTrainings: completedCount,
      uniqueDepartments: uniqueDepartments.size,
      completionRate:
        filteredRecords.length > 0
          ? Math.round((completedCount / filteredRecords.length) * 100)
          : 0,
    };
  }, [filteredRecords]);

  const trendData = useMemo(() => {
    const today = new Date();
    return Array.from({ length: 7 }, (_, index) => {
      const day = subDays(today, 6 - index);
      const dayKey = format(day, "yyyy-MM-dd");
      const value = filteredRecords.filter((record) => record.handover_date === dayKey).length;

      return {
        label: format(day, "EEE"),
        count: value,
        fullLabel: format(day, "dd MMM yyyy"),
      };
    });
  }, [filteredRecords]);

  const departmentData = useMemo(() => {
    const grouped = filteredRecords.reduce<Record<string, number>>((accumulator, record) => {
      const key = record.department_name || "Unassigned";
      accumulator[key] = (accumulator[key] || 0) + 1;
      return accumulator;
    }, {});

    return Object.entries(grouped)
      .sort((left, right) => right[1] - left[1])
      .slice(0, 5)
      .map(([name, value], index) => ({
        name,
        value,
        color: PIE_COLORS[index % PIE_COLORS.length],
      }));
  }, [filteredRecords]);

  const lineDistribution = useMemo(() => {
    const grouped = filteredRecords.reduce<Record<string, number>>((accumulator, record) => {
      const key = record.line_name || "Unassigned";
      accumulator[key] = (accumulator[key] || 0) + 1;
      return accumulator;
    }, {});

    return Object.entries(grouped)
      .sort((left, right) => right[1] - left[1])
      .slice(0, 6)
      .map(([name, value]) => ({ name, value }));
  }, [filteredRecords]);

  const supervisorSummary = useMemo(() => {
    const grouped = filteredRecords.reduce<
      Record<string, { count: number; completed: number; supervisorId: number | null }>
    >((accumulator, record) => {
      const key = record.supervisor_name || "Unassigned";
      if (!accumulator[key]) {
        accumulator[key] = { count: 0, completed: 0, supervisorId: record.supervisor_id ?? null };
      }
      accumulator[key].count += 1;
      if (record.is_training_completed) {
        accumulator[key].completed += 1;
      }
      return accumulator;
    }, {});

    return Object.entries(grouped)
      .sort((left, right) => right[1].count - left[1].count)
      .slice(0, 5)
      .map(([name, summary]) => ({
        name,
        count: summary.count,
        completionRate: summary.count > 0 ? Math.round((summary.completed / summary.count) * 100) : 0,
        supervisorId: summary.supervisorId,
      }));
  }, [filteredRecords]);

  const recentAssignments = useMemo(
    () =>
      [...filteredRecords]
        .sort(
          (left, right) =>
            new Date(right.handover_date).getTime() - new Date(left.handover_date).getTime(),
        )
        .slice(0, 6),
    [filteredRecords],
  );

  const calendarCounts = useMemo(() => {
    return filteredRecords.reduce<Record<string, number>>((accumulator, record) => {
      accumulator[record.handover_date] = (accumulator[record.handover_date] || 0) + 1;
      return accumulator;
    }, {});
  }, [filteredRecords]);

  if (loading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState error={error} onRetry={() => window.location.reload()} />;
  }

  return (
    <div
      className="min-h-screen p-4 md:p-6 lg:p-10 transition-colors duration-500"
      style={{ backgroundColor: "rgb(var(--bg-main))", color: "rgb(var(--text-main))" }}
    >
      <div className="mx-auto max-w-[1920px] space-y-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="bg-gradient-to-r from-violet-500 via-fuchsia-500 to-cyan-400 bg-clip-text text-3xl font-bold text-transparent">
                Welcome back, {user?.first_name || user?.email || "Team Leader"}
              </h1>
              <Sparkles size={22} className="animate-pulse text-amber-400" />
            </div>
            <p className="mt-1.5 text-sm font-medium opacity-50">
              Team allocation visibility, handover monitoring, and training follow-up
            </p>
          </div>

          <button
            onClick={() => window.location.reload()}
            className="flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold transition-all duration-300 hover:scale-[1.02]"
            style={{
              backgroundColor: "rgba(var(--bg-card), 0.7)",
              borderColor: "rgba(var(--border-main), 0.5)",
            }}
          >
            <RefreshCw size={16} />
            Refresh Dashboard
          </button>
        </div>

        <div
          className="rounded-2xl border p-5 backdrop-blur-xl"
          style={{
            backgroundColor: "rgba(var(--bg-card), 0.7)",
            borderColor: "rgba(var(--border-main), 0.5)",
          }}
        >
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            <FilterField
              icon={<Search size={16} className="text-cyan-400" />}
              label="Search"
              value={searchTerm}
              onChange={setSearchTerm}
              placeholder="Employee, supervisor, department..."
            />
            <MonthField value={selectedMonth} onChange={setSelectedMonth} />
            <SelectField
              label="Sort By"
              value={sortBy}
              onChange={(value) => setSortBy(value as SortBy)}
              options={[
                { label: "Handover Date", value: "date" },
                { label: "Employee Name", value: "name" },
                { label: "Department", value: "dept" },
              ]}
            />
            <SelectField
              label="Order"
              value={sortOrder}
              onChange={(value) => setSortOrder(value as SortOrder)}
              options={[
                { label: "Descending", value: "desc" },
                { label: "Ascending", value: "asc" },
              ]}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
          <GradientStatCard
            title="Total Allocations"
            value={stats.totalAllocations}
            icon={Users}
            subtitle="Visible assignments"
            trend={`${stats.activeSupervisors} leaders`}
            gradient="linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)"
            shadowColor="rgba(59,130,246,0.35)"
          />
          <GradientStatCard
            title="Completed Training"
            value={stats.completedTrainings}
            icon={ClipboardCheck}
            subtitle="Marked complete"
            trend={`${stats.completionRate}% rate`}
            gradient="linear-gradient(135deg, #14b8a6 0%, #0f766e 100%)"
            shadowColor="rgba(20,184,166,0.35)"
          />
          <GradientStatCard
            title="Departments"
            value={stats.uniqueDepartments}
            icon={Building2}
            subtitle="Covered teams"
            trend="Cross-line coverage"
            gradient="linear-gradient(135deg, #f59e0b 0%, #d97706 100%)"
            shadowColor="rgba(245,158,11,0.35)"
          />
          <GradientStatCard
            title="Active Supervisors"
            value={stats.activeSupervisors}
            icon={Layers}
            subtitle="Within current filters"
            trend={supervisorIdFilter ? "Focused leader view" : "All leaders"}
            gradient="linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)"
            shadowColor="rgba(139,92,246,0.35)"
          />
        </div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          <div
            className="xl:col-span-2 rounded-2xl border p-6 backdrop-blur-xl"
            style={{
              backgroundColor: "rgba(var(--bg-card), 0.7)",
              borderColor: "rgba(var(--border-main), 0.5)",
            }}
          >
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h3 className="flex items-center gap-2 text-lg font-bold">
                  <TrendingUp size={18} className="text-blue-400" />
                  Allocation Trend
                </h3>
                <p className="mt-1 text-xs font-medium opacity-40">Last 7 days of handovers</p>
              </div>
              <div className="rounded-xl px-3 py-2 text-xs font-bold" style={{ backgroundColor: "rgba(59,130,246,0.08)", color: "#3b82f6" }}>
                Daily movement
              </div>
            </div>

            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendData}>
                  <defs>
                    <linearGradient id="teamLeadTrendFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.32} />
                      <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.03} />
                    </linearGradient>
                    <linearGradient id="teamLeadTrendStroke" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#8b5cf6" />
                      <stop offset="100%" stopColor="#06b6d4" />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgb(var(--border-main))" opacity={0.3} />
                  <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fill: "rgb(var(--text-muted))", fontSize: 11 }} />
                  <YAxis axisLine={false} tickLine={false} allowDecimals={false} tick={{ fill: "rgb(var(--text-muted))", fontSize: 11 }} width={32} />
                  <Tooltip content={<ChartTooltip suffix="allocations" />} cursor={{ stroke: "#3b82f6", strokeDasharray: "4 4" }} />
                  <Area
                    type="monotone"
                    dataKey="count"
                    stroke="url(#teamLeadTrendStroke)"
                    strokeWidth={3}
                    fill="url(#teamLeadTrendFill)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div
            className="rounded-2xl border p-6 backdrop-blur-xl"
            style={{
              backgroundColor: "rgba(var(--bg-card), 0.7)",
              borderColor: "rgba(var(--border-main), 0.5)",
            }}
          >
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold">Department Spread</h3>
                <p className="mt-1 text-xs font-medium opacity-40">Top active departments</p>
              </div>
              <Activity size={18} className="opacity-30" />
            </div>

            <div className="relative my-4 h-[220px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={departmentData} innerRadius={56} outerRadius={82} dataKey="value" stroke="none" paddingAngle={4}>
                    {departmentData.map((entry, index) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<ChartTooltip suffix="people" />} />
                </PieChart>
              </ResponsiveContainer>
              <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold">{stats.uniqueDepartments}</span>
                <span className="text-[10px] font-bold uppercase tracking-widest opacity-40">Departments</span>
              </div>
            </div>

            <div className="space-y-3">
              {departmentData.map((department) => (
                <div key={department.name} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-3">
                    <div className="h-3 w-3 rounded-full" style={{ backgroundColor: department.color, boxShadow: `0 0 12px ${department.color}66` }} />
                    <span className="font-medium opacity-70">{department.name}</span>
                  </div>
                  <span className="font-bold">{department.value}</span>
                </div>
              ))}
              {departmentData.length === 0 && <EmptyInlineState label="No department data available" />}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          <div
            className="rounded-2xl border p-6 backdrop-blur-xl"
            style={{
              backgroundColor: "rgba(var(--bg-card), 0.7)",
              borderColor: "rgba(var(--border-main), 0.5)",
            }}
          >
            <CalendarWidget
              currentDate={calendarDate}
              counts={calendarCounts}
              onPrevious={() => setCalendarDate((current) => subMonths(current, 1))}
              onNext={() => setCalendarDate((current) => addMonths(current, 1))}
            />
          </div>

          <div
            className="rounded-2xl border p-6 backdrop-blur-xl"
            style={{
              backgroundColor: "rgba(var(--bg-card), 0.7)",
              borderColor: "rgba(var(--border-main), 0.5)",
            }}
          >
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold">Line Distribution</h3>
                <p className="mt-1 text-xs font-medium opacity-40">Most assigned lines</p>
              </div>
              <CalendarIcon size={18} className="text-teal-400" />
            </div>

            <div className="h-[260px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={lineDistribution} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="lineBarGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#14b8a6" stopOpacity={0.9} />
                      <stop offset="100%" stopColor="#0f766e" stopOpacity={0.7} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgb(var(--border-main))" opacity={0.3} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "rgb(var(--text-muted))", fontSize: 10 }} />
                  <YAxis allowDecimals={false} axisLine={false} tickLine={false} tick={{ fill: "rgb(var(--text-muted))", fontSize: 10 }} width={28} />
                  <Tooltip content={<ChartTooltip suffix="assignments" />} />
                  <Bar dataKey="value" fill="url(#lineBarGradient)" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div
            className="rounded-2xl border p-6 backdrop-blur-xl"
            style={{
              backgroundColor: "rgba(var(--bg-card), 0.7)",
              borderColor: "rgba(var(--border-main), 0.5)",
            }}
          >
            <div className="mb-5">
              <h3 className="text-lg font-bold">Leader Summary</h3>
              <p className="mt-1 text-xs font-medium opacity-40">Top supervisors in current scope</p>
            </div>

            <div className="space-y-4">
              {supervisorSummary.map((summary, index) => (
                <div
                  key={`${summary.name}-${index}`}
                  className="rounded-xl border p-4"
                  style={{
                    backgroundColor: "rgba(var(--bg-main), 0.35)",
                    borderColor: "rgba(var(--border-main), 0.35)",
                  }}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-bold">{summary.name}</p>
                      <p className="mt-1 text-xs opacity-50">
                        {summary.supervisorId ? `Supervisor ID ${summary.supervisorId}` : "No ID"}
                      </p>
                    </div>
                    <div className="rounded-lg px-2.5 py-1 text-xs font-bold" style={{ backgroundColor: "rgba(139,92,246,0.1)", color: "#8b5cf6" }}>
                      {summary.count} assigned
                    </div>
                  </div>
                  <div className="mt-3 flex items-center justify-between text-xs font-semibold opacity-70">
                    <span>Completion</span>
                    <span>{summary.completionRate}%</span>
                  </div>
                  <div className="mt-2 h-2 overflow-hidden rounded-full" style={{ backgroundColor: "rgba(var(--border-main), 0.35)" }}>
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${summary.completionRate}%`,
                        background: "linear-gradient(90deg, #8b5cf6, #06b6d4)",
                      }}
                    />
                  </div>
                </div>
              ))}
              {supervisorSummary.length === 0 && <EmptyInlineState label="No supervisor summary available" />}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          <div
            className="rounded-2xl border p-6 backdrop-blur-xl xl:col-span-1"
            style={{
              backgroundColor: "rgba(var(--bg-card), 0.7)",
              borderColor: "rgba(var(--border-main), 0.5)",
            }}
          >
            <h3 className="mb-5 text-lg font-bold">Recent Handover Activity</h3>
            <div className="relative space-y-5 border-l-2 pl-5" style={{ borderColor: "rgba(var(--border-main), 0.5)" }}>
              {recentAssignments.map((record) => (
                <div key={record.id} className="relative">
                  <div className="absolute -left-[29px] top-1 h-4 w-4 rounded-full border-2" style={{ backgroundColor: "#3b82f6", borderColor: "rgb(var(--bg-card))" }} />
                  <p className="text-sm font-semibold">
                    {record.employee_name} {record.employee_lastname}
                  </p>
                  <p className="mt-1 text-xs opacity-60">
                    {record.supervisor_name} · {record.department_name || "Unassigned"} · {record.handover_date}
                  </p>
                </div>
              ))}
              {recentAssignments.length === 0 && <EmptyInlineState label="No recent activity to show" />}
            </div>
          </div>

          <div
            className="overflow-hidden rounded-2xl border backdrop-blur-xl xl:col-span-2"
            style={{
              backgroundColor: "rgba(var(--bg-card), 0.7)",
              borderColor: "rgba(var(--border-main), 0.5)",
            }}
          >
            <div className="flex items-center justify-between border-b p-5" style={{ borderColor: "rgba(var(--border-main), 0.5)" }}>
              <div className="flex items-center gap-2">
                <div className="rounded-xl p-2" style={{ background: "linear-gradient(135deg, rgba(59,130,246,0.15), rgba(6,182,212,0.08))" }}>
                  <Layers size={16} className="text-blue-500" />
                </div>
                <h3 className="text-sm font-bold">Assignment Table</h3>
              </div>
              <div className="flex items-center gap-2 text-xs font-bold opacity-60">
                <ArrowUpRight size={14} />
                {filteredRecords.length} visible rows
              </div>
            </div>

            <div className="overflow-auto">
              <table className="w-full text-left">
                <thead
                  className="sticky top-0 text-[10px] font-bold uppercase tracking-wider"
                  style={{
                    backgroundColor: "rgba(var(--bg-main), 0.82)",
                    color: "rgb(var(--text-muted))",
                  }}
                >
                  <tr>
                    <th className="px-5 py-3">Date</th>
                    <th className="px-5 py-3">Employee</th>
                    <th className="px-5 py-3">Supervisor</th>
                    <th className="px-5 py-3">Department</th>
                    <th className="px-5 py-3">Line</th>
                    <th className="px-5 py-3">Station</th>
                    <th className="px-5 py-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRecords.map((record, index) => (
                    <tr
                      key={record.id}
                      className="transition-colors duration-200"
                      style={{
                        backgroundColor: index % 2 === 0 ? "transparent" : "rgba(var(--bg-main), 0.18)",
                      }}
                    >
                      <td className="px-5 py-4 text-sm font-semibold">{record.handover_date}</td>
                      <td className="px-5 py-4">
                        <div className="text-sm font-semibold">
                          {record.employee_name} {record.employee_lastname}
                        </div>
                        <div className="mt-1 text-xs opacity-55">{record.employee_id_card}</div>
                      </td>
                      <td className="px-5 py-4 text-sm">{record.supervisor_name}</td>
                      <td className="px-5 py-4 text-sm">{record.department_name || "—"}</td>
                      <td className="px-5 py-4 text-sm">{record.line_name || "—"}</td>
                      <td className="px-5 py-4 text-sm">{record.station_name || "—"}</td>
                      <td className="px-5 py-4">
                        <span
                          className="inline-flex items-center rounded-full px-3 py-1 text-xs font-bold"
                          style={
                            record.is_training_completed
                              ? {
                                  backgroundColor: "rgba(16,185,129,0.12)",
                                  color: "#059669",
                                }
                              : {
                                  backgroundColor: "rgba(245,158,11,0.12)",
                                  color: "#d97706",
                                }
                          }
                        >
                          {record.is_training_completed ? "Completed" : "Pending"}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {filteredRecords.length === 0 && (
                    <tr>
                      <td colSpan={7} className="px-5 py-14 text-center">
                        <EmptyInlineState label="No assignment records match the current filters" />
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const GradientStatCard = ({
  title,
  value,
  icon: Icon,
  subtitle,
  trend,
  gradient,
  shadowColor,
}: {
  title: string;
  value: number;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  subtitle: string;
  trend: string;
  gradient: string;
  shadowColor: string;
}) => (
  <div
    className="rounded-2xl p-6 text-white transition-transform duration-300 hover:-translate-y-1"
    style={{
      background: gradient,
      boxShadow: `0 18px 45px -14px ${shadowColor}`,
    }}
  >
    <div className="flex items-start justify-between">
      <div>
        <p className="text-xs font-bold uppercase tracking-wider text-white/70">{title}</p>
        <h3 className="mt-3 text-4xl font-extrabold">{value.toLocaleString()}</h3>
        <p className="mt-1 text-sm text-white/70">{subtitle}</p>
      </div>
      <div className="rounded-2xl bg-white/15 p-3">
        <Icon size={22} className="text-white" />
      </div>
    </div>
    <div className="mt-5 flex items-center gap-2 text-xs font-bold text-white/85">
      <ArrowUpRight size={14} />
      {trend}
    </div>
  </div>
);

const FilterField = ({
  icon,
  label,
  value,
  onChange,
  placeholder,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}) => (
  <div>
    <label className="mb-2 block text-xs font-bold uppercase tracking-wider opacity-50">{label}</label>
    <div
      className="flex items-center gap-3 rounded-xl border px-3 py-3"
      style={{
        backgroundColor: "rgba(var(--bg-main), 0.35)",
        borderColor: "rgba(var(--border-main), 0.45)",
      }}
    >
      {icon}
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="w-full bg-transparent text-sm outline-none placeholder:opacity-40"
      />
    </div>
  </div>
);

const MonthField = ({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) => (
  <div>
    <label className="mb-2 block text-xs font-bold uppercase tracking-wider opacity-50">Month</label>
    <input
      type="month"
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className="w-full rounded-xl border px-3 py-3 text-sm outline-none"
      style={{
        backgroundColor: "rgba(var(--bg-main), 0.35)",
        borderColor: "rgba(var(--border-main), 0.45)",
      }}
    />
  </div>
);

const SelectField = ({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: Array<{ label: string; value: string }>;
}) => (
  <div>
    <label className="mb-2 block text-xs font-bold uppercase tracking-wider opacity-50">{label}</label>
    <select
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className="w-full rounded-xl border px-3 py-3 text-sm outline-none"
      style={{
        backgroundColor: "rgba(var(--bg-main), 0.35)",
        borderColor: "rgba(var(--border-main), 0.45)",
      }}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  </div>
);

const ChartTooltip = ({
  active,
  payload,
  suffix,
}: {
  active?: boolean;
  payload?: Array<{ value: number; payload: { fullLabel?: string; label?: string; name?: string } }>;
  suffix: string;
}) => {
  if (!active || !payload?.length) {
    return null;
  }

  const point = payload[0];
  return (
    <div
      className="rounded-xl border px-3 py-2 shadow-xl"
      style={{
        backgroundColor: "rgba(var(--bg-card), 0.95)",
        borderColor: "rgba(var(--border-main), 0.5)",
      }}
    >
      <p className="text-xs font-bold opacity-50">
        {point.payload.fullLabel || point.payload.label || point.payload.name}
      </p>
      <p className="mt-1 text-sm font-bold">
        {point.value} {suffix}
      </p>
    </div>
  );
};

const CalendarWidget = ({
  currentDate,
  counts,
  onPrevious,
  onNext,
}: {
  currentDate: Date;
  counts: Record<string, number>;
  onPrevious: () => void;
  onNext: () => void;
}) => {
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);
  const calendarDays = eachDayOfInterval({ start: startDate, end: endDate });

  const getDayStyle = (date: Date) => {
    const count = counts[format(date, "yyyy-MM-dd")] || 0;

    if (isSameDay(date, new Date())) {
      return {
        background: "linear-gradient(135deg, #3b82f6, #1d4ed8)",
        color: "#fff",
      };
    }

    if (count >= 4) {
      return { backgroundColor: "rgba(139,92,246,0.22)", color: "#8b5cf6" };
    }
    if (count >= 2) {
      return { backgroundColor: "rgba(6,182,212,0.18)", color: "#0891b2" };
    }
    if (count >= 1) {
      return { backgroundColor: "rgba(16,185,129,0.14)", color: "#059669" };
    }
    return {};
  };

  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold">Handover Calendar</h3>
          <p className="mt-1 text-xs font-medium opacity-40">Activity by date</p>
        </div>
        <div className="flex items-center gap-1 rounded-xl border p-1" style={{ borderColor: "rgba(var(--border-main), 0.45)" }}>
          <button onClick={onPrevious} className="rounded-lg p-1.5 transition hover:bg-white/5">
            <ChevronLeft size={16} />
          </button>
          <span className="px-2 text-xs font-bold">{format(currentDate, "MMM yyyy")}</span>
          <button onClick={onNext} className="rounded-lg p-1.5 transition hover:bg-white/5">
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      <div className="mb-2 grid grid-cols-7 gap-2 text-center text-[10px] font-bold uppercase tracking-wider opacity-40">
        {["S", "M", "T", "W", "T", "F", "S"].map((day) => (
          <div key={day}>{day}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-2">
        {calendarDays.map((date) => {
          const dayStyle = getDayStyle(date);
          const count = counts[format(date, "yyyy-MM-dd")] || 0;

          return (
            <div
              key={format(date, "yyyy-MM-dd")}
              className="group relative flex aspect-square items-center justify-center rounded-xl text-xs font-semibold transition"
              style={{
                opacity: isSameMonth(date, monthStart) ? 1 : 0.24,
                ...dayStyle,
              }}
            >
              {format(date, "d")}
              {count > 0 && (
                <div className="absolute bottom-1 h-1.5 w-1.5 rounded-full bg-current opacity-60" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

const LoadingState = () => (
  <div
    className="min-h-screen p-10"
    style={{ backgroundColor: "rgb(var(--bg-main))" }}
  >
    <div className="mx-auto max-w-[1920px] animate-pulse space-y-6">
      <div className="h-28 rounded-3xl" style={{ backgroundColor: "rgb(var(--bg-card))" }} />
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="h-40 rounded-3xl" style={{ backgroundColor: "rgb(var(--bg-card))" }} />
        ))}
      </div>
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="h-96 rounded-3xl xl:col-span-2" style={{ backgroundColor: "rgb(var(--bg-card))" }} />
        <div className="h-96 rounded-3xl" style={{ backgroundColor: "rgb(var(--bg-card))" }} />
      </div>
    </div>
  </div>
);

const ErrorState = ({
  error,
  onRetry,
}: {
  error: string;
  onRetry: () => void;
}) => (
  <div
    className="flex min-h-screen items-center justify-center"
    style={{ backgroundColor: "rgb(var(--bg-main))" }}
  >
    <div
      className="rounded-3xl border p-10 text-center shadow-xl"
      style={{
        backgroundColor: "rgb(var(--bg-card))",
        borderColor: "rgb(var(--border-main))",
      }}
    >
      <Activity size={42} className="mx-auto mb-4 text-rose-500" />
      <h2 className="mb-2 text-xl font-bold">Unable to load dashboard</h2>
      <p className="mb-6 opacity-60">{error}</p>
      <button
        onClick={onRetry}
        className="rounded-xl px-6 py-3 font-semibold text-white"
        style={{ background: "linear-gradient(135deg, #8b5cf6, #06b6d4)" }}
      >
        Retry
      </button>
    </div>
  </div>
);

const EmptyInlineState = ({ label }: { label: string }) => (
  <div className="text-center text-sm font-medium opacity-55">{label}</div>
);

export default SupervisorDashboard;
