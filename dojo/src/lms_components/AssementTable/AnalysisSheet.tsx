import React, { useMemo, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { DUMMY_DATA } from './data';

// --- HELPER COMPONENT: Level Tracker ---
const LevelTracker = ({ 
  score, 
  label, 
  icon,
  selectedLevel,
  onLevelChange
}: { 
  score: number; 
  label: string; 
  icon: React.ReactNode;
  selectedLevel: number;
  onLevelChange: (level: number) => void;
}) => {
  
  const levelConfig = {
    1: { name: 'Beginner', gradient: 'from-rose-500 to-pink-600' },
    2: { name: 'Developing', gradient: 'from-amber-500 to-orange-600' },
    3: { name: 'Proficient', gradient: 'from-emerald-500 to-teal-600' },
    4: { name: 'Expert', gradient: 'from-violet-500 to-purple-600' },
  };

  return (
    <div className="bg-surface rounded-2xl p-6 shadow-sm border border-border hover:shadow-md transition-shadow duration-300">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-background flex items-center justify-center text-muted border border-border">
            {icon}
          </div>
          <div>
            <h4 className="font-semibold text-text">{label}</h4>
            <p className="text-xs text-muted">Click to select level</p>
          </div>
        </div>
        <div className="text-right">
          <span className={`text-3xl font-bold bg-gradient-to-r ${levelConfig[selectedLevel as keyof typeof levelConfig].gradient} bg-clip-text text-transparent`}>
            {score}%
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="h-2 bg-background rounded-full overflow-hidden border border-border/50">
          <div 
            className={`h-full bg-gradient-to-r ${levelConfig[selectedLevel as keyof typeof levelConfig].gradient} rounded-full transition-all duration-700 ease-out`}
            style={{ width: `${score}%` }}
          />
        </div>
      </div>

      {/* The 4 Level Boxes - Now Clickable */}
      <div className="grid grid-cols-4 gap-3">
        {[1, 2, 3, 4].map((level) => {
          const isActive = level === selectedLevel;
          const isPast = level < selectedLevel;
          const config = levelConfig[level as keyof typeof levelConfig];
          
          return (
            <div 
              key={level}
              onClick={() => onLevelChange(level)}
              className={`
                relative rounded-xl p-3 flex flex-col items-center justify-center transition-all duration-300 cursor-pointer
                ${isActive 
                  ? `bg-gradient-to-br ${config.gradient} text-white shadow-lg scale-105` 
                  : isPast 
                    ? 'bg-background text-text border border-border hover:border-violet-400 hover:shadow-md' 
                    : 'bg-background/50 text-muted border border-transparent hover:border-violet-400 hover:shadow-md'
                }
                hover:scale-105
              `}
            >
              <span className={`text-[10px] font-medium uppercase tracking-wide ${isActive ? 'text-white/80' : ''}`}>
                Level
              </span>
              <span className={`text-2xl font-bold ${isActive ? 'text-white' : ''}`}>{level}</span>
              <span className={`text-[9px] font-medium mt-1 ${isActive ? 'text-white/90' : 'text-muted'}`}>
                {config.name}
              </span>

              {/* Check mark for active */}
              {isActive && (
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-surface rounded-full shadow-md flex items-center justify-center border border-border">
                  <svg className={`w-3.5 h-3.5 text-text`} fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" className="stroke-current text-violet-600"></path>
                  </svg>
                </div>
              )}

              {/* Completed indicator for past levels */}
              {isPast && (
                <div className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center shadow-sm">
                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

// --- Stat Card Component ---
const StatCard = ({ label, value, icon, gradient }: { label: string; value: string; icon: React.ReactNode; gradient: string }) => (
  <div className="bg-surface rounded-xl p-4 shadow-sm border border-border hover:shadow-md transition-all duration-300 hover:-translate-y-0.5">
    <div className="flex items-center gap-3">
      <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${gradient} flex items-center justify-center text-white shadow-sm`}>
        {icon}
      </div>
      <div>
        <p className="text-xs text-muted font-medium">{label}</p>
        <p className="text-lg font-bold text-text">{value}</p>
      </div>
    </div>
  </div>
);

// --- MAIN PAGE COMPONENT ---
export default function AnalysisSheet() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const employeeId = searchParams.get('id');

  const employee = useMemo(() => {
    return DUMMY_DATA.find(e => e.id === employeeId);
  }, [employeeId]);

  // Helper function to get initial level from score
  const getInitialLevel = (score: number) => {
    if (score >= 90) return 4;
    if (score >= 75) return 3;
    if (score >= 50) return 2;
    return 1;
  };

  // State for selected levels
  const [preTestLevel, setPreTestLevel] = useState<number>(() => 
    employee ? getInitialLevel(employee.assessment.preTestScore) : 1
  );
  const [postTestLevel, setPostTestLevel] = useState<number>(() => 
    employee ? getInitialLevel(employee.assessment.postTestScore) : 1
  );
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Handle save/submit
  const handleSubmit = async () => {
    setIsSaving(true);
    setSaveSuccess(false);
    
    // Simulate API call - replace with your actual save logic
    try {
      // Example: await saveEmployeeLevels(employeeId, preTestLevel, postTestLevel);
      console.log('Saving levels:', {
        employeeId,
        preTestLevel,
        postTestLevel
      });
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error('Error saving levels:', error);
    } finally {
      setIsSaving(false);
    }
  };

  if (!employee) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background">
        <div className="text-center p-8 bg-surface rounded-2xl shadow-xl border border-border">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-background border border-border flex items-center justify-center">
            <svg className="w-8 h-8 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-text mb-2">Employee Not Found</h2>
          <p className="text-muted mb-6">The employee you're looking for doesn't exist.</p>
          <button 
            onClick={() => navigate(-1)} 
            className="px-6 py-2.5 bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-medium rounded-lg hover:from-violet-700 hover:to-indigo-700 transition-all duration-200 shadow-md hover:shadow-lg"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const improvement = employee.assessment.postTestScore - employee.assessment.preTestScore;
  const isPositiveGrowth = improvement >= 0;

  return (
    <div className="min-h-screen bg-background text-text">
      <div className="relative py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          
          {/* HEADER / NAV */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-text">Assessment Report</h2>
              <p className="text-muted text-sm mt-1">Detailed analysis and performance metrics</p>
            </div>
            <button 
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-text bg-surface hover:bg-background rounded-xl transition-all duration-200 shadow-sm border border-border hover:shadow-md"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back
            </button>
          </div>

          {/* MAIN CARD */}
          <div className="bg-surface rounded-3xl shadow-xl border border-border overflow-hidden">
            
            {/* EMPLOYEE HERO SECTION */}
            <div className="relative p-8 bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 overflow-hidden">
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-10">
                <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                  <defs>
                    <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                      <path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" strokeWidth="0.5"/>
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#grid)" />
                </svg>
              </div>

              <div className="relative flex flex-col lg:flex-row items-center lg:items-start gap-6">
                {/* Avatar */}
                <div className="relative">
                  <div className="w-24 h-24 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-white font-bold text-4xl shadow-2xl border border-white/30">
                    {employee.name.charAt(0)}
                  </div>
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center shadow-lg border-2 border-white">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>

                {/* Info */}
                <div className="text-center lg:text-left flex-1">
                  <h1 className="text-3xl font-bold text-white mb-1">{employee.name}</h1>
                  <p className="text-white/80 text-lg mb-4">{employee.email}</p>
                  <div className="flex flex-wrap justify-center lg:justify-start gap-2">
                    <span className="px-4 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wide bg-white/20 backdrop-blur-sm text-white border border-white/30">
                      {employee.group}
                    </span>
                    <span className="px-4 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wide bg-white/20 backdrop-blur-sm text-white border border-white/30">
                      📚 {employee.course}
                    </span>
                  </div>
                </div>
                
                {/* Growth Badge */}
                <div className={`${isPositiveGrowth ? 'bg-emerald-500/20' : 'bg-rose-500/20'} backdrop-blur-sm px-8 py-5 rounded-2xl border ${isPositiveGrowth ? 'border-emerald-400/30' : 'border-rose-400/30'} text-center`}>
                  <span className="text-white/80 font-medium text-xs uppercase tracking-wider block mb-1">Total Growth</span>
                  <span className={`text-4xl font-black text-white flex items-center justify-center gap-1`}>
                    {isPositiveGrowth ? (
                      <svg className="w-6 h-6 text-emerald-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 10l7-7m0 0l7 7m-7-7v18" />
                      </svg>
                    ) : (
                      <svg className="w-6 h-6 text-rose-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                      </svg>
                    )}
                    {improvement}%
                  </span>
                </div>
              </div>
            </div>

            {/* STATS ROW */}
            <div className="px-8 py-6 bg-background border-b border-border">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <StatCard 
                  label="Pre-Test Score" 
                  value={`${employee.assessment.preTestScore}%`}
                  icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                  gradient="from-amber-400 to-orange-500"
                />
                <StatCard 
                  label="Post-Test Score" 
                  value={`${employee.assessment.postTestScore}%`}
                  icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" /></svg>}
                  gradient="from-emerald-400 to-teal-500"
                />
                <StatCard 
                  label="Improvement" 
                  value={`+${improvement}%`}
                  icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>}
                  gradient="from-violet-400 to-purple-500"
                />
                <StatCard 
                  label="Status" 
                  value={employee.assessment.postTestScore >= 75 ? "Passed" : "In Progress"}
                  icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>}
                  gradient="from-cyan-400 to-blue-500"
                />
              </div>
            </div>

            {/* LEVEL ANALYSIS SECTION */}
            <div className="p-8 bg-surface">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white shadow-md">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-text">Level Progression</h3>
                    <p className="text-muted text-sm">Select levels for pre and post assessment</p>
                  </div>
                </div>

                {/* Success Message */}
                {saveSuccess && (
                  <div className="flex items-center gap-2 px-4 py-2 bg-emerald-100 text-emerald-700 rounded-lg border border-emerald-200">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-sm font-medium">Levels saved successfully!</span>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <LevelTracker 
                  score={employee.assessment.preTestScore} 
                  label="Pre-Test Results"
                  icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                  selectedLevel={preTestLevel}
                  onLevelChange={setPreTestLevel}
                />
                <LevelTracker 
                  score={employee.assessment.postTestScore} 
                  label="Post-Test Results"
                  icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" /></svg>}
                  selectedLevel={postTestLevel}
                  onLevelChange={setPostTestLevel}
                />
              </div>

              {/* Submit Button */}
              <div className="mt-8 flex justify-center">
                <button
                  onClick={handleSubmit}
                  disabled={isSaving}
                  className="flex items-center gap-3 px-8 py-3 bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-violet-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isSaving ? (
                    <>
                      <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Saving...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      Save Levels
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* LEGEND / FOOTER */}
            <div className="px-8 pb-8 bg-surface">
              <div className="p-5 bg-background rounded-2xl border border-border">
                <div className="flex flex-wrap items-center justify-center gap-8 text-sm">
                  <span className="font-bold text-muted uppercase tracking-wider text-xs">Level Guide:</span>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-md bg-gradient-to-br from-rose-500 to-pink-600 shadow-sm"></div>
                    <span className="text-muted">Level 1 - Beginner</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-md bg-gradient-to-br from-amber-500 to-orange-600 shadow-sm"></div>
                    <span className="text-muted">Level 2 - Developing</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-md bg-gradient-to-br from-emerald-500 to-teal-600 shadow-sm"></div>
                    <span className="text-muted">Level 3 - Proficient</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-md bg-gradient-to-br from-violet-500 to-purple-600 shadow-sm"></div>
                    <span className="text-muted">Level 4 - Expert</span>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Footer Credit */}
          <div className="text-center mt-8 text-muted text-sm">
            Generated by Assessment Analytics System • {new Date().toLocaleDateString()}
          </div>

        </div>
      </div>
    </div>
  );
}