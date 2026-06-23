import React, { useEffect, useState, useCallback } from "react";
import { BarChart3, Users, Target, TrendingUp } from "lucide-react";
import { KPICard } from "./KPICard";
import { FilterPanel } from "./FilterPanel";
import { ProductionTrendChart } from "./ProductionTrendChart";
import { CategoryBreakdownChart } from "./CategoryBreakdownChart";
import { LineComparisonChart } from "./LineComparisonChart";
import { PredictiveInsights } from "./PredictiveInsights";
import { EfficiencyHeatmap } from "./EfficiencyHeatmap";
import axios from "axios";
import type { FilterOptions } from "../types/production"; // adjust path as needed

// helper to get a Date N days ago
const daysAgo = (n: number) => {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d;
};

export const ProductionDashboard: React.FC = () => {
  // Local filters — ONLY IDs (strings). FilterPanel will set these IDs.
  const [filters, setFilters] = useState<FilterOptions>({
    hq: "",
    factory: "",
    department: "",
    line: "",
    subline: "",
    station: "",
    // dateRange expected to be { start: Date; end: Date; } per your types
    dateRange: { start: daysAgo(90), end: new Date() }
  });

  // Local data and analytics used by child components
  const [data, setData] = useState<any[]>([]); // historical data (chart inputs)
  const [analytics, setAnalytics] = useState({
    average: 0,
    efficiency: 0,
    trend: 0,
    totalOperators: 0,
    totalProduction: 0,
    predictions: [] as any[],
    growthRate: 0
  });
  const [loadingMetrics, setLoadingMetrics] = useState(false);

  console.log("filters:", filters);

  const getChangeType = (value: number): "increase" | "decrease" | "neutral" =>
    value > 0 ? "increase" : value < 0 ? "decrease" : "neutral";

  // Fetch metrics and data whenever filters change (debounce or guard as needed)
  useEffect(() => {
  if (!filters.department && !filters.station) return;

  const base = "http://127.0.0.1:8000";
  const endpoints = {
    avg: `${base}/average-monthly-production/`,
    eff: `${base}/production-efficiency/`,
    trend: `${base}/monthly-trend/`,
    operators: `${base}/total-operators/`,
  };

  const fetchMetricsAndData = async () => {
    setLoadingMetrics(true);
    try {
      const params = {
        hq: filters.hq,
        factory: filters.factory,
        department: filters.department,
        line: filters.line,
        subline: filters.subline,
        station: filters.station,
        start: filters.dateRange.start.toISOString(),
        end: filters.dateRange.end.toISOString(),
      };

      console.log("Fetching metrics with params:", params);

      const [avgRes, effRes, trendRes, operatorsRes] = await Promise.all([
        axios.get(endpoints.avg, { params }),
        axios.get(endpoints.eff, { params }),
        axios.get(endpoints.trend, { params }),
        axios.get(endpoints.operators, { params }),
      ]);

      // ✅ Extract only numeric values from each response
      const avgValue = avgRes.data?.average_monthly_production ?? 0;
      const effValue = effRes.data?.production_efficiency ?? 0;
      const trendValue = trendRes.data?.monthly_trend ?? 0;
      const totalOps = operatorsRes.data?.total_operators ?? 0;

      setAnalytics({
        average: avgValue,
        efficiency: effValue,
        trend: trendValue,
        totalOperators: totalOps,
        totalProduction: avgValue, // optional reuse
        predictions: [],
        growthRate: 0,
      });
    } catch (err) {
      console.error("Error fetching metrics/data:", err);
    } finally {
      setLoadingMetrics(false);
    }
  };

  fetchMetricsAndData();
}, [filters]);


  // Example: manual refresh function if you want a button to re-fetch
  const refresh = useCallback(() => {
    // trigger fetch by updating filters to same value (or you can call a fetch function)
    setFilters(f => ({ ...f }));
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 via-purple-50 to-pink-50">
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4 drop-shadow-sm">
            Production Analytics Dashboard
          </h1>
          <p className="text-xl text-slate-600 font-medium">
            Real-time insights and predictive analysis for manufacturing operations
          </p>
        </div>

        {/* Filters */}
        <FilterPanel filters={filters} onFilterChange={setFilters} />

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <KPICard
            title="Average Monthly Production"
            value={analytics.average.toLocaleString()}
            change={analytics.growthRate}
            changeType={getChangeType(analytics.growthRate)}
            icon={<BarChart3 className="w-7 h-7" />}
            suffix=" units"
          />
          <KPICard
            title="Production Efficiency"
            value={analytics.efficiency}
            change={5.2}
            changeType="increase"
            icon={<Target className="w-7 h-7" />}
            suffix=" units/operator"
          />
          <KPICard
            title="Monthly Trend"
            value={analytics.trend > 0 ? `+${analytics.trend}` : analytics.trend.toString()}
            change={analytics.average ? Math.abs((analytics.trend / analytics.average) * 100) : 0}
            changeType={getChangeType(analytics.trend)}
            icon={<TrendingUp className="w-7 h-7" />}
            suffix=" units"
          />
          <KPICard
            title="Total Operators"
            value={analytics.totalOperators}
            change={2.8}
            changeType="increase"
            icon={<Users className="w-7 h-7" />}
            suffix=" people"
          />
        </div>

        {/* Main Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ProductionTrendChart filters={filters} />
          <CategoryBreakdownChart filters={filters} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <LineComparisonChart  filters={filters} />
          <PredictiveInsights filters={filters}  />
        </div>

        {/* Efficiency Heatmap - Full Width */}
        <EfficiencyHeatmap data={data} />

        {/* Summary Statistics */}
        <div className="bg-gradient-to-r from-white/90 via-indigo-50/80 to-purple-50/80 backdrop-blur-md rounded-2xl p-8 border border-white/40 shadow-2xl">
          <h3 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-8 text-center">
            Production Summary
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent mb-3 drop-shadow-sm">
                {analytics.totalProduction.toLocaleString()}
              </div>
              <div className="text-sm font-semibold text-slate-600 uppercase tracking-wide">Total Production (Units)</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-cyan-600 bg-clip-text text-transparent mb-3 drop-shadow-sm">
                {data.length}
              </div>
              <div className="text-sm font-semibold text-slate-600 uppercase tracking-wide">Months Analyzed</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent mb-3 drop-shadow-sm">
                {analytics.predictions.length}
              </div>
              <div className="text-sm font-semibold text-slate-600 uppercase tracking-wide">Months Forecasted</div>
            </div>
          </div>
        </div>

        {/* small refresh and loading indicator */}
        <div className="flex items-center justify-between">
          <div>
            <button
              onClick={refresh}
              className="px-4 py-2 rounded-md bg-indigo-600 text-white shadow hover:bg-indigo-700 transition"
            >
              Refresh
            </button>
          </div>
          <div className="text-sm text-slate-500">
            {loadingMetrics ? "Updating metrics..." : "Metrics up-to-date"}
          </div>
        </div>
      </div>
    </div>
  );
}; 