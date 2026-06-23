



// // // // import React, { useState, useRef } from 'react';
// // // // import { 
// // // //   Upload, Image, X, Info, Star, Users, TrendingUp, Award, Clock, Building2,
// // // //   Check, AlertCircle, ChevronDown, ChevronUp, Sparkles, FileImage, Trash2,
// // // //   Eye, EyeOff, GraduationCap, Tag, Plus, HelpCircle, Zap, Target, BarChart3,
// // // //   BookOpen, User, Timer, Hash, Lightbulb, CheckCircle, XCircle, Camera
// // // // } from 'lucide-react';
// // // // import type { Course } from '../Utils/types';

// // // // interface BasicInfoSectionProps {
// // // //   course: Course;
// // // //   updateBasicInfo: (field: string, value: string | number | boolean) => void;
// // // //   updateStats: (field: keyof Course['stats'], value: number | string) => void;
// // // //   updateTags: (tags: string) => void;
// // // //   handlePhotoUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
// // // //   removePhoto: () => void;
// // // // }

// // // // // --- SECTION CARD COMPONENT ---
// // // // const SectionCard: React.FC<{
// // // //   title: string;
// // // //   subtitle?: string;
// // // //   icon: React.ReactNode;
// // // //   iconBg: string;
// // // //   children: React.ReactNode;
// // // //   collapsible?: boolean;
// // // //   defaultOpen?: boolean;
// // // //   badge?: string;
// // // // }> = ({ title, subtitle, icon, iconBg, children, collapsible = false, defaultOpen = true, badge }) => {
// // // //   const [isOpen, setIsOpen] = useState(defaultOpen);

// // // //   return (
// // // //     <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
// // // //       <div 
// // // //         className={`px-6 py-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between ${collapsible ? 'cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50' : ''}`}
// // // //         onClick={() => collapsible && setIsOpen(!isOpen)}
// // // //       >
// // // //         <div className="flex items-center gap-4">
// // // //           <div className={`p-3 rounded-xl ${iconBg} shadow-lg`}>
// // // //             {icon}
// // // //           </div>
// // // //           <div>
// // // //             <div className="flex items-center gap-2">
// // // //               <h3 className="text-lg font-bold text-slate-900 dark:text-white">{title}</h3>
// // // //               {badge && (
// // // //                 <span className="px-2 py-0.5 text-[10px] font-bold bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400 rounded-full">
// // // //                   {badge}
// // // //                 </span>
// // // //               )}
// // // //             </div>
// // // //             {subtitle && <p className="text-sm text-slate-500 dark:text-slate-400">{subtitle}</p>}
// // // //           </div>
// // // //         </div>
// // // //         {collapsible && (
// // // //           <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
// // // //             {isOpen ? <ChevronUp size={20} className="text-slate-400" /> : <ChevronDown size={20} className="text-slate-400" />}
// // // //           </button>
// // // //         )}
// // // //       </div>
// // // //       {(!collapsible || isOpen) && (
// // // //         <div className="p-6">
// // // //           {children}
// // // //         </div>
// // // //       )}
// // // //     </div>
// // // //   );
// // // // };

// // // // // --- INPUT FIELD COMPONENT ---
// // // // const InputField: React.FC<{
// // // //   label: string;
// // // //   icon?: React.ReactNode;
// // // //   value: string | number;
// // // //   onChange: (value: string) => void;
// // // //   placeholder?: string;
// // // //   type?: string;
// // // //   required?: boolean;
// // // //   maxLength?: number;
// // // //   helpText?: string;
// // // //   error?: string;
// // // //   disabled?: boolean;
// // // // }> = ({ label, icon, value, onChange, placeholder, type = 'text', required, maxLength, helpText, error, disabled }) => {
// // // //   const charCount = typeof value === 'string' ? value.length : 0;
// // // //   const isOverLimit = maxLength && charCount > maxLength;

// // // //   return (
// // // //     <div className="space-y-2">
// // // //       <label className="flex items-center justify-between">
// // // //         <span className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
// // // //           {icon}
// // // //           {label}
// // // //           {required && <span className="text-rose-500">*</span>}
// // // //         </span>
// // // //         {maxLength && (
// // // //           <span className={`text-xs font-medium ${isOverLimit ? 'text-rose-500' : 'text-slate-400'}`}>
// // // //             {charCount}/{maxLength}
// // // //           </span>
// // // //         )}
// // // //       </label>
// // // //       <div className="relative">
// // // //         <input
// // // //           type={type}
// // // //           value={value}
// // // //           onChange={(e) => onChange(e.target.value)}
// // // //           placeholder={placeholder}
// // // //           disabled={disabled}
// // // //           className={`w-full px-4 py-3.5 bg-slate-50 dark:bg-slate-800 border rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:ring-4 focus:ring-violet-500/20 focus:border-violet-500 outline-none transition-all ${
// // // //             error 
// // // //               ? 'border-rose-300 dark:border-rose-700' 
// // // //               : 'border-slate-200 dark:border-slate-700'
// // // //           } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
// // // //         />
// // // //         {value && !error && (
// // // //           <CheckCircle size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-emerald-500" />
// // // //         )}
// // // //         {error && (
// // // //           <XCircle size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-rose-500" />
// // // //         )}
// // // //       </div>
// // // //       {helpText && !error && (
// // // //         <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
// // // //           <Info size={12} />
// // // //           {helpText}
// // // //         </p>
// // // //       )}
// // // //       {error && (
// // // //         <p className="text-xs text-rose-500 flex items-center gap-1">
// // // //           <AlertCircle size={12} />
// // // //           {error}
// // // //         </p>
// // // //       )}
// // // //     </div>
// // // //   );
// // // // };

// // // // // --- TEXTAREA COMPONENT ---
// // // // const TextareaField: React.FC<{
// // // //   label: string;
// // // //   icon?: React.ReactNode;
// // // //   value: string;
// // // //   onChange: (value: string) => void;
// // // //   placeholder?: string;
// // // //   rows?: number;
// // // //   required?: boolean;
// // // //   maxLength?: number;
// // // //   helpText?: string;
// // // // }> = ({ label, icon, value, onChange, placeholder, rows = 4, required, maxLength, helpText }) => {
// // // //   const charCount = value.length;
// // // //   const isOverLimit = maxLength && charCount > maxLength;

// // // //   return (
// // // //     <div className="space-y-2">
// // // //       <label className="flex items-center justify-between">
// // // //         <span className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
// // // //           {icon}
// // // //           {label}
// // // //           {required && <span className="text-rose-500">*</span>}
// // // //         </span>
// // // //         {maxLength && (
// // // //           <span className={`text-xs font-medium ${isOverLimit ? 'text-rose-500' : 'text-slate-400'}`}>
// // // //             {charCount}/{maxLength}
// // // //           </span>
// // // //         )}
// // // //       </label>
// // // //       <textarea
// // // //         value={value}
// // // //         onChange={(e) => onChange(e.target.value)}
// // // //         placeholder={placeholder}
// // // //         rows={rows}
// // // //         className="w-full px-4 py-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:ring-4 focus:ring-violet-500/20 focus:border-violet-500 outline-none transition-all resize-none"
// // // //       />
// // // //       {helpText && (
// // // //         <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
// // // //           <Lightbulb size={12} />
// // // //           {helpText}
// // // //         </p>
// // // //       )}
// // // //     </div>
// // // //   );
// // // // };

// // // // // --- SELECT COMPONENT ---
// // // // const SelectField: React.FC<{
// // // //   label: string;
// // // //   icon?: React.ReactNode;
// // // //   value: string;
// // // //   onChange: (value: string) => void;
// // // //   options: { value: string; label: string; color?: string }[];
// // // //   required?: boolean;
// // // // }> = ({ label, icon, value, onChange, options, required }) => {
// // // //   return (
// // // //     <div className="space-y-2">
// // // //       <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
// // // //         {icon}
// // // //         {label}
// // // //         {required && <span className="text-rose-500">*</span>}
// // // //       </label>
// // // //       <div className="relative">
// // // //         <select
// // // //           value={value}
// // // //           onChange={(e) => onChange(e.target.value)}
// // // //           className="w-full px-4 py-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:ring-4 focus:ring-violet-500/20 focus:border-violet-500 outline-none transition-all cursor-pointer appearance-none"
// // // //         >
// // // //           {options.map(opt => (
// // // //             <option key={opt.value} value={opt.value}>{opt.label}</option>
// // // //           ))}
// // // //         </select>
// // // //         <ChevronDown size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
// // // //       </div>
// // // //     </div>
// // // //   );
// // // // };

// // // // // --- TAG INPUT COMPONENT ---
// // // // const TagInput: React.FC<{
// // // //   tags: string[];
// // // //   onChange: (tags: string) => void;
// // // // }> = ({ tags, onChange }) => {
// // // //   const [input, setInput] = useState('');
// // // //   const inputRef = useRef<HTMLInputElement>(null);

// // // //   const addTag = () => {
// // // //     if (input.trim() && !tags.includes(input.trim())) {
// // // //       const newTags = [...tags, input.trim()];
// // // //       onChange(newTags.join(', '));
// // // //       setInput('');
// // // //     }
// // // //   };

// // // //   const removeTag = (tagToRemove: string) => {
// // // //     const newTags = tags.filter(tag => tag !== tagToRemove);
// // // //     onChange(newTags.join(', '));
// // // //   };

// // // //   const handleKeyDown = (e: React.KeyboardEvent) => {
// // // //     if (e.key === 'Enter' || e.key === ',') {
// // // //       e.preventDefault();
// // // //       addTag();
// // // //     }
// // // //     if (e.key === 'Backspace' && !input && tags.length > 0) {
// // // //       removeTag(tags[tags.length - 1]);
// // // //     }
// // // //   };

// // // //   const tagColors = [
// // // //     'bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 border-violet-200 dark:border-violet-800',
// // // //     'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800',
// // // //     'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
// // // //     'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800',
// // // //     'bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800',
// // // //   ];

// // // //   return (
// // // //     <div className="space-y-3">
// // // //       <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
// // // //         <Tag size={16} className="text-violet-500" />
// // // //         Tags
// // // //         <span className="text-xs font-normal text-slate-400">({tags.length})</span>
// // // //       </label>
      
// // // //       <div 
// // // //         className="min-h-[120px] p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl cursor-text"
// // // //         onClick={() => inputRef.current?.focus()}
// // // //       >
// // // //         <div className="flex flex-wrap gap-2 mb-3">
// // // //           {tags.filter(t => t.trim()).map((tag, idx) => (
// // // //             <span
// // // //               key={idx}
// // // //               className={`group flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium border transition-all hover:shadow-sm ${tagColors[idx % tagColors.length]}`}
// // // //             >
// // // //               <Hash size={12} />
// // // //               {tag}
// // // //               <button
// // // //                 onClick={(e) => { e.stopPropagation(); removeTag(tag); }}
// // // //                 className="p-0.5 hover:bg-white/50 dark:hover:bg-black/20 rounded-full transition-colors"
// // // //               >
// // // //                 <X size={12} />
// // // //               </button>
// // // //             </span>
// // // //           ))}
// // // //         </div>
        
// // // //         <div className="flex items-center gap-2">
// // // //           <input
// // // //             ref={inputRef}
// // // //             type="text"
// // // //             value={input}
// // // //             onChange={(e) => setInput(e.target.value)}
// // // //             onKeyDown={handleKeyDown}
// // // //             placeholder={tags.length === 0 ? "Type a tag and press Enter..." : "Add another tag..."}
// // // //             className="flex-1 bg-transparent text-slate-900 dark:text-white placeholder-slate-400 outline-none text-sm"
// // // //           />
// // // //           {input.trim() && (
// // // //             <button
// // // //               onClick={addTag}
// // // //               className="p-1.5 bg-violet-500 text-white rounded-lg hover:bg-violet-600 transition-colors"
// // // //             >
// // // //               <Plus size={14} />
// // // //             </button>
// // // //           )}
// // // //         </div>
// // // //       </div>
      
// // // //       <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
// // // //         <Info size={12} />
// // // //         Press Enter or comma to add a tag. Click × to remove.
// // // //       </p>
// // // //     </div>
// // // //   );
// // // // };

// // // // // --- STAT INPUT CARD ---
// // // // const StatInputCard: React.FC<{
// // // //   icon: React.ReactNode;
// // // //   label: string;
// // // //   value: number | string;
// // // //   onChange: (value: number | string) => void;
// // // //   type?: 'number' | 'text';
// // // //   min?: number;
// // // //   max?: number;
// // // //   step?: number;
// // // //   unit?: string;
// // // //   gradient: string;
// // // // }> = ({ icon, label, value, onChange, type = 'number', min, max, step, unit, gradient }) => {
// // // //   return (
// // // //     <div className="relative overflow-hidden bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 group hover:shadow-lg transition-all">
// // // //       {/* Decorative gradient */}
// // // //       <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br ${gradient} opacity-10 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-500`} />
      
// // // //       <div className="relative">
// // // //         <div className={`inline-flex p-2.5 rounded-xl bg-gradient-to-br ${gradient} mb-3`}>
// // // //           {icon}
// // // //         </div>
// // // //         <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">{label}</p>
// // // //         <div className="flex items-end gap-1">
// // // //           <input
// // // //             type={type}
// // // //             value={value}
// // // //             onChange={(e) => onChange(type === 'number' ? parseFloat(e.target.value) || 0 : e.target.value)}
// // // //             min={min}
// // // //             max={max}
// // // //             step={step}
// // // //             className="w-full bg-transparent text-2xl font-bold text-slate-900 dark:text-white focus:outline-none"
// // // //           />
// // // //           {unit && <span className="text-sm text-slate-400 mb-1">{unit}</span>}
// // // //         </div>
// // // //       </div>
// // // //     </div>
// // // //   );
// // // // };

// // // // // --- IMAGE UPLOAD COMPONENT ---
// // // // const ImageUpload: React.FC<{
// // // //   imageUrl?: string;
// // // //   onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
// // // //   onRemove: () => void;
// // // // }> = ({ imageUrl, onUpload, onRemove }) => {
// // // //   const [isDragging, setIsDragging] = useState(false);

// // // //   const handleDragOver = (e: React.DragEvent) => {
// // // //     e.preventDefault();
// // // //     setIsDragging(true);
// // // //   };

// // // //   const handleDragLeave = () => {
// // // //     setIsDragging(false);
// // // //   };

// // // //   const handleDrop = (e: React.DragEvent) => {
// // // //     e.preventDefault();
// // // //     setIsDragging(false);
// // // //     const files = e.dataTransfer.files;
// // // //     if (files.length > 0) {
// // // //       const fakeEvent = { target: { files } } as React.ChangeEvent<HTMLInputElement>;
// // // //       onUpload(fakeEvent);
// // // //     }
// // // //   };

// // // //   return (
// // // //     <div className="space-y-3">
// // // //       <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
// // // //         <Camera size={16} className="text-violet-500" />
// // // //         Course Thumbnail
// // // //         <span className="text-xs font-normal text-slate-400">(Recommended: 1280×720)</span>
// // // //       </label>

// // // //       <div className="flex flex-col lg:flex-row gap-6">
// // // //         {/* Preview */}
// // // //         {imageUrl ? (
// // // //           <div className="relative group w-full lg:w-80 h-48 rounded-2xl overflow-hidden shadow-lg">
// // // //             <img
// // // //               src={imageUrl}
// // // //               alt="Course preview"
// // // //               className="w-full h-full object-cover"
// // // //             />
// // // //             <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
// // // //             <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity">
// // // //               <span className="text-xs text-white/80 bg-black/40 px-2 py-1 rounded-lg backdrop-blur-sm">
// // // //                 Course Thumbnail
// // // //               </span>
// // // //               <button
// // // //                 onClick={onRemove}
// // // //                 className="p-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition-colors shadow-lg"
// // // //               >
// // // //                 <Trash2 size={14} />
// // // //               </button>
// // // //             </div>
// // // //             {/* Replace button overlay */}
// // // //             <label className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
// // // //               <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg font-semibold text-sm text-slate-900">
// // // //                 <Camera size={16} />
// // // //                 Replace Image
// // // //               </div>
// // // //               <input
// // // //                 type="file"
// // // //                 accept="image/*"
// // // //                 onChange={onUpload}
// // // //                 className="hidden"
// // // //               />
// // // //             </label>
// // // //           </div>
// // // //         ) : (
// // // //           <label
// // // //             onDragOver={handleDragOver}
// // // //             onDragLeave={handleDragLeave}
// // // //             onDrop={handleDrop}
// // // //             className={`relative w-full lg:w-80 h-48 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all ${
// // // //               isDragging
// // // //                 ? 'border-violet-500 bg-violet-50 dark:bg-violet-900/20'
// // // //                 : 'border-slate-300 dark:border-slate-700 hover:border-violet-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'
// // // //             }`}
// // // //           >
// // // //             <div className={`p-4 rounded-full mb-3 transition-all ${isDragging ? 'bg-violet-100 dark:bg-violet-900/30' : 'bg-slate-100 dark:bg-slate-800'}`}>
// // // //               <FileImage size={32} className={isDragging ? 'text-violet-500' : 'text-slate-400'} />
// // // //             </div>
// // // //             <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">
// // // //               {isDragging ? 'Drop image here' : 'Click or drag to upload'}
// // // //             </p>
// // // //             <p className="text-xs text-slate-400">PNG, JPG, GIF up to 5MB</p>
// // // //             <input
// // // //               type="file"
// // // //               accept="image/*"
// // // //               onChange={onUpload}
// // // //               className="hidden"
// // // //             />
// // // //           </label>
// // // //         )}

// // // //         {/* Tips */}
// // // //         <div className="flex-1 space-y-3">
// // // //           <div className="p-4 bg-gradient-to-r from-violet-50 to-purple-50 dark:from-violet-900/20 dark:to-purple-900/20 border border-violet-200 dark:border-violet-800 rounded-xl">
// // // //             <h4 className="text-sm font-bold text-violet-900 dark:text-violet-100 mb-2 flex items-center gap-2">
// // // //               <Lightbulb size={14} className="text-violet-500" />
// // // //               Image Tips
// // // //             </h4>
// // // //             <ul className="text-xs text-violet-700 dark:text-violet-300 space-y-1.5">
// // // //               <li className="flex items-start gap-2">
// // // //                 <Check size={12} className="mt-0.5 shrink-0" />
// // // //                 Use high-quality images (1280×720 or 1920×1080)
// // // //               </li>
// // // //               <li className="flex items-start gap-2">
// // // //                 <Check size={12} className="mt-0.5 shrink-0" />
// // // //                 Keep important content in the center
// // // //               </li>
// // // //               <li className="flex items-start gap-2">
// // // //                 <Check size={12} className="mt-0.5 shrink-0" />
// // // //                 Use relevant, professional imagery
// // // //               </li>
// // // //               <li className="flex items-start gap-2">
// // // //                 <Check size={12} className="mt-0.5 shrink-0" />
// // // //                 Avoid text-heavy thumbnails
// // // //               </li>
// // // //             </ul>
// // // //           </div>
// // // //         </div>
// // // //       </div>
// // // //     </div>
// // // //   );
// // // // };

// // // // // --- PUBLISH TOGGLE ---
// // // // const PublishToggle: React.FC<{
// // // //   isPublished: boolean;
// // // //   onChange: (value: boolean) => void;
// // // // }> = ({ isPublished, onChange }) => {
// // // //   return (
// // // //     <div className={`p-5 rounded-2xl border-2 transition-all ${
// // // //       isPublished 
// // // //         ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800' 
// // // //         : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700'
// // // //     }`}>
// // // //       <label className="flex items-center justify-between cursor-pointer">
// // // //         <div className="flex items-center gap-4">
// // // //           <div className={`p-3 rounded-xl ${isPublished ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-600'}`}>
// // // //             {isPublished ? <Eye size={20} className="text-white" /> : <EyeOff size={20} className="text-white" />}
// // // //           </div>
// // // //           <div>
// // // //             <h4 className="text-base font-bold text-slate-900 dark:text-white">
// // // //               {isPublished ? 'Course is Published' : 'Course is Draft'}
// // // //             </h4>
// // // //             <p className="text-sm text-slate-500 dark:text-slate-400">
// // // //               {isPublished 
// // // //                 ? 'This course is visible to all students' 
// // // //                 : 'Only you can see this course'}
// // // //             </p>
// // // //           </div>
// // // //         </div>
        
// // // //         <div className="relative">
// // // //           <input
// // // //             type="checkbox"
// // // //             checked={isPublished}
// // // //             onChange={(e) => onChange(e.target.checked)}
// // // //             className="sr-only peer"
// // // //           />
// // // //           <div className="w-14 h-8 bg-slate-200 dark:bg-slate-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-violet-500/20 rounded-full peer peer-checked:after:translate-x-6 after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all after:shadow-md peer-checked:bg-emerald-500"></div>
// // // //         </div>
// // // //       </label>
// // // //     </div>
// // // //   );
// // // // };

// // // // // --- MAIN COMPONENT ---
// // // // export const BasicInfoSection: React.FC<BasicInfoSectionProps> = ({
// // // //   course,
// // // //   updateBasicInfo,
// // // //   updateStats,
// // // //   updateTags,
// // // //   handlePhotoUpload,
// // // //   removePhoto
// // // // }) => {
// // // //   // Validation
// // // //   const titleError = !course.title.trim() ? 'Course title is required' : undefined;
// // // //   const instructorError = !course.instructor_name?.trim() ? 'Instructor name is required' : undefined;

// // // //   const levelOptions = [
// // // //     { value: 'Beginner', label: '🌱 Beginner', color: 'emerald' },
// // // //     { value: 'Intermediate', label: '🌿 Intermediate', color: 'blue' },
// // // //     { value: 'Advanced', label: '🌳 Advanced', color: 'purple' }
// // // //   ];

// // // //   return (
// // // //     <div className="space-y-6">
      
// // // //       {/* Course Details Section */}
// // // //       <SectionCard
// // // //         title="Course Details"
// // // //         subtitle="Essential information about your course"
// // // //         icon={<BookOpen size={20} className="text-white" />}
// // // //         iconBg="bg-gradient-to-br from-violet-500 to-purple-600"
// // // //       >
// // // //         <div className="space-y-6">
// // // //           {/* Thumbnail */}
// // // //           <ImageUpload
// // // //             imageUrl={course.photoUrl}
// // // //             onUpload={handlePhotoUpload}
// // // //             onRemove={removePhoto}
// // // //           />

// // // //           <div className="border-t border-slate-200 dark:border-slate-700 pt-6">
// // // //             {/* Title */}
// // // //             <InputField
// // // //               label="Course Title"
// // // //               icon={<BookOpen size={16} className="text-violet-500" />}
// // // //               value={course.title}
// // // //               onChange={(v) => updateBasicInfo('title', v)}
// // // //               placeholder="e.g., Complete React Development Masterclass"
// // // //               required
// // // //               maxLength={100}
// // // //               error={titleError}
// // // //               helpText="Choose a clear, descriptive title that highlights the value"
// // // //             />
// // // //           </div>

// // // //           {/* Grid Fields */}
// // // //           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
// // // //             <InputField
// // // //               label="Instructor"
// // // //               icon={<User size={16} className="text-blue-500" />}
// // // //               value={course.instructor_name}
// // // //               onChange={(v) => updateBasicInfo('instructor_name', v)}
// // // //               placeholder="e.g., John Doe"
// // // //               required
// // // //               error={instructorError}
// // // //             />

// // // //             <InputField
// // // //               label="Department"
// // // //               icon={<Building2 size={16} className="text-teal-500" />}
// // // //               value={course.department || ''}
// // // //               onChange={(v) => updateBasicInfo('department', v)}
// // // //               placeholder="e.g., IT, Sales, HR"
// // // //               helpText="Categorize by department for easy filtering"
// // // //             />

// // // //             <SelectField
// // // //               label="Difficulty Level"
// // // //               icon={<GraduationCap size={16} className="text-amber-500" />}
// // // //               value={course.level}
// // // //               onChange={(v) => updateBasicInfo('level', v)}
// // // //               options={levelOptions}
// // // //               required
// // // //             />

// // // //             <InputField
// // // //               label="Duration"
// // // //               icon={<Clock size={16} className="text-rose-500" />}
// // // //               value={course.duration}
// // // //               onChange={(v) => updateBasicInfo('duration', v)}
// // // //               placeholder="e.g., 10 hours"
// // // //               helpText="Estimated time to complete"
// // // //             />
// // // //           </div>

// // // //           {/* Description */}
// // // //           <TextareaField
// // // //             label="Short Description"
// // // //             icon={<Info size={16} className="text-sky-500" />}
// // // //             value={course.description}
// // // //             onChange={(v) => updateBasicInfo('description', v)}
// // // //             placeholder="Brief overview of what students will learn..."
// // // //             rows={3}
// // // //             maxLength={300}
// // // //             helpText="This appears in course cards and search results"
// // // //           />

// // // //           {/* Introduction */}
// // // //           <TextareaField
// // // //             label="Full Introduction"
// // // //             icon={<Sparkles size={16} className="text-amber-500" />}
// // // //             value={course.introduction}
// // // //             onChange={(v) => updateBasicInfo('introduction', v)}
// // // //             placeholder="Detailed introduction including learning objectives, prerequisites, and what makes this course unique..."
// // // //             rows={5}
// // // //             helpText="Shown on the course landing page. Be compelling!"
// // // //           />

// // // //           {/* Tags */}
// // // //           <TagInput
// // // //             tags={course.tags || []}
// // // //             onChange={updateTags}
// // // //           />
// // // //         </div>
// // // //       </SectionCard>

// // // //       {/* Statistics Section */}
// // // //       <SectionCard
// // // //         title="Course Statistics"
// // // //         subtitle="Track and display course metrics"
// // // //         icon={<BarChart3 size={20} className="text-white" />}
// // // //         iconBg="bg-gradient-to-br from-blue-500 to-cyan-600"
// // // //         collapsible
// // // //         defaultOpen={false}
// // // //         badge="Optional"
// // // //       >
// // // //         <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
// // // //           <StatInputCard
// // // //             icon={<Star size={18} className="text-white" />}
// // // //             label="Rating"
// // // //             value={course.stats.rating}
// // // //             onChange={(v) => updateStats('rating', v as number)}
// // // //             type="number"
// // // //             min={0}
// // // //             max={5}
// // // //             step={0.1}
// // // //             gradient="from-amber-400 to-orange-500"
// // // //           />

// // // //           <StatInputCard
// // // //             icon={<Users size={18} className="text-white" />}
// // // //             label="Enrolled"
// // // //             value={course.stats.enrolled}
// // // //             onChange={(v) => updateStats('enrolled', v as number)}
// // // //             type="number"
// // // //             min={0}
// // // //             gradient="from-blue-500 to-cyan-500"
// // // //           />

// // // //           <StatInputCard
// // // //             icon={<Target size={18} className="text-white" />}
// // // //             label="Accuracy"
// // // //             value={course.stats.accuracy}
// // // //             onChange={(v) => updateStats('accuracy', v as number)}
// // // //             type="number"
// // // //             min={0}
// // // //             max={100}
// // // //             unit="%"
// // // //             gradient="from-emerald-500 to-teal-500"
// // // //           />

// // // //           <StatInputCard
// // // //             icon={<TrendingUp size={18} className="text-white" />}
// // // //             label="Completion"
// // // //             value={course.stats.completion}
// // // //             onChange={(v) => updateStats('completion', v as number)}
// // // //             type="number"
// // // //             min={0}
// // // //             max={100}
// // // //             unit="%"
// // // //             gradient="from-violet-500 to-purple-500"
// // // //           />

// // // //           <StatInputCard
// // // //             icon={<Timer size={18} className="text-white" />}
// // // //             label="Duration"
// // // //             value={course.stats.duration}
// // // //             onChange={(v) => updateStats('duration', v as string)}
// // // //             type="text"
// // // //             gradient="from-rose-500 to-pink-500"
// // // //           />
// // // //         </div>
        
// // // //         <p className="text-xs text-slate-500 dark:text-slate-400 mt-4 flex items-center gap-2">
// // // //           <Info size={14} />
// // // //           These statistics are displayed on the course page to help students make informed decisions.
// // // //         </p>
// // // //       </SectionCard>

// // // //       {/* Publish Settings */}
// // // //       <SectionCard
// // // //         title="Publication Settings"
// // // //         subtitle="Control course visibility"
// // // //         icon={<Zap size={20} className="text-white" />}
// // // //         iconBg="bg-gradient-to-br from-emerald-500 to-teal-600"
// // // //       >
// // // //         <PublishToggle
// // // //           isPublished={course.is_published || false}
// // // //           onChange={(v) => updateBasicInfo('is_published', v)}
// // // //         />
        
// // // //         <div className="mt-4 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl">
// // // //           <div className="flex items-start gap-3">
// // // //             <AlertCircle size={18} className="text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
// // // //             <div>
// // // //               <h4 className="text-sm font-semibold text-amber-800 dark:text-amber-200">Before Publishing</h4>
// // // //               <p className="text-xs text-amber-700 dark:text-amber-300 mt-1">
// // // //                 Make sure you've added all lessons and tests. Once published, students can enroll and access your course content.
// // // //               </p>
// // // //             </div>
// // // //           </div>
// // // //         </div>
// // // //       </SectionCard>
// // // //     </div>
// // // //   );
// // // // };

// // // // export default BasicInfoSection;



// // // import React, { useState, useRef } from 'react';
// // // import { 
// // //   Upload, Image, X, Info, Star, Users, TrendingUp, Award, Clock, Building2,
// // //   Check, AlertCircle, ChevronDown, ChevronUp, Sparkles, FileImage, Trash2,
// // //   Eye, EyeOff, GraduationCap, Tag, Plus, HelpCircle, Zap, Target, BarChart3,
// // //   BookOpen, User, Timer, Hash, Lightbulb, CheckCircle, XCircle, Camera,
// // //   Palette, Wand2, Crown, Flame, Shield
// // // } from 'lucide-react';
// // // import type { Course } from '../Utils/types';

// // // interface BasicInfoSectionProps {
// // //   course: Course;
// // //   updateBasicInfo: (field: string, value: string | number | boolean) => void;
// // //   updateStats: (field: keyof Course['stats'], value: number | string) => void;
// // //   updateTags: (tags: string) => void;
// // //   handlePhotoUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
// // //   removePhoto: () => void;
// // // }

// // // // --- ANIMATED GRADIENT BACKGROUND ---
// // // const AnimatedGradient: React.FC<{ className?: string }> = ({ className }) => (
// // //   <div className={`absolute inset-0 overflow-hidden ${className}`}>
// // //     <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-violet-500/20 via-transparent to-transparent rounded-full blur-3xl animate-pulse" />
// // //     <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-blue-500/20 via-transparent to-transparent rounded-full blur-3xl animate-pulse delay-1000" />
// // //   </div>
// // // );

// // // // --- FLOATING PARTICLES ---
// // // const FloatingParticles: React.FC = () => (
// // //   <div className="absolute inset-0 overflow-hidden pointer-events-none">
// // //     {[...Array(6)].map((_, i) => (
// // //       <div
// // //         key={i}
// // //         className="absolute w-2 h-2 bg-gradient-to-r from-violet-400 to-purple-400 rounded-full opacity-30"
// // //         style={{
// // //           top: `${Math.random() * 100}%`,
// // //           left: `${Math.random() * 100}%`,
// // //           animation: `float ${3 + Math.random() * 4}s ease-in-out infinite`,
// // //           animationDelay: `${Math.random() * 2}s`
// // //         }}
// // //       />
// // //     ))}
// // //     <style>{`
// // //       @keyframes float {
// // //         0%, 100% { transform: translateY(0px) scale(1); opacity: 0.3; }
// // //         50% { transform: translateY(-20px) scale(1.2); opacity: 0.6; }
// // //       }
// // //     `}</style>
// // //   </div>
// // // );

// // // // --- SECTION CARD COMPONENT ---
// // // const SectionCard: React.FC<{
// // //   title: string;
// // //   subtitle?: string;
// // //   icon: React.ReactNode;
// // //   iconBg: string;
// // //   children: React.ReactNode;
// // //   collapsible?: boolean;
// // //   defaultOpen?: boolean;
// // //   badge?: string;
// // //   glowColor?: string;
// // // }> = ({ title, subtitle, icon, iconBg, children, collapsible = false, defaultOpen = true, badge, glowColor = 'violet' }) => {
// // //   const [isOpen, setIsOpen] = useState(defaultOpen);
// // //   const [isHovered, setIsHovered] = useState(false);

// // //   const glowStyles: Record<string, string> = {
// // //     violet: 'hover:shadow-violet-500/10',
// // //     blue: 'hover:shadow-blue-500/10',
// // //     emerald: 'hover:shadow-emerald-500/10',
// // //   };

// // //   return (
// // //     <div 
// // //       className={`group relative bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-3xl border border-slate-200/60 dark:border-slate-700/60 overflow-hidden shadow-xl shadow-slate-200/50 dark:shadow-slate-900/50 hover:shadow-2xl ${glowStyles[glowColor]} transition-all duration-500`}
// // //       onMouseEnter={() => setIsHovered(true)}
// // //       onMouseLeave={() => setIsHovered(false)}
// // //     >
// // //       {/* Animated border gradient */}
// // //       <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-violet-500/0 via-violet-500/10 to-purple-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
      
// // //       {/* Header */}
// // //       <div 
// // //         className={`relative px-8 py-6 flex items-center justify-between ${collapsible ? 'cursor-pointer' : ''}`}
// // //         onClick={() => collapsible && setIsOpen(!isOpen)}
// // //       >
// // //         {/* Decorative line */}
// // //         <div className="absolute bottom-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-slate-200 dark:via-slate-700 to-transparent" />
        
// // //         <div className="flex items-center gap-5">
// // //           {/* Icon with glow */}
// // //           <div className="relative">
// // //             <div className={`absolute inset-0 ${iconBg} blur-xl opacity-40 group-hover:opacity-60 transition-opacity duration-500`} />
// // //             <div className={`relative p-4 rounded-2xl ${iconBg} shadow-lg transform group-hover:scale-105 transition-transform duration-300`}>
// // //               {icon}
// // //             </div>
// // //           </div>
          
// // //           <div>
// // //             <div className="flex items-center gap-3">
// // //               <h3 className="text-xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
// // //                 {title}
// // //               </h3>
// // //               {badge && (
// // //                 <span className="px-3 py-1 text-[10px] font-bold bg-gradient-to-r from-violet-500/10 to-purple-500/10 dark:from-violet-500/20 dark:to-purple-500/20 text-violet-600 dark:text-violet-400 rounded-full border border-violet-200 dark:border-violet-800">
// // //                   {badge}
// // //                 </span>
// // //               )}
// // //             </div>
// // //             {subtitle && (
// // //               <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{subtitle}</p>
// // //             )}
// // //           </div>
// // //         </div>
        
// // //         {collapsible && (
// // //           <button className="p-3 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all duration-300 group/btn">
// // //             <div className={`transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
// // //               <ChevronDown size={20} className="text-slate-400 group-hover/btn:text-violet-500" />
// // //             </div>
// // //           </button>
// // //         )}
// // //       </div>
      
// // //       {/* Content with smooth animation */}
// // //       <div className={`overflow-hidden transition-all duration-500 ease-out ${(!collapsible || isOpen) ? 'max-h-[5000px] opacity-100' : 'max-h-0 opacity-0'}`}>
// // //         <div className="p-8 pt-6">
// // //           {children}
// // //         </div>
// // //       </div>
// // //     </div>
// // //   );
// // // };

// // // // --- ENHANCED INPUT FIELD ---
// // // const InputField: React.FC<{
// // //   label: string;
// // //   icon?: React.ReactNode;
// // //   value: string | number;
// // //   onChange: (value: string) => void;
// // //   placeholder?: string;
// // //   type?: string;
// // //   required?: boolean;
// // //   maxLength?: number;
// // //   helpText?: string;
// // //   error?: string;
// // //   disabled?: boolean;
// // // }> = ({ label, icon, value, onChange, placeholder, type = 'text', required, maxLength, helpText, error, disabled }) => {
// // //   const [isFocused, setIsFocused] = useState(false);
// // //   const charCount = typeof value === 'string' ? value.length : 0;
// // //   const isOverLimit = maxLength && charCount > maxLength;
// // //   const progress = maxLength ? (charCount / maxLength) * 100 : 0;

// // //   return (
// // //     <div className="space-y-3">
// // //       <label className="flex items-center justify-between">
// // //         <span className="flex items-center gap-2.5 text-sm font-semibold text-slate-700 dark:text-slate-300">
// // //           <span className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800">
// // //             {icon}
// // //           </span>
// // //           {label}
// // //           {required && <span className="text-rose-500 animate-pulse">*</span>}
// // //         </span>
// // //         {maxLength && (
// // //           <span className={`text-xs font-medium px-2 py-1 rounded-full ${
// // //             isOverLimit 
// // //               ? 'bg-rose-100 dark:bg-rose-900/30 text-rose-500' 
// // //               : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
// // //           }`}>
// // //             {charCount}/{maxLength}
// // //           </span>
// // //         )}
// // //       </label>
      
// // //       <div className="relative group">
// // //         {/* Glow effect on focus */}
// // //         <div className={`absolute -inset-1 bg-gradient-to-r from-violet-500 to-purple-500 rounded-2xl blur opacity-0 transition-opacity duration-300 ${isFocused ? 'opacity-20' : 'group-hover:opacity-10'}`} />
        
// // //         <div className="relative">
// // //           <input
// // //             type={type}
// // //             value={value}
// // //             onChange={(e) => onChange(e.target.value)}
// // //             onFocus={() => setIsFocused(true)}
// // //             onBlur={() => setIsFocused(false)}
// // //             placeholder={placeholder}
// // //             disabled={disabled}
// // //             className={`w-full px-5 py-4 bg-slate-50/80 dark:bg-slate-800/80 backdrop-blur-sm border-2 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 transition-all duration-300 ${
// // //               error 
// // //                 ? 'border-rose-300 dark:border-rose-700 focus:border-rose-500' 
// // //                 : isFocused
// // //                   ? 'border-violet-500 dark:border-violet-500'
// // //                   : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
// // //             } ${disabled ? 'opacity-50 cursor-not-allowed' : ''} focus:outline-none`}
// // //           />
          
// // //           {/* Status icons */}
// // //           <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
// // //             {value && !error && (
// // //               <div className="p-1 bg-emerald-100 dark:bg-emerald-900/30 rounded-full">
// // //                 <CheckCircle size={14} className="text-emerald-500" />
// // //               </div>
// // //             )}
// // //             {error && (
// // //               <div className="p-1 bg-rose-100 dark:bg-rose-900/30 rounded-full animate-shake">
// // //                 <XCircle size={14} className="text-rose-500" />
// // //               </div>
// // //             )}
// // //           </div>
          
// // //           {/* Progress bar for character limit */}
// // //           {maxLength && isFocused && (
// // //             <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
// // //               <div 
// // //                 className={`h-full transition-all duration-300 ${isOverLimit ? 'bg-rose-500' : 'bg-gradient-to-r from-violet-500 to-purple-500'}`}
// // //                 style={{ width: `${Math.min(progress, 100)}%` }}
// // //               />
// // //             </div>
// // //           )}
// // //         </div>
// // //       </div>
      
// // //       {helpText && !error && (
// // //         <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2 pl-1">
// // //           <div className="p-1 bg-blue-100 dark:bg-blue-900/30 rounded">
// // //             <Info size={10} className="text-blue-500" />
// // //           </div>
// // //           {helpText}
// // //         </p>
// // //       )}
// // //       {error && (
// // //         <p className="text-xs text-rose-500 flex items-center gap-2 pl-1 animate-slideIn">
// // //           <div className="p-1 bg-rose-100 dark:bg-rose-900/30 rounded">
// // //             <AlertCircle size={10} />
// // //           </div>
// // //           {error}
// // //         </p>
// // //       )}
      
// // //       <style>{`
// // //         @keyframes shake {
// // //           0%, 100% { transform: translateX(0); }
// // //           25% { transform: translateX(-2px); }
// // //           75% { transform: translateX(2px); }
// // //         }
// // //         .animate-shake { animation: shake 0.3s ease-in-out; }
// // //         @keyframes slideIn {
// // //           from { opacity: 0; transform: translateY(-5px); }
// // //           to { opacity: 1; transform: translateY(0); }
// // //         }
// // //         .animate-slideIn { animation: slideIn 0.2s ease-out; }
// // //       `}</style>
// // //     </div>
// // //   );
// // // };

// // // // --- ENHANCED TEXTAREA ---
// // // const TextareaField: React.FC<{
// // //   label: string;
// // //   icon?: React.ReactNode;
// // //   value: string;
// // //   onChange: (value: string) => void;
// // //   placeholder?: string;
// // //   rows?: number;
// // //   required?: boolean;
// // //   maxLength?: number;
// // //   helpText?: string;
// // // }> = ({ label, icon, value, onChange, placeholder, rows = 4, required, maxLength, helpText }) => {
// // //   const [isFocused, setIsFocused] = useState(false);
// // //   const charCount = value.length;
// // //   const isOverLimit = maxLength && charCount > maxLength;
// // //   const progress = maxLength ? (charCount / maxLength) * 100 : 0;

// // //   return (
// // //     <div className="space-y-3">
// // //       <label className="flex items-center justify-between">
// // //         <span className="flex items-center gap-2.5 text-sm font-semibold text-slate-700 dark:text-slate-300">
// // //           <span className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800">
// // //             {icon}
// // //           </span>
// // //           {label}
// // //           {required && <span className="text-rose-500 animate-pulse">*</span>}
// // //         </span>
// // //         {maxLength && (
// // //           <div className="flex items-center gap-3">
// // //             <div className="w-24 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
// // //               <div 
// // //                 className={`h-full transition-all duration-300 ${isOverLimit ? 'bg-rose-500' : 'bg-gradient-to-r from-violet-500 to-purple-500'}`}
// // //                 style={{ width: `${Math.min(progress, 100)}%` }}
// // //               />
// // //             </div>
// // //             <span className={`text-xs font-medium ${isOverLimit ? 'text-rose-500' : 'text-slate-400'}`}>
// // //               {charCount}/{maxLength}
// // //             </span>
// // //           </div>
// // //         )}
// // //       </label>
      
// // //       <div className="relative group">
// // //         <div className={`absolute -inset-1 bg-gradient-to-r from-violet-500 to-purple-500 rounded-2xl blur opacity-0 transition-opacity duration-300 ${isFocused ? 'opacity-20' : 'group-hover:opacity-10'}`} />
        
// // //         <textarea
// // //           value={value}
// // //           onChange={(e) => onChange(e.target.value)}
// // //           onFocus={() => setIsFocused(true)}
// // //           onBlur={() => setIsFocused(false)}
// // //           placeholder={placeholder}
// // //           rows={rows}
// // //           className={`relative w-full px-5 py-4 bg-slate-50/80 dark:bg-slate-800/80 backdrop-blur-sm border-2 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 transition-all duration-300 resize-none ${
// // //             isFocused
// // //               ? 'border-violet-500'
// // //               : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
// // //           } focus:outline-none`}
// // //         />
// // //       </div>
      
// // //       {helpText && (
// // //         <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2 pl-1">
// // //           <div className="p-1 bg-amber-100 dark:bg-amber-900/30 rounded">
// // //             <Lightbulb size={10} className="text-amber-500" />
// // //           </div>
// // //           {helpText}
// // //         </p>
// // //       )}
// // //     </div>
// // //   );
// // // };

// // // // --- ENHANCED SELECT ---
// // // const SelectField: React.FC<{
// // //   label: string;
// // //   icon?: React.ReactNode;
// // //   value: string;
// // //   onChange: (value: string) => void;
// // //   options: { value: string; label: string; color?: string }[];
// // //   required?: boolean;
// // // }> = ({ label, icon, value, onChange, options, required }) => {
// // //   const [isFocused, setIsFocused] = useState(false);
// // //   const [isOpen, setIsOpen] = useState(false);
// // //   const selectedOption = options.find(opt => opt.value === value);

// // //   return (
// // //     <div className="space-y-3">
// // //       <label className="flex items-center gap-2.5 text-sm font-semibold text-slate-700 dark:text-slate-300">
// // //         <span className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800">
// // //           {icon}
// // //         </span>
// // //         {label}
// // //         {required && <span className="text-rose-500 animate-pulse">*</span>}
// // //       </label>
      
// // //       <div className="relative group">
// // //         <div className={`absolute -inset-1 bg-gradient-to-r from-violet-500 to-purple-500 rounded-2xl blur opacity-0 transition-opacity duration-300 ${isFocused ? 'opacity-20' : 'group-hover:opacity-10'}`} />
        
// // //         <div className="relative">
// // //           <select
// // //             value={value}
// // //             onChange={(e) => onChange(e.target.value)}
// // //             onFocus={() => { setIsFocused(true); setIsOpen(true); }}
// // //             onBlur={() => { setIsFocused(false); setIsOpen(false); }}
// // //             className={`w-full px-5 py-4 bg-slate-50/80 dark:bg-slate-800/80 backdrop-blur-sm border-2 rounded-xl text-slate-900 dark:text-white transition-all duration-300 cursor-pointer appearance-none ${
// // //               isFocused
// // //                 ? 'border-violet-500'
// // //                 : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
// // //             } focus:outline-none`}
// // //           >
// // //             {options.map(opt => (
// // //               <option key={opt.value} value={opt.value}>{opt.label}</option>
// // //             ))}
// // //           </select>
          
// // //           <div className={`absolute right-4 top-1/2 -translate-y-1/2 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
// // //             <ChevronDown size={18} className="text-slate-400" />
// // //           </div>
// // //         </div>
// // //       </div>
// // //     </div>
// // //   );
// // // };

// // // // --- ENHANCED TAG INPUT ---
// // // const TagInput: React.FC<{
// // //   tags: string[];
// // //   onChange: (tags: string) => void;
// // // }> = ({ tags, onChange }) => {
// // //   const [input, setInput] = useState('');
// // //   const [isFocused, setIsFocused] = useState(false);
// // //   const inputRef = useRef<HTMLInputElement>(null);

// // //   const addTag = () => {
// // //     if (input.trim() && !tags.includes(input.trim())) {
// // //       const newTags = [...tags, input.trim()];
// // //       onChange(newTags.join(', '));
// // //       setInput('');
// // //     }
// // //   };

// // //   const removeTag = (tagToRemove: string) => {
// // //     const newTags = tags.filter(tag => tag !== tagToRemove);
// // //     onChange(newTags.join(', '));
// // //   };

// // //   const handleKeyDown = (e: React.KeyboardEvent) => {
// // //     if (e.key === 'Enter' || e.key === ',') {
// // //       e.preventDefault();
// // //       addTag();
// // //     }
// // //     if (e.key === 'Backspace' && !input && tags.length > 0) {
// // //       removeTag(tags[tags.length - 1]);
// // //     }
// // //   };

// // //   const tagColors = [
// // //     'from-violet-500 to-purple-500',
// // //     'from-blue-500 to-cyan-500',
// // //     'from-emerald-500 to-teal-500',
// // //     'from-amber-500 to-orange-500',
// // //     'from-rose-500 to-pink-500',
// // //     'from-indigo-500 to-violet-500',
// // //   ];

// // //   return (
// // //     <div className="space-y-3">
// // //       <label className="flex items-center gap-2.5 text-sm font-semibold text-slate-700 dark:text-slate-300">
// // //         <span className="p-1.5 rounded-lg bg-gradient-to-r from-violet-500/20 to-purple-500/20">
// // //           <Tag size={16} className="text-violet-500" />
// // //         </span>
// // //         Tags
// // //         <span className="ml-2 px-2.5 py-0.5 text-xs font-medium bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400 rounded-full">
// // //           {tags.filter(t => t.trim()).length} tags
// // //         </span>
// // //       </label>
      
// // //       <div className="relative group">
// // //         <div className={`absolute -inset-1 bg-gradient-to-r from-violet-500 to-purple-500 rounded-2xl blur opacity-0 transition-opacity duration-300 ${isFocused ? 'opacity-20' : 'group-hover:opacity-10'}`} />
        
// // //         <div 
// // //           className={`relative min-h-[140px] p-5 bg-slate-50/80 dark:bg-slate-800/80 backdrop-blur-sm border-2 rounded-xl transition-all duration-300 cursor-text ${
// // //             isFocused
// // //               ? 'border-violet-500'
// // //               : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
// // //           }`}
// // //           onClick={() => inputRef.current?.focus()}
// // //         >
// // //           {/* Tags display */}
// // //           <div className="flex flex-wrap gap-2.5 mb-4">
// // //             {tags.filter(t => t.trim()).map((tag, idx) => (
// // //               <span
// // //                 key={idx}
// // //                 className="group/tag relative flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white shadow-lg transform hover:scale-105 transition-all duration-200"
// // //                 style={{
// // //                   background: `linear-gradient(135deg, var(--tw-gradient-stops))`,
// // //                 }}
// // //               >
// // //                 <div className={`absolute inset-0 bg-gradient-to-r ${tagColors[idx % tagColors.length]} rounded-xl`} />
// // //                 <span className="relative flex items-center gap-2">
// // //                   <Hash size={12} className="opacity-70" />
// // //                   {tag}
// // //                   <button
// // //                     onClick={(e) => { e.stopPropagation(); removeTag(tag); }}
// // //                     className="p-0.5 hover:bg-white/20 rounded-full transition-colors"
// // //                   >
// // //                     <X size={12} />
// // //                   </button>
// // //                 </span>
// // //               </span>
// // //             ))}
// // //           </div>
          
// // //           {/* Input */}
// // //           <div className="flex items-center gap-3 border-t border-slate-200 dark:border-slate-700 pt-4">
// // //             <Plus size={16} className="text-slate-400" />
// // //             <input
// // //               ref={inputRef}
// // //               type="text"
// // //               value={input}
// // //               onChange={(e) => setInput(e.target.value)}
// // //               onKeyDown={handleKeyDown}
// // //               onFocus={() => setIsFocused(true)}
// // //               onBlur={() => setIsFocused(false)}
// // //               placeholder={tags.length === 0 ? "Type a tag and press Enter..." : "Add another tag..."}
// // //               className="flex-1 bg-transparent text-slate-900 dark:text-white placeholder-slate-400 outline-none text-sm"
// // //             />
// // //             {input.trim() && (
// // //               <button
// // //                 onClick={addTag}
// // //                 className="px-4 py-2 bg-gradient-to-r from-violet-500 to-purple-500 text-white text-sm font-medium rounded-lg hover:opacity-90 transition-all duration-200 flex items-center gap-2 shadow-lg shadow-violet-500/25"
// // //               >
// // //                 <Plus size={14} />
// // //                 Add
// // //               </button>
// // //             )}
// // //           </div>
// // //         </div>
// // //       </div>
      
// // //       <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2 pl-1">
// // //         <div className="p-1 bg-blue-100 dark:bg-blue-900/30 rounded">
// // //           <Info size={10} className="text-blue-500" />
// // //         </div>
// // //         Press Enter or comma to add a tag. Click × to remove.
// // //       </p>
// // //     </div>
// // //   );
// // // };

// // // // --- STAT INPUT CARD (ENHANCED) ---
// // // const StatInputCard: React.FC<{
// // //   icon: React.ReactNode;
// // //   label: string;
// // //   value: number | string;
// // //   onChange: (value: number | string) => void;
// // //   type?: 'number' | 'text';
// // //   min?: number;
// // //   max?: number;
// // //   step?: number;
// // //   unit?: string;
// // //   gradient: string;
// // // }> = ({ icon, label, value, onChange, type = 'number', min, max, step, unit, gradient }) => {
// // //   const [isFocused, setIsFocused] = useState(false);
// // //   const [isHovered, setIsHovered] = useState(false);

// // //   return (
// // //     <div 
// // //       className="relative overflow-hidden bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-2xl border-2 border-slate-200 dark:border-slate-700 p-6 group hover:border-transparent transition-all duration-500"
// // //       onMouseEnter={() => setIsHovered(true)}
// // //       onMouseLeave={() => setIsHovered(false)}
// // //     >
// // //       {/* Animated gradient border on hover */}
// // //       <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 ${isHovered ? 'opacity-100' : ''} transition-opacity duration-500`} style={{ padding: '2px' }}>
// // //         <div className="absolute inset-0.5 bg-white dark:bg-slate-900 rounded-2xl" />
// // //       </div>
      
// // //       {/* Decorative orb */}
// // //       <div className={`absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-br ${gradient} opacity-20 rounded-full blur-2xl group-hover:scale-150 group-hover:opacity-30 transition-all duration-700`} />
      
// // //       <div className="relative">
// // //         {/* Icon */}
// // //         <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${gradient} mb-4 shadow-lg transform group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300`}>
// // //           {icon}
// // //         </div>
        
// // //         {/* Label */}
// // //         <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">
// // //           {label}
// // //         </p>
        
// // //         {/* Input */}
// // //         <div className="flex items-end gap-2">
// // //           <input
// // //             type={type}
// // //             value={value}
// // //             onChange={(e) => onChange(type === 'number' ? parseFloat(e.target.value) || 0 : e.target.value)}
// // //             onFocus={() => setIsFocused(true)}
// // //             onBlur={() => setIsFocused(false)}
// // //             min={min}
// // //             max={max}
// // //             step={step}
// // //             className={`w-full bg-transparent text-3xl font-bold bg-gradient-to-r ${gradient} bg-clip-text text-transparent focus:outline-none`}
// // //           />
// // //           {unit && (
// // //             <span className="text-lg font-medium text-slate-400 mb-1">{unit}</span>
// // //           )}
// // //         </div>
// // //       </div>
// // //     </div>
// // //   );
// // // };

// // // // --- IMAGE UPLOAD (ENHANCED) ---
// // // const ImageUpload: React.FC<{
// // //   imageUrl?: string;
// // //   onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
// // //   onRemove: () => void;
// // // }> = ({ imageUrl, onUpload, onRemove }) => {
// // //   const [isDragging, setIsDragging] = useState(false);
// // //   const [isHovered, setIsHovered] = useState(false);

// // //   const handleDragOver = (e: React.DragEvent) => {
// // //     e.preventDefault();
// // //     setIsDragging(true);
// // //   };

// // //   const handleDragLeave = () => {
// // //     setIsDragging(false);
// // //   };

// // //   const handleDrop = (e: React.DragEvent) => {
// // //     e.preventDefault();
// // //     setIsDragging(false);
// // //     const files = e.dataTransfer.files;
// // //     if (files.length > 0) {
// // //       const fakeEvent = { target: { files } } as React.ChangeEvent<HTMLInputElement>;
// // //       onUpload(fakeEvent);
// // //     }
// // //   };

// // //   return (
// // //     <div className="space-y-4">
// // //       <label className="flex items-center gap-2.5 text-sm font-semibold text-slate-700 dark:text-slate-300">
// // //         <span className="p-1.5 rounded-lg bg-gradient-to-r from-rose-500/20 to-pink-500/20">
// // //           <Camera size={16} className="text-rose-500" />
// // //         </span>
// // //         Course Thumbnail
// // //         <span className="text-xs font-normal text-slate-400 ml-2">(Recommended: 1280×720)</span>
// // //       </label>

// // //       <div className="flex flex-col lg:flex-row gap-6">
// // //         {/* Upload/Preview Area */}
// // //         {imageUrl ? (
// // //           <div 
// // //             className="relative group w-full lg:w-96 h-56 rounded-2xl overflow-hidden shadow-2xl shadow-slate-900/20"
// // //             onMouseEnter={() => setIsHovered(true)}
// // //             onMouseLeave={() => setIsHovered(false)}
// // //           >
// // //             <img
// // //               src={imageUrl}
// // //               alt="Course preview"
// // //               className={`w-full h-full object-cover transition-transform duration-700 ${isHovered ? 'scale-110' : 'scale-100'}`}
// // //             />
            
// // //             {/* Overlay */}
// // //             <div className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`} />
            
// // //             {/* Actions */}
// // //             <div className={`absolute inset-0 flex flex-col items-center justify-center gap-4 transition-all duration-300 ${isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
// // //               <label className="px-6 py-3 bg-white/90 backdrop-blur-sm text-slate-900 font-semibold rounded-xl cursor-pointer hover:bg-white transition-colors flex items-center gap-2 shadow-xl">
// // //                 <Camera size={18} />
// // //                 Replace Image
// // //                 <input
// // //                   type="file"
// // //                   accept="image/*"
// // //                   onChange={onUpload}
// // //                   className="hidden"
// // //                 />
// // //               </label>
              
// // //               <button
// // //                 onClick={onRemove}
// // //                 className="px-6 py-3 bg-rose-500/90 backdrop-blur-sm text-white font-semibold rounded-xl hover:bg-rose-600 transition-colors flex items-center gap-2 shadow-xl"
// // //               >
// // //                 <Trash2 size={18} />
// // //                 Remove
// // //               </button>
// // //             </div>
            
// // //             {/* Badge */}
// // //             <div className={`absolute top-4 left-4 px-3 py-1.5 bg-emerald-500/90 backdrop-blur-sm text-white text-xs font-bold rounded-lg flex items-center gap-1.5 shadow-lg transition-all duration-300 ${isHovered ? 'opacity-0 -translate-y-2' : 'opacity-100'}`}>
// // //               <CheckCircle size={12} />
// // //               Uploaded
// // //             </div>
// // //           </div>
// // //         ) : (
// // //           <label
// // //             onDragOver={handleDragOver}
// // //             onDragLeave={handleDragLeave}
// // //             onDrop={handleDrop}
// // //             className={`relative w-full lg:w-96 h-56 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all duration-500 overflow-hidden ${
// // //               isDragging
// // //                 ? 'border-violet-500 bg-violet-50 dark:bg-violet-900/20 scale-[1.02]'
// // //                 : 'border-slate-300 dark:border-slate-700 hover:border-violet-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'
// // //             }`}
// // //           >
// // //             {/* Animated background */}
// // //             <div className={`absolute inset-0 bg-gradient-to-br from-violet-500/5 to-purple-500/5 transition-opacity duration-500 ${isDragging ? 'opacity-100' : 'opacity-0'}`} />
            
// // //             <FloatingParticles />
            
// // //             <div className={`relative z-10 p-5 rounded-2xl mb-4 transition-all duration-300 ${isDragging ? 'bg-violet-100 dark:bg-violet-900/30 scale-110' : 'bg-slate-100 dark:bg-slate-800'}`}>
// // //               <Upload size={32} className={`transition-colors duration-300 ${isDragging ? 'text-violet-500' : 'text-slate-400'}`} />
// // //             </div>
            
// // //             <p className={`relative z-10 text-base font-semibold mb-1 transition-colors duration-300 ${isDragging ? 'text-violet-600 dark:text-violet-400' : 'text-slate-600 dark:text-slate-400'}`}>
// // //               {isDragging ? 'Drop your image here!' : 'Click or drag to upload'}
// // //             </p>
// // //             <p className="relative z-10 text-sm text-slate-400">PNG, JPG, GIF up to 5MB</p>
            
// // //             <input
// // //               type="file"
// // //               accept="image/*"
// // //               onChange={onUpload}
// // //               className="hidden"
// // //             />
// // //           </label>
// // //         )}

// // //         {/* Tips Card */}
// // //         <div className="flex-1 relative overflow-hidden p-6 bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-900/20 dark:to-purple-900/20 border border-violet-200 dark:border-violet-800/50 rounded-2xl">
// // //           <AnimatedGradient className="opacity-30" />
          
// // //           <div className="relative">
// // //             <div className="flex items-center gap-3 mb-4">
// // //               <div className="p-2.5 bg-gradient-to-br from-violet-500 to-purple-500 rounded-xl shadow-lg shadow-violet-500/25">
// // //                 <Wand2 size={18} className="text-white" />
// // //               </div>
// // //               <h4 className="text-base font-bold text-violet-900 dark:text-violet-100">
// // //                 Pro Tips for Great Thumbnails
// // //               </h4>
// // //             </div>
            
// // //             <ul className="space-y-3">
// // //               {[
// // //                 'Use high-quality images (1280×720 or higher)',
// // //                 'Keep important content centered',
// // //                 'Use vibrant, eye-catching colors',
// // //                 'Avoid cluttered or text-heavy designs'
// // //               ].map((tip, idx) => (
// // //                 <li key={idx} className="flex items-start gap-3 text-sm text-violet-700 dark:text-violet-300">
// // //                   <div className="mt-0.5 p-1 bg-violet-200 dark:bg-violet-800 rounded-full shrink-0">
// // //                     <Check size={10} className="text-violet-600 dark:text-violet-400" />
// // //                   </div>
// // //                   {tip}
// // //                 </li>
// // //               ))}
// // //             </ul>
// // //           </div>
// // //         </div>
// // //       </div>
// // //     </div>
// // //   );
// // // };

// // // // --- PUBLISH TOGGLE (ENHANCED) ---
// // // const PublishToggle: React.FC<{
// // //   isPublished: boolean;
// // //   onChange: (value: boolean) => void;
// // // }> = ({ isPublished, onChange }) => {
// // //   return (
// // //     <div className={`relative overflow-hidden p-6 rounded-2xl border-2 transition-all duration-500 ${
// // //       isPublished 
// // //         ? 'bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 border-emerald-300 dark:border-emerald-700' 
// // //         : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700'
// // //     }`}>
// // //       {/* Animated orbs */}
// // //       {isPublished && (
// // //         <>
// // //           <div className="absolute -top-12 -right-12 w-32 h-32 bg-emerald-400/30 rounded-full blur-3xl animate-pulse" />
// // //           <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-teal-400/30 rounded-full blur-3xl animate-pulse delay-500" />
// // //         </>
// // //       )}
      
// // //       <label className="relative flex items-center justify-between cursor-pointer">
// // //         <div className="flex items-center gap-5">
// // //           <div className={`p-4 rounded-2xl transition-all duration-500 transform ${isPublished ? 'bg-gradient-to-br from-emerald-500 to-teal-500 scale-110 rotate-3' : 'bg-slate-300 dark:bg-slate-600'} shadow-lg`}>
// // //             {isPublished ? <Eye size={24} className="text-white" /> : <EyeOff size={24} className="text-white" />}
// // //           </div>
          
// // //           <div>
// // //             <div className="flex items-center gap-3">
// // //               <h4 className="text-lg font-bold text-slate-900 dark:text-white">
// // //                 {isPublished ? 'Course is Published' : 'Course is Draft'}
// // //               </h4>
// // //               {isPublished && (
// // //                 <span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold rounded-full animate-pulse">
// // //                   LIVE
// // //                 </span>
// // //               )}
// // //             </div>
// // //             <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
// // //               {isPublished 
// // //                 ? 'Students can now discover and enroll in your course' 
// // //                 : 'This course is hidden from students'}
// // //             </p>
// // //           </div>
// // //         </div>
        
// // //         {/* Custom toggle */}
// // //         <div className="relative">
// // //           <input
// // //             type="checkbox"
// // //             checked={isPublished}
// // //             onChange={(e) => onChange(e.target.checked)}
// // //             className="sr-only peer"
// // //           />
// // //           <div className="w-16 h-9 bg-slate-200 dark:bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-7 after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:rounded-full after:h-7 after:w-7 after:transition-all after:duration-300 after:shadow-lg peer-checked:bg-gradient-to-r peer-checked:from-emerald-500 peer-checked:to-teal-500"></div>
// // //         </div>
// // //       </label>
// // //     </div>
// // //   );
// // // };

// // // // --- MAIN COMPONENT ---
// // // export const BasicInfoSection: React.FC<BasicInfoSectionProps> = ({
// // //   course,
// // //   updateBasicInfo,
// // //   updateStats,
// // //   updateTags,
// // //   handlePhotoUpload,
// // //   removePhoto
// // // }) => {
// // //   const titleError = !course.title.trim() ? 'Course title is required' : undefined;
// // //   const instructorError = !course.instructor_name?.trim() ? 'Instructor name is required' : undefined;

// // //   const levelOptions = [
// // //     { value: 'Beginner', label: '🌱 Beginner', color: 'emerald' },
// // //     { value: 'Intermediate', label: '🌿 Intermediate', color: 'blue' },
// // //     { value: 'Advanced', label: '🌳 Advanced', color: 'purple' }
// // //   ];

// // //   return (
// // //     <div className="space-y-8">
      
// // //       {/* Course Details Section */}
// // //       <SectionCard
// // //         title="Course Details"
// // //         subtitle="Essential information about your course"
// // //         icon={<BookOpen size={22} className="text-white" />}
// // //         iconBg="bg-gradient-to-br from-violet-500 to-purple-600"
// // //         glowColor="violet"
// // //       >
// // //         <div className="space-y-8">
// // //           {/* Thumbnail */}
// // //           <ImageUpload
// // //             imageUrl={course.photoUrl}
// // //             onUpload={handlePhotoUpload}
// // //             onRemove={removePhoto}
// // //           />

// // //           <div className="border-t border-slate-200 dark:border-slate-700 pt-8">
// // //             {/* Title */}
// // //             <InputField
// // //               label="Course Title"
// // //               icon={<BookOpen size={14} className="text-violet-500" />}
// // //               value={course.title}
// // //               onChange={(v) => updateBasicInfo('title', v)}
// // //               placeholder="e.g., Complete React Development Masterclass"
// // //               required
// // //               maxLength={100}
// // //               error={titleError}
// // //               helpText="Choose a clear, descriptive title that highlights the value"
// // //             />
// // //           </div>

// // //           {/* Grid Fields */}
// // //           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
// // //             <InputField
// // //               label="Instructor"
// // //               icon={<User size={14} className="text-blue-500" />}
// // //               value={course.instructor_name}
// // //               onChange={(v) => updateBasicInfo('instructor_name', v)}
// // //               placeholder="e.g., John Doe"
// // //               required
// // //               error={instructorError}
// // //             />

// // //             <InputField
// // //               label="Department"
// // //               icon={<Building2 size={14} className="text-teal-500" />}
// // //               value={course.department || ''}
// // //               onChange={(v) => updateBasicInfo('department', v)}
// // //               placeholder="e.g., IT, Sales, HR"
// // //               helpText="Categorize by department"
// // //             />

// // //             <SelectField
// // //               label="Difficulty Level"
// // //               icon={<GraduationCap size={14} className="text-amber-500" />}
// // //               value={course.level}
// // //               onChange={(v) => updateBasicInfo('level', v)}
// // //               options={levelOptions}
// // //               required
// // //             />

// // //             <InputField
// // //               label="Duration"
// // //               icon={<Clock size={14} className="text-rose-500" />}
// // //               value={course.duration}
// // //               onChange={(v) => updateBasicInfo('duration', v)}
// // //               placeholder="e.g., 10 hours"
// // //               helpText="Estimated time to complete"
// // //             />
// // //           </div>

// // //           {/* Description */}
// // //           <TextareaField
// // //             label="Short Description"
// // //             icon={<Info size={14} className="text-sky-500" />}
// // //             value={course.description}
// // //             onChange={(v) => updateBasicInfo('description', v)}
// // //             placeholder="Brief overview of what students will learn..."
// // //             rows={3}
// // //             maxLength={300}
// // //             helpText="This appears in course cards and search results"
// // //           />

// // //           {/* Introduction */}
// // //           <TextareaField
// // //             label="Full Introduction"
// // //             icon={<Sparkles size={14} className="text-amber-500" />}
// // //             value={course.introduction}
// // //             onChange={(v) => updateBasicInfo('introduction', v)}
// // //             placeholder="Detailed introduction including learning objectives, prerequisites, and what makes this course unique..."
// // //             rows={5}
// // //             helpText="Shown on the course landing page. Be compelling!"
// // //           />

// // //           {/* Tags */}
// // //           <TagInput
// // //             tags={course.tags || []}
// // //             onChange={updateTags}
// // //           />
// // //         </div>
// // //       </SectionCard>

// // //       {/* Statistics Section */}
// // //       <SectionCard
// // //         title="Course Statistics"
// // //         subtitle="Track and display course metrics"
// // //         icon={<BarChart3 size={22} className="text-white" />}
// // //         iconBg="bg-gradient-to-br from-blue-500 to-cyan-600"
// // //         collapsible
// // //         defaultOpen={false}
// // //         badge="Optional"
// // //         glowColor="blue"
// // //       >
// // //         <div className="grid grid-cols-2 lg:grid-cols-5 gap-5">
// // //           <StatInputCard
// // //             icon={<Star size={20} className="text-white" />}
// // //             label="Rating"
// // //             value={course.stats.rating}
// // //             onChange={(v) => updateStats('rating', v as number)}
// // //             type="number"
// // //             min={0}
// // //             max={5}
// // //             step={0.1}
// // //             gradient="from-amber-400 to-orange-500"
// // //           />

// // //           <StatInputCard
// // //             icon={<Users size={20} className="text-white" />}
// // //             label="Enrolled"
// // //             value={course.stats.enrolled}
// // //             onChange={(v) => updateStats('enrolled', v as number)}
// // //             type="number"
// // //             min={0}
// // //             gradient="from-blue-500 to-cyan-500"
// // //           />

// // //           <StatInputCard
// // //             icon={<Target size={20} className="text-white" />}
// // //             label="Accuracy"
// // //             value={course.stats.accuracy}
// // //             onChange={(v) => updateStats('accuracy', v as number)}
// // //             type="number"
// // //             min={0}
// // //             max={100}
// // //             unit="%"
// // //             gradient="from-emerald-500 to-teal-500"
// // //           />

// // //           <StatInputCard
// // //             icon={<TrendingUp size={20} className="text-white" />}
// // //             label="Completion"
// // //             value={course.stats.completion}
// // //             onChange={(v) => updateStats('completion', v as number)}
// // //             type="number"
// // //             min={0}
// // //             max={100}
// // //             unit="%"
// // //             gradient="from-violet-500 to-purple-500"
// // //           />

// // //           <StatInputCard
// // //             icon={<Timer size={20} className="text-white" />}
// // //             label="Duration"
// // //             value={course.stats.duration}
// // //             onChange={(v) => updateStats('duration', v as string)}
// // //             type="text"
// // //             gradient="from-rose-500 to-pink-500"
// // //           />
// // //         </div>
        
// // //         <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/50 rounded-xl flex items-center gap-3">
// // //           <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
// // //             <Info size={16} className="text-blue-500" />
// // //           </div>
// // //           <p className="text-sm text-blue-700 dark:text-blue-300">
// // //             These statistics are displayed on the course page to help students make informed decisions.
// // //           </p>
// // //         </div>
// // //       </SectionCard>

// // //       {/* Publish Settings */}
// // //       <SectionCard
// // //         title="Publication Settings"
// // //         subtitle="Control course visibility"
// // //         icon={<Zap size={22} className="text-white" />}
// // //         iconBg="bg-gradient-to-br from-emerald-500 to-teal-600"
// // //         glowColor="emerald"
// // //       >
// // //         <PublishToggle
// // //           isPublished={course.is_published || false}
// // //           onChange={(v) => updateBasicInfo('is_published', v)}
// // //         />
        
// // //         <div className="mt-6 relative overflow-hidden p-5 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border border-amber-200 dark:border-amber-800/50 rounded-2xl">
// // //           <div className="absolute -right-8 -top-8 w-24 h-24 bg-amber-400/20 rounded-full blur-2xl" />
          
// // //           <div className="relative flex items-start gap-4">
// // //             <div className="p-3 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl shadow-lg shadow-amber-500/25 shrink-0">
// // //               <Shield size={20} className="text-white" />
// // //             </div>
// // //             <div>
// // //               <h4 className="text-base font-bold text-amber-900 dark:text-amber-200">Before Publishing</h4>
// // //               <p className="text-sm text-amber-700 dark:text-amber-300 mt-1 leading-relaxed">
// // //                 Make sure you've added all lessons and tests. Once published, students can enroll and access your course content immediately.
// // //               </p>
// // //             </div>
// // //           </div>
// // //         </div>
// // //       </SectionCard>
// // //     </div>
// // //   );
// // // };

// // // export default BasicInfoSection;

// // import React, { useState, useRef } from 'react';
// // import { 
// //   Upload, Info, Star, Users, TrendingUp, Clock, Building2,
// //   Check, AlertCircle, ChevronDown, Sparkles, Trash2,
// //   Eye, EyeOff, GraduationCap, Tag, Plus, BookOpen, User, Timer, Hash, Lightbulb, CheckCircle, XCircle, Camera,
// //   Wand2, Shield, Zap, BarChart3, Target,
// //   X
// // } from 'lucide-react';
// // import type { Course } from '../Utils/types';

// // interface BasicInfoSectionProps {
// //   course: Course;
// //   updateBasicInfo: (field: string, value: string | number | boolean) => void;
// //   updateStats: (field: keyof Course['stats'], value: number | string) => void;
// //   updateTags: (tags: string) => void;
// //   handlePhotoUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
// //   removePhoto: () => void;
// // }

// // // ... [Keep AnimatedGradient, FloatingParticles, SectionCard components exactly as they were] ...
// // // (I am omitting them here to save space, assuming you have them from previous code)

// // // --- ANIMATED GRADIENT BACKGROUND ---
// // const AnimatedGradient: React.FC<{ className?: string }> = ({ className }) => (
// //   <div className={`absolute inset-0 overflow-hidden ${className}`}>
// //     <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-violet-500/20 via-transparent to-transparent rounded-full blur-3xl animate-pulse" />
// //     <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-blue-500/20 via-transparent to-transparent rounded-full blur-3xl animate-pulse delay-1000" />
// //   </div>
// // );

// // // --- FLOATING PARTICLES ---
// // const FloatingParticles: React.FC = () => (
// //   <div className="absolute inset-0 overflow-hidden pointer-events-none">
// //     {[...Array(6)].map((_, i) => (
// //       <div
// //         key={i}
// //         className="absolute w-2 h-2 bg-gradient-to-r from-violet-400 to-purple-400 rounded-full opacity-30"
// //         style={{
// //           top: `${Math.random() * 100}%`,
// //           left: `${Math.random() * 100}%`,
// //           animation: `float ${3 + Math.random() * 4}s ease-in-out infinite`,
// //           animationDelay: `${Math.random() * 2}s`
// //         }}
// //       />
// //     ))}
// //     <style>{`
// //       @keyframes float {
// //         0%, 100% { transform: translateY(0px) scale(1); opacity: 0.3; }
// //         50% { transform: translateY(-20px) scale(1.2); opacity: 0.6; }
// //       }
// //     `}</style>
// //   </div>
// // );

// // // --- SECTION CARD COMPONENT ---
// // const SectionCard: React.FC<{
// //   title: string;
// //   subtitle?: string;
// //   icon: React.ReactNode;
// //   iconBg: string;
// //   children: React.ReactNode;
// //   collapsible?: boolean;
// //   defaultOpen?: boolean;
// //   badge?: string;
// //   glowColor?: string;
// // }> = ({ title, subtitle, icon, iconBg, children, collapsible = false, defaultOpen = true, badge, glowColor = 'violet' }) => {
// //   const [isOpen, setIsOpen] = useState(defaultOpen);
// //   const [isHovered, setIsHovered] = useState(false);

// //   const glowStyles: Record<string, string> = {
// //     violet: 'hover:shadow-violet-500/10',
// //     blue: 'hover:shadow-blue-500/10',
// //     emerald: 'hover:shadow-emerald-500/10',
// //   };

// //   return (
// //     <div 
// //       className={`group relative bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-3xl border border-slate-200/60 dark:border-slate-700/60 overflow-hidden shadow-xl shadow-slate-200/50 dark:shadow-slate-900/50 hover:shadow-2xl ${glowStyles[glowColor]} transition-all duration-500`}
// //       onMouseEnter={() => setIsHovered(true)}
// //       onMouseLeave={() => setIsHovered(false)}
// //     >
// //       <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-violet-500/0 via-violet-500/10 to-purple-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
      
// //       <div 
// //         className={`relative px-8 py-6 flex items-center justify-between ${collapsible ? 'cursor-pointer' : ''}`}
// //         onClick={() => collapsible && setIsOpen(!isOpen)}
// //       >
// //         <div className="absolute bottom-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-slate-200 dark:via-slate-700 to-transparent" />
        
// //         <div className="flex items-center gap-5">
// //           <div className="relative">
// //             <div className={`absolute inset-0 ${iconBg} blur-xl opacity-40 group-hover:opacity-60 transition-opacity duration-500`} />
// //             <div className={`relative p-4 rounded-2xl ${iconBg} shadow-lg transform group-hover:scale-105 transition-transform duration-300`}>
// //               {icon}
// //             </div>
// //           </div>
          
// //           <div>
// //             <div className="flex items-center gap-3">
// //               <h3 className="text-xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
// //                 {title}
// //               </h3>
// //               {badge && (
// //                 <span className="px-3 py-1 text-[10px] font-bold bg-gradient-to-r from-violet-500/10 to-purple-500/10 dark:from-violet-500/20 dark:to-purple-500/20 text-violet-600 dark:text-violet-400 rounded-full border border-violet-200 dark:border-violet-800">
// //                   {badge}
// //                 </span>
// //               )}
// //             </div>
// //             {subtitle && (
// //               <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{subtitle}</p>
// //             )}
// //           </div>
// //         </div>
        
// //         {collapsible && (
// //           <button className="p-3 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all duration-300 group/btn">
// //             <div className={`transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
// //               <ChevronDown size={20} className="text-slate-400 group-hover/btn:text-violet-500" />
// //             </div>
// //           </button>
// //         )}
// //       </div>
      
// //       <div className={`overflow-hidden transition-all duration-500 ease-out ${(!collapsible || isOpen) ? 'max-h-[5000px] opacity-100' : 'max-h-0 opacity-0'}`}>
// //         <div className="p-8 pt-6">
// //           {children}
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // // --- ENHANCED INPUT FIELD (FIXED NESTING) ---
// // const InputField: React.FC<{
// //   label: string;
// //   icon?: React.ReactNode;
// //   value: string | number;
// //   onChange: (value: string) => void;
// //   placeholder?: string;
// //   type?: string;
// //   required?: boolean;
// //   maxLength?: number;
// //   helpText?: string;
// //   error?: string;
// //   disabled?: boolean;
// // }> = ({ label, icon, value, onChange, placeholder, type = 'text', required, maxLength, helpText, error, disabled }) => {
// //   const [isFocused, setIsFocused] = useState(false);
// //   const charCount = typeof value === 'string' ? value.length : 0;
// //   const isOverLimit = maxLength && charCount > maxLength;
// //   const progress = maxLength ? (charCount / maxLength) * 100 : 0;

// //   return (
// //     <div className="space-y-3">
// //       <label className="flex items-center justify-between">
// //         <span className="flex items-center gap-2.5 text-sm font-semibold text-slate-700 dark:text-slate-300">
// //           <span className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800">
// //             {icon}
// //           </span>
// //           {label}
// //           {required && <span className="text-rose-500 animate-pulse">*</span>}
// //         </span>
// //         {maxLength && (
// //           <span className={`text-xs font-medium px-2 py-1 rounded-full ${
// //             isOverLimit 
// //               ? 'bg-rose-100 dark:bg-rose-900/30 text-rose-500' 
// //               : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
// //           }`}>
// //             {charCount}/{maxLength}
// //           </span>
// //         )}
// //       </label>
      
// //       <div className="relative group">
// //         <div className={`absolute -inset-1 bg-gradient-to-r from-violet-500 to-purple-500 rounded-2xl blur opacity-0 transition-opacity duration-300 ${isFocused ? 'opacity-20' : 'group-hover:opacity-10'}`} />
        
// //         <div className="relative">
// //           <input
// //             type={type}
// //             value={value}
// //             onChange={(e) => onChange(e.target.value)}
// //             onFocus={() => setIsFocused(true)}
// //             onBlur={() => setIsFocused(false)}
// //             placeholder={placeholder}
// //             disabled={disabled}
// //             className={`w-full px-5 py-4 bg-slate-50/80 dark:bg-slate-800/80 backdrop-blur-sm border-2 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 transition-all duration-300 ${
// //               error 
// //                 ? 'border-rose-300 dark:border-rose-700 focus:border-rose-500' 
// //                 : isFocused
// //                   ? 'border-violet-500 dark:border-violet-500'
// //                   : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
// //             } ${disabled ? 'opacity-50 cursor-not-allowed' : ''} focus:outline-none`}
// //           />
          
// //           <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
// //             {value && !error && (
// //               <div className="p-1 bg-emerald-100 dark:bg-emerald-900/30 rounded-full">
// //                 <CheckCircle size={14} className="text-emerald-500" />
// //               </div>
// //             )}
// //             {error && (
// //               <div className="p-1 bg-rose-100 dark:bg-rose-900/30 rounded-full animate-shake">
// //                 <XCircle size={14} className="text-rose-500" />
// //               </div>
// //             )}
// //           </div>
          
// //           {maxLength && isFocused && (
// //             <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
// //               <div 
// //                 className={`h-full transition-all duration-300 ${isOverLimit ? 'bg-rose-500' : 'bg-gradient-to-r from-violet-500 to-purple-500'}`}
// //                 style={{ width: `${Math.min(progress, 100)}%` }}
// //               />
// //             </div>
// //           )}
// //         </div>
// //       </div>
      
// //       {/* FIXED: Changed <p> to <div> */}
// //       {helpText && !error && (
// //         <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2 pl-1">
// //           <div className="p-1 bg-blue-100 dark:bg-blue-900/30 rounded">
// //             <Info size={10} className="text-blue-500" />
// //           </div>
// //           {helpText}
// //         </div>
// //       )}
// //       {/* FIXED: Changed <p> to <div> */}
// //       {error && (
// //         <div className="text-xs text-rose-500 flex items-center gap-2 pl-1 animate-slideIn">
// //           <div className="p-1 bg-rose-100 dark:bg-rose-900/30 rounded">
// //             <AlertCircle size={10} />
// //           </div>
// //           {error}
// //         </div>
// //       )}
      
// //       <style>{`
// //         @keyframes shake {
// //           0%, 100% { transform: translateX(0); }
// //           25% { transform: translateX(-2px); }
// //           75% { transform: translateX(2px); }
// //         }
// //         .animate-shake { animation: shake 0.3s ease-in-out; }
// //         @keyframes slideIn {
// //           from { opacity: 0; transform: translateY(-5px); }
// //           to { opacity: 1; transform: translateY(0); }
// //         }
// //         .animate-slideIn { animation: slideIn 0.2s ease-out; }
// //       `}</style>
// //     </div>
// //   );
// // };

// // // --- ENHANCED TEXTAREA (FIXED NESTING & ADDED ERROR) ---
// // const TextareaField: React.FC<{
// //   label: string;
// //   icon?: React.ReactNode;
// //   value: string;
// //   onChange: (value: string) => void;
// //   placeholder?: string;
// //   rows?: number;
// //   required?: boolean;
// //   maxLength?: number;
// //   helpText?: string;
// //   error?: string; // Added error prop
// // }> = ({ label, icon, value, onChange, placeholder, rows = 4, required, maxLength, helpText, error }) => {
// //   const [isFocused, setIsFocused] = useState(false);
// //   const charCount = value ? value.length : 0;
// //   const isOverLimit = maxLength && charCount > maxLength;
// //   const progress = maxLength ? (charCount / maxLength) * 100 : 0;

// //   return (
// //     <div className="space-y-3">
// //       <label className="flex items-center justify-between">
// //         <span className="flex items-center gap-2.5 text-sm font-semibold text-slate-700 dark:text-slate-300">
// //           <span className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800">
// //             {icon}
// //           </span>
// //           {label}
// //           {required && <span className="text-rose-500 animate-pulse">*</span>}
// //         </span>
// //         {maxLength && (
// //           <div className="flex items-center gap-3">
// //             <div className="w-24 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
// //               <div 
// //                 className={`h-full transition-all duration-300 ${isOverLimit ? 'bg-rose-500' : 'bg-gradient-to-r from-violet-500 to-purple-500'}`}
// //                 style={{ width: `${Math.min(progress, 100)}%` }}
// //               />
// //             </div>
// //             <span className={`text-xs font-medium ${isOverLimit ? 'text-rose-500' : 'text-slate-400'}`}>
// //               {charCount}/{maxLength}
// //             </span>
// //           </div>
// //         )}
// //       </label>
      
// //       <div className="relative group">
// //         <div className={`absolute -inset-1 bg-gradient-to-r from-violet-500 to-purple-500 rounded-2xl blur opacity-0 transition-opacity duration-300 ${isFocused ? 'opacity-20' : 'group-hover:opacity-10'}`} />
        
// //         <textarea
// //           value={value}
// //           onChange={(e) => onChange(e.target.value)}
// //           onFocus={() => setIsFocused(true)}
// //           onBlur={() => setIsFocused(false)}
// //           placeholder={placeholder}
// //           rows={rows}
// //           className={`relative w-full px-5 py-4 bg-slate-50/80 dark:bg-slate-800/80 backdrop-blur-sm border-2 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 transition-all duration-300 resize-none ${
// //             error
// //               ? 'border-rose-300 dark:border-rose-700 focus:border-rose-500'
// //               : isFocused
// //                 ? 'border-violet-500'
// //                 : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
// //           } focus:outline-none`}
// //         />
        
// //         {/* Status icons for Textarea */}
// //         <div className="absolute right-4 top-4 flex items-center gap-2">
// //             {value && !error && (
// //               <div className="p-1 bg-emerald-100 dark:bg-emerald-900/30 rounded-full">
// //                 <CheckCircle size={14} className="text-emerald-500" />
// //               </div>
// //             )}
// //             {error && (
// //               <div className="p-1 bg-rose-100 dark:bg-rose-900/30 rounded-full animate-shake">
// //                 <XCircle size={14} className="text-rose-500" />
// //               </div>
// //             )}
// //         </div>
// //       </div>
      
// //       {/* FIXED: Changed <p> to <div> */}
// //       {helpText && !error && (
// //         <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2 pl-1">
// //           <div className="p-1 bg-amber-100 dark:bg-amber-900/30 rounded">
// //             <Lightbulb size={10} className="text-amber-500" />
// //           </div>
// //           {helpText}
// //         </div>
// //       )}

// //       {/* Added Error Display */}
// //       {error && (
// //         <div className="text-xs text-rose-500 flex items-center gap-2 pl-1 animate-slideIn">
// //           <div className="p-1 bg-rose-100 dark:bg-rose-900/30 rounded">
// //             <AlertCircle size={10} />
// //           </div>
// //           {error}
// //         </div>
// //       )}
// //     </div>
// //   );
// // };

// // // --- ENHANCED SELECT ---
// // const SelectField: React.FC<{
// //   label: string;
// //   icon?: React.ReactNode;
// //   value: string;
// //   onChange: (value: string) => void;
// //   options: { value: string; label: string; color?: string }[];
// //   required?: boolean;
// // }> = ({ label, icon, value, onChange, options, required }) => {
// //   const [isFocused, setIsFocused] = useState(false);
// //   const [isOpen, setIsOpen] = useState(false);

// //   return (
// //     <div className="space-y-3">
// //       <label className="flex items-center gap-2.5 text-sm font-semibold text-slate-700 dark:text-slate-300">
// //         <span className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800">
// //           {icon}
// //         </span>
// //         {label}
// //         {required && <span className="text-rose-500 animate-pulse">*</span>}
// //       </label>
      
// //       <div className="relative group">
// //         <div className={`absolute -inset-1 bg-gradient-to-r from-violet-500 to-purple-500 rounded-2xl blur opacity-0 transition-opacity duration-300 ${isFocused ? 'opacity-20' : 'group-hover:opacity-10'}`} />
        
// //         <div className="relative">
// //           <select
// //             value={value}
// //             onChange={(e) => onChange(e.target.value)}
// //             onFocus={() => { setIsFocused(true); setIsOpen(true); }}
// //             onBlur={() => { setIsFocused(false); setIsOpen(false); }}
// //             className={`w-full px-5 py-4 bg-slate-50/80 dark:bg-slate-800/80 backdrop-blur-sm border-2 rounded-xl text-slate-900 dark:text-white transition-all duration-300 cursor-pointer appearance-none ${
// //               isFocused
// //                 ? 'border-violet-500'
// //                 : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
// //             } focus:outline-none`}
// //           >
// //             {options.map(opt => (
// //               <option key={opt.value} value={opt.value}>{opt.label}</option>
// //             ))}
// //           </select>
          
// //           <div className={`absolute right-4 top-1/2 -translate-y-1/2 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
// //             <ChevronDown size={18} className="text-slate-400" />
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // // --- ENHANCED TAG INPUT (FIXED NESTING) ---
// // const TagInput: React.FC<{
// //   tags: string[];
// //   onChange: (tags: string) => void;
// // }> = ({ tags, onChange }) => {
// //   const [input, setInput] = useState('');
// //   const [isFocused, setIsFocused] = useState(false);
// //   const inputRef = useRef<HTMLInputElement>(null);

// //   const addTag = () => {
// //     if (input.trim() && !tags.includes(input.trim())) {
// //       const newTags = [...tags, input.trim()];
// //       onChange(newTags.join(', '));
// //       setInput('');
// //     }
// //   };

// //   const removeTag = (tagToRemove: string) => {
// //     const newTags = tags.filter(tag => tag !== tagToRemove);
// //     onChange(newTags.join(', '));
// //   };

// //   const handleKeyDown = (e: React.KeyboardEvent) => {
// //     if (e.key === 'Enter' || e.key === ',') {
// //       e.preventDefault();
// //       addTag();
// //     }
// //     if (e.key === 'Backspace' && !input && tags.length > 0) {
// //       removeTag(tags[tags.length - 1]);
// //     }
// //   };

// //   const tagColors = [
// //     'from-violet-500 to-purple-500',
// //     'from-blue-500 to-cyan-500',
// //     'from-emerald-500 to-teal-500',
// //     'from-amber-500 to-orange-500',
// //     'from-rose-500 to-pink-500',
// //     'from-indigo-500 to-violet-500',
// //   ];

// //   return (
// //     <div className="space-y-3">
// //       <label className="flex items-center gap-2.5 text-sm font-semibold text-slate-700 dark:text-slate-300">
// //         <span className="p-1.5 rounded-lg bg-gradient-to-r from-violet-500/20 to-purple-500/20">
// //           <Tag size={16} className="text-violet-500" />
// //         </span>
// //         Tags
// //         <span className="ml-2 px-2.5 py-0.5 text-xs font-medium bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400 rounded-full">
// //           {tags.filter(t => t.trim()).length} tags
// //         </span>
// //       </label>
      
// //       <div className="relative group">
// //         <div className={`absolute -inset-1 bg-gradient-to-r from-violet-500 to-purple-500 rounded-2xl blur opacity-0 transition-opacity duration-300 ${isFocused ? 'opacity-20' : 'group-hover:opacity-10'}`} />
        
// //         <div 
// //           className={`relative min-h-[140px] p-5 bg-slate-50/80 dark:bg-slate-800/80 backdrop-blur-sm border-2 rounded-xl transition-all duration-300 cursor-text ${
// //             isFocused
// //               ? 'border-violet-500'
// //               : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
// //           }`}
// //           onClick={() => inputRef.current?.focus()}
// //         >
// //           {/* Tags display */}
// //           <div className="flex flex-wrap gap-2.5 mb-4">
// //             {tags.filter(t => t.trim()).map((tag, idx) => (
// //               <span
// //                 key={idx}
// //                 className="group/tag relative flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white shadow-lg transform hover:scale-105 transition-all duration-200"
// //                 style={{
// //                   background: `linear-gradient(135deg, var(--tw-gradient-stops))`,
// //                 }}
// //               >
// //                 <div className={`absolute inset-0 bg-gradient-to-r ${tagColors[idx % tagColors.length]} rounded-xl`} />
// //                 <span className="relative flex items-center gap-2">
// //                   <Hash size={12} className="opacity-70" />
// //                   {tag}
// //                   <button
// //                     onClick={(e) => { e.stopPropagation(); removeTag(tag); }}
// //                     className="p-0.5 hover:bg-white/20 rounded-full transition-colors"
// //                   >
// //                     <X size={12} />
// //                   </button>
// //                 </span>
// //               </span>
// //             ))}
// //           </div>
          
// //           {/* Input */}
// //           <div className="flex items-center gap-3 border-t border-slate-200 dark:border-slate-700 pt-4">
// //             <Plus size={16} className="text-slate-400" />
// //             <input
// //               ref={inputRef}
// //               type="text"
// //               value={input}
// //               onChange={(e) => setInput(e.target.value)}
// //               onKeyDown={handleKeyDown}
// //               onFocus={() => setIsFocused(true)}
// //               onBlur={() => setIsFocused(false)}
// //               placeholder={tags.length === 0 ? "Type a tag and press Enter..." : "Add another tag..."}
// //               className="flex-1 bg-transparent text-slate-900 dark:text-white placeholder-slate-400 outline-none text-sm"
// //             />
// //             {input.trim() && (
// //               <button
// //                 onClick={addTag}
// //                 className="px-4 py-2 bg-gradient-to-r from-violet-500 to-purple-500 text-white text-sm font-medium rounded-lg hover:opacity-90 transition-all duration-200 flex items-center gap-2 shadow-lg shadow-violet-500/25"
// //               >
// //                 <Plus size={14} />
// //                 Add
// //               </button>
// //             )}
// //           </div>
// //         </div>
// //       </div>
      
// //       {/* FIXED: Changed <p> to <div> */}
// //       <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2 pl-1">
// //         <div className="p-1 bg-blue-100 dark:bg-blue-900/30 rounded">
// //           <Info size={10} className="text-blue-500" />
// //         </div>
// //         Press Enter or comma to add a tag. Click × to remove.
// //       </div>
// //     </div>
// //   );
// // };

// // // --- STAT INPUT CARD ---
// // const StatInputCard: React.FC<{
// //   icon: React.ReactNode;
// //   label: string;
// //   value: number | string;
// //   onChange: (value: number | string) => void;
// //   type?: 'number' | 'text';
// //   min?: number;
// //   max?: number;
// //   step?: number;
// //   unit?: string;
// //   gradient: string;
// // }> = ({ icon, label, value, onChange, type = 'number', min, max, step, unit, gradient }) => {
// //   const [isFocused, setIsFocused] = useState(false);
// //   const [isHovered, setIsHovered] = useState(false);

// //   return (
// //     <div 
// //       className="relative overflow-hidden bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-2xl border-2 border-slate-200 dark:border-slate-700 p-6 group hover:border-transparent transition-all duration-500"
// //       onMouseEnter={() => setIsHovered(true)}
// //       onMouseLeave={() => setIsHovered(false)}
// //     >
// //       <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 ${isHovered ? 'opacity-100' : ''} transition-opacity duration-500`} style={{ padding: '2px' }}>
// //         <div className="absolute inset-0.5 bg-white dark:bg-slate-900 rounded-2xl" />
// //       </div>
      
// //       <div className={`absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-br ${gradient} opacity-20 rounded-full blur-2xl group-hover:scale-150 group-hover:opacity-30 transition-all duration-700`} />
      
// //       <div className="relative">
// //         <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${gradient} mb-4 shadow-lg transform group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300`}>
// //           {icon}
// //         </div>
        
// //         <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">
// //           {label}
// //         </p>
        
// //         <div className="flex items-end gap-2">
// //           <input
// //             type={type}
// //             value={value}
// //             onChange={(e) => onChange(type === 'number' ? parseFloat(e.target.value) || 0 : e.target.value)}
// //             onFocus={() => setIsFocused(true)}
// //             onBlur={() => setIsFocused(false)}
// //             min={min}
// //             max={max}
// //             step={step}
// //             className={`w-full bg-transparent text-3xl font-bold bg-gradient-to-r ${gradient} bg-clip-text text-transparent focus:outline-none`}
// //           />
// //           {unit && (
// //             <span className="text-lg font-medium text-slate-400 mb-1">{unit}</span>
// //           )}
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // // --- IMAGE UPLOAD ---
// // const ImageUpload: React.FC<{
// //   imageUrl?: string;
// //   onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
// //   onRemove: () => void;
// // }> = ({ imageUrl, onUpload, onRemove }) => {
// //   const [isDragging, setIsDragging] = useState(false);
// //   const [isHovered, setIsHovered] = useState(false);

// //   const handleDragOver = (e: React.DragEvent) => {
// //     e.preventDefault();
// //     setIsDragging(true);
// //   };

// //   const handleDragLeave = () => {
// //     setIsDragging(false);
// //   };

// //   const handleDrop = (e: React.DragEvent) => {
// //     e.preventDefault();
// //     setIsDragging(false);
// //     const files = e.dataTransfer.files;
// //     if (files.length > 0) {
// //       const fakeEvent = { target: { files } } as React.ChangeEvent<HTMLInputElement>;
// //       onUpload(fakeEvent);
// //     }
// //   };

// //   return (
// //     <div className="space-y-4">
// //       <label className="flex items-center gap-2.5 text-sm font-semibold text-slate-700 dark:text-slate-300">
// //         <span className="p-1.5 rounded-lg bg-gradient-to-r from-rose-500/20 to-pink-500/20">
// //           <Camera size={16} className="text-rose-500" />
// //         </span>
// //         Course Thumbnail
// //         <span className="text-xs font-normal text-slate-400 ml-2">(Recommended: 1280×720)</span>
// //       </label>

// //       <div className="flex flex-col lg:flex-row gap-6">
// //         {imageUrl ? (
// //           <div 
// //             className="relative group w-full lg:w-96 h-56 rounded-2xl overflow-hidden shadow-2xl shadow-slate-900/20"
// //             onMouseEnter={() => setIsHovered(true)}
// //             onMouseLeave={() => setIsHovered(false)}
// //           >
// //             <img
// //               src={imageUrl}
// //               alt="Course preview"
// //               className={`w-full h-full object-cover transition-transform duration-700 ${isHovered ? 'scale-110' : 'scale-100'}`}
// //             />
            
// //             <div className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`} />
            
// //             <div className={`absolute inset-0 flex flex-col items-center justify-center gap-4 transition-all duration-300 ${isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
// //               <label className="px-6 py-3 bg-white/90 backdrop-blur-sm text-slate-900 font-semibold rounded-xl cursor-pointer hover:bg-white transition-colors flex items-center gap-2 shadow-xl">
// //                 <Camera size={18} />
// //                 Replace Image
// //                 <input
// //                   type="file"
// //                   accept="image/*"
// //                   onChange={onUpload}
// //                   className="hidden"
// //                 />
// //               </label>
              
// //               <button
// //                 onClick={onRemove}
// //                 className="px-6 py-3 bg-rose-500/90 backdrop-blur-sm text-white font-semibold rounded-xl hover:bg-rose-600 transition-colors flex items-center gap-2 shadow-xl"
// //               >
// //                 <Trash2 size={18} />
// //                 Remove
// //               </button>
// //             </div>
            
// //             <div className={`absolute top-4 left-4 px-3 py-1.5 bg-emerald-500/90 backdrop-blur-sm text-white text-xs font-bold rounded-lg flex items-center gap-1.5 shadow-lg transition-all duration-300 ${isHovered ? 'opacity-0 -translate-y-2' : 'opacity-100'}`}>
// //               <CheckCircle size={12} />
// //               Uploaded
// //             </div>
// //           </div>
// //         ) : (
// //           <label
// //             onDragOver={handleDragOver}
// //             onDragLeave={handleDragLeave}
// //             onDrop={handleDrop}
// //             className={`relative w-full lg:w-96 h-56 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all duration-500 overflow-hidden ${
// //               isDragging
// //                 ? 'border-violet-500 bg-violet-50 dark:bg-violet-900/20 scale-[1.02]'
// //                 : 'border-slate-300 dark:border-slate-700 hover:border-violet-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'
// //             }`}
// //           >
// //             <div className={`absolute inset-0 bg-gradient-to-br from-violet-500/5 to-purple-500/5 transition-opacity duration-500 ${isDragging ? 'opacity-100' : 'opacity-0'}`} />
            
// //             <FloatingParticles />
            
// //             <div className={`relative z-10 p-5 rounded-2xl mb-4 transition-all duration-300 ${isDragging ? 'bg-violet-100 dark:bg-violet-900/30 scale-110' : 'bg-slate-100 dark:bg-slate-800'}`}>
// //               <Upload size={32} className={`transition-colors duration-300 ${isDragging ? 'text-violet-500' : 'text-slate-400'}`} />
// //             </div>
            
// //             <p className={`relative z-10 text-base font-semibold mb-1 transition-colors duration-300 ${isDragging ? 'text-violet-600 dark:text-violet-400' : 'text-slate-600 dark:text-slate-400'}`}>
// //               {isDragging ? 'Drop your image here!' : 'Click or drag to upload'}
// //             </p>
// //             <p className="relative z-10 text-sm text-slate-400">PNG, JPG, GIF up to 5MB</p>
            
// //             <input
// //               type="file"
// //               accept="image/*"
// //               onChange={onUpload}
// //               className="hidden"
// //             />
// //           </label>
// //         )}

// //         <div className="flex-1 relative overflow-hidden p-6 bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-900/20 dark:to-purple-900/20 border border-violet-200 dark:border-violet-800/50 rounded-2xl">
// //           <AnimatedGradient className="opacity-30" />
          
// //           <div className="relative">
// //             <div className="flex items-center gap-3 mb-4">
// //               <div className="p-2.5 bg-gradient-to-br from-violet-500 to-purple-500 rounded-xl shadow-lg shadow-violet-500/25">
// //                 <Wand2 size={18} className="text-white" />
// //               </div>
// //               <h4 className="text-base font-bold text-violet-900 dark:text-violet-100">
// //                 Pro Tips for Great Thumbnails
// //               </h4>
// //             </div>
            
// //             <ul className="space-y-3">
// //               {[
// //                 'Use high-quality images (1280×720 or higher)',
// //                 'Keep important content centered',
// //                 'Use vibrant, eye-catching colors',
// //                 'Avoid cluttered or text-heavy designs'
// //               ].map((tip, idx) => (
// //                 <li key={idx} className="flex items-start gap-3 text-sm text-violet-700 dark:text-violet-300">
// //                   <div className="mt-0.5 p-1 bg-violet-200 dark:bg-violet-800 rounded-full shrink-0">
// //                     <Check size={10} className="text-violet-600 dark:text-violet-400" />
// //                   </div>
// //                   {tip}
// //                 </li>
// //               ))}
// //             </ul>
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // // --- PUBLISH TOGGLE ---
// // const PublishToggle: React.FC<{
// //   isPublished: boolean;
// //   onChange: (value: boolean) => void;
// // }> = ({ isPublished, onChange }) => {
// //   return (
// //     <div className={`relative overflow-hidden p-6 rounded-2xl border-2 transition-all duration-500 ${
// //       isPublished 
// //         ? 'bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 border-emerald-300 dark:border-emerald-700' 
// //         : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700'
// //     }`}>
// //       {isPublished && (
// //         <>
// //           <div className="absolute -top-12 -right-12 w-32 h-32 bg-emerald-400/30 rounded-full blur-3xl animate-pulse" />
// //           <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-teal-400/30 rounded-full blur-3xl animate-pulse delay-500" />
// //         </>
// //       )}
      
// //       <label className="relative flex items-center justify-between cursor-pointer">
// //         <div className="flex items-center gap-5">
// //           <div className={`p-4 rounded-2xl transition-all duration-500 transform ${isPublished ? 'bg-gradient-to-br from-emerald-500 to-teal-500 scale-110 rotate-3' : 'bg-slate-300 dark:bg-slate-600'} shadow-lg`}>
// //             {isPublished ? <Eye size={24} className="text-white" /> : <EyeOff size={24} className="text-white" />}
// //           </div>
          
// //           <div>
// //             <div className="flex items-center gap-3">
// //               <h4 className="text-lg font-bold text-slate-900 dark:text-white">
// //                 {isPublished ? 'Course is Published' : 'Course is Draft'}
// //               </h4>
// //               {isPublished && (
// //                 <span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold rounded-full animate-pulse">
// //                   LIVE
// //                 </span>
// //               )}
// //             </div>
// //             <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
// //               {isPublished 
// //                 ? 'Students can now discover and enroll in your course' 
// //                 : 'This course is hidden from students'}
// //             </p>
// //           </div>
// //         </div>
        
// //         <div className="relative">
// //           <input
// //             type="checkbox"
// //             checked={isPublished}
// //             onChange={(e) => onChange(e.target.checked)}
// //             className="sr-only peer"
// //           />
// //           <div className="w-16 h-9 bg-slate-200 dark:bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-7 after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:rounded-full after:h-7 after:w-7 after:transition-all after:duration-300 after:shadow-lg peer-checked:bg-gradient-to-r peer-checked:from-emerald-500 peer-checked:to-teal-500"></div>
// //         </div>
// //       </label>
// //     </div>
// //   );
// // };

// // // --- MAIN COMPONENT ---
// // export const BasicInfoSection: React.FC<BasicInfoSectionProps> = ({
// //   course,
// //   updateBasicInfo,
// //   updateStats,
// //   updateTags,
// //   handlePhotoUpload,
// //   removePhoto
// // }) => {
// //   const titleError = !course.title.trim() ? 'Course title is required' : undefined;
// //   const instructorError = !course.instructor_name?.trim() ? 'Instructor name is required' : undefined;
// //   const departmentError = !course.department?.trim() ? 'Department is required' : undefined;
  
// //   // NOTE: Validation for description/introduction removed because backend now allows blank (drafts)
// //   // But if you want to enforce it visually on frontend only for 'Published' state, logic would go here.
// //   // For now, consistent with backend "blank=True", these are optional for creating the course.
// //   const descriptionError = undefined; 
// //   const introductionError = undefined;

// //   const levelOptions = [
// //     { value: 'Beginner', label: '🌱 Beginner', color: 'emerald' },
// //     { value: 'Intermediate', label: '🌿 Intermediate', color: 'blue' },
// //     { value: 'Advanced', label: '🌳 Advanced', color: 'purple' }
// //   ];

// //   return (
// //     <div className="space-y-8">
      
// //       <SectionCard
// //         title="Course Details"
// //         subtitle="Essential information about your course"
// //         icon={<BookOpen size={22} className="text-white" />}
// //         iconBg="bg-gradient-to-br from-violet-500 to-purple-600"
// //         glowColor="violet"
// //       >
// //         <div className="space-y-8">
// //           <ImageUpload
// //             imageUrl={course.photoUrl}
// //             onUpload={handlePhotoUpload}
// //             onRemove={removePhoto}
// //           />

// //           <div className="border-t border-slate-200 dark:border-slate-700 pt-8">
// //             <InputField
// //               label="Course Title"
// //               icon={<BookOpen size={14} className="text-violet-500" />}
// //               // Fix: Don't show "New Course" text in input
// //               value={course.title === 'New Course' ? '' : course.title}
// //               onChange={(v) => updateBasicInfo('title', v)}
// //               placeholder="e.g., Complete React Development Masterclass"
// //               required
// //               maxLength={100}
// //               error={titleError}
// //               helpText="Choose a clear, descriptive title that highlights the value"
// //             />
// //           </div>

// //           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
// //             <InputField
// //               label="Instructor"
// //               icon={<User size={14} className="text-blue-500" />}
// //               value={course.instructor_name}
// //               onChange={(v) => updateBasicInfo('instructor_name', v)}
// //               placeholder="e.g., John Doe"
// //               required
// //               error={instructorError}
// //             />

// //             <InputField
// //               label="Department"
// //               icon={<Building2 size={14} className="text-teal-500" />}
// //               value={course.department || ''}
// //               onChange={(v) => updateBasicInfo('department', v)}
// //               placeholder="e.g., IT, Sales, HR"
// //               helpText="Categorize by department"
// //               required
// //               error={departmentError}
// //             />

// //             <SelectField
// //               label="Difficulty Level"
// //               icon={<GraduationCap size={14} className="text-amber-500" />}
// //               value={course.level}
// //               onChange={(v) => updateBasicInfo('level', v)}
// //               options={levelOptions}
// //               required
// //             />

// //             <InputField
// //               label="Duration"
// //               icon={<Clock size={14} className="text-rose-500" />}
// //               value={course.duration}
// //               onChange={(v) => updateBasicInfo('duration', v)}
// //               placeholder="e.g., 10 hours"
// //               helpText="Estimated time to complete"
// //             />
// //           </div>

// //           <TextareaField
// //             label="Short Description"
// //             icon={<Info size={14} className="text-sky-500" />}
// //             value={course.description}
// //             onChange={(v) => updateBasicInfo('description', v)}
// //             placeholder="Brief overview of what students will learn..."
// //             rows={3}
// //             maxLength={300}
// //             helpText="This appears in course cards and search results"
// //             error={descriptionError}
// //           />

// //           <TextareaField
// //             label="Full Introduction"
// //             icon={<Sparkles size={14} className="text-amber-500" />}
// //             value={course.introduction}
// //             onChange={(v) => updateBasicInfo('introduction', v)}
// //             placeholder="Detailed introduction including learning objectives, prerequisites, and what makes this course unique..."
// //             rows={5}
// //             helpText="Shown on the course landing page. Be compelling!"
// //             error={introductionError}
// //           />

// //           <TagInput
// //             tags={course.tags || []}
// //             onChange={updateTags}
// //           />
// //         </div>
// //       </SectionCard>

// //       <SectionCard
// //         title="Course Statistics"
// //         subtitle="Track and display course metrics"
// //         icon={<BarChart3 size={22} className="text-white" />}
// //         iconBg="bg-gradient-to-br from-blue-500 to-cyan-600"
// //         collapsible
// //         defaultOpen={false}
// //         badge="Optional"
// //         glowColor="blue"
// //       >
// //         <div className="grid grid-cols-2 lg:grid-cols-5 gap-5">
// //           <StatInputCard
// //             icon={<Star size={20} className="text-white" />}
// //             label="Rating"
// //             value={course.stats.rating}
// //             onChange={(v) => updateStats('rating', v as number)}
// //             type="number"
// //             min={0}
// //             max={5}
// //             step={0.1}
// //             gradient="from-amber-400 to-orange-500"
// //           />

// //           <StatInputCard
// //             icon={<Users size={20} className="text-white" />}
// //             label="Enrolled"
// //             value={course.stats.enrolled}
// //             onChange={(v) => updateStats('enrolled', v as number)}
// //             type="number"
// //             min={0}
// //             gradient="from-blue-500 to-cyan-500"
// //           />

// //           <StatInputCard
// //             icon={<Target size={20} className="text-white" />}
// //             label="Accuracy"
// //             value={course.stats.accuracy}
// //             onChange={(v) => updateStats('accuracy', v as number)}
// //             type="number"
// //             min={0}
// //             max={100}
// //             unit="%"
// //             gradient="from-emerald-500 to-teal-500"
// //           />

// //           <StatInputCard
// //             icon={<TrendingUp size={20} className="text-white" />}
// //             label="Completion"
// //             value={course.stats.completion}
// //             onChange={(v) => updateStats('completion', v as number)}
// //             type="number"
// //             min={0}
// //             max={100}
// //             unit="%"
// //             gradient="from-violet-500 to-purple-500"
// //           />

// //           <StatInputCard
// //             icon={<Timer size={20} className="text-white" />}
// //             label="Duration"
// //             value={course.stats.duration}
// //             onChange={(v) => updateStats('duration', v as string)}
// //             type="text"
// //             gradient="from-rose-500 to-pink-500"
// //           />
// //         </div>
        
// //         <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/50 rounded-xl flex items-center gap-3">
// //           <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
// //             <Info size={16} className="text-blue-500" />
// //           </div>
// //           <p className="text-sm text-blue-700 dark:text-blue-300">
// //             These statistics are displayed on the course page to help students make informed decisions.
// //           </p>
// //         </div>
// //       </SectionCard>

// //       <SectionCard
// //         title="Publication Settings"
// //         subtitle="Control course visibility"
// //         icon={<Zap size={22} className="text-white" />}
// //         iconBg="bg-gradient-to-br from-emerald-500 to-teal-600"
// //         glowColor="emerald"
// //       >
// //         <PublishToggle
// //           isPublished={course.is_published || false}
// //           onChange={(v) => updateBasicInfo('is_published', v)}
// //         />
        
// //         <div className="mt-6 relative overflow-hidden p-5 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border border-amber-200 dark:border-amber-800/50 rounded-2xl">
// //           <div className="absolute -right-8 -top-8 w-24 h-24 bg-amber-400/20 rounded-full blur-2xl" />
          
// //           <div className="relative flex items-start gap-4">
// //             <div className="p-3 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl shadow-lg shadow-amber-500/25 shrink-0">
// //               <Shield size={20} className="text-white" />
// //             </div>
// //             <div>
// //               <h4 className="text-base font-bold text-amber-900 dark:text-amber-200">Before Publishing</h4>
// //               <p className="text-sm text-amber-700 dark:text-amber-300 mt-1 leading-relaxed">
// //                 Make sure you've added all lessons and tests. Once published, students can enroll and access your course content immediately.
// //               </p>
// //             </div>
// //           </div>
// //         </div>
// //       </SectionCard>
// //     </div>
// //   );
// // };

// // export default BasicInfoSection;

// import React, { useState, useRef } from 'react';
// import { 
//   Upload, Info, Star, Users, TrendingUp, Clock, Building2,
//   Check, AlertCircle, ChevronDown, Sparkles, Trash2,
//   Eye, EyeOff, GraduationCap, Tag, Plus, BookOpen, User, Timer, Hash, Lightbulb, CheckCircle, XCircle, Camera,
//   Wand2, Shield, Zap, BarChart3, Target,
//   X
// } from 'lucide-react';
// import type { Course } from '../Utils/types';

// interface BasicInfoSectionProps {
//   course: Course;
//   updateBasicInfo: (field: string, value: string | number | boolean) => void;
//   updateStats: (field: keyof Course['stats'], value: number | string) => void;
//   updateTags: (tags: string) => void;
//   handlePhotoUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
//   removePhoto: () => void;
// }

// // --- ANIMATED GRADIENT BACKGROUND ---
// const AnimatedGradient: React.FC<{ className?: string }> = ({ className }) => (
//   <div className={`absolute inset-0 overflow-hidden ${className}`}>
//     <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-violet-500/20 via-transparent to-transparent rounded-full blur-3xl animate-pulse" />
//     <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-blue-500/20 via-transparent to-transparent rounded-full blur-3xl animate-pulse delay-1000" />
//   </div>
// );

// // --- FLOATING PARTICLES ---
// const FloatingParticles: React.FC = () => (
//   <div className="absolute inset-0 overflow-hidden pointer-events-none">
//     {[...Array(6)].map((_, i) => (
//       <div
//         key={i}
//         className="absolute w-2 h-2 bg-gradient-to-r from-violet-400 to-purple-400 rounded-full opacity-30"
//         style={{
//           top: `${Math.random() * 100}%`,
//           left: `${Math.random() * 100}%`,
//           animation: `float ${3 + Math.random() * 4}s ease-in-out infinite`,
//           animationDelay: `${Math.random() * 2}s`
//         }}
//       />
//     ))}
//     <style>{`
//       @keyframes float {
//         0%, 100% { transform: translateY(0px) scale(1); opacity: 0.3; }
//         50% { transform: translateY(-20px) scale(1.2); opacity: 0.6; }
//       }
//     `}</style>
//   </div>
// );

// // --- SECTION CARD COMPONENT ---
// const SectionCard: React.FC<{
//   title: string;
//   subtitle?: string;
//   icon: React.ReactNode;
//   iconBg: string;
//   children: React.ReactNode;
//   collapsible?: boolean;
//   defaultOpen?: boolean;
//   badge?: string;
//   glowColor?: string;
// }> = ({ title, subtitle, icon, iconBg, children, collapsible = false, defaultOpen = true, badge, glowColor = 'violet' }) => {
//   const [isOpen, setIsOpen] = useState(defaultOpen);
//   const [isHovered, setIsHovered] = useState(false);

//   const glowStyles: Record<string, string> = {
//     violet: 'hover:shadow-violet-500/10',
//     blue: 'hover:shadow-blue-500/10',
//     emerald: 'hover:shadow-emerald-500/10',
//   };

//   return (
//     <div 
//       className={`group relative bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-3xl border border-slate-200/60 dark:border-slate-700/60 overflow-hidden shadow-xl shadow-slate-200/50 dark:shadow-slate-900/50 hover:shadow-2xl ${glowStyles[glowColor]} transition-all duration-500`}
//       onMouseEnter={() => setIsHovered(true)}
//       onMouseLeave={() => setIsHovered(false)}
//     >
//       <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-violet-500/0 via-violet-500/10 to-purple-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
      
//       <div 
//         className={`relative px-8 py-6 flex items-center justify-between ${collapsible ? 'cursor-pointer' : ''}`}
//         onClick={() => collapsible && setIsOpen(!isOpen)}
//       >
//         <div className="absolute bottom-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-slate-200 dark:via-slate-700 to-transparent" />
        
//         <div className="flex items-center gap-5">
//           <div className="relative">
//             <div className={`absolute inset-0 ${iconBg} blur-xl opacity-40 group-hover:opacity-60 transition-opacity duration-500`} />
//             <div className={`relative p-4 rounded-2xl ${iconBg} shadow-lg transform group-hover:scale-105 transition-transform duration-300`}>
//               {icon}
//             </div>
//           </div>
          
//           <div>
//             <div className="flex items-center gap-3">
//               <h3 className="text-xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
//                 {title}
//               </h3>
//               {badge && (
//                 <span className="px-3 py-1 text-[10px] font-bold bg-gradient-to-r from-violet-500/10 to-purple-500/10 dark:from-violet-500/20 dark:to-purple-500/20 text-violet-600 dark:text-violet-400 rounded-full border border-violet-200 dark:border-violet-800">
//                   {badge}
//                 </span>
//               )}
//             </div>
//             {subtitle && (
//               <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{subtitle}</p>
//             )}
//           </div>
//         </div>
        
//         {collapsible && (
//           <button className="p-3 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all duration-300 group/btn">
//             <div className={`transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
//               <ChevronDown size={20} className="text-slate-400 group-hover/btn:text-violet-500" />
//             </div>
//           </button>
//         )}
//       </div>
      
//       <div className={`overflow-hidden transition-all duration-500 ease-out ${(!collapsible || isOpen) ? 'max-h-[5000px] opacity-100' : 'max-h-0 opacity-0'}`}>
//         <div className="p-8 pt-6">
//           {children}
//         </div>
//       </div>
//     </div>
//   );
// };

// // --- ENHANCED INPUT FIELD ---
// const InputField: React.FC<{
//   label: string;
//   icon?: React.ReactNode;
//   value: string | number;
//   onChange: (value: string) => void;
//   placeholder?: string;
//   type?: string;
//   required?: boolean;
//   maxLength?: number;
//   helpText?: string;
//   error?: string;
//   disabled?: boolean;
// }> = ({ label, icon, value, onChange, placeholder, type = 'text', required, maxLength, helpText, error, disabled }) => {
//   const [isFocused, setIsFocused] = useState(false);
//   const charCount = typeof value === 'string' ? value.length : 0;
//   const isOverLimit = maxLength && charCount > maxLength;
//   const progress = maxLength ? (charCount / maxLength) * 100 : 0;

//   return (
//     <div className="space-y-3">
//       <label className="flex items-center justify-between">
//         <span className="flex items-center gap-2.5 text-sm font-semibold text-slate-700 dark:text-slate-300">
//           <span className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800">
//             {icon}
//           </span>
//           {label}
//           {required && <span className="text-rose-500 animate-pulse">*</span>}
//         </span>
//         {maxLength && (
//           <span className={`text-xs font-medium px-2 py-1 rounded-full ${
//             isOverLimit 
//               ? 'bg-rose-100 dark:bg-rose-900/30 text-rose-500' 
//               : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
//           }`}>
//             {charCount}/{maxLength}
//           </span>
//         )}
//       </label>
      
//       <div className="relative group">
//         <div className={`absolute -inset-1 bg-gradient-to-r from-violet-500 to-purple-500 rounded-2xl blur opacity-0 transition-opacity duration-300 ${isFocused ? 'opacity-20' : 'group-hover:opacity-10'}`} />
        
//         <div className="relative">
//           <input
//             type={type}
//             value={value}
//             onChange={(e) => onChange(e.target.value)}
//             onFocus={() => setIsFocused(true)}
//             onBlur={() => setIsFocused(false)}
//             placeholder={placeholder}
//             disabled={disabled}
//             className={`w-full px-5 py-4 bg-slate-50/80 dark:bg-slate-800/80 backdrop-blur-sm border-2 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 transition-all duration-300 ${
//               error 
//                 ? 'border-rose-300 dark:border-rose-700 focus:border-rose-500' 
//                 : isFocused
//                   ? 'border-violet-500 dark:border-violet-500'
//                   : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
//             } ${disabled ? 'opacity-50 cursor-not-allowed' : ''} focus:outline-none`}
//           />
          
//           <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
//             {value && !error && (
//               <div className="p-1 bg-emerald-100 dark:bg-emerald-900/30 rounded-full">
//                 <CheckCircle size={14} className="text-emerald-500" />
//               </div>
//             )}
//             {error && (
//               <div className="p-1 bg-rose-100 dark:bg-rose-900/30 rounded-full animate-shake">
//                 <XCircle size={14} className="text-rose-500" />
//               </div>
//             )}
//           </div>
          
//           {maxLength && isFocused && (
//             <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
//               <div 
//                 className={`h-full transition-all duration-300 ${isOverLimit ? 'bg-rose-500' : 'bg-gradient-to-r from-violet-500 to-purple-500'}`}
//                 style={{ width: `${Math.min(progress, 100)}%` }}
//               />
//             </div>
//           )}
//         </div>
//       </div>
      
//       {helpText && !error && (
//         <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2 pl-1">
//           <div className="p-1 bg-blue-100 dark:bg-blue-900/30 rounded">
//             <Info size={10} className="text-blue-500" />
//           </div>
//           {helpText}
//         </div>
//       )}
//       {error && (
//         <div className="text-xs text-rose-500 flex items-center gap-2 pl-1 animate-slideIn">
//           <div className="p-1 bg-rose-100 dark:bg-rose-900/30 rounded">
//             <AlertCircle size={10} />
//           </div>
//           {error}
//         </div>
//       )}
      
//       <style>{`
//         @keyframes shake {
//           0%, 100% { transform: translateX(0); }
//           25% { transform: translateX(-2px); }
//           75% { transform: translateX(2px); }
//         }
//         .animate-shake { animation: shake 0.3s ease-in-out; }
//         @keyframes slideIn {
//           from { opacity: 0; transform: translateY(-5px); }
//           to { opacity: 1; transform: translateY(0); }
//         }
//         .animate-slideIn { animation: slideIn 0.2s ease-out; }
//       `}</style>
//     </div>
//   );
// };

// // --- ENHANCED TEXTAREA ---
// const TextareaField: React.FC<{
//   label: string;
//   icon?: React.ReactNode;
//   value: string;
//   onChange: (value: string) => void;
//   placeholder?: string;
//   rows?: number;
//   required?: boolean;
//   maxLength?: number;
//   helpText?: string;
//   error?: string;
// }> = ({ label, icon, value, onChange, placeholder, rows = 4, required, maxLength, helpText, error }) => {
//   const [isFocused, setIsFocused] = useState(false);
//   const charCount = value ? value.length : 0;
//   const isOverLimit = maxLength && charCount > maxLength;
//   const progress = maxLength ? (charCount / maxLength) * 100 : 0;

//   return (
//     <div className="space-y-3">
//       <label className="flex items-center justify-between">
//         <span className="flex items-center gap-2.5 text-sm font-semibold text-slate-700 dark:text-slate-300">
//           <span className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800">
//             {icon}
//           </span>
//           {label}
//           {required && <span className="text-rose-500 animate-pulse">*</span>}
//         </span>
//         {maxLength && (
//           <div className="flex items-center gap-3">
//             <div className="w-24 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
//               <div 
//                 className={`h-full transition-all duration-300 ${isOverLimit ? 'bg-rose-500' : 'bg-gradient-to-r from-violet-500 to-purple-500'}`}
//                 style={{ width: `${Math.min(progress, 100)}%` }}
//               />
//             </div>
//             <span className={`text-xs font-medium ${isOverLimit ? 'text-rose-500' : 'text-slate-400'}`}>
//               {charCount}/{maxLength}
//             </span>
//           </div>
//         )}
//       </label>
      
//       <div className="relative group">
//         <div className={`absolute -inset-1 bg-gradient-to-r from-violet-500 to-purple-500 rounded-2xl blur opacity-0 transition-opacity duration-300 ${isFocused ? 'opacity-20' : 'group-hover:opacity-10'}`} />
        
//         <textarea
//           value={value}
//           onChange={(e) => onChange(e.target.value)}
//           onFocus={() => setIsFocused(true)}
//           onBlur={() => setIsFocused(false)}
//           placeholder={placeholder}
//           rows={rows}
//           className={`relative w-full px-5 py-4 bg-slate-50/80 dark:bg-slate-800/80 backdrop-blur-sm border-2 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 transition-all duration-300 resize-none ${
//             error
//               ? 'border-rose-300 dark:border-rose-700 focus:border-rose-500'
//               : isFocused
//                 ? 'border-violet-500'
//                 : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
//           } focus:outline-none`}
//         />
        
//         {/* Status icons for Textarea */}
//         <div className="absolute right-4 top-4 flex items-center gap-2">
//             {value && !error && (
//               <div className="p-1 bg-emerald-100 dark:bg-emerald-900/30 rounded-full">
//                 <CheckCircle size={14} className="text-emerald-500" />
//               </div>
//             )}
//             {error && (
//               <div className="p-1 bg-rose-100 dark:bg-rose-900/30 rounded-full animate-shake">
//                 <XCircle size={14} className="text-rose-500" />
//               </div>
//             )}
//         </div>
//       </div>
      
//       {helpText && !error && (
//         <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2 pl-1">
//           <div className="p-1 bg-amber-100 dark:bg-amber-900/30 rounded">
//             <Lightbulb size={10} className="text-amber-500" />
//           </div>
//           {helpText}
//         </div>
//       )}

//       {error && (
//         <div className="text-xs text-rose-500 flex items-center gap-2 pl-1 animate-slideIn">
//           <div className="p-1 bg-rose-100 dark:bg-rose-900/30 rounded">
//             <AlertCircle size={10} />
//           </div>
//           {error}
//         </div>
//       )}
//     </div>
//   );
// };

// // --- ENHANCED SELECT ---
// const SelectField: React.FC<{
//   label: string;
//   icon?: React.ReactNode;
//   value: string;
//   onChange: (value: string) => void;
//   options: { value: string; label: string; color?: string }[];
//   required?: boolean;
// }> = ({ label, icon, value, onChange, options, required }) => {
//   const [isFocused, setIsFocused] = useState(false);
//   const [isOpen, setIsOpen] = useState(false);

//   return (
//     <div className="space-y-3">
//       <label className="flex items-center gap-2.5 text-sm font-semibold text-slate-700 dark:text-slate-300">
//         <span className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800">
//           {icon}
//         </span>
//         {label}
//         {required && <span className="text-rose-500 animate-pulse">*</span>}
//       </label>
      
//       <div className="relative group">
//         <div className={`absolute -inset-1 bg-gradient-to-r from-violet-500 to-purple-500 rounded-2xl blur opacity-0 transition-opacity duration-300 ${isFocused ? 'opacity-20' : 'group-hover:opacity-10'}`} />
        
//         <div className="relative">
//           <select
//             value={value}
//             onChange={(e) => onChange(e.target.value)}
//             onFocus={() => { setIsFocused(true); setIsOpen(true); }}
//             onBlur={() => { setIsFocused(false); setIsOpen(false); }}
//             className={`w-full px-5 py-4 bg-slate-50/80 dark:bg-slate-800/80 backdrop-blur-sm border-2 rounded-xl text-slate-900 dark:text-white transition-all duration-300 cursor-pointer appearance-none ${
//               isFocused
//                 ? 'border-violet-500'
//                 : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
//             } focus:outline-none`}
//           >
//             {options.map(opt => (
//               <option key={opt.value} value={opt.value}>{opt.label}</option>
//             ))}
//           </select>
          
//           <div className={`absolute right-4 top-1/2 -translate-y-1/2 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
//             <ChevronDown size={18} className="text-slate-400" />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// // --- ENHANCED TAG INPUT ---
// const TagInput: React.FC<{
//   tags: string[];
//   onChange: (tags: string) => void;
// }> = ({ tags, onChange }) => {
//   const [input, setInput] = useState('');
//   const [isFocused, setIsFocused] = useState(false);
//   const inputRef = useRef<HTMLInputElement>(null);

//   const addTag = () => {
//     if (input.trim() && !tags.includes(input.trim())) {
//       const newTags = [...tags, input.trim()];
//       onChange(newTags.join(', '));
//       setInput('');
//     }
//   };

//   const removeTag = (tagToRemove: string) => {
//     const newTags = tags.filter(tag => tag !== tagToRemove);
//     onChange(newTags.join(', '));
//   };

//   const handleKeyDown = (e: React.KeyboardEvent) => {
//     if (e.key === 'Enter' || e.key === ',') {
//       e.preventDefault();
//       addTag();
//     }
//     if (e.key === 'Backspace' && !input && tags.length > 0) {
//       removeTag(tags[tags.length - 1]);
//     }
//   };

//   const tagColors = [
//     'from-violet-500 to-purple-500',
//     'from-blue-500 to-cyan-500',
//     'from-emerald-500 to-teal-500',
//     'from-amber-500 to-orange-500',
//     'from-rose-500 to-pink-500',
//     'from-indigo-500 to-violet-500',
//   ];

//   return (
//     <div className="space-y-3">
//       <label className="flex items-center gap-2.5 text-sm font-semibold text-slate-700 dark:text-slate-300">
//         <span className="p-1.5 rounded-lg bg-gradient-to-r from-violet-500/20 to-purple-500/20">
//           <Tag size={16} className="text-violet-500" />
//         </span>
//         Tags
//         <span className="ml-2 px-2.5 py-0.5 text-xs font-medium bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400 rounded-full">
//           {tags.filter(t => t.trim()).length} tags
//         </span>
//       </label>
      
//       <div className="relative group">
//         <div className={`absolute -inset-1 bg-gradient-to-r from-violet-500 to-purple-500 rounded-2xl blur opacity-0 transition-opacity duration-300 ${isFocused ? 'opacity-20' : 'group-hover:opacity-10'}`} />
        
//         <div 
//           className={`relative min-h-[140px] p-5 bg-slate-50/80 dark:bg-slate-800/80 backdrop-blur-sm border-2 rounded-xl transition-all duration-300 cursor-text ${
//             isFocused
//               ? 'border-violet-500'
//               : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
//           }`}
//           onClick={() => inputRef.current?.focus()}
//         >
//           {/* Tags display */}
//           <div className="flex flex-wrap gap-2.5 mb-4">
//             {tags.filter(t => t.trim()).map((tag, idx) => (
//               <span
//                 key={idx}
//                 className="group/tag relative flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white shadow-lg transform hover:scale-105 transition-all duration-200"
//                 style={{
//                   background: `linear-gradient(135deg, var(--tw-gradient-stops))`,
//                 }}
//               >
//                 <div className={`absolute inset-0 bg-gradient-to-r ${tagColors[idx % tagColors.length]} rounded-xl`} />
//                 <span className="relative flex items-center gap-2">
//                   <Hash size={12} className="opacity-70" />
//                   {tag}
//                   <button
//                     onClick={(e) => { e.stopPropagation(); removeTag(tag); }}
//                     className="p-0.5 hover:bg-white/20 rounded-full transition-colors"
//                   >
//                     <X size={12} />
//                   </button>
//                 </span>
//               </span>
//             ))}
//           </div>
          
//           {/* Input */}
//           <div className="flex items-center gap-3 border-t border-slate-200 dark:border-slate-700 pt-4">
//             <Plus size={16} className="text-slate-400" />
//             <input
//               ref={inputRef}
//               type="text"
//               value={input}
//               onChange={(e) => setInput(e.target.value)}
//               onKeyDown={handleKeyDown}
//               onFocus={() => setIsFocused(true)}
//               onBlur={() => setIsFocused(false)}
//               placeholder={tags.length === 0 ? "Type a tag and press Enter..." : "Add another tag..."}
//               className="flex-1 bg-transparent text-slate-900 dark:text-white placeholder-slate-400 outline-none text-sm"
//             />
//             {input.trim() && (
//               <button
//                 onClick={addTag}
//                 className="px-4 py-2 bg-gradient-to-r from-violet-500 to-purple-500 text-white text-sm font-medium rounded-lg hover:opacity-90 transition-all duration-200 flex items-center gap-2 shadow-lg shadow-violet-500/25"
//               >
//                 <Plus size={14} />
//                 Add
//               </button>
//             )}
//           </div>
//         </div>
//       </div>
      
//       <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2 pl-1">
//         <div className="p-1 bg-blue-100 dark:bg-blue-900/30 rounded">
//           <Info size={10} className="text-blue-500" />
//         </div>
//         Press Enter or comma to add a tag. Click × to remove.
//       </div>
//     </div>
//   );
// };

// // --- STAT INPUT CARD ---
// const StatInputCard: React.FC<{
//   icon: React.ReactNode;
//   label: string;
//   value: number | string;
//   onChange: (value: number | string) => void;
//   type?: 'number' | 'text';
//   min?: number;
//   max?: number;
//   step?: number;
//   unit?: string;
//   gradient: string;
// }> = ({ icon, label, value, onChange, type = 'number', min, max, step, unit, gradient }) => {
//   const [isFocused, setIsFocused] = useState(false);
//   const [isHovered, setIsHovered] = useState(false);

//   return (
//     <div 
//       className="relative overflow-hidden bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-2xl border-2 border-slate-200 dark:border-slate-700 p-6 group hover:border-transparent transition-all duration-500"
//       onMouseEnter={() => setIsHovered(true)}
//       onMouseLeave={() => setIsHovered(false)}
//     >
//       <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 ${isHovered ? 'opacity-100' : ''} transition-opacity duration-500`} style={{ padding: '2px' }}>
//         <div className="absolute inset-0.5 bg-white dark:bg-slate-900 rounded-2xl" />
//       </div>
      
//       <div className={`absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-br ${gradient} opacity-20 rounded-full blur-2xl group-hover:scale-150 group-hover:opacity-30 transition-all duration-700`} />
      
//       <div className="relative">
//         <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${gradient} mb-4 shadow-lg transform group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300`}>
//           {icon}
//         </div>
        
//         <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">
//           {label}
//         </p>
        
//         <div className="flex items-end gap-2">
//           <input
//             type={type}
//             value={value}
//             onChange={(e) => onChange(type === 'number' ? parseFloat(e.target.value) || 0 : e.target.value)}
//             onFocus={() => setIsFocused(true)}
//             onBlur={() => setIsFocused(false)}
//             min={min}
//             max={max}
//             step={step}
//             className={`w-full bg-transparent text-3xl font-bold bg-gradient-to-r ${gradient} bg-clip-text text-transparent focus:outline-none`}
//           />
//           {unit && (
//             <span className="text-lg font-medium text-slate-400 mb-1">{unit}</span>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// // --- IMAGE UPLOAD ---
// const ImageUpload: React.FC<{
//   imageUrl?: string;
//   onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
//   onRemove: () => void;
// }> = ({ imageUrl, onUpload, onRemove }) => {
//   const [isDragging, setIsDragging] = useState(false);
//   const [isHovered, setIsHovered] = useState(false);

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
//     const files = e.dataTransfer.files;
//     if (files.length > 0) {
//       const fakeEvent = { target: { files } } as React.ChangeEvent<HTMLInputElement>;
//       onUpload(fakeEvent);
//     }
//   };

//   return (
//     <div className="space-y-4">
//       <label className="flex items-center gap-2.5 text-sm font-semibold text-slate-700 dark:text-slate-300">
//         <span className="p-1.5 rounded-lg bg-gradient-to-r from-rose-500/20 to-pink-500/20">
//           <Camera size={16} className="text-rose-500" />
//         </span>
//         Course Thumbnail
//         <span className="text-xs font-normal text-slate-400 ml-2">(Recommended: 1280×720)</span>
//       </label>

//       <div className="flex flex-col lg:flex-row gap-6">
//         {imageUrl ? (
//           <div 
//             className="relative group w-full lg:w-96 h-56 rounded-2xl overflow-hidden shadow-2xl shadow-slate-900/20"
//             onMouseEnter={() => setIsHovered(true)}
//             onMouseLeave={() => setIsHovered(false)}
//           >
//             <img
//               src={imageUrl}
//               alt="Course preview"
//               className={`w-full h-full object-cover transition-transform duration-700 ${isHovered ? 'scale-110' : 'scale-100'}`}
//             />
            
//             <div className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`} />
            
//             <div className={`absolute inset-0 flex flex-col items-center justify-center gap-4 transition-all duration-300 ${isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
//               <label className="px-6 py-3 bg-white/90 backdrop-blur-sm text-slate-900 font-semibold rounded-xl cursor-pointer hover:bg-white transition-colors flex items-center gap-2 shadow-xl">
//                 <Camera size={18} />
//                 Replace Image
//                 <input
//                   type="file"
//                   accept="image/*"
//                   onChange={onUpload}
//                   className="hidden"
//                 />
//               </label>
              
//               <button
//                 onClick={onRemove}
//                 className="px-6 py-3 bg-rose-500/90 backdrop-blur-sm text-white font-semibold rounded-xl hover:bg-rose-600 transition-colors flex items-center gap-2 shadow-xl"
//               >
//                 <Trash2 size={18} />
//                 Remove
//               </button>
//             </div>
            
//             <div className={`absolute top-4 left-4 px-3 py-1.5 bg-emerald-500/90 backdrop-blur-sm text-white text-xs font-bold rounded-lg flex items-center gap-1.5 shadow-lg transition-all duration-300 ${isHovered ? 'opacity-0 -translate-y-2' : 'opacity-100'}`}>
//               <CheckCircle size={12} />
//               Uploaded
//             </div>
//           </div>
//         ) : (
//           <label
//             onDragOver={handleDragOver}
//             onDragLeave={handleDragLeave}
//             onDrop={handleDrop}
//             className={`relative w-full lg:w-96 h-56 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all duration-500 overflow-hidden ${
//               isDragging
//                 ? 'border-violet-500 bg-violet-50 dark:bg-violet-900/20 scale-[1.02]'
//                 : 'border-slate-300 dark:border-slate-700 hover:border-violet-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'
//             }`}
//           >
//             <div className={`absolute inset-0 bg-gradient-to-br from-violet-500/5 to-purple-500/5 transition-opacity duration-500 ${isDragging ? 'opacity-100' : 'opacity-0'}`} />
            
//             <FloatingParticles />
            
//             <div className={`relative z-10 p-5 rounded-2xl mb-4 transition-all duration-300 ${isDragging ? 'bg-violet-100 dark:bg-violet-900/30 scale-110' : 'bg-slate-100 dark:bg-slate-800'}`}>
//               <Upload size={32} className={`transition-colors duration-300 ${isDragging ? 'text-violet-500' : 'text-slate-400'}`} />
//             </div>
            
//             <p className={`relative z-10 text-base font-semibold mb-1 transition-colors duration-300 ${isDragging ? 'text-violet-600 dark:text-violet-400' : 'text-slate-600 dark:text-slate-400'}`}>
//               {isDragging ? 'Drop your image here!' : 'Click or drag to upload'}
//             </p>
//             <p className="relative z-10 text-sm text-slate-400">PNG, JPG, GIF up to 5MB</p>
            
//             <input
//               type="file"
//               accept="image/*"
//               onChange={onUpload}
//               className="hidden"
//             />
//           </label>
//         )}

//         <div className="flex-1 relative overflow-hidden p-6 bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-900/20 dark:to-purple-900/20 border border-violet-200 dark:border-violet-800/50 rounded-2xl">
//           <AnimatedGradient className="opacity-30" />
          
//           <div className="relative">
//             <div className="flex items-center gap-3 mb-4">
//               <div className="p-2.5 bg-gradient-to-br from-violet-500 to-purple-500 rounded-xl shadow-lg shadow-violet-500/25">
//                 <Wand2 size={18} className="text-white" />
//               </div>
//               <h4 className="text-base font-bold text-violet-900 dark:text-violet-100">
//                 Pro Tips for Great Thumbnails
//               </h4>
//             </div>
            
//             <ul className="space-y-3">
//               {[
//                 'Use high-quality images (1280×720 or higher)',
//                 'Keep important content centered',
//                 'Use vibrant, eye-catching colors',
//                 'Avoid cluttered or text-heavy designs'
//               ].map((tip, idx) => (
//                 <li key={idx} className="flex items-start gap-3 text-sm text-violet-700 dark:text-violet-300">
//                   <div className="mt-0.5 p-1 bg-violet-200 dark:bg-violet-800 rounded-full shrink-0">
//                     <Check size={10} className="text-violet-600 dark:text-violet-400" />
//                   </div>
//                   {tip}
//                 </li>
//               ))}
//             </ul>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// // --- PUBLISH TOGGLE ---
// const PublishToggle: React.FC<{
//   isPublished: boolean;
//   onChange: (value: boolean) => void;
// }> = ({ isPublished, onChange }) => {
//   return (
//     <div className={`relative overflow-hidden p-6 rounded-2xl border-2 transition-all duration-500 ${
//       isPublished 
//         ? 'bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 border-emerald-300 dark:border-emerald-700' 
//         : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700'
//     }`}>
//       {isPublished && (
//         <>
//           <div className="absolute -top-12 -right-12 w-32 h-32 bg-emerald-400/30 rounded-full blur-3xl animate-pulse" />
//           <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-teal-400/30 rounded-full blur-3xl animate-pulse delay-500" />
//         </>
//       )}
      
//       <label className="relative flex items-center justify-between cursor-pointer">
//         <div className="flex items-center gap-5">
//           <div className={`p-4 rounded-2xl transition-all duration-500 transform ${isPublished ? 'bg-gradient-to-br from-emerald-500 to-teal-500 scale-110 rotate-3' : 'bg-slate-300 dark:bg-slate-600'} shadow-lg`}>
//             {isPublished ? <Eye size={24} className="text-white" /> : <EyeOff size={24} className="text-white" />}
//           </div>
          
//           <div>
//             <div className="flex items-center gap-3">
//               <h4 className="text-lg font-bold text-slate-900 dark:text-white">
//                 {isPublished ? 'Course is Published' : 'Course is Draft'}
//               </h4>
//               {isPublished && (
//                 <span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold rounded-full animate-pulse">
//                   LIVE
//                 </span>
//               )}
//             </div>
//             <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
//               {isPublished 
//                 ? 'Students can now discover and enroll in your course' 
//                 : 'This course is hidden from students'}
//             </p>
//           </div>
//         </div>
        
//         <div className="relative">
//           <input
//             type="checkbox"
//             checked={isPublished}
//             onChange={(e) => onChange(e.target.checked)}
//             className="sr-only peer"
//           />
//           <div className="w-16 h-9 bg-slate-200 dark:bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-7 after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:rounded-full after:h-7 after:w-7 after:transition-all after:duration-300 after:shadow-lg peer-checked:bg-gradient-to-r peer-checked:from-emerald-500 peer-checked:to-teal-500"></div>
//         </div>
//       </label>
//     </div>
//   );
// };

// // --- MAIN COMPONENT ---
// export const BasicInfoSection: React.FC<BasicInfoSectionProps> = ({
//   course,
//   updateBasicInfo,
//   updateStats,
//   updateTags,
//   handlePhotoUpload,
//   removePhoto
// }) => {
//   // =====================================================
//   // VALIDATION ERRORS
//   // =====================================================
//   // REQUIRED FIELDS - These will show errors if empty
//   const titleError = !course.title.trim() ? 'Course title is required' : undefined;
//   const instructorError = !course.instructor_name?.trim() ? 'Instructor name is required' : undefined;
//   const departmentError = !course.department?.trim() ? 'Department is required' : undefined;
  
//   // =====================================================
//   // OPTIONAL FIELDS - No validation errors (can be empty)
//   // Description and Introduction are NOT required
//   // =====================================================
//   const descriptionError = undefined;  // OPTIONAL - No error even if empty
//   const introductionError = undefined; // OPTIONAL - No error even if empty

//   const levelOptions = [
//     { value: 'Beginner', label: '🌱 Beginner', color: 'emerald' },
//     { value: 'Intermediate', label: '🌿 Intermediate', color: 'blue' },
//     { value: 'Advanced', label: '🌳 Advanced', color: 'purple' }
//   ];

//   return (
//     <div className="space-y-8">
      
//       <SectionCard
//         title="Course Details"
//         subtitle="Essential information about your course"
//         icon={<BookOpen size={22} className="text-white" />}
//         iconBg="bg-gradient-to-br from-violet-500 to-purple-600"
//         glowColor="violet"
//       >
//         <div className="space-y-8">
//           <ImageUpload
//             imageUrl={course.photoUrl}
//             onUpload={handlePhotoUpload}
//             onRemove={removePhoto}
//           />

//           <div className="border-t border-slate-200 dark:border-slate-700 pt-8">
//             <InputField
//               label="Course Title"
//               icon={<BookOpen size={14} className="text-violet-500" />}
//               value={course.title === 'New Course' ? '' : course.title}
//               onChange={(v) => updateBasicInfo('title', v)}
//               placeholder="e.g., Complete React Development Masterclass"
//               required
//               maxLength={100}
//               error={titleError}
//               helpText="Choose a clear, descriptive title that highlights the value"
//             />
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <InputField
//               label="Instructor"
//               icon={<User size={14} className="text-blue-500" />}
//               value={course.instructor_name}
//               onChange={(v) => updateBasicInfo('instructor_name', v)}
//               placeholder="e.g., John Doe"
//               required
//               error={instructorError}
//             />

//             <InputField
//               label="Department"
//               icon={<Building2 size={14} className="text-teal-500" />}
//               value={course.department || ''}
//               onChange={(v) => updateBasicInfo('department', v)}
//               placeholder="e.g., IT, Sales, HR"
//               helpText="Categorize by department"
//               required
//               error={departmentError}
//             />

//             <SelectField
//               label="Difficulty Level"
//               icon={<GraduationCap size={14} className="text-amber-500" />}
//               value={course.level}
//               onChange={(v) => updateBasicInfo('level', v)}
//               options={levelOptions}
//               required
//             />

//             <InputField
//               label="Duration"
//               icon={<Clock size={14} className="text-rose-500" />}
//               value={course.duration}
//               onChange={(v) => updateBasicInfo('duration', v)}
//               placeholder="e.g., 10 hours"
//               helpText="Estimated time to complete"
//             />
//           </div>

//           {/* =====================================================
//               SHORT DESCRIPTION - OPTIONAL (not required)
//               ===================================================== */}
//           <TextareaField
//             label="Short Description"
//             icon={<Info size={14} className="text-sky-500" />}
//             value={course.description}
//             onChange={(v) => updateBasicInfo('description', v)}
//             placeholder="Brief overview of what students will learn... (Optional)"
//             rows={3}
//             maxLength={300}
//             helpText="This appears in course cards and search results (optional)"
//             error={descriptionError}
//             // NOTE: No required={true} - This field is OPTIONAL
//           />

//           {/* =====================================================
//               FULL INTRODUCTION - OPTIONAL (not required)
//               ===================================================== */}
//           <TextareaField
//             label="Full Introduction"
//             icon={<Sparkles size={14} className="text-amber-500" />}
//             value={course.introduction}
//             onChange={(v) => updateBasicInfo('introduction', v)}
//             placeholder="Detailed introduction including learning objectives, prerequisites, and what makes this course unique... (Optional)"
//             rows={5}
//             helpText="Shown on the course landing page. Be compelling! (optional)"
//             error={introductionError}
//             // NOTE: No required={true} - This field is OPTIONAL
//           />

//           <TagInput
//             tags={course.tags || []}
//             onChange={updateTags}
//           />
//         </div>
//       </SectionCard>

//       <SectionCard
//         title="Course Statistics"
//         subtitle="Track and display course metrics"
//         icon={<BarChart3 size={22} className="text-white" />}
//         iconBg="bg-gradient-to-br from-blue-500 to-cyan-600"
//         collapsible
//         defaultOpen={false}
//         badge="Optional"
//         glowColor="blue"
//       >
//         <div className="grid grid-cols-2 lg:grid-cols-5 gap-5">
//           <StatInputCard
//             icon={<Star size={20} className="text-white" />}
//             label="Rating"
//             value={course.stats.rating}
//             onChange={(v) => updateStats('rating', v as number)}
//             type="number"
//             min={0}
//             max={5}
//             step={0.1}
//             gradient="from-amber-400 to-orange-500"
//           />

//           <StatInputCard
//             icon={<Users size={20} className="text-white" />}
//             label="Enrolled"
//             value={course.stats.enrolled}
//             onChange={(v) => updateStats('enrolled', v as number)}
//             type="number"
//             min={0}
//             gradient="from-blue-500 to-cyan-500"
//           />

//           <StatInputCard
//             icon={<Target size={20} className="text-white" />}
//             label="Accuracy"
//             value={course.stats.accuracy}
//             onChange={(v) => updateStats('accuracy', v as number)}
//             type="number"
//             min={0}
//             max={100}
//             unit="%"
//             gradient="from-emerald-500 to-teal-500"
//           />

//           <StatInputCard
//             icon={<TrendingUp size={20} className="text-white" />}
//             label="Completion"
//             value={course.stats.completion}
//             onChange={(v) => updateStats('completion', v as number)}
//             type="number"
//             min={0}
//             max={100}
//             unit="%"
//             gradient="from-violet-500 to-purple-500"
//           />

//           <StatInputCard
//             icon={<Timer size={20} className="text-white" />}
//             label="Duration"
//             value={course.stats.duration}
//             onChange={(v) => updateStats('duration', v as string)}
//             type="text"
//             gradient="from-rose-500 to-pink-500"
//           />
//         </div>
        
//         <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/50 rounded-xl flex items-center gap-3">
//           <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
//             <Info size={16} className="text-blue-500" />
//           </div>
//           <p className="text-sm text-blue-700 dark:text-blue-300">
//             These statistics are displayed on the course page to help students make informed decisions.
//           </p>
//         </div>
//       </SectionCard>

//       <SectionCard
//         title="Publication Settings"
//         subtitle="Control course visibility"
//         icon={<Zap size={22} className="text-white" />}
//         iconBg="bg-gradient-to-br from-emerald-500 to-teal-600"
//         glowColor="emerald"
//       >
//         <PublishToggle
//           isPublished={course.is_published || false}
//           onChange={(v) => updateBasicInfo('is_published', v)}
//         />
        
//         <div className="mt-6 relative overflow-hidden p-5 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border border-amber-200 dark:border-amber-800/50 rounded-2xl">
//           <div className="absolute -right-8 -top-8 w-24 h-24 bg-amber-400/20 rounded-full blur-2xl" />
          
//           <div className="relative flex items-start gap-4">
//             <div className="p-3 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl shadow-lg shadow-amber-500/25 shrink-0">
//               <Shield size={20} className="text-white" />
//             </div>
//             <div>
//               <h4 className="text-base font-bold text-amber-900 dark:text-amber-200">Before Publishing</h4>
//               <p className="text-sm text-amber-700 dark:text-amber-300 mt-1 leading-relaxed">
//                 Make sure you've added all lessons and tests. Once published, students can enroll and access your course content immediately.
//               </p>
//             </div>
//           </div>
//         </div>
//       </SectionCard>
//     </div>
//   );
// };

// export default BasicInfoSection;
import React, { useState, useRef } from 'react';
import { 
  Upload, Info, Star, Users, TrendingUp, Clock, Building2,
  Check, AlertCircle, ChevronDown, Sparkles, Trash2,
  Eye, EyeOff, GraduationCap, Tag, Plus, BookOpen, User, Timer, Hash, Lightbulb, CheckCircle, XCircle, Camera,
  Wand2, Shield, Zap, BarChart3, Target,
  X
} from 'lucide-react';
import type { Course } from '../Utils/types';

interface BasicInfoSectionProps {
  course: Course;
  updateBasicInfo: (field: string, value: string | number | boolean) => void;
  updateStats: (field: keyof Course['stats'], value: number | string) => void;
  updateTags: (tags: string) => void;
  handlePhotoUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  removePhoto: () => void;
}

// --- ANIMATED GRADIENT BACKGROUND ---
const AnimatedGradient: React.FC<{ className?: string }> = ({ className }) => (
  <div className={`absolute inset-0 overflow-hidden ${className}`}>
    <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-violet-500/20 via-transparent to-transparent rounded-full blur-3xl animate-pulse" />
    <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-blue-500/20 via-transparent to-transparent rounded-full blur-3xl animate-pulse delay-1000" />
  </div>
);

// --- FLOATING PARTICLES ---
const FloatingParticles: React.FC = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {[...Array(6)].map((_, i) => (
      <div
        key={i}
        className="absolute w-2 h-2 bg-gradient-to-r from-violet-400 to-purple-400 rounded-full opacity-30"
        style={{
          top: `${Math.random() * 100}%`,
          left: `${Math.random() * 100}%`,
          animation: `float ${3 + Math.random() * 4}s ease-in-out infinite`,
          animationDelay: `${Math.random() * 2}s`
        }}
      />
    ))}
    <style>{`
      @keyframes float {
        0%, 100% { transform: translateY(0px) scale(1); opacity: 0.3; }
        50% { transform: translateY(-20px) scale(1.2); opacity: 0.6; }
      }
    `}</style>
  </div>
);

// --- SECTION CARD COMPONENT ---
const SectionCard: React.FC<{
  title: string;
  subtitle?: string;
  icon: React.ReactNode;
  iconBg: string;
  children: React.ReactNode;
  collapsible?: boolean;
  defaultOpen?: boolean;
  badge?: string;
  glowColor?: string;
}> = ({ title, subtitle, icon, iconBg, children, collapsible = false, defaultOpen = true, badge, glowColor = 'violet' }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [isHovered, setIsHovered] = useState(false);

  const glowStyles: Record<string, string> = {
    violet: 'hover:shadow-violet-500/10',
    blue: 'hover:shadow-blue-500/10',
    emerald: 'hover:shadow-emerald-500/10',
  };

  return (
    <div 
      className={`group relative bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-3xl border border-slate-200/60 dark:border-slate-700/60 overflow-hidden shadow-xl shadow-slate-200/50 dark:shadow-slate-900/50 hover:shadow-2xl ${glowStyles[glowColor]} transition-all duration-500`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-violet-500/0 via-violet-500/10 to-purple-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
      
      <div 
        className={`relative px-8 py-6 flex items-center justify-between ${collapsible ? 'cursor-pointer' : ''}`}
        onClick={() => collapsible && setIsOpen(!isOpen)}
      >
        <div className="absolute bottom-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-slate-200 dark:via-slate-700 to-transparent" />
        
        <div className="flex items-center gap-5">
          <div className="relative">
            <div className={`absolute inset-0 ${iconBg} blur-xl opacity-40 group-hover:opacity-60 transition-opacity duration-500`} />
            <div className={`relative p-4 rounded-2xl ${iconBg} shadow-lg transform group-hover:scale-105 transition-transform duration-300`}>
              {icon}
            </div>
          </div>
          
          <div>
            <div className="flex items-center gap-3">
              <h3 className="text-xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                {title}
              </h3>
              {badge && (
                <span className="px-3 py-1 text-[10px] font-bold bg-gradient-to-r from-violet-500/10 to-purple-500/10 dark:from-violet-500/20 dark:to-purple-500/20 text-violet-600 dark:text-violet-400 rounded-full border border-violet-200 dark:border-violet-800">
                  {badge}
                </span>
              )}
            </div>
            {subtitle && (
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{subtitle}</p>
            )}
          </div>
        </div>
        
        {collapsible && (
          <button className="p-3 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all duration-300 group/btn">
            <div className={`transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
              <ChevronDown size={20} className="text-slate-400 group-hover/btn:text-violet-500" />
            </div>
          </button>
        )}
      </div>
      
      <div className={`overflow-hidden transition-all duration-500 ease-out ${(!collapsible || isOpen) ? 'max-h-[5000px] opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="p-8 pt-6">
          {children}
        </div>
      </div>
    </div>
  );
};

// --- ENHANCED INPUT FIELD WITH RED BORDER FOR REQUIRED FIELDS ---
const InputField: React.FC<{
  label: string;
  icon?: React.ReactNode;
  value: string | number;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  required?: boolean;
  maxLength?: number;
  helpText?: string;
  error?: string;
  disabled?: boolean;
  showErrorBorder?: boolean; // NEW: Always show red border when error exists
}> = ({ label, icon, value, onChange, placeholder, type = 'text', required, maxLength, helpText, error, disabled, showErrorBorder = false }) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isTouched, setIsTouched] = useState(false);
  const charCount = typeof value === 'string' ? value.length : 0;
  const isOverLimit = maxLength && charCount > maxLength;
  const progress = maxLength ? (charCount / maxLength) * 100 : 0;

  // Show error border if:
  // 1. showErrorBorder is true and there's an error (for mandatory fields - always show)
  // 2. Field has been touched and there's an error
  const shouldShowError = (showErrorBorder && error) || (isTouched && error);

  return (
    <div className="space-y-3">
      <label className="flex items-center justify-between">
        <span className="flex items-center gap-2.5 text-sm font-semibold text-slate-700 dark:text-slate-300">
          <span className={`p-1.5 rounded-lg ${shouldShowError ? 'bg-rose-100 dark:bg-rose-900/30' : 'bg-slate-100 dark:bg-slate-800'}`}>
            {icon}
          </span>
          {label}
          {required && <span className="text-rose-500 animate-pulse">*</span>}
        </span>
        {maxLength && (
          <span className={`text-xs font-medium px-2 py-1 rounded-full ${
            isOverLimit 
              ? 'bg-rose-100 dark:bg-rose-900/30 text-rose-500' 
              : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
          }`}>
            {charCount}/{maxLength}
          </span>
        )}
      </label>
      
      <div className="relative group">
        {/* Glow effect - red for error, violet for focus */}
        <div className={`absolute -inset-1 rounded-2xl blur opacity-0 transition-opacity duration-300 ${
          shouldShowError 
            ? 'bg-gradient-to-r from-rose-500 to-red-500 opacity-20' 
            : isFocused 
              ? 'bg-gradient-to-r from-violet-500 to-purple-500 opacity-20' 
              : 'bg-gradient-to-r from-violet-500 to-purple-500 group-hover:opacity-10'
        }`} />
        
        <div className="relative">
          <input
            type={type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => { setIsFocused(false); setIsTouched(true); }}
            placeholder={placeholder}
            disabled={disabled}
            className={`w-full px-5 py-4 bg-slate-50/80 dark:bg-slate-800/80 backdrop-blur-sm border-2 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 transition-all duration-300 ${
              shouldShowError 
                ? 'border-rose-400 dark:border-rose-600 focus:border-rose-500 ring-2 ring-rose-100 dark:ring-rose-900/30' 
                : isFocused
                  ? 'border-violet-500 dark:border-violet-500'
                  : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
            } ${disabled ? 'opacity-50 cursor-not-allowed' : ''} focus:outline-none`}
          />
          
          <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
            {value && !shouldShowError && (
              <div className="p-1 bg-emerald-100 dark:bg-emerald-900/30 rounded-full">
                <CheckCircle size={14} className="text-emerald-500" />
              </div>
            )}
            {shouldShowError && (
              <div className="p-1 bg-rose-100 dark:bg-rose-900/30 rounded-full animate-shake">
                <XCircle size={14} className="text-rose-500" />
              </div>
            )}
          </div>
          
          {maxLength && isFocused && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all duration-300 ${isOverLimit ? 'bg-rose-500' : 'bg-gradient-to-r from-violet-500 to-purple-500'}`}
                style={{ width: `${Math.min(progress, 100)}%` }}
              />
            </div>
          )}
        </div>
      </div>
      
      {helpText && !shouldShowError && (
        <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2 pl-1">
          <div className="p-1 bg-blue-100 dark:bg-blue-900/30 rounded">
            <Info size={10} className="text-blue-500" />
          </div>
          {helpText}
        </div>
      )}
      {shouldShowError && (
        <div className="text-xs text-rose-500 flex items-center gap-2 pl-1 animate-slideIn">
          <div className="p-1 bg-rose-100 dark:bg-rose-900/30 rounded">
            <AlertCircle size={10} />
          </div>
          {error}
        </div>
      )}
      
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-2px); }
          75% { transform: translateX(2px); }
        }
        .animate-shake { animation: shake 0.3s ease-in-out; }
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(-5px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slideIn { animation: slideIn 0.2s ease-out; }
      `}</style>
    </div>
  );
};

// --- ENHANCED TEXTAREA ---
const TextareaField: React.FC<{
  label: string;
  icon?: React.ReactNode;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
  required?: boolean;
  maxLength?: number;
  helpText?: string;
  error?: string;
}> = ({ label, icon, value, onChange, placeholder, rows = 4, required, maxLength, helpText, error }) => {
  const [isFocused, setIsFocused] = useState(false);
  const charCount = value ? value.length : 0;
  const isOverLimit = maxLength && charCount > maxLength;
  const progress = maxLength ? (charCount / maxLength) * 100 : 0;

  return (
    <div className="space-y-3">
      <label className="flex items-center justify-between">
        <span className="flex items-center gap-2.5 text-sm font-semibold text-slate-700 dark:text-slate-300">
          <span className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800">
            {icon}
          </span>
          {label}
          {required && <span className="text-rose-500 animate-pulse">*</span>}
        </span>
        {maxLength && (
          <div className="flex items-center gap-3">
            <div className="w-24 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all duration-300 ${isOverLimit ? 'bg-rose-500' : 'bg-gradient-to-r from-violet-500 to-purple-500'}`}
                style={{ width: `${Math.min(progress, 100)}%` }}
              />
            </div>
            <span className={`text-xs font-medium ${isOverLimit ? 'text-rose-500' : 'text-slate-400'}`}>
              {charCount}/{maxLength}
            </span>
          </div>
        )}
      </label>
      
      <div className="relative group">
        <div className={`absolute -inset-1 bg-gradient-to-r from-violet-500 to-purple-500 rounded-2xl blur opacity-0 transition-opacity duration-300 ${isFocused ? 'opacity-20' : 'group-hover:opacity-10'}`} />
        
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          rows={rows}
          className={`relative w-full px-5 py-4 bg-slate-50/80 dark:bg-slate-800/80 backdrop-blur-sm border-2 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 transition-all duration-300 resize-none ${
            error
              ? 'border-rose-300 dark:border-rose-700 focus:border-rose-500'
              : isFocused
                ? 'border-violet-500'
                : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
          } focus:outline-none`}
        />
        
        {/* Status icons for Textarea */}
        <div className="absolute right-4 top-4 flex items-center gap-2">
            {value && !error && (
              <div className="p-1 bg-emerald-100 dark:bg-emerald-900/30 rounded-full">
                <CheckCircle size={14} className="text-emerald-500" />
              </div>
            )}
            {error && (
              <div className="p-1 bg-rose-100 dark:bg-rose-900/30 rounded-full animate-shake">
                <XCircle size={14} className="text-rose-500" />
              </div>
            )}
        </div>
      </div>
      
      {helpText && !error && (
        <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2 pl-1">
          <div className="p-1 bg-amber-100 dark:bg-amber-900/30 rounded">
            <Lightbulb size={10} className="text-amber-500" />
          </div>
          {helpText}
        </div>
      )}

      {error && (
        <div className="text-xs text-rose-500 flex items-center gap-2 pl-1 animate-slideIn">
          <div className="p-1 bg-rose-100 dark:bg-rose-900/30 rounded">
            <AlertCircle size={10} />
          </div>
          {error}
        </div>
      )}
    </div>
  );
};

// --- ENHANCED SELECT ---
const SelectField: React.FC<{
  label: string;
  icon?: React.ReactNode;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string; color?: string }[];
  required?: boolean;
}> = ({ label, icon, value, onChange, options, required }) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="space-y-3">
      <label className="flex items-center gap-2.5 text-sm font-semibold text-slate-700 dark:text-slate-300">
        <span className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800">
          {icon}
        </span>
        {label}
        {required && <span className="text-rose-500 animate-pulse">*</span>}
      </label>
      
      <div className="relative group">
        <div className={`absolute -inset-1 bg-gradient-to-r from-violet-500 to-purple-500 rounded-2xl blur opacity-0 transition-opacity duration-300 ${isFocused ? 'opacity-20' : 'group-hover:opacity-10'}`} />
        
        <div className="relative">
          <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onFocus={() => { setIsFocused(true); setIsOpen(true); }}
            onBlur={() => { setIsFocused(false); setIsOpen(false); }}
            className={`w-full px-5 py-4 bg-slate-50/80 dark:bg-slate-800/80 backdrop-blur-sm border-2 rounded-xl text-slate-900 dark:text-white transition-all duration-300 cursor-pointer appearance-none ${
              isFocused
                ? 'border-violet-500'
                : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
            } focus:outline-none`}
          >
            {options.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          
          <div className={`absolute right-4 top-1/2 -translate-y-1/2 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
            <ChevronDown size={18} className="text-slate-400" />
          </div>
        </div>
      </div>
    </div>
  );
};

// --- ENHANCED TAG INPUT ---
const TagInput: React.FC<{
  tags: string[];
  onChange: (tags: string) => void;
}> = ({ tags, onChange }) => {
  const [input, setInput] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const addTag = () => {
    if (input.trim() && !tags.includes(input.trim())) {
      const newTags = [...tags, input.trim()];
      onChange(newTags.join(', '));
      setInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    const newTags = tags.filter(tag => tag !== tagToRemove);
    onChange(newTags.join(', '));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag();
    }
    if (e.key === 'Backspace' && !input && tags.length > 0) {
      removeTag(tags[tags.length - 1]);
    }
  };

  const tagColors = [
    'from-violet-500 to-purple-500',
    'from-blue-500 to-cyan-500',
    'from-emerald-500 to-teal-500',
    'from-amber-500 to-orange-500',
    'from-rose-500 to-pink-500',
    'from-indigo-500 to-violet-500',
  ];

  return (
    <div className="space-y-3">
      <label className="flex items-center gap-2.5 text-sm font-semibold text-slate-700 dark:text-slate-300">
        <span className="p-1.5 rounded-lg bg-gradient-to-r from-violet-500/20 to-purple-500/20">
          <Tag size={16} className="text-violet-500" />
        </span>
        Tags
        <span className="ml-2 px-2.5 py-0.5 text-xs font-medium bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400 rounded-full">
          {tags.filter(t => t.trim()).length} tags
        </span>
      </label>
      
      <div className="relative group">
        <div className={`absolute -inset-1 bg-gradient-to-r from-violet-500 to-purple-500 rounded-2xl blur opacity-0 transition-opacity duration-300 ${isFocused ? 'opacity-20' : 'group-hover:opacity-10'}`} />
        
        <div 
          className={`relative min-h-[140px] p-5 bg-slate-50/80 dark:bg-slate-800/80 backdrop-blur-sm border-2 rounded-xl transition-all duration-300 cursor-text ${
            isFocused
              ? 'border-violet-500'
              : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
          }`}
          onClick={() => inputRef.current?.focus()}
        >
          {/* Tags display */}
          <div className="flex flex-wrap gap-2.5 mb-4">
            {tags.filter(t => t.trim()).map((tag, idx) => (
              <span
                key={idx}
                className="group/tag relative flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white shadow-lg transform hover:scale-105 transition-all duration-200"
                style={{
                  background: `linear-gradient(135deg, var(--tw-gradient-stops))`,
                }}
              >
                <div className={`absolute inset-0 bg-gradient-to-r ${tagColors[idx % tagColors.length]} rounded-xl`} />
                <span className="relative flex items-center gap-2">
                  <Hash size={12} className="opacity-70" />
                  {tag}
                  <button
                    onClick={(e) => { e.stopPropagation(); removeTag(tag); }}
                    className="p-0.5 hover:bg-white/20 rounded-full transition-colors"
                  >
                    <X size={12} />
                  </button>
                </span>
              </span>
            ))}
          </div>
          
          {/* Input */}
          <div className="flex items-center gap-3 border-t border-slate-200 dark:border-slate-700 pt-4">
            <Plus size={16} className="text-slate-400" />
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder={tags.length === 0 ? "Type a tag and press Enter..." : "Add another tag..."}
              className="flex-1 bg-transparent text-slate-900 dark:text-white placeholder-slate-400 outline-none text-sm"
            />
            {input.trim() && (
              <button
                onClick={addTag}
                className="px-4 py-2 bg-gradient-to-r from-violet-500 to-purple-500 text-white text-sm font-medium rounded-lg hover:opacity-90 transition-all duration-200 flex items-center gap-2 shadow-lg shadow-violet-500/25"
              >
                <Plus size={14} />
                Add
              </button>
            )}
          </div>
        </div>
      </div>
      
      <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2 pl-1">
        <div className="p-1 bg-blue-100 dark:bg-blue-900/30 rounded">
          <Info size={10} className="text-blue-500" />
        </div>
        Press Enter or comma to add a tag. Click × to remove.
      </div>
    </div>
  );
};

// --- STAT INPUT CARD ---
const StatInputCard: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: number | string;
  onChange: (value: number | string) => void;
  type?: 'number' | 'text';
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  gradient: string;
}> = ({ icon, label, value, onChange, type = 'number', min, max, step, unit, gradient }) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className="relative overflow-hidden bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-2xl border-2 border-slate-200 dark:border-slate-700 p-6 group hover:border-transparent transition-all duration-500"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 ${isHovered ? 'opacity-100' : ''} transition-opacity duration-500`} style={{ padding: '2px' }}>
        <div className="absolute inset-0.5 bg-white dark:bg-slate-900 rounded-2xl" />
      </div>
      
      <div className={`absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-br ${gradient} opacity-20 rounded-full blur-2xl group-hover:scale-150 group-hover:opacity-30 transition-all duration-700`} />
      
      <div className="relative">
        <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${gradient} mb-4 shadow-lg transform group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300`}>
          {icon}
        </div>
        
        <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">
          {label}
        </p>
        
        <div className="flex items-end gap-2">
          <input
            type={type}
            value={value}
            onChange={(e) => onChange(type === 'number' ? parseFloat(e.target.value) || 0 : e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            min={min}
            max={max}
            step={step}
            className={`w-full bg-transparent text-3xl font-bold bg-gradient-to-r ${gradient} bg-clip-text text-transparent focus:outline-none`}
          />
          {unit && (
            <span className="text-lg font-medium text-slate-400 mb-1">{unit}</span>
          )}
        </div>
      </div>
    </div>
  );
};

// --- IMAGE UPLOAD ---
const ImageUpload: React.FC<{
  imageUrl?: string;
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemove: () => void;
}> = ({ imageUrl, onUpload, onRemove }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

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
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const fakeEvent = { target: { files } } as React.ChangeEvent<HTMLInputElement>;
      onUpload(fakeEvent);
    }
  };

  return (
    <div className="space-y-4">
      <label className="flex items-center gap-2.5 text-sm font-semibold text-slate-700 dark:text-slate-300">
        <span className="p-1.5 rounded-lg bg-gradient-to-r from-rose-500/20 to-pink-500/20">
          <Camera size={16} className="text-rose-500" />
        </span>
        Course Thumbnail
        <span className="text-xs font-normal text-slate-400 ml-2">(Recommended: 1280×720)</span>
      </label>

      <div className="flex flex-col lg:flex-row gap-6">
        {imageUrl ? (
          <div 
            className="relative group w-full lg:w-96 h-56 rounded-2xl overflow-hidden shadow-2xl shadow-slate-900/20"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <img
              src={imageUrl}
              alt="Course preview"
              className={`w-full h-full object-cover transition-transform duration-700 ${isHovered ? 'scale-110' : 'scale-100'}`}
            />
            
            <div className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`} />
            
            <div className={`absolute inset-0 flex flex-col items-center justify-center gap-4 transition-all duration-300 ${isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <label className="px-6 py-3 bg-white/90 backdrop-blur-sm text-slate-900 font-semibold rounded-xl cursor-pointer hover:bg-white transition-colors flex items-center gap-2 shadow-xl">
                <Camera size={18} />
                Replace Image
                <input
                  type="file"
                  accept="image/*"
                  onChange={onUpload}
                  className="hidden"
                />
              </label>
              
              <button
                onClick={onRemove}
                className="px-6 py-3 bg-rose-500/90 backdrop-blur-sm text-white font-semibold rounded-xl hover:bg-rose-600 transition-colors flex items-center gap-2 shadow-xl"
              >
                <Trash2 size={18} />
                Remove
              </button>
            </div>
            
            <div className={`absolute top-4 left-4 px-3 py-1.5 bg-emerald-500/90 backdrop-blur-sm text-white text-xs font-bold rounded-lg flex items-center gap-1.5 shadow-lg transition-all duration-300 ${isHovered ? 'opacity-0 -translate-y-2' : 'opacity-100'}`}>
              <CheckCircle size={12} />
              Uploaded
            </div>
          </div>
        ) : (
          <label
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`relative w-full lg:w-96 h-56 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all duration-500 overflow-hidden ${
              isDragging
                ? 'border-violet-500 bg-violet-50 dark:bg-violet-900/20 scale-[1.02]'
                : 'border-slate-300 dark:border-slate-700 hover:border-violet-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'
            }`}
          >
            <div className={`absolute inset-0 bg-gradient-to-br from-violet-500/5 to-purple-500/5 transition-opacity duration-500 ${isDragging ? 'opacity-100' : 'opacity-0'}`} />
            
            <FloatingParticles />
            
            <div className={`relative z-10 p-5 rounded-2xl mb-4 transition-all duration-300 ${isDragging ? 'bg-violet-100 dark:bg-violet-900/30 scale-110' : 'bg-slate-100 dark:bg-slate-800'}`}>
              <Upload size={32} className={`transition-colors duration-300 ${isDragging ? 'text-violet-500' : 'text-slate-400'}`} />
            </div>
            
            <p className={`relative z-10 text-base font-semibold mb-1 transition-colors duration-300 ${isDragging ? 'text-violet-600 dark:text-violet-400' : 'text-slate-600 dark:text-slate-400'}`}>
              {isDragging ? 'Drop your image here!' : 'Click or drag to upload'}
            </p>
            <p className="relative z-10 text-sm text-slate-400">PNG, JPG, GIF up to 5MB</p>
            
            <input
              type="file"
              accept="image/*"
              onChange={onUpload}
              className="hidden"
            />
          </label>
        )}

        <div className="flex-1 relative overflow-hidden p-6 bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-900/20 dark:to-purple-900/20 border border-violet-200 dark:border-violet-800/50 rounded-2xl">
          <AnimatedGradient className="opacity-30" />
          
          <div className="relative">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 bg-gradient-to-br from-violet-500 to-purple-500 rounded-xl shadow-lg shadow-violet-500/25">
                <Wand2 size={18} className="text-white" />
              </div>
              <h4 className="text-base font-bold text-violet-900 dark:text-violet-100">
                Pro Tips for Great Thumbnails
              </h4>
            </div>
            
            <ul className="space-y-3">
              {[
                'Use high-quality images (1280×720 or higher)',
                'Keep important content centered',
                'Use vibrant, eye-catching colors',
                'Avoid cluttered or text-heavy designs'
              ].map((tip, idx) => (
                <li key={idx} className="flex items-start gap-3 text-sm text-violet-700 dark:text-violet-300">
                  <div className="mt-0.5 p-1 bg-violet-200 dark:bg-violet-800 rounded-full shrink-0">
                    <Check size={10} className="text-violet-600 dark:text-violet-400" />
                  </div>
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- PUBLISH TOGGLE ---
const PublishToggle: React.FC<{
  isPublished: boolean;
  onChange: (value: boolean) => void;
}> = ({ isPublished, onChange }) => {
  return (
    <div className={`relative overflow-hidden p-6 rounded-2xl border-2 transition-all duration-500 ${
      isPublished 
        ? 'bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 border-emerald-300 dark:border-emerald-700' 
        : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700'
    }`}>
      {isPublished && (
        <>
          <div className="absolute -top-12 -right-12 w-32 h-32 bg-emerald-400/30 rounded-full blur-3xl animate-pulse" />
          <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-teal-400/30 rounded-full blur-3xl animate-pulse delay-500" />
        </>
      )}
      
      <label className="relative flex items-center justify-between cursor-pointer">
        <div className="flex items-center gap-5">
          <div className={`p-4 rounded-2xl transition-all duration-500 transform ${isPublished ? 'bg-gradient-to-br from-emerald-500 to-teal-500 scale-110 rotate-3' : 'bg-slate-300 dark:bg-slate-600'} shadow-lg`}>
            {isPublished ? <Eye size={24} className="text-white" /> : <EyeOff size={24} className="text-white" />}
          </div>
          
          <div>
            <div className="flex items-center gap-3">
              <h4 className="text-lg font-bold text-slate-900 dark:text-white">
                {isPublished ? 'Course is Published' : 'Course is Draft'}
              </h4>
              {isPublished && (
                <span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold rounded-full animate-pulse">
                  LIVE
                </span>
              )}
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              {isPublished 
                ? 'Students can now discover and enroll in your course' 
                : 'This course is hidden from students'}
            </p>
          </div>
        </div>
        
        <div className="relative">
          <input
            type="checkbox"
            checked={isPublished}
            onChange={(e) => onChange(e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-16 h-9 bg-slate-200 dark:bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-7 after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:rounded-full after:h-7 after:w-7 after:transition-all after:duration-300 after:shadow-lg peer-checked:bg-gradient-to-r peer-checked:from-emerald-500 peer-checked:to-teal-500"></div>
        </div>
      </label>
    </div>
  );
};

// --- MAIN COMPONENT ---
export const BasicInfoSection: React.FC<BasicInfoSectionProps> = ({
  course,
  updateBasicInfo,
  updateStats,
  updateTags,
  handlePhotoUpload,
  removePhoto
}) => {
  // =====================================================
  // VALIDATION ERRORS
  // =====================================================
  
  // REQUIRED FIELD - Course Title (shows red border if empty or default "New Course")
  const isTitleEmpty = !course.title.trim() || course.title === 'New Course';
  const titleError = isTitleEmpty ? 'Course title is required' : undefined;
  
  // REQUIRED FIELDS - Instructor and Department
  const instructorError = !course.instructor_name?.trim() ? 'Instructor name is required' : undefined;
  const departmentError = !course.department?.trim() ? 'Department is required' : undefined;
  
  // OPTIONAL FIELDS - No validation errors (can be empty)
  const descriptionError = undefined;
  const introductionError = undefined;

  const levelOptions = [
    { value: 'Beginner', label: '🌱 Beginner', color: 'emerald' },
    { value: 'Intermediate', label: '🌿 Intermediate', color: 'blue' },
    { value: 'Advanced', label: '🌳 Advanced', color: 'purple' }
  ];

  return (
    <div className="space-y-8">
      
      <SectionCard
        title="Course Details"
        subtitle="Essential information about your course"
        icon={<BookOpen size={22} className="text-white" />}
        iconBg="bg-gradient-to-br from-violet-500 to-purple-600"
        glowColor="violet"
      >
        <div className="space-y-8">
          <ImageUpload
            imageUrl={course.photoUrl}
            onUpload={handlePhotoUpload}
            onRemove={removePhoto}
          />

          <div className="border-t border-slate-200 dark:border-slate-700 pt-8">
            {/* =====================================================
                COURSE TITLE - MANDATORY with RED BORDER when empty
                ===================================================== */}
            <InputField
              label="Course Title"
              icon={<BookOpen size={14} className={titleError ? "text-rose-500" : "text-violet-500"} />}
              value={course.title === 'New Course' ? '' : course.title}
              onChange={(v) => updateBasicInfo('title', v)}
              placeholder="e.g., Complete React Development Masterclass"
              required
              maxLength={100}
              error={titleError}
              showErrorBorder={true} // NEW: Always show red border when there's an error
              helpText="Choose a clear, descriptive title that highlights the value"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField
              label="Instructor"
              icon={<User size={14} className="text-blue-500" />}
              value={course.instructor_name}
              onChange={(v) => updateBasicInfo('instructor_name', v)}
              placeholder="e.g., John Doe"
              required
              error={instructorError}
            />

            <InputField
              label="Department"
              icon={<Building2 size={14} className="text-teal-500" />}
              value={course.department || ''}
              onChange={(v) => updateBasicInfo('department', v)}
              placeholder="e.g., IT, Sales, HR"
              helpText="Categorize by department"
              required
              error={departmentError}
            />

            <SelectField
              label="Difficulty Level"
              icon={<GraduationCap size={14} className="text-amber-500" />}
              value={course.level}
              onChange={(v) => updateBasicInfo('level', v)}
              options={levelOptions}
              required
            />

            <InputField
              label="Duration"
              icon={<Clock size={14} className="text-rose-500" />}
              value={course.duration}
              onChange={(v) => updateBasicInfo('duration', v)}
              placeholder="e.g., 10 hours"
              helpText="Estimated time to complete"
            />
          </div>

          {/* =====================================================
              SHORT DESCRIPTION - OPTIONAL (not required)
              ===================================================== */}
          <TextareaField
            label="Short Description"
            icon={<Info size={14} className="text-sky-500" />}
            value={course.description}
            onChange={(v) => updateBasicInfo('description', v)}
            placeholder="Brief overview of what students will learn... (Optional)"
            rows={3}
            maxLength={300}
            helpText="This appears in course cards and search results (optional)"
            error={descriptionError}
          />

          {/* =====================================================
              FULL INTRODUCTION - OPTIONAL (not required)
              ===================================================== */}
          <TextareaField
            label="Full Introduction"
            icon={<Sparkles size={14} className="text-amber-500" />}
            value={course.introduction}
            onChange={(v) => updateBasicInfo('introduction', v)}
            placeholder="Detailed introduction including learning objectives, prerequisites, and what makes this course unique... (Optional)"
            rows={5}
            helpText="Shown on the course landing page. Be compelling! (optional)"
            error={introductionError}
          />

          <TagInput
            tags={course.tags || []}
            onChange={updateTags}
          />
        </div>
      </SectionCard>

      <SectionCard
        title="Course Statistics"
        subtitle="Track and display course metrics"
        icon={<BarChart3 size={22} className="text-white" />}
        iconBg="bg-gradient-to-br from-blue-500 to-cyan-600"
        collapsible
        defaultOpen={false}
        badge="Optional"
        glowColor="blue"
      >
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-5">
          <StatInputCard
            icon={<Star size={20} className="text-white" />}
            label="Rating"
            value={course.stats.rating}
            onChange={(v) => updateStats('rating', v as number)}
            type="number"
            min={0}
            max={5}
            step={0.1}
            gradient="from-amber-400 to-orange-500"
          />

          <StatInputCard
            icon={<Users size={20} className="text-white" />}
            label="Enrolled"
            value={course.stats.enrolled}
            onChange={(v) => updateStats('enrolled', v as number)}
            type="number"
            min={0}
            gradient="from-blue-500 to-cyan-500"
          />

          <StatInputCard
            icon={<Target size={20} className="text-white" />}
            label="Accuracy"
            value={course.stats.accuracy}
            onChange={(v) => updateStats('accuracy', v as number)}
            type="number"
            min={0}
            max={100}
            unit="%"
            gradient="from-emerald-500 to-teal-500"
          />

          <StatInputCard
            icon={<TrendingUp size={20} className="text-white" />}
            label="Completion"
            value={course.stats.completion}
            onChange={(v) => updateStats('completion', v as number)}
            type="number"
            min={0}
            max={100}
            unit="%"
            gradient="from-violet-500 to-purple-500"
          />

          <StatInputCard
            icon={<Timer size={20} className="text-white" />}
            label="Duration"
            value={course.stats.duration}
            onChange={(v) => updateStats('duration', v as string)}
            type="text"
            gradient="from-rose-500 to-pink-500"
          />
        </div>
        
        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/50 rounded-xl flex items-center gap-3">
          <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
            <Info size={16} className="text-blue-500" />
          </div>
          <p className="text-sm text-blue-700 dark:text-blue-300">
            These statistics are displayed on the course page to help students make informed decisions.
          </p>
        </div>
      </SectionCard>

      <SectionCard
        title="Publication Settings"
        subtitle="Control course visibility"
        icon={<Zap size={22} className="text-white" />}
        iconBg="bg-gradient-to-br from-emerald-500 to-teal-600"
        glowColor="emerald"
      >
        <PublishToggle
          isPublished={course.is_published || false}
          onChange={(v) => updateBasicInfo('is_published', v)}
        />
        
        <div className="mt-6 relative overflow-hidden p-5 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border border-amber-200 dark:border-amber-800/50 rounded-2xl">
          <div className="absolute -right-8 -top-8 w-24 h-24 bg-amber-400/20 rounded-full blur-2xl" />
          
          <div className="relative flex items-start gap-4">
            <div className="p-3 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl shadow-lg shadow-amber-500/25 shrink-0">
              <Shield size={20} className="text-white" />
            </div>
            <div>
              <h4 className="text-base font-bold text-amber-900 dark:text-amber-200">Before Publishing</h4>
              <p className="text-sm text-amber-700 dark:text-amber-300 mt-1 leading-relaxed">
                Make sure you've added all lessons and tests. Once published, students can enroll and access your course content immediately.
              </p>
            </div>
          </div>
        </div>
      </SectionCard>
    </div>
  );
};

export default BasicInfoSection;