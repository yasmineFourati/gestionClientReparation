import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSearch, FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import Sidebar from '../components/Sidebarr';
import Footer from '../components/Footer';

const donneesPieces = [
    { code: 'CPU123', nom: 'Processeur', marque: 'Intel', prixAchat: 200, prixVenteHT: 250, prixVenteTTC: 300, tarifHoraire: 30 },
    { code: 'HDD456', nom: 'Disque Dur', marque: 'Seagate', prixAchat: 100, prixVenteHT: 130, prixVenteTTC: 150, tarifHoraire: 20 },
    { code: 'RAM789', nom: 'Mémoire RAM 8GB', marque: 'Kingston', prixAchat: 60, prixVenteHT: 80, prixVenteTTC: 95, tarifHoraire: 15 },
    { code: 'GPU101', nom: 'Carte Graphique', marque: 'NVIDIA', prixAchat: 800, prixVenteHT: 950, prixVenteTTC: 1100, tarifHoraire: 50 },
    { code: 'SSD112', nom: 'Disque SSD 512GB', marque: 'Samsung', prixAchat: 180, prixVenteHT: 220, prixVenteTTC: 250, tarifHoraire: 25 },
    { code: 'PSU223', nom: 'Alimentation 650W', marque: 'Corsair', prixAchat: 120, prixVenteHT: 150, prixVenteTTC: 175, tarifHoraire: 20 },
    { code: 'MON334', nom: 'Écran 24" LED', marque: 'LG', prixAchat: 300, prixVenteHT: 350, prixVenteTTC: 400, tarifHoraire: 40 },
    { code: 'KEY445', nom: 'Clavier Mécanique', marque: 'Logitech', prixAchat: 80, prixVenteHT: 100, prixVenteTTC: 120, tarifHoraire: 10 },
    { code: 'MOU556', nom: 'Souris Optique', marque: 'Razer', prixAchat: 50, prixVenteHT: 65, prixVenteTTC: 75, tarifHoraire: 5 },
    { code: 'CAB667', nom: 'Câble HDMI 2m', marque: 'Belkin', prixAchat: 15, prixVenteHT: 20, prixVenteTTC: 23, tarifHoraire: 2 }
];

const Catalogue = () => {
    const [recherche, setRecherche] = useState('');
    const [piecesFiltrees, setPiecesFiltrees] = useState(donneesPieces);
    const navigate = useNavigate();

    useEffect(() => {
        const filtres = donneesPieces.filter(piece =>
            piece.nom.toLowerCase().includes(recherche.toLowerCase()) ||
            piece.marque.toLowerCase().includes(recherche.toLowerCase())
        );
        setPiecesFiltrees(filtres);
    }, [recherche]);

    const handleLogout = () => {
        localStorage.removeItem('authToken');
        navigate('/');
    };

    const handleEdit = (piece) => {
        navigate('/edit-component', { state: { piece } });
    };

    const ajouterComponent = () => {
        navigate('/add-component');
    };

    const handleDelete = (code) => {
        const pieceToDelete = piecesFiltrees.find(piece => piece.code === code);
        const confirmDelete = window.confirm(`Êtes-vous sûr de vouloir supprimer le/a ${pieceToDelete.nom} ${pieceToDelete.marque} ?`);
        
        if (confirmDelete) {
            const updatedPieces = piecesFiltrees.filter(piece => piece.code !== code);
            setPiecesFiltrees(updatedPieces);
        }
    };
    

    return (
        <div className="flex min-h-screen bg-gray-50">
            <Sidebar />
            <div className="flex-1 p-8 ml-64">
            <header className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800">Catalogue des pièces</h2>
                <div className="flex gap-4">
                        <button
                            onClick={ajouterComponent}
                            className="flex items-center bg-green-600 text-white px-4 py-2 rounded-md shadow hover:bg-green-700 transition duration-300"
                        >
                            <FaPlus className="mr-2" /> Ajouter une pièce
                        </button>
                        <button
                            onClick={handleLogout}
                            className="bg-blue-600 text-white px-4 py-2 rounded-md shadow hover:bg-blue-700 transition duration-300"
                        >
                            Déconnexion
                        </button>
                    </div>
                </header>
                <div className="mb-6 relative">
                    <FaSearch className="absolute top-3 left-3 text-gray-500" />
                    <input
                        type="text"
                        aria-label="Recherche par nom ou marque"
                        placeholder="Recherche par nom ou marque"
                        value={recherche}
                        onChange={(e) => setRecherche(e.target.value)}
                        className="border border-gray-300 pl-10 p-2 w-full rounded focus:border-blue-400"
                    />
                </div>
                <div className="bg-white rounded shadow p-6">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-blue-100 text-gray-800">
                                <th className="p-4">Code</th>
                                <th className="p-4">Nom</th>
                                <th className="p-4">Marque</th>
                                <th className="p-4">Prix d'achat</th>
                                <th className="p-4">Prix de vente HT</th>
                                <th className="p-4">Prix de vente TTC</th>
                                <th className="p-4">Tarif horaire</th>
                                <th className="p-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {piecesFiltrees.length > 0 ? (
                                piecesFiltrees.map(piece => (
                                    <tr key={piece.code} className="border-t hover:bg-blue-50 transition-colors">
                                        <td className="p-4 text-gray-600">{piece.code}</td>
                                        <td className="p-4 text-gray-600">{piece.nom}</td>
                                        <td className="p-4 text-gray-600">{piece.marque}</td>
                                        <td className="p-4 text-gray-600">{piece.prixAchat.toFixed(3)}</td>
                                        <td className="p-4 text-gray-600">{piece.prixVenteHT.toFixed(3)}</td>
                                        <td className="p-4 text-gray-600">{piece.prixVenteTTC.toFixed(3)}</td>
                                        <td className="p-4 text-gray-600">{piece.tarifHoraire.toFixed(3)}</td>
                                        <td className="p-4 text-gray-600 flex gap-2">
                                            <button
                                                onClick={() => handleEdit(piece)}
                                                className="flex items-center bg-yellow-500 text-white p-2 rounded hover:bg-yellow-600 transition duration-300"
                                                aria-label="Modifier"
                                            >
                                                <FaEdit />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(piece.code)}
                                                className="flex items-center bg-red-500 text-white p-2 rounded hover:bg-red-600 transition duration-300"
                                                aria-label="Supprimer"
                                            >
                                                <FaTrash />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="8" className="text-center p-4 text-gray-500">Aucune pièce trouvée</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                <br />
                <Footer />
            </div>
        </div>
    );
};

export default Catalogue;
