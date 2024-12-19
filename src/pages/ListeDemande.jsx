import React, { useState, useEffect, useMemo } from 'react';
import { FaPhone, FaMapMarkerAlt, FaPlus, FaWrench, FaLaptop, FaTag } from 'react-icons/fa';
import Sidebar from '../components/Sidebarr';
import Footer from '../components/Footer';
import { useNavigate } from 'react-router-dom';
import { QRCodeCanvas } from 'qrcode.react';


const ListeDemande = () => {
    const navigate = useNavigate();
    const [demandes, setDemandes] = useState([]);  // State for repair requests
    const [selectedDemande, setSelectedDemande] = useState(null); // State for selected request
    const [searchInput, setSearchInput] = useState(''); // Search input state
    const [loading, setLoading] = useState(false); // Loading state
    const [showModal, setShowModal] = useState(false); // State for modal visibility
    const [demandeToPrint, setDemandeToPrint] = useState(null); // State for the demande to print

    useEffect(() => {
        const fetchDemandes = async () => {
            setLoading(true);
            try {
                const response = await fetch('http://localhost:8090/demandes-reparation1');
                const data = await response.json();
                console.log(data); // Check the structure of the response
                setDemandes(data);
            } catch (error) {
                console.error("Erreur de récupération des demandes:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDemandes();
    }, []);

    const formatDate = (dateString) => {
        if (!dateString) return 'Date non disponible'; // Handle null or undefined values

        const date = new Date(dateString);
        if (isNaN(date.getTime())) return 'Date non disponible'; // Handle invalid date formats

        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return date.toLocaleDateString(undefined, options);
    };

    const handleLogout = () => {
        localStorage.removeItem('authToken');
        navigate('/');
    };

    const handleMoreInfo = (demande) => {
        setSelectedDemande(prevDemande => prevDemande === demande ? null : demande);
    };

    const handleOpenModal = (demande) => {
        setDemandeToPrint(demande);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setDemandeToPrint(null);
    };

    const handlePrint = () => {
        if (demandeToPrint) {
            window.print(); // Trigger the print dialog
        }
    };

    const filteredDemandes = useMemo(() =>
        demandes.filter(demande => demande.client.nom.toLowerCase().includes(searchInput.toLowerCase())),
        [demandes, searchInput]
    );

    return (
        <div className="flex">
            <Sidebar />
            <main className="flex-1 p-10 bg-gray-200 ml-64">
                <header className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">Liste des Demandes de Réparation</h2>
                    <div className="flex items-center">
                        <input
                            type="text"
                            placeholder="Recherche par nom de client"
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            className="border border-gray-300 p-2 rounded mr-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                            onClick={handleLogout}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-blue-700 transition duration-300"
                        >
                            Déconnexion
                        </button>
                    </div>
                </header>

                {/* Liste des demandes */}
                <div className="bg-white rounded-lg shadow-lg p-6 mb-10">
                    {loading ? (
                        <div className="flex justify-center items-center">
                            <div className="loader">Chargement...</div>
                        </div>
                    ) : (
                        <ul className="space-y-4">
                            {filteredDemandes.map(demande => (
                                <li key={demande.id} className="border-b pb-4">
                                    <div className="flex justify-between items-center">
                                        <div className="flex-1">
                                            <p className="font-semibold text-lg"><strong>Nom du client:</strong> {demande.client.nom}</p>
                                            <p><FaPhone className="inline mr-2" /><strong>Téléphone du client:</strong> {demande.client.numTel}</p>
                                            <p><FaLaptop className="inline mr-2" /><strong>Marque de l'appareil:</strong> {demande.appareil.marque || 'Marque non disponible'}</p> {/* Added brand */}
                                            <p><FaTag className="inline mr-2" /><strong>Modèle de l'appareil:</strong> {demande.appareil.modele || 'Modèle non disponible'}</p> {/* Added model */}
                                        </div>
                                        <div className="flex space-x-2">
                                            <button
                                                onClick={() => handleMoreInfo(demande)}
                                                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition flex items-center"
                                            >
                                                {selectedDemande === demande ? (
                                                    <><FaWrench className="inline mr-2" /> Moins d'infos</>
                                                ) : (
                                                    <><FaPlus className="inline mr-2" /> Plus d'infos</>
                                                )}
                                            </button>
                                            <button
                                                onClick={() => handleOpenModal(demande)}
                                                className="bg-orange-400 text-white px-4 py-2 rounded hover:bg-orange-700 transition"
                                            >
                                                Détails
                                            </button>
                                        </div>
                                    </div>

                                    {selectedDemande === demande && (
                                        <div className="mt-4 space-y-2">
                                            <div className="bg-gray-100 p-4 rounded-lg">
                                                <p><strong>Numéro de série:</strong> {demande.appareil.numSerie || 'Numéro de série non disponible'}</p> {/* Added serial number */}
                                                <p><strong>Date de remise:</strong> {demande.dateDepotAppareil ? formatDate(demande.dateDepotAppareil) : 'Date non disponible'}</p>
                                                <p><strong>Status:</strong> {demande.etat}</p> 
                                                <p><strong>Symptomes:</strong> {demande.symptomesPanne}</p>
                                            </div>
                                        </div>
                                    )}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
                <Footer />
            </main>

           {/* Modal for printing */}
{showModal && demandeToPrint && (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
        <div className="bg-white p-6 rounded-lg w-[600px]"> {/* Augmenter la largeur */}
            <h3 className="text-xl font-semibold mb-4">Informations de la demande</h3>
            <div className="flex">
                {/* Informations sur la demande */}
                <div className="flex-1">
                    <p><strong>Nom du client:</strong> {demandeToPrint.client.nom}</p>
                    <p><strong>Téléphone du client:</strong> {demandeToPrint.client.numTel}</p>
                    <p><strong>Marque de l'appareil:</strong> {demandeToPrint.appareil.marque}</p>
                    <p><strong>Modèle de l'appareil:</strong> {demandeToPrint.appareil.modele}</p>
                    <p><strong>Numéro de série:</strong> {demandeToPrint.appareil.numSerie}</p>
                    <p><strong>Date de remise:</strong> {demandeToPrint.dateDepotAppareil ? formatDate(demandeToPrint.dateDepotAppareil) : 'Date non disponible'}</p>
                    <p><strong>Status:</strong> {demandeToPrint.etat}</p>
                    <p><strong>Symptomes:</strong> {demandeToPrint.symptomesPanne}</p>
                </div>
                
                {/* QR Code */}
                <div className="ml-4">
                    <h4 className="font-bold">QR Code de la demande</h4>
                    <QRCodeCanvas
                        value={JSON.stringify({
                            nomClient: demandeToPrint.client.nom,
                            telephone: demandeToPrint.client.numTel,
                            marque: demandeToPrint.appareil.marque,
                            modele: demandeToPrint.appareil.modele,
                            numSerie: demandeToPrint.appareil.numSerie,
                            dateDepot: demandeToPrint.dateDepotAppareil,
                            statut: demandeToPrint.etat,
                            symptomes: demandeToPrint.symptomesPanne,
                        })}
                        size={150}
                        className="mt-2"
                    />
                </div>
            </div>
            <div className="mt-4 flex justify-end">
                <button
                    onClick={handleCloseModal}
                    className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition"
                >
                    Fermer
                </button>
                <button
                    onClick={handlePrint}
                    className="bg-blue-600 text-white px-4 py-2 rounded ml-2 hover:bg-blue-700 transition"
                >
                    Imprimer
                </button>
            </div>
        </div>
    </div>
)}


        </div>
    );
};

export default ListeDemande;
