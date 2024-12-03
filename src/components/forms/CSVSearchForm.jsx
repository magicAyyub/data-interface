import React, { useState } from 'react';
import { Upload } from 'lucide-react';

// Composant pour la recherche CSV
const CSVSearchForm = ({ onFileUpload }) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  // Gestion des événements de drag & drop
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(e.type === "dragenter" || e.type === "dragover");
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const file = e.dataTransfer.files[0];
    if (file && file.name.endsWith('.csv')) {
      setSelectedFile(file);
      onFileUpload(file);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file && file.name.endsWith('.csv')) {
      setSelectedFile(file);
      onFileUpload(file);
    }
  };

  return (
    <div>
      <div
        className={`
          border-2 border-dashed rounded-lg p-8 text-center
          transition-colors duration-200 ease-in-out
          ${dragActive 
            ? 'border-black bg-gray-50' 
            : 'border-gray-300 hover:border-gray-400'
          }
        `}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          accept=".csv"
          onChange={handleFileSelect}
          className="hidden"
          id="csv-upload"
        />
        <label
          htmlFor="csv-upload"
          className="cursor-pointer flex flex-col items-center"
        >
          <Upload className="w-12 h-12 text-gray-400 mb-4" />
          <p className="text-sm text-gray-600 mb-2">
            Cliquez pour sélectionner un fichier CSV
            <br />
            ou glissez-déposez le ici
          </p>
          {selectedFile && (
            <p className="mt-2 text-sm text-gray-500">
              Fichier sélectionné : {selectedFile.name}
            </p>
          )}
        </label>
      </div>
      
      <button
        type="button"
        disabled={!selectedFile}
        className={`
          w-full mt-4 px-4 py-2 rounded-md transition-colors duration-200
          ${selectedFile
            ? 'bg-black text-white hover:bg-gray-800'
            : 'bg-gray-200 text-gray-500 cursor-not-allowed'
          }
        `}
        onClick={() => selectedFile && onFileUpload(selectedFile)}
      >
        Charger le fichier CSV
      </button>
    </div>
  );
};
export default CSVSearchForm;