import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebarr';
import Footer from '../components/Footer';
import { useLocation, useNavigate } from 'react-router-dom';

const fetchClientsData = () => {
    return [
        {
            id: 1,
            name: 'Yasmine',
            reparations: [
                { id: 'R001', clientName: 'Yasmine', clientAddress: 'Centre Ville', description: 'Réparation de la carte mère', prixUnitaire: 1500, quantite: 1 },
                { id: 'R002', clientName: 'Yasmine', clientAddress: 'Centre Ville', description: 'Remplacement de la batterie', prixUnitaire: 800, quantite: 1 }
            ]
        },
        {
            id: 2,
            name: 'Baya',
            reparations: [
                { id: 'R003', clientName: 'Baya', clientAddress: 'Soukra', description: 'Remplacement de l\'écran', prixUnitaire: 1200, quantite: 1 },
                { id: 'R004', clientName: 'Baya', clientAddress: 'Soukra', description: 'Réparation du disque dur', prixUnitaire: 2000, quantite: 1 }
            ]
        },
        {
            id: 3,
            name: 'Amina',
            reparations: [
                { id: 'R005', clientName: 'Amina', clientAddress: 'Ariana', description: 'Changement de la RAM', prixUnitaire: 400, quantite: 2 },
                { id: 'R006', clientName: 'Amina', clientAddress: 'Ariana', description: 'Nettoyage complet', prixUnitaire: 300, quantite: 1 }
            ]
        },
        {
            id: 4,
            name: 'Ibrahim',
            reparations: [
                { id: 'R007', clientName: 'Ibrahim', clientAddress: 'Lac 2', description: 'Réparation de l\'alimentation', prixUnitaire: 1000, quantite: 1 }
            ]
        }
    ];
};

const calculateAmounts = (prixUnitaire, quantite, avecLivraison) => {
    const sousTotal = prixUnitaire * quantite;
    const taxe = sousTotal * 0.2;
    const fraisExpedition = avecLivraison ? 15 : 0;
    const total = sousTotal + taxe + fraisExpedition;

    return { sousTotal, taxe, fraisExpedition, total };
};

const Facture = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [clientsData, setClientsData] = useState([]);
    const [selectedClient, setSelectedClient] = useState('');
    const [avecLivraison, setAvecLivraison] = useState(false);

    useEffect(() => {
        const data = fetchClientsData();
        setClientsData(data);
    }, []);

    const handleLogout = () => {
        navigate('/');
    };

    const handlePrint = () => {
        window.print();
    };

    const selectedClientData = clientsData.find(client => client.name === selectedClient);

    let totalFacture = 0;
    let sousTotalGlobal = 0;
    let taxeGlobal = 0;
    let fraisExpeditionGlobal = 0;

    const handleNavigateToFacturesList = () => {
        navigate('/listefac');
    };

    return (
        <div className="flex">
            <style>
                {`
            @media print {
                .no-print { 
                    display: none !important; 
                }
                .print-page { 
                    padding: 20px; 
                    width: 100%; 
                }
            }
        `}
            </style>
            <Sidebar className="no-print" />
            <div className="flex-1 p-10 bg-gray-100 ml-64 min-h-screen print-page">
                <div className="flex justify-end mb-6 no-print">
                <button
                        onClick={handleNavigateToFacturesList}
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
                    <h1 className="text-3xl font-bold text-center mb-8">Facture #{selectedClientData?.reparations?.[0]?.id || '0001'}</h1>

                    <div className="mb-8 text-center">
                        <h2 className="text-lg font-semibold">Société RepAppBuro</h2>
                        <p>123 Avenue Habib Bourgiba, Sfax</p>
                    </div>

                    <div className="mb-8">
                        <label htmlFor="client-select" className="block mb-3 font-medium">Choisir un client :</label>
                        <select
                            id="client-select"
                            value={selectedClient}
                            onChange={(e) => setSelectedClient(e.target.value)}
                            className="border p-2 rounded-lg w-full mb-4"
                        >
                            <option value="">-- Sélectionnez un client --</option>
                            {clientsData.map(client => (
                                <option key={client.id} value={client.name}>{client.name}</option>
                            ))}
                        </select>

                        {selectedClientData && (
                            <div className="text-gray-700">
                                <p>Date: {new Date().toLocaleDateString()}</p>
                                <p>À: {selectedClientData.name}</p>
                                <p>Adresse: {selectedClientData.reparations[0].clientAddress}</p>
                            </div>
                        )}
                    </div>

                    <div className="mb-8">
                        <h3 className="font-semibold mb-2">Instructions de livraison :</h3>
                        <p>Merci de livrer dans les meilleurs délais.</p>
                    </div>

                    <div className="mb-8">
                        <h3 className="font-semibold mb-2">Options de livraison :</h3>
                        <label>
                            <input
                                type="radio"
                                value="avec"
                                checked={avecLivraison}
                                onChange={() => setAvecLivraison(true)}
                                className="mr-2"
                            />
                            Avec livraison
                        </label>
                        <label className="ml-4">
                            <input
                                type="radio"
                                value="sans"
                                checked={!avecLivraison}
                                onChange={() => setAvecLivraison(false)}
                                className="mr-2"
                            />
                            Sans livraison
                        </label>
                    </div>

                    <table className="w-full mb-8 text-gray-700">
                        <thead>
                            <tr className="bg-gray-200">
                                <th className="border px-4 py-2">Description</th>
                                <th className="border px-4 py-2">Quantité</th>
                                <th className="border px-4 py-2">Prix unitaire</th>
                                <th className="border px-4 py-2">Sous-total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {selectedClientData?.reparations?.map((reparation) => {
                                const { sousTotal, taxe, fraisExpedition, total } = calculateAmounts(
                                    reparation.prixUnitaire,
                                    reparation.quantite,
                                    avecLivraison
                                );

                                sousTotalGlobal += sousTotal;
                                taxeGlobal += taxe;
                                fraisExpeditionGlobal += fraisExpedition;
                                totalFacture += total;

                                return (
                                    <tr key={reparation.id} className="border-t">
                                        <td className="border px-4 py-2">{reparation.description}</td>
                                        <td className="border px-4 py-2">{reparation.quantite}</td>
                                        <td className="border px-4 py-2">{reparation.prixUnitaire} TDN</td>
                                        <td className="border px-4 py-2">{sousTotal.toFixed(2)} TDN</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>

                    <div className="text-gray-700 mb-8">
                        <div className="flex justify-between">
                            <p>Sous-total des réparations</p>
                            <p>{sousTotalGlobal.toFixed(2)} TDN</p>
                        </div>
                        <div className="flex justify-between">
                            <p>Taxe (20%)</p>
                            <p>{taxeGlobal.toFixed(2)} TDN</p>
                        </div>
                        <div className="flex justify-between">
                            <p>Frais de livraison</p>
                            <p>{fraisExpeditionGlobal.toFixed(2)} TDN</p>
                        </div>
                        <div className="flex justify-between font-bold text-lg mt-4">
                            <p>Total facture</p>
                            <p>{totalFacture.toFixed(2)} TDN</p>
                        </div>
                    </div>

                    <div className="flex justify-center mt-10 no-print">
                        <button
                            onClick={handlePrint}
                            className={`bg-green-600 text-white px-6 py-2 rounded-lg shadow-lg hover:bg-green-700 transition duration-300 ${!selectedClientData ? 'opacity-50 cursor-not-allowed' : ''}`}
                            disabled={!selectedClientData} 
                        >
                            Imprimer
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
