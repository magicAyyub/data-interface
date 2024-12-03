import { useState } from 'react';
import { ChevronDown, ChevronUp, Upload } from 'lucide-react';

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

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Nom</label>
          <input
            type="text"
            name="nom"
            value={formData.nom}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Prénom</label>
          <input
            type="text"
            name="prenom"
            value={formData.prenom}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Email</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black"
        />
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          name="flexible"
          checked={formData.flexible}
          onChange={handleInputChange}
          className="rounded border-gray-300 text-black focus:ring-black"
        />
        <label className="ml-2 text-sm text-gray-700">Recherche flexible</label>
      </div>

      <button
        type="button"
        onClick={() => setShowMoreFields(!showMoreFields)}
        className="flex items-center text-sm text-gray-600 hover:text-gray-900"
      >
        {showMoreFields ? <ChevronUp className="w-4 h-4 mr-1" /> : <ChevronDown className="w-4 h-4 mr-1" />}
        {showMoreFields ? 'Moins de critères' : 'Plus de critères'}
      </button>

      {showMoreFields && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Date de naissance</label>
            <input
              type="date"
              name="dateNaissance"
              value={formData.dateNaissance}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">ID CCU</label>
            <input
              type="text"
              name="idCcu"
              value={formData.idCcu}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">ID UUID</label>
            <input
              type="text"
              name="idUuid"
              value={formData.idUuid}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black"
            />
          </div>
        </div>
      )}

      <button
        type="submit"
        className="w-full bg-black text-white py-2 px-4 rounded-md hover:bg-gray-800 transition-colors"
      >
        Lancer la recherche
      </button>
    </form>
  );
};

export default SimpleSearchForm;