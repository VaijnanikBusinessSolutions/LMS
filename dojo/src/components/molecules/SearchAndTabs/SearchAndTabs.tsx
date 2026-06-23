// molecules/SearchAndTabs/SearchAndTabs.tsx
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Search, X, Command, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { tabs, getSearchableItems, type TabId, type SearchableItem } from '../../constants/tileData';

interface SearchAndTabsProps {
  activeTab: TabId;
  onTabChange: (tabId: TabId) => void;
  className?: string;
}

const SearchAndTabs: React.FC<SearchAndTabsProps> = ({
  activeTab,
  onTabChange,
  className = '',
}) => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const searchableItems = useMemo(() => getSearchableItems(), []);

  const filteredResults = useMemo(() => {
    if (!query.trim()) return [];
    
    const lowerQuery = query.toLowerCase();
    return searchableItems
      .filter(item => 
        item.name.toLowerCase().includes(lowerQuery) ||
        item.parentTitle.toLowerCase().includes(lowerQuery)
      )
      .slice(0, 8);
  }, [query, searchableItems]);

  // Keyboard shortcut (Cmd+K or Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
        setIsOpen(true);
      }
      
      if (e.key === 'Escape') {
        setIsOpen(false);
        setQuery('');
        inputRef.current?.blur();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Arrow keys and enter
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen || filteredResults.length === 0) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < filteredResults.length - 1 ? prev + 1 : 0
        );
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => 
          prev > 0 ? prev - 1 : filteredResults.length - 1
        );
      } else if (e.key === 'Enter' && filteredResults[selectedIndex]) {
        e.preventDefault();
        handleSelect(filteredResults[selectedIndex]);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredResults, selectedIndex]);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (item: SearchableItem) => {
    if (item.path) {
      navigate(item.path);
      setQuery('');
      setIsOpen(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setSelectedIndex(0);
    if (e.target.value) {
      setIsOpen(true);
    }
  };

  const clearSearch = () => {
    setQuery('');
    setSelectedIndex(0);
    inputRef.current?.focus();
  };

  return (
    <div className={`w-full ${className}`}>
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-12 xl:px-20">
        
        {/* Search Bar */}
        <div ref={containerRef} className="relative w-full max-w-2xl mx-auto mb-6">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-text/40" />
            </div>
            
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={handleInputChange}
              onFocus={() => query && setIsOpen(true)}
              placeholder="Search modules, pages, actions..."
              className="
                w-full
                pl-12 pr-24 py-3.5
                bg-surface
                border border-border
                rounded-xl
                text-text
                placeholder:text-text/40
                focus:outline-none
                focus:ring-2
                focus:ring-accent/50
                focus:border-accent/50
                transition-all
                duration-200
                shadow-sm
              "
            />
            
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 gap-2">
              {query && (
                <button
                  onClick={clearSearch}
                  className="p-1.5 rounded-lg hover:bg-background text-text/40 hover:text-text transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
              
              <div className="hidden sm:flex items-center gap-1 px-2 py-1 rounded-lg bg-background border border-border text-text/40 text-xs font-medium">
                <Command className="h-3 w-3" />
                <span>K</span>
              </div>
            </div>
          </div>

          {/* Search Results Dropdown */}
          {isOpen && filteredResults.length > 0 && (
            <div className="
              absolute
              top-full
              left-0
              right-0
              mt-2
              bg-surface
              border border-border
              rounded-xl
              shadow-2xl
              overflow-hidden
              z-50
            ">
              <div className="p-2">
                {filteredResults.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={`${item.path}-${index}`}
                      onClick={() => handleSelect(item)}
                      className={`
                        w-full
                        flex items-center gap-3
                        px-3 py-2.5
                        rounded-lg
                        text-left
                        transition-colors
                        ${selectedIndex === index 
                          ? 'bg-accent/10 text-accent' 
                          : 'text-text hover:bg-background'
                        }
                      `}
                    >
                      <div className={`
                        p-2 rounded-lg
                        ${selectedIndex === index 
                          ? 'bg-accent/20' 
                          : 'bg-background'
                        }
                      `}>
                        <Icon className="h-4 w-4" />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{item.name}</p>
                        {item.parentTitle && (
                          <p className="text-xs text-text/50 truncate">
                            in {item.parentTitle}
                          </p>
                        )}
                      </div>
                      
                      <ArrowRight className={`
                        h-4 w-4 flex-shrink-0
                        ${selectedIndex === index ? 'opacity-100' : 'opacity-0'}
                        transition-opacity
                      `} />
                    </button>
                  );
                })}
              </div>
              
              <div className="px-4 py-2 border-t border-border bg-background/50">
                <p className="text-xs text-text/40">
                  <span className="font-medium">↑↓</span> navigate · 
                  <span className="font-medium ml-2">↵</span> select · 
                  <span className="font-medium ml-2">esc</span> close
                </p>
              </div>
            </div>
          )}

          {/* No Results */}
          {isOpen && query && filteredResults.length === 0 && (
            <div className="
              absolute
              top-full
              left-0
              right-0
              mt-2
              bg-surface
              border border-border
              rounded-xl
              shadow-2xl
              p-6
              text-center
              z-50
            ">
              <Search className="h-8 w-8 text-text/20 mx-auto mb-2" />
              <p className="text-text/60 font-medium">No results found</p>
              <p className="text-text/40 text-sm mt-1">Try a different search term</p>
            </div>
          )}
        </div>

        {/* Tab Navigation */}
        <div className="w-full">
          {/* Desktop Tabs */}
          <div className="hidden md:flex items-center justify-center gap-1 p-1.5 bg-surface/80 backdrop-blur-sm rounded-2xl border border-border max-w-5xl mx-auto shadow-sm">
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
                      ? 'bg-gradient-to-r from-yellow-500 to-amber-600 text-white shadow-lg shadow-yellow-500/25' 
                      : 'text-text/60 hover:text-text hover:bg-background'
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
          <div className="md:hidden overflow-x-auto scrollbar-hide -mx-4 px-4">
            <div className="flex items-center gap-2 pb-2 min-w-max">
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
                        ? 'bg-gradient-to-r from-yellow-500 to-amber-600 text-white shadow-lg shadow-yellow-500/25' 
                        : 'bg-surface text-text/60 border border-border'
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
          <div className="text-center mt-4">
            <p className="text-sm text-text/50">
              {tabs.find(t => t.id === activeTab)?.description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchAndTabs;