import React from 'react';
import { Search, Upload, Hash } from 'lucide-react';

// Composant pour un bouton individuel du sélecteur de type
const SearchTypeButton = ({ type, icon: Icon, label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`flex flex-col items-center p-4 rounded-lg transition-colors ${
      active ? 'bg-black text-white' : 'bg-white text-gray-800 hover:bg-gray-100'
    }`}
  >
    <Icon className="w-6 h-6 mb-2" />
    <span>{label}</span>
  </button>
);

// Composant principal qui gère la sélection du type de recherche
const SearchTypeSelector = ({ activeType, onTypeChange }) => {
  // Configuration des différents types de recherche
  const searchTypes = [
    { type: 'simple', icon: Search, label: 'Simple' },
    { type: 'csv', icon: Upload, label: 'CSV' },
    { type: 'regex', icon: Hash, label: 'Regex' }
  ];

  return (
    <div className="mb-6">
      <h2 className="text-xl font-semibold mb-4">Type de recherche</h2>
      <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
        {searchTypes.map(({ type, icon, label }) => (
          <SearchTypeButton
            key={type}
            type={type}
            icon={icon}
            label={label}
            active={activeType === type}
            onClick={() => onTypeChange(type)}
          />
        ))}
      </div>
    </div>
  );
};

export default SearchTypeSelector;