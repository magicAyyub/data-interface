import React, { useState, useCallback } from 'react';
import { Search, Upload, Hash, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import SimpleSearchForm from './components/forms/SimpleSearchForm';
import CSVSearchForm from './components/forms/CSVSearchForm';
import RegexSearchForm from './components/forms/RegexSearchForm';
import ResultsTable from './components/results/ResultsTable';

// Liste des colonnes à afficher dans la table des résultats
const columnOrderResponse = await fetch('src/utils/jsons/db_columns.json');
const TABLE_COLUMNS = await columnOrderResponse.json();

// Composant pour les boutons de type de recherche
const SearchTypeButton = ({ type, icon: Icon, label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`
      flex items-center justify-center p-4 rounded-lg transition-all duration-200 w-full
      ${active 
        ? 'bg-black text-white transform scale-105' 
        : 'bg-white text-gray-800 hover:bg-gray-100 border-2 border-gray-200 hover:border-gray-300'
      }
    `}
  >
    <Icon className="w-5 h-5 mr-2" />
    <span className="font-medium">{label}</span>
  </button>
);

const App = () => {
  // États de l'application
  const [searchType, setSearchType] = useState('simple');
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [searchCount, setSearchCount] = useState(0);

  // Gestionnaire de recherche principale
  const handleSearch = useCallback(async (data) => {
    setIsLoading(true);
    setError('');
    
    try {
      const response = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          page: currentPage,
          limit: 30
        })
      });
      
      if (!response.ok) {
        throw new Error('Erreur lors de la recherche');
      }
      
      const result = await response.json();
      setResults(result.results);
      setTotalResults(result.total_count);
      setSearchCount(prev => prev + 1);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage]);

  // Gestionnaire pour l'upload de fichier CSV
  const handleCSVUpload = useCallback(async (file) => {
    setIsLoading(true);
    setError('');

    const formData = new FormData();
    formData.append('csv_file', file);

    try {
      const response = await fetch('/api/fill_csv', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error('Erreur lors du traitement du fichier');
      }

      // Téléchargement automatique du fichier résultant
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'resultats.csv';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Configuration des types de recherche disponibles
  const searchTypes = [
    { type: 'simple', icon: Search, label: 'Simple' },
    { type: 'csv', icon: Upload, label: 'CSV' },
    { type: 'regex', icon: Hash, label: 'Regex' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* En-tête de la page */}
        <h1 className="text-3xl font-bold text-center mb-8">
          Interface web de recherche
        </h1>

        {/* Section principale de recherche */}
        <div className="bg-white rounded-xl shadow-sm p-6 relative mb-8">
          {/* Affichage des erreurs */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Sélection du type de recherche */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Type de recherche</h2>
            <div className="grid grid-cols-3 gap-4">
              {searchTypes.map(({ type, icon, label }) => (
                <SearchTypeButton
                  key={type}
                  type={type}
                  icon={icon}
                  label={label}
                  active={searchType === type}
                  onClick={() => setSearchType(type)}
                />
              ))}
            </div>
          </div>

          {/* Zone des formulaires avec indicateur de chargement */}
          <div className="relative">
            {isLoading && (
              <div className="absolute inset-0 bg-white/50 backdrop-blur-sm flex items-center justify-center rounded-lg z-50">
                <div className="flex flex-col items-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
                  <p className="mt-4 text-sm text-gray-600">Chargement en cours...</p>
                </div>
              </div>
            )}

            {searchType === 'simple' && <SimpleSearchForm onSearch={handleSearch} />}
            {searchType === 'csv' && <CSVSearchForm onFileUpload={handleCSVUpload} />}
            {searchType === 'regex' && <RegexSearchForm onSearch={handleSearch} />}
          </div>

          {/* Bouton d'ajout flottant */}
          <Link
            to="/add"
            className="absolute top-0 right-0 -mt-4 -mr-4 flex items-center justify-center w-12 h-12 bg-black text-white rounded-full hover:bg-gray-800 transition-colors duration-200 shadow-lg transform hover:scale-105"
          >
            <Plus className="w-6 h-6" />
          </Link>
        </div>
        
        {/* Section des résultats - Toujours visible après une recherche */}
        {(searchCount > 0 || isLoading) && (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <ResultsTable
              results={results}
              columns={TABLE_COLUMNS}
              currentPage={currentPage}
              totalResults={totalResults}
            />

            {/* Pagination - visible uniquement s'il y a des résultats */}
            {results.length > 0 && (
              <div className="flex justify-center gap-4 mt-6">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1 || isLoading}
                  className="px-4 py-2 border-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                >
                  Précédent
                </button>
                <span className="py-2 px-4 bg-gray-50 rounded-lg font-medium">
                  Page {currentPage}
                </span>
                <button
                  onClick={() => setCurrentPage(p => p + 1)}
                  disabled={results.length < 30 || isLoading}
                  className="px-4 py-2 border-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                >
                  Suivant
                </button>
              </div>
            )}
          </div>
        )}
 

        {/* Compteur de recherches */}
        {searchCount > 0 && (
          <div className="text-center mt-8">
            <span className="text-sm text-gray-500">
              {searchCount} recherche{searchCount > 1 ? 's' : ''} effectuée{searchCount > 1 ? 's' : ''}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;