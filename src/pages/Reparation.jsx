import React, { useState } from 'react';
import Sidebar from '../components/Sidebarr';
import Footer from '../components/Footer';
import { FaClock, FaPlus, FaMinus, FaTools, FaSave } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const Reparation = () => {
    const clients = [
        {
            id: 1,
            nom: 'Jean Dupont',
            ordinateur: {
                marque: 'HP',
                modele: 'EliteBook 840',
                numeroSerie: 'HP123456',
                symptomes: 'Lenteur au démarrage',
            },
        },
        {
            id: 2,
            nom: 'Marie Curie',
            ordinateur: {
                marque: 'Dell',
                modele: 'XPS 13',
                numeroSerie: 'DE987654',
                symptomes: 'Écran bleu aléatoire',
            },
        },
        {
            id: 3,
            nom: 'Ahmed Ben Salah',
            ordinateur: {
                marque: 'Lenovo',
                modele: 'ThinkPad T14',
                numeroSerie: 'LE112233',
                symptomes: 'Batterie ne charge pas',
            },
        },
    ];
    const navigate = useNavigate();

    const piecesCatalogue = [
        { id: 1, nom: "Pièce 1", marque: "HP" },
        { id: 2, nom: "Pièce 2", marque: "Dell" },
        { id: 3, nom: "Pièce 3", marque: "Lenovo" },
        { id: 4, nom: "Pièce 4", marque: "HP" },
    ];

    const [selectedClient, setSelectedClient] = useState(clients[0]);
    const [reparation, setReparation] = useState({
        ordinateur: '',
        heures: '',
        description: '',
        piecesChangees: [''],
    });
    const [error, setError] = useState('');

    const handleSelectChange = (event) => {
        const clientId = parseInt(event.target.value, 10);
        const client = clients.find((c) => c.id === clientId);
        setSelectedClient(client);
    };

    const addPiece = () => {
        setReparation({
            ...reparation,
            piecesChangees: [...reparation.piecesChangees, ''],
        });
    };

    const removePiece = () => {
        if (reparation.piecesChangees.length > 1) {
            setReparation({
                ...reparation,
                piecesChangees: reparation.piecesChangees.slice(0, -1),
            });
        }
    };

    const handlePieceChange = (index, value) => {
        const newPieces = [...reparation.piecesChangees];
        newPieces[index] = value;
        setReparation({ ...reparation, piecesChangees: newPieces });
    };

    const filteredPieces = piecesCatalogue.filter(
        (piece) => piece.marque === selectedClient.ordinateur.marque
    );

    const ajouterReparation = () => {
        if (!reparation.ordinateur || !reparation.heures || !reparation.description) {
            setError('Tous les champs sont requis.');
        } else {
            setError('');
            // Handle adding the repair (e.g., API call or state update)
            console.log('Réparation ajoutée', reparation);
        }
    };

    return (
        <div className="flex">
            <Sidebar />
            <main className="flex-1 p-10 bg-gray-50 ml-64 min-h-screen">
                <header className="flex justify-between items-center mb-8">
                    <h2 className="text-2xl font-bold text-gray-800">Fiche de Réparation</h2>
                    <div className="flex space-x-4">
                        <button
                            onClick={() => navigate('/listerep')}
                            className="bg-gray-600 text-white px-4 py-2 rounded shadow-md hover:bg-gray-700 transition duration-200 ease-in-out">
                            Liste des Réparations
                        </button>
                        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-blue-700 transition duration-300">
                            Déconnexion
                        </button>
                    </div>
                </header>

                <div className="bg-white p-8 mb-6 rounded-lg shadow-md border border-gray-200">
                    <h3 className="text-xl font-semibold mb-6 text-gray-700">Données du Client & son Appareil</h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div>
                            <label className="text-gray-700 font-medium mb-2 block">Nom du Client</label>
                            <select
                                className="border border-gray-300 p-3 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                                onChange={handleSelectChange}
                                value={selectedClient.id}
                            >
                                {clients.map((client) => (
                                    <option key={client.id} value={client.id}>
                                        {client.nom}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="text-gray-700 font-medium mb-2 block">Marque de l'Ordinateur</label>
                            <input
                                type="text"
                                className="border border-gray-300 p-3 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                                value={selectedClient.ordinateur.marque}
                                disabled
                            />
                        </div>

                        <div>
                            <label className="text-gray-700 font-medium mb-2 block">Numéro de Série</label>
                            <input
                                type="text"
                                className="border border-gray-300 p-3 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                                value={selectedClient.ordinateur.numeroSerie}
                                disabled
                            />
                        </div>

                        <div>
                            <label className="text-gray-700 font-medium mb-2 block">Modèle de l'Ordinateur</label>
                            <input
                                type="text"
                                className="border border-gray-300 p-3 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                                value={selectedClient.ordinateur.modele}
                                disabled
                            />
                        </div>

                        <div>
                            <label className="text-gray-700 font-medium mb-2 block">Symptômes</label>
                            <input
                                type="text"
                                className="border border-gray-300 p-3 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                                value={selectedClient.ordinateur.symptomes}
                                disabled
                            />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-md p-8 mb-6 border border-gray-200">
                    <h3 className="text-xl font-semibold mb-6 text-gray-700">Ajouter une Réparation</h3>
                    {error && <p className="text-red-500 mb-4">{error}</p>}

                    <div className="mb-5">
                        <label className="text-gray-700 font-medium mb-2 block">Heures</label>
                        <div className="relative">
                            <FaClock className="absolute top-4 left-3 text-gray-400" />
                            <input
                                type="number"
                                placeholder="Entrer le nombre d'heures estimé pour la réparation"
                                className="border border-gray-300 p-3 pl-10 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                                value={reparation.heures}
                                onChange={(e) => setReparation({ ...reparation, heures: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="mb-5">
                        <label className="text-gray-700 font-medium mb-2 block">Description</label>
                        <textarea
                            placeholder="Décrivez la réparation"
                            className="border border-gray-300 p-3 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                            value={reparation.description}
                            onChange={(e) => setReparation({ ...reparation, description: e.target.value })}
                        />
                    </div>

                    <div className="mb-5">
                        <label className="text-gray-700 font-medium mb-2 block">Pièces Changées</label>
                        {reparation.piecesChangees.map((piece, index) => (
                            <div className="flex items-center mb-4" key={index}>
                                <select
                                    className="border border-gray-300 p-3 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                                    value={piece}
                                    onChange={(e) => handlePieceChange(index, e.target.value)}
                                >
                                    <option value="">Sélectionner une pièce</option>
                                    {filteredPieces.map((piece) => (
                                        <option key={piece.id} value={piece.nom}>
                                            {piece.nom}
                                        </option>
                                    ))}
                                </select>
                                <button
                                    type="button"
                                    onClick={removePiece}
                                    className="ml-4 text-red-600 hover:text-red-800"
                                >
                                    <FaMinus />
                                </button>
                                <button
                                    type="button"
                                    onClick={addPiece}
                                    className="ml-4 text-green-600 hover:text-red-800"
                                >
                                    <FaPlus />
                                </button>
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-center">
                        <button
                            onClick={ajouterReparation}
                            className="flex items-center bg-green-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-green-700 transition duration-300 ease-in-out transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
                            >
                            <FaPlus className="inline-block mr-2" /> Ajouter la Réparation
                        </button>
                    </div>

                </div>
                <Footer />

            </main>
        </div>
    );
};

export default Reparation;
