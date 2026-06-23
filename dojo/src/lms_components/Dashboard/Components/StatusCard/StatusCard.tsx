
import { BookOpen, CheckCircle2, CircleCheck } from 'lucide-react';

interface StatusCardProps {
  title: string;
  value: string;
  total: number;
  color: 'orange' | 'pink' | 'green';
  progress: number;
  active: boolean;
  onClick: () => void;
}

const StatusCard = ({
  title,
  value,
  total,
  color,
  progress,
  active,
  onClick,
}: StatusCardProps) => {
  const colorMap = {
    orange: {
      stroke: '#f97316', // orange-500
      bg: 'bg-orange-50',
      text: 'text-orange-600',
      activeBorder: 'border-orange-500',
      activeShadow: 'shadow-orange-100',
      Icon: BookOpen
    },
    pink: {
      stroke: '#d946ef', // pink-600
      bg: 'bg-pink-50',
      text: 'text-pink-600',
      activeBorder: 'border-pink-500',
      activeShadow: 'shadow-pink-100',
      Icon: CheckCircle2
    },
    green: {
      stroke: '#16a34a', // green-600
      bg: 'bg-green-50',
      text: 'text-green-600',
      activeBorder: 'border-green-500',
      activeShadow: 'shadow-green-100',
      Icon: CircleCheck
    },
  };

  const theme = colorMap[color];
  const { Icon } = theme;
  const circumference = 2 * Math.PI * 36;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <button
      onClick={onClick}
      className={`w-full p-6 rounded-3xl transition-all duration-300 border-2 text-left group relative overflow-hidden
        ${active 
          ? `bg-surface ${theme.activeBorder} shadow-lg ${theme.activeShadow} scale-[1.02] z-10` 
          : 'bg-surface border-transparent hover:border-border shadow-md hover:shadow-lg'
        }`}
    >
      <div className="flex justify-between items-center relative z-10">
        {/* Left - Text */}
        <div>
          <p className="text-muted font-bold text-xs uppercase tracking-wider mb-2">{title}</p>
          <div className="flex items-baseline gap-1 mb-2">
            <span className="text-4xl font-bold text-text">{value}</span>
            <span className="text-muted text-sm font-medium">/{total}</span>
          </div>
          <p className={`text-sm font-bold ${theme.text} flex items-center gap-1`}>
            {progress}% <span className="text-muted text-xs font-normal">completed</span>
          </p>
        </div>

        {/* Right - Circular Graph */}
        <div className="relative w-20 h-20">
          <svg className="w-20 h-20 -rotate-90" viewBox="0 0 80 80">
            {/* Background circle */}
            <circle
              cx="40"
              cy="40"
              r="36"
              strokeWidth="6"
              fill="none"
              className="stroke-gray-100"
            />
            {/* Progress circle */}
            <circle
              cx="40"
              cy="40"
              r="36"
              strokeWidth="6"
              fill="none"
              stroke={theme.stroke}
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              style={{ transition: 'stroke-dashoffset 1s ease-out' }}
            />
          </svg>
          {/* Center icon */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className={`w-10 h-10 rounded-full ${theme.bg} flex items-center justify-center`}>
              <Icon size={20} className={theme.text} />
            </div>
          </div>
        </div>
      </div>
    </button>
  );
};

export default StatusCard;