import React, { useState, useEffect, useMemo } from 'react';
import { FaPlus, FaEdit, FaTrash, FaSearch } from 'react-icons/fa';
import Sidebar from '../components/Sidebarr';
import Footer from '../components/Footer';
import { useNavigate } from 'react-router-dom';

const ListeAppareils = () => {
    const navigate = useNavigate();
    const [appareils, setAppareils] = useState([]);
    const [searchInput, setSearchInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [appareilToEdit, setAppareilToEdit] = useState(null);

    useEffect(() => {
        const fetchAppareils = async () => {
            setLoading(true);
            try {
                const response = await fetch('http://localhost:8090/appareils');
                const data = await response.json();
                setAppareils(data);
            } catch (error) {
                console.error("Erreur de récupération des appareils:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchAppareils();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('authToken');
        navigate('/');
    };

    const handleEdit = (appareil) => {
        setAppareilToEdit(appareil);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleSaveChanges = async () => {
        if (appareilToEdit) {
            try {
                const response = await fetch(`http://localhost:8090/appareil/${appareilToEdit.id}`, {
                    method: 'PUT',
                    body: JSON.stringify(appareilToEdit),
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                if (response.ok) {
                    setAppareils(appareils.map((appareil) =>
                        appareil.id === appareilToEdit.id ? appareilToEdit : appareil
                    ));
                    setIsModalOpen(false);
                } else {
                    console.error("Erreur lors de la mise à jour de l'appareil.");
                }
            } catch (error) {
                console.error("Erreur lors de la mise à jour de l'appareil:", error);
            }
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Êtes-vous sûr de vouloir supprimer cet appareil ?")) {
            try {
                const response = await fetch(`http://localhost:8090/appareil/${id}`, {
                    method: 'DELETE',
                });
                if (response.ok) {
                    setAppareils(appareils.filter((appareil) => appareil.id !== id));
                } else {
                    console.error("Erreur lors de la suppression de l'appareil.");
                }
            } catch (error) {
                console.error("Erreur lors de la suppression de l'appareil:", error);
            }
        }
    };

    const filteredAppareils = appareils.filter((appareil) =>
        appareil.marque.toLowerCase().includes(searchInput.toLowerCase())
    );

    return (
        <div className="flex">
            <Sidebar />
            <main className="flex-1 p-10 bg-gray-100 ml-64">
                <header className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">Liste des Appareils</h2>
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate('/client')}
                            className="bg-gray-500 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-gray-600 transition duration-300 flex items-center"
                        >
                            <FaPlus className="mr-2" /> 
                            Ajouter Client
                        </button>

                        <button
                            onClick={handleLogout}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-blue-700 transition duration-300"
                        >
                            Déconnexion
                        </button>
                    </div>
                </header>
                <div className="relative mb-6">
                    <input
                        type="text"
                        placeholder="Recherche par marque"
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        className="border border-gray-300 p-3 pl-10 rounded-lg w-full shadow focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <FaSearch className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400" />
                </div>

                <div className="bg-white rounded-lg shadow-lg p-6 overflow-x-auto">
                    {loading ? (
                        <div className="flex justify-center items-center">
                            <div className="loader">Chargement...</div>
                        </div>
                    ) : (
                        <table className="min-w-full table-auto border-collapse">
                            <thead className="bg-gray-800 text-white">
                                <tr>
                                    <th className="py-3 px-6 text-left">Marque</th>
                                    <th className="py-3 px-6 text-left">Modèle</th>
                                    <th className="py-3 px-6 text-left">Numéro de Série</th>
                                    <th className="py-3 px-6 text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="text-gray-700">
                                {filteredAppareils.map((appareil) => (
                                    <tr key={appareil.id} className="border-b hover:bg-gray-100">
                                        <td className="py-3 px-6">{appareil.marque}</td>
                                        <td className="py-3 px-6">{appareil.modele}</td>
                                        <td className="py-3 px-6">{appareil.numSerie}</td>
                                        <td className="py-3 px-6 text-center flex justify-center gap-4">
                                            <FaEdit
                                                className="text-yellow-500 hover:text-yellow-600 cursor-pointer"
                                                onClick={() => handleEdit(appareil)}
                                                title="Modifier"
                                            />
                                            <FaTrash
                                                className="text-red-500 hover:text-red-600 cursor-pointer"
                                                onClick={() => handleDelete(appareil.id)}
                                                title="Supprimer"
                                            />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>

                {isModalOpen && (
                    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
                        <div className="bg-white p-6 rounded-lg w-1/3 shadow-lg">
                            <h3 className="text-xl mb-4">Modifier Appareil</h3>
                            <label className="block text-sm font-bold mb-2">Marque</label>
                            <input
                                type="text"
                                value={appareilToEdit.marque}
                                onChange={(e) =>
                                    setAppareilToEdit({ ...appareilToEdit, marque: e.target.value })
                                }
                                className="border border-gray-300 p-3 rounded w-full mb-4"
                            />
                            <label className="block text-sm font-bold mb-2">Modèle</label>
                            <input
                                type="text"
                                value={appareilToEdit.modele}
                                onChange={(e) =>
                                    setAppareilToEdit({ ...appareilToEdit, modele: e.target.value })
                                }
                                className="border border-gray-300 p-3 rounded w-full mb-4"
                            />
                            <label className="block text-sm font-bold mb-2">Numéro de Série</label>
                            <input
                                type="text"
                                value={appareilToEdit.numSerie}
                                onChange={(e) =>
                                    setAppareilToEdit({ ...appareilToEdit, numSerie: e.target.value })
                                }
                                className="border border-gray-300 p-3 rounded w-full mb-4"
                            />
                            <div className="flex justify-between">
                                <button
                                    onClick={handleSaveChanges}
                                    className="bg-green-600 text-white px-4 py-2 rounded-lg"
                                >
                                    Sauvegarder
                                </button>
                                <button
                                    onClick={handleCloseModal}
                                    className="bg-red-600 text-white px-4 py-2 rounded-lg"
                                >
                                    Annuler
                                </button>
                            </div>
                        </div>
                    </div>
                )}
                <br></br>
                <Footer />
            </main>
        </div>
    );
};

export default ListeAppareils;
