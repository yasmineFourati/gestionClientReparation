import React from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebarr';
import Footer from '../components/Footer';

const Dashboard = () => {
  const navigate = useNavigate();

  // Function to handle logout
  const handleLogout = () => {
    localStorage.removeItem('authToken');
    navigate('/');
  };

  return (
    <div className="flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 p-10 bg-gray-100 ml-64">
        {/* Navbar */}
        <header className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Tableau de bord</h2>
          <button onClick={handleLogout} className="bg-blue-600 text-white px-4 py-2 rounded">Déconnexion</button>
        </header>

        {/* Statistics Cards */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white p-5 rounded-lg shadow">
            <h3 className="text-lg font-bold">Total Réparations</h3>
            <p className="text-2xl">120</p>
          </div>
          <div className="bg-white p-5 rounded-lg shadow">
            <h3 className="text-lg font-bold">Réparations en Cours</h3>
            <p className="text-2xl">30</p>
          </div>
          <div className="bg-white p-5 rounded-lg shadow">
            <h3 className="text-lg font-bold">Réparations Terminées</h3>
            <p className="text-2xl">90</p>
          </div>
        </div>

        {/* Recent Repairs Table */}
        <div className="bg-white rounded-lg shadow p-5 mb-6">
          <h3 className="text-lg font-bold mb-4">Réparations Récentes</h3>
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-200">
                <th className="px-4 py-2 text-left">Nom du Client</th>
                <th className="px-4 py-2 text-left">Appareil</th>
                <th className="px-4 py-2 text-left">Date de Dépôt</th>
                <th className="px-4 py-2 text-left">Statut</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border px-4 py-2">John Doe</td>
                <td className="border px-4 py-2">Ordinateur</td>
                <td className="border px-4 py-2">2024-10-01</td>
                <td className="border px-4 py-2">En Cours</td>
              </tr>
              <tr>
                <td className="border px-4 py-2">Jane Smith</td>
                <td className="border px-4 py-2">Imprimante</td>
                <td className="border px-4 py-2">2024-09-30</td>
                <td className="border px-4 py-2">Terminée</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Notifications Section */}
        <div className="bg-white rounded-lg shadow p-5 mb-6">
          <h3 className="text-lg font-bold mb-4">Notifications</h3>
          <ul>
            <li>Rappel : Appeler John Doe pour son appareil réparé.</li>
            <li>Nouvelle réparation enregistrée pour Jane Smith.</li>
          </ul>
        </div>

        {/* Footer */}
        <div className="mt-6"> {/* Ajoutez un espacement au-dessus du footer */}
          <Footer />
        </div>
      </main>
    </div>
  );
};

export default Dashboard;

////////////////////////
// import React, { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import Sidebar from '../components/Sidebarr';
// import Footer from '../components/Footer';

// const Dashboard = () => {
//   const navigate = useNavigate();
//   const [loading, setLoading] = useState(true);
//   const [statistics, setStatistics] = useState({});
//   const [recentRepairs, setRecentRepairs] = useState([]);
//   const [notifications, setNotifications] = useState([]);

//   const handleLogout = () => {
//     localStorage.removeItem('authToken');
//     navigate('/');
//   };

//   useEffect(() => {
//     const fetchData = async () => {
//       setLoading(true);
//       try {
//         // Replace with actual API calls
//         const statsResponse = await fetch('/api/statistics');
//         const repairsResponse = await fetch('/api/recent-repairs');
//         const notificationsResponse = await fetch('/api/notifications');

//         const statsData = await statsResponse.json();
//         const repairsData = await repairsResponse.json();
//         const notificationsData = await notificationsResponse.json();

//         setStatistics(statsData);
//         setRecentRepairs(repairsData);
//         setNotifications(notificationsData);
//       } catch (error) {
//         console.error('Error fetching data:', error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, []);

//   if (loading) {
//     return <div className="flex justify-center items-center h-screen">Loading...</div>;
//   }

//   return (
//     <div className="flex">
//       <Sidebar />
//       <main className="flex-1 p-10 bg-gray-100 ml-64">
//         <header className="flex justify-between items-center mb-6">
//           <h2 className="text-2xl font-bold">Tableau de bord</h2>
//           <button onClick={handleLogout} className="bg-blue-600 text-white px-4 py-2 rounded">Déconnexion</button>
//         </header>

//         <div className="grid grid-cols-3 gap-4 mb-6">
//           <div className="bg-white p-5 rounded-lg shadow">
//             <h3 className="text-lg font-bold">Total Réparations</h3>
//             <p className="text-2xl">{statistics.totalRepairs}</p>
//           </div>
//           <div className="bg-white p-5 rounded-lg shadow">
//             <h3 className="text-lg font-bold">Réparations en Cours</h3>
//             <p className="text-2xl">{statistics.repairsInProgress}</p>
//           </div>
//           <div className="bg-white p-5 rounded-lg shadow">
//             <h3 className="text-lg font-bold">Réparations Terminées</h3>
//             <p className="text-2xl">{statistics.completedRepairs}</p>
//           </div>
//         </div>

//         <div className="bg-white rounded-lg shadow p-5 mb-6">
//           <h3 className="text-lg font-bold mb-4">Réparations Récentes</h3>
//           <table className="min-w-full">
//             <thead>
//               <tr className="bg-gray-200">
//                 <th className="px-4 py-2 text-left">Nom du Client</th>
//                 <th className="px-4 py-2 text-left">Appareil</th>
//                 <th className="px-4 py-2 text-left">Date de Dépôt</th>
//                 <th className="px-4 py-2 text-left">Statut</th>
//               </tr>
//             </thead>
//             <tbody>
//               {recentRepairs.map((repair) => (
//                 <tr key={repair.id}>
//                   <td className="border px-4 py-2">{repair.clientName}</td>
//                   <td className="border px-4 py-2">{repair.device}</td>
//                   <td className="border px-4 py-2">{repair.depositDate}</td>
//                   <td className="border px-4 py-2">{repair.status}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>

//         <div className="bg-white rounded-lg shadow p-5 mb-6">
//           <h3 className="text-lg font-bold mb-4">Notifications</h3>
//           <ul>
//             {notifications.map((notification, index) => (
//               <li key={index}>{notification.message}</li>
//             ))}
//           </ul>
//         </div>

//         <Footer />
//       </main>
//     </div>
//   );
// };

// export default Dashboard;
