import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const SimpleSearchForm = ({ onSearch }) => {
  const [showMoreFields, setShowMoreFields] = useState(false);
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    dateNaissance: '',
    idCcu: '',
    idUuid: '',
    flexible: false
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(formData);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Styles communs pour les inputs
  const inputClassName = `
  w-full px-3 py-2 border rounded-md shadow-sm 
  focus:outline-none focus:ring-1
  `;

  // Styles pour les labels
  const labelClassName = `
    block 
    text-sm 
    font-semibold 
    text-gray-700 
    mb-1
  `;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className={labelClassName}>Nom</label>
          <input
            type="text"
            name="nom"
            value={formData.nom}
            onChange={handleInputChange}
            className={inputClassName}
            placeholder="Entrez le nom"
          />
        </div>
        <div>
          <label className={labelClassName}>Prénom</label>
          <input
            type="text"
            name="prenom"
            value={formData.prenom}
            onChange={handleInputChange}
            className={inputClassName}
            placeholder="Entrez le prénom"
          />
        </div>
      </div>

      <div>
        <label className={labelClassName}>Email</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          className={inputClassName}
          placeholder="exemple@email.com"
        />
      </div>

      <div className="flex items-center space-x-3">
        <input
          type="checkbox"
          id="like"
          name="like"
          checked={formData.like}
          onChange={handleInputChange}
          className="
            w-5 
            h-5 
            rounded 
            border-2 
            border-gray-300 
            text-black 
            focus:ring-2 
            focus:ring-black 
            focus:ring-opacity-20 
            transition-colors
          "
        />
        <label htmlFor="like" className="text-sm font-medium text-gray-700">
          Recherche flexible
        </label>
      </div>

      <div>
        <button
          type="button"
          onClick={() => setShowMoreFields(!showMoreFields)}
          className="flex items-center text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
        >
          {showMoreFields ? (
            <ChevronUp className="w-4 h-4 mr-2" />
          ) : (
            <ChevronDown className="w-4 h-4 mr-2" />
          )}
          <span>{showMoreFields ? 'Moins de critères' : 'Plus de critères'}</span>
        </button>

        {showMoreFields && (
          <div className="space-y-6 mt-6">
            <div>
              <label className={labelClassName}>Date de naissance</label>
              <input
                type="date"
                name="dateNaissance"
                value={formData.dateNaissance}
                onChange={handleInputChange}
                className={inputClassName}
              />
            </div>
            <div>
              <label className={labelClassName}>ID CCU</label>
              <input
                type="text"
                name="idccu"
                value={formData.idCcu}
                onChange={handleInputChange}
                className={inputClassName}
                placeholder="Entrez l'ID CCU"
              />
            </div>
            <div>
              <label className={labelClassName}>ID UUID</label>
              <input
                type="text"
                name="iduuid"
                value={formData.idUuid}
                onChange={handleInputChange}
                className={inputClassName}
                placeholder="Entrez l'ID UUID"
              />
            </div>
          </div>
        )}
      </div>

      <button
        type="submit"
        className="
          w-full 
          bg-black 
          text-white 
          py-3 
          px-4 
          rounded-lg 
          font-medium 
          hover:bg-gray-800 
          focus:outline-none 
          focus:ring-2 
          focus:ring-black 
          focus:ring-opacity-50 
          transition-colors
        "
      >
        Lancer la recherche
      </button>
    </form>
  );
};

export default SimpleSearchForm;