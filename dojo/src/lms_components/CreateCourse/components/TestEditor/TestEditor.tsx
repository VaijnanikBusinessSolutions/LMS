



// import React, { useRef } from 'react';
// import { 
//   Edit3, Trash2, Save, X, Plus, Check, ClipboardList, 
//   FileUp, Download, Clock, Percent, AlertCircle 
// } from 'lucide-react';
// import type { Test as SharedTest, MCQQuestion, MCQOption } from '../Utils/types';

// interface TestEditorProps {
//   test: SharedTest;
//   editingTest: number | null;
//   onEdit: (testId: number) => void;
//   onSave: (testId: number) => void;
//   onCancel: (testId: number) => void;
//   onDelete: (testId: number) => void;
//   onUpdateTest: (payload: Partial<SharedTest>) => void;
//   onUpdateQuestion: (questionId: string | number, field: 'question_text' | 'options', value: any) => void;
// }

// export const TestEditor: React.FC<TestEditorProps> = ({
//   test,
//   editingTest,
//   onEdit,
//   onSave,
//   onCancel,
//   onDelete,
//   onUpdateTest,
//   onUpdateQuestion
// }) => {
//   const isEditing = editingTest === test.id;
//   const fileInputRef = useRef<HTMLInputElement>(null);

//   // Handlers (kept same as before)
//   const handleDownloadTemplate = () => {
//     window.location.href = `http://localhost:8000/lms/courses/download-test-template/`;
//   };

//   const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (!file) return;
//     const formData = new FormData();
//     formData.append('file', file);
//     try {
//       const response = await fetch(`http://localhost:8000/lms/courses/parse-questions-excel/`, {
//         method: 'POST',
//         body: formData,
//       });
//       const data = await response.json();
//       if (data.questions) {
//         onUpdateTest({ questions: [...(test.questions || []), ...data.questions] });
//         alert(`Successfully added ${data.questions.length} questions!`);
//       } else if (data.error) {
//         alert("Error: " + data.error);
//       }
//     } catch (error) {
//       console.error("Error uploading excel:", error);
//       alert("Failed to parse Excel file.");
//     } finally {
//       if (fileInputRef.current) fileInputRef.current.value = '';
//     }
//   };

//   const addQuestion = () => {
//     const newQ: MCQQuestion = {
//       id: `q-${Date.now()}`,
//       question: '',
//       question_text: '',
//       options: [
//         { id: `o-${Date.now()}-1`, text: '', isCorrect: false } as MCQOption,
//         { id: `o-${Date.now()}-2`, text: '', isCorrect: false } as MCQOption
//       ],
//       order: (test.questions?.length || 0) + 1
//     };
//     onUpdateTest({ questions: [...(test.questions || []), newQ] });
//   };

//   const removeQuestion = (qid: string | number) => {
//     onUpdateTest({ questions: (test.questions || []).filter(q => q.id !== qid) });
//   };

//   const updateQuestionText = (qid: string | number, text: string) => {
//     const qs = (test.questions || []).map((q: MCQQuestion) =>
//       (String(q.id) === String(qid)) ? { ...q, question_text: text, question: text } : q
//     );
//     onUpdateTest({ questions: qs });
//     onUpdateQuestion(qid, 'question_text', text);
//   };

//   const addOption = (qid: string | number) => {
//     const qs = (test.questions || []).map((q: MCQQuestion) => {
//       if (String(q.id) !== String(qid)) return q;
//       const nextId = `o-${Date.now()}`;
//       return { ...q, options: [...q.options, { id: nextId, text: '', isCorrect: false } as MCQOption] };
//     });
//     onUpdateTest({ questions: qs });
//     onUpdateQuestion(qid, 'options', qs.find(q => String(q.id) === String(qid))?.options);
//   };

//   const removeOption = (qid: string | number, oid: string | number) => {
//     const qs = (test.questions || []).map((q: MCQQuestion) =>
//       String(q.id) === String(qid) ? { ...q, options: q.options.filter(o => String(o.id) !== String(oid)) } : q
//     );
//     onUpdateTest({ questions: qs });
//     onUpdateQuestion(qid, 'options', qs.find(q => String(q.id) === String(qid))?.options);
//   };

//   const updateOptionText = (qid: string | number, oid: string | number, text: string) => {
//     const qs = (test.questions || []).map((q: MCQQuestion) =>
//       String(q.id) === String(qid) ? {
//         ...q,
//         options: q.options.map(o => String(o.id) === String(oid) ? { ...o, text } : o)
//       } : q
//     );
//     onUpdateTest({ questions: qs });
//     onUpdateQuestion(qid, 'options', qs.find(q => String(q.id) === String(qid))?.options);
//   };

//   const toggleCorrectOption = (qid: string | number, oid: string | number) => {
//     const qs = (test.questions || []).map((q: MCQQuestion) =>
//       String(q.id) === String(qid) ? {
//         ...q,
//         options: q.options.map(o => ({
//           ...(o as any),
//           is_correct: String(o.id) === String(oid),
//           isCorrect: String(o.id) === String(oid)
//         }))
//       } : q
//     );
//     onUpdateTest({ questions: qs });
//     onUpdateQuestion(qid, 'options', qs.find(q => String(q.id) === String(qid))?.options);
//   };

//   return (
//     <div className="flex flex-col h-full bg-white dark:bg-slate-900">
      
//       {/* 1. Header (Sticky) */}
//       <div className="shrink-0 px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 z-10">
//         <div className="flex justify-between items-start gap-6">
//           <div className="flex-1">
//             {isEditing ? (
//               <div className="space-y-4">
//                 <input
//                   type="text"
//                   value={test.title}
//                   onChange={(e) => onUpdateTest({ title: e.target.value })}
//                   className="text-xl font-bold w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-violet-500 outline-none transition-all"
//                   placeholder="Test title..."
//                 />
//                 <div className="flex gap-4">
//                   <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800 p-1.5 rounded-lg border border-slate-200 dark:border-slate-700">
//                     <Percent size={14} className="ml-2 text-slate-400" />
//                     <input
//                       type="number"
//                       min="0"
//                       max="100"
//                       value={test.passing_criteria ?? ''}
//                       onChange={(e) => onUpdateTest({ passing_criteria: Number(e.target.value) })}
//                       placeholder="Pass %"
//                       className="bg-transparent w-20 text-sm font-medium outline-none"
//                     />
//                   </div>
//                   <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800 p-1.5 rounded-lg border border-slate-200 dark:border-slate-700">
//                     <Clock size={14} className="ml-2 text-slate-400" />
//                     <input
//                       type="number"
//                       min="1"
//                       value={test.total_time ?? ''}
//                       onChange={(e) => onUpdateTest({ total_time: Number(e.target.value) })}
//                       placeholder="Mins"
//                       className="bg-transparent w-20 text-sm font-medium outline-none"
//                     />
//                   </div>
//                 </div>
//               </div>
//             ) : (
//               <div>
//                 <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">{test.title || 'Untitled Test'}</h3>
//                 <div className="flex items-center gap-3 text-sm">
//                   <span className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wide">
//                     {(test.questions?.length ?? 0)} Questions
//                   </span>
//                   {test.passing_criteria && (
//                     <span className="flex items-center gap-1.5 text-slate-500">
//                       <Percent size={14} /> {test.passing_criteria}% Passing
//                     </span>
//                   )}
//                   {test.total_time && (
//                     <span className="flex items-center gap-1.5 text-slate-500">
//                       <Clock size={14} /> {test.total_time}m Limit
//                     </span>
//                   )}
//                 </div>
//               </div>
//             )}
//           </div>

//           <div className="flex gap-2">
//             {isEditing ? (
//               <>
//                 <button onClick={() => onSave(test.id)} className="bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-medium transition-colors">
//                   <Save size={16} /> Save
//                 </button>
//                 <button onClick={() => onCancel(test.id)} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 text-slate-700 dark:text-slate-300 px-4 py-2 rounded-lg flex items-center gap-2 font-medium transition-colors">
//                   <X size={16} /> Cancel
//                 </button>
//               </>
//             ) : (
//               <>
//                 <button onClick={() => onEdit(test.id)} className="text-slate-500 hover:text-violet-600 hover:bg-violet-50 dark:hover:bg-violet-900/20 px-3 py-2 rounded-lg flex items-center gap-2 transition-colors">
//                   <Edit3 size={18} /> Edit
//                 </button>
//                 <button onClick={() => onDelete(test.id)} className="text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20 px-3 py-2 rounded-lg flex items-center gap-2 transition-colors">
//                   <Trash2 size={18} />
//                 </button>
//               </>
//             )}
//           </div>
//         </div>
        
//         {/* Bulk Upload Actions (Only visible in edit mode) */}
//         {isEditing && (
//           <div className="mt-4 flex gap-2 pt-4 border-t border-slate-100 dark:border-slate-800">
//             <button onClick={handleDownloadTemplate} className="text-xs font-semibold text-slate-600 hover:text-violet-600 flex items-center gap-2 bg-slate-100 hover:bg-slate-200 px-3 py-2 rounded-lg transition-colors">
//               <Download size={14} /> Template
//             </button>
//             <button onClick={() => fileInputRef.current?.click()} className="text-xs font-semibold text-slate-600 hover:text-violet-600 flex items-center gap-2 bg-slate-100 hover:bg-slate-200 px-3 py-2 rounded-lg transition-colors">
//               <FileUp size={14} /> Import Excel
//             </button>
//             <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept=".xlsx" className="hidden" />
//           </div>
//         )}
//       </div>

//       {/* 2. Questions List (Scrollable) */}
//       <div className="flex-1 overflow-y-auto bg-slate-50 dark:bg-slate-950/50 p-6">
//         <div className="max-w-4xl mx-auto">
          
//           {(!test.questions || test.questions.length === 0) && isEditing && (
//             <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 text-slate-400">
//               <ClipboardList size={40} className="mb-4 text-slate-300" />
//               <p className="font-medium mb-1">No questions added yet</p>
//               <p className="text-sm mb-6">Create questions manually or import from Excel</p>
//               <button onClick={addQuestion} className="bg-violet-600 text-white px-5 py-2.5 rounded-lg font-bold flex items-center gap-2 hover:bg-violet-700 transition-colors">
//                 <Plus size={18} /> Create First Question
//               </button>
//             </div>
//           )}

//           <div className="space-y-4">
//             {(test.questions || []).map((q: MCQQuestion, idx) => (
//               <div key={q.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm hover:border-violet-200 transition-all group">
//                 <div className="flex gap-4">
//                   <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 font-bold flex items-center justify-center text-sm">
//                     {idx + 1}
//                   </span>
                  
//                   <div className="flex-1 space-y-4">
//                     {/* Question Input */}
//                     <input
//                       type="text"
//                       value={q.question_text ?? q.question ?? ''}
//                       onChange={(e) => updateQuestionText(q.id, e.target.value)}
//                       placeholder="Enter question text here..."
//                       className="w-full bg-transparent border-b border-transparent focus:border-violet-200 pb-1 text-base font-semibold text-slate-800 dark:text-slate-200 outline-none transition-colors"
//                       disabled={!isEditing}
//                     />

//                     {/* Options Grid */}
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
//                       {(q.options || []).map((opt, optIdx) => (
//                         <div 
//                           key={opt.id} 
//                           className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${
//                             (opt as any).is_correct || (opt as any).isCorrect
//                               ? 'bg-emerald-50/50 border-emerald-200 dark:border-emerald-900/30'
//                               : 'bg-slate-50 dark:bg-slate-800/50 border-transparent hover:border-slate-200'
//                           }`}
//                         >
//                           <button
//                             onClick={() => isEditing && toggleCorrectOption(q.id, opt.id)}
//                             disabled={!isEditing}
//                             className={`w-5 h-5 rounded-full flex items-center justify-center border transition-all ${
//                               (opt as any).is_correct || (opt as any).isCorrect
//                                 ? 'bg-emerald-500 border-emerald-500 text-white'
//                                 : 'bg-white border-slate-300 text-transparent hover:border-emerald-400'
//                             }`}
//                           >
//                             <Check size={12} strokeWidth={3} />
//                           </button>
                          
//                           <input
//                             type="text"
//                             value={opt.text}
//                             onChange={(e) => updateOptionText(q.id, opt.id, e.target.value)}
//                             placeholder={`Option ${optIdx + 1}`}
//                             className="flex-1 bg-transparent text-sm text-slate-700 dark:text-slate-300 outline-none"
//                             disabled={!isEditing}
//                           />

//                           {isEditing && (
//                             <button onClick={() => removeOption(q.id, opt.id)} className="text-slate-400 hover:text-rose-500 p-1 opacity-0 group-hover:opacity-100 transition-opacity">
//                               <X size={14} />
//                             </button>
//                           )}
//                         </div>
//                       ))}
                      
//                       {isEditing && (
//                         <button onClick={() => addOption(q.id)} className="flex items-center justify-center gap-2 p-3 rounded-lg border border-dashed border-slate-300 dark:border-slate-700 text-slate-400 hover:text-violet-600 hover:border-violet-300 hover:bg-violet-50 transition-all text-sm font-medium">
//                           <Plus size={14} /> Add Option
//                         </button>
//                       )}
//                     </div>
//                   </div>

//                   {isEditing && (
//                     <button onClick={() => removeQuestion(q.id)} className="h-8 w-8 flex items-center justify-center text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors">
//                       <Trash2 size={16} />
//                     </button>
//                   )}
//                 </div>
//               </div>
//             ))}

//             {isEditing && (test.questions?.length || 0) > 0 && (
//               <button onClick={addQuestion} className="w-full py-4 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 text-slate-500 hover:text-violet-600 hover:border-violet-400 hover:bg-violet-50 dark:hover:bg-violet-900/10 transition-all font-bold flex items-center justify-center gap-2">
//                 <Plus size={20} /> Add Another Question
//               </button>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };




import React, { useRef, useState } from 'react';
import { 
  Edit3, Trash2, Save, X, Plus, Check, ClipboardList, 
  FileUp, Download, Clock, Percent, AlertCircle, Sparkles,
  GripVertical, CheckCircle2, Circle, FileText, Target,
  Wand2, Upload, LayoutList, Lightbulb, Zap, Award,
  ChevronDown, ChevronUp, MoreHorizontal, Copy, Eye
} from 'lucide-react';
import type { Test as SharedTest, MCQQuestion, MCQOption } from '../Utils/types';

interface TestEditorProps {
  test: SharedTest;
  editingTest: number | null;
  onEdit: (testId: number) => void;
  onSave: (testId: number) => void;
  onCancel: (testId: number) => void;
  onDelete: (testId: number) => void;
  onUpdateTest: (payload: Partial<SharedTest>) => void;
  onUpdateQuestion: (questionId: string | number, field: 'question_text' | 'options', value: any) => void;
}

// --- ANIMATED BACKGROUND ---
const AnimatedBackground: React.FC = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-amber-500/10 to-orange-500/10 rounded-full blur-3xl animate-float" />
    <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-violet-500/10 to-purple-500/10 rounded-full blur-3xl animate-float-delayed" />
    <style>{`
      @keyframes float {
        0%, 100% { transform: translate(0, 0) scale(1); }
        50% { transform: translate(20px, -20px) scale(1.05); }
      }
      @keyframes float-delayed {
        0%, 100% { transform: translate(0, 0) scale(1); }
        50% { transform: translate(-20px, 20px) scale(1.05); }
      }
      .animate-float { animation: float 15s ease-in-out infinite; }
      .animate-float-delayed { animation: float-delayed 20s ease-in-out infinite; }
    `}</style>
  </div>
);

// --- STAT BADGE ---
const StatBadge: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: string | number;
  gradient: string;
}> = ({ icon, label, value, gradient }) => (
  <div className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-gradient-to-r ${gradient} shadow-lg`}>
    <div className="p-1.5 bg-white/20 rounded-lg backdrop-blur-sm">
      {icon}
    </div>
    <div>
      <p className="text-[10px] font-bold uppercase tracking-wider text-white/70">{label}</p>
      <p className="text-sm font-bold text-white">{value}</p>
    </div>
  </div>
);

// --- QUESTION CARD ---
const QuestionCard: React.FC<{
  question: MCQQuestion;
  index: number;
  isEditing: boolean;
  onUpdateText: (text: string) => void;
  onAddOption: () => void;
  onRemoveOption: (oid: string | number) => void;
  onUpdateOptionText: (oid: string | number, text: string) => void;
  onToggleCorrect: (oid: string | number) => void;
  onRemove: () => void;
}> = ({ 
  question, index, isEditing, onUpdateText, onAddOption, 
  onRemoveOption, onUpdateOptionText, onToggleCorrect, onRemove 
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  
  const hasCorrectAnswer = question.options?.some(o => (o as any).is_correct || (o as any).isCorrect);
  const optionLetters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

  return (
    <div 
      className={`group relative bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl border-2 transition-all duration-500 ${
        isHovered 
          ? 'border-violet-300 dark:border-violet-700 shadow-2xl shadow-violet-500/10' 
          : 'border-slate-200/60 dark:border-slate-700/60 shadow-lg'
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {/* Decorative gradient on hover */}
      <div className={`absolute inset-0 bg-gradient-to-r from-violet-500/5 via-purple-500/5 to-pink-500/5 rounded-2xl transition-opacity duration-500 ${isHovered ? 'opacity-100' : 'opacity-0'}`} />
      
      {/* Header */}
      <div className="relative flex items-center gap-4 p-5 border-b border-slate-100 dark:border-slate-800">
        {/* Drag Handle */}
        {isEditing && (
          <div className="cursor-grab active:cursor-grabbing text-slate-400 hover:text-slate-600 transition-colors">
            <GripVertical size={18} />
          </div>
        )}
        
        {/* Question Number */}
        <div className={`relative w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg transition-all duration-300 ${
          hasCorrectAnswer 
            ? 'bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/25' 
            : 'bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 text-slate-500'
        }`}>
          {index + 1}
          {hasCorrectAnswer && (
            <div className="absolute -top-1 -right-1 w-5 h-5 bg-white rounded-full flex items-center justify-center shadow-md">
              <CheckCircle2 size={14} className="text-emerald-500" />
            </div>
          )}
        </div>
        
        {/* Question Input */}
        <div className="flex-1">
          {isEditing ? (
            <input
              type="text"
              value={question.question_text ?? question.question ?? ''}
              onChange={(e) => onUpdateText(e.target.value)}
              placeholder="Type your question here..."
              className="w-full bg-transparent text-lg font-semibold text-slate-800 dark:text-white placeholder:text-slate-400 outline-none focus:placeholder:text-slate-300 transition-colors"
            />
          ) : (
            <p className="text-lg font-semibold text-slate-800 dark:text-white">
              {question.question_text || question.question || 'Untitled Question'}
            </p>
          )}
          <p className="text-xs text-slate-400 mt-1">
            {question.options?.length || 0} options • {hasCorrectAnswer ? 'Answer set' : 'No answer selected'}
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-slate-400 hover:text-slate-600 transition-all"
          >
            {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>
          
          {isEditing && (
            <button 
              onClick={onRemove} 
              className="p-2 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-xl text-slate-400 hover:text-rose-500 transition-all"
            >
              <Trash2 size={18} />
            </button>
          )}
        </div>
      </div>

      {/* Options */}
      {isExpanded && (
        <div className="relative p-5 space-y-3">
          {(question.options || []).map((opt, optIdx) => {
            const isCorrect = (opt as any).is_correct || (opt as any).isCorrect;
            
            return (
              <div 
                key={opt.id}
                className={`group/option relative flex items-center gap-4 p-4 rounded-xl border-2 transition-all duration-300 ${
                  isCorrect
                    ? 'bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 border-emerald-200 dark:border-emerald-800 shadow-md shadow-emerald-500/10'
                    : 'bg-slate-50/50 dark:bg-slate-800/30 border-slate-200/50 dark:border-slate-700/50 hover:border-slate-300 dark:hover:border-slate-600'
                }`}
              >
                {/* Option Letter */}
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm transition-all duration-300 ${
                  isCorrect
                    ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30'
                    : 'bg-white dark:bg-slate-700 text-slate-500 border border-slate-200 dark:border-slate-600'
                }`}>
                  {optionLetters[optIdx] || optIdx + 1}
                </div>
                
                {/* Correct Toggle */}
                <button
                  onClick={() => isEditing && onToggleCorrect(opt.id)}
                  disabled={!isEditing}
                  className={`relative w-7 h-7 rounded-full flex items-center justify-center transition-all duration-300 ${
                    isCorrect
                      ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30 scale-110'
                      : 'bg-white dark:bg-slate-700 border-2 border-slate-300 dark:border-slate-600 hover:border-emerald-400 text-transparent hover:text-emerald-400'
                  } ${isEditing ? 'cursor-pointer' : 'cursor-default'}`}
                >
                  <Check size={14} strokeWidth={3} />
                </button>
                
                {/* Option Text */}
                {isEditing ? (
                  <input
                    type="text"
                    value={opt.text}
                    onChange={(e) => onUpdateOptionText(opt.id, e.target.value)}
                    placeholder={`Option ${optionLetters[optIdx] || optIdx + 1}`}
                    className="flex-1 bg-transparent text-slate-700 dark:text-slate-300 placeholder:text-slate-400 outline-none font-medium"
                  />
                ) : (
                  <span className={`flex-1 font-medium ${isCorrect ? 'text-emerald-700 dark:text-emerald-300' : 'text-slate-700 dark:text-slate-300'}`}>
                    {opt.text || `Option ${optionLetters[optIdx] || optIdx + 1}`}
                  </span>
                )}

                {/* Remove Option */}
                {isEditing && (
                  <button 
                    onClick={() => onRemoveOption(opt.id)} 
                    className="p-2 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 opacity-0 group-hover/option:opacity-100 transition-all"
                  >
                    <X size={14} />
                  </button>
                )}
                
                {/* Correct Label */}
                {isCorrect && (
                  <span className="px-3 py-1 bg-emerald-500 text-white text-xs font-bold rounded-full shadow-lg">
                    Correct
                  </span>
                )}
              </div>
            );
          })}

          {/* Add Option Button */}
          {isEditing && (
            <button 
              onClick={onAddOption}
              className="w-full flex items-center justify-center gap-2 p-4 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 text-slate-400 hover:text-violet-600 hover:border-violet-400 hover:bg-violet-50 dark:hover:bg-violet-900/10 transition-all duration-300 font-semibold"
            >
              <Plus size={18} /> Add Option
            </button>
          )}
        </div>
      )}
    </div>
  );
};

// --- MAIN COMPONENT ---
export const TestEditor: React.FC<TestEditorProps> = ({
  test,
  editingTest,
  onEdit,
  onSave,
  onCancel,
  onDelete,
  onUpdateTest,
  onUpdateQuestion
}) => {
  const isEditing = editingTest === test.id;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDraggingFile, setIsDraggingFile] = useState(false);

  // Handlers (kept same as before)
  const handleDownloadTemplate = () => {
    window.location.href = `http://localhost:8000/lms/courses/download-test-template/`;
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    try {
      const response = await fetch(`http://localhost:8000/lms/courses/parse-questions-excel/`, {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      if (data.questions) {
        onUpdateTest({ questions: [...(test.questions || []), ...data.questions] });
        alert(`Successfully added ${data.questions.length} questions!`);
      } else if (data.error) {
        alert("Error: " + data.error);
      }
    } catch (error) {
      console.error("Error uploading excel:", error);
      alert("Failed to parse Excel file.");
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const addQuestion = () => {
    const newQ: MCQQuestion = {
      id: `q-${Date.now()}`,
      question: '',
      question_text: '',
      options: [
        { id: `o-${Date.now()}-1`, text: '', isCorrect: false } as MCQOption,
        { id: `o-${Date.now()}-2`, text: '', isCorrect: false } as MCQOption
      ],
      order: (test.questions?.length || 0) + 1
    };
    onUpdateTest({ questions: [...(test.questions || []), newQ] });
  };

  const removeQuestion = (qid: string | number) => {
    onUpdateTest({ questions: (test.questions || []).filter(q => q.id !== qid) });
  };

  const updateQuestionText = (qid: string | number, text: string) => {
    const qs = (test.questions || []).map((q: MCQQuestion) =>
      (String(q.id) === String(qid)) ? { ...q, question_text: text, question: text } : q
    );
    onUpdateTest({ questions: qs });
    onUpdateQuestion(qid, 'question_text', text);
  };

  const addOption = (qid: string | number) => {
    const qs = (test.questions || []).map((q: MCQQuestion) => {
      if (String(q.id) !== String(qid)) return q;
      const nextId = `o-${Date.now()}`;
      return { ...q, options: [...q.options, { id: nextId, text: '', isCorrect: false } as MCQOption] };
    });
    onUpdateTest({ questions: qs });
    onUpdateQuestion(qid, 'options', qs.find(q => String(q.id) === String(qid))?.options);
  };

  const removeOption = (qid: string | number, oid: string | number) => {
    const qs = (test.questions || []).map((q: MCQQuestion) =>
      String(q.id) === String(qid) ? { ...q, options: q.options.filter(o => String(o.id) !== String(oid)) } : q
    );
    onUpdateTest({ questions: qs });
    onUpdateQuestion(qid, 'options', qs.find(q => String(q.id) === String(qid))?.options);
  };

  const updateOptionText = (qid: string | number, oid: string | number, text: string) => {
    const qs = (test.questions || []).map((q: MCQQuestion) =>
      String(q.id) === String(qid) ? {
        ...q,
        options: q.options.map(o => String(o.id) === String(oid) ? { ...o, text } : o)
      } : q
    );
    onUpdateTest({ questions: qs });
    onUpdateQuestion(qid, 'options', qs.find(q => String(q.id) === String(qid))?.options);
  };

  const toggleCorrectOption = (qid: string | number, oid: string | number) => {
    const qs = (test.questions || []).map((q: MCQQuestion) =>
      String(q.id) === String(qid) ? {
        ...q,
        options: q.options.map(o => ({
          ...(o as any),
          is_correct: String(o.id) === String(oid),
          isCorrect: String(o.id) === String(oid)
        }))
      } : q
    );
    onUpdateTest({ questions: qs });
    onUpdateQuestion(qid, 'options', qs.find(q => String(q.id) === String(qid))?.options);
  };

  // Calculate stats
  const totalQuestions = test.questions?.length || 0;
  const questionsWithAnswers = test.questions?.filter(q => 
    q.options?.some(o => (o as any).is_correct || (o as any).isCorrect)
  ).length || 0;
  const completionPercent = totalQuestions > 0 ? Math.round((questionsWithAnswers / totalQuestions) * 100) : 0;

  return (
    <div className="relative flex flex-col h-full bg-gradient-to-br from-slate-50 via-white to-amber-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-amber-950/30 overflow-hidden">
      <AnimatedBackground />
      
      {/* HEADER */}
      <div className="relative z-10 shrink-0 border-b border-slate-200/50 dark:border-slate-800/50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl">
        <div className="px-8 py-6">
          <div className="flex justify-between items-start gap-8">
            {/* Left: Title & Settings */}
            <div className="flex-1 space-y-4">
              {/* Title */}
              <div className="flex items-center gap-4">
                <div className={`relative p-4 rounded-2xl shadow-lg transition-all duration-500 ${
                  isEditing 
                    ? 'bg-gradient-to-br from-amber-500 to-orange-600 shadow-amber-500/30' 
                    : 'bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700'
                }`}>
                  <FileText size={28} className={isEditing ? 'text-white' : 'text-slate-500'} />
                  {isEditing && (
                    <div className="absolute -top-1 -right-1">
                      <span className="flex h-4 w-4">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-4 w-4 bg-amber-500"></span>
                      </span>
                    </div>
                  )}
                </div>
                
                <div className="flex-1">
                  {isEditing ? (
                    <div className="relative group">
                      <div className="absolute -inset-1 bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl blur opacity-0 group-focus-within:opacity-20 transition-opacity duration-300" />
                      <input
                        type="text"
                        value={test.title}
                        onChange={(e) => onUpdateTest({ title: e.target.value })}
                        className="relative w-full text-2xl font-bold bg-slate-50/80 dark:bg-slate-800/80 backdrop-blur-sm border-2 border-slate-200 dark:border-slate-700 px-4 py-3 rounded-xl focus:border-amber-500 dark:focus:border-amber-500 focus:ring-4 focus:ring-amber-500/20 outline-none transition-all"
                        placeholder="Enter test title..."
                      />
                    </div>
                  ) : (
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                      {test.title || 'Untitled Test'}
                    </h1>
                  )}
                  {!isEditing && (
                    <p className="text-sm text-slate-500 mt-1 flex items-center gap-2">
                      <LayoutList size={14} />
                      {totalQuestions} questions • {questionsWithAnswers} with answers
                    </p>
                  )}
                </div>
              </div>
              
              {/* Settings Row */}
              {isEditing ? (
                <div className="flex items-center gap-4">
                  {/* Passing Criteria */}
                  <div className="relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl blur opacity-0 group-focus-within:opacity-20 transition-opacity duration-300" />
                    <div className="relative flex items-center gap-3 px-4 py-3 bg-slate-50/80 dark:bg-slate-800/80 backdrop-blur-sm border-2 border-slate-200 dark:border-slate-700 rounded-xl focus-within:border-emerald-500 transition-all">
                      <div className="p-2 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg shadow-lg shadow-emerald-500/25">
                        <Target size={16} className="text-white" />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Pass %</p>
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={test.passing_criteria ?? ''}
                          onChange={(e) => onUpdateTest({ passing_criteria: Number(e.target.value) })}
                          placeholder="70"
                          className="bg-transparent w-16 font-bold text-slate-900 dark:text-white outline-none"
                        />
                      </div>
                    </div>
                  </div>
                  
                  {/* Time Limit */}
                  <div className="relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl blur opacity-0 group-focus-within:opacity-20 transition-opacity duration-300" />
                    <div className="relative flex items-center gap-3 px-4 py-3 bg-slate-50/80 dark:bg-slate-800/80 backdrop-blur-sm border-2 border-slate-200 dark:border-slate-700 rounded-xl focus-within:border-blue-500 transition-all">
                      <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg shadow-lg shadow-blue-500/25">
                        <Clock size={16} className="text-white" />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Minutes</p>
                        <input
                          type="number"
                          min="1"
                          value={test.total_time ?? ''}
                          onChange={(e) => onUpdateTest({ total_time: Number(e.target.value) })}
                          placeholder="30"
                          className="bg-transparent w-16 font-bold text-slate-900 dark:text-white outline-none"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  {test.passing_criteria && (
                    <StatBadge
                      icon={<Target size={14} className="text-white" />}
                      label="Passing"
                      value={`${test.passing_criteria}%`}
                      gradient="from-emerald-500 to-teal-600"
                    />
                  )}
                  {test.total_time && (
                    <StatBadge
                      icon={<Clock size={14} className="text-white" />}
                      label="Time Limit"
                      value={`${test.total_time} min`}
                      gradient="from-blue-500 to-indigo-600"
                    />
                  )}
                  <StatBadge
                    icon={<Award size={14} className="text-white" />}
                    label="Completion"
                    value={`${completionPercent}%`}
                    gradient="from-violet-500 to-purple-600"
                  />
                </div>
              )}
            </div>

            {/* Right: Action Buttons */}
            <div className="flex items-center gap-3">
              {isEditing ? (
                <>
                  <button 
                    onClick={() => onSave(test.id)} 
                    className="relative group px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white rounded-xl flex items-center gap-2.5 font-semibold transition-all shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 hover:scale-105 active:scale-95"
                  >
                    <Save size={18} /> Save Test
                  </button>
                  <button 
                    onClick={() => onCancel(test.id)} 
                    className="px-5 py-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 rounded-xl flex items-center gap-2 font-semibold transition-all hover:scale-105 active:scale-95"
                  >
                    <X size={18} /> Cancel
                  </button>
                </>
              ) : (
                <>
                  <button 
                    onClick={() => onEdit(test.id)} 
                    className="px-5 py-3 bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white rounded-xl flex items-center gap-2.5 font-semibold transition-all shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 hover:scale-105 active:scale-95"
                  >
                    <Edit3 size={18} /> Edit Test
                  </button>
                  <button 
                    onClick={() => onDelete(test.id)} 
                    className="p-3 hover:bg-rose-50 dark:hover:bg-rose-900/20 text-slate-400 hover:text-rose-500 rounded-xl transition-all hover:scale-105"
                  >
                    <Trash2 size={20} />
                  </button>
                </>
              )}
            </div>
          </div>
          
          {/* Import Actions */}
          {isEditing && (
            <div className="mt-6 pt-6 border-t border-slate-200/50 dark:border-slate-700/50 flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <Wand2 size={16} className="text-amber-500" />
                <span className="font-medium">Quick Import:</span>
              </div>
              <button 
                onClick={handleDownloadTemplate} 
                className="flex items-center gap-2 px-4 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-semibold text-slate-600 dark:text-slate-300 transition-all hover:scale-105"
              >
                <Download size={16} /> Download Template
              </button>
              <button 
                onClick={() => fileInputRef.current?.click()} 
                className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 hover:from-emerald-500/20 hover:to-teal-500/20 border border-emerald-200 dark:border-emerald-800 rounded-xl text-sm font-semibold text-emerald-600 dark:text-emerald-400 transition-all hover:scale-105"
              >
                <Upload size={16} /> Import Excel
              </button>
              <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept=".xlsx" className="hidden" />
            </div>
          )}
        </div>
        
        {/* Progress Bar */}
        {!isEditing && totalQuestions > 0 && (
          <div className="h-1 bg-slate-100 dark:bg-slate-800">
            <div 
              className="h-full bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 transition-all duration-1000 ease-out"
              style={{ width: `${completionPercent}%` }}
            />
          </div>
        )}
      </div>

      {/* QUESTIONS LIST */}
      <div className="relative z-10 flex-1 overflow-y-auto px-8 py-8">
        <div className="w-full">
          
          {/* Empty State */}
          {(!test.questions || test.questions.length === 0) && (
            <div className="relative overflow-hidden bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-3xl p-12">
              <AnimatedBackground />
              
              <div className="relative text-center">
                <div className="inline-flex p-6 bg-gradient-to-br from-amber-500/10 to-orange-500/10 rounded-3xl mb-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-amber-500/30">
                    <ClipboardList size={40} className="text-white" />
                  </div>
                </div>
                
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">No questions yet</h3>
                <p className="text-slate-500 mb-8 max-w-md mx-auto">
                  Start building your test by adding questions manually or importing them from an Excel file.
                </p>
                
                {isEditing && (
                  <div className="flex items-center justify-center gap-4">
                    <button 
                      onClick={addQuestion} 
                      className="flex items-center gap-2.5 px-6 py-3.5 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white rounded-xl font-semibold shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 transition-all hover:scale-105"
                    >
                      <Plus size={20} /> Create Question
                    </button>
                    <button 
                      onClick={() => fileInputRef.current?.click()} 
                      className="flex items-center gap-2.5 px-6 py-3.5 bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-xl font-semibold hover:border-slate-300 dark:hover:border-slate-600 transition-all hover:scale-105"
                    >
                      <Upload size={20} /> Import Excel
                    </button>
                  </div>
                )}
              </div>
              
              {/* Tips */}
              {isEditing && (
                <div className="relative mt-10 p-5 bg-gradient-to-r from-violet-500/5 to-purple-500/5 border border-violet-200 dark:border-violet-800 rounded-2xl">
                  <div className="flex items-start gap-4">
                    <div className="p-2.5 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl shadow-lg shadow-violet-500/25 shrink-0">
                      <Lightbulb size={18} className="text-white" />
                    </div>
                    <div>
                      <h4 className="font-bold text-violet-900 dark:text-violet-100 mb-1">Pro Tip</h4>
                      <p className="text-sm text-violet-700 dark:text-violet-300">
                        Download our Excel template to bulk import questions. Each row should have the question text, options, and mark the correct answer.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Questions */}
          <div className="space-y-6">
            {(test.questions || []).map((q: MCQQuestion, idx) => (
              <QuestionCard
                key={q.id}
                question={q}
                index={idx}
                isEditing={isEditing}
                onUpdateText={(text) => updateQuestionText(q.id, text)}
                onAddOption={() => addOption(q.id)}
                onRemoveOption={(oid) => removeOption(q.id, oid)}
                onUpdateOptionText={(oid, text) => updateOptionText(q.id, oid, text)}
                onToggleCorrect={(oid) => toggleCorrectOption(q.id, oid)}
                onRemove={() => removeQuestion(q.id)}
              />
            ))}

            {/* Add Question Button */}
            {isEditing && (test.questions?.length || 0) > 0 && (
              <button 
                onClick={addQuestion} 
                className="w-full py-6 rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700 text-slate-500 hover:text-amber-600 hover:border-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/10 transition-all duration-300 font-bold flex items-center justify-center gap-3 group"
              >
                <div className="w-10 h-10 bg-slate-100 dark:bg-slate-800 group-hover:bg-amber-100 dark:group-hover:bg-amber-900/30 rounded-xl flex items-center justify-center transition-colors">
                  <Plus size={22} className="group-hover:rotate-90 transition-transform duration-300" />
                </div>
                Add Another Question
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Custom Scrollbar Styles */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(0, 0, 0, 0.1);
          border-radius: 4px;
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