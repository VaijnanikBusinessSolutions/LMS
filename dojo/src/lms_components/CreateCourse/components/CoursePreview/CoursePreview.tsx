

// // CoursePreview.tsx - Course preview component
// import React from 'react';
// import { BookOpen, Clock, CheckCircle, Circle, Video, Star, Users, Target, Award, Play } from 'lucide-react';
// // import { Course } from '../Utils/types';
// import type { Course } from '../Utils/types';

// interface CoursePreviewProps {
//   course: Course;
// }

// export const CoursePreview: React.FC<CoursePreviewProps> = ({ course }) => {
//   return (
//     <div className="bg-surface rounded-3xl border border-border shadow-xl overflow-hidden">
//       {/* Course Header */}
//       <div className="relative">
//         {course.photoUrl ? (
//           <div className="relative h-80">
//             <img
//               src={course.photoUrl}
//               // alt={course.title}
//               className="w-full h-full object-cover"
//             />
//             <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
//           </div>
//         ) : (
//           <div className="w-full h-80 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 flex items-center justify-center relative">
//             <div className="absolute inset-0 bg-black/10"></div>
//             <div className="text-center text-white relative z-10 p-8">
//               <div className="bg-white/20 p-6 rounded-3xl backdrop-blur-md border border-white/20 inline-block shadow-2xl">
//                 <BookOpen size={64} className="mx-auto mb-4 drop-shadow-md" />
//                 <h1 className="text-4xl font-bold drop-shadow-md">{course.title}</h1>
//               </div>
//             </div>
//           </div>
//         )}
        
//         <div className="absolute bottom-0 left-0 right-0 p-8 z-20">
//           <div className="text-white">
//             <h1 className="text-4xl md:text-5xl font-extrabold mb-4 drop-shadow-lg leading-tight">
//               {/* {course.title} */}
//             </h1>
//             <div className="flex flex-wrap items-center gap-4">
//               <div className="flex items-center gap-2 bg-black/40 px-4 py-2 rounded-full backdrop-blur-md border border-white/10">
//                 <div className="w-2.5 h-2.5 bg-green-400 rounded-full shadow-[0_0_8px_rgba(74,222,128,0.6)]"></div>
//                 <p className="text-lg font-medium text-white/90">by {course.instructor_name}</p>
//               </div>
//               {course.is_published && (
//                 <div className="bg-green-500/80 px-4 py-2 rounded-full backdrop-blur-sm border border-green-400/50 shadow-lg">
//                   <span className="text-white font-bold text-sm tracking-wide uppercase">Published</span>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Course Details */}
//       <div className="p-8 lg:p-10 bg-background">
//         {/* Stats */}
//         <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-10">
//           {[
//             { icon: Star, color: 'text-yellow-500', bg: 'bg-yellow-50', border: 'border-yellow-100', label: 'Rating', value: course.stats.rating },
//             { icon: Users, color: 'text-blue-500', bg: 'bg-blue-50', border: 'border-blue-100', label: 'Enrolled', value: course.stats.enrolled },
//             { icon: Target, color: 'text-green-500', bg: 'bg-green-50', border: 'border-green-100', label: 'Accuracy', value: `${course.stats.accuracy}%` },
//             { icon: Award, color: 'text-purple-500', bg: 'bg-purple-50', border: 'border-purple-100', label: 'Completion', value: `${course.stats.completion}%` },
//             { icon: Clock, color: 'text-orange-500', bg: 'bg-orange-50', border: 'border-orange-100', label: 'Duration', value: course.stats.duration },
//           ].map((stat, index) => (
//             <div key={index} className="text-center p-5 bg-surface rounded-2xl border border-border shadow-sm hover:shadow-md transition-shadow">
//               <div className={`flex items-center justify-center gap-2 mb-2`}>
//                 <div className={`p-2 rounded-xl ${stat.bg}`}>
//                   <stat.icon className={stat.color} size={20} />
//                 </div>
//               </div>
//               <div className="text-2xl font-bold text-text">{stat.value}</div>
//               <div className="text-xs font-bold text-muted uppercase tracking-wider">{stat.label}</div>
//             </div>
//           ))}
//         </div>

//         {/* Course Info */}
//         <div className="grid md:grid-cols-3 gap-8 mb-10">
//           <div className="md:col-span-2 space-y-8">
//             <div className="bg-surface rounded-3xl border border-border p-8 shadow-sm">
//               <h2 className="text-2xl font-bold text-text mb-6 flex items-center gap-3">
//                 <div className="w-1.5 h-8 bg-gradient-to-b from-blue-600 to-purple-600 rounded-full"></div>
//                 About this course
//               </h2>
//               <p className="text-muted mb-8 text-lg leading-relaxed">{course.description}</p>
              
//               <div className="border-t border-border pt-8">
//                 <h3 className="text-xl font-bold text-text mb-4 flex items-center gap-2">
//                   <Play className="text-blue-500 fill-blue-500" size={20} />
//                   Introduction
//                 </h3>
//                 <p className="text-muted whitespace-pre-wrap leading-relaxed">{course.introduction}</p>
//               </div>
//             </div>
//           </div>
          
//           <div>
//             <div className="bg-surface rounded-3xl border border-border p-6 sticky top-8 shadow-sm">
//               <h3 className="font-bold text-text mb-6 text-lg flex items-center gap-2">
//                 <BookOpen className="text-purple-600" size={24} />
//                 Course Details
//               </h3>
//               <div className="space-y-4">
//                 <div className="flex justify-between items-center py-3 border-b border-border">
//                   <span className="text-sm font-medium text-muted">Level:</span>
//                   <div className="font-bold text-blue-700 bg-blue-50 px-3 py-1 rounded-lg text-sm border border-blue-100">
//                     {course.level}
//                   </div>
//                 </div>
//                 <div className="flex justify-between items-center py-3 border-b border-border">
//                   <span className="text-sm font-medium text-muted">Duration:</span>
//                   <div className="font-bold text-text">{course.duration}</div>
//                 </div>
//                 <div className="flex justify-between items-center py-3 border-b border-border">
//                   <span className="text-sm font-medium text-muted">Lessons:</span>
//                   <div className="font-bold text-purple-700 bg-purple-50 px-3 py-1 rounded-lg text-sm border border-purple-100">
//                     {course.roadmap.length}
//                   </div>
//                 </div>
//                 <div className="flex justify-between items-center py-3">
//                   <span className="text-sm font-medium text-muted">Status:</span>
//                   <div className={`font-bold px-3 py-1 rounded-lg text-sm border ${
//                     course.is_published 
//                       ? 'bg-green-50 text-green-700 border-green-200' 
//                       : 'bg-orange-50 text-orange-700 border-orange-200'
//                   }`}>
//                     {course.is_published ? 'Published' : 'Draft'}
//                   </div>
//                 </div>
//               </div>
              
//               {course.tags.length > 0 && (
//                 <div className="mt-6 pt-6 border-t border-border">
//                   <span className="text-xs font-bold text-muted uppercase tracking-wider block mb-3">Tags:</span>
//                   <div className="flex flex-wrap gap-2">
//                     {course.tags.map((tag, index) => (
//                       <span
//                         key={index}
//                         className="bg-background text-text font-medium px-3 py-1.5 rounded-lg text-xs border border-border hover:border-purple-300 hover:text-purple-600 transition-colors"
//                       >
//                         #{tag}
//                       </span>
//                     ))}
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* Course Curriculum */}
//         <div className="bg-surface rounded-3xl border border-border p-8 shadow-sm">
//           <h2 className="text-2xl font-bold text-text mb-8 flex items-center gap-3">
//             <div className="w-1.5 h-8 bg-gradient-to-b from-green-500 to-emerald-600 rounded-full"></div>
//             Course Curriculum
//           </h2>
//           <div className="space-y-4">
//             {course.roadmap.map((lesson, index) => (
//               <div
//                 key={lesson.id}
//                 className="bg-background border border-border rounded-2xl p-5 hover:shadow-md transition-all duration-300 group hover:border-purple-200"
//               >
//                 <div className="flex items-center justify-between">
//                   <div className="flex items-center gap-5">
//                     <div className="text-xl font-bold text-muted/50 w-8 text-center group-hover:text-purple-500 transition-colors">
//                       {String(index + 1).padStart(2, '0')}
//                     </div>
//                     <div className="flex-1">
//                       <div className="flex items-center gap-3">
//                         <h3 className="font-bold text-text text-lg group-hover:text-purple-700 transition-colors">
//                           {lesson.title}
//                         </h3>
//                         {lesson.sample && (
//                           <span className="bg-pink-50 text-pink-600 px-2.5 py-0.5 rounded-md text-[10px] font-bold border border-pink-100 uppercase tracking-wide">
//                             FREE
//                           </span>
//                         )}
//                         {(lesson.videoUrl || lesson.video) && (
//                           <div className="bg-blue-50 p-1.5 rounded-md border border-blue-100" title="Video Content">
//                             <Video size={14} className="text-blue-500" />
//                           </div>
//                         )}
//                       </div>
//                     </div>
//                   </div>
//                   <div className="flex items-center gap-6 text-sm">
//                     <span className="flex items-center gap-2 text-muted font-medium group-hover:text-text transition-colors">
//                       <Clock size={16} />
//                       {lesson.duration}
//                     </span>
//                     {lesson.completed ? (
//                       <CheckCircle size={24} className="text-green-500" />
//                     ) : (
//                       <Circle size={24} className="text-border group-hover:text-purple-300 transition-colors" />
//                     )}
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };



// CoursePreview.tsx - Redesigned Course Preview Component
import React, { useState } from 'react';
import { 
  BookOpen, Clock, CheckCircle, Circle, Video, Star, Users, Target, 
  Award, Play, ChevronDown, ChevronUp, Lock, Unlock, 
  GraduationCap, TrendingUp, Zap, Heart, Share2, Download,
  Calendar, Globe, BarChart3, Sparkles, ScrollText
} from 'lucide-react';
import type { Course } from '../Utils/types';

interface CoursePreviewProps {
  course: Course;
}

// --- PROGRESS BAR COMPONENT ---
const ProgressBar: React.FC<{ value: number; color: string }> = ({ value, color }) => (
  <div className="w-full h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
    <div 
      className={`h-full rounded-full transition-all duration-700 ease-out ${color}`}
      style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
    />
  </div>
);

// --- STAT CARD COMPONENT ---
const StatCard: React.FC<{
  icon: React.ElementType;
  label: string;
  value: string | number;
  color: string;
  bgColor: string;
  trend?: string;
}> = ({ icon: Icon, label, value, color, bgColor, trend }) => (
  <div className="group relative bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
    <div className="flex items-start justify-between mb-3">
      <div className={`p-3 rounded-xl ${bgColor} transition-transform duration-300 group-hover:scale-110`}>
        <Icon className={color} size={22} />
      </div>
      {trend && (
        <div className="flex items-center gap-1 text-xs font-semibold text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30 px-2 py-1 rounded-full">
          <TrendingUp size={12} />
          {trend}
        </div>
      )}
    </div>
    <div className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
      {value}
    </div>
    <div className="text-sm font-medium text-slate-500 dark:text-slate-400">
      {label}
    </div>
  </div>
);

// --- LESSON CARD COMPONENT ---
const LessonCard: React.FC<{
  lesson: any;
  index: number;
  isExpanded: boolean;
  onToggle: () => void;
}> = ({ lesson, index, isExpanded, onToggle }) => (
  <div className={`bg-white dark:bg-slate-800 border-2 rounded-2xl overflow-hidden transition-all duration-300 ${
    lesson.completed 
      ? 'border-emerald-200 dark:border-emerald-800' 
      : 'border-slate-200 dark:border-slate-700 hover:border-violet-300 dark:hover:border-violet-700'
  }`}>
    <div 
      className="p-5 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
      onClick={onToggle}
    >
      <div className="flex items-center gap-4">
        {/* Lesson Number */}
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg transition-all duration-300 ${
          lesson.completed 
            ? 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400' 
            : 'bg-slate-100 dark:bg-slate-700 text-slate-400 dark:text-slate-500'
        }`}>
          {lesson.completed ? (
            <CheckCircle size={24} className="text-emerald-500" />
          ) : (
            String(index + 1).padStart(2, '0')
          )}
        </div>

        {/* Lesson Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 flex-wrap mb-1">
            <h3 className="font-bold text-lg text-slate-900 dark:text-white truncate">
              {lesson.title}
            </h3>
            
            {/* Badges */}
            <div className="flex items-center gap-2">
              {lesson.sample && (
                <span className="inline-flex items-center gap-1 bg-gradient-to-r from-pink-500 to-rose-500 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide shadow-sm">
                  <Unlock size={12} />
                  Free Preview
                </span>
              )}
              {((lesson.videos?.length || 0) > 0 || lesson.videoUrl || lesson.video) && (
                <span className="inline-flex items-center gap-1 bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 px-2.5 py-1 rounded-lg text-xs font-semibold">
                  <Video size={14} />
                  Video
                </span>
              )}
            </div>
          </div>
          
          {/* Lesson Meta */}
          <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1.5">
              <Clock size={14} />
              {lesson.duration || '10 min'}
            </span>
            {lesson.attachments?.length > 0 && (
              <span className="flex items-center gap-1.5">
                <Download size={14} />
                {lesson.attachments.length} Resources
              </span>
            )}
          </div>
        </div>

        {/* Toggle Button */}
        <button type="button" className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
          {isExpanded ? (
            <ChevronUp size={20} className="text-slate-400" />
          ) : (
            <ChevronDown size={20} className="text-slate-400" />
          )}
        </button>
      </div>
    </div>

    {/* Expanded Content */}
    {isExpanded && (
      <div className="px-5 pb-5 pt-0 border-t border-slate-100 dark:border-slate-700">
        <div className="pt-4">
          {lesson.description ? (
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
              {lesson.description}
            </p>
          ) : (
            <p className="text-slate-400 dark:text-slate-500 italic mb-4">
              No description available for this lesson.
            </p>
          )}
          
          <button type="button" className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300 ${
            lesson.sample
              ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white hover:shadow-lg hover:shadow-violet-500/30 hover:scale-105'
              : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
          }`}>
            {lesson.sample ? (
              <>
                <Play size={16} className="fill-current" />
                Watch Preview
              </>
            ) : (
              <>
                <Lock size={16} />
                Unlock Lesson
              </>
            )}
          </button>
        </div>
      </div>
    )}
  </div>
);

// --- MAIN COMPONENT ---
export const CoursePreview: React.FC<CoursePreviewProps> = ({ course }) => {
  const [expandedLesson, setExpandedLesson] = useState<number | null>(null);
  const [isWishlisted, setIsWishlisted] = useState(false);

  const completedLessons = course.roadmap?.filter(l => l.completed).length || 0;
  const totalLessons = course.roadmap?.length || 0;
  const progressPercent = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

  return (
    <div className="bg-slate-50 dark:bg-slate-900 min-h-full">
      
      {/* ===== HERO SECTION ===== */}
      <div className="relative">
        {/* Background Image or Gradient */}
        {course.photoUrl ? (
          <div className="relative h-[400px] lg:h-[450px]">
            <img
              src={course.photoUrl}
              alt={course.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-slate-900/20" />
          </div>
        ) : (
          <div className="relative h-[400px] lg:h-[450px] bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700 overflow-hidden">
            {/* Decorative Elements */}
            <div className="absolute top-20 left-10 w-72 h-72 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute bottom-10 right-10 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <div className="text-center text-white p-8">
                <div className="inline-flex items-center justify-center w-24 h-24 bg-white/20 backdrop-blur-xl rounded-3xl border border-white/30 shadow-2xl mb-6">
                  <BookOpen size={48} className="text-white" />
                </div>
              </div>
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
          </div>
        )}

        {/* Course Title Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-10">
          <div className="max-w-4xl">
            {/* Category Badge */}
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md text-white px-4 py-2 rounded-full text-sm font-semibold mb-4 border border-white/20">
              <Sparkles size={16} />
              {course.level || 'All Levels'}
            </div>

            {/* Title */}
            <h1 className="text-3xl lg:text-5xl font-extrabold text-white mb-4 leading-tight drop-shadow-lg">
              {course.title || 'Untitled Course'}
            </h1>

            {/* Instructor & Meta */}
            <div className="flex flex-wrap items-center gap-4 mb-6">
              <div className="flex items-center gap-3 bg-black/30 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-400 to-indigo-500 flex items-center justify-center text-white font-bold text-sm">
                  {course.instructor_name?.charAt(0) || 'I'}
                </div>
                <span className="text-white font-medium">
                  {course.instructor_name || 'Instructor'}
                </span>
              </div>
              
              <div className="flex items-center gap-2 text-white/80">
                <Calendar size={16} />
                <span className="text-sm font-medium">Last Updated: Recently</span>
              </div>

              <div className="flex items-center gap-2 text-white/80">
                <Globe size={16} />
                <span className="text-sm font-medium">English</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3">
              {course.is_published ? (
                <span className="inline-flex items-center gap-2 bg-emerald-500 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-emerald-500/30">
                  <CheckCircle size={18} />
                  Published Course
                </span>
              ) : (
                <span className="inline-flex items-center gap-2 bg-amber-500 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-amber-500/30">
                  <Clock size={18} />
                  Draft Mode
                </span>
              )}
              
              <button 
                onClick={() => setIsWishlisted(!isWishlisted)}
                className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
                  isWishlisted
                    ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/30'
                    : 'bg-white/20 backdrop-blur-md text-white border border-white/20 hover:bg-white/30'
                }`}
              >
                <Heart size={18} className={isWishlisted ? 'fill-current' : ''} />
                {isWishlisted ? 'Wishlisted' : 'Add to Wishlist'}
              </button>

              <button className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md text-white px-4 py-2.5 rounded-xl text-sm font-semibold border border-white/20 hover:bg-white/30 transition-all duration-300">
                <Share2 size={18} />
                Share
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ===== MAIN CONTENT ===== */}
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8 lg:py-12">
        
        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-10 -mt-16 relative z-10">
          <StatCard
            icon={Star}
            label="Course Rating"
            value={course.stats?.rating || '4.8'}
            color="text-amber-500"
            bgColor="bg-amber-50 dark:bg-amber-900/30"
            trend="+0.2"
          />
          <StatCard
            icon={Users}
            label="Students Enrolled"
            value={course.stats?.enrolled || '1,234'}
            color="text-blue-500"
            bgColor="bg-blue-50 dark:bg-blue-900/30"
            trend="+12%"
          />
          <StatCard
            icon={Target}
            label="Accuracy Rate"
            value={`${course.stats?.accuracy || 92}%`}
            color="text-emerald-500"
            bgColor="bg-emerald-50 dark:bg-emerald-900/30"
          />
          <StatCard
            icon={Award}
            label="Completion"
            value={`${course.stats?.completion || 85}%`}
            color="text-purple-500"
            bgColor="bg-purple-50 dark:bg-purple-900/30"
          />
          <StatCard
            icon={Clock}
            label="Total Duration"
            value={course.stats?.duration || course.duration || '8h 30m'}
            color="text-orange-500"
            bgColor="bg-orange-50 dark:bg-orange-900/30"
          />
        </div>

        {/* Two Column Layout */}
        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* About Section */}
            <section className="bg-white dark:bg-slate-800 rounded-3xl p-6 lg:p-8 border border-slate-200 dark:border-slate-700 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-1.5 h-10 bg-gradient-to-b from-violet-500 to-indigo-600 rounded-full" />
                <h2 className="text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white">
                  About This Course
                </h2>
              </div>
              
              <p className="text-slate-600 dark:text-slate-300 text-lg leading-relaxed mb-8">
                {course.description || 'No description available for this course yet. Add a compelling description to attract more students!'}
              </p>

              {/* What You'll Learn */}
              <div className="bg-gradient-to-br from-violet-50 to-indigo-50 dark:from-violet-900/20 dark:to-indigo-900/20 rounded-2xl p-6 border border-violet-100 dark:border-violet-800/30">
                <h3 className="flex items-center gap-2 text-xl font-bold text-slate-900 dark:text-white mb-4">
                  <Zap className="text-violet-500" size={22} />
                  What You'll Learn
                </h3>
                <div className="grid md:grid-cols-2 gap-3">
                  {[
                    'Master core concepts and fundamentals',
                    'Build real-world projects',
                    'Learn industry best practices',
                    'Get hands-on experience',
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <div className="shrink-0 mt-0.5">
                        <CheckCircle size={18} className="text-emerald-500" />
                      </div>
                      <span className="text-slate-700 dark:text-slate-300 font-medium">
                        {item}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Introduction Section */}
            {course.introduction && (
              <section className="bg-white dark:bg-slate-800 rounded-3xl p-6 lg:p-8 border border-slate-200 dark:border-slate-700 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-blue-100 dark:bg-blue-900/40 rounded-xl">
                    <Play className="text-blue-600 dark:text-blue-400 fill-blue-600 dark:fill-blue-400" size={24} />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                    Course Introduction
                  </h2>
                </div>
                <p className="text-slate-600 dark:text-slate-300 text-lg leading-relaxed whitespace-pre-wrap">
                  {course.introduction}
                </p>
              </section>
            )}

            {/* Curriculum Section */}
            <section className="bg-white dark:bg-slate-800 rounded-3xl p-6 lg:p-8 border border-slate-200 dark:border-slate-700 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-1.5 h-10 bg-gradient-to-b from-emerald-500 to-teal-600 rounded-full" />
                  <div>
                    <h2 className="text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white">
                      Course Curriculum
                    </h2>
                    <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
                      {totalLessons} lessons • {course.duration || 'Self-paced'}
                    </p>
                  </div>
                </div>
                
                {/* Progress Badge */}
                <div className="hidden sm:flex items-center gap-3 bg-slate-100 dark:bg-slate-700 px-4 py-2 rounded-xl">
                  <BarChart3 size={18} className="text-violet-500" />
                  <div>
                    <div className="text-sm font-bold text-slate-900 dark:text-white">
                      {progressPercent}% Complete
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      {completedLessons}/{totalLessons} lessons
                    </div>
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              {totalLessons > 0 && (
                <div className="mb-6">
                  <ProgressBar value={progressPercent} color="bg-gradient-to-r from-violet-500 to-indigo-500" />
                </div>
              )}

              {/* Lessons List */}
              <div className="space-y-4">
                {course.roadmap && course.roadmap.length > 0 ? (
                  course.roadmap.map((lesson, index) => (
                    <LessonCard
                      key={lesson.id}
                      lesson={lesson}
                      index={index}
                      isExpanded={expandedLesson === lesson.id}
                      onToggle={() => setExpandedLesson(expandedLesson === lesson.id ? null : lesson.id)}
                    />
                  ))
                ) : (
                  <div className="text-center py-12 bg-slate-50 dark:bg-slate-700/50 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-600">
                    <BookOpen size={48} className="mx-auto text-slate-300 dark:text-slate-500 mb-4" />
                    <h3 className="text-xl font-bold text-slate-500 dark:text-slate-400 mb-2">
                      No Lessons Yet
                    </h3>
                    <p className="text-slate-400 dark:text-slate-500">
                      Start building your curriculum by adding lessons.
                    </p>
                  </div>
                )}
              </div>
            </section>
          </div>

          {/* Right Column - Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-6">
              
              {/* Course Details Card */}
              <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2.5 bg-violet-100 dark:bg-violet-900/40 rounded-xl">
                    <GraduationCap className="text-violet-600 dark:text-violet-400" size={24} />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                    Course Details
                  </h3>
                </div>

                <div className="space-y-4">
                  {[
                    { label: 'Skill Level', value: course.level || 'All Levels', color: 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400' },
                    { label: 'Duration', value: course.duration || 'Self-paced', color: 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300' },
                    { label: 'Total Lessons', value: `${totalLessons} Lessons`, color: 'bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400' },
                    { label: 'Certificate', value: 'Included', color: 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400' },
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between py-3 border-b border-slate-100 dark:border-slate-700 last:border-0">
                      <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
                        {item.label}
                      </span>
                      <span className={`font-bold px-3 py-1.5 rounded-lg text-sm ${item.color}`}>
                        {item.value}
                      </span>
                    </div>
                  ))}
                </div>

                {/* CTA Button */}
                <button className="w-full mt-6 py-4 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white font-bold text-lg rounded-2xl shadow-lg shadow-violet-500/30 hover:shadow-xl hover:shadow-violet-500/40 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]">
                  Start Learning Now
                </button>
                
                <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-4">
                  🔥 1,234 students enrolled this week
                </p>
              </div>

              {/* Tags Card */}
              {course.tags && course.tags.length > 0 && (
                <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
                    Course Tags
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {course.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium px-4 py-2 rounded-xl text-sm border border-slate-200 dark:border-slate-600 hover:border-violet-300 dark:hover:border-violet-600 hover:text-violet-600 dark:hover:text-violet-400 cursor-pointer transition-all duration-200"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Certificate Card - FIXED: Using ScrollText instead of Certificate */}
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-3xl p-6 border border-amber-200 dark:border-amber-800/30">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-white dark:bg-slate-800 rounded-xl shadow-sm">
                    <ScrollText className="text-amber-500" size={28} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                      Certificate of Completion
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Earn a certificate when you finish
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400 font-medium">
                  <CheckCircle size={18} />
                  <span>Shareable on LinkedIn</span>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoursePreview;
