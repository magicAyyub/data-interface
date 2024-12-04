import React, { useState } from 'react';
import { Upload, ArrowLeft } from 'lucide-react';

const AddPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const [error, setError] = useState('');

  // Fonction pour traiter le fichier texte
  const handleFileProcess = async () => {
    if (!selectedFile) {
      setError("Veuillez sélectionner un fichier texte (.txt)");
      return;
    }

    setIsLoading(true);
    setError('');

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await fetch('/api/process_file', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error('Erreur lors du traitement du fichier');
      }

      setShowResults(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Fonction pour gérer le téléchargement CSV
  const handleDownloadCSV = async () => {
    try {
      const response = await fetch('/api/download_csv');
      if (!response.ok) throw new Error('Erreur lors du téléchargement');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'processed_data.csv';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError(err.message);
    }
  };

  // Fonction pour charger les données dans la base de données
  const handleLoadData = async () => {
    const tableName = window.prompt('Quel est le nom de table à charger ? (Elle sera créée si elle n\'existe pas.)', 'data');
    if (!tableName) return;

    setIsLoading(true);
    setError('');

    const formData = new FormData();
    formData.append('table_name', tableName);

    try {
      const response = await fetch('/api/load_data', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) throw new Error('Erreur lors du chargement des données');

      alert('Données chargées avec succès dans la base de données.');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Gestion du drag & drop et de la sélection de fichier
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const file = e.dataTransfer.files[0];
    if (file && file.name.endsWith('.txt')) {
      setSelectedFile(file);
      setError('');
    } else {
      setError('Veuillez sélectionner un fichier .txt');
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file && file.name.endsWith('.txt')) {
      setSelectedFile(file);
      setError('');
    } else {
      setError('Veuillez sélectionner un fichier .txt');
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-3xl">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Chargement de nouvelles données
      </h1>

      <div className="bg-white shadow-md rounded-lg p-6 relative">
        {/* Affichage des erreurs */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-500 text-red-700">
            <p className="text-sm">{error}</p>
          </div>
        )}

        {/* Section de téléchargement du fichier */}
        <div className="bg-white p-6 flex flex-col h-[280px] relative">
          <h2 className="text-xl font-semibold mb-4">
            Étape 1 : Téléchargement du fichier texte
          </h2>

          <div className="flex-1 flex flex-col">
            <div
              className={`flex-1 border-2 border-dashed rounded-lg flex flex-col items-center justify-center p-4 bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer ${
                isLoading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
            >
              <input
                type="file"
                accept=".txt"
                onChange={handleFileSelect}
                className="hidden"
                id="txtFile"
                disabled={isLoading}
              />
              <label htmlFor="txtFile" className="cursor-pointer">
                <Upload className="w-8 h-8 mb-2 text-gray-500 mx-auto" />
                <p className="text-center text-gray-600">
                  Cliquer pour télécharger ou glisser-déposer
                  <br />
                  <span className="text-sm text-gray-500">Fichier TXT uniquement</span>
                </p>
                {selectedFile && (
                  <p className="mt-2 text-sm text-gray-500">
                    Fichier sélectionné : {selectedFile.name}
                  </p>
                )}
              </label>
            </div>

            <button
              onClick={handleFileProcess}
              disabled={!selectedFile || isLoading}
              className="mt-4 w-full bg-black text-white p-2 rounded-md hover:bg-gray-800 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Extraction
            </button>
          </div>

          {/* Indicateur de chargement */}
          {isLoading && (
            <div className="mt-4 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
              <p className="mt-2 text-gray-600">Traitement en cours, veuillez patienter...</p>
            </div>
          )}

          {/* Bouton de retour */}
          <a
            href="/"
            className="absolute top-[-40px] left-[-40px] flex items-center justify-center w-12 h-12 bg-black text-white rounded-full hover:bg-gray-800 transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </a>
        </div>
      </div>

      {/* Section des résultats */}
      {showResults && (
        <div className="bg-white shadow-md rounded-lg p-6 mt-6">
          <h2 className="text-xl font-semibold mb-4">
            Étape 2 : Téléchargement et chargement de données
          </h2>
          
          <div className="space-y-4">
            <button
              onClick={handleDownloadCSV}
              className="w-full bg-black text-white p-2 rounded-md hover:bg-gray-800 transition-colors"
            >
              Télécharger en CSV
            </button>

            <button
              onClick={handleLoadData}
              className="w-full border border-black text-black p-2 rounded-md hover:bg-gray-100 transition-colors"
            >
              Charger dans la base de données
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddPage;