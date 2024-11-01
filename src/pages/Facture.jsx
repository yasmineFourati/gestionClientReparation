import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebarr';
import Footer from '../components/Footer';
import { useLocation, useNavigate } from 'react-router-dom';

const clientsData = [
    { 
        id: 1, 
        name: 'Yasmine', 
        reparations: [
            { id: 'R001', clientName: 'Yasmine', clientAddress: 'Matar', description: 'Ordinateur Portable', prixUnitaire: 1500, quantite: 2 },
            { id: 'R002', clientName: 'Yasmine', clientAddress: 'Taniour', description: 'Imprimante', prixUnitaire: 2000, quantite: 1 }
        ] 
    },
    { 
        id: 2, 
        name: 'Baya', 
        reparations: [
            { id: 'R003', clientName: 'Baya', clientAddress: 'Soukra', description: 'Ordinateur de Bureau', prixUnitaire: 1200, quantite: 3 }
        ] 
    },
];

const calculateAmounts = (quantite, prixUnitaire, avecLivraison) => {
    const sousTotal = quantite * prixUnitaire;
    const taxe = sousTotal * 0.2; 
    const fraisExpedition = avecLivraison ? 15 : 0; 
    const total = sousTotal + taxe + fraisExpedition;

    return { sousTotal, taxe, fraisExpedition, total };
};

const Facture = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [selectedClient, setSelectedClient] = useState('');
    const [reparation, setReparation] = useState(null);
    const [quantite, setQuantite] = useState(1);
    const [avecLivraison, setAvecLivraison] = useState(false);

    useEffect(() => {
        if (selectedClient) {
            const client = clientsData.find(client => client.name === selectedClient);
            setReparation(client?.reparations[0]);
            setQuantite(client?.reparations[0]?.quantite || 1);
        } else {
            setReparation(null);
        }
    }, [selectedClient]);

    const handlePrint = () => {
        if (!reparation) {
            alert('Veuillez sélectionner un client et une réparation avant d\'imprimer.');
            return; // Prevent printing if there is no reparation
        }
        window.print();
    };

    const handleLogout = () => {
        navigate('/'); 
    };

    const prixUnitaire = reparation?.prixUnitaire || 0;
    const { sousTotal, taxe, fraisExpedition, total } = calculateAmounts(quantite, prixUnitaire, avecLivraison);

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
                        onClick={handleLogout} 
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-blue-700 transition duration-300"
                    >
                        Déconnexion
                    </button>
                </div>

                <div className="bg-white shadow-md rounded-lg p-8 max-w-4xl mx-auto">
                    <h1 className="text-3xl font-bold text-center mb-8">Facture #{reparation?.id || '0001'}</h1>

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

                        {reparation && (
                            <div className="text-gray-700">
                                <p>Date: {new Date().toLocaleDateString()}</p>
                                <p>À: {reparation.clientName}</p>
                                <p>Adresse: {reparation.clientAddress}</p>
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
                                <th className="border px-4 py-2">Quantité</th>
                                <th className="border px-4 py-2">Description</th>
                                <th className="border px-4 py-2">Prix unitaire</th>
                                <th className="border px-4 py-2">Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {reparation && (
                                <tr className="border-t">
                                    <td className="border px-4 py-2">
                                        <input
                                            type="number"
                                            value={quantite}
                                            onChange={(e) => setQuantite(Math.max(1, e.target.value))}
                                            className="border rounded p-1"
                                            min="1"
                                        />
                                    </td>
                                    <td className="border px-4 py-2">{reparation.description}</td>
                                    <td className="border px-4 py-2">{prixUnitaire} TDN</td>
                                    <td className="border px-4 py-2">{sousTotal.toFixed(2)} TDN</td>
                                </tr>
                            )}
                        </tbody>
                    </table>

                    <div className="text-gray-700 mb-8">
                        <div className="flex justify-between">
                            <p>Sous-total</p>
                            <p>{sousTotal.toFixed(2)} TDN</p>
                        </div>
                        <div className="flex justify-between">
                            <p>Taxe (20%)</p>
                            <p>{taxe.toFixed(2)} TDN</p>
                        </div>
                        <div className="flex justify-between">
                            <p>Frais de livraison</p>
                            <p>{fraisExpedition} TDN</p>
                        </div>
                        <div className="flex justify-between font-bold text-lg mt-4">
                            <p>Total</p>
                            <p>{total.toFixed(2)} TDN</p>
                        </div>
                    </div>

                    <div className="flex justify-center mt-10 no-print">
                        <button
                            onClick={handlePrint}
                            className={`bg-green-600 text-white px-6 py-2 rounded-lg shadow-lg hover:bg-green-700 transition duration-300 ${!reparation ? 'opacity-50 cursor-not-allowed' : ''}`}
                            disabled={!reparation} // Disable button if no reparation is selected
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
