import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebarr';
import Footer from '../components/Footer';
import { FaClock, FaPlus, FaMinus } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Reparation = () => {
    const [demandesReparation, setDemandesReparation] = useState([]);
    const [selectedDemande, setSelectedDemande] = useState('');
    const [reparation, setReparation] = useState({
        nomclient: '',
        marque: '',
        modele: '',
        symptomesPanne: '',
        etat: '',
        heures: '',
        description: '',
        dateRep:'',
        
        //new Date().toISOString().split('T')[0]
        tarifMainOeuvre: 20.0,
        pieceRechange: [{ nom: '', marque: '' }],
    });
    const [error, setError] = useState('');
    const [piecesCatalogue, setPiecesCatalogue] = useState([]);
    const navigate = useNavigate();
    const [irrepairableDemandes, setIrrepairableDemandes] = useState([]);
    const [showPopup, setShowPopup] = useState(false);

    useEffect(() => {
        axios.get('http://localhost:8090/demandes-reparation1')
            .then((response) => {
                console.log('Réponse après récupération des demandes:', response.data); // Afficher les données récupérées
    
                const demandesValides = response.data.filter(demande => demande.etat !== 'Irréparable');
                setDemandesReparation(demandesValides);
                const irrepairable = response.data.filter(demande => demande.etat === 'Irréparable');
                setIrrepairableDemandes(irrepairable);
                // Sélectionner la première demande valide
                if (demandesValides.length > 0) {
                    setSelectedDemande(demandesValides[0].id);
                }
                
            })
            .catch((error) => {
                console.error('Erreur lors de la récupération des demandes de réparation', error);
            });
    }, []); // Cet effet ne s'exécute qu'une seule fois lors du montage du composant
    const filteredPiecesByName = (name) => {
        return piecesCatalogue.filter((piece) => piece.nom === name);
    };
     // Fetching piece catalog
    useEffect(() => {
        axios.get('http://localhost:8090/pieces-rechange')
            .then((response) => {
                console.log('Data retrieved from pieces-rechange API:', response.data); // Logging the data
          
                setPiecesCatalogue(response.data);
                
            })
            .catch((error) => {
                console.error('Erreur lors de la récupération des pièces de rechange', error);
                
            });
    }, []);
    useEffect(() => {
        if (selectedDemande) {
            const selected = demandesReparation.find(demande => demande.id === selectedDemande);
            if (selected) {
                setReparation({
                    nomclient: selected.client.nom || '',
                    marque: selected.appareil.marque || '',
                    modele: selected.appareil.modele || '',
                    symptomesPanne: selected.appareil.symptomesPanne || '',
                    etat: selected.etat || '',
                    heures: '',
                    description: '',
                    dateRep: selected.dateRep || new Date().toISOString().split('T')[0],
                    tarifMainOeuvre: 20.0,
                    pieceRechange: {
                        nom: selected.pieceRechange?.nom || '',
                        marque: selected.pieceRechange?.marque || '',
                    },
                });
            }
        }
    }, [selectedDemande, demandesReparation]);
    const handleSelectChange = (event) => {
        const demandeId = Number(event.target.value);
        setSelectedDemande(demandeId);
    };

    const addPiece = () => {
        setReparation({
            ...reparation,
            pieceRechange: [...reparation.pieceRechange, { nom: '', marque: '' }],
        });
    };

    const removePiece = () => {
        if (reparation.pieceRechange.length > 1) {
            setReparation({
                ...reparation,
                pieceRechange: reparation.pieceRechange.slice(0, -1),
            });
        }
    };

    const handlePieceChange = (index, field, value) => {
        const updatedPieces = [...reparation.pieceRechange];
        updatedPieces[index][field] = value;

        if (field === 'nom') {
            const selectedPiece = piecesCatalogue.find(piece => piece.nom === value);
            if (selectedPiece) {
                updatedPieces[index].marque = selectedPiece.marque || '';
            }
        }

        setReparation({ ...reparation, pieceRechange: updatedPieces });
    };
    const ajouterReparation = () => {
        // Validation des champs obligatoires
        if (
            !selectedDemande ||
            !reparation.heures ||
            !reparation.description ||
            !reparation.tarifMainOeuvre ||
            !reparation.pieceRechange.nom
        ) {
            setError('Tous les champs sont requis.');
            return;
        }
    
        // Trouver la pièce de rechange correspondante
        const selectedPiece = piecesCatalogue.find(
            (p) => p.nom === reparation.pieceRechange.nom
        );
    
        if (!selectedPiece) {
            setError('La pièce de rechange sélectionnée est invalide.');
            return;
        }
    
        // Préparer les données pour l'API
        const reparationData = {
            description: reparation.description,
            tarifHMO: parseFloat(reparation.tarifMainOeuvre),
            tempsMO: parseFloat(reparation.heures),
            demandeReparation: { id: selectedDemande }, // ID dynamique
            pieceRechange: { id: selectedPiece.id },    // ID dynamique
            dateRep: new Date().toISOString().split('T')[0], // Date au format AAAA-MM-JJ
        };
    
        console.log("Données envoyées pour l'ajout de la réparation :", reparationData);
    
        // Envoyer la requête POST avec axios
        axios
            .post(`http://localhost:8090/reparation/associate/${selectedDemande}`, reparationData)
            .then((response) => {
                const reparationAjoutee = response.data;
    
                // Afficher un message de succès
                // alert(`Réparation ajoutée avec succès :
                //     ID: ${reparationAjoutee.id}
                //     Description: ${reparationAjoutee.description}
                //     Tarif Main d'Oeuvre: ${reparationAjoutee.tarifHMO} TND
                //     Temps Main d'Oeuvre: ${reparationAjoutee.tempsMO} heures
                //     Date de Réparation: ${reparationAjoutee.dateRep}
                //     Demande Associée: 
                //         - ID: ${reparationAjoutee.demandeReparation.id}
                //         - État: ${reparationAjoutee.demandeReparation.etat}
                //         - Symptômes: ${reparationAjoutee.demandeReparation.symptomesPanne}
                //     Pièce de Rechange:
                //         - Nom: ${reparationAjoutee.pieceRechange.nom}
                //         - Marque: ${reparationAjoutee.pieceRechange.marque}
                //         - Code: ${reparationAjoutee.pieceRechange.code}
                // `);
    
                // Rediriger l'utilisateur
                navigate('/listerep');
            })
            .catch((error) => {
                console.error("Erreur lors de l'ajout de la réparation", error);
                setError(error.response?.data?.error || "Une erreur réseau est survenue.");
            });
    };
    
   // Lorsque l'utilisateur change l'état de la réparation
const handleEtatChange = (e) => {
    const newEtat = e.target.value;
    setReparation({ ...reparation, etat: newEtat });

    // Mettre à jour l'état dans la base de données
    axios.put(`http://localhost:8090/demande-reparation3/${selectedDemande}`, {
        etat: newEtat,
    })
        .then(response => {
            console.log('État de la réparation mis à jour avec succès');
            console.log('Données récupérées :', response.data); // Afficher les données de la réponse
            // Vous pouvez aussi afficher une notification ou gérer l'état du formulaire ici
        })
        .catch(error => {
            console.error('Erreur lors de la mise à jour de l\'état', error);
        });
};

const updateDemandeEtat = (demandeId) => {
    axios.put(`http://localhost:8090/demande-reparation3/${demandeId}`, {
        etat: 'Irréparable',
    })
        .then(() => {
            // Mise à jour de l'état des demandes irréparables après la mise à jour
            axios.get('http://localhost:8090/demandes-reparation1')
                .then((response) => {
                    console.log('Réponse après récupération des demandes:', response.data); // Afficher les données récupérées

                    const demandesValides = response.data.filter(demande => demande.etat !== 'Irréparable');
                    setDemandesReparation(demandesValides);
                    const irrepairable = response.data.filter(demande => demande.etat === 'Irréparable');
                    setIrrepairableDemandes(irrepairable);

                    if (demandesValides.length > 0) {
                        setSelectedDemande(demandesValides[0].id);
                    } else {
                        setSelectedDemande(null);
                    }

                    // Affichage du popup après la mise à jour des demandes
                    setShowPopup(true);
                })
                .catch((error) => {
                    console.error('Erreur lors de la récupération des demandes de réparation', error);
                });
        })
        .catch((error) => {
            console.error('Erreur lors de la mise à jour de l\'état de la demande', error);
        });
};



    const handlePasserAUneAutreDemande = () => {
        if (reparation.etat === 'Irréparable') {
            updateDemandeEtat(selectedDemande);
            setShowPopup(true);
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
                    <h3 className="text-xl font-semibold mb-6 text-gray-700">
                        Sélectionner une Demande de Réparation
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="text-gray-700 font-medium mb-2 block">
                                Nom du Client
                            </label>
                            <select
                                className="border border-gray-300 p-3 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                                value={selectedDemande}
                                onChange={handleSelectChange}
                            >
                                <option value="">Sélectionnez un client</option>
                                {demandesReparation.map((demande) => (
                                    <option key={demande.id} value={demande.id}>
                                        {demande.client.nom}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="text-gray-700 font-medium mb-2 block">
                                État de la Réparation
                            </label>
                            <select
                                className="border border-gray-300 p-3 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                                // value={reparation.etat || ""}
                                onChange={handleEtatChange}                            >
                                <option value="" disabled selected>
                                    Changez l'état de la réparation (en cours)
                                </option>
                                {/* <option value="En cours">En cours</option> */}
                                <option value="Réparable">Réparable</option>
                                <option value="Irréparable">Irréparable</option>
                            </select>
                        </div>

                        <div>
                            <label className="text-gray-700 font-medium mb-2 block">
                                Marque de l'Ordinateur
                            </label>
                            <input
                                type="text"
                                className="border border-gray-300 p-3 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                                value={reparation.marque}
                                disabled
                            />
                        </div>

                        <div>
                            <label className="text-gray-700 font-medium mb-2 block">
                                Modèle de l'Ordinateur
                            </label>
                            <input
                                type="text"
                                className="border border-gray-300 p-3 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                                value={reparation.modele}
                                disabled
                            />
                        </div>

                        <div className="col-span-1 md:col-span-2">
                            <label className="text-gray-700 font-medium mb-2 block">
                                Symptômes de Panne
                            </label>
                            <textarea
                                className="border border-gray-300 p-3 w-full h-32 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                                value={demandesReparation.find(demande => demande.id === selectedDemande)?.symptomesPanne || ''}
                                disabled
                            />
                        </div>
                    </div>
                </div>

                {reparation.etat === 'Irréparable' && (
                    <div className="mt-6 text-center">
                        <button
                            onClick={handlePasserAUneAutreDemande}
                            className="flex items-center bg-red-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-red-700 transition duration-300 ease-in-out transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 mx-auto block"
                        >
                            Passer à une autre demande
                        </button>
                        <br></br>
                    </div>
                )}

                {reparation.etat !== 'Irréparable' && (
                    <div className="bg-white rounded-lg shadow-md p-8 mb-6 border border-gray-200">
                        <h3 className="text-xl font-semibold mb-6 text-gray-700">Ajouter une Réparation</h3>
                        {error && <p className="text-red-500 mb-4">{error}</p>}

                        <div className="flex mb-5 space-x-4">
                            {/* Champ pour les heures */}
                            <div className="w-1/3">
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

                            {/* Champ pour le tarif de la main d'oeuvre */}
                            <div className="w-1/3">
                                <label className="text-gray-700 font-medium mb-2 block">Tarif Main d'Œuvre</label>
                                <div className="relative">
                                <input
                                type="text"
                                className="border border-gray-300 p-3 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                                value={reparation.tarifMainOeuvre}
                                disabled
                            />
                                </div>
                            </div>

                            {/* Champ pour la date de dépôt de l'appareil */}
                            <div className="w-1/3">
                                <label className="text-gray-700 font-medium mb-2 block">Date de Dépôt de l'Appareil</label>
                                <div className="relative">
                                <input
                                 type="date"
                                   className="border border-gray-300 p-3 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                                   value={reparation.dateRep || ''}
                                 onChange={(e) => setReparation({ ...reparation, dateRep: e.target.value })}
/>

                                </div>
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
                    <label className="text-gray-700 font-medium mb-2 block">Pièce Changée</label>
                    <div className="flex items-center">
                        <select
                            className="border border-gray-300 p-3 w-1/2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                            value={reparation.pieceRechange.nom}
                            onChange={(e) =>
                                setReparation({
                                    ...reparation,
                                    pieceRechange: { ...reparation.pieceRechange, nom: e.target.value },
                                })
                            }
                        >
                            <option value="">Sélectionner une pièce</option>
                            {[...new Set(piecesCatalogue.map(p => p.nom))].map((nom, index) => (
                                <option key={index} value={nom}>
                                    {nom}
                                </option>
                            ))}
                        </select>
                        <select
                            className="border border-gray-300 p-3 w-1/2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 ml-2"
                            value={reparation.pieceRechange.marque}
                            onChange={(e) =>
                                setReparation({
                                    ...reparation,
                                    pieceRechange: { ...reparation.pieceRechange, marque: e.target.value },
                                })
                            }
                        >
                            <option value="">Sélectionner une marque</option>
                            {filteredPiecesByName(reparation.pieceRechange.nom).map(p => (
                                <option key={`${p.id}-${p.marque}`} value={p.marque}>
                                    {p.marque}
                                </option>
                            ))}
                        </select>

                    </div>
                </div>



                        {showPopup && (
                            <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
                                <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
                                    <h3 className="text-xl font-semibold mb-4 text-red-600">Demandes Irréparables</h3>
                                    <ul className="space-y-2">
                                        {irrepairableDemandes.map((demande) => (
                                            <li key={demande.id} className="text-gray-800">
                                                {demande.client.nom} - {demande.appareil.marque} - {demande.appareil.modele}
                                            </li>
                                        ))}
                                    </ul>
                                    <div className="mt-4 text-center">
                                        <button
                                            onClick={() => setShowPopup(false)}  // Close the popup
                                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                                        >
                                            Fermer
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}



                        <div className="flex justify-center mt-8">
                            <button
                                onClick={ajouterReparation}
                                className="flex items-center bg-green-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-green-700 transition duration-300 ease-in-out transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 mx-auto block"
                            >
                                <FaPlus className="inline-block mr-2" />
                                Ajouter la Réparation
                            </button>

                        </div>
                    </div>
                )}
                <Footer />

            </main>
        </div>
    );
};

export default Reparation;
