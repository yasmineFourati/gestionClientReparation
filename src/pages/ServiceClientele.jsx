import React, { useState } from 'react';
import Sidebar from '../components/Sidebarr';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';
import { FaUser, FaPhone, FaHome, FaLaptop, FaBarcode, FaCalendarAlt, FaPlus } from 'react-icons/fa';
///////////la redirection vers la liste des clients en ajoutant un client (bouton onclick)
const ServiceClientele = () => {
    const navigate = useNavigate();

    const [clients, setClients] = useState([
        { id: 1, nom: 'Soussou', telephone: '123456789', adresse: 'manzel cheker', referenceOrdinateur: 'REF001', etatReparation: 'En cours' },
        { id: 2, nom: 'Pablo', telephone: '987654321', adresse: 'matar', referenceOrdinateur: 'REF002', etatReparation: 'Terminé' }
    ]);

    const [nouveauClient, setNouveauClient] = useState({
        nom: '',
        telephone: '',
        adresse: '',
        marqueAppareil: '',
        modeleAppareil: '',
        numeroSerie: '',
        symptomesPanne: '',
        dateDepot: '',
        dateRemise: '',
        etatReparation: 'En attente de confirmation',
    });

    const [error, setError] = useState('');

    const ajouterClient = (e) => {
        e.preventDefault();
        const isEmpty = Object.values(nouveauClient).some(value => value === '');
        if (isEmpty) {
            setError('Tous les champs sont obligatoires.');
            return;
        }

        const clientExists = clients.some(client =>
            client.nom === nouveauClient.nom &&
            client.telephone === nouveauClient.telephone &&
            client.adresse === nouveauClient.adresse
        );

        if (clientExists) {
            setError('Ce client existe déjà.');
            return;
        }

        const newClient = { ...nouveauClient, id: clients.length + 1 };
        setClients(prevClients => [...prevClients, newClient]);

        setNouveauClient({
            nom: '',
            telephone: '',
            adresse: '',
            marqueAppareil: '',
            modeleAppareil: '',
            numeroSerie: '',
            symptomesPanne: '',
            dateDepot: '',
            dateRemise: '',
            etatReparation: 'En attente de confirmation',
        });
        setError('');
        console.log('Clients après ajout:', [...clients, newClient]);

        navigate('/listeclient');
    };

    const handleLogout = () => {
        localStorage.removeItem('authToken');
        navigate('/');
    };

    return (
        <div className="flex flex-col min-h-screen">
            <Sidebar />
            <main className="flex-1 p-10 bg-gray-100 ml-64">
                <header className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">Gestion du Service Clientèle</h2>
                    <div className="flex items-center">
                        <button
                            onClick={() => navigate('/listeclient')}
                            className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition mr-4"
                        >
                            Liste des Clients
                        </button>
                        <button
                            onClick={handleLogout}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-blue-700 transition duration-300"
                        >
                            Déconnexion
                        </button>
                    </div>
                </header>

                <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
                    <h3 className="text-lg font-bold mb-4">Ajouter un Nouveau Client</h3>
                    {error && <p className="text-red-500 mb-4">{error}</p>}

                    {/* Section Informations Client */}
                    <div className="mb-6">
                        <h4 className="text-gray-700 font-bold mb-2">Informations sur le client</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {['nom', 'telephone', 'adresse'].map((field, index) => (
                                <div className="relative" key={index}>
                                    {field === 'nom' && <FaUser className="absolute top-3 left-3 text-gray-500" />}
                                    {field === 'telephone' && <FaPhone className="absolute top-3 left-3 text-gray-500" />}
                                    {field === 'adresse' && <FaHome className="absolute top-3 left-3 text-gray-500" />}
                                    <input
                                        type="text"
                                        placeholder={`Entrer ${field === 'nom' ? 'le nom' : field === 'telephone' ? 'le téléphone' : 'l\'adresse'}`}
                                        className="border border-gray-300 pl-10 p-2 w-full rounded hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        value={nouveauClient[field]}
                                        onChange={(e) => setNouveauClient({ ...nouveauClient, [field]: e.target.value })}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Section Informations Appareil */}
                    <div className="mb-6">
                        <h4 className="text-gray-700 font-bold mb-2">Informations sur l'appareil</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {['marqueAppareil', 'modeleAppareil', 'numeroSerie'].map((field, index) => (
                                <div className="relative" key={index}>
                                    {field === 'marqueAppareil' && <FaLaptop className="absolute top-3 left-3 text-gray-500" />}
                                    {field === 'modeleAppareil' && <FaLaptop className="absolute top-3 left-3 text-gray-500" />}
                                    {field === 'numeroSerie' && <FaBarcode className="absolute top-3 left-3 text-gray-500" />}
                                    <input
                                        type="text"
                                        placeholder={`Entrer ${field === 'marqueAppareil' ? 'la marque' : field === 'modeleAppareil' ? 'le modèle' : 'le numéro de série'}`}
                                        className="border border-gray-300 pl-10 p-2 w-full rounded hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        value={nouveauClient[field]}
                                        onChange={(e) => setNouveauClient({ ...nouveauClient, [field]: e.target.value })}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Section Symptômes de Panne */}
                    <div className="mb-6">
                        <h4 className="text-gray-700 font-bold mb-2">Symptômes de la panne</h4>
                        <textarea
                            placeholder="Décrivez les symptômes de la panne"
                            className="border border-gray-300 p-2 w-full rounded hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={nouveauClient.symptomesPanne}
                            onChange={(e) => setNouveauClient({ ...nouveauClient, symptomesPanne: e.target.value })}
                        />
                    </div>

                    {/* Section Dates */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        {['dateDepot', 'dateRemise'].map((field, index) => (
                            <div className="relative" key={index}>
                                <FaCalendarAlt className="absolute top-3 left-3 text-gray-500" />
                                <input
                                    type="date"
                                    className="border border-gray-300 pl-10 p-2 w-full rounded hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={nouveauClient[field]}
                                    onChange={(e) => setNouveauClient({ ...nouveauClient, [field]: e.target.value })}
                                />
                            </div>
                        ))}
                    </div>

                    
                    <button
                        onClick={ajouterClient}
                        className="flex items-center bg-green-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-green-700 transition duration-300 ease-in-out transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
                        >
                        <FaPlus className="inline-block mr-2" />
                        Ajouter Client
                    </button>
                </div>
                <Footer />

            </main>
        </div>
    );
};

export default ServiceClientele;
