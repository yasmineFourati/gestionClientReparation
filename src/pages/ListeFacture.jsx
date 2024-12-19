import React, { useState, useEffect } from 'react';
import { FaEye, FaPrint, FaTimes, FaExclamationCircle } from 'react-icons/fa';
import Sidebar from '../components/Sidebarr';
import Footer from '../components/Footer';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ListeFacture = () => {
    const navigate = useNavigate();
    const [factures, setFactures] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedFacture, setSelectedFacture] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchInput, setSearchInput] = useState('');

    useEffect(() => {
        const fetchFactures = async () => {
            try {
                const response = await axios.get('http://localhost:8090/factures');
                setFactures(response.data);
            } catch (err) {
                console.error('Error fetching factures:', err);
                setError("Impossible de récupérer les factures.");
            } finally {
                setLoading(false);
            }
        };
        fetchFactures();
    }, []);

    const handleLogout = () => {
        navigate('/');
    };

    const openModal = (facture) => {
        setSelectedFacture(facture);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setSelectedFacture(null);
        setIsModalOpen(false);
    };

    const handlePrint = () => {
        const printContent = document.getElementById('facture-details');
        const printWindow = window.open('', '_blank');
        printWindow.document.write('<html><head><title>Facture</title><style>');
        printWindow.document.write(`
            body { font-family: Arial, sans-serif; margin: 20px; }
            .facture-details { font-size: 14px; margin-bottom: 20px; }
            .facture-details p { margin: 5px 0; }
            .facture-header { font-size: 18px; font-weight: bold; text-align: center; margin-bottom: 10px; }
            @media print { .no-print { display: none !important; } }
        `);
        printWindow.document.write('</style></head><body>');
        printWindow.document.write(printContent.innerHTML);
        printWindow.document.write('</body></html>');
        printWindow.document.close();
        printWindow.print();
    };

    const filteredFactures = factures.filter((facture) =>
        facture.reparation?.demandeReparation?.client.nom?.toLowerCase().includes(searchInput.toLowerCase())
    );

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen text-xl font-bold">
                <div className="animate-spin text-2xl text-blue-600">⏳ Chargement...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center min-h-screen text-red-600 text-xl">
                <div className="flex flex-col items-center">
                    <FaExclamationCircle className="text-5xl mb-4" />
                    <p>{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="bg-blue-600 text-white px-4 py-2 rounded mt-4 hover:bg-blue-700 transition"
                    >
                        Réessayer
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex">
            <Sidebar />
            <div className="flex-1 p-6 bg-gray-100 ml-64 min-h-screen">
                <header className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">Liste des Factures</h2>
                    <div className="flex items-center">
                        <input
                            type="text"
                            placeholder="Recherche par nom "
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

                <div className="bg-white shadow-lg rounded-lg p-6">
                    <table className="w-full border-collapse border border-gray-300 text-sm">
                        <thead>
                            <tr className="bg-gray-200 text-gray-700 text-left">
                                <th className="border p-3">Date</th>
                                <th className="border p-3">Montant Total (TND)</th>
                                <th className="border p-3">Client</th>
                                <th className="border p-3">Adresse</th>
                                <th className="border p-3">Téléphone</th>
                                <th className="border p-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredFactures.map((facture) => (
                                <tr key={facture.id} className="hover:bg-gray-100 transition">
                                    <td className="border p-3">{new Date(facture.date).toLocaleDateString()}</td>
                                    <td className="border p-3">{facture.montantTotal.toFixed(2)}</td>
                                    <td className="border p-3">
                                        {facture.reparation?.demandeReparation?.client.nom || 'Non défini'}
                                    </td>
                                    <td className="border p-3">
                                        {facture.reparation?.demandeReparation?.client.adresse || 'Non défini'}
                                    </td>
                                    <td className="border p-3">
                                        {facture.reparation?.demandeReparation?.client.numTel || 'Non défini'}
                                    </td>
                                    <td className="border p-3">
                                        <button
                                            onClick={() => openModal(facture)}
                                            className="bg-blue-600 text-white px-3 py-1 rounded-lg shadow hover:bg-blue-700 transition"
                                        >
                                            <FaEye className="inline mr-2" /> Voir Détails
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <br />
                <Footer />
            </div>

            {/* Modal */}
            {isModalOpen && selectedFacture && (
                <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center z-50">
                    <div className="bg-white rounded-lg shadow-lg p-6 w-96">
                        <h2 className="text-xl font-bold text-center mb-4 text-gray-700">
                            Facture #{selectedFacture.id}
                        </h2>
                        <div id="facture-details" className="facture-details text-gray-700 mb-6">
                            <p><strong>Date:</strong> {new Date(selectedFacture.date).toLocaleDateString()}</p>
                            <p><strong>Montant Total:</strong> {selectedFacture.montantTotal.toFixed(2)} TND</p>
                            <p><strong>Réparation:</strong> {selectedFacture.reparation?.id || 'Non défini'}</p>
                            <p><strong>Client:</strong> {selectedFacture.reparation?.demandeReparation?.client.nom || 'Non défini'}</p>
                            <p><strong>Adresse:</strong> {selectedFacture.reparation?.demandeReparation?.client.adresse || 'Non défini'}</p>
                            <p><strong>Téléphone:</strong> {selectedFacture.reparation?.demandeReparation?.client.numTel || 'Non défini'}</p>
                        </div>
                        <div className="flex justify-between">
                            <button
                                onClick={closeModal}
                                className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition"
                            >
                                <FaTimes className="inline mr-2" /> Fermer
                            </button>
                            <button
                                onClick={handlePrint}
                                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
                            >
                                <FaPrint className="inline mr-2" /> Imprimer
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ListeFacture;
