import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebarr';
import { FaTag, FaUser, FaLaptop, FaTools } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa';


const ReparationDash = () => {
    const navigate = useNavigate();
    const [reparations, setReparations] = useState([]);
    const [filteredReparations, setFilteredReparations] = useState([]);
    const [searchInput, setSearchInput] = useState('');
    const [loading, setLoading] = useState(true);
    const [selectedReparation, setSelectedReparation] = useState(null);

    const fetchReparations = async () => {
        try {
            setLoading(true);
            const response = await fetch('http://localhost:8090/reparations');
            const reparationsData = await response.json();

            const enrichedReparations = await Promise.all(
                reparationsData.map(async (reparation) => {
                    try {
                        const demandeResponse = await fetch(
                            `http://localhost:8090/demandes-reparation2/${reparation.demandeReparation.id}`
                        );
                        const demandeData = await demandeResponse.json();

                        const clientResponse = await fetch(
                            `http://localhost:8090/clients/${demandeData.client.id}`
                        );
                        const clientData = await clientResponse.json();

                        const appareilResponse = await fetch(
                            `http://localhost:8090/appareils/${demandeData.appareil.id}`
                        );
                        const appareilData = await appareilResponse.json();

                        return {
                            ...reparation,
                            clientNom: clientData.nom,
                            clientTel: clientData.numTel,
                            appareilMarque: appareilData.marque,
                            appareilModele: appareilData.modele,
                            description: reparation.description,
                        };
                    } catch (error) {
                        console.error('Erreur lors de l’enrichissement des données :', error);
                        return { ...reparation, erreur: 'Données incomplètes' };
                    }
                })
            );

            setReparations(enrichedReparations);
            setFilteredReparations(enrichedReparations);
        } catch (error) {
            console.error('Erreur lors du chargement des réparations :', error);
            alert('Erreur lors de la récupération des réparations.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReparations();
    }, []);

    useEffect(() => {
        setFilteredReparations(
            reparations.filter((reparation) =>
                reparation.clientNom?.toLowerCase().includes(searchInput.toLowerCase()) ||
                reparation.id?.toString().includes(searchInput)
            )
        );
    }, [searchInput, reparations]);

    const handleMoreInfo = (reparation) => {
        setSelectedReparation(selectedReparation === reparation ? null : reparation);
    };

    const handleLogout = () => {
        console.log('Déconnexion...');
    };
    const handleGoToDashboard = () => {
        navigate('/dashboard'); // Navigate back to the dashboard (update if necessary)
    };

    return (
        <div className="flex">
            <Sidebar />
            <main className="flex-1 p-10 bg-gray-200 ml-64">
                <header className="flex justify-between items-center mb-4 p-2">
                    <h2 className="text-xl font-semibold text-gray-800">Liste des Réparations</h2>
                    <div className="flex items-center space-x-4">
                        <button
                            onClick={handleGoToDashboard}
                            className="bg-gray-500 text-white px-3 py-2 rounded-lg shadow-lg hover:bg-gray-600 transition duration-300"
                        >
                            Retour au Dashboard
                        </button>
                        <button
                            onClick={handleLogout}
                            className="bg-blue-600 text-white px-3 py-2 rounded-lg shadow-lg hover:bg-blue-700 transition duration-300"
                        >
                            Déconnexion
                        </button>
                    </div>
                </header>
                <div className="relative mb-6">
                    <input
                        type="text"
                        placeholder="Recherche par nom ou numéro de dossier"
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        className="border border-gray-300 p-3 pl-10 rounded-lg w-full shadow focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <FaSearch className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400" />
                </div>


                <div className="bg-white rounded-lg shadow-lg p-6">
                    {loading ? (
                        <p className="flex items-center text-gray-600">
                            <FaTools className="mr-2 animate-spin" />
                            Chargement...
                        </p>
                    ) : (
                        <ul className="space-y-4">
                            {filteredReparations.map((reparation) => (
                                <li key={reparation.id} className="border-b pb-4">
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <p>
                                                <FaTag className="inline mr-2 text-gray-600" />
                                                <strong>Numéro de Dossier:</strong> {reparation.id}
                                            </p>
                                            <p>
                                                <FaUser className="inline mr-2 text-gray-600" />
                                                <strong>Client:</strong> {reparation.clientNom}
                                            </p>
                                            <p>
                                                <FaLaptop className="inline mr-2 text-gray-600" />
                                                <strong>Appareil:</strong> {reparation.appareilMarque} - {reparation.appareilModele}
                                            </p>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <button
                                                onClick={() => handleMoreInfo(reparation)}
                                                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition flex items-center"
                                            >
                                                <FaTools className="mr-2" />
                                                {selectedReparation === reparation ? 'Moins d\'infos' : 'Plus d\'infos'}
                                            </button>

                                        </div>
                                    </div>
                                    {selectedReparation === reparation && (
                                        <div className="mt-4 bg-gray-100 p-4 rounded">
                                            <p>
                                                <FaTools className="inline mr-2 text-gray-600" />
                                                <strong>Description:</strong> {reparation.description}
                                            </p>
                                            <p>
                                                <FaUser className="inline mr-2 text-gray-600" />
                                                <strong>Téléphone:</strong> {reparation.clientTel}
                                            </p>
                                        </div>
                                    )}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

            </main>
        </div>
    );
};

export default ReparationDash;
