
// src/components/LevelSelector.tsx
import { useState } from "react";
import Level2OJTStatusList from "./Level2OJTStatusList";
import Level3OJTStatusList from "./Level3OJTStatusList";
import Level4OJTStatusList from "./Level4OJTStatusList"; // Import Level 4
import ErrorBoundary from "./ErrorBoundary";

const LevelSelector = () => {
  const [selectedLevel, setSelectedLevel] = useState<"level2" | "level3" | "level4">("level2");

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-2xl mx-auto mb-6">
        <select
          value={selectedLevel}
          onChange={(e) => setSelectedLevel(e.target.value as any)}
          className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
        >
          <option value="">-- Select Level --</option>
          <option value="level2">Level 2</option>
          <option value="level3">Level 3</option>
          <option value="level4">Level 4</option>
        </select>
      </div>

      {selectedLevel === "level2" && <Level2OJTStatusList />}
      {selectedLevel === "level3" && (
        <ErrorBoundary>
          <Level3OJTStatusList />
        </ErrorBoundary>
      )}
      {selectedLevel === "level4" && (
        <ErrorBoundary>
          <Level4OJTStatusList />
        </ErrorBoundary>
      )}
    </div>
  );
};

export default LevelSelector;