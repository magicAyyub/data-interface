// services/api.js

// Configuration de base pour les requêtes API
const API_CONFIG = {
    headers: {
      'Content-Type': 'application/json',
    },
  };
  
  // Gestion des erreurs de l'API
  const handleApiError = (error) => {
    if (error.response) {
      // Le serveur a répondu avec un code d'erreur
      return {
        error: error.response.data.error || 'Une erreur est survenue',
        status: error.response.status,
      };
    } else if (error.request) {
      // La requête a été faite mais pas de réponse reçue
      return {
        error: 'Impossible de contacter le serveur',
        status: 503,
      };
    } else {
      // Une erreur s'est produite lors de la configuration de la requête
      return {
        error: 'Une erreur est survenue lors de la requête',
        status: 500,
      };
    }
  };
  
  // Service API pour la recherche simple
  export const simpleSearch = async (searchParams, page = 1, limit = 30) => {
    try {
      const response = await fetch('/api/search', {
        method: 'POST',
        ...API_CONFIG,
        body: JSON.stringify({
          ...searchParams,
          page,
          limit,
        }),
      });
  
      if (!response.ok) {
        throw new Error('Erreur lors de la recherche');
      }
  
      return await response.json();
    } catch (error) {
      return handleApiError(error);
    }
  };
  
  // Service API pour la recherche par CSV
  export const csvSearch = async (file) => {
    try {
      const formData = new FormData();
      formData.append('csv_file', file);
  
      const response = await fetch('/api/fill_csv', {
        method: 'POST',
        body: formData,
      });
  
      if (!response.ok) {
        throw new Error('Erreur lors du traitement du fichier CSV');
      }
  
      // Dans ce cas, on retourne directement le blob pour le téléchargement
      return await response.blob();
    } catch (error) {
      return handleApiError(error);
    }
  };
  
  // Service API pour la recherche par regex
  export const regexSearch = async (pattern, page = 1, limit = 30) => {
    try {
      const response = await fetch('/api/search', {
        method: 'POST',
        ...API_CONFIG,
        body: JSON.stringify({
          regex: pattern,
          page,
          limit,
        }),
      });
  
      if (!response.ok) {
        throw new Error('Erreur lors de la recherche par expression régulière');
      }
  
      return await response.json();
    } catch (error) {
      return handleApiError(error);
    }
  };
  
  // Service API pour le traitement des fichiers texte
  export const processTextFile = async (file) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
  
      const response = await fetch('/api/process_file', {
        method: 'POST',
        body: formData,
      });
  
      if (!response.ok) {
        throw new Error('Erreur lors du traitement du fichier');
      }
  
      return await response.json();
    } catch (error) {
      return handleApiError(error);
    }
  };
  
  // Service API pour le téléchargement du CSV traité
  export const downloadProcessedCSV = async () => {
    try {
      const response = await fetch('/api/download_csv', {
        method: 'GET',
      });
  
      if (!response.ok) {
        throw new Error('Erreur lors du téléchargement du CSV');
      }
  
      return await response.blob();
    } catch (error) {
      return handleApiError(error);
    }
  };
  
  // Service API pour le chargement des données dans la base
  export const loadDataToDatabase = async (tableName) => {
    try {
      const formData = new FormData();
      formData.append('table_name', tableName);
  
      const response = await fetch('/api/load_data', {
        method: 'POST',
        body: formData,
      });
  
      if (!response.ok) {
        throw new Error('Erreur lors du chargement des données');
      }
  
      return await response.json();
    } catch (error) {
      return handleApiError(error);
    }
  };