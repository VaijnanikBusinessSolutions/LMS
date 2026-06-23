
// import React, { useState } from 'react';
// import {
//   Edit3, Trash2, Save, X, Clock, Video,
//   FileText, Upload, Paperclip, Link as LinkIcon, File as FileIcon,
//   Play, ExternalLink, Sparkles, FolderOpen, CheckCircle2, AlertCircle,
//   Grid3X3, List, Download, Image, FileVideo, FileAudio, Archive,
//   FileSpreadsheet, Presentation, MoreVertical, Eye, Copy
// } from 'lucide-react';
// import type { Lesson, LessonTabType } from '../Utils/types';

// interface LessonEditorProps {
//   lesson: Lesson | null;
//   editingLesson: number | null;
//   lessonTab: LessonTabType;
//   onLessonTabChange: (tab: LessonTabType) => void;
//   onEdit: () => void;
//   onSave: () => void;
//   onCancel: () => void;
//   onDelete: () => void;
//   onUpdateLesson: (field: keyof Lesson, value: any) => void;
//   onVideoUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
//   onVideoRemove: () => void;
//   onAddAttachment: (file: File | null, url: string) => void;
//   onRemoveAttachment: (index: number) => void;
// }

// // Helper function to get file type info
// const getFileTypeInfo = (fileName: string, type: string) => {
//   if (type === 'link') {
//     return { icon: LinkIcon, color: 'blue', bg: 'from-blue-500 to-cyan-500', label: 'Link' };
//   }

//   const ext = fileName.split('.').pop()?.toLowerCase() || '';

//   const fileTypes: Record<string, { icon: any; color: string; bg: string; label: string }> = {
//     // Documents
//     pdf: { icon: FileText, color: 'red', bg: 'from-red-500 to-rose-500', label: 'PDF' },
//     doc: { icon: FileText, color: 'blue', bg: 'from-blue-500 to-indigo-500', label: 'DOC' },
//     docx: { icon: FileText, color: 'blue', bg: 'from-blue-500 to-indigo-500', label: 'DOCX' },
//     txt: { icon: FileText, color: 'slate', bg: 'from-slate-500 to-slate-600', label: 'TXT' },
//     // Spreadsheets
//     xls: { icon: FileSpreadsheet, color: 'green', bg: 'from-green-500 to-emerald-500', label: 'XLS' },
//     xlsx: { icon: FileSpreadsheet, color: 'green', bg: 'from-green-500 to-emerald-500', label: 'XLSX' },
//     csv: { icon: FileSpreadsheet, color: 'green', bg: 'from-green-500 to-teal-500', label: 'CSV' },
//     // Presentations
//     ppt: { icon: Presentation, color: 'orange', bg: 'from-orange-500 to-amber-500', label: 'PPT' },
//     pptx: { icon: Presentation, color: 'orange', bg: 'from-orange-500 to-amber-500', label: 'PPTX' },
//     // Images
//     jpg: { icon: Image, color: 'pink', bg: 'from-pink-500 to-rose-500', label: 'JPG' },
//     jpeg: { icon: Image, color: 'pink', bg: 'from-pink-500 to-rose-500', label: 'JPEG' },
//     png: { icon: Image, color: 'purple', bg: 'from-purple-500 to-violet-500', label: 'PNG' },
//     gif: { icon: Image, color: 'fuchsia', bg: 'from-fuchsia-500 to-pink-500', label: 'GIF' },
//     svg: { icon: Image, color: 'violet', bg: 'from-violet-500 to-purple-500', label: 'SVG' },
//     // Videos
//     mp4: { icon: FileVideo, color: 'red', bg: 'from-red-500 to-pink-500', label: 'MP4' },
//     mov: { icon: FileVideo, color: 'red', bg: 'from-red-500 to-rose-500', label: 'MOV' },
//     avi: { icon: FileVideo, color: 'red', bg: 'from-rose-500 to-red-500', label: 'AVI' },
//     // Audio
//     mp3: { icon: FileAudio, color: 'indigo', bg: 'from-indigo-500 to-blue-500', label: 'MP3' },
//     wav: { icon: FileAudio, color: 'indigo', bg: 'from-indigo-500 to-violet-500', label: 'WAV' },
//     // Archives
//     zip: { icon: Archive, color: 'amber', bg: 'from-amber-500 to-yellow-500', label: 'ZIP' },
//     rar: { icon: Archive, color: 'amber', bg: 'from-amber-500 to-orange-500', label: 'RAR' },
//   };

//   return fileTypes[ext] || { icon: FileIcon, color: 'violet', bg: 'from-violet-500 to-fuchsia-500', label: ext.toUpperCase() || 'FILE' };
// };

// export const LessonEditor: React.FC<LessonEditorProps> = ({
//   lesson,
//   editingLesson,
//   lessonTab,
//   onLessonTabChange,
//   onEdit,
//   onSave,
//   onCancel,
//   onDelete,
//   onUpdateLesson,
//   onVideoUpload,
//   onVideoRemove,
//   onAddAttachment,
//   onRemoveAttachment
// }) => {
//   const [urlInput, setUrlInput] = useState('');
//   const [isDragging, setIsDragging] = useState(false);
//   const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
//   const [activeMenu, setActiveMenu] = useState<number | null>(null);

//   if (!lesson) {
//     return (
//       <div className="flex flex-col items-center justify-center h-full bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-950">
//         <div className="relative">
//           <div className="absolute inset-0 bg-violet-500/20 blur-3xl rounded-full animate-pulse" />
//           <div className="relative bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-xl border border-slate-200/50 dark:border-slate-700/50">
//             <FolderOpen size={48} className="text-slate-300 dark:text-slate-600 mx-auto mb-4" />
//             <p className="text-slate-500 dark:text-slate-400 text-center font-medium">
//               Select a lesson to start editing
//             </p>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   const isEditing = editingLesson === lesson.id;
//   const hasVideo = lesson.video instanceof File || lesson.videoUrl;

//   // Calculate materials overview stats
//   const totalMaterials = lesson.attachments?.length || 0;
//   const fileCount = lesson.attachments?.filter(a => a.type === 'file').length || 0;
//   const linkCount = lesson.attachments?.filter(a => a.type === 'link').length || 0;
//   const pendingCount = lesson.attachments?.filter(a => !a.id).length || 0;
//   const savedCount = totalMaterials - pendingCount;

//   const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files && e.target.files.length > 0) {
//       Array.from(e.target.files).forEach(file => {
//         onAddAttachment(file, '');
//       });
//       e.target.value = '';
//     }
//   };

//   const handleUrlAdd = () => {
//     if (urlInput.trim()) {
//       onAddAttachment(null, urlInput);
//       setUrlInput('');
//     }
//   };

//   const handleDragOver = (e: React.DragEvent) => {
//     e.preventDefault();
//     setIsDragging(true);
//   };

//   const handleDragLeave = () => {
//     setIsDragging(false);
//   };

//   const handleDrop = (e: React.DragEvent) => {
//     e.preventDefault();
//     setIsDragging(false);
//     if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
//       Array.from(e.dataTransfer.files).forEach(file => {
//         onAddAttachment(file, '');
//       });
//     }
//   };

//   return (
//     <div className="flex flex-col h-full bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-950">
//       {/* Header */}
//       <div className="shrink-0 px-8 py-6 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-800/50 sticky top-0 z-20">
//         <div className="flex justify-between items-start gap-6">
//           <div className="flex-1 min-w-0">
//             {isEditing ? (
//               <div className="space-y-4">
//                 <div className="relative group">
//                   <div className="absolute -inset-1 bg-gradient-to-r from-violet-500/20 to-fuchsia-500/20 rounded-2xl blur opacity-0 group-focus-within:opacity-100 transition-opacity duration-500" />
//                   <input
//                     type="text"
//                     value={lesson.title}
//                     onChange={(e) => onUpdateLesson('title', e.target.value)}
//                     className="relative text-2xl font-bold w-full px-5 py-3 bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl focus:border-violet-500 dark:focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 outline-none transition-all duration-300"
//                     placeholder="Enter lesson title..."
//                   />
//                 </div>
//                 <div className="flex flex-wrap gap-4 items-center">
//                   <div className="flex items-center gap-2 bg-white dark:bg-slate-800 px-4 py-2.5 rounded-xl border-2 border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow">
//                     <Clock size={16} className="text-violet-500" />
//                     <input
//                       type="text"
//                       value={lesson.duration}
//                       onChange={(e) => onUpdateLesson('duration', e.target.value)}
//                       className="bg-transparent w-20 text-sm font-semibold outline-none text-slate-700 dark:text-slate-300"
//                       placeholder="00:00"
//                     />
//                   </div>
//                   <label className="flex items-center gap-3 cursor-pointer select-none bg-white dark:bg-slate-800 px-4 py-2.5 rounded-xl border-2 border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md hover:border-amber-300 dark:hover:border-amber-600 transition-all group">
//                     <div className="relative">
//                       <input
//                         type="checkbox"
//                         checked={lesson.sample || false}
//                         onChange={(e) => onUpdateLesson('sample', e.target.checked)}
//                         className="sr-only peer"
//                       />
//                       <div className="w-5 h-5 rounded-md border-2 border-slate-300 dark:border-slate-600 peer-checked:border-amber-500 peer-checked:bg-amber-500 transition-all flex items-center justify-center">
//                         <Sparkles size={12} className="text-white opacity-0 peer-checked:opacity-100 transition-opacity" />
//                       </div>
//                     </div>
//                     <span className="text-sm font-semibold text-slate-600 dark:text-slate-400 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
//                       Free Preview
//                     </span>
//                   </label>
//                 </div>
//               </div>
//             ) : (
//               <div className="space-y-3">
//                 <h3 className="text-3xl font-bold bg-gradient-to-r from-slate-900 via-slate-700 to-slate-900 dark:from-white dark:via-slate-200 dark:to-white bg-clip-text text-transparent">
//                   {lesson.title}
//                 </h3>
//                 <div className="flex items-center gap-4">
//                   <span className="flex items-center gap-2 text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-lg">
//                     <Clock size={14} className="text-violet-500" />
//                     <span className="text-sm font-medium">{lesson.duration}</span>
//                   </span>
//                   {lesson.sample && (
//                     <span className="flex items-center gap-1.5 bg-gradient-to-r from-amber-400 to-orange-400 text-white px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider shadow-lg shadow-amber-500/25">
//                       <Sparkles size={12} />
//                       Free Preview
//                     </span>
//                   )}
//                 </div>
//               </div>
//             )}
//           </div>

//           <div className="flex gap-3 shrink-0">
//             {isEditing ? (
//               <>
//                 <button
//                   onClick={onSave}
//                   className="group relative overflow-hidden bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white px-6 py-2.5 rounded-xl flex items-center gap-2 font-semibold transition-all duration-300 shadow-lg shadow-violet-500/25 hover:shadow-xl hover:shadow-violet-500/30 hover:scale-105"
//                 >
//                   <Save size={18} className="group-hover:rotate-12 transition-transform" />
//                   Save Changes
//                 </button>
//                 <button
//                   onClick={onCancel}
//                   className="bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 text-slate-600 dark:text-slate-300 px-5 py-2.5 rounded-xl flex items-center gap-2 font-semibold transition-all hover:shadow-lg"
//                 >
//                   <X size={18} />
//                   Cancel
//                 </button>
//               </>
//             ) : (
//               <>
//                 <button
//                   onClick={onEdit}
//                   className="group bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 hover:border-violet-300 dark:hover:border-violet-600 text-slate-600 dark:text-slate-300 hover:text-violet-600 dark:hover:text-violet-400 px-5 py-2.5 rounded-xl flex items-center gap-2 font-semibold transition-all hover:shadow-lg hover:shadow-violet-500/10"
//                 >
//                   <Edit3 size={18} className="group-hover:rotate-12 transition-transform" />
//                   <span className="hidden sm:inline">Edit Lesson</span>
//                 </button>
//                 <button
//                   onClick={onDelete}
//                   className="group bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 hover:border-rose-300 dark:hover:border-rose-600 text-slate-400 hover:text-rose-500 p-2.5 rounded-xl transition-all hover:shadow-lg hover:shadow-rose-500/10"
//                 >
//                   <Trash2 size={18} className="group-hover:scale-110 transition-transform" />
//                 </button>
//               </>
//             )}
//           </div>
//         </div>

//         {/* Tabs */}
//         <div className="flex gap-2 mt-8">
//           {[
//             { key: 'content', label: 'Content', icon: FileText, color: 'violet' },
//             { key: 'video', label: 'Video', icon: Video, color: 'rose' },
//             { key: 'materials', label: 'Materials', icon: Paperclip, color: 'blue', badge: totalMaterials }
//           ].map(({ key, label, icon: Icon, color, badge }) => (
//             <button
//               key={key}
//               onClick={() => onLessonTabChange(key as LessonTabType)}
//               className={`relative flex items-center gap-2.5 px-5 py-3 rounded-xl font-semibold text-sm transition-all duration-300 ${lessonTab === key
//                   ? `text-white shadow-lg scale-105`
//                   : 'bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 border-2 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
//                 }`}
//               style={lessonTab === key ? {
//                 background: color === 'violet' ? 'linear-gradient(135deg, #8B5CF6, #A855F7)' :
//                   color === 'rose' ? 'linear-gradient(135deg, #F43F5E, #EC4899)' :
//                     'linear-gradient(135deg, #3B82F6, #06B6D4)',
//                 boxShadow: color === 'violet' ? '0 10px 30px -10px rgba(139, 92, 246, 0.5)' :
//                   color === 'rose' ? '0 10px 30px -10px rgba(244, 63, 94, 0.5)' :
//                     '0 10px 30px -10px rgba(59, 130, 246, 0.5)'
//               } : {}}
//             >
//               <Icon size={18} />
//               {label}
//               {badge !== undefined && badge > 0 && (
//                 <span className={`ml-1 px-2 py-0.5 rounded-full text-xs font-bold ${lessonTab === key
//                     ? 'bg-white/20 text-white'
//                     : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
//                   }`}>
//                   {badge}
//                 </span>
//               )}
//               {lessonTab === key && (
//                 <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-white rounded-full shadow-lg" />
//               )}
//             </button>
//           ))}
//         </div>
//       </div>

//       {/* Content Area */}
//       <div className="flex-1 overflow-y-auto p-8">
//         <div className="w-full h-full flex flex-col">

//           {/* Content Tab */}
//           {lessonTab === 'content' && (
//             <div className="flex-1 flex flex-col h-full animate-in fade-in slide-in-from-bottom-4 duration-500">
//               <div className="flex items-center gap-3 mb-4">
//                 <div className="p-2 bg-violet-100 dark:bg-violet-900/30 rounded-lg">
//                   <FileText size={20} className="text-violet-600 dark:text-violet-400" />
//                 </div>
//                 <div>
//                   <h4 className="font-bold text-slate-900 dark:text-white">Lesson Content</h4>
//                   <p className="text-xs text-slate-500">Write your lesson content, instructions, or notes</p>
//                 </div>
//               </div>
//               <div className="relative flex-1 group">
//                 <div className="absolute -inset-1 bg-gradient-to-r from-violet-500/10 via-fuchsia-500/10 to-violet-500/10 rounded-2xl blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-700" />
//                 <textarea
//                   value={lesson.content}
//                   onChange={(e) => onUpdateLesson('content', e.target.value)}
//                   className="relative flex-1 w-full h-full min-h-[400px] p-8 bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 rounded-2xl resize-none outline-none focus:border-violet-400 dark:focus:border-violet-600 focus:ring-4 focus:ring-violet-500/10 transition-all duration-300 text-base leading-relaxed text-slate-700 dark:text-slate-300 shadow-xl shadow-slate-200/50 dark:shadow-slate-950/50"
//                   placeholder="Start writing your lesson content here... ✍️"
//                 />
//               </div>
//               <div className="flex items-center justify-between mt-4 text-sm text-slate-400">
//                 <span>{lesson.content?.length || 0} characters</span>
//                 <span>Markdown supported</span>
//               </div>
//             </div>
//           )}

//           {/* Video Tab */}
//           {lessonTab === 'video' && (
//             <div className="max-w-3xl mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
//               <div className="flex items-center gap-3 mb-6">
//                 <div className="p-2 bg-rose-100 dark:bg-rose-900/30 rounded-lg">
//                   <Video size={20} className="text-rose-600 dark:text-rose-400" />
//                 </div>
//                 <div>
//                   <h4 className="font-bold text-slate-900 dark:text-white">Lesson Video</h4>
//                   <p className="text-xs text-slate-500">Upload or manage your lesson video content</p>
//                 </div>
//               </div>

//               {hasVideo ? (
//                 <div className="space-y-6">
//                   <div className="relative bg-slate-900 rounded-2xl overflow-hidden aspect-video shadow-2xl shadow-slate-900/50 ring-1 ring-white/10">
//                     <video
//                       controls
//                       src={lesson.video instanceof File ? URL.createObjectURL(lesson.video) : lesson.videoUrl}
//                       className="w-full h-full object-contain"
//                     />
//                     <div className="absolute top-4 left-4 flex items-center gap-2 bg-black/60 backdrop-blur-sm px-3 py-1.5 rounded-full">
//                       <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
//                       <span className="text-white text-xs font-medium">Video Ready</span>
//                     </div>
//                   </div>
//                   <div className="flex justify-between items-center bg-white dark:bg-slate-900 p-5 rounded-2xl border-2 border-slate-200 dark:border-slate-800 shadow-lg">
//                     <div className="flex items-center gap-4">
//                       <div className="p-3 bg-gradient-to-br from-rose-500 to-pink-500 rounded-xl shadow-lg shadow-rose-500/25">
//                         <Play size={24} className="text-white" />
//                       </div>
//                       <div>
//                         <p className="font-bold text-slate-900 dark:text-white">
//                           {lesson.video instanceof File ? lesson.video.name : 'Hosted Video'}
//                         </p>
//                         <p className="text-sm text-slate-500 flex items-center gap-2 mt-0.5">
//                           <CheckCircle2 size={14} className="text-green-500" />
//                           Ready to play
//                         </p>
//                       </div>
//                     </div>
//                     <button
//                       onClick={onVideoRemove}
//                       className="group flex items-center gap-2 text-rose-500 hover:text-white hover:bg-rose-500 border-2 border-rose-200 hover:border-rose-500 px-4 py-2.5 rounded-xl font-semibold transition-all duration-300"
//                     >
//                       <Trash2 size={16} className="group-hover:scale-110 transition-transform" />
//                       Remove
//                     </button>
//                   </div>
//                 </div>
//               ) : (
//                 <div
//                   className={`relative border-3 border-dashed rounded-3xl p-16 text-center bg-white dark:bg-slate-900 transition-all duration-300 ${isDragging
//                       ? 'border-rose-400 bg-rose-50 dark:bg-rose-950/20 scale-[1.02]'
//                       : 'border-slate-300 dark:border-slate-700 hover:border-rose-300 dark:hover:border-rose-600'
//                     }`}
//                   onDragOver={handleDragOver}
//                   onDragLeave={handleDragLeave}
//                   onDrop={handleDrop}
//                 >
//                   <div className="relative">
//                     <div className="absolute inset-0 bg-rose-500/20 blur-3xl rounded-full animate-pulse" />
//                     <div className="relative w-24 h-24 bg-gradient-to-br from-rose-100 to-pink-100 dark:from-rose-900/30 dark:to-pink-900/30 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-rose-500/10">
//                       <Video size={40} className="text-rose-500" />
//                     </div>
//                   </div>
//                   <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
//                     Drop your video here
//                   </h4>
//                   <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-md mx-auto">
//                     Drag and drop your video file, or click to browse.
//                     <span className="block mt-1 text-sm">Supports MP4, AVI, MOV • Max 500MB</span>
//                   </p>
//                   <input type="file" accept="video/*" onChange={onVideoUpload} className="hidden" id="main-video" />
//                   <label
//                     htmlFor="main-video"
//                     className="inline-flex items-center gap-3 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white px-8 py-4 rounded-2xl cursor-pointer font-bold transition-all duration-300 shadow-xl shadow-rose-500/30 hover:shadow-2xl hover:shadow-rose-500/40 hover:scale-105"
//                   >
//                     <Upload size={20} />
//                     Select Video File
//                   </label>
//                 </div>
//               )}
//             </div>
//           )}

//           {/* Materials Tab */}
//           {lessonTab === 'materials' && (
//             <div className="w-full space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

//               {/* Overview Section */}
//               <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//                 <div className="bg-gradient-to-br from-violet-500 to-fuchsia-500 p-5 rounded-2xl text-white shadow-xl shadow-violet-500/25">
//                   <div className="flex items-center justify-between mb-3">
//                     <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
//                       <Paperclip size={20} />
//                     </div>
//                     <span className="text-3xl font-bold">{totalMaterials}</span>
//                   </div>
//                   <p className="text-sm font-medium text-white/80">Total Materials</p>
//                 </div>

//                 <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border-2 border-slate-200 dark:border-slate-800 shadow-lg">
//                   <div className="flex items-center justify-between mb-3">
//                     <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
//                       <FileIcon size={20} className="text-blue-600 dark:text-blue-400" />
//                     </div>
//                     <span className="text-3xl font-bold text-slate-900 dark:text-white">{fileCount}</span>
//                   </div>
//                   <p className="text-sm font-medium text-slate-500">Files</p>
//                 </div>

//                 <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border-2 border-slate-200 dark:border-slate-800 shadow-lg">
//                   <div className="flex items-center justify-between mb-3">
//                     <div className="p-2 bg-cyan-100 dark:bg-cyan-900/30 rounded-lg">
//                       <LinkIcon size={20} className="text-cyan-600 dark:text-cyan-400" />
//                     </div>
//                     <span className="text-3xl font-bold text-slate-900 dark:text-white">{linkCount}</span>
//                   </div>
//                   <p className="text-sm font-medium text-slate-500">Links</p>
//                 </div>

//                 <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border-2 border-slate-200 dark:border-slate-800 shadow-lg">
//                   <div className="flex items-center justify-between mb-3">
//                     <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
//                       <CheckCircle2 size={20} className="text-green-600 dark:text-green-400" />
//                     </div>
//                     <span className="text-3xl font-bold text-slate-900 dark:text-white">{savedCount}</span>
//                   </div>
//                   <p className="text-sm font-medium text-slate-500">Saved</p>
//                   {pendingCount > 0 && (
//                     <p className="text-xs text-amber-500 mt-1">{pendingCount} pending</p>
//                   )}
//                 </div>
//               </div>

//               {/* Upload Section */}
//               <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//                 {/* File Upload Box */}
//                 <div
//                   className={`bg-white dark:bg-slate-900 border-2 rounded-2xl p-6 shadow-xl shadow-slate-200/50 dark:shadow-slate-950/50 transition-all duration-300 ${isDragging ? 'border-violet-400 ring-4 ring-violet-500/20' : 'border-slate-200 dark:border-slate-800'
//                     }`}
//                   onDragOver={handleDragOver}
//                   onDragLeave={handleDragLeave}
//                   onDrop={handleDrop}
//                 >
//                   <div className="flex items-center gap-3 mb-5">
//                     <div className="p-2.5 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-xl shadow-lg shadow-violet-500/25">
//                       <Upload size={18} className="text-white" />
//                     </div>
//                     <div>
//                       <h5 className="font-bold text-slate-900 dark:text-white">Upload Files</h5>
//                       <p className="text-xs text-slate-500">PDFs, documents, images, etc.</p>
//                     </div>
//                   </div>
//                   <input type="file" onChange={handleFileUpload} className="hidden" id="att-upload" multiple />
//                   <label
//                     htmlFor="att-upload"
//                     className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl cursor-pointer hover:border-violet-400 hover:bg-violet-50 dark:hover:bg-violet-950/20 transition-all duration-300 group"
//                   >
//                     <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-2xl group-hover:bg-violet-100 dark:group-hover:bg-violet-900/30 transition-colors mb-3">
//                       <FolderOpen size={32} className="text-slate-400 group-hover:text-violet-500 transition-colors" />
//                     </div>
//                     <span className="font-semibold text-slate-600 dark:text-slate-400 group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
//                       Click or drag files here
//                     </span>
//                   </label>
//                 </div>

//                 {/* Link Box */}
//                 <div className="bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-xl shadow-slate-200/50 dark:shadow-slate-950/50">
//                   <div className="flex items-center gap-3 mb-5">
//                     <div className="p-2.5 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl shadow-lg shadow-blue-500/25">
//                       <LinkIcon size={18} className="text-white" />
//                     </div>
//                     <div>
//                       <h5 className="font-bold text-slate-900 dark:text-white">Add Link</h5>
//                       <p className="text-xs text-slate-500">External resources, articles, tools</p>
//                     </div>
//                   </div>
//                   <div className="space-y-3">
//                     <input
//                       type="text"
//                       value={urlInput}
//                       onChange={e => setUrlInput(e.target.value)}
//                       onKeyPress={(e) => e.key === 'Enter' && handleUrlAdd()}
//                       placeholder="https://example.com/resource"
//                       className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none focus:border-blue-500 dark:focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
//                     />
//                     <button
//                       onClick={handleUrlAdd}
//                       disabled={!urlInput.trim()}
//                       className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 disabled:from-slate-300 disabled:to-slate-400 disabled:cursor-not-allowed text-white px-4 py-3 rounded-xl font-bold transition-all shadow-lg shadow-blue-500/25 disabled:shadow-none flex items-center justify-center gap-2"
//                     >
//                       <LinkIcon size={16} />
//                       Add External Link
//                     </button>
//                   </div>
//                 </div>
//               </div>

//               {/* Materials List/Grid */}
//               <div className="bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xl shadow-slate-200/50 dark:shadow-slate-950/50">
//                 {/* Header with View Toggle */}
//                 <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-gradient-to-r from-slate-50 to-white dark:from-slate-800/50 dark:to-slate-900">
//                   <div className="flex items-center justify-between">
//                     <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
//                       <Paperclip size={16} className="text-blue-500" />
//                       Attached Materials
//                     </h4>
//                     <div className="flex items-center gap-3">
//                       <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-3 py-1 rounded-full text-xs font-bold">
//                         {totalMaterials} items
//                       </span>
//                       <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-lg p-1">
//                         <button
//                           onClick={() => setViewMode('grid')}
//                           className={`p-2 rounded-md transition-all ${viewMode === 'grid'
//                               ? 'bg-white dark:bg-slate-700 shadow-sm text-violet-600 dark:text-violet-400'
//                               : 'text-slate-400 hover:text-slate-600'
//                             }`}
//                         >
//                           <Grid3X3 size={16} />
//                         </button>
//                         <button
//                           onClick={() => setViewMode('list')}
//                           className={`p-2 rounded-md transition-all ${viewMode === 'list'
//                               ? 'bg-white dark:bg-slate-700 shadow-sm text-violet-600 dark:text-violet-400'
//                               : 'text-slate-400 hover:text-slate-600'
//                             }`}
//                         >
//                           <List size={16} />
//                         </button>
//                       </div>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Empty State */}
//                 {(!lesson.attachments || lesson.attachments.length === 0) ? (
//                   <div className="p-16 text-center">
//                     <div className="relative inline-block">
//                       <div className="absolute inset-0 bg-blue-500/20 blur-3xl rounded-full" />
//                       <div className="relative w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
//                         <AlertCircle size={36} className="text-slate-300 dark:text-slate-600" />
//                       </div>
//                     </div>
//                     <p className="text-slate-500 font-semibold text-lg">No materials added yet</p>
//                     <p className="text-slate-400 text-sm mt-2 max-w-sm mx-auto">
//                       Upload files or add external links to provide additional resources for your students
//                     </p>
//                   </div>
//                 ) : viewMode === 'grid' ? (
//                   /* Grid View */
//                   <div className="p-6">
//                     {/* // Change this line in the Grid View section: */}
//                     <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-4">
//                       {lesson.attachments?.map((att, index) => {
//                         const fileInfo = getFileTypeInfo(att.name, att.type);
//                         const Icon = fileInfo.icon;

//                         return (
//                           <div
//                             key={index}
//                             className="group relative bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-4 border-2 border-transparent hover:border-slate-200 dark:hover:border-slate-700 hover:shadow-lg transition-all duration-300"
//                           >
//                             {/* File Icon */}
//                             <div className={`w-full aspect-square rounded-xl bg-gradient-to-br ${fileInfo.bg} flex items-center justify-center mb-4 shadow-lg group-hover:scale-105 transition-transform`}>
//                               <Icon size={32} className="text-white" />
//                             </div>

//                             {/* File Info */}
//                             <div className="space-y-2">
//                               <p className="font-semibold text-sm text-slate-900 dark:text-white truncate" title={att.name}>
//                                 {att.name}
//                               </p>
//                               <div className="flex items-center justify-between">
//                                 <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${att.id
//                                     ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
//                                     : 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400'
//                                   }`}>
//                                   {att.id ? 'Saved' : 'Pending'}
//                                 </span>
//                                 <span className="text-xs font-bold text-slate-400 uppercase">
//                                   {fileInfo.label}
//                                 </span>
//                               </div>
//                             </div>

//                             {/* Actions Menu */}
//                             <div className="absolute top-3 right-3">
//                               <button
//                                 onClick={() => setActiveMenu(activeMenu === index ? null : index)}
//                                 className="p-1.5 bg-white dark:bg-slate-900 rounded-lg shadow-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-slate-50"
//                               >
//                                 <MoreVertical size={14} className="text-slate-500" />
//                               </button>

//                               {activeMenu === index && (
//                                 <div className="absolute right-0 mt-1 w-40 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 py-2 z-10 animate-in fade-in slide-in-from-top-2 duration-200">
//                                   {att.url_link && (
//                                     <a
//                                       href={att.url_link}
//                                       target="_blank"
//                                       rel="noreferrer"
//                                       className="flex items-center gap-2 px-4 py-2 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700"
//                                       onClick={() => setActiveMenu(null)}
//                                     >
//                                       <ExternalLink size={14} />
//                                       Open Link
//                                     </a>
//                                   )}
//                                   {att.type === 'file' && (
//                                     <>
//                                       <button className="flex items-center gap-2 px-4 py-2 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 w-full text-left">
//                                         <Eye size={14} />
//                                         Preview
//                                       </button>
//                                       <button className="flex items-center gap-2 px-4 py-2 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 w-full text-left">
//                                         <Download size={14} />
//                                         Download
//                                       </button>
//                                     </>
//                                   )}
//                                   <button className="flex items-center gap-2 px-4 py-2 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 w-full text-left">
//                                     <Copy size={14} />
//                                     Copy Name
//                                   </button>
//                                   <hr className="my-2 border-slate-200 dark:border-slate-700" />
//                                   <button
//                                     onClick={() => {
//                                       onRemoveAttachment(index);
//                                       setActiveMenu(null);
//                                     }}
//                                     className="flex items-center gap-2 px-4 py-2 text-sm text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 w-full text-left"
//                                   >
//                                     <Trash2 size={14} />
//                                     Delete
//                                   </button>
//                                 </div>
//                               )}
//                             </div>
//                           </div>
//                         );
//                       })}
//                     </div>
//                   </div>
//                 ) : (
//                   /* List View */
//                   <div className="divide-y divide-slate-100 dark:divide-slate-800">
//                     {lesson.attachments?.map((att, index) => {
//                       const fileInfo = getFileTypeInfo(att.name, att.type);
//                       const Icon = fileInfo.icon;

//                       return (
//                         <div
//                           key={index}
//                           className="flex items-center justify-between p-5 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all duration-200 group"
//                         >
//                           <div className="flex items-center gap-4 overflow-hidden">
//                             <div className={`p-3 rounded-xl shrink-0 bg-gradient-to-br ${fileInfo.bg} shadow-lg transition-transform group-hover:scale-110`}>
//                               <Icon size={20} className="text-white" />
//                             </div>
//                             <div className="min-w-0">
//                               <p className="font-semibold text-slate-900 dark:text-white truncate max-w-md">
//                                 {att.name}
//                               </p>
//                               <div className="flex items-center gap-3 mt-1">
//                                 {att.id ? (
//                                   <span className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30 px-2 py-0.5 rounded-full font-medium">
//                                     <CheckCircle2 size={10} />
//                                     Saved
//                                   </span>
//                                 ) : (
//                                   <span className="flex items-center gap-1 text-xs text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-900/30 px-2 py-0.5 rounded-full font-medium animate-pulse">
//                                     Pending
//                                   </span>
//                                 )}
//                                 <span className="text-xs text-slate-400 uppercase tracking-wider font-bold">
//                                   {fileInfo.label}
//                                 </span>
//                               </div>
//                             </div>
//                           </div>
//                           <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
//                             {att.url_link && (
//                               <a
//                                 href={att.url_link}
//                                 target="_blank"
//                                 rel="noreferrer"
//                                 className="flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:hover:bg-blue-900/40 px-3 py-2 rounded-lg transition-all"
//                               >
//                                 <ExternalLink size={14} />
//                                 Open
//                               </a>
//                             )}
//                             {att.type === 'file' && (
//                               <button className="flex items-center gap-1.5 text-sm font-semibold text-slate-600 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 px-3 py-2 rounded-lg transition-all">
//                                 <Download size={14} />
//                                 Download
//                               </button>
//                             )}
//                             <button
//                               onClick={() => onRemoveAttachment(index)}
//                               className="p-2.5 text-slate-400 hover:text-white hover:bg-rose-500 rounded-lg transition-all duration-200"
//                               title="Remove"
//                             >
//                               <Trash2 size={16} />
//                             </button>
//                           </div>
//                         </div>
//                       );
//                     })}
//                   </div>
//                 )}
//               </div>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Click outside to close menu */}
//       {activeMenu !== null && (
//         <div
//           className="fixed inset-0 z-0"
//           onClick={() => setActiveMenu(null)}
//         />
//       )}
//     </div>
//   );
// };

import React, { useState } from 'react';
import {
  Edit3, Trash2, Save, X, Clock, Video,
  FileText, Upload, Paperclip, Link as LinkIcon, File as FileIcon,
  Play, ExternalLink, Sparkles, FolderOpen, CheckCircle2, AlertCircle,
  Grid3X3, List, Download, Image, FileVideo, FileAudio, Archive,
  FileSpreadsheet, Presentation, MoreVertical, Eye, Copy
} from 'lucide-react';
import type { Lesson, LessonTabType } from '../Utils/types';

interface LessonEditorProps {
  lesson: Lesson | null;
  editingLesson: number | null;
  lessonTab: LessonTabType;
  onLessonTabChange: (tab: LessonTabType) => void;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
  onDelete: () => void;
  onUpdateLesson: (field: keyof Lesson, value: any) => void;
  onVideoUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onVideoRemove: (index?: number) => void; 
  onAddAttachment: (file: File | null, url: string) => void;
  onRemoveAttachment: (index: number) => void;
}

const getFileTypeInfo = (fileName: string, type: string) => {
  if (type === 'link') {
    return { icon: LinkIcon, color: 'blue', bg: 'from-blue-500 to-cyan-500', label: 'Link' };
  }
  const ext = fileName.split('.').pop()?.toLowerCase() || '';
  const fileTypes: Record<string, { icon: any; color: string; bg: string; label: string }> = {
    pdf: { icon: FileText, color: 'red', bg: 'from-red-500 to-rose-500', label: 'PDF' },
    doc: { icon: FileText, color: 'blue', bg: 'from-blue-500 to-indigo-500', label: 'DOC' },
    docx: { icon: FileText, color: 'blue', bg: 'from-blue-500 to-indigo-500', label: 'DOCX' },
    txt: { icon: FileText, color: 'slate', bg: 'from-slate-500 to-slate-600', label: 'TXT' },
    xls: { icon: FileSpreadsheet, color: 'green', bg: 'from-green-500 to-emerald-500', label: 'XLS' },
    xlsx: { icon: FileSpreadsheet, color: 'green', bg: 'from-green-500 to-emerald-500', label: 'XLSX' },
    ppt: { icon: Presentation, color: 'orange', bg: 'from-orange-500 to-amber-500', label: 'PPT' },
    pptx: { icon: Presentation, color: 'orange', bg: 'from-orange-500 to-amber-500', label: 'PPTX' },
    jpg: { icon: Image, color: 'pink', bg: 'from-pink-500 to-rose-500', label: 'JPG' },
    jpeg: { icon: Image, color: 'pink', bg: 'from-pink-500 to-rose-500', label: 'JPEG' },
    png: { icon: Image, color: 'purple', bg: 'from-purple-500 to-violet-500', label: 'PNG' },
    mp4: { icon: FileVideo, color: 'red', bg: 'from-red-500 to-pink-500', label: 'MP4' },
    zip: { icon: Archive, color: 'amber', bg: 'from-amber-500 to-yellow-500', label: 'ZIP' },
  };
  return fileTypes[ext] || { icon: FileIcon, color: 'violet', bg: 'from-violet-500 to-fuchsia-500', label: ext.toUpperCase() || 'FILE' };
};

export const LessonEditor: React.FC<LessonEditorProps> = ({
  lesson,
  editingLesson,
  lessonTab,
  onLessonTabChange,
  onEdit,
  onSave,
  onCancel,
  onDelete,
  onUpdateLesson,
  onVideoUpload,
  onVideoRemove,
  onAddAttachment,
  onRemoveAttachment
}) => {
  const [urlInput, setUrlInput] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [activeMenu, setActiveMenu] = useState<number | null>(null);

  if (!lesson) {
    return <div className="flex flex-col items-center justify-center h-full">Select a lesson...</div>;
  }

  const isEditing = editingLesson === lesson.id;
  const hasVideo = lesson.videos && lesson.videos.length > 0;
  const totalMaterials = lesson.attachments?.length || 0;
  const fileCount = lesson.attachments?.filter(a => a.type === 'file').length || 0;
  const linkCount = lesson.attachments?.filter(a => a.type === 'link').length || 0;
  const pendingCount = lesson.attachments?.filter(a => !a.id).length || 0;
  const savedCount = totalMaterials - pendingCount;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      Array.from(e.target.files).forEach(file => onAddAttachment(file, ''));
      e.target.value = '';
    }
  };

  const handleUrlAdd = () => {
    if (urlInput.trim()) {
      onAddAttachment(null, urlInput);
      setUrlInput('');
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      Array.from(e.dataTransfer.files).forEach(file => onAddAttachment(file, ''));
    }
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-950">
      
      {/* Header */}
      <div className="shrink-0 px-8 py-6 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-800/50 sticky top-0 z-20">
        <div className="flex justify-between items-start gap-6">
          <div className="flex-1 min-w-0">
            {isEditing ? (
              <div className="space-y-4">
                <input
                  type="text"
                  value={lesson.title}
                  onChange={(e) => onUpdateLesson('title', e.target.value)}
                  className="relative text-2xl font-bold w-full px-5 py-3 bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl outline-none"
                  placeholder="Enter lesson title..."
                />
                <div className="flex flex-wrap gap-4 items-center">
                  <div className="flex items-center gap-2 bg-white dark:bg-slate-800 px-4 py-2.5 rounded-xl border-2 border-slate-200 dark:border-slate-700">
                    <Clock size={16} className="text-violet-500" />
                    <input
                      type="text"
                      value={lesson.duration}
                      onChange={(e) => onUpdateLesson('duration', e.target.value)}
                      className="bg-transparent w-20 text-sm font-semibold outline-none"
                      placeholder="00:00"
                    />
                  </div>
                  <label className="flex items-center gap-3 cursor-pointer select-none bg-white dark:bg-slate-800 px-4 py-2.5 rounded-xl border-2 border-slate-200 dark:border-slate-700">
                    <input
                      type="checkbox"
                      checked={lesson.sample || false}
                      onChange={(e) => onUpdateLesson('sample', e.target.checked)}
                      className="mr-2"
                    />
                    <span className="text-sm font-semibold">Free Preview</span>
                  </label>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <h3 className="text-3xl font-bold">{lesson.title}</h3>
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-2 text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-lg">
                    <Clock size={14} className="text-violet-500" />
                    <span className="text-sm font-medium">{lesson.duration}</span>
                  </span>
                  {lesson.sample && <span className="bg-amber-100 text-amber-800 px-2 py-1 rounded text-xs font-bold">Free Preview</span>}
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-3 shrink-0">
            {isEditing ? (
              <>
                <button onClick={onSave} className="bg-violet-600 text-white px-6 py-2.5 rounded-xl font-semibold flex items-center gap-2">
                  <Save size={18} /> Save
                </button>
                <button onClick={onCancel} className="bg-white border-2 border-slate-200 text-slate-600 px-5 py-2.5 rounded-xl font-semibold flex items-center gap-2">
                  <X size={18} /> Cancel
                </button>
              </>
            ) : (
              <>
                <button onClick={onEdit} className="bg-white border-2 border-slate-200 text-slate-600 px-5 py-2.5 rounded-xl font-semibold flex items-center gap-2">
                  <Edit3 size={18} /> Edit
                </button>
                <button onClick={onDelete} className="bg-white border-2 border-slate-200 text-rose-500 p-2.5 rounded-xl hover:bg-rose-50">
                  <Trash2 size={18} />
                </button>
              </>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mt-8">
          {[
            { key: 'content', label: 'Content', icon: FileText, color: 'violet' },
            { key: 'video', label: 'Videos', icon: Video, color: 'rose' },
            { key: 'materials', label: 'Materials', icon: Paperclip, color: 'blue', badge: totalMaterials }
          ].map(({ key, label, icon: Icon, badge }) => (
            <button
              key={key}
              onClick={() => onLessonTabChange(key as LessonTabType)}
              className={`relative flex items-center gap-2.5 px-5 py-3 rounded-xl font-semibold text-sm transition-all duration-300 ${lessonTab === key
                  ? 'bg-violet-600 text-white shadow-lg'
                  : 'bg-white dark:bg-slate-800 text-slate-500 border-2 border-slate-200'
                }`}
            >
              <Icon size={18} />
              {label}
              {badge !== undefined && badge > 0 && (
                <span className="ml-1 px-2 py-0.5 rounded-full text-xs font-bold bg-white/20 text-white">
                  {badge}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-8">
        <div className="w-full h-full flex flex-col">

          {/* Content Tab */}
          {lessonTab === 'content' && (
            <div className="flex-1 flex flex-col h-full animate-in fade-in slide-in-from-bottom-4 duration-500">
              <textarea
                value={lesson.content}
                onChange={(e) => onUpdateLesson('content', e.target.value)}
                className="flex-1 w-full h-full min-h-[400px] p-8 bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 rounded-2xl resize-none outline-none focus:border-violet-400"
                placeholder="Start writing your lesson content here... ✍️"
              />
            </div>
          )}

          {/* === VIDEO TAB === */}
          {lessonTab === 'video' && (
            <div className="max-w-6xl mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-rose-100 dark:bg-rose-900/30 rounded-lg">
                    <Video size={20} className="text-rose-600 dark:text-rose-400" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white">Lesson Videos</h4>
                    <p className="text-xs text-slate-500">
                      {hasVideo
                        ? `${lesson.videos.length} video(s) uploaded` 
                        : 'Upload lesson video content'}
                    </p>
                  </div>
                </div>
                
                {hasVideo && (
                  <div>
                    <input type="file" accept="video/*" multiple onChange={onVideoUpload} className="hidden" id="add-more-video" />
                    <label 
                      htmlFor="add-more-video"
                      className="flex items-center gap-2 px-4 py-2 bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 rounded-lg text-sm font-bold cursor-pointer hover:bg-rose-100 transition-colors"
                    >
                      <Upload size={16} /> Add Video
                    </label>
                  </div>
                )}
              </div>

              {hasVideo ? (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                    {lesson.videos.map((vid, index) => (
                      <div key={index} className="flex flex-col bg-white dark:bg-slate-900 rounded-2xl border-2 border-slate-200 dark:border-slate-800 shadow-lg overflow-hidden group hover:shadow-xl transition-shadow">
                        <div className="relative aspect-video bg-black">
                          <video controls src={vid.url} className="w-full h-full object-contain" />
                          {!vid.id && (
                            <div className="absolute top-2 right-2 px-2 py-1 bg-amber-500 text-white text-[10px] font-bold uppercase rounded shadow-sm">
                              Unsaved
                            </div>
                          )}
                        </div>
                        <div className="p-4 flex items-center justify-between">
                          <div className="min-w-0">
                            <p className="font-bold text-slate-900 dark:text-white truncate text-sm" title={vid.name}>
                              {vid.name}
                            </p>
                            <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-1">
                              <CheckCircle2 size={12} className={vid.id ? "text-green-500" : "text-amber-500"} />
                              {vid.id ? 'Synced' : 'Pending Save'}
                            </p>
                          </div>
                          <button
                            onClick={() => onVideoRemove(index)}
                            className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-lg transition-colors"
                            title="Remove Video"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div
                  className={`relative border-3 border-dashed rounded-3xl p-16 text-center bg-white dark:bg-slate-900 transition-all duration-300 ${
                    isDragging
                      ? 'border-rose-400 bg-rose-50 dark:bg-rose-950/20 scale-[1.02]'
                      : 'border-slate-300 dark:border-slate-700 hover:border-rose-300 dark:hover:border-rose-600'
                  }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <div className="relative">
                    <div className="absolute inset-0 bg-rose-500/20 blur-3xl rounded-full animate-pulse" />
                    <div className="relative w-24 h-24 bg-gradient-to-br from-rose-100 to-pink-100 dark:from-rose-900/30 dark:to-pink-900/30 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-rose-500/10">
                      <Video size={40} className="text-rose-500" />
                    </div>
                  </div>
                  <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                    Drop your videos here
                  </h4>
                  <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-md mx-auto">
                    Upload one or multiple video files.
                    <span className="block mt-1 text-sm">Supports MP4, AVI, MOV • Max 500MB</span>
                  </p>
                  <input type="file" accept="video/*" multiple onChange={onVideoUpload} className="hidden" id="main-video-upload" />
                  <label
                    htmlFor="main-video-upload"
                    className="inline-flex items-center gap-3 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white px-8 py-4 rounded-2xl cursor-pointer font-bold transition-all duration-300 shadow-xl shadow-rose-500/30 hover:shadow-2xl hover:shadow-rose-500/40 hover:scale-105"
                  >
                    <Upload size={20} />
                    Select Video Files
                  </label>
                </div>
              )}
            </div>
          )}

          {/* Materials Tab */}
          {lessonTab === 'materials' && (
            <div className="w-full space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              {/* Overview Section */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-gradient-to-br from-violet-500 to-fuchsia-500 p-5 rounded-2xl text-white shadow-xl shadow-violet-500/25">
                  <div className="flex items-center justify-between mb-3">
                    <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                      <Paperclip size={20} />
                    </div>
                    <span className="text-3xl font-bold">{totalMaterials}</span>
                  </div>
                  <p className="text-sm font-medium text-white/80">Total Materials</p>
                </div>

                <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border-2 border-slate-200 dark:border-slate-800 shadow-lg">
                  <div className="flex items-center justify-between mb-3">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                      <FileIcon size={20} className="text-blue-600 dark:text-blue-400" />
                    </div>
                    <span className="text-3xl font-bold text-slate-900 dark:text-white">{fileCount}</span>
                  </div>
                  <p className="text-sm font-medium text-slate-500">Files</p>
                </div>

                <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border-2 border-slate-200 dark:border-slate-800 shadow-lg">
                  <div className="flex items-center justify-between mb-3">
                    <div className="p-2 bg-cyan-100 dark:bg-cyan-900/30 rounded-lg">
                      <LinkIcon size={20} className="text-cyan-600 dark:text-cyan-400" />
                    </div>
                    <span className="text-3xl font-bold text-slate-900 dark:text-white">{linkCount}</span>
                  </div>
                  <p className="text-sm font-medium text-slate-500">Links</p>
                </div>

                <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border-2 border-slate-200 dark:border-slate-800 shadow-lg">
                  <div className="flex items-center justify-between mb-3">
                    <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                      <CheckCircle2 size={20} className="text-green-600 dark:text-green-400" />
                    </div>
                    <span className="text-3xl font-bold text-slate-900 dark:text-white">{savedCount}</span>
                  </div>
                  <p className="text-sm font-medium text-slate-500">Saved</p>
                  {pendingCount > 0 && (
                    <p className="text-xs text-amber-500 mt-1">{pendingCount} pending</p>
                  )}
                </div>
              </div>

              {/* Upload Section */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* File Upload Box */}
                <div
                  className={`bg-white dark:bg-slate-900 border-2 rounded-2xl p-6 shadow-xl shadow-slate-200/50 dark:shadow-slate-950/50 transition-all duration-300 ${isDragging ? 'border-violet-400 ring-4 ring-violet-500/20' : 'border-slate-200 dark:border-slate-800'
                    }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <div className="flex items-center gap-3 mb-5">
                    <div className="p-2.5 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-xl shadow-lg shadow-violet-500/25">
                      <Upload size={18} className="text-white" />
                    </div>
                    <div>
                      <h5 className="font-bold text-slate-900 dark:text-white">Upload Files</h5>
                      <p className="text-xs text-slate-500">PDFs, documents, images, etc.</p>
                    </div>
                  </div>
                  <input type="file" onChange={handleFileUpload} className="hidden" id="att-upload" multiple />
                  <label
                    htmlFor="att-upload"
                    className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl cursor-pointer hover:border-violet-400 hover:bg-violet-50 dark:hover:bg-violet-950/20 transition-all duration-300 group"
                  >
                    <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-2xl group-hover:bg-violet-100 dark:group-hover:bg-violet-900/30 transition-colors mb-3">
                      <FolderOpen size={32} className="text-slate-400 group-hover:text-violet-500 transition-colors" />
                    </div>
                    <span className="font-semibold text-slate-600 dark:text-slate-400 group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
                      Click or drag files here
                    </span>
                  </label>
                </div>

                {/* Link Box */}
                <div className="bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-xl shadow-slate-200/50 dark:shadow-slate-950/50">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="p-2.5 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl shadow-lg shadow-blue-500/25">
                      <LinkIcon size={18} className="text-white" />
                    </div>
                    <div>
                      <h5 className="font-bold text-slate-900 dark:text-white">Add Link</h5>
                      <p className="text-xs text-slate-500">External resources, articles, tools</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <input
                      type="text"
                      value={urlInput}
                      onChange={e => setUrlInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleUrlAdd()}
                      placeholder="https://example.com/resource"
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none focus:border-blue-500 dark:focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
                    />
                    <button
                      onClick={handleUrlAdd}
                      disabled={!urlInput.trim()}
                      className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 disabled:from-slate-300 disabled:to-slate-400 disabled:cursor-not-allowed text-white px-4 py-3 rounded-xl font-bold transition-all shadow-lg shadow-blue-500/25 disabled:shadow-none flex items-center justify-center gap-2"
                    >
                      <LinkIcon size={16} />
                      Add External Link
                    </button>
                  </div>
                </div>
              </div>

              {/* Materials List/Grid */}
              <div className="bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xl shadow-slate-200/50 dark:shadow-slate-950/50">
                {/* Header with View Toggle */}
                <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-gradient-to-r from-slate-50 to-white dark:from-slate-800/50 dark:to-slate-900">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <Paperclip size={16} className="text-blue-500" />
                      Attached Materials
                    </h4>
                    <div className="flex items-center gap-3">
                      <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-3 py-1 rounded-full text-xs font-bold">
                        {totalMaterials} items
                      </span>
                      <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-lg p-1">
                        <button
                          onClick={() => setViewMode('grid')}
                          className={`p-2 rounded-md transition-all ${viewMode === 'grid'
                              ? 'bg-white dark:bg-slate-700 shadow-sm text-violet-600 dark:text-violet-400'
                              : 'text-slate-400 hover:text-slate-600'
                            }`}
                        >
                          <Grid3X3 size={16} />
                        </button>
                        <button
                          onClick={() => setViewMode('list')}
                          className={`p-2 rounded-md transition-all ${viewMode === 'list'
                              ? 'bg-white dark:bg-slate-700 shadow-sm text-violet-600 dark:text-violet-400'
                              : 'text-slate-400 hover:text-slate-600'
                            }`}
                        >
                          <List size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Empty State */}
                {(!lesson.attachments || lesson.attachments.length === 0) ? (
                  <div className="p-16 text-center">
                    <div className="relative inline-block">
                      <div className="absolute inset-0 bg-blue-500/20 blur-3xl rounded-full" />
                      <div className="relative w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <AlertCircle size={36} className="text-slate-300 dark:text-slate-600" />
                      </div>
                    </div>
                    <p className="text-slate-500 font-semibold text-lg">No materials added yet</p>
                    <p className="text-slate-400 text-sm mt-2 max-w-sm mx-auto">
                      Upload files or add external links to provide additional resources for your students
                    </p>
                  </div>
                ) : viewMode === 'grid' ? (
                  /* Grid View */
                  <div className="p-6">
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                      {lesson.attachments?.map((att, index) => {
                        const fileInfo = getFileTypeInfo(att.name, att.type);
                        const Icon = fileInfo.icon;

                        return (
                          <div
                            key={index}
                            className="group relative bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-4 border-2 border-transparent hover:border-slate-200 dark:hover:border-slate-700 hover:shadow-lg transition-all duration-300"
                          >
                            {/* File Icon */}
                            <div className={`w-full aspect-square rounded-xl bg-gradient-to-br ${fileInfo.bg} flex items-center justify-center mb-4 shadow-lg group-hover:scale-105 transition-transform`}>
                              <Icon size={32} className="text-white" />
                            </div>

                            {/* File Info */}
                            <div className="space-y-2">
                              <p className="font-semibold text-sm text-slate-900 dark:text-white truncate" title={att.name}>
                                {att.name}
                              </p>
                              <div className="flex items-center justify-between">
                                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${att.id
                                    ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                                    : 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400'
                                  }`}>
                                  {att.id ? 'Saved' : 'Pending'}
                                </span>
                                <span className="text-xs font-bold text-slate-400 uppercase">
                                  {fileInfo.label}
                                </span>
                              </div>
                            </div>

                            {/* Actions Menu */}
                            <div className="absolute top-3 right-3">
                              <button
                                onClick={() => setActiveMenu(activeMenu === index ? null : index)}
                                className="p-1.5 bg-white dark:bg-slate-900 rounded-lg shadow-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-slate-50"
                              >
                                <MoreVertical size={14} className="text-slate-500" />
                              </button>

                              {activeMenu === index && (
                                <div className="absolute right-0 mt-1 w-40 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 py-2 z-10 animate-in fade-in slide-in-from-top-2 duration-200">
                                  {att.url_link && (
                                    <a
                                      href={att.url_link}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="flex items-center gap-2 px-4 py-2 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700"
                                      onClick={() => setActiveMenu(null)}
                                    >
                                      <ExternalLink size={14} />
                                      Open Link
                                    </a>
                                  )}
                                  {att.type === 'file' && (
                                    <>
                                      <button className="flex items-center gap-2 px-4 py-2 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 w-full text-left">
                                        <Eye size={14} />
                                        Preview
                                      </button>
                                      <button className="flex items-center gap-2 px-4 py-2 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 w-full text-left">
                                        <Download size={14} />
                                        Download
                                      </button>
                                    </>
                                  )}
                                  <button className="flex items-center gap-2 px-4 py-2 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 w-full text-left">
                                    <Copy size={14} />
                                    Copy Name
                                  </button>
                                  <hr className="my-2 border-slate-200 dark:border-slate-700" />
                                  <button
                                    onClick={() => {
                                      onRemoveAttachment(index);
                                      setActiveMenu(null);
                                    }}
                                    className="flex items-center gap-2 px-4 py-2 text-sm text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 w-full text-left"
                                  >
                                    <Trash2 size={14} />
                                    Delete
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  /* List View */
                  <div className="divide-y divide-slate-100 dark:divide-slate-800">
                    {lesson.attachments?.map((att, index) => {
                      const fileInfo = getFileTypeInfo(att.name, att.type);
                      const Icon = fileInfo.icon;

                      return (
                        <div
                          key={index}
                          className="flex items-center justify-between p-5 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all duration-200 group"
                        >
                          <div className="flex items-center gap-4 overflow-hidden">
                            <div className={`p-3 rounded-xl shrink-0 bg-gradient-to-br ${fileInfo.bg} shadow-lg transition-transform group-hover:scale-110`}>
                              <Icon size={20} className="text-white" />
                            </div>
                            <div className="min-w-0">
                              <p className="font-semibold text-slate-900 dark:text-white truncate max-w-md">
                                {att.name}
                              </p>
                              <div className="flex items-center gap-3 mt-1">
                                {att.id ? (
                                  <span className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30 px-2 py-0.5 rounded-full font-medium">
                                    <CheckCircle2 size={10} />
                                    Saved
                                  </span>
                                ) : (
                                  <span className="flex items-center gap-1 text-xs text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-900/30 px-2 py-0.5 rounded-full font-medium animate-pulse">
                                    Pending
                                  </span>
                                )}
                                <span className="text-xs text-slate-400 uppercase tracking-wider font-bold">
                                  {fileInfo.label}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            {att.url_link && (
                              <a
                                href={att.url_link}
                                target="_blank"
                                rel="noreferrer"
                                className="flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:hover:bg-blue-900/40 px-3 py-2 rounded-lg transition-all"
                              >
                                <ExternalLink size={14} />
                                Open
                              </a>
                            )}
                            {att.type === 'file' && (
                              <button className="flex items-center gap-1.5 text-sm font-semibold text-slate-600 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 px-3 py-2 rounded-lg transition-all">
                                <Download size={14} />
                                Download
                              </button>
                            )}
                            <button
                              onClick={() => onRemoveAttachment(index)}
                              className="p-2.5 text-slate-400 hover:text-white hover:bg-rose-500 rounded-lg transition-all duration-200"
                              title="Remove"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Click outside to close menu */}
      {activeMenu !== null && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => setActiveMenu(null)}
        />
      )}
    </div>
  );
};