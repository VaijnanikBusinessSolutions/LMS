'use client';

import React, { useState, useEffect } from "react";
import axios from "axios";
import { Loader2, Save, Trash2, CheckCircle2 } from "lucide-react";

interface Level {
  level_id: number;
  level_name: string;
}

interface DayRequirement {
  id: number;
  level: Level;              // Now it's an object!
  required_days: number;
}

export default function OJTDayConsole() {
  const [levels, setLevels] = useState<Level[]>([]);
  const [requirements, setRequirements] = useState<DayRequirement[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedLevelId, setSelectedLevelId] = useState<number | null>(null);
  const [inputDays, setInputDays] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const API_BASE = "http://localhost:8000";
  const LEVELS_URL = `${API_BASE}/levels/`;
  const DAYS_URL = `${API_BASE}/day-requirements/`;

  const fetchData = async () => {
    try {
      setLoading(true);
      const [levelsRes, daysRes] = await Promise.all([
        axios.get<Level[]>(LEVELS_URL),
        axios.get<DayRequirement[]>(DAYS_URL),
      ]);

      setLevels(levelsRes.data);
      setRequirements(daysRes.data);
    } catch (err) {
      setMessage("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // When level changes → show saved days
  useEffect(() => {
    if (!selectedLevelId) {
      setInputDays("");
      return;
    }
    const req = requirements.find(r => r.level.level_id === selectedLevelId);
    setInputDays(req ? req.required_days.toString() : "");
  }, [selectedLevelId, requirements]);

  const handleSave = async () => {
    if (!selectedLevelId || !inputDays.trim()) return;
    const days = parseInt(inputDays);
    if (isNaN(days) || days < 0) {
      setMessage("Enter valid days");
      return;
    }

    setSaving(true);
    try {
      await axios.post(DAYS_URL, {
        level: selectedLevelId,        // backend expects level_id number
        required_days: days,
      });
      setMessage("Saved successfully!");
      await fetchData();
      setTimeout(() => setMessage(null), 3000);
    } catch {
      setMessage("Save failed");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedLevelId) return;
    const req = requirements.find(r => r.level.level_id === selectedLevelId);
    if (!req || !confirm("Delete this requirement?")) return;

    try {
      await axios.delete(`${DAYS_URL}${req.id}/`);
      setInputDays("");
      setSelectedLevelId(null);
      setMessage("Deleted");
      await fetchData();
    } catch {
      setMessage("Delete failed");
    }
  };

  const currentRequirement = selectedLevelId
    ? requirements.find(r => r.level.level_id === selectedLevelId)
    : null;

  if (loading) {
    return (
      <div className="p-10 text-center">
        <Loader2 className="w-8 h-8 animate-spin mx-auto text-purple-600" />
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto bg-white rounded-2xl shadow-2xl border border-gray-200 p-8">
      <h2 className="text-2xl font-bold text-center mb-8 text-gray-800">
        OJT Day Requirement Console
      </h2>

      {message && (
        <div className={`mb-6 p-4 rounded-lg text-center font-medium flex items-center justify-center gap-2 ${
          message.includes("success") || message === "Deleted"
            ? "bg-green-100 text-green-800"
            : "bg-red-100 text-red-800"
        }`}>
          <CheckCircle2 className="w-5 h-5" />
          {message}
        </div>
      )}

      {/* Level Selector */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Select Level
        </label>
        <select
          value={selectedLevelId ?? ""}
          onChange={(e) => setSelectedLevelId(e.target.value ? Number(e.target.value) : null)}
          className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-purple-300 focus:border-purple-600 outline-none text-lg"
        >
          <option value="">-- Choose Level --</option>
          {levels.map((lvl) => (
            <option key={lvl.level_id} value={lvl.level_id}>
              {lvl.level_name}
            </option>
          ))}
        </select>
      </div>

      {/* Show Saved Data */}
      {currentRequirement && (
        <div className="mb-8 p-6 bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl border-2 border-purple-300 text-center">
          <p className="text-lg font-bold text-purple-800 mb-2">
            {currentRequirement.level.level_name}
          </p>
          <p className="text-5xl font-extrabold text-purple-600">
            {currentRequirement.required_days}
            <span className="text-2xl font-bold ml-2">days</span>
          </p>
          <p className="text-sm text-purple-700 mt-3">Currently Required</p>
        </div>
      )}

      {/* Input New Days */}
      <div className="mb-8">
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          Update Required Days
        </label>
        <input
          type="number"
          min="0"
          value={inputDays}
          onChange={(e) => setInputDays(e.target.value)}
          placeholder="Enter new days"
          className="w-full px-6 py-5 text-3xl font-bold text-center border-2 border-purple-400 rounded-2xl focus:border-purple-600 focus:ring-4 focus:ring-purple-200 outline-none"
          disabled={!selectedLevelId}
        />
      </div>

      {/* Buttons */}
      <div className="flex gap-4">
        <button
          onClick={handleSave}
          disabled={saving || !selectedLevelId || !inputDays.trim()}
          className="flex-1 py-5 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-xl rounded-2xl hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 transition-all flex items-center justify-center gap-3"
        >
          {saving ? <Loader2 className="w-7 h-7 animate-spin" /> : <Save className="w-7 h-7" />}
          {saving ? "Saving..." : "Save"}
        </button>

        {currentRequirement && (
          <button
            onClick={handleDelete}
            className="px-8 py-5 bg-red-600 hover:bg-red-700 text-white font-bold text-xl rounded-2xl transition-all flex items-center gap-3"
          >
            <Trash2 className="w-7 h-7" />
            Delete
          </button>
        )}
      </div>

      <p className="text-center text-sm text-gray-500 mt-6">
        {requirements.length} levels configured
      </p>
    </div>
  );
}