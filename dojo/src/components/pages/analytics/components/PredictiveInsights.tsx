import React, { useEffect, useState } from 'react';
import { Calendar, Target, TrendingUp, AlertCircle } from 'lucide-react';
import axios from 'axios';
import type { FilterOptions } from '../types/production';

interface ForecastData {
  month: string;
  predicted_total: number;
}

interface ForecastResponse {
  average_growth_rate: number;
  historical_data: Array<{ month: string; total: number }>;
  forecast_next_6_months: ForecastData[];
}

interface PredictiveInsightsProps {
  filters: FilterOptions;
}

export const PredictiveInsights: React.FC<PredictiveInsightsProps> = ({ filters }) => {
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

  // Calculate confidence based on growth rate consistency and data availability
  const calculateConfidence = (index: number, growthRate: number, historicalLength: number): number => {
    // Base confidence starts at 85%
    let confidence = 85;
    
    // Reduce confidence for predictions further in the future
    confidence -= index * 3;
    
    // Adjust based on growth rate (more extreme growth = less confidence)
    const absGrowthRate = Math.abs(growthRate);
    if (absGrowthRate > 20) confidence -= 10;
    else if (absGrowthRate > 10) confidence -= 5;
    
    // Adjust based on historical data availability
    if (historicalLength < 3) confidence -= 15;
    else if (historicalLength < 6) confidence -= 5;
    
    return Math.max(50, Math.min(95, confidence));
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return 'text-emerald-700 bg-gradient-to-r from-emerald-100 to-emerald-200 border-emerald-300';
    if (confidence >= 60) return 'text-amber-700 bg-gradient-to-r from-amber-100 to-amber-200 border-amber-300';
    return 'text-rose-700 bg-gradient-to-r from-rose-100 to-rose-200 border-rose-300';
  };

  const getConfidenceIcon = (confidence: number) => {
    if (confidence >= 80) return <Target className="w-4 h-4 drop-shadow-sm" />;
    if (confidence >= 60) return <TrendingUp className="w-4 h-4 drop-shadow-sm" />;
    return <AlertCircle className="w-4 h-4 drop-shadow-sm" />;
  };

  return (
    <div className="bg-gradient-to-br from-white/90 to-violet-50/80 backdrop-blur-md rounded-2xl p-6 border border-white/40 shadow-2xl overflow-hidden">
      <h3 className="text-xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent mb-6 flex items-center">
        <Calendar className="w-6 h-6 mr-3 text-violet-600 drop-shadow-sm" />
        Predictive Insights
      </h3>
      
      <div className="space-y-4 max-h-96 overflow-y-auto overflow-x-hidden pr-2">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="text-slate-400">Loading insights...</div>
          </div>
        ) : !forecastData || forecastData.forecast_next_6_months.length === 0 ? (
          <div className="flex items-center justify-center py-8">
            <div className="text-slate-400">No forecast data available</div>
          </div>
        ) : (
          <>
            {/* Growth Rate Summary */}
            <div className="p-4 bg-gradient-to-r from-indigo-50/80 to-purple-50/80 rounded-xl border border-indigo-200/50">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-slate-700">Average Growth Rate</span>
                <span className={`text-lg font-bold ${forecastData.average_growth_rate >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {forecastData.average_growth_rate >= 0 ? '+' : ''}{forecastData.average_growth_rate.toFixed(2)}%
                </span>
              </div>
            </div>

            {/* Forecast Items */}
            {forecastData.forecast_next_6_months.map((forecast, index) => {
              const confidence = calculateConfidence(
                index,
                forecastData.average_growth_rate,
                forecastData.historical_data.length
              );

              return (
                <div 
                  key={index}
                  className="flex items-center justify-between p-5 bg-gradient-to-r from-white/80 to-slate-50/80 rounded-xl hover:from-white/90 hover:to-slate-50/90 transition-all duration-300 border border-slate-200/50 hover:shadow-lg"
                >
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-slate-900 truncate">
                      {forecast.month}
                    </h4>
                    <p className="text-sm text-slate-600 font-medium truncate">
                      Predicted: {forecast.predicted_total.toFixed(2)} units
                    </p>
                  </div>
                  
                  <div className={`flex items-center px-4 py-2 rounded-full text-sm font-semibold border shadow-sm flex-shrink-0 ml-3 ${getConfidenceColor(confidence)}`}>
                    {getConfidenceIcon(confidence)}
                    <span className="ml-1 whitespace-nowrap">{confidence}%</span>
                  </div>
                </div>
              );
            })}
          </>
        )}
      </div>
    </div>
  );
};