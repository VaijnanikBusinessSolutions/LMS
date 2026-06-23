


import React, { useEffect, useState, useMemo } from 'react';
import { FileText, Link2, Download, ExternalLink, FolderOpen, Search, Calendar, BookOpen, Loader2, AlertCircle, RefreshCw, Filter, ChevronDown, Grid3X3, List, Sparkles } from 'lucide-react';

// Interfaces
interface LessonAttachment {
  id: number;
  lesson: number;
  name: string;
  file: string | null;
  url_link: string | null;
  created_at: string;
  course_title?: string;
  lesson_title?: string;
}

interface GroupedAttachments {
  [key: string]: LessonAttachment[];
}

// Color palette for courses
const courseColors = [
  { bg: 'bg-violet-50 dark:bg-violet-900/20', border: 'border-violet-200 dark:border-violet-800', text: 'text-violet-700 dark:text-violet-300', accent: 'bg-violet-500', light: 'bg-violet-100 dark:bg-violet-900/40', icon: 'text-violet-500 dark:text-violet-400' },
  { bg: 'bg-blue-50 dark:bg-blue-900/20', border: 'border-blue-200 dark:border-blue-800', text: 'text-blue-700 dark:text-blue-300', accent: 'bg-blue-500', light: 'bg-blue-100 dark:bg-blue-900/40', icon: 'text-blue-500 dark:text-blue-400' },
  { bg: 'bg-emerald-50 dark:bg-emerald-900/20', border: 'border-emerald-200 dark:border-emerald-800', text: 'text-emerald-700 dark:text-emerald-300', accent: 'bg-emerald-500', light: 'bg-emerald-100 dark:bg-emerald-900/40', icon: 'text-emerald-500 dark:text-emerald-400' },
  { bg: 'bg-amber-50 dark:bg-amber-900/20', border: 'border-amber-200 dark:border-amber-800', text: 'text-amber-700 dark:text-amber-300', accent: 'bg-amber-500', light: 'bg-amber-100 dark:bg-amber-900/40', icon: 'text-amber-500 dark:text-amber-400' },
  { bg: 'bg-rose-50 dark:bg-rose-900/20', border: 'border-rose-200 dark:border-rose-800', text: 'text-rose-700 dark:text-rose-300', accent: 'bg-rose-500', light: 'bg-rose-100 dark:bg-rose-900/40', icon: 'text-rose-500 dark:text-rose-400' },
  { bg: 'bg-cyan-50 dark:bg-cyan-900/20', border: 'border-cyan-200 dark:border-cyan-800', text: 'text-cyan-700 dark:text-cyan-300', accent: 'bg-cyan-500', light: 'bg-cyan-100 dark:bg-cyan-900/40', icon: 'text-cyan-500 dark:text-cyan-400' },
  { bg: 'bg-indigo-50 dark:bg-indigo-900/20', border: 'border-indigo-200 dark:border-indigo-800', text: 'text-indigo-700 dark:text-indigo-300', accent: 'bg-indigo-500', light: 'bg-indigo-100 dark:bg-indigo-900/40', icon: 'text-indigo-500 dark:text-indigo-400' },
  { bg: 'bg-teal-50 dark:bg-teal-900/20', border: 'border-teal-200 dark:border-teal-800', text: 'text-teal-700 dark:text-teal-300', accent: 'bg-teal-500', light: 'bg-teal-100 dark:bg-teal-900/40', icon: 'text-teal-500 dark:text-teal-400' },
];

const LessonAttachments: React.FC = () => {
  const [attachments, setAttachments] = useState<LessonAttachment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCourse, setSelectedCourse] = useState<string>('ALL');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const getAuthHeaders = () => {
    const authData = localStorage.getItem("auth");
    const token = authData ? JSON.parse(authData).accessToken : "";
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
  };

  useEffect(() => {
    const fetchAttachments = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/lms/lesson-attachments/', {
          headers: getAuthHeaders(),
        });

        if (response.status === 401) {
          throw new Error("Unauthorized: Please log in again.");
        }

        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        setAttachments(data);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    fetchAttachments();
  }, []);

  const groupedData = useMemo(() => {
    return attachments.reduce((acc: GroupedAttachments, item) => {
      const courseName = item.course_title || "General / Uncategorized";

      if (!acc[courseName]) {
        acc[courseName] = [];
      }
      acc[courseName].push(item);
      return acc;
    }, {});
  }, [attachments]);

  const courseNames = Object.keys(groupedData).sort();

  // Filter attachments based on search and course filter
  const filteredGroupedData = useMemo(() => {
    let filtered = { ...groupedData };

    // Filter by selected course
    if (selectedCourse !== 'ALL') {
      filtered = { [selectedCourse]: groupedData[selectedCourse] || [] };
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      Object.keys(filtered).forEach(course => {
        filtered[course] = filtered[course].filter(item =>
          item.name.toLowerCase().includes(query) ||
          item.lesson_title?.toLowerCase().includes(query)
        );
        if (filtered[course].length === 0) {
          delete filtered[course];
        }
      });
    }

    return filtered;
  }, [groupedData, selectedCourse, searchQuery]);

  const filteredCourseNames = Object.keys(filteredGroupedData).sort();

  // Get total count of filtered items
  const totalFilteredItems = Object.values(filteredGroupedData).reduce((acc, items) => acc + items.length, 0);

  // Get color for a course based on index
  const getCourseColor = (courseTitle: string) => {
    const index = courseNames.indexOf(courseTitle);
    return courseColors[index % courseColors.length];
  };

  // --- Loading UI ---
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-slate-950 dark:to-slate-900 flex items-center justify-center transition-colors">
        <div className="text-center">
          <div className="relative w-20 h-20 mx-auto mb-6">
            <div className="absolute inset-0 rounded-full border-4 border-violet-100 dark:border-violet-900/30"></div>
            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-violet-500 animate-spin"></div>
            <div className="absolute inset-2 rounded-full border-4 border-transparent border-t-indigo-400 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <FolderOpen className="w-6 h-6 text-violet-500" />
            </div>
          </div>
          <p className="text-xl font-medium text-gray-600 dark:text-slate-300">Loading Resources...</p>
          <p className="text-gray-400 dark:text-slate-500 mt-1">Organizing your course materials</p>
        </div>
      </div>
    );
  }

  // --- Error UI ---
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-slate-950 dark:to-slate-900 flex items-center justify-center p-6 transition-colors">
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-12 max-w-lg w-full text-center shadow-xl border border-gray-100 dark:border-slate-800">
          <div className="w-20 h-20 bg-red-50 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-10 h-10 text-red-500 dark:text-red-400" />
          </div>
          <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-3">Connection Error</h3>
          <p className="text-gray-500 dark:text-slate-400 mb-8">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="inline-flex items-center gap-2 px-8 py-4 bg-gray-900 dark:bg-slate-700 rounded-xl text-white font-semibold hover:bg-gray-800 dark:hover:bg-slate-600 transition-all duration-200"
          >
            <RefreshCw size={18} />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 transition-colors duration-300">
      {/* Decorative Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-violet-100/40 to-transparent dark:from-violet-900/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-blue-100/40 to-transparent dark:from-blue-900/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
        <div className="absolute top-1/2 left-1/2 w-[400px] h-[400px] bg-gradient-to-br from-emerald-100/30 to-transparent dark:from-emerald-900/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
      </div>

      <div className="relative z-10 w-full px-4 sm:px-6 lg:px-8 py-12">

        {/* Header Section */}
        <div className="w-full mb-12">

          {/* Stats Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
            {/* Courses Card - Violet/Purple */}
            <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 p-6 shadow-lg shadow-violet-500/30 hover:shadow-xl hover:shadow-violet-500/40 hover:scale-105 transition-all duration-300 cursor-pointer">
              <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-12 -mt-12" />
              <div className="absolute bottom-0 left-0 w-20 h-20 bg-white/10 rounded-full -ml-10 -mb-10" />
              <div className="absolute top-1/2 right-4 w-32 h-32 bg-white/5 rounded-full" />
              <div className="relative flex items-center gap-4">
                <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                  <BookOpen size={28} className="text-white" />
                </div>
                <div>
                  <div className="text-4xl font-black text-white">{courseNames.length}</div>
                  <div className="text-sm text-violet-100 font-semibold tracking-wide">Courses</div>
                </div>
              </div>
            </div>

            {/* Files Card - Blue */}
            <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 p-6 shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 hover:scale-105 transition-all duration-300 cursor-pointer">
              <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-12 -mt-12" />
              <div className="absolute bottom-0 left-0 w-20 h-20 bg-white/10 rounded-full -ml-10 -mb-10" />
              <div className="absolute top-1/2 right-4 w-32 h-32 bg-white/5 rounded-full" />
              <div className="relative flex items-center gap-4">
                <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                  <FileText size={28} className="text-white" />
                </div>
                <div>
                  <div className="text-4xl font-black text-white">{attachments.filter(a => a.file).length}</div>
                  <div className="text-sm text-blue-100 font-semibold tracking-wide">Files</div>
                </div>
              </div>
            </div>
            

            {/* Links Card - Emerald/Green */}
            <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 p-6 shadow-lg shadow-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/40 hover:scale-105 transition-all duration-300 cursor-pointer">
              <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-12 -mt-12" />
              <div className="absolute bottom-0 left-0 w-20 h-20 bg-white/10 rounded-full -ml-10 -mb-10" />
              <div className="absolute top-1/2 right-4 w-32 h-32 bg-white/5 rounded-full" />
              <div className="relative flex items-center gap-4">
                <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                  <Link2 size={28} className="text-white" />
                </div>
                <div>
                  <div className="text-4xl font-black text-white">{attachments.filter(a => a.url_link).length}</div>
                  <div className="text-sm text-emerald-100 font-semibold tracking-wide">Links</div>
                </div>
              </div>
            </div>
          </div>
           <div className="text-center mb-2">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Course <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-indigo-600 dark:from-violet-400 dark:to-indigo-400">Documents</span>
            </h1>
          </div> 
          

          {/* Search & Filter Bar */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 p-4 flex flex-col lg:flex-row gap-4">
            {/* Search Input */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-500 w-5 h-5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search resources by name..."
                className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl py-3 pl-12 pr-4 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent placeholder-gray-400 dark:placeholder-slate-500 transition-all duration-200"
              />
            </div>

            {/* Course Filter */}
            <div className="lg:w-72 relative">
              <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-500 w-5 h-5" />
              <select
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
                className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl py-3 pl-12 pr-10 text-gray-800 dark:text-white appearance-none focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent cursor-pointer transition-all duration-200"
              >
                <option value="ALL" className="dark:bg-slate-800">All Courses</option>
                {courseNames.map(name => (
                  <option key={name} value={name} className="dark:bg-slate-800">{name}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-500 pointer-events-none" size={18} />
            </div>

            {/* View Toggle */}
            <div className="flex items-center gap-1 p-1 bg-gray-100 dark:bg-slate-800 rounded-xl border dark:border-slate-700">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-3 rounded-lg transition-all duration-200 ${viewMode === 'grid'
                    ? 'bg-white dark:bg-slate-700 shadow-sm text-violet-600 dark:text-violet-400'
                    : 'text-gray-400 dark:text-slate-500 hover:text-gray-600 dark:hover:text-slate-300'
                  }`}
              >
                <Grid3X3 size={18} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-3 rounded-lg transition-all duration-200 ${viewMode === 'list'
                    ? 'bg-white dark:bg-slate-700 shadow-sm text-violet-600 dark:text-violet-400'
                    : 'text-gray-400 dark:text-slate-500 hover:text-gray-600 dark:hover:text-slate-300'
                  }`}
              >
                <List size={18} />
              </button>
            </div>

            
            
          </div>

          {/* Results Count */}
          {(searchQuery || selectedCourse !== 'ALL') && (
            <div className="mt-4 flex items-center justify-between">
              <p className="text-sm text-gray-500 dark:text-slate-400">
                Showing <span className="font-semibold text-gray-700 dark:text-slate-200">{totalFilteredItems}</span> results
                {searchQuery && <span> for "<span className="text-violet-600 dark:text-violet-400">{searchQuery}</span>"</span>}
              </p>
              {(searchQuery || selectedCourse !== 'ALL') && (
                <button
                  onClick={() => { setSearchQuery(''); setSelectedCourse('ALL'); }}
                  className="text-sm text-violet-600 hover:text-violet-700 dark:text-violet-400 dark:hover:text-violet-300 font-medium"
                >
                  Clear filters
                </button>
              )}
            </div>
          )}
        </div>

        {/* Main Content */}
        <div className="w-full">
          {filteredCourseNames.length === 0 ? (
            <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-3xl border border-gray-100 dark:border-slate-800 shadow-sm transition-colors">
              <div className="w-24 h-24 bg-gray-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
                <FolderOpen className="w-12 h-12 text-gray-400 dark:text-slate-500" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">No Resources Found</h3>
              <p className="text-gray-500 dark:text-slate-400 max-w-md mx-auto">
                {searchQuery
                  ? `No documents match "${searchQuery}". Try a different search term.`
                  : "No documents have been uploaded yet. Check back later!"}
              </p>
            </div>
          ) : (
            <div className="space-y-12">
              {filteredCourseNames.map((courseTitle) => {
                const color = getCourseColor(courseTitle);
                const courseAttachments = filteredGroupedData[courseTitle];

                return (
                  <div key={courseTitle} className="relative">
                    {/* Course Section Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 ${color.light} rounded-2xl flex items-center justify-center`}>
                          <BookOpen className={`w-6 h-6 ${color.icon}`} />
                        </div>
                        <div>
                          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">{courseTitle}</h2>
                          <p className="text-sm text-gray-400 dark:text-slate-400">{courseAttachments.length} resources available</p>
                        </div>
                      </div>
                      <div className={`px-4 py-2 ${color.bg} ${color.border} border rounded-xl`}>
                        <span className={`text-sm font-semibold ${color.text}`}>
                          {courseAttachments.filter(a => a.file).length} Files • {courseAttachments.filter(a => a.url_link).length} Links
                        </span>
                      </div>
                    </div>

                    {/* Attachments Grid/List */}
                    {viewMode === 'grid' ? (
                      <div className="grid grid-cols-1 md:grid-cols-4 xl:grid-cols-4 gap-5">
                        {courseAttachments.map((item) => (
                          <div
                            key={item.id}
                            className="group bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 hover:border-gray-200 dark:hover:border-slate-700 hover:shadow-lg dark:hover:shadow-none transition-all duration-300 overflow-hidden"
                          >
                            {/* Card Header */}
                            <div className={`h-2 ${color.accent}`}></div>

                            <div className="p-6">
                              {/* Top Row */}
                              <div className="flex justify-between items-start mb-4">
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${item.file
                                    ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                                    : 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400'
                                  }`}>
                                  {item.file ? <FileText size={22} /> : <Link2 size={22} />}
                                </div>
                                <div className="flex items-center gap-1.5 text-xs text-gray-400 dark:text-slate-500 bg-gray-50 dark:bg-slate-800 px-2.5 py-1.5 rounded-lg">
                                  <Calendar size={12} />
                                  {new Date(item.created_at).toLocaleDateString('en-US', {
                                    month: 'short',
                                    day: 'numeric',
                                    year: 'numeric'
                                  })}
                                </div>
                              </div>

                              {/* Content */}
                              <div className="mb-5">
                                <div className={`inline-flex items-center gap-1 px-2 py-1 ${color.bg} rounded-md mb-2`}>
                                  <span className={`text-xs font-semibold ${color.text}`}>Lesson {item.lesson}</span>
                                </div>
                                <h3 className="text-lg font-bold text-gray-800 dark:text-slate-200 group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors line-clamp-2" title={item.name}>
                                  {item.name}
                                </h3>
                              </div>

                              {/* Action Button */}
                              {item.file ? (
                                <a
                                  href={item.file}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="w-full py-3 px-4 bg-gray-50 dark:bg-slate-800 hover:bg-blue-600 dark:hover:bg-blue-600 border border-gray-200 dark:border-slate-700 hover:border-blue-600 dark:hover:border-blue-600 rounded-xl flex items-center justify-center gap-2 text-gray-600 dark:text-slate-300 hover:text-white dark:hover:text-white font-medium transition-all duration-200"
                                >
                                  <Download size={18} />
                                  Download File
                                </a>
                              ) : item.url_link ? (
                                <a
                                  href={item.url_link}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="w-full py-3 px-4 bg-gray-50 dark:bg-slate-800 hover:bg-emerald-600 dark:hover:bg-emerald-600 border border-gray-200 dark:border-slate-700 hover:border-emerald-600 dark:hover:border-emerald-600 rounded-xl flex items-center justify-center gap-2 text-gray-600 dark:text-slate-300 hover:text-white dark:hover:text-white font-medium transition-all duration-200"
                                >
                                  <ExternalLink size={18} />
                                  Visit Link
                                </a>
                              ) : (
                                <div className="w-full py-3 px-4 bg-gray-50 dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-xl text-center text-gray-400 dark:text-slate-500 text-sm cursor-not-allowed">
                                  Unavailable
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      /* List View */
                      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 overflow-hidden">
                        {courseAttachments.map((item, index) => (
                          <div
                            key={item.id}
                            className={`flex items-center gap-4 p-4 hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors ${index !== courseAttachments.length - 1 ? 'border-b border-gray-100 dark:border-slate-800' : ''
                              }`}
                          >
                            {/* Icon */}
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${item.file
                                ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                                : 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400'
                              }`}>
                              {item.file ? <FileText size={18} /> : <Link2 size={18} />}
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                              <h3 className="text-gray-800 dark:text-white font-semibold truncate">{item.name}</h3>
                              <div className="flex items-center gap-3 mt-0.5">
                                <span className={`text-xs font-medium ${color.text}`}>Lesson {item.lesson}</span>
                                <span className="text-xs text-gray-400 dark:text-slate-500">
                                  {new Date(item.created_at).toLocaleDateString('en-US', {
                                    month: 'short',
                                    day: 'numeric',
                                    year: 'numeric'
                                  })}
                                </span>
                              </div>
                            </div>

                            {/* Action Button */}
                            {item.file ? (
                              <a
                                href={item.file}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-4 py-2 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-600 dark:hover:bg-blue-600 text-blue-600 dark:text-blue-400 hover:text-white dark:hover:text-white rounded-xl flex items-center gap-2 font-medium text-sm transition-all duration-200 shrink-0"
                              >
                                <Download size={16} />
                                Download
                              </a>
                            ) : item.url_link ? (
                              <a
                                href={item.url_link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-4 py-2 bg-emerald-50 dark:bg-emerald-900/20 hover:bg-emerald-600 dark:hover:bg-emerald-600 text-emerald-600 dark:text-emerald-400 hover:text-white dark:hover:text-white rounded-xl flex items-center gap-2 font-medium text-sm transition-all duration-200 shrink-0"
                              >
                                <ExternalLink size={16} />
                                Visit
                              </a>
                            ) : (
                              <span className="px-4 py-2 bg-gray-50 dark:bg-slate-800 text-gray-400 dark:text-slate-500 rounded-xl text-sm">
                                Unavailable
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="max-w-7xl mx-auto mt-16 text-center">
          <p className="text-gray-400 dark:text-slate-500 text-sm">
            Total {attachments.length} resources across {courseNames.length} courses
          </p>
        </div>
      </div>
    </div>
  );
};

export default LessonAttachments;