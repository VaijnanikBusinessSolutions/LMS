


// import { useState, useEffect, useRef } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import axios from "axios";
// import { 
//   ArrowLeft, BookOpen, Edit, FileQuestion, Grid, List, Trash2, Upload, 
//   FileText, Link, Play, Settings, Plus, X, CheckCircle, AlertCircle, 
//   Save, Search, Check, RefreshCw, Image as ImageIcon, LayoutDashboard,
//   UploadCloud
// } from 'lucide-react';

// const API_BASE = "http://127.0.0.1:8000";

// // --- INTERFACES ---
// interface TabData { id: string; title: string; content: string; }
// interface TrainingContent { id: number; description: string; training_file?: string | null; url_link?: string | null; subtopiccontent: number; }
// interface SubtopicContent { subtopiccontent_id: number; subtopic: number; content: string; }

// interface Option { 
//   id?: number; 
//   option_text: string; 
//   option_image_url?: string; 
//   is_correct: boolean; 
// }

// interface Question { 
//   id: number; 
//   question_text: string; 
//   question_image_url?: string; 
//   options: Option[]; 
// }

// interface OptionFormState {
//   option_text: string;
//   is_correct: boolean;
//   imageFile: File | null;
//   previewUrl: string | null;
// }

// interface QuestionFormState {
//   question_text: string;
//   imageFile: File | null;
//   previewUrl: string | null;
//   options: OptionFormState[];
// }

// export default function Level1Detailed() {
//   const { id } = useParams();
//   const navigate = useNavigate();

//   // --- STATE ---
//   const [activeTab, setActiveTab] = useState<string>("tab1");
//   const [trainingContents, setTrainingContents] = useState<TrainingContent[]>([]);
  
//   // Upload State
//   const [showUploadModal, setShowUploadModal] = useState(false);
//   const [uploadType, setUploadType] = useState<"file" | "link">("file");
//   const [newMaterial, setNewMaterial] = useState<{ description: string; file: File | null; url: string }>({ description: "", file: null, url: "" });
//   const [uploadLoading, setUploadLoading] = useState(false);
//   const contentFileInputRef = useRef<HTMLInputElement>(null);

//   // Data State
//   const [subtopicContents, setSubtopicContents] = useState<SubtopicContent[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [viewType, setViewType] = useState<"grid" | "list">("grid");
//   const subtopicId = id ? parseInt(id, 10) : 1;

//   // REVISION & Manager State
//   const [questions, setQuestions] = useState<Question[]>([]);
//   const [quizMode, setQuizMode] = useState(false);
//   const [showManager, setShowManager] = useState(false); // Toggles between Quiz View and Manager View
//   const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
//   const [selectedAnswers, setSelectedAnswers] = useState<{ [questionId: number]: { selectedOptionId: number | undefined; isCorrect: boolean } }>({});
//   const [showResults, setShowResults] = useState(false);

//   // Question Form State
//   const [editingQuestionId, setEditingQuestionId] = useState<number | null>(null);
//   const [formError, setFormError] = useState<string | null>(null);
//   const questionImageInputRef = useRef<HTMLInputElement>(null);
//   const optionImageInputRefs = useRef<(HTMLInputElement | null)[]>([]);



// const [showBulkUploadModal, setShowBulkUploadModal] = useState(false);
// const [bulkFile, setBulkFile] = useState<File | null>(null);
// const [bulkUploading, setBulkUploading] = useState(false);
// const bulkFileInputRef = useRef<HTMLInputElement>(null);



//   const initialFormState: QuestionFormState = {
//     question_text: "",
//     imageFile: null,
//     previewUrl: null,
//     options: [
//       { option_text: "", is_correct: false, imageFile: null, previewUrl: null },
//       { option_text: "", is_correct: false, imageFile: null, previewUrl: null },
//       { option_text: "", is_correct: false, imageFile: null, previewUrl: null },
//       { option_text: "", is_correct: false, imageFile: null, previewUrl: null }
//     ],
//   };

//   const [questionFormData, setQuestionFormData] = useState<QuestionFormState>(initialFormState);

//   // --- DERIVED STATE ---
//   const detailTabs: TabData[] = subtopicContents.map((c, i) => ({ id: `tab${i + 1}`, title: c.content, content: c.content }));
//   const activeTabData = detailTabs.find((tab) => tab.id === activeTab) || detailTabs[0];
//   const isRevisionTab = activeTabData?.title?.toUpperCase() === "REVISION";

//   // --- DATA FETCHING ---
//   useEffect(() => {
//     const fetchSubtopicContents = async () => {
//       try {
//         setLoading(true);
//         const res = await fetch(`${API_BASE}/subtopic-contents/?subtopic=${subtopicId}`);
//         if (!res.ok) throw new Error("Network response was not ok");
//         const data: SubtopicContent[] = await res.json();
//         if (!data.length) { navigate("/lesson-details/1", { replace: true }); return; }
//         setSubtopicContents(data);
//         setLoading(false);
//       } catch (err) { console.error(err); setError("Failed to load lesson contents"); setLoading(false); }
//     };
//     fetchSubtopicContents();
//   }, [subtopicId, navigate]);

//   useEffect(() => {
//     const fetchTrainingContents = async () => {
//       if (subtopicContents.length === 0 || isRevisionTab) return;
//       const activeTabIndex = parseInt(activeTab.replace("tab", ""), 10) - 1;
//       const current = subtopicContents[activeTabIndex];
//       if (!current) return;
//       try {
//         const response = await fetch(`${API_BASE}/training-contents/?subtopiccontent=${current.subtopiccontent_id}`);
//         if (!response.ok) throw new Error("Failed to fetch training contents");
//         const data: TrainingContent[] = await response.json();
//         setTrainingContents(data);
//       } catch (error) { console.error("Error fetching training contents:", error); setTrainingContents([]); }
//     };
//     fetchTrainingContents();
//   }, [activeTab, subtopicContents, isRevisionTab]);

//   useEffect(() => {
//     const fetchQuestions = async () => {
//       if (isRevisionTab) {
//         const activeTabIndex = parseInt(activeTab.replace("tab", ""), 10) - 1;
//         const current = subtopicContents[activeTabIndex];
//         if (!current) return;
//         try {
//           const res = await fetch(`${API_BASE}/questions/?subtopiccontent=${current.subtopiccontent_id}`);
//           if (!res.ok) throw new Error("Failed to fetch questions");
//           const data: Question[] = await res.json();
//           setQuestions(data);
//         } catch (error) { console.error("Error fetching questions:", error); setQuestions([]); }
//       }
//     };
//     if (subtopicContents.length > 0) fetchQuestions();
//   }, [isRevisionTab, activeTab, subtopicContents]);

//   // --- HELPER FUNCTIONS ---
//   const resetForm = () => {
//     setQuestionFormData(initialFormState);
//     setEditingQuestionId(null);
//     setFormError(null);
//     if(questionImageInputRef.current) questionImageInputRef.current.value = "";
//     optionImageInputRefs.current.forEach(ref => { if(ref) ref.value = ""; });
//   };

//   const loadQuestionForEdit = (question: Question) => {
//     setEditingQuestionId(question.id);
//     setQuestionFormData({
//       question_text: question.question_text || "",
//       imageFile: null,
//       previewUrl: question.question_image_url || null,
//       options: question.options.map(opt => ({
//         option_text: opt.option_text || "",
//         is_correct: opt.is_correct,
//         imageFile: null,
//         previewUrl: opt.option_image_url || null
//       }))
//     });
//     setFormError(null);
//   };

//   const onTabClick = (tabId: string) => {
//     setActiveTab(tabId);
//     setQuizMode(false);
//     setShowResults(false);
//     setShowManager(false);
//     resetForm();
//   };

//   // --- HANDLERS (REVISION) ---
//   const handleStartAssessment = () => { setShowResults(false); setShowManager(false); setCurrentQuestionIndex(0); setSelectedAnswers({}); setQuizMode(true); };
//   const handleResetQuiz = () => { setShowResults(false); setQuizMode(false); setCurrentQuestionIndex(0); setSelectedAnswers({}); }
//   const handleAnswerSelect = (questionId: number, selectedOption: Option) => setSelectedAnswers(prev => ({ ...prev, [questionId]: { selectedOptionId: selectedOption.id, isCorrect: selectedOption.is_correct } }));
//   const handleNextQuestion = () => { if (currentQuestionIndex < questions.length - 1) setCurrentQuestionIndex(prev => prev + 1); };
//   const handleFinishAssessment = () => setShowResults(true);

//   // --- HANDLERS (MANAGER) ---
//   const handleQuestionTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => setQuestionFormData({ ...questionFormData, question_text: e.target.value });
//   const handleQuestionImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files && e.target.files[0]) {
//       const file = e.target.files[0];
//       setQuestionFormData({ ...questionFormData, imageFile: file, previewUrl: URL.createObjectURL(file) });
//     }
//   };
//   const handleOptionTextChange = (index: number, value: string) => { 
//     const opts = [...questionFormData.options]; opts[index].option_text = value; setQuestionFormData({ ...questionFormData, options: opts }); 
//   };
//   const handleOptionImageChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files && e.target.files[0]) {
//       const file = e.target.files[0];
//       const opts = [...questionFormData.options];
//       opts[index].imageFile = file;
//       opts[index].previewUrl = URL.createObjectURL(file);
//       setQuestionFormData({ ...questionFormData, options: opts });
//     }
//   };
//   const handleCorrectOptionChange = (index: number) => { 
//     const opts = questionFormData.options.map((opt, i) => ({ ...opt, is_correct: i === index })); 
//     setQuestionFormData({ ...questionFormData, options: opts }); 
//     setFormError(null);
//   };
//   const handleAddOption = () => setQuestionFormData({ ...questionFormData, options: [...questionFormData.options, { option_text: "", is_correct: false, imageFile: null, previewUrl: null }] });
//   const handleRemoveOption = (index: number) => { 
//     if (questionFormData.options.length <= 2) return; 
//     const opts = questionFormData.options.filter((_, i) => i !== index); 
//     setQuestionFormData({ ...questionFormData, options: opts }); 
//   };
  
//   const handleDeleteQuestion = async (questionId: number) => { 
//     if (!window.confirm("Delete this question?")) return; 
//     try { 
//       await axios.delete(`${API_BASE}/questions/${questionId}/`); 
//       setQuestions(prev => prev.filter(q => q.id !== questionId)); 
//       if (editingQuestionId === questionId) resetForm();
//     } catch (error) { alert("Failed to delete question."); } 
//   };

//   const handleQuestionFormSubmit = async () => {
//     const hasQuestion = questionFormData.question_text.trim() || questionFormData.imageFile || questionFormData.previewUrl;
//     const hasCorrect = questionFormData.options.some(opt => opt.is_correct);
//     const validOptions = questionFormData.options.filter(opt => opt.option_text.trim() || opt.previewUrl || opt.imageFile);
    
//     if (!hasQuestion) { setFormError("Please enter a question text or upload an image."); return; }
//     if (validOptions.length < 2) { setFormError("Please provide at least two valid options."); return; }
//     if (!hasCorrect) { setFormError("Please select the correct answer."); return; }

//     const activeTabIndex = parseInt(activeTab.replace("tab", ""), 10) - 1;
//     const currentSubtopicContent = subtopicContents[activeTabIndex];
    
//     const formData = new FormData();
//     formData.append("subtopiccontent", String(currentSubtopicContent.subtopiccontent_id));
//     formData.append("question_text", questionFormData.question_text);
//     if (questionFormData.imageFile) formData.append("question_image", questionFormData.imageFile);

//     questionFormData.options.forEach((opt, index) => {
//       formData.append(`options[${index}]option_text`, opt.option_text);
//       formData.append(`options[${index}]is_correct`, opt.is_correct ? "true" : "false");
//       if (opt.imageFile) formData.append(`options[${index}]option_image`, opt.imageFile);
//     });

//     const config = { headers: { "Content-Type": "multipart/form-data" } };

//     try {
//       let savedQuestion;
//       if (editingQuestionId) {
//         const response = await axios.put(`${API_BASE}/questions/${editingQuestionId}/`, formData, config);
//         savedQuestion = response.data;
//         setQuestions(prev => prev.map(q => q.id === editingQuestionId ? savedQuestion : q));
//       } else {
//         const response = await axios.post(`${API_BASE}/questions/`, formData, config);
//         savedQuestion = response.data;
//         setQuestions(prev => [...prev, savedQuestion]);
//       }
//       resetForm();
//     } catch (error) { console.error(error); setFormError("Failed to save question."); }
//   };

//   // --- HANDLERS (UPLOAD) ---
//   const handleUploadSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     const activeTabIndex = parseInt(activeTab.replace("tab", ""), 10) - 1;
//     const current = subtopicContents[activeTabIndex];
//     if (!current) return;
//     const formData = new FormData();
//     formData.append("description", newMaterial.description);
//     formData.append("subtopiccontent", String(current.subtopiccontent_id));
//     if (uploadType === "file" && newMaterial.file) formData.append("training_file", newMaterial.file);
//     else if (uploadType === "link" && newMaterial.url) formData.append("url_link", newMaterial.url);
    
//     try {
//       setUploadLoading(true);
//       const res = await fetch(`${API_BASE}/training-contents/`, { method: "POST", body: formData });
//       if (!res.ok) throw new Error("Upload failed");
//       const created: TrainingContent = await res.json();
//       setTrainingContents((prev) => [...prev, created]);
//       setNewMaterial({ description: "", file: null, url: "" });
//       setShowUploadModal(false);
//     } catch (err) { alert("Error uploading."); } finally { setUploadLoading(false); }
//   };

//   const handleContentFileChange = (e: React.ChangeEvent<HTMLInputElement>) => { if (e.target.files?.length) setNewMaterial({ ...newMaterial, file: e.target.files[0] }); };
//   const triggerContentFileInput = () => contentFileInputRef.current?.click();
//   const handleMaterialClick = (content: TrainingContent) => { if (content.url_link) window.open(content.url_link, "_blank"); else if (content.training_file) window.open(content.training_file, "_blank"); };
//   const handleDeleteContent = async (contentId: number) => { if (window.confirm("Are you sure?")) { await axios.delete(`${API_BASE}/training-contents/${contentId}/`); setTrainingContents(prev => prev.filter(c => c.id !== contentId)); }};

//   // --- RENDER HELPERS ---
//   const getFileIcon = (content: TrainingContent) => content.url_link ? <Link className="w-6 h-6 text-blue-500" /> : <FileText className="w-6 h-6 text-gray-500" />;
//   const getLetter = (index: number) => String.fromCharCode(65 + index);

//   // --- COMPONENT RENDER ---
//   if (loading) return (<div className="flex h-screen items-center justify-center"><div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600"></div></div>);
//   if (error) return (<div className="flex h-screen items-center justify-center text-red-600 font-semibold">Error: {error}</div>);

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 font-sans flex flex-col h-screen overflow-hidden">
      
//       {/* MAIN LAYOUT */}
//       <div className="flex flex-1 h-full overflow-hidden">
        
//         {/* SIDEBAR */}
//         <div className="w-80 bg-white shadow-lg border-r border-gray-200 flex flex-col z-20 h-full">
//           <div className="p-6 border-b border-gray-200">
//             <div className="flex items-center space-x-3 mb-2">
//               <BookOpen className="w-6 h-6 text-blue-600" />
//               <h2 className="text-xl font-bold text-gray-900">Lesson Contents</h2>
//             </div>
//           </div>
//           <nav className="p-6 flex-1 overflow-y-auto custom-scrollbar">
//             <div className="space-y-3">
//               {detailTabs.map((tab, index) => (
//                 <button 
//                   key={tab.id} 
//                   onClick={() => onTabClick(tab.id)} 
//                   className={`w-full p-4 text-left rounded-xl transition-all duration-200 flex items-center group ${activeTab === tab.id ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg" : "text-gray-700 hover:bg-blue-50 hover:text-blue-700"}`}
//                 > 
//                   <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-4 text-sm font-bold ${activeTab === tab.id ? "bg-white/20 text-white" : "bg-blue-100 text-blue-600 group-hover:bg-blue-200"}`}>
//                     {index + 1}
//                   </div> 
//                   <div className="flex-1">
//                     <span className="font-semibold text-sm block">{tab.title.length > 20 ? tab.title.slice(0, 20) + '...' : tab.title}</span>
//                     <span className={`text-xs ${activeTab === tab.id ? "text-blue-100" : "text-gray-500"}`}>Module {index + 1}</span>
//                   </div> 
//                 </button>
//               ))}
//             </div>
//           </nav>
//         </div>

//         {/* CONTENT AREA */}
//         <div className="flex-1 flex flex-col h-full overflow-hidden bg-gray-50 relative">
          
//           {/* TOP HEADER */}
//           <div className="px-8 py-6 flex justify-between items-center shrink-0">
//             <div>
//                 <h1 className="text-3xl font-bold text-gray-900 tracking-tight">{activeTabData?.title || "Loading..."}</h1>
//             </div>
            
//             {isRevisionTab && (
//                 <button 
//                     onClick={() => setShowManager(!showManager)} 
//                     className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all shadow-sm border font-medium ${showManager ? 'bg-white text-red-600 border-red-200 hover:bg-red-50' : 'bg-white text-indigo-600 border-indigo-200 hover:bg-indigo-50'}`}
//                 >
//                     {showManager ? (
//                         <><ArrowLeft className="w-5 h-5" /> Back to Assessment</>
//                     ) : (
//                         <><Settings className="w-5 h-5" /> Manage Questions</>
//                     )}
//                 </button>
//             )}
//           </div>

//           {/* MAIN BODY SCROLL AREA */}
//           <div className="flex-1 overflow-hidden px-8 pb-8">
//             {isRevisionTab ? (
//                 showManager ? (
//                 // --- QUESTION MANAGER VIEW (EMBEDDED) ---
//                 <div className="h-full flex flex-col animate-in fade-in duration-300">

//                     {/* SPLIT VIEW CONTAINER */}
//                     <div className="flex gap-6 flex-1 overflow-hidden min-h-0">
                        
//                         {/* LEFT: EDITOR */}
//                         <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col overflow-hidden">
//                             <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50 shrink-0">
//                                 <div>
//                                     <h3 className="text-lg font-bold text-gray-800">{editingQuestionId ? "Edit Question" : "Create New Question"}</h3>
//                                     <p className="text-sm text-gray-500">Fill in the details below</p>
//                                 </div>
//       <button
//   onClick={() => setShowBulkUploadModal(true)}
//   className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-5 py-2.5 rounded-lg font-semibold text-sm shadow-md transition-all duration-200 active:scale-95 whitespace-nowrap"
// >
//   <UploadCloud className="w-4 h-4" />
//   Bulk Upload
// </button>
               
//                             </div>




// <button
//   onClick={resetForm}
//   className="inline-flex items-center gap-1
//              text-base text-gray-700 hover:text-indigo-600
//              px-1.5 py-0.5
//              bg-white border-r-[5px] border-gray-400
//              rounded-sm shadow-sm transition-colors"
// >
//   <RefreshCw className="w-4 h-4" /> Reset
// </button>



//                             <div className="flex-1 overflow-y-auto p-6 space-y-6">
//                                 {/* Question Text */}
//                                 <div>
//                                     <label className="flex items-center gap-2 text-sm font-semibold text-gray-600 mb-2"><Edit className="w-4 h-4" /> Question Text</label>
//                                     <textarea value={questionFormData.question_text} onChange={handleQuestionTextChange} placeholder="Type your question here..." className="w-full p-4 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none h-32 text-gray-700 text-sm" />
//                                 </div>

//                                 {/* Question Image */}
//                                 <div>
//                                     <label className="flex items-center gap-2 text-sm font-semibold text-gray-600 mb-2"><Upload className="w-4 h-4" /> Question Image (Optional)</label>
//                                     <div className="flex items-center gap-3 p-2 border border-gray-200 rounded-lg bg-white">
//                                         <input type="file" accept="image/*" ref={questionImageInputRef} onChange={handleQuestionImageChange} className="hidden" />
//                                         <button type="button" onClick={() => questionImageInputRef.current?.click()} className="bg-gray-100 hover:bg-gray-200 text-gray-600 px-4 py-2 rounded text-sm font-medium transition-colors">Choose File</button>
//                                         <span className="text-sm text-gray-400 truncate flex-1">{questionFormData.imageFile ? questionFormData.imageFile.name : "No file chosen"}</span>
//                                     </div>
//                                     {questionFormData.previewUrl && (
//                                         <div className="mt-3 relative w-fit group">
//                                             <img src={questionFormData.previewUrl} alt="Preview" className="h-32 rounded-lg border border-gray-200 object-cover" />
//                                             <button onClick={() => { setQuestionFormData({...questionFormData, imageFile: null, previewUrl: null}); if(questionImageInputRef.current) questionImageInputRef.current.value = ""; }} className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"><X className="w-3 h-3" /></button>
//                                         </div>
//                                     )}
//                                 </div>

//                                 {/* Options */}
//                                 <div>
//                                     <label className="flex items-center gap-2 text-sm font-semibold text-gray-600 mb-4"><List className="w-4 h-4" /> Answer Options</label>
//                                     <div className="space-y-3">
//                                         {questionFormData.options.map((option, idx) => (
//                                             <div key={idx} className="flex items-start gap-3 p-3 border border-gray-100 rounded-xl bg-gray-50/30 hover:bg-white hover:shadow-sm transition-all group">
//                                                 <div className="flex-shrink-0 w-8 h-8 rounded bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-sm mt-1">{getLetter(idx)}</div>
//                                                 <div className="flex-1 space-y-2">
//                                                     <input type="text" value={option.option_text} onChange={(e) => handleOptionTextChange(idx, e.target.value)} placeholder={`Option ${getLetter(idx)} text`} className="w-full px-3 py-2 bg-white border border-gray-200 rounded-md text-sm focus:ring-1 focus:ring-indigo-500" />
//                                                     <div className="flex items-center gap-2">
//                                                         <input type="file" accept="image/*" className="hidden" ref={el => optionImageInputRefs.current[idx] = el} onChange={(e) => handleOptionImageChange(idx, e)} />
//                                                         <button type="button" onClick={() => optionImageInputRefs.current[idx]?.click()} className="text-xs bg-white border px-2 py-1 rounded hover:bg-gray-50 text-gray-500">{option.imageFile ? "Change Image" : "Choose File"}</button>
//                                                         <span className="text-xs text-gray-400 truncate max-w-[100px]">{option.imageFile ? option.imageFile.name : "No file"}</span>
//                                                         {option.previewUrl && <img src={option.previewUrl} alt="opt" className="w-6 h-6 rounded object-cover border" />}
//                                                     </div>
//                                                 </div>
//                                                 <div className="flex flex-col items-center gap-1 pt-2">
//                                                     <label className="cursor-pointer flex items-center gap-2"><input type="radio" name="is_correct" checked={option.is_correct} onChange={() => handleCorrectOptionChange(idx)} className="w-4 h-4 text-indigo-600" /><span className="text-xs font-medium text-gray-500">Correct</span></label>
//                                                     {questionFormData.options.length > 2 && <button onClick={() => handleRemoveOption(idx)} className="text-gray-300 hover:text-red-500"><Trash2 className="w-4 h-4"/></button>}
//                                                 </div>
//                                             </div>
//                                         ))}
//                                         <button onClick={handleAddOption} className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 px-2 py-1"><Plus className="w-3 h-3"/> Add Option</button>
//                                     </div>
//                                 </div>
//                             </div>

//                             {/* Editor Footer */}
//                             <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-between items-center shrink-0">
//                                 <div className="text-red-500 text-xs flex items-center gap-1">{formError && <><AlertCircle className="w-3 h-3" /> {formError}</>}</div>
//                                 <button onClick={handleQuestionFormSubmit} className="bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-2 rounded-lg shadow-lg shadow-indigo-200 flex items-center gap-2 font-semibold transition-transform active:scale-95"><Save className="w-4 h-4" /> {editingQuestionId ? "Update Question" : "Save Question"}</button>
//                             </div>
//                         </div>
                        

            
//                         {/* RIGHT: LIST */}
//                         <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col overflow-hidden shrink-0">
//                             <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-indigo-50/30 shrink-0">
//                                 <div className="flex items-center gap-2">
//                                     <div className="p-1 bg-green-500 rounded text-white"><List className="w-4 h-4"/></div>
//                                     <span className="font-bold text-gray-800">Questions</span>
//                                 </div>
                                
//                                 <span className="bg-indigo-100 text-indigo-700 text-xs font-bold px-2 py-1 rounded-full">{questions.length}</span>
//                             </div>
                            
//                             <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50/50">
//                                 {questions.length === 0 ? (
//                                     <div className="h-full flex flex-col items-center justify-center text-center p-8 opacity-60">
//                                         <Search className="w-16 h-16 text-gray-300 mb-4" />
//                                         <h4 className="font-bold text-xl text-gray-600">No Questions Yet</h4>
//                                         <p className="text-sm text-gray-400 mt-2">Use the form on the left to create your first question.</p>
//                                     </div>
//                                 ) : (
//                                     questions.map((q, i) => (
//                                         <div 
//                                             key={q.id} 
//                                             onClick={() => loadQuestionForEdit(q)} 
//                                             className={`flex gap-4 p-4 rounded-xl border cursor-pointer transition-all duration-200 group relative ${
//                                                 editingQuestionId === q.id 
//                                                 ? "bg-white border-indigo-500 ring-1 ring-indigo-500 shadow-md z-10" 
//                                                 : "bg-white border-gray-200 hover:border-indigo-300 hover:shadow-sm"
//                                             }`}
//                                         >
//                                             {/* Image Thumbnail */}
//                                             {q.question_image_url && (
//                                                 <div className="shrink-0 w-20 h-20 rounded-lg border border-gray-100 overflow-hidden bg-gray-50">
//                                                     <img 
//                                                         src={q.question_image_url} 
//                                                         alt="thumb" 
//                                                         className="w-full h-full object-cover" 
//                                                     />
//                                                 </div>
//                                             )}

//                                             {/* Main Content */}
//                                             <div className="flex-1 min-w-0 flex flex-col justify-between">
//                                                 <div className="flex justify-between items-start gap-2">
//                                                     <div className="flex items-center gap-2 mb-1">
//                                                         <span className={`text-xs font-bold px-2 py-0.5 rounded ${editingQuestionId === q.id ? "bg-indigo-100 text-indigo-700" : "bg-gray-100 text-gray-500"}`}>
//                                                             Question {i + 1}
//                                                         </span>
//                                                     </div>
//                                                 </div>

//                                                 <p className="text-sm text-gray-800 font-medium leading-relaxed line-clamp-2 mb-2">
//                                                     {q.question_text || <span className="italic text-gray-400">Image Question (No Text)</span>}
//                                                 </p>

//                                                 {/* Answer Indicators */}
//                                                 <div className="flex items-center gap-1.5">
//                                                     {q.options.map((o, oid) => (
//                                                         <div 
//                                                             key={oid} 
//                                                             className={`w-2.5 h-2.5 rounded-full border ${o.is_correct ? "bg-green-500 border-green-600" : "bg-gray-100 border-gray-300"}`} 
//                                                             title={o.is_correct ? "Correct Answer" : `Option ${getLetter(oid)}`}
//                                                         />
//                                                     ))}
//                                                 </div>
//                                             </div>

//                                             {/* Delete Button */}
//                                             <button 
//                                                 onClick={(e) => { e.stopPropagation(); handleDeleteQuestion(q.id); }} 
//                                                 className="absolute top-3 right-3 p-1.5 text-gray-300 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
//                                                 title="Delete Question"
//                                             >
//                                                 <Trash2 className="w-4 h-4" />
//                                             </button>
//                                         </div>
//                                     ))
//                                 )}
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//                 ) : (
//                 // --- QUIZ / ASSESSMENT VIEW ---
//                 <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm relative min-h-[600px] flex flex-col h-full overflow-y-auto">
//                     {!showResults && !quizMode && (
//                         <div className="flex-1 flex items-center justify-center py-20 px-6">
//                             <div className="w-full max-w-2xl bg-white dark:bg-gray-900 rounded-3xl shadow-2xl border-2 border-gray-200 dark:border-gray-700 p-16 text-center">
//                                 <h2 className="text-5xl md:text-6xl font-black bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700 bg-clip-text text-transparent tracking-tight mb-6">
//                                     Start Revision
//                                 </h2>

//                                 <p className="text-2xl font-bold text-gray-800 dark:text-gray-100 flex items-center justify-center gap-3">
//                                     <span className="h-5 w-5 rounded-full bg-green-500 ring-4 ring-green-300"></span>
//                                     {questions.length} {questions.length === 1 ? "Question" : "Questions"} Ready
//                                 </p>

//                                 {questions.length > 0 && (
//                                     <p className="mt-4 text-lg text-gray-600 dark:text-gray-400 font-medium">
//                                         Revise smarter • Remember longer • Score higher
//                                     </p>
//                                 )}

//                                 <button
//                                     onClick={handleStartAssessment}
//                                     disabled={questions.length === 0}
//                                     className="mt-16 group relative w-80 h-80 rounded-full overflow-hidden shadow-2xl transition-all duration-300 hover:scale-105 hover:shadow-3xl active:scale-95 disabled:opacity-40 disabled:grayscale disabled:hover:scale-100 disabled:cursor-not-allowed border-8 border-white/40"
//                                 >
//                                     <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700"></div>
//                                     <div className="absolute inset-8 rounded-full bg-white/25 backdrop-blur-xl border-4 border-white/40"></div>
//                                     <div className="relative z-10 flex flex-col items-center justify-center h-full text-white">
//                                         <div className="mb-6 p-10 rounded-full bg-white/30 backdrop-blur-md shadow-2xl border-4 border-white/50 group-hover:scale-110 transition duration-300">
//                                             <Play className="w-24 h-24 fill-white ml-4" />
//                                         </div>
//                                         <span className="text-5xl font-black tracking-widest uppercase drop-shadow-2xl">
//                                             START
//                                         </span>
//                                         <span className="mt-3 text-xs font-semibold tracking-wider">
//                                             Begin Assessment
//                                         </span>
//                                     </div>
//                                 </button>

//                                 {questions.length === 0 && (
//                                     <div className="mt-12 p-6 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-2xl">
//                                         <p className="text-red-700 dark:text-red-400 font-medium text-lg">
//                                             No questions available yet. Please add some to begin.
//                                         </p>
//                                     </div>
//                                 )}
//                             </div>
//                         </div>
//                     )}

//                     {quizMode && !showResults && (
//                     // <div className="animate-in fade-in duration-300">
//                     //     {questions.length > 0 && (() => {
//                     //     const question = questions[currentQuestionIndex];
//                     //     const answerState = selectedAnswers[question.id];
//                     //     return (
//                     //         <div className="max-w-4xl mx-auto mt-4">
//                     //         <div className="flex justify-between items-center mb-6"><span className="text-sm font-bold text-blue-600 tracking-wider uppercase bg-blue-50 px-3 py-1 rounded-full">Question {currentQuestionIndex + 1} / {questions.length}</span><span className="text-sm text-gray-400 font-medium">{Math.round(((currentQuestionIndex) / questions.length) * 100)}%</span></div>
//                     //         <div className=" bg-gray-100 rounded-full h-2 mb-10"><div className="bg-gradient-to-r from-blue-500 to-indigo-500 h-2 rounded-full transition-all duration-500 ease-out" style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}></div></div>
//                     //         <div className="mb-10">
//                     //             {question.question_image_url && <div className="mb-8 rounded-2xl overflow-hidden border border-gray-200 shadow-sm max-h-96 flex justify-center bg-gray-50 p-4"><img src={question.question_image_url} alt="Question" className="max-w-full h-full object-contain rounded-lg" /></div>}
//                     //             <h3 className="text-2xl font-bold text-gray-800 leading-relaxed">{question.question_text}</h3>
//                     //         </div>
//                     //         <div className={`grid gap-5 mb-10 ${question.options.some(o => o.option_image_url) ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'}`}>
//                     //             {question.options.map((option, idx) => (
//                     //             <button key={option.id} onClick={() => handleAnswerSelect(question.id, option)} disabled={!!answerState} className={`relative block w-full text-left p-5 rounded-2xl border-2 transition-all h-full flex flex-col group ${!!answerState ? 'cursor-not-allowed opacity-90' : 'cursor-pointer hover:border-blue-400 hover:bg-blue-50/50 hover:shadow-md'} ${answerState?.selectedOptionId === option.id ? (answerState.isCorrect ? 'bg-green-50 border-green-500 text-green-800' : 'bg-red-50 border-red-500 text-red-800') : 'bg-white border-gray-200 text-gray-700'}`}>
//                     //                 <div className="flex items-start gap-4">
//                     //                 <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 font-bold text-sm transition-colors ${answerState?.selectedOptionId === option.id ? (answerState.isCorrect ? 'border-green-500 bg-green-500 text-white' : 'border-red-500 bg-red-500 text-white') : 'border-gray-300 text-gray-400 group-hover:border-blue-400 group-hover:text-blue-500'}`}>{answerState?.selectedOptionId === option.id ? (answerState.isCorrect ? <Check className="w-5 h-5" /> : <X className="w-5 h-5" />) : getLetter(idx)}</div>
//                     //                 <div className="flex-1">{option.option_image_url && <img src={option.option_image_url} alt="Option" className="w-full h-40 object-cover rounded-xl mb-4 border border-gray-100 shadow-sm" />}<span className="font-medium text-lg block leading-snug">{option.option_text}</span></div>
//                     //                 </div>
//                     //             </button>
//                     //             ))}
//                     //         </div>
//                     //         <div className="flex justify-end border-t border-gray-100 pt-8">
//                     //             {currentQuestionIndex < questions.length - 1 ? (<button onClick={handleNextQuestion} disabled={!answerState} className="flex items-center gap-2 px-8 py-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:bg-gray-200 disabled:text-gray-400 font-bold shadow-lg shadow-blue-200 transition-all active:scale-95"><span>Next Question</span> <ArrowLeft className="w-5 h-5 rotate-180"/></button>) : (<button onClick={handleFinishAssessment} disabled={!answerState} className="flex items-center gap-2 px-8 py-4 bg-green-600 text-white rounded-xl hover:bg-green-700 disabled:bg-gray-200 disabled:text-gray-400 font-bold shadow-lg shadow-green-200 transition-all active:scale-95"><span>Finish Assessment</span><CheckCircle className="w-5 h-5"/></button>)}
//                     //         </div>
//                     //         </div>
//                     //     );
//                     //     })()}
//                     // </div>


//                     <div className="animate-in fade-in duration-300">
//   {questions.length > 0 && (
//     <>
//       {(() => {
//         const question = questions[currentQuestionIndex];
//         const answerState = selectedAnswers[question.id];

//         return (
//           <div className="max-w-3xl mx-auto">
//             {/* Progress */}
//             <div className="flex justify-between items-center mb-4">
//               <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">
//                 Q{currentQuestionIndex + 1} / {questions.length}
//               </span>
//               <span className="text-xs text-gray-500">
//                 {Math.round(((currentQuestionIndex + 1) / questions.length) * 100)}%
//               </span>
//             </div>

//             {/* Progress Bar - Thinner */}
//             <div className="w-full bg-gray-200 rounded-full h-1.5 mb-6 overflow-hidden">
//               <div
//                 className="bg-gradient-to-r from-blue-500 to-indigo-600 h-full rounded-full transition-all duration-500 ease-out"
//                 style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
//               />
//             </div>

//             {/* Question */}
//             <div className="mb-6">
//               {question.question_image_url && (
//                 <div className="mb-5 rounded-xl overflow-hidden border border-gray-200 shadow-sm bg-gray-50 p-3">
//                   <img
//                     src={question.question_image_url}
//                     alt="Question"
//                     className="max-w-full max-h-40 mx-auto object-contain rounded-lg"
//                   />
//                 </div>
//               )}
//               <h3 className="text-lg font-semibold text-gray-800 leading-snug">
//                 {question.question_text || "(Image-based question)"}
//               </h3>
//             </div>

//             {/* Options - Compact Grid */}
//             <div
//               className={`grid gap-3 mb-8 ${
//                 question.options.some(o => o.option_image_url)
//                   ? 'grid-cols-1 sm:grid-cols-2'
//                   : 'grid-cols-1'
//               }`}
//             >
//               {question.options.map((option, idx) => (
//                 <button
//                   key={option.id}
//                   onClick={() => handleAnswerSelect(question.id, option)}
//                   disabled={!!answerState}
//                   className={`relative p-4 rounded-xl border-2 text-left transition-all duration-200 flex items-start gap-3 group ${
//                     !!answerState
//                       ? 'cursor-not-allowed opacity-90'
//                       : 'cursor-pointer hover:border-blue-400 hover:bg-blue-50/70 hover:shadow-sm'
//                   } ${
//                     answerState?.selectedOptionId === option.id
//                       ? answerState.isCorrect
//                         ? 'bg-green-50 border-green-500 text-green-800'
//                         : 'bg-red-50 border-red-500 text-red-800'
//                       : 'bg-white border-gray-300 text-gray-700'
//                   }`}
//                 >
//                   {/* Letter Circle */}
//                   <div
//                     className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center font-bold text-sm transition-all ${
//                       answerState?.selectedOptionId === option.id
//                         ? answerState.isCorrect
//                           ? 'bg-green-500 text-white border-green-600'
//                           : 'bg-red-500 text-white border-red-600'
//                         : 'border-2 border-gray-400 text-gray-600 group-hover:border-blue-500 group-hover:text-blue-600'
//                     }`}
//                   >
//                     {answerState?.selectedOptionId === option.id
//                       ? answerState.isCorrect
//                         ? <Check className="w-5 h-5" />
//                         : <X className="w-5 h-5" />
//                       : getLetter(idx)}
//                   </div>

//                   {/* Option Content */}
//                   <div className="flex-1 min-w-0">
//                     {option.option_image_url && (
//                       <img
//                         src={option.option_image_url}
//                         alt="Option"
//                         className="w-full h-20 object-cover rounded-lg mb-3 border border-gray-200"
//                       />
//                     )}
//                     <span className="text-sm font-medium leading-tight block">
//                       {option.option_text}
//                     </span>
//                   </div>
//                 </button>
//               ))}
//             </div>

//             {/* Navigation */}
//             <div className="flex justify-end pt-6 border-t border-gray-200">
//               {currentQuestionIndex < questions.length - 1 ? (
//                 <button
//                   onClick={handleNextQuestion}
//                   disabled={!answerState}
//                   className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:text-gray-500 shadow-md transition-all active:scale-95"
//                 >
//                   Next <ArrowLeft className="w-4 h-4 rotate-180" />
//                 </button>
//               ) : (
//                 <button
//                   onClick={handleFinishAssessment}
//                   disabled={!answerState}
//                   className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white text-sm font-semibold rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:text-gray-500 shadow-md transition-all active:scale-95"
//                 >
//                   Finish <CheckCircle className="w-4 h-4" />
//                 </button>
//               )}
//             </div>
//           </div>
//         );
//       })()}
//     </>
//   )}
// </div>
//                     )}

//                     {showResults && (
//                     <div className="text-center py-8 flex-1 flex flex-col items-center justify-center animate-in zoom-in duration-300">
//                         <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6"><CheckCircle className="w-12 h-12" /></div>
//                         <h3 className="text-4xl font-bold text-gray-900 mb-2">Assessment Complete!</h3>
//                         <div className="bg-gray-50 rounded-3xl p-10 mb-10 border border-gray-100 shadow-inner"><div className="text-6xl font-black text-gray-900 mb-2">{Object.values(selectedAnswers).filter(a => a.isCorrect).length} <span className="text-4xl text-gray-400 font-normal">/ {questions.length}</span></div><p className="text-indigo-600 font-bold text-lg uppercase tracking-wide">Correct Answers</p></div>
//                         <button onClick={handleResetQuiz} className="px-10 py-4 bg-gray-900 text-white rounded-xl hover:bg-gray-800 font-bold shadow-xl shadow-gray-200 transition-transform hover:scale-105 flex items-center gap-2"><RefreshCw className="w-5 h-5"/> Back</button>
//                     </div>
//                     )}
//                 </div>
//                 )
//             ) : (
//               // --- TRAINING CONTENT TAB ---
//               <div className="h-full flex flex-col">
//                 <div className="flex justify-between items-center mb-6 shrink-0"><div><h2 className="text-2xl font-bold text-gray-900">Training Materials</h2><p className="text-gray-600 mt-1">Resources for this module</p></div><div className="flex items-center space-x-4"><button onClick={() => setShowUploadModal(true)} className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold shadow-sm shadow-blue-200 transition-all active:scale-95"><Upload className="w-4 h-4" /><span>Upload Material</span></button><div className="flex bg-white rounded-lg border border-gray-200 p-1 shadow-sm"><button onClick={() => setViewType("grid")} className={`p-2 rounded-md transition-all ${viewType === "grid" ? "bg-blue-100 text-blue-700 shadow-sm" : "text-gray-400 hover:bg-gray-50"}`}><Grid className="w-4 h-4" /></button><button onClick={() => setViewType("list")} className={`p-2 rounded-md transition-all ${viewType === "list" ? "bg-blue-100 text-blue-700 shadow-sm" : "text-gray-400 hover:bg-gray-50"}`}><List className="w-4 h-4" /></button></div></div></div>
//                 <div className="flex-1 overflow-y-auto">
//                     {trainingContents.length > 0 ? (
//                     <div className={viewType === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-3"}>
//                         {trainingContents.map(content => (
//                             <div key={content.id} className={`group bg-white rounded-xl border hover:border-blue-300 transition-all cursor-pointer ${viewType === 'grid' ? 'p-6 hover:shadow-lg' : 'p-4 flex items-center justify-between hover:shadow-md'}`} onClick={() => handleMaterialClick(content)}>
//                                 <div className={`flex items-start ${viewType === 'list' ? 'flex-1' : ''}`}>
//                                     <div className="p-3 bg-gray-50 rounded-lg mr-4 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">{getFileIcon(content)}</div>
//                                     <div><h3 className="font-semibold text-gray-900 group-hover:text-blue-700">{content.description}</h3><p className="text-sm text-gray-400 mt-1">{content.training_file ? "File" : "External Link"}</p></div>
//                                 </div>
//                                 <button onClick={(e) => { e.stopPropagation(); handleDeleteContent(content.id); }} className={`p-2 rounded-lg text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors ${viewType === 'grid' ? 'absolute top-4 right-4 opacity-0 group-hover:opacity-100' : ''}`}><Trash2 className="w-4 h-4" /></button>
//                             </div>
//                         ))}
//                     </div>
//                     ) : (<div className="h-96 flex flex-col items-center justify-center bg-white rounded-xl border-2 border-dashed border-gray-300 p-8 text-center"><div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4"><Upload className="w-8 h-8 text-gray-400"/></div><h3 className="text-xl font-bold text-gray-900">No Materials Yet</h3><p className="text-gray-500 mt-2">Upload the first training material for this module.</p></div>)}
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* UPLOAD MODAL */}
//       {showUploadModal && (
//         <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-[60]">
//           <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
//             <div className="p-6 border-b bg-gray-50"><h2 className="text-xl font-bold text-gray-900">Upload New Material</h2></div>
//             <form onSubmit={handleUploadSubmit} className="p-6">
//               <div className="space-y-6">
//                 <div><label className="block text-sm font-bold text-gray-700 mb-2">Description</label><input type="text" value={newMaterial.description} onChange={(e) => setNewMaterial({ ...newMaterial, description: e.target.value })} className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all" required placeholder="e.g. Lecture Slides" /></div>
//                 <div><label className="block text-sm font-bold text-gray-700 mb-3">Material Type</label><div className="grid grid-cols-2 gap-4"><button type="button" onClick={() => setUploadType("file")} className={`p-4 rounded-xl border-2 font-medium transition-all ${uploadType === "file" ? "border-blue-500 bg-blue-50 text-blue-700" : "border-gray-200 text-gray-600 hover:bg-gray-50"}`}>Upload File</button><button type="button" onClick={() => setUploadType("link")} className={`p-4 rounded-xl border-2 font-medium transition-all ${uploadType === "link" ? "border-blue-500 bg-blue-50 text-blue-700" : "border-gray-200 text-gray-600 hover:bg-gray-50"}`}>Web Link</button></div></div>
//                 {uploadType === "file" ? (<div><label className="block text-sm font-bold text-gray-700 mb-2">File</label><input type="file" ref={contentFileInputRef} onChange={handleContentFileChange} className="hidden" /><div onClick={triggerContentFileInput} className="w-full p-8 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer text-center hover:bg-gray-50 hover:border-blue-400 transition-all"><p className="text-gray-500 font-medium">{newMaterial.file ? newMaterial.file.name : "Click to choose a file"}</p></div></div>) : (<div><label className="block text-sm font-bold text-gray-700 mb-2">URL Link</label><input type="url" value={newMaterial.url} onChange={(e) => setNewMaterial({ ...newMaterial, url: e.target.value })} className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="https://..." /></div>)}
//               </div>
//               <div className="mt-8 flex justify-end space-x-3"><button type="button" onClick={() => setShowUploadModal(false)} className="px-6 py-2.5 text-gray-600 hover:bg-gray-100 rounded-lg font-medium transition-colors">Cancel</button><button type="submit" className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium shadow-lg shadow-blue-200 transition-all active:scale-95" disabled={uploadLoading}>{uploadLoading ? "Uploading..." : "Save Material"}</button></div>
//             </form>
//           </div>
//         </div>
//       )}
//       {/* BULK UPLOAD QUESTIONS MODAL */}
// {showBulkUploadModal && (
//   <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-[80]">
//     <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
//       {/* Header */}
//       <div className="p-6 bg-gradient-to-r from-indigo-600 to-purple-700 text-white">
//         <h2 className="text-2xl font-bold flex items-center gap-3">
//           <UploadCloud className="w-8 h-8" />
//           Bulk Upload Questions 
//         </h2>
//         <p className="text-indigo-100 mt-1">Embed images directly in Excel – no separate files needed!</p>
//       </div>

//       <div className="flex-1 overflow-y-auto p-8">
//         <div className="space-y-7">

//           {/* Download Template */}
//           <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-5 text-center">
//             <p className="text-lg font-bold text-blue-900 mb-3">First, download the template</p>
//             <a
//               href={`${API_BASE}/questions/download-template/?subtopiccontent=${subtopicContents[parseInt(activeTab.replace('tab', ''), 10) - 1]?.subtopiccontent_id}`}
//               className="inline-flex items-center gap-3 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-lg shadow-lg transition transform hover:scale-105"
//             >
//               Download Excel Template
//             </a>
//             {/* <p className="text-sm text-blue-700 mt-3">
//               Fill it, insert images directly into cells, then upload below
//             </p> */}
//           </div>

//           {/* File Upload */}
//           <div>
//             <label className="block text-lg font-bold text-gray-800 mb-4">Upload Filled Excel File</label>
//             <input
//               type="file"
//               accept=".xlsx"
//               ref={bulkFileInputRef}
//               onChange={(e) => e.target.files && setBulkFile(e.target.files[0])}
//               className="hidden"
//             />
//             <div
//               onClick={() => bulkFileInputRef.current?.click()}
//               className="border-4 border-dashed border-gray-300 rounded-2xl p-12 text-center cursor-pointer hover:border-indigo-500 hover:bg-indigo-50 transition-all"
//             >
//               <UploadCloud className="w-20 h-20 mx-auto text-gray-400 mb-4" />
//               <p className="text-xl font-semibold text-gray-700">
//                 {bulkFile ? bulkFile.name : "Click or drop your Excel file here"}
//               </p>
//               {bulkFile && (
//                 <p className="text-sm text-green-600 mt-2 font-medium">
//                   Ready to upload
//                 </p>
//               )}
//             </div>
//           </div>

//           {/* Instructions */}
//           <div className="bg-amber-50 border-2 border-amber-200 rounded-xl p-5">
//             <h4 className="font-bold text-amber-900 mb-2">How to Add Images in Excel:</h4>
//             <ol className="text-sm text-amber-800 space-y-1 list-decimal pl-5">
//               <li>Go to any image column (e.g., "Option A Image")</li>
//               <li>Right-click → <strong>Insert → Pictures → This Device</strong></li>
//               <li>Choose image → Resize to fit cell</li>
//               <li>Correct answer must match text (even for image options)</li>
//             </ol>
//           </div>
//         </div>
//       </div>

//       {/* Footer */}
//       <div className="p-6 border-t bg-gray-50 flex justify-end gap-4">
//         <button
//           onClick={() => {
//             setShowBulkUploadModal(false);
//             setBulkFile(null);
//           }}
//           className="px-6 py-3 bg-gray-200 hover:bg-gray-300 rounded-xl font-medium"
//         >
//           Cancel
//         </button>
//         <button
//           onClick={async () => {
//             if (!bulkFile) return alert("Please select a file");

//             setBulkUploading(true);
//             const formData = new FormData();
//             formData.append("file", bulkFile);
//             const currentSubtopic = subtopicContents[parseInt(activeTab.replace("tab", ""), 10) - 1];
//             formData.append("subtopiccontent", String(currentSubtopic.subtopiccontent_id));

//             try {
//               const res = await fetch(`${API_BASE}/questions/bulk-upload/`, {
//                 method: "POST",
//                 body: formData,
//               });
//               const data = await res.json();

//               if (!res.ok) throw new Error(data.detail || "Upload failed");

//               alert(`Success! ${data.created+1} questions uploaded`);
//               setQuestions(prev => [...prev, ...data.questions || []]);
//               setShowBulkUploadModal(false);
//               setBulkFile(null);
//             } catch (err: any) {
//               alert("Upload failed: " + err.message);
//             } finally {
//               setBulkUploading(false);
//             }
//           }}
//           disabled={!bulkFile || bulkUploading}
//           className="px-10 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl font-bold shadow-xl disabled:opacity-50 flex items-center gap-3"
//         >
//           {bulkUploading ? "Uploading..." : (
//             <>
//               <UploadCloud className="w-5 h-5" />
//               Upload & Import
//             </>
//           )}
//         </button>
//       </div>
//     </div>
//   </div>
// )}
//     </div>
//   );
// }






import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { 
  ArrowLeft, BookOpen, Edit, Grid, List, Trash2, Upload, 
  FileText, Link, Play, Settings, Plus, X, CheckCircle, AlertCircle, 
  Save, Search, Check, RefreshCw, UploadCloud
} from 'lucide-react';

const API_BASE = "http://127.0.0.1:8000";

// --- INTERFACES ---
interface TabData { id: string; title: string; content: string; }
interface TrainingContent { id: number; description: string; training_file?: string | null; url_link?: string | null; subtopiccontent: number; }
interface SubtopicContent { subtopiccontent_id: number; subtopic: number; content: string; }

interface Option { 
  id?: number; 
  option_text: string; 
  option_image_url?: string; 
  is_correct: boolean; 
}

interface Question { 
  id: number; 
  question_text: string; 
  question_image_url?: string; 
  options: Option[]; 
}

interface OptionFormState {
  option_text: string;
  is_correct: boolean;
  imageFile: File | null;
  previewUrl: string | null;
}

interface QuestionFormState {
  question_text: string;
  imageFile: File | null;
  previewUrl: string | null;
  options: OptionFormState[];
}

export default function Level1Detailed() {
  const { id } = useParams();
  const navigate = useNavigate();

  // --- STATE ---
  const [activeTab, setActiveTab] = useState<string>("tab1");
  const [trainingContents, setTrainingContents] = useState<TrainingContent[]>([]);
  
  // Upload State
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadType, setUploadType] = useState<"file" | "link">("file");
  const [newMaterial, setNewMaterial] = useState<{ description: string; file: File | null; url: string }>({ description: "", file: null, url: "" });
  const [uploadLoading, setUploadLoading] = useState(false);
  const contentFileInputRef = useRef<HTMLInputElement>(null);

  // Data State
  const [subtopicContents, setSubtopicContents] = useState<SubtopicContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewType, setViewType] = useState<"grid" | "list">("grid");
  const subtopicId = id ? parseInt(id, 10) : 1;

  // REVISION & Manager State
  const [questions, setQuestions] = useState<Question[]>([]);
  const [quizMode, setQuizMode] = useState(false);
  const [showManager, setShowManager] = useState(false); 
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [questionId: number]: { selectedOptionId: number | undefined; isCorrect: boolean } }>({});
  const [showResults, setShowResults] = useState(false);

  // Question Form State
  const [editingQuestionId, setEditingQuestionId] = useState<number | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const questionImageInputRef = useRef<HTMLInputElement>(null);
  const optionImageInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const [showBulkUploadModal, setShowBulkUploadModal] = useState(false);
  const [bulkFile, setBulkFile] = useState<File | null>(null);
  const [bulkUploading, setBulkUploading] = useState(false);
  const bulkFileInputRef = useRef<HTMLInputElement>(null);

  const initialFormState: QuestionFormState = {
    question_text: "",
    imageFile: null,
    previewUrl: null,
    options: [
      { option_text: "", is_correct: false, imageFile: null, previewUrl: null },
      { option_text: "", is_correct: false, imageFile: null, previewUrl: null },
      { option_text: "", is_correct: false, imageFile: null, previewUrl: null },
      { option_text: "", is_correct: false, imageFile: null, previewUrl: null }
    ],
  };

  const [questionFormData, setQuestionFormData] = useState<QuestionFormState>(initialFormState);

  // --- DERIVED STATE ---
  const detailTabs: TabData[] = subtopicContents.map((c, i) => ({ id: `tab${i + 1}`, title: c.content, content: c.content }));
  const activeTabData = detailTabs.find((tab) => tab.id === activeTab) || detailTabs[0];
  const isRevisionTab = activeTabData?.title?.toUpperCase() === "REVISION";

  // --- DATA FETCHING ---
  useEffect(() => {
    const fetchSubtopicContents = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_BASE}/subtopic-contents/?subtopic=${subtopicId}`);
        if (!res.ok) throw new Error("Network response was not ok");
        const data: SubtopicContent[] = await res.json();
        if (!data.length) { navigate("/lesson-details/1", { replace: true }); return; }
        setSubtopicContents(data);
        setLoading(false);
      } catch (err) { console.error(err); setError("Failed to load lesson contents"); setLoading(false); }
    };
    fetchSubtopicContents();
  }, [subtopicId, navigate]);

  useEffect(() => {
    const fetchTrainingContents = async () => {
      if (subtopicContents.length === 0 || isRevisionTab) return;
      const activeTabIndex = parseInt(activeTab.replace("tab", ""), 10) - 1;
      const current = subtopicContents[activeTabIndex];
      if (!current) return;
      try {
        const response = await fetch(`${API_BASE}/training-contents/?subtopiccontent=${current.subtopiccontent_id}`);
        if (!response.ok) throw new Error("Failed to fetch training contents");
        const data: TrainingContent[] = await response.json();
        setTrainingContents(data);
      } catch (error) { console.error("Error fetching training contents:", error); setTrainingContents([]); }
    };
    fetchTrainingContents();
  }, [activeTab, subtopicContents, isRevisionTab]);

  useEffect(() => {
    const fetchQuestions = async () => {
      if (isRevisionTab) {
        const activeTabIndex = parseInt(activeTab.replace("tab", ""), 10) - 1;
        const current = subtopicContents[activeTabIndex];
        if (!current) return;
        try {
          const res = await fetch(`${API_BASE}/questions/?subtopiccontent=${current.subtopiccontent_id}`);
          if (!res.ok) throw new Error("Failed to fetch questions");
          const data: Question[] = await res.json();
          setQuestions(data);
        } catch (error) { console.error("Error fetching questions:", error); setQuestions([]); }
      }
    };
    if (subtopicContents.length > 0) fetchQuestions();
  }, [isRevisionTab, activeTab, subtopicContents]);

  // --- HELPER FUNCTIONS ---
  const resetForm = () => {
    setQuestionFormData(initialFormState);
    setEditingQuestionId(null);
    setFormError(null);
    if(questionImageInputRef.current) questionImageInputRef.current.value = "";
    optionImageInputRefs.current.forEach(ref => { if(ref) ref.value = ""; });
  };

  const loadQuestionForEdit = (question: Question) => {
    setEditingQuestionId(question.id);
    setQuestionFormData({
      question_text: question.question_text || "",
      imageFile: null,
      previewUrl: question.question_image_url || null,
      options: question.options.map(opt => ({
        option_text: opt.option_text || "",
        is_correct: opt.is_correct,
        imageFile: null,
        previewUrl: opt.option_image_url || null
      }))
    });
    setFormError(null);
  };

  const onTabClick = (tabId: string) => {
    setActiveTab(tabId);
    setQuizMode(false);
    setShowResults(false);
    setShowManager(false);
    resetForm();
  };

  // --- HANDLERS (REVISION) ---
  const handleStartAssessment = () => { setShowResults(false); setShowManager(false); setCurrentQuestionIndex(0); setSelectedAnswers({}); setQuizMode(true); };
  const handleResetQuiz = () => { setShowResults(false); setQuizMode(false); setCurrentQuestionIndex(0); setSelectedAnswers({}); }
  const handleAnswerSelect = (questionId: number, selectedOption: Option) => setSelectedAnswers(prev => ({ ...prev, [questionId]: { selectedOptionId: selectedOption.id, isCorrect: selectedOption.is_correct } }));
  const handleNextQuestion = () => { if (currentQuestionIndex < questions.length - 1) setCurrentQuestionIndex(prev => prev + 1); };
  const handleFinishAssessment = () => setShowResults(true);

  // --- HANDLERS (MANAGER) ---
  const handleQuestionTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => setQuestionFormData({ ...questionFormData, question_text: e.target.value });
  const handleQuestionImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setQuestionFormData({ ...questionFormData, imageFile: file, previewUrl: URL.createObjectURL(file) });
    }
  };
  const handleOptionTextChange = (index: number, value: string) => { 
    const opts = [...questionFormData.options]; opts[index].option_text = value; setQuestionFormData({ ...questionFormData, options: opts }); 
  };
  const handleOptionImageChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const opts = [...questionFormData.options];
      opts[index].imageFile = file;
      opts[index].previewUrl = URL.createObjectURL(file);
      setQuestionFormData({ ...questionFormData, options: opts });
    }
  };
  const handleCorrectOptionChange = (index: number) => { 
    const opts = questionFormData.options.map((opt, i) => ({ ...opt, is_correct: i === index })); 
    setQuestionFormData({ ...questionFormData, options: opts }); 
    setFormError(null);
  };
  const handleAddOption = () => setQuestionFormData({ ...questionFormData, options: [...questionFormData.options, { option_text: "", is_correct: false, imageFile: null, previewUrl: null }] });
  const handleRemoveOption = (index: number) => { 
    if (questionFormData.options.length <= 2) return; 
    const opts = questionFormData.options.filter((_, i) => i !== index); 
    setQuestionFormData({ ...questionFormData, options: opts }); 
  };
  
  const handleDeleteQuestion = async (questionId: number) => { 
    if (!window.confirm("Delete this question?")) return; 
    try { 
      await axios.delete(`${API_BASE}/questions/${questionId}/`); 
      setQuestions(prev => prev.filter(q => q.id !== questionId)); 
      if (editingQuestionId === questionId) resetForm();
    } catch (error) { alert("Failed to delete question."); } 
  };

  const handleQuestionFormSubmit = async () => {
    const hasQuestion = questionFormData.question_text.trim() || questionFormData.imageFile || questionFormData.previewUrl;
    const hasCorrect = questionFormData.options.some(opt => opt.is_correct);
    const validOptions = questionFormData.options.filter(opt => opt.option_text.trim() || opt.previewUrl || opt.imageFile);
    
    if (!hasQuestion) { setFormError("Please enter a question text or upload an image."); return; }
    if (validOptions.length < 2) { setFormError("Please provide at least two valid options."); return; }
    if (!hasCorrect) { setFormError("Please select the correct answer."); return; }

    const activeTabIndex = parseInt(activeTab.replace("tab", ""), 10) - 1;
    const currentSubtopicContent = subtopicContents[activeTabIndex];
    
    const formData = new FormData();
    formData.append("subtopiccontent", String(currentSubtopicContent.subtopiccontent_id));
    formData.append("question_text", questionFormData.question_text);
    if (questionFormData.imageFile) formData.append("question_image", questionFormData.imageFile);

    questionFormData.options.forEach((opt, index) => {
      formData.append(`options[${index}]option_text`, opt.option_text);
      formData.append(`options[${index}]is_correct`, opt.is_correct ? "true" : "false");
      if (opt.imageFile) formData.append(`options[${index}]option_image`, opt.imageFile);
    });

    const config = { headers: { "Content-Type": "multipart/form-data" } };

    try {
      let savedQuestion;
      if (editingQuestionId) {
        const response = await axios.put(`${API_BASE}/questions/${editingQuestionId}/`, formData, config);
        savedQuestion = response.data;
        setQuestions(prev => prev.map(q => q.id === editingQuestionId ? savedQuestion : q));
      } else {
        const response = await axios.post(`${API_BASE}/questions/`, formData, config);
        savedQuestion = response.data;
        setQuestions(prev => [...prev, savedQuestion]);
      }
      resetForm();
    } catch (error) { console.error(error); setFormError("Failed to save question."); }
  };

  // --- HANDLERS (UPLOAD) ---
  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const activeTabIndex = parseInt(activeTab.replace("tab", ""), 10) - 1;
    const current = subtopicContents[activeTabIndex];
    if (!current) return;
    const formData = new FormData();
    formData.append("description", newMaterial.description);
    formData.append("subtopiccontent", String(current.subtopiccontent_id));
    if (uploadType === "file" && newMaterial.file) formData.append("training_file", newMaterial.file);
    else if (uploadType === "link" && newMaterial.url) formData.append("url_link", newMaterial.url);
    
    try {
      setUploadLoading(true);
      const res = await fetch(`${API_BASE}/training-contents/`, { method: "POST", body: formData });
      if (!res.ok) throw new Error("Upload failed");
      const created: TrainingContent = await res.json();
      setTrainingContents((prev) => [...prev, created]);
      setNewMaterial({ description: "", file: null, url: "" });
      setShowUploadModal(false);
    } catch (err) { alert("Error uploading."); } finally { setUploadLoading(false); }
  };

  const handleContentFileChange = (e: React.ChangeEvent<HTMLInputElement>) => { if (e.target.files?.length) setNewMaterial({ ...newMaterial, file: e.target.files[0] }); };
  const triggerContentFileInput = () => contentFileInputRef.current?.click();
  const handleMaterialClick = (content: TrainingContent) => { if (content.url_link) window.open(content.url_link, "_blank"); else if (content.training_file) window.open(content.training_file, "_blank"); };
  const handleDeleteContent = async (contentId: number) => { if (window.confirm("Are you sure?")) { await axios.delete(`${API_BASE}/training-contents/${contentId}/`); setTrainingContents(prev => prev.filter(c => c.id !== contentId)); }};

  // --- RENDER HELPERS ---
  const getFileIcon = (content: TrainingContent) => content.url_link ? <Link className="w-6 h-6 text-blue-500" /> : <FileText className="w-6 h-6 text-muted" />;
  const getLetter = (index: number) => String.fromCharCode(65 + index);

  // --- COMPONENT RENDER ---
  if (loading) return (<div className="flex h-screen items-center justify-center bg-background"><div className="animate-spin rounded-full h-16 w-16 border-4 border-border border-t-blue-600"></div></div>);
  if (error) return (<div className="flex h-screen items-center justify-center text-red-600 font-semibold bg-background">Error: {error}</div>);

  return (
    // Global container: bg-background
    <div className="min-h-screen bg-background font-sans flex flex-col h-screen overflow-hidden">
      
      {/* MAIN LAYOUT */}
      <div className="flex flex-1 h-full overflow-hidden">
        
        {/* SIDEBAR: bg-surface, border-border */}
        <div className="w-80 bg-surface shadow-lg border-r border-border flex flex-col z-20 h-full">
          <div className="p-6 border-b border-border">
            <div className="flex items-center space-x-3 mb-2">
              <BookOpen className="w-6 h-6 text-blue-600" />
              <h2 className="text-xl font-bold text-text">Lesson Contents</h2>
            </div>
          </div>
          <nav className="p-6 flex-1 overflow-y-auto custom-scrollbar">
            <div className="space-y-3">
              {detailTabs.map((tab, index) => (
                <button 
                  key={tab.id} 
                  onClick={() => onTabClick(tab.id)} 
                  className={`w-full p-4 text-left rounded-xl transition-all duration-200 flex items-center group ${activeTab === tab.id ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg" : "text-muted hover:bg-background hover:text-text"}`}
                > 
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-4 text-sm font-bold ${activeTab === tab.id ? "bg-white/20 text-white" : "bg-background text-blue-600 group-hover:bg-blue-100"}`}>
                    {index + 1}
                  </div> 
                  <div className="flex-1">
                    <span className="font-semibold text-sm block">{tab.title.length > 20 ? tab.title.slice(0, 20) + '...' : tab.title}</span>
                    <span className={`text-xs ${activeTab === tab.id ? "text-blue-100" : "text-muted"}`}>Module {index + 1}</span>
                  </div> 
                </button>
              ))}
            </div>
          </nav>
        </div>

        {/* CONTENT AREA: bg-background */}
        <div className="flex-1 flex flex-col h-full overflow-hidden bg-background relative">
          
          {/* TOP HEADER */}
          <div className="px-8 py-6 flex justify-between items-center shrink-0">
            <div>
                <h1 className="text-3xl font-bold text-text tracking-tight">{activeTabData?.title || "Loading..."}</h1>
            </div>
            
            {isRevisionTab && (
                <button 
                    onClick={() => setShowManager(!showManager)} 
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all shadow-sm border font-medium ${showManager ? 'bg-surface text-red-600 border-red-200 hover:bg-red-50' : 'bg-surface text-indigo-600 border-border hover:bg-indigo-50'}`}
                >
                    {showManager ? (
                        <><ArrowLeft className="w-5 h-5" /> Back to Assessment</>
                    ) : (
                        <><Settings className="w-5 h-5" /> Manage Questions</>
                    )}
                </button>
            )}
          </div>

          {/* MAIN BODY SCROLL AREA */}
          <div className="flex-1 overflow-hidden px-8 pb-8">
            {isRevisionTab ? (
                showManager ? (
                // --- QUESTION MANAGER VIEW (EMBEDDED) ---
                <div className="h-full flex flex-col animate-in fade-in duration-300">

                    {/* SPLIT VIEW CONTAINER */}
                    <div className="flex gap-6 flex-1 overflow-hidden min-h-0">
                        
                        {/* LEFT: EDITOR (bg-surface) */}
                        <div className="flex-1 bg-surface rounded-xl shadow-sm border border-border flex flex-col overflow-hidden">
                            <div className="p-5 border-b border-border flex justify-between items-center bg-background/50 shrink-0">
                                <div>
                                    <h3 className="text-lg font-bold text-text">{editingQuestionId ? "Edit Question" : "Create New Question"}</h3>
                                    <p className="text-sm text-muted">Fill in the details below</p>
                                </div>
                                <button
                                  onClick={() => setShowBulkUploadModal(true)}
                                  className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-5 py-2.5 rounded-lg font-semibold text-sm shadow-md transition-all duration-200 active:scale-95 whitespace-nowrap"
                                >
                                  <UploadCloud className="w-4 h-4" />
                                  Bulk Upload
                                </button>
                            </div>

                            <button
                              onClick={resetForm}
                              className="inline-flex items-center gap-1 text-base text-muted hover:text-indigo-600 px-1.5 py-0.5 bg-surface border-r-[5px] border-border rounded-sm shadow-sm transition-colors"
                            >
                              <RefreshCw className="w-4 h-4" /> Reset
                            </button>

                            <div className="flex-1 overflow-y-auto p-6 space-y-6">
                                {/* Question Text */}
                                <div>
                                    <label className="flex items-center gap-2 text-sm font-semibold text-muted mb-2"><Edit className="w-4 h-4" /> Question Text</label>
                                    {/* Input: bg-background, text-text, border-border */}
                                    <textarea value={questionFormData.question_text} onChange={handleQuestionTextChange} placeholder="Type your question here..." className="w-full p-4 bg-background border border-border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none h-32 text-text text-sm placeholder:text-muted" />
                                </div>

                                {/* Question Image */}
                                <div>
                                    <label className="flex items-center gap-2 text-sm font-semibold text-muted mb-2"><Upload className="w-4 h-4" /> Question Image (Optional)</label>
                                    <div className="flex items-center gap-3 p-2 border border-border rounded-lg bg-background">
                                        <input type="file" accept="image/*" ref={questionImageInputRef} onChange={handleQuestionImageChange} className="hidden" />
                                        <button type="button" onClick={() => questionImageInputRef.current?.click()} className="bg-surface hover:bg-border text-text px-4 py-2 rounded text-sm font-medium transition-colors border border-border">Choose File</button>
                                        <span className="text-sm text-muted truncate flex-1">{questionFormData.imageFile ? questionFormData.imageFile.name : "No file chosen"}</span>
                                    </div>
                                    {questionFormData.previewUrl && (
                                        <div className="mt-3 relative w-fit group">
                                            <img src={questionFormData.previewUrl} alt="Preview" className="h-32 rounded-lg border border-border object-cover" />
                                            <button onClick={() => { setQuestionFormData({...questionFormData, imageFile: null, previewUrl: null}); if(questionImageInputRef.current) questionImageInputRef.current.value = ""; }} className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"><X className="w-3 h-3" /></button>
                                        </div>
                                    )}
                                </div>

                                {/* Options */}
                                <div>
                                    <label className="flex items-center gap-2 text-sm font-semibold text-muted mb-4"><List className="w-4 h-4" /> Answer Options</label>
                                    <div className="space-y-3">
                                        {questionFormData.options.map((option, idx) => (
                                            <div key={idx} className="flex items-start gap-3 p-3 border border-border rounded-xl bg-background hover:shadow-sm transition-all group">
                                                <div className="flex-shrink-0 w-8 h-8 rounded bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-sm mt-1">{getLetter(idx)}</div>
                                                <div className="flex-1 space-y-2">
                                                    <input type="text" value={option.option_text} onChange={(e) => handleOptionTextChange(idx, e.target.value)} placeholder={`Option ${getLetter(idx)} text`} className="w-full px-3 py-2 bg-surface border border-border rounded-md text-sm text-text focus:ring-1 focus:ring-indigo-500 placeholder:text-muted" />
                                                    <div className="flex items-center gap-2">
                                                        <input type="file" accept="image/*" className="hidden" ref={el => optionImageInputRefs.current[idx] = el} onChange={(e) => handleOptionImageChange(idx, e)} />
                                                        <button type="button" onClick={() => optionImageInputRefs.current[idx]?.click()} className="text-xs bg-surface border border-border px-2 py-1 rounded hover:bg-background text-muted">{option.imageFile ? "Change Image" : "Choose File"}</button>
                                                        <span className="text-xs text-muted truncate max-w-[100px]">{option.imageFile ? option.imageFile.name : "No file"}</span>
                                                        {option.previewUrl && <img src={option.previewUrl} alt="opt" className="w-6 h-6 rounded object-cover border border-border" />}
                                                    </div>
                                                </div>
                                                <div className="flex flex-col items-center gap-1 pt-2">
                                                    <label className="cursor-pointer flex items-center gap-2"><input type="radio" name="is_correct" checked={option.is_correct} onChange={() => handleCorrectOptionChange(idx)} className="w-4 h-4 text-indigo-600" /><span className="text-xs font-medium text-muted">Correct</span></label>
                                                    {questionFormData.options.length > 2 && <button onClick={() => handleRemoveOption(idx)} className="text-muted hover:text-red-500"><Trash2 className="w-4 h-4"/></button>}
                                                </div>
                                            </div>
                                        ))}
                                        <button onClick={handleAddOption} className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 px-2 py-1"><Plus className="w-3 h-3"/> Add Option</button>
                                    </div>
                                </div>
                            </div>

                            {/* Editor Footer */}
                            <div className="p-4 border-t border-border bg-background/50 flex justify-between items-center shrink-0">
                                <div className="text-red-500 text-xs flex items-center gap-1">{formError && <><AlertCircle className="w-3 h-3" /> {formError}</>}</div>
                                <button onClick={handleQuestionFormSubmit} className="bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-2 rounded-lg shadow-lg shadow-indigo-200 flex items-center gap-2 font-semibold transition-transform active:scale-95"><Save className="w-4 h-4" /> {editingQuestionId ? "Update Question" : "Save Question"}</button>
                            </div>
                        </div>
                        
                        {/* RIGHT: LIST (bg-surface) */}
                        <div className="flex-1 bg-surface rounded-xl shadow-sm border border-border flex flex-col overflow-hidden shrink-0">
                            <div className="p-4 border-b border-border flex justify-between items-center bg-indigo-50/30 shrink-0">
                                <div className="flex items-center gap-2">
                                    <div className="p-1 bg-green-500 rounded text-white"><List className="w-4 h-4"/></div>
                                    <span className="font-bold text-text">Questions</span>
                                </div>
                                <span className="bg-indigo-100 text-indigo-700 text-xs font-bold px-2 py-1 rounded-full">{questions.length}</span>
                            </div>
                            
                            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-background">
                                {questions.length === 0 ? (
                                    <div className="h-full flex flex-col items-center justify-center text-center p-8 opacity-60">
                                        <Search className="w-16 h-16 text-muted mb-4" />
                                        <h4 className="font-bold text-xl text-text">No Questions Yet</h4>
                                        <p className="text-sm text-muted mt-2">Use the form on the left to create your first question.</p>
                                    </div>
                                ) : (
                                    questions.map((q, i) => (
                                        <div 
                                            key={q.id} 
                                            onClick={() => loadQuestionForEdit(q)} 
                                            className={`flex gap-4 p-4 rounded-xl border cursor-pointer transition-all duration-200 group relative ${
                                                editingQuestionId === q.id 
                                                ? "bg-surface border-indigo-500 ring-1 ring-indigo-500 shadow-md z-10" 
                                                : "bg-surface border-border hover:border-indigo-300 hover:shadow-sm"
                                            }`}
                                        >
                                            {/* Image Thumbnail */}
                                            {q.question_image_url && (
                                                <div className="shrink-0 w-20 h-20 rounded-lg border border-border overflow-hidden bg-background">
                                                    <img 
                                                        src={q.question_image_url} 
                                                        alt="thumb" 
                                                        className="w-full h-full object-cover" 
                                                    />
                                                </div>
                                            )}

                                            {/* Main Content */}
                                            <div className="flex-1 min-w-0 flex flex-col justify-between">
                                                <div className="flex justify-between items-start gap-2">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <span className={`text-xs font-bold px-2 py-0.5 rounded ${editingQuestionId === q.id ? "bg-indigo-100 text-indigo-700" : "bg-background border border-border text-muted"}`}>
                                                            Question {i + 1}
                                                        </span>
                                                    </div>
                                                </div>

                                                <p className="text-sm text-text font-medium leading-relaxed line-clamp-2 mb-2">
                                                    {q.question_text || <span className="italic text-muted">Image Question (No Text)</span>}
                                                </p>

                                                {/* Answer Indicators */}
                                                <div className="flex items-center gap-1.5">
                                                    {q.options.map((o, oid) => (
                                                        <div 
                                                            key={oid} 
                                                            className={`w-2.5 h-2.5 rounded-full border ${o.is_correct ? "bg-green-500 border-green-600" : "bg-background border-border"}`} 
                                                            title={o.is_correct ? "Correct Answer" : `Option ${getLetter(oid)}`}
                                                        />
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Delete Button */}
                                            <button 
                                                onClick={(e) => { e.stopPropagation(); handleDeleteQuestion(q.id); }} 
                                                className="absolute top-3 right-3 p-1.5 text-muted hover:text-red-600 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                                                title="Delete Question"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </div>
                ) : (
                // --- QUIZ / ASSESSMENT VIEW ---
                <div className="bg-surface rounded-2xl border border-border p-8 shadow-sm relative min-h-[600px] flex flex-col h-full overflow-y-auto">
                    {!showResults && !quizMode && (
                        <div className="flex-1 flex items-center justify-center py-20 px-6">
                            <div className="w-full max-w-2xl bg-surface rounded-3xl shadow-xl border-2 border-border p-16 text-center">
                                <h2 className="text-5xl md:text-6xl font-black bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700 bg-clip-text text-transparent tracking-tight mb-6">
                                    Start Revision
                                </h2>

                                <p className="text-2xl font-bold text-text flex items-center justify-center gap-3">
                                    <span className="h-5 w-5 rounded-full bg-green-500 ring-4 ring-green-300"></span>
                                    {questions.length} {questions.length === 1 ? "Question" : "Questions"} Ready
                                </p>

                                {questions.length > 0 && (
                                    <p className="mt-4 text-lg text-muted font-medium">
                                        Revise smarter • Remember longer • Score higher
                                    </p>
                                )}

                                <button
                                    onClick={handleStartAssessment}
                                    disabled={questions.length === 0}
                                    className="mt-16 group relative w-80 h-80 rounded-full overflow-hidden shadow-2xl transition-all duration-300 hover:scale-105 hover:shadow-3xl active:scale-95 disabled:opacity-40 disabled:grayscale disabled:hover:scale-100 disabled:cursor-not-allowed border-8 border-white/40"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700"></div>
                                    <div className="absolute inset-8 rounded-full bg-white/25 backdrop-blur-xl border-4 border-white/40"></div>
                                    <div className="relative z-10 flex flex-col items-center justify-center h-full text-white">
                                        <div className="mb-6 p-10 rounded-full bg-white/30 backdrop-blur-md shadow-2xl border-4 border-white/50 group-hover:scale-110 transition duration-300">
                                            <Play className="w-24 h-24 fill-white ml-4" />
                                        </div>
                                        <span className="text-5xl font-black tracking-widest uppercase drop-shadow-2xl">
                                            START
                                        </span>
                                        <span className="mt-3 text-xs font-semibold tracking-wider">
                                            Begin Assessment
                                        </span>
                                    </div>
                                </button>

                                {questions.length === 0 && (
                                    <div className="mt-12 p-6 bg-red-50 border border-red-200 rounded-2xl">
                                        <p className="text-red-700 font-medium text-lg">
                                            No questions available yet. Please add some to begin.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {quizMode && !showResults && (
                    <div className="animate-in fade-in duration-300">
                      {questions.length > 0 && (
                        <>
                          {(() => {
                            const question = questions[currentQuestionIndex];
                            const answerState = selectedAnswers[question.id];

                            return (
                              <div className="max-w-3xl mx-auto">
                                {/* Progress */}
                                <div className="flex justify-between items-center mb-4">
                                  <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">
                                    Q{currentQuestionIndex + 1} / {questions.length}
                                  </span>
                                  <span className="text-xs text-muted">
                                    {Math.round(((currentQuestionIndex + 1) / questions.length) * 100)}%
                                  </span>
                                </div>

                                {/* Progress Bar - Thinner */}
                                <div className="w-full bg-border rounded-full h-1.5 mb-6 overflow-hidden">
                                  <div
                                    className="bg-gradient-to-r from-blue-500 to-indigo-600 h-full rounded-full transition-all duration-500 ease-out"
                                    style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
                                  />
                                </div>

                                {/* Question */}
                                <div className="mb-6">
                                  {question.question_image_url && (
                                    <div className="mb-5 rounded-xl overflow-hidden border border-border shadow-sm bg-background p-3">
                                      <img
                                        src={question.question_image_url}
                                        alt="Question"
                                        className="max-w-full max-h-40 mx-auto object-contain rounded-lg"
                                      />
                                    </div>
                                  )}
                                  <h3 className="text-lg font-semibold text-text leading-snug">
                                    {question.question_text || "(Image-based question)"}
                                  </h3>
                                </div>

                                {/* Options - Compact Grid */}
                                <div
                                  className={`grid gap-3 mb-8 ${
                                    question.options.some(o => o.option_image_url)
                                      ? 'grid-cols-1 sm:grid-cols-2'
                                      : 'grid-cols-1'
                                  }`}
                                >
                                  {question.options.map((option, idx) => (
                                    <button
                                      key={option.id}
                                      onClick={() => handleAnswerSelect(question.id, option)}
                                      disabled={!!answerState}
                                      className={`relative p-4 rounded-xl border-2 text-left transition-all duration-200 flex items-start gap-3 group ${
                                        !!answerState
                                          ? 'cursor-not-allowed opacity-90'
                                          : 'cursor-pointer hover:border-blue-400 hover:bg-blue-50/70 hover:shadow-sm'
                                      } ${
                                        answerState?.selectedOptionId === option.id
                                          ? answerState.isCorrect
                                            ? 'bg-green-50 border-green-500 text-green-800'
                                            : 'bg-red-50 border-red-500 text-red-800'
                                          : 'bg-surface border-border text-text'
                                      }`}
                                    >
                                      {/* Letter Circle */}
                                      <div
                                        className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center font-bold text-sm transition-all ${
                                          answerState?.selectedOptionId === option.id
                                            ? answerState.isCorrect
                                              ? 'bg-green-500 text-white border-green-600'
                                              : 'bg-red-500 text-white border-red-600'
                                            : 'border-2 border-border text-muted group-hover:border-blue-500 group-hover:text-blue-600'
                                        }`}
                                      >
                                        {answerState?.selectedOptionId === option.id
                                          ? answerState.isCorrect
                                            ? <Check className="w-5 h-5" />
                                            : <X className="w-5 h-5" />
                                          : getLetter(idx)}
                                      </div>

                                      {/* Option Content */}
                                      <div className="flex-1 min-w-0">
                                        {option.option_image_url && (
                                          <img
                                            src={option.option_image_url}
                                            alt="Option"
                                            className="w-full h-20 object-cover rounded-lg mb-3 border border-border"
                                          />
                                        )}
                                        <span className="text-sm font-medium leading-tight block">
                                          {option.option_text}
                                        </span>
                                      </div>
                                    </button>
                                  ))}
                                </div>

                                {/* Navigation */}
                                <div className="flex justify-end pt-6 border-t border-border">
                                  {currentQuestionIndex < questions.length - 1 ? (
                                    <button
                                      onClick={handleNextQuestion}
                                      disabled={!answerState}
                                      className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:text-gray-500 shadow-md transition-all active:scale-95"
                                    >
                                      Next <ArrowLeft className="w-4 h-4 rotate-180" />
                                    </button>
                                  ) : (
                                    <button
                                      onClick={handleFinishAssessment}
                                      disabled={!answerState}
                                      className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white text-sm font-semibold rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:text-gray-500 shadow-md transition-all active:scale-95"
                                    >
                                      Finish <CheckCircle className="w-4 h-4" />
                                    </button>
                                  )}
                                </div>
                              </div>
                            );
                          })()}
                        </>
                      )}
                    </div>
                    )}

                    {showResults && (
                    <div className="text-center py-8 flex-1 flex flex-col items-center justify-center animate-in zoom-in duration-300">
                        <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6"><CheckCircle className="w-12 h-12" /></div>
                        <h3 className="text-4xl font-bold text-text mb-2">Assessment Complete!</h3>
                        <div className="bg-background rounded-3xl p-10 mb-10 border border-border shadow-inner"><div className="text-6xl font-black text-text mb-2">{Object.values(selectedAnswers).filter(a => a.isCorrect).length} <span className="text-4xl text-muted font-normal">/ {questions.length}</span></div><p className="text-indigo-600 font-bold text-lg uppercase tracking-wide">Correct Answers</p></div>
                        <button onClick={handleResetQuiz} className="px-10 py-4 bg-text text-background rounded-xl hover:opacity-90 font-bold shadow-xl shadow-gray-200 transition-transform hover:scale-105 flex items-center gap-2"><RefreshCw className="w-5 h-5"/> Back</button>
                    </div>
                    )}
                </div>
                )
            ) : (
              // --- TRAINING CONTENT TAB ---
              <div className="h-full flex flex-col">
                <div className="flex justify-between items-center mb-6 shrink-0"><div><h2 className="text-2xl font-bold text-text">Training Materials</h2><p className="text-muted mt-1">Resources for this module</p></div><div className="flex items-center space-x-4"><button onClick={() => setShowUploadModal(true)} className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold shadow-sm shadow-blue-200 transition-all active:scale-95"><Upload className="w-4 h-4" /><span>Upload Material</span></button><div className="flex bg-surface rounded-lg border border-border p-1 shadow-sm"><button onClick={() => setViewType("grid")} className={`p-2 rounded-md transition-all ${viewType === "grid" ? "bg-blue-100 text-blue-700 shadow-sm" : "text-muted hover:bg-background"}`}><Grid className="w-4 h-4" /></button><button onClick={() => setViewType("list")} className={`p-2 rounded-md transition-all ${viewType === "list" ? "bg-blue-100 text-blue-700 shadow-sm" : "text-muted hover:bg-background"}`}><List className="w-4 h-4" /></button></div></div></div>
                <div className="flex-1 overflow-y-auto">
                    {trainingContents.length > 0 ? (
                    <div className={viewType === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-3"}>
                        {trainingContents.map(content => (
                            <div key={content.id} className={`group bg-surface rounded-xl border border-border hover:border-blue-300 transition-all cursor-pointer ${viewType === 'grid' ? 'p-6 hover:shadow-lg' : 'p-4 flex items-center justify-between hover:shadow-md'}`} onClick={() => handleMaterialClick(content)}>
                                <div className={`flex items-start ${viewType === 'list' ? 'flex-1' : ''}`}>
                                    <div className="p-3 bg-background rounded-lg mr-4 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">{getFileIcon(content)}</div>
                                    <div><h3 className="font-semibold text-text group-hover:text-blue-700">{content.description}</h3><p className="text-sm text-muted mt-1">{content.training_file ? "File" : "External Link"}</p></div>
                                </div>
                                <button onClick={(e) => { e.stopPropagation(); handleDeleteContent(content.id); }} className={`p-2 rounded-lg text-muted hover:bg-red-50 hover:text-red-500 transition-colors ${viewType === 'grid' ? 'absolute top-4 right-4 opacity-0 group-hover:opacity-100' : ''}`}><Trash2 className="w-4 h-4" /></button>
                            </div>
                        ))}
                    </div>
                    ) : (<div className="h-96 flex flex-col items-center justify-center bg-surface rounded-xl border-2 border-dashed border-border p-8 text-center"><div className="mx-auto w-16 h-16 bg-background rounded-full flex items-center justify-center mb-4"><Upload className="w-8 h-8 text-muted"/></div><h3 className="text-xl font-bold text-text">No Materials Yet</h3><p className="text-muted mt-2">Upload the first training material for this module.</p></div>)}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* UPLOAD MODAL */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-[60]">
          <div className="bg-surface rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-border bg-background"><h2 className="text-xl font-bold text-text">Upload New Material</h2></div>
            <form onSubmit={handleUploadSubmit} className="p-6">
              <div className="space-y-6">
                <div><label className="block text-sm font-bold text-text mb-2">Description</label><input type="text" value={newMaterial.description} onChange={(e) => setNewMaterial({ ...newMaterial, description: e.target.value })} className="w-full p-3 bg-background border border-border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all text-text" required placeholder="e.g. Lecture Slides" /></div>
                <div><label className="block text-sm font-bold text-text mb-3">Material Type</label><div className="grid grid-cols-2 gap-4"><button type="button" onClick={() => setUploadType("file")} className={`p-4 rounded-xl border-2 font-medium transition-all ${uploadType === "file" ? "border-blue-500 bg-blue-50 text-blue-700" : "border-border text-muted hover:bg-background"}`}>Upload File</button><button type="button" onClick={() => setUploadType("link")} className={`p-4 rounded-xl border-2 font-medium transition-all ${uploadType === "link" ? "border-blue-500 bg-blue-50 text-blue-700" : "border-border text-muted hover:bg-background"}`}>Web Link</button></div></div>
                {uploadType === "file" ? (<div><label className="block text-sm font-bold text-text mb-2">File</label><input type="file" ref={contentFileInputRef} onChange={handleContentFileChange} className="hidden" /><div onClick={triggerContentFileInput} className="w-full p-8 border-2 border-dashed border-border rounded-xl cursor-pointer text-center hover:bg-background hover:border-blue-400 transition-all"><p className="text-muted font-medium">{newMaterial.file ? newMaterial.file.name : "Click to choose a file"}</p></div></div>) : (<div><label className="block text-sm font-bold text-text mb-2">URL Link</label><input type="url" value={newMaterial.url} onChange={(e) => setNewMaterial({ ...newMaterial, url: e.target.value })} className="w-full p-3 bg-background border border-border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-text" placeholder="https://..." /></div>)}
              </div>
              <div className="mt-8 flex justify-end space-x-3"><button type="button" onClick={() => setShowUploadModal(false)} className="px-6 py-2.5 text-muted hover:bg-background rounded-lg font-medium transition-colors">Cancel</button><button type="submit" className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium shadow-lg shadow-blue-200 transition-all active:scale-95" disabled={uploadLoading}>{uploadLoading ? "Uploading..." : "Save Material"}</button></div>
            </form>
          </div>
        </div>
      )}
      {/* BULK UPLOAD QUESTIONS MODAL */}
{showBulkUploadModal && (
  <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-[80]">
    <div className="bg-surface rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
      {/* Header */}
      <div className="p-6 bg-gradient-to-r from-indigo-600 to-purple-700 text-white">
        <h2 className="text-2xl font-bold flex items-center gap-3">
          <UploadCloud className="w-8 h-8" />
          Bulk Upload Questions 
        </h2>
        <p className="text-indigo-100 mt-1">Embed images directly in Excel – no separate files needed!</p>
      </div>

      <div className="flex-1 overflow-y-auto p-8 bg-surface">
        <div className="space-y-7">

          {/* Download Template */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 text-center">
            <p className="text-lg font-bold text-blue-900 mb-3">First, download the template</p>
            <a
              href={`${API_BASE}/questions/download-template/?subtopiccontent=${subtopicContents[parseInt(activeTab.replace('tab', ''), 10) - 1]?.subtopiccontent_id}`}
              className="inline-flex items-center gap-3 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-lg shadow-lg transition transform hover:scale-105"
            >
              Download Excel Template
            </a>
          </div>

          {/* File Upload */}
          <div>
            <label className="block text-lg font-bold text-text mb-4">Upload Filled Excel File</label>
            <input
              type="file"
              accept=".xlsx"
              ref={bulkFileInputRef}
              onChange={(e) => e.target.files && setBulkFile(e.target.files[0])}
              className="hidden"
            />
            <div
              onClick={() => bulkFileInputRef.current?.click()}
              className="border-4 border-dashed border-border rounded-2xl p-12 text-center cursor-pointer hover:border-indigo-500 hover:bg-indigo-50 transition-all"
            >
              <UploadCloud className="w-20 h-20 mx-auto text-muted mb-4" />
              <p className="text-xl font-semibold text-text">
                {bulkFile ? bulkFile.name : "Click or drop your Excel file here"}
              </p>
              {bulkFile && (
                <p className="text-sm text-green-600 mt-2 font-medium">
                  Ready to upload
                </p>
              )}
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-amber-50 border-2 border-amber-200 rounded-xl p-5">
            <h4 className="font-bold text-amber-900 mb-2">How to Add Images in Excel:</h4>
            <ol className="text-sm text-amber-800 space-y-1 list-decimal pl-5">
              <li>Go to any image column (e.g., "Option A Image")</li>
              <li>Right-click → <strong>Insert → Pictures → This Device</strong></li>
              <li>Choose image → Resize to fit cell</li>
              <li>Correct answer must match text (even for image options)</li>
            </ol>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-6 border-t border-border bg-background flex justify-end gap-4">
        <button
          onClick={() => {
            setShowBulkUploadModal(false);
            setBulkFile(null);
          }}
          className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-xl font-medium"
        >
          Cancel
        </button>
        <button
          onClick={async () => {
            if (!bulkFile) return alert("Please select a file");

            setBulkUploading(true);
            const formData = new FormData();
            formData.append("file", bulkFile);
            const currentSubtopic = subtopicContents[parseInt(activeTab.replace("tab", ""), 10) - 1];
            formData.append("subtopiccontent", String(currentSubtopic.subtopiccontent_id));

            try {
              const res = await fetch(`${API_BASE}/questions/bulk-upload/`, {
                method: "POST",
                body: formData,
              });
              const data = await res.json();

              if (!res.ok) throw new Error(data.detail || "Upload failed");

              alert(`Success! ${data.created+1} questions uploaded`);
              setQuestions(prev => [...prev, ...data.questions || []]);
              setShowBulkUploadModal(false);
              setBulkFile(null);
            } catch (err: any) {
              alert("Upload failed: " + err.message);
            } finally {
              setBulkUploading(false);
            }
          }}
          disabled={!bulkFile || bulkUploading}
          className="px-10 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl font-bold shadow-xl disabled:opacity-50 flex items-center gap-3"
        >
          {bulkUploading ? "Uploading..." : (
            <>
              <UploadCloud className="w-5 h-5" />
              Upload & Import
            </>
          )}
        </button>
      </div>
    </div>
  </div>
)}
    </div>
  );
}



