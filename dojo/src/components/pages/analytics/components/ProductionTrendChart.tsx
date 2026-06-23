import React, { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import axios from 'axios';
import type { FilterOptions } from '../types/production';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface HistoricalData {
  month: string;
  total: number;
}

interface ForecastData {
  month: string;
  predicted_total: number;
}

interface ForecastResponse {
  average_growth_rate: number;
  historical_data: HistoricalData[];
  forecast_next_6_months: ForecastData[];
}

interface ProductionTrendChartProps {
  filters: FilterOptions;
}

export const ProductionTrendChart: React.FC<ProductionTrendChartProps> = ({ filters }) => {
  const [forecastData, setForecastData] = useState<ForecastResponse | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchForecastData = async () => {
      if (!filters.department && !filters.station) return;

      setLoading(true);
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

        const response = await axios.get<ForecastResponse>(
          'http://127.0.0.1:8000/average-growth-forecast/',
          { params }
        );

        setForecastData(response.data);
      } catch (err) {
        console.error('Error fetching forecast data:', err);
        setForecastData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchForecastData();
  }, [filters]);

  if (!forecastData) {
    const emptyData = {
      labels: [],
      datasets: []
    };

    return (
      <div className="bg-gradient-to-br from-white/90 to-indigo-50/80 backdrop-blur-md rounded-2xl p-6 border border-white/40 shadow-2xl">
        <h3 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-6">
          Production Trend & Forecast
        </h3>
        <div className="h-80 flex items-center justify-center">
          <div className="text-slate-400">
            {loading ? 'Loading forecast data...' : 'No forecast data available'}
          </div>
        </div>
      </div>
    );
  }

  const historicalLabels = forecastData.historical_data.map(d => d.month);
  const forecastLabels = forecastData.forecast_next_6_months.map(f => f.month);
  const allLabels = [...historicalLabels, ...forecastLabels];

  const historicalValues = forecastData.historical_data.map(d => d.total);
  const forecastValues = forecastData.forecast_next_6_months.map(f => f.predicted_total);
  
  // Create arrays with null values for non-overlapping data points
  const allHistoricalValues = [...historicalValues, ...new Array(forecastLabels.length).fill(null)];
  const allForecastValues = [...new Array(historicalLabels.length).fill(null), ...forecastValues];

  const data = {
    labels: allLabels,
    datasets: [
      {
        label: 'Historical Production',
        data: allHistoricalValues,
        borderColor: '#6366f1',
        backgroundColor: 'rgba(99, 102, 241, 0.15)',
        borderWidth: 4,
        pointBackgroundColor: '#6366f1',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 3,
        pointRadius: 8,
        fill: true,
        tension: 0.4,
        pointHoverRadius: 10,
        pointHoverBorderWidth: 4
      },
      {
        label: 'Predicted Production',
        data: allForecastValues,
        borderColor: '#ec4899',
        backgroundColor: 'rgba(236, 72, 153, 0.15)',
        borderWidth: 4,
        borderDash: [5, 5],
        pointBackgroundColor: '#ec4899',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 3,
        pointRadius: 8,
        fill: true,
        tension: 0.4,
        pointHoverRadius: 10,
        pointHoverBorderWidth: 4
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            family: 'Inter, sans-serif',
            size: 12
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.95)',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        borderColor: '#6366f1',
        borderWidth: 2,
        cornerRadius: 12,
        displayColors: true,
        callbacks: {
          label: function(context: any) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += context.parsed.y.toFixed(2) + ' units';
            }
            return label;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(148, 163, 184, 0.2)',
        },
        ticks: {
          font: {
            family: 'Inter, sans-serif'
          }
        }
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: {
            family: 'Inter, sans-serif'
          }
        }
      }
    },
    interaction: {
      intersect: false,
      mode: 'index' as const,
    }
  };

  return (
    <div className="bg-gradient-to-br from-white/90 to-indigo-50/80 backdrop-blur-md rounded-2xl p-6 border border-white/40 shadow-2xl">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          Production Trend & Forecast
        </h3>
        <div className="text-sm font-semibold text-slate-600">
          Avg Growth: <span className="text-emerald-600">{forecastData.average_growth_rate.toFixed(2)}%</span>
        </div>
      </div>
      <div className="h-80">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-slate-400">Loading forecast data...</div>
          </div>
        ) : (
          <Line data={data} options={options} />
        )}
      </div>
    </div>
  );
};