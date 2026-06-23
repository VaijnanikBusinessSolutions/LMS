


// /*=====================================================================
//   OJTForm.tsx  –  Quality + Quantity in ONE file with live switch
// =====================================================================*/
// import React, { useState, useEffect, useCallback } from 'react';
// import type {
//   AssessmentMode,
//   TrainingTopic,
//   FormData,
//   QuantityEvaluation,
// } from '../../constants/types';
// import OJTHeader from '../../molecules/OJTHeader/OJTHeader';
// import OJTSettingsPanel from '../../molecules/OJTSettingsPanel/OJTSettingsPanel';
// import TraineeInfoForm from '../../molecules/TraineeInfoForm/TraineeInfoForm';
// import QualityAssessmentForm from '../../molecules/QualityAssessmentForm/QualityAssessmentForm';
// import QuantityAssessmentForm from '../../molecules/QuantityAssessmentForm/QuantityAssessmentForm';
// import QualityAssessmentCriteria from '../../molecules/QualityAssessmentCriteria/QualityAssessmentCriteria';
// import ProductionMarkingScheme from '../../molecules/ProductionMarkingScheme/ProductionMarkingScheme';
// import JudgmentCriteria from '../../molecules/JudgmentCriteria/JudgmentCriteria';
// import SignaturesSection from '../../molecules/SignaturesSection/SignaturesSection';
// import { useLocation } from 'react-router-dom';
// import { ojtApi } from '../../hooks/ServiceApis';
// import toast from 'react-hot-toast';

// interface Station {
//   station_id: number;
//   station_name: string;
//   department_id: number;
// }

// /* ------------------------------------------------------------------ */
// const OJTForm: React.FC = () => {
//   const location = useLocation();
//   const locationState = location.state || {};

//   /* ----------------------- NAVIGATION STATE ------------------------ */
//   const currentEmpId = locationState.employeeId;
//   const currentLevelId = locationState.levelId;
//   const currentDeptId = locationState.departmentId;
//   const initialStationId = locationState.stationId ?? null;

//   /* --------------------------- LOCAL STATE -------------------------- */
//   const [assessmentMode, setAssessmentMode] = useState<AssessmentMode>('quality');
//   const [assessmentModeLoaded, setAssessmentModeLoaded] = useState(false);
//   const [isLoading, setIsLoading] = useState(true);

//   const [stations, setStations] = useState<Station[]>([]);
//   const [filteredStations, setFilteredStations] = useState<Station[]>([]);
//   const [selectedStationId, setSelectedStationId] = useState<number | null>(initialStationId);

//   const [qualityTopics, setQualityTopics] = useState<TrainingTopic[]>([]);
//   const [quantityTopics] = useState<TrainingTopic[]>([
//     { id: 1, description: 'Production Quantity', category: 'Production' },
//     { id: 2, description: 'Quality (Number of Rejections)', category: 'Quality' },
//   ]);

//   const [days, setDays] = useState<string[]>([]);
//   const [dayIdMapping, setDayIdMapping] = useState<Record<string, number>>({});

//   const [scoreRanges, setScoreRanges] = useState<{ min_score: number; max_score: number } | null>(null);
//   const [criteria, setCriteria] = useState<number[]>([]);
//   const [quantityCriteria, setQuantityCriteria] = useState<any>(null);
//   const [quantityScoreRange, setQuantityScoreRange] = useState<any[] | null>(null);

//   const [existingOjtId, setExistingOjtId] = useState<number | null>(null);
//   const [existingQuantityId, setExistingQuantityId] = useState<number | null>(null);
//   const [lastFilledDayIndex, setLastFilledDayIndex] = useState<number>(-1);
//   const [quantityEvaluations, setQuantityEvaluations] = useState<QuantityEvaluation[]>([]);
//   const [status, setStatus] = useState<string>('Pending');

//   const [formData, setFormData] = useState<FormData>({
//     traineeInfo: {
//       name: locationState.employeeName || '',
//       id: locationState.employeeId || '',
//       empNo: locationState.employeeId || '',
//       stationName: locationState.stationName || '',
//       stationId: initialStationId,
//       lineName: locationState.lineName || '',
//       processName: locationState.sublineName || '',
//       revisionDate: new Date().toISOString().split('T')[0],
//       doi: new Date().toISOString().split('T')[0],
//       trainerName: '',
//       trainerLine: locationState.lineName || '',
//     },
//     dailyScores: {},
//     signatures: { preparedBy: '', approvedBy: '', engineerJudge: '' },
//   });

//   /* --------------------------- API HELPERS -------------------------- */
//   const fetchAssessmentMode = async () => {
//     try {
//       const { mode } = await ojtApi.getAssessmentMode();
//       setAssessmentMode(mode);
//       setAssessmentModeLoaded(true);
//     } catch (e) {
//       console.error(e);
//       setAssessmentModeLoaded(true);
//     }
//   };

//   const fetchStations = async () => {
//     try {
//       const data = await ojtApi.getStations();
//       setStations(data);
//     } catch (e) {
//       console.error(e);
//     }
//   };

//   const fetchLevelData = async () => {
//     if (!currentDeptId || !currentLevelId) return;
//     try {
//       const [
//         topicsRes,
//         daysRes,
//         scoreRes,
//         critRes,
//         qtyScoreRes,
//         qtyCritRes,
//       ] = await Promise.all([
//         ojtApi.getTopics(currentDeptId, currentLevelId),
//         ojtApi.getDays(currentDeptId, currentLevelId),
//         ojtApi.getScoreRanges(currentDeptId, currentLevelId),
//         ojtApi.getPassingCriteria(currentDeptId, currentLevelId),
//         ojtApi.getQuantityScoreRanges(currentDeptId, currentLevelId),
//         ojtApi.getQuantityPassingCriteria(currentDeptId, currentLevelId),
//       ]);

//       /* ---- Quality Topics ---- */
//       setQualityTopics(
//         topicsRes.map((t: any) => ({
//           id: t.id ?? t.topic_id,
//           description: t.topic ?? t.topic_name,
//           category: t.category ?? 'Technical Knowledge',
//         }))
//       );

//       /* ---- Days ---- */
//       const mapping: Record<string, number> = {};
//       const dayNames = daysRes.map((d: any) => {
//         const name = d.name ?? `Day-${d.id}`;
//         mapping[name] = d.id;
//         return name;
//       });
//       setDays(dayNames);
//       setDayIdMapping(mapping);

//       /* ---- Score Ranges & Criteria ---- */
//       if (scoreRes?.length) {
//         setScoreRanges({ min_score: scoreRes[0].min_score, max_score: scoreRes[0].max_score });
//       }
//       if (critRes?.length) {
//         const sorted = critRes.sort((a: any, b: any) => a.day - b.day);
//         setCriteria(sorted.map((c: any) => c.percentage));
//       }

//       /* ---- Quantity ---- */
//       setQuantityScoreRange(qtyScoreRes?.length ? qtyScoreRes : null);
//       if (qtyCritRes?.length) {
//         setQuantityCriteria({
//           production_passing_percentage: parseFloat(qtyCritRes[0].production_passing_percentage),
//           rejection_passing_percentage: parseFloat(qtyCritRes[0].rejection_passing_percentage),
//         });
//       }
//     } catch (e) {
//       console.error(e);
//     }
//   };

//   /* ----------------------- INITIAL LOAD --------------------------- */
//   useEffect(() => {
//     const init = async () => {
//       if (!currentEmpId || !currentLevelId || !currentDeptId) {
//         setIsLoading(false);
//         return;
//       }
//       setIsLoading(true);
//       await Promise.all([fetchStations(), fetchLevelData(), fetchAssessmentMode()]);
//       setIsLoading(false);
//     };
//     init();
//   }, [currentEmpId, currentLevelId, currentDeptId]);

//   /* ----------------------- FILTER STATIONS ----------------------- */
//   useEffect(() => {
//     if (currentDeptId && stations.length) {
//       const filtered = stations.filter((s) => s.department_id === currentDeptId);
//       setFilteredStations(filtered);

//       if (initialStationId && !filtered.find((s) => s.station_id === initialStationId)) {
//         setSelectedStationId(null);
//         setFormData((p) => ({
//           ...p,
//           traineeInfo: { ...p.traineeInfo, stationId: null, stationName: '' },
//         }));
//       }
//     }
//   }, [currentDeptId, stations, initialStationId]);

//   /* --------------------- MODE SWITCH HANDLER --------------------- */
//   const handleModeSwitch = useCallback(
//     (newMode: AssessmentMode) => {
//       if (newMode === assessmentMode) return;
//       const confirmMsg = `Switch to ${newMode.toUpperCase()} mode?\nAll data of the current mode will be cleared.`;
//       if (!window.confirm(confirmMsg)) return;

//       // ---- clear opposite mode data ----
//       if (newMode === 'quantity') {
//         setFormData((p) => ({ ...p, dailyScores: {} }));
//         setLastFilledDayIndex(-1);
//         setExistingOjtId(null);
//       } else {
//         setQuantityEvaluations([]);
//         setExistingQuantityId(null);
//         setStatus('Pending');
//       }
//       setAssessmentMode(newMode);
//     },
//     [assessmentMode]
//   );

//   /* ------------------- FETCH QUALITY DATA (when station selected) ------------------- */
//   useEffect(() => {
//     const fetchQuality = async () => {
//       if (
//         !assessmentModeLoaded ||
//         assessmentMode !== 'quality' ||
//         !currentEmpId ||
//         !currentLevelId ||
//         selectedStationId === null
//       ) {
//         setExistingOjtId(null);
//         setFormData((p) => ({ ...p, dailyScores: {} }));
//         setLastFilledDayIndex(-1);
//         return;
//       }

//       try {
//         const records = await ojtApi.getQualityTraineeInfoList(
//           currentEmpId,
//           selectedStationId,
//           currentLevelId,
//           currentDeptId
//         );

//         const record = records[0] ?? null;
//         if (!record) {
//           setExistingOjtId(null);
//           setFormData((p) => ({ ...p, dailyScores: {} }));
//           setLastFilledDayIndex(-1);
//           return;
//         }

//         setExistingOjtId(record.id);
//         const prefilled: Record<number, Record<string, string>> = {};

//         record.scores_data?.forEach((s: any) => {
//           const dayName =
//             Object.keys(dayIdMapping).find((k) => dayIdMapping[k] === s.day) ?? `Day-${s.day}`;
//           if (!prefilled[s.topic]) prefilled[s.topic] = {};
//           prefilled[s.topic][dayName] = String(s.score);
//         });

//         const lastIdx = Math.max(
//           -1,
//           ...Object.values(prefilled).flatMap((obj) =>
//             days.map((d, i) => (obj[d] ? i : -1))
//           )
//         );
//         setLastFilledDayIndex(lastIdx);

//         setFormData((p) => ({
//           ...p,
//           traineeInfo: {
//             ...p.traineeInfo,
//             name: record.trainee_name ?? p.traineeInfo.name,
//             id: record.trainer_id ?? p.traineeInfo.id,
//             empNo: record.emp_id ?? p.traineeInfo.empNo,
//             stationName: record.station_name ?? p.traineeInfo.stationName,
//             stationId: record.station ?? p.traineeInfo.stationId,
//             lineName: record.line ?? p.traineeInfo.lineName,
//             processName: record.subline ?? p.traineeInfo.processName,
//             revisionDate: record.revision_date ?? p.traineeInfo.revisionDate,
//             doi: record.doj ?? p.traineeInfo.doi,
//             trainerName: record.trainer_name ?? '',
//           },
//           dailyScores: prefilled,
//         }));
//       } catch (e) {
//         console.error(e);
//         toast.error('Failed to load Quality data');
//         setExistingOjtId(null);
//         setFormData((p) => ({ ...p, dailyScores: {} }));
//         setLastFilledDayIndex(-1);
//       }
//     };

//     if (assessmentMode === 'quality') fetchQuality();
//   }, [
//     assessmentMode,
//     assessmentModeLoaded,
//     currentEmpId,
//     currentLevelId,
//     currentDeptId,
//     selectedStationId,
//     dayIdMapping,
//     days,
//   ]);

//   /* ------------------- FETCH QUANTITY DATA (when station selected) ------------------- */
//   useEffect(() => {
//     const fetchQuantity = async () => {
//       if (
//         !assessmentModeLoaded ||
//         assessmentMode !== 'quantity' ||
//         !currentEmpId ||
//         !currentLevelId ||
//         selectedStationId === null
//       ) {
//         setExistingQuantityId(null);
//         setQuantityEvaluations([]);
//         setStatus('Pending');
//         return;
//       }

//       try {
//         const records = await ojtApi.getQuantityTraineeInfoList(
//           currentEmpId,
//           currentLevelId,
//           selectedStationId,
//           currentDeptId
//         );

//         const record = records[0] ?? null;
//         if (!record) {
//           setExistingQuantityId(null);
//           setQuantityEvaluations([
//             {
//               day: 1,
//               date: new Date().toISOString().split('T')[0],
//               plan: 0,
//               production_actual: 0,
//               production_marks: 0,
//               rejection_marks: 0,
//               number_of_rejections: 0,
//             },
//           ]);
//           setStatus('Pending');
//           return;
//         }

//         setExistingQuantityId(record.id);
//         setQuantityEvaluations(record.evaluations_data ?? []);
//         setStatus(record.status ?? 'Pending');

//         setFormData((p) => ({
//           ...p,
//           traineeInfo: {
//             ...p.traineeInfo,
//             name: record.trainee_name ?? p.traineeInfo.name,
//             id: record.trainee_id ?? p.traineeInfo.id,
//             empNo: record.emp_id ?? p.traineeInfo.empNo,
//             stationName: record.station_name ?? p.traineeInfo.stationName,
//             stationId: record.station ?? p.traineeInfo.stationId,
//             lineName: record.line_name ?? p.traineeInfo.lineName,
//             processName: record.process_name ?? p.traineeInfo.processName,
//             revisionDate: record.revision_date ?? p.traineeInfo.revisionDate,
//             doi: record.doj ?? p.traineeInfo.doi,
//             trainerName: record.trainer_name ?? '',
//           },
//           signatures: {
//             ...p.signatures,
//             engineerJudge: record.engineer_judge ?? '',
//           },
//         }));
//       } catch (e) {
//         console.error(e);
//         toast.error('Failed to load Quantity data');
//         setExistingQuantityId(null);
//         setQuantityEvaluations([
//           {
//             day: 1,
//             date: new Date().toISOString().split('T')[0],
//             plan: 0,
//             production_actual: 0,
//             production_marks: 0,
//             rejection_marks: 0,
//             number_of_rejections: 0,
//           },
//         ]);
//       }
//     };

//     if (assessmentMode === 'quantity') fetchQuantity();
//   }, [
//     assessmentMode,
//     assessmentModeLoaded,
//     currentEmpId,
//     currentLevelId,
//     currentDeptId,
//     selectedStationId,
//   ]);

//   /* --------------------------- INPUT HANDLERS --------------------------- */
//   const handleInputChange = (section: string, field: string, value: any) => {
//     if (section === 'traineeInfo' && field === 'stationId') {
//       const station = filteredStations.find((s) => s.station_id === value);
//       setSelectedStationId(value);
//       setFormData((p) => ({
//         ...p,
//         traineeInfo: {
//           ...p.traineeInfo,
//           stationId: value,
//           stationName: station?.station_name ?? '',
//         },
//       }));
//     } else {
//       setFormData((p) => ({
//         ...p,
//         [section]: { ...p[section as keyof FormData], [field]: value },
//       }));
//     }
//   };

//   const handleScoreChange = (topicId: number | string, day: string, value: string) => {
//     setFormData((p) => ({
//       ...p,
//       dailyScores: {
//         ...p.dailyScores,
//         [topicId]: { ...p.dailyScores[topicId], [day]: value },
//       },
//     }));
//   };

//   const handleQuantityEvaluationChange = (
//     index: number,
//     field: keyof QuantityEvaluation,
//     value: string | number
//   ) => {
//     setQuantityEvaluations((prev) => {
//       const copy = [...prev];
//       copy[index] = { ...copy[index], [field]: value };
//       return copy;
//     });
//   };

//   const addEvaluationDay = () => {
//     setQuantityEvaluations((prev) => [
//       ...prev,
//       {
//         day: prev.length + 1,
//         date: new Date().toISOString().split('T')[0],
//         plan: 0,
//         production_actual: 0,
//         production_marks: 0,
//         rejection_marks: 0,
//         number_of_rejections: 0,
//       },
//     ]);
//   };

//   const removeEvaluationDay = (index: number) => {
//     setQuantityEvaluations((prev) => {
//       const filtered = prev.filter((_, i) => i !== index);
//       return filtered.map((e, i) => ({ ...e, day: i + 1 }));
//     });
//   };

//   /* --------------------------- PAYLOAD --------------------------- */
//   const preparePayload = () => {
//     if (assessmentMode === 'quality') {
//       const scoresArray = Object.entries(formData.dailyScores)
//         .flatMap(([topicId, dayScores]) =>
//           Object.entries(dayScores).map(([dayName, score]) => {
//             const dayId = dayIdMapping[dayName];
//             return dayId ? { topic: Number(topicId), day: dayId, score: Number(score) } : null;
//           })
//         )
//         .filter(Boolean);

//       return {
//         trainee_name: formData.traineeInfo.name,
//         trainer_id: formData.traineeInfo.id,
//         emp_id: formData.traineeInfo.empNo,
//         line: formData.traineeInfo.lineName,
//         subline: formData.traineeInfo.processName,
//         station: formData.traineeInfo.stationId,
//         station_id: formData.traineeInfo.stationId,
//         process_name: formData.traineeInfo.processName,
//         revision_date: formData.traineeInfo.revisionDate,
//         doj: formData.traineeInfo.doi,
//         trainer_name: formData.traineeInfo.trainerName,
//         level: currentLevelId,
//         status: 'Active',
//         scores: scoresArray,
//       };
//     }

//     // ---- Quantity payload ----
//     return {
//       department_id: currentDeptId,
//       level: currentLevelId,
//       trainee_name: formData.traineeInfo.name,
//       trainee_id: formData.traineeInfo.id,
//       emp_id: formData.traineeInfo.empNo,
     
//       station_id: formData.traineeInfo.stationId,
//       station_name: formData.traineeInfo.stationName,
//       line_name: formData.traineeInfo.lineName,
//       process_name: formData.traineeInfo.processName,
//       revision_date: formData.traineeInfo.revisionDate,
//       doj: formData.traineeInfo.doi,
//       trainer_name: formData.traineeInfo.trainerName,
//       engineer_judge: formData.signatures.engineerJudge,
//       status,
//       evaluations: quantityEvaluations.map((e) => ({
//         day: e.day,
//         date: e.date,
//         plan: e.plan,
//         production_actual: e.production_actual,
//         number_of_rejections: e.number_of_rejections,
//       })),
//     };
//   };

//   /* --------------------------- SUBMIT --------------------------- */
//   const handleSubmit = async () => {
//     if (!formData.traineeInfo.stationId) {
//       toast.error('Please select a station');
//       return;
//     }
//     try {
//       const payload = preparePayload();
//       let result;

//       if (assessmentMode === 'quality') {
//         result = existingOjtId
//           ? await ojtApi.updateOJTData(existingOjtId, payload)
//           : await ojtApi.postOJTData(payload);
//         setExistingOjtId(result?.id ?? existingOjtId);
//       } else {
//         result = existingQuantityId
//           ? await ojtApi.updateOJTQuantityData(existingQuantityId, payload)
//           : await ojtApi.postOJTQuantityData(payload);
//         setExistingQuantityId(result?.id ?? existingQuantityId);
//       }

//       toast.success('Saved successfully!');
//       alert('OJT Data saved successfully!');
//     } catch (e: any) {
//       console.error(e);
//       toast.error(e.response?.data?.detail ?? 'Save failed');
//     }
//   };

//   /* --------------------------- RENDER --------------------------- */
//   if (isLoading) {
//     return (
//       <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
//           <p className="mt-4 text-gray-600">Loading form data…</p>
//         </div>
//       </div>
//     );
//   }

//   const currentTopics = assessmentMode === 'quality' ? qualityTopics : quantityTopics;

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-8">
//       <div className="max-w-7xl mx-auto bg-white/80 backdrop-blur-sm shadow-2xl rounded-3xl border border-white/20 overflow-hidden">

//         <OJTHeader />

//         {/* ----------------- MODE SWITCH ----------------- */}
        

//         <div className="p-8">
//           {/* ----------------- TRAINEE INFO ----------------- */}
//           <TraineeInfoForm
//             formData={formData}
//             handleInputChange={handleInputChange}
//             stations={filteredStations}
//             selectedStationId={selectedStationId}
//           />

//           {/* ----------------- ASSESSMENT FORM ----------------- */}
//           {assessmentMode === 'quality' ? (
//             <QualityAssessmentForm
//               currentTopics={currentTopics}
//               days={days}
//               formData={formData}
//               handleScoreChange={handleScoreChange}
//               scoreRanges={scoreRanges}
//               lastFilledDayIndex={lastFilledDayIndex}
//             />
//           ) : (
//             <QuantityAssessmentForm
//               formData={formData}
//               scoreRange={quantityScoreRange}
//               handleInputChange={handleInputChange}
//               quantityEvaluations={quantityEvaluations}
//               handleQuantityEvaluationChange={handleQuantityEvaluationChange}
//               addEvaluationDay={addEvaluationDay}
//               removeEvaluationDay={removeEvaluationDay}
//             />
//           )}

//           {/* ----------------- CRITERIA ----------------- */}
//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
//             {assessmentMode === 'quality' && (
//               <QualityAssessmentCriteria criteria={criteria} scoreRanges={scoreRanges} />
//             )}
//             {assessmentMode === 'quantity' && (
//               <div className="lg:col-span-2 space-y-8">
//                 <ProductionMarkingScheme criteria={quantityCriteria} scoreRange={quantityScoreRange} />
//               </div>
//             )}
//             <JudgmentCriteria />
//           </div>

//           {/* ----------------- SIGNATURES ----------------- */}
//           <SignaturesSection
//             formData={formData}
//             handleInputChange={handleInputChange}
//             handleSave={handleSubmit}
//             handleDownloadPDF={() => console.log('Download PDF')}
//           />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default OJTForm;





/*=====================================================================
  OJTForm.tsx  –  Quality + Quantity in ONE file with live switch
=====================================================================*/
import React, { useState, useEffect, useCallback } from 'react';
import type {
  AssessmentMode,
  TrainingTopic,
  FormData,
  QuantityEvaluation,
} from '../../constants/types';
import OJTHeader from '../../molecules/OJTHeader/OJTHeader';
import TraineeInfoForm from '../../molecules/TraineeInfoForm/TraineeInfoForm';
import QualityAssessmentForm from '../../molecules/QualityAssessmentForm/QualityAssessmentForm';
import QuantityAssessmentForm from '../../molecules/QuantityAssessmentForm/QuantityAssessmentForm';
import QualityAssessmentCriteria from '../../molecules/QualityAssessmentCriteria/QualityAssessmentCriteria';
import ProductionMarkingScheme from '../../molecules/ProductionMarkingScheme/ProductionMarkingScheme';
import JudgmentCriteria from '../../molecules/JudgmentCriteria/JudgmentCriteria';
import SignaturesSection from '../../molecules/SignaturesSection/SignaturesSection';
import { useLocation } from 'react-router-dom';
import { ojtApi } from '../../hooks/ServiceApis';
import toast from 'react-hot-toast';

interface Station {
  station_id: number;
  station_name: string;
  department_id: number;
}

/* ------------------------------------------------------------------ */
const OJTForm: React.FC = () => {
  const location = useLocation();
  const locationState = location.state || {};

  /* ----------------------- NAVIGATION STATE ------------------------ */
  const currentEmpId = locationState.employeeId;
  const currentLevelId = locationState.levelId;
  const currentDeptId = locationState.departmentId;
  const initialStationId = locationState.stationId ?? null;

  /* --------------------------- LOCAL STATE -------------------------- */
  const [assessmentMode, setAssessmentMode] = useState<AssessmentMode>('quality');
  const [assessmentModeLoaded, setAssessmentModeLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [stations, setStations] = useState<Station[]>([]);
  const [filteredStations, setFilteredStations] = useState<Station[]>([]);
  const [selectedStationId, setSelectedStationId] = useState<number | null>(initialStationId);

  const [qualityTopics, setQualityTopics] = useState<TrainingTopic[]>([]);
  const [quantityTopics] = useState<TrainingTopic[]>([
    { id: 1, description: 'Production Quantity', category: 'Production' },
    { id: 2, description: 'Quality (Number of Rejections)', category: 'Quality' },
  ]);

  const [days, setDays] = useState<string[]>([]);
  const [dayIdMapping, setDayIdMapping] = useState<Record<string, number>>({});

  const [scoreRanges, setScoreRanges] = useState<{ min_score: number; max_score: number } | null>(null);
  const [criteria, setCriteria] = useState<number[]>([]);
  const [quantityCriteria, setQuantityCriteria] = useState<any>(null);
  const [quantityScoreRange, setQuantityScoreRange] = useState<any[] | null>(null);

  const [existingOjtId, setExistingOjtId] = useState<number | null>(null);
  const [existingQuantityId, setExistingQuantityId] = useState<number | null>(null);
  const [lastFilledDayIndex, setLastFilledDayIndex] = useState<number>(-1);
  const [quantityEvaluations, setQuantityEvaluations] = useState<QuantityEvaluation[]>([]);
  const [status, setStatus] = useState<string>('Pending');

  const [formData, setFormData] = useState<FormData>({
    traineeInfo: {
      name: locationState.employeeName || '',
      id: locationState.employeeId || '',
      empNo: locationState.employeeId || '',
      stationName: locationState.stationName || '',
      stationId: initialStationId,
      lineName: locationState.lineName || '',
      processName: locationState.sublineName || '',
      revisionDate: new Date().toISOString().split('T')[0],
      doi: new Date().toISOString().split('T')[0],
      trainerName: '',
      trainerLine: locationState.lineName || '',
    },
    dailyScores: {},
    signatures: { preparedBy: '', approvedBy: '', engineerJudge: '' },
  });

  /* --------------------------- API HELPERS -------------------------- */
  const fetchAssessmentMode = async () => {
    try {
      const { mode } = await ojtApi.getAssessmentMode();
      setAssessmentMode(mode);
      setAssessmentModeLoaded(true);
    } catch (e) {
      console.error(e);
      setAssessmentModeLoaded(true);
    }
  };

  const fetchStations = async () => {
    try {
      const data = await ojtApi.getStations();
      setStations(data);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchLevelData = async () => {
    if (!currentDeptId || !currentLevelId) return;
    try {
      const [
        topicsRes,
        daysRes,
        scoreRes,
        critRes,
        qtyScoreRes,
        qtyCritRes,
      ] = await Promise.all([
        ojtApi.getTopics(currentDeptId, currentLevelId),
        ojtApi.getDays(currentDeptId, currentLevelId),
        ojtApi.getScoreRanges(currentDeptId, currentLevelId),
        ojtApi.getPassingCriteria(currentDeptId, currentLevelId),
        ojtApi.getQuantityScoreRanges(currentDeptId, currentLevelId),
        ojtApi.getQuantityPassingCriteria(currentDeptId, currentLevelId),
      ]);

      /* ---- Quality Topics ---- */
      setQualityTopics(
        topicsRes.map((t: any) => ({
          id: t.id ?? t.topic_id,
          description: t.topic ?? t.topic_name,
          category: t.category ?? 'Technical Knowledge',
        }))
      );

      /* ---- Days ---- */
      const mapping: Record<string, number> = {};
      const dayNames = daysRes.map((d: any) => {
        const name = d.name ?? `Day-${d.id}`;
        mapping[name] = d.id;
        return name;
      });
      setDays(dayNames);
      setDayIdMapping(mapping);

      /* ---- Score Ranges & Criteria ---- */
      if (scoreRes?.length) {
        setScoreRanges({ min_score: scoreRes[0].min_score, max_score: scoreRes[0].max_score });
      }
      if (critRes?.length) {
        const sorted = critRes.sort((a: any, b: any) => a.day - b.day);
        setCriteria(sorted.map((c: any) => c.percentage));
      }

      /* ---- Quantity ---- */
      setQuantityScoreRange(qtyScoreRes?.length ? qtyScoreRes : null);
      if (qtyCritRes?.length) {
        setQuantityCriteria({
          production_passing_percentage: parseFloat(qtyCritRes[0].production_passing_percentage),
          rejection_passing_percentage: parseFloat(qtyCritRes[0].rejection_passing_percentage),
        });
      }
    } catch (e) {
      console.error(e);
    }
  };

  /* ----------------------- INITIAL LOAD --------------------------- */
  useEffect(() => {
    const init = async () => {
      if (!currentEmpId || !currentLevelId || !currentDeptId) {
        setIsLoading(false);
        return;
      }
      setIsLoading(true);
      await Promise.all([fetchStations(), fetchLevelData(), fetchAssessmentMode()]);
      setIsLoading(false);
    };
    init();
  }, [currentEmpId, currentLevelId, currentDeptId]);

  /* ----------------------- FILTER STATIONS ----------------------- */
  useEffect(() => {
    if (currentDeptId && stations.length) {
      const filtered = stations.filter((s) => s.department_id === currentDeptId);
      setFilteredStations(filtered);

      if (initialStationId && !filtered.find((s) => s.station_id === initialStationId)) {
        setSelectedStationId(null);
        setFormData((p) => ({
          ...p,
          traineeInfo: { ...p.traineeInfo, stationId: null, stationName: '' },
        }));
      }
    }
  }, [currentDeptId, stations, initialStationId]);

  /* --------------------- MODE SWITCH HANDLER --------------------- */
  const handleModeSwitch = useCallback(
    (newMode: AssessmentMode) => {
      if (newMode === assessmentMode) return;
      const confirmMsg = `Switch to ${newMode.toUpperCase()} mode?\nAll data of the current mode will be cleared.`;
      if (!window.confirm(confirmMsg)) return;

      // ---- clear opposite mode data ----
      if (newMode === 'quantity') {
        setFormData((p) => ({ ...p, dailyScores: {} }));
        setLastFilledDayIndex(-1);
        setExistingOjtId(null);
      } else {
        setQuantityEvaluations([]);
        setExistingQuantityId(null);
        setStatus('Pending');
      }
      setAssessmentMode(newMode);
    },
    [assessmentMode]
  );

  /* ------------------- FETCH QUALITY DATA ------------------- */
  useEffect(() => {
    const fetchQuality = async () => {
      if (
        !assessmentModeLoaded ||
        assessmentMode !== 'quality' ||
        !currentEmpId ||
        !currentLevelId ||
        selectedStationId === null
      ) {
        setExistingOjtId(null);
        setFormData((p) => ({ ...p, dailyScores: {} }));
        setLastFilledDayIndex(-1);
        return;
      }

      try {
        const records = await ojtApi.getQualityTraineeInfoList(
          currentEmpId,
          selectedStationId,
          currentLevelId,
          currentDeptId
        );

        const record = records[0] ?? null;
        if (!record) {
          setExistingOjtId(null);
          setFormData((p) => ({ ...p, dailyScores: {} }));
          setLastFilledDayIndex(-1);
          return;
        }

        setExistingOjtId(record.id);
        const prefilled: Record<number, Record<string, string>> = {};

        record.scores_data?.forEach((s: any) => {
          const dayName =
            Object.keys(dayIdMapping).find((k) => dayIdMapping[k] === s.day) ?? `Day-${s.day}`;
          if (!prefilled[s.topic]) prefilled[s.topic] = {};
          prefilled[s.topic][dayName] = String(s.score);
        });

        const lastIdx = Math.max(
          -1,
          ...Object.values(prefilled).flatMap((obj) =>
            days.map((d, i) => (obj[d] ? i : -1))
          )
        );
        setLastFilledDayIndex(lastIdx);

        setFormData((p) => ({
          ...p,
          traineeInfo: {
            ...p.traineeInfo,
            name: record.trainee_name ?? p.traineeInfo.name,
            id: record.trainer_id ?? p.traineeInfo.id,
            empNo: record.emp_id ?? p.traineeInfo.empNo,
            stationName: record.station_name ?? p.traineeInfo.stationName,
            stationId: record.station ?? p.traineeInfo.stationId,
            lineName: record.line ?? p.traineeInfo.lineName,
            processName: record.subline ?? p.traineeInfo.processName,
            revisionDate: record.revision_date ?? p.traineeInfo.revisionDate,
            doi: record.doj ?? p.traineeInfo.doi,
            trainerName: record.trainer_name ?? '',
          },
          dailyScores: prefilled,
        }));
      } catch (e) {
        console.error(e);
        toast.error('Failed to load Quality data');
        setExistingOjtId(null);
        setFormData((p) => ({ ...p, dailyScores: {} }));
        setLastFilledDayIndex(-1);
      }
    };

    if (assessmentMode === 'quality') fetchQuality();
  }, [
    assessmentMode,
    assessmentModeLoaded,
    currentEmpId,
    currentLevelId,
    currentDeptId,
    selectedStationId,
    dayIdMapping,
    days,
  ]);

  /* ------------------- FETCH QUANTITY DATA ------------------- */
  useEffect(() => {
    const fetchQuantity = async () => {
      if (
        !assessmentModeLoaded ||
        assessmentMode !== 'quantity' ||
        !currentEmpId ||
        !currentLevelId ||
        selectedStationId === null
      ) {
        setExistingQuantityId(null);
        setQuantityEvaluations([]);
        setStatus('Pending');
        return;
      }

      try {
        const records = await ojtApi.getQuantityTraineeInfoList(
          currentEmpId,
          currentLevelId,
          selectedStationId,
          currentDeptId
        );

        const record = records[0] ?? null;
        if (!record) {
          setExistingQuantityId(null);
          setQuantityEvaluations([
            {
              day: 1,
              date: new Date().toISOString().split('T')[0],
              plan: 0,
              production_actual: 0,
              production_marks: 0,
              rejection_marks: 0,
              number_of_rejections: 0,
            },
          ]);
          setStatus('Pending');
          return;
        }

        setExistingQuantityId(record.id);
        setQuantityEvaluations(record.evaluations_data ?? []);
        setStatus(record.status ?? 'Pending');

        setFormData((p) => ({
          ...p,
          traineeInfo: {
            ...p.traineeInfo,
            name: record.trainee_name ?? p.traineeInfo.name,
            id: record.trainee_id ?? p.traineeInfo.id,
            empNo: record.emp_id ?? p.traineeInfo.empNo,
            stationName: record.station_name ?? p.traineeInfo.stationName,
            stationId: record.station ?? p.traineeInfo.stationId,
            lineName: record.line_name ?? p.traineeInfo.lineName,
            processName: record.process_name ?? p.traineeInfo.processName,
            revisionDate: record.revision_date ?? p.traineeInfo.revisionDate,
            doi: record.doj ?? p.traineeInfo.doi,
            trainerName: record.trainer_name ?? '',
          },
          signatures: {
            ...p.signatures,
            engineerJudge: record.engineer_judge ?? '',
          },
        }));
      } catch (e) {
        console.error(e);
        toast.error('Failed to load Quantity data');
        setExistingQuantityId(null);
        setQuantityEvaluations([
          {
            day: 1,
            date: new Date().toISOString().split('T')[0],
            plan: 0,
            production_actual: 0,
            production_marks: 0,
            rejection_marks: 0,
            number_of_rejections: 0,
          },
        ]);
      }
    };

    if (assessmentMode === 'quantity') fetchQuantity();
  }, [
    assessmentMode,
    assessmentModeLoaded,
    currentEmpId,
    currentLevelId,
    currentDeptId,
    selectedStationId,
  ]);

  /* --------------------------- INPUT HANDLERS --------------------------- */
  const handleInputChange = (section: string, field: string, value: any) => {
    if (section === 'traineeInfo' && field === 'stationId') {
      const station = filteredStations.find((s) => s.station_id === value);
      setSelectedStationId(value);
      setFormData((p) => ({
        ...p,
        traineeInfo: {
          ...p.traineeInfo,
          stationId: value,
          stationName: station?.station_name ?? '',
        },
      }));
    } else {
      setFormData((p) => ({
        ...p,
        [section]: { ...p[section as keyof FormData], [field]: value },
      }));
    }
  };

  const handleScoreChange = (topicId: number | string, day: string, value: string) => {
    setFormData((p) => ({
      ...p,
      dailyScores: {
        ...p.dailyScores,
        [topicId]: { ...p.dailyScores[topicId], [day]: value },
      },
    }));
  };

  const handleQuantityEvaluationChange = (
    index: number,
    field: keyof QuantityEvaluation,
    value: string | number
  ) => {
    setQuantityEvaluations((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  const addEvaluationDay = () => {
    setQuantityEvaluations((prev) => [
      ...prev,
      {
        day: prev.length + 1,
        date: new Date().toISOString().split('T')[0],
        plan: 0,
        production_actual: 0,
        production_marks: 0,
        rejection_marks: 0,
        number_of_rejections: 0,
      },
    ]);
  };

  const removeEvaluationDay = (index: number) => {
    setQuantityEvaluations((prev) => {
      const filtered = prev.filter((_, i) => i !== index);
      return filtered.map((e, i) => ({ ...e, day: i + 1 }));
    });
  };

  /* --------------------------- PAYLOAD --------------------------- */
  const preparePayload = () => {
    if (assessmentMode === 'quality') {
      const scoresArray = Object.entries(formData.dailyScores)
        .flatMap(([topicId, dayScores]) =>
          Object.entries(dayScores).map(([dayName, score]) => {
            const dayId = dayIdMapping[dayName];
            return dayId ? { topic: Number(topicId), day: dayId, score: Number(score) } : null;
          })
        )
        .filter(Boolean);

      return {
        trainee_name: formData.traineeInfo.name,
        trainer_id: formData.traineeInfo.id,
        emp_id: formData.traineeInfo.empNo,
        line: formData.traineeInfo.lineName,
        subline: formData.traineeInfo.processName,
        station: formData.traineeInfo.stationId,
        station_id: formData.traineeInfo.stationId,
        process_name: formData.traineeInfo.processName,
        revision_date: formData.traineeInfo.revisionDate,
        doj: formData.traineeInfo.doi,
        trainer_name: formData.traineeInfo.trainerName,
        level: currentLevelId,
        status: 'Active',
        scores: scoresArray,
      };
    }

    // ---- Quantity payload ----
    return {
      department_id: currentDeptId,
      level: currentLevelId,
      trainee_name: formData.traineeInfo.name,
      trainee_id: formData.traineeInfo.id,
      emp_id: formData.traineeInfo.empNo,
     
      station_id: formData.traineeInfo.stationId,
      station_name: formData.traineeInfo.stationName,
      line_name: formData.traineeInfo.lineName,
      process_name: formData.traineeInfo.processName,
      revision_date: formData.traineeInfo.revisionDate,
      doj: formData.traineeInfo.doi,
      trainer_name: formData.traineeInfo.trainerName,
      engineer_judge: formData.signatures.engineerJudge,
      status,
      evaluations: quantityEvaluations.map((e) => ({
        day: e.day,
        date: e.date,
        plan: e.plan,
        production_actual: e.production_actual,
        number_of_rejections: e.number_of_rejections,
      })),
    };
  };

  /* --------------------------- SUBMIT --------------------------- */
  const handleSubmit = async () => {
    if (!formData.traineeInfo.stationId) {
      toast.error('Please select a station');
      return;
    }
    try {
      const payload = preparePayload();
      let result;

      if (assessmentMode === 'quality') {
        result = existingOjtId
          ? await ojtApi.updateOJTData(existingOjtId, payload)
          : await ojtApi.postOJTData(payload);
        setExistingOjtId(result?.id ?? existingOjtId);
      } else {
        result = existingQuantityId
          ? await ojtApi.updateOJTQuantityData(existingQuantityId, payload)
          : await ojtApi.postOJTQuantityData(payload);
        setExistingQuantityId(result?.id ?? existingQuantityId);
      }

      toast.success('Saved successfully!');
      alert('OJT Data saved successfully!');
    } catch (e: any) {
      console.error(e);
      toast.error(e.response?.data?.detail ?? 'Save failed');
    }
  };

  /* --------------------------- RENDER --------------------------- */
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background transition-colors duration-300">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted">Loading form data…</p>
        </div>
      </div>
    );
  }

  const currentTopics = assessmentMode === 'quality' ? qualityTopics : quantityTopics;

  return (
    // Main Wrapper: bg-background, text-text
    <div className="min-h-screen bg-background text-text p-4 md:p-8 transition-colors duration-300">
      
      {/* Card Container: bg-surface, border-border */}
      <div className="max-w-7xl mx-auto bg-surface shadow-soft rounded-3xl border border-border overflow-hidden">

        <OJTHeader />

        {/* ----------------- MODE SWITCH ----------------- */}
        <div className="flex justify-center py-6 bg-surface border-b border-border">
          <div className="flex bg-background p-1 rounded-xl border border-border">
            <button
              onClick={() => handleModeSwitch('quality')}
              className={`px-6 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                assessmentMode === 'quality'
                  ? 'bg-primary text-white shadow-sm'
                  : 'text-muted hover:text-text'
              }`}
            >
              Quality
            </button>
            <button
              onClick={() => handleModeSwitch('quantity')}
              className={`px-6 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                assessmentMode === 'quantity'
                  ? 'bg-primary text-white shadow-sm'
                  : 'text-muted hover:text-text'
              }`}
            >
              Quantity
            </button>
          </div>
        </div>

        <div className="p-6 md:p-8">
          {/* ----------------- TRAINEE INFO ----------------- */}
          <TraineeInfoForm
            formData={formData}
            handleInputChange={handleInputChange}
            stations={filteredStations}
            selectedStationId={selectedStationId}
          />

          {/* ----------------- ASSESSMENT FORM ----------------- */}
          {assessmentMode === 'quality' ? (
            <QualityAssessmentForm
              currentTopics={currentTopics}
              days={days}
              formData={formData}
              handleScoreChange={handleScoreChange}
              scoreRanges={scoreRanges}
              lastFilledDayIndex={lastFilledDayIndex}
            />
          ) : (
            <QuantityAssessmentForm
              formData={formData}
              scoreRange={quantityScoreRange}
              handleInputChange={handleInputChange}
              quantityEvaluations={quantityEvaluations}
              handleQuantityEvaluationChange={handleQuantityEvaluationChange}
              addEvaluationDay={addEvaluationDay}
              removeEvaluationDay={removeEvaluationDay}
            />
          )}

          {/* ----------------- CRITERIA ----------------- */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
            {assessmentMode === 'quality' && (
              <QualityAssessmentCriteria criteria={criteria} scoreRanges={scoreRanges} />
            )}
            {assessmentMode === 'quantity' && (
              <div className="lg:col-span-2 space-y-8">
                <ProductionMarkingScheme criteria={quantityCriteria} scoreRange={quantityScoreRange} />
              </div>
            )}
            <JudgmentCriteria />
          </div>

          {/* ----------------- SIGNATURES ----------------- */}
          <SignaturesSection
            formData={formData}
            handleInputChange={handleInputChange}
            handleSave={handleSubmit}
            handleDownloadPDF={() => console.log('Download PDF')}
          />
        </div>
      </div>
    </div>
  );
};

export default OJTForm;