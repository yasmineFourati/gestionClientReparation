import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa';
import Sidebar from '../components/Sidebarr';
import Footer from '../components/Footer';
import axios from 'axios';

const Catalogue = () => {
    const [recherche, setRecherche] = useState('');
    const [piecesFiltrees, setPiecesFiltrees] = useState([]);
    const [allPieces, setAllPieces] = useState([]);
    const [selectedPiece, setSelectedPiece] = useState(null);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const navigate = useNavigate();

    // Fetch all pieces data from the backend
    useEffect(() => {
        axios.get('http://localhost:8090/pieces-rechange')
            .then(response => {
                setAllPieces(response.data);
                setPiecesFiltrees(response.data);  // Initialize the filtered pieces with all pieces data
            })
            .catch(error => {
                console.error("Error fetching pieces data:", error);
            });
    }, []);

    // Handle search filter based on the search input
    useEffect(() => {
        const filtres = allPieces.filter(piece =>
            piece.nom.toLowerCase().includes(recherche.toLowerCase())
        );
        setPiecesFiltrees(filtres);
    }, [recherche, allPieces]);

    // Handle logout
    const handleLogout = () => {
        localStorage.removeItem('authToken');
        navigate('/');
    };

    // Handle piece click (show details)
    const handlePieceClick = (piece) => {
        setSelectedPiece(piece);
        setIsPopupOpen(true);
    };

    // Close the popup and reset selected piece
    const closePopup = () => {
        setIsPopupOpen(false);
        setSelectedPiece(null);
    };

    // Group pieces by their name to avoid duplicate names
    const groupedPieces = piecesFiltrees.reduce((acc, piece) => {
        if (!acc[piece.nom]) {
            acc[piece.nom] = [];
        }
        acc[piece.nom].push(piece);
        return acc;
    }, {});

    return (
        <div className="flex min-h-screen bg-gray-50">
            <Sidebar />
            <div className="flex-1 p-8 ml-64">
                <header className="flex justify-between items-center mb-8">
                    <h2 className="text-3xl font-semibold text-gray-800">Catalogue des pièces</h2>
                    <button
                        onClick={handleLogout}
                        className="bg-blue-600 text-white px-4 py-2 rounded-md shadow hover:bg-blue-700 transition duration-300"
                    >
                        Déconnexion
                    </button>
                </header>
                <div className="mb-6 relative">
                    <FaSearch className="absolute top-3 left-3 text-gray-500" />
                    <input
                        type="text"
                        aria-label="Recherche par nom"
                        placeholder="Recherche par nom"
                        value={recherche}
                        onChange={(e) => setRecherche(e.target.value)}
                        className="border border-gray-300 pl-10 p-2 w-full rounded focus:border-blue-400 focus:ring-2 focus:ring-blue-400"
                    />
                </div>
                <div className="bg-white rounded-lg shadow-md p-6">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-blue-100 text-gray-800">
                                <th className="p-4">Nom</th>
                                <th className="p-4">Marque</th>
                                <th className="p-4">Prix d'achat</th>
                                <th className="p-4">Prix HT</th>
                                <th className="p-4">Prix TTC</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Object.keys(groupedPieces).length > 0 ? (
                                Object.keys(groupedPieces).map(nomPiece => {
                                    const pieces = groupedPieces[nomPiece];
                                    return (
                                        pieces.map((piece, index) => (
                                            <tr
                                                key={piece.code}
                                                className={`border-t hover:bg-gray-100 cursor-pointer ${selectedPiece?.code === piece.code ? 'bg-blue-50' : ''}`} // Line selection on click
                                                onClick={() => handlePieceClick(piece)}  // Row click handler
                                            >
                                                {index === 0 && (
                                                    <td className="p-4 text-gray-600" rowSpan={pieces.length}>{nomPiece}</td>
                                                )}
                                                <td className="p-4 text-gray-600">{piece.marque || "Non spécifiée"}</td>
                                                <td className="p-4 text-gray-600">{piece.prixAchat ? piece.prixAchat.toFixed(3) : "N/A"}</td>
                                                <td className="p-4 text-gray-600">{piece.prixHT ? piece.prixHT.toFixed(3) : "N/A"}</td>
                                                <td className="p-4 text-gray-600">{piece.prixTTC ? piece.prixTTC.toFixed(3) : "N/A"}</td>
                                            </tr>
                                        ))
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan="5" className="text-center p-4 text-gray-500">Aucune pièce trouvée</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {isPopupOpen && selectedPiece && (
                    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
                        <div className="bg-white p-8 rounded-lg shadow-lg w-96">
                            <h3 className="text-xl font-semibold mb-4">Détails de la pièce</h3>
                            <p><strong>Code:</strong> {selectedPiece.code}</p>
                            <p><strong>Nom:</strong> {selectedPiece.nom}</p>
                            <p><strong>Marque:</strong> {selectedPiece.marque}</p>
                            <p><strong>Prix d'achat:</strong> {selectedPiece.prixAchat ? selectedPiece.prixAchat.toFixed(3) : "N/A"}</p>
                            <p><strong>Prix HT:</strong> {selectedPiece.prixHT ? selectedPiece.prixHT.toFixed(3) : "N/A"}</p>
                            <p><strong>Prix TTC:</strong> {selectedPiece.prixTTC ? selectedPiece.prixTTC.toFixed(3) : "N/A"}</p>
                            <div className="flex justify-center mt-4">
                                <button
                                    onClick={closePopup}
                                    className="bg-red-500 text-white px-4 py-2 rounded-md shadow hover:bg-red-600 transition duration-300"
                                >
                                    Fermer
                                </button>
                            </div>
                        </div>
                    </div>
                )}
                <br></br>
                <Footer />
            </div>
        </div>
    );
};

export default Catalogue;
