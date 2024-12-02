import React, { useState } from 'react';
import { FaFileInvoice, FaArchive } from 'react-icons/fa';
import Sidebar from '../components/Sidebarr';
import Footer from '../components/Footer';
import { useNavigate } from 'react-router-dom';

const ListeFacture = () => {
    const navigate = useNavigate();
    const [factures, setFactures] = useState([
        {
            id: 1,
            numeroFacture: 'F001',
            clientNom: 'Yasmine',
            total: 3500,
            dateEmission: '2024-10-20',
            statut: 'Payée',
            reparations: [
                { description: 'Réparation de la carte mère', prix: 1500 },
                { description: 'Remplacement de la batterie', prix: 800 }
            ],
        },
        {
            id: 2,
            numeroFacture: 'F002',
            clientNom: 'Baya',
            total: 3200,
            dateEmission: '2024-10-19',
            statut: 'En attente',
            reparations: [
                { description: 'Remplacement de l\'écran', prix: 1200 },
                { description: 'Réparation du disque dur', prix: 2000 }
            ],
        },
        // Ajout des nouvelles factures
        {
            id: 3,
            numeroFacture: 'F003',
            clientNom: 'Ibrahim',
            total: 2700,
            dateEmission: '2024-11-01',
            statut: 'Payée',
            reparations: [
                { description: 'Réparation de la carte graphique', prix: 1300 },
                { description: 'Remplacement du disque dur', prix: 1400 }
            ],
        },
        {
            id: 4,
            numeroFacture: 'F004',
            clientNom: 'Amina',
            total: 4500,
            dateEmission: '2024-11-10',
            statut: 'En attente',
            reparations: [
                { description: 'Réparation du clavier', prix: 2000 },
                { description: 'Remplacement de la carte mère', prix: 2500 }
            ],
        },
    ]);

    const [selectedFacture, setSelectedFacture] = useState(null);
    const [searchInput, setSearchInput] = useState('');

    const handleMoreInfo = (facture) => {
        setSelectedFacture(selectedFacture === facture ? null : facture);
    };

    const handleLogout = () => {
        localStorage.removeItem('authToken');
        navigate('/');
    };

    const handleArchive = (id) => {
        setFactures(factures.filter(facture => facture.id !== id));
        alert(`La facture avec le numéro ${id} a été archivée.`);
    };

    const filteredFactures = factures.filter(facture =>
        facture.clientNom.toLowerCase().includes(searchInput.toLowerCase())
    );

    return (
        <div className="flex">
            <Sidebar />
            <main className="flex-1 p-10 bg-gray-200 ml-64">
                {/* Header Section */}
                <header className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">Liste des Factures</h2>
                    <div className="flex items-center space-x-4">
                        {/* Search Input */}
                        <input
                            type="text"
                            placeholder="Recherche par nom du client"
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            className="border p-3 rounded-lg w-80"
                        />
                        {/* Logout Button */}
                        <button
                            onClick={handleLogout}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-blue-700 transition duration-300"
                        >
                            Déconnexion
                        </button>
                    </div>
                </header>

                {/* Factures List */}
                <div className="bg-white shadow-md rounded-lg p-6">
                    <table className="w-full mb-8 text-gray-700">
                        <thead>
                            <tr className="bg-gray-200">
                                <th className="border px-4 py-2">Numéro de facture</th>
                                <th className="border px-4 py-2">Client</th>
                                <th className="border px-4 py-2">Total</th>
                                <th className="border px-4 py-2">Statut</th>
                                <th className="border px-2 py-2 w-32 text-center">Actions</th> {/* Réduire la largeur de la colonne */}
                            </tr>
                        </thead>
                        <tbody>
                            {filteredFactures.map((facture) => (
                                <tr key={facture.id} className="border-t">
                                    <td className="border px-4 py-2">{facture.numeroFacture}</td>
                                    <td className="border px-4 py-2">{facture.clientNom}</td>
                                    <td className="border px-4 py-2">{facture.total} TDN</td>
                                    <td className="border px-4 py-2">{facture.statut}</td>
                                    <td className="border px-2 py-2 text-center">
                                        {/* Détails et Archive Buttons (Côte à Côte) */}
                                        <div className="flex justify-center space-x-1">
                                            <button
                                                onClick={() => handleMoreInfo(facture)}
                                                className="flex items-center bg-blue-500 text-white p-1.5 rounded hover:bg-blue-600 transition duration-300"
                                                aria-label="Afficher plus de détails"
                                            >
                                                <FaFileInvoice className="mr-1 text-sm" />
                                                Détails
                                            </button>
                                            <button
                                                onClick={() => handleArchive(facture.id)}
                                                className="flex items-center bg-red-500 text-white p-1.5 rounded hover:bg-red-600 transition duration-300"
                                                aria-label="Archiver"
                                            >
                                                <FaArchive className="mr-1 text-sm" />
                                                Archiver
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Facture Details */}
                {selectedFacture && (
                    <div className="mt-8 bg-white shadow-md rounded-lg p-6">
                        <h3 className="text-xl font-bold mb-4">Détails de la Facture #{selectedFacture.numeroFacture}</h3>
                        <p><strong>Client:</strong> {selectedFacture.clientNom}</p>
                        <p><strong>Date d'émission:</strong> {selectedFacture.dateEmission}</p>
                        <p><strong>Statut:</strong> {selectedFacture.statut}</p>
                        <h4 className="mt-4 font-semibold">Réparations:</h4>
                        <ul>
                            {selectedFacture.reparations.map((reparation, index) => (
                                <li key={index} className="ml-6">{reparation.description} - {reparation.prix} TDN</li>
                            ))}
                        </ul>
                        <div className="mt-4 font-bold">
                            <p><strong>Total:</strong> {selectedFacture.total} TDN</p>
                        </div>
                    </div>
                )}
<br></br>
                <Footer />
            </main>
        </div>
    );
};

export default ListeFacture;
