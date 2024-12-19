import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebarr';
import Footer from '../components/Footer';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const fetchReparations = async () => {
    try {
        const response = await axios.get('http://localhost:8090/reparations');
        return response.data;
    } catch (error) {
        console.error('Error fetching reparations:', error);
        return [];
    }
};

const calculateAmounts = (tarifHMO, tempsMO, piecesRechange, avecLivraison) => {
    let sousTotal = tarifHMO * tempsMO;


    piecesRechange.forEach(piece => {
        sousTotal += piece.prixTTC;
    });

    const taxe = sousTotal * 0.2; // Taxe de 20 %
    const fraisExpedition = avecLivraison ? 15 : 0;
    const total = sousTotal + taxe + fraisExpedition;

    return { sousTotal, taxe, fraisExpedition, total };
};

const Facture = () => {
    const navigate = useNavigate();
    const [reparationsData, setReparationsData] = useState([]);
    const [selectedReparation, setSelectedReparation] = useState();
    const [avecLivraison, setAvecLivraison] = useState(false);
    const [totals, setTotals] = useState({
        totalFacture: 0,
        sousTotalGlobal: 0,
        taxeGlobal: 0,
        fraisExpeditionGlobal: 0,
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const getData = async () => {
            try {
                const reparations = await fetchReparations();
                setReparationsData(reparations);
            } catch (error) {
                console.error('Error fetching reparations:', error);
                setError('Impossible de récupérer les réparations');
            } finally {
                setLoading(false);
            }
        };
        getData();
    }, []);

    const handleLogout = () => {
        navigate('/');
    };

    const handlePrint = () => {
        window.print();
    };

    useEffect(() => {
        if (selectedReparation) {
            const { tarifHMO, tempsMO, pieceRechange } = selectedReparation;
            const { sousTotal, taxe, fraisExpedition, total } = calculateAmounts(
                tarifHMO,
                tempsMO,
                pieceRechange ? [pieceRechange] : [],
                avecLivraison
            );

            setTotals({
                totalFacture: total,
                sousTotalGlobal: sousTotal,
                taxeGlobal: taxe,
                fraisExpeditionGlobal: fraisExpedition,
            });
        }
    }, [selectedReparation, avecLivraison]);

    const handleAddFacture = async (e) => {
        e.preventDefault();

        if (!selectedReparation || !selectedReparation.id) {
            alert("Veuillez sélectionner une réparation.");
            return;
        }

        // Générer un numéro de facture (par exemple, un numéro aléatoire ou une séquence)
        const factureNumero = `FAC-${Date.now()}`;

        const dataToSend = {
            reparation: { id: selectedReparation.id },
            date: new Date().toISOString(),
            montantTotal: totals.totalFacture,
            numero: factureNumero,  // Ajouter un numéro de facture
        };

        console.log("Données envoyées pour la facture :", dataToSend);

        try {
            const response = await axios.post("http://localhost:8090/facture", dataToSend);
            console.log("Réponse du serveur :", response.data);
            navigate("/listefac");
        } catch (error) {
            console.error("Erreur lors de la création de la facture :", error.response?.data || error.message);
        }
    };



    if (loading) {
        return <div className="flex justify-center items-center min-h-screen">Chargement...</div>;
    }

    if (error) {
        return <div className="flex justify-center items-center min-h-screen">{error}</div>;
    }

    return (
        <div className="flex">
            <style>
                {`
                    @media print {
                        .no-print { display: none !important; }
                        .print-page { padding: 20px; width: 100%; }
                    }
                `}
            </style>
            <Sidebar className="no-print" />
            <div className="flex-1 p-10 bg-gray-100 ml-64 min-h-screen print-page">
                <div className="flex justify-end mb-6 no-print">
                    <button
                        onClick={() => navigate('/listefac')}
                        className="bg-gray-600 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-yellow-700 transition duration-300 mr-4"
                    >
                        Liste des Factures
                    </button>
                    <button
                        onClick={handleLogout}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-blue-700 transition duration-300"
                    >
                        Déconnexion
                    </button>
                </div>

                <div className="bg-white shadow-md rounded-lg p-8 max-w-4xl mx-auto">
                    <h1 className="text-4xl font-extrabold text-center mb-8 text-blue-600">Facture #{selectedReparation?.id || '0001'}</h1>

                    <div className="mb-8 text-center">
                        <h2 className="text-xl font-semibold text-gray-700">Société RepAppBuro</h2>
                        <p className="text-sm text-gray-500">123 Avenue Habib Bourgiba, Sfax</p>
                    </div>

                    <div className="mb-8">
                        <label htmlFor="reparation-select" className="block mb-3 font-medium text-gray-700">Choisir une Réparation :</label>
                        <select
                            id="reparation-select"
                            value={selectedReparation?.id || ''}
                            onChange={(e) => {
                                const selected = reparationsData.find(reparation => reparation.id === parseInt(e.target.value));
                                setSelectedReparation(selected);
                            }}
                            className="border p-2 rounded-lg w-full mb-4"
                        >
                            <option value="">-- Sélectionnez une réparation --</option>
                            {reparationsData.map(reparation => (
                                <option key={reparation.id} value={reparation.id}>
                                    {reparation.demandeReparation.appareil.marque} ({reparation.demandeReparation.appareil.modele}) - {reparation.demandeReparation.client.nom}
                                </option>
                            ))}
                        </select>

                        {selectedReparation && (
                            <div className="text-gray-700 mb-4 p-4 bg-gray-50 border rounded-lg">
                                <p><strong>Date:</strong> {new Date(selectedReparation.dateRep).toLocaleDateString()}</p>
                                <p><strong>Client:</strong> {selectedReparation.demandeReparation.client.nom}</p>
                                <p><strong>Adresse:</strong> {selectedReparation.demandeReparation.client.adresse}</p>
                                <p><strong>Numéro de téléphone:</strong> {selectedReparation.demandeReparation.client.numTel}</p>
                            </div>
                        )}
                    </div>

                    <div className="mt-4 flex space-x-6">
                        <label className="flex items-center space-x-2">
                            <input
                                type="radio"
                                value="avecLivraison"
                                checked={avecLivraison === true}
                                onChange={() => setAvecLivraison(true)}
                                className="form-radio text-blue-500"
                            />
                            <span className="text-sm text-gray-700">Avec livraison</span>
                        </label>

                        <label className="flex items-center space-x-2">
                            <input
                                type="radio"
                                value="sansLivraison"
                                checked={avecLivraison === false}
                                onChange={() => setAvecLivraison(false)}
                                className="form-radio text-blue-500"
                            />
                            <span className="text-sm text-gray-700">Sans livraison</span>
                        </label>
                    </div>

                    {selectedReparation && (
                        <table className="w-full mb-8 border-collapse border border-gray-300">
                            <thead>
                                <tr className="bg-gray-200">
                                    <th className="border p-2 text-left">Description</th>
                                    <th className="border p-2 text-left">Prix Unitaire</th>
                                    <th className="border p-2 text-left">Pièces Changées</th>
                                    <th className="border p-2 text-left">Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="bg-white">
                                    <td className="border p-2">{selectedReparation.description}</td>
                                    <td className="border p-2">{selectedReparation.tarifHMO} TND</td>
                                    <td className="border p-2">
                                        {selectedReparation.pieceRechange ? (
                                            <p>{selectedReparation.pieceRechange.nom} ({selectedReparation.pieceRechange.prixTTC} TND)</p>
                                        ) : (
                                            <p>Aucune pièce changée</p>
                                        )}
                                    </td>
                                    <td className="border p-2">{totals.totalFacture.toFixed(2)} TND</td>
                                </tr>
                            </tbody>
                        </table>
                    )}

                    <div className="bg-gray-50 p-4 rounded-lg flex flex-col items-center text-center">
                        <p className="font-medium">
                            <span className="text-gray-700">Sous-total: </span>
                            {totals.sousTotalGlobal.toFixed(2)} TND
                        </p>
                        <p className="font-medium">
                            <span className="text-gray-700">Taxe (20%): </span>
                            {totals.taxeGlobal.toFixed(2)} TND
                        </p>
                        <p className="font-medium">
                            <span className="text-gray-700">Frais d'expédition: </span>
                            {totals.fraisExpeditionGlobal.toFixed(2)} TND
                        </p>
                        <p className="font-bold text-lg text-blue-600">
                            <span className="text-gray-700">Total: </span>
                            {totals.totalFacture.toFixed(2)} TND
                        </p>
                    </div>

                    <div className="flex justify-center space-x-4">
                        <button
                            onClick={handlePrint}
                            className={`bg-green-600 text-white px-4 py-2 mt-6 rounded-lg shadow-lg hover:bg-green-700 transition duration-300 no-print flex items-center space-x-2 ${!selectedReparation ? 'cursor-not-allowed opacity-50' : ''}`}
                            disabled={!selectedReparation}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M15 10l4.5-4.5M15 10l4.5 4.5M15 10h6M3 14h6m0 0l4.5 4.5M9 14l-4.5 4.5M9 14H3m0 0V3m0 11h6m0 0h6M9 14H3m6 0H9M9 14H9m0 0h0M9 14h0M9 14m0 0H9m0 0"
                                />
                            </svg>
                            <span>Imprimer</span>
                        </button>
                        <button
                            onClick={handleAddFacture}
                            className="bg-yellow-600 text-white px-4 py-2 mt-6 rounded-lg shadow-lg hover:bg-yellow-700 transition duration-300 no-print flex items-center space-x-2"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M12 4v16m8-8H4"
                                />
                            </svg>
                            <span>Ajouter Facture</span>
                        </button>
                    </div>


                </div>
                <br />
                <Footer className="no-print" />
            </div>
        </div>
    );
};

export default Facture;
