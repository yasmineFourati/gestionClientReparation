import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebarr'; // Make sure the Sidebar component is correctly imported.
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';
import axios from 'axios';
import { FaPlus } from 'react-icons/fa';

const DemandeRep = () => {
    const navigate = useNavigate();

    const [clients, setClients] = useState([]);
    const [appareils, setAppareils] = useState([]);
    const [nouvelleDemande, setNouvelleDemande] = useState({
        client_id: "",
        appareil_id: "",
        symptomesPanne: '',
        dateDepotAppareil: new Date().toISOString().split('T')[0],
        datePrevueRep: '',
        etat: "En cours",
    });
    const [clientInfo, setClientInfo] = useState({ adresse: '', numeroTel: '' });
    const [appareilInfo, setAppareilInfo] = useState({ numSerie: '', modele: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // Chargement des clients et des appareils
    useEffect(() => {
        setLoading(true);
        const fetchData = async () => {
            try {
                const [clientsResponse, appareilsResponse] = await Promise.all([
                    axios.get('http://localhost:8090/clients'),
                    axios.get('http://localhost:8090/appareils'),
                ]);
                setClients(clientsResponse.data);
                setAppareils(appareilsResponse.data);
            } catch (err) {
                console.error('Erreur lors de la récupération des données :', err);
                setError('Une erreur est survenue lors de la récupération des données.');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNouvelleDemande((prevState) => ({
            ...prevState,
            [name]: value,
        }));

        // Mettre à jour les informations supplémentaires en fonction de la sélection
        if (name === "client_id") {
            const selectedClient = clients.find(client => client.id === value);
            setClientInfo({
                adresse: selectedClient ? selectedClient.adresse : '',
                numeroTel: selectedClient ? selectedClient.numeroTel : ''
            });
        }

        if (name === "appareil_id") {
            const selectedAppareil = appareils.find(appareil => appareil.id === value);
            setAppareilInfo({
                numSerie: selectedAppareil ? selectedAppareil.numSerie : '',
                modele: selectedAppareil ? selectedAppareil.modele : ''
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (Object.values(nouvelleDemande).some((value) => !value)) {
            setError('Tous les champs sont obligatoires.');
            return;
        }

        try {
            setLoading(true);

            // Préparation des données pour l'envoi
            const demandeData = {
                dateDepotAppareil: nouvelleDemande.dateDepotAppareil,
                datePrevueRep: nouvelleDemande.datePrevueRep,
                etat: nouvelleDemande.etat,
                symptomesPanne: nouvelleDemande.symptomesPanne,
                client: { id: nouvelleDemande.client_id },
                appareil: { id: nouvelleDemande.appareil_id },
            };

            const response = await axios.post('http://localhost:8090/demande-reparation', demandeData);
            setNouvelleDemande({
                client_id: "",
                appareil_id: "",
                symptomesPanne: '',
                dateDepotAppareil: new Date().toISOString().split('T')[0],
                datePrevueRep: '',
                etat: "En cours",
            });
            setError('');
            navigate('/listedemande');
        } catch (err) {
            console.error('Erreur API POST:', err.response || err.message);
            setError('Une erreur est survenue lors de l\'ajout de la demande.');
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('authToken');
        navigate('/');
    };

    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            <Sidebar />
            <main className="flex-1 p-10 bg-gray-100 ml-64">
                <header className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">Créer une Demande de Réparation</h2>
                    <div className="flex items-center">
                        <button
                            onClick={() => navigate('/listedemande')}
                            className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition duration-200 mr-4"
                        >
                            Liste des Demandes
                        </button>
                        <button
                            onClick={handleLogout}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-blue-700 transition duration-300"
                        >
                            Déconnexion
                        </button>
                    </div>
                </header>

                <div className="bg-white rounded-lg shadow-xl p-6 mb-6">
                    <h3 className="text-lg font-bold mb-4">Ajouter une Nouvelle Demande de Réparation</h3>
                    {error && <p className="text-red-500 mb-4">{error}</p>}

                    <form onSubmit={handleSubmit}>
                        <div className="mb-4 flex space-x-4">
                            <div className="w-1/2">
                                <label htmlFor="client_id" className="block text-sm font-semibold mb-2">Sélectionner un Client</label>
                                <select
                                    id="client_id"
                                    name="client_id"
                                    value={nouvelleDemande.client_id}
                                    onChange={handleChange}
                                    className="w-full p-3 border-2 border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-300 ease-in-out"
                                    required
                                >
                                    <option value="">Sélectionnez un client</option>
                                    {clients.map((client) => (
                                        <option key={client.id} value={client.id}>
                                            {client.nom}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="w-1/2">
                                <label htmlFor="appareil_id" className="block text-sm font-semibold mb-2">Sélectionner un Appareil</label>
                                <select
                                    id="appareil_id"
                                    name="appareil_id"
                                    value={nouvelleDemande.appareil_id}
                                    onChange={handleChange}
                                    className="w-full p-3 border-2 border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-300 ease-in-out"
                                    required
                                >
                                    <option value="">Sélectionnez un appareil</option>
                                    {appareils.map((appareil) => (
                                        <option key={appareil.id} value={appareil.id}>
                                            {`${appareil.marque} - ${appareil.modele} `}
                                        </option>
                                    ))}
                                </select>

                            </div>
                        </div>


                        {/* Afficher les informations du client */}
                        {clientInfo.adresse && (
                            <div className="mb-4">
                                <label className="block text-sm font-semibold mb-2">Adresse Client</label>
                                <input
                                    type="text"
                                    value={clientInfo.adresse}
                                    readOnly
                                    className="w-full p-2 border-2 border-gray-300 rounded-lg"
                                />
                            </div>
                        )}
                        {clientInfo.numeroTel && (
                            <div className="mb-4">
                                <label className="block text-sm font-semibold mb-2">Numéro de Téléphone Client</label>
                                <input
                                    type="text"
                                    value={clientInfo.numeroTel}
                                    readOnly
                                    className="w-full p-2 border-2 border-gray-300 rounded-lg"
                                />
                            </div>
                        )}

                        {/* Afficher les informations de l'appareil */}
                        {appareilInfo.numSerie && (
                            <div className="mb-4">
                                <label className="block text-sm font-semibold mb-2">Numéro de Série Appareil</label>
                                <input
                                    type="text"
                                    value={appareilInfo.numSerie}
                                    readOnly
                                    className="w-full p-2 border-2 border-gray-300 rounded-lg"
                                />
                            </div>
                        )}
                        {appareilInfo.modele && (
                            <div className="mb-4">
                                <label className="block text-sm font-semibold mb-2">Modèle Appareil</label>
                                <input
                                    type="text"
                                    value={appareilInfo.modele}
                                    readOnly
                                    className="w-full p-2 border-2 border-gray-300 rounded-lg"
                                />
                            </div>
                        )}

                        <div className="mb-4">
                            <label htmlFor="symptomesPanne" className="block text-sm font-semibold mb-2">Symptômes de la panne</label>
                            <textarea
                                id="symptomesPanne"
                                name="symptomesPanne"
                                placeholder="Décrire le problème"
                                value={nouvelleDemande.symptomesPanne}
                                onChange={handleChange}
                                className="w-full p-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                                required
                            ></textarea>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="mb-4">
                                <label htmlFor="dateDepotAppareil" className="block text-sm font-semibold mb-2">Date de Dépôt</label>
                                <input
                                    type="date"
                                    id="dateDepotAppareil"
                                    name="dateDepotAppareil"
                                    value={nouvelleDemande.dateDepotAppareil}
                                    onChange={handleChange}
                                    className="w-full p-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                                    required
                                />
                            </div>

                            <div className="mb-4">
                                <label htmlFor="datePrevueRep" className="block text-sm font-semibold mb-2">Date Prévue de Retour</label>
                                <input
                                    type="date"
                                    id="datePrevueRep"
                                    name="datePrevueRep"
                                    value={nouvelleDemande.datePrevueRep}
                                    onChange={handleChange}
                                    className="w-full p-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                                    required
                                />
                            </div>
                        </div>

                        <div className="flex justify-center">
                            <button
                                type="submit"
                                className="flex items-center bg-green-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-green-700 transition duration-300 ease-in-out transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 mx-auto block"
                                disabled={loading}
                            >
                                <FaPlus className="inline-block mr-2" />
                                {loading ? 'En cours...' : 'Ajouter Demande'}
                            </button>
                        </div>
                    </form>
                </div>
                <Footer />
            </main>
            
        </div>
    );
};

export default DemandeRep;
