import React, { useState } from 'react';
import Sidebar from '../components/Sidebarr';
import Footer from '../components/Footer';
import { FaLaptop, FaClock, FaPlus, FaMinus } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const Reparation = () => {
    const [reparation, setReparation] = useState({
        ordinateur: '',
        heures: '',
        description: '',
        piecesChangees: ['']
    });

    const navigate = useNavigate();
    const [error, setError] = useState('');

    const handleLogout = () => {
        localStorage.removeItem('authToken');
        navigate('/');
    };

    const ajouterReparation = () => {
        if (!reparation.ordinateur || !reparation.heures || !reparation.description || reparation.piecesChangees.some(piece => !piece)) {
            setError('Tous les champs sont obligatoires.');
            return;
        }

        console.log('Réparation ajoutée:', reparation);
        setReparation({ ordinateur: '', heures: '', description: '', piecesChangees: [''] });
        setError('');
    };

    const handlePieceChange = (index, value) => {
        const updatedPieces = [...reparation.piecesChangees];
        updatedPieces[index] = value;
        setReparation({ ...reparation, piecesChangees: updatedPieces });
    };

    const addPiece = () => {
        setReparation({ ...reparation, piecesChangees: [...reparation.piecesChangees, ''] });
    };

    const removePiece = () => {
        if (reparation.piecesChangees.length > 1) {
            setReparation({ ...reparation, piecesChangees: reparation.piecesChangees.slice(0, -1) });
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
            className="bg-gray-600 text-white px-4 py-2 rounded shadow-md hover:bg-gray-700 transition duration-200 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-500"
        >
            Liste des Réparations
        </button>
        <button
            onClick={handleLogout}
            className="bg-blue-600 text-white px-4 py-2 rounded shadow-md hover:bg-blue-700 transition duration-200 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
            Déconnexion
        </button>
    </div>
</header>


                <div className="bg-white rounded-lg shadow-md p-8 mb-6 border border-gray-200">
                    <h3 className="text-xl font-semibold mb-6 text-gray-700">Ajouter une Réparation</h3>
                    {error && <p className="text-red-500 mb-4">{error}</p>}

                    {/* Section Ordinateur */}
                    <div className="mb-5">
                        <label className="text-gray-700 font-medium mb-2 block">Ordinateur</label>
                        <select
                            value={reparation.ordinateur}
                            onChange={(e) => setReparation({ ...reparation, ordinateur: e.target.value })}
                            className="border border-gray-300 p-3 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                        >
                            <option value="">Sélectionnez un ordinateur</option>
                            <option value="Ordinateur 1 - REF001">Ordinateur 1 - REF001</option>
                            <option value="Ordinateur 2 - REF002">Ordinateur 2 - REF002</option>
                        </select>
                    </div>

                    {/* Heures */}
                    <div className="mb-5">
                        <label className="text-gray-700 font-medium mb-2 block">Heures</label>
                        <div className="relative">
                            <FaClock className="absolute top-4 left-3 text-gray-400" />
                            <input
                                type="number"
                                placeholder="Entrer le nombre d'heures passées à la réparation de l'ordinateur"
                                className="border border-gray-300 p-3 pl-10 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                                value={reparation.heures}
                                onChange={(e) => setReparation({ ...reparation, heures: e.target.value })}
                            />
                        </div>
                    </div>

                    {/* Description de la Réparation */}
                    <div className="mb-5">
                        <label className="text-gray-700 font-medium mb-2 block">Description</label>
                        <textarea
                            placeholder="Décrivez la réparation"
                            className="border border-gray-300 p-3 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                            value={reparation.description}
                            onChange={(e) => setReparation({ ...reparation, description: e.target.value })}
                        />
                    </div>

                    {/* Pièces Changées */}
                    <div className="mb-5">
                        <label className="text-gray-700 font-medium mb-2 block">Pièces Changées</label>
                        {reparation.piecesChangees.map((piece, index) => (
                            <div key={index} className="flex items-center mb-3">
                                <select
                                    value={piece}
                                    onChange={(e) => handlePieceChange(index, e.target.value)}
                                    className="border border-gray-300 p-3 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                                >
                                    <option value="">Sélectionnez une pièce</option>
                                    <option value="Carte Mère">Carte Mère</option>
                                    <option value="Disque Dur">Disque Dur</option>
                                    <option value="RAM">RAM</option>
                                    <option value="Alimentation">Alimentation</option>
                                    <option value="Écran">Écran</option>
                                </select>
                            </div>
                        ))}
                        <div className="flex items-center justify-between mt-4 space-x-4">
                            <button
                                onClick={addPiece}
                                className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-md shadow-lg hover:bg-green-700 transition ease-in-out"
                            >
                                <FaPlus className="mr-2" />
                                Ajouter une Pièce
                            </button>
                            <button
                                onClick={removePiece}
                                className="flex items-center bg-red-600 text-white px-4 py-2 rounded-md shadow-lg hover:bg-red-700 transition ease-in-out"
                                disabled={reparation.piecesChangees.length === 1}
                            >
                                <FaMinus className="mr-2" />
                                Supprimer une Pièce
                            </button>
                        </div>
                    </div>

                    <button
                        onClick={ajouterReparation}
                        className="flex items-center justify-center bg-green-600 text-white px-6 py-3 mt-6 rounded-md shadow-lg hover:bg-blue-700 transition ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    >
                        <FaPlus className="mr-2" />
                        Ajouter Réparation
                    </button>
                </div>

                <Footer />
            </main>
        </div>
    );
};

export default Reparation;
