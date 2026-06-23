import React, { useState } from "react";

const BulkQuestionsrevision: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = () => {
    if (!file) return;
    console.log("Uploading file:", file.name);
    // TODO: Add actual upload logic here
  };

  return (
    <div className="p-6 max-w-3xl mx-auto animate-in fade-in duration-300">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Bulk Questions Revision</h1>

      <div className="p-5 border rounded-xl shadow-sm bg-white">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Upload Questions File (Excel / CSV)
        </label>

        <input
          type="file"
          accept=".xlsx, .csv"
          onChange={handleFileChange}
          className="mb-4 block w-full text-sm border rounded-md p-2"
        />

        <button
          onClick={handleUpload}
          className="px-5 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all shadow"
        >
          Upload
        </button>

        {file && (
          <p className="mt-3 text-sm text-gray-700">Selected File: {file.name}</p>
        )}
      </div>
    </div>
  );
};

export default BulkQuestionsrevision;