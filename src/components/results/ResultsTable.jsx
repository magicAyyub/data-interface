import React from 'react';

const ResultsTable = ({ results, columns }) => {
  // Si aucun résultat n'est fourni, on affiche un message
  if (!results || results.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        Aucun résultat trouvé
      </div>
    );
  }

  return (
    <div className="overflow-x-auto relative">
      <table className="w-full text-sm text-left text-gray-500">
        {/* En-tête de la table avec les noms des colonnes */}
        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
          <tr>
            {columns.map((column) => (
              <th
                key={column}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                {column}
              </th>
            ))}
          </tr>
        </thead>

        {/* Corps de la table avec les données */}
        <tbody className="bg-white divide-y divide-gray-200">
          {results.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              className="hover:bg-gray-50 transition-colors"
            >
              {columns.map((column) => (
                <td
                  key={`${rowIndex}-${column}`}
                  className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                >
                  {row[column] || ''}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ResultsTable;