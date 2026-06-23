// import React, { useState, useEffect } from 'react';
// import {
//   Plus,
//   Edit2,
//   Trash2,
//   Upload,
//   Grid3X3,
//   List,
//   File,
//   Image,
//   Link as LinkIcon,
//   X,
//   BookOpen,
//   Folder,
//   Eye,
//   Database,
//   ArrowLeft,
// } from 'lucide-react';
// import ConfirmModal from './modal';
// import RefresherQuestionManager from './RefresherQuestionManager';

// const API_BASE = 'http://127.0.0.1:8000';

// interface TrainingCategory {
//   id: number;
//   name: string;
//   description: string;
//   created_at: string;
// }

// interface TrainingTopic {
//   id: number;
//   category: TrainingCategory;
//   category_id: number;
//   topic: string;
//   description: string;
//   created_at: string;
// }

// interface UploadedFile {
//   id: number;
//   curriculum: number;
//   content_name: string;
//   content_type: 'document' | 'image' | 'link';
//   file?: string | null;
//   link?: string | null;
//   uploaded_at: string;
// }

// interface CurriculumProps {
//   selectedCategoryId: number | string | null;
//   selectedTopicId: number | string | null;
//   setSelectedCategoryId: (categoryId: number | string | null) => void;
//   setSelectedTopicId: (topicId: number | string | null) => void;
// }

// type DeleteTarget =
//   | { type: 'category'; id: number; name: string }
//   | { type: 'topic'; id: number; name: string }
//   | { type: 'file'; id: number; name: string }
//   | null;

// const Curriculum: React.FC<CurriculumProps> = ({
//   selectedCategoryId: propSelectedCategoryId,
//   selectedTopicId: propSelectedTopicId,
//   setSelectedCategoryId: setPropSelectedCategoryId,
//   setSelectedTopicId: setPropSelectedTopicId,
// }) => {
//   const [showDeleteModal, setShowDeleteModal] = useState(false);
//   const [deleteTarget, setDeleteTarget] = useState<DeleteTarget>(null);

//   const [pendingTopicId, setPendingTopicId] = useState<number | string | null>(null);
//   const [categories, setCategories] = useState<TrainingCategory[]>([]);
//   const [topics, setTopics] = useState<TrainingTopic[]>([]);
//   const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
//   const [selectedCategory, setSelectedCategory] = useState<TrainingCategory | null>(
//     null
//   );
//   const [selectedTopic, setSelectedTopic] = useState<TrainingTopic | null>(null);

//   const [showCategoryForm, setShowCategoryForm] = useState(false);
//   const [showTopicForm, setShowTopicForm] = useState(false);
//   const [showUploadForm, setShowUploadForm] = useState(false);

//   // Question Manager
//   const [showQuestionManager, setShowQuestionManager] = useState(false);

//   const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
//   const [editingCategory, setEditingCategory] = useState<TrainingCategory | null>(
//     null
//   );
//   const [editingTopic, setEditingTopic] = useState<TrainingTopic | null>(null);

//   const [categoryForm, setCategoryForm] = useState({ name: '', description: '' });
//   const [topicForm, setTopicForm] = useState({ topic: '', description: '' });
//   const [uploadForm, setUploadForm] = useState({
//     content_name: '',
//     content_type: 'document' as 'document' | 'image' | 'link',
//     file: null as File | null,
//     link: '',
//   });

//   useEffect(() => {
//     fetchCategories();
//   }, []);

//   useEffect(() => {
//     if (propSelectedCategoryId != null && categories.length > 0) {
//       const cat = categories.find(c => c.id === propSelectedCategoryId) || null;
//       setSelectedCategory(cat);
//     }
//   }, [propSelectedCategoryId, categories]);

//   useEffect(() => {
//     if (selectedCategory) {
//       fetchTopics(selectedCategory.id);
//       setPropSelectedCategoryId(selectedCategory.id);
//     } else {
//       setTopics([]);
//       setSelectedTopic(null);
//       setPropSelectedTopicId(null);
//     }
//   }, [selectedCategory]);

//   useEffect(() => {
//     if (propSelectedTopicId != null) {
//       setPendingTopicId(propSelectedTopicId);
//     }
//   }, [propSelectedTopicId]);

//   useEffect(() => {
//     if (topics.length === 0) return;
//     if (pendingTopicId != null) {
//       const topicId =
//         typeof pendingTopicId === 'string' ? parseInt(pendingTopicId) : pendingTopicId;
//       const matchedTopic = topics.find(t => t.id === topicId);
//       if (matchedTopic) {
//         setSelectedTopic(matchedTopic);
//         setPropSelectedTopicId(matchedTopic.id);
//       } else if (topics.length > 0) {
//         setSelectedTopic(topics[0]);
//         setPropSelectedTopicId(topics[0].id);
//       }
//       setPendingTopicId(null);
//     } else if (!selectedTopic && topics.length > 0) {
//       setSelectedTopic(topics[0]);
//       setPropSelectedTopicId(topics[0].id);
//     }
//   }, [topics]);

//   useEffect(() => {
//     if (selectedTopic) {
//       fetchFiles(selectedTopic.id);
//       setPropSelectedTopicId(selectedTopic.id);
//       setShowQuestionManager(false);
//     } else {
//       setUploadedFiles([]);
//     }
//   }, [selectedTopic]);

//   const getFileUrl = (file: UploadedFile) => {
//     if (file.content_type === 'link') return file.link || '#';
//     if (file.file)
//       return file.file.startsWith('http') ? file.file : `${API_BASE}${file.file}`;
//     return '#';
//   };

//   const fetchCategories = async () => {
//     try {
//       const res = await fetch(`${API_BASE}/training-categories/`);
//       if (res.ok) {
//         const data: TrainingCategory[] = await res.json();
//         setCategories(data);
//         if (propSelectedCategoryId == null && data.length > 0) {
//           setSelectedCategory(data[0]);
//           setPropSelectedCategoryId(data[0].id);
//         }
//       }
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   const fetchTopics = async (categoryId: number) => {
//     try {
//       const res = await fetch(`${API_BASE}/curriculums/?category_id=${categoryId}`);
//       if (res.ok) {
//         const data: TrainingTopic[] = await res.json();
//         setTopics(data);
//         setSelectedTopic(null);
//         setUploadedFiles([]);
//         if (propSelectedTopicId != null) {
//           const matched = data.find(t => t.id === propSelectedTopicId);
//           if (matched) {
//             setSelectedTopic(matched);
//             setPropSelectedTopicId(matched.id);
//             return;
//           }
//         }
//         if (data.length > 0) {
//           setSelectedTopic(data[0]);
//           setPropSelectedTopicId(data[0].id);
//         }
//       }
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   const fetchFiles = async (topicId: number) => {
//     try {
//       const res = await fetch(`${API_BASE}/curriculum-contents/?curriculum=${topicId}`);
//       if (res.ok) setUploadedFiles(await res.json());
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   const handleCategorySubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     const method = editingCategory ? 'PUT' : 'POST';
//     const url = editingCategory
//       ? `${API_BASE}/training-categories/${editingCategory.id}/`
//       : `${API_BASE}/training-categories/`;

//     const res = await fetch(url, {
//       method,
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify(categoryForm),
//     });

//     if (res.ok) {
//       if (!editingCategory) {
//         const newCategory = await res.json();
//         setCategories(prev => [...prev, newCategory]);
//         setSelectedCategory(newCategory);
//         setPropSelectedCategoryId(newCategory.id);
//       } else {
//         await fetchCategories();
//       }
//       setEditingCategory(null);
//       setShowCategoryForm(false);
//       setCategoryForm({ name: '', description: '' });
//     }
//   };

//   const handleTopicSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!selectedCategory) return;
//     const method = editingTopic ? 'PUT' : 'POST';
//     const url = editingTopic
//       ? `${API_BASE}/curriculums/${editingTopic.id}/`
//       : `${API_BASE}/curriculums/`;

//     const res = await fetch(url, {
//       method,
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({
//         topic: topicForm.topic,
//         description: topicForm.description,
//         category_id: selectedCategory.id,
//       }),
//     });

//     if (res.ok) {
//       const data = await res.json();
//       if (editingTopic) {
//         setTopics(prev => prev.map(t => (t.id === data.id ? data : t)));
//       } else {
//         setTopics(prev => [...prev, data]);
//         setSelectedTopic(data);
//         setPropSelectedTopicId(data.id);
//       }
//       setEditingTopic(null);
//       setShowTopicForm(false);
//       setTopicForm({ topic: '', description: '' });
//     }
//   };

//   const handleFileUpload = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!selectedTopic) return;
//     const formData = new FormData();
//     formData.append('curriculum', String(selectedTopic.id));
//     formData.append('content_name', uploadForm.content_name);
//     formData.append('content_type', uploadForm.content_type);
//     if (uploadForm.content_type === 'link') formData.append('link', uploadForm.link);
//     else if (uploadForm.file) formData.append('file', uploadForm.file);

//     const res = await fetch(`${API_BASE}/curriculum-contents/`, {
//       method: 'POST',
//       body: formData,
//     });
//     if (res.ok) {
//       fetchFiles(selectedTopic.id);
//       setShowUploadForm(false);
//       setUploadForm({
//         content_name: '',
//         content_type: 'document',
//         file: null,
//         link: '',
//       });
//     }
//   };

//   const handleDelete = async () => {
//     if (!deleteTarget) return;
//     const urlMap = {
//       category: `${API_BASE}/training-categories/${deleteTarget.id}/`,
//       topic: `${API_BASE}/curriculums/${deleteTarget.id}/`,
//       file: `${API_BASE}/curriculum-contents/${deleteTarget.id}/`,
//     };

//     const res = await fetch(urlMap[deleteTarget.type], { method: 'DELETE' });
//     if (res.ok) {
//       if (deleteTarget.type === 'category') {
//         await fetchCategories();
//         setSelectedCategory(null);
//         setTopics([]);
//         setSelectedTopic(null);
//       } else if (deleteTarget.type === 'topic') {
//         setTopics(prev => prev.filter(t => t.id !== deleteTarget.id));
//         setSelectedTopic(null);
//       } else if (deleteTarget.type === 'file' && selectedTopic) {
//         fetchFiles(selectedTopic.id);
//       }
//     }
//     setShowDeleteModal(false);
//     setDeleteTarget(null);
//   };

//   const getFileIcon = (type: string) => {
//     if (type === 'image') return <Image className="w-5 h-5" />;
//     if (type === 'link') return <LinkIcon className="w-5 h-5" />;
//     return <File className="w-5 h-5" />;
//   };

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <div className="max-w-[1920px] mx-auto px-6 py-8">
//         {/* Top Header */}
//         <div className="mb-8">
//           <div className="flex items-center space-x-4">
//             <div className="bg-gradient-to-br from-purple-600 to-pink-600 p-4 rounded-2xl shadow-lg">
//               <Folder className="w-8 h-8 text-white" />
//             </div>
//             <div>
//               <h1 className="text-4xl font-bold text-gray-900">Curriculum</h1>
//               <p className="text-gray-600 mt-1 text-lg font-medium">
//                 Organize training materials & questions
//               </p>
//             </div>
//           </div>
//         </div>

//         <div
//           className={
//             showQuestionManager
//               ? 'block'
//               : 'grid grid-cols-1 md:grid-cols-[24rem_1fr] gap-12'
//           }
//         >
//           {/* LEFT COLUMN */}
//           {!showQuestionManager && (
//             <div className="space-y-8">
//               {/* CATEGORIES */}
//               <div className="bg-white rounded-3xl shadow-xl border-2 border-purple-200 p-7">
//                 <div className="flex items-center justify-between mb-4">
//                   <h2 className="text-2xl font-bold text-purple-700">Categories</h2>
//                   <button
//                     onClick={() => setShowCategoryForm(true)}
//                     className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold px-4 py-2 rounded-xl shadow hover:scale-105 flex items-center gap-2"
//                   >
//                     <Plus className="w-5 h-5" />
//                   </button>
//                 </div>
//                 {showCategoryForm && (
//                   <form
//                     onSubmit={handleCategorySubmit}
//                     className="space-y-3 bg-purple-50 p-4 rounded-lg mb-4"
//                   >
//                     <input
//                       type="text"
//                       value={categoryForm.name}
//                       onChange={e =>
//                         setCategoryForm({ ...categoryForm, name: e.target.value })
//                       }
//                       className="w-full px-3 py-2 border border-purple-300 rounded"
//                       placeholder="Name"
//                       required
//                     />
//                     <textarea
//                       value={categoryForm.description}
//                       onChange={e =>
//                         setCategoryForm({
//                           ...categoryForm,
//                           description: e.target.value,
//                         })
//                       }
//                       className="w-full px-3 py-2 border border-purple-300 rounded"
//                       placeholder="Description"
//                       rows={2}
//                     />
//                     <div className="flex gap-2">
//                       <button
//                         type="submit"
//                         className="flex-1 bg-purple-600 text-white py-1 rounded"
//                       >
//                         Save
//                       </button>
//                       <button
//                         type="button"
//                         onClick={() => setShowCategoryForm(false)}
//                         className="flex-1 bg-gray-300 py-1 rounded"
//                       >
//                         Cancel
//                       </button>
//                     </div>
//                   </form>
//                 )}
//                 <div className="space-y-2 max-h-[400px] overflow-y-auto">
//                   {categories.map(category => (
//                     <div
//                       key={category.id}
//                       onClick={() => {
//                         setSelectedCategory(category);
//                         setPropSelectedCategoryId(category.id);
//                       }}
//                       className={`p-3 rounded-lg cursor-pointer transition-all border-2 ${
//                         selectedCategory?.id === category.id
//                           ? 'border-purple-300 bg-purple-100'
//                           : 'border-gray-100 bg-white hover:bg-purple-50'
//                       }`}
//                     >
//                       <div className="flex items-center justify-between">
//                         <div className="flex items-center gap-3 font-bold text-gray-900">
//                           <Folder className="w-5 h-5 text-purple-600" />
//                           {category.name}
//                         </div>
//                         <div className="flex gap-1">
//                           <button
//                             onClick={e => {
//                               e.stopPropagation();
//                               setEditingCategory(category);
//                               setCategoryForm({
//                                 name: category.name,
//                                 description: category.description,
//                               });
//                               setShowCategoryForm(true);
//                             }}
//                           >
//                             <Edit2 className="w-4 h-4 text-purple-600" />
//                           </button>
//                           <button
//                             onClick={e => {
//                               e.stopPropagation();
//                               setDeleteTarget({
//                                 type: 'category',
//                                 id: category.id,
//                                 name: category.name,
//                               });
//                               setShowDeleteModal(true);
//                             }}
//                           >
//                             <Trash2 className="w-4 h-4 text-red-600" />
//                           </button>
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>

//               {/* TOPICS */}
//               {selectedCategory && (
//                 <div className="bg-white rounded-3xl shadow-xl border-2 border-green-200 p-7">
//                   <div className="flex items-center justify-between mb-4">
//                     <h2 className="text-2xl font-bold text-green-700">Topics</h2>
//                     <button
//                       onClick={() => setShowTopicForm(true)}
//                       className="bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold px-4 py-2 rounded-xl shadow hover:scale-105 flex items-center gap-2"
//                     >
//                       <Plus className="w-5 h-5" />
//                     </button>
//                   </div>
//                   {showTopicForm && (
//                     <form
//                       onSubmit={handleTopicSubmit}
//                       className="space-y-3 bg-green-50 p-4 rounded-lg mb-4"
//                     >
//                       <input
//                         type="text"
//                         value={topicForm.topic}
//                         onChange={e =>
//                           setTopicForm({ ...topicForm, topic: e.target.value })
//                         }
//                         className="w-full px-3 py-2 border border-green-300 rounded"
//                         placeholder="Topic"
//                         required
//                       />
//                       <textarea
//                         value={topicForm.description}
//                         onChange={e =>
//                           setTopicForm({
//                             ...topicForm,
//                             description: e.target.value,
//                           })
//                         }
//                         className="w-full px-3 py-2 border border-green-300 rounded"
//                         placeholder="Description"
//                         rows={2}
//                       />
//                       <div className="flex gap-2">
//                         <button
//                           type="submit"
//                           className="flex-1 bg-green-600 text-white py-1 rounded"
//                         >
//                           Save
//                         </button>
//                         <button
//                           type="button"
//                           onClick={() => setShowTopicForm(false)}
//                           className="flex-1 bg-gray-300 py-1 rounded"
//                         >
//                           Cancel
//                         </button>
//                       </div>
//                     </form>
//                   )}
//                   <div className="space-y-2 max-h-[400px] overflow-y-auto">
//                     {topics.map(topic => (
//                       <div
//                         key={topic.id}
//                         onClick={() => {
//                           setSelectedTopic(topic);
//                           setPropSelectedTopicId(topic.id);
//                         }}
//                         className={`p-3 rounded-lg cursor-pointer transition-all border-2 ${
//                           selectedTopic?.id === topic.id
//                             ? 'border-green-300 bg-green-100'
//                             : 'border-gray-100 bg-white hover:bg-green-50'
//                         }`}
//                       >
//                         <div className="flex items-center justify-between">
//                           <div className="font-bold text-gray-900">
//                             {topic.topic}
//                           </div>
//                           <div className="flex gap-1">
//                             <button
//                               onClick={e => {
//                                 e.stopPropagation();
//                                 setEditingTopic(topic);
//                                 setTopicForm({
//                                   topic: topic.topic,
//                                   description: topic.description,
//                                 });
//                                 setShowTopicForm(true);
//                               }}
//                             >
//                               <Edit2 className="w-4 h-4 text-green-600" />
//                             </button>
//                             <button
//                               onClick={e => {
//                                 e.stopPropagation();
//                                 setDeleteTarget({
//                                   type: 'topic',
//                                   id: topic.id,
//                                   name: topic.topic,
//                                 });
//                                 setShowDeleteModal(true);
//                               }}
//                             >
//                               <Trash2 className="w-4 h-4 text-red-600" />
//                             </button>
//                           </div>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               )}
//             </div>
//           )}

//           {/* RIGHT COLUMN */}
//           <div>
//             {selectedTopic ? (
//               showQuestionManager ? (
//                 <div className="animate-fade-in">
//                   <button
//                     onClick={() => setShowQuestionManager(false)}
//                     className="mb-4 flex items-center gap-2 text-gray-600 hover:text-purple-600 font-bold transition-colors"
//                   >
//                     <ArrowLeft className="w-5 h-5" /> Back to Topics
//                   </button>
//                   {selectedCategory && (
//                     <RefresherQuestionManager
//                       categoryId={selectedCategory.id}
//                       categoryName={selectedCategory.name}
//                       onClose={() => setShowQuestionManager(false)}
//                     />
//                   )}
//                 </div>
//               ) : (
//                 <div className="bg-white rounded-3xl shadow-xl border-2 border-blue-200 p-7 animate-fade-in">
//                   <div className="flex items-center justify-between mb-6">
//                     <div>
//                       <h3 className="text-2xl font-bold text-blue-700">
//                         {selectedTopic.topic}
//                       </h3>
//                       <p className="text-blue-600 mt-1">
//                         {selectedTopic.description}
//                       </p>
//                     </div>

//                     <div className="flex items-center gap-4">
//                       {/* View mode toggle */}
//                       <div className="flex bg-gray-200 rounded-lg p-1">
//                         <button
//                           onClick={() => setViewMode('grid')}
//                           className={`p-2 rounded-md ${
//                             viewMode === 'grid' ? 'bg-white shadow' : ''
//                           }`}
//                         >
//                           <Grid3X3 className="w-4 h-4" />
//                         </button>
//                         <button
//                           onClick={() => setViewMode('list')}
//                           className={`p-2 rounded-md ${
//                             viewMode === 'list' ? 'bg-white shadow' : ''
//                           }`}
//                         >
//                           <List className="w-4 h-4" />
//                         </button>
//                       </div>

//                       {/* Hover-expand icon buttons */}
//                       <div className="flex items-center gap-2">
//                         {/* Upload button */}
//                         <button
//                           type="button"
//                           onClick={() => setShowUploadForm(true)}
//                           className="group flex items-center overflow-hidden rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold shadow transition-all duration-200 h-10 w-10 hover:w-32"
//                         >
//                           <div className="w-10 flex justify-center">
//                             <Upload className="w-5 h-5" />
//                           </div>
//                           <span className="ml-1 text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-150">
//                             Upload File
//                           </span>
//                         </button>

//                         {/* Manage Questions button */}
//                         <button
//                           type="button"
//                           onClick={() => setShowQuestionManager(true)}
//                           className="group flex items-center overflow-hidden rounded-xl bg-gradient-to-r from-purple-600 to-pink-500 text-white font-bold shadow transition-all duration-200 h-10 w-10 hover:w-40"
//                         >
//                           <div className="w-10 flex justify-center">
//                             <Database className="w-5 h-5" />
//                           </div>
//                           <span className="ml-1 text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-150">
//                             Manage Questions
//                           </span>
//                         </button>
//                       </div>
//                     </div>
//                   </div>

//                   {showUploadForm && (
//                     <div className="bg-blue-50 border-2 border-blue-200 rounded-xl mb-8 p-6 shadow">
//                       <div className="flex justify-between mb-4">
//                         <h4 className="font-bold text-blue-700">Upload Content</h4>
//                         <button onClick={() => setShowUploadForm(false)}>
//                           <X className="w-6 h-6" />
//                         </button>
//                       </div>
//                       <form onSubmit={handleFileUpload} className="space-y-4">
//                         <input
//                           type="text"
//                           value={uploadForm.content_name}
//                           onChange={e =>
//                             setUploadForm({
//                               ...uploadForm,
//                               content_name: e.target.value,
//                             })
//                           }
//                           className="w-full p-2 border rounded"
//                           placeholder="Content Name"
//                           required
//                         />
//                         <select
//                           value={uploadForm.content_type}
//                           onChange={e =>
//                             setUploadForm({
//                               ...uploadForm,
//                               content_type: e.target.value as any,
//                             })
//                           }
//                           className="w-full p-2 border rounded"
//                         >
//                           <option value="document">Document</option>
//                           <option value="image">Image</option>
//                           <option value="link">Link</option>
//                         </select>
//                         {uploadForm.content_type === 'link' ? (
//                           <input
//                             type="url"
//                             value={uploadForm.link}
//                             onChange={e =>
//                               setUploadForm({
//                                 ...uploadForm,
//                                 link: e.target.value,
//                               })
//                             }
//                             className="w-full p-2 border rounded"
//                             placeholder="http://"
//                             required
//                           />
//                         ) : (
//                           <input
//                             type="file"
//                             onChange={e =>
//                               setUploadForm({
//                                 ...uploadForm,
//                                 file: e.target.files?.[0] || null,
//                               })
//                             }
//                             className="w-full p-2 border rounded"
//                             required
//                           />
//                         )}
//                         <div className="flex justify-end gap-2">
//                           <button
//                             type="button"
//                             onClick={() => setShowUploadForm(false)}
//                             className="px-4 py-2 border rounded"
//                           >
//                             Cancel
//                           </button>
//                           <button
//                             type="submit"
//                             className="px-4 py-2 bg-blue-600 text-white rounded font-bold"
//                           >
//                             Upload
//                           </button>
//                         </div>
//                       </form>
//                     </div>
//                   )}

//                   {uploadedFiles.length > 0 ? (
//                     <div
//                       className={
//                         viewMode === 'grid'
//                           ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
//                           : 'space-y-3'
//                       }
//                     >
//                       {uploadedFiles.map(file => (
//                         <div
//                           key={file.id}
//                           className={`bg-white rounded-2xl shadow border-2 border-blue-200 p-4 flex ${
//                             viewMode === 'list'
//                               ? 'items-center justify-between'
//                               : 'flex-col gap-3'
//                           }`}
//                         >
//                           <div className="flex items-center gap-3">
//                             {getFileIcon(file.content_type)}
//                             <div>
//                               <h4 className="font-bold text-gray-800 text-sm">
//                                 {file.content_name}
//                               </h4>
//                             </div>
//                           </div>
//                           <div className="flex items-center gap-2 ml-auto">
//                             <a
//                               href={getFileUrl(file)}
//                               target="_blank"
//                               rel="noreferrer"
//                               className="text-blue-600 hover:text-blue-800"
//                             >
//                               <Eye className="w-4 h-4" />
//                             </a>
//                             <button
//                               onClick={() => {
//                                 setDeleteTarget({
//                                   type: 'file',
//                                   id: file.id,
//                                   name: file.content_name,
//                                 });
//                                 setShowDeleteModal(true);
//                               }}
//                               className="text-red-600 hover:text-red-800"
//                             >
//                               <Trash2 className="w-4 h-4" />
//                             </button>
//                           </div>
//                         </div>
//                       ))}
//                     </div>
//                   ) : (
//                     <div className="text-center py-12 text-gray-500">
//                       No content uploaded yet.
//                     </div>
//                   )}
//                 </div>
//               )
//             ) : (
//               <div className="bg-white rounded-3xl shadow-xl border-2 border-gray-200 p-12 text-center">
//                 <BookOpen className="w-20 h-20 text-purple-200 mx-auto mb-4" />
//                 <h3 className="text-xl font-bold text-gray-800 mb-2">
//                   No topic selected
//                 </h3>
//                 <p className="text-gray-600">
//                   Select a topic to manage content or questions.
//                 </p>
//               </div>
//             )}
//           </div>
//         </div>

//         {showDeleteModal && deleteTarget && (
//           <ConfirmModal
//             title="Delete Item"
//             message={`Delete "${deleteTarget.name}"?`}
//             onConfirm={handleDelete}
//             onCancel={() => setShowDeleteModal(false)}
//           />
//         )}
//       </div>
//     </div>
//   );
// };

// export default Curriculum;






import React, { useState, useEffect } from 'react';
import {
  Plus,
  Edit2,
  Trash2,
  Upload,
  Grid3X3,
  List,
  File,
  Image,
  Link as LinkIcon,
  X,
  BookOpen,
  Folder,
  Eye,
  Database,
  ArrowLeft,
  Layers,
} from 'lucide-react';
import ConfirmModal from './modal'; // Assuming this is the new Tailwind ConfirmModal
import RefresherQuestionManager from './RefresherQuestionManager';

const API_BASE = 'http://127.0.0.1:8000';

interface TrainingCategory {
  id: number;
  name: string;
  description: string;
  created_at: string;
}

interface TrainingTopic {
  id: number;
  category: TrainingCategory;
  category_id: number;
  topic: string;
  description: string;
  created_at: string;
}

interface UploadedFile {
  id: number;
  curriculum: number;
  content_name: string;
  content_type: 'document' | 'image' | 'link';
  file?: string | null;
  link?: string | null;
  uploaded_at: string;
}

interface CurriculumProps {
  selectedCategoryId: number | string | null;
  selectedTopicId: number | string | null;
  setSelectedCategoryId: (categoryId: number | string | null) => void;
  setSelectedTopicId: (topicId: number | string | null) => void;
}

type DeleteTarget =
  | { type: 'category'; id: number; name: string }
  | { type: 'topic'; id: number; name: string }
  | { type: 'file'; id: number; name: string }
  | null;

const Curriculum: React.FC<CurriculumProps> = ({
  selectedCategoryId: propSelectedCategoryId,
  selectedTopicId: propSelectedTopicId,
  setSelectedCategoryId: setPropSelectedCategoryId,
  setSelectedTopicId: setPropSelectedTopicId,
}) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<DeleteTarget>(null);

  const [pendingTopicId, setPendingTopicId] = useState<number | string | null>(null);
  const [categories, setCategories] = useState<TrainingCategory[]>([]);
  const [topics, setTopics] = useState<TrainingTopic[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<TrainingCategory | null>(
    null
  );
  const [selectedTopic, setSelectedTopic] = useState<TrainingTopic | null>(null);

  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [showTopicForm, setShowTopicForm] = useState(false);
  const [showUploadForm, setShowUploadForm] = useState(false);

  // Question Manager
  const [showQuestionManager, setShowQuestionManager] = useState(false);

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [editingCategory, setEditingCategory] = useState<TrainingCategory | null>(
    null
  );
  const [editingTopic, setEditingTopic] = useState<TrainingTopic | null>(null);

  const [categoryForm, setCategoryForm] = useState({ name: '', description: '' });
  const [topicForm, setTopicForm] = useState({ topic: '', description: '' });
  const [uploadForm, setUploadForm] = useState({
    content_name: '',
    content_type: 'document' as 'document' | 'image' | 'link',
    file: null as File | null,
    link: '',
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (propSelectedCategoryId != null && categories.length > 0) {
      const cat = categories.find(c => c.id === propSelectedCategoryId) || null;
      setSelectedCategory(cat);
    }
  }, [propSelectedCategoryId, categories]);

  useEffect(() => {
    if (selectedCategory) {
      fetchTopics(selectedCategory.id);
      setPropSelectedCategoryId(selectedCategory.id);
    } else {
      setTopics([]);
      setSelectedTopic(null);
      setPropSelectedTopicId(null);
    }
  }, [selectedCategory]);

  useEffect(() => {
    if (propSelectedTopicId != null) {
      setPendingTopicId(propSelectedTopicId);
    }
  }, [propSelectedTopicId]);

  useEffect(() => {
    if (topics.length === 0) return;
    if (pendingTopicId != null) {
      const topicId =
        typeof pendingTopicId === 'string' ? parseInt(pendingTopicId) : pendingTopicId;
      const matchedTopic = topics.find(t => t.id === topicId);
      if (matchedTopic) {
        setSelectedTopic(matchedTopic);
        setPropSelectedTopicId(matchedTopic.id);
      } else if (topics.length > 0) {
        setSelectedTopic(topics[0]);
        setPropSelectedTopicId(topics[0].id);
      }
      setPendingTopicId(null);
    } else if (!selectedTopic && topics.length > 0) {
      setSelectedTopic(topics[0]);
      setPropSelectedTopicId(topics[0].id);
    }
  }, [topics]);

  useEffect(() => {
    if (selectedTopic) {
      fetchFiles(selectedTopic.id);
      setPropSelectedTopicId(selectedTopic.id);
      setShowQuestionManager(false);
    } else {
      setUploadedFiles([]);
    }
  }, [selectedTopic]);

  const getFileUrl = (file: UploadedFile) => {
    if (file.content_type === 'link') return file.link || '#';
    if (file.file)
      return file.file.startsWith('http') ? file.file : `${API_BASE}${file.file}`;
    return '#';
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch(`${API_BASE}/training-categories/`);
      if (res.ok) {
        const data: TrainingCategory[] = await res.json();
        setCategories(data);
        if (propSelectedCategoryId == null && data.length > 0) {
          setSelectedCategory(data[0]);
          setPropSelectedCategoryId(data[0].id);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchTopics = async (categoryId: number) => {
    try {
      const res = await fetch(`${API_BASE}/curriculums/?category_id=${categoryId}`);
      if (res.ok) {
        const data: TrainingTopic[] = await res.json();
        setTopics(data);
        setSelectedTopic(null);
        setUploadedFiles([]);
        if (propSelectedTopicId != null) {
          const matched = data.find(t => t.id === propSelectedTopicId);
          if (matched) {
            setSelectedTopic(matched);
            setPropSelectedTopicId(matched.id);
            return;
          }
        }
        if (data.length > 0) {
          setSelectedTopic(data[0]);
          setPropSelectedTopicId(data[0].id);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchFiles = async (topicId: number) => {
    try {
      const res = await fetch(`${API_BASE}/curriculum-contents/?curriculum=${topicId}`);
      if (res.ok) setUploadedFiles(await res.json());
    } catch (error) {
      console.error(error);
    }
  };

  const handleCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = editingCategory ? 'PUT' : 'POST';
    const url = editingCategory
      ? `${API_BASE}/training-categories/${editingCategory.id}/`
      : `${API_BASE}/training-categories/`;

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(categoryForm),
    });

    if (res.ok) {
      if (!editingCategory) {
        const newCategory = await res.json();
        setCategories(prev => [...prev, newCategory]);
        setSelectedCategory(newCategory);
        setPropSelectedCategoryId(newCategory.id);
      } else {
        await fetchCategories();
      }
      setEditingCategory(null);
      setShowCategoryForm(false);
      setCategoryForm({ name: '', description: '' });
    }
  };

  const handleTopicSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCategory) return;
    const method = editingTopic ? 'PUT' : 'POST';
    const url = editingTopic
      ? `${API_BASE}/curriculums/${editingTopic.id}/`
      : `${API_BASE}/curriculums/`;

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        topic: topicForm.topic,
        description: topicForm.description,
        category_id: selectedCategory.id,
      }),
    });

    if (res.ok) {
      const data = await res.json();
      if (editingTopic) {
        setTopics(prev => prev.map(t => (t.id === data.id ? data : t)));
      } else {
        setTopics(prev => [...prev, data]);
        setSelectedTopic(data);
        setPropSelectedTopicId(data.id);
      }
      setEditingTopic(null);
      setShowTopicForm(false);
      setTopicForm({ topic: '', description: '' });
    }
  };

  const handleFileUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTopic) return;
    const formData = new FormData();
    formData.append('curriculum', String(selectedTopic.id));
    formData.append('content_name', uploadForm.content_name);
    formData.append('content_type', uploadForm.content_type);
    if (uploadForm.content_type === 'link') formData.append('link', uploadForm.link);
    else if (uploadForm.file) formData.append('file', uploadForm.file);

    const res = await fetch(`${API_BASE}/curriculum-contents/`, {
      method: 'POST',
      body: formData,
    });
    if (res.ok) {
      fetchFiles(selectedTopic.id);
      setShowUploadForm(false);
      setUploadForm({
        content_name: '',
        content_type: 'document',
        file: null,
        link: '',
      });
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    const urlMap = {
      category: `${API_BASE}/training-categories/${deleteTarget.id}/`,
      topic: `${API_BASE}/curriculums/${deleteTarget.id}/`,
      file: `${API_BASE}/curriculum-contents/${deleteTarget.id}/`,
    };

    const res = await fetch(urlMap[deleteTarget.type], { method: 'DELETE' });
    if (res.ok) {
      if (deleteTarget.type === 'category') {
        await fetchCategories();
        setSelectedCategory(null);
        setTopics([]);
        setSelectedTopic(null);
      } else if (deleteTarget.type === 'topic') {
        setTopics(prev => prev.filter(t => t.id !== deleteTarget.id));
        setSelectedTopic(null);
      } else if (deleteTarget.type === 'file' && selectedTopic) {
        fetchFiles(selectedTopic.id);
      }
    }
    setShowDeleteModal(false);
    setDeleteTarget(null);
  };

  const getFileIcon = (type: string) => {
    if (type === 'image') return <Image className="w-5 h-5 text-purple-600" />;
    if (type === 'link') return <LinkIcon className="w-5 h-5 text-blue-600" />;
    return <File className="w-5 h-5 text-orange-600" />;
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-[1920px] mx-auto px-6 py-8">
        
        {/* Top Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4">
            <div className="bg-gradient-to-br from-purple-600 to-pink-600 p-4 rounded-2xl shadow-lg">
              <Layers className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-text">Curriculum</h1>
              <p className="text-muted mt-1 text-lg font-medium">
                Organize training materials & questions
              </p>
            </div>
          </div>
        </div>

        <div
          className={
            showQuestionManager
              ? 'block'
              : 'grid grid-cols-1 md:grid-cols-[24rem_1fr] gap-8'
          }
        >
          {/* LEFT COLUMN */}
          {!showQuestionManager && (
            <div className="space-y-6">
              
              {/* CATEGORIES */}
              <div className="bg-surface rounded-3xl shadow-lg border border-border p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-text flex items-center gap-2">
                    <Folder className="w-5 h-5 text-purple-600" /> Training Topics
                  </h2>
                  <button
                    onClick={() => setShowCategoryForm(true)}
                    className="bg-purple-100 text-purple-700 hover:bg-purple-200 p-2 rounded-xl transition-colors"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
                
                {showCategoryForm && (
                  <form
                    onSubmit={handleCategorySubmit}
                    className="space-y-3 bg-background border border-border p-4 rounded-xl mb-4 animate-fade-in"
                  >
                    <input
                      type="text"
                      value={categoryForm.name}
                      onChange={e =>
                        setCategoryForm({ ...categoryForm, name: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-border bg-surface rounded-xl text-sm focus:ring-2 focus:ring-purple-200 outline-none"
                      placeholder="Category Name"
                      required
                    />
                    <textarea
                      value={categoryForm.description}
                      onChange={e =>
                        setCategoryForm({
                          ...categoryForm,
                          description: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 border border-border bg-surface rounded-xl text-sm focus:ring-2 focus:ring-purple-200 outline-none"
                      placeholder="Description"
                      rows={2}
                    />
                    <div className="flex gap-2">
                      <button
                        type="submit"
                        className="flex-1 bg-purple-600 text-white py-2 rounded-lg text-sm font-bold hover:bg-purple-700 transition"
                      >
                        Save
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowCategoryForm(false)}
                        className="flex-1 bg-background border border-border text-muted py-2 rounded-lg text-sm font-bold hover:bg-gray-100 transition"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                )}

                <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                  {categories.map(category => (
                    <div
                      key={category.id}
                      onClick={() => {
                        setSelectedCategory(category);
                        setPropSelectedCategoryId(category.id);
                      }}
                      className={`p-3 rounded-xl cursor-pointer transition-all border ${
                        selectedCategory?.id === category.id
                          ? 'border-purple-300 bg-purple-50/50 shadow-sm'
                          : 'border-transparent bg-background hover:bg-surface hover:border-border'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className={`font-bold text-sm ${selectedCategory?.id === category.id ? 'text-purple-800' : 'text-text'}`}>
                          {category.name}
                        </div>
                        <div className="flex gap-1 opacity-60 hover:opacity-100">
                          <button
                            onClick={e => {
                              e.stopPropagation();
                              setEditingCategory(category);
                              setCategoryForm({
                                name: category.name,
                                description: category.description,
                              });
                              setShowCategoryForm(true);
                            }}
                            className="p-1.5 hover:bg-purple-100 rounded-md text-purple-600"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={e => {
                              e.stopPropagation();
                              setDeleteTarget({
                                type: 'category',
                                id: category.id,
                                name: category.name,
                              });
                              setShowDeleteModal(true);
                            }}
                            className="p-1.5 hover:bg-red-100 rounded-md text-red-600"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                  {categories.length === 0 && !showCategoryForm && (
                    <p className="text-sm text-muted text-center py-4">No categories yet</p>
                  )}
                </div>
              </div>

              {/* TOPICS */}
              {selectedCategory && (
                <div className="bg-surface rounded-3xl shadow-lg border border-border p-6 animate-fade-in">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-text flex items-center gap-2">
                      <BookOpen className="w-5 h-5 text-indigo-600" /> Topics
                    </h2>
                    <button
                      onClick={() => setShowTopicForm(true)}
                      className="bg-indigo-100 text-indigo-700 hover:bg-indigo-200 p-2 rounded-xl transition-colors"
                    >
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>
                  
                  {showTopicForm && (
                    <form
                      onSubmit={handleTopicSubmit}
                      className="space-y-3 bg-background border border-border p-4 rounded-xl mb-4 animate-fade-in"
                    >
                      <input
                        type="text"
                        value={topicForm.topic}
                        onChange={e =>
                          setTopicForm({ ...topicForm, topic: e.target.value })
                        }
                        className="w-full px-4 py-2 border border-border bg-surface rounded-xl text-sm focus:ring-2 focus:ring-indigo-200 outline-none"
                        placeholder="Topic Name"
                        required
                      />
                      <textarea
                        value={topicForm.description}
                        onChange={e =>
                          setTopicForm({
                            ...topicForm,
                            description: e.target.value,
                          })
                        }
                        className="w-full px-4 py-2 border border-border bg-surface rounded-xl text-sm focus:ring-2 focus:ring-indigo-200 outline-none"
                        placeholder="Description"
                        rows={2}
                      />
                      <div className="flex gap-2">
                        <button
                          type="submit"
                          className="flex-1 bg-indigo-600 text-white py-2 rounded-lg text-sm font-bold hover:bg-indigo-700 transition"
                        >
                          Save
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowTopicForm(false)}
                          className="flex-1 bg-background border border-border text-muted py-2 rounded-lg text-sm font-bold hover:bg-gray-100 transition"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  )}

                  <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                    {topics.map(topic => (
                      <div
                        key={topic.id}
                        onClick={() => {
                          setSelectedTopic(topic);
                          setPropSelectedTopicId(topic.id);
                        }}
                        className={`p-3 rounded-xl cursor-pointer transition-all border ${
                          selectedTopic?.id === topic.id
                            ? 'border-indigo-300 bg-indigo-50/50 shadow-sm'
                            : 'border-transparent bg-background hover:bg-surface hover:border-border'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className={`font-bold text-sm ${selectedTopic?.id === topic.id ? 'text-indigo-800' : 'text-text'}`}>
                            {topic.topic}
                          </div>
                          <div className="flex gap-1 opacity-60 hover:opacity-100">
                            <button
                              onClick={e => {
                                e.stopPropagation();
                                setEditingTopic(topic);
                                setTopicForm({
                                  topic: topic.topic,
                                  description: topic.description,
                                });
                                setShowTopicForm(true);
                              }}
                              className="p-1.5 hover:bg-indigo-100 rounded-md text-indigo-600"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={e => {
                                e.stopPropagation();
                                setDeleteTarget({
                                  type: 'topic',
                                  id: topic.id,
                                  name: topic.topic,
                                });
                                setShowDeleteModal(true);
                              }}
                              className="p-1.5 hover:bg-red-100 rounded-md text-red-600"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                     {topics.length === 0 && !showTopicForm && (
                      <p className="text-sm text-muted text-center py-4">No topics yet</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* RIGHT COLUMN */}
          <div>
            {selectedTopic ? (
              showQuestionManager ? (
                <div className="animate-fade-in">
                  <button
                    onClick={() => setShowQuestionManager(false)}
                    className="mb-4 flex items-center gap-2 text-muted hover:text-purple-600 font-bold transition-colors"
                  >
                    <ArrowLeft className="w-5 h-5" /> Back to Topics
                  </button>
                  {selectedCategory && (
                    <RefresherQuestionManager
                      categoryId={selectedCategory.id}
                      categoryName={selectedCategory.name}
                      onClose={() => setShowQuestionManager(false)}
                    />
                  )}
                </div>
              ) : (
                <div className="bg-surface rounded-3xl shadow-xl border border-border p-8 animate-fade-in">
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <h3 className="text-2xl font-bold text-text">
                        {selectedTopic.topic}
                      </h3>
                      <p className="text-muted mt-1">
                        {selectedTopic.description || "No description provided."}
                      </p>
                    </div>

                    <div className="flex items-center gap-4">
                      {/* View mode toggle */}
                      <div className="flex bg-background border border-border rounded-xl p-1">
                        <button
                          onClick={() => setViewMode('grid')}
                          className={`p-2 rounded-lg transition-all ${
                            viewMode === 'grid' ? 'bg-surface shadow text-purple-600' : 'text-muted hover:text-text'
                          }`}
                        >
                          <Grid3X3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setViewMode('list')}
                          className={`p-2 rounded-lg transition-all ${
                            viewMode === 'list' ? 'bg-surface shadow text-purple-600' : 'text-muted hover:text-text'
                          }`}
                        >
                          <List className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Hover-expand icon buttons */}
                      <div className="flex items-center gap-2">
                        {/* Upload button */}
                        <button
                          type="button"
                          onClick={() => setShowUploadForm(true)}
                          className="group flex items-center overflow-hidden rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold shadow transition-all duration-300 h-10 w-10 hover:w-32"
                        >
                          <div className="min-w-[2.5rem] flex justify-center">
                            <Upload className="w-5 h-5" />
                          </div>
                          <span className="text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pl-1 pr-4">
                            Upload File
                          </span>
                        </button>

                        {/* Manage Questions button */}
                        <button
                          type="button"
                          onClick={() => setShowQuestionManager(true)}
                          className="group flex items-center overflow-hidden rounded-xl bg-gradient-to-r from-purple-600 to-pink-500 text-white font-bold shadow transition-all duration-300 h-10 w-10 hover:w-44"
                        >
                          <div className="min-w-[2.5rem] flex justify-center">
                            <Database className="w-5 h-5" />
                          </div>
                          <span className="text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pl-1 pr-4">
                            Manage Questions
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {showUploadForm && (
                    <div className="bg-blue-50/50 border border-blue-200 rounded-2xl mb-8 p-6 animate-fade-in">
                      <div className="flex justify-between mb-4">
                        <h4 className="font-bold text-blue-800 flex items-center gap-2">
                            <Upload className="w-4 h-4" /> Upload Content
                        </h4>
                        <button onClick={() => setShowUploadForm(false)} className="text-blue-400 hover:text-blue-700">
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                      <form onSubmit={handleFileUpload} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input
                            type="text"
                            value={uploadForm.content_name}
                            onChange={e =>
                                setUploadForm({
                                ...uploadForm,
                                content_name: e.target.value,
                                })
                            }
                            className="w-full px-4 py-2 border border-blue-200 bg-white rounded-xl text-sm focus:ring-2 focus:ring-blue-300 outline-none"
                            placeholder="Content Name"
                            required
                            />
                            <select
                            value={uploadForm.content_type}
                            onChange={e =>
                                setUploadForm({
                                ...uploadForm,
                                content_type: e.target.value as any,
                                })
                            }
                            className="w-full px-4 py-2 border border-blue-200 bg-white rounded-xl text-sm focus:ring-2 focus:ring-blue-300 outline-none"
                            >
                            <option value="document">Document</option>
                            <option value="image">Image</option>
                            <option value="link">Link</option>
                            </select>
                        </div>
                        
                        {uploadForm.content_type === 'link' ? (
                          <input
                            type="url"
                            value={uploadForm.link}
                            onChange={e =>
                              setUploadForm({
                                ...uploadForm,
                                link: e.target.value,
                              })
                            }
                            className="w-full px-4 py-2 border border-blue-200 bg-white rounded-xl text-sm focus:ring-2 focus:ring-blue-300 outline-none"
                            placeholder="https://..."
                            required
                          />
                        ) : (
                          <div className="border-2 border-dashed border-blue-200 rounded-xl p-4 bg-white text-center hover:bg-blue-50 transition-colors">
                              <input
                                type="file"
                                onChange={e =>
                                setUploadForm({
                                    ...uploadForm,
                                    file: e.target.files?.[0] || null,
                                })
                                }
                                className="w-full text-sm text-blue-600 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200 cursor-pointer"
                                required
                            />
                          </div>
                        )}
                        <div className="flex justify-end gap-3 pt-2">
                          <button
                            type="button"
                            onClick={() => setShowUploadForm(false)}
                            className="px-6 py-2 border border-blue-200 text-blue-700 rounded-xl text-sm font-bold hover:bg-white transition"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="px-6 py-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-xl text-sm font-bold hover:shadow-lg transition"
                          >
                            Upload
                          </button>
                        </div>
                      </form>
                    </div>
                  )}

                  {uploadedFiles.length > 0 ? (
                    <div
                      className={
                        viewMode === 'grid'
                          ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'
                          : 'space-y-3'
                      }
                    >
                      {uploadedFiles.map(file => (
                        <div
                          key={file.id}
                          className={`bg-background rounded-2xl border border-border p-4 flex hover:shadow-md hover:border-purple-200 transition-all group ${
                            viewMode === 'list'
                              ? 'items-center justify-between'
                              : 'flex-col gap-3'
                          }`}
                        >
                          <div className="flex items-center gap-3 overflow-hidden">
                            <div className="p-2.5 bg-surface border border-border rounded-xl">
                                {getFileIcon(file.content_type)}
                            </div>
                            <div className="min-w-0">
                              <h4 className="font-bold text-text text-sm truncate">
                                {file.content_name}
                              </h4>
                              <p className="text-xs text-muted truncate">
                                {new Date(file.uploaded_at).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          
                          <div className={`flex items-center gap-2 ${viewMode === 'grid' ? 'ml-auto mt-2' : ''}`}>
                            <a
                              href={getFileUrl(file)}
                              target="_blank"
                              rel="noreferrer"
                              className="p-2 text-muted hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="View"
                            >
                              <Eye className="w-4 h-4" />
                            </a>
                            <button
                              onClick={() => {
                                setDeleteTarget({
                                  type: 'file',
                                  id: file.id,
                                  name: file.content_name,
                                });
                                setShowDeleteModal(true);
                              }}
                              className="p-2 text-muted hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-16 bg-background rounded-2xl border border-border border-dashed">
                       <File className="w-12 h-12 text-muted mx-auto mb-3 opacity-50" />
                      <p className="text-muted font-medium">No content uploaded yet.</p>
                      <button onClick={() => setShowUploadForm(true)} className="text-purple-600 text-sm font-bold hover:underline mt-2">
                          Upload your first file
                      </button>
                    </div>
                  )}
                </div>
              )
            ) : (
              <div className="bg-surface rounded-3xl shadow-lg border border-border p-12 text-center h-full flex flex-col items-center justify-center min-h-[400px]">
                <div className="w-20 h-20 bg-background rounded-full flex items-center justify-center mb-6 border border-border">
                    <BookOpen className="w-10 h-10 text-muted opacity-50" />
                </div>
                <h3 className="text-xl font-bold text-text mb-2">
                  No topic selected
                </h3>
                <p className="text-muted max-w-sm">
                  Select a topic from the left menu to manage its content and questions.
                </p>
              </div>
            )}
          </div>
        </div>

        {showDeleteModal && deleteTarget && (
          <ConfirmModal
            title="Delete Item"
            message={`Are you sure you want to delete "${deleteTarget.name}"? This action cannot be undone.`}
            onConfirm={handleDelete}
            onCancel={() => setShowDeleteModal(false)}
          />
        )}
      </div>
    </div>
  );
};

export default Curriculum;