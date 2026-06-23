// atoms/QuickLinkCard/QuickLinkCard.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, type LucideIcon } from 'lucide-react';

interface QuickLinkCardProps {
  name: string;
  path: string;
  icon: LucideIcon;
  description: string;
  color: string;
}

const QuickLinkCard: React.FC<QuickLinkCardProps> = ({
  name,
  path,
  icon: Icon,
  description,
  color,
}) => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(path)}
      className="
        group
        relative
        w-full
        p-5
        bg-surface
        border border-border
        rounded-2xl
        text-left
        overflow-hidden
        transition-all
        duration-300
        hover:border-accent/30
        hover:shadow-xl
        hover:shadow-accent/5
        hover:-translate-y-1
      "
    >
      {/* Background Gradient on Hover */}
      <div className={`
        absolute
        inset-0
        bg-gradient-to-br ${color}
        opacity-0
        group-hover:opacity-5
        transition-opacity
        duration-300
      `} />
      
      {/* Content */}
      <div className="relative flex items-start gap-4">
        {/* Icon */}
        <div className={`
          flex-shrink-0
          p-3
          rounded-xl
          bg-gradient-to-br ${color}
          text-white
          shadow-lg
          group-hover:scale-110
          transition-transform
          duration-300
        `}>
          <Icon className="h-5 w-5" />
        </div>
        
        {/* Text */}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-text group-hover:text-accent transition-colors">
            {name}
          </h3>
          <p className="text-sm text-text/50 mt-1 line-clamp-2">
            {description}
          </p>
        </div>
        
        {/* Arrow */}
        <ArrowRight className="
          h-5 w-5
          text-text/20
          group-hover:text-accent
          group-hover:translate-x-1
          transition-all
          duration-300
          flex-shrink-0
          mt-1
        " />
      </div>
    </button>
  );
};

export default QuickLinkCard;