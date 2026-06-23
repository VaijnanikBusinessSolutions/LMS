import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Search, X, Command, ArrowRight, ChevronUp, LayoutGrid } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { tabs, getSearchableItems, type TabId, type SearchableItem } from '../../constants/tileData';

const CollapsibleSearchTabs = ({ activeTab, onTabChange, onExpandChange, expanded = false }) => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchableItems = useMemo(() => getSearchableItems(), []);

  const filteredResults = useMemo(() => {
    if (!query.trim()) return [];
    const lowerQuery = query.toLowerCase();
    return searchableItems.filter(item => 
      item.name.toLowerCase().includes(lowerQuery) || item.parentTitle.toLowerCase().includes(lowerQuery)
    ).slice(0, 6);
  }, [query, searchableItems]);

  return (
    <div className="w-full">
      <AnimatePresence>
        {expanded && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.05)] mb-8">
              {/* SEARCH INPUT */}
              <div className="relative max-w-2xl mx-auto mb-8">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => { setQuery(e.target.value); setIsSearchOpen(true); }}
                  placeholder="What do you want to learn today?"
                  className="w-full pl-12 pr-12 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2 text-slate-300">
                  <Command size={14} />
                  <span className="text-xs font-bold">K</span>
                </div>

                {/* SEARCH RESULTS DROPDOWN */}
                <AnimatePresence>
                  {isSearchOpen && query && (
                    <motion.div className="absolute top-full left-0 right-0 mt-3 bg-white border border-slate-200 rounded-2xl shadow-2xl z-50 overflow-hidden">
                      {filteredResults.length > 0 ? (
                        <div className="p-2">
                          {filteredResults.map((item, idx) => (
                            <button
                              key={idx}
                              onClick={() => { navigate(item.path); onExpandChange?.(false); }}
                              className="w-full flex items-center gap-4 px-4 py-3 hover:bg-slate-50 rounded-xl text-left transition-colors group"
                            >
                              <div className="p-2 bg-slate-100 rounded-lg text-slate-500 group-hover:text-indigo-600 group-hover:bg-indigo-50">
                                <item.icon size={18} />
                              </div>
                              <div className="flex-1">
                                <p className="text-sm font-semibold text-slate-900">{item.name}</p>
                                <p className="text-xs text-slate-400">in {item.parentTitle || 'Modules'}</p>
                              </div>
                              <ArrowRight size={14} className="text-slate-300 opacity-0 group-hover:opacity-100 transition-all" />
                            </button>
                          ))}
                        </div>
                      ) : (
                        <div className="p-8 text-center text-slate-400 text-sm">No modules found matching "{query}"</div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* TABS SELECTOR */}
              <div className="flex flex-col items-center">
                <div className="h-px w-full bg-slate-100 mb-6" />
                <div className="flex flex-wrap justify-center gap-2">
                  {tabs.map((tab) => {
                    const isActive = activeTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => onTabChange(tab.id)}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold transition-all
                          ${isActive 
                            ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' 
                            : 'bg-white text-slate-500 hover:bg-slate-50 border border-slate-200'}`}
                      >
                        <tab.icon size={16} />
                        {tab.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CollapsibleSearchTabs;