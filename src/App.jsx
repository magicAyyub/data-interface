import React, { useState } from 'react';
import { Search, Upload, Hash, Plus } from 'lucide-react';
import SimpleSearchForm from './components/forms/SimpleSearchForm';
import CSVSearchForm from './components/forms/CSVSearchForm';
import RegexSearchForm from './components/forms/RegexSearchForm';

// Composant pour les boutons de type de recherche
const SearchTypeButton = ({ type, icon: Icon, label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`flex items-center justify-center p-4 rounded-lg transition-colors w-full ${
      active 
        ? 'bg-black text-white' 
        : 'bg-white text-gray-800 hover:bg-gray-100 border border-gray-200'
    }`}
  >
    <Icon className="w-5 h-5 mr-2" />
    <span>{label}</span>
  </button>
);

const App = () => {
  // États pour gérer les différentes fonctionnalités
  const [searchType, setSearchType] = useState('simple');
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);

  // Gestionnaire pour la recherche simple et regex
  const handleSearch = async (data) => {
    setIsLoading(true);
    setError('');
    
    try {
      const response = await fetch('/search', {
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
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Gestionnaire pour l'upload de fichier CSV
  const handleFileUpload = async (file) => {
    setIsLoading(true);
    setError('');

    const formData = new FormData();
    formData.append('csv_file', file);

    try {
      const response = await fetch('/fill_csv', {
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
  };

  // Configuration des types de recherche disponibles
  const searchTypes = [
    { type: 'simple', icon: Search, label: 'Simple' },
    { type: 'csv', icon: Upload, label: 'CSV' },
    { type: 'regex', icon: Hash, label: 'Regex' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-3xl font-bold text-center mb-8">
          Interface web de recherche
        </h1>

        {/* Carte principale contenant les formulaires */}
        <div className="bg-white rounded-xl shadow-sm p-6 relative mb-8">
          {/* Affichage des erreurs éventuelles */}
          {error && (
            <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-500 text-red-700">
              <p className="text-sm">{error}</p>
            </div>
          )}

          {/* Section des types de recherche */}
          <div className="mb-6">
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

          {/* Affichage du formulaire en fonction du type sélectionné */}
          <div className="relative">
            {isLoading && (
              <div className="absolute inset-0 bg-white/50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
              </div>
            )}

            {searchType === 'simple' && <SimpleSearchForm onSearch={handleSearch} />}
            {searchType === 'csv' && <CSVSearchForm onFileUpload={handleFileUpload} />}
            {searchType === 'regex' && <RegexSearchForm onSearch={handleSearch} />}
          </div>

          {/* Bouton d'ajout */}
          <a
            href="/add"
            className="absolute top-0 right-0 -mt-4 -mr-4 flex items-center justify-center w-12 h-12 bg-black text-white rounded-full hover:bg-gray-800 transition-colors duration-200 shadow-lg"
          >
            <Plus className="w-6 h-6" />
          </a>
        </div>

        {/* Section des résultats */}
        {results.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">
                Résultats de la recherche
                <span className="ml-2 text-sm bg-purple-100 text-purple-800 px-2 py-1 rounded">
                  {totalResults} résultats
                </span>
              </h2>
            </div>

            {/* Table des résultats */}
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    {/* En-têtes de la table - à adapter selon vos données */}
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nom
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    {/* Ajoutez d'autres colonnes selon vos besoins */}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {results.map((result, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap">{result.nom}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{result.email}</td>
                      {/* Ajoutez d'autres cellules selon vos besoins */}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex justify-center gap-4 mt-4">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 border rounded disabled:opacity-50"
              >
                Précédent
              </button>
              <span className="py-2">Page {currentPage}</span>
              <button
                onClick={() => setCurrentPage(p => p + 1)}
                disabled={results.length < 30}
                className="px-4 py-2 border rounded disabled:opacity-50"
              >
                Suivant
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;