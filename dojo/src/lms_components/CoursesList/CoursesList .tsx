import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import {
  Plus, BookOpen, Calendar, Users, Loader2, AlertCircle, ChevronRight,
  Trash2, Search, Clock, Building2, LayoutGrid, List, Filter, X,
  ChevronDown, ArrowUpDown, ArrowDownAZ, ArrowUpAZ, Eye, Edit3,
  Copy, CheckCircle, XCircle, RefreshCw, Sparkles, TrendingUp,
  Layers, GraduationCap, BarChart3, ChevronLeft, MoreVertical,
  Download, Upload, Star, Zap, FileText, Play, Pause, Check
} from "lucide-react";
import { CourseContentManager } from '../CreateCourse/CreateCourse';

// Type definitions
interface CourseStats {
  accuracy: number;
  completion: number;
  enrolled: number;
  rating: number;
  duration: string;
}

interface Lesson {
  id: number;
  title: string;
  duration: string;
  completed: boolean;
  sample?: boolean;
  content: string;
  order?: number;
}

interface Course {
  id: number;
  title: string;
  instructor_name: string;
  department: string;
  level: string;
  duration: string;
  description: string;
  introduction: string;
  photo: string;
  roadmap: Lesson[];
  stats: CourseStats;
  tags: string[];
  questions: number;
  updated: string;
  is_published: boolean;
}

// --- STATS CARD COMPONENT ---
const StatCard: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: number | string;
  subtext?: string;
  gradient: string;
}> = ({ icon, label, value, subtext, gradient }) => (
  <div className="relative overflow-hidden bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 hover:shadow-xl transition-all duration-300 group">
    <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${gradient} opacity-10 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-500`} />
    <div className="relative flex items-center gap-4">
      <div className={`p-3 rounded-xl bg-gradient-to-br ${gradient} shadow-lg`}>
        {icon}
      </div>
      <div>
        <p className="text-2xl font-bold text-slate-900 dark:text-white">{value}</p>
        <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
        {subtext && <p className="text-xs text-emerald-500 font-medium mt-0.5">{subtext}</p>}
      </div>
    </div>
  </div>
);

// --- COURSE PREVIEW MODAL ---
const CoursePreviewModal: React.FC<{
  course: Course | null;
  onClose: () => void;
  onEdit: (id: number) => void;
}> = ({ course, onClose, onEdit }) => {
  if (!course) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md" onClick={onClose}>
      <div 
        className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Header Image */}
        <div className="relative h-48 overflow-hidden">
          {course.photo ? (
            <img src={course.photo} alt={course.title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
              <BookOpen className="w-16 h-16 text-white/50" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-white/20 backdrop-blur-sm rounded-xl text-white hover:bg-white/30 transition-colors"
          >
            <X size={20} />
          </button>
          <div className="absolute bottom-4 left-4 right-4">
            <div className="flex items-center gap-2 mb-2">
              <span className={`px-2 py-1 text-xs font-bold rounded-lg ${
                course.level === 'Beginner' ? 'bg-emerald-500' :
                course.level === 'Intermediate' ? 'bg-blue-500' : 'bg-purple-500'
              } text-white`}>
                {course.level}
              </span>
              <span className={`px-2 py-1 text-xs font-bold rounded-lg ${
                course.is_published ? 'bg-emerald-500' : 'bg-amber-500'
              } text-white`}>
                {course.is_published ? 'Published' : 'Draft'}
              </span>
            </div>
            <h2 className="text-2xl font-bold text-white">{course.title}</h2>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="text-center p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
              <Users size={18} className="mx-auto text-violet-500 mb-1" />
              <p className="text-sm font-bold text-slate-900 dark:text-white">{course.instructor_name}</p>
              <p className="text-xs text-slate-500">Instructor</p>
            </div>
            <div className="text-center p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
              <Building2 size={18} className="mx-auto text-teal-500 mb-1" />
              <p className="text-sm font-bold text-slate-900 dark:text-white">{course.department || 'General'}</p>
              <p className="text-xs text-slate-500">Department</p>
            </div>
            <div className="text-center p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
              <Clock size={18} className="mx-auto text-amber-500 mb-1" />
              <p className="text-sm font-bold text-slate-900 dark:text-white">{course.duration || 'N/A'}</p>
              <p className="text-xs text-slate-500">Duration</p>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-2">Description</h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{course.description || 'No description available.'}</p>
          </div>

          {course.tags && course.tags.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-2">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {course.tags.map((tag, idx) => (
                  <span key={idx} className="px-3 py-1 bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400 text-xs font-medium rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {course.roadmap && course.roadmap.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-2">
                Course Content ({course.roadmap.length} lessons)
              </h3>
              <div className="space-y-2 max-h-[150px] overflow-y-auto custom-scrollbar">
                {course.roadmap.slice(0, 5).map((lesson, idx) => (
                  <div key={lesson.id} className="flex items-center gap-3 p-2 bg-slate-50 dark:bg-slate-800 rounded-lg">
                    <span className="w-6 h-6 bg-violet-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <span className="text-sm text-slate-700 dark:text-slate-300 flex-1 truncate">{lesson.title}</span>
                    <span className="text-xs text-slate-500">{lesson.duration}</span>
                  </div>
                ))}
                {course.roadmap.length > 5 && (
                  <p className="text-xs text-slate-500 text-center py-2">
                    +{course.roadmap.length - 5} more lessons
                  </p>
                )}
              </div>
            </div>
          )}

          <div className="flex gap-3">
            <button
              onClick={() => onEdit(course.id)}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-violet-600 to-purple-600 text-white font-bold rounded-xl hover:shadow-lg transition-all"
            >
              <Edit3 size={18} />
              Edit Course
            </button>
            <button
              onClick={onClose}
              className="px-4 py-3 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-bold rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- COURSE TABLE ROW ---
const CourseTableRow: React.FC<{
  course: Course;
  isSelected: boolean;
  onSelect: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onPreview: () => void;
  onTogglePublish: () => void;
  onDuplicate: () => void;
}> = ({ course, isSelected, onSelect, onEdit, onDelete, onPreview, onTogglePublish, onDuplicate }) => {
  const [showActions, setShowActions] = useState(false);

  return (
    <div className={`flex items-center gap-4 px-4 py-3 border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors ${isSelected ? 'bg-violet-50 dark:bg-violet-900/20' : ''}`}>
      <button
        onClick={onSelect}
        className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
          isSelected
            ? 'bg-violet-500 border-violet-500'
            : 'border-slate-300 dark:border-slate-600 hover:border-violet-400'
        }`}
      >
        {isSelected && <Check size={12} className="text-white" />}
      </button>

      <div className="w-16 h-12 rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-800 shrink-0">
        {course.photo ? (
          <img src={course.photo} alt={course.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-violet-100 to-purple-100 dark:from-violet-900/30 dark:to-purple-900/30">
            <BookOpen size={16} className="text-violet-400" />
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <h3 className="text-sm font-semibold text-slate-900 dark:text-white truncate">{course.title}</h3>
        <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
          <span className="flex items-center gap-1">
            <Users size={10} />
            {course.instructor_name}
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <Building2 size={10} />
            {course.department || 'General'}
          </span>
        </div>
      </div>

      <span className={`hidden md:inline-flex px-2 py-1 text-[10px] font-bold rounded-lg ${
        course.level === 'Beginner' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' :
        course.level === 'Intermediate' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
        'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'
      }`}>
        {course.level}
      </span>

      <span className="hidden lg:flex items-center gap-1 text-xs text-slate-500 w-20">
        <Clock size={12} />
        {course.duration || 'N/A'}
      </span>

      <button
        onClick={onTogglePublish}
        className={`hidden sm:flex items-center gap-1 px-2 py-1 text-[10px] font-bold rounded-lg transition-colors ${
          course.is_published
            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 hover:bg-emerald-200'
            : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 hover:bg-amber-200'
        }`}
      >
        {course.is_published ? <CheckCircle size={10} /> : <XCircle size={10} />}
        {course.is_published ? 'Published' : 'Draft'}
      </button>

      <span className="hidden xl:block text-xs text-slate-500 w-24">
        {new Date(course.updated).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
      </span>

      <div className="relative">
        <button
          onClick={() => setShowActions(!showActions)}
          className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
        >
          <MoreVertical size={16} className="text-slate-400" />
        </button>
        
        {showActions && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setShowActions(false)} />
            <div className="absolute right-0 top-10 w-48 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl z-20 py-1 overflow-hidden">
              <button onClick={() => { onPreview(); setShowActions(false); }} className="w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200">
                <Eye size={14} /> Quick Preview
              </button>
              <button onClick={() => { onEdit(); setShowActions(false); }} className="w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200">
                <Edit3 size={14} /> Edit Course
              </button>
              <button onClick={() => { onDuplicate(); setShowActions(false); }} className="w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200">
                <Copy size={14} /> Duplicate
              </button>
              <div className="h-px bg-slate-200 dark:bg-slate-700 my-1" />
              <button onClick={() => { onDelete(); setShowActions(false); }} className="w-full flex items-center gap-2 px-4 py-2 text-sm text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20">
                <Trash2 size={14} /> Delete
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

// --- COURSE CARD ---
const CourseCard: React.FC<{
  course: Course;
  isSelected: boolean;
  onSelect: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onPreview: () => void;
  onTogglePublish: () => void;
  onDuplicate: () => void;
}> = ({ course, isSelected, onSelect, onEdit, onDelete, onPreview, onTogglePublish, onDuplicate }) => {
  const [showActions, setShowActions] = useState(false);

  const getLevelColor = (level: string) => {
    const colors: { [key: string]: string } = {
      'Beginner': 'bg-emerald-500',
      'Intermediate': 'bg-blue-500',
      'Advanced': 'bg-purple-500'
    };
    return colors[level] || colors['Beginner'];
  };

  return (
    <div className={`group relative bg-white dark:bg-slate-900 rounded-2xl border-2 transition-all duration-300 cursor-pointer overflow-hidden flex flex-col h-full hover:-translate-y-1 hover:shadow-xl ${
      isSelected ? 'border-violet-500 shadow-violet-100 dark:shadow-violet-900/30' : 'border-slate-200 dark:border-slate-800'
    }`}>
      <button
        onClick={(e) => { e.stopPropagation(); onSelect(); }}
        className={`absolute top-3 left-3 z-20 w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${
          isSelected
            ? 'bg-violet-500 border-violet-500 shadow-lg'
            : 'bg-white/80 backdrop-blur-sm border-slate-200 opacity-0 group-hover:opacity-100'
        }`}
      >
        {isSelected && <Check size={14} className="text-white" />}
      </button>

      <div className="relative h-40 overflow-hidden" onClick={onPreview}>
        {course.photo ? (
          <img
            src={course.photo}
            alt={course.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-violet-100 to-purple-100 dark:from-violet-900/30 dark:to-purple-900/30 flex items-center justify-center">
            <BookOpen className="h-12 w-12 text-violet-300" />
          </div>
        )}
        
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <button className="px-4 py-2 bg-white text-slate-900 rounded-lg font-semibold text-sm flex items-center gap-2 hover:bg-slate-100 transition-colors">
            <Eye size={16} />
            Preview
          </button>
        </div>

        <div className="absolute top-3 right-3 flex items-center gap-2 z-10">
          <span className={`text-[10px] font-bold px-2 py-1 rounded-lg text-white shadow-lg ${getLevelColor(course.level)}`}>
            {course.level}
          </span>
        </div>

        <div className="absolute bottom-3 left-3 z-10">
          <span className={`text-[10px] font-bold px-2 py-1 rounded-lg text-white shadow-lg ${
            course.is_published ? 'bg-emerald-500' : 'bg-amber-500'
          }`}>
            {course.is_published ? 'Published' : 'Draft'}
          </span>
        </div>
      </div>

      <div className="p-4 flex flex-col flex-1">
        <h3 
          onClick={onEdit}
          className="text-base font-bold text-slate-900 dark:text-white mb-2 line-clamp-2 leading-snug group-hover:text-violet-600 transition-colors cursor-pointer"
        >
          {course.title}
        </h3>

        <div className="flex items-center justify-between gap-2 mb-3">
          <p className="text-xs text-slate-500 flex items-center gap-1.5 truncate">
            <Users size={12} className="text-violet-400 shrink-0" />
            <span className="truncate">{course.instructor_name}</span>
          </p>
          <div className="flex items-center gap-1 bg-teal-50 dark:bg-teal-900/30 px-2 py-0.5 rounded-md shrink-0">
            <Building2 size={10} className="text-teal-600 dark:text-teal-400" />
            <span className="text-[10px] font-bold text-teal-700 dark:text-teal-400 uppercase">
              {course.department || 'General'}
            </span>
          </div>
        </div>

        <div className="mb-3 min-h-[24px]">
          {course.tags && course.tags.length > 0 ? (
            <div className="flex items-center gap-1 flex-wrap">
              {course.tags.slice(0, 2).map((tag: string, index: number) => (
                <span
                  key={index}
                  className="text-[10px] font-medium px-2 py-0.5 bg-violet-50 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400 rounded-full truncate max-w-[80px]"
                >
                  {tag}
                </span>
              ))}
              {course.tags.length > 2 && (
                <span className="text-[10px] font-medium px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-500 rounded-full">
                  +{course.tags.length - 2}
                </span>
              )}
            </div>
          ) : (
            <span className="text-[10px] text-slate-400 italic">No tags</span>
          )}
        </div>

        <p className="text-slate-500 dark:text-slate-400 text-xs mb-4 line-clamp-2 flex-1">
          {course.description || 'No description available.'}
        </p>

        <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3 text-xs text-slate-500">
            <span className="flex items-center gap-1">
              <Clock size={12} className="text-violet-400" />
              {course.duration || 'N/A'}
            </span>
            <span className="flex items-center gap-1">
              <Calendar size={12} className="text-violet-400" />
              {new Date(course.updated).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </span>
          </div>

          <div className="relative">
            <button
              onClick={(e) => { e.stopPropagation(); setShowActions(!showActions); }}
              className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            >
              <MoreVertical size={14} className="text-slate-400" />
            </button>

            {showActions && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowActions(false)} />
                <div className="absolute right-0 bottom-8 w-44 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl z-20 py-1 overflow-hidden">
                  <button onClick={() => { onEdit(); setShowActions(false); }} className="w-full flex items-center gap-2 px-3 py-2 text-xs hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200">
                    <Edit3 size={12} /> Edit Course
                  </button>
                  <button onClick={() => { onDuplicate(); setShowActions(false); }} className="w-full flex items-center gap-2 px-3 py-2 text-xs hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200">
                    <Copy size={12} /> Duplicate
                  </button>
                  <button onClick={() => { onTogglePublish(); setShowActions(false); }} className="w-full flex items-center gap-2 px-3 py-2 text-xs hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200">
                    {course.is_published ? <Pause size={12} /> : <Play size={12} />}
                    {course.is_published ? 'Unpublish' : 'Publish'}
                  </button>
                  <div className="h-px bg-slate-200 dark:bg-slate-700 my-1" />
                  <button onClick={() => { onDelete(); setShowActions(false); }} className="w-full flex items-center gap-2 px-3 py-2 text-xs text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20">
                    <Trash2 size={12} /> Delete
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// --- PAGINATION ---
const Pagination: React.FC<{
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange: (count: number) => void;
}> = ({ currentPage, totalPages, totalItems, itemsPerPage, onPageChange, onItemsPerPageChange }) => {
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-700 rounded-b-2xl">
      <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
        <span>Showing {startItem}-{endItem} of {totalItems}</span>
        <select
          value={itemsPerPage}
          onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
          className="px-2 py-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs"
        >
          <option value={8}>8 per page</option>
          <option value={12}>12 per page</option>
          <option value={24}>24 per page</option>
          <option value={48}>48 per page</option>
        </select>
      </div>

      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft size={18} />
        </button>
        
        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
          let page;
          if (totalPages <= 5) {
            page = i + 1;
          } else if (currentPage <= 3) {
            page = i + 1;
          } else if (currentPage >= totalPages - 2) {
            page = totalPages - 4 + i;
          } else {
            page = currentPage - 2 + i;
          }
          return (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`min-w-[36px] h-9 px-2 rounded-lg text-sm font-medium transition-colors ${
                page === currentPage
                  ? 'bg-violet-500 text-white'
                  : 'hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400'
              }`}
            >
              {page}
            </button>
          );
        })}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
};

// --- MAIN COMPONENT ---
const CourseList = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null);
  const [showManager, setShowManager] = useState(false);
  
  // =====================================================
  // FIX: Search is now purely client-side (instant filtering)
  // No more debounced API calls that cause input lag
  // =====================================================
  const [searchQuery, setSearchQuery] = useState('');
  
  const [filterDepartment, setFilterDepartment] = useState('all');
  const [filterLevel, setFilterLevel] = useState('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'published' | 'draft'>('all');
  const [sortBy, setSortBy] = useState<'title' | 'updated' | 'duration'>('updated');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedCourses, setSelectedCourses] = useState<Set<number>>(new Set());
  
  const [previewCourse, setPreviewCourse] = useState<Course | null>(null);
  
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);

  // Keep a ref to the search input so it never loses focus
  const searchInputRef = useRef<HTMLInputElement>(null);

  const API_URL = 'http://localhost:8000/lms';

  // =====================================================
  // FIX: Fetch ALL courses once on mount (no search param)
  // =====================================================
  const fetchAllCourses = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const response = await fetch(`${API_URL}/courses/`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      const normalizedCourses = Array.isArray(data)
        ? data
        : Array.isArray(data?.results)
          ? data.results
          : Array.isArray(data?.data)
            ? data.data
            : [];
      setCourses(normalizedCourses);
    } catch (err) {
      setError('Failed to fetch courses. Please check your backend connection.');
      console.error('Failed to fetch courses:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Load courses once on mount
  useEffect(() => {
    fetchAllCourses();
  }, [fetchAllCourses]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filterDepartment, filterLevel, filterStatus, sortBy, sortOrder, searchQuery]);

  // Derived Data
  const departments = useMemo(() => {
    const depts = courses.map(c => c.department || 'General');
    return Array.from(new Set(depts)).sort();
  }, [courses]);

  const levels = useMemo(() => {
    const lvls = courses.map(c => c.level);
    return Array.from(new Set(lvls)).filter(Boolean).sort();
  }, [courses]);

  // =====================================================
  // FIX: Client-side search + filter + sort
  // Search matches title, instructor, department, description, tags
  // Instant - no API call, no lag
  // =====================================================
  const filteredAndSortedCourses = useMemo(() => {
    let result = [...courses];

    // CLIENT-SIDE SEARCH - Matches multiple fields
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter(c => {
        const searchableText = [
          c.title,
          c.instructor_name,
          c.department,
          c.description,
          c.level,
          ...(c.tags || [])
        ].join(' ').toLowerCase();
        return searchableText.includes(query);
      });
    }

    // Filter by department
    if (filterDepartment !== 'all') {
      result = result.filter(c => (c.department || 'General') === filterDepartment);
    }

    // Filter by level
    if (filterLevel !== 'all') {
      result = result.filter(c => c.level === filterLevel);
    }

    // Filter by status
    if (filterStatus !== 'all') {
      result = result.filter(c => filterStatus === 'published' ? c.is_published : !c.is_published);
    }

    // Sort
    result.sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case 'title':
          comparison = a.title.localeCompare(b.title);
          break;
        case 'updated':
          comparison = new Date(a.updated).getTime() - new Date(b.updated).getTime();
          break;
        case 'duration':
          comparison = (a.duration || '').localeCompare(b.duration || '');
          break;
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return result;
  }, [courses, searchQuery, filterDepartment, filterLevel, filterStatus, sortBy, sortOrder]);

  const paginatedCourses = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredAndSortedCourses.slice(start, start + itemsPerPage);
  }, [filteredAndSortedCourses, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredAndSortedCourses.length / itemsPerPage);

  // Stats (based on ALL courses, not filtered)
  const stats = useMemo(() => ({
    total: courses.length,
    published: courses.filter(c => c.is_published).length,
    draft: courses.filter(c => !c.is_published).length,
    departments: new Set(courses.map(c => c.department || 'General')).size
  }), [courses]);

  // Handlers
  const handleCreateNewCourse = () => {
    setSelectedCourseId(null);
    setShowManager(true);
  };

  const handleEditCourse = (courseId: number) => {
    setSelectedCourseId(courseId);
    setShowManager(true);
  };

  const handleDeleteCourse = async (courseId: number, courseTitle: string) => {
    if (!window.confirm(`Delete "${courseTitle}"? This cannot be undone.`)) return;

    try {
      const response = await fetch(`${API_URL}/courses/${courseId}/`, { method: 'DELETE' });
      if (!response.ok && response.status !== 204) throw new Error('Failed');
      setCourses(prev => prev.filter(c => c.id !== courseId));
      setSelectedCourses(prev => { prev.delete(courseId); return new Set(prev); });
    } catch (err) {
      alert(`Failed to delete "${courseTitle}".`);
    }
  };

  const handleDuplicateCourse = async (course: Course) => {
    try {
      const newCourse = {
        ...course,
        title: `${course.title} (Copy)`,
        is_published: false
      };
      delete (newCourse as any).id;
      
      const response = await fetch(`${API_URL}/courses/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCourse)
      });
      
      if (response.ok) {
        const created = await response.json();
        setCourses(prev => [created, ...prev]);
      }
    } catch (err) {
      console.error('Failed to duplicate:', err);
    }
  };

  const handleTogglePublish = async (course: Course) => {
    try {
      const response = await fetch(`${API_URL}/courses/${course.id}/`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_published: !course.is_published })
      });
      
      if (response.ok) {
        setCourses(prev => prev.map(c => c.id === course.id ? { ...c, is_published: !c.is_published } : c));
      }
    } catch (err) {
      console.error('Failed to toggle publish:', err);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedCourses.size === 0) return;
    if (!window.confirm(`Delete ${selectedCourses.size} courses?`)) return;

    for (const id of selectedCourses) {
      await fetch(`${API_URL}/courses/${id}/`, { method: 'DELETE' }).catch(() => {});
    }
    setCourses(prev => prev.filter(c => !selectedCourses.has(c.id)));
    setSelectedCourses(new Set());
  };

  const handleBulkPublish = async (publish: boolean) => {
    for (const id of selectedCourses) {
      await fetch(`${API_URL}/courses/${id}/`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_published: publish })
      }).catch(() => {});
    }
    setCourses(prev => prev.map(c => selectedCourses.has(c.id) ? { ...c, is_published: publish } : c));
    setSelectedCourses(new Set());
  };

  const handleSelectAll = () => {
    if (selectedCourses.size === paginatedCourses.length) {
      setSelectedCourses(new Set());
    } else {
      setSelectedCourses(new Set(paginatedCourses.map(c => c.id)));
    }
  };

  const toggleCourseSelection = (id: number) => {
    setSelectedCourses(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) newSet.delete(id);
      else newSet.add(id);
      return newSet;
    });
  };

  const resetFilters = () => {
    setFilterDepartment('all');
    setFilterLevel('all');
    setFilterStatus('all');
    setSortBy('updated');
    setSortOrder('desc');
    setSearchQuery('');
  };

  const handleBackToList = () => {
    setShowManager(false);
    setSelectedCourseId(null);
    // Refetch all courses
    fetchAllCourses();
  };

  if (showManager) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
        <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 py-4">
          <button
            onClick={handleBackToList}
            className="text-violet-600 hover:text-violet-700 font-medium text-sm flex items-center gap-2 transition-colors"
          >
            ← Back to Course List
          </button>
        </div>
        <CourseContentManager courseId={selectedCourseId} />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-20 h-20 mx-auto mb-6">
            <div className="absolute inset-0 bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl blur-xl opacity-50 animate-pulse" />
            <div className="relative w-full h-full bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl flex items-center justify-center">
              <Loader2 className="w-10 h-10 text-white animate-spin" />
            </div>
          </div>
          <p className="text-slate-500 dark:text-slate-400 font-medium">Loading courses...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-6">
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl p-8 max-w-md w-full border border-slate-200 dark:border-slate-800 text-center">
          <AlertCircle className="h-12 w-12 text-rose-500 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Error Loading Courses</h3>
          <p className="text-slate-500 dark:text-slate-400 mb-6">{error}</p>
          <button
            onClick={fetchAllCourses}
            className="px-6 py-2 bg-violet-600 text-white rounded-xl font-semibold hover:bg-violet-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-500">
      {/* Background Pattern */}
      <div className="fixed inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiM2MzY2ZjEiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDM0aC0ydi00aDJ2NHptMC02di00aC0ydjRoMnptLTYgNmgtMnYtNGgydjR6bTAtNnYtNGgtMnY0aDJ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-50 pointer-events-none" />

      <div className="relative w-full px-4 sm:px-6 lg:px-8 xl:px-12 py-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl blur-lg opacity-50" />
              <div className="relative p-3 bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl shadow-xl">
                <BookOpen size={28} className="text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">Course Management</h1>
              <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-2 mt-1">
                <Sparkles size={14} className="text-violet-500" />
                Create and manage your learning content
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchAllCourses}
              className="p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              title="Refresh"
            >
              <RefreshCw size={18} className="text-slate-500" />
            </button>
            <button
              onClick={handleCreateNewCourse}
              className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-violet-600 to-purple-600 text-white font-bold rounded-xl hover:shadow-lg hover:shadow-violet-500/25 transition-all active:scale-95"
            >
              <Plus size={20} />
              <span className="hidden sm:inline">Create Course</span>
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            icon={<Layers className="w-5 h-5 text-white" />}
            label="Total Courses"
            value={stats.total}
            gradient="from-violet-500 to-purple-600"
          />
          <StatCard
            icon={<CheckCircle className="w-5 h-5 text-white" />}
            label="Published"
            value={stats.published}
            subtext={`${stats.total > 0 ? Math.round((stats.published / stats.total) * 100) : 0}% of total`}
            gradient="from-emerald-500 to-teal-600"
          />
          <StatCard
            icon={<FileText className="w-5 h-5 text-white" />}
            label="Drafts"
            value={stats.draft}
            gradient="from-amber-500 to-orange-600"
          />
          <StatCard
            icon={<Building2 className="w-5 h-5 text-white" />}
            label="Departments"
            value={stats.departments}
            gradient="from-blue-500 to-cyan-600"
          />
        </div>

        {/* Filters & Search */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 mb-6 shadow-sm">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* =====================================================
                FIX: Search input with ref - no debounce, no API call
                Typing is instant, filtering happens in useMemo above
                ===================================================== */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search by title, instructor, department, tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-violet-500/30 focus:border-violet-500 outline-none transition-all"
              />
              {searchQuery && (
                <button 
                  onClick={() => { 
                    setSearchQuery(''); 
                    // Refocus the input after clearing
                    searchInputRef.current?.focus(); 
                  }} 
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            {/* Quick Filters */}
            <div className="flex items-center gap-2 flex-wrap">
              <div className="relative">
                <select
                  value={filterDepartment}
                  onChange={(e) => setFilterDepartment(e.target.value)}
                  className="appearance-none pl-3 pr-8 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-700 dark:text-slate-300 focus:ring-2 focus:ring-violet-500/30 outline-none cursor-pointer"
                >
                  <option value="all">All Departments</option>
                  {departments.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>

              <div className="relative">
                <select
                  value={filterLevel}
                  onChange={(e) => setFilterLevel(e.target.value)}
                  className="appearance-none pl-3 pr-8 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-700 dark:text-slate-300 focus:ring-2 focus:ring-violet-500/30 outline-none cursor-pointer"
                >
                  <option value="all">All Levels</option>
                  {levels.map(l => <option key={l} value={l}>{l}</option>)}
                </select>
                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>

              <div className="flex bg-slate-100 dark:bg-slate-800 rounded-xl p-1">
                {(['all', 'published', 'draft'] as const).map(status => (
                  <button
                    key={status}
                    onClick={() => setFilterStatus(status)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-lg capitalize transition-all ${
                      filterStatus === status
                        ? 'bg-white dark:bg-slate-700 text-violet-600 dark:text-violet-400 shadow-sm'
                        : 'text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setSortOrder(o => o === 'asc' ? 'desc' : 'asc')}
                className="flex items-center gap-1 px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
              >
                {sortOrder === 'asc' ? <ArrowDownAZ size={16} /> : <ArrowUpAZ size={16} />}
              </button>

              <div className="flex bg-slate-100 dark:bg-slate-800 rounded-xl p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white dark:bg-slate-700 shadow-sm text-violet-600' : 'text-slate-500'}`}
                >
                  <LayoutGrid size={16} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white dark:bg-slate-700 shadow-sm text-violet-600' : 'text-slate-500'}`}
                >
                  <List size={16} />
                </button>
              </div>

              {(filterDepartment !== 'all' || filterLevel !== 'all' || filterStatus !== 'all' || searchQuery) && (
                <button
                  onClick={resetFilters}
                  className="px-3 py-2.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-xl text-sm font-medium transition-colors"
                >
                  Reset
                </button>
              )}
            </div>
          </div>

          {/* Active Search Indicator */}
          {searchQuery.trim() && (
            <div className="mt-3 flex items-center gap-2 text-sm">
              <Search size={14} className="text-violet-500" />
              <span className="text-slate-500">
                Searching for "<span className="font-semibold text-violet-600 dark:text-violet-400">{searchQuery}</span>"
              </span>
              <span className="text-slate-400">•</span>
              <span className="text-slate-500">
                <span className="font-semibold text-slate-700 dark:text-slate-300">{filteredAndSortedCourses.length}</span> result{filteredAndSortedCourses.length !== 1 ? 's' : ''}
              </span>
            </div>
          )}

          {/* Bulk Actions */}
          {selectedCourses.size > 0 && (
            <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700 flex items-center gap-3">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                {selectedCourses.size} selected
              </span>
              <button
                onClick={() => handleBulkPublish(true)}
                className="px-3 py-1.5 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-lg text-xs font-semibold hover:bg-emerald-200 transition-colors"
              >
                Publish All
              </button>
              <button
                onClick={() => handleBulkPublish(false)}
                className="px-3 py-1.5 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-lg text-xs font-semibold hover:bg-amber-200 transition-colors"
              >
                Unpublish All
              </button>
              <button
                onClick={handleBulkDelete}
                className="px-3 py-1.5 bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 rounded-lg text-xs font-semibold hover:bg-rose-200 transition-colors"
              >
                Delete All
              </button>
              <button
                onClick={() => setSelectedCourses(new Set())}
                className="text-xs text-slate-500 hover:text-slate-700 ml-auto"
              >
                Clear selection
              </button>
            </div>
          )}
        </div>

        {/* Results Info */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              <span className="font-semibold text-slate-900 dark:text-white">{filteredAndSortedCourses.length}</span>
              {' '}courses found
            </p>
            {paginatedCourses.length > 0 && (
              <button
                onClick={handleSelectAll}
                className="text-xs text-violet-600 dark:text-violet-400 hover:underline font-medium"
              >
                {selectedCourses.size === paginatedCourses.length ? 'Deselect all' : 'Select all on page'}
              </button>
            )}
          </div>
        </div>

        {/* Content */}
        {filteredAndSortedCourses.length === 0 ? (
          <div className="text-center py-20">
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-12 max-w-md mx-auto border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="w-20 h-20 bg-violet-100 dark:bg-violet-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                {searchQuery ? (
                  <Search className="h-10 w-10 text-violet-400" />
                ) : (
                  <BookOpen className="h-10 w-10 text-violet-400" />
                )}
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                {searchQuery || filterDepartment !== 'all' || filterLevel !== 'all' || filterStatus !== 'all'
                  ? 'No courses match your search'
                  : 'No courses yet'}
              </h3>
              <p className="text-slate-500 dark:text-slate-400 mb-8 text-sm">
                {searchQuery
                  ? `No courses found for "${searchQuery}". Try a different search term.`
                  : filterDepartment !== 'all' || filterLevel !== 'all' || filterStatus !== 'all'
                    ? 'Try adjusting your filters.'
                    : 'Get started by creating your first course.'}
              </p>
              {!(searchQuery || filterDepartment !== 'all' || filterLevel !== 'all' || filterStatus !== 'all') ? (
                <button
                  onClick={handleCreateNewCourse}
                  className="bg-gradient-to-r from-violet-600 to-purple-600 text-white px-8 py-3 rounded-xl flex items-center gap-2 hover:shadow-lg transition-all font-bold mx-auto"
                >
                  <Plus size={20} />
                  Create Your First Course
                </button>
              ) : (
                <button
                  onClick={resetFilters}
                  className="text-violet-600 dark:text-violet-400 font-medium hover:underline"
                >
                  Clear all filters
                </button>
              )}
            </div>
          </div>
        ) : (
          <>
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {paginatedCourses.map(course => (
                  <CourseCard
                    key={course.id}
                    course={course}
                    isSelected={selectedCourses.has(course.id)}
                    onSelect={() => toggleCourseSelection(course.id)}
                    onEdit={() => handleEditCourse(course.id)}
                    onDelete={() => handleDeleteCourse(course.id, course.title)}
                    onPreview={() => setPreviewCourse(course)}
                    onTogglePublish={() => handleTogglePublish(course)}
                    onDuplicate={() => handleDuplicateCourse(course)}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                <div className="hidden md:flex items-center gap-4 px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-500 uppercase">
                  <div className="w-5"></div>
                  <div className="w-16">Image</div>
                  <div className="flex-1">Course</div>
                  <div className="w-24">Level</div>
                  <div className="w-20">Duration</div>
                  <div className="w-20">Status</div>
                  <div className="w-24">Updated</div>
                  <div className="w-10"></div>
                </div>
                {paginatedCourses.map(course => (
                  <CourseTableRow
                    key={course.id}
                    course={course}
                    isSelected={selectedCourses.has(course.id)}
                    onSelect={() => toggleCourseSelection(course.id)}
                    onEdit={() => handleEditCourse(course.id)}
                    onDelete={() => handleDeleteCourse(course.id, course.title)}
                    onPreview={() => setPreviewCourse(course)}
                    onTogglePublish={() => handleTogglePublish(course)}
                    onDuplicate={() => handleDuplicateCourse(course)}
                  />
                ))}
              </div>
            )}

            {totalPages > 1 && (
              <div className="mt-6">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  totalItems={filteredAndSortedCourses.length}
                  itemsPerPage={itemsPerPage}
                  onPageChange={setCurrentPage}
                  onItemsPerPageChange={(n) => { setItemsPerPage(n); setCurrentPage(1); }}
                />
              </div>
            )}
          </>
        )}
      </div>

      {/* Preview Modal */}
      <CoursePreviewModal
        course={previewCourse}
        onClose={() => setPreviewCourse(null)}
        onEdit={(id) => { setPreviewCourse(null); handleEditCourse(id); }}
      />

      {/* Scrollbar Styles */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb { background: #475569; }
      `}</style>
    </div>
  );
};

export default CourseList;
