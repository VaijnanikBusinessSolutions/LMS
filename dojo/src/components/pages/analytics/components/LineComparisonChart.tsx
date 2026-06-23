import React, { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import axios from 'axios';
import type { FilterOptions } from '../types/production';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface LinePerformanceData {
  line: string;
  CTQ: number;
  PDI: number;
  OTHER: number;
}

interface LineComparisonChartProps {
  filters: FilterOptions;
}

export const LineComparisonChart: React.FC<LineComparisonChartProps> = ({ filters }) => {
  const [lineData, setLineData] = useState<LinePerformanceData[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchLinePerformance = async () => {
      // Only fetch if we have at least department selected
      if (!filters.department) return;

      setLoading(true);
      try {
        const params = {
          hq: filters.hq,
          factory: filters.factory,
          department: filters.department,
          start: filters.dateRange.start.toISOString(),
          end: filters.dateRange.end.toISOString(),
        };

        const response = await axios.get<LinePerformanceData[]>(
          'http://127.0.0.1:8000/line-performance-comparison/',
          { params }
        );

        setLineData(response.data || []);
      } catch (err) {
        console.error('Error fetching line performance:', err);
        setLineData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchLinePerformance();
  }, [filters]);

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-white/90 to-pink-50/80 backdrop-blur-md rounded-2xl p-6 border border-white/40 shadow-2xl">
        <h3 className="text-xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-6">
          Line Performance Comparison
        </h3>
        <div className="h-80 flex items-center justify-center">
          <div className="text-slate-400">Loading line performance data...</div>
        </div>
      </div>
    );
  }

  if (lineData.length === 0) {
    return (
      <div className="bg-gradient-to-br from-white/90 to-pink-50/80 backdrop-blur-md rounded-2xl p-6 border border-white/40 shadow-2xl">
        <h3 className="text-xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-6">
          Line Performance Comparison
        </h3>
        <div className="h-80 flex items-center justify-center">
          <div className="text-slate-400">No line performance data available</div>
        </div>
      </div>
    );
  }

  const labels = lineData.map(d => d.line);
  const ctqData = lineData.map(d => d.CTQ);
  const pdiData = lineData.map(d => d.PDI);
  const otherData = lineData.map(d => d.OTHER);
  
  const chartData = {
    labels,
    datasets: [
      {
        label: 'CTQ',
        data: ctqData,
        backgroundColor: 'rgba(99, 102, 241, 0.9)',
        borderColor: '#6366f1',
        borderWidth: 2,
        borderRadius: 8,
        borderSkipped: false,
      },
      {
        label: 'PDI',
        data: pdiData,
        backgroundColor: 'rgba(6, 182, 212, 0.9)',
        borderColor: '#06b6d4',
        borderWidth: 2,
        borderRadius: 8,
        borderSkipped: false,
      },
      {
        label: 'OTHER',
        data: otherData,
        backgroundColor: 'rgba(236, 72, 153, 0.9)',
        borderColor: '#ec4899',
        borderWidth: 2,
        borderRadius: 8,
        borderSkipped: false,
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
        callbacks: {
          label: function(context: any) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += context.parsed.y.toLocaleString() + ' units';
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
    }
  };

  return (
    <div className="bg-gradient-to-br from-white/90 to-pink-50/80 backdrop-blur-md rounded-2xl p-6 border border-white/40 shadow-2xl">
      <h3 className="text-xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-6">
        Line Performance Comparison
      </h3>
      <div className="h-80">
        <Bar data={chartData} options={options} />
      </div>
    </div>
  );
};