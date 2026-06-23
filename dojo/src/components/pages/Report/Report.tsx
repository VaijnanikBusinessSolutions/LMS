


// // src/pages/Report.tsx
// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import {
//   ChevronRight,
//   Download,
//   FileText,
//   History,
//   Users,
//   CheckSquare,
//   BarChart3,
//   AlertCircle,
//   Sparkles,
// } from "lucide-react";

// // -----------------------------------------------------------------------------
// // Fixed Reports (Always Visible)
// // -----------------------------------------------------------------------------
// const fixedReports = [
//   {
//     title: "Employee History",
//     description: "Full audit trail of employee lifecycle changes and historical snapshots.",
//     icon: History,
//     gradient: "from-indigo-500 to-purple-600",
//     path: "/EmployeeHistorySearch",
//   },
//   {
//     title: "Master Table",
//     description: "Complete employee database snapshot. Export to Excel for offline analysis.",
//     icon: FileText,
//     gradient: "from-blue-500 to-cyan-600",
//     path: "/MasterTable",
//     hasExport: true,
//   },
// ];

// // -----------------------------------------------------------------------------
// // Dynamic Reports (Controlled by Matrix Config – Global Enable Check)
// // -----------------------------------------------------------------------------
// const dynamicReportModules = [
//   {
//     id: "ojt",
//     title: "OJT Status",
//     description: "Monitor trainee progress and On-the-Job Training completion in real time.",
//     icon: Users,
//     gradient: "from-emerald-500 to-teal-600",
//     path: "/ojt-status",
//     configKey: "ojt_enabled",
//   },
//   {
//     id: "ten-cycle",
//     title: "Ten Cycle Status",
//     description: "Track performance across all levels with completion rates and pass/fail results.",
//     icon: CheckSquare,
//     gradient: "from-purple-500 to-pink-600",
//     path: "/tencycle-status",
//     configKey: "ten_cycle_enabled",
//   },
//   {
//     id: "skill-evaluation",
//     title: "Skill Evaluation",
//     description: "Assess operator competency, track skill growth, and identify training gaps.",
//     icon: BarChart3,
//     gradient: "from-orange-500 to-amber-600",
//     path: "/skillevaluationslist",
//     configKey: "skill_evaluation_enabled",
//   },
//   // {
//   //   id: "evaluation",
//   //   title: "Evaluation Test Report",
//   //   description: "View results and analytics from evaluation tests.",
//   //   icon: FileText,
//   //   gradient: "from-blue-500 to-indigo-600",
//   //   path: "/evaluation-report",
//   //   configKey: "evaluation_enabled",
//   // },
//   {
//     id: "maru-a",
//     title: "Maru A Certification",
//     description: "Final approval & independent operation certification tracking.",
//     icon: CheckSquare,
//     gradient: "from-red-500 to-rose-600",
//     path: "/marua-status",
//     configKey: "maru_a_enabled",
//   },
//   {
//     id: "others",
//     title: "Others Report",
//     description: "Custom training materials and miscellaneous records.",
//     icon: FileText,
//     gradient: "from-gray-500 to-slate-600",
//     path: "/others-report",
//     configKey: "others_enabled",
//   },
// ] as const;

// // -----------------------------------------------------------------------------
// // API
// // -----------------------------------------------------------------------------
// const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";
// const ENABLED_METHODS_URL = `${API_BASE_URL}/station-sheet-configs/enabled-methods/`;

// // -----------------------------------------------------------------------------
// // Component
// // -----------------------------------------------------------------------------
// const Report = () => {
//   const navigate = useNavigate();

//   const [enabledMethods, setEnabledMethods] = useState<Record<string, boolean>>({});
//   const [loading, setLoading] = useState(true);
//   const [isDownloading, setIsDownloading] = useState(false);
//   const [downloadSuccess, setDownloadSuccess] = useState(false);

//   // Fetch globally enabled methods (fast, one request)
//   useEffect(() => {
//     const fetchEnabledMethods = async () => {
//       try {
//         setLoading(true);
//         const res = await fetch(ENABLED_METHODS_URL);
//         if (!res.ok) throw new Error("Failed to fetch enabled methods");
//         const data = await res.json();
//         setEnabledMethods(data); // { ojt_enabled: true, ten_cycle_enabled: false, ... }
//       } catch (err) {
//         console.error("Failed to load enabled methods:", err);
//         // Fallback: show all if API fails (safe default)
//         setEnabledMethods({
//           ojt_enabled: true,
//           ten_cycle_enabled: true,
//           skill_evaluation_enabled: true,
//           evaluation_enabled: true,
//           maru_a_enabled: true,
//           others_enabled: true,
//         });
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchEnabledMethods();
//   }, []);

//   const handleDownload = async () => {
//       try {
//         setIsDownloading(true);
//         setDownloadSuccess(false);

//         // Call the API endpoint
//         const response = await fetch('http://127.0.0.1:8000/employees-excel/export_excel/');
//         const blob = await response.blob();
        

//         if (!response.ok) {
//           throw new Error('Network response was not ok');
//         }

//         // Get the file as a Blob
        

//         // Create a temporary URL for the blob
//         const url = window.URL.createObjectURL(blob);

//         // Create a temporary link element
//         const a = document.createElement('a');
//         a.href = url;
//         a.download = 'employees.xlsx'; // Set the desired filename

//         // Append link to the body and click it to trigger download
//         document.body.appendChild(a);
//         a.click();

//         // Clean up
//         window.URL.revokeObjectURL(url);
//         document.body.removeChild(a);

//         setDownloadSuccess(true);

//       } catch (error) {
//         console.error('Download error:', error);
//         alert('Failed to download the file. Please try again.');
//       } finally {
//         setIsDownloading(false);
//       }
//   };

//   useEffect(() => {
//     if (downloadSuccess) {
//       const t = setTimeout(() => setDownloadSuccess(false), 4000);
//       return () => clearTimeout(t);
//     }
//   }, [downloadSuccess]);

//   // Show only modules where configKey is true in enabledMethods
//   const visibleDynamicReports = dynamicReportModules.filter(
//     (m) => enabledMethods[m.configKey]
//   );

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-teal-50 flex items-center justify-center">
//         <div className="text-center">
//           <Sparkles className="w-16 h-16 text-indigo-500 mx-auto animate-spin mb-4" />
//           <p className="text-gray-600 text-xl font-medium">Loading report permissions…</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-teal-50">
//       {/* Header */}
  

//       <main className="max-w-7xl mx-auto px-6 py-10">
//         {/* Success Toast */}
//         {downloadSuccess && (
//           <div className="fixed top-6 right-6 z-50 bg-white/90 backdrop-blur-md border border-emerald-200 rounded-2xl shadow-xl px-6 py-4 flex items-center gap-3 animate-in slide-in-from-top">
//             <div className="w-9 h-9 bg-emerald-100 rounded-full flex items-center justify-center">
//               <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
//               </svg>
//             </div>
//             <div>
//               <p className="font-semibold">Download Complete!</p>
//               <p className="text-xs text-gray-600">Master table exported successfully</p>
//             </div>
//           </div>
//         )}

//         {/* Hero */}
//         <section className="mb-12 text-center">
//           <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600">
//             Reports Dashboard
//           </h2>
//           <p className="text-lg text-gray-600 max-w-2xl mx-auto">
//             Access all training and employee reports. Only modules enabled in the Matrix Configuration appear here.
//           </p>
//         </section>

//         {/* Fixed Reports (Always Shown) */}
//         <section className="mb-16">
//           <h3 className="text-2xl font-bold text-gray-800 mb-8 flex items-center gap-3">
//             <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
//               <Sparkles className="w-6 h-6 text-white" />
//             </div>
//             Core Reports
//           </h3>
//           <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
//             {fixedReports.map((r) => (
//               <div
//                 key={r.title}
//                 className="group relative bg-white/70 backdrop-blur-xl rounded-3xl border border-gray-100 shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 overflow-hidden"
//               >
//                 <div className={`absolute inset-0 bg-gradient-to-br ${r.gradient}/5 opacity-0 group-hover:opacity-100 transition-opacity`} />
//                 <div className="relative p-8">
//                   <div className=" items-center justify-between mb-6">
//                   <div
//   className={`w-14 h-14 bg-gradient-to-br ${r.gradient} rounded-2xl flex items-center justify-center shadow-lg`}
// >
//   <r.icon className="w-7 h-7 text-white" />
// </div>

//                   </div>
//                   <h3 className="text-2xl font-bold text-gray-900 mb-3">{r.title}</h3>
//                   <p className="text-gray-600 mb-8">{r.description}</p>

//                   <div className="space-y-3">
//                     <button
//                       onClick={() => navigate(r.path)}
//                       className={`w-full bg-gradient-to-r ${r.gradient} text-white px-6 py-4 rounded-xl font-bold flex items-center justify-center gap-2 shadow-md hover:shadow-xl transform hover:scale-105 transition-all`}
//                     >
//                       <BarChart3 className="w-5 h-5" />
//                       View Report
//                     </button>

//                     {r.hasExport && (
//                       <button
//                         onClick={handleDownload}
//                         disabled={isDownloading}
//                         className={`w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-bold transition-all ${
//                           isDownloading
//                             ? "bg-gray-100 text-gray-400 cursor-not-allowed"
//                             : "bg-gradient-to-r from-emerald-500 to-teal-600 text-white hover:shadow-xl"
//                         }`}
//                       >
//                         {isDownloading ? (
//                           <>
//                             <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
//                               <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
//                               <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
//                             </svg>
//                             Exporting…
//                           </>
//                         ) : (
//                           <>
//                             <Download className="w-5 h-5" />
//                             Export to Excel
//                           </>
//                         )}
//                       </button>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </section>

//         {/* Dynamic Reports (Only if globally enabled) */}
//         <section>
//           <h3 className="text-2xl font-bold text-gray-800 mb-8 flex items-center gap-3">
//             <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
//               <CheckSquare className="w-6 h-6 text-white" />
//             </div>
//             Training Reports
//           </h3>

//           {visibleDynamicReports.length === 0 ? (
//             <div className="text-center py-16 bg-white/60 backdrop-blur-sm rounded-3xl border border-gray-200">
//               <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
//               <p className="text-xl text-gray-600 font-medium">No training reports are currently enabled</p>
//               <p className="text-gray-500 mt-2">Enable modules in the Matrix Configuration to see them here</p>
//             </div>
//           ) : (
//             <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
//               {visibleDynamicReports.map((m) => {
//                 const Icon = m.icon;
//                 return (
//                   <div
//                     key={m.id}
//                     className="group relative bg-white/70 backdrop-blur-xl rounded-3xl border border-gray-100 shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 overflow-hidden"
//                   >
//                     <div className={`absolute inset-0 bg-gradient-to-br ${m.gradient}/5 opacity-0 group-hover:opacity-100 transition-opacity`} />
//                     <div className="relative p-8">
//                       <div className="flex items-center justify-between mb-6">
//                         <div className={`w-14 h-14 bg-gradient-to-br ${m.gradient} rounded-2xl flex items-center justify-center shadow-lg`}>
//                           <Icon className="w-7 h-7 text-white" />
//                         </div>
//                       </div>
//                       <h3 className="text-2xl font-bold text-gray-900 mb-3">{m.title}</h3>
//                       <p className="text-gray-600 mb-8">{m.description}</p>
//                       <button
//                         onClick={() => navigate(m.path)}
//                         className={`w-full bg-gradient-to-r ${m.gradient} text-white px-6 py-4 rounded-xl font-bold flex items-center justify-center gap-2 shadow-md hover:shadow-xl transform hover:scale-105 transition-all`}
//                       >
//                         View Report
//                         <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
//                       </button>
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>
//           )}
//         </section>
//       </main>
//     </div>
//   );
// };

// export default Report;




// src/pages/Report.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ChevronRight,
  Download,
  FileText,
  History,
  Users,
  CheckSquare,
  BarChart3,
  AlertCircle,
  Sparkles,
} from "lucide-react";

// -----------------------------------------------------------------------------
// Fixed Reports (Always Visible)
// -----------------------------------------------------------------------------
const fixedReports = [
  {
    title: "Employee History",
    description: "Full audit trail of employee lifecycle changes and historical snapshots.",
    icon: History,
    gradient: "from-indigo-500 to-purple-600",
    path: "/EmployeeHistorySearch",
  },
  {
    title: "Master Table",
    description: "Complete employee database snapshot. Export to Excel for offline analysis.",
    icon: FileText,
    gradient: "from-blue-500 to-cyan-600",
    path: "/MasterTable",
    hasExport: true,
  },
];

// -----------------------------------------------------------------------------
// Dynamic Reports (Controlled by Matrix Config – Global Enable Check)
// -----------------------------------------------------------------------------
const dynamicReportModules = [
  {
    id: "ojt",
    title: "OJT Status",
    description: "Monitor trainee progress and On-the-Job Training completion in real time.",
    icon: Users,
    gradient: "from-emerald-500 to-teal-600",
    path: "/ojt-status",
    configKey: "ojt_enabled",
  },
  {
    id: "ten-cycle",
    title: "Ten Cycle Status",
    description: "Track performance across all levels with completion rates and pass/fail results.",
    icon: CheckSquare,
    gradient: "from-purple-500 to-pink-600",
    path: "/tencycle-status",
    configKey: "ten_cycle_enabled",
  },
  {
    id: "skill-evaluation",
    title: "Skill Evaluation",
    description: "Assess operator competency, track skill growth, and identify training gaps.",
    icon: BarChart3,
    gradient: "from-orange-500 to-amber-600",
    path: "/skillevaluationslist",
    configKey: "skill_evaluation_enabled",
  },
  {
    id: "maru-a",
    title: "Maru A Certification",
    description: "Final approval & independent operation certification tracking.",
    icon: CheckSquare,
    gradient: "from-red-500 to-rose-600",
    path: "/marua-status",
    configKey: "maru_a_enabled",
  },
  {
    id: "others",
    title: "Others Report",
    description: "Custom training materials and miscellaneous records.",
    icon: FileText,
    gradient: "from-gray-500 to-slate-600",
    path: "/others-report",
    configKey: "others_enabled",
  },
] as const;

// -----------------------------------------------------------------------------
// API
// -----------------------------------------------------------------------------
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";
const ENABLED_METHODS_URL = `${API_BASE_URL}/station-sheet-configs/enabled-methods/`;

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------
const Report = () => {
  const navigate = useNavigate();

  const [enabledMethods, setEnabledMethods] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  // Fetch globally enabled methods (fast, one request)
  useEffect(() => {
    const fetchEnabledMethods = async () => {
      try {
        setLoading(true);
        const res = await fetch(ENABLED_METHODS_URL);
        if (!res.ok) throw new Error("Failed to fetch enabled methods");
        const data = await res.json();
        setEnabledMethods(data); 
      } catch (err) {
        console.error("Failed to load enabled methods:", err);
        // Fallback: show all if API fails
        setEnabledMethods({
          ojt_enabled: true,
          ten_cycle_enabled: true,
          skill_evaluation_enabled: true,
          evaluation_enabled: true,
          maru_a_enabled: true,
          others_enabled: true,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchEnabledMethods();
  }, []);

  const handleDownload = async () => {
      try {
        setIsDownloading(true);
        setDownloadSuccess(false);

        const response = await fetch(`${API_BASE_URL}/employees-excel/export_excel/`);
        
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'employees.xlsx'; 
        document.body.appendChild(a);
        a.click();

        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);

        setDownloadSuccess(true);

      } catch (error) {
        console.error('Download error:', error);
        alert('Failed to download the file. Please try again.');
      } finally {
        setIsDownloading(false);
      }
  };

  useEffect(() => {
    if (downloadSuccess) {
      const t = setTimeout(() => setDownloadSuccess(false), 4000);
      return () => clearTimeout(t);
    }
  }, [downloadSuccess]);

  const visibleDynamicReports = dynamicReportModules.filter(
    (m) => enabledMethods[m.configKey]
  );

  if (loading) {
    return (
      // Loading State: bg-background, text-primary
      <div className="min-h-screen bg-background flex items-center justify-center transition-colors duration-300">
        <div className="text-center">
          <Sparkles className="w-16 h-16 text-primary mx-auto animate-spin mb-4" />
          <p className="text-text text-xl font-medium">Loading report permissions…</p>
        </div>
      </div>
    );
  }

  return (
    // Main Container: bg-background (replaces gradient)
    <div className="min-h-screen bg-background text-text transition-colors duration-300">
      
      <main className="max-w-7xl mx-auto px-6 py-10">
        {/* Success Toast: bg-surface, border-border */}
        {downloadSuccess && (
          <div className="fixed top-6 right-6 z-50 bg-surface border border-green-500/30 rounded-2xl shadow-hard px-6 py-4 flex items-center gap-3 animate-in slide-in-from-top">
            <div className="w-9 h-9 bg-green-500/20 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <p className="font-semibold text-text">Download Complete!</p>
              <p className="text-xs text-muted">Master table exported successfully</p>
            </div>
          </div>
        )}

        {/* Hero */}
        <section className="mb-12 text-center">
          {/* Title: Uses Theme Gradient (Primary to Accent) */}
          <h2 className="text-4xl md:text-5xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary via-purple-500 to-accent">
            Reports Dashboard
          </h2>
          <p className="text-lg text-muted max-w-2xl mx-auto">
            Access all training and employee reports. Only modules enabled in the Matrix Configuration appear here.
          </p>
        </section>

        {/* Fixed Reports (Always Shown) */}
        <section className="mb-16">
          <h3 className="text-2xl font-bold text-text mb-8 flex items-center gap-3">
            {/* Header Icon: Uses gradients but structure matches theme */}
            <div className="w-10 h-10 bg-gradient-to-r from-primary to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            Core Reports
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {fixedReports.map((r) => (
              <div
                key={r.title}
                // Card: bg-surface, border-border, shadow-soft
                className="group relative bg-surface rounded-3xl border border-border shadow-soft hover:shadow-medium hover:-translate-y-2 transition-all duration-300 overflow-hidden"
              >
                {/* Background Glow Effect */}
                <div className={`absolute inset-0 bg-gradient-to-br ${r.gradient}/5 opacity-0 group-hover:opacity-100 transition-opacity`} />
                
                <div className="relative p-8">
                  <div className="items-center justify-between mb-6">
                    <div className={`w-14 h-14 bg-gradient-to-br ${r.gradient} rounded-2xl flex items-center justify-center shadow-lg`}>
                      <r.icon className="w-7 h-7 text-white" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-text mb-3">{r.title}</h3>
                  <p className="text-muted mb-8">{r.description}</p>

                  <div className="space-y-3">
                    <button
                      onClick={() => navigate(r.path)}
                      // Button: Uses specific gradient for branding, text-white is constant
                      className={`w-full bg-gradient-to-r ${r.gradient} text-white px-6 py-4 rounded-xl font-bold flex items-center justify-center gap-2 shadow-md hover:shadow-xl transform hover:scale-105 transition-all`}
                    >
                      <BarChart3 className="w-5 h-5" />
                      View Report
                    </button>

                    {r.hasExport && (
                      <button
                        onClick={handleDownload}
                        disabled={isDownloading}
                        className={`w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-bold transition-all ${
                          isDownloading
                            ? "bg-muted/10 text-muted cursor-not-allowed border border-border"
                            : "bg-gradient-to-r from-emerald-500 to-teal-600 text-white hover:shadow-xl"
                        }`}
                      >
                        {isDownloading ? (
                          <>
                            <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                            Exporting…
                          </>
                        ) : (
                          <>
                            <Download className="w-5 h-5" />
                            Export to Excel
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Dynamic Reports */}
        <section>
          <h3 className="text-2xl font-bold text-text mb-8 flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
              <CheckSquare className="w-6 h-6 text-white" />
            </div>
            Training Reports
          </h3>

          {visibleDynamicReports.length === 0 ? (
            // Empty State: bg-surface, border-border, text-muted
            <div className="text-center py-16 bg-surface rounded-3xl border border-border shadow-soft">
              <AlertCircle className="w-16 h-16 text-muted/50 mx-auto mb-4" />
              <p className="text-xl text-text font-medium">No training reports are currently enabled</p>
              <p className="text-muted mt-2">Enable modules in the Matrix Configuration to see them here</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {visibleDynamicReports.map((m) => {
                const Icon = m.icon;
                return (
                  <div
                    key={m.id}
                    // Card: bg-surface, border-border
                    className="group relative bg-surface rounded-3xl border border-border shadow-soft hover:shadow-medium hover:-translate-y-2 transition-all duration-300 overflow-hidden"
                  >
                    <div className={`absolute inset-0 bg-gradient-to-br ${m.gradient}/5 opacity-0 group-hover:opacity-100 transition-opacity`} />
                    <div className="relative p-8">
                      <div className="flex items-center justify-between mb-6">
                        <div className={`w-14 h-14 bg-gradient-to-br ${m.gradient} rounded-2xl flex items-center justify-center shadow-lg`}>
                          <Icon className="w-7 h-7 text-white" />
                        </div>
                      </div>
                      <h3 className="text-2xl font-bold text-text mb-3">{m.title}</h3>
                      <p className="text-muted mb-8">{m.description}</p>
                      <button
                        onClick={() => navigate(m.path)}
                        className={`w-full bg-gradient-to-r ${m.gradient} text-white px-6 py-4 rounded-xl font-bold flex items-center justify-center gap-2 shadow-md hover:shadow-xl transform hover:scale-105 transition-all`}
                      >
                        View Report
                        <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default Report;


