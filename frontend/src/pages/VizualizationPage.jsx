import React, { useState, useEffect, useCallback } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line 
} from 'recharts';
import { 
  ArrowLeft, Shield, Phone, Mail, MapPin, AlertTriangle, 
  RefreshCw, Users, TrendingUp 
} from 'lucide-react';
import { Link } from 'react-router-dom';

// Configuration des couleurs pour les graphiques
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const VisualizationPage = () => {
  // États pour les différentes données
  const [summaryData, setSummaryData] = useState(null);
  const [phoneData, setPhoneData] = useState(null);
  const [emailData, setEmailData] = useState(null);
  const [geoData, setGeoData] = useState(null);
  const [highRiskAccounts, setHighRiskAccounts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Fonction pour formater les données du graphique de distribution des risques
  const formatRiskDistribution = useCallback((distribution) => {
    return Object.entries(distribution).map(([score, count]) => ({
      score: `Niveau ${score}`,
      count: count
    }));
  }, []);

  // Fonction pour formater les données des opérateurs
  const formatOperatorData = useCallback((distribution) => {
    return Object.entries(distribution).map(([operator, count]) => ({
      operator,
      count
    }));
  }, []);

  // Fonction pour charger toutes les données
  const fetchAllData = useCallback(async () => {
    setIsLoading(true);
    setError('');

    try {
      const [summaryRes, phoneRes, emailRes, geoRes, highRiskRes] = await Promise.all([
        fetch('/api/fraud/summary'),
        fetch('/api/fraud/phone-analysis'),
        fetch('/api/fraud/email-analysis'),
        fetch('/api/fraud/geographic'),
        fetch('/api/fraud/high-risk')
      ]);

      const [summary, phone, email, geo, highRisk] = await Promise.all([
        summaryRes.json(),
        phoneRes.json(),
        emailRes.json(),
        geoRes.json(),
        highRiskRes.json()
      ]);

      setSummaryData(summary);
      setPhoneData(phone);
      setEmailData(email);
      setGeoData(geo);
      setHighRiskAccounts(highRisk);
    } catch (err) {
      setError("Erreur lors du chargement des données. Veuillez réessayer.");
      console.error('Erreur détaillée:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Chargement initial des données
  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  // Composant pour les métriques clés
  const MetricCard = ({ title, value, icon: Icon, trend }) => (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Icon className="w-5 h-5 text-gray-500" />
          <h3 className="text-sm font-medium text-gray-600">{title}</h3>
        </div>
        {trend && (
          <span className={trend > 0 ? 'text-red-500' : 'text-green-500'}>
            {trend > 0 ? '+' : ''}{trend}%
          </span>
        )}
      </div>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
          <p className="mt-4 text-sm text-gray-600">Chargement des données d'analyse...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* En-tête */}
        <div className="mb-8 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link
              to="/dashboard"
              className="flex items-center justify-center w-10 h-10 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
            >
              <ArrowLeft className="w-6 h-6" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold">Analyse des Fraudes</h1>
              <p className="text-gray-600">Visualisation détaillée des comportements suspects</p>
            </div>
          </div>
          
          <button
            onClick={fetchAllData}
            className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Actualiser
          </button>
        </div>

        {/* Gestion des erreurs */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded">
            <div className="flex">
              <AlertTriangle className="h-5 w-5 text-red-400" />
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Métriques principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <MetricCard
            title="Comptes à Haut Risque"
            value={summaryData?.global_stats?.high_risk_accounts || 0}
            icon={Shield}
            trend={10}
          />
          <MetricCard
            title="Nouveaux Comptes"
            value={summaryData?.recent_activity?.new_accounts_last_week || 0}
            icon={Users}
          />
          <MetricCard
            title="Alertes Récentes"
            value={summaryData?.recent_activity?.high_risk_last_week || 0}
            icon={AlertTriangle}
            trend={5}
          />
          <MetricCard
            title="Modifications Téléphone"
            value={phoneData?.recent_changes || 0}
            icon={Phone}
          />
        </div>

        {/* Graphiques principaux */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Distribution des risques */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Distribution des Niveaux de Risque
            </h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={formatRiskDistribution(summaryData?.risk_distribution || {})}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="score" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#8884d8" name="Nombre de comptes" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Distribution des opérateurs */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <Phone className="w-5 h-5" />
              Distribution par Opérateur
            </h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={formatOperatorData(phoneData?.operator_distribution || {})}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    label={({ operator, count }) => `${operator}: ${count}`}
                    outerRadius={120}
                    dataKey="count"
                  >
                    {formatOperatorData(phoneData?.operator_distribution || {}).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Anomalies géographiques */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Incohérences Géographiques
            </h3>
            <div className="h-[300px] overflow-y-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left">Pays Déclaré</th>
                    <th className="px-4 py-2 text-left">Territoire Opérateur</th>
                    <th className="px-4 py-2 text-left">Nombre</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(geoData?.mismatches || {}).map(([key, count], index) => {
                    const [declared, operator] = key.split(',');
                    return (
                      <tr key={index} className="border-t">
                        <td className="px-4 py-2">{declared}</td>
                        <td className="px-4 py-2">{operator}</td>
                        <td className="px-4 py-2">{count}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Comptes à haut risque */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Derniers Comptes à Haut Risque
            </h3>
            <div className="space-y-4">
              {highRiskAccounts.slice(0, 5).map((account) => (
                <div key={account.id} 
                  className="p-4 bg-gray-50 rounded-lg flex justify-between items-center"
                >
                  <div>
                    <p className="font-medium">ID: {account.id}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(account.created_date).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-red-500">
                      Risque: {account.risk_score}
                    </p>
                    <p className="text-sm text-gray-500">
                      {account.operator}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VisualizationPage;