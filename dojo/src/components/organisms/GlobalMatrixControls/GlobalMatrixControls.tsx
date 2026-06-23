import React, { useEffect, useState } from 'react';
import {
  Zap,
  Target,
  Repeat,
  Settings,
  CheckCircle,
  RefreshCw,
  Flag,
  X,
} from 'lucide-react';

type SheetKey = 'ojt' | 'tenCycle' | 'skillEvaluation' | 'others' | 'evaluation';

const sheetMap: { key: SheetKey; label: string; field: string; backendKey: string; icon?: React.ElementType }[] = [
  { key: 'ojt', label: 'OJT', field: 'ojt_enabled', backendKey: 'ojt', icon: Target },
  { key: 'tenCycle', label: '10 Cycle', field: 'ten_cycle_enabled', backendKey: 'ten_cycle', icon: Repeat },
  { key: 'skillEvaluation', label: 'Skill Evaluation', field: 'skill_evaluation_enabled', backendKey: 'skill_evaluation', icon: Zap },
  { key: 'others', label: 'Others', field: 'others_enabled', backendKey: 'others', icon: Settings },
  { key: 'evaluation', label: 'Evaluation', field: 'evaluation_enabled', backendKey: 'evaluation', icon: CheckCircle },
];

const API_BASE = 'http://localhost:8000';
const CONFIGS_BASE = `${API_BASE}/station-sheet-configs`;

export default function GlobalMatrixControls() {
  const [opError, setOpError] = useState<string | null>(null);
  const [busySheet, setBusySheet] = useState<string | null>(null);
  const [busyGlobal, setBusyGlobal] = useState<boolean>(false);
  const [sheetStates, setSheetStates] = useState<Record<string, boolean>>({});

  async function setSheetGlobally(backendKey: string, enable: boolean) {
    const url = `${CONFIGS_BASE}/global-toggle/`;
    try {
      setBusySheet(backendKey);
      setOpError(null);

      const resp = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sheet: backendKey, enable }),
      });

      const json = await resp.json().catch(() => ({}));
      if (!resp.ok) {
        const msg = json?.detail || json?.error || JSON.stringify(json) || resp.statusText;
        throw new Error(msg);
      }

      setSheetStates(prev => ({ ...prev, [backendKey]: enable }));
    } catch (err: any) {
      console.error('setSheetGlobally error', err);
      setOpError(typeof err === 'string' ? err : err?.message || 'Failed to update');
    } finally {
      setBusySheet(null);
    }
  }

  async function callGlobalEnableAll() {
    setOpError(null);
    // setOperationMessage(null);
    setBusyGlobal(true);

    const results: { key: string; ok: boolean; msg?: string }[] = [];

    try {
      for (const s of sheetMap) {
        try {
          const resp = await fetch(`${CONFIGS_BASE}/global-toggle/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ sheet: s.backendKey, enable: true }),
          });
          const json = await resp.json().catch(() => ({}));
          if (!resp.ok) {
            const msg = json?.detail || json?.error || JSON.stringify(json) || resp.statusText;
            results.push({ key: s.backendKey, ok: false, msg });
          } else {
            results.push({ key: s.backendKey, ok: true, msg: json.detail || 'OK' });
          }
        } catch (e: any) {
          results.push({ key: s.backendKey, ok: false, msg: e?.message || 'Network error' });
        }
      }

      const failed = results.filter(r => !r.ok);
      if (failed.length > 0) {
        setOpError(`Some failed: ${failed.map(f => `${f.key}(${f.msg})`).join(', ')}`);
      } else {
        // Update all states to enabled
        const newStates: Record<string, boolean> = {};
        sheetMap.forEach(s => { newStates[s.backendKey] = true; });
        setSheetStates(newStates);
      }
    } catch (err: any) {
      console.error('callGlobalEnableAll error', err);
      setOpError(err?.message || 'Failed to enable all');
    } finally {
      setBusyGlobal(false);
    }
  }

  async function callGlobalDisableAll() {
    setOpError(null);
    setBusyGlobal(true);

    const results: { key: string; ok: boolean; msg?: string }[] = [];

    try {
      for (const s of sheetMap) {
        try {
          const resp = await fetch(`${CONFIGS_BASE}/global-toggle/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ sheet: s.backendKey, enable: false }),
          });
          const json = await resp.json().catch(() => ({}));
          if (!resp.ok) {
            const msg = json?.detail || json?.error || JSON.stringify(json) || resp.statusText;
            results.push({ key: s.backendKey, ok: false, msg });
          } else {
            results.push({ key: s.backendKey, ok: true, msg: json.detail || 'OK' });
          }
        } catch (e: any) {
          results.push({ key: s.backendKey, ok: false, msg: e?.message || 'Network error' });
        }
      }

      const failed = results.filter(r => !r.ok);
      if (failed.length > 0) {
        setOpError(`Some failed: ${failed.map(f => `${f.key}(${f.msg})`).join(', ')}`);
      } else {
        // Update all states to disabled
        const newStates: Record<string, boolean> = {};
        sheetMap.forEach(s => { newStates[s.backendKey] = false; });
        setSheetStates(newStates);
      }
    } catch (err: any) {
      console.error('callGlobalDisableAll error', err);
      setOpError(err?.message || 'Failed to disable all');
    } finally {
      setBusyGlobal(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-100 to-green-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mb-6 shadow-lg">
            <Flag className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-5xl font-extrabold bg-gradient-to-r from-gray-800 via-gray-700 to-gray-600 bg-clip-text text-transparent mb-3">
            Global Sheet Controls
          </h1>
          <p className="text-gray-600 text-lg">
            Manage sheet flags across all stations with one click
          </p>
          
          {/* Global Action Buttons */}
          {/* <div className="flex items-center justify-center gap-4 mt-8">
            <button
              onClick={callGlobalEnableAll}
              disabled={busyGlobal}
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-2xl font-bold shadow-xl hover:from-green-700 hover:to-emerald-700 focus:outline-none focus:ring-4 focus:ring-green-500/30 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none gap-3"
            >
              {busyGlobal ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                  Working...
                </>
              ) : (
                <>
                  <CheckCircle className="w-5 h-5" />
                  Enable ALL Flags
                </>
              )}
            </button>

            <button
              onClick={callGlobalDisableAll}
              disabled={busyGlobal}
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-red-600 to-rose-600 text-white rounded-2xl font-bold shadow-xl hover:from-red-700 hover:to-rose-700 focus:outline-none focus:ring-4 focus:ring-red-500/30 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none gap-3"
            >
              {busyGlobal ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                  Working...
                </>
              ) : (
                <>
                  <X className="w-5 h-5" />
                  Disable ALL Flags
                </>
              )}
            </button>
          </div> */}
        </div>

        {/* Error Message */}
        {opError && (
          <div className="mb-8 bg-red-50/90 backdrop-blur-md border border-red-200/50 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center">
              <div className="flex-shrink-0 w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <X className="h-5 w-5 text-red-500" />
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-semibold text-red-800">Error occurred</h3>
                <p className="text-red-700 mt-1">{opError}</p>
              </div>
            </div>
          </div>
        )}

        {/* Sheet Cards Grid */}
        <div className="grid gap-6 mb-12">
          {sheetMap.map(sheet => {
            const Icon = sheet.icon || Target;
            const isProcessing = busySheet === sheet.backendKey;
            const isEnabled = sheetStates[sheet.backendKey] || false;
            
            return (
              <div 
                key={sheet.key} 
                className="group bg-white/30 backdrop-blur-md rounded-3xl p-8 border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-500 hover:bg-white/40"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-6">
                    <div className={`p-4 rounded-2xl transition-all duration-300 group-hover:scale-110 ${
                      sheet.key === 'ojt' 
                        ? 'bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/25'
                        : sheet.key === 'tenCycle'
                        ? 'bg-gradient-to-br from-emerald-500 to-teal-500 shadow-lg shadow-emerald-500/25'
                        : sheet.key === 'skillEvaluation'
                        ? 'bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg shadow-purple-500/25'
                        : sheet.key === 'others'
                        ? 'bg-gradient-to-br from-orange-400 to-yellow-500 shadow-lg shadow-orange-500/25'
                        : 'bg-gradient-to-br from-pink-500 to-rose-500 shadow-lg shadow-pink-500/25'
                    }`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-800 mb-1">
                        {sheet.label}
                      </h3>
                      <p className="text-gray-600 text-sm">
                        Apply this sheet across all stations
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-6">
                    {/* Toggle Switch */}
                    <div className="relative">
                      <button
                        onClick={() => setSheetGlobally(sheet.backendKey, !isEnabled)}
                        disabled={isProcessing}
                        className={`relative inline-flex h-8 w-16 items-center rounded-full transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${
                          isEnabled
                            ? 'bg-gradient-to-r from-green-400 to-emerald-500 focus:ring-green-500/30 shadow-lg shadow-green-500/25'
                            : 'bg-gradient-to-r from-gray-300 to-gray-400 focus:ring-gray-500/30 shadow-md'
                        }`}
                      >
                        <span
                          className={`inline-block h-6 w-6 transform rounded-full bg-white shadow-lg transition-all duration-300 ${
                            isEnabled ? 'translate-x-9' : 'translate-x-1'
                          }`}
                        />
                      </button>
                      
                      {isProcessing && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                        </div>
                      )}
                    </div>
                    
                    <div className="text-sm font-semibold">
                      <span className={`${isEnabled ? 'text-green-700' : 'text-gray-600'} transition-colors duration-300`}>
                        {isEnabled ? 'Enabled' : 'Disabled'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer Note */}
        {/* <div className="text-center">
          <div className="inline-block bg-white/30 backdrop-blur-md rounded-2xl px-6 py-4 border border-white/20 shadow-lg">
            <p className="text-sm text-gray-600">
              Note: Update <code className="bg-gray-200/50 px-2 py-1 rounded font-mono text-xs">API_BASE</code> and endpoint paths in the code to match your backend if necessary.
            </p>
          </div>
        </div> */}
      </div>
    </div>
  );
}