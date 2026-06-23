import React, { useState, useEffect } from 'react';
import { 
  UploadCloud, FileArchive, Trash2, AlertTriangle, 
  CheckCircle2, Download, Terminal, Activity, 
  Cpu, RefreshCw, Server, ShieldAlert, MonitorPlay,
  FileBox, ChevronDown, ChevronUp, ExternalLink,
  Maximize2, Minus, X, LayoutTemplate, Settings, Cog, Command,
  Wifi, MousePointer2
} from 'lucide-react';
import { toast } from 'react-hot-toast';

// ==================================================================================
// API SERVICE
// ==================================================================================
const API_BASE_URL = 'http://127.0.0.1:8000/';

const apiService = {
  getToolStatus: async () => {
    try {
      const res = await fetch(`${API_BASE_URL}exam-tool/status/`);
      if (!res.ok) return null;
      return res.json();
    } catch (error) {
      console.error("API Error:", error);
      return null;
    }
  },
  uploadTool: async (formData: FormData) => {
    const res = await fetch(`${API_BASE_URL}exam-tool/upload/`, { method: 'POST', body: formData });
    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || 'Upload failed');
    }
    return res.json();
  },
  deleteTool: async () => {
    const res = await fetch(`${API_BASE_URL}exam-tool/delete/`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Delete failed');
    return res.json();
  }
};

interface ToolFile {
  exists: boolean;
  filename?: string;
  uploaded_at?: string;
}

const DownloadFiles = () => {
  const [fileData, setFileData] = useState<ToolFile | null>(null);
  const [loading, setLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // CHANGED: Default open step is now 1 (First Step)
  const [openStep, setOpenStep] = useState<number | null>(1);

  const fetchStatus = async () => {
    try {
      const data = await apiService.getToolStatus();
      setFileData(data);
    } catch (e) {
      console.error("Failed to fetch status");
    }
  };

  useEffect(() => { fetchStatus(); }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    const file = e.target.files[0];
    const allowedExtensions = ['.zip', '.rar', '.7z', '.tar', '.gz', '.iso'];
    const fileExt = file.name.slice(file.name.lastIndexOf('.')).toLowerCase();

    if (!allowedExtensions.includes(fileExt)) {
        toast.error(`Invalid file type. Allowed: ${allowedExtensions.join(', ')}`);
        return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      await apiService.uploadTool(formData);
      toast.success("Configuration file uploaded successfully.");
      await fetchStatus();
    } catch (err: any) {
      toast.error(err.message || "Failed to upload file.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await apiService.deleteTool();
      toast.success("Configuration file deleted.");
      setFileData(null);
      setIsDeleting(false);
    } catch (err) {
      toast.error("Failed to delete file.");
    }
  };

  // --- ACCORDION COMPONENT ---
  const StepAccordion = ({ stepNum, title, summary, icon: Icon, children }: any) => {
    const isOpen = openStep === stepNum;
    return (
      <div className={`border rounded-xl mb-4 transition-all duration-300 ${isOpen ? 'border-indigo-200 bg-white shadow-md' : 'border-gray-100 bg-gray-50'}`}>
        <button 
          onClick={() => setOpenStep(isOpen ? null : stepNum)}
          className="w-full flex items-center justify-between p-4 text-left focus:outline-none"
        >
          <div className="flex items-center gap-4">
            <div className={`flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm transition-colors ${isOpen ? 'bg-indigo-600 text-white' : 'bg-white text-gray-500 border border-gray-200'}`}>
              {Icon ? <Icon className="w-4 h-4" /> : stepNum}
            </div>
            <div>
              <h4 className={`text-md font-bold ${isOpen ? 'text-indigo-900' : 'text-gray-700'}`}>{title}</h4>
              {!isOpen && <p className="text-xs text-gray-500 mt-0.5">{summary}</p>}
            </div>
          </div>
          {isOpen ? <ChevronUp className="w-5 h-5 text-indigo-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
        </button>
        <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-[1200px] opacity-100' : 'max-h-0 opacity-0'}`}>
          <div className="p-4 pt-0 pl-[4.5rem] pr-6 pb-6 text-sm text-gray-600 leading-relaxed border-t border-transparent">
             {children}
          </div>
        </div>
      </div>
    );
  };

  // --- CUSTOM DIGITAL REMOTE COMPONENT (For Step 6) ---
  const DigitalRemote = () => {
    return (
      <div className="relative flex flex-col md:flex-row gap-8 items-center justify-center p-4 bg-gray-50 rounded-xl border border-gray-200 mt-4">
        
        {/* THE REMOTE UI */}
        <div className="relative shrink-0 w-[220px] h-[380px] bg-gray-100 rounded-[2rem] p-1.5 shadow-xl border border-gray-300 select-none transform transition-transform hover:scale-[1.02]">
          {/* Black Inner Face */}
          <div className="w-full h-full bg-[#111] rounded-[1.7rem] overflow-hidden flex flex-col relative shadow-inner">
            <div className="text-gray-300 text-center font-serif italic pt-3 text-lg tracking-wide opacity-90">EasyTest™</div>
            
            {/* LCD Screen */}
            <div className="mx-3 mt-2 h-[75px] bg-[#9caf88] rounded-sm shadow-[inset_0_2px_4px_rgba(0,0,0,0.4)] relative font-mono text-[#2a3322]">
               <div className="absolute top-1.5 left-2 flex items-end gap-[2px] h-3">
                 <span className="text-[10px] font-bold mr-1 -mt-1">Y..ll</span>
               </div>
               <div className="absolute top-1 right-2 border border-[#2a3322] px-1 text-[10px] rounded-[2px] font-bold">OK</div>
               <div className="absolute bottom-0 right-2 text-3xl font-bold tracking-tighter opacity-80" style={{fontFamily: 'monospace'}}>78</div>
               {/* Highlight Overlay (Tower) */}
               <div className="absolute -top-1 -left-1 w-10 h-8 border-2 border-red-500 rounded-lg animate-pulse z-10"></div>
            </div>

            {/* Buttons Area */}
            <div className="px-3 mt-4 flex flex-col gap-4">
               <div className="flex justify-between gap-3 relative">
                  <button className="bg-[#00c65e] active:bg-[#00a64e] text-white w-full py-2.5 rounded-t-lg rounded-b-[1rem] text-xl font-bold shadow-lg relative z-0">OK</button>
                  <button className="bg-[#ff5500] active:bg-[#e04b00] text-white w-full py-2.5 rounded-t-lg rounded-b-[1rem] text-xl font-bold shadow-lg">C</button>
                  {/* Highlight Overlay (OK Button) */}
                  <div className="absolute -top-1 -left-1 w-[48%] h-[110%] border-2 border-blue-500 rounded-xl animate-pulse z-10 pointer-events-none"></div>
               </div>
               <div className="grid grid-cols-3 gap-y-3 gap-x-2 text-white text-center">
                  {[{n:'1', l:'A'}, {n:'2', l:'B'}, {n:'3', l:'C'}, {n:'4', l:'D'}, {n:'5', l:'E'}, {n:'6', l:'F'}, {n:'7', l:'G'}, {n:'8', l:'H'}, {n:'9', l:'I'}].map((btn) => (
                     <div key={btn.n} className="flex flex-col items-center justify-center cursor-pointer active:text-gray-400">
                        <span className="text-2xl font-medium leading-none">{btn.n}</span>
                        <span className="text-[10px] font-bold text-gray-400 -mt-1">{btn.l}</span>
                     </div>
                  ))}
                  <div className="flex flex-col items-center justify-center cursor-pointer mt-1"><span className="text-xl">↑.</span></div>
                  <div className="flex flex-col items-center justify-center cursor-pointer"><span className="text-2xl">0</span><span className="text-[10px] text-gray-400 -mt-1">📄</span></div>
                  <div className="flex flex-col items-center justify-center cursor-pointer mt-1"><span className="text-xl">↓<span className="text-[9px]">CH</span></span></div>
               </div>
            </div>
          </div>
        </div>

        {/* Guidance Text */}
        <div className="flex flex-col gap-6 text-sm">
           <div className="flex items-start gap-3">
              <div className="mt-1 min-w-[24px] h-6 flex items-center justify-center bg-red-100 text-red-600 rounded-full"><Wifi className="w-4 h-4" /></div>
              <div><h4 className="font-bold text-gray-900 flex items-center gap-2">1. Tower Bar (Signal)<span className="px-1.5 py-0.5 rounded bg-red-100 text-red-600 text-[10px] font-bold uppercase border border-red-200">Highlight Red</span></h4><p className="text-gray-500 mt-1 leading-relaxed max-w-[250px]">Check the top-left corner of the LCD screen.</p></div>
           </div>
           <div className="w-full h-px bg-gray-200"></div>
           <div className="flex items-start gap-3">
              <div className="mt-1 min-w-[24px] h-6 flex items-center justify-center bg-blue-100 text-blue-600 rounded-full"><MousePointer2 className="w-4 h-4" /></div>
              <div><h4 className="font-bold text-gray-900 flex items-center gap-2">2. OK Button Interaction<span className="px-1.5 py-0.5 rounded bg-blue-100 text-blue-600 text-[10px] font-bold uppercase border border-blue-200">Highlight Blue</span></h4><p className="text-gray-500 mt-1 leading-relaxed max-w-[250px]">Press the green <strong className="text-green-600">OK</strong> button to test responsiveness.</p></div>
           </div>
        </div>
      </div>
    );
  };

  // --- FAKE TERMINAL (Step 2 - Install) ---
  const FakeTerminal = () => (
    <div className="mt-4 rounded-lg overflow-hidden border border-gray-700 bg-[#0c0c0c] shadow-2xl font-mono text-[11px] sm:text-xs leading-snug">
      <div className="bg-[#1f1f1f] px-3 py-1.5 flex items-center justify-between border-b border-gray-700">
        <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]"></div><div className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]"></div><div className="w-2.5 h-2.5 rounded-full bg-[#27c93f]"></div></div>
        <div className="text-gray-400 font-sans text-[10px] select-none flex items-center gap-1"><Terminal className="w-3 h-3" /> Administrator: Command Prompt</div>
        <div className="w-8"></div>
      </div>
      <div className="p-4 text-gray-300">
        <div className="mb-2"><span className="text-gray-500">C:\WINDOWS\System32\cmd.exe</span></div>
        <div className="text-white font-bold mb-1">==================================================</div>
        <div className="text-white font-bold mb-1">&nbsp;&nbsp;&nbsp;&nbsp;Dojo Hardware Connector Service Installer</div>
        <div className="text-white font-bold mb-2">==================================================</div>
        <div className="space-y-1">
            <div>[+] Installing the service...</div>
            <div className="text-green-400">Service "DojoHardwareConnector" installed successfully!</div>
            <div className="mt-2">[+] Setting the working directory...</div>
            <div className="mt-2">[+] Starting the service now...</div>
            <div className="text-green-400">DojoHardwareConnector: START: The operation completed successfully.</div>
        </div>
        <div className="text-white font-bold mt-4 mb-1">==================================================</div>
        <div className="text-green-400 font-bold">SUCCESS! The Hardware Connector service is installed and running.</div>
        <div className="animate-pulse">Press any key to continue . . .<span className="bg-gray-300 text-black w-2 h-4 inline-block ml-1">_</span></div>
      </div>
    </div>
  );

  // --- FAKE UNINSTALL TERMINAL (Step 7) ---
  const FakeUninstallTerminal = () => (
    <div className="mt-4 rounded-lg overflow-hidden border border-gray-700 bg-[#0c0c0c] shadow-2xl font-mono text-[11px] sm:text-xs leading-snug">
      {/* Header */}
      <div className="bg-[#1f1f1f] px-3 py-1.5 flex items-center justify-between border-b border-gray-700">
        <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]"></div><div className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]"></div><div className="w-2.5 h-2.5 rounded-full bg-[#27c93f]"></div></div>
        <div className="text-gray-400 font-sans text-[10px] select-none flex items-center gap-1"><Terminal className="w-3 h-3" /> Administrator: Command Prompt</div>
        <div className="w-8"></div>
      </div>
      
      {/* Content based on Screenshot */}
      <div className="p-4 text-gray-300">
        <div className="mb-2"><span className="text-gray-500">C:\WINDOWS\System32\cmd.exe</span></div>

        <div className="text-white font-bold mb-1">==================================================</div>
        <div className="text-white font-bold mb-1">&nbsp;&nbsp;&nbsp;&nbsp;Dojo Hardware Connector Service Uninstaller</div>
        <div className="text-white font-bold mb-2">==================================================</div>

        <div className="space-y-1">
            <div>[+] Stopping the service...</div>
            <div className="text-gray-300">DojoHardwareConnector: STOP: The operation completed successfully.</div>
            <div className="mt-2">[+] Removing the service...</div>
            <div className="text-gray-300">Service "DojoHardwareConnector" removed successfully!</div>
        </div>

        <div className="text-white font-bold mt-4 mb-1">==================================================</div>
        <div className="text-green-400 font-bold">SUCCESS! The Hardware Connector service has been removed.</div>
        <div className="text-green-400 font-bold mb-1">You can now safely delete this folder.</div>
        <div className="text-white font-bold mb-2">==================================================</div>

        <div className="animate-pulse">Press any key to continue . . .<span className="bg-gray-300 text-black w-2 h-4 inline-block ml-1">_</span></div>
      </div>
    </div>
  );

  // --- FAKE CLIENT TERMINAL (Step 5) ---
  const FakeClientTerminal = () => (
    <div className="mt-4 rounded-lg overflow-hidden border border-gray-800 bg-black shadow-2xl font-mono text-[11px] sm:text-xs leading-snug">
      <div className="bg-black px-3 py-1.5 flex items-center justify-between border-b border-gray-900">
        <div className="flex items-center gap-2"><Command className="w-3 h-3 text-gray-400" /><span className="text-gray-200 text-[10px] font-sans">C:\WINDOWS\py.exe</span></div>
        <div className="flex gap-3 text-gray-500"><Minus className="w-3 h-3" /><Maximize2 className="w-3 h-3" /><X className="w-3 h-3" /></div>
      </div>
      <div className="p-4 text-gray-300 font-mono">
        <div>Starting EasyTest HTTP Client...</div>
        <div className="truncate">Found and loaded EasyTest SDK at: C:\Users\admin\Desktop\client_app\EasyTestSDK_x64.dll</div>
        <div>Connecting to EasyTest device...</div>
        <div className="text-gray-400">Device connection failed with code: 1</div>
        <div className="mt-1">Device Connect: BaseID=1, Mode=1, Info=2</div>
        <div>Event posted to connect-events</div>
        <div className="animate-pulse">Vote Event: BaseID=1, Mode=10, Info=1<span className="bg-gray-300 text-black w-2 h-4 inline-block ml-1">_</span></div>
      </div>
    </div>
  );

  // --- FAKE TASK MANAGER (Step 3) ---
  const FakeTaskManager = () => (
    <div className="mt-4 border border-gray-300 shadow-xl rounded-sm overflow-hidden bg-white font-sans text-xs select-none">
        <div className="bg-white p-2 flex justify-between items-center h-8">
            <div className="flex items-center gap-2 pl-1"><LayoutTemplate className="w-4 h-4 text-orange-500" /><span className="text-xs text-gray-700">Task Manager</span></div>
            <div className="flex gap-4 pr-2 text-gray-400"><Minus className="w-4 h-4" /><Maximize2 className="w-3.5 h-3.5" /><X className="w-4 h-4 hover:text-red-600" /></div>
        </div>
        <div className="bg-white px-2 pb-1 border-b border-gray-200">
            <div className="flex gap-4 text-gray-600 mb-2 px-1"><span>File</span> <span>Options</span> <span>View</span></div>
            <div className="flex gap-1">
                {['Processes', 'Performance', 'App history', 'Startup', 'Users', 'Details', 'Services'].map((tab) => (
                    <div key={tab} className={`px-2 py-1 ${tab === 'Details' ? 'border-b-2 border-blue-600 text-black bg-gray-50' : 'text-gray-500 hover:bg-gray-100'}`}>{tab}</div>
                ))}
            </div>
        </div>
        <div className="grid grid-cols-12 bg-white text-gray-500 border-b border-gray-200 px-2 py-1.5 font-medium">
            <div className="col-span-4 border-r border-gray-200">Name</div>
            <div className="col-span-1 border-r border-gray-200 pl-2">PID</div>
            <div className="col-span-2 border-r border-gray-200 pl-2">Status</div>
            <div className="col-span-2 border-r border-gray-200 pl-2">User name</div>
            <div className="col-span-1 border-r border-gray-200 pl-2">CPU</div>
            <div className="col-span-2 pl-2">Memory</div>
        </div>
        <div className="bg-white min-h-[100px] text-gray-700">
            <div className="grid grid-cols-12 px-2 py-1 hover:bg-gray-50"><div className="col-span-4 flex items-center gap-2"><div className="w-3 h-3 bg-gray-400 rounded-sm"></div>csrss.exe</div><div className="col-span-1 pl-2">624</div><div className="col-span-2 pl-2">Running</div><div className="col-span-2 pl-2">SYSTEM</div><div className="col-span-1 pl-2">00</div><div className="col-span-2 pl-2 text-right">4,820 K</div></div>
            <div className="grid grid-cols-12 px-2 py-1 bg-[#26a0da] text-white">
                <div className="col-span-4 flex items-center gap-2"><div className="w-3 h-3 bg-yellow-400 rounded-full border border-yellow-600"></div>python.exe</div>
                <div className="col-span-1 pl-2">10156</div><div className="col-span-2 pl-2">Running</div><div className="col-span-2 pl-2">SYSTEM</div><div className="col-span-1 pl-2">00</div><div className="col-span-2 pl-2 text-right">18,624 K</div>
            </div>
            <div className="grid grid-cols-12 px-2 py-1 hover:bg-gray-50"><div className="col-span-4 flex items-center gap-2"><div className="w-3 h-3 bg-gray-400 rounded-sm"></div>svchost.exe</div><div className="col-span-1 pl-2">1328</div><div className="col-span-2 pl-2">Running</div><div className="col-span-2 pl-2">SYSTEM</div><div className="col-span-1 pl-2">00</div><div className="col-span-2 pl-2 text-right">2,432 K</div></div>
        </div>
    </div>
  );

  // --- FAKE SERVICES MANAGER (Step 4) ---
  const FakeServicesManager = () => (
    <div className="mt-4 border border-gray-300 shadow-xl rounded-sm overflow-hidden bg-white font-sans text-xs select-none">
        <div className="bg-white p-2 flex justify-between items-center h-8">
            <div className="flex items-center gap-2 pl-1"><LayoutTemplate className="w-4 h-4 text-orange-500" /><span className="text-xs text-gray-700">Task Manager</span></div>
            <div className="flex gap-4 pr-2 text-gray-400"><Minus className="w-4 h-4" /><Maximize2 className="w-3.5 h-3.5" /><X className="w-4 h-4 hover:text-red-600" /></div>
        </div>
        <div className="bg-white px-2 pb-1 border-b border-gray-200">
            <div className="flex gap-4 text-gray-600 mb-2 px-1"><span>File</span> <span>Options</span> <span>View</span></div>
            <div className="flex gap-1">
                {['Processes', 'Performance', 'App history', 'Startup', 'Users', 'Details', 'Services'].map((tab) => (
                    <div key={tab} className={`px-2 py-1 ${tab === 'Services' ? 'border-b-2 border-blue-600 text-black bg-gray-50' : 'text-gray-500 hover:bg-gray-100'}`}>{tab}</div>
                ))}
            </div>
        </div>
        <div className="grid grid-cols-12 bg-white text-gray-500 border-b border-gray-200 px-2 py-1.5 font-medium">
            <div className="col-span-3 border-r border-gray-200">Name</div>
            <div className="col-span-1 border-r border-gray-200 pl-2">PID</div>
            <div className="col-span-4 border-r border-gray-200 pl-2">Description</div>
            <div className="col-span-2 border-r border-gray-200 pl-2">Status</div>
            <div className="col-span-2 pl-2">Group</div>
        </div>
        <div className="bg-white min-h-[150px] text-gray-700">
            <div className="grid grid-cols-12 px-2 py-1 hover:bg-gray-50"><div className="col-span-3 flex items-center gap-2"><Settings className="w-3 h-3 text-gray-400" />Dnscache</div><div className="col-span-1 pl-2">3228</div><div className="col-span-4 pl-2 truncate">DNS Client</div><div className="col-span-2 pl-2">Running</div><div className="col-span-2 pl-2">NetworkService</div></div>
            <div className="grid grid-cols-12 px-2 py-1 bg-[#26a0da] text-white">
                <div className="col-span-3 flex items-center gap-2"><Cog className="w-3 h-3 text-white" />DojoHardwareConnector</div>
                <div className="col-span-1 pl-2">8780</div><div className="col-span-4 pl-2">DojoHardwareConnector</div><div className="col-span-2 pl-2">Running</div><div className="col-span-2 pl-2"></div>
            </div>
        </div>
    </div>
  );

  return (
    <div className="w-full bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden animate-fade-in">
      
      {/* Header */}
      {/* <div className="bg-gradient-to-r from-slate-800 to-slate-900 p-8 text-white">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-white/10 rounded-xl backdrop-blur-sm">
            <Server className="w-8 h-8 text-blue-400" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Exam Tool Configuration & Setup</h2>
            <p className="text-slate-400 mt-1">Manage hardware configuration files and follow the installation guide.</p>
          </div>
        </div>
      </div> */}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
        
        {/* LEFT: File Manager */}
        <div className="lg:col-span-5 p-8 border-b lg:border-b-0 lg:border-r border-gray-100 bg-gray-50/50">
          <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
            <FileArchive className="w-5 h-5 text-indigo-600" />
            Configuration File
          </h3>

          {!fileData?.exists ? (
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-indigo-500 hover:bg-indigo-50/30 transition-all duration-300 group">
              <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <UploadCloud className="w-8 h-8" />
              </div>
              <h4 className="text-lg font-medium text-gray-900">Upload Hardware Config</h4>
              <p className="text-sm text-gray-500 mt-2 mb-6">Supported formats: .zip, .rar, .7z, .tar</p>
              <label className="relative inline-flex items-center justify-center px-6 py-3 overflow-hidden font-medium text-indigo-600 transition duration-300 ease-out border-2 border-indigo-600 rounded-lg shadow-md group cursor-pointer">
                <span className="absolute inset-0 flex items-center justify-center w-full h-full text-white duration-300 -translate-x-full bg-indigo-600 group-hover:translate-x-0 ease"><UploadCloud className="w-5 h-5" /></span>
                <span className="absolute flex items-center justify-center w-full h-full text-indigo-600 transition-all duration-300 transform group-hover:translate-x-full ease">Select File</span>
                <span className="relative invisible">Select File</span>
                <input type="file" className="hidden" accept=".zip,.rar,.7z,.tar,.gz,.iso" onChange={handleFileUpload} disabled={loading} />
              </label>
            </div>
          ) : !isDeleting ? (
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-yellow-100 text-yellow-700 rounded-lg"><FileBox className="w-6 h-6" /></div>
                    <div className="overflow-hidden">
                        <h4 className="font-bold text-gray-900 truncate max-w-[180px]" title={fileData.filename}>{fileData.filename}</h4>
                        <p className="text-xs text-gray-500">Uploaded: {new Date(fileData.uploaded_at || '').toLocaleDateString()}</p>
                    </div>
                </div>
                <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-md uppercase shrink-0">Active</span>
              </div>
              <div className="flex flex-col gap-3">
                <a href={`${API_BASE_URL}exam-tool/download/`} className="w-full flex items-center justify-center gap-2 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium shadow-sm"><Download className="w-4 h-4" /> Download Config</a>
                <button onClick={() => setIsDeleting(true)} className="w-full flex items-center justify-center gap-2 py-2.5 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors font-medium text-sm"><Trash2 className="w-4 h-4" /> Delete File</button>
              </div>
            </div>
          ) : (
            <div className="bg-red-50 border border-red-200 rounded-xl p-6 animate-fade-in">
                <div className="flex items-center gap-3 mb-4"><AlertTriangle className="w-6 h-6 text-red-600" /><h4 className="font-bold text-red-800">Destructive Action</h4></div>
                <p className="text-sm text-red-700 mb-4 leading-relaxed">This file is the <strong>Hardware Configuration</strong>. Deleting it will prevent new installations.<br /><strong>This action cannot be undone.</strong></p>
                <div className="flex gap-3">
                    <button onClick={() => setIsDeleting(false)} className="flex-1 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg font-medium text-sm hover:bg-gray-50">Cancel</button>
                    <button onClick={handleDelete} className="flex-1 py-2 bg-red-600 text-white rounded-lg font-medium text-sm hover:bg-red-700 shadow-sm">Yes, Delete</button>
                </div>
            </div>
          )}
           <div className="mt-8 bg-blue-50 border border-blue-100 rounded-xl p-5">
                <h4 className="text-sm font-bold text-blue-800 mb-2 flex items-center gap-2"><Cpu className="w-4 h-4" /> System Requirements</h4>
                <ul className="text-xs text-blue-700 space-y-1.5 list-disc list-inside"><li>Windows 10/11 (64-bit)</li><li>Visual C++ Redistributable (x64)</li><li>Admin privileges required</li></ul>
           </div>
        </div>

        {/* RIGHT: Detailed Accordion Instructions */}
        <div className="lg:col-span-7 p-8 bg-white h-full overflow-y-auto">
          <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Terminal className="w-5 h-5 text-indigo-600" />
            Installation Procedure
          </h3>

          {/* STEP 1 */}
          <StepAccordion 
            stepNum={1} 
            title="Install Visual C++ Redistributable" 
            summary="Download and install the required Microsoft libraries."
            icon={CheckCircle2}
          >
            <p className="mb-4 text-gray-600">The hardware connector runs on Python and requires the <strong>Visual C++ Redistributable (x64)</strong>.</p>
            <div className="border border-gray-200 rounded-lg overflow-hidden mb-4">
                <div className="bg-gray-100 px-4 py-2 border-b border-gray-200 flex justify-between text-xs font-bold text-gray-500 uppercase tracking-wider"><span>Architecture</span><span>Link</span></div>
                <div className="flex justify-between items-center px-4 py-3 border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <span className="font-mono text-gray-600 text-xs">X86</span>
                    <a href="https://aka.ms/vs/17/release/vc_redist.x86.exe" target="_blank" rel="noreferrer" className="text-blue-600 hover:text-blue-800 text-xs flex items-center gap-1">vc_redist.x86.exe <ExternalLink className="w-3 h-3" /></a>
                </div>
                <div className="flex justify-between items-center px-4 py-3 bg-green-50 border-b border-green-100 relative">
                    <div className="flex items-center gap-2"><span className="font-mono text-green-900 font-bold text-sm">X64</span><span className="px-1.5 py-0.5 bg-green-200 text-green-800 text-[10px] rounded font-bold uppercase tracking-wide">Recommended</span></div>
                    <a href="https://aka.ms/vs/17/release/vc_redist.x64.exe" target="_blank" rel="noreferrer" className="text-green-700 hover:text-green-900 font-medium text-sm flex items-center gap-1 underline decoration-green-300 underline-offset-4"><Download className="w-3.5 h-3.5" /> vc_redist.x64.exe</a>
                </div>
                <div className="flex justify-between items-center px-4 py-3 hover:bg-gray-50 transition-colors">
                    <span className="font-mono text-gray-600 text-xs">ARM64</span>
                    <a href="https://aka.ms/vs/17/release/vc_redist.arm64.exe" target="_blank" rel="noreferrer" className="text-blue-600 hover:text-blue-800 text-xs flex items-center gap-1">vc_redist.arm64.exe <ExternalLink className="w-3 h-3" /></a>
                </div>
            </div>
          </StepAccordion>

          {/* STEP 2 */}
          <StepAccordion 
            stepNum={2} 
            title="Run Installation Script" 
            summary="Execute the batch file as Administrator."
            icon={MonitorPlay}
          >
            1. Extract the downloaded archive.
            <br />
            2. <strong>Right-click</strong> on <code className="bg-gray-100 px-1.5 py-0.5 rounded text-red-600 font-mono text-xs border border-gray-200">install.bat</code> and select <strong>Run as Administrator</strong>.
            <br /><br />
            <span className="text-gray-500 text-xs uppercase tracking-wide font-bold">Expected Output:</span>
            <FakeTerminal />
          </StepAccordion>

          {/* STEP 3 */}
          <StepAccordion 
            stepNum={3} 
            title="Verify Process (Task Manager)" 
            summary="Check if python.exe is running in the background."
            icon={Activity}
          >
            <ol className="list-decimal list-inside space-y-2 text-gray-700">
                <li>Press <kbd className="px-1.5 py-0.5 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg">Ctrl + Shift + Esc</kbd>.</li>
                <li>Go to the <strong>Details</strong> tab.</li>
                <li>Verify that <strong>python.exe</strong> is running under user <strong>SYSTEM</strong>.</li>
            </ol>
            <FakeTaskManager />
          </StepAccordion>

          {/* STEP 4 */}
          <StepAccordion 
            stepNum={4} 
            title="Check Service Status" 
            summary="Ensure the Hardware Connector service is active."
            icon={ShieldAlert}
          >
             <ol className="list-decimal list-inside space-y-2 text-gray-700">
                <li>Open <strong>Task Manager</strong>.</li>
                <li>Click on the <strong>Services</strong> tab (last tab).</li>
                <li>Find <strong>DojoHardwareConnector</strong>. Status should be <strong>Running</strong>.</li>
            </ol>
            <FakeServicesManager />
          </StepAccordion>

          {/* STEP 5: MANUAL CLIENT (Fake Client Terminal) */}
          <StepAccordion 
            stepNum={5} 
            title="Manual Client Start" 
            summary="Force start the client if it doesn't run automatically."
            icon={RefreshCw}
          >
             1. Navigate to the extracted folder.
             <br />
             2. Double-click <code className="bg-gray-100 px-1.5 py-0.5 rounded text-red-600 font-mono text-xs border border-gray-200">run_client.bat</code>. 
             <br />
             3. A window will open showing connection attempts:
             <br />
             <FakeClientTerminal />
          </StepAccordion>

          {/* STEP 6: REMOTE UI CHECK */}
          <StepAccordion 
            stepNum={6} 
            title="Remote Hardware Check" 
            summary="Troubleshooting the physical device interface."
            icon={AlertTriangle}
          >
             <p className="text-gray-600 mb-2">Use the interactive diagram below to identify critical status indicators on the physical remote.</p>
             <DigitalRemote />
          </StepAccordion>

          {/* STEP 7: UNINSTALL (New) */}
          <StepAccordion 
            stepNum={7} 
            title="Clean Reinstall" 
            summary="How to uninstall and reinstall correctly."
            icon={Trash2}
          >
             1. Run <code className="bg-gray-100 px-1.5 py-0.5 rounded text-red-600 font-mono text-xs border border-gray-200">uninstall.bat</code> as <strong>Administrator</strong>.
             <br/>
             2. Verify the output matches the window below.
             <br/>
             3. Delete the folder and restart from <strong>Step 2</strong>.
             <FakeUninstallTerminal />
          </StepAccordion>

        </div>
      </div>
    </div>
  );
};

export default DownloadFiles;