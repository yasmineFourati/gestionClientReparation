import React, { useState } from 'react';
import { FaPhone, FaMapMarkerAlt, FaLaptop, FaTag, FaCalendarAlt, FaWrench, FaPlus } from 'react-icons/fa'; 
import Sidebar from '../components/Sidebarr';
import Footer from '../components/Footer';
import { useNavigate } from 'react-router-dom'; 

const ListeClients = () => {
    const navigate = useNavigate();
    const [clients, setClients] = useState([
        {
            id: 1,
            nom: 'Soussou',
            telephone: '123456789',
            adresse: 'manzel cheker',
            marqueAppareil: 'HP',
            modeleAppareil: 'Pavilion',
            numeroSerie: 'SN001',
            symptomesPanne: 'Écran noir',
            dateDepot: '2024-10-20',
            dateRemise: '2024-10-25',
            etatReparation: 'En cours'
        },
        {
            id: 2,
            nom: 'Pablo',
            telephone: '987654321',
            adresse: 'matar',
            marqueAppareil: 'Dell',
            modeleAppareil: 'XPS 15',
            numeroSerie: 'SN002',
            symptomesPanne: 'Lenteur excessive',
            dateDepot: '2024-10-18',
            dateRemise: '2024-10-24',
            etatReparation: 'Terminé'
        }
    ]);

    const [selectedClient, setSelectedClient] = useState(null);
    const [searchInput, setSearchInput] = useState(''); 

    const handleMoreInfo = (client) => {
        setSelectedClient(selectedClient === client ? null : client);
    };

    const handleLogout = () => {
        localStorage.removeItem('authToken'); 
        navigate('/'); 
    };

    // Filter clients based on the search input
    const filteredClients = clients.filter(client =>
        client.numeroSerie.toLowerCase().includes(searchInput.toLowerCase())
    );

    return (
        <div className="flex">
            <Sidebar />
            <main className="flex-1 p-10 bg-gray-200 ml-64">
                {/* Header Section */}
                <header className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">Liste des Clients</h2>
                    <div className="flex items-center">
                        {/* Search Input */}
                        <input
                            type="text"
                            placeholder="Recherche par numéro de série"
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            className="border border-gray-300 p-2 rounded mr-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                            onClick={handleLogout}
                            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                        >
                            Déconnexion
                        </button>
                    </div>
                </header>

                <div className="bg-white rounded-lg shadow-lg p-6 mb-10">
                    <ul className="space-y-4">
                        {filteredClients.map(client => (
                            <li key={client.id} className="border-b pb-4">
                                <div className="flex justify-between items-center">
                                    <div className="flex-1">
                                        <p className="font-semibold text-lg"><FaTag className="inline mr-2" /> <strong>Nom:</strong> {client.nom}</p>
                                        <p><FaPhone className="inline mr-2" /><strong>Téléphone:</strong> {client.telephone}</p>
                                        <p><FaMapMarkerAlt className="inline mr-2" /><strong>Adresse:</strong> {client.adresse}</p>
                                    </div>
                                    <button
                                        onClick={() => handleMoreInfo(client)}
                                        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition flex items-center"
                                    >
                                        {selectedClient === client ? (
                                            <>
                                                <FaWrench className="inline mr-2" /> Moins d'infos
                                            </>
                                        ) : (
                                            <>
                                                <FaPlus className="inline mr-2" /> Plus d'infos
                                            </>
                                        )}
                                    </button>
                                </div>

                                {selectedClient === client && (
                                    <div className="mt-4 space-y-2">
                                        <div className="bg-gray-100 p-4 rounded-lg">
                                            <p><FaLaptop className="inline mr-2" /><strong>Marque de l'appareil:</strong> {client.marqueAppareil}</p>
                                            <p><FaLaptop className="inline mr-2" /><strong>Modèle de l'appareil:</strong> {client.modeleAppareil}</p>
                                            <p><FaTag className="inline mr-2" /><strong>Numéro de série:</strong> {client.numeroSerie}</p>
                                            <p><FaWrench className="inline mr-2" /><strong>Symptômes de la panne:</strong> {client.symptomesPanne}</p>
                                            <p><FaCalendarAlt className="inline mr-2" /><strong>Date de dépôt:</strong> {client.dateDepot}</p>
                                            <p><FaCalendarAlt className="inline mr-2" /><strong>Date de remise:</strong> {client.dateRemise}</p>
                                            <p><FaWrench className="inline mr-2" /><strong>État de réparation:</strong> {client.etatReparation}</p>
                                        </div>
                                    </div>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>

                <Footer />
            </main>
        </div>
    );
};

export default ListeClients;



////////////////////////////////////////////////
// import React, { useEffect, useState } from 'react';
// import { FaPhone, FaMapMarkerAlt, FaLaptop, FaTag, FaCalendarAlt, FaWrench } from 'react-icons/fa';
// import Sidebar from '../components/Sidebarr';
// import Footer from '../components/Footer';
// import { useNavigate } from 'react-router-dom';

// const ListeClients = () => {
//     const navigate = useNavigate();
//     const [clients, setClients] = useState([]);
//     const [selectedClient, setSelectedClient] = useState(null);
//     const [searchInput, setSearchInput] = useState('');
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);

//     const handleMoreInfo = (client) => {
//         setSelectedClient(selectedClient === client ? null : client);
//     };

//     const handleLogout = () => {
//         localStorage.removeItem('authToken');
//         navigate('/');
//     };

//     useEffect(() => {
//         const fetchClients = async () => {
//             setLoading(true);
//             try {
//                 const response = await fetch('/api/clients'); // Replace with your API endpoint
//                 if (!response.ok) throw new Error('Network response was not ok');
//                 const data = await response.json();
//                 setClients(data);
//             } catch (err) {
//                 setError(err.message);
//             } finally {
//                 setLoading(false);
//             }
//         };
//         fetchClients();
//     }, []);

//     const filteredClients = clients.filter(client =>
//         client.numeroSerie.toLowerCase().includes(searchInput.toLowerCase()) ||
//         client.nom.toLowerCase().includes(searchInput.toLowerCase())
//     );

//     if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>;
//     if (error) return <div className="text-red-500">{error}</div>;

//     return (
//         <div className="flex">
//             <Sidebar />
//             <main className="flex-1 p-10 bg-gray-200 ml-64">
//                 <header className="flex justify-between items-center mb-6">
//                     <h2 className="text-2xl font-bold text-gray-800">Liste des Clients</h2>
//                     <div className="flex items-center">
//                         <input
//                             type="text"
//                             placeholder="Recherche par numéro de série ou nom"
//                             value={searchInput}
//                             onChange={(e) => setSearchInput(e.target.value)}
//                             className="border border-gray-300 p-2 rounded mr-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                         />
//                         <button
//                             onClick={handleLogout}
//                             className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
//                         >
//                             Déconnexion
//                         </button>
//                     </div>
//                 </header>

//                 <div className="bg-white rounded-lg shadow-lg p-6 mb-10">
//                     <ul className="space-y-4">
//                         {filteredClients.map(client => (
//                             <li key={client.id} className="border-b pb-4">
//                                 <div className="flex justify-between items-center">
//                                     <div className="flex-1">
//                                         <p className="font-semibold text-lg"><FaTag className="inline mr-2" /> <strong>Nom:</strong> {client.nom}</p>
//                                         <p><FaPhone className="inline mr-2" /><strong>Téléphone:</strong> {client.telephone}</p>
//                                         <p><FaMapMarkerAlt className="inline mr-2" /><strong>Adresse:</strong> {client.adresse}</p>
//                                     </div>
//                                     <button
//                                         onClick={() => handleMoreInfo(client)}
//                                         className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
//                                     >
//                                         {selectedClient === client ? 'Moins d\'infos' : 'Plus d\'infos'}
//                                     </button>
//                                 </div>

//                                 {selectedClient === client && (
//                                     <div className="mt-4 space-y-2">
//                                         <div className="bg-gray-100 p-4 rounded-lg">
//                                             <p><FaLaptop className="inline mr-2" /><strong>Marque de l'appareil:</strong> {client.marqueAppareil}</p>
//                                             <p><FaLaptop className="inline mr-2" /><strong>Modèle de l'appareil:</strong> {client.modeleAppareil}</p>
//                                             <p><FaTag className="inline mr-2" /><strong>Numéro de série:</strong> {client.numeroSerie}</p>
//                                             <p><FaWrench className="inline mr-2" /><strong>Symptômes de la panne:</strong> {client.symptomesPanne}</p>
//                                             <p><FaCalendarAlt className="inline mr-2" /><strong>Date de dépôt:</strong> {client.dateDepot}</p>
//                                             <p><FaCalendarAlt className="inline mr-2" /><strong>Date de remise:</strong> {client.dateRemise}</p>
//                                             <p><FaWrench className="inline mr-2" /><strong>État de réparation:</strong> {client.etatReparation}</p>
//                                         </div>
//                                     </div>
//                                 )}
//                             </li>
//                         ))}
//                     </ul>
//                 </div>

//                 <Footer />
//             </main>
//         </div>
//     );
// };

// export default ListeClients;
