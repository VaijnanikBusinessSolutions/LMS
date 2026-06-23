// import React, { useEffect, useState } from "react";
// import { API_URL } from "../CreateCourse/components/Utils/utils";

// /**
//  * CourseTestsManager.tsx
//  * Single-file React + TypeScript admin UI to manage Tests → Questions → Options
//  * against the provided Django backend.
//  *
//  * Usage:
//  *  - Import and render <CourseTestsManager /> somewhere in your app.
//  *  - Adjust API_URL if your API is hosted under a different path.
//  *
//  * Notes:
//  *  - This component uses the Course detail endpoint (GET /courses/:id/)
//  *    and updates tests by PATCHing the same endpoint with a `tests` payload
//  *    (mirrors the backend serializer which accepts nested `tests`).
//  *  - No file uploads are involved here.
//  */



// // -------------------- Types --------------------
// interface Option {
//   id?: number;
//   text: string;
//   is_correct: boolean;
// }

// interface Question {
//   id?: number;
//   question_text: string;
//   order?: number;
//   options: Option[];
// }

// interface TestType {
//   id?: number;
//   title: string;
//   order?: number;
//   questions: Question[];
// }

// interface CoursePayload {
//   id?: number;
//   title?: string;
//   tests?: TestType[];
// }

// // -------------------- Component --------------------
// export default function CourseTestsManager() {
//   const [courseId, setCourseId] = useState<number | null>(null);
//   const [course, setCourse] = useState<CoursePayload | null>(null);
//   const [loading, setLoading] = useState(false);
//   const [saving, setSaving] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   // Load course by ID
//   const loadCourse = async (id: number) => {
//     setError(null);
//     setLoading(true);
//     try {
//       const res = await fetch(`${API_URL}/courses/${id}/`);
//       if (!res.ok) throw new Error(`Failed to fetch course: ${res.status}`);
//       const data = await res.json();
//       // Ensure tests array exists
//       data.tests = data.tests || [];
//       setCourse(data);
//     } catch (e: any) {
//       setError(e.message || String(e));
//       setCourse(null);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleLoadClick = () => {
//     if (!courseId) return setError("Enter a valid course ID to load.");
//     loadCourse(courseId);
//   };

//   // Local helpers to mutate tests state
//   const updateCourse = (updater: (c: CoursePayload) => CoursePayload) => {
//     setCourse((prev) => {
//       if (!prev) return prev;
//       return updater(prev);
//     });
//   };

//   const addTest = () => {
//     updateCourse((c) => ({
//       ...c,
//       tests: [
//         ...(c.tests || []),
//         { title: "New Test", order: (c.tests?.length || 0) + 1, questions: [] },
//       ],
//     }));
//   };

//   const removeTest = (idx: number) => {
//     updateCourse((c) => ({
//       ...c,
//       tests: (c.tests || []).filter((_, i) => i !== idx),
//     }));
//   };

//   const updateTestTitle = (idx: number, title: string) => {
//     updateCourse((c) => ({
//       ...c,
//       tests: (c.tests || []).map((t, i) => (i === idx ? { ...t, title } : t)),
//     }));
//   };

//   const addQuestion = (testIdx: number) => {
//     updateCourse((c) => ({
//       ...c,
//       tests: (c.tests || []).map((t, i) =>
//         i === testIdx
//           ? {
//               ...t,
//               questions: [
//                 ...(t.questions || []),
//                 { question_text: "New question", order: (t.questions?.length || 0) + 1, options: [] },
//               ],
//             }
//           : t
//       ),
//     }));
//   };

//   const removeQuestion = (testIdx: number, qIdx: number) => {
//     updateCourse((c) => ({
//       ...c,
//       tests: (c.tests || []).map((t, i) =>
//         i === testIdx ? { ...t, questions: (t.questions || []).filter((_, j) => j !== qIdx) } : t
//       ),
//     }));
//   };

//   const updateQuestionText = (testIdx: number, qIdx: number, text: string) => {
//     updateCourse((c) => ({
//       ...c,
//       tests: (c.tests || []).map((t, i) =>
//         i === testIdx
//           ? {
//               ...t,
//               questions: (t.questions || []).map((q, j) => (j === qIdx ? { ...q, question_text: text } : q)),
//             }
//           : t
//       ),
//     }));
//   };

//   const addOption = (testIdx: number, qIdx: number) => {
//     updateCourse((c) => ({
//       ...c,
//       tests: (c.tests || []).map((t, i) =>
//         i === testIdx
//           ? {
//               ...t,
//               questions: (t.questions || []).map((q, j) =>
//                 j === qIdx
//                   ? { ...q, options: [...(q.options || []), { text: "New option", is_correct: false }] }
//                   : q
//               ),
//             }
//           : t
//       ),
//     }));
//   };

//   const removeOption = (testIdx: number, qIdx: number, oIdx: number) => {
//     updateCourse((c) => ({
//       ...c,
//       tests: (c.tests || []).map((t, i) =>
//         i === testIdx
//           ? {
//               ...t,
//               questions: (t.questions || []).map((q, j) =>
//                 j === qIdx ? { ...q, options: (q.options || []).filter((_, k) => k !== oIdx) } : q
//               ),
//             }
//           : t
//       ),
//     }));
//   };

//   const updateOption = (testIdx: number, qIdx: number, oIdx: number, patch: Partial<Option>) => {
//     updateCourse((c) => ({
//       ...c,
//       tests: (c.tests || []).map((t, i) =>
//         i === testIdx
//           ? {
//               ...t,
//               questions: (t.questions || []).map((q, j) =>
//                 j === qIdx
//                   ? {
//                       ...q,
//                       options: (q.options || []).map((o, k) => (k === oIdx ? { ...o, ...patch } : o)),
//                     }
//                   : q
//               ),
//             }
//           : t
//       ),
//     }));
//   };

//   // Save (PATCH) only the tests nested structure back to the course endpoint
//   const saveTests = async () => {
//     if (!course || !course.id) return setError("No loaded course to save.");
//     setSaving(true);
//     setError(null);
//     try {
//       const payload = { tests: course.tests };
//       const res = await fetch(`${API_URL}/courses/${course.id}/`, {
//         method: "PATCH",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload),
//       });
//       if (!res.ok) {
//         const text = await res.text();
//         throw new Error(`Save failed: ${res.status} — ${text}`);
//       }
//       const updated = await res.json();
//       // update local with server response (IDs etc.)
//       updated.tests = updated.tests || [];
//       setCourse((c) => ({ ...(c || {}), ...updated }));
//     } catch (e: any) {
//       setError(e.message || String(e));
//     } finally {
//       setSaving(false);
//     }
//   };

//   return (
//     <div className="p-4 max-w-4xl mx-auto">
//       <h2 className="text-xl font-semibold mb-3">Course → Tests Manager</h2>

//       <div className="flex gap-2 items-center mb-4">
//         <input
//           type="number"
//           value={courseId ?? ""}
//           onChange={(e) => setCourseId(e.target.value ? Number(e.target.value) : null)}
//           placeholder="Course ID"
//           className="border p-2 rounded w-32"
//         />
//         <button onClick={handleLoadClick} className="px-3 py-2 bg-slate-700 text-white rounded">
//           {loading ? "Loading..." : "Load Course"}
//         </button>
//         <button
//           onClick={() => {
//             setCourse(null);
//             setCourseId(null);
//             setError(null);
//           }}
//           className="px-3 py-2 border rounded"
//         >
//           Clear
//         </button>
//         <div className="ml-auto text-sm text-red-600">{error}</div>
//       </div>

//       {!course && <div className="text-sm text-muted">Load a course to manage its tests.</div>}

//       {course && (
//         <div>
//           <div className="mb-3 flex items-center gap-2">
//             <div className="font-medium">Course ID:</div>
//             <div className="px-2 py-1 bg-gray-100 rounded">{course.id}</div>
//             <div className="ml-4">Title: <strong>{course.title || "(no title)"}</strong></div>
//           </div>

//           <div className="mb-4">
//             <button onClick={addTest} className="px-3 py-1 bg-green-600 text-white rounded mr-2">+ Add Test</button>
//             <button onClick={saveTests} className="px-3 py-1 bg-blue-600 text-white rounded" disabled={saving}>
//               {saving ? "Saving..." : "Save Changes"}
//             </button>
//           </div>

//           <div className="space-y-4">
//             {(course.tests || []).map((t, ti) => (
//               <div key={t.id ?? `new-${ti}`} className="border rounded p-3">
//                 <div className="flex items-center gap-2 mb-2">
//                   <input
//                     className="flex-1 border p-1 rounded"
//                     value={t.title}
//                     onChange={(e) => updateTestTitle(ti, e.target.value)}
//                   />
//                   <button onClick={() => removeTest(ti)} className="px-2 py-1 border rounded text-sm">
//                     Delete Test
//                   </button>
//                   <button onClick={() => addQuestion(ti)} className="px-2 py-1 bg-indigo-600 text-white rounded text-sm">
//                     + Question
//                   </button>
//                 </div>

//                 <div className="space-y-2">
//                   {(t.questions || []).map((q, qi) => (
//                     <div key={q.id ?? `nq-${qi}`} className="bg-gray-50 p-2 rounded">
//                       <div className="flex items-start gap-2 mb-2">
//                         <textarea
//                           rows={2}
//                           className="flex-1 border p-1 rounded"
//                           value={q.question_text}
//                           onChange={(e) => updateQuestionText(ti, qi, e.target.value)}
//                         />
//                         <div className="flex flex-col gap-2">
//                           <button onClick={() => removeQuestion(ti, qi)} className="px-2 py-1 border rounded text-sm">
//                             Delete Q
//                           </button>
//                           <button onClick={() => addOption(ti, qi)} className="px-2 py-1 rounded text-sm bg-teal-600 text-white">
//                             + Option
//                           </button>
//                         </div>
//                       </div>

//                       <div className="space-y-1">
//                         {(q.options || []).map((o, oi) => (
//                           <div key={o.id ?? `no-${oi}`} className="flex items-center gap-2">
//                             <input
//                               className="flex-1 border p-1 rounded"
//                               value={o.text}
//                               onChange={(e) => updateOption(ti, qi, oi, { text: e.target.value })}
//                             />
//                             <label className="flex items-center gap-1 text-sm">
//                               <input
//                                 type="checkbox"
//                                 checked={!!o.is_correct}
//                                 onChange={(e) => updateOption(ti, qi, oi, { is_correct: e.target.checked })}
//                               />
//                               Correct
//                             </label>
//                             <button onClick={() => removeOption(ti, qi, oi)} className="px-2 py-1 border rounded text-sm">
//                               Remove
//                             </button>
//                           </div>
//                         ))}

//                         {(!q.options || q.options.length === 0) && (
//                           <div className="text-xs text-gray-500">No options yet — add one.</div>
//                         )}
//                       </div>
//                     </div>
//                   ))}

//                   {(t.questions || []).length === 0 && <div className="text-sm text-gray-500">No questions yet — add one.</div>}
//                 </div>
//               </div>
//             ))}

//             {(course.tests || []).length === 0 && <div className="text-sm text-gray-500">No tests yet — create one above.</div>}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }
import React, { useEffect, useState } from "react";
import { API_URL } from "../CreateCourse/components/Utils/utils";
import { Plus, Trash2, Save, Loader2, AlertCircle, CheckCircle, FileText, HelpCircle, Check, X } from "lucide-react";

/**
 * CourseTestsManager.tsx
 * Single-file React + TypeScript admin UI to manage Tests → Questions → Options
 * against the provided Django backend.
 *
 * Usage:
 *  - Import and render <CourseTestsManager /> somewhere in your app.
 *  - Adjust API_URL if your API is hosted under a different path.
 *
 * Notes:
 *  - This component uses the Course detail endpoint (GET /courses/:id/)
 *    and updates tests by PATCHing the same endpoint with a `tests` payload
 *    (mirrors the backend serializer which accepts nested `tests`).
 *  - No file uploads are involved here.
 */

// -------------------- Types --------------------
interface Option {
  id?: number;
  text: string;
  is_correct: boolean;
}

interface Question {
  id?: number;
  question_text: string;
  order?: number;
  options: Option[];
}

interface TestType {
  id?: number;
  title: string;
  order?: number;
  questions: Question[];
}

interface CoursePayload {
  id?: number;
  title?: string;
  tests?: TestType[];
}

// -------------------- Component --------------------
export default function CourseTestsManager() {
  const [courseId, setCourseId] = useState<number | null>(null);
  const [course, setCourse] = useState<CoursePayload | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load course by ID
  const loadCourse = async (id: number) => {
    setError(null);
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/courses/${id}/`);
      if (!res.ok) throw new Error(`Failed to fetch course: ${res.status}`);
      const data = await res.json();
      // Ensure tests array exists
      data.tests = data.tests || [];
      setCourse(data);
    } catch (e: any) {
      setError(e.message || String(e));
      setCourse(null);
    } finally {
      setLoading(false);
    }
  };

  const handleLoadClick = () => {
    if (!courseId) return setError("Enter a valid course ID to load.");
    loadCourse(courseId);
  };

  // Local helpers to mutate tests state
  const updateCourse = (updater: (c: CoursePayload) => CoursePayload) => {
    setCourse((prev) => {
      if (!prev) return prev;
      return updater(prev);
    });
  };

  const addTest = () => {
    updateCourse((c) => ({
      ...c,
      tests: [
        ...(c.tests || []),
        { title: "New Test", order: (c.tests?.length || 0) + 1, questions: [] },
      ],
    }));
  };

  const removeTest = (idx: number) => {
    updateCourse((c) => ({
      ...c,
      tests: (c.tests || []).filter((_, i) => i !== idx),
    }));
  };

  const updateTestTitle = (idx: number, title: string) => {
    updateCourse((c) => ({
      ...c,
      tests: (c.tests || []).map((t, i) => (i === idx ? { ...t, title } : t)),
    }));
  };

  const addQuestion = (testIdx: number) => {
    updateCourse((c) => ({
      ...c,
      tests: (c.tests || []).map((t, i) =>
        i === testIdx
          ? {
              ...t,
              questions: [
                ...(t.questions || []),
                { question_text: "New question", order: (t.questions?.length || 0) + 1, options: [] },
              ],
            }
          : t
      ),
    }));
  };

  const removeQuestion = (testIdx: number, qIdx: number) => {
    updateCourse((c) => ({
      ...c,
      tests: (c.tests || []).map((t, i) =>
        i === testIdx ? { ...t, questions: (t.questions || []).filter((_, j) => j !== qIdx) } : t
      ),
    }));
  };

  const updateQuestionText = (testIdx: number, qIdx: number, text: string) => {
    updateCourse((c) => ({
      ...c,
      tests: (c.tests || []).map((t, i) =>
        i === testIdx
          ? {
              ...t,
              questions: (t.questions || []).map((q, j) => (j === qIdx ? { ...q, question_text: text } : q)),
            }
          : t
      ),
    }));
  };

  const addOption = (testIdx: number, qIdx: number) => {
    updateCourse((c) => ({
      ...c,
      tests: (c.tests || []).map((t, i) =>
        i === testIdx
          ? {
              ...t,
              questions: (t.questions || []).map((q, j) =>
                j === qIdx
                  ? { ...q, options: [...(q.options || []), { text: "New option", is_correct: false }] }
                  : q
              ),
            }
          : t
      ),
    }));
  };

  const removeOption = (testIdx: number, qIdx: number, oIdx: number) => {
    updateCourse((c) => ({
      ...c,
      tests: (c.tests || []).map((t, i) =>
        i === testIdx
          ? {
              ...t,
              questions: (t.questions || []).map((q, j) =>
                j === qIdx ? { ...q, options: (q.options || []).filter((_, k) => k !== oIdx) } : q
              ),
            }
          : t
      ),
    }));
  };

  const updateOption = (testIdx: number, qIdx: number, oIdx: number, patch: Partial<Option>) => {
    updateCourse((c) => ({
      ...c,
      tests: (c.tests || []).map((t, i) =>
        i === testIdx
          ? {
              ...t,
              questions: (t.questions || []).map((q, j) =>
                j === qIdx
                  ? {
                      ...q,
                      options: (q.options || []).map((o, k) => (k === oIdx ? { ...o, ...patch } : o)),
                    }
                  : q
              ),
            }
          : t
      ),
    }));
  };

  // Save (PATCH) only the tests nested structure back to the course endpoint
  const saveTests = async () => {
    if (!course || !course.id) return setError("No loaded course to save.");
    setSaving(true);
    setError(null);
    try {
      const payload = { tests: course.tests };
      const res = await fetch(`${API_URL}/courses/${course.id}/`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Save failed: ${res.status} — ${text}`);
      }
      const updated = await res.json();
      // update local with server response (IDs etc.)
      updated.tests = updated.tests || [];
      setCourse((c) => ({ ...(c || {}), ...updated }));
    } catch (e: any) {
      setError(e.message || String(e));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl blur-lg opacity-50"></div>
              <div className="relative bg-gradient-to-br from-green-600 to-emerald-600 p-3 rounded-xl">
                <FileText className="text-white" size={28} />
              </div>
            </div>
            <div>
              <h2 className="text-3xl font-bold text-white">Course Tests Manager</h2>
              <p className="text-gray-400 mt-1">Manage tests, questions, and options for your courses</p>
            </div>
          </div>
        </div>

        {/* Load Course Section */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-6 mb-6 shadow-xl">
          <div className="flex gap-3 items-start flex-wrap">
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-semibold text-gray-300 mb-2">Course ID</label>
              <input
                type="number"
                value={courseId ?? ""}
                onChange={(e) => setCourseId(e.target.value ? Number(e.target.value) : null)}
                placeholder="Enter Course ID"
                className="w-full p-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
              />
            </div>
            
            <div className="flex gap-3 items-end">
              <button 
                onClick={handleLoadClick} 
                disabled={loading}
                className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-500 hover:to-emerald-600 text-white rounded-lg font-semibold transition-all shadow-lg shadow-green-500/25 hover:shadow-green-500/40 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Loading...
                  </>
                ) : (
                  'Load Course'
                )}
              </button>
              
              <button
                onClick={() => {
                  setCourse(null);
                  setCourseId(null);
                  setError(null);
                }}
                className="px-6 py-3 bg-gray-700/50 hover:bg-gray-700 border border-gray-600 hover:border-gray-500 text-gray-300 hover:text-white rounded-lg font-semibold transition-all"
              >
                Clear
              </button>
            </div>
          </div>

          {error && (
            <div className="mt-4 p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex items-center gap-3">
              <AlertCircle className="text-red-400" size={20} />
              <span className="text-red-400 text-sm font-medium">{error}</span>
            </div>
          )}
        </div>

        {!course && (
          <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-12 text-center">
            <HelpCircle className="mx-auto mb-4 text-gray-600" size={48} />
            <p className="text-gray-400 text-lg">Load a course to manage its tests</p>
          </div>
        )}

        {course && (
          <div className="space-y-6">
            {/* Course Info */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-6 shadow-xl">
              <div className="flex items-center gap-4 flex-wrap">
                <div className="flex items-center gap-2">
                  <span className="text-gray-400 font-medium">Course ID:</span>
                  <span className="px-3 py-1.5 bg-gray-700/50 text-white font-mono rounded-lg border border-gray-600">
                    {course.id}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-400 font-medium">Title:</span>
                  <span className="text-white font-semibold">{course.title || "(no title)"}</span>
                </div>
                <div className="flex items-center gap-2 ml-auto">
                  <span className="text-gray-400 font-medium">Tests:</span>
                  <span className="px-3 py-1.5 bg-green-500/20 text-green-400 font-semibold rounded-lg border border-green-500/30">
                    {(course.tests || []).length}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button 
                onClick={addTest} 
                className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-500 hover:to-emerald-600 text-white rounded-lg font-semibold transition-all shadow-lg shadow-green-500/25 hover:shadow-green-500/40 flex items-center gap-2"
              >
                <Plus size={18} />
                Add Test
              </button>
              
              <button 
                onClick={saveTests} 
                disabled={saving}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white rounded-lg font-semibold transition-all shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {saving ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save size={18} />
                    Save Changes
                  </>
                )}
              </button>
            </div>

            {/* Tests List */}
            <div className="space-y-4">
              {(course.tests || []).map((t, ti) => (
                <div key={t.id ?? `new-${ti}`} className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-6 shadow-xl">
                  {/* Test Header */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex-1">
                      <label className="block text-sm font-semibold text-gray-300 mb-2">Test Title</label>
                      <input
                        className="w-full p-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                        value={t.title}
                        onChange={(e) => updateTestTitle(ti, e.target.value)}
                        placeholder="Test title..."
                      />
                    </div>
                    
                    <div className="flex gap-2 items-end">
                      <button 
                        onClick={() => removeTest(ti)} 
                        className="px-4 py-3 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 hover:text-red-300 rounded-lg font-semibold transition-all flex items-center gap-2"
                      >
                        <Trash2 size={16} />
                        Delete Test
                      </button>
                      
                      <button 
                        onClick={() => addQuestion(ti)} 
                        className="px-4 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-semibold transition-all flex items-center gap-2"
                      >
                        <Plus size={16} />
                        Add Question
                      </button>
                    </div>
                  </div>

                  {/* Questions List */}
                  <div className="space-y-3">
                    {(t.questions || []).map((q, qi) => (
                      <div key={q.id ?? `nq-${qi}`} className="bg-gray-700/30 rounded-xl p-4 border border-gray-600/50">
                        {/* Question Header */}
                        <div className="flex items-start gap-3 mb-3">
                          <div className="flex-1">
                            <label className="block text-sm font-semibold text-gray-300 mb-2">
                              Question {qi + 1}
                            </label>
                            <textarea
                              rows={2}
                              className="w-full p-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all resize-none"
                              value={q.question_text}
                              onChange={(e) => updateQuestionText(ti, qi, e.target.value)}
                              placeholder="Enter question text..."
                            />
                          </div>
                          
                          <div className="flex flex-col gap-2 pt-7">
                            <button 
                              onClick={() => removeQuestion(ti, qi)} 
                              className="px-3 py-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 rounded-lg transition-all text-sm font-semibold"
                            >
                              <Trash2 size={14} />
                            </button>
                            
                            <button 
                              onClick={() => addOption(ti, qi)} 
                              className="px-3 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-lg transition-all text-sm font-semibold"
                            >
                              <Plus size={14} />
                            </button>
                          </div>
                        </div>

                        {/* Options List */}
                        <div className="space-y-2">
                          {(q.options || []).map((o, oi) => (
                            <div key={o.id ?? `no-${oi}`} className="flex items-center gap-2 bg-gray-800/50 p-3 rounded-lg border border-gray-600/50">
                              <span className="text-sm font-bold text-gray-400 bg-gray-700/50 w-7 h-7 rounded-lg flex items-center justify-center border border-gray-600">
                                {String.fromCharCode(65 + oi)}
                              </span>
                              
                              <input
                                className="flex-1 p-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
                                value={o.text}
                                onChange={(e) => updateOption(ti, qi, oi, { text: e.target.value })}
                                placeholder="Option text..."
                              />
                              
                              <label className="flex items-center gap-2 cursor-pointer bg-gray-700/50 px-3 py-2 rounded-lg border border-gray-600 hover:border-green-500/50 transition-all group">
                                <input
                                  type="checkbox"
                                  checked={!!o.is_correct}
                                  onChange={(e) => updateOption(ti, qi, oi, { is_correct: e.target.checked })}
                                  className="sr-only peer"
                                />
                                <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                                  o.is_correct 
                                    ? 'bg-green-500 border-green-400' 
                                    : 'border-gray-500 group-hover:border-green-500/50'
                                }`}>
                                  {o.is_correct && <Check size={14} className="text-white" strokeWidth={3} />}
                                </div>
                                <span className="text-sm font-semibold text-gray-300 group-hover:text-white transition-colors">
                                  Correct
                                </span>
                              </label>
                              
                              <button 
                                onClick={() => removeOption(ti, qi, oi)} 
                                className="px-3 py-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 rounded-lg transition-all"
                              >
                                <X size={16} />
                              </button>
                            </div>
                          ))}

                          {(!q.options || q.options.length === 0) && (
                            <div className="text-xs text-gray-500 bg-gray-800/30 p-3 rounded-lg text-center border border-gray-700/50">
                              No options yet — add one above
                            </div>
                          )}
                        </div>
                      </div>
                    ))}

                    {(t.questions || []).length === 0 && (
                      <div className="text-sm text-gray-500 bg-gray-800/30 p-6 rounded-xl text-center border border-gray-700/50">
                        No questions yet — add one above
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {(course.tests || []).length === 0 && (
                <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-12 text-center">
                  <FileText className="mx-auto mb-4 text-gray-600" size={48} />
                  <p className="text-gray-400 text-lg">No tests yet — create one above</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
