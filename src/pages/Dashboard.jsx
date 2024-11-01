import React from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebarr';
import Footer from '../components/Footer';
import { FaTools, FaHourglassHalf, FaCheckCircle, FaBell } from 'react-icons/fa';
import RepairChart from '../components/RepairChart'; 

const Dashboard = () => {
  const navigate = useNavigate();

  
  const handleLogout = () => {
    localStorage.removeItem('authToken');
    navigate('/');
  };
  const totalRepairs = 120;
  const ongoingRepairs = 90;
  const completedRepairs = 30;

  const ongoingPercentage = (ongoingRepairs / totalRepairs) * 100;
  const completedPercentage = (completedRepairs / totalRepairs) * 100;

  return (
    <div className="flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 p-10 bg-gradient-to-r from-gray-100 to-gray-200 ml-64">
        {/* Navbar */}
        <header className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-gray-800">Tableau de bord</h2>
          <button 
            onClick={handleLogout}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-blue-700 transition duration-300"
          >
            Déconnexion
          </button>
        </header>

         {/* Stat Cards */}
        <div className="grid grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-5 rounded-lg shadow hover:shadow-md transition flex items-center space-x-4">
            <FaTools className="text-blue-600 text-4xl" />
            <div>
              <h3 className="text-lg font-semibold text-gray-700">Total Réparations</h3>
              <p className="text-3xl font-bold text-gray-900">{totalRepairs}</p>
            </div>
          </div>
          <div className="bg-white p-5 rounded-lg shadow hover:shadow-md transition flex items-center space-x-4">
            <FaHourglassHalf className="text-yellow-500 text-4xl" />
            <div>
              <h3 className="text-lg font-semibold text-gray-700">Réparations en Cours</h3>
              <p className="text-3xl font-bold text-gray-900">{ongoingRepairs}</p>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div 
                  className="bg-yellow-500 h-2 rounded-full" 
                  style={{ width: `${ongoingPercentage}%` }} 
                ></div>
              </div>
            </div>
          </div>
          <div className="bg-white p-5 rounded-lg shadow hover:shadow-md transition flex items-center space-x-4">
            <FaCheckCircle className="text-green-500 text-4xl" />
            <div>
              <h3 className="text-lg font-semibold text-gray-700">Réparations Terminées</h3>
              <p className="text-3xl font-bold text-gray-900">{completedRepairs}</p>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div 
                  className="bg-green-500 h-2 rounded-full" 
                  style={{ width: `${completedPercentage}%` }} 
                ></div>
              </div>
            </div>
          </div>
        </div>

         {/* Repair Chart
         <div className="bg-white rounded-lg shadow p-5 mb-8">
          <h3 className="text-xl font-bold mb-4 text-gray-800">Statistiques des Réparations</h3>
          <RepairChart ongoingRepairs={ongoingRepairs} completedRepairs={completedRepairs} />
        </div> */}

        {/* Table with Pagination */}
        <div className="bg-white rounded-lg shadow p-5 mb-8">
          <h3 className="text-xl font-bold mb-4 text-gray-800">Réparations Récentes</h3>
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-200 text-gray-600 uppercase text-sm">
                <th className="px-4 py-2 border-b">Nom du Client</th>
                <th className="px-4 py-2 border-b">Appareil</th>
                <th className="px-4 py-2 border-b">Date de Dépôt</th>
                <th className="px-4 py-2 border-b">Statut</th>
              </tr>
            </thead>
            <tbody>
              {/* Example Rows */}
              <tr className="hover:bg-gray-100 text-gray-700">
                <td className="px-4 py-3 border-b">Achraf Karray</td>
                <td className="px-4 py-3 border-b">Imprimante</td>
                <td className="px-4 py-3 border-b">2024-09-30</td>
                <td className="px-4 py-3 border-b text-green-600">Terminée</td>
              </tr>
              <tr className="hover:bg-gray-100 text-gray-700">
                <td className="px-4 py-3 border-b">Mohamed Bouassida</td>
                <td className="px-4 py-3 border-b">Scanner</td>
                <td className="px-4 py-3 border-b">2024-10-02</td>
                <td className="px-4 py-3 border-b text-yellow-600">En Cours</td>
              </tr>
              <tr className="hover:bg-gray-100 text-gray-700">
                <td className="px-4 py-3 border-b">Baya Fourati</td>
                <td className="px-4 py-3 border-b">Ordinateur Portable</td>
                <td className="px-4 py-3 border-b">2024-10-05</td>
                <td className="px-4 py-3 border-b text-green-600">Terminée</td>
              </tr>
              <tr className="hover:bg-gray-100 text-gray-700">
                <td className="px-4 py-3 border-b">Yosra Makni</td>
                <td className="px-4 py-3 border-b">Imprimante</td>
                <td className="px-4 py-3 border-b">2024-10-06</td>
                <td className="px-4 py-3 border-b text-yellow-600">En Cours</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Notifications */}
        <div className="bg-white rounded-lg shadow p-5 mb-8">
          <h3 className="text-xl font-bold mb-4 text-gray-800 flex items-center">
            <FaBell className="mr-2 text-blue-600" /> Notifications
          </h3>
          <ul className="space-y-2 text-gray-700">
            <li className="flex items-center space-x-2">
              <span className="bg-blue-100 text-blue-600 rounded-full px-2 py-1">Nouveau</span>
              <p>Rappel : Appeler Yosra Makni pour son appareil réparé.</p>
            </li>
            <li className="flex items-center space-x-2">
              <span className="bg-yellow-100 text-yellow-600 rounded-full px-2 py-1">En Attente</span>
              <p>Nouvelle réparation enregistrée pour Baya Fourati.</p>
            </li>
          </ul>
        </div>
        <Footer />
      </main>
    </div>
  );
};

export default Dashboard;
