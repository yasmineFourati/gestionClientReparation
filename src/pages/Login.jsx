import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

const Login = () => {
  const [credentials, setCredentials] = useState({ username: '', password: '' }); 
  const [error, setError] = useState(''); 
  const [loading, setLoading] = useState(false); 
  const [passwordVisible, setPasswordVisible] = useState(false); 
  const navigate = useNavigate();
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); 
    setLoading(true); 

    try {
      const response = await axios.post('http://localhost:8090/api/login', null, {
        params: {
          username: credentials.username,
          motDePasse: credentials.password,
        },
      });

      console.log('Login response:', response); 

      // If the response contains a role, save it and navigate
      if (response.data.role) {
        console.log('Role found:', response.data.role); // Log the role to ensure it's correct
        localStorage.setItem('role', response.data.role);
        localStorage.setItem('username', response.data.username); // Save username in localStorage
        navigate('/dashboard'); 
      } else {
        console.log('No role found in response'); // Log a message if no role is found
      }
    } catch (err) {
      // Handle errors
      console.error('Error during login:', err); // Log the error for debugging
      if (err.response && err.response.data) {
        setError(err.response.data.message || 'Login failed. Please check your username and password.');
      } else {
        setError('Unable to connect. Please try again later.');
      }
    } finally {
      setLoading(false); 
    }
  };

  return (
    <div
    className="flex items-center justify-center min-h-screen bg-cover bg-center"
    style={{ backgroundImage: "url('/pexels-fauxels-3183188.jpg')" }}  >
  
      <div className="w-full max-w-md bg-white bg-opacity-80 rounded-lg shadow-lg p-8">
        <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-blue-900 shadow-lg text-center mb-5">RepAppBuro</h1>
        </div>
        
        {/* Display error messages */}
        {error && <p className="text-red-500 text-center mb-4" aria-live="assertive">{error}</p>}

        <form onSubmit={handleSubmit}>
          {/* Username input */}
          <div className="mb-6">
            <label className="block text-gray-600 text-sm font-medium mb-2" htmlFor="username">
              Nom d'utilisateur
            </label>
            <input
              type="text"
              id="username"
              name="username"
              placeholder="Entrez votre nom d'utilisateur"
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 ease-in-out"
              value={credentials.username}
              onChange={handleChange}
              required
            />
          </div>

          {/* Password input */}
          <div className="mb-6 relative">
            <label className="block text-gray-600 text-sm font-medium mb-2" htmlFor="password">
              Mot de passe
            </label>
            <input
              type={passwordVisible ? 'text' : 'password'}
              id="password"
              name="password"
              placeholder="Entrez votre mot de passe"
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 ease-in-out"
              value={credentials.password}
              onChange={handleChange}
              required
            />
            {/* Password visibility toggle */}
            <button
              type="button"
              className="absolute right-3 top-10 text-gray-500"
              onClick={() => setPasswordVisible(!passwordVisible)}
              aria-label={passwordVisible ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
            >
              <FontAwesomeIcon icon={passwordVisible ? faEyeSlash : faEye} />
            </button>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            className={`w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition duration-200 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={loading}
          >
            {loading ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
