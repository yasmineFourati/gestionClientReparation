import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebarr';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';
import { FaUser, FaPhone, FaHome, FaLaptop, FaBarcode, FaPlus } from 'react-icons/fa';
import axios from 'axios';

const ServiceClientele = () => {
    const navigate = useNavigate();

    const [clients, setClients] = useState([]);
    const [nouveauClient, setNouveauClient] = useState({
        nom: '',
        adresse: '',
        numTel: '',
    });
    const [nouvelAppareil, setNouvelAppareil] = useState({
        marque: '',
        modele: '',
        numSerie: '',
    });
    const [error, setError] = useState('');
    const [appareils, setAppareils] = useState([]);
    const [isClientAdded, setIsClientAdded] = useState(false); // Nouvel état

    useEffect(() => {
        axios.get('http://localhost:8090/clients')
            .then(response => setClients(response.data))
            .catch(error => console.error("Problème de récupération des clients:", error));

        axios.get('http://localhost:8090/appareils')
            .then(response => setAppareils(response.data))
            .catch(error => console.error("Problème de récupération des appareils:", error));
    }, []);

    const ajouterClient = (e) => {
        e.preventDefault();
        
        if (Object.values(nouveauClient).some(value => value === '')) {
            setError('Tous les champs client sont obligatoires.');
            return;
        }

        axios.post('http://localhost:8090/client', nouveauClient)
            .then(response => {
                setClients([...clients, response.data]);
                setNouveauClient({ nom: '', adresse: '', numTel: '' });
                setError('');
                setIsClientAdded(true); // Désactiver la section client
                navigate('/listeclient'); // Redirection vers la liste des clients
            })
            .catch(error => {
                console.error("Erreur lors de l'ajout du client:", error.response || error);
                setError('Une erreur est survenue lors de l\'ajout du client.');
            });
    };

    const ajouterAppareil = (e) => {
        e.preventDefault();
        if (Object.values(nouvelAppareil).some(value => value === '')) {
            setError('Tous les champs appareil sont obligatoires.');
            return;
        }

        axios.post('http://localhost:8090/appareil', nouvelAppareil)
            .then(response => {
                setAppareils([...appareils, response.data]);
                setNouvelAppareil({ marque: '', modele: '', numSerie: '' });
                setError('');
                navigate('/listeapp');
            })
            .catch(error => {
                console.error("Erreur lors de l'ajout de l'appareil:", error.response || error);
                setError('Une erreur est survenue lors de l\'ajout de l\'appareil.');
            });
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
                            className="bg-yellow-700 text-white px-4 py-2 rounded hover:bg-yellow-500 transition mr-4"
                        >
                            Liste des Clients
                        </button>
                        <button
                            onClick={() => navigate('/listeapp')}
                            className="bg-yellow-700 text-white px-4 py-2 rounded hover:bg-yellow-500 transition mr-4"
                        >
                            Liste des Appareils
                        </button>
                        <button
                            onClick={handleLogout}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-blue-700 transition duration-300"
                        >
                            Déconnexion
                        </button>
                    </div>
                </header>

                {/* Section Client */}
                <div
                    className={`bg-white rounded-lg shadow-lg p-6 mb-6 ${
                        isClientAdded ? 'opacity-50 pointer-events-none' : ''
                    }`}
                >
                    <h3 className="text-lg font-bold mb-4">Ajouter un Nouveau Client</h3>
                    {error && <p className="text-red-500 mb-4">{error}</p>}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        {['nom', 'numTel', 'adresse'].map((field, index) => (
                            <div className="relative" key={index}>
                                {field === 'nom' && <FaUser className="absolute top-3 left-3 text-gray-500" />}
                                {field === 'numTel' && <FaPhone className="absolute top-3 left-3 text-gray-500" />}
                                {field === 'adresse' && <FaHome className="absolute top-3 left-3 text-gray-500" />}
                                <input
                                    type="text"
                                    placeholder={`Entrer ${field === 'nom' ? 'le nom' : field === 'numTel' ? 'le numéro de téléphone' : 'l\'adresse'}`}
                                    className="border border-gray-300 pl-10 p-2 w-full rounded hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={nouveauClient[field]}
                                    onChange={(e) => setNouveauClient({ ...nouveauClient, [field]: e.target.value })}
                                    disabled={isClientAdded} // Désactiver les champs
                                />
                            </div>
                        ))}
                    </div>

                    <button
                        onClick={ajouterClient}
                        className="flex items-center bg-green-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-green-700 transition duration-300 ease-in-out transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 mx-auto block"
                        disabled={isClientAdded} // Désactiver le bouton
                    >
                        <FaPlus className="inline-block mr-2" />
                        
                        Ajouter Client
                    </button>
                </div>

                {/* Section Appareil */}
                <div className="bg-white rounded-lg shadow-lg p-6">
                    <h3 className="text-lg font-bold mb-4">Ajouter un Appareil</h3>
                    {error && <p className="text-red-500 mb-4">{error}</p>}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        {['marque', 'modele', 'numSerie'].map((field, index) => (
                            <div className="relative" key={index}>
                                {field === 'marque' && <FaLaptop className="absolute top-3 left-3 text-gray-500" />}
                                {field === 'modele' && <FaLaptop className="absolute top-3 left-3 text-gray-500" />}
                                {field === 'numSerie' && <FaBarcode className="absolute top-3 left-3 text-gray-500" />}
                                <input
                                    type="text"
                                    placeholder={`Entrer ${field === 'marque' ? 'la marque' : field === 'modele' ? 'le modèle' : 'le numéro de série'}`}
                                    className="border border-gray-300 pl-10 p-2 w-full rounded hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={nouvelAppareil[field]}
                                    onChange={(e) => setNouvelAppareil({ ...nouvelAppareil, [field]: e.target.value })}
                                />
                            </div>
                        ))}
                    </div>

                    <button
                        onClick={ajouterAppareil}
                        className="flex items-center bg-green-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-green-700 transition duration-300 ease-in-out transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 mx-auto block"
                    >
                        <FaPlus className="inline-block mr-2" />
                        Ajouter Appareil
                    </button>
                </div>
                <br />
                <Footer />
            </main>
        </div>
    );
};

export default ServiceClientele;
