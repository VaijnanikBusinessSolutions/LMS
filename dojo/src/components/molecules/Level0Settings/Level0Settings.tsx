

// import React, { useState, useEffect, useRef } from 'react';
// import { 
//   FileText, 
//   Plus, 
//   RefreshCw, 
//   AlertCircle, 
//   CheckCircle, 
//   Edit2, 
//   Trash2, 
//   Save, 
//   X,
//   GripVertical, // Icon for the drag handle
//   ArrowDown     // Icon for insert indicator
// } from 'lucide-react';
// import { humanBodyCheckService } from '../../hooks/ServiceApis';

// interface Question {
//   id: number;
//   question_text: string;
//   sort_order?: number;
// }

// const Level0Settings: React.FC = () => {
//   // --- State Management ---
//   const [questions, setQuestions] = useState<Question[]>([]);
  
//   // "Add to Bottom" State
//   const [newQuestion, setNewQuestion] = useState<string>('');
  
//   // "Insert Between" State
//   const [insertAtIndex, setInsertAtIndex] = useState<number | null>(null);
//   const [insertText, setInsertText] = useState<string>('');

//   // Edit State
//   const [editingId, setEditingId] = useState<number | null>(null);
//   const [editText, setEditText] = useState<string>('');

//   // UI Status States
//   const [isLoading, setIsLoading] = useState<boolean>(false);
//   const [isSubmitting, setIsSubmitting] = useState<boolean>(false); // For adding
//   const [isUpdating, setIsUpdating] = useState<boolean>(false);     // For editing
//   const [isDeleting, setIsDeleting] = useState<number | null>(null); 

//   // Notifications
//   const [error, setError] = useState<string>('');
//   const [success, setSuccess] = useState<string>('');

//   // Drag and Drop Refs
//   const dragItem = useRef<number | null>(null);
//   const dragOverItem = useRef<number | null>(null);

//   // --- Initial Load ---
//   useEffect(() => {
//     loadQuestions();
//   }, []);

//   const loadQuestions = async () => {
//     setIsLoading(true);
//     setError('');
//     try {
//       const data = await humanBodyCheckService.fetchQuestions();
//       // Ensure frontend respects sort_order just in case
//       // If backend sends mixed order, this fixes it initially
//       // data.sort((a: Question, b: Question) => (a.sort_order || 0) - (b.sort_order || 0));
//       setQuestions(data);
//     } catch (err) {
//       setError('Error loading questions. Please check server connection.');
//       console.error(err);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // --- 1. Add to Bottom (Append) ---
//   const handleAppendSubmit = async () => {
//     if (!newQuestion.trim()) return setError('Question text is required');

//     setIsSubmitting(true);
//     setError('');
//     setSuccess('');
    
//     try {
//       await humanBodyCheckService.submitQuestion(newQuestion);
//       setNewQuestion('');
//       setSuccess('Question added to the bottom.');
//       loadQuestions(); // Reload to get the new ID and correct order
//     } catch (err) {
//       setError(err instanceof Error ? err.message : 'Failed to add question');
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   // --- 2. Insert In Between (Complex Logic) ---
//   const handleInsertBetween = async () => {
//     if (!insertText.trim() || insertAtIndex === null) return;
    
//     setIsSubmitting(true);
//     setError('');
    
//     try {
//       // Step A: Create the question on the backend (it will default to the bottom)
//       const response = await humanBodyCheckService.submitQuestion(insertText);
      
//       // Depending on your API, response might be the object or response.data
//       // Adjust this line based on what your 'submitQuestion' returns
//       const createdQuestion = response.data || response; 
//       const newId = createdQuestion.id;

//       if (!newId) throw new Error("Backend did not return an ID");

//       // Step B: Construct the new array locally
//       const updatedList = [...questions];
      
//       // Create object for local state
//       const newQObj: Question = { id: newId, question_text: insertText };
      
//       // Insert at the specific index
//       updatedList.splice(insertAtIndex, 0, newQObj);

//       // Step C: Update UI immediately
//       setQuestions(updatedList);
//       setInsertAtIndex(null);
//       setInsertText('');
//       setSuccess('Question inserted! Saving new order...');

//       // Step D: Sync the new order with Backend
//       await saveNewOrder(updatedList);

//     } catch (err) {
//       setError('Failed to insert question. Try adding to bottom instead.');
//       console.error(err);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   // --- 3. Drag and Drop Reorder ---
//   const handleSort = async () => {
//     // If we aren't dragging anything or dropped outside, stop
//     if (dragItem.current === null || dragOverItem.current === null) return;

//     // clone array
//     const _questions = [...questions];
    
//     // remove item from old pos
//     const draggedItemContent = _questions.splice(dragItem.current, 1)[0];
    
//     // insert at new pos
//     _questions.splice(dragOverItem.current, 0, draggedItemContent);

//     // reset refs
//     dragItem.current = null;
//     dragOverItem.current = null;

//     // update state
//     setQuestions(_questions);
    
//     // save to backend
//     await saveNewOrder(_questions);
//   };

//   // Helper to call the reorder API
//   const saveNewOrder = async (orderedQuestions: Question[]) => {
//     try {
//       const orderedIds = orderedQuestions.map(q => q.id);
//       await humanBodyCheckService.reorderQuestions(orderedIds);
//       // Optional: setSuccess('Order saved successfully'); 
//     } catch (err) {
//       setError('Local order changed, but failed to save to server. Please refresh.');
//       console.error(err);
//     }
//   };

//   // --- 4. Standard Edit/Delete ---
//   const handleUpdate = async (id: number) => {
//     if (!editText.trim()) return setError('Text cannot be empty');

//     setIsUpdating(true);
//     try {
//       await humanBodyCheckService.updateQuestion(id, editText); 
//       setQuestions(questions.map(q => q.id === id ? { ...q, question_text: editText } : q));
//       setSuccess('Question updated');
//       setEditingId(null);
//     } catch (err) {
//       setError('Failed to update question');
//     } finally {
//       setIsUpdating(false);
//     }
//   };

//   const handleDelete = async (id: number) => {
//     if (!window.confirm('Delete this question?')) return;
//     setIsDeleting(id);
//     try {
//       await humanBodyCheckService.deleteQuestion(id);
//       setQuestions(questions.filter(q => q.id !== id));
//       setSuccess('Question deleted');
//     } catch (err) {
//       setError('Failed to delete');
//     } finally {
//       setIsDeleting(null);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-[95%] mx-auto">
        
//         {/* Header */}
//         <div className="text-center mb-8">
//           <h1 className="text-3xl font-bold text-gray-800 mb-2">Level 0 Settings</h1>
//           <p className="text-gray-600">Manage and Reorder Human Body Questions</p>
//         </div>

//         {/* Notifications */}
//         <div className="mb-6 space-y-2">
//           {error && (
//             <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg flex justify-between items-center max-w-4xl mx-auto">
//               <div className="flex items-center gap-2"><AlertCircle className="w-5 h-5"/> {error}</div>
//               <button onClick={() => setError('')}><X className="w-4 h-4"/></button>
//             </div>
//           )}
//           {success && (
//             <div className="p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg flex justify-between items-center max-w-4xl mx-auto">
//               <div className="flex items-center gap-2"><CheckCircle className="w-5 h-5"/> {success}</div>
//               <button onClick={() => setSuccess('')}><X className="w-4 h-4"/></button>
//             </div>
//           )}
//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
//           {/* Left Panel: Add New (Append) */}
//           <div className="lg:col-span-4 h-fit">
//             <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200 sticky top-6">
//               <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
//                 <Plus className="w-5 h-5 text-blue-600" />
//                 Append New Question
//               </h3>
//               <div className="space-y-3">
//                 <textarea
//                   rows={4}
//                   value={newQuestion}
//                   onChange={(e) => setNewQuestion(e.target.value)}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 resize-none"
//                   placeholder="This will add a question to the end of the list..."
//                 />
//                 <button
//                   onClick={handleAppendSubmit}
//                   disabled={isSubmitting || !newQuestion.trim()}
//                   className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-all"
//                 >
//                   {isSubmitting ? <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"/> : <Plus className="w-5 h-5" />}
//                   Add to Bottom
//                 </button>
//               </div>
//             </div>
//           </div>

//           {/* Right Panel: List & Reorder */}
//           <div className="lg:col-span-8">
//             <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200 min-h-[500px]">
              
//               {/* List Header */}
//               <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
//                 <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
//                   <FileText className="w-6 h-6 text-blue-600" />
//                   Questions Sequence ({questions.length})
//                 </h3>
//                 <button onClick={loadQuestions} className="flex items-center gap-1 text-sm text-gray-500 hover:text-blue-600">
//                   <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} /> Refresh
//                 </button>
//               </div>

//               {/* The List */}
//               <div className="space-y-0 pb-10">
//                 {questions.length === 0 && !isLoading && (
//                   <div className="text-center text-gray-400 py-10">No questions found. Add one!</div>
//                 )}

//                 {questions.map((question, index) => (
//                   <React.Fragment key={question.id}>
                    
//                     {/* --- ZONE: Insert Between --- */}
//                     {/* Only show this drop zone if we aren't currently dragging an item to avoid UI clutter */}
//                     {!dragItem.current && (
//                       <div className="relative group h-3 -my-1.5 z-10 flex items-center justify-center">
//                         {/* The invisible hover target area */}
//                         <div 
//                           className="absolute w-full h-full cursor-pointer"
//                           onClick={() => { setInsertAtIndex(index); setInsertText(''); }}
//                         ></div>
                        
//                         {/* The visible line/button on hover */}
//                         <div className="w-full h-[2px] bg-blue-400 opacity-0 group-hover:opacity-100 transition-opacity relative flex items-center justify-center pointer-events-none">
//                            <div className="bg-blue-50 text-blue-600 px-3 py-0.5 rounded-full text-xs font-bold border border-blue-200 shadow-sm flex items-center gap-1">
//                               <ArrowDown className="w-3 h-3" /> Insert as #{index + 1}
//                            </div>
//                         </div>
//                       </div>
//                     )}

//                     {/* --- COMPONENT: Insert Form (Visible only when active) --- */}
//                     {insertAtIndex === index && (
//                       <div className="my-4 ml-8 bg-blue-50 p-4 rounded-lg border border-blue-200 shadow-inner animate-in fade-in slide-in-from-top-2">
//                         <div className="flex justify-between items-center mb-2">
//                           <label className="text-xs font-bold text-blue-700 uppercase tracking-wider">
//                             Inserting new Question #{index + 1}
//                           </label>
//                           <button onClick={() => setInsertAtIndex(null)} className="text-gray-400 hover:text-gray-600">
//                             <X className="w-4 h-4"/>
//                           </button>
//                         </div>
//                         <textarea 
//                           autoFocus
//                           className="w-full p-3 border border-blue-200 rounded-md focus:ring-2 focus:ring-blue-500 outline-none text-sm"
//                           placeholder="Type your new question here..."
//                           value={insertText}
//                           onChange={e => setInsertText(e.target.value)}
//                           onKeyDown={(e) => { if(e.key === 'Enter' && e.ctrlKey) handleInsertBetween() }}
//                         />
//                         <div className="flex justify-end gap-2 mt-3">
//                           <button 
//                             onClick={handleInsertBetween} 
//                             disabled={isSubmitting}
//                             className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 flex items-center gap-2"
//                           >
//                             {isSubmitting ? 'Saving...' : 'Save & Insert'}
//                           </button>
//                         </div>
//                       </div>
//                     )}

//                     {/* --- COMPONENT: The Question Item (Draggable) --- */}
//                     <div 
//                       draggable
//                       onDragStart={() => (dragItem.current = index)}
//                       onDragEnter={() => (dragOverItem.current = index)}
//                       onDragEnd={handleSort}
//                       onDragOver={(e) => e.preventDefault()}
//                       className={`relative mb-3 p-4 rounded-xl border transition-all duration-200 group select-none ${
//                         editingId === question.id 
//                           ? 'bg-white border-blue-400 ring-4 ring-blue-50 z-20' 
//                           : 'bg-gray-50 border-gray-200 hover:bg-white hover:shadow-md hover:border-blue-300'
//                       }`}
//                     >
//                       {editingId === question.id ? (
//                         // Edit Mode
//                         <div className="flex flex-col gap-3">
//                           <span className="text-xs font-bold text-blue-600 uppercase">Editing #{index + 1}</span>
//                           <textarea
//                             value={editText}
//                             onChange={(e) => setEditText(e.target.value)}
//                             className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                             autoFocus
//                           />
//                           <div className="flex justify-end gap-2">
//                             <button onClick={() => setEditingId(null)} className="text-sm text-gray-500 hover:bg-gray-100 px-3 py-1 rounded">Cancel</button>
//                             <button onClick={() => handleUpdate(question.id)} className="text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700">Save Changes</button>
//                           </div>
//                         </div>
//                       ) : (
//                         // View Mode
//                         <div className="flex items-start gap-3">
//                           {/* Drag Handle */}
//                           <div className="mt-2 cursor-grab active:cursor-grabbing text-gray-300 hover:text-gray-600 p-1">
//                             <GripVertical className="w-5 h-5" />
//                           </div>

//                           {/* Number Badge */}
//                           <div className="flex-shrink-0 mt-1">
//                             <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm border border-blue-200">
//                               {index + 1}
//                             </div>
//                           </div>
                          
//                           {/* Content */}
//                           <div className="flex-1 min-w-0 pt-1.5">
//                             <p className="text-gray-800 text-base">{question.question_text}</p>
//                           </div>

//                           {/* Actions (Hover Only) */}
//                           <div className="flex flex-col sm:flex-row gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
//                             <button 
//                               onClick={() => { setEditingId(question.id); setEditText(question.question_text); }}
//                               className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
//                               title="Edit"
//                             >
//                               <Edit2 className="w-4 h-4" />
//                             </button>
//                             <button 
//                               onClick={() => handleDelete(question.id)}
//                               className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
//                               title="Delete"
//                             >
//                               {isDeleting === question.id ? <span className="animate-spin w-4 h-4 block border-2 border-red-500 border-t-transparent rounded-full"/> : <Trash2 className="w-4 h-4" />}
//                             </button>
//                           </div>
//                         </div>
//                       )}
//                     </div>
//                   </React.Fragment>
//                 ))}

//                 {/* Extra Drop Zone at the very bottom for insertion after the last item */}
//                 {questions.length > 0 && !dragItem.current && (
//                     <div className="relative group h-6 mt-1 flex items-center justify-center cursor-pointer"
//                          onClick={() => { setInsertAtIndex(questions.length); setInsertText(''); }}>
//                        <div className="w-full h-[2px] bg-gray-200 group-hover:bg-blue-400 transition-colors"></div>
//                        <div className="absolute bg-white group-hover:bg-blue-50 text-gray-400 group-hover:text-blue-600 px-3 py-1 rounded-full text-xs font-bold border border-gray-200 group-hover:border-blue-200 shadow-sm flex items-center gap-1 transition-all">
//                           <Plus className="w-3 h-3" /> Insert at End ({questions.length + 1})
//                        </div>
//                     </div>
//                 )}
                
//                 {/* Form for "Insert at End" via the bottom click zone */}
//                 {insertAtIndex === questions.length && (
//                     <div className="my-4 ml-8 bg-blue-50 p-4 rounded-lg border border-blue-200 shadow-inner animate-in fade-in">
//                         <div className="flex justify-between items-center mb-2">
//                           <label className="text-xs font-bold text-blue-700 uppercase">New Last Question #{questions.length + 1}</label>
//                           <button onClick={() => setInsertAtIndex(null)}><X className="w-4 h-4 text-gray-500"/></button>
//                         </div>
//                         <textarea 
//                           autoFocus
//                           className="w-full p-3 border border-blue-200 rounded-md"
//                           placeholder="Type question..."
//                           value={insertText}
//                           onChange={e => setInsertText(e.target.value)}
//                         />
//                         <button onClick={handleInsertBetween} className="mt-2 w-full py-2 bg-blue-600 text-white rounded">Save</button>
//                     </div>
//                 )}

//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Level0Settings;




// src/components/molecules/Level0Settings/Level0Settings.tsx

import React, { useState, useEffect, useRef } from 'react';
import { 
  FileText, 
  Plus, 
  RefreshCw, 
  AlertCircle, 
  CheckCircle, 
  Edit2, 
  Trash2, 
  Save, 
  X,
  GripVertical, // Icon for the drag handle
  ArrowDown     // Icon for insert indicator
} from 'lucide-react';
import { humanBodyCheckService } from '../../hooks/ServiceApis';

interface Question {
  id: number;
  question_text: string;
  sort_order?: number;
}

const Level0Settings: React.FC = () => {
  // --- State Management ---
  const [questions, setQuestions] = useState<Question[]>([]);
  
  // "Add to Bottom" State
  const [newQuestion, setNewQuestion] = useState<string>('');
  
  // "Insert Between" State
  const [insertAtIndex, setInsertAtIndex] = useState<number | null>(null);
  const [insertText, setInsertText] = useState<string>('');

  // Edit State
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editText, setEditText] = useState<string>('');

  // UI Status States
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false); // For adding
  const [isUpdating, setIsUpdating] = useState<boolean>(false);     // For editing
  const [isDeleting, setIsDeleting] = useState<number | null>(null); 

  // Notifications
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');

  // Drag and Drop Refs
  const dragItem = useRef<number | null>(null);
  const dragOverItem = useRef<number | null>(null);

  // --- Initial Load ---
  useEffect(() => {
    loadQuestions();
  }, []);

  const loadQuestions = async () => {
    setIsLoading(true);
    setError('');
    try {
      const data = await humanBodyCheckService.fetchQuestions();
      // Ensure frontend respects sort_order just in case
      // If backend sends mixed order, this fixes it initially
      // data.sort((a: Question, b: Question) => (a.sort_order || 0) - (b.sort_order || 0));
      setQuestions(data);
    } catch (err) {
      setError('Error loading questions. Please check server connection.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // --- 1. Add to Bottom (Append) ---
  const handleAppendSubmit = async () => {
    if (!newQuestion.trim()) return setError('Question text is required');

    setIsSubmitting(true);
    setError('');
    setSuccess('');
    
    try {
      await humanBodyCheckService.submitQuestion(newQuestion);
      setNewQuestion('');
      setSuccess('Question added to the bottom.');
      loadQuestions(); // Reload to get the new ID and correct order
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add question');
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- 2. Insert In Between (Complex Logic) ---
  const handleInsertBetween = async () => {
    if (!insertText.trim() || insertAtIndex === null) return;
    
    setIsSubmitting(true);
    setError('');
    
    try {
      // Step A: Create the question on the backend (it will default to the bottom)
      const response = await humanBodyCheckService.submitQuestion(insertText);
      
      // Depending on your API, response might be the object or response.data
      // Adjust this line based on what your 'submitQuestion' returns
      const createdQuestion = response.data || response; 
      const newId = createdQuestion.id;

      if (!newId) throw new Error("Backend did not return an ID");

      // Step B: Construct the new array locally
      const updatedList = [...questions];
      
      // Create object for local state
      const newQObj: Question = { id: newId, question_text: insertText };
      
      // Insert at the specific index
      updatedList.splice(insertAtIndex, 0, newQObj);

      // Step C: Update UI immediately
      setQuestions(updatedList);
      setInsertAtIndex(null);
      setInsertText('');
      setSuccess('Question inserted! Saving new order...');

      // Step D: Sync the new order with Backend
      await saveNewOrder(updatedList);

    } catch (err) {
      setError('Failed to insert question. Try adding to bottom instead.');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- 3. Drag and Drop Reorder ---
  const handleSort = async () => {
    // If we aren't dragging anything or dropped outside, stop
    if (dragItem.current === null || dragOverItem.current === null) return;

    // clone array
    const _questions = [...questions];
    
    // remove item from old pos
    const draggedItemContent = _questions.splice(dragItem.current, 1)[0];
    
    // insert at new pos
    _questions.splice(dragOverItem.current, 0, draggedItemContent);

    // reset refs
    dragItem.current = null;
    dragOverItem.current = null;

    // update state
    setQuestions(_questions);
    
    // save to backend
    await saveNewOrder(_questions);
  };

  // Helper to call the reorder API
  const saveNewOrder = async (orderedQuestions: Question[]) => {
    try {
      const orderedIds = orderedQuestions.map(q => q.id);
      await humanBodyCheckService.reorderQuestions(orderedIds);
      // Optional: setSuccess('Order saved successfully'); 
    } catch (err) {
      setError('Local order changed, but failed to save to server. Please refresh.');
      console.error(err);
    }
  };

  // --- 4. Standard Edit/Delete ---
  const handleUpdate = async (id: number) => {
    if (!editText.trim()) return setError('Text cannot be empty');

    setIsUpdating(true);
    try {
      await humanBodyCheckService.updateQuestion(id, editText); 
      setQuestions(questions.map(q => q.id === id ? { ...q, question_text: editText } : q));
      setSuccess('Question updated');
      setEditingId(null);
    } catch (err) {
      setError('Failed to update question');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Delete this question?')) return;
    setIsDeleting(id);
    try {
      await humanBodyCheckService.deleteQuestion(id);
      setQuestions(questions.filter(q => q.id !== id));
      setSuccess('Question deleted');
    } catch (err) {
      setError('Failed to delete');
    } finally {
      setIsDeleting(null);
    }
  };

  return (
    <div className="min-h-screen bg-background text-text transition-colors duration-300 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-[95%] mx-auto">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-text mb-2">Level 0 Settings</h1>
          <p className="text-muted">Manage and Reorder Human Body Questions</p>
        </div>

        {/* Notifications */}
        <div className="mb-6 space-y-2">
          {error && (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 rounded-lg flex justify-between items-center max-w-4xl mx-auto">
              <div className="flex items-center gap-2"><AlertCircle className="w-5 h-5"/> {error}</div>
              <button onClick={() => setError('')}><X className="w-4 h-4"/></button>
            </div>
          )}
          {success && (
            <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-400 rounded-lg flex justify-between items-center max-w-4xl mx-auto">
              <div className="flex items-center gap-2"><CheckCircle className="w-5 h-5"/> {success}</div>
              <button onClick={() => setSuccess('')}><X className="w-4 h-4"/></button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Panel: Add New (Append) */}
          <div className="lg:col-span-4 h-fit">
            <div className="bg-surface rounded-2xl p-6 shadow-lg border border-border sticky top-6">
              <h3 className="text-lg font-bold text-text mb-4 flex items-center gap-2">
                <Plus className="w-5 h-5 text-primary" />
                Append New Question
              </h3>
              <div className="space-y-3">
                <textarea
                  rows={4}
                  value={newQuestion}
                  onChange={(e) => setNewQuestion(e.target.value)}
                  className="w-full px-3 py-2 border border-border bg-background text-text rounded-lg focus:ring-4 focus:ring-primary/20 focus:border-primary resize-none outline-none transition-all duration-200"
                  placeholder="This will add a question to the end of the list..."
                />
                <button
                  onClick={handleAppendSubmit}
                  disabled={isSubmitting || !newQuestion.trim()}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-primary text-white rounded-lg hover:opacity-90 disabled:opacity-50 transition-all"
                >
                  {isSubmitting ? <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"/> : <Plus className="w-5 h-5" />}
                  Add to Bottom
                </button>
              </div>
            </div>
          </div>

          {/* Right Panel: List & Reorder */}
          <div className="lg:col-span-8">
            <div className="bg-surface rounded-2xl p-6 shadow-lg border border-border min-h-[500px]">
              
              {/* List Header */}
              <div className="flex justify-between items-center mb-6 border-b border-border pb-4">
                <h3 className="text-xl font-bold text-text flex items-center gap-2">
                  <FileText className="w-6 h-6 text-primary" />
                  Questions Sequence ({questions.length})
                </h3>
                <button onClick={loadQuestions} className="flex items-center gap-1 text-sm text-muted hover:text-primary transition-colors">
                  <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} /> Refresh
                </button>
              </div>

              {/* The List */}
              <div className="space-y-0 pb-10">
                {questions.length === 0 && !isLoading && (
                  <div className="text-center text-muted py-10">No questions found. Add one!</div>
                )}

                {questions.map((question, index) => (
                  <React.Fragment key={question.id}>
                    
                    {/* --- ZONE: Insert Between --- */}
                    {/* Only show this drop zone if we aren't currently dragging an item to avoid UI clutter */}
                    {!dragItem.current && (
                      <div className="relative group h-3 -my-1.5 z-10 flex items-center justify-center">
                        {/* The invisible hover target area */}
                        <div 
                          className="absolute w-full h-full cursor-pointer"
                          onClick={() => { setInsertAtIndex(index); setInsertText(''); }}
                        ></div>
                        
                        {/* The visible line/button on hover */}
                        <div className="w-full h-[2px] bg-primary/50 opacity-0 group-hover:opacity-100 transition-opacity relative flex items-center justify-center pointer-events-none">
                           <div className="bg-primary/10 text-primary px-3 py-0.5 rounded-full text-xs font-bold border border-primary/20 shadow-sm flex items-center gap-1 backdrop-blur-sm">
                              <ArrowDown className="w-3 h-3" /> Insert as #{index + 1}
                           </div>
                        </div>
                      </div>
                    )}

                    {/* --- COMPONENT: Insert Form (Visible only when active) --- */}
                    {insertAtIndex === index && (
                      <div className="my-4 ml-8 bg-primary/5 p-4 rounded-lg border border-primary/20 shadow-inner animate-in fade-in slide-in-from-top-2">
                        <div className="flex justify-between items-center mb-2">
                          <label className="text-xs font-bold text-primary uppercase tracking-wider">
                            Inserting new Question #{index + 1}
                          </label>
                          <button onClick={() => setInsertAtIndex(null)} className="text-muted hover:text-text">
                            <X className="w-4 h-4"/>
                          </button>
                        </div>
                        <textarea 
                          autoFocus
                          className="w-full p-3 border border-border bg-background text-text rounded-md focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-sm transition-all duration-200"
                          placeholder="Type your new question here..."
                          value={insertText}
                          onChange={e => setInsertText(e.target.value)}
                          onKeyDown={(e) => { if(e.key === 'Enter' && e.ctrlKey) handleInsertBetween() }}
                        />
                        <div className="flex justify-end gap-2 mt-3">
                          <button 
                            onClick={handleInsertBetween} 
                            disabled={isSubmitting}
                            className="px-4 py-2 bg-primary text-white text-sm font-medium rounded-md hover:opacity-90 flex items-center gap-2 transition-all"
                          >
                            {isSubmitting ? 'Saving...' : 'Save & Insert'}
                          </button>
                        </div>
                      </div>
                    )}

                    {/* --- COMPONENT: The Question Item (Draggable) --- */}
                    <div 
                      draggable
                      onDragStart={() => (dragItem.current = index)}
                      onDragEnter={() => (dragOverItem.current = index)}
                      onDragEnd={handleSort}
                      onDragOver={(e) => e.preventDefault()}
                      className={`relative mb-3 p-4 rounded-xl border transition-all duration-200 group select-none ${
                        editingId === question.id 
                          ? 'bg-surface border-primary ring-4 ring-primary/10 z-20' 
                          : 'bg-background border-border hover:bg-surface hover:shadow-md hover:border-primary/30'
                      }`}
                    >
                      {editingId === question.id ? (
                        // Edit Mode
                        <div className="flex flex-col gap-3">
                          <span className="text-xs font-bold text-primary uppercase">Editing #{index + 1}</span>
                          <textarea
                            value={editText}
                            onChange={(e) => setEditText(e.target.value)}
                            className="w-full px-3 py-2 border border-border bg-background text-text rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                            autoFocus
                          />
                          <div className="flex justify-end gap-2">
                            <button onClick={() => setEditingId(null)} className="text-sm text-muted hover:bg-muted/10 px-3 py-1 rounded transition-colors">Cancel</button>
                            <button onClick={() => handleUpdate(question.id)} className="text-sm bg-primary text-white px-3 py-1 rounded hover:opacity-90 transition-colors">Save Changes</button>
                          </div>
                        </div>
                      ) : (
                        // View Mode
                        <div className="flex items-start gap-3">
                          {/* Drag Handle */}
                          <div className="mt-2 cursor-grab active:cursor-grabbing text-muted/50 hover:text-muted p-1">
                            <GripVertical className="w-5 h-5" />
                          </div>

                          {/* Number Badge */}
                          <div className="flex-shrink-0 mt-1">
                            <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm border border-primary/20">
                              {index + 1}
                            </div>
                          </div>
                          
                          {/* Content */}
                          <div className="flex-1 min-w-0 pt-1.5">
                            <p className="text-text text-base">{question.question_text}</p>
                          </div>

                          {/* Actions (Hover Only) */}
                          <div className="flex flex-col sm:flex-row gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button 
                              onClick={() => { setEditingId(question.id); setEditText(question.question_text); }}
                              className="p-2 text-muted hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                              title="Edit"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => handleDelete(question.id)}
                              className="p-2 text-muted hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                              title="Delete"
                            >
                              {isDeleting === question.id ? <span className="animate-spin w-4 h-4 block border-2 border-red-500 border-t-transparent rounded-full"/> : <Trash2 className="w-4 h-4" />}
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </React.Fragment>
                ))}

                {/* Extra Drop Zone at the very bottom for insertion after the last item */}
                {questions.length > 0 && !dragItem.current && (
                    <div className="relative group h-6 mt-1 flex items-center justify-center cursor-pointer"
                         onClick={() => { setInsertAtIndex(questions.length); setInsertText(''); }}>
                       <div className="w-full h-[2px] bg-border group-hover:bg-primary/50 transition-colors"></div>
                       <div className="absolute bg-surface group-hover:bg-primary/10 text-muted group-hover:text-primary px-3 py-1 rounded-full text-xs font-bold border border-border group-hover:border-primary/20 shadow-sm flex items-center gap-1 transition-all">
                          <Plus className="w-3 h-3" /> Insert at End ({questions.length + 1})
                       </div>
                    </div>
                )}
                
                {/* Form for "Insert at End" via the bottom click zone */}
                {insertAtIndex === questions.length && (
                    <div className="my-4 ml-8 bg-primary/5 p-4 rounded-lg border border-primary/20 shadow-inner animate-in fade-in">
                        <div className="flex justify-between items-center mb-2">
                          <label className="text-xs font-bold text-primary uppercase">New Last Question #{questions.length + 1}</label>
                          <button onClick={() => setInsertAtIndex(null)}><X className="w-4 h-4 text-muted hover:text-text"/></button>
                        </div>
                        <textarea 
                          autoFocus
                          className="w-full p-3 border border-border bg-background text-text rounded-md focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-sm transition-all duration-200"
                          placeholder="Type question..."
                          value={insertText}
                          onChange={e => setInsertText(e.target.value)}
                        />
                        <button onClick={handleInsertBetween} className="mt-2 w-full py-2 bg-primary text-white rounded hover:opacity-90 transition-opacity">Save</button>
                    </div>
                )}

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Level0Settings;