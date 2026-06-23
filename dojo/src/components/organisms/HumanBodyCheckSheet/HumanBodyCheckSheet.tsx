

// import { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { Check, X, Save, User as UserIcon, Edit, XCircle, MessageSquare, History, Clock } from 'lucide-react';
// import { Button } from '../../atoms/Buttons/Button';

// import type { AddItemFormProps, CheckSheetContainerProps, CheckSheetHeaderProps, HumanBodyCheckSheetProps, InfoItemProps, UserInfoCardProps, SheetAnswer, User } from '../../constants/types';
// import { humanBodyCheckService } from '../../hooks/ServiceApis';
// import OrientationFeedbackModal from '../OrientationFeedbackModal/OrientationFeedbackModal';

// // --- INTERFACES ---
// interface Question {
//   id: number;
//   question_text: string;
// }

// interface CheckItem {
//   question_id?: number;
//   description: string;
//   status: 'eligible' | 'not_eligible' | '';
// }

// interface DynamicCheckData {
//   [key: string]: CheckItem;
// }

// // Interface for a single remark entry
// interface RemarkEntry {
//   remark: string;
//   created_at?: string; // Optional timestamp
//   created_by?: string; // Optional user name
// }

// // --- PROP TYPES ---
// interface StatusToggleButtonProps {
//   status: 'eligible' | 'not_eligible' | '';
//   onClick: () => void;
//   disabled?: boolean;
// }

// interface CheckItemRowProps {
//   id: string;
//   item: CheckItem;
//   onStatusChange: (id: string, status: 'eligible' | 'not_eligible' | '') => void;
//   isReadOnly: boolean;
// }

// interface CheckTableHeaderProps {
//   onToggleAll: () => void;
//   isReadOnly: boolean;
// }

// interface CheckTableProps {
//   checkData: DynamicCheckData;
//   onStatusChange: (id: string, status: 'eligible' | 'not_eligible' | '') => void;
//   showAddForm: boolean;
//   newItem: string;
//   onNewItemChange: (value: string) => void;
//   onAddItem: () => void;
//   onCancelAdd: () => void;
//   onToggleAll: () => void;
//   isReadOnly: boolean;
// }

// interface ActionBarProps {
//   onAddNew: () => void;
//   onSave: () => void;
//   onEdit: () => void;
//   onCancelEdit: () => void;
//   showAddForm: boolean;
//   isExisting: boolean;
//   isEditMode: boolean;
//   isReadOnly: boolean;
//   loading: boolean;
// }

// // --- COMPONENTS ---

// const CheckSheetHeader: React.FC<CheckSheetHeaderProps> = ({ title }) => (
//   <header className="bg-gradient-to-r from-blue-600 via-purple-600 to-purple-700 p-6 shadow-lg">
//     <h1 className="text-2xl md:text-3xl font-bold text-center text-white tracking-wide drop-shadow-md">
//       {title}
//     </h1>
//   </header>
// );

// const UserInfoCard: React.FC<UserInfoCardProps> = ({ userDetails, tempId }) => {
//   const { firstName,lastName,  email, phoneNumber } = userDetails;
//   console.log('emp,oyee data :',userDetails);
//   return (
//     <section className="bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-6 border-t-4 border-purple-500 shadow-inner">
//       <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-4 flex items-center">
//         <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-2 rounded-lg mr-3 shadow-md">
//           <UserIcon className="w-5 h-5 text-white" />
//         </div>
//         User Information
//       </h3>
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         <div className="space-y-3 bg-white/60 backdrop-blur-sm p-4 rounded-lg shadow-sm border border-purple-100">
//           <InfoItem 
//             label="Name" 
//             // value={`${firstName}`} 
//               value={`${firstName} ${lastName}`.trim()}
//           />
//           <InfoItem 
//             label="Temp ID" 
//             value={tempId} 
//             valueClassName="font-mono bg-gradient-to-r from-blue-100 to-purple-100 px-3 py-1.5 rounded-md font-semibold text-purple-700 shadow-sm" 
//           />
//         </div>
//         <div className="space-y-3 bg-white/60 backdrop-blur-sm p-4 rounded-lg shadow-sm border border-purple-100">
//           <InfoItem label="Email" value={email} valueClassName="break-all" />
//           <InfoItem label="Phone" value={phoneNumber} />
//         </div>
//       </div>
//     </section>
//   );
// };

// const InfoItem: React.FC<InfoItemProps> = ({ label, value, valueClassName = '' }) => (
//   <div className="flex items-start">
//     <span className="text-gray-600 font-semibold w-24 text-sm">{label}:</span>
//     <span className={`text-gray-800 font-medium text-sm ${valueClassName}`}>{value}</span>
//   </div>
// );

// // --- Remarks History ---
// const RemarksHistory: React.FC<{ history: RemarkEntry[] }> = ({ history }) => {
//   if (!history || history.length === 0) return null;

//   return (
//     <section className="mt-6 bg-gray-50 rounded-xl border border-gray-200 overflow-hidden shadow-sm">
//       <div className="bg-gray-100 px-6 py-3 border-b border-gray-200 flex items-center gap-2">
//         <History className="w-5 h-5 text-gray-600" />
//         <h3 className="font-bold text-gray-700">Remarks History</h3>
//       </div>
//       <div className="p-6 space-y-4">
//         {history.map((entry, index) => (
//           <div key={index} className="flex flex-col sm:flex-row sm:items-start gap-3 p-3 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
//              <div className="min-w-[140px] flex items-center gap-1 text-xs text-gray-500 font-mono mt-1">
//                 <Clock className="w-3 h-3" />
//                 {entry.created_at ? new Date(entry.created_at).toLocaleDateString() : 'Previous Edit'}
//              </div>
//              <div className="flex-1">
//                 <p className="text-gray-800 text-sm leading-relaxed">{entry.remark}</p>
//              </div>
//           </div>
//         ))}
//       </div>
//     </section>
//   );
// };

// const CheckTableHeader: React.FC<CheckTableHeaderProps> = ({ onToggleAll, isReadOnly }) => (
//   <header className="grid grid-cols-12 bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100 border-b-2 border-purple-300 shadow-sm">
//     <div className="col-span-1 p-4 border-r-2 border-purple-300 font-bold text-center text-purple-700">
//       Sr No
//     </div>
//     <div className="col-span-9 p-4 border-r-2 border-purple-300 font-bold text-center text-purple-700">
//       Description
//     </div>
//     <div className="col-span-2 p-4 font-bold text-center flex items-center justify-center gap-3">
//       <span className="text-purple-700">Status</span>
//       <div>
//         <button
//           onClick={onToggleAll}
//           disabled={isReadOnly}
//           title={isReadOnly ? "ReadOnly" : "Cycle: Eligible -> Not Eligible -> Empty"}
//           className="px-4 py-1.5 text-xs font-bold text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed shadow-md hover:shadow-lg transform hover:scale-105 select-none"
//         >
//           ALL
//         </button>
//       </div>
//     </div>
//   </header>
// );

// const CheckItemRow: React.FC<CheckItemRowProps> = ({ id, item, onStatusChange, isReadOnly }) => {
//   const getStatusColor = (status: 'eligible' | 'not_eligible' | '') => {
//     if (status === 'eligible') return 'bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-l-green-500';
//     if (status === 'not_eligible') return 'bg-gradient-to-r from-red-50 to-pink-50 border-l-4 border-l-red-500';
//     return 'bg-white hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 border-l-4 border-l-transparent';
//   };

//   const handleToggleStatus = () => {
//     if (isReadOnly) return;
//     let nextStatus: 'eligible' | 'not_eligible' | '' = '';
//     // CYCLE: Empty -> Eligible -> Not Eligible -> Empty
//     if (item.status === '') nextStatus = 'eligible';
//     else if (item.status === 'eligible') nextStatus = 'not_eligible';
//     else nextStatus = '';
    
//     onStatusChange(id, nextStatus);
//   };

//   return (
//     <article className={`grid grid-cols-12 border-b border-purple-200 transition-all duration-200 ${getStatusColor(item.status)}`}>
//       <div className="col-span-1 p-4 border-r-2 border-purple-200 text-center font-bold text-purple-600">
//         {id}
//       </div>
//       <div className="col-span-9 p-4 border-r-2 border-purple-200">
//         <span className="text-sm text-gray-700 leading-relaxed">{item.description}</span>
//       </div>
//       <div className="col-span-2 p-4 flex justify-center items-center">
//         <StatusToggleButton status={item.status} onClick={handleToggleStatus} disabled={isReadOnly} />
//       </div>
//     </article>
//   );
// };

// const StatusToggleButton: React.FC<StatusToggleButtonProps> = ({ status, onClick, disabled = false }) => {
//   const getButtonClasses = () => {
//     const baseClasses = 'p-3 rounded-lg border-2 transition-all duration-200 w-16 h-12 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg transform hover:scale-105';
//     if (status === 'eligible') return `${baseClasses} bg-gradient-to-br from-green-500 to-emerald-600 border-green-400 text-white`;
//     if (status === 'not_eligible') return `${baseClasses} bg-gradient-to-br from-red-500 to-pink-600 border-red-400 text-white`;
//     return `${baseClasses} bg-white border-purple-300 hover:border-purple-500 hover:bg-purple-50`;
//   };

//   return (
//     <button onClick={onClick} className={getButtonClasses()} disabled={disabled}>
//       {status === 'eligible' && <Check className="w-6 h-6" />}
//       {status === 'not_eligible' && <X className="w-6 h-6" />}
//       {status === '' && <span className="text-gray-400 text-xl">-</span>}
//     </button>
//   );
// };

// const AddItemForm: React.FC<AddItemFormProps> = ({ newItem, onNewItemChange, onAdd, onCancel }) => (
//   <form className="grid grid-cols-12 border-b-2 border-purple-300 bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100 shadow-inner" onSubmit={(e) => { e.preventDefault(); onAdd(); }}>
//     <div className="col-span-1 p-4 border-r-2 border-purple-300 text-center text-purple-600 font-bold text-xl">+</div>
//     <div className="col-span-9 p-4 border-r-2 border-purple-300">
//       <input
//         type="text"
//         value={newItem}
//         onChange={(e) => onNewItemChange(e.target.value)}
//         placeholder="Enter new check item..."
//         className="w-full p-3 border-2 border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent shadow-sm transition-all duration-200"
//         onKeyPress={(e) => e.key === 'Enter' && onAdd()}
//         autoFocus
//         required
//       />
//     </div>
//     <div className="col-span-2 p-4 flex justify-center gap-2">
//       <Button 
//         onClick={onAdd} 
//         variant="primary" 
//         size="sm" 
//         className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200 px-4 py-2 rounded-lg font-semibold" 
//         type="button"
//       >
//         Add
//       </Button>
//       <Button 
//         onClick={onCancel} 
//         variant="secondary" 
//         size="sm" 
//         className="bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200 px-4 py-2 rounded-lg font-semibold" 
//         type="button"
//       >
//         Cancel
//       </Button>
//     </div>
//   </form>
// );

// const CheckTable: React.FC<CheckTableProps> = ({
//   checkData, onStatusChange, showAddForm, newItem, onNewItemChange, onAddItem, onCancelAdd, onToggleAll, isReadOnly,
// }) => (
//   <section className="check-table overflow-hidden">
//     <CheckTableHeader 
//       onToggleAll={onToggleAll} 
//       isReadOnly={isReadOnly} 
//     />
//     {Object.entries(checkData).map(([id, item]) => (
//       <CheckItemRow key={id} id={id} item={item} onStatusChange={onStatusChange} isReadOnly={isReadOnly} />
//     ))}
//     {showAddForm && <AddItemForm newItem={newItem} onNewItemChange={onNewItemChange} onAdd={onAddItem} onCancel={onCancelAdd} />}
//   </section>
// );

// const ActionBar: React.FC<ActionBarProps> = ({
//   onSave, onEdit, onCancelEdit, isExisting, isEditMode, isReadOnly, loading
// }) => (
//   <footer className="mt-2 p-6 bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 flex justify-end items-center gap-4 border-t-2 border-purple-200">
//     {isExisting && !isEditMode && (
//       <Button 
//         onClick={onEdit} 
//         className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 px-6 py-3 rounded-lg font-semibold"
//       >
//         <Edit className="w-5 h-5" /> Edit
//       </Button>
//     )}
//     {isEditMode && (
//       <Button 
//         onClick={onCancelEdit} 
//         className="flex items-center gap-2 bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 px-6 py-3 rounded-lg font-semibold"
//       >
//         <XCircle className="w-5 h-5" /> Cancel
//       </Button>
//     )}
//     <Button
//       onClick={onSave}
//       variant="primary"
//       className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 disabled:from-gray-400 disabled:to-gray-500 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 px-6 py-3 rounded-lg font-semibold"
//       disabled={isReadOnly}
//       loading={loading}
//     >
//       <Save className="w-5 h-5" /> {isExisting ? 'Update Data' : 'Save Data'}
//     </Button>
//   </footer>
// );

// const CheckSheetContainer: React.FC<CheckSheetContainerProps> = ({ children }) => (
//   <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 py-8 px-4">
//     <div className="max-w-6xl mx-auto">
//       <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border-t-4 border-purple-500">
//         {children}
//       </div>
//     </div>
//   </div>
// );

// // --- HOOKS ---

// const useCheckData = (tempId: string) => {
//   const [checkData, setCheckData] = useState<DynamicCheckData>({});
//   const [questions, setQuestions] = useState<Question[]>([]);
//   const [isExisting, setIsExisting] = useState<boolean>(false);
//   const [recordId, setRecordId] = useState<number | null>(null);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string>('');
//   const [originalData, setOriginalData] = useState<DynamicCheckData>({});
//   const [fullUserData, setFullUserData] = useState<any>(null);
  
//   const [remarksHistory, setRemarksHistory] = useState<RemarkEntry[]>([]);

//   useEffect(() => {
//     const fetchQuestionsAndData = async () => {
//       setLoading(true);
//       setError('');
//       try {
//         const qRes = await humanBodyCheckService.fetchQuestions();
//         let questionsList: Question[] = [];
//         if (Array.isArray(qRes)) questionsList = qRes;
//         else if (qRes && Array.isArray((qRes as any).data)) questionsList = (qRes as any).data;

//         setQuestions(questionsList);

//         const initialCheckData: DynamicCheckData = {};
//         questionsList.forEach((question, index) => {
//           const id = (index + 1).toString();
//           initialCheckData[id] = { question_id: question.id, description: question.question_text, status: '' };
//         });

//         if (tempId) {
//           const dRes = await humanBodyCheckService.fetchCheckDataByTempId(tempId);
//           const responseData = Array.isArray(dRes) ? dRes : (dRes as any)?.data;

//           if (Array.isArray(responseData) && responseData.length > 0) {
//             const existingCheck = responseData.find((item: any) => item.temp_id === tempId) || responseData[0];
            
//             if (existingCheck) setFullUserData(existingCheck);

//             if (existingCheck) {
//                 let parsedHistory: RemarkEntry[] = [];
//                 if (Array.isArray(existingCheck.remarks_history)) {
//                     parsedHistory = existingCheck.remarks_history;
//                 } 
//                 else if (existingCheck.remarks && typeof existingCheck.remarks === 'string') {
//                     parsedHistory = [{ 
//                         remark: existingCheck.remarks, 
//                         created_at: existingCheck.updated_at || existingCheck.created_at 
//                     }];
//                 }
//                 setRemarksHistory(parsedHistory);
//             }

//             if (existingCheck && Array.isArray(existingCheck.sheet_answers)) {
//               setIsExisting(true);
//               setRecordId(existingCheck.id);

//               existingCheck.sheet_answers.forEach((answer: SheetAnswer) => {
//                 const localKey = Object.keys(initialCheckData).find(key => initialCheckData[key].question_id == answer.question);
//                 if (localKey) {
//                   let mappedStatus: 'eligible' | 'not_eligible' | '' = '';
//                   const val = answer.answer ? answer.answer.toLowerCase() : '';
//                   if (val === 'pass' || val === 'eligible') mappedStatus = 'eligible';
//                   else if (val === 'fail' || val === 'not_eligible') mappedStatus = 'not_eligible';
//                   initialCheckData[localKey].status = mappedStatus;
//                 }
//               });
//             }
//           }
//         }
//         setCheckData(initialCheckData);
//         setOriginalData(JSON.parse(JSON.stringify(initialCheckData)));
//       } catch (err) {
//         console.error(err);
//         setError('Failed to load data.');
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchQuestionsAndData();
//   }, [tempId]);

//   const updateCheckStatus = (id: string, status: 'eligible' | 'not_eligible' | '') => {
//     setCheckData(prev => ({ ...prev, [id]: { ...prev[id], status } }));
//   };

//   const addNewCheck = (description: string) => {
//     const existingIds = Object.keys(checkData).map(id => parseInt(id));
//     const newId = (Object.keys(checkData).length > 0 ? Math.max(...existingIds) : 0) + 1;
//     setCheckData(prev => ({ ...prev, [newId.toString()]: { description, status: '' } }));
//   };

//   // UPDATED: Logic to Cycle All items: Empty -> Eligible -> Not Eligible -> Empty
//   const toggleAllCycle = () => {
//     setCheckData(prev => {
//       const allValues = Object.values(prev);
//       const isAllEligible = allValues.length > 0 && allValues.every(item => item.status === 'eligible');
//       const isAllNotEligible = allValues.length > 0 && allValues.every(item => item.status === 'not_eligible');

//       let targetStatus: 'eligible' | 'not_eligible' | '' = 'eligible'; // Default (if mixed or empty)

//       if (isAllEligible) {
//         targetStatus = 'not_eligible'; // 2nd click behavior
//       } else if (isAllNotEligible) {
//         targetStatus = ''; // 3rd click behavior
//       }

//       return Object.entries(prev).reduce((acc, [id, item]) => {
//         acc[id] = { ...item, status: targetStatus };
//         return acc;
//       }, {} as DynamicCheckData);
//     });
//   };

//   const revertChanges = () => {
//     setCheckData(originalData);
//   };

//   return {
//     checkData, questions, isExisting, recordId, loading, error, fullUserData, remarksHistory,
//     updateCheckStatus, addNewCheck, toggleAllCycle, revertChanges, setOriginalData,
//   };
// };

// const useSaveCheckData = () => {
//   const [saving, setSaving] = useState<boolean>(false);

//   const saveCheckData = async (
//     recordId: number | null, 
//     tempId: string, 
//     checkData: DynamicCheckData, 
//     isExisting: boolean,
//     remark: string, 
//     onSaveSuccess?: () => void
//   ) => {
//     setSaving(true);
//     try {
//       const payload = { 
//         id: recordId, 
//         temp_id: tempId, 
//         checkData: checkData,
//         remarks: remark // Send current remark to backend
//       };
      
//       if (isExisting) {
//         await humanBodyCheckService.updateCheckData(payload);
//         alert('Data updated successfully!');
//       } else {
//         await humanBodyCheckService.saveCheckData(payload);
//         alert('Data saved successfully! Proceeding to Orientation.');
//       }
      
//       if (onSaveSuccess) onSaveSuccess();
//     } catch (error: unknown) {
//       const message = error instanceof Error ? error.message : 'Unknown error';
//       alert(`Error: ${message}`);
//     } finally {
//       setSaving(false);
//     }
//   };

//   return { saveCheckData, saving };
// };

// // --- MAIN COMPONENT ---

// const HumanBodyCheckSheet: React.FC<HumanBodyCheckSheetProps> = ({ tempId, userDetails, onNext }) => {
//   const [newItem, setNewItem] = useState<string>('');
//   const [showAddForm, setShowAddForm] = useState<boolean>(false);
//   const [isEditMode, setIsEditMode] = useState<boolean>(false);
//   const [remark, setRemark] = useState<string>(''); 
  
//   const [showOrientationModal, setShowOrientationModal] = useState(false);
//   const navigate = useNavigate();

//   const {
//     checkData, isExisting, recordId, loading, error, fullUserData, remarksHistory,
//     updateCheckStatus, addNewCheck, toggleAllCycle, revertChanges, setOriginalData,
//   } = useCheckData(tempId);

//   const { saveCheckData, saving } = useSaveCheckData();

//   const isReadOnly = isExisting && !isEditMode;

//   const handleEdit = () => {
//     setIsEditMode(true);
//     setRemark(''); 
//   };

//   const handleCancelEdit = () => {
//     revertChanges();
//     setIsEditMode(false);
//     setRemark('');
//   };

//   const handleSaveData = () => {
//     if (isExisting && isEditMode && !remark.trim()) {
//       alert("Please provide a remark/reason for editing this record.");
//       return;
//     }

//     const onSaveSuccess = () => {
//       if (isExisting) {
//         setIsEditMode(false);
//         setOriginalData(JSON.parse(JSON.stringify(checkData)));
//         setRemark('');
//       }
//       setShowOrientationModal(true);
//     };
    
//     saveCheckData(recordId, tempId, checkData, isExisting, remark, onSaveSuccess);
//   };

//   const modalUser: User = fullUserData ? {
//       ...fullUserData,
//       first_name: fullUserData.first_name || userDetails.firstName,
//       last_name: fullUserData.last_name || userDetails.lastName,
//       email: fullUserData.email || userDetails.email,
//       phone_number: fullUserData.phone_number || userDetails.phoneNumber,
//   } : {
//      temp_id: tempId,
//       first_name: userDetails.firstName,
//       last_name: userDetails.lastName || '',
//       email: userDetails.email,
//       phone_number: userDetails.phoneNumber,
//       sex: (userDetails as any).sex || 'M',
//       is_active: true,
//       created_at: new Date().toISOString(),
//       is_added_to_master: false,
//       body_checks: [],
//       aadharNumber: (userDetails as any).aadharNumber || '', 
//       employment_type: (userDetails as any).employmentType || 'contractual',
//       hasExperience: (userDetails as any).hasExperience || false,
//       experienceYears: (userDetails as any).experienceYears || 0,
//       companyOfExperience: (userDetails as any).companyOfExperience || '',
//   };

//   if (loading) return (
//     <CheckSheetContainer>
//       <div className="p-12 text-center">
//         <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-4 border-purple-600 mb-4"></div>
//         <p className="text-lg font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Loading...</p>
//       </div>
//     </CheckSheetContainer>
//   );
  
//   if (error) return (
//     <CheckSheetContainer>
//       <div className="p-12 text-center">
//         <div className="bg-gradient-to-r from-red-500 to-pink-600 text-white p-6 rounded-xl shadow-lg">
//           <p className="text-lg font-semibold">{error}</p>
//         </div>
//       </div>
//     </CheckSheetContainer>
//   );

//   return (
//     <CheckSheetContainer>
//       <CheckSheetHeader title="Human Body Check Point (Level-0)" />
//       <UserInfoCard userDetails={userDetails} tempId={tempId} />
//       <CheckTable
//         checkData={checkData}
//         onStatusChange={updateCheckStatus}
//         showAddForm={showAddForm}
//         newItem={newItem}
//         onNewItemChange={setNewItem}
//         onAddItem={() => { addNewCheck(newItem); setNewItem(''); setShowAddForm(false); }}
//         onCancelAdd={() => setShowAddForm(false)}
//         onToggleAll={() => { if (!isReadOnly) toggleAllCycle(); }}
//         isReadOnly={isReadOnly}
//       />

//       {/* Edit Remark Field */}
//       {isEditMode && (
//         <section className="p-6 bg-orange-50 border-t-2 border-orange-200 animate-in fade-in slide-in-from-top-4 duration-300">
//           <h4 className="text-orange-800 font-bold flex items-center gap-2 mb-2">
//             <MessageSquare className="w-5 h-5" />
//             Reason for Modification <span className="text-red-500">*</span>
//           </h4>
//           <textarea
//             value={remark}
//             onChange={(e) => setRemark(e.target.value)}
//             placeholder="Mandatory: Please document the reason for this modification, specifying the original status versus the updated status."
//             className="w-full p-3 border border-orange-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white text-gray-700 shadow-inner resize-none"
//             rows={3}
//           />
//         </section>
//       )}

//       {/* Remarks History Section - Shows at the bottom */}
//       <RemarksHistory history={remarksHistory} />

//       <ActionBar
//         onAddNew={() => setShowAddForm(true)}
//         onSave={handleSaveData}
//         onEdit={handleEdit}
//         onCancelEdit={handleCancelEdit}
//         showAddForm={showAddForm}
//         isExisting={isExisting}
//         isEditMode={isEditMode}
//         isReadOnly={isReadOnly}
//         loading={saving}
//       />

//        {showOrientationModal && (
//         <OrientationFeedbackModal
//           user={modalUser}
//           onClose={() => setShowOrientationModal(false)}
//           onSave={() => {
//             setShowOrientationModal(false);
//             navigate('/Level0'); 
//           }}
//         />
//       )}
//     </CheckSheetContainer>
//   );
// };

// export default HumanBodyCheckSheet;





import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, X, Save, User as UserIcon, Edit, XCircle, MessageSquare, History, Clock } from 'lucide-react';
import { Button } from '../../atoms/Buttons/Button';

import type { AddItemFormProps, CheckSheetContainerProps, CheckSheetHeaderProps, HumanBodyCheckSheetProps, InfoItemProps, UserInfoCardProps, SheetAnswer, User } from '../../constants/types';
import { humanBodyCheckService } from '../../hooks/ServiceApis';
import OrientationFeedbackModal from '../OrientationFeedbackModal/OrientationFeedbackModal';

// --- INTERFACES ---
interface Question {
  id: number;
  question_text: string;
}

interface CheckItem {
  question_id?: number;
  description: string;
  status: 'eligible' | 'not_eligible' | '';
}

interface DynamicCheckData {
  [key: string]: CheckItem;
}

// Interface for a single remark entry
interface RemarkEntry {
  remark: string;
  created_at?: string; // Optional timestamp
  created_by?: string; // Optional user name
}

// --- PROP TYPES ---
interface StatusToggleButtonProps {
  status: 'eligible' | 'not_eligible' | '';
  onClick: () => void;
  disabled?: boolean;
}

interface CheckItemRowProps {
  id: string;
  item: CheckItem;
  onStatusChange: (id: string, status: 'eligible' | 'not_eligible' | '') => void;
  isReadOnly: boolean;
}

interface CheckTableHeaderProps {
  onToggleAll: () => void;
  isReadOnly: boolean;
}

interface CheckTableProps {
  checkData: DynamicCheckData;
  onStatusChange: (id: string, status: 'eligible' | 'not_eligible' | '') => void;
  showAddForm: boolean;
  newItem: string;
  onNewItemChange: (value: string) => void;
  onAddItem: () => void;
  onCancelAdd: () => void;
  onToggleAll: () => void;
  isReadOnly: boolean;
}

interface ActionBarProps {
  onAddNew: () => void;
  onSave: () => void;
  onEdit: () => void;
  onCancelEdit: () => void;
  showAddForm: boolean;
  isExisting: boolean;
  isEditMode: boolean;
  isReadOnly: boolean;
  loading: boolean;
}

// --- COMPONENTS ---

const CheckSheetHeader: React.FC<CheckSheetHeaderProps> = ({ title }) => (
  <header className="bg-blue-600 p-6 shadow-md rounded-t-2xl">
    <h1 className="text-2xl md:text-3xl font-bold text-center text-white tracking-wide">
      {title}
    </h1>
  </header>
);

const UserInfoCard: React.FC<UserInfoCardProps> = ({ userDetails, tempId }) => {
  const { firstName,lastName,  email, phoneNumber } = userDetails;
  console.log('emp,oyee data :',userDetails);
  return (
    <section className="bg-background p-6 border-b border-border">
      <h3 className="text-xl font-bold text-text mb-4 flex items-center">
        <div className="bg-blue-100 p-2 rounded-lg mr-3 shadow-sm">
          <UserIcon className="w-5 h-5 text-blue-600" />
        </div>
        User Information
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-3 bg-surface p-4 rounded-lg shadow-sm border border-border">
          <InfoItem 
            label="Name" 
            // value={`${firstName}`} 
              value={`${firstName} ${lastName}`.trim()}
          />
          <InfoItem 
            label="Temp ID" 
            value={tempId} 
            valueClassName="font-mono bg-background px-3 py-1.5 rounded-md font-semibold text-text" 
          />
        </div>
        <div className="space-y-3 bg-surface p-4 rounded-lg shadow-sm border border-border">
          <InfoItem label="Email" value={email} valueClassName="break-all" />
          <InfoItem label="Phone" value={phoneNumber} />
        </div>
      </div>
    </section>
  );
};

const InfoItem: React.FC<InfoItemProps> = ({ label, value, valueClassName = '' }) => (
  <div className="flex items-start">
    <span className="text-muted font-semibold w-24 text-sm">{label}:</span>
    <span className={`text-text font-medium text-sm ${valueClassName}`}>{value}</span>
  </div>
);

// --- Remarks History ---
const RemarksHistory: React.FC<{ history: RemarkEntry[] }> = ({ history }) => {
  if (!history || history.length === 0) return null;

  return (
    <section className="mt-6 bg-background rounded-xl border border-border overflow-hidden shadow-sm mx-6 mb-6">
      <div className="bg-surface px-6 py-3 border-b border-border flex items-center gap-2">
        <History className="w-5 h-5 text-muted" />
        <h3 className="font-bold text-text">Remarks History</h3>
      </div>
      <div className="p-6 space-y-4">
        {history.map((entry, index) => (
          <div key={index} className="flex flex-col sm:flex-row sm:items-start gap-3 p-3 bg-surface rounded-lg border border-border hover:shadow-sm transition-shadow">
             <div className="min-w-[140px] flex items-center gap-1 text-xs text-muted font-mono mt-1">
                <Clock className="w-3 h-3" />
                {entry.created_at ? new Date(entry.created_at).toLocaleDateString() : 'Previous Edit'}
             </div>
             <div className="flex-1">
                <p className="text-text text-sm leading-relaxed">{entry.remark}</p>
             </div>
          </div>
        ))}
      </div>
    </section>
  );
};

const CheckTableHeader: React.FC<CheckTableHeaderProps> = ({ onToggleAll, isReadOnly }) => (
  <header className="grid grid-cols-12 bg-surface border-b border-border shadow-sm">
    <div className="col-span-1 p-4 border-r border-border font-bold text-center text-muted text-sm uppercase">
      Sr No
    </div>
    <div className="col-span-9 p-4 border-r border-border font-bold text-center text-muted text-sm uppercase">
      Description
    </div>
    <div className="col-span-2 p-4 font-bold text-center flex items-center justify-center gap-3">
      <span className="text-muted text-sm uppercase">Status</span>
      <div>
        <button
          onClick={onToggleAll}
          disabled={isReadOnly}
          title={isReadOnly ? "ReadOnly" : "Cycle: Eligible -> Not Eligible -> Empty"}
          className="px-4 py-1.5 text-xs font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed shadow-sm hover:shadow-md transform hover:scale-105 select-none"
        >
          ALL
        </button>
      </div>
    </div>
  </header>
);

const CheckItemRow: React.FC<CheckItemRowProps> = ({ id, item, onStatusChange, isReadOnly }) => {
  const getStatusColor = (status: 'eligible' | 'not_eligible' | '') => {
    // Semantic colors kept for meaning
    if (status === 'eligible') return 'bg-green-50/50 border-l-4 border-l-green-500';
    if (status === 'not_eligible') return 'bg-red-50/50 border-l-4 border-l-red-500';
    return 'bg-surface hover:bg-background border-l-4 border-l-transparent';
  };

  const handleToggleStatus = () => {
    if (isReadOnly) return;
    let nextStatus: 'eligible' | 'not_eligible' | '' = '';
    // CYCLE: Empty -> Eligible -> Not Eligible -> Empty
    if (item.status === '') nextStatus = 'eligible';
    else if (item.status === 'eligible') nextStatus = 'not_eligible';
    else nextStatus = '';
    
    onStatusChange(id, nextStatus);
  };

  return (
    <article className={`grid grid-cols-12 border-b border-border transition-all duration-200 ${getStatusColor(item.status)}`}>
      <div className="col-span-1 p-4 border-r border-border text-center font-bold text-muted">
        {id}
      </div>
      <div className="col-span-9 p-4 border-r border-border">
        <span className="text-sm text-text leading-relaxed">{item.description}</span>
      </div>
      <div className="col-span-2 p-4 flex justify-center items-center">
        <StatusToggleButton status={item.status} onClick={handleToggleStatus} disabled={isReadOnly} />
      </div>
    </article>
  );
};

const StatusToggleButton: React.FC<StatusToggleButtonProps> = ({ status, onClick, disabled = false }) => {
  const getButtonClasses = () => {
    const baseClasses = 'p-3 rounded-lg border transition-all duration-200 w-16 h-12 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md transform hover:scale-105';
    // Semantic colors kept
    if (status === 'eligible') return `${baseClasses} bg-green-500 border-green-600 text-white`;
    if (status === 'not_eligible') return `${baseClasses} bg-red-500 border-red-600 text-white`;
    return `${baseClasses} bg-surface border-border hover:border-blue-400 hover:bg-background text-muted`;
  };

  return (
    <button onClick={onClick} className={getButtonClasses()} disabled={disabled}>
      {status === 'eligible' && <Check className="w-6 h-6" />}
      {status === 'not_eligible' && <X className="w-6 h-6" />}
      {status === '' && <span className="text-muted text-xl">-</span>}
    </button>
  );
};

const AddItemForm: React.FC<AddItemFormProps> = ({ newItem, onNewItemChange, onAdd, onCancel }) => (
  <form className="grid grid-cols-12 border-b border-border bg-background shadow-inner" onSubmit={(e) => { e.preventDefault(); onAdd(); }}>
    <div className="col-span-1 p-4 border-r border-border text-center text-blue-600 font-bold text-xl">+</div>
    <div className="col-span-9 p-4 border-r border-border">
      <input
        type="text"
        value={newItem}
        onChange={(e) => onNewItemChange(e.target.value)}
        placeholder="Enter new check item..."
        className="w-full p-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-surface text-text shadow-sm transition-all duration-200"
        onKeyPress={(e) => e.key === 'Enter' && onAdd()}
        autoFocus
        required
      />
    </div>
    <div className="col-span-2 p-4 flex justify-center gap-2">
      <Button 
        onClick={onAdd} 
        variant="primary" 
        size="sm" 
        className="bg-green-600 hover:bg-green-700 text-white shadow-sm hover:shadow-md transform hover:scale-105 transition-all duration-200 px-4 py-2 rounded-lg font-semibold" 
        type="button"
      >
        Add
      </Button>
      <Button 
        onClick={onCancel} 
        variant="secondary" 
        size="sm" 
        className="bg-gray-500 hover:bg-gray-600 text-white shadow-sm hover:shadow-md transform hover:scale-105 transition-all duration-200 px-4 py-2 rounded-lg font-semibold" 
        type="button"
      >
        Cancel
      </Button>
    </div>
  </form>
);

const CheckTable: React.FC<CheckTableProps> = ({
  checkData, onStatusChange, showAddForm, newItem, onNewItemChange, onAddItem, onCancelAdd, onToggleAll, isReadOnly,
}) => (
  <section className="check-table overflow-hidden">
    <CheckTableHeader 
      onToggleAll={onToggleAll} 
      isReadOnly={isReadOnly} 
    />
    {Object.entries(checkData).map(([id, item]) => (
      <CheckItemRow key={id} id={id} item={item} onStatusChange={onStatusChange} isReadOnly={isReadOnly} />
    ))}
    {showAddForm && <AddItemForm newItem={newItem} onNewItemChange={onNewItemChange} onAdd={onAddItem} onCancel={onCancelAdd} />}
  </section>
);

const ActionBar: React.FC<ActionBarProps> = ({
  onSave, onEdit, onCancelEdit, isExisting, isEditMode, isReadOnly, loading
}) => (
  <footer className="mt-auto p-6 bg-background border-t border-border flex justify-end items-center gap-4">
    {isExisting && !isEditMode && (
      <Button 
        onClick={onEdit} 
        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200 px-6 py-3 rounded-lg font-semibold"
      >
        <Edit className="w-5 h-5" /> Edit
      </Button>
    )}
    {isEditMode && (
      <Button 
        onClick={onCancelEdit} 
        className="flex items-center gap-2 bg-gray-500 hover:bg-gray-600 text-white shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200 px-6 py-3 rounded-lg font-semibold"
      >
        <XCircle className="w-5 h-5" /> Cancel
      </Button>
    )}
    <Button
      onClick={onSave}
      variant="primary"
      className="flex items-center gap-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200 px-6 py-3 rounded-lg font-semibold"
      disabled={isReadOnly}
      loading={loading}
    >
      <Save className="w-5 h-5" /> {isExisting ? 'Update Data' : 'Save Data'}
    </Button>
  </footer>
);

const CheckSheetContainer: React.FC<CheckSheetContainerProps> = ({ children }) => (
  <div className="min-h-screen bg-background py-8 px-4">
    <div className="max-w-6xl mx-auto">
      <div className="bg-surface rounded-2xl shadow-xl overflow-hidden border border-border">
        {children}
      </div>
    </div>
  </div>
);

// --- HOOKS ---

const useCheckData = (tempId: string) => {
  const [checkData, setCheckData] = useState<DynamicCheckData>({});
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isExisting, setIsExisting] = useState<boolean>(false);
  const [recordId, setRecordId] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [originalData, setOriginalData] = useState<DynamicCheckData>({});
  const [fullUserData, setFullUserData] = useState<any>(null);
  
  const [remarksHistory, setRemarksHistory] = useState<RemarkEntry[]>([]);

  useEffect(() => {
    const fetchQuestionsAndData = async () => {
      setLoading(true);
      setError('');
      try {
        const qRes = await humanBodyCheckService.fetchQuestions();
        let questionsList: Question[] = [];
        if (Array.isArray(qRes)) questionsList = qRes;
        else if (qRes && Array.isArray((qRes as any).data)) questionsList = (qRes as any).data;

        setQuestions(questionsList);

        const initialCheckData: DynamicCheckData = {};
        questionsList.forEach((question, index) => {
          const id = (index + 1).toString();
          initialCheckData[id] = { question_id: question.id, description: question.question_text, status: '' };
        });

        if (tempId) {
          const dRes = await humanBodyCheckService.fetchCheckDataByTempId(tempId);
          const responseData = Array.isArray(dRes) ? dRes : (dRes as any)?.data;

          if (Array.isArray(responseData) && responseData.length > 0) {
            const existingCheck = responseData.find((item: any) => item.temp_id === tempId) || responseData[0];
            
            if (existingCheck) setFullUserData(existingCheck);

            if (existingCheck) {
                let parsedHistory: RemarkEntry[] = [];
                if (Array.isArray(existingCheck.remarks_history)) {
                    parsedHistory = existingCheck.remarks_history;
                } 
                else if (existingCheck.remarks && typeof existingCheck.remarks === 'string') {
                    parsedHistory = [{ 
                        remark: existingCheck.remarks, 
                        created_at: existingCheck.updated_at || existingCheck.created_at 
                    }];
                }
                setRemarksHistory(parsedHistory);
            }

            if (existingCheck && Array.isArray(existingCheck.sheet_answers)) {
              setIsExisting(true);
              setRecordId(existingCheck.id);

              existingCheck.sheet_answers.forEach((answer: SheetAnswer) => {
                const localKey = Object.keys(initialCheckData).find(key => initialCheckData[key].question_id == answer.question);
                if (localKey) {
                  let mappedStatus: 'eligible' | 'not_eligible' | '' = '';
                  const val = answer.answer ? answer.answer.toLowerCase() : '';
                  if (val === 'pass' || val === 'eligible') mappedStatus = 'eligible';
                  else if (val === 'fail' || val === 'not_eligible') mappedStatus = 'not_eligible';
                  initialCheckData[localKey].status = mappedStatus;
                }
              });
            }
          }
        }
        setCheckData(initialCheckData);
        setOriginalData(JSON.parse(JSON.stringify(initialCheckData)));
      } catch (err) {
        console.error(err);
        setError('Failed to load data.');
      } finally {
        setLoading(false);
      }
    };
    fetchQuestionsAndData();
  }, [tempId]);

  const updateCheckStatus = (id: string, status: 'eligible' | 'not_eligible' | '') => {
    setCheckData(prev => ({ ...prev, [id]: { ...prev[id], status } }));
  };

  const addNewCheck = (description: string) => {
    const existingIds = Object.keys(checkData).map(id => parseInt(id));
    const newId = (Object.keys(checkData).length > 0 ? Math.max(...existingIds) : 0) + 1;
    setCheckData(prev => ({ ...prev, [newId.toString()]: { description, status: '' } }));
  };

  // UPDATED: Logic to Cycle All items: Empty -> Eligible -> Not Eligible -> Empty
  const toggleAllCycle = () => {
    setCheckData(prev => {
      const allValues = Object.values(prev);
      const isAllEligible = allValues.length > 0 && allValues.every(item => item.status === 'eligible');
      const isAllNotEligible = allValues.length > 0 && allValues.every(item => item.status === 'not_eligible');

      let targetStatus: 'eligible' | 'not_eligible' | '' = 'eligible'; // Default (if mixed or empty)

      if (isAllEligible) {
        targetStatus = 'not_eligible'; // 2nd click behavior
      } else if (isAllNotEligible) {
        targetStatus = ''; // 3rd click behavior
      }

      return Object.entries(prev).reduce((acc, [id, item]) => {
        acc[id] = { ...item, status: targetStatus };
        return acc;
      }, {} as DynamicCheckData);
    });
  };

  const revertChanges = () => {
    setCheckData(originalData);
  };

  return {
    checkData, questions, isExisting, recordId, loading, error, fullUserData, remarksHistory,
    updateCheckStatus, addNewCheck, toggleAllCycle, revertChanges, setOriginalData,
  };
};

const useSaveCheckData = () => {
  const [saving, setSaving] = useState<boolean>(false);

  const saveCheckData = async (
    recordId: number | null, 
    tempId: string, 
    checkData: DynamicCheckData, 
    isExisting: boolean,
    remark: string, 
    onSaveSuccess?: () => void
  ) => {
    setSaving(true);
    try {
      const payload = { 
        id: recordId, 
        temp_id: tempId, 
        checkData: checkData,
        remarks: remark // Send current remark to backend
      };
      
      if (isExisting) {
        await humanBodyCheckService.updateCheckData(payload);
        alert('Data updated successfully!');
      } else {
        await humanBodyCheckService.saveCheckData(payload);
        alert('Data saved successfully! Proceeding to Orientation.');
      }
      
      if (onSaveSuccess) onSaveSuccess();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      alert(`Error: ${message}`);
    } finally {
      setSaving(false);
    }
  };

  return { saveCheckData, saving };
};

// --- MAIN COMPONENT ---

const HumanBodyCheckSheet: React.FC<HumanBodyCheckSheetProps> = ({ tempId, userDetails, onNext }) => {
  const [newItem, setNewItem] = useState<string>('');
  const [showAddForm, setShowAddForm] = useState<boolean>(false);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [remark, setRemark] = useState<string>(''); 
  
  const [showOrientationModal, setShowOrientationModal] = useState(false);
  const navigate = useNavigate();

  const {
    checkData, isExisting, recordId, loading, error, fullUserData, remarksHistory,
    updateCheckStatus, addNewCheck, toggleAllCycle, revertChanges, setOriginalData,
  } = useCheckData(tempId);

  const { saveCheckData, saving } = useSaveCheckData();

  const isReadOnly = isExisting && !isEditMode;

  const handleEdit = () => {
    setIsEditMode(true);
    setRemark(''); 
  };

  const handleCancelEdit = () => {
    revertChanges();
    setIsEditMode(false);
    setRemark('');
  };

  const handleSaveData = () => {
    if (isExisting && isEditMode && !remark.trim()) {
      alert("Please provide a remark/reason for editing this record.");
      return;
    }

    const onSaveSuccess = () => {
      if (isExisting) {
        setIsEditMode(false);
        setOriginalData(JSON.parse(JSON.stringify(checkData)));
        setRemark('');
      }
      setShowOrientationModal(true);
    };
    
    saveCheckData(recordId, tempId, checkData, isExisting, remark, onSaveSuccess);
  };

  const modalUser: User = fullUserData ? {
      ...fullUserData,
      first_name: fullUserData.first_name || userDetails.firstName,
      last_name: fullUserData.last_name || userDetails.lastName,
      email: fullUserData.email || userDetails.email,
      phone_number: fullUserData.phone_number || userDetails.phoneNumber,
  } : {
     temp_id: tempId,
      first_name: userDetails.firstName,
      last_name: userDetails.lastName || '',
      email: userDetails.email,
      phone_number: userDetails.phoneNumber,
      sex: (userDetails as any).sex || 'M',
      is_active: true,
      created_at: new Date().toISOString(),
      is_added_to_master: false,
      body_checks: [],
      aadharNumber: (userDetails as any).aadharNumber || '', 
      employment_type: (userDetails as any).employmentType || 'contractual',
      hasExperience: (userDetails as any).hasExperience || false,
      experienceYears: (userDetails as any).experienceYears || 0,
      companyOfExperience: (userDetails as any).companyOfExperience || '',
  };

  if (loading) return (
    <CheckSheetContainer>
      <div className="p-12 text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-4 border-blue-600 mb-4"></div>
        <p className="text-lg font-semibold text-muted">Loading...</p>
      </div>
    </CheckSheetContainer>
  );
  
  if (error) return (
    <CheckSheetContainer>
      <div className="p-12 text-center">
        <div className="bg-red-500 text-white p-6 rounded-xl shadow-lg">
          <p className="text-lg font-semibold">{error}</p>
        </div>
      </div>
    </CheckSheetContainer>
  );

  return (
    <CheckSheetContainer>
      <CheckSheetHeader title="Human Body Check Point (Level-0)" />
      <UserInfoCard userDetails={userDetails} tempId={tempId} />
      <CheckTable
        checkData={checkData}
        onStatusChange={updateCheckStatus}
        showAddForm={showAddForm}
        newItem={newItem}
        onNewItemChange={setNewItem}
        onAddItem={() => { addNewCheck(newItem); setNewItem(''); setShowAddForm(false); }}
        onCancelAdd={() => setShowAddForm(false)}
        onToggleAll={() => { if (!isReadOnly) toggleAllCycle(); }}
        isReadOnly={isReadOnly}
      />

      {/* Edit Remark Field */}
      {isEditMode && (
        <section className="p-6 bg-amber-50 border-t-2 border-amber-200 animate-in fade-in slide-in-from-top-4 duration-300 mx-6 mt-6 rounded-lg">
          <h4 className="text-amber-800 font-bold flex items-center gap-2 mb-2">
            <MessageSquare className="w-5 h-5" />
            Reason for Modification <span className="text-red-500">*</span>
          </h4>
          <textarea
            value={remark}
            onChange={(e) => setRemark(e.target.value)}
            placeholder="Mandatory: Please document the reason for this modification, specifying the original status versus the updated status."
            className="w-full p-3 border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white text-gray-700 shadow-inner resize-none"
            rows={3}
          />
        </section>
      )}

      {/* Remarks History Section - Shows at the bottom */}
      <RemarksHistory history={remarksHistory} />

      <ActionBar
        onAddNew={() => setShowAddForm(true)}
        onSave={handleSaveData}
        onEdit={handleEdit}
        onCancelEdit={handleCancelEdit}
        showAddForm={showAddForm}
        isExisting={isExisting}
        isEditMode={isEditMode}
        isReadOnly={isReadOnly}
        loading={saving}
      />

       {showOrientationModal && (
        <OrientationFeedbackModal
          user={modalUser}
          onClose={() => setShowOrientationModal(false)}
          onSave={() => {
            setShowOrientationModal(false);
            navigate('/Level0'); 
          }}
        />
      )}
    </CheckSheetContainer>
  );
};

export default HumanBodyCheckSheet;