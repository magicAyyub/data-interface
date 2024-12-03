import { useState } from 'react';

const RegexSearchForm = ({ onSearch }) => {
    const [pattern, setPattern] = useState('');
    const [isValid, setIsValid] = useState(true);
  
    const validatePattern = (input) => {
      try {
        new RegExp(input);
        return true;
      } catch (e) {
        return false;
      }
    };
  
    const handleSubmit = (e) => {
      e.preventDefault();
      if (validatePattern(pattern)) {
        onSearch({ regex: pattern });
      }
    };
  
    const handlePatternChange = (e) => {
      const newPattern = e.target.value;
      setPattern(newPattern);
      setIsValid(validatePattern(newPattern));
    };
  
    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label 
            htmlFor="regex-pattern" 
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Expression régulière pour les emails
          </label>
          <input
            id="regex-pattern"
            type="text"
            value={pattern}
            onChange={handlePatternChange}
            placeholder="Ex: ^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.com$"
            className={`
              w-full px-3 py-2 border rounded-md shadow-sm 
              focus:outline-none focus:ring-1
              ${isValid 
                ? 'border-gray-300 focus:ring-black focus:border-black' 
                : 'border-red-300 focus:ring-red-500 focus:border-red-500'
              }
            `}
          />
          {!isValid && pattern && (
            <p className="mt-1 text-sm text-red-600">
              Expression régulière invalide
            </p>
          )}
          <p className="mt-1 text-xs text-gray-500">
            Entrez une expression régulière valide pour rechercher des adresses email
          </p>
        </div>
  
        <button
          type="submit"
          disabled={!pattern || !isValid}
          className={`
            w-full px-4 py-2 rounded-md transition-colors duration-200
            ${pattern && isValid
              ? 'bg-black text-white hover:bg-gray-800'
              : 'bg-gray-200 text-gray-500 cursor-not-allowed'
            }
          `}
        >
          Lancer la recherche
        </button>
      </form>
    );
  };

export default RegexSearchForm;