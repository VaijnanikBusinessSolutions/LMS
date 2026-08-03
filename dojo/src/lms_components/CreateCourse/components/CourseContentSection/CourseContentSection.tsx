
import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { 
  Plus, Search, ChevronLeft, ChevronRight, BookOpen, FileText, 
  GripVertical, MoreHorizontal, Copy, Trash2, Eye, EyeOff,
  Clock, CheckCircle2, AlertCircle, Sparkles, Command, X,
  Filter, SortAsc, Layout, Maximize2, Minimize2, Save,
  Undo, Redo, Keyboard, HelpCircle, Star, StarOff,
  FolderOpen, ChevronDown, ChevronUp, Zap, Target,
  ArrowUp, ArrowDown, Settings, Moon, Sun, Layers,
  PanelLeftClose, PanelLeft, Wand2, Rocket, MousePointer2,
  Play, Loader2, CloudOff, CheckCheck, RotateCcw
} from 'lucide-react';
import type { Course, Lesson, LessonTabType, Test } from '../Utils/types';
import { LessonSidebar } from '../LessonSidebar/LessonSidebar';
import { TestEditor } from '../TestEditor/TestEditor';
import { LessonEditor } from '../LessonEditor/LessonEditor';

interface CourseContentSectionProps {
  course: Course;
  selectedLesson: number;
  editingLesson: number | null;
  lessonTab: LessonTabType;
  onLessonSelect: (lessonId: number) => void;
  onLessonTabChange: (tab: LessonTabType) => void;
  onAddLesson?: () => void;
  onEditLesson?: () => void;
  onSaveLesson?: () => void;
  onCancelEdit?: () => void;
  onDeleteLesson?: () => void;
  onUpdateLesson?: (field: keyof Lesson, value: any) => void;
  onVideoUpload?: (files: FileList | File[]) => void;
  onVideoRemove?: (index?: number) => void;
  onAddAttachment?: (lessonId: number, file: File | null, url: string, title?: string) => void;
  onRemoveAttachment?: (lessonId: number, index: number) => void | Promise<boolean>;
  tests?: Test[];
  selectedTest?: number | null;
  editingTest?: number | null;
  onTestSelect?: (testId: number | null) => void;
  onAddTest?: () => void;
  onEditTest?: (testId: number) => void;
  onSaveTest?: (testId: number) => void;
  onCancelTest?: (testId: number) => void;
  onDeleteTest?: (testId: number) => void;
  onUpdateTest?: (testId: number, payload: Partial<Test>) => void;
  onUpdateTestQuestion?: (testId: number, questionId: string | number, field: 'question_text' | 'options', value: any) => void;
  onReorder?: (items: any[]) => void;
  onDuplicateLesson?: (lessonId: number) => void;
  onDuplicateTest?: (testId: number) => void;
  onSave?: () => Promise<boolean>;
  hasUnsavedChanges?: boolean;
}

// --- ANIMATED BACKGROUND ORBS ---
const BackgroundOrbs: React.FC = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-violet-500/20 to-purple-500/20 rounded-full blur-3xl animate-float" />
    <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-full blur-3xl animate-float-delayed" />
    <style>{`
      @keyframes float {
        0%, 100% { transform: translate(0, 0) scale(1); }
        50% { transform: translate(30px, -30px) scale(1.1); }
      }
      @keyframes float-delayed {
        0%, 100% { transform: translate(0, 0) scale(1); }
        50% { transform: translate(-30px, 30px) scale(1.1); }
      }
      .animate-float { animation: float 20s ease-in-out infinite; }
      .animate-float-delayed { animation: float-delayed 25s ease-in-out infinite; }
    `}</style>
  </div>
);

// --- FLOATING SAVE BUTTON ---
const FloatingSaveButton: React.FC<{
  onSave: () => Promise<void>;
  hasUnsavedChanges: boolean;
  isEditing: boolean;
}> = ({ onSave, hasUnsavedChanges, isEditing }) => {
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        if (hasUnsavedChanges && saveStatus !== 'saving' && isEditing) {
          handleSave();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [hasUnsavedChanges, saveStatus, isEditing]);

  const handleSave = async () => {
    if (saveStatus === 'saving') return;
    setSaveStatus('saving');
    try {
      await onSave();
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2500);
    } catch {
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 3000);
    }
  };

  if (!isEditing) return null;

  const getButtonContent = () => {
    switch (saveStatus) {
      case 'saving':
        return <><Loader2 size={18} className="animate-spin" /><span>Saving...</span></>;
      case 'saved':
        return <><CheckCheck size={18} /><span>Saved!</span></>;
      case 'error':
        return <><CloudOff size={18} /><span>Retry</span></>;
      default:
        return <><Save size={18} /><span>Save</span></>;
    }
  };

  const getButtonStyles = () => {
    switch (saveStatus) {
      case 'saving': return 'from-blue-500 to-cyan-500';
      case 'saved': return 'from-emerald-500 to-teal-500';
      case 'error': return 'from-rose-500 to-red-500';
      default: return hasUnsavedChanges ? 'from-violet-500 to-purple-600' : 'from-slate-400 to-slate-500';
    }
  };

  return (
    <div className={`fixed bottom-6 right-6 z-50 transition-all duration-500 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
      <div className="flex items-center gap-3">
        {hasUnsavedChanges && saveStatus === 'idle' && (
          <div className="flex items-center gap-2 px-4 py-2.5 bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl rounded-xl border border-amber-200 dark:border-amber-800 shadow-lg animate-fade-in">
            <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
            <span className="text-sm font-medium text-amber-700 dark:text-amber-300">Unsaved changes</span>
          </div>
        )}

        <div className="relative group">
          <div className={`absolute -inset-1 bg-gradient-to-r ${getButtonStyles()} rounded-2xl blur-lg opacity-60 group-hover:opacity-100 transition-opacity duration-300`} />
          <button
            onClick={handleSave}
            disabled={!hasUnsavedChanges && saveStatus === 'idle'}
            className={`relative flex items-center gap-2.5 px-6 py-3.5 bg-gradient-to-r ${getButtonStyles()} text-white font-semibold rounded-xl shadow-2xl transition-all duration-300 disabled:cursor-not-allowed ${
              hasUnsavedChanges && saveStatus === 'idle' ? 'hover:scale-105 hover:-translate-y-1' : ''
            }`}
          >
            {getButtonContent()}
            {saveStatus === 'idle' && hasUnsavedChanges && (
              <kbd className="ml-2 px-2 py-0.5 bg-white/20 rounded text-xs">⌘S</kbd>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

// --- TOAST NOTIFICATION ---
const Toast: React.FC<{
  message: string;
  type: 'success' | 'error' | 'info';
  onClose: () => void;
}> = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const styles = {
    success: 'from-emerald-500 to-teal-500 shadow-emerald-500/25',
    error: 'from-rose-500 to-red-500 shadow-rose-500/25',
    info: 'from-blue-500 to-indigo-500 shadow-blue-500/25'
  };

  const icons = {
    success: <CheckCircle2 size={18} />,
    error: <AlertCircle size={18} />,
    info: <Sparkles size={18} />
  };

  return (
    <div className={`bg-gradient-to-r ${styles[type]} text-white px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 animate-slide-in-right backdrop-blur-sm`}>
      <div className="p-1 bg-white/20 rounded-lg">
        {icons[type]}
      </div>
      <span className="font-medium">{message}</span>
      <button onClick={onClose} className="ml-2 p-1.5 hover:bg-white/20 rounded-lg transition-colors">
        <X size={14} />
      </button>
    </div>
  );
};

// --- COMMAND PALETTE ---
const CommandPalette: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  lessons: Lesson[];
  tests: Test[];
  onLessonSelect: (id: number) => void;
  onTestSelect: (id: number) => void;
  onAddLesson: () => void;
  onAddTest: () => void;
}> = ({ isOpen, onClose, lessons, tests, onLessonSelect, onTestSelect, onAddLesson, onAddTest }) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  const filteredItems = useMemo(() => {
    const q = query.toLowerCase();
    const lessonResults = lessons.filter(l => l.title.toLowerCase().includes(q)).map(l => ({ ...l, type: 'lesson' as const }));
    const testResults = tests.filter(t => t.title.toLowerCase().includes(q)).map(t => ({ ...t, type: 'test' as const }));
    return [...lessonResults, ...testResults].slice(0, 8);
  }, [query, lessons, tests]);

  const commands = [
    { id: 'add-lesson', label: 'Add New Lesson', icon: BookOpen, action: onAddLesson, shortcut: 'L', gradient: 'from-blue-500 to-indigo-500' },
    { id: 'add-test', label: 'Add New Test', icon: FileText, action: onAddTest, shortcut: 'T', gradient: 'from-amber-500 to-orange-500' },
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] bg-black/60 backdrop-blur-md animate-fade-in" onClick={onClose}>
      <div 
        className="w-full max-w-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-slate-200/50 dark:border-slate-700/50 overflow-hidden animate-scale-in-bounce"
        onClick={e => e.stopPropagation()}
      >
        {/* Search Header */}
        <div className="relative px-6 py-5 border-b border-slate-200/50 dark:border-slate-700/50">
          <div className="absolute inset-0 bg-gradient-to-r from-violet-500/5 via-purple-500/5 to-pink-500/5" />
          <div className="relative flex items-center gap-4">
            <div className="p-2.5 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl shadow-lg shadow-violet-500/25">
              <Search size={20} className="text-white" />
            </div>
            <input
              ref={inputRef}
              type="text"
              placeholder="Search lessons, tests, or type a command..."
              value={query}
              onChange={e => setQuery(e.target.value)}
              className="flex-1 bg-transparent outline-none text-lg text-slate-900 dark:text-white placeholder:text-slate-400"
            />
            <kbd className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs font-medium text-slate-500 border border-slate-200 dark:border-slate-700">ESC</kbd>
          </div>
        </div>

        {/* Results */}
        <div className="max-h-96 overflow-y-auto custom-scrollbar">
          {query === '' && (
            <div className="p-4">
              <div className="px-3 py-2 text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                <Zap size={12} />
                Quick Actions
              </div>
              <div className="space-y-1">
                {commands.map((cmd, idx) => (
                  <button
                    key={cmd.id}
                    onClick={() => { cmd.action(); onClose(); }}
                    className={`w-full flex items-center gap-4 px-4 py-3.5 hover:bg-slate-100 dark:hover:bg-slate-800/80 rounded-2xl transition-all duration-200 group ${
                      selectedIndex === idx ? 'bg-slate-100 dark:bg-slate-800/80' : ''
                    }`}
                  >
                    <div className={`w-10 h-10 bg-gradient-to-br ${cmd.gradient} rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-200`}>
                      <cmd.icon size={18} className="text-white" />
                    </div>
                    <span className="flex-1 text-left font-medium text-slate-700 dark:text-slate-300">{cmd.label}</span>
                    <kbd className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs font-medium text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity border border-slate-200 dark:border-slate-700">
                      ⌘{cmd.shortcut}
                    </kbd>
                  </button>
                ))}
              </div>
            </div>
          )}

          {filteredItems.length > 0 && (
            <div className="p-4">
              <div className="px-3 py-2 text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                <Layers size={12} />
                Results
              </div>
              <div className="space-y-1">
                {filteredItems.map((item, idx) => (
                  <button
                    key={`${item.type}-${item.id}`}
                    onClick={() => { 
                      if (item.type === 'lesson') onLessonSelect(item.id);
                      else onTestSelect(item.id);
                      onClose();
                    }}
                    className="w-full flex items-center gap-4 px-4 py-3.5 hover:bg-slate-100 dark:hover:bg-slate-800/80 rounded-2xl transition-all duration-200 group"
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 group-hover:scale-110 ${
                      item.type === 'lesson' 
                        ? 'bg-gradient-to-br from-blue-500/20 to-indigo-500/20 text-blue-600 dark:text-blue-400' 
                        : 'bg-gradient-to-br from-amber-500/20 to-orange-500/20 text-amber-600 dark:text-amber-400'
                    }`}>
                      {item.type === 'lesson' ? <BookOpen size={18} /> : <FileText size={18} />}
                    </div>
                    <div className="flex-1 text-left">
                      <div className="font-medium text-slate-700 dark:text-slate-300">{item.title}</div>
                      <div className="text-xs text-slate-400 capitalize flex items-center gap-2 mt-0.5">
                        <span className={`w-1.5 h-1.5 rounded-full ${item.type === 'lesson' ? 'bg-blue-500' : 'bg-amber-500'}`} />
                        {item.type}
                      </div>
                    </div>
                    <ChevronRight size={16} className="text-slate-300 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {query !== '' && filteredItems.length === 0 && (
            <div className="p-12 text-center">
              <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Search size={28} className="text-slate-400" />
              </div>
              <p className="text-slate-500 font-medium">No results found for "{query}"</p>
              <p className="text-sm text-slate-400 mt-1">Try a different search term</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200/50 dark:border-slate-700/50 bg-slate-50/50 dark:bg-slate-800/30">
          <div className="flex items-center gap-6 text-xs text-slate-500">
            <span className="flex items-center gap-1.5">
              <ArrowUp size={12} />
              <ArrowDown size={12} />
              Navigate
            </span>
            <span className="flex items-center gap-1.5">
              <span className="px-1.5 py-0.5 bg-slate-200 dark:bg-slate-700 rounded text-[10px]">↵</span>
              Select
            </span>
          </div>
          <span className="flex items-center gap-1.5 text-xs text-slate-400">
            <Command size={12} />K to open
          </span>
        </div>
      </div>
    </div>
  );
};

// --- KEYBOARD SHORTCUTS MODAL ---
const KeyboardShortcuts: React.FC<{
  isOpen: boolean;
  onClose: () => void;
}> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const shortcuts = [
    { category: 'Navigation', icon: MousePointer2, items: [
      { keys: ['⌘', 'K'], description: 'Open command palette' },
      { keys: ['⌘', '↑'], description: 'Previous item' },
      { keys: ['⌘', '↓'], description: 'Next item' },
      { keys: ['⌘', '['], description: 'Toggle sidebar' },
    ]},
    { category: 'Editing', icon: Wand2, items: [
      { keys: ['⌘', 'S'], description: 'Save changes' },
      { keys: ['⌘', 'Z'], description: 'Undo' },
      { keys: ['⌘', '⇧', 'Z'], description: 'Redo' },
      { keys: ['⌘', 'D'], description: 'Duplicate item' },
    ]},
    { category: 'Actions', icon: Rocket, items: [
      { keys: ['⌘', 'L'], description: 'Add new lesson' },
      { keys: ['⌘', 'T'], description: 'Add new test' },
      { keys: ['Esc'], description: 'Cancel / Close' },
    ]},
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md animate-fade-in" onClick={onClose}>
      <div 
        className="w-full max-w-lg bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-slate-200/50 dark:border-slate-700/50 overflow-hidden animate-scale-in-bounce"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative px-6 py-5 border-b border-slate-200/50 dark:border-slate-700/50">
          <div className="absolute inset-0 bg-gradient-to-r from-violet-500/5 via-purple-500/5 to-pink-500/5" />
          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-violet-500/25">
                <Keyboard size={22} className="text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">Keyboard Shortcuts</h2>
                <p className="text-sm text-slate-500">Work faster with shortcuts</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors">
              <X size={20} className="text-slate-500" />
            </button>
          </div>
        </div>

        {/* Shortcuts List */}
        <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto custom-scrollbar">
          {shortcuts.map(section => (
            <div key={section.category}>
              <div className="flex items-center gap-2 mb-4">
                <div className="p-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg">
                  <section.icon size={14} className="text-slate-500" />
                </div>
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">
                  {section.category}
                </h3>
              </div>
              <div className="space-y-2">
                {section.items.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between py-3 px-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                    <span className="text-slate-700 dark:text-slate-300">{item.description}</span>
                    <div className="flex items-center gap-1.5">
                      {item.keys.map((key, kidx) => (
                        <kbd key={kidx} className="px-2.5 py-1.5 bg-white dark:bg-slate-700 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-300 min-w-[32px] text-center shadow-sm border border-slate-200 dark:border-slate-600">
                          {key}
                        </kbd>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// --- DELETE CONFIRMATION MODAL ---
const DeleteConfirmModal: React.FC<{
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}> = ({ isOpen, title, message, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md animate-fade-in" onClick={onCancel}>
      <div 
        className="w-full max-w-md bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-slate-200/50 dark:border-slate-700/50 overflow-hidden animate-scale-in-bounce"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-8">
          {/* Icon */}
          <div className="relative w-20 h-20 mx-auto mb-6">
            <div className="absolute inset-0 bg-red-500/20 rounded-3xl blur-xl animate-pulse" />
            <div className="relative w-full h-full bg-gradient-to-br from-red-500 to-rose-600 rounded-3xl flex items-center justify-center shadow-lg shadow-red-500/25">
              <Trash2 size={32} className="text-white" />
            </div>
          </div>
          
          <h2 className="text-2xl font-bold text-center text-slate-900 dark:text-white mb-2">{title}</h2>
          <p className="text-center text-slate-500 mb-8 leading-relaxed">{message}</p>
          
          <div className="flex gap-4">
            <button
              onClick={onCancel}
              className="flex-1 px-5 py-3.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl font-semibold text-slate-700 dark:text-slate-300 transition-all hover:scale-[1.02]"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 px-5 py-3.5 bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 rounded-xl font-semibold text-white transition-all shadow-lg shadow-red-500/25 hover:shadow-red-500/40 hover:scale-[1.02]"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- SIDEBAR ITEM ---
const SidebarItem: React.FC<{
  item: (Lesson | Test) & { type: 'lesson' | 'test' };
  isSelected: boolean;
  isDragging?: boolean;
  onSelect: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
  onToggleFavorite?: () => void;
  isFavorite?: boolean;
  index: number;
}> = ({ item, isSelected, isDragging, onSelect, onDuplicate, onDelete, onToggleFavorite, isFavorite, index }) => {
  const [showMenu, setShowMenu] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div
      className={`group relative flex items-center gap-3 px-3 py-3 rounded-2xl cursor-pointer transition-all duration-300 ${
        isSelected
          ? 'bg-gradient-to-r from-indigo-500 via-purple-500 to-violet-600 text-white shadow-xl shadow-indigo-500/30 scale-[1.02]'
          : 'hover:bg-slate-100/80 dark:hover:bg-slate-800/80 text-slate-700 dark:text-slate-300 hover:scale-[1.01]'
      } ${isDragging ? 'opacity-50 scale-95 rotate-2' : ''}`}
      onClick={onSelect}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ animationDelay: `${index * 50}ms` }}
    >
      {/* Glow effect for selected */}
      {isSelected && (
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-violet-600 rounded-2xl blur-xl opacity-50 -z-10" />
      )}

      {/* Drag Handle */}
      <div className={`transition-all duration-200 cursor-grab active:cursor-grabbing ${
        isHovered || isSelected ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'
      } ${isSelected ? 'text-white/70' : 'text-slate-400'}`}>
        <GripVertical size={14} />
      </div>

      {/* Icon */}
      <div className={`relative w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
        isSelected 
          ? 'bg-white/20 shadow-inner' 
          : item.type === 'lesson' 
            ? 'bg-gradient-to-br from-blue-500/10 to-indigo-500/10 text-blue-600 dark:text-blue-400' 
            : 'bg-gradient-to-br from-amber-500/10 to-orange-500/10 text-amber-600 dark:text-amber-400'
      } ${isHovered && !isSelected ? 'scale-110' : ''}`}>
        {item.type === 'lesson' ? <BookOpen size={18} /> : <FileText size={18} />}
        
        {/* Status indicator */}
        <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 ${
          isSelected ? 'border-indigo-500' : 'border-white dark:border-slate-900'
        } ${
          (item.type === 'lesson' && ((item as Lesson).videos?.length > 0 || Boolean((item as Lesson).content))) || (item.type === 'test' && (item as Test).questions?.length > 0)
            ? 'bg-emerald-500'
            : 'bg-slate-300 dark:bg-slate-600'
        }`} />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className={`font-semibold truncate ${isSelected ? 'text-white' : ''}`}>
            {item.title}
          </span>
          {isFavorite && (
            <Star size={12} className={`flex-shrink-0 fill-current ${isSelected ? 'text-yellow-300' : 'text-yellow-500'}`} />
          )}
        </div>
        <div className={`text-xs truncate mt-0.5 ${isSelected ? 'text-white/70' : 'text-slate-400'}`}>
          {item.type === 'lesson' 
            ? `${(item as Lesson).duration || 0} min • Lesson` 
            : `${(item as Test).questions?.length || 0} questions • Test`
          }
        </div>
      </div>

      {/* Menu Button */}
      <div className="relative" ref={menuRef}>
        <button
          onClick={(e) => { e.stopPropagation(); setShowMenu(!showMenu); }}
          className={`p-2 rounded-xl transition-all duration-200 ${
            isHovered || showMenu ? 'opacity-100' : 'opacity-0'
          } ${isSelected ? 'hover:bg-white/20' : 'hover:bg-slate-200 dark:hover:bg-slate-700'}`}
        >
          <MoreHorizontal size={16} />
        </button>

        {/* Dropdown Menu */}
        {showMenu && (
          <div className="absolute right-0 top-full mt-2 w-52 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden z-50 animate-scale-in-bounce">
            <div className="p-2">
              <button
                onClick={(e) => { e.stopPropagation(); onToggleFavorite?.(); setShowMenu(false); }}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-700/50 rounded-xl text-slate-700 dark:text-slate-300 transition-colors"
              >
                {isFavorite ? <StarOff size={16} /> : <Star size={16} />}
                <span>{isFavorite ? 'Remove favorite' : 'Add to favorites'}</span>
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); onDuplicate(); setShowMenu(false); }}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-700/50 rounded-xl text-slate-700 dark:text-slate-300 transition-colors"
              >
                <Copy size={16} />
                <span>Duplicate</span>
              </button>
            </div>
            <div className="h-px bg-slate-200 dark:bg-slate-700" />
            <div className="p-2">
              <button
                onClick={(e) => { e.stopPropagation(); onDelete(); setShowMenu(false); }}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 rounded-xl transition-colors"
              >
                <Trash2 size={16} />
                <span>Delete</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// --- PROGRESS RING ---
const ProgressRing: React.FC<{ progress: number; size?: number }> = ({ progress, size = 48 }) => {
  const strokeWidth = 4;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          className="stroke-slate-200 dark:stroke-slate-700"
          strokeWidth={strokeWidth}
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        <circle
          className="stroke-indigo-500 transition-all duration-1000 ease-out"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
          style={{ strokeDasharray: circumference, strokeDashoffset: offset }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-sm font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          {progress}%
        </span>
      </div>
    </div>
  );
};

// --- MAIN COMPONENT ---
export const CourseContentSection: React.FC<CourseContentSectionProps> = ({
  course, selectedLesson, editingLesson, lessonTab,
  onLessonSelect, onLessonTabChange, onAddLesson, onEditLesson, onSaveLesson, onCancelEdit, onDeleteLesson, onUpdateLesson,
  onVideoUpload, onVideoRemove, onAddAttachment, onRemoveAttachment,
  tests = [], selectedTest, editingTest, onTestSelect, onAddTest, onEditTest, onSaveTest, onCancelTest, onDeleteTest, onUpdateTest, onUpdateTestQuestion,
  onReorder, onDuplicateLesson, onDuplicateTest, onSave, hasUnsavedChanges = false
}) => {
  const currentLesson = course.roadmap.find(lesson => lesson.id === selectedLesson) || null;
  const currentTest = tests.find(t => t.id === selectedTest) || null;
  
  // UI State
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [sidebarWidth, setSidebarWidth] = useState(340);
  const [isResizing, setIsResizing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'lessons' | 'tests'>('all');
  const [sortBy, setSortBy] = useState<'order' | 'name' | 'date'>('order');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  
  // Modal States
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [keyboardShortcutsOpen, setKeyboardShortcutsOpen] = useState(false);
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; type: 'lesson' | 'test'; id: number; title: string } | null>(null);
  
  // Toast State
  const [toasts, setToasts] = useState<Array<{ id: number; message: string; type: 'success' | 'error' | 'info' }>>([]);

  // Show toast notification
  const showToast = useCallback((message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
  }, []);

  const removeToast = useCallback((id: number) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  // Toggle favorite
  const toggleFavorite = useCallback((type: 'lesson' | 'test', id: number) => {
    const key = `${type}-${id}`;
    setFavorites(prev => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
        showToast('Removed from favorites', 'info');
      } else {
        next.add(key);
        showToast('Added to favorites', 'success');
      }
      return next;
    });
  }, [showToast]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCommandPaletteOpen(true);
      }
      if ((e.metaKey || e.ctrlKey) && e.key === '[') {
        e.preventDefault();
        setSidebarOpen(prev => !prev);
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 's') {
        e.preventDefault();
        if (editingLesson !== null) {
          onSaveLesson?.();
          showToast('Lesson saved successfully', 'success');
        } else if (typeof editingTest === 'number') {
          onSaveTest?.(editingTest);
          showToast('Test saved successfully', 'success');
        }
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 'l') {
        e.preventDefault();
        onAddLesson?.();
        showToast('New lesson added', 'success');
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 't') {
        e.preventDefault();
        onAddTest?.();
        showToast('New test added', 'success');
      }
      if (e.key === '?') {
        setKeyboardShortcutsOpen(true);
      }
      if (e.key === 'Escape') {
        setCommandPaletteOpen(false);
        setKeyboardShortcutsOpen(false);
        setDeleteModal(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedLesson, selectedTest, editingLesson, editingTest, course.roadmap, tests, onLessonSelect, onTestSelect, onSaveLesson, onSaveTest, onAddLesson, onAddTest, showToast]);

  // Resize handler
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);

    const handleMouseMove = (e: MouseEvent) => {
      const newWidth = Math.max(280, Math.min(500, e.clientX));
      setSidebarWidth(newWidth);
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, []);

  // Filter and sort items
  const filteredItems = useMemo(() => {
    let items: Array<(Lesson | Test) & { type: 'lesson' | 'test' }> = [];
    
    if (filterType === 'all' || filterType === 'lessons') {
      items = [...items, ...course.roadmap.map(l => ({ ...l, type: 'lesson' as const }))];
    }
    if (filterType === 'all' || filterType === 'tests') {
      items = [...items, ...tests.map(t => ({ ...t, type: 'test' as const }))];
    }

    if (searchQuery) {
      items = items.filter(i => i.title.toLowerCase().includes(searchQuery.toLowerCase()));
    }

    if (showFavoritesOnly) {
      items = items.filter(i => favorites.has(`${i.type}-${i.id}`));
    }

    if (sortBy === 'name') {
      items.sort((a, b) => a.title.localeCompare(b.title));
    }

    return items;
  }, [course.roadmap, tests, filterType, searchQuery, sortBy, showFavoritesOnly, favorites]);

  // Calculate progress
  const progress = useMemo(() => {
    const total = course.roadmap.length + tests.length;
    const completed = course.roadmap.filter(l => (l.videos?.length || 0) > 0 || Boolean(l.content)).length + tests.filter(t => t.questions?.length > 0).length;
    return total > 0 ? Math.round((completed / total) * 100) : 0;
  }, [course.roadmap, tests]);

  // Handle delete confirmation
  const handleDeleteConfirm = useCallback(() => {
    if (!deleteModal) return;
    
    if (deleteModal.type === 'lesson') {
      onDeleteLesson?.();
    } else {
      onDeleteTest?.(deleteModal.id);
    }
    
    showToast(`${deleteModal.type === 'lesson' ? 'Lesson' : 'Test'} deleted`, 'success');
    setDeleteModal(null);
  }, [deleteModal, onDeleteLesson, onDeleteTest, showToast]);

  // Save handler
  const handleSave = async () => {
    if (onSave) {
      await onSave();
    } else if (editingLesson !== null) {
      onSaveLesson?.();
    } else if (typeof editingTest === 'number') {
      onSaveTest?.(editingTest);
    }
  };

  return (
    <div className={`relative flex h-full w-full overflow-hidden transition-colors duration-500 ${
      darkMode ? 'dark' : ''
    } ${isFullscreen ? 'fixed inset-0 z-40 bg-white dark:bg-slate-950' : ''}`}>
      
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-violet-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-violet-950/30" />
      
      {/* Toasts */}
      <div className="fixed top-6 right-6 z-50 space-y-3">
        {toasts.map(toast => (
          <Toast key={toast.id} message={toast.message} type={toast.type} onClose={() => removeToast(toast.id)} />
        ))}
      </div>

      {/* Command Palette */}
      <CommandPalette
        isOpen={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
        lessons={course.roadmap}
        tests={tests}
        onLessonSelect={(id) => { onLessonSelect(id); onTestSelect?.(null); }}
        onTestSelect={(id) => { onTestSelect?.(id); }}
        onAddLesson={() => { onAddLesson?.(); showToast('New lesson added', 'success'); }}
        onAddTest={() => { onAddTest?.(); showToast('New test added', 'success'); }}
      />

      {/* Keyboard Shortcuts Modal */}
      <KeyboardShortcuts isOpen={keyboardShortcutsOpen} onClose={() => setKeyboardShortcutsOpen(false)} />

      {/* Delete Confirmation Modal */}
      {deleteModal && (
        <DeleteConfirmModal
          isOpen={deleteModal.isOpen}
          title={`Delete ${deleteModal.type}?`}
          message={`Are you sure you want to delete "${deleteModal.title}"? This action cannot be undone.`}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeleteModal(null)}
        />
      )}

      {/* LEFT SIDEBAR */}
      <div 
        style={{ width: sidebarOpen ? sidebarWidth : 0 }}
        className={`relative flex-shrink-0 border-r border-slate-200/50 dark:border-slate-800/50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl flex flex-col transition-all duration-500 ease-out ${
          sidebarOpen ? '' : 'opacity-0 overflow-hidden'
        }`}
      >
        <BackgroundOrbs />
        
        {/* Sidebar Header */}
        <div className="relative z-10 p-5 border-b border-slate-200/50 dark:border-slate-800/50">
          {/* Course Info */}
          <div className="flex items-center gap-4 mb-5">
            <ProgressRing progress={progress} />
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-slate-900 dark:text-white truncate">{course.title}</h3>
              <p className="text-sm text-slate-500 mt-0.5">{course.roadmap.length} lessons • {tests.length} tests</p>
            </div>
          </div>

          {/* Search */}
          <div className="relative group mb-4">
            <div className="absolute -inset-1 bg-gradient-to-r from-violet-500 to-purple-500 rounded-2xl blur opacity-0 group-focus-within:opacity-20 transition-opacity duration-300" />
            <div className="relative flex items-center">
              <Search size={16} className="absolute left-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search content..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-10 py-3 bg-slate-100/80 dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 rounded-xl text-sm focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 dark:focus:ring-violet-400/50 transition-all placeholder:text-slate-400 outline-none"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <X size={14} />
                </button>
              )}
            </div>
          </div>

          {/* Filter & Sort */}
          <div className="flex items-center gap-2">
            <div className="flex-1 flex bg-slate-100/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl p-1 border border-slate-200/50 dark:border-slate-700/50">
              {(['all', 'lessons', 'tests'] as const).map(type => (
                <button
                  key={type}
                  onClick={() => setFilterType(type)}
                  className={`flex-1 py-2 px-3 text-xs font-semibold rounded-lg transition-all duration-300 ${
                    filterType === type
                      ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-md'
                      : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                  }`}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </button>
              ))}
            </div>
            <button
              onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
              className={`p-2.5 rounded-xl transition-all duration-300 border ${
                showFavoritesOnly
                  ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 border-yellow-200 dark:border-yellow-800 shadow-lg shadow-yellow-500/20'
                  : 'bg-slate-100/80 dark:bg-slate-800/80 text-slate-500 border-slate-200/50 dark:border-slate-700/50 hover:text-slate-700'
              }`}
              title="Show favorites only"
            >
              <Star size={16} className={showFavoritesOnly ? 'fill-current' : ''} />
            </button>
          </div>
        </div>

        {/* Add Buttons */}
        <div className="relative z-10 p-4 border-b border-slate-200/50 dark:border-slate-800/50 flex gap-3">
          <button
            onClick={() => { onAddLesson?.(); showToast('New lesson added', 'success'); }}
            className="flex-1 flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-xl font-semibold text-sm transition-all shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-[1.02] active:scale-[0.98]"
          >
            <Plus size={16} />
            Lesson
          </button>
          <button
            onClick={() => { onAddTest?.(); showToast('New test added', 'success'); }}
            className="flex-1 flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white rounded-xl font-semibold text-sm transition-all shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 hover:scale-[1.02] active:scale-[0.98]"
          >
            <Plus size={16} />
            Test
          </button>
        </div>

        {/* Scrollable List */}
        <div className="relative z-10 flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
          {filteredItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-slate-400">
              <div className="w-20 h-20 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 rounded-3xl flex items-center justify-center mb-4 shadow-inner">
                <FolderOpen size={32} className="text-slate-400" />
              </div>
              <p className="font-semibold text-slate-600 dark:text-slate-400">No items found</p>
              <p className="text-sm mt-1">Try adjusting your filters</p>
            </div>
          ) : (
            filteredItems.map((item, index) => (
              <SidebarItem
                key={`${item.type}-${item.id}`}
                item={item}
                index={index}
                isSelected={
                  (item.type === 'lesson' && item.id === selectedLesson && !selectedTest) ||
                  (item.type === 'test' && item.id === selectedTest)
                }
                onSelect={() => {
                  if (item.type === 'lesson') {
                    onLessonSelect(item.id);
                    onTestSelect?.(null);
                  } else {
                    onTestSelect?.(item.id);
                  }
                }}
                onDuplicate={() => {
                  if (item.type === 'lesson') onDuplicateLesson?.(item.id);
                  else onDuplicateTest?.(item.id);
                  showToast(`${item.type} duplicated`, 'success');
                }}
                onDelete={() => setDeleteModal({ isOpen: true, type: item.type, id: item.id, title: item.title })}
                onToggleFavorite={() => toggleFavorite(item.type, item.id)}
                isFavorite={favorites.has(`${item.type}-${item.id}`)}
              />
            ))
          )}
        </div>

        {/* Sidebar Footer */}
        <div className="relative z-10 p-4 border-t border-slate-200/50 dark:border-slate-800/50 bg-slate-50/50 dark:bg-slate-800/30 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setKeyboardShortcutsOpen(true)}
              className="flex items-center gap-2 text-xs font-medium text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
            >
              <Keyboard size={14} />
              <span>Shortcuts</span>
            </button>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="p-2.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-slate-500 transition-all hover:scale-105"
                title="Toggle dark mode"
              >
                {darkMode ? <Sun size={16} /> : <Moon size={16} />}
              </button>
              <button
                onClick={() => setCommandPaletteOpen(true)}
                className="p-2.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-slate-500 transition-all hover:scale-105"
                title="Command palette (⌘K)"
              >
                <Command size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Resize Handle */}
      {sidebarOpen && (
        <div
          onMouseDown={handleMouseDown}
          className={`relative w-1 hover:w-1.5 cursor-col-resize transition-all duration-300 group ${
            isResizing ? 'w-1.5' : ''
          }`}
        >
          <div className={`absolute inset-0 bg-gradient-to-b from-violet-500 via-purple-500 to-violet-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
            isResizing ? 'opacity-100' : ''
          }`} />
        </div>
      )}

      {/* RIGHT EDITOR PANE */}
      <div className="relative flex-1 flex flex-col h-full overflow-hidden bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
        
        {/* Toggle Sidebar Button */}
        <button 
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className={`absolute left-4 top-4 z-20 p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xl rounded-xl text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-all duration-300 hover:scale-105 hover:shadow-2xl ${
            sidebarOpen ? 'opacity-0 pointer-events-none -translate-x-4' : 'opacity-100 translate-x-0'
          }`}
        >
          <PanelLeft size={18} />
        </button>

        {/* Editor Header */}
        <div className="relative h-16 flex items-center justify-between px-6 border-b border-slate-200/50 dark:border-slate-800/50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl">
          <div className="flex items-center gap-4">
            {sidebarOpen && (
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-2.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-all"
              >
                <PanelLeftClose size={18} />
              </button>
            )}
            
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm">
              <span className="text-slate-400 font-medium">{course.title}</span>
              <ChevronRight size={14} className="text-slate-300" />
              {selectedTest && currentTest ? (
                <span className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                  <div className="p-1.5 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
                    <FileText size={14} className="text-amber-600 dark:text-amber-400" />
                  </div>
                  {currentTest.title}
                </span>
              ) : currentLesson ? (
                <span className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                  <div className="p-1.5 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                    <BookOpen size={14} className="text-blue-600 dark:text-blue-400" />
                  </div>
                  {currentLesson.title}
                </span>
              ) : (
                <span className="text-slate-400">Select an item</span>
              )}
            </div>
          </div>

          {/* <div className="flex items-center gap-2">
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-2.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-slate-500 transition-all hover:scale-105"
              title={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
            >
              {isFullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
            </button>

            <button
              onClick={() => setKeyboardShortcutsOpen(true)}
              className="p-2.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-slate-500 transition-all hover:scale-105"
              title="Help"
            >
              <HelpCircle size={18} />
            </button>
          </div> */}
        </div>

        {/* Editor Content */}
        <div className="relative flex-1 overflow-hidden">
          {selectedTest && currentTest ? (
            <div className="h-full overflow-y-auto custom-scrollbar">
              <TestEditor 
                test={currentTest} 
                editingTest={editingTest ?? null} 
                onEdit={onEditTest!} 
                onSave={onSaveTest!} 
                onCancel={onCancelTest!} 
                onDelete={() => setDeleteModal({ isOpen: true, type: 'test', id: currentTest.id, title: currentTest.title })} 
                onUpdateTest={(p) => onUpdateTest?.(currentTest.id, p)}
                onUpdateQuestion={(qid, f, v) => onUpdateTestQuestion?.(currentTest.id, qid, f, v)}
              />
            </div>
          ) : currentLesson ? (
            <div className="h-full overflow-hidden flex flex-col">
              <LessonEditor
                lesson={currentLesson}
                editingLesson={editingLesson}
                lessonTab={lessonTab}
                onLessonTabChange={onLessonTabChange}
                onEdit={onEditLesson!} 
                onSave={onSaveLesson!} 
                onSaveCourse={onSave}
                onCancel={onCancelEdit!} 
                onDelete={() => setDeleteModal({ isOpen: true, type: 'lesson', id: currentLesson.id, title: currentLesson.title })}
                onUpdateLesson={onUpdateLesson!}
                onVideoUpload={onVideoUpload!}
                onVideoRemove={onVideoRemove!}
                onAddAttachment={(f, u, title) => onAddAttachment?.(currentLesson!.id, f, u, title)}
                onRemoveAttachment={(i) => onRemoveAttachment?.(currentLesson!.id, i)}
              />
            </div>
          ) : (
            /* Empty State */
            <div className="h-full flex flex-col items-center justify-center text-slate-400 p-8">
              <BackgroundOrbs />
              
              <div className="relative z-10">
                <div className="relative w-28 h-28 mx-auto mb-8">
                  <div className="absolute inset-0 bg-gradient-to-br from-violet-500 to-purple-600 rounded-3xl blur-2xl opacity-30 animate-pulse" />
                  <div className="relative w-full h-full bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 rounded-3xl flex items-center justify-center shadow-2xl">
                    <Layout size={44} className="text-slate-400" />
                  </div>
                </div>
                
                <h3 className="text-2xl font-bold text-slate-700 dark:text-slate-300 mb-3 text-center">No item selected</h3>
                <p className="text-center max-w-md mb-8 leading-relaxed">Select a lesson or test from the sidebar to start editing, or create a new one.</p>
                
                <div className="flex gap-4 justify-center">
                  <button
                    onClick={() => { onAddLesson?.(); showToast('New lesson added', 'success'); }}
                    className="flex items-center gap-2 px-6 py-3.5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl font-semibold text-sm hover:shadow-xl hover:shadow-blue-500/25 transition-all hover:scale-105"
                  >
                    <Plus size={18} />
                    Add Lesson
                  </button>
                  <button
                    onClick={() => { onAddTest?.(); showToast('New test added', 'success'); }}
                    className="flex items-center gap-2 px-6 py-3.5 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-xl font-semibold text-sm hover:shadow-xl hover:shadow-amber-500/25 transition-all hover:scale-105"
                  >
                    <Plus size={18} />
                    Add Test
                  </button>
                </div>

                {/* Quick tips */}
                <div className="mt-12 p-6 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl border border-slate-200/50 dark:border-slate-700/50 max-w-md shadow-xl">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl shadow-lg shadow-violet-500/25">
                      <Zap size={16} className="text-white" />
                    </div>
                    <span className="font-bold text-slate-700 dark:text-slate-300">Quick Tips</span>
                  </div>
                  <ul className="space-y-3 text-sm text-slate-500">
                    <li className="flex items-center gap-3">
                      <kbd className="px-2 py-1 bg-slate-100 dark:bg-slate-700 rounded-lg text-xs font-medium border border-slate-200 dark:border-slate-600">⌘K</kbd>
                      <span>Open command palette</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <kbd className="px-2 py-1 bg-slate-100 dark:bg-slate-700 rounded-lg text-xs font-medium border border-slate-200 dark:border-slate-600">⌘S</kbd>
                      <span>Save changes</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <kbd className="px-2 py-1 bg-slate-100 dark:bg-slate-700 rounded-lg text-xs font-medium border border-slate-200 dark:border-slate-600">?</kbd>
                      <span>Show all shortcuts</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Floating Save Button */}
      {/* <FloatingSaveButton
        onSave={handleSave}
        hasUnsavedChanges={hasUnsavedChanges}
        isEditing={editingLesson !== null || editingTest !== null}
      /> */}

      {/* Global Styles */}
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes scale-in-bounce {
          0% { opacity: 0; transform: scale(0.9); }
          50% { transform: scale(1.02); }
          100% { opacity: 1; transform: scale(1); }
        }
        
        @keyframes slide-in-right {
          from { opacity: 0; transform: translateX(100%); }
          to { opacity: 1; transform: translateX(0); }
        }
        
        .animate-fade-in { animation: fade-in 0.2s ease-out; }
        .animate-scale-in-bounce { animation: scale-in-bounce 0.3s ease-out; }
        .animate-slide-in-right { animation: slide-in-right 0.4s ease-out; }
        
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(0, 0, 0, 0.1);
          border-radius: 3px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(0, 0, 0, 0.2);
        }
        
        .dark .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
        }
        
        .dark .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.2);
        }
      `}</style>
    </div>
  );
};

export default CourseContentSection;
