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

interface CategoryData {
  month: string;
  CTQ: number;
  PDI: number;
  OTHER: number;
  TOTAL: number;
}

interface CategoryBreakdownChartProps {
  filters: FilterOptions;
}

export const CategoryBreakdownChart: React.FC<CategoryBreakdownChartProps> = ({ filters }) => {
  const [data, setData] = useState<CategoryData[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCategoryData = async () => {
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

        const response = await axios.get<CategoryData[]>(
          'http://127.0.0.1:8000/production-category-breakdown/',
          { params }
        );

        setData(response.data || []);
      } catch (err) {
        console.error('Error fetching category breakdown:', err);
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryData();
  }, [filters]);

  const labels = data.map(d => d.month);
  
  const ctqData = data.map(d => d.CTQ);
  const pdiData = data.map(d => d.PDI);
  const otherData = data.map(d => d.OTHER);

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
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        stacked: true,
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
        stacked: true,
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
    <div className="bg-gradient-to-br from-white/90 to-cyan-50/80 backdrop-blur-md rounded-2xl p-6 border border-white/40 shadow-2xl">
      <h3 className="text-xl font-bold bg-gradient-to-r from-cyan-600 to-indigo-600 bg-clip-text text-transparent mb-6">
        Production Category Breakdown
      </h3>
      <div className="h-80">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-slate-400">Loading category data...</div>
          </div>
        ) : data.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-slate-400">No category data available</div>
          </div>
        ) : (
          <Bar data={chartData} options={options} />
        )}
      </div>
    </div>
  );
};