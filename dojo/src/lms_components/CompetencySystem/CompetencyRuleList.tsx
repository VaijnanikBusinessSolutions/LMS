import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Building, Users, Briefcase, Calendar, 
  Trash2, Search, Loader2, Edit, 
  ChevronDown, ChevronUp, Layers, ArrowRight,
  PlusCircle, MapPin, LayoutGrid, Building2, Globe
} from 'lucide-react';

// ==========================================
// 1. TYPES & INTERFACES
// ==========================================

interface RuleCompetency {
  id: number;
  category_name: string; 
  target_level: number;
}

// Matches new Serializer Output
interface HierarchyDetails {
  hq: string | null;
  bu: string | null;
  dept: string | null;
  section: string | null;
}

interface CompetencyRule {
  id: number;
  name: string;
  financial_year: string;
  department: string;
  group_name: string | null;
  designation: string | null;
  created_at: string;
  rule_competencies: RuleCompetency[];
  hierarchy_details: HierarchyDetails; // <--- NEW FIELD
}

const API_BASE = 'http://127.0.0.1:8000/lms';

const getAuthHeaders = (): Record<string, string> => {
  try {
    const authData = localStorage.getItem("auth");
    const token = authData ? JSON.parse(authData).accessToken : "";
    if (token) return { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` };
    return { 'Content-Type': 'application/json' };
  } catch (e) { return { 'Content-Type': 'application/json' }; }
};

const CompetencyRuleList: React.FC = () => {
  const navigate = useNavigate();
  
  const [rules, setRules] = useState<CompetencyRule[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedRuleId, setExpandedRuleId] = useState<number | null>(null);

  const fetchRules = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/rules/`, { headers: getAuthHeaders() });
      if (response.ok) {
        setRules(await response.json());
      }
    } catch (error) { console.error("Failed to fetch rules", error); } 
    finally { setLoading(false); }
  };

  useEffect(() => { fetchRules(); }, []);

  const handleDelete = async (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!window.confirm("Are you sure? This will delete the rule permanently.")) return;
    try {
      const response = await fetch(`${API_BASE}/rules/${id}/`, { method: 'DELETE', headers: getAuthHeaders() });
      if (response.ok) setRules(prev => prev.filter(r => r.id !== id));
      else alert("Failed to delete rule.");
    } catch (error) { console.error("Delete error", error); }
  };

  const handleEdit = (rule: CompetencyRule, e: React.MouseEvent) => {
    e.stopPropagation();
    navigate('/lms/competency/rules', { 
      state: { 
        isEditMode: true,
        department: rule.department,
        groupName: rule.group_name, 
        designation: rule.designation 
      } 
    });
  };

  const getLevelBadge = (level: number) => {
    switch (level) {
      case 1: return "bg-slate-100 text-slate-600 border-slate-200";
      case 2: return "bg-blue-50 text-blue-700 border-blue-200";
      case 3: return "bg-indigo-50 text-indigo-700 border-indigo-200";
      case 4: return "bg-purple-50 text-purple-700 border-purple-200";
      case 5: return "bg-emerald-50 text-emerald-700 border-emerald-200";
      default: return "bg-gray-100 text-gray-600";
    }
  };

  const filteredRules = useMemo(() => {
    const lowerSearch = searchTerm.toLowerCase();
    return rules.filter(r => 
      r.department.toLowerCase().includes(lowerSearch) ||
      (r.group_name && r.group_name.toLowerCase().includes(lowerSearch)) ||
      (r.designation && r.designation.toLowerCase().includes(lowerSearch))
    );
  }, [rules, searchTerm]);

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-10 font-sans text-slate-900 animate-in fade-in duration-500">
      
      {/* HEADER */}
      <div className="max-w-6xl mx-auto mb-8 flex flex-col md:flex-row justify-between items-end gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Competency Rules</h1>
          <p className="text-slate-500 mt-2 font-medium">View and manage target competency levels.</p>
        </div>
        <button onClick={() => navigate('/lms/competency/rules')} className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-indigo-500/20 transition-all flex items-center gap-2 transform active:scale-95">
          <PlusCircle size={20} /> Create New Rule
        </button>
      </div>

      {/* SEARCH */}
      <div className="max-w-6xl mx-auto mb-8 bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
        <div className="bg-slate-100 p-2 rounded-lg text-slate-500"><Search size={20} /></div>
        <input type="text" placeholder="Search by Dept, Group, or Role..." className="flex-1 bg-transparent outline-none font-medium text-slate-700" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
      </div>

      {/* LIST */}
      <div className="max-w-6xl mx-auto grid gap-6">
        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="w-10 h-10 text-indigo-600 animate-spin" /></div>
        ) : filteredRules.length === 0 ? (
          <div className="text-center py-20 text-slate-400 border-2 border-dashed border-slate-200 rounded-xl">No Rules Found</div>
        ) : (
          filteredRules.map((rule) => (
            <div key={rule.id} className={`bg-white rounded-2xl border transition-all overflow-hidden group ${expandedRuleId === rule.id ? 'border-indigo-200 shadow-md ring-1 ring-indigo-50' : 'border-slate-200 shadow-sm hover:shadow-md'}`}>
              
              {/* CARD HEADER */}
              <div onClick={() => setExpandedRuleId(expandedRuleId === rule.id ? null : rule.id)} className="p-6 cursor-pointer flex flex-col md:flex-row justify-between gap-4 bg-gradient-to-r from-white to-slate-50/30">
                <div className="flex items-start gap-5">
                  <div className={`w-14 h-14 rounded-2xl border flex items-center justify-center text-xl font-bold shadow-sm ${expandedRuleId === rule.id ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-indigo-600 border-slate-200'}`}>
                    {rule.department.charAt(0)}
                  </div>
                  
                  <div className="flex-1">
                    {/* HIERARCHY BADGES ROW */}
                    <div className="flex items-center flex-wrap gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                        
                        {/* 1. HQ */}
                        {rule.hierarchy_details?.hq && (
                            <span className="flex items-center gap-1 bg-purple-50 text-purple-700 px-2 py-1 rounded border border-purple-100">
                                <Globe size={10} /> {rule.hierarchy_details.hq}
                            </span>
                        )}
                        
                        {/* 2. BU */}
                        {rule.hierarchy_details?.bu && (
                            <>
                                <ArrowRight size={10} className="text-slate-300" />
                                <span className="flex items-center gap-1 bg-blue-50 text-blue-700 px-2 py-1 rounded border border-blue-100">
                                    <Briefcase size={10} /> {rule.hierarchy_details.bu}
                                </span>
                            </>
                        )}

                        {/* 3. DEPT */}
                        {(rule.hierarchy_details?.hq || rule.hierarchy_details?.bu) && <ArrowRight size={10} className="text-slate-300" />}
                        <span className="flex items-center gap-1 bg-indigo-50 text-indigo-700 px-2 py-1 rounded border border-indigo-100">
                            <Building2 size={10} /> {rule.department}
                        </span>

                        {/* 4. GROUP/SECTION */}
                        {rule.group_name && (
                            <>
                                <ArrowRight size={10} className="text-slate-300" />
                                <span className="flex items-center gap-1 bg-emerald-50 text-emerald-700 px-2 py-1 rounded border border-emerald-100">
                                    <Users size={10} /> {rule.group_name}
                                </span>
                            </>
                        )}
                        
                        {/* 5. DESIGNATION */}
                        {rule.designation && (
                            <>
                                <ArrowRight size={10} className="text-slate-300" />
                                <span className="flex items-center gap-1 bg-slate-100 text-slate-700 px-2 py-1 rounded border border-slate-200">
                                    <Briefcase size={10} /> {rule.designation}
                                </span>
                            </>
                        )}
                    </div>
                    
                    <h3 className="text-lg font-bold text-slate-800">
                      Competency Matrix Rule
                    </h3>
                    
                    <div className="flex items-center gap-4 mt-2 text-sm text-slate-400">
                       <span className="flex items-center gap-1.5"><Calendar size={14} /> {rule.financial_year}</span>
                       <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                       <span>Created {new Date(rule.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-start md:self-center">
                  <button onClick={(e) => handleEdit(rule, e)} className="p-2.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors" title="Edit Rule"><Edit size={20} /></button>
                  <button onClick={(e) => handleDelete(rule.id, e)} className="p-2.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors" title="Delete Rule"><Trash2 size={20} /></button>
                  <div className={`p-2 rounded-full transition-transform duration-300 ${expandedRuleId === rule.id ? 'rotate-180 bg-slate-100 text-slate-600' : 'text-slate-400'}`}><ChevronDown size={20} /></div>
                </div>
              </div>

              {/* SKILLS TABLE */}
              {expandedRuleId === rule.id && (
                <div className="border-t border-slate-100 bg-slate-50/50 p-6 animate-in slide-in-from-top-2 duration-200">
                   <div className="flex items-center gap-2 mb-4 text-sm font-bold text-slate-500 uppercase tracking-wider"><Layers size={16} /> Mapped Competencies ({rule.rule_competencies.length})</div>
                   <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                      {rule.rule_competencies.map((rc) => (
                        <div key={rc.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex justify-between items-center hover:border-indigo-200 transition-colors">
                           <div className="flex items-center gap-3 overflow-hidden"><div className="w-2 h-8 rounded-full bg-indigo-500"></div><span className="font-bold text-slate-700 text-sm truncate pr-2" title={rc.category_name}>{rc.category_name}</span></div>
                           <span className={`text-xs font-extrabold px-3 py-1.5 rounded-lg border uppercase tracking-wide ${getLevelBadge(rc.target_level)}`}>Level {rc.target_level}</span>
                        </div>
                      ))}
                   </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CompetencyRuleList;