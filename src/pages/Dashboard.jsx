import React, { useState, useEffect } from 'react';
import { FaTasks, FaWrench, FaUserAlt, FaDesktop, FaArrowRight, FaSpinner, FaFileInvoice } from 'react-icons/fa';
import Sidebar from '../components/Sidebarr'; // Sidebar component import
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const navigate = useNavigate();

    // State variables
    const [demandes, setDemandes] = useState([]);
    const [clients, setClients] = useState([]);
    const [appareils, setAppareils] = useState([]);
    const [reparations, setReparations] = useState([]);
    const [factures, setFactures] = useState([]); // New state for invoices
    const [loading, setLoading] = useState(true);

    // Fetch data on mount
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [demandesRes, clientsRes, appareilsRes, reparationsRes, facturesRes] = await Promise.all([
                    fetch('http://localhost:8090/demandes-reparation1'),
                    fetch('http://localhost:8090/clients'),
                    fetch('http://localhost:8090/appareils'),
                    fetch('http://localhost:8090/reparations'),
                    fetch('http://localhost:8090/factures'), // Endpoint for invoices
                ]);

                const [demandesData, clientsData, appareilsData, reparationsData, facturesData] = await Promise.all([
                    demandesRes.json(),
                    clientsRes.json(),
                    appareilsRes.json(),
                    reparationsRes.json(),
                    facturesRes.json(),
                ]);

                setDemandes(demandesData);
                setClients(clientsData);
                setAppareils(appareilsData);
                setReparations(reparationsData);
                setFactures(facturesData);
            } catch (error) {
                console.error('Erreur lors de la récupération des données:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Utility functions
    const getStatusCount = (status) => {
        return demandes.filter(
            (demande) => demande.etat && demande.etat.trim().toLowerCase() === status.toLowerCase()
        ).length;
    };

    const countDistinctClients = () => {
        const uniqueClients = new Set(clients.map((client) => client.nom));
        return uniqueClients.size;
    };

    // Navigation Handlers
    const handleViewRequests = () => navigate('/listedemande');
    const handleViewClients = () => navigate('/clientdash');
    const handleViewAppareils = () => navigate('/appdash');
    const handleViewReparations = () => navigate('/repdash');
    const handleViewFactures = () => navigate('/listefac'); // Navigation for invoices
    const handleLogout = () => {
        localStorage.removeItem('authToken');
        navigate('/');
    };

    return (
        <div className="flex flex-col lg:flex-row">
            {/* Sidebar */}
            <Sidebar />

            {/* Main Content */}
            <main className="flex-1 p-6 bg-gradient-to-r from-blue-100 to-purple-50 lg:ml-64 transition-all duration-300 ease-in-out">
                {/* Header */}
                <header className="flex justify-between items-center mb-6">
                    <h2 className="text-3xl font-semibold text-gray-800 tracking-wide">Dashboard</h2>
                    <button
                        onClick={handleLogout}
                        className="bg-indigo-600 text-white px-6 py-2 rounded-lg shadow-xl hover:bg-indigo-700 transition duration-300"
                    >
                        Déconnexion
                    </button>
                </header>

                {/* Loading State */}
                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <FaSpinner className="animate-spin text-5xl text-gray-700" />
                        <p className="ml-4 text-xl text-gray-700">Chargement des données...</p>
                    </div>
                ) : (
                    <>
                        {/* Client Information Section */}
                        <section className="mb-10">
                            <h3 className="text-xl font-semibold text-gray-800 mb-4">Informations des Clients</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
                                {/* Total Clients */}
                                <div className="bg-white p-6 rounded-lg shadow-lg transform hover:scale-105 transition-all duration-300">
                                    <FaUserAlt className="text-5xl text-teal-500 mb-4 animate-pulse" />
                                    <h3 className="text-lg font-semibold text-gray-800">Total Clients</h3>
                                    <p className="text-3xl text-teal-800 font-bold">{countDistinctClients()}</p>
                                    <button
                                        onClick={handleViewClients}
                                        className="mt-4 bg-teal-600 text-white px-5 py-2 rounded-full shadow-lg hover:bg-teal-700 transition duration-300 flex items-center"
                                    >
                                        Voir les clients <FaArrowRight className="ml-2" />
                                    </button>
                                </div>

                                {/* Total Appareils */}
                                <div className="bg-white p-6 rounded-lg shadow-lg transform hover:scale-105 transition-all duration-300">
                                    <FaDesktop className="text-5xl text-yellow-500 mb-4 animate-pulse" />
                                    <h3 className="text-lg font-semibold text-gray-800">Total Appareils</h3>
                                    <p className="text-3xl text-yellow-800 font-bold">{appareils.length}</p>
                                    <button
                                        onClick={handleViewAppareils}
                                        className="mt-4 bg-yellow-600 text-white px-5 py-2 rounded-full shadow-lg hover:bg-yellow-700 transition duration-300 flex items-center"
                                    >
                                        Voir les appareils <FaArrowRight className="ml-2" />
                                    </button>
                                </div>
                            </div>
                        </section>

                        {/* Repair Information Section */}
                        <section>
                            <h3 className="text-xl font-semibold text-gray-800 mb-4">Informations des Réparations</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {/* Demandes en Cours */}
                                <div className="bg-white p-6 rounded-lg shadow-lg transform hover:scale-105 transition-all duration-300">
                                    <FaWrench className="text-5xl text-red-500 mb-4 animate-pulse" />
                                    <h3 className="text-lg font-semibold text-gray-800">Demandes en Cours</h3>
                                    <p className="text-3xl text-red-800 font-bold">{getStatusCount('En Cours')}</p>
                                    <button
                                        onClick={handleViewRequests}
                                        className="mt-4 bg-red-600 text-white px-5 py-2 rounded-full shadow-lg hover:bg-red-700 transition duration-300 flex items-center"
                                    >
                                        Voir les demandes en cours <FaArrowRight className="ml-2" />
                                    </button>
                                </div>

                                {/* Total Réparations */}
                                <div className="bg-white p-6 rounded-lg shadow-lg transform hover:scale-105 transition-all duration-300">
                                    <FaTasks className="text-5xl text-indigo-500 mb-4 animate-pulse" />
                                    <h3 className="text-lg font-semibold text-gray-800">Total Réparations</h3>
                                    <p className="text-3xl text-indigo-800 font-bold">{reparations.length}</p>
                                    <button
                                        onClick={handleViewReparations}
                                        className="mt-4 bg-indigo-600 text-white px-5 py-2 rounded-full shadow-lg hover:bg-indigo-700 transition duration-300 flex items-center"
                                    >
                                        Voir les réparations <FaArrowRight className="ml-2" />
                                    </button>
                                </div>

                                {/* Total Factures */}
                                <div className="bg-white p-6 rounded-lg shadow-lg transform hover:scale-105 transition-all duration-300">
                                    <FaFileInvoice className="text-5xl text-green-500 mb-4 animate-pulse" />
                                    <h3 className="text-lg font-semibold text-gray-800">Total Factures</h3>
                                    <p className="text-3xl text-green-800 font-bold">{factures.length}</p>
                                    <button
                                        onClick={handleViewFactures}
                                        className="mt-4 bg-green-600 text-white px-5 py-2 rounded-full shadow-lg hover:bg-green-700 transition duration-300 flex items-center"
                                    >
                                        Voir les factures <FaArrowRight className="ml-2" />
                                    </button>
                                </div>
                            </div>
                        </section>
                    </>
                )}
            </main>
        </div>
    );
};

export default Dashboard;
