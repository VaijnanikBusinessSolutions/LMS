
import React, { useState, useEffect } from 'react';
import {
  format, startOfMonth, endOfMonth, startOfWeek, endOfWeek,
  eachDayOfInterval, addMonths, subMonths, isSameMonth,
  isSameDay
} from 'date-fns';
import {
  ChevronLeft, ChevronRight, Calendar as CalendarIcon,
  Loader2, Plus, X, Users, Clock, Save, Layers, CheckCircle,
  Upload, Download, AlertCircle, Sparkles, TrendingUp,
  CheckSquare
} from 'lucide-react';

import AnnualTrainingMatrix from './AnnualTrainingMatrix';

const API_URL = 'http://127.0.0.1:8000/lms';

// --- TYPES ---
interface Group {
  id: number;
  name: string;
}

interface TrainingSchedule {
  id: number;
  group: number;
  date: string;
  topic: string;
  trainer: number | null;
  trainer_name_text: string | null;
  trainer_display?: string;
  duration: string;
  status: 'Planned' | 'Actual' | 'Cancelled';
}

interface FormData {
  topic: string;
  trainer_name_text: string;
  duration: string;
  status: 'Planned' | 'Actual' | 'Cancelled';
  date?: string; // Optional override for Annual view
}

type ViewMode = 'Planned' | 'Actual' | 'Both';

const getToken = (): string | null => {
  try {
    const authData = localStorage.getItem("auth");
    if (!authData) return null;
    const parsed = JSON.parse(authData);
    return parsed.accessToken || parsed.access || parsed.token || null;
  } catch (e) { return null; }
};

// --- MODAL COMPONENT ---
interface ScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: FormData) => void;
  selectedDate: Date;
  loading: boolean;
  error: string;
  defaultStatus: ViewMode;
  prefilledTopic?: string; // Optional prefill
}

const ScheduleModal: React.FC<ScheduleModalProps> = ({
  isOpen, onClose, onSubmit, selectedDate, loading, error, defaultStatus, prefilledTopic
}) => {
  const [formData, setFormData] = useState<FormData>({
    topic: '', trainer_name_text: '', duration: '', status: 'Planned'
  });
  const [validationError, setValidationError] = useState<string>('');

  useEffect(() => {
    if (isOpen) {
      const initialStatus = defaultStatus === 'Both' ? 'Planned' : defaultStatus;
      setFormData({
        topic: prefilledTopic || '', 
        trainer_name_text: '', 
        duration: '',
        status: initialStatus as any
      });
      setValidationError('');
    }
  }, [isOpen, defaultStatus, prefilledTopic]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.topic.trim()) { setValidationError("Topic is required"); return; }
    if (!formData.duration.trim()) { setValidationError("Duration is required"); return; }
    onSubmit(formData);
  };

  if (!isOpen) return null;

  const isPlanned = formData.status === 'Planned';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md transition-opacity duration-300" onClick={onClose} />
      <div className="relative bg-white dark:bg-slate-900 rounded-3xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all duration-300 scale-100 animate-[modalSlide_0.3s_ease-out]">
        <div className={`h-2 w-full ${isPlanned ? 'bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-500' : 'bg-gradient-to-r from-emerald-400 via-teal-500 to-cyan-500'}`} />
        <div className="px-8 pt-8 pb-6">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-2xl ${isPlanned ? 'bg-gradient-to-br from-violet-500 to-purple-600' : 'bg-gradient-to-br from-emerald-400 to-teal-500'} shadow-lg`}>
                {isPlanned ? <CalendarIcon size={24} className="text-white" /> : <CheckCircle size={24} className="text-white" />}
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">
                  {isPlanned ? 'Schedule Training' : 'Log Actual Training'}
                </h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5 flex items-center gap-2">
                  <Sparkles size={14} className="text-amber-500" />
                  {format(selectedDate, 'EEEE, MMMM do, yyyy')}
                </p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors duration-200">
              <X size={20} className="text-slate-400" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="px-8 pb-8 space-y-5">
          {(validationError || error) && (
            <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 px-4 py-3.5 rounded-2xl text-sm border border-red-100 dark:border-red-800 flex gap-3 items-center animate-[shake_0.5s_ease-in-out]">
              <AlertCircle size={18} className="flex-shrink-0" />
              <span>{validationError || error}</span>
            </div>
          )}

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Topic <span className="text-red-400">*</span></label>
            <input
              type="text"
              className="w-full px-4 py-3.5 bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:border-violet-400 focus:bg-white dark:focus:bg-slate-900 focus:ring-4 focus:ring-violet-100 dark:focus:ring-violet-900/30 transition-all duration-200 text-slate-700 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500"
              value={formData.topic}
              onChange={e => setFormData({ ...formData, topic: e.target.value })}
              autoFocus
              placeholder="e.g. Fire Safety, First Aid..."
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Trainer Name</label>
            <input
              type="text"
              className="w-full px-4 py-3.5 bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:border-violet-400 focus:bg-white dark:focus:bg-slate-900 focus:ring-4 focus:ring-violet-100 dark:focus:ring-violet-900/30 transition-all duration-200 text-slate-700 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500"
              value={formData.trainer_name_text}
              onChange={e => setFormData({ ...formData, trainer_name_text: e.target.value })}
              placeholder="e.g. John Doe"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Duration <span className="text-red-400">*</span></label>
              <input
                type="text"
                className="w-full px-4 py-3.5 bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:border-violet-400 focus:bg-white dark:focus:bg-slate-900 focus:ring-4 focus:ring-violet-100 dark:focus:ring-violet-900/30 transition-all duration-200 text-slate-700 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500"
                value={formData.duration}
                onChange={e => setFormData({ ...formData, duration: e.target.value })}
                placeholder="2 Hours"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Status</label>
              <select
                className="w-full px-4 py-3.5 bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:border-violet-400 focus:bg-white dark:focus:bg-slate-900 focus:ring-4 focus:ring-violet-100 dark:focus:ring-violet-900/30 transition-all duration-200 text-slate-700 dark:text-slate-100 cursor-pointer appearance-none"
                value={formData.status}
                onChange={e => setFormData({ ...formData, status: e.target.value as any })}
              >
                <option value="Planned">Planned</option>
                <option value="Actual">Actual</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-4 rounded-2xl font-bold text-white shadow-lg transition-all duration-300 flex items-center justify-center gap-3 mt-6 ${isPlanned ? 'bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-500' : 'bg-gradient-to-r from-emerald-400 via-teal-500 to-cyan-500'} disabled:opacity-70 transform hover:-translate-y-0.5`}
          >
            {loading ? <Loader2 className="animate-spin" size={22} /> : <Save size={20} />}
            <span>Save Training Record</span>
          </button>
        </form>
      </div>
    </div>
  );
};

// --- MAIN CALENDAR COMPONENT ---
const TrainingCalendar: React.FC = () => {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [groups, setGroups] = useState<Group[]>([]);
  const [selectedGroupId, setSelectedGroupId] = useState<number | null>(null);
  const [schedules, setSchedules] = useState<TrainingSchedule[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>('Both');
  const [viewType, setViewType] = useState<'monthly' | 'annual'>('monthly');
  const [groupsLoading, setGroupsLoading] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [error, setError] = useState<string>('');
  const [convertingId, setConvertingId] = useState<number | null>(null);
  
  // New State: Pass topic from Matrix click
  const [modalTopic, setModalTopic] = useState<string>('');

  useEffect(() => {
    const fetchGroups = async () => {
      setGroupsLoading(true);
      const token = getToken();
      if (!token) { setError("Please log in"); setGroupsLoading(false); return; }
      try {
        const res = await fetch(`${API_URL}/groups/`, { headers: { 'Authorization': `Bearer ${token}` } });
        const data = await res.json();
        const list = Array.isArray(data) ? data : data.results || [];
        setGroups(list);
        if (list.length > 0) setSelectedGroupId(list[0].id);
      } catch (err: any) { setError(err.message); }
      finally { setGroupsLoading(false); }
    };
    fetchGroups();
  }, []);

  const fetchSchedules = async () => {
    if (!selectedGroupId || viewType === 'annual') return;
    const token = getToken(); if (!token) return;
    setLoading(true);
    try {
      const month = currentDate.getMonth() + 1;
      const year = currentDate.getFullYear();
      const res = await fetch(`${API_URL}/schedules/?group_id=${selectedGroupId}&month=${month}&year=${year}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setSchedules(Array.isArray(data) ? data : data.results || []);
      }
    } finally { setLoading(false); }
  };

  useEffect(() => { if (selectedGroupId) fetchSchedules(); }, [currentDate, selectedGroupId, viewType]);

  const handleMarkAsDone = async (e: React.MouseEvent, schedule: TrainingSchedule) => {
    e.stopPropagation();
    const token = getToken();
    if (!token || !selectedGroupId) return;
    if(!window.confirm(`Confirm "${schedule.topic}" was conducted as planned? This will create an Actual record.`)) return;

    setConvertingId(schedule.id);
    try {
      const payload = {
        group: selectedGroupId,
        date: schedule.date,
        topic: schedule.topic,
        trainer: schedule.trainer,
        trainer_name_text: schedule.trainer_name_text,
        duration: schedule.duration,
        status: 'Actual'
      };
      await fetch(`${API_URL}/schedules/`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      await fetchSchedules();
    } catch (err) { alert("Error marking as actual."); } 
    finally { setConvertingId(null); }
  };

  const handleCreate = async (data: FormData) => {
    const token = getToken(); if (!token || !selectedGroupId) return;
    try {
      // Use date passed from Annual view if available, else use selectedDate from context
      const dateToSave = data.date || format(selectedDate, 'yyyy-MM-dd');
      
      await fetch(`${API_URL}/schedules/`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            ...data, 
            group: selectedGroupId, 
            date: dateToSave 
        })
      });
      setModalOpen(false);
      
      // Refresh Monthly view if active
      if (viewType === 'monthly') await fetchSchedules();
      // If Annual view, AnnualMatrix handles its own refresh internally via prop updates or key changes, 
      // but usually we might need to force a refresh. 
      // The easiest way is forcing a reload or using a refresh trigger. 
      // For now, let's assume user manually refreshes or switches views if needed, 
      // or we can add a 'refreshKey' prop to AnnualMatrix.
      
    } catch (err) { alert("Failed to save"); }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !selectedGroupId) return;
    const token = getToken(); if (!token) return;
    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('group_id', selectedGroupId.toString());
    formData.append('month', (currentDate.getMonth() + 1).toString());
    formData.append('year', currentDate.getFullYear().toString());
    try {
      const res = await fetch(`${API_URL}/schedules/upload-excel/`, {
        method: 'POST', headers: { 'Authorization': `Bearer ${token}` }, body: formData
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");
      alert(data.message);
      await fetchSchedules();
    } catch (err: any) { alert(err.message); }
    finally { setLoading(false); if (event.target) event.target.value = ''; }
  };

  const handleDownloadTemplate = () => {
    const token = getToken(); if (!token) return;
    const month = currentDate.getMonth() + 1;
    const year = currentDate.getFullYear();
    fetch(`${API_URL}/schedules/download-template/?month=${month}&year=${year}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.ok ? res.blob() : Promise.reject("Fail"))
      .then(blob => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Schedule_Template_${year}_${month}.xlsx`;
        document.body.appendChild(a);
        a.click();
        a.remove();
      })
      .catch(() => alert("Failed to download template"));
  };

  // --- NEW HANDLER FOR ANNUAL MATRIX CLICKS ---
  const handleMatrixAddClick = (date: Date, topic?: string) => {
    setSelectedDate(date);
    setModalTopic(topic || ''); // Prefill topic if user clicked a specific row
    setModalOpen(true);
  };

  const plannedCount = schedules.filter(s => s.status === 'Planned').length;
  const actualCount = schedules.filter(s => s.status === 'Actual').length;
  const completionRate = plannedCount > 0 ? Math.round((actualCount / plannedCount) * 100) : 0;

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const monthStart = startOfMonth(currentDate);
  const calendarDays = eachDayOfInterval({ start: startOfWeek(monthStart), end: endOfWeek(endOfMonth(monthStart)) });

  if (groupsLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-violet-50 to-fuchsia-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-violet-200 dark:border-violet-900 rounded-full animate-pulse" />
            <Loader2 className="absolute inset-0 m-auto animate-spin text-violet-500" size={40} />
          </div>
          <p className="mt-4 text-slate-500 dark:text-slate-400 font-medium">Loading your calendar...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-fuchsia-50/50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 p-4 lg:p-8 font-sans transition-colors duration-300">
      <style>{`
        @keyframes modalSlide { from { opacity: 0; transform: scale(0.95) translateY(10px); } to { opacity: 1; transform: scale(1) translateY(0); } }
        @keyframes shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-5px); } 75% { transform: translateX(5px); } }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb { background: #334155; }
      `}</style>

      <div className="w-full space-y-6">
        {/* === HEADER SECTION === */}
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-3xl shadow-lg border border-white/50 dark:border-slate-800 p-6 transition-all duration-300">
          <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6">
            <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center w-full xl:w-auto">
              <div className="flex items-center gap-4">
                <div className="p-3.5 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 shadow-lg">
                  <CalendarIcon className="text-white" size={26} />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1.5">Select Unit</label>
                  <div className="relative">
                    <select
                      value={selectedGroupId || ''}
                      onChange={(e) => setSelectedGroupId(Number(e.target.value))}
                      className="w-56 appearance-none bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 font-semibold text-slate-700 dark:text-slate-100 rounded-xl py-2.5 pl-4 pr-10 focus:ring-4 focus:ring-violet-100 dark:focus:ring-violet-900/30 focus:border-violet-400 cursor-pointer transition-all"
                    >
                      {groups.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
                    </select>
                    <Users className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 pointer-events-none" size={18} />
                  </div>
                </div>
              </div>

              <div className="bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl flex shadow-inner transition-colors duration-300">
                {(['monthly', 'annual'] as const).map((type) => (
                  <button
                    key={type}
                    onClick={() => setViewType(type)}
                    className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${viewType === type ? 'bg-white dark:bg-slate-700 text-violet-600 dark:text-violet-400 shadow-md' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700'}`}
                  >
                    {type === 'monthly' ? 'Monthly View' : 'Annual Matrix'}
                  </button>
                ))}
              </div>
            </div>

            {viewType === 'monthly' && (
              <div className="flex flex-wrap items-center gap-4 w-full xl:w-auto">
                <div className="bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl flex shadow-inner transition-colors duration-300">
                  {(['Planned', 'Actual', 'Both'] as const).map(mode => (
                    <button
                      key={mode}
                      onClick={() => setViewMode(mode)}
                      className={`px-4 py-2.5 rounded-xl text-xs font-bold flex gap-2 items-center transition-all duration-300 ${viewMode === mode
                          ? mode === 'Planned' ? 'bg-violet-500 text-white shadow-lg' : mode === 'Actual' ? 'bg-emerald-500 text-white shadow-lg' : 'bg-slate-700 text-white shadow-lg'
                          : 'text-slate-500 dark:text-slate-400 hover:text-slate-700'
                        }`}
                    >
                      {mode === 'Planned' ? <CalendarIcon size={14} /> : mode === 'Actual' ? <CheckCircle size={14} /> : <Layers size={14} />}
                      {mode}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-3">
                  <button onClick={handleDownloadTemplate} className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 hover:border-blue-300 text-slate-600 dark:text-slate-300 transition-all shadow-sm">
                    <Download size={18} /> Template
                  </button>
                  <div>
                    <input type="file" id="excel-upload" accept=".xlsx" className="hidden" onChange={handleFileUpload} disabled={!selectedGroupId} />
                    <label htmlFor="excel-upload" className={`cursor-pointer flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 hover:border-emerald-300 text-slate-600 dark:text-slate-300 shadow-sm ${!selectedGroupId && 'opacity-50 cursor-not-allowed'}`}>
                      <Upload size={18} /> Import
                    </label>
                  </div>
                </div>

                <div className="flex items-center bg-white dark:bg-slate-800 rounded-2xl p-1.5 border-2 border-slate-200 dark:border-slate-700 shadow-sm transition-colors duration-300">
                  <button onClick={() => setCurrentDate(subMonths(currentDate, 1))} className="p-2.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl text-slate-500 transition-all"><ChevronLeft size={20} /></button>
                  <span className="px-4 font-bold text-slate-700 dark:text-slate-200 min-w-[160px] text-center">{format(currentDate, 'MMMM yyyy')}</span>
                  <button onClick={() => setCurrentDate(addMonths(currentDate, 1))} className="p-2.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl text-slate-500 transition-all"><ChevronRight size={20} /></button>
                </div>
              </div>
            )}
          </div>
        </div>

        {viewType === 'monthly' ? (
          <>
            {/* ... Stats Cards ... */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              <div className="group bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl p-6 rounded-3xl border border-violet-100 dark:border-slate-800 shadow-lg transition-all hover:-translate-y-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-4 bg-gradient-to-br from-violet-500 to-purple-600 text-white rounded-2xl shadow-lg"><CalendarIcon size={26} /></div>
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Total Planned</p>
                      <p className="text-4xl font-black bg-gradient-to-r from-violet-600 to-purple-600 dark:from-violet-400 dark:to-purple-400 bg-clip-text text-transparent">{plannedCount}</p>
                    </div>
                  </div>
                  <Sparkles size={48} className="text-violet-400 opacity-20" />
                </div>
              </div>

              <div className="group bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl p-6 rounded-3xl border border-emerald-100 dark:border-slate-800 shadow-lg transition-all hover:-translate-y-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-4 bg-gradient-to-br from-emerald-400 to-teal-500 text-white rounded-2xl shadow-lg"><CheckCircle size={26} /></div>
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Total Actual</p>
                      <p className="text-4xl font-black bg-gradient-to-r from-emerald-500 to-teal-500 dark:from-emerald-400 dark:to-teal-400 bg-clip-text text-transparent">{actualCount}</p>
                    </div>
                  </div>
                  <Sparkles size={48} className="text-emerald-400 opacity-20" />
                </div>
              </div>

              <div className="group bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl p-6 rounded-3xl border border-amber-100 dark:border-slate-800 shadow-lg transition-all hover:-translate-y-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-4 bg-gradient-to-br from-amber-400 to-orange-500 text-white rounded-2xl shadow-lg"><TrendingUp size={26} /></div>
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Adherence Rate</p>
                      <p className="text-4xl font-black bg-gradient-to-r from-amber-500 to-orange-500 dark:from-amber-400 dark:to-orange-400 bg-clip-text text-transparent">{completionRate}%</p>
                    </div>
                  </div>
                  <Sparkles size={48} className="text-amber-400 opacity-20" />
                </div>
                <div className="mt-4 h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-amber-400 to-orange-500 transition-all duration-700" style={{ width: `${completionRate}%` }} />
                </div>
              </div>
            </div>

            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/50 dark:border-slate-800 shadow-xl overflow-hidden rounded-3xl relative transition-all duration-300">
              <div className={`h-1.5 w-full ${viewMode === 'Planned' ? 'bg-violet-500' : viewMode === 'Actual' ? 'bg-emerald-500' : 'bg-slate-700'}`} />

              <div className="grid grid-cols-7 border-b border-slate-100 dark:border-slate-700 bg-slate-50/80 dark:bg-slate-800/80">
                {weekDays.map(d => (
                  <div key={d} className="py-4 text-center text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">{d}</div>
                ))}
              </div>

              <div className="grid grid-cols-7 auto-rows-fr bg-slate-100 dark:bg-slate-800 gap-px">
                {calendarDays.map((day) => {
                  const isCurrentMonth = isSameMonth(day, monthStart);
                  const isToday = isSameDay(day, new Date());
                  const dateKey = format(day, 'yyyy-MM-dd');

                  const dayEvents = schedules.filter(s => {
                    const matchesDate = s.date === dateKey;
                    if (viewMode === 'Both') return matchesDate && (s.status === 'Planned' || s.status === 'Actual');
                    return matchesDate && s.status === viewMode;
                  });

                  return (
                    <div
                      key={day.toString()}
                      onClick={() => { if (isCurrentMonth) { setSelectedDate(day); setModalTopic(''); setModalOpen(true); } }}
                      className={`min-h-[140px] lg:min-h-[200px] bg-white dark:bg-slate-900 relative group transition-all duration-200 flex flex-col ${!isCurrentMonth
                          ? "bg-slate-50/50 dark:bg-slate-800/30 opacity-40 pointer-events-none"
                          : "hover:bg-slate-50/50 dark:hover:bg-slate-800/30 cursor-pointer"
                        }`}
                    >
                      {/* Date Header */}
                      <div className="p-3 flex justify-between items-center">
                        <span className={`text-sm font-bold w-8 h-8 flex items-center justify-center rounded-full transition-colors ${isToday
                            ? 'bg-violet-600 text-white shadow-md shadow-violet-200 dark:shadow-none'
                            : 'text-slate-400 dark:text-slate-500'
                          }`}>
                          {format(day, 'd')}
                        </span>
                        {isToday && (
                          <span className="text-[10px] font-black uppercase tracking-tighter text-violet-500 bg-violet-50 dark:bg-violet-900/30 px-2 py-1 rounded-md">
                            Today
                          </span>
                        )}
                      </div>

                      {/* Content Area */}
                      <div className="flex-1 px-2 pb-3 space-y-2 overflow-y-auto custom-scrollbar max-h-[160px]">
                        {dayEvents.map((event) => (
                          <div
                            key={event.id}
                            className={`group/card relative rounded-xl p-3 border-l-4 shadow-sm border-t border-r border-b border-transparent transition-all hover:shadow-md hover:scale-[1.02] active:scale-[0.98] ${event.status === 'Planned'
                                ? 'bg-violet-50/50 dark:bg-violet-900/10 border-violet-500 hover:bg-violet-50 dark:hover:bg-violet-900/20'
                                : 'bg-emerald-50/50 dark:bg-emerald-900/10 border-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/20'
                              }`}
                          >
                            {/* --- NEW BUTTON: Mark as Done --- */}
                            {event.status === 'Planned' && (
                                <button 
                                  onClick={(e) => handleMarkAsDone(e, event)}
                                  disabled={convertingId === event.id}
                                  className="absolute top-2 right-2 p-1 bg-white dark:bg-slate-800 text-emerald-500 rounded-full shadow-sm opacity-0 group-hover/card:opacity-100 transition-opacity hover:bg-emerald-50 hover:scale-110"
                                  title="Mark as Actual (Done)"
                                >
                                  {convertingId === event.id ? (
                                    <Loader2 size={14} className="animate-spin" />
                                  ) : (
                                    <CheckSquare size={14} />
                                  )}
                                </button>
                            )}

                            {/* Topic */}
                            <p className="font-bold text-slate-800 dark:text-slate-100 text-[12px] leading-snug line-clamp-2 mb-2 pr-5">
                              {event.topic}
                            </p>

                            {/* Meta Info */}
                            <div className="flex items-center justify-between mt-auto">
                              <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                                <Clock size={12} className="opacity-70" />
                                <span className="text-[10px] font-medium">{event.duration}</span>
                              </div>

                              <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${event.status === 'Planned'
                                  ? 'bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300'
                                  : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300'
                                }`}>
                                {event.status}
                              </span>
                            </div>
                          </div>
                        ))}

                        {/* Add Placeholder */}
                        {isCurrentMonth && dayEvents.length === 0 && (
                          <div className="h-full flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 py-4">
                            <div className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400">
                              <Plus size={18} />
                            </div>
                            <span className="text-[10px] font-bold text-slate-400 mt-2">Add Training</span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        ) : (
          <AnnualTrainingMatrix 
             groupId={selectedGroupId} 
             onCellClick={handleMatrixAddClick} 
          />
        )}
      </div>

      <ScheduleModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleCreate}
        selectedDate={selectedDate}
        loading={loading}
        error={error}
        defaultStatus={viewMode}
        prefilledTopic={modalTopic}
      />
    </div>
  );
};

export default TrainingCalendar;