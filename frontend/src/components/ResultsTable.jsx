import React from 'react';
import { Search, AlertCircle } from 'lucide-react';

const ResultsTable = ({ results, columns, currentPage, totalResults }) => {
  const hasSearch = totalResults !== undefined; // Vérifie si une recherche a été effectuée

  if (!results || results.length === 0) {
    if (!hasSearch) return null; // Ne rien afficher si aucune recherche n'a été faite
    
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4">
        <div className="bg-gray-50 rounded-full p-6 mb-6">
          <Search className="w-12 h-12 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Aucun résultat trouvé
        </h3>
        <p className="text-gray-500 text-center max-w-sm">
          Essayez de modifier vos critères de recherche ou d'utiliser des termes plus généraux
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      {/* En-tête des résultats */}
      <div className="flex justify-between items-center mb-4 px-1">
        <div className="flex items-center space-x-2">
          <span className="text-lg font-semibold text-gray-900">
            Résultats
          </span>
          <span className="bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-1 rounded">
            {totalResults} trouvés
          </span>
        </div>
        <span className="text-sm text-gray-500">
          Page {currentPage}
        </span>
      </div>

      {/* Table avec ombre et coins arrondis */}
      <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
        <table className="w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((column) => (
                <th
                  key={column}
                  className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
                >
                  {column}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="bg-white divide-y divide-gray-200">
            {results.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                className="hover:bg-gray-50 transition-colors duration-150 ease-in-out"
              >
                {columns.map((column) => {
                  const value = row[column];
                  // Gestion spéciale pour certains types de données
                  const displayValue = value || '-';
                  
                  return (
                    <td
                      key={`${rowIndex}-${column}`}
                      className="px-6 py-4 whitespace-nowrap"
                    >
                      <div className="flex items-center">
                        <span className="text-sm text-gray-900">
                          {displayValue}
                        </span>
                        {!value && (
                          <AlertCircle className="w-4 h-4 ml-2 text-gray-300" title="Donnée non disponible" />
                        )}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer de la table avec information sur les résultats */}
      <div className="mt-4 px-1 text-sm text-gray-500 flex justify-between items-center">
        <span>
          Affichage des résultats {(currentPage - 1) * 30 + 1} à {Math.min(currentPage * 30, totalResults)}
        </span>
        <span className="text-gray-400">
          Faites défiler horizontalement pour voir toutes les colonnes
        </span>
      </div>
    </div>
  );
};

export default ResultsTable;