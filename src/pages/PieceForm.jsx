import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const PieceForm = ({ partData }) => {
    const [form, setForm] = useState({
        code: partData?.code || '',
        nom: partData?.nom || '',
        marque: partData?.marque || '',
        prixAchat: partData?.prixAchat || '',
        prixVenteHT: partData?.prixVenteHT || '',
        prixVenteTTC: partData?.prixVenteTTC || '',
        tarifHoraire: partData?.tarifHoraire || ''
    });

    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (partData) {
            // Handle update logic here
            console.log('Updating part:', form);
        } else {
            // Handle add logic here
            console.log('Adding new part:', form);
        }
        navigate('/catalogue'); // Redirect to the catalogue page after submit
    };

    return (
        <div className="p-6 bg-white rounded shadow-md">
            <h2 className="text-xl font-bold mb-4">{partData ? 'Edit Part' : 'Add New Part'}</h2>
            <form onSubmit={handleSubmit}>
                {Object.keys(form).map((key) => (
                    <div className="mb-4" key={key}>
                        <label className="block text-gray-700">{key.charAt(0).toUpperCase() + key.slice(1)}</label>
                        <input
                            type="text"
                            name={key}
                            value={form[key]}
                            onChange={handleChange}
                            className="border border-gray-300 p-2 rounded w-full"
                        />
                    </div>
                ))}
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                    {partData ? 'Update Part' : 'Add Part'}
                </button>
            </form>
        </div>
    );
};

export default PieceForm;
