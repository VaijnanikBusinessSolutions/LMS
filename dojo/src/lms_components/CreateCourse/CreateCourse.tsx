import React, { useState } from 'react';
import {
  Edit3, Save, BookOpen, ArrowLeft,
  Loader2, AlertCircle, Maximize2, Minimize2,
  LayoutTemplate, Eye, CheckCircle, XCircle,
  Sparkles, Clock, Users, Star, ChevronRight,
  Zap, Shield, HelpCircle, Bell,
  Moon, Sun, Menu, X, List
} from 'lucide-react';
import type { CourseContentManagerProps } from './components/Utils/types';
import { CoursePreview } from './components/CoursePreview/CoursePreview';
import { CourseContentSection } from './components/CourseContentSection/CourseContentSection';
import { BasicInfoSection } from './components/BasicInfoSection/BasicInfoSection';
import { useCourseManager } from './components/Utils/hooks';

// --- SAVE STATUS BADGE COMPONENT ---
const SaveStatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const statusConfig = {
    idle: { icon: null, text: '', bg: '', text_color: '' },
    saving: {
      icon: <Loader2 size={14} className="animate-spin" />,
      text: 'Saving...',
      bg: 'bg-blue-50 dark:bg-blue-900/30',
      text_color: 'text-blue-600 dark:text-blue-400'
    },
    saved: {
      icon: <CheckCircle size={14} />,
      text: 'All changes saved',
      bg: 'bg-emerald-50 dark:bg-emerald-900/30',
      text_color: 'text-emerald-600 dark:text-emerald-400'
    },
    error: {
      icon: <XCircle size={14} />,
      text: 'Failed to save',
      bg: 'bg-red-50 dark:bg-red-900/30',
      text_color: 'text-red-600 dark:text-red-400'
    },
  };

  const config = statusConfig[status as keyof typeof statusConfig];

  if (status === 'idle' || !config) return null;

  return (
    <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${config.bg} ${config.text_color}`}>
      {config.icon}
      <span>{config.text}</span>
    </div>
  );
};

// --- TOOLTIP COMPONENT ---
const Tooltip: React.FC<{ children: React.ReactNode; text: string }> = ({ children, text }) => (
  <div className="relative group">
    {children}
    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-slate-900 dark:bg-slate-700 text-white text-xs font-medium rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50 shadow-lg">
      {text}
      <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-900 dark:border-t-slate-700" />
    </div>
  </div>
);

// --- HEADER COMPONENT ---
const Header: React.FC<{
  title: string;
  isPublished: boolean;
  activeTab: string;
  onTabChange: (tab: any) => void;
  onSave: () => void;
  saveStatus: string;
  isFullscreen: boolean;
  toggleFullscreen: () => void;
  isNewCourse: boolean;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}> = ({
  title,
  isPublished,
  activeTab,
  onTabChange,
  onSave,
  saveStatus,
  isFullscreen,
  toggleFullscreen,
  isNewCourse,
  isDarkMode,
  toggleDarkMode
}) => {
    const [showMobileMenu, setShowMobileMenu] = useState(false);

    return (
      <header className="h-20 border-b border-slate-200 dark:border-slate-700/50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl flex items-center justify-between px-6 shrink-0 z-30 sticky top-0 shadow-sm">
        {/* Left Section */}
        <div className="flex items-center gap-5">
          {/* Back Button */}
          <Tooltip text="Go Back">
            <button
              onClick={() => window.history.back()}
              className="p-3 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-all duration-200 hover:scale-105 active:scale-95"
            >
              <ArrowLeft size={22} />
            </button>
          </Tooltip>

          {/* Course Info */}
          <div className="flex items-center gap-4 border-r border-slate-200 dark:border-slate-700 pr-6">
            <div className="p-3 bg-gradient-to-br from-violet-500 via-purple-500 to-indigo-600 rounded-2xl shadow-lg shadow-violet-500/25">
              <BookOpen size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-900 dark:text-white leading-tight tracking-tight">
                {isNewCourse ? '✨ New Course' : title || 'Untitled Course'}
              </h1>
              <div className="flex items-center gap-3 mt-1">
                <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold ${isPublished
                    ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400'
                    : 'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400'
                  }`}>
                  <span className={`w-2 h-2 rounded-full ${isPublished ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
                  {isPublished ? 'Published' : 'Draft'}
                </div>
                <div className="flex items-center gap-1 text-xs text-slate-400">
                  <Clock size={12} />
                  <span>Auto-save enabled</span>
                </div>
              </div>
            </div>
          </div>

          {/* Desktop Tabs */}
          <div className="hidden md:flex bg-slate-100 dark:bg-slate-800/50 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-700">
            {[
              { key: 'basic', label: 'Details & Preview', icon: LayoutTemplate },
              { key: 'content', label: 'Curriculum', icon: Edit3 },
              { key: 'review', label: 'Final Review', icon: CheckCircle },
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => onTabChange(tab.key)}
                className={`flex items-center gap-3 px-5 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${activeTab === tab.key
                    ? 'bg-white dark:bg-slate-700 text-violet-600 dark:text-violet-400 shadow-md shadow-violet-500/10'
                    : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50'
                  }`}
              >
                <tab.icon size={18} className={activeTab === tab.key ? 'text-violet-500' : ''} />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-3">
          <SaveStatusBadge status={saveStatus} />

          <Tooltip text={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}>
            <button
              onClick={toggleFullscreen}
              className="p-3 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl hover:text-slate-700 dark:hover:text-slate-300 transition-all duration-200"
            >
              {isFullscreen ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
            </button>
          </Tooltip>

          <button
            onClick={onSave}
            disabled={saveStatus === 'saving'}
            className={`flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white font-bold rounded-xl text-sm shadow-lg shadow-violet-500/30 transition-all duration-300 ${saveStatus === 'saving'
                ? 'opacity-75 cursor-not-allowed'
                : 'hover:shadow-xl hover:shadow-violet-500/40 hover:scale-105 active:scale-95'
              }`}
          >
            {saveStatus === 'saving' ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <Save size={18} />
            )}
            <span className="hidden sm:inline">
              {saveStatus === 'saving' ? 'Saving...' : 'Save Changes'}
            </span>
          </button>

          <button
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="md:hidden p-3 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
          >
            {showMobileMenu ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {showMobileMenu && (
          <div className="absolute top-full left-0 right-0 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 p-4 md:hidden shadow-xl">
            <div className="flex flex-col gap-2">
              {[
                { key: 'basic', label: 'Details & Preview', icon: LayoutTemplate },
                { key: 'content', label: 'Curriculum', icon: Edit3 },
                { key: 'review', label: 'Final Review', icon: CheckCircle },
              ].map(tab => (
                <button
                  key={tab.key}
                  onClick={() => {
                    onTabChange(tab.key);
                    setShowMobileMenu(false);
                  }}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-base font-semibold transition-all ${activeTab === tab.key
                      ? 'bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                >
                  <tab.icon size={20} />
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </header>
    );
  };

// --- LOADING SCREEN ---
const LoadingScreen: React.FC = () => (
  <div className="h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 via-white to-violet-50 dark:from-slate-950 dark:via-slate-900 dark:to-violet-950">
    <div className="relative">
      <div className="absolute inset-0 bg-violet-500/20 blur-3xl rounded-full animate-pulse" />
      <div className="relative p-6 bg-white dark:bg-slate-800 rounded-3xl shadow-2xl shadow-violet-500/20">
        <Loader2 className="animate-spin text-violet-600" size={48} />
      </div>
    </div>
    <div className="mt-8 text-center">
      <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Loading Course Editor</h3>
      <p className="text-slate-500">Please wait while we set things up...</p>
    </div>
    <div className="mt-6 flex gap-2">
      {[0, 1, 2].map(i => (
        <div
          key={i}
          className="w-3 h-3 rounded-full bg-violet-500 animate-bounce"
          style={{ animationDelay: `${i * 150}ms` }}
        />
      ))}
    </div>
  </div>
);

// --- ERROR SCREEN ---
const ErrorScreen: React.FC<{ error: string; onRetry?: () => void }> = ({ error, onRetry }) => (
  <div className="h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 via-white to-red-50 dark:from-slate-950 dark:via-slate-900 dark:to-red-950 p-6">
    <div className="max-w-md w-full text-center">
      <div className="relative mx-auto w-fit">
        <div className="absolute inset-0 bg-red-500/20 blur-3xl rounded-full" />
        <div className="relative p-6 bg-white dark:bg-slate-800 rounded-3xl shadow-2xl shadow-red-500/20 mb-6">
          <AlertCircle className="text-red-500" size={48} />
        </div>
      </div>
      <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
        Oops! Something went wrong
      </h2>
      <p className="text-slate-500 dark:text-slate-400 mb-6 text-lg">
        {error || 'We couldn\'t load the course. Please try again.'}
      </p>
      <div className="flex gap-4 justify-center">
        <button
          onClick={() => window.history.back()}
          className="px-6 py-3 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
        >
          Go Back
        </button>
        {onRetry && (
          <button
            onClick={onRetry}
            className="px-6 py-3 bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-violet-700 hover:to-indigo-700 shadow-lg shadow-violet-500/30 transition-all"
          >
            Try Again
          </button>
        )}
      </div>
    </div>
  </div>
);

// --- QUICK STATS BANNER ---
const QuickStatsBanner: React.FC<{ course: any }> = ({ course }) => (
  <div className="flex items-center gap-6 px-6 py-4 bg-gradient-to-r from-violet-50 via-purple-50 to-indigo-50 dark:from-violet-900/20 dark:via-purple-900/20 dark:to-indigo-900/20 border-b border-violet-100 dark:border-violet-800/30 shrink-0">
    <div className="flex items-center gap-2 text-sm">
      <div className="p-2 bg-white dark:bg-slate-800 rounded-lg shadow-sm">
        <Users size={16} className="text-violet-600" />
      </div>
      <div>
        <span className="font-bold text-slate-900 dark:text-white">{course.stats?.students || 0}</span>
        <span className="text-slate-500 ml-1">Students</span>
      </div>
    </div>
    <div className="w-px h-8 bg-violet-200 dark:bg-violet-800" />
    <div className="flex items-center gap-2 text-sm">
      <div className="p-2 bg-white dark:bg-slate-800 rounded-lg shadow-sm">
        <Star size={16} className="text-amber-500" />
      </div>
      <div>
        <span className="font-bold text-slate-900 dark:text-white">{course.stats?.rating || '0.0'}</span>
        <span className="text-slate-500 ml-1">Rating</span>
      </div>
    </div>
    <div className="w-px h-8 bg-violet-200 dark:bg-violet-800" />
    <div className="flex items-center gap-2 text-sm">
      <div className="p-2 bg-white dark:bg-slate-800 rounded-lg shadow-sm">
        <Clock size={16} className="text-emerald-600" />
      </div>
      <div>
        <span className="font-bold text-slate-900 dark:text-white">{course.duration || '0h'}</span>
        <span className="text-slate-500 ml-1">Duration</span>
      </div>
    </div>
    <div className="flex-1" />
    <div className="hidden md:flex items-center gap-2 text-sm text-violet-600 dark:text-violet-400 font-medium">
      <Sparkles size={16} />
      <span>Pro Tip: Keep your content engaging and interactive!</span>
    </div>
  </div>
);

// --- MAIN COMPONENT ---
export const CourseContentManager: React.FC<CourseContentManagerProps> = ({ courseId = null }) => {
  const {
    course, loading, error, activeTab, selectedLesson, editingLesson, isNewCourse, lessonTab,
    setActiveTab, setSelectedLesson, setEditingLesson, setLessonTab,
    updateBasicInfo, updateStats, updateTags, handlePhotoUpload, removePhoto,
    handleVideoUpload, removeVideo, addLesson, updateLesson, deleteLesson,
    saveLesson, handleSaveCourse,
    tests, selectedTest, editingTest, addTest, updateTest, updateTestQuestion, deleteTest, saveTest, setSelectedTest, setEditingTest,
    handleReorder, addAttachment, removeAttachment
  } = useCourseManager(courseId);

  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const handleSave = async () => {
    setSaveStatus('saving');
    try {
      await handleSaveCourse();
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 3000);
    } catch {
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 5000);
    }
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  if (loading) return <LoadingScreen />;
  if (error || !course) return <ErrorScreen error={error || 'Course not found'} />;

  return (
    <div className={`flex flex-col h-screen bg-slate-50 dark:bg-slate-950 overflow-hidden transition-colors duration-300 ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}>
      <Header
        title={course.title}
        isPublished={course.is_published || false}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onSave={handleSave}
        saveStatus={saveStatus}
        isFullscreen={isFullscreen}
        toggleFullscreen={() => setIsFullscreen(!isFullscreen)}
        isNewCourse={isNewCourse}
        isDarkMode={isDarkMode}
        toggleDarkMode={toggleDarkMode}
      />

      <QuickStatsBanner course={course} />

      {/* MAIN WORKSPACE */}
      <main className="flex-1 overflow-hidden relative">

        {/* === TAB 1: DETAILS & LIVE PREVIEW === */}
        {activeTab === 'basic' && (
          <div className="flex h-full w-full">

            {/* Left Pane: Editor Form */}
            <div className="w-full lg:w-1/2 h-full overflow-y-auto border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
              <div className="w-full p-6 lg:p-10 pb-24">
                {/* Section Header */}
                <div className="mb-8 pb-6 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-violet-100 dark:bg-violet-900/30 rounded-xl">
                      <LayoutTemplate size={22} className="text-violet-600 dark:text-violet-400" />
                    </div>
                    <h2 className="text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white">
                      Course Details
                    </h2>
                  </div>
                  <p className="text-slate-500 dark:text-slate-400 text-base lg:text-lg">
                    Fill in your course information. Changes are reflected in the preview instantly.
                  </p>
                </div>

                {/* Feature Highlights */}
                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="flex items-center gap-3 p-4 rounded-2xl bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800/30">
                    <Zap size={20} className="text-amber-600 dark:text-amber-400" />
                    <span className="text-sm font-semibold text-amber-700 dark:text-amber-400">
                      Real-time Preview
                    </span>
                  </div>
                  <div className="flex items-center gap-3 p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800/30">
                    <Shield size={20} className="text-emerald-600 dark:text-emerald-400" />
                    <span className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">
                      Auto-save Enabled
                    </span>
                  </div>
                </div>

                {/* Basic Info Section */}
                <BasicInfoSection
                  course={course}
                  updateBasicInfo={updateBasicInfo}
                  updateStats={updateStats}
                  updateTags={updateTags}
                  handlePhotoUpload={handlePhotoUpload}
                  removePhoto={removePhoto}
                />
              </div>
            </div>

            {/* ========================================= */}
            {/* Right Pane: Live Preview - FIXED SCROLL  */}
            {/* ========================================= */}
            <div className="hidden lg:flex lg:flex-col w-1/2 h-full bg-gradient-to-br from-slate-100 via-slate-50 to-violet-50 dark:from-slate-950 dark:via-slate-900 dark:to-violet-950">

              {/* Preview Header - Sticky Top */}
              <div className="shrink-0 p-5 flex items-center justify-between bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm border-b border-slate-200/50 dark:border-slate-700/50">
                <div className="flex items-center gap-3 px-4 py-2.5 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
                  <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse" />
                  <Eye size={16} className="text-violet-600 dark:text-violet-400" />
                  <span className="text-sm font-bold text-violet-600 dark:text-violet-400">Live Preview</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
                  <span className="text-xs text-slate-500">Last updated:</span>
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Just now</span>
                </div>
              </div>

              {/* Scrollable Preview Content */}
              <div className="flex-1 overflow-y-auto">
                <div className="p-6 min-h-full">
                  <div className="w-full bg-white dark:bg-slate-900 rounded-3xl shadow-2xl shadow-violet-500/10 border border-slate-200/50 dark:border-slate-700/50 overflow-hidden">
                    <CoursePreview course={course} />
                  </div>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* === TAB 2: CURRICULUM EDITOR === */}
        {activeTab === 'content' && (
          <div className="h-full w-full bg-white dark:bg-slate-900 overflow-y-auto">
            <CourseContentSection
              course={course}
              selectedLesson={selectedLesson}
              editingLesson={editingLesson}
              lessonTab={lessonTab}
              onLessonSelect={setSelectedLesson}
              onLessonTabChange={setLessonTab}
              onAddLesson={addLesson}
              onEditLesson={() => setEditingLesson(selectedLesson)}
              onSaveLesson={saveLesson}
              onCancelEdit={() => setEditingLesson(null)}
              onDeleteLesson={() => deleteLesson(selectedLesson)}
              onUpdateLesson={(f, v) => updateLesson(selectedLesson, f, v)}
              onVideoUpload={(e) => handleVideoUpload(e, selectedLesson)}
              onVideoRemove={() => removeVideo(selectedLesson)}
              onAddAttachment={addAttachment}
              onRemoveAttachment={removeAttachment}
              tests={tests}
              selectedTest={selectedTest}
              editingTest={editingTest}
              onTestSelect={setSelectedTest}
              onAddTest={addTest}
              onEditTest={setEditingTest}
              onSaveTest={(id) => saveTest(id)}
              onCancelTest={() => setEditingTest(null)}
              onDeleteTest={deleteTest}
              onUpdateTest={updateTest}
              onUpdateTestQuestion={(tid, qid, f, v) => updateTestQuestion(tid, qid, f, v)}
              onReorder={handleReorder}
            />
          </div>
        )}
        
        {/* === TAB 3: FINAL REVIEW === */}
        {String(activeTab) === 'review' && (
          <div className="h-full w-full overflow-y-auto bg-slate-50 dark:bg-slate-950">
            <div className="w-full p-6 lg:p-12 space-y-12 pb-32">

              {/* Page Header */}
              <div className="flex flex-col items-center text-center space-y-4 mb-12">
                <div className="p-4 bg-emerald-100 dark:bg-emerald-900/30 rounded-3xl text-emerald-600 shadow-sm">
                  <Shield size={40} strokeWidth={2.5} />
                </div>
                <div>
                  <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                    Final Review
                  </h2>
                  <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">
                    This is exactly how your course will appear to students.
                  </p>
                </div>
              </div>

              {/* --- THE ACTUAL COURSE PREVIEW --- */}
              <section className="space-y-6">
                <div className="flex items-center justify-between px-2">
                  <h3 className="text-xl font-bold flex items-center gap-2 text-slate-800 dark:text-slate-200">
                    <LayoutTemplate size={20} className="text-violet-500" />
                    Course Landing Page
                  </h3>
                  <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Live View</span>
                </div>

                <div className="bg-white dark:bg-slate-900 rounded-[40px] shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                  <CoursePreview course={course} />
                </div>
              </section>

              {/* --- CURRICULUM CHECKLIST --- */}
              <section className="space-y-6">
                <h3 className="text-xl font-bold flex items-center gap-2 text-slate-800 dark:text-slate-200 px-2">
                  <List size={20} className="text-violet-500" />
                  Curriculum Breakdown
                </h3>

                <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
                  {(course as any).lessons && (course as any).lessons.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {(course as any).lessons.map((lesson: any, index: number) => (
                        <div
                          key={index}
                          className="group flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700/50 hover:border-emerald-500/30 transition-all"
                        >
                          <div className="w-10 h-10 shrink-0 flex items-center justify-center bg-white dark:bg-slate-700 rounded-xl text-sm font-black shadow-sm group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                            {index + 1}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-slate-900 dark:text-white truncate">
                              {lesson.title || 'Untitled Lesson'}
                            </h4>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-slate-200/50 dark:bg-slate-700 px-1.5 py-0.5 rounded">
                                {lesson.type || 'Video'}
                              </span>
                            </div>
                          </div>
                          <CheckCircle size={20} className="text-emerald-500 shrink-0" />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-10">
                      <p className="text-slate-400 italic">No curriculum items added yet.</p>
                    </div>
                  )}
                </div>
              </section>

              {/* FINAL ACTION BAR */}
              <div className="flex flex-col items-center gap-6 pt-12 border-t border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-3 text-slate-500">
                  <Sparkles size={18} className="text-amber-500" />
                  <span className="text-sm font-medium">Ready to go? All changes are currently synced.</span>
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={() => setActiveTab('content')}
                    className="px-8 py-4 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold rounded-2xl hover:bg-slate-300 dark:hover:bg-slate-700 transition-all"
                  >
                    Back to Edit
                  </button>

                  <button
                    onClick={handleSave}
                    disabled={saveStatus === 'saving'}
                    className="px-12 py-4 bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-black rounded-2xl shadow-xl shadow-violet-500/25 hover:scale-105 active:scale-95 transition-all flex items-center gap-3"
                  >
                    {saveStatus === 'saving' ? <Loader2 className="animate-spin" /> : <Save size={20} />}
                    Finalize & Save Course
                  </button>
                </div>
              </div>

            </div>
          </div>
        )}


      </main>

      {/* Custom Scrollbar Styles */}
      <style>{`
        ::-webkit-scrollbar {
          width: 10px;
          height: 10px;
        }
        ::-webkit-scrollbar-track {
          background: transparent;
        }
        ::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 5px;
          border: 2px solid transparent;
          background-clip: content-box;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
          border: 2px solid transparent;
          background-clip: content-box;
        }
        .dark ::-webkit-scrollbar-thumb {
          background: #475569;
        }
        .dark ::-webkit-scrollbar-thumb:hover {
          background: #64748b;
        }
        html {
          scroll-behavior: smooth;
        }
      `}</style>
    </div>
  );
};

export default CourseContentManager;