

import React, { useState, useRef } from 'react';
import axios from 'axios';
import { 
  Download, 
  Upload, 
  FileSpreadsheet, 
  AlertCircle, 
  CheckCircle,
  Loader2,
  Sparkles,
  Calendar,
  Clock,
  Users,
  Zap,
  ArrowRight,
  Star,
  BookOpen
} from 'lucide-react';

// Configuration: Change this to match your Django server URL
const API_BASE_URL = 'http://127.0.0.1:8000'; 

const SchedulePlanner: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ 
    type: 'success' | 'error' | 'warning', 
    text: string, 
    details?: string[] 
  } | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- 1. DOWNLOAD TEMPLATE HANDLER ---
  const handleDownloadTemplate = async () => {
    try {
      setIsLoading(true);
      setMessage(null);
      
      const response = await axios.get(`${API_BASE_URL}/schedules/download-template/`, {
        responseType: 'blob', 
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'Schedule_Template.xlsx');
      document.body.appendChild(link);
      link.click();
      
      if (link.parentNode) link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      setMessage({ type: 'success', text: 'Template downloaded successfully!' });
    } catch (error) {
      console.error('Download failed', error);
      setMessage({ type: 'error', text: 'Failed to download template. Please check your server connection.' });
    } finally {
      setIsLoading(false);
    }
  };

  // --- 2. FILE SELECTION TRIGGER ---
  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // --- 3. UPLOAD EXCEL HANDLER ---
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    event.target.value = '';

    const formData = new FormData();
    formData.append('file', file);

    try {
      setIsLoading(true);
      setMessage(null);

      const response = await axios.post(`${API_BASE_URL}/schedules/upload-excel/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 207) {
        setMessage({
          type: 'warning',
          text: response.data.message,
          details: response.data.errors
        });
      } else {
        setMessage({
          type: 'success',
          text: response.data.message || 'Schedule uploaded successfully!'
        });
      }

    } catch (error: any) {
      console.error('Upload failed', error);
      const errorMsg = error.response?.data?.error || 'An unexpected error occurred during upload.';
      setMessage({ type: 'error', text: errorMsg });
    } finally {
      setIsLoading(false);
    }
  };

  // Drag and drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const file = e.dataTransfer.files[0];
    if (file && (file.name.endsWith('.xlsx') || file.name.endsWith('.xls'))) {
      const formData = new FormData();
      formData.append('file', file);

      try {
        setIsLoading(true);
        setMessage(null);

        const response = await axios.post(`${API_BASE_URL}/schedules/upload-excel/`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        if (response.status === 207) {
          setMessage({
            type: 'warning',
            text: response.data.message,
            details: response.data.errors
          });
        } else {
          setMessage({
            type: 'success',
            text: response.data.message || 'Schedule uploaded successfully!'
          });
        }
      } catch (error: any) {
        const errorMsg = error.response?.data?.error || 'An unexpected error occurred during upload.';
        setMessage({ type: 'error', text: errorMsg });
      } finally {
        setIsLoading(false);
      }
    } else {
      setMessage({ type: 'error', text: 'Please upload a valid Excel file (.xlsx or .xls)' });
    }
  };

  const stats = [
    { icon: Calendar, label: 'Schedules', value: '150+', color: 'from-blue-500 to-cyan-500' },
    { icon: Users, label: 'Trainers', value: '25+', color: 'from-purple-500 to-pink-500' },
    { icon: Clock, label: 'Hours Saved', value: '500+', color: 'from-orange-500 to-red-500' },
    // { icon: Star, label: 'Success Rate', value: '99%', color: 'from-green-500 to-emerald-500' },
  ];

  return (
    <div className="min-h-screen bg-background text-text relative overflow-hidden transition-colors duration-300">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Gradient blobs - using brand colors */}
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse bg-gradient-to-br from-purple-500 to-pink-500"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse bg-gradient-to-br from-cyan-500 to-blue-500" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse bg-gradient-to-br from-primary to-accent" style={{ animationDelay: '2s' }}></div>
        
        {/* Floating particles */}
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 rounded-full opacity-20 animate-float bg-primary"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`
            }}
          ></div>
        ))}
      </div>

      <div className="relative z-10 p-6 lg:p-10 max-w-7xl mx-auto">
        
        {/* Hero Header */}
        <div className="text-center mb-12">
          {/* <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border mb-6 backdrop-blur-sm bg-surface/50 border-border">
            <Sparkles className="w-4 h-4 text-accent animate-pulse" />
            <span className="text-muted text-sm font-medium">Powerful Scheduling Made Simple</span>
          </div> */}
          
          <h1 className="text-5xl lg:text-7xl font-black mb-4 tracking-tight gradient-text">
            Schedule Planner
          </h1>
          <p className="text-xl text-muted max-w-2xl mx-auto leading-relaxed">
            Transform your training management with our intelligent bulk import system. 
            <span className="text-primary font-semibold"> Fast and Reliable.</span>
          </p>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
          {stats.map((stat, index) => (
            <div 
              key={index}
              className="relative group"
            >
              <div className={`absolute inset-0 bg-gradient-to-r ${stat.color} rounded-2xl blur-xl opacity-20 group-hover:opacity-40 transition-opacity`}></div>
              <div className="relative bg-surface backdrop-blur-xl rounded-2xl p-6 border border-border hover:border-primary/50 transition-all hover:scale-105 hover:-translate-y-1 shadow-soft">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-3 shadow-lg`}>
                  <stat.icon className="w-5 h-5 text-white" />
                </div>
                <div className="text-3xl font-bold text-text">{stat.value}</div>
                <div className="text-muted text-sm">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-8">
          
          {/* Left Card - Instructions */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative bg-surface backdrop-blur-xl rounded-3xl p-8 border border-border h-full shadow-soft hover:shadow-medium transition-all">
              <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-gradient-to-br from-green-400 to-emerald-600 rounded-2xl shadow-lg">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-text">How It Works</h2>
                  <p className="text-muted text-sm">Simple 3-step process</p>
                </div>
              </div>
              
              <div className="space-y-6">
                {[
                  { 
                    step: 1, 
                    title: 'Download Template', 
                    desc: 'Get the pre-formatted Excel template with all required fields.',
                    color: 'from-blue-500 to-cyan-500',
                    icon: Download
                  },
                  { 
                    step: 2, 
                    title: 'Fill Your Data', 
                    desc: 'Enter schedule details. Check the Reference Data sheet for valid options.',
                    color: 'from-purple-500 to-pink-500',
                    icon: FileSpreadsheet
                  },
                  { 
                    step: 3, 
                    title: 'Upload & Go', 
                    desc: 'Upload your file and watch the magic happen instantly!',
                    color: 'from-orange-500 to-red-500',
                    icon: Zap
                  },
                ].map((item, idx) => (
                  <div key={idx} className="flex gap-4 group/item cursor-pointer">
                    <div className={`flex-shrink-0 w-14 h-14 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center shadow-lg transform group-hover/item:scale-110 group-hover/item:rotate-3 transition-all`}>
                      <item.icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1 pt-1">
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full bg-gradient-to-r ${item.color} text-white`}>
                          STEP {item.step}
                        </span>
                      </div>
                      <h3 className="text-lg font-semibold text-text mt-1 group-hover/item:text-primary transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-muted text-sm mt-1">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pro Tip */}
              <div className="mt-8 p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/30">
                <div className="flex items-start gap-3">
                  <Sparkles className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-amber-600 dark:text-amber-400 font-semibold text-sm">Pro Tip</p>
                    <p className="text-amber-700/70 dark:text-amber-300/70 text-sm">Use the Reference Data sheet in the template to find valid trainer names and categories!</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Card - Upload Area */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative bg-surface backdrop-blur-xl rounded-3xl p-8 border border-border h-full flex flex-col shadow-soft hover:shadow-medium transition-all">
              <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl shadow-lg">
                  <Upload className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-text">Upload Center</h2>
                  <p className="text-muted text-sm">Drag, drop, or click to upload</p>
                </div>
              </div>

              {/* Drag & Drop Zone */}
              <div 
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={handleUploadClick}
                className={`flex-1 relative rounded-2xl border-2 border-dashed transition-all cursor-pointer flex flex-col items-center justify-center min-h-[280px] ${
                  isDragOver 
                    ? 'border-primary bg-primary/10 scale-[1.02]' 
                    : 'border-border hover:border-primary/50 hover:bg-primary/5'
                }`}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept=".xlsx, .xls"
                  className="hidden"
                />
                
                {isLoading ? (
                  <div className="text-center">
                    <div className="relative w-20 h-20 mx-auto mb-4">
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-spin opacity-30"></div>
                      <div className="absolute inset-2 bg-surface rounded-full flex items-center justify-center">
                        <Loader2 className="w-8 h-8 text-primary animate-spin" />
                      </div>
                    </div>
                    <p className="text-text font-semibold text-lg">Processing...</p>
                    <p className="text-muted text-sm mt-1">Please wait while we import your data</p>
                  </div>
                ) : (
                  <>
                    <div className="relative mb-6">
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full blur-xl opacity-50"></div>
                      <div className="relative w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center shadow-2xl transform hover:scale-110 transition-transform">
                        <Upload className="w-8 h-8 text-white" />
                      </div>
                    </div>
                    <p className="text-text font-semibold text-lg mb-1">
                      {isDragOver ? 'Drop your file here!' : 'Drop your Excel file here'}
                    </p>
                    <p className="text-muted text-sm mb-4">or click to browse</p>
                    <div className="flex items-center gap-2 px-4 py-2 bg-background rounded-full border border-border">
                      <FileSpreadsheet className="w-4 h-4 text-green-500" />
                      <span className="text-muted text-sm">Supports .xlsx and .xls files</span>
                    </div>
                  </>
                )}
              </div>

              {/* Action Buttons */}
              <div className="mt-6 space-y-3">
                <button
                  onClick={handleUploadClick}
                  disabled={isLoading}
                  className="w-full relative group/btn overflow-hidden rounded-xl font-semibold disabled:opacity-50 transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 bg-[length:200%_100%] animate-gradient"></div>
                  <div className="relative flex items-center justify-center gap-2 px-6 py-4 text-white">
                    {isLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Upload className="w-5 h-5" />
                        Upload Excel File
                        <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                      </>
                    )}
                  </div>
                </button>

                <button
                  onClick={handleDownloadTemplate}
                  disabled={isLoading}
                  className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-background hover:bg-primary/10 text-text rounded-xl transition-all border border-border hover:border-primary font-semibold disabled:opacity-50 group/dl"
                >
                  <Download className="w-5 h-5 group-hover/dl:animate-bounce" />
                  Download Template
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Status Messages */}
        {message && (
          <div className={`mt-8 rounded-2xl border backdrop-blur-xl p-6 shadow-soft animate-in fade-in slide-in-from-top-2 ${
            message.type === 'error' 
              ? 'bg-red-500/10 border-red-500/30' 
              : message.type === 'warning' 
                ? 'bg-amber-500/10 border-amber-500/30' 
                : 'bg-green-500/10 border-green-500/30'
          }`}>
            <div className="flex items-start gap-4">
              <div className={`p-3 rounded-xl ${
                message.type === 'error' 
                  ? 'bg-red-500/20' 
                  : message.type === 'warning' 
                    ? 'bg-amber-500/20' 
                    : 'bg-green-500/20'
              }`}>
                {message.type === 'error' && <AlertCircle className="w-6 h-6 text-red-500" />}
                {message.type === 'warning' && <AlertCircle className="w-6 h-6 text-amber-500" />}
                {message.type === 'success' && <CheckCircle className="w-6 h-6 text-green-500" />}
              </div>
              
              <div className="flex-1">
                <h3 className={`font-bold text-lg ${
                  message.type === 'error' 
                    ? 'text-red-600 dark:text-red-400' 
                    : message.type === 'warning' 
                      ? 'text-amber-600 dark:text-amber-400' 
                      : 'text-green-600 dark:text-green-400'
                }`}>
                  {message.type === 'success' ? '🎉 Success!' : message.type === 'warning' ? '⚠️ Partial Success' : '❌ Error'}
                </h3>
                <p className="text-text mt-1">{message.text}</p>
                
                {message.details && message.details.length > 0 && (
                  <div className="mt-4 bg-background rounded-xl p-4 max-h-48 overflow-y-auto border border-border scrollbar-thin">
                    <p className="font-medium text-text mb-2 text-sm">Issues found:</p>
                    <ul className="space-y-1">
                      {message.details.map((detail, idx) => (
                        <li key={idx} className="text-sm text-muted flex items-start gap-2">
                          <span className="text-amber-500">•</span>
                          {detail}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <button 
                onClick={() => setMessage(null)}
                className="text-muted hover:text-text transition-colors p-1 hover:bg-background rounded-lg"
              >
                ✕
              </button>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-12 text-center">
          <p className="text-muted text-sm">
            Made with 💜 for efficient schedule management
          </p>
        </div>
      </div>

      {/* CSS for animations */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 0.2; }
          50% { transform: translateY(-20px) rotate(180deg); opacity: 0.5; }
        }
        
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
        
        .animate-gradient {
          animation: gradient 3s ease infinite;
        }
      `}</style>
    </div>
  );
};

export default SchedulePlanner;