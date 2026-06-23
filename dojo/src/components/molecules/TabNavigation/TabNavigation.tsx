// molecules/TabNavigation/TabNavigation.tsx
import React from 'react';
import { tabs, type TabId } from '../../constants/tileData';

interface TabNavigationProps {
  activeTab: TabId;
  onTabChange: (tabId: TabId) => void;
  className?: string;
}

const TabNavigation: React.FC<TabNavigationProps> = ({
  activeTab,
  onTabChange,
  className = '',
}) => {
  return (
    <div className={`w-full ${className}`}>
      {/* Desktop Tabs */}
      <div className="hidden md:flex items-center justify-center gap-1 p-1.5 bg-surface/50 backdrop-blur-sm rounded-2xl border border-border max-w-4xl mx-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`
                relative
                flex items-center gap-2
                px-4 py-2.5
                rounded-xl
                font-medium
                text-sm
                transition-all
                duration-200
                ${isActive 
                  ? 'bg-accent text-white shadow-lg shadow-accent/25' 
                  : 'text-text/60 hover:text-text hover:bg-surface'
                }
              `}
            >
              <Icon className="h-4 w-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Mobile Tabs - Horizontal Scroll */}
      <div className="md:hidden overflow-x-auto scrollbar-hide">
        <div className="flex items-center gap-2 px-4 pb-2 min-w-max">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`
                  flex items-center gap-2
                  px-4 py-2.5
                  rounded-xl
                  font-medium
                  text-sm
                  whitespace-nowrap
                  transition-all
                  duration-200
                  ${isActive 
                    ? 'bg-accent text-white shadow-lg shadow-accent/25' 
                    : 'bg-surface/50 text-text/60 border border-border'
                  }
                `}
              >
                <Icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Tab Description */}
      <div className="text-center mt-3">
        <p className="text-sm text-text/50">
          {tabs.find(t => t.id === activeTab)?.description}
        </p>
      </div>
    </div>
  );
};

export default TabNavigation;