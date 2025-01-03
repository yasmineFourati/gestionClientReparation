import React, { useState, useEffect } from 'react';
import { FaPlus, FaPhone, FaMapMarkerAlt, FaEdit, FaTrash, FaSearch } from 'react-icons/fa';
import Sidebar from '../components/Sidebarr';
import Footer from '../components/Footer';
import { useNavigate } from 'react-router-dom';

const ListeClients = () => {
    const navigate = useNavigate();
    const [clients, setClients] = useState([]);
    const [searchInput, setSearchInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [clientToEdit, setClientToEdit] = useState(null);

    useEffect(() => {
        const fetchClients = async () => {
            setLoading(true);
            try {
                const response = await fetch('http://localhost:8090/clients');
                const data = await response.json();
                setClients(data);
            } catch (error) {
                console.error("Erreur de récupération des clients:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchClients();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('authToken');
        navigate('/');
    };

    const handleEdit = (client) => {
        setClientToEdit(client);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleSaveChanges = async () => {
        if (clientToEdit) {
            try {
                const response = await fetch(`http://localhost:8090/client/${clientToEdit.id}`, {
                    method: 'PUT',
                    body: JSON.stringify(clientToEdit),
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                if (response.ok) {
                    setClients(clients.map(client => (client.id === clientToEdit.id ? clientToEdit : client)));
                    setIsModalOpen(false);
                } else {
                    console.error("Erreur lors de la mise à jour du client.");
                }
            } catch (error) {
                console.error("Erreur lors de la mise à jour du client:", error);
            }
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Êtes-vous sûr de vouloir supprimer ce client ?")) {
            try {
                const response = await fetch(`http://localhost:8090/client/${id}`, {
                    method: 'DELETE',
                });
                if (response.ok) {
                    setClients(clients.filter(client => client.id !== id));
                } else if (response.status === 404) {
                    alert("Client introuvable !");
                } else {
                    alert("Une erreur s'est produite lors de la suppression.");
                }
            } catch (error) {
                alert("Erreur réseau. Veuillez réessayer.");
            }
        }
    };

    const filteredClients = clients.filter((client) =>
        client.nom.toLowerCase().includes(searchInput.toLowerCase())
    );

    return (
        <div className="flex">
            <Sidebar />
            <main className="flex-1 p-10 bg-gray-100 ml-64">
                <header className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">Liste des Clients</h2>
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate('/client')}
                            className="bg-gray-500 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-gray-600 transition duration-300 flex items-center"
                        >
                            <FaPlus className="mr-2" />
                            Ajouter Appareil
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
                        placeholder="Recherche par nom"
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
                                    <th className="py-3 px-6 text-left">Nom</th>
                                    <th className="py-3 px-6 text-left">Téléphone</th>
                                    <th className="py-3 px-6 text-left">Adresse</th>
                                    <th className="py-3 px-6 text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="text-gray-700">
                                {filteredClients.map((client) => (
                                    <tr key={client.id} className="border-b hover:bg-gray-100">
                                        <td className="py-3 px-6">{client.nom}</td>
                                        <td className="py-3 px-6">
                                            <FaPhone className="inline mr-2" />
                                            {client.numTel}
                                        </td>
                                        <td className="py-3 px-6">
                                            <FaMapMarkerAlt className="inline mr-2" />
                                            {client.adresse}
                                        </td>
                                        <td className="py-3 px-6 text-center flex justify-center gap-4">
                                            <FaEdit
                                                className="text-yellow-500 hover:text-yellow-600 cursor-pointer"
                                                onClick={() => handleEdit(client)}
                                                title="Modifier"
                                            />
                                            <FaTrash
                                                className="text-red-500 hover:text-red-600 cursor-pointer"
                                                onClick={() => handleDelete(client.id)}
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
                        <div className="bg-white p-6 rounded-lg w-1/3 shadow-lg transform transition-transform scale-95">
                            <h3 className="text-xl mb-4">Modifier Client</h3>
                            <label className="block text-sm font-bold mb-2">Nom</label>
                            <input
                                type="text"
                                value={clientToEdit.nom}
                                onChange={(e) => setClientToEdit({ ...clientToEdit, nom: e.target.value })}
                                className="border border-gray-300 p-3 rounded w-full mb-4"
                            />
                            <label className="block text-sm font-bold mb-2">Adresse</label>
                            <input
                                type="text"
                                value={clientToEdit.adresse}
                                onChange={(e) => setClientToEdit({ ...clientToEdit, adresse: e.target.value })}
                                className="border border-gray-300 p-3 rounded w-full mb-4"
                            />
                            <label className="block text-sm font-bold mb-2">Téléphone</label>
                            <input
                                type="text"
                                value={clientToEdit.numTel}
                                onChange={(e) => setClientToEdit({ ...clientToEdit, numTel: e.target.value })}
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

export default ListeClients;
