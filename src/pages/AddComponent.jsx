import React, { useState } from 'react';
import Sidebar from '../components/Sidebarr'; 
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';
import { FaPlus, FaBarcode, FaLaptop, FaDollarSign } from 'react-icons/fa';

const AddComponent = () => {
    const navigate = useNavigate();

    const [newComponent, setNewComponent] = useState({
        code: '',
        nom: '',
        marque: '',
        prixAchat: '',
        prixVenteHT: '',
        prixVenteTTC: '',
        tarifHoraire: ''
    });

    const [error, setError] = useState('');

    const addComponent = () => {
        const isEmpty = Object.values(newComponent).some(value => value === '');
        if (isEmpty) {
            setError('Tous les champs sont obligatoires.');
            return;
        }

        console.log('Component added:', newComponent);
        setNewComponent({ code: '', nom: '', marque: '', prixAchat: '', prixVenteHT: '', prixVenteTTC: '', tarifHoraire: '' });
        setError('');
        navigate('/catalogue');
    };

    const handleLogout = () => {
        localStorage.removeItem('token'); 
        navigate('/');
    };

    return (
        <div className="flex min-h-screen">
            <Sidebar />
            <main className="flex-1 p-8 bg-gray-100 ml-64">
                <header className="flex justify-between items-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-700">Ajouter une Pièce</h2>
                    <button 
                        onClick={handleLogout} 
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-700 transition duration-300"
                    >
                        Déconnexion
                    </button>
                </header>

                <div className="bg-white rounded-lg shadow-lg p-8">
                    <h3 className="text-xl font-semibold text-gray-800 mb-6">Ajouter une Nouvelle Pièce</h3>
                    {error && <p className="text-red-500 mb-4 font-medium">{error}</p>}

                    {/* Form Fields */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {['code', 'nom', 'marque', 'prixAchat', 'prixVenteHT', 'prixVenteTTC', 'tarifHoraire'].map((field, index) => (
                            <div className="relative" key={index}>
                                {field === 'code' && <FaBarcode className="absolute top-3 left-3 text-gray-400" />}
                                {field === 'nom' && <FaLaptop className="absolute top-3 left-3 text-gray-400" />}
                                {field === 'marque' && <FaLaptop className="absolute top-3 left-3 text-gray-400" />}
                                {['prixAchat', 'prixVenteHT', 'prixVenteTTC', 'tarifHoraire'].includes(field) && <FaDollarSign className="absolute top-3 left-3 text-gray-400" />}
                                
                                <input
                                    type={field.includes('prix') || field === 'tarifHoraire' ? 'number' : 'text'}
                                    placeholder={`Entrer ${field.charAt(0).toUpperCase() + field.slice(1)}`}
                                    className="border border-gray-300 pl-10 p-2 w-full rounded-lg hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={newComponent[field]}
                                    onChange={(e) => setNewComponent({ ...newComponent, [field]: e.target.value })}
                                />
                            </div>
                        ))}
                    </div>

                    <div className="flex justify-center mt-8">
                        <button
                            onClick={addComponent}
                            className="flex items-center bg-green-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-green-700 transition duration-300 ease-in-out transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
                        >
                            <FaPlus className="mr-2" />
                            Ajouter une pièce
                        </button>
                    </div>
                </div>
                <br />
                <Footer />
            </main>
        </div>
    );
};

export default AddComponent;
