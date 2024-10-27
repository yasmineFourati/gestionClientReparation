import React, { useState } from 'react';
import Sidebar from '../components/Sidebarr';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';
import { FaUser, FaPhone, FaHome, FaLaptop, FaBarcode, FaCalendarAlt } from 'react-icons/fa';
import ListeClients from './ListeClients';
import { FaPlus } from 'react-icons/fa'

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
        etatReparation: ['En attente'],
    });

    const [error, setError] = useState('');

    const ajouterClient = () => {
        if (!nouveauClient.nom || !nouveauClient.telephone || !nouveauClient.adresse || !nouveauClient.marqueAppareil || !nouveauClient.modeleAppareil || !nouveauClient.numeroSerie || !nouveauClient.symptomesPanne || !nouveauClient.dateDepot || !nouveauClient.dateRemise) {
            setError('Tous les champs sont obligatoires.');
            return;
        }

        setClients([...clients, { ...nouveauClient, id: clients.length + 1, etatReparation: 'En attente de confirmation' }]);
        setNouveauClient({ nom: '', telephone: '', adresse: '', marqueAppareil: '', modeleAppareil: '', numeroSerie: '', symptomesPanne: '', dateDepot: '', dateRemise: '', etatReparation: [] });
        setError('');
    };

    const handleLogout = () => {
        localStorage.removeItem('authToken');
        navigate('/');
    };

    return (
        <div className="flex">
            <Sidebar />
            <main className="flex-1 p-10 bg-gray-100 ml-64">
                <header className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">Gestion du Service Clientèle</h2>
                    <div className="flex items-center">
                        <button
                            onClick={() => navigate('/listeclient')} /////////////////////
                            className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition mr-4"
                        >
                            Liste des Clients
                        </button>
                        <button
                            onClick={handleLogout}
                            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
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

                    {/* Section État de Réparation */}
                    <div className="mb-6">
                        <h4 className="text-gray-700 font-bold mb-2">État de réparation</h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {['En attente', 'En cours', 'Terminé'].map((etat) => (
                                <label className="flex items-center cursor-pointer transition-transform transform hover:scale-105" key={etat}>
                                    <input
                                        type="radio" // Changer à radio pour une sélection unique
                                        value={etat}
                                        className="form-radio h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                        checked={nouveauClient.etatReparation[0] === etat} // Vérifier si l'état correspond
                                        onChange={(e) => {
                                            setNouveauClient({ ...nouveauClient, etatReparation: [e.target.value] }); // Mettre à jour l'état
                                        }}
                                    />
                                    <span className="ml-2 text-gray-800 font-semibold hover:text-blue-600">{etat}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Section Date de Dépôt et Date de Remise */}
                    <div className="mb-6">
                        <h4 className="text-gray-700 font-bold mb-4">Dates</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {['dateDepot', 'dateRemise'].map((field, index) => (
                                <div className="relative" key={index}>
                                    <label className="block text-gray-700 font-semibold mb-1">
                                        {field === 'dateDepot' ? 'Date de dépôt' : 'Date de remise'}
                                    </label>
                                    <FaCalendarAlt className="absolute top-10 left-3 text-gray-500" />
                                    <input
                                        type="date"
                                        className="border border-gray-300 pl-10 p-2 w-full rounded hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        value={nouveauClient[field]}
                                        onChange={(e) => setNouveauClient({ ...nouveauClient, [field]: e.target.value })}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    <button
                        onClick={ajouterClient}
                        className="flex items-center justify-center bg-green-600 text-white px-4 py-2 rounded-md shadow-lg hover:bg-green-700 transition duration-300 ease-in-out transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
                    >
                        <FaPlus className="mr-2" />
                        Ajouter Client
                    </button>
                </div>


                <Footer />


            </main>
        </div>
    );
};

export default ServiceClientele;
