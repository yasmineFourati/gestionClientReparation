import React, { useState, useEffect } from 'react';
import { FaPhone, FaMapMarkerAlt, FaSearch } from 'react-icons/fa';
import Sidebar from '../components/Sidebarr';
import Footer from '../components/Footer';
import { useNavigate } from 'react-router-dom';

const ClientDash = () => {
    const navigate = useNavigate();
    const [clients, setClients] = useState([]);
    const [searchInput, setSearchInput] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchClients = async () => {
            setLoading(true);
            try {
                const response = await fetch('http://localhost:8090/clients');
                const data = await response.json();
                setClients(data);
            } catch (error) {
                console.error("Erreur de récupération des clients:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchClients();
    }, []);

    const filteredClients = clients.filter((client) =>
        client.nom.toLowerCase().includes(searchInput.toLowerCase())
    );

    const handleLogout = () => {
        localStorage.removeItem('authToken'); // Remove the auth token from localStorage
        navigate('/'); // Redirect to the login page (assuming the login route is '/')
    };

    const handleGoToDashboard = () => {
        navigate('/dashboard'); // Navigate back to the dashboard (update if necessary)
    };

    return (
        <div className="flex">
            <Sidebar />
            <main className="flex-1 p-10 bg-gray-100 ml-64">
                <header className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">Liste des Clients</h2>
                    <div className="flex items-center gap-4">
                        <button
                            onClick={handleGoToDashboard}
                            className="bg-gray-500 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-gray-600 transition duration-300"
                        >
                            Retour au Dashboard
                        </button>
                        <button
                            onClick={handleLogout}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-blue-700 transition duration-300"
                        >
                            Déconnexion
                        </button>
                    </div>
                </header>

                <div className="relative mb-6">
                    <input
                        type="text"
                        placeholder="Recherche par nom"
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        className="border border-gray-300 p-3 pl-10 rounded-lg w-full shadow focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <FaSearch className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400" />
                </div>

                <div className="bg-white rounded-lg shadow-lg p-6 overflow-x-auto">
                    {loading ? (
                        <div className="flex justify-center items-center">
                            <div className="loader">Chargement...</div>
                        </div>
                    ) : (
                        <table className="min-w-full table-auto border-collapse">
                            <thead className="bg-gray-800 text-white">
                                <tr>
                                    <th className="py-3 px-6 text-left">Nom</th>
                                    <th className="py-3 px-6 text-left">Téléphone</th>
                                    <th className="py-3 px-6 text-left">Adresse</th>
                                </tr>
                            </thead>
                            <tbody className="text-gray-700">
                                {filteredClients.map((client) => (
                                    <tr key={client.id} className="border-b hover:bg-gray-100">
                                        <td className="py-3 px-6">{client.nom}</td>
                                        <td className="py-3 px-6">
                                            <FaPhone className="inline mr-2" />
                                            {client.numTel}
                                        </td>
                                        <td className="py-3 px-6">
                                            <FaMapMarkerAlt className="inline mr-2" />
                                            {client.adresse}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>

                <br />
                <Footer />
            </main>
        </div>
    );
};

export default ClientDash;
