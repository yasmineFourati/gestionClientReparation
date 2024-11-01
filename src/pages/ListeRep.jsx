import React, { useState } from 'react';
import { FaTag, FaUser, FaLaptop, FaCalendarDay, FaCalendarCheck, FaTools, FaExclamationTriangle, FaClock, FaClipboard, FaCogs, FaPlus } from 'react-icons/fa';
import Sidebar from '../components/Sidebarr';
import Footer from '../components/Footer';
import { useNavigate } from 'react-router-dom';

const ListeRep = () => {
    const navigate = useNavigate();
    const [reparations, setReparations] = useState([
        {
            id: 1,
            numeroDossier: 'D001',
            clientNom: 'Soussou',
            appareil: 'HP Pavilion',
            heures: '5 heures',
            description: 'Remplacement de l\'écran',
            piecesChangees: ['Écran', 'Batterie'],
            dateDepot: '2024-10-20',
            dateRemise: '2024-10-25',
            etatReparation: 'En cours',
            symptomesPanne: 'Écran noir',
        },
        {
            id: 2,
            numeroDossier: 'D002',
            clientNom: 'Pablo',
            appareil: 'Dell XPS 15',
            heures: '3 heures',
            description: 'Nettoyage complet',
            piecesChangees: ['Aucune'],
            dateDepot: '2024-10-18',
            dateRemise: '2024-10-24',
            etatReparation: 'Terminé',
            symptomesPanne: 'Lenteur excessive',
        },
    ]);

    const [selectedReparation, setSelectedReparation] = useState(null);
    const [searchInput, setSearchInput] = useState('');

    const handleMoreInfo = (reparation) => {
        setSelectedReparation(selectedReparation === reparation ? null : reparation);
    };

    const handleLogout = () => {
        localStorage.removeItem('authToken');
        navigate('/');
    };

    const filteredReparations = reparations.filter(reparation =>
        reparation.numeroDossier.toLowerCase().includes(searchInput.toLowerCase())
    );

    return (
        <div className="flex">
            <Sidebar />
            <main className="flex-1 p-10 bg-gray-200 ml-64">
                {/* Header Section */}
                <header className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">Liste des Réparations</h2>
                    <div className="flex items-center">
                        {/* Search Input */}
                        <input
                            type="text"
                            placeholder="Recherche par numéro de dossier"
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            className="border border-gray-300 p-2 rounded mr-4 focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
                        />
                        <button
                            onClick={handleLogout}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-blue-700 transition duration-300"
                        >
                            Déconnexion
                        </button>
                    </div>
                </header>

                <div className="bg-white rounded-lg shadow-lg p-6 mb-10">
                    <ul className="space-y-4">
                        {filteredReparations.map(reparation => (
                            <li key={reparation.id} className="border-b pb-4">
                                <div className="flex justify-between items-center">
                                    <div className="flex-1">
                                        <p className="font-semibold text-lg"><FaTag className="inline mr-2" /> <strong>Numéro de Dossier:</strong> {reparation.numeroDossier}</p>
                                        <p><FaUser className="inline mr-2" /><strong>Client:</strong> {reparation.clientNom}</p>
                                        <p><FaLaptop className="inline mr-2" /><strong>Appareil:</strong> {reparation.appareil}</p>
                                    </div>
                                    <button
                                        onClick={() => handleMoreInfo(reparation)}
                                        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition flex items-center"
                                    >
                                        {selectedReparation === reparation ? (
                                            <>
                                                <FaTools className="inline mr-2" /> Moins d'infos
                                            </>
                                        ) : (
                                            <>
                                                <FaPlus className="inline mr-2" /> Plus d'infos
                                            </>
                                        )}
                                    </button>
                                </div>

                                {selectedReparation === reparation && (
                                    <div className="mt-4 space-y-2">
                                        <div className="bg-gray-100 p-4 rounded-lg">
                                            <p><FaCalendarDay className="inline mr-2" /><strong>Date de dépôt:</strong> {reparation.dateDepot}</p>
                                            <p><FaCalendarCheck className="inline mr-2" /><strong>Date de remise:</strong> {reparation.dateRemise}</p>
                                            <p><FaTools className="inline mr-2" /><strong>État de réparation:</strong> {reparation.etatReparation}</p>
                                            <p><FaExclamationTriangle className="inline mr-2" /><strong>Symptômes de la panne:</strong> {reparation.symptomesPanne}</p>
                                            <p><FaClock className="inline mr-2" /><strong>Heures de travail:</strong> {reparation.heures}</p>
                                            <p><FaClipboard className="inline mr-2" /><strong>Description:</strong> {reparation.description}</p>
                                            <p><FaCogs className="inline mr-2" /><strong>Pièces Changées:</strong> {reparation.piecesChangees.join(', ')}</p>
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

export default ListeRep;
