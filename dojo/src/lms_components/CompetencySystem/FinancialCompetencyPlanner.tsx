import React, { useState } from 'react';
import { 
  Calendar, ChevronDown, Filter, Layout, DollarSign, 
  TrendingUp, Plus, Clock, ChevronRight 
} from 'lucide-react';

// ==========================================
// 1. DATA & TYPES
// ==========================================

type ViewMode = 'Financial Year' | 'Calendar Year' | 'Half Yearly' | 'Quarterly';

interface Event {
  id: string;
  title: string;
  budget: number;
  status: 'completed' | 'progress' | 'scheduled' | 'pending';
}

// Single Source of Truth for Data
const YEAR_DATA: Record<string, Event[]> = {
  jan: [{ id: '1', title: 'New Year Kickoff', budget: 2000, status: 'completed' }],
  feb: [{ id: '2', title: 'Data Science', budget: 15000, status: 'progress' }],
  mar: [{ id: '3', title: 'Q4 Closure', budget: 0, status: 'pending' }],
  apr: [{ id: '4', title: 'Python Basics', budget: 5000, status: 'completed' }],
  may: [{ id: '5', title: 'Leadership 101', budget: 3000, status: 'completed' }],
  jun: [],
  jul: [{ id: '6', title: 'AWS Architect', budget: 12000, status: 'progress' }],
  aug: [],
  sep: [{ id: '7', title: 'Security Audit', budget: 8000, status: 'pending' }],
  oct: [{ id: '8', title: 'React Summit', budget: 4000, status: 'scheduled' }],
  nov: [{ id: '9', title: 'Agile Workshop', budget: 2500, status: 'scheduled' }],
  dec: [{ id: '10', title: 'Holiday Freeze', budget: 0, status: 'pending' }],
};

const MONTH_NAMES: Record<string, string> = {
  jan: 'January', feb: 'February', mar: 'March', apr: 'April', may: 'May', jun: 'June',
  jul: 'July', aug: 'August', sep: 'September', oct: 'October', nov: 'November', dec: 'December'
};

// Helper to get color
const getStatusColor = (status: string) => {
  switch(status) {
    case 'completed': return 'bg-green-100 text-green-700 border-green-200';
    case 'progress': return 'bg-blue-100 text-blue-700 border-blue-200';
    case 'scheduled': return 'bg-purple-100 text-purple-700 border-purple-200';
    default: return 'bg-gray-100 text-gray-500 border-gray-200';
  }
};

// ==========================================
// 2. SUB-LAYOUTS (The "Different Manners")
// ==========================================

// --- VIEW A: FINANCIAL YEAR (2x2 Grid of Quarters) ---
const FinancialLayout = () => {
  const quarters = [
    { name: 'Q1 (Apr - Jun)', keys: ['apr', 'may', 'jun'] },
    { name: 'Q2 (Jul - Sep)', keys: ['jul', 'aug', 'sep'] },
    { name: 'Q3 (Oct - Dec)', keys: ['oct', 'nov', 'dec'] },
    { name: 'Q4 (Jan - Mar)', keys: ['jan', 'feb', 'mar'] },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in">
      {quarters.map((q) => (
        <div key={q.name} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="bg-slate-50 px-4 py-3 border-b border-slate-100 font-bold text-slate-700 flex justify-between">
            {q.name}
            <span className="text-xs bg-white border px-2 py-0.5 rounded text-slate-500">Quarter View</span>
          </div>
          <div className="grid grid-cols-3 divide-x divide-slate-100">
            {q.keys.map(m => (
              <div key={m} className="p-3 min-h-[150px] hover:bg-slate-50 transition-colors">
                <p className="text-xs font-bold text-slate-400 uppercase mb-2">{MONTH_NAMES[m]}</p>
                {YEAR_DATA[m].map(e => (
                  <div key={e.id} className={`text-[10px] p-1.5 rounded mb-1 border ${getStatusColor(e.status)}`}>
                    <div className="font-bold truncate">{e.title}</div>
                    <div>${e.budget}</div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

// --- VIEW B: HALF YEARLY (Split Screen H1 vs H2) ---
const HalfYearLayout = () => {
  const halves = [
    { name: 'First Half (H1)', sub: 'April - September', keys: ['apr', 'may', 'jun', 'jul', 'aug', 'sep'], color: 'border-blue-500' },
    { name: 'Second Half (H2)', sub: 'October - March', keys: ['oct', 'nov', 'dec', 'jan', 'feb', 'mar'], color: 'border-purple-500' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in">
      {halves.map(half => (
        <div key={half.name} className={`bg-white rounded-2xl border-t-8 shadow-sm border-x border-b border-slate-200 ${half.color}`}>
          <div className="p-6 border-b border-slate-100">
            <h2 className="text-2xl font-bold text-slate-800">{half.name}</h2>
            <p className="text-slate-500">{half.sub}</p>
          </div>
          <div className="p-4 space-y-4">
            {half.keys.map(m => (
              <div key={m} className="flex items-start gap-4 p-3 rounded-lg hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-all">
                <div className="w-24 shrink-0 font-bold text-slate-600 pt-1">{MONTH_NAMES[m]}</div>
                <div className="flex-1 space-y-2">
                  {YEAR_DATA[m].length > 0 ? YEAR_DATA[m].map(e => (
                    <div key={e.id} className="flex justify-between items-center bg-white border border-slate-200 p-2 rounded shadow-sm text-sm">
                      <span className="font-medium text-slate-700">{e.title}</span>
                      <span className="font-mono text-xs text-slate-500">${e.budget}</span>
                    </div>
                  )) : (
                    <div className="h-8 border border-dashed border-slate-200 rounded flex items-center justify-center text-xs text-slate-300">No events</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

// --- VIEW C: CALENDAR YEAR (12 Month Wall Calendar) ---
const CalendarYearLayout = () => {
  const months = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
  
  return (
    <div className="animate-in fade-in">
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {months.map(m => (
          <div key={m} className="bg-white border border-slate-200 rounded-lg p-4 min-h-[160px] hover:shadow-md transition-shadow flex flex-col">
            <div className="flex justify-between items-center mb-3 pb-2 border-b border-slate-100">
              <span className="font-bold text-slate-800">{MONTH_NAMES[m]}</span>
              <span className="text-[10px] text-slate-400">2024</span>
            </div>
            <div className="flex-1 space-y-2">
              {YEAR_DATA[m].map(e => (
                <div key={e.id} className={`text-xs p-2 rounded-md border-l-2 ${getStatusColor(e.status).replace('border', 'border-l')}`}>
                   <div className="font-semibold">{e.title}</div>
                   <div className="text-[10px] opacity-75 mt-0.5">${e.budget}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- VIEW D: QUARTERLY TABS (Drill Down) ---
const QuarterlyLayout = () => {
  const [activeTab, setActiveTab] = useState(0);
  const quarters = [
    { id: 0, label: 'Quarter 1', keys: ['apr', 'may', 'jun'] },
    { id: 1, label: 'Quarter 2', keys: ['jul', 'aug', 'sep'] },
    { id: 2, label: 'Quarter 3', keys: ['oct', 'nov', 'dec'] },
    { id: 3, label: 'Quarter 4', keys: ['jan', 'feb', 'mar'] },
  ];

  return (
    <div className="animate-in fade-in bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      {/* Tabs */}
      <div className="flex border-b border-slate-200 bg-slate-50">
        {quarters.map((q) => (
          <button
            key={q.id}
            onClick={() => setActiveTab(q.id)}
            className={`flex-1 py-4 text-sm font-bold transition-all ${activeTab === q.id ? 'bg-white text-blue-600 border-t-4 border-t-blue-600' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100'}`}
          >
            {q.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
        {quarters[activeTab].keys.map(m => (
          <div key={m} className="bg-slate-50 rounded-xl p-6 border border-slate-200 relative group">
             <h3 className="text-xl font-bold text-slate-800 mb-6 border-b border-slate-200 pb-2">{MONTH_NAMES[m]}</h3>
             <div className="space-y-4">
                {YEAR_DATA[m].length > 0 ? YEAR_DATA[m].map(e => (
                  <div key={e.id} className="bg-white p-4 rounded-lg shadow-sm border border-slate-200 flex flex-col gap-2">
                     <div className="flex justify-between items-start">
                        <span className="font-bold text-slate-700">{e.title}</span>
                        <span className={`w-2 h-2 rounded-full ${getStatusColor(e.status).split(' ')[0].replace('bg-', 'bg-')}`}></span>
                     </div>
                     <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                        <div className={`h-full w-2/3 ${getStatusColor(e.status).split(' ')[0].replace('100', '500')}`}></div>
                     </div>
                     <div className="text-xs text-slate-500 text-right">Budget: ${e.budget}</div>
                  </div>
                )) : (
                  <div className="text-center py-10 text-slate-400 italic">No events scheduled</div>
                )}
             </div>
             <button className="absolute top-6 right-6 p-2 bg-white rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity text-blue-600 hover:bg-blue-50">
               <Plus size={18} />
             </button>
          </div>
        ))}
      </div>
    </div>
  );
};

// ==========================================
// 3. MAIN COMPONENT (The Controller)
// ==========================================

const FinancialCompetencyPlanner = () => {
  const [currentView, setCurrentView] = useState<ViewMode>('Financial Year');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 p-8 font-sans text-slate-900">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-2">
            <Layout className="text-blue-600" /> Competency Planner
          </h1>
          <p className="text-slate-500 mt-1">Visualize budget and training schedules.</p>
        </div>

        {/* View Switcher Dropdown */}
        <div className="relative z-50">
          <button 
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-3 bg-white border border-slate-300 px-5 py-3 rounded-lg font-bold text-slate-700 shadow-sm hover:shadow-md transition-all min-w-[200px] justify-between"
          >
            <div className="flex items-center gap-2">
              {currentView === 'Calendar Year' ? <Calendar size={18} /> : 
               currentView === 'Half Yearly' ? <TrendingUp size={18} /> : 
               <DollarSign size={18} />}
              {currentView}
            </div>
            <ChevronDown size={16} className={`transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
          </button>
          
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-60 bg-white border border-slate-100 rounded-xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95">
              {['Financial Year', 'Half Yearly', 'Calendar Year', 'Quarterly'].map((view) => (
                <button
                  key={view}
                  onClick={() => { setCurrentView(view as ViewMode); setIsDropdownOpen(false); }}
                  className={`w-full text-left px-4 py-3 text-sm font-medium hover:bg-slate-50 flex items-center justify-between group ${currentView === view ? 'bg-blue-50 text-blue-700' : 'text-slate-600'}`}
                >
                  {view}
                  {currentView === view && <ChevronRight size={14} className="text-blue-600"/>}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Render the specific layout based on selection */}
      <div className="min-h-[500px]">
        {currentView === 'Financial Year' && <FinancialLayout />}
        {currentView === 'Half Yearly' && <HalfYearLayout />}
        {currentView === 'Calendar Year' && <CalendarYearLayout />}
        {currentView === 'Quarterly' && <QuarterlyLayout />}
      </div>

    </div>
  );
};

export default FinancialCompetencyPlanner;